#!/usr/bin/env node
/**
 * mobiliser.test.mjs — recette de l'écrivain des verdicts de mobilisation (T4, item 2 de TF-1949, D-69 (a) et D-79 (c) du
 * 26/10/2026). Chaque cas se joue sur un produit jetable (un dossier qui porte `forge/retours/`), hors du dépôt.
 *
 * Ce qu'elle prouve, dans les deux sens : une demande aux 13 verdicts motivés s'écrit en UNE ligne de `forge/mobilisation.jsonl`
 * (horodatage, type, profil, 13 verdicts) et rend la ligne d'écran « Je mobilise : … » ; une forge sans verdict, un motif resté
 * au gabarit ou trop court, un type hors de la carte, un profil non déclaré sont REFUSÉS (exit 1), sans rien écrire ; hors d'un
 * produit, l'écrivain rend la main (exit 2). Le squelette de `--preparer` propose les forges privilégiées et celles que le profil
 * désigne, et l'écrivain le refuse tant que ses motifs ne sont pas écrits.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, utimesSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const ECRIVAIN = join(ICI, "mobiliser.mjs");
const FORGES = ["conception", "design", "development", "tests", "ops", "agents", "agents-security", "seo-geo", "organization", "audit", "data", "observability", "websec"];

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "mobiliser-"));
const produit = (nom, { profil = true } = {}) => {
  const d = join(T, nom);
  mkdirSync(join(d, "forge", "retours"), { recursive: true });
  if (profil) writeFileSync(join(d, "forge", "PROFIL.json"), JSON.stringify({ signaux: { domaine_public: false, page_indexable: false,
    donnees_personnelles: false, agents: false, mise_en_production: true } }), "utf8");
  return d;
};
// TF-2045 : l'écrivain lit CLAUDE_CODE_SESSION_ID ; la recette le retire de l'environnement hérité, pour que ses cas ne dépendent pas de
// la session qui la joue, et le pose cas par cas (`session`).
const lancer = (cwd, args, session = null, extra = {}) => {
  const env = { ...process.env, ...extra }; delete env.CLAUDE_CODE_SESSION_ID;
  if (session) env.CLAUDE_CODE_SESSION_ID = session;
  const r = spawnSync(process.execPath, [ECRIVAIN, ...args], { cwd, encoding: "utf8", env });
  let sortie = null;
  try { sortie = JSON.parse(r.stdout); } catch { /* sortie illisible : le cas le dira */ }
  return { code: r.status, sortie, brut: `${r.stdout || ""}${r.stderr || ""}` };
};
const trace = (d) => existsSync(join(d, "forge", "mobilisation.jsonl"))
  ? readFileSync(join(d, "forge", "mobilisation.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
/** 13 verdicts motivés pour un produit neuf : les 5 forges privilégiées mobilisées, data ajoutée hors carte, les 7 autres écartées. */
const verdictsProduitNeuf = () => {
  const v = {};
  for (const f of FORGES) v[f] = { verdict: "ecartee", motif: `la demande ne touche pas le domaine ${f}` };
  for (const f of ["conception", "design", "development", "tests", "ops"]) v[f] = { verdict: "mobilisee", motif: `le produit neuf passe par ${f} avant livraison` };
  v.data = { verdict: "mobilisee", motif: "le produit agrège des ventes dans un tableau de bord" };
  return v;
};
const ecrireVerdicts = (d, v) => { const f = join(d, "verdicts.json"); writeFileSync(f, JSON.stringify(v), "utf8"); return f; };

try {
  check("la demande aux 13 verdicts motivés s'écrit en UNE ligne : horodatage, type, profil, 13 verdicts, et la ligne d'écran", () => {
    const d = produit("vert");
    const r = lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsProduitNeuf()), "--demande", "construire le tableau de bord des ventes"]);
    att(r.code === 0, `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    const lignes = trace(d);
    att(lignes.length === 1, `${lignes.length} ligne(s) au lieu d'une`);
    const l = lignes[0];
    att(/^\d{4}-\d{2}-\d{2}T/.test(l.ts) && l.type === "produit-neuf" && l.profil && l.profil.mise_en_production === true, `ligne incomplète : ${JSON.stringify(l).slice(0, 200)}`);
    att(FORGES.every((f) => ["mobilisee", "ecartee"].includes(l.verdicts[f]?.verdict) && l.verdicts[f].motif), "les 13 forges ne portent pas toutes leur verdict et leur motif");
    att(r.sortie && /^Je mobilise : conception, design, development, tests, ops, data/.test(r.sortie.ligne_ecran), `ligne d'écran : ${r.sortie && r.sortie.ligne_ecran}`);
    att(/Hors carte : \+ data \(le produit agrège des ventes/.test(r.sortie.ligne_ecran), "la forge ajoutée hors carte n'est pas dite avec son motif");
  });

  check("une forge privilégiée écartée sort de la carte avec son motif ; une 2e demande AJOUTE une ligne, n'en réécrit aucune", () => {
    const d = produit("deux-demandes");
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsProduitNeuf())]);
    const v = verdictsProduitNeuf(); v.ops = { verdict: "ecartee", motif: "0 fichier de déploiement touché par cette demande" }; v.data = { verdict: "ecartee", motif: "aucune donnée à agréger ici" };
    const r = lancer(d, ["--type", "evolution", "--verdicts", ecrireVerdicts(d, v)]);
    att(r.code === 0, `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    att(trace(d).length === 2, `${trace(d).length} ligne(s) au lieu de 2`);
    att(/− ops \(0 fichier de déploiement/.test(r.sortie.ligne_ecran), `l'écart à la carte n'est pas dit : ${r.sortie.ligne_ecran}`);
  });

  check("rouge — une forge sans verdict (12 sur 13) est refusée en la nommant, et rien n'est écrit", () => {
    const d = produit("douze");
    const v = verdictsProduitNeuf(); delete v.audit;
    const r = lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, v)]);
    att(r.code === 1 && /audit/.test(r.brut), `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    att(!trace(d).length, "une ligne a été écrite malgré le refus");
  });

  check("rouge — un motif resté au gabarit « <…> », vide ou de moins de 3 mots est refusé", () => {
    for (const motif of ["<motif : pourquoi>", "", "hors sujet"]) {
      const d = produit(`motif-${motif.length}`);
      const v = verdictsProduitNeuf(); v.websec = { verdict: "ecartee", motif };
      const r = lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, v)]);
      att(r.code === 1 && /websec/.test(r.brut), `motif « ${motif} » : exit ${r.code}`);
    }
  });

  check("rouge (D-99 b) — ops, websec ou data écartées d'une demande qui les vise, sans fait mesuré, sont refusées et rien n'est écrit", () => {
    for (const [f, type, demande] of [["ops", "evolution", "ajouter un filtre"], ["websec", "securite", "corriger des défauts"], ["data", "document", "Crée une fiche DPO de l'application"], ["ops", "document", "plan de déploiement sur Cloudflare"]]) {
      const d = produit(`ecart-${f}-${type}`);
      const v = verdictsProduitNeuf(); v[f] = { verdict: "ecartee", motif: "hors carte pour cette demande" };
      const r = lancer(d, ["--type", type, "--demande", demande, "--verdicts", ecrireVerdicts(d, v)]);
      att(r.code === 1 && new RegExp(`${f} : la demande la vise`).test(r.brut), `${f} / ${type} : exit ${r.code} ${r.brut.slice(0, 200)}`);
      att(trace(d).length === 0, `${f} / ${type} : une ligne a été écrite`);
    }
  });

  check("vert (D-99 b) — le même écart avec un fait mesuré passe, et une forge que la demande ne vise pas s'écarte d'un motif simple", () => {
    for (const motif of ["0 fichier de déploiement touché", "seul src/filtre.ts change", "`git diff --stat` ne touche aucun workflow"]) {
      const d = produit(`fait-${motif.length}`);
      const v = verdictsProduitNeuf(); v.ops = { verdict: "ecartee", motif };
      const r = lancer(d, ["--type", "evolution", "--demande", "ajouter un filtre", "--verdicts", ecrireVerdicts(d, v)]);
      att(r.code === 0, `motif « ${motif} » : exit ${r.code} ${r.brut.slice(0, 200)}`);
    }
    const d = produit("non-visee");
    const v = verdictsProduitNeuf(); v.ops = { verdict: "ecartee", motif: "un document ne se déploie pas" };
    const r = lancer(d, ["--type", "document", "--demande", "rédiger une note", "--verdicts", ecrireVerdicts(d, v)]);
    att(r.code === 0, `forge non visée : exit ${r.code} ${r.brut.slice(0, 200)}`);
  });

  check("rouge — un type hors de la carte est refusé avec la liste des types connus", () => {
    const d = produit("type-inconnu");
    const r = lancer(d, ["--type", "refonte-totale", "--verdicts", ecrireVerdicts(d, verdictsProduitNeuf())]);
    att(r.code === 1 && /produit-neuf/.test(r.brut) && /refonte-totale/.test(r.brut), `exit ${r.code} : ${r.brut.slice(0, 300)}`);
  });

  check("rouge puis remède — sans profil déclaré, refus avec la commande ; --profil le déclare (forge/PROFIL.json) et la ligne s'écrit", () => {
    const d = produit("sans-profil", { profil: false });
    const f = ecrireVerdicts(d, verdictsProduitNeuf());
    const r = lancer(d, ["--type", "produit-neuf", "--verdicts", f]);
    att(r.code === 1 && /--profil/.test(r.brut), `sans profil : exit ${r.code} : ${r.brut.slice(0, 300)}`);
    const r2 = lancer(d, ["--type", "produit-neuf", "--verdicts", f, "--profil", "domaine_public=oui,page_indexable=oui,donnees_personnelles=non,agents=non,mise_en_production=oui"]);
    att(r2.code === 0, `avec --profil : exit ${r2.code} : ${r2.brut.slice(0, 300)}`);
    att(existsSync(join(d, "forge", "PROFIL.json")), "le profil n'a pas été déclaré dans forge/PROFIL.json");
    att(trace(d)[0].profil.page_indexable === true, "la ligne ne porte pas le profil déclaré");
  });

  check("--preparer rend les 13 forges : privilégiées et désignées par le profil proposées mobilisées, motifs au gabarit, refusés tels quels", () => {
    const d = produit("preparer", { profil: false });
    writeFileSync(join(d, "forge", "PROFIL.json"), JSON.stringify({ signaux: { domaine_public: true, page_indexable: true, donnees_personnelles: false, agents: false, mise_en_production: true } }), "utf8");
    const sortie = join(d, "squelette.json");
    const r = lancer(d, ["--preparer", "--type", "evolution", "--sortie", sortie]);
    att(r.code === 0 && existsSync(sortie), `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    const s = JSON.parse(readFileSync(sortie, "utf8"));
    att(FORGES.every((f) => f in s.verdicts), "le squelette ne porte pas les 13 forges");
    att(s.verdicts.tests.verdict === "mobilisee" && s.verdicts["seo-geo"].verdict === "mobilisee" && s.verdicts.audit.verdict === "ecartee",
      `propositions : tests ${s.verdicts.tests.verdict}, seo-geo ${s.verdicts["seo-geo"].verdict}, audit ${s.verdicts.audit.verdict}`);
    const r2 = lancer(d, ["--verdicts", sortie]);
    att(r2.code === 1 && /gabarit/.test(r2.brut), `le squelette non rempli passe : exit ${r2.code}`);
  });

  check("hors d'un produit (aucun forge/retours/ en remontant), l'écrivain rend la main : exit 2", () => {
    const d = join(T, "pas-un-produit"); mkdirSync(d, { recursive: true });
    const r = lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsProduitNeuf())]);
    att(r.code === 2, `exit ${r.code}`);
  });

  check("--verifier (item 3) : livrables des forges mobilisées manquants → exit 1 en les nommant ; produits → exit 0 ; sans trace → exit 2", () => {
    const d = produit("verifier");
    const sans = lancer(d, ["--verifier"]);
    att(sans.code === 2, `sans trace : exit ${sans.code}`);
    const v = verdictsProduitNeuf(); v.data = { verdict: "ecartee", motif: "aucune donnée à agréger ici" };
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, v)]);
    const r = lancer(d, ["--verifier"]);
    att(r.code === 1 && r.sortie && r.sortie.manquants.some((m) => /^conception → EXIGENCES\.json/.test(m)), `livrables absents : exit ${r.code} ${r.brut.slice(0, 300)}`);
    att(r.sortie.manquants.length === 5, `${r.sortie.manquants.length} manquant(s) au lieu de 5 (EXIGENCES.json, DESIGN.md, jetons, rapport forge-tests, DOSSIER-MEP.md)`);
    for (const rel of ["forge/etapes/conception/EXIGENCES.json", "forge/etapes/design/DESIGN.md", "forge/etapes/design/tokens.css", "forge/etapes/tests/rapport-20261026.json", "forge/DOSSIER-MEP.md"]) {
      mkdirSync(dirname(join(d, rel)), { recursive: true }); writeFileSync(join(d, rel), "x", "utf8");
    }
    const ok = lancer(d, ["--verifier"]);
    att(ok.code === 0 && ok.sortie.verdict === "PRESENT", `livrables produits : exit ${ok.code} ${ok.brut.slice(0, 300)}`);
  });

  check("--verifier (TF-2136) : un livrable écrit AVANT la demande est périmé (manquant), réécrit après il redevient présent", () => {
    const d = produit("fraicheur");
    // les 5 livrables déposés, mais datés une heure avant la demande à venir
    const rels = ["forge/etapes/conception/EXIGENCES.json", "forge/etapes/design/DESIGN.md", "forge/etapes/design/tokens.css", "forge/etapes/tests/rapport-20261026.json", "forge/DOSSIER-MEP.md"];
    const vieux = new Date(Date.now() - 3600_000);
    for (const rel of rels) { mkdirSync(dirname(join(d, rel)), { recursive: true }); writeFileSync(join(d, rel), "x", "utf8"); utimesSync(join(d, rel), vieux, vieux); }
    const v = verdictsProduitNeuf(); v.data = { verdict: "ecartee", motif: "aucune donnée à agréger ici" };
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, v)]); // demande écrite maintenant : ts > vieux
    const r = lancer(d, ["--verifier"]);
    att(r.code === 1 && r.sortie.verdict === "MANQUE" && r.sortie.manquants.length === 5, `5 livrables périmés doivent manquer : exit ${r.code} ${r.brut.slice(0, 300)}`);
    att(r.sortie.manquants.every((m) => /périmé/.test(m)), `chaque manquant doit se dire périmé : ${r.sortie.manquants.join(" | ").slice(0, 300)}`);
    att(r.sortie.exiges.every((e) => e.perime === true && e.present === false), `drapeau perime attendu sur chaque exigé : ${JSON.stringify(r.sortie.exiges).slice(0, 300)}`);
    // réécriture après la demande : frais → présent
    for (const rel of rels) writeFileSync(join(d, rel), "y", "utf8");
    const ok = lancer(d, ["--verifier"]);
    att(ok.code === 0 && ok.sortie.verdict === "PRESENT", `après réécriture : exit ${ok.code} ${ok.brut.slice(0, 200)}`);
  });

  check("--verifier (TF-2080) : le verdict de design écrit par run-oracles sous .oracles/output/ est reconnu présent", () => {
    const d = produit("verdict-sous-oracles");
    const v = {};
    for (const f of FORGES) v[f] = { verdict: "ecartee", motif: `la demande ne touche pas le domaine ${f}` };
    v.design = { verdict: "mobilisee", motif: "document à la marque, verdict de format du livrable attendu" };
    const w = lancer(d, ["--type", "document", "--verdicts", ecrireVerdicts(d, v), "--demande", "produire la note à la marque"]);
    att(w.code === 0, `écriture de la trace : exit ${w.code} ${w.brut.slice(0, 200)}`);
    // rouge : aucun verdict écrit → verdict-format manquant
    const sans = lancer(d, ["--verifier"]);
    att(sans.code === 1 && sans.sortie && sans.sortie.manquants.some((m) => /format du document|verdict-format/.test(m)),
      `sans verdict, verdict-format doit manquer : exit ${sans.code} ${sans.brut.slice(0, 250)}`);
    // vert : run-oracles écrit le compagnon sous .oracles/output/ (miroir de output/), reconnu par le chemin ajouté à la carte
    mkdirSync(join(d, ".oracles", "output", "04-plans"), { recursive: true });
    writeFileSync(join(d, ".oracles", "output", "04-plans", "note.md.oracles.json"), '{"verdict":"PASS"}', "utf8");
    const avec = lancer(d, ["--verifier"]);
    att(avec.code === 0 && avec.sortie && avec.sortie.verdict === "PRESENT",
      `verdict sous .oracles/output/ doit être reconnu présent : exit ${avec.code} ${avec.brut.slice(0, 250)}`);
  });

  check("une demande à deux types cumule leurs forges privilégiées (produit-neuf + site-web : seo-geo et websec privilégiées)", () => {
    const d = produit("deux-types");
    const v = verdictsProduitNeuf();
    v["seo-geo"] = { verdict: "mobilisee", motif: "la vitrine publique doit être trouvée" };
    v.websec = { verdict: "mobilisee", motif: "la vitrine est exposée sur un domaine public" };
    const r = lancer(d, ["--type", "produit-neuf,site-web", "--verdicts", ecrireVerdicts(d, v)]);
    att(r.code === 0, `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    const l = trace(d)[0];
    att(l.type === "produit-neuf+site-web" && l.verdicts["seo-geo"].privilegiee === true, `type ${l.type}, seo-geo privilégiée : ${l.verdicts["seo-geo"].privilegiee}`);
    att(!/\+ seo-geo/.test(r.sortie.ligne_ecran), "seo-geo est dite hors carte alors que le second type la privilégie");
  });
  // TF-2017 (RT-27, 29/10/2026) : le champ `demande` mis dans le fichier était ignoré en silence.
  check("TF-2017 — le squelette de --preparer porte « demande », et --verdicts lit la demande écrite dans le fichier", () => {
    const d = produit("demande-fichier");
    const p = lancer(d, ["--preparer", "--type", "produit-neuf"]);
    att(p.code === 0 && p.sortie && typeof p.sortie.demande === "string", `squelette sans demande : ${p.brut.slice(0, 200)}`);
    const f = ecrireVerdicts(d, { types: ["produit-neuf"], demande: "refondre la page d accueil", verdicts: verdictsProduitNeuf() });
    const r = lancer(d, ["--verdicts", f]);
    att(r.code === 0, `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    att(trace(d)[0].demande === "refondre la page d accueil", `demande tracée : ${trace(d)[0].demande}`);
    att(!r.sortie.avertissement, "un avertissement sort alors que la demande est fournie");
  });
  check("TF-2017 — la demande laissée au gabarit est refusée sans rien écrire ; une demande absente s'écrit mais la sortie le dit", () => {
    const d = produit("demande-gabarit");
    const gabarit = lancer(d, ["--preparer", "--type", "produit-neuf"]).sortie.demande;
    const r = lancer(d, ["--verdicts", ecrireVerdicts(d, { types: ["produit-neuf"], demande: gabarit, verdicts: verdictsProduitNeuf() })]);
    att(r.code === 1 && r.sortie.verdict === "REFUS" && trace(d).length === 0, `gabarit accepté : exit ${r.code}`);
    const s = lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsProduitNeuf())]);
    att(s.code === 0 && trace(d)[0].demande === null && /demande absente/.test(s.sortie.avertissement || ""), `absence muette : ${JSON.stringify(s.sortie).slice(0, 200)}`);
  });

  // TF-2045 (02/11/2026) : deux sessions d'un produit écrivent le même fichier ; --verifier juge la dernière ligne de la session qui vérifie.
  // La session A mobilise les 5 forges du produit neuf, data écartée : 5 livrables manquent (comme au cas --verifier ci-dessus).
  const verdictsA = () => ({ ...verdictsProduitNeuf(), data: { verdict: "ecartee", motif: "aucune donnée à agréger ici" } });
  const verdictsSansRien = () => Object.fromEntries(FORGES.map((f) => [f, { verdict: "ecartee", motif: `aucun fichier du produit n'est touché (0 fichier) : la forge ${f} n'a pas lieu d'être` }]));
  check("TF-2045 rouge — la session A, dont les livrables manquent, n'est plus jugée sur la ligne que la session B a écrite après elle", () => {
    const d = produit("deux-sessions");
    att(lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsA())], "sess-A").code === 0, "écriture de A");
    att(lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsSansRien())], "sess-B").code === 0, "écriture de B");
    const lignes = trace(d);
    att(lignes.length === 2 && lignes[0].session === "sess-A" && lignes[1].session === "sess-B", `chaque ligne porte l'identifiant de sa session : ${lignes.map((l) => l.session)}`);
    const a = lancer(d, ["--verifier"], "sess-A");
    att(a.code === 1 && a.sortie.verdict === "MANQUE" && a.sortie.manquants.length === 5 && a.sortie.session === "sess-A" && a.sortie.derniere_demande.session === "sess-A",
      `A doit être jugée sur SA ligne (5 manquants) : exit ${a.code} ${a.brut.slice(0, 300)}`);
  });
  check("TF-2045 vert — la session B, dont la ligne n'exige rien, passe ; --session désigne la session sans variable d'environnement", () => {
    const d = produit("deux-sessions-b");
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsA())], "sess-A");
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsSansRien())], "sess-B");
    const b = lancer(d, ["--verifier"], "sess-B");
    att(b.code === 0 && b.sortie.verdict === "PRESENT" && b.sortie.repli === null, `B : exit ${b.code} ${b.brut.slice(0, 300)}`);
    const parOption = lancer(d, ["--verifier", "--session", "sess-A"]);
    att(parOption.code === 1 && parOption.sortie.session === "sess-A", `--session sess-A : exit ${parOption.code} ${parOption.brut.slice(0, 300)}`);
  });
  check("TF-2045 — une session sans ligne propre n'emprunte pas la ligne d'une autre : exit 2, les lignes des autres sessions comptées", () => {
    const d = produit("deux-sessions-c");
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsA())], "sess-A");
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsSansRien())], "sess-B");
    const c = lancer(d, ["--verifier"], "sess-C");
    att(c.code === 2 && c.sortie.verdict === "SANS_TRACE" && c.sortie.autres_sessions === 2 && /2 ligne\(s\) d'autres sessions/.test(c.sortie.message), `C : exit ${c.code} ${c.brut.slice(0, 300)}`);
  });
  check("TF-2045 — repli déclaré : une ligne d'avant l'identifiant sert à la session qui n'a rien écrit, et sans identifiant de session la dernière ligne sert, les deux DITS", () => {
    const d = produit("ligne-ancienne");
    att(lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsProduitNeuf())]).code === 0, "écriture sans session");
    att(trace(d)[0].session === null, `une ligne écrite sans session porte session: ${trace(d)[0].session}`);
    const a = lancer(d, ["--verifier"], "sess-A");
    att(a.code === 1 && a.sortie.repli === "ancienne" && /SANS identifiant de session/.test(a.sortie.repli_dit), `repli ancien : exit ${a.code} ${a.brut.slice(0, 300)}`);
    const n = lancer(d, ["--verifier"]);
    att(n.code === 1 && n.sortie.repli === "session-non-identifiee" && /aucune session n'est identifiée/.test(n.sortie.repli_dit), `sans session : exit ${n.code} ${n.brut.slice(0, 300)}`);
    lancer(d, ["--type", "produit-neuf", "--verdicts", ecrireVerdicts(d, verdictsSansRien())], "sess-B");
    const sansSession = lancer(d, ["--verifier"]);
    att(sansSession.code === 0 && sansSession.sortie.repli === "session-non-identifiee", `sans session, dernière ligne du fichier : exit ${sansSession.code}`);
  });

  // TF-2144 (RT-44 du 04/11/2026) : forge-audit mobilisée chez un produit dont le client publie une porte d'audit → la sortie de CETTE porte
  // (forge/audit/<date>/porte-client.txt, fraîche et CONFORME) est exigée aussi. Un parc jetable : racine = T (FORGE_ROOT), client `_ClientFictif`.
  const verdictsAudit = () => { const v = verdictsSansRien(); v.audit = { verdict: "mobilisee", motif: "la demande est un audit complet du produit (0 fichier touché)" }; return v; };
  const clientFictif = (nom) => {
    const commun = join(T, "_ClientFictif", "commun");
    mkdirSync(join(commun, "kit"), { recursive: true });
    writeFileSync(join(commun, "CONVENTIONS-CLIENT.md"), "# Conventions\n\n- Audit : rapport au modèle POC-to-Prod, porte du kit.\n", "utf8");
    writeFileSync(join(commun, "kit", "verifier-rapport-audit.mjs"), "// porte fictive\n", "utf8");
    const d = join(T, "_ClientFictif", nom);
    mkdirSync(join(d, "forge", "retours"), { recursive: true });
    writeFileSync(join(d, "forge", "PROFIL.json"), JSON.stringify({ signaux: { domaine_public: false, page_indexable: false, donnees_personnelles: false, agents: false, mise_en_production: false } }), "utf8");
    return d;
  };
  const ENV_CLIENT = { FORGE_ROOT: T };
  const ecrireAudit = (d, rel, contenu) => { const f = join(d, "forge", "audit", ...rel.split("/")); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, contenu, "utf8"); };
  check("rouge → vert — TF-2144 : forge-audit mobilisée chez un client qui publie sa porte → la sortie de cette porte manque tant qu'elle n'est pas CONFORME", () => {
    const d = clientFictif("produit-audit");
    att(lancer(d, ["--type", "audit-complet", "--verdicts", ecrireVerdicts(d, verdictsAudit()), "--demande", "audit complet du produit"], null, ENV_CLIENT).code === 0, "écriture de la trace");
    const r = lancer(d, ["--verifier"], null, ENV_CLIENT);
    att(r.code === 1 && r.sortie.manquants.length === 2 && r.sortie.manquants.some((m) => /^audit → porte du standard d'audit du client _ClientFictif \(verifier-rapport-audit\.mjs\)/.test(m)),
      `rapport ET porte du client doivent manquer : exit ${r.code} ${r.brut.slice(0, 400)}`);
    ecrireAudit(d, "20261105/rapport-data.json", "{}");
    const r2 = lancer(d, ["--verifier"], null, ENV_CLIENT);
    att(r2.code === 1 && r2.sortie.manquants.length === 1 && /porte du standard d'audit du client/.test(r2.sortie.manquants[0]), `le rapport produit, la porte manque encore : ${r2.brut.slice(0, 300)}`);
    ecrireAudit(d, "20261105/porte-client.txt", "❌ NON CONFORME — 5 anomalie(s) bloquante(s) :\nPublication INTERDITE");
    const r3 = lancer(d, ["--verifier"], null, ENV_CLIENT);
    att(r3.code === 1 && /dit NON CONFORME/.test(r3.sortie.manquants[0]), `une sortie NON CONFORME ne vaut pas la porte : ${r3.brut.slice(0, 300)}`);
    ecrireAudit(d, "20261105/porte-client.txt", "✅ CONFORME — format conforme au modèle, rapport diffusable.");
    const r4 = lancer(d, ["--verifier"], null, ENV_CLIENT);
    att(r4.code === 0 && r4.sortie.verdict === "PRESENT", `sortie CONFORME : exit ${r4.code} ${r4.brut.slice(0, 300)}`);
  });
  check("vert — TF-2144 : hors d'un dossier client, ou avant le 05/11/2026, la porte n'est pas exigée (seul le rapport forge-audit l'est)", () => {
    const libre = produit("audit-hors-client");
    att(lancer(libre, ["--type", "audit-complet", "--verdicts", ecrireVerdicts(libre, verdictsAudit())], null, ENV_CLIENT).code === 0, "trace hors client");
    const r = lancer(libre, ["--verifier"], null, ENV_CLIENT);
    att(r.code === 1 && r.sortie.manquants.length === 1 && /rapport forge-audit/.test(r.sortie.manquants[0]), `hors client : un seul manquant attendu : ${r.brut.slice(0, 300)}`);
    const ancien = clientFictif("produit-audit-ancien");
    att(lancer(ancien, ["--type", "audit-complet", "--verdicts", ecrireVerdicts(ancien, verdictsAudit())], null, ENV_CLIENT).code === 0, "trace du client");
    const f = join(ancien, "forge", "mobilisation.jsonl");
    writeFileSync(f, readFileSync(f, "utf8").replace(/"ts":"[^"]+"/, '"ts":"2026-11-04T10:00:00.000Z"'), "utf8");
    ecrireAudit(ancien, "20261104/rapport-data.json", "{}");
    const a = lancer(ancien, ["--verifier"], null, ENV_CLIENT);
    att(a.code === 0 && a.sortie.verdict === "PRESENT", `demande tracée avant le 05/11 : non rétroactif : exit ${a.code} ${a.brut.slice(0, 300)}`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nmobiliser (TF-1949, items 2 et 3) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
