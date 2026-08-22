#!/usr/bin/env node
/**
 * ingerer-derogation.test.mjs — la dérogation TRACÉE aux règles de forme du lot (option b3).
 *
 * Le fait fondateur : deux lots Hoopiz rédigés AVANT la publication de R-45 sont restés hors
 * du registre, et l'un d'eux signalait un plantage réel du lanceur d'oracles. L'arbitrage
 * humain du 22/08 a refusé d'amender R-45 — elle est juste sur le fond — et a retenu la
 * dérogation cas par cas.
 *
 * Ce que ces cas verrouillent, et c'est tout l'enjeu : que la dérogation reste ÉTROITE. Une
 * dérogation qui ouvrirait la validation des candidatures ou l'idempotence ne serait pas une
 * dérogation, ce serait un interrupteur — et R-45 mourrait sans que personne l'ait décidé.
 * Les cas « BORNE » existent pour prouver les portes qui restent FERMÉES.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
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

const T = mkdtempSync(join(tmpdir(), "dero-"));
const MOTIF = "decision humaine du 22/08 (option b3) : lot redige avant la publication de R-45, R-45 reste intacte";
const LOT_NU = "# lot\n\n## pilot\n\ntable\n";
const LOT_CONFORME = "# lot\n\n## Remarques restées au produit\n\n" +
  "Aucune remarque n'est restée au produit — vérifié le 2026-08-22.\n\n" +
  "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit.\n";
const candidature = (titre) => JSON.stringify({
  schema: 1, titre, contenu: "c", demandeur: "produit-recette", source: "lot de recette",
  date_demande: "2026-08-22", forges_cibles_initiales: ["digit-ai-factory"],
});

let serie = 0;
/** Pose un lot et tente son ingestion — `md` nu par défaut (aucune section de forme). */
const ingerer = ({ nomLot, args = [], ligne = null, md = LOT_NU }) => {
  const registre = join(T, `reg-${++serie}.jsonl`);
  writeFileSync(registre, "", "utf8");
  const sidecar = join(T, `${nomLot}.tf.jsonl`);
  writeFileSync(sidecar, (ligne ?? candidature(`pilot : retour ${serie}`)) + "\n", "utf8");
  if (md !== null) writeFileSync(join(T, `${nomLot}.md`), md, "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, ...args], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), registre };
};
const evenements = (r) => readFileSync(r.registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

check("rouge — sans dérogation, un lot du 22/08 sans section reste REFUSÉ (la règle est intacte)", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822a" });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — la règle ne refuse plus`);
  if (readFileSync(r.registre, "utf8").length !== 0) throw new Error("registre touché malgré le refus");
});

check("verte — avec dérogation motivée, le MÊME lot entre, et le passage se voit", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822b", args: ["--derogation", MOTIF] });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  if (!/DÉROGATION R-45/.test(r.sortie)) throw new Error("le passage ne se signale pas à l'écran");
});

check("la dérogation est CONSIGNÉE au registre — règle, motif mot pour mot, décision", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822c", args: ["--derogation", MOTIF] });
  const ing = evenements(r).find((e) => e.ev === "ingestion");
  if (!ing?.derogation) throw new Error("l'événement ingestion ne porte aucune dérogation");
  if (!ing.derogation.regles.includes("R-45")) throw new Error("la règle dérogée n'est pas nommée");
  if (ing.derogation.motif !== MOTIF) throw new Error("le motif n'est pas consigné mot pour mot");
  if (ing.derogation.decision !== "humaine") throw new Error("la dérogation ne dit pas qui l'a décidée");
  if (ing.derogation.regles.length !== new Set(ing.derogation.regles).size) throw new Error("règles en double");
});

check("rouge — dérogation SANS motif : refusée (un contournement muet n'est pas une trace)", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822d", args: ["--derogation"] });
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2`);
  if (readFileSync(r.registre, "utf8").length !== 0) throw new Error("registre touché");
});

check("rouge — motif trop court : refusé, et la longueur manquante est dite", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822e", args: ["--derogation", "parce que"] });
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2`);
  if (!/trop court/.test(r.sortie)) throw new Error("le motif du refus n'est pas dit");
});

check("BORNE — la dérogation n'ouvre PAS la validation des candidatures (rejet atomique intact)", () => {
  const r = ingerer({
    nomLot: "PROD - RETOURS - 20260822f", args: ["--derogation", MOTIF],
    ligne: JSON.stringify({ schema: 1, id: "TF-9999", titre: "porte un id", contenu: "c",
      demandeur: "d", source: "s", date_demande: "2026-08-22", forges_cibles_initiales: ["x"] }),
  });
  if (r.code !== 1) throw new Error(`exit ${r.code} : une candidature invalide est passée SOUS dérogation`);
  if (readFileSync(r.registre, "utf8").length !== 0) throw new Error("registre touché");
});

check("BORNE — la dérogation n'ouvre PAS l'idempotence : le même lot deux fois ne crée rien de plus", () => {
  const registre = join(T, "reg-idem.jsonl");
  writeFileSync(registre, "", "utf8");
  const nomLot = "PROD - RETOURS - 20260822g";
  const sidecar = join(T, `${nomLot}.tf.jsonl`);
  writeFileSync(sidecar, candidature("pilot : retour idempotent") + "\n", "utf8");
  writeFileSync(join(T, `${nomLot}.md`), LOT_NU, "utf8");
  const jouer = () => spawnSync(process.execPath,
    [OUTIL, sidecar, "--registre", registre, "--derogation", MOTIF], { encoding: "utf8" });
  jouer(); jouer();
  const creations = readFileSync(registre, "utf8").split("\n").filter(Boolean)
    .map((l) => JSON.parse(l)).filter((e) => e.titre).length;
  if (creations !== 1) throw new Error(`${creations} création(s) — l'idempotence est tombée sous dérogation`);
});

check("une dérogation INUTILE est signalée et non consignée — une trace décorative brouille les vraies", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822h", args: ["--derogation", MOTIF], md: LOT_CONFORME });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  if (!/AVERTISSEMENT/.test(r.sortie)) throw new Error("la dérogation inutile passe en silence");
  const ing = evenements(r).find((e) => e.ev === "ingestion");
  if (ing?.derogation) throw new Error("une dérogation non employée a été consignée");
});

check("borne — sans dérogation et lot conforme : le chemin normal reste inchangé", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822i", md: LOT_CONFORME });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  const ing = evenements(r).find((e) => e.ev === "ingestion");
  if (ing?.derogation) throw new Error("une ingestion normale porte une dérogation");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nDérogation tracée (b3) : ${pass} PASS, ${fail} FAIL`);
if (!existsSync(OUTIL)) console.error("outil introuvable");
process.exit(fail ? 1 : 0);
