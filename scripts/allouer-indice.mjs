#!/usr/bin/env node
/**
 * allouer-indice.mjs — l'ALLOCATION d'indice livrée comme une fonction, pas seulement la
 * violation comme un verdict (TF-0691, 28/08/2026).
 *
 * LE FAIT QUI LE REND NÉCESSAIRE, mesuré sur un dépôt de produit le 27/08 : un générateur de
 * fiche portait son nom de sortie dans une CONSTANTE (`const BASE = "… - Dev - 20260827a"`) et
 * a réécrit le même fichier quatre fois en 80 minutes — trois contenus différents sous un seul
 * nom, dont deux poussés. `verifier-jugement.mjs` n'y pouvait rien PAR CONSTRUCTION : il compare
 * un livrable à un sceau posé au premier passage d'oracles, or un générateur écrit son nom de
 * sortie AVANT tout passage d'oracle — il n'y a pas de sceau à ce moment-là. C'est la
 * reproduction exacte du défaut fondateur de TF-0523, quatre jours après son remède, par la voie
 * que le remède ne couvre pas.
 *
 * LE CONTRAT (règle 5 des règles de projet — une nouvelle version = un NOUVEAU fichier daté) :
 *   · rien n'existe pour ce jour                  → indice `a` ;
 *   · un fichier du jour porte le MÊME contenu    → SON indice — une re-génération à contenu
 *     inchangé n'est pas une nouvelle version, sinon l'outil pond un fichier par lancement ;
 *   · sinon                                       → l'indice SUIVANT le dernier pris ;
 *   · le dernier pris est « z » (TF-1850)         → la PREMIÈRE LETTRE LIBRE DU JOUR DANS LE
 *     DOSSIER (tous radicaux, comme R-4) ; les 26 prises → erreur claire, jamais un nom refusé.
 *
 * LA COMPARAISON SE FAIT SUR UNE FORME CANONIQUE où l'indice est neutralisé, parce que la
 * référence imprimée DANS le document (`REF-…-20260827a`, nom de fichier auto-cité) contient
 * l'indice : sans neutralisation, deux contenus identiques différeraient toujours d'une lettre
 * et l'outil allouerait un indice neuf à chaque lancement — le défaut qu'il existe pour fermer.
 *
 * Usage comme module (la voie prévue — tout générateur de la bibliothèque l'importe au lieu de
 * porter une constante) :
 *   import { allouerIndice } from "<pilot>/scripts/allouer-indice.mjs";
 *   const indice = allouerIndice({ dossier, prefixe: "Client - Fiche - Dev - ",
 *                                  jour: "20260831", contenu, extension: ".html" });
 *   const nom = `${prefixe}${jour}${indice}${extension}`;
 *
 * PORTÉE DE LA RECHERCHE D'INDICES PRIS (TF-1450, 28/09/2026). Par défaut (`porte: "prefixe"`),
 * la fonction ne voit QUE les fichiers de son propre `prefixe` — or R-4 (`oracle-conformite-
 * projet.mjs`) juge l'indice unique PAR JOUR ET PAR DOSSIER, tous radicaux confondus (TF-0750).
 * Mesuré le 28/09 : dans un dossier où « <Marque> - Étude - 20260928a » existait déjà, un appel
 * pour un AUTRE radical (« <Marque> - Rapport - 20260928… ») avec la portée par défaut a rendu
 * « a » — collision immédiate avec le livrable existant, renommage manuel après coup. Passer
 * `porte: "dossier"` compte tous les fichiers du dossier qui portent CE jour, quel que soit leur
 * préfixe ou leur extension — le même repérage que R-4 — et c'est la portée à employer pour
 * RÉINDEXER un livrable que R-4 vient de signaler en collision :
 *   const indice = allouerIndice({ dossier, prefixe, jour, contenu, extension, porte: "dossier" });
 *
 * Ce que ce module NE fait PAS, et c'est déclaré :
 *   · il n'écrit RIEN — il rend une lettre, le générateur écrit ;
 *   · il ne juge pas le contenu — `verifier-jugement.mjs` reste le juge de l'édition manuelle ;
 *   · il ne voit pas deux générateurs qui écrivent le même nom EN MÊME TEMPS — la fenêtre
 *     existe, comme pour toute allocation par lecture du disque.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LETTRES = "abcdefghijklmnopqrstuvwxyz";

/** La forme canonique : chaque occurrence de `<jour><lettre>` perd sa lettre. */
export const canonique = (texte, jour) =>
  String(texte).replaceAll(new RegExp(`${jour}[a-z]`, "g"), jour);

/**
 * Rend l'indice à employer pour écrire `${prefixe}${jour}<indice>${extension}` dans `dossier`.
 * Voir le contrat en tête de fichier.
 */
export function allouerIndice({ dossier, prefixe, jour, contenu, extension = ".html", porte = "prefixe" }) {
  if (!/^\d{8}$/.test(String(jour))) throw new Error(`jour attendu AAAAMMJJ, reçu « ${jour} »`);
  // TF-1450 : portée « dossier » — tous les radicaux du jour, quel que soit leur préfixe ou leur
  // extension (même repérage que R-4, ` - AAAAMMJJ<lettre>.<ext>` en fin de nom). Portée « prefixe »
  // (par défaut, inchangée) : uniquement CE préfixe, la seule que R-4 ne peut pas voir en collision.
  const motif = porte === "dossier"
    ? new RegExp(` - ${jour}([a-z])\\.[\\w.]+$`)
    : new RegExp(
      `^${String(prefixe).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${jour}([a-z])${String(extension).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
  const pris = existsSync(dossier)
    ? readdirSync(dossier).map((f) => ({ f, m: f.match(motif) })).filter((x) => x.m)
      .map(({ f, m }) => ({ lettre: m[1], nom: f }))
      .sort((a, b) => a.lettre.localeCompare(b.lettre))
    : [];
  if (!pris.length) return "a";
  // TF-1863 : sans `contenu` (appel en ligne de commande, rien à comparer), pas de recherche d'identité.
  if (contenu !== undefined) {
    const mienne = canonique(contenu, jour);
    for (const { lettre, nom } of pris) {
      let existant;
      try { existant = readFileSync(join(dossier, nom), "utf8"); } catch { continue; }
      if (canonique(existant, jour) === mienne) return lettre;
    }
  }
  const derniere = pris[pris.length - 1].lettre;
  const suivant = LETTRES.indexOf(derniere) + 1;
  if (suivant < LETTRES.length) return LETTRES[suivant];
  // TF-1850 (18/10/2026, RP-13) : « z » est pris et la suivante n'existe pas — l'ancienne branche
  // rendait « z », un nom DÉJÀ PRIS. R-4 n'admet qu'UNE lettre (` - \d{8}[a-z]?\.`) et la juge par
  // jour ET par dossier, tous radicaux confondus : on rend donc la PREMIÈRE LETTRE LIBRE DU JOUR
  // DANS LE DOSSIER, quelle que soit la portée demandée (une lettre libre pour CE préfixe peut être
  // prise par un AUTRE radical, que R-4 verrait en collision). Mesuré le 15/10 : 17 lettres du jour
  // restaient libres dans 06-rapports. Aucune libre : l'outil échoue, il ne rend pas un nom que
  // l'oracle de nommage refuserait.
  const motifDossier = new RegExp(` - ${jour}([a-z])\\.[\\w.]+$`);
  const prisDuDossier = new Set(readdirSync(dossier).map((f) => f.match(motifDossier)).filter(Boolean).map((m) => m[1]));
  const libre = [...LETTRES].find((l) => !prisDuDossier.has(l));
  if (!libre) {
    throw new Error(`aucune lettre libre pour le jour ${jour} dans ${dossier} : les 26 lettres a-z sont prises `
      + "(R-4 n'admet qu'une lettre par jour et par dossier) — ranger ce livrable dans un autre dossier, ou le dater du jour suivant");
  }
  return libre;
}

/**
 * POINT D'ENTRÉE EN LIGNE DE COMMANDE (TF-1863, 19/10/2026, R-58 option a). Six documents prescrivent
 * `node scripts\allouer-indice.mjs` ; le module n'avait aucun point d'entrée, la commande se terminait
 * sans rien dire. Elle imprime désormais l'indice (une lettre) sur la sortie standard.
 *
 *   node scripts/allouer-indice.mjs [dossier] [prefixe] [jour]
 *   node scripts/allouer-indice.mjs --dossier <d> --prefixe <p> --jour AAAAMMJJ [--extension .md]
 *                                   [--contenu-fichier <f>] [--porte dossier|prefixe]
 *
 * Défauts : dossier = répertoire courant, prefixe = « » (aucun), jour = aujourd'hui (heure locale),
 * portée « dossier » (celle de R-4 : une lettre par jour et par dossier, tous radicaux confondus ;
 * « prefixe » reste demandable). Sans `--contenu-fichier`, aucune identité de contenu n'est cherchée :
 * l'indice rendu est la lettre qui suit la dernière prise. Sortie 0 = indice imprimé ; 1 = dossier plein
 * ou jour mal formé ; 2 = usage erroné.
 */
export function executerCli(argv, { sortie = (t) => process.stdout.write(t), erreur = (t) => process.stderr.write(t) } = {}) {
  const valeurs = {};
  const positions = [];
  const AVEC_VALEUR = new Set(["dossier", "prefixe", "jour", "extension", "contenu-fichier", "porte"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const cle = a.slice(2);
      if (!AVEC_VALEUR.has(cle) || i + 1 >= argv.length) { erreur(`option inconnue ou sans valeur : ${a}\n`); return 2; }
      valeurs[cle] = argv[++i];
    } else positions.push(a);
  }
  if (positions.length > 3) { erreur("trop d'arguments : [dossier] [prefixe] [jour]\n"); return 2; }
  const [pDossier, pPrefixe, pJour] = positions;
  const dossier = valeurs.dossier ?? pDossier ?? process.cwd();
  const prefixe = valeurs.prefixe ?? pPrefixe ?? "";
  const porte = valeurs.porte ?? "dossier";
  if (porte !== "dossier" && porte !== "prefixe") { erreur("--porte attend « dossier » ou « prefixe »\n"); return 2; }
  const d = new Date();
  const aujourdhui = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const jour = String(valeurs.jour ?? pJour ?? aujourdhui).replaceAll("-", "");
  let contenu;
  if (valeurs["contenu-fichier"] !== undefined) {
    try { contenu = readFileSync(valeurs["contenu-fichier"], "utf8"); }
    catch (e) { erreur(`contenu illisible : ${e.message}\n`); return 2; }
  }
  try {
    sortie(`${allouerIndice({ dossier, prefixe, jour, contenu, extension: valeurs.extension ?? ".html", porte })}\n`);
    return 0;
  } catch (e) { erreur(`${e.message}\n`); return 1; }
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  process.exit(executerCli(process.argv.slice(2)));
}
