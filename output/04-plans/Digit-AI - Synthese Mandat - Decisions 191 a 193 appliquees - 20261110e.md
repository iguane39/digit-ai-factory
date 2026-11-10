## 0. Synthèse d'ouverture

Vos 3 réponses sont appliquées et publiées dans le pilot : les 5 sujets qu'elles tranchaient sont clos, chacun sur un contrôle exécuté. Chez les produits, 3 processus prennent effet à leur prochaine ouverture. Un tour qui écrit un retour sans lot est désormais refusé en fin de tour ; il en aurait touché 17 à 23 % des tours écrivants depuis le 15/10, parce que le défaut est répandu. Une séance datée est rappelée à 5 jours, et un document qui promet une pièce sans la produire est signalé. Rien n'attend de décision de votre part.

## 1. En-tête d'identification

Synthèse du mandat « 191a, 192a, 193a », sur le pilot, le 10/11/2026 à 22:07, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de réaliser les 3 décisions de doctrine telles que vous les avez choisies, chacune avec un contrôle qui la joue. Test rétro : chaque sujet tranché finit clos sur une recette rejouée par le pilot, et la règle écrite cite son contrôle.

## 3. Décisions attendues

Rien n'attend de décision nouvelle de votre part : ce tour réalise vos 3 réponses.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

Trois agents ont travaillé chacun dans leur arbre, et j'ai rejoué leur travail sur l'état fusionné.
- Vos réponses sont consignées sur les 5 sujets, avec vos mots cités. La consigne des agents a été relue « sert » par un vérificateur, avec 2 écarts mineurs : j'ai resserré le rappel de séance sur les seules séances datées, et gardé le journal hors run parmi les sources de retours.
- Retours dans le tour (TF-2329) : le hook de fin de tour d'un produit refuse un tour qui écrit un retour sans lot, et donne la commande de remise au sas. Cas neufs rouges sur l'état de départ, verts après. Taux mesuré en lecture seule sur 474 tours écrivants de 25 produits : 16,9 à 23,2 % accusés, dont 2,5 % douteux.
- Nommage (TF-2341 et TF-2347) : un lot de fiches déclaré partage un indice, et un produit déclare le nommage que vous avez décidé. Chez le produit marketing, sur une copie de ses noms, les refus d'indice partagé passent de 6 à 0, et les refus de type de 125 à 65. Aucun refus neuf sur 39 projets.
- Séances et engagements (TF-2330 et TF-2333) : un calendrier et un registre d'engagements naissent à l'ouverture de chaque produit, la séance du 13/11 y serait nommée à J-3, et un oracle neuf juge les engagements à chaque livrable écrit. Son auto-test passe à 29/29 dans les deux sens. Il accuse 10 des 13 documents des 27 et 28/10, avec un bruit de 1,2 % sur 607 livrables.
- Recettes rejouées sur la fusion : l'agrégateur du pilot rend 256 recettes vertes sur 257, avec le double sens tenu sur 243/243. La seule rouge ne l'est que sous le dossier temporaire, et elle passe à 76/76 dans l'arbre principal.
- L'héritage des produits passe en 1.59.0, avec une seule entrée pour les 3 décisions.
- Le contrat produit reste sous son plafond de 6 144 octets : la règle des séances vit dans `references/CLAUDE-PRODUIT-DETAIL.md`.
- 3 candidats neufs, de TF-2427 à TF-2429 : 13 types de livrable à inscrire au registre de forge-organization, le domaine des engagements à inscrire au registre de quality-oracles, et la promesse d'un « lot de clôture » sans run ouvert.
- Réserve d'un agent : la sonde de fraîcheur du pilot a joué un `git fetch` sur le dépôt du produit marketing. Elle n'a rien écrit dans son arbre.

Relecture d'intention : sert.

## 5. Non traité

- Les déclarations propres au produit marketing (son nommage, ses lots de fiches, sa séance du 13/11) — motif : hors_mandat, le pilot n'écrit pas chez un produit sans run demandé.

## 8. Prochaines actions

Trois actions suivent, aucune ne vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Chez le produit marketing, poser sa déclaration de nommage et ses lots de fiches, et inscrire la séance du 13/11 au calendrier né à l'ouverture | TF-2347 | auto_ia | hors_mandat : écriture chez un produit, à faire par sa propre session | modèle `gabarits/NOMMAGE-PRODUIT.json` et `REGLES-PROJET.md`, règles 4 et 25 | si rien n'est fait, ses 60 refus de type et ses 6 refus d'indice restent au tableau |
| A-2 | Écrire l'exemption du dépôt émetteur dans la porte des noms | TF-2340 | auto_ia | borne_atteinte : laissée par la campagne du matin | `.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs` de `digit-ai-forge-agents` | si rien n'est fait, la porte accuse les fichiers d'un produit portant son propre nom |
| A-3 | Trier les 12 candidats neufs du jour, de TF-2396 à TF-2404 et de TF-2427 à TF-2429 | TF-2427 | auto_ia | hors_mandat : nés des deux campagnes du jour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, le faux négatif de sécurité de forge-tests reste ouvert |

Ordre : la déclaration du produit d'abord, parce qu'elle seule lève des refus déjà visibles ; puis l'exemption, qui touche une porte de publication ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- Branches des agents : 2821ab0a pour les retours, 03876661 pour le nommage, dae05828 pour les séances et les engagements ; héritage 1.59.0 en fef09ae1 ; fusion d3073d15, à laquelle `main` du pilot a été avancé sans toucher les fichiers en cours de l'autre session.
- `todo/TODO.jsonl` : 5 réponses consignées, 5 clôtures et 3 candidats ; oracle du registre PASS après chaque écriture.
- `todo/relectures-intention.jsonl` : la relecture RI-20261110-04.
- Le commit de clôture et cette synthèse sont publiés ensemble, vérifiés par `git rev-list --count origin/main..main` à 0.
