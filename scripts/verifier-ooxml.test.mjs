#!/usr/bin/env node
/**
 * verifier-ooxml.test.mjs — recette du contrôle d'ordre OOXML (TF-0686), dans les deux sens.
 *
 * La fixture rouge rejoue le paquet du 27/08 en modèle réduit : un `a:ln` dont `prstDash`
 * précède `solidFill` — l'ordre exact que `ln.insert(0, …)` produisait, que python-pptx
 * écrivait sans rien dire, qu'`unzip -t` déclarait sain, et que seul PowerPoint chez le client
 * découvrait. La verte porte le même bloc dans l'ordre du schéma.
 *
 * Sans python sur le poste, la recette se déclare NON JOUÉE et sort verte : un contrôle
 * d'environnement absent se dit, il ne fait pas mentir le banc (idiome G3).
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-ooxml.py");
const python = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});
if (!python) {
  console.log("verifier-ooxml : NON JOUÉ (aucun interpréteur python sur ce poste) — déclaré, pas supposé vert");
  process.exit(0);
}

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "ooxml-"));

const SLIDE = (enfantsLn) => `<?xml version="1.0"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
       xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld><p:spTree><p:cxnSp><p:spPr>
    <a:ln w="12700">${enfantsLn}</a:ln>
  </p:spPr></p:cxnSp></p:spTree></p:cSld>
</p:sld>`;

const DESORDRE = '<a:prstDash val="dash"/><a:solidFill><a:srgbClr val="FF0000"/></a:solidFill><a:tailEnd type="arrow"/>';
const ORDRE = '<a:solidFill><a:srgbClr val="FF0000"/></a:solidFill><a:prstDash val="dash"/><a:tailEnd type="arrow"/>';

// La fixture est un vrai zip, bâti par le python du poste — le contrôle lit un PAQUET, pas un
// fichier XML nu, et c'est le paquet entier que la scène réelle mettait en cause.
const batir = (nom, xml) => {
  const chemin = join(T, nom);
  writeFileSync(join(T, "slide.xml"), xml, "utf8");
  const r = spawnSync(python, ["-c",
    "import sys, zipfile\n"
    + "z = zipfile.ZipFile(sys.argv[1], 'w')\n"
    + "z.write(sys.argv[2], 'ppt/slides/slide1.xml')\n"
    + "z.close()\n", chemin, join(T, "slide.xml")], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`fixture non bâtie : ${r.stderr}`);
  return chemin;
};
const jouer = (chemin) => {
  const r = spawnSync(python, ["-X", "utf8", OUTIL, chemin], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};

try {
  check("rouge — prstDash AVANT solidFill (la scène du 27/08) : FAIL, diapositive et élément nommés", () => {
    const r = jouer(batir("desordre.pptx", SLIDE(DESORDRE)));
    att(r.code === 1, `exit ${r.code} attendu 1 : ${r.sortie.slice(0, 300)}`);
    att(/slide1\.xml/.test(r.sortie), "la partie fautive n'est pas nommée");
    att(/a:ln/.test(r.sortie), "l'élément fautif n'est pas nommé");
  });

  check("verte — le même bloc dans l'ordre du schéma : PASS, et le compte des blocs contrôlés est dit", () => {
    const r = jouer(batir("ordre.pptx", SLIDE(ORDRE)));
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 300)}`);
    att(/1 bloc\(s\)|"elements_controles": 1/.test(r.sortie), "le compte des blocs contrôlés n'est pas rendu");
  });

  check("borne — un fichier qui n'est pas un zip : ILLISIBLE en exit 2, jamais un verdict", () => {
    const faux = join(T, "pas-un-zip.pptx");
    writeFileSync(faux, "ceci n'est pas une archive", "utf8");
    const r = jouer(faux);
    att(r.code === 2, `exit ${r.code} attendu 2 — un illisible a reçu un verdict`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nTF-0686 (ordre des enfants OOXML) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
