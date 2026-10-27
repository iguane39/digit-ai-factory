---
destinataire: humain
---

# Synthèse Mandat — réponses 81 à 84 : trois sur quatre livrées, la quatrième en construction (26/10/2026)

## 0. Synthèse d'ouverture

Vos quatre réponses sont consignées. La règle des pages trop étroites reste bloquante comme vous l'avez choisi. Le registre commun des numéros de décision est construit et vérifié. L'essai du relecteur neuf a été joué : il repère 4 des 6 messages qui vous avaient réellement gênés, ce qui tient le seuil, mais il signale aussi 9 messages sur 27 qui ne vous avaient pas gênés, alors que le seuil en admettait 3. La critique automatique des pages est encore en construction. Deux choses vous reviennent : décider si l'on paie un second essai à deux relecteurs, et renouveler deux jetons Meta trouvés en clair dans une ancienne conversation.

## 1. En-tête d'identification

Mise en œuvre des réponses « 81b, 82a, 83a, 84a » à la revue hebdomadaire, pilot digit-ai-factory, poste DESKTOP-ULTRA7, le 26/10/2026 de 21:38 à 22:47, heure de Paris. Session de pilotage Claude Opus 5.5 ; 3 agents de campagne (Sonnet) dans des arbres de travail isolés, 33 lecteurs neufs (Sonnet), 2 relecteurs d'intention (Sonnet) ; escalade de modèle : aucune.

Point d'étape : D-82 n'est pas encore rendu.

Intention de la demande : que les quatre options choisies soient appliquées et vérifiées, sans vous laisser de validation manuelle.

Test rétro : pour trois des quatre réponses, le résultat sert l'intention ; D-82 reste à mesurer.

## 2. Ce qui reste à mesurer, et par quoi

- D-82, la critique exigée en fin de tour : le rapport de l'agent de campagne, puis ses recettes rejouées par le pilot (`node oracles/hook-restitution.test.mjs`, `node oracles/oracle-synthese.mjs --self-test`) et la relecture de réception.
- La fusion de D-82 et D-83, qui réclament tous deux la version 2.51.0 du gabarit de restitution et 1.40.0 du contrat d'héritage : les recettes rejouées sur `main` après fusion, puis l'envoi du pilot.

## 3. Décisions attendues

> **D-85 — Faut-il lancer l'essai à deux lecteurs d'accord du lecteur d'usage de la restitution, pour environ 2 millions de jetons de plus que le budget accordé ?**
>
> - **De quoi s'agit-il** : le relecteur neuf qui lirait chaque restitution comme vous, avant l'affichage, et signalerait une demande que le message seul ne permet pas de tenir.
> - **Le problème** : avec un seul lecteur, il voit 4 messages gênants sur 6 (seuil 4, tenu), mais il signale à tort 9 messages sur 27 (seuil 3, non tenu), tous parmi les 17 qui vous demandent quelque chose. Plusieurs de ces 9 signalent des décisions rappelées par leur seul numéro, sans options, ce qui peut être un vrai défaut que personne n'avait relevé.
> - **Pourquoi vous** : c'est une dépense de jetons au-delà du budget accordé (1 985 931 jetons déjà consommés sur 0,7 à 2,1 millions).
> - **Recommandation : (b)** — l'essai à deux lecteurs est l'étape prévue d'avance, mais relire d'abord les 9 signalements dira s'ils sont faux ou s'ils révèlent un défaut réel ; cette relecture coûte peu et peut rendre le second essai inutile. Source consultée : comptage pré-enregistré `scripts/compter-lecture-usage.mjs`, rejoué sur `main` à 22:45 ; pré-enregistrement `references/LECTURE-USAGE-PREENREGISTREMENT-20261026.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lancer l'essai à deux lecteurs | 33 nouvelles lectures ; un texte n'est signalé que si les deux lecteurs s'accordent ; les chiffres vous sont rendus | Simple × court, environ 2 millions de jetons | Sans objet : rien n'est mis en service |
| (b) *(recommandée)* Relire d'abord les 9 signalements | Je classe chacun des 9 en défaut réel ou faux signalement, avec la ligne citée, sans nouvelle lecture ; je vous repose la suite avec ce classement | Simple × court, quelques dizaines de milliers de jetons | Sans objet |
| (c) Arrêter l'essai | Le relecteur neuf n'entre pas en service ; seule la règle mécanique du lien vers le contenu juge l'usage du message | Nul | Possible : l'essai se relance sur le même banc |

> **Sans réponse** : (c), arrêter l'essai.

## 4. Traité

- Réponses consignées au registre : 4 événements par `journaliser.mjs` (TF-1945, TF-1913, TF-1911, TF-1944 passés en décidés), enregistrement `aef2a818`.
- D-81 (b) : TF-1945 clos en corrigé, la descente nommée ; constat sur la forge publiée, `render_page.py` ligne 3086 porte V23 « bloquant » et le registre des échéances ne nomme pas V23 (0 occurrence).
- Consignes des trois agents relues avant lancement : relecture RI-20261026-13, « sert », aucun écart.
- D-83 (a) : registre commun des réservations construit par l'agent (commit `1816064a`, branche de son arbre de travail). Relecture de réception RI-20261026-14 : « sert », 1 écart mineur. Recette rejouée par moi : elle échouait dans ma session (le préjugement relisait ma transcription), et je l'ai rendue étanche (commit `6cde28b4`). Résultat : `reserver-decision : 107/107`, `hook-restitution : 58/58`.
- D-84 (a), préparation : rubrique figée, seuils pré-enregistrés au commit `458be603`, 33 cas hors dépôt (6 positifs, 27 négatifs), fusionnés sur `main` sans réécrire ce commit (`790a6dc7`). La recette du comptage échouait sur `main` à cause des fins de ligne CRLF ; corrigée (`7aea06b7`), elle rend `35 PASS, 0 FAIL`.
- D-84 (a), essai : 33 lecteurs neufs, 33 réponses valides, comptage rejoué depuis `main`. Résultat : rappel 4 sur 6, tenu ; faux signalements 9 sur 27, non tenu ; verdict `AU_DESSUS_DES_SEUILS`. Jetons : 1 985 931. Réponses rangées au canal confidentiel ; résultat chiffré consigné sur TF-1944.
- Relecture d'intention : sert, pour les consignes et pour la réception de D-83 ; la réception de D-82 reste à faire.

## 5. Non traité

- D-82 (a) — motif : dependance_externe, l'agent de campagne travaille encore.
- La fusion de D-83 sur `main` et l'envoi du pilot — motif : dependance_externe, ils attendent D-82, qui touche les mêmes lignes.
- La recherche du second cas du 19/10 et des négatifs tirés des produits, proposées par l'agent de préparation — motif : hors_mandat, à instruire si D-85 se poursuit.

## 6. Écarts à la lettre

- Vous avez demandé un relecteur « sans outil » (option O3 de l'étude) → chaque lecteur a lu un seul fichier d'invite avec l'outil de lecture → recopier 33 invites de 3 000 à 50 000 caractères dans les appels exposait à des erreurs de recopie ; le fichier ne contient que la rubrique et le message, sans étiquette (contrôle : aucune fuite d'étiquette avant le début du message).
- La réponse de LU-15 est comptée en « essai 2 » → c'est ma recopie qui l'avait cassée (l'outil shell réduit `\\` à `\`), pas le lecteur → sa réponse exacte a été réenregistrée par un fichier écrit directement.

## 7. Risques

- Deux jetons Meta collés en clair dans une conversation du 18/10, relevés par l'agent de préparation sans être recopiés. Signal : ils restent dans les transcriptions du poste. Parade : les renouveler dans la console Meta (A-2).

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 avant tout envoi du pilot.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1913, TF-1911 | Recevoir D-82, le relire, fusionner D-82 et D-83 sur `main` en renumérotant leurs versions, rejouer les recettes, publier le pilot | auto_ia | dependance_externe | retour de l'agent de campagne, puis `FORGE_PUSH_GO="D-54 (b) du 03/10" git push origin main` | la critique et le registre commun restent sur ce poste |
| **A-2** | `neuve` | Renouveler les deux jetons Meta collés en clair le 18/10 | manuelle_utilisateur | irreversible : seul le titulaire du compte Meta peut révoquer un jeton | console Meta pour développeurs, application concernée, section des jetons d'accès : révoquer, puis régénérer | un jeton exposé reste utilisable par qui lit les transcriptions |

## 9. Traces

- Commits `aef2a818`, `790a6dc7`, `7aea06b7` sur `main` (non publiés) ; branche de D-83 avec `1816064a` et `6cde28b4`.
- `references/LECTURE-USAGE.md`, `references/LECTURE-USAGE-PREENREGISTREMENT-20261026.md`, `scripts/compter-lecture-usage.mjs`.
- `todo/TODO.jsonl` (TF-1911, TF-1913, TF-1944, TF-1945), `decisions/REGISTRE.jsonl` (D-85), `todo/relectures-intention.jsonl` (RI-20261026-13 et 14).
