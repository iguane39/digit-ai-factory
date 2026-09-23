#!/usr/bin/env node
/**
 * produire-plan-ancres.mjs — PRODUIRE le plan applicable d'un audit des traductions depuis son
 * sidecar machine, plutôt que l'écrire à la main (TF-1318, étapes B8 et B2 de la chaîne B).
 *
 * LE FAIT. La règle T2 d'`oracles/oracle-remise-traduction.mjs` juge depuis le 27/08 qu'une ancre
 * citée à la remise existe littéralement dans le fichier visé. Elle juge la REMISE ; la PRODUCTION
 * restait manuelle. Or c'est la production qui a coûté : au tour 4 de la session source (lot
 * `Produit-02 - RETOURS - 20260826f`), l'exploitant a dû spécifier à la main le format d'un plan
 * « directement applicable par l'IA suivante » — ancres verbatim, sidecar machine, carte des
 * sources de vérité. Un juge en bout de chaîne dit que le plan est faux ; il ne dit pas comment
 * en écrire un juste.
 *
 * CE QUE FAIT CE VERBE. Il lit un sidecar `plan-ancres@1` — la liste des modifications ET la carte
 * des sources de vérité —, le juge (P1–P5, C1–C4, voir `lib-plan-ancres.mjs`), et, s'il tient,
 * rend les trois sections de la fiche de remise : `## Sources de vérité`, `## Ancres verbatim`,
 * `## Plan applicable`. Le sidecar reste la source ; les sections en sont un rendu. Un plan qui
 * échoue n'est JAMAIS rendu : une fiche produite pour être refusée à la remise est le coût que ce
 * verbe existe pour supprimer.
 *
 * CE QU'IL NE FAIT PAS. Il n'écrit rien, et surtout il n'APPLIQUE rien : appliquer le plan est une
 * décision de l'exploitant (tour 14 de la session source, « applique tous les éléments », classe
 * DÉCISION). Il n'écrit pas non plus la carte : savoir quel fichier régénère lequel demande de
 * connaître le build du produit, et c'est l'auditeur qui la déclare.
 *
 * Format du sidecar :
 *   { "format": "plan-ancres@1",
 *     "modifications": [ { "id": "M1", "fichier": "i18n/es.json", "ancre": "<texte exact du fichier>",
 *                          "remplacement": "<texte après>", "motif": "…", "occurrences": 1 } ],
 *     "sources": [ { "fichier": "i18n/es.json", "nature": "source" },
 *                  { "fichier": "dist/es/index.html", "nature": "artefact",
 *                    "source": "i18n/es.json", "regenere_par": "npm run build" } ] }
 * L'ancre est le texte du FICHIER, échappements compris : dans un catalogue JSON, un guillemet
 * s'y écrit `\"`.
 *
 * Usage : node scripts/produire-plan-ancres.mjs <plan.json> [--racine <dossier>] [--markdown]
 *   --racine    base des chemins relatifs du plan (défaut : le dossier du plan)
 *   --markdown  si le plan tient, rend les trois sections à coller dans la fiche, au lieu du JSON
 * Exit : 0 PASS · 1 FAIL (au moins une règle P ou C) · 2 non jugeable (fichier illisible, format
 *        autre que plan-ancres@1, aucune modification).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { FORMAT, verifierPlan, rendreCarte, rendreAncres, rendrePlan } from "./lib-plan-ancres.mjs";

const NON_JUGE = [
  "plan-ancres : la JUSTESSE d'un remplacement — qu'il corrige vraiment le défaut, dans la bonne langue — "
  + "se relit ; ce verbe garantit qu'il est APPLICABLE, jamais qu'il est bon",
  "plan-ancres : la JUSTESSE de la carte — que tel fichier soit vraiment régénéré par telle commande — "
  + "demande d'exécuter le build du produit, ce que ce verbe ne fait pas ; il juge sa forme et sa conséquence sur les ancres",
  "plan-ancres : l'ancre se compare au texte du fichier APRÈS décodage UTF-8, caractère pour caractère — "
  + "une forme Unicode décomposée ne se confond pas avec sa forme composée",
  "plan-ancres : l'état du fichier À L'INSTANT DE LA PRODUCTION. Un fichier modifié ensuite fera rougir T2 à la "
  + "remise — c'est voulu, et c'est ce qui distingue une ancre d'une citation",
];

const args = process.argv.slice(2);
const valeur = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const cible = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--racine");
const sortir = (code, corps) => { process.stdout.write(JSON.stringify(corps, null, 1) + "\n"); process.exit(code); };
const entete = { outil: "produire-plan-ancres", version: "1.0.0", plan: cible || null };

if (!cible || !existsSync(cible)) {
  sortir(2, { ...entete, verdict: "NON_JUGEABLE",
    message: "plan introuvable — usage : node scripts/produire-plan-ancres.mjs <plan.json> [--racine <dossier>] [--markdown]",
    non_juge: NON_JUGE });
}
let plan = null;
try { plan = JSON.parse(readFileSync(cible, "utf8")); } catch (e) {
  sortir(2, { ...entete, verdict: "NON_JUGEABLE", message: `plan illisible : ${e.message}`, non_juge: NON_JUGE });
}
if (!plan || plan.format !== FORMAT) {
  sortir(2, { ...entete, verdict: "NON_JUGEABLE",
    message: `format « ${plan?.format ?? "(absent)"} » : seul ${FORMAT} est lu — un lecteur qui ne sait pas lire le dit`,
    non_juge: NON_JUGE });
}
if (!Array.isArray(plan.modifications) || !plan.modifications.length) {
  sortir(2, { ...entete, verdict: "NON_JUGEABLE",
    message: "aucune modification : un plan vide n'a rien à rendre applicable — l'audit le déclare dans sa fiche (étape B8 SANS_OBJET, avec son motif)",
    non_juge: NON_JUGE });
}

const racine = valeur("--racine") ? resolve(valeur("--racine")) : dirname(resolve(cible));
const { constats, mesure } = verifierPlan(plan, racine);
if (constats.length) {
  sortir(1, { ...entete, racine, verdict: "FAIL", mesure,
    findings: constats.map((c) => ({ ...c, statut: "FAIL" })), non_juge: NON_JUGE });
}
if (args.includes("--markdown")) {
  process.stdout.write([rendreCarte(plan.sources || []), rendreAncres(plan.modifications),
    rendrePlan(plan.modifications)].join("\n"));
  process.exit(0);
}
sortir(0, { ...entete, racine, verdict: "PASS", mesure,
  findings: [{ regle: "P1-P5·C1-C4", statut: "PASS",
    message: `${mesure.modifications} modification(s) sur ${mesure.fichiers_vises} fichier(s) : chaque ancre existe, `
      + `désigne un seul endroit, vise une source déclarée ; carte de ${mesure.carte} fichier(s) dont ${mesure.artefacts} artefact(s)` }],
  non_juge: NON_JUGE });
