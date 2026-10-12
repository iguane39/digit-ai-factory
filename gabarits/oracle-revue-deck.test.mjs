#!/usr/bin/env node
/**
 * oracle-revue-deck.test.mjs — recette à double sens du juge de forme de la revue de lecture d'un deck
 * (TF-1388). Joué par `oracles\self-tests.mjs` (I2).
 *
 * Chaque règle a une fixture ROUGE qui la fait échouer SEULE, et le remède que son message propose est joué
 * et doit PASSER. Les deux fichiers de `oracles\fixtures\revue-deck-*.md` servent de témoins : la verte passe,
 * la rouge reprend les défauts du 24/09/2026 (revue non datée, grille incomplète, captures non lues).
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifier, enContrat, CRITERES, ORACLE, VERSION } from "./oracle-revue-deck.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const lire = (n) => readFileSync(join(ICI, "..", "oracles", "fixtures", n), "utf8").replace(/\r\n/g, "\n");
const VERTE = lire("revue-deck-verte.md");
const ROUGE = lire("revue-deck-rouge.md");

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const echecs = (r) => r.constats.filter((c) => c.statut === "FAIL").map((c) => c.regle);
const seul = (r, regle) => { const e = echecs(r); att(e.length > 0 && e.every((x) => x === regle), `attendu ${regle} seul, obtenu [${e.join(",")}]`); };

/** Un PNG minimal (signature, IHDR) de la taille demandée : assez pour que le juge lise ses dimensions. */
function png(largeur, hauteur) {
  const b = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0);
  b.writeUInt32BE(13, 8); b.write("IHDR", 12, "latin1");
  b.writeUInt32BE(largeur, 16); b.writeUInt32BE(hauteur, 20);
  return b;
}

const dossier = mkdtempSync(join(tmpdir(), "revue-deck-"));
try {
  for (const n of ["diapo-01.png", "diapo-02.png", "diapo-03.png"]) writeFileSync(join(dossier, n), png(1920, 1080));

  check("verte — la revue verte passe sur les cinq règles, avec son dossier de captures", () => {
    const r = verifier(VERTE, { captures: dossier });
    att(r.verdict === "PASS", `verdict ${r.verdict} : ${JSON.stringify(r.constats.filter((c) => c.statut === "FAIL"))}`);
    att(["R1", "R2", "R3", "R4", "R5"].every((x) => r.constats.some((c) => c.regle === x && c.statut === "PASS")), "une règle n'a pas rendu PASS");
  });
  check("rouge — la revue rouge est refusée sur R1 à R5", () => {
    const r = verifier(ROUGE, { captures: dossier });
    att(r.verdict === "FAIL", "la rouge passe");
    for (const x of ["R1", "R2", "R3", "R4", "R5"]) att(echecs(r).includes(x), `${x} ne s'est pas déclenché`);
  });

  // ---- R1 ----
  check("rouge R1 — un titre sans date échoue seul, et la date seule le répare", () => {
    seul(verifier(VERTE.replace(" — 2026-10-12 14:30", ""), { captures: dossier }), "R1");
    att(verifier(VERTE.replace("2026-10-12 14:30", "2026-10-12"), { captures: dossier }).verdict === "PASS", "la date sans heure est refusée");
  });
  check("rouge R1 — une date impossible (mois 13) échoue", () => {
    seul(verifier(VERTE.replace("2026-10-12", "2026-13-12"), { captures: dossier }), "R1");
  });

  // ---- R2 : un critère à la fois ----
  for (const c of CRITERES) {
    check(`rouge R2 — le critère « ${c.libelle} » absent échoue seul`, () => {
      const sans = VERTE.split("\n").filter((l) => !(l.startsWith("|") && c.re.test(l.split("|")[1] || ""))).join("\n");
      const r = verifier(sans, { captures: dossier });
      seul(r, "R2");
      att(r.constats.find((x) => x.regle === "R2" && x.statut === "FAIL").message.includes(c.libelle), "le critère absent n'est pas nommé");
    });
  }
  check("rouge R2 — une ligne sans verdict échoue seule", () => {
    seul(verifier(VERTE.replace("| Débordements | conforme | aucun | — |", "| Débordements | | aucun | — |"), { captures: dossier }), "R2");
  });

  // ---- R3 ----
  check("rouge R3 — un « non applicable » sans motif échoue seul, et le motif le répare", () => {
    const sans = VERTE.replace("| non applicable | deck sans texte coupé en fin de ligne |", "| non applicable | |");
    seul(verifier(sans, { captures: dossier }), "R3");
    att(verifier(VERTE, { captures: dossier }).verdict === "PASS", "le motif écrit est refusé");
  });
  check("rouge R3 — un constat sans diapositive échoue seul", () => {
    seul(verifier(VERTE.replace("diapo 2 : le titre est décalé", "le titre est décalé"), { captures: dossier }), "R3");
  });
  check("rouge R3 — un constat sans suite échoue seul", () => {
    seul(verifier(VERTE.replace("| recaler sur la grille, rastériser à nouveau |", "| |"), { captures: dossier }), "R3");
  });

  // ---- R4 / R5 ----
  check("rouge R4 — une revue sans aucune capture nommée échoue", () => {
    const sans = VERTE.split("\n").filter((l) => !/\.png/.test(l)).join("\n");
    att(echecs(verifier(sans, { captures: dossier })).includes("R4"), "R4 ne s'est pas déclenché");
  });
  check("rouge R4 — une dimension démentie par le fichier échoue, et la bonne valeur la répare", () => {
    const faux = VERTE.replace("diapo-02.png — 1920 × 1080", "diapo-02.png — 1280 × 720");
    const r = verifier(faux, { captures: dossier });
    att(echecs(r).includes("R4") && /1280 × 720/.test(r.constats.find((c) => c.regle === "R4").message), "dimension non démentie");
    att(verifier(VERTE, { captures: dossier }).verdict === "PASS", "la valeur lue dans le fichier est refusée");
  });
  check("rouge R4 — une capture citée mais absente du dossier échoue", () => {
    att(echecs(verifier(VERTE.replace("diapo-03.png", "diapo-09.png"), { captures: dossier })).includes("R4"), "R4 ne s'est pas déclenché");
  });
  check("rouge R5 — une capture du dossier absente de la revue échoue seule (le cas des 20 captures « relues »)", () => {
    const moins = VERTE.split("\n").filter((l) => !l.includes("diapo-03.png")).join("\n");
    const r = verifier(moins, { captures: dossier });
    seul(r, "R5");
    att(/diapo-03\.png/.test(r.constats.find((c) => c.regle === "R5").message), "la capture oubliée n'est pas nommée");
  });
  check("sans dossier — R4 ne confronte pas les dimensions et R5 se déclare SANS OBJET, jamais PASS", () => {
    const r = verifier(VERTE);
    att(r.verdict === "PASS", "la verte sans dossier doit passer");
    att(r.constats.find((c) => c.regle === "R5").statut === "SANS_OBJET", "R5 doit se déclarer sans objet");
    att(/non confrontées/.test(r.constats.find((c) => c.regle === "R4").message), "R4 doit dire qu'il ne confronte rien");
  });

  // ---- CLI et contrat ----
  const fVerte = join(dossier, "verte.md"), fRouge = join(dossier, "rouge.md");
  writeFileSync(fVerte, VERTE); writeFileSync(fRouge, ROUGE);
  const cli = (...a) => spawnSync(process.execPath, [join(ICI, "oracle-revue-deck.mjs"), ...a], { encoding: "utf8" });
  check("CLI — la verte sort 0, la rouge 1, un fichier absent 2", () => {
    att(cli(fVerte, "--captures", dossier).status === 0, "verte");
    att(cli(fRouge, "--captures", dossier).status === 1, "rouge");
    att(cli(join(dossier, "absent.md")).status === 2, "absent");
  });
  check("contrat — --json rend le contrat commun, localisant, avec non_juge", () => {
    const j = JSON.parse(cli(fRouge, "--captures", dossier, "--json").stdout);
    att(j.oracle === ORACLE && j.verdict === "FAIL" && j.artefact === fRouge && j.domaine, "en-tête");
    const b = j.findings.filter((f) => f.sev === "bloquant");
    att(b.length >= 5 && b.every((f) => f.regle && f.msg && f.where === fRouge), `${b.length} bloquants`);
    att(j.non_juge.length >= 3, "non_juge");
    att(enContrat("x", verifier(VERTE)).findings.some((f) => /non jugé/.test(f.msg)), "le SANS OBJET n'est pas dit dans le contrat");
  });
  check("VERSION exportée", () => att(/^\d+\.\d+\.\d+$/.test(VERSION), VERSION));
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { rmSync(dossier, { recursive: true, force: true }); }

console.log(`\noracle-revue-deck : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
