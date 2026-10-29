#!/usr/bin/env node
/**
 * reserver-decision.test.mjs — recette de la RÉSERVATION des numéros de décision (TF-1872, D-32 (a) du 18/10/2026), à double sens.
 * Tout se joue sur des dossiers ÉPHÉMÈRES (registre d'essai, produits jetables) : le registre du pilot n'est jamais écrit — la recette
 * compare son empreinte avant et après (I7 de self-tests.mjs).
 *
 *   1. au pilot : `--prochain` ne lit que ; la réservation rend max+1 ET l'inscrit en une opération ; la suivante rend le numéro d'après ;
 *   2. les refus : une question sans point d'interrogation, vide, un dossier qui n'est ni le pilot ni un produit, une reformulation d'un numéro non inscrit ;
 *   3. HUIT sessions qui réservent en même temps reçoivent huit numéros distincts et contigus (le verrou) ;
 *   4. chez un produit, par l'écrivain DU PRODUIT : `forge/ledger.py` (pile Python) et `ledger.mjs` (forge-agents) — entrée `question_humain`
 *      qui nomme D-N, `seq` continu, le contrôle RÉSERVATION du hook la lit (c'est le remède que son message recommande, JOUÉ) ;
 *   5. les numéros déjà affichés par le produit hors `question_humain` (une `reponse_humain` nomme D-7) relèvent le prochain numéro ; `--depuis` aussi ;
 *   6. depuis le dossier d'un produit, sans option, l'outil écrit CHEZ LE PRODUIT et jamais au pilot ;
 *   7. la reformulation d'une décision inscrite garde son numéro et ne compte pas comme un doublon ; `--verifier` nomme un vrai doublon ;
 *   8. la ressemblance sépare les collisions réelles du 18/10/2026 (D-24, D-25, D-26, D-27 : 0,00) de la même question reformulée ;
 *   9. TF-1911 (D-83 (a), 26/10/2026) : le REGISTRE COMMUN DU POSTE entre deux arbres de travail d'un même dépôt (vrais `git worktree`) — fixture rouge :
 *      D-7 réservée dans l'un, la réservation dans l'autre rend D-8, et le contrôle RÉSERVATION refuse un D-7 affiché dans le second pour une autre
 *      question (tout de suite, au hook comme par `--prejuger`) ; six réservations simultanées sur les deux arbres ne rendent jamais le même numéro ; un
 *      verrou périmé est repris, un verrou frais ne l'est pas ; le registre n'est jamais dans l'arbre ni versionné ; sans dépôt git, la réservation se fait comme avant et le dit.
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, utimesSync, realpathSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { REGISTRE_PILOT, lireRegistrePilot, ressemblance, memeQuestion, ecrivainDeLedger, numerosDuLedger, sousVerrou, VERROU_COMMUN } from "../oracles/lib-decisions.mjs";
import { registreDesDecisions, controlerReservation } from "../oracles/hook-restitution.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "reserver-decision.mjs");
const PILOT = join(ICI, "..");
const base = mkdtempSync(join(tmpdir(), "reserver-"));
const echecs = [];
let verifs = 0;
const att = (cond, msg) => { verifs++; if (!cond) echecs.push(msg); };
// Le contenu lui-même, comparé tel quel : la recette ne SCELLE rien (ni empreinte ni hachage), elle compare avant et après.
const empreinte = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "absent");
const empreintePilot = empreinte(REGISTRE_PILOT);

const lancer = (args, cwd = base, env = {}) => {
  const r = spawnSync(process.execPath, [OUTIL, ...args], { encoding: "utf8", cwd, env: { ...process.env, ...env } });
  let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
  return { code: r.status, o, brut: (r.stdout || "") + (r.stderr || "") };
};
const lancerAsync = (args, cwd) => new Promise((ok) => {
  const p = spawn(process.execPath, [OUTIL, ...args], { cwd, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; p.stdout.on("data", (d) => { out += d; }); p.on("close", (code) => { let o = null; try { o = JSON.parse(out); } catch { /* illisible */ } ok({ code, o }); });
});
const lignes = (f) => readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

// Le registre d'essai : l'amorce du 18/10/2026 en petit, collisions comprises.
const AMORCE = [
  { type: "registre", version: 1, objet: "essai" },
  { type: "decision", n: 24, question: "Puis-je enregistrer et publier l'essai de relecture d'intention ?", date: "2026-10-18", origine: "amorce", collision: true },
  { type: "decision", n: 24, question: "Faut-il faire entrer au registre le lot du 15/10 de Produit-02 ?", date: "2026-10-18", origine: "amorce", collision: true },
  { type: "decision", n: 33, question: "L'alerte du relecteur sur la consigne de l'étude Google est-elle une vraie dérive ?", date: "2026-10-18", origine: "amorce" },
].map((e) => JSON.stringify(e)).join("\n") + "\n";
const nouveauRegistre = (nom) => { const f = join(base, nom); writeFileSync(f, AMORCE, "utf8"); return f; };

try {
  // ---- 1. au pilot : lire, réserver, réserver encore
  const reg1 = nouveauRegistre("registre-1.jsonl");
  const avant1 = empreinte(reg1);
  const proch = lancer(["--prochain", "--registre-pilot", reg1]);
  att(proch.code === 0 && proch.o?.prochain === "D-34" && proch.o?.ecrit === false, `1 : --prochain doit rendre D-34 sans écrire, obtenu ${JSON.stringify(proch.o)}`);
  att(empreinte(reg1) === avant1, "1 : --prochain a modifié le registre (c'est une lecture)");
  const r1 = lancer(["--question", "Faut-il publier la version corrigée du démarrage ?", "--registre-pilot", reg1]);
  att(r1.code === 0 && r1.o?.reserve === "D-34" && r1.o?.cible === "pilot", `1 : la première réservation doit rendre D-34, obtenu ${JSON.stringify(r1.o).slice(0, 200)}`);
  const e1 = lignes(reg1).filter((x) => x.type === "decision");
  const ecrite = e1[e1.length - 1];
  att(ecrite?.n === 34 && ecrite?.origine === "reservation" && /^\d{4}-\d{2}-\d{2}T/.test(ecrite?.ts || "") && /publier la version/.test(ecrite?.question || ""),
    `1 : l'entrée écrite doit porter n=34, origine reservation, un ts ISO et la question, obtenu ${JSON.stringify(ecrite)}`);
  att(/D-34 — Faut-il publier/.test(r1.o?.a_faire || ""), "1 : la sortie doit dire QUOI afficher (« > **D-34 — <la question>** »)");
  const r1b = lancer(["--question", "Faut-il garder la version du jeudi ?", "--registre-pilot", reg1]);
  att(r1b.o?.reserve === "D-35", `1 : la seconde réservation doit rendre D-35, obtenu ${JSON.stringify(r1b.o).slice(0, 160)}`);
  att(!existsSync(reg1 + ".lock"), "1 : le verrou doit être levé après la réservation");

  // ---- 2. les refus
  const reg2 = nouveauRegistre("registre-2.jsonl"); const avant2 = empreinte(reg2);
  const sansPoint = lancer(["--question", "Publier la version corrigée du démarrage maintenant", "--registre-pilot", reg2]);
  att(sansPoint.code === 1 && /point d'interrogation/.test(sansPoint.o?.message || ""), `2 : une question sans point d'interrogation doit être refusée en le disant, obtenu ${sansPoint.code} ${JSON.stringify(sansPoint.o).slice(0, 160)}`);
  const vide = lancer(["--question", "?", "--registre-pilot", reg2]);
  att(vide.code === 1, `2 : une question vide doit être refusée, obtenu ${vide.code}`);
  const sansQuestion = lancer(["--registre-pilot", reg2]);
  att(sansQuestion.code === 2, `2 : sans --question ni --prochain, l'outil rend l'usage (exit 2), obtenu ${sansQuestion.code}`);
  const dehors = join(base, "dossier-quelconque"); mkdirSync(dehors, { recursive: true });
  const horsLieu = lancer(["--question", "Faut-il publier la version corrigée du démarrage ?"], dehors);
  att(horsLieu.code === 2 && /ni le pilot ni un produit/.test(horsLieu.o?.message || ""), `2 : depuis un dossier qui n'est ni le pilot ni un produit, l'outil refuse et dit pourquoi, obtenu ${horsLieu.code} ${JSON.stringify(horsLieu.o).slice(0, 160)}`);
  const reformNonInscrit = lancer(["--reformuler", "D-99", "--question", "Faut-il publier la version corrigée ?", "--registre-pilot", reg2]);
  att(reformNonInscrit.code === 1 && /n'est pas inscrite/.test(reformNonInscrit.o?.message || ""), `2 : reformuler un numéro non inscrit doit être refusé, obtenu ${reformNonInscrit.code} ${JSON.stringify(reformNonInscrit.o).slice(0, 160)}`);
  att(empreinte(reg2) === avant2, "2 : un refus ne doit rien écrire");

  // ---- 3. huit sessions en même temps
  const reg3 = nouveauRegistre("registre-3.jsonl");
  const huit = await Promise.all(Array.from({ length: 8 }, (_, i) => lancerAsync(["--question", `Faut-il traiter le sujet numéro ${i} de la session ${i} ?`, "--registre-pilot", reg3], base)));
  const numeros3 = huit.map((r) => r.o?.n).sort((a, b) => a - b);
  att(huit.every((r) => r.code === 0) && numeros3.join() === "34,35,36,37,38,39,40,41", `3 : huit réservations simultanées doivent rendre 34 à 41 sans doublon ni trou, obtenu ${numeros3.join()} (codes ${huit.map((r) => r.code).join()})`);
  const ecrits3 = lignes(reg3).filter((x) => x.type === "decision" && x.origine === "reservation").map((x) => x.n).sort((a, b) => a - b);
  att(ecrits3.join() === "34,35,36,37,38,39,40,41", `3 : le registre doit porter les huit numéros, obtenu ${ecrits3.join()}`);

  // ---- 4. chez un produit, par l'écrivain du produit
  const PYTHON = ["python", "python3", "py"].find((bin) => { const r = spawnSync(bin, ["--version"], { encoding: "utf8" }); return !r.error && r.status === 0; });
  const LEDGER_GABARIT = readFileSync(join(PILOT, "gabarits", "ledger.py"), "utf8");
  let nProd = 0;
  const produit = (sorte) => {
    const d = join(base, `produit-${++nProd}-${sorte}`);
    mkdirSync(join(d, "forge", "retours"), { recursive: true });
    if (sorte === "python") {
      writeFileSync(join(d, "forge", "ledger.py"), LEDGER_GABARIT, "utf8");
      spawnSync(PYTHON, [join(d, "forge", "ledger.py"), "run_open", "--run_id", "essai"], { encoding: "utf8", cwd: d, env: { ...process.env, PYTHONUTF8: "1" } });
    } else writeFileSync(join(d, "forge", "ledger.jsonl"), JSON.stringify({ seq: 1, ts: "2026-10-18T10:00:00.000Z", type: "run_open", run_id: "essai" }) + "\n", "utf8");
    return d;
  };
  const sortes = [];
  if (PYTHON) sortes.push("python"); else echecs.push("4 : aucun interpréteur Python sur ce poste — l'écrivain forge/ledger.py n'est pas rejoué");
  if (ecrivainDeLedger(join(base, "sans-ledger-py"))) sortes.push("node"); else console.log("hors périmètre de ce poste : ledger.mjs de forge-agents introuvable sous la racine du parc — écrivain node non rejoué");
  for (const sorte of sortes) {
    const d = produit(sorte);
    const a = lancer(["--question", "Faut-il publier la version corrigée du démarrage ?", "--produit", d]);
    att(a.code === 0 && a.o?.reserve === "D-1" && a.o?.cible === "produit", `4 (${sorte}) : la première réservation chez un produit sans décision doit rendre D-1, obtenu ${a.code} ${JSON.stringify(a.o || a.brut).slice(0, 240)}`);
    const b = lancer(["--question", "Faut-il garder la version du jeudi ?", "--produit", d]);
    att(b.o?.reserve === "D-2", `4 (${sorte}) : la seconde réservation doit rendre D-2, obtenu ${JSON.stringify(b.o || b.brut).slice(0, 200)}`);
    const l = lignes(join(d, "forge", "ledger.jsonl"));
    att(l.map((x) => x.seq).join() === "1,2,3", `4 (${sorte}) : le ledger doit rester numéroté 1,2,3 (écrivain du produit), obtenu ${l.map((x) => x.seq).join()}`);
    att(l[1]?.type === "question_humain" && l[1]?.decisions_posees?.["D-1"] === "Faut-il publier la version corrigée du démarrage ?", `4 (${sorte}) : l'entrée doit être une question_humain au champ decisions_posees, obtenu ${JSON.stringify(l[1])}`);
    att(!existsSync(join(d, "forge", "decisions.lock")) && !existsSync(join(d, "forge", "ledger.jsonl.lock")), `4 (${sorte}) : aucun verrou ne doit rester`);
    // le REMÈDE que le message du contrôle recommande est joué : D-1 est réservée, donc le contrôle RÉSERVATION du hook la lit
    att(registreDesDecisions(d).numeros.has("1") && registreDesDecisions(d).numeros.has("2"), `4 (${sorte}) : le contrôle RÉSERVATION du hook doit lire D-1 et D-2 dans le registre écrit par l'outil`);
    const TETE = (n) => `## 3. Décisions attendues\n\n> **D-${n} — Faut-il publier la version corrigée du démarrage ?**\n> - **Recommandation : (a)**\n\n`;
    att(controlerReservation({ dernierTexte: TETE(1), racine: d }).verdict === "PASS", `4 (${sorte}) : D-1 réservée par l'outil doit passer le contrôle RÉSERVATION`);
    att(controlerReservation({ dernierTexte: TETE(3), racine: d }).verdict === "FAIL", `4 (${sorte}) : D-3, jamais réservée, doit être refusée par le contrôle RÉSERVATION (le contrôle n'est pas vide)`);
    // quatre sessions du même produit en même temps
    const quatre = await Promise.all(Array.from({ length: 4 }, (_, i) => lancerAsync(["--question", `Faut-il traiter le sujet ${i} du produit ?`, "--produit", d], base)));
    const ns = quatre.map((r) => r.o?.n).sort((x, y) => x - y);
    att(quatre.every((r) => r.code === 0) && ns.join() === "3,4,5,6", `4 (${sorte}) : quatre réservations simultanées chez le produit doivent rendre 3 à 6, obtenu ${ns.join()} (codes ${quatre.map((r) => r.code).join()})`);
    att(lignes(join(d, "forge", "ledger.jsonl")).map((x) => x.seq).join() === "1,2,3,4,5,6,7", `4 (${sorte}) : le ledger doit rester numéroté 1 à 7 après les réservations simultanées`);

    // ---- 5. un numéro déjà affiché ailleurs qu'en question_humain relève le prochain ; --depuis aussi
    const e = produit(sorte);
    const ajout = JSON.stringify({ seq: 2, ts: "2026-10-18T10:00:01.000Z", type: "reponse_humain", portee: "D-7" });
    writeFileSync(join(e, "forge", "ledger.jsonl"), readFileSync(join(e, "forge", "ledger.jsonl"), "utf8") + ajout + "\n", "utf8");
    const apres7 = lancer(["--question", "Faut-il passer à la suite du chantier ?", "--produit", e]);
    att(apres7.o?.reserve === "D-8", `5 (${sorte}) : D-7 déjà répondue au ledger, la réservation doit rendre D-8, obtenu ${JSON.stringify(apres7.o || apres7.brut).slice(0, 200)}`);
    const depuis = lancer(["--question", "Faut-il lancer la seconde vague du chantier ?", "--produit", e, "--depuis", "20"]);
    att(depuis.o?.reserve === "D-21", `5 (${sorte}) : --depuis 20 doit rendre D-21, obtenu ${JSON.stringify(depuis.o || depuis.brut).slice(0, 200)}`);

    // ---- 6. depuis le dossier du produit, sans option : chez le produit, jamais au pilot
    const f = produit(sorte);
    const sansOption = lancer(["--question", "Faut-il publier la version corrigée du démarrage ?"], join(f, "forge"));
    att(sansOption.code === 0 && sansOption.o?.cible === "produit" && sansOption.o?.reserve === "D-1", `6 (${sorte}) : depuis forge/ d'un produit, sans --produit, l'outil écrit chez le produit, obtenu ${sansOption.code} ${JSON.stringify(sansOption.o || sansOption.brut).slice(0, 200)}`);
    att(numerosDuLedger(f).numeros.has("1"), `6 (${sorte}) : D-1 doit être au ledger du produit`);

    // ---- 6 bis. TF-1961 : un ledger né vide ne reprend pas un numéro déjà AFFICHÉ dans une restitution du produit
    const g = produit(sorte);
    mkdirSync(join(g, "output", "04-plans"), { recursive: true });
    writeFileSync(join(g, "output", "04-plans", "Produit - Synthese - Lot 1 - 20261002a.md"),
      "## 3. Décisions attendues\n\n> **D-71 — Faut-il ouvrir le lot 2 ?**\n> - **Recommandation : (a)**\n\nLa suite dépendra de la réponse, comme pour D-90 évoquée en prose.\n", "utf8");
    const apres71 = lancer(["--question", "Faut-il publier le lot 1 ?", "--produit", g]);
    att(apres71.o?.reserve === "D-72", `6 bis (${sorte}) : D-71 affichée dans une restitution, la réservation doit rendre D-72 (une mention en prose de D-90 ne compte pas), obtenu ${JSON.stringify(apres71.o || apres71.brut).slice(0, 200)}`);
  }
  att(empreinte(REGISTRE_PILOT) === empreintePilot, "6 : le registre du pilot a été modifié par la recette (elle ne doit jamais l'écrire)");

  // ---- 7. reformulation et vérification
  const reg7 = nouveauRegistre("registre-7.jsonl");
  const rf = lancer(["--reformuler", "D-33", "--question", "Le relecteur a-t-il raison de signaler une dérive sur la consigne de l'étude Google ?", "--registre-pilot", reg7]);
  att(rf.code === 0 && rf.o?.reformule === "D-33", `7 : reformuler D-33 inscrite doit réussir, obtenu ${rf.code} ${JSON.stringify(rf.o || rf.brut).slice(0, 200)}`);
  const lu7 = lireRegistrePilot(reg7);
  att(lu7.entrees.filter((x) => x.n === 33).length === 2 && lu7.entrees.at(-1).origine === "reformulation", "7 : la reformulation doit s'inscrire sous le MÊME numéro, avec origine reformulation");
  att(lancer(["--prochain", "--registre-pilot", reg7]).o?.prochain === "D-34", "7 : une reformulation ne consomme pas de numéro");
  const v1 = lancer(["--verifier", "--registre-pilot", reg7]);
  att(v1.code === 0 && v1.o?.verdict === "PASS", `7 : le registre d'amorce (collisions déclarées, reformulation) doit passer --verifier, obtenu ${v1.code} ${JSON.stringify(v1.o).slice(0, 220)}`);
  writeFileSync(reg7, readFileSync(reg7, "utf8") + JSON.stringify({ type: "decision", n: 33, question: "Faut-il autre chose, sans aucun rapport ?", date: "2026-10-18", origine: "reservation" }) + "\n", "utf8");
  const v2 = lancer(["--verifier", "--registre-pilot", reg7]);
  att(v2.code === 1 && v2.o?.verdict === "FAIL" && v2.o?.doublons?.[0]?.n === 33, `7 : D-33 prise pour deux questions sans lien doit être nommée par --verifier, obtenu ${v2.code} ${JSON.stringify(v2.o).slice(0, 220)}`);

  // ---- 8. la ressemblance, sur les VRAIS numéros du registre du pilot (lecture seule)
  const reel = lireRegistrePilot();
  const parNumero = new Map(); for (const e of reel.entrees) { if (!parNumero.has(e.n)) parNumero.set(e.n, []); parNumero.get(e.n).push(e); }
  let collisionsReelles = 0, pireCollision = 0;
  for (const [, es] of parNumero) for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) { collisionsReelles++; pireCollision = Math.max(pireCollision, ressemblance(es[i].question, es[j].question)); }
  att(reel.entrees.length >= 20 && collisionsReelles >= 4, `8 : le registre amorcé doit porter au moins 20 entrées et 4 collisions du 18/10 (D-24, D-25, D-26, D-27), obtenu ${reel.entrees.length} / ${collisionsReelles}`);
  att(pireCollision < 0.5, `8 : deux questions réellement différentes posées sous le même numéro ne doivent pas se ressembler (pire : ${pireCollision.toFixed(2)}, seuil 0,5)`);
  att(memeQuestion("Faut-il publier la version corrigée du démarrage ?", "Faut-il publier maintenant la version corrigée du démarrage ?"), "8 : la même question à un mot près doit être reconnue");
  att(!memeQuestion("Puis-je enregistrer et publier l'essai de relecture d'intention ?", "Puis-je enregistrer et publier la boucle de correction, le relecteur renforcé et le nouveau seuil ?"),
    "8 : deux « Puis-je enregistrer et publier … » sur des sujets différents (D-24 et D-27 du 18/10) ne doivent PAS être confondues par les deux mots d'ouverture qu'elles partagent");

  // ---- 9. TF-1911 (D-83 (a), 26/10/2026) : LE REGISTRE COMMUN DU POSTE, entre arbres de travail d'un même dépôt
  // Le fait : D-155, D-156 et D-159 prises deux fois les 18 et 19/10 chez un même produit, chaque fois entre deux arbres de travail (git worktree).
  // Fixture rouge : D-7 réservée dans l'arbre A, réservation dans l'arbre B → D-8 (avant TF-1911 : D-7 une seconde fois), et le contrôle refuse un D-7 affiché
  // dans B pour une autre question. Joué avec de VRAIS dépôts git et de vrais `git worktree`, par chaque écrivain de ledger disponible.
  const gitDispo = spawnSync("git", ["--version"], { encoding: "utf8" });
  if (gitDispo.error || gitDispo.status !== 0) echecs.push("9 : git est introuvable sur ce poste — le registre commun du poste n'est pas rejoué");
  else {
    const git = (cwd, ...a) => spawnSync("git", ["-c", "user.name=essai", "-c", "user.email=essai@example.invalid", "-c", "commit.gpgsign=false", "-c", "core.longpaths=true", ...a], { cwd, encoding: "utf8" });
    const reel = (p) => realpathSync.native(p).toLowerCase();
    const communDe = (d) => resolve(d, git(d, "rev-parse", "--git-common-dir").stdout.trim());
    const TETE9 = (n, q) => `## 3. Décisions attendues\n\n> **D-${n} — ${q}**\n> - **Recommandation : (a)**\n\n`;
    const Q_A = "Faut-il publier la version corrigée du démarrage ?", Q_AUTRE = "Peut-on retirer l'ancien gabarit des pages du site ?", Q_B = "Faut-il garder la version du jeudi ?";
    const bloquantsDuHook = (d, texte, nom, env = {}) => {
      const f = join(base, nom + ".md"); writeFileSync(f, texte, "utf8");
      // sans la session qui joue la recette : --prejuger relirait SA transcription, où une D-7 citée n'est plus « nouvelle »
      const sansSession = { ...process.env, ...env }; delete sansSession.CLAUDE_CODE_SESSION_ID;
      const r = spawnSync(process.execPath, [join(PILOT, "oracles", "hook-restitution.mjs"), "--prejuger", f], { encoding: "utf8", cwd: d, env: sansSession });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    const sortes9 = [];
    if (PYTHON) sortes9.push("python");
    if (ecrivainDeLedger(join(base, "sans-ledger-py"))) sortes9.push("node");
    for (const sorte of sortes9) {
      const A = join(base, `depot-commun-${sorte}`), B = join(base, `arbre-b-${sorte}`);
      mkdirSync(join(A, "forge", "retours"), { recursive: true });
      writeFileSync(join(A, "forge", "retours", ".gitkeep"), "", "utf8");
      if (sorte === "python") {
        writeFileSync(join(A, "forge", "ledger.py"), LEDGER_GABARIT, "utf8");
        spawnSync(PYTHON, [join(A, "forge", "ledger.py"), "run_open", "--run_id", "essai"], { encoding: "utf8", cwd: A, env: { ...process.env, PYTHONUTF8: "1" } });
      } else writeFileSync(join(A, "forge", "ledger.jsonl"), JSON.stringify({ seq: 1, ts: "2026-10-18T10:00:00.000Z", type: "run_open", run_id: "essai" }) + "\n", "utf8");
      // D-6 déjà répondue au ledger : la première réservation rend D-7 (le cas de la consigne).
      writeFileSync(join(A, "forge", "ledger.jsonl"), readFileSync(join(A, "forge", "ledger.jsonl"), "utf8") + JSON.stringify({ seq: 2, ts: "2026-10-18T10:00:01.000Z", type: "reponse_humain", portee: "D-6" }) + "\n", "utf8");
      const init = [git(A, "init", "-q"), git(A, "add", "-A"), git(A, "commit", "-q", "-m", "essai"), git(A, "worktree", "add", "-q", "-b", "arbre-b", B)];
      att(init.every((r) => r.status === 0), `9 (${sorte}) : le dépôt d'essai et son second arbre de travail doivent se créer, obtenu ${init.map((r) => r.status + " " + (r.stderr || "").trim().slice(0, 80)).join(" | ")}`);
      att(existsSync(join(B, "forge", "retours")) && existsSync(join(B, "forge", "ledger.jsonl")), `9 (${sorte}) : le second arbre doit porter son propre forge/ledger.jsonl`);
      const commun = join(communDe(A), "forge-decisions.jsonl");
      att(reel(communDe(A)) === reel(communDe(B)), `9 (${sorte}) : les deux arbres doivent partager le MÊME dossier git commun`);

      // la fixture rouge : D-7 dans A, puis la réservation dans B rend D-8
      const a7 = lancer(["--question", Q_A, "--produit", A]);
      att(a7.code === 0 && a7.o?.reserve === "D-7", `9 (${sorte}) : dans A (D-6 répondue), la réservation doit rendre D-7, obtenu ${a7.code} ${JSON.stringify(a7.o || a7.brut).slice(0, 220)}`);
      att(existsSync(commun) && reel(a7.o?.registre_commun || commun) === reel(commun), `9 (${sorte}) : le registre commun doit être rangé dans le dossier git commun (${commun}), obtenu ${a7.o?.registre_commun}`);
      att(!existsSync(join(A, "forge-decisions.jsonl")) && !git(A, "ls-files").stdout.includes("forge-decisions"), `9 (${sorte}) : le registre commun ne doit jamais être dans l'arbre de travail ni versionné`);
      const avantB = empreinte(commun);
      const proB = lancer(["--prochain", "--produit", B]);
      att(proB.o?.prochain === "D-8" && empreinte(commun) === avantB, `9 (${sorte}) : --prochain dans B doit rendre D-8 (l'union du registre commun et du ledger) sans rien écrire, obtenu ${JSON.stringify(proB.o || proB.brut).slice(0, 200)}`);
      att(!numerosDuLedger(B).numeros.has("7"), `9 (${sorte}) : le ledger de B ne nomme PAS D-7 (c'est ce qui rendait la collision possible)`);
      const b8 = lancer(["--question", Q_B, "--produit", B]);
      att(b8.code === 0 && b8.o?.reserve === "D-8", `9 (${sorte}) : FIXTURE ROUGE — D-7 réservée dans A, la réservation dans B doit rendre D-8, obtenu ${b8.code} ${JSON.stringify(b8.o || b8.brut).slice(0, 220)}`);
      att(numerosDuLedger(B).numeros.has("8") && !numerosDuLedger(A).numeros.has("8"), `9 (${sorte}) : D-8 s'inscrit au ledger de B (trace versionnée conservée) et pas à celui de A`);
      const lus = lireRegistrePilot(commun).entrees;
      att(lus.map((e) => e.n).join() === "7,8" && lus[0].origine === "reservation" && lus[0].question === Q_A && lus[1].question === Q_B && /^\d{4}-\d{2}-\d{2}T/.test(lus[0].ts || "") && lus[0].arbre && lus[1].arbre && lus[0].arbre !== lus[1].arbre,
        `9 (${sorte}) : le registre commun doit porter D-7 (A) et D-8 (B) avec question, ts et arbre, obtenu ${JSON.stringify(lus).slice(0, 300)}`);

      // le contrôle de fin de tour : un D-7 affiché dans B pour une AUTRE question est refusé — tout de suite, sans attendre l'échéance de TF-1849
      const avantEcheance = new Date("2026-01-01T00:00:00Z");
      const c7B = controlerReservation({ dernierTexte: TETE9(7, Q_AUTRE), racine: B, maintenant: avantEcheance });
      att(c7B.verdict === "FAIL" && c7B.bloquant === true && c7B.prises?.join() === "D-7" && /DÉJÀ PRISE au registre commun/.test(c7B.ecarts.join()),
        `9 (${sorte}) : D-7 affiché dans B pour une autre question doit être REFUSÉ (prise au registre commun), obtenu ${JSON.stringify(c7B).slice(0, 320)}`);
      att(controlerReservation({ dernierTexte: TETE9(7, Q_A), racine: A, maintenant: avantEcheance }).verdict === "PASS", `9 (${sorte}) : D-7 affiché dans A pour SA question doit passer`);
      att(controlerReservation({ dernierTexte: TETE9(7, "Faut-il publier maintenant la version corrigée du démarrage ?"), racine: A, maintenant: avantEcheance }).verdict === "PASS", `9 (${sorte}) : la même question à un mot près doit passer`);
      att(controlerReservation({ dernierTexte: TETE9(8, Q_B), racine: B, maintenant: avantEcheance }).verdict === "PASS", `9 (${sorte}) : D-8 affiché dans B pour SA question doit passer`);
      const c7Meme = controlerReservation({ dernierTexte: TETE9(7, Q_A), racine: B, maintenant: avantEcheance });
      att(c7Meme.prises.length === 0, `9 (${sorte}) : la MÊME question affichée dans B n'est pas une collision (prises vide), obtenu ${JSON.stringify(c7Meme.prises)}`);
      // le hook lui-même (--prejuger), échéance de TF-1849 repoussée en 2099 : la collision bloque quand même
      const hook7 = bloquantsDuHook(B, TETE9(7, Q_AUTRE), `brouillon-9-${sorte}`, { FORGE_RESERVATION_BLOQUANTE_DES: "2099-01-01" });
      att(hook7.code === 1 && (hook7.o?.bloquants || []).some((x) => /^RÉSERVATION — D-7 est DÉJÀ PRISE au registre commun/.test(x)) && hook7.o?.reservation?.prises?.join() === "D-7",
        `9 (${sorte}) : --prejuger dans B doit refuser D-7 (RÉSERVATION, prise au registre commun), obtenu ${hook7.code} ${JSON.stringify(hook7.o).slice(0, 300)}`);
      // le REMÈDE que le message recommande, joué : un numéro réservé par l'outil
      const remede = lancer(["--question", Q_AUTRE, "--produit", B]);
      att(remede.o?.reserve === "D-9" && controlerReservation({ dernierTexte: TETE9(9, Q_AUTRE), racine: B, maintenant: avantEcheance }).verdict === "PASS",
        `9 (${sorte}) : le remède (réserver par l'outil, afficher le numéro rendu) doit rendre D-9 et passer le contrôle, obtenu ${JSON.stringify(remede.o || remede.brut).slice(0, 200)}`);

      // concurrence : trois réservations dans A et trois dans B au même instant ne rendent jamais le même numéro
      const six = await Promise.all(Array.from({ length: 6 }, (_, i) => lancerAsync(["--question", `Faut-il traiter le sujet ${i} du chantier ${i % 2 ? "B" : "A"} ?`, "--produit", i % 2 ? B : A], base)));
      const ns6 = six.map((r) => r.o?.n).sort((x, y) => x - y);
      att(six.every((r) => r.code === 0) && ns6.join() === "10,11,12,13,14,15", `9 (${sorte}) : six réservations simultanées réparties sur deux arbres doivent rendre 10 à 15 sans doublon ni trou, obtenu ${ns6.join()} (codes ${six.map((r) => r.code).join()})`);
      const ecrits6 = lireRegistrePilot(commun).entrees.map((e) => e.n).sort((x, y) => x - y);
      att(ecrits6.join() === "7,8,9,10,11,12,13,14,15", `9 (${sorte}) : le registre commun doit porter 7 à 15 une seule fois chacun, obtenu ${ecrits6.join()}`);
      const seqs = (d) => lignes(join(d, "forge", "ledger.jsonl")).map((x) => x.seq);
      att(seqs(A).every((s, i) => s === i + 1) && seqs(B).every((s, i) => s === i + 1), `9 (${sorte}) : les deux ledgers doivent rester numérotés sans trou ni doublon, obtenu A ${seqs(A).join()} / B ${seqs(B).join()}`);
      att(![A, B].some((d) => existsSync(join(d, "forge", "decisions.lock")) || existsSync(join(d, "forge", "ledger.jsonl.lock"))) && !existsSync(commun + ".lock"), `9 (${sorte}) : aucun verrou ne doit rester`);

      // un verrou PÉRIMÉ (processus mort, plus de 30 s) est repris ; le délai écrit est VERROU_COMMUN.perimeMs
      writeFileSync(commun + ".lock", "", "utf8");
      const vieux = new Date(Date.now() - 2 * 60_000); utimesSync(commun + ".lock", vieux, vieux);
      const apresPerime = lancer(["--question", "Faut-il reprendre un verrou laissé par un processus mort ?", "--produit", A]);
      att(apresPerime.code === 0 && apresPerime.o?.reserve === "D-16" && !existsSync(commun + ".lock"), `9 (${sorte}) : un verrou vieux de 2 minutes (délai de péremption ${VERROU_COMMUN.perimeMs / 1000} s) doit être repris, obtenu ${apresPerime.code} ${JSON.stringify(apresPerime.o || apresPerime.brut).slice(0, 200)}`);

      // --verifier chez un produit : le registre commun sans doublon passe, un numéro pris pour deux questions sans lien est nommé
      const v9 = lancer(["--verifier", "--produit", B]);
      att(v9.code === 0 && v9.o?.verdict === "PASS" && v9.o?.registre_commun_entrees === 10, `9 (${sorte}) : --verifier chez B doit passer sur 10 entrées, obtenu ${v9.code} ${JSON.stringify(v9.o || v9.brut).slice(0, 220)}`);
      writeFileSync(commun, readFileSync(commun, "utf8") + JSON.stringify({ type: "decision", n: 7, question: "Faut-il autre chose, sans aucun rapport avec le reste ?", date: "2026-10-26", origine: "reservation" }) + "\n", "utf8");
      const v9b = lancer(["--verifier", "--produit", A]);
      att(v9b.code === 1 && v9b.o?.verdict === "FAIL" && v9b.o?.doublons_registre_commun?.[0]?.n === 7, `9 (${sorte}) : D-7 prise pour deux questions sans lien doit être nommée par --verifier, obtenu ${v9b.code} ${JSON.stringify(v9b.o || v9b.brut).slice(0, 220)}`);
    }

    // sans dépôt git (dossier temporaire) : la réservation se fait comme avant ET dit que le registre commun est indisponible
    if (sortes9.length) {
      const sorte = sortes9[0];
      const nu = join(base, `produit-sans-git-${sorte}`);
      mkdirSync(join(nu, "forge", "retours"), { recursive: true });
      if (sorte === "python") { writeFileSync(join(nu, "forge", "ledger.py"), LEDGER_GABARIT, "utf8"); spawnSync(PYTHON, [join(nu, "forge", "ledger.py"), "run_open", "--run_id", "essai"], { encoding: "utf8", cwd: nu, env: { ...process.env, PYTHONUTF8: "1" } }); }
      else writeFileSync(join(nu, "forge", "ledger.jsonl"), JSON.stringify({ seq: 1, ts: "2026-10-18T10:00:00.000Z", type: "run_open", run_id: "essai" }) + "\n", "utf8");
      const sansGit = lancer(["--question", Q_A, "--produit", nu]);
      att(sansGit.code === 0 && sansGit.o?.reserve === "D-1" && sansGit.o?.registre_commun === null && /n'est pas dans un dépôt git/.test(sansGit.o?.registre_commun_indisponible || ""),
        `9 : sans dépôt git, la réservation se fait comme avant (D-1) et DIT que le registre commun est indisponible, obtenu ${sansGit.code} ${JSON.stringify(sansGit.o || sansGit.brut).slice(0, 260)}`);
    }
    // les options du verrou : un verrou frais n'est pas repris, un verrou périmé l'est ; sans options, les valeurs d'avant (le registre du pilot ne change pas)
    const lockEssai = join(base, "essai-verrou.lock");
    writeFileSync(lockEssai, "", "utf8");
    let refuse = null; try { sousVerrou(lockEssai, () => "pris", { essais: 3, pauseMs: 10, perimeMs: 60_000 }); } catch (e) { refuse = e.message; }
    att(/verrou non obtenu/.test(refuse || "") && existsSync(lockEssai), `9 : un verrou FRAIS ne doit pas être repris (refus attendu, verrou intact), obtenu ${refuse}`);
    const tresVieux = new Date(Date.now() - 5000); utimesSync(lockEssai, tresVieux, tresVieux);
    att(sousVerrou(lockEssai, () => "pris", { essais: 3, pauseMs: 10, perimeMs: 1000 }) === "pris" && !existsSync(lockEssai), "9 : un verrou plus vieux que le délai écrit doit être repris puis levé");
  }
  att(empreinte(REGISTRE_PILOT) === empreintePilot, "9 : le registre du pilot a été modifié par la recette (elle ne doit jamais l'écrire)");
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 240)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error("reserver-decision : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log(`reserver-decision : ${verifs}/${verifs} — cas rouges joués et refusés (une question sans point d'interrogation, une question vide, un dossier ni pilot ni produit, une reformulation d'un numéro non inscrit, un doublon sous le même numéro, huit sessions sans verrou : le mutant donne 34,34,35…) ; le prochain numéro libre est rendu ET inscrit en une opération sous verrou (huit sessions simultanées : huit numéros distincts), au pilot (decisions/REGISTRE.jsonl) comme chez un produit par l'écrivain de SON ledger (forge/ledger.py, ledger.mjs : entrée question_humain lue par le contrôle RÉSERVATION), un numéro déjà répondu au ledger relève le suivant, la reformulation garde son numéro, les refus (sans point d'interrogation, hors pilot et produit) n'écrivent rien, et la ressemblance sépare les quatre collisions réelles du 18/10/2026 de la même question reformulée ; et, entre deux arbres de travail d'un même dépôt (TF-1911, D-83 (a)), D-7 réservée dans l'un la réservation dans l'autre rend D-8, le contrôle RÉSERVATION refuse un D-7 affiché dans le second pour une autre question, six réservations simultanées ne rendent jamais le même numéro, un verrou périmé est repris, et le registre commun reste hors de l'arbre`);
