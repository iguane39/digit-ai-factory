#!/usr/bin/env node
/**
 * hook-reprise.mjs — la reprise d'un produit sur un autre poste, jouée sans geste humain (R-64, TF-1736).
 *
 * Appelé depuis un produit par son lanceur (`node forge/hooks/factory.mjs reprise --restaurer|--pousser`),
 * le dossier du produit pour cwd :
 *   --restaurer  au hook d'ouverture (SessionStart, asynchrone) : ce que le canal porte et que ce poste
 *                n'a pas, ou a plus ancien, revient sur le poste ;
 *   --pousser    au hook de fin de tour (Stop) : ce qui a changé hors de git sur ce poste part vers le
 *                canal, seulement sous le feu vert de publication consigné au manifeste (R-38).
 *
 * Il ne porte aucune règle : `oracle-reprise.mjs` décide fichier par fichier. Il ne bloque JAMAIS un
 * tour (exit 0) : un canal absent se dit, il n'empêche pas de travailler. Sans `forge/REPRISE.json`,
 * il se tait — un produit qui n'a pas déclaré de canal n'a rien à reprendre.
 */
import { resolve } from "node:path";
import { synchroniser } from "./oracle-reprise.mjs";

try { (await import("node:fs")).readFileSync(0, "utf8"); } catch { /* stdin du hook, inutilisé */ }
const sens = process.argv.includes("--pousser") ? "pousser" : "restaurer";
const racine = resolve(process.cwd());
let r;
try { r = synchroniser(racine, sens, { budget: sens === "pousser" ? 45 : 200 }); }
catch (e) { r = { erreur: String(e?.message || e).slice(0, 300) }; }

if (r.sans_objet) process.exit(0);
const tete = `[reprise — R-64] ${sens === "restaurer" ? "restauration depuis le canal" : "envoi vers le canal"}`;
let ligne;
if (r.erreur) ligne = `${tete} : ${r.erreur}`;
else if (r.refuse) ligne = sens === "pousser" && /non actif/.test(r.message) ? null : `${tete} : ${r.message}`;
else if (r.fait.length || r.conflits.length || r.reste)
  ligne = `${tete} : ${r.fait.length} fichier(s) ${sens === "restaurer" ? "restauré(s)" : "envoyé(s)"}`
    + (r.conflits.length ? `, dont ${r.conflits.length} écrasé(s) par plus récent, version précédente sauvegardée (${r.conflits[0].sauvegarde})` : "")
    + (r.reste ? `, ${r.reste} reporté(s) au prochain passage (budget de temps atteint)` : "")
    + ` — canal ${r.canal}`;
if (ligne) (sens === "restaurer" ? process.stdout : process.stderr).write(ligne + "\n");
process.exit(0);
