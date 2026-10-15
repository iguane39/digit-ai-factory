# Retours forges — Produit-82 — 20261015a

> **Note de réception du pilot (15/10/2026, R-49)** : la famille proposée pour RT-14, `outillage`, n'existe pas au référentiel des classes ; elle devient `hook-ou-gate`, puisque l'outil en cause est le hook de restitution.

- **Contexte** : consigne humaine de compléter l'application avec les usages attendus de ses personas, brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 65, 66, 68, 69
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-15

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Les deux retours portent sur le gabarit de fiche produit et sur le hook de restitution.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-13 | majeur | générique | Le 14/10/2026, la fiche Produit-82 (gabarit `gd-fiche-produit` 1.0.0) portait 35 exigences, dont 34 tenues et testées. Pourtant aucun de ses 4 personas n'avait son usage servi en entier. Il manquait la connexion par identifiant et mot de passe, le libre-service des clés pour l'administrateur client, une documentation et des erreurs lisibles pour le développeur, et une page pour le DPO. Question humaine du 15/10 : « Pourquoi est-ce que les utilisateurs n'ont pas directement une interface de login / mot de passe ». Consigne : « Complète l'application avec les usages attendus des personas et remonte ce point à la Factory ». Le tour suivant a ajouté 6 exigences et 5 tests de parcours, P-OPE à P-SEC. Ledger seq 66, 68 et 69. **RT-13** : clé proposée `exigences-tenues-sans-parcours-des-personas`. | Au gabarit de fiche produit, chaque persona porte un parcours testable : se connecter, faire son geste principal, voir son résultat. La recette d'un produit joue un test par parcours, et « livré » exige ces tests au vert en plus des exigences. |
| RT-14 | mineur | générique | Le 14/10/2026, `node forge/hooks/factory.mjs restitution --prejuger <fichier>`, lancé avec une entrée standard ouverte, n'a rien rendu en 9 minutes. Relancé avec `</dev/null`, il a rendu en quelques secondes. Le même relevé a trouvé bloqués deux préjugements d'autres produits du poste, depuis 15:13 et 18:58. Ledger seq 65. **RT-14** : clé proposée `outil-bloque-sur-entree-standard-ouverte`. | En mode `--prejuger`, ne pas lire l'entrée standard, ou la lire avec un délai. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche `20261014e` gardait au périmètre « console non exposée publiquement », contraire à ENF-02 et à D-9 (a) | fiche `20261015a`, ligne de périmètre réécrite | non | corrigé au produit |
| Les motifs `pattern` des champs ne compilaient pas sous le mode `v` des navigateurs : la contrainte n'existait pas | tiret échappé dans les motifs HTML, `oracle-saisie` PASS | oui, tout formulaire HTML à motif | corrigé au produit |
| Texte blanc sur l'accent du thème sombre à 1,95:1, bordures de champs sous 3:1, aucun anneau de focus | jetons mesurés, `oracle-tokens` PASS sur les 8 écrans | non | corrigé au produit |
| Sur Railway, plusieurs comptes de console dans une seule variable ont fait refuser tous les comptes (401) : la base développe les variables avant de lire le YAML | bloc YAML littéral à 20 places `UI_HTPASSWD_<n>`, essayé en local (200, 200, 401) avant redéploiement | oui, toute configuration agentgateway à valeur multiligne | corrigé au produit |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Digit-AI - Fiche Produit Produit-82 - Specification - 20261014e.md` | gd-fiche-produit · 1.0.0 | une colonne « parcours testé » par persona | « Pourquoi est-ce que les utilisateurs n'ont pas directement une interface de login / mot de passe » | colonne « Parcours testé » et exigences EF-20 à EF-24, ENF-17, fiche `20261015b` | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les oracles de forge-design ont trouvé 4 défauts réels sur des écrans qui passaient le rendu : contraste du thème sombre, motifs de saisie inopérants, bascule non persistée, espacements hors échelle.

## Ordre recommandé

1. RT-13 : chaque futur produit refera l'aller-retour tant que la fiche ne lie pas un persona à un parcours testé.
2. RT-14 : un hook figé bloque la restitution sans message.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une question humaine. La règle qui l'aurait évité : une fiche produit lie chaque persona à un parcours, et la recette joue ce parcours avant de dire « livré ». Classe proposée : **RT-13** : `exigences-tenues-sans-parcours-des-personas`, famille `gabarit-document`, libellé « Les exigences d'une fiche sont tenues, mais le parcours d'un persona n'est ni construit ni testé ».
