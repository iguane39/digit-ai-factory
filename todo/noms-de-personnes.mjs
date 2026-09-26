#!/usr/bin/env node
/**
 * noms-de-personnes.mjs — relève, dans le texte d'un lot, les formes qui NOMMENT une personne, pour
 * qu'un humain les QUALIFIE avant qu'elles voyagent (TF-1357, décision humaine D-21 (b) du 26/09/2026).
 *
 * LE FAIT. Le 24/09, un lot de retours nommait, prénom et nom, la personne qui avait mené un contrôle
 * croisé. `accueillir-lot.mjs` l'aurait déposé tel quel dans `input\00-retours\`, suivi et publié :
 * l'anonymiseur ne lit que la table des organisations et celle des produits, et la porte de
 * publication juge les mêmes tables. Aucune règle du pilot ne parlait des personnes. Le nom a été
 * retiré à la main, parce que la session a lu le lot.
 *
 * LE MODÈLE est celui des adresses IP (TF-1134, `adresses-ip.mjs`) : un AVERTISSEMENT, jamais un
 * refus. Un poste ne sait pas seul si un nom désigne un tiers réel, l'auteur du lot, ou un personnage
 * d'exemple ; le relevé demande, il ne tranche pas. Les formes sont NOMMÉES à l'écran ; l'événement
 * d'ingestion n'en porte que le NOMBRE, jamais la valeur.
 *
 * CE QUI EST RELEVÉ :
 *   · « Prénom NOM » — un mot à capitale initiale, suivi d'un nom tout en capitales d'au moins quatre
 *     lettres, ou composé (« Marie DUPONT », « Jean-Luc LE-BIHAN ») : la forme que propose l'item, et
 *     la convention française d'écriture d'un nom de famille ;
 *   · une civilité suivie d'un nom (« M. Durand », « Mme Martin », « Madame Petit », « Me Roux ») ;
 *   · une adresse électronique : elle nomme souvent sa personne, et elle est une donnée personnelle en
 *     soi — hors domaines de documentation (`example.*`, `exemple.*`, `*.invalid`, `*.test`) et hors
 *     adresses de service (`noreply@`, `no-reply@`).
 *
 * CE QUI N'EST PAS DISTINGUÉ (déclaré, et prouvé par la recette) :
 *   · « Prénom Nom » sans capitales au nom de famille (« Marie Dupont ») n'est PAS relevé : rien ne le
 *     distingue d'un nom de produit ou d'une expression à capitales (« Google Ads ») sans une liste de
 *     prénoms, que ce dépôt ne porte pas. La table des personnes du canal confidentiel, jugée par la
 *     même porte, est la voie qui lèverait cette limite ; elle n'est pas construite ici ;
 *   · un nom de famille de trois lettres (« Paul ROY ») n'est pas relevé : le seuil de quatre lettres
 *     est ce qui écarte les sigles, mesure à l'appui ;
 *   · un mot capitalisé suivi d'un sigle de quatre lettres ou plus absent de la liste d'exclusion
 *     (« Norme ISOC ») est relevé à tort : un humain le qualifie.
 *
 * BRUIT MESURÉ (26/09/2026), sur les 618 lots et candidatures reçus par le pilot : 6 fichiers relevés
 * (1,0 %) — 5 faux positifs de forme sigle ou emphase (« Garde TOCTOU », « Constat REVÉRIFIÉ »…), et
 * UNE adresse électronique nominative réelle, publiée depuis le 22/08 : le relevé l'a trouvée au
 * premier passage. Avant les bornes (mot-outil en tête, quatre lettres, sigles et emphases mesurés) :
 * 33 lots sur 162, soit 20 %, tous faux.
 *
 * Usage : node todo/noms-de-personnes.mjs <fichier> — imprime le relevé (exit 0 vide, 1 sinon).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MAJ = "A-ZÀ-ÖØ-Þ", MIN = "a-zà-öø-ÿ";
// « Prénom NOM » : prénom simple ou composé ; nom en capitales, simple de QUATRE lettres au moins, ou
// composé de parties de deux lettres au moins (« LE-BIHAN »). Le seuil de quatre est une MESURE : sur
// les 162 lots de la boîte au 26/09, les 26 faux positifs à trois lettres étaient tous des sigles
// (CLI, POC, SHA, DAX, DEV, DWH…) ; un nom de famille de trois lettres (« ROY ») n'est donc pas relevé.
export const MOTIF_PRENOM_NOM = new RegExp(`(?<![\\p{L}\\d-])([${MAJ}][${MIN}]+(?:-[${MAJ}][${MIN}]+)?)\\s+([${MAJ}]{2,}(?:[-'][${MAJ}]{2,})+|[${MAJ}]{4,})(?![\\p{L}\\d])`, "gu");
export const MOTIF_CIVILITE = new RegExp(`(?<![\\p{L}])(M\\.|Mme|Mlle|Monsieur|Madame|Mademoiselle|Me|Maître|Dr\\.?|Docteur)\\s+([${MAJ}][\\p{L}'-]+)`, "gu");
export const MOTIF_COURRIEL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// Les sigles en capitales qu'un mot capitalisé précède sans nommer personne. Liste FERMÉE, tirée du
// vocabulaire du parc (restitutions, lots, oracles) et des faux positifs MESURÉS le 26/09 sur les 162
// lots de la boîte : l'élargir se fait sur un faux positif mesuré, jamais par précaution.
export const SIGLES = new Set(["HTML", "JSON", "JSONL", "HTTP", "HTTPS", "RGPD", "PASS", "FAIL", "SKIP", "TODO", "README",
  "LISEZMOI", "SAAS", "YAML", "EARS", "WCAG", "ARIA", "CRLF", "SANS_OBJET", "OAUTH", "RACI", "AVERT", "DEFAUT", "DÉFAUT",
  "AUCUN", "AUCUNE", "TOUS", "TOUT", "SEUL", "SEULE", "JAMAIS", "BLOQUANT", "SIRET",
  // mesurés le 26/09 (lots de la boîte) :
  "WARN", "SERP", "OIDC", "CI-CD",
  // mots d'EMPHASE mesurés le 26/09 sur les 562 lots et candidatures reçus (après les deux bornes
  // ci-dessus, 15 fichiers portaient encore un faux positif, tous de cette forme) :
  "EXPLICITEMENT", "BLOQUE", "ETENDUE", "JUGES", "PUIS", "AUSSI", "RELEVE", "PARAMETRAGE", "TOUJOURS",
  "AVANT", "RAILWAY", "ETAPES-RUN"]);
// Un mot-outil en tête n'est pas un prénom : « Le FAIT », « La CLASSE », « Déjà REMONTÉ », « Un
// COMPOSANTS-OPS » — l'emphase en capitales après un article est la forme dominante du corpus, et
// elle a fait les deux tiers des faux positifs mesurés le 26/09. La même liste borne la civilité
// (« M. Jamais »).
export const MOTS_OUTILS = new Set(["Le", "La", "Les", "Un", "Une", "Des", "Du", "De", "Au", "Aux", "Ce", "Cet", "Cette", "Ces",
  "Son", "Sa", "Ses", "Leur", "Leurs", "Mon", "Ma", "Mes", "Notre", "Nos", "Votre", "Vos", "Sur", "Sous", "Dans", "Par",
  "Pour", "Avec", "Sans", "Entre", "Vers", "Chez", "Et", "Ou", "Mais", "Donc", "Car", "Ni", "Si", "Ne", "En", "Déjà", "Pas",
  "Plus", "Moins", "Très", "Tout", "Toute", "Tous", "Toutes", "Aucun", "Aucune", "Chaque", "Jamais", "Toujours", "Seul",
  "Seule", "Même", "Aussi", "Encore", "Puis", "Alors", "Ici", "Voir", "Cf"]);
const DOMAINE_DE_DOC = /@(?:[\w.-]*\.)?(?:example|exemple|demo)\.[a-z]+$|\.(?:invalid|test|example|localhost|local)$/i;
// Boîtes de service, y compris préfixées (« Produit-11-noreply@… », mesuré le 26/09).
const SERVICE = /(?:^|[._-])(?:no-?reply|do-?not-?reply|ne-pas-repondre)@/i;

/** Chaque forme à qualifier, dans l'ordre d'apparition, sans doublon. */
export function relever(texte) {
  const t = String(texte);
  const vues = new Set();
  for (const m of t.matchAll(MOTIF_PRENOM_NOM)) if (!SIGLES.has(m[2]) && !MOTS_OUTILS.has(m[1])) vues.add(`${m[1]} ${m[2]}`);
  for (const m of t.matchAll(MOTIF_CIVILITE)) if (!MOTS_OUTILS.has(m[2])) vues.add(m[0]);
  for (const m of t.matchAll(MOTIF_COURRIEL)) if (!DOMAINE_DE_DOC.test(m[0]) && !SERVICE.test(m[0])) vues.add(m[0]);
  return [...vues];
}

/** Les formes à qualifier de plusieurs textes (le nom déposé et le contenu), sans doublon. */
export function aQualifier(textes) {
  const toutes = new Set();
  for (const t of textes) for (const f of relever(t)) toutes.add(f);
  return [...toutes];
}

export function messageAQualifier(formes, ou = "") {
  if (!formes.length) return null;
  return `[NOMS DE PERSONNES À QUALIFIER] ${formes.length} forme(s)${ou ? ` dans ${ou}` : ""} : ${formes.join(", ")}\n`
    + "  Nom d'un tiers réel ? Le retirer ou le remplacer par un rôle (« la personne qui a mené le contrôle ») "
    + "AVANT l'enregistrement du lot ; auteur du lot, personnage d'exemple ou faux positif : rien à faire (TF-1357).";
}

if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === String(process.argv[1]).replace(/\//g, "\\").toLowerCase()) {
  if (!process.argv[2]) { console.error("usage : node todo/noms-de-personnes.mjs <fichier>"); process.exit(2); }
  const formes = relever(readFileSync(process.argv[2], "utf8"));
  console.log(formes.length ? messageAQualifier(formes, process.argv[2]) : `aucune forme de nom de personne relevée dans ${process.argv[2]}`);
  process.exit(formes.length ? 1 : 0);
}
