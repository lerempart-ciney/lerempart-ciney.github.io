/* Le Rempart · site officiel. Petits comportements, sans dépendance. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('noscript');

  /* En-tête : fond au défilement, se cache en descendant, revient en remontant */
  var hd = d.querySelector('.hd'), lastY = 0;
  function onScroll() {
    var y = window.scrollY || 0;
    if (hd) {
      hd.classList.toggle('solid', y > 40);
      hd.classList.toggle('hide', y > 400 && y > lastY + 4 && !d.body.classList.contains('menu-open'));
      if (y < lastY - 4) hd.classList.remove('hide');
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  var menu = d.getElementById('menu'), opener = d.querySelector('.burger');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (opener) opener.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.classList.toggle('menu-open', open);
    d.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = menu.querySelector('a,button'); if (f) f.focus(); } else if (opener) opener.focus();
  }
  if (opener) opener.addEventListener('click', function () { setMenu(true); });
  d.querySelectorAll('[data-close-menu]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false); });

  /* Apparitions douces */
  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* Galerie plein écran */
  var lb = d.getElementById('lightbox');
  if (lb) {
    var items = Array.prototype.slice.call(d.querySelectorAll('.gallery [data-full]')), cur = 0, img = lb.querySelector('img'), cnt = lb.querySelector('.lb-count'), back = null;
    function show(i) {
      cur = (i + items.length) % items.length;
      var b = items[cur];
      img.src = b.getAttribute('data-full');
      img.alt = b.querySelector('img').alt;
      cnt.textContent = (cur + 1) + ' / ' + items.length;
    }
    function open(i) { back = d.activeElement; show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); d.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
    function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); d.body.style.overflow = ''; if (back) back.focus(); }
    items.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* Région : filtres par catégorie et fiches dépliables */
  var places = d.querySelectorAll('.place');
  d.querySelectorAll('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      var cat = b.getAttribute('data-cat');
      d.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      places.forEach(function (p) { p.hidden = !(cat === 'all' || (p.getAttribute('data-cats') || '').split(' ').indexOf(cat) >= 0); });
      d.querySelectorAll('.pin').forEach(function (p) { p.style.opacity = (cat === 'all' || (p.getAttribute('data-cats') || '').split(' ').indexOf(cat) >= 0) ? '1' : '.15'; });
      if (window.RMAP) window.RMAP.filter(cat);
    });
  });
  function openPlace(p, scroll) {
    var btn = p.querySelector(':scope > button'), was = p.classList.contains('open');
    p.classList.toggle('open', !was || scroll);
    btn.setAttribute('aria-expanded', p.classList.contains('open') ? 'true' : 'false');
    if (scroll) p.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  places.forEach(function (p) { p.querySelector(':scope > button').addEventListener('click', function () { openPlace(p, false); }); });
  d.querySelectorAll('.pin').forEach(function (pin) {
    function go() { var p = d.getElementById(pin.getAttribute('data-target')); if (p) { p.hidden = false; openPlace(p, true); } }
    pin.addEventListener('click', go);
    pin.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  if (location.hash && d.querySelector(location.hash + '.place')) openPlace(d.querySelector(location.hash), true);

  /* Carte détaillée : chargée seulement au clic (aucune requête externe avant) */
  var mapBtn = d.getElementById('load-map');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    mapBtn.disabled = true; mapBtn.textContent = '…';
    var css = d.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; d.head.appendChild(css);
    var s = d.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    var box = d.querySelector('.mapbox');
    var fail = function () {
      var old = d.getElementById('map'); if (old) old.remove();
      var data = JSON.parse(d.getElementById('places-data').textContent);
      var c = box.querySelector('.map-consent');
      c.style.pointerEvents = 'auto';
      c.innerHTML = '<div class="map-fail"><p class="small">La carte détaillée ne peut pas s\u2019afficher ici.</p><a class="btn ghost" style="background:var(--bg)" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=' + data.home.lat + '&mlon=' + data.home.lon + '#map=11/' + data.home.lat + '/' + data.home.lon + '">Ouvrir dans OpenStreetMap</a></div>';
    };
    var timer = setTimeout(fail, 8000);
    s.onerror = function () { clearTimeout(timer); fail(); };
    s.onload = function () {
      var data = JSON.parse(d.getElementById('places-data').textContent);
      var holder = d.createElement('div'); holder.id = 'map'; holder.style.opacity = '0'; box.appendChild(holder);
      var m = L.map('map', { scrollWheelZoom: false }).setView([data.home.lat, data.home.lon], 10);
      var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; contributeurs OpenStreetMap' }).addTo(m);
      tiles.once('tileload', function () { clearTimeout(timer); holder.style.opacity = '1'; var c = box.querySelector('.map-consent'); if (c) c.remove(); var sv = box.querySelector('svg.static'); if (sv) sv.remove(); });
      var icon = function (c) { return L.divIcon({ className: '', html: '<span style="display:block;width:12px;height:12px;border-radius:50%;background:' + c + ';border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>', iconSize: [12, 12], iconAnchor: [6, 6] }); };
      L.marker([data.home.lat, data.home.lon], { icon: icon('#26352D') }).addTo(m).bindPopup('<b>Le Rempart</b><br>Avenue de Namur 6, Ciney');
      L.circle([data.home.lat, data.home.lon], { radius: 50000, color: '#C6AD83', weight: 1, fill: false, dashArray: '4 6' }).addTo(m);
      var marks = data.places.map(function (p) {
        var mk = L.marker([p.lat, p.lon], { icon: icon('#C6AD83') }).bindPopup('<b>' + p.name + '</b><br>' + p.time + '<br><a href="#' + p.id + '">Voir la fiche</a>');
        mk.cats = p.cats; mk.addTo(m); return mk;
      });
      window.RMAP = { filter: function (cat) { marks.forEach(function (mk) { var on = cat === 'all' || mk.cats.indexOf(cat) >= 0; if (on) mk.addTo(m); else m.removeLayer(mk); }); } };
      m.on('popupopen', function (e) {
        var a = e.popup.getElement().querySelector('a');
        if (a) a.addEventListener('click', function (ev) { ev.preventDefault(); var p = d.querySelector(a.getAttribute('href')); if (p) { p.hidden = false; openPlace(p, true); } });
      });
    };
    d.head.appendChild(s);
  });

  /* Demande de séjour : prépare un message, que le visiteur envoie lui-même */
  var form = d.getElementById('booking');
  if (form) {
    var cfg = JSON.parse(d.getElementById('booking-config').textContent);
    var q = new URLSearchParams(location.search);
    if (q.get('gite')) { var r = form.querySelector('input[name="gite"][value="' + q.get('gite') + '"]'); if (r) r.checked = true; }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var iso = function (dt) { return new Date(dt.getTime() - dt.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
    form.arrivee.min = iso(today);
    form.arrivee.addEventListener('change', function () { if (form.arrivee.value) { var n = new Date(form.arrivee.value); n.setDate(n.getDate() + 1); form.depart.min = iso(n); } });
    function capFor(g) { return cfg.capacites[g] || 0; }
    function update() {
      var g = (form.querySelector('input[name="gite"]:checked') || {}).value;
      var cap = capFor(g), adults = +form.adultes.value || 0, kids = +form.enfants.value || 0;
      var hint = d.getElementById('cap-hint');
      hint.textContent = g ? 'Capacité : ' + cap + ' personnes.' : '';
      var out = d.getElementById('ext-links'); out.innerHTML = '';
      if (g && cfg.liens[g]) { out.innerHTML = '<a class="link" target="_blank" rel="noopener" href="' + cfg.liens[g] + '">Voir les disponibilités en ligne</a>'; }
      return { g: g, cap: cap, adults: adults, kids: kids };
    }
    form.addEventListener('change', update); update();
    function build() {
      var s = update(), err = d.getElementById('form-err'), msg = '';
      var a = form.arrivee.value, dpt = form.depart.value;
      if (!s.g) msg = 'Choisissez un gîte ou le domaine entier.';
      else if (!a || !dpt) msg = 'Indiquez vos dates d’arrivée et de départ.';
      else if (dpt <= a) msg = 'La date de départ doit suivre la date d’arrivée.';
      else if (s.adults < 1) msg = 'Indiquez au moins un adulte.';
      else if (s.adults + s.kids > s.cap) msg = 'Ce choix accueille ' + s.cap + ' personnes au maximum.';
      else if (!form.nom.value.trim()) msg = 'Indiquez votre nom.';
      err.textContent = msg;
      if (msg) return null;
      var nuits = Math.round((new Date(dpt) - new Date(a)) / 864e5);
      var fmt = function (v) { return new Date(v).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
      return 'Bonjour,\n\nNous souhaiterions séjourner au Rempart.\n\n' +
        'Logement : ' + cfg.noms[s.g] + '\n' +
        'Arrivée : ' + fmt(a) + '\nDépart : ' + fmt(dpt) + ' (' + nuits + ' nuit' + (nuits > 1 ? 's' : '') + ')\n' +
        'Voyageurs : ' + s.adults + ' adulte' + (s.adults > 1 ? 's' : '') + (s.kids ? ', ' + s.kids + ' enfant' + (s.kids > 1 ? 's' : '') : '') + '\n' +
        (form.message.value.trim() ? '\n' + form.message.value.trim() + '\n' : '') +
        '\n' + form.nom.value.trim() + (form.tel.value.trim() ? '\n' + form.tel.value.trim() : '') + (form.email.value.trim() ? '\n' + form.email.value.trim() : '');
    }
    var sum = d.getElementById('summary');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = build(); if (!t) return;
      sum.querySelector('pre').textContent = t;
      sum.querySelector('[data-wa]').href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(t);
      sum.querySelector('[data-mail]').href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('Demande de séjour · ' + cfg.noms[update().g]) + '&body=' + encodeURIComponent(t);
      sum.classList.add('on'); sum.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* Formulaire de contact : même principe */
  var cf = d.getElementById('contact-form');
  if (cf) {
    var cc = JSON.parse(d.getElementById('booking-config').textContent);
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = d.getElementById('contact-err');
      if (!cf.nom.value.trim() || !cf.message.value.trim()) { err.textContent = 'Indiquez votre nom et votre message.'; return; }
      err.textContent = '';
      var t = cf.message.value.trim() + '\n\n' + cf.nom.value.trim() + (cf.email.value.trim() ? '\n' + cf.email.value.trim() : '');
      var via = e.submitter && e.submitter.value === 'wa' ? 'https://wa.me/' + cc.whatsapp + '?text=' + encodeURIComponent(t) : 'mailto:' + cc.email + '?subject=' + encodeURIComponent('Message depuis le site') + '&body=' + encodeURIComponent(t);
      window.location.href = via;
    });
  }

  var y = d.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
