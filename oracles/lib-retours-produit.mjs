/**
 * lib-retours-produit.mjs — CE QUE LE PRODUIT DOIT SAVOIR DE SES LOTS DE RETOURS, À SON OUVERTURE.
 *
 * TF-1758 (15/10/2026, lot Produit-64 20261015e, RT-63) — UN LOT ÉCRIT ET JAMAIS REMIS SE NOMME. Mesuré le
 * 15/10 : quatre lots réels au statut `a_remettre` chez trois produits, de 17 à 50 jours, absents du pilot ;
 * aucun contrôle ne lisait ce statut, la boîte du pilot (B8, B9) ne voit que ce qui lui est arrivé.
 * `lotsARemettre` relève, sous `forge\retours\`, les lots au statut `a_remettre` depuis plus de 24 h et dit
 * pour chacun s'il est PARVENU au pilot (statut simplement non mis à jour) ou JAMAIS parvenu.
 *
 * TF-1760 (15/10/2026, même lot, RT-65) — LE PRODUIT APPREND CE QUE SONT DEVENUS SES RETOURS. `vosRetours`
 * relit le registre du pilot (`todo\TODO.jsonl`) et rend les TF dont le demandeur ou la source désigne ce
 * produit, comptés par statut, avec ceux clos depuis l'ouverture précédente.
 *
 * LES NOMS. Le registre public porte des PSEUDONYMES ; le produit connaît son nom réel. Le pseudonyme se
 * retrouve par la table du canal confidentiel (`todo\anonymiser-entrant.mjs`, tables résolues par
 * `scripts\lib-confidentiel.mjs`), à partir du dossier du produit et du préfixe de ses lots, en LECTURE
 * seule : rien n'est inscrit. Seuls sont rendus le pseudonyme de CE produit, les identifiants TF, leurs
 * statuts et leurs titres tels que le registre public les porte : aucun autre nom n'est dépseudonymisé.
 * Tables absentes : le préfixe brut seul est cherché (un produit de l'écosystème garde son nom), et le dit.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";

const NOM_DE_LOT = /^(.*) - RETOURS - (\d{8})([a-z]?)\.md$/i;
const STATUT_A_REMETTRE = /^\s*-\s*\*\*Statut\*\*\s*:\s*a_remettre\b/im;
export const SEUIL_H = 24;
const STATUTS_CLOS = new Set(["corrige", "ecarte", "clos"]);

async function anonymiseur(pilot) {
  try {
    const { anonymiser } = await import(pathToFileURL(join(pilot, "todo", "anonymiser-entrant.mjs")).href);
    // Deux passes, comme scripts/lib-pseudonyme-produit.mjs : une clé qui porte déjà le pseudonyme d'un
    // client ne se rejoint qu'après la substitution du client. Lève si une table manque.
    return (t) => anonymiser(anonymiser(t).texte).texte;
  } catch { return null; }
}

/** Ce que le pilot a reçu : noms présents dans sa boîte (et `old\`, sas) et fichiers ingérés. Lu une fois par processus. */
const ETATS = new Map();
function etatDuPilot(pilot) {
  if (ETATS.has(pilot)) return ETATS.get(pilot);
  const boite = pilot ? join(pilot, "input", "00-retours") : null;
  const presents = new Set();
  // `old\` se lit avec ses sous-dossiers : la boîte classe ses lots ingérés par émetteur depuis le
  // 16/10/2026 (`scripts\ranger-dossiers.mjs`) ; lu à plat, tout lot classé passerait pour jamais parvenu.
  const old = boite ? join(boite, "old") : null;
  const sousOld = [];
  try { for (const e of readdirSync(old, { withFileTypes: true })) if (e.isDirectory()) sousOld.push(join(old, e.name)); } catch { /* pas d'old */ }
  if (boite && existsSync(boite)) for (const d of [boite, old, ...sousOld, join(boite, "_arrivee")]) {
    try { for (const n of readdirSync(d)) presents.add(n.toLowerCase()); } catch { /* dossier absent */ }
  }
  let ingeres = null;
  try {
    ingeres = new Set(readFileSync(join(pilot, "todo", "TODO.jsonl"), "utf8").split("\n")
      .filter((l) => l.includes('"ev":"ingestion"'))
      .map((l) => { try { return basename(String(JSON.parse(l).fichier || "").replaceAll("\\", "/")).toLowerCase(); } catch { return ""; } }));
  } catch { /* registre hors de portée */ }
  const e = { presents, ingeres };
  ETATS.set(pilot, e);
  return e;
}

/** Les lots du produit (nom, préfixe, date) sous `forge\retours\`. */
function lotsDuProduit(produit) {
  const d = join(produit, "forge", "retours");
  if (!existsSync(d)) return [];
  return readdirSync(d).map((n) => ({ n, m: NOM_DE_LOT.exec(n) })).filter((x) => x.m)
    .map(({ n, m }) => ({ nom: n, chemin: join(d, n), prefixe: m[1], date: m[2], indice: m[3] }));
}

/** Les pseudonymes sous lesquels le registre public désigne ce produit (jamais un autre nom). */
export async function pseudonymesDuProduit(produit, pilot) {
  const anon = await anonymiseur(pilot);
  const bruts = [...new Set([basename(produit), ...lotsDuProduit(produit).map((l) => l.prefixe)])];
  const pseudos = new Set();
  let tables = !!anon;
  for (const b of bruts) {
    if (!anon) { pseudos.add(b); continue; }
    try {
      const p = anon(b);
      const m = String(p).match(/Produit-\d{2,}/);
      if (m) pseudos.add(m[0]);
      else if (p === b) pseudos.add(b); // nom public (produit de l'écosystème) : il garde son nom au registre
    } catch { tables = false; pseudos.add(b); }
  }
  return { pseudos: [...pseudos], tables, anon };
}

/**
 * TF-1758 — les lots `a_remettre` depuis plus de `seuilH` heures. L'âge part de la plus RÉCENTE des deux
 * dates, celle du nom et celle de la dernière écriture : un lot écrit ou repris dans les 24 h n'est pas
 * un oubli. `parvenu` : sa copie est au pilot (boîte, `old\`, sas, ou un événement d'ingestion) — le statut
 * n'a alors simplement pas été mis à jour ; `false` : jamais parvenu ; `null` : pilot illisible.
 */
export async function lotsARemettre(produit, pilot, { maintenant = Date.now(), seuilH = SEUIL_H, anon: anonFourni } = {}) {
  const anon = anonFourni !== undefined ? anonFourni : await anonymiseur(pilot);
  const boite = pilot ? join(pilot, "input", "00-retours") : null;
  const { presents, ingeres } = etatDuPilot(pilot);
  const sortie = [];
  for (const l of lotsDuProduit(produit)) {
    let texte = "";
    try { texte = readFileSync(l.chemin, "utf8"); } catch { continue; }
    if (!STATUT_A_REMETTRE.test(texte)) continue;
    const dNom = new Date(+l.date.slice(0, 4), +l.date.slice(4, 6) - 1, +l.date.slice(6, 8)).getTime();
    const dEcrit = statSync(l.chemin).mtimeMs;
    const age = (maintenant - Math.max(dNom, dEcrit)) / 3600000;
    if (age <= seuilH) continue;
    let pseudo = null;
    try { pseudo = anon ? anon(l.nom) : null; } catch { pseudo = null; }
    const noms = [l.nom, pseudo].filter(Boolean).map((x) => x.toLowerCase());
    const parvenu = !boite || !existsSync(boite) ? null
      : noms.some((x) => presents.has(x) || (ingeres && ingeres.has(x.replace(/\.md$/, ".tf.jsonl"))));
    sortie.push({ nom: l.nom, jours: Math.floor(age / 24), parvenu });
  }
  return sortie.sort((a, b) => b.jours - a.jours);
}

/**
 * TF-1760 — les TF du registre qui désignent ce produit : demandeur égal à l'un de ses pseudonymes, ou
 * source qui cite « <pseudonyme> - RETOURS ». `depuis` (ISO) : rend aussi ceux passés à un statut clos
 * (corrige, ecarte) après cet instant.
 */
export function vosRetours(pseudos, pilot, { depuis = null } = {}) {
  let brut;
  try { brut = readFileSync(join(pilot, "todo", "TODO.jsonl"), "utf8"); } catch { return null; }
  const echap = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const reSource = pseudos.length ? new RegExp(`(^|[^\\w-])(${pseudos.map(echap).join("|")}) - RETOURS\\b`, "i") : null;
  const etat = new Map();
  for (const l of brut.split("\n")) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (!e.id) continue;
    if (e.ev === "creation") {
      const sien = pseudos.includes(String(e.demandeur || "")) || (reSource && reSource.test(String(e.source || "")));
      if (sien) etat.set(e.id, { id: e.id, titre: e.titre, statut: e.statut || "candidat", clos_le: null });
    } else if (e.ev === "maj" && etat.has(e.id) && e.statut) {
      const x = etat.get(e.id);
      x.statut = e.statut;
      x.clos_le = STATUTS_CLOS.has(e.statut) ? (e.ts || null) : null;
    }
  }
  const tous = [...etat.values()];
  const parStatut = {};
  for (const x of tous) parStatut[x.statut] = (parStatut[x.statut] || 0) + 1;
  const closDepuis = depuis ? tous.filter((x) => x.clos_le && x.clos_le > depuis).sort((a, b) => (a.clos_le < b.clos_le ? 1 : -1)) : [];
  return { total: tous.length, parStatut, closDepuis };
}
