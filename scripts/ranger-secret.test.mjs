#!/usr/bin/env node
/**
 * ranger-secret.test.mjs — recette du geste « ranger un secret reçu en session » (TF-2127, D-167 (a) du 04/11/2026), à double sens.
 * Tout se joue sur des produits ÉPHÉMÈRES (dépôt git jetable, `.gitignore`, `forge\ledger.jsonl`) ; aucune valeur réelle : les valeurs d'essai
 * commencent par « FAUX- » et ne valent rien. Le pilot n'est jamais écrit.
 *
 *   1. vert, écrivain Python (`forge/ledger.py` du produit) : la ligne NOM=valeur est au fichier, ignoré par git ; le ledger reçoit `secret_range`
 *      avec le nom, la date et l'empreinte (vecteur sha256 fixe, recalculé à part avec `sha256sum`), `--verifier` du ledger reste PASS ;
 *   2. la valeur n'est NULLE PART ailleurs que dans le fichier d'environnement : ni sur la sortie du geste, ni sur l'erreur, ni au ledger ;
 *   3. rouge — fichier NON ignoré (aucun .gitignore) : refus, le fichier n'est pas créé, le ledger n'a pas bougé ; rouge — fichier SUIVI par git
 *      alors que le motif l'ignorerait : refus aussi (un fichier suivi n'est pas ignoré) ;
 *   4. une seconde écriture du même nom REMPLACE la ligne (doublons retirés, commentaire, autres variables et fins de ligne CRLF conservés) et
 *      le ledger consigne `remplace: true` avec la nouvelle empreinte ;
 *   5. refus avant écriture : valeur absente, valeur multi-ligne, nom invalide (non répété à l'écran), valeur en argument (usage, exit 2),
 *      ledger absent, `--fichier` hors du produit ou modèle `.env.example`, cible = le pilot ;
 *   6. une valeur avec espace est citée entre apostrophes ; apostrophe + espace est refusée plutôt que mal citée ;
 *   7. écrivain `ledger.mjs` de forge-agents (produit sans `forge/ledger.py`) : même entrée, `verify` du ledger PASS (sauté, dit, si le dépôt frère est absent) ;
 *   8. le remède du message est JOUÉ : un écrivain qui refuse le type (vocabulaire ancien) laisse la valeur rangée et le DIT (exit 1), le même
 *      geste rejoué avec l'écrivain à jour remplace la ligne et consigne (exit 0) ;
 *   9. `secret_range` est au vocabulaire de `gabarits/ledger.py` (rouge : sans lui, l'écrivain Python refuse le type).
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ranger-secret.mjs");
const LEDGER_PY = join(ICI, "..", "gabarits", "ledger.py");
const LEDGER_MJS = join("digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
const RACINES_PARC = [process.env.FORGE_ROOT, join(ICI, "..", ".."), "c:\\dev"].filter(Boolean);
const PARC = RACINES_PARC.find((r) => existsSync(join(r, LEDGER_MJS))) || null;
const base = mkdtempSync(join(tmpdir(), "rs-"));
const echecs = [];
let verifs = 0;
const att = (cond, msg) => { verifs++; if (!cond) echecs.push(msg); };

// Valeurs d'essai VISIBLEMENT factices. Empreintes : sha256 du texte exact, recalculées à part (`printf '%s' '<valeur>' | sha256sum`).
const V1 = "FAUX-essai-ne-pas-utiliser-0001";
const H1 = "246ea437be97c29cba3a664df34afe346c5e6069c14e0a67f0177c1b5bcd074c";
const V2 = "FAUX-essai-ne-pas-utiliser-0002";
const H2 = "04c522dabeb2d007ff1ac7a28a86564278165566368dc8e9cff3c50f33173ac3";
const V3 = "FAUX essai avec espace";
const H3 = "4620c36663b2b3a21559b1231df6128f70cafd18cc4409866a8b17a77c99b290";
const TOUTES = [V1, V2, V3];

const git = (cwd, ...a) => spawnSync("git", a, { cwd, encoding: "utf8" });
let n = 0;
/** Un produit jetable : dépôt git, `.gitignore` (ou non), `forge/` avec un ledger qui porte son `run_open`, écrivain Python (ou non). */
function produit({ ignore = true, ledger = true, py = true, versionPy = null } = {}) {
  const d = join(base, `p${++n}`);
  mkdirSync(join(d, "forge"), { recursive: true });
  git(d, "init", "-q");
  if (ignore) writeFileSync(join(d, ".gitignore"), ".env\n.env.*\n!.env.example\n", "utf8");
  if (ledger) writeFileSync(join(d, "forge", "ledger.jsonl"), JSON.stringify({ seq: 1, ts: "2026-11-04T08:00:00Z", type: "run_open", run: "essai" }) + "\n", "utf8");
  if (py) writeFileSync(join(d, "forge", "ledger.py"), versionPy ?? readFileSync(LEDGER_PY, "utf8"), "utf8");
  return d;
}
const lancer = (d, args, entree, env = {}) => {
  const r = spawnSync(process.execPath, [OUTIL, ...args], { cwd: d, input: entree, encoding: "utf8", env: { ...process.env, ...env } });
  let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
  return { code: r.status, o, sortie: (r.stdout || "") + (r.stderr || "") };
};
const lignesLedger = (d) => readFileSync(join(d, "forge", "ledger.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const env = (d, nom = ".env") => (existsSync(join(d, nom)) ? readFileSync(join(d, nom), "utf8") : null);
const verifierPy = (d) => spawnSync("python", [join(d, "forge", "ledger.py"), "--verifier"], { encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } });
let toutLu = ""; // tout ce que les gestes ont affiché, pour la preuve « la valeur n'est jamais rendue »

try {
  // ---- 1. vert, écrivain Python
  const p1 = produit();
  const r1 = lancer(p1, ["ESSAI_CLE"], V1 + "\n");
  toutLu += r1.sortie;
  att(r1.code === 0 && r1.o?.verdict === "PASS", `1 : le rangement doit réussir, obtenu ${r1.code} ${r1.sortie.slice(0, 300)}`);
  att(env(p1) === `ESSAI_CLE=${V1}\n`, `1 : le fichier .env doit porter la ligne, obtenu ${JSON.stringify(env(p1))}`);
  att(git(p1, "check-ignore", "-q", "--", ".env").status === 0 && !git(p1, "status", "--porcelain").stdout.includes(".env"), "1 : .env doit rester ignoré et absent de git status");
  const e1 = lignesLedger(p1).at(-1);
  att(e1.type === "secret_range" && e1.variable === "ESSAI_CLE" && e1.empreinte_sha256 === H1 && e1.fichier === ".env" && e1.remplace === false && /^\d{4}-\d{2}-\d{2}$/.test(e1.date) && e1.seq === 2,
    `1 : l'entrée du ledger est fausse : ${JSON.stringify(e1)}`);
  att(r1.o?.empreinte_sha256 === H1 && r1.o?.ledger_seq === 2 && r1.o?.remplace === false, `1 : le compte rendu doit porter l'empreinte et le seq, obtenu ${JSON.stringify(r1.o)}`);
  att(verifierPy(p1).status === 0, "1 : le ledger doit rester intègre (--verifier de ledger.py)");
  att(!readdirSync(p1).some((f) => f.endsWith(".tmp")), "1 : un fichier temporaire est resté dans le produit");

  // ---- 2. la valeur n'est nulle part ailleurs que dans le fichier
  att(!readFileSync(join(p1, "forge", "ledger.jsonl"), "utf8").includes(V1), "2 : la valeur est écrite au ledger");
  att(!toutLu.includes(V1), "2 : la valeur est rendue sur la sortie du geste");

  // ---- 3. rouge : fichier non ignoré, puis fichier suivi
  const p3 = produit({ ignore: false });
  const avant3 = readFileSync(join(p3, "forge", "ledger.jsonl"), "utf8");
  const r3 = lancer(p3, ["ESSAI_CLE"], V1);
  toutLu += r3.sortie;
  att(r3.code === 1 && r3.o?.verdict === "REFUS" && /PAS ignoré/.test(r3.o?.message || ""), `3 : un fichier non ignoré doit être refusé, obtenu ${r3.code} ${r3.sortie.slice(0, 200)}`);
  att(env(p3) === null, "3 : le fichier .env a été créé malgré le refus");
  att(readFileSync(join(p3, "forge", "ledger.jsonl"), "utf8") === avant3, "3 : le ledger a bougé malgré le refus");
  const p3b = produit();
  writeFileSync(join(p3b, ".env"), "DEJA=1\n", "utf8");
  git(p3b, "add", "-f", ".env");
  const r3b = lancer(p3b, ["ESSAI_CLE"], V1);
  toutLu += r3b.sortie;
  att(r3b.code === 1 && /PAS ignoré/.test(r3b.o?.message || "") && env(p3b) === "DEJA=1\n", `3 : un .env suivi par git doit être refusé et intact, obtenu ${r3b.code} ${JSON.stringify(env(p3b))}`);

  // ---- 4. la seconde écriture remplace la ligne
  const p4 = produit();
  writeFileSync(join(p4, ".env"), "# jeton du service\r\nAUTRE=garde\r\nESSAI_CLE=ancienne\r\nexport ESSAI_CLE=doublon\r\nFIN=1\r\n", "utf8");
  const r4 = lancer(p4, ["ESSAI_CLE"], V2 + "\r\n");
  toutLu += r4.sortie;
  att(r4.code === 0 && r4.o?.remplace === true, `4 : le remplacement doit réussir et se dire, obtenu ${r4.code} ${r4.sortie.slice(0, 200)}`);
  att(env(p4) === `# jeton du service\r\nAUTRE=garde\r\nESSAI_CLE=${V2}\r\nFIN=1\r\n`, `4 : une seule ligne, les autres intactes, fins de ligne CRLF gardées : ${JSON.stringify(env(p4))}`);
  const r4b = lancer(p4, ["ESSAI_CLE"], V1);
  toutLu += r4b.sortie;
  att(env(p4).split("ESSAI_CLE=").length === 2 && env(p4).includes(V1) && !env(p4).includes(V2), "4 : la troisième écriture doit remplacer encore, jamais ajouter");
  const l4 = lignesLedger(p4).filter((x) => x.type === "secret_range");
  att(l4.length === 2 && l4[0].remplace === true && l4[0].empreinte_sha256 === H2 && l4[1].empreinte_sha256 === H1 && l4[1].seq === 3, `4 : le ledger doit consigner chaque rangement : ${JSON.stringify(l4)}`);

  // ---- 5. refus avant écriture
  const refus = (nomCas, d, args, entree, motif) => {
    const avant = existsSync(join(d, "forge", "ledger.jsonl")) ? readFileSync(join(d, "forge", "ledger.jsonl"), "utf8") : null;
    const r = lancer(d, args, entree);
    toutLu += r.sortie;
    att(r.code === 1 && motif.test(r.o?.message || ""), `5 ${nomCas} : refus attendu (exit 1, ${motif}), obtenu ${r.code} ${r.sortie.slice(0, 220)}`);
    att(env(d) === null && (avant === null || readFileSync(join(d, "forge", "ledger.jsonl"), "utf8") === avant), `5 ${nomCas} : le refus a écrit quelque chose`);
  };
  refus("valeur absente", produit(), ["ESSAI_CLE"], "", /aucune valeur/);
  refus("valeur vide (saut de ligne seul)", produit(), ["ESSAI_CLE"], "\n", /aucune valeur/);
  refus("valeur multi-ligne", produit(), ["ESSAI_CLE"], "FAUX-ligne-1\nFAUX-ligne-2\n", /plusieurs lignes/);
  refus("nom invalide", produit(), ["FAUX-cle-collee-en-nom=0003"], V1, /premier argument/);
  refus("ledger absent", produit({ ledger: false }), ["ESSAI_CLE"], V1, /ledger du produit introuvable/);
  refus("fichier hors du produit", produit(), ["ESSAI_CLE", "--fichier", "../hors.env"], V1, /pas dans le produit/);
  refus("modèle .env.example", produit(), ["ESSAI_CLE", "--fichier", ".env.example"], V1, /pas un fichier d'environnement local/);
  refus("fichier quelconque", produit(), ["ESSAI_CLE", "--fichier", "README.md"], V1, /pas un fichier d'environnement local/);
  // sans écrivain trouvé (ni ledger.py, ni ledger.mjs dans les racines connues) : refus avant toute écriture. Le cas n'existe que sur un poste sans c:\\dev ni FORGE_ROOT valide.
  if (existsSync(join("c:\\dev", LEDGER_MJS))) console.log("  [SAUTÉ] cas 5 écrivain introuvable — ledger.mjs présent sous c:\\dev sur ce poste : la racine de repli le trouve toujours");
  else {
    const p5 = produit({ py: false });
    const r5 = lancer(p5, ["ESSAI_CLE"], V1, { FORGE_ROOT: join(base, "parc-vide") });
    toutLu += r5.sortie;
    att(r5.code === 1 && /écrivain du ledger introuvable/.test(r5.o?.message || "") && env(p5) === null, `5 écrivain introuvable : refus attendu avant écriture, obtenu ${r5.code} ${r5.sortie.slice(0, 200)}`);
  }
  // la valeur en argument est un usage faux, jamais un rangement : deux positionnels, exit 2, la valeur n'est pas répétée
  const p5c = produit();
  const r5c = lancer(p5c, ["ESSAI_CLE", V3], "");
  toutLu += r5c.sortie;
  att(r5c.code === 2 && env(p5c) === null && !r5c.sortie.includes(V3), `5 valeur en argument : usage (exit 2), rien d'écrit, valeur non répétée ; obtenu ${r5c.code} ${r5c.sortie.slice(0, 200)}`);
  const r5d = lancer(p5c, ["ESSAI_CLE", "--valeur-en-clair"], V1);
  toutLu += r5d.sortie;
  att(r5d.code === 2 && env(p5c) === null && !r5d.sortie.includes("valeur-en-clair"), `5 option inconnue : exit 2, rien d'écrit, option non répétée ; obtenu ${r5d.code} ${r5d.sortie.slice(0, 200)}`);
  // Le pilot d'un poste peut porter son propre .env : on compare son état avant et après, sans jamais le lire.
  const envPilot = join(ICI, "..", ".env");
  const etatEnvPilot = () => existsSync(envPilot) ? `${statSync(envPilot).size}:${statSync(envPilot).mtimeMs}` : null;
  const avant5e = etatEnvPilot();
  const r5e = spawnSync(process.execPath, [OUTIL, "--produit", join(ICI, ".."), "ESSAI_CLE"], { cwd: base, input: V1, encoding: "utf8" });
  toutLu += (r5e.stdout || "") + (r5e.stderr || "");
  att(r5e.status === 1 && /pilot lui-même/.test(r5e.stdout || ""), `5 pilot : refus attendu, obtenu ${r5e.status} ${(r5e.stdout || "").slice(0, 200)}`);
  att(etatEnvPilot() === avant5e, "5 pilot : le .env du pilot a été créé ou modifié");

  // ---- 6. citation
  const p6 = produit();
  const r6 = lancer(p6, ["VAR_ESPACE"], V3);
  toutLu += r6.sortie;
  att(r6.code === 0 && env(p6) === `VAR_ESPACE='${V3}'\n` && lignesLedger(p6).at(-1).empreinte_sha256 === H3, `6 : une valeur avec espace se cite entre apostrophes (et l'empreinte est celle de la valeur nue), obtenu ${JSON.stringify(env(p6))}`);
  refus("apostrophe + espace", produit(), ["VAR_X"], "FAUX l'essai", /apostrophe/);
  const p6c = produit();
  const r6c = lancer(p6c, ["ESSAI_LOCAL", "--fichier", ".env.local"], V1);
  toutLu += r6c.sortie;
  att(r6c.code === 0 && env(p6c, ".env.local") === `ESSAI_LOCAL=${V1}\n` && lignesLedger(p6c).at(-1).fichier === ".env.local", `6 : --fichier .env.local doit ranger dans ce fichier, obtenu ${r6c.code} ${r6c.sortie.slice(0, 200)}`);

  // ---- 7. écrivain ledger.mjs de forge-agents
  if (!PARC) console.log("  [SAUTÉ] cas 7 — ledger.mjs de forge-agents absent du poste (FORGE_ROOT, voisin du pilot, c:\\dev) : l'écrivain Node n'est pas joué");
  else {
    const p7 = produit({ py: false });
    const r7 = lancer(p7, ["ESSAI_CLE"], V1, { FORGE_ROOT: PARC });
    toutLu += r7.sortie;
    const e7 = lignesLedger(p7).at(-1);
    att(r7.code === 0 && r7.o?.ecrit_par === "ledger.mjs de forge-agents" && e7.type === "secret_range" && e7.empreinte_sha256 === H1 && e7.variable === "ESSAI_CLE", `7 : l'écrivain Node doit consigner l'entrée, obtenu ${r7.code} ${r7.sortie.slice(0, 300)}`);
    const v7 = spawnSync(process.execPath, [join(PARC, LEDGER_MJS), "verify", join(p7, "forge", "ledger.jsonl")], { encoding: "utf8" });
    att(v7.status === 0, `7 : le ledger doit rester intègre (verify de ledger.mjs) : ${(v7.stdout + v7.stderr).slice(0, 200)}`);
    att(!readFileSync(join(p7, "forge", "ledger.jsonl"), "utf8").includes(V1), "7 : la valeur est écrite au ledger");
  }

  // ---- 8. le remède joué : un écrivain au vocabulaire ancien refuse, la valeur reste rangée et le geste le dit, puis le rejeu consigne
  const ancien = readFileSync(LEDGER_PY, "utf8").replace(/, "secret_range"\}/, "}");
  att(ancien !== readFileSync(LEDGER_PY, "utf8"), "8 : chirurgie sans effet, le témoin est vide");
  const p8 = produit({ versionPy: ancien });
  const r8 = lancer(p8, ["ESSAI_CLE"], V1);
  toutLu += r8.sortie;
  att(r8.code === 1 && r8.o?.verdict === "FAIL" && /RANGÉE/.test(r8.o?.message || "") && env(p8) === `ESSAI_CLE=${V1}\n` && lignesLedger(p8).length === 1,
    `8 : un écrivain qui refuse doit laisser la valeur rangée et le dire sans consigner, obtenu ${r8.code} ${r8.sortie.slice(0, 260)}`);
  writeFileSync(join(p8, "forge", "ledger.py"), readFileSync(LEDGER_PY, "utf8"), "utf8");
  const r8b = lancer(p8, ["ESSAI_CLE"], V1);
  toutLu += r8b.sortie;
  att(r8b.code === 0 && r8b.o?.remplace === true && env(p8) === `ESSAI_CLE=${V1}\n` && lignesLedger(p8).at(-1).type === "secret_range", `8 : le rejeu (le remède du message) doit réussir sans doubler la ligne, obtenu ${r8b.code} ${r8b.sortie.slice(0, 200)}`);

  // ---- 9. le vocabulaire de ledger.py
  const vocabulaire = (t) => new Set([...(t.match(/TYPES = \{([\s\S]*?)\}/) || ["", ""])[1].matchAll(/"([a-z_]+)"/g)].map((m) => m[1]));
  att(vocabulaire(readFileSync(LEDGER_PY, "utf8")).has("secret_range"), "9 : secret_range n'est pas au vocabulaire de gabarits/ledger.py");

  // ---- aucune valeur d'essai n'a été rendue par un geste
  for (const v of TOUTES) att(!toutLu.includes(v), `fin : la valeur d'essai « ${v.slice(0, 12)}… » a été rendue sur une sortie`);
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 300)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error("ranger-secret : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log(`ranger-secret : ${verifs}/${verifs} — cas rouges joués et refusés (fichier non ignoré, fichier suivi, valeur absente ou multi-ligne, nom invalide, valeur en argument, ledger absent, fichier hors du produit, cible = pilot, apostrophe + espace, écrivain qui refuse), seconde écriture qui remplace, valeur jamais rendue ni consignée`);
