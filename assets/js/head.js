// Runs before first paint: Hebrew by default, English only with a ?lang=en link
// It also lets CSS hide reveal content only when JS is on.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var lang = null;
  try { lang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  if (lang === 'en') { root.lang = 'en'; root.dir = 'ltr'; }
  // Review only: ?palette=olive|sky|fresh|dusk|sunset|spring previews a colour option
  try {
    var pal = new URLSearchParams(location.search).get('palette');
    if (/^(olive|sky|fresh|dusk|sunset|spring)$/.test(pal || '')) root.dataset.palette = pal;
  } catch (e) {}
})();
