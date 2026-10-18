#!/usr/bin/env node
/**
 * lib-exhaustivite.test.mjs — recette de la détection des affirmations d'exhaustivité et de la ligne « Mesuré sur » (TF-1866, 18/10/2026).
 * À double sens : chaque forme d'affirmation est accusée, et chaque forme qui lui ressemble sans en être une ne l'est pas. Les « ressemblances »
 * sont celles que le rejeu sur le corpus réel (903 messages finaux de sessions, 288 synthèses d'output\04-plans) a d'abord accusées à tort,
 * lues une à une — elles ont fait corriger la détection, et restent ici pour qu'elle ne les accuse plus.
 * Joué par oracles/self-tests.mjs (I2).
 */
import { affirmationsDExhaustivite, lignesMesure, questionDeCompletude, ouvreSurUnOui, controlerOuiDeCompletude, voixDeLAuteur } from "./lib-exhaustivite.mjs";

const echecs = [];
let verifs = 0;
const att = (cond, msg) => { verifs++; if (!cond) echecs.push(msg); };

// ---- ACCUSÉES : ce qui EST une affirmation d'exhaustivité de l'auteur
const ACCUSEES = [
  ["Oui, tout le site en ligne est à jour : j'ai relu chaque page publiée.", "totalité + état"],                          // le cas du 15/10 (RT-126)
  ["Tout est à jour avec GitHub sur les 16 dépôts.", "totalité + état"],
  ["Toutes les pages sont migrées vers la nouvelle charte.", "totalité + état"],
  ["À l'ouverture de la session, toutes les forges étaient déjà à jour.", "totalité + état"],
  ["Tout ce que l'IA pouvait traiter parmi vos 36 décisions en attente est traité.", "totalité + état"],
  ["Le reste du site est corrigé dans l'éditeur depuis le 15/10.", "totalité + état"],
  ["L'ensemble des fiches est désormais synchronisé.", "totalité + état"],
  ["Les 273 pages sont entièrement à jour.", "adverbe de totalité + état"],
  ["La question est intégralement couverte.", "adverbe de totalité + état"],
  ["Rien n'a été oublié dans ce lot.", "rien oublié"],
  ["Rien n'a été laissé de côté dans ce tour.", "rien oublié"],
  ["Rien ne manque à l'inventaire.", "rien oublié"],
  ["Il n'y a aucun oubli sur les 12 pages.", "rien oublié"],
  ["Il n'y a plus rien à corriger sur le site.", "rien oublié"],
  ["L'inventaire des pages est complet.", "collection complète"],
  ["L'import est complet : les cinq campagnes sont dans l'éditeur.", "collection complète"],
  ["Le balisage international est complet sur 200/200 pages.", "collection complète"],
  ["La traçabilité est désormais complète.", "collection complète"],
  ["Le balayage a été fait de façon exhaustive.", "exhaustif"],
  ["La liste exhaustive des pages est jointe.", "exhaustif"],
  ["Le relevé est exhaustif.", "collection complète"],
  ["Le contrôle des liens a été mené de manière exhaustive.", "exhaustif"],
];
for (const [phrase, motif] of ACCUSEES) {
  const a = affirmationsDExhaustivite(phrase);
  att(a.length >= 1 && a[0].motif === motif, `accusée attendue (${motif}) : « ${phrase} » → ${JSON.stringify(a.map((x) => x.motif))}`);
}

// ---- NON ACCUSÉES : ce qui ressemble à une affirmation sans en être une
const INNOCENTES = [
  ["Tout n'est pas à jour : 12 pages restent à traiter.", "négation"],
  ["Le site n'est pas entièrement à jour.", "négation"],
  ["Rien n'est à jour tant que la source n'est pas relue.", "négation"],
  ["L'inventaire n'est pas complet.", "négation"],
  ["Pour que tout le site soit à jour, il reste 12 pages à traiter.", "condition « pour que »"],
  ["Si tout est à jour, la publication peut partir.", "condition « si »"],
  ["Je garde la décision jusqu'à ce qu'un tour de travail ait confirmé que rien ne manque.", "condition « jusqu'à ce que »"],
  ["Presque tout est corrigé.", "« presque » (relevé du corpus : une totalité niée)"],
  ["Tous deux sont corrigés et repassés du rouge au vert.", "« tous deux » : deux éléments, pas un ensemble (relevé du corpus)"],
  ["La branche était alignée avant tout geste.", "« tout geste » : « tout » sans déterminant (relevé du corpus)"],
  ["Tous ses contrôles passent, et la pastille numérotée est alignée sur son titre.", "deux propositions : la virgule coupe (relevé du corpus)"],
  ["Elle était parfaitement synchronisée avant que je n'y touche.", "« parfaitement » n'est pas une totalité (relevé du corpus)"],
  ["Le moteur remplace la coque et tous les blocs de données sont remplacés par le générateur.", "description d'un générateur, « remplacé » n'est pas un état de fraîcheur (relevé du corpus)"],
  ["Le contrôle exige qu'un jeu de livrables soit complet ; il le vérifie à la clôture.", "une exigence décrite (relevé du corpus)"],
  ["Citation ajoutée à la règle N-8 (un jeu de livrables est complet, ou la passe le dit).", "le texte d'une règle citée (relevé du corpus)"],
  ["L'agent a tout laissé sortir sans rien oublier de côté.", "forme de l'infinitif, pas une affirmation (« sans rien oublier » écartée)"],
  ["Le texte est complet.", "complet dit d'un texte, pas d'une collection"],
  ["Vous avez écrit « tout le site est à jour » : je ne l'affirme pas.", "citation entre guillemets français de la demande humaine"],
  ["Le projet est mis à jour chaque lundi.", "pas une totalité"],
  ["La mise à jour des 12 pages est faite.", "une mise à jour chiffrée, sans totalité ni adverbe"],
  ["Vous n'avez donc plus rien à faire de ce côté.", "« plus rien à faire » est un geste laissé ou non à quelqu'un, pas une complétude (relevé du corpus, 5 accusations à tort)"],
  ["Il n'y avait plus rien à faire converger : la cible n'est plus une hypothèse.", "« plus rien à faire » (relevé du corpus)"],
];
for (const [phrase, pourquoi] of INNOCENTES) {
  const a = affirmationsDExhaustivite(phrase);
  att(a.length === 0, `innocente attendue (${pourquoi}) : « ${phrase} » accusée → ${JSON.stringify(a)}`);
}
// Ce qui n'est pas la voix de l'auteur : code, bloc de citation, ligne d'option d'un tableau.
att(affirmationsDExhaustivite("```\ntout le site est à jour\n```").length === 0, "un bloc de code n'est pas une affirmation");
att(affirmationsDExhaustivite("> **D-1 — Faut-il dire que tout le site est à jour ?**\n> - Recommandation : (a)").length === 0, "un bloc de citation (une décision posée) n'est pas une affirmation");
att(affirmationsDExhaustivite("| (a) | tout le site est à jour | nul | oui |").length === 0, "la ligne d'option d'un tableau est une hypothèse, pas une affirmation");
att(affirmationsDExhaustivite("`tout le site est à jour`").length === 0, "un extrait entre accents graves n'est pas une affirmation");
att(!/tout le site/.test(voixDeLAuteur("Il dit « tout le site » et `tout le site` puis ceci.")), "voixDeLAuteur retire guillemets français et extraits de code");

// ---- LA LIGNE « Mesuré sur » : forme, source, heure, périmètre
const VALIDE = "Mesuré sur : conditions générales du 15/10 du produit amont (docs/cgv-20261015d.md), relue à 14:32, périmètre 273 pages";
const l1 = lignesMesure("- " + VALIDE);
att(l1.length === 1 && l1[0].valide, `la forme attendue doit être valide : ${JSON.stringify(l1)}`);
att(lignesMesure("- **Mesuré sur** : le registre amont, relue à 14h32, périmètre 273 pages")[0]?.valide === true, "gras, « 14h32 » : la tolérance de mise en forme");
att(lignesMesure("Mesuré sur : la page de référence du 15/10, relue le 18/10/2026 à 09:05 ; périmètre : 12 fichiers")[0]?.valide === true, "« relue le JJ/MM/AAAA à HH:MM », séparateur « ; », « périmètre : »");
const contre = lignesMesure("- Mesuré contre : conditions générales du 15/10, relue à 14:32, périmètre 273 pages");
att(contre.length === 1 && !contre[0].valide && /pas « Mesuré contre »/.test(contre[0].raison), `« Mesuré contre » doit être refusée en disant la formule : ${JSON.stringify(contre)}`);
for (const [ligne, mot] of [
  ["- Mesuré sur : mes marqueurs d'ancienne formulation, relue à 14:32, périmètre 273 pages", "liste de contrôle écrite par l'auteur"],
  ["- Mesuré sur : ma liste de contrôle, relue à 14:32, périmètre 273 pages", "liste de contrôle écrite par l'auteur"],
  ["- Mesuré sur : les anciennes formulations des CGV, relue à 14:32, périmètre 273 pages", "liste de contrôle écrite par l'auteur"],
  ["- Mesuré sur : la liste que j'ai écrite des mentions à remplacer, relue à 14:32, périmètre 273 pages", "liste de contrôle écrite par l'auteur"],
  ["- Mesuré sur : conditions générales du 15/10, périmètre 273 pages", "forme attendue"],
  ["- Mesuré sur : conditions générales du 15/10, relue à 14:32, périmètre le site entier", "nombre"],
  ["- Mesuré sur : x, relue à 14:32, périmètre 273 pages", "trop courte"],
  ["- Mesuré sur : conditions générales du 15/10, relue hier, périmètre 273 pages", "forme attendue"],
]) {
  const r = lignesMesure(ligne);
  att(r.length === 1 && !r[0].valide && r[0].raison.includes(mot), `ligne refusée attendue (« ${mot} ») : ${ligne} → ${JSON.stringify(r)}`);
}
att(lignesMesure("Aucune ligne de ce genre ici.").length === 0, "un texte sans ligne « Mesuré » ne rend aucune ligne");
// Une source amont qui contient le mot « liste » sans être celle de l'auteur reste valide.
att(lignesMesure("Mesuré sur : la liste officielle des produits du parc (INVENTAIRE.md), relue à 09:12, périmètre 16 dépôts")[0]?.valide === true, "une liste de référence amont (INVENTAIRE.md) n'est pas la liste de l'auteur");

// ---- LE « oui » À UNE QUESTION DE COMPLÉTUDE
for (const q of ["Est-ce que le reste du site a été mis à jour ?", "est-ce que tout est sur github ou le Drive que je puisse le retravailler sur un autre ordi ?",
  "As-tu mis à jour toutes les pages ?", "Toutes les modifications du chalet sont faites ?", "Rien n'a été oublié ?", "Le site est-il complet ?", "Tout le site est à jour ?"])
  att(questionDeCompletude(q), `question de complétude attendue : « ${q} »`);
for (const q of ["Fournis les étapes pour la configuration de Google Ads. Pourquoi est-ce que tu ne proposes pas d'office les étapes ? ça devrait être le cas puisque c'est ce que tout le monde attend",
  "Peux-tu mettre à jour le site ?", "11a", "Quelle est la différence entre ces deux formules ?", "Pourquoi le site n'est-il pas à jour sur la page tarifs ?", "Est-ce que tu peux regarder la page tarifs ?"])
  att(!questionDeCompletude(q), `pas une question de complétude : « ${q} »`);
att(ouvreSurUnOui("## 0. Synthèse d'ouverture\n\nOui, tout le site en ligne est à jour : j'ai relu chaque page."), "« Oui » sous le titre du bloc 0");
att(ouvreSurUnOui("Niveau : Moyen\n\n**La réponse.** Oui, tout est à jour."), "« Oui » dans « La réponse. » du niveau Moyen");
att(!ouvreSurUnOui("## 0. Synthèse d'ouverture\n\nNon : la proposition la plus utile n'a pas été traitée."), "« Non » n'ouvre pas sur un oui");
att(!ouvreSurUnOui("## 0. Synthèse d'ouverture\n\nLe site est en cours de mise à jour ; oui pour les pages françaises."), "un « oui » au milieu d'une phrase n'ouvre pas la réponse");
const Q = "Est-ce que le reste du site a été mis à jour ?";
const REPONSE_OUI = "## 0. Synthèse d'ouverture\n\nOui, tout le site en ligne est à jour : 273 pages relues.\n\n## 4. Traité\n- Balayage des 273 pages.\n";
const sans = controlerOuiDeCompletude({ dernierHumain: Q, dernierTexte: REPONSE_OUI });
att(sans.verdict === "FAIL" && /Mesuré sur/.test(sans.ecarts[0]) && /RT-126/.test(sans.ecarts[0]), `le « oui » du 15/10 sans ligne doit être refusé en nommant « Mesuré sur » et RT-126 : ${JSON.stringify(sans)}`);
const avec = controlerOuiDeCompletude({ dernierHumain: Q, dernierTexte: REPONSE_OUI + "- " + VALIDE + "\n" });
att(avec.verdict === "PASS", `le MÊME « oui » avec la ligne (le remède du message) doit passer : ${JSON.stringify(avec)}`);
const liste = controlerOuiDeCompletude({ dernierHumain: Q, dernierTexte: REPONSE_OUI + "- Mesuré sur : mes marqueurs, relue à 14:32, périmètre 273 pages\n" });
att(liste.verdict === "FAIL" && /liste de contrôle écrite par l'auteur/.test(liste.ecarts[0]), `un « oui » fondé sur « mes marqueurs » doit rester refusé : ${JSON.stringify(liste)}`);
att(controlerOuiDeCompletude({ dernierHumain: Q, dernierTexte: "## 0. Synthèse d'ouverture\n\nNon : 12 pages restent à mettre à jour.\n" }).verdict === "SANS_OBJET", "un « non » à la question n'est pas l'affirmation");
att(controlerOuiDeCompletude({ dernierHumain: "Peux-tu mettre à jour le site ?", dernierTexte: REPONSE_OUI }).verdict === "SANS_OBJET", "un « oui » à une question qui n'est pas de complétude n'est pas jugé");

if (echecs.length) { console.error(`lib-exhaustivite : FAIL (${echecs.length}/${verifs})\n  - ` + echecs.join("\n  - ")); process.exit(1); }
console.log(`lib-exhaustivite : ${verifs}/${verifs} — recette à double sens : ${ACCUSEES.length} cas rouges (les formes accusées) et ${INNOCENTES.length} cas verts de ressemblances non accusées ; ${ACCUSEES.length} formes d'affirmation d'exhaustivité accusées (totalité + état, adverbe, « rien oublié », collection complète, exhaustif — dont le cas réel du 15/10), ${INNOCENTES.length} ressemblances non accusées (négation, condition, « presque », « tous deux », « tout geste », deux propositions, exigence décrite, règle citée, citation de l'humain), la ligne « Mesuré sur » jugée en forme (heure, périmètre chiffré, « Mesuré contre » refusée, liste de l'auteur refusée) et le « oui » à une question de complétude refusé sans elle, accepté avec elle`);
