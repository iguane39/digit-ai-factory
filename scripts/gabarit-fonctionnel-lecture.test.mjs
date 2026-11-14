#!/usr/bin/env node
/**
 * gabarit-fonctionnel-lecture.test.mjs — recette à double sens du gabarit `gabarits\docs-projet\FONCTIONNEL.md` (TF-2545, 14/11/2026).
 *
 * LE FAIT. Une table de correspondance de 17 lignes ajoutée à `docs/projet/FONCTIONNEL.md` d'un produit, sans phrase de lecture, a été refusée par
 * le hook d'écriture (M10 de `check_markdown.py`), puis reprise : le gabarit ne montrait aucune phrase de lecture avant ses tables, et ses deux tables
 * ouvraient leur chapitre à nu (M7). Le gabarit montre désormais, avant chaque table, la phrase de lecture attendue, et la dit en tête de fichier.
 *
 * CE QUE LA RECETTE JOUE, avec le juge du hook (`check_markdown.py` du socle digit-ai-page-html, forge-agents) : le gabarit PASSE ; le même gabarit
 * privé de ses phrases de lecture (chirurgie vérifiée) ÉCHOUE sur M7 pour chacune de ses deux tables ; une table de plus de 12 lignes sans phrase de
 * lecture ÉCHOUE sur M10 et PASSE avec elle (le cas du 14/11). Sans python ou sans forge-agents sur le poste, la recette se dit NON JOUÉE (exit 0).
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const GABARIT = join(ICI, "..", "gabarits", "docs-projet", "FONCTIONNEL.md");
const CHECK = join("digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", "check_markdown.py");
const PARC = [process.env.FORGE_ROOT, join(ICI, "..", ".."), "c:\\dev"].filter(Boolean).find((r) => existsSync(join(r, CHECK)));
const PYTHON = ["python", "python3", "py"].find((bin) => { const r = spawnSync(bin, ["--version"], { encoding: "utf8" }); return !r.error && r.status === 0; });
if (!PYTHON || !PARC) {
  console.log(`\ngabarit-fonctionnel-lecture : NON JOUÉE — ${!PYTHON ? "aucun interpréteur python" : "check_markdown.py de forge-agents introuvable (FORGE_ROOT, voisin du pilot, c:\\dev)"} sur ce poste (ni pour ni contre)`);
  process.exit(0);
}

let ok = 0, ko = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); ok++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); ko++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };
const base = mkdtempSync(join(tmpdir(), "gab-fonct-"));
let n = 0;
/** Le verdict du juge du hook sur un texte : { exit, sortie }. */
const juger = (texte) => {
  const f = join(base, `t${++n}.md`);
  writeFileSync(f, texte, "utf8");
  const r = spawnSync(PYTHON, [join(PARC, CHECK), f], { encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } });
  return { exit: r.status, sortie: `${r.stdout}${r.stderr}` };
};
const GAB = readFileSync(GABARIT, "utf8").replace(/\r\n/g, "\n");
const PHRASE = /^\{Phrase de lecture : [^\n]*\}\n\n/gm;

try {
  check("vert — le gabarit FONCTIONNEL.md passe le juge du hook (M7, M10, M14, M18)", () => {
    const r = juger(GAB);
    att(r.exit === 0 && /Verdict : PASS/.test(r.sortie), `exit ${r.exit} : ${r.sortie.slice(0, 400)}`);
  });
  check("le gabarit porte une phrase de lecture avant chacune de ses deux tables, et la règle en tête de fichier", () => {
    const phrases = GAB.match(PHRASE) || [];
    const tables = (GAB.match(/^\| (Rôle|Objet) \|/gm) || []).length;
    att(phrases.length === 2 && tables === 2, `phrases ${phrases.length}, tables ${tables}`);
    att(/Toute table de ce fichier[\s\S]*phrase de lecture/.test(GAB), "la règle n'est pas dite en tête du gabarit");
    for (const p of phrases) att(/ce que vaut chaque colonne/.test(p) && /trié/.test(p) && /exclut/.test(p), `phrase incomplète : ${p}`);
  });
  check("rouge — le gabarit privé de ses phrases de lecture (l'état d'avant) échoue sur M7, une fois par table", () => {
    const ancien = GAB.replace(PHRASE, "");
    att(ancien !== GAB, "chirurgie sans effet : le témoin est vide");
    const r = juger(ancien);
    att(r.exit !== 0 && (r.sortie.match(/M7 chapitre sans ouverture/g) || []).length === 2, `exit ${r.exit} : ${r.sortie.slice(0, 500)}`);
  });
  const TABLE_17 = Array.from({ length: 17 }, (_, i) => `| clip ${i + 1} | section ${i + 1} |`).join("\n");
  const CORRESPONDANCE = (phrase) => `# Fonctionnel\n\n## Correspondance des clips\n\n${phrase}| Clip | Section |\n|---|---|\n${TABLE_17}\n`;
  check("rouge → vert — la table de correspondance de 17 lignes du 14/11 : sans phrase de lecture M7 et M10 refusent, avec la phrase attendue par le gabarit elles passent", () => {
    const sans = juger(CORRESPONDANCE(""));
    att(sans.exit !== 0 && /M10 chapitre de données sans mode d'emploi/.test(sans.sortie), `sans phrase : exit ${sans.exit} ${sans.sortie.slice(0, 400)}`);
    const avec = juger(CORRESPONDANCE("Une ligne est un clip ; la colonne Section dit où il se joue, les clips sont triés par numéro et les clips retirés sont exclus.\n\n"));
    att(avec.exit === 0, `avec phrase : exit ${avec.exit} ${avec.sortie.slice(0, 400)}`);
  });
} finally { rmSync(base, { recursive: true, force: true }); }

console.log(`\ngabarit-fonctionnel-lecture (TF-2545) : ${ok} PASS, ${ko} FAIL — cas rouges : le gabarit sans ses phrases (M7 ×2), la table de 17 lignes sans phrase (M10)`);
process.exit(ko ? 1 : 0);
