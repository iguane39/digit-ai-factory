#!/usr/bin/env node
/**
 * oracle-sollicitations.mjs — UNE SOLLICITATION HUMAINE SE JUSTIFIE OU N'EXISTE PAS (R-48, 24/08/2026).
 *
 * LE FAIT, ET C'EST UN RETOUR HUMAIN EN SÉANCE (23/08) : « demande à la Factory de retravailler les
 * éléments qu'elle peut traiter toute seule sans que j'aie de décisions à prendre à ce niveau-là —
 * l'exemple de l'input est particulièrement parlant, forcément que les inputs ne pouvaient pas
 * entrer dans le périmètre d'audit, c'est juste logique ». Les QUATRE constats du lot de forge-tests
 * de ce jour-là n'étaient pas quatre défauts : c'était quatre fois le même réflexe. À chaque fois la
 * réponse se déduisait du contexte — un dossier `input\` n'est pas du produit, un
 * `.min.js.téléchargement` n'est pas du code, le tour qu'on vient d'exécuter est celui qu'on doit
 * journaliser, les clés qu'on vient d'énumérer sont celles qu'on doit pré-remplir. À chaque fois
 * l'outil a préféré DÉGRADER son verdict et rendre la main plutôt que trancher.
 *
 * LE COÛT EST DOUBLE, et le second est le pire : le temps humain, et le SIGNAL NOYÉ. Un rapport qui
 * demande quatre arbitrages inutiles apprend à son lecteur à survoler la liste — donc à manquer le
 * cinquième, celui qui comptait.
 *
 * LE CRITÈRE, opposable et emprunté au retour lui-même : *si deux personnes compétentes
 * trancheraient identiquement sans information supplémentaire, ce n'est pas une décision, c'est un
 * défaut d'automatisation.* Il ne s'agit pas d'affaiblir le GO humain — il porte sur les VERDICTS et
 * les MISES EN PRODUCTION (R-29, loi n° 5), jamais sur des évidences de configuration.
 *
 *   SO1 · toute action laissée à l'humain porte sa NON-DÉDUCTIBILITÉ écrite : pourquoi deux
 *         personnes compétentes ne trancheraient pas pareil sans information de plus.
 *   SO2 · un verdict DÉGRADÉ par une configuration absente nomme le champ ET le défaut qui aurait
 *         pu s'appliquer, ou déclare pourquoi aucun défaut n'est raisonnable.
 *   SO3 · une passe qui a tranché d'office le DIT, dans une section relisible a posteriori. Une
 *         décision prise en silence est indiscernable d'un oubli (loi transverse n° 3).
 *
 * CE QUE CET ORACLE NE FAIT PAS, et c'est la moitié de son honnêteté : il ne juge pas si une
 * justification est BONNE. Il exige qu'elle existe et qu'elle parle de déductibilité. Juger le fond
 * demanderait de comprendre le domaine du rapport ; exiger la forme suffit à rendre le réflexe
 * visible, et c'est le réflexe qui a coûté quatre allers-retours.
 *
 * Usage : node oracle-sollicitations.mjs <rapport.json> [<rapport2.json> …] [--json] · --self-test
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé (aucun rapport lisible).
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "la JUSTESSE d'une justification : cet oracle exige qu'elle existe et qu'elle parle de déductibilité, pas qu'elle ait raison. Juger le fond demanderait de comprendre le domaine du rapport",
  "les actions `auto_ia` : elles ne sollicitent personne, donc SO1 ne les regarde pas",
  "les actions qui demandent de CORRIGER un défaut trouvé : ce n'est pas un arbitrage mais du travail, et la raison pour laquelle la forge ne le fait pas elle-même est permanente — elle audite, elle ne modifie pas le produit. Exiger une justification sous chacune produirait du remplissage : mesuré sur le parc, quatorze suites étaient concernées",
  "un rapport qui ne déclare AUCUNE action : il n'y a rien à justifier, et l'absence d'action n'est pas suspecte en soi",
  "les rapports d'un format inconnu : sans `actions[]` ni `verdict`, l'oracle rend SANS_OBJET plutôt qu'un verdict sur un objet qu'il n'a pas compris",
  "le GO humain sur un VERDICT ou une MISE EN PRODUCTION : il n'est pas une sollicitation évitable, c'est la loi n° 5 et R-29. Cet oracle ne le compte jamais comme un défaut",
];

/** Les catégories d'action qui SOLLICITENT un humain (vocabulaire gelé de `actions[]`, R-29). */
const SOLLICITE = new Set(["manuelle_utilisateur", "manuelle_dev"]);

/** DEMANDER UN TRAVAIL N'EST PAS DEMANDER UNE DÉCISION, et confondre les deux rendait cet oracle
 * absurde : mesuré sur le parc, il réclamait une justification de non-déductibilité à quatorze
 * suites qui disent simplement « corrigez ce lien cassé ». Corriger un défaut trouvé n'est pas un
 * arbitrage — c'est du travail que la forge ne fait pas parce qu'elle AUDITE, et cette raison-là
 * est permanente, pas à réécrire sous chaque ligne.
 *
 * Ce que R-48 vise est l'autre famille : les actions qui réclament une INFORMATION ou un ARBITRAGE.
 * Elles se reconnaissent mécaniquement — leur `finding_ref` désigne un MANQUE (configuration
 * absente, pan non couvert) et non un défaut constaté, ou leur texte demande de fournir, renseigner,
 * déclarer, arbitrer. C'est là que le réflexe dénoncé le 23/08 se logeait, et nulle part ailleurs. */
const DEMANDE_INFO = /^(non-testable|pan-non-couvert|manque|configuration)/i;
const VERBE_DEMANDE = /\b(fournir|renseigner|d[ée]clarer|arbitrer|choisir|trancher|autoriser|valider|confirmer|pr[ée]ciser)\b/i;

function reclameUnArbitrage(a) {
  if (DEMANDE_INFO.test(String(a?.finding_ref || ""))) return true;
  return VERBE_DEMANDE.test(String(a?.attendu || ""));
}

/** Un texte parle de DÉDUCTIBILITÉ s'il dit pourquoi la réponse ne se déduit pas du contexte. */
const PARLE_DEDUCTIBILITE = new RegExp([
  // Les tournures que le parc emploie DÉJÀ pour bien justifier — calibrées sur le corpus réel des
  // suites d'action de forge-tests le 24/08, et non sur ce qu'on imaginait qu'elles diraient. Trois
  // d'entre elles étaient excellentes et l'oracle les accusait : « ARBITRER le rendu », « aucun
  // agent ne peut », « personne d'autre que l'humain qui tient les comptes ». Un contrôle qui
  // condamne la bonne pratique existante met le contrôle en défaut, jamais l'auteur.
  "ne se déduit pas", "non d[ée]ductible", "pas d[ée]ductible",
  "deux (personnes|lecteurs) comp[ée]tent", "arbitr",
  "aucun agent ne (peut|pourrait)", "personne d.autre",
  "d[ée]pend d.un choix", "d[ée]pend du client", "qui tient (le d[ée]ploiement|les comptes)",
  "information (dont|que) (nous|l.outil) ne (dispose|disposons) pas",
  "seul l.humain", "pr[ée]f[ée]rence", "budget", "d[ée]pense",
  "mise en production", "GO humain", "verdict humain",
  "donn[ée]e absente du d[ée]p[oô]t", "secret", "identifiant", "acc[èe]s",
  "conforme [àa] l.intention",
].join("|"), "i");

/** Un verdict est DÉGRADÉ quand il n'est ni vert ni franchement rouge. */
const DEGRADE = /^(PARTIEL|PARTIELLE|DEGRADE|DÉGRADÉ|BLOQUE|BLOQUÉ|INCOMPLET|SKIP)$/i;

/** Ce qui trahit une cause de CONFIGURATION dans un motif. */
const CAUSE_CONFIG =
  /(configuration|\.env|variable d'environnement|non renseigné|absente?|non installé|non déclaré|clé manquante|seuil non|non fourni)/i;

export function juger(rapport, nom = "rapport") {
  const constats = [];
  const actions = Array.isArray(rapport?.actions) ? rapport.actions : null;
  const verdict = typeof rapport?.verdict === "string" ? rapport.verdict : null;
  if (!actions && !verdict) return { constats, forme: false };

  // SO1 — chaque sollicitation porte sa non-déductibilité.
  for (const [i, a] of (actions || []).entries()) {
    if (!SOLLICITE.has(String(a?.categorie || ""))) continue;
    if (!reclameUnArbitrage(a)) continue;      // demander un TRAVAIL n'est pas demander une décision
    // Le champ dédié d'abord ; à défaut, la justification peut vivre dans le texte attendu — on ne
    // force pas un champ neuf sur les rapports existants, on exige que la RAISON soit écrite.
    const texte = [a?.non_deductible, a?.pourquoi_humain, a?.attendu, a?.motif].filter(Boolean).join(" · ");
    if (!texte.trim()) {
      constats.push({ regle: "SO1", ou: `${nom}#actions[${i}]`,
        message: `action « ${String(a?.categorie)} » sans un mot de justification : ` +
          "une sollicitation humaine sans motif est un défaut d'automatisation déguisé en décision" });
      continue;
    }
    if (!PARLE_DEDUCTIBILITE.test(texte)) {
      constats.push({ regle: "SO1", ou: `${nom}#actions[${i}]`,
        message: `action « ${String(a?.categorie)} » justifiée par ce qu'il FAUT faire, jamais par ` +
          `ce que l'outil ne pouvait pas décider — « ${texte.slice(0, 90)}… ». Le critère est ` +
          "opposable : si deux personnes compétentes trancheraient identiquement sans information " +
          "supplémentaire, ce n'est pas une décision, c'est un défaut d'automatisation" });
    }
  }

  // SO2 — un verdict dégradé par une configuration absente nomme le défaut qui aurait pu servir.
  if (verdict && DEGRADE.test(verdict)) {
    const motifs = [
      ...Object.values(rapport?.motifs_non_couverture || {}),
      ...(Array.isArray(rapport?.non_juge) ? rapport.non_juge : []),
      ...(Array.isArray(rapport?.non_testables) ? rapport.non_testables.map((x) => JSON.stringify(x)) : []),
    ].map(String);
    const config = motifs.filter((m) => CAUSE_CONFIG.test(m));
    const parleDefaut = motifs.some((m) => /(valeur par défaut|défaut appliqué|par défaut :|défaut retenu|aucun défaut raisonnable|pas de défaut possible)/i.test(m))
      || Array.isArray(rapport?.decisions_office);
    if (config.length && !parleDefaut) {
      constats.push({ regle: "SO2", ou: nom,
        message: `verdict « ${verdict} » dégradé par ${config.length} cause(s) de CONFIGURATION ` +
          `— « ${config[0].slice(0, 90)}… » — sans qu'aucun défaut applicable soit nommé. Un ` +
          "verdict dégradé faute d'un réglage devinable est un défaut d'automatisation : nommer " +
          "le défaut retenu, ou écrire pourquoi aucun n'est raisonnable" });
    }
  }

  // SO3 — ce qui a été tranché d'office se dit.
  const aTranche = (actions || []).some((a) => String(a?.categorie) === "auto_ia" && /d'office|par défaut|défaut appliqué/i.test(String(a?.attendu || "")));
  if (aTranche && !Array.isArray(rapport?.decisions_office)) {
    constats.push({ regle: "SO3", ou: nom,
      message: "la passe a tranché d'office sans section « decisions_office » : une décision prise " +
        "en silence est indiscernable d'un oubli (loi transverse n° 3), et c'est justement ce qui " +
        "empêche de la relire a posteriori" });
  }
  return { constats, forme: true };
}

// ---- recette : les deux sens ------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");

if (lanceEnDirect && args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette de oracle-sollicitations — les deux sens\n");

  const ROUGE = {
    verdict: "PARTIEL",
    motifs_non_couverture: { api: "api : couverture non mesurable — aucune configuration renseignée dans .env.forge-tests" },
    actions: [{ categorie: "manuelle_utilisateur", attendu: "renseigner la configuration d'audit du pan « api », puis relancer" }],
  };
  const r1 = juger(ROUGE, "rouge.json");
  att("une sollicitation justifiée par ce qu'il FAUT faire est signalée (SO1)",
    r1.constats.some((c) => c.regle === "SO1"));
  att("un verdict dégradé par une configuration, sans défaut nommé, est signalé (SO2)",
    r1.constats.some((c) => c.regle === "SO2"));

  const VERT = {
    verdict: "PARTIEL",
    motifs_non_couverture: { api: "api : non mesurable — aucune configuration ; défaut retenu : périmètre restreint aux routes servies, déclaré au rapport" },
    actions: [{
      categorie: "manuelle_utilisateur",
      attendu: "fournir le jeton d'accès à l'API de recette",
      non_deductible: "le jeton est un secret : aucune information du dépôt ne permet de le déduire, et deux personnes compétentes ne le devineraient pas davantage",
    }],
  };
  const r2 = juger(VERT, "vert.json");
  att("une sollicitation qui dit sa NON-DÉDUCTIBILITÉ ne déclenche rien", !r2.constats.some((c) => c.regle === "SO1"));
  att("un défaut nommé lève SO2", !r2.constats.some((c) => c.regle === "SO2"));

  att("une action `auto_ia` ne sollicite personne et n'est pas jugée par SO1",
    juger({ verdict: "PASS", actions: [{ categorie: "auto_ia", attendu: "corriger le libellé" }] }, "x").constats.length === 0);

  att("un rapport sans actions ni verdict rend SANS_OBJET plutôt qu'un verdict inventé",
    juger({ quelque: "chose" }, "x").forme === false);

  const OFFICE = { verdict: "PASS", actions: [{ categorie: "auto_ia", attendu: "périmètre restreint d'office aux routes servies" }] };
  att("une décision prise d'office sans section qui la déclare est signalée (SO3)",
    juger(OFFICE, "x").constats.some((c) => c.regle === "SO3"));
  att("la même décision DÉCLARÉE ne déclenche rien",
    !juger({ ...OFFICE, decisions_office: ["périmètre restreint aux routes servies"] }, "x").constats.some((c) => c.regle === "SO3"));

  // BORNE : un GO humain sur une mise en production n'est PAS une sollicitation évitable.
  att("un GO humain de mise en production n'est jamais compté comme un défaut",
    !juger({ verdict: "PASS", actions: [{ categorie: "manuelle_utilisateur", attendu: "donner le GO de mise en production", non_deductible: "la mise en production est un gate humain (loi n° 5, R-29)" }] }, "x")
      .constats.some((c) => c.regle === "SO1"));

  // Le fichier réel : la recette lit un rapport écrit sur disque, pas seulement un objet en mémoire.
  const dir = mkdtempSync(join(tmpdir(), "sollicitations-"));
  const f = join(dir, "rapport-rouge.json");
  writeFileSync(f, JSON.stringify(ROUGE), "utf8");
  att("un rapport LU SUR DISQUE est jugé comme l'objet en mémoire",
    juger(JSON.parse(readFileSync(f, "utf8")), basename(f)).constats.length === r1.constats.length);
  rmSync(dir, { recursive: true, force: true });

  console.log(`\nRecette sollicitations : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

if (lanceEnDirect) {
  const cibles = args.filter((a) => !a.startsWith("--"));
  if (!cibles.length) {
    so("SO0", "(aucun argument)", "aucun rapport à juger — cet oracle juge un ARTEFACT qu'on lui passe, il ne balaie pas le parc");
  }
  for (const c of cibles) {
    if (!existsSync(c)) { so("SO0", c, "rapport introuvable — non vérifié, jamais accusé"); continue; }
    let j = null;
    try { j = JSON.parse(readFileSync(c, "utf8")); }
    catch (e) { so("SO0", c, `rapport illisible (${String(e.message).slice(0, 60)}) — non vérifié, jamais accusé`); continue; }
    const { constats, forme } = juger(j, basename(c));
    if (!forme) { so("SO0", c, "ni `actions[]` ni `verdict` : format inconnu, l'oracle ne se prononce pas"); continue; }
    if (!constats.length) ok("SO1", c, "toute sollicitation humaine porte sa non-déductibilité, et rien n'est tranché en silence");
    else for (const x of constats) ko(x.regle, x.ou, x.message);
  }
  const verdict = F.some((f) => f.statut === "FAIL") ? "FAIL"
    : F.every((f) => f.statut === "SANS_OBJET") ? "SKIP" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-sollicitations", version: "1.0.0", verdict,
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
}
