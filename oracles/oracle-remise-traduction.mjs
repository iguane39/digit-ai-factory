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
 * Usage : node oracle-remise-traduction.mjs <FICHE-REMISE.md> [--racine <dossier>] [--json]
 *         node oracle-remise-traduction.mjs --self-test
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

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

/** Une ancre verbatim déclarée : `- \`<texte>\` → <chemin>` */
const ANCRE = /^\s*[-*]\s*`([^`]+)`\s*(?:→|->|:)\s*(\S+)\s*$/gm;

/** Une relecture FAITE : un nom et une date. Une relecture REFUSÉE : le mot, plus un motif. */
const FAITE = /\bfaite?\b[^\n]{0,80}?\bpar\b\s+([^\n,;]{2,60}?)\s*[,;(]?\s*(?:le\s+)?(\d{4}-\d{2}-\d{2})/i;
const REFUSEE = /\brefus[ée]e?\b\s*[—:-]\s*(\S[^\n]{9,})/i;

export function juger(fiche, racine = null) {
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
  const ancres = [...texte.matchAll(ANCRE)].map((m) => ({ texte: m[1], cible: m[2] }));
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

  return F;
}

const NON_JUGE = [
  "remise-traduction : la QUALITÉ d'une relecture native. T1 rend son ABSENCE bruyante, rien de plus — personne ne remplace un locuteur natif, et le filet mécanique va AVANT lui, jamais à sa place",
  "remise-traduction : T4 vérifie qu'un verdict est RAPPORTÉ, pas qu'il est vrai. Rejouer les contrôles est le travail du pan i18n de forge-tests, pas de cette lecture",
  "remise-traduction : la seconde moitié du critère de réussite — « les tours de classe DÉFAUT tombent à 0 ET les tours de DÉCISION restent ≥ 1 » — se compte sur une SESSION, pas sur un document. Aucun artefact ne porte cette donnée ; T3 en tient l'esprit sur ce que le document sait dire",
  "remise-traduction : T2 confronte l'ancre au fichier À L'INSTANT DE LA MESURE. Un fichier modifié après la remise fera rougir une remise qui était juste — c'est voulu, et c'est ce qui distingue une ancre d'une citation",
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

const cible = args.find((a) => !a.startsWith("--"));
const idx = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-remise-traduction", verdict: "ERREUR",
    message: "fiche introuvable — usage : node oracle-remise-traduction.mjs <FICHE-REMISE.md> "
      + "[--racine <dossier>] | --self-test" }));
  process.exit(2);
}
const findings = juger(cible, idx("--racine"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-remise-traduction", version: "1.0.0", cible, verdict,
  findings, non_juge: NON_JUGE }, null, 1));
process.exit(verdict === "FAIL" ? 1 : verdict === "NON_JUGEABLE" ? 2 : 0);
