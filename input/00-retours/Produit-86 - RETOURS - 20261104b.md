# Retours forges — Produit-86 — 20261104b

- **Contexte** : connexion refusée du porteur à la préproduction le 04/11/2026, puis consigne « arrête de changer les mdp à chaque fois que tu déploies une nouvelle version. Et remonte cette règle à la Factory. »
- **Références ledger** : `forge\ledger.jsonl` seq 421 (retour sur la connexion refusée), 422 (consigne du porteur), 425 (retour de la règle)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 04/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 04/11/2026 :
- `grep -ciE "comptes? de test.*(mot de passe|mdp)|mot de passe.*(renouvel|déploiement)" todo/TODO.jsonl` → 0 ligne trouvée. RP-10 propose sa classe.
- `grep -ciE "sosie|ambigu.*(caract|mot de passe)|token_urlsafe" todo/TODO.jsonl` → 0 ligne trouvée. RP-11 propose sa classe.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-10 | majeur | générique | **Règle demandée par le porteur le 04/11/2026** : « arrête de changer les mdp à chaque fois que tu déploies une nouvelle version. Et remonte cette règle à la Factory. » La chaîne de déploiement du produit renouvelait les mots de passe des comptes de test à chaque déploiement (exigence E-091 du produit, posée sur le modèle des runs précédents) : 14 déploiements le 04/11, autant de mots de passe à recopier, 2 connexions refusées du porteur. Ledger seq 422 et 425. **RP-10** : clé proposée `identifiants-de-test-renouveles-a-chaque-deploiement`. | règle de la Factory, à porter au gabarit des comptes de test et à l'étape MEP : les identifiants de test remis à l'humain restent stables d'un déploiement à l'autre ; ils ne se renouvellent que sur demande explicite ou quand leur fichier manque ; la chaîne vérifie qu'ils se connectent avant de rendre PASS. |
| RP-11 | majeur | générique | Le porteur n'a pas pu se connecter avec les mots de passe du fichier des comptes de test (2 refus 401, Chrome le 04/11 à 14:59, Firefox à 15:01), alors que les mêmes valeurs passaient par httpx et Playwright : `secrets.token_urlsafe` produisait « _ » et des sosies (1, l). Ledger seq 421. **RP-11** : clé proposée `secret-remis-a-l-humain-difficile-a-recopier`. | au même gabarit : tout secret qu'un humain recopie se tire dans un alphabet sans sosie (0, O, 1, l, I) ni signe, 20 caractères au moins. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le fichier d'une autre session (`forge/avancement.jsonl`) est parti dans un commit par un `git add forge` | retiré de l'index par un commit suivant, fichier intact sur le disque | non | erreur de la session, corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées des 03/11 et 04/11, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261104a) |

## Garde-fou de plateforme relevé

Aucun nouveau garde-fou heurté. GFP-005 (stratégie de contrôle d'application Windows) reste celui des lots précédents.

## Confirmations positives

- La vérification de connexion ajoutée à la chaîne de déploiement a rendu « PASS — 2 comptes de test se connectent » au déploiement de 15:22, mots de passe identiques avant et après (empreinte relue).

## Ordre recommandé

1. RP-10 : c'est une règle demandée explicitement par le porteur.
2. RP-11 : elle a empêché le porteur de se connecter.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours suivent un retour humain (connexion refusée, puis consigne du 04/11). La règle qui les aurait évités : un identifiant remis à l'humain est stable et se recopie sans erreur.

Deux retours n'ont aucune clé du référentiel qui convienne ; chacun propose sa classe :

- **RP-10** : clé proposée `identifiants-de-test-renouveles-a-chaque-deploiement`, famille `contrat-interface-forge`, libellé « Les identifiants de test remis à l'humain changent à chaque déploiement ».
- **RP-11** : clé proposée `secret-remis-a-l-humain-difficile-a-recopier`, famille `affordance-ui`, libellé « Un secret remis à l'humain contient des signes et des sosies qui se recopient mal ».
