#!/usr/bin/env node
/**
 * verifier-sonde-glossaire.test.mjs — une sonde de glossaire périmée par la dérive de son résultat
 * se voit, et AUCUNE commande ne s'exécute sans qu'on l'ait demandé (TF-1084, reste de TF-0657).
 *
 * LES COMMANDES DES FIXTURES SONT LOCALES ET DÉTERMINISTES — `node -e "…"`, aucun réseau, aucune
 * horloge, aucun dépôt frère. Une recette qui interroge une API tierce mesure le réseau du jour
 * plutôt que la règle, et c'est exactement le genre de preuve que ce verbe existe pour refuser.
 *
 * Rouges : sceau sha256 qui ne tient plus ; sceau `contient` dont le texte a disparu ; sonde qui ne
 * s'exécute plus (exit non nul). Verts : sceau sha256 tenu ; sceau `contient` tenu ; terme
 * CONTRACTUEL ignoré. Bornes (jamais un défaut, toujours comptées) : aucun `--rejouer` → rien
 * n'est exécuté et le motif le dit ; commande sans sceau → NON SCELLÉE ; ligne de visibilité sans
 * commande → laissée à G7 ; glossaire HORS dépôt → non rejoué sans `--rejouer-hors-depot`.
 *
 * PÉREMPTION PAR L'ÂGE (TF-1318, étape B4 de la chaîne B). Vert : preuve dans son délai, jugée
 * SANS rien exécuter — le témoin d'effet de bord le prouve. Rouges : preuve échue (S-3), ligne
 * sans commande qui vieillit aussi (S-3), durée déclarée illisible (S-4), drapeau qui l'emporte
 * sur le frontmatter. Bornes : aucune durée déclarée (comptée, le motif le dit), terme contractuel
 * hors champ, `verifie_le` postérieur à la mesure (compté, jamais accusé), date de mesure
 * illisible (erreur d'usage, exit 2). La date de mesure est FIXÉE par `--le` : une recette qui lit
 * l'horloge changerait de verdict avec le calendrier.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-sonde-glossaire.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};

// La sonde témoin : locale, sans réseau, au résultat connu d'avance. Le sceau est calculé ICI par
// la même normalisation que l'outil — une fixture dont le sceau serait recopié à la main mesurerait
// la patience de son auteur, pas la règle.
const SONDE = `node -e "console.log('Hallenbad x29')"`;
const SCEAU_OK = createHash("sha256").update("Hallenbad x29", "utf8").digest("hex");
const SONDE_KO = `node -e "console.log('Pool x3')"`;

/** Un glossaire minimal, au format exact du gabarit : le verbe lit par l'analyseur de l'oracle. */
const glossaire = (lignePreuve, categorie = "visibilite", { entete = "", verifie = "2026-09-20" } = {}) => `---
role: la terminologie opposable du projet — glossaire
${entete}---

# Glossaire — recette

## piscine couverte

- **categorie** : ${categorie}
- **pivot** : piscine couverte

| locale | retenu | proscrits | portee | preuve | verifie_le |
|---|---|---|---|---|---|
| de | Hallenbad | aucun | partout | ${lignePreuve} | ${verifie} |
`;
const fixture = (preuve, categorie, options) => {
  const D = mkdtempSync(join(tmpdir(), "sonde-glossaire-"));
  const f = join(D, "GLOSSAIRE.md");
  writeFileSync(f, glossaire(preuve, categorie, options), "utf8");
  return { D, f };
};
// Les fixtures vivent en dossier temporaire, donc HORS de ce dépôt : la seconde barrière s'applique
// et le banc la lève explicitement. C'est voulu — elle est ainsi exercée à chaque passage.
const REJEU = ["--rejouer", "--rejouer-hors-depot"];

check("vert — sceau sha256 TENU : la sonde rend encore ce qui a été scellé, FRAIS, exit 0", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\` → attendu sha256:${SCEAU_OK} le 2026-09-20`);
  const r = lancer(f, ...REJEU);
  if (r.code !== 0 || r.j.mesure.frais !== 1) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("rouge — sceau sha256 qui NE TIENT PLUS : PÉRIMÉ, la ligne nommée, exit 1", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE_KO}\` → attendu sha256:${SCEAU_OK} le 2026-09-20`);
  const r = lancer(f, ...REJEU);
  if (r.code !== 1 || r.j.mesure.perimes !== 1) throw new Error(r.brut.slice(0, 400));
  if (!/PÉRIMÉE/.test(JSON.stringify(r.j.findings)) || !/piscine couverte\/de/.test(JSON.stringify(r.j.findings)))
    throw new Error(`le constat ne nomme pas la ligne : ${JSON.stringify(r.j.findings).slice(0, 300)}`);
  rmSync(D, { recursive: true, force: true });
});

check("vert — sceau `contient` TENU : ce qui devait survivre survit", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\` → attendu contient:\`Hallenbad\` le 2026-09-20`);
  const r = lancer(f, ...REJEU);
  if (r.code !== 0 || r.j.mesure.frais !== 1) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("rouge — sceau `contient` dont le texte a DISPARU de la sortie : PÉRIMÉ, exit 1", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE_KO}\` → attendu contient:\`Hallenbad\` le 2026-09-20`);
  const r = lancer(f, ...REJEU);
  if (r.code !== 1 || r.j.mesure.perimes !== 1) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("rouge — sonde qui ne s'EXÉCUTE PLUS : INJOUABLE, majeur, exit 1 (jamais tenue pour fraîche)", () => {
  const { D, f } = fixture(`catalogue servi · \`node -e "process.exit(3)"\` → attendu sha256:${SCEAU_OK} le 2026-09-20`);
  const r = lancer(f, ...REJEU);
  if (r.code !== 1 || r.j.mesure.injouables !== 1 || r.j.mesure.frais !== 0) throw new Error(r.brut.slice(0, 400));
  if (!/INJOUABLE/.test(JSON.stringify(r.j.findings))) throw new Error("l'état injouable n'est pas nommé");
  rmSync(D, { recursive: true, force: true });
});

check("SÉCURITÉ — sans `--rejouer`, AUCUNE commande n'est exécutée : exit 2, et le motif le dit", () => {
  // La fixture porte une sonde qui ÉCRIRAIT un fichier si elle était jouée. Le banc vérifie que le
  // fichier n'existe pas : mesurer l'effet de bord est la seule preuve qu'on n'a rien exécuté —
  // un compteur à zéro se laisse écrire par du code qui a quand même lancé la commande.
  const D = mkdtempSync(join(tmpdir(), "sonde-glossaire-securite-"));
  const temoin = join(D, "temoin.txt").replace(/\\/g, "/");
  const f = join(D, "GLOSSAIRE.md");
  writeFileSync(f, glossaire(`catalogue servi · \`node -e "require('fs').writeFileSync('${temoin}','joué')"\` → attendu contient:\`x\` le 2026-09-20`), "utf8");
  const r = lancer(f);                       // aucun drapeau : le défaut est de NE RIEN exécuter
  if (r.code !== 2) throw new Error(`exit ${r.code} au lieu de 2 : ${r.brut.slice(0, 300)}`);
  if (r.j.mesure.non_rejouees !== 1 || !/--rejouer/.test(r.j.motif || "")) throw new Error(`motif muet : ${JSON.stringify(r.j.motif)}`);
  if (spawnSync(process.execPath, ["-e", `process.exit(require('fs').existsSync(${JSON.stringify(temoin)}) ? 1 : 0)`]).status !== 0)
    throw new Error("la commande a été EXÉCUTÉE sans --rejouer — la première barrière ne tient pas");
  rmSync(D, { recursive: true, force: true });
});

check("SÉCURITÉ — un glossaire HORS de ce dépôt n'est pas rejoué par `--rejouer` seul (un entrant est une DONNÉE)", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\` → attendu sha256:${SCEAU_OK} le 2026-09-20`);
  const r = lancer(f, "--rejouer");          // sans --rejouer-hors-depot
  if (r.code !== 2 || r.j.mesure.non_rejouees !== 1 || r.j.mesure.frais !== 0) throw new Error(r.brut.slice(0, 400));
  if (!/--rejouer-hors-depot/.test(r.j.motif || "")) throw new Error(`le motif ne nomme pas la seconde barrière : ${r.j.motif}`);
  rmSync(D, { recursive: true, force: true });
});

check("borne — commande SANS sceau : NON SCELLÉE, comptée, jamais un défaut (exit 2)", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``);
  const r = lancer(f, ...REJEU);
  if (r.code !== 2 || r.j.mesure.non_scellees !== 1 || r.j.findings.length) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("borne — ligne de visibilité SANS commande : laissée à G7, comptée ici, jamais accusée", () => {
  const { D, f } = fixture("catalogue de langue servi · relevé manuel");
  const r = lancer(f, ...REJEU);
  if (r.code !== 2 || r.j.mesure.sans_commande !== 1 || r.j.findings.length) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("borne — terme CONTRACTUEL : hors champ, aucune sonde externe à rejouer", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE_KO}\` → attendu sha256:${SCEAU_OK} le 2026-09-20`, "contractuel");
  const r = lancer(f, ...REJEU);
  if (r.code !== 2 || r.j.mesure.lignes_visibilite !== 0) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("borne — aucun glossaire sous la cible : rien à juger (exit 2), jamais un vert de complaisance", () => {
  const V = mkdtempSync(join(tmpdir(), "sonde-glossaire-vide-"));
  const r = lancer(V, ...REJEU);
  if (r.code !== 2 || r.j.mesure.glossaires !== 0 || !/aucun glossaire/.test(r.j.motif || "")) throw new Error(r.brut.slice(0, 300));
  rmSync(V, { recursive: true, force: true });
});

check("CÂBLAGE — `oracle-glossaire.mjs --sondes` appelle bien le verbe et rend son verdict", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\` → attendu sha256:${SCEAU_OK} le 2026-09-20`);
  const oracle = join(ICI, "..", "oracles", "oracle-glossaire.mjs");
  const r = spawnSync(process.execPath, [oracle, f, "--sondes", ...REJEU], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit ci-dessous */ }
  if (!j || !j.sondes) throw new Error(`l'oracle n'a pas rendu de bloc \`sondes\` : ${(r.stdout + r.stderr).slice(0, 300)}`);
  if (j.sondes.outil !== "verifier-sonde-glossaire" || j.sondes.mesure.frais !== 1) throw new Error(JSON.stringify(j.sondes).slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});

// ---- PÉREMPTION PAR L'ÂGE (TF-1318, étape B4) --------------------------------------------------
const PEREMPTION_365 = { entete: "peremption_preuves_jours: 365\n" };
const LE = ["--le", "2026-09-23"];

check("vert — preuve DANS son délai (frontmatter) : jugée SANS rien exécuter, exit 0", () => {
  // La sonde ÉCRIRAIT un fichier si elle était jouée : l'âge se juge par une soustraction de
  // dates, et le témoin prouve qu'aucune commande n'a tourné pour le dire.
  const D = mkdtempSync(join(tmpdir(), "sonde-peremption-"));
  const temoin = join(D, "temoin.txt").replace(/\\/g, "/");
  const f = join(D, "GLOSSAIRE.md");
  writeFileSync(f, glossaire(`catalogue servi · \`node -e "require('fs').writeFileSync('${temoin}','joué')"\``,
    "visibilite", PEREMPTION_365), "utf8");
  const r = lancer(f, ...LE);
  if (r.code !== 0 || r.j.mesure.dans_delai !== 1 || r.j.mesure.echues !== 0) throw new Error(r.brut.slice(0, 400));
  if (spawnSync(process.execPath, ["-e", `process.exit(require('fs').existsSync(${JSON.stringify(temoin)}) ? 1 : 0)`]).status !== 0)
    throw new Error("une commande a été EXÉCUTÉE pour juger un âge");
  rmSync(D, { recursive: true, force: true });
});

check("rouge S-3 — preuve ÉCHUE : vérifiée au-delà de la durée déclarée, la ligne et l'âge nommés, exit 1", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``, "visibilite", { ...PEREMPTION_365, verifie: "2025-06-01" });
  const r = lancer(f, ...LE);
  if (r.code !== 1 || r.j.mesure.echues !== 1) throw new Error(r.brut.slice(0, 400));
  const constats = JSON.stringify(r.j.findings);
  if (!/"S-3"/.test(constats) || !/ÉCHUE/.test(constats) || !/479 jour/.test(constats) || !/piscine couverte\/de/.test(constats))
    throw new Error(`le constat ne nomme pas la règle, l'âge ou la ligne : ${constats.slice(0, 300)}`);
  rmSync(D, { recursive: true, force: true });
});

check("rouge S-3 — une ligne SANS commande vieillit aussi : l'âge ne dépend pas de G7", () => {
  const { D, f } = fixture("catalogue de langue servi · relevé manuel", "visibilite",
    { entete: "peremption_preuves_jours: 90\n", verifie: "2025-01-01" });
  const r = lancer(f, ...LE);
  if (r.code !== 1 || r.j.mesure.echues !== 1 || r.j.mesure.sans_commande !== 1) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("rouge S-3 — le drapeau `--peremption` l'emporte sur le frontmatter", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``, "visibilite",
    { entete: "peremption_preuves_jours: 1000\n", verifie: "2026-08-01" });
  const r = lancer(f, ...LE, "--peremption", "30");
  if (r.code !== 1 || r.j.mesure.echues !== 1) throw new Error(r.brut.slice(0, 400));
  if (r.j.peremption.par_glossaire[0].origine !== "--peremption") throw new Error("l'origine de la durée n'est pas dite");
  rmSync(D, { recursive: true, force: true });
});

check("rouge S-4 — une durée déclarée ILLISIBLE est un constat, jamais une durée infinie tenue en silence", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``, "visibilite", { entete: "peremption_preuves_jours: un an\n" });
  const r = lancer(f, ...LE);
  if (r.code !== 1 || !/"S-4"/.test(JSON.stringify(r.j.findings))) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("borne — AUCUNE durée déclarée : l'âge n'est pas jugé, compté, et le motif dit comment la déclarer (exit 2)", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``, "visibilite", { verifie: "2020-01-01" });
  const r = lancer(f, ...LE);
  if (r.code !== 2 || r.j.mesure.sans_peremption !== 1 || r.j.findings.length) throw new Error(r.brut.slice(0, 400));
  if (!/peremption_preuves_jours/.test(r.j.motif || "")) throw new Error(`le motif ne dit pas comment déclarer : ${r.j.motif}`);
  rmSync(D, { recursive: true, force: true });
});

check("borne — un terme CONTRACTUEL n'est pas soumis à la péremption d'une preuve de marché", () => {
  const { D, f } = fixture("catalogue servi", "contractuel", { entete: "peremption_preuves_jours: 30\n", verifie: "2020-01-01" });
  const r = lancer(f, ...LE);
  if (r.code !== 2 || r.j.mesure.lignes_visibilite !== 0 || r.j.mesure.echues !== 0) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("borne — `verifie_le` POSTÉRIEUR à la date de mesure : compté, jamais accusé", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``, "visibilite", { ...PEREMPTION_365, verifie: "2026-09-30" });
  const r = lancer(f, ...LE);
  if (r.j.mesure.dates_futures !== 1 || r.j.mesure.echues !== 0 || r.j.findings.length) throw new Error(r.brut.slice(0, 400));
  rmSync(D, { recursive: true, force: true });
});

check("borne — une date de mesure illisible est une erreur d'USAGE : exit 2, jamais un verdict sur le glossaire", () => {
  const { D, f } = fixture(`catalogue servi · \`${SONDE}\``, "visibilite", PEREMPTION_365);
  const r = lancer(f, "--le", "23/09/2026");
  if (r.code !== 2 || r.j.verdict !== "ERREUR") throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});

console.log(`\nverifier-sonde-glossaire (TF-1084, TF-1318) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
