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
 *   S15 toute décision du bloc 3 RAPPELLE SON SUJET avant ses options : ≥ 25 mots, sans
 *       identifiant nu (22/08). Un identifiant ne désigne rien pour qui ne l'a pas écrit,
 *       et un titre court est une étiquette — or une décision mal écrite se tranche quand
 *       même, à l'aveugle. C'est S9 appliquée par décision.
 *   S16 toute décision porte sa RECOMMANDATION et la SOURCE consultée d'où elle sort — ou la
 *       déclaration qu'aucune source disponible ne répond (22/08). Une question dont la
 *       réponse est dans un document déjà fourni ne se pose pas : elle se répond.
 *   S17 un renvoi entre lignes nomme le SUJET ou son identifiant stable, JAMAIS une position
 *       (TF-0507, 22/08) — « ligne 8 », « point 5 » désignent autre chose au message suivant,
 *       la liste ayant été retriée. S14 exige un identifiant stable POUR l'item ; S17 exige
 *       qu'on s'en serve POUR RENVOYER. Un identifiant qui ne sert jamais à renvoyer ne sert
 *       à rien.
 *   S18 les tableaux d'un même bloc portent le MÊME en-tête (TF-0509, 22/08) — cinq mises en
 *       page pour le même contenu dans une seule session, dont un bloc à quatre formes de
 *       tableau distinctes. Une liste dont les colonnes changent ne se compare pas, même avec
 *       des identifiants stables : le bénéfice de S14 est annulé.
 *   S19 toute action du bloc 8 dit CE QUI SE PASSE SI ELLE N'EST PAS FAITE (TF-0510, 22/08) —
 *       symétrique de S16 côté actions. Une liste de restes sans conséquences est un
 *       inventaire, pas un outil d'arbitrage : c'est cette colonne qui permet de choisir ce
 *       qu'on laisse tomber.
 *   S20 un terme du référentiel `gabarits\JARGON-A-GLOSER.json` employé aux blocs 3 ou 8
 *       porte sa glose adjacente (TF-0511, 22/08) — S9 ne juge que l'OUVERTURE, or c'est aux
 *       blocs qu'on EXÉCUTE que le jargon coûte le plus : un jargon au bloc 0 fait perdre le
 *       fil, un jargon dans une action fait exécuter de travers ou pas du tout.
 *
 * Usage : node oracle-synthese.mjs <synthese.md>   → verdict JSON
 *         node oracle-synthese.mjs --self-test     → fixtures double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
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
//
// DEUXIÈME FORME, ajoutée le 22/08 (TF-0508) : la LIGNE DE TABLEAU. Le lecteur l'a réclamée
// trois fois dans une seule session — « pourquoi tout n'est pas dans un seul tableau ? », puis
// « Revois complètement ta présentation », puis « tableau !! ». Ne lire que les puces laissait
// donc un TROU BÉANT : un bloc 8 rendu en tableau rendait zéro groupe, S11 à S14 répondaient
// « aucune action concernée » et le bloc entier échappait au jugement. Une règle qui se
// DÉSACTIVE au moment où l'on adopte la forme demandée est pire qu'une règle absente : elle
// donne un vert en récompense du changement de forme.
function actionsGroupees(texte) {
  const groupes = [];
  for (const ligne of texte.split("\n")) {
    if (/^\s*\|/.test(ligne)) continue;            // les tableaux sont lus plus bas
    if (/^[-*]\s+\S/.test(ligne)) groupes.push(ligne);
    else if (groupes.length && /^\s+\S/.test(ligne)) groupes[groupes.length - 1] += " " + ligne.trim();
  }
  return groupes.concat(lignesDeDonnees(texte));
}

// Les lignes de DONNÉES d'un tableau markdown : ni l'en-tête (1re ligne du tableau), ni le
// séparateur `|---|`. Un bloc peut porter plusieurs tableaux — le compteur repart à zéro dès
// qu'une ligne non-tableau les sépare.
function lignesDeDonnees(texte) {
  const sortie = [];
  let rang = 0;
  for (const l of texte.split("\n")) {
    if (!/^\s*\|/.test(l)) { rang = 0; continue; }
    rang++;
    if (rang === 1) continue;                                    // en-tête
    if (/^\s*\|[\s|:.-]*\|\s*$/.test(l)) continue;                 // séparateur
    if (!l.replace(/[|\s]/g, "")) continue;                       // ligne vide
    sortie.push(l.trim());
  }
  return sortie;
}

// Les EN-TÊTES de tableau d'un bloc, dans l'ordre : première ligne de chaque tableau.
function entetesDeTableau(texte) {
  const sortie = [];
  let rang = 0;
  for (const l of texte.split("\n")) {
    if (!/^\s*\|/.test(l)) { rang = 0; continue; }
    rang++;
    if (rang === 1) sortie.push(l.trim().replace(/\s+/g, " ").toLowerCase());
  }
  return sortie;
}

// Le référentiel de jargon est une DONNÉE éditable et datée (loi n° 4) : son absence n'est pas
// une erreur d'oracle, c'est un SANS OBJET dit à voix haute. Un oracle qui plante faute de
// donnée annexe se fait retirer du chemin, et la règle meurt avec lui.
function chargerJargon() {
  const chemin = join(dirname(fileURLToPath(import.meta.url)), "..", "gabarits", "JARGON-A-GLOSER.json");
  if (!existsSync(chemin)) return [];
  try {
    const d = JSON.parse(readFileSync(chemin, "utf8"));
    return (d.termes || []).map((t) => t.terme).filter((t) => typeof t === "string" && t.length > 1);
  } catch { return []; }
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
  //
  // S19 (22/08) a introduit une tournure NÉGATIVE qui contient le mot « fait » : « si rien n'est
  // fait », « si on ne le fait pas », « si elle n'est pas faite ». S8 y lisait une affirmation de
  // fait sans preuve — faux positif constaté LE JOUR MÊME en jouant S19 sur une restitution
  // réelle : quatre actions correctement conséquencées faisaient échouer S8. Une conséquence n'est
  // pas un ✓, et une règle neuve qui met une règle ancienne en défaut sur du texte conforme est un
  // défaut de la NOUVELLE, pas de l'ancienne. On retire donc la clause conditionnelle avant de
  // chercher l'affirmation ; la preuve, elle, reste cherchée dans la puce ENTIÈRE.
  const sansConditionnel = (l) => l
    .replace(/\bsi\b[^.;]*?\bfaite?\b/gi, " ")
    .replace(/\bne (?:le |la |les )?fait pas\b/gi, " ")
    .replace(/\bnon fait\b/gi, " ");
  const nus = puces(texte).filter((l) => {
    if (!/(✓|\bfait\b|\btermin[ée]|\bsold[ée]|\bclos\b)/i.test(sansConditionnel(l))) return false;
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
  // TF-0513 (22/08) — les deux retraits étaient ORDONNÉS et tous deux ancrés en `^` : titre
  // d'abord, frontmatter ensuite. Or le gabarit PRESCRIT le frontmatter `destinataire: humain`
  // depuis TF-0331, donc il vient EN PREMIER dans toute synthèse conforme : le retrait du titre
  // ne matchait rien, et LE TITRE RESTAIT dans l'ouverture. S9 jugeait alors le H1 comme de la
  // prose de bloc 0, et un titre daté selon la convention de nommage (« … — 20260822a ») s'y
  // faisait lire comme un sha court. Deux règles prescrites par le MÊME gabarit se
  // contredisaient, sur un document sans défaut et devant un hook `Stop` bloquant.
  //
  // Le remède ne réordonne pas : il boucle jusqu'à point fixe, donc il est INDIFFÉRENT à
  // l'ordre — frontmatter puis titre, titre puis frontmatter, ou l'un sans l'autre.
  const premierBloc = texte.search(/(^|\n)#{2,4}\s/);
  let ouverture = (premierBloc > 0 ? texte.slice(0, premierBloc) : "").trim();
  for (let i = 0; i < 4; i++) {
    const avant = ouverture;
    ouverture = ouverture.replace(/^---[\s\S]*?\n---\s*/, "").replace(/^#[^\n]*\n?/, "").trim();
    if (ouverture === avant) break;
  }
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
  const MOTIFS_IA = /\b(gate_gouvernance|dependance_bloc_3|garde_fou|borne_atteinte|dependance_externe|hors_mandat)\b/;
  // `hors_mandat` a été AJOUTÉ dans l'heure qui a suivi l'écriture de S11, sur un cas réel : trois
  // lots de retours sont arrivés dans la boîte d'entrée pendant le mandat du 22/08. Les ingérer
  // est du ressort de l'IA, mais d'un AUTRE mandat. Aucun des cinq motifs d'origine ne le disait,
  // et la seule issue était d'en choisir un faux ou de taire la ligne — c'est-à-dire exactement ce
  // que S11 existe pour empêcher. Une règle qui force à mentir est une règle à corriger, pas à
  // contourner. C'est aussi le motif le plus facile à ABUSER : apposé sur une action que le mandat
  // courant couvre, il contourne S11 au lieu de la satisfaire, et aucun oracle ne le voit — c'est
  // déclaré en `non_juge` plutôt que passé sous silence.
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
    "donc ce qui n'a pas été fait se justifie. Vocabulaire : gate_gouvernance, dependance_bloc_3, garde_fou, borne_atteinte, dependance_externe, hors_mandat.",
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

  // ---- S19 (TF-0510, 22/08) — une action dit ce qui se passe si elle n'est PAS faite -------
  //
  // Demande humaine du 22/08, littérale et SYMÉTRIQUE : « fournir des actions claires, les
  // impacts de ces actions, les recos sur ces actions, des décisions claires, les impacts de ces
  // décisions, les recos des décisions ». Le référentiel n'en couvrait qu'une moitié : au bloc 3,
  // S15 et S16 exigent le sujet, la recommandation et sa source ; au bloc 8, S11 à S14 exigent le
  // motif, la raison, l'exécutabilité et l'identifiant — et AUCUNE n'exige la conséquence.
  //
  // Or c'est cette colonne qui rend la liste arbitrable : une liste de restes sans conséquences
  // est un inventaire, pas un outil de décision. Constaté à l'usage la même session — les
  // tableaux portant « si on ne fait rien » ont été acceptés, les autres redemandés.
  //
  // La RECOMMANDATION, elle, n'est pas exigée ici : une action n'offre pas toujours un choix, et
  // l'imposer partout produirait du remplissage. C'est l'asymétrie assumée avec S16.
  const CONSEQUENCE = /(si (?:rien |on )?(?:n(?:'|’)est|ne (?:le|la|les) fait|n(?:'|’)y a)|si (?:elle|il|ce) n(?:'|’)est pas (?:fait|trait|men|pris)|si non fait|sans (?:cette )?action|à défaut|conséquence si|impact si|sinon\s*[:,])/i;
  juger8("S19", ACTEURS, (g) => CONSEQUENCE.test(g),
    "une action sans ce qui se passe si elle N'EST PAS faite : la liste devient un inventaire au lieu " +
    "d'un outil d'arbitrage — c'est cette colonne qui permet de choisir ce qu'on laisse tomber. " +
    "Formes admises : « si rien n'est fait », « si on ne le fait pas », « à défaut », « sinon : », « impact si … ».",
    "chaque action dit ce qu'il en coûte de ne pas la faire");

  // ---- S18 (TF-0509, 22/08) — la forme ne change pas d'un tableau au suivant ----------------
  //
  // Mesure du 22/08 sur UNE session : au moins cinq mises en page pour le même contenu — prose
  // mêlée de tableaux, trois sections par acteur, un tableau unique, six sections portant quatre
  // formes de tableau distinctes, des fiches en prose, un tableau à nouveau. Le lecteur a tranché
  // en trois mots (« tableau !! ») après avoir écrit « toujours pas claire, recommence » et
  // « Revois complètement ta présentation ».
  //
  // Le coût n'est pas esthétique : à chaque changement de forme, le lecteur RÉAPPREND la mise en
  // page avant de pouvoir lire, et il perd la comparaison avec le message précédent — ce qui
  // annule le bénéfice de S14. Une liste dont les colonnes changent ne se compare pas, même avec
  // des identifiants stables.
  //
  // CE QUI EST JUGÉ ICI, et pas plus : la cohérence INTRA-document, bloc par bloc. Un bloc qui
  // porte deux tableaux d'en-têtes différents est un défaut — c'est exactement le cas mesuré
  // (« six sections, quatre formes »). La stabilité d'un TOUR AU SUIVANT demanderait de garder
  // l'état du tour précédent : elle est déclarée en `non_juge` plutôt que faussement promise.
  const entetesIncoherents = [];
  for (const [nom, bloc3ou8] of [["3", bDecisions], ["8", bActions]]) {
    const e = [...new Set(entetesDeTableau(bloc3ou8))];
    if (e.length > 1) entetesIncoherents.push(`bloc ${nom} : ${e.length} formes de tableau`);
  }
  entetesIncoherents.length
    ? ko("S18", `${entetesIncoherents.join(" · ")} — une liste dont les colonnes changent ne se compare pas, ` +
      "même avec des identifiants stables : le bénéfice de S14 est annulé. Un acteur est une COLONNE, pas une section.")
    : ok("S18", "forme de tableau cohérente dans chaque bloc");

  // ---- S17 (TF-0507, 22/08) — un renvoi nomme son sujet, jamais une position ----------------
  //
  // Fait mesuré sur pièce : une restitution renvoyait « préalable : ligne 8 (droit IAM) puis
  // ligne 5 (merge) ». Réponse du lecteur, mot pour mot : « Que veut dire ligne 8 (droit IAM)
  // puis ligne 5 (merge). C'est incompréhensible. » Vérification : les deux numéros avaient
  // changé de sens entre deux messages, le tri par urgence ayant déplacé les lignes.
  //
  // C'est le pendant, au niveau du RENVOI, de ce que S14 corrige au niveau de l'ITEM. S14 exige
  // un identifiant stable POUR l'action ; rien n'interdisait de la DÉSIGNER par sa position. Un
  // identifiant stable qui ne sert jamais à renvoyer ne sert à rien.
  //
  // `bloc` est délibérément HORS du motif : « voir le bloc 3 » désigne une structure fixe du
  // gabarit, pas une position dans une liste retriable.
  const RENVOI_POSITION = /\b(lignes?|points?|items?|puces?|entrées?|numéros?)\s*(?:n[°o]\s*)?\d+/i;
  const renvois = [bDecisions, bActions].flatMap((b) => b.split("\n")).filter((l) => RENVOI_POSITION.test(l));
  renvois.length
    ? ko("S17", `${renvois.length} renvoi(s) par POSITION dans les blocs 3 et 8 — la liste est retriée d'un ` +
      `message au suivant, le numéro désigne alors autre chose. Nommer le sujet ou son identifiant stable. ` +
      `Ex. : ${renvois[0].replace(/\s+/g, " ").trim().slice(0, 100)}`)
    : ok("S17", "aucun renvoi par position — les renvois nomment leur sujet");

  // ---- S20 (TF-0511, 22/08) — le jargon des blocs 3 et 8 porte sa glose --------------------
  //
  // Mesure du 22/08 : le lecteur a demandé DEUX FOIS l'explication du même point — « détaille 5 »,
  // puis « Explique 5 ». La première version employait « justificatif fédéré », « identité
  // system-assigned », « UAMI », « constat H2 », « filet » sans les gloser ; la seconde, écrite
  // sans aucun de ces termes, a été acceptée immédiatement.
  //
  // Le raisonnement de S9 s'applique mot pour mot — « une information remontée et non comprise a
  // le même effet qu'une information tue, avec le coût de lecture en plus » — mais S9 ne juge que
  // l'OUVERTURE. Or c'est aux blocs qu'on EXÉCUTE que le coût est le plus élevé : un jargon au
  // bloc 0 fait perdre le fil, un jargon dans une action fait exécuter de travers, ou pas du tout.
  //
  // Le référentiel est une DONNÉE (loi n° 4), fermée et datée : `gabarits\JARGON-A-GLOSER.json`.
  // Une heuristique sur les sigles en majuscules aurait un taux de faux positifs rédhibitoire
  // dans ce corpus, où la MAJUSCULE sert l'emphase — et un oracle qui crie sur l'emphase se fait
  // désactiver dans la semaine. La liste n'attrape que ce qui a réellement coûté un aller-retour.
  const jargon = chargerJargon();
  if (!jargon.length) {
    ok("S20", "référentiel de jargon absent ou vide — aucun terme à exiger (SANS OBJET, dit plutôt que tu)");
  } else {
    const nus = [];
    for (const [nom, b] of [["3", bDecisions], ["8", bActions]]) {
      for (const g of actionsGroupees(b)) {
        const preuveInterne = /(preuve|source consult)/i.test(g);
        for (const t of jargon) {
          const re = new RegExp(`${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[(\u00ab]`, "i");
          if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(g) && !re.test(g) && !preuveInterne) {
            nus.push(`bloc ${nom} : « ${t} »`);
          }
        }
      }
    }
    const uniques = [...new Set(nus)];
    uniques.length
      ? ko("S20", `${uniques.length} terme(s) de jargon sans glose adjacente aux blocs 3/8 : ${uniques.slice(0, 4).join(" · ")} — ` +
        "une information remontée et non comprise a le même effet qu'une information tue, avec le coût de lecture en plus. " +
        "Glose = une parenthèse qui suit le terme dans le même groupe. Référentiel : `gabarits\\JARGON-A-GLOSER.json`.")
      : ok("S20", `aucun terme de jargon nu aux blocs 3/8 (${jargon.length} terme(s) au référentiel)`);
  }

  // ---- S15 (22/08) — une décision RAPPELLE SON SUJET, ou elle n'est pas décidable -----------
  //
  // Retour humain du 22/08, dans l'heure qui a suivi la livraison de S11-S14 : « dans tes
  // prompts, rappelle le contexte des décisions à prendre, je ne peux pas me rappeler TF-0469 et
  // vue portefeuille ». Les deux exemples cités disent les deux moitiés du défaut : un
  // IDENTIFIANT (« TF-0469 ») ne désigne rien pour qui ne l'a pas écrit, et un TITRE COURT
  // (« vue portefeuille ») n'est qu'une étiquette. Le bloc 3 avait exactement le défaut que S13
  // venait de corriger au bloc 8 — sauf qu'au bloc 3 il coûte plus cher : une action mal écrite
  // se re-demande, une DÉCISION mal écrite se tranche quand même, à l'aveugle.
  //
  // S4 ne voyait rien : elle compte des options étiquetées, jamais ce qu'elles arbitrent. La
  // restitution qui a déclenché ce retour portait deux décisions, PASS S4 — la première avec un
  // chapeau en jargon de session, la seconde avec un titre de quatre mots et rien d'autre.
  //
  // La règle est celle du bloc 0 (S9), appliquée par décision : un chapeau d'au moins 25 mots,
  // avant la première option, SANS identifiant nu. Différence assumée avec S9 : les chemins et
  // spans de code restent tolérés ici — le sujet d'une décision EST parfois un fichier, et
  // l'interdire ferait écrire des périphrases. L'identifiant, lui, n'est jamais le sujet : il est
  // le nom que la chose porte au registre, et le registre n'est pas dans la tête du lecteur.
  const groupesDecisions = actionsGroupees(bDecisions)
    .filter((g) => !MOTIFS_ABSENCE.test(g.replace(/^\s*[-*]\s+/, "").slice(0, 40)))
    .filter((g) => /\(a\)/.test(g)); // sans option étiquetée, c'est S4 qui parle, pas S15
  if (!groupesDecisions.length) {
    ok("S15", "aucune décision à rappeler — bloc vide déclaré, ou choix fermé absent (S4)");
  } else {
    const chapeau = (g) => g.split("(a)")[0].replace(/^\s*[-*]\s+/, "").replace(/\*\*/g, "").trim();
    const fautifs = groupesDecisions.filter((g) => {
      const c = chapeau(g);
      const mots = c.split(/\s+/).filter(Boolean).length;
      return mots < 25 || ID_STABLE.test(c);
    });
    fautifs.length
      ? ko("S15", `${fautifs.length} décision(s) sur ${groupesDecisions.length} sans rappel de leur sujet — un identifiant ne désigne rien pour qui ne l'a pas écrit, ` +
          `et un titre court est une étiquette : avant les options, 25 mots au moins qui disent DE QUOI on parle, sans identifiant nu. ` +
          `Ex. : ${chapeau(fautifs[0]).replace(/\s+/g, " ").slice(0, 110)}`)
      : ok("S15", `${groupesDecisions.length} décision(s), chacune rappelant son sujet avant ses options`);
  }

  // ---- S16 (22/08) — une question dont la réponse est DANS les documents ne se pose pas nue ---
  //
  // Retour humain du 22/08, sur une décision qui demandait de nommer un rôle : « tu aurais dû
  // être en capacité de déduire son nom du dossier que j'ai fourni, pourquoi ne l'as-tu pas
  // fait ? Fais en sorte que les prochaines fois, ce genre de questions soit répondu par l'IA
  // automatiquement, au moins préconisé a minima. » Le nom était à la PREMIÈRE LIGNE du dossier.
  //
  // Poser une question dont la réponse est sous la main a un coût asymétrique : elle coûte une
  // seconde à l'agent et un aller-retour au lecteur, qui doit rouvrir un document que l'agent
  // avait déjà. C'est le même défaut que S13 et S15 corrigent ailleurs — faire payer au lecteur
  // un travail que l'agent pouvait faire — mais au bloc 3, il est le plus cher : il transforme
  // une lecture en arbitrage.
  //
  // « Dérivable » ne se teste pas à la machine. Ce qui se teste, c'est la TRACE d'avoir cherché :
  // chaque décision porte sa RECOMMANDATION, et soit un localisateur (le document consulté d'où
  // sort la réponse proposée), soit la déclaration explicite qu'aucune source disponible ne
  // répond. Une décision sans recommandation est une question rendue telle quelle ; une
  // recommandation sans source est une opinion.
  if (groupesDecisions.length) {
    const RECO = /\brecommand|\bpréconis|\bpreconis|\bproposition\b/i;
    const RIEN_NE_REPOND = /(aucune?\s+(source|document|pièce|piece)|rien\s+dans\s+les\s+documents|non\s+dérivable|non\s+derivable)/i;
    const fautifs16 = groupesDecisions.filter((g) => !RECO.test(g) || !(_LOCALISATEURS.test(g) || RIEN_NE_REPOND.test(g)));
    fautifs16.length
      ? ko("S16", `${fautifs16.length} décision(s) sur ${groupesDecisions.length} posée(s) sans trace d'instruction — chacune porte sa RECOMMANDATION, ` +
          `et soit la source consultée d'où elle sort, soit la déclaration qu'aucune source disponible ne répond. ` +
          `Une question dont la réponse est dans un document déjà fourni ne se pose pas : elle se répond.`)
      : ok("S16", `${groupesDecisions.length} décision(s), chacune recommandée et sourcée`);
  } else {
    ok("S16", "aucune décision à instruire");
  }

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
- Publier la version corrigée de la forge de tests ? Le banc rouge vient de tourner en entier :
  chaque défaut planté volontairement a été détecté, donc la surveillance fonctionne et la
  version est prête à sortir. Publier la rend visible aux autres projets ; ne pas publier la
  laisse sur ce poste, et personne d'autre n'en profite tant qu'on attend.
  - (a) taguer v1.12.0 maintenant — recommandé : le journal de recette \`recette-S01.md\` ne porte aucun défaut ouvert ;
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
  - si rien n'est fait : les corrections suivantes du corpus restent bloquées derrière celle-là.
- ensuite TF-0221 (manuelle_utilisateur) — décision normative, impact sur 19 citations.
  - pourquoi pas l'IA : acces — le portail de publication n'est pas ouvert à l'agent ;
  - où : écran « Publier la version », bouton \`Publier\`.
  - si rien n'est fait : les 19 citations continuent de pointer une version non publiée.
- enfin TF-0222 (auto_ia) — regrouper les constats par cause racine.
  - motif de non-exécution : dependance_bloc_3 — attend la décision de publication ci-dessus.
  - si rien n'est fait : les constats restent listés un par un, sans leur cause commune.
`;
  // Rouge : onze violations distinctes et indépendantes. Le bloc 8 porte DEUX tableaux de formes
  // différentes en plus des puces — c'est la forme réclamée par le lecteur le 22/08, et c'est
  // aussi celle qui rendait S11-S14 muettes avant TF-0508 : la fixture les tient désormais.
  const rouge = verte
    .replace(/## 8\. Prochaines actions[\s\S]*$/,
      "## 8. Prochaines actions\n" +
      "- d'abord regrouper les constats (auto_ia) — parce que c'est le plus rentable, préalable : ligne 8 (droit IAM).\n" +
      "- ensuite publier la version (manuelle_dev) — parce que tout est prouvé, il faut un UAMI.\n" +
      "\n| id | acteur | action |\n|---|---|---|\n| A1 | manuelle_utilisateur | ouvrir le portail |\n" +
      "\n| acteur | quoi |\n|---|---|\n| auto_ia | regrouper les constats |\n")
    .replace(/\n\nLe contrôle complet[\s\S]*?ci-dessous\./, "")  // S9 : plus d ouverture
    .replace("terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot.", "terminée aujourd'hui.")
    .replace("- Regroupement par cause racine : motif — sa cause est traitée, critère de réouverture écrit.", "- Regroupement par cause racine")
    .replace("Coût de la reprise proposée : complexité moyen · durée court.", "Coût de la reprise proposée : 2-3 j.")
    .replace("Recette S-01 TENU — 19/19 défauts détectés au banc rouge, pytest 365.", "Tout s'est bien passé.")
    .replace(/— recommandé[^;]*;/, "—")
    .replace(/- Publier la version corrigée[\s\S]*?tant qu'on attend\./, "- Publier TF-0220 ?");
  writeFileSync(join(dir, "verte.md"), verte, "utf8");
  writeFileSync(join(dir, "rouge.md"), rouge, "utf8");
  const moi = fileURLToPath(import.meta.url);
  const rv = spawnSync(process.execPath, [moi, join(dir, "verte.md")], { encoding: "utf8" });
  const rr = spawnSync(process.execPath, [moi, join(dir, "rouge.md")], { encoding: "utf8" });
  const casse = [];
  if (rv.status !== 0) casse.push("la fixture VERTE ne passe pas : " + rv.stdout);
  if (rr.status !== 1) casse.push("la fixture ROUGE ne FAIL pas");
  else {
    for (const regle of ["S2", "S3", "S5", "S9", "S10", "S11", "S12", "S13", "S14", "S15", "S16",
                         "S17", "S18", "S19", "S20"]) {
      if (!new RegExp(`"${regle}"[^}]*FAIL`).test(rr.stdout)) casse.push(`la rouge échoue mais pas sur ${regle}`);
    }
  }
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test restitution : 2/2 PASS (verte PASS ; rouge FAIL sur S2 horodatage, S3 verdict non factuel, S5 reste sans motif, S9 ouverture absente, S10 coût en jours, S11 auto_ia sans motif, S12 action humaine sans raison, S13 action humaine non exécutable, S14 action sans identifiant, S15 décision sans rappel de son sujet, S16 décision sans recommandation sourcée, S17 renvoi par position, S18 deux formes de tableau dans un bloc, S19 action sans conséquence, S20 jargon sans glose)");
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
  version: "1.2.0",
  cible: arg,
  verdict,
  findings,
  non_juge: [
    "la JUSTESSE du verdict, la pertinence d'un risque, la sincérité d'un motif — cet oracle tient la forme opposable, jamais le fond",
    "la longueur de prose (≤ 400 mots) n'est pas mesurée ici : séparer récit et énumération demande une lecture, pas un compteur",
    "la SINCÉRITÉ d'un motif S11/S12 : `hors_mandat` apposé sur une action que le mandat courant couvre contourne S11 au lieu de la satisfaire, et aucun oracle ne peut le voir — seul un lecteur le peut",
    "S18 ne juge que la cohérence INTRA-document : deux tableaux d'en-têtes différents dans un même bloc. La stabilité d'un TOUR AU SUIVANT — le vrai défaut mesuré le 22/08, cinq mises en page pour un même contenu — demanderait de conserver l'état du tour précédent ; elle est déclarée ici plutôt que faussement promise",
    "S19 n'exige PAS de recommandation sur une action, à la différence de S16 sur une décision : une action n'offre pas toujours un choix, et l'exiger partout produirait du remplissage. L'asymétrie est voulue",
    "S20 ne voit QUE les termes du référentiel `gabarits\\JARGON-A-GLOSER.json` : un jargon qui n'a encore coûté aucun aller-retour n'est pas détecté. C'est le prix assumé du zéro faux positif — dans ce corpus la MAJUSCULE sert l'emphase, et une heuristique sur les sigles crierait sur « MESURE » et « AUCUNE ». Le canal de croissance de la liste est le retour humain, pas la devinette",
    "S20 ne juge pas la JUSTESSE d'une glose : la présence d'une parenthèse après le terme, jamais qu'elle explique vraiment",
  ],
}, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
