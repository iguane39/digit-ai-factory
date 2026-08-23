#!/usr/bin/env node
/**
 * oracle-cadence.mjs — la FORME des artefacts de cadence d'une mission longue (TF-0324, 23/08/2026).
 *
 * POURQUOI CET ORACLE EXISTE. Cinq artefacts de cadence ont été livrés en gabarits le 23/08 :
 * revue des risques, rapport d'avancement, compte rendu, retour d'expérience, suivi des bénéfices.
 * Le rapport d'avancement se GÉNÈRE, donc il ne peut pas dériver. Les quatre autres demandent un
 * jugement humain — et leur gabarit imposait leur forme **en prose**, c'est-à-dire par discipline.
 * Or c'est exactement ce que la campagne du jour a nommé neuf fois : une règle sans mécanisme est
 * une consigne, et une consigne se suit jusqu'au jour où on ne la suit plus.
 *
 * CE QUI EST JUGÉ, ET RIEN D'AUTRE : la forme. Aucune de ces règles ne pèse un risque, ne juge la
 * pertinence d'un enseignement ni n'attribue un bénéfice — ce sont des jugements humains, et un
 * script qui les noterait fabriquerait une fausse précision.
 *
 *   C1 · Toute ligne de RISQUE, d'HYPOTHÈSE, d'INCIDENT ou de DÉPENDANCE porte un PROPRIÉTAIRE
 *        NOMMÉ. « l'équipe », « le projet », « tous » ne sont pas des propriétaires : un risque
 *        sans nom est un vœu, personne ne le rouvrira.
 *   C2 · Toute HYPOTHÈSE porte une DATE BUTOIR. Sans elle, une hypothèse se découvre fausse au
 *        pire moment — et elle devient un risque sans que personne l'ait décidé.
 *   C3 · Toute DÉPENDANCE porte une date de relance, ou le mot « jamais » : le second est un aveu,
 *        et un aveu écrit vaut mieux qu'une case vide qu'on lit comme un oubli.
 *   C4 · Toute ACTION d'un compte rendu porte un acteur du vocabulaire FERMÉ
 *        (`auto_ia | manuelle_dev | manuelle_utilisateur`) et ce qui se passe si elle n'est pas
 *        faite — mêmes règles que le bloc 8 d'une restitution (S12, S19).
 *   C5 · Tout BÉNÉFICE publié porte sa mesure AVANT et sa mesure APRÈS, ou se déclare non mesuré.
 *        Il n'y a pas de troisième possibilité : un bénéfice sans mesure avant ne sera jamais
 *        contestable, donc jamais croyable.
 *   C6 · Tout ENSEIGNEMENT d'un retour d'expérience cite un FAIT — une date, un chiffre, un
 *        fichier. « Mieux communiquer » n'est pas un enseignement, c'est une opinion.
 *
 * Les lignes dont la première cellule est encore un GABARIT (`{R-01}`) ne sont pas jugées : juger
 * l'exemple que le gabarit prescrit mettrait le gabarit en défaut plutôt que l'auteur. Leçon payée
 * le 22/08 par un contrôle de Markdown qui accusait sept blocs sur neuf d'un document CONFORME.
 *
 * Usage : node oracle-cadence.mjs <fichier.md> [...] [--json] · --self-test
 * Sortie : JSON {oracle,verdict,findings[],non_juge[]} · exit 0 = PASS · 1 = FAIL · 2 = SANS OBJET.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";

const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");
const F = [];
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "le POIDS d'un risque (probabilité, impact) : ce sont des jugements, et un script qui les noterait fabriquerait une fausse précision",
  "la PERTINENCE d'un enseignement, la JUSTESSE d'une parade, l'ATTRIBUTION d'un bénéfice — trois jugements humains",
  "la SINCÉRITÉ d'un nom de propriétaire ou d'une date : un nom inventé satisfait C1, et cet oracle rend la négligence coûteuse, pas le mensonge impossible",
  "les lignes encore à l'état de GABARIT (`{R-01}`) : juger l'exemple que le gabarit prescrit mettrait le gabarit en défaut, jamais l'auteur",
  "la CADENCE elle-même : qu'un artefact hebdomadaire soit émis chaque semaine se lit dans son historique, pas dans son contenu",
  "le CONTENU d'une conséquence de non-action : C4 vérifie que la cellule est remplie, jamais qu'elle dit quelque chose — « à faire vite » la satisfait. Juger le fond demanderait de comprendre la prose, et la colonne remplie est déjà ce qui manquait",
];

// ---- lecture de tableaux Markdown, en sections -------------------------------------------------
const sections = (texte) => {
  const out = [];
  let titre = "(préambule)";
  let buf = [];
  for (const l of texte.split(/\r?\n/)) {
    const m = /^#{2,3}\s+(.+?)\s*$/.exec(l);
    if (m) { out.push({ titre, corps: buf.join("\n") }); titre = m[1]; buf = []; }
    else buf.push(l);
  }
  out.push({ titre, corps: buf.join("\n") });
  return out;
};
const lignesTableau = (corps) => {
  const li = corps.split(/\r?\n/).map((x) => x.trim()).filter((x) => x.startsWith("|"));
  const iSep = li.findIndex((x) => /^\|[\s:|-]+\|$/.test(x));
  if (iSep < 0) return { entete: [], donnees: [] };
  const cellules = (x) => x.replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim());
  return { entete: cellules(li[0]), donnees: li.slice(iSep + 1).map(cellules) };
};
// Une ligne d'EXEMPLE se reconnait a ses accolades — et pas seulement sur sa premiere cellule :
// le gabarit des risques portait des identifiants nus (`R-01`) et des cellules en placeholders, si
// bien que la moitie des regles le jugeaient comme un vrai releve. On lit donc la MAJORITE.
const estGabarit = (l) => {
  const pleines = l.filter((c) => c && c.trim());
  if (!pleines.length) return false;
  const modeles = pleines.filter((c) => /^\{.*\}$/.test(c.trim())).length;
  return /^\{.*\}$/.test((l[0] || "").trim()) || modeles * 2 >= pleines.length;
};
const DATE = /\b(20\d{2}-\d{2}-\d{2}|\d{2}\/\d{2}\/20\d{2})\b/;
// Un propriétaire NOMMÉ : deux mots capitalisés, ou un prénom seul. Ce qui est refusé est nommé.
const COLLECTIFS = /^(l'?[ée]quipe|le projet|tous|toutes|la forge|le pilot|nous|chacun|tout le monde|—|-|n\/a)$/i;
const NOMME = (c) => c.length > 1 && !COLLECTIFS.test(c) && /[A-Za-zÀ-ÿ]{2,}/.test(c);
const ACTEURS = /\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b/;
const SI_PAS_FAIT = /(si (rien n'est fait|elle n'est pas faite|ce n'est pas fait)|sinon|sans (elle|quoi)|s'arrête|risque de|reste)/i;
const FAIT = /(\b20\d{2}-\d{2}-\d{2}\b|\d+\s*(h|heures?|%|constats?|allers?-retours?|versions?|lignes?|fichiers?|items?|cas)\b|`[^`]+`)/i;

const colonne = (entete, motif) => entete.findIndex((c) => motif.test(c));

function juger(nom, texte) {
  const secs = sections(texte);
  let jugee = false;

  for (const { titre, corps } of secs) {
    const { entete, donnees } = lignesTableau(corps);
    const reelles = donnees.filter((l) => !estGabarit(l) && l.some(Boolean));
    if (!entete.length || !reelles.length) continue;

    const iProprio = colonne(entete, /propri[ée]taire|responsable|acteur/i);
    const iButoir = colonne(entete, /[àa]\s*valider\s*avant|butoir|avant le/i);
    const iRelance = colonne(entete, /relanc/i);
    const iAvant = colonne(entete, /mesure\s*AVANT|avant/i);
    // La CONSÉQUENCE de non-action a sa colonne dans le gabarit. Un en-tête est un contrat plus
    // fort qu'une tournure : le premier jet cherchait le mot « si » dans la ligne et accusait
    // « les liens meurent sans message », qui dit exactement ce qu'il faut. Trouvé par la fixture.
    const iSinon = colonne(entete, /si\s+(elle|rien|ce)|pas\s+faite|cons[ée]quence/i);
    const iApres = colonne(entete, /mesure\s*APR[ÈE]S|apr[èe]s/i);

    // C1 · propriétaire nommé, dans toute table de RAID.
    if (/risques?|hypoth[èe]ses?|incidents?|d[ée]pendances?/i.test(titre) && iProprio >= 0) {
      jugee = true;
      const sans = reelles.filter((l) => !NOMME(l[iProprio] || ""));
      if (sans.length) {
        ko("C1", `${nom} · ${titre}`, `${sans.length} ligne(s) sans propriétaire nommé ` +
          `(${sans.map((l) => `« ${(l[0] || "?").slice(0, 24)} » → « ${(l[iProprio] || "vide").slice(0, 20)} »`).slice(0, 3).join(" ; ")}). ` +
          "« l'équipe », « le projet », « nous » ne sont pas des propriétaires : personne ne rouvrira " +
          "la ligne. Un risque sans nom est un vœu");
      } else ok("C1", `${nom} · ${titre}`, `${reelles.length} ligne(s), chacune avec son propriétaire nommé`);
    }

    // C2 · date butoir d'une hypothèse.
    if (/hypoth[èe]ses?/i.test(titre)) {
      jugee = true;
      if (iButoir < 0) {
        ko("C2", `${nom} · ${titre}`, "aucune colonne de date butoir — une hypothèse sans échéance " +
          "se découvre fausse au pire moment, et devient un risque que personne n'a décidé");
      } else {
        const sans = reelles.filter((l) => !DATE.test(l[iButoir] || ""));
        if (sans.length) ko("C2", `${nom} · ${titre}`, `${sans.length} hypothèse(s) sans date butoir lisible`);
        else ok("C2", `${nom} · ${titre}`, `${reelles.length} hypothèse(s), chacune datée`);
      }
    }

    // C3 · relance d'une dépendance : une date, ou l'aveu écrit.
    if (/d[ée]pendances?/i.test(titre) && iRelance >= 0) {
      jugee = true;
      const muettes = reelles.filter((l) => {
        const v = (l[iRelance] || "").trim();
        return !DATE.test(v) && !/jamais|aucune/i.test(v);
      });
      if (muettes.length) {
        ko("C3", `${nom} · ${titre}`, `${muettes.length} dépendance(s) dont la relance est une case vide. ` +
          "Écrire « jamais » est un AVEU, et un aveu écrit vaut mieux qu'un vide qu'on lit comme un oubli");
      } else ok("C3", `${nom} · ${titre}`, `${reelles.length} dépendance(s), relance datée ou avouée`);
    }

    // C4 · actions d'un compte rendu : acteur du vocabulaire fermé + conséquence de non-action.
    if (/actions?/i.test(titre)) {
      jugee = true;
      const sansActeur = reelles.filter((l) => !ACTEURS.test(l.join(" ")));
      const sansSuite = iSinon >= 0
        ? reelles.filter((l) => (l[iSinon] || "").trim().length < 3)
        : reelles.filter((l) => !SI_PAS_FAIT.test(l.join(" ")));
      if (sansActeur.length) {
        ko("C4", `${nom} · ${titre}`, `${sansActeur.length} action(s) sans acteur du vocabulaire fermé ` +
          "(auto_ia | manuelle_dev | manuelle_utilisateur) — une action sans acteur n'est pas une action, c'est un souhait");
      }
      if (sansSuite.length) {
        ko("C4", `${nom} · ${titre}`, `${sansSuite.length} action(s) qui ne disent pas ce qui se passe ` +
          "si elles ne sont PAS faites — sans cela, rien ne distingue l'urgent du décoratif" +
          (iSinon >= 0 ? " (colonne présente et cellule vide)" : " (aucune colonne de conséquence, et rien dans la ligne)"));
      }
      if (!sansActeur.length && !sansSuite.length)
        ok("C4", `${nom} · ${titre}`, `${reelles.length} action(s), chacune avec son acteur et sa conséquence`);
    }

    // C5 · un bénéfice porte ses DEUX mesures, ou se déclare non mesuré.
    if (/b[ée]n[ée]fices?/i.test(titre) && iAvant >= 0) {
      jugee = true;
      const boiteux = reelles.filter((l) => {
        const av = (l[iAvant] || "").trim();
        const ap = iApres >= 0 ? (l[iApres] || "").trim() : "";
        const dit = /jamais prise|non mesur|pas encore/i.test(av + " " + ap);
        return !dit && !(/\d/.test(av) && /\d/.test(ap));
      });
      if (boiteux.length) {
        ko("C5", `${nom} · ${titre}`, `${boiteux.length} bénéfice(s) sans ses DEUX mesures, et sans se ` +
          "déclarer non mesuré. Il n'y a pas de troisième possibilité : un bénéfice sans mesure avant " +
          "ne sera jamais contestable, donc jamais croyable");
      } else ok("C5", `${nom} · ${titre}`, `${reelles.length} bénéfice(s), chacun mesuré des deux côtés ou déclaré non mesuré`);
    }

    // C6 · un enseignement cite le fait qui l'a produit.
    if (/enseignement|ce qui a march|ce qui a co[ûu]t/i.test(titre)) {
      jugee = true;
      const sansFait = reelles.filter((l) => !FAIT.test(l.join(" ")));
      if (sansFait.length) {
        ko("C6", `${nom} · ${titre}`, `${sansFait.length} enseignement(s) sans FAIT cité (date, chiffre, ` +
          "fichier) — « mieux communiquer » n'est pas un enseignement, c'est une opinion, et une " +
          "opinion ne change la pratique de personne");
      } else ok("C6", `${nom} · ${titre}`, `${reelles.length} enseignement(s), chacun adossé à un fait`);
    }
  }
  if (!jugee) so("C0", nom, "aucune table de cadence renseignée (gabarit vierge, ou artefact d'une autre nature) — rien à juger");
}

// ---- recette : les deux sens, sur des documents fabriqués -------------------------------------
if (args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  const rejouer = (texte) => { F.length = 0; juger("essai.md", texte); return F; };
  const aFail = (regle) => F.some((f) => f.regle === regle && f.statut === "FAIL");
  console.log("Recette d'oracle-cadence — les deux sens\n");

  const RAID_VERT = ["## Risques — ce qui pourrait arriver", "",
    "| # | Risque | Probabilité | Impact | Propriétaire | Relevé le | Parade décidée |",
    "|---|---|---|---|---|---|---|",
    "| R-01 | la bascule de domaine casse les liens | forte | fort | Sébastien P. | 2026-08-23 | armer par drapeau, vérifier, basculer |",
    "", "## Hypothèses — ce qu'on croit sans l'avoir vérifié", "",
    "| # | Hypothèse | Ce qui casse si elle est fausse | À valider avant | Propriétaire | Statut |",
    "|---|---|---|---|---|---|",
    "| H-01 | l'ancienne adresse n'a plus de trafic | des liens meurent en silence | 2026-09-15 | Sébastien P. | ouverte |",
    "", "## Dépendances — ce qu'on attend de quelqu'un d'autre", "",
    "| # | Dépendance | Attendue de | Attendue pour | Ce qui est bloqué sans elle | Relancée le |",
    "|---|---|---|---|---|---|",
    "| D-01 | entrée de zone de noms | Sébastien P. | 2026-08-30 | la redirection reste morte | 2026-08-23 |", ""].join("\n");
  rejouer(RAID_VERT);
  att("RAID complet → aucun constat", !aFail("C1") && !aFail("C2") && !aFail("C3"));

  rejouer(RAID_VERT.replace("| R-01 | la bascule de domaine casse les liens | forte | fort | Sébastien P. |",
    "| R-01 | la bascule de domaine casse les liens | forte | fort | l'équipe |"));
  att("C1 — « l'équipe » n'est pas un propriétaire", aFail("C1"));
  att("C1 — le constat NOMME la ligne fautive et ce qu'il a lu",
    F.some((f) => f.regle === "C1" && /R-01/.test(f.message) && /l'équipe/.test(f.message)));

  rejouer(RAID_VERT.replace("| H-01 | l'ancienne adresse n'a plus de trafic | des liens meurent en silence | 2026-09-15 |",
    "| H-01 | l'ancienne adresse n'a plus de trafic | des liens meurent en silence | à voir |"));
  att("C2 — une hypothèse sans date butoir est refusée", aFail("C2"));

  rejouer(RAID_VERT.replace("| la redirection reste morte | 2026-08-23 |", "| la redirection reste morte |  |"));
  att("C3 — une relance vide est refusée", aFail("C3"));
  rejouer(RAID_VERT.replace("| la redirection reste morte | 2026-08-23 |", "| la redirection reste morte | jamais |"));
  att("C3 — « jamais » est un AVEU accepté, pas un défaut", !aFail("C3"));

  const ACTIONS = (acteur, suite) => ["## Actions", "",
    "| Action | Acteur | Pourquoi pas l'IA | Pour le | Si elle n'est pas faite |",
    "|---|---|---|---|---|",
    `| créer l'entrée de zone | ${acteur} | acces | 2026-08-30 | ${suite} |`, ""].join("\n");
  rejouer(ACTIONS("manuelle_utilisateur", "les liens meurent sans message"));
  att("C4 — action complète → aucun constat", !aFail("C4"));
  rejouer(ACTIONS("Sébastien", "les liens meurent sans message"));
  att("C4 — un acteur hors vocabulaire fermé est refusé", aFail("C4"));
  rejouer(ACTIONS("manuelle_utilisateur", ""));
  att("C4 — une colonne de conséquence VIDE est refusée", aFail("C4"));
  rejouer(ACTIONS("manuelle_utilisateur", "à faire vite"));
  att("C4 — une conséquence remplie mais creuse PASSE, et c'est la limite déclarée", !aFail("C4"));

  const BENEF = (av, ap) => ["## Bénéfices mesurés", "",
    "| # | Bénéfice | Mesure AVANT | Mesure APRÈS | Prise le | Écart | Attribuable à |",
    "|---|---|---|---|---|---|---|",
    `| B-01 | temps de relecture | ${av} | ${ap} | 2026-08-23 | -40 % | la vue générée |`, ""].join("\n");
  rejouer(BENEF("50 min", "30 min"));
  att("C5 — deux mesures chiffrées → aucun constat", !aFail("C5"));
  rejouer(BENEF("50 min", "à mesurer"));
  att("C5 — une mesure APRÈS absente est refusée", aFail("C5"));
  rejouer(BENEF("JAMAIS PRISE", "30 min"));
  att("C5 — « JAMAIS PRISE » est une déclaration acceptée", !aFail("C5"));

  const REX = (ens) => ["## Ce qui a marché, et pourquoi", "",
    "| Enseignement | Le fait qui l'a produit | Reproductible comment |",
    "|---|---|---|",
    `| ${ens} | 2026-08-23 : 4 règles mortes trouvées | oracle-pieges-regex |`, ""].join("\n");
  rejouer(REX("balayer le parc après chaque règle neuve"));
  att("C6 — un enseignement adossé à un fait passe", !aFail("C6"));
  rejouer(["## Ce qui a marché, et pourquoi", "",
    "| Enseignement | Le fait qui l'a produit | Reproductible comment |",
    "|---|---|---|",
    "| mieux communiquer | on a senti que ça allait mieux | en y pensant |", ""].join("\n"));
  att("C6 — un enseignement sans fait est refusé", aFail("C6"));

  // Le verrou du gabarit : une ligne encore à l'état d'exemple ne se juge pas.
  rejouer(["## Risques — ce qui pourrait arriver", "",
    "| # | Risque | Probabilité | Impact | Propriétaire | Relevé le | Parade décidée |",
    "|---|---|---|---|---|---|---|",
    "| {R-01} | {ce qui pourrait arriver} | {faible} | {faible} | {prénom nom} | {AAAA-MM-JJ} | {la parade} |", ""].join("\n"));
  att("un gabarit VIERGE n'est pas accusé (sinon le gabarit serait en défaut, pas l'auteur)",
    !F.some((f) => f.statut === "FAIL"));

  console.log(`\nRecette cadence : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// ---- jugement de fichiers ---------------------------------------------------------------------
const cibles = args.filter((a) => !a.startsWith("--"));
if (!cibles.length) {
  console.log(JSON.stringify({ oracle: "oracle-cadence", verdict: "SANS_OBJET",
    findings: [{ regle: "C0", statut: "SANS_OBJET", ou: "-", message: "aucun fichier donné — usage : node oracle-cadence.mjs <fichier.md> [...]" }],
    non_juge: NON_JUGE }, null, 1));
  process.exit(2);
}
for (const c of cibles) {
  if (!existsSync(c)) { ko("C0", c, "fichier introuvable"); continue; }
  juger(basename(c), readFileSync(c, "utf8"));
}
const echecs = F.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({ oracle: "oracle-cadence", version: "1.0.0",
  verdict: echecs ? "FAIL" : F.every((f) => f.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS",
  findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
process.exit(echecs ? 1 : 0);
