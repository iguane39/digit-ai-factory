#!/usr/bin/env node
/**
 * verifier-hook-poste.mjs — L'ENTRÉE DU DISPOSITIF EST-ELLE DÉCLARÉE EN PORTÉE POSTE ?
 * (TF-1285, décision humaine D-2 (b) du 22/09/2026.)
 *
 * ============================================================================================
 * LE FAIT, ET POURQUOI IL FALLAIT UN POSEUR PLUTÔT QU'UNE CONSIGNE
 * ============================================================================================
 *
 * Le 22/09/2026 à 10:16, un projet neuf s'ouvre, son premier message cite nommément le dépôt du
 * dispositif, et rien ne s'enclenche. Mesure du poste le même jour : aucun `settings.json` de
 * portée poste, donc aucun hameçon `UserPromptSubmit`. Le hameçon de la bonne FORME existait, et
 * il vivait en portée PRODUIT — posé par `gabarits\settings-produit.json` à l'ouverture du run.
 * *Le déclencheur était installé par le geste qu'il devait déclencher.*
 *
 * Une consigne « pose ce hameçon au poste » aurait eu le même sort que celle d'`AGENTS.md`, qui
 * prescrivait correctement l'ordre de résolution du pilot et que personne n'a lue : elle vit dans
 * un dépôt qu'un agent doit d'abord décider d'ouvrir. Ce poseur suit donc le patron déjà éprouvé
 * du dépôt pour les gardes de pré-commit (`verifier-hooks-git.mjs`, TF-1041) : `bootstrap.mjs`
 * MESURE à chaque ouverture, et n'INSTALLE que sous `--pull`.
 *
 * ============================================================================================
 * LA FUSION EST NON DESTRUCTIVE, ET C'EST LA SEULE FORME ADMISE
 * ============================================================================================
 *
 * `~/.claude/settings.json` est la configuration de l'humain : son modèle, son thème, ses
 * permissions, ses autres hameçons. Ce fichier ne se réécrit pas, il se COMPLÈTE :
 *
 *   · toute clé de premier niveau autre que `hooks` est rendue à l'identique ;
 *   · sous `hooks`, tout événement autre qu'`UserPromptSubmit` est rendu à l'identique ;
 *   · sous `UserPromptSubmit`, les entrées déjà présentes sont CONSERVÉES, et la nôtre s'ajoute
 *     à la suite. Un hameçon étranger sur le même événement continue de tourner.
 *   · l'indentation et la fin de ligne du fichier existant sont RELUES et rendues telles quelles,
 *     pour que le diff ne porte que l'entrée ajoutée. Un rendu imposé à un fichier qui vit dans
 *     une autre convention a coûté 2 625 lignes réécrites pour 44 utiles ailleurs dans le parc.
 *
 * L'IDEMPOTENCE se mesure sur la COMMANDE, pas sur un marqueur : une entrée dont la commande
 * nomme déjà `hook-amorcage.mjs` suffit, quel que soit le chemin absolu du pilot qui la porte.
 * Deux clones du pilot sur un même poste ne poseraient donc pas deux hameçons — et ce poste en a
 * porté un second, avec 110 enregistrements de retard.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ
 * ============================================================================================
 *
 *   HP1 · le `settings.json` de portée poste déclare un hameçon `UserPromptSubmit` dont la
 *         commande nomme `hook-amorcage.mjs` ;
 *   HP2 · le script que cette commande nomme EXISTE sur le disque. Un hameçon déclaré dont le
 *         script est absent ne tourne pas, et il rassure au lieu d'agir (même famille que le
 *         contrôle sans chemin d'échec, TF-0795).
 *
 * `--installer` pose l'entrée manquante. Il ne retire jamais rien, et ne touche à aucune autre
 * clé. Sans `--installer` : mesure seule, défaut nommé avec son remède.
 *
 * NON JUGÉ, et déclaré : que le harnais LISE effectivement ce fichier — cela dépend de la
 * plateforme et de `CLAUDE_CONFIG_DIR`, que ce script respecte sans le vérifier ; le CONTENU des
 * autres hameçons du poste ; et le fait qu'un hameçon déclaré s'exécute vraiment, qui ne se lit
 * dans aucun fichier.
 *
 * Usage : node scripts/verifier-hook-poste.mjs [--installer] [--settings <fichier>] [--pilot <dossier>]
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable (aucune racine de configuration de poste).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { settingsInstalle } from "./lib-config-installee.mjs";
// LA LISTE DES PROFILS EST CELLE DE L'ORACLE, jamais une seconde liste (TF-1285). Un poseur et
// son juge qui tiennent deux listes divergent au premier profil ajouté, et le juge accuse alors
// un profil que le poseur ne sait pas atteindre — c'est la classe
// `severite-declaree-invisible-au-consommateur`.
import { POSTES_PAR_DEFAUT } from "../oracles/oracle-amorcage-poste.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT_PAR_DEFAUT = resolve(join(ICI, ".."));
const args = process.argv.slice(2);
const INSTALLER = args.includes("--installer");
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 && args[i + 1] ? args[i + 1] : null; };

export const EVENEMENT = "UserPromptSubmit";
export const SCRIPT_HAMECON = "hook-amorcage.mjs";
/** Le délai : le hameçon lit un message, résout un chemin, et sort. 10 s est la valeur du gabarit produit. */
export const DELAI = 10;

/** La commande qu'une entrée de poste doit porter, pour un pilot donné. */
export const commandePour = (pilot) => `node "${join(resolve(pilot), "oracles", SCRIPT_HAMECON)}"`;

/** Une entrée d'hameçon nomme-t-elle notre script ? Mesuré sur la COMMANDE, jamais sur un marqueur. */
export const estNotreHamecon = (commande) => new RegExp(SCRIPT_HAMECON.replace(".", "\\.")).test(String(commande || ""));

/** Le chemin de script que cite une commande, s'il en cite un — pour HP2. */
export function scriptCite(commande) {
  const m = String(commande).match(/(?:^|[\s"'])((?:[A-Za-z]:)?[^\s"']*[\\/][^\s"']*\.(?:mjs|cjs|js|py))/);
  return m ? m[1] : null;
}

/**
 * La forme du fichier existant, relue et jamais imposée : l'indentation de son premier niveau et
 * sa fin de ligne. Un fichier absent ou illisible rend la convention la plus répandue du parc.
 */
export function formeDe(texte) {
  const t = String(texte || "");
  const crlf = /\r\n/.test(t);
  const m = t.match(/\n([ \t]+)"/);
  let indent = 2;
  if (m) indent = m[1] === "\t" ? "\t" : m[1].length;
  const finaleNL = /\n$/.test(t) || t === "";
  return { indent, crlf, finaleNL };
}

/** Rend le JSON dans la forme relue. */
export function rendre(objet, forme) {
  let s = JSON.stringify(objet, null, forme.indent);
  if (forme.finaleNL) s += "\n";
  if (forme.crlf) s = s.replace(/\n/g, "\r\n");
  return s;
}

/**
 * La fusion. Rend `{ objet, deja }` — `deja` vrai si l'entrée était là. Aucune clé n'est retirée,
 * aucun autre événement n'est touché, et les entrées voisines du même événement sont conservées.
 */
export function fusionner(objet, pilot) {
  const j = objet && typeof objet === "object" ? { ...objet } : {};
  const hooks = j.hooks && typeof j.hooks === "object" ? { ...j.hooks } : {};
  const liste = Array.isArray(hooks[EVENEMENT]) ? [...hooks[EVENEMENT]] : [];
  const deja = liste.some((e) => (Array.isArray(e && e.hooks) ? e.hooks : []).some((h) => estNotreHamecon(h && h.command)));
  if (!deja) liste.push({ hooks: [{ type: "command", command: commandePour(pilot), timeout: DELAI }] });
  hooks[EVENEMENT] = liste;
  j.hooks = hooks;
  return { objet: j, deja };
}

/** Les entrées déclarées pour notre événement, à plat : `{ commande, index }`. */
export function entreesDeclarees(objet) {
  const liste = Array.isArray(objet?.hooks?.[EVENEMENT]) ? objet.hooks[EVENEMENT] : [];
  const out = [];
  for (const e of liste) for (const h of Array.isArray(e && e.hooks) ? e.hooks : []) out.push({ commande: String((h && h.command) || "") });
  return out;
}

export function juger({ settings, pilot }) {
  const constats = [];
  const brut = existsSync(settings) ? readFileSync(settings, "utf8") : "";
  let objet = null;
  if (brut.trim()) { try { objet = JSON.parse(brut); } catch { objet = undefined; } }
  if (objet === undefined) {
    constats.push(`[FAIL] HP1 — ${settings} est illisible (JSON invalide) : la fusion refuse d'écrire par-dessus un fichier qu'elle ne comprend pas. `
      + "Le réparer à la main, puis rejouer — écraser la configuration de l'humain sur une erreur de lecture échangerait un défaut contre une perte");
    return { verdict: "FAIL", constats, installe: false };
  }
  const nôtres = entreesDeclarees(objet).filter((e) => estNotreHamecon(e.commande));

  if (!nôtres.length) {
    if (!INSTALLER) {
      constats.push(`[FAIL] HP1 — aucun hameçon ${EVENEMENT} de portée poste ne nomme ${SCRIPT_HAMECON} dans ${settings}. `
        + "L'entrée du dispositif n'existe donc qu'en portée PRODUIT, posée par l'ouverture du run — c'est-à-dire par le geste "
        + "qu'elle devrait déclencher (TF-1285). Remède : `node bootstrap.mjs --pull`, qui la pose en fusion non destructive");
      return { verdict: "FAIL", constats, installe: false };
    }
    const { objet: fusionne } = fusionner(objet, pilot);
    mkdirSync(dirname(settings), { recursive: true });
    writeFileSync(settings, rendre(fusionne, formeDe(brut)), "utf8");
    constats.push(`[INSTALLÉ] hameçon ${EVENEMENT} de portée poste posé dans ${settings} — fusion non destructive, aucune autre clé touchée`);
    objet = fusionne;
  }

  // HP2 — le script nommé existe. Joué APRÈS l'installation éventuelle, sur l'état final.
  const absents = [];
  for (const e of entreesDeclarees(objet).filter((x) => estNotreHamecon(x.commande))) {
    const s = scriptCite(e.commande);
    if (s && !existsSync(s)) absents.push(s);
  }
  if (absents.length) {
    constats.push(`[FAIL] HP2 — ${absents.length} hameçon(s) déclaré(s) dont le script est ABSENT du disque : ${absents.join(", ")}. `
      + "Un hameçon dont le script n'existe pas ne tourne pas, et il rassure au lieu d'agir (TF-0795). "
      + "Cause la plus probable : le pilot a été déplacé ou recloné ailleurs. Remède : retirer l'entrée périmée du "
      + "`settings.json` du poste, puis `node bootstrap.mjs --pull`");
    return { verdict: "FAIL", constats, installe: constats.some((c) => c.startsWith("[INSTALLÉ]")) };
  }

  constats.push(`[PASS] HP1, HP2 — le poste déclare l'entrée du dispositif sur ${EVENEMENT}, et son script existe`);
  return { verdict: "PASS", constats, installe: constats.some((c) => c.startsWith("[INSTALLÉ]")) };
}

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  // `settingsInstalle` rend la PROVENANCE avec le chemin, et c'est voulu : un verdict qui nomme le
  // fichier sans dire qui l'a désigné laisse chercher pourquoi ce chemin-là (TF-0995).
  const surcharge = valeur("--settings");
  const pilot = valeur("--pilot") || PILOT_PAR_DEFAUT;

  // TOUS LES PROFILS DU POSTE, ET LE FAIT QUI L'EXIGE. Mesuré le 22/09/2026 : ce poste porte DEUX
  // profils, et `~/.claude-b/skills` est un LIEN SYMBOLIQUE vers celui du premier — si bien que la
  // propagation des skills paraissait atteindre les deux alors qu'elle n'écrit qu'une fois. Le
  // `settings.json` du second, lui, est un fichier RÉEL et distinct : il n'avait aucun hameçon. Une
  // session ouverte avec `CLAUDE_CONFIG_DIR` sur ce profil aurait donc les skills et pas l'entrée.
  // Poser sur le seul profil résolu aurait laissé ce trou, et l'oracle l'aurait nommé sans que
  // personne puisse le fermer.
  const cibles = [];
  if (surcharge) cibles.push({ chemin: resolve(surcharge), decide_par: "--settings" });
  else {
    const r0 = settingsInstalle();
    if (r0 && r0.chemin) cibles.push({ chemin: resolve(r0.chemin), decide_par: `${r0.decide_par} — profil que CETTE session lit` });
    for (const profil of POSTES_PAR_DEFAUT) {
      const f = resolve(join(profil, "settings.json"));
      if (!existsSync(profil)) continue;                       // un profil absent n'est pas un profil
      if (cibles.some((c) => c.chemin.toLowerCase() === f.toLowerCase())) continue;
      cibles.push({ chemin: f, decide_par: "profil de poste présent sur le disque" });
    }
  }
  if (!cibles.length) {
    console.log("[NON JUGEABLE] aucune racine de configuration de poste résolue — rien à confronter");
    process.exit(2);
  }
  let echec = false;
  for (const cible of cibles) {
    const r = juger({ settings: cible.chemin, pilot });
    for (const c of r.constats) console.log(`${c} [${cible.decide_par}]`);
    if (r.verdict === "FAIL") echec = true;
  }
  process.exit(echec ? 1 : 0);
}
