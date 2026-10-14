#!/usr/bin/env node
/**
 * oracle-fiche-constat-precos — une fiche « constat et préconisations » tient sa forme et ses bornes.
 *
 * LE FAIT (12/10/2026, lot `Produit-64 - RETOURS - 20261012d`, RT-36, TF-1640). Un porteur a dû
 * demander DEUX fois un fichier exploitable avant d'obtenir la forme qu'il a validée, mot pour mot :
 * « Le fichier MD construit répond bien à la demande "simple, bref, lisible & exploitable". » La
 * forme validée tient en une page : En bref chiffré, un tableau de constat, des constats titrés par
 * leur verdict, un tableau de préconisations avec leur gain, une ligne « Rien à faire » motivée, un
 * ordre conseillé, une ligne de sources. Le lendemain, la même forme a été reprise pour un second
 * sujet, et le document a plus que doublé : rien ne disait où s'arrêtait la fiche. Ce sont les
 * bornes que le retour demandait « jugées », pas seulement écrites.
 *
 * CE QUE L'ORACLE JUGE, sur un document Markdown de la famille `gd-fiche-constat-precos` :
 *   CP1 · les six parties sont là : « En bref », « Constat », « Préconisations », « Sources » en
 *         titres ; « Rien à faire » et « Ordre conseillé » en titre ou en tête de paragraphe
 *         en gras, chacune suivie de son contenu (« Rien à faire » porte son motif) ;
 *   CP2 · la longueur : au plus 900 mots hors en-tête, blocs de code et commentaires. Le retour dit
 *         « environ 800 mots » ; la tolérance de 100 mots est déclarée ici, pas devinée ;
 *   CP3 · « En bref » porte 3 ou 4 puces, et chacune porte un chiffre ;
 *   CP4 · de 1 à 5 constats numérotés (`**1. …**`), et chacun porte au moins un chiffre, titre et
 *         preuves confondus, hors son numéro d'ordre ;
 *   CP5 · le tableau des préconisations porte les colonnes Action, Gain, Effort et Attention, au plus
 *         5 lignes, et chaque ligne nomme un gain ou un effet (une case vide ou un tiret ne nomme rien) ;
 *   CP6 · le document rend son gabarit et sa version (`Gabarit : gd-fiche-constat-precos · version du
 *         gabarit x.y.z`), comme G4 l'exige de toute famille : sans ce couple, un retour sur la forme
 *         ne se rattache à rien.
 *
 * Contrat : JSON {oracle, version, cible, verdict, findings[], mesures, non_juge[]} · exit 0 PASS,
 * 1 FAIL, 2 non jugeable (fichier absent ou illisible).
 * Usage : node oracles\oracle-fiche-constat-precos.mjs <fiche.md>
 *         node oracles\oracle-fiche-constat-precos.mjs --self-test
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const VERSION = "1.0.0";
export const BORNES = { mots: 900, puces: [3, 4], constats: [1, 5], actions: 5 };
const GABARIT = "gd-fiche-constat-precos";

const NORMALISER = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const CHIFFRE = /\d/;
/** Un gain ou un effet qui n'en nomme aucun. */
const GAIN_VIDE = /^(?:|[-–—?]+|n\/?a|aucun|neant|sans objet|a definir|a chiffrer)$/;

/** Le corps jugé : sans en-tête YAML, commentaires HTML ni blocs de code. */
export function corps(texte) {
  return String(texte).replace(/\r\n/g, "\n")
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^```[\s\S]*?^```/gm, " ");
}

/** Les mots : jetons séparés par des blancs qui portent une lettre ou un chiffre. */
export function compterMots(texte) {
  return corps(texte).split("\n")
    .filter((l) => !/^\s*!\[/.test(l) && !/^\s*\|[\s:|-]+\|?\s*$/.test(l))
    .join(" ").split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length;
}

/** Les sections de niveau 2 : `{ titre, texte }`. */
function sections(texte) {
  return corps(texte).split(/\n(?=## )/).filter((b) => b.startsWith("## "))
    .map((b) => ({ titre: NORMALISER(b.split("\n")[0].slice(3)), texte: b.split("\n").slice(1).join("\n") }));
}
const section = (secs, motif) => secs.find((s) => motif.test(s.titre)) || null;

/** Une partie portée en titre OU en tête de paragraphe en gras : rend son contenu, ou null. */
function partieEnLigne(texte, secs, motif) {
  const s = section(secs, motif);
  if (s) return s.texte.trim();
  for (const l of corps(texte).split("\n")) {
    const m = /^\s*\*\*([^*]+)\*\*\s*:?\s*(.*)$/.exec(l);
    if (m && motif.test(NORMALISER(m[1]))) return m[2].trim();
  }
  return null;
}

/** Les lignes de données du premier tableau d'un bloc : tableaux de cellules, en-tête à part. */
function tableau(bloc) {
  const lignes = String(bloc || "").split("\n").map((l) => l.trim());
  const debut = lignes.findIndex((l) => l.startsWith("|"));
  if (debut < 0) return null;
  const rangs = [];
  for (let i = debut; i < lignes.length && lignes[i].startsWith("|"); i++) rangs.push(lignes[i]);
  const cellules = (l) => l.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  const entete = cellules(rangs[0]).map(NORMALISER);
  const donnees = rangs.slice(1).filter((l) => !/^\|[\s:|-]+\|?\s*$/.test(l)).map(cellules);
  return { entete, donnees };
}

export function juger(texte) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const secs = sections(texte);

  // CP1 — les six parties.
  const enBref = section(secs, /^en bref\b/);
  const constat = section(secs, /^constats?\b/);
  const precos = section(secs, /^preconisations?\b/);
  const sources = section(secs, /^sources?\b/);
  const rien = partieEnLigne(texte, secs, /^rien a faire\b/);
  const ordre = partieEnLigne(texte, secs, /^ordre conseille\b/);
  const manquent = [!enBref && "En bref", !constat && "Constat", !precos && "Préconisations",
    rien === null && "Rien à faire", ordre === null && "Ordre conseillé", !sources && "Sources"].filter(Boolean);
  const vides = [rien !== null && rien.split(/\s+/).filter(Boolean).length < 3 && "« Rien à faire » sans son motif",
    ordre !== null && !ordre && "« Ordre conseillé » vide",
    sources && !sources.texte.trim() && "« Sources » vide"].filter(Boolean);
  if (manquent.length) ko("CP1", `partie(s) absente(s) : ${manquent.join(", ")} — la fiche validée par le porteur les porte toutes les six`);
  else if (vides.length) ko("CP1", `${vides.join(", ")} — une partie présente et vide ne dit rien au lecteur qui va agir`);
  else ok("CP1", "les six parties sont présentes et remplies");

  // CP2 — la longueur.
  const mots = compterMots(texte);
  mots > BORNES.mots
    ? ko("CP2", `${mots} mots, au-delà de ${BORNES.mots} (« environ 800 mots », tolérance de 100 déclarée) — au-delà, ce n'est plus une fiche d'une page : la famille gd-diagnostic porte les documents longs`)
    : ok("CP2", `${mots} mots, sous la borne de ${BORNES.mots}`);

  // CP3 — En bref : 3 ou 4 puces chiffrées.
  if (enBref) {
    const puces = enBref.texte.split("\n").filter((l) => /^\s*[-*]\s+/.test(l));
    const nues = puces.filter((l) => !CHIFFRE.test(l));
    if (puces.length < BORNES.puces[0] || puces.length > BORNES.puces[1]) ko("CP3", `« En bref » porte ${puces.length} puce(s), ${BORNES.puces[0]} ou ${BORNES.puces[1]} attendues`);
    else if (nues.length) ko("CP3", `${nues.length} puce(s) d'« En bref » sans chiffre : « ${nues[0].trim().slice(0, 80)} »`);
    else ok("CP3", `« En bref » : ${puces.length} puces, toutes chiffrées`);
  } else ko("CP3", "« En bref » absent : rien à compter");

  // CP4 — les constats numérotés, chacun chiffré.
  let nConstats = 0;
  if (constat) {
    const blocs = constat.texte.split(/\n(?=\s*\*\*\d+[.)]\s)/).filter((b) => /^\s*\*\*\d+[.)]\s/.test(b));
    nConstats = blocs.length;
    const sansChiffre = blocs.filter((b) => !CHIFFRE.test(b.replace(/^\s*\*\*\d+[.)]\s/, "")));
    if (nConstats < BORNES.constats[0] || nConstats > BORNES.constats[1]) ko("CP4", `${nConstats} constat(s) numéroté(s) (\`**1. …**\`), de ${BORNES.constats[0]} à ${BORNES.constats[1]} attendus`);
    else if (sansChiffre.length) ko("CP4", `${sansChiffre.length} constat(s) sans aucun chiffre : « ${sansChiffre[0].trim().split("\n")[0].slice(0, 80)} » — un constat se prouve par une mesure`);
    else ok("CP4", `${nConstats} constat(s), chacun porteur d'au moins un chiffre`);
  } else ko("CP4", "« Constat » absent : rien à compter");

  // CP5 — le tableau des préconisations.
  let nActions = 0;
  if (precos) {
    const t = tableau(precos.texte);
    const col = (motif) => (t ? t.entete.findIndex((c) => motif.test(c)) : -1);
    const iAction = col(/\baction\b/), iGain = col(/\b(?:gain|effet)\b/), iEffort = col(/\beffort\b/), iAttention = col(/\battention\b/);
    const absentes = [iAction < 0 && "Action", iGain < 0 && "Gain", iEffort < 0 && "Effort", iAttention < 0 && "Attention"].filter(Boolean);
    if (!t) ko("CP5", "aucun tableau de préconisations — l'équipe qui agit lit une ligne par action");
    else if (absentes.length) ko("CP5", `colonne(s) absente(s) au tableau des préconisations : ${absentes.join(", ")}`);
    else {
      nActions = t.donnees.length;
      const sansGain = t.donnees.filter((c) => GAIN_VIDE.test(NORMALISER(c[iGain] || "").trim()));
      if (!nActions) ko("CP5", "tableau des préconisations sans aucune ligne");
      else if (nActions > BORNES.actions) ko("CP5", `${nActions} préconisations, au-delà de ${BORNES.actions} — au-delà, l'ordre conseillé ne se lit plus d'un coup d'œil`);
      else if (sansGain.length) ko("CP5", `${sansGain.length} préconisation(s) sans gain ni effet nommé : « ${(sansGain[0][iAction] || "").slice(0, 80)} »`);
      else ok("CP5", `${nActions} préconisation(s), chacune avec son gain ou son effet nommé`);
    }
  } else ko("CP5", "« Préconisations » absent : rien à compter");

  // CP6 — le couple gabarit et version, rendu.
  const c = corps(texte);
  const id = new RegExp(`gabarit\\s*:\\s*${GABARIT}\\b`, "i").test(c) || new RegExp(`gabarit\\s*:\\s*${GABARIT}\\b`, "i").test(String(texte));
  const ver = /version[_ ]du[_ ]gabarit\s*:?\s*\d+\.\d+\.\d+/i.test(String(texte));
  id && ver
    ? ok("CP6", `porte ${GABARIT} et sa version`)
    : ko("CP6", `le document ne porte pas ${[!id && `\`gabarit: ${GABARIT}\``, !ver && "la `version du gabarit x.y.z`"].filter(Boolean).join(" ni ")} — un retour sur la forme ne se rattache alors à aucun gabarit (G4, TF-0690)`);

  return { findings, mesures: { mots, constats: nConstats, preconisations: nActions } };
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS");

export const NON_JUGE = [
  "la JUSTESSE des chiffres : CP4 exige qu'un constat porte un chiffre, jamais que ce chiffre soit vrai ni sourcé — la ligne de sources le dit au lecteur, aucun oracle ne la rejoue",
  "la PERTINENCE d'une préconisation et la réalité du gain annoncé : CP5 exige un gain ou un effet NOMMÉ, pas qu'il soit atteignable",
  "le choix de la famille : une fiche qui devrait être un diagnostic (gd-diagnostic) passe ce juge si elle tient ses bornes",
  "le rendu HTML : la famille est Markdown ; une page tirée de la fiche relève du socle digit-ai-page-html",
];

// --- recette à double sens : la fixture verte passe, chaque fixture rouge fait échouer SA règle ---
export const FIXTURE_VERTE = `---
destinataire: humain
role_destinataire: l'équipe d'exploitation du produit, qui choisit les actions et leur ordre
gabarit: gd-fiche-constat-precos
version_du_gabarit: 1.0.0
---

# Produit-X — Coûts d'hébergement : constat et préconisations

*14/10/2026 · environnement de recette et de production*

## En bref

- **Coût** : 300 € par mois au rythme d'octobre.
- **60 %** de ce coût vient du service de traitement.
- **2 gestes simples** rendent 120 € par mois.
- **Rien ne change** en production avant la revue du 2026-11-02.

## Constat

| Composant | Taille | Coût par mois |
|---|---|---:|
| Traitement | 2 cœurs | 180 € |
| Base | petite | 40 € |

**1. Le traitement est facturé au tarif actif.**
- Il interroge la base toutes les 30 secondes.

**2. Les 2 cœurs sont un choix mesuré.**
- Ils tiennent un budget de latence de 5 secondes, décision documentée dans le code d'infrastructure.

## Préconisations

| # | Action | Gain par mois | Effort | Attention |
|---|---|---:|---|---|
| 1 | Allonger l'intervalle d'interrogation | ~100 € | 1 h | Remesurer la latence |
| 2 | Supprimer le registre inutilisé | ~20 € | 30 min | Irréversible |

**Rien à faire** sur la base : elle est déjà au plus petit niveau.

**Ordre conseillé** : 2 tout de suite, puis 1 après la mesure de latence.

## Sources

Tableau des coûts du fournisseur (octobre), métriques d'utilisation, dépôt d'infrastructure.

*Gabarit : gd-fiche-constat-precos · version du gabarit 1.0.0*
`;

function selfTest() {
  const cas = [];
  const verte = juger(FIXTURE_VERTE);
  cas.push({ nom: "fixture verte", attendu: "PASS", ok: verdictDe(verte.findings) === "PASS" });
  const rouge = (nom, regle, muter) => {
    const r = juger(muter(FIXTURE_VERTE));
    cas.push({ nom: `cas rouge — ${nom}`, attendu: `${regle} FAIL`, ok: r.findings.some((f) => f.regle === regle && f.statut === "FAIL") });
  };
  rouge("partie Sources absente", "CP1", (t) => t.replace("## Sources", "## Références"));
  rouge("« Rien à faire » sans motif", "CP1", (t) => t.replace(/\*\*Rien à faire\*\*[^\n]*/, "**Rien à faire**"));
  rouge("fiche de plus de 900 mots", "CP2", (t) => t.replace("## Sources", `Contexte. ${"mot ".repeat(900)}\n\n## Sources`));
  rouge("« En bref » à 5 puces", "CP3", (t) => t.replace("## Constat", "- **Cinquième** : 5 points.\n\n## Constat"));
  rouge("puce d'« En bref » sans chiffre", "CP3", (t) => t.replace("**Coût** : 300 € par mois au rythme d'octobre.", "**Coût** : élevé."));
  rouge("constat sans chiffre", "CP4", (t) => t.replace("Il interroge la base toutes les 30 secondes.", "Il interroge la base en permanence.").replace("tarif actif", "tarif fort"));
  rouge("six constats", "CP4", (t) => t.replace("## Préconisations", [3, 4, 5, 6].map((n) => `**${n}. Constat ${n}.**\n- ${n} mesures.\n`).join("\n") + "\n## Préconisations"));
  rouge("préconisation sans gain", "CP5", (t) => t.replace("| ~20 € |", "| — |"));
  rouge("six préconisations", "CP5", (t) => t.replace("| 2 | Supprimer", [3, 4, 5, 6].map((n) => `| ${n} | Action ${n} | ~${n} € | 1 h | rien |`).join("\n") + "\n| 2 | Supprimer"));
  rouge("colonne Attention absente", "CP5", (t) => t.replace("| Attention |", "|").replace("| Remesurer la latence |", "|").replace("| Irréversible |", "|"));
  rouge("couple gabarit et version absent", "CP6", (t) => t.replace(/^gabarit:.*\n/m, "").replace(/\*Gabarit :.*\*/, ""));
  // « Rien à faire » et « Ordre conseillé » en titres de niveau 2 sont admis : la forme d'origine
  // les pose en tête de paragraphe, une autre fiche peut les poser en titres.
  const enTitres = FIXTURE_VERTE.replace("**Rien à faire** sur", "## Rien à faire\n\nSur").replace("**Ordre conseillé** :", "## Ordre conseillé\n\n");
  cas.push({ nom: "parties en titres de niveau 2", attendu: "PASS", ok: verdictDe(juger(enTitres).findings) === "PASS" });
  for (const c of cas) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.nom} → ${c.attendu}`);
  const casse = cas.filter((c) => !c.ok);
  console.log(`\noracle-fiche-constat-precos self-test : ${cas.length - casse.length}/${cas.length} PASS (fixture verte et ${cas.length - 2} cas rouges, recette à double sens)`);
  process.exit(casse.length ? 1 : 0);
}

const LANCE_EN_DIRECT = process.argv[1] === fileURLToPath(import.meta.url);
if (LANCE_EN_DIRECT) {
  const args = process.argv.slice(2);
  if (args[0] === "--self-test") selfTest();
  const cible = args[0];
  if (!cible || !existsSync(cible)) {
    console.log(JSON.stringify({ oracle: "oracle-fiche-constat-precos", version: VERSION, cible: cible || null, verdict: "ERREUR",
      findings: [], non_juge: NON_JUGE, message: "fiche introuvable — usage : node oracle-fiche-constat-precos.mjs <fiche.md> | --self-test" }, null, 1));
    process.exit(2);
  }
  const { findings, mesures } = juger(readFileSync(cible, "utf8"));
  const verdict = verdictDe(findings);
  console.log(JSON.stringify({ oracle: "oracle-fiche-constat-precos", version: VERSION, cible, verdict, findings, mesures, non_juge: NON_JUGE }, null, 1));
  process.exit(verdict === "PASS" ? 0 : 1);
}
