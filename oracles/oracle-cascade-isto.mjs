#!/usr/bin/env node
/**
 * oracle-cascade-isto — la cascade ISTO d'un produit tient sa chaîne, d'un bout à l'autre.
 *
 * C'EST LE CONTRÔLE DE LA LOI TRANSVERSE N° 7 (`references\INTENTION.md`, ISTO 2.0.0) SUR LA
 * MATIÈRE D'UN PRODUIT. Jusqu'au 03/10/2026, la loi n'était jouée qu'à deux endroits — E9/E10 sur
 * les études d'opportunité, S51 sur les restitutions — et les deux ne jugent qu'une PRÉSENCE :
 * qu'une intention soit dite, qu'un test rétro soit écrit. Aucun contrôle de la factory ne
 * connaissait le mot « tactique » (recherche sur `oracles\` et la forge de conception : 0 fichier).
 * Le seul produit qui tenait une cascade l'avait écrite à son propre format, avec sa propre porte :
 * chaque produit suivant l'aurait réinventée.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET CE QUI NE PEUT PAS L'ÊTRE
 * ============================================================================================
 *
 * La moitié STRUCTURELLE du test rétro est mécanisable dès que les identifiants existent : une
 * opération sans parent, une tactique sans opération, une stratégie qu'aucune tactique ne sert,
 * une exigence rattachée à deux tactiques ou à aucune. C'est ce que cet oracle bloque. La moitié
 * de FOND — l'intention citée est-elle la vraie, la tactique sert-elle vraiment la stratégie —
 * reste humaine, et c'est la trace de validation (I2) qui la rend opposable.
 *
 *   F1  `format` = pilot/cascade-isto@1, `version` en x.y.z, `date` en AAAA-MM-JJ ;
 *   U1  chaque identifiant (stratégie, tactique, contrainte, non-objectif, élément) est unique ;
 *   I1  l'intention porte au moins une citation sourcée (texte + source) et une reformulation ;
 *   I2  l'intention porte sa VALIDATION humaine : date, auteur, trace (entrée de ledger, décision) ;
 *   I3  plusieurs parties prenantes → un `arbitrage` écrit entre leurs intentions ;
 *   I4  `contraintes` et `non_objectifs` sont DÉCLARÉS (liste vide = « aucun », gratuit) et chaque
 *       entrée porte son énoncé et sa source ou son motif ;
 *   S1  chaque stratégie porte effet, manque, cible et un indicateur STRUCTURÉ — formule,
 *       numérateur, dénominateur, source (D9 : une mesure dit son dénominateur) ;
 *   S2  chaque stratégie porte sa valeur actuelle — mesurée (valeur, date, source) ou déclarée
 *       non mesurée avec son motif ;
 *   S3  chaque stratégie active est servie par au moins une tactique active ;
 *   T1  chaque tactique porte moyen, alternative écartée, justification, source et un statut de
 *       justification dans { sourcée, reconstruite } ;
 *   T2  chaque tactique cite une stratégie connue — et une tactique active sous une stratégie
 *       retirée est une RUPTURE ;
 *   T3  chaque tactique active porte au moins une opération (exigence ou autre élément) ;
 *   T4  un autre élément typé déclare son type dans le jeu fermé TYPES_ELEMENTS ;
 *   O1  (avec --exigences) chaque exigence du référentiel est rattachée à UNE tactique active et
 *       une seule, et la cascade ne cite aucune exigence inconnue ;
 *   H1  `historique` non vide, sa dernière entrée porte la version courante, chaque entrée dit le
 *       NIVEAU ISTO touché (I, S, T, O) et la décision qui l'a voulu ;
 *   H2  un élément retiré porte son motif ou son remplaçant — un retrait muet efface la chaîne.
 *
 * Ce qu'il MESURE sans bloquer : M1 cibles encore « à fixer », M2 justifications reconstruites,
 * M3 (avec --tests) exigences qu'aucun test ne cite, M4 stratégies non mesurées.
 *
 * Contrat : JSON {oracle, version, cible, verdict, findings[], mesures, non_juge[]} · exit 0/1/2.
 * Usage : node oracle-cascade-isto.mjs <CASCADE.json> [--exigences <EXIGENCES.json>]
 *                                      [--tests <dossier>] [--motif <regex>]
 *         node oracle-cascade-isto.mjs --self-test
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "1.0.0";
const FORMAT = "pilot/cascade-isto@1";
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const NIVEAUX = ["I", "S", "T", "O"];
const STATUTS_JUSTIFICATION = ["sourcée", "reconstruite"];
/** Les opérations hors exigences, une par phase du tableau d'ISTO 2.0.0. */
export const TYPES_ELEMENTS = ["ecran", "composant", "test", "commande_mep", "indicateur_exploitation",
  "controle_securite", "flux_donnees", "page_referencement", "document", "autre"];

/**
 * Le statut se lit sur son PREMIER MOT : « reconstruite — ratifiée le 2026-10-02 (D-21 (a)) » est un
 * statut commenté, légitime. Trouvé en jouant l'oracle sur la première cascade réelle du parc, avant
 * publication : la comparaison exacte refusait 5 tactiques sur 15 et comptait 0 en M2.
 */
const statutDe = (v) => (typeof v === "string" ? v.trim().split(/[\s—–:;,(]/)[0].toLowerCase() : null);
const plein = (v) => typeof v === "string" ? v.trim() !== "" : v !== undefined && v !== null;
const active = (x) => (x?.statut ?? "active") !== "retiree";

export function juger(cascade, { referentiel = null, testsCites = null } = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message, ou) => findings.push({ regle, statut: "FAIL", message, ...(ou ? { ou } : {}) });
  const regle = (id, defauts, message) => (defauts.length
    ? defauts.forEach((d) => ko(id, d.message ?? d, d.ou)) : ok(id, message));

  // F1 — le format, avant tout : une cascade à un autre format n'est pas jugeable champ par champ.
  if (cascade?.format !== FORMAT) {
    ko("F1", `format « ${cascade?.format ?? "absent"} » au lieu de « ${FORMAT} » — gabarit : gabarits\\CASCADE-ISTO.json`);
    return { findings, mesures: {} };
  }
  regle("F1", [
    ...(SEMVER.test(cascade.version ?? "") ? [] : ["`version` absente ou hors x.y.z"]),
    ...(DATE_ISO.test(cascade.date ?? "") ? [] : ["`date` absente ou hors AAAA-MM-JJ"]),
  ], `format ${FORMAT}, version ${cascade.version}`);

  const strategies = Array.isArray(cascade.strategies) ? cascade.strategies : [];
  const tactiques = Array.isArray(cascade.tactiques) ? cascade.tactiques : [];
  const contraintes = cascade.contraintes;
  const nonObjectifs = cascade.non_objectifs;

  // U1 — un identifiant en double rend tout rattachement ambigu.
  const ids = [
    ...strategies.map((s) => s.id), ...tactiques.map((t) => t.id),
    ...(Array.isArray(contraintes) ? contraintes.map((c) => c.id) : []),
    ...(Array.isArray(nonObjectifs) ? nonObjectifs.map((n) => n.id) : []),
    ...tactiques.flatMap((t) => (t.autres_elements ?? []).filter((e) => typeof e === "object").map((e) => e.id)),
  ];
  const vus = new Set();
  const doubles = new Set(ids.filter((i) => (vus.has(i) ? true : (vus.add(i), false))));
  regle("U1", [
    ...ids.filter((i) => !plein(i)).length ? ["un élément sans `id`"] : [],
    ...[...doubles].map((d) => `identifiant « ${d} » porté deux fois`),
  ], `${ids.length} identifiant(s) uniques`);

  // I1, I2, I3, I4 — l'intention et ce qui la borne.
  const intention = cascade.intention ?? {};
  regle("I1", [
    ...((intention.citations ?? []).some((c) => plein(c?.texte) && plein(c?.source)) ? []
      : ["l'intention ne porte aucune citation sourcée — elle doit être dans les MOTS du demandeur"]),
    ...(plein(intention.reformulation) ? [] : ["l'intention ne porte pas de reformulation"]),
  ], "intention citée et reformulée");
  const v = intention.validation ?? {};
  regle("I2", [
    ...(DATE_ISO.test(v.date ?? "") ? [] : ["`intention.validation.date` absente ou hors AAAA-MM-JJ"]),
    ...(plein(v.par) ? [] : ["`intention.validation.par` absent — qui a validé ?"]),
    ...(plein(v.trace) ? [] : ["`intention.validation.trace` absente — l'entrée de ledger ou la décision qui la prouve"]),
  ], `intention validée le ${v.date} (${v.trace})`);
  const parties = cascade.parties_prenantes;
  regle("I3", [
    ...(Array.isArray(parties) ? [] : ["`parties_prenantes` non déclarées — une liste vide vaut « le seul demandeur »"]),
    ...(Array.isArray(parties) && parties.length >= 2 && !plein(cascade.arbitrage)
      ? [`${parties.length} parties prenantes et aucun \`arbitrage\` écrit entre leurs intentions`] : []),
  ], Array.isArray(parties) && parties.length >= 2 ? "arbitrage écrit entre les parties prenantes" : "partie prenante unique déclarée");
  regle("I4", [
    ...(Array.isArray(contraintes) ? [] : ["`contraintes` non déclarées — une liste vide vaut « aucune », l'omission ne vaut rien"]),
    ...(Array.isArray(nonObjectifs) ? [] : ["`non_objectifs` non déclarés — une liste vide vaut « aucun »"]),
    ...(Array.isArray(contraintes) ? contraintes : []).filter((c) => !plein(c.enonce) || !plein(c.source))
      .map((c) => `contrainte ${c.id ?? "?"} sans énoncé ou sans source`),
    ...(Array.isArray(nonObjectifs) ? nonObjectifs : []).filter((n) => !plein(n.enonce) || !plein(n.motif))
      .map((n) => `non-objectif ${n.id ?? "?"} sans énoncé ou sans motif`),
  ], `${contraintes?.length ?? 0} contrainte(s), ${nonObjectifs?.length ?? 0} non-objectif(s) déclarés`);

  // S1, S2, S3 — des stratégies mesurables, et servies.
  const parId = new Map(strategies.map((s) => [s.id, s]));
  const s1 = [], s2 = [], s3 = [];
  for (const s of strategies) {
    for (const champ of ["effet", "manque", "cible"]) if (!plein(s[champ])) s1.push(`${s.id} sans « ${champ} »`);
    const ind = s.indicateur;
    if (typeof ind !== "object" || ind === null) s1.push(`${s.id} : indicateur non structuré (formule, numerateur, denominateur, source)`);
    else for (const champ of ["formule", "numerateur", "denominateur", "source"])
      if (!plein(ind[champ])) s1.push(`${s.id} : indicateur sans « ${champ} »`);
    const va = s.valeur_actuelle;
    if (typeof va !== "object" || va === null) s2.push(`${s.id} sans valeur actuelle (mesurée, ou non_mesuree avec son motif)`);
    else if (!plein(va.non_mesuree) && !(plein(va.valeur) && DATE_ISO.test(va.mesuree_le ?? "") && plein(va.source)))
      s2.push(`${s.id} : valeur actuelle sans valeur, date AAAA-MM-JJ et source — ou sans motif de non-mesure`);
    if (active(s) && !tactiques.some((t) => active(t) && t.strategie === s.id))
      s3.push(`${s.id} n'est servie par aucune tactique active`);
  }
  regle("S1", s1, `${strategies.length} stratégie(s) à indicateur structuré`);
  regle("S2", s2, "valeur actuelle déclarée pour chaque stratégie");
  regle("S3", s3, "chaque stratégie active est servie");

  // T1 à T4 — des tactiques justifiées, rattachées, opérées.
  const t1 = [], t2 = [], t3 = [], t4 = [];
  for (const t of tactiques) {
    for (const champ of ["moyen", "alternative_ecartee", "justification", "source"])
      if (!plein(t[champ])) t1.push(`${t.id} sans « ${champ} »`);
    if (!STATUTS_JUSTIFICATION.includes(statutDe(t.statut_justification)))
      t1.push(`${t.id} : statut_justification « ${t.statut_justification ?? "absent"} » hors { ${STATUTS_JUSTIFICATION.join(", ")} }`);
    const parent = parId.get(t.strategie);
    if (!parent) t2.push(`${t.id} cite une stratégie inconnue (${t.strategie ?? "aucune"}) — rupture ISTO`);
    else if (active(t) && !active(parent)) t2.push(`${t.id} active sous ${parent.id} retirée — rupture ISTO`);
    const ops = (t.exigences ?? []).length + (t.autres_elements ?? []).length;
    if (active(t) && ops === 0) t3.push(`${t.id} ne porte aucune opération`);
    for (const e of t.autres_elements ?? [])
      if (typeof e === "object" && !TYPES_ELEMENTS.includes(e.type))
        t4.push(`${t.id} : élément ${e.id ?? "?"} de type « ${e.type ?? "absent"} » hors du jeu fermé`);
  }
  regle("T1", t1, `${tactiques.length} tactique(s) justifiée(s)`);
  regle("T2", t2, "chaque tactique remonte à une stratégie active");
  regle("T3", t3, "chaque tactique active porte au moins une opération");
  regle("T4", t4, "éléments typés dans le jeu fermé");

  // O1 — le rattachement des exigences, quand le référentiel est fourni.
  const rattachement = new Map();
  for (const t of tactiques.filter(active))
    for (const e of t.exigences ?? []) rattachement.set(e, [...(rattachement.get(e) ?? []), t.id]);
  if (referentiel) {
    const connues = new Set(referentiel);
    regle("O1", [
      ...referentiel.filter((e) => !rattachement.has(e)).map((e) => `${e} rattachée à aucune tactique active — opération orpheline`),
      ...[...rattachement].filter(([, ts]) => ts.length > 1).map(([e, ts]) => `${e} rattachée à ${ts.length} tactiques (${ts.join(", ")}) — une seule`),
      ...[...rattachement.keys()].filter((e) => !connues.has(e)).map((e) => `${e} citée par la cascade, absente du référentiel`),
    ], `${referentiel.length}/${referentiel.length} exigence(s) rattachée(s) à une tactique et une seule`);
  }

  // H1, H2 — la cascade se versionne, et ce qui en sort laisse une trace.
  const hist = Array.isArray(cascade.historique) ? cascade.historique : [];
  const derniere = hist[hist.length - 1];
  regle("H1", [
    ...(hist.length ? [] : ["`historique` vide — une cascade qui change sans trace ne dit pas ce qu'elle a invalidé"]),
    ...(derniere && derniere.version !== cascade.version ? [`dernière entrée d'historique en ${derniere.version}, cascade en ${cascade.version}`] : []),
    ...hist.filter((h) => !NIVEAUX.includes(h.niveau)).map((h) => `historique ${h.version ?? "?"} : niveau « ${h.niveau ?? "absent"} » hors { I, S, T, O }`),
    ...hist.filter((h) => !DATE_ISO.test(h.date ?? "") || !plein(h.decision)).map((h) => `historique ${h.version ?? "?"} sans date AAAA-MM-JJ ou sans décision`),
  ], `${hist.length} version(s) tracée(s), niveau touché déclaré`);
  regle("H2", [...strategies, ...tactiques].filter((x) => !active(x) && !plein(x.motif_retrait) && !plein(x.remplacee_par))
    .map((x) => `${x.id} retirée sans motif_retrait ni remplacee_par`), "chaque retrait porte son motif");

  // Mesures — ce qui reste à ratifier ou à mettre en œuvre.
  const mesures = {
    M1_cibles_a_fixer: strategies.filter((s) => /à (fixer|trancher)/i.test(s.cible ?? "")).map((s) => s.id),
    M2_justifications_reconstruites: tactiques.filter((t) => statutDe(t.statut_justification) === "reconstruite").map((t) => t.id),
    M4_strategies_non_mesurees: strategies.filter((s) => plein(s.valeur_actuelle?.non_mesuree)).map((s) => s.id),
  };
  if (testsCites) mesures.M3_exigences_sans_test = [...rattachement.keys()].filter((e) => !testsCites.has(e)).sort();
  return { findings, mesures };
}

const NON_JUGE = [
  "la VÉRITÉ de l'intention : qu'une citation soit la vraie intention du demandeur. Seule la validation "
  + "humaine tranche, et I2 exige qu'elle soit tracée, jamais qu'elle soit juste",
  "la PERTINENCE d'un rattachement : qu'une tactique serve réellement sa stratégie, qu'une exigence serve "
  + "réellement sa tactique. L'oracle voit le lien, pas le sens",
  "l'EXACTITUDE d'une valeur actuelle : S2 exige la valeur, sa date et sa source, pas qu'elle soit bien mesurée",
  "la COUVERTURE par les tests : M3 lit l'identifiant dans le texte des tests — citée n'est pas testée",
];

function lireTestsCites(dossier, motif) {
  const re = new RegExp(motif, "g");
  const cites = new Set();
  const parcourir = (d) => {
    for (const nom of readdirSync(d)) {
      const p = join(d, nom);
      if (statSync(p).isDirectory()) { if (!/^(node_modules|\.git|__pycache__)$/.test(nom)) parcourir(p); }
      else if ([".py", ".mjs", ".js", ".ts", ".tsx", ".feature"].includes(extname(nom)))
        for (const m of readFileSync(p, "utf8").matchAll(re)) cites.add(m[0]);
    }
  };
  parcourir(dossier);
  return cites;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS");

// --- self-test : la fixture verte passe, chaque fixture rouge fait échouer SA règle ---------------
export function fixtureVerte() {
  return {
    format: FORMAT, projet: "Recette", version: "1.1.0", date: "2026-10-03", statut: "ratifiée",
    regle: "references/INTENTION.md 2.0.0",
    intention: {
      citations: [{ texte: "Je veux passer moins de temps sur le courrier sans rien perdre.", source: "BRIEF.md § Problème" }],
      reformulation: "Rendre au cabinet le temps du courrier de faible valeur.",
      validation: { date: "2026-10-02", par: "porteur du produit", trace: "ledger seq 12, D-3 (a)" },
    },
    parties_prenantes: [{ id: "PP-1", role: "cabinet", intention: "gagner du temps" },
      { id: "PP-2", role: "locataires", intention: "une réponse rapide" }],
    arbitrage: "Le temps du cabinet prime, sans allonger le délai de réponse aux locataires.",
    contraintes: [{ id: "C-1", enonce: "données personnelles traitées sur le poste", source: "RGPD, brief" }],
    non_objectifs: [{ id: "N-1", enonce: "envoyer sans relecture", motif: "le cabinet garde la main" }],
    strategies: [
      { id: "STR-1", effet: "relire au lieu d'écrire", manque: "tout s'écrit à la main",
        indicateur: { formule: "brouillons ÷ mails typés", numerateur: "brouillons déposés", denominateur: "mails typés", source: "statistiques" },
        valeur_actuelle: { valeur: "0 sur 14", mesuree_le: "2026-10-02", source: "base de production, lecture seule" },
        cible: "jalon 1 : un type en mode brouillon" },
      { id: "STR-2", effet: "ancienne stratégie", manque: "x", cible: "x", statut: "retiree", motif_retrait: "fusionnée dans STR-1",
        indicateur: { formule: "a ÷ b", numerateur: "a", denominateur: "b", source: "s" },
        valeur_actuelle: { non_mesuree: "retirée avant mesure" } },
    ],
    tactiques: [{ id: "TAC-1", strategie: "STR-1", moyen: "brouillon déposé", alternative_ecartee: "envoi automatique",
      justification: "le brief demande un brouillon", source: "BRIEF.md", statut_justification: "sourcée",
      exigences: ["E-001", "E-002"], autres_elements: [{ id: "ECR-1", type: "ecran", libelle: "liste des brouillons" }] }],
    historique: [
      { version: "1.0.0", date: "2026-10-02", niveau: "I", resume: "cascade initiale", decision: "D-3 (a)" },
      { version: "1.1.0", date: "2026-10-03", niveau: "S", resume: "STR-2 fusionnée", decision: "D-4 (a)" },
    ],
  };
}

function selfTest() {
  const ref = ["E-001", "E-002"];
  const cas = [];
  const rouge = (nom, regleAttendue, muter, opts = { referentiel: ref }) => {
    const c = fixtureVerte(); muter(c);
    const { findings } = juger(c, opts);
    const echoue = findings.some((f) => f.regle === regleAttendue && f.statut === "FAIL");
    cas.push({ nom: `cas rouge — ${nom}`, attendu: `${regleAttendue} FAIL`, ok: echoue });
  };
  const verte = juger(fixtureVerte(), { referentiel: ref });
  cas.push({ nom: "fixture verte", attendu: "PASS", ok: verdictDe(verte.findings) === "PASS" });
  rouge("format étranger", "F1", (c) => { c.format = "produit/cascade"; });
  rouge("version hors semver", "F1", (c) => { c.version = "v1"; });
  rouge("identifiant en double", "U1", (c) => { c.tactiques[0].id = "STR-1"; });
  rouge("intention sans citation", "I1", (c) => { c.intention.citations = []; });
  rouge("intention non validée", "I2", (c) => { delete c.intention.validation; });
  rouge("deux parties sans arbitrage", "I3", (c) => { delete c.arbitrage; });
  rouge("contraintes omises", "I4", (c) => { delete c.contraintes; });
  rouge("non-objectif sans motif", "I4", (c) => { delete c.non_objectifs[0].motif; });
  rouge("indicateur en prose", "S1", (c) => { c.strategies[0].indicateur = "part des brouillons"; });
  rouge("indicateur sans dénominateur", "S1", (c) => { delete c.strategies[0].indicateur.denominateur; });
  rouge("valeur actuelle sans date", "S2", (c) => { delete c.strategies[0].valeur_actuelle.mesuree_le; });
  rouge("stratégie non servie", "S3", (c) => { c.tactiques[0].strategie = "STR-2"; });
  rouge("tactique sans alternative", "T1", (c) => { delete c.tactiques[0].alternative_ecartee; });
  rouge("statut de justification inventé", "T1", (c) => { c.tactiques[0].statut_justification = "évidente"; });
  rouge("tactique sous stratégie inconnue", "T2", (c) => { c.tactiques[0].strategie = "STR-9"; });
  rouge("tactique active sous stratégie retirée", "T2", (c) => { c.tactiques[0].strategie = "STR-2"; });
  rouge("tactique sans opération", "T3", (c) => { c.tactiques[0].exigences = []; c.tactiques[0].autres_elements = []; });
  rouge("élément de type inventé", "T4", (c) => { c.tactiques[0].autres_elements[0].type = "gadget"; });
  rouge("exigence orpheline", "O1", () => {}, { referentiel: [...ref, "E-003"] });
  rouge("exigence inconnue", "O1", (c) => { c.tactiques[0].exigences.push("E-099"); });
  rouge("exigence sous deux tactiques", "O1", (c) => {
    c.tactiques.push({ ...c.tactiques[0], id: "TAC-2", autres_elements: [] });
  });
  rouge("historique vide", "H1", (c) => { c.historique = []; });
  rouge("historique en retard sur la version", "H1", (c) => { c.version = "1.2.0"; });
  rouge("niveau ISTO absent", "H1", (c) => { delete c.historique[1].niveau; });
  rouge("retrait muet", "H2", (c) => { delete c.strategies[1].motif_retrait; });
  // Les mesures ne bloquent pas : une cible à fixer laisse le verdict PASS et se compte en M1.
  const m = fixtureVerte(); m.strategies[0].cible = "à fixer au premier mois";
  const rm = juger(m, { referentiel: ref, testsCites: new Set(["E-001"]) });
  cas.push({ nom: "cible à fixer mesurée, non bloquante", attendu: "PASS + M1 + M3",
    ok: verdictDe(rm.findings) === "PASS" && rm.mesures.M1_cibles_a_fixer[0] === "STR-1" && rm.mesures.M3_exigences_sans_test[0] === "E-002" });
  // Un statut commenté se lit sur son premier mot : il passe T1 et se compte en M2.
  const sc = fixtureVerte(); sc.tactiques[0].statut_justification = "reconstruite — ratifiée le 2026-10-02 (D-21 (a))";
  const rsc = juger(sc, { referentiel: ref });
  cas.push({ nom: "statut de justification commenté", attendu: "PASS + M2",
    ok: verdictDe(rsc.findings) === "PASS" && rsc.mesures.M2_justifications_reconstruites[0] === "TAC-1" });
  for (const c of cas) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.nom} → ${c.attendu}`);
  const casse = cas.filter((c) => !c.ok);
  console.log(`\noracle-cascade-isto self-test : ${cas.length - casse.length}/${cas.length} PASS`);
  process.exit(casse.length ? 1 : 0);
}

const LANCE_EN_DIRECT = process.argv[1] === fileURLToPath(import.meta.url);
if (LANCE_EN_DIRECT) {
  const args = process.argv.slice(2);
  if (args[0] === "--self-test") selfTest();
  const opt = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const cible = args[0];
  if (!cible || cible.startsWith("--") || !existsSync(cible)) {
    console.log(JSON.stringify({ oracle: "oracle-cascade-isto", version: VERSION, verdict: "ERREUR",
      message: "cascade introuvable — usage : node oracle-cascade-isto.mjs <CASCADE.json> [--exigences <EXIGENCES.json>] [--tests <dossier>] [--motif <regex>] | --self-test" }));
    process.exit(2);
  }
  const cascade = JSON.parse(readFileSync(cible, "utf8"));
  const fExig = opt("--exigences");
  const referentiel = fExig ? (JSON.parse(readFileSync(fExig, "utf8")).exigences ?? []).map((e) => e.id) : null;
  const dTests = opt("--tests");
  const testsCites = dTests ? lireTestsCites(dTests, opt("--motif") ?? "\\bE-\\d{3}\\b") : null;
  const { findings, mesures } = juger(cascade, { referentiel, testsCites });
  const verdict = verdictDe(findings);
  console.log(JSON.stringify({ oracle: "oracle-cascade-isto", version: VERSION, cible, verdict,
    findings, mesures, non_juge: NON_JUGE }, null, 1));
  process.exit(verdict === "FAIL" ? 1 : 0);
}
