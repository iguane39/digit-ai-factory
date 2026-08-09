#!/usr/bin/env node
/**
 * oracle-claude-md.mjs — plafond de taille du noyau CLAUDE.md + intégrité des références
 * (TF-0037/TF-0053). Règles :
 *  N1  CLAUDE.md ≤ 6144 octets (le noyau reste lisible en session — ×3,8 en 5 jours avant borne)
 *  N2  chaque fichier `references\<X>.md` cité par le noyau existe
 *  N3  chaque fichier de references\ est cité par le noyau (pas de référence orpheline)
 * Usage : node oracle-claude-md.mjs [racine]  — exit 0 PASS / 1 FAIL.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const racine = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), "..");
const findings = [];
const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

const PLAFOND = 6144;
const noyau = join(racine, "CLAUDE.md");
if (!existsSync(noyau)) { ko("N1", "CLAUDE.md absent"); }
else {
  const taille = statSync(noyau).size;
  taille <= PLAFOND
    ? ok("N1", `noyau ${taille} octets ≤ ${PLAFOND}`)
    : ko("N1", `noyau ${taille} octets > plafond ${PLAFOND} — déplacer le détail vers references\\`);

  const texte = readFileSync(noyau, "utf8");
  const citees = new Set([...texte.matchAll(/references\\([\w-]+\.md)/g)].map((m) => m[1]));
  for (const f of citees)
    existsSync(join(racine, "references", f))
      ? ok("N2", `references\\${f} cité et présent`)
      : ko("N2", `references\\${f} cité par le noyau mais ABSENT`);
  const refDir = join(racine, "references");
  if (existsSync(refDir))
    for (const f of readdirSync(refDir).filter((n) => n.endsWith(".md")))
      if (!citees.has(f)) ko("N3", `references\\${f} existe mais n'est pas cité par le noyau (orphelin)`);
  if (![...findings].some((x) => x.regle === "N3")) ok("N3", "aucune référence orpheline");
}

const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({ oracle: "oracle-claude-md", version: "1.0.0", verdict: echecs ? "FAIL" : "PASS", findings }, null, 1));
process.exit(echecs ? 1 : 0);
