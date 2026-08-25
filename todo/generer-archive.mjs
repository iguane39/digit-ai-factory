#!/usr/bin/env node
/**
 * generer-archive.mjs — génère todo/TODO-ARCHIVE.html : la page de RECHERCHE des items CLOS
 * (TF-0350, mandat humain du 17/08).
 *
 * promesses-verifiees — ce fichier ADHÈRE au contrôle des promesses de commentaire
 * (`oracle-promesses`) : une classe ou un attribut nommé dans un commentaire ici DOIT exister
 * dans le code. Un générateur de page est l'endroit où une promesse de prose coûte le plus cher —
 * elle s'y lit comme une garantie de ce que la page contient.
 *
 * Source unique : todo/TODO-ARCHIVE.jsonl — NE PAS ÉDITER LE HTML. L'archive porte l'HISTOIRE
 * COMPLÈTE de chaque item (creation → maj… → archive, ordre préservé par archiver.mjs) : la page
 * reconstitue donc, par item, son ÉTAT FINAL et ses JALONS datés — création, décision (avec son
 * décideur), ouverture des travaux, clôture (gains constatés, corrections, version de forge
 * corrigée), archivage. Ce que `grep` rend illisible à l'humain qui décide devient interrogeable.
 *
 * Déterministe : deux générations sur la même archive produisent le même fichier (horodatage =
 * ts max des événements ; aucun Date.now dans la sortie). Sceau de fraîcheur = sha256 de la
 * source : une page régénérée après un archivage change de sceau, une page périmée se détecte.
 *
 * Autonome (A1) : zéro requête réseau — données et index embarqués, polices en repli système.
 * Charte digit-ai-page-html : tokens du boilerplate, Roboto titres / DM Sans corps. R-30 : thème
 * CLAIR par défaut STRICT + bascule sombre câblée et persistée (pattern S-G1) + impression
 * toujours claire. La propriété `color-scheme` est portée par les DEUX blocs de tokens et jamais
 * figée dans un `<meta name="color-scheme">` : figée à « light dark », le navigateur peignait ses
 * propres surfaces en sombre sur un corps clair — défaut relevé par l'amendement RV-9 (14/08, lot
 * Produit-10). generer-page.mjs porte encore ce `<meta>` fautif : il n'est PAS recopié ici.
 *
 * Recherche côté client, vanilla, sans framework : l'index est construit en UN passage au
 * chargement (texte normalisé de chaque carte, accents pliés) puis conservé en mémoire avec la
 * référence de l'élément. Chaque frappe est un `indexOf` par item, et le DOM n'est touché QUE
 * pour les cartes dont la visibilité change — c'est ce qui tient à 307 items comme à 1000+ (le
 * coût d'une recherche est linéaire en items, jamais en nœuds réécrits).
 *
 * Usage : node todo/generer-archive.mjs [archive.jsonl] [sortie.html]
 *         (sans argument : todo/TODO-ARCHIVE.jsonl → todo/TODO-ARCHIVE.html)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteFichier } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2] ? process.argv[2] : join(ICI, "TODO-ARCHIVE.jsonl");
const OUT = process.argv[3] ? process.argv[3] : join(ICI, "TODO-ARCHIVE.html");

const lire = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);
const esc = (s) => String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// L11/L14 (charte de lisibilité) : un littéral de langage (None, null…) ou un motif de gabarit
// cité DANS un texte se rend en <code> — c'est un jeton technique discuté, pas une fuite de
// producteur. Le registre décrit des défauts, donc il CITE la plomberie qu'il dénonce.
// Repris tel quel de generer-page.mjs (même corpus, mêmes citations) — et appliqué AUSSI aux
// titres : c'est un titre non traité (« None » dans TF-0309) qui fait échouer TODO.html à L11.
const escLit = (s) => esc(s)
  .replace(
    /(^|[\s(«:;,—–-])(null|NULL|None|NONE|undefined|NaN|nil)(?=$|[\s)».;,:!?—–-])/g,
    "$1<code>$2</code>")
  .replace(
    /(^|[\s(«:;,—–-])(\[[a-zA-Z]{1,6}:[^\]\s]{1,48}\]|\{\{[^}\n]{0,40}\}\}|\$\{[^}\n]{0,40}\}|%\([\w-]{1,24}\)[sdifr]|%[sdifr]|lorem ipsum)(?=$|[\s)».;,:!?—–-])/gi,
    "$1<code>$2</code>");

// L12 — une énumération « clé — valeur » enchaînée par des points-virgules n'est PAS une phrase :
// c'est une liste que la prose refuse d'assumer, et le lecteur ne peut ni comparer ni repérer la
// valeur aberrante. Le registre en est plein (des gains_constates qui énumèrent trois effets).
// Elle se rend donc en VRAIE liste — le <dt> ou le chapeau qui la précède dit ce qu'il faut y voir.
// Le découpage se fait sur le texte BRUT, jamais sur l'échappé : un `&amp;` porte un « ; ».
const RE_COUPLE = /^[^;]{3,}?\s[—–]\s[^;]{3,}$/;
const enSegments = (brut) => {
  const parts = String(brut).split(";").map((s) => s.trim()).filter(Boolean);
  return parts.filter((s) => RE_COUPLE.test(s)).length >= 3 ? parts : null;
};
const puce = (s) => `<li>${escLit(s.trim().replace(/^[)\s.;,]+/, "").replace(/\s*[;.]\s*$/, ""))}</li>`;
// Un bloc de prose : liste si c'est une énumération déguisée, paragraphe sinon.
const prose = (brut, classe) => {
  const seg = enSegments(brut);
  return seg ? `<ul class="puces">${seg.map(puce).join("")}</ul>` : `<p class="${classe}">${escLit(brut)}</p>`;
};

// Détail en puces : sépare le constat de la proposition, puis découpe en vraies puces —
// énumération (a)/(1) d'abord, sinon points-virgules, sinon phrases. Un texte sans structure
// reste un paragraphe (jamais de puce artificielle). Patron de generer-page.mjs, transposé sur le
// texte BRUT (l'échappement descend au niveau de chaque puce) pour que le découpage L12 s'applique.
const rendDetail = (brut) => {
  const t = String(brut ?? "").trim();
  if (!t) return "";
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
    // une puce peut à son tour cacher une énumération : on la découpe plutôt que la laisser
    items = items.flatMap((s) => enSegments(s) || [s]);
  }
  const leadHtml = lead ? prose(lead, "lead") : "";
  const listHtml = items.length
    ? `${labelProp ? `<p class="detail-label">Proposition</p>` : ""}<ul class="puces">${items.map(puce).join("")}</ul>`
    : "";
  return leadHtml + listHtml || prose(t, "lead");
};

// ---------------------------------------------------------------------------------------------
// Reconstitution : état final + jalons, à partir de la seule histoire événementielle.
//
// `statut` est écrasé à chaque maj, et le DERNIER est toujours « archive » (transition posée par
// archiver.mjs) : le statut de DÉCISION — corrigé ou écarté — est donc le dernier statut de
// clôture rencontré, pas le statut courant. Le confondre rendrait la page inutile : 307 items
// tous « archive », aucun filtre possible.
// ---------------------------------------------------------------------------------------------
const CLOTURE = new Set(["corrige", "ecarte"]);
const LABEL_JALON = { creation: "Création", decide: "Décision", en_cours: "Travaux ouverts", corrige: "Clôture — corrigé", ecarte: "Clôture — écarté", archive: "Archivage" };

const etats = new Map(); // id -> { ...champs cumulés, statut_final, jalons[] }
let tsMax = "";
for (const e of lire(SRC)) {
  if (e.ts > tsMax) tsMax = e.ts;
  if (!e.id) continue; // événements d'ingestion : traçabilité du lot, pas un item
  if (e.ev === "creation") {
    etats.set(e.id, { ...e, statut_final: null, jalons: [{ ev: "creation", ts: e.ts, source: e }] });
  } else if (e.ev === "maj" && etats.has(e.id)) {
    const it = etats.get(e.id);
    Object.assign(it, e);
    if (CLOTURE.has(e.statut)) it.statut_final = e.statut;
    it.jalons.push({ ev: e.statut || "maj", ts: e.ts, source: e });
  }
}

// Forge cible : le registre l'a nommée de plusieurs façons au fil des mois (« pilot »,
// « forge-tests », « digit-ai-forge-tests », « ops (nouvelle) »). Un filtre à 28 entrées pour
// 15 forges réelles ne filtre rien : la valeur BRUTE reste affichée sur la carte (fidélité à
// l'histoire), la valeur CANONIQUE sert au filtre et au regroupement.
const canon = (f) => String(f ?? "")
  .trim().toLowerCase()
  .replace(/\s*\((?:nouvelle|nouveau)\)\s*$/, "")
  .replace(/^digit-ai-forge-/, "")
  .replace(/^forge-/, "") || "non renseignée";
const forgeBrute = (e) => ((e.forges_cibles_reelles && e.forges_cibles_reelles.length ? e.forges_cibles_reelles : e.forges_cibles_initiales) || [])[0] ?? "";

const items = [...etats.values()].sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0)); // récents d'abord
// TF-0615 : fonction partagee, fins de ligne normalisees. `empreinteFichier` rend deja
// "absent" quand la source manque — le ternaire sur un buffer vide n'a plus lieu d'etre.
const sceau = empreinteFichier(SRC, 12);
const nbCorriges = items.filter((e) => e.statut_final === "corrige").length;
const nbEcartes = items.filter((e) => e.statut_final === "ecarte").length;
const FORGES = [...new Set(items.map((e) => canon(forgeBrute(e))))].sort();

// ---------------------------------------------------------------------------------------------
// Jalons d'un item : chaque étape rend les champs qu'elle APPORTE (un champ répété à chaque maj
// serait du bruit). Un jalon sans champ propre garde sa ligne : c'est la DATE qui l'intéresse.
// ---------------------------------------------------------------------------------------------
// L3 — une valeur écrite pour une machine (`Produit-11`, `digit-ai-forge-tests`,
// `audit-produit-01-20260811`) demande au lecteur de deviner ce qu'elle désigne. Le registre
// n'en contient que des identifiants réels, non traduisibles : chacun porte donc sa LÉGENDE,
// qui dit de quelle nature est l'identifiant. Un champ long (`pleine`) passe par `prose` :
// il devient liste ou paragraphe, jamais un jeton nu.
const ligne = (dt, valeur, opt = {}) => {
  if (!valeur) return "";
  const corps = opt.pleine ? prose(valeur, "jalon-prose") : escLit(valeur);
  return `<div${opt.pleine ? ' class="pleine"' : ""}><dt>${esc(dt)}</dt>`
    + `<dd${opt.legende ? ` title="${esc(opt.legende)}"` : ""}>${corps}</dd></div>`;
};
const listeOuTexte = (v) => (Array.isArray(v) ? v.filter(Boolean).join(", ") : v);

const rendJalons = (e) => e.jalons.map((j) => {
  const s = j.source;
  let champs = "";
  if (j.ev === "creation") {
    champs = ligne("Demandé par", s.demandeur, { legende: "run, session, produit ou humain à l'origine de la candidature, tel qu'inscrit au registre" })
      + ligne("Origine", s.source, { legende: "circuit d'entrée de la candidature : lot de retours, audit, mandat humain ou run nommé" })
      + ligne("Forge visée à la création", listeOuTexte(s.forges_cibles_initiales), { legende: "dépôt de forge visé au moment de la candidature — nom brut du registre, avant normalisation" })
      + (s.score ? `<div><dt>Score d'entrée</dt><dd>${s.score.valeur} — gain ${s.score.gain} × preuve ${s.score.preuve} ÷ effort ${s.score.effort}</dd></div>` : "")
      + ligne("Coût déjà payé", s.preuve_du_cout, { pleine: true });
  } else if (j.ev === "decide") {
    champs = ligne("Décideur", s.decideur, { pleine: true })
      + ligne("Commentaire humain", s.commentaire_humain, { pleine: true })
      + ligne("Mandat", s.note_mandat, { pleine: true });
  } else if (CLOTURE.has(j.ev)) {
    champs = ligne("Gains constatés", s.gains_constates, { pleine: true })
      + ligne("Motif de l'écart", s.motif_ecart, { pleine: true })
      + ligne("Corrections réalisées", s.corrections_realisees, { pleine: true })
      + ligne("Version de forge corrigée", s.version_forge_corrigee, { pleine: true })
      + ligne("Forge réellement touchée", listeOuTexte(s.forges_cibles_reelles), { legende: "dépôt de forge réellement modifié par la correction — nom brut du registre" })
      + ligne("Produits bénéficiaires", listeOuTexte(s.produits_beneficiaires), { legende: "produits ou missions ayant bénéficié de la correction, nommés au registre" });
  }
  const date = (s.date_correction || s.date_decision || s.date_demande || j.ts).slice(0, 10);
  return `<li class="jalon j-${esc(j.ev)}">
              <p class="jalon-tete"><strong>${esc(LABEL_JALON[j.ev] || j.ev)}</strong> <span class="jalon-date">${esc(date)}</span></p>
              ${champs ? `<dl class="jalon-meta">${champs}</dl>` : ""}
            </li>`;
}).join("\n            ");

const LABEL_STATUT = { corrige: "corrigé", ecarte: "écarté" };
const rendCarte = (e) => {
  const st = e.statut_final || "corrige"; // un item archivé sans statut de clôture n'existe pas (oracle R5) ; repli défensif
  const brute = forgeBrute(e);
  const jalons = rendJalons(e);
  // L9 : un dépliant doit cacher de quoi mériter un clic. Une histoire courte (< 200 caractères
  // de contenu caché) se rend OUVERTE — mieux vaut tout montrer qu'un clic pour rien.
  const volume = jalons.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().length;
  return `
        <article class="card s-${st}" id="item-${esc(e.id)}" data-forge="${esc(canon(brute))}" data-statut="${st}">
          <header class="card-head">
            <code class="tf-id">${esc(e.id)}</code>
            <span class="statut s-${st}">${LABEL_STATUT[st]}</span>
            <span class="chip forge" title="forge visée — valeur brute du registre : ${esc(brute || "non renseignée")}">${esc(canon(brute))}</span>
            <span class="chip jour" title="date de clôture portée par l'événement de clôture">clos le ${esc((e.date_correction || e.ts).slice(0, 10))}</span>
          </header>
          <h3 class="card-titre">${escLit(e.titre)}</h3>
          <div class="card-detail" data-cite>${rendDetail(e.contenu)}</div>
          <details class="histoire"${volume < 200 ? " open" : ""}>
            <summary>Histoire de l'item — ${e.jalons.length} jalon(s), de la création à l'archivage</summary>
            <ol class="jalons">
            ${jalons}
            </ol>
          </details>
        </article>`;
};

// Regroupement par forge canonique + sommaire (patron de generer-page.mjs) : 307 cartes en liste
// plate ne se parcourent pas — le sommaire dit d'un coup d'œil où la dette a été payée, et donne
// une ancre par forge. Les items restent triés du plus récent au plus ancien dans chaque section.
const parForge = new Map();
for (const e of items) {
  const k = canon(forgeBrute(e));
  (parForge.get(k) ?? parForge.set(k, []).get(k)).push(e);
}
const ancre = (f) => "forge-" + String(f).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sections = FORGES.map((forge) => {
  const lot = parForge.get(forge);
  const nbC = lot.filter((e) => e.statut_final === "corrige").length;
  const nbE = lot.length - nbC;
  return `
      <section id="${esc(ancre(forge))}">
        <h2>${esc(forge)} <span class="badge" title="${lot.length} item(s) clos ciblant ${esc(forge)} — ${nbC} corrigé(s), ${nbE} écarté(s)">${lot.length}</span></h2>
        <p class="ch-apprend meta">Items clos ciblant <strong>${esc(forge)}</strong> — ${nbC} corrigé(s), ${nbE} écarté(s), du plus récent au plus ancien. Chaque carte porte le détail tel qu'il a été candidaté, puis son histoire dépliable : création, décision et décideur, ouverture des travaux, clôture, archivage.</p>
        <div class="cartes">${lot.map(rendCarte).join("")}
        </div>
      </section>`;
}).join("");

// Filtres multi-sélection (Tous / Aucun), un par dimension catégorielle — standard H.
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
     flash). CLAIR PAR DÉFAUT STRICT : la préférence système n'est PAS suivie (contradiction du
     pattern levée par RV-9 le 14/08) ; le sombre est un choix du lecteur, persisté. Sans defer
     (le WARN « script bloquant en head » de check_html est l'exception assumée du pattern). -->
<script>
(function () {
  var s = null;
  try { s = localStorage.getItem('digitai-theme'); } catch (e) {}
  document.documentElement.setAttribute('data-theme', s === 'dark' ? 'dark' : 'light');
})();
</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digit-AI — TODO-FORGE · Archive des items clos — V${esc(tsMax.slice(0, 10).replaceAll("-", ""))}</title>
  <meta name="description" content="Page de recherche des items clos du registre TODO-FORGE : ${items.length} items archivés, corrigés ou écartés, avec leur histoire complète — création, décision et décideur, clôture et gains constatés.">
  <meta name="theme-color" content="#2563EB">
  <!-- Pas de <meta name="color-scheme" content="light dark"> : FIGÉ, le navigateur peint ses
       propres surfaces (ascenseurs, contrôles) en sombre sur un corps clair — défaut relevé par
       l'amendement RV-9 (14/08, lot Produit-10). Ici la propriété CSS color-scheme est portée par
       les DEUX blocs de tokens : elle SUIT le thème effectif, juste dans les deux états. -->
  <!-- Favicon-lettre : « F » = Forge (projet), convention du 13/08 — même famille que TODO.html. -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3Ctext x='32' y='44' font-family='Segoe UI,Roboto,sans-serif' font-size='38' font-weight='700' fill='white' text-anchor='middle'%3EF%3C/text%3E%3C/svg%3E">
  <style>
    :root {
      color-scheme:light;
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
    /* S-G1 (2/4, R-30) — tokens sombres : une source, deux projections. color-scheme porté ICI
       (et non dans un <meta> figé) pour que les surfaces du navigateur suivent le thème. */
    :root[data-theme="dark"] {
      color-scheme:dark;
      --bg:#0B1220; --surface:#121B2E; --card:#121B2E; --ink:#EEF2F8;
      --muted:#A9B4C4; --faint:#7C8AA0; --line:#263248; --blue:#7DA2F5;
      --amber:#FBBF6D; --amber-fill:#2B2210; --amber-line:#4A3A18;
      --teal:#5FE6D6; --teal-fill:#0E2A27; --teal-line:#164E48;
      --green:#7BE0A0; --green-fill:#0F2A1B; --green-line:#1C4A30;
    }
    *{box-sizing:border-box} html{-webkit-text-size-adjust:100%}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;font-size:16px}
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
    /* bande KPI — les deux statuts de clôture filtrent au clic (loi 1 : tout est câblé) */
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0 6px}
    .kpi{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;display:flex;flex-direction:column;gap:4px;break-inside:avoid}
    .kpi-label{color:var(--muted);font-size:.8rem} .kpi-value{font-family:var(--head);font-weight:800;font-size:1.6rem}
    .kpi-hint{color:var(--muted);font-size:.75rem}
    button.kpi{font:inherit;text-align:left;cursor:pointer;appearance:none}
    button.kpi[aria-pressed="true"]{border-color:var(--blue);box-shadow:inset 0 0 0 1px var(--blue)}
    button.kpi:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    /* barre d'outils : recherche + filtres + réinitialisation + compteur aria-live */
    .toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0 0}
    .toolbar input[type="search"]{flex:1 1 340px;font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);padding:9px 12px}
    .toolbar input[type="search"]:focus-visible{outline:3px solid var(--blue);outline-offset:1px}
    .dropdown{position:relative}
    .dd-btn{font:inherit;font-weight:600;color:var(--blue);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);padding:8px 12px;cursor:pointer}
    .dd-btn:focus-visible,.dd-panel button:focus-visible,#reinit:focus-visible,.lien-btn:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    .dd-panel{position:absolute;top:calc(100% + 6px);left:0;z-index:7;min-width:220px;max-height:60vh;overflow-y:auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);box-shadow:0 8px 24px rgba(15,23,42,.14);padding:10px 12px}
    .dd-actions{display:flex;gap:14px;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:8px}
    .dd-actions button{font:inherit;font-weight:600;color:var(--blue);background:none;border:none;cursor:pointer;padding:2px 4px}
    .dd-panel label{display:flex;gap:8px;align-items:center;padding:5px 2px;cursor:pointer}
    #reinit{font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);padding:8px 12px;cursor:pointer}
    .compteur{color:var(--muted);font-size:.85rem}
    .masque{display:none}
    /* loi 3 — une recherche sans résultat le DIT : ni liste vide muette, ni page qui ne bouge pas */
    .etat-vide{background:var(--surface);border:1px dashed var(--line);border-radius:var(--r);padding:18px 20px;color:var(--muted);margin-top:14px}
    .etat-vide strong{color:var(--ink)}
    .lien-btn{font:inherit;color:var(--blue);background:none;border:none;cursor:pointer;text-decoration:underline;padding:0}
    nav.toc{margin:14px 0 0;font-size:.9rem} nav.toc a{text-decoration:none;margin-right:14px;white-space:nowrap}
    nav.toc a:hover{text-decoration:underline} nav.toc .toc-d{color:var(--muted)}
    .legende{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0 0;color:var(--muted);font-size:.85rem}
    .leg-item{display:inline-flex;align-items:center;gap:6px}
    .leg-swatch{width:12px;height:12px;border-radius:3px;border:1px solid var(--line);display:inline-block}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    /* cartes */
    .cartes{display:flex;flex-direction:column;gap:16px;margin-top:10px}
    .card{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--faint);
      border-radius:var(--r);padding:18px 20px;break-inside:avoid}
    .card.s-corrige{border-left-color:var(--green)} .card.s-ecarte{border-left-color:var(--amber)}
    .card-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .tf-id{font-family:var(--mono);font-size:.85rem;color:var(--muted)}
    .card-titre{font-size:1.08rem;font-weight:700;margin:.5em 0 .3em}
    /* chips : texte en --ink (AA garanti dans les 2 thèmes) ; la couleur passe par le fond
       teinté + la bordure d'accent, jamais par le texte seul. */
    .statut,.chip{font-family:var(--mono);font-size:.74rem;padding:2px 9px;border-radius:999px;border:1px solid var(--line);white-space:nowrap;color:var(--ink)}
    .statut.s-corrige{background:var(--green-fill);border-color:var(--green-line)}
    .statut.s-ecarte{background:var(--amber-fill);border-color:var(--amber-line)}
    .chip.forge{background:var(--teal-fill);border-color:var(--teal-line)}
    .chip.jour{background:var(--surface);color:var(--muted)}
    .card-detail .lead{margin:.2em 0 .4em}
    .detail-label{font-family:var(--head);font-weight:700;font-size:.82rem;color:var(--muted);margin:.6em 0 .2em;text-transform:uppercase;letter-spacing:.03em}
    .puces{margin:.2em 0 .4em;padding-left:1.2em} .puces li{margin:.28em 0}
    .card-detail,.card-detail li,.jalon-meta dd{overflow-wrap:anywhere}
    /* histoire dépliable : la frise des jalons, création → archivage */
    .histoire{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--line)}
    .histoire>summary{font-family:var(--head);font-weight:700;font-size:.8rem;color:var(--muted);
      text-transform:uppercase;letter-spacing:.03em;cursor:pointer}
    .jalons{list-style:none;margin:12px 0 0;padding:0 0 0 20px;border-left:2px solid var(--line)}
    .jalon{position:relative;margin:0 0 16px}
    .jalon::before{content:"";position:absolute;left:-27px;top:6px;width:10px;height:10px;border-radius:50%;
      background:var(--surface);border:2px solid var(--faint)}
    .jalon.j-creation::before{border-color:var(--blue)} .jalon.j-decide::before{border-color:var(--teal)}
    .jalon.j-en_cours::before{border-color:var(--amber)} .jalon.j-corrige::before{border-color:var(--green)}
    .jalon.j-ecarte::before{border-color:var(--amber)}
    .jalon-tete{margin:0;font-size:.95rem}
    .jalon-date{font-family:var(--mono);font-size:.8rem;color:var(--muted);margin-left:6px}
    .jalon-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px 20px;margin:8px 0 0}
    .jalon-meta .pleine{grid-column:1/-1}
    .jalon-meta dt{font-family:var(--head);font-weight:700;font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
    .jalon-meta dd{margin:.2em 0 0;font-size:.9rem}
    .jalon-meta dd .jalon-prose{margin:0} .jalon-meta dd .puces{margin:.1em 0 0;padding-left:1.1em}
    footer{margin-top:44px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:16px}
    @media (max-width:640px){.wrap{width:auto;padding:0 12px 48px} .entete h1{font-size:1.1rem} .card{padding:14px}}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @page{margin:14mm}
    /* S-G1 (2/4 suite, R-30.2) — impression TOUJOURS claire, quel que soit le thème écran */
    @media print{
      :root,:root[data-theme="dark"]{
        color-scheme:light;
        --bg:#FFFFFF;--surface:#FFFFFF;--card:#FFFFFF;--ink:#0F172A;--muted:#64748B;--faint:#94A3B8;--line:#E6EAF2;--blue:#2563EB;
        --amber:#D97706;--amber-fill:#FFFBEB;--amber-line:#FDE9C8;--teal:#0E9488;--teal-fill:#EFFDFB;--teal-line:#C7F0EA;--green:#15803D;--green-fill:#F2FCF5;--green-line:#CFEEDD;
      }
      body{background:#fff} .entete{position:static} .theme-toggle,.toolbar,.kpis,nav.toc{display:none}
      /* le papier montre tout : les filtres écran ne masquent rien à l'impression */
      article.card.masque,main>section.masque{display:block}
      .card{break-inside:avoid} .histoire>summary{list-style:none}
      a[href^="http"]::after{content:" (" attr(href) ")";font-size:.85em;color:var(--muted)}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="entete">
      <h1>TODO-FORGE — archive des items clos</h1>
      <p class="meta">sceau <code>${sceau}</code> · dernier événement ${esc(tsMax)}</p>
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Bascule thème sombre" aria-pressed="false">
        <svg class="icon-moon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        <svg class="icon-sun" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </header>
    <p>Ce que le registre actif a cessé de porter vit ici : <strong>${items.length} items clos</strong>, chacun avec son histoire complète — ce qui a été demandé, qui l'a décidé, ce qui a été corrigé et quels gains ont été constatés. C'est la mémoire des décisions déjà prises : on y cherche avant de re-candidater, et on y vérifie ce qu'une correction a réellement rapporté. La recherche et les filtres agissent sur cette page seule, sans rien envoyer nulle part.</p>
    <div class="kpis">
      <div class="kpi" title="${items.length} items archivés depuis todo\\TODO.jsonl — l'histoire complète de chacun est sur cette page"><span class="kpi-label">Items clos, archivés</span><span class="kpi-value">${items.length}</span><span class="kpi-hint">source unique — <code>todo\\TODO-ARCHIVE.jsonl</code></span></div>
      <button type="button" class="kpi" data-statut="corrige" aria-pressed="false" title="${nbCorriges} item(s) clos sur gains constatés — clic : n'afficher qu'eux"><span class="kpi-label">Corrigés</span><span class="kpi-value">${nbCorriges}</span><span class="kpi-hint">clos sur gains constatés · clic&nbsp;: filtrer</span></button>
      <button type="button" class="kpi" data-statut="ecarte" aria-pressed="false" title="${nbEcartes} item(s) écartés, chacun avec son motif d'écart — clic : n'afficher qu'eux"><span class="kpi-label">Écartés</span><span class="kpi-value">${nbEcartes}</span><span class="kpi-hint">refus motivé, mémoire gardée · clic&nbsp;: filtrer</span></button>
      <div class="kpi" title="nombre de forges distinctes visées par les items archivés, noms normalisés"><span class="kpi-label">Forges concernées</span><span class="kpi-value">${FORGES.length}</span><span class="kpi-hint">noms normalisés — le brut reste en infobulle</span></div>
    </div>
    <p class="legende">
      <span class="leg-item"><span class="leg-swatch" style="background:var(--green)"></span>corrigé — clos sur gains constatés</span>
      <span class="leg-item"><span class="leg-swatch" style="background:var(--amber)"></span>écarté — refus motivé</span>
      <span class="leg-item">Score d'entrée = gain × preuve ÷ effort (×2 si le coût avait déjà été payé en run réel)</span>
    </p>
    <div class="toolbar" role="search" aria-label="Rechercher dans les items clos">
      <input type="search" id="recherche" placeholder="Rechercher (id TF, titre, détail, gains constatés, corrections réalisées…)" aria-label="Rechercher dans les items clos — plein texte, insensible aux accents et à la casse">
      ${dd("forge", "Forge", FORGES.map((f) => ({ v: f, l: f })))}
      ${dd("statut", "Statut final", [{ v: "corrige", l: "corrigé" }, { v: "ecarte", l: "écarté" }])}
      <button id="reinit" type="button">Réinitialiser la recherche</button>
      <span id="compteur" class="compteur" aria-live="polite">${items.length} / ${items.length} item(s) clos affichés</span>
    </div>
    <p id="vide" class="etat-vide" hidden><strong>Aucun item clos ne correspond.</strong> <span id="vide-quoi"></span> L'archive porte ${items.length} items : élargissez les filtres, essayez un identifiant (<code>TF-0062</code>) ou un mot du titre — ou <button type="button" id="vide-reinit" class="lien-btn">réinitialisez la recherche</button>.</p>
    <nav class="toc" aria-label="Sommaire">${FORGES.map((f) => `<a href="#${esc(ancre(f))}"><strong>${esc(f)}</strong> <span class="toc-d">${parForge.get(f).length} item(s) clos</span></a>`).join("")}</nav>
    <main>${sections}
    </main>
    <footer>Page générée par <code>todo/generer-archive.mjs</code> — ne pas éditer. Source unique : <code>todo/TODO-ARCHIVE.jsonl</code> (sceau <code>${sceau}</code> — si la source a bougé sans régénération, le sceau ne correspond plus). Détail brut d'un item : <code>grep '"id":"TF-xxxx"' todo/TODO-ARCHIVE.jsonl</code>. Le reste-à-faire vit dans <code>todo/TODO.html</code>.</footer>
  </div>
  <!-- S-G1 (4/4, R-30) — câblage : persistance + aria-pressed, aucune bascule muette -->
  <script>
  (function () {
    var bouton = document.getElementById('theme-toggle');
    var racine = document.documentElement;
    function appliquer(theme) {
      racine.setAttribute('data-theme', theme);
      try { localStorage.setItem('digitai-theme', theme); } catch (e) {}
      bouton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    bouton.setAttribute('aria-pressed', racine.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    bouton.addEventListener('click', function () {
      appliquer(racine.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  })();
  </script>
  <!-- Recherche plein texte + filtres, vanilla. L'index est bâti en UN passage au chargement
       puis gardé en mémoire : chaque frappe coûte un indexOf par item, et le DOM n'est écrit
       que pour les cartes dont la visibilité CHANGE — ce qui tient à 1000+ items. -->
  <script>
  (function () {
    var recherche = document.getElementById('recherche');
    var compteur = document.getElementById('compteur');
    var vide = document.getElementById('vide');
    var videQuoi = document.getElementById('vide-quoi');
    var kpis = Array.prototype.slice.call(document.querySelectorAll('button.kpi'));
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); };
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section')).map(function (s) {
      return { el: s, vus: 0, vu: true };
    });
    // index : un enregistrement par item — élément, texte normalisé, forge, statut, section, visibilité
    var index = Array.prototype.slice.call(document.querySelectorAll('article.card')).map(function (c) {
      var sec = 0;
      for (var k = 0; k < sections.length; k++) if (sections[k].el.contains(c)) { sec = k; break; }
      return { el: c, texte: norm(c.textContent.replace(/\\s+/g, ' ')), forge: c.dataset.forge, statut: c.dataset.statut, sec: sec, vu: true };
    });
    var etatKpi = null;
    function coches(dim) {
      var set = {};
      Array.prototype.forEach.call(document.querySelectorAll('#dd-' + dim + ' input:checked'), function (i) { set[i.value] = true; });
      return set;
    }
    function majDd(dim) {
      var n = document.querySelectorAll('#dd-' + dim + ' input:checked').length;
      document.querySelector('[data-dim="' + dim + '"] .dd-n').textContent = n;
    }
    function fermerPanneaux() {
      Array.prototype.forEach.call(document.querySelectorAll('.dd-panel'), function (p) { p.hidden = true; });
      Array.prototype.forEach.call(document.querySelectorAll('.dd-btn'), function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
    function appliquer() {
      var q = norm(recherche.value.trim());
      var forges = coches('forge'), statuts = coches('statut');
      var visibles = 0, i;
      for (i = 0; i < sections.length; i++) sections[i].vus = 0;
      for (i = 0; i < index.length; i++) {
        var it = index[i];
        var ok = (!etatKpi || it.statut === etatKpi)
          && !!forges[it.forge] && !!statuts[it.statut]
          && (!q || it.texte.indexOf(q) !== -1);
        if (ok !== it.vu) { it.el.classList.toggle('masque', !ok); it.vu = ok; } // écrire seulement au changement
        if (ok) { visibles++; sections[it.sec].vus++; }
      }
      for (i = 0; i < sections.length; i++) {
        var vuSec = sections[i].vus > 0;
        if (vuSec !== sections[i].vu) { sections[i].el.classList.toggle('masque', !vuSec); sections[i].vu = vuSec; }
      }
      compteur.textContent = visibles + ' / ' + index.length + ' item(s) clos affichés';
      // loi 3 : l'état vide NOMME ce qui a été cherché — un « 0 résultat » muet n'aide personne
      if (visibles === 0) {
        videQuoi.textContent = q ? 'Rien ne contient « ' + recherche.value.trim() + ' » dans les filtres actifs.' : 'Les filtres actifs excluent tous les items.';
      }
      vide.hidden = visibles !== 0;
      majDd('forge'); majDd('statut');
    }
    kpis.forEach(function (k) {
      k.addEventListener('click', function () {
        etatKpi = etatKpi === k.dataset.statut ? null : k.dataset.statut;
        kpis.forEach(function (a) { a.setAttribute('aria-pressed', a.dataset.statut === etatKpi ? 'true' : 'false'); });
        appliquer();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.dropdown'), function (d) {
      var btn = d.querySelector('.dd-btn'), panel = d.querySelector('.dd-panel');
      btn.addEventListener('click', function () {
        var etaitOuvert = !panel.hidden;
        fermerPanneaux();
        if (!etaitOuvert) { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
      });
      d.addEventListener('click', function (ev) {
        var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
        if (act) Array.prototype.forEach.call(panel.querySelectorAll('input'), function (i) { i.checked = act === 'tous'; });
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
      Array.prototype.forEach.call(document.querySelectorAll('.dd-panel input'), function (i) { i.checked = true; });
      appliquer();
    }
    document.getElementById('reinit').addEventListener('click', reinitialiser);
    document.getElementById('vide-reinit').addEventListener('click', reinitialiser);
    // le papier montre TOUT : les histoires refermées à l'écran s'ouvrent pour l'impression
    var refermer = [];
    window.addEventListener('beforeprint', function () {
      refermer = Array.prototype.filter.call(document.querySelectorAll('details.histoire'), function (d) { return !d.open; });
      refermer.forEach(function (d) { d.open = true; });
    });
    window.addEventListener('afterprint', function () {
      refermer.forEach(function (d) { d.open = false; });
      refermer = [];
    });
  })();
  </script>
</body>
</html>
`;
writeFileSync(OUT, html);
console.log(`TODO-ARCHIVE.html générée — ${items.length} items clos (${nbCorriges} corrigés, ${nbEcartes} écartés), ${FORGES.length} forges, sceau ${sceau}`);
