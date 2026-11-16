# Retours forges — Produit-79 — 20261112f

- **Contexte** : demande de l'exploitant du 12/11/2026 : que la reprise sur un autre poste, par GitHub et Google Drive, porte tout ce qu'il faut au projet, `.env` et secrets compris, sans aucun geste
- **Références ledger** : `forge\ledger.jsonl` seq 1219, 1220 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Le 12/11/2026, ce poste n'avait que 2 des 18 variables du `.env` du poste principal ; l'exploitant a dû coller un jeton Railway à la main (ledger seq 1210 et 1212). Le produit a corrigé chez lui ; les deux défauts valent pour tout produit travaillé sur deux postes.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-30 | majeur | produit+générique | Le dossier Drive `dev\Produit-02.fr - Reprise` existe depuis le 11/10/2026, avec une notice à suivre à la main (`REPRISE.md`). Deux `go_publication` le visent au ledger (seq 793 du 24/10, seq 1178 du 12/11). Aucun `forge\REPRISE.json` n'existait avant le 12/11 à 17h : le hook `reprise` câblé par le gabarit restait muet. Au premier passage du juge, `oracle-reprise` rendait RP4 FAIL (1 fichier du canal absent de ce poste). Récidive de la classe close par TF-1736 | Quand un `go_publication` vise un dossier synchronisé et qu'aucun `forge\REPRISE.json` n'existe, l'ouverture le signale et la session écrit le manifeste dans le tour |
| RP-31 | bloquant | produit+générique | Ledger seq 1210 du 12/11/2026 : « RAILWAY_PROJET_TOKEN absent du .env de ce poste (FORGE_ROOT seul) ». Le poste principal porte 18 variables, le coffre Drive une copie du 07/10 à une seule clé vide. `fusionner-env.mjs` (D-208 (a), TF-2440) sait fusionner, mais aucun hook ne le joue ; R-64 point 4 dit encore que le secret « se ressaisit sur chaque poste ». L'exploitant a dû retrouver et coller le jeton | Le socle joue la fusion des `.env` à l'ouverture et en fin de tour, avec un coffre voisin du canal (jamais dans le canal) : décision à trois points sur l'empreinte de la dernière synchro, puis sur la dernière entrée `secret_range` du ledger, puis sur le fichier le plus récent, perdant sauvegardé. Le même geste porte les fichiers d'identifiants dont une variable donne le chemin, et la mémoire Claude du projet. Implémentation de référence : `forge\synchro-poste.mjs` de ce produit (recette 14 cas, mutants tués, juge V1 à V6) |

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 7 178 entrées dont le texte répond à `/(reprise|autre poste|entre postes|multi-poste).{0,120}(secret|\.env)|(secret|\.env).{0,120}(autre poste|entre postes|Drive)/i` → 4 lignes trouvées.

Items recoupés :

- TF-1736 (la reprise d'un produit sur un autre poste reste manuelle même quand un canal est déclaré) : RP-30 en est une récidive chez ce produit.
- TF-2440 (une fusion de `.env` faite sur un poste ne survit pas à la resynchronisation du Drive), 3 lignes : RP-31 en prolonge la correction, qui a livré l'outil sans le câbler à un hook.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `input\Media` (77 Go) et `input\01-Transfert` n'étaient pas ignorés par git, alors que le canal porte le second | motifs ajoutés au `.gitignore` le 12/11 ; RP6 rend PASS | non, la liste des dossiers est propre au produit | reste au produit, parce que la règle RP6 existe déjà et a joué son rôle |
| La notice `REPRISE.md` du Drive demandait 4 recopies à la main | remplacée par les hooks ; la notice reste pour `input\Media` seul | oui | remonté en RP-30 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par `node forge/retours/oracle-lot.mjs --murs .` le 12/11/2026 ; verdicts repris du lot 20261112a :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `fusionner-env.mjs` exporte `analyser`, `fusionner`, `clesPerdues` et `refusGit` : la synchro du produit les réutilise telles quelles, sans réécrire la fusion.
- `oracle-reprise` a rendu RP4 FAIL au premier passage puis PASS après `--restaurer` (193 fichiers égaux) : le juge a mesuré un écart réel.
