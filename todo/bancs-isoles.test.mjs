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
  att(r.bancs_touchant_la_chaine === 2, `le contrôle relève ${r.bancs_touchant_la_chaine} bancs touchant la chaîne, 2 attendus`);
});

check("le verdict et les compteurs sont cohérents", () => {
  att(r.verdict === "FAIL", "un parc portant un banc nu rend PASS");
  att(r.isoles === 1, `isolés = ${r.isoles}, 1 attendu`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nbancs-isoles (TF-0957) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
