#!/usr/bin/env node
/**
 * Banc de `bancs-isoles.mjs` (TF-0957) — les trois sens qui comptent.
 *
 * Il travaille sur une arborescence JETABLE : le contrôle prend sa racine en argument, donc il
 * s'éprouve sur des bancs inventés plutôt que sur ceux du dépôt, dont le compte bougerait à chaque
 * banc ajouté. Un banc dont l'attendu dépend du parc devient un banc qu'on met à jour sans le lire.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { verifier } from "./bancs-isoles.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "bancs-isoles-"));
mkdirSync(join(T, "todo"), { recursive: true });
const poser = (nom, corps) => writeFileSync(join(T, "todo", nom), corps, "utf8");

// (1) ROUGE — touche la chaîne par sous-processus, ne désigne pas ses tables : c'est le cas exact
//     des cinq bancs qui ont fait entrer neuf produits jouets dans le référentiel réel le 08/09.
poser("nu.test.mjs", [
  'import { spawnSync } from "node:child_process";',
  'spawnSync(process.execPath, ["ingerer-lot.mjs", "lot.tf.jsonl"]);',
].join("\n"));

// (2) VERT — le même banc, isolé comme les autres du dossier le font.
poser("isole.test.mjs", [
  'import { mkdtempSync, writeFileSync } from "node:fs";',
  'import { tmpdir } from "node:os";',
  'import { join } from "node:path";',
  'import { spawnSync } from "node:child_process";',
  'const _iso = mkdtempSync(join(tmpdir(), "x-"));',
  'process.env.FORGE_NOMS_INTERDITS = join(_iso, "_noms-interdits.json");',
  'process.env.FORGE_PRODUITS_PSEUDO = join(_iso, "_produits-pseudonymes.json");',
  'spawnSync(process.execPath, ["ingerer-lot.mjs", "lot.tf.jsonl"]);',
].join("\n"));

// (3) VERT, LA BORNE QUI A ÉTÉ PAYÉE — un banc qui MENTIONNE un nom de module dans une chaîne de
//     test ne touche rien. Le premier jet du contrôle cherchait les noms nus et accusait un banc
//     du dossier des oracles qui éprouve la lecture d'une ligne de rapport. Un contrôle qui crie
//     sur une occurrence en prose se fait désactiver, exactement comme celui qu'il protège.
poser("mention.test.mjs", [
  'import { compteDe } from "./lib.mjs";',
  'compteDe("emettre-travaux (TF-0627) : 24 PASS, 0 FAIL");',
].join("\n"));

// (4) ROUGE, TF-1133 — une recette `self-test*.mjs` (motif I2, sans `.test.mjs`) qui ingère sans
//     désigner ses tables : le cas exact de `todo/self-test.mjs`, invisible à ce contrôle jusqu'au 15/09.
poser("self-test.mjs", [
  'import { execFileSync } from "node:child_process";',
  'execFileSync("node", ["ingerer-lot.mjs", "lot.tf.jsonl", "--registre", "r.jsonl"]);',
].join("\n"));

// (5) ROUGE, TF-1133 — un banc qui lance le générateur d'index, qui pseudonymise ce qu'il écrit.
poser("index.test.mjs", [
  'import { spawnSync } from "node:child_process";',
  'spawnSync(process.execPath, ["readme-dossiers.mjs", "--base", "x"]);',
].join("\n"));

const r = verifier(T);

check("ROUGE — un banc qui lance la chaîne en sous-processus sans désigner ses tables est REFUSÉ", () => {
  const c = r.constats.find((x) => x.fichier.endsWith("nu.test.mjs"));
  att(c, "le banc nu n'est pas relevé — c'est le cas exact qui a pollué le référentiel réel le 08/09");
  att(/référentiel RÉEL/.test(c.message), "le constat ne dit pas ce qui est en jeu : " + c.message);
  att(/mkdtempSync/.test(c.remede), "le remède ne nomme pas le geste attendu : " + c.remede);
});

check("VERT — le même banc, tables jetables désignées, passe", () => {
  att(!r.constats.some((x) => x.fichier.endsWith("isole.test.mjs")), "un banc correctement isolé est refusé");
});

check("VERT, borne — un banc qui MENTIONNE un nom de module en prose n'est pas concerné", () => {
  att(!r.constats.some((x) => x.fichier.endsWith("mention.test.mjs")), "une mention en chaîne de test est prise pour un appel — faux positif payé le 08/09");
  att(r.bancs_touchant_la_chaine === 4, `le contrôle relève ${r.bancs_touchant_la_chaine} bancs touchant la chaîne, 4 attendus (nu, isolé, self-test, index)`);
});

check("le verdict et les compteurs sont cohérents", () => {
  att(r.verdict === "FAIL", "un parc portant un banc nu rend PASS");
  att(r.isoles === 1, `isolés = ${r.isoles}, 1 attendu`);
});

check("ROUGE, TF-1133 — une recette `self-test.mjs` qui ingère sans tables est lue et REFUSÉE", () => {
  att(r.constats.some((x) => x.fichier.endsWith("todo/self-test.mjs")), "la recette self-test*.mjs n'est pas lue — c'est le trou par lequel todo/self-test.mjs ingérait sur les tables réelles");
});

check("ROUGE, TF-1133 — un banc qui lance le générateur d'index sans tables est REFUSÉ", () => {
  att(r.constats.some((x) => x.fichier.endsWith("index.test.mjs")), "le générateur d'index pseudonymise ce qu'il écrit : un banc qui le lance touche la chaîne");
});

// TF-1133 — LE CONTRÔLE JOUÉ SUR LE DÉPÔT RÉEL. Jusqu'au 15/09, seul ce banc l'appelait, et sur ses
// fixtures : aucun pas de recette ne le jouait sur les recettes du dépôt, qui pouvaient donc lire les
// tables du canal sans que rien le dise. Une règle qui ne juge que ses fixtures ne juge rien.
check("le dépôt RÉEL : toute recette qui touche la chaîne désigne des tables jetables", () => {
  const reel = verifier();
  att(reel.verdict === "PASS", `${reel.constats.length} recette(s) non isolée(s) : ${reel.constats.map((c) => c.fichier).join(", ")}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nbancs-isoles (TF-0957) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
