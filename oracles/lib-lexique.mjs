/**
 * lib-lexique.mjs — LE LEXIQUE DU CLIENT, RÉSOLU DEPUIS LE SOCLE DU PRODUIT.
 *
 * POURQUOI CE MODULE EXISTE (TF-1045, 16/09/2026). Deux oracles doivent lire la même liste :
 * `oracle-ecriture` (EC-7, jouée à chaque écriture d'un `.md` — c'est là que le producteur
 * rencontre la règle au moment où il produit) et `oracle-synthese` (S46, jouée sur tout message de
 * fin de tour). Les faire lire deux implémentations serait exactement la classe
 * `oracle-remplace-par-controle-maison` que le registre compte par ailleurs.
 *
 * LE FAIT QUI L'A FAIT NAÎTRE, et il tient en une phrase : un retour de vocabulaire a été clos
 * « corrigé » le 08/09 et le client a redemandé le même mot le 10/09. Mesure du 11/09 : le
 * référentiel de jargon du pilot ne portait pas le terme, le `CLAUDE.md` du produit ne citait
 * aucun lexique, et `oracle-synthese` — le gate que toute synthèse traverse — ne lisait aucun
 * glossaire. Deux synthèses employant le terme étaient PASS sur 41 règles. *Le producteur n'avait
 * rencontré la règle NULLE PART sur son chemin.*
 *
 * POURQUOI CHEZ LE PRODUIT ET PAS AU PILOT. Le vocabulaire d'un destinataire appartient à son
 * produit. Le terme du retour fondateur — « grain » — est un mot ordinaire du français et un terme
 * JUSTE dans la doctrine du pilot ; une liste globale accuserait la prose de la factory pour un
 * retour reçu ailleurs, et un oracle qui crie sur l'usage légitime se fait désactiver dans la
 * semaine. Le lexique vit donc dans le socle du produit, et son absence rend SANS_OBJET.
 *
 * OÙ IL EST CHERCHÉ, ET POURQUOI DEUX POINTS DE DÉPART. Le fichier jugé d'abord : c'est le cas
 * ordinaire, un livrable du produit. Le répertoire courant ensuite, et sans lui la règle
 * DÉCORERAIT — le hook de fin de tour écrit le message dans un répertoire temporaire avant de le
 * faire juger, donc le chemin jugé ne mène à aucun projet. Le `cwd` du hook, lui, est la racine de
 * la session : c'est le produit. Une règle qui ne se joue jamais là où elle compte le plus est une
 * règle qui décore.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** Les emplacements admis, dans l'ordre : le socle du produit, puis celui d'un dépôt de la forge. */
const EMPLACEMENTS = [
  join("forge", "LEXIQUE.json"),
  join("docs", "projet", "LEXIQUE.json"),
  join("references", "LEXIQUE.json"),
];

// ---- LE LEXIQUE TRANSVERSE (TF-1150, 17/09/2026) — CE QUE L'HUMAIN A TRANCHÉ POUR TOUS --------
//
// LE FAIT : le terme « grain » a été corrigé chez un produit (TF-1045), et le lexique recopié chez
// un SECOND le 16/09 est arrivé vide — le fichier ne porte que le lexique de SON client. Le même
// humain a redemandé le mot une TROISIÈME fois, sur un troisième livrable. *Une règle dont la
// portée est le produit ne protège aucun autre produit, et c'est mécanique, pas accidentel.*
//
// CE QUI N'EST PAS CONTREDIT. `LEXIQUE-PRODUIT.json` refuse une liste globale DÉDUITE d'un retour
// reçu ailleurs, et il a raison : un mot corrigé chez un client ne se propage pas par contagion.
// Ici rien n'est déduit — c'est l'humain qui étend la portée, et chaque entrée porte la citation
// qui l'ordonne. Les deux fichiers cohabitent donc, et leurs termes se CUMULENT : l'un dit ce
// qu'un lecteur nommé a refusé chez lui, l'autre ce que le décideur a tranché une fois pour toutes.
const EMPLACEMENTS_TRANSVERSE = [
  join("forge", "LEXIQUE-TRANSVERSE.json"),
  join("docs", "projet", "LEXIQUE-TRANSVERSE.json"),
  join("references", "LEXIQUE-TRANSVERSE.json"),
];

/** La racine d'un projet : le premier parent qui porte un `.git`, un `forge\` ou un `CLAUDE.md`. */
function racinesDepuis(depart) {
  const sorties = [];
  let d = depart;
  for (let i = 0; i < 12 && d; i++) {
    sorties.push(d);
    const parent = dirname(d);
    if (parent === d) break;
    d = parent;
  }
  return sorties;
}

/**
 * Rend `{ trouve, chemin, termes }`. `trouve` faux = SANS_OBJET, jamais PASS par silence.
 * `termes` : `[{ proscrit, remplacer_par, depuis, preuve }]`, les entrées sans `proscrit` ignorées.
 */
function premierLexique(departs, emplacements, origine) {
  for (const depart of departs) {
    for (const d of racinesDepuis(depart)) {
      for (const rel of emplacements) {
        const f = join(d, rel);
        if (!existsSync(f)) continue;
        try {
          const j = JSON.parse(readFileSync(f, "utf8"));
          const termes = (j.termes || [])
            .filter((t) => t && typeof t.proscrit === "string" && t.proscrit.trim())
            .map((t) => ({ ...t, origine }));
          return { trouve: true, chemin: f, termes };
        } catch (e) {
          return { trouve: true, chemin: f, termes: [], illisible: e.message };
        }
      }
    }
  }
  return { trouve: false, chemin: null, termes: [] };
}

export function chargerLexique({ cheminJuge = null, cwd = process.cwd() } = {}) {
  const departs = [];
  if (cheminJuge) {
    try {
      const abs = resolve(cheminJuge);
      departs.push(statSync(abs).isDirectory() ? abs : dirname(abs));
    } catch { /* chemin non résolu : on se rabat sur le cwd */ }
  }
  departs.push(resolve(cwd));
  const produit = premierLexique(departs, EMPLACEMENTS, "produit");
  const transverse = premierLexique(departs, EMPLACEMENTS_TRANSVERSE, "transverse");
  if (!produit.trouve && !transverse.trouve) return { trouve: false, chemin: null, chemins: [], termes: [] };
  // UN SEUL TERME PAR MOT PROSCRIT, et c'est le lexique du PRODUIT qui l'emporte : son lecteur est
  // nommé, et il a pu retenir un autre remplacement que le décideur. Le cumul n'est pas une fusion
  // aveugle — deux constats pour le même mot feraient corriger deux fois la même phrase.
  const vus = new Set();
  const termes = [];
  for (const t of [...produit.termes, ...transverse.termes]) {
    const cle = t.proscrit.trim().toLowerCase();
    if (vus.has(cle)) continue;
    vus.add(cle);
    termes.push(t);
  }
  const chemins = [produit.chemin, transverse.chemin].filter(Boolean);
  const illisible = produit.illisible || transverse.illisible;
  return {
    trouve: true,
    chemin: chemins.join(" + "),
    chemins,
    termes,
    ...(illisible && !termes.length ? { illisible } : {}),
  };
}

/**
 * Les termes proscrits EMPLOYÉS dans un texte. La recherche se fait HORS CODE : ce qui vit entre
 * accents graves ou dans un bloc est une sortie, un nom de champ ou un identifiant machine — une
 * citation, jamais une déclaration d'intention. C'est la borne payée par TF-0992 le même jour, et
 * la ne pas reprendre ici reproduirait le défaut à l'identique : le lexique ferait paraphraser des
 * preuves exactes pour satisfaire un contrôle.
 */
export function termesEmployes(texte, termes) {
  const prose = String(texte).replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
  const trouves = [];
  for (const t of termes) {
    const mot = t.proscrit.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Frontière UNICODE : une frontière ASCII ne voit pas les lettres accentuées et fabriquerait
    // des mots que personne n'a écrits (TF-0805, puis TF-0987 par l'autre bout).
    const re = new RegExp(`(?<![\\p{L}\\p{N}_])${mot}s?(?![\\p{L}\\p{N}_])`, "giu");
    const n = (prose.match(re) || []).length;
    if (n) trouves.push({ ...t, occurrences: n });
  }
  return trouves;
}
