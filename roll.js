/* The roll: open any frame under the loupe, step through frames, copy the email, play the Loop film only on screen. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- loupe ---------- */
  var dlg = document.getElementById('loupe');
  var frames = Array.prototype.slice.call(document.querySelectorAll('.frame[data-f]'));
  if (dlg && frames.length) {
    var img = document.getElementById('l-img'), kick = document.getElementById('l-kicker'), title = document.getElementById('l-title'), body = document.getElementById('l-body'), count = document.getElementById('l-count');
    var idx = 0, opener = null;
    function show(i) {
      idx = (i + frames.length) % frames.length;
      var f = frames[idx], t = document.getElementById('t-' + f.dataset.f);
      img.innerHTML = '';
      var src = f.querySelector('img');
      if (src) { var big = src.cloneNode(); big.alt = f.getAttribute('aria-label').replace(/^Frame \d+: /, ''); img.appendChild(big); }
      else { var s = f.querySelector('.slate').cloneNode(true); img.appendChild(s); }
      var frag = t.content.cloneNode(true);
      kick.textContent = frag.querySelector('.kick').textContent;
      title.textContent = frag.querySelector('h2').textContent;
      frag.querySelector('.kick').remove(); frag.querySelector('h2').remove();
      body.innerHTML = ''; body.appendChild(frag);
      count.textContent = 'Frame ' + (idx + 1) + ' of ' + frames.length;
    }
    function open(i, from) {
      opener = from || null; show(i);
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true });
    }
    function close() { if (dlg.open) dlg.close(); }
    dlg.addEventListener('close', function () { if (opener) opener.focus({ preventScroll: true }); });
    frames.forEach(function (f, i) { f.addEventListener('click', function () { open(i, f); }); });
    document.getElementById('l-prev').addEventListener('click', function () { show(idx - 1); });
    document.getElementById('l-next').addEventListener('click', function () { show(idx + 1); });
    document.getElementById('l-close').addEventListener('click', close);
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) { close(); return; }            // click on the backdrop
      var a = e.target.closest('a[data-close]');
      if (a) { opener = null; close(); }                     // in-page jump: close first, let the link scroll
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    });
  }

  /* ---------- copy the email ---------- */
  var copy = document.getElementById('copy'), addr = document.getElementById('addr');
  if (copy && addr) copy.addEventListener('click', function () {
    var text = addr.textContent.trim();
    function selectIt() { var r = document.createRange(); r.selectNodeContents(addr); var s = getSelection(); s.removeAllRanges(); s.addRange(r); copy.textContent = 'Selected: press Ctrl+C'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1800); }, selectIt);
    } else selectIt();
  });

  /* ---------- Loop film: plays only while on screen ---------- */
  var vid = document.getElementById('loop-video');
  if (vid) {
    if (reduced || !('IntersectionObserver' in window)) vid.setAttribute('controls', '');
    else new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { vid.preload = 'auto'; var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
        else vid.pause();
      });
    }, { threshold: 0.35 }).observe(vid);
  }
})();
