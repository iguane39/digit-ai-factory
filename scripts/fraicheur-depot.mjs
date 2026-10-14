#!/usr/bin/env node
/**
 * fraicheur-depot.mjs — AVANT D'AFFIRMER CE QUE FAIT LE CODE D'UN DÉPÔT, ON MESURE L'ÉCART ENTRE LA
 * COPIE LUE ET LE DISTANT (TF-1642, 14/10/2026).
 *
 * LE FAIT, mesuré le 12/10/2026. Un rapport transmis affirmait qu'une chaîne de déploiement ne
 * désactivait jamais ses anciennes révisions et recommandait d'écrire ce ménage. Le clone lu était en
 * retard de 290 commits sur le distant ; le ménage existait depuis 13 jours, dans un script appelé
 * deux fois par le fichier de chaîne. Trois fautes : aucun `git fetch` (le contrôle de fraîcheur
 * d'ouverture ne juge que les dépôts de la Factory) ; une absence « prouvée » par une recherche dans
 * UN fichier ; une baisse de coût datée relevée sans relire `git log` autour de cette date.
 *
 * CE QUE LA SONDE REND. Pour un dépôt quelconque (hors Factory compris) : la référence lue (sha et
 * date de HEAD), la référence distante (suivie, sinon `<distant>/HEAD`, `main` ou `master`) et
 * l'écart en commits dans les deux sens, après un `git fetch` (sauf `--sans-fetch`). Elle dit le
 * geste qui suit : en retard ou divergé, lire la référence distante (`git show <ref>:<chemin>`,
 * `git grep <motif> <ref>`), jamais l'arbre local ; une absence se prouve par `git grep` sur toute la
 * référence, jamais par une recherche dans un fichier.
 *
 * Usage : node scripts/fraicheur-depot.mjs <dépôt> [--sans-fetch] [--distant origin] [--json]
 * Exit : 0 à jour ou en avance · 1 en retard ou divergé · 2 non jugeable (pas un dépôt, pas de distant).
 * Lecture seule : `git fetch` met à jour les références distantes, rien d'autre ; aucun pull.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const g = (d, ...a) => {
  const r = spawnSync("git", ["-C", d, ...a], { encoding: "utf8", timeout: 60000 });
  return { ok: r.status === 0, sortie: (r.stdout || "").trim(), err: (r.stderr || "").trim() };
};

/** Mesure la fraîcheur d'un dépôt. Rend un objet verdict (voir l'en-tête). */
export function mesurerFraicheur(depot, { fetch = true, distant = "origin" } = {}) {
  const d = resolve(depot);
  if (!g(d, "rev-parse", "--git-dir").ok) return { depot: d, etat: "non_jugeable", motif: "pas un dépôt git" };
  const head = g(d, "rev-parse", "HEAD").sortie;
  const dateHead = g(d, "log", "-1", "--format=%cI", "HEAD").sortie;
  let fetchEtat = "non joué (--sans-fetch)";
  if (fetch) {
    const f = g(d, "fetch", "--quiet", distant);
    fetchEtat = f.ok ? "joué" : `en échec (${f.err.split("\n")[0].slice(0, 120)}) : écart mesuré sur la dernière référence distante connue`;
  }
  const candidats = ["@{u}", `${distant}/HEAD`, `${distant}/main`, `${distant}/master`];
  const ref = candidats.find((c) => g(d, "rev-parse", "--verify", "--quiet", c).ok);
  if (!ref) return { depot: d, etat: "non_jugeable", head, date_head: dateHead, fetch: fetchEtat, motif: `aucune référence distante (${candidats.join(", ")})` };
  const nomRef = ref === "@{u}" ? g(d, "rev-parse", "--abbrev-ref", "@{u}").sortie : ref;
  const shaRef = g(d, "rev-parse", ref).sortie;
  const retard = Number(g(d, "rev-list", "--count", `HEAD..${ref}`).sortie);
  const avance = Number(g(d, "rev-list", "--count", `${ref}..HEAD`).sortie);
  const etat = retard && avance ? "diverge" : retard ? "en_retard" : avance ? "en_avance" : "a_jour";
  const geste = retard
    ? `lire ${nomRef}, jamais l'arbre local : git -C "${d}" show ${nomRef}:<chemin> ; une absence se prouve par git -C "${d}" grep <motif> ${nomRef} (toute la référence) ; une variation datée se relit par git -C "${d}" log ${nomRef} --since <date> --until <date>`
    : "l'arbre local est à jour du distant : il peut être lu ; une absence se prouve toujours par git grep sur tout le dépôt, jamais dans un fichier";
  return { depot: d, etat, head, date_head: dateHead, reference: nomRef, sha_reference: shaRef,
    date_reference: g(d, "log", "-1", "--format=%cI", ref).sortie, retard, avance, fetch: fetchEtat, geste,
    citation: `lu à ${head.slice(0, 8)} (${dateHead}), ${nomRef} à ${shaRef.slice(0, 8)} : ${retard} commit(s) de retard, ${avance} d'avance` };
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const iD = args.indexOf("--distant");
  const iValeur = iD >= 0 ? iD + 1 : -1;   // sans --distant, iD + 1 vaudrait 0 et écarterait le dépôt lui-même
  const depot = args.find((a, i) => !a.startsWith("--") && i !== iValeur);
  if (!depot) { console.error("usage : node scripts/fraicheur-depot.mjs <dépôt> [--sans-fetch] [--distant origin] [--json]"); process.exit(2); }
  const v = mesurerFraicheur(depot, { fetch: !args.includes("--sans-fetch"), distant: iD >= 0 ? args[iD + 1] : "origin" });
  if (args.includes("--json")) console.log(JSON.stringify(v, null, 1));
  else if (v.etat === "non_jugeable") console.log(`[NON JUGEABLE] ${v.depot} — ${v.motif}`);
  else {
    const libelle = { a_jour: "À JOUR", en_avance: "EN AVANCE", en_retard: "EN RETARD", diverge: "DIVERGÉ" }[v.etat];
    console.log(`[${libelle}] ${v.depot} — ${v.citation} (fetch ${v.fetch})`);
    console.log(`  geste : ${v.geste}`);
  }
  process.exit(v.etat === "non_jugeable" ? 2 : v.retard ? 1 : 0);
}
