#!/usr/bin/env node
/**
 * oracle-run-reseau.mjs — juge UNE SEMAINE d'un run d'animation de réseau
 * (`references\RUN-RESEAU.md`, TF-1158, décision humaine D-2 (a) du 17/09/2026).
 *
 * Pourquoi un oracle : le type de run disait de lui-même « tant que la semaine d'essai n'a pas
 * tourné, ce document décrit une séquence, il ne la prouve pas ». Une séquence hebdomadaire qui
 * ne se juge qu'à la relecture ne tient pas trois semaines : c'est le rendez-vous qui manquait
 * (0 publication en 6 jours chez le produit), donc c'est lui qui se contrôle.
 *
 * PARAMÉTRÉ PAR RÉSEAU ET PAR TYPE D'ÉMETTEUR (TF-1278, décision humaine D-12 (a) du 21/09/2026).
 * Jusqu'au 21/09, RR2 portait EN DUR le contrat d'un seul modèle, le texte de 150 à 300 mots écrit
 * pour LinkedIn : le contrôle aurait refusé toute légende d'image, tout texte court, toute
 * réponse à un avis. Le contrat est désormais une DONNÉE (loi n° 4), publiée par forge-agents :
 * `digit-ai-communication\references\contrats-publication.json`. Une semaine porte un LOT de
 * publications, chacune déclarant son réseau et son modèle, et l'accord humain couvre le lot.
 *
 * Ce qu'il lit : un DOSSIER de semaine —
 *   emetteur.json       N0 : la fiche « émetteur et réseaux », dans le dossier de la semaine ou
 *                       dans son parent (elle s'écrit une fois, à l'ouverture du run) ;
 *   calendrier.md       N1 : horizon de 4 semaines, une ligne de tableau par publication prévue ;
 *   publication*.md     N2 : le LOT. Frontmatter : `reseau:`, `modele:` (défaut : linkedin et
 *                       publication-reseau, pour les semaines écrites avant le 21/09),
 *                       `genere: true|false`, et la pièce que le contrat exige — `visuel: <fichier>`
 *                       ou `avis: <fichier>`, présent dans le dossier ;
 *   accord.json         N3 : { accord, date, par, lot:[fichiers], fictif } — l'accord HUMAIN (R-38) ;
 *   mesures.json        N5 : { export, temps_humain_minutes, indicateurs:[{nom,valeur,seuil}] } ;
 *   voix.json           N0, jouée en N2 : les règles de voix de l'émetteur, à côté de emetteur.json.
 *
 * Règles (chacune binaire) :
 *   RR1 calendrier présent, ≥ 4 lignes de publication datées (horizon de 4 semaines) ;
 *   RR2 chaque publication du lot tient le contrat de sortie du modèle qu'elle DÉCLARE : longueur,
 *       accroche, clôture, hashtags, pièce requise ; le modèle déclaré sert le réseau déclaré ;
 *   RR3 faits chiffrés sourcés — `oracle-claims` de forge-agents, verdict repris tel quel ;
 *   RR4 transparence — `oracle-transparence` de forge-agents (TF-1030), verdict repris tel quel ;
 *   RR5 accord de publication consigné AVANT toute publication : `accord: true`, daté, nommé ;
 *       dès que le lot compte plus d'une publication, `lot` les nomme TOUTES — un accord donné
 *       sur 2 textes ne couvre pas le 3e ;
 *   RR6 mesure : un export nommé, le temps humain de la semaine en minutes, 1 à 3 indicateurs
 *       chacun avec sa valeur ET son seuil ;
 *   RR7 fiche « émetteur et réseaux » : type d'émetteur, réseaux retenus, un modèle par réseau
 *       qui le sert, gouvernance de chaque compte (au moins un rôle, double facteur déclaré,
 *       reprise prévue), AUCUN secret ; chaque publication vise un réseau de la fiche.
 *   RR8 voix de l'émetteur (TF-1455) : `voix.json`, dans la semaine ou dans son parent, au format
 *       `gabarits\VOIX-EMETTEUR.json` — daté, sourcé, sans marqueur de gabarit ; chaque publication
 *       tient les règles de sa portée : mots écartés, formules imposées, plafonds d'émojis et de
 *       hashtags, motifs interdits par position. Une règle `lecture_humaine` est nommée, jamais jugée.
 *
 * Ce qu'il ne juge PAS, et ne jugera jamais : la qualité du texte contre sa barre externe (lecture
 * humaine, `la-barre`), la sincérité d'un accord, la véracité d'un export, le fait que la
 * publication ait eu lieu ou ait été programmée — l'humain programme dans l'outil gratuit de la
 * plateforme (`references\PLATEFORMES-RESEAUX.md`) —, ni la part NON mécanisable de chaque contrat
 * de sortie, qui reste écrite en prose chez forge-agents.
 *
 * Usage : node oracles\oracle-run-reseau.mjs <dossier-semaine> [--mentions <f.json>]
 *         node oracles\oracle-run-reseau.mjs --self-test     → semaines à blanc, double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = process.env.FORGE_ROOT || resolve(ICI, "..", "..");
const SKILLS = join(RACINE, "digit-ai-forge-agents", ".claude", "skills");
const QO = join(SKILLS, "quality-oracles", "scripts");
const CONTRATS = join(SKILLS, "digit-ai-communication", "references", "contrats-publication.json");
const TYPES_EMETTEUR = ["A1", "A2"]; // A1 société de conseil · A2 commerce de proximité (étude 20260921a, axe A)
const MODELE_PAR_DEFAUT = "publication-reseau";
const RESEAU_PAR_DEFAUT = "linkedin";
/** Un hashtag, pour RR2 comme pour RR8 : deux comptes d'un même objet ne doivent pas diverger. */
const RE_HASHTAG = /(^|\s)#[\p{L}\p{N}_]+/gu;

/** Joue un oracle de forge-agents et rend son verdict ; absent ou illisible → SKIP motivé. */
function jouer(script, args) {
  const chemin = join(QO, script);
  if (!existsSync(chemin)) return { verdict: "SKIP", motif: `${script} introuvable sous ${QO}` };
  const r = spawnSync(process.execPath, [chemin, ...args], { encoding: "utf8" });
  try { return JSON.parse(r.stdout); } catch { return { verdict: "SKIP", motif: `${script} : sortie illisible` }; }
}

function corpsSansFrontmatter(texte) {
  return texte.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

/** Frontmatter à plat : `cle: valeur`, une par ligne. Aucune structure imbriquée n'est attendue. */
function frontmatter(texte) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(texte);
  const sortie = {};
  if (m) for (const l of m[1].split(/\r?\n/)) { const k = /^([A-Za-z_]+)\s*:\s*(.*)$/.exec(l); if (k) sortie[k[1]] = k[2].trim(); }
  return sortie;
}

/** Les contrats de sortie publiés par forge-agents ; absents ou illisibles → null, et RR2 le dit. */
export function chargerContrats(chemin = CONTRATS) {
  try { const c = JSON.parse(readFileSync(chemin, "utf8")); return c && c.modeles ? c.modeles : null; } catch { return null; }
}

/** Défauts d'UNE publication contre SON contrat. Rend [] quand le contrat est tenu. */
export function defautsDuContrat(texte, contrat, dossier) {
  const fm = frontmatter(texte);
  const corps = corpsSansFrontmatter(texte).trim();
  const mots = corps.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m) && !m.startsWith("#")).length;
  const lignes = corps.split(/\r?\n/).filter((l) => l.trim());
  const hashtags = (corps.match(RE_HASHTAG) || []).length;
  const sansHashtags = lignes.filter((l) => !/^(\s*#[\p{L}\p{N}_]+)+\s*$/u.test(l));
  const cloture = sansHashtags[sansHashtags.length - 1] || "";
  const defauts = [];
  const [min, max] = contrat.mots;
  if (mots < min || mots > max) defauts.push(`${mots} mots (${min} à ${max} attendus)`);
  if (contrat.accroche_min_caracteres > 0 && (!lignes[0] || lignes[0].length < contrat.accroche_min_caracteres)) defauts.push("accroche absente ou trop courte en tête");
  if (contrat.cloture === "question_ou_appel" &&
    !/\?\s*$|(dites|écrivez|racontez|partagez|répondez|réservez|appelez|venez|passez|contactez)[^.]*[.!]?\s*$/i.test(cloture)) defauts.push("clôture sans question ni appel");
  if (hashtags > contrat.hashtags_max) defauts.push(`${hashtags} hashtag(s) (${contrat.hashtags_max} au plus)`);
  if (contrat.piece_requise) {
    const nom = fm[contrat.piece_requise];
    if (!nom) defauts.push(`pièce « ${contrat.piece_requise} » non déclarée au frontmatter`);
    else if (!existsSync(join(dossier, nom)) || !readFileSync(join(dossier, nom)).length) defauts.push(`pièce « ${contrat.piece_requise} » déclarée (${nom}) mais absente ou vide dans le dossier`);
  }
  return { defauts, mots, hashtags };
}

// ---- RR8 · LA VOIX DE L'ÉMETTEUR (TF-1455, décision humaine D-32 (a) du 28/09/2026) ------------
//
// Le fait, remonté par le lot Produit-78 20260928g (RP-15) : l'étape N2 de RUN-RESEAU.md annonçait
// trois portes, dont « voix par la règle de marque », et aucun contrôle ne jouait celle-ci. Les
// règles vérifiables d'une ligne éditoriale (mots écartés, formules imposées, 2 émojis au plus,
// 3 à 5 hashtags, aucun taux en accroche) n'avaient ni format ni lecteur : relues à l'œil à chaque
// lot. Le format est une DONNÉE par émetteur (`voix.json`, gabarit `gabarits\VOIX-EMETTEUR.json`,
// loi n° 4) ; aucune règle de voix n'est écrite dans ce code, et aucun modèle n'est appelé.
export const SCHEMA_VOIX = "pilot/voix-emetteur@1";
const TYPES_VOIX = ["mots_ecartes", "formules_imposees", "plafond", "motif_interdit", "lecture_humaine"];
const PORTEES_VOIX = { corps: "dans le corps", accroche: "en accroche", cloture: "en clôture" };
const OBJETS_PLAFOND = ["emojis", "hashtags"];
const MARQUEUR_GABARIT = /<[^<>\n]{2,160}>/;

/** Minuscules, sans accents ni apostrophe typographique, blancs simples : « N’hésitez » = « n'hesitez ». */
const aplatir = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’ʼ]/g, "'")
  .toLowerCase().replace(/\s+/g, " ");

/** L'expression figure-t-elle dans le texte en MOTS ENTIERS, sans casse ni accents ? */
export function contientExpression(texte, expression) {
  const e = aplatir(expression).trim();
  if (!e) return false;
  const motif = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${motif}(?![\\p{L}\\p{N}])`, "u").test(aplatir(texte));
}

/** Les émojis d'un texte, comptés par graphème : un drapeau, une famille, un pouce teinté = 1. */
export function compterEmojis(texte) {
  let n = 0;
  for (const { segment } of new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(String(texte)))
    if (/\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20E3/u.test(segment) && !["©", "®", "™"].includes(segment)) n++;
  return n;
}

/** Les trois portées d'une publication, lues comme RR2 les lit : corps, accroche, clôture. */
function portees(texte) {
  const corps = corpsSansFrontmatter(texte).trim();
  const lignes = corps.split(/\r?\n/).filter((l) => l.trim());
  const sansHashtags = lignes.filter((l) => !/^(\s*#[\p{L}\p{N}_]+)+\s*$/u.test(l));
  return { corps, accroche: lignes[0] || "", cloture: sansHashtags[sansHashtags.length - 1] || "" };
}

/**
 * Lit et valide un fichier de voix. Rend { regles, date, erreurs[] } : toute erreur de format fait
 * rougir RR8, parce qu'une règle illisible ignorée en silence serait une porte ouverte qui se dit fermée.
 */
export function chargerVoix(brut) {
  let v;
  try { v = JSON.parse(brut); } catch { return { regles: [], erreurs: ["voix.json illisible : JSON invalide"] }; }
  const erreurs = [];
  if (!v || v.schema !== SCHEMA_VOIX) erreurs.push(`schéma « ${v && v.schema} » inconnu, ${SCHEMA_VOIX} attendu`);
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(String(v && v.date))) erreurs.push("`date` absente ou hors de la forme AAAA-MM-JJ : une règle de voix est datée (loi n° 4)");
  if (!String((v && v.source) || "").trim()) erreurs.push("`source` absente : une règle de voix dit de quelle ligne éditoriale elle vient (loi n° 4)");
  const regles = Array.isArray(v && v.regles) ? v.regles : [];
  if (!Array.isArray(v && v.regles)) erreurs.push("`regles` absente ou hors tableau");
  // Les marqueurs se cherchent dans la DONNÉE écrite par l'émetteur, et là seulement : `role`,
  // `regle` et `champs` documentent le format, et un `motif` d'expression régulière peut porter
  // `(?<!…)` ou un groupe nommé `(?<nom>…)` sans être un trou.
  const marqueur = MARQUEUR_GABARIT.exec([v && v.date, v && v.source, v && v.sans_regle_mecanisable,
    ...regles.flatMap((r) => (r ? [r.libelle, ...(Array.isArray(r.valeurs) ? r.valeurs : []), r.motif_non_juge] : []))]
    .filter((x) => x !== undefined && x !== null).map(String).join("\n"));
  if (marqueur) erreurs.push(`marqueur du gabarit non instancié : ${marqueur[0]} — une règle qui porte encore son trou n'est pas une règle`);
  const ids = new Set();
  for (const r of regles) {
    const nom = (r && r.id) || "(sans id)";
    if (!r || !r.id || ids.has(r.id)) erreurs.push(`règle ${nom} : \`id\` absent ou répété`);
    else ids.add(r.id);
    if (!r || !TYPES_VOIX.includes(r.type)) { erreurs.push(`règle ${nom} : type « ${r && r.type} » inconnu (${TYPES_VOIX.join(" | ")})`); continue; }
    if (!String(r.libelle || "").trim()) erreurs.push(`règle ${nom} : \`libelle\` absent — le verdict cite la règle telle que la ligne éditoriale l'écrit`);
    if (r.portee !== undefined && !PORTEES_VOIX[r.portee]) erreurs.push(`règle ${nom} : portée « ${r.portee} » inconnue (${Object.keys(PORTEES_VOIX).join(" | ")})`);
    if (["mots_ecartes", "formules_imposees"].includes(r.type)
      && (!Array.isArray(r.valeurs) || !r.valeurs.length || r.valeurs.some((x) => !String(x).trim()))) erreurs.push(`règle ${nom} : \`valeurs\` vide`);
    if (r.type === "formules_imposees" && r.exige !== undefined && !["toutes", "une"].includes(r.exige)) erreurs.push(`règle ${nom} : \`exige\` vaut « toutes » ou « une »`);
    if (r.type === "plafond") {
      if (!OBJETS_PLAFOND.includes(r.objet)) erreurs.push(`règle ${nom} : objet « ${r.objet} » que ce contrôle ne compte pas (${OBJETS_PLAFOND.join(" | ")})`);
      const bornes = [r.min, r.max].filter((x) => x !== undefined);
      if (!bornes.length || bornes.some((x) => !Number.isInteger(x) || x < 0)) erreurs.push(`règle ${nom} : \`min\` ou \`max\`, entier positif, attendu`);
    }
    if (r.type === "motif_interdit") {
      try { if (!String(r.motif || "")) throw new Error("motif vide"); new RegExp(String(r.motif), "iu"); }
      catch (e) { erreurs.push(`règle ${nom} : motif illisible (${String(e.message).slice(0, 60)}) — une règle illisible n'est jamais ignorée`); }
    }
    if (r.type === "lecture_humaine" && !String(r.motif_non_juge || "").trim()) erreurs.push(`règle ${nom} : \`motif_non_juge\` absent — dire pourquoi aucun calcul ne la juge`);
  }
  if (!regles.some((r) => r && TYPES_VOIX.includes(r.type) && r.type !== "lecture_humaine") && !String((v && v.sans_regle_mecanisable) || "").trim())
    erreurs.push("aucune règle mécanisable, et `sans_regle_mecanisable` n'en écrit pas le motif — l'omission ne vaut pas déclaration (loi n° 3)");
  return { regles, date: v && v.date, erreurs };
}

/** Écarts d'UNE publication aux règles de voix de sa portée ; [] quand elle les tient toutes. */
export function ecartsDeVoix(texte, { reseau, modele }, regles, contrats) {
  const p = portees(texte);
  const ecarts = [];
  for (const r of regles) {
    if (r.type === "lecture_humaine") continue;
    if ((Array.isArray(r.reseaux) && !r.reseaux.includes(reseau)) || (Array.isArray(r.modeles) && !r.modeles.includes(modele))) continue;
    const zone = r.portee || "corps", ou = PORTEES_VOIX[zone], t = p[zone];
    if (r.type === "mots_ecartes") {
      const vus = r.valeurs.filter((x) => contientExpression(t, x));
      if (vus.length) ecarts.push(`${r.id} « ${r.libelle} » : ${vus.map((x) => `« ${x} »`).join(", ")} ${ou} — le retirer ou le remplacer`);
    } else if (r.type === "formules_imposees") {
      const manquent = r.valeurs.filter((x) => !contientExpression(t, x));
      if ((r.exige || "toutes") === "une" ? manquent.length === r.valeurs.length : manquent.length)
        ecarts.push(`${r.id} « ${r.libelle} » : ${manquent.map((x) => `« ${x} »`).join(", ")} absente(s) ${ou} — l'écrire`);
    } else if (r.type === "plafond") {
      const contrat = contrats && contrats[modele];
      if (r.objet === "hashtags" && r.min !== undefined && contrat && r.min > contrat.hashtags_max) {
        ecarts.push(`${r.id} « ${r.libelle} » inapplicable au modèle « ${modele} », dont le contrat admet ${contrat.hashtags_max} hashtag(s) au plus — restreindre la portée de la règle (\`modeles\`)`);
        continue;
      }
      const n = r.objet === "emojis" ? compterEmojis(t) : (t.match(RE_HASHTAG) || []).length;
      if ((r.min !== undefined && n < r.min) || (r.max !== undefined && n > r.max))
        ecarts.push(`${r.id} « ${r.libelle} » : ${n} ${r.objet === "emojis" ? "émoji(s)" : "hashtag(s)"} ${ou}, ${r.min ?? 0} à ${r.max ?? "sans plafond"} attendu(s)`);
    } else if (r.type === "motif_interdit") {
      const m = new RegExp(String(r.motif), "iu").exec(t);
      if (m) ecarts.push(`${r.id} « ${r.libelle} » : « ${m[0]} » ${ou} — ${zone === "corps" ? "le retirer" : `le déplacer hors de ${zone === "accroche" ? "l'accroche" : "la clôture"}, ou le retirer`}`);
    }
  }
  return ecarts;
}

export function juger(dossier, { mentions, contrats = chargerContrats() } = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const lire = (nom, base = dossier) => (existsSync(join(base, nom)) ? readFileSync(join(base, nom), "utf8") : null);

  // RR1 — calendrier à 4 semaines
  const cal = lire("calendrier.md");
  const lignesDatees = (cal || "").split(/\r?\n/).filter((l) => /^\|/.test(l.trim()) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l));
  if (!cal) ko("RR1", "calendrier.md absent — le rendez-vous hebdomadaire n'a pas de support");
  else if (lignesDatees.length < 4) ko("RR1", `${lignesDatees.length} publication(s) datée(s) au calendrier — l'horizon est de 4 semaines`);
  else ok("RR1", `${lignesDatees.length} publication(s) datée(s) au calendrier`);

  // Le LOT de la semaine : publication.md, publication-<réseau>.md, …
  const lot = (existsSync(dossier) ? readdirSync(dossier) : []).filter((f) => /^publication.*\.md$/i.test(f)).sort();
  const declarations = lot.map((f) => { const fm = frontmatter(lire(f)); return { fichier: f, reseau: fm.reseau || RESEAU_PAR_DEFAUT, modele: fm.modele || MODELE_PAR_DEFAUT }; });

  // RR2 — chaque publication tient le contrat du modèle qu'elle déclare
  if (!lot.length) ko("RR2", "aucune publication*.md dans le dossier de la semaine");
  else if (!contrats) ko("RR2", `contrats de sortie introuvables ou illisibles (${CONTRATS}) — un contrat absent ne rend jamais PASS`);
  else {
    const fautes = [];
    const tenus = [];
    for (const d of declarations) {
      const contrat = contrats[d.modele];
      if (!contrat) { fautes.push(`${d.fichier} : modèle « ${d.modele} » inconnu des contrats`); continue; }
      if (!contrat.reseaux.includes(d.reseau)) { fautes.push(`${d.fichier} : le modèle « ${d.modele} » ne sert pas le réseau « ${d.reseau} » (il sert ${contrat.reseaux.join(", ")})`); continue; }
      const { defauts, mots, hashtags } = defautsDuContrat(lire(d.fichier), contrat, dossier);
      defauts.length ? fautes.push(`${d.fichier} [${d.modele}] : ${defauts.join(" · ")}`) : tenus.push(`${d.fichier} [${d.modele}] ${mots} mots, ${hashtags} hashtag(s)`);
    }
    fautes.length ? ko("RR2", `contrat de sortie non tenu — ${fautes.join(" | ")}`) : ok("RR2", `contrat de sortie tenu — ${tenus.join(" | ")}`);
  }

  // RR3, RR4 — verdicts repris des oracles de forge-agents, jamais rejugés ici ; un par publication
  if (lot.length) {
    const rouges3 = [], rouges4 = [], vus3 = [], vus4 = [];
    for (const f of lot) {
      const chemin = join(dossier, f);
      const claims = jouer("oracle-claims.mjs", [chemin]);
      claims.verdict === "FAIL" ? rouges3.push(f) : vus3.push(`${f} ${claims.verdict}${claims.motif ? ` (${claims.motif})` : ""}`);
      const tr = jouer("oracle-transparence.mjs", mentions ? [chemin, "--mentions", mentions] : [chemin]);
      tr.verdict === "FAIL" ? rouges4.push(f) : vus4.push(`${f} ${tr.verdict}${tr.motif ? ` (${tr.motif})` : ""}`);
    }
    rouges3.length ? ko("RR3", `oracle-claims FAIL — un chiffre sans source : ${rouges3.join(", ")}`) : ok("RR3", `oracle-claims — ${vus3.join(" | ")}`);
    rouges4.length ? ko("RR4", `oracle-transparence FAIL — contenu généré sans mention lisible : ${rouges4.join(", ")}`) : ok("RR4", `oracle-transparence — ${vus4.join(" | ")}`);
  }

  // RR5 — accord humain de publication, par LOT
  let accord = null;
  try { accord = JSON.parse(lire("accord.json") || "null"); } catch { /* jugé ci-dessous */ }
  const horsLot = lot.length > 1 ? lot.filter((f) => !(accord && Array.isArray(accord.lot) && accord.lot.includes(f))) : [];
  if (!accord) ko("RR5", "accord.json absent ou illisible — aucune publication sans accord consigné (R-38)");
  else if (accord.accord !== true || !/^20\d{2}-\d{2}-\d{2}/.test(accord.date || "") || !accord.par)
    ko("RR5", "accord incomplet : `accord: true`, une `date` et un `par` sont dus");
  else if (horsLot.length) ko("RR5", `l'accord ne couvre pas tout le lot — hors \`lot\` : ${horsLot.join(", ")}`);
  else ok("RR5", `accord consigné le ${accord.date} sur ${lot.length} publication(s)${accord.fictif ? " (FICTIF — semaine à blanc)" : ""}`);

  // RR6 — mesure de la semaine
  let mes = null;
  try { mes = JSON.parse(lire("mesures.json") || "null"); } catch { /* jugé ci-dessous */ }
  const ind = (mes && Array.isArray(mes.indicateurs)) ? mes.indicateurs : [];
  const incomplets = ind.filter((i) => !i.nom || typeof i.valeur !== "number" || typeof i.seuil !== "number");
  if (!mes) ko("RR6", "mesures.json absent ou illisible — une semaine sans mesure ne démontre aucun gain");
  else if (!mes.export || typeof mes.temps_humain_minutes !== "number") ko("RR6", "`export` nommé et `temps_humain_minutes` sont dus");
  else if (ind.length < 1 || ind.length > 3 || incomplets.length) ko("RR6", `${ind.length} indicateur(s), ${incomplets.length} incomplet(s) — 1 à 3, chacun avec valeur et seuil`);
  else ok("RR6", `${ind.length} indicateur(s) lus contre leur seuil, ${mes.temps_humain_minutes} min de temps humain`);

  // RR7 — fiche « émetteur et réseaux », dans la semaine ou dans son parent
  const brut = lire("emetteur.json") ?? lire("emetteur.json", dirname(resolve(dossier)));
  let fiche = null;
  try { fiche = JSON.parse(brut || "null"); } catch { /* jugé ci-dessous */ }
  if (!fiche) ko("RR7", "emetteur.json absent ou illisible — ni dans le dossier de la semaine, ni dans son parent");
  else {
    const fautes = [];
    // UN SECRET N'A RIEN À FAIRE ICI. La fiche dit QUI a accès, jamais AVEC QUOI.
    if (/mot[ _-]?de[ _-]?passe|password|passwd|secret|token|jeton|api[ _-]?key|cl[ée][ _-]?api/i.test(brut)) fautes.push("un champ ou une valeur évoque un secret (mot de passe, jeton, clé) — la fiche nomme des rôles, jamais un identifiant");
    if (!TYPES_EMETTEUR.includes(fiche.type_emetteur)) fautes.push(`type_emetteur hors ensemble fermé (${TYPES_EMETTEUR.join(" | ")})`);
    const reseaux = Array.isArray(fiche.reseaux) ? fiche.reseaux : [];
    if (!reseaux.length) fautes.push("aucun réseau retenu");
    for (const r of reseaux) {
      const modele = fiche.modeles && fiche.modeles[r];
      if (!modele) fautes.push(`réseau « ${r} » sans modèle`);
      else if (contrats && !(contrats[modele] && contrats[modele].reseaux.includes(r))) fautes.push(`réseau « ${r} » : le modèle « ${modele} » ne le sert pas`);
      const g = (Array.isArray(fiche.gouvernance) ? fiche.gouvernance : []).find((x) => x && x.reseau === r);
      if (!g) fautes.push(`réseau « ${r} » sans ligne de gouvernance`);
      else if (!Array.isArray(g.roles) || !g.roles.length || typeof g.double_facteur !== "boolean" || !g.reprise) fautes.push(`gouvernance de « ${r} » incomplète : \`roles\` non vide, \`double_facteur\` déclaré, \`reprise\` écrite`);
    }
    for (const d of declarations) if (reseaux.length && !reseaux.includes(d.reseau)) fautes.push(`${d.fichier} vise « ${d.reseau} », absent de la fiche`);
    fautes.length ? ko("RR7", `fiche « émetteur et réseaux » en défaut — ${fautes.join(" | ")}`) : ok("RR7", `émetteur ${fiche.type_emetteur}, ${reseaux.length} réseau(x) : ${reseaux.join(", ")}`);
  }

  // RR8 — voix de l'émetteur, dans la semaine ou dans son parent (TF-1455)
  const brutVoix = lire("voix.json") ?? lire("voix.json", dirname(resolve(dossier)));
  if (brutVoix === null) ko("RR8", "voix.json absent, ni dans le dossier de la semaine, ni dans son parent : la porte « voix » n'a aucune règle à jouer — copier gabarits\\VOIX-EMETTEUR.json du pilot à la racine du run sous ce nom, et le remplir d'après la ligne éditoriale");
  else {
    const voix = chargerVoix(brutVoix);
    const humaines = voix.regles.filter((r) => r && r.type === "lecture_humaine").map((r) => `${r.id} « ${r.libelle} »`);
    const dites = humaines.length ? ` ; en lecture humaine, nommée(s) et jamais jugée(s) ici : ${humaines.join(", ")}` : "";
    if (voix.erreurs.length) ko("RR8", `voix.json refusé — ${voix.erreurs.join(" | ")}`);
    else {
      const fautes = [];
      for (const d of declarations) {
        const e = ecartsDeVoix(lire(d.fichier), d, voix.regles, contrats);
        if (e.length) fautes.push(`${d.fichier} [${d.modele}] : ${e.join(" · ")}`);
      }
      fautes.length
        ? ko("RR8", `voix de l'émetteur non tenue — ${fautes.join(" | ")}${dites}`)
        : ok("RR8", `voix de l'émetteur tenue : ${voix.regles.length - humaines.length} règle(s) jouée(s) sur ${declarations.length} publication(s), voix.json du ${voix.date}${dites}`);
    }
  }

  return findings;
}

const NON_JUGE = [
  "la qualité du texte contre sa barre externe (lecture humaine, registre la-barre)",
  "la part non mécanisable de chaque contrat de sortie : fait repris de l'avis, absence de justification, offre datée — prose de digit-ai-communication, lecture humaine",
  "la sincérité de l'accord et la véracité de l'export",
  "le fait que la publication ait eu lieu ou ait été programmée : geste humain, dans l'outil de la plateforme",
  "la réalité du double facteur et des rôles déclarés à la fiche : ils se déclarent, ils ne se sondent pas",
  "RR8 : une règle de voix `lecture_humaine` (ton, registre) — nommée à chaque verdict, jamais jugée ; et la JUSTESSE des règles de voix.json, qui appartient à la ligne éditoriale de l'émetteur",
];

function rendre(cible, findings) {
  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-run-reseau", cible, verdict, findings, non_juge: NON_JUGE }, null, 1));
  process.exit(verdict === "PASS" ? 0 : 1);
}

// ── Autotest : LES SEMAINES À BLANC, dans les deux sens ───────────────────────────────────────
const MENTION = "Texte rédigé avec l'aide d'une IA, relu et assumé par son auteur.";
const FICHE_VERTE = {
  type_emetteur: "A2",
  reseaux: ["linkedin", "instagram", "fiche-etablissement"],
  modeles: { linkedin: "publication-reseau", instagram: "legende-image", "fiche-etablissement": "reponse-avis" },
  gouvernance: ["linkedin", "instagram", "fiche-etablissement"].map((reseau) => ({ reseau, roles: ["propriétaire : le gérant", "rédacteur : un salarié désigné"], double_facteur: true, reprise: "le gérant garde le rôle propriétaire ; un départ retire le rôle le jour même" })),
};
const ACCROCHE_VERTE = "Une étude faite en une matinée peut éviter de construire ce qu'il ne fallait pas construire.";
/** RR8 : une accroche qui ouvre sur un taux, sourcé pour que RR3 reste verte et que seule la voix rougisse. */
const TAUX_EN_TETE = "72 % des acheteurs vérifient un contenu généré avant de le croire (source : enquête citée par une étude fictive du 2026-09-11, section 3).";
// RR8 (TF-1455) : les règles de voix de la semaine verte — une par type, chacune tenue par le lot.
const VOIX_VERTE = {
  schema: SCHEMA_VOIX, version: "1.0.0", date: "2026-09-28", source: "ligne éditoriale fictive de la semaine à blanc, revue le 2026-09-28",
  regles: [
    { id: "V1", type: "mots_ecartes", libelle: "jamais de superlatif creux ni d'injonction molle", valeurs: ["révolutionnaire", "incroyable", "n'hésitez pas"] },
    { id: "V2", type: "formules_imposees", libelle: "une réponse à un avis s'ouvre par un remerciement", valeurs: ["merci"], exige: "une", portee: "accroche", modeles: ["reponse-avis"] },
    { id: "V3", type: "plafond", libelle: "2 émojis au plus", objet: "emojis", max: 2 },
    { id: "V4", type: "plafond", libelle: "3 à 5 hashtags", objet: "hashtags", min: 3, max: 5, modeles: ["publication-reseau"] },
    { id: "V5", type: "motif_interdit", libelle: "aucun taux en accroche", motif: "\\d+(?:[.,]\\d+)?\\s*%", portee: "accroche" },
    { id: "V6", type: "lecture_humaine", libelle: "un ton chaleureux, jamais familier", motif_non_juge: "le registre se lit, il ne se compte pas" },
  ],
};

function semaine(dir, { rouge }) {
  mkdirSync(dir, { recursive: true });
  const dates = ["2026-09-22", "2026-09-29", "2026-10-06", "2026-10-13"];
  writeFileSync(join(dir, "calendrier.md"), "| Date | Réseau | Pilier | Sujet | Statut |\n|---|---|---|---|---|\n" +
    (rouge ? dates.slice(0, 2) : dates).map((d) => `| ${d} | linkedin | méthode | sujet fictif | prévu |`).join("\n") + "\n");
  const phrase = "Nous avons mesuré avant de conclure, et la mesure a contredit notre première lecture du dossier. ";
  const corpsVert = ACCROCHE_VERTE + "\n\n" +
    phrase.repeat(9) + "\n\nEn 2025, 72 % des acheteurs vérifiaient un contenu généré (source : enquête citée par une étude fictive du 2026-09-11, section 3).\n\n" +
    MENTION + "\n\nEt vous, quelle question posez-vous avant de lancer un chantier ?\n\n#méthode #décision #conseil\n";
  const corpsRouge = "Notre offre fait gagner 45 000 € par an à chaque client.\n\n#a #b #c #d #e #f #g\n";
  // La semaine ROUGE garde la forme d'avant le 21/09 : un seul fichier, sans réseau ni modèle déclarés.
  // Elle prouve aussi que les défauts (linkedin, publication-reseau) s'appliquent.
  writeFileSync(join(dir, rouge ? "publication.md" : "publication-linkedin.md"),
    `---\n${rouge ? "" : "reseau: linkedin\nmodele: publication-reseau\n"}compte: profil\ngenere: true\n---\n${rouge ? corpsRouge : corpsVert}`);
  if (!rouge) {
    writeFileSync(join(dir, "visuel-terrasse.png"), "image fictive");
    writeFileSync(join(dir, "publication-instagram.md"), "---\nreseau: instagram\nmodele: legende-image\nvisuel: visuel-terrasse.png\ngenere: true\n---\n" +
      "La terrasse rouvre ce vendredi, et la carte d'automne arrive avec elle.\n\n" +
      "Le chef a gardé 3 plats de l'été et en ajoute 4, tous cuisinés avec des légumes de la ferme voisine, livrés le matin même. " +
      "Le service du midi commence à 12 h et celui du soir à 19 h, du mardi au samedi.\n\n" + MENTION + "\n\n" +
      "Quel plat d'automne attendez-vous le plus ?\n\n#terrasse #automne\n");
    writeFileSync(join(dir, "avis-2026-09-20.md"), "Avis collé par le gérant le 2026-09-20 — 4 étoiles : « Très bon repas, mais 25 minutes d'attente avant de commander. »\n");
    writeFileSync(join(dir, "publication-avis.md"), "---\nreseau: fiche-etablissement\nmodele: reponse-avis\navis: avis-2026-09-20.md\ngenere: true\n---\n" +
      "Merci pour votre retour sur le repas. L'attente avant la commande était trop longue ce soir-là, vous avez raison de le dire. " +
      "Depuis lundi, une personne de plus prend les commandes en salle le samedi soir. " +
      "Si vous revenez, dites-le à l'accueil : nous aimerions vous montrer la différence.\n\n" + MENTION + "\n");
    writeFileSync(join(dir, "emetteur.json"), JSON.stringify(FICHE_VERTE, null, 1));
    writeFileSync(join(dir, "voix.json"), JSON.stringify(VOIX_VERTE, null, 1));
    writeFileSync(join(dir, "accord.json"), JSON.stringify({ accord: true, date: "2026-09-22", par: "émetteur fictif", lot: ["publication-avis.md", "publication-instagram.md", "publication-linkedin.md"], fictif: true }));
  }
  writeFileSync(join(dir, "mesures.json"), JSON.stringify(rouge ? { indicateurs: [] } : {
    export: "export-fictif-2026-09-29.xlsx", temps_humain_minutes: 40,
    indicateurs: [{ nom: "impressions par publication", valeur: 900, seuil: 500 }, { nom: "taux d'engagement", valeur: 2.1, seuil: 2 }, { nom: "demandes de contact", valeur: 1, seuil: 1 }],
  }));
}

const arg = process.argv[2];
if (arg === "--self-test") {
  const base = mkdtempSync(join(tmpdir(), "run-reseau-"));
  const casse = [];
  const enEchec = (f) => f.filter((x) => x.statut === "FAIL").map((x) => x.regle);
  let cas = 0;
  try {
    // 1 et 2 — la semaine verte passe, la semaine rouge échoue sur CHAQUE règle
    semaine(join(base, "verte"), { rouge: false });
    semaine(join(base, "rouge"), { rouge: true });
    const v = juger(join(base, "verte"));
    const r = juger(join(base, "rouge"));
    cas += 2;
    if (enEchec(v).length) casse.push(`la semaine verte échoue sur ${enEchec(v).join(", ")} : ${v.filter((x) => x.statut === "FAIL").map((x) => x.message).join(" | ")}`);
    for (const regle of ["RR1", "RR2", "RR3", "RR4", "RR5", "RR6", "RR7", "RR8"])
      if (!enEchec(r).includes(regle)) casse.push(`la semaine rouge n'échoue pas sur ${regle}`);
    const joues = v.filter((x) => /^RR[34]$/.test(x.regle) && /introuvable|illisible/.test(x.message)).map((x) => x.regle);
    if (joues.length) casse.push(`oracle(s) de forge-agents non joué(s) (${joues.join(", ")}) — la semaine à blanc ne prouve rien sans eux`);
    const voixVerte = v.find((x) => x.regle === "RR8");
    if (!voixVerte || !/5 règle\(s\) jouée\(s\) sur 3 publication/.test(voixVerte.message) || !/V6 « un ton chaleureux, jamais familier »/.test(voixVerte.message))
      casse.push(`RR8 verte ne dit pas ce qu'elle a joué ni la règle laissée à la lecture humaine : ${voixVerte && voixVerte.message}`);

    // 3 à 8 — UNE altération de la semaine verte, UNE règle rouge, et elle NOMME ce qu'elle voit.
    // Une semaine rouge qui échoue partout ne prouve pas qu'une règle discrimine.
    const alterer = (nom, geste, regle, motif) => {
      const d = join(base, nom);
      semaine(d, { rouge: false });
      geste(d);
      const f = juger(d);
      cas++;
      const rouges = enEchec(f);
      const message = (f.find((x) => x.regle === regle) || {}).message || "";
      if (rouges.length !== 1 || rouges[0] !== regle) casse.push(`${nom} : attendu ${regle} seule, obtenu ${rouges.join(", ") || "aucune"}`);
      else if (!message.includes(motif)) casse.push(`${nom} : ${regle} rougit sans nommer « ${motif} » — ${message}`);
    };
    alterer("lot-non-couvert", (d) => writeFileSync(join(d, "accord.json"), JSON.stringify({ accord: true, date: "2026-09-22", par: "émetteur fictif", lot: ["publication-linkedin.md", "publication-instagram.md"], fictif: true })), "RR5", "publication-avis.md");
    alterer("visuel-absent", (d) => rmSync(join(d, "visuel-terrasse.png")), "RR2", "publication-instagram.md");
    alterer("modele-hors-reseau", (d) => writeFileSync(join(d, "publication-avis.md"), readFileSync(join(d, "publication-avis.md"), "utf8").replace("modele: reponse-avis", "modele: legende-image")), "RR2", "ne sert pas le réseau");
    alterer("reponse-trop-longue", (d) => writeFileSync(join(d, "publication-avis.md"), readFileSync(join(d, "publication-avis.md"), "utf8").replace("Merci pour votre retour sur le repas.", "Merci pour votre retour sur le repas. " + "Nous tenons à vous répondre longuement et en détail. ".repeat(14))), "RR2", "20 à 120 attendus");
    alterer("secret-a-la-fiche", (d) => writeFileSync(join(d, "emetteur.json"), JSON.stringify({ ...FICHE_VERTE, mot_de_passe: "fictif" })), "RR7", "secret");
    alterer("reseau-hors-fiche", (d) => writeFileSync(join(d, "emetteur.json"), JSON.stringify({ ...FICHE_VERTE, reseaux: ["linkedin", "fiche-etablissement"] })), "RR7", "publication-instagram.md");

    // 9 — contrats introuvables : RR2 rougit, elle ne passe jamais par défaut
    semaine(join(base, "sans-contrats"), { rouge: false });
    const sc = juger(join(base, "sans-contrats"), { contrats: null });
    cas++;
    if (!enEchec(sc).includes("RR2")) casse.push("contrats absents : RR2 ne rougit pas — un contrat absent rendrait PASS");

    // 10 à 22 — RR8, la voix de l'émetteur (TF-1455) : chaque altération ne rougit QUE la voix, et
    // nomme ce qu'elle voit. Les textes changent d'un mot, d'un émoji ou d'une ligne : RR2 à RR4 restent vertes.
    const remplacer = (d, fichier, avant, apres) => {
      const t = readFileSync(join(d, fichier), "utf8");
      if (!t.includes(avant)) throw new Error(`altération impossible : « ${avant.slice(0, 40)} » absent de ${fichier}`);
      writeFileSync(join(d, fichier), t.replace(avant, apres));
    };
    const voix = (d, geste) => { const x = JSON.parse(readFileSync(join(d, "voix.json"), "utf8")); geste(x); writeFileSync(join(d, "voix.json"), JSON.stringify(x, null, 1)); };
    alterer("voix-absente", (d) => rmSync(join(d, "voix.json")), "RR8", "voix.json absent");
    alterer("mot-ecarte", (d) => remplacer(d, "publication-instagram.md", "La terrasse rouvre", "La terrasse incroyable rouvre"), "RR8", "« incroyable »");
    // Sans casse ni accents, apostrophe typographique comprise : la graphie ne fait pas passer un mot écarté.
    alterer("mot-ecarte-sans-accent", (d) => remplacer(d, "publication-instagram.md", "La terrasse rouvre", "La terrasse REVOLUTIONNAIRE rouvre"), "RR8", "« révolutionnaire »");
    alterer("mot-ecarte-typographie", (d) => remplacer(d, "publication-avis.md", "Si vous revenez", "N’hésitez pas : si vous revenez"), "RR8", "« n'hésitez pas »");
    alterer("taux-en-accroche", (d) => remplacer(d, "publication-linkedin.md", ACCROCHE_VERTE, TAUX_EN_TETE), "RR8", "« 72 % » en accroche");
    alterer("trop-d-emojis", (d) => remplacer(d, "publication-instagram.md", "Le chef a gardé", "Le chef 🍂🍁🍂 a gardé"), "RR8", "3 émoji(s)");
    alterer("hashtags-manquants", (d) => remplacer(d, "publication-linkedin.md", "#méthode #décision #conseil", "#méthode #décision"), "RR8", "2 hashtag(s)");
    alterer("formule-absente", (d) => remplacer(d, "publication-avis.md", "Merci pour votre retour sur le repas.", "Votre retour sur le repas nous aide."), "RR8", "« merci » absente(s) en accroche");
    alterer("portee-incompatible", (d) => voix(d, (x) => { delete x.regles[3].modeles; }), "RR8", "inapplicable au modèle « reponse-avis »");
    alterer("marqueur-restant", (d) => voix(d, (x) => { x.regles[0].valeurs.push("<mot ou expression écartée>"); }), "RR8", "marqueur du gabarit");
    alterer("motif-illisible", (d) => voix(d, (x) => { x.regles[4].motif = "(taux"; }), "RR8", "motif illisible");
    alterer("voix-non-datee", (d) => voix(d, (x) => { delete x.date; }), "RR8", "datée");
    alterer("sans-regle-sans-motif", (d) => voix(d, (x) => { x.regles = x.regles.filter((y) => y.type === "lecture_humaine"); }), "RR8", "sans_regle_mecanisable");

    // 23 — borne : sans règle mécanisable mais avec son motif écrit, la porte passe et nomme la règle lue à l'humain
    {
      const d = join(base, "sans-regle-avec-motif");
      semaine(d, { rouge: false });
      voix(d, (x) => { x.regles = x.regles.filter((y) => y.type === "lecture_humaine"); x.sans_regle_mecanisable = "la ligne éditoriale fictive ne porte encore que des règles de ton"; });
      const f = juger(d);
      cas++;
      const m = (f.find((x) => x.regle === "RR8") || {}).message || "";
      if (enEchec(f).length || !/V6/.test(m)) casse.push(`sans règle mécanisable, motif écrit : attendu PASS nommant V6, obtenu ${enEchec(f).join(", ") || "PASS"} — ${m}`);
    }

    // 24 — borne : un mot écarté se cherche en MOT ENTIER ; « incroyablement » n'est pas « incroyable »
    {
      const d = join(base, "mot-entier");
      semaine(d, { rouge: false });
      remplacer(d, "publication-instagram.md", "La terrasse rouvre ce vendredi", "La terrasse rouvre incroyablement tôt ce vendredi");
      const f = juger(d);
      cas++;
      if (enEchec(f).length) casse.push(`mot entier : « incroyablement » accusé comme « incroyable » — ${enEchec(f).join(", ")} : ${(f.find((x) => x.regle === "RR8") || {}).message}`);
    }

    // 25 et 26 — le GABARIT du pilot et son lecteur ne divergent pas : brut, il est refusé pour ses
    // trous (marqueurs, date à écrire) et pour eux seuls ; instancié, il est lu sans une erreur.
    {
      const brut = readFileSync(join(ICI, "..", "gabarits", "VOIX-EMETTEUR.json"), "utf8");
      const g = chargerVoix(brut);
      cas++;
      if (!g.erreurs.some((e) => /marqueur du gabarit/.test(e)) || g.erreurs.some((e) => !/marqueur du gabarit|`date`/.test(e)))
        casse.push(`gabarit brut : attendu le seul refus de ses trous, obtenu ${JSON.stringify(g.erreurs)}`);
      const gi = chargerVoix(brut.replace(/<AAAA-MM-JJ[^<>]*>/, "2026-09-28").replace(/<[^<>\n"]{2,160}>/g, "valeur instanciée"));
      cas++;
      if (gi.erreurs.length) casse.push(`gabarit instancié refusé par son propre lecteur : ${gi.erreurs.join(" | ")}`);
    }

    // 27 — remède joué (TF-1013) : RR8 prescrit de déplacer le taux hors de l'accroche ; déplacé, tout passe
    {
      const d = join(base, "taux-remede");
      semaine(d, { rouge: false });
      remplacer(d, "publication-linkedin.md", ACCROCHE_VERTE, TAUX_EN_TETE);
      const prescrit = (juger(d).find((x) => x.regle === "RR8") || {}).message || "";
      remplacer(d, "publication-linkedin.md", TAUX_EN_TETE + "\n\n", "");
      remplacer(d, "publication-linkedin.md", "\n\nEn 2025", "\n\n" + TAUX_EN_TETE + "\n\nEn 2025");
      const f = juger(d);
      cas++;
      if (!/le déplacer hors de l'accroche/.test(prescrit)) casse.push(`remède RR8 : le message ne prescrit pas le déplacement — ${prescrit}`);
      else if (enEchec(f).length) casse.push(`remède RR8 joué : le taux déplacé hors de l'accroche laisse ${enEchec(f).join(", ")} rouge(s)`);
    }
  } finally { rmSync(base, { recursive: true, force: true }); }
  console.log(JSON.stringify({ outil: "oracle-run-reseau --self-test", verdict: casse.length ? "FAIL" : "PASS", cas, regles: 8, casse }, null, 1));
  console.log(`Self-test run-reseau : ${casse.length ? "FAIL" : `${cas}/${cas} PASS`} (semaine verte à 3 publications PASS ; semaine rouge FAIL sur RR1 à RR8 ; 19 altérations à une règle ; contrats absents ; voix sans règle mécanisable mais motivée PASS ; mot entier PASS ; gabarit brut refusé et instancié lu ; remède RR8 joué)`);
  process.exit(casse.length ? 1 : 0);
}
if (!arg || !existsSync(arg)) { console.log(JSON.stringify({ oracle: "oracle-run-reseau", verdict: "SKIP", motif: "dossier de semaine absent" })); process.exit(2); }
const iM = process.argv.indexOf("--mentions");
rendre(arg, juger(arg, { mentions: iM > 0 ? process.argv[iM + 1] : undefined }));
