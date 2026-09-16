#!/usr/bin/env node
/**
 * oracle-ecriture.mjs — LA FORME DES TEXTES DU PILOT EST JUGÉE À CHAQUE TOUR, LEUR STYLE NE
 * L'ÉTAIT PAR RIEN.
 *
 * POURQUOI (mandat humain du 12/09/2026, décisions D-1 (a) et D-3 (a) de la synthèse 20260911j ;
 * analyse L99 `output\03-etudes\20260911-L99-regles-d-ecriture-factory.md`). Une restitution passe
 * sous S1-S41, un document sous M7-M18, une page sous L1-L31 : la STRUCTURE d'un livrable est
 * tenue par des oracles exécutés. Sa PROSE ne l'était par personne — un texte pouvait sortir
 * conforme à son gabarit, ponctuellement juste, et écrit dans la cadence mécanique que les deux
 * catalogues de signes (Wikipédia FR « Aide:Identifier l'usage d'une IA générative », Wikipédia EN
 * « Signs of AI writing ») décrivent : annonces qui disent qu'on va dire, clôtures qui résument ce
 * qu'on vient de lire, emphase sans fait, attributions à « de nombreuses études ».
 *
 * CE QUE CET ORACLE COMPTE, ET CE QU'IL NE COMPTE PAS. Il compte des tournures par DENSITÉ (pour
 * mille mots de prose) et par FAMILLE, jamais un mot isolé. C'est la leçon N4, et elle est la
 * raison d'être de la forme : « un oracle qui crie sur l'usage légitime se fait désactiver dans la
 * semaine ». « Crucial » a sa place une fois dans un document ; un tiret d'incise est la
 * ponctuation normale du français. Ce qui trahit, c'est l'accumulation — Wikipédia EN : « one or
 * two coincidental, many indicate AI ». Les familles, leurs motifs et leurs seuils vivent DANS UNE
 * DONNÉE (`references\tics-redactionnels.json`, loi transverse n° 4) : recalibrer ne demande pas de
 * republier l'oracle.
 *
 * Règles : EC-1 densité par famille (PASS / AVERT / FAIL, non jugée sous `mots_minimum`) ·
 * EC-2 phrases longues en série · EC-3 profondeur de puces (S7 étendu à tout Markdown) ·
 * EC-4 emphase de structure (gras de paragraphe, puces emoji) · EC-5 attaques répétées (AVERT
 * seulement) · EC-6 antériorité (un texte normatif antérieur à la doctrine rend SKIP, jamais FAIL).
 * EC-7 terme proscrit par le LEXIQUE DU DESTINATAIRE, lu dans le socle du produit (TF-1045).
 * Un AVERT n'échoue jamais : il nomme, et c'est ce qui permet à l'oracle de rester branché.
 *
 * Usage : node oracles\oracle-ecriture.mjs <fichier.md> [--donnee <tics.json>] [--chemin-relatif <x>] [--json]
 *         node oracles\oracle-ecriture.mjs --baseline <dossier> [--donnee <tics.json>]
 *         node oracles\oracle-ecriture.mjs --self-test
 * Exit : 0 PASS ou SKIP · 1 FAIL · 2 erreur (fichier introuvable, donnée illisible).
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { chargerLexique, termesEmployes } from "./lib-lexique.mjs";
import { join, dirname, resolve, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const DONNEE_PAR_DEFAUT = join(RACINE, "references", "tics-redactionnels.json");
const VERSION = "1.0.0";
const NOM = "oracle-ecriture";

const NON_JUGE_ORACLE = [
  "la justesse d'une glose (S20/S23/M18)",
  "la structure imposée par un gabarit (S1-S41 pour les restitutions, M7/M10/M14/M18 pour les documents) — ces règles restent jugées par leurs oracles",
];

// ── LA PROSE ─────────────────────────────────────────────────────────────────────────────────
//
// Compter des tournures dans un Markdown brut reviendrait à compter dans du code : un bloc ```…```
// qui montre une tournure interdite n'est pas une faute de style, c'est une CITATION. L'extraction
// garde le nombre de lignes du fichier d'origine — un verdict qui ne sait pas dire « ligne 47 » ne
// se corrige pas.

const MOT = /[\p{L}\p{N}'’-]+/gu;

/** Le compte de mots d'un texte, à l'Unicode (un mot accentué est un mot). */
export function compterMots(texte) {
  return (String(texte).match(MOT) || []).length;
}

/** Une ligne de séparation de tableau (`|---|---|`) : de la mise en page, pas de la prose. */
const estSeparateurTableau = (l) => /\|/.test(l) && /-/.test(l) && /^[\s:|-]+$/.test(l);

/**
 * Découpe un Markdown en deux vues alignées ligne à ligne sur l'original :
 *   · `proseLignes` — la PROSE seule (hors front matter, blocs et spans de code, URL, balises,
 *     séparateurs de tableau ; chevrons de citation, dièses de titre et marqueurs de puce retirés) ;
 *   · `horsCode` — les lignes brutes hors code, pour les règles de STRUCTURE (puces, gras) qui ont
 *     besoin des marqueurs que la prose, elle, jette.
 */
function decouper(texte) {
  const src = String(texte).replace(/\r\n?/g, "\n").split("\n");
  const horsCode = new Array(src.length).fill("");
  const proseLignes = new Array(src.length).fill("");
  const cellules = src.map(() => []);
  let dansCode = false;
  let dansFrontMatter = false;
  for (let i = 0; i < src.length; i++) {
    const brut = src[i];
    if (i === 0 && /^---\s*$/.test(brut)) { dansFrontMatter = true; continue; }
    if (dansFrontMatter) { if (/^(---|\.\.\.)\s*$/.test(brut)) dansFrontMatter = false; continue; }
    if (/^\s*(```|~~~)/.test(brut)) { dansCode = !dansCode; continue; }
    if (dansCode) continue;
    horsCode[i] = brut;
    if (estSeparateurTableau(brut)) continue;
    let l = brut;
    l = l.replace(/^\s*(?:>\s?)+/, "");                    // citation
    l = l.replace(/^\s*#{1,6}\s*/, "");                    // titre
    l = l.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "");         // puce
    l = l.replace(/`[^`]*`/g, " ");                        // spans de code
    l = l.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1 ");      // liens : le texte reste, la cible part
    l = l.replace(/<[^>\n]{1,200}>/g, " ");                // balises HTML
    l = l.replace(/https?:\/\/\S+|www\.\S+/g, " ");        // URL nues
    // Les CELLULES d'un tableau : leur texte reste prose, mais la barre devient une frontière —
    // une ligne de six cellules n'est pas une phrase de soixante-quinze mots. Le remplacement
    // est d'égale longueur, donc les offsets relevés restent ceux de la ligne finale.
    l = l.replace(/\|/g, (m, offset) => { cellules[i].push(offset); return " "; });
    proseLignes[i] = l;
  }
  return { src, horsCode, proseLignes, cellules };
}

/** La prose d'un Markdown, lignes alignées sur le fichier d'origine. */
export function prose(texte) {
  return decouper(texte).proseLignes.join("\n");
}

/** Rend une fonction offset → numéro de ligne (1-based, aligné sur le fichier d'origine). */
function localisateur(texteProse) {
  const debuts = [0];
  for (let i = 0; i < texteProse.length; i++) if (texteProse[i] === "\n") debuts.push(i + 1);
  return (offset) => {
    let lo = 0, hi = debuts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (debuts[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
}

// Abréviations courantes : un point qui les suit ne clôt pas une phrase. La liste est COURTE et
// écrite — deviner les abréviations par une heuristique produirait des phrases fantômes, donc des
// verdicts EC-2 faux.
const ABREVIATIONS = new Set([
  "p", "ex", "cf", "etc", "n°", "no", "m", "mm", "mme", "mmes", "mlle", "dr", "pr", "al", "fig",
  "vol", "art", "av", "env", "réf", "ref", "éd", "ed", "st", "ste", "jc", "ap", "min", "max", "sec", "chap",
]);

/**
 * Les phrases de la prose : `{ texte, debut (offset), mots }`.
 *
 * `coupures` — les offsets où un BLOC commence (ligne vide, puce, titre, ligne de tableau,
 * citation). Sans elles, une liste de douze puces sans point final ne fait qu'UNE phrase de
 * deux cents mots, et EC-2 condamnerait une énumération correcte : mesuré sur la synthèse
 * 20260911j, une « phrase » de 80 mots qui était en fait quatre puces. Un point n'est pas la
 * seule fin de phrase d'un Markdown — un changement de bloc en est une aussi.
 */
export function phrases(texteProse, coupures = []) {
  const out = [];
  const pousser = (debut, fin) => {
    const brut = texteProse.slice(debut, fin);
    const gauche = brut.length - brut.trimStart().length;
    const t = brut.trim();
    if (t) out.push({ texte: t, debut: debut + gauche, mots: compterMots(t) });
  };
  const fins = [];
  const re = /[.!?]+/g;
  let m;
  while ((m = re.exec(texteProse))) {
    const fin = m.index + m[0].length;
    if (fin < texteProse.length && !/\s/.test(texteProse[fin])) continue; // « p.ex », « 3.5 », « etc.) »
    const jeton = (/([\p{L}\p{N}°]+)$/u.exec(texteProse.slice(0, m.index)) || ["", ""])[1];
    if (jeton && (ABREVIATIONS.has(jeton.toLowerCase()) || (jeton.length === 1 && /\p{L}/u.test(jeton)))) continue;
    fins.push(fin);
  }
  for (const c of coupures) if (c > 0 && c < texteProse.length) fins.push(c);
  fins.sort((a, b) => a - b);
  let debut = 0;
  for (const f of fins) {
    if (f <= debut) continue;
    pousser(debut, f);
    debut = f;
  }
  pousser(debut, texteProse.length);
  return out;
}

/** Les offsets de début de bloc : une phrase ne traverse ni une ligne vide ni un changement de bloc. */
function coupuresDeBloc(proseLignes, horsCode, cellules = []) {
  const coupures = [];
  let offset = 0;
  for (let i = 0; i < proseLignes.length; i++) {
    const brut = horsCode[i] || "";
    const structurel = /^\s*(?:[-*+]|\d+[.)])\s+/.test(brut) || /^\s*#{1,6}\s/.test(brut)
      || /^\s*\|/.test(brut) || /^\s*>/.test(brut);
    if (!proseLignes[i].trim() || structurel) coupures.push(offset);
    for (const c of cellules[i] || []) coupures.push(offset + c);
    offset += proseLignes[i].length + 1;
  }
  return coupures;
}

// ── LES OCCURRENCES D'UNE FAMILLE ────────────────────────────────────────────────────────────
//
// Trois régimes de motif, et chacun se lit dans la donnée plutôt que de se deviner :
//   · `par_ligne: true` — le motif s'ancre en début de ligne (les transitions de remplissage
//     n'en sont que là : « de plus » au milieu d'une phrase est du français) ;
//   · famille `ponctuation-de-cadence` — le motif est un signe, pas un mot : aucune frontière
//     de mot ne s'y applique, il se compte tel quel ;
//   · les autres — frontière de mot Unicode, pour que « cruciale » compte et « crucialement »
//     dans un mot composé ne déborde pas sur son voisin.
function occurrences(famille, texteProse, proseLignes) {
  const trouvees = [];
  for (const m of famille.motifs || []) {
    if (famille.cle === "ponctuation-de-cadence") {
      for (const x of texteProse.matchAll(new RegExp(m.motif, "gu"))) trouvees.push({ offset: x.index, texte: x[0] });
    } else if (m.par_ligne) {
      const re = new RegExp(m.motif, "imu");
      let offset = 0;
      for (const ligne of proseLignes) {
        const x = re.exec(ligne);
        if (x) trouvees.push({ offset: offset + x.index, texte: x[0] });
        offset += ligne.length + 1;
      }
    } else {
      // `g` s'ajoute aux flags `iu` de la donnée pour ITÉRER : compter une famille demande toutes
      // ses occurrences, pas la première.
      const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${m.motif})(?![\\p{L}\\p{N}])`, "giu");
      for (const x of texteProse.matchAll(re)) trouvees.push({ offset: x.index, texte: x[0] });
    }
  }
  return trouvees.sort((a, b) => a.offset - b.offset);
}

const extrait = (texteProse, offset, n = 60) => texteProse.slice(offset, offset + n).replace(/\s+/g, " ").trim();
const deuxDec = (x) => (Math.round(x * 100) / 100).toFixed(2);

// ── LE JUGEMENT ──────────────────────────────────────────────────────────────────────────────

const MOTS_OUTILS = new Set([
  "le", "la", "les", "un", "une", "des", "ce", "cette", "il", "elle", "on", "nous", "vous",
  "ils", "elles", "the", "a", "an", "it", "this",
]);

/**
 * Juge un texte. `options` : `{ donnee }` (l'objet de `tics-redactionnels.json`),
 * `{ cheminRelatif }` (pour EC-6). Rend `{ mots, verdict, findings, non_juge }`.
 */
export function juger(texte, options = {}) {
  const donnee = options.donnee;
  const findings = [];
  const pousser = (regle, statut, message, ligne) => findings.push(
    ligne === undefined ? { regle, statut, message } : { regle, statut, message, ligne });

  // EC-6 — ANTÉRIORITÉ. Elle se joue EN PREMIER et elle est exclusive : juger le style d'un texte
  // normatif écrit avant la doctrine produirait un FAIL qu'aucun run n'a le mandat de corriger,
  // donc un verdict rouge permanent — la façon la plus sûre de faire désactiver un oracle.
  const chemins = new Set((donnee?.anteriorite?.chemins || []).map((c) => c.replace(/\\/g, "/")));
  const rel = (options.cheminRelatif || "").replace(/\\/g, "/");
  if (rel && chemins.has(rel)) {
    pousser("EC-6", "SKIP", `${rel} : texte normatif antérieur à la doctrine, jugé à sa prochaine réécriture`);
    return { mots: compterMots(prose(texte)), verdict: "SKIP", findings, non_juge: nonJuge(donnee) };
  }
  pousser("EC-6", "PASS", "aucune antériorité déclarée pour ce chemin");

  const { horsCode, proseLignes, cellules } = decouper(texte);
  const texteProse = proseLignes.join("\n");
  const ligneDe = localisateur(texteProse);
  const mots = compterMots(texteProse);
  const minimum = Number(donnee?.mots_minimum ?? 150);
  const assezLong = mots >= minimum;

  // EC-1 — DENSITÉ PAR FAMILLE.
  if (!assezLong) {
    pousser("EC-1", "SKIP", `${mots} mots (< ${minimum}) : densités non jugées — un court texte à un seul tic n'est pas un texte à tics`);
  } else {
    for (const famille of donnee.familles || []) {
      const trouvees = occurrences(famille, texteProse, proseLignes);
      const densite = (trouvees.length * 1000) / mots;
      const avert = Number(famille.seuil_avertissement);
      const echec = Number(famille.seuil_echec);
      const statut = densite > echec ? "FAIL" : densite > avert ? "AVERT" : "PASS";
      const premiere = trouvees[0];
      const ou = premiere ? ` — 1re occurrence ligne ${ligneDe(premiere.offset)} : « ${extrait(texteProse, premiere.offset)} »` : "";
      const seuil = statut === "FAIL" ? `seuil d'échec ${deuxDec(echec)}` : `seuil d'avertissement ${deuxDec(avert)}`;
      const remede = statut === "PASS" ? "" : ` ; remède : ${famille.remede}`;
      pousser(`EC-1:${famille.cle}`, statut,
        `${famille.libelle} — densité ${deuxDec(densite)} ‰ (${seuil} ‰, ${trouvees.length} occurrence(s) sur ${mots} mots)${ou}${remede}`,
        premiere ? ligneDe(premiere.offset) : undefined);
    }
  }

  // EC-2 — PHRASES LONGUES EN SÉRIE. Une longue phrase est une phrase ; trois d'affilée sont une
  // cadence, et le lecteur décroche sans savoir où.
  const ph = phrases(texteProse, coupuresDeBloc(proseLignes, horsCode, cellules));
  if (!assezLong) {
    pousser("EC-2", "SKIP", `${mots} mots (< ${minimum}) : longueur de phrase non jugée`);
  } else {
    const longues = ph.filter((p) => p.mots > 35);
    // Recalibrage du 12/09/2026 (baseline sur 117 synthèses : 42 tombaient sur trois phrases
    // longues d'affilée — le style d'incise de la maison). Trois d'affilée AVERTISSENT (E-2 :
    // « trois phrases longues d'affilée sont un défaut »), SEPT échouent : mesuré sur 171 textes
    // le 12/09, la série maximale est 7 (une fois), 5 ou plus dix fois — l'échec est posé au
    // maximum du corpus PASS (contrat §4 du mandat, ≥ 95 %), l'avertissement garde la doctrine.
    let serie = null, meilleure = [];
    for (let i = 0, courante = []; i < ph.length; i++) {
      if (ph[i].mots > 35) { courante.push(ph[i]); if (courante.length > meilleure.length) meilleure = courante.slice(); }
      else courante = [];
    }
    if (meilleure.length >= 3) serie = meilleure;
    if (serie && serie.length >= 7) {
      pousser("EC-2", "FAIL",
        `${serie.length} phrases de plus de 35 mots consécutives (${serie.map((p) => p.mots).join(", ")} mots) — couper, ou faire de la subordonnée une phrase`,
        ligneDe(serie[0].debut));
    } else if (serie) {
      pousser("EC-2", "AVERT",
        `${serie.length} phrases de plus de 35 mots consécutives (${serie.map((p) => p.mots).join(", ")} mots) — couper, ou faire de la subordonnée une phrase ; sept d'affilée seraient un échec (calibré le 12/09 : maximum observé sur 171 textes du pilot)`,
        ligneDe(serie[0].debut));
    } else if (longues.length >= 3 && longues.length / Math.max(1, ph.length) >= 0.10) {
      pousser("EC-2", "AVERT",
        `${longues.length} phrases de plus de 35 mots sur ${ph.length} (${deuxDec((longues.length * 100) / ph.length)} %)`,
        ligneDe(longues[0].debut));
    } else {
      pousser("EC-2", "PASS", `${longues.length} phrase(s) de plus de 35 mots sur ${ph.length}`);
    }
  }

  // EC-3 — PROFONDEUR DE PUCES (S7 des restitutions, étendu à tout Markdown). Un troisième niveau
  // de liste est une table des matières déguisée : ce qui s'y trouve mérite un titre ou une phrase.
  const profonde = horsCode.findIndex((l) => /^(?: {4,}|\t{2,})\s*(?:[-*+]|\d+[.)])\s+/.test(l));
  if (profonde >= 0) {
    pousser("EC-3", "FAIL",
      `liste imbriquée au 3e niveau ou plus : « ${horsCode[profonde].trim().slice(0, 60)} » — remonter d'un niveau, ou faire un titre`,
      profonde + 1);
  } else {
    pousser("EC-3", "PASS", "aucune liste imbriquée au-delà du 2e niveau");
  }

  // EC-4 — EMPHASE DE STRUCTURE. (a) un paragraphe en gras n'est pas une emphase, c'est un titre
  // qui n'ose pas dire son nom ; (b) une puce emoji remplace le fait par un signe.
  // Recalibrage du 12/09/2026 (baseline : 66 synthèses sur 117 tombaient ici). Un paragraphe ou
  // une ligne ENTIÈREMENT en gras est une structure de gabarit — le verdict en une ligne du
  // bloc 2, la question d'une décision D-N en bloc de citation — et le gabarit prime sur le
  // plancher (ECRITURE.md, précédence 1). Seul le gras qui porte une phrase À L'INTÉRIEUR d'un
  // paragraphe est compté : c'est lui qui souligne au lieu de structurer.
  const gras = [];
  for (const x of texteProse.matchAll(/\*\*([^*\n]{2,})\*\*/g)) {
    const n = compterMots(x[1]);
    if (n < 12) continue;
    const debutLigne = texteProse.lastIndexOf("\n", x.index) + 1;
    const finLigneBrute = texteProse.indexOf("\n", x.index);
    const finLigne = finLigneBrute === -1 ? texteProse.length : finLigneBrute;
    const ligne = texteProse.slice(debutLigne, finLigne).trim()
      .replace(/^(?:>\s*)+/, "").replace(/^#{1,6}\s+/, "").replace(/^(?:[-*+]|\d+[.)])\s+/, "").trim();
    // Une ligne ou une puce qui OUVRE en gras est un titre de puce (bloc 4 : « **TF-0995 — la
    // chaîne mesurait un répertoire que la session ne charge pas.** suite en prose »), un verdict
    // ou une question de décision : structure, pas emphase — 40 synthèses sur 117 le portaient.
    // Seul le gras qui surgit APRÈS du texte sur la même ligne est compté.
    if (ligne.startsWith(x[0])) continue;
    gras.push({ offset: x.index, mots: n, texte: x[1] });
  }
  // Seuil d'échec calibré le 12/09 : sur 171 textes, deux portent 5 passages ou plus (7 et 17,
  // de 73 à 193 mots en gras chacun) ; un à quatre passages avertissent, cinq échouent.
  if (gras.length >= 5) {
    pousser("EC-4-gras", "FAIL",
      `${gras.length} passages en gras de 12 mots ou plus (1er de ${gras[0].mots} mots : « ${extrait(texteProse, gras[0].offset + 2)} ») — le gras souligne un mot, il ne porte pas une phrase`,
      ligneDe(gras[0].offset));
  } else if (gras.length) {
    pousser("EC-4-gras", "AVERT",
      `${gras.length} passage(s) en gras de 12 mots ou plus (1er de ${gras[0].mots} mots : « ${extrait(texteProse, gras[0].offset + 2)} »)`,
      ligneDe(gras[0].offset));
  } else {
    pousser("EC-4-gras", "PASS", "aucun passage en gras de 12 mots ou plus");
  }
  const emoji = horsCode.findIndex((l) =>
    /^\s*(?:[-*+]|\d+[.)])\s+\p{Extended_Pictographic}/u.test(l) || /^\s*\p{Extended_Pictographic}/u.test(l));
  if (emoji >= 0) {
    pousser("EC-4-emoji", "FAIL",
      `puce dont le marqueur ou le premier caractère est un emoji : « ${horsCode[emoji].trim().slice(0, 60)} » — un signe ne remplace pas le fait`,
      emoji + 1);
  } else {
    pousser("EC-4-emoji", "PASS", "aucune puce emoji");
  }

  // EC-5 — ATTAQUES RÉPÉTÉES. AVERT et JAMAIS FAIL : trois phrases qui commencent pareil sont
  // parfois une anaphore voulue. L'oracle nomme, l'humain tranche.
  const premierMot = (p) => {
    const x = /^[^\p{L}]*(\p{L}[\p{L}'’-]*)/u.exec(p.texte);
    return x ? x[1].toLowerCase() : "";
  };
  let attaque = null;
  for (let i = 0; i + 2 < ph.length; i++) {
    const a = premierMot(ph[i]);
    if (a.length < 3 || MOTS_OUTILS.has(a)) continue;
    if (a === premierMot(ph[i + 1]) && a === premierMot(ph[i + 2])) { attaque = { mot: a, p: ph[i] }; break; }
  }
  if (attaque) {
    pousser("EC-5", "AVERT",
      `trois phrases consécutives ouvrent sur « ${attaque.mot} » — varier l'attaque, ou assumer l'anaphore`,
      ligneDe(attaque.p.debut));
  } else {
    pousser("EC-5", "PASS", "aucune série de trois attaques identiques");
  }

  // EC-7 (TF-1045, 16/09/2026) — LE MOT QUE LE DESTINATAIRE NE LIT PAS.
  //
  // LE FAIT : un retour de vocabulaire clos « corrigé » le 08/09, le même mot redemandé par le
  // client le 10/09. Mesure du 11/09 — le référentiel de jargon du pilot ne portait pas le terme,
  // le CLAUDE.md du produit ne citait aucun lexique, et le juge des restitutions ne lisait aucun
  // glossaire : deux synthèses employant le terme étaient PASS sur 41 règles. *Le producteur
  // n'avait rencontré la règle NULLE PART sur son chemin.* C'est pour cela que la règle vit ICI en
  // premier : cet oracle est joué à CHAQUE écriture d'un `.md` du produit, donc au moment où l'on
  // écrit, et non au retour humain suivant.
  //
  // LE LEXIQUE EST CELUI DU PRODUIT, jamais une liste globale : le terme fondateur est un mot
  // ordinaire du français et un terme juste ailleurs. Absent, la règle rend SKIP — dit à voix
  // haute, jamais PASS par silence. Les citations ne sont pas jugées (`termesEmployes` retire le
  // code) : un nom de champ n'est pas une déclaration d'intention de l'auteur.
  {
    const lex = chargerLexique({ cheminJuge: options.cheminJuge || null });
    if (!lex.trouve)
      pousser("EC-7", "SKIP", "aucun lexique de client dans le socle de ce projet (forge\\LEXIQUE.json, docs\\projet\\LEXIQUE.json ou references\\LEXIQUE.json) — vocabulaire du destinataire non jugé");
    else if (lex.illisible)
      pousser("EC-7", "SKIP", `lexique ILLISIBLE (${lex.chemin}) : ${lex.illisible} — ce n'est pas un constat sur le texte`);
    else if (!lex.termes.length)
      pousser("EC-7", "SKIP", `lexique présent et VIDE (${lex.chemin}) — aucun terme n'a encore coûté d'aller-retour`);
    else {
      const employes = termesEmployes(texte, lex.termes);
      if (employes.length)
        pousser("EC-7", "FAIL",
          `${employes.length} terme(s) proscrit(s) par le lexique du destinataire : ` +
          employes.map((t) => `« ${t.proscrit} » (${t.occurrences}) → « ${t.remplacer_par || "à remplacer"} »`).join(" · ") +
          " — un mot qui a coûté un aller-retour au client se remplace avant la livraison, pas après le second retour",
          ligneDe(0));
      else
        pousser("EC-7", "PASS", `aucun des ${lex.termes.length} terme(s) proscrit(s) du lexique n'est employé`);
    }
  }

  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  return { mots, verdict, findings, non_juge: nonJuge(donnee) };
}

function nonJuge(donnee) {
  return [...(donnee?.non_juge || []), ...NON_JUGE_ORACLE];
}

// ── LA DONNÉE ────────────────────────────────────────────────────────────────────────────────

function lireDonnee(chemin) {
  if (!existsSync(chemin)) return { erreur: `donnée introuvable : ${chemin}` };
  try {
    const d = JSON.parse(readFileSync(chemin, "utf8"));
    if (!Array.isArray(d.familles) || !d.familles.length) return { erreur: `donnée sans familles : ${chemin}` };
    return { donnee: d };
  } catch (e) {
    return { erreur: `donnée illisible : ${chemin} (${e.message})` };
  }
}

const erreur = (message) => {
  console.log(JSON.stringify({ oracle: NOM, version: VERSION, verdict: "ERREUR", message }));
  process.exit(2);
};

// ── LA BASELINE ──────────────────────────────────────────────────────────────────────────────
//
// Un seuil ne se pose pas au jugé : il se pose sur un corpus, et il se REJOUE. Le contrat du
// mandat (§4) est que le corpus déjà écrit du pilot reste PASS à 95 % ou plus — sans quoi la
// doctrine condamnerait rétroactivement ce qu'elle n'a pas relu.
function modeBaseline(dossier, donnee) {
  let fichiers;
  try {
    fichiers = readdirSync(dossier).filter((f) => f.toLowerCase().endsWith(".md") && f.toLowerCase() !== "readme.md").sort();
  } catch {
    erreur(`dossier illisible : ${dossier}`);
    return;
  }
  const lignes = [];
  let pass = 0, skip = 0, fail = 0;
  for (const f of fichiers) {
    const chemin = join(dossier, f);
    const rel = relative(RACINE, resolve(chemin)).replace(/\\/g, "/");
    const r = juger(readFileSync(chemin, "utf8"), { donnee, cheminRelatif: rel });
    if (r.verdict === "PASS") pass++; else if (r.verdict === "SKIP") skip++; else fail++;
    const enDefaut = r.findings.filter((x) => x.statut === "FAIL").map((x) => x.regle).join(" ") || "—";
    lignes.push(`${f.slice(0, 74).padEnd(74)} ${String(r.mots).padStart(6)}  ${r.verdict.padEnd(5)}  ${enDefaut}`);
  }
  const juges = pass + fail;
  const taux = juges ? (pass * 100) / juges : 100;
  console.log(`${"fichier".padEnd(74)} ${"mots".padStart(6)}  ${"verdict".padEnd(5)}  familles en défaut`);
  for (const l of lignes) console.log(l);
  console.log(`baseline : ${pass} PASS, ${skip} SKIP, ${fail} FAIL sur ${fichiers.length} — ${taux.toFixed(1)} % PASS (hors SKIP)`);
  console.log(JSON.stringify({ mode: "baseline", total: fichiers.length, pass, skip, fail, taux_pass: Math.round(taux * 10) / 10 }));
  process.exit(taux >= 95 ? 0 : 1);
}

// ── LA RECETTE À DOUBLE SENS ─────────────────────────────────────────────────────────────────
//
// Quatre fixtures, et la ROUGE est la plus importante : une règle qui n'a jamais échoué n'a jamais
// prouvé qu'elle savait échouer. La VERTE porte un bloc de code SATURÉ de tournures interdites —
// c'est la preuve que citer n'est pas commettre.

const FIXTURE_ROUGE = `# Note stratégique sur la transformation

Il est important de noter que ce document ouvre une réflexion — une réflexion large — qui, dans un monde en pleine mutation, se révèle absolument cruciale pour l'ensemble des parties prenantes concernées, et il convient de souligner que chacun y trouvera matière à penser, car les experts s'accordent à considérer que la transformation reste un levier incontournable pour toute organisation.
Il est essentiel de rappeler que cette démarche engage tout le monde — les équipes, les managers, la direction générale — et que ce n'est pas seulement une affaire d'outillage mais une affaire humaine, puisqu'il est généralement admis que la conduite du changement demeure le facteur numéro un de réussite d'un programme de cette ampleur, ce que de nombreuses études montrent depuis longtemps.
Notons que la trajectoire proposée se veut progressive — progressive mais ambitieuse — et qu'elle s'appuie sur des retours de terrain collectés auprès des directions métier, des équipes techniques et des utilisateurs finaux, de sorte que chacun puisse s'y reconnaître sans renoncer aux priorités qu'il porte depuis le début de l'année.

Il va sans dire que la quatrième phrase de cette série poursuit exactement sur la même cadence que les trois précédentes — une cadence longue, très longue — afin que la série de phrases de plus de trente-cinq mots atteigne la longueur que l'oracle refuse, c'est-à-dire sept d'affilée sans respiration. Force est de constater que la cinquième phrase ne fait pas mieux, puisqu'elle empile elle aussi des subordonnées, des incises — encore des incises — et des compléments circonstanciels jusqu'à dépasser largement les trente-cinq mots que la règle E-2 fixe comme borne haute d'une phrase lisible par quelqu'un. Comme nous l'avons vu, la sixième phrase de la série reprend le même procédé — l'incise, la subordonnée relative, le complément de manière et le complément de temps — afin d'atteindre sans peine les trente-cinq mots qu'il faut dépasser pour compter, et elle y parvient sans effort. Il va sans dire que la septième phrase, la dernière de la série, s'étire encore par les mêmes moyens — une incise ici, une relative là, un dernier complément circonstanciel — pour que la cascade atteigne le nombre exact que l'oracle refuse désormais, c'est-à-dire sept phrases longues d'affilée.

De plus, la plateforme se situe au cœur de la chaîne de valeur — au cœur, vraiment.
En outre, cette approche est non seulement pragmatique mais également soutenable.
Par ailleurs, on estime généralement que les gains apparaissent dès le premier trimestre.
Qui plus est, la méthode retenue est proprement révolutionnaire pour le secteur — sans précédent.
D'autre part, qu'il s'agisse de gouvernance ou d'outillage, le cap reste le même.
Également, la dynamique engagée se nourrit des premiers succès constatés sur le terrain — partout.
Aussi, le dispositif de pilotage sera reconduit — sans changement notable — cette année.

Nous allons voir les axes retenus, que ce soit du côté des équipes ou de la direction :

- Axe un — la gouvernance
  - sous-axe — les instances
    - détail — la fréquence des comités
- Axe deux — l'outillage
  - sous-axe — le socle
    - détail — les environnements

✅ Un premier jalon — celui du trimestre — est posé pour la fin du mois de juin.
🚀 Un second jalon suivra — sans engagement ferme — au trimestre suivant.

Pour finir, le comité rappelle que **cette phrase entière est mise en gras au milieu du paragraphe pour appuyer un propos qui n'en avait aucun besoin**, puis il ajoute que **la seconde phrase soulignée de la même façon ne porte pas davantage de fait que la première et fatigue le lecteur**, avant de conclure que **la troisième emphase de ce paragraphe achève de transformer le gras en bruit de fond que plus personne ne lit**. Le rapporteur insiste encore : **une quatrième phrase soulignée au milieu du texte ne convainc pas davantage que les trois premières et fatigue** ; et il termine sur **une cinquième emphase de douze mots au moins qui fait passer ce paragraphe au-dessus du seuil**.

En conclusion, la démarche est un véritable atout — un atout durable — dans un marché en constante évolution.
Pour résumer, la transformation sera progressive, mesurée et partagée par tous les acteurs.
Au final, il reste à confirmer le calendrier avec la direction générale avant la fin du mois.
N'hésitez pas à revenir vers nous pour toute précision — j'espère que cela vous aidera.
`;

const FIXTURE_VERTE = `# Journal de mesure du lot 12

Le lot 12 est entre en recette le 2 septembre. Trois environnements ont ete mesures : poste local,
integration, preproduction. Les relevés viennent du journal d'execution, archive au meme dossier.

| environnement | duree du build | tests joues | tests en echec |
|---|---|---|---|
| poste local | 4 min 10 s | 312 | 0 |
| integration | 6 min 02 s | 312 | 2 |
| preproduction | 6 min 55 s | 312 | 0 |

Les deux echecs d'integration portent sur le meme composant. Le premier vient d'un fuseau horaire
code en dur — le poste local est en UTC. Le second vient d'un fichier de donnees absent du depot.
Les deux ont ete corriges le 3 septembre. La recette a ete rejouee le meme jour. Elle rend zero
echec sur les trois environnements.

La duree du build a augmente de 40 secondes entre le lot 11 et le lot 12. La cause est identifiee :
le lot 12 ajoute quarante tests. Le cout par test reste stable, a 1,2 seconde. Aucune action n'est
demandee sur ce point.

Un contre-exemple utile, tire d'un ancien rapport, montre ce que la doctrine ecarte :

\`\`\`markdown
En conclusion, il est important de noter que les experts s'accordent a dire que cette solution
revolutionnaire est absolument cruciale. De plus, elle est non seulement performante mais aussi
incontournable. N'hesitez pas a nous solliciter — j'espere que cela vous aidera.
\`\`\`

Ce bloc est cite, pas ecrit. L'oracle ne le compte pas, et c'est le point : un texte qui montre une
tournure fautive ne la commet pas.

Trois suites sont prevues. La migration de la base est planifiee le 20 septembre. Le decommissionnement
de l'ancien service suit le 27 — la bascule est reversible pendant huit jours. Le bilan de recette
sera depose le 30, avec les relevés bruts.

Les chiffres ci-dessus viennent du journal d'execution. Ils ont ete releves deux fois, a deux jours
d'intervalle. L'ecart entre les deux relevés est inferieur a 5 secondes sur chaque environnement.
La mesure est donc tenue pour stable. Le detail des commandes jouees vit dans le meme dossier que
ce journal, sous le nom des trois environnements.
`;

const FIXTURE_COURTE = `# Point rapide

Il est important de noter que le lot 12 est entre en recette le 2 septembre. Deux tests
echouent en integration. Ils portent sur le meme composant. La correction est prevue demain.
`;

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "oracle-ecriture-"));
  const moi = fileURLToPath(import.meta.url);
  const casse = [];
  const jouer = (nom, contenu, args = []) => {
    const chemin = join(dir, nom);
    writeFileSync(chemin, contenu, "utf8");
    const r = spawnSync(process.execPath, [moi, chemin, ...args], { encoding: "utf8" });
    let j = null;
    try { j = JSON.parse(r.stdout || "{}"); } catch { /* illisible */ }
    return { statut: r.status, j, brut: r.stdout };
  };

  // 1. ROUGE — un texte sature doit ECHOUER, et sur au moins cinq regles distinctes.
  const rouge = jouer("rouge.md", FIXTURE_ROUGE);
  if (rouge.statut !== 1) casse.push(`rouge : exit ${rouge.statut}, attendu 1`);
  if (rouge.j?.verdict !== "FAIL") casse.push(`rouge : verdict ${rouge.j?.verdict}, attendu FAIL`);
  const reglesRouges = new Set((rouge.j?.findings || []).filter((f) => f.statut === "FAIL").map((f) => f.regle));
  if (reglesRouges.size < 5) casse.push(`rouge : ${reglesRouges.size} regle(s) en FAIL, attendu >= 5 (${[...reglesRouges].join(", ")})`);
  // Recalibrage du 12/09 : les regles de STRUCTURE doivent encore savoir echouer apres leur
  // assouplissement (EC-2 a cinq phrases d'affilee, EC-4-gras hors lignes entieres) — sinon le
  // recalibrage les aurait tuees en silence.
  for (const r of ["EC-2", "EC-3", "EC-4-gras", "EC-4-emoji"]) {
    if (!reglesRouges.has(r)) casse.push(`rouge : la regle de structure ${r} n'echoue plus sur la fixture saturee`);
  }
  const famillesRouges = [...reglesRouges].filter((r) => r.startsWith("EC-1:"));
  if (famillesRouges.length < 5) casse.push(`rouge : ${famillesRouges.length} famille(s) au-dessus du seuil d'echec, attendu >= 5`);
  if (!(rouge.j?.mots >= 300)) casse.push(`rouge : ${rouge.j?.mots} mots de prose, attendu >= 300`);

  // 2. VERTE — une prose sobre passe, et le bloc de code n'est pas compte.
  const verte = jouer("verte.md", FIXTURE_VERTE);
  if (verte.statut !== 0) casse.push(`verte : exit ${verte.statut}, attendu 0`);
  if (verte.j?.verdict !== "PASS") casse.push(`verte : verdict ${verte.j?.verdict}, attendu PASS`);
  const failsVerts = (verte.j?.findings || []).filter((f) => f.statut === "FAIL");
  if (failsVerts.length) casse.push(`verte : ${failsVerts.length} FAIL — ${failsVerts.map((f) => f.regle).join(", ")}`);
  if (!(verte.j?.mots >= 300)) casse.push(`verte : ${verte.j?.mots} mots de prose, attendu >= 300`);
  if (/oracle-ecriture-cite/.test(verte.brut || "")) casse.push("verte : sortie inattendue");

  // 3. COURTE — sous le minimum, les densites ne sont pas jugees et le texte passe.
  const courte = jouer("courte.md", FIXTURE_COURTE);
  if (courte.statut !== 0) casse.push(`courte : exit ${courte.statut}, attendu 0`);
  if (courte.j?.verdict !== "PASS") casse.push(`courte : verdict ${courte.j?.verdict}, attendu PASS`);
  const ec1 = (courte.j?.findings || []).filter((f) => f.regle === "EC-1");
  if (!(ec1.length === 1 && ec1[0].statut === "SKIP")) casse.push("courte : les densites sont jugees alors que le texte est sous le minimum");

  // 5, 6 et 7 (TF-1045) — EC-7, LE LEXIQUE DU DESTINATAIRE, DANS SES TROIS SENS. Sans lexique, la
  // regle rend SKIP et le dit : un produit sans lexique n'est jamais PASS par silence. Avec un
  // lexique, le meme texte passe ou echoue selon le SEUL mot qui change — et la citation du meme
  // mot entre accents graves n'est jamais comptee, sans quoi le lexique ferait paraphraser des
  // preuves exactes, defaut paye le meme jour sur S37 (TF-0992).
  const ec7Absent = jouer("sans-lexique.md", FIXTURE_COURTE);
  const f7abs = (ec7Absent.j?.findings || []).filter((f) => f.regle === "EC-7");
  if (!(f7abs.length === 1 && f7abs[0].statut === "SKIP"))
    casse.push("EC-7 : sans lexique dans le socle du projet, la regle devrait rendre SKIP et le DIRE — " +
      `obtenu ${JSON.stringify(f7abs)}`);

  mkdirSync(join(dir, "produit", "forge"), { recursive: true });
  writeFileSync(join(dir, "produit", "forge", "LEXIQUE.json"), JSON.stringify({
    format: "pilot/lexique-produit@1",
    termes: [{ proscrit: "grain", remplacer_par: "granularite", depuis: "2026-09-08",
      preuve: "retour humain du 08/09/2026, redemande le 10/09 (ledger seq 99)" }],
  }), "utf8");
  const jouerProduit = (nom, contenu) => {
    const chemin = join(dir, "produit", nom);
    writeFileSync(chemin, contenu, "utf8");
    const r = spawnSync(process.execPath, [moi, chemin], { encoding: "utf8" });
    let j = null;
    try { j = JSON.parse(r.stdout || "{}"); } catch { /* illisible */ }
    return { statut: r.status, j };
  };
  const LEX_ROUGE = "# Note\n\nLe modele expose le grain quotidien des ventes, puis le grain magasin.\n"
    + "La colonne `grain` du registre machine garde son nom : c'est une citation, pas une intention.\n";
  const LEX_VERTE = LEX_ROUGE.replace("le grain quotidien", "la granularite quotidienne").replace("le grain magasin", "la granularite magasin");
  const ec7r = jouerProduit("lexique-rouge.md", LEX_ROUGE);
  const ec7v = jouerProduit("lexique-verte.md", LEX_VERTE);
  const f7r = (ec7r.j?.findings || []).find((f) => f.regle === "EC-7");
  const f7v = (ec7v.j?.findings || []).find((f) => f.regle === "EC-7");
  if (f7r?.statut !== "FAIL")
    casse.push("EC-7 : deux emplois en prose d'un terme proscrit par le lexique du destinataire passent — " +
      "c'est par ce silence qu'un mot clos « corrige » le 08/09 a ete redemande par le client le 10/09 (TF-1045)");
  if (f7v?.statut !== "PASS")
    casse.push("EC-7 : le MEME texte avec le terme retenu est accuse — la citation entre accents graves est comptee " +
      `comme une intention de l'auteur : ${JSON.stringify(f7v)}`);

  // 4. ANTERIORITE — le meme texte rouge, sous un chemin declare, rend SKIP et jamais FAIL.
  const ante = jouer("anteriorite.md", FIXTURE_ROUGE, ["--chemin-relatif", "REGLES-PROJET.md"]);
  if (ante.statut !== 0) casse.push(`anteriorite : exit ${ante.statut}, attendu 0`);
  if (ante.j?.verdict !== "SKIP") casse.push(`anteriorite : verdict ${ante.j?.verdict}, attendu SKIP`);
  if ((ante.j?.findings || []).length !== 1 || ante.j.findings[0].regle !== "EC-6") {
    casse.push("anteriorite : d'autres regles ont ete jouees alors que le texte est exempte");
  }

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test ${NOM} : ${casse.length} DEFAUT(S)\n - ${casse.join("\n - ")}`
    : `Self-test ${NOM} : 7 cas, 0 défaut (7/7 PASS — rouge FAIL sur ${reglesRouges.size} règles, verte PASS sans FAIL, courte PASS densités non jugées, antériorité SKIP ; EC-7 dans ses TROIS sens — sans lexique SKIP et dit, deux emplois en prose FAIL, le terme retenu PASS avec la citation entre accents graves épargnée (TF-1045))`);
  return casse.length ? 1 : 0;
}

// ── LA LIGNE DE COMMANDE ─────────────────────────────────────────────────────────────────────

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replace(/\\/g, "/") === resolve(process.argv[1]).toLowerCase().replace(/\\/g, "/");

if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());

  const valeur = (drapeau) => {
    const i = args.indexOf(drapeau);
    return i >= 0 ? args[i + 1] : null;
  };
  const cheminDonnee = valeur("--donnee") || DONNEE_PAR_DEFAUT;
  const { donnee, erreur: pourquoi } = lireDonnee(cheminDonnee);
  if (pourquoi) erreur(pourquoi);

  const dossier = valeur("--baseline");
  if (dossier) modeBaseline(dossier, donnee);

  const DRAPEAUX_A_VALEUR = new Set(["--donnee", "--chemin-relatif", "--baseline"]);
  const cible = args.find((a, i) => !a.startsWith("--") && !(i > 0 && DRAPEAUX_A_VALEUR.has(args[i - 1])));
  if (!cible) erreur("cible absente — usage : node oracle-ecriture.mjs <fichier.md> [--donnee <tics.json>] | --baseline <dossier> | --self-test");
  if (!existsSync(cible)) erreur(`fichier introuvable : ${cible}`);

  const cheminRelatif = valeur("--chemin-relatif") || relative(RACINE, resolve(cible)).replace(/\\/g, "/");
  let texte;
  try { texte = readFileSync(cible, "utf8"); } catch (e) { erreur(`fichier illisible : ${cible} (${e.message})`); }
  const r = juger(texte, { donnee, cheminRelatif, cheminJuge: resolve(cible) });
  console.log(JSON.stringify({
    oracle: NOM, version: VERSION, cible: String(cible).replace(/\\/g, "/"),
    mots: r.mots, verdict: r.verdict, findings: r.findings, non_juge: r.non_juge,
  }, null, 1));
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
