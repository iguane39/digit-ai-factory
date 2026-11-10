#!/usr/bin/env node
/**
 * oracle-engagements.mjs — UN ENGAGEMENT ÉCRIT DANS UN DOCUMENT REMIS A SON LIVRABLE OU SON ACTION NOMMÉE
 * (D-193 (a) du 10/11/2026, TF-2333, R-67 de REGLES-PROJET.md).
 *
 * LE FAIT (lot du produit marketing du 09/11/2026, RP-10, ledger seq 694). Les documents d'une formation, écrits les 27 et
 * 28/10/2026, ont promis un QCM et un questionnaire de satisfaction en formulaires en ligne, une skill installée par le
 * formateur et un temps de bilan au déroulé. Le support de la séance n'a pas été repris, et aucune de ces pièces n'a été
 * produite. L'humain l'a vu le 09/11, quatre jours avant la séance ; trois pièces ont été faites dans l'urgence.
 *
 * CE QUI EST JUGÉ. Le registre `forge/ENGAGEMENTS.md` du produit (forme : `gabarits/ENGAGEMENTS-PRODUIT.md`) et, sur demande,
 * les documents remis.
 *   EN1 · la forme du registre : en-tête daté et sourcé, tableau « Engagement | Nature | Pris dans | Tenu par », et par
 *         ligne une nature (pièce, temps, outil), le document qui promet, et ce qui tient l'engagement sous l'une des trois
 *         formes : `livrable : <chemin>`, `action : <quoi>, porteur <qui>, échéance AAAA-MM-JJ`, `sans objet — <motif>`.
 *   EN2 · chaque engagement est TENU : son livrable existe (et son repère s'y lit, quand le format se lit), ou son action
 *         est ouverte, c'est-à-dire que son échéance n'est pas passée.
 *   EN3 · chaque document passé par `--documents` qui PROMET une pièce ou un outil figure au registre. La promesse se relève
 *         dans une phrase : un formulaire, un questionnaire ou un QCM « en ligne » ; ou une pièce (questionnaire, kit, fiche,
 *         attestation…) ou un outil (skill, accès, licence…) suivi de près de son verbe de remise (envoyé, remis, fourni,
 *         installé…), dans une phrase qui nomme son destinataire ou sa séance et ne fait pas le récit daté d'un fait passé.
 *         Un document cité au registre, même par une autre version que son indice, n'est plus accusé.
 *
 * QUI L'APPELLE (loi n° 1 : un contrôle qu'aucune étape n'appelle n'existe pas).
 *   · `oracles/hook-ecriture.mjs`, au pilot comme chez le produit (lanceur `forge/hooks/factory.mjs ecriture`) : à chaque
 *     livrable écrit sous `output/` ou `livrables/`, et à chaque écriture du registre. C'est la production suivante de la
 *     chaîne : un engagement non tenu se dit au document d'après, plus quatre jours avant la séance. Il avertit, il ne
 *     bloque pas, comme tout ce hook.
 *   · `oracles/hook-ouverture.mjs`, chez le produit : il redit à l'ouverture ce qui n'est pas tenu, et la revue de
 *     préparation d'une séance (calendrier `forge/CALENDRIER.md`, J-5 à J-0) nomme cette commande sur ses documents.
 *
 * Usage : node oracles/oracle-engagements.mjs [<racine du produit>] [--documents <fichier ou dossier>]… [--aujourd-hui AAAA-MM-JJ]
 *         node oracles/oracle-engagements.mjs --self-test
 * Exit : 0 PASS · 1 FAIL · 2 SANS_OBJET (ni registre ni document à juger) ou usage.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename, resolve, isAbsolute, relative, extname } from "node:path";
import { tmpdir } from "node:os";
import { inflateRawSync, deflateRawSync, crc32 } from "node:zlib";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { defautsEntete, tableau, dateValide, jourLocal, ecartJours, instancierNaissance } from "./lib-calendrier.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
export const VERSION = "1.0.0";
export const CHEMIN_REGISTRE = "forge/ENGAGEMENTS.md";
export const MODELE_REGISTRE = "gabarits/ENGAGEMENTS-PRODUIT.md";

const normaliser = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
const nu = (s) => String(s || "").replace(/\*\*/g, "").trim();
const vide = (s) => { const n = nu(s); return !n || /^[—–-]+$/.test(n); };
const slash = (p) => String(p).replace(/\\/g, "/");

// ── LE REGISTRE ─────────────────────────────────────────────────────────────────────────────

const COLONNES = { engagement: /^engagement/, nature: /^nature/, prisDans: /^pris dans/, tenuPar: /^tenu par/ };
const NATURES = new Map([["piece", "pièce"], ["temps", "temps"], ["outil", "outil"]]);

/** Ce qui tient un engagement, lu dans sa cellule : `{ type, chemin, repere, porteur, echeance, motif }` ou `{ type: null, defaut }`. */
export function lireTenue(cellule) {
  const brut = nu(cellule), n = normaliser(brut);
  if (/^livrable\s*:/.test(n)) {
    const chemin = (/`([^`]+)`/.exec(brut) || [])[1];
    if (!chemin) return { type: null, defaut: "« livrable : » sans chemin entre accents graves" };
    if (/[<>]/.test(chemin)) return { type: null, defaut: `chemin du livrable non rempli (« ${chemin.slice(0, 60)} »)` };
    const repere = (/rep[eè]re\s*:?\s*[«"“]\s*([^»"”]+?)\s*[»"”]/i.exec(brut) || [])[1] || null;
    return { type: "livrable", chemin: chemin.trim(), repere };
  }
  if (/^action\s*:/.test(n)) {
    const porteur = (/porteur\s*:?\s*([^,;]+)/.exec(n) || [])[1];
    const echeance = (/echeance\s*:?\s*(\d{4}-\d{2}-\d{2})/.exec(n) || [])[1];
    const manque = [!porteur || /^</.test(porteur.trim()) ? "porteur" : null, !echeance ? "échéance AAAA-MM-JJ" : null].filter(Boolean);
    if (manque.length) return { type: null, defaut: `action sans ${manque.join(" ni ")} : une action nommée dit qui la porte et pour quand` };
    if (!dateValide(echeance)) return { type: null, defaut: `échéance « ${echeance} » qui n'existe pas au calendrier` };
    return { type: "action", porteur: porteur.trim(), echeance, quoi: brut.replace(/^action\s*:\s*/i, "").split(/,\s*porteur/i)[0].trim() };
  }
  const so = /^sans objet\s*[—–:-]+\s*(.+)$/.exec(n);
  if (so) {
    if (so[1].split(/\s+/).filter(Boolean).length < 3) return { type: null, defaut: "« sans objet » sans motif d'au moins 3 mots" };
    return { type: "sans_objet", motif: brut.replace(/^sans objet\s*[—–:-]+\s*/i, "").trim() };
  }
  return { type: null, defaut: `« ${brut.slice(0, 50) || "(vide)"} » : écrire « livrable : \`<chemin>\` », « action : <quoi>, porteur <qui>, échéance AAAA-MM-JJ » ou « sans objet — <motif> »` };
}

/** Lit le registre : `{ engagements, defauts }` ; une ligne mal formée est un défaut avec son numéro, jamais un engagement deviné. */
export function lireRegistre(texte) {
  const lignes = String(texte || "").split(/\r?\n/);
  const defauts = defautsEntete(lignes, "le registre des engagements");
  const t = tableau(lignes, [COLONNES.engagement, COLONNES.tenuPar]);
  if (!t) {
    defauts.push({ ligne: null, message: "aucun tableau des engagements (en-tête « | Engagement | Nature | Pris dans | Tenu par | », suivi de sa ligne de séparation)" });
    return { engagements: [], defauts };
  }
  const col = {};
  for (const [cle, re] of Object.entries(COLONNES)) col[cle] = t.entete.findIndex((h) => re.test(h));
  for (const [cle, nom] of [["nature", "Nature"], ["prisDans", "Pris dans"]]) if (col[cle] < 0) defauts.push({ ligne: t.index, message: `colonne « ${nom} » absente de l'en-tête du tableau des engagements` });
  const engagements = [];
  for (const { ligne, cells } of t.rangs) {
    const v = (cle) => (col[cle] >= 0 ? cells[col[cle]] || "" : "");
    if (/^\*?\(aucune?\)\*?$/i.test(nu(v("engagement")))) continue;          // la ligne d'exemple du modèle
    const ko = [];
    const engagement = nu(v("engagement"));
    const aucun = /^aucun$/i.test(normaliser(engagement));
    if (vide(engagement)) ko.push("engagement non écrit");
    const nature = NATURES.get(normaliser(nu(v("nature"))));
    if (!nature && !(aucun && vide(v("nature")))) ko.push(`nature « ${nu(v("nature")).slice(0, 20) || "(vide)"} » : écrire pièce, temps ou outil`);
    if (col.prisDans >= 0 && vide(v("prisDans"))) ko.push("document qui prend l'engagement non nommé (« Pris dans »)");
    const tenue = lireTenue(v("tenuPar"));
    if (!tenue.type) ko.push(tenue.defaut);
    else if (aucun && tenue.type !== "sans_objet") ko.push("un document « aucun » engagement se déclare « sans objet — <motif> »");
    if (ko.length) { defauts.push({ ligne, message: ko.join(" ; ") }); continue; }
    engagements.push({ ligne, engagement, aucun, nature: nature || null, prisDans: nu(v("prisDans")), tenue });
  }
  return { engagements, defauts };
}

// ── LE TEXTE D'UN DOCUMENT ──────────────────────────────────────────────────────────────────

/** Les entrées d'une archive zip (docx, pptx, xlsx), lues au répertoire central ; null si le fichier n'est pas une archive lisible. */
export function entreesZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) return null;
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = [];
  for (let k = 0; k < n && p + 46 <= buf.length; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) return null;
    const nomL = buf.readUInt16LE(p + 28), extraL = buf.readUInt16LE(p + 30), comL = buf.readUInt16LE(p + 32);
    out.push({ nom: buf.toString("utf8", p + 46, p + 46 + nomL), methode: buf.readUInt16LE(p + 10), taille: buf.readUInt32LE(p + 20), local: buf.readUInt32LE(p + 42) });
    p += 46 + nomL + extraL + comL;
  }
  return out;
}

function lireEntreeZip(buf, e) {
  const debut = e.local + 30 + buf.readUInt16LE(e.local + 26) + buf.readUInt16LE(e.local + 28);
  const data = buf.subarray(debut, debut + e.taille);
  return e.methode === 0 ? data : e.methode === 8 ? inflateRawSync(data) : null;
}

const decoder = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");
const xmlEnTexte = (x) => decoder(x.replace(/<\/(?:w|a):p>/g, "\n").replace(/<(?:w|a):(?:br|tab)\b[^>]*\/>/g, " ").replace(/<\/si>/g, "\n").replace(/<[^>]+>/g, ""));
const rangDe = (nom) => +((/(\d+)\.xml$/.exec(nom) || [])[1] || 0);

/** Le texte lisible d'un document : `{ texte, jugeable, motif, unite }` — unite vaut « l. » (ligne) ou « § » (paragraphe d'un document Office). */
export function texteDocument(chemin) {
  const ext = extname(chemin).toLowerCase();
  try {
    if (statSync(chemin).isDirectory()) return { texte: "", jugeable: false, motif: "un dossier ne se lit pas" };
    if ([".md", ".markdown", ".txt", ".csv", ".json", ".yaml", ".yml"].includes(ext)) return { texte: readFileSync(chemin, "utf8"), jugeable: true, unite: "l." };
    if ([".html", ".htm"].includes(ext)) {
      const h = readFileSync(chemin, "utf8").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
        .replace(/<\/(p|div|li|tr|h[1-6]|section|article|td|th|dd|dt)>|<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ");
      return { texte: decoder(h), jugeable: true, unite: "l." };
    }
    if ([".docx", ".pptx", ".xlsx"].includes(ext)) {
      const buf = readFileSync(chemin);
      const entrees = entreesZip(buf);
      if (!entrees) return { texte: "", jugeable: false, motif: `archive ${ext} illisible` };
      const voulues = ext === ".docx" ? /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/
        : ext === ".pptx" ? /^ppt\/(slides\/slide|notesSlides\/notesSlide)\d+\.xml$/ : /^xl\/sharedStrings\.xml$/;
      const morceaux = entrees.filter((e) => voulues.test(e.nom))
        .sort((a, b) => (ext === ".pptx" ? rangDe(a.nom) - rangDe(b.nom) || a.nom.localeCompare(b.nom) : a.nom.localeCompare(b.nom)))
        .map((e) => {
          const x = lireEntreeZip(buf, e);
          const etiquette = ext === ".pptx" ? `[${/notesSlide/.test(e.nom) ? "notes de la diapositive" : "diapositive"} ${rangDe(e.nom)}]\n` : "";
          return x ? etiquette + xmlEnTexte(x.toString("utf8")) : "";
        });
      return { texte: morceaux.join("\n"), jugeable: true, unite: "§" };
    }
    return { texte: "", jugeable: false, motif: `format ${ext || "sans extension"} non lu (déclarer ses engagements à partir de sa source)` };
  } catch (e) { return { texte: "", jugeable: false, motif: `illisible : ${String(e.message).slice(0, 80)}` }; }
}

// ── LES PROMESSES D'UN DOCUMENT (EN3) ───────────────────────────────────────────────────────

// Vocabulaire FERMÉ et écrit, jamais deviné. Une promesse est une pièce ou un outil SUIVI DE PRÈS de son participe de remise (4 mots
// au plus entre les deux), un formulaire « en ligne » accolé, ou un verbe de remise suivi de sa pièce. Mesuré le 10/11/2026 sur 607
// livrables Markdown et HTML de 11 produits : la première forme (nom et verbe n'importe où dans la phrase) relevait 233 documents, dont
// une majorité de faux amis — « adresse » (le nom) pris pour « adressé », « mise en ligne » d'un site, une « fiche » à 9 mots de son
// verbe ; « activé » (« une licence active », « une skill s'active ») est un prérequis ou un geste, pas une promesse.
const PIECES = "questionnaires?|qcm|quiz|formulaires?|attestations?|certificats?|convocations?|feuilles? d'emargement|kits?|fiches?|supports?|livrets?|guides?|syntheses?|comptes?[ -]rendus?|rapports?|corriges?|memos?|diaporamas?";
const OUTILS = "skills?|outils?|applications?|acces|licences?|environnements?|plugins?|connecteurs?|extensions?";
const PARTICIPES = "envoyee?s?|remise?s?|transmise?s?|fournie?s?|distribuee?s?|installee?s?|communiquee?s?|livree?s?|mise?s? a disposition";
const ECART = "(?:\\s+\\S+){0,4}?";
const RE_APRES_NOM = new RegExp(`\\b(${PIECES}|${OUTILS})\\b${ECART}\\s+(?:(?:est|sont|sera|seront|a ete|ont ete|etre)\\s+)?(?:${PARTICIPES})\\b`);
const RE_EN_LIGNE = /\b(formulaires?|questionnaires?|qcm|quiz|tests?|evaluations?)\s+en ligne\b/;
const RE_VERBE_PUIS_NOM = new RegExp(`\\b(?:installe|installera|installeront|fournit|fournira|transmet|transmettra|envoie|enverra|remet|remettra|distribue|distribuera|recoit|recoivent|recevra|recevront)\\s+(?:sa|son|ses|une|un|des|le|la|les|l'|leur|leurs)\\s*(?:\\S+\\s+){0,2}?(${PIECES}|${OUTILS})\\b`);
// « complété » se lit AVEC son accent : l'adjectif « complète » n'est pas une promesse.
const RE_COMPLETEE = /(questionnaire|qcm|quiz|formulaire|fiche|grille|évaluation)s?(?:\s+\S+){0,4}?\s+(?:est|sont|sera|seront|a été|ont été)\s+complétée?s?(?![\p{L}])/u;
// Hors du formulaire « en ligne », une promesse nomme son DESTINATAIRE ou sa séance, et n'est pas un récit daté au passé. Remesuré le
// 10/11/2026 sur le même corpus : nom et verbe rapprochés relevaient encore 73 documents, surtout des récits (« attestation envoyée le
// 17/07/2026 », « rapport transmis le 11 mai », « livret livré ») et le nom « remise en location ».
const RE_DESTINATAIRE = /\b(participants?|stagiaires?|referents?|apprenants?|inscrits?|inscription|seances?|formations?|formateurs?|formatrices?|intervenants?|organisme|clients?|commanditaires?|beneficiaires?)\b/;
const RE_RECIT_PASSE = /\b(?:a|ont) ete\b|\b(?:le|du|au) \d{1,2}(?:er)? (?:janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b|\bremises? (?:en|de)\b/;
const natureDe = (nom) => (new RegExp(`^(?:${OUTILS})$`).test(nom) ? "outil" : "pièce");

/** Les phrases d'un texte qui promettent une pièce ou un outil : `[{ ligne, nature, extrait }]`. */
export function promesses(texte) {
  const out = [];
  String(texte || "").split(/\r?\n/).forEach((brute, i) => {
    const ligne = brute.replace(/\*\*|__|`/g, "").trim();
    if (!ligne) return;
    const morceaux = ligne.startsWith("|") ? [ligne] : ligne.split(/(?<=[.!?;])\s+/);
    for (const m of morceaux) {
      const n = normaliser(m).replace(/\s*\|\s*/g, " ");
      const adresse = RE_DESTINATAIRE.test(n) && !RE_RECIT_PASSE.test(n);
      const t = RE_EN_LIGNE.exec(n) || (adresse && (RE_APRES_NOM.exec(n) || RE_VERBE_PUIS_NOM.exec(n) || RE_COMPLETEE.exec(m.toLowerCase())));
      if (t) out.push({ ligne: i + 1, nature: natureDe(normaliser(t[1])), extrait: m.replace(/^\s*\|\s*|\s*\|\s*$/g, "").replace(/\s*\|\s*/g, " | ").slice(0, 140) });
    }
  });
  return out;
}

/** Le nom d'un document sans extension, sans « - AAAAMMJJ<indice> », normalisé : deux versions d'un même document le partagent. */
export function radical(chemin) {
  const b = basename(String(chemin)).replace(/\.[a-z0-9]+$/i, "").replace(/\s*-\s*\d{8}[a-z]{0,2}$/i, "");
  return normaliser(b).replace(/[^a-z0-9]+/g, " ").trim();
}

/** Un document est cité au registre quand le « Pris dans » d'une ligne porte son radical. */
export function estCite(chemin, registre) {
  const r = radical(chemin);
  if (r.length < 4) return false;
  return (registre?.engagements || []).some((e) => normaliser(e.prisDans).replace(/[^a-z0-9]+/g, " ").includes(r));
}

const SAUTES = new Set(["old", "node_modules", ".git"]);
const INDEX = new Set(["readme.md", "lisezmoi.md", "engagements.md", "calendrier.md"]);

/** Les fichiers d'une liste de chemins, les dossiers parcourus (profondeur 6, 400 fichiers au plus — la borne se dit). */
export function documentsDe(racine, chemins) {
  const out = [], bornes = [];
  const marcher = (d, prof) => {
    if (prof > 6) { bornes.push(`${slash(d)} : profondeur 6 atteinte`); return; }
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (out.length >= 400) { bornes.push("400 fichiers lus : le reste n'est pas jugé"); return; }
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!SAUTES.has(e.name) && !e.name.startsWith(".")) marcher(p, prof + 1); }
      else if (!e.name.startsWith(".") && !e.name.startsWith("~$") && !INDEX.has(e.name.toLowerCase())) out.push(p);
    }
  };
  for (const c of chemins) {
    const p = isAbsolute(c) ? c : join(racine, c);
    if (!existsSync(p)) { bornes.push(`${slash(c)} : introuvable`); continue; }
    if (statSync(p).isDirectory()) marcher(p, 0); else out.push(p);
  }
  return { fichiers: [...new Set(out)], bornes };
}

// ── LE JUGEMENT ─────────────────────────────────────────────────────────────────────────────

export const REMEDE = "chaque engagement pointe un livrable présent (« livrable : `<chemin>` ») ou une action nommée (« action : <quoi>, porteur <qui>, "
  + `échéance AAAA-MM-JJ ») dans ${CHEMIN_REGISTRE} ; un document qui promet s'y inscrit, ou s'y déclare « aucun » avec son motif ; forme : ${MODELE_REGISTRE} du pilot`;

/** EN1 et EN2 sur le registre du produit : `{ chemin, present, registre, findings }`. */
export function jugerRegistre(racine, { jour = jourLocal() } = {}) {
  const chemin = join(racine, ...CHEMIN_REGISTRE.split("/"));
  const findings = [];
  if (!existsSync(chemin)) {
    findings.push({ regle: "EN1", statut: "SANS_OBJET", message: `aucun registre ${CHEMIN_REGISTRE} : rien n'est déclaré, rien n'est jugé (il naît à l'ouverture du produit, de ${MODELE_REGISTRE})` });
    return { chemin, present: false, registre: { engagements: [], defauts: [] }, findings };
  }
  const registre = lireRegistre(readFileSync(chemin, "utf8"));
  for (const d of registre.defauts) findings.push({ regle: "EN1", statut: "FAIL", ou: `${CHEMIN_REGISTRE}${d.ligne ? `:${d.ligne}` : ""}`, ligne: d.ligne, message: d.message });
  if (!registre.defauts.length) findings.push({ regle: "EN1", statut: "PASS", message: `registre bien formé : ${registre.engagements.length} ligne(s)` });
  const tenus = { livrable: 0, action: 0, sans_objet: 0 };
  let nonTenus = 0;
  for (const e of registre.engagements) {
    const t = e.tenue, ou = `${CHEMIN_REGISTRE}:${e.ligne}`, quoi = `« ${e.engagement.slice(0, 70)} » (${e.nature || "aucun"}, pris dans ${e.prisDans.slice(0, 80)})`;
    if (t.type === "sans_objet") { tenus.sans_objet++; continue; }
    if (t.type === "action") {
      const reste = ecartJours(jour, t.echeance);
      if (reste < 0) { nonTenus++; findings.push({ regle: "EN2", statut: "FAIL", ou, ligne: e.ligne, message: `${quoi} : l'action « ${t.quoi.slice(0, 60)} » (porteur ${t.porteur}) est ÉCHUE depuis le ${t.echeance} — la faire et pointer son livrable, ou dater une nouvelle échéance` }); }
      else tenus.action++;
      continue;
    }
    const cible = isAbsolute(t.chemin) ? t.chemin : join(racine, t.chemin);
    if (!existsSync(cible)) { nonTenus++; findings.push({ regle: "EN2", statut: "FAIL", ou, ligne: e.ligne, message: `${quoi} : le livrable \`${t.chemin}\` n'existe pas — le produire, ou nommer l'action qui le produira (porteur, échéance)` }); continue; }
    if (t.repere) {
      const d = texteDocument(cible);
      if (d.jugeable && !normaliser(d.texte).includes(normaliser(t.repere))) { nonTenus++; findings.push({ regle: "EN2", statut: "FAIL", ou, ligne: e.ligne, message: `${quoi} : le repère « ${t.repere} » ne se lit pas dans \`${t.chemin}\` — le livrable ne tient pas encore l'engagement` }); continue; }
      if (!d.jugeable) findings.push({ regle: "EN2", statut: "SANS_OBJET", ou, ligne: e.ligne, message: `${quoi} : livrable présent, repère « ${t.repere} » NON JUGÉ (${d.motif})` });
    }
    tenus.livrable++;
  }
  if (registre.engagements.length && !nonTenus) findings.push({ regle: "EN2", statut: "PASS", message: `${registre.engagements.length} ligne(s) tenue(s) : ${tenus.livrable} par un livrable présent, ${tenus.action} par une action ouverte, ${tenus.sans_objet} sans objet motivé(s)` });
  if (!registre.engagements.length && !registre.defauts.length) findings.push({ regle: "EN2", statut: "PASS", message: "aucun engagement déclaré" });
  return { chemin, present: true, registre, findings };
}

/** EN3 : les documents qui promettent sans figurer au registre. */
export function jugerDocuments(racine, chemins, registre) {
  const findings = [];
  const { fichiers, bornes } = documentsDe(racine, chemins);
  let sansPromesse = 0, cites = 0;
  const nonLus = [];
  for (const f of fichiers) {
    const d = texteDocument(f);
    const rel = slash(relative(racine, f)) || basename(f);
    if (!d.jugeable) { nonLus.push(`${rel} (${d.motif})`); continue; }
    const p = promesses(d.texte);
    if (!p.length) { sansPromesse++; continue; }
    if (estCite(f, registre)) { cites++; continue; }
    findings.push({ regle: "EN3", statut: "FAIL", ou: rel,
      message: `${rel} promet ${p.length} pièce(s) ou outil(s) et ne figure pas au registre ${CHEMIN_REGISTRE} : `
        + p.slice(0, 3).map((x) => `${d.unite} ${x.ligne} « ${x.extrait} »`).join(" ; ") + (p.length > 3 ? ` ; … (${p.length} au total)` : "")
        + " — inscrire chaque engagement avec ce qui le tient, ou une ligne « aucun » motivée" });
  }
  if (nonLus.length) findings.push({ regle: "EN3", statut: "SANS_OBJET", message: `${nonLus.length} document(s) non lu(s), donc non jugé(s) : ${nonLus.slice(0, 5).join(" ; ")}${nonLus.length > 5 ? " ; …" : ""}` });
  if (bornes.length) findings.push({ regle: "EN3", statut: "SANS_OBJET", message: `bornes de lecture : ${bornes.slice(0, 4).join(" ; ")}` });
  if (!findings.some((x) => x.statut === "FAIL")) findings.push({ regle: "EN3", statut: "PASS", message: `${fichiers.length} document(s) lu(s) : ${sansPromesse} sans promesse relevée, ${cites} cité(s) au registre` });
  return findings;
}

export const NON_JUGE = [
  "la COMPLÉTUDE des engagements déclarés : un document cité au registre n'est plus relu phrase par phrase, ses lignes font foi",
  "la promesse écrite en d'autres mots que le vocabulaire fermé d'EN3, ou qui ne nomme ni destinataire ni séance (participant, inscription, formateur, organisme, client…), ou qui se lit comme un récit daté au passé : mesuré le 10/11/2026, ce resserrement fait passer les livrables relevés de 233 à 7 sur 607, et garde 10 des 13 documents de formation du cas fondateur ; un temps réservé au déroulé ne se relève pas seul, il se déclare",
  "le texte d'un PDF ou d'une image : un tel document se juge par sa source (Markdown, Word, PowerPoint), et ses engagements se déclarent",
  "qu'une action ouverte soit réellement en cours : son porteur et son échéance sont lus, pas son avancement",
  "que le livrable présent tienne l'engagement sur le fond : sa présence est jugée, et son repère quand il en porte un",
];

/** Le verdict complet : `{ oracle, version, cible, verdict, findings, non_juge, remede }`. */
export function juger(racine, { documents = [], jour = jourLocal() } = {}) {
  const r = jugerRegistre(racine, { jour });
  const findings = [...r.findings];
  if (documents.length) findings.push(...jugerDocuments(racine, documents, r.registre));
  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : (!r.present && !documents.length ? "SANS_OBJET" : "PASS");
  return { oracle: "oracle-engagements", version: VERSION, cible: slash(racine), registre: CHEMIN_REGISTRE, jour, verdict, findings, non_juge: NON_JUGE, remede: REMEDE };
}

// ── LA RECETTE (double sens) ────────────────────────────────────────────────────────────────

/** Une archive zip minimale (entrées compressées), pour fabriquer un docx ou un pptx de banc. */
export function zipDe(entrees) {
  const locaux = [], centraux = [];
  let offset = 0;
  for (const { nom, contenu } of entrees) {
    const n = Buffer.from(nom, "utf8"), brut = Buffer.from(contenu, "utf8"), comp = deflateRawSync(brut), crc = crc32(brut) >>> 0;
    const l = Buffer.alloc(30);
    l.writeUInt32LE(0x04034b50, 0); l.writeUInt16LE(20, 4); l.writeUInt16LE(0x0800, 6); l.writeUInt16LE(8, 8);
    l.writeUInt32LE(crc, 14); l.writeUInt32LE(comp.length, 18); l.writeUInt32LE(brut.length, 22); l.writeUInt16LE(n.length, 26);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(brut.length, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(offset, 42);
    locaux.push(l, n, comp); centraux.push(c, n);
    offset += 30 + n.length + comp.length;
  }
  const cd = Buffer.concat(centraux), e = Buffer.alloc(22);
  e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(entrees.length, 8); e.writeUInt16LE(entrees.length, 10); e.writeUInt32LE(cd.length, 12); e.writeUInt32LE(offset, 16);
  return Buffer.concat([...locaux, cd, e]);
}
const docx = (paragraphes) => zipDe([{ nom: "word/document.xml", contenu: `<w:document><w:body>${paragraphes.map((p) => `<w:p><w:r><w:t>${p}</w:t></w:r></w:p>`).join("")}</w:body></w:document>` }]);
const pptx = (diapos, notes) => zipDe([
  ...diapos.map((t, i) => ({ nom: `ppt/slides/slide${i + 1}.xml`, contenu: `<p:sld><a:p><a:r><a:t>${t}</a:t></a:r></a:p></p:sld>` })),
  ...notes.map((t, i) => ({ nom: `ppt/notesSlides/notesSlide${i + 1}.xml`, contenu: `<p:notes><a:p><a:r><a:t>${t}</a:t></a:r></a:p></p:notes>` })),
]);

function selfTest() {
  const casse = [];
  const vus = [];
  const cas = (nom, ok, detail = "") => { vus.push(nom); if (!ok) casse.push(`${nom}${detail ? ` — ${detail}` : ""}`); };
  const dir = mkdtempSync(join(tmpdir(), "oracle-engagements-"));
  const P = join(dir, "produit");
  const poser = (rel, contenu) => { const p = join(P, ...rel.split("/")); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, contenu); return p; };
  const JOUR = "2026-11-10";
  const modele = readFileSync(join(ICI, "..", ...MODELE_REGISTRE.split("/")), "utf8");
  const avecLignes = (lignes) => instancierNaissance(modele, JOUR).replace("| *(aucun)* | — | — | — |", lignes.join("\n"));
  const fails = (r, regle) => r.findings.filter((f) => f.statut === "FAIL" && (!regle || f.regle === regle));
  try {
    // Le modèle : brut, ses dates « AAAA-MM-JJ » sont un défaut d'en-tête ; né (instancié), il est bien formé et vide.
    poser("forge/ENGAGEMENTS.md", modele);
    cas("rouge EN1 : le modèle copié sans instancier son en-tête est refusé", fails(juger(P, { jour: JOUR }), "EN1").some((f) => /verifie_le/.test(f.message)));
    poser("forge/ENGAGEMENTS.md", instancierNaissance(modele, JOUR));
    const ne = juger(P, { jour: JOUR });
    cas("vert : le registre né de son modèle est bien formé et ne déclare rien", ne.verdict === "PASS" && !fails(ne).length, JSON.stringify(fails(ne)));

    // VERT : les trois formes tenues — livrable présent avec repère lu (Markdown, Word, PowerPoint), action ouverte, sans objet motivé.
    poser("output/formation/Client-A - QCM final - 20261109a.md", "# QCM final\n\n15 questions.\n");
    writeFileSync(poser("output/formation/Client-A - Support - 20261109a.pptx", ""), pptx(["Bilan de la journée", "QCM final et questionnaire de satisfaction"], ["15 minutes : QCM final"]));
    writeFileSync(poser("output/formation/Client-A - Fiche formateur - 20261109a.docx", ""), docx(["Matériel", "Installer la skill de démonstration avant 9 h"]));
    const VERTES = [
      "| QCM final de 15 questions | pièce | `output/formation/Client-A - Programme - 20261028g.docx` | livrable : `output/formation/Client-A - QCM final - 20261109a.md`, repère « 15 questions » |",
      "| Temps du QCM au bilan | temps | `output/formation/Client-A - Programme - 20261028g.docx` | livrable : `output/formation/Client-A - Support - 20261109a.pptx`, repère « QCM final » |",
      "| Skill installée par le formateur | outil | `output/formation/Client-A - Programme - 20261028g.docx` | livrable : `output/formation/Client-A - Fiche formateur - 20261109a.docx`, repère « skill de démonstration » |",
      "| Questionnaire à froid à 30 jours | pièce | `output/formation/Client-A - Programme - 20261028g.docx` | action : formulaire à créer, porteur formateur, échéance 2026-12-10 |",
      "| aucun | — | `output/formation/Client-A - Note logistique - 20261028a.md` | sans objet — note interne sans remise au client |",
    ];
    poser("forge/ENGAGEMENTS.md", avecLignes(VERTES));
    const vert = juger(P, { jour: JOUR });
    cas("vert EN1+EN2 : livrable présent et repère lu en Markdown, PowerPoint (diapositives et notes) et Word, action ouverte, sans objet motivé", vert.verdict === "PASS" && !fails(vert).length, JSON.stringify(fails(vert)));
    cas("vert EN2 : le compte des engagements tenus est dit", vert.findings.some((f) => f.regle === "EN2" && f.statut === "PASS" && /3 par un livrable présent, 1 par une action ouverte, 1 sans objet/.test(f.message)));

    // ROUGE EN2 : livrable absent, repère absent (Word), action échue. Chaque refus nomme sa ligne et son remède.
    const ROUGES = [
      "| Questionnaire de satisfaction en ligne | pièce | `output/formation/Client-A - Programme - 20261028g.docx` | livrable : `output/formation/Client-A - Satisfaction - 20261109a.md` |",
      "| Corrigés dans la fiche du formateur | pièce | `output/formation/Client-A - Programme - 20261028g.docx` | livrable : `output/formation/Client-A - Fiche formateur - 20261109a.docx`, repère « corrigé de l'exercice 4 » |",
      "| Attestation de fin de formation | pièce | `output/formation/Client-A - Programme - 20261028g.docx` | action : attestation à produire, porteur organisme, échéance 2026-11-01 |",
    ];
    poser("forge/ENGAGEMENTS.md", avecLignes([...VERTES, ...ROUGES]));
    const rouge = juger(P, { jour: JOUR });
    const en2 = fails(rouge, "EN2");
    cas("rouge EN2 : un livrable déclaré et absent du disque est refusé", en2.some((f) => /Satisfaction - 20261109a\.md` n'existe pas/.test(f.message)));
    cas("rouge EN2 : un repère qui ne se lit pas dans le document Word est refusé", en2.some((f) => /repère « corrigé de l'exercice 4 » ne se lit pas/.test(f.message)));
    cas("rouge EN2 : une action dont l'échéance est passée est refusée", en2.some((f) => /ÉCHUE depuis le 2026-11-01/.test(f.message)));
    cas("rouge EN2 : exactement les 3 lignes fautives, avec leur numéro de ligne", en2.length === 3 && en2.every((f) => /^forge\/ENGAGEMENTS\.md:\d+$/.test(f.ou)), JSON.stringify(en2.map((f) => f.ou)));
    // Le remède se joue (TF-1013) : produire le livrable, compléter le document, dater une nouvelle échéance — puis PASS.
    poser("output/formation/Client-A - Satisfaction - 20261109a.md", "# Questionnaire de satisfaction\n");
    writeFileSync(join(P, "output", "formation", "Client-A - Fiche formateur - 20261109a.docx"), docx(["Installer la skill de démonstration avant 9 h", "Corrigé de l'exercice 4 : total 518 700"]));
    poser("forge/ENGAGEMENTS.md", avecLignes([...VERTES, ...ROUGES.slice(0, 2), ROUGES[2].replace("2026-11-01", "2026-11-12")]));
    const repare = juger(P, { jour: JOUR });
    cas("vert : le remède joué (livrable produit, repère écrit, échéance redatée) rend PASS", repare.verdict === "PASS", JSON.stringify(fails(repare)));

    // ROUGE EN1 : nature inconnue, tenue illisible, action sans échéance, sans objet sans motif, « aucun » tenu par un livrable.
    poser("forge/ENGAGEMENTS.md", avecLignes([
      "| QCM | document | `x.docx` | livrable : `output/formation/Client-A - QCM final - 20261109a.md` |",
      "| Kit | pièce | `x.docx` | à voir |",
      "| Skill | outil | `x.docx` | action : installer la skill, porteur formateur |",
      "| Fiche | pièce | `x.docx` | sans objet — non |",
      "| aucun | — | `x.docx` | livrable : `output/formation/Client-A - QCM final - 20261109a.md` |",
      "| Guide | pièce | — | livrable : `<chemin>` |",
    ]));
    const en1 = fails(juger(P, { jour: JOUR }), "EN1");
    cas("rouge EN1 : une nature hors de pièce, temps, outil est refusée", en1.some((f) => /nature « document »/.test(f.message)));
    cas("rouge EN1 : une tenue qui n'est ni livrable, ni action, ni sans objet est refusée", en1.some((f) => /« à voir »/.test(f.message)));
    cas("rouge EN1 : une action sans échéance est refusée", en1.some((f) => /action sans échéance/.test(f.message)));
    cas("rouge EN1 : un « sans objet » sans motif d'au moins 3 mots est refusé", en1.some((f) => /sans motif d'au moins 3 mots/.test(f.message)));
    cas("rouge EN1 : « aucun » engagement tenu par un livrable est refusé", en1.some((f) => /« aucun » engagement se déclare « sans objet/.test(f.message)));
    cas("rouge EN1 : un document non nommé et un chemin resté « <chemin> » sont refusés", en1.some((f) => /non nommé/.test(f.message) && /non rempli/.test(f.message)));
    cas("rouge EN1 : 6 lignes fautives, 6 refus", en1.length === 6, `${en1.length} refus`);
    poser("forge/ENGAGEMENTS.md", "# Engagements\n\nPas de tableau ici.\n");
    cas("rouge EN1 : un registre sans en-tête ni tableau est refusé", fails(juger(P, { jour: JOUR }), "EN1").length === 2);

    // EN3 : les documents qui promettent sans figurer au registre.
    poser("forge/ENGAGEMENTS.md", avecLignes(VERTES));
    const prog = poser("output/remis/Client-A - Programme - 20261028h.md", "# Programme\n\nUn questionnaire de satisfaction est complété en fin de séance.\n\n| QCM final nominatif | Formulaire en ligne individuel, horodaté. |\n");
    const neutre = poser("output/remis/Client-A - Note de cadrage - 20261028a.md", "# Cadrage\n\nLa journée alterne apports et exercices.\n");
    writeFileSync(poser("output/remis/Client-B - Programme - 20261027v.docx", ""), docx(["Moyens", "Une skill de démonstration installée par le formateur pour l'exercice 7."]));
    poser("output/remis/Client-A - Programme - 20261028h.pdf", "%PDF-1.4\n");
    const doc = juger(P, { jour: JOUR, documents: ["output/remis"] });
    const en3 = fails(doc, "EN3");
    cas("rouge EN3 : un programme Word qui promet une skill installée, absent du registre, est refusé avec son extrait", en3.some((f) => /Client-B - Programme - 20261027v\.docx promet 1 pièce\(s\) ou outil\(s\)/.test(f.message) && /§ \d+ « Une skill de démonstration installée/.test(f.message)));
    cas("vert EN3 : le programme Markdown d'un autre indice (20261028h) est couvert par sa ligne au registre (20261028g)", !en3.some((f) => /Client-A - Programme - 20261028h\.md/.test(f.message)));
    cas("vert EN3 : un document sans promesse n'est pas accusé", !en3.some((f) => /Note de cadrage/.test(f.message)) && promesses(readFileSync(neutre, "utf8")).length === 0);
    cas("vert EN3 : un PDF est dit non lu, jamais accusé ni compté sans promesse", doc.findings.some((f) => f.regle === "EN3" && f.statut === "SANS_OBJET" && /1 document\(s\) non lu\(s\)/.test(f.message)));
    // Le vocabulaire mesuré le 10/11/2026 sur un programme et un support réels : un prérequis ou un geste n'est pas une promesse.
    cas("vert EN3 : « une licence active » et « une skill partagée s'active » ne sont pas des promesses (prérequis, geste)",
      !promesses("Prérequis : une licence Claude active.\nUne skill partagée s'active en 4 gestes.\n").length);
    cas("rouge EN3 : « un questionnaire est complété en fin de séance » est une promesse, « une fiche complète » n'en est pas une",
      promesses("Un questionnaire à chaud est complété en fin de séance.\n").length === 1 && !promesses("Une fiche complète et lisible.\n").length);
    // Les faux amis mesurés le 10/11/2026 sur 607 livrables de 11 produits : un récit daté au passé, le nom « remise en location », une
    // pièce sans destinataire, l'« adresse » d'un bien. Et deux vraies promesses à un participant, qui doivent rester relevées.
    const fauxAmis = ["Attestation d'assurance habitation envoyée le 11/09/2025 (mail du 12/09/2025).", "Leur rapport du 9 mai a été transmis à l'entreprise de travaux.",
      "Les téléphones figurent dans la fiche interne de remise en location du client.", "Livret livré.", "Rapport envoyé par la plateforme du prestataire.",
      "La fiche d'établissement existe et son adresse a été fournie par l'exploitant.", "Le formulaire ne demande ni nom ni adresse e-mail."];
    cas("vert EN3 : 7 faux amis mesurés sur le corpus réel (récit daté, « remise en location », pièce sans destinataire, adresse) ne sont pas des promesses",
      fauxAmis.every((f) => !promesses(f).length), fauxAmis.filter((f) => promesses(f).length).join(" | "));
    cas("rouge EN3 : « chaque participant reçoit une convocation » et « le kit participant remis à chaque référent » sont des promesses",
      promesses("Chaque participant reçoit une convocation personnelle.\nLe kit participant remis à chaque référent comprend 4 fiches.\n").length === 2);
    cas("rouge EN3 : sans la ligne qui le cite, le programme Markdown qui promet est refusé (l. et extrait)", (() => {
      poser("forge/ENGAGEMENTS.md", instancierNaissance(modele, JOUR));
      const f = fails(juger(P, { jour: JOUR, documents: [prog] }), "EN3");
      return f.length === 1 && /l\. 3 « Un questionnaire de satisfaction est complété/.test(f[0].message) && /l\. 5 « QCM final nominatif \| Formulaire en ligne/.test(f[0].message);
    })());

    // SANS_OBJET et CLI : ni registre ni document → exit 2 ; FAIL → exit 1 ; PASS → exit 0.
    const Q = join(dir, "sans-registre");
    mkdirSync(Q, { recursive: true });
    const cli = (racine, ...a) => spawnSync(process.execPath, [fileURLToPath(import.meta.url), racine, "--aujourd-hui", JOUR, ...a], { encoding: "utf8" });
    const r2 = cli(Q);
    cas("sans objet : ni registre ni document à juger → SANS_OBJET, exit 2", r2.status === 2 && JSON.parse(r2.stdout).verdict === "SANS_OBJET", `exit ${r2.status}`);
    const r1 = cli(P, "--documents", "output/remis");
    cas("rouge CLI : un document qui promet sans registre qui le cite → FAIL, exit 1", r1.status === 1 && JSON.parse(r1.stdout).verdict === "FAIL", `exit ${r1.status}`);
    poser("forge/ENGAGEMENTS.md", avecLignes(VERTES));
    const r0 = cli(P);
    cas("vert CLI : registre tenu → PASS, exit 0", r0.status === 0 && JSON.parse(r0.stdout).verdict === "PASS", `exit ${r0.status} ${r0.stdout.slice(0, 200)}`);
  } catch (e) { casse.push(`harnais : ${String(e.stack || e).slice(0, 300)}`); }
  finally { rmSync(dir, { recursive: true, force: true }); }
  console.log(casse.length
    ? `Self-test oracle-engagements : ${casse.length} DÉFAUT(S) sur ${vus.length} cas\n - ${casse.join("\n - ")}`
    : `Self-test oracle-engagements : ${vus.length}/${vus.length} PASS, recette à double sens — EN1 (modèle brut refusé, né bien formé ; 6 formes fautives refusées, registre sans tableau refusé), EN2 (livrable absent, repère absent d'un Word, action échue refusés ; trois formes tenues en Markdown, PowerPoint et Word ; remède joué puis PASS), EN3 (programme Word et Markdown qui promettent refusés avec leurs extraits, autre indice couvert, document sans promesse et PDF non accusés ; 10 faux amis mesurés sur des documents réels non relevés, 3 vraies promesses relevées), sorties 0, 1 et 2`);
  return casse.length ? 1 : 0;
}

// ── LA LIGNE DE COMMANDE ────────────────────────────────────────────────────────────────────

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replace(/\\/g, "/") === resolve(process.argv[1]).toLowerCase().replace(/\\/g, "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const documents = [];
  let jour = jourLocal(), racine = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--documents") { if (!args[i + 1]) { console.log(JSON.stringify({ oracle: "oracle-engagements", verdict: "SANS_OBJET", motif: "--documents attend un fichier ou un dossier" })); process.exit(2); } documents.push(args[++i]); }
    else if (args[i] === "--aujourd-hui") { jour = args[++i]; if (!dateValide(jour)) { console.log(JSON.stringify({ oracle: "oracle-engagements", verdict: "SANS_OBJET", motif: "--aujourd-hui attend une date AAAA-MM-JJ" })); process.exit(2); } }
    else if (!args[i].startsWith("--") && racine === null) racine = args[i];
  }
  const r = juger(resolve(racine || process.cwd()), { documents, jour });
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
