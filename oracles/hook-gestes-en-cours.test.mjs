#!/usr/bin/env node
/**
 * hook-gestes-en-cours.test.mjs — le registre des gestes distants EN COURS, partagé par les sessions d'un
 * produit, et la lecture qui avertit (TF-2084, retour RT-39 du lot Produit-84 20261103b).
 *
 * Le fait du 29/10/2026 : deux sessions d'un produit créent deux compartiments de stockage à deux minutes
 * d'écart, recréent un projet d'hébergement pendant le test de l'autre, lancent deux bancs à la fois.
 *
 * Sens rouge (le registre fait voir l'autre session) : la session B qui vise la même ressource que la session A
 * reçoit l'avertissement qui nomme A (« même ressource ») ; le même périmètre sous un autre nom (deux
 * compartiments) est signalé « même périmètre » ; un terraform dans le même dossier ; un arbre de travail lié
 * qui voit le geste ouvert dans l'arbre principal ; la déclaration explicite d'un banc (`--ouvrir`).
 * Sens vert (le registre ne bruite pas) : la session A seule ; la même session qui rejoue sa commande (rien
 * d'empilé) ; une ressource ou un compte différent ; un geste fermé par PostToolUse ; un geste expiré ; une
 * lecture (`az group show`, `wrangler r2 bucket list`, `terraform plan`) ; le pilot (qui n'écrit pas de
 * registre) ; un registre qui porte une ligne illisible. L'avertissement ne bloque JAMAIS (exit 0) ; un geste
 * destructif sans lot reste refusé (exit 2) et n'est pas inscrit. Le remède joué : la fin de A lève
 * l'avertissement de B.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { avertissement, clore, conflits, DUREE_MAX_MIN, gestesOuverts, lireRegistre, ligneDebut, ligneFin, ouvrir } from "./lib-gestes-en-cours.mjs";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-gestes-distants.mjs");
const base = mkdtempSync(join(tmpdir(), "gestes-en-cours-"));
let pass = 0, fail = 0, n = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const MIN = 60_000;

/** Un produit jetable : `.claude` pour que la racine se reconnaisse. */
const produit = () => { const p = join(base, `p${++n}`); mkdirSync(join(p, ".claude"), { recursive: true }); return p; };
const registre = (p) => join(p, "forge", "gestes-en-cours.jsonl");
const lignes = (p) => (existsSync(registre(p)) ? readFileSync(registre(p), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const jouer = (p, session, command, evenement = "PreToolUse", tool_name = "Bash") => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: p, env: { ...process.env, CLAUDE_PROJECT_DIR: p },
    input: JSON.stringify({ tool_name, tool_input: { command }, cwd: p, session_id: session, hook_event_name: evenement }) });
  let contexte = "";
  try { contexte = JSON.parse(r.stdout || "{}").hookSpecificOutput?.additionalContext || ""; } catch { /* sortie vide */ }
  return { code: r.status, contexte, err: r.stderr || "", out: r.stdout || "" };
};
const cli = (p, ...args) => { const r = spawnSync(process.execPath, [HOOK, ...args], { encoding: "utf8", cwd: p, env: { ...process.env, CLAUDE_PROJECT_DIR: p } }); return { code: r.status, out: r.stdout, err: r.stderr }; };
const AVERT = /GESTE DISTANT CONCURRENT \(TF-2084\)/;
const BUCKET = "wrangler r2 bucket create rapports";

try {
  // ---- La bibliothèque ---------------------------------------------------------------------------------
  check("lib — un geste est ouvert tant qu'il n'a ni `fin` ni expiration, puis fermé par sa `fin`", () => {
    const t0 = Date.now();
    const d = ligneDebut({ session: "A", ressource: "r", geste: "g" }, t0);
    if (gestesOuverts([d], t0 + MIN).length !== 1) throw new Error("un debut récent devrait être ouvert");
    if (gestesOuverts([d, ligneFin(d, t0 + MIN)], t0 + MIN).length !== 0) throw new Error("une fin devrait fermer le geste");
    if (gestesOuverts([d], t0 + 16 * MIN).length !== 0) throw new Error("après 15 minutes par défaut, le geste est expiré");
  });
  check("lib — la durée est bornée à 4 h : une durée de 10 000 minutes vaut 240", () => {
    const d = ligneDebut({ session: "A", ressource: "r", dureeMin: 10_000 }, 0);
    if (Date.parse(d.expire) - Date.parse(d.ts) !== DUREE_MAX_MIN * MIN) throw new Error(d.expire);
  });
  check("lib — conflits : autre session même ressource = ressource ; même périmètre = perimetre ; même session ou autre périmètre = rien", () => {
    const ouv = [ligneDebut({ session: "A", ressource: "p x", perimetre: "p" }, 0)];
    const c = (s, r, p) => conflits(ouv, { ressource: r, perimetre: p }, s).map((x) => x.niveau).join();
    if (c("B", "p x", "p") !== "ressource") throw new Error(c("B", "p x", "p"));
    if (c("B", "p y", "p") !== "perimetre") throw new Error(c("B", "p y", "p"));
    if (c("A", "p x", "p") !== "" || c("B", "q z", "q") !== "") throw new Error("faux conflit");
  });
  check("lib — l'avertissement nomme la session, la ressource et ne bloque pas (texte seul)", () => {
    const d = ligneDebut({ session: "sess-A", ressource: "wrangler r2 bucket rapports", geste: "wrangler r2 bucket create" }, Date.now() - 2 * MIN);
    const t = avertissement([{ geste: d, niveau: "ressource" }], { ressource: "wrangler r2 bucket rapports" });
    if (!AVERT.test(t) || !/sess-A/.test(t) || !/même ressource/.test(t) || !/Avertissement, rien n'est bloqué/.test(t)) throw new Error(t);
  });

  // ---- Le hook : deux sessions d'un même produit -------------------------------------------------------
  const P = produit();
  check("vert — la session A seule : exit 0, aucun avertissement, un `debut` inscrit sous forge/", () => {
    const r = jouer(P, "A", BUCKET);
    if (r.code !== 0 || r.contexte || r.out.trim()) throw new Error(`exit ${r.code} ${r.out}`);
    const l = lignes(P);
    if (l.length !== 1 || l[0].ev !== "debut" || l[0].session !== "A" || l[0].ressource !== "wrangler r2 bucket rapports") throw new Error(JSON.stringify(l));
  });
  check("rouge — la session B sur la MÊME ressource : l'avertissement nomme A, exit 0 (jamais un refus)", () => {
    const r = jouer(P, "B", BUCKET);
    if (r.code !== 0 || !AVERT.test(r.contexte) || !/session A/.test(r.contexte) || !/même ressource/.test(r.contexte)) throw new Error(`exit ${r.code} ${r.out} ${r.err}`);
  });
  check("rouge — la session B sur le même PÉRIMÈTRE sous un autre nom (deux compartiments) : « même périmètre »", () => {
    const r = jouer(P, "B", "wrangler r2 bucket create autres");
    if (r.code !== 0 || !AVERT.test(r.contexte) || !/même périmètre/.test(r.contexte) || !/session A/.test(r.contexte)) throw new Error(`exit ${r.code} ${r.out}`);
  });
  check("vert — la session A qui rejoue sa commande : aucun avertissement, rien d'empilé", () => {
    const p = produit();
    jouer(p, "A", BUCKET);
    const r = jouer(p, "A", BUCKET);
    if (r.code !== 0 || r.contexte) throw new Error(`avertissement à soi-même : ${r.contexte}`);
    if (lignes(p).filter((l) => l.session === "A").length !== 1) throw new Error("un debut de plus pour la même session et la même ressource");
  });
  check("vert — une ressource d'un autre service n'est pas signalée", () => {
    const r = jouer(P, "B", "az group create --name rg-essai --location westeurope");
    if (r.code !== 0 || r.contexte) throw new Error(r.contexte);
  });
  check("remède joué — la `fin` de A (PostToolUse) lève l'avertissement de B sur la même commande", () => {
    const post = jouer(P, "A", BUCKET, "PostToolUse");
    if (post.code !== 0) throw new Error(`exit ${post.code} ${post.err}`);
    if (!lignes(P).some((l) => l.ev === "fin" && l.session === "A")) throw new Error("aucune ligne fin pour A");
    const r = jouer(P, "B", BUCKET);
    // B a aussi ouvert ce compartiment plus haut ; le seul autre geste ouvert était celui de A, maintenant fermé.
    if (r.contexte) throw new Error(`B est encore averti : ${r.contexte.slice(0, 200)}`);
  });
  check("vert — un geste expiré (session morte sans `fin`) n'avertit plus", () => {
    const p = produit();
    mkdirSync(join(p, "forge"), { recursive: true });
    appendFileSync(registre(p), JSON.stringify(ligneDebut({ session: "morte", ressource: "wrangler r2 bucket rapports", perimetre: "wrangler r2 bucket", geste: "x" }, Date.now() - 20 * MIN)) + "\n");
    const r = jouer(p, "B", BUCKET);
    if (r.contexte) throw new Error(r.contexte);
  });
  check("vert — les lectures ne s'inscrivent pas : az show, wrangler list, terraform plan", () => {
    const p = produit();
    for (const c of ["az group show --name rg-essai", "wrangler r2 bucket list", "terraform plan", "az storage container list --account-name acc", "git status"]) {
      const r = jouer(p, "A", c);
      if (r.code !== 0 || r.contexte) throw new Error(`${c} : ${r.contexte}`);
    }
    if (lignes(p).length) throw new Error(`lecture inscrite : ${JSON.stringify(lignes(p))}`);
  });
  check("rouge — terraform apply dans le MÊME dossier par deux sessions : averti ; un autre -chdir : non", () => {
    const p = produit();
    jouer(p, "A", "terraform apply -auto-approve");
    const meme = jouer(p, "B", "terraform apply");
    if (!AVERT.test(meme.contexte) || !/même ressource/.test(meme.contexte)) throw new Error(`pas averti : ${meme.out}`);
    const autre = jouer(p, "B", "terraform -chdir=infra/test apply");
    if (autre.contexte) throw new Error(`faux positif : ${autre.contexte.slice(0, 200)}`);
  });
  check("rouge/vert — az storage container create : même compte = « même périmètre » ; un autre compte = rien", () => {
    const p = produit();
    jouer(p, "A", "az storage container create --account-name compteun --name c1");
    const meme = jouer(p, "B", "az storage container create --account-name compteun --name c2");
    if (!AVERT.test(meme.contexte) || !/même périmètre/.test(meme.contexte)) throw new Error(`pas averti : ${meme.out}`);
    const autre = jouer(p, "B", "az storage container create --account-name comptedeux --name c3");
    if (autre.contexte) throw new Error(`faux positif : ${autre.contexte.slice(0, 200)}`);
  });
  check("rouge — wrangler pages : un déploiement de A et la recréation du projet par B visent le MÊME projet", () => {
    const p = produit();
    jouer(p, "A", "wrangler pages deploy ./dist --project-name site-essai");
    const r = jouer(p, "B", "wrangler pages project delete site-essai");
    if (!AVERT.test(r.contexte) || !/même ressource/.test(r.contexte)) throw new Error(`pas averti : ${r.out}`);
  });
  check("rouge — un geste caché derrière `bash -c` est suivi comme les autres", () => {
    const p = produit();
    jouer(p, "A", `bash -c "wrangler r2 bucket create rapports"`);
    const r = jouer(p, "B", "wrangler r2 bucket create rapports");
    if (!AVERT.test(r.contexte)) throw new Error(`pas averti : ${r.out}`);
  });
  check("rouge — un geste destructif sans lot reste REFUSÉ (exit 2) et n'est pas inscrit au registre", () => {
    const p = produit();
    const r = jouer(p, "A", "az group delete --name rg-essai --yes");
    if (r.code !== 2 || !/GESTE DISTANT DESTRUCTIF REFUSÉ/.test(r.err)) throw new Error(`exit ${r.code}`);
    if (lignes(p).length) throw new Error("un geste refusé a été inscrit");
  });
  check("vert — le pilot (todo/TODO.jsonl) n'écrit pas de registre", () => {
    const p = produit();
    mkdirSync(join(p, "todo"), { recursive: true });
    writeFileSync(join(p, "todo", "TODO.jsonl"), "");
    const r = jouer(p, "A", BUCKET);
    if (r.code !== 0 || existsSync(registre(p))) throw new Error("registre écrit au pilot");
  });
  check("vert — une ligne illisible du registre est ignorée : le hook sort 0 et avertit quand même sur les lignes lisibles", () => {
    const p = produit();
    mkdirSync(join(p, "forge"), { recursive: true });
    appendFileSync(registre(p), "{ pas du json\n");
    jouer(p, "A", BUCKET);
    const r = jouer(p, "B", BUCKET);
    if (r.code !== 0 || !AVERT.test(r.contexte)) throw new Error(`exit ${r.code} ${r.out} ${r.err}`);
  });
  check("vert — l'outil n'est pas une commande, ou PostToolUse sans geste : rien", () => {
    const p = produit();
    const r = jouer(p, "A", BUCKET, "PreToolUse", "Write");
    if (r.code !== 0 || r.contexte || existsSync(registre(p))) throw new Error("Write inscrit");
  });

  // ---- L'arbre de travail lié lit le registre de l'arbre principal -------------------------------------
  check("rouge — une session dans un arbre de travail lié voit le geste ouvert dans l'arbre principal", () => {
    const principal = produit();
    const git = (cwd, ...a) => spawnSync("git", ["-c", "user.name=banc", "-c", "user.email=banc@exemple.invalide", "-c", "core.autocrlf=false", ...a], { cwd, encoding: "utf8" });
    if (git(principal, "init", "-q").status !== 0) throw new Error("git init impossible");
    writeFileSync(join(principal, "a.txt"), "a\n");
    git(principal, "add", "a.txt");
    git(principal, "commit", "-q", "-m", "départ");
    const lie = join(base, `lie${n}`);
    if (git(principal, "worktree", "add", "-q", lie, "-b", "branche-lie").status !== 0) throw new Error("worktree impossible");
    mkdirSync(join(lie, ".claude"), { recursive: true });
    jouer(principal, "A", BUCKET);
    const r = jouer(lie, "B", BUCKET);
    if (!AVERT.test(r.contexte) || !/session A/.test(r.contexte)) throw new Error(`l'arbre lié ne voit pas l'arbre principal : ${r.out} ${r.err}`);
    if (existsSync(registre(lie))) throw new Error("le registre a été écrit dans l'arbre lié, pas dans l'arbre principal");
    if (!lignes(principal).some((l) => l.session === "B")) throw new Error("le debut de B n'est pas dans l'arbre principal");
  });

  // ---- La déclaration explicite : un banc, un déploiement que la liste fermée ne reconnaît pas ---------
  check("rouge — `--ouvrir` d'un banc par A, puis `--ouvrir` du même banc par B : B est averti (stderr), exit 0", () => {
    const p = produit();
    const a = cli(p, "--ouvrir", "--ressource", "banc:recette", "--geste", "banc de recette", "--session", "A", "--duree-min", "60");
    if (a.code !== 0 || !/geste ouvert/.test(a.out)) throw new Error(`${a.code} ${a.out} ${a.err}`);
    const b = cli(p, "--ouvrir", "--ressource", "banc:recette", "--session", "B");
    if (b.code !== 0 || !AVERT.test(b.err) || !/session A/.test(b.err)) throw new Error(`${b.code} ${b.out} ${b.err}`);
    const liste = cli(p, "--lister");
    if (!/banc:recette/.test(liste.out)) throw new Error(liste.out);
  });
  check("remède joué — `--clore` par A lève l'avertissement : B ouvre le même banc sans être averti", () => {
    const p = produit();
    cli(p, "--ouvrir", "--ressource", "banc:recette", "--session", "A");
    const c = cli(p, "--clore", "--ressource", "banc:recette", "--session", "A");
    if (c.code !== 0 || !/1 geste\(s\) clos/.test(c.out)) throw new Error(c.out);
    const b = cli(p, "--ouvrir", "--ressource", "banc:recette", "--session", "B");
    if (b.err) throw new Error(`B averti après la fin de A : ${b.err.slice(0, 200)}`);
  });
  check("vert — `--ouvrir` sans `--ressource` est refusé (exit 1) avec son remède", () => {
    const r = cli(produit(), "--ouvrir", "--session", "A");
    if (r.code !== 1 || !/--ressource/.test(r.err)) throw new Error(`${r.code} ${r.err}`);
  });
  check("lib — `ouvrir` et `clore` appelés directement : le registre garde l'historique (debut puis fin)", () => {
    const p = produit();
    ouvrir([p], p, { session: "A", ressource: "r" });
    clore([p], p, { session: "A", ressource: "r" });
    const l = lireRegistre([p]);
    if (l.map((x) => x.ev).join() !== "debut,fin") throw new Error(l.map((x) => x.ev).join());
  });
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
}

console.log(`\nhook-gestes-en-cours : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
