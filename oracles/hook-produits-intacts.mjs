#!/usr/bin/env node
/**
 * hook-produits-intacts.mjs — LE PILOT N'ÉCRIT PAS CHEZ UN PRODUIT, et ce n'est plus une consigne.
 *
 * POURQUOI CE HOOK EXISTE (décision humaine du 23/08/2026 : « ne touche pas les produits, seuls
 * les produits se modifient eux-mêmes »). Le garde-fou était écrit dans `CLAUDE.md` depuis
 * l'origine — « produits autonomes : le pilot n'y intervient que sur run demandé » — et rien ne
 * l'exécutait. Une consigne qu'aucun mécanisme ne tient est une consigne qu'on suit par
 * discipline, c'est-à-dire une consigne qu'on finira par ne pas suivre : c'est exactement la
 * maladie que la première loi transverse nomme, appliquée à un garde-fou plutôt qu'à un bouton.
 *
 * CE QUI A ÉTÉ ÉCARTÉ, ET POURQUOI. Un hook `PreToolUse` qui refuserait une écriture d'après le
 * chemin de l'outil ne verrait QUE `Write` et `Edit`. Or l'essentiel des écritures d'une session
 * de pilotage passe par un script lancé en `Bash` — un `python` qui réécrit un fichier, un `sed`,
 * une redirection. Refuser sur le chemin déclaré protégerait donc du cas le plus rare en
 * laissant passer le plus fréquent : une garantie de façade, pire qu'une absence de garantie.
 *
 * CE QUI EST FAIT À LA PLACE : une COMPARAISON D'ÉTAT, insensible à l'outil employé. À
 * l'ouverture, on relève pour chaque dépôt produit son `HEAD` et l'empreinte de son état de
 * travail. À la fin du tour, on recompare. Une modification, un commit, un fichier neuf — quelle
 * que soit la voie — se voit. Et le tour est BLOQUÉ tant que la restitution ne l'a pas déclaré.
 *
 * L'ÉCHAPPATOIRE EST NOMMÉE, JAMAIS DEVINÉE : `FORGE_MANDAT_PRODUIT=<nom>` déclare le produit sur
 * lequel un run est demandé. Ce produit-là est alors suivi et RAPPORTÉ, jamais bloqué — un run
 * demandé écrit chez son produit, c'est sa raison d'être.
 *
 * Usage :
 *   node oracles/hook-produits-intacts.mjs --empreinte   (SessionStart : relève l'état)
 *   node oracles/hook-produits-intacts.mjs               (Stop : compare, bloque si écart)
 *   node oracles/hook-produits-intacts.mjs --self-test   (les deux sens, sur des dépôts jouets)
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

/** Un dépôt du parc qui n'est ni le pilot ni une forge est un PRODUIT. */
const EST_FORGE = (nom) => /^digit-ai/.test(nom);
const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build"]);

function depotsProduits(racine) {
  const out = [];
  const visiter = (dossier, prof) => {
    if (prof > 2 || !existsSync(dossier)) return;
    let entrees = [];
    try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (!e.isDirectory() || IGNORES.has(e.name)) continue;
      const chemin = join(dossier, e.name);
      if (existsSync(join(chemin, ".git"))) {
        // Un dépôt. Forge ou pilot : hors sujet. Produit : suivi.
        if (!EST_FORGE(e.name)) out.push(chemin);
        continue;                       // on ne descend pas DANS un dépôt
      }
      visiter(chemin, prof + 1);        // dossier de rangement (`_Client-A\`, etc.)
    }
  };
  visiter(racine, 0);
  return out.sort();
}

const git = (depot, ...a) => spawnSync("git", ["-C", depot, ...a], { encoding: "utf8" });

/** HEAD + empreinte de l'état de travail. Deux nombres suffisent : ils bougent à la moindre écriture. */
function etat(depot) {
  const head = (git(depot, "rev-parse", "HEAD").stdout || "").trim() || "(sans commit)";
  const porcelain = (git(depot, "status", "--porcelain").stdout || "");
  return { head, travail: createHash("sha256").update(porcelain).digest("hex").slice(0, 12),
           lignes: porcelain.split("\n").filter(Boolean).length };
}

const racineParc = process.env.FORGE_ROOT || join(PILOT, "..");
const EMPREINTE = join(PILOT, ".oracles", "produits-au-demarrage.json");
const mandat = (process.env.FORGE_MANDAT_PRODUIT || "").trim();

function relever(racine = racineParc, sortie = EMPREINTE) {
  const produits = {};
  for (const d of depotsProduits(racine)) produits[d] = etat(d);
  mkdirSync(dirname(sortie), { recursive: true });
  writeFileSync(sortie, JSON.stringify({
    schema: "pilot/produits-au-demarrage@1", releve_le: new Date().toISOString(),
    racine: String(racine), mandat: mandat || null, produits,
  }, null, 1) + "\n", "utf8");
  return produits;
}

function comparer(racine = racineParc, empreinte = EMPREINTE) {
  if (!existsSync(empreinte)) {
    // Sans relevé d'ouverture, on ne peut RIEN dire : le dire vaut mieux que de laisser croire
    // à un contrôle qui a tourné. Jamais bloquant — l'absence n'est pas une faute du tour.
    return { verdict: "SKIP", motif: `aucun relevé d'ouverture (${empreinte}) — le contrôle ne s'est pas exécuté au démarrage`, ecarts: [] };
  }
  let avant = null;
  try { avant = JSON.parse(readFileSync(empreinte, "utf8")); }
  catch { return { verdict: "SKIP", motif: "relevé d'ouverture illisible", ecarts: [] }; }
  const ecarts = [];
  const declares = [];
  for (const [depot, etatAvant] of Object.entries(avant.produits || {})) {
    if (!existsSync(depot)) { declares.push(`${depot} : dépôt absent à la fin du tour (déplacé ou retiré)`); continue; }
    const apres = etat(depot);
    const bouge = apres.head !== etatAvant.head || apres.travail !== etatAvant.travail;
    if (!bouge) continue;
    const nom = depot.split(/[\\/]/).pop();
    const quoi = [
      apres.head !== etatAvant.head ? `HEAD ${etatAvant.head.slice(0, 7)} → ${apres.head.slice(0, 7)}` : null,
      apres.travail !== etatAvant.travail ? `état de travail ${etatAvant.lignes} → ${apres.lignes} fichier(s) modifié(s)` : null,
    ].filter(Boolean).join(", ");
    if (mandat && (nom === mandat || depot.endsWith(mandat))) declares.push(`${nom} : ${quoi} — MANDAT DÉCLARÉ (FORGE_MANDAT_PRODUIT)`);
    else ecarts.push(`${nom} (${depot}) : ${quoi}`);
  }
  return { verdict: ecarts.length ? "FAIL" : "PASS", ecarts, declares,
           motif: `${Object.keys(avant.produits || {}).length} produit(s) suivi(s) depuis ${avant.releve_le}` };
}

// ---- recette : les deux sens, sur des dépôts jouets ------------------------------------------
if (args.includes("--self-test")) {
  const base = mkdtempSync(join(tmpdir(), "produits-intacts-"));
  const faire = (nom, forge = false) => {
    const d = join(base, forge ? nom : join("_produits", nom));
    mkdirSync(d, { recursive: true });
    git(d, "init", "-q");
    writeFileSync(join(d, "a.txt"), "un\n");
    git(d, "add", "-A"); git(d, "-c", "user.email=x@y", "-c", "user.name=x", "commit", "-qm", "initial");
    return d;
  };
  const produit = faire("mon-produit");
  const autre = faire("autre-produit");
  faire("digit-ai-forge-jouet", true);
  const emp = join(base, "empreinte.json");
  let pass = 0; const echecs = [];
  const ok = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };

  console.log("Recette de hook-produits-intacts — les deux sens\n");
  const releves = relever(base, emp);
  ok("les DEUX produits sont suivis, la forge jouet ne l'est pas",
    Object.keys(releves).length === 2 && !Object.keys(releves).some((d) => /digit-ai/.test(d)));

  let r = comparer(base, emp);
  ok("rien touché → PASS", r.verdict === "PASS" && r.ecarts.length === 0);

  // Un fichier modifié SANS commit : c'est le cas le plus courant d'une écriture de passage.
  writeFileSync(join(produit, "a.txt"), "deux\n");
  r = comparer(base, emp);
  ok("un fichier modifié sans commit → FAIL", r.verdict === "FAIL" && r.ecarts.length === 1);
  ok("le constat NOMME le produit et ce qui a bougé",
    /mon-produit/.test(r.ecarts[0]) && /fichier\(s\) modifié\(s\)/.test(r.ecarts[0]));

  // Un COMMIT : la voie qu'un hook d'écriture ne verrait pas non plus.
  git(produit, "add", "-A"); git(produit, "-c", "user.email=x@y", "-c", "user.name=x", "commit", "-qm", "écriture de passage");
  r = comparer(base, emp);
  ok("un commit → FAIL, et le HEAD est cité", r.verdict === "FAIL" && /HEAD /.test(r.ecarts[0]));

  // L'autre produit, intact, ne doit pas être accusé : un contrôle qui accuse tout n'accuse rien.
  ok("le produit intact n'est PAS accusé", !r.ecarts.some((e) => /autre-produit/.test(e)));

  // Le MANDAT déclaré : le produit est suivi et RAPPORTÉ, jamais bloqué.
  process.env.FORGE_MANDAT_PRODUIT = "mon-produit";
  const module2 = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--comparer-pour-test", base, emp],
    { encoding: "utf8", env: { ...process.env, FORGE_MANDAT_PRODUIT: "mon-produit" } });
  ok("avec un mandat déclaré, l'écart est RAPPORTÉ et non bloquant",
    module2.status === 0 && /MANDAT DÉCLARÉ/.test(module2.stdout));

  rmSync(base, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  console.log(`\nRecette produits-intacts : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// Mode interne de la recette : rejouer la comparaison dans un process portant le mandat.
if (args[0] === "--comparer-pour-test") {
  const r = comparer(args[1], args[2]);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}

if (args.includes("--empreinte")) {
  const p = relever();
  console.log(`[ok] produits suivis : ${Object.keys(p).length} dépôt(s) relevé(s)` +
    (mandat ? ` — mandat déclaré sur « ${mandat} »` : " — aucun mandat déclaré : toute écriture chez eux sera refusée"));
  process.exit(0);
}

// ---- Stop : on compare, et on BLOQUE si un produit a bougé sans mandat -----------------------
const r = comparer();
if (r.verdict === "FAIL") {
  const raison = "ÉCRITURE CHEZ UN PRODUIT — le pilot n'y intervient que sur run demandé " +
    "(décision humaine du 23/08 : « ne touche pas les produits, seuls les produits se modifient " +
    "eux-mêmes »). Ce qui a bougé pendant ce tour :\n  - " + r.ecarts.join("\n  - ") +
    "\n\nDeux issues, aucune n'est un silence : ANNULER la modification chez le produit " +
    "(`git -C <produit> checkout -- .` pour un travail non commité), ou DÉCLARER le run demandé " +
    "en posant FORGE_MANDAT_PRODUIT=<nom du produit> et en le journalisant. " +
    "Ce contrôle compare l'état des dépôts produits entre l'ouverture et la fin du tour : il ne " +
    "dépend pas de l'outil employé, donc un script lancé en shell est vu comme une édition directe.";
  console.log(JSON.stringify({ decision: "block", reason: raison }));
  process.exit(0);
}
if (r.declares && r.declares.length) console.log(`[info] ${r.declares.join(" · ")}`);
process.exit(0);
