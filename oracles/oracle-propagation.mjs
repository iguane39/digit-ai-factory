#!/usr/bin/env node
/**
 * oracle-propagation.mjs — une correction marquée `corrige` se SUIT jusqu'au produit
 * (TF-0689, décidé le 28/08/2026).
 *
 * LE FAIT QUI L'IMPOSE. TF-0506 (« la famille fiche-sécurité déclare deux formats et la forge
 * n'en produit qu'un ») a été corrigé le 23/08, avec « tout produit recevant une fiche
 * sécurité » en bénéficiaires. Le produit explicitement concerné a livré une fiche le 25/08,
 * puis une autre le 27/08 : LES DEUX SANS PDF — à deux et quatre jours de la correction. Trois
 * produits ont remonté la même classe en trois jours. Et le décompte donnait l'échelle : 73
 * items clos portaient des bénéficiaires « tout produit » EN PROSE, donc non interrogeables —
 * on ne pouvait même pas produire la liste des obligations d'un produit. Une correction
 * voyageait quand une session tombait sur le bon fichier, et pas autrement.
 *
 * LE MÉCANISME, mesurable des DEUX côtés (le modèle est R-47, déjà employé pour l'héritage) :
 *
 *   · CÔTÉ REGISTRE — un item clos PEUT porter `criteres_beneficiaires`, une structure fermée
 *     et interrogeable à la place de la prose :
 *       { "familles_de_gabarit": ["gd-fiche-securite"], "types_de_livrable": ["Fiche"] }
 *     `familles_de_gabarit` se confronte au marqueur que G4 (TF-0690) fait rendre dans tout
 *     document (« Gabarit : gd-… ») ; `types_de_livrable` au 2ᵉ segment du nom daté de tout
 *     livrable (règle 25). La prose `produits_beneficiaires` reste licite pour l'humain — mais
 *     elle n'est OPPOSABLE à personne, et c'était tout le défaut.
 *
 *   · CÔTÉ PRODUIT — un manifeste `forge\socle-adopte.jsonl`, une ligne par adoption :
 *       { "tf": "TF-0506", "date_adoption": "2026-08-24",
 *         "preuve": "outils/batir-fiche.py produit html+pdf — commit 1a2b3c4" }
 *     La preuve est un FAIT (fichier, commande, empreinte, commit) — « on l'a fait » sans
 *     preuve ne se distingue pas de « on croit l'avoir fait ».
 *
 *   · LA CONFRONTATION — cet oracle. Il ne juge un produit QUE sur ce que le produit PRODUIT :
 *     un item dont aucun critère ne matche la production rend SANS_OBJET, jamais FAIL — une
 *     obligation universelle non filtrée ferait crier l'oracle sur 29 dépôts et se ferait
 *     désactiver dans la semaine.
 *
 * Règles :
 *   P1 · tout item clos à critères dont un critère MATCHE la production du produit figure au
 *        manifeste, avec une date d'adoption POSTÉRIEURE ou égale à la correction et une
 *        preuve non vide — adopté avant le correctif, ce n'est pas ce correctif ;
 *   P2 · chaque ligne du manifeste est valide et vise un item CONNU du registre — une adoption
 *        qui porte à côté ferait croire une obligation tenue.
 *
 * Ce qu'il ne fait PAS, déclaré :
 *   · il ne VÉRIFIE pas la preuve dans le monde — sa présence est jugée, sa véracité relève
 *     du produit (même frontière que gains_constates au registre) ;
 *   · il ne voit pas un produit qui produit une famille SANS le marqueur G4 — c'est le trou
 *     que G4 ferme côté gabarits du pilot, et que le produit peut rouvrir en le retirant ;
 *   · les items clos SANS critères restent de la prose : rien n'oblige rétroactivement les
 *     673 items archivés avant la convention, et le dire vaut mieux que le simuler.
 *
 * Usage :
 *   node oracles\oracle-propagation.mjs <dossier-produit> [--registre <f>] [--archive <f>]
 *   node oracles\oracle-propagation.mjs --self-test
 * Exit : 0 = PASS ou SANS_OBJET · 1 = FAIL · 2 = erreur d'usage.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");

const ID_GABARIT = /gabarit\s*:\s*(gd-[a-z0-9-]+)/i;
const NOM_DATE = /^(.+?) - (.+?) - \d{8}[a-z]\.[a-z0-9]+$/i;
const SAUTES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next",
  "vendor", ".pytest_cache", ".ruff_cache", "old"]);
const normal = (x) => String(x).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** L'état fusionné du registre (actifs + archive) : un item = sa création + ses maj, en ordre. */
export function itemsClos(registre, archive) {
  const etat = new Map();
  for (const f of [registre, archive]) {
    if (!existsSync(f)) continue;
    for (const brute of readFileSync(f, "utf8").split(/\r?\n/)) {
      if (!brute.trim()) continue;
      let e; try { e = JSON.parse(brute); } catch { continue; }
      if (!e.id) continue;
      etat.set(e.id, { ...(etat.get(e.id) || {}), ...e });
    }
  }
  return etat;
}

/** Ce que le produit PRODUIT : familles (marqueur G4) et types (2ᵉ segment des noms datés). */
export function productionDe(dossier) {
  const familles = new Map();   // gd-… -> premier fichier porteur
  const types = new Map();      // type normalisé -> premier fichier porteur
  const marcher = (d, prof) => {
    if (prof > 6) return;       // borne déclarée : au-delà on balaie un disque, pas un produit
    let entrees; try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.name.startsWith(".") || SAUTES.has(e.name.toLowerCase())) continue;
      const c = join(d, e.name);
      if (e.isDirectory()) { marcher(c, prof + 1); continue; }
      const m = NOM_DATE.exec(e.name);
      if (m) {
        const type = normal(m[2].split(" ")[0]);
        if (type && !types.has(type)) types.set(type, c);
      }
      if ([".html", ".htm", ".md"].includes(extname(e.name).toLowerCase())) {
        let taille; try { taille = statSync(c).size; } catch { continue; }
        if (taille > 4 * 1024 * 1024) continue;   // un document lisible par un humain ; au-delà, une donnée
        let texte; try { texte = readFileSync(c, "utf8"); } catch { continue; }
        const g = ID_GABARIT.exec(texte);
        if (g && !familles.has(g[1].toLowerCase())) familles.set(g[1].toLowerCase(), c);
      }
    }
  };
  marcher(dossier, 0);
  return { familles, types };
}

/** Le manifeste d'adoption du produit — lignes {tf, date_adoption, preuve}. */
export function lireManifeste(dossier) {
  const chemin = join(dossier, "forge", "socle-adopte.jsonl");
  if (!existsSync(chemin)) return { present: false, lignes: [], invalides: [] };
  const lignes = [], invalides = [];
  readFileSync(chemin, "utf8").split(/\r?\n/).forEach((brute, i) => {
    if (!brute.trim()) return;
    let l; try { l = JSON.parse(brute); } catch { invalides.push(`ligne ${i + 1} : JSON invalide`); return; }
    const manque = [!/^TF-\d{4}$/.test(String(l.tf)) && "`tf` (format TF-xxxx)",
      !/^\d{4}-\d{2}-\d{2}/.test(String(l.date_adoption || "")) && "`date_adoption` (ISO)",
      !String(l.preuve || "").trim() && "`preuve` (fichier, commande, empreinte ou commit)"]
      .filter(Boolean);
    if (manque.length) invalides.push(`ligne ${i + 1} : ${manque.join(", ")} manquant(s) ou mal formé(s)`);
    else lignes.push(l);
  });
  return { present: true, lignes, invalides };
}

export function juger(dossier, registre, archive) {
  const findings = [];
  const etat = itemsClos(registre, archive);
  const aCriteres = [...etat.values()].filter((e) =>
    ["corrige", "archive"].includes(e.statut) && e.criteres_beneficiaires
    && typeof e.criteres_beneficiaires === "object");
  const production = productionDe(dossier);
  const manifeste = lireManifeste(dossier);

  // P2 — le manifeste lui-même : lignes valides, items connus.
  for (const inv of manifeste.invalides) {
    findings.push({ regle: "P2", statut: "FAIL", ou: "forge/socle-adopte.jsonl",
      message: `${inv} — une adoption sans son fait n'est pas une adoption, c'est une déclaration` });
  }
  for (const l of manifeste.lignes) {
    if (!etat.has(l.tf)) {
      findings.push({ regle: "P2", statut: "FAIL", ou: "forge/socle-adopte.jsonl",
        message: `l'adoption vise « ${l.tf} », id INCONNU du registre — elle porte à côté, et le ` +
          "premier lecteur croirait une obligation tenue" });
    }
  }
  if (manifeste.present && !manifeste.invalides.length
      && manifeste.lignes.every((l) => etat.has(l.tf))) {
    findings.push({ regle: "P2", statut: "PASS", ou: "forge/socle-adopte.jsonl",
      message: `${manifeste.lignes.length} adoption(s) déclarée(s), toutes valides et connues du registre` });
  }

  // P1 — les obligations que la PRODUCTION du produit fait naître.
  let concernes = 0;
  for (const item of aCriteres) {
    const cr = item.criteres_beneficiaires;
    const touches = [];
    for (const fam of cr.familles_de_gabarit || []) {
      const piece = production.familles.get(String(fam).toLowerCase());
      if (piece) touches.push(`famille ${fam} (produite : ${basename(piece)})`);
    }
    for (const type of cr.types_de_livrable || []) {
      const piece = production.types.get(normal(type));
      if (piece) touches.push(`type « ${type} » (produit : ${basename(piece)})`);
    }
    if (!touches.length) continue;                 // ce produit n'est pas concerné par cet item
    concernes += 1;
    const adoption = manifeste.lignes.find((l) => l.tf === item.id);
    if (!adoption) {
      findings.push({ regle: "P1", statut: "FAIL", ou: item.id,
        message: `correction du ${item.date_correction || "?"} NON ADOPTÉE par ce produit, qui est ` +
          `pourtant concerné — ${touches.join(" ; ")}. Déclarer l'adoption dans ` +
          "`forge\\socle-adopte.jsonl` ({tf, date_adoption, preuve}), ou remonter pourquoi elle ne " +
          "s'applique pas. Sans cette ligne, la correction ne voyage que si une session tombe " +
          "sur le bon fichier (TF-0689)" });
    } else if (item.date_correction && String(adoption.date_adoption) < String(item.date_correction)) {
      findings.push({ regle: "P1", statut: "FAIL", ou: item.id,
        message: `adoption datée ${adoption.date_adoption}, ANTÉRIEURE à la correction du ` +
          `${item.date_correction} — ce qui a été adopté n'est pas ce correctif` });
    } else {
      findings.push({ regle: "P1", statut: "PASS", ou: item.id,
        message: `adopté le ${adoption.date_adoption} — preuve : ${String(adoption.preuve).slice(0, 120)}` });
    }
  }
  if (!aCriteres.length) {
    findings.push({ regle: "P1", statut: "SANS_OBJET", ou: "-",
      message: "aucun item clos ne porte encore `criteres_beneficiaires` — la convention vaut " +
        "pour les clôtures à venir, et les 600+ items archivés avant elle restent de la prose (déclaré)" });
  } else if (!concernes) {
    findings.push({ regle: "P1", statut: "SANS_OBJET", ou: "-",
      message: `${aCriteres.length} item(s) à critères au registre, AUCUN ne matche la production ` +
        "de ce produit — pas d'obligation sans production concernée" });
  }
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.every((x) => x.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS");

const NON_JUGE = [
  "la VÉRACITÉ des preuves d'adoption — leur présence est jugée, le monde relève du produit " +
  "(même frontière que gains_constates)",
  "un produit qui produit une famille SANS le marqueur G4 « Gabarit : gd-… » — G4 ferme ce trou " +
  "côté gabarits du pilot, le produit peut le rouvrir en retirant le marqueur",
  "les items clos SANS criteres_beneficiaires (dont tout l'archivé d'avant la convention) — " +
  "leur prose n'est opposable à personne, et c'était le défaut mesuré",
];

// ---- self-test : les deux sens, sur un parc et un registre fabriqués ------------------------
const args = process.argv.slice(2);
if (args[0] === "--self-test") {
  const T = mkdtempSync(join(tmpdir(), "propagation-"));
  const casse = [];
  const reg = join(T, "TODO.jsonl");
  const arch = join(T, "TODO-ARCHIVE.jsonl");
  writeFileSync(reg, [
    JSON.stringify({ ev: "creation", ts: "2026-08-22T10:00:00Z", id: "TF-0100", statut: "candidat", titre: "t" }),
    JSON.stringify({ ev: "maj", ts: "2026-08-23T10:00:00Z", id: "TF-0100", statut: "corrige",
      date_correction: "2026-08-23",
      criteres_beneficiaires: { familles_de_gabarit: ["gd-fiche-securite"], types_de_livrable: ["Fiche"] } }),
  ].join("\n") + "\n", "utf8");
  writeFileSync(arch, "", "utf8");

  const produit = (nom, { doc = null, nomDoc = "Client - Fiche Securite - 20260825a.html", manifeste = null } = {}) => {
    const d = join(T, nom);
    mkdirSync(join(d, "output"), { recursive: true });
    mkdirSync(join(d, "forge"), { recursive: true });
    if (doc !== null) writeFileSync(join(d, "output", nomDoc), doc, "utf8");
    if (manifeste !== null) writeFileSync(join(d, "forge", "socle-adopte.jsonl"), manifeste, "utf8");
    return d;
  };
  const DOC = "<footer>Gabarit : gd-fiche-securite · version du gabarit 1.0.0</footer>";
  const j = (d) => juger(d, reg, arch);
  const de = (f, regle) => f.filter((x) => x.regle === regle);

  // rouge P1 — le produit produit la famille, aucun manifeste : la scène des 25 et 27/08.
  let f = j(produit("rouge", { doc: DOC }));
  if (!de(f, "P1").some((x) => x.statut === "FAIL" && /NON ADOPTÉE/.test(x.message))) {
    casse.push("un produit concerné sans manifeste passe P1 — la correction continue de ne pas voyager");
  }
  // verte — adoption postérieure à la correction, preuve écrite.
  f = j(produit("verte", { doc: DOC,
    manifeste: JSON.stringify({ tf: "TF-0100", date_adoption: "2026-08-24", preuve: "batir-fiche produit html+pdf, commit 1a2b3c4" }) + "\n" }));
  if (verdictDe(f) !== "PASS") casse.push("une adoption prouvée ne rend pas PASS : " + JSON.stringify(f));
  // rouge P1 — adoption ANTÉRIEURE à la correction.
  f = j(produit("antidate", { doc: DOC,
    manifeste: JSON.stringify({ tf: "TF-0100", date_adoption: "2026-08-20", preuve: "p" }) + "\n" }));
  if (!de(f, "P1").some((x) => x.statut === "FAIL" && /ANTÉRIEURE/.test(x.message))) {
    casse.push("une adoption antidatée passe — ce qui a été adopté n'est pas ce correctif");
  }
  // rouge P2 — une adoption qui vise un id inconnu.
  f = j(produit("acote", { doc: DOC,
    manifeste: JSON.stringify({ tf: "TF-9999", date_adoption: "2026-08-24", preuve: "p" }) + "\n" }));
  if (!de(f, "P2").some((x) => x.statut === "FAIL" && /INCONNU/.test(x.message))) {
    casse.push("une adoption vers un id inconnu passe P2 — elle porte à côté en silence");
  }
  // borne — le critère TYPE matche par le nom daté, même sans marqueur G4.
  f = j(produit("par-type", { doc: "<p>sans marqueur</p>", nomDoc: "Client - Fiche Securite - 20260826a.md" }));
  if (!de(f, "P1").some((x) => x.statut === "FAIL" && /type « Fiche »/.test(x.message))) {
    casse.push("le critère types_de_livrable ne matche pas un nom daté");
  }
  // borne — un produit qui ne produit RIEN de concerné : SANS_OBJET, jamais FAIL.
  f = j(produit("hors-sujet", { doc: "<p>rien</p>", nomDoc: "notes.html" }));
  if (!de(f, "P1").some((x) => x.statut === "SANS_OBJET")) {
    casse.push("un produit non concerné n'est pas SANS_OBJET — l'oracle crierait sur 29 dépôts");
  }
  // borne — manifeste à ligne invalide : le défaut est nommé, ligne par ligne.
  f = j(produit("invalide", { doc: DOC, manifeste: '{"tf":"TF-0100"}\n' }));
  if (!de(f, "P2").some((x) => x.statut === "FAIL" && /date_adoption|preuve/.test(x.message))) {
    casse.push("une ligne de manifeste sans date ni preuve passe P2");
  }
  // borne — registre sans AUCUN item à critères : SANS_OBJET déclaré, pas un vert muet.
  const regVide = join(T, "TODO-vide.jsonl");
  writeFileSync(regVide, JSON.stringify({ ev: "creation", ts: "2026-08-22T10:00:00Z", id: "TF-0200", statut: "candidat", titre: "t" }) + "\n", "utf8");
  f = juger(join(T, "verte"), regVide, arch);
  if (!de(f, "P1").some((x) => x.statut === "SANS_OBJET" && /convention/.test(x.message))) {
    casse.push("un registre sans critères ne déclare pas la borne — indiscernable d'un parc conforme");
  }

  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test propagation : 8/8 PASS (concerné sans manifeste → FAIL ; adoption prouvée → PASS ; " +
      "antidatée → FAIL ; id inconnu → FAIL ; match par type → FAIL ; non concerné → SANS_OBJET ; " +
      "ligne invalide → FAIL ; registre sans critères → SANS_OBJET déclaré)");
  process.exit(casse.length ? 1 : 0);
}

// ---- exécution ------------------------------------------------------------------------------
const jsonOnly = args.includes("--json");
const iR = args.indexOf("--registre");
const iA = args.indexOf("--archive");
const registre = iR > -1 ? args[iR + 1] : join(PILOT, "todo", "TODO.jsonl");
const archive = iA > -1 ? args[iA + 1] : join(PILOT, "todo", "TODO-ARCHIVE.jsonl");
// Le piège mesuré deux fois en deux jours (TF-0695 hier, ici aujourd'hui) : quand un drapeau
// est ABSENT, son index vaut -1 et « index du drapeau + 1 » vaut 0 — c'est le premier argument
// positionnel qui se fait exclure. La garde sur -1 n'est pas une élégance, c'est le correctif.
const dossier = args.find((a, i) => !a.startsWith("--")
  && (iR === -1 || i !== iR + 1) && (iA === -1 || i !== iA + 1));
if (!dossier || !existsSync(dossier)) {
  console.error("usage : node oracles\\oracle-propagation.mjs <dossier-produit> [--registre <f>] [--archive <f>] | --self-test");
  process.exit(2);
}
const findings = juger(dossier, registre, archive);
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-propagation", version: "1.0.0", cible: dossier,
  verdict, findings, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
process.exit(verdict === "FAIL" ? 1 : 0);
