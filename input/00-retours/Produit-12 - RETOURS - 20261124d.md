# Retours forges — Produit-12 — 20261124d

- **Contexte** : run de version 0.9.3 (décision D-241), oracle de mise en production rejoué le 24/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 499 (entrée `type: retour`, destinataire pilot)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Le contrôle de santé d'une image sur un poste Windows a écrit sa base hors du volume prévu, sans aucun message d'erreur. La cause est la conversion automatique des chemins par Git Bash. Le défaut aurait faussé le contrôle de retour arrière, qui rejoue la version précédente sur la même base. Il a été repéré au contrôle de propreté, puis la commande a été rejouée.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-59 | mineur | générique | Sous Git Bash, `docker run -e ASDMM_DB=/data/asdmm.db` est réécrit en `C:/Program Files/Git/data/asdmm.db` par la conversion de chemins MSYS. La base du banc M-2 s'est écrite dans le système de fichiers du conteneur, hors du volume `/data`. Le contrôle M-4 aurait rejoué la version précédente sur une base vide. Repéré au M-5 par un dossier « C: » sous `/app`, rejoué avec `MSYS_NO_PATHCONV=1`. Preuve : ledger seq 497 et 499 ; `forge/DOSSIER-MEP.md` section 23 | Le gabarit des contrôles M-2 à M-5 préfixe `docker run` et `docker exec` par `MSYS_NO_PATHCONV=1`, et le M-5 vérifie que la base vit sous le point de montage du volume |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'exécutable `uvicorn` du projet est refusé par la stratégie de contrôle des applications du poste | lancement par `uv run python -m uvicorn` | non | propre au poste, noté dans la mémoire du projet |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Le garde `rm-variable` du poste a refusé `rm -rf "$D"` avant exécution ; la commande a été réécrite sans variable dans la cible, rien n'a été effacé, et le garde a joué son rôle prévu.

## Confirmations positives

Le contrôle M-5 de propreté de l'image a révélé le défaut du M-2 : un contrôle de propreté qui liste `/app` attrape aussi les écritures égarées.

## Ordre recommandé

RS-59 seul sur ce lot.

## La règle qui aurait évité le retour

Une commande d'un gabarit qui passe un chemin POSIX à un outil Windows depuis Git Bash désactive la conversion de chemins. Classe proposée : `chemin-posix-converti-par-git-bash` (famille `heritage-produit`), « Un chemin POSIX passé à un outil Windows depuis Git Bash est réécrit en chemin Windows ».
