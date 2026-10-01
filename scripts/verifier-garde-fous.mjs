#!/usr/bin/env node
/**
 * verifier-garde-fous.mjs — un déploiement se conçoit APRÈS avoir relevé les garde-fous de la
 * plateforme et relu les contraintes déjà connues du produit (M-11, TF-1495 et TF-1496 ; 01/10/2026).
 *
 * LE FAIT. Le 29/09/2026, la première livraison de production de Produit-03 est refusée par une
 * stratégie Deny de la souscription, posée le 03/07 : une Web App ne s'écrit pas authentification
 * désactivée. L'amorçage avait été conçu le 21/09 « sans authentification au premier passage », sans
 * qu'aucune étape n'interroge les stratégies de la portée cible. La contrainte était pourtant connue
 * deux fois : écrite le 23/07 dans un commentaire « Obligatoire ici » du fichier de variables de
 * qualification, et décrite par l'humain le 21/09 comme la pratique de son organisation. Un produit
 * voisin l'avait heurtée le 31/08. Rien ne l'a portée jusqu'à la conception suivante.
 *
 * DEUX MODES.
 *   --registre [fichier]  juge le registre de la factory (`references/GARDE-FOUS-PLATEFORME.json`) :
 *     GR-1  chaque entrée porte ses champs, ses dates et sa source (un lot de retours) ;
 *     GR-2  aucun identifiant ni chemin de souscription dans un dépôt PUBLIC, client et produits
 *           sous pseudonyme ;
 *     GR-3  les identifiants d'entrée sont uniques.
 *   <produit> [--document <fichier.md>]  juge la section des garde-fous de chaque `DOSSIER-MEP*.md` :
 *     GF-1  si le produit déploie sur Azure, la section porte le relevé DATÉ des stratégies de la
 *           portée cible (`az policy assignment list`, ou l'API `checkPolicyRestrictions`) ;
 *     GF-2  chaque commentaire « Obligatoire ici » des fichiers d'environnement du produit est cité
 *           à la section, par son identifiant GF-nn ou par son fichier : une contrainte apprise dans
 *           un environnement vaut pour la portée entière, jusqu'à preuve du contraire ;
 *     GF-3  la section dit avoir lu le registre de la factory (son nom, ou un identifiant GFP-nnn) ;
 *     GF-4  une contrainte que l'humain a décrite se cite avec SES mots, entre guillemets.
 *
 * NON JUGÉ : voir `NON_JUGE` ci-dessous, rendu dans chaque sortie.
 *
 * Usage : node scripts/verifier-garde-fous.mjs <produit> [--document <fichier.md>]
 *         node scripts/verifier-garde-fous.mjs --registre [<registre.json>]
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = rien à juger (aucun dossier de MEP,
 *          ou ni cible Azure, ni contrainte connue, ni section de garde-fous).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const REGISTRE = join(ICI, "..", "references", "GARDE-FOUS-PLATEFORME.json");
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input", ".terraform"]);

const NON_JUGE = [
  "la JUSTESSE d'un verdict écrit au tableau : le contrôle vérifie que chaque garde-fou est cité et que le relevé est daté, il ne rejoue pas le relevé et ne confronte pas la séquence",
  "les plateformes autres qu'Azure : leurs mécanismes de stratégie ne sont pas relevés ici, faute d'une commande vérifiée à leur source officielle",
  "une contrainte connue écrite sous une autre forme que « Obligatoire ici » (décision, fiche, message) : la forme prescrite est celle que le contrôle lit",
  "la COMPLÉTUDE de la lecture du registre : un produit ne connaît pas son pseudonyme, le contrôle vérifie qu'il dit l'avoir lu, pas qu'il en a cité toutes les entrées de son client",
  "qu'une option impossible ait été écartée de la décision humaine : les options vivent dans la restitution, que ce contrôle ne lit pas",
];

function parcourir(racine, profondeur, garder) {
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!IGNORES.has(e.name) && reste > 0) marcher(p, reste - 1); }
      else if (e.isFile()) {
        const rel = relative(racine, p).split("\\").join("/");
        if (garder(rel, e.name)) out.push({ chemin: p, rel });
      }
    }
  };
  marcher(racine, profondeur);
  return out;
}
const lire = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

// LES SIGNES D'UNE CIBLE AZURE, lus dans le code d'infrastructure et la chaîne. Une DONNÉE.
const FICHIER_D_ENVIRONNEMENT = /\.(tf|tfvars|bicep|bicepparam|ya?ml|sh|ps1|psm1|env\.example|hcl)$|(^|\/)Dockerfile$/i;
const SIGNE_AZURE = [
  { fichier: /\.(tf|tfvars|hcl)$/i, motif: /\bazurerm\b|\bazapi\b/ },
  { fichier: /\.(ya?ml)$/i, motif: /\bAzure(?:WebApp|CLI|RmWebAppDeployment|ResourceManagerTemplateDeployment|FunctionApp|ContainerApps|PowerShell)@\d/ },
  { fichier: /\.(sh|ps1|psm1|ya?ml)$/i, motif: /^\s*(?:-\s*)?(?:script:\s*)?az\s+(?:group|webapp|ad|role|deployment|resource|policy|containerapp|functionapp|keyvault)\b/m },
];
function cibleAzure(racine) {
  for (const { chemin, rel } of parcourir(racine, 5, (r) => /\.(bicep|bicepparam)$/i.test(r) || FICHIER_D_ENVIRONNEMENT.test(r))) {
    if (/\.(bicep|bicepparam)$/i.test(rel)) return rel;
    const t = lire(chemin);
    if (SIGNE_AZURE.some((s) => s.fichier.test(rel) && s.motif.test(t))) return rel;
  }
  return null;
}

/** Les contraintes apprises dans un environnement : commentaires « Obligatoire ici ». */
export function contraintesConnues(racine) {
  const out = [];
  for (const { chemin, rel } of parcourir(racine, 5, (r) => FICHIER_D_ENVIRONNEMENT.test(r))) {
    lire(chemin).split(/\r?\n/).forEach((l, i) => {
      if (!/(#|\/\/|\/\*|<!--)[^\n]*\bobligatoire\s+ici\b/i.test(l)) return;
      const id = /\b(GF-\d{1,3})\b/.exec(l);
      out.push({ rel, ligne: i + 1, id: id ? id[1] : null, texte: l.trim().replace(/^(#|\/\/|\/\*|<!--)\s*/, "").slice(0, 120) });
    });
  }
  return out;
}

/** Les sections des garde-fous d'un dossier : titre qui nomme un garde-fou ou une contrainte. */
function sectionsGardeFous(texte) {
  const lignes = texte.split(/\r?\n/);
  const titres = [];
  let dansCode = false;
  lignes.forEach((l, i) => {
    if (/^\s*```/.test(l)) { dansCode = !dansCode; return; }
    if (dansCode) return;
    const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(l);
    if (m) titres.push({ i, niveau: m[1].length, texte: m[2] });
  });
  return titres.filter((t) => /garde-fous?|contraintes?/i.test(t.texte)).map((t) => {
    const fin = titres.find((u) => u.i > t.i && u.niveau <= t.niveau);
    return { titre: t.texte, debut: t.i, lignes: lignes.slice(t.i + 1, fin ? fin.i : lignes.length) };
  });
}

const RELEVE = /\baz\s+policy\s+assignment\s+list\b|\bGet-AzPolicyAssignment\b|\bcheckPolicyRestrictions\b/i;
const DATE = /\b20\d{2}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/20\d{2}\b/;
const PAROLE = /\bparole\b|\bd[ée]crit(?:e|s)?\s+par\b|\bcommanditaire\b|\bhumain\b/i;
const CITATION = /«[^»]{3,}»|"[^"]{3,}"|“[^”]{3,}”/;

export function jugerProduit(racine, { document = null } = {}) {
  const findings = [];
  const refus = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const dossiers = document ? [document] : parcourir(racine, 4, (r, nom) => /^DOSSIER-MEP.*\.md$/i.test(nom)).map((d) => d.chemin);
  const azure = cibleAzure(racine);
  const connues = contraintesConnues(racine);
  const mesure = { dossiers: dossiers.length, cible_azure: azure, contraintes_connues: connues.length, sections: 0, refus: 0 };
  if (!dossiers.length) return { findings, mesure, rienAJuger: true, motif: "aucun DOSSIER-MEP.md sous ce produit : l'étape de mise en production n'a pas été atteinte" };

  let sectionsTotal = 0;
  for (const chemin of dossiers) {
    const texte = lire(chemin);
    const nom = relative(racine, chemin).split("\\").join("/") || chemin;
    const sections = sectionsGardeFous(texte);
    sectionsTotal += sections.length;
    if (!azure && !connues.length && !sections.length) continue;
    const corps = sections.flatMap((s) => [s.titre, ...s.lignes]).join("\n");
    // La date est celle du RELEVÉ, sur sa propre ligne : une date prise ailleurs dans la section
    // (une ligne du tableau, le registre) ne dit pas quand la portée a été interrogée.
    const horsTableau = sections.flatMap((s) => [s.titre, ...s.lignes]).filter((l) => !/^\s*\|/.test(l));
    const releveDate = horsTableau.some((l) => (RELEVE.test(l) || /\brelev[ée]s?\b/i.test(l)) && DATE.test(l));
    if (!sections.length) {
      refus("GF-1", nom, `aucune section des garde-fous de la plateforme et des contraintes connues`
        + (azure ? `, alors que le produit déploie sur Azure (${azure})` : "")
        + (connues.length ? ` et porte ${connues.length} contrainte(s) « Obligatoire ici »` : "")
        + " — le 29/09/2026, un amorçage conçu sans ce relevé a été refusé par une stratégie Deny posée depuis le 03/07 (ETAPE-MEP.md § 1 ter, M-11)");
    } else if (azure && !(RELEVE.test(corps) && releveDate)) {
      refus("GF-1", nom, RELEVE.test(corps)
        ? "le relevé des stratégies de la portée cible n'est pas DATÉ — une stratégie se pose sans commit, un relevé sans date ne dit pas ce qu'il a vu"
        : "la section ne porte pas le relevé des stratégies de la portée cible (`az policy assignment list --scope <portée> --disable-scope-strict-match`, puis la règle de chacune) — ETAPE-MEP.md § 1 ter");
    }
    // GF-2 — chaque contrainte apprise dans un environnement est relue ici.
    for (const c of connues) {
      const citee = c.id ? new RegExp(`\\b${c.id}\\b`).test(corps) : corps.includes(c.rel);
      if (!citee) {
        refus("GF-2", `${c.rel}:${c.ligne}`, `contrainte connue NON RELUE au dossier ${nom} : « ${c.texte} » — `
          + (c.id ? `son identifiant ${c.id} n'y figure pas` : `ni son identifiant (GF-nn) ni son fichier ${c.rel} n'y figurent`)
          + ". Écrite pour un environnement, elle vaut pour la portée entière jusqu'à preuve du contraire (le 23/07/2026, une telle ligne ne gouvernait que la qualification)");
      }
    }
    if (sections.length) {
      // GF-3 — le registre de la factory a été lu.
      if (!/GARDE-FOUS-PLATEFORME|registre\s+des\s+garde-fous|\bGFP-\d{3}\b/i.test(corps)) {
        refus("GF-3", nom, "la section ne dit pas avoir lu le registre des garde-fous de la factory (`references\\GARDE-FOUS-PLATEFORME.json`) — "
          + "une contrainte trouvée par un produit voisin ne sert au suivant que s'il la lit ; « aucune entrée pour ce client » est une réponse complète");
      }
      // GF-4 — la parole de l'humain se cite avec ses mots.
      for (const s of sections) {
        const separateur = (l) => /^\s*\|?\s*:?-{2,}/.test(l || "");
        s.lignes.forEach((l, i) => {
          // Une ligne de tableau, ni séparateur ni en-tête : l'en-tête est la ligne qui précède le séparateur.
          if (!/^\s*\|/.test(l) || separateur(l) || separateur(s.lignes[i + 1])) return;
          if (PAROLE.test(l) && !CITATION.test(l)) {
            refus("GF-4", `${nom}:${s.debut + 2 + i}`, "une contrainte décrite par l'humain se cite avec SES mots, entre guillemets — "
              + "le 21/09/2026, un processus décrit par le commanditaire a été reformulé, puis écarté comme contraire à une doctrine au lieu d'être posé en décision");
          }
        });
      }
    }
  }
  mesure.sections = sectionsTotal;
  mesure.refus = findings.filter((f) => f.statut === "FAIL").length;
  const rienAJuger = !azure && !connues.length && !sectionsTotal;
  return { findings, mesure, rienAJuger, motif: rienAJuger ? "M-11 sans objet : ni cible Azure, ni contrainte « Obligatoire ici », ni section de garde-fous" : null };
}

const ISO = /^20\d{2}-\d{2}-\d{2}$/;
const GUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;
export function jugerRegistre(chemin, aujourdhui = new Date().toISOString().slice(0, 10)) {
  const findings = [];
  const refus = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  let j = null;
  const brut = lire(chemin);
  try { j = JSON.parse(brut); } catch (e) { refus("GR-1", chemin, `registre illisible : ${e.message}`); return { findings, mesure: { entrees: 0 } }; }
  if (j.format !== "pilot/garde-fous-plateforme@1") refus("GR-1", chemin, `format inattendu : « ${j.format} »`);
  const entrees = Array.isArray(j.garde_fous) ? j.garde_fous : [];
  if (!Array.isArray(j.garde_fous)) refus("GR-1", chemin, "le champ garde_fous n'est pas une liste");
  // GR-2 — rien qui identifie un client dans un dépôt public.
  if (GUID.test(brut)) refus("GR-2", chemin, `un identifiant (GUID) figure au registre : « ${GUID.exec(brut)[0].slice(0, 8)}… » — un dépôt public ne porte aucun identifiant de client`);
  if (/\/subscriptions\/[0-9a-f-]{8,}/i.test(brut)) refus("GR-2", chemin, "un chemin de souscription figure au registre — l'identifiant reste chez le produit");
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(brut)) refus("GR-2", chemin, "une adresse électronique figure au registre");
  const vus = new Set();
  for (const e of entrees) {
    const ou = `${chemin} › ${e && e.id ? e.id : "(entrée sans id)"}`;
    if (!e || !/^GFP-\d{3}$/.test(e.id || "")) { refus("GR-1", ou, "identifiant absent ou hors forme GFP-nnn"); continue; }
    if (vus.has(e.id)) refus("GR-3", ou, `identifiant ${e.id} en double`);
    vus.add(e.id);
    for (const champ of ["plateforme", "mecanisme", "effet", "portee", "vise", "refuse", "consequence", "source", "verifiee_par"]) {
      if (typeof e[champ] !== "string" || !e[champ].trim()) refus("GR-1", ou, `champ « ${champ} » absent ou vide`);
    }
    if (!/^Client-[A-Z]{1,2}$/.test(e.client || "")) refus("GR-2", ou, `client hors pseudonyme : « ${e.client} » — attendu Client-X`);
    for (const champ of ["inscrite_le", "verifiee_le"]) {
      if (!ISO.test(e[champ] || "")) refus("GR-1", ou, `« ${champ} » n'est pas une date AAAA-MM-JJ`);
      else if (e[champ] > aujourdhui) refus("GR-1", ou, `« ${champ} » (${e[champ]}) est dans le futur`);
    }
    if (e.posee_le !== null && e.posee_le !== undefined && !ISO.test(e.posee_le)) refus("GR-1", ou, "« posee_le » n'est ni une date AAAA-MM-JJ ni null (inconnue)");
    if (!/RETOURS - \d{8}[a-z]/.test(e.source || "")) refus("GR-1", ou, "la source ne cite aucun lot de retours (« <produit> - RETOURS - AAAAMMJJx ») — une entrée sans lot ne se vérifie pas");
    const constats = Array.isArray(e.constatee) ? e.constatee : [];
    if (!constats.length) refus("GR-1", ou, "aucun constat daté (champ constatee)");
    for (const c of constats) {
      if (!ISO.test((c && c.le) || "")) refus("GR-1", ou, "un constat n'est pas daté AAAA-MM-JJ");
      if (c && /^Produit-/.test(c.produit || "") && !/^Produit-\d{2,}$/.test(c.produit)) refus("GR-2", ou, `produit hors pseudonyme : « ${c.produit} »`);
    }
  }
  return { findings, mesure: { entrees: entrees.length } };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const positionnels = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--document");
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify(corps, null, 1) + "\n"); process.exit(code); };
  if (args.includes("--registre")) {
    const chemin = positionnels[0] || REGISTRE;
    if (!existsSync(chemin)) sortir({ outil: "verifier-garde-fous", mode: "registre", verdict: "NON_JUGEABLE", message: `registre introuvable : ${chemin}` }, 2);
    const r = jugerRegistre(chemin);
    const ko = r.findings.length;
    sortir({ outil: "verifier-garde-fous", version: "1.0.0", mode: "registre", registre: chemin, verdict: ko ? "FAIL" : "PASS", mesure: { ...r.mesure, refus: ko }, findings: r.findings,
      non_juge: ["la VÉRITÉ d'une entrée : elle se confirme par le relevé du jour chez le produit, jamais par ce registre", "un nom réel écrit en clair : la porte des noms du dépôt le juge à l'enregistrement, pas ce contrôle"] }, ko ? 1 : 0);
  }
  const document = valeur("--document");
  const racine = positionnels[0] || process.cwd();
  if (!existsSync(racine) || !statSync(racine).isDirectory() || (document && !existsSync(document))) {
    sortir({ outil: "verifier-garde-fous", verdict: "NON_JUGEABLE", message: `produit ou document introuvable : ${document || racine}` }, 2);
  }
  const r = jugerProduit(racine, { document });
  const verdict = r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS";
  sortir({ outil: "verifier-garde-fous", version: "1.0.0", mode: "produit", regle: "M-11 (ETAPE-MEP.md § 1 ter, TF-1495 et TF-1496)",
    produit: racine, verdict, motif: r.motif || undefined, mesure: r.mesure, findings: r.findings, non_juge: NON_JUGE }, r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
}
