/**
 * lib-garde-arbre-suivi.mjs — UNE RECETTE N'ÉCRIT PAS DANS L'ARBRE SUIVI (TF-1690, 14/10/2026).
 *
 * LE FAIT. À chaque passage de `oracles\self-tests.mjs`, deux recettes écrivaient dans des fichiers
 * SUIVIS du dépôt : celle de `scripts\generer-page-etude.mjs` régénérait la page d'une étude réelle
 * d'`output\03-etudes\` à côté de sa source, et celle de `scripts\lib-extensions-jugees.mjs` écrasait
 * `references\EXTENSIONS-JUGEES.json` par quatre référentiels fautifs avant de le remettre. Aucune ne
 * le disait. Une recette qui écrit dans l'arbre suivi salit le dépôt, se fait enregistrer par un
 * commit voisin, et, sur un poste où une autre session travaille, lui fait lire un référentiel faux
 * pendant le passage.
 *
 * LA GARDE. Avant et après chaque recette, le harnais relève l'état des fichiers SUIVIS ; un écart
 * nomme la recette et les chemins qu'elle a écrits. Deux signaux, parce qu'un seul ne voit pas les
 * deux cas fondateurs :
 *   · la ligne de `git status --porcelain` du chemin — un contenu changé, ajouté ou supprimé ;
 *   · la taille et la date de modification du fichier — un fichier RÉÉCRIT, même remis à l'identique
 *     ou seulement dans ses fins de ligne, ce que `git status` ne voit pas quand la conversion des fins
 *     de ligne ramène le contenu au même objet (les deux cas du 14/10/2026 étaient de cette sorte).
 *
 * CE QU'ELLE NE JUGE PAS, et c'est dit : une écriture faite par un AUTRE processus pendant la recette
 * (une session vivante sur le même dépôt) lui est imputée — le chemin est nommé, rejouer la recette
 * seule tranche ; une écriture hors des fichiers suivis (fichier non suivi, dossier temporaire) ;
 * un dépôt sans git, où la garde se déclare non jouée plutôt que verte.
 */
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";

// Les variables GIT_* d'un hameçon (GIT_DIR, GIT_INDEX_FILE) feraient relever un AUTRE dépôt que
// `racine` : elles sont retirées, le dépôt se lit depuis le dossier et lui seul.
export const ENV_SANS_GIT = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^GIT_/i.test(k)));
const git = (racine, args) => spawnSync("git", args, { cwd: racine, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: ENV_SANS_GIT });

/**
 * Relève l'état des fichiers SUIVIS de `racine` : leur statut porcelain et leur empreinte de
 * modification (taille, date). Rend `null` hors d'un dépôt git ou sans git : la garde ne peut pas
 * jouer, et l'appelant le DIT.
 */
export function releverSuivis(racine) {
  const st = git(racine, ["status", "--porcelain=v1", "-z", "--untracked-files=no"]);
  if (st.error || st.status !== 0) return null;
  const ls = git(racine, ["ls-files", "-z"]);
  if (ls.error || ls.status !== 0) return null;
  const statut = new Map();
  const morceaux = st.stdout.split("\0");
  for (let i = 0; i < morceaux.length; i++) {
    const e = morceaux[i];
    if (!e) continue;
    const xy = e.slice(0, 2);
    statut.set(e.slice(3), xy);
    // Un renommage ou une copie porte le chemin d'origine dans le morceau suivant (format -z).
    if (/[RC]/.test(xy[0])) i++;
  }
  const empreinte = new Map();
  for (const chemin of ls.stdout.split("\0").filter(Boolean)) {
    let s = null;
    try { s = statSync(join(racine, chemin)); } catch { /* supprimé : marqué absent */ }
    empreinte.set(chemin, s ? `${s.size}:${s.mtimeMs}` : "absent");
  }
  return { statut, empreinte };
}

/** Les chemins suivis écrits entre deux relevés, triés. */
export function ecritsEntre(avant, apres) {
  const chemins = new Set([...avant.empreinte.keys(), ...apres.empreinte.keys(), ...avant.statut.keys(), ...apres.statut.keys()]);
  return [...chemins].filter((c) => avant.empreinte.get(c) !== apres.empreinte.get(c)
    || (avant.statut.get(c) || "") !== (apres.statut.get(c) || "")).sort();
}

/**
 * La garde d'un passage : `jouer(nom, fn)` exécute la recette `fn`, compare l'arbre suivi avant et
 * après, et consigne `{ nom, chemins }` quand elle a écrit. Le relevé d'après sert de relevé d'avant
 * à la recette suivante : un seul relevé par recette. `jouee` dit si la garde a pu jouer.
 */
export function creerGarde(racine) {
  let releve = releverSuivis(racine);
  const ecritures = [];
  return {
    jouee: releve !== null,
    ecritures,
    jouer(nom, fn) {
      const resultat = fn();
      if (releve) {
        const apres = releverSuivis(racine);
        if (apres) {
          const chemins = ecritsEntre(releve, apres);
          if (chemins.length) ecritures.push({ nom, chemins });
          releve = apres;
        }
      }
      return resultat;
    },
  };
}
