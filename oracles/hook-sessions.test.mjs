#!/usr/bin/env node
/**
 * hook-sessions.test.mjs — recette de l'identité de session et du registre des sessions d'un produit (D-218 (b) du 14/11/2026,
 * mandat 20261114n, 15/11/2026). Joué par oracles/self-tests.mjs (I2).
 *
 * Fixtures à double sens, une section par item du mandat :
 *   I1 — l'identité : la source unique de `lib-session.mjs`, la variable posée au fichier `CLAUDE_ENV_FILE` et rejouée avant la
 *        commande, la signature de `lib-decisions.mjs` (rouge : le mutant qui relit la seule variable héritée signe du nom de la mère) ;
 *   I2 — le registre `forge/sessions.jsonl` (`lib-sessions.mjs`) : session seule, deux sessions sur le même fichier, coordinatrice
 *        expirée, passation, double revendication dans la même seconde, registre illisible, verrou tenu ou périmé, arbre de travail
 *        lié, pouvoir borné de la coordinatrice.
 */
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ID_POSABLE, SOURCES, VARIABLE_SESSION, court, ligneVariable, poserVariable, sessionCourante, signature } from "./lib-session.mjs";
import {
  EXPIRATION_MIN, FICHIER_SESSIONS, PanneRegistre, ROLE_COORDINATRICE, VERROU_SESSIONS, avertissementChemin, cheminRelatif, doitRevendiquerLeRole,
  etatDesSessions, expirationsAConstater, ligneClose, ligneExpire, ligneObjet, ligneOpen, ligneRevendique, ligneVie, lignesDeContexte, lireRegistre,
  registreDe, revendicationPour, sousVerrouDuRegistre, tenantsAutres, vieDeTranscription,
} from "./lib-sessions.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "hook-sessions-"));
const MERE = "74dc7ecb-d93f-4110-bebc-19bf7aa9011b", ENFANT = "0e40d4f5-1111-4222-8333-944445555666";
/** L'environnement de la recette, sans l'identité de la session qui la joue : ses cas n'en dépendent pas. */
const ENV_NU = (() => { const e = { ...process.env }; for (const k of [VARIABLE_SESSION, "CLAUDE_CODE_SESSION_ID", "CLAUDE_ENV_FILE", "CLAUDE_PROJECT_DIR"]) delete e[k]; return e; })();
const envAvec = (vars) => ({ ...ENV_NU, ...vars });

try {
  // ---- I1 — l'identité de session --------------------------------------------------------------------------------------------
  check("I1 — l'ordre des sources : explicite, puis hook, puis la variable du SessionStart, puis la variable héritée, sinon inconnue", () => {
    const env = { [VARIABLE_SESSION]: ENFANT, CLAUDE_CODE_SESSION_ID: MERE };
    const cas = [
      [sessionCourante({ explicite: "manuel", entree: { session_id: "S-hook" }, env }), "manuel", SOURCES.ARGUMENT],
      [sessionCourante({ entree: { session_id: "S-hook" }, env }), "S-hook", SOURCES.HOOK],
      [sessionCourante({ env }), ENFANT, SOURCES.SESSION_START],
      [sessionCourante({ env: { CLAUDE_CODE_SESSION_ID: MERE } }), MERE, SOURCES.HERITEE],
      [sessionCourante({ env: {} }), null, SOURCES.INCONNUE],
      [sessionCourante({ entree: { session_id: "  " }, env: { [VARIABLE_SESSION]: " " } }), null, SOURCES.INCONNUE],
    ];
    for (const [s, id, source] of cas) att(s.id === id && s.source === source && s.court === court(id), `attendu ${id}/${source}, lu ${JSON.stringify(s)}`);
    const sig = signature({ env });
    att(sig.session === "0e40d4f5" && sig.session_source === SOURCES.SESSION_START, JSON.stringify(sig));
  });

  // Une réservation de D-N au registre du pilot, jouée dans un processus dont l'environnement est celui d'une session enfant.
  const reserverDans = (dossierOracles, env) => {
    const registre = join(T, `registre-${Math.random().toString(36).slice(2)}.jsonl`);
    const url = pathToFileURL(join(dossierOracles, "lib-decisions.mjs")).href;
    const code = `import(${JSON.stringify(url)}).then((m) => m.reserverAuPilot({ question: "Faut-il garder la version du jeudi pour la revue ?", fichier: ${JSON.stringify(registre)} }))`
      + ".catch((e) => { console.error(e.message); process.exit(1); })";
    const r = spawnSync(process.execPath, ["-e", code], { encoding: "utf8", env });
    const entree = existsSync(registre) ? JSON.parse(readFileSync(registre, "utf8").trim().split("\n").at(-1)) : null;
    return { r, entree };
  };
  const ENV_ENFANT = envAvec({ CLAUDE_CODE_SESSION_ID: MERE, [VARIABLE_SESSION]: ENFANT });
  check("I1 vert — une session enfant qui a posé sa variable réserve une D-N signée de son propre nom (lib-decisions.mjs, ligne 111)", () => {
    const { r, entree } = reserverDans(ICI, ENV_ENFANT);
    att(r.status === 0 && entree?.session === "0e40d4f5" && entree?.session_source === SOURCES.SESSION_START, `exit ${r.status} ${r.stderr} ${JSON.stringify(entree)}`);
  });
  check("I1 rouge — le mutant qui relit la seule variable héritée (la ligne 111 d'avant) signe la D-N du nom de la mère (RP-25)", () => {
    const m = join(T, "mutant", "oracles");
    mkdirSync(m, { recursive: true });
    for (const f of ["lib-decisions.mjs", "lib-session.mjs"]) copyFileSync(join(ICI, f), join(m, f));
    const source = readFileSync(join(m, "lib-decisions.mjs"), "utf8");
    const ligne = "const session = (s) => signature({ explicite: s });";
    att(source.includes(ligne), "la ligne visée par la chirurgie est introuvable : le témoin est vide");
    writeFileSync(join(m, "lib-decisions.mjs"), source.replace(ligne, 'const session = (s) => ({ session: String(s || process.env.CLAUDE_CODE_SESSION_ID || "").slice(0, 8) || null });'), "utf8");
    const { r, entree } = reserverDans(m, ENV_ENFANT);
    att(r.status === 0 && entree?.session === "74dc7ecb", `le mutant devait signer du nom de la mère : exit ${r.status} ${r.stderr} ${JSON.stringify(entree)}`);
  });
  check("I1 vert — sans variable posée, la D-N reste signée de la variable héritée, et la source le dit : heritee_possible", () => {
    const { r, entree } = reserverDans(ICI, envAvec({ CLAUDE_CODE_SESSION_ID: MERE }));
    att(r.status === 0 && entree?.session === "74dc7ecb" && entree?.session_source === SOURCES.HERITEE, `exit ${r.status} ${JSON.stringify(entree)}`);
  });

  check("I1 — la variable se pose en ajout au fichier CLAUDE_ENV_FILE, et se refuse sans fichier ou pour un identifiant qui demanderait des guillemets", () => {
    const f = join(T, "env-session.sh");
    writeFileSync(f, "export AUTRE_HOOK=1", "utf8");                       // un autre hook a écrit sans saut de ligne final
    const ok = poserVariable(ENFANT, { CLAUDE_ENV_FILE: f });
    att(ok.pose && readFileSync(f, "utf8") === `export AUTRE_HOOK=1\n${ligneVariable(ENFANT)}\n`, `contenu : ${JSON.stringify(readFileSync(f, "utf8"))}`);
    att(!poserVariable(ENFANT, {}).pose, "posée sans CLAUDE_ENV_FILE");
    const refus = poserVariable("a b; rm -rf x", { CLAUDE_ENV_FILE: f });
    att(!refus.pose && /non posable/.test(refus.raison) && !ID_POSABLE.test("a b"), JSON.stringify(refus));
    att(readFileSync(f, "utf8").split("\n").filter(Boolean).length === 2, "le refus a écrit au fichier");
  });

  // Le harnais rejoue le fichier avant chaque commande Bash (documentation, « Persist environment variables ») : une session enfant
  // hérite FORGE_SESSION_ID et CLAUDE_CODE_SESSION_ID de sa mère, son SessionStart pose sa variable, la commande lit la sienne.
  const bash = ["bash"].find((b) => { const r = spawnSync(b, ["--version"], { encoding: "utf8" }); return !r.error && r.status === 0; });
  if (!bash) console.log("  [NON JOUÉ] I1 — rejeu du fichier par bash : aucun bash sur ce poste (ni pour ni contre)");
  else check("I1 vert — le fichier rejoué avant la commande recouvre la variable héritée de la mère : la commande lit l'identifiant de l'enfant", () => {
    const f = join(T, "env-enfant.sh");
    att(poserVariable(ENFANT, { CLAUDE_ENV_FILE: f }).pose, "variable non posée");
    const lib = pathToFileURL(join(ICI, "lib-session.mjs")).href;
    const node = process.execPath.replaceAll("\\", "/");
    const commande = `source "${f.replaceAll("\\", "/")}"; "${node}" -e 'import("${lib}").then((m) => console.log(JSON.stringify(m.sessionCourante())))'`;
    const r = spawnSync(bash, ["-c", commande], { encoding: "utf8", env: envAvec({ CLAUDE_CODE_SESSION_ID: MERE, [VARIABLE_SESSION]: MERE }) });
    let s = null; try { s = JSON.parse(r.stdout.trim()); } catch { /* le cas le dit */ }
    att(r.status === 0 && s?.id === ENFANT && s?.source === SOURCES.SESSION_START, `exit ${r.status} ${r.stdout}${r.stderr}`);
    const sans = spawnSync(bash, ["-c", commande.replace(/^source "[^"]+"; /, "")], { encoding: "utf8", env: envAvec({ CLAUDE_CODE_SESSION_ID: MERE, [VARIABLE_SESSION]: MERE }) });
    let s2 = null; try { s2 = JSON.parse(sans.stdout.trim()); } catch { /* le cas le dit */ }
    att(s2?.id === MERE, `rouge : sans le fichier rejoué, la commande devait lire l'identifiant hérité de la mère, lu ${sans.stdout}${sans.stderr}`);
  });

  // ---- I2 — le registre forge/sessions.jsonl -----------------------------------------------------------------------------------
  const MIN = 60_000, T0 = Date.parse("2026-11-15T09:00:00.000Z");
  const A = "aaaa1111-0000-4000-8000-000000000001", B = "bbbb2222-0000-4000-8000-000000000002", C = "cccc3333-0000-4000-8000-000000000003";
  const sansTranscription = () => 0;
  const etat = (lignes, m = T0, vieDe = sansTranscription) => etatDesSessions(lignes, { maintenant: m, vieDe });
  const ouvre = (s, m, objet = `objet de ${s.slice(0, 4)}`) => [ligneOpen({ session: s, racine: "C:\\produit" }, m), ligneObjet({ session: s, objet }, m + 1000)];

  check("I2 vert — session seule : elle coordonne, ne voit aucune ligne de contexte et aucun avertissement", () => {
    const e = etat([...ouvre(A, T0 - 10 * MIN), ligneRevendique({ session: A, chemin: "src/a.py" }, T0 - 5 * MIN)]);
    att(e.coordinatrice === A && e.vivantes.length === 1, `coordinatrice ${e.coordinatrice}, ${e.vivantes.length} vivante(s)`);
    att(lignesDeContexte(e, A).length === 0, `une session seule voit : ${lignesDeContexte(e, A).join(" | ")}`);
    att(avertissementChemin(tenantsAutres(e, "src/a.py", A), "src/a.py") === "", "une session seule est avertie sur son propre chemin");
  });
  check("I2 rouge — la même session avec une seconde session vivante voit l'état : coordinatrice, vivantes, 3 lignes au plus", () => {
    const e = etat([...ouvre(A, T0 - 10 * MIN), ...ouvre(B, T0 - 2 * MIN)]);
    const l = lignesDeContexte(e, B);
    att(l.length === 2 && /coordinatrice : aaaa1111/.test(l[0]) && /Vivantes \(2\)/.test(l[1]) && /objet de bbbb/.test(l[1]), l.join(" | "));
  });

  check("I2 vert → rouge — deux sessions sur le même fichier : l'autre est nommée avec son objet ; un autre fichier ne déclenche rien", () => {
    const lignes = [...ouvre(A, T0 - 10 * MIN, "refondre la page d'accueil"), ...ouvre(B, T0 - 3 * MIN), ligneRevendique({ session: A, chemin: "site/index.html" }, T0 - 4 * MIN)];
    const e = etat(lignes);
    const texte = avertissementChemin(tenantsAutres(e, "site/index.html", B), "site/index.html", { maintenant: T0 });
    att(/CHEMIN REVENDIQUÉ/.test(texte) && /session aaaa1111/.test(texte) && /refondre la page d'accueil/.test(texte) && /rien n'est bloqué/.test(texte), texte);
    att(tenantsAutres(e, "SITE/Index.html", B).length === (process.platform === "win32" ? 1 : 0), "la casse d'un chemin Windows n'est pas ignorée");
    att(tenantsAutres(e, "site/autre.html", B).length === 0 && tenantsAutres(e, "site/index.html", A).length === 0, "un autre fichier, ou son propre fichier, avertit");
    const e2 = etat([...lignes, ligneRevendique({ session: B, chemin: "site/index.html" }, T0 - MIN)]);
    att(e2.conflits.length === 1 && e2.conflits[0].sessions.length === 2, JSON.stringify(e2.conflits));
    att(/Conflits : site\/index\.html tenu par/.test(lignesDeContexte(e2, B)[2] || ""), lignesDeContexte(e2, B).join(" | "));
  });

  check("I2 rouge → vert — coordinatrice expirée : elle coordonne tant qu'elle vit ; 15 minutes sans preuve de vie, la suivante prend le rôle", () => {
    const lignes = [...ouvre(A, T0 - 40 * MIN), ...ouvre(B, T0 - 30 * MIN), ligneVie({ session: B }, T0 - 2 * MIN)];
    const vivante = etat([...lignes, ligneVie({ session: A }, T0 - 5 * MIN)]);
    att(vivante.coordinatrice === A && !expirationsAConstater(vivante, B).length, `rouge : A vivante doit coordonner, lu ${vivante.coordinatrice}`);
    const e = etat([...lignes, ligneVie({ session: A }, T0 - (EXPIRATION_MIN + 1) * MIN)]);
    att(e.coordinatrice === B && expirationsAConstater(e, B).join() === A && doitRevendiquerLeRole(e, B), `coordinatrice ${e.coordinatrice}, à constater ${expirationsAConstater(e, B)}`);
    const declare = etat([...lignes, ligneVie({ session: A }, T0 - 20 * MIN), ligneExpire({ session: B, cible: A }, T0 - MIN)]);
    att(!expirationsAConstater(declare, B).length && declare.sessions.get(A).expiree, "une expiration déclarée se redéclare");
    const revenue = etat([...lignes, ligneVie({ session: A }, T0 - 20 * MIN), ligneExpire({ session: B, cible: A }, T0 - 2 * MIN), ligneVie({ session: A }, T0 - MIN)]);
    att(revenue.coordinatrice === A && revenue.sessions.get(A).vivante, `une preuve de vie après l'expiration la rend vivante : ${revenue.coordinatrice}`);
    const avecTranscription = [ligneOpen({ session: A, racine: "C:\\produit", transcription: "C:\\t\\a.jsonl" }, T0 - 40 * MIN), ...lignes.slice(1), ligneVie({ session: A }, T0 - 20 * MIN)];
    const parTranscription = etat(avecTranscription, T0, (t) => (t ? T0 - MIN : 0));
    att(parTranscription.coordinatrice === A, "la transcription récente ne compte pas comme preuve de vie");
    att(etat(avecTranscription, T0, () => 0).coordinatrice === B, "rouge : sans transcription récente, A devait être expirée");
  });

  check("I2 vert — passation : la coordinatrice ferme, la suivante par ancienneté prend le rôle et doit le revendiquer", () => {
    const lignes = [...ouvre(A, T0 - 40 * MIN), ligneRevendique({ session: A, role: ROLE_COORDINATRICE }, T0 - 39 * MIN), ...ouvre(B, T0 - 30 * MIN), ...ouvre(C, T0 - 20 * MIN),
      ...[A, B, C].map((s) => ligneVie({ session: s }, T0 - 2 * MIN))];
    const avant = etat(lignes);
    att(avant.coordinatrice === A && !doitRevendiquerLeRole(avant, A) && !doitRevendiquerLeRole(avant, B), "avant la fermeture");
    const apres = etat([...lignes, ligneClose({ session: A, raison: "prompt_input_exit" }, T0 - MIN)]);
    att(apres.coordinatrice === B && doitRevendiquerLeRole(apres, B) && !doitRevendiquerLeRole(apres, C), `après : ${apres.coordinatrice}`);
    const revendique = etat([...lignes, ligneClose({ session: A }, T0 - MIN), ligneRevendique({ session: B, role: ROLE_COORDINATRICE }, T0 - 30_000)]);
    att(!doitRevendiquerLeRole(revendique, B), "la revendication écrite ne se répète pas");
  });

  check("I2 rouge → vert — double revendication dans la même seconde : l'open le plus ancien prime, puis l'ordre lexical", () => {
    const s = T0 - 10 * MIN;
    const meme = [ligneOpen({ session: B, racine: "C:\\p" }, s + 100), ligneOpen({ session: A, racine: "C:\\p" }, s + 900),
      ligneRevendique({ session: B, role: ROLE_COORDINATRICE }, s + 1100), ligneRevendique({ session: A, role: ROLE_COORDINATRICE }, s + 1200)];
    const e = etat(meme);
    att(e.coordinatrice === A && !doitRevendiquerLeRole(e, B), `même seconde : ${e.coordinatrice} (A attendue, plus petite dans l'ordre lexical)`);
    const e2 = etat([...meme.slice(0, 2), ligneRevendique({ session: A, role: ROLE_COORDINATRICE }, s + 1100), ligneRevendique({ session: B, role: ROLE_COORDINATRICE }, s + 1200)]);
    att(e2.coordinatrice === A && doitRevendiquerLeRole(e2, A), "l'élue dont la revendication est recouverte réaffirme le rôle");
    const e3 = etat([ligneOpen({ session: B, racine: "C:\\p" }, s - 1000), ligneOpen({ session: A, racine: "C:\\p" }, s + 900)]);
    att(e3.coordinatrice === B, `rouge : une seconde d'écart, l'ordre lexical ne joue plus — attendu B, lu ${e3.coordinatrice}`);
  });

  check("I2 — la preuve de vie lit la transcription et celles de ses sous-agents (date de modification des fichiers)", () => {
    const t = join(T, "transcriptions", "sess.jsonl");
    mkdirSync(join(T, "transcriptions", "sess", "subagents"), { recursive: true });
    writeFileSync(t, "{}\n", "utf8");
    const sous = join(T, "transcriptions", "sess", "subagents", "agent-x.jsonl");
    writeFileSync(sous, "{}\n", "utf8");
    const vieux = new Date(T0 - 60 * MIN), recent = new Date(T0 - MIN);
    utimesSync(t, vieux, vieux); utimesSync(sous, recent, recent);
    att(Math.abs(vieDeTranscription(t) - recent.getTime()) < 2000, `vie lue ${new Date(vieDeTranscription(t)).toISOString()}`);
    utimesSync(sous, vieux, vieux);
    att(Math.abs(vieDeTranscription(t) - vieux.getTime()) < 2000 && vieDeTranscription(join(T, "absente.jsonl")) === 0, "transcription absente ou ancienne");
  });

  const produitJetable = (nom) => { const p = join(T, nom); mkdirSync(join(p, "forge"), { recursive: true }); return p; };
  check("I2 vert → rouge — registre illisible : une ligne complète illisible est comptée et sautée, une dernière ligne en cours d'écriture ne compte pas", () => {
    const p = produitJetable("illisible");
    const f = join(p, ...FICHIER_SESSIONS.split("/"));
    writeFileSync(f, [JSON.stringify(ligneOpen({ session: A, racine: p }, T0)), "{pas du json", JSON.stringify(ligneVie({ session: A }, T0 + 1000)), '{"ev":"vie","sess'].join("\n"), "utf8");
    const lu = lireRegistre([p]);
    att(lu.lignes.length === 2 && lu.illisibles === 1, `${lu.lignes.length} ligne(s), ${lu.illisibles} illisible(s)`);
    const d = produitJetable("illisible-dossier");
    mkdirSync(join(d, ...FICHIER_SESSIONS.split("/")));                  // un dossier à la place du fichier : illisible
    let leve = null; try { lireRegistre([d]); } catch (e) { leve = e; }
    att(leve instanceof PanneRegistre, `un registre illisible doit lever PanneRegistre : ${leve}`);
  });

  check("I2 vert → rouge — écriture sous verrou : ajout en une écriture, après un saut de ligne si la fin en manque ; verrou tenu = panne, verrou périmé repris", () => {
    const p = produitJetable("verrou");
    const reg = registreDe(p);
    const f = reg.fichier;
    writeFileSync(f, JSON.stringify(ligneOpen({ session: A, racine: p }, T0)), "utf8");    // sans saut de ligne final
    const { ecrites } = sousVerrouDuRegistre(reg, (lu) => (lu.lignes.length === 1 ? [ligneVie({ session: A }, T0 + 1000)] : []));
    att(ecrites.length === 1 && lireRegistre([p]).lignes.length === 2 && !existsSync(f + ".lock"), readFileSync(f, "utf8"));
    writeFileSync(f + ".lock", "", "utf8");
    const t0 = Date.now(); let leve = null;
    try { sousVerrouDuRegistre(reg, () => [ligneVie({ session: A }, T0 + 2000)]); } catch (e) { leve = e; }
    const duree = Date.now() - t0;
    att(leve instanceof PanneRegistre && lireRegistre([p]).lignes.length === 2 && duree < 1000, `verrou tenu : ${leve} en ${duree} ms`);
    const vieux = new Date(Date.now() - (VERROU_SESSIONS.perimeMs + 5000)); utimesSync(f + ".lock", vieux, vieux);
    sousVerrouDuRegistre(reg, () => [ligneVie({ session: A }, T0 + 3000)]);
    att(lireRegistre([p]).lignes.length === 3 && !existsSync(f + ".lock"), "le verrou périmé n'a pas été repris");
    att(!registreDe(join(T, "pas-un-produit")).fichier, "un dossier sans forge/ (le pilot) a un registre");
  });

  const git = (cwd, ...a) => spawnSync("git", a, { cwd, encoding: "utf8" });
  if (git(T, "--version").status !== 0) console.log("  [NON JOUÉ] I2 — arbre de travail lié : git absent (ni pour ni contre)");
  else check("I2 vert — arbre de travail lié : le registre s'écrit dans l'arbre principal et se lit des deux arbres ; un chemin se rend relatif à sa racine", () => {
    const p = produitJetable("principal");
    git(p, "init", "-q"); git(p, "-c", "user.email=r@e", "-c", "user.name=recette", "commit", "-q", "--allow-empty", "-m", "racine");
    const wt = join(T, "arbre-lie");
    const r = git(p, "worktree", "add", "-q", "--detach", wt);
    att(r.status === 0, `worktree : ${r.stderr}`);
    mkdirSync(join(wt, "forge"), { recursive: true });
    const reg = registreDe(wt);
    const reel = (x) => realpathSync.native(x).toLowerCase();               // git écrit le nom long du dossier temporaire, le poste peut donner le court
    att(reg.fichier && reel(reg.principal) === reel(p) && reel(dirname(reg.fichier)) === reel(join(p, "forge")), JSON.stringify(reg));
    sousVerrouDuRegistre(reg, () => ouvre(A, T0));
    att(lireRegistre(registreDe(p).racines).lignes.length === 2 && !existsSync(join(wt, ...FICHIER_SESSIONS.split("/"))), "le registre n'est pas dans l'arbre principal");
    att(cheminRelatif(join(wt, "src", "a.py"), reg.racines) === "src/a.py" && cheminRelatif(join(T, "ailleurs.txt"), reg.racines) === null, "chemin relatif");
  });

  check("I2 vert → rouge — pouvoir borné : la coordinatrice revendique un fichier commun pour une session nommée ; une autre session, ou un chemin tenu, est refusé", () => {
    const lignes = [...ouvre(A, T0 - 30 * MIN), ...ouvre(B, T0 - 20 * MIN), ...ouvre(C, T0 - 10 * MIN), ligneRevendique({ session: C, chemin: "forge/ledger.jsonl" }, T0 - 5 * MIN),
      ...[A, B].map((s) => ligneVie({ session: s }, T0 - 2 * MIN))];
    const e = etat(lignes);
    const ok = revendicationPour(e, { session: A, chemin: "output/README.md", pour: court(B) }, T0);
    att(ok.lignes?.length === 1 && ok.pour === B && ok.lignes[0].role === ROLE_COORDINATRICE, JSON.stringify(ok));
    const apres = etat([...lignes, ...ok.lignes]);
    att(tenantsAutres(apres, "output/README.md", C).map((s) => s.session).join() === B, "la revendication pour B n'est pas tenue par B");
    att(/seule la coordinatrice/.test(revendicationPour(e, { session: B, chemin: "output/README.md", pour: C }, T0).refus || ""), "une session non coordinatrice revendique pour une autre");
    att(/tenu par la session vivante cccc3333/.test(revendicationPour(e, { session: A, chemin: "forge/ledger.jsonl", pour: B }, T0).refus || ""), "un chemin tenu par une autre session vivante est pris");
    att(/n'est pas une session vivante/.test(revendicationPour(e, { session: A, chemin: "x.md", pour: "inconnue" }, T0).refus || ""), "une session absente est servie");
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(T, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nhook-sessions (D-218 (b)) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
