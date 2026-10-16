---
destinataire: humain
---

# Synthèse de mandat — le socle a changé d'identité pendant la coupure, et les vingt-quatre pages tiennent (17/09/2026)

La machine qui porte cette session a redémarré. Rien n'a été perdu du travail de ce matin : les deux mandats étaient exécutés, enregistrés et publiés avant la coupure, et la seule chose interrompue était une attente dont j'avais déjà le résultat. Mais le redémarrage a fait apparaître un fait que personne n'avait demandé de vérifier : le socle installé sur cette machine ne juge plus avec le même jeu de contrôles qu'hier — il en a un de plus, et son empreinte a changé. Le relevé d'ouverture le dit lui-même et prévient que rien n'est rejoué tout seul. Comme les vingt-quatre pages de la bibliothèque avaient été déclarées conformes sous l'ancienne identité, je les ai toutes rejouées sous la nouvelle : elles tiennent, sans exception. Ce tour ne produit donc aucun livrable, et je ne repose aucune décision déjà posée. Ce qui est attendu de vous reste ce qui l'était ce matin : les deux lettres du tour précédent.

## 1. En-tête d'identification

- **quoi** — vérification, après le redémarrage de la machine, que le changement d'identité du socle installé ne met en défaut aucune des pages déclarées conformes ce matin.
- **sur quoi** — la bibliothèque de gabarits du pilot `digit-ai-factory`, ses douze familles et leurs vingt-quatre pages. Aucun fichier n'a été modifié.
- **quand** — 2026-09-17 de 22:50 à 23:25 CEST (UTC+02:00), durée ≈ 35 min, relevée à l'horloge du poste — le tour précédent s'était clos à 12:56, et la machine a redémarré entre les deux.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrement de départ `d3729a6` ; oracles exécutés : `render_page.py` du socle installé (28 familles, empreinte `8b72b9b1b370`) et `scripts/verifier-rendu-instances.mjs`.

## 2. Verdict en une ligne

Le socle installé passe de **27 à 28 familles** de rendu et son empreinte de `134b408b62d7` à `8b72b9b1b370` — effet de la fusion enregistrée ce matin, dont les seize apports distants comprenaient une famille neuve. Les vingt-quatre pages de la bibliothèque avaient été jugées sous l'ancienne identité : rejouées sous la nouvelle, elles rendent **PASS 24 sur 24** — douze exemplaires par le contrôle de rendu du pilot, douze squelettes un par un, chacun sur les six largeurs. **Zéro** fichier modifié dans ce tour, **zéro** livrable produit, **zéro** décision neuve posée. La seule perte de la coupure est une attente de fond dont le résultat — banc du socle **322/322** — était déjà relevé et consigné avant le redémarrage.

## 3. Décisions attendues de l'humain

Aucune décision neuve n'est posée par ce tour, qui n'a rien produit de nouveau. Les deux arbitrages ouverts restent **D-16** — que fait-on d'un poste qui produit du socle et ne peut pas le publier — et **D-17** — le banc du socle est six fois plus long, garde-t-on ce prix tel quel. Leurs tableaux d'options, leurs recommandations sourcées et leurs lignes de repli vivent dans la synthèse du tour précédent, `output/04-plans/Digit-AI - Synthese Mandat - Banc elargi source unique et deux lignees fusionnees - 20260917a.md`, et n'ont pas changé d'un mot : les reposer ici les ferait paraître neuves alors qu'elles attendent depuis ce matin.

## 4. Traité — avec sa preuve

- **Le changement d'identité du socle est mesuré, pas supposé.**
  - preuve : `render_page.py --familles` du socle installé rend **28 familles**, dont 20 bloquantes, contre 27 au relevé de 10:52 ; l'empreinte publiée passe de `134b408b62d7` à `8b72b9b1b370`.
- **La 28ᵉ famille vient bien de la fusion de ce matin, et non d'une source tierce.**
  - preuve : comparaison ligne à ligne des familles déclarées par `render_page.py` entre la copie installée et `digit-ai-forge-agents` — **aucune différence**. La copie installée est donc exactement l'état fusionné, et non un apport arrivé par un autre chemin.
- **Les douze exemplaires de la bibliothèque tiennent sous la nouvelle identité.**
  - preuve : `node scripts/verifier-rendu-instances.mjs --json` rend `verdict: PASS`, **12 instances, 0 en défaut**, au périmètre par défaut du socle — les six largeurs, et désormais les 28 familles.
- **Les douze squelettes tiennent aussi, et ils ne sont pas couverts par le contrôle précédent.**
  - preuve : `render_page.py` joué un par un sur les douze `SQUELETTE.html` — **`Verdict : PASS` sur les douze**, sans un seul bloquant. Le contrôle de rendu du pilot ne balaie que les exemplaires : sans ce second passage, la moitié de la bibliothèque serait restée non vérifiée sous la nouvelle identité.
- **Ce que la coupure a emporté est nommé, et ce n'était pas du travail.**
  - preuve : la tâche interrompue était l'attente de la fin du banc du socle ; son résultat — **322/322** — avait été relevé, enregistré au registre sous TF-1089 et publié dans l'enregistrement `7a9150e` avant le redémarrage.

## 5. Non traité — avec son motif

- **Les quatre enregistrements du socle** — motif : accès, inchangé depuis ce matin — le dépôt `digit-ai-forge-agents` reste hors de l'ensemble autorisé de cette session, et le relevé d'ouverture le confirme en affichant « en avance de 4 commit(s) (travail local non poussé) ».
- **Les six autres skills dont l'empreinte a changé** — motif : hors mandat, le relevé signale sept skills modifiés et je n'ai vérifié que celui dont dépendent les pages de la bibliothèque ; les six autres ne jugent aucun artefact de ce dépôt.
- **Le site de scellement non déclaré** — motif : hors mandat, ouvert au registre ce matin et inchangé.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.
- **Le contrôle statique des vingt-quatre pages** — motif : sans objet, son empreinte n'a pas bougé — 41 règles, `6d1f8858afdf`, identique au relevé d'hier — donc aucun verdict statique ne peut avoir changé.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| (rien — ce tour s'ouvre sur un redémarrage de machine, sans instruction) | J'ai vérifié que le changement d'identité du socle ne met aucune page en défaut | Le relevé d'ouverture prévient que rien n'est rejoué tout seul. Vingt-quatre pages déclarées conformes sous une identité qui n'existe plus, c'est une conformité qui ne vaut plus rien tant qu'elle n'est pas rejouée |
| (non dit) | J'ai balayé les douze squelettes en plus des douze exemplaires | Le contrôle du pilot ne prend que les exemplaires. **Se contenter de son verdict aurait laissé la moitié de la bibliothèque non vérifiée** |
| (non dit) | Je n'ai reposé ni D-16 ni D-17 | Elles attendent depuis ce matin sans avoir changé. Les réafficher en entier les ferait paraître neuves, et la doctrine de restitution l'interdit explicitement |

## 7. Risques

- **Les six autres skills modifiés portent un défaut que personne ne rejoue.**
  - signal : un livrable d'une autre famille revient en retour humain sur un défaut qu'un oracle aurait dû voir.
  - parade : le relevé d'ouverture nomme les sept skills et leurs empreintes à chaque session ; celui dont dépend la bibliothèque est vérifié, et les six autres sont déclarés non vérifiés plutôt que supposés bons.
- **La conformité des pages est rejouée à la main, et la prochaine fois personne n'y pense.**
  - signal : une empreinte de socle change, et aucun tour ne rejoue les pages qui en dépendent.
  - parade : le relevé le signale d'office à chaque ouverture ; ce qui manque est un contrôle qui compare l'empreinte du dernier jugement à celle du socle courant, et c'est un candidat que le registre porte déjà sous la même classe.
- **Une machine redémarre au milieu d'un travail plus engageant que celui-ci.**
  - signal : une tâche de fond disparaît alors que son résultat n'était pas encore relevé.
  - parade : la méthode de ce matin — relever le résultat, l'enregistrer et le publier avant de passer à la suite — a fait que la coupure n'a rien coûté ; elle vaut d'être tenue.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-46** | Répondre `D-16` et `D-17` par leur lettre — par exemple « D-16 a, D-17 b » | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `decision`, ouvrir un droit de publication et choisir la cadence d'un banc engagent la façon de travailler du parc. Fichier à lire d'abord : la synthèse `… - Banc elargi source unique et deux lignees fusionnees - 20260917a.md`, bloc 3 | les options par défaut (c) et (a) s'appliquent : la prochaine divergence se règlera à la main, et le banc restera lent |
| **A-47** | Publier les enregistrements `d75d76e`, `d6a642a`, `11fe59b` et `e07f252` du socle depuis un poste autorisé | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `acces` — le relevé d'ouverture de ce soir affiche « digit-ai-forge-agents … en avance de 4 commit(s) (travail local non poussé) », et la tentative de 12:50 rendait `access denied by the git proxy`, erreur HTTP 403 | quatre enregistrements du socle, dont la fusion des deux lignées, ne vivent que sur cette machine — et une machine vient de redémarrer |
| **A-35** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des huit tours reste sur une branche latérale |
| **A-48** | Déclarer le site de scellement de forge-design à la table des empreintes | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `hors_mandat`, arrivé par la mise à jour du parc. Commande de vérification : `node oracles/oracle-empreintes.mjs` | la recette du pilot garde un quinzième oracle en défaut |
| **A-49** | Ramener la durée du banc du socle en gardant les six largeurs en recette complète | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_bloc_3`, attend D-17 (option (b)) | le banc reste à environ cinquante minutes, et finit par ne plus être joué au fil de l'écriture |
| **A-50** | Rendre mécanique la vérification faite à la main ici : comparer l'empreinte du dernier jugement d'une page à celle du socle courant | auto_ia | action `neuve`, **non exécutée** — motif : `gate_gouvernance`, une règle neuve entre en avertissante et son bruit se mesure sur les dépôts consommateurs avant tout durcissement | un changement d'empreinte continue d'être signalé sans que rien ne dise quelles pages en dépendent |
| **A-38** | Décider le sort des candidats TF-1075 à TF-1091 encore en attente | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | les constats restent en attente, et le compteur de récidives les ignore |
| **A-39** | Tenir la revue datée : familles outillées, constats produits par les règles neuves, retours humains par famille | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude du 14/09 n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ces trois jours étant des items de forge.

## 9. Traces

- `gabarits/documents/` — douze familles, vingt-quatre pages, aucune modifiée dans ce tour ; toutes rejouées sous l'identité `8b72b9b1b370`.
- `scripts/verifier-rendu-instances.mjs` — joué sur la bibliothèque, `verdict: PASS`, 12 instances, 0 en défaut.
- `output/04-plans/Digit-AI - Synthese Mandat - Banc elargi source unique et deux lignees fusionnees - 20260917a.md` — la synthèse du tour précédent, où vivent les décisions D-16 et D-17 et les preuves des deux mandats.
- `todo/TODO.jsonl` et ses vues — 309 actifs, inchangés dans ce tour.
- Enregistrement `d3729a6` sur `claude/html-quality-new-formats-qhfgvj` ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Les vingt-quatre pages HTML rejouées dans ce tour** portent le verdict de la critique d'implémentation : **non jouée**, faute de mandat forge-design ; l'oracle de rendu du socle est vert sur les vingt-quatre au périmètre complet, et ce n'est pas la même chose, donc c'est dit plutôt que tu.
