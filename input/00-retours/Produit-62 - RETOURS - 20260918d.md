# Retours forges — Produit-62 — 20260918d

- **Contexte** : le commanditaire a demandé d'expliquer les écarts entre le rapport Power BI d'origine et le rapport reconstruit, leur origine et leur traitement. L'instruction a séparé **3** familles de causes, et a montré que le contrat de qualification proposé la veille (RF-27) n'en distingue que 2 : il manque la famille qui coûte le plus cher à confondre — celle du chiffre qui diffère parce que la **définition** a changé.
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-18 à 18:10 (`type: execution`) et 18:15 (`type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-18

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-forge-data (contrat `qualification-rapport@1`, verbes `reconcilier` / `restituer`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-31 | majeur | générique | **Le contrat de qualification n'a pas de classe « définition changée » : un chiffre qui diffère parce que la couche cible RECALCULE ce que la source STOCKAIT n'est ni un écart assumé ni un défaut, et le ranger en défaut envoie corriger ce qui n'est pas cassé.** Fait observé le 2026-09-18 sur Produit-62. Les **4** écarts de chiffres d'une qualification réelle se répartissent en 2 familles que le contrat de RF-27 ne sépare pas. **Famille « donnée manquante »**, à corriger sans arbitrage : la garantie bancaire demandée est vide sur les **755 088** lignes du modèle publié — la table source n'a jamais été chargée ; et les remises de rang 1 divergent de 0,828 % à cause de **2 lots exactement** (`FRA-00020-026-P0000354-HS27` pour -24 000,00 et `FRA-00027-026-P0000182-CT1765` pour -32 481,88, soit -56 481,88, l'écart **en totalité**), les 218 autres lots étant identiques au centime. **Famille « définition changée »**, qui demande un arbitrage métier et aucune correction : la vue cible recalcule les montants annuels par `SUM(...) GROUP BY lease_sk, year` là où la source stockait une valeur annuelle figée. Pour le chiffre d'affaires certifié N-1, **122 écarts sur 122** tombent sur un nombre **entier** de douzièmes (1/12 à 11/12) — les baux dont l'année précédente est incomplète. Pour le loyer variable N-1, seulement **5 sur 316** (1,6 %) : le montant est irrégulier par nature, et **32** baux passent de zéro à une valeur. Dans les 2 cas le chiffre publié n'est pas faux — il répond à une autre question. **Ce que la confusion coûte** : les 4 écarts sont partis au même bac « écart non assumé », et 2 d'entre eux auraient envoyé une équipe chercher un bug là où il n'y a qu'une décision à prendre. *Une qualification qui ne distingue pas « pas chargé » de « pas la même définition » produit une liste de bugs dont la moitié n'en sont pas.* | **(1)** Une **4e classe de verdict** au contrat `qualification-rapport@1` : `definition_changee`, entre `ecart_assume` et `ecart_non_assume` — elle porte la définition d'origine, la définition cible, et la question à trancher. **(2)** Un **test mécanisable** pour la reconnaître, éprouvé ici : quand la cible recalcule un agrégat sur une fenêtre temporelle, comparer le rapport publié/référence à des fractions régulières de cette fenêtre ; une proportion écrasante de fractions entières (122/122) signe un recalcul sur fenêtre incomplète, une proportion faible (5/316) signe une définition réellement différente. **(3)** Une **règle de rédaction** : tout agrégat que la couche cible recalcule au lieu de le reprendre porte, au dictionnaire de colonnes, la phrase qui dit ce qu'il mesure désormais — sans quoi la différence se découvre à la réconciliation, bail par bail. **(4)** Pour le verbe `reconcilier` : quand un écart est détecté, rendre aussi le **nombre d'entités en écart** et le **nombre d'entités identiques** — ici 2 lots contre 218, ce qui a localisé la cause immédiatement, quand le seul pourcentage (0,828 %) ne disait rien. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le segment de pays liste 9 valeurs au lieu de 8 parce qu'il a été rebranché de la table de faits vers la dimension | diagnostiqué et porté en décision au commanditaire, avec 3 traitements chiffrés | oui, en partie, et c'est déjà l'objet de la dimension « comparaison des rendus » de RF-29 : un filtre rebranché vers une dimension cesse de suivre la période, et aucun contrôle de définition ne le voit | remonté via RF-29 |
| Les 2 lots dont la remise manque restent à instruire dans le chargement d'amorçage | action ouverte chez le produit | non — le fait est propre à ce jeu de données ; c'est la **façon de le localiser** qui est générique, et elle est portée par RF-31 (4) | resté au produit |
| L'entrepôt Databricks n'était pas interrogeable pendant l'instruction (profil d'authentification non ouvert) | contourné sans perte : les mêmes questions ont été posées au modèle publié en DAX, qui lit la même donnée | non — incident de poste, pas de forge | resté au produit |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de la bibliothèque sur ce lot : le diagnostic est un livrable du produit, de type « Diagnostic » au registre d'organization, écrit sans gabarit. Le manque signalé aux lots `20260918b` et `20260918c` se précise une 3e fois : un gabarit « Diagnostic d'écarts » — constat, cause prouvée, origine, traitements chiffrés avec leurs exclusions, bornes — rendrait les 3 documents de ces 2 jours comparables entre eux.

## Confirmations positives

- La règle du produit « un test proposé s'exécute » a tenu : aucune cause n'est écrite sans la mesure qui l'établit, et l'hypothèse la plus séduisante — une différence de méthode d'agrégation entre les 2 côtés — a été **écartée par la mesure** avant d'être écrite, les clés s'étant révélées uniques des 2 côtés.
- Le socle de données a été vérifié avant d'expliquer quoi que ce soit : les lignes par pays sont identiques des 2 côtés, ce qui a évité de chercher une perte de données là où il n'y en a pas.
- La localisation au lot près a fait passer un écart de « 0,828 %, cause inconnue » à « 2 lots nommés, cause à lire sur 2 lignes » en une requête.

## Ordre recommandé

1. **RF-31** — la 4e classe et le test qui la reconnaît tiennent en peu de code, et ils évitent d'envoyer une équipe corriger des chiffres qui ne sont pas faux.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-31** → `controle-vrai-sur-le-mauvais-invariant` (famille `regle-morte`, correspondance **approchée** : la réconciliation mesure un écart de VALEUR — ce qu'elle fait justement — là où l'invariant à protéger est « le rapport répond à la même question qu'avant » ; un écart de valeur peut signer une donnée manquante, un calcul faux, ou une définition changée, et le contrat ne donne qu'un seul bac pour les 3). Classe candidate, même famille, libellé proposé : `ecart-de-valeur-sans-classe-de-cause` — « une comparaison chiffrée range dans le même bac ce qui est cassé et ce qui a changé de définition ; le lecteur reçoit une liste de défauts dont une partie ne demande aucune correction, et la crédibilité de la liste entière en souffre ».
