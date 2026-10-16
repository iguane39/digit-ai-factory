# Retours forges — COMPTA - Ventilation de facture Fournisseur-A — 20260814b

- **Contexte** : hors run — inspection de l'instance de production (Easy Auth absente,
  login en impasse constaté par l'humain le 14/08 juste après la clôture du run
  `20260814-tests-Fournisseur-A`) + décision d'outillage : tests Azure authentifiés par session
  capturée (« voie 2 », storage state Playwright sur le compte de l'opérateur).
- **Références ledger** : hors run — preuves en ligne (relevés HTTP du 14/08, fichiers cités).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-08-14

Séquence d'ids : suite du lot `20260814a` (RT-1..RT-5) → RT-6..RT-8 ; première cible pilot → RP-1.

## forge-tests (`digit-ai-forge-tests`)

L'instance de production du produit vit derrière Easy Auth Entra ID (MFA + accès
conditionnel). Le pan `qualif` ne peut pas l'auditer, et le défaut de production le plus
grave du produit (chaîne de login en impasse) était structurellement hors de sa portée.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-6 | majeur | Le pan `qualif` ne sait s'authentifier que par mire formulaire (`FORGE_TESTS_QUALIF_LOGIN/_PASSWORD`, routes `/login`\|`/connexion`). Toute instance derrière un IdP d'entreprise (ici Easy Auth Entra : redirections `login.microsoftonline.com`, MFA, accès conditionnel) est inauditable — or c'est là que vivent les défauts de frontière. Le produit vient de choisir ses tests Azure par **session capturée** (storage state Playwright, cookie `AppServiceAuthSession`) : exactement l'artefact que la forge ne sait pas consommer. | Accepter une session fournie : `FORGE_TESTS_QUALIF_STORAGE_STATE=<storageState.json>` (chargé dans le contexte Playwright) et/ou `FORGE_TESTS_QUALIF_BEARER` (en-tête ajouté aux requêtes) ; provenance de session publiée au rapport |
| RT-7 | majeur | Le pan `qualif` parcourt l'instance **authentifié**, mais ne vérifie jamais le **parcours d'entrée non authentifié**. Payé en production : `GET /` → 303 `/.auth/login/aad` → **404 JSON FastAPI** (Easy Auth jamais activée) — login mort depuis le premier déploiement, jamais détecté par aucun test (le smoke pipeline ne regarde que `/health`, public), découvert par l'humain en cliquant. Relevés HTTP reproduits le 14/08. | Jouer AUSSI le parcours sans session : suivre la chaîne de redirections depuis la racine et exiger qu'elle aboutisse à une **mire identifiable** (200 + marqueur de contenu) — sinon finding « chaîne d'authentification en impasse » |
| RT-8 | mineur | Rapport cycle 2 du run `20260814-tests-Fournisseur-A` : les variables de `.env.example` non revendiquées (33) sont publiées en `non_testables` par **chacun** des 12 pans → 12 actions `mep-config` quasi identiques de 33 variables chacune, qui noient l'onglet Actions du dashboard. Mécanisme conforme au contrat (« champ partagé »), mais la présentation duplique. | Agréger les non-testables *présumés partagés* en **une** action `mep-config` unique, en conservant le détail par pan au rapport |

## pilot (`digit-ai-forge-pilot`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RP-1 | majeur | La situation « tester et corriger » (routage ACCUEIL, ETAPES-RUN §5) n'inclut **aucun regard sur l'instance déployée** d'un produit déjà en production : le run `20260814-tests-Fournisseur-A` s'est conclu « boucle close, pans mesurables au vert » pendant que le login de production était en impasse totale. Le défaut a été découvert par l'humain, hors protocole, minutes après la clôture. L'oracle MEP (M-1..M-5) couvre ce regard à la MEP — rien ne le couvre en cycle de tests post-déploiement. | Pour tout produit dont une URL de prod/staging est déclarée : ajouter à l'étape tests un pas « **smoke de frontière déployée** » sans identité (santé, chaîne de redirections d'auth aboutissant à une mire, en-têtes de sécurité, `/docs` fermé), consigné au ledger — outillable par forge-ops (O-x) ou forge-tests |

## Confirmations positives

- La classe de défaut « dépendance aux endpoints plateforme `/.auth/*` » attrapée en local
  par le pan `qualif` (RT du lot précédent : `/logout`) s'est révélée **prédictive** : le
  miroir exact existait en production côté login. Le contre-oracle vaut des deux côtés de la
  frontière — argument de plus pour RT-7/RP-1.

## Ordre recommandé

1. **RP-1** — un pas de protocole, aurait détecté à lui seul l'impasse de prod pendant le run.
2. **RT-7** — le contrôle générique correspondant côté forge (utile hors pilot aussi).
3. **RT-6** — condition d'accès aux environnements réels protégés (classe entière d'instances).
4. **RT-8** — confort de lecture du dashboard.
