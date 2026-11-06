(function () {
  'use strict';

  // Campaign numbers. Leave as null to keep the meter hidden; fill in once the committee sets the goal.
  var CAMPAIGN = { goal: null, raised: null, donors: null };

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = root.lang === 'en' ? 'en' : 'he';

  // ---------- Language ----------
  var TITLES = { he: 'עשהאל – היו שותפים', en: 'Asael – Be a Part of the Dream' };

  function render() {
    root.lang = lang;
    root.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = TITLES[lang];
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    });
    document.querySelectorAll('img[data-alt-en]').forEach(function (img) {
      if (!img.dataset.altHe) img.dataset.altHe = img.alt;
      img.alt = lang === 'en' ? img.dataset.altEn : img.dataset.altHe;
    });
    renderMeter();
  }

  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.setLang;
      render();
    });
  });

  // ---------- Meter ----------
  var meter = document.getElementById('meter');

  function shekels(n) {
    return new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US', {
      style: 'currency', currency: 'ILS', maximumFractionDigits: 0
    }).format(n);
  }

  function renderMeter() {
    if (CAMPAIGN.goal == null || CAMPAIGN.raised == null) return;
    meter.hidden = false;
    var pct = Math.max(0, Math.min(100, Math.round(CAMPAIGN.raised / CAMPAIGN.goal * 100)));
    document.getElementById('meter-raised').textContent = shekels(CAMPAIGN.raised);
    document.getElementById('meter-goal').textContent = shekels(CAMPAIGN.goal);
    document.getElementById('meter-donors').textContent = CAMPAIGN.donors == null ? '' : String(CAMPAIGN.donors);
    var bar = document.getElementById('meter-bar');
    bar.setAttribute('aria-valuenow', String(pct));
    bar.firstElementChild.style.width = pct + '%';
  }

  // ---------- Video ----------
  var box = document.getElementById('video');
  document.getElementById('video-play').addEventListener('click', function () {
    var src = box.dataset.videoSrc;
    var el;
    if (src) {
      // A self-hosted MP4 gets real subtitle tracks
      el = document.createElement('video');
      el.src = src;
      el.controls = true;
      el.autoplay = true;
      el.playsInline = true;
      el.poster = box.querySelector('img').src;
      [['he', 'עברית'], ['en', 'English']].forEach(function (t) {
        var tr = document.createElement('track');
        tr.kind = 'subtitles';
        tr.srclang = t[0];
        tr.label = t[1];
        tr.src = 'assets/captions/' + t[0] + '.vtt';
        if (t[0] === lang) tr.default = true;
        el.appendChild(tr);
      });
    } else {
      el = document.createElement('iframe');
      el.src = 'https://drive.google.com/file/d/' + box.dataset.driveId + '/preview';
      el.allow = 'autoplay; fullscreen';
      el.allowFullscreen = true;
      el.title = lang === 'he' ? 'סרטון עשהאל' : 'Asael video';
    }
    box.classList.add('is-playing');
    box.replaceChildren(el);
    el.focus();
  });

  // ---------- Motion ----------
  var shutter = document.querySelector('.shutter');
  var heroHill = document.querySelector('.hill-hero');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroHill.classList.add('is-up');
      shutter.classList.add('is-open');
      if (!reduce) setTimeout(function () { shutter.classList.add('is-drifting'); }, 1500);
    });
  });

  var reveals = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // Stagger the parts of each section in reading order
    document.querySelectorAll('section').forEach(function (sec) {
      sec.querySelectorAll('[data-reveal]').forEach(function (el, i) {
        el.style.setProperty('--d', Math.min(i * 80, 480) + 'ms');
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // The phone dock steps aside while the donate section or the footer is on screen
  var dock = document.getElementById('dock');
  if ('IntersectionObserver' in window) {
    var visible = new Set();
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
      dock.classList.toggle('is-away', visible.size > 0);
    });
    [document.getElementById('donate'), document.querySelector('.foot'), document.querySelector('.hero')]
      .forEach(function (el) { dio.observe(el); });
  }

  render();
})();
