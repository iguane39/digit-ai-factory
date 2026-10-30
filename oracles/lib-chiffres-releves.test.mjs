#!/usr/bin/env node
/**
 * lib-chiffres-releves.test.mjs — S90 (D-100 (a) du 29/10/2026) et le découpage des commandes (D-101 (b)).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chiffresSansReleve, nombresDuTexte } from "./lib-chiffres-releves.mjs";
import { decouperCommande, resoudreTemporaires } from "./lib-decoupe-commande.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };
const figures = (texte, sortie) => chiffresSansReleve(texte, nombresDuTexte(sortie)).map((x) => x.nature);

check("rouge — les 4 cas du 29/10 : durée, coût, score et compte qu'aucune sortie du tour ne montre", () => {
  const f = figures("Le contrôle dure souvent 15 minutes.\nL'offre coûte 599 $ par mois.\nIl passe à 84 sur 100.\nLe journal reçoit 339 entrées.", "rien de chiffré ici");
  att(f.join(",") === "durée,coût,score,compte", `obtenu ${f.join(",")}`);
});
check("vert — le même chiffre lu dans une sortie du tour passe, à la graphie près", () => {
  att(!figures("Le contrôle dure 46 secondes.", "real 46 secondes").length, "46 secondes accusées");
  att(!figures("Un total de 1 568 082 jetons.", '{"jetons":1568082}').length, "le séparateur de milliers trompe la comparaison");
  att(!figures("Au 90e centile, 21,4 minutes.", '{"p90_min":21.4}').length, "la virgule décimale trompe la comparaison");
});
check("vert — une ligne qui déclare le chiffre non mesuré, estimé ou visé n'est pas accusée", () => {
  for (const l of ["Score de 84 sur 100, projeté et non mesuré.", "Environ 15 minutes.", "Objectif : de 6 à 0 en 30 jours."]) att(!figures(l, "").length, l);
});
check("borne — le bloc 1, le bloc 9, le code, un lien encodé et un chemin ne sont pas lus", () => {
  att(!figures("## 1. En-tête\nDurée 12 minutes.\n## 9. Traces\n40 fichiers.\n", "").length, "blocs 1 et 9 lus");
  att(!figures("```\n99 tests\n```\n", "").length, "bloc de code lu");
  att(!figures("[fiche](output/Lot%200%20-%2020261029b.md) et `3 fichiers` cités.", "").length, "lien ou code en ligne lu");
  att(figures("## 4. Traité\n12 tests rejoués.", "").length === 1, "le bloc 4 n'est plus lu");
});
check("découpage — le « ; » d'un programme awk entre guillemets ne coupe pas (le faux « 40{exit} » du 29/10)", () => {
  const d = decouperCommande("awk '/^> /{print; n++} n>40{exit}' f | head -2; echo x");
  att(d.length === 3 && d[0].includes("n>40{exit}'"), JSON.stringify(d));
});
check("découpage — un guillemet resté ouvert rend le découpage naïf : l'écriture reste visible", () => {
  const d = decouperCommande("echo l'ami > f; rm x");
  att(d.length === 2 && d[0].includes("> f"), JSON.stringify(d));
});
const estTemp = (p) => /appdata\/local\/temp/i.test(p);
check("variables — seule une variable posée dans la commande ET désignant le dossier temporaire est résolue", () => {
  const r = resoudreTemporaires('S="C:/Users/i/AppData/Local/Temp/x"; mkdir -p "$S/y"; rm -rf ${S}/z; rm $AUTRE/z; D=C:/dev/p; rm $D/f', estTemp);
  att(r.includes('mkdir -p "C:/Users/i/AppData/Local/Temp/x/y"') && r.includes("rm -rf C:/Users/i/AppData/Local/Temp/x/z"), r);
  att(r.includes("rm $AUTRE/z") && r.includes("rm $D/f"), `une autre variable est résolue : ${r}`);
});
// D-101 (b) : ce que le hook de fin de tour compte comme une écriture, et le seuil de la réponse courte.
const { ecrituresDuTour, jugeable } = await import("./hook-restitution.mjs");
const TEMP = `${tmpdir().replace(/\\/g, "/")}/session-essai`;
const outil = (name, input) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name, input }] } });
const bash = (command) => outil("Bash", { command });
check("hook — un brouillon dans le dossier temporaire n'est pas une écriture du tour ; un fichier du dépôt, si", () => {
  att(!ecrituresDuTour([outil("Write", { file_path: `${TEMP}/brouillon.md` })]).length, "le brouillon temporaire compte");
  att(ecrituresDuTour([outil("Write", { file_path: "C:/dev/produit-fictif/note.md" })]).length === 1, "l'écriture dans le dépôt ne compte plus");
});
check("hook — une commande vers une variable du dossier temporaire, posée dans la commande, n'est pas une écriture", () => {
  for (const c of [`S="${TEMP}"; mkdir -p "$S/y"`, `W="${TEMP}"; rm -rf "$W/z"`]) att(!ecrituresDuTour([bash(c)]).length, c);
});
check("hook — le faux « 40{exit} » d'un programme awk ne compte plus ; `sed -i`, `mv` et `git mv` dans le dépôt comptent", () => {
  att(!ecrituresDuTour([bash("awk '/^> /{print; n++} n>40{exit}' f | head -2")]).length, "le programme awk compte");
  for (const c of ["sed -i s/a/b/ src/f.txt", "mv src/a.txt src/b.txt", "git mv src/a.txt src/b.txt"]) att(ecrituresDuTour([bash(c)]).length >= 1, c);
});
const mots = (n) => Array.from({ length: n }, (_, i) => `mot${i}`).join(" ") + ".";
check("hook — réponse sans écriture : 250 mots passent, 251 sont jugés (D-101 (b)) ; le motif compte les écritures relevées", () => {
  att(jugeable({ travail: false, dernierTexte: mots(250) }).juge === false, "250 mots jugés");
  att(jugeable({ travail: false, dernierTexte: mots(251) }).juge === true, "251 mots non jugés");
  const r = jugeable({ travail: true, ecritures: 0, commandes: 2, dernierTexte: "Fait.", ecrituresDuTour: ["commande à effet « git mv »"] });
  att(/tour de travail \(1 écriture/.test(r.motif), r.motif);
});
check("hook — une question courte qui POSE une décision reste jugée ; une simple question ne l'est pas", () => {
  att(jugeable({ travail: false, dernierTexte: "D-7 — faut-il publier la forge ?" }).juge === true, "la décision posée échappe");
  att(jugeable({ travail: false, dernierTexte: "Quel dossier veux-tu ?" }).juge === false, "une question simple est jugée");
});
check("oracle — S90 lit les nombres passés par le hook, et rend SANS_OBJET sans eux", () => {
  const d = mkdtempSync(join(tmpdir(), "s90-"));
  const f = join(d, "m.md"), n = join(d, "n.json");
  writeFileSync(f, "## 4. Traité\n\nLe contrôle dure 15 minutes.\n", "utf8");
  writeFileSync(n, JSON.stringify(["46"]), "utf8");
  const oracle = fileURLToPath(new URL("./oracle-synthese.mjs", import.meta.url));
  const lire = (args) => JSON.parse(spawnSync(process.execPath, [oracle, f, ...args], { encoding: "utf8" }).stdout).findings.find((x) => x.regle === "S90");
  att(lire(["--nombres-tour", n]).statut === "FAIL", "S90 ne rougit pas");
  att(lire([]).statut === "SANS_OBJET", "S90 juge sans les nombres du tour");
  rmSync(d, { recursive: true, force: true });
});
console.log(`\nlib-chiffres-releves (D-100, D-101) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
