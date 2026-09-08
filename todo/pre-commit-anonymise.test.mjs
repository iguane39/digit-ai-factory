#!/usr/bin/env node
/**
 * Banc de `pre-commit-anonymise.mjs` (TF-0980) — sur un DÉPÔT JETABLE, jamais sur celui-ci.
 *
 * Le module travaille sur l'index d'un vrai dépôt git : le banc en crée un sous le répertoire
 * temporaire, y indexe des fichiers, et vérifie ce que le geste en fait. Il pose aussi ses
 * propres tables jetables (TF-0957) — un banc qui hérite du référentiel de production l'abîme.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "precommit-"));
const DEPOT = join(T, "depot");
mkdirSync(DEPOT, { recursive: true });
const git = (...a) => execFileSync("git", a, { cwd: DEPOT, encoding: "utf8" });
git("init", "-q");
git("config", "user.email", "banc@exemple.test");
git("config", "user.name", "banc");

// Tables jetables, sous le répertoire temporaire : ce banc n'étend jamais le référentiel réel.
writeFileSync(join(T, "_noms.json"), JSON.stringify({
  noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" },
}), "utf8");
writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: { "CalculatriceZorglubZAP": "Produit-01" } }), "utf8");
process.env.FORGE_NOMS_INTERDITS = join(T, "_noms.json");
process.env.FORGE_PRODUITS_PSEUDO = join(T, "_prod.json");

const { passer } = await import("./pre-commit-anonymise.mjs");

// Le module lit la racine depuis SON emplacement ; on lui donne donc les fichiers à la main,
// ce qui est aussi la façon de l'éprouver sans dépendre de l'index du dépôt courant.
const poser = (nom, corps) => { writeFileSync(join(DEPOT, nom), corps, "utf8"); return nom; };

check("ROUGE → VERT — un contenu porteur est pseudonymisé, et le fichier est réécrit", () => {
  const f = poser("note.md", "Lot de CalculatriceZorglubZAP pour Zorglub.\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(r.corriges.length === 1, "le fichier porteur n'est pas relevé");
  att(r.corriges[0].termes >= 1, "aucun terme compté");
});

check("VERT — un fichier PROPRE n'est pas touché, et n'apparaît pas dans les corrections", () => {
  const f = poser("propre.md", "Rien a voir ici.\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(!r.corriges.some((c) => c.fichier === f), "un fichier propre est déclaré corrigé");
});

check("REFUS — un NOM de fichier porteur est relevé, avec la commande exacte de renommage", () => {
  const f = poser("CalculatriceZorglubZAP - RETOURS - 20260908a.md", "corps propre\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  const n = r.nomsPorteurs.find((x) => x.fichier === f);
  att(n, "un nom de fichier porteur n'est pas relevé — c'est le cas qui a fait amender un commit le 08/09");
  att(!/Zorglub/i.test(n.propose), "le nom proposé porte encore le nom réel : " + n.propose);
});

check("SECOND SENS du refus — un nom de fichier PROPRE n'est jamais relevé", () => {
  const f = poser("Produit-09 - RETOURS - 20260908b.md", "corps\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(!r.nomsPorteurs.some((x) => x.fichier === f), "un nom propre est pris pour porteur");
});

check("REFUS — tables illisibles : le geste LÈVE au lieu de laisser passer", () => {
  const memoire = process.env.FORGE_NOMS_INTERDITS;
  process.env.FORGE_NOMS_INTERDITS = join(T, "_absent.json");
  let leve = false;
  try { passer({ fichiers: [poser("x.md", "Zorglub\n")], ecrire: false, racine: DEPOT }); } catch { leve = true; }
  process.env.FORGE_NOMS_INTERDITS = memoire;
  att(leve, "un référentiel absent laisse passer : anonymiser à moitié donnerait l'impression que le dépôt est propre");
});

check("le mode essai n'écrit rien — le fichier porteur est intact après la passe", () => {
  const f = poser("essai.md", "Lot de Zorglub.\n");
  passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(readFileSync(join(DEPOT, f), "utf8").includes("Zorglub"), "le mode essai a réécrit le fichier");
});

rmSync(T, { recursive: true, force: true });
console.log(`\npre-commit-anonymise (TF-0980) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
