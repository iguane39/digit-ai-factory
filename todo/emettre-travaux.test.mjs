#!/usr/bin/env node
/**
 * emettre-travaux.test.mjs — recette de l'émetteur de lots de travaux (TF-0627).
 *
 * Les promesses qui rendent ce canal acceptable, chacune dans les deux sens :
 *   · il n'écrit QUE dans `input\00-travaux\` — vérifié par empreinte de l'arborescence ;
 *   · il joue son propre juge AVANT d'écrire, et ne dépose pas un lot en défaut ;
 *   · il est idempotent par contenu — deux passages ne s'empilent pas ;
 *   · `--essai` n'écrit rien, nulle part ;
 *   · un produit conforme ne reçoit AUCUN lot : un canal qui parle pour ne rien dire se fait taire.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { lotHeritage, indiceLibre, dateLot } from "./emettre-travaux.mjs";
import { verifier } from "../gabarits/oracle-travaux-pilot.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const LIGNE = (artefacts) => ({ produit: "produit-recette", dossier: "C:\\faux\\produit-recette", artefacts });
const ABSENT = (cible, mode = "copie_conforme") => ({ cible, mode, etat: "absent" });

const T = mkdtempSync(join(tmpdir(), "emettre-travaux-"));
try {
  check("un lot est produit pour chaque artefact manquant, et il PASSE son propre juge", () => {
    const lot = lotHeritage(LIGNE([ABSENT("forge/RESTITUTION.md"), ABSENT("forge/hooks/factory.mjs")]), "20260825", "a");
    att(lot && lot.elements === 2, `${lot && lot.elements} élément(s) au lieu de 2`);
    const r = verifier(lot.md);
    att(r.verdict === "PASS", `le lot émis ne tient pas sa propre forme : ${r.constats.filter((c) => c.statut === "FAIL").map((c) => c.regle).join(", ")}`);
  });

  check("un produit CONFORME ne reçoit AUCUN lot — un canal qui parle pour rien se fait taire", () => {
    const lot = lotHeritage(LIGNE([{ cible: "forge/RESTITUTION.md", mode: "copie_conforme", etat: "conforme" }]), "20260825", "a");
    att(lot === null, "un lot a été produit alors qu'il n'y a rien à confier");
  });

  check("un artefact PÉRIMÉ est confié comme tel, avec les deux empreintes qui le prouvent", () => {
    // TF-0645 : les empreintes s'appellent `empreinte_pilot` et `empreinte_produit` depuis le
    // 26/08. Elles s'appelaient `source` et `produit` — or `source` porte, AU CONTRAT, le CHEMIN
    // de l'artefact chez le pilot. La collision faisait perdre ce chemin au relevé, et le lot le
    // REFABRIQUAIT par chirurgie de chaîne : trois chemins faux sur neuf dans un lot réellement
    // déposé. Le `source` de cette fixture est donc désormais le chemin, et il est VÉRIFIÉ.
    const lot = lotHeritage(LIGNE([{ cible: "forge/RESTITUTION.md", source: "gabarits/RESTITUTION.md",
      mode: "copie_conforme", etat: "divergent", empreinte_pilot: "aaaaaaaaaaaa", empreinte_produit: "bbbbbbbbbbbb" }]), "20260825", "a");
    att(lot, "aucun lot produit pour un artefact périmé");
    att(/PÉRIMÉ/.test(lot.md), "le lot ne dit pas que l'artefact est périmé plutôt qu'absent");
    att(lot.md.includes("aaaaaaaaaaaa") && lot.md.includes("bbbbbbbbbbbb"),
      "le lot ne cite pas les deux empreintes — le produit ne peut donc pas contredire le constat");
    att(lot.md.includes("recopier `gabarits/RESTITUTION.md`"),
      "le lot ne cite pas le chemin source DÉCLARÉ par le contrat — s'il le déduit de la cible, il invente (TF-0645)");
  });

  check("le sidecar porte une ligne JSON par élément, avec son moyen de vérification", () => {
    const lot = lotHeritage(LIGNE([ABSENT("forge/RESTITUTION.md"), ABSENT("robots.txt", "presence")]), "20260825", "a");
    const lignes = lot.sidecar.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
    att(lignes.length === 2, `${lignes.length} ligne(s) au lieu de 2`);
    att(lignes.every((x) => x.verification && x.origine_tf && x.gravite && x.effort),
      "une ligne du sidecar manque un champ du contrat");
    att(lignes.every((x) => !("id" in x)), "le sidecar porte un id : les ids sont frappés par le destinataire");
  });

  check("la gravité distingue ce qui agit à chaque travail rendu de ce qui gêne au cas par cas", () => {
    const lot = lotHeritage(LIGNE([ABSENT("forge/RESTITUTION.md"), ABSENT("robots.txt", "presence")]), "20260825", "a");
    const par = Object.fromEntries(lot.sidecar.split("\n").filter((l) => l.trim())
      .map((l) => JSON.parse(l)).map((x) => [x.titre.includes("RESTITUTION") ? "restitution" : "web", x.gravite]));
    att(par.restitution === "majeur", `restitution en « ${par.restitution} »`);
    att(par.web === "mineur", `robots.txt en « ${par.web} »`);
  });

  check("l'indice du jour est la première lettre LIBRE de la boîte — deux lots du même jour cohabitent", () => {
    const boite = join(T, "boite");
    mkdirSync(boite, { recursive: true });
    att(indiceLibre(boite, "20260825") === "a", "boîte vide : l'indice devrait être `a`");
    writeFileSync(join(boite, "pilot - TRAVAUX - 20260825a.md"), "x", "utf8");
    att(indiceLibre(boite, "20260825") === "b", "un `a` présent : l'indice devrait être `b`");
    writeFileSync(join(boite, "pilot - TRAVAUX - 20260825b.md"), "x", "utf8");
    att(indiceLibre(boite, "20260825") === "c", "un `b` présent : l'indice devrait être `c`");
    att(indiceLibre(boite, "20260826") === "a", "un autre JOUR repart à `a`");
  });

  check("la date du lot est déterministe : elle vient de l'argument, jamais de l'horloge", () => {
    att(dateLot(new Date(2026, 7, 5)) === "20260805", `rendu ${dateLot(new Date(2026, 7, 5))}`);
    att(dateLot(new Date(2026, 11, 31)) === "20261231", "un mois à deux chiffres est mal rendu");
  });

  // ── LA PROMESSE QUI REND LE CANAL ACCEPTABLE : rien n'est écrit hors de la boîte ──
  check("--essai n'écrit RIEN, nulle part — vérifié par empreinte de l'arborescence", () => {
    const faux = join(T, "parc");
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, "forge", "marqueur.txt"), "intact", "utf8");
    const empreinte = (d) => readdirSync(d, { withFileTypes: true, recursive: true })
      .map((e) => `${e.parentPath || e.path}|${e.name}|${e.isFile() ? statSync(join(e.parentPath || e.path, e.name)).size : "d"}`)
      .sort().join("\n");
    const avant = empreinte(faux);
    const r = spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous", "--essai"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    att(r.status === 0, `exit ${r.status} : ${String(r.stderr).slice(0, 200)}`);
    att(empreinte(faux) === avant, "l'essai a modifié l'arborescence du parc");
    att(!existsSync(join(produit, "input")), "l'essai a créé une boîte d'entrée");
  });

  check("un dépôt réel n'écrit QUE dans `input\\00-travaux\\` — le reste est intact", () => {
    const faux = join(T, "parc2");
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, "forge", "marqueur.txt"), "intact", "utf8");
    writeFileSync(join(produit, "CLAUDE.md"), "consignes du produit", "utf8");
    // Le filtre ECARTE toute la boite d'entree, dossiers intermediaires COMPRIS : `input` et
    // `input\\00-travaux` sont crees par le depot, et les compter ferait echouer la recette sur
    // la seule chose qu'elle autorise. Premier jet : il ne regardait que le chemin PARENT, donc
    // l'entree du dossier `00-travaux` lui-meme passait — la recette accusait l'outil A TORT.
    const horsBoite = (d) => readdirSync(d, { withFileTypes: true, recursive: true })
      .map((e) => `${e.parentPath || e.path}|${e.name}`)
      .filter((l) => !l.includes("00-travaux") && !l.endsWith("|input"))
      .sort().join("\n");
    const avant = horsBoite(faux);
    const r = spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    att(r.status === 0, `exit ${r.status} : ${String(r.stderr).slice(0, 200)}`);
    const boite = join(produit, "input", "00-travaux");
    att(existsSync(boite), "aucun lot déposé");
    att(readdirSync(boite).filter((f) => f.endsWith(".md")).length === 1, "un seul lot `.md` attendu");
    att(readdirSync(boite).filter((f) => f.endsWith(".tf.jsonl")).length === 1, "le sidecar manque");
    // Le marqueur et les consignes du produit n'ont pas bougé : seule la boîte a changé.
    att(horsBoite(faux) === avant, "l'émetteur a touché autre chose que la boîte d'entrée");
  });

  check("IDEMPOTENT par contenu — un second passage ne redépose rien", () => {
    const faux = join(T, "parc3");
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const lancer = () => spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    lancer();
    const boite = join(produit, "input", "00-travaux");
    const apres1 = readdirSync(boite).length;
    const r2 = lancer();
    att(readdirSync(boite).length === apres1, `${readdirSync(boite).length} fichiers après le second passage au lieu de ${apres1}`);
    att(/DÉJÀ DÉPOSÉ/.test(r2.stdout), "le second passage ne DIT pas qu'il n'a rien redéposé");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nemettre-travaux (TF-0627) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
