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
 *   G4 · le document REND son gabarit et sa version (`Gabarit : gd-… · version du gabarit x.y.z`),
 *        visiblement — jamais seulement en commentaire. Une instance périmée est invisible sur
 *        l'artefact, et la section R-46 des lots devient impossible à remplir sans lui (TF-0690).
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

export function juger(dossier) {
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

  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test gabarits-documents : 18/18 PASS (famille complète et remplie → PASS ; squelette sans instance → FAIL ; " +
      "instance à trous → FAIL ; instance copie du squelette → FAIL ; classe posée sans règle CSS → FAIL au marquage ; " +
      "couple gabarit+version rendu → PASS G4 ; document sans le couple → FAIL G4 ; largeurs alternées sans " +
      "déclaration → FAIL G5 ; page « lecture » contredite → FAIL G5 ; page « lecture » tenue → PASS G5 ; " +
      "page « donnees » avec exception déclarée → PASS G5 ; G8 dans ses TROIS sens (TF-1076) : un livrable « Synthese … » résout la famille des restitutions, un « Note Migration … » — type absent du catalogue — FAIL en nommant les clés proches, et « Synthese Executive » résout sa PROPRE famille, le préfixe le plus long gagnant sur le plus court) ; G9 dans ses QUATRE sens (TF-0923 volet 3) : une etude posterieure a la doctrine SANS page homonyme FAIL, la MEME avec sa page PASS, une etude ANTERIEURE a la doctrine SANS_OBJET — antecedence declaree, jamais rattrapee en silence —, et une restitution SKIP, la page n etant due qu aux propositions remises a un humain)");
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

const findings = juger(args[0] || join(PILOT, "gabarits", "documents"));
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
