#!/usr/bin/env node
/**
 * ingerer-r47.test.mjs — R-47 câblée à l'arrivée d'un lot : le cercle est rompu.
 *
 * Le fait fondateur du 23/08, et il vaut plus que la règle elle-même. Le défaut d'héritage
 * d'Produit-02 était DÉJÀ VU par `oracle-conformite-projet` — R-43 rendait FAIL, mot pour
 * mot : « précédence de la factory non câblée ». L'oracle existait, il voyait, et personne ne
 * l'a joué. Il n'est déclenché qu'à l'OUVERTURE d'un run et à sa CLÔTURE ; entre les deux, le
 * seul mécanisme qui pourrait le rejouer est le hook de la factory installé chez le produit —
 * or ce hook fait partie des artefacts manquants. Le contrôle dépendait d'un artefact dont il
 * était lui-même le seul juge.
 *
 * Ce que ces cas verrouillent : que le pilot le dise à un moment qu'il maîtrise (un produit qui
 * remet un lot se nomme), et qu'il ne BLOQUE PAS. Refuser l'ingestion parce que le produit n'a
 * pas ses gabarits punirait deux fois le même défaut — une fois à la porte, une fois sur le
 * travail déjà fait. Quinze candidatures l'ont payé en trois jours.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
const GAB = join(ICI, "..", "gabarits");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "r47-"));
const LOT_CONFORME = "# lot\n\n## Remarques restées au produit\n\n"
  + "Aucune remarque n'est restée au produit — vérifié le 2026-08-23.\n\n"
  + "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit.\n";

/** Pose un faux poste : une racine de forges contenant le produit nommé. */
const poste = (nomProjet, { herite }) => {
  const racine = mkdtempSync(join(T, "poste-"));
  const projet = join(racine, nomProjet);
  mkdirSync(join(projet, "forge"), { recursive: true });
  if (herite) {
    mkdirSync(join(projet, "forge", "retours"), { recursive: true });
    mkdirSync(join(projet, "forge", "hooks"), { recursive: true });
    mkdirSync(join(projet, ".claude"), { recursive: true });
    writeFileSync(join(projet, "forge", "retours", "RETOURS-FORGES.md"), readFileSync(join(GAB, "RETOURS-FORGES.md"), "utf8"));
    writeFileSync(join(projet, "forge", "hooks", "factory.mjs"), readFileSync(join(GAB, "hooks-factory.mjs"), "utf8"));
    writeFileSync(join(projet, ".claude", "settings.json"), JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: "command", command: "node forge/hooks/factory.mjs restitution" }] }] } }));
    writeFileSync(join(projet, "CLAUDE.md"), "# projet\n\n## Précédence (R-43)\nLes règles de la factory priment.\n");
  }
  return racine;
};

let serie = 0;
const ingerer = (nomProjet, racine) => {
  const d = mkdtempSync(join(T, "lot-"));
  const base = `${nomProjet} - RETOURS - 2026082${++serie}a`;
  writeFileSync(join(d, `${base}.md`), LOT_CONFORME, "utf8");
  writeFileSync(join(d, `${base}.tf.jsonl`), JSON.stringify({
    schema: 1, titre: "pilot : un retour de recette R-47", contenu: "c", demandeur: nomProjet,
    source: "recette", date_demande: "2026-08-23", forges_cibles_initiales: ["digit-ai-factory"],
  }) + "\n", "utf8");
  const registre = join(d, "reg.jsonl");
  writeFileSync(registre, "", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, join(d, `${base}.tf.jsonl`), "--registre", registre, "--sans-fetch"],
    { encoding: "utf8", timeout: 180000, env: { ...process.env, FORGE_ROOT: racine } });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), registre };
};

check("rouge — produit dont l'héritage manque : l'ingestion AVERTIT et nomme les artefacts absents", () => {
  const r = ingerer("ProduitNu", poste("ProduitNu", { herite: false }));
  if (!/R-47 — AVERTISSEMENT/.test(r.sortie)) throw new Error("aucun avertissement R-47 — le cercle n'est pas rompu");
  if (!/RETOURS-FORGES\.md/.test(r.sortie)) throw new Error("l'avertissement ne NOMME pas l'artefact manquant — un constat sans nom ne se répare pas");
});

check("BORNE — et il n'a PAS bloqué : le lot est ingéré quand même", () => {
  const r = ingerer("ProduitNu2", poste("ProduitNu2", { herite: false }));
  if (r.code !== 0) throw new Error(`exit ${r.code} — refuser ici punirait deux fois le même défaut`);
  const creations = readFileSync(r.registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((e) => e.titre).length;
  if (creations !== 1) throw new Error(`${creations} création(s) — le travail du produit doit entrer malgré son héritage incomplet`);
});

check("verte — produit dont l'héritage est complet et à jour : aucun avertissement", () => {
  const r = ingerer("ProduitConforme", poste("ProduitConforme", { herite: true }));
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
  if (/AVERTISSEMENT/.test(r.sortie)) throw new Error("avertissement sur un produit conforme — un contrôle qui crie toujours se fait ignorer");
});

check("BORNE — produit introuvable sur le poste : déclaré non vérifié, JAMAIS accusé", () => {
  const r = ingerer("ProduitAilleurs", mkdtempSync(join(T, "poste-vide-")));
  if (r.code !== 0) throw new Error(`exit ${r.code} — une remise venue d'ailleurs doit entrer`);
  if (!/NON vérifiée/.test(r.sortie)) throw new Error("le silence n'est pas déclaré — un produit qu'on ne localise pas n'est pas un produit en défaut");
  if (/AVERTISSEMENT/.test(r.sortie)) throw new Error("un produit absent du poste est accusé — ce serait crier sur toutes les remises venues d'ailleurs");
});

check("BORNE — candidature HORS lot de retours : R-47 ne dit rien du tout", () => {
  // Un fichier `candidature-*.tf.jsonl` n'a pas de produit dans son nom. Crier dessus
  // apprendrait a ignorer le message — et un message qu'on ignore ne protege plus personne.
  const d = mkdtempSync(join(T, "hors-lot-"));
  const sidecar = join(d, "candidature-hors-lot-20260823.tf.jsonl");
  writeFileSync(sidecar, JSON.stringify({ schema: 1, titre: "pilot : candidature hors lot",
    contenu: "c", demandeur: "pilot", source: "recette", date_demande: "2026-08-23",
    forges_cibles_initiales: ["digit-ai-factory"] }) + "\n", "utf8");
  const registre = join(d, "reg.jsonl");
  writeFileSync(registre, "", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"], { encoding: "utf8", timeout: 180000 });
  const sortie = (r.stdout || "") + (r.stderr || "");
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${sortie.slice(0, 200)}`);
  if (/R-47/.test(sortie)) throw new Error("R-47 parle d'une candidature hors lot — bruit qui apprend a ignorer le message");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nR-47 câblée à l'ingestion : ${pass} PASS, ${fail} FAIL`);
if (!existsSync(OUTIL)) console.error("outil introuvable");
process.exit(fail ? 1 : 0);
