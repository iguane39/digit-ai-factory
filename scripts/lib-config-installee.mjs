/**
 * lib-config-installee.mjs — LE seul endroit qui sait OÙ VIT la configuration que la session
 * charge réellement (TF-0995, 09/09/2026).
 *
 * ============================================================================================
 * POURQUOI CE FICHIER EXISTE
 * ============================================================================================
 *
 * Un skill, un hook, un câblage vivent en deux exemplaires : la source versionnée dans une forge,
 * et la COPIE INSTALLÉE, qui est celle que la session invoque. Toute la chaîne d'alignement du
 * parc — `bootstrap.mjs`, `oracle-skills`, les sondes qui cherchent le socle `digit-ai-page-html`
 * — résolvait cette copie par `join(homedir(), ".claude")`, écrit en dur, huit fois.
 *
 * Or le harnais ne charge pas `~/.claude` quand la variable de plateforme `CLAUDE_CONFIG_DIR` est
 * posée : il charge le répertoire qu'elle désigne. Le 09/09/2026, une session ouverte avec
 * `CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-b` a mesuré 24 skills « alignés » sous `~/.claude` et
 * en a chargé ZÉRO — le répertoire réellement lu était vide. Conséquences enchaînées, toutes
 * constatées : K1 et K2 verts, `bootstrap` écrivant « Poste prêt — skills alignés », K7 confrontant
 * un `settings.json` que le harnais ne lit pas, et le noyau de niveau poste (`CLAUDE.md`, qui porte
 * la loi transverse « tout livrable passe par `quality-oracles` ») jamais chargé de toute la
 * session. Le défaut s'est payé côté humain — une demande employant une formule du lexique
 * d'invocation traitée sans le skill — et a été trouvé par CONTESTATION, pas par un contrôle.
 *
 * LE DÉFAUT EST INVISIBLE PAR CONSTRUCTION, et c'est la partie qui compte. Les artefacts étaient
 * bien là, alignés, à jour. Aucun contrôle ne pouvait broncher : tous regardaient le même mauvais
 * endroit, et AUCUN VERDICT NE NOMMAIT LE RÉPERTOIRE MESURÉ. C'est cette deuxième moitié qui rend
 * le défaut indétectable — un verdict qui ne dit pas où il a regardé ne se conteste pas. D'où le
 * contrat ci-dessous : la fonction ne rend jamais un chemin seul, elle rend le chemin ET la
 * variable qui l'a décidé, pour que l'appelant puisse l'imprimer en PASS comme en FAIL.
 *
 * Classe de défaut : `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`
 * (famille `regle-morte`, `todo/CLASSES.json` v1.4.0).
 *
 * ============================================================================================
 * L'ORDRE DE PRÉCÉDENCE, ET POURQUOI IL EST CELUI-LÀ
 * ============================================================================================
 *
 *   1. `FORGE_SKILLS_INSTALLES` — variable propre à la forge, la plus spécifique : elle désigne
 *      un dossier de SKILLS directement. C'est la voie des RECETTES, qui doivent pouvoir pointer
 *      un dossier de fixtures sans toucher à la configuration du poste. Elle reste prioritaire.
 *   2. `CLAUDE_CONFIG_DIR` — variable de la PLATEFORME : ce que le harnais charge vraiment. Elle
 *      prime sur le défaut, parce qu'entre « ce que la session lit » et « ce qu'on suppose qu'elle
 *      lit », c'est toujours la première qui a raison.
 *   3. `~/.claude` — le défaut historique, qui reste juste tant qu'aucune variable n'est posée.
 *
 * Une variable posée à la chaîne vide est traitée comme ABSENTE : sur Windows, une variable
 * effacée par `set VAR=` se présente vide plutôt que non définie, et résoudre la racine de
 * configuration à la racine du disque serait pire que le défaut qu'on corrige.
 */

import { homedir } from "node:os";
import { join, resolve } from "node:path";

/** Une variable d'environnement posée ET non vide, sinon `null`. Voir la note sur `set VAR=`. */
function posee(env, nom) {
  const v = env[nom];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

/**
 * La RACINE de configuration que la session charge réellement.
 * @returns {{racine: string, decidee_par: string, variable: string|null}}
 *   `racine` : chemin absolu ; `variable` : le nom de la variable qui l'a décidé, ou `null` pour
 *   le défaut ; `decidee_par` : la même chose en clair, à imprimer tel quel dans un verdict.
 */
export function racineConfigInstallee(env = process.env) {
  const v = posee(env, "CLAUDE_CONFIG_DIR");
  if (v) return { racine: resolve(v), decidee_par: `CLAUDE_CONFIG_DIR=${v}`, variable: "CLAUDE_CONFIG_DIR" };
  return { racine: join(homedir(), ".claude"), decidee_par: "défaut ~/.claude (aucune variable posée)", variable: null };
}

/**
 * Le dossier des SKILLS installés — `FORGE_SKILLS_INSTALLES` d'abord (recettes), sinon
 * `<racine de configuration>/skills`.
 * @returns {{chemin: string, decide_par: string, variable: string|null}}
 */
export function skillsInstalles(env = process.env) {
  const v = posee(env, "FORGE_SKILLS_INSTALLES");
  if (v) return { chemin: resolve(v), decide_par: `FORGE_SKILLS_INSTALLES=${v}`, variable: "FORGE_SKILLS_INSTALLES" };
  const r = racineConfigInstallee(env);
  return { chemin: join(r.racine, "skills"), decide_par: r.decidee_par, variable: r.variable };
}

/** Le dossier des HOOKS installés — frère des skills sous la racine de configuration. */
export function hooksInstalles(env = process.env) {
  const r = racineConfigInstallee(env);
  return { chemin: join(r.racine, "hooks"), decide_par: r.decidee_par, variable: r.variable };
}

/** Le fichier de CÂBLAGE installé — celui que le harnais exécute, pas celui qu'une forge décrit. */
export function settingsInstalle(env = process.env) {
  const r = racineConfigInstallee(env);
  return { chemin: join(r.racine, "settings.json"), decide_par: r.decidee_par, variable: r.variable };
}

/** Raccourci historique : le seul chemin des skills, sans sa provenance. Préférer `skillsInstalles`
 *  partout où le chemin part dans un VERDICT — la provenance est la moitié qui rend le défaut
 *  détectable. */
export function cheminSkillsInstalles(env = process.env) {
  return skillsInstalles(env).chemin;
}
