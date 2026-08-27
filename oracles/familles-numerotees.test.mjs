#!/usr/bin/env node
// familles-numerotees.test.mjs — I3 : les familles DÉCLARÉES sont celles du DISQUE.
//
// Joué par `oracles/self-tests.mjs` (I2 découvre tout `*.test.mjs` du dépôt).
//
// LE FAIT (18/08/2026, trouvé en répondant à « plus rien d'autre à traiter ? »). D-15 a posé
// les familles numérotées d'`input\` et d'`output\`, D-16 a conventionné leurs NOMS et fixé
// l'attribution du numéro : « à la création, premier numéro libre du dépôt, STABLE ensuite ».
// Trois tables décrivaient donc l'état du disque — et RIEN ne les confrontait à lui.
//
// Résultat mesuré : le 18/08 au matin, en ouvrant le canal des artefacts (TF-0364), j'ai pris
// le numéro 03 d'`input\` alors que la table le déclarait à `03-entrants-media`. Le premier
// numéro libre était 05. La faute est passée inaperçue une journée entière, et elle serait
// restée invisible aussi longtemps que personne n'aurait relu la table — c'est-à-dire
// indéfiniment, puisque personne ne relit une table qu'un contrôle ne joue pas.
//
// Trois règles, et la troisième est celle qui manquait le plus :
//   I3.a  toute famille du DISQUE est déclarée à la table de son dossier — un canal que la
//         table ignore est un canal dont personne ne connaît la règle d'usage. Une DÉCLARATION
//         est une LIGNE DE TABLE dont la première cellule est la famille : une simple mention
//         ailleurs dans la page ne dit pas comment employer le canal ;
//   I3.b  toute famille DÉCLARÉE existe sur le disque — une famille déclarée sans dossier
//         envoie un dépôt dans le vide, ce qui est pire qu'un canal absent : elle a l'air
//         d'exister ;
//   I3.c  les numéros sont UNIQUES dans un dossier. Sinon numéroter ne sert à rien.
//
// L'exception d'`output\` est NOMMÉE, jamais tue : `05-catalogues-readmes-forges` et
// `05-insatisfactions` partagent le 05, et D-16 al. (b) l'a GELÉ plutôt que renuméroté —
// `output/05-insatisfactions/` est pointé par le registre des insatisfactions (TF-0339), et un
// renumérotage casserait un chemin porté par un registre à événements figés. Ce n'est donc pas
// un seuil qu'on assouplit : c'est une exception datée, motivée, et qui échouerait si elle
// s'étendait à une troisième famille.
//
// exit 0 si tout tient, 1 sinon.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const MOTIF_FAMILLE = /^(\d{2})-[a-z0-9-]+$/;

// Doublons de numéro GELÉS par une décision, avec sa référence. Une paire absente d'ici est un
// défaut ; une paire présente ici reste visible dans la sortie, jamais silencieuse.
const DOUBLONS_GELES = new Map([
  ["output|05", "D-16 al. (b) du 17/08 — `output/05-insatisfactions/` est pointé par "
    + "`insatisfactions/REGISTRE.jsonl` (TF-0339) : renuméroter casserait un chemin porté par un "
    + "registre à événements figés. Numéro gelé, mapping documenté au LISEZMOI."],
]);

let echecs = 0;
let joues = 0;
const dit = (ok, message) => {
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${message}`);
  joues += 1;
  if (!ok) echecs += 1;
};

for (const dossier of ["input", "output"]) {
  const chemin = join(RACINE, dossier);
  if (!existsSync(chemin)) {
    dit(false, `${dossier}\\ : dossier absent du dépôt`);
    continue;
  }

  const surDisque = readdirSync(chemin, { withFileTypes: true })
    .filter((e) => e.isDirectory() && MOTIF_FAMILLE.test(e.name))
    .map((e) => e.name)
    .sort();

  const lisezmoi = join(chemin, "LISEZMOI.md");
  if (!existsSync(lisezmoi)) {
    dit(false, `${dossier}\\LISEZMOI.md absent — les familles ne sont déclarées nulle part`);
    continue;
  }
  // DÉFAUT DE MA PREMIÈRE ÉCRITURE, trouvé par mutation : je récoltais les noms de famille
  // DANS TOUT LE DOCUMENT. Retirer `04-outillage` de la table ne faisait donc rien échouer —
  // le nom apparaît aussi dans la table de correspondance des anciens chemins, et cela suffisait
  // à le compter pour déclaré. Un contrôle qui accepte n'importe quelle mention ne vérifie pas
  // une déclaration : il vérifie qu'on a prononcé le mot. I3.a était donc non discriminant, et
  // les deux autres sens le cachaient en passant.
  //
  // Une DÉCLARATION est désormais une LIGNE DE TABLE dont la PREMIÈRE cellule est la famille.
  // C'est la forme des deux tables, et c'est la seule qui porte la règle d'usage du canal.
  const texte = readFileSync(lisezmoi, "utf8");
  const declarees = [...new Set(
    texte.split(/\r?\n/)
      .map((l) => /^\|\s*`(\d{2}-[a-z0-9-]+)\\?`\s*\|/.exec(l))
      .filter(Boolean)
      .map((m) => m[1]),
  )].sort();

  // I3.a — du disque vers la table.
  const nonDeclarees = surDisque.filter((f) => !declarees.includes(f));
  dit(!nonDeclarees.length,
    `I3.a ${dossier}\\ : les ${surDisque.length} famille(s) du disque sont déclarées`
    + (nonDeclarees.length ? ` — MANQUE(NT) à la table : ${nonDeclarees.join(", ")}` : ""));

  // I3.b — de la table vers le disque. C'est le sens qui a manqué : une famille déclarée sans
  // dossier a l'air d'exister, et un dépôt qu'on y ferait irait dans le vide.
  const fantomes = declarees.filter((f) => !surDisque.includes(f));
  dit(!fantomes.length,
    `I3.b ${dossier}\\ : les ${declarees.length} famille(s) déclarée(s) existent sur le disque`
    + (fantomes.length
      ? ` — DÉCLARÉE(S) SANS DOSSIER : ${fantomes.join(", ")} (créer le dossier avec sa notice, `
        + "ou retirer la ligne de la table — un canal qui a l air d exister est pire qu un canal absent)"
      : ""));

  // I3.c — unicité des numéros, avec les gels NOMMÉS.
  const parNumero = new Map();
  for (const f of surDisque) {
    const n = f.slice(0, 2);
    parNumero.set(n, [...(parNumero.get(n) || []), f]);
  }
  for (const [numero, familles] of [...parNumero].sort()) {
    if (familles.length === 1) continue;
    const gel = DOUBLONS_GELES.get(`${dossier}|${numero}`);
    dit(Boolean(gel),
      `I3.c ${dossier}\\ : numéro ${numero} porté par ${familles.length} familles `
      + `(${familles.join(", ")})`
      + (gel ? ` — doublon GELÉ et motivé : ${gel}` : " — numéro non unique, et aucun gel déclaré"));
  }
  const uniques = [...parNumero.values()].every((v) => v.length === 1);
  if (uniques) {
    dit(true, `I3.c ${dossier}\\ : ${parNumero.size} numéro(s), tous uniques`);
  }
}

// Le COMPTE DE CAS figure dans la ligne de résumé, et pas seulement le verdict : sans lui, cette
// recette reste hors du cliquet de `lib-baseline-recettes.mjs` (TF-0681) et peut perdre des cas
// sans que rien ne le signale. La forme employée est celle de la maison — `N/N`.
console.log(echecs
  ? `\nI3 — familles numérotées : ${echecs} écart(s) sur ${joues} cas`
  : `\nI3 — familles numérotées : ${joues}/${joues} cas — disque et tables d accord (input, output)`);
process.exit(echecs ? 1 : 0);
