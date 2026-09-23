#!/usr/bin/env node
/**
 * oracle-remise-traduction.mjs — la remise d'une chaîne de traduction tient-elle ses quatre
 * promesses, ou les a-t-elle seulement écrites ?
 *
 * Pourquoi il existe (TF-0670 et TF-0671, ouvertes le 26/08/2026 en fermeture de deux risques
 * que la restitution du jour déclarait NON COUVERTS).
 *
 * ============================================================================================
 * CE QUE `CHAINE-TRADUCTION.md` PROMETTAIT SANS L'OUTILLER
 * ============================================================================================
 *
 * La fiche déclare onze étapes et quatre critères de réussite. Trois des quatre étapes
 * manquantes ont été outillées le 26/08. **Deux promesses restaient de la prose :**
 *
 *   · l'étape **A9**, « RELECTURE NATIVE DÉCLARÉE, bloquante si absente » — énoncée bloquante,
 *     et rien ne l'arrêtait. Fait mesuré : onze fautes d'accord sont parties en production
 *     derrière une CI verte, et la relecture native a eu lieu APRÈS la mise en production ;
 *   · les **quatre critères de réussite**, rédigés en prose et rejoués par aucune commande.
 *     C'est la classe de défaut de R-49 et de G7 : *une preuve nommée et datée qu'aucun script
 *     ne reproduit vieillit en silence.*
 *
 * ============================================================================================
 * CE QU'IL JUGE — quatre règles, sur la FICHE DE REMISE du run
 * ============================================================================================
 *
 *   T1 · une **relecture native** est déclarée : faite — par qui, quand — ou **EXPLICITEMENT
 *        REFUSÉE avec son motif**. Le refus est une réponse valide ; le silence ne l'est pas.
 *   T2 · **100 % des ancres verbatim** citées existent LITTÉRALEMENT dans le fichier visé. Une
 *        ancre qui n'y est pas rend le plan inapplicable — et c'est le critère que la
 *        candidature nomme « le plus directement outillable et le plus utile ».
 *   T3 · la liste des **arbitrages posés à l'humain** est NON VIDE. Une chaîne dont cette liste
 *        est vide n'a pas été économe : elle a décidé à la place de quelqu'un (loi n° 5).
 *   T4 · la remise **cite le verdict** des contrôles mécaniques d'accord et de cohérence
 *        interne. Les citer n'est pas les jouer — mais ne pas les citer, c'est ne pas savoir.
 *
 * ============================================================================================
 * CE QU'IL NE FAIT PAS, et il faut le lire avant de s'y fier
 * ============================================================================================
 *
 * **Il ne juge pas la QUALITÉ d'une relecture.** Personne ne remplace un locuteur natif, et
 * aucun oracle ne dira si une relecture était bonne. T1 rend l'ABSENCE bruyante, rien de plus —
 * le filet mécanique va AVANT le locuteur natif, jamais à sa place.
 *
 * **Il ne rejoue pas les contrôles qu'il exige de citer.** T4 vérifie qu'un verdict est
 * rapporté, pas qu'il est vrai. Les jouer est le travail du pan i18n de forge-tests.
 *
 * **Il ne mesure pas la seconde moitié du critère de réussite** — « les tours de classe DÉFAUT
 * tombent à 0 ET les tours de DÉCISION restent ≥ 1 ». Cette moitié se compte sur une session,
 * pas sur un document, et la compter ici demanderait une donnée qu'aucun artefact ne porte. T3
 * en tient l'esprit sur ce que le document sait dire.
 *
 * ============================================================================================
 * LA REMISE D'UN AUDIT — T5 à T8, chaîne B « audite les traductions » (TF-1318, 23/09/2026)
 * ============================================================================================
 *
 * Le lot source (`Produit-02 - RETOURS - 20260826f`) nomme dix étapes B1–B10 ; au 22/09, sept
 * n'avaient pas de porteur complet, et la session d'origine a compté dix-sept tours pour un seul
 * audit. Quatre règles de plus, jouées SEULEMENT quand le `role:` de la fiche dit « audit » — une
 * remise de run de traduction (chaîne A) les rend SANS_OBJET et garde son verdict d'avant :
 *
 *   T5 · (B10) chaque étape B1–B10 porte son VERDICT dans `## Étapes de la chaîne`, et une étape
 *        non jouée — SANS_OBJET, MANUELLE, NON COUVERTE — dit son motif. C'est le principe 2 de
 *        la chaîne, tenu : une étape sans verdict BLOQUE la remise au lieu d'être oubliée. Fait :
 *        l'axe GEO (B7) a dû être ajouté à la main au tour 2, faute d'étape qui le nomme.
 *   T6 · (B10) chaque locale servie est COUVERTE, ou déclarée non couverte avec son motif. Fait :
 *        la relecture s'était bornée aux langues substituées, et les quatre autres portaient des
 *        défauts du même run (tour 17). `--catalogue <dossier>` confronte la liste déclarée aux
 *        locales réellement présentes dans le catalogue.
 *   T7 · (B2) la carte des sources de vérité est tenue : tout fichier ancré y est déclaré SOURCE ;
 *        tout artefact nomme sa source et sa commande de régénération. Fait : un run a modifié 9
 *        fichiers sources, et le build a régénéré 203 pages (lot `20260823a`) — une ancre posée sur
 *        l'une de ces pages est une correction écrasée au build suivant.
 *   T8 · (B5) la remise cite le verdict de la CONFRONTATION AUX DONNÉES. Fait : « 8 gîtes » servi
 *        dans les sept langues quand la donnée en déclare 5 — sept locales cohérentes entre elles,
 *        et toutes fausses. Seul un point fixe HORS du catalogue le voit (contrôle (g) du pan i18n
 *        de forge-tests, TF-0644).
 *
 * Le format de la carte et des ancres vit dans `scripts/lib-plan-ancres.mjs`, partagé avec le
 * verbe qui PRODUIT le plan (`scripts/produire-plan-ancres.mjs`) : un format, un seul lecteur.
 *
 * Usage : node oracle-remise-traduction.mjs <FICHE-REMISE.md> [--racine <dossier>] [--catalogue <dossier>]
 *         node oracle-remise-traduction.mjs --self-test
 * Recette de T5–T8 : `oracles/oracle-remise-traduction.test.mjs`.
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, isAbsolute, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { ancresDe, lireCarte, jugerCarte } from "../scripts/lib-plan-ancres.mjs";

/** Le bloc d'une section `## <titre>`, jusqu'au prochain titre de même niveau. */
function bloc(texte, motifTitre) {
  const lignes = texte.split(/\r?\n/);
  const debut = lignes.findIndex((l) => motifTitre.test(l));
  if (debut < 0) return null;
  const suite = [];
  for (let i = debut + 1; i < lignes.length; i += 1) {
    if (/^##\s/.test(lignes[i])) break;
    suite.push(lignes[i]);
  }
  return suite.join("\n");
}

/** Une relecture FAITE : un nom et une date. Une relecture REFUSÉE : le mot, plus un motif. */
const FAITE = /\bfaite?\b[^\n]{0,80}?\bpar\b\s+([^\n,;]{2,60}?)\s*[,;(]?\s*(?:le\s+)?(\d{4}-\d{2}-\d{2})/i;
const REFUSEE = /\brefus[ée]e?\b\s*[—:-]\s*(\S[^\n]{9,})/i;

// ---- Chaîne B : la remise d'un AUDIT ------------------------------------------------------------
/** Une fiche d'AUDIT se déclare telle. Sans le mot, T5–T8 ne s'appliquent pas : c'est la borne. */
const AUDIT = /^\s*role\s*:.*\baudit/im;
const ETAPES_B = ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"];
/** Les états qui disent qu'une étape n'a PAS été jouée — et qui doivent donc dire pourquoi. */
const ETATS_A_MOTIF = ["SANS_OBJET", "MANUELLE", "NON_COUVERTE"];
/** `- B4 : PASS — …` · `- **B7** : MANUELLE — motif`. Le motif suit l'état, après un tiret ou deux-points. */
const LIGNE_ETAPE = /^\s*[-*]\s*\**\s*(B(?:10|[1-9]))\s*\**\s*[:—–-]\s*\**\s*(PASS|FAIL|SANS[_ ]OBJET|MANUELLE|NON[_ ]COUVERTE)\**(?=[\s—–:.,-]|$)\s*[—–:-]?\s*(.*)$/i;
/** `- fr : couverte` · `- nl : non couverte — motif`. */
const LIGNE_LOCALE = /^\s*[-*]\s*\**\s*([a-z]{2,3}(?:[-_][A-Za-z]{2,4})?)\s*\**\s*[:—–-]\s*(non\s+couverte?|couverte?)(?![a-zà-ÿ])\s*[—–:-]?\s*(.*)$/i;
/** Un code de locale DÉCLARÉ : deux ou trois lettres, une région facultative. */
const CODE_DECLARE = /^[a-z]{2,3}(?:[-_][A-Za-z]{2,4})?$/i;
/**
 * Les codes ISO 639-1. Un nom de fichier de CATALOGUE n'est pris pour une locale que s'il en porte
 * un : sans cette liste fermée, `api.json` ou `all.js` deviendraient des « locales non déclarées »
 * et la règle accuserait un dossier sain. Une donnée de norme, stable, pas un référentiel périssable.
 */
const ISO_639_1 = new Set(("aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy "
  + "da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii "
  + "ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr "
  + "ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl "
  + "sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu")
  .split(" "));
const EXT_CATALOGUE = /\.(json|js|mjs|cjs|ts|ya?ml|po)$/i;
const estLocaleDeCatalogue = (nom) => {
  const m = /^([a-z]{2})(?:[-_][A-Za-z]{2,4})?$/.exec(nom);
  return !!m && ISO_639_1.has(m[1]);
};

/**
 * Les locales qu'un dossier de catalogue SERT, lues sur ses NOMS — `fr.json`, `pt-BR.mjs`, ou un
 * sous-dossier `de/`. Le contenu n'est jamais ouvert : la question est « quelles langues », pas
 * « quelles chaînes ». `null` quand le dossier n'existe pas : « je ne peux pas lire » n'est pas
 * « il n'y a rien ».
 */
export function localesDuCatalogue(dossier) {
  if (!dossier || !existsSync(dossier) || !statSync(dossier).isDirectory()) return null;
  const vues = new Set();
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    if (e.isDirectory() && estLocaleDeCatalogue(e.name)) vues.add(e.name);
    else if (e.isFile() && EXT_CATALOGUE.test(e.name)) {
      const base = e.name.replace(EXT_CATALOGUE, "");
      if (estLocaleDeCatalogue(base)) vues.add(base);
    }
  }
  return [...vues].sort();
}

/** La valeur d'un champ du frontmatter, ou null. */
function champ(texte, nom) {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texte);
  if (!fm) return null;
  const m = new RegExp(`^\\s*${nom}\\s*:\\s*(.+?)\\s*$`, "im").exec(fm[1]);
  return m ? m[1] : null;
}

export function juger(fiche, racine = null, catalogue = null) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, message, ou) => F.push({ regle, statut: "FAIL", message, ou });

  const texte = readFileSync(fiche, "utf8");
  const base = racine || dirname(fiche);

  // LA BORNE : un document qui ne se déclare pas fiche de remise n'en est pas une, et le juger
  // comme telle accuserait n'importe quel markdown du dépôt.
  if (!/^\s*role\s*:.*(remise|livraison).*(traduction|multilingue)/im.test(texte)) {
    return [{ regle: "T0", statut: "NON_JUGEABLE",
      message: `${fiche} ne déclare pas \`role:\` … remise/livraison … traduction : ce n'est pas `
        + "une fiche de remise, et la juger comme telle accuserait un document quelconque" }];
  }

  // ---- T1 : la relecture native ------------------------------------------------------------
  const b1 = bloc(texte, /^##\s.*relecture\s+native/i);
  if (b1 === null) {
    ko("T1", "AUCUNE section « relecture native ». L'étape A9 de la chaîne est déclarée BLOQUANTE "
      + "si la relecture n'est pas déclarée : le refus est une réponse valide, le silence ne l'est "
      + "pas. Mesuré : onze fautes d'accord sont parties en production derrière une CI verte, et "
      + "la relecture a eu lieu APRÈS la mise en production (TF-0670)");
  } else {
    const f = FAITE.exec(b1);
    const r = REFUSEE.exec(b1);
    if (f) ok("T1", `relecture native DÉCLARÉE FAITE par « ${f[1].trim()} » le ${f[2]}`);
    else if (r) ok("T1", `relecture native EXPLICITEMENT REFUSÉE, motif écrit : « ${r[1].trim().slice(0, 80)} »`);
    else ko("T1", "la section « relecture native » existe mais ne déclare NI une relecture faite "
      + "— par qui, à quelle date — NI un refus explicite avec son motif. Une section présente et "
      + "vide est indiscernable d'un oubli, et c'est la loi n° 3", b1.trim().slice(0, 120));
  }

  // ---- T2 : les ancres verbatim -------------------------------------------------------------
  // Le motif d'une ancre vit dans `scripts/lib-plan-ancres.mjs` depuis TF-1318 : le verbe qui
  // PRODUIT le plan l'écrit, cet oracle le relit, et un format n'a qu'un lecteur.
  const ancres = ancresDe(texte);
  if (!ancres.length) {
    F.push({ regle: "T2", statut: "SANS_OBJET",
      message: "aucune ancre verbatim citée dans cette remise — rien à confronter. Une ancre "
        + "s'écrit `- \\`le texte exact\\` → chemin/du/fichier` ; sans elle, un plan n'est pas "
        + "vérifiable, il est seulement lisible" });
  } else {
    const perdues = [];
    const introuvables = [];
    for (const a of ancres) {
      const chemin = isAbsolute(a.cible) ? a.cible : join(base, a.cible);
      if (!existsSync(chemin)) { introuvables.push(a); continue; }
      let contenu = "";
      try { contenu = readFileSync(chemin, "utf8"); } catch { introuvables.push(a); continue; }
      if (!contenu.includes(a.texte)) perdues.push(a);
    }
    if (perdues.length || introuvables.length) ko("T2",
      `${perdues.length + introuvables.length} ancre(s) sur ${ancres.length} ne sont pas LITTÉRALEMENT `
      + "dans le fichier visé. Une ancre qui n'y est pas rend le plan INAPPLICABLE : celui qui "
      + "l'applique cherche un texte qui n'existe pas, et conclut que le plan est faux ou que le "
      + "fichier a changé — sans pouvoir trancher (TF-0671, critère 1)",
      [...introuvables.map((a) => `${a.cible} : fichier introuvable`),
        ...perdues.map((a) => `${a.cible} : « ${a.texte.slice(0, 50)} » absent`)].slice(0, 5).join(" · "));
    else ok("T2", `${ancres.length} ancre(s) verbatim, toutes présentes littéralement dans leur fichier`);
  }

  // ---- T3 : les arbitrages posés à l'humain -------------------------------------------------
  const b3 = bloc(texte, /^##\s.*arbitrages?\b/i);
  const puces = b3 ? (b3.match(/^\s*[-*]\s+\S/gm) || []).length : 0;
  if (!b3) ko("T3", "AUCUNE section « arbitrages ». Les étapes d'arbitrage SONT des étapes : elles "
    + "se posent explicitement à l'humain et ne s'automatisent pas (principe 1 de la chaîne)");
  else if (!puces) ko("T3", "la liste des arbitrages posés à l'humain est VIDE. Une chaîne dont "
    + "cette liste est vide n'a pas été économe : elle a décidé à la place de quelqu'un. La loi "
    + "n° 5 dit l'inverse — l'IA fait, l'humain décide", b3.trim().slice(0, 120));
  else ok("T3", `${puces} arbitrage(s) posé(s) à l'humain`);

  // ---- T4 : les verdicts mécaniques cités ---------------------------------------------------
  const accord = /\b(accord|genre grammatical|i18n\s*:\s*genre)\b[^\n]{0,120}?\b(PASS|FAIL|SANS_OBJET|\d+\s+écart)/i.test(texte);
  const interne = /\b(coh[ée]rence interne|i18n\s*:\s*coherence)\b[^\n]{0,120}?\b(PASS|FAIL|SANS_OBJET|\d+\s+écart)/i.test(texte);
  if (accord && interne) ok("T4", "les verdicts des contrôles d'accord et de cohérence interne sont cités");
  else ko("T4", "la remise ne CITE pas le verdict des contrôles mécaniques que la chaîne prescrit "
    + `(accord : ${accord ? "cité" : "ABSENT"} · cohérence interne : ${interne ? "cité" : "ABSENT"}). `
    + "Les citer n'est pas les jouer — mais ne pas les citer, c'est ne pas savoir. Ce sont les deux "
    + "classes qui ont réellement franchi la chaîne : onze fautes d'accord, et deux faits faux "
    + "identiques dans les sept langues");

  // ============================================================================================
  // T5–T8 : la remise d'un AUDIT des traductions (chaîne B, TF-1318)
  // ============================================================================================
  // LA BORNE : une remise de RUN de traduction (chaîne A) garde son verdict d'avant. Les règles
  // de la chaîne B ne s'inventent pas une cible dans un document qui ne s'en réclame pas.
  if (!AUDIT.test(texte)) {
    F.push({ regle: "T5-T8", statut: "SANS_OBJET",
      message: "remise d'un RUN de traduction (chaîne A) : T5 à T8 jugent la remise d'un AUDIT des "
        + "traductions (chaîne B, `role:` … audit …) et ne s'appliquent pas ici" });
    return F;
  }

  // ---- T5 : chaque étape porte son verdict (B10, critère d'arrêt) --------------------------
  // LE FAIT : l'axe GEO (B7) a dû être ajouté à la main au tour 2 de la session source, la carte
  // des sources (B2) et le plan à ancres (B8) spécifiés à la main au tour 4. Une étape que rien ne
  // nomme s'oublie ; une étape nommée SANS verdict s'oublie aussi, mais en silence. Le principe 2
  // de la chaîne dit l'inverse : une étape sans verdict BLOQUE la remise.
  const b5 = bloc(texte, /^##\s.*[ée]tapes?\s+de\s+la\s+cha[îi]ne/i);
  if (b5 === null) {
    ko("T5", "AUCUNE section « Étapes de la chaîne ». La remise d'un audit porte le verdict de CHACUNE "
      + "des dix étapes B1–B10 — PASS, FAIL, ou SANS_OBJET / MANUELLE / NON COUVERTE avec son motif. "
      + "Une étape sans verdict est indiscernable d'une étape oubliée : l'axe GEO l'a été, et il a "
      + "fallu l'ajouter à la main au tour 2 de la session source (TF-1318)");
  } else {
    const vus = new Map();
    for (const ligne of b5.split(/\r?\n/)) {
      const m = LIGNE_ETAPE.exec(ligne);
      if (!m) continue;
      const etape = m[1].toUpperCase();
      if (!vus.has(etape)) vus.set(etape, []);
      vus.get(etape).push({ etat: m[2].toUpperCase().replace(/\s+/g, "_"), motif: (m[3] || "").trim() });
    }
    const manquantes = ETAPES_B.filter((e) => !vus.has(e));
    const doubles = ETAPES_B.filter((e) => (vus.get(e) || []).length > 1);
    const muettes = ETAPES_B.filter((e) => (vus.get(e) || [])
      .some((x) => ETATS_A_MOTIF.includes(x.etat) && x.motif.replace(/[—–:.-]/g, "").trim().length < 10));
    if (manquantes.length || doubles.length || muettes.length) {
      ko("T5", `${manquantes.length + doubles.length + muettes.length} étape(s) de la chaîne B sans verdict `
        + "opposable. Une étape SANS verdict bloque la remise (principe 2) ; une étape non jouée dit "
        + "POURQUOI — un « non couvert » sans motif est indiscernable d'un oubli",
      [...manquantes.map((e) => `${e} : aucun verdict`),
        ...doubles.map((e) => `${e} : deux verdicts, lequel croire ?`),
        ...muettes.map((e) => `${e} : non jouée SANS motif`)].join(" · "));
    } else {
      const parEtat = {};
      for (const [, v] of vus) parEtat[v[0].etat] = (parEtat[v[0].etat] || 0) + 1;
      ok("T5", `les dix étapes B1–B10 portent leur verdict (${Object.entries(parEtat)
        .map(([e, n]) => `${e} ${n}`).join(", ")}) ; chaque étape non jouée dit son motif`);
    }
  }

  // ---- T6 : chaque locale servie est couverte ou déclarée non couverte (B10) ----------------
  // LE FAIT : la relecture s'était bornée aux langues SUBSTITUÉES ; les quatre autres portaient
  // des défauts du même run, et il a fallu un dix-septième tour pour qu'elles soient relues. Un
  // audit qui ne dit pas quelles locales il n'a pas regardées laisse croire qu'il les a toutes vues.
  const brut = champ(texte, "locales");
  const declarees = brut ? brut.replace(/[[\]"']/g, " ").split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean) : [];
  const b6 = bloc(texte, /^##\s.*couverture\s+des\s+locales/i);
  if (!declarees.length) {
    ko("T6", "le frontmatter ne déclare pas `locales:` — la liste des locales SERVIES. Sans elle, rien ne "
      + "dit ce que l'audit n'a pas regardé : au tour 17 de la session source, quatre langues non relues "
      + "portaient des défauts du même run");
  } else if (b6 === null) {
    ko("T6", `AUCUNE section « Couverture des locales » pour ${declarees.length} locale(s) déclarée(s) : chaque `
      + "locale servie s'y dit « couverte », ou « non couverte — <motif> »");
  } else {
    // `pt_BR`, `pt-BR` et `pt-br` désignent la même locale : la comparaison se fait sur une forme.
    const forme = (c) => c.toLowerCase().replace("_", "-");
    const couvertures = new Map();
    for (const ligne of b6.split(/\r?\n/)) {
      const m = LIGNE_LOCALE.exec(ligne);
      if (m) couvertures.set(forme(m[1]),
        { non: /^non/i.test(m[2]), motif: (m[3] || "").replace(/[—–:.-]/g, " ").trim() });
    }
    const invalides = declarees.filter((c) => !CODE_DECLARE.test(c));
    const sansLigne = declarees.filter((c) => CODE_DECLARE.test(c) && !couvertures.has(forme(c)));
    const sansMotif = [...couvertures].filter(([, v]) => v.non && v.motif.length < 10).map(([c]) => c);
    let horsDeclaration = [];
    let catalogueIllisible = false;
    if (catalogue) {
      const lues = localesDuCatalogue(isAbsolute(catalogue) ? catalogue : resolve(catalogue));
      if (lues === null) catalogueIllisible = true;
      else {
        const connues = new Set(declarees.map(forme));
        horsDeclaration = lues.filter((c) => !connues.has(forme(c)));
      }
    }
    if (catalogueIllisible) {
      F.push({ regle: "T6", statut: "NON_JUGEABLE",
        message: `catalogue « ${catalogue} » introuvable ou non dossier : la confrontation des locales déclarées `
          + "aux locales servies n'est pas jouée — une panne d'environnement n'est pas un défaut de la fiche" });
    }
    if (invalides.length || sansLigne.length || sansMotif.length || horsDeclaration.length) {
      ko("T6", "la couverture des locales ne dit pas ce que l'audit n'a pas regardé. Mesuré : la relecture "
        + "s'était bornée aux langues substituées, et les quatre autres portaient des défauts du même run (tour 17)",
      [...invalides.map((c) => `« ${c} » : code de locale illisible`),
        ...sansLigne.map((c) => `${c} : déclarée servie, AUCUNE ligne de couverture`),
        ...sansMotif.map((c) => `${c} : non couverte SANS motif`),
        ...horsDeclaration.map((c) => `${c} : présente au catalogue, ABSENTE de \`locales:\``)].join(" · "));
    } else if (!catalogueIllisible) {
      const non = [...couvertures].filter(([, v]) => v.non).map(([c]) => c);
      ok("T6", `${declarees.length} locale(s) servie(s), chacune couverte ou déclarée non couverte avec son motif`
        + (non.length ? ` (non couvertes : ${non.join(", ")})` : "")
        + (catalogue ? " ; liste confrontée au catalogue" : " ; liste DÉCLARÉE, non confrontée — `--catalogue` la confronte"));
    }
  }

  // ---- T7 : la carte des sources de vérité (B2) ---------------------------------------------
  // LE FAIT : un run a modifié 9 fichiers sources, et le build a régénéré 203 pages (lot 20260823a).
  // Une ancre posée sur l'une de ces pages est une correction écrasée au build suivant ; et la carte qui
  // le dit a dû être écrite à la main au tour 4. La carte n'est exigée que là où elle protège quelque
  // chose : une remise SANS ancre n'a pas de correction à faire survivre.
  if (!ancres.length) {
    F.push({ regle: "T7", statut: "SANS_OBJET",
      message: "aucune ancre verbatim : la carte des sources de vérité n'a aucune correction à protéger ici — "
        + "l'étape B2 reste déclarée par T5" });
  } else {
    const b7 = bloc(texte, /^##\s.*sources?\s+de\s+v[ée]rit[ée]/i);
    if (b7 === null) {
      ko("T7", `AUCUNE section « Sources de vérité » alors que la remise porte ${ancres.length} ancre(s). Rien ne `
        + "dit si chaque fichier ancré est une SOURCE ou un ARTEFACT régénéré — mesuré sur le produit d'origine : "
        + "9 sources modifiées, 203 pages régénérées par le build, où toute correction d'une page est écrasée au build suivant");
    } else {
      const { lignes, illisibles } = lireCarte(b7);
      const constats = jugerCarte(lignes, ancres.map((a) => a.cible));
      if (!lignes.length) {
        ko("T7", "la carte des sources de vérité est VIDE : un titre sans tableau est indiscernable d'un oubli",
          b7.trim().slice(0, 120));
      } else if (illisibles.length || constats.length) {
        ko("T7", `${illisibles.length + constats.length} défaut(s) de carte — une ancre doit viser une SOURCE, et un `
          + "artefact doit dire d'où il vient et comment on le refait",
        [...illisibles.map((l) => `ligne illisible (quatre colonnes attendues : fichier | nature | source | régénéré par) : ${l.slice(0, 60)}`),
          ...constats.map((c) => `${c.regle} ${c.ou} : ${c.message}`)].slice(0, 6).join(" · "));
      } else {
        const artefacts = lignes.filter((l) => l.nature === "artefact").length;
        ok("T7", `carte de ${lignes.length} fichier(s) dont ${artefacts} artefact(s) ; les `
          + `${new Set(ancres.map((a) => a.cible)).size} fichier(s) ancré(s) sont tous des sources déclarées`);
      }
    }
  }

  // ---- T8 : la confrontation aux données est citée (B5) ------------------------------------
  // LE FAIT : « 8 gîtes » servi dans les SEPT langues quand la donnée en déclare 5. La cohérence
  // interlangue était saine et ne pouvait rien voir : les sept disaient 8. Seul un point fixe HORS
  // du catalogue le voit — le contrôle (g) du pan i18n de forge-tests (TF-0644). Même borne que T4 :
  // le citer n'est pas le jouer, mais ne pas le citer, c'est ne pas savoir.
  const donnees = /confrontation\s+(?:aux|à\s+la|a\s+la)\s+(?:sources?\s+de\s+)?donn[ée]es?[^\n]{0,120}?\b(PASS|FAIL|SANS_OBJET|\d+\s+écarts?)/i.test(texte);
  if (donnees) ok("T8", "le verdict de la confrontation aux données est cité");
  else ko("T8", "la remise ne CITE pas le verdict de la confrontation aux données — une ligne « confrontation "
    + "aux données : PASS | FAIL | SANS_OBJET | N écart(s) ». Mesuré : « 8 gîtes » servi dans les sept langues "
    + "quand la donnée en déclare 5 ; les sept locales étaient cohérentes entre elles, et toutes fausses");

  return F;
}

const NON_JUGE = [
  "remise-traduction : la QUALITÉ d'une relecture native. T1 rend son ABSENCE bruyante, rien de plus — personne ne remplace un locuteur natif, et le filet mécanique va AVANT lui, jamais à sa place",
  "remise-traduction : T4 vérifie qu'un verdict est RAPPORTÉ, pas qu'il est vrai. Rejouer les contrôles est le travail du pan i18n de forge-tests, pas de cette lecture",
  "remise-traduction : la seconde moitié du critère de réussite — « les tours de classe DÉFAUT tombent à 0 ET les tours de DÉCISION restent ≥ 1 » — se compte sur une SESSION, pas sur un document. Aucun artefact ne porte cette donnée ; T3 en tient l'esprit sur ce que le document sait dire",
  "remise-traduction : T2 confronte l'ancre au fichier À L'INSTANT DE LA MESURE. Un fichier modifié après la remise fera rougir une remise qui était juste — c'est voulu, et c'est ce qui distingue une ancre d'une citation",
  "remise-traduction : T5 vérifie qu'un verdict est DÉCLARÉ pour chaque étape B1–B10, pas qu'il est vrai — même borne que T4. Rejouer les porteurs de chaque étape est le travail de la chaîne, que `references/CHAINE-TRADUCTION.md` décrit commande par commande",
  "remise-traduction : T6 sans `--catalogue` tient pour servies les locales que la fiche DÉCLARE ; avec lui, seuls les NOMS des fichiers et dossiers du catalogue sont lus (base ISO 639-1), jamais leur contenu",
  "remise-traduction : T7 juge la FORME de la carte des sources de vérité et sa conséquence sur les ancres. Qu'un fichier soit VRAIMENT régénéré par la commande déclarée demande d'exécuter le build du produit, ce que cette lecture ne fait pas",
];

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.some((x) => x.statut === "NON_JUGEABLE") ? "NON_JUGEABLE" : "PASS");

// ------------------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  const dir = mkdtempSync(join(tmpdir(), "remise-traduction-"));
  mkdirSync(join(dir, "i18n"), { recursive: true });
  writeFileSync(join(dir, "i18n", "fr.json"),
    '{"a":"Granville est à 45 minutes de la maison.","b":"Nos 5 gîtes vous attendent."}', "utf8");

  const entete = "---\nrole: fiche de remise d'un run de traduction multilingue\n---\n\n";
  const relecture = "## Relecture native\n\nFaite par Marta Ruiz, 2026-08-26.\n\n";
  const ancres = "## Ancres verbatim\n\n"
    + "- `Granville est à 45 minutes de la maison.` → i18n/fr.json\n\n";
  const arbitrages = "## Arbitrages posés à l'humain\n\n- le terme d'hébergement en espagnol\n\n";
  const verdicts = "## Contrôles mécaniques\n\n- accord (genre grammatical) : PASS\n"
    + "- cohérence interne : PASS\n";

  const ecrire = (nom, corps) => { writeFileSync(join(dir, nom), corps, "utf8"); return join(dir, nom); };
  const verte = ecrire("verte.md", entete + relecture + ancres + arbitrages + verdicts);
  // Chaque rouge ne casse QU'UNE promesse : sans cela, une fixture prouverait qu'une règle
  // rougit sans prouver qu'elle rougit sur SA cause.
  const rT1 = ecrire("rouge-t1.md", entete + ancres + arbitrages + verdicts);
  const rT1vide = ecrire("rouge-t1-vide.md",
    entete + "## Relecture native\n\nÀ voir plus tard.\n\n" + ancres + arbitrages + verdicts);
  const rT2 = ecrire("rouge-t2.md", entete + relecture
    + "## Ancres verbatim\n\n- `Une phrase qui n'existe pas dans le fichier` → i18n/fr.json\n\n"
    + arbitrages + verdicts);
  const rT3 = ecrire("rouge-t3.md", entete + relecture + ancres
    + "## Arbitrages posés à l'humain\n\nAucun.\n\n" + verdicts);
  const rT4 = ecrire("rouge-t4.md", entete + relecture + ancres + arbitrages);
  const refus = ecrire("refus.md", entete
    + "## Relecture native\n\nRefusée — aucun locuteur natif disponible avant la date de remise, "
    + "et l'exploitant a tranché pour une mise en ligne sans elle.\n\n" + ancres + arbitrages + verdicts);
  const horsChamp = ecrire("hors-champ.md", "---\nrole: une note quelconque\n---\n\n## Titre\n\ndu texte.\n");

  const moi = fileURLToPath(import.meta.url);
  const jouer = (f) => spawnSync(process.execPath, [moi, f, "--racine", dir], { encoding: "utf8" });
  const casse = [];
  const exige = (c, q) => { if (!c) casse.push(q); };

  const v = jouer(verte);
  exige(v.status === 0, "fixture VERTE : ne passe pas — " + v.stdout.slice(0, 300));
  exige(jouer(refus).status === 0, "un REFUS explicite et motivé doit PASSER : le refus est une réponse valide");
  const r1 = jouer(rT1);
  exige(r1.status === 1 && /"T1"[^}]*FAIL/.test(r1.stdout), "une remise sans section de relecture doit échouer (T1)");
  const r1v = jouer(rT1vide);
  exige(r1v.status === 1 && /"T1"[^}]*FAIL/.test(r1v.stdout),
    "une section de relecture PRÉSENTE ET VIDE doit échouer — sinon un titre suffit à passer la porte");
  const r2 = jouer(rT2);
  exige(r2.status === 1 && /"T2"[^}]*FAIL/.test(r2.stdout), "une ancre absente du fichier doit échouer (T2)");
  const r3 = jouer(rT3);
  exige(r3.status === 1 && /"T3"[^}]*FAIL/.test(r3.stdout), "une liste d'arbitrages VIDE doit échouer (T3)");
  const r4 = jouer(rT4);
  exige(r4.status === 1 && /"T4"[^}]*FAIL/.test(r4.stdout), "des verdicts mécaniques non cités doivent échouer (T4)");
  // L'INDÉPENDANCE DES RÈGLES : la rouge de T2 garde sa relecture et ses arbitrages.
  exige(/"T1"[^}]*PASS/.test(r2.stdout) && /"T3"[^}]*PASS/.test(r2.stdout),
    "la rouge de T2 devrait passer T1 et T3 — les règles ne sont pas indépendantes");
  exige(/"T2"[^}]*PASS/.test(r4.stdout), "la rouge de T4 devrait passer T2 — les règles ne sont pas indépendantes");
  const h = jouer(horsChamp);
  exige(h.status === 2 && /NON_JUGEABLE/.test(h.stdout),
    "un document hors champ doit rendre 2 — sans quoi cet oracle accuserait n'importe quel markdown");

  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test remise-traduction : 11/11 PASS (verte PASS et REFUS motivé PASS ; rouges sur T1 "
      + "section absente, T1 section vide, T2 ancre introuvable dans le fichier visé, T3 arbitrages "
      + "vides, T4 verdicts non cités ; deux contrôles d'INDÉPENDANCE des règles ; hors champ NON_JUGEABLE)");
  process.exit(casse.length ? 1 : 0);
}

// La valeur d'une option n'est pas la fiche : `--racine d fiche.md` prenait `d` pour la fiche.
const AVEC_VALEUR = ["--racine", "--catalogue"];
const cible = args.find((a, i) => !a.startsWith("--") && !AVEC_VALEUR.includes(args[i - 1]));
const idx = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-remise-traduction", verdict: "ERREUR",
    message: "fiche introuvable — usage : node oracle-remise-traduction.mjs <FICHE-REMISE.md> "
      + "[--racine <dossier>] [--catalogue <dossier>] | --self-test" }));
  process.exit(2);
}
const findings = juger(cible, idx("--racine"), idx("--catalogue"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-remise-traduction", version: "1.1.0", cible, verdict,
  findings, non_juge: NON_JUGE }, null, 1));
process.exit(verdict === "FAIL" ? 1 : verdict === "NON_JUGEABLE" ? 2 : 0);
