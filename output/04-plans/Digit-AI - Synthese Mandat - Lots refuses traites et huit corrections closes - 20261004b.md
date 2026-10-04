---
destinataire: humain
---

# Synthèse Mandat — votre décision D-57 (a) est exécutée : les 2 lots de Produit-02 sont entrés au registre, les 8 corrections d'hier y sont closes, et les 2 produits ont reçu leur lot de travaux (04/10/2026)

## 0. Synthèse d'ouverture

Les 2 lots de Produit-02 refusés ce matin sont entrés au registre. J'ai produit pour chacun une copie de son fichier de données. Cette copie reprend mot pour mot la classe que le texte du lot proposait déjà, et l'original n'a pas été modifié. Les 8 corrections de la campagne d'hier sont maintenant closes au registre, chacune avec son commit et son gain mesuré. Les 2 lots de Produit-12 lui sont renvoyés. Chacun des 2 produits a reçu dans sa boîte d'entrée un lot de travaux qui explique quoi corriger et pourquoi. Aucune décision ne vous est demandée.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 57a » à D-57 : sidecars dérivés et ingestion pour Produit-02, renvoi de ses 2 lots à Produit-12, lot de travaux aux 2 produits, clôture des 8 corrections de la campagne D-55 (a).
- **sur quoi** — pilot `digit-ai-factory`, de `e6df2cdb` au commit de ce tour ; boîtes d'entrée `input/00-travaux/` de Produit-02 et Produit-12, écrites par `emettre-travaux.mjs` sans commit chez eux.
- **quand** — 2026-10-04, de 07:45 à 08:10 UTC+02:00 (Europe/Paris), heures relevées dans les événements du registre.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : un dérivateur écrit pour ce tour, `todo/ingerer-lot.mjs`, `todo/journaliser.mjs` (juge `oracle-todo` avant et après chaque écriture), `todo/emettre-travaux.mjs --essai` puis sans essai, `gabarits/oracle-lot-retours.mjs`.
- **intention** — que les retours des produits entrent au registre, que les 8 corrections d'hier y soient closes avec leur preuve, et que chaque produit sache comment ne plus être refusé. **Test rétro** : servie. Les 9 retours de Produit-02 sont au registre et les 8 corrections sont closes. Les retours de Produit-12 restent dehors jusqu'à sa nouvelle remise, et c'est le renvoi que vous avez choisi.

## 2. Verdict en une ligne

**PASS — 2 lots ingérés sur 2 (9 candidatures, TF-1592 à TF-1600), 8 corrections closes sur 8 (TF-1593 à TF-1600), 2 lots de travaux déposés sur 2, registre PASS avant et après chaque écriture.**

## 3. Décisions attendues de l'humain

Aucune décision attendue de l'humain.

Inventaire des bloquants — ce qui est bloqué, ce qui le lève, et ce qui se passe sinon :

- la création des classes proposées par les lots ingérés : la revue hebdomadaire ; sans elle, ces retours restent sans classe ;
- la qualification des 2 identifiants signalés : la revue hebdomadaire ; sans elle, la question de leur confidentialité reste ouverte ;
- la correction du contrôle de remise (TF-1591) : sa décision à la revue hebdomadaire ; sans elle, un autre produit peut être refusé à tort.

## 4. Traité — avec sa preuve

- **Sidecars dérivés pour Produit-02** : `…20261003a.normalise.tf.jsonl` et `…20261003b.normalise.tf.jsonl`, qui recopient clé, famille et libellé depuis le texte du lot ; aucune valeur n'est inventée, et une ligne sans proposition trouvée fait échouer le dérivateur.
  - preuve : 4 lignes complétées (RT-117 (publication hébergée sans garde), RT-119 (graphique à série unique), RT-120 (détail chiffré en prose), RT-121 (même indicateur, deux valeurs)) ; les originaux sont identiques à leur version enregistrée (`diff` contre `git show HEAD:`) ; essai préalable sur une copie jetable du registre, exit 0.
- **Ingestion** : 1 candidature (lot `d26ab59c4121`, TF-1592) puis 8 (lot `edf5742ee4e7`, TF-1593 à TF-1600).
  - preuve : `ingerer-lot.mjs` → « [OK] … ingérée(s) en CANDIDAT », exit 0, 2 fois.
- **Clôture des 8 corrections** : pour chacune, la décision humaine « 55a » est consignée, puis la correction, avec ses commits, son gain mesuré avant et après, et le contrôle qui la tient.
  - preuve : `journaliser.mjs` → « 16 événement(s) journalisé(s) », verdict du registre PASS avant et PASS après ; RT-118 → TF-1593 … RT-125 → TF-1600.
- **2 items de travaux au registre** : TF-1601 pour Produit-12 (compléter les sections, renuméroter RS-28 et RS-29, rejouer le contrôle, remettre) et TF-1602 pour Produit-02 (porter la classe proposée dans le sidecar).
  - preuve : première écriture annulée par le juge du registre (R4, score manquant), puis écrite avec son score, verdict PASS avant et PASS après.
- **Lots de travaux déposés** : `pilot - TRAVAUX - 20261004a.md` et son sidecar dans la boîte d'entrée de chacun des 2 produits, sans commit chez eux.
  - preuve : `emettre-travaux.mjs` → « 1 lot(s) déposé(s), 0 refusé(s) avant dépôt », exit 0, pour chacun.

## 5. Non traité — avec son motif

- La création des classes proposées par les lots ingérés (9 ce matin, plus `regle-de-publication-sans-garde-sur-l-outil` et les 3 de RT-119 à RT-121) — motif : `dependance_externe`, revue hebdomadaire.
- La qualification de 2 identifiants signalés (`rect.seg`, `text.dans`) — motif : `dependance_externe`, revue hebdomadaire. Ma lecture : ce sont des sélecteurs CSS et des fragments de texte, pas des noms confidentiels.
- La correction de TF-1591, le contrôle de remise qui ignore la règle de la classe proposée — motif : `dependance_externe`, la candidature attend sa décision à la revue hebdomadaire.

## 6. Écarts à la lettre

- **Vous avez répondu** « 57a » → **le dérivateur accepte, pour le lot 20261003a, une proposition écrite sans rappel du numéro de retour** → **pourquoi** : ce lot ne contient qu'une seule proposition, et l'attribution est donc sans ambiguïté ; s'il y en avait eu 2, le dérivateur aurait échoué.
- **Vous avez répondu** « 57a » → **les lots de travaux portent aussi les items encore ouverts pour ces produits** (5 de plus chez l'un, 4 de plus chez l'autre) → **pourquoi** : l'émetteur dépose tout ce qui reste ouvert pour un produit, c'est son fonctionnement normal.

## 7. Risques

- Produit-12 peut tarder à remettre ses lots, et ses retours restent alors hors du registre.
  - signal : le lot de travaux reste au statut `a_traiter` dans sa boîte d'entrée ;
  - parade : le relevé d'héritage le signale à chaque ouverture du pilot.
- Un autre produit peut être refusé de la même façon que Produit-02.
  - signal : un refus sur la classe proposée alors que son contrôle de remise disait PASS ;
  - parade : corriger TF-1591.

## 8. Prochaines actions

Les actions sont triées par priorité, dans l'ordre où elles deviennent possibles.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le commit de ce tour (`git push origin main`, `FORGE_PUSH_GO="D-54 (b) du 03/10"`), lancé en fin de tour | `auto_ia` | `neuve` | `dependance_externe` — le contrôle d'avant-publication du pilot dure environ 9 minutes | le registre reste sur ce poste |
| **A-2** | Instruire TF-1591 et créer les classes proposées à la revue hebdomadaire | `auto_ia` | TF-1591 | `dependance_externe` — revue hebdomadaire | le défaut de la porte reste ouvert |
| **A-3** | Ingérer les 2 lots de Produit-12 à leur nouvelle remise | `auto_ia` | TF-1601 | `dependance_externe` — remise du produit | ses retours restent hors du registre |

Traces : `todo/TODO.jsonl` (TF-1592 à TF-1602), `input/00-retours/Produit-02 - RETOURS - 20261003b.normalise.tf.jsonl`.
