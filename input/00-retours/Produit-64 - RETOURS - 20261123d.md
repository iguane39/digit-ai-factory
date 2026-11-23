# Lot de retours — Produit-64 → digit-ai-factory (des décisions hors format B que rien ne refuse, une remarque rapportée au mauvais objet) — 2026-11-23, indice d

**Émetteur** : produit `Produit-64` · **Cibles** : `digit-ai-factory`, `oracles/oracle-synthese.mjs` (S78, S30, S31) et la doctrine de restitution.

**Origine** : session interactive du 23/11/2026. Trois restitutions de la session ont posé leurs décisions dans l'ancienne forme. Le porteur a d'abord écrit « Le prompt ne respecte pas le format de sortie », puis, une version plus tard, il a joint une capture du format B en demandant : « le bon format du chapitre 3 est celui-ci, pourquoi ce n'est pas le cas, même après la deuxième demande ? ».

Ce lot porte **2 retours** (RT-82, RT-83).

- **Contexte** : une session de ce produit, hors run.
- **Références ledger** : `forge/ledger.jsonl`, seq 20 (retour RT-82) et seq 21 (retour RT-83).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-23.
- **Note sur le lot précédent** : RT-80, du lot `Produit-64 - RETOURS - 20261123c`, est né de la lecture erronée que décrit RT-83. Le fait qu'il mesure reste vrai, mais il n'avait pas été demandé ; le pilot le juge sur son seul mérite.

---

## digit-ai-factory (contrôle des décisions, lecture d'une remarque)

Les deux retours, leur fait mesuré et la correction proposée :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-82 | majeur | générique | **Une décision écrite en puce échappe au contrôle du format B.** `oracles/oracle-synthese.mjs`, ligne 3570 : sans décision en bloc de citation, S78 rend `SANS_OBJET` (« anatomie du format B non jugée »), jamais `FAIL`. S30, S31 et S32 acceptent encore la tête « **Décision 1 —** » et un tableau « Option \| Contenu ajouté \| Coût \| Exclut ». Le 23/11/2026, trois restitutions du produit (`forge/travaux/RESTITUTION-20261123a`, `…b`, `…c`) ont été préjugées affichables dans cette forme, sans numéro réservé, et le contrôle de réservation s'est tu faute de tête D-N. Le porteur a dû redemander le format B deux fois. | 1) S78 : une restitution datée après le 17/10/2026 qui porte des options (a)/(b)/(c) sans aucune décision en citation rend `FAIL`. 2) S30 et S31 refusent, après cette date, la tête « Décision N » et la colonne « Exclut ». 3) Fixture double sens : la restitution `…20261123c` du produit → refusée ; la même au format B avec D-20 et D-21 → acceptée. |
| RT-83 | mineur | générique | **Une remarque du porteur a été rapportée au mauvais objet.** « Le prompt ne respecte pas le format de sortie » visait le format des décisions de la restitution. La session l'a lue comme une remarque sur le prompt réécrit de la revue L99 et a produit une version c de cette revue (commit `aeb860e`) au lieu de demander quel objet était visé. Elle l'a signalé en une ligne (« Si vous visiez un autre format, dites lequel »), ce qui n'a pas évité l'aller-retour. | 1) Doctrine : quand une remarque peut viser deux objets du tour (le livrable ou la restitution), la session demande lequel avant de produire une version. 2) Le hook de lexique reconnaît « format de sortie » dans un message humain et rappelle que la restitution elle-même est un objet possible. |

**Portée** : générique, pour les deux retours.

## La règle qui aurait évité le retour

- **RT-82** : classe `classe-a-creer`, classe proposée `anatomie-de-decision-non-jugee-hors-citation`, famille `restitution-forme`. Le juge du format B ne sait pas dire « absent » : il dit « sans objet », et l'ancienne forme reste admise par les règles plus anciennes. La classe voisine `reservation-bornee-au-format-en-citation` décrit le même angle mort pour la réservation des numéros.
- **RT-83** : classe `classe-a-creer`, classe proposée `remarque-humaine-rapportee-au-mauvais-objet`, famille `restitution-forme`. Une remarque courte sur « le format » a deux lectures dans un tour qui produit un livrable et une restitution ; rien ne fait lever l'ambiguïté avant de produire.

## Rattachement

Registre interrogé le 23/11/2026 : `grep -iE "S78" todo/TODO.jsonl | grep -iE "puce|hors citation|bloc de citation" | grep -oE '"id":"TF-[0-9]+"'` → 0 ligne(s) trouvée(s). Registre interrogé le 23/11/2026 : `node -e` sur `todo/CLASSES.json`, filtre « décision » et « format, citation, puce » → 5 ligne(s) trouvée(s), dont `reservation-bornee-au-format-en-citation`, qui traite de la réservation et non de l'anatomie.

## Remarques restées au produit

Rien à dire : aucune remarque n'est restée au produit, généralisable : non, parce que la mémoire du poste est mise à jour dans le même tour (format B relu au gabarit avant d'écrire, question avant une version quand une remarque a deux lectures).

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : la fiche `Client-A - Note - Format des decisions non tenu - 20261123d.md` suit la forme de fiche brève du poste, et `check_markdown.py` la rend PASS.

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs` le 23/11/2026 : 10 documents. Ce lot n'instruit pas leur forme ; les verdicts du lot `Produit-64 - RETOURS - 20261123a` restent inchangés, et ils sont rappelés ci-dessous.

| Document (versions) | Verdict |
|---|---|
| Guide développeur POC-to-Prod (30) | remonté : sa forme est la famille `gd-guide-de-reference` du pilot, publiée le 28/09/2026 |
| Modèle Rapport d'audit POC-to-Prod (24) | reste au produit, parce que sa forme relève du produit d'audit (`auditcore`) et non de la bibliothèque du pilot ; non instruit plus avant par cette session |
| Propositions ADR par domaine (16) | reste au produit, parce que sa matière est propre à Client-A ; forme non instruite par cette session, à juger par le porteur |
| Schéma Process POC-to-Prod End-to-end (14) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Référentiel POC-to-Prod - Audit (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Compliance Pack - Format & Contenus des contraintes (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Process Ingénierie POC-to-Prod - Consolidation et cible (7) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Matrice Contraintes ADR Light-Complet (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Catalogue ADR Client-A par domaine (5) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé. Aucune écriture sur Azure DevOps n'a été refusée dans ce tour.
