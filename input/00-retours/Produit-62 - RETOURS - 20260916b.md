# Retours forges — Produit-62 — 20260916b

- **Contexte** : retour humain du 2026-09-16 sur la restitution `20260916h` (décision D-35), mot pour mot : « Tu dis ce qu'il faut faire, mais tu ne dis pas comment le faire simplement ? Du coup, on ne sait pas quoi faire. Donc remonte aussi le comment faire en plus du quoi faire, sinon ça n'a aucun intérêt, et remonte ça à la Factory. »
- **Références ledger** : `forge\ledger.jsonl`, entrée `type: retour` du 2026-09-16 22:05 (origine humain)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-16

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `gabarits\RESTITUTION.md` bloc 3 et `oracles\oracle-synthese.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-20 | majeur | générique | **Une option de décision qui commande un geste humain ne dit pas comment le faire ; le lecteur sait quoi choisir et ne sait pas quoi faire.** Fait observé le 2026-09-16 : la restitution `output\05-syntheses\Client-A - Note Synthese Publication En Attente Tenancy Schedule Asset - 20260916h.md`, jugée **PASS sur 46 règles** par `oracle-synthese`, pose D-35 « par quel chemin rouvre-t-on la connexion Power BI » avec 3 options portant chacune son coût et son exclusion, conformément au gabarit (`Option | Ce qu'elle coûte | Ce qu'elle exclut`). Le mode opératoire — ouvrir un terminal, coller `python forge\etapes\data\pbi_probe.py --login`, saisir le code dans le navigateur, valider le second facteur — n'existe **qu'au bloc 8**, dans l'action A-110, à **60 lignes** de la décision. Retour humain immédiat, cité en contexte. La cause est de **gabarit** : le bloc 3 exige pour une option ce qu'elle coûte et ce qu'elle exclut (S31), une recommandation sourcée (S16), un défaut (S32) — jamais **comment l'exécuter** ; S13 exige qu'une **action** humaine soit exécutable telle quelle, et rien d'équivalent ne vise une **option** dont le choix commande un geste humain. Le même défaut a une histoire : S45 (TF-1127) a été créée parce qu'un bloquant était écrit en morceaux dans trois blocs ; ici le « comment » d'une décision est écrit dans un autre bloc que la décision. *Le lecteur tranche au bloc 3 et ne va pas chercher le geste au bloc 8 : une option dont on ne sait pas exécuter la suite n'est pas un choix.* | **(1)** Gabarit bloc 3 : toute option dont le choix implique un geste de l'humain porte, **sur place**, une ligne « Comment faire : 1) … 2) … 3) … » — terminal ou écran à ouvrir, commande exacte entre accents graves, écran attendu, ce qu'on répond ensuite — sous le tableau des options (le tableau à 3 colonnes reste, S18 tient). **(2)** Règle neuve `oracle-synthese`, symétrique de S13 côté décisions : une option dont le texte porte un verbe de geste humain (se connecter, ouvrir, saisir, installer, valider, publier soi-même) sans localisateur (`_LOCALISATEURS` : commande, chemin, URL) dans le bloc de la décision est refusée — avertissante d'abord, comme S11-S14 l'ont été. **(3)** Fixture double sens : la décision D-35 telle que remise (FAIL) et la même avec ses « Comment faire » (PASS) ; taux d'accusation mesuré sur le corpus avant mise en service. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| D-35 sans mode opératoire | reposée dans la restitution `20260916i` avec, pour chaque option, un « Comment faire » pas à pas (terminal, commande, écran attendu, réponse à donner) | oui — c'est l'objet de RF-20 | clos |
| La mémoire de session de l'agent ne portait pas cette exigence | mémoire `feedback-decision-comment-faire` enregistrée (type feedback, avec le pourquoi et le comment appliquer) | non (mémoire de poste) | clos |

## Retours sur les documents produits

| Retour | Gabarit et version (affichée en en-tête du document) | Où dans le document |
|---|---|---|
| RF-20 | `gabarits\RESTITUTION.md` — version du gabarit : 2.22.0, 16/09/2026 (ligne « Référentiel versionné … version 2.22.0 » de l'en-tête) ; la restitution `20260916h` en est issue et jugée PASS 46/46 | bloc 3, anatomie d'une décision : le tableau `Option | Ce qu'elle coûte | Ce qu'elle exclut` et les règles S16, S31, S32 n'exigent d'une option aucun mode opératoire ; le défaut est dans ce que le gabarit n'exige pas, pas dans un écart au gabarit |

## Confirmations positives

- Le retour humain est arrivé en une phrase, immédiatement lisible, sur une décision unique : la forme `D-N` + options a permis de désigner exactement l'objet du reproche.
- L'action A-110 du bloc 8 portait déjà la commande exacte (S13 tenue) : le contenu existait, seule sa place manquait — la correction est une règle de gabarit, pas un travail de fond.

## Ordre recommandé

1. RF-20 — un lecteur qui tranche sans savoir exécuter la suite rend la décision inutile ; le défaut touche toute restitution dont une option commande un geste humain, dans tous les produits.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-20** → `restitution-bloquants-disperses` (famille `restitution-forme`, correspondance APPROCHÉE : la classe vise ce qui empêche d'avancer réparti entre plusieurs blocs ; ici le « comment » du geste qui lève le bloquant vit au bloc 8 quand la décision qui le commande vit au bloc 3). Classe candidate, même famille, libellé proposé : `decision-sans-mode-operatoire` — « une option de décision qui commande un geste humain ne dit pas comment le faire : le lecteur sait quoi choisir et ne sait pas quoi faire ».
