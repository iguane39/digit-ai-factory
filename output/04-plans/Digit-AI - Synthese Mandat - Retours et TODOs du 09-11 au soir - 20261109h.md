---
destinataire: humain
---

# Synthèse Mandat — 10 lots reçus, 17 sujets clos, 82 candidats en attente de tri (09/11/2026 au soir)

## 0. Synthèse d'ouverture

Les retours de ce soir sont tous entrés au registre, et 17 sujets sont corrigés et vérifiés. 7 lots attendaient au sas en début de session, puis 3 autres sont arrivés pendant le travail. Tous sont accueillis, pseudonymisés et ingérés. Les 13 retours des 7 premiers lots sont corrigés dans 5 forges et le pilot, toutes publiées. Une session ne peut plus éteindre l'alerte « rien à remonter » sans citer le lot qu'elle a remis. Les 77 retours arrivés tard attendent une seconde campagne, que je n'ai pas lancée : 74 viennent de digit-ai-marketing, qui rattrape ses retours depuis le 30/09. Une alerte du relecteur d'intention vous revient (D-190).

Livré : [Synthèse du 09/11 au soir, retours et TODOs](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2009-11%20au%20soir%20-%2020261109h.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les TODOs et retours ». Elle porte sur le pilot `digit-ai-factory` et 5 forges : forge-tests, forge-agents, forge-websec, forge-design et forge-ops. Synthèse relevée le 09/11/2026 à 23:41, heure de Paris, après une ouverture à 20:31. Session pilote Claude Opus 5.5, 6 agents de campagne Claude Sonnet 5.5 et une relecture d'intention.

Intention de la demande : faire entrer tous les retours remis et clore ce qui ne vous revient pas, sans rien laisser dehors.

Test rétro : la synthèse sert cette intention. Rien ne reste au sas, chaque clôture repose sur une recette que j'ai rejouée, et ce qui n'est pas fait est nommé avec son motif.

## 2. Verdict

17 sujets clos en `corrige`, chacun sur une recette rejouée par moi après la livraison de l'agent. `oracle-todo` et `oracle-boite-entree` rendent PASS à 23:41. TF-1843 a passé sa revue sans tenir ses critères, et TF-2214 reste ouvert.

## 3. Décisions attendues

Bloquants de ce tour, chacun avec ce qui le lève :
- L'alerte du relecteur d'intention sur la consigne de campagne attend votre réponse à D-190. Sans réponse, elle reste ouverte au registre des relectures, et rien n'est défait.
- Les 82 candidats du jour attendent leur tri. Je le ferai à votre prochaine demande, sans autre geste de votre part (A-2).

Une décision nouvelle vous revient. Avant de lancer les 6 agents, j'ai fait relire leur consigne commune par un relecteur d'intention. Il l'a jugée en dérive par rapport à votre demande, avec 3 écarts, tous de nature « choix humain ». Les voici, avec ma position sur chacun :
- Le périmètre se limitait aux lots du jour. Je l'ai élargi avant le lancement : 2 sujets en cours (TF-2208 et TF-2214) ont rejoint la campagne, et j'ai mesuré moi-même 4 gains échus.
- TF-2300, le gabarit d'animation à scènes, est exclu de la campagne. Je le maintiens hors campagne : le produit l'a lui-même conditionné à votre réponse à sa décision D-181.
- Les corrections d'oracle ont été décidées par moi sous R-58 (la règle qui n'envoie à l'humain que ce qui lui revient). Je maintiens ce choix : elles appliquent des règles déjà en vigueur, sans créer de doctrine. Ces règles sont la loi n° 5, S48 (le contrôle « rien à remonter » après une correction) et S13 (le contrôle du localisateur d'une action), que S92 contredisait.

> **D-190 — Faut-il confirmer l'alerte du relecteur d'intention, qui juge en dérive la consigne de la campagne du 09/11 au soir pour 3 écarts de périmètre et de décision ?**
> - **De quoi s'agit-il** : la relecture d'intention faite ce soir par un agent vérificateur sur la consigne commune des six agents de campagne, avant leur lancement, pour vérifier qu'elle servait votre demande et pas seulement sa lettre.
> - **Le problème** : le relecteur estime que la consigne a resserré votre demande « Traite les TODOs et retours » et décidé à votre place des changements de règle ; selon votre réponse, la campagne est juste ou son périmètre est à reprendre.
> - **Pourquoi vous** : c'est un arbitrage de périmètre sur votre propre demande, que le relecteur a classé « choix humain » ; votre réponse dit si la campagne a servi votre intention, et elle alimente la revue de la relecture d'intention (D-183).
> - **Recommandation : (b)** — le périmètre a été élargi avant le lancement, et les 2 autres écarts suivent la règle de partage des décisions et le choix du produit. Source consultée : `references/RELECTURE-INTENTION.md`, « La boucle de correction ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Confirmer l'alerte | l'alerte compte comme confirmée à la revue de la relecture d'intention, et je reprends le périmètre que vous désignez | votre réponse, et une campagne de plus si le périmètre change | infirmer ensuite |
| (b) Infirmer l'alerte | l'alerte compte comme infirmée, et le travail de ce tour reste tel quel | aucun | confirmer ensuite |

> **Sans réponse** : l'alerte reste ouverte au registre des relectures, et rien n'est défait.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

- Boîte des retours : 10 lots accueillis et ingérés, 91 candidats frappés (TF-2298 à TF-2388). Le sas est vide à 23:41.
  - 7 lots d'ouverture, de Produit-81 (3), Produit-84, Produit-86 (2) et digit-ai-marketing : 14 candidats.
  - 3 lots arrivés en cours de session, de Produit-84 et digit-ai-marketing (2) : 77 candidats.
- Référentiel des classes, versions 1.70.0 et 1.70.1 : 3 classes créées pour TF-2304, TF-2308 et TF-2310. 2 clés proposées ne sont pas créées, parce qu'une classe existante couvrait déjà le défaut : TF-2306 va dans `capture-de-preuve-porte-un-jeton`, TF-2299 dans `etat-ouvert-non-mesure`. TF-2311 est reclassé dans `suite-rouge-rendue-en-skip`.
- Décision sous R-58 : 13 candidats décidés, puis tous corrigés. Chaque correction porte sa classe au registre, et son cas de recette échouait sur l'état de départ avant de passer, rouge puis vert.
- forge-tests, agent A1, 3 sujets. Rejoué : les 49 cas neufs passent, la suite complète rend exit 0 et ruff est vert.
  - TF-2298 : un workflow planifié présent sous `.github/workflows/` n'est plus déclaré « non câblé ».
  - TF-2311 : un délai dépassé rend le verdict `DELAI_DEPASSE`, distinct d'un SKIP.
  - TF-2208 : un enchaînement entre profils est rejoué de bout en bout.
- forge-agents, agent A2, TF-2299 : `render_page` mesure chaque scène d'une page à scènes. Rejoué : 811/811 cas passés. Sur une animation réelle, l'agent a trouvé 2 défauts que l'ancien rendu ne voyait pas.
- forge-websec, agent A3, TF-2306 : la capture caviarde chaque paramètre d'une adresse d'en-tête, quel que soit son nom. Rejoué : 154 PASS, 0 FAIL ; 5 porteurs de jeton sur 5 sont caviardés, contre 0 avant.
- forge-design, agent A4, 2 sujets. Rejoué : recette complète, 883 vérifications, 0 échec.
  - TF-2307 : la vérification au champ déclarée passe.
  - TF-2309 : une page capturée est rendue autonome avant les oracles.
- forge-ops, agent A5, TF-2308 : le test de mise en production relit l'état servi à la fin. Rejoué : 716 PASS, 0 FAIL, contre 683 avant. La porte M-3 d'`ETAPE-MEP.md` cite désormais ce contrôle.
- Pilot, agent A6, reporté par moi sur `main` (909149ee, 5d5ef83c), gabarit de restitution 2.65.0 :
  - TF-2301 : le hameçon de lexique ne classe plus en audit une demande qui cite seulement forge-audit ;
  - TF-2302 : S68 refuse désormais un manque de droit déduit des seules attributions directes, sans lecture de l'héritage de groupe ;
  - TF-2303 et TF-2305 : un `--motif` n'éteint plus S48 ni FRICTIONS sans lot cité, et S48 lit le défaut constaté sur soi ;
  - TF-2304 : la règle neuve S115 (voie manuelle laissée à l'humain) avertit quand la session détient elle-même la commande ;
  - TF-2310 : S13 compte une adresse http(s) comme localisateur ;
  - rejoué sur `main` : `hook-lexique` 93 et 29 PASS, `oracle-synthese` 349 sur 349, frictions 41 sur 41, `hook-restitution` 69 sur 69, cohérence de la restitution en PASS.
- Mesures de gain échues, faites par moi :
  - TF-1911 est clos. Sur 77 réservations de 23 sessions dans 6 produits, aucun numéro n'a été pris 2 fois, alors que 5 paires de sessions tournaient en même temps.
  - TF-1913 est clos. 8 tours réels sur 8 ont joué la critique d'implémentation depuis le 03/11.
  - TF-1949 est clos. 96 traces de mobilisation ont été écrites depuis le 02/11, et aucun refus S85 ou S86 en 437 tours.
  - La revue de TF-1843 ne tient aucun de ses 3 critères : 74 % des appels vont à un agent nommé pour 90 % visés, et 98 délégations Opus partent sans effort déclaré.
- Publication : forge-websec d2d9251, forge-ops 28fc468, forge-design 07b317b, forge-tests dec0bef et forge-agents d5d348e. Le pilot est à 8071e841. Chaque dépôt est à 0 commit d'écart après `git fetch`, vérifié par `rev-list`.
- Nettoyage : un report de commits laissé en cours le 03/11 bloquait `main`. Son contenu y était déjà (c58691c2), et je l'ai levé par `git cherry-pick --quit`, qui ne touche ni l'index ni l'arbre.

Relecture d'intention : dérive, sur la consigne relue avant le lancement (RI-20261109-06), 3 écarts de nature « choix humain », que le bloc 3 reprend.

## 5. Non traité

- Les 77 candidats arrivés en cours de session (TF-2312 à TF-2388) — motif : `borne_atteinte`. Ils sont entrés au registre ; leur tri demande 15 classes à créer et une campagne de plus.
- TF-2300, le gabarit d'animation à scènes — motif : `dependance_externe`, D-181 posée chez digit-ai-marketing.
- TF-2214, le rappel d'une décision sans réponse au pilot — motif : `dependance_externe`. Le registre des décisions ne consigne aucune réponse : il faut d'abord écrire cet écrivain.
- TF-1843, la suite de la revue de la flotte d'agents — motif : `decision_humaine`. Corriger les appelants ou réviser les critères est un arbitrage, rappelé à la revue hebdomadaire du 10/11.
- TF-1865 et TF-1873, dont l'échéance du 08/11 est passée — motif : `dependance_bloc_3`, ils suivent D-183.
- TF-2222 — motif : `garde_fou`. L'adaptateur `dotnet test` ne se vérifie pas sur ce poste, où `dotnet --version` échoue.
- Relecture d'intention à la réception des 6 livraisons et en cohérence — motif : `borne_atteinte`. J'ai rejoué la recette de chaque livraison à la place.
- La copie installée des skills — motif : `borne_atteinte`. `oracle-skills --appliquer` a dépassé mon délai de 900 s (code 124). Il est relancé en arrière-plan, sans verdict à 23:41.

## 6. Écarts à la lettre

- TF-2304 était décidé en refus. L'agent a livré un avertissement, parce que le premier jet de la règle accusait 12 synthèses à tort sur 394.
- TF-2311 demandait un délai proportionné à la suite. L'agent a livré un délai suggéré, le double du délai atteint, jamais appliqué tout seul ; le verdict global reste PARTIEL.
- TF-2306 visait les paramètres de requête. L'agent a aussi caviardé les fragments et toute adresse absolue d'en-tête, parce que lister les en-têtes avait échoué 2 fois.
- TF-2299 proposait une option `--scenes`. Le rendu des scènes est automatique, parce qu'une option laisserait le silence par défaut. Une page à scènes se rend donc plus lentement : 112 s pour 7 scènes à 6 largeurs.
- Mes clôtures de TF-1911 et TF-1949 nommaient les dossiers de 5 produits. Je les ai retirées du registre avant tout enregistrement et réécrites sans aucun nom.

## 7. Risques

- La règle S115 n'a aucun vrai positif mesuré sur le corpus. Signal : une voie manuelle laissée à l'humain qui passe sans avertissement. Parade : la mesurer sur les prochaines restitutions des produits.
- Le refus de `--motif` sur S48 ne vérifie que le nom du lot cité, pas sa présence au sas. Signal : un lot cité qui n'arrive jamais. Parade : `oracle-boite-entree` nomme les lots attendus et jamais parvenus.
- Le banc vert de forge-tests échoue sur 5 avis de sécurité publiés après son verrou. Signal : la section corpus de sa recette reste en échec. Parade : le candidat TF-2392.

## 8. Prochaines actions

Ordre : A-1 d'abord, parce qu'elle vous revient ; A-2 suit à votre prochaine demande.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-190 sur l'alerte du relecteur d'intention | neuve | manuelle_utilisateur | decision : jugement de l'humain sur le périmètre décidé | répondre « 190a » ou « 190b » ; je l'inscris par `node scripts/relecture-intention.mjs --confirmer RI-20261109-06 <oui\|non>` | si rien n'est fait, l'alerte reste ouverte et ne compte pas dans la revue de la relecture d'intention |
| A-2 | Trier les 82 candidats du jour, créer leurs 15 classes et lancer la seconde campagne | TF-2312 | auto_ia | borne_atteinte : 77 retours arrivés en fin de session | `todo/TODO.jsonl`, candidats TF-2312 à TF-2392 | si rien n'est fait, 45 retours sur forge-agents et 21 sur le pilot attendent, dont l'absence de document du formateur, cotée bloquante par le produit |

## 9. Traces

- `todo/TODO.jsonl` : 91 créations ingérées, 13 décisions sous R-58, 17 clôtures, candidats TF-2389 à TF-2392
- `todo/CLASSES.json` 1.70.1, `todo/relectures-intention.jsonl` (RI-20261109-06), `todo/observabilite/flotte-campagnes.jsonl` (retours-todos-20261109-soir)
- Pilot : 61830b8a, 34c315e5, c1a0b448, 909149ee, 5d5ef83c, 8071e841
- Forges publiées : forge-websec d2d9251 ; forge-ops 28fc468 ; forge-design 07b317b ; forge-tests dec0bef ; forge-agents d5d348e
