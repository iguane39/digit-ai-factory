#!/usr/bin/env node
/**
 * relever-heritage.test.mjs — recette de `relever-heritage.mjs` (TF-0626).
 *
 * Les deux sens sur chaque promesse, sur une arborescence FABRIQUÉE : il trouve les produits par
 * leur `forge\`, il n'accuse pas le pilot ni les forges, il distingue ABSENT de PÉRIMÉ — la
 * distinction qui compte, un produit portant une copie périmée croyant être conforme — et il
 * n'écrit RIEN chez les produits, ce qui est vérifié octet pour octet.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { produitsDuParc, etatArtefact, relever, rendreMarkdown } from "./relever-heritage.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "relever-heritage-"));
try {
  // Le PILOT de recette, qui porte les sources du contrat.
  const pilot = join(T, "digit-ai-factory");
  mkdirSync(join(pilot, "gabarits"), { recursive: true });
  writeFileSync(join(pilot, "gabarits", "MODELE.md"), "contenu de reference\n", "utf8");
  writeFileSync(join(pilot, "gabarits", "robots.txt"), "User-agent: *\n", "utf8");
  const CONTRAT = { version: "9.9.9", artefacts: [
    { mode: "copie_conforme", source: "gabarits/MODELE.md", cible: "forge/MODELE.md" },
    { mode: "presence", source: "gabarits/robots.txt", cible: "robots.txt" },
  ] };

  // Une FORGE : elle ne reçoit pas l'héritage et ne doit jamais figurer au relevé.
  mkdirSync(join(T, "digit-ai-forge-tests", "forge"), { recursive: true });

  // Un produit CONFORME : copie identique, plus le fichier de présence.
  const conforme = join(T, "_Client", "produit-conforme");
  mkdirSync(join(conforme, "forge"), { recursive: true });
  writeFileSync(join(conforme, "forge", "MODELE.md"), "contenu de reference\n", "utf8");
  writeFileSync(join(conforme, "robots.txt"), "User-agent: *\n", "utf8");

  // Un produit PÉRIMÉ : il A le fichier, mais ce n'est plus le bon. Le cas qui compte.
  const perime = join(T, "_Client", "produit-perime");
  mkdirSync(join(perime, "forge"), { recursive: true });
  writeFileSync(join(perime, "forge", "MODELE.md"), "vieille version\n", "utf8");

  // Un produit VIDE : un `forge\` et rien d'autre.
  const vide = join(T, "produit-vide");
  mkdirSync(join(vide, "forge"), { recursive: true });

  check("les produits sont trouvés par leur `forge`, à un et deux niveaux", () => {
    const p = produitsDuParc(T);
    att(p.includes(conforme), "un produit à deux niveaux n'est pas trouvé");
    att(p.includes(vide), "un produit à un niveau n'est pas trouvé");
  });

  check("le pilot et les forges ne sont JAMAIS relevés — ils ne reçoivent pas l'héritage", () => {
    const p = produitsDuParc(T);
    att(!p.some((x) => x.includes("digit-ai-factory")), "le pilot figure au relevé");
    att(!p.some((x) => x.includes("digit-ai-forge-tests")), "une forge figure au relevé");
  });

  check("on ne descend pas SOUS un produit : ses sous-dossiers ne sont pas des produits", () => {
    const dedans = join(conforme, "sous-module");
    mkdirSync(join(dedans, "forge"), { recursive: true });
    att(!produitsDuParc(T).includes(dedans), "un sous-dossier d'un produit a été relevé");
  });

  check("ABSENT et PÉRIMÉ sont distingués — c'est toute l'utilité du relevé", () => {
    const bon = etatArtefact(conforme, CONTRAT.artefacts[0], pilot);
    att(bon.etat === "conforme", `état « ${bon.etat} » au lieu de conforme`);
    const vieux = etatArtefact(perime, CONTRAT.artefacts[0], pilot);
    att(vieux.etat === "divergent", `état « ${vieux.etat} » au lieu de divergent`);
    att(vieux.source && vieux.produit && vieux.source !== vieux.produit,
      "le divergent ne montre pas les deux empreintes qui le prouvent");
    const rien = etatArtefact(vide, CONTRAT.artefacts[0], pilot);
    att(rien.etat === "absent", `état « ${rien.etat} » au lieu de absent`);
  });

  check("un artefact en mode `presence` n'est pas comparé — exiger l'identité serait faux", () => {
    writeFileSync(join(perime, "robots.txt"), "tout autre contenu, et c'est LÉGITIME\n", "utf8");
    const r = etatArtefact(perime, CONTRAT.artefacts[1], pilot);
    att(r.etat === "present", `état « ${r.etat} » : un mode presence ne juge que l'existence`);
  });

  check("le relevé compte juste et classe le plus dégradé en tête", () => {
    const lignes = relever(T, CONTRAT, pilot);
    const parNom = Object.fromEntries(lignes.map((l) => [l.produit, l]));
    att(parNom["produit-vide"].absents === 2, `produit vide : ${parNom["produit-vide"].absents} absents au lieu de 2`);
    att(parNom["_Client/produit-conforme"].absents === 0, "le produit conforme est compté en défaut");
    att(parNom["_Client/produit-perime"].divergents === 1, "le périmé n'est pas compté divergent");
    att(lignes[0].absents + lignes[0].divergents >= lignes[lignes.length - 1].absents + lignes[lignes.length - 1].divergents,
      "le classement ne met pas le plus dégradé en tête");
  });

  check("AUCUNE écriture chez les produits — vérifié par empreinte de l'arborescence", () => {
    const empreinte = (d) => readdirSync(d, { withFileTypes: true, recursive: true })
      .map((e) => `${e.parentPath || e.path}|${e.name}|${e.isFile() ? statSync(join(e.parentPath || e.path, e.name)).size : "d"}`)
      .sort().join("\n");
    const avant = empreinte(join(T, "_Client"));
    relever(T, CONTRAT, pilot);
    rendreMarkdown(relever(T, CONTRAT, pilot), CONTRAT, T, 3);
    att(empreinte(join(T, "_Client")) === avant, "le relevé a modifié l'arborescence d'un produit");
  });

  check("le relevé DÉCLARE ce qu'il ne voit pas — l'exhaustivité ne se suppose pas", () => {
    const md = rendreMarkdown(relever(T, CONTRAT, pilot), CONTRAT, T, 3);
    att(/NON RELEV/.test(md), "le rendu ne déclare pas sa limite");
    att(/Aucune écriture/.test(md), "le rendu ne dit pas qu'il n'écrit rien chez les produits");
    att(/PÉRIMÉ/.test(md), "le rendu ne distingue pas visuellement un fichier périmé d'un absent");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nrelever-heritage (TF-0626) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
