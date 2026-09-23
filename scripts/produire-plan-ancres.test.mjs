#!/usr/bin/env node
/**
 * produire-plan-ancres.test.mjs — un plan d'audit se PRODUIT applicable, et le juge de la remise
 * relit ce que le producteur a rendu (TF-1318, étapes B8 et B2 de la chaîne B).
 *
 * Le cas qui compte le plus est l'ALLER-RETOUR : le producteur rend les sections d'une fiche depuis
 * le sidecar, et `oracles/oracle-remise-traduction.mjs` les relit (T2 et T7). Deux programmes, un
 * format ; si l'un dérive, ce cas rougit — c'est la contrepartie câblée d'un format partagé.
 *
 * Verts : plan tenu ; ancre répétée DÉCLARÉE comme telle ; rendu Markdown ; aller-retour vers le
 * juge, une barre verticale dans une commande comprise. Rouges, un défaut chacun : ancre absente
 * (P1), fichier introuvable (P1), ancre ambiguë (P2), remplacement identique (P3), ancre sur deux
 * lignes et chemin à espace (P4), chevauchement (P5), nature hors jeu (C1), artefact sans
 * régénération (C2), fichier hors carte (C3), ancre sur un artefact (C4). Bornes : un plan qui
 * échoue n'est jamais rendu en Markdown ; format inconnu, plan vide et JSON illisible rendent 2.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "produire-plan-ancres.mjs");
const JUGE = join(ICI, "..", "oracles", "oracle-remise-traduction.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// ---- le produit fictif : deux sources, un artefact régénéré depuis l'une d'elles ---------------
const D = mkdtempSync(join(tmpdir(), "plan-ancres-"));
mkdirSync(join(D, "i18n"), { recursive: true });
mkdirSync(join(D, "dist", "es"), { recursive: true });
writeFileSync(join(D, "i18n", "es.json"),
  '{"dispo":"Ningún casa rural disponible","otro":"1 otro casa rural ya está reservado","pie":"casa rural"}', "utf8");
writeFileSync(join(D, "i18n", "pt.json"), '{"dispo":"Nenhum casa de férias disponível"}', "utf8");
writeFileSync(join(D, "dist", "es", "index.html"), "<p>Ningún casa rural disponible</p>", "utf8");

const SOURCES = [
  { fichier: "i18n/es.json", nature: "source" },
  { fichier: "i18n/pt.json", nature: "source" },
  { fichier: "dist/es/index.html", nature: "artefact", source: "i18n/es.json", regenere_par: "npm run build" },
];
const MODIFS = [
  { id: "M1", fichier: "i18n/es.json", ancre: "Ningún casa rural disponible",
    remplacement: "Ninguna casa rural disponible", motif: "accord du déterminant, contrôle (j)" },
  { id: "M2", fichier: "i18n/pt.json", ancre: "Nenhum casa de férias",
    remplacement: "Nenhuma casa de férias", motif: "accord du déterminant, contrôle (j)" },
];
let n = 0;
const plan = (corps) => {
  n += 1;
  const f = join(D, `plan-${n}.json`);
  writeFileSync(f, typeof corps === "string" ? corps : JSON.stringify(corps), "utf8");
  return f;
};
const valide = (surcharges = {}) => ({ format: "plan-ancres@1", modifications: MODIFS, sources: SOURCES, ...surcharges });
const lancer = (f, ...options) => {
  const r = spawnSync(process.execPath, [OUTIL, f, ...options], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* Markdown, ou sortie illisible */ }
  return { code: r.status, j, sortie: r.stdout || "", brut: (r.stdout || "") + (r.stderr || "") };
};
const exigerRouge = (r, regle) => {
  const regles = (r.j?.findings || []).map((x) => x.regle);
  if (r.code !== 1 || !regles.includes(regle)) {
    throw new Error(`attendu FAIL sur ${regle}, exit 1 — obtenu exit ${r.code}, règles ${JSON.stringify(regles)} : ${r.brut.slice(0, 300)}`);
  }
};

// ---- VERT ------------------------------------------------------------------------------------
check("vert — plan tenu : chaque ancre existe, désigne un endroit, vise une source déclarée (exit 0)", () => {
  const r = lancer(plan(valide()));
  if (r.code !== 0 || r.j.verdict !== "PASS" || r.j.mesure.modifications !== 2) throw new Error(r.brut.slice(0, 400));
});

check("vert — une ancre répétée se DÉCLARE (`occurrences: 3`) au lieu d'être refusée", () => {
  // « casa rural » figure trois fois dans es.json : remplacer les trois est un choix, et il s'écrit.
  const toutes = [{ id: "M1", fichier: "i18n/es.json", ancre: "casa rural", remplacement: "casa de campo",
    motif: "terme retenu au glossaire", occurrences: 3 }];
  const r = lancer(plan(valide({ modifications: toutes })));
  if (r.code !== 0) throw new Error(r.brut.slice(0, 400));
});

check("vert — `--markdown` rend les trois sections de la fiche, au format que T2 relit", () => {
  const r = lancer(plan(valide()), "--markdown");
  if (r.code !== 0) throw new Error(r.brut.slice(0, 300));
  for (const titre of ["## Sources de vérité", "## Ancres verbatim", "## Plan applicable"]) {
    if (!r.sortie.includes(titre)) throw new Error(`section absente : ${titre}`);
  }
  if (!r.sortie.includes("- `Ningún casa rural disponible` → i18n/es.json")) throw new Error("ligne d'ancre non conforme à T2");
});

check("ALLER-RETOUR — le juge de la remise relit ce que le producteur a rendu : T2 et T7 PASS", () => {
  const sources = [...SOURCES.slice(0, 2),
    { ...SOURCES[2], regenere_par: "node build.mjs | tee build.log" }];   // une barre verticale DANS la commande
  const md = lancer(plan(valide({ sources })), "--markdown");
  if (md.code !== 0) throw new Error(md.brut.slice(0, 300));
  const fiche = join(D, "fiche-aller-retour.md");
  writeFileSync(fiche, "---\nrole: fiche de remise d'un audit des traductions (chaîne B)\nlocales: es, pt\n---\n\n"
    + md.sortie + "\n## Arbitrages posés à l'humain\n\n- le modèle d'URL localisé\n", "utf8");
  const r = spawnSync(process.execPath, [JUGE, fiche, "--racine", D], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { throw new Error(`juge illisible : ${r.stdout.slice(0, 200)}`); }
  const st = (t) => j.findings.find((x) => x.regle === t)?.statut;
  if (st("T2") !== "PASS" || st("T7") !== "PASS") {
    throw new Error(`T2 ${st("T2")}, T7 ${st("T7")} — le producteur et le juge ne lisent plus le même format : `
      + JSON.stringify(j.findings.filter((x) => ["T2", "T7"].includes(x.regle))).slice(0, 300));
  }
});

// ---- ROUGES ------------------------------------------------------------------------------------
check("rouge P1 — une ancre ABSENTE du fichier : le plan serait inapplicable", () => {
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], ancre: "Una frase que no existe" }] }))), "P1");
});

check("rouge P1 — un fichier visé introuvable", () => {
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], fichier: "i18n/xx.json" }],
    sources: [...SOURCES, { fichier: "i18n/xx.json", nature: "source" }] }))), "P1");
});

check("rouge P2 — une ancre présente plusieurs fois, sans le déclarer : elle ne désigne pas un endroit", () => {
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], ancre: "casa rural" }] }))), "P2");
});

check("rouge P3 — un remplacement IDENTIQUE à l'ancre ne change rien", () => {
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], remplacement: MODIFS[0].ancre }] }))), "P3");
});

check("rouge P4 — une ancre sur deux lignes ne s'écrit pas dans la fiche", () => {
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], ancre: "Ningún casa\nrural" }] }))), "P4");
});

check("rouge P4 — un chemin portant une espace : T2 lirait un autre fichier", () => {
  mkdirSync(join(D, "mes traductions"), { recursive: true });
  writeFileSync(join(D, "mes traductions", "es.json"), '{"a":"Ningún casa rural disponible"}', "utf8");
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], fichier: "mes traductions/es.json" }],
    sources: [{ fichier: "mes traductions/es.json", nature: "source" }] }))), "P4");
});

check("rouge P5 — deux modifications qui se CHEVAUCHENT dans le même fichier", () => {
  exigerRouge(lancer(plan(valide({ modifications: [MODIFS[0],
    { id: "M3", fichier: "i18n/es.json", ancre: "casa rural disponible", remplacement: "casa disponible", motif: "x" }] }))), "P5");
});

check("rouge C1 — une nature hors du jeu fermé { source, artefact }", () => {
  exigerRouge(lancer(plan(valide({ sources: [...SOURCES.slice(0, 2), { ...SOURCES[2], nature: "genere" }] }))), "C1");
});

check("rouge C2 — un artefact sans commande de régénération", () => {
  exigerRouge(lancer(plan(valide({ sources: [...SOURCES.slice(0, 2), { ...SOURCES[2], regenere_par: "" }] }))), "C2");
});

check("rouge C3 — un fichier visé ABSENT de la carte des sources", () => {
  exigerRouge(lancer(plan(valide({ sources: SOURCES.slice(1) }))), "C3");
});

check("rouge C4 — une ancre posée sur un ARTEFACT : écrasée au build suivant", () => {
  exigerRouge(lancer(plan(valide({ modifications: [{ ...MODIFS[0], fichier: "dist/es/index.html" }] }))), "C4");
});

// ---- BORNES ------------------------------------------------------------------------------------
check("borne — un plan qui ÉCHOUE n'est jamais rendu en Markdown, même avec `--markdown`", () => {
  const r = lancer(plan(valide({ modifications: [{ ...MODIFS[0], ancre: "absente" }] })), "--markdown");
  if (r.code !== 1 || r.sortie.includes("## Ancres verbatim") || r.j?.verdict !== "FAIL") throw new Error(r.brut.slice(0, 300));
});

check("borne — un format autre que plan-ancres@1 n'est pas lu : exit 2, et le motif le dit", () => {
  const r = lancer(plan({ ...valide(), format: "plan-ancres@2" }));
  if (r.code !== 2 || !/plan-ancres@1/.test(r.j?.message || "")) throw new Error(r.brut.slice(0, 300));
});

check("borne — un plan sans modification n'a rien à rendre applicable : exit 2", () => {
  if (lancer(plan(valide({ modifications: [] }))).code !== 2) throw new Error("un plan vide n'est pas déclaré non jugeable");
});

check("borne — un JSON illisible est non jugeable, jamais un FAIL du plan", () => {
  if (lancer(plan("{ ceci n'est pas du JSON")).code !== 2) throw new Error("un JSON illisible n'est pas déclaré non jugeable");
});

rmSync(D, { recursive: true, force: true });
console.log(`\nproduire-plan-ancres (TF-1318) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
