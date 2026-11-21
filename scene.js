/* The world in the hero: sky follows the visitor's local time, the cursor nudges the scene,
   objects open small panels, and the prompt box routes a few phrases to set answers (no AI). */
(function () {
  var world = document.getElementById('world');
  if (!world) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dark = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- headline: words rise in once ---------- */
  var h1 = world.querySelector('h1');
  if (h1 && !reduced) {
    var k = 0;
    Array.prototype.slice.call(h1.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          var s = document.createElement('span'); s.className = 'w'; s.textContent = w; s.style.animationDelay = (k++ * 55) + 'ms'; frag.appendChild(s);
        });
        h1.replaceChild(frag, n);
      } else if (n.nodeType === 1) { n.classList.add('w'); n.style.animationDelay = (k++ * 55) + 'ms'; }
    });
    h1.classList.add('rise');
  }

  /* ---------- sky and sun ---------- */
  function setSky() {
    var h = new Date().getHours() + new Date().getMinutes() / 60;
    var theme = document.documentElement.getAttribute('data-theme');
    var isDark = theme === 'dark' || (theme !== 'light' && dark.matches);
    var sky = isDark ? 'night' : (h >= 7 && h < 17) ? 'day' : 'dusk';
    world.setAttribute('data-sky', sky);
    var sun = document.getElementById('sun');
    if (!sun) return;
    var t = Math.min(1, Math.max(0, (h - 6) / 14));
    if (sky === 'night' || h < 6 || h > 20) t = 0.82;
    sun.style.left = (52 + t * 40) + '%';
    sun.style.top = (34 - Math.sin(Math.PI * t) * 24) + '%';
  }
  setSky();
  if (dark.addEventListener) dark.addEventListener('change', setSky);

  /* ---------- flowers along the ground ---------- */
  var field = document.getElementById('flowers');
  if (field) {
    var cols = ['var(--f1)', 'var(--f2)', 'var(--f3)', 'var(--paper)'];
    for (var i = 0; i < 22; i++) {
      var f = document.createElement('span');
      f.className = 'flower';
      var x = (i * 37 + (i % 3) * 11) % 100;
      f.style.left = x + '%';
      f.style.bottom = (2 + ((i * 7) % 10)) + '%';
      f.style.setProperty('--h', (18 + (i * 5) % 16) + 'px');
      f.style.setProperty('--c', cols[i % cols.length]);
      f.style.setProperty('--d', (i % 5) * -0.7 + 's');
      field.appendChild(f);
    }
  }

  /* ---------- the cursor nudges the scene ---------- */
  if (!reduced) {
    var raf = 0, mx = 0, my = 0;
    world.addEventListener('pointermove', function (e) {
      var r = world.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(function () {
        world.style.setProperty('--mx', mx.toFixed(3));
        world.style.setProperty('--my', my.toFixed(3));
        raf = 0;
      });
    });
    world.addEventListener('pointerleave', function () {
      world.style.setProperty('--mx', 0); world.style.setProperty('--my', 0);
    });
  }

  /* ---------- panels ---------- */
  var P = {
    work: {
      kicker: 'The computer', title: 'What I’ve built',
      body: '<ul class="w-list">' +
        '<li><a href="work/huddle.html"><b>Huddle</b><span>A private call companion for Windows</span></a></li>' +
        '<li><a href="work/unibridge.html"><b>UniBridge</b><span>Campus visits for students from China and Taiwan</span></a></li>' +
        '<li><a href="work/loop.html"><b>Loop</b><span>App, site, film and pitch. Top three.</span></a></li>' +
        '<li><a href="https://github.com/gztes/clicky-windows" target="_blank" rel="noopener"><b>Clicky for Windows</b><span>Open-source rewrite of Farza’s Mac app</span></a></li>' +
        '</ul><a class="w-more" href="#work">See everything, with the evidence ↓</a>'
    },
    huddle: {
      kicker: 'Product', title: 'Huddle',
      body: '<p>Transcribes both sides of a call on my laptop. Hold a hotkey and it suggests what to say next. Audio never leaves the machine.</p><a class="btn sm solid" href="work/huddle.html">Read the case study →</a>'
    },
    unibridge: {
      kicker: 'Venture', title: 'UniBridge',
      body: '<p>Campus immersion visits for high-school students from China and Taiwan choosing a UK university. Early stage: exploring a pilot.</p><a class="btn sm solid" href="work/unibridge.html">Read the case study →</a>'
    },
    loop: {
      kicker: 'Creative direction', title: 'Loop',
      body: '<p>A wardrobe app that asks “should I buy this?” against the clothes you own. I built the app and the site, made the film, and pitched it. Top three.</p><a class="btn sm solid" href="work/loop.html">Read the case study →</a>'
    },
    comet: {
      kicker: 'Game', title: 'Perihelion',
      body: '<p>You’re a comet and you can’t steer. Hold to orbit a sun, let go to slingshot.</p><div class="w-row"><a class="btn sm solid" href="play/perihelion.html" target="_blank" rel="noopener">Play Perihelion</a><a class="btn sm" href="play/geodrift.html" target="_blank" rel="noopener">Play Geodrift</a></div>'
    },
    music: {
      kicker: 'Off the clock', title: 'Music',
      body: '<p>Production and DJ sets: what I do when I’m not building.</p><a class="btn sm solid" href="https://soundcloud.com/gonzague-teisseire" target="_blank" rel="noopener">Listen on SoundCloud ↗</a>'
    },
    podcast: {
      kicker: 'Media', title: 'Entrepreneurship Bites',
      body: '<p>The podcast I co-founded at Imperial: six serial entrepreneurs, asked how they really did it. Outreach, recording and the final cut.</p>'
    },
    clicky: {
      kicker: 'Open source', title: 'Clicky for Windows',
      body: '<p>Farza built Clicky for Mac. I rewrote it from scratch for Windows: it sees your screen, talks you through it and points.</p><a class="btn sm solid" href="https://github.com/gztes/clicky-windows" target="_blank" rel="noopener">View code ↗</a>'
    },
    creative: {
      kicker: 'Something creative', title: 'Things that keep me curious',
      body: '<ul class="w-list">' +
        '<li><a href="play/perihelion.html" target="_blank" rel="noopener"><b>Perihelion</b><span>A one-button comet game</span></a></li>' +
        '<li><a href="play/geodrift.html" target="_blank" rel="noopener"><b>Geodrift</b><span>Drift through the dark, gather twelve relics</span></a></li>' +
        '<li><a href="https://soundcloud.com/gonzague-teisseire" target="_blank" rel="noopener"><b>Music</b><span>Production and DJ sets</span></a></li>' +
        '<li><a href="work/loop.html"><b>The Loop film</b><span>43 seconds, made for a pitch</span></a></li>' +
        '</ul>'
    },
    about: {
      kicker: 'Hello', title: 'I’m Gonzague.',
      body: '<ol class="w-intro">' +
        '<li>French and British. I work in French, English and Spanish.</li>' +
        '<li>I studied business at ESCP across Paris, Madrid and London, then entrepreneurship at Imperial.</li>' +
        '<li>Now I’m at EDHEC in Lille, co-founding UniBridge.</li>' +
        '<li>I build software, then make the site, the film and the pitch around it.</li>' +
        '</ol><a class="w-more" href="#timeline">The long version ↓</a>'
    },
    unknown: {
      kicker: 'Not an AI', title: 'I didn’t catch that one.',
      body: '<p>This box only knows a few doors. Try one of these, or click anything in the scene.</p>'
    }
  };

  var panel = document.getElementById('w-panel');
  var pKick = document.getElementById('w-kicker'), pTitle = document.getElementById('w-title'), pBody = document.getElementById('w-body');
  var lastTrigger = null, introTimers = [];

  function open(key, trigger) {
    var d = P[key]; if (!d) return;
    introTimers.forEach(clearTimeout); introTimers = [];
    pKick.textContent = d.kicker; pTitle.textContent = d.title; pBody.innerHTML = d.body;
    panel.hidden = false;
    panel.classList.remove('show'); void panel.offsetWidth; panel.classList.add('show');
    lastTrigger = trigger || null;
    all('.obj').forEach(function (o) { o.classList.toggle('active', o.dataset.open === key); });
    if (key === 'about' && !reduced) {
      var items = pBody.querySelectorAll('.w-intro li');
      Array.prototype.forEach.call(items, function (li, i) {
        li.classList.add('wait');
        introTimers.push(setTimeout(function () { li.classList.remove('wait'); }, 250 + i * 650));
      });
    }
    pTitle.focus({ preventScroll: true });
  }
  function close() {
    panel.hidden = true;
    all('.obj').forEach(function (o) { o.classList.remove('active'); });
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  function all(s) { return Array.prototype.slice.call(world.querySelectorAll(s)); }

  document.getElementById('w-close').addEventListener('click', close);
  world.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  all('.obj').forEach(function (o) { o.addEventListener('click', function () { open(o.dataset.open, o); }); });

  /* ---------- the prompt box: phrases to set answers ---------- */
  var ROUTES = [
    { k: 'build', re: /\b(build|hire|work with|collab|contact|email|talk|project for|freelance|job)\b/i },
    { k: 'about', re: /\b(about|yourself|who|you are|bio|story|background|hello|hi|working on|currently|right now)\b/i },
    { k: 'creative', re: /\b(creative|art|music|game|games|play|film|fun|experiment)\b/i },
    { k: 'surprise', re: /\b(surprise|random|anything|lucky|something)\b/i },
    { k: 'work', re: /\b(work|built|build|projects?|portfolio|made|code|product|show)\b/i }
  ];
  function route(intent, trigger) {
    if (intent === 'build') {
      var c = document.getElementById('contact');
      if (c) { c.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); }
      return;
    }
    if (intent === 'surprise') {
      var keys = ['huddle', 'unibridge', 'loop', 'comet', 'music', 'podcast', 'clicky'];
      var pick = keys[Math.floor(Math.random() * keys.length)];
      var obj = world.querySelector('.obj[data-open="' + pick + '"]');
      if (obj && !reduced) { obj.classList.remove('wiggle'); void obj.offsetWidth; obj.classList.add('wiggle'); }
      open(pick, trigger);
      return;
    }
    open(intent, trigger);
  }
  var form = document.getElementById('ask');
  var input = document.getElementById('ask-in');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) { input.focus(); return; }
    var hit = null;
    for (var i = 0; i < ROUTES.length; i++) if (ROUTES[i].re.test(q)) { hit = ROUTES[i].k; break; }
    route(hit || 'unknown', input);
    input.value = '';
  });
  all('.chip').forEach(function (c) { c.addEventListener('click', function () { route(c.dataset.intent, c); }); });
})();
