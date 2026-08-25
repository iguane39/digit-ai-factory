#!/usr/bin/env node
/**
 * journaliser.mjs — écrit des événements au registre TODO-FORGE en STAMPANT leur horodatage.
 *
 * Pourquoi cet outil existe (TF-0413, 20/08/2026). Les événements composés à la main dans
 * `TODO.jsonl` portaient un `ts` inventé : mesuré en rapprochant chaque commit du dernier `ts`
 * qu'il ajoute, +449, +386, +353, +314, +308, +299, +259, +190, +180, +173 minutes d'AVANCE sur
 * six jours — aucun en retard. Les événements écrits par l'outillage (`ingerer-lot.mjs`)
 * collaient au commit à la minute près. La cause n'est donc pas une horloge : c'est la
 * composition à la main d'un champ que seule une machine peut remplir honnêtement.
 * `oracle-todo` R11 CONSTATE le défaut ; ce script en supprime la CAUSE. Les deux se cumulent
 * — le contrôle ne remplace pas l'outil, et l'outil ne dispense pas du contrôle.
 *
 * Ce qu'il refuse, et pourquoi : un événement qui porte déjà un `ts`. Accepter « sauf si tu
 * insistes » rendrait l'outil contournable par la voie la plus commode, c'est-à-dire par celle
 * qui a produit le défaut. L'heure d'un fait rapporté (décision prise hier, correction d'avant-
 * hier) est une DONNÉE : elle se consigne dans `date_decision`, `date_correction`, ou tout
 * champ nommé — jamais dans `ts`, qui est l'heure de CONSIGNATION.
 *
 * Usage :
 *   node todo\journaliser.mjs --fichier <evenements.json> [--registre <TODO.jsonl>] [--essai]
 *
 *   <evenements.json> : un objet, ou un tableau d'objets, SANS champ `ts`.
 *   --essai : affiche ce qui serait écrit, n'écrit rien.
 *
 * Garanties :
 *   · horodatages strictement croissants au sein d'un même lot (millisecondes réelles) ;
 *   · écriture ATOMIQUE au sens du verdict : si `oracle-todo` passait avant et échoue après,
 *     le fichier est remis exactement dans son état d'origine et le rapport dit pourquoi ;
 *   · le registre n'est jamais laissé à moitié écrit — la taille d'origine est reprise.
 *
 * Sortie : JSON {outil, ecrits[], verdict_avant, verdict_apres, message} · exit 0 / 1.
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync, statSync, truncateSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
const ESSAI = args.includes("--essai");
const fichier = valeur("--fichier");
const REGISTRE = valeur("--registre") || join(ICI, "TODO.jsonl");
const ORACLE = join(ICI, "oracle-todo.mjs");

function sortir(code, corps) {
  process.stdout.write(JSON.stringify({ outil: "journaliser", ...corps }, null, 1) + "\n");
  process.exit(code);
}

/**
 * TF-0621 (25/08) — LE CONTRÔLE PASSE SUR LE CHEMIN D'ÉCRITURE, parce que c'est le seul endroit
 * qu'on ne peut pas oublier de traverser.
 *
 * LE FAIT : la même classe d'octet a mordu SEPT fois en une journée. Un chemin Windows écrit dans
 * une chaîne Python non brute voit son antislash avalé par l'échappement — `\f` devient un SAUT DE
 * PAGE, `\a` une CLOCHE, `\r` un RETOUR CHARIOT, `\t` une TABULATION, `\n` un SAUT DE LIGNE. Trois
 * de ces morsures ont été ÉCRITES dans ce registre, d'où les vues `TODO.md` et `TODO.html` sont
 * générées : un octet de contrôle dans un chemin affiché ne se voit pas, se copie-colle en silence,
 * et rend le chemin introuvable pour qui le réessaie.
 *
 * CE QUI A LAISSÉ PASSER, et c'est le cœur du sujet :
 *   · le SyntaxWarning de Python est un signal INVERSÉ — il parle sur les échappements NON reconnus
 *     (`\d` de `\dev`), donc les cas INOFFENSIFS, et se tait sur les reconnus, donc les destructeurs.
 *     Un avertissement qui parle quand tout va bien apprend à être ignoré (R-33 bis) ;
 *   · `oracle-pieges-regex` P3 existe exactement pour cette classe et ne l'a pas vue : sa portée
 *     s'arrête aux fichiers de CODE. Le registre est une DONNÉE, et c'est la donnée qui alimente le
 *     livrable lu par l'humain. Une exclusion nommée dans un contrôle signale une cause non traitée (N-13) ;
 *   · un garde de rédaction a rendu VERT sur une ligne de tableau coupée en deux : il excluait le
 *     saut de ligne, légitime dans un document mais DESTRUCTEUR dans une ligne de tableau ;
 *   · et la septième n'a été attrapée par aucun mécanisme — le garde existait et n'a pas été appelé.
 *
 * D'OÙ LE PRÉDICAT, qui n'est pas « pas d'octet de contrôle » mais deux clauses :
 *   1. aucun octet de contrôle, `\n` compris comme SEULE exception — la tabulation en fait donc
 *      partie, et c'est voulu : dans ce registre elle n'a aucun emploi légitime et elle est
 *      exactement la forme qu'a prise la septième morsure ;
 *   2. aucun `\n` À L'INTÉRIEUR d'une ligne de tableau. Une ligne qui ouvre par `|` et ne ferme pas
 *      par `|` est une ligne coupée : c'est la forme mesurée, et elle est invisible autrement.
 *
 * Le refus tombe AVANT toute écriture, et il nomme l'octet, son échappement d'origine et la parade
 * (`chr(92)` plutôt qu'un antislash littéral) — un refus sans sa parade se contourne au hasard.
 */
const OCTETS = new Map([
  [0x07, ["\\a", "CLOCHE"]], [0x08, ["\\b", "RETOUR ARRIÈRE"]], [0x09, ["\\t", "TABULATION"]],
  [0x0b, ["\\v", "TABULATION VERTICALE"]], [0x0c, ["\\f", "SAUT DE PAGE"]], [0x0d, ["\\r", "RETOUR CHARIOT"]],
]);

export function octetsFautifs(evenement) {
  const constats = [];
  const visiter = (valeur, chemin) => {
    if (typeof valeur === "string") {
      for (let i = 0; i < valeur.length; i += 1) {
        const c = valeur.charCodeAt(i);
        if (c < 0x20 && c !== 0x0a) {
          const [ech, nom] = OCTETS.get(c) || ["?", `octet 0x${c.toString(16)}`];
          constats.push(`${chemin} porte un ${nom} (0x${c.toString(16).padStart(2, "0")}) au rang ${i} — ` +
            `c'est un \`${ech}\` né d'un antislash avalé par l'échappement. Parade : composer l'antislash ` +
            "par `chr(92)`, jamais en littéral dans une chaîne non brute");
        }
      }
      // Clause 2 : un `\n` qui coupe une ligne de tableau. Une ligne qui OUVRE par `|` doit FERMER
      // par `|` — sinon les cellules suivantes sont perdues, et le tableau rendu porte deux formes.
      for (const [n, ligne] of valeur.split("\n").entries()) {
        const nue = ligne.trim();
        if (nue.startsWith("|") && !nue.endsWith("|")) {
          constats.push(`${chemin} porte une ligne de tableau COUPÉE (segment ${n + 1} : « ${nue.slice(0, 60)} ») — ` +
            "elle ouvre par `|` et ne ferme pas par `|`, donc un saut de ligne l'a tranchée et ses " +
            "cellules suivantes sont perdues. Un saut de ligne est légitime dans un document et " +
            "destructeur dans une ligne de tableau : c'est pourquoi la clause 1 ne suffit pas");
        }
      }
      return;
    }
    if (Array.isArray(valeur)) { valeur.forEach((v, i) => visiter(v, `${chemin}[${i}]`)); return; }
    if (valeur && typeof valeur === "object") {
      for (const [k, v] of Object.entries(valeur)) visiter(v, chemin ? `${chemin}.${k}` : k);
    }
  };
  visiter(evenement, "");
  return constats;
}

// Le garde des octets est EXPORTÉ pour être joué sur le corpus réel avant livraison (N-23), et un
// module dont l'import déclenche la ligne de commande n'est pas importable. La partie CLI ne
// s'exécute donc que si ce fichier est le point d'entrée — même idiome que les oracles du dépôt.
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (!lanceEnDirect) { /* importé pour `octetsFautifs` : rien d'autre ne doit se produire */ }
else {

if (!fichier) sortir(1, { message: "usage : node journaliser.mjs --fichier <evenements.json> [--registre <f>] [--essai]" });
if (!existsSync(fichier)) sortir(1, { message: `fichier d'événements introuvable : ${fichier}` });

let entrants;
try { entrants = JSON.parse(readFileSync(fichier, "utf8")); }
catch (e) { sortir(1, { message: `événements illisibles : ${e.message}` }); }
if (!Array.isArray(entrants)) entrants = [entrants];
if (!entrants.length) sortir(1, { message: "aucun événement à journaliser" });

// Refus AVANT toute écriture : un lot qui contient un `ts` n'est pas écrit à moitié.
const porteurs = entrants.map((e, i) => (e && e.ts !== undefined ? i : -1)).filter((i) => i >= 0);
if (porteurs.length) {
  sortir(1, {
    message: `${porteurs.length} événement(s) portent déjà un \`ts\` (rang ${porteurs.join(", ")}) — refusé, ` +
      "aucune écriture. `ts` est l'heure de CONSIGNATION : elle est stampée ici. L'heure d'un " +
      "fait rapporté est une donnée — `date_decision`, `date_correction`, ou un champ nommé (TF-0413)",
  });
}

// Refus AVANT toute écriture, comme celui du `ts` : un lot qui porte un octet fautif n'est pas
// écrit à moitié. Le rang de l'événement est nommé, sinon le lecteur cherche dans tout le lot.
const fautifs = entrants.flatMap((e, i) => octetsFautifs(e).map((c) => `rang ${i} — ${c}`));
if (fautifs.length) {
  sortir(1, {
    message: `${fautifs.length} octet(s) de contrôle ou ligne(s) de tableau coupée(s) — refusé, aucune écriture. ` +
      "Le registre alimente `TODO.md` et `TODO.html` : un octet invisible y devient un chemin " +
      "introuvable, et une ligne de tableau coupée y perd ses cellules (TF-0621, classe payée sept " +
      `fois le 25/08). Constats : ${fautifs.join(" · ")}`,
  });
}

const verdict = (f) => {
  const r = spawnSync(process.execPath, [ORACLE, f], { encoding: "utf8" });
  try { return JSON.parse(r.stdout || "{}").verdict || "ILLISIBLE"; } catch { return "ILLISIBLE"; }
};

// Horodatages stampés, strictement croissants au sein du lot.
let dernier = 0;
const lignes = entrants.map((e) => {
  let t = Date.now();
  if (t <= dernier) t = dernier + 1;
  dernier = t;
  return JSON.stringify({ ...e, ts: new Date(t).toISOString() });
});

if (ESSAI) sortir(0, { message: "essai — rien écrit", ecrits: lignes });

const avant = verdict(REGISTRE);
const taille = existsSync(REGISTRE) ? statSync(REGISTRE).size : 0;
appendFileSync(REGISTRE, lignes.join("\n") + "\n", "utf8");
const apres = verdict(REGISTRE);

if (avant === "PASS" && apres !== "PASS") {
  truncateSync(REGISTRE, taille);
  sortir(1, {
    verdict_avant: avant, verdict_apres: apres, ecrits: [],
    message: `le registre passait et ne passe plus (${apres}) — écriture ANNULÉE, fichier repris à ${taille} octets. ` +
      "Jouer `node todo\\oracle-todo.mjs` pour lire le constat, corriger les événements, recommencer",
  });
}

sortir(0, {
  verdict_avant: avant, verdict_apres: apres,
  ecrits: lignes.map((l) => { const o = JSON.parse(l); return `${o.ts} ${o.id || "?"} ${o.ev || "?"} ${o.statut || ""}`.trim(); }),
  message: `${lignes.length} événement(s) journalisé(s) dans ${REGISTRE}` +
    (avant !== "PASS" ? ` — ATTENTION : le registre était déjà ${avant} avant cette écriture` : ""),
});

}
