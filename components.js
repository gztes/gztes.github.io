/* Interactive project visuals: each one demonstrates what the project does.
   Every component builds itself into a container that already holds a static fallback. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function css(name, node) { return getComputedStyle(node || document.documentElement).getPropertyValue(name).trim(); }
  function whenVisible(node, fn) {
    if (!('IntersectionObserver' in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '200px' });
    io.observe(node);
  }

  /* =====================================================================
     UniBridge: a dotted globe. Proposed routes only; nothing here implies visits have run.
     ===================================================================== */
  var CITIES = [
    { id: 'shanghai', name: 'Shanghai', lat: 31.23, lon: 121.47, role: 'Origin (proposed)', text: 'High-school students and their families, choosing a UK degree from the other side of the world.' },
    { id: 'taipei', name: 'Taipei', lat: 25.03, lon: 121.57, role: 'Origin (proposed)', text: 'The same question from Taiwan: which university, which programme, and what is it actually like?' },
    { id: 'london', name: 'London', lat: 51.51, lon: -0.13, role: 'Destination (proposed)', text: 'A campus visit: tours, time with current students, programme presentations. A pilot is being explored; no visits have run yet.' }
  ];
  function initGlobe(host) {
    if (!window.LAND_DOTS) return;
    host.innerHTML = '';
    host.classList.add('globe-on');
    var canvas = el('canvas'); canvas.setAttribute('aria-hidden', 'true');
    var info = el('div', 'g-info'); info.setAttribute('aria-live', 'polite');
    var pick = el('div', 'g-pick'); pick.setAttribute('role', 'group'); pick.setAttribute('aria-label', 'Choose a city');
    var status = el('p', 'g-status', 'Proposed programme · no visits have run yet');
    host.appendChild(canvas); host.appendChild(status); host.appendChild(info); host.appendChild(pick);
    var D = window.LAND_DOTS, N = D.length / 2;
    var R = 1, W = 1, H = 1, dpr = Math.min(2, window.devicePixelRatio || 1);
    var lon0 = 62, lat0 = 28, target = null, sel = 'london', drag = null, t0 = performance.now(), hover = null;
    var rad = Math.PI / 180;

    CITIES.forEach(function (c) {
      var b = el('button', 'g-city', c.name); b.type = 'button'; b.dataset.id = c.id;
      b.addEventListener('click', function () { select(c.id, true); });
      pick.appendChild(b);
    });
    function select(id, rotate) {
      sel = id;
      var c = CITIES.filter(function (x) { return x.id === id; })[0];
      info.innerHTML = '<span>' + c.role + '</span><strong>' + c.name + '</strong><p>' + c.text + '</p>';
      $$('.g-city', pick).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id ? 'true' : 'false'); });
      if (rotate) target = { lon: c.id === 'london' ? 30 : 95, lat: c.id === 'london' ? 38 : 26 };
    }
    select('london', false);

    function size() {
      var r = host.getBoundingClientRect();
      W = Math.max(200, r.width); H = Math.max(200, r.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      R = Math.min(W, H) * 0.4;
    }
    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(host);

    function proj(lat, lon, lift) {
      var p = lat * rad, l = (lon - lon0) * rad, p0 = lat0 * rad;
      var cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
      var k = R * (lift || 1);
      return { x: W / 2 + k * Math.cos(p) * Math.sin(l), y: H / 2 - k * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)), v: cosc };
    }
    function vec(lat, lon) { var p = lat * rad, l = lon * rad; return [Math.cos(p) * Math.cos(l), Math.sin(p), Math.cos(p) * Math.sin(l)]; }
    function toLL(v) { return [Math.asin(Math.max(-1, Math.min(1, v[1]))) / rad, Math.atan2(v[2], v[0]) / rad]; }
    function slerp(a, b, t) {
      var d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
      var s = Math.sin(d), wa = Math.sin((1 - t) * d) / s, wb = Math.sin(t * d) / s;
      return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
    }
    var london = CITIES[2];
    var routes = [CITIES[0], CITIES[1]].map(function (c) {
      var a = vec(c.lat, c.lon), b = vec(london.lat, london.lon), pts = [];
      for (var i = 0; i <= 64; i++) { var t = i / 64; pts.push({ ll: toLL(slerp(a, b, t)), lift: 1 + 0.16 * Math.sin(Math.PI * t) }); }
      return pts;
    });

    var ctx = canvas.getContext('2d');
    function frame(now) {
      var fg = css('--fg', host) || '#1c1a16', acc = css('--accent', host) || '#2b45c9', line = css('--line', host) || '#ddd5c5', paper = css('--paper', host) || '#fbf8f1';
      if (target) {
        lon0 += (target.lon - lon0) * 0.08; lat0 += (target.lat - lat0) * 0.08;
        if (Math.abs(target.lon - lon0) < 0.1 && Math.abs(target.lat - lat0) < 0.1) target = null;
      } else if (!drag && !reduced) lon0 += 0.03;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, Math.PI * 2);
      ctx.fillStyle = paper; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke();
      for (var i = 0; i < N; i++) {
        var q = proj(D[i * 2], D[i * 2 + 1]);
        if (q.v <= 0) continue;
        ctx.globalAlpha = 0.25 + 0.6 * q.v;
        ctx.fillStyle = fg;
        ctx.fillRect(q.x - 0.9, q.y - 0.9, 1.8, 1.8);
      }
      ctx.globalAlpha = 1;
      var phase = reduced ? 0 : ((((now - t0) / 2600) % 1) + 1) % 1;
      routes.forEach(function (pts, ri) {
        ctx.beginPath(); var started = false;
        pts.forEach(function (p) {
          var q = proj(p.ll[0], p.ll[1], p.lift);
          if (q.v < -0.25) { started = false; return; }
          if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
        });
        ctx.strokeStyle = acc; ctx.lineWidth = 1.8; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
        var k = Math.floor(((phase + ri * 0.5) % 1) * (pts.length - 1)), m = pts[k], qm = proj(m.ll[0], m.ll[1], m.lift);
        if (qm.v > -0.25 && !reduced) { ctx.beginPath(); ctx.arc(qm.x, qm.y, 3, 0, Math.PI * 2); ctx.fillStyle = acc; ctx.fill(); }
      });
      CITIES.forEach(function (c) {
        var q = proj(c.lat, c.lon); c._q = q;
        if (q.v <= 0) return;
        var on = sel === c.id || hover === c.id;
        ctx.beginPath(); ctx.arc(q.x, q.y, on ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = c.id === 'london' ? acc : paper; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = c.id === 'london' ? acc : fg; ctx.stroke();
        ctx.font = (on ? '600 ' : '500 ') + '12px "JetBrains Mono", monospace';
        ctx.fillStyle = fg; ctx.textAlign = c.id === 'taipei' ? 'left' : 'left';
        ctx.fillText(c.name.toUpperCase(), q.x + 10, q.y + (c.id === 'taipei' ? 14 : -8));
      });
      if (!reduced || target || drag) requestAnimationFrame(frame);
      else setTimeout(function () { requestAnimationFrame(frame); }, 400);
    }
    requestAnimationFrame(frame);

    function hit(e) {
      var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, best = null;
      CITIES.forEach(function (c) { if (c._q && c._q.v > 0 && Math.hypot(c._q.x - x, c._q.y - y) < 16) best = c.id; });
      return best;
    }
    canvas.addEventListener('pointerdown', function (e) {
      var h = hit(e); if (h) { select(h, false); return; }
      drag = { x: e.clientX, y: e.clientY, lon: lon0, lat: lat0 }; target = null;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (drag) {
        lon0 = drag.lon - (e.clientX - drag.x) * 0.35;
        lat0 = Math.max(-60, Math.min(70, drag.lat + (e.clientY - drag.y) * 0.25));
      } else { hover = hit(e); canvas.style.cursor = hover ? 'pointer' : 'grab'; }
    });
    function end() { drag = null; }
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  }

  /* =====================================================================
     Huddle: a small Windows desktop. Hold the hotkey (or the button) to get a suggestion.
     ===================================================================== */
  var CALLS = [
    { title: 'Discovery call', lines: [['Them', '00:41', 'We tried two tools like this last year. Neither stuck.'], ['You', '00:47', 'What made the team drop them?'], ['Them', '00:52', 'Honestly? Nobody remembered to open them.']],
      ask: 'how do I answer without pitching?', tip: 'Don’t pitch yet. Agree that’s the real problem, then ask what a tool would have to do on day one for people to actually use it.' },
    { title: 'Interview', lines: [['Them', '12:03', 'Tell me about a project that didn’t go to plan.'], ['You', '12:09', 'Sure. So, last spring…'], ['Them', '12:11', 'Take your time.']],
      ask: 'keep it short?', tip: 'One sentence on what went wrong, one on what you changed, then spend the rest on what you’d do differently now. Under a minute.' },
    { title: 'Client check-in', lines: [['Them', '03:15', 'Could the whole thing be ready by Friday?'], ['You', '03:20', 'Let me think about what’s realistic.'], ['Them', '03:24', 'Even a rough version would help.']],
      ask: 'how do I push back?', tip: 'Don’t say no yet. Ask which part matters most for Friday, offer that first, and agree a date for the rest.' }
  ];
  function initHuddle(host) {
    host.innerHTML =
      '<div class="hd-screen">' +
        '<div class="hd-win" aria-hidden="true"><div class="hd-bar"><span class="hd-title"></span><i></i><i></i><i></i></div>' +
          '<div class="hd-tiles"><div class="hd-tile"><span>Them</span></div><div class="hd-tile me"><span>You</span></div></div></div>' +
        '<div class="hd-overlay" aria-live="polite">' +
          '<div class="hd-head"><span class="hd-rec">Scripted demo</span><span>Huddle</span></div>' +
          '<div class="hd-lines"></div>' +
          '<div class="hd-ask"><kbd>Ctrl + Alt + H</kbd><span class="hd-q"></span></div>' +
          '<div class="hd-tip"><small>Suggestion</small><span class="hd-tip-t"></span></div>' +
        '</div>' +
        '<div class="hd-task" aria-hidden="true"><b></b><span class="hd-clock">09:41</span></div>' +
      '</div>' +
      '<div class="hd-controls">' +
        '<button type="button" class="btn sm solid hd-hold">Hold the hotkey</button>' +
        '<button type="button" class="btn sm hd-next">Next conversation</button>' +
        '<span class="hd-note">Or press Ctrl + Alt + H. A scripted example, not a live response.</span>' +
      '</div>';
    var idx = 0, timers = [], typing = false;
    var lines = $('.hd-lines', host), q = $('.hd-q', host), tip = $('.hd-tip-t', host), tipBox = $('.hd-tip', host), title = $('.hd-title', host), kbd = $('kbd', host), ov = $('.hd-overlay', host);
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function load(i) {
      clear(); idx = i; var c = CALLS[i];
      title.textContent = c.title + ' — call';
      lines.innerHTML = ''; q.textContent = ''; tip.textContent = ''; tipBox.classList.remove('on'); kbd.classList.remove('down');
      ov.classList.add('listening');
      c.lines.forEach(function (l, k) {
        timers.push(setTimeout(function () {
          var d = el('div', 'hd-ln', '<b>' + l[0] + '</b><i>' + l[1] + '</i>'); d.appendChild(document.createTextNode(l[2]));
          lines.appendChild(d);
        }, reduced ? 0 : 250 + k * 900));
      });
    }
    function suggest() {
      if (typing) return; var c = CALLS[idx];
      clear(); typing = true;
      if (lines.children.length < c.lines.length) { lines.innerHTML = ''; c.lines.forEach(function (l) { var d = el('div', 'hd-ln', '<b>' + l[0] + '</b><i>' + l[1] + '</i>'); d.appendChild(document.createTextNode(l[2])); lines.appendChild(d); }); }
      kbd.classList.add('down'); tipBox.classList.add('on');
      if (reduced) { q.textContent = c.ask; tip.textContent = c.tip; typing = false; kbd.classList.remove('down'); ov.classList.remove('listening'); return; }
      var i = 0, j = 0; q.textContent = ''; tip.textContent = '';
      (function typeQ() { i++; q.textContent = c.ask.slice(0, i); if (i < c.ask.length) timers.push(setTimeout(typeQ, 30)); else timers.push(setTimeout(typeT, 250)); })();
      function typeT() { j += 2; tip.textContent = c.tip.slice(0, j); if (j < c.tip.length) timers.push(setTimeout(typeT, 16)); else { typing = false; kbd.classList.remove('down'); ov.classList.remove('listening'); } }
    }
    $('.hd-hold', host).addEventListener('click', suggest);
    $('.hd-next', host).addEventListener('click', function () { typing = false; load((idx + 1) % CALLS.length); });
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.altKey && (e.key === 'h' || e.key === 'H')) {
        var r = host.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) { e.preventDefault(); suggest(); }
      }
    });
    whenVisible(host, function () { load(0); });
  }

  /* =====================================================================
     Clicky: follow the pointer. File, then Export, then PDF.
     ===================================================================== */
  function initClicky(host) {
    host.innerHTML =
      '<div class="ck-screen">' +
        '<div class="ck-win">' +
          '<div class="ck-menu" role="menubar" aria-label="Report.docx menu">' +
            '<div class="ck-m"><button type="button" data-step="file">File</button>' +
              '<div class="ck-drop" role="menu" hidden>' +
                '<button type="button" role="menuitem" data-wrong>New</button><button type="button" role="menuitem" data-wrong>Open…</button><button type="button" role="menuitem" data-wrong>Save</button>' +
                '<div class="ck-sub"><button type="button" role="menuitem" data-step="export">Export ▸</button>' +
                  '<div class="ck-drop ck-side" role="menu" hidden><button type="button" role="menuitem" data-step="pdf">PDF</button><button type="button" role="menuitem" data-wrong>PNG</button><button type="button" role="menuitem" data-wrong>Word</button></div></div>' +
                '<button type="button" role="menuitem" data-wrong>Print</button></div></div>' +
            '<div class="ck-m"><button type="button" data-wrong>Edit</button></div><div class="ck-m"><button type="button" data-wrong>View</button></div><div class="ck-m"><button type="button" data-wrong>Help</button></div>' +
            '<span class="ck-doc">Report.docx</span>' +
          '</div>' +
          '<div class="ck-page" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="ck-toast" hidden>Saved Report.pdf</div>' +
        '</div>' +
        '<svg class="ck-ptr" viewBox="0 0 26 26" aria-hidden="true"><path d="M3 2 L22 12 L13 14 L9 23 Z" fill="#3b82f6" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
        '<div class="ck-bub" aria-live="polite"></div>' +
      '</div>' +
      '<div class="ck-controls"><button type="button" class="btn sm ck-reset">Start again</button><span class="ck-note">Try it: follow the blue pointer. A recreation of how Clicky guides you.</span></div>';
    var screen = $('.ck-screen', host), ptr = $('.ck-ptr', host), bub = $('.ck-bub', host);
    var drop = $('.ck-drop', host), side = $('.ck-side', host), toast = $('.ck-toast', host);
    var step = 'file';
    var SAY = { file: 'Want this as a PDF? Click File.', export: 'Now Export.', pdf: 'And PDF.', done: 'Done. That’s Clicky: it sees your screen, talks you through it and points.' };
    function aim(node) {
      var s = screen.getBoundingClientRect(), r = node.getBoundingClientRect();
      var x = r.left - s.left + r.width * 0.55, y = r.top - s.top + r.height * 0.6;
      ptr.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      var bx = Math.min(Math.max(8, x + 22), s.width - 230), by = Math.min(y + 26, s.height - 64);
      bub.style.transform = 'translate(' + bx + 'px,' + by + 'px)';
      $$('.ck-target', host).forEach(function (n) { n.classList.remove('ck-target'); });
      node.classList.add('ck-target');
    }
    function go(s) {
      step = s; bub.textContent = SAY[s];
      if (s === 'file') { drop.hidden = true; side.hidden = true; toast.hidden = true; aim($('[data-step=file]', host)); }
      if (s === 'export') { drop.hidden = false; aim($('[data-step=export]', host)); }
      if (s === 'pdf') { side.hidden = false; aim($('[data-step=pdf]', host)); }
      if (s === 'done') { drop.hidden = true; side.hidden = true; toast.hidden = false; aim(toast); }
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !host.contains(b)) return;
      if (b.classList.contains('ck-reset')) { go('file'); return; }
      var s = b.getAttribute('data-step');
      if (s === step) { go(step === 'file' ? 'export' : step === 'export' ? 'pdf' : 'done'); return; }
      if (b.hasAttribute('data-wrong') || s) { bub.textContent = 'Not quite. It’s where I’m pointing.'; ptr.classList.remove('nudge'); void ptr.offsetWidth; ptr.classList.add('nudge'); }
    });
    whenVisible(host, function () { setTimeout(function () { go('file'); }, reduced ? 0 : 300); });
    window.addEventListener('resize', function () { var t = $('.ck-target', host); if (t) aim(t); });
  }

  /* =====================================================================
     Entrepreneurship Bites: a film strip. Drawn frames until real stills are added.
     ===================================================================== */
  function initFilm(host) {
    var strip = $('.fs-strip', host); if (!strip) return;
    if (!reduced) strip.classList.add('rolling');
  }

  $$('[data-globe]').forEach(function (h) { whenVisible(h, function () { initGlobe(h); }); });
  $$('[data-huddle]').forEach(initHuddle);
  $$('[data-clicky]').forEach(initClicky);
  $$('[data-film]').forEach(initFilm);
})();
