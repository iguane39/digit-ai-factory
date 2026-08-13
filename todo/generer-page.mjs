#!/usr/bin/env node
/**
 * generer-page.mjs — génère todo/TODO.html : la vue de CONSULTATION du reste-à-faire.
 *
 * Vue générée à source unique (TODO.jsonl) — NE PAS ÉDITER LE HTML. Déterministe : deux
 * générations sur le même registre produisent le même fichier (horodatage = ts max des
 * événements ; aucun Date.now dans la sortie).
 *
 * Mise en page (refonte 12/08, mandat humain) : cartes larges (75-100 % de la largeur),
 * chaque item détaillé en PUCES, avec date de création, priorité de traitement (dérivée du
 * score) et impact sur la forge concernée (le coût constaté). Les colonnes « décider » et
 * « commentaire » ont été retirées (décisions prises hors page) — la vue est en lecture seule.
 *
 * Autonome : zéro réseau (polices en repli système). Charte digit-ai-page-html : tokens du
 * boilerplate, Roboto titres / DM Sans corps. R-30 : thème CLAIR par défaut + bascule sombre
 * câblée en en-tête (pattern S-G1, persistée, prefers-color-scheme 1re visite, print clair).
 *
 * Standard H (13/08, BEST-PRACTICES-HTML.md §H) : page à liste → filtres multi-sélection
 * Forge/Priorité (Tous/Aucun), recherche plein texte insensible aux accents + « Réinitialiser
 * les filtres » + compteur aria-live, KPIs cliquables filtrant les cartes par statut. Le KPI
 * « Clos » n'est PAS cliquable : ses éléments vivent à l'archive, hors page (H3). Tout est
 * viewer-only : à l'impression, filtres masqués et cartes toutes visibles.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SRC = join(ICI, "TODO.jsonl"), ARC = join(ICI, "TODO-ARCHIVE.jsonl"), OUT = join(ICI, "TODO.html");
const lire = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);
const esc = (s) => String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// L11 : un littéral de langage cité dans un texte (None, null…) se rend en <code> —
// c'est un jeton technique discuté, pas une fuite de producteur (TF-0089).
const escLit = (s) => esc(s).replace(
  /(^|[\s(«:;,—–-])(null|NULL|None|NONE|undefined|NaN|nil)(?=$|[\s)».;,:!?—–-])/g,
  "$1<code>$2</code>");

// Détail en puces (mandat 12/08) : sépare le constat de la proposition, puis découpe la
// proposition en vraies puces — énumération (a)/(1) d'abord, sinon points-virgules, sinon
// phrases. Un item sans structure reste un simple paragraphe (jamais de puce artificielle).
const puce = (s) => `<li>${s.trim().replace(/^[)\s.;,]+/, "").replace(/\s*[;.]\s*$/, "")}</li>`;
const rendDetail = (brut) => {
  const t = escLit(brut).trim();
  const m = t.match(/^([\s\S]*?)\b(Propositions?|Pistes?|Correctifs?)\s*:\s*([\s\S]*)$/);
  let lead, corps, labelProp = false;
  if (m && m[1].trim().length >= 20) { lead = m[1].trim(); corps = m[3].trim(); labelProp = true; }
  else {
    const i = t.indexOf(". ");
    if (i > 40 && i < t.length - 40) { lead = t.slice(0, i + 1).trim(); corps = t.slice(i + 1).trim(); }
    else { lead = t; corps = ""; }
  }
  let items = [];
  if (corps) {
    const enums = corps.split(/\s*\((?:[a-z]|\d{1,2})\)\s*/).map((s) => s.trim()).filter(Boolean);
    if (enums.length >= 2) items = enums;
    else {
      const semi = corps.split(/\s+;\s+/).map((s) => s.trim()).filter(Boolean);
      items = semi.length >= 2 ? semi : corps.split(/(?<=\.)\s+(?=[A-ZÀ-Þ])/).map((s) => s.trim()).filter((s) => s.length > 15);
    }
  }
  const leadHtml = lead ? `<p class="lead">${lead}</p>` : "";
  const listHtml = items.length
    ? `${labelProp ? `<p class="detail-label">Proposition</p>` : ""}<ul class="puces">${items.map(puce).join("")}</ul>`
    : "";
  return leadHtml + listHtml || `<p class="lead">${t}</p>`;
};

// Priorité de traitement dérivée de la valeur du score (gain × preuve ÷ effort, ×2 payé réel).
const prio = (v) => (v >= 5 ? { k: "haute", l: "Haute" } : v >= 3 ? { k: "moyenne", l: "Moyenne" } : { k: "basse", l: "Basse" });

const etats = new Map(); let tsMax = "";
for (const e of lire(SRC)) {
  if (e.ts > tsMax) tsMax = e.ts;
  if (e.ev === "creation") etats.set(e.id, { ...e });
  else if (e.ev === "maj" && etats.has(e.id)) Object.assign(etats.get(e.id), e);
}
const sceau = createHash("sha256").update(readFileSync(SRC)).digest("hex").slice(0, 12);
const nbArchives = new Set(lire(ARC).filter((e) => e.id).map((e) => e.id)).size;

const parForge = new Map();
for (const e of etats.values()) {
  const f = (e.forges_cibles_reelles || e.forges_cibles_initiales)[0];
  (parForge.get(f) ?? parForge.set(f, []).get(f)).push(e);
}
const ORDRE = ["en_cours", "decide", "candidat", "corrige", "ecarte"];
const compte = (s) => [...etats.values()].filter((e) => e.statut === s).length;

let sections = "";
for (const forge of [...parForge.keys()].sort()) {
  const items = parForge.get(forge).sort((a, b) => ORDRE.indexOf(a.statut) - ORDRE.indexOf(b.statut) || b.score.valeur - a.score.valeur);
  const cartes = items.map((e) => {
    const p = prio(e.score.valeur);
    const reel = e.preuve_du_cout ? `<span class="chip reel" title="coût payé lors d'un run réel">payé en réel</span>` : "";
    return `
        <article class="card s-${e.statut}" id="item-${e.id}" data-forge="${esc(forge)}" data-statut="${e.statut}" data-prio="${p.k}">
          <header class="card-head">
            <code class="tf-id">${e.id}</code>
            <span class="statut s-${e.statut}">${e.statut}</span>
            <span class="chip prio p-${p.k}" title="priorité dérivée du score (valeur ${e.score.valeur})">Priorité ${p.l}</span>
            ${reel}
          </header>
          <h3 class="card-titre">${esc(e.titre)}</h3>
          <div class="card-detail">${rendDetail(e.contenu)}</div>
          <dl class="card-meta">
            <div><dt>Créé le</dt><dd>${esc(e.date_demande)}</dd></div>
            <div><dt>Priorité</dt><dd>${p.l} <span class="meta-sub">(score ${e.score.valeur} — gain ${e.score.gain} × preuve ${e.score.preuve} ÷ effort ${e.score.effort})</span></dd></div>
            <div class="impact"><dt>Impact sur ${esc(forge)}</dt><dd>${e.preuve_du_cout ? escLit(e.preuve_du_cout) : "<span class=\"meta-sub\">non chiffré</span>"}</dd></div>
            <div><dt>Demandeur</dt><dd title="run, session ou humain à l'origine de la candidature">${esc(e.demandeur)}</dd></div>
            ${e.motif_ecart ? `<div class="impact"><dt>Motif d'écart (TF-0157)</dt><dd>${escLit(e.motif_ecart)}</dd></div>` : ""}
          </dl>
        </article>`;
  }).join("");
  sections += `
    <section id="${esc(forge).replace(/[^a-z-]/g, "")}">
      <h2>${esc(forge)} <span class="badge" title="${items.length} item(s) actifs ciblant ${esc(forge)}">${items.length}</span></h2>
      <p class="ch-apprend meta">Reste-à-faire ciblant <strong>${esc(forge)}</strong> — trié par statut puis priorité décroissante.</p>
      <div class="cartes">${cartes}
      </div>
    </section>`;
}

// H1 — dropdowns multi-sélection (Tous / Aucun), un par dimension catégorielle.
const FORGES = [...parForge.keys()].sort();
const LPRIO = { haute: "Haute", moyenne: "Moyenne", basse: "Basse" };
const PRIOS = ["haute", "moyenne", "basse"]
  .filter((k) => [...etats.values()].some((e) => prio(e.score.valeur).k === k))
  .map((k) => ({ v: k, l: LPRIO[k] }));
const dd = (dim, label, options) => `
      <div class="dropdown" data-dim="${dim}">
        <button type="button" class="dd-btn" aria-expanded="false" aria-controls="dd-${dim}">${label} (<span class="dd-n">${options.length}</span>) <span aria-hidden="true">▾</span></button>
        <div class="dd-panel" id="dd-${dim}" role="group" aria-label="Filtre ${label}" hidden>
          <div class="dd-actions"><button type="button" data-act="tous">Tous</button><button type="button" data-act="aucun">Aucun</button></div>
          ${options.map((o) => `<label><input type="checkbox" value="${esc(o.v)}" checked> ${esc(o.l)}</label>`).join("\n          ")}
        </div>
      </div>`;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<!-- S-G1 (1/4, R-30 amendé TF-0158 le 13/08) — pose data-theme avant la 1re peinture (zéro
     flash). CLAIR PAR DÉFAUT STRICT : l'auto-sombre hérité de l'OS est retiré (retour humain
     du 13/08) ; le sombre est un choix du lecteur, persisté. Sans defer (le WARN « script
     bloquant en head » de check_html est l'exception assumée qui évite le flash). -->
<script>
(function () {
  var s = null;
  try { s = localStorage.getItem('digitai-theme'); } catch (e) {}
  document.documentElement.setAttribute('data-theme', s === 'dark' ? 'dark' : 'light');
})();
</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digit-AI — TODO-FORGE · Reste à faire — V${esc(tsMax.slice(0, 10).replaceAll("-", ""))}</title>
  <meta name="description" content="Reste-à-faire du registre TODO-FORGE : candidats à décider, décidés, en cours — détaillés en puces, avec date de création, priorité de traitement et impact sur la forge concernée.">
  <meta name="theme-color" content="#2563EB">
  <meta name="color-scheme" content="light dark">
  <!-- Favicon-lettre (13/08) : « F » = Forge (projet). -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3Ctext x='32' y='44' font-family='Segoe UI,Roboto,sans-serif' font-size='38' font-weight='700' fill='white' text-anchor='middle'%3EF%3C/text%3E%3C/svg%3E">
  <style>
    :root {
      --blue:#2563EB; --bg:#FAFBFF; --surface:#FFFFFF; --card:#FFFFFF; --ink:#0F172A;
      --muted:#64748B; --faint:#94A3B8; --line:#E6EAF2;
      --amber:#D97706; --amber-fill:#FFFBEB; --amber-line:#FDE9C8;
      --teal:#0E9488; --teal-fill:#EFFDFB; --teal-line:#C7F0EA;
      --green:#15803D; --green-fill:#F2FCF5; --green-line:#CFEEDD;
      --r:12px; --r-sm:8px;
      --head:"Roboto",system-ui,-apple-system,"Segoe UI",sans-serif;
      --sans:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
      --mono:"JetBrains Mono",ui-monospace,"Consolas",monospace;
    }
    /* S-G1 (2/4, R-30) — tokens sombres : une source, deux projections. */
    :root[data-theme="dark"] {
      --bg:#0B1220; --surface:#121B2E; --card:#121B2E; --ink:#EEF2F8;
      --muted:#A9B4C4; --faint:#7C8AA0; --line:#263248; --blue:#7DA2F5;
      --amber:#FBBF6D; --amber-fill:#2B2210; --amber-line:#4A3A18;
      --teal:#5FE6D6; --teal-fill:#0E2A27; --teal-line:#164E48;
      --green:#7BE0A0; --green-fill:#0F2A1B; --green-line:#1C4A30;
    }
    *{box-sizing:border-box} html{-webkit-text-size-adjust:100%}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;font-size:16px}
    /* 75-100 % de la fenêtre, toujours : 94vw sous ~1787px, plafond confort 1680px, plancher 75vw au-delà */
    .wrap{width:clamp(75vw,1680px,94vw);margin:0 auto;padding:0 4px 64px}
    h1,h2,h3{font-family:var(--head);line-height:1.25}
    h2{font-size:1.3rem;font-weight:800;margin:1.8em 0 .2em}
    code{font-family:var(--mono);font-size:.9em}
    .meta{color:var(--muted);font-size:.85rem;margin:.4em 0 0}
    .meta-sub{color:var(--muted);font-weight:400;font-size:.9em}
    .badge{font-family:var(--mono);font-size:.8rem;color:var(--muted);font-weight:400}
    a{color:var(--blue)}
    /* en-tête sticky : marque + bascule sombre (S-G1 3/4) */
    .entete{position:sticky;top:0;z-index:6;background:var(--bg);border-bottom:1px solid var(--line);
      padding:14px 0 10px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
    .entete h1{margin:0;font-size:1.35rem;font-weight:800;flex:1 1 260px}
    .entete .meta{margin:0}
    .theme-toggle{appearance:none;border:1px solid var(--line);background:var(--surface);color:var(--ink);
      border-radius:var(--r-sm);width:44px;height:44px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
    .theme-toggle:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    .theme-toggle .icon-sun{display:none} :root[data-theme="dark"] .theme-toggle .icon-moon{display:none}
    :root[data-theme="dark"] .theme-toggle .icon-sun{display:inline}
    /* bande KPI */
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0 6px}
    .kpi{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;display:flex;flex-direction:column;gap:4px;break-inside:avoid}
    .kpi-label{color:var(--muted);font-size:.8rem} .kpi-value{font-family:var(--head);font-weight:800;font-size:1.6rem}
    .kpi-hint{color:var(--muted);font-size:.75rem}
    /* H3 — KPI cliquable : filtre les cartes par statut (re-clic = tout réafficher) */
    button.kpi{font:inherit;text-align:left;cursor:pointer;appearance:none}
    button.kpi[aria-pressed="true"]{border-color:var(--blue);box-shadow:inset 0 0 0 1px var(--blue)}
    button.kpi:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    /* H1/H2 — barre d'outils : recherche + dropdowns multi-sélection + réinitialisation + compteur */
    .toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0 0}
    .toolbar input[type="search"]{flex:1 1 320px;font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);padding:9px 12px}
    .toolbar input[type="search"]:focus-visible{outline:3px solid var(--blue);outline-offset:1px}
    .dropdown{position:relative}
    .dd-btn{font:inherit;font-weight:600;color:var(--blue);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);padding:8px 12px;cursor:pointer}
    .dd-btn:focus-visible,.dd-panel button:focus-visible,#reinit:focus-visible,.lien-btn:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    .dd-panel{position:absolute;top:calc(100% + 6px);left:0;z-index:7;min-width:220px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);box-shadow:0 8px 24px rgba(15,23,42,.14);padding:10px 12px}
    .dd-actions{display:flex;gap:14px;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:8px}
    .dd-actions button{font:inherit;font-weight:600;color:var(--blue);background:none;border:none;cursor:pointer;padding:2px 4px}
    .dd-panel label{display:flex;gap:8px;align-items:center;padding:5px 2px;cursor:pointer}
    #reinit{font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);padding:8px 12px;cursor:pointer}
    .compteur{color:var(--muted);font-size:.85rem}
    .masque{display:none}
    .etat-vide{background:var(--surface);border:1px dashed var(--line);border-radius:var(--r);padding:18px 20px;color:var(--muted);margin-top:14px}
    .lien-btn{font:inherit;color:var(--blue);background:none;border:none;cursor:pointer;text-decoration:underline;padding:0}
    .legende{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0 0;color:var(--muted);font-size:.85rem}
    .leg-item{display:inline-flex;align-items:center;gap:6px}
    .leg-swatch{width:12px;height:12px;border-radius:3px;border:1px solid var(--line);display:inline-block}
    nav.toc{margin:14px 0 0;font-size:.9rem} nav.toc a{text-decoration:none;margin-right:14px} nav.toc a:hover{text-decoration:underline}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    /* cartes */
    .cartes{display:flex;flex-direction:column;gap:16px;margin-top:10px}
    .card{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--faint);
      border-radius:var(--r);padding:18px 20px;break-inside:avoid}
    .card.s-candidat{border-left-color:var(--blue)} .card.s-decide{border-left-color:var(--teal)}
    .card.s-en_cours{border-left-color:var(--amber)} .card.s-corrige{border-left-color:var(--green)}
    .card-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .tf-id{font-family:var(--mono);font-size:.85rem;color:var(--muted)}
    .card-titre{font-size:1.08rem;font-weight:700;margin:.5em 0 .3em}
    /* chips : texte en --ink (AA garanti dans les 2 thèmes) ; la couleur passe par le fond
       teinté + la bordure d'accent, jamais par le texte seul (petit corps < 4.5:1 sinon). */
    .statut,.chip{font-family:var(--mono);font-size:.74rem;padding:2px 9px;border-radius:999px;border:1px solid var(--line);white-space:nowrap;color:var(--ink)}
    .s-candidat{background:var(--surface)} .s-decide{background:var(--teal-fill);border-color:var(--teal-line)}
    .s-en_cours{background:var(--amber-fill);border-color:var(--amber-line)} .s-corrige{background:var(--green-fill);border-color:var(--green-line)}
    .prio.p-haute{background:var(--amber-fill);border-color:var(--amber-line)}
    .prio.p-moyenne{background:var(--teal-fill);border-color:var(--teal-line)}
    .prio.p-basse{background:var(--surface);color:var(--muted)}
    .chip.reel{background:var(--surface);color:var(--muted)}
    .card-detail .lead{margin:.2em 0 .4em}
    .detail-label{font-family:var(--head);font-weight:700;font-size:.82rem;color:var(--muted);margin:.6em 0 .2em;text-transform:uppercase;letter-spacing:.03em}
    .puces{margin:.2em 0 .4em;padding-left:1.2em} .puces li{margin:.28em 0}
    .card-detail,.card-detail li,.card-meta dd{overflow-wrap:anywhere}
    .card-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px 20px;margin:14px 0 0;padding-top:12px;border-top:1px solid var(--line)}
    .card-meta .impact{grid-column:1/-1}
    .card-meta dt{font-family:var(--head);font-weight:700;font-size:.76rem;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
    .card-meta dd{margin:.2em 0 0;font-size:.92rem}
    footer{margin-top:44px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:16px}
    @media (max-width:640px){.wrap{width:auto;padding:0 12px 48px} .entete h1{font-size:1.1rem} .card{padding:14px}}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @page{margin:14mm}
    /* S-G1 (2/4 suite, R-30.2) — impression toujours claire, quel que soit le thème écran */
    @media print{
      :root,:root[data-theme="dark"]{
        --bg:#FFFFFF;--surface:#FFFFFF;--card:#FFFFFF;--ink:#0F172A;--muted:#64748B;--faint:#94A3B8;--line:#E6EAF2;--blue:#2563EB;
        --amber:#D97706;--amber-fill:#FFFBEB;--amber-line:#FDE9C8;--teal:#0E9488;--teal-fill:#EFFDFB;--teal-line:#C7F0EA;--green:#15803D;--green-fill:#F2FCF5;--green-line:#CFEEDD;
      }
      body{background:#fff} .entete{position:static} .theme-toggle,nav.toc,.toolbar{display:none}
      /* le papier montre tout : les filtres écran ne masquent rien à l'impression */
      article.card.masque,main>section.masque{display:block}
      .card{break-inside:avoid} a[href^="http"]::after{content:" (" attr(href) ")";font-size:.85em;color:var(--muted)}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="entete">
      <h1>TODO-FORGE — reste à faire</h1>
      <p class="meta">sceau <code>${sceau}</code> · dernier événement ${esc(tsMax)}</p>
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Bascule thème sombre" aria-pressed="false">
        <svg class="icon-moon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        <svg class="icon-sun" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </header>
    <p>Seul le <strong>reste-à-faire</strong> vit ici — les items clos partent à l'archive (<code>node todo\\archiver.mjs</code>). Chaque item est détaillé en puces, avec sa date de création, sa priorité de traitement (dérivée du score) et son impact sur la forge concernée. La décision reste humaine et se prend hors de cette page (« décide TF-xxxx »).</p>
    <!-- H3 : les KPIs comptant des éléments AFFICHÉS filtrent la liste au clic ;
         « Clos » compte des éléments hors page (archive) : informatif, pas cliquable. -->
    <div class="kpis">
      <button type="button" class="kpi" data-statut="candidat" aria-pressed="false" title="${compte("candidat")} candidat(s) en attente de décision humaine — clic : n'afficher qu'eux"><span class="kpi-label">À décider</span><span class="kpi-value">${compte("candidat")}</span><span class="kpi-hint">candidats — la décision est humaine · clic&nbsp;: filtrer</span></button>
      <button type="button" class="kpi" data-statut="decide" aria-pressed="false" title="${compte("decide")} item(s) décidés dont les travaux ne sont pas ouverts — clic : n'afficher qu'eux"><span class="kpi-label">Décidés, à lancer</span><span class="kpi-value">${compte("decide")}</span><span class="kpi-hint">mandat donné, travaux non ouverts · clic&nbsp;: filtrer</span></button>
      <button type="button" class="kpi" data-statut="en_cours" aria-pressed="false" title="${compte("en_cours")} campagne(s) ouvertes au registre — clic : n'afficher qu'elles"><span class="kpi-label">En cours</span><span class="kpi-value">${compte("en_cours")}</span><span class="kpi-hint">campagnes ouvertes au registre · clic&nbsp;: filtrer</span></button>
      <div class="kpi" title="${nbArchives} item(s) clos déplacés vers todo\\TODO-ARCHIVE.jsonl — hors de cette page, donc non filtrable ici"><span class="kpi-label">Clos, archivés</span><span class="kpi-value">${nbArchives}</span><span class="kpi-hint">hors vue — <code>todo\\TODO-ARCHIVE.jsonl</code></span></div>
    </div>
    <p class="legende">
      <span class="leg-item"><span class="leg-swatch" style="background:var(--blue)"></span>candidat</span>
      <span class="leg-item"><span class="leg-swatch" style="background:var(--teal)"></span>décidé</span>
      <span class="leg-item"><span class="leg-swatch" style="background:var(--amber)"></span>en cours</span>
      <span class="leg-item">Priorité <strong>Haute</strong> ≥ 5 · <strong>Moyenne</strong> 3-4 · <strong>Basse</strong> &lt; 3 (score = gain × preuve ÷ effort, ×2 si payé en réel)</span>
    </p>
    <!-- H1/H2 — filtres, recherche (insensible aux accents), réinitialisation, compteur aria-live -->
    <div class="toolbar" role="search" aria-label="Filtrer le reste-à-faire">
      <input type="search" id="recherche" placeholder="Rechercher (titre, détail, id TF, forge, demandeur…)" aria-label="Rechercher dans les items — insensible aux accents">
      ${dd("forge", "Forge", FORGES.map((f) => ({ v: f, l: f })))}
      ${dd("prio", "Priorité", PRIOS)}
      <button id="reinit" type="button">Réinitialiser les filtres</button>
      <span id="compteur" class="compteur" aria-live="polite">${etats.size} / ${etats.size} item(s) affichés</span>
    </div>
    <p id="vide" class="etat-vide" hidden>Aucun item ne correspond aux filtres ou à la recherche — <button type="button" id="vide-reinit" class="lien-btn">réinitialiser</button>.</p>
    <nav class="toc" aria-label="Sommaire">${[...parForge.keys()].sort().map((f) => `<a href="#${esc(f).replace(/[^a-z-]/g, "")}"><strong>${esc(f)}</strong> <span class="toc-d">${parForge.get(f).length} item(s) reste-à-faire</span></a>`).join("")}</nav>
    <main>${sections}
    </main>
    <footer>Vue générée par <code>todo/generer-page.mjs</code> — ne pas éditer. Source unique : <code>todo/TODO.jsonl</code>. Détail brut d'un item : <code>grep '"id":"TF-xxxx"' todo/TODO.jsonl</code>.</footer>
  </div>
  <!-- S-G1 (4/4, R-30) — câblage : persistance + aria-pressed, aucune bascule muette -->
  <script>
  (function () {
    var bouton = document.getElementById('theme-toggle');
    var racine = document.documentElement;
    function appliquer(theme) {
      racine.setAttribute('data-theme', theme);
      localStorage.setItem('digitai-theme', theme);
      bouton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    bouton.setAttribute('aria-pressed', racine.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    bouton.addEventListener('click', function () {
      appliquer(racine.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  })();
  </script>
  <!-- Standard H (13/08) — filtres + recherche + KPIs cliquables, tout câblé (loi 1) -->
  <script>
  (function () {
    var cartes = Array.prototype.slice.call(document.querySelectorAll('article.card'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section'));
    var kpis = Array.prototype.slice.call(document.querySelectorAll('button.kpi'));
    var recherche = document.getElementById('recherche');
    var compteur = document.getElementById('compteur');
    var vide = document.getElementById('vide');
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); };
    cartes.forEach(function (c) { c.dataset.texte = norm(c.textContent); });
    var etatKpi = null;
    function coches(dim) {
      var set = {};
      document.querySelectorAll('#dd-' + dim + ' input:checked').forEach(function (i) { set[i.value] = true; });
      return set;
    }
    function majDd(dim) {
      var n = document.querySelectorAll('#dd-' + dim + ' input:checked').length;
      document.querySelector('[data-dim="' + dim + '"] .dd-n').textContent = n;
    }
    function fermerPanneaux() {
      document.querySelectorAll('.dd-panel').forEach(function (p) { p.hidden = true; });
      document.querySelectorAll('.dd-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
    function appliquer() {
      var q = norm(recherche.value.trim());
      var forges = coches('forge'), prios = coches('prio');
      var visibles = 0;
      cartes.forEach(function (c) {
        var ok = (!etatKpi || c.dataset.statut === etatKpi)
          && !!forges[c.dataset.forge] && !!prios[c.dataset.prio]
          && (!q || c.dataset.texte.indexOf(q) !== -1);
        c.classList.toggle('masque', !ok);
        if (ok) visibles++;
      });
      sections.forEach(function (s) {
        s.classList.toggle('masque', s.querySelectorAll('article.card:not(.masque)').length === 0);
      });
      compteur.textContent = visibles + ' / ' + cartes.length + ' item(s) affichés';
      vide.hidden = visibles !== 0;
      majDd('forge'); majDd('prio');
    }
    kpis.forEach(function (k) {
      k.addEventListener('click', function () {
        etatKpi = etatKpi === k.dataset.statut ? null : k.dataset.statut;
        kpis.forEach(function (a) { a.setAttribute('aria-pressed', a.dataset.statut === etatKpi ? 'true' : 'false'); });
        appliquer();
      });
    });
    document.querySelectorAll('.dropdown').forEach(function (d) {
      var btn = d.querySelector('.dd-btn'), panel = d.querySelector('.dd-panel');
      btn.addEventListener('click', function () {
        var etaitOuvert = !panel.hidden;
        fermerPanneaux();
        if (!etaitOuvert) { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
      });
      d.addEventListener('click', function (ev) {
        var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
        if (act) panel.querySelectorAll('input').forEach(function (i) { i.checked = act === 'tous'; });
        if (act || ev.target.tagName === 'INPUT') appliquer();
      });
    });
    document.addEventListener('click', function (ev) {
      if (!ev.target.closest('.dropdown')) fermerPanneaux();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') fermerPanneaux();
    });
    recherche.addEventListener('input', appliquer);
    function reinitialiser() {
      recherche.value = '';
      etatKpi = null;
      kpis.forEach(function (a) { a.setAttribute('aria-pressed', 'false'); });
      document.querySelectorAll('.dd-panel input').forEach(function (i) { i.checked = true; });
      appliquer();
    }
    document.getElementById('reinit').addEventListener('click', reinitialiser);
    document.getElementById('vide-reinit').addEventListener('click', reinitialiser);
  })();
  </script>
</body>
</html>
`;
writeFileSync(OUT, html);
console.log(`TODO.html générée — ${etats.size} items, ${parForge.size} forges (sceau ${sceau}, cartes + bascule R-30)`);
