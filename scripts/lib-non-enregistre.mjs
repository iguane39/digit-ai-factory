#!/usr/bin/env node
/**
 * lib-non-enregistre.mjs — DATER ce qu'un dépôt n'a pas enregistré (TF-1200, campagne du 12/10/2026).
 *
 * Le fait, mesuré le 20/09/2026 au pilot : 78 chemins finis étaient restés 3 à 6 jours hors de
 * l'histoire du dépôt, et le relevé d'ouverture disait seulement « modifications locales non
 * committées », sans âge, comme pour une session en cours. Trois synthèses ont alors écrit « une
 * autre session tient ces fichiers », une inférence jamais datée. Le relevé DATE désormais : compte,
 * âge du plus ancien fichier non généré, et rend le verdict « périmé » au-delà d'un seuil déclaré.
 *
 * Ne comptent pas comme travail à enregistrer, parce qu'un hook les réécrit à chaque session ou
 * qu'ils accompagnent un fichier : les index README.md générés, les sceaux de jugement et de cache
 * (`*.jugement.json`, `*.oracles*.json`), et les journaux machine listés dans MACHINE ci-dessous.
 * Ils restent COMPTÉS à part : l'écart est dit, jamais tu.
 *
 * Seuil : 48 heures, surchargeable par BOOTSTRAP_SEUIL_NON_ENREGISTRE_HEURES. Au-delà, c'est un
 * défaut au pilot (bootstrap.mjs) ; chez une forge, un avertissement daté.
 */
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";

export const SEUIL_HEURES_DEFAUT = 48;

const GENERE = [
  /(^|\/)README\.md$/,
  /\.jugement\.json$/,
  /\.oracles(-cache|-historique)?\.jsonl?$/,
];
const MACHINE = [
  /^todo\/HERITAGE-RELEVES\.jsonl$/,
  /^todo\/observabilite\//,
];
export const estGenere = (chemin) => GENERE.some((r) => r.test(chemin)) || MACHINE.some((r) => r.test(chemin));

export function seuilHeures(env = process.env) {
  const n = Number(env.BOOTSTRAP_SEUIL_NON_ENREGISTRE_HEURES);
  return Number.isFinite(n) && n > 0 ? n : SEUIL_HEURES_DEFAUT;
}

/**
 * @returns {{ total:number, generes:number, travail:number, plusAncien:null|{chemin:string,heures:number}, perime:boolean, seuil:number }}
 */
export function releverNonEnregistres(dest, { maintenant = Date.now(), seuil = seuilHeures() } = {}) {
  const r = spawnSync("git", ["-C", dest, "-c", "core.quotepath=false", "status", "--porcelain", "-z", "--untracked-files=all"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const vide = { total: 0, generes: 0, travail: 0, plusAncien: null, perime: false, seuil };
  if (r.status !== 0) return vide;
  const champs = (r.stdout || "").split("\0").filter(Boolean);
  const chemins = [];
  for (let i = 0; i < champs.length; i++) {
    const c = champs[i];
    const statut = c.slice(0, 2), chemin = c.slice(3);
    if (/[RC]/.test(statut)) i++; // un renommage porte son ancien chemin dans le champ suivant
    chemins.push(chemin);
  }
  let generes = 0, travail = 0, plusAncien = null;
  for (const chemin of chemins) {
    if (estGenere(chemin)) { generes++; continue; }
    travail++;
    let m;
    try { m = statSync(join(dest, chemin)).mtimeMs; } catch { continue; } // supprimé : pas d'âge
    const heures = (maintenant - m) / 3600000;
    if (!plusAncien || heures > plusAncien.heures) plusAncien = { chemin, heures };
  }
  return { total: chemins.length, generes, travail, plusAncien, perime: !!plusAncien && plusAncien.heures > seuil, seuil };
}

export function age(heures) {
  if (heures < 1) return "moins d'une heure";
  if (heures < 48) return `${Math.floor(heures)} h`;
  return `${Math.floor(heures / 24)} j`;
}

/** Phrase du relevé d'ouverture : compte, part générée, âge du plus ancien. */
export function dire(nom, m) {
  if (!m.total) return null;
  const part = m.generes ? `, dont ${m.generes} généré(s) ou sceau(x), non daté(s)` : "";
  const vieux = m.plusAncien
    ? ` ; le plus ancien fichier non généré date de ${age(m.plusAncien.heures)} (${m.plusAncien.chemin})`
    : "";
  return `${nom} — ${m.total} modification(s) locale(s) non enregistrée(s)${part}${vieux}`;
}
