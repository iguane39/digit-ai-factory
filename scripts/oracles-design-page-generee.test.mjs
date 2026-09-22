#!/usr/bin/env node
/**
 * oracles-design-page-generee.test.mjs — LA COQUILLE DU GÉNÉRATEUR EST JUGÉE PAR LES ORACLES
 * QUI JUGENT LES PAGES (TF-1162, 20/09/2026).
 *
 * ============================================================================================
 * LE FAIT
 * ============================================================================================
 *
 * `scripts\lib-vue-html.mjs` porte la coquille de TOUTES les vues HTML du pilot, et
 * `scripts\generer-page-etude.mjs` y ajoute la barre de recherche. Le 20/09, mesuré sur une page
 * d'étude régénérée : **oracle-slop FAIL** (S1 bloquant — bandeau latéral de 3 px sur la citation,
 * S4 majeur — blanc pur `#fff` au bloc d'impression) et **oracle-tokens FAIL — 13 écarts durs**
 * (2 × T1, couleurs en dur `#fff` et `#B42318` ; 11 × T3, espacements hors échelle 4 pt).
 *
 * *C'est un défaut de CLASSE, pas un défaut de page* : le même compte tombait sur chacune des
 * pages du générateur, et aucune relecture de page ne pouvait le corriger. Les trois scripts du
 * socle (`check_html.py`, `render_page.py`) rendaient PASS pendant ce temps — ils ne jugent ni les
 * jetons ni les marqueurs de design généré, et le disent dans leur propre périmètre de non-mesure.
 *
 * ============================================================================================
 * CE QUE CE BANC TIENT, ET DANS LES DEUX SENS
 * ============================================================================================
 *
 * SENS VERT — la page réellement produite par le générateur passe oracle-slop et n'a aucun écart
 * dur à oracle-tokens. SENS ROUGE — la MÊME page, dont on réinjecte les déclarations d'avant le
 * remède, DOIT être refusée, et refusée par les règles nommées (S1, S4, T1, T3). Sans le second
 * sens, une assertion écrite de travers passerait sur n'importe quoi.
 *
 * LE POINT D'ENTRÉE, JAMAIS ORACLE PAR ORACLE : `run-oracles-design.mjs` de digit-ai-forge-design
 * est le seul chemin documenté — il détecte les oracles applicables, agrège les verdicts et déclare
 * ce qui est SANS OBJET. L'appeler oracle par oracle imputerait au banc le choix des contrôles.
 *
 * SKIP DÉCLARÉ, JAMAIS UN VERT DE COMPLAISANCE : sur un poste où digit-ai-forge-design n'est pas
 * cloné, le banc sort en 0 avec un résumé qui NOMME l'absence et ne porte aucun compte de cas —
 * le cliquet du harnais le rend alors NON JUGÉ plutôt que de voir des cas disparaître.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt est joué).
 */
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pageEtude } from "./generer-page-etude.mjs";
import { lireSource, mdVersHtml, coquille } from "./lib-vue-html.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

/**
 * La racine de digit-ai-forge-design, dans l'ordre : `FORGE_DESIGN_ROOT`, puis le dépôt frère sous
 * `FORGE_ROOT`, puis le dépôt frère sous le parent du pilot. Aucune trouvée : `null`, et le banc le
 * DIT — un contrôle qui ne trouve pas ses oracles ne se tait pas.
 */
function racineForgeDesign() {
  const present = (c) => c && existsSync(join(c, "oracles", "run-oracles-design.mjs")) ? c : null;
  // `FORGE_DESIGN_ROOT` est EXCLUSIF quand il est posé — c'est le contrat de
  // `run-oracles-design.mjs` lui-même, qui le renvoie sans repli. Retomber en silence sur un dépôt
  // frère ferait juger une AUTRE forge que celle désignée, et rendrait la branche SKIP intestable.
  if (process.env.FORGE_DESIGN_ROOT) return present(process.env.FORGE_DESIGN_ROOT);
  for (const r of [process.env.FORGE_ROOT, join(ICI, "..", "..")]) {
    const c = r && present(join(r, "digit-ai-forge-design"));
    if (c) return c;
  }
  return null;
}

/**
 * La source témoin. Elle porte un tableau de HUIT lignes — le seuil à partir duquel
 * `generer-page-etude.mjs` câble la barre de recherche et les compteurs : sans lui, les règles CSS
 * de ce générateur ne seraient pas exercées et cinq des treize écarts mesurés resteraient hors du
 * banc. Aucun caractère pictographique : S6 juge le TEXTE d'une page, pas sa coquille, et un
 * pictogramme venu du contenu masquerait le verdict que ce banc mesure.
 */
const SOURCE_TEMOIN = `---
verifie_le: 2026-09-20
role: etude
sources_de_verite: banc de recette
---

# Etude temoin du banc de coquille — 20260920a

Audience : le pilote de l'ecosysteme, qui decide des mandats. Cette source ne sert qu'au banc.

## Le tableau qui declenche la barre de recherche

| Rang | Sujet | Etat |
|---|---|---|
| 1 | premier | ouvert |
| 2 | deuxieme | ouvert |
| 3 | troisieme | clos |
| 4 | quatrieme | clos |
| 5 | cinquieme | ouvert |
| 6 | sixieme | clos |
| 7 | septieme | ouvert |
| 8 | huitieme | clos |

> **Etat** : l'etiquette posee par l'auteur, pas un calcul.

- un point mesure ;
- un second point, avec \`un identifiant\` cite.
`;

/**
 * DEUX TÉMOINS DEPUIS LE 22/09/2026 (TF-1317, décision humaine D-6 (b)).
 *
 * La page d'étude ne porte plus la coquille partagée de `lib-vue-html.mjs` : elle DÉRIVE la sienne
 * du gabarit installé du socle, et en reçoit la bascule de thème, le repli des tableaux et les
 * composants posés sous sceau. La coquille partagée, elle, sert toujours les pages d'architecture
 * et de modèle de données. Juger la seule page d'étude aurait retiré son juge à cette coquille —
 * le banc s'en est aperçu lui-même le 22/09, en déclarant « introuvable » chacune de ses mutations.
 * Chaque témoin garde donc ses deux sens.
 *
 * Les déclarations d'AVANT le remède du 20/09, telles qu'elles vivaient dans la coquille PARTAGÉE.
 * Chacune porte la règle qui la dénonce : le sens rouge ne se contente pas d'un FAIL, il vérifie
 * que c'est bien CETTE règle qui parle.
 */
const AVANT_LE_REMEDE_COQUILLE = [
  ["S1", "border:1px solid var(--line);background:var(--surface);border-radius:var(--r-sm);color:var(--muted)}\n    blockquote p",
    "border-left:3px solid var(--blue);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0;color:var(--muted)}\n    blockquote p"],
  ["S4/T1", "body{background:var(--surface)}}", "body{background:#fff}}"],
  ["T3", "th{font-family:var(--head);font-weight:700;text-align:left;padding:var(--e3);",
    "th{font-family:var(--head);font-weight:700;text-align:left;padding:9px 12px;"],
  ["T3", "td{padding:var(--e2) var(--e3);", "td{padding:7px 12px;"],
];

/**
 * Les règles PROPRES au générateur de pages d'étude — sa barre de recherche —, qui vivent dans son
 * style et non dans une coquille. Ramenées à l'état d'avant le remède, T1 et T3 doivent les refuser.
 */
const AVANT_LE_REMEDE_ETUDE = [
  ["T1", ".find-count.zero{color:var(--red)}", ".find-count.zero{color:#B42318}"],
  ["T3", ".find-bar input{font:inherit;padding:8px 12px;", ".find-bar input{font:inherit;padding:7px 13px;"],
];

/** Joue le point d'entrée des oracles design sur un fichier. Rend le JSON agrégé. */
function jugerLaPage(racine, fichier) {
  const r = spawnSync(process.execPath,
    [join(racine, "oracles", "run-oracles-design.mjs"), fichier, "--json-only"],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  try { return JSON.parse((r.stdout || "").trim()); }
  catch { return null; }
}

/** Le verdict et les écarts durs d'un oracle nommé, dans le JSON agrégé. */
function lire(agrege, oracle) {
  const o = (agrege && agrege.oracles || []).find((x) => x.oracle === oracle);
  if (!o) return { verdict: "ABSENT", durs: null, regles: [] };
  const durs = (o.findings || []).filter((f) => f.sev === "bloquant" || f.sev === "majeur");
  return { verdict: o.verdict, durs: durs.length, regles: [...new Set(durs.map((f) => f.regle))] };
}

const racine = racineForgeDesign();
if (!racine) {
  console.log("banc de coquille (TF-1162) : SKIP declare — digit-ai-forge-design absente du poste "
    + "(ni FORGE_DESIGN_ROOT, ni depot frere sous FORGE_ROOT ou sous le parent du pilot) ; "
    + "aucun oracle joue, aucun cas compte — le harnais rend ce banc NON JUGE plutot que vert");
  process.exit(0);
}

const echecs = [];
const dossier = mkdtempSync(join(tmpdir(), "banc-coquille-"));
const juger = (html, nom) => { const f = join(dossier, nom); writeFileSync(f, html, "utf8"); return jugerLaPage(racine, f); };
/** Réinjecte les déclarations d'avant le remède ; une déclaration introuvable est un échec du banc. */
const muter = (html, mutations, temoin) => {
  let r = html;
  for (const [, neuf, ancien] of mutations) {
    if (!r.includes(neuf)) {
      echecs.push(`ROUGE (${temoin}) — la declaration corrigee « ${neuf.slice(0, 48)}… » est INTROUVABLE : la `
        + "fixture rouge ne mute plus rien et ne prouve donc plus rien (coquille modifiee sans mettre ce banc a jour)");
      continue;
    }
    r = r.replace(neuf, ancien);
  }
  return r;
};
/** Vérifie que chaque règle attendue est dénoncée par l'oracle nommé. */
const denonce = (j, oracle, regles, temoin) => {
  const l = lire(j, oracle);
  for (const regle of regles) {
    if (!l.regles.includes(regle)) {
      echecs.push(`ROUGE (${temoin}) — ${oracle} ne denonce PAS ${regle} (verdict ${l.verdict}, regles vues : `
        + `${l.regles.join(", ") || "aucune"}) — une assertion qui passe des deux cotes ne prouve rien`);
    }
  }
};
/** Vérifie qu'un oracle nommé rend PASS sans écart dur. */
const vert = (j, oracle, temoin) => {
  const l = lire(j, oracle);
  if (l.verdict !== "PASS" || l.durs !== 0) {
    echecs.push(`VERT (${temoin}) — ${oracle} rend ${l.verdict} avec ${l.durs} ecart(s) dur(s) `
      + `(${l.regles.join(", ") || "aucune regle nommee"}) — attendu : PASS, 0 ecart`);
  }
};

try {
  // ── TÉMOIN 1 — LA PAGE D'ÉTUDE, DÉRIVÉE DU SOCLE ───────────────────────────────────────────
  const page = pageEtude(SOURCE_TEMOIN, join(dossier, "20260920-etude-temoin.md"));
  // Cas 1 — la page exerce les règles du GÉNÉRATEUR : sa barre de recherche est câblée.
  if (!/class="find-bar"/.test(page)) {
    echecs.push("la page d'etude ne porte pas la barre de recherche : les regles CSS du generateur ne sont pas exercees");
  }
  const j1 = juger(page, "etude-temoin.html");
  if (!j1) {
    echecs.push("run-oracles-design.mjs n'a rendu aucun JSON lisible sur la page d'etude : le banc ne peut rien affirmer");
  } else {
    vert(j1, "oracle-slop", "page d'etude");            // Cas 2
    vert(j1, "oracle-tokens", "page d'etude");          // Cas 3
    vert(j1, "oracle-bascule", "page d'etude");         // Cas 4 — TF-1244 : la bascule du socle est là
    // Cas 5 — TF-1315 : les trois composants sont posés sous sceau et VÉRIFIÉS contre le socle.
    const verifies = ((j1.socle_exempte || {}).verifies || []).length;
    if (verifies < 3) {
      echecs.push(`VERT (page d'etude) — ${verifies} composant(s) embarque(s) verifie(s) contre le socle, 3 attendus `
        + "(table-filters.css, table-filters.js, find-in-page.js) : la passe d'imputation n'aurait rien a exempter");
    }
  }
  // Cas 6 — les règles propres au générateur, ramenées à leur état d'avant : T1 et T3 les refusent.
  const j1r = juger(muter(page, AVANT_LE_REMEDE_ETUDE, "page d'etude"), "etude-avant-remede.html");
  if (!j1r) echecs.push("aucun JSON lisible sur la page d'etude d'avant le remede");
  else denonce(j1r, "oracle-tokens", ["T1", "T3"], "page d'etude");
  // Cas 7 — la même page privée de son bouton de bascule : oracle-bascule la refuse.
  const sansBascule = page.replace(/<button id="theme-toggle"[\s\S]*?<\/button>/, "");
  if (sansBascule === page) echecs.push("ROUGE (page d'etude) — le bouton de bascule est introuvable : la fixture ne mute rien");
  else {
    const j1b = juger(sansBascule, "etude-sans-bascule.html");
    const b = lire(j1b, "oracle-bascule");
    if (b.verdict !== "FAIL") echecs.push(`ROUGE (page d'etude) — privee de son bouton de bascule, la page rend ${b.verdict} a oracle-bascule`);
  }

  // ── TÉMOIN 2 — LA COQUILLE PARTAGÉE (pages d'architecture et de modèle de données) ──────────
  // Elle ne porte pas de bascule — c'est le reste déclaré de la classe, ouvert au registre — et ce
  // témoin ne l'affirme donc pas : il tient le remède du 20/09, et lui seul.
  const { front, corps } = lireSource(SOURCE_TEMOIN);
  const partagee = coquille({ titre: "Etude temoin du banc de coquille", description: "Temoin du banc de coquille.",
    front, corpsHtml: mdVersHtml(corps.replace(/^#\s+.+$\r?\n/m, "")), source: SOURCE_TEMOIN, lettre: "D" });
  const j2 = juger(partagee, "coquille-temoin.html");
  if (!j2) echecs.push("run-oracles-design.mjs n'a rendu aucun JSON lisible sur le temoin de la coquille partagee");
  else {
    vert(j2, "oracle-slop", "coquille partagee");       // Cas 8
    vert(j2, "oracle-tokens", "coquille partagee");     // Cas 9
  }
  const j2r = juger(muter(partagee, AVANT_LE_REMEDE_COQUILLE, "coquille partagee"), "coquille-avant-remede.html");
  if (!j2r) echecs.push("aucun JSON lisible sur la coquille partagee d'avant le remede");
  else {
    denonce(j2r, "oracle-slop", ["S1", "S4"], "coquille partagee");      // Cas 10
    denonce(j2r, "oracle-tokens", ["T1", "T3"], "coquille partagee");    // Cas 11
  }
} finally {
  rmSync(dossier, { recursive: true, force: true, maxRetries: 5 });
}

if (echecs.length) {
  console.error("banc de coquille (TF-1162, TF-1317) : FAIL\n  - " + echecs.join("\n  - "));
  process.exit(1);
}
console.log("banc de coquille (TF-1162, TF-1317) : 11 PASS, 0 FAIL — deux temoins juges par "
  + "run-oracles-design.mjs. PAGE D'ETUDE derivee du socle : barre de recherche cablee, oracle-slop, "
  + "oracle-tokens et oracle-bascule PASS, trois composants verifies sous sceau ; ses regles propres "
  + "ramenees a leur etat d'avant refusees par T1 et T3, et privee de sa bascule refusee par "
  + "oracle-bascule. COQUILLE PARTAGEE : oracle-slop et oracle-tokens PASS, et ramenee a son etat "
  + "d'avant le 20/09 refusee par S1, S4, T1 et T3 — chaque regle prouvee dans ses DEUX sens");
