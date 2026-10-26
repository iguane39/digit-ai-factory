#!/usr/bin/env node
/**
 * compter-lecture-usage.mjs — LE COMPTAGE DE L'ESSAI « LECTEUR D'USAGE DE LA RESTITUTION », HORS SERVICE
 * (TF-1944, décision humaine D-84 (a) du 26/10/2026 ; protocole de l'option O3 de l'étude
 * `output\03-etudes\20261021-etude-opportunite-relecteur-de-bon-sens-restitution.md`, sections 4 et 5, mesures M5 et M8).
 *
 * CE QUE FAIT CE SCRIPT. Il ne lit aucune restitution et ne lance aucun lecteur : les lectures sont jouées par le
 * pilot, un lecteur neuf par texte, qui ne reçoit que la consigne de `references\LECTURE-USAGE.md` et le texte. Ici on
 * COMPTE, sans jugement après coup : il lit le manifeste des cas (rangé HORS DU DÉPÔT, dans le canal confidentiel,
 * `<racine>\_confidentiel\bancs\lecture-usage\cas.json`, parce qu'un texte peut porter un nom de client), un dossier de
 * réponses JSON des lecteurs, applique la règle écrite AVANT les lectures dans
 * `references\LECTURE-USAGE-PREENREGISTREMENT-20261026.md`, et rend le rappel, les faux signalements et le verdict
 * par rapport aux seuils de l'étude.
 *
 * CE QUI REND LE COMPTE OPPOSABLE.
 *   - le manifeste et la consigne du lecteur sont scellés par leur empreinte SHA-256, inscrite dans le
 *     pré-enregistrement : un manifeste ou une consigne modifiés après coup font refuser le comptage (exit 1) ;
 *   - chaque texte porte son empreinte au manifeste : un texte retouché fait refuser le comptage ;
 *   - une lecture datée d'avant le commit du pré-enregistrement est refusée (la date de commit est lue dans git) ;
 *   - un cas positif est « vu » seulement si le lecteur a signalé UNE LIGNE QUI EXISTE dans le texte ET qui porte une
 *     des ancres fixées au manifeste avant toute lecture ; un signalement ailleurs n'est pas un cas vu ;
 *   - une réponse illisible compte contre l'essai (non vu pour un positif, faux signalement pour un négatif), jamais
 *     pour lui ; elle se rejoue une fois avant d'être comptée ainsi (règle du pré-enregistrement).
 *
 * Usage : node compter-lecture-usage.mjs --reponses <dossier> [--reponses <second dossier>] [--manifeste <cas.json>]
 *                                        [--preenregistrement <fichier>] [--rubrique <fichier>] [--json]
 *         node compter-lecture-usage.mjs --lister   [--manifeste <cas.json>]   (les identifiants, dans l'ordre de lecture)
 *         node compter-lecture-usage.mjs --appel <identifiant> [--manifeste <cas.json>]   (l'invite exacte du lecteur)
 *         node compter-lecture-usage.mjs --enregistrer <identifiant> --dossier <dossier> [--modele <nom>] < sortie du lecteur
 * Exit  : 0 = comptage rendu (le verdict est dans la sortie) · 1 = intégrité rompue, aucun comptage · 2 = usage.
 * Recette : scripts\compter-lecture-usage.test.mjs (jouée par oracles\self-tests.mjs, I2).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const VERSION = "1.0.0";
const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, ".."));
export const RUBRIQUE = join(PILOT, "references", "LECTURE-USAGE.md");
export const PREENREGISTREMENT = join(PILOT, "references", "LECTURE-USAGE-PREENREGISTREMENT-20261026.md");
export const MARQUE_DEBUT = "<!-- CONSIGNE-LECTEUR:DEBUT -->";
export const MARQUE_FIN = "<!-- CONSIGNE-LECTEUR:FIN -->";

export const cheminManifesteParDefaut = (env = process.env) =>
  join(env.FORGE_CONFIDENTIEL || join(env.FORGE_ROOT || join(PILOT, ".."), "_confidentiel"), "bancs", "lecture-usage", "cas.json");

// ───────────────────────────── outils purs ─────────────────────────────

export const empreinte = (donnee) => createHash("sha256").update(donnee).digest("hex");

/** Fins de ligne unifiées : l'empreinte d'un texte ne dépend pas du poste (Windows écrit \r\n). */
const sansCR = (s) => String(s).replace(/\r\n?/g, "\n");

/**
 * Forme comparable d'une ligne : sans accents, sans majuscules, sans guillemets typographiques, sans espaces
 * insécables, sans les signes de mise en forme Markdown (`*`, `_`, accent grave, `|`, `>`, `#`), espaces réduits.
 * Une citation du lecteur qui perd le gras ou le tableau reste donc retrouvable dans le texte.
 */
export function normaliser(s) {
  return sansCR(s)
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[   ]/g, " ")
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[*_`|>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Les blocs numérotés 0 à 9 d'une restitution : `## 3. …`, `### 3. …` ou `**3. …**`. */
export function blocs(texte) {
  const lignes = sansCR(texte).split("\n");
  const out = {};
  let courant = null;
  for (const l of lignes) {
    const m = /^\s*(?:#{1,6}\s*|\*\*)\s*(\d)\s*[.\-—:)]/.exec(l);
    if (m) { courant = m[1]; out[courant] = (out[courant] || "") + l + "\n"; continue; }
    if (courant !== null) out[courant] += l + "\n";
  }
  return out;
}

/**
 * LE CRITÈRE « CE TEXTE DEMANDE QUELQUE CHOSE À L'HUMAIN » (rubrique, section « Quand la lecture se joue »).
 * Mécanique, écrit avant toute lecture, sans modèle : un texte le satisfait s'il porte au moins une de ces marques.
 *   - une décision nouvelle au bloc 3 : une tête « D-N … ? » qui n'est pas un rappel (« posée le … », « inchangée »),
 *     ou des options (a) et (b) ;
 *   - une action laissée à l'humain au bloc 8 : un acteur `manuelle_utilisateur` ou `manuelle_dev`
 *     (vocabulaire gelé de `actions[]`, règle 29) ;
 *   - un guide : une section `Guide —` (le geste sur l'écran d'une plateforme tierce, S53 de la restitution).
 * Un texte qui n'en porte aucune ne demande rien : le lecteur lui rend « utilisable » sans rien chercher.
 */
export function demandeQuelqueChose(texte) {
  const b = blocs(texte);
  const raisons = [];
  const b3 = b["3"] || "";
  const tetes = b3.split("\n").filter((l) =>
    /^\s*(?:>\s*)?(?:\*\*)?\s*D-\d+\b/.test(l) && l.includes("?") && !/inchangée|posée le \d/i.test(l));
  if (tetes.length) raisons.push("decision");
  else if (/\(a\)/i.test(b3) && /\(b\)/i.test(b3)) raisons.push("decision");
  if (/manuelle_utilisateur|manuelle_dev/.test(b["8"] || "")) raisons.push("action_humaine");
  if (/^\s*#{1,6}\s*Guide\s*[—–-]/im.test(sansCR(texte))) raisons.push("guide");
  return { demande: raisons.length > 0, raisons };
}

// ───────────────────────────── consigne et pré-enregistrement ─────────────────────────────

/** Le bloc de la consigne du lecteur, tel qu'il est remis au lecteur (entre les deux marques de la rubrique). */
export function extraireConsigne(markdown) {
  const t = sansCR(markdown);
  const d = t.indexOf(MARQUE_DEBUT);
  const f = t.indexOf(MARQUE_FIN);
  if (d < 0 || f < 0 || f < d) return null;
  return t.slice(d + MARQUE_DEBUT.length, f).trim();
}

/** Les données figées du pré-enregistrement : le premier bloc ```json sous « Données figées ». */
export function lirePreenregistrement(chemin = PREENREGISTREMENT) {
  const t = sansCR(readFileSync(chemin, "utf8"));
  const i = t.search(/^#{1,6}\s*Données figées/im);
  if (i < 0) throw new Error("section « Données figées » absente du pré-enregistrement");
  const m = /```json\n([\s\S]*?)\n```/.exec(t.slice(i));
  if (!m) throw new Error("bloc json absent sous « Données figées »");
  return JSON.parse(m[1]);
}

/** Date de commit d'un fichier suivi (ISO strict), ou null si git ne la donne pas. */
export function dateDeCommit(chemin, racine = PILOT) {
  try {
    const s = execFileSync("git", ["log", "-1", "--format=%cI", "--", chemin], { cwd: racine, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return s || null;
  } catch { return null; }
}

// ───────────────────────────── manifeste ─────────────────────────────

/**
 * Charge le manifeste et vérifie ce qui se vérifie sans modèle. Rend { manifeste, octets, erreurs[] }.
 * Une erreur ici = comptage refusé (exit 1) : ni le manifeste ni un texte ne se rattrapent après les lectures.
 */
export function chargerManifeste(chemin, prereg = null) {
  const erreurs = [];
  if (!existsSync(chemin)) return { manifeste: null, octets: null, erreurs: [`manifeste introuvable : ${chemin}`] };
  const octets = readFileSync(chemin);
  let manifeste;
  try { manifeste = JSON.parse(octets.toString("utf8")); } catch (e) { return { manifeste: null, octets, erreurs: [`manifeste illisible : ${e.message}`] }; }
  const base = dirname(chemin);
  const ids = new Set();
  for (const c of manifeste.cas || []) {
    if (!/^LU-\d{2,3}$/.test(c.id || "")) erreurs.push(`identifiant non neutre : ${c.id}`);
    if (ids.has(c.id)) erreurs.push(`identifiant en double : ${c.id}`);
    ids.add(c.id);
    if (!["positif", "negatif"].includes(c.etiquette)) erreurs.push(`${c.id} : étiquette inconnue`);
    const f = isAbsolute(c.texte || "") ? c.texte : join(base, c.texte || "");
    if (!c.texte || !existsSync(f)) { erreurs.push(`${c.id} : texte introuvable (${c.texte})`); continue; }
    const brut = readFileSync(f);
    if (empreinte(brut) !== c.sha256) erreurs.push(`${c.id} : empreinte du texte différente de celle du manifeste (texte modifié)`);
    const nom = f.replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, "");
    if (nom !== c.id) erreurs.push(`${c.id} : le nom du fichier doit être l'identifiant seul`);
    const contenu = brut.toString("utf8");
    if (contenu.includes(c.id)) erreurs.push(`${c.id} : le texte porte l'identifiant du cas, que le lecteur ne doit pas voir`);
    if (c.etiquette === "positif" && !(Array.isArray(c.ancres) && c.ancres.length)) erreurs.push(`${c.id} : un cas positif porte au moins une ancre`);
  }
  if (prereg) {
    const attendu = prereg.empreintes && prereg.empreintes.manifeste_cas_json;
    if (attendu && empreinte(octets) !== attendu) erreurs.push("empreinte du manifeste différente de celle du pré-enregistrement (manifeste modifié après coup)");
    const pos = (manifeste.cas || []).filter((c) => c.etiquette === "positif").length;
    const neg = (manifeste.cas || []).filter((c) => c.etiquette === "negatif").length;
    if (prereg.cas && prereg.cas.positifs !== pos) erreurs.push(`positifs : ${pos} au manifeste, ${prereg.cas.positifs} au pré-enregistrement`);
    if (prereg.cas && prereg.cas.negatifs !== neg) erreurs.push(`négatifs : ${neg} au manifeste, ${prereg.cas.negatifs} au pré-enregistrement`);
  }
  return { manifeste, octets, base, erreurs };
}

export function texteDuCas(cas, base) {
  const f = isAbsolute(cas.texte) ? cas.texte : join(base, cas.texte);
  return readFileSync(f, "utf8");
}

/** L'invite exacte remise à un lecteur : la consigne figée, puis le texte, rien d'autre. */
export function composerAppel(consigne, texte) {
  return `${consigne}\n\n=== DEBUT DU MESSAGE ===\n${sansCR(texte).replace(/\n+$/, "")}\n=== FIN DU MESSAGE ===\n`;
}

// ───────────────────────────── réponses ─────────────────────────────

/** Forme d'une réponse de lecteur (rubrique, « Format de la réponse »). Rend la liste des défauts, vide si valide. */
export function validerReponse(r) {
  const e = [];
  if (!r || typeof r !== "object" || Array.isArray(r)) return ["la réponse n'est pas un objet JSON"];
  if (!["utilisable", "signale"].includes(r.verdict)) e.push("verdict absent ou inconnu (utilisable | signale)");
  if (!Array.isArray(r.signalements)) { e.push("signalements absent (tableau, vide si utilisable)"); return e; }
  if (r.signalements.length > 3) e.push("plus de 3 signalements");
  if (r.verdict === "utilisable" && r.signalements.length) e.push("verdict utilisable avec des signalements");
  if (r.verdict === "signale" && !r.signalements.length) e.push("verdict signale sans signalement");
  r.signalements.forEach((s, i) => {
    if (![1, 2, 3].includes(s && s.question)) e.push(`signalement ${i + 1} : question 1, 2 ou 3 attendue`);
    if (typeof (s && s.ligne_citee) !== "string" || !s.ligne_citee.trim()) e.push(`signalement ${i + 1} : ligne_citee vide`);
    if (typeof (s && s.question_humain) !== "string" || !s.question_humain.trim()) e.push(`signalement ${i + 1} : question_humain vide`);
  });
  return e;
}

/** L'objet JSON d'une sortie brute de lecteur : du premier `{` au dernier `}`, clôtures de code comprises. Null si illisible. */
export function extraireJson(brut) {
  const t = String(brut || "");
  const d = t.indexOf("{");
  const f = t.lastIndexOf("}");
  if (d < 0 || f < d) return null;
  try { return JSON.parse(t.slice(d, f + 1)); } catch { return null; }
}

/**
 * Enregistre la sortie brute d'UN lecteur dans le dossier de réponses, sous enveloppe datée. Une réponse valide déjà
 * enregistrée n'est jamais écrasée (une seule lecture par texte : pas de choix de la meilleure). Une réponse illisible
 * se rejoue UNE fois ; au-delà, l'enregistrement est refusé et le comptage prend la réponse contre l'essai.
 * Rend { ecrit, valide, defauts, essai, raison }.
 */
export function enregistrerReponse({ id, dossier, brut, modele = null, maintenant = () => new Date().toISOString() }) {
  if (!/^LU-\d{2,3}$/.test(id || "")) return { ecrit: false, raison: `identifiant non neutre : ${id}` };
  const f = join(dossier, `${id}.json`);
  let essai = 1;
  if (existsSync(f)) {
    let avant = null;
    try { avant = JSON.parse(readFileSync(f, "utf8")); } catch { /* fichier illisible : traité comme un essai raté */ }
    const reponseAvant = avant && typeof avant === "object" && "reponse" in avant ? avant.reponse : avant;
    if (reponseAvant && !validerReponse(reponseAvant).length) return { ecrit: false, raison: "une réponse valide est déjà enregistrée pour ce texte : une seule lecture par texte" };
    essai = ((avant && avant.essai) || 1) + 1;
    if (essai > 2) return { ecrit: false, raison: "deux essais illisibles déjà enregistrés : le comptage prend ce texte contre l'essai" };
  }
  const reponse = extraireJson(brut);
  const defauts = validerReponse(reponse);
  const enveloppe = { id, lu_le: maintenant(), modele, essai, reponse };
  if (defauts.length) enveloppe.sortie_brute = String(brut || "").slice(0, 4000);
  writeFileSync(f, JSON.stringify(enveloppe, null, 1) + "\n", "utf8");
  return { ecrit: true, valide: !defauts.length, defauts, essai };
}

/** Les réponses d'un dossier : `<identifiant>.json`, avec ou sans enveloppe `{ id, lu_le, reponse }`. */
export function lireReponses(dossier) {
  const out = {};
  for (const f of readdirSync(dossier).filter((x) => /^LU-\d{2,3}\.json$/.test(x)).sort()) {
    const id = f.replace(/\.json$/, "");
    try {
      const o = JSON.parse(readFileSync(join(dossier, f), "utf8"));
      const enveloppe = o && typeof o === "object" && "reponse" in o;
      out[id] = { fichier: f, reponse: enveloppe ? o.reponse : o, lu_le: enveloppe ? o.lu_le || null : null, essai: enveloppe ? o.essai || 1 : 2, erreurLecture: null };
    } catch (e) { out[id] = { fichier: f, reponse: null, lu_le: null, essai: 2, erreurLecture: e.message }; }
  }
  return out;
}

/**
 * Le sort d'UNE réponse sur UN cas. Statuts :
 *   positif : vu · signale_ailleurs (signalé, mais aucune ligne valide ne porte une ancre) · non_signale · illisible
 *   négatif : faux_signalement · correct · illisible
 * Un signalement dont la ligne citée n'existe pas dans le texte n'est pas une preuve : il ne compte jamais comme vu
 * (mais il reste un faux signalement sur un négatif : le lecteur a bien signalé).
 */
export function jugerReponse(cas, texte, lecture) {
  if (!lecture) return { statut: "manquante" };
  const defauts = lecture.erreurLecture ? [`JSON illisible : ${lecture.erreurLecture}`] : validerReponse(lecture.reponse);
  if (defauts.length) return { statut: "illisible", defauts };
  const r = lecture.reponse;
  const corps = normaliser(texte);
  const valides = r.signalements.filter((s) => normaliser(s.ligne_citee).length >= 8 && corps.includes(normaliser(s.ligne_citee)));
  const invalides = r.signalements.length - valides.length;
  if (cas.etiquette === "negatif") {
    return { statut: r.verdict === "signale" ? "faux_signalement" : "correct", signalements: r.signalements.length, citations_introuvables: invalides };
  }
  const ancres = (cas.ancres || []).map(normaliser).filter(Boolean);
  const surCible = valides.filter((s) => ancres.some((a) => normaliser(s.ligne_citee).includes(a)));
  if (surCible.length) return { statut: "vu", citations_introuvables: invalides };
  if (r.verdict === "signale") return { statut: "signale_ailleurs", citations_introuvables: invalides };
  return { statut: "non_signale" };
}

// ───────────────────────────── comptage ─────────────────────────────

/** Nombre de positifs vus exigé pour N positifs : la proportion de l'étude (4 sur 6), arrondie au-dessus, jamais moins de 4. */
export function vusRequis(n, seuils) {
  const { vus, sur } = seuils.rappel_reference;
  return Math.max(vus, Math.ceil((n * vus) / sur - 1e-9));
}

/**
 * Compte une ou deux séries de lectures (deux = « accord de deux lecteurs » : un cas n'est signalé que si les deux
 * lecteurs l'ont signalé ; un positif n'est vu que s'il l'est par les deux).
 */
export function compter({ manifeste, base, prereg, series, avant = null }) {
  const seuils = prereg.seuils;
  const cas = manifeste.cas;
  const positifs = cas.filter((c) => c.etiquette === "positif");
  const negatifs = cas.filter((c) => c.etiquette === "negatif");
  const textes = Object.fromEntries(cas.map((c) => [c.id, texteDuCas(c, base)]));
  const anomalies = [];
  const detail = {};
  let manquantes = 0;
  let aRejouer = 0;
  for (const c of cas) {
    const sorts = series.map((reponses) => jugerReponse(c, textes[c.id], reponses[c.id]));
    if (sorts.some((s) => s.statut === "manquante")) manquantes++;
    series.forEach((reponses, k) => {
      if (sorts[k].statut === "illisible" && (reponses[c.id].essai || 1) < 2) { aRejouer++; anomalies.push(`${c.id} (lecteur ${k + 1}) : réponse illisible au premier essai, à rejouer une fois avec un lecteur neuf avant comptage`); }
    });
    series.forEach((reponses, k) => {
      const l = reponses[c.id];
      if (l && avant && l.lu_le && Date.parse(l.lu_le) <= Date.parse(avant)) anomalies.push(`${c.id} (lecteur ${k + 1}) : lecture datée ${l.lu_le}, avant le commit du pré-enregistrement (${avant})`);
      if (l && avant && !l.lu_le) anomalies.push(`${c.id} (lecteur ${k + 1}) : lecture non datée, chronologie non prouvée`);
    });
    let statut;
    if (sorts.some((s) => s.statut === "manquante")) statut = "manquante";
    else if (c.etiquette === "positif") statut = sorts.every((s) => s.statut === "vu") ? "vu" : sorts.some((s) => s.statut === "illisible") ? "illisible" : sorts.some((s) => s.statut === "signale_ailleurs") ? "signale_ailleurs" : "non_signale";
    else statut = sorts.every((s) => s.statut === "faux_signalement" || s.statut === "illisible") ? "faux_signalement" : "correct";
    detail[c.id] = { etiquette: c.etiquette, statut, par_lecteur: sorts.map((s) => s.statut) };
    for (const s of sorts) if (s.citations_introuvables) anomalies.push(`${c.id} : ${s.citations_introuvables} citation(s) introuvable(s) dans le texte`);
  }
  // Une réponse illisible compte contre l'essai : positif non vu, négatif signalé à tort (pire cas du pré-enregistrement).
  const vus = positifs.filter((c) => detail[c.id].statut === "vu").length;
  const fp = negatifs.filter((c) => detail[c.id].statut === "faux_signalement").length;
  const fpPortee = negatifs.filter((c) => c.demande_humain && detail[c.id].statut === "faux_signalement").length;
  const negPortee = negatifs.filter((c) => c.demande_humain).length;
  const requis = vusRequis(positifs.length, seuils);
  const rappelOk = vus >= requis;
  const fauxOk = fp <= seuils.faux_signalements_max;
  const chronologieRompue = anomalies.some((a) => /avant le commit/.test(a));
  let verdict;
  if (chronologieRompue) verdict = "INVALIDE_CHRONOLOGIE";
  else if (manquantes || aRejouer) verdict = "INCOMPLET";
  else if (positifs.length < seuils.positifs_minimum) verdict = "NON_CONCLUANT";
  else if (rappelOk && fauxOk) verdict = "TENU";
  else verdict = series.length === 1 ? "AU_DESSUS_DES_SEUILS" : "NON_TENU";
  return {
    version: VERSION, mode: series.length === 1 ? "un_lecteur" : "deux_lecteurs_d_accord",
    cas: cas.length, positifs: positifs.length, negatifs: negatifs.length, reponses_manquantes: manquantes, reponses_a_rejouer: aRejouer,
    positifs_vus: vus, positifs_vus_requis: requis, rappel: positifs.length ? vus / positifs.length : null,
    faux_signalements: fp, faux_signalements_max: seuils.faux_signalements_max,
    faux_signalements_dans_la_portee: fpPortee, negatifs_dans_la_portee: negPortee,
    seuil_rappel_tenu: rappelOk, seuil_faux_tenu: fauxOk, verdict,
    lecture_des_seuils: "mesure d'un essai hors service : la mise en service est une décision humaine, jamais déduite de ce verdict",
    anomalies, detail,
  };
}

export function texteSortie(res) {
  const pct = (x) => (x === null ? "—" : `${Math.round(x * 100)} %`);
  const l = [];
  l.push(`lecteur d'usage de la restitution ${res.version}, ${res.mode === "un_lecteur" ? "un lecteur" : "deux lecteurs d'accord"} — ${res.cas} cas (${res.positifs} positifs, ${res.negatifs} négatifs), ${res.reponses_manquantes} réponse(s) manquante(s)`);
  l.push(`  rappel : ${res.positifs_vus} positif(s) vu(s) sur ${res.positifs} (${pct(res.rappel)}), ${res.positifs_vus_requis} exigés → ${res.seuil_rappel_tenu ? "tenu" : "non tenu"}`);
  l.push(`  faux signalements : ${res.faux_signalements} texte(s) du banc sur ${res.negatifs}, ${res.faux_signalements_max} au plus → ${res.seuil_faux_tenu ? "tenu" : "non tenu"} (dont ${res.faux_signalements_dans_la_portee} sur ${res.negatifs_dans_la_portee} textes qui demandent quelque chose à l'humain)`);
  l.push(`  verdict : ${res.verdict}`);
  l.push(`  ${res.lecture_des_seuils}`);
  for (const a of res.anomalies) l.push(`  anomalie : ${a}`);
  return l.join("\n");
}

// ───────────────────────────── ligne de commande ─────────────────────────────

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const val = (o) => { const i = args.indexOf(o); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null; };
  const vals = (o) => args.reduce((acc, a, i) => (a === o && args[i + 1] ? [...acc, args[i + 1]] : acc), []);
  const manifestePath = val("--manifeste") || cheminManifesteParDefaut();
  const usage = () => { console.error("usage : node compter-lecture-usage.mjs --reponses <dossier> [--reponses <second dossier>] [--manifeste <cas.json>] [--preenregistrement <fichier>] [--rubrique <fichier>] [--json] | --lister | --appel <identifiant> | --enregistrer <identifiant> --dossier <dossier>"); process.exit(2); };
  const preregPath = val("--preenregistrement") || PREENREGISTREMENT;
  if (args.includes("--lister") || args.includes("--appel")) {
    const { manifeste, base, erreurs } = chargerManifeste(manifestePath);
    if (!manifeste) { console.error(erreurs.join("\n")); process.exit(1); }
    if (args.includes("--lister")) { console.log(manifeste.cas.map((c) => c.id).join("\n")); process.exit(0); }
    const id = val("--appel");
    const c = manifeste.cas.find((x) => x.id === id);
    if (!c) { console.error(`cas inconnu : ${id}`); process.exit(2); }
    const consigne = extraireConsigne(readFileSync(val("--rubrique") || RUBRIQUE, "utf8"));
    if (!consigne) { console.error("consigne du lecteur introuvable dans la rubrique"); process.exit(1); }
    process.stdout.write(composerAppel(consigne, texteDuCas(c, base)));
    process.exit(0);
  }
  if (args.includes("--enregistrer")) {
    const id = val("--enregistrer");
    const dossier = val("--dossier");
    if (!id || !dossier) usage();
    const { manifeste, erreurs } = chargerManifeste(manifestePath);
    if (!manifeste) { console.error(erreurs.join("\n")); process.exit(1); }
    if (!manifeste.cas.some((c) => c.id === id)) { console.error(`cas inconnu : ${id}`); process.exit(2); }
    mkdirSync(dossier, { recursive: true });
    const r = enregistrerReponse({ id, dossier, brut: readFileSync(0, "utf8"), modele: val("--modele") });
    if (!r.ecrit) { console.error(`non enregistré : ${r.raison}`); process.exit(1); }
    console.log(r.valide ? `${id} enregistré (essai ${r.essai}), réponse valide` : `${id} enregistré (essai ${r.essai}), réponse illisible : ${r.defauts.join(" ; ")}${r.essai < 2 ? " — à rejouer une fois avec un lecteur neuf" : " — comptée contre l'essai"}`);
    process.exit(0);
  }
  const dossiers = vals("--reponses");
  if (!dossiers.length || dossiers.length > 2) usage();
  let prereg;
  try { prereg = lirePreenregistrement(preregPath); } catch (e) { console.error(`pré-enregistrement illisible : ${e.message}`); process.exit(1); }
  const refus = [];
  const { manifeste, base, erreurs } = chargerManifeste(manifestePath, prereg);
  refus.push(...erreurs);
  const rubriquePath = val("--rubrique") || RUBRIQUE;
  const consigne = existsSync(rubriquePath) ? extraireConsigne(readFileSync(rubriquePath, "utf8")) : null;
  if (!consigne) refus.push("consigne du lecteur introuvable dans la rubrique");
  else if (prereg.empreintes && prereg.empreintes.consigne_lecteur && empreinte(consigne) !== prereg.empreintes.consigne_lecteur) refus.push("consigne du lecteur différente de celle du pré-enregistrement (rubrique modifiée après coup)");
  for (const d of dossiers) if (!existsSync(d)) refus.push(`dossier de réponses introuvable : ${d}`);
  if (refus.length) { console.error("comptage refusé :\n" + refus.map((x) => `  - ${x}`).join("\n")); process.exit(1); }
  const res = compter({ manifeste, base, prereg, series: dossiers.map(lireReponses), avant: dateDeCommit(preregPath) });
  console.log(args.includes("--json") ? JSON.stringify(res, null, 1) : texteSortie(res));
  process.exit(0);
}
