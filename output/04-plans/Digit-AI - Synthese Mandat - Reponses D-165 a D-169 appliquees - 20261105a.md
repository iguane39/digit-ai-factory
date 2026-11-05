---
destinataire: humain
---

# Synthèse Mandat — vos 5 réponses aux décisions D-165 à D-169 appliquées (05/11/2026)

## 0. Synthèse d'ouverture

Vos 5 réponses sont appliquées, vérifiées et publiées.
- Les relectures d'intention reprennent sous un seuil de 6 millions de jetons par jour.
- Un run ne peut plus se dire prêt sans parcours par persona ni exploitabilité verts : il est averti jusqu'au 18/11, puis bloqué.
- Un produit range un secret reçu en session dans son fichier d'environnement ignoré par git, et son journal en garde le nom et l'empreinte.
- Une session retire sans décision groupée une ressource distante qu'elle vient de créer, si personne ne s'en sert.
- Produit-12, Produit-71 et Produit-82 ont reçu dans leur boîte d'entrée le geste pour changer de modèle OpenAI avant l'arrêt.

Une question vous revient, née de votre réponse 166a : le sort, après le 18/11, d'un produit qui n'a ni persona ni écran.

## 1. En-tête d'identification

Exécution de vos réponses « 165c, 166a, 167a, 168a, 169a » du 04/11/2026 à 15:43, sur le pilot `digit-ai-factory`. Période : du 04/11/2026 à 15:43 au 05/11/2026 à 08:32, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 3 agents de campagne Claude Sonnet 5.5, chacun dans un arbre de travail isolé du pilot.

Intention : appliquer chacune des 5 options que vous avez choisies, jusqu'à la publication.

Test rétro : le résultat sert cette intention. Les 5 options sont en service, et les 3 sujets du registre qu'elles visaient sont clos sur une recette rejouée par la session.

## 2. Verdict

5 options appliquées sur 5. TF-2124, TF-2127 et TF-2128 sont clos ; TF-2147 à TF-2149 attendent les 3 produits. `oracle-todo` rend PASS sur l'état commité. Le pilot est publié : da8c9c7a..3ef939d3, 0 commit d'écart avec le distant après vérification par `rev-list`.

## 3. Décisions attendues

> **D-174 — Après le 18/11/2026, un produit sans persona ou sans écran, dont le parcours par persona ou l'exploitabilité rend « sans objet », peut-il se dire prêt pour la production (TF-2124) ?**
>
> - **De quoi s'agit-il** : la porte livrée hier sur votre choix pour la porte « prêt », dans l'oracle qui juge la conformité d'un produit. Avant qu'un run se dise prêt, elle exige au journal du produit deux verdicts verts : le parcours joué par chaque persona, venu de forge-tests, et l'exploitabilité jugée sur l'instance servie, venue de forge-design.
> - **Le problème** : un produit sans interface, une API ou un outil en ligne de commande, n'a pas d'écran à juger. Un produit sans persona déclarée n'a pas de parcours à jouer. Ces contrôles rendent alors « sans objet » ou « non jugé ». La règle ne les compte pas pour verts : à partir du 19/11, un tel produit ne pourra plus se dire prêt.
> - **Pourquoi vous** : c'est la portée d'une règle de doctrine que vous venez de poser, et elle décide quels produits peuvent aller en production.
> - **Recommandation : (a)** — elle garde l'exigence pour tout produit qui a des utilisateurs à l'écran. Un « sans objet » passe seulement si les exigences du produit l'ont écrit d'avance, et non parce qu'un contrôle n'a rien trouvé. Source consultée : la recette de la porte rejouée par la session, cas « un verdict NA ou SKIP n'est pas un vert ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Admettre un « sans objet » déclaré aux exigences | Un produit dont `EXIGENCES.json` déclare l'absence d'écran ou de persona passe ; un « sans objet » non déclaré bloque | Une session de construction au pilot | Possible : la condition se retire |
| (b) Admettre tout « sans objet » | Un contrôle qui ne trouve rien à juger compte pour vert | Une heure | Possible |
| (c) Ne rien changer | À partir du 19/11, un produit sans écran ni persona ne peut plus se dire prêt | Nul | Sans objet |

> **Sans réponse** : (c), ne rien changer.

## 4. Traité

La session a inscrit vos réponses au registre, puis elle a :
- appliqué elle-même le seuil et l'envoi des lots ;
- confié les 3 constructions à 3 agents ;
- rejoué chaque recette avant de reporter les commits au pilot et de clore.

- **D-165 (c), seuil de relecture** : `scripts/relever-flotte.mjs` et `references/RELECTURE-INTENTION.md` portent 6 000 000 de jetons par jour (commit bb5ecd04). Recettes rejouées par la session :
  - relevé de flotte : 16 PASS sur 16 ;
  - recette du script de relecture : 79 PASS sur 79 ;
  - recette d'ouverture du pilot : ses 2 cas du seuil passent.
- **D-166 (a), porte « prêt »** : la règle R-61 bis (porte « prêt » de l'oracle de conformité) d'`oracle-conformite-projet` juge le dernier run déclaré prêt. Un manque avertit jusqu'au 18/11/2026 inclus, puis échoue dès le 19/11 (commit 225581b1). Classe : `pret-annonce-sans-usage-reel`. Rejouée par la session :
  - rouge → vert : 1 cas sur 14 sur l'oracle d'avant, 14 sur 14 sur l'oracle corrigé ;
  - self-test du pilot : 216 PASS, 0 FAIL.
- **D-167 (a), secret** : `scripts/ranger-secret.mjs` lit la valeur sur l'entrée standard. Il refuse un fichier que git ne déclare pas ignoré. Il note au ledger le nom et l'empreinte sha256, jamais la valeur. Il est copié chez les produits par l'héritage 1.50.0 (commit b8d9026f). Classe : `secret-sans-canal-entre-sessions`.
  - Recette rejouée par la session : 51 cas sur 51.
  - Au report, un cas échouait sur l'arbre principal : il supposait l'absence de `.env` au pilot, alors que ce poste en porte un, daté du 11/08. La recette compare désormais l'état du fichier avant et après, sans le lire.
- **D-168 (a), retrait** : `oracles/hook-gestes-distants.mjs` consigne chaque création réussie avec son identifiant. Il admet un retrait `az … delete` ou `Remove-Az*` quand la même session a créé et consigné la ressource et que rien ne la cite depuis. Un groupe de ressources n'est jamais admis (commit e1b937ae). Classe : `ressource-neuve-retiree-comptee-geste-destructif`. Recettes rejouées par la session :
  - gestes distants : 106 PASS sur 106 ;
  - gestes en cours : 25 PASS sur 25.
- **D-169 (a), modèles arrêtés** : TF-2147, TF-2148 et TF-2149 sont adressés à Produit-12, Produit-71 et Produit-82. `todo/emettre-travaux.mjs` a déposé dans la boîte d'entrée de chacun un lot qui porte le constat, exit 0, sans commit chez eux.
- **Registre** : 24 événements de cette session, dont 3 clôtures, 4 candidats et 2 notes. Ces notes rectifient la trace de TF-2135 et TF-2136 : les commits cités ne sont plus dans l'historique publié, et le même correctif y porte un autre numéro, a94efad4 et 52f7c937. Le commit 3ef939d3 porte aussi les lignes de 2 autres sessions qui travaillaient dans le même arbre. L'une d'elles a clos 13 sujets, dont les correctifs de forge-audit ; nous nous sommes réparti les sujets pour ne rien clore 2 fois.
- **Arbres des agents** : les 3 arbres de cette campagne sont retirés ; leurs branches restent.

Relecture d'intention : sans objet, motif : les 3 consignes sont parties avant que le nouveau seuil soit en place, et chaque livrable a été jugé par le rejeu de sa recette.

## 5. Non traité

- La recette d'ouverture du pilot garde 2 échecs sans lien avec le seuil — motif : `hors_mandat`.
  - Un délai dépassé, déjà présent sur l'état d'avant (50 PASS, 1 FAIL).
  - Une comparaison de 2 lancements qui lisent les transcripts vivants : leur compte grandit entre les 2 tant que d'autres sessions travaillent. Inscrite en TF-2151.
- La porte « prêt » n'est pas jouée à l'écriture du `run_close` par `ledger.mjs` de forge-agents — motif : `borne_atteinte`, l'agent n'avait mandat que sur le pilot. Inscrit en TF-2152. Le rapport `--json` de forge-tests, que ce ledger refuse, est inscrit en TF-2153.
- La publication du dépôt des noms confidentiels, où l'autre session a déclaré la graphie de TF-2130 par un commit local (9171226) — motif : `hors_mandat`, ce geste et sa demande de GO appartiennent à cette session.

## 6. Écarts à la lettre

- Vous avez choisi 166a, « les deux contrôles verts » → la règle ne compte pour verts que les PASS → un « sans objet » qui passerait sans être déclaré viderait la porte ; la question vous revient sous D-174.
- Vous avez choisi 165c, qui fait reprendre les relectures → les 3 consignes d'agents sont parties sans relecture → elles avaient été lancées avant que le nouveau seuil soit en place, et chaque livrable a été jugé par sa recette rejouée.

## 7. Risques

- **Des produits sans écran bloqués à partir du 19/11** si D-174 reste sans réponse.
  - Signal : la porte « prêt » en FAIL sur un produit dont un contrôle rend « sans objet ».
  - Parade : répondre à D-174 avant le 19/11.
- **L'empreinte d'un secret faible peut se retrouver par essais**, et le ledger est versionné.
  - Signal : un mot de passe court rangé par le geste.
  - Parade : le geste vise les clés et les jetons longs, et son en-tête le dit.

## 8. Prochaines actions

Ordre : votre seul geste d'abord, puis les actions de la session par coût décroissant de ne pas les faire.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Supprimer le dossier vide laissé par un agent à la racine du disque, toujours présent ce matin | `neuve` | manuelle_utilisateur | acces : la garde de sécurité du harnais refuse ce `rmdir` à la session comme à l'agent de campagne ; aucun script du parc ne nettoie la racine du disque ; aucune API de plateforme pour un dossier local | `rmdir C:\tmp-IVSd` | si rien n'est fait, un dossier vide reste à la racine du disque |
| A-2 | Construire l'option retenue sous D-174 | TF-2124 | auto_ia | dependance_bloc_3 : attend votre réponse à D-174 | `oracles/oracle-conformite-projet.mjs` | si rien n'est fait, des produits sans écran sont bloqués dès le 19/11 |
| A-3 | Faire jouer la porte « prêt » par `ledger.mjs` à l'écriture d'un `run_close` « prêt », et lui faire accepter le rapport de forge-tests | TF-2152 | auto_ia | borne_atteinte : nés en fin de tour | `digit-ai-forge-agents`, TF-2152 et TF-2153 | si rien n'est fait, la porte ne joue que si la session la rejoue |
| A-4 | Constater la correction chez les 3 produits, puis clore | TF-2147 | auto_ia | dependance_externe : chaque produit traite son lot à sa prochaine session | `node oracles/oracle-modeles-tiers.mjs` | si rien n'est fait, les clôtures restent ouvertes après le changement |
| A-5 | Traiter les 2 recettes en échec et la recette d'ouverture instable | TF-2151 | auto_ia | borne_atteinte : nés en fin de tour | `todo/TODO.jsonl`, TF-2151 et TF-2154 | si rien n'est fait, une recette rouge masque un vrai défaut |

## 9. Traces

- [Synthèse de la veille](Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2004-11%20-%2020261104a.md), qui posait D-165 à D-169
- Commits du pilot : 225581b1, b8d9026f, e1b937ae, bb5ecd04 et 3ef939d3, publiés.
- `todo/TODO.jsonl` : TF-1948, TF-2115, TF-2124, TF-2127, TF-2128, TF-2147 à TF-2149, TF-2151 à TF-2154 ; `decisions/REGISTRE.jsonl` : D-174.
- Lots `pilot - TRAVAUX - 20261104a.md` dans `input/00-travaux/` de Produit-12, Produit-71 et Produit-82.
