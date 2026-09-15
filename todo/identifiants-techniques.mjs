#!/usr/bin/env node
/**
 * identifiants-techniques.mjs — relève, dans le texte d'un lot, les IDENTIFIANTS TECHNIQUES que la
 * pseudonymisation ne connaît pas, pour qu'un humain les QUALIFIE avant qu'ils voyagent (TF-0966).
 *
 * LE FAIT, du 08/09/2026. Quatre items du registre citaient dans leur corps cinq identifiants
 * techniques d'un système client — deux de forme MAJUSCULES_AVEC_SOULIGNES, trois de forme
 * schema.table — tous ABSENTS des deux tables du canal confidentiel. La chaîne d'anonymisation ne
 * les voyait donc pas, la porte de publication non plus, et le registre était publié. Le défaut
 * n'est pas dans la chaîne — elle déclare qu'un nom absent des tables passe — mais dans l'entrée :
 * rien n'invitait personne à qualifier ces objets au moment où un lot les faisait entrer.
 *
 * CE QUI EST RELEVÉ : les deux formes du cas fondateur, après la substitution des tables (un
 * identifiant déjà connu est remplacé, il ne reste que les inconnus), MOINS le vocabulaire PUBLIC
 * du pilot — tout identifiant déjà présent dans ses fichiers suivis de code et de doctrine
 * (`scripts`, `oracles`, `references`, `gabarits`, `todo/*.mjs`) : `FORGE_ROOT` ou `MODE_DEMO` sont
 * publiés par construction. Mesuré sur les 350 créations du registre le 15/09/2026 : 50
 * identifiants MAJUSCULES et 32 schema.table distincts avant cette exclusion (voir la recette).
 *
 * CE QUI N'EST PAS JUGÉ : la confidentialité elle-même — un poste ne peut pas savoir seul si un
 * nom de table appartient à un client. Le relevé demande, il ne tranche pas.
 *
 * Usage : node todo/identifiants-techniques.mjs <fichier> — imprime le relevé (exit 0 vide, 1 sinon).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const MOTIF_MAJUSCULES = /(?<![A-Za-z0-9_])[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+(?![A-Za-z0-9_])/g;
export const MOTIF_SCHEMA_TABLE = /(?<![A-Za-z0-9_./\\-])[a-z][a-z0-9_]{1,40}\.[a-z][a-z0-9_]{1,40}(?![A-Za-z0-9_.(/\\-])/g;
// Un nom de fichier n'est pas un objet de base : `lot.md`, `oracle.mjs`.
const EXTENSION = /\.(md|mjs|cjs|js|ts|json|jsonl|py|html|css|txt|yml|yaml|toml|lock|sh|ps1|pdf|docx|pptx|xlsx|svg|png|jpg|env|example|tmdl|pbip|sql|csv)$/i;

/** Les identifiants techniques d'un texte, uniques, dans l'ordre d'apparition. */
export function relever(texte) {
  const t = String(texte || "");
  const vus = new Set();
  for (const m of t.match(MOTIF_MAJUSCULES) || []) vus.add(m);
  for (const m of t.match(MOTIF_SCHEMA_TABLE) || []) if (!EXTENSION.test(m)) vus.add(m);
  return [...vus];
}

let corpusMemo = null;
/** Le vocabulaire public du pilot : le contenu de ses fichiers suivis de code et de doctrine. */
export function corpusPublic(racine = join(ICI, "..")) {
  if (corpusMemo !== null) return corpusMemo;
  const r = spawnSync("git", ["-C", racine, "-c", "core.quotepath=false", "ls-files", "--", "scripts", "oracles", "references", "gabarits", "todo/*.mjs"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const fichiers = r.status === 0 ? r.stdout.split(/\r?\n/).filter((f) => /\.(mjs|md|json|py)$/i.test(f)) : [];
  const morceaux = [];
  for (const f of fichiers) { try { morceaux.push(readFileSync(join(racine, f), "utf8")); } catch { /* fichier du relevé absent du disque */ } }
  corpusMemo = morceaux.join("\n");
  return corpusMemo;
}

/** Ce qui reste à qualifier : relevé moins le vocabulaire public. */
export function aQualifier(textes, corpus = corpusPublic()) {
  const tous = new Set();
  for (const t of textes) for (const id of relever(t)) tous.add(id);
  return [...tous].filter((id) => !corpus.includes(id));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2]) {
  const reste = aQualifier([readFileSync(process.argv[2], "utf8")]);
  console.log(reste.length ? `${reste.length} identifiant(s) technique(s) à qualifier : ${reste.join(", ")}` : "aucun identifiant technique à qualifier");
  process.exit(reste.length ? 1 : 0);
}
