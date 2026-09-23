#!/usr/bin/env node
/**
 * oracle-remise-traduction.test.mjs — la remise d'un AUDIT des traductions (chaîne B) tient ses
 * étapes, ses locales, sa carte des sources et sa confrontation aux données (TF-1318, T5–T8).
 *
 * Le `--self-test` de l'oracle couvre T1–T4 depuis le 27/08 et n'est pas touché. Cette recette
 * couvre les quatre règles de la chaîne B, chacune dans ses DEUX sens : une fiche d'audit verte qui
 * passe, puis une rouge par défaut, et CHAQUE ROUGE NE CASSE QU'UNE PROMESSE — sans quoi une fixture
 * prouverait qu'une règle rougit sans prouver qu'elle rougit sur SA cause. Trois contrôles
 * d'indépendance le vérifient.
 *
 * Les bornes ont leurs propres cas : une remise de RUN (chaîne A) n'est pas jugée sur T5–T8, une
 * remise sans ancre n'a pas de carte à tenir, et un catalogue introuvable est une panne
 * d'environnement (exit 2), jamais un défaut de la fiche.
 *
 * Aucun réseau, aucun dépôt frère : tout vit dans un dossier temporaire.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-remise-traduction.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// ---- le produit fictif : une SOURCE, un ARTEFACT régénéré depuis elle, un catalogue ------------
const D = mkdtempSync(join(tmpdir(), "remise-audit-"));
mkdirSync(join(D, "i18n"), { recursive: true });
mkdirSync(join(D, "dist", "es"), { recursive: true });
writeFileSync(join(D, "i18n", "es.json"), '{"dispo":"Ningún casa rural disponible"}', "utf8");
writeFileSync(join(D, "dist", "es", "index.html"), "<p>Ningún casa rural disponible</p>", "utf8");
const catalogue = (nom, fichiers) => {
  const c = join(D, nom);
  mkdirSync(c, { recursive: true });
  for (const f of fichiers) writeFileSync(join(c, f), "{}", "utf8");
  return c;
};
// `ui.json` n'est PAS une locale (pas un code ISO 639-1) : la règle ne doit pas l'accuser.
const CATALOGUE_OK = catalogue("catalogue-ok", ["fr.json", "es.json", "de.json", "ui.json"]);
const CATALOGUE_PLUS = catalogue("catalogue-plus", ["fr.json", "es.json", "de.json", "it.mjs"]);

// ---- la fiche d'audit VERTE, par sections ------------------------------------------------------
const S = {
  entete: "---\nrole: fiche de remise d'un audit des traductions (chaîne B)\nlocales: fr, es, de\n---\n\n",
  etapes: [
    "## Étapes de la chaîne", "",
    "- B1 : PASS — pan i18n de forge-tests, 0 constat",
    "- B2 : PASS — carte ci-dessous, jugée par T7",
    "- B3 : PASS — glossaire confronté à l'emploi, aucun retenu à zéro",
    "- B4 : PASS — verifier-sonde-glossaire --peremption 365 : 3 preuves dans leur délai",
    "- B5 : FAIL — une chaîne corrigée par le plan M1",
    "- B6 : SANS_OBJET — aucune borne SERP déclarée par le produit, dimensionnement non jugé",
    "- B7 : MANUELLE — entités et citabilité relues à la main ; directives IA : R-27 PASS",
    "- B8 : PASS — produire-plan-ancres : 1 ancre, unique",
    "- B9 : PASS — 2 arbitrages posés",
    "- B10 : PASS — T1 à T8 tenues", "", ""].join("\n"),
  couverture: "## Couverture des locales\n\n- fr : couverte\n- es : couverte\n"
    + "- de : non couverte — aucun locuteur allemand disponible avant la date de remise\n\n",
  carte: "## Sources de vérité\n\n| fichier | nature | source | régénéré par |\n|---|---|---|---|\n"
    + "| i18n/es.json | source | — | — |\n| dist/es/index.html | artefact | i18n/es.json | `npm run build` |\n\n",
  ancres: "## Ancres verbatim\n\n- `Ningún casa rural disponible` → i18n/es.json\n\n",
  arbitrages: "## Arbitrages posés à l'humain\n\n- la forme de la marque dans les titres\n"
    + "- le périmètre de llms.txt par locale\n\n",
  relecture: "## Relecture native\n\nRefusée — aucun locuteur natif disponible avant la date de remise, "
    + "l'exploitant a tranché.\n\n",
  controles: "## Contrôles mécaniques\n\n- accord (genre grammatical) : PASS\n- cohérence interne : PASS\n"
    + "- confrontation aux données : 1 écart\n",
};
const ORDRE = ["entete", "etapes", "couverture", "carte", "ancres", "arbitrages", "relecture", "controles"];
/** Une fiche : la verte, avec des sections remplacées. Une rouge ne remplace QU'UNE promesse. */
const fiche = (nom, remplacements = {}) => {
  const f = join(D, nom);
  writeFileSync(f, ORDRE.map((k) => (k in remplacements ? remplacements[k] : S[k])).join(""), "utf8");
  return f;
};
const jouer = (f, ...options) => {
  const r = spawnSync(process.execPath, [ORACLE, f, "--racine", D, ...options], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit par l'appelant */ }
  return { code: r.status, j, brut: (r.stdout || "") + (r.stderr || "") };
};
const statut = (r, regle) => (r.j?.findings || []).find((x) => x.regle === regle)?.statut;
const exigerRouge = (r, regle) => {
  if (r.code !== 1 || statut(r, regle) !== "FAIL") {
    throw new Error(`attendu FAIL sur ${regle}, exit 1 — obtenu exit ${r.code}, ${regle} ${statut(r, regle)} : ${r.brut.slice(0, 300)}`);
  }
};
const sans = (section, ligne) => S[section].split("\n").filter((l) => !l.startsWith(ligne)).join("\n");

// ---- VERT ------------------------------------------------------------------------------------
check("vert — fiche d'audit complète : T1 à T8 PASS, exit 0", () => {
  const r = jouer(fiche("verte.md"));
  if (r.code !== 0) throw new Error(r.brut.slice(0, 500));
  for (const t of ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"]) {
    if (statut(r, t) !== "PASS") throw new Error(`${t} rend ${statut(r, t)}`);
  }
});

check("vert — la même fiche confrontée au catalogue réel : `ui.json` n'est PAS pris pour une locale", () => {
  const r = jouer(fiche("verte-catalogue.md"), "--catalogue", CATALOGUE_OK);
  if (r.code !== 0 || statut(r, "T6") !== "PASS") throw new Error(r.brut.slice(0, 400));
  if (!/confrontée au catalogue/.test(JSON.stringify(r.j.findings))) throw new Error("T6 ne dit pas avoir confronté au catalogue");
});

check("vert — l'ordre des options ne change rien : `--racine <d> <fiche>` ne prend pas `<d>` pour la fiche", () => {
  const f = fiche("verte-ordre.md");
  const r = spawnSync(process.execPath, [ORACLE, "--racine", D, f], { encoding: "utf8" });
  if (r.status !== 0) throw new Error((r.stdout || "").slice(0, 300));
});

check("vert — `pt_BR` déclarée et `pt-BR` couverte désignent la même locale", () => {
  const entete = "---\nrole: fiche de remise d'un audit des traductions (chaîne B)\nlocales: fr, es, de, pt_BR\n---\n\n";
  const couverture = S.couverture + "- pt-BR : couverte\n\n";
  const r = jouer(fiche("verte-region.md", { entete, couverture }));
  if (r.code !== 0 || statut(r, "T6") !== "PASS") throw new Error(r.brut.slice(0, 400));
});

// ---- T5 : chaque étape porte son verdict (B10) --------------------------------------------------
check("rouge T5 — une étape sans verdict (B6 absente) bloque la remise", () => {
  const r = jouer(fiche("rouge-t5-absente.md", { etapes: sans("etapes", "- B6 ") }));
  exigerRouge(r, "T5");
  if (!/B6 : aucun verdict/.test(JSON.stringify(r.j.findings))) throw new Error("l'étape manquante n'est pas nommée");
});

check("rouge T5 — une étape MANUELLE sans motif est indiscernable d'un oubli", () => {
  const etapes = S.etapes.replace(/- B7 : MANUELLE — [^\n]*/, "- B7 : MANUELLE");
  exigerRouge(jouer(fiche("rouge-t5-muette.md", { etapes })), "T5");
});

check("rouge T5 — deux verdicts pour la même étape : lequel croire ?", () => {
  const etapes = S.etapes.replace("- B4 : PASS", "- B4 : FAIL — une preuve échue\n- B4 : PASS");
  exigerRouge(jouer(fiche("rouge-t5-double.md", { etapes })), "T5");
});

check("rouge T5 — aucune section « Étapes de la chaîne »", () => {
  exigerRouge(jouer(fiche("rouge-t5-section.md", { etapes: "" })), "T5");
});

// ---- T6 : chaque locale servie est couverte ou déclarée non couverte (B10) ----------------------
check("rouge T6 — une locale DÉCLARÉE servie sans ligne de couverture (le tour 17)", () => {
  const r = jouer(fiche("rouge-t6-ligne.md", { couverture: sans("couverture", "- de ") }));
  exigerRouge(r, "T6");
  if (!/de : déclarée servie/.test(JSON.stringify(r.j.findings))) throw new Error("la locale oubliée n'est pas nommée");
});

check("rouge T6 — « non couverte » SANS motif", () => {
  const couverture = S.couverture.replace(/- de : non couverte — [^\n]*/, "- de : non couverte");
  exigerRouge(jouer(fiche("rouge-t6-motif.md", { couverture })), "T6");
});

check("rouge T6 — aucun `locales:` au frontmatter : rien ne dit ce qui n'a pas été regardé", () => {
  const entete = "---\nrole: fiche de remise d'un audit des traductions (chaîne B)\n---\n\n";
  exigerRouge(jouer(fiche("rouge-t6-decl.md", { entete })), "T6");
});

check("rouge T6 — une locale PRÉSENTE au catalogue et absente de `locales:` (it.mjs)", () => {
  const r = jouer(fiche("rouge-t6-catalogue.md"), "--catalogue", CATALOGUE_PLUS);
  exigerRouge(r, "T6");
  if (!/it : présente au catalogue/.test(JSON.stringify(r.j.findings))) throw new Error("la locale du catalogue n'est pas nommée");
});

// ---- T7 : la carte des sources de vérité (B2) ---------------------------------------------------
check("rouge T7 — une ancre posée sur un ARTEFACT : la correction serait écrasée au build (C4)", () => {
  const ancres = "## Ancres verbatim\n\n- `Ningún casa rural disponible` → dist/es/index.html\n\n";
  const r = jouer(fiche("rouge-t7-artefact.md", { ancres }));
  exigerRouge(r, "T7");
  if (statut(r, "T2") !== "PASS") throw new Error("T2 devrait passer : le texte EXISTE dans l'artefact");
  if (!/C4/.test(JSON.stringify(r.j.findings))) throw new Error("la règle C4 n'est pas nommée");
});

check("rouge T7 — un fichier ancré ABSENT de la carte (C3)", () => {
  const carte = S.carte.replace("| i18n/es.json | source | — | — |\n", "");
  const r = jouer(fiche("rouge-t7-absent.md", { carte }));
  exigerRouge(r, "T7");
  if (!/C3/.test(JSON.stringify(r.j.findings))) throw new Error("la règle C3 n'est pas nommée");
});

check("rouge T7 — un artefact sans commande de régénération (C2)", () => {
  const carte = S.carte.replace("| `npm run build` |", "| — |");
  const r = jouer(fiche("rouge-t7-regeneration.md", { carte }));
  exigerRouge(r, "T7");
  if (!/C2/.test(JSON.stringify(r.j.findings))) throw new Error("la règle C2 n'est pas nommée");
});

check("rouge T7 — des ancres et AUCUNE carte des sources de vérité", () => {
  exigerRouge(jouer(fiche("rouge-t7-section.md", { carte: "" })), "T7");
});

// ---- T8 : la confrontation aux données est citée (B5) -------------------------------------------
check("rouge T8 — la confrontation aux données n'est pas citée (« 8 gîtes » dans sept langues)", () => {
  const controles = sans("controles", "- confrontation aux données");
  exigerRouge(jouer(fiche("rouge-t8.md", { controles })), "T8");
});

// ---- indépendance des règles --------------------------------------------------------------------
check("indépendance — la rouge de T7 (ancre sur artefact) passe T5, T6 et T8", () => {
  const ancres = "## Ancres verbatim\n\n- `Ningún casa rural disponible` → dist/es/index.html\n\n";
  const r = jouer(fiche("indep-t7.md", { ancres }));
  for (const t of ["T5", "T6", "T8"]) if (statut(r, t) !== "PASS") throw new Error(`${t} rend ${statut(r, t)}`);
});

check("indépendance — la rouge de T5 (B6 absente) passe T6, T7 et T8", () => {
  const r = jouer(fiche("indep-t5.md", { etapes: sans("etapes", "- B6 ") }));
  for (const t of ["T6", "T7", "T8"]) if (statut(r, t) !== "PASS") throw new Error(`${t} rend ${statut(r, t)}`);
});

check("indépendance — la rouge de T6 par le catalogue passe T5, T7 et T8", () => {
  const r = jouer(fiche("indep-t6.md"), "--catalogue", CATALOGUE_PLUS);
  for (const t of ["T5", "T7", "T8"]) if (statut(r, t) !== "PASS") throw new Error(`${t} rend ${statut(r, t)}`);
});

// ---- bornes ---------------------------------------------------------------------------------------
check("borne — une remise de RUN (chaîne A) n'est pas jugée sur T5–T8 : SANS_OBJET, verdict inchangé", () => {
  const entete = "---\nrole: fiche de remise d'un run de traduction multilingue\n---\n\n";
  const r = jouer(fiche("chaine-a.md", { entete, etapes: "", couverture: "", carte: "" }), "--catalogue", CATALOGUE_PLUS);
  if (r.code !== 0) throw new Error(r.brut.slice(0, 400));
  if (statut(r, "T5-T8") !== "SANS_OBJET") throw new Error("la borne de la chaîne A n'est pas déclarée");
  if (["T5", "T6", "T7", "T8"].some((t) => statut(r, t))) throw new Error("une règle de la chaîne B a jugé une remise de run");
});

check("borne — un audit SANS ancre n'a pas de carte à tenir : T7 SANS_OBJET, les autres jugées", () => {
  const r = jouer(fiche("sans-ancre.md", { ancres: "", carte: "" }));
  if (r.code !== 0) throw new Error(r.brut.slice(0, 400));
  if (statut(r, "T7") !== "SANS_OBJET" || statut(r, "T5") !== "PASS") throw new Error(JSON.stringify(r.j.findings).slice(0, 300));
});

check("borne — un catalogue introuvable est une panne d'environnement : NON_JUGEABLE, exit 2, jamais FAIL", () => {
  const r = jouer(fiche("catalogue-absent.md"), "--catalogue", join(D, "n-existe-pas"));
  if (r.code !== 2 || statut(r, "T6") !== "NON_JUGEABLE") throw new Error(`exit ${r.code}, T6 ${statut(r, "T6")}`);
});

check("le verdict PUBLIE ce qu'il ne juge pas, pour T5, T6 et T7", () => {
  const r = jouer(fiche("non-juge.md"));
  const nj = JSON.stringify(r.j?.non_juge || []);
  for (const t of ["T5", "T6", "T7"]) if (!nj.includes(t)) throw new Error(`${t} absent du non_juge`);
});

rmSync(D, { recursive: true, force: true });
console.log(`\noracle-remise-traduction (T5-T8, TF-1318) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
