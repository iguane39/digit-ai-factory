# Retours forges — Produit-81 — 20261113b

- **Contexte** : gestes d'exploitation sur la base de qualification, hors run ouvert (relevé de version, création du compte SQL temporaire ADF_TMP).
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 33, 34 ;` (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-22 (mineur) — Hook restitution : une lecture `git tag --sort` comptée comme écriture

**Le fait.** Le 13/11/2026, une question en lecture seule (la version en qualification) a été refusée par le hook de fin de tour. Le hook a classé `git tag --sort=-creatordate | head`, une simple liste des tags, comme une « commande à effet git tag ». Il a aussi compté comme écriture un `curl -o` vers le dossier temporaire. Le tour n'avait rien écrit dans le dépôt, mais la réponse courte prévue par NIVEAUX.md a été refusée et a dû être réécrite en restitution complète.

**Le coût, prouvé.** Un tour de réécriture pour une question de lecture.

**La règle qui aurait évité le retour.** Ne compter `git tag` comme effet que s'il porte un nom de tag sans option de liste (`-l`, `--list`, `--sort`, `--contains`, `-n`). Exclure les écritures sous le dossier temporaire de session. **Clé proposée** (RT-22) : `restitution-lecture-comptee-ecriture`, famille `restitution-forme`, libellé « Une commande de lecture est classée comme écriture par le hook de fin de tour ».

**Juge proposé.** Un jeu de cas du classifieur du hook : `git tag --sort` est une lecture ; `git tag v1` est un effet ; `curl -o` vers le dossier temporaire est hors dépôt.

## RT-19 (mineur) — `ranger-secret` refuse hors run, alors que `reserver-decision` écrit au journal hors run

**Le fait.** Le 13/11/2026, `ranger-secret` a refusé de ranger le mot de passe du compte SQL ADF_TMP, parce que `forge/ledger.jsonl` n'existe pas tant qu'aucun run n'est ouvert. `reserver-decision` écrit pourtant au journal hors run (TF-2223). Le secret a donc été écrit à la main dans `.env`, sans entrée `secret_range`. Un second refus, justifié celui-là, a montré que `.gitignore` ne portait pas `.env`.

**Le coût, prouvé.** Le secret n'a pas d'empreinte consignée, et il a fallu le ranger par un contournement manuel.

**La règle qui aurait évité le retour.** Quand le ledger du run est absent, `ranger-secret` consigne `secret_range` dans `forge/hors-run.jsonl`, comme le fait `reserver-decision`. **Clé proposée** (RT-19) : `secret-non-range-hors-run`, famille `secret-hors-perimetre`, libellé « Le geste de rangement d'un secret échoue hors run faute de ledger ».

**Juge proposé.** Un test de `ranger-secret` sans ledger : sortie attendue en exit 0, avec une entrée dans le journal hors run.

## Rattachement

Registre interrogé le 13/11/2026 : `todo/CLASSES.json` du pilot. Les clés `secret-*` relevées (`secret-hors-perimetre`, `secret-sans-canal-entre-sessions`…) ne couvrent pas le cas hors run. Aucune clé `restitution-*` ne couvre le classement d'une lecture comme écriture. D'où deux clés neuves en `classe-a-creer`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Note de réception du pilot (16/11/2026)

RT-18 était déjà défini par le lot 20261113a du même produit : ce retour est renuméroté RT-22, premier numéro libre après les lots déjà ingérés (RT-21).
