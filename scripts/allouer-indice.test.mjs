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
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
