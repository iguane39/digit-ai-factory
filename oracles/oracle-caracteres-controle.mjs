#!/usr/bin/env node
/**
 * oracle-caracteres-controle.mjs — AUCUN FICHIER TEXTE VERSIONNÉ NE PORTE DE CARACTÈRE DE
 * CONTRÔLE (TF-0922).
 *
 * ============================================================================================
 * LE FAIT PAYÉ, ET IL L'A ÉTÉ DEUX FOIS LE MÊME JOUR
 * ============================================================================================
 *
 * Un fichier de doctrine versionné portait un octet 0x0B au milieu d'un chemin : la doctrine
 * voulait écrire `node scripts\verifier-jugement.mjs`, et l'antislash de chemin Windows suivi
 * d'un `v` a été INTERPRÉTÉ comme une tabulation verticale par le shell qui a écrit le fichier.
 * Le caractère est INVISIBLE à la lecture — la phrase se lit « node scriptserifier-jugement.mjs »
 * sans que rien ne signale l'octet — et il rend le fichier BINAIRE pour une recherche textuelle :
 * `grep verifier-jugement` ne trouve plus la seule ligne de doctrine qui prescrit ce contrôle.
 *
 * Six fichiers suivis du pilot en portaient un, dont quatre pièces de doctrine de premier rang.
 * Les graphies fautives se ressemblent toutes : `\v` (0x0B), `\f` (0x0C), `\0` et `\01` (0x01),
 * `\03` (0x03), `\202` (0x82) — c'est-à-dire les lettres et les chiffres qui suivent l'antislash
 * dans les chemins Windows du parc (`scripts\v…`, `oracles\f…`, `output\01-…`, `output\03-…`).
 * La même classe a mordu une session de campagne EN COURS le 08/09 : des séquences d'échappement
 * écrites par redirection de shell sont devenues de vrais caractères de contrôle dans un fichier
 * de code, et c'est la recette qui les a attrapées — après coup.
 *
 * C'est la raison d'être de ce balayage : le défaut ne se voit pas à la relecture, il ne casse
 * rien immédiatement, et il se paie plus tard, quand quelqu'un cherche un texte qui ne se trouve
 * plus. Un contrôle exécuté est le seul œil qui voie un octet invisible.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET CE QUI EST SEULEMENT DÉCLARÉ
 * ============================================================================================
 *
 * JUGÉ (FAIL) — tout fichier TEXTE suivi par git, hors des zones ci-dessous. Un constat nomme le
 * fichier, la ligne, la colonne, le code du caractère et le mot qui l'entoure, plus la graphie
 * qui l'a probablement produit.
 *
 * DÉCLARÉ, JAMAIS EN ÉCHEC — trois zones, chacune pour une raison qui lui est propre :
 *   · `input\` : les entrants humains arrivent TELS QUELS, et les réécrire serait falsifier une
 *     pièce reçue (même exemption que R-2, qui ne juge pas `input\` en nommage) ;
 *   · `old\` et `output\` : un livrable remis est SCELLÉ par son empreinte (R-5, TF-0523) —
 *     le corriger casserait le sceau et ferait mentir le jugement qui l'a accompagné. Le défaut
 *     se répare par une NOUVELLE version datée, jamais par une retouche ;
 *   · `todo\TODO-ARCHIVE.*` : l'archive du registre est immuable (R8), et sa projection HTML se
 *     dérive d'elle — corriger la projection sans la source recréerait le défaut au prochain
 *     passage du générateur.
 * Ces zones sont COMPTÉES et NOMMÉES : un silence se lirait comme une absence de défaut.
 *
 * NON JUGÉ — les fichiers BINAIRES (archive, image, bytecode, paquet de skill). Un octet de
 * contrôle y est du contenu, pas une faute. La détection est celle de git : un octet NUL dans le
 * premier bloc, plus une liste d'extensions connues.
 *
 * Usage :
 *   node oracle-caracteres-controle.mjs [<racine du dépôt>] [--self-test]
 * Exit : 0 = aucun caractère de contrôle dans le périmètre jugé · 1 = au moins un · 2 = illisible.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const VERSION = "1.0.0";

//: Les octets de contrôle FAUTIFS : tout C0 sauf TAB/LF/CR, plus DEL et les C1 (0x80-0x9F).
//: Les C1 entrent parce que `\202` — la graphie octale d'un `\2026…` de chemin — en produit un.
export const EST_CONTROLE = (o) => (o < 0x20 && o !== 9 && o !== 10 && o !== 13) || o === 0x7f || (o >= 0x80 && o <= 0x9f);

//: Les extensions dont un octet de contrôle est du CONTENU, jamais une faute.
const BINAIRE_PAR_EXTENSION = /\.(png|jpe?g|gif|webp|ico|bmp|pdf|zip|gz|tgz|7z|rar|woff2?|ttf|otf|eot|mp[34]|mov|avi|webm|wav|exe|dll|so|dylib|pyc|class|jar|db|sqlite3?|skill|docx|xlsx|pptx)$/i;

//: Les zones DÉCLARÉES : constatées, comptées, jamais mises en échec. Chacune dit pourquoi.
export const ZONES_DECLAREES = [
  { motif: /^input\//, motif_affiche: "input\\", raison: "les entrants humains arrivent TELS QUELS — les réécrire falsifierait une pièce reçue (même exemption que R-2)" },
  { motif: /(^|\/)old\//, motif_affiche: "old\\", raison: "une version remplacée est scellée par son empreinte (R-5, C1) — elle ne se retouche pas" },
  { motif: /^output\//, motif_affiche: "output\\", raison: "un livrable remis est SCELLÉ (R-5, TF-0523) : corriger casserait le sceau ; le remède est une NOUVELLE version datée" },
  { motif: /^todo\/TODO-ARCHIVE\./, motif_affiche: "todo\\TODO-ARCHIVE.*", raison: "l'archive du registre est immuable (R8) et sa projection s'en dérive — corriger la projection seule recréerait le défaut" },
];

//: La graphie qui a probablement produit l'octet : c'est elle qu'on corrige, pas l'octet.
const GRAPHIE_PROBABLE = (octet) => {
  const connues = { 0x07: "\\a", 0x08: "\\b", 0x0b: "\\v", 0x0c: "\\f", 0x1b: "\\e" };
  if (connues[octet]) return `un antislash de chemin Windows interprété (\`${connues[octet]}\`, ex. \`scripts${connues[octet]}erifier-…\`)`;
  if (octet <= 0x1f) return `une séquence OCTALE d'antislash interprétée (\`\\${octet.toString(8).padStart(2, "0")}\`, ex. \`output\\0${octet}-…\`)`;
  return `une séquence octale à trois chiffres interprétée (\`\\${octet.toString(8)}\`, ex. \`\\2026\` d'une date de livrable)`;
};

/** Un fichier est-il BINAIRE ? La règle de git : un octet NUL dans le premier bloc. */
function estBinaire(chemin, octets) {
  if (BINAIRE_PAR_EXTENSION.test(chemin)) return true;
  const bloc = octets.subarray(0, 8000);
  return bloc.includes(0);
}

/** La zone déclarée qui couvre ce chemin, ou `null` s'il est pleinement jugé. */
export function zoneDeclaree(cheminPosix) {
  return ZONES_DECLAREES.find((z) => z.motif.test(cheminPosix)) || null;
}

/**
 * Les constats sur UN contenu : un par caractère fautif, localisé ligne et colonne.
 *
 * LE TEXTE SE DÉCODE AVANT D'ÊTRE JUGÉ, et ce n'est pas un détail de mise en œuvre. Le premier
 * jet lisait les OCTETS, et les octets de continuation d'UTF-8 (0x80-0xBF) tombent exactement
 * dans la plage des contrôles C1 : mesure sur ce dépôt, 34 098 « constats » sur des textes
 * parfaitement sains — chaque « é » en produisait un. Un contrôle qui crie sur tout ne dit plus
 * rien (précédent R-33 bis), et il aurait été désarmé le jour même de sa livraison. Ce qui est
 * jugé est donc un POINT DE CODE, jamais un octet.
 */
export function constatsDuContenu(cheminPosix, octets) {
  const texte = octets.toString("utf8");
  const POINT = String.fromCharCode(183);            // « · », le témoin qui marque le caractère
  const constats = [];
  let ligne = 1, colonne = 1, indice = 0;
  for (const caractere of texte) {
    if (caractere === String.fromCharCode(10)) { ligne++; colonne = 1; indice += caractere.length; continue; }
    const point = caractere.codePointAt(0);
    if (EST_CONTROLE(point)) {
      const autour = texte.slice(Math.max(0, indice - 24), indice + 24)
        .split("").map((c) => (EST_CONTROLE(c.codePointAt(0)) ? POINT : c.codePointAt(0) < 32 ? " " : c)).join("");
      const code = "0x" + point.toString(16).padStart(2, "0");
      constats.push({
        ou: `${cheminPosix.replaceAll("/", String.fromCharCode(92))}:${ligne}:${colonne}`,
        octet: code,
        message: `caractère de contrôle ${code} — invisible à la lecture, et il rend le fichier BINAIRE pour une recherche textuelle. `
          + `Cause probable : ${GRAPHIE_PROBABLE(point)}. Autour : « ${autour.trim()} » (le ${POINT} marque le caractère). `
          + "Remède : rétablir l'antislash littéral, et écrire les contenus accentués par un outil d'édition plutôt que par une redirection de shell (TF-0922)",
      });
    }
    colonne++;
    indice += caractere.length;
  }
  return constats;
}

/** Le balayage complet d'un dépôt : ce qui est jugé, ce qui est déclaré, ce qui ne l'est pas. */
export function balayer(racine) {
  const git = spawnSync("git", ["-C", racine, "-c", "core.quotepath=false", "ls-files"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (git.status !== 0) return { horsDepot: true, findings: [], declares: [], binaires: 0 };
  const findings = [], declares = [];
  let binaires = 0;
  for (const rel of git.stdout.split(/\r?\n/).filter(Boolean)) {
    const abs = join(racine, rel);
    if (!existsSync(abs)) continue;
    let st;
    try { st = statSync(abs); } catch { continue; }
    if (!st.isFile() || st.size > 32 * 1024 * 1024) continue;
    let octets;
    try { octets = readFileSync(abs); } catch { continue; }
    if (estBinaire(rel, octets)) { binaires++; continue; }
    const constats = constatsDuContenu(rel, octets);
    if (!constats.length) continue;
    const zone = zoneDeclaree(rel);
    if (zone) declares.push({ zone: zone.motif_affiche, raison: zone.raison, constats });
    else findings.push(...constats.map((c) => ({ regle: "CC1", statut: "FAIL", ...c })));
  }
  return { horsDepot: false, findings, declares, binaires };
}

// ---- self-test à double sens (fixtures en mémoire : rien n'est écrit) ------------------------
// LA GARDE D IMPORT (TF-0922, lecon de todo/anonymiser-entrant.mjs) : sans elle, tout module
// qui IMPORTE celui-ci en execute le corps et sort du processus a sa place ; un banc rendrait
// alors des verts pour un module qui n a rien joue. Le corps ne tourne que si ce fichier EST
// le point d entree.
const EST_POINT_ENTREE = resolve(process.argv[1] || "") === fileURLToPath(import.meta.url);
if (EST_POINT_ENTREE && process.argv.includes("--self-test")) {
  const casse = [];
  const NL = String.fromCharCode(10);
  const propre = Buffer.from(`# Doctrine${NL}node scripts\\verifier-jugement.mjs <dossier>${NL}`, "utf8");
  const sale = Buffer.from(`# Doctrine${NL}node scripts${String.fromCharCode(11)}erifier-jugement.mjs <dossier>${NL}`, "utf8");
  if (constatsDuContenu("REGLES-PROJET.md", propre).length !== 0) casse.push("la fixture VERTE (antislash littéral) rend un constat");
  const rouge = constatsDuContenu("REGLES-PROJET.md", sale);
  if (rouge.length !== 1) casse.push(`la fixture ROUGE rend ${rouge.length} constat(s), 1 attendu`);
  else {
    if (rouge[0].ou !== "REGLES-PROJET.md:2:13") casse.push(`la localisation est « ${rouge[0].ou} », « REGLES-PROJET.md:2:13 » attendue`);
    if (!/0x0b/.test(rouge[0].message) || !/antislash/.test(rouge[0].message)) casse.push("le constat ne nomme ni l'octet ni la graphie qui l'a produit");
  }
  if (constatsDuContenu("x.md", Buffer.from(`a\tb${NL}c\r${NL}`, "utf8")).length !== 0) casse.push("TAB, LF et CR sont comptés comme des caractères de contrôle");
  if (!zoneDeclaree("output/04-plans/x.md") || !zoneDeclaree("input/00-retours/x.md") || !zoneDeclaree("todo/TODO-ARCHIVE.html")) casse.push("une zone déclarée n'est pas reconnue");
  if (zoneDeclaree("REGLES-PROJET.md") || zoneDeclaree("oracles/x.mjs")) casse.push("une pièce pleinement jugée a été rangée en zone déclarée");
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test caractères de contrôle : 6/6 PASS (verte muette ; rouge localisée à la colonne avec sa cause ; TAB/LF/CR épargnés ; zones déclarées reconnues et bornées)");
  process.exit(casse.length ? 1 : 0);
}

if (EST_POINT_ENTREE) {
const racine = resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : join(ICI, ".."));
const { horsDepot, findings, declares, binaires } = balayer(racine);
const totalDeclare = declares.reduce((n, d) => n + d.constats.length, 0);
console.log(JSON.stringify({
  oracle: "oracle-caracteres-controle",
  version: VERSION,
  verdict: horsDepot ? "SANS_OBJET" : findings.length ? "FAIL" : "PASS",
  racine,
  fichiers_binaires_non_juges: binaires,
  findings,
  zones_declarees: declares.length
    ? declares.map((d) => ({ zone: d.zone, raison: d.raison, occurrences: d.constats.length, ou: d.constats.map((c) => c.ou) }))
    : [],
  resume: horsDepot
    ? "hors dépôt git — rien à balayer"
    : `${findings.length} caractère(s) de contrôle dans le périmètre jugé · ${totalDeclare} en zone déclarée (constatés, jamais mis en échec) · ${binaires} fichier(s) binaire(s) non jugés`,
  non_juge: [
    "les fichiers BINAIRES (octet NUL dans le premier bloc, ou extension d'archive, d'image, de police, de bytecode, de paquet de skill) : un octet de contrôle y est du contenu",
    "les zones DÉCLARÉES (input\\, old\\, output\\, todo\\TODO-ARCHIVE.*) : constatées et nommées, jamais mises en échec — un livrable remis est scellé, un entrant reçu ne se réécrit pas, une archive est immuable",
    "la CAUSE exacte d'un octet : elle est probable, jamais certaine — le message propose la graphie la plus fréquente du parc, il ne rejoue pas l'écriture fautive",
    "les fichiers NON SUIVIS par git : ce balayage juge ce que le dépôt PORTE, pas ce qui traîne sur un poste",
  ],
}, null, 1));
process.exit(findings.length ? 1 : 0);
}
