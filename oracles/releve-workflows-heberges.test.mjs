#!/usr/bin/env node
/**
 * releve-workflows-heberges.test.mjs — recette à double sens du relevé des workflows hébergés (TF-2442, RP-26, 12/11/2026).
 *
 * Le fait : un workflow de publication d'un produit a échoué 5 fois de suite du 03 au 12/11/2026, sans qu'aucun contrôle du poste ni de la
 * session ne le dise pendant 9 jours. Le relevé d'ouverture lit désormais les exécutions (`gh run list`, lecture seule) en arrière-plan et
 * signale tout workflow en échec 2 fois de suite ou plus.
 *
 * Les deux sens, joués ici sans réseau (un faux `gh` injecté, des dépôts jetables, aucun nom réel) :
 *   · ROUGE — 2 échecs de suite (le seuil), 3 échecs, timed_out et startup_failure comptés, une exécution en cours ou annulée ignorée :
 *     le workflow est SIGNALÉ avec son nom, sa durée et l'adresse de la dernière exécution ;
 *   · VERT — 1 seul échec, un succès entre deux échecs, un succès le plus récent, des succès seuls : RIEN n'est signalé.
 * Et la lecture seule (seules des commandes `gh run list`), le non relevé dit comme tel (jamais comme sain), le relevé périmé, le verrou, le
 * lancement détaché qui rend la main sans attendre.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { creerFiltre, conclureFiltre } from "./lib-filtre-cas.mjs";
import {
  SEUIL_ECHECS, seriesEnEchec, slugGithub, aDesWorkflows, releverProduit, decisionReleve, lancerReleve, lignesOuverture, executer, lireTrace,
} from "./releve-workflows-heberges.mjs";

const filtre = creerFiltre("FORGE_CAS_WORKFLOWS");
let pass = 0, fail = 0;
const echecs = [];
const check = (id, nom, fn) => {
  if (!filtre.veut(id)) return;
  try { fn(); console.log(`  [PASS] ${id} — ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${id} — ${nom} : ${e.message}`); echecs.push(`${id} : ${e.message}`); fail++; }
};
const egal = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} — attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}`); };
const vrai = (c, msg) => { if (!c) throw new Error(msg); };

const base = mkdtempSync(join(tmpdir(), "releve-wf-"));
const run = (workflowName, createdAt, conclusion, status = "completed") => ({ databaseId: 1, workflowName, createdAt, conclusion, status, url: `https://exemple.invalid/runs/${createdAt}` });
const j = (n) => `2026-11-${String(n).padStart(2, "0")}T06:00:00Z`;

try {
  // ---- 1. la série : seuil, ordre, ce qui compte et ce qui est ignoré ----
  check(1, "ROUGE — 3 échecs de suite après un succès : signalé, 3 échecs, depuis la première, dernière exécution nommée", () => {
    const r = seriesEnEchec([run("programmer", j(1), "success"), run("programmer", j(3), "failure"), run("programmer", j(2), "failure"), run("programmer", j(4), "failure")]);
    egal(r.en_echec.length, 1, "un workflow en échec");
    egal([r.en_echec[0].workflow, r.en_echec[0].consecutifs, r.en_echec[0].depuis, r.en_echec[0].dernier], ["programmer", 3, j(2), j(4)], "série");
    vrai(/runs\//.test(r.en_echec[0].url), "l'adresse de la dernière exécution manque");
  });
  check(2, "ROUGE à la borne — exactement 2 échecs de suite : signalé (le seuil est 2)", () => {
    egal(SEUIL_ECHECS, 2, "seuil");
    egal(seriesEnEchec([run("w", j(1), "success"), run("w", j(2), "failure"), run("w", j(3), "failure")]).en_echec.length, 1, "2 échecs");
  });
  check(3, "VERT à la borne — 1 seul échec, même le plus récent : rien", () => {
    egal(seriesEnEchec([run("w", j(1), "success"), run("w", j(2), "success"), run("w", j(3), "failure")]).en_echec.length, 0, "1 échec");
  });
  check(4, "VERT — un succès entre deux échecs coupe la série (échec, succès, échec : rien)", () => {
    egal(seriesEnEchec([run("w", j(1), "failure"), run("w", j(2), "success"), run("w", j(3), "failure")]).en_echec.length, 0, "série coupée");
  });
  check(5, "VERT — le succès le plus récent clôt la série passée (2 échecs, puis un succès : rien)", () => {
    egal(seriesEnEchec([run("w", j(1), "failure"), run("w", j(2), "failure"), run("w", j(3), "success")]).en_echec.length, 0, "récupéré");
  });
  check(6, "ROUGE — timed_out et startup_failure comptent comme des échecs", () => {
    egal(seriesEnEchec([run("w", j(1), "timed_out"), run("w", j(2), "startup_failure")]).en_echec[0]?.consecutifs, 2, "deux échecs de nature différente");
  });
  check(7, "une exécution en cours, en file ou annulée est ignorée : elle ne casse pas la série et n'en fait pas partie", () => {
    const r = seriesEnEchec([run("w", j(1), "failure"), run("w", j(2), "failure"), run("w", j(3), "cancelled"), run("w", j(4), "", "in_progress"), run("w", j(5), "", "queued")]);
    egal([r.en_echec.length, r.en_echec[0]?.consecutifs], [1, 2], "série avec exécutions neutres");
    egal(seriesEnEchec([run("w", j(1), "failure"), run("w", j(2), "", "in_progress")]).en_echec.length, 0, "un seul échec + une exécution en cours : rien");
  });
  check(8, "chaque workflow se juge à part : un en échec, un sain, comptés dans workflows_vus", () => {
    const r = seriesEnEchec([run("a", j(1), "failure"), run("a", j(2), "failure"), run("b", j(1), "success"), run("b", j(2), "success")]);
    egal([r.workflows_vus, r.en_echec.map((x) => x.workflow)], [2, ["a"]], "deux workflows");
  });
  check(9, "des succès seuls, une liste vide ou une entrée sans nom : rien, sans levée", () => {
    egal(seriesEnEchec([run("w", j(1), "success")]).en_echec.length, 0, "succès");
    egal(seriesEnEchec([]).en_echec.length, 0, "vide");
    egal(seriesEnEchec([{ conclusion: "failure", createdAt: j(1) }, { conclusion: "failure", createdAt: j(2) }]).workflows_vus, 0, "sans nom");
    egal(seriesEnEchec(null).workflows_vus, 0, "non-liste");
  });

  // ---- 2. le dépôt : adresse, workflows locaux ----
  check(10, "slugGithub : https, ssh, .git ou non ; tout autre hébergeur rend null", () => {
    egal(slugGithub("https://github.com/acme-fictif/depot-fictif.git"), "acme-fictif/depot-fictif", "https .git");
    egal(slugGithub("git@github.com:acme-fictif/depot-fictif.git\n"), "acme-fictif/depot-fictif", "ssh");
    egal(slugGithub("https://github.com/acme-fictif/depot-fictif"), "acme-fictif/depot-fictif", "https nu");
    egal(slugGithub("https://gitlab.exemple.invalid/acme-fictif/depot-fictif.git"), null, "autre hébergeur");
    egal(slugGithub(""), null, "vide");
  });

  // Un produit jetable : un vrai dépôt git (remote ajouté, jamais interrogé), un workflow local.
  const produit = (nom, { workflows = true, remote = "https://github.com/acme-fictif/depot-fictif.git" } = {}) => {
    const d = join(base, nom); mkdirSync(d, { recursive: true });
    spawnSync("git", ["init", "-q"], { cwd: d });
    if (remote) spawnSync("git", ["remote", "add", "origin", remote], { cwd: d });
    if (workflows) { mkdirSync(join(d, ".github", "workflows"), { recursive: true }); writeFileSync(join(d, ".github", "workflows", "programmer.yml"), "name: programmer\n", "utf8"); }
    return d;
  };
  const ghFaux = (liste, appels = []) => (args) => { appels.push(args); return { status: 0, stdout: JSON.stringify(liste), stderr: "" }; };

  check(11, "un produit sans .github/workflows, ou dont l'origine n'est pas GitHub, n'est pas relevé (null) et gh n'est pas appelé", () => {
    const appels = [];
    egal(releverProduit(produit("sans-wf", { workflows: false }), base, { gh: ghFaux([], appels) }), null, "sans workflow");
    egal(releverProduit(produit("autre-hote", { remote: "https://gitlab.exemple.invalid/a/b.git" }), base, { gh: ghFaux([], appels) }), null, "autre hébergeur");
    egal(releverProduit(produit("sans-remote", { remote: null }), base, { gh: ghFaux([], appels) }), null, "sans remote");
    egal(appels.length, 0, "appels à gh");
    vrai(aDesWorkflows(produit("avec-wf")), "aDesWorkflows doit voir le workflow");
  });
  check(12, "LECTURE SEULE — seul `gh run list` est appelé, sur le dépôt du produit, jamais de relance ni d'écriture", () => {
    const appels = [];
    const r = releverProduit(produit("produit-fictif-a"), base, { gh: ghFaux([run("programmer", j(1), "failure"), run("programmer", j(2), "failure")], appels) });
    egal(appels.length, 1, "un appel");
    egal(appels[0].slice(0, 2), ["run", "list"], "sous-commande");
    vrai(appels[0].includes("--repo") && appels[0].includes("acme-fictif/depot-fictif"), "le dépôt n'est pas désigné par --repo");
    // Jetons ENTIERS : « workflowName » dans la liste des champs de --json n'est pas la sous-commande `gh workflow`.
    vrai(!appels.flat().some((a) => /^(rerun|cancel|delete|watch|workflow|api|disable|enable|-X|--method)$/i.test(String(a))), `une commande d'écriture ou autre que list : ${JSON.stringify(appels[0])}`);
    egal([r.produit, r.en_echec.length], ["produit-fictif-a", 1], "résultat");
  });
  check(13, "la branche par défaut, quand le dépôt local la connaît, borne la lecture (--branch) ; sinon aucune borne", () => {
    const appels = [];
    const git = (args) => ({ status: 0, stdout: args[0] === "remote" ? "https://github.com/acme-fictif/depot-fictif.git" : "origin/principale\n", stderr: "" });
    releverProduit(produit("avec-branche"), base, { gh: ghFaux([], appels), git });
    vrai(appels[0].join(" ").includes("--branch principale"), `branche non bornée : ${appels[0].join(" ")}`);
    const sans = [];
    releverProduit(produit("sans-branche"), base, { gh: ghFaux([], sans) });
    vrai(!sans[0].includes("--branch"), "une branche inventée sans origin/HEAD");
  });
  check(14, "NON RELEVÉ dit comme tel — gh en erreur ou sortie illisible : non_releve avec la cause, jamais un produit sain", () => {
    const refus = releverProduit(produit("gh-refuse"), base, { gh: () => ({ status: 1, stdout: "", stderr: "gh: To get started with GitHub CLI, please run: gh auth login\n" }) });
    vrai(/gh auth login/.test(refus.non_releve) && !refus.en_echec, `refus : ${JSON.stringify(refus)}`);
    const absent = releverProduit(produit("gh-absent"), base, { gh: () => ({ error: { code: "ENOENT" }, status: null, stdout: "", stderr: "" }) });
    egal(absent.non_releve, "ENOENT", "gh absent");
    const illisible = releverProduit(produit("gh-illisible"), base, { gh: () => ({ status: 0, stdout: "pas du json", stderr: "" }) });
    vrai(/illisible/.test(illisible.non_releve), "sortie illisible");
  });

  // ---- 3. la décision de relever, le verrou, le lancement détaché ----
  const trace = join(base, "trace", "workflows.json");
  const maintenant = new Date("2026-11-12T12:00:00Z");
  check(15, "décision : jamais relevé → lancer ; trace de moins de 60 min → pas de relance ; trace plus ancienne → relancer", () => {
    egal(decisionReleve(trace, { maintenant }).raison, "jamais", "jamais");
    mkdirSync(join(base, "trace"), { recursive: true });
    writeFileSync(trace, JSON.stringify({ fin: "2026-11-12T11:30:00Z", produits: [] }), "utf8");
    egal(decisionReleve(trace, { maintenant }), { lancer: false, raison: "a-jour", age_min: 30 }, "récent");
    writeFileSync(trace, JSON.stringify({ fin: "2026-11-12T10:00:00Z", produits: [] }), "utf8");
    egal([decisionReleve(trace, { maintenant }).lancer, decisionReleve(trace, { maintenant }).raison], [true, "echu"], "ancien");
  });
  check(16, "un relevé en cours (verrou vivant) n'est pas doublé ; un verrou dont le processus est mort ou trop vieux est ignoré", () => {
    writeFileSync(`${trace}.verrou`, JSON.stringify({ pid: 4242, ts: "2026-11-12T11:55:00Z" }), "utf8");
    egal(decisionReleve(trace, { maintenant, vivant: () => true }).raison, "en-cours", "vivant");
    egal(decisionReleve(trace, { maintenant, vivant: () => false }).lancer, true, "processus mort");
    writeFileSync(`${trace}.verrou`, JSON.stringify({ pid: 4242, ts: "2026-11-12T09:00:00Z" }), "utf8");
    egal(decisionReleve(trace, { maintenant, vivant: () => true }).lancer, true, "verrou de plus de 15 min");
    rmSync(`${trace}.verrou`, { force: true });
  });
  check(17, "lancerReleve rend la main aussitôt : processus détaché (pid, unref), ou lance:false avec la cause", () => {
    let recu = null, unref = false;
    const spawner = (cmd, args, opts) => { recu = { cmd, args, opts }; return { pid: 777, on() {}, unref() { unref = true; } }; };
    const l = lancerReleve({ trace, pilot: base, maintenant, spawner });
    egal([l.lance, l.pid, unref, recu.opts.detached, recu.opts.stdio], [true, 777, true, true, "ignore"], "détaché");
    vrai(recu.args.includes("--executer") && recu.args.includes(trace), "arguments du relevé");
    const sans = lancerReleve({ trace, pilot: base, maintenant, spawner: () => ({ on() {} }) });
    egal([sans.lance, /pas de pid/.test(sans.erreur)], [false, true], "sans pid");
    const casse = lancerReleve({ trace, pilot: base, maintenant, spawner: () => { const e = new Error("x"); e.code = "ENOENT"; throw e; } });
    egal([casse.lance, casse.erreur], [false, "ENOENT"], "spawn qui lève");
    const frais = lancerReleve({ trace, pilot: base, maintenant: new Date("2026-11-12T10:20:00Z"), spawner });
    egal(frais.lance, false, "trace récente : rien lancé");
  });

  // ---- 4. ce que l'ouverture dit ----
  const trT = (produits, fin = "2026-11-12T10:00:00Z") => { writeFileSync(trace, JSON.stringify({ format: "x", fin, produits }), "utf8"); return trace; };
  check(18, "ROUGE à l'ouverture — un workflow en échec 5 fois de suite est NOMMÉ : produit, workflow, durée, dernière exécution et son adresse", () => {
    const l = lignesOuverture(trT([{ produit: "produit-fictif-a", slug: "a/b", workflows_vus: 2, en_echec: [{ workflow: "programmer", consecutifs: 5, depuis: j(3), dernier: j(12), url: "https://exemple.invalid/runs/9" }] }]), { maintenant }).join("\n");
    vrai(/Workflows hébergés des produits/.test(l) && /produit-fictif-a/.test(l) && /`programmer` en échec 5 fois de suite/.test(l) && /depuis le 2026-11-03/.test(l) && /dernière exécution le 2026-11-12/.test(l) && /exemple\.invalid\/runs\/9/.test(l) && /1 en échec/.test(l), `ligne : ${l}`);
  });
  check(19, "VERT à l'ouverture — aucun workflow en échec : la ligne le dit, sans nommer de workflow", () => {
    const l = lignesOuverture(trT([{ produit: "produit-fictif-a", workflows_vus: 3, en_echec: [] }]), { maintenant }).join("\n");
    vrai(/3 workflow\(s\) chez 1 produit/.test(l) && /aucun en échec 2 fois de suite/.test(l) && !/en échec \d+ fois de suite, depuis/.test(l), `ligne : ${l}`);
  });
  check(20, "un relevé de plus de 48 h est dit ANCIEN ; un produit non relevé est nommé « NON relevé (≠ sain) » avec la cause", () => {
    const l = lignesOuverture(trT([{ produit: "p1", workflows_vus: 1, en_echec: [] }, { produit: "p2", non_releve: "gh auth login" }], "2026-11-09T10:00:00Z"), { maintenant }).join("\n");
    vrai(/ANCIEN/.test(l) && /NON relevé \(≠ sain\) : p2 \(gh auth login\)/.test(l), `ligne : ${l}`);
  });
  check(21, "sans trace : le premier relevé est annoncé s'il est lancé ; sans lancement possible (drapeau), rien n'est dit", () => {
    rmSync(trace, { force: true });
    const avec = lignesOuverture(trace, { maintenant, lancer: () => ({ lance: true, raison: "jamais", pid: 12, duree_ms: 3 }) }).join("\n");
    vrai(/aucun relevé encore/.test(avec) && /relevé relancé en arrière-plan/.test(avec) && /pid 12/.test(avec), `avec : ${avec}`);
    egal(lignesOuverture(trace, { maintenant }), [], "sans lancement ni trace");
    const echec = lignesOuverture(trace, { maintenant, lancer: () => ({ lance: false, erreur: "ENOENT" }) }).join("\n");
    vrai(/relevé NON lancé \(ENOENT\)/.test(echec), `échec de lancement : ${echec}`);
  });
  check(22, "plus de 8 workflows en échec : 8 lignes puis le reste compté, pas de liste sans borne", () => {
    const en_echec = Array.from({ length: 11 }, (_, i) => ({ workflow: `w${i}`, consecutifs: 2, depuis: j(1), dernier: j(2) }));
    const l = lignesOuverture(trT([{ produit: "p", workflows_vus: 11, en_echec }]), { maintenant });
    egal(l.filter((x) => /en échec 2 fois de suite, depuis/.test(x)).length, 8, "lignes nommées");
    vrai(l.some((x) => /et 3 autre\(s\)/.test(x)), "le reste n'est pas compté");
  });

  // ---- 5. le relevé détaché de bout en bout (faux gh injecté, vrai git, dépôts jetables) ----
  const dossierP = produit("p-e2e");
  const tr2 = join(base, "e2e", "t.json");
  let verrouVu = false;
  const ghTrace = () => { verrouVu = existsSync(`${tr2}.verrou`); return { status: 0, stdout: JSON.stringify([run("programmer", j(1), "failure"), run("programmer", j(2), "failure")]), stderr: "" }; };
  const rel = await executer({ trace: tr2, base, produits: [dossierP], gh: ghTrace });
  check(23, "executer : la trace écrite porte le format, le seuil, le produit et son workflow en échec ; le verrou était posé pendant le relevé et est retiré ; l'ouverture la relit", () => {
    const t = lireTrace(tr2);
    egal([t.format, t.seuil, t.produits.length, t.produits[0].en_echec[0].workflow, rel.length], ["pilot/workflows-heberges@1", 2, 1, "programmer", 1], "trace");
    vrai(verrouVu, "le verrou n'était pas posé pendant le relevé");
    vrai(!existsSync(`${tr2}.verrou`), "le verrou n'est pas retiré");
    vrai(/`programmer` en échec 2 fois de suite/.test(lignesOuverture(tr2, { maintenant }).join(" ")), "l'ouverture ne relit pas la trace");
  });
  const tr3 = join(base, "e2e", "t3.json");
  let leve = null;
  try { await executer({ trace: tr3, base, produits: [dossierP], gh: () => { throw new Error("boum"); } }); } catch (e) { leve = e; }
  check(24, "executer : une erreur du relevé remonte, retire quand même le verrou et n'écrit pas de trace", () => {
    vrai(leve && /boum/.test(leve.message), "l'erreur du relevé doit remonter");
    vrai(!existsSync(`${tr3}.verrou`) && !existsSync(tr3), "verrou ou trace laissés après l'erreur");
  });
} finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (filtre.actif) { const c = conclureFiltre("releve-workflows-heberges", filtre, echecs); (c.code === 0 ? console.log : console.error)(c.ligne); process.exit(c.code); }
console.log(`\nreleve-workflows-heberges (TF-2442, RP-26) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
