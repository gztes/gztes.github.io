/* Gonzague Teisseire: shared behaviour. Everything here is progressive: without JS the page is complete. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function onView(els, fn, opts) {
    if (!hasIO) { els.forEach(function (el) { fn(el, true); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { fn(e.target, e.isIntersecting, io); });
    }, opts || { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* reveals and thread drawing (once) */
  // stretched SVGs use non-scaling strokes, whose dashes are measured in screen pixels
  all('.thread path').forEach(function (p) {
    if (p.getAttribute('vector-effect') === 'non-scaling-stroke') p.style.setProperty('--len', '1400');
    else { p.setAttribute('pathLength', '1'); p.style.setProperty('--len', '1'); }
  });
  // reveal on entry, and also anything already scrolled past (jump links, fast scrolls)
  onView(all('.rv, .thread.draw'), function (el, inView, io) {
    if (inView || el.getBoundingClientRect().top < 0) { el.classList.add('in'); if (io) io.unobserve(el); }
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  /* Loop film: only plays while on screen */
  var vid = document.getElementById('loop-video');
  if (vid) {
    if (reduced) { vid.removeAttribute('autoplay'); vid.setAttribute('controls', ''); }
    else onView([vid], function (el, inView) {
      if (inView) { el.preload = 'auto'; var p = el.play(); if (p && p.catch) p.catch(function () {}); }
      else el.pause();
    }, { threshold: 0.35 });
  }

  /* inquiry form: composes an email in the visitor's own mail app; nothing is sent from here */
  var inq = document.getElementById('inquiry');
  if (inq) inq.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = inq.elements, name = f.name.value.trim(), kind = f.kind.value, msg = f.msg.value.trim();
    var subject = kind + (name ? ' \u2014 from ' + name : '');
    var body = (msg || '') + (name ? '\n\n' + name : '');
    window.location.href = 'mailto:gonzague.teisseire@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });


  /* ---------- the sky journey: colour follows scroll through [data-sky-stop] sections ---------- */
  (function () {
    var stops = all('[data-sky-stop]');
    if (!stops.length) return;
    var darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
    var PAL = {
      light: {
        day: ['#b9cff0', '#dbe5f4', '#f3ead9'], dusk: ['#c9b8e2', '#f2c9b2', '#f6e2cc'],
        morning: ['#dbe7f6', '#ecf0f6', '#f6f1e7'], afternoon: ['#f1e2d4', '#f6ece1', '#f9f3ea'],
        golden: ['#f1d1bc', '#f5e0cd', '#f8ebdd'], twilight: ['#b7aedb', '#e2c5cf', '#f0dccf']
      },
      dark: {
        night: ['#0f1430', '#232a4f', '#3a3552'], morning: ['#111731', '#19203e', '#1e2442'],
        afternoon: ['#141a34', '#1c2141', '#221f3b'], golden: ['#1b1833', '#26203e', '#2d2339'], twilight: ['#0c1028', '#1a1d3d', '#2a2346']
      }
    };
    function isDark() { var th = document.documentElement.getAttribute('data-theme'); return th === 'dark' || (th !== 'light' && darkMQ.matches); }
    function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
    function mix(a, b, t) { var x = hex(a), y = hex(b); return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(x[i] + (y[i] - x[i]) * t); }).join(',') + ')'; }
    function palFor(name) {
      var dark = isDark(), P = dark ? PAL.dark : PAL.light;
      if (name === 'hero') {
        var w = document.getElementById('world'), s = w ? w.getAttribute('data-sky') : 'dusk';
        return dark ? P.night : (s === 'day' ? P.day : P.dusk);
      }
      return P[name] || P.morning;
    }
    var root = document.documentElement, ticking = false;
    function update() {
      ticking = false;
      var mid = window.scrollY + window.innerHeight * 0.45, pts = stops.map(function (el) { return { y: el.getBoundingClientRect().top + window.scrollY, n: el.getAttribute('data-sky-stop') }; });
      var a = pts[0], b = pts[0], t = 0;
      for (var i = 0; i < pts.length; i++) {
        if (mid >= pts[i].y) { a = pts[i]; b = pts[i + 1] || pts[i]; }
      }
      if (b !== a) t = Math.min(1, Math.max(0, (mid - a.y) / (b.y - a.y)));
      var pa = palFor(a.n), pb = palFor(b.n);
      root.style.setProperty('--s1', mix(pa[0], pb[0], t));
      root.style.setProperty('--s2', mix(pa[1], pb[1], t));
      root.style.setProperty('--s3', mix(pa[2], pb[2], t));
      var stars = isDark() ? 0.85 : (b.n === 'twilight' ? t * 0.7 : (a.n === 'twilight' ? 0.7 : 0));
      root.style.setProperty('--stars', stars.toFixed(2));
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    if (darkMQ.addEventListener) darkMQ.addEventListener('change', update);
    setTimeout(update, 0); update();
  })();

  /* ---------- flowers for any [data-flowers] field outside the hero ---------- */
  all('[data-flowers]').forEach(function (field) {
    var cols = ['#f2a07b', '#e9c46a', '#9db4e6', '#fbf8f1'];
    for (var i = 0; i < 18; i++) {
      var f = document.createElement('span');
      f.className = 'flower';
      f.style.left = ((i * 41 + (i % 4) * 9) % 100) + '%';
      f.style.bottom = (4 + (i * 7) % 18) + '%';
      f.style.setProperty('--h', (16 + (i * 5) % 14) + 'px');
      f.style.setProperty('--c', cols[i % cols.length]);
      field.appendChild(f);
    }
  });

  /* nav: mark the section in view */
  var links = all('.nav ul a[href^="#"]');
  if (links.length && hasIO) {
    var map = {};
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) map[s.id] = a; });
    var watch = Object.keys(map).map(function (id) { return document.getElementById(id); });
    ['top', 'proof', 'contact'].forEach(function (id) { var el = document.getElementById(id); if (el) watch.push(el); });
    onView(watch, function (el, inView) {
      if (!inView) return;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (map[el.id]) map[el.id].setAttribute('aria-current', 'true');
    }, { rootMargin: '-45% 0px -50% 0px' });
  }

  /* ---------- timeline ---------- */
  var host = document.getElementById('stream');
  var list = document.getElementById('tl-list');
  if (!host || !list) return;

  var CH = [
    { name: 'Foundations', s: '2022-08' },
    { name: 'Building products', s: '2025-05' },
    { name: 'Current chapter', s: '2026-09-20' }
  ];
  var EV = [
    { t: 'ESCP Business School', r: 'BSc Management, three years across Paris, Madrid and London.', s: '2022-08', e: '2025-06', k: 'study' },
    { t: 'Heka', r: 'First sales role: onboarding clients onto a benefits platform.', s: '2023-06', e: '2023-07', k: 'work' },
    { t: 'ACdO', r: 'First client project: brand strategy for a luxury furniture house.', s: '2024-01', e: '2024-04', k: 'work' },
    { t: 'HUB', r: 'AI competitor research and a 10,000-record CRM clean-up.', s: '2024-05', e: '2024-06', k: 'work' },
    { t: 'JET ESCP', r: 'Market research and outreach for ESCP’s consulting society.', s: '2024-11', e: '2025-06', k: 'work' },
    { t: 'Gentek.ai', r: 'Owned campaign strategy and execution at an AI start-up, London and Lisbon.', s: '2025-05', e: '2025-08', k: 'work' },
    { t: 'Imperial College Business School', r: 'MSc in entrepreneurship, and the year I started building my own things.', s: '2025-08', e: '2026-08', k: 'study' },
    { t: 'Entrepreneurship Bites', r: 'Co-founded the podcast; six founder interviews.', s: '2025-11', e: '2026-09', k: 'build' },
    { t: 'UniBridge', r: 'Co-founder, CTO and CPO.', s: '2026-01', e: null, k: 'build' },
    { t: 'Cosysense', r: 'Business model and pilot plan for a climate-tech start-up.', s: '2026-01', e: '2026-04', k: 'work' },
    { t: 'Perihelion and Geodrift', r: 'Two browser games in plain canvas.', s: '2026-07-02', e: '2026-07-02', k: 'build' },
    { t: 'Loop', r: 'Top three: app, site, film and pitch.', s: '2026-09-01', e: '2026-09-01', k: 'build' },
    { t: 'Clicky for Windows', r: 'Open-source rewrite of Farza’s Mac app.', s: '2026-09-07', e: '2026-09-07', k: 'build' },
    { t: 'Huddle', r: 'Solo build: a private call companion.', s: '2026-09-14', e: '2026-09-14', k: 'build' },
    { t: 'EDHEC Business School', r: 'MSc Sustainable Business Transformation, Lille.', s: '2026-09-20', e: null, k: 'study' }
  ];
  var NOW = '2026-11';
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function m(s) { var p = s.split('-'); return (+p[0]) * 12 + (+p[1] - 1) + (p[2] ? (+p[2] - 1) / 31 : 0); }
  function fmt(s) { var p = s.split('-'); return MON[+p[1] - 1] + ' ' + p[0]; }
  function range(e) { return e.e === e.s ? fmt(e.s) : fmt(e.s) + ' – ' + (e.e ? fmt(e.e) : 'now'); }
  var COL = { study: 'var(--fg)', work: 'var(--faint)', build: 'var(--accent)' };
  function chapterOf(e) { var c = CH[0]; CH.forEach(function (x) { if (m(e.s) >= m(x.s)) c = x; }); return c.name; }

  // phone and screen readers: a readable sequence by chapter
  CH.forEach(function (c) {
    var items = EV.filter(function (e) { return chapterOf(e) === c.name; });
    if (!items.length) return;
    var h = document.createElement('h3'); h.textContent = c.name; list.appendChild(h);
    var ol = document.createElement('ol');
    items.forEach(function (e) {
      var li = document.createElement('li');
      li.innerHTML = '<b></b><span></span><time></time>';
      li.querySelector('b').textContent = e.t;
      li.querySelector('span').textContent = e.r;
      li.querySelector('time').textContent = range(e);
      ol.appendChild(li);
    });
    list.appendChild(ol);
  });

  var NS = 'http://www.w3.org/2000/svg';
  function draw() {
    host.innerHTML = '';
    var W = host.clientWidth;
    if (!W || window.matchMedia('(max-width: 820px)').matches) return;
    var C = W / 2, start = m('2022-06'), end = m(NOW) + 2, TOP = 40;
    function y(mm) {
      var b = m('2025-04');
      if (mm <= b) return TOP + (mm - start) * 13;
      return TOP + (b - start) * 13 + (mm - b) * 36;
    }
    var H = y(end) + 30;
    var svg = document.createElementNS(NS, 'svg');
    host.appendChild(svg);
    function path(d, c, w, dash) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', c);
      p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round');
      if (dash) p.setAttribute('stroke-dasharray', dash);
      svg.appendChild(p); return p;
    }
    var spine = path('', 'var(--accent)', 1.6);

    CH.forEach(function (c) {
      var el = document.createElement('span');
      el.className = 'chap'; el.textContent = c.name;
      el.style.top = (y(m(c.s)) - 26) + 'px';
      host.appendChild(el);
    });
    for (var yr = 2023; yr <= 2026; yr++) {
      var t = document.createElement('span');
      t.className = 'yr'; t.textContent = yr;
      t.style.left = C + 'px'; t.style.top = y(yr * 12) + 'px';
      host.appendChild(t);
    }
    var nt = document.createElement('span');
    nt.className = 'yr nowtick'; nt.textContent = 'Now';
    nt.style.left = C + 'px'; nt.style.top = y(m(NOW)) + 'px';
    host.appendChild(nt);

    var sides = { l: [], r: [] }, lanes = { l: [], r: [] }, ongoing = [];
    var GAP = 26;
    EV.forEach(function (e) {
      var side = e.k === 'study' ? 'l' : 'r', dir = side === 'l' ? -1 : 1;
      var s = m(e.s), y0 = y(s);
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', 3.5); dot.setAttribute('fill', COL[e.k]);
      if (e.e === e.s) {
        var tx = C + dir * 16;
        path('M' + C + ' ' + y0 + ' H' + tx, COL[e.k], 2);
        dot.setAttribute('cx', tx); dot.setAttribute('cy', y0); svg.appendChild(dot);
        sides[side].push({ e: e, x: tx, y: y0 });
        return;
      }
      var en = e.e ? m(e.e) : end;
      var lane = 0;
      while (lanes[side][lane] !== undefined && lanes[side][lane] > s - 1) lane++;
      lanes[side][lane] = en;
      var x = C + dir * (30 + lane * GAP), y1 = y(en);
      var bend = Math.min(18, (y1 - y0) / 2.2);
      var d = 'M' + C + ' ' + y0 + ' C' + C + ' ' + (y0 + bend) + ' ' + x + ' ' + y0 + ' ' + x + ' ' + (y0 + bend);
      if (e.e) path(d + ' V' + (y1 - bend) + ' C' + x + ' ' + y1 + ' ' + C + ' ' + (y1 - bend) + ' ' + C + ' ' + y1, COL[e.k], e.k === 'work' ? 1.75 : 2.25);
      else ongoing.push({ p: path(d, COL[e.k], 2.25), base: d });
      dot.setAttribute('cx', x); dot.setAttribute('cy', y0 + bend); svg.appendChild(dot);
      sides[side].push({ e: e, x: x, y: y0 + bend });
    });

    var off = 30 + 2 * GAP + 30;
    ['l', 'r'].forEach(function (side) {
      var last = -1e9;
      sides[side].sort(function (a, b) { return a.y - b.y; }).forEach(function (o) {
        var el = document.createElement('div');
        el.className = 'ev ' + side;
        el.innerHTML = '<b></b><span></span><time></time>';
        el.querySelector('b').textContent = o.e.t;
        el.querySelector('span').textContent = o.e.r;
        el.querySelector('time').textContent = range(o.e);
        host.appendChild(el);
        var lx = side === 'l' ? C - off : C + off;
        if (side === 'l') el.style.right = (W - lx) + 'px'; else el.style.left = lx + 'px';
        var top = Math.max(o.y - 10, last + 14);
        last = top + el.offsetHeight;
        el.style.top = top + 'px';
        path('M' + o.x + ' ' + o.y + ' L' + (lx + (side === 'l' ? 6 : -6)) + ' ' + (top + 10), 'var(--line)', 1, '2 3');
      });
      if (last + 30 > H) H = last + 30;
    });
    host.style.height = H + 'px';
    spine.setAttribute('d', 'M' + C + ' ' + (TOP - 10) + ' V' + (H - 30));
    ongoing.forEach(function (o) { o.p.setAttribute('d', o.base + ' V' + (H - 30)); });
  }
  draw();
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(draw, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();
