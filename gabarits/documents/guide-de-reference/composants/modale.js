/* gd-guide-de-reference · modale.js — la FENÊTRE MODALE à onglets, et les FICHES de codes cités.
 *
 * Contrat de marquage :
 *   <button type="button" class="lien-source" data-ouvre-modale="modale-source">docs/SOURCE.md</button>
 *   <div class="modale" id="modale-source" hidden>
 *     <div class="modale-fond" data-fermer></div>
 *     <div class="modale-boite" role="dialog" aria-modal="true" aria-label="…">
 *       <div class="modale-tete"><p class="modale-titre">…</p>
 *         <div class="modale-onglets" role="tablist">
 *           <button type="button" role="tab" id="t-a" data-onglet="a" aria-controls="p-a" aria-selected="true">A</button> …
 *         </div><button type="button" class="modale-fermer" data-fermer>Fermer</button></div>
 *       <div class="modale-corps" id="p-a" role="tabpanel" aria-labelledby="t-a" data-panneau="a">…</div> …
 *     </div>
 *   </div>
 * FICHES (facultatif) : un code cité `<a class="code-fiche" href="#…" data-fiche="R07"><code>R07</code></a>`
 * ouvre la fenêtre `#modale-fiche` remplie depuis le bloc
 * `<script type="application/json" id="fiches-donnees">{"R07": {"titre": "…", "meta": "…",
 * "panneaux": [{"nom": "Règle", "html": "…"}]}}` — rendu à la demande : cent fiches rendues d'avance
 * pèseraient sur le DOM de la page entière.
 *
 * Comportement : une seule fenêtre ouverte à la fois ; Échap, le fond, [data-fermer] et tout lien
 * de navigation interne la ferment ; à l'ouverture le focus va au premier onglet, à la fermeture
 * il REVIENT au bouton qui l'a ouverte. Écouteurs posés au niveau du DOCUMENT : la recherche
 * réécrit le contenu à chaque frappe et emporterait tout écouteur posé bouton par bouton.
 */
(function (global) {
  'use strict';
  var ouvreur = null;

  function modales() { return [].slice.call(document.querySelectorAll('.modale')); }
  function fermerTout() {
    var ouverte = modales().some(function (m) { return !m.hidden; });
    modales().forEach(function (m) { m.hidden = true; });
    if (ouverte && ouvreur && document.body.contains(ouvreur)) { ouvreur.focus(); }
    ouvreur = null;
  }
  function ouvrir(m, depuis) {
    if (!m) { return; }
    modales().forEach(function (x) { x.hidden = true; });
    ouvreur = depuis || document.activeElement;
    m.hidden = false;
    var premier = m.querySelector('.modale-onglets button[aria-selected="true"]')
      || m.querySelector('.modale-onglets button') || m.querySelector('.modale-fermer');
    if (premier) { premier.focus(); }
  }
  function choisirOnglet(bouton) {
    var m = bouton.closest('.modale');
    if (!m) { return; }
    var voulu = bouton.getAttribute('data-onglet');
    [].slice.call(m.querySelectorAll('.modale-onglets button')).forEach(function (o) {
      o.setAttribute('aria-selected', o === bouton ? 'true' : 'false');
    });
    [].slice.call(m.querySelectorAll('.modale-corps[data-panneau]')).forEach(function (c) {
      c.hidden = c.getAttribute('data-panneau') !== voulu;
    });
  }

  var donnees = null;
  function fiches() {
    if (donnees) { return donnees; }
    var bloc = document.getElementById('fiches-donnees');
    try { donnees = bloc ? JSON.parse(bloc.textContent) : {}; } catch (e) { donnees = {}; }
    return donnees;
  }
  function ouvrirFiche(id, depuis) {
    var f = fiches()[id];
    var m = document.getElementById('modale-fiche');
    if (!f || !m) { return false; }
    m.querySelector('.modale-titre').textContent = f.titre || id;
    var meta = m.querySelector('.fiche-meta');
    if (meta) { meta.innerHTML = f.meta || ''; meta.hidden = !f.meta; }
    var onglets = m.querySelector('.modale-onglets');
    var panneaux = m.querySelector('.fiche-panneaux');
    onglets.innerHTML = '';
    panneaux.innerHTML = '';
    (f.panneaux || []).forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'fiche-onglet-' + i;
      b.setAttribute('data-onglet', 'p' + i); b.setAttribute('aria-controls', 'fiche-panneau-' + i);
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false'); b.textContent = p.nom;
      onglets.appendChild(b);
      var c = document.createElement('div');
      c.className = 'modale-corps'; c.id = 'fiche-panneau-' + i; c.setAttribute('role', 'tabpanel');
      c.setAttribute('aria-labelledby', b.id); c.setAttribute('data-panneau', 'p' + i);
      c.hidden = i !== 0; c.innerHTML = p.html;
      panneaux.appendChild(c);
    });
    onglets.hidden = (f.panneaux || []).length < 2;
    ouvrir(m, depuis);
    return true;
  }

  function init() {
    if (!document.querySelector('.modale')) { return; }
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t.closest) { return; }
      var fiche = t.closest('a.code-fiche[data-fiche]');
      if (fiche) { if (ouvrirFiche(fiche.getAttribute('data-fiche'), fiche)) { e.preventDefault(); } return; }
      var declencheur = t.closest('[data-ouvre-modale]');
      if (declencheur) { ouvrir(document.getElementById(declencheur.getAttribute('data-ouvre-modale')), declencheur); return; }
      var onglet = t.closest('.modale .modale-onglets button[data-onglet]');
      if (onglet) { choisirOnglet(onglet); return; }
      if (t.closest('.modale [data-fermer]')) { fermerTout(); return; }
      var lien = t.closest('.modale a[href^="#"]');
      if (lien && !lien.classList.contains('code-fiche')) { fermerTout(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { fermerTout(); } });
  }
  global.GuideModale = { ouvrir: ouvrir, fermer: fermerTout, ouvrirFiche: ouvrirFiche };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})(window);
