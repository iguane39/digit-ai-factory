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
 *   8. la ressemblance sépare les collisions réelles du 18/10/2026 (D-24, D-25, D-26, D-27 : 0,00) de la même question reformulée.
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { REGISTRE_PILOT, lireRegistrePilot, ressemblance, memeQuestion, ecrivainDeLedger, numerosDuLedger } from "../oracles/lib-decisions.mjs";
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
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 240)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error("reserver-decision : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log(`reserver-decision : ${verifs}/${verifs} — cas rouges joués et refusés (une question sans point d'interrogation, une question vide, un dossier ni pilot ni produit, une reformulation d'un numéro non inscrit, un doublon sous le même numéro, huit sessions sans verrou : le mutant donne 34,34,35…) ; le prochain numéro libre est rendu ET inscrit en une opération sous verrou (huit sessions simultanées : huit numéros distincts), au pilot (decisions/REGISTRE.jsonl) comme chez un produit par l'écrivain de SON ledger (forge/ledger.py, ledger.mjs : entrée question_humain lue par le contrôle RÉSERVATION), un numéro déjà répondu au ledger relève le suivant, la reformulation garde son numéro, les refus (sans point d'interrogation, hors pilot et produit) n'écrivent rien, et la ressemblance sépare les quatre collisions réelles du 18/10/2026 de la même question reformulée`);
