---
destinataire: humain
---

# Synthèse Mandat — l'essai de relecture d'intention est en place sur le poste, et la mesure chez les produits montre ses limites (18/10/2026)

## 0. Synthèse d'ouverture

Votre réponse « 23a + b » est exécutée. L'essai de relecture d'intention est en place dans le pilot, mais pas encore enregistré : chaque consigne passée à un agent et chaque fin de tour de travail peuvent maintenant être relues, en alerte, jamais en blocage. Je l'ai appliqué à ce tour même. La relecture de fin de tour a trouvé une dérive dans ma propre consigne : j'avais limité la relecture aux agents qui écrivent, alors que vous visiez chaque agent. C'est corrigé, et la relecture suivante dit « sert ». La mesure sur les travaux des produits est moins bonne que sur les études : aucune des 3 dérives retrouvées n'est vue, et sur les restitutions de cette session, 2 des 4 que vous aviez acceptées reçoivent une alerte. L'essai dira si ces alertes vous servent. Une décision vous revient, D-24 : enregistrer et publier l'essai, pour que les produits le reçoivent.

## 1. En-tête d'identification

Exécution de D-23 (a) et (b) du 18/10/2026, sur le pilot digit-ai-factory (enregistrement de départ `6d36996f`) et, en lecture seule, sur les dépôts de 3 produits ; poste DESKTOP-ULTRA7. Période : 18/10/2026, de 09:36 à 11:30, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5. 18 agents délégués : 1 `campagne` (Claude Sonnet 5.5) pour la mise en place, 1 `explorateur` (Claude Haiku 5.5) pour le corpus, 16 `verificateur` (Claude Sonnet 5.5, effort medium) pour les relectures. Escalade de modèle : aucune. Une autre session a enregistré 2 changements dans le pilot pendant ce tour ; ils ne sont pas les miens.

Intention de la demande : faire relire l'intention de tous les travaux, et mesurer en même temps ce que vaut cette relecture sur les dérives connues des produits.

Test rétro : le résultat sert cette intention, avec deux limites dites. L'essai couvre tous les travaux et a déjà servi sur ce tour. La mesure chez les produits est faite, mais sur 3 dérives au lieu de 4, et sans aucun travail sain de produit dont l'acceptation soit prouvée.

## 2. Verdict en une ligne

Essai en place, non enregistré : 7 recettes ciblées vertes, recette complète 223 sur 226 avec 3 échecs préexistants, rapporté par l'agent, non recompté ; mesure (b) : 0 dérive de produit vue sur 6 relectures, 1 sur 2 pour la dérive de restitution, 2 alertes sur 4 restitutions acceptées ; dépense de relecture du jour : 872 796 jetons, sous le seuil de 1 000 000.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-24 — Puis-je enregistrer et publier l'essai de relecture d'intention, et resceller la synthèse dont un nom a été pseudonymisé ?**
>
> - **De quoi s'agit-il** : les fichiers de l'essai dans le pilot (le référentiel, le script de relecture, le relevé de dépense, la règle de restitution 2.42.0, l'héritage 1.30.0, le hook et la doctrine), les 2 études et les données de mesure du jour. Il s'agit aussi du sceau (l'empreinte du jugement, enregistrée à côté du fichier) de la synthèse de 08:25 sur la flotte, devenu faux quand le contrôle d'avant enregistrement y a remplacé un nom de produit par son pseudonyme.
> - **Le problème** : tant que rien n'est publié, l'essai ne vit que sur ce poste, et les produits ne le reçoivent pas. Cette empreinte périmée fait échouer un contrôle de la recette complète.
> - **Pourquoi vous** : votre règle exige un accord explicite pour enregistrer et publier.
> - **Recommandation : (a)** — les recettes de l'essai passent ; les échecs restants de la recette complète existaient avant lui, et le rescellement lève celui de l'empreinte périmée. Source consultée : `REGLES-PROJET.md`, R-38, sur le push d'un dépôt sous GO humain ; le rapport de l'agent de mise en place, vérifié par sondage (sa recette complète, 223 sur 226, est rapportée et non recomptée).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Enregistrer et publier l'essai, resceller la synthèse de 08:25 | Les produits reçoivent la règle et le hook à leur prochaine ouverture ; la recette complète perd l'échec dû à l'empreinte périmée | Faible × court, environ 11 min pour la garde de publication du pilot | Possible, par un enregistrement correctif |
| (b) Enregistrer sans publier | L'essai est sauvé sur ce poste, et ne court ni chez les produits ni sur l'autre poste | Faible × court | Possible |
| (c) Ni l'un ni l'autre | L'essai reste sur ce disque, à la merci d'une autre session | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est enregistré.

## 4. Traité

Chaque élément du tour, avec sa preuve.

- **Relecture des 2 consignes avant lancement.** La mise en place de l'essai et la constitution du corpus : « sert » toutes les deux. Preuve : verdicts des 2 `verificateur`.
- **Mise en place de l'essai.** Elle comprend le référentiel `references/RELECTURE-INTENTION.md`, le script `scripts/relecture-intention.mjs` (préparer, consigner, confirmer, relever), le relevé de dépense dans `scripts/relever-flotte.mjs` et à l'ouverture, la règle de restitution 2.42.0 (S79, avertissante), l'héritage 1.30.0 et la doctrine. Preuves, rejouées par moi : `relecture-intention` 33 cas verts, `hook-flotte` 20, `relever-flotte` 11, `oracle-synthese --self-test` 190 sur 190, `relever-heritage` 43, `recopier-heritage` 20.
- **Dérive trouvée par l'essai, corrigée.** La relecture de fin de tour RI-20261018-01 a relevé que la relecture de consigne ne visait que les agents d'écriture, alors que la décision dit « chaque consigne d'agent ». Le hook, le référentiel, le gabarit de campagne, le contrat et l'héritage visent maintenant tout agent, sauf la relecture elle-même. Preuve : recette du hook passée de 18 à 20 cas, sens rouge compris ; la relecture RI-20261018-02 rend ensuite « sert ».
- **Relecture d'intention : sert** — RI-20261018-02, après correction de la dérive relevée par RI-20261018-01.
- **Mesure (b).** 12 relectures, consigne stricte. Preuve : `output/03-etudes/20261018-mesure-relecteur-d-intention.json`, champ `mesure_b`. Comment lire le tableau : une ligne par cas, sa nature, et les verdicts des relectures.

| Cas | Nature | Verdicts |
|---|---|---|
| Présentation de Produit-68 | dérive : une source ajoutée sans demande | sert, sert |
| Console de Produit-02 | dérive : un tri maison au lieu du composant de filtres | sert, sert |
| Exigences de Produit-12 | dérive : la cascade du produit absente | sert, sert |
| Étude restreinte aux études (ce jour) | dérive : vous l'avez corrigée | sert, dérive |
| 4 restitutions de ce jour, suivies de votre décision | saines | 2 sert, 2 dérive |

- **Dépense recomptée.** 16 relectures d'intention, 872 796 jetons le 18/10. Preuve : `node scripts/relever-flotte.mjs --jours 1`.

## 5. Non traité

- **Le tableau de bord de Produit-10.** Motif : le dépôt n'est pas sur ce poste et aucune sauvegarde ne le contient ; la demande n'existe qu'en paraphrase.
- **Un travail sain de produit.** Motif : aucun n'a de preuve d'acceptation sans reprise ; les fausses alertes ne sont mesurées que sur des restitutions du pilot.
- **La recette complète après ma correction.** Motif : seules les recettes touchées ont été rejouées ; la recette complète passera à l'enregistrement, par la garde de publication.
- **L'écart des copies installées des skills.** Motif : il n'est pas de mon fait, et sa remise à niveau vous revient.

## 6. Écarts à la lettre

Quatre écarts, dont un corrigé dans le tour.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| (b) « Mesurer d'abord […] avant tout essai » | La mesure et la mise en place ont tourné en parallèle | Votre « 23a + b » demandait les deux ; rien n'est publié avant votre réponse à D-24 |
| (b) Les 4 dérives des produits et autant de travaux sains | 3 dérives, et 4 restitutions de ce jour comme travaux sains | Le 4e dépôt est absent, et aucun travail sain de produit n'a de preuve d'acceptation |
| (a) « Chaque consigne d'agent » est relue | Ma consigne à l'agent visait d'abord les seuls agents d'écriture ; corrigé dans le tour | Relevé par la relecture de fin de tour elle-même |
| Le contrat d'agent de campagne prévoit des enregistrements locaux | J'ai demandé à l'agent de ne rien enregistrer | Votre règle exige votre accord pour enregistrer |

## 7. Risques

- **Les alertes sur les restitutions vous lassent.**
  - Énoncé : 2 restitutions acceptées sur 4 ont reçu une alerte, parce que la consigne stricte compte comme dérive un écart que vous avez validé.
  - Signal : des alertes que vous infirmez au relevé (`--releve`).
  - Parade : la revue du 08/11 décide, sur ces taux, d'exempter un écart validé une à une ou de passer à l'accord de 2 relecteurs.
- **Les dérives de règle échappent au relecteur.**
  - Énoncé : les 3 dérives des produits enfreignaient une règle de la Factory, ou ajoutaient un contenu classé mineur, sans contredire la demande écrite.
  - Signal : une reprise de votre part sans alerte préalable.
  - Parade : ces règles restent jugées par leurs oracles ; la revue dira s'il faut fournir au relecteur les règles applicables.
- **Le seuil d'arrêt est proche aujourd'hui.**
  - Énoncé : la mesure (b) compte dans les 872 796 jetons du jour.
  - Signal : la ligne de relecture du relevé d'ouverture.
  - Parade : au-delà de 1 000 000, l'essai s'arrête et je vous le demande.

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, l'enregistrement avant la revue ; vos réponses ensuite, parce que ces gestes les attendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Enregistrer et publier l'essai, resceller la synthèse de 08:25, déposer la candidature au registre | auto_ia | dependance_bloc_3 : attend D-24 | `git commit --only -- <fichiers de l'essai>`, puis `git push` sous la garde | L'essai ne court pas chez les produits |
| **A-2** | `neuve` | Revue de l'essai sur le relevé des relectures | auto_ia | dependance_externe : la revue est datée du 2026-11-08 | `node scripts/relecture-intention.mjs --releve --depuis 2026-10-18` | Les alertes ne sont pas évaluées |
| **A-3** | `neuve` | Dire si l'alerte RI-20261018-01 était juste : la relecture de consigne limitée aux agents d'écriture | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `RI-01 oui` | Le relevé de l'essai garde une alerte sans réponse |
| **A-4** | `neuve` | Trancher D-24 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `24a` | L'option (c) s'applique |

## 9. Traces

- Essai : `references/RELECTURE-INTENTION.md`, `scripts/relecture-intention.mjs`, `todo/relectures-intention.jsonl` (2 relectures consignées)
- Mesure : `output/03-etudes/20261018-mesure-relecteur-d-intention.json`, champs `resultats` et `mesure_b`
- Corpus des produits : dossier temporaire de la session, sous `produits/`, avec les noms réels retirés
- Rien n'est enregistré ni poussé.
