#!/usr/bin/env node
/**
 * self-test.mjs — recette à double sens du registre TODO-FORGE.
 * Une fixture VERTE (cycle de vie complet légal) PASSE ; des fixtures ROUGES à défauts plantés
 * ÉCHOUENT chacune pour la règle attendue. La vue est générée 2× → identique (déterminisme).
 * Fixtures en dossier temporaire — rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ICI = dirname(fileURLToPath(import.meta.url));
const oracle = join(ICI, "oracle-todo.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const lance = (actifs, archive) => {
  try { execFileSync("node", [oracle, actifs, archive ?? join(dirname(actifs), "vide.jsonl")], { encoding: "utf8" }); return 0; }
  catch (e) { return { code: e.status, sortie: String(e.stdout || "") }; }
};
const item = (sur) => JSON.stringify({
  ev: "creation", ts: "2026-08-08T10:00:00Z", id: "TF-9001", titre: "t", contenu: "c",
  demandeur: "d", source: "s", date_demande: "2026-08-08", statut: "candidat",
  forges_cibles_initiales: ["tests"], score: { gain: 3, preuve: 1, effort: 1, valeur: 3 }, ...sur,
});
const maj = (sur) => JSON.stringify({ ev: "maj", ts: "2026-08-08T11:00:00Z", id: "TF-9001", ...sur });
const T = mkdtempSync(join(tmpdir(), "todo-selftest-"));

// VERTE : cycle complet légal
const verte = join(T, "verte.jsonl");
writeFileSync(verte, [item({}),
  maj({ statut: "decide", decideur: "humain", date_decision: "2026-08-08" }),
  maj({ ts: "2026-08-08T12:00:00Z", statut: "en_cours" }),
  maj({ ts: "2026-08-08T13:00:00Z", statut: "corrige", gains_constates: "g", corrections_realisees: "sha", date_correction: "2026-08-08" }),
].join("\n") + "\n");
check("verte : cycle candidat→decide→en_cours→corrige légal → PASS", () => {
  const r = lance(verte);
  if (r !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

// ROUGES : un défaut planté par règle
const rouges = [
  ["R2 : double creation même id", [item({}), item({})]],
  ["R5 : transition illégale candidat→corrige", [item({}), maj({ statut: "corrige", gains_constates: "g", corrections_realisees: "x", date_correction: "2026-08-08" })]],
  ["R6 : decide sans decideur", [item({}), maj({ statut: "decide" })]],
  ["R7 : corrige sans gains_constates", [item({}), maj({ statut: "decide", decideur: "h", date_decision: "2026-08-08" }), maj({ ts: "2026-08-08T12:00:00Z", statut: "corrige", corrections_realisees: "x", date_correction: "2026-08-08" })]],
  ["R4 : creation hors statut candidat", [item({ statut: "decide" })]],
];
for (const [nom, lignes] of rouges) {
  const f = join(T, nom.slice(0, 2) + ".jsonl");
  writeFileSync(f, lignes.join("\n") + "\n");
  check(`rouge ${nom} → FAIL exit 1, règle nommée`, () => {
    const r = lance(f);
    if (r === 0) throw new Error("aurait dû échouer");
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
    const regle = nom.slice(0, 2);
    if (!r.sortie.includes(`"${regle}"`)) throw new Error(`règle ${regle} absente des findings`);
  });
}

// ---- circuit d'ingestion (candidature → registre), sur registre TEMPORAIRE -----------------
const ingerer = join(ICI, "ingerer-lot.mjs");
const regT = join(T, "registre.jsonl");
writeFileSync(regT, item({}) + "\n"); // TF-9001 existant → les ids frappés commencent à 9002
const cand = (sur) => JSON.stringify({
  schema: 1, titre: "friction X", contenu: "détail", demandeur: "produit-test",
  source: "lot-fixture seq 4", date_demande: "2026-08-09",
  forges_cibles_initiales: ["tests"], preuve_du_cout: "constatée en run", ...sur,
});
const side = join(T, "lot.tf.jsonl");
writeFileSync(side, [cand({}), cand({ titre: "friction Y", score: { gain: 4, preuve: 2, effort: 2 } })].join("\n") + "\n");
const shaReg = () => createHash("sha256").update(readFileSync(regT)).digest("hex");

check("ingestion verte : 2 candidatures → 2 creations en candidat, ids frappés à la suite", () => {
  execFileSync("node", [ingerer, side, "--registre", regT], { encoding: "utf8" });
  const evs = readFileSync(regT, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const crees = evs.filter((e) => e.ev === "creation" && e.id !== "TF-9001");
  if (crees.length !== 2) throw new Error(`${crees.length} créations, attendu 2`);
  if (crees[0].id !== "TF-9002" || crees[1].id !== "TF-9003") throw new Error(`ids ${crees.map((c) => c.id)} — frappage hors séquence`);
  if (crees.some((c) => c.statut !== "candidat")) throw new Error("une création n'est pas en candidat — la gouvernance a sauté");
  if (crees[1].score.valeur !== 4) throw new Error("score proposé mal calculé");
  if (!evs.some((e) => e.ev === "ingestion" && e.lot_sha)) throw new Error("événement ingestion absent");
});

check("ingestion idempotente : ré-ingérer le même lot → 0 création, registre inchangé", () => {
  const avant = shaReg();
  const sortie = execFileSync("node", [ingerer, side, "--registre", regT], { encoding: "utf8" });
  if (!sortie.includes("DÉJÀ INGÉRÉ")) throw new Error("l'idempotence n'a pas joué");
  if (shaReg() !== avant) throw new Error("le registre a changé");
});

check("ingestion rouge : 1 ligne invalide → rejet ATOMIQUE motivé, registre intact", () => {
  const mauvais = join(T, "mauvais.tf.jsonl");
  writeFileSync(mauvais, [cand({}), cand({ titre: undefined })].join("\n") + "\n");
  const avant = shaReg();
  try { execFileSync("node", [ingerer, mauvais, "--registre", regT], { encoding: "utf8", stdio: "pipe" }); }
  catch (e) {
    if (e.status !== 1) throw new Error(`exit ${e.status} attendu 1`);
    if (!String(e.stderr).includes("REJET ATOMIQUE")) throw new Error("rejet non motivé");
    if (shaReg() !== avant) throw new Error("ingestion partielle — le registre a bougé malgré le rejet");
    return;
  }
  throw new Error("aurait dû rejeter");
});

check("ingestion : une candidature portant un id est refusée (frappage = écrivain unique)", () => {
  const avecId = join(T, "avec-id.tf.jsonl");
  writeFileSync(avecId, cand({ id: "TF-0099" }) + "\n");
  try { execFileSync("node", [ingerer, avecId, "--registre", regT], { encoding: "utf8", stdio: "pipe" }); }
  catch (e) { if (e.status === 1) return; throw new Error(`exit ${e.status}`); }
  throw new Error("aurait dû refuser");
});

// ---- circuit export HTML → application (sur le registre TEMPORAIRE regT) -------------------
const appliquer = join(ICI, "appliquer-export.mjs");
const exportOk = join(T, "TF-decisions-ok.json");
writeFileSync(exportOk, JSON.stringify({ schema: 1, type: "decisions-todo-forge", sceau_source: "x", exporte_le: "2026-08-09T08:00:00Z",
  decisions: [{ id: "TF-9002", decider: true, commentaire: "priorité haute" }, { id: "TF-9003", decider: false, commentaire: "à regrouper avec TF-9002" }] }));
check("export appliqué : decide tracé (décideur humain) + commentaires conservés", () => {
  execFileSync("node", [appliquer, exportOk, "--registre", regT], { encoding: "utf8" });
  const evs = readFileSync(regT, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const etat = new Map();
  for (const e of evs) { if (e.ev === "creation") etat.set(e.id, { ...e }); else if (e.ev === "maj") Object.assign(etat.get(e.id) ?? {}, e); }
  const a = etat.get("TF-9002"), b = etat.get("TF-9003");
  if (a.statut !== "decide" || !a.decideur || a.date_decision !== "2026-08-09") throw new Error("décision non tracée");
  if (!a.commentaire_humain.includes("priorité haute") || !b.commentaire_humain) throw new Error("commentaire perdu");
  if (b.statut !== "candidat") throw new Error("commentaire seul ne doit pas changer le statut");
});
check("export idempotent : ré-appliqué → 0 modification", () => {
  const avant = shaReg();
  const s = execFileSync("node", [appliquer, exportOk, "--registre", regT], { encoding: "utf8" });
  if (!s.includes("DÉJÀ APPLIQUÉ") || shaReg() !== avant) throw new Error("idempotence en défaut");
});
check("export rouge : id inconnu → rejet ATOMIQUE, registre intact", () => {
  const mauvais = join(T, "TF-decisions-ko.json");
  writeFileSync(mauvais, JSON.stringify({ schema: 1, type: "decisions-todo-forge", decisions: [{ id: "TF-0000", decider: true }] }));
  const avant = shaReg();
  try { execFileSync("node", [appliquer, mauvais, "--registre", regT], { encoding: "utf8", stdio: "pipe" }); }
  catch (e) { if (e.status !== 1 || shaReg() !== avant) throw new Error("rejet non atomique"); return; }
  throw new Error("aurait dû rejeter");
});
check("export rouge : decider sur un item déjà décidé → rejet (transition illégale)", () => {
  const redecide = join(T, "TF-decisions-re.json");
  writeFileSync(redecide, JSON.stringify({ schema: 1, type: "decisions-todo-forge", decisions: [{ id: "TF-9002", decider: true }] }));
  try { execFileSync("node", [appliquer, redecide, "--registre", regT], { encoding: "utf8", stdio: "pipe" }); }
  catch (e) { if (e.status === 1) return; throw new Error(`exit ${e.status}`); }
  throw new Error("aurait dû rejeter");
});

// Déterminisme de la vue sur le registre RÉEL
check("vue : 2 générations identiques (sha256) sur le registre réel", () => {
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
  const a = createHash("sha256").update(readFileSync(join(ICI, "TODO.md"))).digest("hex");
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
  const b = createHash("sha256").update(readFileSync(join(ICI, "TODO.md"))).digest("hex");
  if (a !== b) throw new Error("vue non déterministe");
});

rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test TODO-FORGE : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
