#!/usr/bin/env node
/**
 * ouvrir-retour-reglage.mjs — un écart d'audit sur un réglage de plateforme se renvoie où il doit
 * (D-178 (a) du 06/11/2026, TF-2232, point d'injection « correction » de l'étude 20261106a, section 3.2 ;
 * règle R-66, point 5, de `REGLES-PROJET.md`).
 *
 * LE FAIT. Sur les 30 écarts de l'audit du cas témoin, 7 sont une option gratuite laissée à sa valeur
 * d'origine. Corriger ces 7 écarts chez le produit les referme pour ce produit, et rien n'empêche le
 * produit suivant de les rouvrir : la forge qui crée n'a jamais su qu'elle devait écrire le réglage.
 *
 * LA RÈGLE. L'écart se lit contre `references\REGLAGES-SURS-PAR-DEFAUT.json`, par l'adresse de la page de
 * l'éditeur (ou un fragment sans ambiguïté) :
 *   · réglage classé « defaut » : la correction chez le produit ne suffit pas. Un retour s'ouvre aussi vers
 *     la forge qui crée (digit-ai-forge-development, dont le script de création écrit les réglages
 *     « defaut », TF-2228), avec l'identifiant de l'écart. Le script rend la candidature, au format du
 *     sidecar d'un lot de retours (`*.tf.jsonl`), prête pour `todo\ingerer-lot.mjs` ;
 *   · réglage classé « decision » : aucun retour vers la forge. L'écart renvoie à sa décision, que
 *     l'appelant nomme (`--decision D-nn`) ; l'écart accepté se vérifie tel que décidé. Sans décision
 *     nommée, c'est un écart nu : refusé (exit 1) ;
 *   · réglage absent du registre : aucun retour n'est ouvert par ce script ; le réglage est peut-être à
 *     inscrire au registre, ce qui est une autre candidature.
 *
 * NON JUGÉ : voir `NON_JUGE`, rendu dans chaque sortie.
 *
 * Usage : node scripts\ouvrir-retour-reglage.mjs --reglage <adresse|fragment> --ecart <identifiant>
 *           --produit <Produit-nn> [--audit "<nom de l'audit>"] [--decision D-nn]
 *           [--registre <registre.json>] [--date AAAA-MM-JJ]
 * Sortie : JSON · exit 0 = retour à ouvrir, renvoi à une décision nommée, ou réglage hors registre ·
 *          1 = écart nu sur un réglage « decision » · 2 = appel inutilisable (argument manquant, réglage ambigu,
 *          registre illisible).
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chargerRegistre, REGISTRE_PAR_DEFAUT, trouverReglage } from "../oracles/oracle-reglages-surs.mjs";

export const FORGE_QUI_CREE = "digit-ai-forge-development";
export const CLASSE = "garde-fou-plateforme-decouvert-au-deploiement";
export const NON_JUGE = [
  "que l'écart soit réel : le script lit l'identifiant que l'appelant donne, il ne rejoue pas l'audit ni la commande de lecture du registre",
  "que la décision nommée existe et porte bien sur ce réglage : `--decision` est lu comme un identifiant D-nn, la relecture de `decisions\\REGISTRE.jsonl` reste au pilot",
  "le doublon : une candidature déjà ouverte pour le même réglage chez la forge qui crée n'est pas cherchée au registre des tâches",
];

const ECART = /^[A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*-\d+$/;
const PRODUIT = /^(?:Produit-\d{2,}|Client-[A-Z]{1,2})$/;
const DECISION = /^D-\d+$/;

/** Décide de l'aiguillage d'un écart. Fonction pure : le registre et les arguments entrent, un verdict sort. */
export function aiguiller(registre, { reglage, ecart, produit, audit = null, decision = null, date = new Date().toISOString().slice(0, 10) }) {
  const manque = [["--reglage", reglage], ["--ecart", ecart], ["--produit", produit]].filter(([, v]) => !v).map(([n]) => n);
  if (manque.length) return { code: 2, verdict: "APPEL_INUTILISABLE", message: `argument(s) manquant(s) : ${manque.join(", ")}` };
  if (!ECART.test(ecart)) return { code: 2, verdict: "APPEL_INUTILISABLE", message: `identifiant d'écart « ${ecart} » : attendu une forme comme EC-HPR-18` };
  if (!PRODUIT.test(produit)) return { code: 2, verdict: "APPEL_INUTILISABLE", message: `« ${produit} » n'est pas un pseudonyme (Produit-nn ou Client-X) : le pilot est public, un nom réel n'y entre pas` };
  if (decision && !DECISION.test(decision)) return { code: 2, verdict: "APPEL_INUTILISABLE", message: `décision « ${decision} » : attendu une forme comme D-178` };
  const { entree, candidats } = trouverReglage(registre, reglage);
  if (!entree) {
    if (candidats && candidats.length > 1) return { code: 2, verdict: "AMBIGU", message: `« ${reglage} » désigne ${candidats.length} réglages : donner l'adresse complète`, candidats };
    return { code: 0, verdict: "HORS_REGISTRE", ecart, produit, message: `« ${reglage} » ne figure pas au registre des réglages sûrs : aucun retour n'est ouvert vers la forge qui crée. Si le réglage mérite d'y entrer, c'est une candidature à part (TF-2225)` };
  }
  const base = { ecart, produit, reglage: entree.reglage, plateforme: entree.plateforme, source_url: entree.source_url, classement: entree.classement };
  if (entree.classement === "decision") {
    if (!decision) {
      return { code: 1, verdict: "ECART_NU", ...base, message: `écart ${ecart} sur un réglage classé « decision » sans décision nommée : un écart accepté se vérifie tel que décidé, il ne reste jamais nu. Nommer la décision (--decision D-nn), ou la poser au porteur si elle n'existe pas` };
    }
    return { code: 0, verdict: "RENVOI_DECISION", ...base, decision,
      message: `écart ${ecart} sur un réglage classé « decision » : aucun retour vers la forge qui crée. Il renvoie à ${decision} ; l'audit vérifie l'écart tel que décidé (attendu du registre : ${entree.attendu})` };
  }
  const titre = `${FORGE_QUI_CREE} : le script de création n'applique pas « ${entree.reglage} » (${entree.plateforme}), écart ${ecart} trouvé par l'audit`;
  const contenu = `L'audit${audit ? ` « ${audit} »` : ""} de ${produit} trouve l'écart ${ecart} : le réglage « ${entree.reglage} » est resté à sa valeur d'origine. `
    + `Le registre des réglages sûrs le classe « defaut » (c1 à c5 tenus, page de l'éditeur ${entree.source_url}) : la forge qui crée doit l'écrire à la création du projet, puis le relire. `
    + `Attendu à la lecture : ${entree.attendu}. La correction chez ${produit} referme l'écart pour ce produit seulement ; sans ce retour, le produit suivant le rouvre. `
    + `Proposition : le script de création joue la commande de pose du registre, puis sa commande de lecture, et consigne l'état lu (TF-2228).`;
  const candidature = {
    schema: 1, titre, contenu, demandeur: produit, date_demande: date,
    source: `${audit ? `audit « ${audit} » de ${produit}` : `audit de ${produit}`}, écart ${ecart}`,
    forges_cibles_initiales: [FORGE_QUI_CREE],
    score: { gain: 3, preuve: 4, effort: 2 },
    preuve_du_cout: `écart ${ecart} : une option gratuite laissée à sa valeur d'origine, corrigée à la main chez ${produit}`,
    classe: CLASSE,
  };
  return { code: 0, verdict: "A_OUVRIR", ...base, forge: FORGE_QUI_CREE,
    message: `écart ${ecart} sur un réglage classé « defaut » : la correction chez ${produit} ne suffit pas. Un retour s'ouvre vers ${FORGE_QUI_CREE} (candidature ci-dessous, à ingérer avec todo\\ingerer-lot.mjs)`, candidature };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify({ outil: "ouvrir-retour-reglage", ...corps, non_juge: NON_JUGE }, null, 1) + "\n"); process.exit(code); };
  const chemin = valeur("--registre") || REGISTRE_PAR_DEFAUT;
  if (!existsSync(chemin)) sortir({ verdict: "APPEL_INUTILISABLE", message: `registre introuvable : ${chemin}` }, 2);
  let registre;
  try { registre = chargerRegistre(chemin); } catch (e) { sortir({ verdict: "APPEL_INUTILISABLE", message: `registre illisible : ${e.message}` }, 2); }
  if (!Array.isArray(registre)) sortir({ verdict: "APPEL_INUTILISABLE", message: "le registre n'est pas un tableau d'entrées" }, 2);
  const r = aiguiller(registre, { reglage: valeur("--reglage"), ecart: valeur("--ecart"), produit: valeur("--produit"), audit: valeur("--audit"), decision: valeur("--decision"), date: valeur("--date") || undefined });
  const { code, ...corps } = r;
  sortir(corps, code);
}
