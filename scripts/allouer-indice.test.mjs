#!/usr/bin/env node
/**
 * allouer-indice.test.mjs — recette de l'allocateur d'indice (TF-0691).
 *
 * Les trois promesses du contrat, chacune dans son sens, plus la neutralisation qui rend la
 * deuxième possible : sans elle, la référence auto-citée dans le document (qui contient
 * l'indice) ferait différer deux contenus identiques d'une lettre, et l'outil pondrait un
 * fichier par lancement — le défaut qu'il existe pour fermer.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { allouerIndice, canonique } from "./allouer-indice.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "allouer-indice-"));
const PREFIXE = "Client - CAL - Fiche Securite - Dev - ";
const JOUR = "20260831";
const nom = (i) => `${PREFIXE}${JOUR}${i}.html`;
const LETTRES_26 = "abcdefghijklmnopqrstuvwxyz";

try {
  check("rien n'existe pour ce jour → `a`", () => {
    const d = join(T, "vide");
    mkdirSync(d, { recursive: true });
    att(allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR, contenu: "x" }) === "a", "l'indice initial n'est pas `a`");
  });

  check("un dossier ABSENT ne lève pas : il n'y a rien, donc `a`", () => {
    att(allouerIndice({ dossier: join(T, "inexistant"), prefixe: PREFIXE, jour: JOUR, contenu: "x" }) === "a",
      "un dossier absent a été traité autrement qu'un dossier vide");
  });

  check("contenu IDENTIQUE au fichier présent → l'indice EXISTANT, jamais un neuf", () => {
    const d = join(T, "identique");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, nom("a")), "le meme contenu", "utf8");
    att(allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR, contenu: "le meme contenu" }) === "a",
      "une re-génération à contenu inchangé a reçu un indice neuf — un fichier par lancement");
  });

  check("contenu DIFFÉRENT → l'indice SUIVANT le dernier pris", () => {
    const d = join(T, "different");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, nom("a")), "premier contenu", "utf8");
    writeFileSync(join(d, nom("b")), "deuxieme contenu", "utf8");
    att(allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR, contenu: "troisieme contenu" }) === "c",
      "l'indice suivant n'est pas `c`");
  });

  check("la référence AUTO-CITÉE (qui contient l'indice) ne fait pas différer deux contenus égaux", () => {
    // La scène réelle : le document imprime sa propre référence `…-20260831a`. Régénéré, le
    // texte candidat porte `…-20260831b` (ou l'indice que le générateur s'apprête à écrire) —
    // sans forme canonique, l'égalité serait impossible par construction.
    const d = join(T, "autocite");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, nom("a")), `<p>REF-SEC-${JOUR}a</p><p>corps identique</p>`, "utf8");
    const indice = allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR,
      contenu: `<p>REF-SEC-${JOUR}b</p><p>corps identique</p>` });
    att(indice === "a", `indice ${indice} au lieu de a — la neutralisation de l'indice ne joue pas`);
  });

  check("canonique() ne touche QUE `<jour><lettre>` — un autre jour, un chiffre, restent intacts", () => {
    att(canonique(`x ${JOUR}a y`, JOUR) === `x ${JOUR} y`, "l'indice du jour n'est pas neutralisé");
    att(canonique("x 20260830a y", JOUR) === "x 20260830a y", "un AUTRE jour a été neutralisé");
    att(canonique(`x ${JOUR}9 y`, JOUR) === `x ${JOUR}9 y`, "un chiffre a été pris pour un indice");
  });

  check("un AUTRE jour et une AUTRE extension ne comptent pas parmi les indices pris", () => {
    const d = join(T, "voisins");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `${PREFIXE}20260830a.html`), "hier", "utf8");
    writeFileSync(join(d, `${PREFIXE}${JOUR}a.pdf`), "autre format", "utf8");
    att(allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR, contenu: "x" }) === "a",
      "un fichier d'un autre jour ou d'un autre format a réservé l'indice");
  });

  check("un préfixe porteur de caractères spéciaux de regex ne casse pas le motif", () => {
    const d = join(T, "special");
    mkdirSync(d, { recursive: true });
    const prefixe = "Fiche (v2) [prod] - ";
    writeFileSync(join(d, `${prefixe}${JOUR}a.html`), "contenu", "utf8");
    att(allouerIndice({ dossier: d, prefixe, jour: JOUR, contenu: "autre" }) === "b",
      "les parenthèses du préfixe ont été lues comme de la syntaxe regex");
  });

  // ---- TF-1450 (28/09/2026, RP-10) : R-4 juge l'indice par JOUR ET PAR DOSSIER, tous radicaux
  // confondus (TF-0750) ; la portée par défaut ne voit que SON préfixe et a rendu un indice déjà
  // pris par un AUTRE radical du même jour — cas réel : l'étude du jour portait déjà « a », la
  // restitution en a reçu un autre, renommée à la main après coup. Double sens : la portée par
  // défaut REPRODUIT la collision (rouge) ; « dossier » l'évite (vert). --------------------------
  check("TF-1450 rouge (portée par défaut) : un AUTRE radical du même jour, même dossier, n'est pas vu — la collision se reproduit", () => {
    const d = join(T, "collision-defaut");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Etude - ${JOUR}a.md`), "etude du jour", "utf8");
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "rapport du jour" });
    att(indice === "a", `indice ${indice} au lieu de « a » — si ce test casse, la portée par défaut a cessé de reproduire la collision de TF-1450`);
  });
  check("TF-1450 vert (portée « dossier ») : le même cas voit l'indice pris par l'AUTRE radical et rend « b », sans collision", () => {
    const d = join(T, "collision-dossier");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Etude - ${JOUR}a.md`), "etude du jour", "utf8");
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "rapport du jour", porte: "dossier" });
    att(indice === "b", `indice ${indice} au lieu de « b » — la portée dossier ne voit pas l'indice pris par « Produit - Etude - »`);
  });
  check("TF-1450 borne : la portée « dossier » relit le fichier sous son NOM COMPLET, pas le seul fragment capturé par le motif", () => {
    const d = join(T, "collision-nom-complet");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Etude - ${JOUR}a.md`), "contenu identique", "utf8");
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Etude - ", jour: JOUR, contenu: "contenu identique", porte: "dossier" });
    att(indice === "a", `indice ${indice} au lieu de « a » — la relecture du contenu sous la portée dossier a échoué (nom de fichier mal reconstruit)`);
  });

  // ---- TF-1850 (18/10/2026, RP-13) : au-delà de « z », l'allocateur rendait « z » — un nom DÉJÀ PRIS —
  // alors que R-4 n'admet qu'une lettre et que des lettres du jour restaient libres dans le dossier
  // (17 en 06-rapports le 15/10). Remède : la première lettre libre du jour DANS LE DOSSIER ; aucune
  // libre → l'outil échoue avec un message clair. Double sens : « z » pris avec des trous ; dossier plein.
  const peupler = (d, lettres, radical = "Produit - Rapport") => {
    mkdirSync(d, { recursive: true });
    for (const l of lettres) writeFileSync(join(d, `${radical} - ${JOUR}${l}.md`), `contenu ${l}`, "utf8");
  };
  const lettresAI = [..."abcdefghi"];

  check("TF-1850 : « z » pris, des trous en deçà → la PREMIÈRE lettre libre du dossier, jamais « z »", () => {
    const d = join(T, "z-avec-trous");
    peupler(d, [...lettresAI, "z"]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" });
    att(indice === "j", `indice « ${indice} » au lieu de « j » — au-delà de z l'allocateur doit rendre la première lettre libre du dossier (et non « z », déjà pris)`);
  });

  check("TF-1850 : même cas sous la portée « dossier » → « j » aussi", () => {
    const d = join(T, "z-avec-trous-dossier");
    peupler(d, [...lettresAI, "z"]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md", porte: "dossier" });
    att(indice === "j", `indice « ${indice} » au lieu de « j »`);
  });

  check("TF-1850 : portée par défaut — la lettre libre POUR CE PRÉFIXE mais prise par un AUTRE radical est écartée", () => {
    const d = join(T, "z-autre-radical");
    peupler(d, [...lettresAI, "z"], "Produit - Rapport");
    peupler(d, ["j", "k"], "Produit - Etude"); // j et k : libres pour « Rapport », prises (R-4) par « Etude »
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" });
    att(indice === "l", `indice « ${indice} » au lieu de « l » — R-4 juge l'indice par dossier, tous radicaux confondus`);
  });

  check("TF-1850 : le nom rendu est ACCEPTÉ par R-4 (une lettre, unique dans le dossier du jour)", () => {
    const d = join(T, "z-r4");
    peupler(d, [...lettresAI, "z"]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" });
    const nomRendu = `Produit - Rapport - ${JOUR}${indice}.md`;
    att(/ - \d{8}[a-z]\.[\w.]+$/.test(nomRendu), `« ${nomRendu} » n'est pas une forme admise par R-4`);
    att(!existsSync(join(d, nomRendu)), `« ${nomRendu} » existe déjà dans le dossier`);
  });

  check("TF-1850 : 26 lettres prises dans UN AUTRE dossier ne gênent pas le dossier cible", () => {
    const plein = join(T, "autre-dossier-plein");
    peupler(plein, [...LETTRES_26]);
    const d = join(T, "cible-libre");
    peupler(d, ["z"]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" });
    att(indice === "a", `indice « ${indice} » au lieu de « a » — la portée est le dossier cible, pas le parc`);
  });

  check("TF-1850 : dossier PLEIN (a à z pris) → l'outil échoue avec un message clair, il ne rend pas un nom refusé", () => {
    const d = join(T, "plein");
    peupler(d, [...LETTRES_26]);
    let message = null;
    try { allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" }); }
    catch (e) { message = e.message; }
    att(message !== null, "dossier plein : aucune erreur levée — un nom déjà pris ou refusé a été rendu");
    att(/aucune lettre libre/.test(message) && /26/.test(message) && message.includes(JOUR), `message peu clair : « ${message} »`);
  });

  check("TF-1850 : dossier plein mais contenu IDENTIQUE à un fichier présent → son indice (pas d'erreur : rien à écrire)", () => {
    const d = join(T, "plein-identique");
    peupler(d, [...LETTRES_26]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "contenu q", extension: ".md" });
    att(indice === "q", `indice « ${indice} » au lieu de « q »`);
  });

  // ---- TF-1863 (19/10/2026, R-58 option a) : six documents prescrivent `node scripts\allouer-indice.mjs`
  // en ligne de commande ; le module n'avait aucun point d'entrée, la commande finissait muette (exit 0,
  // aucune sortie). Chaque cas LANCE le script comme le prescrivent les documents (processus node réel).
  const SCRIPT = fileURLToPath(new URL("./allouer-indice.mjs", import.meta.url));
  const lancer = (args, cwd = T) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8" });

  check("TF-1863 vert : sans argument, dans un dossier vide → imprime `a` (exit 0) — la commande prescrite rend un indice", () => {
    const d = join(T, "cli-vide");
    mkdirSync(d, { recursive: true });
    const r = lancer([], d);
    att(r.status === 0 && r.stdout.trim() === "a", `exit ${r.status}, sortie « ${r.stdout.trim()} » — attendu exit 0 et « a »`);
  });

  check("TF-1863 vert : sans argument, le dossier courant porte déjà le jour → l'indice SUIVANT, tous radicaux confondus", () => {
    const d = join(T, "cli-courant");
    mkdirSync(d, { recursive: true });
    const maintenant = new Date();
    const aujourdhui = `${maintenant.getFullYear()}${String(maintenant.getMonth() + 1).padStart(2, "0")}${String(maintenant.getDate()).padStart(2, "0")}`;
    writeFileSync(join(d, `Produit - Etude - ${aujourdhui}a.md`), "x", "utf8");
    const r = lancer([], d);
    att(r.status === 0 && r.stdout.trim() === "b", `exit ${r.status}, sortie « ${r.stdout.trim()} » — attendu « b »`);
  });

  check("TF-1863 vert : forme positionnelle `dossier préfixe jour` (la signature du module) → l'indice suivant", () => {
    const d = join(T, "cli-positions");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Rapport - ${JOUR}a.md`), "x", "utf8");
    writeFileSync(join(d, `Produit - Rapport - ${JOUR}b.md`), "y", "utf8");
    const r = lancer([d, "Produit - Rapport - ", JOUR]);
    att(r.status === 0 && r.stdout.trim() === "c", `exit ${r.status}, sortie « ${r.stdout.trim()} » — attendu « c »`);
  });

  check("TF-1863 vert : options nommées, jour au format ISO, portée « prefixe » demandée → seul ce préfixe compte", () => {
    const d = join(T, "cli-options");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Etude - ${JOUR}a.md`), "x", "utf8");
    const r = lancer(["--dossier", d, "--prefixe", "Produit - Rapport - ", "--jour", "2026-08-31", "--extension", ".md", "--porte", "prefixe"]);
    att(r.status === 0 && r.stdout.trim() === "a", `exit ${r.status}, sortie « ${r.stdout.trim()} » — attendu « a »`);
  });

  check("TF-1863 vert : `--contenu-fichier` identique au fichier présent → son indice, pas un neuf", () => {
    const d = join(T, "cli-contenu");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Rapport - ${JOUR}a.md`), "meme texte", "utf8");
    writeFileSync(join(d, `Produit - Rapport - ${JOUR}b.md`), "autre texte", "utf8");
    const candidat = join(T, "cli-contenu-candidat.txt");
    writeFileSync(candidat, "meme texte", "utf8");
    const r = lancer(["--dossier", d, "--prefixe", "Produit - Rapport - ", "--jour", JOUR, "--extension", ".md", "--contenu-fichier", candidat]);
    att(r.status === 0 && r.stdout.trim() === "a", `exit ${r.status}, sortie « ${r.stdout.trim()} » — attendu « a »`);
  });

  check("TF-1863 rouge : jour mal formé → exit 1 et message sur stderr, rien sur stdout", () => {
    const r = lancer([T, "", "31/08/2026"]);
    att(r.status === 1 && r.stdout === "" && /AAAAMMJJ/.test(r.stderr), `exit ${r.status}, stdout « ${r.stdout} », stderr « ${r.stderr.trim()} »`);
  });

  check("TF-1863 rouge : dossier plein (a à z) → exit 1 « aucune lettre libre », jamais un nom refusé", () => {
    const d = join(T, "cli-plein");
    peupler(d, [...LETTRES_26]);
    const r = lancer([d, "Produit - Rapport - ", JOUR]);
    att(r.status === 1 && r.stdout === "" && /aucune lettre libre/.test(r.stderr), `exit ${r.status}, stdout « ${r.stdout} », stderr « ${r.stderr.trim()} »`);
  });

  check("TF-1863 rouge : option inconnue → exit 2 (usage), pas d'indice deviné", () => {
    const r = lancer(["--hasard", "x"]);
    att(r.status === 2 && r.stdout === "" && /option inconnue/.test(r.stderr), `exit ${r.status}, stderr « ${r.stderr.trim()} »`);
  });

  check("un jour hors format AAAAMMJJ est REFUSÉ — il fabriquerait un motif faux en silence", () => {
    let leve = false;
    try { allouerIndice({ dossier: T, prefixe: PREFIXE, jour: "31/08/2026", contenu: "x" }); }
    catch { leve = true; }
    att(leve, "un jour mal formé a été accepté");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nTF-0691 (allocation d'indice) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
