/**
 * lib-resume-r47.mjs — LE CONSTAT R-47 QUE L'OUVERTURE AFFICHE EST LE PIRE, PAS LE PREMIER (TF-1829).
 *
 * `oracle-conformite-projet` rend PLUSIEURS constats R-47 sur un produit, dans cet ordre : alias de
 * transition périmés, artefacts hors histoire, héritage tenu ou non, secrets sous `forge\`. Le hook
 * d'ouverture lisait le PREMIER : un « sans objet » sur les alias cachait un FAIL d'héritage rendu plus
 * loin. Reproduit le 17/10/2026 sur un parc jetable : l'ouverture disait « sans objet » quand le même
 * relevé portait 5 artefacts absents. Le pire gagne : FAIL, puis SANS_OBJET, puis le premier constat.
 */
export function constatR47(findings) {
  const r47 = (findings || []).filter((x) => x && x.regle === "R-47");
  return r47.find((x) => x.statut === "FAIL") || r47.find((x) => x.statut === "SANS_OBJET") || r47[0] || null;
}
