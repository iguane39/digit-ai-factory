#!/usr/bin/env node
/**
 * oracle-ecosysteme.mjs — exhaustivité des forges sur toutes les surfaces documentaires
 * (TF-0080 ; né d'un trou réel : fiche forge-audit absente, détectée par contrôle humain).
 *
 * Source de vérité UNIQUE : la liste FORGES de bootstrap.mjs — toute forge qui y entre
 * devient exigible partout ; en retirer une la retire des exigences. Règles :
 *  E1  chaque forge a sa fiche baseline  fiches\forge-<nom>.md
 *  E2  chaque forge est présente dans    INVENTAIRE.md
 *  E3  chaque forge est présente dans    CONTRAT-INTERFACE.md
 *  E4  chaque forge est présente dans    CLAUDE.md (noyau — nom d'étape accepté)
 *  E5  chaque forge est présente dans le dernier schéma écosystème (output\Forge Pilot - Schéma Écosystème - *.html)
 *  E6  chaque forge est citée LITTÉRALEMENT (forge-<nom>) dans README.md (l'énumération fait foi)
 *  E7  le compte affiché au schéma (« Périmètre : N forges ») = forges bootstrap + le pilot
 *
 * Usage : node oracle-ecosysteme.mjs [racine]  — exit 0 PASS / 1 FAIL / 2 SKIP.
 * non_juge : qualité du contenu des mentions (une citation vide passerait E2-E6) ;
 * existence des dépôts GitHub distants (réseau) ; fraîcheur des clones locaux (bootstrap --pull).
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const racine = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), "..");
const findings = [];
const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
const NON_JUGE = [
  "qualité du contenu des mentions — une citation creuse passerait E2-E6 (revue de lecture humaine)",
  "existence des dépôts GitHub distants (réseau) — bootstrap les vérifie à l'amorçage",
  "fraîcheur des clones locaux (bootstrap --pull, boucle ⑤)",
];
function sortir(verdict, code) {
  process.stdout.write(JSON.stringify({ oracle: "oracle-ecosysteme", version: "1.0.0", verdict, findings, non_juge: NON_JUGE }, null, 1));
  process.exit(code);
}

// ── source de vérité : bootstrap.mjs ───────────────────────────────────────
const bp = join(racine, "bootstrap.mjs");
if (!existsSync(bp)) { ko("E0", "bootstrap.mjs absent — liste des forges introuvable"); sortir("SKIP", 2); }
const forges = [...readFileSync(bp, "utf8").matchAll(/nom:\s*"digit-ai-forge-([a-z0-9_-]+)"/g)].map(m => m[1]);
if (!forges.length) { ko("E0", "aucune forge déclarée dans bootstrap.mjs (motif nom: \"digit-ai-forge-…\")"); sortir("SKIP", 2); }
ok("E0", `source de vérité : ${forges.length} forge(s) au bootstrap — ${forges.join(", ")}`);

// ── surfaces ────────────────────────────────────────────────────────────────
const lire = f => existsSync(join(racine, f)) ? readFileSync(join(racine, f), "utf8").toLowerCase() : null;
const souple = (txt, f) => txt.includes(`forge-${f}`) || txt.includes(`digit-ai-forge-${f}`) || new RegExp(`\\b${f}\\b`).test(txt);

// E1 · fiches
for (const f of forges) {
  existsSync(join(racine, "fiches", `forge-${f}.md`))
    ? ok("E1", `fiche présente : fiches\\forge-${f}.md`)
    : ko("E1", `fiche baseline ABSENTE : fiches\\forge-${f}.md`);
}

// E2-E4 · documents à correspondance souple (étapes et lignes de table au nom nu)
for (const [regle, fichier] of [["E2", "INVENTAIRE.md"], ["E3", "CONTRAT-INTERFACE.md"], ["E4", "CLAUDE.md"]]) {
  const txt = lire(fichier);
  if (txt === null) { ko(regle, `${fichier} absent`); continue; }
  const absentes = forges.filter(f => !souple(txt, f));
  absentes.length
    ? absentes.forEach(f => ko(regle, `forge « ${f} » absente de ${fichier}`))
    : ok(regle, `${fichier} : ${forges.length}/${forges.length} forges présentes`);
}

// E5 · dernier schéma écosystème (tri par nom = tri chronologique, convention datée).
// output\ peut être organisé en sous-dossiers (ex. 02-schema-ecosysteme\) : on cherche le
// schéma courant à la racine ET dans les sous-dossiers immédiats, en excluant old\ et .oracles\.
const out = join(racine, "output");
const RE_SCHEMA = /^Forge Pilot - Schéma Écosystème - .*\.html$/;
const schemas = [];
if (existsSync(out)) {
  for (const n of readdirSync(out)) {
    const p = join(out, n);
    if (RE_SCHEMA.test(n)) { schemas.push({ nom: n, chemin: p }); continue; }
    if (statSync(p).isDirectory() && !/^(old|\.oracles)$/i.test(n))
      for (const m of readdirSync(p))
        if (RE_SCHEMA.test(m)) schemas.push({ nom: m, chemin: join(p, m) });
  }
}
schemas.sort((a, b) => a.nom.localeCompare(b.nom));
if (!schemas.length) ko("E5", "aucun schéma écosystème dans output\\ (ni ses sous-dossiers)");
else {
  const dernier = schemas[schemas.length - 1].nom;
  const txt = readFileSync(schemas[schemas.length - 1].chemin, "utf8").toLowerCase();
  const absentes = forges.filter(f => !souple(txt, f));
  absentes.length
    ? absentes.forEach(f => ko("E5", `forge « ${f} » absente du schéma ${dernier}`))
    : ok("E5", `${dernier} : ${forges.length}/${forges.length} forges présentes`);

  // E7 · compte affiché = forges + pilot
  const attendu = forges.length + 1;
  const m = txt.match(/périmètre<\/b>\s*(\d+)\s*forges/);
  if (!m) ko("E7", `compte « Périmètre : N forges » introuvable dans ${dernier}`);
  else if (Number(m[1]) !== attendu) ko("E7", `schéma annonce ${m[1]} forges, attendu ${attendu} (${forges.length} bootstrap + pilot)`);
  else ok("E7", `compte du schéma cohérent : ${attendu} forges (bootstrap + pilot)`);
}

// E6 · README : citation littérale exigée (l'énumération avec liens fait foi)
const readme = lire("README.md");
if (readme === null) ko("E6", "README.md absent");
else {
  const absentes = forges.filter(f => !readme.includes(`forge-${f}`));
  absentes.length
    ? absentes.forEach(f => ko("E6", `« forge-${f} » non cité littéralement dans README.md`))
    : ok("E6", `README.md : ${forges.length}/${forges.length} forges citées littéralement`);
}

sortir(findings.some(f => f.statut === "FAIL") ? "FAIL" : "PASS", findings.some(f => f.statut === "FAIL") ? 1 : 0);
