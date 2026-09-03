#!/usr/bin/env node
/**
 * ingerer-classe.test.mjs — la CLASSE d'un retour se déclare, la RÉCIDIVE se compte (03/09/2026).
 *
 * Le fait fondateur (mandat d'amélioration continue, pas 0) : 50 items du registre déclaraient
 * une récidive en toutes lettres et aucun champ ne permettait de les compter ; un classement
 * automatique par famille rendait 94 % de faux positifs. La règle qui en sort : le producteur
 * déclare UNE classe par retour, prise dans un référentiel fermé et daté ; une classe déjà close
 * en corrige marque le retour `recidive_de` — sans jamais le refuser.
 *
 * Ce que ces cas verrouillent : le refus à l'ingestion d'un lot daté du 03/09 ou après sans
 * classe (rouge) ou à classe inconnue avec les clés proches (rouge) ; l'admission d'une récidive
 * MARQUÉE, jamais refusée (verte) ; l'antériorité (un lot du 01/09 sans classe passe) ; la
 * candidature hors lot sans classe (passe) ; la classe suspecte (signalée, admise) ; et le
 * référentiel illisible (refus, jamais un passage). Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "classe-"));
const CLASSES = join(T, "CLASSES.json");
writeFileSync(CLASSES, JSON.stringify({
  schema: "pilot/classes@1", version: "0.0.1-recette", date: "2026-09-03",
  familles: [{ cle: "page-html-socle", libelle: "f" }, { cle: "lot-forme", libelle: "f2" }],
  classes: [
    { cle: "page-html-polices-distantes", famille: "page-html-socle", libelle: "polices distantes", creee_le: "2026-09-03", fondee_par: ["TF-0001"], regle: "A1", oracle: "check_html A1", voisines: [] },
    { cle: "page-html-sommaire-absent", famille: "page-html-socle", libelle: "sommaire", creee_le: "2026-09-03", fondee_par: [], regle: "I2", oracle: "check_html", voisines: [] },
    { cle: "lot-sans-classe", famille: "lot-forme", libelle: "clé neuve sans clôture", creee_le: "2026-09-03", fondee_par: [], regle: "-", oracle: "-", voisines: ["page-html-polices-distantes"] },
  ],
}), "utf8");
// Registre de départ : TF-0001 clos en corrige le 27/08 (la classe est fondée par lui).
const REGISTRE_BASE = [
  JSON.stringify({ ev: "creation", ts: "2026-08-20T10:00:00.000Z", id: "TF-0001", titre: "t", contenu: "c", demandeur: "pilot", source: "s", date_demande: "2026-08-20", statut: "candidat", forges_cibles_initiales: ["digit-ai-factory"], score: { gain: 3, preuve: 1, effort: 1, valeur: 3 } }),
  JSON.stringify({ ev: "maj", ts: "2026-08-21T10:00:00.000Z", id: "TF-0001", statut: "decide", decideur: "humain", date_decision: "2026-08-21" }),
  JSON.stringify({ ev: "maj", ts: "2026-08-27T10:00:00.000Z", id: "TF-0001", statut: "corrige", date_correction: "2026-08-27", gains_constates: "g", corrections_realisees: "x" }),
].join("\n") + "\n";
const MD = "# lot\n\n## pilot\n\ntable\n\n## Remarques restées au produit\n\n| Remarque | Corrigée comment | Généralisable ? | Verdict |\n|---|---|---|---|\n| tri cassé | index ajouté | non | propre au schéma de ce produit |\n\n## Retours sur les documents produits\n\nAucun document produit depuis un gabarit de la bibliothèque sur ce lot.\n";
const cand = (sur) => JSON.stringify({
  schema: 1, titre: "pilot : un retour de recette", contenu: "c", demandeur: "produit-recette",
  source: "lot de recette", date_demande: "2026-09-03", forges_cibles_initiales: ["digit-ai-factory"], ...sur,
});
let serie = 0;
const ingerer = ({ nomLot, lignes, md = MD, classes = CLASSES }) => {
  const registre = join(T, `reg-${++serie}.jsonl`);
  writeFileSync(registre, REGISTRE_BASE, "utf8");
  const sidecar = join(T, `${nomLot}.tf.jsonl`);
  writeFileSync(sidecar, lignes.join("\n") + "\n", "utf8");
  if (md !== null) writeFileSync(join(T, `${nomLot}.md`), md, "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch", "--classes", classes], { encoding: "utf8" });
  const evs = readFileSync(registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), evs, creations: evs.filter((e) => e.ev === "creation" && e.id !== "TF-0001") };
};

check("rouge — lot du 03/09 SANS classe : refusé, registre intact, le refus nomme les familles", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260903a", lignes: [cand({})] });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 : ${r.sortie.slice(0, 300)}`);
  if (!/classe manquante/.test(r.sortie)) throw new Error("le refus ne dit pas que la classe manque");
  if (!/page-html-socle/.test(r.sortie)) throw new Error("le refus ne liste pas les familles");
  if (r.creations.length) throw new Error("le registre a été touché malgré le refus");
});

check("rouge — classe INCONNUE : refusé, les clés proches sont nommées", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260903b", lignes: [cand({ classe: "page-html-polices" })] });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/inconnue du référentiel/.test(r.sortie)) throw new Error("le refus ne dit pas que la clé est inconnue");
  if (!/page-html-polices-distantes/.test(r.sortie)) throw new Error("la clé proche n'est pas proposée");
  if (r.creations.length) throw new Error("registre touché");
});

check("verte — RÉCIDIVE d'une classe close en corrige : le lot ENTRE, marqué recidive_de, l'oracle censé la jouer est nommé", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260903c", lignes: [cand({ classe: "page-html-polices-distantes" })] });
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 : ${r.sortie.slice(0, 300)}`);
  if (r.creations.length !== 1) throw new Error(`${r.creations.length} création(s), 1 attendue`);
  const c = r.creations[0];
  if (c.classe !== "page-html-polices-distantes") throw new Error("classe non portée par la création");
  if (!Array.isArray(c.recidive_de) || c.recidive_de[0] !== "TF-0001") throw new Error(`recidive_de attendu [TF-0001], reçu ${JSON.stringify(c.recidive_de)}`);
  if (!/\[RÉCIDIVE\]/.test(r.sortie) || !/check_html A1/.test(r.sortie)) throw new Error("la récidive n'est pas annoncée avec son oracle");
  const ing = r.evs.find((e) => e.ev === "ingestion");
  if (!ing || ing.recidives !== 1) throw new Error("l'événement d'ingestion ne compte pas la récidive");
});

check("verte — classe connue SANS clôture antérieure : pas de récidive, recidive_de null", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260903d", lignes: [cand({ classe: "page-html-sommaire-absent" })] });
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 : ${r.sortie.slice(0, 300)}`);
  if (r.creations[0].recidive_de !== null) throw new Error("recidive_de devrait être null");
  if (/\[RÉCIDIVE\]/.test(r.sortie)) throw new Error("récidive annoncée à tort");
});

check("borne — un lot du 01/09 sans classe passe : antériorité, jamais un défaut de produit", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260901a", lignes: [cand({ date_demande: "2026-09-01" })] });
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 : ${r.sortie.slice(0, 300)}`);
  if (r.creations[0].classe !== null) throw new Error("classe devrait être null");
});

check("borne — une candidature HORS lot sans classe passe (elle n'a pas de lot)", () => {
  const r = ingerer({ nomLot: "revue-classes-20260903a", lignes: [cand({})], md: null });
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 : ${r.sortie.slice(0, 300)}`);
});

check("signal — classe SUSPECTE (créée sans clôture, < 30 j après un retour d'une voisine) : admise et signalée", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260903e", lignes: [cand({ classe: "lot-sans-classe" })] });
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 : ${r.sortie.slice(0, 300)}`);
  if (!/\[CLASSE SUSPECTE\]/.test(r.sortie)) throw new Error("la classe suspecte n'est pas signalée");
  if (!r.creations[0].classe_suspecte) throw new Error("la création ne porte pas classe_suspecte");
});

check("rouge — référentiel de classes ILLISIBLE : un lot du 03/09 est refusé, jamais admis en silence", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260903f", lignes: [cand({ classe: "page-html-polices-distantes" })], classes: join(T, "absent.json") });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/illisible/.test(r.sortie)) throw new Error("le refus ne nomme pas le référentiel illisible");
});

rmSync(T, { recursive: true, force: true });
console.log(`\ningerer-classe : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
