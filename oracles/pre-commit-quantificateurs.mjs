#!/usr/bin/env node
// pre-commit-quantificateurs.mjs — ferme la LIMITE DÉCLARÉE de la règle N4 (A-109, TF-1010).
//
// LE FAIT QUI L'A FAIT NAÎTRE, daté du 10/09/2026 : le mot « seulement » a été retiré du noyau
// pour gagner cinq octets, et la règle « Livrable accepté sur verdict d'oracle exécuté SEULEMENT »
// a cessé d'être exclusive. Le commit portait un motif légitime — « noyau dans son budget » — et
// la phrase restait grammaticale : la perte ne s'est vue qu'en comparant les deux versions, par
// une relecture humaine du diff. Elle est restée PUBLIÉE 17 minutes et 48 secondes.
//
// N4 attrape ce cas, mais elle compare le noyau de TRAVAIL à sa version COMMISE : une fois
// l'affaiblissement commis, elle ne le voit plus. Sa propre sortie le déclare. Cette garde-ci est
// la moitié manquante — elle juge le passage travail → commit, c'est-à-dire le seul instant où
// l'affaiblissement est encore rattrapable sans réécrire l'histoire.
//
// POURQUOI L'INDEX ET NON L'ARBRE DE TRAVAIL, et c'est la leçon écrite du hameçon voisin :
// ce qui part dans le commit est l'INDEX. Juger l'arbre laisserait passer une perte mise en index
// puis annulée sur disque, et refuserait un commit pour une édition non indexée qui ne part pas.
// La comparaison est donc `git show :CLAUDE.md` contre `git show HEAD:CLAUDE.md`.
//
// Le contrôle est BLOQUANT et il l'assume : retirer un mot qui interdit, quantifie ou exclut n'est
// jamais un ajustement de forme (R-43 — renforcer oui, assouplir jamais). Le contournement reste
// `git commit --no-verify`, et il est alors un geste déclaré.
import { execFileSync } from "node:child_process";
import { jugerQuantificateurs } from "./oracle-claude-md.mjs";

const NOYAU = "CLAUDE.md";

/** Le contenu d'une version du noyau, ou null si elle n'existe pas (premier commit, fichier neuf). */
function lire(reference) {
  try {
    return execFileSync("git", ["show", `${reference}:${NOYAU}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch { return null; }
}

/** Le noyau est-il dans ce qui va être commité ? Sinon il n'y a rien à juger. */
function noyauIndexe() {
  try {
    const sortie = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" });
    return sortie.split("\n").some((l) => l.trim() === NOYAU);
  } catch { return false; }
}

export function juger({ commis, indexe } = {}) {
  if (indexe === null || indexe === undefined) return { verdict: "SANS_OBJET", perdus: [] };
  if (commis === null || commis === undefined) return { verdict: "SANS_OBJET", perdus: [] };
  const perdus = jugerQuantificateurs(commis, indexe);
  return { verdict: perdus.length ? "REFUS" : "PASS", perdus };
}

if (process.argv[1] && process.argv[1].endsWith("pre-commit-quantificateurs.mjs")) {
  if (!noyauIndexe()) process.exit(0);
  const r = juger({ commis: lire("HEAD"), indexe: lire("") });
  if (r.verdict === "REFUS") {
    console.error(`\n[pre-commit] REFUS — ${r.perdus.length} quantificateur(s) DISPARU(S) du noyau : ${r.perdus.join(" · ")}`);
    console.error("Un mot qui INTERDIT, QUANTIFIE ou EXCLUT ne se retire pas pour tenir un budget de taille.");
    console.error("Si la place manque, prenez-la sur un mot qui DÉCRIT, ou reformulez en gardant l'exclusivité");
    console.error("(« sur verdict … seulement » → « sur le seul verdict … »).");
    console.error("Contournement assumé et déclaré : git commit --no-verify\n");
    process.exit(1);
  }
  process.exit(0);
}
