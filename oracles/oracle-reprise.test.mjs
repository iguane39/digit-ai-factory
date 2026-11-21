#!/usr/bin/env node
/**
 * oracle-reprise.test.mjs — recette à DOUBLE SENS d'`oracle-reprise.mjs` (R-64, TF-1736).
 *
 * Le cas fondateur se rejoue tel quel : un canal qui porte les générateurs, un poste qui ne les a
 * pas. RP4 doit le voir (FAIL), la restauration doit le lever (PASS), sans geste humain. Chaque
 * refus a son remède joué : un secret retiré du manifeste, un feu vert consigné, l'ancien chemin d'un
 * dossier renommé gardé dans .gitignore (RP6, TF-2441).
 *
 * Joué par `oracles\self-tests.mjs` (I1 via DEDIES, I2 comme tout `*.test.mjs`).
 *
 * D-224 (a) du 21/11/2026 : le coffre de secrets clé par clé et la mémoire Claude du projet. Chaque refus a son
 * remède joué (le choix --prefere, le motif au .gitignore, la clé rangée puis envoyée, l'exclusion, le feu vert) ;
 * toutes les valeurs de fixture sont assemblées à l'exécution, et le dernier cas les cherche dans toutes les sorties.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, utimesSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { verifier, synchroniser, estExclu, goVersDossierSynchronise, dossierMemoireLocal } from "./oracle-reprise.mjs";
import { analyser } from "../scripts/fusionner-env.mjs";

const HOOK = join(fileURLToPath(new URL(".", import.meta.url)), "hook-reprise.mjs");
const ORACLE = join(fileURLToPath(new URL(".", import.meta.url)), "oracle-reprise.mjs");

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const statut = (r, regle) => (r.findings.find((f) => f.regle === regle) || {}).statut;
const egal = (a, b, quoi) => { if (a !== b) throw new Error(`${quoi} : attendu ${b}, lu ${a}`); };

const T = mkdtempSync(join(tmpdir(), "reprise-"));
let n = 0;
const ecrire = (f, contenu, date) => { mkdirSync(join(f, ".."), { recursive: true }); writeFileSync(f, contenu, "utf8"); if (date) utimesSync(f, date, date); };
function banc({ envoi, elements = ["scripts/generateurs", "input"] } = {}) {
  const d = join(T, `b${++n}`), produit = join(d, "produit"), canal = join(d, "Mon Drive", "Produit - Reprise"), etat = join(d, "etat");
  mkdirSync(join(produit, "forge"), { recursive: true });
  mkdirSync(canal, { recursive: true });
  writeFileSync(join(produit, "forge", "REPRISE.json"), JSON.stringify({ schema: "factory/reprise@1", canal: { fournisseur: "Google Drive", chemins: [join(d, "absent"), canal] }, elements, ...(envoi ? { envoi } : {}) }));
  return { produit, canal, opt: { etat } };
}
// Un banc dont le produit est un dépôt git : le .gitignore dit ce que git ignore (TF-2441).
function bancGit(gitignore, suivis = {}) {
  const b = banc({ elements: ["input"] });
  const env = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
  const git = (...a) => execFileSync("git", a, { cwd: b.produit, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git("init", "-q"); git("config", "user.email", "t@t.t"); git("config", "user.name", "t");
  writeFileSync(join(b.produit, ".gitignore"), gitignore, "utf8");
  for (const [rel, contenu] of Object.entries(suivis)) ecrire(join(b.produit, rel), contenu);
  git("add", "-A"); git("commit", "-q", "-m", "socle");
  b.visibles = () => git("status", "--porcelain", "-uall").split("\n").filter((l) => l.startsWith("??")).map((l) => l.slice(3));
  return b;
}
const GO = { actif: true, go_publication: { decision: "D-3 (b) du 15/10/2026", date: "2026-10-15", par: "humain" } };

check("sans manifeste : SANS_OBJET dit à voix haute, verdict PASS", () => {
  const d = join(T, "nu"); mkdirSync(d, { recursive: true });
  const r = verifier(d);
  egal(statut(r, "RP1"), "SANS_OBJET", "RP1"); egal(r.verdict, "PASS", "verdict");
});

check("cas du 14/10 : 58 générateurs dans le canal, absents du poste → RP4 FAIL", () => {
  const b = banc();
  for (let i = 1; i <= 58; i++) ecrire(join(b.canal, "scripts", "generateurs", `gen-${i}.py`), `# générateur ${i}\n`);
  const r = verifier(b.produit, b.opt);
  egal(statut(r, "RP3"), "PASS", "RP3 (le second emplacement est trouvé)");
  egal(statut(r, "RP4"), "FAIL", "RP4");
  if (!/58 fichier/.test(r.findings.find((f) => f.regle === "RP4").message)) throw new Error("le constat ne compte pas les 58 fichiers");
  // le remède : la restauration, sans geste humain
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(s.fait.length, 58, "fichiers restaurés");
  egal(statut(verifier(b.produit, b.opt), "RP4"), "PASS", "RP4 après restauration");
  egal(readFileSync(join(b.produit, "scripts", "generateurs", "gen-7.py"), "utf8"), "# générateur 7\n", "contenu restauré");
});

check("le canal a changé depuis la dernière synchronisation : restauré ; le poste a changé : non écrasé", () => {
  const b = banc();
  ecrire(join(b.canal, "input", "a.txt"), "v1"); ecrire(join(b.canal, "input", "b.txt"), "v1");
  synchroniser(b.produit, "restaurer", b.opt);
  const plusTard = new Date(Date.now() + 60000);
  ecrire(join(b.canal, "input", "a.txt"), "v2-canal", plusTard);
  ecrire(join(b.produit, "input", "b.txt"), "v2-poste", plusTard);
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(readFileSync(join(b.produit, "input", "a.txt"), "utf8"), "v2-canal", "a.txt restauré");
  egal(readFileSync(join(b.produit, "input", "b.txt"), "utf8"), "v2-poste", "b.txt du poste préservé");
  egal(s.conflits.length, 0, "conflits");
  egal(s.a_faire_autre_sens, 1, "b.txt attend l'envoi");
});

check("premier passage, contenus différents : le plus récent gagne et l'écrasé est sauvegardé", () => {
  const b = banc();
  ecrire(join(b.produit, "input", "c.txt"), "ancien-poste", new Date(Date.now() - 3600e3));
  ecrire(join(b.canal, "input", "c.txt"), "recent-canal", new Date());
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(readFileSync(join(b.produit, "input", "c.txt"), "utf8"), "recent-canal", "c.txt");
  egal(s.conflits.length, 1, "conflit déclaré");
  egal(readFileSync(s.conflits[0].sauvegarde, "utf8"), "ancien-poste", "sauvegarde");
});

check("envoi sans feu vert : refusé, rien ne part (RP5 FAIL) ; feu vert consigné : envoyé (RP5 PASS)", () => {
  const b = banc({ envoi: { actif: true } });
  ecrire(join(b.produit, "input", "neuf.txt"), "fait sur ce poste");
  const s = synchroniser(b.produit, "pousser", b.opt);
  if (!s.refuse) throw new Error("l'envoi sans feu vert est parti");
  if (existsSync(join(b.canal, "input", "neuf.txt"))) throw new Error("un fichier est arrivé dans le canal");
  egal(statut(verifier(b.produit, b.opt), "RP5"), "FAIL", "RP5 sans feu vert");
  writeFileSync(join(b.produit, "forge", "REPRISE.json"), JSON.stringify({ ...JSON.parse(readFileSync(join(b.produit, "forge", "REPRISE.json"), "utf8")), envoi: GO }));
  const s2 = synchroniser(b.produit, "pousser", b.opt);
  egal(s2.fait.length, 1, "fichiers envoyés");
  egal(readFileSync(join(b.canal, "input", "neuf.txt"), "utf8"), "fait sur ce poste", "contenu envoyé");
  egal(statut(verifier(b.produit, b.opt), "RP5"), "PASS", "RP5 sous feu vert");
});

check("un secret ne transite jamais, dans aucun sens ; un secret déclaré rend RP2 FAIL, retiré PASS", () => {
  const b = banc({ envoi: GO, elements: ["input", ".env"] });
  ecrire(join(b.canal, "input", ".env"), "CLE=canal"); ecrire(join(b.canal, "input", "client.pem"), "x");
  ecrire(join(b.produit, "input", "api-secret.json"), "{}"); ecrire(join(b.produit, "input", "tokens.css"), ":root{}");
  egal(statut(verifier(b.produit, b.opt), "RP2"), "FAIL", "RP2 avec .env déclaré");
  synchroniser(b.produit, "restaurer", b.opt); synchroniser(b.produit, "pousser", b.opt);
  if (existsSync(join(b.produit, "input", ".env")) || existsSync(join(b.produit, "input", "client.pem"))) throw new Error("un secret du canal a été restauré");
  if (existsSync(join(b.canal, "input", "api-secret.json"))) throw new Error("un secret du poste est parti vers le canal");
  if (!existsSync(join(b.canal, "input", "tokens.css"))) throw new Error("tokens.css, fichier de marque, a été pris pour un secret");
  writeFileSync(join(b.produit, "forge", "REPRISE.json"), JSON.stringify({ ...JSON.parse(readFileSync(join(b.produit, "forge", "REPRISE.json"), "utf8")), elements: ["input"] }));
  egal(statut(verifier(b.produit, b.opt), "RP2"), "PASS", "RP2 après retrait");
});

check("canal absent de ce poste : RP3 FAIL nomme les emplacements essayés ; REPRISE_CANAL le lève", () => {
  const b = banc();
  const canalVrai = b.canal;
  writeFileSync(join(b.produit, "forge", "REPRISE.json"), JSON.stringify({ schema: "factory/reprise@1", canal: { chemins: [join(T, "nulle-part")] }, elements: ["input"] }));
  const r = verifier(b.produit, b.opt);
  egal(statut(r, "RP3"), "FAIL", "RP3");
  if (!/nulle-part/.test(r.findings.find((f) => f.regle === "RP3").message)) throw new Error("le constat ne nomme pas l'emplacement essayé");
  process.env.REPRISE_CANAL = canalVrai;
  try { egal(statut(verifier(b.produit, b.opt), "RP3"), "PASS", "RP3 avec REPRISE_CANAL"); } finally { delete process.env.REPRISE_CANAL; }
});

check("manifeste invalide (chemin absolu, « .. ») : RP1 FAIL ; exclusions par nom à toute profondeur", () => {
  const b = banc({ elements: ["C:/ailleurs", "../voisin"] });
  egal(statut(verifier(b.produit, b.opt), "RP1"), "FAIL", "RP1");
  if (!estExclu("a/node_modules/x.js")) throw new Error("node_modules non exclu en profondeur");
  if (estExclu("scripts/generateurs/gen-1.py")) throw new Error("un générateur pris pour un exclu");
});

check("dossier ignoré puis renommé (RT-150) : l'ancien nom revenu du canal est refusé, git ne voit rien ; RP6 FAIL nomme le dossier", () => {
  const b = bancGit("input/03-tableaux/\n", { "forge/notes.md": "suivi" });
  for (const d of ["03-tableaux", "Ancien tableau"]) ecrire(join(b.canal, "input", d, "classeur.xlsx"), "donnee fictive");
  const v = verifier(b.produit, b.opt);
  egal(statut(v, "RP6"), "FAIL", "RP6 avant restauration");
  if (!/Ancien tableau/.test(v.findings.find((f) => f.regle === "RP6").message)) throw new Error("le constat ne nomme pas le dossier revenu sous son ancien nom");
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(JSON.stringify(s.fait), JSON.stringify(["input/03-tableaux/classeur.xlsx"]), "seul le dossier encore ignoré est posé");
  egal(s.refuses.length, 1, "fichiers refusés");
  egal(s.refuses[0].rel, "input/Ancien tableau/classeur.xlsx", "fichier refusé");
  if (existsSync(join(b.produit, "input", "Ancien tableau"))) throw new Error("le fichier refusé a été posé");
  egal(b.visibles().length, 0, "fichiers non suivis visibles à git status");
  const apres = verifier(b.produit, b.opt);
  egal(statut(apres, "RP4"), "PASS", "RP4 après restauration : le refus n'est pas un écart à restaurer");
  egal(statut(apres, "RP6"), "FAIL", "RP6 reste rouge tant que le chemin n'est pas couvert");
});

check("remède joué : l'ancien chemin gardé dans .gitignore, la restauration pose, RP6 PASS, git ne voit toujours rien", () => {
  const b = bancGit("input/03-tableaux/\n");
  ecrire(join(b.canal, "input", "Ancien tableau", "classeur.xlsx"), "donnee fictive");
  egal(statut(verifier(b.produit, b.opt), "RP6"), "FAIL", "RP6 avant remède");
  writeFileSync(join(b.produit, ".gitignore"), "input/03-tableaux/\ninput/Ancien tableau/\n", "utf8");
  egal(statut(verifier(b.produit, b.opt), "RP6"), "PASS", "RP6 après remède");
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(s.fait.length, 1, "fichier posé"); egal(s.refuses.length, 0, "refus");
  egal(readFileSync(join(b.produit, "input", "Ancien tableau", "classeur.xlsx"), "utf8"), "donnee fictive", "contenu posé");
  egal(b.visibles().length, 0, "fichiers non suivis visibles à git status");
});

check("un fichier déjà SUIVI par git se met à jour (aucune exposition nouvelle) ; hors dépôt git, rien n'est refusé", () => {
  const b = bancGit("", { "input/suivi.txt": "v1" });
  ecrire(join(b.canal, "input", "suivi.txt"), "v2-canal", new Date(Date.now() + 60000));
  egal(statut(verifier(b.produit, b.opt), "RP6"), "PASS", "RP6 sur un fichier suivi");
  egal(synchroniser(b.produit, "restaurer", b.opt).fait.length, 1, "fichier suivi mis à jour");
  egal(readFileSync(join(b.produit, "input", "suivi.txt"), "utf8"), "v2-canal", "contenu");
  const h = banc({ elements: ["input"] });
  ecrire(join(h.canal, "input", "libre.txt"), "x");
  const s = synchroniser(h.produit, "restaurer", h.opt);
  egal(s.fait.length, 1, "hors git : fichier posé"); egal(s.refuses.length, 0, "hors git : refus");
  if (!/hors dépôt git/.test(verifier(h.produit, h.opt).findings.find((f) => f.regle === "RP6").message)) throw new Error("RP6 ne dit pas qu'il ne juge pas un produit hors git");
});

// ---- TF-2623 (RP-30, lot Produit-79 20261112f) : un feu vert de publication vise un dossier synchronisé, aucun manifeste.
// Le 12/11/2026, un dossier Drive de reprise existait depuis le 11/10 ; go_publication au ledger le 24/10 (seq 793) et le 12/11
// (seq 1178) ; aucun forge/REPRISE.json, donc le hook `reprise` se taisait et RP4 a rougi au premier passage.
const ledgerGo = (...lignes) => lignes.map((l) => JSON.stringify(l)).join("\n") + "\n";
function bancSansManifeste(ledger) {
  const d = join(T, `s${++n}`), produit = join(d, "produit"), canal = join(d, "Mon Drive", "Produit - Reprise"), etat = join(d, "etat");
  mkdirSync(join(produit, "forge"), { recursive: true });
  mkdirSync(canal, { recursive: true });
  if (ledger) writeFileSync(join(produit, "forge", "ledger.jsonl"), ledger, "utf8");
  return { produit, canal, etat, opt: { etat } };
}
const jouerHook = (b, sens = "--restaurer") => spawnSync(process.execPath, [HOOK, sens], { cwd: b.produit, input: "", encoding: "utf8", env: { ...process.env, REPRISE_ETAT: b.etat } });
const LEDGER_DRIVE = ledgerGo(
  { seq: 1, ts: "2026-10-11T08:00:00Z", type: "run_open", run: "essai" },
  { seq: 2, ts: "2026-10-24T09:00:00Z", type: "go_publication", r38: true, citation: "D-12 (a) du 24/10", cible: "dossier Google Drive de reprise du produit" },
  { seq: 3, ts: "2026-11-12T09:00:00Z", type: "go_publication", r38: true, citation: "D-30 (a) du 12/11", cible: "même dossier Drive" },
);

check("TF-2623 rouge — un feu vert vise un dossier Drive et forge/REPRISE.json manque : RP7 FAIL, l'ouverture le signale, rien n'est restauré", () => {
  const b = bancSansManifeste(LEDGER_DRIVE);
  ecrire(join(b.canal, "input", "entrant.txt"), "porté par le canal");
  const go = goVersDossierSynchronise(b.produit);
  egal(go.map((g) => g.seq).join(","), "2,3", "feux verts relevés");
  const v = verifier(b.produit, b.opt);
  egal(statut(v, "RP1"), "SANS_OBJET", "RP1"); egal(statut(v, "RP7"), "FAIL", "RP7"); egal(v.verdict, "FAIL", "verdict");
  if (!/seq 2, 3/.test(v.findings.find((f) => f.regle === "RP7").message)) throw new Error("le constat ne nomme pas les entrées du ledger");
  const s = synchroniser(b.produit, "restaurer", b.opt);
  if (!s.sans_objet || s.go_sans_manifeste?.length !== 2) throw new Error("la synchronisation ne porte pas le signal : " + JSON.stringify(s));
  const h = jouerHook(b);
  egal(h.status, 0, "le hook ne bloque jamais");
  if (!/forge\/REPRISE\.json/.test(h.stdout) || !/seq 2, 3/.test(h.stdout) || !/dans CE tour/.test(h.stdout)) throw new Error("l'ouverture ne signale pas le manifeste à écrire : " + h.stdout);
  if (existsSync(join(b.produit, "input", "entrant.txt"))) throw new Error("un fichier a été restauré sans manifeste");
  egal(jouerHook(b, "--pousser").stdout, "", "la fin de tour n'ajoute pas le signal à l'ouverture");
});

check("TF-2623 vert (remède joué) — la session écrit forge/REPRISE.json dans le tour, le hook restaure : RP4 PASS au premier passage, RP7 PASS", () => {
  const b = bancSansManifeste(LEDGER_DRIVE);
  ecrire(join(b.canal, "input", "entrant.txt"), "porté par le canal");
  egal(statut(verifier(b.produit, b.opt), "RP7"), "FAIL", "RP7 avant le manifeste");
  writeFileSync(join(b.produit, "forge", "REPRISE.json"), JSON.stringify({ schema: "factory/reprise@1", canal: { fournisseur: "Google Drive", chemins: [b.canal] }, elements: ["input"] }));
  const h = jouerHook(b);
  egal(h.status, 0, "hook");
  if (!/1 fichier\(s\) restauré/.test(h.stdout)) throw new Error("le hook n'a pas restauré : " + h.stdout);
  const v = verifier(b.produit, b.opt);
  egal(statut(v, "RP4"), "PASS", "RP4 au premier passage"); egal(statut(v, "RP7"), "PASS", "RP7"); egal(v.verdict, "PASS", "verdict");
  egal(readFileSync(join(b.produit, "input", "entrant.txt"), "utf8"), "porté par le canal", "contenu restauré");
});

check("TF-2623 — un feu vert qui ne vise aucun dossier synchronisé, ou pas de ledger : le hook se tait, SANS_OBJET, verdict PASS", () => {
  const autre = bancSansManifeste(ledgerGo(
    { seq: 1, ts: "2026-10-11T08:00:00Z", type: "run_open", run: "essai" },
    { seq: 2, ts: "2026-10-12T08:00:00Z", type: "go_publication", r38: true, citation: "D-5 (a) du 12/10", cible: "page publiée sur claude.ai" },
    { seq: 3, ts: "2026-10-13T08:00:00Z", type: "question_humain", texte: "faut-il copier le dossier Google Drive ?" },
  ));
  for (const b of [autre, bancSansManifeste(null)]) {
    const v = verifier(b.produit, b.opt);
    egal(statut(v, "RP1"), "SANS_OBJET", "RP1"); egal(statut(v, "RP7"), undefined, "RP7 absent"); egal(v.verdict, "PASS", "verdict");
    egal(jouerHook(b).stdout, "", "le hook se tait");
  }
});

// ---- TF-2680 (factory-digit-ai-fr 20261115zb) : une base dérivée, ignorée par git, ne voyage ni par git ni par le canal.
// Le 15/11/2026, sur un poste neuf restauré par le canal, data/site-v2.db était créée vide au démarrage local : 13 pages de
// forge rendaient 404 sans erreur. REPRISE.json porte une liste « regenerer » ({ commande, produit }) que la restauration joue
// quand le produit manque ou est vide ; RP8 juge cette base, et signale toute base ignorée par git que rien ne couvre.
const GENERATEUR = 'import { mkdirSync, writeFileSync } from "node:fs";\nmkdirSync("data", { recursive: true });\nwriteFileSync("data/site-v2.db", "catalogue fictif de la v2");\n';
const REGEN = { commande: "node scripts/generer-base.mjs", produit: "data/site-v2.db" };
const manifeste = (b, extra) => {
  const f = join(b.produit, "forge", "REPRISE.json");
  writeFileSync(f, JSON.stringify({ ...JSON.parse(readFileSync(f, "utf8")), ...extra }));
};
const bancBase = (extra) => {
  const b = bancGit("data/\n", { "scripts/generer-base.mjs": GENERATEUR });
  manifeste(b, extra);
  return b;
};
const message = (r, regle) => r.findings.find((f) => f.regle === regle)?.message || "";

check("TF-2680 rouge — base ignorée absente du poste : RP8 FAIL la nomme ; la restauration joue la commande, RP8 PASS, git ne voit rien", () => {
  const b = bancBase({ regenerer: [REGEN] });
  const v = verifier(b.produit, b.opt);
  egal(statut(v, "RP8"), "FAIL", "RP8 base absente");
  if (!/data\/site-v2\.db/.test(message(v, "RP8")) || !/--restaurer/.test(message(v, "RP8"))) throw new Error("le constat ne nomme pas la base ni la restauration : " + message(v, "RP8"));
  const h = jouerHook(b);
  egal(h.status, 0, "hook");
  if (!/1 base\(s\) régénérée\(s\)/.test(h.stdout)) throw new Error("le hook ne dit pas la régénération : " + h.stdout);
  egal(readFileSync(join(b.produit, "data", "site-v2.db"), "utf8"), "catalogue fictif de la v2", "base régénérée");
  egal(statut(verifier(b.produit, b.opt), "RP8"), "PASS", "RP8 après restauration");
  egal(b.visibles().length, 0, "fichiers non suivis visibles à git status");
  // idempotence : une base présente et non vide ne se régénère pas
  writeFileSync(join(b.produit, "data", "site-v2.db"), "base enrichie sur ce poste");
  egal(synchroniser(b.produit, "restaurer", b.opt).regenere.length, 0, "régénération d'une base présente");
  egal(readFileSync(join(b.produit, "data", "site-v2.db"), "utf8"), "base enrichie sur ce poste", "base du poste intacte");
});

check("TF-2680 — la base créée VIDE au démarrage local (le cas du 15/11) est régénérée comme une base absente", () => {
  const b = bancBase({ regenerer: [REGEN] });
  mkdirSync(join(b.produit, "data"), { recursive: true }); writeFileSync(join(b.produit, "data", "site-v2.db"), "");
  const v = verifier(b.produit, b.opt);
  egal(statut(v, "RP8"), "FAIL", "RP8 base vide");
  if (!/vide/.test(message(v, "RP8"))) throw new Error("le constat ne dit pas que la base est vide : " + message(v, "RP8"));
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(s.regenere.length, 1, "bases régénérées"); egal(s.regenere[0].ok, true, "régénération réussie");
  egal(statut(verifier(b.produit, b.opt), "RP8"), "PASS", "RP8 après restauration");
});

check("TF-2680 — une commande de régénération qui échoue se dit (ok faux, RP8 FAIL, ligne du hook) ; une liste mal formée rend RP1 FAIL", () => {
  const b = bancBase({ regenerer: [{ commande: "node scripts/nulle-part.mjs", produit: "data/site-v2.db" }] });
  const s = synchroniser(b.produit, "restaurer", b.opt);
  egal(s.regenere[0].ok, false, "régénération échouée");
  egal(statut(verifier(b.produit, b.opt), "RP8"), "FAIL", "RP8 base toujours absente");
  const h = jouerHook(b);
  if (!/régénération en échec/.test(h.stdout) || !/nulle-part/.test(h.stdout)) throw new Error("le hook ne nomme pas la commande en échec : " + h.stdout);
  manifeste(b, { regenerer: ["node scripts/generer-base.mjs"] });
  egal(statut(verifier(b.produit, b.opt), "RP1"), "FAIL", "RP1 liste mal formée");
  manifeste(b, { regenerer: [{ commande: "node x.mjs", produit: "../hors.db" }] });
  egal(statut(verifier(b.produit, b.opt), "RP1"), "FAIL", "RP1 produit hors du dépôt");
});

check("TF-2680 — une base ignorée par git que rien ne couvre (ni élément, ni régénération) : RP8 AVERT la nomme ; chaque remède la couvre", () => {
  const b = bancBase({});
  mkdirSync(join(b.produit, "data"), { recursive: true }); writeFileSync(join(b.produit, "data", "site-v2.db"), "catalogue");
  const v = verifier(b.produit, b.opt);
  egal(statut(v, "RP8"), "AVERT", "RP8 base non couverte"); egal(v.verdict, "PASS", "un avertissement ne bloque pas");
  if (!/data\/site-v2\.db/.test(message(v, "RP8"))) throw new Error("le constat ne nomme pas la base : " + message(v, "RP8"));
  manifeste(b, { regenerer: [REGEN] });
  egal(statut(verifier(b.produit, b.opt), "RP8"), "PASS", "RP8 avec régénération");
  manifeste(b, { regenerer: undefined, elements: ["input", "data"] });
  egal(statut(verifier(b.produit, b.opt), "RP8"), "PASS", "RP8 avec la base comme élément");
  manifeste(b, { elements: ["input"], exclusions: ["data/site-v2.db"] });
  egal(statut(verifier(b.produit, b.opt), "RP8"), "PASS", "RP8 avec la base écartée à dessein");
  const sans = bancGit("", { "input/a.txt": "suivi" }); // aucun fichier ignoré, aucune régénération : rien à dire
  egal(statut(verifier(sans.produit, sans.opt), "RP8"), undefined, "RP8 sans objet");
});

// ---- D-224 (a) du 21/11/2026 : le COFFRE DE SECRETS clé par clé et la MÉMOIRE CLAUDE du projet ----------------------
// Le fait (diagnostic 20261121c) : 4 mécanismes maison chez les produits, 9 fichiers de secrets sur 13 tenus par aucun
// script, et un coffre à 2 clés de moins que le produit n'en exige dont le juge rendait PASS (M-09). Les valeurs de
// fixture s'assemblent à l'exécution : aucune n'est écrite en clair dans ce fichier, et le dernier cas les cherche
// toutes dans tout ce que l'outil a rendu.
const VALEURS = [], SORTIES = [];
let nv = 0;
const valeur = (etiquette) => { const v = ["fx", etiquette, (++nv).toString(36), Math.random().toString(36).slice(2, 8)].join("-"); VALEURS.push(v); return v; };
const garder = (x) => { SORTIES.push(typeof x === "string" ? x : JSON.stringify(x)); return x; };
const texteEnv = (paires) => paires.map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
const valeursDe = (f) => Object.fromEntries([...analyser(existsSync(f) ? readFileSync(f, "utf8") : "").cles].map(([k, l]) => [k, l.valeur]));
const statutFlux = (r, regle, flux) => (r.findings.find((f) => f.regle === regle && f.flux === flux) || {}).statut;
const messageFlux = (r, regle, flux) => (r.findings.find((f) => f.regle === regle && f.flux === flux) || {}).message || "";
const lireBanc = (b) => JSON.parse(readFileSync(join(b.produit, "forge", "REPRISE.json"), "utf8"));
const sansGit = () => { const e = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete e[k]; return e; };

// La disposition du gabarit : trois dossiers voisins sous « <Produit> - Reprise » (canal, coffre SECRETS, MEMOIRE-CLAUDE).
function bancCoffre({ poste = null, coffre = null, cles = ["A"], gitignore = ".env\n.env.*\n", envoi = GO, fichiers = [".env"], memoire = false, elements = ["input"] } = {}) {
  const d = join(T, `c${++n}`), produit = join(d, "produit"), reprise = join(d, "Mon Drive", "Produit - Reprise");
  const canal = join(reprise, "DONNEES-HORS-GIT"), dCoffre = join(reprise, "SECRETS"), dMemoire = join(reprise, "MEMOIRE-CLAUDE");
  const opt = { etat: join(d, "etat"), profil: join(d, "profil-claude") };
  for (const x of [join(produit, "forge"), canal, dCoffre, ...(memoire ? [dMemoire] : [])]) mkdirSync(x, { recursive: true });
  writeFileSync(join(produit, ".gitignore"), gitignore, "utf8");
  writeFileSync(join(produit, "forge", "REPRISE.json"), JSON.stringify({ schema: "factory/reprise@1", canal: { fournisseur: "Google Drive", chemins: [canal] }, elements,
    secrets: { fichiers, chemins: [join(d, "absent", "SECRETS"), dCoffre], cles_attendues: cles }, ...(memoire ? { memoire: { chemins: [dMemoire] } } : {}), ...(envoi ? { envoi } : {}) }));
  const envGit = sansGit();
  const git = (...a) => execFileSync("git", a, { cwd: produit, env: envGit, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git("init", "-q"); git("config", "user.email", "t@t.t"); git("config", "user.name", "t"); git("add", "-A"); git("commit", "-q", "-m", "socle");
  if (poste !== null) writeFileSync(join(produit, ".env"), poste, "utf8");
  if (coffre !== null) writeFileSync(join(dCoffre, ".env"), coffre, "utf8");
  return { d, produit, canal, coffre: dCoffre, memoire: dMemoire, opt, envPoste: join(produit, ".env"), envCoffre: join(dCoffre, ".env"),
    visibles: () => git("status", "--porcelain", "-uall").split("\n").filter((l) => l.startsWith("??")).map((l) => l.slice(3)) };
}
const hookCoffre = (b, sens, plus = {}) => spawnSync(process.execPath, [HOOK, sens], { cwd: b.produit, input: "", encoding: "utf8", env: { ...process.env, REPRISE_ETAT: b.opt.etat, CLAUDE_CONFIG_DIR: b.opt.profil, ...plus } });
const cliOracle = (b, ...args) => spawnSync(process.execPath, [ORACLE, "--racine", b.produit, "--etat", b.opt.etat, "--profil", b.opt.profil, ...args], { encoding: "utf8" });

check("D-224 — union sans perte dans les deux sens : l'ouverture porte au poste les clés du coffre, la fin de tour porte au coffre celles du poste ; aucune clé perdue, les deux textes égaux, git ne voit rien", () => {
  const [a, b2, c, d2] = [valeur("a"), valeur("b"), valeur("c"), valeur("d")];
  const b = bancCoffre({ poste: texteEnv([["A", a], ["B", b2]]), coffre: texteEnv([["A", a], ["C", c], ["D", d2]]), cles: ["A", "B", "C", "D"] });
  const r = garder(synchroniser(b.produit, "restaurer", b.opt));
  egal(r.secrets.fichiers[0].cles_au_coffre_seul.join(","), "C,D", "clés reçues du coffre");
  egal(JSON.stringify(valeursDe(b.envPoste)), JSON.stringify({ A: a, B: b2, C: c, D: d2 }), "poste après l'ouverture");
  egal(JSON.stringify(valeursDe(b.envCoffre)), JSON.stringify({ A: a, C: c, D: d2 }), "l'ouverture n'écrit pas le coffre");
  const p = garder(synchroniser(b.produit, "pousser", b.opt));
  egal(p.secrets.fichiers[0].cles_au_poste_seul.join(","), "B", "clé envoyée au coffre");
  egal(readFileSync(b.envCoffre, "utf8"), readFileSync(b.envPoste, "utf8"), "les deux côtés portent le même texte");
  egal(Object.keys(valeursDe(b.envCoffre)).sort().join(","), "A,B,C,D", "aucune clé perdue");
  egal(b.visibles().length, 0, "fichiers non suivis visibles à git status");
});

check("D-224 — conflit tranché par la base : la valeur qui a changé depuis la dernière synchronisation gagne, dans chaque sens, quelle que soit la date des fichiers", () => {
  const [v1, v2, v3] = [valeur("v1"), valeur("v2"), valeur("v3")];
  const b = bancCoffre({ poste: texteEnv([["A", v1], ["B", v1]]), coffre: texteEnv([["A", v1], ["B", v1]]), cles: ["A", "B"] });
  garder(synchroniser(b.produit, "restaurer", b.opt)); // la base : A et B valent v1 des deux côtés
  ecrire(b.envCoffre, texteEnv([["A", v2], ["B", v1]]), new Date(Date.now() - 3600e3)); // le coffre change A, fichier plus ancien
  ecrire(b.envPoste, texteEnv([["A", v1], ["B", v3]]), new Date()); // le poste change B, fichier plus récent
  const r = garder(synchroniser(b.produit, "restaurer", b.opt));
  egal(r.secrets.fichiers[0].pris_du_coffre.join(","), "A", "A prise du coffre");
  egal(r.secrets.fichiers[0].pris_du_poste.join(","), "B", "B gardée du poste");
  egal(r.secrets.fichiers[0].conflits_sans_base.length, 0, "aucun conflit sans base");
  egal(valeursDe(b.envPoste).A, v2, "le poste reçoit la valeur nouvelle du coffre, d'un fichier plus ancien");
  egal(valeursDe(b.envPoste).B, v3, "le poste garde sa valeur nouvelle");
  garder(synchroniser(b.produit, "pousser", b.opt));
  egal(JSON.stringify(valeursDe(b.envCoffre)), JSON.stringify({ A: v2, B: v3 }), "le coffre reçoit B du poste");
  egal(statutFlux(garder(verifier(b.produit, b.opt)), "RP4", "coffre"), "PASS", "RP4 coffre à égalité");
});

check("D-224 rouge — conflit sans base : REFUS qui nomme la clé et la commande du choix, rien n'est écrit d'aucun côté, RP4 FAIL ; remède joué : --prefere par la ligne de commande, dans les deux sens, RP4 PASS", () => {
  const [x, y, z] = [valeur("x"), valeur("y"), valeur("z")];
  const b = bancCoffre({ poste: texteEnv([["TOK", x], ["A", z]]), coffre: texteEnv([["TOK", y], ["NEUVE", z]]), cles: ["TOK"] });
  const avantP = readFileSync(b.envPoste, "utf8"), avantC = readFileSync(b.envCoffre, "utf8");
  const f = garder(synchroniser(b.produit, "restaurer", b.opt)).secrets.fichiers[0];
  if (!/TOK/.test(f.refus || "") || !/--prefere TOK:poste/.test(f.refus) || !/D-208/.test(f.refus)) throw new Error("le refus ne nomme pas la clé, la commande du choix ou la garde : " + f.refus);
  egal(f.conflits_sans_base.join(","), "TOK", "clé en conflit");
  garder(synchroniser(b.produit, "pousser", b.opt));
  egal(readFileSync(b.envPoste, "utf8"), avantP, "poste intact, pas même la clé NEUVE");
  egal(readFileSync(b.envCoffre, "utf8"), avantC, "coffre intact, pas même la clé A");
  const v = garder(verifier(b.produit, b.opt));
  egal(statutFlux(v, "RP4", "coffre"), "FAIL", "RP4 coffre");
  if (!/--prefere/.test(messageFlux(v, "RP4", "coffre"))) throw new Error("RP4 ne donne pas le remède");
  const cli = cliOracle(b, "--restaurer", "--prefere", "TOK:coffre");
  garder(cli.stdout + cli.stderr);
  egal(cli.status, 0, "ligne de commande du choix");
  egal(valeursDe(b.envPoste).TOK, y, "TOK : la valeur du coffre, choisie");
  egal(valeursDe(b.envPoste).NEUVE, z, "la clé NEUVE arrive avec le choix");
  egal(statutFlux(verifier(b.produit, b.opt), "RP4", "coffre"), "PASS", "RP4 après le choix");
  // l'autre côté du choix : la valeur du poste gagne, et l'envoi de fin de tour (le hook, sans choix) la porte au coffre
  const b2 = bancCoffre({ poste: texteEnv([["TOK", x]]), coffre: texteEnv([["TOK", y]]), cles: ["TOK"] });
  const cli2 = cliOracle(b2, "--restaurer", "--prefere", "TOK:poste");
  garder(cli2.stdout + cli2.stderr);
  egal(cli2.status, 0, "choix du poste");
  egal(valeursDe(b2.envPoste).TOK, x, "le poste garde sa valeur");
  const h = hookCoffre(b2, "--pousser");
  garder(h.stdout + h.stderr);
  egal(valeursDe(b2.envCoffre).TOK, x, "le choix, consigné comme base, fait partir la valeur du poste à l'envoi");
  egal(statutFlux(verifier(b2.produit, b2.opt), "RP4", "coffre"), "PASS", "RP4 après l'envoi");
  egal(cliOracle(b2, "--restaurer", "--prefere", "TOK=poste").status, 2, "une forme de choix fausse est un usage refusé");
});

check("D-224 rouge — un fichier du poste que git n'ignore pas est refusé dans les deux sens, RP6 FAIL ; un .env qui naîtrait non ignoré dans un dossier absent aussi ; remède joué : le motif au .gitignore, RP6 PASS", () => {
  const k = valeur("k");
  const b = bancCoffre({ poste: texteEnv([["A", k]]), coffre: texteEnv([["A", k], ["B", k]]), cles: ["A"], gitignore: "node_modules/\n" });
  const avant = readFileSync(b.envPoste, "utf8");
  const r = garder(synchroniser(b.produit, "restaurer", b.opt));
  if (!/n'est PAS ignoré par git/.test(r.secrets.fichiers[0].refus || "")) throw new Error("refus non nommé : " + JSON.stringify(r.secrets));
  egal(readFileSync(b.envPoste, "utf8"), avant, "poste intact");
  garder(synchroniser(b.produit, "pousser", b.opt));
  egal(JSON.stringify(valeursDe(b.envCoffre)), JSON.stringify({ A: k, B: k }), "coffre intact");
  egal(statutFlux(garder(verifier(b.produit, b.opt)), "RP6", "coffre"), "FAIL", "RP6 coffre");
  writeFileSync(join(b.produit, ".gitignore"), "node_modules/\n.env\n", "utf8");
  egal(statutFlux(verifier(b.produit, b.opt), "RP6", "coffre"), "PASS", "RP6 après le remède");
  garder(synchroniser(b.produit, "restaurer", b.opt));
  egal(valeursDe(b.envPoste).B, k, "la clé B arrive une fois le fichier ignoré");
  // `stats/.env` : le .gitignore ne couvre qu'un .env à la racine, et le dossier stats/ n'existe pas sur ce poste
  const s = bancCoffre({ cles: ["S"], gitignore: "/.env\n", fichiers: ["stats/.env"] });
  ecrire(join(s.coffre, "stats", ".env"), texteEnv([["S", k]]));
  const rs = garder(synchroniser(s.produit, "restaurer", s.opt));
  if (!/n'est PAS ignoré par git/.test(rs.secrets.fichiers[0].refus || "")) throw new Error("le fichier qui naîtrait non ignoré n'est pas refusé : " + JSON.stringify(rs.secrets));
  if (existsSync(join(s.produit, "stats"))) throw new Error("un dossier est né pour un fichier refusé");
  writeFileSync(join(s.produit, ".gitignore"), "/.env\nstats/.env\n", "utf8");
  garder(synchroniser(s.produit, "restaurer", s.opt));
  egal(valeursDe(join(s.produit, "stats", ".env")).S, k, "stats/.env naît du coffre une fois couvert");
  egal(s.visibles().filter((x) => x !== ".gitignore").length, 0, "git ne voit pas stats/.env");
});

check("D-224 rouge — RP9, le cas mesuré du 20/11 (M-09) : poste et coffre égaux à 2 clés, 2 clés exigées manquent ; l'égalité (RP4) passe et RP9 FAIL les nomme ; remède joué : les clés rangées sur le poste, puis l'envoi de fin de tour, RP9 PASS", () => {
  const texte = texteEnv([["BASE_URL", valeur("u")], ["DEPLOI_TOKEN", valeur("w")]]);
  const b = bancCoffre({ poste: texte, coffre: texte, cles: ["BASE_URL", "DEPLOI_TOKEN", "PAGE_ID", "PUBLICATION_TOKEN"] });
  const v = garder(verifier(b.produit, b.opt));
  egal(statutFlux(v, "RP4", "coffre"), "PASS", "RP4 : les deux copies sont égales");
  egal(statut(v, "RP9"), "FAIL", "RP9");
  if (!/PAGE_ID, PUBLICATION_TOKEN/.test(message(v, "RP9")) || !/ni au poste ni au coffre/.test(message(v, "RP9"))) throw new Error("RP9 ne nomme pas les 2 clés manquantes : " + message(v, "RP9"));
  egal(v.verdict, "FAIL", "verdict");
  ecrire(b.envPoste, texte + "PAGE_ID=\n");
  if (!/PAGE_ID \(vide\)/.test(message(verifier(b.produit, b.opt), "RP9"))) throw new Error("une clé vide n'est pas dite vide");
  // le remède : les clés rangées sur ce poste (le geste de forge/ranger-secret.mjs), puis l'envoi de fin de tour
  ecrire(b.envPoste, texte + texteEnv([["PAGE_ID", valeur("m")], ["PUBLICATION_TOKEN", valeur("p")]]));
  const avantEnvoi = garder(verifier(b.produit, b.opt));
  egal(statut(avantEnvoi, "RP9"), "FAIL", "RP9 tant que le coffre ne les a pas");
  if (!/au coffre, présentes au poste : PAGE_ID, PUBLICATION_TOKEN/.test(message(avantEnvoi, "RP9"))) throw new Error("RP9 ne dit pas que le coffre attend l'envoi : " + message(avantEnvoi, "RP9"));
  garder(synchroniser(b.produit, "pousser", b.opt));
  const apres = garder(verifier(b.produit, b.opt));
  egal(statut(apres, "RP9"), "PASS", "RP9 après l'envoi");
  egal(apres.verdict, "PASS", "verdict");
});

check("D-224 rouge — RP10 : une mémoire et un coffre au nom neutre DANS le canal, sous un élément copié, FAIL, et le canal copie vraiment la mémoire ; le coffre SECRETS exclu par son nom et l'exclusion déclarée lèvent le rouge ; coffre égal au canal, coffre dans la mémoire : FAIL", () => {
  const b = bancCoffre({ poste: texteEnv([["A", valeur("p")]]), cles: ["A"], memoire: true, elements: ["partage"], gitignore: ".env\n.env.*\npartage/\n" });
  const memDansCanal = join(b.canal, "partage", "MEMOIRE-CLAUDE"), coffreNeutre = join(b.canal, "partage", "COFFRE");
  ecrire(join(memDansCanal, "MEMORY.md"), "- note\n");
  mkdirSync(coffreNeutre, { recursive: true });
  const s = lireBanc(b).secrets;
  manifeste(b, { secrets: { ...s, chemins: [coffreNeutre] }, memoire: { chemins: [memDansCanal] } });
  const v = garder(verifier(b.produit, b.opt));
  egal(statut(v, "RP10"), "FAIL", "RP10");
  if (!/la mémoire \(« partage\/MEMOIRE-CLAUDE »/.test(message(v, "RP10")) || !/le coffre \(« partage\/COFFRE »/.test(message(v, "RP10"))) throw new Error("RP10 ne nomme pas les deux dossiers : " + message(v, "RP10"));
  garder(synchroniser(b.produit, "restaurer", b.opt));
  if (!existsSync(join(b.produit, "partage", "MEMOIRE-CLAUDE", "MEMORY.md"))) throw new Error("le canal n'a pas copié la mémoire : le rouge ne prouverait rien");
  const coffreSecrets = join(b.canal, "partage", "SECRETS");
  mkdirSync(coffreSecrets, { recursive: true });
  manifeste(b, { secrets: { ...s, chemins: [coffreSecrets] }, exclusions: ["MEMOIRE-CLAUDE"] });
  egal(statut(verifier(b.produit, b.opt), "RP10"), "PASS", "RP10 : SECRETS exclu par son nom, la mémoire par « exclusions »");
  manifeste(b, { secrets: s, memoire: { chemins: [b.memoire] }, exclusions: [] });
  egal(statut(verifier(b.produit, b.opt), "RP10"), "PASS", "RP10 : la disposition du gabarit, trois dossiers voisins");
  manifeste(b, { secrets: { ...s, chemins: [b.canal] } });
  if (!/le canal lui-même/.test(message(verifier(b.produit, b.opt), "RP10"))) throw new Error("le coffre posé sur le canal n'est pas refusé");
  manifeste(b, { secrets: { ...s, chemins: [join(b.memoire, "SECRETS")] } });
  if (!/se contiennent/.test(message(verifier(b.produit, b.opt), "RP10"))) throw new Error("le coffre logé dans la mémoire n'est pas refusé");
});

check("D-224 — un manifeste sans « secrets » ni « memoire » se comporte comme avant : ni coffre ni mémoire au compte rendu, aucun constat de flux, ni RP9 ni RP10, aucun état neuf, la ligne du hook inchangée", () => {
  const b = banc({ envoi: GO, elements: ["input"] });
  ecrire(join(b.canal, "input", "a.txt"), "donnée du canal");
  const v = verifier(b.produit, b.opt);
  if (v.findings.some((f) => f.flux || f.regle === "RP9" || f.regle === "RP10")) throw new Error("un constat de flux est apparu : " + JSON.stringify(v.findings));
  egal(v.findings.map((f) => f.regle).join(","), "RP1,RP2,RP3,RP4,RP6,RP5", "règles jugées");
  const h = spawnSync(process.execPath, [HOOK, "--restaurer"], { cwd: b.produit, input: "", encoding: "utf8", env: { ...process.env, REPRISE_ETAT: b.opt.etat } });
  egal(h.status, 0, "hook");
  egal(h.stdout.trim().split("\n").length, 1, "une seule ligne, celle du canal");
  if (!/^\[reprise — R-64\] restauration depuis le canal : 1 fichier\(s\) restauré\(s\) — canal /.test(h.stdout)) throw new Error("ligne du hook changée : " + h.stdout);
  const r = synchroniser(b.produit, "pousser", b.opt);
  for (const k of ["secrets", "memoire"]) if (k in r) throw new Error(`le compte rendu porte « ${k} »`);
  egal(readdirSync(b.opt.etat).filter((x) => /-(secrets|memoire)\.json$/.test(x)).length, 0, "aucun état de flux écrit");
});

check("D-224 — mémoire Claude : la note d'un poste passe à l'autre, l'index MEMORY.md en conflit prend l'union de ses lignes, une note au nom de secret reste au poste ; le profil de la session (CLAUDE_CONFIG_DIR) est celui qu'on synchronise ; RP4 mémoire rouge puis vert", () => {
  const a = valeur("ma");
  const b = bancCoffre({ poste: texteEnv([["A", a]]), coffre: texteEnv([["A", a]]), cles: ["A"], memoire: true });
  const local = dossierMemoireLocal(b.produit, b.opt.profil);
  if (!local.startsWith(join(b.opt.profil, "projects"))) throw new Error("la mémoire jugée n'est pas celle du profil de la recette : " + local);
  ecrire(join(local, "MEMORY.md"), "- [Note A](note-a.md) — de ce poste\n", new Date(Date.now() - 3600e3));
  ecrire(join(local, "note-a.md"), "contenu A\n");
  ecrire(join(local, "mot-de-passe-du-poste.md"), "note locale\n");
  ecrire(join(b.memoire, "MEMORY.md"), "- [Note B](note-b.md) — de l'autre poste\n", new Date());
  ecrire(join(b.memoire, "note-b.md"), "contenu B\n");
  egal(statutFlux(garder(verifier(b.produit, b.opt)), "RP4", "memoire"), "FAIL", "RP4 mémoire avant l'ouverture");
  const r = garder(synchroniser(b.produit, "restaurer", b.opt));
  egal(readFileSync(join(local, "note-b.md"), "utf8"), "contenu B\n", "la note de l'autre poste arrive");
  const index = readFileSync(join(local, "MEMORY.md"), "utf8");
  if (!index.includes("(note-a.md)") || !index.includes("(note-b.md)")) throw new Error("l'index n'a pas l'union des deux côtés : " + index);
  egal(r.memoire.unions.join(","), "MEMORY.md", "union déclarée");
  if (!r.memoire.exclus.includes("mot-de-passe-du-poste.md")) throw new Error("la note au nom de secret n'est pas déclarée écartée : " + JSON.stringify(r.memoire.exclus));
  egal(statutFlux(verifier(b.produit, b.opt), "RP4", "memoire"), "PASS", "RP4 mémoire après l'ouverture");
  garder(synchroniser(b.produit, "pousser", b.opt));
  egal(readFileSync(join(b.memoire, "note-a.md"), "utf8"), "contenu A\n", "la note du poste part");
  if (!readFileSync(join(b.memoire, "MEMORY.md"), "utf8").includes("(note-a.md)")) throw new Error("l'index fusionné n'est pas parti");
  if (existsSync(join(b.memoire, "mot-de-passe-du-poste.md"))) throw new Error("une note au nom de secret est partie");
  // un second profil, désigné par CLAUDE_CONFIG_DIR comme le fait la session qui le charge : le hook restaure dans le sien
  const profilB = join(b.d, "profil-b");
  const h = hookCoffre(b, "--restaurer", { CLAUDE_CONFIG_DIR: profilB });
  garder(h.stdout + h.stderr);
  const localB = dossierMemoireLocal(b.produit, profilB);
  egal(readFileSync(join(localB, "note-a.md"), "utf8"), "contenu A\n", "profil B : note A");
  egal(readFileSync(join(localB, "note-b.md"), "utf8"), "contenu B\n", "profil B : note B");
  if (!/mémoire Claude : 3 fichier\(s\) restauré\(s\)/.test(h.stdout) || !h.stdout.includes("CLAUDE_CONFIG_DIR=")) throw new Error("la ligne du hook ne dit pas la restauration ni le profil : " + h.stdout);
});

check("D-224 rouge — RP1 : sections « secrets » et « memoire » mal formées ; une entrée de « cles_attendues » qui n'est pas un nom est désignée par son rang, jamais recopiée ; remède : la forme du gabarit, RP1 PASS", () => {
  const b = bancCoffre({ cles: ["A"], memoire: true });
  const s = lireBanc(b).secrets;
  manifeste(b, { secrets: { ...s, cles_attendues: ["API_KEY", `TOKEN=${valeur("collee")}`] } });
  const v = garder(verifier(b.produit, b.opt));
  egal(statut(v, "RP1"), "FAIL", "RP1 entrée qui n'est pas un nom");
  if (!/l'entrée n° 2/.test(message(v, "RP1"))) throw new Error("l'entrée fautive n'est pas désignée par son rang");
  for (const [quoi, secrets, memoire] of [
    ["fichier qui n'est pas d'environnement", { ...s, fichiers: ["config/credentials.json"] }],
    ["modèle versionné", { ...s, fichiers: [".env.example"] }],
    ["chemin absolu", { ...s, fichiers: ["C:/ailleurs/.env"] }],
    ["sans clé attendue", { ...s, cles_attendues: [] }],
    ["sans emplacement du coffre", { ...s, chemins: [] }],
    ["mémoire sans emplacement", s, {}],
  ]) {
    manifeste(b, { secrets, memoire });
    egal(statut(verifier(b.produit, b.opt), "RP1"), "FAIL", `RP1 ${quoi}`);
    if (!garder(synchroniser(b.produit, "restaurer", b.opt)).erreur) throw new Error(`la synchronisation accepte un manifeste mal formé (${quoi})`);
  }
  manifeste(b, { secrets: s, memoire: { chemins: [b.memoire] } });
  egal(statut(verifier(b.produit, b.opt), "RP1"), "PASS", "RP1 au gabarit");
});

check("D-224 rouge — le coffre sous le pilot, dans le produit ou dans un dépôt git est refusé, rien n'est écrit, RP6 FAIL ; un produit logé sous le pilot voit son fichier refusé (dansLePilot) ; remède : un dossier du Drive, RP6 PASS", () => {
  const k = valeur("garde");
  const b = bancCoffre({ poste: texteEnv([["A", k]]), cles: ["A"] });
  const s = lireBanc(b).secrets;
  const piloteFaux = join(b.d, "pilot");
  ecrire(join(piloteFaux, "gabarits", "HERITAGE.json"), "{}");
  const depot = join(b.d, "depot-tiers");
  mkdirSync(depot, { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: depot, env: sansGit() });
  for (const [quoi, chemin, motif] of [
    ["sous le pilot", join(piloteFaux, "SECRETS"), /sous le pilot/],
    ["dans le produit", join(b.produit, "forge", "SECRETS"), /dans le produit/],
    ["dans un dépôt git", join(depot, "SECRETS"), /dépôt git/],
  ]) {
    manifeste(b, { secrets: { ...s, chemins: [chemin] } });
    const r = garder(synchroniser(b.produit, "pousser", b.opt));
    if (!motif.test(r.secrets.refus || "")) throw new Error(`${quoi} : ${JSON.stringify(r.secrets)}`);
    if (existsSync(join(chemin, ".env"))) throw new Error(`${quoi} : un secret a été écrit`);
    egal(statutFlux(verifier(b.produit, b.opt), "RP6", "coffre"), "FAIL", `RP6 ${quoi}`);
  }
  manifeste(b, { secrets: s });
  egal(statutFlux(verifier(b.produit, b.opt), "RP6", "coffre"), "PASS", "RP6 sur le Drive");
  const sous = join(piloteFaux, "produit-sous-le-pilot");
  ecrire(join(sous, "forge", "REPRISE.json"), JSON.stringify({ schema: "factory/reprise@1", canal: { chemins: [b.canal] }, elements: ["input"], secrets: { fichiers: [".env"], chemins: [b.coffre], cles_attendues: ["A"] } }));
  ecrire(join(sous, ".env"), texteEnv([["A", k]]));
  const rs = garder(synchroniser(sous, "restaurer", { etat: join(b.d, "etat-sous"), profil: b.opt.profil }));
  if (!/sous le pilot/.test(rs.secrets.fichiers[0].refus || "")) throw new Error("le fichier d'un produit sous le pilot n'est pas refusé : " + JSON.stringify(rs.secrets));
});

check("D-224 rouge — sans feu vert de publication, rien ne part au coffre ni à la mémoire, et l'ouverture n'écrit que le poste ; remède : le feu vert consigné, l'envoi passe", () => {
  const [a, c] = [valeur("a"), valeur("c")];
  const b = bancCoffre({ poste: texteEnv([["A", a]]), coffre: texteEnv([["C", c]]), cles: ["A", "C"], envoi: { actif: false }, memoire: true });
  ecrire(join(dossierMemoireLocal(b.produit, b.opt.profil), "note.md"), "note du poste\n");
  if (!garder(synchroniser(b.produit, "pousser", b.opt)).refuse) throw new Error("l'envoi sans feu vert est parti");
  egal(JSON.stringify(valeursDe(b.envCoffre)), JSON.stringify({ C: c }), "coffre intact");
  if (existsSync(join(b.memoire, "note.md"))) throw new Error("une note est partie sans feu vert");
  garder(synchroniser(b.produit, "restaurer", b.opt));
  egal(JSON.stringify(valeursDe(b.envPoste)), JSON.stringify({ A: a, C: c }), "le poste reçoit C");
  egal(JSON.stringify(valeursDe(b.envCoffre)), JSON.stringify({ C: c }), "l'ouverture n'écrit pas le coffre");
  if (!/le coffre et la mémoire ne reçoivent rien/.test(message(verifier(b.produit, b.opt), "RP5"))) throw new Error("RP5 ne dit pas que le coffre et la mémoire attendent");
  manifeste(b, { envoi: GO });
  garder(synchroniser(b.produit, "pousser", b.opt));
  egal(readFileSync(b.envCoffre, "utf8"), readFileSync(b.envPoste, "utf8"), "le coffre reçoit A sous le feu vert");
  egal(readFileSync(join(b.memoire, "note.md"), "utf8"), "note du poste\n", "la note part sous le feu vert");
});

check("D-224 rouge — poste neuf : le fichier d'environnement naît du coffre, git ne le voit pas ; un coffre absent dont le parent existe naît au premier envoi (RP3 PASS, RP9 rouge puis vert) ; un coffre introuvable : RP3 FAIL nomme les emplacements", () => {
  const [a, b2] = [valeur("a"), valeur("b")];
  const b = bancCoffre({ coffre: texteEnv([["A", a], ["B", b2]]), cles: ["A", "B"] });
  garder(synchroniser(b.produit, "restaurer", b.opt));
  egal(JSON.stringify(valeursDe(b.envPoste)), JSON.stringify({ A: a, B: b2 }), "le .env du poste naît du coffre");
  egal(b.visibles().length, 0, "fichiers non suivis visibles à git status");
  const c = bancCoffre({ poste: texteEnv([["A", a]]), cles: ["A"] });
  rmSync(c.coffre, { recursive: true, force: true });
  const v = garder(verifier(c.produit, c.opt));
  egal(statutFlux(v, "RP3", "coffre"), "PASS", "RP3 coffre à naître");
  if (!/naît au premier envoi/.test(messageFlux(v, "RP3", "coffre"))) throw new Error("RP3 ne dit pas que le coffre naît au premier envoi");
  egal(statut(v, "RP9"), "FAIL", "RP9 : le coffre n'a pas la clé");
  garder(synchroniser(c.produit, "pousser", c.opt));
  egal(valeursDe(c.envCoffre).A, a, "le coffre est né avec la clé");
  egal(statut(verifier(c.produit, c.opt), "RP9"), "PASS", "RP9 après l'envoi");
  manifeste(c, { secrets: { ...lireBanc(c).secrets, chemins: [join(c.d, "nulle-part", "x", "SECRETS")] } });
  const v2 = verifier(c.produit, c.opt);
  egal(statutFlux(v2, "RP3", "coffre"), "FAIL", "RP3 coffre introuvable");
  if (!/nulle-part/.test(messageFlux(v2, "RP3", "coffre"))) throw new Error("RP3 ne nomme pas l'emplacement essayé");
});

check("D-224 — un fichier d'environnement écrit avec un BOM (éditeur Windows) se fusionne : sa première clé n'est pas prise pour une ligne mal formée", () => {
  const [a, c] = [valeur("bom-a"), valeur("bom-c")];
  const b = bancCoffre({ poste: String.fromCharCode(0xfeff) + texteEnv([["A", a]]), coffre: texteEnv([["C", c]]), cles: ["A", "C"] });
  const f = garder(synchroniser(b.produit, "restaurer", b.opt)).secrets.fichiers[0];
  egal(f.refus, undefined, "aucun refus");
  egal(JSON.stringify(valeursDe(b.envPoste)), JSON.stringify({ A: a, C: c }), "la première clé et la clé du coffre");
});

check("D-224 — JAMAIS UNE VALEUR : aucune valeur de fixture n'apparaît dans ce que l'outil a rendu (comptes rendus, constats, lignes du hook à l'ouverture et en fin de tour, ligne de commande, refus d'une valeur sur plusieurs lignes, états)", () => {
  const [s1, s2, s3] = [valeur("s1"), valeur("s2"), valeur("s3")];
  const b = bancCoffre({ poste: texteEnv([["SECRET_X", s1], ["COMMUN", s3]]), coffre: texteEnv([["SECRET_Y", s2], ["COMMUN", s3]]), cles: ["SECRET_X", "SECRET_Y", "ABSENTE"] });
  const h1 = hookCoffre(b, "--restaurer");
  garder(h1.stdout + h1.stderr);
  if (!/coffre de secrets : \.env : 1 clé\(s\) reçue\(s\) du coffre \(SECRET_Y\)/.test(h1.stdout)) throw new Error("la ligne d'ouverture ne nomme pas la clé reçue : " + h1.stdout);
  const h2 = hookCoffre(b, "--pousser");
  garder(h2.stdout + h2.stderr);
  if (!/1 clé\(s\) envoyée\(s\) au coffre \(SECRET_X\)/.test(h2.stderr)) throw new Error("la ligne de fin de tour ne nomme pas la clé envoyée : " + h2.stderr);
  const cli = cliOracle(b);
  garder(cli.stdout + cli.stderr);
  if (!/ABSENTE/.test(cli.stdout)) throw new Error("le juge en ligne de commande ne nomme pas la clé attendue absente");
  const suite = valeur("suite");
  ecrire(b.envPoste, readFileSync(b.envPoste, "utf8") + `MULTI="${valeur("debut")}\n${suite}"\n`);
  const rm = garder(synchroniser(b.produit, "restaurer", b.opt));
  if (!/ligne\(s\) \d/.test(rm.secrets.fichiers[0].refus || "")) throw new Error("la valeur sur plusieurs lignes n'est pas refusée par numéro de ligne");
  garder(verifier(b.produit, b.opt));
  garder(cliOracle(b, "--restaurer").stdout);
  for (const nom of readdirSync(b.opt.etat)) if (statSync(join(b.opt.etat, nom)).isFile()) garder(readFileSync(join(b.opt.etat, nom), "utf8"));
  // la ligne de REFUS du hook sur un conflit sans base : elle nomme la clé et la commande du choix, jamais les deux valeurs
  const k = bancCoffre({ poste: texteEnv([["JETON", valeur("poste")]]), coffre: texteEnv([["JETON", valeur("coffre")]]), cles: ["JETON"] });
  const h3 = hookCoffre(k, "--restaurer");
  garder(h3.stdout + h3.stderr);
  if (!/\.env : REFUS — .*JETON.*--prefere JETON:poste/.test(h3.stdout)) throw new Error("la ligne d'ouverture ne dit pas le refus du conflit : " + h3.stdout);
  if (VALEURS.length < 30 || SORTIES.length < 40) throw new Error(`banc trop maigre pour prouver une absence : ${VALEURS.length} valeurs, ${SORTIES.length} sorties`);
  const fuitesDans = (sorties) => VALEURS.filter((v) => sorties.some((x) => x.includes(v)));
  // le témoin rouge : une fuite plantée dans une copie des sorties est vue, sans quoi l'absence ne prouverait rien
  egal(fuitesDans([...SORTIES, `compte rendu ${VALEURS[VALEURS.length - 1]}`]).length, 1, "fuite plantée vue par le détecteur");
  egal(fuitesDans(SORTIES).length, 0, `valeurs de fixture retrouvées dans les sorties (sur ${VALEURS.length} valeurs et ${SORTIES.length} sorties)`);
});

console.log(`\noracle-reprise : ${pass} PASS, ${fail} FAIL — couverture à double sens : 9 cas rouges joués (RP1, RP2, RP3, RP4, RP5, RP6, RP7, RP8 et l'envoi refusé), chacun avec son remède vert ; D-224 (a), coffre et mémoire : 9 cas rouges de plus (conflit sans base, fichier non ignoré par git, RP9, RP10, RP1 des sections, garde du coffre, envoi sans feu vert, RP3 et RP4 du coffre et de la mémoire), chacun avec son remède joué, et aucune valeur de fixture dans aucune sortie`);
process.exit(fail ? 1 : 0);
