#!/usr/bin/env node
/**
 * decouvrir-oracles.test.mjs — recette à DOUBLE SENS de la découverte des oracles du pilot
 * (TF-1319, 23/09/2026).
 *
 * La découverte dit au juge d'enclenchement ce que le pilot porte : un verdict consigné au ledger
 * d'un run sous le nom d'un oracle du pilot est alors RECONNU, et non déclaré inconnu. Les deux
 * sens se prouvent sur des arbres jetables :
 *   vert  · un oracle posé est découvert, où qu'il vive — `oracles\`, `gabarits\`, `todo\` ; un
 *           oracle AJOUTÉ l'est au passage suivant, sans liste à tenir ;
 *   rouge · une recette `*.test.mjs`, le harnais, une bibliothèque, une fixture, une archive, une
 *           dépendance et un entrant ne sont JAMAIS pris pour des oracles ; une racine absente
 *           sort en 2 avec son motif ; deux fichiers du même nom sont DITS.
 * Et un cas sur le dépôt réel : le contrat est tenu, chaque chemin rendu existe.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decouvrirOracles, CONTRAT, FORGE, EST_UN_ORACLE } from "./decouvrir-oracles.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "decouverte-pilot-"));
let n = 0;
const arbre = (fichiers) => {
  const d = join(T, `d${++n}`);
  mkdirSync(d, { recursive: true });
  for (const rel of fichiers) {
    const p = join(d, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, "// fixture de découverte\n", "utf8");
  }
  return d;
};
const cli = (args) => {
  const r = spawnSync(process.execPath, [join(ICI, "decouvrir-oracles.mjs"), ...args], { encoding: "utf8" });
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* illisible : les cas le disent */ }
  return { code: r.status, j };
};

try {
  check("VERT — le dépôt réel : contrat tenu, chaque chemin rendu existe, le juge d'enclenchement compris", () => {
    const r = cli([]);
    if (r.code !== 0) throw new Error(`exit ${r.code}`);
    if (r.j.contrat !== CONTRAT || r.j.forge !== FORGE) throw new Error(`contrat ${r.j.contrat}, forge ${r.j.forge}`);
    const manquants = r.j.oracles.filter((o) => !existsSync(join(ICI, "..", o.chemin)));
    if (manquants.length) throw new Error(`chemins absents : ${manquants.map((o) => o.chemin).join(", ")}`);
    if (!r.j.oracles.some((o) => o.nom === "oracle-enclenchement")) throw new Error("le juge lui-même n'est pas découvert");
  });

  check("VERT — un oracle posé est découvert où qu'il vive : oracles\\, gabarits\\, todo\\", () => {
    const d = arbre(["oracles/oracle-alpha.mjs", "gabarits/oracle-beta.mjs", "todo/oracle-gamma.mjs"]);
    const noms = decouvrirOracles(d).oracles.map((o) => o.nom).sort();
    if (JSON.stringify(noms) !== JSON.stringify(["oracle-alpha", "oracle-beta", "oracle-gamma"])) throw new Error(JSON.stringify(noms));
  });

  check("ROUGE — recette, harnais, bibliothèque, fixture, archive, dépendance et entrant ne sont JAMAIS des oracles", () => {
    const leurres = ["oracles/oracle-alpha.test.mjs", "oracles/self-tests.mjs", "oracles/lib-oracle.mjs",
      "oracles/fixtures/oracle-faux.mjs", "old/oracle-vieux.mjs", "node_modules/p/oracle-dep.mjs",
      "input/00-retours/oracle-entrant.mjs"];
    const d = arbre(["oracles/oracle-alpha.mjs", ...leurres]);
    const r = decouvrirOracles(d);
    const pris = r.oracles.filter((o) => leurres.includes(o.chemin));
    if (pris.length) throw new Error(`leurres pris pour des oracles : ${pris.map((o) => o.chemin).join(", ")}`);
    if (r.oracles.length !== 1) throw new Error(`${r.oracles.length} oracle(s) au lieu de 1`);
  });

  check("VERT — un oracle AJOUTÉ est découvert au passage suivant : la liste vient du disque, pas d'une table", () => {
    const d = arbre(["oracles/oracle-alpha.mjs"]);
    if (decouvrirOracles(d).oracles.length !== 1) throw new Error("état initial faux");
    writeFileSync(join(d, "oracles", "oracle-delta.mjs"), "// ajouté\n", "utf8");
    if (!decouvrirOracles(d).oracles.some((o) => o.nom === "oracle-delta")) throw new Error("l'ajout n'est pas vu");
  });

  check("VERT — deux fichiers du même nom sont DITS : un verdict qui le nomme ne dit pas lequel a tourné", () => {
    const d = arbre(["oracles/oracle-alpha.mjs", "gabarits/oracle-alpha.mjs"]);
    if (!decouvrirOracles(d).non_juge.some((x) => /oracle-alpha/.test(x) && /2 fichiers/.test(x))) throw new Error("doublon tu");
  });

  check("ROUGE — une racine absente sort en 2 avec son motif, jamais en liste vide muette (CLI)", () => {
    const r = cli(["--racine", join(T, "n-existe-pas")]);
    if (r.code !== 2) throw new Error(`exit ${r.code}, 2 attendu`);
    if (r.j.oracles.length !== 0 || !/introuvable/.test(r.j.motif || "")) throw new Error("motif absent");
  });

  check("le motif de nom : un oracle `.py` entre, une recette et un nom sans préfixe n'entrent pas", () => {
    if (!EST_UN_ORACLE("oracle_interaction.py") || !EST_UN_ORACLE("oracle-a11y.py")) throw new Error("un oracle Python est refusé");
    if (EST_UN_ORACLE("oracle-x.test.mjs") || EST_UN_ORACLE("verifier-x.mjs") || EST_UN_ORACLE("oracles.mjs")) throw new Error("un non-oracle est accepté");
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}

console.log(`\ndecouvrir-oracles (pilot) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
