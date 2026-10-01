/* gd-guide-de-reference · bascule-theme.js — la bascule clair / sombre (règle R-30).
 *
 * Contrat de marquage : <button type="button" class="theme-toggle" aria-pressed="false">Thème sombre</button>
 * et, dans le <head>, l'AMORCE qui applique le thème retenu avant la première peinture et pose
 * la classe `js` (sans elle, la page clignote en clair puis en sombre, et toutes les vues d'un
 * document à vues se peignent une fois) — une ligne, à recopier telle quelle :
 *   (function(){var c=document.documentElement,cleTheme=c.getAttribute('data-cle-theme')||'guide-theme',s=null;
 *    try{s=localStorage.getItem(cleTheme);}catch(e){}c.setAttribute('data-theme',s==='dark'?'dark':'light');
 *    c.className+=' js';})();
 * La clé de mémorisation se déclare sur <html data-cle-theme="…"> : deux documents d'un même
 * domaine ne se partagent pas leur choix par accident.
 */
(function (global) {
  'use strict';
  function cle() { return document.documentElement.getAttribute('data-cle-theme') || 'guide-theme'; }
  function sombre() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function init() {
    var bouton = document.querySelector('.theme-toggle');
    if (!bouton) { return; }
    function libeller() {
      bouton.textContent = sombre() ? 'Thème clair' : 'Thème sombre';
      bouton.setAttribute('aria-pressed', sombre() ? 'true' : 'false');
    }
    libeller();
    bouton.addEventListener('click', function () {
      var suivant = sombre() ? 'light' : 'dark';
      var cleTheme = cle();
      document.documentElement.setAttribute('data-theme', suivant);
      try { localStorage.setItem(cleTheme, suivant); } catch (e) { /* stockage refusé : le choix vaut pour la visite */ }
      var meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) { meta.setAttribute('content', suivant); }
      libeller();
    });
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})(window);
