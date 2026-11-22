#!/usr/bin/env node
/**
 * structure-table-noms.test.mjs — recette de `structure-table-noms.mjs` (TF-2725, 22/11/2026).
 *
 * Sens vert : la commande rend le type de la racine, le nombre d'entrées, les types de valeurs, les champs structurels (`pseudo`, `formes`) et le nombre d'éléments des
 * tableaux, pour les deux formes de la table des produits (valeur chaîne, valeur objet `{ pseudo, formes }`), par `--clients`, `--produits` et par un chemin.
 * Sens rouge : AUCUNE clé de la table (les noms FICTIFS de la fixture, à la racine comme dans les sous-objets), aucune valeur de chaîne, aucun élément de tableau n'apparaît
 * sur la sortie standard ni sur la sortie d'erreur, ni en `--json` ; un fichier illisible est refusé avec son seul chemin ; un usage faux est refusé.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { CLES_STRUCTURELLES, decrire } from "./structure-table-noms.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "structure-table-noms.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

// Des noms FICTIFS, reconnaissables : si l'un d'eux sort, la commande a fui.
const NOMS = ["Dupont-Fictif", "Martin-Fictif", "Enseigne-Fictive", "Produit-Fictif-Secret", "graphie-fictive-un", "graphie-fictive-deux", "Pseudo-Fictif-A", "Pseudo-Fictif-B"];
const dossier = mkdtempSync(join(tmpdir(), "structure-table-"));
const clients = join(dossier, "clients.json"), produits = join(dossier, "produits.json"), cassee = join(dossier, "cassee.json");
writeFileSync(clients, JSON.stringify({ [NOMS[0]]: "Client-A", [NOMS[1]]: "Client-B", [NOMS[2]]: "Client-C" }), "utf8");
writeFileSync(produits, JSON.stringify({ [NOMS[3]]: NOMS[6], "Autre-Produit-Fictif": { pseudo: NOMS[7], formes: [NOMS[4], NOMS[5]] }, "Un-Troisieme-Fictif": { pseudo: "Produit-C", inconnue: [NOMS[0]] } }), "utf8");
writeFileSync(cassee, `{"${NOMS[0]}": ${NOMS[1]}`, "utf8");
const lancer = (args, env = {}) => { const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: { ...process.env, ...env } }); return { code: r.status, out: r.stdout || "", err: r.stderr || "" }; };
const TOUS_LES_NOMS = [...NOMS, "Autre-Produit-Fictif", "Un-Troisieme-Fictif"];

try {
  check("vert — la table des clients : racine objet, 3 entrées, 3 chaînes ; aucune clé ni valeur rendue", () => {
    const r = lancer([clients]);
    att(r.code === 0 && /racine : objet, 3 entrée\(s\)/.test(r.out) && /3 chaîne/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
  });
  check("vert — la table des produits mêle chaînes et objets : champs structurels `pseudo` (2) et `formes` (1), 2 tableaux de 3 éléments en tout (celui de la clé non listée compté, jamais montré), 1 clé non listée comptée", () => {
    const r = lancer([produits]);
    att(r.code === 0 && /1 chaîne, 2 objet/.test(r.out) && /pseudo \(2\)/.test(r.out) && /formes \(1\)/.test(r.out) && /tableaux : 2, 3 élément\(s\) au total/.test(r.out) && /1 clé\(s\) des valeurs objet hors de la liste structurelle/.test(r.out), r.out);
    att(/3 clé\(s\) de la racine hors de la liste structurelle/.test(r.out), `les clés de la racine ne sont pas comptées : ${r.out}`);
  });
  check("rouge — aucun nom (clé de la racine, clé non listée d'un sous-objet, valeur, graphie, pseudonyme) n'est rendu, ni en texte, ni en --json, ni sur la sortie d'erreur", () => {
    for (const args of [[clients], [produits], [produits, "--json"], [clients, "--json"], [cassee]]) {
      const r = lancer(args);
      for (const n of TOUS_LES_NOMS) att(!r.out.includes(n) && !r.err.includes(n), `${args.map((a) => a.replace(dossier, "<tmp>")).join(" ")} : « ${n} » est sorti`);
    }
  });
  check("vert — `--clients` et `--produits` résolvent la table par FORGE_NOMS_INTERDITS et FORGE_PRODUITS_PSEUDO, comme le pilot, et ne rendent aucun nom", () => {
    const env = { FORGE_NOMS_INTERDITS: clients, FORGE_PRODUITS_PSEUDO: produits };
    const c = lancer(["--clients"], env), p = lancer(["--produits"], env);
    att(c.code === 0 && /^table : clients/.test(c.out) && /3 entrée/.test(c.out), `clients : ${c.out}${c.err}`);
    att(p.code === 0 && /^table : produits/.test(p.out) && /pseudo \(2\)/.test(p.out), `produits : ${p.out}${p.err}`);
    for (const n of TOUS_LES_NOMS) att(!c.out.includes(n) && !p.out.includes(n), `« ${n} » est sorti par --clients ou --produits`);
  });
  check("rouge — un fichier absent ou illisible est refusé (exit 1) avec son seul chemin, jamais un morceau de son contenu ; un usage faux est refusé (exit 2)", () => {
    const a = lancer([join(dossier, "absente.json")]), b = lancer([cassee]);
    att(a.code === 1 && /table absente/.test(a.err) && b.code === 1 && /illisible/.test(b.err), `absente ${a.code} ${a.err} | cassée ${b.code} ${b.err}`);
    att(lancer([]).code === 2 && lancer([clients, produits]).code === 2 && lancer(["--clients", clients]).code === 2 && lancer(["--tout"]).code === 2, "un usage faux est accepté");
  });
  check("la liste fermée : `pseudo` et `formes` sont structurels, un nom de client ne l'est pas ; une racine tableau ne rend que des types et un effectif", () => {
    att(CLES_STRUCTURELLES.has("pseudo") && CLES_STRUCTURELLES.has("formes") && !CLES_STRUCTURELLES.has(NOMS[0]), "liste fermée");
    const d = decrire([NOMS[0], NOMS[1], { a: 1 }]);
    att(d.type === "tableau" && d.entrees === 3 && d.valeurs["chaîne"] === 2 && d.valeurs["objet"] === 1 && !JSON.stringify(d).includes(NOMS[0]), JSON.stringify(d));
  });
} finally { rmSync(dossier, { recursive: true, force: true }); }

console.log(`\nstructure-table-noms (TF-2725) : ${pass} PASS, ${fail} FAIL — cas rouges : noms de la racine, clés de sous-objets, valeurs, fichier illisible, usage faux`);
process.exit(fail ? 1 : 0);
