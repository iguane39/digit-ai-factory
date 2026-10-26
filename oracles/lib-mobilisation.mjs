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
 * Consommateurs : `scripts/verifier-carte-forges.mjs` (le juge de la carte).
 */
import { existsSync, readFileSync } from "node:fs";
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
