# Lot de retours — Produit-64 → pilot (S48 « remontée à la factory », hook de restitution) — 2026-10-12, indice f

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `oracles/oracle-synthese.mjs` (règle S48), le hook de restitution et `gabarits/RESTITUTION.md`.

**Origine** : deux demandes du porteur, le 12/10/2026.

1. « Pourquoi est-ce que tu mets ça : "Remontée à la factory : rien de neuf à remonter dans ce tour…" alors qu'il y a clairement une erreur faite à ne pas reproduire et donc à remonter à la Factory, non ? »
2. « Remonte aussi à la Factory que ce type d'oublis de remonter à la Factory par les produits doit être corrigé afin de ne pas oublier de remonter des erreurs de ce type. »

Ce lot porte **4 retours** : le mécanisme (RT-39, RT-40), puis, en application de la règle qu'il demande, les deux erreurs de la session restées non remontées (RT-41, RT-42).

- **Contexte** : une session de conversation de ce produit (analyse des coûts Azure), hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`oracles/oracle-synthese.mjs` S48, hook de restitution, `gabarits/RESTITUTION.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-39 | majeur | générique | **S48 accepte « rien à remonter » quel que soit le contenu du tour, y compris un tour qui vient de corriger une erreur de la session.** Mesuré le 12/10/2026 en rejouant `oracle-synthese.mjs` sur une restitution placée sous le `forge/` du produit : la ligne « Remontée à la factory : rien à remonter. » rend **PASS** (« le tour déclare n'avoir rien à remonter à la factory »). La règle (`oracle-synthese.mjs`, bloc S48) ne teste que la **présence** d'une ligne qui tranche, pas sa **vérité**. Dans cette seule session, **3 tours** ont corrigé une erreur de la session puis déclaré n'avoir rien à remonter. **(1)** Une recommandation retirée pour APR2 : « D-2 est retirée », « Correction d'une restitution précédente ». **(2)** Des heures d'en-tête inventées, corrigées en bloc 6 : « Ces heures avaient été estimées sans les mesurer ». **(3)** L'analyse BAV faite sur un clone périmé (lot `20261012e`). Les deux premières n'ont été remontées qu'avec ce lot (RT-41, RT-42) ; la troisième, sur intervention du porteur. | Durcir S48 : quand le tour porte un **signal de correction**, « rien à remonter » rend **FAIL**, et la ligne exige soit un lot nommé, soit « reste au produit, parce que <motif> ». Signaux candidats, du plus fiable au moins fiable : un fichier déplacé vers `output/old/` dans le tour ; une mémoire de type `feedback` écrite dans le tour ; dans la restitution, « retirée », « à tort », « correction d'une restitution précédente », « recommandation fausse » ; dans le dernier message humain, une question sur une erreur (« pourquoi … pas vu », « c'est faux », « dépassé »). Fixtures : rouge (bloc 6 « Correction d'une restitution précédente » et « rien à remonter »), verte (même tour, lot nommé), verte (tour sans correction, « rien à remonter »). |
| RT-40 | majeur | générique | **Quand S48 échoue, personne ne le voit.** Même mesure : la ligne réellement écrite, « Remontée à la factory : rien de neuf à remonter dans ce tour… », rend **FAIL** (« la ligne de remontée ne tranche pas »). La restitution est pourtant passée : S48 est **avertissante** depuis le 17/09, et le message du hook n'a cité, parmi les défauts « non bloquant », que S19, S23 et S45. L'échec de S48 n'a été vu ni par la session ni par le porteur, qui a dû poser la question lui-même. Récidive de la classe `constat-non-bloquant-jamais-lu`. | (a) Passer S48 en **bloquante** : elle est en service depuis le 17/09, ce qui fait plus de trois semaines de mesure de bruit. Ou au moins la placer en tête de la liste « non bloquant » chez un produit. (b) Le message du hook liste **tous** les FAIL avertissants, et pas une sélection. Fixture : restitution d'un produit dont la ligne S48 ne tranche pas ; le message du hook doit nommer S48. |
| RT-41 | moyen | générique | **Une recommandation de changement d'un produit tiers a été écrite d'après une métrique, sans lire la décision documentée qu'elle contredisait.** Le 12/10/2026, la session a recommandé de passer le worker d'APR2 de 2 vCPU à 0,25 vCPU, sur la seule utilisation moyenne du processeur (3 à 31 millicœurs). Le dépôt `APR_Produit-01` (`infra/terraform/apps.tf`) justifie ces 2 cœurs par une mesure : un budget de latence de 5 secondes pour l'OCR et la conversion, et 144 secondes de consolidation à 0,5 cœur. La recommandation aurait cassé ce budget. Elle a été retirée au tour suivant, puis déclarée « rien à remonter ». | Règle de démarche (diagnostic, `quality-oracles`) : avant de recommander une modification de dimensionnement, de configuration ou d'architecture d'un produit tiers, lire le **commentaire ou la décision** qui accompagne la valeur dans son code (bloc Terraform, ADR, décision consignée), et le citer dans la recommandation. Une valeur commentée comme « décision prise après mesure » ne se renverse pas sur une métrique d'usage seule. |
| RT-42 | mineur | générique | **Des heures d'en-tête de restitution ont été composées au lieu d'être relevées.** Le 12/10/2026, l'en-tête d'un tour annonçait « de 14h50 à 15h15 », alors que `date` relevée deux tours plus tard rendait 14:29. L'erreur a été corrigée en bloc 6, puis déclarée « rien à remonter ». Récidive de la famille `horodatage-invente`, constatée ici sur l'en-tête de restitution et non sur un ledger. | Le bloc 1 exige une heure **relevée** (sortie de `date` dans le tour) ; S-règle candidate : une heure d'en-tête sans commande `date` exécutée dans le tour est signalée. |

**Portée** : générique. Tout produit qui restitue sous le hook est exposé à RT-39 et RT-40. RT-41 et RT-42 valent pour toute session.

## Rattachement

Registre interrogé le 12/10/2026 (termes « rien à remonter », « S48 », « remontée à la factory ») : `TF-1166` a créé S48 le 17/09, pour combattre le **silence** des produits. RT-39 en est le prolongement : après le silence, la **déclaration nulle non vérifiée**. Aucun item ne juge la vérité de « rien à remonter ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Trois erreurs corrigées dans la session et déclarées « rien à remonter » | Lots `20261012e` et `20261012f` ; mémoire de session `erreur-de-session-se-remonte` | oui | remonté : RT-39, RT-41, RT-42 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : rien n'a été déployé.

## Confirmations positives

- S48 a bien rendu FAIL sur une ligne qui ne tranchait pas. Le contrôle existe et il est juste ; c'est sa sévérité et son affichage qui l'ont rendu muet (RT-40).

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-39** : aucune classe existante ne convient.
  - Clé proposée : `remontee-declaree-nulle-apres-correction`
  - Famille : `hook-ou-gate`
  - Libellé : « Un tour qui a corrigé une erreur de la session déclare n'avoir rien à remonter à la factory, et la règle de remontée l'accepte : elle juge la présence de la déclaration, jamais sa vérité. »
- **RT-40** : classe existante `constat-non-bloquant-jamais-lu`, en récidive.
- **RT-41** : aucune classe existante ne convient.
  - Clé proposée : `recommandation-contre-une-decision-mesuree-non-lue`
  - Famille : `skill-ou-oracle-non-invoque`
  - Libellé : « Une recommandation de changement d'un produit tiers est écrite d'après une métrique d'usage, sans lire la décision documentée qui accompagne la valeur dans son code, et elle la contredit. »
- **RT-42** : classe existante `horodatage-de-ledger-compose-a-la-main`, en récidive, constatée ici sur un en-tête de restitution.

## Ordre recommandé

1. **RT-40**, parce que passer S48 en bloquante est une seule ligne de sévérité.
2. **RT-39**, parce qu'elle donne à S48 de quoi juger la vérité de la déclaration.
3. **RT-41**, puis **RT-42**.
