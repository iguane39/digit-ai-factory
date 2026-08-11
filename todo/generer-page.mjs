#!/usr/bin/env node
/**
 * generer-page.mjs — génère todo/TODO.html : la vue INTERACTIVE du registre TODO-FORGE.
 * Consultation (filtres par table), cases à cocher « décider », commentaires libres, et
 * EXPORT JSON à remettre au pilot (traité par appliquer-export.mjs → maj du registre).
 *
 * Vue générée à source unique (TODO.jsonl) — NE PAS ÉDITER LE HTML. Déterministe : deux
 * générations sur le même registre produisent le même fichier (horodatage = ts max des
 * événements ; l'heure d'export, elle, est prise au clic, côté navigateur).
 * Autonome : zéro réseau (polices en repli système, composant filtres inline avec provenance).
 * Charte digit-ai-page-html : tokens du boilerplate, Roboto titres / DM Sans corps, light.
 * Les cases et commentaires persistent en localStorage (clé par id) — l'export est la remise.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
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

// L12 : une énumération « : (1) … ; (2) … ; (3) … » séquentielle se rend en VRAIE liste
// ordonnée, pas en prose à points-virgules. Marqueurs exigés : précédés de : ou ;,
// numérotés 1..n — une référence isolée « proposition (2) » ne déclenche rien (TF-0089).
const rendContenu = (brut) => {
  const t = escLit(brut);
  const seq = [...t.matchAll(/([:;])\s*\((\d+)\)\s+/g)];
  if (seq.length < 2 || !seq.every((x, i) => Number(x[2]) === i + 1)) return `<p>${t}</p>`;
  const intro = t.slice(0, seq[0].index + 1);
  const items = seq.map((x, i) =>
    t.slice(x.index + x[0].length, i + 1 < seq.length ? seq[i + 1].index : undefined).replace(/\s*[;.]\s*$/, ""));
  // Un item qui enchaîne lui-même ≥ 3 clauses au point-virgule redevient de la prose-tableau
  // (L12) : la première clause porte l'item, les suivantes descendent en sous-liste.
  const li = (s) => {
    const clauses = s.split(/\s+;\s+/);
    return clauses.length >= 3
      ? `${clauses[0]}<ul>${clauses.slice(1).map((c) => `<li>${c}</li>`).join("")}</ul>`
      : s;
  };
  return `<p>${intro}</p><ol>${items.map((s) => `<li>${li(s)}</li>`).join("")}</ol>`;
};

const etats = new Map(); let tsMax = "";
for (const e of lire(SRC)) {
  if (e.ts > tsMax) tsMax = e.ts;
  if (e.ev === "creation") etats.set(e.id, { ...e });
  else if (e.ev === "maj" && etats.has(e.id)) Object.assign(etats.get(e.id), e);
}
const sceau = createHash("sha256").update(readFileSync(SRC)).digest("hex").slice(0, 12);
const nbArchives = new Set(lire(ARC).filter((e) => e.id).map((e) => e.id)).size;

// Composant filtres maison (D-12), inliné avec provenance — jamais de réseau.
const filtresSrc = join(homedir(), ".claude", "skills", "digit-ai-page-html", "assets", "table-filters.js");
const filtresJs = existsSync(filtresSrc) ? readFileSync(filtresSrc, "utf8") : "";

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
  const lignes = items.map((e) => {
    const meta = `<p class="meta">Demandeur : ${esc(e.demandeur)} · ${esc(e.date_demande)} · gain ${e.score.gain} × preuve ${e.score.preuve} ÷ effort ${e.score.effort}${e.preuve_du_cout ? ` · <strong>payé en réel</strong> — ${escLit(e.preuve_du_cout)}` : ""}${e.commentaire_humain ? `<br>Commentaire précédent : ${esc(e.commentaire_humain)}` : ""}</p>`;
    // L9 : un dépliant qui cache moins de 200 caractères n'a rien à cacher — afficher en place.
    const cacheTxt = `${e.contenu} ${e.demandeur} ${e.date_demande} ${e.preuve_du_cout || ""} ${e.commentaire_humain || ""}`;
    const corps = cacheTxt.length < 200
      ? `<strong>${esc(e.titre)}</strong>${rendContenu(e.contenu)}${meta}`
      : `<details><summary><strong>${esc(e.titre)}</strong></summary>
              ${rendContenu(e.contenu)}
              ${meta}
            </details>`;
    return `
        <tr>
          <td class="c-coche" data-th="décider"><input type="checkbox" class="decider" data-id="${e.id}" aria-label="Décider ${e.id}"${e.statut !== "candidat" ? " disabled" : ""}></td>
          <td class="c-id" data-th="id"><code>${e.id}</code></td>
          <td data-th="statut"><span class="statut s-${e.statut}">${e.statut}</span></td>
          <td class="c-score" data-th="score">${e.score.valeur}</td>
          <td data-th="item">${corps}</td>
          <td class="c-comm" data-th="commentaire"><textarea class="commentaire" data-id="${e.id}" rows="1" aria-label="Commentaire ${e.id}" placeholder="commentaire…"></textarea></td>
        </tr>`;
  }).join("");
  sections += `
    <section id="${esc(forge).replace(/[^a-z-]/g, "")}">
      <h2>${esc(forge)} <span class="badge" title="${items.length} item(s) actifs ciblant ${esc(forge)}">${items.length}</span></h2>
      <p class="ch-apprend meta">Ce chapitre liste les ${items.length} item(s) du reste-à-faire dont la cible est ${esc(forge)} : cocher pour décider (candidats), commenter pour préciser — le score ordonne par valeur attendue.</p>
      <div class="scroll"><table data-filterable>
        <caption class="sr-only">Reste-à-faire ciblant ${esc(forge)} — colonnes : décision (case), identifiant, statut, score, item dépliable, commentaire libre. Tri au clic sur les en-têtes fléchés.</caption>
        <thead><tr><th scope="col">✓</th><th scope="col" data-sort tabindex="0">id</th><th scope="col" data-sort tabindex="0">statut</th><th scope="col" data-sort tabindex="0" aria-describedby="note-score">score</th><th scope="col">item</th><th scope="col">commentaire</th></tr></thead>
        <tbody>${lignes}
        </tbody>
      </table></div>
    </section>`;
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digit-AI — TODO-FORGE · Reste à faire — V${esc(tsMax.slice(0, 10).replaceAll("-", ""))}</title>
  <meta name="description" content="Reste-à-faire du registre TODO-FORGE : candidats à décider, décidés, en cours — décisions et commentaires à exporter pour le pilot.">
  <meta name="theme-color" content="#2563EB">
  <meta name="color-scheme" content="light">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3C/svg%3E">
  <style>
    :root {
      --blue:#2563EB; --bg:#FAFBFF; --surface:#FFFFFF; --ink:#0F172A; --muted:#64748B;
      --line:#E6EAF2; --amber:#B45309; --amber-fill:#FFFBEB; --teal:#0E9488; --teal-fill:#EFFDFB;
      --green:#15803D; --green-fill:#F2FCF5; --r:12px; --r-sm:8px;
      --head:"Roboto",system-ui,-apple-system,"Segoe UI",sans-serif;
      --sans:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
      --mono:"JetBrains Mono",ui-monospace,"Consolas",monospace;
    }
    *{box-sizing:border-box} html{-webkit-text-size-adjust:100%}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;font-size:16px}
    .wrap{max-width:1100px;margin:0 auto;padding:32px 24px 64px}
    h1,h2{font-family:var(--head);font-weight:800;line-height:1.2} h1{font-size:1.8rem;margin:0 0 .25em}
    h2{font-size:1.25rem;font-weight:700;margin:1.6em 0 .5em}
    code{font-family:var(--mono);font-size:.9em}
    .meta{color:var(--muted);font-size:.85rem;margin:.4em 0 0}
    td .meta,td details p,td li{overflow-wrap:anywhere} /* jetons longs (ids, chemins) : jamais de débordement V1 */
    .badge{font-family:var(--mono);font-size:.75rem;color:var(--muted);font-weight:400}
    .scroll{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r)}
    table{border-collapse:collapse;width:100%;font-size:.92rem}
    th{font-family:var(--head);font-weight:700;text-align:left;padding:10px 12px;border-bottom:2px solid var(--line);background:var(--surface)}
    td{padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}
    tr:last-child td{border-bottom:none}
    .c-coche,.c-id,.c-score{white-space:nowrap} .c-comm{min-width:180px}
    .statut{font-family:var(--mono);font-size:.78rem;padding:2px 8px;border-radius:999px;border:1px solid var(--line)}
    .s-candidat{background:var(--surface)} .s-decide{background:var(--teal-fill);color:var(--teal)}
    .s-en_cours{background:var(--amber-fill);color:var(--amber)} .s-corrige{background:var(--green-fill);color:var(--green)}
    details summary{cursor:pointer} details p{margin:.5em 0 0}
    textarea.commentaire{width:100%;font-family:var(--sans);font-size:.88rem;border:1px solid var(--line);border-radius:var(--r-sm);padding:6px 8px;resize:vertical;background:var(--surface);color:var(--ink)}
    input.decider{width:18px;height:18px;accent-color:var(--blue)}
    /* B1 — header sticky (marque · méta · toolbar B13), tokens seulement */
    .entete{position:sticky;top:0;z-index:6;background:var(--bg);border-bottom:1px solid var(--line);padding:14px 0 10px;display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}
    .entete h1{margin:0;font-size:1.35rem}
    .entete .meta{margin:0;flex:1 1 260px}
    button#exporter{font-family:var(--head);font-weight:700;font-size:.95rem;background:var(--blue);color:#fff;border:none;border-radius:var(--r-sm);padding:10px 18px;cursor:pointer;min-height:44px}
    button#exporter:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible,a:focus-visible,th[data-sort]:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    #bilan{color:var(--muted);font-size:.9rem}
    /* B2 — bande KPI */
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0 6px}
    .kpi{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;display:flex;flex-direction:column;gap:4px;break-inside:avoid}
    .kpi-label{color:var(--muted);font-size:.8rem}
    .kpi-value{font-family:var(--head);font-weight:800;font-size:1.6rem;color:var(--ink)}
    .kpi-hint{color:var(--muted);font-size:.75rem}
    /* B7 — légende des statuts (swatch + libellé, la couleur jamais seule) */
    .legende{display:flex;gap:16px;flex-wrap:wrap;margin:6px 0 0;color:var(--muted);font-size:.85rem}
    .leg-item{display:inline-flex;align-items:center;gap:6px}
    .leg-swatch{width:12px;height:12px;border-radius:3px;border:1px solid var(--line);display:inline-block}
    /* sommaire */
    nav.toc{margin:14px 0 0;font-size:.9rem}
    nav.toc a{color:var(--blue);text-decoration:none;margin-right:14px}
    nav.toc a:hover{text-decoration:underline}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    /* B6 — thead sticky dans le conteneur + tri au clic */
    .scroll{max-height:70vh;overflow:auto}
    thead th{position:sticky;top:0;z-index:2}
    th[data-sort]{cursor:pointer;user-select:none}
    th[data-sort]::after{content:" ↕";color:var(--muted);font-weight:400}
    th[data-sort="asc"]::after{content:" ↑"} th[data-sort="desc"]::after{content:" ↓"}
    section{break-inside:avoid-page}
    footer{margin-top:40px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:16px}
    @media (max-width:900px){.wrap{padding:16px 12px 48px} .entete h1{font-size:1.15rem} table{font-size:.85rem} td,th{padding:6px 8px} .c-comm{min-width:120px}
      thead th{position:static} .scroll{max-height:none}}
    /* ≤ 640px : la table se replie en cartes empilées (V1 : rien ne déborde du viewport) —
       les libellés de colonne viennent de data-th, l'en-tête sort du flux visuel */
    @media (max-width:640px){
      thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
      table,tbody,tr,td{display:block;width:100%}
      tr{border-bottom:2px solid var(--line);padding:8px 0}
      td{border-bottom:none;padding:4px 12px;display:flex;gap:10px;align-items:baseline}
      td::before{content:attr(data-th);font-family:var(--head);font-weight:700;color:var(--muted);min-width:86px;flex:0 0 86px}
      .c-coche,.c-id,.c-score{white-space:normal} .c-comm{min-width:0}
    }
    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @page{margin:14mm}
    @media print{.entete,textarea,.decider,nav.toc{display:none} .scroll{max-height:none;overflow:visible} tr,section .kpi{break-inside:avoid}}
  </style>
</head>
<body>
  <div class="wrap">
    <header class="entete">
      <h1>TODO-FORGE — reste à faire</h1>
      <p class="meta">sceau <code>${sceau}</code> · dernier événement ${esc(tsMax)}</p>
      <button id="exporter" type="button">Exporter les décisions</button>
      <span id="bilan" aria-live="polite">0 coché · 0 commentaire</span>
    </header>
    <p>Seul le <strong>reste-à-faire</strong> vit ici — les items clos partent à l'archive (<code>node todo\\archiver.mjs</code>). Coche les items à <strong>décider</strong> (candidats seulement), commente librement, puis <strong>Exporter</strong> : remets le fichier téléchargé au pilot — appliqué par <code>appliquer-export.mjs</code> (décisions tracées, commentaires conservés). Cases et commentaires persistent dans ce navigateur jusqu'à l'export.</p>
    <p class="meta" id="note-score">La colonne « score » = <strong>valeur</strong> de l'item, calculée <code>gain × preuve ÷ effort</code> (composantes visibles dans le détail de chaque ligne) ; tri par défaut : statut puis score décroissant, ou au clic sur les en-têtes fléchés.</p>
    <div class="kpis">
      <div class="kpi" title="${compte("candidat")} candidat(s) en attente de décision humaine"><span class="kpi-label">À décider</span><span class="kpi-value">${compte("candidat")}</span><span class="kpi-hint">candidats — la décision est humaine</span></div>
      <div class="kpi" title="${compte("decide")} item(s) décidés dont les travaux ne sont pas ouverts"><span class="kpi-label">Décidés, à lancer</span><span class="kpi-value">${compte("decide")}</span><span class="kpi-hint">mandat donné, travaux non ouverts</span></div>
      <div class="kpi" title="${compte("en_cours")} campagne(s) ouvertes au registre"><span class="kpi-label">En cours</span><span class="kpi-value">${compte("en_cours")}</span><span class="kpi-hint">campagnes ouvertes au registre</span></div>
      <div class="kpi" title="${nbArchives} item(s) clos déplacés vers todo\\TODO-ARCHIVE.jsonl"><span class="kpi-label">Clos, archivés</span><span class="kpi-value">${nbArchives}</span><span class="kpi-hint">hors vue — <code>todo\\TODO-ARCHIVE.jsonl</code></span></div>
    </div>
    <p class="legende"><span class="leg-item"><span class="leg-swatch" style="background:var(--surface)"></span>candidat</span><span class="leg-item"><span class="leg-swatch" style="background:var(--teal-fill)"></span>décidé</span><span class="leg-item"><span class="leg-swatch" style="background:var(--amber-fill)"></span>en cours</span></p>
    <nav class="toc" aria-label="Sommaire">${[...parForge.keys()].sort().map((f) => `<a href="#${esc(f).replace(/[^a-z-]/g, "")}"><strong>${esc(f)}</strong> <span class="toc-d">${parForge.get(f).length} item(s) reste-à-faire ciblant ${esc(f)}</span></a>`).join("")}</nav>
    <main>${sections}
    </main>
    <footer>Vue générée par <code>todo/generer-page.mjs</code> — ne pas éditer. Source unique : <code>todo/TODO.jsonl</code>. Détail d'un item : <code>grep '"id":"TF-xxxx"' todo/TODO.jsonl</code>.</footer>
  </div>
  <script>
  (function () {
    "use strict";
    var SCEAU = "${sceau}";
    var cle = function (id, type) { return "todo-forge:" + SCEAU + ":" + id + ":" + type; };
    var coches = document.querySelectorAll("input.decider");
    var comms = document.querySelectorAll("textarea.commentaire");
    function bilan() {
      var c = 0, k = 0;
      coches.forEach(function (x) { if (x.checked) c++; });
      comms.forEach(function (x) { if (x.value.trim()) k++; });
      document.getElementById("bilan").textContent = c + " coché(s) · " + k + " commentaire(s)";
    }
    coches.forEach(function (x) {
      try { x.checked = localStorage.getItem(cle(x.dataset.id, "d")) === "1"; } catch (e) {}
      x.addEventListener("change", function () { try { localStorage.setItem(cle(x.dataset.id, "d"), x.checked ? "1" : "0"); } catch (e) {} bilan(); });
    });
    comms.forEach(function (x) {
      try { x.value = localStorage.getItem(cle(x.dataset.id, "c")) || ""; } catch (e) {}
      x.addEventListener("input", function () { try { localStorage.setItem(cle(x.dataset.id, "c"), x.value); } catch (e) {} bilan(); });
    });
    // B6 — tri au clic (et Entrée) sur les en-têtes fléchés ; numérique si la colonne l'est
    document.querySelectorAll("th[data-sort]").forEach(function (th) {
      var tri = function () {
        var table = th.closest("table"), tbody = table.querySelector("tbody");
        var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
        var sens = th.getAttribute("data-sort") === "asc" ? "desc" : "asc";
        table.querySelectorAll("th[data-sort]").forEach(function (x) { x.setAttribute("data-sort", ""); });
        th.setAttribute("data-sort", sens);
        var lignes = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
        lignes.sort(function (a, b) {
          var va = a.children[idx].textContent.trim(), vb = b.children[idx].textContent.trim();
          var na = parseFloat(va.replace(",", ".")), nb = parseFloat(vb.replace(",", "."));
          var r = (!isNaN(na) && !isNaN(nb)) ? na - nb : va.localeCompare(vb, "fr");
          return sens === "asc" ? r : -r;
        });
        lignes.forEach(function (l) { tbody.appendChild(l); });
      };
      th.addEventListener("click", tri);
      th.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); tri(); } });
    });
    document.getElementById("exporter").addEventListener("click", function () {
      var decisions = [];
      var parId = {};
      comms.forEach(function (x) { parId[x.dataset.id] = { commentaire: x.value.trim() }; });
      coches.forEach(function (x) { (parId[x.dataset.id] = parId[x.dataset.id] || {}).decider = x.checked; });
      Object.keys(parId).sort().forEach(function (id) {
        var d = parId[id];
        if (d.decider || d.commentaire) decisions.push({ id: id, decider: !!d.decider, commentaire: d.commentaire || null });
      });
      var contenu = JSON.stringify({ schema: 1, type: "decisions-todo-forge", sceau_source: SCEAU, exporte_le: new Date().toISOString(), decisions: decisions }, null, 1);
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([contenu], { type: "application/json" }));
      a.download = "TF-decisions-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + ".json";
      a.click(); URL.revokeObjectURL(a.href);
    });
    bilan();
  })();
  </script>
  <script>
  /* Composant filtres maison — inliné depuis ~/.claude/skills/digit-ai-page-html/assets/table-filters.js (provenance D-12, zéro réseau) */
${filtresJs}
  </script>
</body>
</html>
`;
writeFileSync(OUT, html);
console.log(`TODO.html générée — ${etats.size} items, ${parForge.size} forges (sceau ${sceau}, filtres ${filtresJs ? "inlinés" : "ABSENTS"})`);
