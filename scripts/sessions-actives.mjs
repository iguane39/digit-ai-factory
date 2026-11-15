#!/usr/bin/env node
/**
 * sessions-actives.mjs — QUI FAIT QUOI SUR CE PRODUIT, EN UNE COMMANDE (D-218 (b) du 14/11/2026, item I5 du mandat 20261114n,
 * 15/11/2026). C'est la commande unique par laquelle le porteur voit les sessions d'un produit.
 *
 * Elle lit le registre `forge/sessions.jsonl` du produit (arbre principal et arbre de travail courant, `oracles/lib-sessions.mjs`) et
 * rend un tableau : session, état (vivante ou expirée), depuis, rôle, objet, chemins revendiqués. `--json` rend le même contenu en JSON.
 * Une session fermée ne figure pas au tableau : leur nombre se dit sous lui. Lecture seule : rien n'est écrit, aucun verrou n'est pris.
 *
 *   node <pilot>/scripts/sessions-actives.mjs --produit <dossier> [--json]
 *   sans --produit : le produit qui porte le dossier courant.
 * Sortie : 0 = état rendu, registre absent compris (« aucune session inscrite ») ; 2 = usage, ou dossier hors d'un produit.
 */
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { court } from "../oracles/lib-session.mjs";
import { EXPIRATION_MIN, etatDesSessions, lireRegistre, racineDeSession, registreDe, vieDeTranscription } from "../oracles/lib-sessions.mjs";

const MIN = 60_000;

/** L'état des sessions d'un produit, prêt à rendre : { produit, registre, existe, maintenant, coordinatrice, sessions, conflits, fermees,
 *  illisibles } ou { erreur }. `maintenant` et `vieDe` s'injectent pour les essais. */
export function etatDuProduit(dossier, { maintenant = Date.now(), vieDe = vieDeTranscription } = {}) {
  const base = racineDeSession({ depart: resolve(dossier), env: {} });
  const reg = registreDe(base);
  if (!reg.fichier) return { erreur: `${base} n'est pas un produit : aucun dossier forge/, et le registre des sessions vit chez un produit (forge/sessions.jsonl)` };
  const lu = lireRegistre(reg.racines);
  const etat = etatDesSessions(lu.lignes, { maintenant, vieDe });
  const toutes = [...etat.sessions.values()].filter((s) => s.open || s.tient.size);
  const montrees = toutes.filter((s) => !s.fermee).sort((a, b) =>
    (a.vivante === b.vivante ? 0 : a.vivante ? -1 : 1) || ((a.open?.t ?? Infinity) - (b.open?.t ?? Infinity)) || (a.session < b.session ? -1 : 1));
  return {
    produit: reg.principal, registre: reg.fichier, existe: lu.fichiers.length > 0, maintenant: new Date(maintenant).toISOString(),
    expiration_min: EXPIRATION_MIN, coordinatrice: etat.coordinatrice,
    sessions: montrees.map((s) => ({
      session: s.session, court: court(s.session), etat: s.vivante ? "vivante" : "expirée",
      depuis: s.open?.ts ?? null, derniere_vie: s.vie ? new Date(s.vie).toISOString() : null,
      role: s.session === etat.coordinatrice ? "coordinatrice" : null, objet: s.objet ?? null,
      chemins: [...s.tient.values()].map((x) => x.chemin), racine: s.open?.racine ?? null, poste: s.open?.poste ?? null,
    })),
    conflits: etat.conflits, fermees: toutes.filter((s) => s.fermee).length, illisibles: lu.illisibles,
  };
}

const cellule = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const borne = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
function quand(iso, maintenant) {
  if (!iso) return "—";
  const d = new Date(iso), m = new Date(maintenant);
  const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return d.toDateString() === m.toDateString() ? hm : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${hm}`;
}

/** Le tableau lisible de `etatDuProduit`. */
export function tableau(e) {
  const t = Date.parse(e.maintenant);
  if (!e.existe) return `Aucune session inscrite : ${e.registre} est absent. Il naît à l'ouverture de la première session dont le produit porte le hook « sessions » (gabarits/settings-produit.json).`;
  const lignes = ["| Session | État | Depuis | Rôle | Objet | Chemins revendiqués |", "|---|---|---|---|---|---|"];
  for (const s of e.sessions) {
    const il = s.derniere_vie ? Math.max(0, Math.round((t - Date.parse(s.derniere_vie)) / MIN)) : null;
    const etat = s.etat === "vivante" ? "vivante" : `expirée${il !== null ? ` (dernière preuve de vie il y a ${il} min)` : ""}`;
    const chemins = s.chemins.length ? borne(s.chemins.slice(0, 5).join(", ") + (s.chemins.length > 5 ? `, +${s.chemins.length - 5}` : ""), 160) : "—";
    const objet = borne(String(s.objet ?? "").replace(/\s+/g, " ").trim() || "objet non déclaré", 70);   // coupé d'abord, échappé une fois
    lignes.push(`| ${s.court} | ${etat} | ${quand(s.depuis, t)} | ${s.role || "—"} | ${cellule(objet)} | ${cellule(chemins)} |`);
  }
  if (!e.sessions.length) lignes.push("| — | aucune session ouverte | — | — | — | — |");
  const pied = [
    `Coordinatrice : ${e.coordinatrice ? court(e.coordinatrice) : "aucune (aucune session vivante)"}. Une session est expirée ${e.expiration_min} minutes après sa dernière preuve de vie.`,
    e.conflits.length ? `Conflits : ${e.conflits.map((c) => `${c.chemin} tenu par ${c.sessions.map(court).join(" et ")}`).join(" ; ")}.` : "Conflits : aucun.",
    `${e.fermees} session(s) fermée(s) non montrée(s).${e.illisibles ? ` ${e.illisibles} ligne(s) illisible(s) ignorée(s).` : ""} Registre : ${e.registre}.`,
  ];
  return [...lignes, "", ...pied].join("\n");
}

export function executer(argv, { sortie = (x) => process.stdout.write(x), erreur = (x) => process.stderr.write(x), maintenant = Date.now() } = {}) {
  let produit = null, json = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--json") json = true;
    else if (argv[i] === "--produit" && i + 1 < argv.length) produit = argv[++i];
    else if (argv[i] === "--aide" || argv[i] === "--help") { sortie("node <pilot>/scripts/sessions-actives.mjs --produit <dossier> [--json]\n"); return 0; }
    else { erreur(`option inconnue ou sans valeur : ${argv[i]} — usage : --produit <dossier> [--json]\n`); return 2; }
  }
  const e = etatDuProduit(produit || process.cwd(), { maintenant });
  if (e.erreur) { erreur(`${e.erreur}\n`); return 2; }
  sortie(json ? JSON.stringify(e, null, 1) + "\n" : tableau(e) + "\n");
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  process.exit(executer(process.argv.slice(2)));
}
