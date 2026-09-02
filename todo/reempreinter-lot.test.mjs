#!/usr/bin/env node
/**
 * reempreinter-lot.test.mjs — la ré-empreinte d'un sidecar anonymisé se PROUVE, elle ne
 * s'affirme pas (02/09/2026).
 *
 * Le fait fondateur : le lendemain de la passe d'anonymisation du 01/09, la boîte d'entrée rendait
 * 23 constats B2 sur des sidecars dont AUCUN n'avait été édité — l'empreinte consignée était celle
 * du fichier d'avant la passe. Cette recette fige ce que l'outil garantit dans les DEUX sens :
 * il consigne quand le contenu courant est exactement la forme anonymisée du contenu ingéré, et
 * il REFUSE tout le reste — un nom inconnu, une édition réelle, une copie d'avant qui n'est pas
 * celle du registre. Un outil de réparation qui accepte tout fabrique le désordre qu'il répare.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { empreinteTexte } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "reempreinter-lot.mjs");
const BOITE = join(ICI, "..", "oracles", "oracle-boite-entree.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// ---- un dépôt git jouet, des tables jetables, un registre ----------------------------------
const T = mkdtempSync(join(tmpdir(), "reemp-"));
const DEPOT = join(T, "depot");
const BOITE_DIR = join(DEPOT, "input", "00-retours");
mkdirSync(BOITE_DIR, { recursive: true });
const git = (...a) => { const r = spawnSync("git", ["-C", DEPOT, ...a], { encoding: "utf8" }); if (r.status !== 0) throw new Error(`git ${a.join(" ")} : ${r.stderr}`); return r.stdout; };
git("init", "-q");
git("config", "user.email", "recette@example.invalid");
git("config", "user.name", "recette");

writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({
  noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" },
}), "utf8");
writeFileSync(join(T, "_produits-pseudonymes.json"), JSON.stringify({
  produits: { "ZorglubMail": "Produit-01" },
}), "utf8");
const ENV = { ...process.env, FORGE_NOMS_INTERDITS: join(T, "_noms-interdits.json"), FORGE_PRODUITS_PSEUDO: join(T, "_produits-pseudonymes.json") };
const REG = join(T, "TODO.jsonl");
const evIngestion = (sha, fichier) => JSON.stringify({ ev: "ingestion", ts: "2026-08-30T10:00:00.000Z", lot_sha: sha, fichier });

// Chaque lot porte un contenu DISTINCT (l'indice dans le corps) : deux lots au même contenu
// propre partageraient une empreinte, et « rien à faire » masquerait un refus attendu.
const sale = (indice) => `{"schema":1,"titre":"ZorglubMail : un retour de Zorglub","contenu":"lot 20260830${indice}"}\n`;
const propre = (indice) => `{"schema":1,"titre":"Produit-01 : un retour de Client-A","contenu":"lot 20260830${indice}"}\n`;
const SALE = sale("a"), PROPRE = propre("a");

const lancer = (sidecar, ...extra) => {
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", REG, "--depot", DEPOT, ...extra], { encoding: "utf8", env: ENV });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};
const evenements = () => readFileSync(REG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

// Cas 1 — le sidecar suivi, ingéré SALE, puis anonymisé et commité (la passe du 01/09).
const nomSuivi = "ZorglubMail - RETOURS - 20260830a.tf.jsonl";
const nomPropre = "Produit-01 - RETOURS - 20260830a.tf.jsonl";
writeFileSync(join(BOITE_DIR, nomSuivi), SALE, "utf8");
git("add", "-A"); git("commit", "-q", "-m", "lot recu");
writeFileSync(REG, evIngestion(empreinteTexte(SALE), `input/00-retours/${nomSuivi}`) + "\n", "utf8");
// la passe : contenu réécrit ET fichier renommé, comme anonymiser-suivis le fait
writeFileSync(join(BOITE_DIR, nomSuivi), PROPRE, "utf8");
git("mv", `input/00-retours/${nomSuivi}`, `input/00-retours/${nomPropre}`);
git("add", "-A"); git("commit", "-q", "-m", "passe d anonymisation");
const suivi = join(BOITE_DIR, nomPropre);
// le registre a lui aussi été anonymisé par la passe : le NOM consigné est le nom propre
writeFileSync(REG, evIngestion(empreinteTexte(SALE), `input/00-retours/${nomPropre}`) + "\n", "utf8");

check("rouge — un sidecar dont le NOM est inconnu du registre est refusé : c'est ingerer-lot qu'il faut", () => {
  const inconnu = join(BOITE_DIR, "Inconnu - RETOURS - 20260830a.tf.jsonl");
  writeFileSync(inconnu, PROPRE, "utf8");
  const r = lancer(inconnu);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ingerer-lot/.test(r.sortie)) throw new Error("le refus ne renvoie pas vers l'ingestion");
  if (evenements().length !== 1) throw new Error("le registre a été touché malgré le refus");
});

check("la boîte d'entrée rend B2 AVANT la ré-empreinte — le défaut réel est reproduit", () => {
  const r = spawnSync(process.execPath, [BOITE, BOITE_DIR, "--registre", REG], { encoding: "utf8", env: ENV });
  const j = JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));
  if (!j.findings.some((f) => f.regle === "B2" && f.statut === "FAIL" && f.ou === nomPropre)) throw new Error("B2 attendu sur le sidecar anonymisé, absent");
});

check("essai — la preuve par l'historique git est trouvée (renommage compris) et rien n'est écrit", () => {
  const r = lancer(suivi, "--essai");
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  if (!/ESSAI/.test(r.sortie)) throw new Error("pas de verdict ESSAI");
  if (!/commit/.test(r.sortie)) throw new Error("la preuve ne nomme pas le commit d'origine");
  if (evenements().length !== 1) throw new Error("un essai a écrit au registre");
});

check("verte — ré-empreinte CONSIGNÉE : événement ingestion sans creations, bloc reempreinte, empreinte d'avant", () => {
  const r = lancer(suivi);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 400)}`);
  const evs = evenements();
  const e = evs[evs.length - 1];
  if (e.ev !== "ingestion" || e.creations !== undefined) throw new Error("l'événement n'est pas une ingestion sans creations");
  if (e.lot_sha !== empreinteTexte(PROPRE)) throw new Error("l'empreinte consignée n'est pas celle du contenu courant");
  if (!e.reempreinte || e.reempreinte.lot_sha_avant !== empreinteTexte(SALE)) throw new Error("le bloc reempreinte ne porte pas l'empreinte d'avant");
  if (!e.ts) throw new Error("journaliser n'a pas stampé l'heure");
  if (/Zorglub/.test(JSON.stringify(e))) throw new Error("l'événement consigné porte un nom interdit");
});

check("la boîte d'entrée est VERTE après la ré-empreinte, et l'idempotence de l'ingestion reconnaît le lot", () => {
  const r = spawnSync(process.execPath, [BOITE, BOITE_DIR, "--registre", REG], { encoding: "utf8", env: ENV });
  const j = JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));
  if (j.findings.some((f) => (f.regle === "B1" || f.regle === "B2") && f.statut === "FAIL" && f.ou === nomPropre)) throw new Error("B1/B2 encore rouge après la ré-empreinte");
});

check("rien à faire — rejouer sur un sidecar déjà couvert n'écrit rien et le dit", () => {
  const avant = evenements().length;
  const r = lancer(suivi);
  if (r.code !== 0 || !/rien à faire/i.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
  if (evenements().length !== avant) throw new Error("un événement a été écrit pour rien");
});

check("rouge — une ÉDITION réelle après anonymisation est refusée : ce qui a été ajouté n'est entré nulle part", () => {
  const nomEd = "Produit-01 - RETOURS - 20260830b.tf.jsonl";
  const saleB = sale("b");
  writeFileSync(join(BOITE_DIR, nomEd), saleB, "utf8");
  git("add", "-A"); git("commit", "-q", "-m", "second lot");
  writeFileSync(REG, readFileSync(REG, "utf8") + evIngestion(empreinteTexte(saleB), `input/00-retours/${nomEd}`) + "\n", "utf8");
  writeFileSync(join(BOITE_DIR, nomEd), PROPRE + '{"schema":1,"titre":"ajout apres coup","contenu":"x"}\n', "utf8");
  git("add", "-A"); git("commit", "-q", "-m", "anonymise ET complete");
  const avant = evenements().length;
  const r = lancer(join(BOITE_DIR, nomEd));
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — une édition a été prise pour une anonymisation`);
  if (!/ÉDITION|EDITION/i.test(r.sortie)) throw new Error("le refus ne nomme pas l'édition");
  if (evenements().length !== avant) throw new Error("le registre a été touché malgré le refus");
});

check("verte — fichier NON suivi par git : la copie d'avant fournie par --avant vaut preuve", () => {
  const nomBrut = "Produit-01 - RETOURS - 20260830c.tf.jsonl";
  const saleC = sale("c");
  const copie = join(T, "avant-c.tf.jsonl");
  writeFileSync(copie, saleC, "utf8");
  writeFileSync(REG, readFileSync(REG, "utf8") + evIngestion(empreinteTexte(saleC), `input/00-retours/${nomBrut}`) + "\n", "utf8");
  writeFileSync(join(BOITE_DIR, nomBrut), propre("c"), "utf8"); // jamais commité
  const r = lancer(join(BOITE_DIR, nomBrut), "--avant", copie);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  const e = evenements().pop();
  if (e.lot_sha !== empreinteTexte(propre("c")) || !e.reempreinte || e.reempreinte.commit_origine !== null) throw new Error(`la ré-empreinte par copie n'est pas consignée comme telle : ${JSON.stringify(e).slice(0, 300)} — sortie : ${r.sortie.slice(0, 300)}`);
});

check("rouge — une copie d'avant qui n'est PAS le contenu ingéré est refusée", () => {
  const nomBrut = "Produit-01 - RETOURS - 20260830d.tf.jsonl";
  const saleD = sale("d");
  writeFileSync(REG, readFileSync(REG, "utf8") + evIngestion(empreinteTexte(saleD), `input/00-retours/${nomBrut}`) + "\n", "utf8");
  writeFileSync(join(BOITE_DIR, nomBrut), propre("d"), "utf8");
  const fausse = join(T, "avant-faux.tf.jsonl");
  writeFileSync(fausse, saleD + "ligne de trop\n", "utf8");
  const avant = evenements().length;
  const r = lancer(join(BOITE_DIR, nomBrut), "--avant", fausse);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — ${r.sortie.slice(0, 300)}`);
  if (evenements().length !== avant) throw new Error("le registre a été touché malgré le refus");
});

// ---- troisième preuve : le RAPPROCHEMENT titre à titre (sidecar entré au suivi déjà anonymisé) ----
const nomR = "Produit-01 - RETOURS - 20260830e.tf.jsonl";
const TS_R = "2026-08-30T12:00:00.000Z";
const ligneR = (n) => JSON.stringify({ schema: 1, titre: `Produit-01 : retour ${n} pour Client-A`, contenu: `lot e ${n}` });
const creationR = (id, n) => JSON.stringify({ ev: "creation", ts: TS_R, id, titre: `ZorglubMail : retour ${n} pour Zorglub`, contenu: "c",
  demandeur: "ZorglubMail", source: "lot", date_demande: "2026-08-30", statut: "candidat", forges_cibles_initiales: ["pilot"],
  forges_cibles_reelles: null, score: { gain: 3, preuve: 3, effort: 3, valeur: 3 }, preuve_du_cout: null, decideur: null,
  date_decision: null, date_correction: null, corrections_realisees: null, gains_constates: null, version_forge_corrigee: null, produits_beneficiaires: null });
writeFileSync(REG, readFileSync(REG, "utf8")
  + creationR("TF-9001", 1) + "\n" + creationR("TF-9002", 2) + "\n"
  + JSON.stringify({ ev: "ingestion", ts: TS_R, lot_sha: "sha-du-contenu-sale-perdu", fichier: `input/00-retours/${nomR}`, creations: 2 }) + "\n", "utf8");
writeFileSync(join(BOITE_DIR, nomR), ligneR(1) + "\n" + ligneR(2) + "\n", "utf8"); // jamais commité, déjà propre

check("rouge — sans le drapeau, un sidecar sans contenu d'avant reste REFUSÉ (le rapprochement ne se devine pas)", () => {
  const avant = evenements().length;
  const r = lancer(join(BOITE_DIR, nomR));
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/par-rapprochement/.test(r.sortie)) throw new Error("le refus ne nomme pas la voie du rapprochement");
  if (evenements().length !== avant) throw new Error("le registre a été touché malgré le refus");
});

check("rouge — rapprochement : une ligne de PLUS au sidecar est refusée, les comptes ne s'accordent pas", () => {
  writeFileSync(join(BOITE_DIR, nomR), ligneR(1) + "\n" + ligneR(2) + "\n" + ligneR(3) + "\n", "utf8");
  const avant = evenements().length;
  const r = lancer(join(BOITE_DIR, nomR), "--par-rapprochement");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — ${r.sortie.slice(0, 200)}`);
  if (evenements().length !== avant) throw new Error("le registre a été touché malgré le refus");
});

check("verte — rapprochement : titres anonymisés = créations consignées, en nombre égal → CONSIGNÉ avec sa preuve", () => {
  writeFileSync(join(BOITE_DIR, nomR), ligneR(1) + "\n" + ligneR(2) + "\n", "utf8");
  const r = lancer(join(BOITE_DIR, nomR), "--par-rapprochement");
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  const e = evenements().pop();
  if (!e.reempreinte || !/rapprochement/.test(e.reempreinte.preuve) || e.reempreinte.lot_sha_avant !== "sha-du-contenu-sale-perdu")
    throw new Error(`preuve de rapprochement absente ou empreinte d'avant fausse : ${JSON.stringify(e).slice(0, 300)}`);
  if (e.lot_sha !== empreinteTexte(ligneR(1) + "\n" + ligneR(2) + "\n")) throw new Error("l'empreinte consignée n'est pas celle du contenu courant");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nreempreinter-lot (ré-empreinte prouvée d'un sidecar anonymisé) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
