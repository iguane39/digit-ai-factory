#!/usr/bin/env node
/**
 * self-test.mjs — recette à double sens du registre TODO-FORGE.
 * Une fixture VERTE (cycle de vie complet légal) PASSE ; des fixtures ROUGES à défauts plantés
 * ÉCHOUENT chacune pour la règle attendue. La vue est générée 2× → identique (déterminisme).
 * Fixtures en dossier temporaire — rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs";
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
  // TF-0157 (13/08) : la mémoire des refus est structurée — un écart sans motif FAIL.
  ["R7 : ecarte sans motif_ecart", [item({}), maj({ ts: "2026-08-13T12:00:00Z", statut: "ecarte", decideur: "h", date_decision: "2026-08-13" })]],
  ["R4 : creation hors statut candidat", [item({ statut: "decide" })]],
  ["R1 : ingestion sans lot_sha", [item({}), JSON.stringify({ ev: "ingestion", ts: "2026-08-10T10:00:01Z", creations: 0 })]],
  ["R10 : creation externe (run-*) sans ingestion — écriture directe", [item({ ts: "2026-08-10T10:00:00Z", demandeur: "run-produit-x-20260810" })]],
];
for (const [nom, lignes] of rouges) {
  const regle = nom.split(" ")[0]; // "R1", "R10", …
  const f = join(T, regle + "-" + createHash("sha256").update(nom).digest("hex").slice(0, 6) + ".jsonl");
  writeFileSync(f, lignes.join("\n") + "\n");
  check(`rouge ${nom} → FAIL exit 1, règle nommée`, () => {
    const r = lance(f);
    if (r === 0) throw new Error("aurait dû échouer");
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
    if (!r.sortie.includes(`"${regle}"`)) throw new Error(`règle ${regle} absente des findings`);
  });
}

// ── R9 bis (TF-0413) : RECTIFICATION DÉCLARÉE d'un horodatage, patron R-42/TF-0410 ──────
// Le fait : 123 événements du registre portaient un ts composé à la main, en avance de 92 à
// 449 min sur le commit qui les a publiés — au point qu'un écrit HONNÊTE du même jour devenait
// « décroissant » au sens de R9 et se voyait refuser. On ne réécrit pas : on déclare, et
// l'écart reste imprimé.
const rectifier = (entrees) => JSON.stringify({
  ev: "rectification_horodatage", ts: "2026-08-08T14:00:00Z", motif: "recette", entrees,
});
const DECROISSANT = [
  item({ ts: "2026-08-08T18:00:00Z" }), // creation au ts gonflé
  maj({ ts: "2026-08-08T12:00:00Z", statut: "decide", decideur: "h", date_decision: "2026-08-08" }),
];

const r9rouge = join(T, "R9-rouge.jsonl");
writeFileSync(r9rouge, DECROISSANT.join("\n") + "\n");
check("rouge R9 : ts décroissant NON déclaré → FAIL", () => {
  const r = lance(r9rouge);
  if (r === 0) throw new Error("aurait dû échouer");
  if (!r.sortie.includes('"R9"')) throw new Error("règle R9 absente des findings");
});

const r9verte = join(T, "R9bis-verte.jsonl");
writeFileSync(r9verte, [...DECROISSANT, rectifier([{
  id: "TF-9001", ts_consigne: "2026-08-08T18:00:00Z",
  ts_reel_estime: "2026-08-08T11:00:00Z", cause: "ts composé à la main",
}])].join("\n") + "\n");
check("verte R9 bis : écart COUVERT par déclaration → PASS, et le verdict l'IMPRIME [RECTIFIÉ]", () => {
  const r = lance(r9verte);
  if (r !== 0) throw new Error("exit " + r.code + " : " + r.sortie.slice(0, 240));
  const sortie = execFileSync("node", [oracle, r9verte, join(T, "vide.jsonl")], { encoding: "utf8" });
  if (!sortie.includes("[RECTIFIÉ]"))
    throw new Error("l'écart rectifié a DISPARU du rapport — il doit cesser de bloquer, jamais de se voir");
});

const r9avance = join(T, "R9bis-avance.jsonl");
writeFileSync(r9avance, [DECROISSANT[0], rectifier([{
  id: "TF-9001", ts_consigne: "2026-08-08T12:00:00Z",
  ts_reel_estime: "2026-08-08T11:00:00Z", cause: "dédouanement d'avance",
}]), DECROISSANT[1]].join("\n") + "\n");
check("rouge R9 bis : la déclaration ne couvre PAS ce qui la suit — pas de dédouanement d'avance", () => {
  const r = lance(r9avance);
  if (r === 0) throw new Error("une rectification a couvert un événement POSTÉRIEUR");
  if (!/sans cible ANTÉRIEURE/.test(r.sortie)) throw new Error("le motif du refus n'est pas dit");
});

const r9incomplete = join(T, "R9bis-incomplete.jsonl");
writeFileSync(r9incomplete, [...DECROISSANT, rectifier([{
  id: "TF-9001", ts_consigne: "2026-08-08T18:00:00Z", ts_reel_estime: "2026-08-08T11:00:00Z",
}])].join("\n") + "\n");
check("rouge R9 bis : déclaration sans cause → écart, jamais une couverture", () => {
  const r = lance(r9incomplete);
  if (r === 0) throw new Error("une déclaration incomplète a couvert l'écart");
  if (!/rectification incomplète/.test(r.sortie)) throw new Error("le champ manquant n'est pas nommé");
});

const r9menteur = join(T, "R9bis-menteur.jsonl");
writeFileSync(r9menteur, [...DECROISSANT, rectifier([{
  id: "TF-9001", ts_consigne: "2026-08-08T19:59:59Z",
  ts_reel_estime: "2026-08-08T11:00:00Z", cause: "ts_consigne qui ne colle à rien",
}])].join("\n") + "\n");
check("rouge R9 bis : un ts_consigne qui ne colle à AUCUN ts de l'id ne couvre rien", () => {
  const r = lance(r9menteur);
  if (r === 0) throw new Error("une déclaration menteuse a couvert l'écart");
  if (!/sans cible ANTÉRIEURE/.test(r.sortie)) throw new Error("le motif du refus n'est pas dit");
});

// Un drapeau lu comme un chemin faisait rendre un PASS sur un registre VIDE — faux vert
// trouvé en câblant --rectifications, et verrouillé ici.
check("un DRAPEAU n'est pas un chemin — --rectifications ne fait pas juger un registre vide", () => {
  let brut = "";
  try { brut = execFileSync("node", [oracle, "--rectifications"], { encoding: "utf8" }); }
  catch (e) { brut = String(e.stdout || ""); }
  if (/0 item\(s\) actif\(s\)/.test(brut))
    throw new Error("le drapeau a été lu comme un chemin — verdict rendu sur un registre vide");
});

// ── R11 (TF-0413, 20/08) : un ts qui n'est pas encore arrivé n'a pas été mesuré ──────────
// Les deux sens se jouent SOUS UN SEUIL DE RECETTE (TODO_SEUIL_R11), sans quoi le sens vert
// serait indémontrable tant que l'horloge réelle n'a pas dépassé le seuil de naissance de la
// règle : il faut un ts À LA FOIS au-dessus du seuil ET dans le passé. Le seuil de recette
// est posé loin derrière (2020) ; c'est la seule chose que la surcharge change.
const SEUIL_RECETTE = "2020-01-01T00:00:00Z";
const lanceAvecSeuil = (actifs) => {
  try {
    execFileSync("node", [oracle, actifs, join(dirname(actifs), "vide.jsonl")],
      { encoding: "utf8", env: { ...process.env, TODO_SEUIL_R11: SEUIL_RECETTE } });
    return 0;
  } catch (e) { return { code: e.status, sortie: String(e.stdout || "") }; }
};
const isoDecale = (ms) => new Date(Date.now() + ms).toISOString();

const r11rouge = join(T, "R11-rouge.jsonl");
writeFileSync(r11rouge, item({ ts: isoDecale(6 * 3600 * 1000) }) + "\n");
check("rouge R11 : ts à +6 h de l'heure d'exécution → FAIL, avance nommée en minutes", () => {
  const r = lanceAvecSeuil(r11rouge);
  if (r === 0) throw new Error("aurait dû échouer — un ts au futur a passé");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!r.sortie.includes('"R11"')) throw new Error("règle R11 absente des findings");
  if (!/postérieur à l'heure d'exécution de \d+ min/.test(r.sortie))
    throw new Error("le constat ne CHIFFRE pas l'avance — un rapport qui ne mesure pas se discute");
});

const r11verte = join(T, "R11-verte.jsonl");
writeFileSync(r11verte, item({ ts: isoDecale(-3600 * 1000) }) + "\n");
check("verte R11 : ts au passé, pourtant AU-DESSUS du seuil jugé → PASS (la règle ne juge que l'avance)", () => {
  const r = lanceAvecSeuil(r11verte);
  if (r !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 240)}`);
});

const r11tolerance = join(T, "R11-tolerance.jsonl");
writeFileSync(r11tolerance, item({ ts: isoDecale(60 * 1000) }) + "\n");
check("verte R11 : ts à +60 s → PASS, la tolérance d'horloge (120 s) n'est pas une licence", () => {
  const r = lanceAvecSeuil(r11tolerance);
  if (r !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 240)}`);
});

check("R11 : une surcharge de seuil est ANNONCÉE au verdict — jamais une extinction discrète", () => {
  const r = lanceAvecSeuil(r11rouge);
  if (r === 0) throw new Error("fixture rouge devenue verte");
  if (!r.sortie.includes("seuil SURCHARGÉ par TODO_SEUIL_R11"))
    throw new Error("le verdict ne dit pas qu'il a été rendu sous un seuil de recette");
});

// R10 verte : la même creation externe, couverte par son ingestion → PASS
const r10verte = join(T, "R10-verte.jsonl");
writeFileSync(r10verte, [
  item({ ts: "2026-08-10T10:00:00Z", demandeur: "run-produit-x-20260810" }),
  JSON.stringify({ ev: "ingestion", ts: "2026-08-10T10:00:01Z", lot_sha: "abc", creations: 1 }),
].join("\n") + "\n");
check("R10 verte : creation externe couverte par ingestion → PASS", () => {
  const r = lance(r10verte);
  if (r !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

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

// TF-0359 — l'idempotence doit survivre a un CHECKOUT, pas seulement a une re-execution.
// Avec core.autocrlf=true (defaut systeme de Git for Windows), git repose le sidecar en CRLF
// sans qu'un octet de contenu ait bouge : l'empreinte brute ne reconnaissait plus le lot et
// le meme travail rentrait deux fois. Double sens : le lot en CRLF est reconnu (verte), et
// un lot au contenu REELLEMENT different ne l'est pas (rouge) — sans quoi on aurait pu tout
// faire passer en rendant la comparaison aveugle.
check("ingestion idempotente aux fins de ligne : le MEME lot en CRLF → 0 création", () => {
  const crlf = join(T, "lot-crlf.tf.jsonl");
  writeFileSync(crlf, readFileSync(side, "utf8").split("\n").join("\r\n"));
  const avant = shaReg();
  const sortie = execFileSync("node", [ingerer, crlf, "--registre", regT], { encoding: "utf8" });
  if (!sortie.includes("DÉJÀ INGÉRÉ")) throw new Error("le même lot réécrit en CRLF a été ré-ingéré — doublons (TF-0359)");
  if (shaReg() !== avant) throw new Error("le registre a changé");
});

check("ingestion rouge (fins de ligne) : un lot au contenu DIFFÉRENT en CRLF est bien ingéré", () => {
  const autre = join(T, "lot-autre-crlf.tf.jsonl");
  writeFileSync(autre, (cand({ titre: "friction Z, jamais vue" }) + "\n").split("\n").join("\r\n"));
  const avant = shaReg();
  const sortie = execFileSync("node", [ingerer, autre, "--registre", regT], { encoding: "utf8" });
  if (sortie.includes("DÉJÀ INGÉRÉ")) throw new Error("un lot NEUF confondu avec un ancien — la normalisation est devenue aveugle");
  if (shaReg() === avant) throw new Error("le registre n'a pas bougé alors qu'une candidature neuve entrait");
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

// ---- page de recherche des items CLOS (TF-0350) --------------------------------------------
// Cinq contrôles, chacun à DOUBLE SENS : la fixture verte passe, et une fixture rouge à défaut
// planté échoue pour la bonne raison. Un contrôle dont la version rouge passe aussi ne prouve
// rien — c'est ce que la fixture témoin de RV-9 avait appris à ses dépens.
const genArchive = join(ICI, "generer-archive.mjs");
const genererArchive = (src, out) => execFileSync("node", [genArchive, src, out], { encoding: "utf8" });
const shaFic = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
// Simulation fidèle de la recherche côté client : une carte = un `textContent` normalisé, et
// `indexOf` dessus. Tester la recherche sans navigateur exige de reproduire son entrée, pas de
// se contenter d'un `includes` sur le fichier entier — qui passerait sur n'importe quel octet.
const cartesDe = (html) => [...html.matchAll(/<article class="card [^>]*id="item-(TF-\d+)"[\s\S]*?<\/article>/g)]
  .map((m) => ({ id: m[1], texte: norm(m[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")) }));
const chercher = (html, q) => cartesDe(html).filter((c) => c.texte.includes(norm(q))).map((c) => c.id);
// A1 — ce qui ÉMET une requête, c'est un `src`/`href`/`url()` sortant, pas une adresse CITÉE en
// prose : l'archive contient l'histoire d'items qui parlent d'URL de staging, et les censurer
// falsifierait le registre. Le namespace SVG du favicon `data:` n'est pas une requête.
const emettrices = (html) => [...html.matchAll(/(?:\bsrc|\bhref)\s*=\s*"(https?:\/\/[^"]*)"|url\(\s*['"]?(https?:\/\/[^'")\s]*)/gi)]
  .map((m) => m[1] || m[2]).filter((u) => !u.startsWith("http://www.w3.org/"));
const sceauDe = (html) => (html.match(/sceau <code>([0-9a-f]{12})<\/code>/) || [])[1];

// Fixture VERTE : une histoire complète et légale, du candidat à l'archive.
const arcV = join(T, "archive-verte.jsonl");
writeFileSync(arcV, [
  item({ titre: "Rattrapage du renommage dans les gabarits de lot", contenu: "Les gabarits citent l'ancien nom du dépôt ; à corriger au prochain run de version." }),
  maj({ statut: "decide", decideur: "humain — mandat de fixture du 08/08", date_decision: "2026-08-08" }),
  maj({ ts: "2026-08-08T12:00:00Z", statut: "en_cours" }),
  maj({ ts: "2026-08-08T13:00:00Z", statut: "corrige", date_correction: "2026-08-08", forges_cibles_reelles: ["tests"],
    version_forge_corrigee: "tests@abc1234", corrections_realisees: "Gabarits repris, ancien nom retiré des trois fichiers.",
    gains_constates: "Plus aucune citation de l'ancien nom : 3 occurrences avant, 0 après." }),
  JSON.stringify({ ev: "maj", ts: "2026-08-08T14:00:00Z", id: "TF-9001", statut: "archive" }),
].join("\n") + "\n");
const pageV = join(T, "archive-verte.html");
genererArchive(arcV, pageV);
const htmlV = readFileSync(pageV, "utf8");

check("archive verte : les jalons de l'item clos sont TOUS rendus (création → décision → clôture → archivage)", () => {
  const c = cartesDe(htmlV).find((x) => x.id === "TF-9001");
  if (!c) throw new Error("l'item archivé n'a pas de carte");
  for (const attendu of ["creation", "decision", "travaux ouverts", "cloture", "archivage", "mandat de fixture", "0 apres", "abc1234"])
    if (!c.texte.includes(attendu)) throw new Error(`jalon ou champ d'histoire absent : « ${attendu} »`);
  if (!/data-statut="corrige"/.test(htmlV)) throw new Error("statut FINAL non dérivé : « archive » écrase corrige|ecarte, la page devient infiltrable");
});

check("archive : génération déterministe — 2 générations sur la même source donnent le même octet", () => {
  const a = join(T, "det-a.html"), b = join(T, "det-b.html");
  genererArchive(join(ICI, "TODO-ARCHIVE.jsonl"), a);
  genererArchive(join(ICI, "TODO-ARCHIVE.jsonl"), b);
  if (shaFic(a) !== shaFic(b)) throw new Error("page non déterministe sur l'archive réelle");
});

check("archive rouge (déterminisme) : deux sources différentes → sha différents (le contrôle discrimine)", () => {
  const c = join(T, "det-c.html");
  genererArchive(arcV, c);
  if (shaFic(c) === shaFic(join(T, "det-a.html"))) throw new Error("le contrôle de déterminisme est tautologique — il passerait sur n'importe quoi");
});

check("archive : un item connu de l'archive RÉELLE est retrouvé par la recherche plein texte", () => {
  const reel = join(T, "reel.html");
  genererArchive(join(ICI, "TODO-ARCHIVE.jsonl"), reel);
  const h = readFileSync(reel, "utf8");
  if (cartesDe(h).length < 100) throw new Error(`${cartesDe(h).length} cartes — l'archive réelle en porte 300+`);
  if (!chercher(h, "renommage").includes("TF-0062")) throw new Error("TF-0062 introuvable par « renommage »");
});

check("archive rouge (recherche) : un terme absent ne retourne RIEN — le chercheur n'est pas toujours-vrai", () => {
  if (chercher(htmlV, "zzzintrouvablezzz").length !== 0) throw new Error("la recherche retourne des résultats pour un terme absent");
});

// Critère d'acceptation littéral de TF-0350 (mandat du 17/08). TF-0317 était encore ACTIF au
// moment de la campagne (corrige, non archivé — archiver.mjs abandonne fail-closed sur R10) :
// le cas assemble donc son histoire là où elle vit — actif ou archive — et vaut avant comme
// après l'archivage. Ce que le critère exige, c'est que la page le retrouve, pas que le
// registre soit dans un état donné.
check("archive : critère TF-0350 — « renommage » retrouve TF-0062 ET TF-0317 avec leur histoire complète", () => {
  const tous = [...readFileSync(join(ICI, "TODO-ARCHIVE.jsonl"), "utf8").split("\n"), ...readFileSync(join(ICI, "TODO.jsonl"), "utf8").split("\n")]
    .filter((l) => l.trim()).map((l) => ({ brut: l, ...JSON.parse(l) }));
  const lignes = [];
  for (const id of ["TF-0062", "TF-0317"]) {
    const ev = tous.filter((e) => e.id === id);
    if (!ev.length) throw new Error(`${id} introuvable dans les deux registres`);
    lignes.push(...ev.map((e) => e.brut));
    // un item encore actif n'a pas sa transition d'archivage : archiver.mjs la posera
    if (!ev.some((e) => e.statut === "archive")) lignes.push(JSON.stringify({ ev: "maj", ts: "2026-08-17T23:59:59Z", id, statut: "archive" }));
  }
  const src = join(T, "critere.jsonl"), out = join(T, "critere.html");
  writeFileSync(src, lignes.join("\n") + "\n");
  genererArchive(src, out);
  const h = readFileSync(out, "utf8"), trouves = chercher(h, "renommage");
  for (const id of ["TF-0062", "TF-0317"]) {
    if (!trouves.includes(id)) throw new Error(`« renommage » ne retrouve pas ${id}`);
    const c = cartesDe(h).find((x) => x.id === id);
    for (const jalon of ["creation", "decision", "cloture", "archivage"])
      if (!c.texte.includes(jalon)) throw new Error(`${id} : histoire incomplète, jalon « ${jalon} » absent`);
    if (!/decideur/.test(c.texte)) throw new Error(`${id} : décideur absent de l'histoire`);
    if (!/gains constates/.test(c.texte)) throw new Error(`${id} : gains constatés absents de l'histoire`);
  }
});

// Loi transverse n°3 : une recherche sans résultat le DIT. L'état vide est câblé (il nomme le
// terme cherché) et sa réinitialisation aussi — un état vide sans issue est un cul-de-sac.
const controleEtatVide = (h) => {
  if (!/id="vide"[^>]*class="etat-vide"/.test(h)) throw new Error("aucun état vide dans la page");
  if (!/id="vide-reinit"/.test(h) || !h.includes("getElementById('vide-reinit').addEventListener")) throw new Error("état vide sans issue câblée");
  if (!h.includes("vide.hidden = visibles !== 0")) throw new Error("état vide jamais montré — affordance non câblée (loi 1)");
  if (!h.includes("videQuoi.textContent")) throw new Error("état vide muet : il ne nomme pas ce qui a été cherché (loi 3)");
};
check("archive : état vide explicite, câblé et parlant (loi 3)", () => controleEtatVide(htmlV));
check("archive rouge (état vide) : une page dont l'état vide est retiré est REFUSÉE", () => {
  const mutile = htmlV.replace(/<p id="vide"[\s\S]*?<\/p>/, "");
  try { controleEtatVide(mutile); } catch (e) { return; }
  throw new Error("le contrôle d'état vide ne détecte pas son absence");
});

check("archive : autonome (A1) — aucune référence réseau émettrice dans la page", () => {
  const u = emettrices(htmlV);
  if (u.length) throw new Error(`${u.length} référence(s) réseau : ${u.slice(0, 3).join(", ")}`);
  if (!/href="data:image\/svg\+xml,/.test(htmlV)) throw new Error("favicon non embarqué en data: URI (A2)");
});
check("archive rouge (A1) : une image distante injectée est DÉTECTÉE", () => {
  const pollue = htmlV.replace("<body>", '<body><img src="https://exemple.test/pixel.png" alt="">');
  if (emettrices(pollue).length !== 1) throw new Error("le contrôle A1 ne voit pas une requête réseau injectée");
});

check("archive : le sceau de fraîcheur CHANGE quand la source change (page périmée détectable)", () => {
  const src2 = join(T, "archive-bougee.jsonl"), page2 = join(T, "archive-bougee.html");
  writeFileSync(src2, readFileSync(arcV, "utf8")
    + JSON.stringify({ ev: "maj", ts: "2026-08-08T15:00:00Z", id: "TF-9001", statut: "archive" }) + "\n");
  genererArchive(src2, page2);
  const s1 = sceauDe(htmlV), s2 = sceauDe(readFileSync(page2, "utf8"));
  if (!s1 || !s2) throw new Error("sceau absent de la page — une page périmée serait indétectable");
  if (s1 === s2) throw new Error("sceau inchangé alors que la source a bougé");
});
check("archive rouge (sceau) : source INCHANGÉE → sceau identique (le sceau n'est pas aléatoire)", () => {
  const page3 = join(T, "archive-bis.html");
  genererArchive(arcV, page3);
  if (sceauDe(readFileSync(page3, "utf8")) !== sceauDe(htmlV)) throw new Error("sceau instable à source constante");
});

// R-30 : clair par défaut STRICT, bascule câblée et persistée, impression claire — et le
// `color-scheme` porté par les tokens, jamais figé dans un <meta> (amendement RV-9 du 14/08 ;
// generer-page.mjs porte encore ce <meta> fautif, generer-archive.mjs ne le recopie pas).
check("archive : charte R-30 tenue et défaut RV-9 non recopié", () => {
  if (/prefers-color-scheme:\s*dark/.test(htmlV)) throw new Error("auto-sombre hérité de l'OS — retiré par l'amendement TF-0158");
  for (const attendu of ['id="theme-toggle"', "localStorage.setItem('digitai-theme'", 'data-theme="dark"', "@media print"])
    if (!htmlV.includes(attendu)) throw new Error(`bascule ou impression R-30 non câblée : « ${attendu} » absent`);
  if (/<meta\s+name="color-scheme"/i.test(htmlV.replace(/<!--[\s\S]*?-->/g, "")))
    throw new Error("color-scheme figé dans un <meta> — défaut RV-9 recopié de generer-page.mjs");
  if (!/:root \{\s*\n\s*color-scheme:light/.test(htmlV) || !/:root\[data-theme="dark"\] \{\s*\n\s*color-scheme:dark/.test(htmlV))
    throw new Error("color-scheme absent des blocs de tokens — les surfaces du navigateur ne suivraient pas le thème (RV-9)");
});

// ---- L11 : la page COURANTE passe l'oracle du socle HTML (TF-0356, 18/08) -------------------
// Le défaut corrigé ce jour — esc() au lieu de escLit() sur les titres, « None » rendu nu dans
// la carte de TF-0309 — n'était visible d'AUCUN contrôle d'ici : check_html vit chez
// forge-agents et personne ne le jouait sur TODO.html. La vue d'archive, née la veille, passait
// déjà : le cadet avait dépassé l'aîné sans que rien ne le dise. Double sens obligatoire — un
// vert seul ne prouverait que l'absence de littéral dans le registre du jour, pas le contrôle.
const RACINE = process.env.FORGE_ROOT ?? join(ICI, "..", "..");
const checkHtml = join(RACINE, "digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", "check_html.py");
const jouerCheckHtml = (fichier) => {
  try { execFileSync("python", [checkHtml, fichier], { encoding: "utf8", stdio: "pipe" }); return { code: 0, sortie: "" }; }
  catch (e) { return { code: e.status ?? -1, sortie: String(e.stdout || "") + String(e.stderr || "") }; }
};

check("page courante : TODO.html passe check_html (socle HTML)", () => {
  // Absence = FAIL, jamais SKIP : un gate qu'on ne sait pas jouer n'en est pas un (R-35).
  if (!existsSync(checkHtml)) throw new Error(`check_html introuvable (${checkHtml}) — gate injouable, donc en défaut`);
  const r = jouerCheckHtml(join(ICI, "TODO.html"));
  if (r.code !== 0) throw new Error(`check_html FAIL sur la page courante : ${r.sortie.trim().slice(0, 300)}`);
});

check("page rouge : un littéral nu réinjecté dans un titre est bien dénoncé par L11", () => {
  if (!existsSync(checkHtml)) throw new Error(`check_html introuvable (${checkHtml}) — gate injouable, donc en défaut`);
  const html = readFileSync(join(ICI, "TODO.html"), "utf8");
  const injecte = html.replace(/<h3 class="card-titre">/, '<h3 class="card-titre">valeur None non traitée — ');
  if (injecte === html) throw new Error("fixture rouge non plantée — aucun titre de carte dans la page");
  const rouge = join(T, "page-rouge.html");
  writeFileSync(rouge, injecte);
  const r = jouerCheckHtml(rouge);
  if (r.code === 0) throw new Error("check_html PASSE sur la fixture rouge — le vert ci-dessus ne prouve rien");
  if (!/L11/.test(r.sortie)) throw new Error(`échec obtenu, mais pas sur L11 : ${r.sortie.trim().slice(0, 200)}`);
});

// ---- R-30 / RV-9 sur la page COURANTE (TF-0327, 18/08) -------------------------------------
// Le contrôle R-30 n'existait que pour la page d'archive : generer-page.mjs a donc porté le
// `<meta name="color-scheme">` que RV-9 déclare fautif pendant 4 jours sans que rien ne le
// dise, pendant que le cadet, lui, était jugé. Symétrie posée ici.
check("page courante : R-30 tenue (clair strict, color-scheme dans les tokens, pas de <meta>)", () => {
  const html = readFileSync(join(ICI, "TODO.html"), "utf8");
  if (/prefers-color-scheme:\s*dark/.test(html))
    throw new Error("auto-sombre hérité de l'OS — retiré par l'amendement TF-0158");
  if (/<meta\s+name="color-scheme"/i.test(html.replace(/<!--[\s\S]*?-->/g, "")))
    throw new Error("color-scheme figé dans un <meta> — défaut RV-9");
  if (!/:root \{\s*\n\s*color-scheme:light/.test(html) || !/:root\[data-theme="dark"\] \{\s*\n\s*color-scheme:dark/.test(html))
    throw new Error("color-scheme absent des blocs de tokens — les surfaces du navigateur ne suivraient pas le thème (RV-9)");
  for (const attendu of ['id="theme-toggle"', "localStorage.setItem('digitai-theme'", 'data-theme="dark"', "@media print"])
    if (!html.includes(attendu)) throw new Error(`bascule ou impression R-30 non câblée : « ${attendu} » absent`);
});

// La fixture VERTE est la preuve de conformité de référence : si elle démontre le comportement
// interdit, toute revue qui s'y adosse valide l'inverse de la règle (incident TF-0327).
check("fixture témoin verte : elle démontre bien R-30, et non son contraire", () => {
  const f = join(ICI, "..", "references", "temoin", "Digit-AI - Page-Temoin Bascule-Sombre-Verte - HTML - 20260812a.html");
  if (!existsSync(f)) throw new Error(`fixture témoin introuvable (${f})`);
  const html = readFileSync(f, "utf8");
  if (/matchMedia/.test(html)) throw new Error("la fixture verte suit encore prefers-color-scheme — elle démontre l'interdit");
  if (/<meta\s+name="color-scheme"/i.test(html.replace(/<!--[\s\S]*?-->/g, "")))
    throw new Error("color-scheme figé dans un <meta> — défaut RV-9 dans la preuve de référence");
  if (/prefers-color-scheme honoré/.test(html))
    throw new Error("la description annonce encore « prefers-color-scheme honoré » — la fixture ment sur ce qu'elle prouve");
});

rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test TODO-FORGE : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
