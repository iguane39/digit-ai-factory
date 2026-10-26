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
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
const lancer = (cwd, args) => {
  const r = spawnSync(process.execPath, [ECRIVAIN, ...args], { cwd, encoding: "utf8" });
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
    const v = verdictsProduitNeuf(); v.ops = { verdict: "ecartee", motif: "aucune mise en production dans cette demande" }; v.data = { verdict: "ecartee", motif: "aucune donnée à agréger ici" };
    const r = lancer(d, ["--type", "evolution", "--verdicts", ecrireVerdicts(d, v)]);
    att(r.code === 0, `exit ${r.code} : ${r.brut.slice(0, 300)}`);
    att(trace(d).length === 2, `${trace(d).length} ligne(s) au lieu de 2`);
    att(/− ops \(aucune mise en production/.test(r.sortie.ligne_ecran), `l'écart à la carte n'est pas dit : ${r.sortie.ligne_ecran}`);
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
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nmobiliser (TF-1949, items 2 et 3) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
