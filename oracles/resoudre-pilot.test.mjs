// TF-0367 — le pilot se trouve par son CONTENU, et refuse de se deviner.
//
// Le cas réel que ces tests rejouent : le 18/08, un projet dont le `CLAUDE.md` citait
// `<FORGE_ROOT>\digit-ai-forge-pilot\…` a vu sa commande échouer après le renommage du 17/08.
// Il a fallu lister `c:\dev` et reconnaître le dépôt à son contenu — en écartant à la main
// `digit-ai-forge-pilot_old` et `_vide`, qui portent un `oracle-conformite-projet.mjs`
// d'apparence valide. Celui de `_old` aurait rendu un verdict PLAUSIBLE sous des règles périmées.
//
// Le sens qui compte le plus n'est pas « il trouve » — c'est **« il refuse de choisir »** quand
// deux dépôts se ressemblent. Un résolveur qui trancherait au hasard entre le pilot et sa copie
// périmée serait plus dangereux que l'absence de résolveur : il aurait l'air de marcher.

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "resoudre-pilot.mjs");

const SIGNATURE = [
  "oracles/oracle-conformite-projet.mjs",
  "todo/TODO.jsonl",
  "todo/oracle-todo.mjs",
  "REGLES-PROJET.md",
  "CONTRAT-INTERFACE.md",
];

let verts = 0;
const rouges = [];
const cas = (titre, fn) => {
  try {
    fn();
    verts += 1;
    console.log(`  PASS  ${titre}`);
  } catch (e) {
    rouges.push(`${titre} — ${e.message}`);
    console.log(`  ROUGE ${titre} — ${e.message}`);
  }
};

/** Un faux dépôt : `signature` complète ou non, `perime` pose le marqueur. */
function faireDepot(racine, { signature = true, perime = false, partiel = null } = {}) {
  mkdirSync(racine, { recursive: true });
  const fichiers = partiel || (signature ? SIGNATURE : ["REGLES-PROJET.md"]);
  for (const f of fichiers) {
    const cible = join(racine, f);
    mkdirSync(dirname(cible), { recursive: true });
    writeFileSync(cible, "// fixture\n", "utf8");
  }
  if (perime) writeFileSync(join(racine, "PERIME.md"), "# PERIME\n", "utf8");
  return racine;
}

/** Le script est joué en SOUS-PROCESSUS, depuis un ailleurs : c'est la situation du consommateur. */
function resoudre(racineForges, { pilotRoot = null, depuis = null } = {}) {
  const env = { ...process.env, FORGE_ROOT: racineForges };
  delete env.PILOT_ROOT;
  if (pilotRoot) env.PILOT_ROOT = pilotRoot;
  // Le script est copié hors du pilot : sans ça, sa branche « dépôt courant » gagne toujours
  // et on ne testerait jamais la résolution par les frères — celle dont le consommateur dépend.
  const ailleurs = depuis || mkdtempSync(join(tmpdir(), "ailleurs-"));
  mkdirSync(join(ailleurs, "oracles"), { recursive: true });
  const copie = join(ailleurs, "oracles", "resoudre-pilot.mjs");
  writeFileSync(copie, readFileSync(SCRIPT, "utf8"), "utf8");
  const r = spawnSync(process.execPath, [copie, "--json"], { encoding: "utf8", env, cwd: ailleurs });
  let lu = null;
  try { lu = JSON.parse(r.stdout || "{}"); } catch { /* sortie non JSON : le test le dira */ }
  return { exit: r.status, ...(lu || {}) };
}

const atelier = mkdtempSync(join(tmpdir(), "resoudre-pilot-"));

try {
  console.log("\nrésolution par le contenu");

  cas("un seul dépôt à la signature complète est trouvé, et la méthode est dite", () => {
    const racine = join(atelier, "cas1");
    faireDepot(join(racine, "digit-ai-factory"));
    faireDepot(join(racine, "digit-ai-forge-tests"), { signature: false });
    const r = resoudre(racine);
    assert.equal(r.exit, 0);
    assert.match(r.racine, /digit-ai-factory$/);
    assert.match(r.methode, /frère de/);
  });

  cas("le NOM du dépôt n'entre pas dans la décision — c'est tout le sujet de TF-0367", () => {
    const racine = join(atelier, "cas2");
    faireDepot(join(racine, "un-nom-completement-different"));
    const r = resoudre(racine);
    assert.equal(r.exit, 0);
    assert.match(r.racine, /un-nom-completement-different$/);
  });

  console.log("\nle refus de deviner — le sens qui compte");

  cas("DEUX dépôts indiscernables : refus, exit 2, et le remède est nommé", () => {
    const racine = join(atelier, "cas3");
    faireDepot(join(racine, "digit-ai-factory"));
    faireDepot(join(racine, "digit-ai-forge-pilot_old")); // le piège réel du 18/08
    const r = resoudre(racine);
    assert.equal(r.exit, 2, "un choix silencieux entre le pilot et sa copie serait pire que rien");
    assert.equal(r.racine, null);
    assert.match(r.erreur, /indiscernables/);
    assert.match(r.erreur, /PILOT_ROOT|PERIME\.md/);
  });

  cas("PERIME.md tranche, et l'écart est NOMMÉ dans la sortie", () => {
    const racine = join(atelier, "cas4");
    faireDepot(join(racine, "digit-ai-factory"));
    faireDepot(join(racine, "digit-ai-forge-pilot_old"), { perime: true });
    const r = resoudre(racine);
    assert.equal(r.exit, 0);
    assert.match(r.racine, /digit-ai-factory$/);
    assert.ok(r.ecartes.some((e) => /pilot_old.*PERIME/.test(e)),
      "ce qui a été écarté se dit : « introuvable » sans motif n'apprend rien");
  });

  // LE VERROU QUI NE PEUT PAS S'ÉVAPORER (TF-0630). Le cas précédent prouve que `PERIME.md`
  // tranche — mais ce marqueur ne peut PAS être versionné (une copie du pilot partage son dépôt
  // distant avec le pilot vivant), et il a réellement disparu entre le 23 et le 25/08. Ce cas
  // exige donc que le PRÉFIXE du répertoire suffise, SANS marqueur : la copie porte ici une
  // signature complète et aucun `PERIME.md`. Sans le verrou, elle est un second candidat valide
  // et le résolveur refuse de choisir (exit 2) — le cas rougit alors sur `exit`.
  cas("`_archive-` tranche SANS marqueur, et l'écart est NOMMÉ lui aussi", () => {
    const racine = join(atelier, "cas4bis");
    faireDepot(join(racine, "digit-ai-factory"));
    faireDepot(join(racine, "_archive-digit-ai-forge-steering_old"));   // signature COMPLÈTE, pas de PERIME.md
    const r = resoudre(racine);
    assert.equal(r.exit, 0, "un dépôt archivé ne doit plus rendre la résolution ambiguë");
    assert.match(r.racine, /digit-ai-factory$/);
    assert.ok(r.ecartes.some((e) => /_archive-.*_archive-/.test(e)),
      "écarter sans le dire redevient le choix silencieux que ce résolveur interdit");
  });

  cas("aucun candidat : exit 1, distinct de l'ambiguïté", () => {
    const racine = join(atelier, "cas5");
    faireDepot(join(racine, "digit-ai-forge-tests"), { signature: false });
    const r = resoudre(racine);
    assert.equal(r.exit, 1);
    assert.equal(r.erreur, "aucun candidat");
  });

  console.log("\nla signature — ni trop large, ni trop étroite");

  cas("l'oracle de conformité SEUL ne suffit pas : c'est ce que `_old` porte aussi", () => {
    const racine = join(atelier, "cas6");
    faireDepot(join(racine, "copie-partielle"), {
      partiel: ["oracles/oracle-conformite-projet.mjs", "REGLES-PROJET.md"],
    });
    const r = resoudre(racine);
    assert.equal(r.exit, 1, "une signature d'un seul fichier aurait élu la copie périmée");
  });

  cas("$PILOT_ROOT explicite l'emporte, et un $PILOT_ROOT FAUX est écarté avec son motif", () => {
    const racine = join(atelier, "cas7");
    const vrai = faireDepot(join(racine, "digit-ai-factory"));
    const faux = faireDepot(join(racine, "pas-le-pilot"), { signature: false });

    const bon = resoudre(racine, { pilotRoot: vrai });
    assert.equal(bon.exit, 0);
    assert.equal(bon.methode, "$PILOT_ROOT");

    const mauvais = resoudre(racine, { pilotRoot: faux });
    assert.equal(mauvais.exit, 0, "un PILOT_ROOT faux ne casse pas la résolution, il est écarté");
    assert.match(mauvais.racine, /digit-ai-factory$/);
    assert.ok(mauvais.ecartes.some((e) => /PILOT_ROOT.*signature incomplète/.test(e)));
  });

  cas("les limites sont DÉCLARÉES, pas devinées", () => {
    const racine = join(atelier, "cas8");
    faireDepot(join(racine, "digit-ai-factory"));
    const r = resoudre(racine);
    const declare = (r.non_juge || []).join(" ");
    assert.match(declare, /FRAÎCHEUR/, "une copie à jour de signature mais vieille de commits");
    assert.match(declare, /ÉCRITS EN DUR/, "les CLAUDE.md déjà écrits ne sont pas corrigés d'ici");
  });
} finally {
  rmSync(atelier, { recursive: true, force: true });
}

console.log("");
if (rouges.length) {
  console.log(`${rouges.length} test(s) rouge(s) sur ${verts + rouges.length}`);
  process.exit(1);
}
console.log(`${verts}/${verts} tests verts`);
