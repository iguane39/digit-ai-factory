---
destinataire: humain
---

# Synthèse Mandat — boucle de correction, relecteur renforcé et seuil de 4 millions enregistrés et publiés (18/10/2026)

## 0. Synthèse d'ouverture

Votre réponse « 27a » est exécutée. La boucle de correction, le relecteur renforcé et le seuil de 4 millions de jetons par jour sont enregistrés et publiés : les produits et l'autre poste les reçoivent à leur prochaine ouverture. Un fichier manque à la publication, le juge des restitutions : il mêle ma modification à un travail en cours de l'autre session, et l'enregistrer aurait publié ce travail inachevé. Il partira avec l'enregistrement de l'autre session. La publication a aussi emporté 2 enregistrements de l'autre session, déjà faits sur ce poste ; je vous le signale, car D-27 ne les nommait pas. Aucune décision neuve.

## 1. En-tête d'identification

Exécution de D-27 (a) du 18/10/2026, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 18/10/2026, de 17:15 à 17:41, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5. 1 agent délégué : 1 `verificateur` (Claude Sonnet 5.5) pour la relecture de fin de tour. Escalade de modèle : aucune.

Intention de la demande : que la boucle, les règles du relecteur et le nouveau seuil valent partout, chez les produits et sur l'autre poste, et plus seulement sur ce disque.

Test rétro : le résultat sert cette intention, à un fichier près. Le dépôt distant porte la boucle, les règles, le seuil et leurs recettes ; seul le juge des restitutions attend l'enregistrement de l'autre session, et d'ici là il n'accepte pas encore la mention « sert après N passe(s) » chez les produits.

## 2. Verdict en une ligne

Enregistrement 3c4c0b94 publié (aac31b88..3c4c0b94), 36 chemins, garde de publication passée en 688 s ; poste et dépôt distant à égalité ; juge des restitutions laissé hors de l'enregistrement ; relecture de fin de tour : sert.

## 3. Décisions attendues

Aucune décision neuve. La publication des 2 enregistrements de l'autre session est faite ; si vous ne la vouliez pas, dites-le, et je proposerai un enregistrement correctif.

## 4. Traité

Chaque élément du tour, avec sa preuve.

- **Enregistrement de mes seuls chemins.** 36 chemins : script de relecture 2.0.0 et sa recette, référentiel de l'essai, référentiel des règles par type de travail, règle de restitution 2.46.0, héritage 1.35.0, relevé de dépense et ses recettes, contrat d'interface, gabarit de campagne, index des références, registre des relectures. Preuve : enregistrement 3c4c0b94. Le contrôle d'avant enregistrement a remplacé 1 nom par son pseudonyme dans le registre des relectures.
- **Publication sous la garde, au titre de D-27 (a).** Preuve : « aac31b88..3c4c0b94 main -> main », en 688 s ; écart avec le dépôt distant : 0 et 0.
- **Juge des restitutions laissé hors de l'enregistrement.** `oracles/oracle-synthese.mjs` porte ma règle « sert après N passe(s) » et, dans les mêmes lignes, un contrôle en cours de l'autre session, qui appelle une bibliothèque non encore enregistrée. Preuve : `git status`, le fichier reste modifié, et la bibliothèque `oracles/lib-exhaustivite.mjs` reste non suivie.
- **2 enregistrements de l'autre session publiés avec le mien.** c50c7437 et 8a000fd9 étaient déjà enregistrés sur ce poste, sous ses propres décisions D-29 à D-33 ; une publication emporte tout ce qui précède. Preuve : journal git, les 2 enregistrements entre aac31b88 et 3c4c0b94.
- Relecture d'intention : sert — RI-20261018-11, type autre, un écart mineur (choix humain : 2 enregistrements de l'autre session publiés avec le mien, signalé au bloc 3).

## 5. Non traité

- **L'enregistrement du juge des restitutions.** Motif : il mêle mon travail à celui de l'autre session ; il partira avec l'enregistrement de celle-ci, et je vérifierai alors qu'il porte bien ma règle.
- **La confirmation de l'alerte RI-20261018-01.** Motif : elle attend votre avis ; elle se donne par `--confirmer`.

## 6. Écarts à la lettre

Un écart, déclaré.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 27a » : enregistrer et publier le juge des restitutions avec le reste | Je l'ai laissé hors de l'enregistrement | Ses lignes portent aussi un travail inachevé de l'autre session, qui ne fonctionne pas sans un fichier non enregistré |

## 7. Risques

- **Le juge publié ne connaît pas encore « sert après N passe(s) ».**
  - Énoncé : chez un produit, une restitution qui écrit cette mention serait refusée par le juge publié.
  - Signal : un refus du contrôle de fin de tour sur la ligne de relecture d'intention.
  - Parade : écrire « sert » sans le nombre de passes jusqu'à l'enregistrement de l'autre session ; je vérifie ce point après celui-ci.

## 8. Prochaines actions

Ordre : la vérification d'abord, parce qu'elle dépend de l'autre session ; la revue datée ensuite ; votre avis sur l'alerte enfin.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1865 | Vérifier que le juge enregistré par l'autre session porte « sert après N passe(s) » | auto_ia | dependance_externe : attend l'enregistrement de l'autre session | `git log -1 -- oracles/oracle-synthese.mjs`, puis `node oracles/oracle-synthese.mjs --self-test` | Le juge publié refuse la mention de la boucle |
| **A-2** | TF-1865 | Revue de l'essai, boucle comprise | auto_ia | dependance_externe : la revue est datée du 2026-11-08 | `node scripts/relecture-intention.mjs --releve --depuis 2026-10-18` | La boucle n'est pas évaluée |
| **A-3** | TF-1865 | Confirmer ou infirmer l'alerte RI-20261018-01 | manuelle_utilisateur | decision : seul vous jugez si l'alerte était fondée | Répondre dans la conversation, par exemple `RI-01 oui` | L'alerte reste non confirmée à la revue |

## 9. Traces

- Enregistrement publié : 3c4c0b94, sur `main`
- Registre des relectures : `todo/relectures-intention.jsonl` (RI-20261018-11 pour ce tour)
- Dépense du jour : 1 584 861 jetons pour 25 relectures, sous le seuil de 4 000 000
- Cette synthèse n'est ni enregistrée ni publiée.
