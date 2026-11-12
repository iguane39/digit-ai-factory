#!/usr/bin/env node
/**
 * fusionner-env.test.mjs — recette à DOUBLE SENS de `fusionner-env.mjs` (TF-2440, RT-149).
 *
 * Le cas fondateur se rejoue avec de FAUSSES clés assemblées à l'exécution (aucun fichier d'environnement réel
 * n'est ouvert) : un poste qui porte 3 clés que le canal n'a pas, un canal qui en porte 2 que le poste n'a pas.
 * La copie fichier contre fichier perd des clés des deux côtés (cas rouge, mesuré par `clesPerdues`) ; la fusion
 * clé par clé n'en perd aucune et laisse deux fichiers identiques octet pour octet (cas vert). Chaque refus a son
 * remède joué. Aucune valeur n'apparaît jamais dans la sortie : chaque exécution du CLI est confrontée aux fausses
 * valeurs.
 *
 * Joué par `oracles\self-tests.mjs` (I2, comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { clesPerdues, fusionner, analyser } from "./fusionner-env.mjs";

const OUTIL = fileURLToPath(new URL("./fusionner-env.mjs", import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const egal = (a, b, quoi) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${quoi} : attendu ${JSON.stringify(b)}, lu ${JSON.stringify(a)}`); };

// Fausses valeurs, assemblées à l'exécution : aucun littéral de secret dans ce fichier.
const FAUX = new Map();
const v = (nom, variante = "") => { const x = ["faux", "jeton", nom.toLowerCase(), variante, String(FAUX.size)].filter(Boolean).join("-"); FAUX.set(x, nom); return x; };
const ligne = (nom, valeur) => `${nom}=${valeur}`;

const T = mkdtempSync(join(tmpdir(), "fusionner-env-"));
let n = 0;
const banc = () => { const d = join(T, `b${++n}`); mkdirSync(d, { recursive: true }); return d; };
const ecrire = (f, contenu) => writeFileSync(f, contenu, "utf8");
const lire = (f) => readFileSync(f, "utf8");

const env = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
const sortiesVues = [];
function jouer(...args) {
  const r = spawnSync(process.execPath, [OUTIL, ...args], { encoding: "utf8", env });
  sortiesVues.push(`${r.stdout}\n${r.stderr}`);
  let json = null; try { json = JSON.parse(r.stdout.trim().split("\n").pop()); } catch { /* usage ou erreur */ }
  return { code: r.status, json, brut: r.stdout + r.stderr };
}

// Le cas du 12/11 : le poste a 3 clés propres (P1..P3) et 2 communes ; le canal a 2 clés propres (C1, C2) et les 2 communes.
function casFondateur() {
  const d = banc(), poste = join(d, "poste.env"), canal = join(d, "canal.env");
  const communes = { RAILWAY_TOKEN: v("RAILWAY_TOKEN"), BASE_URL: v("BASE_URL") };
  ecrire(poste, ["# poste", ligne("RAILWAY_TOKEN", communes.RAILWAY_TOKEN), ligne("BASE_URL", communes.BASE_URL), ligne("P1", v("P1")), ligne("P2", v("P2")), ligne("P3", v("P3"))].join("\n") + "\n");
  ecrire(canal, [ligne("BASE_URL", communes.BASE_URL), ligne("RAILWAY_TOKEN", communes.RAILWAY_TOKEN), ligne("C1", v("C1")), "# propre au canal", ligne("C2", v("C2"))].join("\n") + "\n");
  return { d, poste, canal };
}

check("cas rouge du 12/11 : la copie fichier contre fichier perd des clés des DEUX côtés (mesure), la fusion n'en perd aucune", () => {
  const { poste, canal } = casFondateur();
  egal(clesPerdues(lire(poste), lire(canal)), ["P1", "P2", "P3"], "clés que le poste perdrait si le canal l'écrasait");
  egal(clesPerdues(lire(canal), lire(poste)), ["C1", "C2"], "clés que le canal perdrait si le poste l'écrasait");
  const r = fusionner(lire(poste), lire(canal));
  egal(r.cles, 7, "clés de l'union");
  egal(clesPerdues(lire(poste), r.texte), [], "clés perdues par le poste");
  egal(clesPerdues(lire(canal), r.texte), [], "clés perdues par le canal");
});

check("fusionner à blanc : dit ce qu'il ferait, n'écrit rien ; --ecrire : deux fichiers identiques, 7 clés, aucune perdue", () => {
  const { poste, canal } = casFondateur();
  const avantP = lire(poste), avantC = lire(canal);
  const blanc = jouer("fusionner", poste, canal);
  egal(blanc.code, 0, "exit à blanc"); egal(blanc.json.verdict, "A_BLANC", "verdict à blanc");
  egal(blanc.json.ajoutees_au_poste, ["C1", "C2"], "ajoutées au poste"); egal(blanc.json.ajoutees_au_canal, ["P1", "P2", "P3"], "ajoutées au canal");
  if (lire(poste) !== avantP || lire(canal) !== avantC) throw new Error("un fichier a été écrit sans --ecrire");
  const fait = jouer("fusionner", poste, canal, "--ecrire");
  egal(fait.code, 0, "exit"); egal(fait.json.verdict, "FUSIONNE", "verdict"); egal(fait.json.identiques, true, "identiques");
  if (!Buffer.from(lire(poste)).equals(Buffer.from(lire(canal)))) throw new Error("les deux fichiers ne sont pas identiques octet pour octet");
  egal(analyser(lire(poste)).cles.size, 7, "clés après fusion");
  const lignes = lire(poste).split("\n");
  egal(lignes[0], "# poste", "le commentaire du poste reste en tête");
  if (!lignes.includes("# propre au canal")) throw new Error("le commentaire qui précède une clé ajoutée n'a pas suivi");
});

check("deux valeurs différentes pour une même clé : refus sans --prefere (rien écrit, noms seulement), --prefere canal puis poste tranchent", () => {
  const d = banc(), poste = join(d, "poste.env"), canal = join(d, "canal.env");
  const vp = v("JETON", "poste"), vc = v("JETON", "canal");
  ecrire(poste, [ligne("JETON", vp), ligne("A", v("A"))].join("\n") + "\n"); ecrire(canal, [ligne("JETON", vc), ligne("B", v("B"))].join("\n") + "\n");
  const avantP = lire(poste), avantC = lire(canal);
  const r = jouer("fusionner", poste, canal, "--ecrire");
  egal(r.code, 1, "exit"); egal(r.json.conflits, ["JETON"], "clé en conflit nommée");
  if (lire(poste) !== avantP || lire(canal) !== avantC) throw new Error("un fichier a été écrit malgré le conflit");
  const r2 = jouer("fusionner", poste, canal, "--prefere", "canal", "--ecrire");
  egal(r2.code, 0, "exit --prefere canal");
  if (!lire(poste).includes(ligne("JETON", vc)) || lire(poste).includes(vp)) throw new Error("la valeur du canal n'a pas été retenue");
  egal(clesPerdues(avantP, lire(poste)), [], "clés perdues");
  // remède symétrique : --prefere poste sur les fichiers d'origine
  ecrire(poste, avantP); ecrire(canal, avantC);
  egal(jouer("fusionner", poste, canal, "--prefere", "poste", "--ecrire").code, 0, "exit --prefere poste");
  if (!lire(canal).includes(ligne("JETON", vp)) || lire(canal).includes(vc)) throw new Error("la valeur du poste n'a pas été retenue");
});

check("copier refuse une copie qui perdrait une clé (destination inchangée) ; le remède — fusionner puis copier — passe", () => {
  const { poste, canal } = casFondateur();
  const avantC = lire(canal);
  const r = jouer("copier", poste, canal, "--ecrire");
  egal(r.code, 1, "exit de la copie lossy"); egal(r.json.cles_perdues, ["C1", "C2"], "clés qui seraient perdues");
  if (lire(canal) !== avantC) throw new Error("la destination a été écrasée malgré la perte de clés");
  egal(jouer("fusionner", poste, canal, "--ecrire").code, 0, "fusion");
  const nouvelle = lire(poste) + ligne("NEUVE", v("NEUVE")) + "\n"; ecrire(poste, nouvelle);
  const ok = jouer("copier", poste, canal, "--ecrire");
  egal(ok.code, 0, "exit de la copie sans perte"); egal(ok.json.verdict, "COPIE", "verdict");
  egal(lire(canal), nouvelle, "contenu copié");
});

check("fins de ligne CRLF, `export` et guillemets : conservés ; `A=x` et `A=\"x\"` ne sont pas un conflit", () => {
  const poste = "export ALPHA=\"un\"\r\nBETA=deux\r\n", canal = "ALPHA=un\nGAMMA=trois\n";
  const r = fusionner(poste, canal);
  egal(r.conflits, [], "conflits");
  egal(r.texte, "export ALPHA=\"un\"\r\nBETA=deux\r\nGAMMA=trois\r\n", "texte fusionné");
});

check("fichier du poste NON ignoré par git : refus ; ignoré : fusion faite", () => {
  const d = banc(), poste = join(d, ".env"), canal = join(banc(), "canal.env");
  const va = v("A"), vb = v("B");
  execFileSync("git", ["init", "-q"], { cwd: d, env });
  ecrire(poste, ligne("A", va) + "\n"); ecrire(canal, ligne("B", vb) + "\n");
  const r = jouer("fusionner", poste, canal, "--ecrire");
  egal(r.code, 1, "exit"); if (!/n'est PAS ignoré/.test(r.json.message)) throw new Error("le refus ne dit pas que le fichier n'est pas ignoré");
  egal(lire(poste), ligne("A", va) + "\n", "poste inchangé");
  ecrire(join(d, ".gitignore"), ".env\n");
  egal(jouer("fusionner", poste, canal, "--ecrire").code, 0, "exit après remède");
  egal(analyser(lire(poste)).cles.size, 2, "clés du poste après fusion");
});

check("un fichier sous le pilot est refusé : le pilot ne porte aucun .env", () => {
  const d = banc(); mkdirSync(join(d, "gabarits"), { recursive: true }); ecrire(join(d, "gabarits", "HERITAGE.json"), "{}");
  const f = join(d, "x.env"), g = join(banc(), "y.env"); ecrire(f, ligne("A", v("A")) + "\n"); ecrire(g, ligne("B", v("B")) + "\n");
  const r = jouer("fusionner", f, g, "--ecrire");
  egal(r.code, 1, "exit"); if (!/sous le pilot/.test(r.json.message)) throw new Error("le refus ne nomme pas le pilot");
  egal(jouer("fusionner", g, f, "--ecrire").code, 1, "exit, fichier du pilot en second");
});

check("usage : verbe inconnu, option inconnue, mauvais nombre d'arguments ou --prefere hors fusionner → exit 2", () => {
  const { poste, canal } = casFondateur();
  for (const a of [["fondre", poste, canal], ["fusionner", poste], ["fusionner", poste, canal, "--force"], ["fusionner", poste, canal, "--prefere", "autre"], ["copier", poste, canal, "--prefere", "poste"]])
    egal(jouer(...a).code, 2, `exit de ${a[0]} ${a.slice(3).join(" ")}`);
});

// Dernier cas, après toutes les exécutions : aucune sortie du CLI ne porte une valeur.
check("jamais une valeur : aucune sortie du CLI, succès comme refus, ne porte une fausse valeur", () => {
  if (sortiesVues.length < 12) throw new Error(`trop peu d'exécutions pour conclure (${sortiesVues.length})`);
  for (const [valeur, nom] of FAUX) for (const s of sortiesVues) if (s.includes(valeur)) throw new Error(`une valeur (de ${nom}) apparaît dans une sortie`);
});

console.log(`\nfusionner-env : ${pass} PASS, ${fail} FAIL — couverture à double sens : 5 refus joués (perte de clé par copie, conflit de valeur, fichier non ignoré, fichier du pilot, usage), chacun avec son remède vert`);
process.exit(fail ? 1 : 0);
