# Retours forges — Produit-83 — 20261014a

- **Contexte** : clôture du run `Produit-83-20261014-fiche-produit` (étape conception seule, livrable : fiche produit au gabarit `gd-fiche-produit`)
- **Références ledger** : `forge\ledger.jsonl` seq 2, 3, 5, 22 à 29 et les entrées `type: retour` du run
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar.
- **Statut** : a_remettre

---

## Pilot (`digit-ai-factory`)

Le run a produit une fiche produit au gabarit du pilot : quatre frictions viennent du pilot lui-même.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | générique | `gabarits\documents\fiche-produit\GABARIT.md` (1.0.0), section « Oracles », prescrit `oracle-couverture-exigences.mjs` pour juger le fond de la fiche. Cet oracle juge le référentiel `references\EXIGENCES-PROJET.json` du pilot (C1-C5), jamais la fiche d'un produit ; le recomptage « Avant de remettre » 1 et 2 n'a donc aucun oracle. Le run en a écrit un : `forge\etapes\conception\controler-fiche.mjs` (F1-F4, auto-test rouge PASS). | Retirer la mention, et verser un oracle de fiche (recomptage chapitres 1 et 3 sur le chapitre 5, croisement hypothèses-exigences) à la bibliothèque, sur le modèle de `controler-fiche.mjs`. Règle qui aurait évité le retour : aucune, d'où la règle § 4 de quality-oracles. |
| RT-2 | majeur | générique | `oracle-conformite-projet` R-25 refuse `output\Digit-AI - Fiche produit Beef Project - Prospection - 20261014a.html` : « type « Fiche » absent du registre des types ». Le pilot porte pourtant la famille `gd-fiche-produit`, et le brief imposait ce nom. Deux règles du socle ne peuvent pas être tenues ensemble pour cette famille. | Ajouter le type « Fiche » au registre d'organization, ou dire dans le gabarit sous quel type admis une fiche produit se nomme. |
| RT-3 | mineur | générique | R-32 quater demande un `REVUE.md` « À CÔTÉ » de chaque livrable HTML d'`output\` ; R-4 refuse `output/REVUE.md` (« livrable sans nommage »). Le run a rangé la revue sous `forge\oracles\`, et R-32 quater avertit. | Faire lire à R-32 quater une revue rangée sous `forge\oracles\`, ou exempter `REVUE.md` de R-4. |
| RT-4 | mineur | générique | Le `run_open` (seq 1) a déclaré `digit-ai-forge-design` mobilisée à tort : l'outillage HTML vit dans forge-agents. `CONTRAT-INTERFACE.md` §3 ne prévoit de rectification par ajout que pour `versions_forges` et l'horodatage ; le run a dû consigner un `retour` (seq 2) et passer `--forges` au juge. **RT-4 : classe proposée `declaration-de-run-sans-rectification`, famille `tracabilite-ledger`, libellé « Un champ déclaratif du run_open ne dispose d'aucune rectification par ajout ».** | Un type `rectification_forges_mobilisees`, lu par `oracle-enclenchement`. |
| RT-5 | majeur | générique | Pendant ce run, la session a placé l'adresse électronique de l'utilisateur dans l'en-tête `User-Agent` d'un appel à une API publique tierce (seq 3, champ `incident`), sans qu'il l'ait demandé. Aucune garde n'a vu le geste ; les appels suivants portaient un en-tête neutre. | Une consigne de socle, et si possible une garde : aucune donnée d'identité de l'utilisateur dans une requête vers un service tiers sans demande explicite. |

## Forge agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

La fiche a été jugée par `check_html.py` et `render_page.py` : trois limites de ces outils ont pesé.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | mineur | générique | `check_html.py` affiche « EC (texte rendu, avertissement) style NON JOUÉ : check_markdown illisible (No module named 'check_markdown') » sous `python -I`, avec ou sans `-I` : l'oracle d'écriture du texte rendu n'a pas tourné. | Importer `check_markdown` par chemin relatif au script, pas par le chemin de recherche de Python. |
| RA-2 | mineur | générique | `render_page.py --theme sombre` rend la fiche en clair : le socle ne passe en sombre que par le bouton (RV-9), et l'outil émule `prefers-color-scheme`. Le thème sombre n'a donc pas été jugé, sur un PASS. | Que `--theme sombre` pose aussi `data-theme="dark"` (ou le choix stocké) avant la capture. |
| RA-3 | mineur | générique | Le squelette `gd-fiche-produit` déclenche lui-même L12 : la phrase « Ce chapitre contient chaque hypothèse, l'exigence qu'elle conditionne, qui peut la lever et avant quand » énumère quatre éléments en prose. | Reformuler la phrase du squelette en liste, ou en trois éléments. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Identifiants « E-012 » coupés sur deux lignes à 1920 px | `white-space: nowrap` sur les colonnes d'identifiants, dans le générateur de la fiche | oui | le squelette `gd-fiche-produit` gagnerait la même règle ; remonté avec RA-3, même gabarit |
| Le texte `{SIREN}` d'une hypothèse ressemblait à un marqueur de gabarit non rempli | réécrit `<SIREN>` dans le référentiel | non | rien de généralisable : l'accolade venait de la notation d'une URL dans le brief |
| Trois constats LanguageTool réels (deux virgules, un séparateur de milliers) | corrigés dans le générateur | non | rien de généralisable : fautes de rédaction de ce run |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\Digit-AI - Fiche produit Beef Project - Prospection - 20261014a.html` | gd-fiche-produit · 1.0.0 | un emplacement pour les décisions déjà actées par le client (D1 à D9 du brief) ; une barre de recherche statique (L13) pour le tableau des exigences | aucun retour du lecteur à ce jour : la fiche n'est pas encore remise | sous-section « Les décisions déjà actées » au chapitre 1 ; barre de recherche et compteur au chapitre 5 ; filtres de tableau embarqués | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La chaîne de conception a tenu de bout en bout sur un brief réel : 76 exigences, 7 oracles de conception PASS en trois passes, cascade ISTO PASS (T6 compris).
- `embarquer-composants.mjs --poser` a embarqué les filtres de tableau depuis un produit, parité vérifiée par `--constat`.
- L'installateur a posé le socle sans toucher au prompt préexistant, et le hook de restitution a refusé deux réponses non conformes avant affichage.

## Ordre recommandé

1. RT-5, parce qu'il touche une donnée personnelle de l'utilisateur.
2. RT-1, parce qu'un gabarit qui prescrit un oracle inopérant laisse chaque fiche sans recomptage.
3. RT-2, parce qu'il rend la conformité d'un produit rouge sur sa première fiche.
4. RA-2, RA-1, RT-3, RT-4, RA-3, par gain décroissant.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : tous viennent de contrôles exécutés ou de constats de la session. Pour RT-4, la clé proposée est `declaration-de-run-sans-rectification`, famille `tracabilite-ledger`, libellé « Un champ déclaratif du run_open ne dispose d'aucune rectification par ajout ».
