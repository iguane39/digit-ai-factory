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
 *  E8  toute forge née après R-31 porte un verdict de non-recouvrement écrit dans sa fiche
 *  E9  tout livrable MARQUÉ « destinataire: humain » d'une forge vit sous son output\ en
 *      famille D-15 (TF-0319 — miroir de la règle 2 du pilot ; ce qui n'est pas marqué
 *      n'est jamais jugé)
 *
 * Usage : node oracle-ecosysteme.mjs [racine]  — exit 0 PASS / 1 FAIL / 2 SKIP.
 * Racine des forges pour E9 : $FORGE_ROOT, sinon le parent de ce dépôt (convention du noyau).
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
const so = (regle, message) => findings.push({ regle, statut: "SANS_OBJET", message });
const NON_JUGE = [
  "qualité du contenu des mentions — une citation creuse passerait E2-E6 (revue de lecture humaine)",
  "existence des dépôts GitHub distants (réseau) — bootstrap les vérifie à l'amorçage",
  "fraîcheur des clones locaux (bootstrap --pull, boucle ⑤)",
  "E9 (TF-0319) : seul ce qui est MARQUÉ est jugé — un livrable non marqué échappe au contrôle (faux négatif ASSUMÉ, mesuré à la revue du 17/09) ; la JUSTESSE du marquage relève de la relecture ; `input\\`, `gabarits\\`, `fixtures\\`, `old\\` et `.oracles\\` sont hors jugement par motif déclaré",
  "E9 (TF-0319) : les alinéas b à e de D-15 ne sont PAS jugés — unicité de la numérotation des familles, une seule version courante par famille, graphie `old\\`, `LISEZMOI.md` de correspondance ; leur mécanisation vit chez `oracle-conventions.mjs` d'organization et reste suspendue à un mandat humain d'écriture dans ce dépôt frère (l'`output\\` du pilot lui-même est en écart sur deux d'entre eux, constat du 17/08)",
  "E9 (TF-0319) : le pilot n'est pas jugé — le périmètre est la liste FORGES du bootstrap, et le rattrapage des 7 livrables datés recensés hors d'`output\\` le 17/08 est une antériorité déclarée",
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

// E8 · verdict de non-recouvrement dans la fiche de NAISSANCE (mécanisation du point 1 de
// R-28/R-31 — reste de TF-0125, encodé le 14/08). Les 14 forges nées AVANT la règle sont
// en antériorité déclarée ; toute forge nouvelle doit porter dans sa fiche un verdict de
// non-recouvrement écrit (le mot « non-recouvrement » avec citation de l'existant).
const ANTERIORITE_R28 = new Set([
  "agents", "agents-security", "audit", "audit_nhood", "conception", "data", "design",
  "development", "observability", "ops", "organization", "seo", "tests", "websec",
]);
for (const f of forges.filter((f) => !ANTERIORITE_R28.has(f))) {
  const fiche = join(racine, "fiches", `forge-${f}.md`);
  const txt = existsSync(fiche) ? readFileSync(fiche, "utf8").toLowerCase() : "";
  txt.includes("non-recouvrement")
    ? ok("E8", `fiche forge-${f} : verdict de non-recouvrement présent (R-28.1/R-31)`)
    : ko("E8", `forge-${f} née après R-31 sans verdict de non-recouvrement écrit dans sa ` +
        "fiche — le point 1 de R-28/R-31 exige un verdict CITÉ contre le catalogue, " +
        "jamais un « n'existe pas ailleurs » implicite");
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

// ── E9 · rangement des livrables marqués, côté FORGES (TF-0319, verdict O3 du 17/08) ───────
// Miroir de la règle 2 du pilot (« tout livrable généré destiné à l'humain vit dans output\ »),
// que rien n'opposait aux dépôts de forge : le recensement du 17/08 comptait 7 livrables datés
// hors d'`output\` dans les dépôts d'écosystème, et 9 des 14 dépôts sans aucun `output\` — un
// livrable produit par l'une de ces forges n'avait, littéralement, aucun endroit prévu.
//
// La frontière se DÉCLARE, exactement comme côté produit : seul ce qui porte la marque est jugé.
// Ce qui n'est pas marqué n'est JAMAIS jugé — zéro faux positif par construction, et le verdict
// SANS_OBJET D-01 d'`oracle-conventions.mjs` (« distinguer les deux suppose de lire le CONTENU
// du dossier, pas son chemin ») est levé sans deviner le contenu d'un fichier. Le rattrapage des
// 7 livrables antérieurs est une antériorité déclarée, hors E9 (comme les 14 forges pour E8).
{
  const racineForges = process.env.FORGE_ROOT || join(racine, "..");
  const MARQUE_MD = /^destinataire\s*:\s*humain\s*$/im;
  const MARQUE_HTML = /<meta\s+name=["']destinataire["']\s+content=["']humain["']\s*\/?>/i;
  const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".claude", ".pytest_cache"]);
  /** Zones hors jugement, chacune par motif déclaré : `input\` = entrant, donc donnée qui
   *  arrive telle quelle · `gabarits\` et `fixtures\` = porteurs d'une FORME marquée, pas des
   *  livrables remis (une fixture rouge doit pouvoir violer la règle qu'elle prouve) · `old\` =
   *  archive gelée, jamais renommée · `.oracles\` = pièces de preuve d'oracle. */
  const horsJugement = (r) => /^(input|gabarits)\//i.test(r) || /(^|\/)(old|fixtures?|\.oracles)\//i.test(r);
  /** Zones de dépôt conformes : `output\` (règle 2) et `docs\` (précision D-06 — un document
   *  normatif n'est pas une sortie et vit à la racine ou dans `docs\`). */
  const zoneDeDepot = (r) => /^(output|docs)\//i.test(r);
  /** D-15 al. a : sous `output\`, les livrables vivent en familles numérotées `NN-<famille>\`. */
  const familleD15 = (r) => /^output\/\d{2}-[^\/]+\//i.test(r);
  function* fichiersForge(dossier, prof = 0) {
    if (prof > 5) return;
    let entrees;
    try { entrees = readdirSync(dossier); } catch { return; }
    for (const e of entrees) {
      if (IGNORES.has(e)) continue;
      const chemin = join(dossier, e);
      let st;
      try { st = statSync(chemin); } catch { continue; }
      if (st.isDirectory()) yield* fichiersForge(chemin, prof + 1);
      else yield chemin;
    }
  }
  const marque = (chemin) => {
    const ext = chemin.split(".").pop().toLowerCase();
    if (ext !== "md" && ext !== "html") return false;
    let t;
    try { t = readFileSync(chemin, "utf8"); } catch { return false; }
    if (ext === "html") return MARQUE_HTML.test(t.slice(0, 4096));
    const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return !!m && MARQUE_MD.test(m[1]);
  };

  let depotsVus = 0, marquesVues = 0, constats = 0;
  for (const f of forges) {
    const depot = join(racineForges, `digit-ai-forge-${f}`);
    if (!existsSync(depot)) continue; // dépôt non cloné sur ce poste : E0/bootstrap en répondent
    depotsVus++;
    const aOutput = existsSync(join(depot, "output"));
    let marquesDuDepot = 0;
    for (const chemin of fichiersForge(depot)) {
      const r = chemin.slice(depot.length + 1).replaceAll("\\", "/");
      if (horsJugement(r) || !marque(chemin)) continue;
      marquesVues++; marquesDuDepot++;
      if (!zoneDeDepot(r)) {
        ko("E9", `forge-${f} : ${r} — livrable marqué « destinataire: humain » hors de output\\ ; ` +
          "règle 2 du pilot, étendue aux dépôts de forge le 17/08 : soit le déposer sous " +
          `digit-ai-forge-${f}\\output\\<NN>-<famille>\\, soit retirer la marque s'il s'agit d'un ` +
          "document NORMATIF (doctrine, gabarit, registre — précision D-06 : racine ou docs\\)"); constats++;
      } else if (/^output\//i.test(r) && !familleD15(r)) {
        ko("E9", `forge-${f} : ${r} — livrable marqué déposé à la racine d'output\\ sans famille ` +
          "numérotée ; D-15 al. a range les livrables en familles « NN-<famille>\\ », une seule " +
          "version courante à la racine de chaque famille"); constats++;
      }
    }
    if (marquesDuDepot && !aOutput) {
      ko("E9", `forge-${f} : ${marquesDuDepot} livrable(s) marqué(s) pour l'humain, et AUCUN ` +
        `dossier output\\ dans le dépôt — le livrable n'a aucun endroit prévu (9 des 14 dépôts ` +
        "d'écosystème étaient dans ce cas au 17/08) ; créer digit-ai-forge-" + f + "\\output\\"); constats++;
    }
  }
  if (!depotsVus) so("E9", `aucun dépôt de forge trouvé sous ${racineForges} — rangement non jugeable (poste non équipé ? node bootstrap.mjs)`);
  else if (!marquesVues) so("E9", `${depotsVus} dépôt(s) de forge parcouru(s), aucun artefact marqué « destinataire: humain » — la frontière se DÉCLARE : ce qui n'est pas marqué n'est jamais jugé (TF-0319)`);
  else if (!constats) ok("E9", `${marquesVues} livrable(s) marqué(s) dans ${depotsVus} dépôt(s), tous rangés sous output\\<NN>-<famille>\\ ou docs\\`);
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
