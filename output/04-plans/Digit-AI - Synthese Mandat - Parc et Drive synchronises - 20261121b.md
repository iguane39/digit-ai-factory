---
destinataire: humain
---

# Synthèse Mandat — parc aligné sur GitHub, miroir Drive du pilot à jour (21/11/2026)

## 0. Synthèse d'ouverture

Les 16 dépôts du parc sont alignés sur GitHub : le pilot a publié les relevés d'ouverture de ce poste, les 15 autres l'étaient déjà. Sur le Drive, le miroir de l'output du pilot est maintenant à jour. La sauvegarde de Produit-02 n'a pas été lancée, parce qu'elle aurait écrasé sur le Drive 2 fichiers de secrets plus récents que ceux du poste.

Livré : [synthèse de la synchronisation du 21/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Parc%20et%20Drive%20synchronises%20-%2020261121b.md)

## 1. En-tête d'identification

Synchronisation du pilot `digit-ai-factory`, des 13 forges, de la file `digit-ai-queue`, du canal confidentiel et des sauvegardes Drive, sur le poste DESKTOP-ULTRA7, le 21/11/2026 de 10:51 à 11:05, heure de Paris (`date`). Session pilote Claude Opus 5.5 ; aucun agent ; escalade de modèle : aucune.

Intention de la demande : que ce poste, GitHub et le Drive portent le même état, sans perdre le travail local.

Test rétro : chaque dépôt du parc est à 0 en avance et 0 en retard. Chaque copie Drive est vérifiée au contenu. Aucun secret n'est écrasé.

## 2. Verdict

Le pilot est publié en `2663018a..626b12e2`, et les 15 autres dépôts étaient déjà alignés. Sur le miroir Drive de l'output du pilot, les 895 fichiers suivis par git sont présents et ont le même contenu, aux fins de ligne près. Côté Produit-02, 104 fichiers sur 106 sont identiques, et les 2 fichiers de secrets ne sont pas recopiés.

Mesuré sur : `git rev-list --left-right --count HEAD...@{u}`, les comptes rendus de `scripts/synchroniser.mjs`, la comparaison octet par octet de `git show HEAD:<fichier>` avec la copie Drive, et `build/sauvegarde-drive.py --verifier`, relue à 11:05, périmètre 16 dépôts et 2 dossiers Drive.

## 3. Décisions attendues

Aucune décision nouvelle : l'envoi du pilot relève du GO permanent D-54 (b) du 03/10.

Trois décisions posées le 16/11 restent sans réponse ; elles sont détaillées, avec leurs tableaux d'options, dans la synthèse « Retours et TODOs du 16-11 » (20261116a) d'`output/04-plans`. La première porte sur la publication de clips vidéo sur LinkedIn. La deuxième porte sur la façon de vous reposer les étapes d'un plan déjà accepté. La troisième porte sur la circulation des fichiers de secrets entre vos deux postes. On répond par la lettre collée au numéro (« 223b »).

- D-221 : `references/RUN-RESEAU.md` exclut la vidéo, alors que le skill `clip-de-presentation` produit depuis le 10/11 des MP4 jugés par `oracle-clip`. (a) rouvrir · (b) réécrire le motif · (c) laisser. Recommandation (a), parce que c'est ce que vous avez demandé le 12/11 (source : la section des exclusions de `references/RUN-RESEAU.md`). Sans décision : les clips ne se publient pas.
- D-222 : 14 réponses sur 49 au `forge/ledger.jsonl` d'un produit ne faisaient que valider l'étape suivante d'un plan accepté. (a) adopter partout · (b) essai de 2 semaines chez un produit · (c) ne rien changer. Recommandation (b) : l'essai mesure le gain sans changer la doctrine partout (source : le lot de Produit-82 du 13/11 et `references/NIVEAUX.md`). Sans décision : chaque étape revient vers vous.
- D-223 : fusionner le `.env` d'un produit avec un coffre sur Drive, à l'ouverture et en fin de tour. (a) fusion automatique · (b) proposée, pas jouée · (c) laisser. Recommandation (b) : le cas de Produit-02 au bloc 4 montre qu'une copie fichier contre fichier perd des clés, et que la fusion se lance aujourd'hui à la main (source : `scripts/fusionner-env.mjs` et RT-149 (retour de Produit-02, `.env` écrasé)). Sans décision : le secret se ressaisit sur chaque poste.

## 4. Traité

- Pilot, enregistrement : 4 journaux d'ouverture de ce poste, le relevé d'héritage, les coûts, les instantanés et le tableau des récidives, en `626b12e2`.
- Pilot, premier envoi refusé par la porte d'identité de publication (SKIP qui refuse, D-175). L'environnement de la session porte encore l'ancienne racine `.claude\worktrees`, retirée le 14/11, et la porte y cherchait son référentiel. Au second envoi, le chemin du référentiel et l'identification `gh` sont passés à la seule commande. Envoi accepté, pre-push compris, et aucune configuration n'a été modifiée.
- Parc : les 13 forges, la file et le canal confidentiel à 0 en avance et 0 en retard (`scripts/synchroniser.mjs`, 10:53).
- Drive, miroir de l'output du pilot : 2 synthèses manquaient, celles des 15/11 (e) et 16/11 (a), et 3 index étaient périmés. Les 5 fichiers sont recopiés depuis la version publiée, puis relus identiques. Le Drive ne porte aucun fichier absent de git. 777 fichiers ne diffèrent que par leurs fins de ligne : ils sont laissés tels quels, comme le 15/11.
- Drive, Produit-02 : la vérification rend INCOMPLET. 104 fichiers sur 106 sont identiques, et 2 fichiers de secrets diffèrent, `.env` et `stats/.env`. Les 2 copies du Drive sont plus récentes que celles du poste (12/11 contre 09/11, 11/11 contre 06/09). Le `.env` du Drive porte 3 clés que le poste n'a pas. La sauvegarde copie fichier contre fichier : elle aurait reproduit la perte de clés du 12/11 (RT-149). Je ne l'ai donc pas lancée.

Relecture d'intention : sans objet, synchronisation sans livrable de code ni consigne d'agent.

## 5. Non traité

- Les 2 fichiers de secrets de Produit-02 — motif : decision. La fusion clé par clé se fait chez le produit, qui est autonome (`node forge/fusionner-env.mjs fusionner .env "<copie Drive>"`, d'abord à blanc). Ensuite seulement, la sauvegarde peut tourner. Le pilot n'a pas de mandat d'écriture chez le produit et ne lit aucun `.env`.
- 13 fichiers présents sur le Drive de Produit-02 et absents du poste, venus de l'autre poste (pièces du dossier d'abonnement à l'eau, classeurs de gestion, 2 journaux de `forge`) — motif : decision. La sauvegarde ne fait que lister ces fichiers. Ils restent lisibles sur le Drive de ce poste.
- La synthèse du 15/11 (d), modifiée sur le poste : les vrais noms y remplacent les pseudonymes. Elle n'est pas enregistrée, ni recopiée sur le Drive — motif : hors_mandat, travail d'une autre session, que la porte des noms refuserait.
- Les lots du sas d'arrivée (43) et de la boîte d'entrée (2), signalés au relevé d'ouverture — motif : hors_mandat, la demande était une synchronisation.

## 8. Prochaines actions

Le tableau dit qui agit, sur quel déclencheur, et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 (neuve) | Fusionner les 2 fichiers de secrets de Produit-02 avec leur copie Drive, puis lancer sa sauvegarde | proposée | manuelle_utilisateur | decision | dans le dossier du produit : `node forge/fusionner-env.mjs fusionner .env "<copie Drive>"`, puis la même avec `--ecrire`, puis `python build/sauvegarde-drive.py` | la sauvegarde reste INCOMPLET, et la lancer telle quelle effacerait 3 clés du Drive |
| A-2 (neuve) | Accueillir et ingérer les lots en attente | proposée, non faite : hors_mandat | auto_ia | decision | dire « traite la boîte d'entrée » | les producteurs croient leur travail remonté, et personne ne le traite |

## 9. Traces

- Pilot `626b12e2` publié sur GitHub. Les comptes rendus `sync.json` et `sync-pilot.json` sont dans le dossier temporaire de la session.
- `todo/HERITAGE-RELEVES.jsonl`, `todo/observabilite/`.
- Drive, sous 40-Digit-AI : « Factory - output du pilot », 5 fichiers recopiés.
