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
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { allouerIndice, allouerIndiceVuDuRegistre, canonique, prefixeDeNom } from "./allouer-indice.mjs";

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

  check("portée « prefixe » : un AUTRE jour et une AUTRE extension ne comptent pas parmi les indices pris", () => {
    const d = join(T, "voisins");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `${PREFIXE}20260830a.html`), "hier", "utf8");
    writeFileSync(join(d, `${PREFIXE}${JOUR}a.pdf`), "autre format", "utf8");
    att(allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR, contenu: "x", porte: "prefixe" }) === "a",
      "un fichier d'un autre jour ou d'un autre format a réservé l'indice");
    // TF-2631 : la portée par défaut est « dossier », comme R-4 — un autre format du même jour y COMPTE.
    att(allouerIndice({ dossier: d, prefixe: PREFIXE, jour: JOUR, contenu: "x" }) === "b",
      "la portée par défaut (dossier) ne voit pas l'indice du même jour pris dans un autre format");
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
  check("TF-1450 rouge (portée « prefixe » demandée) : un AUTRE radical du même jour, même dossier, n'est pas vu — la collision se reproduit", () => {
    const d = join(T, "collision-defaut");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Etude - ${JOUR}a.md`), "etude du jour", "utf8");
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "rapport du jour", porte: "prefixe" });
    att(indice === "a", `indice ${indice} au lieu de « a » — si ce test casse, la portée « prefixe » a cessé de reproduire la collision de TF-1450`);
  });
  // TF-2631 (16/11/2026, RP-216) : le défaut du MODULE était « prefixe » quand celui de la ligne de commande
  // était « dossier » ; seul l'appel en module sans option rendait un indice que R-4 refuse. Le cas du
  // lot de retours du 12/11 : « X - 20261112a.mp4 » posé, un autre radical demande son indice.
  check("TF-2631 vert (portée par défaut) : « X - 20261112a.mp4 » posé, un AUTRE radical sans option rend « b » (celui de la ligne de commande)", () => {
    const d = join(T, "defaut-module-dossier");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "X - 20261112a.mp4"), "clip", "utf8");
    const indice = allouerIndice({ dossier: d, prefixe: "Y - Brief - ", jour: "20261112", contenu: "brief", extension: ".md" });
    att(indice === "b", `indice ${indice} au lieu de « b » — le module sans option ne voit pas l'indice pris par l'AUTRE radical (R-4)`);
  });
  check("TF-2631 accord : le module sans option et la ligne de commande rendent la même lettre sur le même dossier", () => {
    const d = join(T, "defaut-module-cli");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "X - 20261112a.mp4"), "clip", "utf8");
    const cli = spawnSync(process.execPath, [fileURLToPath(new URL("./allouer-indice.mjs", import.meta.url)), "--dossier", d, "--prefixe", "Y - Brief - ", "--jour", "20261112", "--extension", ".md"], { encoding: "utf8" });
    const module_ = allouerIndice({ dossier: d, prefixe: "Y - Brief - ", jour: "20261112", contenu: "brief", extension: ".md" });
    att(cli.stdout.trim() === module_, `module « ${module_} », ligne de commande « ${cli.stdout.trim()} »`);
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

  // ---- TF-2681 (16/11/2026) : le 28e lot d'un jour n'avait aucun nom que l'allocateur et le juge de lot
  // acceptent — l'allocateur refusait (26 lettres prises) et proposait le lendemain, que LOT-DATE refuse.
  // Après « z », l'allocateur propose un double suffixe « za », « zb »… « zz » (26 de plus) ; il échoue
  // seulement quand les 52 sont prises. Le juge de lot l'accepte comme une lettre simple (son banc).
  const DOUBLES = [...LETTRES_26].map((l) => `z${l}`);
  check("TF-2681 : 26 lettres prises → l'allocateur propose « za » (au lieu d'échouer), avec le défaut du module", () => {
    const d = join(T, "plein-doubles");
    peupler(d, [...LETTRES_26]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" });
    att(indice === "za", `indice « ${indice} » au lieu de « za »`);
  });
  check("TF-2681 : « za » pris → « zb » ; « za » à « zy » pris → « zz » (l'ordre des doubles suit celui des lettres)", () => {
    const d = join(T, "plein-doubles-suite");
    peupler(d, [...LETTRES_26, "za"]);
    att(allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" }) === "zb", "après za, « zb » attendu");
    const d2 = join(T, "plein-doubles-fin");
    peupler(d2, [...LETTRES_26, ...DOUBLES.slice(0, 25)]);
    att(allouerIndice({ dossier: d2, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" }) === "zz", "après zy, « zz » attendu");
  });
  check("TF-2681 : un double pris par un AUTRE radical (portée dossier) est sauté, comme une lettre simple", () => {
    const d = join(T, "plein-doubles-radical");
    peupler(d, [...LETTRES_26]);
    peupler(d, ["za"], "Produit - Etude");
    att(allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" }) === "zb", "le « za » de l'autre radical n'est pas vu");
  });
  check("TF-2681 : contenu identique à un fichier à double suffixe → son indice « zb » (identité de contenu)", () => {
    const d = join(T, "plein-doubles-identique");
    peupler(d, [...LETTRES_26]);
    writeFileSync(join(d, `Produit - Rapport - ${JOUR}zb.md`), `REF-${JOUR}zb corps`, "utf8");
    att(allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: `REF-${JOUR}zc corps`, extension: ".md" }) === "zb", "la forme canonique ne neutralise pas un double suffixe");
  });
  check("TF-2681 : canonique() neutralise un double suffixe sans laisser sa seconde lettre", () => {
    att(canonique(`x ${JOUR}za y`, JOUR) === `x ${JOUR} y`, `« ${canonique(`x ${JOUR}za y`, JOUR)} »`);
    att(canonique(`x ${JOUR}z y`, JOUR) === `x ${JOUR} y`, "la lettre simple z n'est plus neutralisée");
  });
  check("TF-2681 : le nom proposé est unique dans le dossier du jour et ne reprend pas un fichier existant", () => {
    const d = join(T, "plein-doubles-unique");
    peupler(d, [...LETTRES_26]);
    const indice = allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" });
    att(!existsSync(join(d, `Produit - Rapport - ${JOUR}${indice}.md`)), "le nom proposé existe déjà");
  });

  check("TF-1850 / TF-2681 : dossier PLEIN (a-z et za-zz pris) → l'outil échoue avec un message clair, il ne rend pas un nom pris", () => {
    const d = join(T, "plein");
    peupler(d, [...LETTRES_26, ...DOUBLES]);
    let message = null;
    try { allouerIndice({ dossier: d, prefixe: "Produit - Rapport - ", jour: JOUR, contenu: "neuf", extension: ".md" }); }
    catch (e) { message = e.message; }
    att(message !== null, "dossier plein : aucune erreur levée — un nom déjà pris ou refusé a été rendu");
    att(/aucune lettre libre/.test(message) && /26/.test(message) && /za-zz/.test(message) && message.includes(JOUR), `message peu clair : « ${message} »`);
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

  check("TF-1863 rouge : dossier plein (a-z et za-zz) → exit 1 « aucune lettre libre », jamais un nom refusé", () => {
    const d = join(T, "cli-plein");
    peupler(d, [...LETTRES_26, ...DOUBLES]);
    const r = lancer([d, "Produit - Rapport - ", JOUR]);
    att(r.status === 1 && r.stdout === "" && /aucune lettre libre/.test(r.stderr), `exit ${r.status}, stdout « ${r.stdout} », stderr « ${r.stderr.trim()} »`);
  });
  check("TF-2681 vert : ligne de commande, 26 lettres prises → imprime `za` (exit 0)", () => {
    const d = join(T, "cli-plein-26");
    peupler(d, [...LETTRES_26]);
    const r = lancer([d, "Produit - Rapport - ", JOUR]);
    att(r.status === 0 && r.stdout === "za\n", `exit ${r.status}, stdout « ${r.stdout} », stderr « ${r.stderr.trim()} »`);
  });

  // ---- TF-2634 (RP-217, 12/11/2026) : deux sessions d'un même produit ont écrit un lot sous le même nom, la seconde a écrasé la première au sas.
  // L'indice d'un lot se lit dans `forge/retours/` ET dans le sas, juste avant l'écriture : `--aussi <dossier>` (répétable) ajoute les noms d'un autre
  // dossier à ceux qui sont pris. Le lot de l'autre session n'est qu'au sas (ou n'y est pas encore copié) : sans `--aussi`, la collision se reproduit.
  const PREFIXE_LOT = "Produit-86 - RETOURS - ";
  const deuxDossiers = (nom) => {
    const retours = join(T, nom, "forge", "retours"), sas = join(T, nom, "sas");
    mkdirSync(retours, { recursive: true }); mkdirSync(sas, { recursive: true });
    writeFileSync(join(retours, `${PREFIXE_LOT}${JOUR}a.md`), "mon lot", "utf8");
    writeFileSync(join(sas, `${PREFIXE_LOT}${JOUR}b.md`), "le lot de l'autre session, remis au sas", "utf8");
    return { retours, sas };
  };
  check("TF-2634 rouge : sans `--aussi`, le lot d'une AUTRE session remis au sas n'est pas vu — « b » est proposé, déjà pris au sas", () => {
    const { retours } = deuxDossiers("lots-sans-aussi");
    const r = lancer(["--dossier", retours, "--prefixe", PREFIXE_LOT, "--jour", JOUR, "--extension", ".md", "--porte", "prefixe"]);
    att(r.status === 0 && r.stdout.trim() === "b", `exit ${r.status}, sortie « ${r.stdout.trim()} » — si ce test casse, la collision de RP-217 ne se reproduit plus sans l'option`);
  });
  check("TF-2634 vert : `--aussi <sas>` lit le sas au moment de l'appel — l'indice du lot saute « b » et rend « c »", () => {
    const { retours, sas } = deuxDossiers("lots-avec-aussi");
    const r = lancer(["--dossier", retours, "--prefixe", PREFIXE_LOT, "--jour", JOUR, "--extension", ".md", "--porte", "prefixe", "--aussi", sas]);
    att(r.status === 0 && r.stdout.trim() === "c", `exit ${r.status}, sortie « ${r.stdout.trim()} », stderr « ${r.stderr.trim()} »`);
    // Le lot de l'autre session arrive au sas ENTRE deux appels : le second appel le voit.
    writeFileSync(join(sas, `${PREFIXE_LOT}${JOUR}c.md`), "un troisième lot, remis entre-temps", "utf8");
    const r2 = lancer(["--dossier", retours, "--prefixe", PREFIXE_LOT, "--jour", JOUR, "--extension", ".md", "--porte", "prefixe", "--aussi", sas]);
    att(r2.status === 0 && r2.stdout.trim() === "d", `second appel : exit ${r2.status}, sortie « ${r2.stdout.trim()} » — le sas n'est pas relu`);
  });
  check("TF-2634 vert : plusieurs `--aussi` (le sas et la boîte) comptent tous, et le module les accepte par `aussi`", () => {
    const { retours, sas } = deuxDossiers("lots-plusieurs-aussi");
    const boite = join(T, "lots-plusieurs-aussi", "boite"); mkdirSync(boite, { recursive: true });
    writeFileSync(join(boite, `${PREFIXE_LOT}${JOUR}c.md`), "lot déjà ingéré", "utf8");
    const r = lancer(["--dossier", retours, "--prefixe", PREFIXE_LOT, "--jour", JOUR, "--extension", ".md", "--porte", "prefixe", "--aussi", sas, "--aussi", boite]);
    att(r.status === 0 && r.stdout.trim() === "d", `exit ${r.status}, sortie « ${r.stdout.trim()} »`);
    att(allouerIndiceVuDuRegistre({ dossier: retours, prefixe: PREFIXE_LOT, jour: JOUR, extension: ".md", porte: "prefixe", aussi: [sas, boite] }) === "d", "le module ne lit pas `aussi`");
  });
  check("TF-2634 rouge : `--aussi` vers un dossier introuvable → exit 2, jamais un indice calculé sans lui (aucune borne silencieuse)", () => {
    const { retours } = deuxDossiers("lots-aussi-absent");
    const r = lancer(["--dossier", retours, "--prefixe", PREFIXE_LOT, "--jour", JOUR, "--extension", ".md", "--aussi", join(T, "n-existe-pas")]);
    att(r.status === 2 && r.stdout === "" && /introuvable/.test(r.stderr), `exit ${r.status}, stdout « ${r.stdout} », stderr « ${r.stderr.trim()} »`);
    const sans = lancer(["--dossier", retours, "--prefixe", PREFIXE_LOT, "--jour", JOUR, "--extension", ".md", "--aussi"]);
    att(sans.status === 2 && sans.stdout === "", `--aussi sans valeur : exit ${sans.status}`);
  });

  check("TF-1863 rouge : option inconnue → exit 2 (usage), pas d'indice deviné", () => {
    const r = lancer(["--hasard", "x"]);
    att(r.status === 2 && r.stdout === "" && /option inconnue/.test(r.stderr), `exit ${r.status}, stderr « ${r.stderr.trim()} »`);
  });

  // ---- D-218 (b), item I4 (15/11/2026) : l'indice réservé au registre des sessions du produit. Le fait : le 14/11/2026, l'indice
  // 20261114g a été porté par deux livrables de radical distinct, deux sessions ayant demandé leur lettre sans écrire entre les deux.
  const P4 = join(T, "produit-i4"), D4 = join(P4, "output", "03-etudes");
  mkdirSync(join(P4, "forge"), { recursive: true }); mkdirSync(D4, { recursive: true });
  const REG4 = join(P4, "forge", "sessions.jsonl");
  const envDe = (id) => { const e = { ...process.env }; delete e.FORGE_SESSION_ID; delete e.CLAUDE_CODE_SESSION_ID; return id ? { ...e, FORGE_SESSION_ID: id } : e; };
  const indice = (id, prefixe, ...plus) => spawnSync(process.execPath, [SCRIPT, "--dossier", D4, "--prefixe", prefixe, "--jour", JOUR, "--extension", ".md", ...plus], { encoding: "utf8", env: envDe(id) });
  const reservations = () => (existsSync(REG4) ? readFileSync(REG4, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((l) => l.origine === "allouer-indice --reserver") : []);

  check("D-218 (b) rouge — deux sessions, deux appels sans écriture entre eux et sans réservation : la même lettre (le 20261114g du produit)", () => {
    const a = indice("session-A", "Produit - Etude - X - "), b = indice("session-B", "Produit - Brief - Y - ");
    att(a.status === 0 && b.status === 0 && a.stdout.trim() === "a" && b.stdout.trim() === "a", `A « ${a.stdout.trim()} », B « ${b.stdout.trim()} » ${a.stderr}${b.stderr}`);
  });
  check("D-218 (b) vert — avec --reserver, la lettre rendue à A est réservée sous verrou ; B la saute, et un appel ordinaire de C saute les deux", () => {
    const a = indice("session-A", "Produit - Etude - X - ", "--reserver"), b = indice("session-B", "Produit - Brief - Y - ", "--reserver"), c = indice("session-C", "Produit - Note - Z - ");
    att(a.stdout.trim() === "a" && b.stdout.trim() === "b" && c.stdout.trim() === "c", `A « ${a.stdout.trim()} », B « ${b.stdout.trim()} », C « ${c.stdout.trim()} » ${a.stderr}${b.stderr}${c.stderr}`);
    const r = reservations();
    att(r.length === 2 && r[0].session === "session-A" && r[0].chemin === `output/03-etudes/Produit - Etude - X - ${JOUR}a.md` && r[1].chemin.endsWith(`${JOUR}b.md`) && !existsSync(REG4 + ".lock"), JSON.stringify(r));
    att(/réservé pour la session session-/.test(a.stderr), a.stderr);
  });
  check("D-218 (b) vert — la session qui redemande le même radical retrouve sa lettre, sans seconde réservation ; un autre radical saute sa propre réservation (R-4)", () => {
    const encore = indice("session-A", "Produit - Etude - X - ", "--reserver");
    att(encore.stdout.trim() === "a" && reservations().length === 2 && /déjà réservé/.test(encore.stderr), `« ${encore.stdout.trim()} », ${reservations().length} réservation(s)`);
    const autre = indice("session-A", "Produit - Synthese - W - ", "--reserver");
    att(autre.stdout.trim() === "c" && reservations().length === 3, `autre radical de A : « ${autre.stdout.trim()} » (attendu c : a et b réservés)`);
  });
  check("D-218 (b) vert — la réservation d'une session expirée (15 minutes sans preuve de vie) ne compte plus", () => {
    const D4b = join(P4, "output", "04-plans"); mkdirSync(D4b, { recursive: true });
    const vieille = { schema: "pilot/sessions@1", ev: "revendique", session: "session-morte", ts: new Date(Date.now() - 30 * 60_000).toISOString(), chemin: `output/04-plans/Produit - Plan - ${JOUR}a.md`, origine: "allouer-indice --reserver" };
    writeFileSync(REG4, readFileSync(REG4, "utf8") + JSON.stringify(vieille) + "\n", "utf8");
    const r = spawnSync(process.execPath, [SCRIPT, "--dossier", D4b, "--prefixe", "Produit - Plan - ", "--jour", JOUR, "--extension", ".md"], { encoding: "utf8", env: envDe("session-B") });
    att(r.status === 0 && r.stdout.trim() === "a", `« ${r.stdout.trim()} » ${r.stderr}`);
  });
  check("D-218 (b) rouge — --reserver hors d'un produit, ou sans session identifiée : exit 2, rien d'écrit", () => {
    const hors = join(T, "hors-produit-i4"); mkdirSync(hors, { recursive: true });
    const h = spawnSync(process.execPath, [SCRIPT, "--dossier", hors, "--jour", JOUR, "--reserver"], { encoding: "utf8", env: envDe("session-A") });
    att(h.status === 2 && h.stdout === "" && /n'est sous aucun produit/.test(h.stderr), `${h.status} ${h.stderr}`);
    const avant = reservations().length;
    const s = indice(null, "Produit - Etude - X - ", "--reserver");
    att(s.status === 2 && /session identifiée/.test(s.stderr) && reservations().length === avant, `${s.status} ${s.stderr}`);
  });

  // ---- TF-2724 (RP-46, 15/11/2026) : le nom réservé est le nom du livrable. Le fait : avec le préfixe « … D-219e » (le radical, sans le séparateur
  // final), la réservation inscrivait « … D-219e20261115b.md » alors que le livrable s'écrit « … D-219e - 20261115b.md » (R-4) ; la fixture de la
  // réservation comparait la lettre, pas le nom complet.
  check("TF-2724 — prefixeDeNom : le séparateur manquant est ajouté, un préfixe complet ou vide ne bouge pas, et l'opération est idempotente", () => {
    const cas = [["Produit - Brief - D-219e", "Produit - Brief - D-219e - "], ["Produit - Brief - D-219e -", "Produit - Brief - D-219e - "],
      ["Produit - Brief - D-219e ", "Produit - Brief - D-219e - "], ["Produit - Brief - ", "Produit - Brief - "], ["", ""], [undefined, ""]];
    for (const [entree, attendu] of cas) {
      att(prefixeDeNom(entree) === attendu, `« ${entree} » → « ${prefixeDeNom(entree)} », attendu « ${attendu} »`);
      att(prefixeDeNom(prefixeDeNom(entree)) === attendu, `« ${entree} » : pas idempotent`);
    }
  });
  check("TF-2724 rouge/vert — --reserver avec un préfixe sans séparateur inscrit le nom du livrable (« <radical> - <jour><lettre>.md »), pas un nom où le jour colle au radical", () => {
    const D4c = join(P4, "output", "05-briefs"); mkdirSync(D4c, { recursive: true });
    const radical = "Produit - Brief - Mandat D-219e";
    const r = spawnSync(process.execPath, [SCRIPT, "--dossier", D4c, "--prefixe", radical, "--jour", JOUR, "--extension", ".md", "--reserver"], { encoding: "utf8", env: envDe("session-D") });
    const lettre = r.stdout.trim();
    const livrable = `${radical} - ${JOUR}${lettre}.md`;
    const reserve = reservations().filter((l) => l.session === "session-D");
    att(r.status === 0 && lettre === "a", `exit ${r.status}, lettre « ${lettre} » ${r.stderr}`);
    att(reserve.length === 1 && reserve[0].chemin === `output/05-briefs/${livrable}`, `réservé « ${reserve[0]?.chemin} », livrable « output/05-briefs/${livrable} »`);
    att(new RegExp(` - \\d{8}[a-z]\\.md$`).test(reserve[0].chemin), "le nom réservé n'a pas la forme que R-4 juge : « … - AAAAMMJJ<indice>.md »");
    // Le livrable écrit sous ce nom EST la réservation : un autre radical demandé ensuite saute la lettre, que le fichier soit écrit ou non.
    const demande = () => spawnSync(process.execPath, [SCRIPT, "--dossier", D4c, "--prefixe", "Produit - Autre - ", "--jour", JOUR, "--extension", ".md"], { encoding: "utf8", env: envDe("session-E") });
    att(demande().stdout.trim() === "b", `l'appel d'une autre session a rendu « ${demande().stdout.trim()} » : la réservation de « ${livrable} » n'est pas vue`);
    writeFileSync(join(D4c, livrable), "livrable écrit sous le nom réservé", "utf8");
    const apres = demande();
    att(apres.stdout.trim() === "b", `le fichier écrit et sa réservation comptent deux fois : « ${apres.stdout.trim()} » au lieu de « b »`);
  });
  check("TF-2724 vert — sans réservation non plus : le module compte les livrables « <radical> - <jour><lettre> » d'un préfixe donné sans séparateur final (portée prefixe)", () => {
    const d = join(T, "prefixe-sans-separateur"); mkdirSync(d, { recursive: true });
    writeFileSync(join(d, `Produit - Rapport - ${JOUR}a.md`), "un", "utf8");
    att(allouerIndice({ dossier: d, prefixe: "Produit - Rapport", jour: JOUR, contenu: "deux", extension: ".md", porte: "prefixe" }) === "b",
      "le livrable « Produit - Rapport - <jour>a.md » n'est pas vu par le préfixe « Produit - Rapport »");
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
