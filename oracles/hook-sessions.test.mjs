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
 *        lié, pouvoir borné de la coordinatrice ;
 *   I3 — les hooks (`hook-sessions.mjs`), un cas par événement, par la fonction et par le processus réel : jamais de code de sortie
 *        2, une session seule ne voit rien, la panne se déclare une fois par session, l'identité d'un hook ne vient que de son
 *        entrée, le budget de 300 ms sur un registre de 1 000 lignes mesuré par le lanceur.
 */
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
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

  // ---- I3 — les hooks ---------------------------------------------------------------------------------------------------------
  const { traiter } = await import("./hook-sessions.mjs");
  const lignesDe = (p) => (existsSync(join(p, ...FICHIER_SESSIONS.split("/"))) ? lireRegistre([p]).lignes : []);
  const entreeDe = (evenement, session, p, plus = {}) => ({ hook_event_name: evenement, session_id: session, cwd: p, transcript_path: join(T, "transcriptions", `${session}.jsonl`), ...plus });
  const jouer = (entree, m, env = {}) => traiter(entree, { env, maintenant: m, vieDe: sansTranscription });

  check("I3 vert — session seule, les six événements : open, objet, revendique, vie après 5 minutes, libere et close ; rien n'est montré", () => {
    const p = produitJetable("i3-seule");
    const envFile = join(T, "i3-seule-env.sh");
    const r = [
      jouer(entreeDe("SessionStart", A, p, { source: "startup" }), T0, { CLAUDE_ENV_FILE: envFile }),
      jouer(entreeDe("UserPromptSubmit", A, p, { prompt: "  Refondre   la page\nd'accueil du site  " }), T0 + 1000),
      jouer(entreeDe("PreToolUse", A, p, { tool_name: "Write", tool_input: { file_path: join(p, "site", "index.html") } }), T0 + 2000),
      jouer(entreeDe("PostToolUse", A, p, { tool_name: "Write", tool_input: { file_path: join(p, "site", "index.html") }, tool_response: { type: "create" } }), T0 + 3000),
      jouer(entreeDe("PostToolUse", A, p, { tool_name: "Edit", tool_input: { file_path: join(p, "site", "index.html") } }), T0 + 4000),
      jouer(entreeDe("Stop", A, p), T0 + 60_000),
      jouer(entreeDe("Stop", A, p), T0 + 6 * MIN),
      jouer(entreeDe("UserPromptSubmit", A, p, { prompt: "et le pied de page" }), T0 + 7 * MIN),
      jouer(entreeDe("SessionEnd", A, p, { reason: "prompt_input_exit" }), T0 + 8 * MIN),
    ];
    const evs = lignesDe(p).map((l) => l.ev + (l.role ? `:${l.role}` : "") + (l.chemin ? `:${l.chemin}` : ""));
    att(evs.join() === "open,revendique:coordinatrice,objet,revendique:site/index.html,vie,libere:site/index.html,close", evs.join());
    att(r.every((x) => !x.contexte), `une session seule a vu : ${r.map((x) => x.contexte).filter(Boolean).join(" | ")}`);
    att(lignesDe(p).find((l) => l.ev === "objet").objet === "Refondre la page d'accueil du site", JSON.stringify(lignesDe(p).find((l) => l.ev === "objet")));
    att(readFileSync(envFile, "utf8") === `${ligneVariable(A)}\n` && r[0].variable?.pose, "SessionStart n'a pas posé l'identité");
    att(lignesDe(p).find((l) => l.ev === "close").raison === "prompt_input_exit", "la raison de fin n'est pas écrite");
  });

  check("I3 vert → rouge — deux sessions sur le même fichier : PreToolUse de B nomme A et son objet ; un autre fichier, ou A sur le sien, ne dit rien", () => {
    const p = produitJetable("i3-deux");
    jouer(entreeDe("SessionStart", A, p), T0);
    jouer(entreeDe("UserPromptSubmit", A, p, { prompt: "Refondre la page d'accueil" }), T0 + 1000);
    jouer(entreeDe("PostToolUse", A, p, { tool_name: "Write", tool_input: { file_path: join(p, "site", "index.html") } }), T0 + 2000);
    jouer(entreeDe("SessionStart", B, p), T0 + 60_000);
    const premierTourB = jouer(entreeDe("UserPromptSubmit", B, p, { prompt: "Corriger le formulaire" }), T0 + 61_000);
    att(/coordinatrice : aaaa1111/.test(premierTourB.contexte || "") && premierTourB.contexte.split("\n").length <= 3, premierTourB.contexte);
    const pre = jouer(entreeDe("PreToolUse", B, p, { tool_name: "Edit", tool_input: { file_path: join(p, "site", "index.html") } }), T0 + 62_000);
    att(/CHEMIN REVENDIQUÉ/.test(pre.contexte || "") && /session aaaa1111/.test(pre.contexte) && /Refondre la page d'accueil/.test(pre.contexte) && /sessions-actives\.mjs/.test(pre.contexte), pre.contexte);
    att(!jouer(entreeDe("PreToolUse", B, p, { tool_name: "Edit", tool_input: { file_path: join(p, "app", "contact.py") } }), T0 + 63_000).contexte, "un autre fichier avertit");
    att(!jouer(entreeDe("PreToolUse", A, p, { tool_name: "Edit", tool_input: { file_path: join(p, "site", "index.html") } }), T0 + 64_000).contexte, "A est averti sur son propre fichier");
    jouer(entreeDe("PostToolUse", B, p, { tool_name: "Edit", tool_input: { file_path: join(p, "site", "index.html") } }), T0 + 65_000);
    const tourA = jouer(entreeDe("UserPromptSubmit", A, p, { prompt: "suite" }), T0 + 66_000);
    att(/Conflits : site\/index\.html tenu par aaaa1111 \(cette session\) et bbbb2222/.test(tourA.contexte || ""), tourA.contexte);
  });

  check("I3 rouge → vert — coordinatrice expirée : au tour de B, 20 minutes après, A est déclarée expirée et B revendique le rôle", () => {
    const p = produitJetable("i3-expiree");
    jouer(entreeDe("SessionStart", A, p), T0);
    jouer(entreeDe("SessionStart", B, p), T0 + 60_000);
    jouer(entreeDe("UserPromptSubmit", B, p, { prompt: "travail de B" }), T0 + 5 * MIN);
    att(!lignesDe(p).some((l) => l.ev === "expire") && !lignesDe(p).some((l) => l.session === B && l.role), "rouge : A vivante, rien ne doit être déclaré");
    const tour = jouer(entreeDe("UserPromptSubmit", B, p, { prompt: "suite" }), T0 + 20 * MIN);
    const l = lignesDe(p);
    att(l.some((x) => x.ev === "expire" && x.session === B && x.cible === A) && l.some((x) => x.session === B && x.role === ROLE_COORDINATRICE && !x.chemin), l.map((x) => x.ev).join());
    att(!tour.contexte, "B, seule vivante, voit encore l'état");
  });

  check("I3 vert — double revendication dans la même seconde, par les hooks : la plus petite dans l'ordre lexical prime, l'autre se range", () => {
    const p = produitJetable("i3-double");
    const Z = "zzzz9999-0000-4000-8000-000000000009";
    const s = T0 - (T0 % 1000);
    jouer(entreeDe("SessionStart", Z, p), s + 100);
    jouer(entreeDe("SessionStart", A, p), s + 600);
    const roles = lignesDe(p).filter((x) => x.role === ROLE_COORDINATRICE).map((x) => x.session);
    att(roles.join() === `${Z},${A}`, `revendications du rôle : ${roles.join()}`);
    const tourZ = jouer(entreeDe("UserPromptSubmit", Z, p, { prompt: "travail de Z" }), s + 2000);
    att(/coordinatrice : aaaa1111/.test(tourZ.contexte || "") && lignesDe(p).filter((x) => x.role === ROLE_COORDINATRICE).length === 2, tourZ.contexte);
  });

  check("I3 vert → rouge — l'identité d'un hook ne vient que de son entrée : une variable héritée de la mère n'inscrit rien et ne se pose pas", () => {
    const p = produitJetable("i3-enfant");
    const envFile = join(T, "i3-enfant-env.sh");
    const env = { CLAUDE_ENV_FILE: envFile, [VARIABLE_SESSION]: MERE, CLAUDE_CODE_SESSION_ID: MERE };
    const sansId = jouer({ hook_event_name: "SessionStart", cwd: p }, T0, env);
    att(!sansId.session && !lignesDe(p).length && !existsSync(envFile), "une identité héritée a été inscrite ou posée");
    jouer(entreeDe("SessionStart", ENFANT, p), T0 + 1000, env);
    att(lignesDe(p).map((l) => l.session).every((s) => s === ENFANT) && readFileSync(envFile, "utf8").trim() === ligneVariable(ENFANT), readFileSync(envFile, "utf8"));
    const m = join(T, "mutant-hook", "oracles"); mkdirSync(m, { recursive: true });
    for (const f of ["hook-sessions.mjs", "lib-sessions.mjs", "lib-session.mjs", "lib-decisions.mjs"]) copyFileSync(join(ICI, f), join(m, f));
    const src = readFileSync(join(m, "hook-sessions.mjs"), "utf8"), ligne = "const session = s.source === SOURCES.HOOK ? s.id : null;";
    att(src.includes(ligne), "la ligne visée par la chirurgie est introuvable : le témoin est vide");
    writeFileSync(join(m, "hook-sessions.mjs"), src.replace(ligne, "const session = s.id;"), "utf8");
    const pm = produitJetable("i3-enfant-mutant");
    const r = spawnSync(process.execPath, [join(m, "hook-sessions.mjs")], { input: JSON.stringify({ hook_event_name: "SessionStart", cwd: pm }), encoding: "utf8", env: envAvec({ [VARIABLE_SESSION]: MERE }) });
    att(r.status === 0 && lignesDe(pm).some((l) => l.session === MERE), `rouge : le mutant devait inscrire la session mère, lu ${JSON.stringify(lignesDe(pm))} ${r.stderr}`);
  });

  // Le processus réel, comme le harnais le lance : entrée standard, sortie JSON, code de sortie.
  const HOOK = join(ICI, "hook-sessions.mjs");
  const TEMP = join(T, "temp-du-poste"); mkdirSync(TEMP, { recursive: true });
  const processus = (entree, brut = null, plus = {}) => {
    const r = spawnSync(process.execPath, [HOOK], { input: brut ?? JSON.stringify(entree), encoding: "utf8", env: envAvec({ TEMP, TMP: TEMP, ...plus }) });
    let o = null; try { o = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { /* le cas le dit */ }
    return { code: r.status, sortie: o, contexte: o?.hookSpecificOutput?.additionalContext || "", err: r.stderr };
  };
  check("I3 vert → rouge — registre illisible : jamais de code 2, la panne se déclare une fois par session au contexte, jamais en fin de tour", () => {
    const p = produitJetable("i3-panne");
    writeFileSync(join(p, ...FICHIER_SESSIONS.split("/")), "{pas du json\n", "utf8");
    const un = processus(entreeDe("UserPromptSubmit", C, p, { prompt: "x" }));
    const deux = processus(entreeDe("UserPromptSubmit", C, p, { prompt: "y" }));
    att(un.code === 0 && /REGISTRE DES SESSIONS EN PANNE/.test(un.contexte) && /1 ligne\(s\) illisible\(s\)/.test(un.contexte), `${un.code} ${un.contexte} ${un.err}`);
    att(deux.code === 0 && !/EN PANNE/.test(deux.contexte), `la panne se redit : ${deux.contexte}`);
    const autre = processus(entreeDe("PreToolUse", B, p, { tool_name: "Write", tool_input: { file_path: join(p, "a.md") } }));
    att(autre.code === 0 && /EN PANNE/.test(autre.contexte), "une autre session doit recevoir sa propre déclaration");
    const pd = produitJetable("i3-panne-dossier");
    mkdirSync(join(pd, ...FICHIER_SESSIONS.split("/")));
    const stop = processus(entreeDe("Stop", A, pd));
    att(stop.code === 0 && !stop.sortie, `Stop ne porte jamais de contexte (il relancerait le tour) : ${JSON.stringify(stop.sortie)}`);
    const dossier = processus(entreeDe("UserPromptSubmit", A, pd, { prompt: "x" }));
    att(dossier.code === 0 && /EN PANNE/.test(dossier.contexte) && /illisible/.test(dossier.contexte), dossier.contexte);
    const illisible = processus(null, "pas du json");
    att(illisible.code === 0 && !illisible.sortie, `entrée illisible : exit ${illisible.code}`);
  });

  check("I3 vert — hors d'un produit (le pilot, sans forge/), le SessionStart pose l'identité et n'écrit aucun registre", () => {
    const pilot = join(T, "pilot-sans-forge"); mkdirSync(join(pilot, ".claude"), { recursive: true });
    const envFile = join(T, "pilot-env.sh");
    const r = processus(entreeDe("SessionStart", A, pilot), null, { CLAUDE_ENV_FILE: envFile, CLAUDE_PROJECT_DIR: pilot });
    att(r.code === 0 && !r.sortie && readFileSync(envFile, "utf8").trim() === ligneVariable(A) && !existsSync(join(pilot, "forge")), `${r.code} ${r.err}`);
  });

  check("I3 vert → rouge — --revendiquer : la coordinatrice revendique un fichier commun pour une session nommée ; une autre session est refusée", () => {
    const p = produitJetable("i3-revendiquer");
    jouer(entreeDe("SessionStart", A, p), Date.now() - 60_000);
    jouer(entreeDe("SessionStart", B, p), Date.now() - 30_000);
    const main = (session, ...args) => spawnSync(process.execPath, [HOOK, "--revendiquer", ...args], { cwd: p, encoding: "utf8", env: envAvec({ [VARIABLE_SESSION]: session }) });
    const ok = main(A, "forge/ledger.jsonl", "--pour", court(B));
    att(ok.status === 0 && /revendiqué pour la session bbbb2222 par la coordinatrice aaaa1111/.test(ok.stdout), `${ok.status} ${ok.stdout}${ok.stderr}`);
    att(lignesDe(p).some((l) => l.role === ROLE_COORDINATRICE && l.pour === B && l.chemin === "forge/ledger.jsonl"), "la revendication n'est pas écrite");
    const ko = main(B, "output/README.md", "--pour", court(A));
    att(ko.status === 1 && /seule la coordinatrice/.test(ko.stderr), `${ko.status} ${ko.stderr}`);
  });

  // Le budget : chaque hook rend la main en moins de 300 ms sur un registre de 1 000 lignes, mesuré par le lanceur du produit
  // (deux processus node, comme chez un produit), médiane de 5 passages par événement.
  check("I3 — budget : par le lanceur, chaque événement rend la main en moins de 300 ms (médiane de 5) sur un registre de 1 000 lignes", () => {
    const p = produitJetable("i3-banc");
    mkdirSync(join(p, "forge", "hooks"), { recursive: true });
    copyFileSync(join(ICI, "..", "gabarits", "hooks-factory.mjs"), join(p, "forge", "hooks", "factory.mjs"));
    const reg = [];
    const m = Date.now() - 2 * 3600_000;
    for (let i = 0; reg.length < 980; i++) {
      const s = `ancienne-${String(i).padStart(4, "0")}-0000-4000-8000-000000000000`;
      reg.push(ligneOpen({ session: s, racine: p, transcription: join(T, "absente", `${s}.jsonl`) }, m + i * 1000), ligneObjet({ session: s, objet: `travail ${i}` }, m + i * 1000 + 1),
        ligneRevendique({ session: s, chemin: `src/module-${i}.py` }, m + i * 1000 + 2), ligneVie({ session: s }, m + i * 1000 + 3), ligneClose({ session: s }, m + i * 1000 + 4));
    }
    for (const s of [A, B]) reg.push(ligneOpen({ session: s, racine: p }, Date.now() - 60_000), ligneObjet({ session: s, objet: `objet ${s.slice(0, 4)}` }, Date.now() - 59_000));
    while (reg.length < 1000) reg.push(ligneVie({ session: A }, Date.now() - 30_000));
    writeFileSync(join(p, ...FICHIER_SESSIONS.split("/")), reg.slice(0, 1000).map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
    const lanceur = join(p, "forge", "hooks", "factory.mjs");
    const env = envAvec({ FORGE_ROOT: resolve(ICI, "..", ".."), TEMP, TMP: TEMP, CLAUDE_ENV_FILE: join(T, "banc-env.sh") });
    const evenements = [
      ["SessionStart", {}], ["UserPromptSubmit", { prompt: "mesure du banc" }],
      ["PreToolUse", { tool_name: "Write", tool_input: { file_path: join(p, "src", "module-1.py") } }],
      ["PostToolUse", { tool_name: "Write", tool_input: { file_path: join(p, "src", "banc.py") } }], ["Stop", {}], ["SessionEnd", { reason: "other" }],
    ];
    const mesures = [];
    const auDepart = lireRegistre([p]).lignes.length;
    for (const [ev, plus] of evenements) {
      const durees = [];
      for (let k = 0; k < 5; k++) {
        const t0 = process.hrtime.bigint();
        const r = spawnSync(process.execPath, [lanceur, "sessions"], { cwd: p, input: JSON.stringify(entreeDe(ev, B, p, plus)), encoding: "utf8", env });
        durees.push(Number(process.hrtime.bigint() - t0) / 1e6);
        att(r.status === 0 && !/pilot introuvable/.test(r.stderr), `${ev} : exit ${r.status} ${r.stderr}`);
      }
      durees.sort((x, y) => x - y);
      mesures.push({ ev, mediane: Math.round(durees[2]), max: Math.round(durees[4]) });
    }
    console.log(`  [MESURE] budget, registre de ${auDepart} lignes au départ (${lireRegistre([p]).lignes.length} à la fin), par le lanceur : ${mesures.map((x) => `${x.ev} ${x.mediane} ms (max ${x.max})`).join(" ; ")}`);
    const trop = mesures.filter((x) => x.mediane >= 300);
    att(!trop.length, `au-dessus de 300 ms : ${trop.map((x) => `${x.ev} ${x.mediane} ms`).join(", ")}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(T, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nhook-sessions (D-218 (b)) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
