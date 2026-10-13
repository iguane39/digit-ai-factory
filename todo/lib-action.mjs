/**
 * lib-action.mjs — statut en clair et ACTION attendue d'un sujet du registre (R16, 13/10/2026).
 *
 * Demande humaine du 13/10/2026 : « Revois le format du tableau TODO avec statut : en cours,
 * décidé… + une colonne action : attente produit, décision humaine… ». Le statut garde sa machine
 * (R5 d'oracle-todo) ; l'action dit QUI doit agir. Elle se lit dans le champ `attente`, exigé par
 * R16 sur un sujet en cours. Sinon elle se DÉDUIT : un candidat attend la décision humaine
 * (gouvernance du registre), un sujet décidé attend la session, un sujet clos n'attend plus rien.
 *
 * Source unique des libellés pour les deux vues (generer-vue.mjs, generer-page.mjs) et du
 * vocabulaire pour l'oracle : une valeur ajoutée ici est connue partout à la fois.
 */
export const ATTENTES = ["session", "produit", "produit_absent", "autre_poste", "decision_humaine",
  "geste_humain", "echeance", "dependance"];

export const LIBELLE_STATUT = { candidat: "candidat", decide: "décidé", en_cours: "en cours",
  corrige: "corrigé", ecarte: "écarté", archive: "archivé" };

export const LIBELLE_ACTION = { session: "travail de la session", produit: "attente produit",
  produit_absent: "attente produit absent du poste", autre_poste: "attente autre poste",
  decision_humaine: "décision humaine", geste_humain: "geste humain", echeance: "attente échéance",
  dependance: "attente d'un autre sujet", aucune: "aucune", non_dite: "non dite" };

const CLOS = new Set(["corrige", "ecarte", "archive"]);

/** La clé d'action d'un sujet replié (tous ses événements fusionnés). */
export function actionDe(e) {
  if (CLOS.has(e.statut)) return "aucune";
  if (e.attente) return e.attente;
  if (e.statut === "candidat") return "decision_humaine";
  // Un sujet décidé attend, sauf attente déclarée, que la session ouvre ses travaux : c'est le
  // sens même de la décision. L'exiger écrit ferait refuser chaque décision appliquée par
  // appliquer-export.mjs (mesuré le 13/10/2026 : 2 cas de la recette du registre au rouge).
  if (e.statut === "decide") return "session";
  return "non_dite";
}

/** Le libellé d'action, complément compris (date d'échéance, sujet attendu). */
export function libelleAction(e) {
  const k = actionDe(e);
  const base = LIBELLE_ACTION[k] || k;
  if (k === "echeance" && e.attente_jusqu_au) return `${base} (${e.attente_jusqu_au})`;
  if (k === "dependance" && e.attente_de) return `${base} (${e.attente_de})`;
  return base;
}
