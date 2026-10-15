#!/usr/bin/env node
/**
 * oracle-fiche-produit — une fiche produit (famille `gd-fiche-produit`) se recompte sur ses propres
 * exigences.
 *
 * LE FAIT (14/10/2026, lot `Produit-83 - RETOURS - 20261014a`, RT-1, TF-1712). Le gabarit 1.0.0
 * prescrivait `oracle-couverture-exigences.mjs` pour juger le fond de la fiche. Cet oracle juge le
 * référentiel `references\EXIGENCES-PROJET.json` du pilot (C1 à C5), jamais la fiche d'un produit :
 * le recomptage que la section « Avant de remettre » exige (points 1 et 2) n'avait aucun juge. Le
 * run en a écrit un pour son propre compte (`controler-fiche.mjs`, F1 à F4). Celui-ci le verse au
 * pilot, pour toutes les fiches.
 *
 * CE QUE L'ORACLE JUGE, sur une fiche rendue en HTML (squelette du gabarit) ou écrite en Markdown
 * (chapitres en titres `##`, tableaux à barres verticales) :
 *   FP1 · le chapitre « Toutes les exigences » porte un tableau avec les colonnes Id, Palier et
 *         Statut : sans elles, rien ne se recompte ;
 *   FP2 · les chiffres du chapitre « En bref » se recomptent : « N exigences » sur les lignes du
 *         chapitre 5, « N au palier X » palier par palier, « N hypothèses » sur les lignes du
 *         chapitre 6 (point 1 de « Avant de remettre ») ;
 *   FP3 · le tableau « Domaines et socle » se recompte domaine par domaine et palier par palier sur
 *         le chapitre 5, chaque Total vaut la somme de sa ligne, et aucun domaine n'existe d'un seul
 *         côté (point 1) ;
 *   FP4 · les hypothèses se croisent : chaque exigence dont le statut n'est pas `fait constaté` est
 *         conditionnée par une ligne du chapitre 6, et chaque ligne du chapitre 6 renvoie à une
 *         exigence du chapitre 5 qui n'est pas `fait constaté` (point 2) ;
 *   FP5 · chaque exigence porte un statut du vocabulaire fermé et un critère de recette non vide ;
 *   FP6 · chaque brique du chapitre 2 porte la date de son relevé (point 3) ;
 *   FP7 · aucun emplacement `{…}` ne reste dans le texte (point 5).
 *
 * Contrat : JSON {oracle, version, cible, verdict, findings[], mesures, non_juge[]} · exit 0 PASS,
 * 1 FAIL, 2 non jugeable (fichier absent ou illisible).
 * Usage : node oracles\oracle-fiche-produit.mjs <fiche.html|fiche.md>
 *         node oracles\oracle-fiche-produit.mjs --self-test
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "1.0.0";
const ICI = dirname(fileURLToPath(import.meta.url));

/** Le vocabulaire fermé du statut d'une exigence (GABARIT.md, « Les vocabulaires fermés »).
 *  `présent dans la base` (TF-1710, gabarit 1.1.0) : la fonction existe dans le code ou le produit de
 *  base, sans essai dans ce produit ; elle se lève au chapitre 6 comme une hypothèse (FP4). */
export const STATUTS = ["fait constaté", "présent dans la base", "hypothèse"];
const CONSTATE = "fait constate";

const NORMALISER = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[  ]/g, " ").replace(/\s+/g, " ").trim();
const ENTITES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", rsquo: "’", laquo: "«", raquo: "»" };
const decoder = (s) => String(s)
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENTITES[n.toLowerCase()] ?? m);
const texteHtml = (s) => decoder(String(s).replace(/<br\s*\/?>/gi, " ").replace(/<\/li>/gi, " ; ").replace(/<[^>]+>/g, " "))
  .replace(/\s+/g, " ").trim();
const texteMd = (s) => String(s).replace(/`([^`]*)`/g, "$1").replace(/\*\*|__|\*|_(?=\S)|(?<=\S)_/g, "").replace(/\s+/g, " ").trim();

/** Le corps lisible : sans styles, scripts, commentaires ni blocs de code. */
function nettoyer(texte, html) {
  const t = String(texte).replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, " ");
  return html
    ? t.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<head[\s\S]*?<\/head>/i, " ")
    : t.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^```[\s\S]*?^```/gm, " ");
}

/** Les tableaux d'un fragment : [{ entetes: [..], lignes: [[..]] }]. */
function tableauxHtml(fragment) {
  const sortie = [];
  for (const [table] of fragment.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const entetes = [...table.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => texteHtml(m[1]));
    const lignes = [];
    for (const [, tr] of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cellules = [...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => texteHtml(m[1]));
      if (cellules.length) lignes.push(cellules);
    }
    sortie.push({ entetes, lignes });
  }
  return sortie;
}
function tableauxMd(fragment) {
  const sortie = [];
  const lignes = fragment.split("\n");
  const cellules = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => texteMd(c.replace(/\\\|/g, "|")));
  for (let i = 0; i < lignes.length; i++) {
    if (!/^\s*\|/.test(lignes[i]) || !/^\s*\|?\s*:?-{2,}/.test(lignes[i + 1] || "")) continue;
    const t = { entetes: cellules(lignes[i]), lignes: [] };
    let j = i + 2;
    for (; j < lignes.length && /^\s*\|/.test(lignes[j]); j++) t.lignes.push(cellules(lignes[j]));
    sortie.push(t);
    i = j - 1;
  }
  return sortie;
}

/** Les chapitres : [{ titre (normalisé), texte (lisible), tableaux }]. */
export function chapitres(source) {
  const html = /<(?:html|section|table|h2)\b/i.test(source);
  const t = nettoyer(source, html);
  const marques = html
    ? [...t.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => ({ i: m.index, fin: m.index + m[0].length, titre: texteHtml(m[1]) }))
    : [...t.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ i: m.index, fin: m.index + m[0].length, titre: texteMd(m[1]) }));
  return marques.map((m, k) => {
    const fragment = t.slice(m.fin, k + 1 < marques.length ? marques[k + 1].i : t.length);
    return {
      titre: NORMALISER(m.titre).replace(/^[\d.\s)-]+/, ""),
      texte: html ? texteHtml(fragment) : texteMd(fragment),
      tableaux: html ? tableauxHtml(fragment) : tableauxMd(fragment),
    };
  });
}

const chapitre = (chs, cle) => chs.find((c) => c.titre.startsWith(cle) || c.titre.includes(cle));
/** L'indice de la première colonne dont l'en-tête normalisé commence par l'un des préfixes. */
const colonne = (table, ...prefixes) => table.entetes.findIndex((e) => prefixes.some((p) => NORMALISER(e).startsWith(p)));
const tableAvec = (ch, ...prefixes) => (ch?.tableaux || []).find((t) => colonne(t, ...prefixes) >= 0);
const VIDE = /^(?:|[-–—?]+|n\/?a|a definir|a completer)$/;
const DATE = /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{1,2}(?:er)? (?:janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre) \d{4}\b/;
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function juger(source) {
  const findings = [];
  const mesures = {};
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
  const chs = chapitres(source);

  // FP1 — le référentiel de la fiche, sans lequel rien ne se recompte.
  const ch5 = chapitre(chs, "toutes les exigences");
  const t5 = tableAvec(ch5, "id", "identifiant");
  const iId = t5 ? colonne(t5, "id", "identifiant") : -1;
  const iPal = t5 ? colonne(t5, "palier") : -1;
  const iStat = t5 ? colonne(t5, "statut") : -1;
  const iDom = t5 ? colonne(t5, "domaine") : -1;
  const iCrit = t5 ? colonne(t5, "critere") : -1;
  if (!ch5 || !t5 || iPal < 0 || iStat < 0) {
    ko("FP1", ch5 ? "chapitre « Toutes les exigences »" : "fiche",
      (ch5 ? "le tableau du chapitre ne porte pas les colonnes Id, Palier et Statut" : "aucun chapitre « Toutes les exigences »") +
      " : la fiche n'a rien sur quoi se recompter (GABARIT.md, chapitre 5)");
    findings.push({ regle: "FP2-FP6", statut: "SKIP", ou: "fiche", message: "non joués : le chapitre 5 est illisible (FP1)" });
    return { findings, mesures };
  }
  ok("FP1", "chapitre « Toutes les exigences »", `${t5.lignes.length} exigence(s), colonnes Id, Palier et Statut lues`);
  const exigences = t5.lignes.map((l) => ({
    id: (l[iId] || "").trim(), palier: NORMALISER(l[iPal] || ""), statut: NORMALISER(l[iStat] || ""),
    domaine: iDom >= 0 ? NORMALISER(l[iDom] || "") : null, critere: iCrit >= 0 ? NORMALISER(l[iCrit] || "") : null,
  }));
  const parPalier = new Map();
  for (const e of exigences) parPalier.set(e.palier, (parPalier.get(e.palier) || 0) + 1);
  const ch6 = chapitre(chs, "hypotheses");
  const t6 = tableAvec(ch6, "exigence");
  mesures.exigences = exigences.length;
  mesures.par_palier = Object.fromEntries(parPalier);
  mesures.hypotheses = t6 ? t6.lignes.length : 0;

  // FP2 — les chiffres d'« En bref ».
  const ch1 = chapitre(chs, "en bref");
  if (!ch1) ko("FP2", "fiche", "aucun chapitre « En bref » : les chiffres de la fiche n'ont pas d'endroit où se lire");
  else {
    const txt = NORMALISER(ch1.texte);
    const lus = [];
    const total = /(\d+) exigences?(?! (?:au|du) palier)/.exec(txt);
    if (total) lus.push(["exigences", Number(total[1]), exigences.length]);
    for (const m of txt.matchAll(/(\d+) (?:exigences? )?au palier ([a-z0-9]+)/g)) lus.push([`palier ${m[2].toUpperCase()}`, Number(m[1]), parPalier.get(m[2]) || 0]);
    const hyp = /(\d+) hypotheses?\b/.exec(txt);
    if (hyp) lus.push(["hypothèses", Number(hyp[1]), mesures.hypotheses]);
    if (!lus.length) findings.push({ regle: "FP2", statut: "SKIP", ou: "chapitre « En bref »",
      message: "aucun chiffre lu sous la forme du squelette (« N exigences », « N au palier X », « N hypothèses ») : recomptage non joué" });
    for (const [quoi, annonce, compte] of lus) {
      if (annonce !== compte) ko("FP2", "chapitre « En bref »", `${quoi} : ${annonce} annoncé(s), ${compte} compté(s) sur ${quoi === "hypothèses" ? "le chapitre « Hypothèses à lever »" : "le chapitre « Toutes les exigences »"} — c'est la fiche qui est fausse, jamais le référentiel`);
    }
    if (lus.length && lus.every(([, a, c]) => a === c)) ok("FP2", "chapitre « En bref »", `${lus.length} chiffre(s) recompté(s) juste`);
  }

  // FP3 — le tableau « Domaines et socle ».
  const ch3 = chapitre(chs, "domaines");
  const t3 = tableAvec(ch3, "domaine");
  if (!ch3 || !t3) ko("FP3", ch3 ? "chapitre « Domaines et socle »" : "fiche", "aucun tableau des domaines à recompter (GABARIT.md, chapitre 3)");
  else if (iDom < 0) ko("FP3", "chapitre « Toutes les exigences »", "pas de colonne Domaine : le chapitre 3 ne peut pas se recompter");
  else {
    const iD3 = colonne(t3, "domaine");
    const iTot = colonne(t3, "total");
    const cols = t3.entetes.map((e, i) => ({ i, palier: NORMALISER(e) })).filter((c) => parPalier.has(c.palier) || /^(mvp|v\d+)$/.test(c.palier));
    const domaines5 = new Set(exigences.map((e) => e.domaine));
    const vus = new Set();
    let ecarts = 0;
    for (const l of t3.lignes) {
      const dom = NORMALISER(l[iD3] || "");
      vus.add(dom);
      if (!domaines5.has(dom)) { ko("FP3", `domaine « ${l[iD3]} »`, "aucune exigence de ce domaine au chapitre « Toutes les exigences » (domaine absent ou nommé autrement)"); ecarts++; continue; }
      let somme = 0;
      for (const c of cols) {
        const annonce = Number((l[c.i] || "").replace(/[^\d]/g, "") || NaN);
        const compte = exigences.filter((e) => e.domaine === dom && e.palier === c.palier).length;
        somme += Number.isFinite(annonce) ? annonce : 0;
        if (annonce !== compte) { ko("FP3", `domaine « ${l[iD3]} », palier ${c.palier.toUpperCase()}`, `${l[c.i]} annoncé, ${compte} compté au chapitre « Toutes les exigences »`); ecarts++; }
      }
      if (iTot >= 0) {
        const tot = Number((l[iTot] || "").replace(/[^\d]/g, "") || NaN);
        const compte = exigences.filter((e) => e.domaine === dom).length;
        if (tot !== somme || tot !== compte) { ko("FP3", `domaine « ${l[iD3]} », Total`, `${l[iTot]} annoncé, ${somme} en somme de la ligne, ${compte} compté au chapitre « Toutes les exigences »`); ecarts++; }
      }
    }
    for (const d of domaines5) if (!vus.has(d)) { ko("FP3", `domaine « ${d} »`, "présent au chapitre « Toutes les exigences », absent du tableau des domaines"); ecarts++; }
    if (!ecarts) ok("FP3", "chapitre « Domaines et socle »", `${t3.lignes.length} domaine(s) recompté(s) juste`);
  }

  // FP4 — les hypothèses se croisent avec les exigences qu'elles conditionnent.
  {
    const nonConstatees = exigences.filter((e) => e.statut !== CONSTATE && e.id);
    const references = new Set();
    let ecarts = 0;
    if (t6) {
      const iEx = colonne(t6, "exigence");
      for (const l of t6.lignes) {
        const cellule = l[iEx] || "";
        const cites = exigences.filter((e) => e.id && new RegExp(`(^|[^\\w-])${echapper(e.id)}(?![\\w-])`).test(cellule));
        if (!cites.length) { ko("FP4", `hypothèse « ${l[0]} »`, `renvoie à « ${cellule} », qui n'est aucune exigence du chapitre « Toutes les exigences »`); ecarts++; }
        for (const e of cites) {
          references.add(e.id);
          if (e.statut === CONSTATE) { ko("FP4", `hypothèse « ${l[0]} »`, `conditionne ${e.id}, déclarée « fait constaté » : une exigence conditionnée n'est pas constatée`); ecarts++; }
        }
      }
    }
    for (const e of nonConstatees) {
      if (!references.has(e.id)) { ko("FP4", `exigence ${e.id}`, `statut « ${e.statut} » sans ligne au chapitre « Hypothèses à lever » qui dise qui la lève et avant quand`); ecarts++; }
    }
    if (!ecarts) ok("FP4", "chapitres 5 et 6", `${nonConstatees.length} exigence(s) non constatée(s), chacune conditionnée par une hypothèse ; aucune hypothèse orpheline`);
  }

  // FP5 — vocabulaire fermé du statut, critère de recette dû à chaque ligne.
  {
    const admis = new Set(STATUTS.map(NORMALISER));
    let ecarts = 0;
    for (const e of exigences) {
      if (!admis.has(e.statut)) { ko("FP5", `exigence ${e.id}`, `statut « ${e.statut} » hors du vocabulaire fermé (${STATUTS.join(", ")})`); ecarts++; }
      if (e.critere === null || VIDE.test(e.critere)) { ko("FP5", `exigence ${e.id}`, "sans critère de recette : une exigence sans critère est une intention (GABARIT.md, « Les refus »)"); ecarts++; }
    }
    if (!ecarts) ok("FP5", "chapitre « Toutes les exigences »", "statuts au vocabulaire fermé, critère de recette à chaque ligne");
  }

  // FP6 — les briques en place portent la date de leur relevé.
  {
    const ch2 = chapitre(chs, "briques");
    const t2 = tableAvec(ch2, "releve");
    if (!ch2) ko("FP6", "fiche", "aucun chapitre « Briques en place »");
    else if (!t2) { if ((ch2.tableaux || []).some((t) => t.lignes.length)) ko("FP6", "chapitre « Briques en place »", "le tableau ne porte pas de colonne Relevé"); else ok("FP6", "chapitre « Briques en place »", "aucune brique relevée"); }
    else {
      const iR = colonne(t2, "releve");
      const sans = t2.lignes.filter((l) => !DATE.test(NORMALISER(l[iR] || "")));
      for (const l of sans) ko("FP6", `brique « ${l[0]} »`, `relevé « ${l[iR]} » sans date : une brique sans date de relevé ne figure pas`);
      if (!sans.length) ok("FP6", "chapitre « Briques en place »", `${t2.lignes.length} brique(s) datée(s)`);
    }
  }

  // FP7 — aucun emplacement resté vide.
  {
    const html = /<(?:html|section|table|h2)\b/i.test(source);
    const visible = html ? texteHtml(nettoyer(source, true)) : texteMd(nettoyer(source, false));
    const restes = [...visible.matchAll(/\{[^{}\n]{1,80}\}/g)].map((m) => m[0]);
    if (restes.length) ko("FP7", "fiche", `${restes.length} emplacement(s) non rempli(s), dont « ${restes[0]} »`);
    else ok("FP7", "fiche", "aucun emplacement {…} restant");
  }
  return { findings, mesures };
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS");

export const NON_JUGE = [
  "que le chapitre « Toutes les exigences » soit FIDÈLE au référentiel du produit (forge\\EXIGENCES.json) : l'oracle recompte la fiche sur elle-même, il ne rouvre pas le référentiel",
  "qu'un critère de recette soit testable ou mesure ce que veut le commanditaire : FP5 exige qu'il soit écrit, pas qu'il soit bon",
  "qu'une exigence `fait constaté` le soit vraiment : la source citée n'est pas relue",
  "les chiffres écrits hors de la forme du squelette (« trente-six exigences », un tableau de synthèse) : FP2 rend SKIP quand il n'en lit aucun, il ne devine pas",
  "le rendu et le marquage de la page : check_html.py et render_page.py du socle digit-ai-page-html",
];

// --- recette à double sens : la verte est l'INSTANCE de la famille, chaque rouge fait échouer SA règle ---
const FAMILLE = join(ICI, "..", "gabarits", "documents", "fiche-produit");
export const FIXTURE_MD = `---
gabarit: gd-fiche-produit
role_destinataire: le commanditaire, qui valide le périmètre
---

# Produit-X — Fiche produit

## 1. En bref

- **3 exigences**, chacune avec un critère de recette
- **2 au palier MVP**, le premier à construire
- **1 au palier V1**, la version suivante
- **1 hypothèse** à confirmer avant de construire

## 2. Briques en place

| Brique | Usage actuel | Rôle dans le produit | Relevé |
|---|---|---|---|
| Passerelle amont | Routage des appels | Base du produit | dépôt lu le 2026-10-14 |

## 3. Domaines et socle

| Domaine | Besoin | MVP | V1 | Total |
|---|---|---:|---:|---:|
| Routage | Router les appels | 1 | 1 | 2 |
| Socle | Exploiter le service | 1 | 0 | 1 |

## 5. Toutes les exigences

| Id | Domaine | Palier | Comportement attendu | Critère de recette | Statut |
|---|---|---|---|---|---|
| EF-01 | Routage | MVP | Route un appel | L'appel arrive au fournisseur | fait constaté |
| EF-02 | Routage | V1 | Bascule de fournisseur | La bascule se fait en 5 s | hypothèse |
| ENF-01 | Socle | MVP | Expose sa santé | La sonde rend 200 | fait constaté |

## 6. Hypothèses à lever

| Id | Hypothèse | Exigence conditionnée | Qui peut la lever | Avant quand |
|---|---|---|---|---|
| H-01 | Deux fournisseurs sont contractés | EF-02 | Le commanditaire | avant le palier V1 |

*Gabarit : gd-fiche-produit · version du gabarit 1.1.0*
`;

function selfTest() {
  const cas = [];
  const instance = readFileSync(join(FAMILLE, "INSTANCE.html"), "utf8");
  const squelette = readFileSync(join(FAMILLE, "SQUELETTE.html"), "utf8");
  const verte = (nom, source) => {
    const r = juger(source);
    const ok = verdictDe(r.findings) === "PASS";
    cas.push({ nom: `cas vert — ${nom}`, attendu: "PASS", ok, detail: ok ? "" : JSON.stringify(r.findings.filter((f) => f.statut === "FAIL")) });
  };
  const rouge = (nom, regle, source) => {
    const r = juger(source);
    cas.push({ nom: `cas rouge — ${nom}`, attendu: `${regle} FAIL`, ok: r.findings.some((f) => f.regle === regle && f.statut === "FAIL") });
  };
  const muter = (src, avant, apres) => {
    if (!src.includes(avant)) throw new Error(`fixture : ancre introuvable « ${avant.slice(0, 50)} »`);
    return src.replace(avant, apres);
  };
  verte("INSTANCE.html de la famille (le remède : une fiche recomptée)", instance);
  verte("fiche Markdown, identifiants EF/ENF", FIXTURE_MD);
  rouge("total d'En bref faux", "FP2", muter(instance, "<li>6 exigences,", "<li>7 exigences,"));
  rouge("palier d'En bref faux", "FP2", muter(instance, "<li>4 au palier MVP", "<li>5 au palier MVP"));
  rouge("nombre d'hypothèses faux", "FP2", muter(instance, "<li>3 hypothèses", "<li>2 hypothèses"));
  rouge("total Markdown faux", "FP2", muter(FIXTURE_MD, "**3 exigences**", "**4 exigences**"));
  rouge("domaine recompté faux", "FP3", muter(instance, `<td data-label="MVP">2</td>`, `<td data-label="MVP">3</td>`));
  rouge("domaine nommé autrement d'un chapitre à l'autre", "FP3", muter(instance, `<td data-label="Domaine">Messages</td><td data-label="Besoin`, `<td data-label="Domaine">Messagerie</td><td data-label="Besoin`));
  rouge("hypothèse retirée, exigence orpheline", "FP4", muter(instance, /<tr><td data-label="Id">H-03<\/td>[\s\S]*?<\/tr>/.exec(instance)?.[0] ?? "<tr><td data-label=\"Id\">H-03</td>", ""));
  rouge("hypothèse qui conditionne un fait constaté", "FP4", muter(instance, `<td data-label="Exigence conditionnée">E-002</td>`, `<td data-label="Exigence conditionnée">E-001</td>`));
  rouge("hypothèse qui ne renvoie à aucune exigence", "FP4", muter(FIXTURE_MD, "| EF-02 | Le commanditaire", "| EF-09 | Le commanditaire"));
  rouge("statut hors vocabulaire", "FP5", muter(FIXTURE_MD, "| La sonde rend 200 | fait constaté |", "| La sonde rend 200 | à confirmer |"));
  rouge("critère de recette vide", "FP5", muter(FIXTURE_MD, "| La sonde rend 200 |", "| — |"));
  rouge("brique sans date de relevé", "FP6", muter(instance, "sitemap lu le 2026-10-07", "sitemap lu"));
  rouge("emplacement resté vide", "FP7", muter(instance, "<td data-label=\"Brique\">Site vitrine</td>", "<td data-label=\"Brique\">{brique}</td>"));
  rouge("SQUELETTE.html remis tel quel", "FP7", squelette);
  rouge("fiche sans chapitre des exigences", "FP1", muter(FIXTURE_MD, "## 5. Toutes les exigences", "## 5. Le détail"));
  // TF-1710 (lot Produit-82 20261014h, RT-11) — une fonction présente dans la base n'est pas un
  // fait constaté. Le statut `présent dans la base` est admis, et il se lève au chapitre 6 comme
  // une hypothèse : l'essai dans le produit est ce qui reste à faire.
  const presente = muter(FIXTURE_MD, "| La sonde rend 200 | fait constaté |", "| La sonde rend 200 | présent dans la base |");
  verte("exigence « présent dans la base » levée au chapitre 6 (le remède)", muter(presente,
    "| H-01 | Deux fournisseurs", "| H-02 | La sonde amont répond dans ce produit | ENF-01 | L'exploitant, par un essai | avant le palier MVP |\n| H-01 | Deux fournisseurs")
    .replace("**1 hypothèse**", "**2 hypothèses**"));
  rouge("exigence « présent dans la base » sans hypothèse au chapitre 6", "FP4", presente);
  for (const c of cas) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.nom} → ${c.attendu}${c.detail ? ` — ${c.detail}` : ""}`);
  const casse = cas.filter((c) => !c.ok);
  console.log(`\noracle-fiche-produit self-test : ${cas.length - casse.length}/${cas.length} PASS (${cas.filter((c) => c.nom.startsWith("cas rouge")).length} cas rouges, ${cas.filter((c) => c.nom.startsWith("cas vert")).length} cas verts, recette à double sens)`);
  process.exit(casse.length ? 1 : 0);
}

const LANCE_EN_DIRECT = process.argv[1] === fileURLToPath(import.meta.url);
if (LANCE_EN_DIRECT) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  const cible = args[0];
  if (!cible || !existsSync(cible)) {
    console.log(JSON.stringify({ oracle: "oracle-fiche-produit", version: VERSION, cible: cible || null, verdict: "ERREUR",
      findings: [], non_juge: NON_JUGE, message: "fiche introuvable — usage : node oracle-fiche-produit.mjs <fiche.html|fiche.md> | --self-test" }, null, 1));
    process.exit(2);
  }
  const { findings, mesures } = juger(readFileSync(cible, "utf8"));
  const verdict = verdictDe(findings);
  console.log(JSON.stringify({ oracle: "oracle-fiche-produit", version: VERSION, cible, verdict, findings, mesures, non_juge: NON_JUGE }, null, 1));
  process.exit(verdict === "PASS" ? 0 : 1);
}
