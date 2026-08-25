#!/usr/bin/env node
/**
 * localiser-produit.test.mjs — recette de `localiser-produit.mjs` (TF-0623).
 *
 * Les deux sens sur chaque promesse, sur une arborescence FABRIQUÉE : il trouve par les lots à
 * trois niveaux, il trouve par le nom malgré la ponctuation, il ne trouve PAS ce qui n'existe pas,
 * il ne descend pas sous un produit déjà identifié, et la cause du refus est MESURÉE quand elle
 * peut l'être — ou DÉCLARÉE non mesurée, jamais devinée. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { localiserProduit, causeDuRefus, artefactsAbsents, normal, PROFONDEUR_MAX } from "./localiser-produit.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const CONTRAT = { artefacts: [
  { mode: "copie_conforme", source: "gabarits/RETOURS-FORGES.md", cible: "forge/retours/RETOURS-FORGES.md" },
  { mode: "copie_conforme", source: "gabarits/oracle-lot-retours.mjs", cible: "forge/retours/oracle-lot.mjs" },
  { mode: "presence", source: "gabarits/web/robots.txt", cible: "robots.txt" },
] };

const T = mkdtempSync(join(tmpdir(), "localiser-produit-"));
try {
  // Un produit NICHÉ À TROIS NIVEAUX, sous un dossier de rangement dont le nom ne lui ressemble pas.
  // C'est le cas fondateur, à la ponctuation près : `mon-produit` sous `_Client\Rangement42\`.
  const profond = join(T, "_Client", "Rangement42", "mon-produit");
  mkdirSync(join(profond, "forge", "retours"), { recursive: true });
  writeFileSync(join(profond, "forge", "retours", "mon-produit - RETOURS - 20260825a.md"), "x", "utf8");

  // Un produit trouvable PAR SON NOM, avec un `forge\` mais aucun lot — l'autre branche.
  const parNom = join(T, "AutreProduit");
  mkdirSync(join(parNom, "forge"), { recursive: true });

  // Un dossier de rangement PIÈGE : il porte le nom cherché mais n'a pas de `forge\`.
  mkdirSync(join(T, "mon-produit-archives"), { recursive: true });

  check("il trouve un produit niché à TROIS niveaux, par ses LOTS", () => {
    const r = localiserProduit("mon-produit", T);
    att(r.dossier === profond, `trouvé ${r.dossier}`);
    att(r.par === "lots", `critère « ${r.par} » au lieu de « lots »`);
  });

  check("la ponctuation du nom n'empêche rien : `mon-produit` reconnaît `MonProduit`", () => {
    att(normal("mon-produit") === normal("MonProduit"), "la normalisation ne rapproche pas les deux formes");
    att(normal("Produit-11") === "Produit-11", "la normalisation est fausse");
  });

  check("il trouve par le NOM quand il n'y a pas de lot, et le DIT", () => {
    const r = localiserProduit("AutreProduit", T);
    att(r.dossier === parNom, `trouvé ${r.dossier}`);
    att(r.par === "nom", `critère « ${r.par} » au lieu de « nom »`);
  });

  check("un dossier au bon nom SANS `forge` n'est pas un produit — sinon on juge un dossier d'archives", () => {
    const r = localiserProduit("mon-produit-archives", T);
    att(r.dossier === null, `il a retenu ${r.dossier}`);
  });

  check("un produit absent rend NULL — un négatif exact, pas une devinette", () => {
    const r = localiserProduit("produit-qui-n-existe-pas", T);
    att(r.dossier === null && r.par === null, "il a inventé une cible");
  });

  check("la borne de profondeur est TENUE et pas seulement déclarée", () => {
    const trop = join(T, "a", "b", "c", "d", "trop-profond");
    mkdirSync(join(trop, "forge", "retours"), { recursive: true });
    writeFileSync(join(trop, "forge", "retours", "trop-profond - RETOURS - 20260825a.md"), "x", "utf8");
    att(PROFONDEUR_MAX === 3, `la borne vaut ${PROFONDEUR_MAX}`);
    att(localiserProduit("trop-profond", T).dossier === null,
      "un produit au-delà de la borne a été trouvé : la borne déclarée n'est pas celle qui s'applique");
  });

  check("il ne descend PAS sous un produit déjà identifié", () => {
    const imbrique = join(profond, "sous-projet");
    mkdirSync(join(imbrique, "forge", "retours"), { recursive: true });
    writeFileSync(join(imbrique, "forge", "retours", "sous-projet - RETOURS - 20260825a.md"), "x", "utf8");
    att(localiserProduit("sous-projet", T).dossier === null,
      "un sous-dossier d'un produit a été pris pour un produit");
  });

  // ── la cause du refus : mesurée quand elle peut l'être, déclarée sinon ──
  check("cause MESURÉE (2) — le produit est trouvé et il lui manque l'héritage", () => {
    const c = causeDuRefus("mon-produit", T, CONTRAT);
    att(c.mesuree === true, "la cause n'est pas déclarée mesurée");
    att(/c'est la \(2\)/.test(c.texte), `le texte ne nomme pas la cause (2) : ${c.texte.slice(0, 90)}`);
    att(c.texte.includes(profond), "le texte ne cite pas le chemin absolu mesuré");
    att(/Recopier/.test(c.texte), "le texte ne dit pas le geste qui répare");
  });

  check("cause MESURÉE (3) — le produit A l'héritage : aucune recopie ne répare ce cas", () => {
    writeFileSync(join(profond, "forge", "retours", "RETOURS-FORGES.md"), "x", "utf8");
    writeFileSync(join(profond, "forge", "retours", "oracle-lot.mjs"), "x", "utf8");
    const c = causeDuRefus("mon-produit", T, CONTRAT);
    att(c.mesuree === true, "la cause n'est pas déclarée mesurée");
    att(/c'est la \(3\)/.test(c.texte), `le texte ne nomme pas la cause (3) : ${c.texte.slice(0, 90)}`);
    att(/aucune recopie ne répare/.test(c.texte), "le texte ne dit pas ce qui distingue ce cas");
  });

  check("cause NON MESURÉE — le produit est introuvable : elle le DIT et retombe sur les trois", () => {
    const c = causeDuRefus("produit-absent", T, CONTRAT);
    att(c.mesuree === false, "il prétend avoir mesuré");
    att(/n'est pas localisable/.test(c.texte), "il ne dit pas qu'il n'a pas pu mesurer");
    att(/\(1\)/.test(c.texte) && /\(2\)/.test(c.texte) && /\(3\)/.test(c.texte),
      "il ne rend pas les trois causes connues quand il ne peut pas trancher");
  });

  check("les artefacts absents sont comptés, et rien n'est jugé", () => {
    const absents = artefactsAbsents(profond, CONTRAT);
    att(Array.isArray(absents), "aucune liste rendue");
    att(absents.includes("robots.txt"), "un artefact absent manque à la liste");
    att(!absents.includes("forge/retours/oracle-lot.mjs"), "un artefact PRÉSENT est compté absent");
    att(artefactsAbsents(null, CONTRAT) === null, "un dossier nul devrait rendre null, pas une liste");
    att(artefactsAbsents(profond, null) === null, "un contrat nul devrait rendre null");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nlocaliser-produit (TF-0623) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
