#!/usr/bin/env node
/**
 * oracle-gabarits-documents — UN SQUELETTE QUI N'A JAMAIS ÉTÉ INSTANCIÉ N'A JAMAIS ÉTÉ ÉPROUVÉ.
 *
 * LE FAIT (24/08/2026, TF-0565). Les squelettes `gd-dossier-architecture` et `gd-dossier-exploitation`,
 * version 1.0.2 tous deux, posaient la classe `ch-apprend` sur 11 paragraphes de l'un et 8 de
 * l'autre SANS qu'aucune règle CSS ne la vise. `check_html` rendait FAIL sur L21 — composant
 * déclaré sans style — sur les deux fichiers, et depuis leur production. Le chapeau de chapitre se
 * rendait comme un paragraphe ordinaire, et rien à l'écran ne le signalait : un oracle de RENDU ne
 * voit rien tant que rien ne déborde. C'était la DEUXIÈME fois que ces mêmes squelettes livraient
 * un défaut que seule la production d'un vrai document révélait.
 *
 * CE QUE CET ORACLE MÉCANISE, et c'est le second geste de l'item — le premier, embarquer le style
 * de tout composant posé, est tenu par L21 du socle :
 *   G1 · toute famille de `gabarits\documents\` porte sa doctrine (GABARIT.md) et au moins une
 *        INSTANCE — la preuve qu'elle a été remplie une fois. Et LE FORMAT DU SQUELETTE DICTE CELUI
 *        DE L'INSTANCE : un SQUELETTE.html réclame une INSTANCE.html, un squelette Markdown une
 *        instance Markdown. L'oracle n'impose aucun format ; il vérifie qu'aucune forme posée ne
 *        reste sans preuve ;
 *   G2 · l'instance est REMPLIE : aucun marqueur de substitution DÉLIMITÉ (`{{…}}`, `[[…]]`,
 *        `[À REMPLIR]`) hors commentaires,
 *        et elle diffère de son squelette. Une instance qui recopie le squelette ne prouve rien ;
 *   G3 · squelette ET instance passent le contrôle de MARQUAGE du socle (`check_html.py`). C'est
 *        exactement le contrôle qui rendait FAIL depuis la production, et que personne ne jouait ;
 *   G11 · toute famille du CATALOGUE qui déclare produire du `html` porte son `point_de_depart` :
 *        son TYPE (`squelette` · `generateur` · `canevas` · `aucun`) et, sauf pour `aucun`, le
 *        CHEMIN qui le porte, vérifié sur disque. Née le 14/09/2026 d'une mesure qui s'est
 *        trompée : un balayage qui ne cherchait qu'un `SQUELETTE.html` comptait 17 familles sans
 *        point de départ alors qu'il y en a 14 — deux étaient servies par un générateur de
 *        `digit-ai-forge-audit`, une par les canevas d'un skill. *Un point de départ qui vit en
 *        prose dans un champ `sources` n'est trouvable par aucune requête, donc il n'existe pas
 *        pour la machine — et la question « cette famille a-t-elle de quoi démarrer » restait
 *        indécidable.* La règle ne juge pas la QUALITÉ du point de départ, seulement qu'il soit
 *        déclaré et qu'il existe là où il est dit ;
 *   G12 · toute famille SANS point de départ dit ce qui l'EMPÊCHE, dans un vocabulaire fermé
 *        (`poste-porteur` · `arbitrage` · `reclassement` · `aucun`), et un `poste-porteur` dit OÙ
 *        vivent ses sources. Née le 15/09/2026 de la décision humaine D-11 (b). *Sans elle, une
 *        DÉPENDANCE D'ENVIRONNEMENT — les sources existent, elles ne sont pas sur ce poste — se lit
 *        exactement comme une DETTE DE TRAVAIL, et le compte des familles démunies envoie le
 *        travail au mauvais endroit.* La règle rend AUSSI la répartition à chaque passage : c'est
 *        la mesure que la décision demandait, et une classification qui ne se compte pas ne se
 *        pilote pas. Elle ne juge pas la SINCÉRITÉ d'un empêchement — un `poste-porteur` apposé
 *        sur une famille que ce poste pourrait servir la satisfait, et seul un lecteur le voit ;
 *   G4 · le document REND son gabarit et sa version (`Gabarit : gd-… · version du gabarit x.y.z`),
 *        visiblement — jamais seulement en commentaire. Une instance périmée est invisible sur
 *        l'artefact, et la section R-46 des lots devient impossible à remplir sans lui (TF-0690).
 *   G7 · les sections que le CATALOGUE déclare obligatoires pour une famille (`sections_obligatoires`)
 *        sont présentes comme titres de sa doctrine (TF-1170). La règle ne juge que ce qu'une
 *        famille a DÉCLARÉ : une famille sans déclaration n'est jamais accusée ;
 *   G5 · la largeur de contenu est une propriété de la PAGE (règle D10, TF-1038) : un document
 *        qui porte des chapitres `.chap` déclare `data-largeur="lecture|donnees"` sur `<body>` ou
 *        `<main>`, et ses chapitres tiennent la déclaration (`.lire` partout en lecture, nulle part
 *        en données), sauf un chapitre marqué `largeur-exception`. Jugé sur le MARQUAGE : la
 *        largeur rendue reste au socle de rendu, et ce contrôle ne la prétend pas mesurée.
 *
 * CE QU'IL NE FAIT PAS : rendre la page. Le rendu a son propre contrôle — `scripts\verifier-rendu-
 * instances.mjs` — et le dupliquer créerait deux vérités sur les familles bloquantes. Il ne juge
 * pas non plus la JUSTESSE du contenu d'une instance : un texte d'exemple faux est un défaut de
 * relecture, pas de marquage, et aucun oracle ne le verra.
 *
 * SKIP MOTIVÉ, JAMAIS PASS SILENCIEUX : sans python ni socle, l'oracle dit qu'il n'a pas tourné.
 *
 *   node oracles\oracle-gabarits-documents.mjs             → jugement du parc
 *   node oracles\oracle-gabarits-documents.mjs --self-test → double sens sur des familles fabriquées
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Cet oracle n'a AUCUN chemin « je ne peux pas
// mesurer » : il ne depend d'aucun outil externe et lit des fichiers du depot. Le declarer
// vaut mieux que de le taire — un contrat muet laisse croire qu'un 1 peut etre une panne
// d'environnement (TF-0648).
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cheminSkillsInstalles } from "../scripts/lib-config-installee.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

const CANDIDATS_SOCLE = [
  join(cheminSkillsInstalles(), "digit-ai-page-html", "scripts", "check_html.py"),
  join(PILOT, "..", "digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", "check_html.py"),
];
const SOCLE = CANDIDATS_SOCLE.find(existsSync) || null;
const PYTHON = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});

/**
 * Les restes de substitution qui trahissent une instance jamais remplie — et ILS SONT DÉLIMITÉS.
 *
 * Première version de cette liste, le 24/08 : elle contenait `/\bà remplir\b/i` nu. L'oracle a
 * rendu DEUX FAUX POSITIFS sur le parc en moins d'une minute, sur la phrase « emplacement nommé,
 * prêt à remplir » — de la prose, dans un commentaire, qui DÉCRIT un emplacement voulu (TF-0524).
 * Un marqueur de substitution se reconnaît à ses délimiteurs, jamais à ses mots : `{{x}}`, `[[x]]`,
 * `[À REMPLIR]`, `<À REMPLIR>`. Chercher les mots, c'est accuser la documentation de son propre
 * sujet — et c'est le défaut que je venais de corriger ailleurs le même jour.
 */
const RESTES = [
  /\{\{[^}]{1,80}\}\}/,                       // {{cle.de.substitution}}
  /\[\[[^\]]{1,80}\]\]/,                      // [[cle]]
  /[[<«]\s*(?:À|A) REMPLIR[^\]>»]{0,40}[\]>»]/i, // [À REMPLIR], <à remplir : …>
  /[[<]\s*TODO[^\]>]{0,60}[\]>]/i,            // [TODO …]
  /\bLOREM IPSUM\b/i,
];

/** Le texte hors commentaires HTML : un marqueur laissé dans un commentaire ne se rend pas. */
const sansCommentaires = (html) => html.replace(/<!--[\s\S]*?-->/g, " ");

function marquage(fichier) {
  if (!SOCLE || !PYTHON) return { skip: true };
  const r = spawnSync(PYTHON, ["-X", "utf8", SOCLE, fichier], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const sortie = (r.stdout || "") + (r.stderr || "");
  const m = /^Verdict\s*:\s*(\w+)/m.exec(sortie);
  return { verdict: m ? m[1] : "ILLISIBLE", detail: sortie.split("\n").filter((l) => /^\s+\[/.test(l)).slice(0, 3).join(" · ") };
}

// ---- G8 (TF-1076, 16/09/2026) — UN LIVRABLE ÉCRIT SANS FAMILLE AU CATALOGUE ------------------
//
// LE FAIT, et il est au tableau de bord des récidives : la classe `gabarit-famille-manquante`
// compte 13 items, 1 fondateur et 13 RÉCIDIVES — un taux de 100 %, chez quatre produits. *Une
// classe dont chaque retour est une récidive dit que la correction ne redescend pas au moment où
// le livrable s'écrit.* La cause tenait en une ligne du référentiel : la classe déclarait son
// oracle — « oracle-gabarits-documents G8 » — et cette règle N'EXISTAIT PAS. Le catalogue n'était
// interrogeable que par un lecteur humain qui savait déjà qu'il existait.
//
// CE QUE LA RÈGLE FAIT, ET CE QU'ELLE NE FAIT PAS. Elle ne classe pas un document par son contenu
// — indécidable à la machine, et une devinette ferait crier l'oracle sur du travail juste. Elle
// lit le NOM, que R-4 rend porteur : « <Marque> - <Objet> - AAAAMMJJ<indice>.<ext> », où l'Objet
// s'ouvre sur le type du document. Le catalogue déclare, famille par famille, les types de nom
// qu'elle couvre (`types_de_nom`, v1.2.0), et la résolution essaie le préfixe le plus LONG d'abord
// pour que « synthese executive » ne retombe pas sur « synthese ».
//
// ELLE AVERTIT LÀ OÙ ELLE EST JOUÉE À L'ÉCRITURE et n'échoue que sur appel explicite : un livrable
// se construit en plusieurs écritures, et bloquer au caractère près apprendrait à désactiver le
// hook (leçon N4). Ce qu'elle apporte est ailleurs — le producteur rencontre la question de la
// famille AU MOMENT où il nomme son fichier, et non au retour humain suivant.
const CATALOGUE = join(PILOT, "gabarits", "documents", "catalogue.jsonl");

/** Les lignes du catalogue, méta comprise. Absent ou illisible : liste vide, dite par l'appelant. */
export function lireCatalogue(chemin = CATALOGUE) {
  try {
    return readFileSync(chemin, "utf8").trim().split(/\r?\n/).filter(Boolean)
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

const NORMALISER = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Le champ <Objet> d'un nom R-4, ou le radical entier quand le nom ne suit pas la forme. */
export function objetDuNom(nomFichier) {
  const base = String(nomFichier).replace(/\.[a-z0-9]+$/i, "");
  const parts = base.split(" - ");
  // « <Marque> - <Objet> - AAAAMMJJ<indice> » : l'Objet est au milieu, le dernier champ est daté.
  if (parts.length >= 3 && /^\d{8}[a-z]?$/i.test(parts[parts.length - 1].trim())) {
    return parts.slice(1, -1).join(" ");
  }
  // Forme datée en tête, réservée aux études : « AAAAMMJJ-objet-en-tirets ».
  const date = /^(\d{8})[-_](.+)$/.exec(base);
  if (date) return date[2];
  return base;
}

/**
 * Résout la famille d'un livrable par son nom. Rend `{ resolue, famille, cle, candidats }`.
 * `catalogue` : les lignes de `gabarits\documents\catalogue.jsonl`, méta comprise.
 */
export function resoudreFamille(nomFichier, catalogue) {
  const index = new Map();
  for (const f of catalogue) {
    for (const t of f.types_de_nom || []) index.set(NORMALISER(t), f);
  }
  const mots = NORMALISER(objetDuNom(nomFichier)).split(" ").filter(Boolean);
  for (let n = Math.min(4, mots.length); n >= 1; n--) {
    const cle = mots.slice(0, n).join(" ");
    if (index.has(cle)) {
      const f = index.get(cle);
      return { resolue: true, famille: f.famille, id: f.id, statut: f.statut, cle, candidats: [] };
    }
  }
  // Rien ne résout : on rend les clés les plus PROCHES, parce qu'un refus qui ne propose rien
  // pousse à écrire son propre gabarit — la classe voisine, `oracle-remplace-par-controle-maison`.
  const premier = mots[0] || "";
  const proches = [...index.keys()].filter((k) => k.startsWith(premier.slice(0, 4)) || premier.startsWith(k.split(" ")[0]));
  return { resolue: false, famille: null, cle: mots.slice(0, 2).join(" "), candidats: proches.slice(0, 5) };
}

// ---- G9 (16/09/2026, TF-0923 volet 3) — UNE PROPOSITION REMISE À UN HUMAIN PORTE SA PAGE ------
//
// LA DOCTRINE ÉTAIT ÉCRITE ET JOUÉE PAR PERSONNE. `references\RUN-MANDAT.md` pas 5 et
// `references\RUN-CONSEIL.md` C5 disent depuis le 07/09/2026 (TF-0895) que toute proposition
// remise à un humain se remet AUSSI en page autoportante, sauf écart déclaré au ledger. Le retour
// fondateur est une phrase du destinataire : « aucun fichier HTML n'a été généré […] il doit faire
// partie intégrante de la proposition ». Quatre mois de doctrine, zéro contrôle.
//
// LA PORTÉE A ÉTÉ TRANCHÉE PAR UNE DÉCISION HUMAINE, et elle méritait de l'être. En préparant la
// règle, la mesure a rendu CINQ études d'opportunité postérieures à la doctrine, toutes sans page :
// soit la doctrine n'était pas appliquée, soit elle ne visait pas les études. La question a été
// posée plutôt que tranchée seul — *une règle écrite sur une lecture contestée accuse du travail
// juste* —, et la réponse du 16/09 retient la première lecture : une étude d'opportunité nomme son
// audience en tête, « le pilote de l'écosystème, qui décide des mandats ». Un document dont le
// lecteur nommé est celui qui décide EST remis à un humain, quel que soit le mot de son titre.
//
// L'ANTÉRIORITÉ EST DÉCLARÉE, JAMAIS RATTRAPÉE EN SILENCE : un livrable daté d'avant l'entrée de
// la doctrine rend SANS_OBJET. La règle 5 interdit de réécrire l'existant, et une règle qui
// accuserait quarante-sept documents le jour de sa naissance se ferait désactiver le lendemain.
const ROLES_PAGE_DUE = /^(proposition|trajectoire|etude|conseil)\b/i;
const ENTREE_DOCTRINE = "20260907";   // TF-0895 — jour où la règle est devenue opposable

/** G9 sur UN livrable Markdown : `{ regle, statut, ou, message }`. */
export function jugerPageHomonyme(chemin, { existe = null, depuis = ENTREE_DOCTRINE } = {}) {
  const nom = String(chemin).replace(/^.*[\\/]/, "");
  if (!/\.md$/i.test(nom) || /^(README|LISEZMOI)\.md$/i.test(nom)) {
    return { regle: "G9", statut: "SKIP", ou: nom, message: "ce n'est pas un livrable Markdown — la question ne se pose pas" };
  }
  const objet = objetDuNom(nom);
  const sansAccent = String(objet).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (!ROLES_PAGE_DUE.test(sansAccent)) {
    return { regle: "G9", statut: "SKIP", ou: nom,
      message: `rôle « ${sansAccent.split(" ")[0] || "?"} » — la page n'est due qu'aux propositions, trajectoires, études et conseils remis à un humain` };
  }
  const date = (/(\d{8})/.exec(nom) || [])[1];
  if (!date || date < depuis) {
    return { regle: "G9", statut: "SANS_OBJET", ou: nom,
      message: `livrable antérieur au ${depuis} — la doctrine de la page homonyme lui est postérieure, et la règle 5 interdit de réécrire l'existant (antériorité DÉCLARÉE, jamais rattrapée en silence)` };
  }
  const cible = String(chemin).replace(/\.md$/i, ".html");
  const present = existe === null ? existsSync(cible) : existe;
  return present
    ? { regle: "G9", statut: "PASS", ou: nom, message: "la page homonyme est là, à côté de sa source" }
    : { regle: "G9", statut: "FAIL", ou: nom,
        message: "aucune page homonyme — une proposition remise à un humain se remet AUSSI en page autoportante " +
          "(RUN-MANDAT.md pas 5, RUN-CONSEIL.md C5, socle digit-ai-page-html, R-32). " +
          "La produire : `node scripts\\generer-page-etude.mjs <ce fichier>` ; l'écart se déclare au ledger avec son motif." };
}

/** G8 sur UN livrable : `{ regle, statut, ou, message }`. */
export function jugerLivrable(chemin, catalogue) {
  const nom = String(chemin).replace(/^.*[\\/]/, "");
  const r = resoudreFamille(nom, catalogue);
  if (r.resolue) {
    return { regle: "G8", statut: "PASS", ou: nom,
      message: `famille « ${r.famille} » (${r.id}, statut ${r.statut}) résolue sur « ${r.cle} »` };
  }
  return { regle: "G8", statut: "FAIL", ou: nom,
    message: `aucune famille du catalogue ne couvre « ${r.cle || nom} » — un type de document produit sans famille, ` +
      "c'est un gabarit réinventé à chaque livrable et une forme qu'aucun oracle ne juge. " +
      (r.candidats.length ? `Clés proches : ${r.candidats.join(", ")}. ` : "") +
      "Déclarer la famille dans `gabarits\\documents\\catalogue.jsonl` (champ `types_de_nom`), " +
      "ou renommer le livrable avec le type d'une famille existante."};
}

// ---- G6 (TF-1097, 20/09/2026) — LA CONCEPTION SE JUGE AVANT L'ÉCRITURE, PUIS LE DOCUMENT LA TIENT
//
// LE CHIFFRE QUI FONDE LA RÈGLE. Le rétro-test du 14/09/2026 a classé 20 griefs réels de lecteurs :
// 11 auraient été évités par une conception fixée AVANT l'écriture, et par elle seule ; 2 par un
// oracle existant qu'on aurait joué, 2 par les deux, 5 par rien. Le seuil fixé d'avance était de 6.
// Les 11 se groupent en trois causes que cette règle vise une à une : un document sans famille ni
// conception préalable, un vocabulaire du lecteur non fixé, un format non dérivé du volume.
//
// RÉSERVE DE L'ÉTUDE, REPRISE ET NON TUE : les 20 griefs ont été choisis et classés par une SEULE
// session, sans jugement à l'aveugle ni second classeur ; revue fixée au 2026-10-14. La règle ne
// prétend donc rien au-delà — elle rend la conception EXPLICITE et JUGEABLE, elle ne promet pas
// moins de retours.
//
// POURQUOI UN MODE SUR APPEL, ET PAS UNE RÈGLE DU PARC. Une fiche est par DOCUMENT, jamais par
// famille : il n'y a rien à balayer dans `gabarits\documents\`. Taux d'accusation du corpus existant
// MESURÉ avant de choisir la sévérité : 0 — aucun document du parc ne porte de fiche, et la règle
// n'en exige d'aucun. Elle est donc BLOQUANTE sur ce qu'on lui soumet, sans accuser personne
// rétroactivement ; la règle 5 interdit de réécrire l'existant, et G9 a déjà payé cette leçon.
//
// CE QU'ELLE NE JUGE PAS, et la frontière est écrite au gabarit : la JUSTESSE du lecteur défini, la
// PERTINENCE d'une intention, le BON choix d'un type de contenu, la qualité de la prose. Un oracle
// mesure une présence, jamais une valeur.
const TYPES_CONTENU = ["concept", "tache", "procedure", "processus", "principe", "fait",
  "structure", "classification", "reference"];

/** Un champ resté à l'état d'emplacement (`{…}`) ou vide n'est pas rempli. */
const champVide = (v) => !v || !v.trim() || /^\{.*\}$/.test(v.trim()) || /^[….-]+$/.test(v.trim());

/** La valeur d'un champ `cle: valeur` du corps de la fiche, première occurrence. */
const champ = (texte, cle) => {
  const m = new RegExp(`^\\s*${cle}\\s*:\\s*(.+?)\\s*$`, "im").exec(texte);
  return m ? m[1] : null;
};

/** Les parties déclarées : chaque bloc ouvert par `- titre:`. */
export function partiesDeLaFiche(texte) {
  const morceaux = texte.split(/^[ \t]*-[ \t]*titre[ \t]*:/im).slice(1);
  return morceaux.map((bloc, i) => {
    const titre = (bloc.split(/\r?\n/)[0] || "").trim();
    return { rang: i + 1, titre, intention: champ(bloc, "intention"), type: champ(bloc, "type_de_contenu") };
  });
}

/**
 * G6 sur UNE fiche de conception, et — si un document est fourni — sur le fait qu'il la TIENT.
 * Rend un tableau de findings `{ regle, statut, ou, message }`.
 */
export function jugerFiche(cheminFiche, cheminDocument = null) {
  const f = [];
  const nom = String(cheminFiche).replace(/^.*[\\/]/, "");
  let texte;
  try { texte = sansCommentaires(readFileSync(cheminFiche, "utf8")); }
  catch {
    return [{ regle: "G6", statut: "FAIL", ou: nom, message:
      `fiche de conception illisible ou absente : ${cheminFiche}. Le gabarit vit à ` +
      "`gabarits\\documents\\FICHE-CONCEPTION.md` ; la fiche se remplit AVANT d'écrire le document" }];
  }
  const ok = (m) => f.push({ regle: "G6", statut: "PASS", ou: nom, message: m });
  const ko = (m) => f.push({ regle: "G6", statut: "FAIL", ou: nom, message: m });

  // 1 · la famille. « aucune » est une réponse ADMISE, à condition d'être assumée : la classe
  // gabarit-famille-manquante récidive à 13 sur 13 parce que ce signal était avalé en silence.
  const famille = champ(texte, "famille");
  if (champVide(famille)) {
    ko("aucune `famille` déclarée — un document écrit sans famille est un gabarit réinventé, et la " +
      "classe `gabarit-famille-manquante` récidive dans 13 cas sur 13. Déclarer l'id du catalogue, " +
      "ou `famille: aucune — candidature remontée` et remonter le candidat au registre");
  } else ok(`famille déclarée : « ${famille} »`);

  // 2 · le lecteur, par ses DÉCISIONS. Les quatre champs sont dus : deux griefs du rétro-test
  // (18 et 20) viennent d'un vocabulaire non fixé avant l'écriture.
  const CHAMPS_LECTEUR = ["decisions_attendues", "savoir_prealable", "vocabulaire_absent", "contexte_de_lecture"];
  const manquants = CHAMPS_LECTEUR.filter((c) => champVide(champ(texte, c)));
  if (manquants.length) {
    ko(`lecteur incomplet — champ(s) non rempli(s) : ${manquants.join(", ")}. Le lecteur se définit ` +
      "par ce qu'il doit DÉCIDER, ce qu'il sait déjà, les mots de notre métier qu'il n'a pas, et son " +
      "contexte de lecture — jamais par un personnage (un rôle incarné ne fait pas trouver plus de défauts)");
  } else ok("lecteur défini par ses décisions, son savoir, son vocabulaire absent et son contexte");

  // 3 · les parties : une intention et un TYPE DE CONTENU du vocabulaire fermé, par partie.
  const parties = partiesDeLaFiche(texte);
  if (!parties.length) {
    ko("aucune partie déclarée (`- titre:`) — sans parties, il n'y a pas de conception, seulement un titre");
  } else {
    const ecarts = [];
    for (const p of parties) {
      const ou = `partie ${p.rang} « ${(p.titre || "?").slice(0, 40)} »`;
      if (champVide(p.titre)) ecarts.push(`${ou} : titre non rempli`);
      if (champVide(p.intention)) ecarts.push(`${ou} : pas d'\`intention\` — la question du lecteur à laquelle elle répond`);
      else {
        // D8 : « un chapitre qui ne peut pas l'écrire sans paraphraser son titre se supprime ».
        const ti = NORMALISER(p.titre || ""), it = NORMALISER(p.intention);
        if (it === ti || (ti && it.replace(/\s/g, "").includes(ti.replace(/\s/g, "")) && it.split(" ").length <= ti.split(" ").length + 2)) {
          ecarts.push(`${ou} : l'intention PARAPHRASE le titre — règle D8, une partie qui ne peut pas dire ` +
            "ce qu'elle apprend au lecteur autrement qu'en répétant son titre se supprime");
        } else if (it.split(" ").filter(Boolean).length < 5) {
          ecarts.push(`${ou} : intention en ${it.split(" ").filter(Boolean).length} mot(s) — au moins 5, ` +
            "et elle dit ce que le lecteur en TIRE, pas ce que la partie contient");
        }
      }
      const t = NORMALISER(p.type || "");
      if (champVide(p.type)) ecarts.push(`${ou} : pas de \`type_de_contenu\``);
      else if (!TYPES_CONTENU.includes(t)) {
        ecarts.push(`${ou} : type_de_contenu « ${p.type} » hors du vocabulaire FERMÉ ` +
          `(${TYPES_CONTENU.join(", ")}) — un vocabulaire ouvert laisse écrire « présentation » ou ` +
          "« contexte », qui ne commandent aucune forme, et c'est la forme que le type doit dériver");
      }
    }
    if (ecarts.length) ko(`${parties.length} partie(s) déclarée(s), ${ecarts.length} écart(s) : ${ecarts.join(" · ")}`);
    else ok(`${parties.length} partie(s), chacune avec son intention et son type de contenu du vocabulaire fermé`);
  }

  // 4 · le format, DÉRIVÉ : quatre griefs du rétro-test (2, 10, 11, 12) viennent d'un format
  // choisi par habitude plutôt que dérivé du volume et du contexte de lecture.
  const fmt = champ(texte, "format"), just = champ(texte, "justification");
  if (champVide(fmt) || champVide(just)) {
    ko(`format non dérivé — ${champVide(fmt) ? "`format` absent" : "`justification` absente"}. Le format ` +
      "se DÉRIVE du volume attendu et du contexte de lecture, il ne se choisit pas par habitude : " +
      "quatre des vingt griefs du rétro-test du 14/09 viennent exactement de là");
  } else ok(`format « ${fmt} », justifié`);

  // 5 · l'enjeu et sa validation humaine. « L'IA fait, l'humain décide » : la voie automatisée est
  // le défaut, et c'est l'intervention humaine qui se justifie — jamais l'inverse (loi n° 5, R-29).
  const enjeu = NORMALISER(champ(texte, "enjeu") || "");
  if (!["fort", "ordinaire"].includes(enjeu)) {
    ko(`\`enjeu\` absent ou hors vocabulaire (« fort » ou « ordinaire ») — le critère est écrit au ` +
      "§ 6 du gabarit et ne se négocie pas au cas par cas");
  } else if (enjeu === "fort") {
    const par = champ(texte, "valide_par");
    if (champVide(par) || /sans objet/i.test(par)) {
      ko("fiche à enjeu FORT sans `valide_par` — un document qui sort de l'écosystème, fonde une " +
        "décision engageante, porte des chiffres opposables, inaugure une famille neuve ou traîne un " +
        "retour non soldé se conçoit sous validation humaine AVANT écriture (R-29 : les gates restent humains)");
    } else ok(`enjeu fort, validé par « ${par} »`);
  } else ok("enjeu ordinaire — la fiche reste due, c'est la validation humaine qui ne l'est pas");

  // 6 · LE DOCUMENT TIENT-IL SA FICHE ? Second temps de la règle, et c'est lui qui empêche la fiche
  // d'être un rite : une conception qu'on n'exécute pas coûte sans rien rendre.
  if (cheminDocument) {
    const nomDoc = String(cheminDocument).replace(/^.*[\\/]/, "");
    let doc;
    try { doc = sansCommentaires(readFileSync(cheminDocument, "utf8")); }
    catch {
      f.push({ regle: "G6", statut: "FAIL", ou: nomDoc, message: `document illisible ou absent : ${cheminDocument}` });
      return f;
    }
    const titres = [...doc.matchAll(/^\s{0,3}#{1,6}\s+(.+?)\s*$/gm)].map((m) => NORMALISER(m[1]));
    const absentes = parties.filter((p) => p.titre && !champVide(p.titre))
      .filter((p) => !titres.some((t) => t.includes(NORMALISER(p.titre)) || NORMALISER(p.titre).includes(t)));
    f.push(absentes.length
      ? { regle: "G6", statut: "FAIL", ou: nomDoc, message:
          `le document NE TIENT PAS sa fiche : ${absentes.length} partie(s) conçue(s) et absente(s) du ` +
          `document — ${absentes.map((p) => `« ${p.titre} »`).join(", ")}. Une conception qu'on n'exécute ` +
          "pas coûte sans rien rendre ; soit la partie s'écrit, soit la fiche se corrige AVANT, jamais après" }
      : { regle: "G6", statut: "PASS", ou: nomDoc, message:
          `le document tient sa fiche : les ${parties.length} partie(s) conçue(s) s'y retrouvent` });
  }
  return f;
}

const TYPES_DEPART = new Set(["squelette", "generateur", "canevas", "aucun"]);

// G12 — vocabulaire FERMÉ des empêchements. Un ensemble ouvert produirait autant de motifs que de
// rédacteurs, et la répartition ne se compterait plus.
const EMPECHEMENTS = new Set(["poste-porteur", "arbitrage", "reclassement", "aucun"]);

/**
 * G11 — LE POINT DE DÉPART D'UNE FAMILLE SE DÉCLARE, ET SON CHEMIN EXISTE.
 *
 * Pourquoi le chemin est VÉRIFIÉ et pas seulement exigé : une déclaration qu'on ne teste pas est
 * une affirmation, et c'est exactement ce que le champ `sources` était déjà — de la prose vraie le
 * jour où elle a été écrite. Le test d'existence est ce qui fait la différence entre un champ et
 * un commentaire.
 *
 * Pourquoi un SKIP et pas un FAIL quand le dépôt porteur est absent : un contrôle qui échoue sur
 * ce que le poste ne peut pas réparer apprend à être contourné. Un point de départ porté par un
 * dépôt frère absent est DÉCLARÉ non mesuré, jamais supposé bon.
 */
export function jugerCatalogue(chemin, racineParc) {
  const findings = [];
  if (!existsSync(chemin)) {
    findings.push({ regle: "G11", statut: "SKIP", ou: chemin, message: "catalogue introuvable — le contrôle n'a PAS tourné" });
    return findings;
  }
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  let familles;
  try { familles = lignes.slice(1).map((l) => JSON.parse(l)); }
  catch (e) { findings.push({ regle: "G11", statut: "FAIL", ou: chemin, message: `ligne de catalogue illisible : ${e.message}` }); return findings; }

  const html = familles.filter((f) => (f.formats || []).includes("html"));
  if (!html.length) { findings.push({ regle: "G11", statut: "SKIP", ou: chemin, message: "aucune famille ne déclare produire du html" }); return findings; }

  for (const f of html) {
    const ou = `catalogue/${f.famille}`;
    const d = f.point_de_depart;
    if (!d || typeof d !== "object") {
      findings.push({ regle: "G11", statut: "FAIL", ou, message:
        "aucun `point_de_depart` déclaré — la question « cette famille a-t-elle de quoi démarrer » " +
        "reste indécidable à la machine, et un balayage la tranchera de travers" });
      continue;
    }
    if (!TYPES_DEPART.has(d.type)) {
      findings.push({ regle: "G11", statut: "FAIL", ou, message:
        `type de point de départ inconnu : « ${d.type} » — attendus : ${[...TYPES_DEPART].join(", ")}` });
      continue;
    }
    if (d.type === "aucun") {
      d.chemin
        ? findings.push({ regle: "G11", statut: "FAIL", ou, message:
            `type « aucun » ET un chemin (« ${d.chemin} ») : la déclaration se contredit, l'un des deux est faux` })
        : findings.push({ regle: "G11", statut: "PASS", ou, message: "aucun point de départ — déclaré, donc comptable" });
      // G12 — CE QUI EMPÊCHE se déclare, dans un vocabulaire fermé. Sans lui, une dépendance
      // d'environnement (les sources existent, elles sont ailleurs) se lit comme une dette de
      // travail (personne ne l'a fait) : deux choses qui ne se traitent pas au même endroit,
      // et un compte qui les mélange envoie le travail au mauvais poste.
      if (!EMPECHEMENTS.has(d.empechement)) {
        findings.push({ regle: "G12", statut: "FAIL", ou, message:
          `famille sans point de départ et sans \`empechement\` reconnu (« ${d.empechement} ») — ` +
          `attendus : ${[...EMPECHEMENTS].join(", ")}. Un « aucun » non classé mélange la dette de ` +
          `travail et la dépendance d'environnement` });
      } else if (d.empechement === "poste-porteur" && !(d.sources_attendues_sur || "").trim()) {
        findings.push({ regle: "G12", statut: "FAIL", ou, message:
          "empêchement « poste-porteur » sans `sources_attendues_sur` — dire que les sources sont " +
          "ailleurs sans dire OÙ ne permet à personne d'aller les chercher" });
      } else {
        findings.push({ regle: "G12", statut: "PASS", ou, message:
          `empêchement « ${d.empechement} » déclaré${d.sources_attendues_sur ? ` — sources sur : ${d.sources_attendues_sur}` : ""}` });
      }
      continue;
    }
    if (!d.chemin) {
      findings.push({ regle: "G11", statut: "FAIL", ou, message:
        `type « ${d.type} » sans chemin — un point de départ qu'on ne peut pas ouvrir n'en est pas un` });
      continue;
    }
    // CONVENTION DE CHEMIN, écrite ici parce qu'elle a mordu à son premier passage : un chemin
    // est relatif à la RACINE DU PARC et son premier segment nomme son porteur — un dépôt
    // (`digit-ai-factory/…`, `digit-ai-forge-audit/…`) ou le préfixe `skills/` pour un skill
    // installé, dont l'emplacement varie d'un poste à l'autre. Les trois squelettes du pilot
    // avaient été déclarés en chemin relatif au PILOT et la règle les a rendus introuvables :
    // c'est le sens rouge joué sur pièce, et la raison pour laquelle la convention est écrite.
    const versSkills = d.chemin.startsWith("skills/");
    const porteur = versSkills ? cheminSkillsInstalles() : join(racineParc, d.chemin.split("/")[0]);
    const cible = versSkills
      ? join(cheminSkillsInstalles(), d.chemin.slice("skills/".length))
      : join(racineParc, d.chemin);
    if (existsSync(cible)) {
      findings.push({ regle: "G11", statut: "PASS", ou, message: `point de départ « ${d.type} » vérifié : ${d.chemin}` });
    } else if (!existsSync(porteur)) {
      findings.push({ regle: "G11", statut: "SKIP", ou, message:
        `point de départ porté par « ${d.chemin.split("/")[0]} », absent de ce poste — le contrôle n'a PAS tourné` });
    } else {
      findings.push({ regle: "G11", statut: "FAIL", ou, message:
        `point de départ déclaré et INTROUVABLE : ${d.chemin} — une déclaration non vérifiée est une affirmation` });
    }
  }

  // G12, second sens — la RÉPARTITION, rendue à chaque passage. Une classification qui ne se
  // compte pas ne se pilote pas : le nombre de familles démunies ne dit rien tant qu'il mélange
  // ce qui attend un poste et ce que personne n'a fait.
  const nus = html.filter((f) => (f.point_de_depart || {}).type === "aucun");
  const par = {};
  for (const f of nus) { const e = f.point_de_depart.empechement || "non classé"; par[e] = (par[e] || 0) + 1; }
  const environnement = par["poste-porteur"] || 0;
  const travail = (par["aucun"] || 0) + (par["reclassement"] || 0) + (par["arbitrage"] || 0);
  findings.push({ regle: "G12", statut: "PASS", ou: chemin, message:
    `couverture : ${html.length - nus.length} famille(s) html outillée(s), ${nus.length} sans point de départ — ` +
    `dont ${environnement} dépendance(s) d'environnement et ${travail} dette(s) de travail` +
    (nus.length ? ` (${Object.entries(par).map(([k, v]) => `${k}: ${v}`).join(", ")})` : "") });

  return findings;
}

export function juger(dossier, catalogue = lireCatalogue()) {
  const findings = [];
  const familles = existsSync(dossier)
    ? readdirSync(dossier, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
    : [];
  for (const fam of familles) {
    const p = (n) => join(dossier, fam, n);
    // LE FORMAT DU SQUELETTE DICTE CELUI DE L'INSTANCE, et l'oracle n'impose aucun format. La
    // famille `diagnostic-exploitation` vit en Markdown — GABARIT.md + INSTANCE.md, aucun HTML :
    // exiger d'elle un SQUELETTE.html serait imposer une forme au nom d'un contrôle, et le
    // premier passage de cet oracle sur le parc a rendu exactement ce faux positif.
    const fichiers = readdirSync(join(dossier, fam));
    const formes = ["html", "md"].filter((ext) => fichiers.includes(`SQUELETTE.${ext}`));
    const instances = ["html", "md"].filter((ext) => fichiers.includes(`INSTANCE.${ext}`));
    const manquantes = [];
    if (!fichiers.includes("GABARIT.md")) manquantes.push("GABARIT.md");
    if (!instances.length) manquantes.push("INSTANCE.<html|md>");
    for (const ext of formes) if (!instances.includes(ext)) manquantes.push(`INSTANCE.${ext} (le squelette est en .${ext})`);
    if (manquantes.length) {
      findings.push({ regle: "G1", statut: "FAIL", ou: fam, message:
        `pièce(s) manquante(s) : ${manquantes.join(", ")}. Un squelette sans instance n'a jamais été ` +
        "éprouvé — et son absence se lit comme un vert, ce qui est le pire des états" });
      continue;
    }
    findings.push({ regle: "G1", statut: "PASS", ou: fam, message:
      `doctrine + instance(s) .${instances.join(", .")}` + (formes.length ? ` face au squelette .${formes.join(", .")}` : " (famille sans squelette)") });

    const ext = instances[0];
    const inst = sansCommentaires(readFileSync(p(`INSTANCE.${ext}`), "utf8"));
    const squel = formes.includes(ext) ? readFileSync(p(`SQUELETTE.${ext}`), "utf8") : null;
    const reste = RESTES.map((re) => re.exec(inst)).find(Boolean);
    if (reste) {
      findings.push({ regle: "G2", statut: "FAIL", ou: fam, message:
        `l'instance porte un reste de substitution (« ${reste[0].slice(0, 40)} ») — elle n'a pas été ` +
        "remplie, donc elle ne prouve rien du squelette" });
    } else if (squel !== null && inst.trim() === sansCommentaires(squel).trim()) {
      findings.push({ regle: "G2", statut: "FAIL", ou: fam, message:
        "l'instance est la copie exacte du squelette : instancier, c'est REMPLIR, sinon le contrôle " +
        "se joue deux fois sur le même fichier et l'on croit avoir doublé la preuve" });
    } else {
      findings.push({ regle: "G2", statut: "PASS", ou: fam, message: "instance remplie, sans reste de substitution" });
    }

    for (const n of ["SQUELETTE.html", "INSTANCE.html"].filter((f) => fichiers.includes(f))) {
      const r = marquage(p(n));
      if (r.skip) {
        findings.push({ regle: "G3", statut: "SKIP", ou: `${fam}/${n}`, message:
          "socle de marquage ou python introuvable — le contrôle n'a PAS tourné" });
      } else if (r.verdict !== "PASS") {
        findings.push({ regle: "G3", statut: "FAIL", ou: `${fam}/${n}`, message:
          `marquage ${r.verdict} — ${r.detail || "voir check_html.py"}` });
      } else {
        findings.push({ regle: "G3", statut: "PASS", ou: `${fam}/${n}`, message: "marquage PASS" });
      }
    }

    // G4 (TF-0690, 28/08) — LE DOCUMENT LIVRÉ PORTE SON GABARIT ET SA VERSION, VISIBLEMENT.
    // Le fait mesuré : une fiche remise portait sa date et sa référence, rien d'autre — une
    // instance périmée est INVISIBLE SUR L'ARTEFACT, un lecteur qui la tient ne peut pas savoir
    // si elle respecte le catalogue en vigueur. Et la section R-46 du gabarit de retours demande
    // de reporter le couple : un produit dont le document ne le porte pas ne peut répondre que
    // « aucun », ce qui rend muet le seul canal d'amélioration des gabarits. C'est le contrôle
    // le moins cher de la chaîne — le seul qui fonctionne sur un document reçu par courriel,
    // hors de tout dépôt. Le squelette DOIT le porter (sinon aucune instance ne l'héritera) ;
    // l'instance le prouve rendu. Un commentaire HTML ne compte pas : il ne se rend pas.
    const ID_GABARIT = /gabarit\s*:\s*(gd-[a-z0-9-]+)/i;
    const VERSION_GABARIT = /version[_ ]du[_ ]gabarit\s*:?\s*\d+\.\d+\.\d+/i;
    for (const n of [...formes.map((e) => `SQUELETTE.${e}`), ...instances.map((e) => `INSTANCE.${e}`)]) {
      const texte = sansCommentaires(readFileSync(p(n), "utf8"));
      const id = ID_GABARIT.exec(texte);
      const manque = [!id && "l'identifiant `gabarit: gd-…`",
        !VERSION_GABARIT.test(texte) && "la `version du gabarit x.y.z`"].filter(Boolean);
      if (manque.length) {
        findings.push({ regle: "G4", statut: "FAIL", ou: `${fam}/${n}`, message:
          `le document ne rend pas ${manque.join(" ni ")} — une instance périmée est invisible ` +
          "sur l'artefact, et la section R-46 des lots de retours devient impossible à remplir. " +
          "Le couple se RETRANSCRIT dans le rendu (pied de page), jamais seulement en commentaire (TF-0690)" });
      } else {
        findings.push({ regle: "G4", statut: "PASS", ou: `${fam}/${n}`,
          message: `porte ${id[1]} et sa version, visibles dans le rendu` });
      }
    }

    // G10 (TF-1142, 16/09/2026) — LE DOCUMENT DU LECTEUR NE PORTE PAS LE CONTENU DE SON AUTEUR.
    //
    // LE FAIT, mot pour mot : « pour que les sujets qui concernent le créateur du fichier
    // n'arrivent pas à destination des lecteurs du fichier, ça n'est en aucun cas professionnel ».
    // Mesuré sur le livrable qui l'a provoqué — un guide destiné à des développeurs portait un
    // registre de sept arbitrages avec leur instance et leur état, l'historique des versions du
    // document, et un bandeau « statut projet, non opposable » sur chacune de ses onze pages.
    //
    // CE QUE CETTE RÈGLE NE DIT PAS : supprimer les incertitudes. Un développeur DOIT savoir si la
    // règle qu'il applique est opposable — cette information change ce qu'il fait, elle reste chez
    // lui. La frontière est un critère d'ACTION, pas de confort : ce qui ne change que le travail
    // de l'AUTEUR part au document d'auteur. C'est pourquoi le juge porte sur la DÉCLARATION du
    // lecteur, et jamais sur le contenu d'une instance : trancher « cette phrase sert-elle le
    // lecteur ? » est une relecture, pas une mesure, et un oracle qui le prétendrait mentirait.
    // CE QUE CETTE RÈGLE MESURE, ET POURQUOI PAS CE QU'ON CROYAIT. L'item demandait d'exiger un
    // champ `lecteur`. Mesuré AVANT d'écrire la règle : les CINQ familles portent déjà
    // `role_destinataire: {qui lit ce rapport, et pour quelle décision}` — la déclaration existe,
    // sous un autre nom, et une règle posée là aurait été VERTE sur les cinq, donc verte sur le
    // défaut même qu'elle existe pour attraper. Ce qu'aucun gabarit ne porte, c'est la FRONTIÈRE :
    // la section qui nomme ce qui part au document d'auteur au lieu d'aller au lecteur. La règle
    // est donc posée là, et la déclaration du lecteur reste vérifiée comme sa condition.
    {
      const LECTEUR = /^\s*(?:role_destinataire|lecteur)\s*:\s*\S/im;
      const FRONTIERE = /^\s*#{2,4}\s*[^\n]*document d['’]auteur/im;
      const texte = readFileSync(p("GABARIT.md"), "utf8");
      const manque = [!LECTEUR.test(texte) && "la déclaration `role_destinataire` (qui lit, et pour quelle décision)",
        !FRONTIERE.test(texte) && "la section « Document d'auteur », qui nomme ce qui NE va PAS au lecteur"].filter(Boolean);
      if (manque.length) {
        findings.push({ regle: "G10", statut: "FAIL", ou: `${fam}/GABARIT.md`, message:
          `le gabarit ne porte pas ${manque.join(" ni ")} — sans elle, le registre d'arbitrages, ` +
          "l'historique des versions et le statut de relecture partent au lecteur, et personne ne le " +
          "voit : c'est le refus humain du 15/09 (« ça n'est en aucun cas professionnel »). La frontière " +
          "se tranche par un critère d'ACTION — ce qui change ce que le lecteur FAIT reste chez lui, ce " +
          "qui ne change que le travail de l'AUTEUR part au document d'auteur (règle D11, TF-1142)" });
      } else {
        findings.push({ regle: "G10", statut: "PASS", ou: `${fam}/GABARIT.md`,
          message: "lecteur déclaré et frontière lecteur/auteur écrite (D11)" });
      }
    }

    // G7 (TF-1170, 20/09/2026) — UNE SECTION DÉCLARÉE OBLIGATOIRE EST DANS LA DOCTRINE.
    //
    // LE FAIT, et il est daté (retour Produit-62 RF-18 du 16/09/2026). Un commanditaire a dénoncé
    // comme un défaut — « une seule table de fait, et pas 4 comme actuellement » — les QUATRE tables
    // de faits qui appliquaient SA PROPRE décision, tranchée neuf jours plus tôt. La décision vivait
    // au ledger du produit ; ni le modèle déclaré ni le mode d'emploi du livrable ne la portaient.
    // Coût mesuré : 55 minutes d'analyse pour établir que le défaut dénoncé était une décision.
    // *Un choix d'architecture non expliqué là où le lecteur le rencontre sera dénoncé comme un
    // défaut — y compris par celui qui l'a pris.*
    //
    // POURQUOI LA RÈGLE EST PILOTÉE PAR LE CATALOGUE, et non écrite en dur comme G10. G10 exige la
    // section « Document d'auteur » de TOUTE famille, parce que D11 vaut pour toutes. Ici non : la
    // section « Choix d'architecture et décisions qui les fondent » n'a de sens que pour un livrable
    // qui EST un dossier. L'écrire en dur accuserait les trente-huit familles du catalogue le jour de
    // sa naissance, et une règle qui accuse du travail juste se fait désactiver le lendemain (la
    // leçon est déjà payée, voir l'antériorité déclarée de G9). La règle juge donc ce qu'une famille
    // a DÉCLARÉ vouloir tenir : taux d'accusation mesuré sur le parc AVANT écriture — 0 famille sur
    // 38, puisque aucune ne déclarait encore le champ.
    //
    // CE QU'ELLE NE FAIT PAS : juger le CONTENU de la section, ni qu'une INSTANCE la remplisse. Une
    // décision citée mais révoquée depuis passe cette règle et ment ; le ledger du produit fait foi,
    // et aucun oracle du pilot ne le lit. C'est le `non_juge` que forge-data déclare déjà au même
    // endroit (M7 d'oracle-modeliser : « reprise des mêmes décisions dans le mode d'emploi du
    // livrable-dossier — gabarit du pilot, jamais jugé ici »), repris ici plutôt que tu des deux côtés.
    {
      const ligne = catalogue.find((f) => f.famille === fam);
      const dues = (ligne && Array.isArray(ligne.sections_obligatoires)) ? ligne.sections_obligatoires : [];
      if (!dues.length) {
        findings.push({ regle: "G7", statut: "PASS", ou: `${fam}/GABARIT.md`, message:
          "aucune section déclarée obligatoire au catalogue — la règle ne juge que ce qu'une famille " +
          "a DÉCLARÉ vouloir tenir, et n'accuse jamais celle qui n'a rien déclaré" });
      } else {
        const texte = sansCommentaires(readFileSync(p("GABARIT.md"), "utf8"));
        const titres = [...texte.matchAll(/^\s{0,3}#{2,6}\s+(.+?)\s*$/gm)].map((m) => NORMALISER(m[1]));
        const absentes = dues.filter((s) => !titres.some((t) => t.includes(NORMALISER(s))));
        findings.push(absentes.length
          ? { regle: "G7", statut: "FAIL", ou: `${fam}/GABARIT.md`, message:
              `section(s) déclarée(s) obligatoire(s) au catalogue et ABSENTE(S) de la doctrine : ` +
              `${absentes.map((s) => `« ${s} »`).join(", ")}. La famille déclare tenir cette section ; ` +
              "un gabarit qui ne la porte pas laisse chaque livrable la réinventer ou l'omettre — et " +
              "c'est ainsi qu'un choix d'architecture non expliqué se fait dénoncer comme un défaut " +
              "par celui-là même qui l'avait tranché (TF-1170, retour RF-18 du 16/09/2026)" }
          : { regle: "G7", statut: "PASS", ou: `${fam}/GABARIT.md`, message:
              `${dues.length} section(s) déclarée(s) obligatoire(s) au catalogue, toutes présentes dans la doctrine` });
      }
    }

    // G5 (TF-1038, 15/09/2026) — LA LARGEUR EST UNE PROPRIÉTÉ DE LA PAGE. Le fait : un lecteur a
    // demandé d'homogénéiser la largeur d'une page où neuf chapitres alternaient pleine largeur et
    // `.chap.lire` bridé, dans l'ordre de leur nature et non de la lecture. Le squelette
    // prescrivait les deux gabarits de chapitre sans dire que l'alternance était un défaut.
    for (const n of ["SQUELETTE.html", "INSTANCE.html"].filter((f) => fichiers.includes(f))) {
      const texte = sansCommentaires(readFileSync(p(n), "utf8"));
      const chapitres = [...texte.matchAll(/<[a-z][a-z0-9]*\b[^>]*\bclass\s*=\s*(["'])([^"']*)\1[^>]*>/gi)]
        .map((m) => m[2].split(/\s+/)).filter((cls) => cls.includes("chap"));
      if (!chapitres.length) {
        findings.push({ regle: "G5", statut: "PASS", ou: `${fam}/${n}`, message: "aucun chapitre à largeur nommée (`.chap`) — rien à homogénéiser" });
        continue;
      }
      const decl = (/<(?:body|main)\b[^>]*\bdata-largeur\s*=\s*(["'])(lecture|donnees)\1/i.exec(texte) || [])[2] || null;
      const jugés = chapitres.filter((cls) => !cls.includes("largeur-exception"));
      const bridés = jugés.filter((cls) => cls.includes("lire")).length;
      const pleins = jugés.length - bridés;
      let ecart = null;
      if (!decl && bridés && pleins) ecart = `${bridés} chapitre(s) bridé(s) (.lire) et ${pleins} en pleine largeur, SANS déclaration de page`;
      else if (!decl) ecart = `${chapitres.length} chapitre(s) .chap sans déclaration de largeur de page — la page dit si elle est de lecture ou de données`;
      else if (decl === "lecture" && pleins) ecart = `page déclarée « lecture » et ${pleins} chapitre(s) en pleine largeur non marqué(s) largeur-exception`;
      else if (decl === "donnees" && bridés) ecart = `page déclarée « donnees » et ${bridés} chapitre(s) bridé(s) (.lire) non marqué(s) largeur-exception`;
      findings.push(ecart
        ? { regle: "G5", statut: "FAIL", ou: `${fam}/${n}`, message: `${ecart}. La largeur est une propriété de la PAGE : \`<body data-largeur="lecture|donnees">\`, les écarts voulus marqués \`largeur-exception\` (règle D10, TF-1038)` }
        : { regle: "G5", statut: "PASS", ou: `${fam}/${n}`, message: `page « ${decl} », ${chapitres.length} chapitre(s) conformes${chapitres.length > jugés.length ? ` dont ${chapitres.length - jugés.length} exception(s) déclarée(s)` : ""}` });
    }
  }
  if (!familles.length) findings.push({ regle: "G1", statut: "SKIP", ou: dossier, message: "aucune famille de gabarit sous ce dossier" });
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : f.every((x) => x.statut === "SKIP") ? "SKIP" : "PASS");

if (args[0] === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "gab-doc-"));
  const casse = [];
  const PAGE = (titre, corps) => `<!doctype html><html lang="fr"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1"><title>${titre} — 20260824a</title>` +
    `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E">` +
    `<style>body{color:#1a1a1a;background:#fff;font-family:system-ui,sans-serif}main{max-width:70ch;margin:0 auto}</style>` +
    `</head><body><main><h1>${titre}</h1>${corps}</main></body></html>`;
  // Le couple gabarit + version est dû dans le RENDU (G4, TF-0690) : les fixtures le portent,
  // sauf celle qui prouve le sens rouge de la règle.
  const COUPLE = "<p>Gabarit : gd-recette · version du gabarit 1.0.0</p>";
  const poser = (nom, { gabarit = true, squelette = true, instance = "remplie", couple = COUPLE } = {}) => {
    mkdirSync(join(dir, nom), { recursive: true });
    if (gabarit) writeFileSync(join(dir, nom, "GABARIT.md"), "# doctrine\n", "utf8");
    if (squelette) writeFileSync(join(dir, nom, "SQUELETTE.html"), PAGE("Squelette", "<p>Forme.</p>" + couple), "utf8");
    if (instance === "remplie") writeFileSync(join(dir, nom, "INSTANCE.html"), PAGE("Instance", "<p>Contenu réel, mesuré le 24 août 2026.</p>" + couple), "utf8");
    if (instance === "trous") writeFileSync(join(dir, nom, "INSTANCE.html"), PAGE("Instance", "<p>{{contenu.a.remplir}}</p>" + couple), "utf8");
    if (instance === "copie") writeFileSync(join(dir, nom, "INSTANCE.html"), PAGE("Squelette", "<p>Forme.</p>" + couple), "utf8");
  };

  poser("verte");
  let f = juger(dir);
  const g = (r, ou) => f.filter((x) => x.regle === r && x.ou.startsWith(ou));
  if (g("G1", "verte")[0]?.statut !== "PASS") casse.push("une famille complète échoue G1");
  if (g("G2", "verte")[0]?.statut !== "PASS") casse.push("une instance remplie échoue G2 : " + JSON.stringify(g("G2", "verte")[0]));
  if (!g("G4", "verte").every((x) => x.statut === "PASS")) casse.push("un couple gabarit+version rendu échoue G4 — la règle accuse ce qu'elle prescrit");

  // G4, sens rouge : le document ne rend NI l'identifiant NI la version — l'artefact du 27/08.
  poser("sans-couple", { couple: "" });
  f = juger(dir);
  if (!g("G4", "sans-couple").some((x) => x.statut === "FAIL")) {
    casse.push("un document sans gabarit ni version visible passe G4 — l'instance périmée reste invisible sur l'artefact");
  }

  poser("sans-instance", { instance: null });
  f = juger(dir);
  if (!g("G1", "sans-instance").some((x) => x.statut === "FAIL" && /INSTANCE\.html/.test(x.message))) {
    casse.push("un squelette SANS instance ne rend aucun constat — le trou même que l'item décrit");
  }

  poser("a-trous", { instance: "trous" });
  f = juger(dir);
  if (!g("G2", "a-trous").some((x) => x.statut === "FAIL")) casse.push("une instance à trous passe G2");

  poser("copie", { instance: "copie" });
  f = juger(dir);
  if (!g("G2", "copie").some((x) => x.statut === "FAIL")) casse.push("une instance copie du squelette passe G2");

  // G5 (TF-1038) : deux rouges (alternance sans déclaration ; déclaration « lecture » contredite)
  // et deux verts (lecture tenue ; données avec une exception déclarée).
  const CHAP = (cls) => `<section class="${cls}"><p>Chapitre rempli le 15 septembre 2026.</p></section>`;
  const poserLargeur = (nom, corps, decl) => {
    mkdirSync(join(dir, nom), { recursive: true });
    writeFileSync(join(dir, nom, "GABARIT.md"), "# doctrine\n", "utf8");
    const page = (t) => PAGE(t, corps + COUPLE).replace("<body>", decl ? `<body data-largeur="${decl}">` : "<body>");
    writeFileSync(join(dir, nom, "SQUELETTE.html"), page("Squelette"), "utf8");
    writeFileSync(join(dir, nom, "INSTANCE.html"), page("Instance").replace("Chapitre rempli", "Chapitre instancié"), "utf8");
  };
  poserLargeur("largeur-alternee", CHAP("chap") + CHAP("chap lire") + CHAP("chap"), null);
  poserLargeur("largeur-contredite", CHAP("chap lire") + CHAP("chap"), "lecture");
  poserLargeur("largeur-lecture", CHAP("chap lire") + CHAP("chap lire"), "lecture");
  poserLargeur("largeur-donnees", CHAP("chap") + CHAP("chap lire largeur-exception"), "donnees");
  f = juger(dir);
  if (!g("G5", "largeur-alternee").every((x) => x.statut === "FAIL" && /SANS déclaration/.test(x.message))) casse.push("des largeurs alternées sans déclaration passent G5 — le défaut du 11/09");
  if (!g("G5", "largeur-contredite").every((x) => x.statut === "FAIL" && /déclarée « lecture »/.test(x.message))) casse.push("une page « lecture » à chapitre plein non marqué passe G5");
  if (!g("G5", "largeur-lecture").every((x) => x.statut === "PASS")) casse.push("une page « lecture » tenue échoue G5 — la règle accuse ce qu'elle prescrit");
  if (!g("G5", "largeur-donnees").every((x) => x.statut === "PASS" && /exception/.test(x.message))) casse.push("une exception déclarée n'est pas admise par G5");

  // G7 (TF-1170) — LA SECTION DÉCLARÉE OBLIGATOIRE, DANS SES TROIS SENS. Les trois familles ne
  // diffèrent que par UNE propriété : ce que le catalogue déclare, et ce que la doctrine porte.
  // Le troisième sens est celui qui empêche la règle de naître en accusant le parc entier — une
  // famille qui ne déclare rien n'est pas jugée, et c'est ce qui rend la règle adoptable.
  const SECTION = "Choix d'architecture et décisions qui les fondent";
  const CAT_G7 = [
    { famille: "g7-tenue", sections_obligatoires: [SECTION] },
    { famille: "g7-manquante", sections_obligatoires: [SECTION] },
    { famille: "g7-muette" },
  ];
  const poserG7 = (nom, corpsDoctrine) => {
    mkdirSync(join(dir, nom), { recursive: true });
    writeFileSync(join(dir, nom, "GABARIT.md"), corpsDoctrine, "utf8");
    writeFileSync(join(dir, nom, "INSTANCE.md"), "# instance\n\nRemplie le 20 septembre 2026.\n" +
      "\nGabarit : gd-g7 · version du gabarit 1.0.0\n", "utf8");
  };
  poserG7("g7-tenue", `# doctrine\n\n## ${SECTION}\n\nDepuis le ledger du produit.\n`);
  poserG7("g7-manquante", "# doctrine\n\n## Le contenu du dossier\n\nSans la section due.\n");
  poserG7("g7-muette", "# doctrine\n\n## Le contenu du dossier\n\nFamille qui ne déclare rien.\n");
  const f7 = juger(dir, CAT_G7);
  const g7 = (ou) => f7.filter((x) => x.regle === "G7" && x.ou.startsWith(ou));
  if (!g7("g7-tenue").every((x) => x.statut === "PASS"))
    casse.push("G7 : une famille qui PORTE la section qu'elle déclare est accusée — la règle accuse ce qu'elle prescrit");
  if (!g7("g7-manquante").some((x) => x.statut === "FAIL" && /ABSENTE/.test(x.message)))
    casse.push("G7 : une famille qui déclare une section obligatoire et ne la porte PAS passe — c'est le trou " +
      "par lequel un choix d'architecture non expliqué se fait dénoncer comme un défaut (RF-18, 16/09/2026)");
  if (!g7("g7-muette").every((x) => x.statut === "PASS" && /n'a rien déclaré/.test(x.message)))
    casse.push("G7 : une famille qui ne déclare AUCUNE section obligatoire est jugée — la règle accuserait " +
      "les 38 familles du parc le jour de sa naissance, et se ferait désactiver le lendemain");

  // G3, sens rouge : une classe posée sans règle CSS — le défaut exact du 24/08, en modèle réduit.
  mkdirSync(join(dir, "classe-nue"), { recursive: true });
  writeFileSync(join(dir, "classe-nue", "GABARIT.md"), "# doctrine\n", "utf8");
  writeFileSync(join(dir, "classe-nue", "SQUELETTE.html"), PAGE("Squelette", '<p class="ch-apprend">Chapeau sans règle.</p>'), "utf8");
  writeFileSync(join(dir, "classe-nue", "INSTANCE.html"), PAGE("Instance", '<p class="ch-apprend">Chapeau sans règle, rempli le 24 août 2026.</p>'), "utf8");
  f = juger(dir);
  const g3 = g("G3", "classe-nue");
  if (g3.every((x) => x.statut === "SKIP")) {
    console.log("Self-test gabarits-documents : 8/9 PASS, G3 non joué (socle de marquage ou python absent — " +
      "il est déclaré, pas supposé)" + (casse.length ? " · CASSE : " + casse.join(" · ") : ""));
    rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
    process.exit(casse.length ? 1 : 0);
  }
  if (!g3.some((x) => x.statut === "FAIL")) casse.push("une classe posée sans règle CSS passe G3 — c'est le défaut mesuré le 24/08");

  // G8 (TF-1076) — LA RÉSOLUTION D'UNE FAMILLE PAR LE NOM, DANS SES TROIS SENS. Les fixtures sont
  // des NOMS, pas des fichiers : la règle lit ce que R-4 rend porteur et ne touche jamais au
  // contenu. Le troisième sens est celui qui compte le plus — le préfixe le plus LONG gagne, sans
  // quoi « Synthese Executive » retomberait sur la famille des restitutions et la règle rendrait
  // PASS en désignant la mauvaise famille : muette en croyant vivre.
  const cat8 = lireCatalogue();
  if (!cat8.length) {
    casse.push("G8 : le catalogue des familles est illisible depuis le self-test — la règle ne peut rien juger");
  } else {
    const g8 = (nom) => jugerLivrable(nom, cat8);
    const couvert = g8("Digit-AI - Synthese Mandat - Campagne close - 20260916a.md");
    const nu = g8("Digit-AI - Note Migration - Chemins renommes - 20260916a.md");
    const plusLong = g8("Digit-AI - Synthese Executive - Etat du parc - 20260916a.md");
    if (!(couvert.statut === "PASS" && couvert.message.includes("restitution")))
      casse.push(`G8 : un livrable « Synthese … » ne résout pas la famille des restitutions — ${couvert.message.slice(0, 120)}`);
    if (nu.statut !== "FAIL")
      casse.push("G8 : un livrable d'un type ABSENT du catalogue passe — c'est par ce silence que la classe " +
        "gabarit-famille-manquante récidive dans 13 cas sur 13, l'oracle qu'elle déclarait n'ayant jamais existé");
    if (!(plusLong.statut === "PASS" && plusLong.message.includes("synthese-executive")))
      casse.push("G8 : « Synthese Executive » retombe sur la famille des restitutions — le préfixe le plus LONG ne gagne " +
        `pas, et la règle désigne la mauvaise famille en rendant PASS : ${plusLong.message.slice(0, 120)}`);
  }

  // G9 (TF-0923 volet 3) — LA PAGE HOMONYME, DANS SES QUATRE SENS. Les quatre cas ne diffèrent que
  // par UNE propriété du nom ou du disque : c'est la seule forme qui prouve que la règle juge ce
  // qu'elle prétend juger. Le quatrième — l'antériorité — est celui qui empêche la règle de
  // naître en accusant quarante-sept documents que la règle 5 interdit de réécrire.
  const g9 = (nom, opts) => jugerPageHomonyme(nom, opts);
  if (g9("20260914-etude-opportunite-x.md", { existe: false }).statut !== "FAIL")
    casse.push("G9 : une étude postérieure à la doctrine, SANS page homonyme, passe — c'est le silence qui a valu " +
      "le retour « aucun fichier HTML n'a été généré […] il doit faire partie intégrante de la proposition »");
  if (g9("20260914-etude-opportunite-x.md", { existe: true }).statut !== "PASS")
    casse.push("G9 : la MÊME étude, AVEC sa page, est accusée — la règle juge autre chose que la présence de la page");
  if (g9("20260101-etude-opportunite-x.md", { existe: false }).statut !== "SANS_OBJET")
    casse.push("G9 : une étude ANTÉRIEURE à l'entrée de la doctrine est accusée — la règle 5 interdit de réécrire " +
      "l'existant, et une règle qui accuse quarante-sept documents le jour de sa naissance se fait désactiver le lendemain");
  if (g9("Digit-AI - Synthese Mandat - Sujet - 20260916a.md", { existe: false }).statut !== "SKIP")
    casse.push("G9 : une RESTITUTION est traitée comme une proposition — la page n'est due qu'aux propositions, " +
      "trajectoires, études et conseils remis à un humain");

  // G6 (TF-1097) — LA FICHE DE CONCEPTION, DANS SES SIX SENS. Chaque cas rouge ne diffère du cas
  // vert que par UNE propriété : c'est la seule forme qui prouve que la règle juge ce qu'elle dit
  // juger. Le sixième — le document qui ne tient pas sa fiche — est celui qui empêche la fiche de
  // devenir un rite : une conception qu'on n'exécute pas coûte sans rien rendre.
  const FICHE_OK = [
    "famille: gd-rapport-donnees",
    "enjeu: ordinaire",
    "motif_enjeu: aucune",
    "decisions_attendues: arbitrer quels rapports sont maintenus et lesquels sont retirés",
    "savoir_prealable: connaît ses indicateurs métier et son organisation",
    "vocabulaire_absent: lineage, granularité, dimension conforme",
    "contexte_de_lecture: en comité, vingt minutes, projeté sur écran partagé",
    "parties:",
    "  - titre: Ce qui a été mesuré",
    "    intention: le lecteur sait sur quelle population porte chaque chiffre avant de trancher",
    "    type_de_contenu: fait",
    "  - titre: Comment relire un chiffre",
    "    intention: le lecteur retrouve seul la source d'un agrégat qui le surprend",
    "    type_de_contenu: tache",
    "format: html",
    "volume_attendu: 2 parties, un tableau de 63 lignes",
    "justification: 63 lignes filtrables et une lecture projetée en comité imposent une page HTML, pas un Markdown",
  ].join("\n");
  const poserFiche = (nom, muter) => {
    const p6 = join(dir, nom);
    writeFileSync(p6, muter ? muter(FICHE_OK) : FICHE_OK, "utf8");
    return p6;
  };
  const verdict6 = (fiche, doc) => jugerFiche(fiche, doc);
  const aFail = (fs, motif) => fs.some((x) => x.statut === "FAIL" && motif.test(x.message));

  if (verdict6(poserFiche("f-ok.md")).some((x) => x.statut === "FAIL"))
    casse.push("G6 : une fiche COMPLÈTE est accusée — la règle accuse ce qu'elle prescrit : " +
      JSON.stringify(verdict6(poserFiche("f-ok.md")).filter((x) => x.statut === "FAIL").map((x) => x.message.slice(0, 90))));
  if (!aFail(verdict6(poserFiche("f-lecteur.md", (t) => t.replace(/^vocabulaire_absent:.*$/m, "vocabulaire_absent: {les mots de NOTRE métier qu'il n'a pas}"))), /lecteur incomplet/))
    casse.push("G6 : un champ du lecteur resté à l'état d'emplacement passe — c'est le vocabulaire non fixé " +
      "avant l'écriture, deux griefs sur vingt du rétro-test du 14/09");
  if (!aFail(verdict6(poserFiche("f-type.md", (t) => t.replace("type_de_contenu: fait", "type_de_contenu: présentation"))), /vocabulaire FERMÉ/))
    casse.push("G6 : un type de contenu hors du vocabulaire fermé passe — « présentation » ne commande aucune forme");
  if (!aFail(verdict6(poserFiche("f-paraphrase.md", (t) => t.replace("intention: le lecteur sait sur quelle population porte chaque chiffre avant de trancher", "intention: ce qui a été mesuré"))), /PARAPHRASE/))
    casse.push("G6 : une intention qui paraphrase son titre passe — règle D8, la partie devrait se supprimer");
  if (!aFail(verdict6(poserFiche("f-fort.md", (t) => t.replace("enjeu: ordinaire", "enjeu: fort").replace("motif_enjeu: aucune", "motif_enjeu: 1, 3"))), /enjeu FORT sans `valide_par`/))
    casse.push("G6 : une fiche à enjeu FORT sans valideur humain passe — R-29, les gates restent humains");
  if (!verdict6(poserFiche("f-fort-ok.md", (t) => t.replace("enjeu: ordinaire", "enjeu: fort").replace("motif_enjeu: aucune", "motif_enjeu: 1, 3\nvalide_par: le pilote, 2026-09-20"))).every((x) => x.statut === "PASS"))
    casse.push("G6 : la MÊME fiche à enjeu fort, AVEC son valideur, est accusée — la règle juge autre chose que la présence du valideur");
  // Le second temps : le DOCUMENT tient-il sa fiche ?
  const docTenu = join(dir, "doc-tenu.md");
  writeFileSync(docTenu, "# Rapport\n\n## Ce qui a été mesuré\n\nTexte.\n\n## Comment relire un chiffre\n\nTexte.\n", "utf8");
  const docAmpute = join(dir, "doc-ampute.md");
  writeFileSync(docAmpute, "# Rapport\n\n## Ce qui a été mesuré\n\nTexte.\n", "utf8");
  if (verdict6(poserFiche("f-doc.md"), docTenu).some((x) => x.statut === "FAIL"))
    casse.push("G6 : un document qui PORTE les deux parties conçues est accusé");
  if (!aFail(verdict6(poserFiche("f-doc2.md"), docAmpute), /NE TIENT PAS sa fiche/))
    casse.push("G6 : un document qui a PERDU une partie conçue passe — la fiche devient un rite, " +
      "et une conception qu'on n'exécute pas coûte sans rien rendre");

  // --- G11, LES DEUX SENS, sur un catalogue fabriqué : la seule forme qui prouve qu'une règle
  // juge ce qu'elle prétend juger et non le reste de la ligne (doctrine du banc rouge/vert).
  const catDir = mkdtempSync(join(tmpdir(), "gab-cat-"));
  const parc = join(catDir, "parc");
  mkdirSync(join(parc, "depot-pilot", "gabarits", "documents", "fam-ok"), { recursive: true });
  writeFileSync(join(parc, "depot-pilot", "gabarits", "documents", "fam-ok", "SQUELETTE.html"), "<p>vide</p>", "utf8");
  const META = JSON.stringify({ schema: "pilot/gabarits-documents@1", version: "test" });
  const ecrireCat = (nom, familles) => {
    const f = join(catDir, nom);
    writeFileSync(f, [META, ...familles.map((x) => JSON.stringify(x))].join("\n") + "\n", "utf8");
    return f;
  };
  const verdictsG5 = (f) => jugerCatalogue(f, parc).map((x) => x.statut);

  // VERT : les quatre types déclarés, chacun conforme.
  const catVert = ecrireCat("vert.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "squelette", chemin: "depot-pilot/gabarits/documents/fam-ok/SQUELETTE.html" } },
    { famille: "b", formats: ["html"], point_de_depart: { type: "aucun", chemin: null, empechement: "aucun" } },
    { famille: "d", formats: ["html"], point_de_depart: { type: "aucun", chemin: null, empechement: "poste-porteur", sources_attendues_sur: "un poste qui porte les livrables" } },
    { famille: "c", formats: ["md"] },
  ]);
  if (verdictsG5(catVert).some((v) => v !== "PASS")) casse.push("G11 accuse un catalogue conforme : " + JSON.stringify(jugerCatalogue(catVert, parc)));

  // ROUGE 1 : une famille html SANS le champ — le trou que la règle existe pour voir.
  const catSansChamp = ecrireCat("r1.jsonl", [{ famille: "a", formats: ["html"] }]);
  if (!verdictsG5(catSansChamp).includes("FAIL")) casse.push("G11 laisse passer une famille html sans point_de_depart");

  // ROUGE 2 : un chemin DÉCLARÉ et introuvable, dans un dépôt PRÉSENT — une affirmation.
  const catFantome = ecrireCat("r2.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "squelette", chemin: "depot-pilot/gabarits/documents/fam-ok/ABSENT.html" } }]);
  if (!verdictsG5(catFantome).includes("FAIL")) casse.push("G11 laisse passer un point de départ déclaré et introuvable");

  // --- G12, LES DEUX SENS ROUGES. Une classification qu'aucun contrôle ne tient redevient de la
  // prose en trois semaines : c'est ce qui était arrivé au champ `sources`, et la raison pour
  // laquelle `empechement` naît avec sa fixture rouge plutôt que sans.
  const verdictsG6 = (f) => jugerCatalogue(f, parc).filter((x) => x.regle === "G12").map((x) => x.statut);

  // ROUGE G12-1 : « aucun » sans empêchement — une dépendance d'environnement et une dette de
  // travail se lisent alors pareil, et le compte des familles démunies mélange les deux.
  const catSansEmp = ecrireCat("r6a.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "aucun", chemin: null } }]);
  if (!verdictsG6(catSansEmp).includes("FAIL")) casse.push("G12 laisse passer un « aucun » sans empêchement classé");

  // ROUGE G12-2 : « poste-porteur » sans dire OÙ — personne ne peut aller chercher les sources.
  const catSansOu = ecrireCat("r6b.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "aucun", chemin: null, empechement: "poste-porteur" } }]);
  if (!verdictsG6(catSansOu).includes("FAIL")) casse.push("G12 laisse passer « poste-porteur » sans sources_attendues_sur");

  // ROUGE 3 : « aucun » ET un chemin — la déclaration se contredit.
  const catContradictoire = ecrireCat("r3.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "aucun", chemin: "depot-pilot/gabarits/documents/fam-ok/SQUELETTE.html" } }]);
  if (!verdictsG5(catContradictoire).includes("FAIL")) casse.push("G11 laisse passer « aucun » accompagné d'un chemin");

  // VERT 2 : un dépôt porteur ABSENT du poste rend SKIP, jamais PASS ni FAIL — un contrôle qui
  // échoue sur ce qu'on ne peut pas réparer apprend à être contourné.
  const catHorsPoste = ecrireCat("v2.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "generateur", chemin: "depot-absent/tools/build.mjs" } }]);
  if (!verdictsG5(catHorsPoste).includes("SKIP")) casse.push("G11 ne SKIP pas sur un dépôt porteur absent du poste");

  rmSync(catDir, { recursive: true, force: true, maxRetries: 5 });
  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test gabarits-documents : 36/36 PASS (famille complète et remplie → PASS ; squelette sans instance → FAIL ;" +
      "instance à trous → FAIL ; instance copie du squelette → FAIL ; classe posée sans règle CSS → FAIL au marquage ; " +
      "couple gabarit+version rendu → PASS G4 ; document sans le couple → FAIL G4 ; largeurs alternées sans " +
      "déclaration → FAIL G5 ; page « lecture » contredite → FAIL G5 ; page « lecture » tenue → PASS G5 ; " +
      "page « donnees » avec exception déclarée → PASS G5 ; G6 dans ses HUIT sens (TF-1097) : fiche complète → PASS, champ du lecteur resté à l'état d'emplacement → FAIL, type de contenu hors vocabulaire fermé → FAIL, intention qui paraphrase son titre → FAIL (D8), enjeu FORT sans valideur → FAIL (R-29), la MÊME avec son valideur → PASS, document qui porte ses parties conçues → PASS, document qui en a perdu une → FAIL (une conception qu'on n'exécute pas coûte sans rien rendre) ; G7 dans ses TROIS sens (TF-1170) : une famille qui PORTE la section qu'elle déclare → PASS, une famille qui la DÉCLARE et ne la porte pas → FAIL, une famille qui ne déclare RIEN → PASS sans être jugée, ce qui empêche la règle d'accuser les 38 familles du parc le jour de sa naissance ; G8 dans ses TROIS sens (TF-1076) : un livrable « Synthese … » résout la famille des restitutions, un « Note Migration … » — type absent du catalogue — FAIL en nommant les clés proches, et « Synthese Executive » résout sa PROPRE famille, le préfixe le plus long gagnant sur le plus court) ; G9 dans ses QUATRE sens (TF-0923 volet 3) : une etude posterieure a la doctrine SANS page homonyme FAIL, la MEME avec sa page PASS, une etude ANTERIEURE a la doctrine SANS_OBJET — antecedence declaree, jamais rattrapee en silence —, et une restitution SKIP, la page n etant due qu aux propositions remises a un humain ; " +
      "G12 dans ses DEUX sens rouges — « aucun » sans empêchement classé → FAIL, « poste-porteur » sans dire OÙ → FAIL ; " +
      "G11 dans ses CINQ sens — catalogue conforme → PASS, famille html sans champ → FAIL, chemin déclaré introuvable → FAIL, " +
      "« aucun » avec un chemin → FAIL, dépôt porteur absent du poste → SKIP et jamais PASS)");
  process.exit(casse.length ? 1 : 0);
}

// MODE LIVRABLE (G8) — `--livrable <chemin…>` juge des NOMS de livrables, pas le dossier des
// gabarits. Deux domaines, un seul oracle : dupliquer la lecture du catalogue dans un contrôle à
// part serait la classe `oracle-remplace-par-controle-maison`, que ce dépôt compte par ailleurs.
if (args.includes("--livrable")) {
  const cat = lireCatalogue();
  if (!cat.length) {
    console.log(JSON.stringify({ oracle: "oracle-gabarits-documents", mode: "livrable", verdict: "ERREUR",
      message: `catalogue illisible ou absent : ${CATALOGUE}` }, null, 1));
    process.exit(2);
  }
  const vus = args.slice(args.indexOf("--livrable") + 1).filter((a) => !a.startsWith("--"));
  if (!vus.length) {
    console.log(JSON.stringify({ oracle: "oracle-gabarits-documents", mode: "livrable", verdict: "ERREUR",
      message: "usage : node oracle-gabarits-documents.mjs --livrable <chemin.md> [<chemin.md>…]" }, null, 1));
    process.exit(2);
  }
  const f8 = vus.flatMap((c) => [jugerLivrable(c, cat), jugerPageHomonyme(c)]);
  const v8 = f8.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({
    oracle: "oracle-gabarits-documents", mode: "livrable", version: "1.1.0", verdict: v8, findings: f8,
    non_juge: [
      "le CONTENU du livrable : G8 lit son NOM, que R-4 rend porteur, et ne classe jamais un document par sa prose — une devinette ferait crier l'oracle sur du travail juste",
      "la JUSTESSE de la famille résolue : un livrable nommé « Synthese … » qui serait en réalité une étude résout « restitution » et G8 ne le verra pas",
      "les livrables dont le nom ne suit NI R-4 NI la forme datée des études : leur radical entier sert de type, et la résolution échoue le plus souvent — c'est voulu, un nom hors convention est déjà un défaut R-4",
      "G9 ne juge que la PRÉSENCE de la page homonyme, jamais sa fraîcheur ni son contenu : une page générée puis laissée derrière une source corrigée la satisfait. Sa conformité au socle est le travail de check_html et render_page, joués séparément",
    ],
  }, null, 1));
  process.exit(v8 === "FAIL" ? 1 : 0);
}

// MODE FICHE (G6, TF-1097) — `--fiche <fiche.md> [<document.md>]` juge la CONCEPTION avant
// l'écriture, puis, si un document est donné, qu'il TIENT sa fiche. Sur appel explicite, comme
// `--livrable` : une fiche est par document, jamais par famille, et il n'y a rien à balayer.
if (args.includes("--fiche")) {
  const vus = args.slice(args.indexOf("--fiche") + 1).filter((a) => !a.startsWith("--"));
  if (!vus.length) {
    console.log(JSON.stringify({ oracle: "oracle-gabarits-documents", mode: "fiche", verdict: "ERREUR",
      message: "usage : node oracle-gabarits-documents.mjs --fiche <fiche.md> [<document.md>]" }, null, 1));
    process.exit(2);
  }
  const f6 = jugerFiche(vus[0], vus[1] || null);
  const v6 = f6.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({
    oracle: "oracle-gabarits-documents", mode: "fiche", version: "1.0.0", verdict: v6, findings: f6,
    non_juge: [
      "la JUSTESSE du lecteur défini : G6 vérifie que les quatre champs sont remplis, jamais qu'ils décrivent le vrai lecteur — c'est une relecture",
      "la PERTINENCE d'une intention de partie et le BON choix d'un type de contenu : G6 mesure la présence et l'appartenance au vocabulaire fermé, pas la justesse",
      "l'EXACTITUDE de la justification de format, et la qualité de la prose du document",
      "que le CONTENU de chaque partie tienne le type déclaré : indécidable à la machine, et une devinette ferait crier l'oracle sur du travail juste",
      "que le valideur d'une fiche à enjeu fort soit la bonne personne : G6 lit une présence, la décision reste humaine (R-29)",
      "le document lui-même : G6 vérifie qu'il porte les parties conçues, jamais qu'il est bon — les oracles de forme (check_html, render_page) et de conception aval (quality-oracles) restent dus",
    ],
  }, null, 1));
  process.exit(v6 === "FAIL" ? 1 : 0);
}


const dossierJuge = args[0] || join(PILOT, "gabarits", "documents");
// G11 ne se joue que sur le catalogue du pilot : quand l'oracle est pointé sur un dossier
// arbitraire (self-test, périmètre restreint), il n'y a pas de catalogue à juger et le dire
// vaut mieux que de le supposer.
const catalogue = join(PILOT, "gabarits", "documents", "catalogue.jsonl");
const findings = [
  ...juger(dossierJuge),
  ...(dossierJuge === join(PILOT, "gabarits", "documents") ? jugerCatalogue(catalogue, join(PILOT, "..")) : []),
];
const verdict = verdictDe(findings);
console.log(JSON.stringify({
  oracle: "oracle-gabarits-documents",
  version: "1.0.0",
  verdict,
  findings,
  non_juge: [
    "le RENDU des pages : il a son propre contrôle (scripts\\verifier-rendu-instances.mjs) et le " +
    "dupliquer créerait deux vérités sur les familles bloquantes",
    "la justesse du CONTENU d'une instance : un texte d'exemple faux est un défaut de relecture",
    // TF-0696 (28/08) : un non_juge qui renvoie vers un contrôle nommé est une frontière ; un
    // non_juge qui ne renvoie nulle part est un trou avec une étiquette dessus. Le gabarit de la
    // fiche sécurité portait un défaut de mise en page depuis sa création en juillet, et n'a été
    // jugé par RIEN jusqu'à la relecture humaine du 27/08 — précisément parce que cette ligne
    // s'arrêtait à l'exclusion.
    "les FICHES (familles portées par digit-ai-forge-audit, ex. gd-fiche-securite) : leur RENDU " +
    "se juge par `scripts\\verifier-rendu-instances.mjs <dossier de la famille>` (périmètre " +
    "arbitraire depuis TF-0695) et leur marquage par le socle digit-ai-page-html (check_html.py) ; " +
    "leur CONTENU attend le vérificateur de la famille (TF-0701, décidé, chez forge-audit)",
    "les PROMPTS et SQUELETTES DE FORGE : jugés par AUCUN contrôle nommé à ce jour — trou " +
    "DÉCLARÉ et non couvert (TF-0696), à combler famille par famille quand l'une d'elles " +
    "coûtera assez pour mériter son juge",
  ],
}, null, 1));
process.exit(verdict === "FAIL" ? 1 : 0);
