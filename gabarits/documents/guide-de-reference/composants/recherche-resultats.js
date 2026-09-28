/* gd-guide-de-reference · recherche-resultats.js — la RECHERCHE et le tableau de ses résultats.
 *
 * Dépend de find-in-page.js du SOCLE (posé par embarquer-composants.mjs) : ce composant ne
 * réécrit pas le surlignage, il dit OÙ sont les occurrences.
 *
 * Contrat de marquage (le panneau vit HORS de #contenu, que la recherche réécrit à chaque frappe) :
 *   <div class="barre-recherche"><label for="recherche" hidden>Rechercher</label>
 *     <input id="recherche" type="search" aria-controls="recherche-resultats" aria-expanded="false">
 *     <div id="rechercheCompte" class="find-count" aria-live="polite"></div></div>
 *   <div id="recherche-resultats" class="resultats" role="region" aria-label="Résultats de la recherche" hidden>
 *     <div class="res-tete"><p class="res-resume" id="res-resume"></p>
 *       <button type="button" class="res-fermer">Fermer</button></div>
 *     <div class="res-corps"></div></div>
 *   <div id="contenu"> … </div>
 * Ce script se pose APRÈS #contenu : il en prend le relevé BRUT au moment où il s'exécute.
 *
 * LE RELEVÉ BRUT, et c'est la correction que ce composant apportait. Jusqu'au socle du 26/09/2026,
 * find-in-page remettait à chaque frappe le HTML qu'il avait relevé ; relevé APRÈS le câblage des
 * autres composants, il remettait des filtres de tableau DESSINÉS mais SANS écouteurs — mesuré le
 * 23/09/2026 sur le document source : panneau de filtre ouvert au clic 1, puis 0 après une recherche
 * effacée. Ici le relevé est pris AVANT tout câblage (mode `getHTML` du socle), et chaque frappe se
 * termine par un recâblage de la vue courante. Depuis le socle du 26/09 (TF-1340), find-in-page ne
 * réécrit plus le conteneur et ignore `getHTML` : le relevé ne sert plus qu'avec un socle antérieur,
 * et le recâblage retrouve les composants déjà posés. Ce que la recherche coûte avec un socle
 * antérieur, et c'est dit : l'état d'un filtre posé avant la frappe est perdu.
 *
 * Comportement : une ligne par occurrence (200 au plus, et le résumé le dit) — la vue, le
 * chapitre, un extrait de 70 caractères de part et d'autre coupé entre deux mots ; un clic ouvre
 * la vue, déplie la ligne de tableau qui porte l'occurrence et l'amène au milieu de l'écran,
 * cerclée. Le texte s'écrit par nœuds de texte, jamais par innerHTML : rien de la page n'est
 * réinterprété. Échap ferme le panneau (un second Échap vide le champ, comportement natif) ;
 * Flèche bas entre dans les résultats. Événement émis après chaque frappe : `guide:recherche`.
 */
(function (global) {
  'use strict';
  var contenu = document.getElementById('contenu');
  var brut = contenu ? contenu.innerHTML : '';
  var MAX_RESULTATS = 200, BORD_EXTRAIT = 70;
  var BLOCS = 'p, li, td, th, dd, dt, pre, h2, h3, h4, figcaption, caption, blockquote, summary, label, text, title';
  var marques = [];

  function net(t) { return (t || '').replace(/\s+/g, ' '); }
  function cleDe(v) { return v ? v.getAttribute('data-vue') : ''; }

  function recabler() {
    if (global.GuideVues && global.GuideVues.reappliquer) { global.GuideVues.reappliquer(); return; }
    if (!contenu) { return; }
    if (global.DigitAITableDetail && global.DigitAITableDetail.initAll) { global.DigitAITableDetail.initAll(contenu); }
    if (global.DigitAITableFilters && global.DigitAITableFilters.initAll) { global.DigitAITableFilters.initAll(contenu); }
  }

  function basculerLigne(btn, ouvrir) {
    var det = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!det || !det.hasAttribute('data-detail')) { return; }
    var etat = typeof ouvrir === 'boolean' ? ouvrir : btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', etat ? 'true' : 'false');
    det.hidden = !etat;
    var mere = btn.closest('tr');
    if (mere) { mere.classList.toggle('td-ouverte', etat); }
  }

  function reparerSchemas() {
    if (!contenu) { return; }
    [].slice.call(contenu.querySelectorAll('svg mark.find-hit')).forEach(function (mk) {
      var ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      ts.setAttribute('class', 'find-hit');
      ts.textContent = mk.textContent;
      mk.parentNode.replaceChild(ts, mk);
    });
  }

  function libelles() {
    var l = {};
    [].slice.call(document.querySelectorAll('nav.vues a[href^="#vue-"]')).forEach(function (a) {
      l[(a.getAttribute('href') || '').replace('#vue-', '')] = a.textContent.trim();
    });
    return l;
  }
  function ouSeTrouve(mk) {
    if (mk.closest('nav.chapitres')) { return 'sommaire de la vue'; }
    if (mk.closest('nav.toc')) { return 'sommaire du document'; }
    if (mk.closest('nav.pagination')) { return 'vue précédente ou suivante'; }
    if (mk.closest('.meta')) { return 'repères de la vue'; }
    var ch = mk.closest('section.ch');
    var h3 = ch ? ch.querySelector('.ch-titres h3') : null;
    if (!h3) { return 'ouverture de la vue'; }
    var t = net(h3.textContent).trim();
    return t.length > 90 ? t.slice(0, 88).replace(/\s\S*$/, '') + ' …' : t;
  }
  function extrait(mk) {
    var bloc = mk.closest(BLOCS) || mk.parentNode;
    var r = document.createRange();
    r.setStart(bloc, 0); r.setEndBefore(mk);
    var avant = net(r.toString()).replace(/^\s+/, '');
    r.setStartAfter(mk); r.setEnd(bloc, bloc.childNodes.length);
    var apres = net(r.toString()).replace(/\s+$/, '');
    if (avant.length > BORD_EXTRAIT) { avant = '… ' + avant.slice(-BORD_EXTRAIT).replace(/^\S*\s/, ''); }
    if (apres.length > BORD_EXTRAIT) { apres = apres.slice(0, BORD_EXTRAIT).replace(/\s\S*$/, '') + ' …'; }
    return [avant, mk.textContent, apres];
  }

  function init() {
    var champ = document.getElementById('recherche');
    var compte = document.getElementById('rechercheCompte');
    var panneau = document.getElementById('recherche-resultats');
    if (!champ || !contenu || !global.DigitAIFindInPage || !global.DigitAIFindInPage.init) { return; }
    global.DigitAIFindInPage.init(champ, contenu, compte, function () { return brut; });

    function placer() {
      var barre = document.querySelector('.barre-recherche');
      if (panneau && barre) { panneau.style.setProperty('--res-haut', Math.round(barre.getBoundingClientRect().bottom + 20) + 'px'); }
    }
    function ouvrirPanneau() {
      if (!panneau || !marques.length) { return; }
      placer(); panneau.hidden = false; champ.setAttribute('aria-expanded', 'true');
    }
    function fermerPanneau() {
      if (!panneau) { return; }
      panneau.hidden = true; champ.setAttribute('aria-expanded', 'false');
    }
    var focusRendu = false;
    function rendreFocus() { focusRendu = true; champ.focus(); focusRendu = false; }

    function lister() {
      if (!panneau) { return; }
      var corps = panneau.querySelector('.res-corps');
      var resume = panneau.querySelector('.res-resume');
      marques = champ.value.trim() ? [].slice.call(contenu.querySelectorAll('mark.find-hit, tspan.find-hit')) : [];
      corps.textContent = '';
      if (!marques.length) { resume.textContent = ''; fermerPanneau(); return; }
      var noms = libelles(), touchees = {}, nbVues = 0;
      marques.forEach(function (mk) {
        var cle = cleDe(mk.closest('[data-vue]'));
        if (!touchees[cle]) { touchees[cle] = true; nbVues++; }
      });
      var n = marques.length;
      resume.textContent = n + (n > 1 ? ' occurrences' : ' occurrence') + ' dans ' + nbVues
        + (nbVues > 1 ? ' vues' : ' vue')
        + (n > MAX_RESULTATS ? ' — les ' + MAX_RESULTATS + ' premières sont listées : précisez la recherche' : '');
      var table = document.createElement('table');
      table.className = 'res-table';
      table.setAttribute('data-filterable', 'off');
      table.setAttribute('data-filterable-reason', 'résultats d\'une recherche, déjà filtrés par la saisie');
      table.setAttribute('aria-describedby', 'res-resume');
      table.innerHTML = '<colgroup><col class="res-c1"><col class="res-c2"></colgroup>'
        + '<thead><tr><th scope="col">Vue</th><th scope="col">Extrait</th></tr></thead>';
      var tbody = document.createElement('tbody');
      marques.slice(0, MAX_RESULTATS).forEach(function (mk, k) {
        var cle = cleDe(mk.closest('[data-vue]'));
        var tr = document.createElement('tr');
        tr.setAttribute('data-occ', String(k));
        var td1 = document.createElement('td');
        var a = document.createElement('a');
        a.href = cle ? '#vue-' + cle : '#contenu';
        a.className = 'res-aller';
        a.setAttribute('data-occ', String(k));
        a.textContent = noms[cle] || cle || 'Document';
        var ch = document.createElement('span');
        ch.className = 'res-ch';
        ch.textContent = ouSeTrouve(mk);
        td1.appendChild(a); td1.appendChild(ch);
        var td2 = document.createElement('td');
        td2.className = 'res-extrait';
        var e = extrait(mk);
        td2.appendChild(document.createTextNode(e[0]));
        var m = document.createElement('mark'); m.textContent = e[1]; td2.appendChild(m);
        td2.appendChild(document.createTextNode(e[2]));
        tr.appendChild(td1); tr.appendChild(td2);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      corps.appendChild(table);
      ouvrirPanneau();
    }

    function allerA(k) {
      var mk = marques[k];
      if (!mk || !document.body.contains(mk)) { return; }
      var vue = mk.closest('[data-vue]');
      if (vue && global.GuideVues) {
        var cle = cleDe(vue);
        if (!vue.classList.contains('active')) { global.GuideVues.afficher(cle, false); }
        if (location.hash !== '#vue-' + cle && history.pushState) { history.pushState(null, '', '#vue-' + cle); }
      }
      var det = mk.closest('tr[data-detail][hidden]');
      if (det) {
        var btn = document.querySelector('button.td-btn[aria-controls="' + det.id + '"]');
        if (btn) { basculerLigne(btn, true); }
      }
      [].slice.call(contenu.querySelectorAll('.find-hit.courant')).forEach(function (x) { x.classList.remove('courant'); });
      mk.classList.add('courant');
      fermerPanneau();
      var cible = mk;
      while (cible && cible.getClientRects && !cible.getClientRects().length) { cible = cible.parentElement; }
      if (cible && cible.scrollIntoView) { cible.scrollIntoView({ block: 'center' }); }
    }

    // Posé APRÈS celui de find-in-page : il passe donc après le surlignage et après la
    // réécriture du contenu, qu'il répare.
    champ.addEventListener('input', function () {
      recabler();
      [].slice.call(contenu.querySelectorAll('tr[data-detail][hidden]')).forEach(function (det) {
        if (!det.querySelector('mark.find-hit')) { return; }
        var btn = document.querySelector('button.td-btn[aria-controls="' + det.id + '"]');
        if (btn) { basculerLigne(btn, true); }
      });
      reparerSchemas();
      document.dispatchEvent(new CustomEvent('guide:recherche', { detail: { terme: champ.value } }));
      lister();
    });
    global.addEventListener('resize', placer);
    if (panneau) {
      panneau.addEventListener('click', function (e) {
        if (e.target.closest('.res-fermer')) { fermerPanneau(); rendreFocus(); return; }
        var ligne = e.target.closest('[data-occ]');
        if (!ligne) { return; }
        e.preventDefault();
        allerA(parseInt(ligne.getAttribute('data-occ'), 10));
      });
      panneau.addEventListener('keydown', function (e) { if (e.key === 'Escape') { fermerPanneau(); rendreFocus(); } });
      document.addEventListener('click', function (e) {
        if (panneau.hidden) { return; }
        if (panneau.contains(e.target) || (e.target.closest && e.target.closest('.barre-recherche'))) { return; }
        fermerPanneau();
      });
    }
    // Le focus seul ne suffit pas : après Échap, le champ garde le focus, et le cliquer ne
    // rouvrait rien (sonde du 24/09/2026).
    champ.addEventListener('focus', function () { if (!focusRendu) { ouvrirPanneau(); } });
    champ.addEventListener('click', ouvrirPanneau);
    champ.addEventListener('keydown', function (e) {
      if (!panneau || panneau.hidden) { return; }
      if (e.key === 'Escape') { e.preventDefault(); fermerPanneau(); }
      if (e.key === 'ArrowDown') {
        var premier = panneau.querySelector('a.res-aller');
        if (premier) { e.preventDefault(); premier.focus(); }
      }
    });
  }

  // Relais des chevrons de lignes dépliables : un chevron que le composant du socle n'a pas
  // câblé — ou plus — se bascule quand même. Posé sur le DOCUMENT, il survit aux réécritures.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('button.td-btn[aria-controls]') : null;
    if (btn && !btn.__tdCable) { basculerLigne(btn); }
  });

  global.GuideRecherche = {
    // Une page qui change LÉGITIMEMENT son contenu après le chargement donne le nouveau relevé.
    definirReleve: function (html) { brut = String(html); }
  };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})(window);
