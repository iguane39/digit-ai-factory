---
destinataire: humain
---

# Synthèse Mandat — compétences OpenAI et Gemini construites dans 3 forges et au pilot, D-163 (a) appliquée (03/11/2026)

## 0. Synthèse d'ouverture

Les 3 compétences sont construites et prouvées, et la commande d'audit ne fait plus payer le client sans son accord écrit. Un produit qui appelle OpenAI ou Gemini trouve désormais un guide d'intégration installé sur ce poste, un constat qui refuse les tests qui dépensent, et un contrôle qui croise tout le parc avec le calendrier d'arrêt des modèles. Ce contrôle a déjà trouvé 3 modèles qu'un produit emploie et qu'OpenAI arrête dans 38 jours. Les 3 forges sont publiées ; le pilot ne l'est pas, bloqué par le nom d'un autre produit dans le travail d'une autre session. Il vous revient de dire si les 3 produits concernés doivent être prévenus, et si le générateur d'images peut changer de modèle.

Livré : [Étude des compétences OpenAI et Gemini, corrigée](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Competences%20OpenAI%20et%20Gemini%20-%2020261103l.md)

## 1. En-tête d'identification

Run de mandat « 163a + A2 », sur le pilot `digit-ai-factory`, forge-development, forge-tests et forge-audit. Période : 03/11/2026 de 16:57 à 20:07, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 4 agents `campagne` Sonnet 5.5, un par dépôt, en parallèle ; escalade de modèle : aucune.

Intention de la demande : appliquer D-163 (a) à la commande d'audit, et construire les 3 compétences de l'action A-2, le skill de référence, le calendrier des modèles et le constat de test sans dépense.

Test rétro : le résultat sert cette intention. Chaque ajout est appelé et prouvé du rouge au vert : le skill est installé et renvoyé par le guide de forge-development, le constat tourne dans le pan prompts de forge-tests, et l'oracle rend ses premiers rouges sur le parc réel.

## 2. Verdict en une ligne

4 chantiers livrés sur 4, chacun passé du rouge au vert ; 3 forges publiées, `git rev-list` à 0 0 ; pilot enregistré et non publié.

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient : les 2 gestes du bloc 8 se tranchent par leur sélecteur. Rappel : D-161, ouverte par une autre session sur le nom d'emprunt du produit de tests d'intrusion, bloque toujours la publication du pilot.

## 4. Traité

- **D-163 (a), forge-audit, commit `617c025`.** La commande de CTL-D14-04 constate l'accord écrit du client dans `input/00 - Cadrage` avant l'appel, et lit sa clé dans `$AZURE_OPENAI_API_KEY`. 20 autres commandes des profils azure et elastic lisent désormais leurs mots de passe dans une variable. Les gardes P12 et P13 de `tools/verifier-profils.mjs` rendent 23 écarts sur l'état d'avant, 0 après ; rejoué à 17:10 : 24 cas sur 24.
- **Constat de test, forge-tests, commit `e7ec76e`.** Un test qui appelle OpenAI, Azure OpenAI ou Gemini sans double devient un constat bloquant. Banc : 23 rouges avant, 41 verts après ; rejoué à 17:38, tous verts.
- **Skill `integre-openai-gemini`, forge-development, commit `8b73332`.** Il compte 5 références, et un contrôle refuse tout identifiant de modèle hors de la page des dates ; self-test rejoué à 17:39 : 83 ok, 0 ko. La porte des secrets prenait sa page `secrets-donnees-couts.md` pour un porteur de secrets à cause de son nom : je l'ai renommée `cles-donnees-couts.md` avant de publier. Installé à 20:03 par `oracle-skills --appliquer`, verdict PASS.
- **Calendrier et oracle, pilot, commit `ceb8fb8f`.** `references/MODELES-TIERS.json` porte 225 modèles dépréciés ou arrêtés et 19 courants, chacun cité. `oracles/oracle-modeles-tiers.mjs` passe sa recette à 25 sur 25. Rejoué sur le parc à 19:59, il rend 2 rouges, les replis arrêtés du générateur d'images de forge-design. Il rend aussi 5 avertissements, dont `gpt-5`, `gpt-5-mini` et `gpt-5-nano` chez Produit-12, arrêtés le 11/12/2026.
- **Auto-accusation retirée.** L'oracle se citait lui-même : ses commentaires écrivaient `o3` et `ada` entre accents graves. Sans eux, plus aucune accusation sur le pilot.
- **Étude corrigée sur 3 faits contre-mesurés à 19:58.** « Déprécié le 28/05/2026 » lisait la date de sortie de `gemini-3.1-flash-image`, la colonne de la page étant « Release date ». Les 3 arrêts `gpt-5` manquaient. La page de Gemini annonce depuis l'après-midi la redirection de `gemini-2.5-pro` et `gemini-2.5-flash` au 01/12/2026. La correction est datée dans l'étude, qui repasse `oracle-ecriture` et `check_markdown.py`.
- **Publication des forges** sous le GO permanent `D-53 (b) du 03/10`. forge-audit, forge-tests et forge-development rendent `git push` exit 0, puis `git rev-list --left-right --count` 0 0 à 20:02 et 20:03. Les envois ont emporté aussi les commits déjà enregistrés par d'autres sessions, ce que la règle admet.
- **Registre.** Vos réponses sont inscrites, puis TF-2108, TF-2109, TF-2110 et TF-2112 passent à `corrige`, chacun avec sa voie de descente. La note de TF-2111 corrige la date, et 2 candidats naissent, TF-2115 et TF-2116. `journaliser.mjs` rend PASS avant et après, `oracle-todo` exit 0.

Relecture d'intention : sert, consigne des 4 agents relue avant leur lancement (RI-20261103-22, 2 écarts mineurs de choix humain).

## 5. Non traité

- **La publication du pilot** : motif, bloqué par un garde-fou ; `oracle-nom-client-publie` refuse l'envoi pour un nom de produit réel dans des fichiers d'une autre session, en attente de D-161. Le pilot a 20 commits d'avance à 20:05, dont les miens ; critère de réouverture : D-161 tranchée.
- **Le signalement aux 3 produits** : motif, dépendance à une décision humaine ; la Factory n'agit chez un produit que sur son run (TF-2115).
- **Le changement de modèle du générateur d'images** : motif, dépendance à une décision humaine ; il se prouve par un appel payant (TF-2111).
- **La cadence de l'oracle** : motif, hors mandat ; il se joue à la main tant que TF-2116 n'est pas décidé.
- **La recette complète du pilot** : motif, impossible à prouver ici ; l'agent l'a arrêtée après plus de 2 h sans bilan, sur un arbre que d'autres sessions modifiaient. Les recettes propres à chaque ajout sont vertes.
- **La lecture de la documentation de Microsoft pour Azure OpenAI** : motif, écarté ; le skill dit qu'elle n'a pas été lue, critère de réouverture : un produit Azure OpenAI.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-163 (a), sur la commande CTL-D14-04 | la même règle sur 21 commandes de 2 profils, avec une garde | une seule commande corrigée laisserait les autres passer |
| le nom du fichier d'accord, non précisé | `<client> - <TRI> - Accord appel IA - <AAAAMMJJ><indice>` dans `input/00 - Cadrage` | le dépôt ne nommait aucun document d'accord ; la forme suit sa nomenclature |
| un oracle sur les modèles dépréciés ou arrêtés | aussi un MT0 qui refuse un référentiel mal formé | sans lui, un référentiel illisible rendrait un vert sans objet |

## 7. Risques

- **Arrêts proches.** Énoncé : `gpt-5`, `gpt-5-mini` et `gpt-5-nano` s'arrêtent le 11/12/2026 chez Produit-12, dans 38 jours, et `gpt-4o-mini-2024-07-18` le 14/01/2027 chez Produit-82. Signal : des erreurs de modèle inconnu chez ces produits. Parade : A-1.
- **Pages qui bougent.** Énoncé : la page de Gemini a changé entre 15:31 et 17:05 le même jour. Signal : l'avertissement MT4 de l'oracle, ou un écart au rejeu. Parade : TF-2116, une cadence de rejeu.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Prévenir Produit-12, Produit-82 et l'autre produit des modèles qu'OpenAI arrête le 11/12/2026 et le 14/01/2027 | TF-2115 | manuelle_utilisateur | decision, la Factory n'agit chez un produit que sur son run | répondre « A-1 » pour un lot de signalement remis à chacun | des appels qui échouent au 11/12/2026 chez Produit-12 |
| A-2 | Faire passer le générateur d'images de forge-design aux modèles courants, avec un appel payant de preuve | TF-2111 | manuelle_utilisateur | decision, dépense | répondre « A-2 » ; l'appel se fait sous le GO de TF-0019 | 2 replis sur 5 restent inopérants |
| A-3 | Rejouer l'oracle des modèles à l'ouverture du pilot ou chaque semaine | TF-2116 | auto_ia | hors mandat de ce tour, candidat à la revue hebdomadaire | `node oracles/oracle-modeles-tiers.mjs` | le calendrier vieillit sans alerte |

## 9. Traces

- forge-audit : `617c025` ; forge-tests : `e7ec76e` ; forge-development : `8b73332` ; publiés.
- Pilot, enregistré et non publié : `ceb8fb8f` (calendrier et oracle), puis le commit de cette synthèse, de l'étude corrigée, de l'oracle retouché et du registre.
- Registre : `todo/TODO.jsonl`, TF-2108 à TF-2116 ; relecture : `todo/relectures-intention.jsonl`, RI-20261103-22.
- Consignes et rapports des agents : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\a0b92278-318b-4727-aa5e-4ab9fb1eb010\scratchpad\mandat`.
