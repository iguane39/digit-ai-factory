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
 *   PASS · FAIL · SKIP (dépôt absent du poste, ou commande introuvable — déclaré, jamais un défaut)
 *   INDETERMINE (délai dépassé, ou lancement impossible) — ni un vert ni un rouge. Une suite qui
 *   n'a pas fini n'a rien prouvé, et la compter pour verte est exactement la façon dont un contrôle
 *   long devient décoratif.
 */
import { existsSync, readFileSync } from "node:fs";
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

/** Joue la vérification native d'UN consommateur. Ne lit rien d'autre que son code de retour. */
export function jouer(entree, racine, { delaiParDefaut = DELAI_PAR_DEFAUT, lanceur = spawnSync } = {}) {
  const cwd = join(racine, entree.depot);
  const base = { depot: entree.depot, commande: (entree.verification?.commande || []).join(" ") };
  if (!existsSync(cwd)) {
    return { ...base, statut: "SKIP", motif: `dépôt absent de ce poste (${cwd}) — non jugé, et c'est dit` };
  }
  const cmd = entree.verification?.commande;
  if (!Array.isArray(cmd) || !cmd.length) {
    return { ...base, statut: "SKIP", motif: "aucune commande de vérification déclarée dans la table" };
  }
  const delai = Number(entree.verification?.delai_ms) || delaiParDefaut;
  const debut = Date.now();
  const r = lanceur(cmd[0], cmd.slice(1), { cwd, encoding: "utf8", timeout: delai, windowsHide: true, shell: process.platform === "win32" });
  const duree_ms = Date.now() - debut;
  if (r.error && (r.error.code === "ENOENT" || r.error.code === "EACCES")) {
    return { ...base, statut: "SKIP", duree_ms, motif: `\`${cmd[0]}\` introuvable ou non exécutable sur ce poste (${r.error.code}) — non jugé` };
  }
  if (r.error && r.error.code === "ETIMEDOUT") {
    return { ...base, statut: "INDETERMINE", duree_ms, motif: `délai de ${delai} ms dépassé — la suite n'a pas fini, elle n'a donc rien prouvé (ni vert ni rouge)` };
  }
  if (r.error) {
    return { ...base, statut: "INDETERMINE", duree_ms, motif: `lancement impossible : ${r.error.code || r.error.message}` };
  }
  return { ...base, statut: r.status === 0 ? "PASS" : "FAIL", exit: r.status, duree_ms,
    ...(r.status === 0 ? {} : { extrait: ((r.stdout || "") + (r.stderr || "")).trim().split(/\r?\n/).slice(-4).join(" · ").slice(0, 400) }) };
}

/**
 * Le verdict de la propagation vu des consommateurs. `avant` et `apres` sont deux relevés du MÊME
 * ensemble de dépôts, dans le même ordre d'identité (le dépôt est la clé).
 *
 * C1 — passait et ne passe plus : LE constat, bruyant, jamais silencieux, jamais réparé tout seul.
 * C2 — passait, et l'après est INDÉTERMINÉ : on ne sait pas, et on le dit.
 * C3 — déjà rouge AVANT : la propagation n'en est pas la cause, et l'en accuser ferait chercher au
 *      mauvais endroit. C'est exactement l'erreur que les agents du 08 et du 14/09 ont commise à
 *      l'envers (attribuer à l'état préexistant un défaut créé à l'instant) ; les deux sens comptent.
 * C4 — rouge AVANT et vert APRÈS : la propagation a RÉPARÉ, et ça se dit aussi.
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
    if (a.statut === "PASS" && b.statut === "FAIL") {
      findings.push({ regle: "C1", statut: "FAIL", ou: a.depot,
        message: `DÉFAUT — \`${b.commande}\` PASSAIT avant la propagation et ÉCHOUE après (exit ${b.exit}, ${Math.round(b.duree_ms / 1000)} s). `
          + "La copie installée d'un skill vient de changer sous ce dépôt : la cause vit HORS de lui, et une session qui rejouera sa suite "
          + "la croira préexistante (TF-0965, classe mesurée le 08/09 puis deux fois le 14/09). RIEN n'a été annulé — un retour arrière "
          + "automatique sur une copie que d'autres sessions exécutent est plus dangereux que le défaut. Geste humain (R-29) : lire le constat "
          + `chez ${a.depot}, corriger la règle neuve ou le consommateur, puis rejouer. Dernières lignes : ${b.extrait || "(aucune)"}` });
      continue;
    }
    if (a.statut === "PASS" && b.statut === "INDETERMINE") {
      findings.push({ regle: "C2", statut: "AVERTISSEMENT", ou: a.depot,
        message: `INDÉTERMINÉ après la propagation — ${b.motif}. Ce dépôt passait avant ; on ne sait pas s'il passe encore, et un inconnu ne se compte pas pour un vert` });
      continue;
    }
    if (a.statut === "FAIL") {
      findings.push({ regle: b.statut === "PASS" ? "C4" : "C3", statut: "SANS_OBJET", ou: a.depot,
        message: b.statut === "PASS"
          ? `\`${a.commande}\` échouait AVANT et passe après — la propagation a réparé ce dépôt`
          : `\`${a.commande}\` échouait DÉJÀ avant la propagation (exit ${a.exit}) — elle n'en est pas la cause, et l'en accuser ferait chercher au mauvais endroit` });
      continue;
    }
    if (a.statut === "INDETERMINE") {
      findings.push({ regle: "C2", statut: "AVERTISSEMENT", ou: a.depot,
        message: `état AVANT indéterminé (${a.motif}) — la comparaison n'a pas de point de départ, aucun verdict n'est prononçable sur ce dépôt` });
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
