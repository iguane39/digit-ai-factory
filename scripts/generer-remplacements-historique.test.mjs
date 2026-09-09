#!/usr/bin/env node
// Banc de `generer-remplacements-historique.mjs` — le générateur des règles de réécriture
// d'historique. Il n'en avait AUCUN jusqu'au 09/09/2026, alors qu'il commande un geste
// irréversible sur une histoire publiée : c'est la classe `controle-sans-fixture-double-sens`.
//
// CE QUE CE BANC ÉPROUVE, et pourquoi chaque cas existe :
//   · le CONTENU et le NOM DE FICHIER doivent recevoir le MÊME traitement — la cinquième passe
//     (09/09) a laissé un nom de client dans un CHEMIN publié parce que le rappel de noms ne
//     faisait que du littéral là où la porte juge avec les variantes de graphie ;
//   · un nom composé passe AVANT le nom qu'il contient, sinon la substitution laisse un nom
//     de produit toujours reconnaissable ;
//   · et les cas NÉGATIFS : ce qui ne doit pas bouger. Sans eux, une règle trop large rendrait
//     vert en cassant du code — un banc qui ne teste que le sens « ça remplace » ne prouve rien.
//
// Le banc n'a besoin d'AUCUNE table réelle : il écrit ses propres tables jetables et désigne
// le générateur par les variables d'environnement, comme un clone hors du parc doit le faire.
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ICI = dirname(fileURLToPath(import.meta.url));
const GENERATEUR = join(ICI, "generer-remplacements-historique.mjs");

const bac = mkdtempSync(join(tmpdir(), "banc-remplacements-"));
const fClients = join(bac, "noms.json");
const fProduits = join(bac, "produits.json");
const sortie = join(bac, "regles");

writeFileSync(fClients, JSON.stringify({
  schema: "pilot/noms-interdits@2",
  noms: ["Acmecorp"],
  identifiants: ["Acmecorp-DevOps"],
  sigles: ["XYZ"],
  pseudonymes: { Acmecorp: "Client-Z", "Acmecorp-DevOps": "Client-Z-DevOps", XYZ: "Sigle-Z" },
}), "utf8");

writeFileSync(fProduits, JSON.stringify({
  schema: "pilot/produits-pseudonymes@2",
  produits: {
    "gestion-des-locaux-vides": "Produit-90",     // multi-mots : doit produire une VARIANTE
    "Portail-Video-IA-Acmecorp": "Produit-91",    // contient un nom de client : passe AVANT lui
    "Zorg": "Produit-92",                          // un seul mot : mot entier, insensible à la casse
    "C:\\Users\\X\\Temp\\PROD": "Produit-93",     // une clé CHEMIN n'est pas un nom : ignorée
  },
}), "utf8");

execFileSync(process.execPath, [GENERATEUR, sortie], {
  env: { ...process.env, FORGE_NOMS_INTERDITS: fClients, FORGE_PRODUITS_PSEUDO: fProduits },
  encoding: "utf8",
});

const regles = readFileSync(join(sortie, "remplacements.txt"), "utf8");
const rappel = readFileSync(join(sortie, "filename-callback.py"), "utf8");

/** Rejoue le rappel de noms tel que `git filter-repo` l'exécutera : un corps Python sur des octets. */
const nomApres = (nom) => {
  const script = join(bac, "essai.py");
  writeFileSync(script, [
    "import sys",
    "def callback(filename):",
    ...rappel.split("\n").map((l) => "    " + l),
    "",
    "sys.stdout.buffer.write(callback(sys.argv[1].encode()))",
  ].join("\n"), "utf8");
  return execFileSync("python", [script, nom], { encoding: "utf8" });
};

const cas = [];
const dit = (libelle, obtenu, attendu) => cas.push({ libelle, ok: obtenu === attendu, obtenu, attendu });
const contient = (libelle, aiguille) => cas.push({ libelle, ok: regles.includes(aiguille), obtenu: regles.includes(aiguille), attendu: true });

// --- ce que le fichier de règles doit porter ---
contient("contenu : le nom de client en trois casses", "Acmecorp==>Client-Z");
contient("contenu : le sigle, insensible à la casse et mot entier", "regex:(?i)(?<![A-Za-z0-9_])XYZ(?![A-Za-z0-9_])==>Sigle-Z");
contient("contenu : le produit d'un seul mot, mot entier", "regex:(?i)(?<![A-Za-z0-9])Zorg(?![A-Za-z0-9])==>Produit-92");
contient("contenu : la VARIANTE de graphie du produit multi-mots", "gestion[\\s\\-_]*des[\\s\\-_]*locaux[\\s\\-_]*vides");
cas.push({
  libelle: "contenu : une clé CHEMIN n'est PAS versée en règle",
  ok: !regles.includes("Produit-93"), obtenu: !regles.includes("Produit-93"), attendu: true,
});

// --- le rappel de noms : le cas qui a coûté un constat le 09/09 ---
dit("nom de fichier : la graphie littérale", nomApres("input/gestion-des-locaux-vides.md"), "input/Produit-90.md");
dit("nom de fichier : la VARIANTE à espaces et majuscules (le constat du 09/09)",
    nomApres("input/Rapport Gestion Des Locaux Vides - 2026.html"), "input/Rapport Produit-90 - 2026.html");
dit("nom de fichier : le nom composé passe AVANT le client qu'il contient",
    nomApres("lots/Portail-Video-IA-Acmecorp.md"), "lots/Produit-91.md");
dit("nom de fichier : le client seul est bien traité", nomApres("docs/Acmecorp.md"), "docs/Client-Z.md");

// --- cas NÉGATIFS : ce qui ne doit pas bouger ---
dit("nom de fichier : un mot qui CONTIENT le produit court reste intact", nomApres("src/Zorgon.mjs"), "src/Zorgon.mjs");
dit("nom de fichier : sans aucun terme, rien ne change", nomApres("docs/lisez-moi.md"), "docs/lisez-moi.md");

rmSync(bac, { recursive: true, force: true });

let ok = 0, ko = 0;
for (const c of cas) {
  if (c.ok) { ok++; console.log(`  [PASS] ${c.libelle}`); }
  else { ko++; console.log(`  [FAIL] ${c.libelle} — obtenu ${JSON.stringify(c.obtenu)}, attendu ${JSON.stringify(c.attendu)}`); }
}
console.log(`\nBanc generer-remplacements-historique : ${ok} PASS, ${ko} FAIL`);
process.exit(ko ? 1 : 0);
