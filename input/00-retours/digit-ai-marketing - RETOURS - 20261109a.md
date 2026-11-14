# Retours forges — digit-ai-marketing — 20261109a

- **Contexte** : run — série d'animations HTML « La Factory en action » (cadrage et cinq épisodes), consigne du pilot du 09/11/2026, demande du porteur « A1, puis A2, puis A3 », A2.
- **Références ledger** : `forge\ledger.jsonl` seq 698, 699, 700 (entrées `type: retour`) ; seq 697 (conflit de règles sur le lieu des scripts, tranché en faveur du pilot) ; seq 701 (décisions D-180 et D-181 réservées).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 09/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures du run : cinq pages HTML jugées par huit juges chacune, toutes PASS sur leur version livrée ; `oracle-claims` en SKIP motivé sur quatre pages (aucune affirmation chiffrée hors tableau). Trois frictions de forge ont été observées et consignées au moment même.

---

## digit-ai-page-html (`digit-ai-forge-agents`)

Le socle HTML ne connaît pas la page à scènes : il n'en rend qu'un état et n'offre aucun gabarit pour en écrire une.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-04 | majeur | produit+générique | **`render_page.py` ne rend que l'état initial d'une page à scènes.** Faits : sur les cinq animations (7 ou 8 scènes chacune), 32 scènes sur 37 ne sont jamais rendues ni mesurées par `render_page.py`, qui le déclare dans son `non_juge` (« seul l'état INITIAL ») ; elles ont été revues sur une planche de captures écrite pour l'occasion (`forge/etapes/serie-animations-20261109/planche.py`, navigation au clavier, mouvement réduit). La planche a trouvé deux défauts que tous les juges avaient laissés passer : une étape orpheline (schéma de 4 étapes coupé en 3 + 1) et des adresses de redirection coupées au milieu du domaine. | Une option `--scenes <sélecteur>` qui parcourt les états déclarés (`[data-scene]`, ou une commande clavier déclarée) et mesure chacun aux largeurs du socle. |
| RA-05 | mineur | produit+générique | **Aucun gabarit d'animation à scènes au socle.** Faits : le lecteur (manifeste `SCENES`, lecture, pause, scène précédente et suivante, clavier, segments de progression, mouvement réduit, impression de toutes les scènes) a été écrit pour ce run dans `forge/etapes/serie-animations-20261109/construire.mjs` ; sa première version a pris 2 passes de juges pour atteindre PASS (31 espacements hors échelle de 4 px, bandeaux latéraux, symbole ▶, classe réservée « badge »). | Un composant « lecteur de scènes » au socle, avec sa fixture rouge et verte, si la ligne L12 est décidée chez le produit (D-181). |

## Pilot (`digit-ai-factory`)

Un hameçon a classé une demande de production comme une demande d'audit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-05 | mineur | générique | **Le hameçon de lexique lit un mot d'une liste d'exemples comme l'intention de la demande.** Faits : le 09/11/2026, la consigne de la série d'animations a reçu « ce message demande un AUDIT DU PRODUIT : la route par défaut est forge-audit ». Le mot « audit » n'y figurait que dans une piste d'idée d'animation (« l'audit d'un produit existant (forge-audit) »). La session a suivi la consigne et écarté forge-audit avec motif (`forge/mobilisation.jsonl`). | Ne déclencher la route d'audit que si le verbe de la demande porte l'audit, pas sur une mention dans une énumération ou une citation. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `controle-serie.mjs` comparait un titre normalisé à un manifeste non normalisé (espace insécable) | normalisation des deux côtés ; auto-test rejoué, 8 fixtures sur 8 distinguées | non : défaut du script du run | corrigé au produit |
| Scripts de contrôle écrits dans `scripts/`, liste close de la spécification §5 | consigne du pilot appliquée (R-43), conflit consigné seq 697 | non | décision D-181 posée au porteur |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucune stratégie de plateforme ni processus du client n'a été heurté pendant ce run.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : les six fichiers de la série sont à leur première version datée.

## Confirmations positives

- La règle « la critique d'implémentation se joue en dernier, `stat` relevé avant et après » a tenu : 5 sur 5, valeurs égales, et elle a trouvé à elle seule 3 familles de défauts sur l'épisode 1 que `check_html.py` et `render_page.py` avaient laissées passer.
- `allouer-indice.mjs` a rendu une lettre distincte par fichier du jour (a à f), sans collision.
- `mobiliser.mjs --verifier` a refusé une déclaration « inchangé » pour une recette d'agent qui n'existait pas : la trace a été corrigée plutôt que contournée.

## Ordre recommandé

1. RA-04, parce que 32 scènes sur 37 échappaient au juge de rendu et que la planche y a trouvé deux défauts réels.
2. RP-05, parce qu'un faux classement d'audit pousse une session vers une forge qui ne sert pas la demande.
3. RA-05, seulement si le porteur retient la ligne L12.

## La règle qui aurait évité le retour

RP-05 relève de la classe `oracle-faux-positif`, RA-05 de `gabarit-famille-manquante`. RA-04 n'a pas de classe au référentiel :

- RA-04 — clé `rendu-juge-sur-le-seul-etat-initial`, famille `skill-ou-oracle-non-invoque` : « Un juge de rendu ne mesure que l'état chargé d'une page à états multiples (scènes, étapes, onglets) : les autres états ne sont ni rendus ni mesurés. »
