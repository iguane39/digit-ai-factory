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
import { appendFileSync, existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const TABLE_PAR_DEFAUT = join(ICI, "consommateurs-skills.json");
const DELAI_PAR_DEFAUT = 600000;

// FORGE_TABLE_CONSOMMATEURS (D-135 (a)) désigne une table de RECETTE, jamais celle du poste : le hook, qui décide du rejeu, et le processus détaché, qui le joue, lisent la même.
export function lireTable(chemin = process.env.FORGE_TABLE_CONSOMMATEURS || TABLE_PAR_DEFAUT) {
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
  // Windows admet des parenthèses dans un nom de variable : %ProgramFiles(x86)% (TF-2068).
  const developper = (s) => String(s).replace(/%([A-Za-z_][A-Za-z0-9_()]*)%|\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g,
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

// ---- TF-2048 (02/11/2026) · UN ROUGE NEUF LAISSE UNE TRACE QUE L'OUVERTURE RELIT -----------------------------------------
//
// LE FAIT. Le 02/11, la recette de forge-design rendait 2 échecs depuis 12 jours : V23 de render_page (digit-ai-page-html 1.40.0,
// 21/10) refusait une fixture verte que personne ne rejouait, et la même fixture avait déjà cassé avec V18 en septembre (TF-1100).
// Le constat C1/C5 de ce module existait déjà ; il s'imprimait dans la sortie d'UNE commande, lue ce jour-là ou jamais.
//
// LA TRACE. Un fichier JSONL HORS dépôt, à côté du journal des propagations (`consommateurs-rouges.jsonl`), une ligne par événement :
//   · « rouge-neuf » — un consommateur passait avant la propagation et échoue après (C1), ou son rouge s'est aggravé (C5) ;
//   · « leve »       — le même consommateur, rejoué, passe ;
//   · « non-rejoue » — une propagation réelle a eu lieu SANS rejouer les consommateurs (`--sans-consommateurs`, le mode de
//                      `bootstrap.mjs --pull`) : de quoi mesurer la fréquence du raccourci, qu'aucun journal ne portait.
// `hook-ouverture.mjs` relit les rouges encore ouverts et les dit à chaque ouverture du pilot, jusqu'à ce qu'un rejeu les lève
// (`oracle-skills.mjs --rejouer-consommateurs`). La trace SIGNALE : comme le reste de ce module, elle ne retient ni n'annule rien.
export const traceRouges = (installes) => process.env.FORGE_TRACE_CONSOMMATEURS || join(dirname(installes), "consommateurs-rouges.jsonl");

/** Les événements de trace d'une propagation encadrée. `ouverts` : les dépôts déjà en rouge ouvert, que ce rejeu a pu lever. */
export function evenementsDePropagation(enc, { ouverts = [], maintenant = new Date() } = {}) {
  const ts = maintenant.toISOString();
  const evts = [];
  const commandeDe = (depot) => ((enc.apres || []).find((r) => r.depot === depot) || {}).commande || null;
  for (const f of enc.findings || []) {
    if (f.statut !== "FAIL" || (f.regle !== "C1" && f.regle !== "C5")) continue;
    const r = (enc.apres || []).find((x) => x.depot === f.ou) || {};
    evts.push({ ts, evenement: "rouge-neuf", depot: f.ou, regle: f.regle, commande: commandeDe(f.ou), skills: enc.skills_touches || [],
      exit: r.exit ?? null, extrait: r.extrait || null });
  }
  for (const r of enc.apres || []) {
    if (r.statut === "PASS" && ouverts.includes(r.depot)) evts.push({ ts, evenement: "leve", depot: r.depot, commande: r.commande || null });
  }
  return evts;
}

/** L'événement d'une propagation réelle faite sans rejouer les consommateurs ; rien si elle n'a rien copié. */
export const evenementNonRejoue = (applique, maintenant = new Date()) =>
  (applique || []).length ? [{ ts: maintenant.toISOString(), evenement: "non-rejoue", skills: applique }] : [];

/** Ajoute des événements à la trace. Une trace qui ne s'écrit pas ne retient jamais la propagation : l'échec est rendu, pas levé. */
export function ecrireTrace(chemin, evts) {
  if (!evts.length) return { ecrit: 0, chemin };
  try { appendFileSync(chemin, evts.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8"); return { ecrit: evts.length, chemin }; }
  catch (e) { return { ecrit: 0, chemin, erreur: e.message }; }
}

/** Les lignes que l'ouverture du pilot imprime pour les rouges encore ouverts ; vide quand il n'y en a aucun (un relevé bavard se désactive). */
export function lignesOuverture(chemin) {
  const { ouverts } = rougesOuverts(chemin);
  if (!ouverts.length) return [];
  const hebdo = (e) => e.origine === ORIGINE_REJEU;
  // D-135 (a) : un rouge né du rejeu hebdomadaire garde la MÊME ligne, qui dit seulement « rejeu hebdomadaire » à la place de la propagation.
  return ["", `## Consommateurs des skills : ${ouverts.length} rouge(s) neuf(s) non levé(s) par ${ouverts.some(hebdo) ? "une propagation ou le rejeu hebdomadaire" : "une propagation"} (TF-2048)`,
    ...ouverts.map((e) => (hebdo(e)
      ? `- ${e.depot} : \`${e.commande || "vérification native"}\` échoue au rejeu hebdomadaire du ${String(e.ts).slice(0, 10)} à ${String(e.ts).slice(11, 16)} UTC, sans rouge ouvert avant lui `
        + `(rejeu hebdomadaire${(e.skills || []).length ? `, skills consommés : ${e.skills.join(", ")}` : ""})${e.extrait ? ` — ${String(e.extrait).slice(0, 160)}` : ""}.`
      : `- ${e.depot} : \`${e.commande || "vérification native"}\` passait avant la propagation du ${String(e.ts).slice(0, 10)} à ${String(e.ts).slice(11, 16)} UTC `
        + `(${e.regle}, skills touchés : ${(e.skills || []).join(", ") || "?"}) et échoue après${e.extrait ? ` — ${String(e.extrait).slice(0, 160)}` : ""}.`)),
    "→ corriger la règle neuve du socle ou le consommateur, puis `node oracles/oracle-skills.mjs --rejouer-consommateurs` lève la trace dès que la vérification passe ; rien n'a été annulé."];
}

/** Les rouges encore ouverts : le dernier événement de chaque dépôt est « rouge-neuf ». `non-rejoue` ne compte que pour la mesure. */
export function rougesOuverts(chemin) {
  const parDepot = new Map();
  let nonRejoue = 0, lignes = 0, illisibles = 0;
  if (existsSync(chemin)) {
    for (const l of readFileSync(chemin, "utf8").split(/\r?\n/)) {
      if (!l.trim()) continue;
      lignes += 1;
      let e; try { e = JSON.parse(l); } catch { illisibles += 1; continue; }
      if (e.evenement === "non-rejoue") nonRejoue += 1;
      else if (e.depot && (e.evenement === "rouge-neuf" || e.evenement === "leve")) parDepot.set(e.depot, e);
    }
  }
  return { ouverts: [...parDepot.values()].filter((e) => e.evenement === "rouge-neuf"), non_rejoue: nonRejoue, lignes, illisibles, existe: existsSync(chemin) };
}

// ---- D-135 (a) du 02/11/2026, TF-2048 · LE REJEU HEBDOMADAIRE : TOUS LES DÉPÔTS DE LA TABLE, EN ARRIÈRE-PLAN, UNE FOIS PAR SEMAINE ------------
//
// LE FAIT. La trace ci-dessus ne se remplit que sur une propagation qui rejoue les consommateurs ; `bootstrap --pull` (chaque ouverture) passe
// `--sans-consommateurs`, et `--rejouer-consommateurs` ne rejoue que les dépôts DÉJÀ en rouge ouvert. Un consommateur qui casse sans
// propagation (V23 de render_page chez forge-design, 12 jours rouge) n'entrait donc jamais dans la trace.
//
// LE GESTE, décidé par l'humain : une fois par semaine, l'ouverture du PILOT lance le rejeu de TOUS les dépôts de la table, sans attendre son
// résultat ; un rouge s'affiche à l'ouverture suivante, avec 7 jours de retard au plus.
//   · il compare à la trace : un dépôt qui ÉCHOUE sans rouge ouvert → « rouge-neuf » ; un rouge ouvert qui PASSE → « leve » ;
//   · un dépôt INDÉTERMINÉ ou SKIP ne compte ni pour vert ni pour rouge, et l'ouverture dit qu'il n'a rien jugé ;
//   · un rejeu COUPÉ n'écrit RIEN à la trace (tout ou rien) : coupé, il n'a rien jugé ;
//   · l'état vit dans un fichier à côté de la trace (`rejeu-hebdomadaire.json`, début et fin) ; un VERROU (`rejeu-hebdomadaire.verrou`, pid et
//     heure) évite deux rejeux à la fois, et un verrou dont le processus est mort, ou plus vieux que la somme des délais de la table, est PÉRIMÉ ;
//   · un rejeu qui n'a pas abouti depuis plus de 14 jours se dit à l'ouverture.
// Aucune nouvelle dépendance : `node:child_process`, `node:fs`. Ce rejeu n'écrit que dans le dossier de la trace.
export const ORIGINE_REJEU = "rejeu-hebdomadaire";
export const SEUIL_REJEU_JOURS = 7;
export const ALERTE_REJEU_JOURS = 14;
const JOUR_MS = 86400000;
const MARGE_VERROU_MS = 600000;
const FORMAT_ETAT_REJEU = "pilot/rejeu-hebdomadaire@1";
export const cheminEtatRejeu = (trace) => join(dirname(trace), "rejeu-hebdomadaire.json");
export const cheminVerrouRejeu = (trace) => join(dirname(trace), "rejeu-hebdomadaire.verrou");

const lireJson = (chemin) => { try { return JSON.parse(readFileSync(chemin, "utf8")); } catch { return null; } };
export const lireEtatRejeu = (trace) => lireJson(cheminEtatRejeu(trace));
function ecrireEtatRejeu(trace, etat) {
  const chemin = cheminEtatRejeu(trace), tmp = `${chemin}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(etat, null, 1) + "\n", "utf8");
  renameSync(tmp, chemin);
}

/** Un processus existe-t-il ? `kill(pid, 0)` ne tue rien ; EPERM veut dire « il existe, mais pas à nous ». */
export function pidVivant(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; }
}

/** Au-delà de ce temps, un verrou est périmé même si son pid répond (pid recyclé) : la somme des délais de la table, plus une marge. */
export const plafondVerrouMs = (table) => (table.consommateurs || []).reduce((s, c) => s + (Number(c.verification?.delai_ms) || DELAI_PAR_DEFAUT), 0) + MARGE_VERROU_MS;

export function etatVerrou(trace, { maintenant = new Date(), table = lireTable(), vivant = pidVivant } = {}) {
  const chemin = cheminVerrouRejeu(trace);
  if (!existsSync(chemin)) return { present: false, vivant: false };
  const v = lireJson(chemin) || {};
  const age_ms = maintenant - Date.parse(v.ts);
  const vivantOui = vivant(v.pid) && Number.isFinite(age_ms) && age_ms <= plafondVerrouMs(table);
  return { present: true, vivant: vivantOui, perime: !vivantOui, pid: v.pid ?? null, ts: v.ts ?? null };
}

/** Faut-il lancer le rejeu ? Non si la table est vide, si un rejeu tourne, ou si le dernier rejeu COMPLET a moins de 7 jours. */
export function decisionRejeu(trace, { maintenant = new Date(), table = lireTable(), vivant = pidVivant } = {}) {
  if (!(table.consommateurs || []).length) return { lancer: false, raison: "table-vide" };
  const v = etatVerrou(trace, { maintenant, table, vivant });
  if (v.present && v.vivant) return { lancer: false, raison: "en-cours", pid: v.pid };
  const fin = Date.parse(lireEtatRejeu(trace)?.dernier_complet?.fin);
  if (Number.isFinite(fin) && maintenant - fin < SEUIL_REJEU_JOURS * JOUR_MS) return { lancer: false, raison: "a-jour", age_jours: (maintenant - fin) / JOUR_MS };
  return { lancer: true, raison: Number.isFinite(fin) ? "echu" : "jamais", verrou_perime: v.present };
}

/**
 * Lance le rejeu DÉTACHÉ, et rend la main aussitôt : l'appelant n'attend ni le résultat ni la fin du processus. `spawner` est injectable
 * pour la recette. Un lancement impossible (ENOENT, pas de pid) est rendu `lance: false` avec sa cause, jamais levé.
 */
export function lancerRejeuHebdomadaire({ trace, pilot, maintenant = new Date(), table = lireTable(), vivant = pidVivant, spawner = spawn } = {}) {
  const d = decisionRejeu(trace, { maintenant, table, vivant });
  if (!d.lancer) return { ...d, lance: false };
  const t0 = Date.now();
  try {
    const enfant = spawner(process.execPath, [join(ICI, "oracle-skills.mjs"), "--rejouer-tous-consommateurs"],
      { cwd: pilot, detached: true, stdio: "ignore", windowsHide: true, env: process.env });
    enfant.on?.("error", () => { /* le lancement échoué est lu sur `pid` ci-dessous */ });
    if (!enfant.pid) return { ...d, lance: false, erreur: "aucun processus n'a démarré (pas de pid)", duree_ms: Date.now() - t0 };
    enfant.unref?.();
    return { ...d, lance: true, pid: enfant.pid, duree_ms: Date.now() - t0 };
  } catch (e) {
    return { ...d, lance: false, erreur: e.code || e.message, duree_ms: Date.now() - t0 };
  }
}

/** Les événements de trace d'un rejeu complet : ce qui ÉCHOUE sans rouge ouvert, et ce qui PASSE alors qu'un rouge était ouvert. */
export function evenementsDeRejeu(resultats, table, { ouverts = [], maintenant = new Date() } = {}) {
  const ts = maintenant.toISOString();
  const skillsDe = (depot) => ((table.consommateurs || []).find((c) => c.depot === depot) || {}).skills || [];
  const evts = [];
  for (const r of resultats) {
    if (r.statut === "FAIL" && !ouverts.includes(r.depot)) {
      evts.push({ ts, evenement: "rouge-neuf", origine: ORIGINE_REJEU, depot: r.depot, regle: "H1", commande: r.commande || null, skills: skillsDe(r.depot),
        exit: r.exit ?? null, extrait: r.extrait || null });
    } else if (r.statut === "PASS" && ouverts.includes(r.depot)) {
      evts.push({ ts, evenement: "leve", origine: ORIGINE_REJEU, depot: r.depot, commande: r.commande || null });
    }
  }
  return evts;
}

const resumeDepots = (resultats) => resultats.map((r) => ({ depot: r.depot, statut: r.statut, ...(r.motif ? { motif: String(r.motif).slice(0, 240) } : {}) }));
const marquerCoupe = (etat) => ({ ...etat, coupes_depuis_complet: (etat.coupes_depuis_complet || 0) + 1, dernier: { ...etat.dernier, statut: "coupe" } });

/**
 * Le rejeu lui-même (processus détaché, ou lancé à la main). Prend le verrou, rejoue TOUS les dépôts de la table, compare à la trace, écrit
 * ses événements d'un seul tenant À LA FIN, puis l'état. Rend `deja-en-cours` sans rien écrire si un autre rejeu vivant tient le verrou.
 */
export function executerRejeuHebdomadaire({ trace, racine, table = lireTable(), maintenant = () => new Date(), vivant = pidVivant, jouerUn = jouer, lanceur = spawnSync, delaiParDefaut = DELAI_PAR_DEFAUT } = {}) {
  const verrou = cheminVerrouRejeu(trace);
  const v = etatVerrou(trace, { maintenant: maintenant(), table, vivant });
  if (v.present && v.vivant) return { statut: "deja-en-cours", pid: v.pid, depuis: v.ts };
  let etat = lireEtatRejeu(trace) || {};
  // Un verrou périmé, ou un état « en-cours » sans verrou : le rejeu précédent a été coupé. Il est dit, et il n'a rien jugé.
  if (v.present) { try { unlinkSync(verrou); } catch { /* retiré par un autre */ } }
  if (etat.dernier?.statut === "en-cours") etat = marquerCoupe(etat);
  const debut = maintenant().toISOString();
  try { writeFileSync(verrou, JSON.stringify({ pid: process.pid, ts: debut }), { encoding: "utf8", flag: "wx" }); }
  catch { return { statut: "deja-en-cours", pid: null, depuis: null }; }
  try {
    ecrireEtatRejeu(trace, { ...etat, format: FORMAT_ETAT_REJEU, premier_essai: etat.premier_essai || debut, dernier: { debut, fin: null, statut: "en-cours", pid: process.pid } });
    const ouverts = rougesOuverts(trace).ouverts.map((e) => e.depot);
    const resultats = (table.consommateurs || []).map((c) => jouerUn(c, racine, { delaiParDefaut, lanceur }));
    const fin = maintenant();
    const evts = evenementsDeRejeu(resultats, table, { ouverts, maintenant: fin });
    const t = ecrireTrace(trace, evts);
    const depots = resumeDepots(resultats);
    const juges = resultats.filter((r) => r.statut === "PASS" || r.statut === "FAIL").length;
    const complet = { debut, fin: fin.toISOString(), depots, juges };
    ecrireEtatRejeu(trace, { ...etat, format: FORMAT_ETAT_REJEU, premier_essai: etat.premier_essai || debut, coupes_depuis_complet: 0,
      dernier: { ...complet, statut: "termine", pid: process.pid, evenements_ecrits: t.ecrit }, dernier_complet: complet });
    return { statut: "termine", debut, fin: complet.fin, depots, juges, evenements: evts, trace: t };
  } finally {
    if ((lireJson(verrou) || {}).pid === process.pid) { try { unlinkSync(verrou); } catch { /* déjà retiré */ } }
  }
}

/**
 * Ce que l'ouverture du pilot dit du rejeu hebdomadaire, hors les rouges (qui passent par `lignesOuverture`) : un rejeu coupé, les dépôts
 * qui n'ont RIEN JUGÉ, un rejeu qui n'a pas abouti depuis plus de 14 jours. `lancer` : fonction qui lance le rejeu s'il est dû et rend le résultat de
 * `lancerRejeuHebdomadaire` (absente : aucun lancement). Vide quand il n'y a rien à dire (un relevé bavard se désactive).
 */
export function lignesRejeuOuverture(trace, { maintenant = new Date(), table = lireTable(), vivant = pidVivant, lancer = null } = {}) {
  const etat = lireEtatRejeu(trace);
  const out = [];
  const date = (ts) => String(ts || "?").slice(0, 10);
  if (etat) {
    const v = etatVerrou(trace, { maintenant, table, vivant });
    const dernier = etat.dernier || {};
    if (dernier.statut === "coupe" || (dernier.statut === "en-cours" && !(v.present && v.vivant))) {
      out.push(`- le rejeu hebdomadaire commencé le ${date(dernier.debut)} a été COUPÉ avant sa fin : il n'a rien jugé, ni vert ni rouge, pas même pour les dépôts rejoués avant la coupure`
        + `${etat.coupes_depuis_complet > 1 ? ` (${etat.coupes_depuis_complet} coupures depuis le dernier rejeu complet)` : ""}.`);
    }
    const complet = etat.dernier_complet;
    const sansJugement = (complet?.depots || []).filter((d) => d.statut === "INDETERMINE" || d.statut === "SKIP");
    if (sansJugement.length) {
      out.push(`- au dernier rejeu hebdomadaire complet (${date(complet.fin)}), ${sansJugement.length} dépôt(s) sur ${complet.depots.length} n'ont RIEN JUGÉ, ni vert ni rouge : `
        + `${sansJugement.map((d) => `${d.depot} (${d.statut}${d.motif ? ` — ${String(d.motif).slice(0, 110)}` : ""})`).join(" ; ")}.`);
    }
    const ref = Date.parse(complet?.fin) || Date.parse(etat.premier_essai);
    if (Number.isFinite(ref) && maintenant - ref > ALERTE_REJEU_JOURS * JOUR_MS) {
      out.push(`- aucun rejeu hebdomadaire n'a abouti depuis ${Math.floor((maintenant - ref) / JOUR_MS)} jours (dernier rejeu complet : ${complet ? date(complet.fin) : "jamais"}) : `
        + "les consommateurs des skills ne sont plus relevés, un rouge neuf n'y serait pas vu.");
    }
  }
  // Le lancement vient APRÈS la lecture de l'état : le processus lancé réécrit l'état dès qu'il démarre, et lu après lui, un rejeu coupé ne se dirait plus.
  const lancement = lancer ? lancer() : null;
  if (lancement?.lance) out.push(`- rejeu des ${(table.consommateurs || []).length} dépôts de la table lancé en arrière-plan (${lancement.raison === "jamais" ? "jamais joué sur ce poste" : "dernier rejeu complet de plus de 7 jours"}, `
    + `pid ${lancement.pid}, lancement en ${lancement.duree_ms} ms, sans attente) : son résultat se lit à l'ouverture suivante.`);
  else if (lancement?.erreur) out.push(`- rejeu hebdomadaire NON lancé (${lancement.erreur}) : les consommateurs des skills ne sont pas rejoués cette semaine.`);
  return out.length ? ["", "## Rejeu hebdomadaire des consommateurs des skills (D-135 (a), TF-2048)", ...out] : [];
}
