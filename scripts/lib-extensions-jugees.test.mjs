#!/usr/bin/env node
/**
 * lib-extensions-jugees.test.mjs — recette de `lib-extensions-jugees.mjs` (TF-1087, D-15 (a)).
 *
 * Les deux sens sur chaque promesse. Le sens ROUGE compte plus que le vert ici : une source unique
 * qui rend une liste VIDE quand son référentiel est illisible est pire que quatre listes en dur —
 * un balayage qui ne cherche rien rend un vert, et un vert faux se propage à tous ses lecteurs.
 * Le module doit donc ARRÊTER, jamais se replier.
 * Joué par `oracles\self-tests.mjs`.
 */
import { mkdtempSync, writeFileSync, rmSync, readFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { livrablesPorteurs, texteBalaye, versionReferentiel, CHEMIN_REFERENTIEL } from "./lib-extensions-jugees.mjs";

const casse = [];
const veut = (cond, quoi) => { if (!cond) casse.push(quoi); };

// ── SENS VERT : le référentiel réel se lit, et rend ce qu'il déclare ────────────────────────
const porteurs = livrablesPorteurs();
const texte = texteBalaye();
veut(porteurs.has(".html") && porteurs.has(".md"), "les porteurs ne contiennent pas .html et .md");
veut(porteurs.has(".pdf"), "`.pdf` absent des porteurs — c'est l'extension qui a fait naître la source unique");
veut(!porteurs.has(".png"), "`.png` compté comme livrable — une capture d'oracle n'en est pas un");
veut(texte.has(".mjs") && texte.has(".py"), "le balayage de texte ne descend pas dans le code");
veut(texte.size > porteurs.size, "le balayage de texte devrait être PLUS large que les livrables");
veut(/^\d+\.\d+\.\d+ \(\d{4}-\d{2}-\d{2}\)$/.test(versionReferentiel()),
     `la version du référentiel ne porte pas sa date : « ${versionReferentiel()} »`);

// Toute extension est minuscule et commence par un point : un `.HTML` comparé à `extname()` en
// minuscule ne matcherait jamais, et le contrôle serait muet sans être faux.
for (const e of [...porteurs, ...texte]) {
  veut(e === e.toLowerCase() && e.startsWith("."), `extension mal formée : « ${e} »`);
}

// ── SENS ROUGE : un référentiel illisible, vide ou amputé ARRÊTE le lecteur ─────────────────
// Joué dans un processus séparé : le module met sa lecture en cache, et un cache chaud masquerait
// exactement le défaut qu'on cherche.
const dossier = mkdtempSync(join(tmpdir(), "ext-jugees-"));
const sauvegarde = join(dossier, "reel.json");
copyFileSync(CHEMIN_REFERENTIEL, sauvegarde);
const mien = new URL(import.meta.url).pathname;
const essai = (contenu, quoi) => {
  writeFileSync(CHEMIN_REFERENTIEL, contenu, "utf8");
  const r = spawnSync(process.execPath, ["-e",
    `import(${JSON.stringify(new URL("./lib-extensions-jugees.mjs", import.meta.url).href)})`
    + `.then((m) => { m.livrablesPorteurs(); process.exit(0); }).catch(() => process.exit(3));`],
    { encoding: "utf8" });
  veut(r.status === 3, `${quoi} : le module n'a pas arrêté (code ${r.status})`);
};
try {
  essai("{ ceci n'est pas du json", "référentiel illisible");
  essai(JSON.stringify({ roles: {} }), "référentiel sans aucun rôle");
  essai(JSON.stringify({ roles: { livrables_porteurs: { extensions: [] }, texte_balaye: { extensions: [".md"] } } }),
        "rôle des livrables VIDE");
  essai(JSON.stringify({ roles: { livrables_porteurs: { extensions: [".md"] } } }),
        "rôle du balayage de texte absent");
} finally {
  writeFileSync(CHEMIN_REFERENTIEL, readFileSync(sauvegarde, "utf8"), "utf8");
  rmSync(dossier, { recursive: true, force: true });
}

// Le référentiel est rendu à l'identique : un banc qui abîme sa source n'est pas un banc.
veut(readFileSync(CHEMIN_REFERENTIEL, "utf8").includes("pilot/extensions-jugees@1"),
     "le référentiel n'a PAS été rendu à l'identique après le sens rouge");

if (casse.length) {
  console.log(`Self-test extensions-jugees : ${11 - casse.length}/11 PASS · CASSE : ${casse.join(" · ")}`);
  process.exit(1);
}
console.log("Self-test extensions-jugees : 11/11 PASS (le référentiel réel se lit et se date ; `.pdf` "
  + "compté et `.png` écarté ; le balayage de texte plus large que les livrables ; et les QUATRE sens "
  + "rouges — illisible, sans rôle, rôle vide, rôle absent — ARRÊTENT le lecteur au lieu de rendre une "
  + "liste vide, parce qu'un balayage qui ne cherche rien rend un vert)");
