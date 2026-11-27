---
destinataire: humain
---

# Synthèse Mandat — retours et TODOs du 26/11 (26-27/11/2026)

## 0. Synthèse d'ouverture

Les 8 lots de retours arrivés depuis le 25/11 sont au registre, et 5 des 7 sujets neufs sont corrigés, avec 1 sujet resté d'hier, dans le pilot et 3 forges, toutes publiées. Le juge de fin de tour refuse désormais une décision écrite hors de sa forme numérotée et n'accuse plus le relais court d'un agent qui tourne. Une page HTML livrée ne se scelle plus sans le verdict complet des oracles. Les juges des pages et des documents imprimés ne se trompent plus sur un champ trop étroit, une feuille de style non chargée ou un tableau Word, vérifié sur 2 vrais programmes de formation. Une décision vous revient : faire remettre sur la charte actuelle les polices du dossier de marque.

Livré : [Synthèse des retours du 26/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2026-11%20-%2020261127a.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les TODOs et retours ». Dépôts touchés : le pilot `digit-ai-factory`, forge-websec, forge-agents et forge-design. Période : du 26/11/2026 à 14:44 au 27/11/2026 à 08:15, heure de Paris. Session pilote Claude Opus 5.5, avec 3 agents de campagne (Sonnet 5.5) et 1 agent constructeur (Opus 5.5).

Intention : vider la boîte des retours et faire avancer le registre, en exécutant tout ce qui ne vous revient pas.

Test rétro : la boîte est vide ; chaque sujet neuf est corrigé avec une recette rejouée par la session, ou nommé avec sa raison ; le faux positif des tableaux Word est vérifié sur les documents réels du produit, pas seulement sur une fixture.

## 2. Verdict

8 lots ingérés, 7 sujets créés (TF-2886 à TF-2892) et 5 relevés en cours de travail (TF-2893 à TF-2897) ; 6 sujets clos en corrigé, mesurés au registre ; 4 dépôts publiés, 0 commit d'avance mesuré par `git rev-list` ; oracle du registre PASS à chaque écriture.

## 3. Décisions attendues

Une seule décision neuve vous revient. Elle porte sur le dossier de marque de Digit-AI, qui fournit les polices des pages HTML : il dit suivre la charte commune des pages, mais il porte encore les polices d'avant le changement de septembre, et la session ne peut pas écrire dans ce dépôt sans votre accord.

> **D-246 — Confie-t-on au dépôt marketing de Digit-AI la remise de ses jetons de pages HTML sur la charte du socle (Montserrat et Inter, D-5 (a)), au lieu de Roboto et DM Sans ?**
> - **De quoi s'agit-il** : le dossier de marque de Digit-AI fournit les jetons de couleurs et de polices des pages HTML ; c'est `donnees/marque/tokens.css` du dépôt `digit-ai-marketing`.
> - **Le problème** : ce fichier, écrit le 11/09/2026, dit être la charte du socle mais porte Roboto et DM Sans ; le socle est passé à Montserrat et Inter le 23/09. Une page construite dessus a passé la critique d'implémentation sur la charte périmée.
> - **Pourquoi vous** : la correction s'écrit chez un produit, et la session n'y a aucun mandat d'écriture (relevé d'ouverture du 26/11 : « aucun mandat déclaré »).
> - **Recommandation : (a)** — le produit garde la main sur ce qu'il retient, et le correctif est mécanique. Source consultée : `input/00-retours/Produit-82 - RETOURS - 20261126b.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | La session dépose un lot de travaux dans la boîte d'entrée du produit, qui l'applique à sa prochaine session | 1 lot, aucun commit chez le produit | le produit écarte le lot avec son motif |
| (b) | Vous donnez à la session un mandat d'écriture chez le produit pour régénérer les jetons tout de suite | 1 commit chez le produit | revenir au commit précédent |
| (c) | Rien n'est fait | aucun | sans objet |

> **Sans réponse** : les pages construites sur ce dossier de marque continuent de sortir en Roboto et DM Sans.

- D-221 : rouvrir l'exclusion « Pas de vidéo » du mode opératoire des réseaux, posée le 16/11, inchangée.
- D-231 : confier dès maintenant à Codex et Antigravity le code borné, posée le 21/11, inchangée.

## 4. Traité

Chaque correction ci-dessous a sa recette rejouée par la session avant publication.

- **Sas des retours** : 16 fichiers accueillis et pseudonymisés, formes PASS ; 8 lots ingérés, dont 2 sans sujet pour les forges.
  - Mesuré sur : les sorties de `todo/accueillir-lot.mjs` et `todo/ingerer-lot.mjs`, relues à 15:27 le 26/11, périmètre 16 fichiers.
- **Registre** : 6 sujets rattachés, 4 à une classe existante et 2 à une classe créée (`todo/CLASSES.json` 1.75.0) ; 6 décisions sans ressort humain consignées.
- **Nom réel remis en pseudonyme** : la copie de travail du registre et de la synthèse du 25/11 portait le nom réel d'un produit sur 2 lignes, déjà indexées. Remises à l'état publié avant toute écriture.
- **Juge de fin de tour, pilot** (TF-2891, TF-2887) : une tête « Décision N » qui porte des options est refusée avec son remède ; un relais de 60 mots au plus, sans écriture, pendant qu'une tâche du tour tourne, n'est plus jugé comme une restitution. Le gabarit de restitution et le hook d'ouverture disent la règle neuve.
  - Preuve, rejouée par la session : `hook-restitution.test.mjs` exit 0, `oracle-synthese --self-test` exit 0, `self-test.mjs` 310 PASS, 0 FAIL, et le relevé d'ouverture 105 PASS, 0 FAIL ; les 2 cas neufs étaient affichables sur le code d'avant.
  - Mesure de bruit par l'agent : 12 têtes « Décision N » dans 481 synthèses, toutes du 30/08, aucune après le format B.
- **Sceau d'une page HTML, pilot** (TF-2870, part du pilot) : `scripts/verifier-jugement.mjs` refuse de sceller une page livrée sans PASS du lanceur complet sur son contenu exact ; la sortie se déclare avec un motif. Le hook de fin de tour repose son sceau anti-réécriture en le déclarant.
  - Preuve : banc 30 PASS, 0 FAIL ; 5 cas neufs rouges sur le script d'avant, qui scellait les 3 pages fautives.
- **Forge-websec** (TF-2884) : oracle-dast 0.5.1 signale `DAST-IMAGE-MOBILE` quand un script ZAP natif tirerait lui-même l'image `weekly`. Preuve, rejouée : 429 PASS, 0 FAIL ; le bloc neuf rend 6 FAIL sur 0.5.0. Publié : c1a7272.
- **Forge-agents** (TF-2886) : `render_page` mesure la valeur affichée d'un champ dans sa police calculée, à chaque largeur jugée. Publié : 1dffd74 ; skill installé sur le poste, `oracle-skills --appliquer` PASS.
  - Preuve, rejouée : fixture rouge FAIL, verte PASS, fixture de TF-0847 PASS sans constat neuf ; agrégat de quality-oracles PASS.
- **Forge-design, ressources non chargées** (TF-2888) : une page jugée sans ses feuilles de style rend 1 constat nommé avec son remède, au lieu de 10 règles en échec sans cause ; avec l'instance donnée, elle se juge.
- **Forge-design, tableaux Word** (TF-2892) : DP4 (la règle qui compare la hauteur des colonnes d'une page) ne prend plus un tableau sans trait pour 2 colonnes de page. 2 passes de plus ont été demandées à l'agent après rejeu de la session sur les vrais programmes du produit, copiés en lecture seule.
  - Preuve, rejouée sur 431241d : 1er programme PASS (FAIL à 51,0 et 86,1 mm avant) ; 2e programme PASS (FAIL à 144,8 mm avant) ; recette entière de forge-design rejouée par la session : « Tout vert — 87 oracles, 197 règles verrouillées ».
- **Nom protégé dans forge-design** : la porte de publication a refusé l'envoi sur 10 occurrences d'un nom de produit, déjà publiées, en valeur d'exemple de 7 fichiers. Remplacé par une valeur neutre ; recette entière rejouée tout verte avant l'envoi. Les 5 commits locaux de l'agent, dont les instantanés portaient le nom, sont regroupés en 1. Publié : 6595c6e. Le même nom, inscrit à la table le 26/11, était dans 5 fichiers suivis du pilot : pseudonymisés par `todo/anonymiser-suivis.mjs`.
- **Installation des skills du 25/11** : `oracle-skills` rend PASS, copies à jour.
- Relecture d'intention : sert, sur les 5 consignes ; celle de forge-websec sert après 1 passe, qui dit le partage du travail.

## 5. Non traité

- TF-2889, dossier de marque — motif : decision, D-246 au bloc 3.
- TF-2890, une page jugée contre sa maquette — motif : borne_atteinte, un oracle de fidélité demande une conception à part.
- TF-2870, part du skill Client-A — motif : hors_mandat, ce skill est synchronisé depuis votre compte claude.ai, hors de tout dépôt.
- TF-2893, historique publié de forge-design — motif : decision, réécrire une histoire publique est un geste irréversible, la même question que D-90 pour forge-audit.
- TF-2894 à TF-2897, inscrits ce jour — motif : borne_atteinte, relevés en fin de campagne.

## 7. Risques

- **Réglage des tableaux sans trait** : 2 vraies colonnes de texte reliées par 3 blocs alignés seraient lues comme un tableau, et DP4 se tairait. Signal : un document à 2 colonnes déséquilibrées livré PASS. Parade : la limite est écrite au relevé de ce que l'oracle ne juge pas ; la relecture du rendu reste due.

## 8. Prochaines actions

Ordre : d'abord la décision qui débloque un produit, puis les petites corrections du pilot, puis la conception.

| Sél. | Action | Identifiant | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à la décision sur le dossier de marque par sa lettre | TF-2889 | manuelle_utilisateur | decision | écrire « 246a », « 246b » ou « 246c » ; la question est consignée dans `decisions/REGISTRE.jsonl` | si rien n'est fait, le dossier de marque garde l'ancienne charte |
| A-2 | Refuser une option inconnue dans l'agrégat des recettes du pilot | TF-2895 | auto_ia | borne_atteinte | `oracles/self-tests.mjs` | si rien n'est fait, une demande d'aide relance toute la recette |
| A-3 | Aligner le préjugement sur le hook pour un message d'attente | TF-2897 | auto_ia | borne_atteinte | `oracles/hook-restitution.mjs` | si rien n'est fait, le préjugement et le hook continuent de diverger |
| A-4 | Concevoir l'oracle de fidélité d'une page à sa maquette | TF-2890 | auto_ia | borne_atteinte | `digit-ai-forge-design/oracles/` | si rien n'est fait, une page portée sans la structure de sa maquette passe encore les juges |

## 9. Traces

- Lots : `input/00-retours/` ; registre : `todo/TODO.jsonl`, `todo/CLASSES.json` ; décisions : `decisions/REGISTRE.jsonl` (D-246)
- Pilot : `oracles/hook-restitution.mjs`, `oracles/oracle-synthese.mjs`, `oracles/hook-ouverture.mjs`, `scripts/verifier-jugement.mjs`, `gabarits/RESTITUTION.md` ; commit 9c7030c7, qui regroupe celui de l'agent (c044918d), et celui de cette synthèse
- Forges publiées : forge-websec c1a7272 ; forge-agents 1dffd74 ; forge-design 6595c6e, qui regroupe les 5 commits de l'agent
- Relectures d'intention : `todo/relectures-intention.jsonl` (RI-20261126-02 à 04)
