#!/usr/bin/env node
/**
 * oracle-run-reseau.mjs — juge UNE SEMAINE d'un run d'animation de réseau
 * (`references\RUN-RESEAU.md`, TF-1158, décision humaine D-2 (a) du 17/09/2026).
 *
 * Pourquoi un oracle : le type de run disait de lui-même « tant que la semaine d'essai n'a pas
 * tourné, ce document décrit une séquence, il ne la prouve pas ». Une séquence hebdomadaire qui
 * ne se juge qu'à la relecture ne tient pas trois semaines : c'est le rendez-vous qui manquait
 * (0 publication en 6 jours chez le produit), donc c'est lui qui se contrôle.
 *
 * Ce qu'il lit : un DOSSIER de semaine —
 *   calendrier.md     N1 : horizon de 4 semaines, une ligne de tableau par publication prévue ;
 *   publication.md    N2 : le contenu, frontmatter `compte: profil|page`, `genere: true|false` ;
 *   accord.json       N3 : { accord, date, par, fictif } — l'accord HUMAIN de publication (R-38) ;
 *   mesures.json      N5 : { export, temps_humain_minutes, indicateurs:[{nom,valeur,seuil}] }.
 *
 * Règles (chacune binaire) :
 *   RR1 calendrier présent, ≥ 4 lignes de publication datées (horizon de 4 semaines) ;
 *   RR2 contrat de sortie du modèle « publication réseau » (forge-agents, TF-1155) : 150 à 300
 *       mots, accroche non vide dans les 2 premières lignes, clôture par une question ou un appel,
 *       5 hashtags au plus ;
 *   RR3 faits chiffrés sourcés — `oracle-claims` de forge-agents, verdict repris tel quel ;
 *   RR4 transparence — `oracle-transparence` de forge-agents (TF-1030), verdict repris tel quel ;
 *   RR5 accord de publication consigné AVANT toute publication : `accord: true`, daté, nommé ;
 *   RR6 mesure : un export nommé, le temps humain de la semaine en minutes, 1 à 3 indicateurs
 *       chacun avec sa valeur ET son seuil.
 *
 * Ce qu'il ne juge PAS, et ne jugera jamais : la qualité du texte contre sa barre externe (lecture
 * humaine, `la-barre`), la sincérité d'un accord, la véracité d'un export, et le fait que la
 * publication ait eu lieu — publier est un geste humain, hors de portée par contrat de la
 * plateforme (`references\PLATEFORME-LINKEDIN.md` §1).
 *
 * Usage : node oracles\oracle-run-reseau.mjs <dossier-semaine> [--mentions <f.json>]
 *         node oracles\oracle-run-reseau.mjs --self-test     → semaine à blanc, double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = process.env.FORGE_ROOT || resolve(ICI, "..", "..");
const QO = join(RACINE, "digit-ai-forge-agents", ".claude", "skills", "quality-oracles", "scripts");

/** Joue un oracle de forge-agents et rend son verdict ; absent ou illisible → SKIP motivé. */
function jouer(script, args) {
  const chemin = join(QO, script);
  if (!existsSync(chemin)) return { verdict: "SKIP", motif: `${script} introuvable sous ${QO}` };
  const r = spawnSync(process.execPath, [chemin, ...args], { encoding: "utf8" });
  try { return JSON.parse(r.stdout); } catch { return { verdict: "SKIP", motif: `${script} : sortie illisible` }; }
}

function corpsSansFrontmatter(texte) {
  return texte.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

export function juger(dossier, { mentions } = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const lire = (nom) => (existsSync(join(dossier, nom)) ? readFileSync(join(dossier, nom), "utf8") : null);

  // RR1 — calendrier à 4 semaines
  const cal = lire("calendrier.md");
  const lignesDatees = (cal || "").split(/\r?\n/).filter((l) => /^\|/.test(l.trim()) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l));
  if (!cal) ko("RR1", "calendrier.md absent — le rendez-vous hebdomadaire n'a pas de support");
  else if (lignesDatees.length < 4) ko("RR1", `${lignesDatees.length} publication(s) datée(s) au calendrier — l'horizon est de 4 semaines`);
  else ok("RR1", `${lignesDatees.length} publication(s) datée(s) au calendrier`);

  // RR2 — contrat de sortie du modèle « publication réseau »
  const pub = lire("publication.md");
  if (!pub) ko("RR2", "publication.md absente");
  else {
    const corps = corpsSansFrontmatter(pub).trim();
    const mots = corps.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m) && !m.startsWith("#")).length;
    const lignes = corps.split(/\r?\n/).filter((l) => l.trim());
    const hashtags = (corps.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
    const sansHashtags = lignes.filter((l) => !/^(\s*#[\p{L}\p{N}_]+)+\s*$/u.test(l));
    const cloture = sansHashtags[sansHashtags.length - 1] || "";
    const defauts = [];
    if (mots < 150 || mots > 300) defauts.push(`${mots} mots (150 à 300 attendus)`);
    if (!lignes[0] || lignes[0].length < 20) defauts.push("accroche absente ou trop courte en tête");
    if (!/\?\s*$|(dites|écrivez|racontez|partagez|répondez)[^.]*\.?\s*$/i.test(cloture)) defauts.push("clôture sans question ni appel");
    if (hashtags > 5) defauts.push(`${hashtags} hashtags (5 au plus)`);
    defauts.length ? ko("RR2", `contrat de sortie non tenu : ${defauts.join(" · ")}`) : ok("RR2", `contrat de sortie tenu (${mots} mots, ${hashtags} hashtag(s))`);
  }

  // RR3, RR4 — verdicts repris des oracles de forge-agents, jamais rejugés ici
  if (pub) {
    const chemin = join(dossier, "publication.md");
    const claims = jouer("oracle-claims.mjs", [chemin]);
    claims.verdict === "FAIL" ? ko("RR3", "oracle-claims FAIL — un chiffre sans source") : ok("RR3", `oracle-claims ${claims.verdict}${claims.motif ? ` (${claims.motif})` : ""}`);
    const tr = jouer("oracle-transparence.mjs", mentions ? [chemin, "--mentions", mentions] : [chemin]);
    if (tr.verdict === "FAIL") ko("RR4", "oracle-transparence FAIL — contenu généré sans mention lisible");
    else ok("RR4", `oracle-transparence ${tr.verdict}${tr.motif ? ` (${tr.motif})` : ""}`);
  }

  // RR5 — accord humain de publication
  let accord = null;
  try { accord = JSON.parse(lire("accord.json") || "null"); } catch { /* jugé ci-dessous */ }
  if (!accord) ko("RR5", "accord.json absent ou illisible — aucune publication sans accord consigné (R-38)");
  else if (accord.accord !== true || !/^20\d{2}-\d{2}-\d{2}/.test(accord.date || "") || !accord.par)
    ko("RR5", "accord incomplet : `accord: true`, une `date` et un `par` sont dus");
  else ok("RR5", `accord consigné le ${accord.date}${accord.fictif ? " (FICTIF — semaine à blanc)" : ""}`);

  // RR6 — mesure de la semaine
  let mes = null;
  try { mes = JSON.parse(lire("mesures.json") || "null"); } catch { /* jugé ci-dessous */ }
  const ind = (mes && Array.isArray(mes.indicateurs)) ? mes.indicateurs : [];
  const incomplets = ind.filter((i) => !i.nom || typeof i.valeur !== "number" || typeof i.seuil !== "number");
  if (!mes) ko("RR6", "mesures.json absent ou illisible — une semaine sans mesure ne démontre aucun gain");
  else if (!mes.export || typeof mes.temps_humain_minutes !== "number") ko("RR6", "`export` nommé et `temps_humain_minutes` sont dus");
  else if (ind.length < 1 || ind.length > 3 || incomplets.length) ko("RR6", `${ind.length} indicateur(s), ${incomplets.length} incomplet(s) — 1 à 3, chacun avec valeur et seuil`);
  else ok("RR6", `${ind.length} indicateur(s) lus contre leur seuil, ${mes.temps_humain_minutes} min de temps humain`);

  return findings;
}

const NON_JUGE = [
  "la qualité du texte contre sa barre externe (lecture humaine, registre la-barre)",
  "la sincérité de l'accord et la véracité de l'export",
  "le fait que la publication ait eu lieu : geste humain, hors de portée par contrat de la plateforme",
];

function rendre(cible, findings) {
  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-run-reseau", cible, verdict, findings, non_juge: NON_JUGE }, null, 1));
  process.exit(verdict === "PASS" ? 0 : 1);
}

// ── Autotest : LA SEMAINE À BLANC, dans les deux sens ─────────────────────────────────────────
function semaine(dir, { rouge }) {
  mkdirSync(dir, { recursive: true });
  const dates = ["2026-09-22", "2026-09-29", "2026-10-06", "2026-10-13"];
  writeFileSync(join(dir, "calendrier.md"), "| Date | Compte | Pilier | Sujet | Statut |\n|---|---|---|---|---|\n" +
    (rouge ? dates.slice(0, 2) : dates).map((d) => `| ${d} | profil | méthode | sujet fictif | prévu |`).join("\n") + "\n");
  const phrase = "Nous avons mesuré avant de conclure, et la mesure a contredit notre première lecture du dossier. ";
  const corpsVert = "Une étude faite en une matinée peut éviter de construire ce qu'il ne fallait pas construire.\n\n" +
    phrase.repeat(9) + "\n\nEn 2025, 72 % des acheteurs vérifiaient un contenu généré (source : enquête citée par une étude fictive du 2026-09-11, section 3).\n\n" +
    "Texte rédigé avec l'aide d'une IA, relu et assumé par son auteur.\n\n" +
    "Et vous, quelle question posez-vous avant de lancer un chantier ?\n\n#méthode #décision #conseil\n";
  const corpsRouge = "Notre offre fait gagner 45 000 € par an à chaque client.\n\n#a #b #c #d #e #f #g\n";
  writeFileSync(join(dir, "publication.md"), `---\ncompte: profil\ngenere: true\n---\n${rouge ? corpsRouge : corpsVert}`);
  if (!rouge) writeFileSync(join(dir, "accord.json"), JSON.stringify({ accord: true, date: "2026-09-22", par: "émetteur fictif", fictif: true }));
  writeFileSync(join(dir, "mesures.json"), JSON.stringify(rouge ? { indicateurs: [] } : {
    export: "export-fictif-2026-09-29.xlsx", temps_humain_minutes: 40,
    indicateurs: [{ nom: "impressions par publication", valeur: 900, seuil: 500 }, { nom: "taux d'engagement", valeur: 2.1, seuil: 2 }, { nom: "demandes de contact", valeur: 1, seuil: 1 }],
  }));
}

const arg = process.argv[2];
if (arg === "--self-test") {
  const base = mkdtempSync(join(tmpdir(), "run-reseau-"));
  const casse = [];
  try {
    semaine(join(base, "verte"), { rouge: false });
    semaine(join(base, "rouge"), { rouge: true });
    const v = juger(join(base, "verte"));
    const r = juger(join(base, "rouge"));
    const enEchec = (f) => f.filter((x) => x.statut === "FAIL").map((x) => x.regle);
    if (enEchec(v).length) casse.push(`la semaine verte échoue sur ${enEchec(v).join(", ")} : ${v.filter((x) => x.statut === "FAIL").map((x) => x.message).join(" | ")}`);
    for (const regle of ["RR1", "RR2", "RR3", "RR4", "RR5", "RR6"])
      if (!enEchec(r).includes(regle)) casse.push(`la semaine rouge n'échoue pas sur ${regle}`);
    const joues = v.filter((x) => /^RR[34]$/.test(x.regle) && /introuvable|illisible/.test(x.message)).map((x) => x.regle);
    if (joues.length) casse.push(`oracle(s) de forge-agents non joué(s) (${joues.join(", ")}) — la semaine à blanc ne prouve rien sans eux`);
  } finally { rmSync(base, { recursive: true, force: true }); }
  console.log(JSON.stringify({ outil: "oracle-run-reseau --self-test", verdict: casse.length ? "FAIL" : "PASS", cas: 2, regles: 6, casse }, null, 1));
  console.log(`Self-test run-reseau : ${casse.length ? "FAIL" : "2/2 PASS"} (semaine à blanc verte PASS ; semaine rouge FAIL sur RR1 à RR6)`);
  process.exit(casse.length ? 1 : 0);
}
if (!arg || !existsSync(arg)) { console.log(JSON.stringify({ oracle: "oracle-run-reseau", verdict: "SKIP", motif: "dossier de semaine absent" })); process.exit(2); }
const iM = process.argv.indexOf("--mentions");
rendre(arg, juger(arg, { mentions: iM > 0 ? process.argv[iM + 1] : undefined }));
