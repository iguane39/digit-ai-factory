#!/usr/bin/env node
/**
 * oracle-gabarits-documents — UN SQUELETTE QUI N'A JAMAIS ÉTÉ INSTANCIÉ N'A JAMAIS ÉTÉ ÉPROUVÉ.
 *
 * LE FAIT (24/08/2026, TF-0565). Les squelettes `gd-dossier-architecture` et `gd-dossier-exploitation`,
 * version 1.0.2 tous deux, posaient la classe `ch-apprend` sur 11 paragraphes de l'un et 8 de
 * l'autre SANS qu'aucune règle CSS ne la vise. `check_html` rendait FAIL sur L21 — composant
 * déclaré sans style — sur les deux fichiers, et depuis leur production. Le chapeau de chapitre se
 * rendait comme un paragraphe ordinaire, et rien à l'écran ne le signalait : un oracle de RENDU ne
 * voit rien tant que rien ne déborde. C'était la DEUXIÈME fois que ces mêmes squelettes livraient
 * un défaut que seule la production d'un vrai document révélait.
 *
 * CE QUE CET ORACLE MÉCANISE, et c'est le second geste de l'item — le premier, embarquer le style
 * de tout composant posé, est tenu par L21 du socle :
 *   G1 · toute famille de `gabarits\documents\` porte sa doctrine (GABARIT.md) et au moins une
 *        INSTANCE — la preuve qu'elle a été remplie une fois. Et LE FORMAT DU SQUELETTE DICTE CELUI
 *        DE L'INSTANCE : un SQUELETTE.html réclame une INSTANCE.html, un squelette Markdown une
 *        instance Markdown. L'oracle n'impose aucun format ; il vérifie qu'aucune forme posée ne
 *        reste sans preuve ;
 *   G2 · l'instance est REMPLIE : aucun marqueur de substitution DÉLIMITÉ (`{{…}}`, `[[…]]`,
 *        `[À REMPLIR]`) hors commentaires,
 *        et elle diffère de son squelette. Une instance qui recopie le squelette ne prouve rien ;
 *   G3 · squelette ET instance passent le contrôle de MARQUAGE du socle (`check_html.py`). C'est
 *        exactement le contrôle qui rendait FAIL depuis la production, et que personne ne jouait ;
 *   G4 · le document REND son gabarit et sa version (`Gabarit : gd-… · version du gabarit x.y.z`),
 *        visiblement — jamais seulement en commentaire. Une instance périmée est invisible sur
 *        l'artefact, et la section R-46 des lots devient impossible à remplir sans lui (TF-0690).
 *
 * CE QU'IL NE FAIT PAS : rendre la page. Le rendu a son propre contrôle — `scripts\verifier-rendu-
 * instances.mjs` — et le dupliquer créerait deux vérités sur les familles bloquantes. Il ne juge
 * pas non plus la JUSTESSE du contenu d'une instance : un texte d'exemple faux est un défaut de
 * relecture, pas de marquage, et aucun oracle ne le verra.
 *
 * SKIP MOTIVÉ, JAMAIS PASS SILENCIEUX : sans python ni socle, l'oracle dit qu'il n'a pas tourné.
 *
 *   node oracles\oracle-gabarits-documents.mjs             → jugement du parc
 *   node oracles\oracle-gabarits-documents.mjs --self-test → double sens sur des familles fabriquées
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Cet oracle n'a AUCUN chemin « je ne peux pas
// mesurer » : il ne depend d'aucun outil externe et lit des fichiers du depot. Le declarer
// vaut mieux que de le taire — un contrat muet laisse croire qu'un 1 peut etre une panne
// d'environnement (TF-0648).
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir, homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

const CANDIDATS_SOCLE = [
  join(homedir(), ".claude", "skills", "digit-ai-page-html", "scripts", "check_html.py"),
  join(PILOT, "..", "digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", "check_html.py"),
];
const SOCLE = CANDIDATS_SOCLE.find(existsSync) || null;
const PYTHON = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});

/**
 * Les restes de substitution qui trahissent une instance jamais remplie — et ILS SONT DÉLIMITÉS.
 *
 * Première version de cette liste, le 24/08 : elle contenait `/\bà remplir\b/i` nu. L'oracle a
 * rendu DEUX FAUX POSITIFS sur le parc en moins d'une minute, sur la phrase « emplacement nommé,
 * prêt à remplir » — de la prose, dans un commentaire, qui DÉCRIT un emplacement voulu (TF-0524).
 * Un marqueur de substitution se reconnaît à ses délimiteurs, jamais à ses mots : `{{x}}`, `[[x]]`,
 * `[À REMPLIR]`, `<À REMPLIR>`. Chercher les mots, c'est accuser la documentation de son propre
 * sujet — et c'est le défaut que je venais de corriger ailleurs le même jour.
 */
const RESTES = [
  /\{\{[^}]{1,80}\}\}/,                       // {{cle.de.substitution}}
  /\[\[[^\]]{1,80}\]\]/,                      // [[cle]]
  /[[<«]\s*(?:À|A) REMPLIR[^\]>»]{0,40}[\]>»]/i, // [À REMPLIR], <à remplir : …>
  /[[<]\s*TODO[^\]>]{0,60}[\]>]/i,            // [TODO …]
  /\bLOREM IPSUM\b/i,
];

/** Le texte hors commentaires HTML : un marqueur laissé dans un commentaire ne se rend pas. */
const sansCommentaires = (html) => html.replace(/<!--[\s\S]*?-->/g, " ");

function marquage(fichier) {
  if (!SOCLE || !PYTHON) return { skip: true };
  const r = spawnSync(PYTHON, ["-X", "utf8", SOCLE, fichier], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const sortie = (r.stdout || "") + (r.stderr || "");
  const m = /^Verdict\s*:\s*(\w+)/m.exec(sortie);
  return { verdict: m ? m[1] : "ILLISIBLE", detail: sortie.split("\n").filter((l) => /^\s+\[/.test(l)).slice(0, 3).join(" · ") };
}

export function juger(dossier) {
  const findings = [];
  const familles = existsSync(dossier)
    ? readdirSync(dossier, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
    : [];
  for (const fam of familles) {
    const p = (n) => join(dossier, fam, n);
    // LE FORMAT DU SQUELETTE DICTE CELUI DE L'INSTANCE, et l'oracle n'impose aucun format. La
    // famille `diagnostic-exploitation` vit en Markdown — GABARIT.md + INSTANCE.md, aucun HTML :
    // exiger d'elle un SQUELETTE.html serait imposer une forme au nom d'un contrôle, et le
    // premier passage de cet oracle sur le parc a rendu exactement ce faux positif.
    const fichiers = readdirSync(join(dossier, fam));
    const formes = ["html", "md"].filter((ext) => fichiers.includes(`SQUELETTE.${ext}`));
    const instances = ["html", "md"].filter((ext) => fichiers.includes(`INSTANCE.${ext}`));
    const manquantes = [];
    if (!fichiers.includes("GABARIT.md")) manquantes.push("GABARIT.md");
    if (!instances.length) manquantes.push("INSTANCE.<html|md>");
    for (const ext of formes) if (!instances.includes(ext)) manquantes.push(`INSTANCE.${ext} (le squelette est en .${ext})`);
    if (manquantes.length) {
      findings.push({ regle: "G1", statut: "FAIL", ou: fam, message:
        `pièce(s) manquante(s) : ${manquantes.join(", ")}. Un squelette sans instance n'a jamais été ` +
        "éprouvé — et son absence se lit comme un vert, ce qui est le pire des états" });
      continue;
    }
    findings.push({ regle: "G1", statut: "PASS", ou: fam, message:
      `doctrine + instance(s) .${instances.join(", .")}` + (formes.length ? ` face au squelette .${formes.join(", .")}` : " (famille sans squelette)") });

    const ext = instances[0];
    const inst = sansCommentaires(readFileSync(p(`INSTANCE.${ext}`), "utf8"));
    const squel = formes.includes(ext) ? readFileSync(p(`SQUELETTE.${ext}`), "utf8") : null;
    const reste = RESTES.map((re) => re.exec(inst)).find(Boolean);
    if (reste) {
      findings.push({ regle: "G2", statut: "FAIL", ou: fam, message:
        `l'instance porte un reste de substitution (« ${reste[0].slice(0, 40)} ») — elle n'a pas été ` +
        "remplie, donc elle ne prouve rien du squelette" });
    } else if (squel !== null && inst.trim() === sansCommentaires(squel).trim()) {
      findings.push({ regle: "G2", statut: "FAIL", ou: fam, message:
        "l'instance est la copie exacte du squelette : instancier, c'est REMPLIR, sinon le contrôle " +
        "se joue deux fois sur le même fichier et l'on croit avoir doublé la preuve" });
    } else {
      findings.push({ regle: "G2", statut: "PASS", ou: fam, message: "instance remplie, sans reste de substitution" });
    }

    for (const n of ["SQUELETTE.html", "INSTANCE.html"].filter((f) => fichiers.includes(f))) {
      const r = marquage(p(n));
      if (r.skip) {
        findings.push({ regle: "G3", statut: "SKIP", ou: `${fam}/${n}`, message:
          "socle de marquage ou python introuvable — le contrôle n'a PAS tourné" });
      } else if (r.verdict !== "PASS") {
        findings.push({ regle: "G3", statut: "FAIL", ou: `${fam}/${n}`, message:
          `marquage ${r.verdict} — ${r.detail || "voir check_html.py"}` });
      } else {
        findings.push({ regle: "G3", statut: "PASS", ou: `${fam}/${n}`, message: "marquage PASS" });
      }
    }

    // G4 (TF-0690, 28/08) — LE DOCUMENT LIVRÉ PORTE SON GABARIT ET SA VERSION, VISIBLEMENT.
    // Le fait mesuré : une fiche remise portait sa date et sa référence, rien d'autre — une
    // instance périmée est INVISIBLE SUR L'ARTEFACT, un lecteur qui la tient ne peut pas savoir
    // si elle respecte le catalogue en vigueur. Et la section R-46 du gabarit de retours demande
    // de reporter le couple : un produit dont le document ne le porte pas ne peut répondre que
    // « aucun », ce qui rend muet le seul canal d'amélioration des gabarits. C'est le contrôle
    // le moins cher de la chaîne — le seul qui fonctionne sur un document reçu par courriel,
    // hors de tout dépôt. Le squelette DOIT le porter (sinon aucune instance ne l'héritera) ;
    // l'instance le prouve rendu. Un commentaire HTML ne compte pas : il ne se rend pas.
    const ID_GABARIT = /gabarit\s*:\s*(gd-[a-z0-9-]+)/i;
    const VERSION_GABARIT = /version[_ ]du[_ ]gabarit\s*:?\s*\d+\.\d+\.\d+/i;
    for (const n of [...formes.map((e) => `SQUELETTE.${e}`), ...instances.map((e) => `INSTANCE.${e}`)]) {
      const texte = sansCommentaires(readFileSync(p(n), "utf8"));
      const id = ID_GABARIT.exec(texte);
      const manque = [!id && "l'identifiant `gabarit: gd-…`",
        !VERSION_GABARIT.test(texte) && "la `version du gabarit x.y.z`"].filter(Boolean);
      if (manque.length) {
        findings.push({ regle: "G4", statut: "FAIL", ou: `${fam}/${n}`, message:
          `le document ne rend pas ${manque.join(" ni ")} — une instance périmée est invisible ` +
          "sur l'artefact, et la section R-46 des lots de retours devient impossible à remplir. " +
          "Le couple se RETRANSCRIT dans le rendu (pied de page), jamais seulement en commentaire (TF-0690)" });
      } else {
        findings.push({ regle: "G4", statut: "PASS", ou: `${fam}/${n}`,
          message: `porte ${id[1]} et sa version, visibles dans le rendu` });
      }
    }
  }
  if (!familles.length) findings.push({ regle: "G1", statut: "SKIP", ou: dossier, message: "aucune famille de gabarit sous ce dossier" });
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : f.every((x) => x.statut === "SKIP") ? "SKIP" : "PASS");

if (args[0] === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "gab-doc-"));
  const casse = [];
  const PAGE = (titre, corps) => `<!doctype html><html lang="fr"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1"><title>${titre} — 20260824a</title>` +
    `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E">` +
    `<style>body{color:#1a1a1a;background:#fff;font-family:system-ui,sans-serif}main{max-width:70ch;margin:0 auto}</style>` +
    `</head><body><main><h1>${titre}</h1>${corps}</main></body></html>`;
  // Le couple gabarit + version est dû dans le RENDU (G4, TF-0690) : les fixtures le portent,
  // sauf celle qui prouve le sens rouge de la règle.
  const COUPLE = "<p>Gabarit : gd-recette · version du gabarit 1.0.0</p>";
  const poser = (nom, { gabarit = true, squelette = true, instance = "remplie", couple = COUPLE } = {}) => {
    mkdirSync(join(dir, nom), { recursive: true });
    if (gabarit) writeFileSync(join(dir, nom, "GABARIT.md"), "# doctrine\n", "utf8");
    if (squelette) writeFileSync(join(dir, nom, "SQUELETTE.html"), PAGE("Squelette", "<p>Forme.</p>" + couple), "utf8");
    if (instance === "remplie") writeFileSync(join(dir, nom, "INSTANCE.html"), PAGE("Instance", "<p>Contenu réel, mesuré le 24 août 2026.</p>" + couple), "utf8");
    if (instance === "trous") writeFileSync(join(dir, nom, "INSTANCE.html"), PAGE("Instance", "<p>{{contenu.a.remplir}}</p>" + couple), "utf8");
    if (instance === "copie") writeFileSync(join(dir, nom, "INSTANCE.html"), PAGE("Squelette", "<p>Forme.</p>" + couple), "utf8");
  };

  poser("verte");
  let f = juger(dir);
  const g = (r, ou) => f.filter((x) => x.regle === r && x.ou.startsWith(ou));
  if (g("G1", "verte")[0]?.statut !== "PASS") casse.push("une famille complète échoue G1");
  if (g("G2", "verte")[0]?.statut !== "PASS") casse.push("une instance remplie échoue G2 : " + JSON.stringify(g("G2", "verte")[0]));
  if (!g("G4", "verte").every((x) => x.statut === "PASS")) casse.push("un couple gabarit+version rendu échoue G4 — la règle accuse ce qu'elle prescrit");

  // G4, sens rouge : le document ne rend NI l'identifiant NI la version — l'artefact du 27/08.
  poser("sans-couple", { couple: "" });
  f = juger(dir);
  if (!g("G4", "sans-couple").some((x) => x.statut === "FAIL")) {
    casse.push("un document sans gabarit ni version visible passe G4 — l'instance périmée reste invisible sur l'artefact");
  }

  poser("sans-instance", { instance: null });
  f = juger(dir);
  if (!g("G1", "sans-instance").some((x) => x.statut === "FAIL" && /INSTANCE\.html/.test(x.message))) {
    casse.push("un squelette SANS instance ne rend aucun constat — le trou même que l'item décrit");
  }

  poser("a-trous", { instance: "trous" });
  f = juger(dir);
  if (!g("G2", "a-trous").some((x) => x.statut === "FAIL")) casse.push("une instance à trous passe G2");

  poser("copie", { instance: "copie" });
  f = juger(dir);
  if (!g("G2", "copie").some((x) => x.statut === "FAIL")) casse.push("une instance copie du squelette passe G2");

  // G3, sens rouge : une classe posée sans règle CSS — le défaut exact du 24/08, en modèle réduit.
  mkdirSync(join(dir, "classe-nue"), { recursive: true });
  writeFileSync(join(dir, "classe-nue", "GABARIT.md"), "# doctrine\n", "utf8");
  writeFileSync(join(dir, "classe-nue", "SQUELETTE.html"), PAGE("Squelette", '<p class="ch-apprend">Chapeau sans règle.</p>'), "utf8");
  writeFileSync(join(dir, "classe-nue", "INSTANCE.html"), PAGE("Instance", '<p class="ch-apprend">Chapeau sans règle, rempli le 24 août 2026.</p>'), "utf8");
  f = juger(dir);
  const g3 = g("G3", "classe-nue");
  if (g3.every((x) => x.statut === "SKIP")) {
    console.log("Self-test gabarits-documents : 4/5 PASS, G3 non joué (socle de marquage ou python absent — " +
      "il est déclaré, pas supposé)" + (casse.length ? " · CASSE : " + casse.join(" · ") : ""));
    rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
    process.exit(casse.length ? 1 : 0);
  }
  if (!g3.some((x) => x.statut === "FAIL")) casse.push("une classe posée sans règle CSS passe G3 — c'est le défaut mesuré le 24/08");

  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test gabarits-documents : 7/7 PASS (famille complète et remplie → PASS ; squelette sans instance → FAIL ; " +
      "instance à trous → FAIL ; instance copie du squelette → FAIL ; classe posée sans règle CSS → FAIL au marquage ; " +
      "couple gabarit+version rendu → PASS G4 ; document sans le couple → FAIL G4)");
  process.exit(casse.length ? 1 : 0);
}

const findings = juger(args[0] || join(PILOT, "gabarits", "documents"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({
  oracle: "oracle-gabarits-documents",
  version: "1.0.0",
  verdict,
  findings,
  non_juge: [
    "le RENDU des pages : il a son propre contrôle (scripts\\verifier-rendu-instances.mjs) et le " +
    "dupliquer créerait deux vérités sur les familles bloquantes",
    "la justesse du CONTENU d'une instance : un texte d'exemple faux est un défaut de relecture",
    // TF-0696 (28/08) : un non_juge qui renvoie vers un contrôle nommé est une frontière ; un
    // non_juge qui ne renvoie nulle part est un trou avec une étiquette dessus. Le gabarit de la
    // fiche sécurité portait un défaut de mise en page depuis sa création en juillet, et n'a été
    // jugé par RIEN jusqu'à la relecture humaine du 27/08 — précisément parce que cette ligne
    // s'arrêtait à l'exclusion.
    "les FICHES (familles portées par digit-ai-forge-audit, ex. gd-fiche-securite) : leur RENDU " +
    "se juge par `scripts\\verifier-rendu-instances.mjs <dossier de la famille>` (périmètre " +
    "arbitraire depuis TF-0695) et leur marquage par le socle digit-ai-page-html (check_html.py) ; " +
    "leur CONTENU attend le vérificateur de la famille (TF-0701, décidé, chez forge-audit)",
    "les PROMPTS et SQUELETTES DE FORGE : jugés par AUCUN contrôle nommé à ce jour — trou " +
    "DÉCLARÉ et non couvert (TF-0696), à combler famille par famille quand l'une d'elles " +
    "coûtera assez pour mériter son juge",
  ],
}, null, 1));
process.exit(verdict === "FAIL" ? 1 : 0);
