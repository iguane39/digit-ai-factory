#!/usr/bin/env node
/**
 * oracle-tableau-de-bord-pilotage — UNE PAGE DE LA FAMILLE gd-tableau-de-bord-pilotage TIENT LA FORME
 * QUE LE TABLEAU DE BORD REFAIT PAR LE PRODUIT A VALIDÉE.
 *
 * LE FAIT (lot Produit-79 20261017c, RP-15 et RA-11 ; étude d'opportunité 20261018a, option O4,
 * décision humaine D-31 (a) du 18/10/2026, TF-1855). Un tableau de bord vert à tous les contrôles du
 * socle et de forge-design a été refusé en bloc le 17/10/2026 : pas de filtre de période, pas de choix
 * de l'objet, aucun graphique interprété, des tableaux sans total ni part. Le produit l'a refait sans
 * gabarit, en 5 versions et 2 042 lignes de génération. La famille porte la forme de la refonte, et
 * cet oracle la juge, sur les marqueurs que le squelette pose.
 *
 * CE QU'IL JUGE, SUR LE FICHIER (règles TB, bloquantes sauf TB8) :
 *   TB0 · la page se déclare (`data-tableau-de-bord="pilotage"`) ; sans déclaration ni couple de
 *         gabarit, elle n'est pas de la famille et l'oracle rend SANS_OBJET ;
 *   TB1 · les commandes globales existent : période (préréglage, de, à), comparaison, objet (dès que
 *         les données déclarent deux objets), réinitialisation, et le bandeau qui les dit ;
 *   TB2 · la cascade ISTO structure la page : chaque chapitre porte `data-isto` dans le vocabulaire
 *         fermé, les quatre niveaux sont présents, dans l'ordre, les annexes après ;
 *   TB3 · chaque tableau dit s'il découpe un total : `data-partition="oui"` porte une ligne de total
 *         et une colonne de part, `data-partition="non"` porte son motif écrit ;
 *   TB4 · un entonnoir est dessiné, déclaré dans les données, d'au moins trois étapes ;
 *   TB5 · les objectifs ont une échéance et une formule : départ sur une période déclarée, sens,
 *         taux par échéance, et le tableau qui les rend avec sa colonne de calcul ;
 *   TB6 · la comparaison à la même période un an plus tôt est offerte ;
 *   TB7 · les données se lisent et se tiennent : schéma, mois contigus, séries à la longueur des
 *         mois, chaque liaison de la page vers une entrée existante, et la mention « données
 *         fictives » affichée si, et seulement si, les données se déclarent fictives ;
 *   TB8 · AVERTISSEMENT : chaque graphique a l'emplacement de son bloc de lecture, à cinq rubriques.
 *         La règle de lecture (TF-1856) n'est pas écrite : cette famille n'en fait pas un blocage ;
 *   TB9 · le moteur de la famille est embarqué, versionné.
 * ET DANS CHROMIUM (règles TBI, `tableau-de-bord-pilotage-interactions.py`) : chaque chiffre affiché
 * se recompte depuis les données de la page, à chaque état rejoué des commandes. Sans python ni
 * playwright, le contrôle le dit (SKIP motivé), il ne conclut pas.
 *
 * CE QU'IL NE JUGE PAS : la prose d'auteur (cause, fiabilité, action), la vérité des données à leur
 * source, le rendu (render_page.py), et les pages qui ne se déclarent pas de la famille.
 *
 * Recette à double sens : `node oracles\oracle-tableau-de-bord-pilotage.mjs --self-test` (la verte est
 * l'INSTANCE de la famille, chaque rouge une mutation de cette instance qui doit échouer).
 *
 * Usage : node oracles\oracle-tableau-de-bord-pilotage.mjs <page.html> [--statique] [--json-only]
 * Exit : 0 PASS (avertissements admis) · 1 FAIL · 2 SANS_OBJET (page hors famille) ou usage.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const VERSION = "1.0.0";
const SCHEMA = "pilot/tableau-de-bord-pilotage@1";
const FAMILLE = join(PILOT, "gabarits", "documents", "tableau-de-bord-pilotage");
const AIDE = join(ICI, "tableau-de-bord-pilotage-interactions.py");
const NIVEAUX = ["intention", "strategie", "tactique", "operation", "annexe"];
const RUBRIQUES = ["ce qui s'est passé", "pourquoi", "fiabilité", "verdict", "à faire"];

const sansCommentaires = (html) => html.replace(/<!--[\s\S]*?-->/g, " ");
const sansScripts = (html) => html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
const normal = (s) => String(s).replace(/[\u00a0\u202f]/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/[’]/g, "'");

/** Les attributs d'une balise ouvrante, en objet (valeur vide pour un attribut nu). */
export function attributs(chaine) {
  const a = {};
  for (const m of chaine.matchAll(/([A-Za-z_:][-\w:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    a[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return a;
}

/** Les balises ouvrantes d'un nom, avec leurs attributs et leur position. */
function balises(html, nom) {
  return [...html.matchAll(new RegExp(`<${nom}\\b([^>]*)>`, "gi"))].map((m) => ({ attrs: attributs(m[1]), index: m.index, fin: m.index + m[0].length }));
}

const texteDe = (fragment) => normal(fragment.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&"));

/** Les données déclarées de la page, ou l'erreur qui les rend illisibles. */
export function lireDonnees(html) {
  const m = /<script\b(?=[^>]*\bid\s*=\s*["']tdb-donnees["'])[^>]*>([\s\S]*?)<\/script>/i.exec(html);
  if (!m) return { erreur: "aucun bloc de données « tdb-donnees » (script de type application/json)" };
  try { return { donnees: JSON.parse(m[1]) }; } catch (e) { return { erreur: `bloc « tdb-donnees » illisible : ${e.message}` }; }
}

/** Le bloc du moteur de la famille : { version, corps } ou null. */
export function lireMoteur(html) {
  const m = /<script\b(?=[^>]*\bdata-moteur\s*=\s*["']gd-tableau-de-bord-pilotage["'])([^>]*)>([\s\S]*?)<\/script>/i.exec(html);
  if (!m) return null;
  return { version: attributs(m[1])["data-version"] || "", corps: m[2].replace(/\r\n/g, "\n").trim() };
}

const moisSuivant = (m) => { const i = Number(m.slice(0, 4)) * 12 + Number(m.slice(5, 7)); return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, "0")}`; };

/** Les règles TB sur le TEXTE d'une page. Fonction pure : la recette la joue sur des chaînes. */
export function jugerStatique(source, ou = "page") {
  const f = [];
  const ok = (regle, message) => f.push({ regle, statut: "PASS", ou, message });
  const ko = (regle, message) => f.push({ regle, statut: "FAIL", ou, message });
  const averti = (regle, message) => f.push({ regle, statut: "AVERTISSEMENT", ou, message });
  const brut = sansCommentaires(source);
  const html = sansScripts(brut);

  // TB0 — la déclaration
  const corps = balises(html, "body")[0];
  const declare = [...balises(html, "html"), ...balises(html, "body"), ...balises(html, "main")]
    .some((b) => b.attrs["data-tableau-de-bord"] === "pilotage");
  const couple = /gabarit\s*:\s*gd-tableau-de-bord-pilotage/i.test(texteDe(html));
  if (!declare && !couple) {
    return [{ regle: "TB0", statut: "SANS_OBJET", ou, message: "page hors famille : ni `data-tableau-de-bord=\"pilotage\"` ni le couple « Gabarit : gd-tableau-de-bord-pilotage » — rien n'est jugé" }];
  }
  if (!declare) ko("TB0", "la page porte le gabarit gd-tableau-de-bord-pilotage mais ne se déclare pas : poser `data-tableau-de-bord=\"pilotage\"` sur <body>, le marqueur que le squelette porte et que la règle de lecture (TF-1856) lira");
  else ok("TB0", "page déclarée de la famille (data-tableau-de-bord=\"pilotage\")");
  if (corps && corps.attrs["data-page"] !== "donnees") averti("TB0", "la page ne se déclare pas page de données (`data-page=\"donnees\"` sur <body>) : le socle la jugera comme une page de prose");

  const { donnees: D, erreur } = lireDonnees(brut);

  // TB1 — les commandes globales
  const commandes = new Set(balises(html, "[a-z]+").map((b) => b.attrs["data-commande"]).filter(Boolean));
  const objets = D && Array.isArray(D.objets) ? D.objets : [];
  const dues = ["periode", "de", "a", "comparaison", "reinitialiser", ...(objets.length >= 2 ? ["objet"] : [])];
  const manquent = dues.filter((c) => !commandes.has(c));
  const bandeau = /\bdata-periode-lib\b/.test(html);
  const choix = balises(html, "button").filter((b) => "data-tdb-objet" in b.attrs).map((b) => b.attrs["data-tdb-objet"]);
  const objetsManquants = objets.length >= 2 ? ["tout", ...objets.map((o) => o.id)].filter((id) => !choix.includes(id)) : [];
  if (manquent.length || !bandeau || objetsManquants.length) {
    ko("TB1", [manquent.length && `commande(s) globale(s) absente(s) : ${manquent.map((c) => `data-commande="${c}"`).join(", ")}`,
      !bandeau && "aucun bandeau `data-periode-lib` qui dise la période, la comparaison et l'objet lus",
      objetsManquants.length && `choix d'objet sans bouton pour : ${objetsManquants.join(", ")}`].filter(Boolean).join(" ; ") +
      " — le refus du 17/10/2026 portait d'abord sur l'absence de filtre de période et de choix de l'objet");
  } else ok("TB1", `commandes globales présentes (${dues.join(", ")}) et bandeau de lecture`);

  // TB2 — la cascade ISTO
  const chapitres = balises(html, "section").filter((b) => (b.attrs.class || "").split(/\s+/).includes("chap"));
  if (!chapitres.length) ko("TB2", "aucun chapitre (`section.chap`) : la cascade ISTO n'a rien à structurer");
  else {
    const sans = chapitres.filter((c) => !NIVEAUX.includes(c.attrs["data-isto"]));
    const niveaux = chapitres.map((c) => c.attrs["data-isto"]).filter((n) => NIVEAUX.includes(n));
    const absents = NIVEAUX.slice(0, 4).filter((n) => !niveaux.includes(n));
    const rangs = niveaux.map((n) => NIVEAUX.indexOf(n));
    const desordre = rangs.findIndex((r, i) => i > 0 && r < rangs[i - 1]);
    const ecarts = [sans.length && `${sans.length} chapitre(s) sans \`data-isto\` du vocabulaire fermé (${NIVEAUX.join(", ")}) : ${sans.map((c) => c.attrs.id || "?").join(", ")}`,
      absents.length && `niveau(x) absent(s) : ${absents.join(", ")}`,
      desordre > 0 && `ordre rompu : « ${niveaux[desordre]} » après « ${niveaux[desordre - 1]} » (la descente va de l'intention à l'opération, les annexes ferment)`].filter(Boolean);
    if (ecarts.length) ko("TB2", ecarts.join(" ; ") + " — references\\INTENTION.md (ISTO)");
    else ok("TB2", `${chapitres.length} chapitre(s), les quatre niveaux ISTO présents et dans l'ordre`);
  }

  // TB3 — total et part, ou motif déclaré
  const tables = [...html.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi)].map((m) => ({ attrs: attributs(m[1]), corps: m[2] }));
  if (!tables.length) averti("TB3", "aucun tableau : rien à juger pour le total et la part");
  const ecartsTables = [];
  let partitions = 0, exceptions = 0;
  tables.forEach((t, i) => {
    const nom = (/<caption\b[^>]*>([\s\S]*?)<\/caption>/i.exec(t.corps) || [, `tableau ${i + 1}`])[1].replace(/<[^>]+>/g, "").trim().slice(0, 60);
    const p = t.attrs["data-partition"];
    if (p === "oui") {
      partitions++;
      const ths = balises(t.corps, "th").map((b) => b.attrs);
      const part = ths.some((a) => a["data-colonne"] === "part" || /^part(:|$)/.test(a["data-tdb-col"] || ""));
      if (!/<tfoot\b/i.test(t.corps)) ecartsTables.push(`« ${nom} » découpe un total sans ligne de total (tfoot)`);
      if (!part) ecartsTables.push(`« ${nom} » découpe un total sans colonne de part (th data-colonne="part")`);
    } else if (p === "non") {
      exceptions++;
      if ((t.attrs["data-partition-motif"] || "").trim().length < 8) ecartsTables.push(`« ${nom} » se déclare hors partition sans motif écrit (data-partition-motif, 8 caractères au moins)`);
    } else ecartsTables.push(`« ${nom} » ne dit pas s'il découpe un total (data-partition="oui" ou "non")`);
  });
  if (ecartsTables.length) ko("TB3", ecartsTables.join(" ; ") + " — un tableau qui découpe un total porte sa ligne de total et sa colonne de part ; une exception se déclare, elle ne se tait pas");
  else if (tables.length) ok("TB3", `${partitions} tableau(x) de partition avec total et part, ${exceptions} exception(s) déclarée(s) avec motif`);

  // TB4 — l'entonnoir
  const figures = balises(html, "figure").filter((b) => "data-tdb-graphe" in b.attrs);
  const entonnoirs = figures.filter((b) => b.attrs["data-tdb-graphe"] === "entonnoir");
  if (!entonnoirs.length) ko("TB4", "aucun entonnoir dessiné (figure data-tdb-graphe=\"entonnoir\") : le parcours de la première visite au résultat ne se lit pas");
  else {
    const mauvais = entonnoirs.filter((e) => !D || !D.entonnoirs || !D.entonnoirs[e.attrs["data-tdb-entonnoir"]]
      || (D.entonnoirs[e.attrs["data-tdb-entonnoir"]].etapes || []).length < 3);
    if (mauvais.length) ko("TB4", `entonnoir non déclaré dans les données ou de moins de trois étapes : ${mauvais.map((e) => e.attrs["data-tdb-entonnoir"] || "?").join(", ")}`);
    else ok("TB4", `${entonnoirs.length} entonnoir(s) déclaré(s), trois étapes au moins`);
  }

  // TB5 — les objectifs à échéance, avec leur formule
  const tableObjectifs = tables.find((t) => t.attrs["data-tdb-tableau"] === "objectifs");
  const objectifs = D && Array.isArray(D.objectifs) ? D.objectifs : [];
  const ecartsObj = [];
  if (!objectifs.length) ecartsObj.push("aucun objectif déclaré dans les données");
  for (const o of objectifs) {
    const qui = `objectif « ${o.id || "?"} »`;
    if (!D.indicateurs || !D.indicateurs[o.indicateur]) ecartsObj.push(`${qui} : indicateur « ${o.indicateur} » absent des données`);
    if (!o.depart || !(D.mois || []).includes(o.depart.de) || !(D.mois || []).includes(o.depart.a)) ecartsObj.push(`${qui} : période de départ absente ou hors des mois déclarés`);
    if (!["hausse", "baisse"].includes(o.sens)) ecartsObj.push(`${qui} : sens « ${o.sens} » hors du vocabulaire (hausse, baisse)`);
    if (!Array.isArray(o.echeances) || !o.echeances.length) ecartsObj.push(`${qui} : aucune échéance`);
    for (const e of o.echeances || []) {
      if (!/^\d{4}-\d{2}$/.test(e.a || "") || !(typeof e.taux === "number" && e.taux > 0 && e.taux <= 1)) ecartsObj.push(`${qui} : échéance sans mois (AAAA-MM) ou sans taux dans ]0, 1]`);
    }
  }
  if (!tableObjectifs) ecartsObj.push("aucun tableau des objectifs (table data-tdb-tableau=\"objectifs\")");
  else {
    const cols = balises(tableObjectifs.corps, "th").map((b) => b.attrs["data-tdb-col"]);
    const colsManquantes = ["depart", "echeance", "objectif", "calcul"].filter((c) => !cols.includes(c));
    if (colsManquantes.length) ecartsObj.push(`tableau des objectifs sans colonne(s) ${colsManquantes.join(", ")} : un objectif se lit avec son départ, son échéance et sa formule`);
  }
  if (ecartsObj.length) ko("TB5", ecartsObj.join(" ; "));
  else ok("TB5", `${objectifs.length} objectif(s), ${objectifs.reduce((n, o) => n + o.echeances.length, 0)} échéance(s), départ déclaré et formule rendue`);

  // TB6 — la comparaison à un an
  const selectCmp = /<select\b(?=[^>]*\bdata-commande\s*=\s*["']comparaison["'])[^>]*>([\s\S]*?)<\/select>/i.exec(html);
  if (!selectCmp || !/<option\b[^>]*\bvalue\s*=\s*["']un-an["']/i.test(selectCmp[1])) {
    ko("TB6", "la comparaison à la même période un an plus tôt n'est pas offerte (option value=\"un-an\" de la commande comparaison)");
  } else ok("TB6", "comparaison à la même période un an plus tôt offerte");

  // TB7 — les données se lisent et se tiennent
  if (!D) ko("TB7", erreur);
  else {
    const e7 = [];
    if (D.schema !== SCHEMA) e7.push(`schéma « ${D.schema} » au lieu de « ${SCHEMA} »`);
    const mois = Array.isArray(D.mois) ? D.mois : [];
    if (!mois.length) e7.push("aucun mois déclaré");
    for (let i = 1; i < mois.length; i++) if (moisSuivant(mois[i - 1]) !== mois[i]) { e7.push(`mois non contigus : ${mois[i - 1]} puis ${mois[i]}`); break; }
    const ids = { serie: new Set(Object.keys(D.series || {})), indicateur: new Set(Object.keys(D.indicateurs || {})), entonnoir: new Set(Object.keys(D.entonnoirs || {})) };
    for (const [id, s] of Object.entries(D.series || {})) {
      const blocs = s.partition ? Object.values(s.valeurs || {}) : [s.valeurs || {}];
      if (s.partition && !(D.partitions || {})[s.partition]) e7.push(`série « ${id} » : partition « ${s.partition} » non déclarée`);
      for (const b of blocs) for (const [o, t] of Object.entries(b || {})) if (!Array.isArray(t) || t.length !== mois.length) { e7.push(`série « ${id} », objet « ${o} » : ${Array.isArray(t) ? t.length : 0} valeur(s) pour ${mois.length} mois`); break; }
    }
    for (const [id, ind] of Object.entries(D.indicateurs || {})) {
      if (ind.ratio) { for (const r of ind.ratio) if (!ids.indicateur.has(r)) e7.push(`indicateur « ${id} » : ratio vers « ${r} », absent`); }
      else if (!ids.serie.has(ind.serie)) e7.push(`indicateur « ${id} » : série « ${ind.serie} » absente`);
    }
    const liens = [
      ...balises(html, "article").filter((b) => "data-tdb-indicateur" in b.attrs).map((b) => ["indicateur", b.attrs["data-tdb-indicateur"], "tuile"]),
      ...balises(html, "div").filter((b) => "data-lecture-de" in b.attrs && "data-tdb-indicateur" in b.attrs).map((b) => ["indicateur", b.attrs["data-tdb-indicateur"], "bloc de lecture"]),
      ...balises(html, "data").filter((b) => "data-tdb-valeur" in b.attrs).map((b) => ["indicateur", b.attrs["data-tdb-valeur"], "valeur en ligne"]),
      ...figures.filter((b) => "data-tdb-serie" in b.attrs).map((b) => ["serie", b.attrs["data-tdb-serie"], "graphique"]),
      ...entonnoirs.map((b) => ["entonnoir", b.attrs["data-tdb-entonnoir"], "graphique"]),
      ...tables.filter((t) => "data-tdb-serie" in t.attrs).map((t) => ["serie", t.attrs["data-tdb-serie"], "tableau"]),
      ...tables.filter((t) => "data-tdb-entonnoir" in t.attrs).map((t) => ["entonnoir", t.attrs["data-tdb-entonnoir"], "tableau"]),
    ];
    const casses = liens.filter(([type, id]) => !ids[type].has(id));
    if (casses.length) e7.push(`${casses.length} liaison(s) vers une entrée absente des données : ${casses.slice(0, 4).map(([t, id, q]) => `${q} → ${t} « ${id} »`).join(", ")}`);
    const banniere = /\bdata-donnees-fictives\b/.test(html);
    if (D.donnees_fictives === true && !banniere) e7.push("les données se déclarent fictives et la page ne l'affiche pas (élément data-donnees-fictives) : une démonstration se lirait comme un relevé");
    if (D.donnees_fictives !== true && banniere) e7.push("la page affiche « données fictives » alors que ses données ne se déclarent pas fictives");
    if (e7.length) ko("TB7", e7.join(" ; "));
    else ok("TB7", `données lisibles (${mois.length} mois contigus, ${ids.serie.size} séries, ${ids.indicateur.size} indicateurs), ${liens.length} liaison(s) résolue(s)` +
      (D.donnees_fictives === true ? ", données déclarées fictives et affichées comme telles" : ""));
  }

  // TB8 — l'emplacement du bloc de lecture par graphique (AVERTISSEMENT seulement)
  const sansBloc = [];
  for (const fig of figures) {
    const id = fig.attrs.id;
    const debut = id ? html.search(new RegExp(`data-lecture-de\\s*=\\s*["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`)) : -1;
    if (debut < 0) { sansBloc.push(`« ${id || "?"} » sans bloc de lecture`); continue; }
    const fin = html.indexOf("</dl>", debut);
    const dts = [...html.slice(debut, fin < 0 ? undefined : fin).matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>/gi)].map((m) => texteDe(m[1]));
    const manque = RUBRIQUES.filter((r) => !dts.includes(r));
    if (manque.length) sansBloc.push(`« ${id} » : rubrique(s) ${manque.join(", ")} absente(s)`);
  }
  if (sansBloc.length) averti("TB8", `${sansBloc.length} graphique(s) sur ${figures.length} sans bloc de lecture complet : ${sansBloc.slice(0, 4).join(" ; ")} — avertissement seulement, la règle de lecture (TF-1856) attend sa mesure`);
  else if (figures.length) ok("TB8", `${figures.length} graphique(s), chacun avec son bloc de lecture à cinq rubriques`);

  // TB9 — le moteur
  const moteur = lireMoteur(brut);
  if (!moteur) ko("TB9", "le moteur de la famille n'est pas embarqué (script data-moteur=\"gd-tableau-de-bord-pilotage\") : aucune commande ne recalculera la page");
  else if (!/^\d+\.\d+\.\d+$/.test(moteur.version)) ko("TB9", "le moteur embarqué ne porte pas sa version (data-version=\"x.y.z\")");
  else ok("TB9", `moteur de la famille embarqué, version ${moteur.version}`);
  return f;
}

const PYTHON = () => ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
}) || null;

/** Les règles TBI, dans Chromium, par le script compagnon. { findings, motif } ; motif dit un SKIP. */
export function jugerInteractions(chemin, python = PYTHON()) {
  if (!python) return { findings: [], motif: "aucun interpréteur python sur ce poste : les règles TBI n'ont PAS tourné" };
  if (!existsSync(AIDE)) return { findings: [], motif: `${AIDE} absent : les règles TBI n'ont PAS tourné` };
  const r = spawnSync(python, ["-X", "utf8", AIDE, chemin], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" } });
  let j = null;
  try { j = JSON.parse((r.stdout || "").trim().split(/\r?\n/).pop()); } catch { /* traité ci-dessous */ }
  if (!j) return { findings: [], motif: `contrôle d'interactions illisible (exit ${r.status}) : ${(r.stderr || "").split("\n").filter(Boolean).pop() || "aucune sortie"}` };
  if (j.verdict === "SKIP") return { findings: [], motif: j.motif || "contrôle d'interactions non joué" };
  return { findings: j.findings || [] };
}

export function juger(chemin, { statique = false } = {}) {
  const source = readFileSync(chemin, "utf8");
  const findings = jugerStatique(source);
  if (findings.length === 1 && findings[0].statut === "SANS_OBJET") return { verdict: "SANS_OBJET", findings, nonJoue: null };
  let nonJoue = statique ? "--statique demandé : les règles TBI n'ont pas été jouées" : null;
  if (!statique) {
    const i = jugerInteractions(chemin);
    findings.push(...i.findings);
    if (i.motif) { nonJoue = i.motif; findings.push({ regle: "TBI", statut: "SKIP", ou: "Chromium", message: i.motif }); }
  }
  const verdict = findings.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS";
  return { verdict, findings, nonJoue };
}

const NON_JUGE = [
  "la PROSE d'auteur des blocs de lecture (pourquoi, fiabilité, à faire) : présence des rubriques seulement, et en avertissement (TB8) — la règle de lecture (TF-1856) n'est pas écrite",
  "la granularité de la lecture (un bloc par graphique ET par tableau, ou par chapitre) : question ouverte de l'étude 20261018a (H4), à trancher avant TF-1856",
  "la VÉRITÉ des données à leur source : le recalcul (TBI) part du bloc « tdb-donnees » de la page",
  "le RENDU : render_page.py et check_html.py du socle digit-ai-page-html, aux largeurs du socle, dans les deux thèmes, et la critique run-oracles-design de forge-design",
  "les pages qui ne se déclarent pas de la famille : SANS_OBJET (TB0) — la garde générale des pages de pilotage est l'étape 2 de l'option O4",
];

const args = process.argv.slice(2);

if (args[0] === "--self-test") {
  const casse = [];
  let cas = 0;
  const instance = join(FAMILLE, "INSTANCE.html");
  const squelette = join(FAMILLE, "SQUELETTE.html");
  if (!existsSync(instance)) { console.log(`SELF-TEST FAIL : instance de la famille introuvable (${instance})`); process.exit(1); }
  // Fins de ligne ramenées à LF : le dépôt extrait en CRLF sur un poste Windows, et les mutations visent
  // des lignes du moteur ; une recette qui dépend de l'extraction mesurerait le poste, pas la règle.
  const verte = readFileSync(instance, "utf8").replace(/\r\n/g, "\n");
  const regles = (fs) => Object.fromEntries(["TB0", "TB1", "TB2", "TB3", "TB4", "TB5", "TB6", "TB7", "TB8", "TB9"].map((r) => [r, fs.filter((x) => x.regle === r).map((x) => x.statut)]));
  const attendre = (nom, condition, detail) => { cas++; if (!condition) casse.push(`${nom}${detail ? ` — ${detail}` : ""}`); };
  const muter = (texte, avant, apres) => {
    if (!texte.includes(avant)) throw new Error(`mutation impossible, motif absent de l'instance : « ${avant.slice(0, 60)} »`);
    return texte.split(avant).join(apres);
  };
  const echoue = (fs, r) => fs.some((x) => x.regle === r && x.statut === "FAIL");

  // VERT — l'instance de la famille passe toutes les règles TB, sans avertissement.
  const fv = jugerStatique(verte, "INSTANCE.html");
  attendre("vert : l'instance passe TB0 à TB9", !fv.some((x) => x.statut === "FAIL" || x.statut === "AVERTISSEMENT"),
    JSON.stringify(fv.filter((x) => x.statut !== "PASS")).slice(0, 300));
  // La forme d'une instance de démonstration : données fictives, déclarées et affichées, aucun pseudonyme de produit.
  const D = lireDonnees(verte).donnees || {};
  attendre("l'instance se déclare fictive", D.donnees_fictives === true && /\bdata-donnees-fictives\b/.test(verte));
  // Hors blocs posés du socle : ce sont des copies SCELLÉES de sa source (TF-0784), commentaires de
  // provenance compris, et les retoucher romprait leur parité.
  const horsSocle = (t) => t.replace(/<!--\s*COMPOSANT-EMBARQUE:DEBUT\s+([\w.-]+)[\s\S]*?<!--\s*COMPOSANT-EMBARQUE:FIN\s+\1\s*-->/g, " ");
  const pseudos = (t) => [...new Set(horsSocle(t).match(/\bProduit-\d+\b/g) || [])];
  attendre("l'instance ne porte aucun nom de produit du parc, hors copies scellées du socle", !pseudos(verte).length, pseudos(verte).join(", "));
  if (existsSync(squelette)) attendre("le squelette non plus", !pseudos(readFileSync(squelette, "utf8")).length, pseudos(readFileSync(squelette, "utf8")).join(", "));
  // Le moteur se corrige dans le squelette et se recopie à l'identique dans l'instance.
  if (existsSync(squelette)) {
    const ms = lireMoteur(readFileSync(squelette, "utf8")), mi = lireMoteur(verte);
    attendre("le moteur de l'instance est la copie exacte de celui du squelette", ms && mi && ms.corps === mi.corps && ms.version === mi.version,
      ms && mi ? `squelette ${ms.version} (${ms.corps.length} car.), instance ${mi.version} (${mi.corps.length} car.)` : "moteur absent");
  } else attendre("le squelette de la famille existe", false, squelette);

  // SANS OBJET — une page qui ne se déclare pas n'est pas jugée (et le rouge TB0 ne naît que du couple).
  const horsFamille = jugerStatique("<!DOCTYPE html><html lang=\"fr\"><body><main><p>Une page.</p></main></body></html>");
  attendre("une page hors famille rend SANS_OBJET, jamais FAIL", horsFamille.length === 1 && horsFamille[0].statut === "SANS_OBJET");

  // ROUGES — chacun ne diffère de la verte que par UNE propriété, et doit échouer pour sa raison.
  const rouges = [
    ["TB0", "rouge : le couple du gabarit sans la déclaration doit échouer", muter(verte, 'data-tableau-de-bord="pilotage"', "")],
    ["TB1", "rouge : sans commande de comparaison, TB1 doit échouer", muter(verte, 'data-commande="comparaison"', 'data-commande-retiree="comparaison"')],
    ["TB1", "rouge : sans choix de l'objet, TB1 doit échouer", muter(verte, 'data-commande="objet"', "")],
    ["TB2", "rouge : sans étage Opération, TB2 doit échouer", muter(verte, 'data-isto="operation"', 'data-isto="tactique"')],
    ["TB2", "rouge : une stratégie après une tactique, TB2 doit échouer", muter(verte, 'id="strategie" data-isto="strategie"', 'id="strategie" data-isto="annexe"')],
    ["TB3", "rouge : une partition sans ligne de total, TB3 doit échouer", muter(verte, '<tfoot><tr><td colspan="5">Total calculé au chargement.</td></tr></tfoot>', "")],
    ["TB3", "rouge : une exception sans motif, TB3 doit échouer", muter(verte, `data-partition-motif="les étapes d'un entonnoir s'emboîtent : chacune est comprise dans la précédente, elles ne s'additionnent pas"`, 'data-partition-motif=""')],
    ["TB3", "rouge : un tableau qui ne dit pas s'il découpe un total, TB3 doit échouer", muter(verte, 'data-tdb-tableau="objets" data-tdb-serie="reservations" data-partition="oui"', 'data-tdb-tableau="objets" data-tdb-serie="reservations"')],
    ["TB4", "rouge : sans entonnoir dessiné, TB4 doit échouer", muter(verte, 'data-tdb-graphe="entonnoir"', 'data-tdb-graphe="mensuel"')],
    ["TB5", "rouge : un objectif sans taux, TB5 doit échouer", muter(verte, '{"a":"2027-03","taux":0.05}', '{"a":"2027-03"}')],
    ["TB5", "rouge : un tableau des objectifs sans colonne de calcul, TB5 doit échouer", muter(verte, 'data-tdb-col="calcul"', 'data-tdb-col="commentaire"')],
    ["TB6", "rouge : sans comparaison à un an, TB6 doit échouer", muter(verte, '<option value="un-an" selected>', '<option value="un-mois" selected>')],
    ["TB7", "rouge : une tuile vers un indicateur absent, TB7 doit échouer", muter(verte, 'data-tdb-indicateur="part_site"', 'data-tdb-indicateur="part_inconnue"')],
    ["TB7", "rouge : des données fictives sans mention affichée, TB7 doit échouer", muter(verte, "data-donnees-fictives", "data-mention-retiree")],
    ["TB7", "rouge : un bloc de données illisible, TB7 doit échouer", muter(verte, '"schema":"pilot/tableau-de-bord-pilotage@1"', '"schema":"pilot/tableau-de-bord-pilotage@1",,')],
    ["TB9", "rouge : sans le moteur embarqué, TB9 doit échouer", muter(verte, 'data-moteur="gd-tableau-de-bord-pilotage"', 'data-moteur="autre"')],
  ];
  for (const [regle, nom, page] of rouges) {
    const fr = jugerStatique(page, "mutation");
    attendre(nom, echoue(fr, regle), JSON.stringify(regles(fr)[regle]));
  }
  // TB8, ses deux sens : un bloc de lecture retiré AVERTIT et ne fait jamais échouer.
  const sansLecture = muter(verte, 'data-lecture-de="g-visites"', 'data-lecture-retiree="g-visites"');
  const f8 = jugerStatique(sansLecture, "mutation");
  attendre("rouge averti : un graphique sans bloc de lecture rend AVERTISSEMENT TB8", f8.some((x) => x.regle === "TB8" && x.statut === "AVERTISSEMENT"));
  attendre("TB8 ne bloque pas : la même page n'a aucun FAIL", !f8.some((x) => x.statut === "FAIL"), JSON.stringify(f8.filter((x) => x.statut === "FAIL")).slice(0, 200));

  // TBI — les règles d'interactions, dans Chromium : la verte, puis cinq rouges qui doivent échouer.
  const python = PYTHON();
  const sonde = python ? spawnSync(python, ["-X", "utf8", "-c", "import playwright"], { encoding: "utf8" }) : null;
  const ROUGES_TBI = 6;
  if (!python || !sonde || sonde.status !== 0) {
    console.log(`[NON JOUÉ] ${ROUGES_TBI + 1} cas — règles TBI : ${!python ? "aucun interpréteur python" : "module playwright absent"} sur ce poste, le recalcul dans Chromium n'est pas joué`);
  } else {
    const dir = mkdtempSync(join(tmpdir(), "tdb-pilotage-"));
    const jouer = (nom, html) => { const p = join(dir, `${nom}.html`); writeFileSync(p, html, "utf8"); return jugerInteractions(p, python); };
    const iv = jouer("verte", verte);
    attendre("vert : l'instance passe TBI1 à TBI6 dans Chromium", !iv.motif && iv.findings.length > 0 && !iv.findings.some((x) => x.statut === "FAIL"),
      iv.motif || JSON.stringify(iv.findings.filter((x) => x.statut === "FAIL")).slice(0, 300));
    const tbi = [
      ["TBI1", "rouge : une somme qui oublie le dernier mois doit échouer TBI1", muter(verte, "for (var i = i0; i <= i1; i++) {\n      res.attendus += 1;", "for (var i = i0; i < i1; i++) {\n      res.attendus += 1;")],
      ["TBI2", "rouge : une ligne de total fausse d'une unité doit échouer TBI2", muter(verte, "var v = l ? val(l, c.serie, etat.de, etat.a) : tp[c.serie];", "var v = l ? val(l, c.serie, etat.de, etat.a) : tp[c.serie] + 1;")],
      ["TBI3", "rouge : une étape d'entonnoir plus grande que la précédente doit échouer TBI3", muter(verte, '"court":"Demandes","indicateur":"demandes"', '"court":"Demandes","indicateur":"visites"')],
      ["TBI4", "rouge : un choix d'objet qui ne masque rien doit échouer TBI4", muter(verte, "s.hidden = !(etat.objet === 'tout' || liste.indexOf(etat.objet) >= 0);", "s.hidden = false;")],
      ["TBI5", "rouge : un objectif qui double le taux doit échouer TBI5", muter(verte, "var facteur = o.sens === 'baisse' ? 1 - ech.taux : 1 + ech.taux;", "var facteur = o.sens === 'baisse' ? 1 - ech.taux : 1 + 2 * ech.taux;")],
      ["TBI6", "rouge : une erreur JavaScript doit échouer TBI6", muter(verte, "    rendreBandeau(cmp);\n", "    rendreBandeau(cmp);\n    if (etat.objet === 'nord') throw new Error('panne simulée');\n")],
    ];
    for (const [regle, nom, page] of tbi) {
      const r = jouer(regle, page);
      attendre(nom, !r.motif && r.findings.some((x) => x.regle === regle && x.statut === "FAIL"), r.motif || JSON.stringify(r.findings.filter((x) => x.statut === "FAIL").map((x) => x.regle)));
    }
    rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  }

  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : `Self-test tableau-de-bord-pilotage : ${cas}/${cas} PASS (double sens : l'instance de la famille est la verte, et passe TB0 à TB9 ; chaque règle TB a son rouge, une mutation d'une seule propriété de l'instance qui doit échouer pour sa raison ; ` +
      "TB8 dans ses deux sens, un bloc de lecture retiré avertit et ne bloque jamais ; une page hors famille rend SANS_OBJET ; l'instance se déclare fictive, et ni elle ni le squelette ne portent de pseudonyme de produit hors copies scellées du socle ; son moteur est la copie exacte de celui du squelette ; " +
      "dans Chromium, l'instance passe TBI1 à TBI6 et six rouges échouent : somme amputée du dernier mois, total faux d'une unité, entonnoir non emboîté, objet qui ne masque rien, objectif au taux doublé, erreur JavaScript)");
  process.exit(casse.length ? 1 : 0);
}

const cible = args.find((a) => !a.startsWith("--"));
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-tableau-de-bord-pilotage", version: VERSION, verdict: "ERREUR",
    message: "usage : node oracles\\oracle-tableau-de-bord-pilotage.mjs <page.html> [--statique] [--json-only]" }, null, 1));
  process.exit(2);
}
const r = juger(cible, { statique: args.includes("--statique") });
console.log(JSON.stringify({
  oracle: "oracle-tableau-de-bord-pilotage", version: VERSION, artefact: cible, verdict: r.verdict, findings: r.findings,
  non_juge: [...(r.nonJoue ? [`les règles TBI (recalcul dans Chromium) : ${r.nonJoue}`] : []), ...NON_JUGE],
}, null, args.includes("--json-only") ? 0 : 1));
process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
