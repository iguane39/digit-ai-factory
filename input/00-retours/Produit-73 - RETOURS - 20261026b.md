# Retours forges — Produit-73 — 20261026b

- **Contexte** : autre — session hors run du 26/10/2026 ; correction de la fiche DPO demandée par l'humain (« Comment cette question peut être posée ? Et comment mon statut peut ne pas être connu ? »).
- **Références ledger** : `forge\ledger.jsonl` seq 146 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) ; un lot
  au nom réel posé à la racine est refusé (règle LOT-SAS de l'oracle, TF-1054) —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Un livrable destiné à un tiers lui a posé une question sur l'humain de la session lui-même, qu'il suffisait de lui demander.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-17 | majeur | générique | **Question posée au DPO sur le statut de l'émetteur de la demande.** La fiche DPO 20261026a portait la ligne « S. Pesme Cansar porte le statut Partner dans Entra : à qualifier par le DPO s'il désigne un intervenant extérieur » et le point « Qualifier le statut Partner d'un des quatre utilisateurs ». Les deux sont recopiés d'une hypothèse non résolue du tableau de traitement OSP0901 (fiche AI-DATA-01). La personne visée est l'humain de la session, signataire de la demande au DPO. Retour humain, mot pour mot : « Comment cette question peut être posée ? Et comment mon statut peut ne pas être connu ? » Les trois contrôles de la fiche (charte, oracles forge-design, rendu réel) rendaient PASS. | Avant de soumettre à un tiers une question sur une personne nommée, la rapprocher de l'identité de l'humain de la session et des signataires ; une hypothèse ouverte d'un document source se pose à l'humain dans le tour, elle ne se recopie pas dans un livrable. Règle qui aurait évité le retour : aucune ne la couvre (voir la dernière section). |

**Portée** (R-45, 21/08) : *générique* — tout livrable rédigé à partir de documents d'agent peut hériter de leurs hypothèses ouvertes, et aucun oracle ne confronte une question posée à un tiers à ce que sait déjà le commanditaire.

## Rattachement

Registre interrogé le 26/10/2026 : `grep -c -i "hypoth" todo/TODO.jsonl` → 22 ligne(s) trouvée(s), titres relus en entier.
Items recoupés : aucun. TF-1178 (étude fermée par trois hypothèses) est voisin mais vise le périmètre d'une étude, pas une question posée à un tiers.

## Remarques restées au produit

- La même hypothèse figure encore dans le tableau de traitement OSP0901 du 20/10 (fiche AI-DATA-01, « Réponse attendue »). Ce document est daté et peut avoir été transmis ; il n'a pas été modifié dans ce tour. Généralisable : oui → remonté en RV-17.

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\10-fiches-dpo\Ventilation Fournisseur-A - Fiche DPO - 20261026b.html` | gabarit non marqué : `skills\client-a-page-html\assets\boilerplate.html` (socle Client-A) — aucune version du gabarit déclarée dans le document | aucun contrôle des questions posées au destinataire | le commanditaire a relevé une question sur son propre statut | la ligne et la question ont été retirées à la main | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **Le versionnement a tenu** : la correction sort à l'indice b, l'indice a est rangé dans `old\`, et les trois contrôles rejoués sur l'indice b rendent PASS.

## Ordre recommandé

1. RV-17 — seul retour du lot.

## La règle qui aurait évité le retour

- **RV-17** suit un retour humain. Aucune règle ne le couvre : classe proposée **`question-au-tiers-sur-un-fait-connu-du-commanditaire`**, famille **`gabarit-document`**, libellé : « Un livrable pose à un tiers une question dont la réponse est connue du commanditaire, souvent sur le commanditaire lui-même, parce qu'une hypothèse ouverte d'un document source a été recopiée au lieu d'être posée à l'humain ». Voisine : `decision-posee-hors-du-ressort-humain`, qui vise une décision posée à l'humain sans motif, pas une question posée à un tiers.
