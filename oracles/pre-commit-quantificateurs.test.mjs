#!/usr/bin/env node
// Banc de la garde des quantificateurs au pré-commit (A-109, TF-1010).
//
// IL SE JOUE SUR DE VRAIS DÉPÔTS JETABLES, et non sur la seule fonction de comparaison : ce que
// cette garde doit prouver n'est pas qu'elle sait compter des mots — N4 le prouve déjà — mais
// qu'elle juge l'INDEX. Un banc qui n'appellerait que la comparaison passerait sans jamais
// éprouver le point qui a motivé la garde.
//
// LES DEUX CAS NÉGATIFS SONT LE CŒUR DU BANC : une perte présente sur le DISQUE mais NON INDEXÉE
// ne part pas dans le commit et ne doit rien déclencher ; et un noyau absent de l'index ne se juge
// pas du tout. Sans eux, une garde qui refuserait tout commit passerait pour verte.
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const GARDE = join(ICI, "pre-commit-quantificateurs.mjs");

const AVEC = "- Livrable accepte sur verdict d oracle execute seulement ; le reste suit.\n";
const SANS = "- Livrable accepte sur verdict d oracle execute ; le reste suit.\n";
const DEPLACE = "- Livrable accepte seulement sur verdict d oracle execute ; le reste suit.\n";
// LE CAS QUI A TROUVÉ UN DÉFAUT DE LA RÈGLE, le 10/09 : c'est la reformulation que le message de
// refus RECOMMANDE lui-même. La première version comptait chaque mot séparément et la refusait —
// « seulement » 1 → 0 — alors que « seul » passe de 0 à 1 et que l'exclusivité est intégralement
// conservée. Posé tel quel, le hameçon aurait bloqué la réparation même du noyau faite ce matin.
// Une règle qui interdit son propre remède ne se contourne pas : elle se désactive.
const REFORMULE = "- Livrable accepte sur le seul verdict d un oracle execute ; le reste suit.\n";

const cas = [];
const dit = (libelle, obtenu, attendu) => cas.push({ libelle, ok: obtenu === attendu, obtenu, attendu });

/** Monte un dépôt jetable, y commit `commis`, puis met `indexe` en index et `disque` sur disque. */
function jouer({ commis, indexe, disque, sansNoyauIndexe = false }) {
  const bac = mkdtempSync(join(tmpdir(), "banc-quantif-"));
  const git = (...a) => execFileSync("git", ["-C", bac, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  writeFileSync(join(bac, "CLAUDE.md"), commis, "utf8");
  git("init", "-q");
  git("config", "user.email", "banc@local");
  git("config", "user.name", "banc");
  git("add", "CLAUDE.md");
  git("commit", "-q", "-m", "noyau de depart");
  if (sansNoyauIndexe) {
    writeFileSync(join(bac, "autre.md"), "sans rapport", "utf8");
    git("add", "autre.md");
  } else if (indexe !== undefined) {
    writeFileSync(join(bac, "CLAUDE.md"), indexe, "utf8");
    git("add", "CLAUDE.md");
  }
  if (disque !== undefined) writeFileSync(join(bac, "CLAUDE.md"), disque, "utf8");
  let code = 0;
  try { execFileSync(process.execPath, [GARDE], { cwd: bac, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { code = e.status ?? 1; }
  rmSync(bac, { recursive: true, force: true });
  return code;
}

// --- ce qui doit être REFUSÉ ---
dit("le mot est retiré et INDEXÉ : le commit est refusé", jouer({ commis: AVEC, indexe: SANS }), 1);

// --- ce qui doit PASSER ---
dit("le noyau indexé est identique : rien à dire", jouer({ commis: AVEC, indexe: AVEC }), 0);
dit("le mot est DÉPLACÉ, le compte est égal : rien à dire", jouer({ commis: AVEC, indexe: DEPLACE }), 0);
dit("le mot est AJOUTÉ : un renforcement ne se refuse pas", jouer({ commis: SANS, indexe: AVEC }), 0);
dit("la REFORMULATION que le refus recommande passe — l'exclusivité est conservée autrement",
    jouer({ commis: AVEC, indexe: REFORMULE }), 0);
dit("perdre une famille en en ajoutant une AUTRE reste un refus",
    jouer({ commis: "- rien n est jamais accepte sans preuve.\n", indexe: "- seul le verdict est accepte.\n" }), 1);

// --- les deux cas NÉGATIFS qui prouvent que la garde juge l'INDEX ---
dit("perte sur le DISQUE mais NON INDEXÉE : elle ne part pas, donc rien à dire",
    jouer({ commis: AVEC, indexe: AVEC, disque: SANS }), 0);
dit("le noyau n'est pas dans le commit : la garde ne se prononce pas",
    jouer({ commis: AVEC, sansNoyauIndexe: true, disque: SANS }), 0);

let ok = 0, ko = 0;
for (const c of cas) {
  if (c.ok) { ok++; console.log(`  [PASS] ${c.libelle}`); }
  else { ko++; console.log(`  [FAIL] ${c.libelle} — code obtenu ${c.obtenu}, attendu ${c.attendu}`); }
}
console.log(`\nBanc pre-commit-quantificateurs : ${ok} PASS, ${ko} FAIL`);
process.exit(ko ? 1 : 0);
