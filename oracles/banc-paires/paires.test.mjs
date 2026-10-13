#!/usr/bin/env node
/**
 * paires.test.mjs — recette à double sens du banc des paires « fautif, corrigé » tirées du git (TF-1551). Jouée par
 * `oracles\self-tests.mjs` (I2).
 *
 * La règle P1 se prouve sur des messages de commit SYNTHÉTIQUES qui reprennent les formes mesurées le 13/10/2026 dans
 * l'histoire du pilot et des forges, et sur leurs contre-formes. L'extraction se prouve sur un dépôt git JETABLE bâti
 * dans le dossier temporaire, avec un oracle de fabrique : chaque règle P1 à P4 y a son commit qui la fait mordre. Le
 * rejeu se prouve avec un juge FORT (il voit le défaut : paires tenues 100 %), un juge FAIBLE (il ne voit rien : le
 * fautif accepté est nommé), un juge STRICT (il refuse tout : le corrigé refusé est nommé) et un oracle retiré.
 */
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { regle, propositions, trouverScript, livrablesDe, extraireDepot, rejouer, ecrireCorpus, tableauMarkdown } from "./paires.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };
const oracles = (msg) => regle(msg).map((h) => h.oracle).join();

const racine = mkdtempSync(join(tmpdir(), "banc-paires-"));
try {
  // ---- P1 : la règle sur le message ----
  check("P1 — les formes rouge → vert mesurées dans l'histoire sont toutes reconnues, chacune nommée", () => {
    att(oracles("Correction : oracle-empreintes FAIL (site non declare) -> PASS.") === "oracle-empreintes", "flèche avec motif");
    att(oracles("oracle-boite-entree passe de FAIL (B1 x2, B6 x2) a PASS.") === "oracle-boite-entree", "« passe de FAIL a PASS »");
    att(oracles("une copie coupee : FAIL devient PASS sous oracle-a11y, qui reste") === "oracle-a11y", "« devient … sous »");
    att(oracles("Preuves oracle-ecriture : gabarit FAIL (EC-8 x2) avant, PASS apres") === "oracle-ecriture", "avant / après");
    att(oracles("Verifie : oracle-boite-entree PASS (il etait FAIL), oracle-todo PASS") === "oracle-boite-entree", "« PASS (il etait FAIL) »");
    att(oracles("oracle-skills --appliquer (K2 FAIL 10/17 -> PASS 8/8)") === "oracle-skills", "compte entre FAIL et la flèche");
    att(regle("oracle-x FAIL -> PASS")[0].forme === "fleche" && regle("oracle-x PASS (était FAIL)")[0].forme === "etait", "la forme est nommée");
  });
  check("P1 — contre-formes : compte de cas, verdict sans sens, oracle cité pour son propre verdict après la marque", () => {
    att(oracles("Self-test oracle-synthese 20/20 -> 21/21 PASS (non declaree FAIL, declaree PASS)") === "", "un compte de recette n'est pas une correction");
    att(oracles("oracle-synthese 24 -> 27 cas (FAIL, PASS, SANS_OBJET)") === "", "une liste de verdicts n'est pas un sens");
    att(oracles("oracle-todo PASS, oracle-empreintes PASS") === "", "aucun FAIL");
    att(oracles("Boite d'entree FAIL -> PASS, oracle-todo PASS, self-test 52 PASS") === "", "l'oracle cité APRÈS la marque pour son propre verdict n'est pas celui qui a basculé");
    att(oracles("oracle-boite-entree FAIL -> PASS, oracle-insatisfactions PASS, oracle-todo PASS") === "oracle-boite-entree", "seul l'oracle qui précède la marque");
    att(oracles("delta-rouge x oracle-exigences, PASS -> FAIL, 2026-09-05") === "", "le sens vert → rouge n'est pas une correction");
    att(oracles("FAIL -> PASS sans oracle nommé") === "", "un sens sans oracle");
  });
  check("P1 — un message replié à 72 colonnes reste une seule proposition ; une ligne vide ou une puce en ouvre une autre", () => {
    att(oracles("oracle-empreintes sur le parc reel : FAIL (E2 sur le\nproduit de marque) -> PASS, apres declaration") === "oracle-empreintes", "repli de ligne");
    att(propositions("a\n\nb").length === 2 && propositions("- un\n- deux").length === 2, JSON.stringify(propositions("- un\n- deux")));
    att(oracles("oracle-x cite ici.\n\nFAIL -> PASS plus loin") === "", "un oracle d'un autre paragraphe ne compte pas");
  });
  check("P2 et P3 — script trouvé dans l'arbre (oracles/ d'abord), livrables modifiés hors oracle et recette", () => {
    att(trouverScript(["a/oracle-x.mjs", "oracles/oracle-x.mjs", "oracles/oracle-xy.mjs"], "oracle-x") === "oracles/oracle-x.mjs", "oracles/ d'abord, nom exact");
    att(trouverScript(["outils/oracle-x.py"], "oracle-x") === "outils/oracle-x.py" && trouverScript(["oracles/oracle-xy.mjs"], "oracle-x") === null, "py, et pas de préfixe");
    att(livrablesDe("M\toracles/oracle-x.mjs\nM\toracles/oracle-x.test.mjs\nM\tdoc.md\nA\tneuf.md\nD\tparti.md", "oracles/oracle-x.mjs").join() === "doc.md", "seul le modifié hors juge");
  });

  // ---- extraction sur un dépôt jetable ----
  const depot = join(racine, "depot-fab");
  mkdirSync(join(depot, "oracles"), { recursive: true });
  const g = (...a) => { const r = spawnSync("git", ["-C", depot, "-c", "user.name=banc", "-c", "user.email=banc@exemple.invalid", "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false", ...a], { encoding: "utf8" }); if (r.status !== 0) throw new Error(`git ${a.join(" ")} : ${r.stderr}`); return r.stdout; };
  const ec = (rel, t) => writeFileSync(join(depot, rel), t, "utf8");
  const commit = (msg) => { g("add", "-A"); g("commit", "-q", "-m", msg); };
  const FAB = `import {readFileSync} from "node:fs"; const t=readFileSync(process.argv[2],"utf8"); const ok=!t.includes("DEFAUT");
console.log(JSON.stringify({verdict:ok?"PASS":"FAIL",findings:ok?[]:[{regle:"F1",statut:"FAIL"}]})); process.exit(ok?0:1);`;
  g("init", "-q");
  ec("oracles/oracle-fab.mjs", FAB); ec("livrable.md", "# Livrable\n\nUn DEFAUT ici.\n"); ec("autre.md", "# Autre\n\nsain\n");
  commit("Naissance du livrable");
  ec("livrable.md", "# Livrable\n\nCorrigé ici.\n"); ec("autre.md", "# Autre\n\nsain, retouché\n");
  commit("Correction du livrable\n\nPreuve : oracle-fab FAIL (F1) -> PASS sur le livrable.");          // P1..P4 : 1 confirmée, 1 non (autre.md PASS/PASS)
  ec("livrable.md", "# Livrable\n\nCorrigé, relu.\n");
  commit("Relecture : self-test oracle-fab 3/3 -> 4/4 PASS");                                          // P1 ne mord pas
  ec("oracles/oracle-fab.mjs", FAB + "\n// retouche du juge\n");
  commit("Juge retouché : oracle-fab FAIL -> PASS");                                                   // P3 : rien hors l'oracle
  ec("livrable.md", "# Livrable\n\nCorrigé, relu deux fois.\n");
  commit("oracle-absent FAIL -> PASS");                                                                // P2 : oracle absent
  check("extraction — P1 à P4 mordent chacune sur son commit : une seule paire confirmée par le juge de l'époque", () => {
    const r = extraireDepot(depot);
    att(r.candidats === 3, `${r.candidats} commit(s) retenu(s) par P1, 3 attendus`);
    const conf = r.paires.filter((p) => p.confirmee);
    att(conf.length === 1 && conf[0].livrable === "livrable.md" && conf[0].oracle === "oracle-fab", JSON.stringify(r.paires.map((p) => [p.livrable, p.confirmee, p.motif])));
    att(String(conf[0].avant).includes("DEFAUT") && !String(conf[0].apres).includes("DEFAUT"), "le fautif est l'état du parent, le corrigé celui du commit");
    att(conf[0].epoque.avant === "FAIL" && conf[0].epoque.apres === "PASS", JSON.stringify(conf[0].epoque));
    const motifs = r.paires.filter((p) => !p.confirmee).map((p) => p.motif.slice(0, 2)).sort().join();
    att(motifs === "P2,P3,P4", `motifs des non confirmées : ${motifs}`);
    att(/PASS sur le fautif et PASS sur le corrigé/.test(r.paires.find((p) => p.livrable === "autre.md").motif), "un fichier que le juge accepte des deux côtés n'est pas une paire");
  });

  // ---- le rejeu : juge fort, juge faible ----
  const corpus = extraireDepot(depot).paires.map(({ avant, apres, ...p }) => ({ ...p, _avant: String(avant || ""), _apres: String(apres || "") }));
  const FORT = (p, cote) => (p[cote === "avant" ? "_avant" : "_apres"].includes("DEFAUT") ? "FAIL" : "PASS");
  const FAIBLE = () => "PASS";
  const STRICT = () => "FAIL";
  check("juge FORT — il voit le défaut : fautif refusé, corrigé accepté, paires tenues 100 %", () => {
    const r = rejouer(corpus, FORT);
    att(r.confirmees === 1 && r.tenues === 1 && r.taux_tenues === 1 && r.taux_detection === 1, JSON.stringify([r.confirmees, r.tenues, r.taux_tenues]));
    att(r.non_confirmees === 3 && r.motifs_non_confirmees.P4 === 1 && r.motifs_non_confirmees.P2 === 1 && r.motifs_non_confirmees.P3 === 1, JSON.stringify(r.motifs_non_confirmees));
    att(r.detections_perdues_ids.length === 0 && r.corriges_refuses_ids.length === 0, "rien à lire");
  });
  check("juge FAIBLE — il ne voit rien : taux de détection 0 %, le fautif accepté est NOMMÉ (le banc sait dire un mauvais juge)", () => {
    const r = rejouer(corpus, FAIBLE);
    att(r.taux_detection === 0 && r.tenues === 0, `taux ${r.taux_detection}`);
    att(r.detections_perdues_ids.length === 1 && /^depot-fab@[0-9a-f]{8}:oracle-fab:\d+$/.test(r.detections_perdues_ids[0]), r.detections_perdues_ids.join());
    att(r.par_oracle["oracle-fab"].detections_tenues === 0 && r.par_oracle["oracle-fab"].corriges_acceptes === 1, JSON.stringify(r.par_oracle));
  });
  check("juge STRICT et oracle retiré — le corrigé refusé est nommé ; un oracle absent aujourd'hui n'est pas jugé, jamais compté tenu", () => {
    const r = rejouer(corpus, STRICT);
    att(r.taux_detection === 1 && r.tenues === 0 && r.corriges_refuses_ids.length === 1, JSON.stringify([r.taux_detection, r.tenues]));
    const z = rejouer(corpus, () => null);
    att(z.oracle_retire === 1 && z.non_juges === 1 && z.tenues === 0 && z.taux_tenues === null, JSON.stringify([z.oracle_retire, z.taux_tenues]));
    const a = rejouer(corpus, () => "AUTRE");
    att(a.non_juges === 1 && a.detections_perdues_ids.length === 0, "un verdict illisible n'est ni une détection ni une perte");
  });
  check("publication — le résultat et son tableau ne portent ni texte de livrable, ni chemin, ni message de commit", () => {
    const s = JSON.stringify(rejouer(corpus, FAIBLE)) + tableauMarkdown(rejouer(corpus, FORT));
    for (const t of ["DEFAUT", "Corrigé ici", "livrable.md", "Correction du livrable", "Preuve :"]) att(!s.includes(t), `« ${t} » fuit dans le résultat publiable`);
    att(/\| `oracle-fab` \| 1 \| 1 \| 1 \| 1 \| 0 \|/.test(tableauMarkdown(rejouer(corpus, FORT))), tableauMarkdown(rejouer(corpus, FORT)));
  });
  check("CLI de bout en bout — --extraire écrit le corpus hors dépôt, --rejouer juge avec l'oracle au HEAD, exit 2 sans corpus", () => {
    const sortie = join(racine, "corpus");
    const env = { ...process.env, FORGE_ROOT: racine };
    const e = spawnSync(process.execPath, [join(ICI, "paires.mjs"), "--extraire", "--depots", depot, "--sortie", sortie], { encoding: "utf8", env });
    att(e.status === 0 && /3 commit\(s\) retenu\(s\) par P1 dans 1 dépôt\(s\), 4 paire\(s\), 1 confirmée/.test(e.stdout), `extraire : exit ${e.status} ${e.stdout}${e.stderr}`);
    const lignes = readFileSync(join(sortie, "corpus.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    const c = lignes.find((p) => p.confirmee);
    att(c && !("avant" in c) && existsSync(join(sortie, c.fichiers, "avant", "livrable.md")) && existsSync(join(sortie, c.fichiers, "apres", "livrable.md")), "fichiers de la paire");
    const r = spawnSync(process.execPath, [join(ICI, "paires.mjs"), "--rejouer", "--corpus", sortie, "--json"], { encoding: "utf8", env });
    att(r.status === 0, `rejouer : exit ${r.status} ${r.stderr}`);
    const j = JSON.parse(r.stdout);
    att(j.confirmees === 1 && j.tenues === 1, `l'oracle de fabrique au HEAD doit tenir la paire : ${JSON.stringify([j.confirmees, j.tenues, j.detections_perdues_ids, j.corriges_refuses_ids])}`);
    att(spawnSync(process.execPath, [join(ICI, "paires.mjs"), "--rejouer", "--corpus", join(racine, "vide")], { encoding: "utf8" }).status === 2, "un corpus absent sort en 2");
    att(spawnSync(process.execPath, [join(ICI, "paires.mjs")], { encoding: "utf8" }).status === 2, "sans verbe, sortie 2");
  });
  check("écriture du corpus — réécrire efface les fichiers d'un passage précédent", () => {
    const d = join(racine, "corpus2");
    mkdirSync(join(d, "fichiers", "99"), { recursive: true });
    ecrireCorpus([], d);
    att(!existsSync(join(d, "fichiers", "99")) && readFileSync(join(d, "corpus.jsonl"), "utf8") === "", "reste d'un passage précédent");
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { rmSync(racine, { recursive: true, force: true }); }

console.log(`\nbanc des paires : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
