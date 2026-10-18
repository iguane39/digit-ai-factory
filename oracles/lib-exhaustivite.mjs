/**
 * lib-exhaustivite.mjs — UNE AFFIRMATION D'EXHAUSTIVITÉ PORTE SA LIGNE « Mesuré sur » (TF-1866, 18/10/2026).
 *
 * LE FAIT, retour Produit-02 RT-126 (lot 20261015a) : à la question « Est-ce que le reste du site a été mis à
 * jour ? », une session répond « Oui » et dépose une restitution PASS « tout le site en ligne est à jour »,
 * sur un balayage de 273 pages qui ne cherchait que les anciennes formulations qu'elle avait elle-même
 * listées. La source de vérité avait changé le même jour : l'ancienne société restait nommée sur environ
 * 290 pages. Le juge de restitution jugeait la FORME ; la liste de contrôle était celle de l'auteur.
 *
 * LA DÉCISION HUMAINE (D-29 (a), 18/10/2026), mot pour mot : « Dire "mesuré sur" pas "mesuré contre" ». Toute
 * affirmation d'exhaustivité porte donc une ligne
 *   Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments>
 * et le contrôle de restitution refuse l'affirmation qui n'en porte pas. La formule « Mesuré contre » est
 * REFUSÉE : l'humain a choisi le mot, et deux formules ne se cherchent pas par la même commande.
 *
 * CE QUI EST UNE AFFIRMATION D'EXHAUSTIVITÉ (relevé sur le corpus réel avant d'être écrit — voir le gabarit
 * RESTITUTION.md 2.47.0) : une proposition de l'auteur qui dit qu'un ENSEMBLE est complet ou à jour.
 *   · totalité + état : « tout le site est à jour », « toutes les pages sont migrées », « tout est traité » ;
 *   · adverbe de totalité + état : « entièrement à jour », « intégralement couvert » ;
 *   · « rien oublié », « aucun oubli », « rien ne manque », « plus rien à corriger » ;
 *   · « complet » / « exhaustif » dit d'une COLLECTION (inventaire, liste, balayage, import, couverture…).
 * Une proposition niée (« tout n'est pas à jour »), conditionnelle (« pour que tout soit à jour »), citée
 * entre guillemets français (la demande de l'humain), en bloc de citation (une décision posée), dans un bloc de
 * code ou sur une ligne d'option d'un tableau (une hypothèse) n'est pas une affirmation de l'auteur.
 *
 * CE QUI N'EST PAS JUGÉ (dit, non tu) : que la source nommée soit vraiment une source de vérité hors de
 * l'auteur — seules les formes qui disent la liste de l'auteur (« ma liste », « les marqueurs », « les
 * anciennes formulations que j'ai listées ») sont refusées ; que la ligne couvre CETTE affirmation-ci ; que
 * l'heure soit vraie ; que le périmètre soit le bon.
 */

const CLASSE_ETAT = "(?:à jour|mis(?:e|es)? à jour|aligné(?:e|s|es)?|synchronisé(?:e|s|es)?|migré(?:e|s|es)?|traité(?:e|s|es)?|corrigé(?:e|s|es)?|couvert(?:e|s|es)?|appliqué(?:e|s|es)?|propagé(?:e|s|es)?)";
// « tout geste », « tous deux », « presque tout » ne sont pas la totalité d'un ensemble : « tout » seul exige un déterminant ou un verbe d'état.
const TOTALITE = "(?:tout (?:le|la|l['’]|ce|cela|ceci|ça)|toute (?:la|l['’]|cette)|tous (?:les|ces|mes|ses|nos|vos|leurs|ceux)|toutes (?:les|ces|mes|ses|nos|vos|leurs|celles)|l['’]ensemble|le reste|la totalité|l['’]intégralité|tout(?= (?:est|a été|était|sera|reste)))";
const ETRE = "(?:est|sont|a été|ont été|était|étaient|reste|restent|demeure|demeurent|sera|seront)";
const ADV = "(?:bien |désormais |maintenant |à présent |déjà |entièrement |intégralement |complètement |totalement |pleinement |parfaitement )*";
const COLLECTIONS = "(?:inventaire|liste|recensement|relevé|import|migration|couverture|balayage|parc|site|base|registre|corpus|traçabilité|balisage|jeu|ensemble|référentiel|propagation|passage|revue|audit|catalogue|index|sitemap|périmètre)";
const COMPLET = "(?:complet|complète|complets|complètes|exhaustif|exhaustive|exhaustifs|exhaustives)";

// Chaque motif porte un nom : il sert au message du refus et à la mesure.
export const MOTIFS = [
  // L'écart entre la totalité et le verbe d'état ne franchit ni virgule ni deux-points : « Tous ses contrôles passent, et la pastille est alignée » n'est pas une totalité.
  { nom: "totalité + état", re: new RegExp(`(?<![\\p{L}\\p{N}])${TOTALITE}(?![\\p{L}\\p{N}])[^.\\n|;!?,:]{0,80}?(?<![\\p{L}\\p{N}])${ETRE}\\s+${ADV}${CLASSE_ETAT}(?![\\p{L}\\p{N}])`, "iu") },
  { nom: "adverbe de totalité + état", re: new RegExp(`(?<![\\p{L}\\p{N}])(?:entièrement|intégralement|totalement|complètement)\\s+${CLASSE_ETAT}(?![\\p{L}\\p{N}])`, "iu") },
  { nom: "rien oublié", negatif: true, re: /(?<![\p{L}\p{N}])(?:rien n['’](?:a|est) (?:été )?(?:oublié|omis|manqué)|rien n['’](?:a|est) (?:été )?laissé de côté|n['’]a rien (?:oublié|omis)|rien ne manque|aucun oubli|plus rien à (?:traiter|corriger|mettre à jour|migrer))(?![\p{L}\p{N}])/iu },
  { nom: "collection complète", re: new RegExp(`(?<![\\p{L}\\p{N}])${COLLECTIONS}(?![\\p{L}\\p{N}])[^.\\n|;!?,:]{0,60}?(?<![\\p{L}\\p{N}])${ETRE}\\s+${ADV}${COMPLET}(?![\\p{L}\\p{N}])`, "iu") },
  { nom: "exhaustif", re: /(?<![\p{L}\p{N}])(?:(?:est|sont|reste|demeure)\s+(?:bien |désormais |maintenant )*exhaustif(?:s|ve|ves)?|de (?:manière|façon) exhaustive|exhaustivement|liste exhaustive|inventaire exhaustif|recensement exhaustif|balayage exhaustif)(?![\p{L}\p{N}])/iu },
];

const NEGATION = /(?<![\p{L}\p{N}])(?:ne|n['’]|pas|jamais|non|ni|sans|aucun|aucune|plus)(?![\p{L}\p{N}])|\bn['’]/iu;
const CONDITION = /(?<![\p{L}\p{N}])(?:si|pour que|afin que|tant que|jusqu['’]à ce qu|presque|quasi|quasiment|pratiquement|en grande partie|dès que|lorsque|quand|à condition que|pourvu que|faut-il que|il faut que|doit-il|doivent-ils|sera-t-il|a-t-il été|est-il|sont-ils|est-elle|sont-elles)(?![\p{L}\p{N}])/iu;
// Un contrôle ou une règle qui DIT ce qu'il juge (« contrôle qu'un jeu de livrables est complet ») décrit une exigence, il n'affirme rien.
// Le texte d'une règle citée (« à la règle N-8 (un jeu de livrables est complet… ») est de même nature.
const DECRIT_UNE_EXIGENCE = /(?:(?:contrôle|contrôlent|exige|exigent|impose|imposent|prescrit)\s+qu(?:e|['’])\s*(?:un|une|le|la|les|l['’]|des)?|r[èe]gles?\s+[\p{L}]+-?\d*\s*\(\s*(?:un|une|le|la|les|l['’]|des)?)\s*$/iu;

/** Le texte sans ce qui n'est pas la voix de l'auteur : code, citations « … », blocs de citation, options d'un tableau. */
export function voixDeLAuteur(texte) {
  const lignes = String(texte || "").replace(/\r\n/g, "\n").split("\n");
  const gardees = [];
  let code = false;
  for (const l of lignes) {
    if (/^\s*(```|~~~)/.test(l)) { code = !code; continue; }
    if (code) continue;
    if (/^\s*>/.test(l)) continue;                                   // une décision posée (bloc de citation)
    if (/^\s*\|\s*\*{0,2}\(?[a-e]\)?\*{0,2}\s*\|/i.test(l)) continue; // « | (a) | … » : l'option d'un tableau, une hypothèse
    if (/^\s*\|\s*Option\s*\|/i.test(l)) continue;
    gardees.push(l.replace(/«[^»\n]*»/g, " ").replace(/"[^"\n]{3,}"/g, " ").replace(/`[^`\n]*`/g, " "));
  }
  return gardees.join("\n");
}

/** Les affirmations d'exhaustivité de l'auteur : [{ motif, extrait }] — voir l'en-tête pour ce qui n'en est pas une. */
export function affirmationsDExhaustivite(texte) {
  const trouvees = [];
  for (const ligne of voixDeLAuteur(texte).split("\n")) {
    if (/mesur[ée]e?s?\s+(?:sur|contre)\b/i.test(ligne)) continue;     // la ligne de mesure n'est pas une affirmation
    // Une proposition à la fois : on découpe sur « . », « ; » et sur la flèche des écarts.
    for (const prop of ligne.split(/(?<=[.!?;])\s+|\s+→\s+|\s+—\s+/u)) {
      for (const m of MOTIFS) {
        const r = m.re.exec(prop);
        if (!r || (m.filtre && !m.filtre(r))) continue;
        const avant = prop.slice(0, r.index);
        // Une négation avant ou dans l'affirmation (sauf les formes qui sont négatives par nature), une condition avant elle :
        // ce n'est pas une affirmation de l'auteur.
        // (« Il n'y a aucun oubli » : le « n' » qui précède fait partie de la formule négative, il ne la nie pas.)
        if (CONDITION.test(avant) || (!m.negatif && NEGATION.test(avant.slice(-30))) || DECRIT_UNE_EXIGENCE.test(avant.slice(-40))) continue;
        if (!m.negatif && NEGATION.test(r[0])) continue;
        trouvees.push({ motif: m.nom, extrait: prop.trim().slice(0, 160) });
        break;
      }
    }
  }
  return trouvees;
}

// ---- LA LIGNE « Mesuré sur : <source>, relue à HH:MM, périmètre <n …> » ------------------------------------

const LIGNE_MESURE = /^[\s>*•-]*\**\s*Mesur[ée]e?s?\s+(sur|contre)\s*\**\s*:?\s*\**\s*(.+)$/imu;
// La source d'une mesure n'est pas la liste de l'auteur : ces formes disent « la liste que j'ai écrite ».
const SOURCE_DE_L_AUTEUR = /(?<![\p{L}\p{N}])(?:ma|mes|ma propre|mon|mes propres) (?:liste|listes|grille|grilles|marqueurs?|motifs?|termes?|patterns?|recherche|balayage|contrôle)(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])(?:liste|grille) de (?:contrôle|vérification|marqueurs|mots|termes|motifs)(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])marqueurs?(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])(?:anciennes? (?:formulations?|mentions?|valeurs?|versions? des mots))(?![\p{L}\p{N}])|(?:que|qu['’])\s*(?:j['’]ai|la session a|l['’]auteur a|nous avons)\s+(?:moi-même |elle-même |lui-même )?(?:écrit|listé|choisi|établi|rédigé|dressé)|(?:écrite?s?|listée?s?|établie?s?|dressée?s?) par (?:moi|la session|l['’]auteur|l['’]agent)/iu;

/**
 * Les lignes « Mesuré sur » d'un texte, chacune jugée :
 *   { ligne, valide, raison } — raison vide quand valide.
 */
export function lignesMesure(texte) {
  const sorties = [];
  for (const l of String(texte || "").replace(/\r\n/g, "\n").split("\n")) {
    const m = LIGNE_MESURE.exec(l);
    if (!m) continue;
    const ligne = l.trim().replace(/\s+/g, " ").slice(0, 220);
    if (/^contre$/i.test(m[1])) { sorties.push({ ligne, valide: false, raison: "la formule est « Mesuré sur », pas « Mesuré contre » (décision humaine D-29 (a) du 18/10/2026)" }); continue; }
    const f = /^(?<source>.+?)\s*[,;]\s*relu(?:e|es|s)?\s+(?:le\s+[\d/.-]+\s+)?à\s+(?<h>\d{1,2}\s*(?::|h)\s*\d{2})\s*[,;]\s*p[ée]rim[èe]tre\s*:?\s*(?<per>.+)$/iu.exec(m[2].replace(/\*+/g, "").trim());
    if (!f) { sorties.push({ ligne, valide: false, raison: "la forme attendue est « Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments> » — source, heure de relecture et périmètre, dans cet ordre" }); continue; }
    const source = f.groups.source.trim();
    if (source.length < 6) { sorties.push({ ligne, valide: false, raison: "la source de vérité est vide ou trop courte pour être retrouvée" }); continue; }
    if (SOURCE_DE_L_AUTEUR.test(source)) { sorties.push({ ligne, valide: false, raison: `la source « ${source.slice(0, 70)} » est une liste de contrôle écrite par l'auteur, pas une source de vérité : nomme la source AMONT relue au moment de répondre (le document, le registre, la page de référence qui fait foi)` }); continue; }
    if (!/\d/.test(f.groups.per)) { sorties.push({ ligne, valide: false, raison: "le périmètre ne dit pas combien d'éléments ont été mesurés (un nombre est attendu : « périmètre 273 pages »)" }); continue; }
    sorties.push({ ligne, valide: true, raison: "" });
  }
  return sorties;
}

// ---- LE « oui » QUI RÉPOND À UNE QUESTION DE COMPLÉTUDE (hook de fin de tour : lui seul lit le message humain) ----

const QUESTION_COMPLETUDE = [
  /(?<![\p{L}\p{N}])(?:est-ce que|est-ce qu['’]|as-tu|avez-vous|a-t-on|a-t-il|a-t-elle|ont-ils|ont-elles|est-il|est-elle|sont-ils|sont-elles)[^?.!\n]{0,40}(?<![\p{L}\p{N}])(?:tout|toute|toutes|tous|le reste|l['’]ensemble|la totalité|rien)(?![\p{L}\p{N}])[^?.!\n]{0,100}\?/iu,
  /(?<![\p{L}\p{N}])(?:le reste|tout le|toute la|tous les|toutes les|l['’]ensemble|tout)(?![\p{L}\p{N}])[^?\n]{0,100}(?:à jour|mis(?:e|es)? à jour|traité|corrigé|migré|couvert|aligné|fait|terminé|oublié|complet|complète|exhaustif)[^?\n]{0,60}\?/iu,
  /(?<![\p{L}\p{N}])(?:rien (?:n['’](?:a|est) (?:été )?|d['’]autre )?(?:oublié|omis|manqué)|pas d['’]oubli|aucun oubli|oublié (?:quelque chose|autre chose)|autre chose à (?:mettre à jour|corriger|traiter))[^?\n]{0,80}\?/iu,
  /(?<![\p{L}\p{N}])(?:est-ce )?(?:complet|complète|exhaustif|exhaustive)(?![\p{L}\p{N}])[^?\n]{0,60}\?/iu,
];
/** Le message humain pose-t-il une question fermée de complétude (« est-ce que tout est à jour ? ») ? */
export function questionDeCompletude(messageHumain) {
  const t = String(messageHumain || "").replace(/\r\n/g, "\n");
  return QUESTION_COMPLETUDE.some((re) => re.test(t));
}

/** Le texte ouvre-t-il sur un « oui » (ou équivalent) qui répond à la question ? « Oui », « Oui, tout… », « Oui — », « Tout est… » ne comptent pas. */
export function ouvreSurUnOui(texte) {
  // La première ligne de PROSE : ni titre (« ## 0. Synthèse d'ouverture »), ni « Niveau : Moyen », ni l'intitulé « La réponse. ».
  const premiere = voixDeLAuteur(String(texte || "")).split("\n").filter((l) => !/^\s*#/.test(l))
    .map((l) => l.replace(/^[\s>*_`-]+/, "").replace(/^la r[ée]ponse\.?\**\s*/i, "").trim()).find((l) => l && !/^niveau\s*:/i.test(l)) || "";
  return /^(?:oui|tout à fait|absolument|effectivement|c['’]est bien le cas|c['’]est le cas|bien sûr)(?![\p{L}\p{N}])/iu.test(premiere);
}

/** Les trois lectures d'un tour : une question de complétude, un « oui » en ouverture, et la ligne de mesure valide. */
export function controlerOuiDeCompletude({ dernierHumain = "", dernierTexte = "" }) {
  if (!questionDeCompletude(dernierHumain)) return { applicable: false, verdict: "SANS_OBJET", ecarts: [] };
  if (!ouvreSurUnOui(dernierTexte)) return { applicable: false, verdict: "SANS_OBJET", ecarts: [] };
  const lignes = lignesMesure(dernierTexte);
  if (lignes.some((x) => x.valide)) return { applicable: true, verdict: "PASS", ecarts: [] };
  const raison = lignes.length ? lignes.find((x) => !x.valide).raison : "aucune ligne « Mesuré sur : <source>, relue à HH:MM, périmètre <n> » n'accompagne ce « oui »";
  return { applicable: true, verdict: "FAIL",
    ecarts: [`le dernier message humain pose une question de complétude (« ${String(dernierHumain).replace(/\s+/g, " ").trim().slice(0, 110)} ») et la réponse s'ouvre sur « oui » : ${raison}. `
      + "Un « oui » à « est-ce que tout est à jour ? » est une affirmation d'exhaustivité (TF-1866, RT-126 : « oui, tout le site est à jour » rendu PASS sur 273 pages cherchées avec la liste de l'auteur, l'ancienne société restait nommée sur ~290 pages)"] };
}

export const RAPPEL_MESURE = "Toute affirmation d'exhaustivité (« tout … est à jour », « entièrement », « rien oublié », « complet », « exhaustif », ou un « oui » à une question de complétude) "
  + "porte, dans la restitution, la ligne « Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments> » — la source RELUE au moment de répondre (le document, le registre ou la page qui fait foi), "
  + "l'heure de cette relecture (commande `date`), et le nombre d'éléments mesurés. Une liste de contrôle écrite par l'auteur n'est pas une source de vérité ; la formule est « Mesuré sur », pas « Mesuré contre ». "
  + "Sans la relecture : retire l'affirmation, ou dis ce qui n'a pas été mesuré (« non mesuré : … ») (TF-1866, S82).";
