# Retours forges — digit-ai-marketing — 20261112h

- **Contexte** : autre — fin de la revue L99 en mode boucle du prompt de publication LinkedIn des clips de la Factory (demande humaine du 12/11/2026) ; une rectification, deux retours au skill prompt-analyzer-l99 et un retour sur la collision de deux lots du même nom. Ce lot a d'abord été écrit sous l'indice g, déjà pris par une session parallèle (ledger seq 742).
- **Références ledger** : `forge\ledger.jsonl` seq 738 (rectification), 739, 740 et 743 (entrées `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 4 passes de boucle, 8 relecteurs aveugles et 3 vérificateurs de clôture ; 2 chemins mesurés au-delà du plafond de R-4. Ce lot remonte 4 retours, tirés de 4 entrées du ledger, au pilot et à 1 forge.

---

## Pilot (`digit-ai-factory`)

La rectification RP-215 était elle-même imprécise sur la portée par défaut de l'allocateur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-216 | mineur | générique | **Rectification de RP-215 : la portée par défaut d'`allouer-indice.mjs` diffère entre le module et la ligne de commande.** Faits : le module déclare `porte = "prefixe"` (ligne 66), la ligne de commande `porte ?? "dossier"` (ligne 141). RP-215 disait « la valeur par défaut est prefixe » sans distinguer ; un relecteur aveugle l'a relevé, la session l'a recompté. (ledger seq 738) | Lire RP-214, RP-215 et RP-216 ensemble : seul l'appel en module, sans option, rend un indice que R-4 refuse. Aligner le défaut du module sur celui de la ligne de commande. Classe : `allocateur-aveugle-a-la-regle-qu-il-sert`, proposée au lot 20261112e. |
| RP-217 | majeur | générique | **Deux sessions du même produit écrivent un lot sous le même nom, et la seconde écrase la première, chez le produit et au sas.** Faits : le 12/11/2026, « 20261112f » écrit à 14:13:05 et à 14:13:07 par deux sessions ; puis « 20261112g » écrit à 14:13 par l'une (RA-230) et à 14:25 par cette session, qui l'a écrasé avant ingestion (`grep -c RA-230 todo/TODO.jsonl` : 0). `oracle-lot-retours` rend PASS sur le lot qui écrase : R-49 vérifie que le nom n'a jamais été ingéré, pas qu'un lot de même nom attend au sas. Réparé par reconstruction depuis le ledger. (ledger seq 743) | `oracle-lot-retours --remettre` refuse de copier un lot dont le nom existe déjà au sas avec un autre contenu ; l'indice du lot s'alloue par lecture de `forge/retours/` et du sas juste avant l'écriture, en écriture exclusive. Classe à créer : `lot-de-retours-ecrase-par-une-session-parallele`. |

## prompt-analyzer-l99 (`digit-ai-forge-agents`)

Le skill prescrit un nom trop long et ne dit pas comment noter une passe à 2 relecteurs.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-26 | majeur | générique | **Le nom prescrit pour l'analyse dépasse le plafond de chemin de R-4.** Faits : « `<Projet> - Revue - Prompt <objet> passé au crible L99 - AAAAMMJJ<indice>.md` » (SKILL.md, point 9) a donné un chemin de 149 caractères, et 158 pour le journal `.boucle.json` ; R-4 FAIL, plafond de 150 avec 34 de sidecar, soit 116 de chemin relatif (`oracle-conformite-projet.mjs`, ligne 529). Renommé en 104 et 113 caractères. (ledger seq 739) | Le point 9 et `couches.md` rappellent le plafond de 116 caractères et les 7 du suffixe `.boucle.json` ; l'objet tient en 4 mots, « passé au crible » devient facultatif. Classe : `chemin-de-livrable-au-dela-du-plafond-de-la-plateforme`. |
| RA-27 | majeur | générique | **Le mode boucle lance 2 relecteurs par passe sans règle pour agréger leurs notes, et cette règle décide de l'arrêt.** Faits : `boucle.md` prescrit 2 relecteurs pour un prompt de run (ligne 103), le journal ne porte qu'un `score_mesure`. Le 12/11/2026, notes 74 et 76, puis 83 et 74 : à la moyenne arrondie vers le bas, 75 puis 78, la boucle continue ; à la note la plus basse, 74 puis 74, elle s'arrête pour gain insuffisant. (ledger seq 740) | `boucle.md` fixe la règle d'agrégation à l'arbitre, avant la passe 1 ; `oracle-boucle-l99.mjs` exige `scores_relecteurs` et vérifie que `score_mesure` en découle. Classe à créer : `score-de-passe-a-plusieurs-juges-non-defini`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-216 | `grep '"TF-1450"' todo/TODO.jsonl` | 3 | TF-1450, corrigé : option `porte` ajoutée, défauts différents selon l'appel |
| RP-217 | `grep -i -E "sessions? (parallèle\|concurrent)" todo/TODO.jsonl \| grep -i -E "lot\|indice\|RETOURS"` | 2 | voisins : TF-0873 (lots déposés dans un mauvais dépôt), TF-1367 (seq du ledger écrites deux fois) ; aucun ne refuse l'écrasement d'un lot |
| RA-26 | `grep -i "crible L99" todo/TODO.jsonl \| grep -i -c -E "plafond\|caract"` | 0 | aucun |
| RA-27 | `grep -i "boucle" todo/TODO.jsonl \| grep -i -c -E "deux relecteurs\|2 relecteurs\|agrég"` | 7 | voisins, sans la règle d'agrégation : TF-2237 (bruit des relecteurs sous le gain minimal), TF-2240 (jurys différents d'une passe à l'autre), TF-2063 (régression jugée sur le score, pas sur les défauts : ici, la passe 3 a fermé 6 majeurs et a été rejetée) |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les vérificateurs de clôture ont trouvé 5 défauts créés par les corrections avant toute relecture aveugle, dont 1 bloquant.
- `oracle-boucle-l99.mjs` a refusé un journal dont les champs de vérification n'étaient pas des nombres : la forme est tenue.

## Ordre recommandé

1. RP-217, parce qu'un retour écrasé est perdu sans bruit.
2. RA-27, parce que la règle d'agrégation change le prompt livré.
3. RA-26.
4. RP-216.

## La règle qui aurait évité le retour

RA-26 : R-4 existe, le skill ne la rappelle pas au point où il prescrit le nom. RA-27 : aucune règle ne fixe l'agrégation ; la colonne « Proposition esquissée » propose la classe `score-de-passe-a-plusieurs-juges-non-defini`.
