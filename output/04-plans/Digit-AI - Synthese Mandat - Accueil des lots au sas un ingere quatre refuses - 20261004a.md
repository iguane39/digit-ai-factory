---
destinataire: humain
---

# Synthèse Mandat — votre décision D-56 est exécutée : le sas est vide, 1 lot sur 5 est entré au registre, 4 sont refusés à la porte (04/10/2026)

## 0. Synthèse d'ouverture

Les 5 lots qui attendaient au sas sont accueillis et pseudonymisés : le sas est vide. Un seul lot a pu entrer au registre, celui de Produit-02 du 1er octobre, avec 16 candidatures. Les 4 autres sont refusés à la porte, donc le registre n'a pas bougé pour eux. Pour 2 lots de Produit-02, dont celui de la campagne d'hier, la faute est au pilot : la porte applique une règle que le contrôle fourni aux produits ne vérifie pas, et le produit ne pouvait pas la voir. Ce défaut est consigné au registre. Les 8 corrections d'hier ne sont donc toujours pas closes au registre. Une décision vous est demandée, D-57 : que faire des 4 lots refusés.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « fais d56 », lue comme l'option (a) recommandée : accueillir puis ingérer les 5 lots du sas.
- **sur quoi** — pilot `digit-ai-factory`, de `9f7f0eef` à `b3494332` ; dépôts produits Produit-02 et Produit-12 lus seulement, pour mesurer la cause des refus.
- **quand** — 2026-10-04, de 07:18 à 07:40 UTC+02:00 (Europe/Paris), heures relevées dans les événements du registre (`ts` 05:20:53Z et 05:22:00Z).
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `todo/accueillir-lot.mjs --essai` puis sans essai, `todo/ingerer-lot.mjs` sur 5 sidecars, `gabarits/oracle-lot-retours.mjs`, `todo/journaliser.mjs`.
- **intention** — que les retours des produits entrent au registre et que les 8 corrections d'hier y soient closes avec leur preuve. **Test rétro** : servie en partie. L'accueil est fait. L'ingestion est faite pour 1 lot sur 5. La clôture des 8 corrections reste bloquée, parce que le lot qui les porte est refusé.

## 2. Verdict en une ligne

**PARTIEL — 10 fichiers accueillis sur 10, 0 refus à l'accueil ; 1 lot ingéré sur 5 (16 candidatures, TF-1575 à TF-1590) ; 4 lots refusés en rejet atomique, registre intact pour eux ; 1 défaut du pilot consigné (TF-1591).**

## 3. Décisions attendues de l'humain

Inventaire des bloquants — ce qui est bloqué, ce qui le lève, et ce qui se passe sinon :

- la clôture au registre des 8 corrections de la campagne d'hier, et l'entrée des retours des 4 lots refusés : votre réponse à D-57 ; sans elle, ces retours restent hors du registre ;
- la correction du défaut de la porte : votre décision sur sa candidature, TF-1591 ; sans elle, un autre produit peut encore être refusé à tort ;
- la création des classes et la qualification des identifiants du lot ingéré : la revue hebdomadaire ; sans elle, ces retours restent sans classe ;
- la vérification de conformité de l'héritage de Produit-02 : la présence du produit sous son pseudonyme sur ce poste ; sans elle, cette vérification reste non jouée, sans constat sur le produit.

> **D-57 : que fait-on des 4 lots refusés à la porte ?**
>
> Rappel du sujet : 4 lots de retours de 2 produits ont été refusés ce matin à la porte du registre, et le lot qui porte les 8 corrections de la campagne d'hier en fait partie. Les 2 lots de Produit-02 (20261003a, 1 retour ; 20261003b, 8 retours) sont refusés parce que leur fichier de données n'indique pas la classe proposée. Pourtant, leur texte la donne en toutes lettres : clé, famille et libellé. 2 lots de Produit-12 (20261001b, 20261002a) sont refusés parce qu'il leur manque une section obligatoire, « Documents mûrs » pour l'un et « Garde-fou de plateforme relevé » pour l'autre. La dérogation prévue par la porte ne couvre que 2 règles de forme plus anciennes, pas celles-là.
>
> **Recommandation : (a).** Sources consultées : `references/TODO-FORGE.md` (sas et lot refusé), l'en-tête de `todo/normaliser-lot.mjs` (un dérivé, jamais l'original modifié) et le commentaire de dérogation de `todo/ingerer-lot.mjs`.

| Option | Coût | Exclusions |
|---|---|---|
| (a) pour Produit-02 : produire un fichier dérivé qui recopie la clé, la famille et le libellé écrits dans le texte, laisser l'original intact, puis l'ingérer et clore les 8 corrections ; pour Produit-12 : renvoi au produit pour une nouvelle remise ; envoyer aussi un lot de travaux à chacun des 2 produits | complexité simple · durée courte | aucune |
| (b) renvoyer les 4 lots aux produits pour une nouvelle remise, avec le lot de travaux | complexité simple · durée longue (attente des produits) | la clôture des 8 corrections attend la nouvelle remise de Produit-02 |
| (c) ne rien faire pour l'instant | aucun | ni les 5 retours de Produit-02 ni ceux de Produit-12 n'entrent au registre ; les 8 corrections restent non closes |

> **Si rien n'est décidé** : (c). Les lots restent dans la boîte suivie, hors du registre.

Pourquoi les produits ont mal remonté, alors qu'ils ont les bons formats (cause mesurée, en lecture seule) :

- **Produit-02** : sur son disque, la copie du contrôle de remise est en 1.5.0 depuis le 02/10 à 10:24. Les lots ont été remis le 03/10 à 12:52 et à 17:47. Le produit avait donc la dernière version, et ce contrôle a répondu PASS honnêtement : `gabarits/oracle-lot-retours.mjs` ne contient aucune règle sur `classe_proposee`. La règle n'existe que dans `todo/ingerer-lot.mjs`, depuis le 15/09 (`4dbda141`, TF-1128). Le message de refus affirme « ce refus était évitable », ce qui est faux pour cette règle. La faute est au pilot, pas au produit : TF-1591.
- **Produit-12** : les lots ont été remis le 01/10 à 21:38 et le 02/10 à 07:36, et la copie 1.5.0 n'est arrivée sur son disque que le 02/10 à 10:24. Il a donc remis sous une version plus ancienne du contrôle, qui ne connaissait pas ces sections. C'est le même cas que TF-1568 à TF-1570.

## 4. Traité — avec sa preuve

- **Accueil des 5 lots (10 fichiers)** : les noms et les contenus sont pseudonymisés, puis déplacés du sas vers `input/00-retours/` ; aucune adresse IP ni aucun nom de personne à qualifier.
  - preuve : `accueillir-lot.mjs --essai` puis sans essai → « 10 lot(s) accueilli(s), 0 refusé(s) », exit 0 ; le sas ne contient plus que son README.
- **Ingestion du lot Produit-02 20261001b** : 16 candidatures entrées en `candidat`, TF-1575 à TF-1590, dont 6 marquées comme récidives.
  - preuve : `ingerer-lot.mjs` → « [OK] 16 candidature(s) ingérée(s) en CANDIDAT (lot 0ed71119ad3d) », exit 0.
- **4 lots refusés à la porte, registre intact pour eux** :
  - preuve : `ingerer-lot.mjs` → « [REJET ATOMIQUE] … registre intact », exit 1, pour Produit-12 20261001b et 20261002a et pour Produit-02 20261003a et 20261003b.
- **Défaut du pilot consigné** : TF-1591, en `candidat`.
  - preuve : `journaliser.mjs` → « 1 événement(s) journalisé(s) », `ts` 2026-10-04T05:22:00Z.
- **Commit** : `b3494332`, qui contient les 10 fichiers accueillis, le registre et le README de la boîte ; les fichiers de la cascade ISTO d'une autre session n'en font pas partie.
  - preuve : `git commit` → exit 0, 12 fichiers.

## 5. Non traité — avec son motif

- La clôture au registre des 8 corrections de la campagne D-55 (a) — motif : `dependance_bloc_3`, D-57, le lot qui les porte est refusé.
- La création des 9 classes proposées par le lot ingéré (dont `redirection-dev-null-ecrit-un-fichier-sous-windows` et `inference-ecrite-comme-fait-constate`), puis le rattachement des retours par rectification — motif : `dependance_externe`, ce travail se fait à la revue hebdomadaire.
- La qualification des 3 identifiants signalés (`LAST_30_DAYS`, `campaign.start_date_time`, `section.straight`) — motif : `dependance_externe`, revue hebdomadaire. Ma lecture : ce sont des noms d'interface publique de plateformes tierces, pas des noms confidentiels.
- La vérification de conformité de l'héritage (R-47) pour Produit-02 — motif : `dependance_externe`, l'ingesteur ne trouve pas le produit sous son pseudonyme sur ce poste.

## 6. Écarts à la lettre

- **Vous avez écrit** « fais d56 » sans préciser d'option → **j'ai exécuté l'option (a)**, la recommandation posée avec D-56 le 03/10 → **pourquoi** : c'est la seule option qui accueille les 5 lots, et les deux autres en excluent.

## 7. Risques

- Tant que TF-1591 n'est pas corrigé, un produit qui remet un lot conforme à son contrôle peut encore être refusé à la porte.
  - signal : un refus « classe_proposee » sur un lot dont le contrôle de remise disait PASS ;
  - parade : corriger TF-1591 en faisant appeler par le contrôle de remise la même validation que celle de l'ingesteur.
- Les lots refusés dorment dans la boîte suivie, hors du registre.
  - signal : `oracle-boite-entree` les signale à chaque ouverture ;
  - parade : trancher D-57.

## 8. Prochaines actions

Les actions sont triées par priorité, dans l'ordre où elles deviennent possibles.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier `b3494332` (`git push origin main`, `FORGE_PUSH_GO="D-54 (b) du 03/10"`), lancé en fin de tour | `auto_ia` | `neuve` | `dependance_externe` — le contrôle d'avant-publication du pilot dure environ 9 minutes | le registre mis à jour reste sur ce poste |
| **A-2** | Exécuter D-57 selon votre réponse, puis clore au registre les 8 corrections avec leurs commits | `auto_ia` | `neuve` | `dependance_bloc_3` — D-57 | les corrections restent sans trace au registre |
| **A-3** | Corriger TF-1591 : le contrôle de remise joue toutes les règles de rejet de l'ingesteur | `auto_ia` | TF-1591 | `dependance_bloc_3` — décision humaine sur la candidature | un autre produit sera refusé à tort |
| **A-4** | Créer les 9 classes proposées et qualifier les 3 identifiants à la revue hebdomadaire | `auto_ia` | TF-1575 | `dependance_externe` — revue hebdomadaire | les retours restent sans classe |

Traces : `todo/TODO.jsonl` (TF-1575 à TF-1591), `input/00-retours/Produit-02 - RETOURS - 20261003b.md`.
