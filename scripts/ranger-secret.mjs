#!/usr/bin/env node
/**
 * ranger-secret.mjs — RANGER UN SECRET REÇU EN SESSION DANS LE FICHIER D'ENVIRONNEMENT LOCAL DU PRODUIT
 * (TF-2127, D-167 (a) du 04/11/2026). Copié chez chaque produit sous `forge\ranger-secret.mjs`
 * (gabarits\HERITAGE.json, copie conforme) ; le même fichier se joue aussi depuis le pilot.
 *
 *   <valeur sur l'entrée standard> | node forge/ranger-secret.mjs NOM_DE_LA_VARIABLE [--produit <dossier>] [--fichier .env.local]
 *
 * LA DÉCISION HUMAINE (D-167 (a)) : « Un geste du socle produit range un secret reçu en session dans le fichier
 * d'environnement local du produit, ignoré par git, et consigne au ledger son nom et son empreinte, jamais sa valeur. »
 *
 * LE FAIT (lot Produit-86 20261103d, RP-5). Une clé d'API collée le 03/11 à 09:24 dans une session manquait au produit à
 * 21:31 : rien ne l'avait rangée, la session suivante l'a retrouvée en relisant une transcription. Un secret qui n'a
 * pas de geste pour le ranger reste dans la conversation, seul endroit où personne ne le cherche et où il ne devrait pas vivre.
 *
 * CE QUE FAIT LE GESTE, DANS CET ORDRE, ET IL S'ARRÊTE AU PREMIER REFUS AVANT D'ÉCRIRE QUOI QUE CE SOIT :
 *   1. la VALEUR se lit sur l'entrée standard, jamais en argument (un argument reste dans l'historique du shell et dans la liste
 *      des processus) ; un terminal interactif est refusé (la saisie s'afficherait) ; une valeur vide ou sur plusieurs lignes aussi ;
 *   2. le fichier visé (`.env` par défaut, à la racine du produit) est IGNORÉ par git (`git check-ignore`), sinon refus : un secret
 *      rangé dans un fichier qu'un `git add .` embarque est à un commit de l'histoire, où seule une rotation le retire ;
 *   3. le ledger du produit (`forge\ledger.jsonl`) existe et son écrivain est trouvé — `forge\ledger.py` d'un produit Python, sinon
 *      `ledger.mjs` de forge-agents, comme `reserver-decision.mjs` ; le secret n'est jamais rangé sans pouvoir être consigné ;
 *   4. la ligne `NOM=valeur` s'écrit au fichier, ou REMPLACE celle du même nom (les doublons du même nom sont retirés ; un
 *      commentaire, une autre variable, les fins de ligne du fichier restent tels quels) ;
 *   5. le ledger reçoit une entrée `secret_range` : `variable`, `fichier`, `empreinte_sha256` (sha256 de la valeur, 64 hex),
 *      `date`, `remplace`. JAMAIS la valeur. La sortie du geste non plus.
 *
 * Sortie : une ligne JSON { verdict, variable, fichier, remplace, empreinte_sha256, ledger_seq, ... } ; exit 0 = rangé ET consigné,
 * 1 = refus ou échec (message, sans la valeur), 2 = usage.
 *
 * CE QUE LE GESTE NE COUVRE PAS (dit, non tu) :
 *   · la valeur a déjà été écrite par l'humain dans la conversation : la commande qui la transmet (`printf '%s' '…' | node …`)
 *     la porte aussi dans la transcription de la session. Le geste évite l'historique du shell et la perte du lendemain, il n'efface
 *     pas ce que la conversation contient déjà ; une clé collée en clair se fait pivoter si la transcription sort du poste ;
 *   · l'EMPREINTE d'un secret FAIBLE (un mot de passe court) se retrouve par essais successifs, et le ledger est versionné : le geste
 *     est fait pour des jetons et des clés d'API, à haute entropie, pas pour un mot de passe que quelqu'un pourrait deviner ;
 *   · une valeur qui porte à la fois une apostrophe et un caractère que `.env` interprète (espace, #, $, guillemet, antislash) est
 *     REFUSÉE plutôt que mal citée ; une valeur sans caractère spécial s'écrit brute, sinon entre apostrophes ;
 *   · un secret déjà COMMITTÉ ou publié : le geste ne réécrit pas l'histoire, la rotation de l'identifiant reste à l'humain ;
 *   · le secret transmis à un AUTRE poste : `forge\REPRISE.json` ne porte jamais les secrets (R-64), chaque poste range le sien.
 * Recette : scripts\ranger-secret.test.mjs. Site de hachage déclaré : references\EMPREINTES.md.
 */
import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve, relative, basename, isAbsolute, sep } from "node:path";
import { homedir } from "node:os";

const args = process.argv.slice(2);
const sortie = (o, code) => { console.log(JSON.stringify({ outil: "ranger-secret", ...o })); process.exit(code); };
const valeurOption = (nom) => { const i = args.indexOf(nom); return i >= 0 && i + 1 < args.length ? args[i + 1] : null; };
const refus = (message) => sortie({ verdict: "REFUS", message }, 1);

const USAGE = "<valeur sur l'entrée standard> | node forge/ranger-secret.mjs NOM_DE_LA_VARIABLE [--produit <dossier>] [--fichier .env.local]";
const POSITIONNELS = args.filter((a, i) => !a.startsWith("--") && !["--produit", "--fichier"].includes(args[i - 1]));
if (args.includes("--aide") || args.includes("--help") || POSITIONNELS.length !== 1) sortie({ usage: USAGE }, 2);
const inconnues = args.filter((a) => a.startsWith("--") && !["--produit", "--fichier", "--aide", "--help"].includes(a));
if (inconnues.length) sortie({ verdict: "ERREUR", message: `option inconnue (non répétée ici, elle pourrait être la valeur) — ${USAGE}` }, 2);

const nom = POSITIONNELS[0];
if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(nom))
  refus("le premier argument n'est pas un nom de variable d'environnement (lettres, chiffres et _, sans commencer par un chiffre), et il n'est pas répété ici : la valeur ne se passe jamais en argument, elle se lit sur l'entrée standard");

// ---- le produit : --produit, sinon le premier dossier portant `forge/` en remontant depuis le dossier de travail
function produitDe(depart) {
  for (let d = resolve(depart); ; d = dirname(d)) {
    if (existsSync(join(d, "forge")) && !existsSync(join(d, "gabarits", "HERITAGE.json"))) return d;
    if (dirname(d) === d) return null;
  }
}
const demande = valeurOption("--produit");
const produit = demande ? resolve(demande) : produitDe(process.cwd());
if (produit && existsSync(join(produit, "gabarits", "HERITAGE.json")))
  refus("la cible est le pilot lui-même : ce geste range un secret chez un PRODUIT, le pilot n'en porte pas (.env jamais transmis)");
if (!produit || !existsSync(join(produit, "forge")))
  refus("aucun produit trouvé (pas de dossier forge/ en remontant depuis le dossier de travail) : désigner le produit avec --produit <dossier>");

// ---- le fichier d'environnement : à la racine du produit, `.env` par défaut ; jamais un modèle versionné
const fichierDemande = valeurOption("--fichier") || ".env";
const chemin = resolve(produit, fichierDemande);
const rel = relative(produit, chemin);
if (!rel || rel.startsWith("..") || isAbsolute(rel)) refus(`le fichier ${fichierDemande} n'est pas dans le produit : un secret se range chez le produit, nulle part ailleurs`);
const nomFichier = basename(chemin);
if (!/^(\.env|\.dev\.vars)(\.[A-Za-z0-9_-]+)*$/.test(nomFichier) || /\.(example|exemple)$/.test(nomFichier))
  refus(`${nomFichier} n'est pas un fichier d'environnement local (.env, .env.<nom>, .dev.vars) : un modèle .env.example est versionné, il ne reçoit jamais de valeur`);
const relPosix = rel.split(sep).join("/");

// ---- 1. la valeur, sur l'entrée standard
if (process.stdin.isTTY) refus("la valeur se lit sur l'entrée standard, pas au clavier : `<valeur> | node forge/ranger-secret.mjs NOM` (une saisie en terminal s'afficherait)");
let brut = "";
try { brut = readFileSync(0, "utf8"); } catch { brut = ""; }
const valeur = brut.replace(/\r?\n$/, "");
if (!valeur) refus("aucune valeur sur l'entrée standard : rien n'est rangé");
if (/[\r\n]/.test(valeur)) refus("la valeur tient sur plusieurs lignes : une ligne de fichier d'environnement n'en porte qu'une, rien n'est rangé");

// ---- 2. le fichier est ignoré par git (et pas suivi : un fichier suivi n'est pas ignoré)
const env = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
const ign = spawnSync("git", ["check-ignore", "-q", "--", relPosix], { cwd: produit, env, encoding: "utf8" });
if (ign.error) refus(`git est introuvable ou illisible (${ign.error.code || ign.error.message}) : l'ignorance de ${relPosix} n'est pas vérifiable, rien n'est rangé`);
if (ign.status === 1) refus(`${relPosix} n'est PAS ignoré par git : un secret rangé là serait à un commit de l'histoire. Ajouter le motif au .gitignore du produit (gabarits/gitignore-produit du pilot porte .env et .env.*), ou le retirer de l'index s'il est suivi, puis rejouer`);
if (ign.status !== 0) refus(`git check-ignore a échoué (exit ${ign.status}) : ${String(ign.stderr || "").trim().slice(0, 200) || "le dossier n'est pas un dépôt git ?"} — l'ignorance de ${relPosix} n'est pas prouvée, rien n'est rangé`);

// ---- 3. le ledger du produit et son écrivain
const ledger = join(produit, "forge", "ledger.jsonl");
if (!existsSync(ledger)) refus(`ledger du produit introuvable (${ledger}) : un produit ouvre son run avant de ranger un secret, rien n'est rangé`);
function ecrivainDeLedger() {
  const py = join(produit, "forge", "ledger.py");
  if (existsSync(py)) return { sorte: "python", chemin: py };
  const sousRacine = (r) => join(r, "digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
  const racines = [process.env.FORGE_ROOT, dirname(produit), "c:\\dev", join(homedir(), ".digit-ai-forge")].filter(Boolean);
  const mjs = racines.map(sousRacine).find((c) => existsSync(c));
  return mjs ? { sorte: "node", chemin: mjs } : null;
}
const ecrivain = ecrivainDeLedger();
if (!ecrivain) refus("écrivain du ledger introuvable : ni forge/ledger.py chez le produit, ni ledger.mjs de forge-agents (FORGE_ROOT, voisin du produit, c:\\dev) — rien n'est rangé");

// ---- 4. la ligne NOM=valeur, écrite ou remplacée
function citer(v) {
  if (/^[A-Za-z0-9_@%+=:,./~-]+$/.test(v)) return v;
  if (!v.includes("'")) return `'${v}'`;
  return null;
}
const ligne = citer(valeur);
if (ligne === null) refus("la valeur porte une apostrophe et un caractère que .env interprète : elle ne se cite pas sans ambiguïté, rien n'est rangé");

const avant = existsSync(chemin) ? readFileSync(chemin, "utf8") : "";
const eol = (avant.match(/\r\n/g) || []).length > (avant.match(/(?<!\r)\n/g) || []).length ? "\r\n" : "\n";
const lignes = avant === "" ? [] : avant.split(/\r?\n/);
if (lignes.length && lignes[lignes.length - 1] === "") lignes.pop();
const motif = new RegExp(`^(\\s*export\\s+)?${nom}\\s*=`);
let remplace = false;
const apres = [];
for (const l of lignes) {
  const m = motif.exec(l);
  if (!m) { apres.push(l); continue; }
  if (!remplace) { apres.push(`${m[1] || ""}${nom}=${ligne}`); remplace = true; }
  // un doublon du même nom est retiré : la dernière valeur lue par un chargeur ne doit pas contredire celle qu'on vient de ranger
}
if (!remplace) apres.push(`${nom}=${ligne}`);
const temporaire = `${chemin}.${process.pid}.tmp`;
try {
  writeFileSync(temporaire, apres.join(eol) + eol, { encoding: "utf8", mode: 0o600 });
  renameSync(temporaire, chemin);
} catch (e) {
  try { unlinkSync(temporaire); } catch { /* absent */ }
  refus(`écriture de ${relPosix} impossible (${e.code || "erreur"}) : rien n'est rangé`);
}

// ---- 5. le ledger : le nom, l'empreinte, la date — jamais la valeur
const empreinte = createHash("sha256").update(valeur, "utf8").digest("hex");
const date = new Date().toISOString().slice(0, 10);
let r;
if (ecrivain.sorte === "python") {
  r = spawnSync("python", [ecrivain.chemin, "secret_range", "--variable", nom, "--fichier", relPosix, "--empreinte_sha256", empreinte, "--date", date, "--remplace", String(remplace), "--range_par", "ranger-secret.mjs"],
    { encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" }, cwd: produit });
} else {
  const payload = { type: "secret_range", variable: nom, fichier: relPosix, empreinte_sha256: empreinte, date, remplace, range_par: "ranger-secret.mjs" };
  r = spawnSync(process.execPath, [ecrivain.chemin, "append", ledger, JSON.stringify(payload)], { encoding: "utf8", cwd: produit });
}
const rangeSansTrace = (raison) => sortie({ verdict: "FAIL", variable: nom, fichier: relPosix, remplace, empreinte_sha256: empreinte,
  message: `la valeur est RANGÉE dans ${relPosix} mais sa trace n'est pas au ledger (${raison}) : rejouer le même geste, il remplace la ligne et consigne` }, 1);
if (r.status !== 0) rangeSansTrace(`l'écrivain du ledger (${ecrivain.sorte}) a refusé, exit ${r.status} : ${String(r.stderr || r.stdout || "").trim().slice(0, 240)}`);
const derniere = readFileSync(ledger, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean).at(-1);
if (!derniere || derniere.type !== "secret_range" || derniere.variable !== nom || derniere.empreinte_sha256 !== empreinte)
  rangeSansTrace("l'entrée n'apparaît pas en dernière ligne du ledger après l'écriture");

sortie({ verdict: "PASS", variable: nom, fichier: relPosix, remplace, empreinte_sha256: empreinte, ledger_seq: derniere.seq,
  ecrit_par: ecrivain.sorte === "python" ? "forge/ledger.py du produit" : "ledger.mjs de forge-agents",
  note: "la valeur n'est ni affichée ni consignée ; seule son empreinte l'est" }, 0);
