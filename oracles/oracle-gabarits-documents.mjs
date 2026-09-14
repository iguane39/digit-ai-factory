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
 *   G5 · toute famille du CATALOGUE qui déclare produire du `html` porte son `point_de_depart` :
 *        son TYPE (`squelette` · `generateur` · `canevas` · `aucun`) et, sauf pour `aucun`, le
 *        CHEMIN qui le porte, vérifié sur disque. Née le 14/09/2026 d'une mesure qui s'est
 *        trompée : un balayage qui ne cherchait qu'un `SQUELETTE.html` comptait 17 familles sans
 *        point de départ alors qu'il y en a 14 — deux étaient servies par un générateur de
 *        `digit-ai-forge-audit`, une par les canevas d'un skill. *Un point de départ qui vit en
 *        prose dans un champ `sources` n'est trouvable par aucune requête, donc il n'existe pas
 *        pour la machine — et la question « cette famille a-t-elle de quoi démarrer » restait
 *        indécidable.* La règle ne juge pas la QUALITÉ du point de départ, seulement qu'il soit
 *        déclaré et qu'il existe là où il est dit ;
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
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cheminSkillsInstalles } from "../scripts/lib-config-installee.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

const CANDIDATS_SOCLE = [
  join(cheminSkillsInstalles(), "digit-ai-page-html", "scripts", "check_html.py"),
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

const TYPES_DEPART = new Set(["squelette", "generateur", "canevas", "aucun"]);

/**
 * G5 — LE POINT DE DÉPART D'UNE FAMILLE SE DÉCLARE, ET SON CHEMIN EXISTE.
 *
 * Pourquoi le chemin est VÉRIFIÉ et pas seulement exigé : une déclaration qu'on ne teste pas est
 * une affirmation, et c'est exactement ce que le champ `sources` était déjà — de la prose vraie le
 * jour où elle a été écrite. Le test d'existence est ce qui fait la différence entre un champ et
 * un commentaire.
 *
 * Pourquoi un SKIP et pas un FAIL quand le dépôt porteur est absent : un contrôle qui échoue sur
 * ce que le poste ne peut pas réparer apprend à être contourné. Un point de départ porté par un
 * dépôt frère absent est DÉCLARÉ non mesuré, jamais supposé bon.
 */
export function jugerCatalogue(chemin, racineParc) {
  const findings = [];
  if (!existsSync(chemin)) {
    findings.push({ regle: "G5", statut: "SKIP", ou: chemin, message: "catalogue introuvable — le contrôle n'a PAS tourné" });
    return findings;
  }
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  let familles;
  try { familles = lignes.slice(1).map((l) => JSON.parse(l)); }
  catch (e) { findings.push({ regle: "G5", statut: "FAIL", ou: chemin, message: `ligne de catalogue illisible : ${e.message}` }); return findings; }

  const html = familles.filter((f) => (f.formats || []).includes("html"));
  if (!html.length) { findings.push({ regle: "G5", statut: "SKIP", ou: chemin, message: "aucune famille ne déclare produire du html" }); return findings; }

  for (const f of html) {
    const ou = `catalogue/${f.famille}`;
    const d = f.point_de_depart;
    if (!d || typeof d !== "object") {
      findings.push({ regle: "G5", statut: "FAIL", ou, message:
        "aucun `point_de_depart` déclaré — la question « cette famille a-t-elle de quoi démarrer » " +
        "reste indécidable à la machine, et un balayage la tranchera de travers" });
      continue;
    }
    if (!TYPES_DEPART.has(d.type)) {
      findings.push({ regle: "G5", statut: "FAIL", ou, message:
        `type de point de départ inconnu : « ${d.type} » — attendus : ${[...TYPES_DEPART].join(", ")}` });
      continue;
    }
    if (d.type === "aucun") {
      d.chemin
        ? findings.push({ regle: "G5", statut: "FAIL", ou, message:
            `type « aucun » ET un chemin (« ${d.chemin} ») : la déclaration se contredit, l'un des deux est faux` })
        : findings.push({ regle: "G5", statut: "PASS", ou, message: "aucun point de départ — déclaré, donc comptable" });
      continue;
    }
    if (!d.chemin) {
      findings.push({ regle: "G5", statut: "FAIL", ou, message:
        `type « ${d.type} » sans chemin — un point de départ qu'on ne peut pas ouvrir n'en est pas un` });
      continue;
    }
    // CONVENTION DE CHEMIN, écrite ici parce qu'elle a mordu à son premier passage : un chemin
    // est relatif à la RACINE DU PARC et son premier segment nomme son porteur — un dépôt
    // (`digit-ai-factory/…`, `digit-ai-forge-audit/…`) ou le préfixe `skills/` pour un skill
    // installé, dont l'emplacement varie d'un poste à l'autre. Les trois squelettes du pilot
    // avaient été déclarés en chemin relatif au PILOT et la règle les a rendus introuvables :
    // c'est le sens rouge joué sur pièce, et la raison pour laquelle la convention est écrite.
    const versSkills = d.chemin.startsWith("skills/");
    const porteur = versSkills ? cheminSkillsInstalles() : join(racineParc, d.chemin.split("/")[0]);
    const cible = versSkills
      ? join(cheminSkillsInstalles(), d.chemin.slice("skills/".length))
      : join(racineParc, d.chemin);
    if (existsSync(cible)) {
      findings.push({ regle: "G5", statut: "PASS", ou, message: `point de départ « ${d.type} » vérifié : ${d.chemin}` });
    } else if (!existsSync(porteur)) {
      findings.push({ regle: "G5", statut: "SKIP", ou, message:
        `point de départ porté par « ${d.chemin.split("/")[0]} », absent de ce poste — le contrôle n'a PAS tourné` });
    } else {
      findings.push({ regle: "G5", statut: "FAIL", ou, message:
        `point de départ déclaré et INTROUVABLE : ${d.chemin} — une déclaration non vérifiée est une affirmation` });
    }
  }
  return findings;
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

  // --- G5, LES DEUX SENS, sur un catalogue fabriqué : la seule forme qui prouve qu'une règle
  // juge ce qu'elle prétend juger et non le reste de la ligne (doctrine du banc rouge/vert).
  const catDir = mkdtempSync(join(tmpdir(), "gab-cat-"));
  const parc = join(catDir, "parc");
  mkdirSync(join(parc, "depot-pilot", "gabarits", "documents", "fam-ok"), { recursive: true });
  writeFileSync(join(parc, "depot-pilot", "gabarits", "documents", "fam-ok", "SQUELETTE.html"), "<p>vide</p>", "utf8");
  const META = JSON.stringify({ schema: "pilot/gabarits-documents@1", version: "test" });
  const ecrireCat = (nom, familles) => {
    const f = join(catDir, nom);
    writeFileSync(f, [META, ...familles.map((x) => JSON.stringify(x))].join("\n") + "\n", "utf8");
    return f;
  };
  const verdictsG5 = (f) => jugerCatalogue(f, parc).map((x) => x.statut);

  // VERT : les quatre types déclarés, chacun conforme.
  const catVert = ecrireCat("vert.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "squelette", chemin: "depot-pilot/gabarits/documents/fam-ok/SQUELETTE.html" } },
    { famille: "b", formats: ["html"], point_de_depart: { type: "aucun", chemin: null } },
    { famille: "c", formats: ["md"] },
  ]);
  if (verdictsG5(catVert).some((v) => v !== "PASS")) casse.push("G5 accuse un catalogue conforme : " + JSON.stringify(jugerCatalogue(catVert, parc)));

  // ROUGE 1 : une famille html SANS le champ — le trou que la règle existe pour voir.
  const catSansChamp = ecrireCat("r1.jsonl", [{ famille: "a", formats: ["html"] }]);
  if (!verdictsG5(catSansChamp).includes("FAIL")) casse.push("G5 laisse passer une famille html sans point_de_depart");

  // ROUGE 2 : un chemin DÉCLARÉ et introuvable, dans un dépôt PRÉSENT — une affirmation.
  const catFantome = ecrireCat("r2.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "squelette", chemin: "depot-pilot/gabarits/documents/fam-ok/ABSENT.html" } }]);
  if (!verdictsG5(catFantome).includes("FAIL")) casse.push("G5 laisse passer un point de départ déclaré et introuvable");

  // ROUGE 3 : « aucun » ET un chemin — la déclaration se contredit.
  const catContradictoire = ecrireCat("r3.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "aucun", chemin: "depot-pilot/gabarits/documents/fam-ok/SQUELETTE.html" } }]);
  if (!verdictsG5(catContradictoire).includes("FAIL")) casse.push("G5 laisse passer « aucun » accompagné d'un chemin");

  // VERT 2 : un dépôt porteur ABSENT du poste rend SKIP, jamais PASS ni FAIL — un contrôle qui
  // échoue sur ce qu'on ne peut pas réparer apprend à être contourné.
  const catHorsPoste = ecrireCat("v2.jsonl", [
    { famille: "a", formats: ["html"], point_de_depart: { type: "generateur", chemin: "depot-absent/tools/build.mjs" } }]);
  if (!verdictsG5(catHorsPoste).includes("SKIP")) casse.push("G5 ne SKIP pas sur un dépôt porteur absent du poste");

  rmSync(catDir, { recursive: true, force: true, maxRetries: 5 });
  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test gabarits-documents : 12/12 PASS (famille complète et remplie → PASS ; squelette sans instance → FAIL ; " +
      "instance à trous → FAIL ; instance copie du squelette → FAIL ; classe posée sans règle CSS → FAIL au marquage ; " +
      "couple gabarit+version rendu → PASS G4 ; document sans le couple → FAIL G4 ; G5 dans ses CINQ sens — catalogue " +
      "conforme → PASS, famille html sans champ → FAIL, chemin déclaré introuvable → FAIL, « aucun » avec un chemin → FAIL, " +
      "dépôt porteur absent du poste → SKIP et jamais PASS)");
  process.exit(casse.length ? 1 : 0);
}

const dossierJuge = args[0] || join(PILOT, "gabarits", "documents");
// G5 ne se joue que sur le catalogue du pilot : quand l'oracle est pointé sur un dossier
// arbitraire (self-test, périmètre restreint), il n'y a pas de catalogue à juger et le dire
// vaut mieux que de le supposer.
const catalogue = join(PILOT, "gabarits", "documents", "catalogue.jsonl");
const findings = [
  ...juger(dossierJuge),
  ...(dossierJuge === join(PILOT, "gabarits", "documents") ? jugerCatalogue(catalogue, join(PILOT, "..")) : []),
];
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
