#!/usr/bin/env node
/**
 * lib-extensions-jugees.test.mjs — recette de `lib-extensions-jugees.mjs` (TF-1266, D-15 (a)).
 *
 * Les deux sens sur chaque promesse. Le sens ROUGE compte plus que le vert ici : une source unique
 * qui rend une liste VIDE quand son référentiel est illisible est pire que quatre listes en dur —
 * un balayage qui ne cherche rien rend un vert, et un vert faux se propage à tous ses lecteurs.
 * Le module doit donc ARRÊTER, jamais se replier.
 * Joué par `oracles\self-tests.mjs`.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
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
//
// TF-1690 (14/10/2026) : les référentiels fautifs s'écrivent dans une COPIE de l'arborescence, sous le
// dossier temporaire — `scripts\lib-extensions-jugees.mjs` copié à côté d'un `references\` jetable,
// puisque le module lit son référentiel relativement à lui-même. Écrits sur le VRAI référentiel puis
// remis, ils faisaient lire un référentiel faux à toute session qui travaillait sur le dépôt pendant
// le passage, et un arrêt du banc au milieu l'aurait laissé abîmé.
const dossier = mkdtempSync(join(tmpdir(), "ext-jugees-"));
mkdirSync(join(dossier, "scripts"));
mkdirSync(join(dossier, "references"));
copyFileSync(new URL("./lib-extensions-jugees.mjs", import.meta.url), join(dossier, "scripts", "lib-extensions-jugees.mjs"));
const referentielCopie = join(dossier, "references", "EXTENSIONS-JUGEES.json");
const reelAvant = readFileSync(CHEMIN_REFERENTIEL);
const essai = (contenu, quoi) => {
  writeFileSync(referentielCopie, contenu, "utf8");
  const r = spawnSync(process.execPath, ["-e",
    `import(${JSON.stringify(pathToFileURL(join(dossier, "scripts", "lib-extensions-jugees.mjs")).href)})`
    + `.then((m) => { m.livrablesPorteurs(); process.exit(0); }).catch(() => process.exit(3));`],
    { encoding: "utf8" });
  veut(r.status === 3, `${quoi} : le module n'a pas arrêté (code ${r.status})`);
};
try {
  // Témoin : la copie, garnie du VRAI référentiel, se lit — sans quoi les quatre arrêts ci-dessous
  // pourraient venir d'une copie mal posée et non du contenu fautif.
  writeFileSync(referentielCopie, reelAvant);
  const temoin = spawnSync(process.execPath, ["-e",
    `import(${JSON.stringify(pathToFileURL(join(dossier, "scripts", "lib-extensions-jugees.mjs")).href)})`
    + `.then((m) => { m.livrablesPorteurs(); process.exit(0); }).catch(() => process.exit(3));`],
    { encoding: "utf8" });
  veut(temoin.status === 0, `la copie garnie du référentiel réel ne se lit pas (code ${temoin.status}) — les arrêts du sens rouge ne prouveraient rien`);
  essai("{ ceci n'est pas du json", "référentiel illisible");
  essai(JSON.stringify({ roles: {} }), "référentiel sans aucun rôle");
  essai(JSON.stringify({ roles: { livrables_porteurs: { extensions: [] }, texte_balaye: { extensions: [".md"] } } }),
        "rôle des livrables VIDE");
  essai(JSON.stringify({ roles: { livrables_porteurs: { extensions: [".md"] } } }),
        "rôle du balayage de texte absent");
} finally {
  rmSync(dossier, { recursive: true, force: true });
}

// Le VRAI référentiel n'a pas été touché : un banc qui écrit dans sa source n'est pas un banc.
veut(Buffer.compare(readFileSync(CHEMIN_REFERENTIEL), reelAvant) === 0,
     "le référentiel réel a été modifié par le sens rouge — le banc doit travailler sur sa copie");

if (casse.length) {
  console.log(`Self-test extensions-jugees : ${12 - casse.length}/12 PASS · CASSE : ${casse.join(" · ")}`);
  process.exit(1);
}
console.log("Self-test extensions-jugees : 12/12 PASS (le référentiel réel se lit et se date ; `.pdf` "
  + "compté et `.png` écarté ; le balayage de texte plus large que les livrables ; et les QUATRE sens "
  + "rouges — illisible, sans rôle, rôle vide, rôle absent — ARRÊTENT le lecteur au lieu de rendre une "
  + "liste vide, parce qu'un balayage qui ne cherche rien rend un vert ; joués sur une COPIE témoin qui se lit, le vrai référentiel jamais écrit)");
