#!/usr/bin/env node
// verifications-lundi — les cadences du pilot qui ne lisent que le dépôt, jouées sans session (D-42 (a), 19/10/2026).
//
// LE FAIT. L'ouverture du pilot rappelait seule les cadences hebdomadaires : sans session, rien ne partait, et
// 11 jours ont séparé les relevés de récidives du 01/10 et du 12/10. La décision D-42 (a) les confie à un
// workflow GitHub du lundi qui ne pousse rien : le rapport part en artefact, et une issue s'ouvre s'il y a
// quelque chose à lire.
//
// CE QUI EST JOUÉ. Les quatre relevés que l'ouverture rend et qui ne lisent que des fichiers suivis :
// la surveillance des récidives (`observer-recidives.mjs`), la revue hebdomadaire des propositions, les
// revues datées et le stock d'items sans classe. Ceux qui lisent le poste (modèles en service, flotte,
// secrets, amorçage) restent à l'ouverture : un serveur GitHub n'a ni `~/.claude` ni les réglages du poste.
//
// L'ALERTE. Une dérive de récidives, un relevé non joué, une revue hebdomadaire due avec une proposition
// prête, une revue datée due. Le stock sans classe se dit, il n'alerte pas : c'est une mesure (TF-1301).
//
// Usage : node todo/verifications-lundi.mjs [--jour AAAA-MM-JJ] [--sortie <rapport.md>]
//         [--forge <racine forge-observability>] [--snapshots <ledger.jsonl>]
// Sortie : un JSON sur la sortie standard, champ `alerte` ; exit 0 (c'est une mesure, pas une porte).
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { etatCourant, manques } from "./revue-hebdo.mjs";
import { revuesDues, revuesAVenir } from "./revues-datees.mjs";
import { stockSansClasse, ligneStock } from "./stock-sans-classe.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SANS_DERIVE = ["PASS", "donnees_insuffisantes", "OBSERVE"];

/** La dernière date du journal des revues hebdomadaires, ou null. */
export function derniereRevue(texteJournal) {
  const l = String(texteJournal || "").trim().split("\n").filter(Boolean);
  try { return l.length ? JSON.parse(l[l.length - 1]).ts : null; } catch { return null; }
}

/** Juge les quatre relevés ; pur, sans lecture ni écriture. */
export function juger({ recidives, texteRegistre, revueTs, jour }) {
  const etat = etatCourant(texteRegistre);
  const motifs = [], lignes = [];

  lignes.push("## Surveillance des récidives");
  if (!recidives) { motifs.push("récidives non jouées"); lignes.push("- relevé NON rendu : la sortie d'observer-recidives est illisible"); }
  else if (SANS_DERIVE.includes(recidives.verdict)) lignes.push(`- verdict ${recidives.verdict}, snapshot ${recidives.snapshot_seq ?? "?"} : aucune dérive`);
  else {
    motifs.push(`récidives : ${recidives.verdict}`);
    lignes.push(`- **${recidives.verdict}** : ${(recidives.derive?.findings || [recidives.message || "sans détail"]).slice(0, 6).join(" ; ")}`);
    lignes.push("- à lire : `todo/RECIDIVES.md`, puis décider en revue des classes (rien n'est appliqué automatiquement)");
  }

  const candidats = [...etat.values()].filter((e) => e.statut === "candidat");
  const pretes = candidats.filter((e) => !manques(e.fiche_decision).length).length;
  const aInstruire = candidats.filter((e) => e.fiche_decision && manques(e.fiche_decision).length).length;
  const age = revueTs ? (Date.parse(`${jour}T12:00:00Z`) - Date.parse(revueTs)) / 86400000 : Infinity;
  lignes.push("", "## Revue hebdomadaire des propositions");
  if (age < 7) lignes.push(`- dernière revue le ${revueTs} : pas encore due ; ${pretes} proposition(s) prête(s)`);
  else if (!pretes) lignes.push(`- due, mais aucune proposition n'a de fiche de décision complète (${aInstruire} à instruire) : rien à trancher`);
  else {
    motifs.push(`revue hebdomadaire due : ${pretes} proposition(s) prête(s)`);
    lignes.push(`- **revue DUE** (${revueTs ? `dernière le ${revueTs}` : "jamais jouée"}) : ${pretes} proposition(s) prête(s), ${aInstruire} à instruire — \`node todo/revue-hebdo.mjs --depuis <prochain D-N> --sortie <dossier>\``);
  }

  const dues = revuesDues(etat, jour), avenir = revuesAVenir(etat, jour);
  lignes.push("", "## Revues datées");
  if (!dues.length) lignes.push(`- aucune revue due${avenir.length ? ` ; prochaine : ${avenir[0].id} le ${avenir[0].revue_le}` : ""}`);
  else {
    motifs.push(`${dues.length} revue(s) datée(s) due(s)`);
    for (const d of dues) lignes.push(`- **${d.id}, due depuis le ${d.revue_le}** — ${d.titre.slice(0, 140)}${d.commande ? ` ; mesure : \`${d.commande}\`` : ""}`);
  }

  lignes.push("", "## Items ouverts sans classe", `- ${ligneStock(stockSansClasse(etat))}`);
  return { alerte: motifs.length > 0, motifs, lignes };
}

/** Joue la surveillance des récidives ; rend son JSON, ou null s'il est illisible. */
function jouerRecidives(args) {
  const r = spawnSync(process.execPath, [join(ICI, "observer-recidives.mjs"), ...args], { encoding: "utf8", cwd: join(ICI, ".."), timeout: 300000 });
  try { return JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { return null; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const jour = val("--jour") || new Date().toISOString().slice(0, 10);
  const passe = ["--forge", "--snapshots"].flatMap((n) => (val(n) ? [n, val(n)] : []));
  let journal = ""; try { journal = readFileSync(join(ICI, "observabilite", "revues-hebdo.jsonl"), "utf8"); } catch { /* jamais jouée */ }
  const r = juger({ recidives: jouerRecidives(passe), texteRegistre: readFileSync(join(ICI, "TODO.jsonl"), "utf8"), revueTs: derniereRevue(journal), jour });
  const titre = `# Vérifications du lundi — ${jour}`;
  const tete = r.alerte ? `${r.motifs.length} point(s) à lire : ${r.motifs.join(" ; ")}.` : "Rien à signaler : aucun relevé n'appelle de geste.";
  const rapport = [titre, "", tete, "", ...r.lignes, "", "Rapport rendu par `node todo/verifications-lundi.mjs` (décision D-42 (a) du 19/10/2026)."].join("\n") + "\n";
  if (val("--sortie")) writeFileSync(val("--sortie"), rapport);
  process.stdout.write(JSON.stringify({ outil: "verifications-lundi", jour, alerte: r.alerte, motifs: r.motifs, rapport: val("--sortie") }) + "\n");
}
