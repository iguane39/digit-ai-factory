# Retours forges — Produit-12 — 20261002a

- **Contexte** : autre — décision humaine D-19 (a) du 2026-10-02 : rédiger la cascade du produit (intention, stratégie, tactique, opérationnel) à l'étape de conception, rattacher chaque exigence à une tactique, et le remonter à la factory, « car ça aurait dû être fait suite directement à ma demande, et devra être fait pour les autres futurs produits ».
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: retour` de RS-29, RS-30 et RC-7, consignées le 2026-10-02 juste après la réponse humaine, avec la mesure de la cascade.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-02 dans le SAS d'arrivée du pilot (`<pilot>\input\00-retours\_arrivee\`), sur mandat humain D-19 (a) (« le remonter à la Factory aussi ») — ce lot ne se modifie plus.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du produit : la série RS s'arrêtait à RS-28 (lot 16), la série RC à RC-6 (lot 15).

---

## pilot (`digit-ai-factory`)

La règle de la cascade s'applique à chaque demande, jamais au produit lui-même : aucun artefact ne porte la cascade d'un produit, aucune étape ne l'écrit, aucun contrôle ne rejoue la chaîne d'une exigence jusqu'à l'intention.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-29 | majeur | générique | **Un produit n'a pas de cascade propre : la règle Intention > Stratégie > Tactique > Opérationnel n'est appliquée qu'à chaque demande, une par une.** `references\INTENTION.md` 1.1.0 la prescrit « sur tous types de demande » (l. 21-23) et la fait juger sur les études (E9, E10) et sur le bloc 1 des restitutions (S51) ; aucun gabarit, aucune étape de run et aucun contrôle ne la portent pour le produit. Mesuré chez ce produit le 2026-10-02 : 99 exigences et 8 besoins, 0 stratégie et 0 tactique écrites (`grep -rli "stratégi"` sur `forge\BRIEF.md`, `forge\etapes\conception\`, `docs\projet\` : 0 fichier) ; 11 fichiers portent un « Test rétro », tous des restitutions ou l'étude. L'étude d'opportunité du 01/10, commandée par une demande qui citait « définir la stratégie, la tactique puis la mise en oeuvre opérationnelle », a écrit la cascade de l'étude et le cadrage métier, pas celle du produit, et RS-25 (lot 15) ne demande que la descente du texte. L'humain, le 02/10 : « ça aurait dû être fait suite directement à ma demande, et devra être fait pour les autres futurs produits ». Écrite le 02/10 chez ce produit : `forge\etapes\conception\cascade\CASCADE.json` et sa vue `CASCADE.md` — 5 stratégies, 14 tactiques, 99 exigences sur 99 rattachées, porte `construire_cascade.py --porte` PASS, 5 défauts injectés vus. | (1) Un gabarit « cascade du produit » : l'intention citée dans les mots du client, des stratégies à manque, indicateur et cible, des tactiques à alternative écartée et source, et l'opérationnel rattaché ; écrit à l'étape de conception du run d'ouverture, mis à jour à chaque run de version. (2) Une porte qui rejoue la chaîne avant toute clôture de run, chaque exigence remontant à une seule tactique, puis à une stratégie, puis à l'intention, sur le modèle du script du produit. (3) Au gabarit `ETUDE-OPPORTUNITE.md` : quand l'intention citée demande la stratégie et la tactique d'un produit, le verdict produit la cascade du produit, pas seulement celle de l'étude. Règle qui aurait évité le retour : `INTENTION.md` l. 21-23, écrite sans artefact ni contrôle à l'échelle d'un produit. |
| RS-30 | mineur | générique | **Aucune famille du catalogue `gabarits\documents\catalogue.jsonl` ne couvre la cascade d'un produit.** La fiche de conception de `CASCADE.md`, remplie avant l'écriture, a dû déclarer `famille: aucune — candidature remontée` (G6 PASS sur la fiche puis sur le document, 6 parties sur 6, le 2026-10-02). | Une famille `gd-cascade-produit` au catalogue : lecteur (le demandeur qui ratifie, puis les sessions qui ajoutent une exigence), 6 parties (intention, stratégie, tactique, opérationnel, test rétro, tenue à jour), format Markdown généré depuis une source JSON. |

## forge de conception (`digit-ai-forge-conception`)

Le référentiel d'exigences relie une exigence à un besoin, et rien au-dessus : ni le moyen qu'elle réalise, ni l'effet qu'il sert.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-7 | majeur | générique | **Le schéma du référentiel n'a aucun lien d'une exigence vers une tactique ni vers une stratégie.** `skills\redige-les-exigences\references\schema-referentiel.md` : 8 champs par exigence, dont `besoin` ; les besoins sont une liste plate sans indicateur ni cible ; `oracle-tracabilite` T1 vérifie seulement que le besoin existe. Chez ce produit, au 2026-10-02 : le seul besoin formulé comme un effet (B-01, « réduire le temps de traitement ») n'a ni mesure ni cible. En reconstruisant la cascade, 5 tactiques sur 14 n'ont trouvé leur alternative écartée écrite nulle part, et 4 stratégies sur 5 n'ont pas de cible. Le rattachement a dû vivre hors du référentiel (`cascade\CASCADE.json`), faute de champ prévu. | Un champ facultatif `tactique` sur l'exigence et deux tableaux racine, `strategies` (effet, manque, indicateur, cible) et `tactiques` (moyen, alternative écartée, source), ou un artefact compagnon. Une règle T5 dans `oracle-tracabilite` : chaque exigence remonte à une tactique connue, puis à une stratégie, puis à l'intention de `ENTRANT.md`. `derive-les-vues` rend la vue de la cascade, scellée comme les autres. Aucune règle existante ne couvre la classe : classe à créer. |

## Remarques restées au produit

Ce que le produit a constaté ce jour et garde chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 4 stratégies sur 5 sans cible chiffrée, et 5 tactiques sur 14 à justification reconstruite | déclarées dans `CASCADE.md`, soumises à la ratification du demandeur | non | propre aux choix de ce produit ; la classe générale part en RC-7 |
| 7 exigences sur 99 qu'aucun test ne cite (E-051 à E-053 en V2, E-093, E-094, E-098, E-099 en V1), et E-092 et E-095 citées par un texte qui les dit « bientôt disponibles » | mesurées par la porte de la cascade, laissées au run de version | non | dette de mise en œuvre de ce produit |
| L'entrée seq 224 du ledger, écrite par une autre session, porte l'heure 05:35:00Z alors que l'horloge relevée à 05:34:43Z ne l'avait pas encore atteinte | consigné au ledger avec l'entrée suivante | oui | classe déjà au registre (famille `horodatage-invente`) : rien de neuf à remonter |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le seul document neuf, la cascade, n'avait aucune famille où se ranger, et c'est l'objet de RS-30.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge\etapes\conception\CASCADE.md` (vue générée de `cascade\CASCADE.json`) | aucun gabarit de famille, faute de famille (RS-30) ; fiche de conception 1.0.0 | une famille qui fixe le lecteur et les parties de la cascade d'un produit | aucun retour du lecteur à la date du lot : la cascade est remise le 2026-10-02 pour ratification | les 6 parties, le contrôle de la chaîne et sa vue générée | générique |

## Documents mûrs

Aucun document mûr : la cascade est remise le 2026-10-02 pour ratification, sans jugement de son lecteur ni reprise à ce jour.

## Confirmations positives

- **G6 se joue sur une famille absente** : la fiche déclare `aucune — candidature remontée` et passe, ce qui laisse écrire le document sans forcer une famille voisine.
- **La règle de la cascade se mécanise à l'échelle d'un produit** : contrôle de la chaîne en Python standard, sans dépendance, exécuté en une seconde, rouge vu sur 5 défauts injectés.

## Ordre recommandé

1. **RS-29** : sans gabarit ni porte, chaque produit refait ce que ce produit a reconstruit après coup, ou ne le fait pas.
2. **RC-7** : le champ et la règle T5 rendent la chaîne jugeable dans le référentiel lui-même, au lieu d'un fichier à côté.
3. **RS-30** : une ligne au catalogue, une fois la forme du gabarit fixée par RS-29.

## La règle qui aurait évité le retour

- **RS-29** : `INTENTION.md` l. 21-23, « À appliquer sur tous types de demande » — écrite sans artefact ni contrôle à l'échelle d'un produit ; classe `regle-ecrite-sans-oracle-qui-la-joue`.
- **RS-30** : le catalogue des familles de documents ; classe `gabarit-famille-manquante`.
- **RC-7** : aucune. Classe à créer : clé `exigence-sans-tactique-ni-strategie`, famille `contrat-interface-forge`, libellé « Une exigence ne remonte qu'à un besoin : le moyen qu'elle réalise, l'alternative écartée et l'effet attendu ne sont écrits nulle part, et aucun contrôle ne rejoue la chaîne jusqu'à l'intention ».
