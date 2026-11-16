/**
 * lib-echeances-planificateur.mjs — UNE ÉCHÉANCE AJOUTÉE ENTRE DEUX TOURS A UN TOUR AVANT SON HEURE (TF-2609, RP-28).
 *
 * LE FAIT. Le 12/11/2026, chez Produit-79, la tâche d'un planificateur hébergé (Railway) planifie 7 jours à chaque
 * tour, avec un filet à 7h07 et 8h07 UTC. Une semaine programmée à 12h32 n'avait aucun tour avant le lendemain :
 * l'échéance du soir ne pouvait partir que par un poste ou un runner qui attend. Corrigé au produit par un workflow
 * lancé après chaque programmation. Rien, côté Factory, ne demandait à une chaîne qui ajoute une échéance de dire
 * ce qui la prend en charge avant l'heure.
 *
 * LA RÈGLE. Toute chaîne qui AJOUTE une échéance à un planificateur hébergé déclenche une replanification, ou
 * s'appuie sur un exécutant d'intervalle : une échéance doit avoir au moins un TOUR entre le moment où elle a été
 * ajoutée et son heure. Le contrôle confronte les échéances du jour au RELEVÉ du planificateur, lu à l'API (jamais
 * recopié de mémoire : l'heure d'un tour se lit, elle ne se suppose pas).
 *
 * LE FORMAT (`planificateur.json`, schéma `pilot/planificateur@1`). Tout instant porte son fuseau (`Z` ou `+01:00`) :
 * « 7h07 » sans fuseau a coûté ce retour, et un instant sans fuseau est refusé, jamais deviné.
 *   releve_le, source          quand et comment le relevé a été lu (la source : 10 caractères au moins) ;
 *   tours[]                    instants relevés des prochains tours ;
 *   heures_utc[]               tours quotidiens fixes, « HH:MM » en UTC ;
 *   intervalle_minutes         exécutant d'intervalle : un tour au moins toutes les N minutes ;
 *   replanification_a_l_ajout  vrai quand un déclencheur est lancé après chaque programmation ;
 *   echeances[]                { id, a, ajoutee_le } — l'heure visée et le moment où l'échéance a été ajoutée.
 *
 * LA BORNE, DÉCLARÉE. Un exécutant d'intervalle couvre une échéance dont la fenêtre (de l'ajout à l'heure) dure au
 * moins un intervalle : la phase de ses tours ne se connaît pas, une fenêtre plus courte n'est pas tenue pour couverte.
 * Ce contrôle ne juge pas que le tour fasse effectivement partir le geste, ni la fiabilité du planificateur.
 */

export const SCHEMA_PLANIFICATEUR = "pilot/planificateur@1";
const RE_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;
const RE_HEURE_UTC = /^([01]\d|2[0-3]):[0-5]\d$/;

const instant = (s) => (typeof s === "string" && RE_INSTANT.test(s) ? Date.parse(s) : NaN);
const heure = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 16) + " UTC";

/** Lit et valide un relevé. Rend { releve, erreurs[] } : un relevé illisible ou sans tour ne rend jamais « tenu ». */
export function chargerPlanificateur(brut) {
  let v;
  try { v = JSON.parse(brut); } catch { return { releve: null, erreurs: ["planificateur.json illisible : JSON invalide"] }; }
  const erreurs = [];
  if (!v || v.schema !== SCHEMA_PLANIFICATEUR) erreurs.push(`schéma « ${v && v.schema} » inconnu, ${SCHEMA_PLANIFICATEUR} attendu`);
  if (Number.isNaN(instant(v && v.releve_le))) erreurs.push("`releve_le` absent ou sans fuseau (AAAA-MM-JJThh:mm:ss+01:00 ou Z) : l'heure d'un relevé s'écrit avec son fuseau");
  if (String((v && v.source) || "").trim().length < 10) erreurs.push("`source` absente ou trop courte : dire où le relevé a été lu (API, interface), 10 caractères au moins");
  const tours = Array.isArray(v && v.tours) ? v.tours : [];
  const heuresUtc = Array.isArray(v && v.heures_utc) ? v.heures_utc : [];
  tours.forEach((t) => { if (Number.isNaN(instant(t))) erreurs.push(`tour « ${t} » sans fuseau ou illisible : un instant de tour s'écrit avec son fuseau`); });
  heuresUtc.forEach((h) => { if (typeof h !== "string" || !RE_HEURE_UTC.test(h)) erreurs.push(`heure « ${h} » hors de la forme HH:MM (UTC)`); });
  const inter = v && v.intervalle_minutes;
  if (inter !== undefined && (!Number.isInteger(inter) || inter < 1)) erreurs.push("`intervalle_minutes` : un entier d'au moins 1");
  if (v && v.replanification_a_l_ajout !== undefined && typeof v.replanification_a_l_ajout !== "boolean") erreurs.push("`replanification_a_l_ajout` : vrai ou faux");
  if (v && !tours.length && !heuresUtc.length && inter === undefined && v.replanification_a_l_ajout !== true)
    erreurs.push("aucun tour relevé (`tours`, `heures_utc`, `intervalle_minutes`) et aucune replanification à l'ajout : un planificateur sans tour ne prend rien en charge");
  const echeances = Array.isArray(v && v.echeances) ? v.echeances : [];
  if (!echeances.length) erreurs.push("`echeances` vide : un relevé sans échéance du jour ne contrôle rien");
  echeances.forEach((e, i) => {
    const nom = (e && e.id) || `#${i + 1}`;
    if (!e || !String(e.id || "").trim()) erreurs.push(`échéance #${i + 1} : \`id\` absent`);
    const a = instant(e && e.a), ajout = instant(e && e.ajoutee_le);
    if (Number.isNaN(a)) erreurs.push(`échéance ${nom} : \`a\` absent ou sans fuseau`);
    if (Number.isNaN(ajout)) erreurs.push(`échéance ${nom} : \`ajoutee_le\` absent ou sans fuseau`);
    if (!Number.isNaN(a) && !Number.isNaN(ajout) && ajout > a) erreurs.push(`échéance ${nom} : ajoutée (${e.ajoutee_le}) après son heure (${e.a})`);
  });
  return { releve: erreurs.length ? null : v, erreurs };
}

/** Le premier tour du relevé dans [depuis, jusque] (ms), ou null. `replanification_a_l_ajout` : un tour à l'instant de l'ajout. */
export function tourDansLaFenetre(releve, depuis, jusque) {
  if (releve.replanification_a_l_ajout === true) return depuis;
  const candidats = [];
  for (const t of releve.tours || []) { const m = instant(t); if (m >= depuis && m <= jusque) candidats.push(m); }
  for (const h of releve.heures_utc || []) {
    const [hh, mm] = h.split(":").map(Number);
    for (let jour = Date.UTC(new Date(depuis).getUTCFullYear(), new Date(depuis).getUTCMonth(), new Date(depuis).getUTCDate()); jour <= jusque; jour += 86400000) {
      const m = jour + (hh * 60 + mm) * 60000;
      if (m >= depuis && m <= jusque) candidats.push(m);
    }
  }
  if (releve.intervalle_minutes && jusque - depuis >= releve.intervalle_minutes * 60000) candidats.push(depuis + releve.intervalle_minutes * 60000);
  return candidats.length ? Math.min(...candidats) : null;
}

/** Les échéances qui n'ont aucun tour entre leur ajout et leur heure, chacune avec la phrase qui le dit. */
export function echeancesSansTour(releve) {
  const sans = [];
  for (const e of releve.echeances) {
    const depuis = instant(e.ajoutee_le), a = instant(e.a);
    if (tourDansLaFenetre(releve, depuis, a) !== null) continue;
    const suivants = [];
    for (const t of releve.tours || []) { const m = instant(t); if (m > a) suivants.push(m); }
    sans.push(`${e.id} : échéance du ${heure(a)}, ajoutée le ${heure(depuis)} — aucun tour entre les deux` +
      (suivants.length ? ` (premier tour relevé ensuite : ${heure(Math.min(...suivants))})` : ""));
  }
  return sans;
}
