/* gd-guide-de-reference · coquille-vues.js — UN fichier, N VUES, une seule peinte à la fois.
 *
 * Contrat de marquage (le générateur le produit ; à la main, le recopier tel quel) :
 *   <nav class="vues" aria-label="Vues du document"><ol>
 *     <li><a href="#vue-a" title="annonce"><span class="toc-t">Libellé A</span></a></li> …
 *   </ol></nav>
 *   <div id="contenu">
 *     <div class="vue" data-vue="a"> … <section class="vue-corps" id="vue-a"> … </section> … </div>
 *   </div>
 * et, dans le <head>, l'amorce qui pose la classe `js` AVANT la première peinture (sans elle,
 * toutes les vues clignotent une fois) — bascule-theme.js en fournit une.
 *
 * Comportement : l'adresse fait foi (#vue-a ouvre la vue a ; #un-chapitre ouvre la vue qui le
 * porte, puis y défile) ; l'onglet courant porte aria-current="page" ; la hauteur du bandeau
 * collant est MESURÉE et publiée dans --hh ; les composants du socle (filtres, lignes
 * dépliables) sont câblés au PREMIER affichage de leur vue — un composant qui mesure un tableau
 * non peint lit des dimensions nulles. Sans script : toutes les vues se lisent à la suite.
 *
 * API (window.GuideVues) : afficher(cle, remonter) · courante() · vues() · cleDe(vue) ·
 * surAffichage(fn) — fn(cle, vue) après chaque affichage · reappliquer() — après une
 * réécriture du contenu (la recherche remplace #contenu à chaque frappe), oublie les câblages
 * et rend la vue courante, recâblée sur le contenu neuf.
 *
 * Faits payés sur le document source (24/09/2026) : une liste de vues relevée au chargement
 * devient une liste de nœuds DÉTACHÉS dès que la recherche réécrit le contenu — depuis la
 * dernière vue, une recherche ramenait la première, puis plus aucun onglet ne répondait. Les
 * vues se relisent donc à chaque usage, et la vue courante est retenue. Et une marge de
 * défilement figée à 142 px pour un bandeau de 194 px envoyait cinq liens de chapitre sur dix
 * derrière lui (16/09/2026) : la hauteur se mesure, elle ne se devine pas.
 */
(function (global) {
  'use strict';
  var ecouteurs = [];
  var etat = { courante: '', cablees: {} };

  function lesVues() { return [].slice.call(document.querySelectorAll('#contenu [data-vue]')); }
  function cleDe(vue) { return vue ? vue.getAttribute('data-vue') : ''; }
  function lesOnglets() { return [].slice.call(document.querySelectorAll('nav.vues a[href^="#vue-"]')); }

  function publierHauteur() {
    var bandeau = document.querySelector('header.bandeau');
    if (!bandeau) { return; }
    var h = Math.round(bandeau.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--hh', h + 'px');
  }

  function cabler(vue) {
    var cle = cleDe(vue);
    if (!vue || etat.cablees[cle]) { return; }
    etat.cablees[cle] = true;
    if (global.DigitAITableDetail && global.DigitAITableDetail.initAll) {
      global.DigitAITableDetail.initAll(vue);
      // Un chevron câblé par le composant ne doit pas l'être une seconde fois par le relais que
      // recherche-resultats.js pose sur le document pour les chevrons que la recherche a tués.
      [].slice.call(vue.querySelectorAll('button.td-btn[aria-controls]')).forEach(function (b) {
        b.__tdCable = true;
      });
    }
    if (global.DigitAITableFilters && global.DigitAITableFilters.initAll) {
      global.DigitAITableFilters.initAll(vue);
    }
  }

  function afficher(cle, remonter) {
    var cible = null;
    var vues = lesVues();
    vues.forEach(function (v) {
      var actif = cleDe(v) === cle;
      v.classList.toggle('active', actif);
      if (actif) { cible = v; }
    });
    if (!cible && vues.length) { cible = vues[0]; cible.classList.add('active'); }
    lesOnglets().forEach(function (a) {
      if (cible && a.getAttribute('href') === '#vue-' + cleDe(cible)) {
        a.setAttribute('aria-current', 'page');
      } else { a.removeAttribute('aria-current'); }
    });
    etat.courante = cleDe(cible);
    cabler(cible);
    if (remonter) { global.scrollTo(0, 0); }
    ecouteurs.forEach(function (fn) { try { fn(etat.courante, cible); } catch (e) { /* un écouteur ne casse pas les autres */ } });
    return cible;
  }

  function depuisAdresse(remonter) {
    var vues = lesVues();
    var premiere = vues.length ? cleDe(vues[0]) : '';
    var brut = decodeURIComponent((location.hash || '').replace('#', ''));
    if (!brut) { afficher(premiere, remonter); return; }
    var noeud = document.getElementById(brut);
    var vue = noeud && noeud.closest ? noeud.closest('[data-vue]') : null;
    if (vue) {
      afficher(cleDe(vue), false);
      if (!/^vue-/.test(brut)) { noeud.scrollIntoView(); } else { global.scrollTo(0, 0); }
      return;
    }
    afficher(premiere, remonter);
  }

  function init() {
    if (!document.querySelector('#contenu [data-vue]')) { return; }
    document.documentElement.classList.add('js');
    publierHauteur();
    global.addEventListener('resize', publierHauteur);
    var bandeau = document.querySelector('header.bandeau');
    if (global.ResizeObserver && bandeau) { new ResizeObserver(publierHauteur).observe(bandeau); }
    depuisAdresse(false);
    global.addEventListener('hashchange', function () { depuisAdresse(true); });
  }

  global.GuideVues = {
    afficher: afficher,
    courante: function () { return etat.courante; },
    vues: lesVues,
    cleDe: cleDe,
    surAffichage: function (fn) { if (typeof fn === 'function') { ecouteurs.push(fn); } },
    // Le contenu vient d'être RÉÉCRIT (recherche) : les câblages d'avant visent des nœuds
    // détachés. On les oublie, et la vue courante est rendue et recâblée sur le contenu neuf.
    reappliquer: function () { etat.cablees = {}; if (etat.courante) { afficher(etat.courante, false); } },
    publierHauteur: publierHauteur
  };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})(window);
