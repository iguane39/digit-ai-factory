# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260821b

- **Contexte** : constat en passant, relevé pendant la remise du lot `20260821a` (dépôt d'un lot de retours dans `input\00-retours\` puis ingestion)
- **Références ledger** : sans objet — run de conseil mené hors socle de ledger produit
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-21

Un seul retour, sur le **pilot**. Il n'a rien à voir avec le sujet du lot `20260821a` : il a été
rencontré en appliquant la procédure de remise de ce lot-là, et la règle des garde-fous
(« constat en passant → candidat ») demande de le verser.

---

## pilot (`digit-ai-factory`) — `oracles\oracle-boite-entree.mjs`

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RA-5 | majeur | **`oracle-boite-entree` est rouge par construction depuis le passage aux README de dossier : il ne peut plus prouver que la boîte est vide.** Verdict exécuté le 21/08/2026 sur un dépôt propre, lot correctement ingéré (B1 PASS, B2 PASS) : `B3 FAIL — ou: README.md — « lot remis SANS sidecar — aucun canal ne peut l'ingérer, il est invisible par construction »` et `B5 FAIL — ou: README.md — « remise d'artefact NON RATTACHÉE (aucun sidecar) »`. Cause : la ligne 137 de l'oracle exempte `LISEZMOI.md` et **pas** `README.md`, alors que `scripts\readme-dossiers.mjs` dépose désormais un `README.md` dans chaque sous-dossier de `input\` par hook PostToolUse (commit `63af797`, « README vivants »). Les deux noms coexistent aujourd'hui (`input\03-artefacts\` porte les deux). Conséquence : l'oracle que le noyau exige à l'ouverture de **tout** run sort en FAIL quoi qu'il arrive — et un gate qui est toujours rouge cesse d'être lu, ce qui est exactement le défaut que B1-B5 avaient été écrits pour empêcher (incident du 14/08, lot resté non ingéré et trouvé par hasard). | Étendre l'exemption de la ligne 137 à `README.md` (et, tant qu'on y est, à toute notice de dossier générée : la liste des noms exemptés est une donnée, pas une constante en dur — loi transverse n°4). Ajouter une fixture rouge à la recette : un dossier portant sa notice générée doit sortir PASS, un vrai lot sans sidecar doit sortir FAIL. |

## Confirmations positives

- Le canal de remontée a tenu de bout en bout, sans intervention : dépôt de la paire `.md` + `.tf.jsonl` dans `input\00-retours\`, `node todo\ingerer-lot.mjs` → 4 candidatures frappées `TF-0439` à `TF-0442` en statut `candidat`, `oracle-todo` rejoué PASS, vue `TODO.md` régénérée. Le préflight anti-collision (TF-0394) et l'idempotence par empreinte ont fonctionné.
- **B1 et B2 ont fait exactement leur travail** : ils ont confirmé qu'aucun sidecar ne restait non ingéré et qu'aucun sidecar n'avait été édité après son ingestion. C'est la partie utile de l'oracle, et elle est aujourd'hui noyée par les deux faux rouges ci-dessus.

## Ordre recommandé

1. **RA-5** — un mot dans une condition, et un gate transverse redevient lisible. Meilleur rapport gain/effort de tout ce qui a été remonté aujourd'hui.
