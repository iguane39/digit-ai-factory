#!/usr/bin/env node
/**
 * oracle-synthese.mjs — juge la FORME d'un message de fin de traitement contre
 * `gabarits\RESTITUTION.md` v2 (14/08/2026).
 *
 * Pourquoi un oracle : la v1 de la consigne disait « sa tenue se vérifie à la relecture ».
 * C'est exactement ce que la loi transverse de l'écosystème refuse ailleurs — un ✓ sans
 * oracle exécuté n'est pas un ✓. Une consigne de FORME est le seul genre de règle qui se
 * contrôle entièrement à la machine : autant le faire.
 *
 * Ce qu'il ne juge PAS, et ne jugera jamais : la justesse du verdict, la pertinence d'un
 * risque, la sincérité d'un motif. Il tient la forme opposable, pas le fond — comme
 * oracle-etude-opportunite.
 *
 * Règles (chacune binaire) :
 *   S1  les 8 blocs de la structure sont présents (un bloc vide DOIT être dit, pas supprimé) ;
 *   S2  en-tête horodaté : une date ET une heure, avec fuseau ou mention explicite ;
 *   S3  verdict en une ligne, factuel — pas d'appréciation nue en guise de verdict ;
 *   S4  toute décision demandée est en choix FERMÉ (au moins deux options étiquetées) ;
 *   S5  chaque élément « non traité » porte un motif (la ligne n'est jamais seule) ;
 *   S6  les prochaines actions portent leurs deux classements : acteur ET ordre justifié ;
 *   S7  aucune profondeur de puce au-delà de 2 niveaux ;
 *   S8  aucun ✓ / « fait » sans preuve citée dans la même puce (verdict, compteur, chemin) ;
 *   S9  une SYNTHÈSE D'OUVERTURE en langage commanditaire précède le bloc 1 : l'état, ce
 *       que ça change, ce qui est attendu — SANS identifiant nu, chemin de fichier ni code
 *       (TF-0407, retour humain du 20/08 : « ton interlocuteur peut être pas assez
 *       technique pour comprendre tout ce que tu remontes »). Le détail vérifiable vient
 *       APRÈS — on ordonne, on ne supprime jamais.
 *   S10 aucun effort chiffré en JOURS sur une ligne de coût/estimation (TF-0408, 20/08 :
 *       avec l'IA un nombre de jours n'a pas de sens — complexité × durée, échelle du
 *       rapport d'audit). Les faits mesurés hors ligne de coût ne sont pas jugés.
 *   S11 toute action `auto_ia` NON EXÉCUTÉE porte son motif de non-exécution, pris dans un
 *       vocabulaire fermé (TF-0457) — sans quoi l'étiquette n'engage à rien ;
 *   S12 toute action `manuelle_dev` / `manuelle_utilisateur` porte sa raison d'impossibilité
 *       IA, vocabulaire fermé (TF-0458) — la loi transverse n° 5 l'exige depuis l'origine ;
 *   S13 toute action laissée à l'humain est EXÉCUTABLE : un chemin, une commande ou un
 *       libellé d'écran, dans le groupe de la puce (TF-0459) ;
 *   S14 toute action porte un identifiant stable, ou se déclare `neuve` (TF-0460) — sans
 *       identifiant, deux restitutions successives ne se comparent pas.
 *
 * Usage : node oracle-synthese.mjs <synthese.md>   → verdict JSON
 *         node oracle-synthese.mjs --self-test     → fixtures double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Un bloc = son titre reconnu par un motif. Le libellé exact est libre : c'est la PRÉSENCE du
// bloc qui est opposable, pas sa formulation — imposer un mot à mot rendrait la consigne
// inapplicable aux sorties courtes.
const BLOCS = [
  [/(^|\n)#{1,4}\s*(1\.\s*)?(en-t[êe]te|identification|contexte du traitement)/i, "1. En-tête d'identification"],
  [/(^|\n)#{1,4}\s*(2\.\s*)?verdict/i, "2. Verdict en une ligne"],
  [/(^|\n)#{1,4}\s*(3\.\s*)?d[ée]cisions?/i, "3. Décisions attendues"],
  [/(^|\n)#{1,4}\s*(4\.\s*)?trait[ée]/i, "4. Traité"],
  [/(^|\n)#{1,4}\s*(5\.\s*)?non\s+trait[ée]/i, "5. Non traité"],
  [/(^|\n)#{1,4}\s*(6\.\s*)?[ée]carts?\s+[àa]\s+la\s+lettre/i, "6. Écarts à la lettre"],
  [/(^|\n)#{1,4}\s*(7\.\s*)?risques?/i, "7. Risques"],
  [/(^|\n)#{1,4}\s*(8\.\s*)?(prochaines?\s+actions?|suites?\s+[àa]\s+donner)/i, "8. Prochaines actions"],
];

const MOTIFS_ABSENCE = /(aucun|rien|n[ée]ant|sans objet|non concern)/i;

// Les jetons de verdict sont cherchés en CASSE EXACTE, et ce n'est pas un détail : avec le
// drapeau insensible, `\bPASS\b` matche le mot français « passé » — en JavaScript `\b` est
// ASCII, donc « é » compte comme une frontière. « Tout s'est bien passé » passait alors pour
// un verdict mesuré, c'est-à-dire exactement la phrase que cette règle existe pour refuser.
// Faux positif trouvé par le self-test le 14/08.
const _JETONS = /\b(PASS|FAIL|SKIP|NA|TENU|OK|KO)\b/;
const _CHIFFRES = /(\d+\s*\/\s*\d+|\d+\s*%|\d+\s+(test|finding|r[èe]gle|cas|item|constat|élément|commit|pan)s?\b)/i;
const _LOCALISATEURS = /(`[^`]+`|\.(md|json|mjs|py|html|jsonl)\b|\b[a-f0-9]{7,40}\b)/;
const preuve = (s) => _JETONS.test(s) || _CHIFFRES.test(s) || _LOCALISATEURS.test(s);

// Une puce Markdown se POURSUIT sur les lignes suivantes quand elle dépasse la largeur. Juger
// ligne par ligne dénonçait donc une puce dont la preuve tombait sur la continuation — faux
// positif constaté le 14/08 en jugeant l'oracle sur sa propre restitution. On reconstitue la
// puce LOGIQUE : la puce, plus toutes les lignes qui la continuent (indentées, non-puces).
function puces(texte) {
  const sortie = [];
  let courante = null;
  for (const ligne of texte.split("\n")) {
    if (/^\s*[-*]\s+\S/.test(ligne)) {
      if (courante !== null) sortie.push(courante);
      courante = ligne;
    } else if (courante !== null && /^\s+\S/.test(ligne)) {
      courante += " " + ligne.trim();
    } else if (courante !== null) {
      sortie.push(courante);
      courante = null;
    }
  }
  if (courante !== null) sortie.push(courante);
  return sortie;
}

// Une ACTION du bloc 8 est une puce de premier niveau AVEC tout ce qui la suit : ses
// continuations et ses sous-puces. Juger la puce seule était le faux positif à ne pas
// reproduire (TF-0459) — la doctrine dit deux niveaux au plus, et c'est précisément au second
// que vivent le motif, le chemin et la commande. Grouper est donc la seule lecture juste.
function actionsGroupees(texte) {
  const groupes = [];
  for (const ligne of texte.split("\n")) {
    if (/^[-*]\s+\S/.test(ligne)) groupes.push(ligne);
    else if (groupes.length && /^\s+\S/.test(ligne)) groupes[groupes.length - 1] += " " + ligne.trim();
  }
  return groupes;
}

function bloc(texte, motif) {
  const m = texte.match(motif);
  if (!m) return null;
  const debut = m.index + m[0].length;
  const suivant = texte.slice(debut).search(/\n#{1,4}\s/);
  return texte.slice(debut, suivant === -1 ? undefined : debut + suivant);
}

function juger(texte) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });

  // S1 — les 8 blocs
  const absents = BLOCS.filter(([re]) => !re.test(texte)).map(([, nom]) => nom);
  absents.length
    ? ko("S1", `bloc(s) absent(s) : ${absents.join(" · ")} — un bloc sans contenu se DIT en une ligne, il ne disparaît pas (loi n° 3)`)
    : ok("S1", "les 8 blocs de la structure sont présents");

  // S2 — horodatage : date ET heure
  const enTete = bloc(texte, BLOCS[0][0]) || texte.slice(0, 800);
  const aDate = /\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/.test(enTete);
  const aHeure = /\b\d{1,2}\s*[h:]\s*\d{2}\b/i.test(enTete);
  if (aDate && aHeure) ok("S2", "en-tête horodaté (date et heure)");
  else ko("S2", `en-tête sans ${!aDate ? "date" : ""}${!aDate && !aHeure ? " ni " : ""}${!aHeure ? "heure" : ""} — plusieurs traitements tombent le même jour, sans heure ils ne s'ordonnent pas`);

  // S3 — verdict factuel : au moins un fait mesurable dans le bloc verdict
  const bVerdict = bloc(texte, BLOCS[1][0]) || "";
  preuve(bVerdict)
    ? ok("S3", "le verdict porte un fait mesurable")
    : ko("S3", "verdict sans fait mesurable — « tout s'est bien passé » n'est pas un verdict, « 19/19 » l'est");

  // S4 — décisions en choix fermé
  const bDecisions = bloc(texte, BLOCS[2][0]) || "";
  if (MOTIFS_ABSENCE.test(bDecisions.split("\n")[0] || "") || MOTIFS_ABSENCE.test(bDecisions.trim().slice(0, 120))) {
    ok("S4", "aucune décision en attente — déclaré explicitement");
  } else {
    const options = (bDecisions.match(/\((?:a|b|c|d)\)|^\s*[-*]\s*\*\*\(?[a-d]\)?\*\*/gim) || []).length;
    options >= 2
      ? ok("S4", `décisions en choix fermé (${options} option(s) étiquetée(s))`)
      : ko("S4", "décision demandée sans choix fermé — l'humain tranche entre des options, il ne rédige pas la solution");
  }

  // S5 — chaque non-traité porte un motif
  const bNonTraite = bloc(texte, BLOCS[4][0]) || "";
  const lignesNonTraite = puces(bNonTraite);
  if (!lignesNonTraite.length) {
    MOTIFS_ABSENCE.test(bNonTraite)
      ? ok("S5", "rien de non traité — déclaré explicitement")
      : ko("S5", "bloc « non traité » vide et muet : ni élément, ni déclaration d'absence");
  } else {
    const sansMotif = lignesNonTraite.filter((l) => !/(motif|parce que|car\b|faute de|bloqu|hors mandat|[ée]cart|:\s*\S)/i.test(l));
    sansMotif.length
      ? ko("S5", `${sansMotif.length} élément(s) non traité(s) SANS motif — un reste sans motif est un silence`)
      : ok("S5", `${lignesNonTraite.length} élément(s) non traité(s), tous motivés`);
  }

  // S6 — prochaines actions : acteur ET ordre justifié
  const bActions = bloc(texte, BLOCS[7][0]) || "";
  if (MOTIFS_ABSENCE.test(bActions.trim().slice(0, 120))) {
    ok("S6", "aucune action suivante — déclaré explicitement");
  } else {
    const acteur = /(auto_ia|manuelle_dev|manuelle_utilisateur|\bIA\b|d[ée]veloppeur|utilisateur|humain)/i.test(bActions);
    const ordre = /(priorit|d'abord|en premier|impact|risque \d+|parce qu|car\b|levier)/i.test(bActions);
    if (acteur && ordre) ok("S6", "prochaines actions : acteur nommé et ordre justifié");
    else ko("S6", `prochaines actions sans ${!acteur ? "acteur" : ""}${!acteur && !ordre ? " ni " : ""}${!ordre ? "justification d'ordre" : ""} — une liste non ordonnée se lit dans l'ordre où elle a été écrite, pas dans celui qui sert`);
  }

  // S7 — profondeur de puces
  const trop = texte.split("\n").filter((l) => /^\s{6,}[-*]\s+\S/.test(l));
  trop.length
    ? ko("S7", `${trop.length} puce(s) au-delà du 2e niveau — au 3e, on ne lit plus, on scanne`)
    : ok("S7", "profondeur de puces tenue (2 niveaux au plus)");

  // S8 — pas de ✓ sans preuve dans la même puce
  const nus = puces(texte).filter((l) => {
    if (!/(✓|\bfait\b|\btermin[ée]|\bsold[ée]|\bclos\b)/i.test(l)) return false;
    return !preuve(l);
  });
  nus.length
    ? ko("S8", `${nus.length} affirmation(s) « fait » sans preuve citée — un ✓ sans oracle exécuté n'est pas un ✓`)
    : ok("S8", "chaque élément déclaré fait porte sa preuve");

  // S9 (TF-0407) — la synthèse d'ouverture, en langage commanditaire. Le retour qui l'a fait
  // naître est la mesure elle-même : le destinataire unique des restitutions dit qu'une partie
  // ne lui parvient pas — et une information remontée et non comprise a le même effet qu'une
  // information tue, avec le coût de lecture en plus. La règle est binaire : entre le titre et
  // le premier bloc, un paragraphe de prose d'au moins vingt mots, SANS identifiant TF nu, sans
  // chemin de fichier, sans span de code, sans sha. Le détail vérifiable ne disparaît pas : il
  // vient APRÈS — on ordonne, on ne supprime jamais (doctrine RL-1/RL-7 des rapports,
  // transposée à la conversation, la seule surface qui restait sans doctrine d'audience).
  const premierBloc = texte.search(/(^|\n)#{2,4}\s/);
  const ouverture = (premierBloc > 0 ? texte.slice(0, premierBloc) : "")
    .replace(/^#[^\n]*\n/, "")           // le titre H1 n est pas la synthese
    .replace(/^---[\s\S]*?---\s*/, "")  // le frontmatter non plus
    .trim();
  const mots = ouverture.split(/\s+/).filter(Boolean).length;
  const techniques = [
    [/\bTF-\d{3,4}\b/, "identifiant TF nu"],
    [/[\w-]+\.(?:md|mjs|py|json|jsonl|html|toml)\b/, "chemin ou nom de fichier"],
    [/`[^`]+`/, "span de code"],
    [/\b[a-f0-9]{7,40}\b/, "sha"],
  ].filter(([motif]) => motif.test(ouverture)).map(([, quoi]) => quoi);
  if (mots < 20) {
    ko("S9", `synthèse d'ouverture absente ou trop courte (${mots} mot(s) avant le premier bloc) — ` +
      "l'état, ce que ça change et ce qui est attendu se disent en langage commanditaire AVANT le détail");
  } else if (techniques.length) {
    ko("S9", `la synthèse d'ouverture porte du vocabulaire technique nu (${techniques.join(", ")}) — ` +
      "ces éléments vont APRÈS, dans les blocs : on ordonne, on ne supprime jamais");
  } else {
    ok("S9", `synthèse d'ouverture en langage commanditaire (${mots} mots, sans identifiant nu)`);
  }

  // S10 (TF-0408) — l'effort parle en complexité × durée, jamais en jours : sur toute
  // ligne portant un marqueur de coût/estimation, une unité « j / jours / j-h » chiffrée
  // est un défaut. Même règle qu'E8 côté études — la restitution est l'autre surface où
  // une estimation se glisse.
  const lignesCout = texte.split("\n").filter((l) => /co[uû]t|estimation|effort estimé|charge estimée/i.test(l));
  const enJours = lignesCout.filter((l) => /(?:\d+(?:[.,]\d+)?|½)\s*(?:à\s*\d+(?:[.,]\d+)?\s*)?j(?:ours?)?\b|jours?[- ]hommes?/i.test(l));
  enJours.length
    ? ko("S10", `${enJours.length} ligne(s) de coût chiffrée(s) en JOURS — complexité (simple|moyen|complexe|très complexe) × durée (court|moyen|long|très long). Ex. : ${enJours[0].trim().slice(0, 90)}`)
    : ok("S10", "aucune estimation en jours — l effort parle en complexité × durée");

  // ---- S11 à S14 (TF-0457..TF-0460, 22/08) — le bloc 8 cesse d'être une liste d'étiquettes --
  //
  // Retour humain du 22/08 : « la liste des tâches est trop longue, trop complexe, sans assez
  // de détails sur les problèmes, les solutions possibles, menées par l'IA ou ne pouvant être
  // traitées que par moi ». Instruit sur les fichiers, il ne demandait presque RIEN de neuf :
  // les blocs 3 et 8 portaient déjà la doctrine, et la loi transverse n° 5 dit depuis l'origine
  // « l'IA fait, l'humain décide — la voie automatisée est le DÉFAUT ; l'action laissée à
  // l'humain se justifie ». Ce qui manquait n'était pas la règle mais son CONTRÔLE : S6 ne
  // teste que la PRÉSENCE d'un nom d'acteur, jamais ce que cette étiquette engage.
  //
  // Mesuré le 22/08 sur les 13 synthèses à bloc 8 de `output\04-plans\` : 15 lignes `auto_ia`,
  // dont 9 renvoyées à un mandat humain sans que rien ne le dise — le lecteur y lit neuf tâches
  // là où il y a une seule gate de gouvernance ; 6 `manuelle_dev` et 17 `manuelle_utilisateur`,
  // ZÉRO justification d'attribution ; ZÉRO identifiant d'action stable, donc aucune
  // comparaison possible d'un tour au suivant, donc la même ligne re-servie indéfiniment.
  //
  // Les vocabulaires sont FERMÉS et NON ACCENTUÉS, et ce n'est pas un détail de style : c'est
  // ce qui les rend comptables (« combien d'actions restent humaines par `acces` ? ») et ce qui
  // les empêche d'être touchés par hasard par de la prose française — « décision », « accès »,
  // « présence » portent leur accent et ne matchent pas les jetons `decision`, `acces`,
  // `presence`. Un motif hors vocabulaire n'est pas un refus valide : c'est un candidat à
  // l'automatisation, à verser au registre.
  const MOTIFS_IA = /\b(gate_gouvernance|dependance_bloc_3|garde_fou|borne_atteinte|dependance_externe)\b/;
  const MOTIFS_HUMAIN = /\b(acces|decision|depense|presence|irreversible)\b/;
  const ID_STABLE = /\b[A-Z]{1,4}-\d{2,4}\b/;
  const DECLAREE_NEUVE = /\b(neuve|neuf|nouvelle|nouveau)\b/i;
  const ACTEURS = /\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b/;
  const HUMAINS = /\b(manuelle_dev|manuelle_utilisateur)\b/;

  // Une action déclarée ABSENTE (« aucune action manuelle_utilisateur ») n'est pas une action :
  // la loi transverse n° 3 exige qu'on la DISE, pas qu'on la justifie.
  const groupes8 = actionsGroupees(bActions)
    .filter((g) => !MOTIFS_ABSENCE.test(g.replace(/^\s*[-*]\s+/, "").slice(0, 40)));

  const juger8 = (regle, cible, predicat, siKo, siOk) => {
    const concernes = groupes8.filter((g) => cible.test(g));
    if (!concernes.length) return ok(regle, `aucune action concernée — ${siOk}`);
    const fautifs = concernes.filter((g) => !predicat(g));
    fautifs.length
      ? ko(regle, `${fautifs.length} action(s) sur ${concernes.length} — ${siKo} Ex. : ${fautifs[0].replace(/\s+/g, " ").trim().slice(0, 110)}`)
      : ok(regle, `${concernes.length} action(s) concernée(s) — ${siOk}`);
  };

  juger8("S11", /\bauto_ia\b/, (g) => MOTIFS_IA.test(g),
    "une action `auto_ia` listée en RESTE sans motif de non-exécution : la voie automatisée est le défaut, " +
    "donc ce qui n'a pas été fait se justifie. Vocabulaire : gate_gouvernance, dependance_bloc_3, garde_fou, borne_atteinte, dependance_externe.",
    "chaque action `auto_ia` non exécutée porte son motif");

  juger8("S12", HUMAINS, (g) => MOTIFS_HUMAIN.test(g),
    "une action laissée à l'humain sans raison d'impossibilité IA — loi transverse n° 5. " +
    "Vocabulaire : acces, decision, depense, presence, irreversible (non accentués).",
    "chaque action humaine porte sa raison d'impossibilité");

  // Le nom d'acteur est retiré avant la mesure : `manuelle_dev` est lui-même un span de code, et
  // le laisser rendrait la règle satisfaite par sa propre étiquette — la boucle la plus bête.
  juger8("S13", HUMAINS, (g) => _LOCALISATEURS.test(g.replace(ACTEURS, " ").replace(/`?\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b`?/g, " ")),
    "une action laissée à l'humain sans chemin, commande ni libellé d'écran : le lecteur doit rouvrir le projet " +
    "pour savoir ce qu'on lui demande — c'est le coût que cette règle existe pour supprimer.",
    "chaque action humaine est exécutable telle quelle");

  juger8("S14", ACTEURS, (g) => ID_STABLE.test(g) || DECLAREE_NEUVE.test(g),
    "une action sans identifiant stable ni mention `neuve` : deux restitutions successives ne se comparent pas, " +
    "et la même ligne se re-sert d'une liste à l'autre.",
    "chaque action porte un identifiant stable ou se déclare neuve");

  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS");

const arg = process.argv[2];
if (arg === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "restitution-"));
  const verte = `# Restitution — campagne de test

Le contrôle complet de la forge de tests est terminé et tout est au vert : chaque défaut que
nous avions volontairement planté a bien été détecté, ce qui prouve que la surveillance
fonctionne. Rien n'attend de correction ; la seule chose attendue de vous est la décision de
publication ci-dessous.

## 1. En-tête
Campagne · forge-tests · terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot.

## 2. Verdict
Recette S-01 TENU — 19/19 défauts détectés au banc rouge, pytest 365.

Coût de la reprise proposée : complexité moyen · durée court.

## 3. Décisions attendues
- Pousser et taguer la version ?
  - (a) taguer v1.12.0 maintenant — recommandé, tout est prouvé ;
  - (b) attendre le prochain lot — coût : les 26 commits restent locaux.
  - sans décision : rien n'est publié.

## 4. Traité
- Garde de précondition sur le pan qualif — preuve : 18 tests, 0 finding quand la garde s'active.

## 5. Non traité
- Regroupement par cause racine : motif — sa cause est traitée, critère de réouverture écrit.

## 6. Écarts à la lettre
Aucun écart : la demande a été suivie à la lettre.

## 7. Risques
- Le pack anglais ne se régénère plus.
  - signal : une source corrigée diverge de son pack au prochain assemblage ;
  - parade : traduire D17 en amont.

## 8. Prochaines actions
- d'abord TF-0220 (manuelle_dev) — parce qu'il débloque toute correction ultérieure du corpus.
  - pourquoi pas l'IA : decision — arbitrage normatif sur le seuil retenu ;
  - où : \`forge_tests\\corpus.py\`, puis relancer la recette S-01.
- ensuite TF-0221 (manuelle_utilisateur) — décision normative, impact sur 19 citations.
  - pourquoi pas l'IA : acces — le portail de publication n'est pas ouvert à l'agent ;
  - où : écran « Publier la version », bouton \`Publier\`.
- enfin TF-0222 (auto_ia) — regrouper les constats par cause racine.
  - motif de non-exécution : dependance_bloc_3 — attend la décision de publication ci-dessus.
`;
  // Rouge : sept violations distinctes et indépendantes.
  const rouge = verte
    .replace(/## 8\. Prochaines actions[\s\S]*$/,
      "## 8. Prochaines actions\n" +
      "- d'abord regrouper les constats (auto_ia) — parce que c'est le plus rentable.\n" +
      "- ensuite publier la version (manuelle_dev) — parce que tout est prouvé.\n")
    .replace(/\n\nLe contrôle complet[\s\S]*?ci-dessous\./, "")  // S9 : plus d ouverture
    .replace("terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot.", "terminée aujourd'hui.")
    .replace("- Regroupement par cause racine : motif — sa cause est traitée, critère de réouverture écrit.", "- Regroupement par cause racine")
    .replace("Coût de la reprise proposée : complexité moyen · durée court.", "Coût de la reprise proposée : 2-3 j.")
    .replace("Recette S-01 TENU — 19/19 défauts détectés au banc rouge, pytest 365.", "Tout s'est bien passé.");
  writeFileSync(join(dir, "verte.md"), verte, "utf8");
  writeFileSync(join(dir, "rouge.md"), rouge, "utf8");
  const moi = fileURLToPath(import.meta.url);
  const rv = spawnSync(process.execPath, [moi, join(dir, "verte.md")], { encoding: "utf8" });
  const rr = spawnSync(process.execPath, [moi, join(dir, "rouge.md")], { encoding: "utf8" });
  const casse = [];
  if (rv.status !== 0) casse.push("la fixture VERTE ne passe pas : " + rv.stdout);
  if (rr.status !== 1) casse.push("la fixture ROUGE ne FAIL pas");
  else {
    for (const regle of ["S2", "S3", "S5", "S9", "S10", "S11", "S12", "S13", "S14"]) {
      if (!new RegExp(`"${regle}"[^}]*FAIL`).test(rr.stdout)) casse.push(`la rouge échoue mais pas sur ${regle}`);
    }
  }
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test restitution : 2/2 PASS (verte PASS ; rouge FAIL sur S2 horodatage, S3 verdict non factuel, S5 reste sans motif, S9 ouverture absente, S10 coût en jours, S11 auto_ia sans motif, S12 action humaine sans raison, S13 action humaine non exécutable, S14 action sans identifiant)");
  process.exit(casse.length ? 1 : 0);
}

if (!arg || !existsSync(arg)) {
  console.log(JSON.stringify({ oracle: "oracle-synthese", verdict: "ERREUR", message: "synthèse introuvable — usage : node oracle-synthese.mjs <synthese.md> | --self-test" }));
  process.exit(2);
}
const findings = juger(readFileSync(arg, "utf8"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({
  oracle: "oracle-synthese",
  version: "1.1.0",
  cible: arg,
  verdict,
  findings,
  non_juge: [
    "la JUSTESSE du verdict, la pertinence d'un risque, la sincérité d'un motif — cet oracle tient la forme opposable, jamais le fond",
    "la longueur de prose (≤ 400 mots) n'est pas mesurée ici : séparer récit et énumération demande une lecture, pas un compteur",
  ],
}, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
