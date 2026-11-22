#!/usr/bin/env node
/**
 * oracle-peremption-competences.mjs — juge le registre des compétences (`references\COMPETENCES.json`) et rend
 * UN verdict par compétence : à jour, périmée ou sans date (TF-2743, lot L-01 du plan de mise à jour des
 * compétences du 21/11/2026).
 *
 * LE FAIT. Aucune compétence de la Factory ne portait de durée de validité : 27 skills et 4 corpus n'avaient ni
 * date ni source, et le corpus AWS donnait App Runner pour le service canonique alors qu'AWS ne le propose plus
 * aux nouveaux clients (page lue le 21/11/2026, rapporté par le plan). Une compétence est une donnée volatile
 * (loi n° 4) : elle s'écrit datée, sourcée et bornée dans le temps, et un contrôle dit quand elle a dépassé sa
 * durée. Les trois durées sont celles du plan : technique 60 jours, fonctionnelle 120, sectorielle 180.
 *
 * LA DOCTRINE (D-229 (c) du 21/11/2026) : le contrôle AVERTIT, il ne bloque rien. Le régime est une donnée du
 * registre (`regime`, par type) : « avertissement » (défaut) rend un finding AVERT et laisse le verdict à PASS ;
 * « bloquant » rend FAIL pour une compétence périmée ou sans date de ce type. Passer de l'un à l'autre est une
 * édition du registre, jamais du code (retour arrière sans développement).
 *
 * RÈGLES.
 *   P1  le registre est lisible et complet : schéma, trois types avec une durée entière positive, un régime par
 *       type, des compétences aux ids uniques, chacune avec son type connu, ses artefacts, ses forges, sa durée
 *       et sa date `verifie_le` (AAAA-MM-JJ passée, ou null) ;
 *   P2  la durée d'une compétence est celle de son type, sauf `derogation` motivée ;
 *   P3  chaque forge nommée (porteuse ou d'un artefact) est une forge connue de `bootstrap` (`FORGES` de
 *       scripts\lib-parc.mjs) ou le pilot ;
 *   P4  chaque artefact nommé existe. Une forge dont le dépôt est absent du parc n'est jamais jugée (SKIP motivé,
 *       critère « parc absent » de TF-1133) : un artefact introuvable dans un dépôt présent est un FAIL ;
 *   P5  un verdict par compétence : `a_jour` (âge ≤ durée), `perimee` (âge > durée), `sans_date`
 *       (`verifie_le` null). Statut du finding : PASS, ou AVERT / FAIL selon le régime du type.
 *
 * NON JUGÉ (rendu dans chaque sortie) : voir `NON_JUGE`.
 *
 * Usage : node oracles\oracle-peremption-competences.mjs [registre.json] [--le AAAA-MM-JJ] [--parc <dossier>]
 *         node oracles\oracle-peremption-competences.mjs --self-test
 * Sortie : JSON · exit 0 = PASS (avertissements compris) · 1 = au moins un FAIL · 2 = registre introuvable.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FORGES, PILOT } from "../scripts/lib-parc.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const VERSION = "1.0.0";
const TYPES = ["technique", "sectorielle", "fonctionnelle"];
const REGIMES = ["avertissement", "bloquant"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const JOUR_MS = 86_400_000;

export const NON_JUGE = [
  "la véracité du contenu d'une compétence : le registre date la dernière relecture de sa source, il ne la refait pas",
  "que `verifie_le` dise vrai : c'est une déclaration du pilot, remise à la date du jour par le geste de relire la source",
  "les 27 skills des forges et leurs familles (production documentaire, commercial, méthode et qualité, intégration d'IA) : aucune ne porte de date de vérification, elles ne sont pas au registre",
  "les compétences absentes (Beds24, Stripe, Google Ads, courriel, poste Windows, API Claude…) : le plan du 21/11/2026 les range en lots de création L-04 à L-16",
];

const jours = (iso) => Date.parse(`${iso}T00:00:00Z`) / JOUR_MS;
const aujourdhui = () => new Date().toISOString().slice(0, 10);

/**
 * Juge un registre. `racinePilot` : dossier du pilot (artefacts de la forge « digit-ai-factory ») ; `racineParc` :
 * dossier qui porte les forges ; `le` : le jour du jugement. Rend { findings, entrees, resume }.
 */
export function jugerRegistre(registre, { racinePilot = RACINE, racineParc = join(RACINE, ".."), le = aujourdhui() } = {}) {
  const findings = [];
  const entrees = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const resume = { total: 0, a_jour: 0, perimees: 0, sans_date: 0 };

  if (!registre || registre.schema !== "pilot/competences@1") { ko("P1", `schéma inattendu : ${registre?.schema}`); return { findings, entrees, resume }; }
  const types = registre.types ?? {};
  for (const t of TYPES) {
    const d = types[t]?.duree_jours;
    if (!Number.isInteger(d) || d <= 0) ko("P1", `types.${t}.duree_jours : entier positif attendu (lu : ${JSON.stringify(d)})`);
    if (!REGIMES.includes(registre.regime?.[t])) ko("P1", `regime.${t} : « avertissement » ou « bloquant » attendu (lu : ${JSON.stringify(registre.regime?.[t])})`);
  }
  const liste = registre.competences;
  if (!Array.isArray(liste) || !liste.length) { ko("P1", "competences : tableau non vide attendu"); return { findings, entrees, resume }; }
  if (!ISO.test(le)) { ko("P1", `jour de jugement illisible : ${le}`); return { findings, entrees, resume }; }

  const connues = new Set([...FORGES.map((f) => f.nom), PILOT]);
  const vus = new Set();
  let structure = 0, durees = 0, forgesKo = 0, artefactsKo = 0, artefactsOk = 0, artefactsSkip = 0;
  for (const c of liste) {
    const id = c?.id ?? "?";
    const manques = ["id", "nom", "type", "artefacts", "forges", "duree_jours", "verifie_le"].filter((k) => c?.[k] === undefined);
    if (manques.length) { ko("P1", `${id} : champ(s) manquant(s) : ${manques.join(", ")}`); structure++; continue; }
    if (vus.has(c.id)) { ko("P1", `id dupliqué : ${c.id}`); structure++; continue; }
    vus.add(c.id);
    if (!TYPES.includes(c.type)) { ko("P1", `${c.id} : type « ${c.type} » hors {${TYPES.join(", ")}}`); structure++; continue; }
    if (!Array.isArray(c.artefacts) || !c.artefacts.length || !Array.isArray(c.forges) || !c.forges.length) { ko("P1", `${c.id} : artefacts et forges doivent être des tableaux non vides`); structure++; continue; }
    if (c.verifie_le !== null && (!ISO.test(c.verifie_le) || jours(c.verifie_le) > jours(le))) { ko("P1", `${c.id} : verifie_le « ${c.verifie_le} » n'est ni null ni une date AAAA-MM-JJ passée`); structure++; continue; }
    if (!Number.isInteger(c.duree_jours) || c.duree_jours <= 0) { ko("P1", `${c.id} : duree_jours entier positif attendu`); structure++; continue; }

    if (c.duree_jours !== types[c.type]?.duree_jours && !(typeof c.derogation === "string" && c.derogation.trim())) {
      ko("P2", `${c.id} : durée ${c.duree_jours} j, celle du type ${c.type} est ${types[c.type]?.duree_jours} j, sans « derogation » motivée`); durees++;
    }
    for (const f of [...c.forges, ...c.artefacts.map((a) => a?.forge)]) {
      if (!connues.has(f)) { ko("P3", `${c.id} : forge « ${f} » inconnue de bootstrap (FORGES de scripts/lib-parc.mjs) ni du pilot`); forgesKo++; }
    }
    for (const a of c.artefacts) {
      if (!a?.forge || !a?.chemin || !connues.has(a.forge)) continue;
      const depot = a.forge === PILOT ? racinePilot : join(racineParc, a.forge);
      if (!existsSync(depot)) { artefactsSkip++; continue; }
      if (existsSync(join(depot, a.chemin))) artefactsOk++;
      else { ko("P4", `${c.id} : artefact « ${a.chemin} » introuvable dans ${a.forge}`); artefactsKo++; }
    }

    // P5 : un verdict par compétence
    const regime = registre.regime?.[c.type] ?? "avertissement";
    let verdict, detail;
    if (c.verifie_le === null) { verdict = "sans_date"; detail = "aucune date de relecture de sa source"; resume.sans_date++; }
    else {
      const age = Math.round(jours(le) - jours(c.verifie_le));
      const echeance = new Date((jours(c.verifie_le) + c.duree_jours) * JOUR_MS).toISOString().slice(0, 10);
      if (age > c.duree_jours) { verdict = "perimee"; detail = `vérifiée le ${c.verifie_le}, âge ${age} j pour une durée de ${c.duree_jours} j, échéance dépassée le ${echeance} (${age - c.duree_jours} j de retard)`; resume.perimees++; }
      else { verdict = "a_jour"; detail = `vérifiée le ${c.verifie_le}, âge ${age} j pour une durée de ${c.duree_jours} j, échéance le ${echeance}`; resume.a_jour++; }
    }
    resume.total++;
    const statut = verdict === "a_jour" ? "PASS" : regime === "bloquant" ? "FAIL" : "AVERT";
    findings.push({ regle: "P5", statut, id: c.id, message: `${c.id} (${c.type}) : ${verdict} — ${detail}${verdict === "a_jour" ? "" : ` ; régime ${regime} (D-229) : relire la source puis remettre verifie_le à la date du jour`}` });
    entrees.push({ id: c.id, type: c.type, verdict, verifie_le: c.verifie_le, duree_jours: c.duree_jours, regime });
  }
  if (!structure) ok("P1", `registre lisible : ${liste.length} compétences, trois types, régime par type`);
  if (!durees) ok("P2", "chaque durée est celle de son type, ou dérogée avec motif");
  if (!forgesKo) ok("P3", "chaque forge nommée est connue de bootstrap ou est le pilot");
  if (!artefactsKo) findings.push({ regle: "P4", statut: artefactsOk ? "PASS" : "SKIP", message: `${artefactsOk} artefact(s) trouvé(s)${artefactsSkip ? `, ${artefactsSkip} non jugé(s) : dépôt de forge absent du parc` : ""}` });
  return { findings, entrees, resume };
}

function selfTest() {
  const dossier = mkdtempSync(join(tmpdir(), "oracle-peremption-"));
  const parc = join(dossier, "parc");
  const pilote = join(parc, PILOT);
  mkdirSync(join(parc, "digit-ai-forge-agents", "c"), { recursive: true });
  mkdirSync(join(pilote, "references"), { recursive: true });
  writeFileSync(join(parc, "digit-ai-forge-agents", "c", "corpus.md"), "x", "utf8");
  writeFileSync(join(pilote, "references", "R.json"), "{}", "utf8");
  const LE = "2026-11-22";
  const base = () => ({
    schema: "pilot/competences@1", version: "1.0.0",
    regime: { technique: "avertissement", sectorielle: "avertissement", fonctionnelle: "avertissement" },
    types: { technique: { duree_jours: 60 }, sectorielle: { duree_jours: 180 }, fonctionnelle: { duree_jours: 120 } },
    competences: [
      { id: "tech", nom: "T", type: "technique", artefacts: [{ forge: "digit-ai-forge-agents", chemin: "c/corpus.md" }], forges: ["digit-ai-forge-agents"], duree_jours: 60, verifie_le: "2026-11-20" },
      { id: "sect", nom: "S", type: "sectorielle", artefacts: [{ forge: PILOT, chemin: "references/R.json" }], forges: [PILOT], duree_jours: 180, verifie_le: "2026-08-01" },
      { id: "fonc", nom: "F", type: "fonctionnelle", artefacts: [{ forge: "digit-ai-forge-agents", chemin: "c/corpus.md" }], forges: ["digit-ai-forge-agents"], duree_jours: 120, verifie_le: "2026-09-01" },
    ],
  });
  const juger = (reg, opts = {}) => jugerRegistre(reg, { racinePilot: pilote, racineParc: parc, le: LE, ...opts });
  const aKo = (r, regle, motif) => r.findings.some((f) => f.statut === "FAIL" && f.regle === regle && (!motif || motif.test(f.message)));
  const verdict = (r) => (r.findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS");
  const resultats = [];
  const cas = (fixture, attendu, obtenu) => resultats.push({ fixture, attendu, obtenu });

  // vert : trois compétences à jour, aucun avertissement
  const vert = juger(base());
  cas("verte : trois compétences à jour", "PASS 3 a_jour 0 AVERT", `${verdict(vert)} ${vert.resume.a_jour} a_jour ${vert.findings.filter((f) => f.statut === "AVERT").length} AVERT`);
  cas("un verdict P5 par compétence", "3", String(vert.findings.filter((f) => f.regle === "P5").length));

  // D-229 (c) : périmée en régime « avertissement » → AVERT qui la nomme, verdict PASS
  const perimee = base(); perimee.competences[0].verifie_le = "2026-08-11";
  const rPer = juger(perimee);
  cas("D-229 (c) : une technique périmée avertit, n'échoue pas", "PASS", verdict(rPer));
  cas("l'avertissement nomme la compétence, son âge et son retard (103 j pour 60 j : 43 j)", "oui", rPer.findings.some((f) => f.statut === "AVERT" && f.id === "tech" && /perimee/.test(f.message) && /âge 103 j/.test(f.message) && /43 j de retard/.test(f.message)) ? "oui" : "non");
  // régime « bloquant » du type technique : la même compétence échoue ; les autres types restent en avertissement
  const bloq = JSON.parse(JSON.stringify(perimee)); bloq.regime.technique = "bloquant";
  cas("régime bloquant : la technique périmée échoue", "FAIL", verdict(juger(bloq)));
  const bloqAutre = JSON.parse(JSON.stringify(base())); bloqAutre.regime.technique = "bloquant"; bloqAutre.competences[1].verifie_le = "2026-01-01";
  cas("régime bloquant d'un autre type : une sectorielle périmée avertit seulement", "PASS", verdict(juger(bloqAutre)));
  // le remède que le message recommande est joué : relire la source remet la date du jour
  const releve = JSON.parse(JSON.stringify(perimee)); releve.competences[0].verifie_le = LE;
  const rRel = juger(releve);
  cas("remède joué : verifie_le remise à la date du jour → à jour", "PASS 3 a_jour", `${verdict(rRel)} ${rRel.resume.a_jour} a_jour`);
  // sans date
  const sansDate = base(); sansDate.competences[2].verifie_le = null;
  const rSans = juger(sansDate);
  cas("sans date : avertit « sans_date », jamais « à jour »", "PASS sans_date", `${verdict(rSans)} ${rSans.entrees.find((e) => e.id === "fonc").verdict}`);
  // frontière : exactement la durée → à jour ; un jour de plus → périmée
  const bord = base(); bord.competences[0].verifie_le = "2026-09-23"; // 60 j avant le 22/11
  cas("frontière : âge = durée → à jour", "a_jour", juger(bord).entrees[0].verdict);
  bord.competences[0].verifie_le = "2026-09-22";
  cas("frontière : âge = durée + 1 → périmée", "perimee", juger(bord).entrees[0].verdict);

  // structure : chaque règle P1 à P4 a sa fixture rouge
  const typeInconnu = base(); typeInconnu.competences[0].type = "mystique";
  cas("rouge P1 : type inconnu", "FAIL", aKo(juger(typeInconnu), "P1", /mystique/) ? "FAIL" : "PASS");
  const doublon = base(); doublon.competences[1].id = "tech";
  cas("rouge P1 : id dupliqué", "FAIL", aKo(juger(doublon), "P1", /dupliqué/) ? "FAIL" : "PASS");
  const futur = base(); futur.competences[0].verifie_le = "2026-12-31";
  cas("rouge P1 : verifie_le dans le futur", "FAIL", aKo(juger(futur), "P1", /passée/) ? "FAIL" : "PASS");
  const sansRegime = base(); delete sansRegime.regime.technique;
  cas("rouge P1 : régime absent pour un type", "FAIL", aKo(juger(sansRegime), "P1", /regime\.technique/) ? "FAIL" : "PASS");
  const duree = base(); duree.competences[0].duree_jours = 365;
  cas("rouge P2 : durée différente de celle du type, sans dérogation", "FAIL", aKo(juger(duree), "P2") ? "FAIL" : "PASS");
  duree.competences[0].derogation = "source éditeur qui publie une fois l'an";
  cas("vert P2 : la même durée avec dérogation motivée", "PASS", aKo(juger(duree), "P2") ? "FAIL" : "PASS");
  const forgeInconnue = base(); forgeInconnue.competences[0].forges = ["digit-ai-forge-fantome"];
  cas("rouge P3 : forge inconnue de bootstrap", "FAIL", aKo(juger(forgeInconnue), "P3", /fantome/) ? "FAIL" : "PASS");
  const absent = base(); absent.competences[0].artefacts[0].chemin = "c/disparu.md";
  cas("rouge P4 : artefact introuvable dans un dépôt présent", "FAIL", aKo(juger(absent), "P4", /disparu\.md/) ? "FAIL" : "PASS");
  const sansDepot = juger(base(), { racineParc: join(dossier, "parc-absent"), racinePilot: join(dossier, "pilote-absent") });
  cas("SKIP P4 : dépôts absents du parc, jamais FAIL ni PASS", "SKIP", sansDepot.findings.find((f) => f.regle === "P4").statut);

  // le registre réel : 24 compétences, un verdict chacune, structure tenue (D-229 (c) : péremption en avertissement)
  const reel = JSON.parse(readFileSync(join(RACINE, "references", "COMPETENCES.json"), "utf8"));
  const rReel = jugerRegistre(reel, { racinePilot: RACINE, racineParc: process.env.FORGE_ROOT || join(RACINE, ".."), le: LE });
  cas("registre réel : 24 compétences, un verdict P5 chacune", "24 24", `${reel.competences.length} ${rReel.findings.filter((f) => f.regle === "P5").length}`);
  cas("registre réel : aucune règle de structure en échec, régime d'avertissement", "PASS", verdict(rReel));
  cas("registre réel : les trois types sont en avertissement (D-229 (c))", "avertissement", [...new Set(Object.values(reel.regime))].join(","));

  rmSync(dossier, { recursive: true, force: true });
  const rates = resultats.filter((r) => r.attendu !== r.obtenu);
  console.log(JSON.stringify({ oracle: "oracle-peremption-competences", mode: "self-test", verdict: rates.length ? "FAIL" : "PASS", resultats }, null, 1));
  process.exit(rates.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (process.argv.includes("--self-test")) selfTest();
  const arg = (nom) => { const i = process.argv.indexOf(nom); return i === -1 ? null : process.argv[i + 1]; };
  const positionnels = process.argv.slice(2).filter((a, i, t) => !a.startsWith("--") && !["--le", "--parc"].includes(t[i - 1]));
  const chemin = positionnels[0] || join(RACINE, "references", "COMPETENCES.json");
  let registre;
  try { registre = JSON.parse(readFileSync(chemin, "utf8")); }
  catch (e) {
    console.log(JSON.stringify({ oracle: "oracle-peremption-competences", verdict: "ERREUR", message: `registre introuvable ou illisible : ${chemin} (${e.message})` }, null, 1));
    process.exit(2);
  }
  const racinePilot = positionnels[0] ? dirname(dirname(chemin)) : RACINE;
  const parc = arg("--parc") || process.env.FORGE_ROOT || join(RACINE, "..");
  const { findings, entrees, resume } = jugerRegistre(registre, { racinePilot, racineParc: parc, le: arg("--le") || aujourdhui() });
  const echecs = findings.filter((f) => f.statut === "FAIL").length;
  const avertissements = findings.filter((f) => f.statut === "AVERT").length;
  console.log(JSON.stringify({
    oracle: "oracle-peremption-competences", version: VERSION, verdict: echecs ? "FAIL" : "PASS",
    resume: { ...resume, avertissements, echecs }, entrees, findings, non_juge: NON_JUGE,
  }, null, 1));
  process.exit(echecs ? 1 : 0);
}
