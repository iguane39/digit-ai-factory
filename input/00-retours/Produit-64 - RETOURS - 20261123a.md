# Lot de retours — Produit-64 → digit-ai-factory (un geste confié à un tiers sans lire son droit) — 2026-11-23, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, `oracles/hook-restitution.mjs` (règles des actions laissées à un humain).

**Origine** : session interactive du 23/11/2026. Le porteur a demandé de traiter une demande de connexion de service Azure DevOps. La session a constaté que la connexion existait et marchait. Elle a ensuite rédigé un mail qui disait au demandeur : « il suffit de cliquer sur Permit ». Le porteur a demandé si ce demandeur avait le droit de le faire. Le relevé a montré que non.

Ce lot porte **1 retour** (RT-78).

- **Contexte** : une session de ce produit, hors run.
- **Références ledger** : sans objet.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-23.

---

## digit-ai-factory (hook-restitution, actions laissées à un humain)

Le retour, son fait mesuré et la correction proposée :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-78 | majeur | générique | **Un geste a été confié à un tiers nommé sans que son droit soit lu.** Le texte de mail proposé disait au demandeur qu'il lui suffisait de cliquer sur « Permit » au premier lancement de ses pipelines. Or seul le rôle Administrator de la connexion donne ce clic. Relevé ensuite : `securityroles/.../serviceendpointrole/roleassignments` → 3 titulaires (le créateur de la connexion, le groupe d'annuaire des contributeurs, `Endpoint Administrators`). Le compte de développement du demandeur n'est dans aucun d'eux : Graph `checkMemberGroups` → `Readers` seul ; Azure DevOps `Memberships?direction=up` → `APP-IA Team` → `Contributors`. La restitution était PASS : S13 ne demande qu'un libellé d'écran, et S52 ne vise que les actions de l'acteur `manuelle_utilisateur`, pas un geste prescrit à un tiers dans un texte à envoyer. | 1) Règle : un geste prescrit à une personne autre que le porteur, que ce soit dans une action ou dans un texte à envoyer, cite le droit qui le permet et le relevé qui montre que cette personne le détient (rôle sur la ressource, appartenance de groupe, avec héritage). 2) Contrôle de restitution : un verbe de geste (« cliquer », « approuver », « autoriser », « valider ») adressé à un tiers sans « droit lu : » ni référence de relevé → avertissement. 3) Fixture double sens : « il suffit de cliquer sur Permit » seul → rouge ; la même phrase suivie de « droit lu : Administrator via <groupe>, relevé du <date> » → vert. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-78** : classe `interface-tierce-ecrite-de-memoire`. Le geste a été prescrit de mémoire (« un administrateur clique sur Permit »), puis attribué à un tiers sans lecture de ses droits. C'est le miroir de TF-2302, où une absence de droit était conclue d'une seule portée. Ici, c'est une présence de droit qui est supposée sans aucun relevé.

## Rattachement

Registre interrogé le 23/11/2026 : `grep -ic "permit" todo/TODO.jsonl` → 0 ligne(s) trouvée(s). Registre interrogé le 23/11/2026 : `grep -iE "(droit|permission|habilit)[^\"]{0,80}(destinataire|tiers|personne|demandeur)" todo/TODO.jsonl` → 9 ligne(s) trouvée(s), dont TF-1117, TF-1378, TF-1517 (forme d'une demande à une équipe tierce), TF-1547, TF-2294 et TF-2302 (absence de droit conclue d'une seule portée). Aucun item ne traite d'un droit supposé chez le tiers à qui l'on confie un geste.

## Remarques restées au produit

Rien à dire : aucune remarque n'est restée au produit, généralisable : non, parce que la seule correction locale est le texte du mail, déjà réécrit dans la restitution du tour.

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : le tour n'a écrit aucun livrable sous `output/`.

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs` le 23/11/2026 : 10 documents. Ce lot, consacré à RT-78, n'instruit pas leur forme ; les verdicts du lot `Produit-64 - RETOURS - 20261110a` restent inchangés, et ils sont rappelés ci-dessous.

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

Aucun garde-fou de plateforme relevé.
