#!/usr/bin/env node
/**
 * occuper-copie.mjs — LE MARQUEUR D'OCCUPATION D'UNE COPIE DE TRAVAIL (TF-2621, 16/11/2026).
 *
 * LE FAIT. Le 12/11/2026, deux sessions d'un même produit ont fait travailler chacune un constructeur dans la même copie de travail :
 * 10 fichiers d'un agent écrits au milieu du travail commité de l'autre (Produit-86, RP-67). Rien dans la copie ne disait qu'une session l'occupait.
 *
 * CE QUE FAIT L'OUTIL. Il pose, lit et retire le marqueur d'occupation d'une copie : `<répertoire git de la copie>/occupation-copie.json`
 * (session, run, agent, date), hors de l'arbre donc jamais suivi, supprimé avec la copie. `oracles/hook-flotte.mjs` le lit avant tout lancement
 * d'agent et refuse (exit 2) quand l'occupante est une AUTRE session encore vivante (motif et bornes : l'en-tête de TF-2621 dans ce hook).
 *
 * Usage : node scripts/occuper-copie.mjs --poser <copie> [--session <identifiant>] [--run <run>] [--agent <agent>] [--forcer]
 *             pose le marqueur ; la session est celle de CLAUDE_CODE_SESSION_ID par défaut ; refusé (exit 1) quand une AUTRE session vivante
 *             occupe déjà la copie, sauf --forcer ;
 *         node scripts/occuper-copie.mjs --lire <copie>        dit l'occupante, ou « aucun marqueur » (exit 0)
 *         node scripts/occuper-copie.mjs --liberer <copie>     retire le marqueur
 * Exit : 0 · 1 copie occupée par une autre session vivante (--poser) · 2 usage invalide (option inconnue, valeur absente, session absente, dossier qui n'est pas un dépôt git).
 * NON JUGÉ (déclaré) : la vie d'une session que ce poste ne voit pas (un autre poste) ; une copie créée sans que la session pose son marqueur (le hook ne lit alors rien).
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { ageTranscription, libererOccupation, lireOccupation, poserOccupation, SEUIL_OCCUPATION_MS } from "../oracles/hook-flotte.mjs";

export function executer(argv, env = process.env, maintenant = Date.now()) {
  const a = { mode: null, copie: null, session: env.CLAUDE_CODE_SESSION_ID || "", run: "", agent: "", forcer: false };
  const usage = (m) => ({ code: 2, sortie: `occuper-copie : ${m}` });
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--poser" || x === "--lire" || x === "--liberer") { a.mode = x.slice(2); a.copie = val(); }
      else if (x === "--session") a.session = val();
      else if (x === "--run") a.run = val();
      else if (x === "--agent") a.agent = val();
      else if (x === "--forcer") a.forcer = true;
      else return usage(`option inconnue : ${x}`);
    } catch (e) { return usage(e.message); }
  }
  if (!a.mode) return usage("aucun mode — --poser, --lire ou --liberer");
  const copie = resolve(a.copie);
  if (a.mode === "lire") {
    const m = lireOccupation(copie);
    return m ? { code: 0, sortie: `occuper-copie : ${m.copie} occupée par la session ${m.session}${m.run ? `, run ${m.run}` : ""}${m.agent ? `, agent ${m.agent}` : ""}, posée le ${m.date}`, marqueur: m }
      : { code: 0, sortie: `occuper-copie : aucun marqueur sur ${copie}` };
  }
  if (a.mode === "liberer") {
    const r = libererOccupation(copie);
    return r.ok ? { code: 0, sortie: r.libere ? `occuper-copie : marqueur retiré de ${r.copie}` : `occuper-copie : aucun marqueur sur ${r.copie}, rien à retirer` } : usage(r.raison);
  }
  if (!a.session) return usage("--poser attend --session <identifiant> (ou la variable CLAUDE_CODE_SESSION_ID)");
  const actuelle = lireOccupation(copie);
  if (actuelle && actuelle.session !== a.session && !a.forcer) {
    const age = ageTranscription(actuelle.session, { env, maintenant });
    const ageMarqueur = maintenant - Date.parse(actuelle.date);
    const vivante = age !== null ? age < SEUIL_OCCUPATION_MS : Number.isFinite(ageMarqueur) && ageMarqueur < SEUIL_OCCUPATION_MS;
    if (vivante) return { code: 1, sortie: `occuper-copie : ${actuelle.copie} est occupée par la session ${actuelle.session}, encore vivante : marqueur non posé (créer sa propre copie, attendre sa fin, ou --forcer sur décision)` };
  }
  const r = poserOccupation(copie, { session: a.session, run: a.run, agent: a.agent }, new Date(maintenant));
  return r.ok ? { code: 0, sortie: `occuper-copie : ${r.copie} occupée par la session ${a.session}${a.run ? `, run ${a.run}` : ""}${a.agent ? `, agent ${a.agent}` : ""} (marqueur : ${r.chemin})` } : usage(r.raison);
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 0 ? console.log : console.error)(r.sortie);
  process.exit(r.code);
}
