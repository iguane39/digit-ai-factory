#!/usr/bin/env node
/**
 * consommateurs-skills.mjs — UNE PROPAGATION DIT CE QU'ELLE CASSE CHEZ CEUX QUI CONSOMMENT LA COPIE
 * INSTALLÉE (TF-0965, 20/09/2026).
 *
 * LE FAIT, deux fois mesuré. Le 08/09 à 16h05, `oracle-skills --appliquer` a porté dans la copie qui
 * s'exécute les règles neuves écrites le matin même. Vingt minutes plus tard, la suite de forge-tests
 * rendait un échec bloquant là où elle était verte la veille — et l'agent l'a cru PRÉEXISTANT, parce
 * que la cause vivait HORS de son dépôt et avait changé sous lui entre sa lecture et son lancement.
 * Le 14/09, deux nouvelles occurrences : `test_tf_0117` chez forge-tests, le self-test de forge-design.
 * LA CAUSE, structurelle : une règle neuve du socle était mesurée sur les pages du PILOT, jamais sur
 * les dépôts qui CONSOMMENT le socle sans en être propriétaires. La propagation copiait et rendait
 * PASS, sans jamais rejouer les suites qui dépendent de ce qu'elle venait d'écrire.
 *
 * LE MODÈLE EST `todo\journaliser.mjs`, mot pour mot : il rejoue l'oracle AVANT et APRÈS son écriture,
 * et sait donc distinguer « c'était déjà rouge » de « je viens de le casser ». C'est la seule
 * distinction qui compte ici, et aucune date ni aucun journal ne la donne.
 *
 * CE QUI DIFFÈRE DE `journaliser`, ET C'EST DÉLIBÉRÉ : journaliser ANNULE son écriture. Ici, JAMAIS.
 *   · pas de retour arrière automatique — remettre une copie installée dans son état d'avant pendant
 *     qu'une autre session du poste s'en sert est plus dangereux que le défaut qu'on répare ;
 *   · pas de blocage d'une propagation DÉJÀ FAITE — la mesure « après » arrive, par construction,
 *     après la copie. Elle SIGNALE, bruyamment, et le remède reste un geste humain (R-29).
 * Ce module n'a AUCUN chemin d'écriture : il lit une table, lance des commandes, rend des constats.
 *
 * LA TABLE EST UNE DONNÉE (`consommateurs-skills.json`, loi transverse n° 4) : datée, sourcée,
 * éditable sans toucher à ce fichier. Un parc bouge ; une table écrite en code vieillit en silence.
 *
 * QUATRE ÉTATS, et le quatrième existe pour ne pas mentir :
 *   PASS · FAIL · SKIP (dépôt absent du poste, ou aucune commande déclarée — jamais un défaut)
 *   INDETERMINE — ni un vert ni un rouge : délai dépassé, lancement impossible, ou vérification
 *   SORTIE SANS AVOIR RIEN JUGÉ (code de sortie de SKIP déclaré par le consommateur). Une suite qui
 *   n'a pas fini, ou qui a refusé de commencer, n'a rien prouvé — la compter pour verte est la façon
 *   dont un contrôle long devient décoratif, et la compter pour ROUGE est pire encore : elle devient
 *   un rouge préexistant derrière lequel un vrai rouge se cache.
 *
 * ============================================================================================
 * CE QUE LE PREMIER USAGE RÉEL A APPRIS (20/09/2026, décision humaine D-3 (a))
 * ============================================================================================
 *
 * DEUX DÉFAUTS, le jour même de la livraison, sur une propagation de 5 skills.
 *
 * 1. UN ROUGE PRÉEXISTANT A MASQUÉ UN ROUGE NEUF. Chez forge-tests, la suite échouait avant
 *    (`test_tf_0117`) et échouait après — mais APRÈS, un second test tombait
 *    (`test_tf_0409_contraste_clavier`), causé par la propagation. C1 et C3 comparaient des CODES DE
 *    SORTIE : 1 avant, 1 après, donc « elle n'en est pas la cause ». C'est faux, et c'est EXACTEMENT
 *    la classe que TF-0965 existe pour attraper, manquée à son premier passage. Un code de sortie
 *    est un booléen posé sur un ensemble ; comparer deux booléens ne dit rien de ce qu'ils résument.
 *    D'où C5, le ROUGE AGGRAVÉ : quand un dépôt est rouge des deux côtés, on compare CE QUI ÉCHOUE.
 *    L'extracteur d'identifiants d'échec est DÉCLARÉ PAR CONSOMMATEUR, en donnée — chaque dépôt
 *    imprime ses échecs à sa façon, et deviner cette façon dans le code la ferait vieillir en silence.
 *    Et C3 NE PEUT PLUS AFFIRMER L'INNOCENCE qu'en montrant deux ensembles d'échecs identiques ;
 *    partout ailleurs, l'état est INDÉTERMINÉ et le dit.
 *
 * 2. UNE COMMANDE NON JOUABLE COMPTÉE POUR UN ROUGE. Chez forge-audit, `node tools/verifier.mjs`
 *    sortait en 2 après 138 ms : « SKIP — aucun shell POSIX ». Rien n'avait été jugé, et c'était
 *    compté FAIL, donc rouge préexistant, donc innocence de la propagation. Deux réparations : les
 *    codes de sortie qui déclarent « rien jugé » sont listés par le consommateur
 *    (`sortie_sans_jugement`) et rendent INDÉTERMINÉ ; et un consommateur peut déclarer
 *    l'INTERPRÈTE dont sa vérification a besoin (`interprete` — ici Git Bash), résolu par variable
 *    d'environnement puis par chemins candidats DÉCLARÉS. Aucun chemin n'est écrit en dur ici :
 *    un poste qui range Git ailleurs édite la table, il ne corrige pas le module.
 */
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const TABLE_PAR_DEFAUT = join(ICI, "consommateurs-skills.json");
const DELAI_PAR_DEFAUT = 600000;

export function lireTable(chemin = TABLE_PAR_DEFAUT) {
  if (!existsSync(chemin)) return { erreur: `table des consommateurs introuvable : ${chemin}`, consommateurs: [] };
  try {
    const t = JSON.parse(readFileSync(chemin, "utf8"));
    return { ...t, consommateurs: Array.isArray(t.consommateurs) ? t.consommateurs : [] };
  } catch (e) {
    return { erreur: `table des consommateurs illisible (${e.message})`, consommateurs: [] };
  }
}

/**
 * Les consommateurs des skills que la propagation s'apprête à toucher. `skills` vide ⇒ AUCUN
 * consommateur : rien ne va changer, rien n'est à rejouer. Le contraire — tout rejouer par
 * précaution — ferait payer dix minutes à une propagation qui ne copie rien, et la ferait couper.
 */
export function concernes(table, skills) {
  const vises = new Set((skills || []).map((s) => String(s).toLowerCase()));
  if (!vises.size) return [];
  return (table.consommateurs || []).filter((c) => (c.skills || []).some((s) => vises.has(String(s).toLowerCase())));
}

/**
 * L'INTERPRÈTE déclaré par un consommateur, résolu SANS aucun chemin écrit ici. Mesuré le 20/09 :
 * `node tools/verifier.mjs` de forge-audit rejoue des blocs `run:` de workflow, qui sont du shell
 * POSIX ; lancé depuis un lanceur Windows il sort en 2 sans rien juger, et le pilot l'obtient vert
 * sous Git Bash. La variable d'environnement passe AVANT les chemins candidats : un poste qui range
 * Git ailleurs pose la variable ou édite la table, il ne corrige pas ce fichier.
 */
export function resoudreInterprete(interprete, { existe = existsSync, env = process.env } = {}) {
  if (!interprete) return { requis: false };
  const developper = (s) => String(s).replace(/%([A-Za-z_][A-Za-z0-9_]*)%|\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g,
    (_, a, b) => env[a || b] || "");
  const parVariable = interprete.variable ? env[interprete.variable] : null;
  if (parVariable && existe(parVariable)) return { requis: true, chemin: parVariable, par: `$${interprete.variable}` };
  for (const c of interprete.candidats || []) {
    const p = developper(c);
    if (p && !/%|\$\{/.test(p) && existe(p)) return { requis: true, chemin: p, par: "chemin candidat déclaré à la table" };
  }
  return { requis: true, chemin: null,
    motif: `interprète « ${interprete.nom || "?"} » INTROUVABLE : ni $${interprete.variable || "(aucune variable déclarée)"}, `
      + `ni aucun des ${(interprete.candidats || []).length} chemin(s) candidat(s) de la table — la vérification de ce dépôt n'est pas jouable ici` };
}

/**
 * Les IDENTIFIANTS d'échec d'une sortie, selon l'extracteur que le consommateur déclare. Chaque
 * dépôt imprime ses échecs à sa façon (`FAILED <nodeid>` chez pytest, `[FAIL] …`, ` ÉCHEC …`,
 * `[ROUGE] …`) : le motif vit donc en DONNÉE, mesuré sur la sortie réelle de chaque dépôt.
 *
 * UN EXTRACTEUR QUI NE RECONNAÎT RIEN NE REND PAS UN ENSEMBLE VIDE. Un ensemble vide se comparerait
 * à un autre ensemble vide et conclurait « rien de neuf » — c'est-à-dire l'innocence, sur une
 * mesure qui n'a rien lu. Il rend `lus: false`, et l'état devient INDÉTERMINÉ.
 */
export function extraireEchecs(extracteur, sortie) {
  if (!extracteur || !extracteur.motif) {
    return { lus: false, motif: "aucun extracteur d'échecs déclaré pour ce consommateur — ce qui échoue n'est pas comparable" };
  }
  let re;
  try { re = new RegExp(extracteur.motif, extracteur.drapeaux || "gm"); }
  catch (e) { return { lus: false, motif: `extracteur « ${extracteur.nom || "?"} » illisible (${e.message})` }; }
  const groupe = Number.isInteger(extracteur.groupe) ? extracteur.groupe : 1;
  const vus = [...String(sortie || "").matchAll(re)].map((m) => String(m[groupe] ?? m[0]).trim()).filter(Boolean);
  if (!vus.length) {
    return { lus: false, motif: `l'extracteur « ${extracteur.nom || "?"} » n'a reconnu AUCUN échec dans une sortie pourtant en échec `
      + "— il a dérivé de ce que ce dépôt imprime, et rien n'est comparable tant qu'il n'est pas remesuré" };
  }
  return { lus: true, echecs: [...new Set(vus)].sort() };
}

const sceauSortie = (s) => createHash("sha256").update(String(s || "").replace(/\r\n/g, "\n").trim(), "utf8").digest("hex");

/** Joue la vérification native d'UN consommateur, et relève CE QUI échoue, pas seulement QU'IL échoue. */
export function jouer(entree, racine, { delaiParDefaut = DELAI_PAR_DEFAUT, lanceur = spawnSync } = {}) {
  const cwd = join(racine, entree.depot);
  const v = entree.verification || {};
  const base = { depot: entree.depot, commande: (v.commande || []).join(" ") };
  if (!existsSync(cwd)) {
    return { ...base, statut: "SKIP", motif: `dépôt absent de ce poste (${cwd}) — non jugé, et c'est dit` };
  }
  const cmd = v.commande;
  if (!Array.isArray(cmd) || !cmd.length) {
    return { ...base, statut: "SKIP", motif: "aucune commande de vérification déclarée dans la table" };
  }
  // L'interprète déclaré, s'il y en a un. Introuvable ⇒ INDÉTERMINÉ nommé, jamais un rouge.
  const interp = resoudreInterprete(v.interprete);
  if (interp.requis && !interp.chemin) return { ...base, statut: "INDETERMINE", motif: interp.motif };
  const [exe, args, viaShell] = interp.requis
    ? [interp.chemin, (v.interprete.argv || ["-lc", "{commande}"]).map((a) => a.replaceAll("{commande}", cmd.join(" "))), false]
    : [cmd[0], cmd.slice(1), process.platform === "win32"];

  const delai = Number(v.delai_ms) || delaiParDefaut;
  const debut = Date.now();
  const r = lanceur(exe, args, { cwd, encoding: "utf8", timeout: delai, windowsHide: true, shell: viaShell });
  const duree_ms = Date.now() - debut;
  const commun = { ...base, duree_ms, ...(interp.requis ? { interprete: `${v.interprete.nom} (${interp.par})` } : {}) };

  if (r.error && r.error.code === "ETIMEDOUT") {
    return { ...commun, statut: "INDETERMINE", motif: `délai de ${delai} ms dépassé — la suite n'a pas fini, elle n'a donc rien prouvé (ni vert ni rouge)` };
  }
  if (r.error) {
    return { ...commun, statut: "INDETERMINE", motif: `lancement impossible (${r.error.code || r.error.message}) — \`${exe}\` n'a pas pu être exécuté sur ce poste` };
  }
  const sortie = (r.stdout || "") + (r.stderr || "");
  // UNE VÉRIFICATION QUI SORT SANS AVOIR RIEN JUGÉ N'EST PAS UN ROUGE. Mesuré le 20/09 : un exit 2
  // « SKIP, aucun shell POSIX » comptait comme un rouge préexistant, donc comme l'innocence de la
  // propagation. Les codes concernés sont déclarés par le consommateur, jamais devinés.
  if ((v.sortie_sans_jugement || []).includes(r.status)) {
    return { ...commun, statut: "INDETERMINE", exit: r.status,
      motif: `la vérification est SORTIE SANS RIEN JUGER (exit ${r.status}, déclaré « sans jugement » par la table) : `
        + `${sortie.trim().split(/\r?\n/).slice(-2).join(" · ").slice(0, 250)}` };
  }
  if (r.status === 0) return { ...commun, statut: "PASS", exit: 0 };

  const lecture = extraireEchecs(v.extracteur, sortie);
  return { ...commun, statut: "FAIL", exit: r.status,
    echecs_lus: lecture.lus, echecs: lecture.echecs || [], echecs_motif: lecture.motif || null,
    empreinte_sortie: sceauSortie(sortie),
    extrait: sortie.trim().split(/\r?\n/).slice(-4).join(" · ").slice(0, 400) };
}

/**
 * Le verdict de la propagation vu des consommateurs. `avant` et `apres` sont deux relevés du MÊME
 * ensemble de dépôts, dans le même ordre d'identité (le dépôt est la clé).
 *
 * C1 — passait et ne passe plus : LE constat, bruyant, jamais silencieux, jamais réparé tout seul.
 * C2 — INDÉTERMINÉ d'un côté ou de l'autre : on ne sait pas, et on le dit. Jamais un vert, jamais
 *      un rouge, et surtout jamais une innocence.
 * C3 — déjà rouge AVANT, ET RIEN DE NEUF NE L'EST : la propagation n'en est pas la cause. Cette
 *      phrase ne se prononce plus que sur la preuve — deux ensembles d'échecs comparés, ou deux
 *      sorties d'empreinte identique. Le 20/09, prononcée sur deux codes de sortie égaux, elle a
 *      couvert un échec neuf (`test_tf_0409_contraste_clavier`) né de la propagation même.
 * C4 — rouge AVANT et vert APRÈS : la propagation a RÉPARÉ, et ça se dit aussi.
 * C5 — ROUGE AGGRAVÉ : rouge des deux côtés, et un échec présent APRÈS qui n'était pas là AVANT.
 *      Même gravité que C1 : c'est le même fait, sous un rouge qui le cachait.
 */
export function confronter(avant, apres) {
  const parDepot = new Map(apres.map((r) => [r.depot, r]));
  const findings = [];
  for (const a of avant) {
    const b = parDepot.get(a.depot);
    if (!b) continue;
    if (a.statut === "SKIP" || b.statut === "SKIP") {
      findings.push({ regle: "C0", statut: "SANS_OBJET", ou: a.depot,
        message: `NON JUGÉ — ${(b.statut === "SKIP" ? b : a).motif}` });
      continue;
    }
    // L'INDÉTERMINÉ SE TRAITE AVANT TOUT LE RESTE, des deux côtés. Un état qu'on ne connaît pas ne
    // peut fonder ni un défaut ni une innocence : c'est le second défaut du 20/09 (un « rien jugé »
    // pris pour un rouge préexistant, donc pour une preuve que la propagation était hors de cause).
    if (a.statut === "INDETERMINE" || b.statut === "INDETERMINE") {
      const cote = b.statut === "INDETERMINE" ? "APRÈS" : "AVANT";
      const src = b.statut === "INDETERMINE" ? b : a;
      findings.push({ regle: "C2", statut: "AVERTISSEMENT", ou: a.depot,
        message: `INDÉTERMINÉ ${cote} la propagation — ${src.motif}. État ${cote === "APRÈS" ? `AVANT : ${a.statut}` : `APRÈS : ${b.statut}`}. `
          + "Aucun verdict n'est prononçable sur ce dépôt : ni « cassé par la propagation », ni « elle n'en est pas la cause » — "
          + "rendre la vérification jouable est le geste qui débloque la mesure (R-29)" });
      continue;
    }
    if (a.statut === "PASS" && b.statut === "FAIL") {
      findings.push({ regle: "C1", statut: "FAIL", ou: a.depot,
        message: `DÉFAUT — \`${b.commande}\` PASSAIT avant la propagation et ÉCHOUE après (exit ${b.exit}, ${Math.round(b.duree_ms / 1000)} s). `
          + "La copie installée d'un skill vient de changer sous ce dépôt : la cause vit HORS de lui, et une session qui rejouera sa suite "
          + "la croira préexistante (TF-0965, classe mesurée le 08/09 puis deux fois le 14/09). RIEN n'a été annulé — un retour arrière "
          + "automatique sur une copie que d'autres sessions exécutent est plus dangereux que le défaut. Geste humain (R-29) : lire le constat "
          + `chez ${a.depot}, corriger la règle neuve ou le consommateur, puis rejouer. Dernières lignes : ${b.extrait || "(aucune)"}` });
      continue;
    }
    if (a.statut === "FAIL" && b.statut === "PASS") {
      findings.push({ regle: "C4", statut: "SANS_OBJET", ou: a.depot,
        message: `\`${a.commande}\` échouait AVANT et passe après — la propagation a réparé ce dépôt` });
      continue;
    }
    if (a.statut === "FAIL" && b.statut === "FAIL") {
      // ROUGE DES DEUX CÔTÉS : on compare CE QUI échoue, jamais QU'IL échoue. Deux codes de sortie
      // égaux ne disent rien de deux ensembles différents — c'est la leçon du 20/09.
      if (a.echecs_lus && b.echecs_lus) {
        const neufs = b.echecs.filter((x) => !a.echecs.includes(x));
        const disparus = a.echecs.filter((x) => !b.echecs.includes(x));
        if (neufs.length) {
          findings.push({ regle: "C5", statut: "FAIL", ou: a.depot,
            message: `DÉFAUT — ROUGE AGGRAVÉ : \`${b.commande}\` échouait déjà avant, et ${neufs.length} échec(s) de PLUS après la propagation, `
              + `absent(s) du relevé d'avant : ${neufs.slice(0, 6).join(", ")}${neufs.length > 6 ? `, … (${neufs.length} au total)` : ""}. `
              + `Avant : ${a.echecs.length} échec(s) · après : ${b.echecs.length}${disparus.length ? ` (dont ${disparus.length} disparu(s))` : ""}. `
              + "Un rouge préexistant a caché un rouge NEUF : c'est exactement la classe que TF-0965 existe pour attraper, et elle est passée "
              + "sous le nez de ce contrôle le 20/09 parce qu'il comparait des codes de sortie. RIEN n'a été annulé — la propagation signale, "
              + `elle ne revient pas en arrière. Geste humain (R-29) : lire le constat chez ${a.depot}, corriger la règle neuve ou le consommateur, puis rejouer` });
          continue;
        }
        findings.push({ regle: "C3", statut: "SANS_OBJET", ou: a.depot,
          message: `\`${a.commande}\` échouait DÉJÀ avant la propagation, et AUCUN échec neuf n'est apparu — ${a.echecs.length} échec(s) comparé(s) `
            + `un à un${disparus.length ? `, dont ${disparus.length} ont disparu depuis` : ", ensembles identiques"}. `
            + "Elle n'en est pas la cause, et l'en accuser ferait chercher au mauvais endroit" });
        continue;
      }
      // Repli DÉCLARÉ : à défaut d'extracteur, l'empreinte de la sortie. Identique ⇒ l'innocence est
      // prouvée. Différente ⇒ on ne peut pas NOMMER ce qui est neuf, donc on ne conclut pas.
      if (a.empreinte_sortie && a.empreinte_sortie === b.empreinte_sortie) {
        findings.push({ regle: "C3", statut: "SANS_OBJET", ou: a.depot,
          message: `\`${a.commande}\` échouait DÉJÀ avant, et sa sortie est IDENTIQUE au caractère près (empreinte ${a.empreinte_sortie.slice(0, 12)}) — `
            + "rien de neuf n'y figure ; la propagation n'en est pas la cause" });
        continue;
      }
      findings.push({ regle: "C2", statut: "AVERTISSEMENT", ou: a.depot,
        message: `INDÉTERMINÉ — \`${a.commande}\` est rouge des deux côtés et ce qui échoue n'est PAS comparable : `
          + `${b.echecs_motif || a.echecs_motif || "aucun extracteur d'échecs déclaré"}. Les sorties diffèrent, donc un échec neuf peut s'y cacher : `
          + "on ne dira pas « elle n'en est pas la cause » sans l'avoir montré. Déclarer un `extracteur` pour ce dépôt à "
          + "`oracles/consommateurs-skills.json` rend la comparaison possible" });
      continue;
    }
  }
  return findings;
}

/** Le relevé complet autour d'une propagation. `propager()` est joué ENTRE les deux mesures. */
export function encadrer({ skills, racine, table = lireTable(), propager, delaiParDefaut = DELAI_PAR_DEFAUT, lanceur = spawnSync }) {
  const vises = concernes(table, skills);
  if (!vises.length) {
    const resultat = propager ? propager() : undefined;
    return { mesure_le: table.mesure_le || null, skills_touches: skills || [], consommateurs: [], avant: [], apres: [], findings: [],
      motif: (skills || []).length
        ? `aucun consommateur déclaré pour ${(skills || []).join(", ")} — table ${table.mesure_le ? `mesurée le ${table.mesure_le}` : "non datée"}${table.erreur ? ` · ${table.erreur}` : ""}`
        : "la propagation ne touche aucun skill — rien à rejouer chez personne",
      resultat };
  }
  const avant = vises.map((c) => jouer(c, racine, { delaiParDefaut, lanceur }));
  const resultat = propager ? propager() : undefined;
  const apres = vises.map((c) => jouer(c, racine, { delaiParDefaut, lanceur }));
  return { mesure_le: table.mesure_le || null, skills_touches: skills || [], consommateurs: vises.map((c) => c.depot),
    avant, apres, findings: confronter(avant, apres), resultat };
}
