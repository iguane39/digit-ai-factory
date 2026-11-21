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
 *
 * Depuis D-224 (a) du 21/11/2026, il porte aussi les deux autres flux que le manifeste déclare : le coffre de
 * secrets (`secrets`, clé par clé) et la mémoire Claude du projet (`memoire`). Chaque flux dit sa ligne, par des
 * NOMS de clés et de fichiers et des comptes, jamais une valeur ; un conflit de valeur sans base se dit avec la
 * commande du choix, que le hook ne joue jamais à la place de l'humain (garde D-208).
 */
import { resolve } from "node:path";
import { synchroniser } from "./oracle-reprise.mjs";

/** La ligne du coffre : noms de clés et comptes seulement. */
function ligneCoffre(s, sens) {
  const tete = "[reprise — R-64] coffre de secrets";
  if (s.erreur) return `${tete} : ${s.erreur}`;
  if (s.refus) return `${tete} : ${s.refus}`;
  const parts = [];
  for (const f of s.fichiers || []) {
    if (f.absent) continue;
    if (f.refus) { parts.push(`${f.fichier} : REFUS — ${f.refus}`); continue; }
    const portees = sens === "restaurer" ? [...f.cles_au_coffre_seul, ...f.pris_du_coffre] : [...f.cles_au_poste_seul, ...f.pris_du_poste];
    if (f.ecrit && portees.length) parts.push(`${f.fichier} : ${portees.length} clé(s) ${sens === "restaurer" ? "reçue(s) du coffre" : "envoyée(s) au coffre"} (${portees.join(", ")})`);
    if (f.choix?.length) parts.push(`${f.fichier} : choix explicite appliqué pour ${f.choix.join(", ")}`);
  }
  return parts.length ? `${tete} : ${parts.join(" ; ")} — coffre ${s.coffre}` : null;
}

/** La ligne de la mémoire Claude du projet. */
function ligneMemoire(x, sens) {
  const tete = "[reprise — R-64] mémoire Claude";
  if (x.erreur) return `${tete} : ${x.erreur}`;
  if (x.refus) return `${tete} : ${x.refus}`;
  if (!(x.fait.length || x.conflits.length || x.reste || x.exclus.length)) return null;
  return `${tete} : ${x.fait.length} fichier(s) ${sens === "restaurer" ? "restauré(s)" : "envoyé(s)"}`
    + (x.unions.length ? `, dont l'index ${x.unions.join(", ")} fusionné ligne à ligne` : "")
    + (x.conflits.length ? `, ${x.conflits.length} conflit(s), version précédente sauvegardée (${x.conflits[0].sauvegarde})` : "")
    + (x.reste ? `, ${x.reste} reporté(s) au prochain passage (budget de temps atteint)` : "")
    + (x.exclus.length ? `, ${x.exclus.length} écarté(s) par les exclusions dures, qui restent sur leur poste (${x.exclus.slice(0, 3).join(", ")})` : "")
    + ` — ${x.local} (${x.profil}) et ${x.dossier}`;
}

try { (await import("node:fs")).readFileSync(0, "utf8"); } catch { /* stdin du hook, inutilisé */ }
const sens = process.argv.includes("--pousser") ? "pousser" : "restaurer";
const racine = resolve(process.cwd());
let r;
try { r = synchroniser(racine, sens, { budget: sens === "pousser" ? 45 : 200 }); }
catch (e) { r = { erreur: String(e?.message || e).slice(0, 300) }; }

if (r.sans_objet) {
  // TF-2623 : un feu vert de publication vise un dossier synchronisé et le manifeste manque. L'ouverture le dit à la session,
  // qui écrit forge/REPRISE.json dans le tour ; ce n'est pas un geste laissé à l'humain (R-64 §5).
  if (sens === "restaurer" && r.go_sans_manifeste?.length)
    process.stdout.write(`[reprise — R-64] ${r.go_sans_manifeste.length} feu(x) vert(s) de publication au ledger vise(nt) un dossier synchronisé (seq ${r.go_sans_manifeste.map((g) => g.seq).join(", ")}) et forge/REPRISE.json est absent : rien n'a été restauré. `
      + "Écrire forge/REPRISE.json dans CE tour depuis gabarits/REPRISE.json du pilot (emplacements du dossier sur chaque poste, éléments hors git à reprendre), puis rejouer `node forge/hooks/factory.mjs reprise --restaurer` : "
      + "`node <PILOT_ROOT>/oracles/oracle-reprise.mjs` doit rendre RP4 PASS au premier passage\n");
  process.exit(0);
}
const tete = `[reprise — R-64] ${sens === "restaurer" ? "restauration depuis le canal" : "envoi vers le canal"}`;
let ligne;
if (r.erreur) ligne = `${tete} : ${r.erreur}`;
else if (r.refuse) ligne = sens === "pousser" && /non actif/.test(r.message) ? null : `${tete} : ${r.message}`;
else if (r.fait.length || r.conflits.length || r.reste || r.refuses.length || r.regenere?.length)
  ligne = `${tete} : ${r.fait.length} fichier(s) ${sens === "restaurer" ? "restauré(s)" : "envoyé(s)"}`
    + (r.conflits.length ? `, dont ${r.conflits.length} écrasé(s) par plus récent, version précédente sauvegardée (${r.conflits[0].sauvegarde})` : "")
    + (r.reste ? `, ${r.reste} reporté(s) au prochain passage (budget de temps atteint)` : "")
    + (r.refuses.length ? `, ${r.refuses.length} refusé(s) car ni ignoré(s) ni suivi(s) par git (ex. ${r.refuses[0].rel}) : garder le chemin dans .gitignore, ou retirer le fichier du canal` : "")
    + (r.regenere?.some((x) => x.ok) ? `, ${r.regenere.filter((x) => x.ok).length} base(s) régénérée(s) (${r.regenere.filter((x) => x.ok).map((x) => x.produit).join(", ")})` : "")
    + (r.regenere?.some((x) => !x.ok) ? `, régénération en échec : ${r.regenere.filter((x) => !x.ok).map((x) => `« ${x.commande} » (${x.detail})`).join(" ; ")}` : "")
    + ` — canal ${r.canal}`;
const lignes = [ligne, r.secrets ? ligneCoffre(r.secrets, sens) : null, r.memoire ? ligneMemoire(r.memoire, sens) : null].filter(Boolean);
if (lignes.length) (sens === "restaurer" ? process.stdout : process.stderr).write(lignes.join("\n") + "\n");
process.exit(0);
