/**
 * lib-mobilisation.mjs — la carte des forges et les verdicts de mobilisation (T4, TF-1949, décisions humaines D-69 (a) et
 * D-79 (c) du 26/10/2026).
 *
 * LE FAIT : sur 10 produits clos ou publiés, 2 portaient leurs 4 livrables de forge ; un produit s'est déclaré complet sans
 * exigences, design ni tests ; sur 7 jours, aucune trace de forge-audit sur une douzaine de demandes d'audit, aucune de
 * forge-data sur les demandes de données (diagnostic 20261026a, section d, T4). Une forge que rien n'oblige à nommer s'oublie.
 *
 * CE MODULE porte la seule lecture de `references/CARTE-FORGES.json` (donnée datée et sourcée, loi n° 4) : la liste fermée des
 * 13 forges, les 7 types de demande de la carte de départ, les forges privilégiées de chacun et les livrables exigés quand une
 * forge est mobilisée. La carte PRIVILÉGIE, elle ne fige pas : chaque forge reçoit un verdict motivé à chaque demande.
 * Consommateurs : `scripts/verifier-carte-forges.mjs` (le juge de la carte) ; `scripts/mobiliser.mjs` (l'écrivain de la trace
 * `forge/mobilisation.jsonl` chez le produit, une ligne par demande, et de la ligne d'écran « Je mobilise : … »).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const CHEMIN_CARTE = join(ICI, "..", "references", "CARTE-FORGES.json");

/** Les 13 forges, liste fermée (consigne de TF-1949) : une forge de plus ou de moins dans la carte est un défaut de la carte. */
export const FORGES = Object.freeze(["conception", "design", "development", "tests", "ops", "agents", "agents-security",
  "seo-geo", "organization", "audit", "data", "observability", "websec"]);

/** Les signaux du profil d'un produit (diagnostic 20261026a, section d, A5). */
export const SIGNAUX_PROFIL = Object.freeze(["domaine_public", "page_indexable", "donnees_personnelles", "agents", "mise_en_production"]);

/** La carte lue, ou { erreur } quand elle est absente ou illisible : une carte manquante ne se devine pas. */
export function lireCarte(chemin = CHEMIN_CARTE) {
  if (!existsSync(chemin)) return { erreur: `carte des forges introuvable : ${chemin}` };
  try { return { carte: JSON.parse(readFileSync(chemin, "utf8").replace(/^﻿/, "")) }; }
  catch (e) { return { erreur: `carte des forges illisible (${chemin}) : ${e.message}` }; }
}

const relatif = (c) => typeof c === "string" && c.trim() !== "" && !/^(?:[a-z]:|[\\/])/i.test(c) && !/(?:^|[\\/])\.\.(?:[\\/]|$)/.test(c);

/**
 * Juge la forme de la carte. Rend une liste de constats { regle, statut, message } ; aucun FAIL = carte conforme.
 *   CF1 daté et sourcé (loi n° 4) : schema, version, date AAAA-MM-JJ, source, règle ;
 *   CF2 les 13 forges, ni plus ni moins, chacune avec son dépôt, son rôle et ses livrables par défaut (ou le motif de n'en avoir aucun) ;
 *   CF3 chaque livrable a un libellé, une source et des chemins RELATIFS au produit ; chaque livrable déclaré sert au moins une fois ;
 *   CF4 chaque type de demande a un identifiant unique, un libellé et des forges privilégiées prises parmi les 13 ; ses livrables
 *       exigés ne visent que ses forges privilégiées et que des livrables déclarés ;
 *   CF5 les signaux de profil d'une forge sont pris dans la liste fermée de SIGNAUX_PROFIL.
 */
export function validerCarte(carte) {
  const constats = [];
  const ko = (regle, message) => constats.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => constats.push({ regle, statut: "PASS", message });
  if (!carte || typeof carte !== "object") { ko("CF1", "la carte n'est pas un objet JSON"); return constats; }

  const manquesCF1 = [];
  if (carte.schema !== "pilot/carte-forges@1") manquesCF1.push(`schema « pilot/carte-forges@1 » (lu : ${JSON.stringify(carte.schema)})`);
  if (!/^\d+\.\d+\.\d+$/.test(String(carte.version || ""))) manquesCF1.push("version semver");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(carte.date || ""))) manquesCF1.push("date AAAA-MM-JJ");
  if (!String(carte.source || "").trim()) manquesCF1.push("source");
  if (!String(carte.regle || "").trim()) manquesCF1.push("règle");
  manquesCF1.length ? ko("CF1", `carte non datée ou non sourcée (loi n° 4) — manque : ${manquesCF1.join(", ")}`)
    : ok("CF1", `carte ${carte.version} du ${carte.date}, sourcée`);

  const livrables = carte.livrables && typeof carte.livrables === "object" ? carte.livrables : {};
  const forges = carte.forges && typeof carte.forges === "object" ? carte.forges : {};
  const enTrop = Object.keys(forges).filter((f) => !FORGES.includes(f));
  const absentes = FORGES.filter((f) => !(f in forges));
  const manquesCF2 = [];
  for (const f of FORGES.filter((x) => x in forges)) {
    const e = forges[f] || {};
    if (!String(e.depot || "").trim()) manquesCF2.push(`${f} : dépôt`);
    if (!String(e.role || "").trim()) manquesCF2.push(`${f} : rôle`);
    if (!Array.isArray(e.livrables)) manquesCF2.push(`${f} : liste de livrables`);
    else if (!e.livrables.length && !String(e.motif_sans_livrable || "").trim()) manquesCF2.push(`${f} : aucun livrable et aucun motif`);
    for (const id of Array.isArray(e.livrables) ? e.livrables : []) if (!(id in livrables)) manquesCF2.push(`${f} : livrable « ${id} » non déclaré`);
  }
  (enTrop.length || absentes.length || manquesCF2.length)
    ? ko("CF2", [absentes.length && `forge(s) absente(s) : ${absentes.join(", ")}`, enTrop.length && `forge(s) hors des 13 : ${enTrop.join(", ")}`,
      manquesCF2.length && manquesCF2.join(" ; ")].filter(Boolean).join(" — "))
    : ok("CF2", "les 13 forges, chacune avec son dépôt, son rôle et ses livrables");

  const types = Array.isArray(carte.types) ? carte.types : [];
  const utilises = new Set(Object.values(forges).flatMap((e) => (Array.isArray(e?.livrables) ? e.livrables : [])));
  const manquesCF4 = [];
  const vus = new Set();
  if (!types.length) manquesCF4.push("aucun type de demande");
  for (const t of types) {
    const id = String(t?.id || "");
    if (!id) { manquesCF4.push("un type sans identifiant"); continue; }
    if (vus.has(id)) manquesCF4.push(`${id} : identifiant en double`);
    vus.add(id);
    if (!String(t.libelle || "").trim()) manquesCF4.push(`${id} : libellé`);
    const priv = Array.isArray(t.forges_privilegiees) ? t.forges_privilegiees : [];
    if (!priv.length) manquesCF4.push(`${id} : aucune forge privilégiée`);
    for (const f of priv) if (!FORGES.includes(f)) manquesCF4.push(`${id} : forge privilégiée inconnue « ${f} »`);
    for (const [f, ids] of Object.entries(t.livrables_exiges || {})) {
      if (!priv.includes(f)) manquesCF4.push(`${id} : livrables exigés pour « ${f} », qui n'est pas privilégiée par ce type`);
      for (const l of Array.isArray(ids) ? ids : [ids]) {
        if (!(l in livrables)) manquesCF4.push(`${id} : livrable « ${l} » non déclaré`);
        utilises.add(l);
      }
    }
  }
  manquesCF4.length ? ko("CF4", manquesCF4.join(" ; ")) : ok("CF4", `${types.length} type(s) de demande, forges privilégiées et livrables exigés cohérents`);

  const manquesCF3 = [];
  for (const [id, l] of Object.entries(livrables)) {
    if (!String(l?.libelle || "").trim()) manquesCF3.push(`${id} : libellé`);
    if (!String(l?.source || "").trim()) manquesCF3.push(`${id} : source`);
    const chemins = Array.isArray(l?.chemins) ? l.chemins : [];
    if (!chemins.length) manquesCF3.push(`${id} : aucun chemin`);
    for (const c of chemins) if (!relatif(c)) manquesCF3.push(`${id} : chemin non relatif au produit « ${c} »`);
    if (!utilises.has(id)) manquesCF3.push(`${id} : déclaré mais exigé nulle part`);
  }
  manquesCF3.length ? ko("CF3", manquesCF3.join(" ; ")) : ok("CF3", `${Object.keys(livrables).length} livrable(s), chacun sourcé, à chemins relatifs, exigé au moins une fois`);

  const manquesCF5 = [];
  for (const [f, e] of Object.entries(forges)) for (const s of Array.isArray(e?.signaux) ? e.signaux : [])
    if (!SIGNAUX_PROFIL.includes(s)) manquesCF5.push(`${f} : signal inconnu « ${s} »`);
  manquesCF5.length ? ko("CF5", manquesCF5.join(" ; ")) : ok("CF5", "signaux de profil pris dans la liste fermée");
  return constats;
}

// ---- LES 13 VERDICTS D'UNE DEMANDE (item 2 de TF-1949) -------------------------------------------------------------------------
// À chaque demande chez un produit, chacune des 13 forges reçoit « mobilisee » ou « ecartee », AVEC son motif : une forge
// mobilisée a aussi le sien, ce qui empêche de tout cocher pour ne rien oublier (diagnostic 20261026a, section d, T4).

export const CHEMIN_TRACE = join("forge", "mobilisation.jsonl");
export const CHEMIN_PROFIL = join("forge", "PROFIL.json");
export const SCHEMA_TRACE = "forge/mobilisation@1";

/** Les types de la carte désignés par leurs identifiants, ou { inconnus } : un type hors de la carte ne se devine pas. */
export function typesDe(carte, ids) {
  const connus = new Map((carte.types || []).map((t) => [t.id, t]));
  const inconnus = ids.filter((id) => !connus.has(id));
  return inconnus.length ? { inconnus, connus: [...connus.keys()] } : { types: ids.map((id) => connus.get(id)) };
}

/** Les forges privilégiées d'une demande : l'union de celles de ses types, dans l'ordre des 13. */
export const privilegiees = (types) => FORGES.filter((f) => types.some((t) => (t.forges_privilegiees || []).includes(f)));

const sansAccent = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
/** « mobilisée », « Mobilisee » → « mobilisee » ; toute autre valeur reste telle quelle et sera refusée. */
export const normaliserVerdict = (v) => { const n = sansAccent(v); return n === "mobilisee" || n === "ecartee" ? n : String(v ?? ""); };

/** Un motif tient s'il dit quelque chose : 3 mots au moins, aucun gabarit « <…> » resté en place. */
const motifVide = (m) => { const t = String(m || "").trim(); return !t || /<[^>]*>/.test(t) || t.split(/\s+/).filter(Boolean).length < 3; };

/** Juge les verdicts d'une demande ; rend la liste des refus (vide = conforme) et les verdicts normalisés. */
export function validerVerdicts(verdicts) {
  const refus = [];
  const v = verdicts && typeof verdicts === "object" ? verdicts : {};
  const inconnues = Object.keys(v).filter((f) => !FORGES.includes(f));
  if (inconnues.length) refus.push(`forge(s) hors des 13 : ${inconnues.join(", ")} (attendu : ${FORGES.join(", ")})`);
  const absentes = FORGES.filter((f) => !(f in v));
  if (absentes.length) refus.push(`${absentes.length} forge(s) sans verdict : ${absentes.join(", ")} — chacune des 13 reçoit « mobilisee » ou « ecartee » avec son motif`);
  const normalises = {};
  for (const f of FORGES.filter((x) => x in v)) {
    const e = v[f] && typeof v[f] === "object" ? v[f] : {};
    const verdict = normaliserVerdict(e.verdict);
    if (verdict !== "mobilisee" && verdict !== "ecartee") refus.push(`${f} : verdict « ${e.verdict ?? ""} » (attendu « mobilisee » ou « ecartee »)`);
    if (motifVide(e.motif)) refus.push(`${f} : motif absent, trop court (3 mots au moins) ou resté au gabarit « <…> » — une forge ${verdict === "mobilisee" ? "mobilisée" : "écartée"} dit pourquoi`);
    normalises[f] = { verdict, motif: String(e.motif || "").trim() };
  }
  return { refus, verdicts: normalises };
}

const court = (s, n = 90) => { const t = String(s).replace(/\s+/g, " ").trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

/** La seule ligne que l'écran montre : les forges mobilisées, puis celles qui sortent de la carte, ajoutées ou écartées, avec leur motif. */
export function ligneEcran(types, verdicts) {
  const priv = privilegiees(types);
  const mobilisees = FORGES.filter((f) => verdicts[f]?.verdict === "mobilisee");
  const ajoutees = mobilisees.filter((f) => !priv.includes(f)).map((f) => `+ ${f} (${court(verdicts[f].motif)})`);
  const ecartees = priv.filter((f) => verdicts[f]?.verdict === "ecartee").map((f) => `− ${f} (${court(verdicts[f].motif)})`);
  const hors = [...ajoutees, ...ecartees];
  return `Je mobilise : ${mobilisees.length ? mobilisees.join(", ") : "aucune forge"} (carte : ${types.map((t) => t.libelle).join(" + ")}).`
    + (hors.length ? ` Hors carte : ${hors.join(" ; ")}.` : "");
}

/** Le squelette à remplir : les forges privilégiées et celles qu'un signal du profil désigne sont proposées mobilisées, les autres
 *  écartées ; chaque motif reste au gabarit « <…> » et l'écrivain le refuse tant qu'il n'est pas écrit. */
export function squelette(carte, types, profil) {
  const priv = privilegiees(types);
  const verdicts = {};
  for (const f of FORGES) {
    const signaux = ((carte.forges || {})[f]?.signaux || []).filter((s) => profil && profil[s] === true);
    verdicts[f] = priv.includes(f)
      ? { verdict: "mobilisee", motif: "<motif : ce que cette forge apporte à la demande, ou passer à « ecartee » en disant pourquoi>" }
      : signaux.length
        ? { verdict: "mobilisee", motif: `<motif : le profil porte ${signaux.join(", ")} ; dire ce que la forge apporte, ou passer à « ecartee » en disant pourquoi>` }
        : { verdict: "ecartee", motif: "<motif : pourquoi cette forge ne sert pas cette demande>" };
  }
  return verdicts;
}

/** « domaine_public=oui,page_indexable=non,… » → { domaine_public: true, … } ; rend { erreur } si un signal manque ou est inconnu. */
export function lireProfilTexte(texte) {
  const profil = {};
  for (const morceau of String(texte || "").split(/[,;]/).map((s) => s.trim()).filter(Boolean)) {
    const [cle, val] = morceau.split("=").map((s) => sansAccent(s));
    if (!SIGNAUX_PROFIL.includes(cle)) return { erreur: `signal de profil inconnu « ${cle} » (attendu : ${SIGNAUX_PROFIL.join(", ")})` };
    if (!["oui", "non", "true", "false"].includes(val)) return { erreur: `${cle} : valeur « ${val ?? ""} » (attendu oui ou non)` };
    profil[cle] = val === "oui" || val === "true";
  }
  const manquants = SIGNAUX_PROFIL.filter((s) => !(s in profil));
  return manquants.length ? { erreur: `signal(aux) de profil non déclaré(s) : ${manquants.join(", ")}` } : { profil };
}

/** Le profil déclaré du produit (forge/PROFIL.json), ou { erreur } : il se déclare une fois, il ne se devine pas. */
export function lireProfil(produit) {
  const chemin = join(produit, CHEMIN_PROFIL);
  if (!existsSync(chemin)) return { erreur: `profil du produit non déclaré (${CHEMIN_PROFIL} absent)` };
  let j;
  try { j = JSON.parse(readFileSync(chemin, "utf8").replace(/^﻿/, "")); } catch (e) { return { erreur: `${CHEMIN_PROFIL} illisible : ${e.message}` }; }
  const signaux = j && typeof j.signaux === "object" ? j.signaux : j;
  const manquants = SIGNAUX_PROFIL.filter((s) => typeof signaux?.[s] !== "boolean");
  return manquants.length ? { erreur: `${CHEMIN_PROFIL} ne déclare pas en oui/non : ${manquants.join(", ")}` }
    : { profil: Object.fromEntries(SIGNAUX_PROFIL.map((s) => [s, signaux[s]])) };
}

/** Déclare (ou revoit) le profil du produit : forge/PROFIL.json, daté. */
export function ecrireProfil(produit, profil, maintenant = new Date()) {
  mkdirSync(join(produit, "forge"), { recursive: true });
  writeFileSync(join(produit, CHEMIN_PROFIL), JSON.stringify({ schema: "forge/profil@1", date: maintenant.toISOString().slice(0, 10),
    source: "déclaré par scripts/mobiliser.mjs --profil (diagnostic 20261026a, section d, A5)", signaux: profil }, null, 2) + "\n", "utf8");
}

/** La ligne de trace d'une demande, prête à être ajoutée à forge/mobilisation.jsonl. */
export function ligneDeTrace({ carte, types, profil, verdicts, demande = null, maintenant = new Date() }) {
  const priv = privilegiees(types);
  return {
    ts: maintenant.toISOString(), schema: SCHEMA_TRACE, demande: demande ? String(demande).trim() : null,
    type: types.map((t) => t.id).join("+"), types: types.map((t) => t.id), profil,
    carte: { version: carte.version, date: carte.date },
    verdicts: Object.fromEntries(FORGES.map((f) => [f, { ...verdicts[f], privilegiee: priv.includes(f) }])),
    mobilisees: FORGES.filter((f) => verdicts[f].verdict === "mobilisee"),
    ligne: ligneEcran(types, verdicts),
  };
}
