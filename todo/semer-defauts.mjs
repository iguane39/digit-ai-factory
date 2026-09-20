#!/usr/bin/env node
/**
 * semer-defauts.mjs — UNE COUVERTURE DÉCLARÉE N'EST PAS UNE COUVERTURE PROUVÉE (TF-1079, O2).
 *
 * LE FAIT. `todo\CLASSES.json` déclare, pour chaque classe de défaut, le contrôle censé l'attraper.
 * Personne n'a jamais vérifié qu'il l'attrape. Les dix défauts échappés du banc (TF-1073) ont tous
 * échappé AVANT que leur contrôle n'existe ; rien ne dit ce qu'il en est des autres. Une ligne
 * `oracle:` dans un référentiel est une INTENTION, et une intention non éprouvée se lit comme une
 * protection — c'est la forme la plus chère de la fausse sécurité, celle qui fait cesser de chercher.
 *
 * CE QUE FAIT CE VERBE. Pour chaque classe dotée d'un contrôle DU PILOT jouable localement, il sème
 * UNE instance du défaut dans un livrable témoin, en DOSSIER TEMPORAIRE, et la confronte au contrôle
 * déclaré. Il ne touche jamais le référentiel (lecture seule), jamais un livrable du dépôt, jamais
 * une vue générée.
 *
 * LE JUGEMENT SE FAIT RÈGLE PAR RÈGLE, ET C'EST LA DÉCISION DE CONCEPTION QUI COMPTE. Comparer les
 * codes de sortie ne dirait rien : un document témoin minimal échoue de toute façon sur dix autres
 * règles, et un contrôle qui refuse TOUT passerait pour une protection parfaite. Chaque générateur
 * déclare donc LA RÈGLE visée, et le verbe lit son statut sur DEUX documents jumeaux :
 *
 *   · la règle FAIL sur l'instance semée et PASS (ou muette) sur le témoin → COUVERTE, prouvée ;
 *   · la règle NE FAIL PAS sur l'instance → ACCUSÉE — la couverture était déclarée et FAUSSE.
 *     C'est le résultat le plus précieux de ce verbe, et il est nommé une classe par ligne ;
 *   · la règle FAIL sur les DEUX → NON CONCLUANTE. Un contrôle qui refuse aussi le témoin ne
 *     prouve rien sur la classe : il prouve qu'il refuse tout. Jamais compté couvert.
 *
 * CE QUI N'EST PAS SEMÉ, ET POURQUOI C'EST DIT PLUTÔT QUE COMBLÉ :
 *   · classe SANS contrôle déclaré (le champ dit « aucun », « à créer ») — listée à part, jamais
 *     comptée couverte, jamais accusée : il n'y a rien à mettre en défaut ;
 *   · contrôle vivant HORS du pilot (socle des skills, forge sœur, produit) ou non jouable ici —
 *     NON JOUÉE, avec son motif. Le pilot n'exécute pas la recette d'un dépôt frère pour se rassurer ;
 *   · classe SANS GÉNÉRATEUR — aucune instance fidèle au défaut fondateur n'a pu être écrite. Une
 *     instance de complaisance, taillée pour faire rougir le contrôle, ferait passer une couverture
 *     pour prouvée : c'est exactement le défaut que ce verbe existe pour trouver, retourné.
 *
 * LA TABLE classe → générateur est une DONNÉE datée (`todo\generateurs-defauts.json`, loi n° 4) :
 * les instances et leurs témoins s'y éditent sans toucher à ce fichier.
 *
 * Usage : node todo\semer-defauts.mjs [--classes <CLASSES.json>] [--generateurs <table.json>]
 *                                     [--json <sortie.json>] [--classe <cle>] [--racine <pilot>]
 * Sortie : résumé lisible sur stdout, JSON complet avec `--json`.
 * Exit : 0 = aucune couverture fausse · 1 = au moins une classe ACCUSÉE · 2 = rien à semer.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const PILOT = resolve(ICI, "..");

/** Le champ `oracle` d'une classe dit parfois qu'il n'y a PAS de contrôle. Le lire, pas le supposer. */
const SANS_CONTROLE = /^\s*(aucun\b|—|-|n\/a|à\s*créer|a\s*creer)|^\s*a\s+creer\b|—\s*aucun oracle|oracle à créer/i;
export const declareSansControle = (oracle) => !String(oracle || "").trim() || SANS_CONTROLE.test(String(oracle));

export function lireJson(chemin, defaut = null) {
  try { return JSON.parse(readFileSync(chemin, "utf8")); } catch { return defaut; }
}

/**
 * Sème UNE instance et son témoin, joue le contrôle sur les deux, et lit le statut de LA règle visée.
 * `lanceur` est injectable : le banc prouve le mécanisme sans dépendre d'un oracle réel.
 */
export function semer(cle, gen, { racine = PILOT, lanceur = spawnSync } = {}) {
  const base = mkdtempSync(join(tmpdir(), "semis-defauts-"));
  const ecrire = (nom, corps) => {
    const d = mkdtempSync(join(base, `${nom}-`));
    const cibles = [];
    for (const [rel, contenu] of Object.entries(corps)) {
      const f = join(d, rel);
      mkdirSync(dirname(f), { recursive: true });
      writeFileSync(f, contenu, "utf8");
      cibles.push(f);
    }
    return { dossier: d, premier: cibles[0] };
  };
  const jouer = (corps) => {
    const { dossier, premier } = ecrire("x", corps);
    // `avant` : la PRÉPARATION déclarée du livrable témoin. Certains contrôles du pilot ne jugent
    // que ce qu'un dépôt SUIT (oracle-caracteres-controle lit les fichiers versionnés) : sans un
    // `git init` + `git add`, ils rendent SANS_OBJET sur un dossier temporaire, et le semis
    // passerait pour une couverture fausse alors qu'il n'a rien semé du tout.
    for (const cmd of gen.avant || []) {
      lanceur(cmd[0], cmd.slice(1), { cwd: dossier, encoding: "utf8", timeout: 60000, windowsHide: true });
    }
    const argv = (gen.controle.commande || []).map((a) => a
      .replaceAll("{fichier}", premier).replaceAll("{dossier}", dossier).replaceAll("{pilot}", racine));
    const r = lanceur(argv[0], argv.slice(1), { cwd: racine, encoding: "utf8", timeout: gen.controle.delai_ms || 120000, windowsHide: true });
    let j = null;
    try { const s = r.stdout || ""; j = JSON.parse(s.slice(s.indexOf("{"))); } catch { /* verdict non JSON */ }
    return { exit: r.status, json: j, brut: ((r.stdout || "") + (r.stderr || "")).slice(0, 600), erreur: r.error?.code };
  };

  try {
    const instance = jouer(gen.instance);
    const temoin = gen.temoin ? jouer(gen.temoin) : null;
    const regle = gen.controle.regle;
    // Le statut de LA règle visée dans un verdict. Un verdict illisible n'est pas une absence de
    // défaut : il se déclare, il ne se compte pas pour un vert (ni pour un rouge).
    const statutRegle = (v) => {
      if (v.erreur) return { lu: false, motif: `contrôle non lançable (${v.erreur})` };
      if (!v.json) {
        if (!regle) return { lu: true, echoue: v.exit !== 0 };   // contrôle sans findings : le code de retour tranche
        return { lu: false, motif: `verdict non lisible (exit ${v.exit}) : ${v.brut.slice(0, 200)}` };
      }
      if (!regle) return { lu: true, echoue: v.json.verdict === "FAIL" || v.exit === 1 };
      const f = (v.json.findings || []).filter((x) => String(x.regle) === String(regle));
      if (!f.length) return { lu: true, echoue: false, absente: true };
      return { lu: true, echoue: f.some((x) => x.statut === "FAIL" || x.severite === "bloquant" || x.severite === "majeur"),
        message: f.map((x) => `${x.statut}|${x.message}`).join(" · ").slice(0, 400) };
    };
    const si = statutRegle(instance);
    const st = temoin ? statutRegle(temoin) : { lu: true, echoue: false };
    const commun = { cle, regle: regle || "(code de sortie)", controle: (gen.controle.commande || []).join(" "), fonde_par: gen.fonde_par || [] };

    if (!si.lu) return { ...commun, statut: "NON_JOUEE", motif: si.motif };
    if (!st.lu) return { ...commun, statut: "NON_JOUEE", motif: `témoin : ${st.motif}` };
    if (si.echoue && st.echoue) {
      return { ...commun, statut: "NON_CONCLUANTE",
        motif: `la règle ${regle} refuse AUSSI le témoin sain — elle ne prouve rien sur cette classe, seulement qu'elle refuse tout` };
    }
    if (si.echoue) return { ...commun, statut: "COUVERTE", preuve: si.message || `exit ${instance.exit}` };
    // LA RÈGLE ABSENTE DES DEUX VERDICTS N'ACCUSE PERSONNE, et cette borne est le garde-fou de ce
    // verbe. Un générateur qui sème à côté de ce que le contrôle regarde produirait une « couverture
    // fausse » qui n'existe pas — une accusation de complaisance vaut une preuve de complaisance,
    // au signe près. Ce n'est un constat que si le contrôle JOUE la règle sur le témoin et cesse de
    // la jouer sur l'instance, ou s'il la joue et rend PASS.
    if (si.absente && (!temoin || st.absente)) {
      return { ...commun, statut: "NON_CONCLUANTE",
        motif: `la règle ${regle} n'apparaît dans AUCUN des deux verdicts — l'instance semée ne tombe pas là où ce contrôle regarde. `
          + "C'est le générateur qui est en cause, pas la couverture : rien n'est prouvé, et rien n'est accusé" };
    }
    // LE CRITÈRE DE DISCRIMINATION, et c'est LUI qui empêche l'accusation de complaisance.
    // Une règle qui rend le MÊME verdict, au mot près, sur l'instance et sur son témoin n'a pas
    // regardé la matière semée : elle a rendu son message « rien à juger » deux fois. Mesuré le
    // 20/09 en écrivant ce verbe — quatre classes étaient « accusées » sur ce seul motif, et les
    // quatre étaient des artefacts de fixture. Une accusation de complaisance vaut une preuve de
    // complaisance, au signe près : c'est le défaut que TF-1079 traque, retourné contre lui.
    if (temoin && si.message && si.message === st.message) {
      return { ...commun, statut: "NON_CONCLUANTE",
        motif: `la règle ${regle} rend le MÊME verdict sur l'instance semée et sur son témoin sain `
          + `(« ${String(si.message).slice(0, 120)} ») — elle n'a pas discriminé, donc elle n'a pas regardé la matière semée. `
          + "Le générateur est en cause, pas la couverture : rien n'est prouvé, et rien n'est accusé" };
    }
    return { ...commun, statut: "ACCUSEE",
      motif: si.absente
        ? `la règle ${regle} est JOUÉE sur le témoin sain et ABSENTE du verdict rendu sur l'instance semée — le défaut fait disparaître son propre contrôle`
        : `la règle ${regle} a DISCRIMINÉ (son verdict diffère de celui du témoin) et a tout de même rendu PASS sur une instance du défaut : la couverture déclarée au référentiel est FAUSSE`,
      instance_semee: gen.motif || null, verdict_instance: si.message, verdict_temoin: st.message };
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

export function campagne({ classes, generateurs, racine = PILOT, lanceur = spawnSync, filtre = null }) {
  const table = generateurs?.generateurs || {};
  const sansGen = generateurs?.sans_generateur || {};
  const resultats = [];
  for (const c of classes) {
    if (filtre && c.cle !== filtre) continue;
    if (declareSansControle(c.oracle)) {
      resultats.push({ cle: c.cle, statut: "SANS_CONTROLE", oracle_declare: String(c.oracle || "").slice(0, 160), fonde_par: c.fondee_par || [] });
      continue;
    }
    const gen = table[c.cle];
    if (!gen) {
      resultats.push({ cle: c.cle, statut: "SANS_GENERATEUR", oracle_declare: String(c.oracle || "").slice(0, 160), fonde_par: c.fondee_par || [],
        motif: sansGen[c.cle] || "aucune instance fidèle au défaut fondateur n'a été écrite — une instance de complaisance ferait passer une couverture pour prouvée" });
      continue;
    }
    resultats.push(semer(c.cle, gen, { racine, lanceur }));
  }
  const par = (s) => resultats.filter((r) => r.statut === s);
  return {
    outil: "semer-defauts", version: "1.0.0",
    classes_lues: classes.length, generateurs_date: generateurs?.date || null,
    mesure: {
      couvertes: par("COUVERTE").length, accusees: par("ACCUSEE").length, non_concluantes: par("NON_CONCLUANTE").length,
      non_jouees: par("NON_JOUEE").length, sans_controle: par("SANS_CONTROLE").length, sans_generateur: par("SANS_GENERATEUR").length,
    },
    couvertes: par("COUVERTE"), accusees: par("ACCUSEE"), non_concluantes: par("NON_CONCLUANTE"),
    non_jouees: par("NON_JOUEE"), sans_controle: par("SANS_CONTROLE"), sans_generateur: par("SANS_GENERATEUR"),
    non_juge: [
      "la JUSTESSE d'une classe : ce verbe éprouve le lien classe → contrôle, jamais que la classe soit la bonne",
      "les classes NON JOUÉES et SANS GÉNÉRATEUR ne sont JAMAIS comptées couvertes — un non-mesuré n'est pas un vert",
      "une classe COUVERTE l'est sur UNE instance : une autre forme du même défaut peut échapper au même contrôle",
      "les contrôles vivant hors du pilot (socle des skills, forge sœur, produit) : le pilot ne joue pas la recette d'un dépôt frère pour se rassurer",
    ],
  };
}

if (process.argv[1] && /semer-defauts\.mjs$/.test(process.argv[1])) {
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
  const racine = resolve(arg("--racine", PILOT));
  const cheminClasses = arg("--classes", join(ICI, "CLASSES.json"));
  const cheminGen = arg("--generateurs", join(ICI, "generateurs-defauts.json"));
  const ref = lireJson(cheminClasses);
  const gen = lireJson(cheminGen, { generateurs: {}, sans_generateur: {} });
  if (!ref || !Array.isArray(ref.classes)) {
    console.error(`référentiel des classes illisible : ${cheminClasses}`);
    process.exit(2);
  }
  const r = campagne({ classes: ref.classes, generateurs: gen, racine, filtre: arg("--classe", null) });
  r.referentiel = { chemin: cheminClasses, version: ref.version || null, date: ref.date || null };
  const sortie = arg("--json", null);
  if (sortie) writeFileSync(sortie, JSON.stringify(r, null, 1) + "\n", "utf8");

  const m = r.mesure;
  console.log(`semer-defauts — ${r.classes_lues} classe(s) du référentiel ${r.referentiel.version || "?"}, table de générateurs du ${r.generateurs_date || "?"}`);
  console.log(`  ${m.couvertes} couverture(s) PROUVÉE(S) · ${m.accusees} DÉCLARÉE(S) ET FAUSSE(S) · ${m.non_concluantes} non concluante(s)`);
  console.log(`  ${m.sans_controle} sans contrôle déclaré · ${m.sans_generateur} sans générateur · ${m.non_jouees} non jouée(s)`);
  if (r.accusees.length) {
    console.log("\n  COUVERTURES DÉCLARÉES ET FAUSSES — une classe par ligne, c'est le résultat qui compte :");
    for (const a of r.accusees) console.log(`   · ${a.cle} [${a.regle}] — ${a.motif}`);
  }
  if (r.non_concluantes.length) {
    console.log("\n  NON CONCLUANTES — le contrôle refuse aussi le témoin sain, il ne prouve rien :");
    for (const a of r.non_concluantes) console.log(`   · ${a.cle} [${a.regle}] — ${a.motif}`);
  }
  if (r.couvertes.length) {
    console.log("\n  COUVERTURES PROUVÉES — le contrôle déclaré a REFUSÉ l'instance semée :");
    for (const a of r.couvertes) console.log(`   · ${a.cle} [${a.regle}]`);
  }
  if (r.non_jouees.length) {
    console.log("\n  NON JOUÉES — jamais comptées couvertes :");
    for (const a of r.non_jouees) console.log(`   · ${a.cle} — ${a.motif}`);
  }
  console.log(`\n  ${m.sans_controle} classe(s) SANS CONTRÔLE DÉCLARÉ (listées à part, rien à mettre en défaut)`
    + `${sortie ? ` · détail complet : ${sortie}` : " · détail : --json <fichier>"}`);
  process.exit(m.accusees ? 1 : (m.couvertes || m.non_concluantes) ? 0 : 2);
}
