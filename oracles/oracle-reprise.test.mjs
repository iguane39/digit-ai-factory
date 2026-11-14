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
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, utimesSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { verifier, synchroniser, estExclu } from "./oracle-reprise.mjs";

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

console.log(`\noracle-reprise : ${pass} PASS, ${fail} FAIL — couverture à double sens : 7 cas rouges joués (RP1, RP2, RP3, RP4, RP5, RP6 et l'envoi refusé), chacun avec son remède vert`);
process.exit(fail ? 1 : 0);
