# Retours forges — Produit-86 — 20261103b

- **Contexte** : clôture du run 20261103b-evolution-acces-e2e (comptes de test par rôle, parcours de bout en bout par profil), suite du lot 20261103a
- **Références ledger** : `forge\ledger.jsonl` seq 216 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 03/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 03/11/2026 : `grep -iE "perimetre-de-session-confondu" todo/TODO.jsonl` → 1 item (TF-2103, la relecture
d'intention du pilot, remontée par le lot 20261103a, RP-2) ; `grep -ciE "pip-audit" todo/TODO.jsonl` → 0 ligne trouvée.
RT-9 est la même classe que TF-2103, sur un autre outil (l'audit de forge-tests au lieu de la relecture d'intention) : il s'y
rattache, il ne la duplique pas.

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-9 | majeur | générique | Le pan `prompts` inventorie trois modèles (`gpt-6-luna`, `gpt-6.1-sol`, `gpt-6.1-terra`) trouvés dans `outils/compteur-foundry/`, dossier non suivi par git écrit par une autre session sur le même arbre : 7 constats bloquants (modèle non épinglé, jamais exercé, seuil 0/3) attribués au produit, alors qu'aucun fichier suivi ne nomme ces modèles (`git ls-files \| xargs grep gpt-6-luna` : 0). Mesuré le 03/11 à 16:21 puis à 16:45, `rapport-20261103-evolution-acces.json` et sa reprise. Ledger seq 216. | inventorier les sources suivies par git (`git ls-files`) et publier à part les fichiers non suivis rencontrés, sans les compter au produit. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le frontal nginx de la préproduction montait sa configuration sans être recréé quand elle changeait : la redirection ajoutée restait sans effet | empreinte de `nginx.conf` portée par le conteneur dans `infra/staging/main.tf` | non | défaut de ce Terraform, propre au produit |
| Les tests de bout en bout ciblaient une pastille d'état ambiguë (« BROUILLON » de la mission et « brouillon » du mandat) | sélecteurs rattachés à leur section | non | écriture de test du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | 8 versions datées du 03/11, une par audit ou reprise | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit (`--copie-output`, ETAPE-MEP § 4) : sa forme appartient à la forge, pas à un gabarit de la bibliothèque (déjà déclaré au lot 20261103a) |

## Garde-fou de plateforme relevé

Garde-fou déjà au registre, confirmé par ce relevé : **GFP-005** (stratégie de contrôle d'application Windows), relevé le
03/11/2026 sur un troisième outil : `pip-audit` (`Python312\Scripts\pip-audit.exe`) rend « Permission denied » à 16:49 alors
qu'il tournait à 13:24 ; `oracle-sca` rend alors SKIP (« pip-audit absent du poste »), message qui ne dit pas que l'outil est
présent mais bloqué. Les deux premiers outils relevés le même jour sont le traceur C de `coverage` et semgrep.

## Confirmations positives

- RT-3 du lot 20261103a, remis à 14:23, est corrigé dans forge-tests le jour même (TF-2096) : à 16:45, les 10 règles Django sont écartées d'elles-mêmes sur ce produit sans dépendance Django, et les 10 contestations écrites par le produit deviennent sans objet.
- `forge_tests.boucle.verdict` a publié deux fois de suite le signal de non-convergence (tours 6 et 7) au lieu de le taire, alors que la boucle était close.

## Ordre recommandé

1. RT-9 : une seconde session sur le même arbre fait échouer un pan entier de l'audit du produit.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : RT-9 vient d'un audit exécuté pendant le run.

RT-9 se rattache à la clé existante `perimetre-de-session-confondu` (famille `hook-ou-gate`), créée au référentiel le 03/11/2026 pour TF-2103.
