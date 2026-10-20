---
destinataire: humain
---

# Synthèse Mandat — pilot fusionné avec GitHub et publié, numéros en collision renumérotés (20/10/2026)

## 0. Synthèse d'ouverture

Le pilot de ce poste et celui de GitHub portent le même état : les 10 enregistrements de ce poste et les 10 de l'autre sont réunis dans une fusion publiée sur GitHub. Les deux postes avaient donné les mêmes numéros à des sujets différents le 19/10 ; les numéros publiés restent, ceux de ce poste changent. Pour vous, cela change une chose : les 3 questions posées hier soir sous D-43, D-44 et D-45 s'appellent désormais D-49, D-50 et D-51. Les 13 forges étaient déjà à jour.

## 1. En-tête d'identification

Synchronisation du pilot digit-ai-factory avec son dépôt GitHub, branche main, poste Dell-XPS-16. Période : 20/10/2026, de 08:47 à 09:13, heure de Paris (UTC+02:00). Session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle : aucune.

Intention de la demande : que ce poste et GitHub portent le même état, sans perdre le travail d'aucun des deux postes.

Test rétro : le résultat sert cette intention ; rien n'est perdu, et chaque numéro ne désigne plus qu'un sujet.

## 2. Verdict en une ligne

main aligné sur origin/main à `e2155010` (0 en avance, 0 en retard), 15 numéros TF et 6 numéros de décision renumérotés côté local, 13 forges et la file à jour.

## 3. Décisions attendues

- **D-49** : requalification de la fixture de sécurité qui juge dangereux tout agent portant Bash, dans `digit-ai-forge-agents-security`, posée le 19/10 à 19:24, inchangée.
- **D-50** : propagation aux skills installés des modifications de conception et de design, posée le 19/10 à 19:24, inchangée.
- **D-51** : sort du skill `linkedin-post-generator` du compte claude.ai, corrigé ou déclaré hors de la Factory, posée le 19/10 à 19:24, inchangée.

## 4. Traité

La synchronisation a demandé une fusion, parce que les 2 postes avaient chacun 10 enregistrements que l'autre ignorait.

- Mesure : `git fetch` puis `git status -sb` rendait « 10 devant, 10 derrière » à 08:47 ; les 2 côtés avaient créé TF-1900 à TF-1914 et réservé D-39 à D-45 pour des sujets différents.
- Sauvegarde avant tout geste : paquet `pilot-main.bundle` des 2 branches, différentiel du travail non enregistré et copies des registres, sous `c:/dev/_sauvegardes/synchro-20261020/`.
- Fusion plutôt que rebase : les SHA des 10 enregistrements locaux restent valides, et les clôtures du registre qui les citent aussi.
- Registre des items : la version locale renumérotée à part par `todo/renumeroter.mjs` (TF-1900 à TF-1914 deviennent TF-1921 à TF-1935, motif consigné dans chaque création), puis réunie avec la version publiée ; `oracle-todo` rend PASS sur 5 102 lignes.
- Registre des décisions : D-39, D-40 et D-41 de ce poste deviennent D-46, D-47 et D-48 ; D-43, D-44 et D-45 deviennent D-49, D-50 et D-51, avec les champs `renumerote_de` et `motif_renumerotation` ; D-42 n'existait que d'un côté et garde son numéro. `reserver-decision.mjs --verifier` rend PASS, aucun numéro pris 2 fois.
- Renvois : 43 lignes ajoutées par ce poste, dans 18 fichiers du pilot, portent les nouveaux numéros ; les sceaux des 9 documents retouchés sont recalculés, tous PASS.
- Contrôles rejoués après la fusion : tests de `relecture-intention` 69/69, de `relever-flotte` 16/16, de `relever-contexte-sessions` 10/10, de `reserver-decision` 53/53, self-test d'`oracle-ecriture` 37/37.
- Publication : `git push` avec le feu vert « Synchronise avec github » accepté par `verifier-avance-publication.mjs` ; la garde des noms a duré de 08:53 à 09:12 ; `git rev-list --left-right --count HEAD...origin/main` rend `0 0`.
- Forges : `git fetch` sur les 13 forges et la file, toutes à 0 devant et 0 derrière.
- Décisions renumérotées : le texte complet de D-49, D-50 et D-51 est dans la synthèse `Digit-AI - Synthese Mandat - Campagne D-41 - 20261019e.md`, sous les numéros D-43, D-44 et D-45.
- Relecture d'intention : sans objet, synchronisation sans livrable neuf ; la renumérotation reprend des textes existants.

## 5. Non traité

- Les textes scellés du 19/10 gardent les anciens numéros — motif : decision, une synthèse ou une étude scellée ne se réécrit pas ; la correspondance est au registre et dans le message de la fusion.
- Les 3 forges publiées hier par la campagne citent TF-1900 à TF-1913 et D-41 dans leurs messages — motif : hors_mandat, une histoire publiée ne se réécrit pas.
- Les 4 lots au sas d'arrivée signalés par le relevé d'ouverture, le plus ancien depuis 21 h — motif : hors_mandat, la demande était une synchronisation ; repris en A-1.
- La publication de cette synthèse et du journal `todo/relectures-intention.jsonl`, complété par un hameçon après l'envoi — motif : hors_mandat, les 2 sont enregistrés sur ce poste et partent avec la prochaine publication, la garde des noms coûtant 19 minutes par envoi.

## 6. Écarts à la lettre

Deux gestes vont au-delà de ce que « synchroniser » laisse attendre.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Synchronise avec GitHub | Renuméroté 15 items et 6 décisions de ce poste | Les mêmes numéros désignaient des sujets différents des 2 côtés ; le publié garde les siens |
| Synchronise avec GitHub | Publié la fusion et les 10 enregistrements locaux | Votre demande vaut feu vert de publication, cité mot pour mot à l'envoi |

## 7. Risques

- Une réponse « 43a », « 44a » ou « 45a » envoyée par habitude.
  - Énoncé : sur GitHub, D-43, D-44 et D-45 désignent les lots de Produit-02, la publication du 19/10 et les 3 écarts de la session de l'autre poste.
  - Signal : une réponse à D-43, D-44 ou D-45 qui parle de fixture, de propagation ou de LinkedIn.
  - Parade : la lire comme D-49, D-50 ou D-51, et le dire dans la réponse.
- Un document scellé du 19/10 qui renvoie à TF-1905 ou D-41 vers le mauvais sujet.
  - Énoncé : les 14 études et 3 synthèses de ce poste gardent leurs anciens numéros.
  - Signal : un item qui ne correspond pas au texte qui le cite.
  - Parade : le motif de renumérotation de chaque item nomme son ancien numéro.

## 8. Prochaines actions

Une seule action reste ouverte, hors de la synchronisation. Ordre : elle passe seule, et en premier, parce que le plus ancien lot attend depuis 21 h.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | neuve | Accueillir puis ingérer les 4 lots du sas d'arrivée | auto_ia | hors_mandat : hors de la synchronisation demandée | `node todo/accueillir-lot.mjs` | Les retours des produits restent sans traitement |

## 9. Traces

- Fusion publiée : `e2155010`, parents `d117ee2c` (ce poste) et `df0b1a7a` (GitHub)
- Sauvegarde : `c:/dev/_sauvegardes/synchro-20261020/` (paquet git, différentiel, registres avant fusion, journal d'envoi `push.log`)
- Registres : `todo/TODO.jsonl`, `decisions/REGISTRE.jsonl`
- Synthèse des décisions renumérotées : `output/04-plans/Digit-AI - Synthese Mandat - Campagne D-41 - 20261019e.md`
