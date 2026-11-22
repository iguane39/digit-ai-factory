#!/usr/bin/env node
/**
 * structure-table-noms.mjs — LA STRUCTURE D'UNE TABLE DE NOMS, SANS UN SEUL NOM (TF-2725, 22/11/2026).
 *
 * LE FAIT, le 15/11/2026 (test D-215) : un agent rédacteur, à qui la consigne interdisait d'afficher les tables désignées par `FORGE_NOMS_INTERDITS` et
 * `FORGE_PRODUITS_PSEUDO`, a affiché les CLÉS de leurs sous-objets pour en comprendre la forme ; ces clés sont des noms réels de clients. Il l'a déclaré, mais les
 * noms sont restés dans sa transcription locale. Une consigne qui interdit d'afficher une table sans dire comment connaître sa forme pousse l'agent à la sonder.
 * Cette commande est la voie : toute consigne qui touche à une table de noms la cite.
 *
 * Usage :
 *   node scripts\structure-table-noms.mjs --clients | --produits | <fichier.json>   [--json]
 *     `--clients` et `--produits` résolvent la table comme le fait le pilot (`scripts\lib-confidentiel.mjs` : variables, canal confidentiel, anciens fichiers).
 *
 * Ce qui est rendu : le type de la racine, le nombre d'entrées, le type et le nombre de leurs valeurs, les NOMS DE CHAMP STRUCTURELS d'une valeur objet
 * (`pseudo`, `formes`, `alias`… liste fermée ci-dessous) avec leur effectif, le nombre d'éléments des tableaux. Ce qui n'est JAMAIS rendu : une clé qui n'est pas dans
 * la liste fermée (c'est un nom possible, elle est seulement comptée), une valeur de chaîne, un élément de tableau. Aucune valeur ni clé de la table ne sort sur la
 * sortie d'erreur non plus : un fichier illisible est refusé avec son seul chemin.
 * Exit : 0 structure rendue · 1 fichier absent ou illisible · 2 usage.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cheminsTables } from "./lib-confidentiel.mjs";

/** La liste FERMÉE des clés qui décrivent la forme d'une entrée et ne sont jamais un nom. Toute autre clé est comptée, jamais affichée. */
export const CLES_STRUCTURELLES = new Set(["pseudo", "pseudonyme", "formes", "alias", "aliases", "note", "notes", "version", "date", "source", "sources", "_commentaire", "_meta", "clients", "produits", "noms", "entrees", "entries", "tables", "type", "kind", "motif", "casse", "mot_entier"]);

const typeDe = (v) => (v === null ? "null" : Array.isArray(v) ? "tableau" : typeof v === "object" ? "objet" : typeof v === "string" ? "chaîne" : typeof v === "number" ? "nombre" : typeof v === "boolean" ? "booléen" : typeof v);
const compter = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);

/** Décrit une valeur : { type, entrees, valeurs: { type → n }, champs: { clé structurelle → n }, cles_non_listees, elements_tableaux }. Pur, sans aucune valeur ni clé non listée. */
export function decrire(valeur) {
  const d = { type: typeDe(valeur) };
  if (d.type === "tableau") {
    d.entrees = valeur.length;
    const types = new Map(); for (const e of valeur) compter(types, typeDe(e));
    d.valeurs = Object.fromEntries(types);
    return d;
  }
  if (d.type !== "objet") return d;
  const cles = Object.keys(valeur);
  d.entrees = cles.length;
  const types = new Map(), champs = new Map(), tableaux = { tableaux: 0, elements: 0 };
  let nonListees = 0;
  for (const k of cles) {
    const v = valeur[k];
    compter(types, typeDe(v));
    if (v && typeof v === "object" && !Array.isArray(v)) for (const kk of Object.keys(v)) { if (CLES_STRUCTURELLES.has(kk)) compter(champs, kk); else nonListees++; }
    if (Array.isArray(v)) { tableaux.tableaux++; tableaux.elements += v.length; }
    if (v && typeof v === "object" && !Array.isArray(v)) for (const kk of Object.keys(v)) if (Array.isArray(v[kk])) { tableaux.tableaux++; tableaux.elements += v[kk].length; }
  }
  const structurelles = cles.filter((k) => CLES_STRUCTURELLES.has(k));
  d.valeurs = Object.fromEntries(types);
  d.champs_des_valeurs = Object.fromEntries(champs);
  d.cles_racine_structurelles = structurelles;
  d.cles_racine_non_listees = cles.length - structurelles.length;
  d.cles_des_valeurs_non_listees = nonListees;
  d.tableaux = tableaux;
  return d;
}

/** Le texte lisible d'une description : jamais une clé non listée ni une valeur. */
export function rendre(d, nom) {
  const l = [`table : ${nom} — racine : ${d.type}${d.entrees !== undefined ? `, ${d.entrees} entrée(s)` : ""}`];
  if (d.valeurs) l.push(`valeurs : ${Object.entries(d.valeurs).map(([t, n]) => `${n} ${t}`).join(", ") || "aucune"}`);
  if (d.champs_des_valeurs && Object.keys(d.champs_des_valeurs).length) l.push(`champs structurels des valeurs objet : ${Object.entries(d.champs_des_valeurs).map(([k, n]) => `${k} (${n})`).join(", ")}`);
  if (d.cles_racine_structurelles?.length) l.push(`clés structurelles de la racine : ${d.cles_racine_structurelles.join(", ")}`);
  if (d.tableaux?.tableaux) l.push(`tableaux : ${d.tableaux.tableaux}, ${d.tableaux.elements} élément(s) au total`);
  if (d.cles_racine_non_listees) l.push(`${d.cles_racine_non_listees} clé(s) de la racine hors de la liste structurelle : comptée(s), jamais affichée(s) (ce sont des noms possibles)`);
  if (d.cles_des_valeurs_non_listees) l.push(`${d.cles_des_valeurs_non_listees} clé(s) des valeurs objet hors de la liste structurelle : comptée(s), jamais affichée(s)`);
  l.push("aucune clé non structurelle ni aucune valeur de la table n'est rendue par cette commande");
  return l.join("\n");
}

export function principal(argv, env = process.env, sortie = (t) => process.stdout.write(t + "\n"), erreur = (t) => process.stderr.write(t + "\n")) {
  const libres = argv.filter((a) => !a.startsWith("--"));
  const inconnues = argv.filter((a) => a.startsWith("--") && !["--clients", "--produits", "--json"].includes(a));
  if (inconnues.length || (libres.length + ["--clients", "--produits"].filter((o) => argv.includes(o)).length) !== 1)
    { erreur("usage : node scripts\\structure-table-noms.mjs (--clients | --produits | <fichier.json>) [--json]"); return 2; }
  let chemin, nom;
  if (argv.includes("--clients") || argv.includes("--produits")) {
    const t = cheminsTables(env.FORGE_ROOT || undefined);
    nom = argv.includes("--clients") ? "clients" : "produits";
    chemin = nom === "clients" ? t.clients : t.produits;
  } else { chemin = resolve(libres[0]); nom = "fichier"; }
  if (!existsSync(chemin)) { erreur(`table absente : ${chemin}`); return 1; }
  let valeur;
  try { valeur = JSON.parse(readFileSync(chemin, "utf8")); } catch { erreur(`table illisible (JSON invalide) : ${chemin}`); return 1; }
  const d = decrire(valeur);
  sortie(argv.includes("--json") ? JSON.stringify({ table: nom, chemin, ...d }, null, 1) : rendre(d, `${nom} (${chemin})`));
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) process.exit(principal(process.argv.slice(2)));
