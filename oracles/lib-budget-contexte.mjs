/**
 * lib-budget-contexte.mjs — CE QU'UN HOOK INJECTE DANS LE CONTEXTE DE L'ASSISTANT A UN BUDGET, MESURÉ
 * SUR LE HARNAIS EN SERVICE ET DATÉ (TF-1636, 14/10/2026).
 *
 * LE FAIT. Le 13/10, la sortie texte de `hook-ouverture.mjs` faisait 18 949 octets ; le harnais l'a
 * remplacée par un aperçu de 2 Ko, et la section « Gates actifs dans cette session (R-44) », à la
 * ligne 98, n'a jamais atteint l'assistant. Le palliatif (sortie JSON `additionalContext`, hook
 * asynchrone) repoussait la limite sans la mesurer.
 *
 * LA MESURE (14/10/2026, CLI Claude Code 2.1.299, modèle haiku, `claude -p` avec un hook SessionStart
 * qui injecte N caractères portant un marqueur au MILIEU et un à la FIN ; question : recopier les
 * marqueurs sans outil) :
 *   · hook SYNCHRONE, sortie JSON `additionalContext` : 9 791 caractères reçus en entier ; 10 819
 *     remplacés par un aperçu d'environ 2 Ko (l'assistant : « tronqué après environ 2 Ko sur
 *     10,3 Ko ») — la même coupure que la sortie texte ;
 *   · hook ASYNCHRONE, sortie JSON `additionalContext` : 20 485, 40 843 et 81 574 caractères reçus en
 *     entier (les deux marqueurs recopiés, jetons d'entrée croissants : 51 493, 60 538, 78 920).
 *     Le plafond asynchrone n'est donc pas atteint à 81 574 ; il n'est pas mesuré au-delà.
 * Remesure : `node scripts/verifier-ouverture-cli.mjs --plafond` (appel de modèle payant en jetons,
 * jamais joué par le harnais).
 *
 * LE BUDGET. La moitié de ce qui est prouvé, pour garder une marge contre une version du harnais qui
 * resserrerait la limite : 40 000 caractères pour un contexte asynchrone. Au-delà, `borner` garde les
 * lignes de tête (en-tête et règles de session : ce qui conditionne le premier geste), retire les
 * sections entières qui dépassent, en partant de la fin, et le DIT dans le contexte même.
 */
export const PLAFONDS_MESURES = {
  date: "2026-10-14",
  cli: "2.1.299",
  synchrone: { recu_entier: 9791, coupe_a: 10819, apercu_octets: 2048 },
  asynchrone_json: { recu_entier_au_moins: 81574 },
};
export const BUDGET_CONTEXTE_ASYNC = 40000;

/**
 * Borne une liste de lignes à `budget` caractères (lignes jointes par `\n`). Les `garder` premières
 * lignes sont toujours conservées. Le reste est découpé en sections, chacune ouverte par une ligne
 * `## …` ; une section qui ne tient plus est retirée ENTIÈRE avec toutes celles qui la suivent, et
 * une dernière section nomme ce qui a été retiré. Rend `{ lignes, tronque, omises, taille_avant }`.
 */
export function borner(lignes, budget = BUDGET_CONTEXTE_ASYNC, garder = 0, renvoi = "") {
  const taille = (ls) => ls.join("\n").length;
  const taille_avant = taille(lignes);
  if (taille_avant <= budget) return { lignes, tronque: false, omises: [], taille_avant };
  const tete = lignes.slice(0, garder);
  const sections = [];
  for (const l of lignes.slice(garder)) {
    if (/^## /.test(l) || !sections.length) sections.push([l]);
    else sections[sections.length - 1].push(l);
  }
  const reserve = 600;
  const gardees = [...tete];
  const omises = [];
  for (const s of sections) {
    if (!omises.length && taille([...gardees, ...s]) <= budget - reserve) gardees.push(...s);
    else omises.push((s.find((l) => /^## /.test(l)) || s[0] || "(sans titre)").replace(/^## /, "").slice(0, 90));
  }
  gardees.push("", `## Relevé TRONQUÉ par le hook lui-même (TF-1636) : ${taille_avant} caractères pour un budget de ${budget}`,
    `- ${omises.length} section(s) omise(s), dans l'ordre : ${omises.join(" · ")}`,
    `- Rien n'a été perdu en silence : ${renvoi || "le relevé complet se relit en lançant le hook à la main"}.`);
  return { lignes: gardees, tronque: true, omises, taille_avant };
}
