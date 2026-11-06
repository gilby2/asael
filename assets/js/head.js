// Runs before first paint: English by default (set in the HTML), Hebrew with a ?lang=he link
// It also lets CSS hide reveal content only when JS is on.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var lang = null;
  try { lang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  if (lang === 'he') { root.lang = 'he'; root.dir = 'rtl'; }
  // Review only: ?palette=olive|sky|fresh|dusk|sunset|spring previews a colour option
  try {
    var pal = new URLSearchParams(location.search).get('palette');
    if (/^(olive|sky|fresh|dusk|sunset|spring)$/.test(pal || '')) root.dataset.palette = pal;
  } catch (e) {}
})();
