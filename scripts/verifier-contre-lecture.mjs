#!/usr/bin/env node
/**
 * verifier-contre-lecture.mjs — une contre-lecture qui autorise un geste irréversible lit les
 * PARAMÈTRES de l'exécution qui a produit l'artefact, et les compare à la fiche (M-15, TF-1681).
 *
 * LE FAIT (lot `Produit-03 - RETOURS - 20261002e`, RA-77). Le 28/09/2026, la décision D-54 (a) fixe à
 * 11 le seuil de créations de la chaîne d'infrastructure, pour que la chaîne refuse d'elle-même un
 * plan fautif. Le 29/09 à 10h02, la relance de production tourne avec `seuilCreations` à 12. Le plan
 * comptait 11 créations : sans effet ce jour-là. Mais la contre-lecture de la session n'avait lu que
 * le plan, et rien dans la méthode ne lui demandait de comparer les paramètres saisis par
 * l'exploitant à la fiche. Relus après coup dans l'API de la chaîne : 12 pour deux exécutions, 1 et 0
 * pour les deux suivantes. Trois votes de production avaient été donnés sur cette contre-lecture.
 * La règle voisine, S55 de la restitution (TF-1493), exige qu'un feu vert dise ce qu'il ne vérifie
 * pas ; elle ne dit pas que les paramètres de lancement font partie de ce qu'on vérifie.
 *
 * CE QUI EST JUGÉ, sur chaque `DOSSIER-MEP*.md` du produit (ou sur le document passé par --document) :
 *   CL-0  un dossier qui fait voter ou approuver un PLAN (plan d'infrastructure, plan de migration,
 *         plan de production) porte une section « Contre-lecture » ;
 *   CL-1  la section porte un tableau dont chaque ligne nomme un paramètre, sa valeur À L'EXÉCUTION,
 *         l'endroit où cette valeur a été lue, et la valeur ATTENDUE avec sa référence (fiche ou
 *         décision) ;
 *   CL-2  la colonne « Concorde » dit `oui`, ou `non` suivi de ce qui a été fait de l'écart : un
 *         `non` nu laisse voter sur un écart que personne n'a tranché ;
 *   CL-3  la section porte une ligne « Non comparé : … », remplie : ce que la contre-lecture ne
 *         compare pas se publie, comme S55 l'exige du feu vert.
 *
 * LA FORME LUE (ETAPE-MEP.md § 3 duodecies) : un titre qui nomme la contre-lecture, puis
 *
 *   | Paramètre | Valeur à l'exécution | Lue où | Valeur attendue | Référence | Concorde |
 *
 * et une ligne « Non comparé : <ce que la contre-lecture ne lit pas> ».
 *
 * Usage : node scripts/verifier-contre-lecture.mjs <produit> [--document <fichier.md>]
 * Sortie : JSON · exit 0 = contre-lecture complète · 1 = au moins un refus (CL-0 à CL-3) ·
 *          2 = rien à juger (aucun dossier de MEP, ou aucun plan voté ni aucune contre-lecture).
 */
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const NON_JUGE = [
  "la VÉRITÉ des valeurs recopiées : le contrôle lit que la valeur à l'exécution, sa source et la valeur attendue sont écrites, il ne relit pas l'API de la chaîne",
  "la COMPLÉTUDE de la liste des paramètres : un paramètre de lancement absent du tableau n'est pas vu, c'est la ligne « Non comparé » qui doit le dire",
  "un vote de plan raconté en d'autres mots que « vote », « voter », « approbation », « approuver » à côté de « plan » : CL-0 ne se déclenche pas, et le dossier qui porte une section de contre-lecture reste jugé par CL-1 à CL-3",
  "les documents d'exploitation hors `DOSSIER-MEP*.md` (procédure de mise en production, guide de l'exploitant) : ils se jugent par `--document`, le parcours ne les lit pas",
];

const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input", "old"]);
const NORMALISER = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Les dossiers de MEP d'un produit, sur quatre niveaux, comme `verifier-portes-du-jour`. */
function dossiersMep(racine) {
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!IGNORES.has(e.name) && reste > 0) marcher(p, reste - 1); }
      else if (e.isFile() && /^DOSSIER-MEP.*\.md$/i.test(e.name)) out.push(p);
    }
  };
  marcher(racine, 4);
  return out;
}

/** Un plan voté ou approuvé : le mot du vote et le mot « plan » dans la même ligne, à moins de 80 caractères. */
export const PLAN_VOTE = /\b(?:vote|votes|voter|vote[sr]?|approbation|approuver|approuve[es]?)\b[^\n|]{0,80}\bplans?\b|\bplans?\b[^\n|]{0,80}\b(?:vote|votes|voter|approbation|approuver|approuve[es]?)\b/;

/** La section de contre-lecture : `{ titre, texte, ligne }` ou null. */
export function sectionContreLecture(texte) {
  const lignes = String(texte).replace(/\r\n/g, "\n").split("\n");
  const debut = lignes.findIndex((l) => /^#{2,4}\s/.test(l) && /contre[- ]lecture/.test(NORMALISER(l)));
  if (debut < 0) return null;
  const niveau = /^(#+)/.exec(lignes[debut])[1].length;
  let fin = lignes.length;
  for (let i = debut + 1; i < lignes.length; i++) {
    const m = /^(#+)\s/.exec(lignes[i]);
    if (m && m[1].length <= niveau) { fin = i; break; }
  }
  return { titre: lignes[debut], texte: lignes.slice(debut + 1, fin).join("\n"), ligne: debut + 1 };
}

const VIDE = (v) => !v || /^[-–—?\s]*$/.test(v) || /^\{.*\}$/.test(v.trim());

export function jugerTexte(texte, nom) {
  const findings = [];
  const mesure = { parametres: 0, ecarts_traites: 0 };
  const refus = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
  const norm = NORMALISER(texte);
  const vote = PLAN_VOTE.exec(norm);
  const s = sectionContreLecture(texte);
  if (!s) {
    if (vote) refus("CL-0", nom, `le dossier fait voter ou approuver un plan (« ${vote[0].slice(0, 70)} ») et ne porte aucune section « Contre-lecture » — `
      + "le 29/09/2026, trois votes de production ont été donnés sur la lecture du seul plan, avec un paramètre de lancement à 12 quand la décision disait 11");
    return { findings, mesure, aJuger: Boolean(vote) };
  }
  if (vote) ok("CL-0", nom, "plan voté, section de contre-lecture présente");
  const ou = `${nom}:${s.ligne}`;
  // CL-1 — le tableau des paramètres.
  const rangs = s.texte.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const cellules = (l) => l.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  const entete = rangs.length ? cellules(rangs[0]).map(NORMALISER) : [];
  const col = (motif) => entete.findIndex((c) => motif.test(c));
  const iParam = col(/parametre/), iExec = col(/execution|lancement|saisie/), iLu = col(/lue? ou|source/),
    iAttendu = col(/attendue?|fiche|decision/), iRef = col(/reference/), iConcorde = col(/concorde|ecart/);
  const manquantes = [iParam < 0 && "Paramètre", iExec < 0 && "Valeur à l'exécution", iLu < 0 && "Lue où",
    iAttendu < 0 && "Valeur attendue", iConcorde < 0 && "Concorde"].filter(Boolean);
  const donnees = rangs.slice(1).filter((l) => !/^\|[\s:|-]+\|?\s*$/.test(l)).map(cellules);
  if (!rangs.length) refus("CL-1", ou, "la contre-lecture ne porte aucun tableau de paramètres — elle lit l'artefact, jamais ce qui l'a produit");
  else if (manquantes.length) refus("CL-1", ou, `colonne(s) absente(s) : ${manquantes.join(", ")} — la forme est celle d'ETAPE-MEP.md § 3 duodecies`);
  else if (!donnees.length) refus("CL-1", ou, "tableau des paramètres sans aucune ligne");
  else {
    mesure.parametres = donnees.length;
    const incompletes = donnees.filter((c) => VIDE(c[iParam]) || VIDE(c[iExec]) || VIDE(c[iLu]) || VIDE(c[iAttendu]) || (iRef >= 0 && VIDE(c[iRef])));
    incompletes.length
      ? refus("CL-1", ou, `${incompletes.length} paramètre(s) sans sa valeur à l'exécution, sa source ou sa valeur attendue : « ${(incompletes[0][iParam] || "?").slice(0, 60)} »`)
      : ok("CL-1", ou, `${donnees.length} paramètre(s) lus à l'exécution et confrontés à leur valeur attendue`);
    // CL-2 — la concordance tranchée.
    const nus = [];
    for (const c of donnees) {
      const v = NORMALISER(c[iConcorde] || "").trim();
      if (/^oui\b/.test(v)) continue;
      if (/^non\b/.test(v) && v.replace(/^non\b[\s,;:—–-]*/, "").split(/\s+/).filter(Boolean).length >= 3) { mesure.ecarts_traites++; continue; }
      nus.push(c);
    }
    nus.length
      ? refus("CL-2", ou, `${nus.length} ligne(s) dont la concordance n'est ni « oui » ni « non » suivi de ce qui a été fait de l'écart : « ${(nus[0][iParam] || "?").slice(0, 60)} » (${(nus[0][iConcorde] || "vide").slice(0, 30)})`)
      : ok("CL-2", ou, `concordance tranchée sur chaque ligne${mesure.ecarts_traites ? `, ${mesure.ecarts_traites} écart(s) traité(s)` : ""}`);
  }
  // CL-3 — ce qui n'est pas comparé se publie.
  const nc = /^\s*[-*]?\s*\**\s*non compar[ée]s?\s*\**\s*:\s*(.*)$/im.exec(s.texte);
  !nc || nc[1].trim().split(/\s+/).filter(Boolean).length < 3
    ? refus("CL-3", ou, "aucune ligne « Non comparé : … » remplie — ce que la contre-lecture ne compare pas se lit sinon comme une absence de limite (S55, TF-1493)")
    : ok("CL-3", ou, "ce que la contre-lecture ne compare pas est publié");
  return { findings, mesure, aJuger: true };
}

export function juger(racine, { document = null } = {}) {
  const fichiers = document ? [document] : dossiersMep(racine);
  const findings = [];
  const mesure = { dossiers: fichiers.length, parametres: 0, ecarts_traites: 0, refus: 0 };
  let aJuger = false;
  for (const f of fichiers) {
    let texte = "";
    try { texte = readFileSync(f, "utf8"); } catch { continue; }
    const nom = document ? basename(f) : relative(racine, f).split("\\").join("/");
    const r = jugerTexte(texte, nom);
    findings.push(...r.findings);
    mesure.parametres += r.mesure.parametres;
    mesure.ecarts_traites += r.mesure.ecarts_traites;
    aJuger = aJuger || r.aJuger;
  }
  mesure.refus = findings.filter((x) => x.statut === "FAIL").length;
  const motif = !fichiers.length ? "aucun DOSSIER-MEP.md sous ce produit : l'étape de mise en production n'a pas été atteinte"
    : !aJuger ? "M-15 sans objet : aucun dossier ne fait voter un plan, et aucun ne porte de contre-lecture" : null;
  return { findings, mesure, rienAJuger: !aJuger, motif };
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "contre-lecture-"));
  const casse = [];
  const cas = [];
  const SECTION = (lignes, nonCompare = "Non comparé : les variables de la bibliothèque de la chaîne, que l'exécution ne publie pas.") =>
    "## Contre-lecture du plan\n\n| Paramètre | Valeur à l'exécution | Lue où | Valeur attendue | Référence | Concorde |\n|---|---|---|---|---|---|\n"
    + lignes.join("\n") + `\n\n${nonCompare}\n`;
  const BONNE = "| seuilCreations | 11 | API de la chaîne, exécution 15452 | 11 | décision D-54 (a) | oui |";
  const ECART = "| seuilCreations | 12 | API de la chaîne, exécution 15452 | 11 | décision D-54 (a) | non |";
  const ECART_TRAITE = "| seuilCreations | 12 | API de la chaîne, exécution 15452 | 11 | décision D-54 (a) | non — exécution annulée, relancée à 11 |";
  const VOTE = "# Dossier de MEP\n\nLe plan d'infrastructure est soumis au vote de l'exploitant avant application.\n\n";
  const produit = (nom, contenu) => {
    const r = join(dir, nom);
    mkdirSync(join(r, "forge"), { recursive: true });
    if (contenu !== null) writeFileSync(join(r, "forge", "DOSSIER-MEP.md"), contenu, "utf8");
    return r;
  };
  const attendre = (nom, contenu, regle, statut, exitAttendu) => {
    const r = juger(produit(`cas-${cas.length + 1}`, contenu));
    const f = r.findings.filter((x) => x.regle === regle);
    const vu = regle === "-" ? (r.rienAJuger ? "SANS_OBJET" : "JUGE") : f.length ? f[0].statut : "AUCUN";
    const exit = r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0;
    const ok = vu === statut && exit === exitAttendu;
    cas.push({ nom, ok });
    if (!ok) casse.push(`${nom} : ${regle} ${vu}, attendu ${statut} ; exit ${exit}, attendu ${exitAttendu}`);
  };
  attendre("vert : plan voté, paramètres lus et concordants, non-comparé publié", VOTE + SECTION([BONNE]), "CL-1", "PASS", 0);
  attendre("vert : écart trouvé et traité", VOTE + SECTION([ECART_TRAITE]), "CL-2", "PASS", 0);
  attendre("rouge : plan voté sans contre-lecture, le cas du 29/09/2026", VOTE + "Le plan compte 11 créations.\n", "CL-0", "FAIL", 1);
  attendre("rouge : contre-lecture qui ne lit pas la valeur à l'exécution", VOTE + SECTION(["| seuilCreations | — | — | 11 | décision D-54 (a) | oui |"]), "CL-1", "FAIL", 1);
  attendre("rouge : contre-lecture sans tableau de paramètres", VOTE + "## Contre-lecture\n\nLe plan a été lu : 11 créations.\n\nNon comparé : rien d'autre que le plan lui-même.\n", "CL-1", "FAIL", 1);
  attendre("rouge : écart laissé à « non » sans suite", VOTE + SECTION([ECART]), "CL-2", "FAIL", 1);
  attendre("rouge : rien n'est dit de ce qui n'est pas comparé", VOTE + SECTION([BONNE], ""), "CL-3", "FAIL", 1);
  attendre("sans objet : dossier sans plan voté ni contre-lecture", "# Dossier de MEP\n\nDéploiement par la chaîne, sans plan soumis.\n", "-", "SANS_OBJET", 2);
  attendre("sans objet : produit sans dossier de MEP", null, "-", "SANS_OBJET", 2);
  rmSync(dir, { recursive: true, force: true });
  for (const c of cas) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.nom}`);
  console.log(casse.length ? `\nSELF-TEST FAIL : ${casse.join(" · ")}`
    : `\nverifier-contre-lecture self-test : ${cas.length}/${cas.length} PASS (recette à double sens : 2 verts, 5 rouges, 2 sans objet)`);
  process.exit(casse.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const document = valeur("--document");
  const racine = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--document")[0] || process.cwd();
  if (!existsSync(racine) || !statSync(racine).isDirectory() || (document && !existsSync(document))) {
    process.stdout.write(JSON.stringify({ outil: "verifier-contre-lecture", verdict: "NON_JUGEABLE", message: `produit ou document introuvable : ${document || racine}` }) + "\n");
    process.exit(2);
  }
  const r = juger(racine, { document });
  const verdict = r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS";
  process.stdout.write(JSON.stringify({ outil: "verifier-contre-lecture", version: "1.0.0", regle: "M-15 (ETAPE-MEP.md § 3 duodecies, TF-1681)",
    produit: racine, verdict, motif: r.motif || undefined, mesure: r.mesure, findings: r.findings, non_juge: NON_JUGE }, null, 1) + "\n");
  process.exit(r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
}
