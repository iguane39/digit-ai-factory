#!/usr/bin/env node
/**
 * verifier-portes-du-jour.mjs — un feu vert de lancement repose sur des portes REJOUÉES LE JOUR DU
 * LANCEMENT dès qu'elles jugent une base externe (M-10, TF-1498 ; 01/10/2026).
 *
 * LE FAIT. Le 30/09/2026, chez Produit-03, le feu vert remis à l'exploitant reposait sur les
 * contrôles de la veille. Trois avis de sécurité sur une dépendance avaient été publiés dans la
 * nuit, entre 23h44 et 23h45 UTC. Le même fichier de verrouillage, vert en qualification le 29/09, a
 * été refusé en production par `npm audit --audit-level=high`, et le lancement de l'exploitant a été
 * perdu. Rejouées le matin sur le commit à lancer, les deux portes prenaient moins de 5 minutes.
 * Une porte qui juge une base externe rend un verdict sur l'état du monde, et ce monde change sans
 * commit : son verdict d'hier ne dit rien du lancement d'aujourd'hui.
 *
 * CE QUI EST JUGÉ, sur chaque `DOSSIER-MEP*.md` du produit (ou sur le document passé par --document) :
 *   PJ-0  la section du feu vert DÉCLARE la date du lancement et l'objet lancé ;
 *   PJ-1  chaque porte à base externe que la CHAÎNE du produit joue figure au tableau du feu vert ;
 *   PJ-2  chaque porte à base externe du tableau est datée du JOUR du lancement ;
 *   PJ-3  et l'objet qu'elle a jugé est l'objet lancé, nommé : « idem » ou « même commit » ne
 *         nomment rien.
 * Un lancement qui glisse au lendemain se rejuge avec `--lancement AAAA-MM-JJ` : la date déclarée
 * au dossier ne couvre que le jour qu'elle nomme.
 *
 * LA FORME LUE (ETAPE-MEP.md § 3 nonies) : une section dont le titre nomme le feu vert ou les portes
 * du jour, une ligne « Lancement : AAAA-MM-JJ · Objet lancé : <commit, étiquette ou empreinte> »,
 * puis un tableau dont une colonne date le rejeu et une autre nomme l'objet jugé.
 *
 * Usage : node scripts/verifier-portes-du-jour.mjs <produit> [--document <fichier.md>] [--lancement AAAA-MM-JJ]
 * Sortie : JSON · exit 0 = feu vert à jour · 1 = au moins un refus (PJ-0 à PJ-3) ·
 *          2 = rien à juger (aucun dossier de MEP, ou aucune porte à base externe ni dans la chaîne
 *          ni au dossier).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const NON_JUGE = [
  "l'HEURE du rejeu : une base qui change entre le rejeu du matin et un lancement du soir n'est pas vue ; la règle est le jour du lancement, comme la demande",
  "la JUSTESSE du verdict recopié au tableau : le contrôle lit la date et l'objet de chaque porte, il ne rejoue aucune porte",
  "une porte que la chaîne appelle sans la nommer (script shell, gabarit d'un autre dépôt) : elle n'est pas relevée, et un gabarit externe est signalé quand la chaîne en déclare un",
  "un script de package.json qui nomme une porte est compté comme porte de la chaîne, même si la chaîne ne l'appelle pas : le rejouer coûte moins que de prouver qu'il ne sert pas",
  "les étapes qui résolvent contre un dépôt de paquets sans rien juger (installation, construction d'image) : elles se rejouent par la construction de l'objet lancé, que PJ-3 exige",
];

// LES PORTES QUI JUGENT UNE BASE EXTERNE. C'est une DONNÉE, et elle grossira : chaque écosystème a
// son outil d'audit, et un outil de plus s'ajoute ici sans toucher aux règles. Chaque entrée nomme
// la base que la porte interroge, celle qui change sans commit.
const PORTES = [
  { famille: "npm audit", base: "avis de sécurité du registre npm", motif: /\b(?:npm|pnpm)\s+audit\b|\byarn\s+(?:npm\s+)?audit\b/i },
  { famille: "pip-audit", base: "avis de sécurité PyPI et OSV", motif: /\bpip-audit\b/i },
  { famille: "safety", base: "base d'avis Safety", motif: /\bsafety\s+(?:check|scan)\b/i },
  { famille: "osv-scanner", base: "base OSV", motif: /\bosv-scanner\b/i },
  { famille: "trivy", base: "base de vulnérabilités Trivy", motif: /\btrivy\b/i },
  { famille: "grype", base: "base de vulnérabilités Grype", motif: /\bgrype\b/i },
  { famille: "snyk", base: "base de vulnérabilités Snyk", motif: /\bsnyk\s+(?:test|container|monitor|iac)\b/i },
  { famille: "cargo audit", base: "base RustSec", motif: /\bcargo\s+audit\b/i },
  { famille: "bundler-audit", base: "base ruby-advisory-db", motif: /\bbundler-audit\b|\bbundle\s+audit\b/i },
  { famille: "govulncheck", base: "base de vulnérabilités Go", motif: /\bgovulncheck\b/i },
  { famille: "composer audit", base: "avis de sécurité Packagist", motif: /\bcomposer\s+audit\b/i },
  { famille: "dotnet --vulnerable", base: "avis de sécurité NuGet", motif: /\bdotnet\s+list\b[^\n|]*--vulnerable\b/i },
  { famille: "dependency-check", base: "base NVD", motif: /\bdependency-check\b/i },
  { famille: "docker scout", base: "base Docker Scout", motif: /\bdocker\s+scout\s+(?:cves|quickview|recommendations)\b/i },
];
const famillesDe = (texte) => PORTES.filter((p) => p.motif.test(texte));

// LES DÉFINITIONS DE CHAÎNE USUELLES, chemin relatif au produit. Une DONNÉE aussi.
const EST_CHAINE = (rel) => /^\.github\/workflows\/[^/]+\.ya?ml$/i.test(rel)
  || /(^|\/)azure-pipelines[^/]*\.ya?ml$/i.test(rel)
  || /^(\.azure-pipelines|\.azuredevops|\.pipelines|pipelines|ci)\/.+\.ya?ml$/i.test(rel)
  || /(^|\/)\.gitlab-ci\.ya?ml$/i.test(rel)
  || /(^|\/)bitbucket-pipelines\.ya?ml$/i.test(rel)
  || /(^|\/)Jenkinsfile$/.test(rel)
  || /(^|\/)cloudbuild[^/]*\.ya?ml$/i.test(rel)
  || /^\.circleci\/config\.ya?ml$/i.test(rel);
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input"]);

function parcourir(racine, profondeur, garder) {
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        // Les dossiers cachés sont parcourus : `.github`, `.azure-pipelines` en sont.
        if (!IGNORES.has(e.name) && reste > 0) marcher(p, reste - 1);
      } else if (e.isFile()) {
        const rel = relative(racine, p).split("\\").join("/");
        if (garder(rel, e.name)) out.push({ chemin: p, rel });
      }
    }
  };
  marcher(racine, profondeur);
  return out;
}

/** Les portes à base externe que la chaîne du produit joue : `[{ famille, ou }]`, et les gabarits externes. */
function portesDeLaChaine(racine) {
  const portes = [];
  const gabaritsExternes = [];
  for (const { chemin, rel } of parcourir(racine, 4, (r) => EST_CHAINE(r))) {
    let texte = "";
    try { texte = readFileSync(chemin, "utf8"); } catch { continue; }
    const lignes = texte.split(/\r?\n/);
    lignes.forEach((l, i) => {
      // Un COMMENTAIRE ne joue rien : « # npm audit désactivé » n'est pas une porte.
      if (/^\s*(#|\/\/)/.test(l)) return;
      for (const p of famillesDe(l)) portes.push({ famille: p.famille, base: p.base, ou: `${rel}:${i + 1}` });
      // Un gabarit tiré d'un AUTRE dépôt porte peut-être des portes que ce relevé ne lit pas.
      if (/^\s*-?\s*(?:template|extends)\s*:\s*\S+@\S+/.test(l) || /^\s*-?\s*uses\s*:\s*[\w.-]+\/[\w.-]+\/\.github\/workflows\//.test(l)) {
        gabaritsExternes.push(`${rel}:${i + 1} « ${l.trim().slice(0, 90)} »`);
      }
    });
  }
  for (const { chemin, rel } of parcourir(racine, 2, (r, nom) => nom === "package.json")) {
    let j = null;
    try { j = JSON.parse(readFileSync(chemin, "utf8")); } catch { continue; }
    for (const [nom, commande] of Object.entries((j && j.scripts) || {})) {
      if (typeof commande !== "string") continue;
      for (const p of famillesDe(commande)) portes.push({ famille: p.famille, base: p.base, ou: `${rel} › scripts.${nom}` });
    }
  }
  return { portes, gabaritsExternes };
}

/** Les dossiers de MEP d'un produit, sur quatre niveaux, comme `oracle-trace-mutation-mep`. */
const dossiersMep = (racine) => parcourir(racine, 4, (r, nom) => /^DOSSIER-MEP.*\.md$/i.test(nom)).map((d) => d.chemin);

/** La première date d'un texte, ISO ou française, rendue en AAAA-MM-JJ ; `null` sans date. */
export function dateDe(texte) {
  const iso = /\b(20\d{2})-(\d{2})-(\d{2})\b/.exec(texte);
  const fr = /\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/.exec(texte);
  const candidats = [];
  if (iso) candidats.push({ index: iso.index, valeur: `${iso[1]}-${iso[2]}-${iso[3]}` });
  if (fr) candidats.push({ index: fr.index, valeur: `${fr[3]}-${fr[2].padStart(2, "0")}-${fr[1].padStart(2, "0")}` });
  candidats.sort((a, b) => a.index - b.index);
  return candidats.length ? candidats[0].valeur : null;
}

const SHA = /\b[0-9a-f]{7,40}\b/gi;
/** L'objet d'une ligne est-il l'objet lancé ? Un commit se compare par préfixe, le reste littéralement. */
export function memeObjet(lance, texte) {
  const l = String(lance).toLowerCase();
  const t = String(texte).toLowerCase();
  if (/^[0-9a-f]{7,40}$/.test(l)) return (t.match(SHA) || []).some((s) => s.startsWith(l) || l.startsWith(s));
  return t.includes(l);
}

// Une cellule se coupe sur les barres verticales NON échappées : `2>/dev/null \|\| true` reste entier.
const cellules = (l) => l.trim().replace(/^\|/, "").replace(/(?<!\\)\|\s*$/, "").split(/(?<!\\)\|/).map((c) => c.trim());
const EST_SEPARATEUR = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

/** Les sections du feu vert : un titre qui nomme le feu vert ou les portes du jour, à défaut le lancement. */
function sectionsFeuVert(texte) {
  const lignes = texte.split(/\r?\n/);
  const titres = [];
  let dansCode = false;
  lignes.forEach((l, i) => {
    if (/^\s*```/.test(l)) { dansCode = !dansCode; return; }
    if (dansCode) return;
    const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(l);
    if (m) titres.push({ i, niveau: m[1].length, texte: m[2] });
  });
  const prendre = (motif) => titres.filter((t) => motif.test(t.texte)).map((t) => {
    const fin = titres.find((u) => u.i > t.i && u.niveau <= t.niveau);
    return { titre: t.texte, debut: t.i, lignes: lignes.slice(t.i + 1, fin ? fin.i : lignes.length) };
  });
  const fortes = prendre(/feu\s+vert|portes?\s+du\s+jour/i);
  return fortes.length ? fortes : prendre(/lancement/i);
}

/** Les lignes de tableau d'une section : `[{ cellules, brut, numero, iDate, iObjet, iPorte }]`. */
function rangsDe(section) {
  const rangs = [];
  const L = section.lignes;
  for (let i = 0; i + 1 < L.length; i++) {
    if (!/\|/.test(L[i]) || !EST_SEPARATEUR.test(L[i + 1])) continue;
    const entete = cellules(L[i]);
    const col = (motif) => entete.findIndex((c) => motif.test(c));
    const iDate = col(/rejou|date|\ble\s*$/i);
    const iObjet = col(/objet|commit|image|artefact/i);
    const iPorte = col(/porte|contr[ôo]le|commande/i);
    let j = i + 2;
    for (; j < L.length && /\|/.test(L[j]) && L[j].trim(); j++) {
      rangs.push({ cellules: cellules(L[j]), brut: L[j], numero: section.debut + 2 + j, iDate, iObjet, iPorte });
    }
    i = j;
  }
  return rangs;
}

export function juger(racine, { document = null, lancementForce = null } = {}) {
  const findings = [];
  const refus = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const { portes: chaine, gabaritsExternes } = portesDeLaChaine(racine);
  const dossiers = document ? [document] : dossiersMep(racine);
  const mesure = { dossiers: dossiers.length, portes_chaine: chaine.length, portes_feu_vert: 0, refus: 0 };
  if (gabaritsExternes.length) {
    findings.push({ regle: "PJ-1", statut: "NON_JUGE", ou: racine, message: `la chaîne s'appuie sur ${gabaritsExternes.length} gabarit(s) d'un autre dépôt, `
      + `dont les portes ne sont pas lues ici : ${gabaritsExternes.slice(0, 3).join(" · ")}. Le feu vert les nomme de lui-même.` });
  }
  if (!dossiers.length) return { findings, mesure, rienAJuger: true, motif: "aucun DOSSIER-MEP.md sous ce produit : l'étape de mise en production n'a pas été atteinte" };

  let rangsTous = 0;
  let lancementRetenu = lancementForce;
  for (const chemin of dossiers) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); }
    catch (e) { refus("PJ-0", chemin, `dossier illisible (${e.code || e.message}) — un feu vert qu'on ne peut pas lire ne prouve rien`); continue; }
    const nom = relative(racine, chemin).split("\\").join("/") || chemin;
    const sections = sectionsFeuVert(texte);
    const rangs = sections.flatMap(rangsDe).map((r) => ({ ...r, familles: famillesDe(r.iPorte >= 0 ? r.cellules[r.iPorte] || "" : r.brut) }))
      .map((r) => (r.familles.length ? r : { ...r, familles: famillesDe(r.brut) }))
      .filter((r) => r.familles.length);
    rangsTous += rangs.length;
    if (!chaine.length && !rangs.length) continue;

    // PJ-0 — la section existe, et elle dit QUAND et QUOI.
    if (!sections.length) {
      refus("PJ-0", nom, `aucune section de feu vert de lancement, alors que la chaîne joue ${chaine.length} porte(s) à base externe — `
        + "un feu vert sans tableau des portes du jour repose sur le verdict de la qualification (ETAPE-MEP.md M-10)");
    }
    // Le titre compte : « Feu vert de lancement du 30/09/2026 » déclare sa date.
    const corps = sections.flatMap((s) => [s.titre, ...s.lignes]).filter((l) => !/^\s*\|/.test(l)).join("\n");
    const mDate = /lancement[^|\n]{0,60}?((?:20\d{2}-\d{2}-\d{2})|(?:\d{1,2}\/\d{1,2}\/20\d{2}))/i.exec(corps);
    const dateDeclaree = mDate ? dateDe(mDate[1]) : null;
    const mObjet = /objet\s+lanc[ée]e?\s*:?\s*`?([^\s`·|,;()]+)/i.exec(corps);
    const objetLance = mObjet ? mObjet[1] : null;
    const lancement = lancementForce || dateDeclaree;
    if (!lancementRetenu && lancement) lancementRetenu = lancement;
    if (sections.length && !lancement) {
      refus("PJ-0", nom, "le feu vert ne déclare pas la date du lancement (« Lancement : AAAA-MM-JJ ») — sans elle, l'âge des portes ne se juge pas");
    }
    if (sections.length && !objetLance) {
      refus("PJ-0", nom, "le feu vert ne nomme pas l'objet lancé (« Objet lancé : <commit, étiquette ou empreinte> ») — sans lui, rien ne dit que les portes ont jugé ce qui part en production");
    }

    // PJ-1 — chaque porte de la chaîne figure au tableau.
    const presentes = new Set(rangs.flatMap((r) => r.familles.map((f) => f.famille)));
    const vues = new Set();
    for (const p of chaine) {
      if (presentes.has(p.famille) || vues.has(p.famille)) continue;
      vues.add(p.famille);
      const ou = chaine.filter((q) => q.famille === p.famille).map((q) => q.ou);
      refus("PJ-1", nom, `porte de la chaîne ABSENTE du feu vert : ${p.famille} (${p.base}), jouée par ${ou.slice(0, 3).join(", ")}`
        + `${ou.length > 3 ? ", …" : ""} — elle se rejoue le jour du lancement et sa sortie datée entre au tableau`);
    }

    // PJ-2 et PJ-3 — chaque porte du tableau est du jour, et porte sur l'objet lancé.
    for (const r of rangs) {
      mesure.portes_feu_vert++;
      const famille = r.familles.map((f) => f.famille).join(" + ");
      const ou = `${nom}:${r.numero}`;
      const date = dateDe(r.iDate >= 0 ? r.cellules[r.iDate] || "" : r.brut);
      if (!date) refus("PJ-2", ou, `porte ${famille} NON DATÉE — un verdict sans date ne dit pas s'il précède les avis publiés dans la nuit`);
      else if (lancement && date !== lancement) {
        refus("PJ-2", ou, `porte ${famille} rejouée le ${date}, lancement le ${lancement} : `
          + (date < lancement ? "le verdict PRÉCÈDE le jour du lancement, et la base externe a pu changer depuis (le 30/09/2026, 3 avis publiés dans la nuit ont arrêté une livraison verte la veille). Rejouer la porte le jour même, sur l'objet lancé"
            : "le verdict est daté APRÈS le lancement déclaré — la date du lancement ou celle du rejeu est fausse"));
      }
      if (objetLance) {
        const cellule = r.iObjet >= 0 ? r.cellules[r.iObjet] || "" : r.brut;
        if (!memeObjet(objetLance, cellule)) {
          refus("PJ-3", ou, `porte ${famille} : l'objet jugé (« ${cellule.slice(0, 60)} ») n'est pas l'objet lancé (${objetLance}) — `
            + "une porte rejouée sur un autre commit, ou nommée « idem », ne juge pas ce qui part en production");
        }
      }
    }
  }
  mesure.refus = findings.filter((f) => f.statut === "FAIL").length;
  const rienAJuger = !chaine.length && !rangsTous;
  return { findings, mesure, rienAJuger, lancement: lancementRetenu,
    motif: rienAJuger ? "M-10 sans objet : la chaîne ne joue aucune porte à base externe, et le dossier n'en cite aucune" : null };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const document = valeur("--document");
  const lancementForce = valeur("--lancement");
  const racine = args.filter((a, i) => !a.startsWith("--") && !["--document", "--lancement"].includes(args[i - 1]))[0] || process.cwd();
  if (lancementForce && !/^20\d{2}-\d{2}-\d{2}$/.test(lancementForce)) {
    process.stdout.write(JSON.stringify({ outil: "verifier-portes-du-jour", verdict: "NON_JUGEABLE", message: `--lancement attend AAAA-MM-JJ, reçu « ${lancementForce} »` }) + "\n");
    process.exit(2);
  }
  if (!existsSync(racine) || !statSync(racine).isDirectory() || (document && !existsSync(document))) {
    process.stdout.write(JSON.stringify({ outil: "verifier-portes-du-jour", verdict: "NON_JUGEABLE", message: `produit ou document introuvable : ${document || racine}` }) + "\n");
    process.exit(2);
  }
  const r = juger(racine, { document, lancementForce });
  const verdict = r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS";
  process.stdout.write(JSON.stringify({ outil: "verifier-portes-du-jour", version: "1.0.0", regle: "M-10 (ETAPE-MEP.md § 3 nonies, TF-1498)",
    produit: racine, lancement: r.lancement || null, verdict, motif: r.motif || undefined, mesure: r.mesure, findings: r.findings, non_juge: NON_JUGE }, null, 1) + "\n");
  process.exit(r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
}
