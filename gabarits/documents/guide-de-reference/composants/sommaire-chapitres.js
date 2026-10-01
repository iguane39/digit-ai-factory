/* gd-guide-de-reference · sommaire-chapitres.js — le REPÈRE DE POSITION du menu latéral.
 *
 * Contrat de marquage :
 *   <div class="page">
 *     <nav class="chapitres" aria-label="Chapitres de cette vue"><p class="toc-titre">Dans cette vue</p><ol>
 *       <li class="toc-s"><a href="#chapitre-id"><span class="toc-t">Titre</span></a>
 *         <ol class="toc-n2"><li><a href="#pas-id"><span class="toc-t">Pas</span></a></li></ol></li>
 *     </ol></nav>
 *     <main> … <section class="ch" id="chapitre-id"> … <section class="pas-bloc" id="pas-id"> … </main>
 *   </div>
 *
 * Il répond à « où en suis-je dans ce chapitre », ce qu'un sommaire à un seul niveau ne peut pas
 * dire : le chapitre dont le haut a passé le bandeau devient courant (li.toc-s.actif) et déplie
 * ses pas ; le pas courant est marqué à son tour. Dans une page à vues (coquille-vues.js), seule
 * la vue affichée est suivie ; sans coquille, le document entier.
 *
 * Un pas rangé DANS une ligne de tableau dépliable (tr[data-detail]) n'a pas d'entrée propre :
 * sa ligne en a une, et une ligne repliée ou filtrée n'a pas de position — elle ne compte pas.
 */
(function (global) {
  'use strict';
  function racine() { return document.querySelector('.vue.active') || document; }

  function suivre() {
    var vue = racine();
    var menu = vue.querySelector ? vue.querySelector('nav.chapitres') : null;
    if (!menu) { return; }
    var seuil = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 128) + 24;
    var chapitres = [].slice.call(vue.querySelectorAll('section.ch'));
    var courant = null;
    chapitres.forEach(function (c) { if (c.getBoundingClientRect().top <= seuil) { courant = c; } });
    // AU BAS DE LA PAGE, le dernier chapitre ne peut plus monter jusqu'au bandeau : il ne serait
    // jamais courant, et le lien qui y mène marquerait son voisin (sonde du 24/09/2026 : chapitre
    // atteint par son adresse, arrêté à 532 px, menu resté sur le précédent). Le dernier chapitre
    // VISIBLE devient alors le courant.
    var racineDefil = document.scrollingElement || document.documentElement;
    if (global.innerHeight + global.scrollY >= racineDefil.scrollHeight - 2) {
      chapitres.forEach(function (c) { if (c.getBoundingClientRect().top < global.innerHeight) { courant = c; } });
    }
    if (!courant && chapitres.length) { courant = chapitres[0]; }
    [].slice.call(menu.querySelectorAll('li.toc-s')).forEach(function (li) {
      var a = li.querySelector('a');
      li.classList.toggle('actif', !!(courant && a && a.getAttribute('href') === '#' + courant.id));
    });
    [].slice.call(menu.querySelectorAll('ol.toc-n2 li')).forEach(function (li) { li.classList.remove('actif'); });
    if (!courant) { return; }
    var pas = [].slice.call(courant.querySelectorAll('.pas-bloc, tr[data-detail]')).filter(function (b) {
      return !(b.parentElement && b.parentElement.closest('tr[data-detail]'));
    });
    var pasCourant = null;
    pas.forEach(function (b) {
      var repere = b.hasAttribute('data-detail') ? b.previousElementSibling : b;
      if (repere && repere.getClientRects().length && repere.getBoundingClientRect().top <= seuil) { pasCourant = b; }
    });
    if (!pasCourant) { return; }
    var lien = menu.querySelector('ol.toc-n2 a[href="#' + pasCourant.id + '"]');
    if (lien && lien.parentNode) { lien.parentNode.classList.add('actif'); }
  }

  function init() {
    if (!document.querySelector('nav.chapitres')) { return; }
    document.documentElement.classList.add('js');
    suivre();
    global.addEventListener('scroll', suivre, { passive: true });
    global.addEventListener('resize', suivre);
    if (global.GuideVues && global.GuideVues.surAffichage) { global.GuideVues.surAffichage(suivre); }
  }
  global.GuideSommaire = { suivre: suivre };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})(window);
