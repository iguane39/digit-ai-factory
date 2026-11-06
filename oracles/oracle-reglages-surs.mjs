#!/usr/bin/env node
/**
 * oracle-reglages-surs.mjs — juge le registre des réglages sûrs par défaut
 * (`references\REGLAGES-SURS-PAR-DEFAUT.json`), pièce 1 de la décision D-178 (a) du 06/11/2026 (TF-2225),
 * qui fait de « un réglage admissible s'applique à la création, se vérifie à chaque livraison, et son
 * exception se décide » la loi transverse n° 8, écrite comme la règle R-66 de `REGLES-PROJET.md`.
 *
 * LE FAIT. Étude du 06/11/2026 (« Sécurité par défaut de bout en bout », 20261106a) : 8 réglages de
 * sécurité standard de Supabase, GitHub et Cloudflare sont connus ou contrôlés par 5 forges, appliqués par
 * aucune (0 case sur 56). Sur les 30 écarts de l'audit du cas témoin, 7 sont une option gratuite laissée à
 * sa valeur d'origine. Le registre dit quels réglages une forge peut écrire d'office à la création
 * (classement `defaut`) et lesquels restent une décision du produit (classement `decision`). Ce contrôle
 * garde le registre honnête : un réglage ne peut être écrit d'office que si les cinq critères sont tenus.
 *
 * LES CINQ CRITÈRES. c1 source (l'éditeur ou une norme le recommande), c2 coût (aucune dépense), c3
 * fonctionnement (aucun flux nominal du produit de référence ne casse), c4 réversibilité (une commande
 * pose, une commande défait), c5 vérifiabilité (une lecture rend un état comparable à l'attendu).
 *
 * RÈGLES.
 *   RS-1  le registre est un tableau ; chaque entrée porte EXACTEMENT les dix clés du schéma, chaque
 *         champ texte est non vide ;
 *   RS-2  `criteres` porte exactement c1 à c5, chacun {verdict, preuve} ; verdict ∈ tenu | echoue |
 *         non_mesure, preuve non vide ;
 *   RS-3  `classement` ∈ defaut | decision, et `defaut` SEULEMENT si c1 à c5 sont tous « tenu » ;
 *   RS-4  les secrets et les identifiants de ressource des commandes s'écrivent `$NOM_DE_VARIABLE` :
 *         aucun jeton, aucun identifiant de projet, de zone, d'organisation ou de dépôt en clair ;
 *   RS-5  `source_lue_le` est une date AAAA-MM-JJ qui n'est pas dans le futur, `source_url` une adresse
 *         https, et deux entrées ne citent pas la même page (l'adresse sert de clé de recherche) ;
 *   RS-6  un réglage classé `defaut` porte trois commandes (pose, lecture, retour) : « aucune commande »
 *         ne se pose pas d'office ;
 *   RS-7  avec `--pages` : chaque citation donnée « mot pour mot » se retrouve dans le texte brut des
 *         pages de l'éditeur (segments séparés par « … » cherchés un à un).
 *
 * NON JUGÉ : voir `NON_JUGE`, rendu dans chaque sortie.
 *
 * Usage : node oracles\oracle-reglages-surs.mjs [registre.json] [--pages <fichier|dossier>]
 *         node oracles\oracle-reglages-surs.mjs --self-test
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = registre introuvable (non jugeable).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const REGISTRE_PAR_DEFAUT = join(ICI, "..", "references", "REGLAGES-SURS-PAR-DEFAUT.json");

export const CLES = ["plateforme", "reglage", "source_url", "source_lue_le", "criteres", "cmd_appliquer", "cmd_lire", "attendu", "cmd_retour", "classement"];
export const CRITERES = ["c1", "c2", "c3", "c4", "c5"];
export const VERDICTS = ["tenu", "echoue", "non_mesure"];
export const CLASSEMENTS = ["defaut", "decision"];
const CHAMPS_TEXTE = CLES.filter((c) => c !== "criteres");
const COMMANDES = ["cmd_appliquer", "cmd_lire", "cmd_retour"];
const ISO = /^20\d{2}-\d{2}-\d{2}$/;

export const NON_JUGE = [
  "la VÉRITÉ d'une entrée : le contrôle lit la forme du registre et la cohérence du classement avec les critères, il ne rejoue ni la commande ni la page de l'éditeur (sauf la présence des citations, avec --pages)",
  "les citations sans --pages : hors ligne, une citation « mot pour mot » est lue comme une chaîne, pas comparée à la page ; le contrôle le dit dans le constat RS-7",
  "la justesse d'un verdict de critère : qu'un c3 « tenu » repose sur le bon produit de référence ne se juge pas sans le produit ; la preuve est exigée, pas rejouée",
  "l'âge de source_lue_le : la date est exigée et bornée par le jour, mais un réglage lu il y a un an n'est pas signalé ; la relecture des pages est un geste de mise à jour du registre (loi n° 4)",
  "un classement `decision` dont les cinq critères sont tous tenus : le contrôle ne dit rien d'un choix du porteur qui n'a pas de critère en échec",
  "la forme des commandes (qu'une commande curl soit valide) : seule la présence de secrets et d'identifiants en clair est lue",
];

const aplatir = (t) => String(t).replace(/ /g, " ").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
// La syntaxe Markdown (accents graves, astérisques, barres de tableau) ne fait pas partie de ce que la page dit,
// et le retrait des balises laisse une espace devant la ponctuation qui suit un lien (« plans . »).
const net = (t) => aplatir(t).replace(/[`*|]/g, " ").replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
const sansBalises = (t) => t.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'");

/** Les citations « mot pour mot » d'une preuve : la première « … » qui suit chaque « mot pour mot », en segments. */
export function citationsMotPourMot(preuve) {
  const out = [];
  const re = /mot pour mot[^«]{0,60}«([^»]+)»/gi;
  let m;
  while ((m = re.exec(String(preuve))) !== null) {
    // La syntaxe d'un lien Markdown est retirée AVANT le découpage : son adresse peut porter un « … ».
    for (const seg of m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").split(/…|\.\.\./)) {
      const s = net(seg);
      if (s.length >= 12) out.push(s);
    }
  }
  return out;
}

const TOKENS_CONNUS = [
  [/\bsbp_[0-9a-f]{16,}/i, "jeton Supabase (sbp_…)"],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, "jeton GitHub (gh?_…)"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, "jeton GitHub (github_pat_…)"],
  [/\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}/, "JWT en clair"],
  [/\bAKIA[0-9A-Z]{16}\b/, "clé d'accès AWS"],
];
const IDENTIFIANTS_EN_DUR = [
  [/\/projects\/(?!\$)[^/\s"'?]+/, "identifiant de projet après /projects/"],
  [/\/zones\/(?!\$)[^/\s"'?]+/, "identifiant de zone après /zones/"],
  [/\/organizations\/(?!\$)[^/\s"'?]+/, "identifiant d'organisation après /organizations/"],
  [/\brepos\/(?!\$)[^/\s"'?]+/, "propriétaire de dépôt après repos/"],
  [/\brepos\/\$[A-Z0-9_]+\/(?!\$)[^/\s"'?]+/, "nom de dépôt après repos/$OWNER/"],
  [/\/rulesets\/(?!\$)[^/\s"'?]+/, "identifiant de ruleset après /rulesets/"],
  [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i, "GUID"],
  [/\b[0-9a-f]{32}\b/, "identifiant hexadécimal de 32 caractères"],
];

/** Les défauts de RS-4 dans une commande : liste de messages, vide si la commande est propre. */
export function secretsEnClair(commande) {
  const defauts = [];
  const c = String(commande);
  for (const m of c.matchAll(/Bearer\s+([^\s"']+)/g)) {
    if (!/^\$\{?[A-Z][A-Z0-9_]*\}?$/.test(m[1])) defauts.push(`jeton « Bearer ${m[1].slice(0, 6)}… » en clair : écrire $NOM_DE_VARIABLE`);
  }
  for (const [motif, nom] of TOKENS_CONNUS) if (motif.test(c)) defauts.push(`${nom} en clair`);
  for (const [motif, nom] of IDENTIFIANTS_EN_DUR) if (motif.test(c)) defauts.push(`${nom} en clair : écrire $NOM_DE_VARIABLE`);
  for (const m of c.matchAll(/[A-Za-z0-9_-]{32,}/g)) {
    if (/[A-Za-z]/.test(m[0]) && /\d/.test(m[0])) { defauts.push(`chaîne opaque de ${m[0].length} caractères (« ${m[0].slice(0, 6)}… ») : un secret s'écrit $NOM_DE_VARIABLE`); break; }
  }
  return defauts;
}

function lirePages(chemin) {
  const fichiers = [];
  const marcher = (p) => {
    const s = statSync(p);
    if (s.isDirectory()) { for (const n of readdirSync(p)) marcher(join(p, n)); }
    else fichiers.push(p);
  };
  marcher(chemin);
  const brut = fichiers.map((f) => readFileSync(f, "utf8")).join("\n");
  return { fichiers: fichiers.length, texte: net(brut), texteSansBalises: net(sansBalises(brut)) };
}

/**
 * Juge un registre déjà chargé. `registre` : la valeur JSON. `pages` : { texte, texteSansBalises } ou null.
 * Rend la liste des constats : { regle, statut: "FAIL"|"PASS"|"NON_JUGE", ou, message }.
 */
export function juger(registre, { aujourdhui = new Date().toISOString().slice(0, 10), pages = null } = {}) {
  const findings = [];
  const refus = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  if (!Array.isArray(registre)) {
    refus("RS-1", "(racine)", "le registre n'est pas un tableau d'entrées");
    return findings;
  }
  if (registre.length === 0) refus("RS-1", "(racine)", "le registre est vide : aucun réglage à lire");
  const urls = new Map();
  registre.forEach((e, i) => {
    const nom = e && typeof e === "object" && typeof e.reglage === "string" && e.reglage ? `#${i + 1} ${e.reglage.slice(0, 48)}` : `#${i + 1}`;
    if (!e || typeof e !== "object" || Array.isArray(e)) { refus("RS-1", nom, "l'entrée n'est pas un objet"); return; }
    // RS-1 — les clés exactes.
    for (const c of CLES) if (!(c in e)) refus("RS-1", nom, `clé « ${c} » absente`);
    for (const c of Object.keys(e)) if (!CLES.includes(c)) refus("RS-1", nom, `clé « ${c} » hors schéma (clés admises : ${CLES.join(", ")})`);
    for (const c of CHAMPS_TEXTE) if (c in e && (typeof e[c] !== "string" || !e[c].trim())) refus("RS-1", nom, `champ « ${c} » vide ou non textuel`);
    // RS-2 — les cinq critères.
    const cr = e.criteres;
    let criteresLisibles = false;
    if (cr === undefined) { /* déjà dit par RS-1 */ }
    else if (!cr || typeof cr !== "object" || Array.isArray(cr)) refus("RS-2", nom, "« criteres » n'est pas un objet c1 à c5");
    else {
      criteresLisibles = true;
      for (const k of CRITERES) {
        const v = cr[k];
        if (!v || typeof v !== "object") { refus("RS-2", nom, `critère ${k} absent`); criteresLisibles = false; continue; }
        if (!VERDICTS.includes(v.verdict)) { refus("RS-2", nom, `critère ${k} : verdict « ${v.verdict} » hors ${VERDICTS.join(" | ")}`); criteresLisibles = false; }
        if (typeof v.preuve !== "string" || !v.preuve.trim()) { refus("RS-2", nom, `critère ${k} : preuve absente ou vide`); criteresLisibles = false; }
      }
      for (const k of Object.keys(cr)) if (!CRITERES.includes(k)) refus("RS-2", nom, `critère « ${k} » hors c1 à c5`);
    }
    // RS-3 — le classement contre les critères.
    if ("classement" in e) {
      if (!CLASSEMENTS.includes(e.classement)) refus("RS-3", nom, `classement « ${e.classement} » hors ${CLASSEMENTS.join(" | ")}`);
      else if (e.classement === "defaut" && criteresLisibles) {
        const pasTenus = CRITERES.filter((k) => cr[k].verdict !== "tenu");
        if (pasTenus.length) refus("RS-3", nom, `classé « defaut » alors que ${pasTenus.map((k) => `${k} vaut ${cr[k].verdict}`).join(", ")} : un réglage ne s'écrit d'office que si c1 à c5 sont tous tenus — classer « decision »`);
      }
    }
    // RS-4 — secrets et identifiants.
    for (const c of COMMANDES) {
      if (typeof e[c] !== "string") continue;
      for (const d of secretsEnClair(e[c])) refus("RS-4", `${nom} › ${c}`, d);
    }
    // RS-5 — la date, l'adresse, l'unicité.
    if (typeof e.source_lue_le === "string") {
      if (!ISO.test(e.source_lue_le) || Number.isNaN(Date.parse(e.source_lue_le))) refus("RS-5", nom, `source_lue_le « ${e.source_lue_le} » n'est pas une date AAAA-MM-JJ`);
      else if (e.source_lue_le > aujourdhui) refus("RS-5", nom, `source_lue_le (${e.source_lue_le}) est dans le futur`);
    }
    if (typeof e.source_url === "string") {
      if (!/^https:\/\/[^\s/]+\.[^\s/]+\/\S*$/.test(e.source_url)) refus("RS-5", nom, `source_url « ${e.source_url} » n'est pas une adresse https`);
      if (urls.has(e.source_url)) refus("RS-5", nom, `source_url déjà citée par l'entrée ${urls.get(e.source_url)} : l'adresse est la clé de recherche, elle est unique`);
      else urls.set(e.source_url, `#${i + 1}`);
    }
    // RS-6 — un défaut se pose, se lit, se défait par commande.
    if (e.classement === "defaut") {
      for (const c of COMMANDES) {
        if (typeof e[c] === "string" && /^\s*aucune commande/i.test(e[c])) refus("RS-6", `${nom} › ${c}`, "classé « defaut » sans commande : un réglage écrit d'office se pose, se lit et se défait par une commande");
      }
    }
    // RS-7 — les citations contre les pages.
    if (pages && criteresLisibles) {
      for (const k of CRITERES) {
        for (const citation of citationsMotPourMot(cr[k].preuve)) {
          const trouvee = pages.texte.includes(citation) || pages.texteSansBalises.includes(citation);
          if (!trouvee) refus("RS-7", `${nom} › ${k}`, `citation « ${citation.slice(0, 70)}${citation.length > 70 ? "…" : ""} » introuvable dans les pages fournies`);
        }
      }
    }
  });
  for (const r of ["RS-1", "RS-2", "RS-3", "RS-4", "RS-5", "RS-6"]) {
    if (!findings.some((f) => f.regle === r && f.statut === "FAIL")) findings.push({ regle: r, statut: "PASS", message: `${registre.length} entrée(s) jugée(s)` });
  }
  if (pages) {
    if (!findings.some((f) => f.regle === "RS-7" && f.statut === "FAIL")) findings.push({ regle: "RS-7", statut: "PASS", message: "chaque citation « mot pour mot » est dans les pages fournies" });
  } else {
    findings.push({ regle: "RS-7", statut: "NON_JUGE", message: "aucune page fournie (--pages) : les citations « mot pour mot » ne sont pas comparées aux pages de l'éditeur" });
  }
  return findings;
}

export function chargerRegistre(chemin = REGISTRE_PAR_DEFAUT) {
  return JSON.parse(readFileSync(chemin, "utf8"));
}

/** L'entrée du registre qu'un texte désigne : adresse exacte, ou fragment unique de l'adresse ou du réglage. */
export function trouverReglage(registre, cle) {
  const k = String(cle).trim().toLowerCase();
  const exact = registre.filter((e) => e.source_url.toLowerCase() === k);
  if (exact.length === 1) return { entree: exact[0] };
  const proches = registre.filter((e) => e.source_url.toLowerCase().includes(k) || e.reglage.toLowerCase().includes(k));
  if (proches.length === 1) return { entree: proches[0] };
  return { entree: null, candidats: proches.map((e) => e.source_url) };
}

// ---- self-test : chaque règle dans les DEUX sens ----------------------------------------------
const verte = () => ({
  plateforme: "Exemple",
  reglage: "TLS imposé (exemple)",
  source_url: "https://exemple.test/docs/tls",
  source_lue_le: "2026-11-06",
  criteres: Object.fromEntries(CRITERES.map((k) => [k, { verdict: "tenu", preuve: `critère ${k} tenu, preuve écrite` }])),
  cmd_appliquer: "curl -sS -X PUT \"https://api.exemple.test/v1/projects/$PROJECT_REF/tls\" -H \"Authorization: Bearer $EXEMPLE_TOKEN\" -d '{\"on\":true}'",
  cmd_lire: "curl -sS \"https://api.exemple.test/v1/projects/$PROJECT_REF/tls\" -H \"Authorization: Bearer $EXEMPLE_TOKEN\"",
  attendu: "true",
  cmd_retour: "curl -sS -X PUT \"https://api.exemple.test/v1/projects/$PROJECT_REF/tls\" -H \"Authorization: Bearer $EXEMPLE_TOKEN\" -d '{\"on\":false}'",
  classement: "defaut",
});
const copie = (o) => JSON.parse(JSON.stringify(o));

function selfTest() {
  const cas = [];
  const refuse = (f, regle) => f.some((x) => x.regle === regle && x.statut === "FAIL");
  const propre = (f) => !f.some((x) => x.statut === "FAIL");
  const un = (e) => [e];

  cas.push(["vert — une entrée conforme : aucun refus", propre(juger(un(verte())))]);

  // RS-1
  cas.push(["rouge RS-1 — le registre n'est pas un tableau", refuse(juger({ a: 1 }), "RS-1")]);
  cas.push(["rouge RS-1 — registre vide", refuse(juger([]), "RS-1")]);
  const sansClé = verte(); delete sansClé.attendu;
  cas.push(["rouge RS-1 — clé « attendu » absente", refuse(juger(un(sansClé)), "RS-1")]);
  const clé = verte(); clé.commentaire = "x";
  cas.push(["rouge RS-1 — clé hors schéma", refuse(juger(un(clé)), "RS-1")]);
  const vide = verte(); vide.cmd_lire = "  ";
  cas.push(["rouge RS-1 — champ texte vide", refuse(juger(un(vide)), "RS-1")]);

  // RS-2
  const sansC5 = verte(); delete sansC5.criteres.c5;
  cas.push(["rouge RS-2 — critère c5 absent", refuse(juger(un(sansC5)), "RS-2")]);
  const verdictInconnu = verte(); verdictInconnu.criteres.c2.verdict = "ok";
  cas.push(["rouge RS-2 — verdict hors tenu | echoue | non_mesure", refuse(juger(un(verdictInconnu)), "RS-2")]);
  const sansPreuve = verte(); sansPreuve.criteres.c1.preuve = "";
  cas.push(["rouge RS-2 — preuve vide", refuse(juger(un(sansPreuve)), "RS-2")]);
  const c6 = verte(); c6.criteres.c6 = { verdict: "tenu", preuve: "x" };
  cas.push(["rouge RS-2 — critère c6 hors c1 à c5", refuse(juger(un(c6)), "RS-2")]);

  // RS-3 : le cas fondateur — un défaut dont un critère échoue — et ses deux versions saines
  const defautFaux = verte(); defautFaux.criteres.c2.verdict = "echoue";
  const r3 = juger(un(defautFaux));
  cas.push(["rouge RS-3 — classé defaut alors que c2 échoue : refusé, critère nommé", refuse(r3, "RS-3") && /c2 vaut echoue/.test(JSON.stringify(r3))]);
  const defautNonMesure = verte(); defautNonMesure.criteres.c3.verdict = "non_mesure";
  cas.push(["rouge RS-3 — classé defaut alors que c3 n'est pas mesuré", refuse(juger(un(defautNonMesure)), "RS-3")]);
  const remede = copie(defautFaux); remede.classement = "decision";
  cas.push(["vert RS-3 — le remède joué : le même réglage classé decision passe", propre(juger(un(remede)))]);
  const classementInconnu = verte(); classementInconnu.classement = "peut-etre";
  cas.push(["rouge RS-3 — classement hors defaut | decision", refuse(juger(un(classementInconnu)), "RS-3")]);

  // RS-4
  const jeton = verte(); jeton.cmd_lire = jeton.cmd_lire.replace("$EXEMPLE_TOKEN", ["sbp", "0123456789abcdef0123456789abcdef01234567"].join("_"));
  const r4 = juger(un(jeton));
  cas.push(["rouge RS-4 — jeton Bearer en clair : refusé", refuse(r4, "RS-4")]);
  const projet = verte(); projet.cmd_appliquer = projet.cmd_appliquer.replace("$PROJECT_REF", "abcdefghijklmnopqrst");
  cas.push(["rouge RS-4 — identifiant de projet en clair après /projects/", refuse(juger(un(projet)), "RS-4")]);
  const depot = verte(); depot.cmd_lire = "gh api repos/uneorg/unrepo/vulnerability-alerts --silent; echo $?";
  cas.push(["rouge RS-4 — propriétaire de dépôt en clair après repos/", refuse(juger(un(depot)), "RS-4")]);
  const depotVar = verte(); depotVar.cmd_lire = "gh api repos/$OWNER/$REPO/vulnerability-alerts --silent; echo $?";
  cas.push(["vert RS-4 — repos/$OWNER/$REPO et $? sont des variables, pas des secrets", propre(juger(un(depotVar)))]);
  const opaque = verte(); opaque.cmd_retour = "curl -sS -H \"X-Auth-Key: 0123456789abcdefABCDEF0123456789zz\" https://api.exemple.test/v1/x";
  cas.push(["rouge RS-4 — chaîne opaque de 32 caractères et plus (clé d'API)", refuse(juger(un(opaque)), "RS-4")]);

  // RS-5
  const futur = verte(); futur.source_lue_le = "2999-01-01";
  cas.push(["rouge RS-5 — source_lue_le dans le futur", refuse(juger(un(futur)), "RS-5")]);
  const mauvaiseDate = verte(); mauvaiseDate.source_lue_le = "06/11/2026";
  cas.push(["rouge RS-5 — source_lue_le hors AAAA-MM-JJ", refuse(juger(un(mauvaiseDate)), "RS-5")]);
  const http = verte(); http.source_url = "http://exemple.test/docs";
  cas.push(["rouge RS-5 — source_url en http", refuse(juger(un(http)), "RS-5")]);
  const doublon = [verte(), verte()];
  cas.push(["rouge RS-5 — deux entrées pour la même page", refuse(juger(doublon), "RS-5")]);

  // RS-6
  const sansCommande = verte(); sansCommande.cmd_appliquer = "aucune commande : tableau de bord";
  cas.push(["rouge RS-6 — classé defaut sans commande de pose", refuse(juger(un(sansCommande)), "RS-6")]);
  const decisionSansCommande = copie(sansCommande); decisionSansCommande.classement = "decision"; decisionSansCommande.criteres.c4.verdict = "echoue";
  cas.push(["vert RS-6 — classé decision, « aucune commande » est admis", propre(juger(un(decisionSansCommande)))]);

  // RS-7
  const citant = verte();
  citant.criteres.c1.preuve = "Page de l'éditeur, mot pour mot : « you can prevent clients from connecting if they are not using SSL. »";
  const pages = { texte: aplatir("Intro. For increased security, you can prevent clients from connecting if they are not using SSL. Fin."), texteSansBalises: "" };
  cas.push(["vert RS-7 — la citation est dans la page", propre(juger(un(citant), { pages }))]);
  const alteree = copie(citant);
  alteree.criteres.c1.preuve = alteree.criteres.c1.preuve.replace("prevent clients", "block clients");
  const r7 = juger(un(alteree), { pages });
  cas.push(["rouge RS-7 — citation d'un mot changé : introuvable dans la page", refuse(r7, "RS-7")]);
  const elision = copie(citant);
  elision.criteres.c1.preuve = "Page, mot pour mot : « you can prevent clients … if they are not using SSL »";
  cas.push(["vert RS-7 — « … » sépare des segments cherchés un à un", propre(juger(un(elision), { pages }))]);
  const sansPages = juger(un(alteree));
  cas.push(["borne RS-7 — sans --pages : NON_JUGE déclaré, jamais un PASS", sansPages.some((f) => f.regle === "RS-7" && f.statut === "NON_JUGE") && !refuse(sansPages, "RS-7")]);
  const htmlPage = { texte: "", texteSansBalises: aplatir(sansBalises("<p>you can prevent <b>clients</b> from connecting if they are not using SSL.</p>")) };
  cas.push(["vert RS-7 — page HTML : les balises ne cachent pas la citation", propre(juger(un(citant), { pages: htmlPage }))]);

  // Le registre RÉEL du pilot, jugé à chaque recette : l'état du monde, pas seulement les fixtures.
  if (existsSync(REGISTRE_PAR_DEFAUT)) {
    const reel = juger(chargerRegistre(REGISTRE_PAR_DEFAUT));
    cas.push(["vert — le registre RÉEL (references\\REGLAGES-SURS-PAR-DEFAUT.json) passe RS-1 à RS-6", propre(reel)]);
    const copieReelle = chargerRegistre(REGISTRE_PAR_DEFAUT);
    const premierDefaut = copieReelle.find((e) => e.classement === "defaut");
    if (premierDefaut) {
      premierDefaut.criteres.c3.verdict = "echoue";
      cas.push(["rouge — le registre réel, un défaut dont c3 échoue : RS-3", refuse(juger(copieReelle), "RS-3")]);
    }
    const parAdresse = trouverReglage(chargerRegistre(REGISTRE_PAR_DEFAUT), "ssl-enforcement");
    cas.push(["recherche — l'adresse d'un réglage retrouve son entrée, un fragment ambigu n'en choisit pas", !!parAdresse.entree
      && trouverReglage(chargerRegistre(REGISTRE_PAR_DEFAUT), "supabase").entree === null]);
  } else {
    cas.push(["rouge — le registre réel est absent de references\\", false]);
  }

  // CLI : un registre abîmé rend exit 1, un chemin absent exit 2 (jamais un PASS).
  const dossier = mkdtempSync(join(tmpdir(), "reglages-surs-"));
  try {
    const abime = join(dossier, "abime.json");
    writeFileSync(abime, JSON.stringify([defautFaux]), "utf8");
    const r = spawnCli([abime]);
    cas.push(["CLI — registre abîmé : exit 1 et verdict FAIL", r.status === 1 && /"verdict": "FAIL"/.test(r.stdout)]);
    const r2 = spawnCli([join(dossier, "absent.json")]);
    cas.push(["CLI — registre introuvable : exit 2, non jugeable", r2.status === 2]);
    const bon = join(dossier, "bon.json");
    writeFileSync(bon, JSON.stringify([verte()]), "utf8");
    const r3 = spawnCli([bon]);
    cas.push(["CLI — registre conforme : exit 0 et verdict PASS", r3.status === 0 && /"verdict": "PASS"/.test(r3.stdout)]);
  } finally { rmSync(dossier, { recursive: true, force: true }); }

  let bons = 0;
  for (const [nom, tenu] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom}`);
    if (tenu) bons += 1;
  }
  console.log(`Self-test oracle-reglages-surs : ${bons}/${cas.length}`);
  return bons === cas.length ? 0 : 1;
}

function spawnCli(args) {
  return spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...args], { encoding: "utf8" });
}

// ---- entrée -----------------------------------------------------------------------------------
// L'entrée ne s'exécute que si ce fichier est le programme lancé : `scripts\ouvrir-retour-reglage.mjs`
// importe ce module et ne doit pas le voir juger ni sortir du processus à l'import.
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const iPages = args.indexOf("--pages");
  const cheminPages = iPages >= 0 ? args[iPages + 1] : null;
  const chemin = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--pages") || REGISTRE_PAR_DEFAUT;
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify(corps, null, 1) + "\n"); process.exit(code); };
  if (!existsSync(chemin)) sortir({ oracle: "oracle-reglages-surs", verdict: "NON_JUGEABLE", message: `registre introuvable : ${chemin}` }, 2);
  if (cheminPages && !existsSync(cheminPages)) sortir({ oracle: "oracle-reglages-surs", verdict: "NON_JUGEABLE", message: `pages introuvables : ${cheminPages}` }, 2);
  let registre;
  try { registre = chargerRegistre(chemin); }
  catch (e) { sortir({ oracle: "oracle-reglages-surs", registre: chemin, verdict: "FAIL", findings: [{ regle: "RS-1", statut: "FAIL", message: `registre illisible : ${e.message}` }], non_juge: NON_JUGE }, 1); }
  const pages = cheminPages ? lirePages(cheminPages) : null;
  const findings = juger(registre, { pages });
  const ko = findings.filter((f) => f.statut === "FAIL").length;
  sortir({ oracle: "oracle-reglages-surs", version: "1.0.0", registre: chemin, verdict: ko ? "FAIL" : "PASS",
    mesure: { entrees: Array.isArray(registre) ? registre.length : 0, defaut: Array.isArray(registre) ? registre.filter((e) => e && e.classement === "defaut").length : 0,
      decision: Array.isArray(registre) ? registre.filter((e) => e && e.classement === "decision").length : 0, refus: ko, pages: pages ? pages.fichiers : 0 },
    findings, non_juge: NON_JUGE }, ko ? 1 : 0);
}
