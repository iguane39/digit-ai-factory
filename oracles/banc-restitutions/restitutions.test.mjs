#!/usr/bin/env node
/**
 * restitutions.test.mjs — recette à double sens du banc des restitutions refusées (TF-1551). Joué par
 * `oracles\self-tests.mjs` (I2).
 *
 * Les transcriptions de la recette sont SYNTHÉTIQUES (aucun texte réel n'entre dans le dépôt) et reprennent la forme
 * mesurée le 12/10/2026 : un message utilisateur « Stop hook feedback: » suivi de sa pièce jointe `hook_blocking_error`
 * qui le double, puis la réécriture. Le juge d'aujourd'hui est une fabrique, pour que chaque taux soit connu d'avance.
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { extraire, lireMotif, rejouer, extraireDossiers } from "./restitutions.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const RAISON = (regles, plus = "") => `[hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale :\n${regles.map((r) => `${r} — motif de ${r}`).join("\n")}${plus ? `\n(à corriger au passage, non bloquant : ${plus})` : ""}\n\nRéécris ta réponse finale au format gabarits\\RESTITUTION.md (v2.27.0) : bloc 0 …`;
const assistant = (t) => JSON.stringify({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: t }] } });
const humain = (t) => JSON.stringify({ type: "user", message: { role: "user", content: t } });
const outil = () => JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: "x", content: "ok" }] } });
const retour = (raison) => JSON.stringify({ type: "user", message: { role: "user", content: `Stop hook feedback:\n${raison}` } });
const piece = (raison) => JSON.stringify({ type: "attachment", attachment: { type: "hook_blocking_error", hookName: "Stop", blockingError: { blockingError: raison } } });
const jsonl = (...l) => l.join("\n") + "\n";

try {
  check("motif — règles bloquantes nommées, règles signalées au passage, version du gabarit", () => {
    const m = lireMotif(RAISON(["S1", "S3"], "S2, S51"));
    att(m.bloquantes.join() === "S1,S3" && m.signalees.join() === "S2,S51" && m.version === "2.27.0", JSON.stringify(m));
    att(lireMotif(RAISON(["AFFICHAGE", "GESTE"])).bloquantes.join() === "AFFICHAGE,GESTE", "motifs contextuels");
    att(lireMotif("autre chose").bloquantes.length === 0, "un texte sans motif ne nomme rien");
  });

  check("extraction — un refus rend le texte refusé et le texte rendu ensuite, la pièce jointe qui le double est ignorée", () => {
    const t = jsonl(humain("fais le travail"), outil(), assistant("TEXTE REFUSE un"), retour(RAISON(["S1", "S4"], "S2")), piece(RAISON(["S1", "S4"], "S2")), assistant("TEXTE RENDU un"), humain("merci"));
    const r = extraire(t, "abcd1234");
    att(r.length === 1, `${r.length} refus au lieu de 1 (le doublon n'est pas ignoré ?)`);
    att(r[0].refuse === "TEXTE REFUSE un" && r[0].accepte === "TEXTE RENDU un", JSON.stringify(r[0]));
    att(r[0].regles_bloquantes.join() === "S1,S4" && r[0].regles_signalees.join() === "S2" && r[0].version_gabarit === "2.27.0", "étiquettes");
    att(r[0].id.startsWith("abcd1234#"), "identifiant de refus");
  });
  check("extraction — une chaîne de deux refus : le texte accepté revient au DERNIER refus, jamais au premier", () => {
    const t = jsonl(humain("go"), assistant("PREMIER JET"), retour(RAISON(["S1"])), assistant("SECOND JET"), retour(RAISON(["S3"])), assistant("TROISIEME JET"), humain("ok"));
    const r = extraire(t);
    att(r.length === 2 && r[0].accepte === null && r[1].accepte === "TROISIEME JET", JSON.stringify(r.map((x) => [x.refuse, x.accepte])));
    att(r[1].refuse === "SECOND JET", "le second refus porte le second jet");
  });
  check("extraction — un refus sans texte rendu avant la fin de la transcription n'a pas de texte accepté, et rien n'est inventé", () => {
    const r = extraire(jsonl(humain("go"), assistant("JET"), retour(RAISON(["S1"]))));
    att(r.length === 1 && r[0].accepte === null, JSON.stringify(r));
  });
  check("extraction — un retour d'un AUTRE hook, ou sans texte précédent, n'est pas un refus de restitution", () => {
    att(extraire(jsonl(humain("go"), assistant("JET"), retour("[hook lexique] autre chose"))).length === 0, "autre hook");
    att(extraire(jsonl(humain("go"), retour(RAISON(["S1"])))).length === 0, "refus sans texte refusé");
    att(extraire(jsonl("pas du json", assistant("JET"), retour(RAISON(["S1"])))).length === 1, "une ligne illisible ne doit pas casser l'extraction");
  });
  check("extraction — un résultat d'outil ne ferme pas la chaîne : seul un message humain le fait", () => {
    const r = extraire(jsonl(humain("go"), assistant("JET"), retour(RAISON(["S1"])), outil(), assistant("RENDU"), humain("suite")));
    att(r[0].accepte === "RENDU", JSON.stringify(r[0]));
    const r2 = extraire(jsonl(humain("go"), assistant("JET"), retour(RAISON(["S1"])), humain("autre sujet"), assistant("REPONSE D'UN AUTRE TOUR")));
    att(r2[0].accepte === null, "un texte d'un autre tour est devenu le texte accepté");
  });

  // ---- le rejeu ----
  const corpus = [
    { id: "a#1", refuse: "REFUSE ENCORE", regles_bloquantes: ["S1", "S3"], accepte: "ACCEPTE BIEN", version_gabarit: "2.27.0" },
    { id: "a#2", refuse: "REFUSE PLUS", regles_bloquantes: ["S1"], accepte: "ACCEPTE MAL", version_gabarit: "2.21.0" },
    { id: "a#3", refuse: "REFUSE PARTIEL", regles_bloquantes: ["S1", "S4"], accepte: null },
    { id: "a#4", refuse: "CONTEXTE", regles_bloquantes: ["AFFICHAGE"], accepte: null },
  ];
  const JUGE = (texte) => ({ fails: texte === "REFUSE ENCORE" ? [{ regle: "S1" }, { regle: "S3" }] : texte === "REFUSE PARTIEL" ? [{ regle: "S1" }] : texte === "ACCEPTE MAL" ? [{ regle: "S6" }, { regle: "S2" }] : [] });
  check("rejeu — toujours refusé, plus refusé, partiel, non rejouable : chaque cas compté à sa place", () => {
    const r = rejouer(corpus, JUGE);
    att(r.refus === 4 && r.rejouables === 3 && r.non_rejouables_contexte === 1, JSON.stringify([r.refus, r.rejouables, r.non_rejouables_contexte]));
    att(r.toujours_refuses === 1 && r.ne_le_sont_plus === 1 && r.partiels === 1, JSON.stringify([r.toujours_refuses, r.ne_le_sont_plus, r.partiels]));
    att(r.ne_le_sont_plus_ids.join() === "a#2", "le refus devenu PASS n'est pas nommé : c'est lui qu'un humain doit lire");
    att(Math.abs(r.taux_toujours_refuses - 1 / 3) < 1e-9, `taux ${r.taux_toujours_refuses}`);
  });
  check("rejeu — le détail par règle dit quelle règle ne mord plus", () => {
    const r = rejouer(corpus, JUGE);
    att(r.par_regle.S1.refus === 3 && r.par_regle.S1.toujours_refuses === 2 && r.par_regle.S1.ne_le_sont_plus === 1, JSON.stringify(r.par_regle.S1));
    att(r.par_regle.S4.ne_le_sont_plus === 1 && r.par_regle.S3.toujours_refuses === 1, JSON.stringify(r.par_regle));
  });
  check("rejeu — un texte accepté est refusé aujourd'hui seulement sur une règle BLOQUANTE (S2 seule ne compte pas)", () => {
    const r = rejouer(corpus, JUGE);
    att(r.acceptes === 2 && r.acceptes_toujours === 1 && r.acceptes_refuses_aujourdhui === 1, JSON.stringify([r.acceptes, r.acceptes_toujours, r.acceptes_refuses_aujourdhui]));
    att(/a#2 \(S6\)/.test(r.acceptes_refuses_ids[0]), r.acceptes_refuses_ids[0]);
    const seulS2 = rejouer([{ id: "z", refuse: "x", regles_bloquantes: ["S1"], accepte: "T" }], () => ({ fails: [{ regle: "S2" }] }));
    att(seulS2.acceptes_refuses_aujourdhui === 0, "S2 n'est pas bloquante au hook");
  });
  check("rejeu — le résultat ne publie aucun texte de restitution, seulement des comptes et des identifiants", () => {
    const s = JSON.stringify(rejouer(corpus, JUGE));
    for (const t of ["REFUSE ENCORE", "ACCEPTE BIEN", "REFUSE PLUS", "CONTEXTE"]) att(!s.includes(t), `le texte « ${t} » fuit dans le résultat publiable`);
    const v = rejouer(corpus, JUGE).versions_gabarit;
    att(v["2.27.0"] === 1 && v["2.21.0"] === 1, `versions du gabarit citées : ${JSON.stringify(v)}`);
  });
  check("dossiers — extraction sur un dossier réel de transcriptions jetables, puis CLI --extraire et --rejouer de bout en bout", () => {
    const d = mkdtempSync(join(tmpdir(), "banc-restit-"));
    try {
      writeFileSync(join(d, "s1.jsonl"), jsonl(humain("go"), assistant("JET sans aucun bloc"), retour(RAISON(["S1", "S3", "S4", "S6"])), assistant("RENDU"), humain("ok")));
      writeFileSync(join(d, "ignore.txt"), "pas une transcription");
      att(extraireDossiers([d, join(d, "absent")]).length === 1, "extraction du dossier");
      const sortie = join(d, "sortie");
      const e = spawnSync(process.execPath, [join(ICI, "restitutions.mjs"), "--extraire", d, "--sortie", sortie], { encoding: "utf8" });
      att(e.status === 0 && /1 refus extraits/.test(e.stdout), `extraire : exit ${e.status} ${e.stdout}${e.stderr}`);
      const r = spawnSync(process.execPath, [join(ICI, "restitutions.mjs"), "--rejouer", "--corpus", sortie, "--json"], { encoding: "utf8", env: { ...process.env, FORGE_ROOT: process.env.FORGE_ROOT || join(ICI, "..", "..", "..") } });
      att(r.status === 0, `rejouer : exit ${r.status} ${r.stderr}`);
      const j = JSON.parse(r.stdout);
      // T2 (TF-1947, 26/10/2026) : un texte sans aucun bloc reste REFUSÉ par le juge réel (S1, S4, S6), mais S3 n'y mord plus : le
      // bloc 2 ne vient que s'il y a un verdict, et S3 se dit sans objet sans lui. Adapté : « toujours refusé sur les quatre règles
      // nommées » devient « partiel », S1 toujours refusée et S3 « ne l'est plus » — ce que le banc existe pour montrer d'une règle
      // assouplie par décision humaine.
      att(j.refus === 1 && j.rejouables === 1 && j.partiels === 1 && j.par_regle?.S1?.toujours_refuses === 1 && j.par_regle?.S3?.ne_le_sont_plus === 1,
        `le juge réel devait encore refuser un texte sans bloc sur S1, et ne plus le refuser sur S3 (T2) : ${JSON.stringify([j.refus, j.rejouables, j.toujours_refuses, j.partiels, j.ne_le_sont_plus, j.par_regle])}`);
      att(spawnSync(process.execPath, [join(ICI, "restitutions.mjs"), "--rejouer", "--corpus", join(d, "vide")], { encoding: "utf8" }).status === 2, "un corpus absent sort en 2");
      att(spawnSync(process.execPath, [join(ICI, "restitutions.mjs")], { encoding: "utf8" }).status === 2, "sans verbe, sortie 2");
    } finally { rmSync(d, { recursive: true, force: true }); }
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }

console.log(`\nbanc des restitutions : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
