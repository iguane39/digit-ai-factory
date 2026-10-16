# Retours forges — digit-ai-marketing — 20260930a

- **Contexte** : autre — deux décisions humaines du 30/09/2026, après un défaut signalé sur un livrable : le deck PowerPoint d'une propale s'affichait en éclats sur le poste d'un collègue, qui n'a pas la police du corps de texte.
- **Références ledger** : `forge\ledger.jsonl` seq 485, 486, 503, 504 (entrées `type: retour`) ; seq 482 (diagnostic), 496 et 497 (réponses humaines), 500 (décision sur les documents ouverts), 501 et 502 (nouvelle version du deck, correction des chaînes d'export).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 30/09/2026 (copie dans le SAS d'arrivée du pilot)

Décisions humaines, mot pour mot :

> 57a + à intégrer côté Factory pour chaque document généré afin de s'assurer que l'erreur ne se reproduise plus.

> 58a + génère la nouvelle version supprimant le problème de caractères. Ne pose plus la question sur les documents ouverts. Regénère dans tous les cas une nouvelle version et informe l'utilisateur que le document ouvert n'a pas pu être déplacé, qu'il le sera au prochain tour. Et remonte ça à la Factory.

« 57a » retient la réparation des polices hors PowerPoint, puis le contrôle et la réparation après chaque export. « 58a » laisse à l'humain la fermeture d'un PowerPoint resté ouvert. Les 2 demandes faites à la Factory sont portées par RA-02 et RP-04 pour la première, par RP-03 pour la seconde.

Mesures du 30/09/2026 sur le produit : 5 versions du deck, exportées du 29/09 à 12:03 au 30/09 à 09:10, portaient chacune 8 polices embarquées fausses (Inter Regular : 232 contours faux sur 235) ; les 13 autres decks à polices embarquées du dépôt sont sains ; les PDF sont sains. Version réparée livrée le jour même : 8 polices sur 8 au contrôle, 77 parties du paquet sur 85 identiques octet pour octet à la version fautive.

---

## digit-ai-pptx et quality-oracles (`digit-ai-forge-agents`)

Un deck conforme à tous les oracles du registre est sorti avec des polices embarquées illisibles hors du poste de production, et rien sur le chemin du producteur ne pouvait le voir.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-02 | bloquant | produit+générique | **Aucun oracle ne juge les polices embarquées d'un PPTX.** Faits : `oracle-pptx` a rendu PASS sur les 5 versions fautives, et son `non_juge` ne dit rien des polices ; le poste de production lit la police installée, jamais la copie embarquée ; la critique d'implémentation lit des planches tirées du PDF, sain. Cause mesurée : PowerPoint embarque une police par `t2embed.dll` de Windows (`TTEmbedFont`, sous-ensemble compressé MTX) ; la table du codage en triplets de ce composant (10.0.26100.9444) était altérée dans la mémoire du processus PowerPoint (16.0.20326.20158) ouvert la veille et réutilisé par tous les exports : 29 lignes sur 128, relevé `forge\oracles\polices-embarquees-pptx-20260930a\rapports\table-encodeur-t2embed-20260930.json`. Une présentation neuve créée dans ce processus sort 21 polices de 8 familles, 21 FAIL ; un processus neuf, sur 15 variantes d'appel, rend 0 contour faux ; 3 décodeurs (t2embed, libeot, lecteur écrit en session) rendent les mêmes contours faux. Le produit a écrit 4 outils sous `forge\oracles\polices-embarquees-pptx-20260930a\` : `verifier-polices-embarquees.py` (E1 contours identiques à la police installée de même version, E2 aucun glyphe hors de la boîte englobante déclarée ; sortie JSON à verdict, constats et `non_juge` ; codes 0, 1, 2), `reembarquer-polices.py` (le même appel rejoué dans un processus neuf ; sur un deck sain, 8 flux sur 8 identiques octet pour octet à ceux de PowerPoint), `assainir-polices.sh` (le geste unique après un export) et `essais.sh` (recette de 5 cas sur 2 decks épinglés). | La règle qui aurait évité le retour : aucune, le domaine n'a pas d'oracle (règle § 4 de quality-oracles). Demande humaine : l'intégrer côté Factory pour chaque document généré. (1) Un domaine « polices embarquées d'un PPTX » au registre, scaffoldé par `write-an-oracle` à partir de ce contrôle, déclenché par la présence de `ppt/fonts/` dans le paquet, avec des fixtures fictives rouge et verte. (2) D'ici là, `oracle-pptx` déclare dans `non_juge` que les polices embarquées ne sont pas décodées. (3) Portage hors Windows par libeot, qui rend les mêmes contours que t2embed sur ces fichiers. |
| RA-03 | majeur | produit+générique | **Le skill digit-ai-pptx ne décrit pas l'export par PowerPoint, et chaque producteur le réécrit.** Faits : le skill rend un PPTX par pptxgenjs ; le réenregistrement par PowerPoint, les polices embarquées et le tirage du PDF vivent dans 9 scripts maison du produit. `New-Object -ComObject PowerPoint.Application` s'attache à l'instance que l'utilisateur a déjà ouverte ; 8 scripts sur 9 appelaient `Quit()` sur elle sans condition ; cette instance, lancée la veille par l'utilisateur sur un autre deck, s'est retrouvée sans fenêtre, avec 4 présentations inaccessibles à l'automation (« Automation rights are not granted ») ; l'encodage des polices dépend de l'état de ce processus, partagé entre sessions parallèles ; aucun contrôle ne suivait l'export. Corrigé chez le produit : garde sur `Quit()` dans 3 scripts, `assainir-polices.sh` appelé par 3 chaînes. Chaîne rejouée par le PowerPoint encore déréglé : deck sorti au contrôle FAIL avant le branchement, PASS après. | La règle qui aurait évité le retour : aucune. Un script d'export dans le skill, écrit une fois : il ne quitte jamais une application qu'il n'a pas lancée ; il assainit les polices embarquées après l'export et refuse de livrer si le contrôle échoue ; il pose un verrou entre sessions parallèles. |

## Pilot (`digit-ai-factory`)

Deux règles que le producteur n'a trouvées nulle part, et que l'humain a tranchées lui-même.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-03 | majeur | générique | **Un document tenu ouvert arrête un tour ou devient une question posée à l'humain.** Faits du 30/09/2026 : le matin, un renommage est resté en attente parce qu'un CV était ouvert dans Word, avec une action « fermer le document » laissée à l'humain ; à midi, une décision lui a demandé quoi faire d'un PowerPoint resté ouvert avec 4 présentations. Sa réponse est citée en tête de ce lot. La règle 7 (« l'ancien migre dans `old\` du même dossier ») ne dit rien du fichier verrouillé, et le gabarit de restitution range ce cas parmi les bloquants à lever par l'humain. | La règle qui aurait évité le retour : aucune. Compléter la règle 7 : quand l'ancienne version est tenue ouverte, la nouvelle sort quand même à l'indice suivant ; la restitution dit que l'ancienne n'a pas pu être déplacée et qu'elle le sera au tour suivant ; le déplacement en attente est consigné, puis rejoué à l'ouverture du tour suivant ; `oracle-conformite-projet` tolère 2 versions d'un même objet tant qu'un déplacement est consigné en attente ; ni question, ni application de l'utilisateur quittée ou tuée. Classe proposée : voir la dernière section. |
| RP-04 | majeur | générique | **Un livrable n'est jugé que sur le poste qui l'a produit.** Faits : les portes du deck (`oracle-pptx`, charte, nommage, claims, critique d'implémentation, revue commerciale) ont toutes rendu PASS sur 5 versions illisibles ailleurs ; aucune ne regarde le fichier comme le verra un poste qui n'a pas les polices du producteur. Le produit a branché son contrôle sur ses 3 chaînes d'export ; l'humain demande que la Factory le fasse pour chaque document généré. Mesuré sur les PDF du même deck : 8 programmes de police, 0 contour faux. | La règle qui aurait évité le retour : aucune. Une règle de socle et son oracle : tout livrable qui embarque des polices (PPTX, DOCX, PDF, page HTML) est jugé sur ces polices décodées avant remise ; le tableau des règles de socle du `CLAUDE.md` des produits cite cet oracle par type de livrable ; le geste d'assainissement d'un PPTX redescend aux produits par le skill, pas par copie maison. Classe proposée : voir la dernière section. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Deck de la propale à polices embarquées fausses | version du 30/09/2026, indice f : polices réencodées hors PowerPoint, contrôle PASS sur 8 polices, 77 parties sur 85 identiques octet pour octet ; version précédente rangée sous `old\` | oui | remontée ci-dessus : RA-02 |
| Chaînes d'export sans contrôle des polices, et `Quit()` envoyé à l'application de l'utilisateur | `assainir-polices.sh` appelé par 3 chaînes, garde sur `Quit()` dans 3 scripts ; règle inscrite au tableau des règles de socle du `CLAUDE.md` du produit | oui | remontée ci-dessus : RA-03 et RP-04 |
| Questions posées à l'humain sur des documents ouverts | règle inscrite aux conventions locales du `CLAUDE.md` du produit et en mémoire de session | oui | remontée ci-dessus : RP-03 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot — `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de 5 versions datées ou plus sous `output\`, le 30/09/2026.

## Confirmations positives

- `forge\retours\oracle-lot.mjs` (TF-0597) a jugé ce lot chez le produit avant sa remise.
- Le rappel d'une décision en une ligne et la décision en bloc de citation (TF-1429) ont tenu : l'humain a tranché 2 décisions par « 57a » puis « 58a », sans aller-retour.
- Le lanceur d'oracles a signalé de lui-même la couverture partielle des scripts `.sh` et `.ps1` touchés.

## Ordre recommandé

1. RA-02, parce que l'humain le demande pour chaque document généré et que le contrôle existe déjà : le porter au registre protège chaque deck de chaque produit.
2. RA-03, parce qu'il retire la cause, une application partagée et quittée par les scripts, et 9 copies d'un même export.
3. RP-03, parce que le même sujet a coûté 2 allers-retours humains dans la journée.
4. RP-04, parce qu'il étend RA-02 aux autres formats une fois le premier oracle en place.

## La règle qui aurait évité le retour

Chaque retour ci-dessus la nomme dans sa colonne « Proposition esquissée » : aucune règle existante ne couvrait ces 4 cas. RA-02 relève de la classe `oracle-remplace-par-controle-maison`, RA-03 de `chaine-declaree-etapes-non-ecrites`. 2 classes sont proposées, faute de clé qui convienne :

- RP-03 — clé `version-anterieure-verrouillee-bloque-le-tour`, famille `versionnement-livrable` : « Une version antérieure tenue ouverte par une application arrête le tour ou devient une question posée à l'humain, au lieu d'une nouvelle version livrée et d'un déplacement différé d'un tour. »
- RP-04 — clé `livrable-juge-sur-le-seul-poste-producteur`, famille `skill-ou-oracle-non-invoque` : « Un livrable n'est jugé que sur le poste qui l'a produit : ses ressources embarquées ne sont jamais décodées, et un défaut invisible au producteur part chez le destinataire. »
