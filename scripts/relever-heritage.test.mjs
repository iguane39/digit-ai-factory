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
    att(vieux.empreinte_pilot && vieux.empreinte_produit && vieux.empreinte_pilot !== vieux.empreinte_produit,
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
  // ---- LE TROISIEME ETAT (TF-0654) ----------------------------------------------------------
  //
  // « robots.txt absent, gravité majeur » était FAUX sur un produit réel : le fichier vivait en
  // `site/robots.txt` et répondait 200 en production — la racine WEB de ce produit n'est pas la
  // racine de son dépôt. La sonde ne connaissait que deux lectures, « il manque » ou « l'absence
  // est légitime », et aucune des deux n'était vraie.
  check("un artefact trouvé AILLEURS est `hors_racine`, et le relevé DIT où", () => {
    const produit = join(T, "_ClientWeb");
    mkdirSync(join(produit, "forge"), { recursive: true });
    mkdirSync(join(produit, "site"), { recursive: true });
    writeFileSync(join(produit, "site", "robots.txt"), "User-agent: *\n", "utf8");
    const artefact = { cible: "robots.txt", source: "gabarits/web/robots.txt", mode: "presence" };
    const etat = etatArtefact(produit, artefact, pilot);
    att(etat.etat === "hors_racine", `état « ${etat.etat} » au lieu de hors_racine`);
    att(etat.trouve_a === "site/robots.txt", `le relevé ne dit pas OÙ : « ${etat.trouve_a} »`);
  });

  check("BORNE — introuvable partout reste ABSENT : le troisième état n'absout rien", () => {
    const produit = join(T, "_ClientNu");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const etat = etatArtefact(produit, { cible: "robots.txt", source: "gabarits/web/robots.txt", mode: "presence" }, pilot);
    att(etat.etat === "absent", `état « ${etat.etat} » au lieu de absent`);
  });

  // ---- UN SOCLE SE VERIFIE, IL NE SE SUPPOSE PAS (TF-0649) -----------------------------------
  //
  // La règle 10 du socle énumérait ses exclusions de `.gitignore` en PROSE depuis le 06/08. Un
  // produit ne l'enfreignait pas : il ne la rencontrait jamais. Et ce relevé rendait « présent »
  // pour tout mode autre que `copie_conforme`, quand l'oracle de conformité, lui, vérifiait les
  // motifs — deux consommateurs du même contrat, deux verdicts sur le même fichier.
  const ARTEFACT_MOTIFS = {
    cible: ".gitignore", source: "gabarits/gitignore-produit", mode: "presence_et_motifs",
    motifs_exiges: ["__pycache__/", "node_modules/", "!forge/**"],
  };

  check("un fichier qui porte tous les motifs du socle est PRESENT", () => {
    const produit = join(T, "_ClientIgnore");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, ".gitignore"),
      "# le socle\n__pycache__/\nnode_modules/\n!forge/**\n\n# et ce que ce produit ajoute\n.cache/\n", "utf8");
    const etat = etatArtefact(produit, ARTEFACT_MOTIFS, pilot);
    att(etat.etat === "present", `état « ${etat.etat} » : un socle complet doit passer, et le produit garde le droit d'ajouter les siens`);
  });

  check("un motif du socle qui manque rend INCOMPLET, et les manquants sont NOMMÉS", () => {
    const produit = join(T, "_ClientIgnorePartiel");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, ".gitignore"), "__pycache__/\n", "utf8");
    const etat = etatArtefact(produit, ARTEFACT_MOTIFS, pilot);
    att(etat.etat === "incomplet", `état « ${etat.etat} » au lieu de incomplet`);
    att((etat.motifs_absents || []).join(",") === "node_modules/,!forge/**",
      `les motifs absents ne sont pas nommés : ${JSON.stringify(etat.motifs_absents)}`);
  });

  check("BORNE — un motif en COMMENTAIRE ne protège rien, et ne compte pas", () => {
    // Sans cette borne, un `.gitignore` qui MENTIONNE `node_modules/` dans une phrase passerait
    // pour conforme — un vert obtenu sur du texte, jamais sur une exclusion.
    const produit = join(T, "_ClientIgnoreCommente");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, ".gitignore"),
      "__pycache__/\n# node_modules/ sera ajouté plus tard\n!forge/**\n", "utf8");
    const etat = etatArtefact(produit, ARTEFACT_MOTIFS, pilot);
    att(etat.etat === "incomplet", `état « ${etat.etat} » : un motif commenté a été compté comme actif`);
    att((etat.motifs_absents || []).includes("node_modules/"), "le motif commenté n'est pas signalé absent");
  });

  check("BORNE — les dossiers d'archives et de dépendances ne sont JAMAIS fouillés", () => {
    // Sans cette borne, un `robots.txt` traînant dans `node_modules` ou `old/` ferait passer le
    // produit pour « hors racine » — un vert obtenu sur une copie de quelque chose.
    const produit = join(T, "_ClientBruit");
    mkdirSync(join(produit, "forge"), { recursive: true });
    mkdirSync(join(produit, "node_modules", "un-paquet"), { recursive: true });
    writeFileSync(join(produit, "node_modules", "un-paquet", "robots.txt"), "x\n", "utf8");
    mkdirSync(join(produit, "old"), { recursive: true });
    writeFileSync(join(produit, "old", "robots.txt"), "x\n", "utf8");
    const etat = etatArtefact(produit, { cible: "robots.txt", source: "gabarits/web/robots.txt", mode: "presence" }, pilot);
    att(etat.etat === "absent", `état « ${etat.etat} » : un fichier d'archive ou de dépendance a été pris pour la surface servie`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nrelever-heritage (TF-0626) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
