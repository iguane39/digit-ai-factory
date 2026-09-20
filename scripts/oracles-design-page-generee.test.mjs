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
 * Les declarations d'AVANT le remede, telles qu'elles vivaient dans la coquille au matin du 20/09.
 * Chacune porte la regle qui la denonce : le sens rouge ne se contente pas d'un FAIL, il verifie
 * que c'est bien CETTE regle qui parle.
 */
const AVANT_LE_REMEDE = [
  ["S1", "border:1px solid var(--line);background:var(--surface);border-radius:var(--r-sm);color:var(--muted)}\n    blockquote p",
    "border-left:3px solid var(--blue);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0;color:var(--muted)}\n    blockquote p"],
  ["S4/T1", "body{background:var(--surface)}}", "body{background:#fff}}"],
  ["T1", ".find-count.zero{color:var(--alerte)}", ".find-count.zero{color:#B42318}"],
  ["T3", "th{font-family:var(--head);font-weight:700;text-align:left;padding:var(--e3);",
    "th{font-family:var(--head);font-weight:700;text-align:left;padding:9px 12px;"],
  ["T3", "td{padding:var(--e2) var(--e3);", "td{padding:7px 12px;"],
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
try {
  const html = pageEtude(SOURCE_TEMOIN, join(dossier, "20260920-etude-temoin.md"));

  // Cas 1 — la page témoin exerce bien les règles du GÉNÉRATEUR, pas seulement celles du socle.
  if (!/class="find-bar"/.test(html)) {
    echecs.push("la page temoin ne porte pas la barre de recherche : les regles CSS de "
      + "generer-page-etude.mjs ne sont pas exercees, et cinq des treize ecarts mesures le 20/09 "
      + "resteraient hors de ce banc");
  }

  const vert = join(dossier, "temoin.html");
  writeFileSync(vert, html, "utf8");
  const jVert = jugerLaPage(racine, vert);
  if (!jVert) {
    echecs.push("run-oracles-design.mjs n'a rendu aucun JSON lisible sur la page temoin : le banc "
      + "ne peut rien affirmer (ni vert ni rouge)");
  } else {
    // Cas 2 — oracle-slop PASS : aucun marqueur de design généré dans la coquille.
    const slop = lire(jVert, "oracle-slop");
    if (slop.verdict !== "PASS") {
      echecs.push(`VERT — oracle-slop rend ${slop.verdict} sur la page produite (${slop.durs} ecart(s) `
        + `dur(s) : ${slop.regles.join(", ") || "aucune regle nommee"})`);
    }
    // Cas 3 — oracle-tokens sans écart dur : jetons tracés et échelle 4 pt tenue.
    const tok = lire(jVert, "oracle-tokens");
    if (tok.verdict !== "PASS" || tok.durs !== 0) {
      echecs.push(`VERT — oracle-tokens rend ${tok.verdict} avec ${tok.durs} ecart(s) dur(s) sur la `
        + `page produite (${tok.regles.join(", ") || "aucune regle nommee"}) — attendu : PASS, 0 ecart`);
    }
  }

  // ── SENS ROUGE ────────────────────────────────────────────────────────────────────────────
  // La MÊME page, ramenée déclaration par déclaration à son état d'avant le remède. Chaque
  // réinjection doit être ATTRAPÉE, et par la règle qui la nomme.
  let rouge = html;
  for (const [, neuf, ancien] of AVANT_LE_REMEDE) {
    if (!rouge.includes(neuf)) {
      echecs.push(`ROUGE — la declaration corrigee « ${neuf.slice(0, 48)}… » est INTROUVABLE dans la `
        + "page produite : la fixture rouge ne mute plus rien et ne prouve donc plus rien "
        + "(coquille modifiee sans mettre ce banc a jour)");
      continue;
    }
    rouge = rouge.replace(neuf, ancien);
  }
  const fRouge = join(dossier, "temoin-avant-remede.html");
  writeFileSync(fRouge, rouge, "utf8");
  const jRouge = jugerLaPage(racine, fRouge);
  if (!jRouge) {
    echecs.push("run-oracles-design.mjs n'a rendu aucun JSON lisible sur la page d'avant le remede");
  } else {
    const slopR = lire(jRouge, "oracle-slop");
    const tokR = lire(jRouge, "oracle-tokens");
    // Cas 4 — S1 et S4 dénoncent le bandeau latéral et le blanc pur.
    for (const regle of ["S1", "S4"]) {
      if (!slopR.regles.includes(regle)) {
        echecs.push(`ROUGE — oracle-slop ne denonce PAS ${regle} sur la page d'avant le remede `
          + `(verdict ${slopR.verdict}, regles vues : ${slopR.regles.join(", ") || "aucune"}) — `
          + "une assertion qui passe des deux cotes ne prouve rien");
      }
    }
    // Cas 5 — T1 et T3 dénoncent les couleurs en dur et les espacements hors échelle.
    for (const regle of ["T1", "T3"]) {
      if (!tokR.regles.includes(regle)) {
        echecs.push(`ROUGE — oracle-tokens ne denonce PAS ${regle} sur la page d'avant le remede `
          + `(verdict ${tokR.verdict}, regles vues : ${tokR.regles.join(", ") || "aucune"})`);
      }
    }
  }
} finally {
  rmSync(dossier, { recursive: true, force: true, maxRetries: 5 });
}

if (echecs.length) {
  console.error("banc de coquille (TF-1162) : FAIL\n  - " + echecs.join("\n  - "));
  process.exit(1);
}
console.log("banc de coquille (TF-1162) : 7 PASS, 0 FAIL — page d'etude generee jugee par "
  + "run-oracles-design.mjs : barre de recherche cablee (regles du generateur exercees), "
  + "oracle-slop PASS et oracle-tokens PASS sans ecart dur sur la page produite ; et sur la MEME "
  + "page ramenee a son etat d'avant le 20/09, S1, S4, T1 et T3 la refusent — chaque regle prouvee "
  + "dans ses DEUX sens");
