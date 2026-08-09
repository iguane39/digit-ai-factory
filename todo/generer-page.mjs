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
  const lignes = items.map((e) => `
        <tr>
          <td class="c-coche"><input type="checkbox" class="decider" data-id="${e.id}" aria-label="Décider ${e.id}"${e.statut !== "candidat" ? " disabled" : ""}></td>
          <td class="c-id"><code>${e.id}</code></td>
          <td><span class="statut s-${e.statut}">${e.statut}</span></td>
          <td class="c-score">${e.score.valeur}</td>
          <td>
            <details><summary><strong>${esc(e.titre)}</strong></summary>
              <p>${esc(e.contenu)}</p>
              <p class="meta">Demandeur : ${esc(e.demandeur)} · ${esc(e.date_demande)} · gain ${e.score.gain} × preuve ${e.score.preuve} ÷ effort ${e.score.effort}${e.preuve_du_cout ? ` · <strong>payé en réel</strong> — ${esc(e.preuve_du_cout)}` : ""}${e.commentaire_humain ? `<br>Commentaire précédent : ${esc(e.commentaire_humain)}` : ""}</p>
            </details>
          </td>
          <td class="c-comm"><textarea class="commentaire" data-id="${e.id}" rows="1" aria-label="Commentaire ${e.id}" placeholder="commentaire…"></textarea></td>
        </tr>`).join("");
  sections += `
    <section>
      <h2 id="${esc(forge).replace(/[^a-z-]/g, "")}">${esc(forge)} <span class="badge">${items.length}</span></h2>
      <div class="scroll"><table data-filterable>
        <thead><tr><th scope="col">✓</th><th scope="col">id</th><th scope="col">statut</th><th scope="col">score</th><th scope="col">item</th><th scope="col">commentaire</th></tr></thead>
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
  <title>Digit-AI — TODO-FORGE · Registre d'amélioration</title>
  <meta name="description" content="Vue interactive du registre TODO-FORGE : consultation, décisions et commentaires à exporter pour traitement par le pilot.">
  <meta name="theme-color" content="#2563EB">
  <meta name="color-scheme" content="light">
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
    .barre{position:sticky;top:0;z-index:5;background:var(--bg);padding:12px 0;border-bottom:1px solid var(--line);display:flex;gap:12px;align-items:center;flex-wrap:wrap}
    button#exporter{font-family:var(--head);font-weight:700;font-size:.95rem;background:var(--blue);color:#fff;border:none;border-radius:var(--r-sm);padding:10px 18px;cursor:pointer;min-height:44px}
    button#exporter:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    #bilan{color:var(--muted);font-size:.9rem}
    footer{margin-top:40px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:16px}
    @media (max-width:768px){.wrap{padding:16px 12px 48px} h1{font-size:1.4rem} table{font-size:.85rem} td,th{padding:6px 8px} .c-comm{min-width:120px}}
    @media print{.barre,textarea,.decider{display:none}}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>TODO-FORGE — registre d'amélioration</h1>
      <p class="meta">${etats.size} actifs (candidat ${compte("candidat")} · décidé ${compte("decide")} · en cours ${compte("en_cours")} · corrigé ${compte("corrige")} · écarté ${compte("ecarte")}) · ${nbArchives} archivés · sceau source <code>${sceau}</code> · dernier événement ${esc(tsMax)}</p>
      <p>Coche les items à <strong>décider</strong> (candidats seulement), commente librement, puis <strong>Exporter</strong> : remets le fichier téléchargé au pilot — il sera appliqué par <code>appliquer-export.mjs</code> (décisions tracées, commentaires conservés). Cases et commentaires persistent dans ce navigateur jusqu'à l'export.</p>
    </header>
    <div class="barre">
      <button id="exporter" type="button">Exporter les décisions</button>
      <span id="bilan" aria-live="polite">0 coché · 0 commentaire</span>
    </div>
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
