#!/usr/bin/env node
/**
 * Recette de relever-empreintes-skills.mjs (TF-0788) — double sens sur un dossier de skills
 * jetable : première consignation, inchangé, changé (contenu, ajout, retrait), sidecars ignorés,
 * dossier absent. Le socle Python n'est pas joué ici (--sans-socle) : la recette juge la
 * comparaison, pas Python.
 */
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { relever, rendre, empreinteSkill } from "./relever-empreintes-skills.mjs";

const T = mkdtempSync(join(tmpdir(), "empreintes-skills-"));
const SKILLS = join(T, "skills");
const JOURNAL = join(T, "etat", "empreintes.json");
const poser = (skill, fichier, contenu) => { mkdirSync(join(SKILLS, skill, ...fichier.split("/").slice(0, -1)), { recursive: true }); writeFileSync(join(SKILLS, skill, ...fichier.split("/")), contenu, "utf8"); };

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

try {
  poser("alpha", "SKILL.md", "# alpha\n");
  poser("alpha", "scripts/a.py", "print(1)\n");
  poser("beta", "SKILL.md", "# beta\n");

  check("dossier de skills absent : verdict absent, rien d'écrit, exit sans lever", () => {
    const r = relever({ dossierSkills: join(T, "nulle-part"), journal: JOURNAL, avecSocle: false });
    att(r.verdict === "absent", `verdict ${r.verdict}`);
    att(!existsSync(JOURNAL), "un journal a été écrit sans relevé");
    att(rendre(r)[0].includes("introuvable"), "le rendu ne dit pas l'absence");
  });
  check("première consignation : verdict premiere_consignation, journal écrit avec une empreinte par skill", () => {
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false, maintenant: "2026-09-03T10:00:00.000Z" });
    att(r.verdict === "premiere_consignation", `verdict ${r.verdict}`);
    const j = JSON.parse(readFileSync(JOURNAL, "utf8"));
    att(Object.keys(j.skills).length === 2 && j.skills.alpha.fichiers === 2, "journal incomplet");
    att(rendre(r)[0].includes("première fois"), "le rendu ne dit pas la première consignation");
  });
  check("rien n'a bougé : verdict inchange, et le rendu nomme le relevé précédent", () => {
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false, maintenant: "2026-09-03T11:00:00.000Z" });
    att(r.verdict === "inchange" && r.changes.length === 0, `verdict ${r.verdict}`);
    att(rendre(r)[0].includes("2026-09-03T10:00:00.000Z"), "relevé précédent non nommé");
  });
  check("un sidecar d'oracle, un __pycache__ ou un .bak n'est PAS une montée de version", () => {
    poser("alpha", "SKILL.md.oracles.json", "{}");
    poser("alpha", "scripts/__pycache__/a.cpython-312.pyc", "xx");
    poser("alpha", "scripts/a.py.bak", "old");
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false });
    att(r.verdict === "inchange", `verdict ${r.verdict} : ${JSON.stringify(r.changes)}`);
  });
  check("un octet change dans un script : verdict change, le skill est nommé avec ancienne → nouvelle empreinte", () => {
    const avant = empreinteSkill(join(SKILLS, "alpha")).empreinte;
    poser("alpha", "scripts/a.py", "print(2)\n");
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false, maintenant: "2026-09-03T12:00:00.000Z" });
    att(r.verdict === "change" && r.changes.length === 1 && r.changes[0].skill === "alpha", `changes ${JSON.stringify(r.changes)}`);
    att(r.changes[0].de === avant && r.changes[0].vers !== avant, "empreintes avant/après non rendues");
    const l = rendre(r)[0];
    att(/CHANGÉES/.test(l) && l.includes("alpha") && l.includes(avant), `rendu : ${l.slice(0, 160)}`);
    att(/rien n'est rejoué automatiquement/.test(l), "le rendu doit dire qu'il ne rejoue rien (R-29)");
  });
  check("les fins de ligne ne comptent pas : CRLF et LF donnent la même empreinte", () => {
    poser("beta", "SKILL.md", "# beta\r\n");
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false });
    att(r.verdict === "inchange", `verdict ${r.verdict} : ${JSON.stringify(r.changes)}`);
  });
  check("un skill installé et un skill retiré sont nommés comme tels", () => {
    poser("gamma", "SKILL.md", "# gamma\n");
    rmSync(join(SKILLS, "beta"), { recursive: true, force: true });
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false });
    const quoi = Object.fromEntries(r.changes.map((c) => [c.skill, c.quoi]));
    att(r.verdict === "change" && /installé/.test(quoi.gamma || "") && /retiré/.test(quoi.beta || ""), `changes ${JSON.stringify(r.changes)}`);
  });
  check("le journal est réécrit à chaque passage : la comparaison est toujours à l'ouverture précédente", () => {
    const r = relever({ dossierSkills: SKILLS, journal: JOURNAL, avecSocle: false });
    att(r.verdict === "inchange", `verdict ${r.verdict}`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nrelever-empreintes-skills (TF-0788) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
