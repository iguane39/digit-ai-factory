/**
 * lib-sens-rouge.mjs — UNE RECETTE VERTE NE PROUVE RIEN SI ELLE N'A JAMAIS VU LE CONTRÔLE REFUSER
 * (TF-1082, reste du 20/09/2026).
 *
 * ============================================================================================
 * CE QUI EST DÉJÀ FERMÉ, ET CE QUI RESTAIT OUVERT
 * ============================================================================================
 *
 * Le cliquet de `lib-baseline-recettes.mjs` compte les CAS d'une recette et refuse qu'ils
 * disparaissent ; depuis le commit 779e11f il nomme aussi toute recette de la baseline ABSENTE
 * d'un passage, et I5 échoue dessus. Restait la question que ni l'un ni l'autre ne pose :
 * *cette recette a-t-elle seulement vu son contrôle REFUSER quelque chose ?*
 *
 * Une recette qui ne joue que des fixtures conformes est verte pour toujours, y compris le jour
 * où sa règle est neutralisée. C'est le défaut que le gabarit d'agent de campagne nomme
 * « fixtures à double sens » et que ce dépôt exige partout — sans qu'aucun mécanisme ne mesure
 * s'il est tenu.
 *
 * ============================================================================================
 * LA VOIE RETENUE : LIRE LES CAS DÉCLARÉS ROUGES DANS LA SORTIE. ET POURQUOI PAS LA MUTATION
 * ============================================================================================
 *
 * DEUX VOIES ÉTAIENT OUVERTES par l'énoncé — muter le contrôle et vérifier que sa recette vire
 * au rouge, ou lire les cas que la recette DÉCLARE rouges. **La lecture est retenue**, et le
 * motif n'est pas la paresse :
 *
 *   · La mutation demanderait d'ÉCRIRE dans la source de 126 contrôles hétérogènes, de choisir
 *     pour chacun une mutation qui ait un sens (retirer quoi, dans un fichier qu'on ne connaît
 *     pas ?), puis de restaurer — trois modes de défaillance dont chacun laisse le dépôt sale.
 *     Un mécanisme de mesure qui peut corrompre ce qu'il mesure est pire que l'absence de mesure.
 *   · La lecture ne coûte AUCUNE exécution supplémentaire : le harnais tient déjà la sortie de
 *     chaque recette. Et elle est probante, parce qu'elle s'appuie sur une propriété que le
 *     harnais garantit par ailleurs : **un cas ROUGE qui PASSE est un contrôle qui a REFUSÉ**.
 *     La recette n'est lue que si elle a réussi en entier ; donc son cas rouge a été joué, et il
 *     est vert ; donc la fixture fautive a bien été rejetée. C'est exactement « un cas qui doit
 *     échouer, et qui échoue » — du côté de la FIXTURE, qui est le seul côté qui compte.
 *
 * ============================================================================================
 * CE QUE ÇA NE PROUVE PAS, ET C'EST DÉCLARÉ
 * ============================================================================================
 *
 * Le vocabulaire est FERMÉ et écrit ci-dessous. Une recette qui nomme son cas rouge en d'autres
 * mots est comptée « sans cas rouge LISIBLE » — ce qui est un aveu, jamais un verdict sur le
 * contrôle. Et une recette peut mentir : annoncer « deux sens » sans en avoir. Fermer ce trou-là
 * demanderait la mutation, avec son coût ; **la borne est déclarée, pas comblée au juge** — la
 * même phrase, pour la même raison, que le cliquet des cas.
 *
 * C'est pourquoi ce mécanisme entre au harnais en AVERTISSEMENT : il MESURE une couverture et la
 * publie. Le mettre au rouge sur l'existant transformerait une mesure en dette du jour, et un
 * gate qu'on subit avant de l'avoir compris s'apprend à contourner (R-33 bis).
 */

/**
 * Le vocabulaire du SENS ROUGE, fermé et déclaré. Trois familles, toutes observées dans les
 * recettes de ce dépôt :
 *   · l'étiquette d'un cas — « rouge R13 : … », « archive rouge (état vide) », « TF-0923 (a) rouge » ;
 *   · la déclaration de couverture d'une ligne de résumé — « prouvée dans ses DEUX sens »,
 *     « recette à double sens » ;
 *   · l'intention écrite — « doit échouer », « doivent échouer ».
 * `fail`, `échec` et `refusé` sont volontairement ABSENTS : « 0 FAIL » clôt presque tous les
 * résumés du dépôt, et compter ce mot rendrait la mesure vraie par construction.
 */
export const MOTIFS_SENS_ROUGE = [
  { nom: "cas étiqueté rouge", motif: /\brouges?\b/i },
  { nom: "couverture déclarée à double sens", motif: /\b(?:deux|double)\s+sens\b/i },
  { nom: "intention écrite « doit échouer »", motif: /\bdoi(?:t|vent)\s+échouer\b/i },
];

/**
 * Les marques de sens rouge lues dans la sortie d'une recette. Rend la liste des familles
 * reconnues (vide si aucune). La sortie est lue ENTIÈRE : un cas rouge peut vivre sur une ligne
 * de détail comme dans la ligne de résumé, et exiger l'une des deux places ferait sortir de la
 * mesure des recettes qui tiennent le double sens.
 */
export function marquesSensRouge(sortie) {
  const texte = typeof sortie === "string" ? sortie : "";
  return MOTIFS_SENS_ROUGE.filter(({ motif }) => motif.test(texte)).map(({ nom }) => nom);
}

/**
 * Les entrées du harnais qui PORTENT une recette. Les oracles d'état joués sur le parc réel (I4)
 * n'en sont pas : ils rendent « PASS sur le parc », pas des cas — les compter à zéro fabriquerait
 * une dette qui n'existe pas. Une recette EN ÉCHEC n'est pas mesurée non plus : elle a déjà son
 * verdict, et lire une sortie partielle dirait n'importe quoi.
 */
export function porteUneRecette(r) {
  return r.statut === "OK" && !String(r.via || "").startsWith("I4");
}

/**
 * Confronte les résultats d'un passage du harnais. Rend
 * `{ mesurees, avecRouge, sansRouge: [{ nom, via }] }` — la décision d'afficher ou d'échouer
 * appartient à l'appelant, comme pour le cliquet des cas.
 */
export function confronterSensRouge(resultats) {
  const mesurees = (resultats || []).filter(porteUneRecette);
  const sansRouge = [];
  let avecRouge = 0;
  for (const r of mesurees) {
    if (marquesSensRouge(r.sortie).length) avecRouge += 1;
    else sansRouge.push({ nom: r.nom, via: r.via || "-" });
  }
  return { mesurees: mesurees.length, avecRouge, sansRouge };
}
