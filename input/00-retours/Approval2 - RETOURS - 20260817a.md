# Retours forges — Approval2 — 20260817a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : production d'un livrable à la demande humaine — rapport HTML de comparaison
  du périmètre livré d'Approval2 avec le cahier des charges V1.4 (17/08). Hors run forge.
- **Références ledger** : `forge\ledger.jsonl` seq 30, 31 (entrées `type: retour`), encadrées par l'étape `conception` seq 29 → 32
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-17

**Numérotation** : Approval2 tient UNE séquence `RG-nn` dans son ledger (RG-01 … RG-06 déjà
consommés par le lot design du 11/08). Ce lot continue en RG-07 / RG-08 : aucun id réutilisé.
Le préfixe par forge du gabarit n'est pas appliqué pour ne pas ouvrir une seconde séquence
concurrente sur le même produit — à renuméroter à l'ingestion si le pilot le préfère, les ids
TF étant frappés à ce moment-là.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-forge-pilot`) — auto-retour sur la doctrine des livrables

La production du rapport a révélé qu'aucune règle n'interdit de publier un livrable de produit
sur un service d'hébergement externe, et que ce chemin de publication produit mécaniquement un
fichier local non conforme à `references\BEST-PRACTICES-HTML.md`. Les deux constats ont la même
origine mais n'appellent pas le même travail : l'un est une règle de doctrine, l'autre un
garde-fou outillé. Ils sont donc séparés.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-07 | bloquant | **Un livrable de produit a été publié sur un service externe, avant toute validation humaine.** Le rapport d'écarts a été rendu à la fois comme fichier local et comme page hébergée hors du poste (URL `claude.ai/code/artifact/7d535fbf-f5b0-4004-8ca8-c0e8d9a456a8`, publiée le 17/08). Or ce livrable cite des chemins de code, deux écarts de sécurité exploitables en l'état (antivirus `fake` et `/docs` ouverts en cible Azure faute de variables Terraform) et des extraits de configuration. Aucune règle du socle ne l'interdit : `REGLES-PROJET.md` et `ETAPES-RUN.md` cadrent l'emplacement des livrables sur le poste (G-1 : hors racine auditée) mais sont muets sur la publication externe, et `BEST-PRACTICES-HTML.md` normalise la FORME du HTML livré sans jamais statuer sur son CANAL. La publication a donc été faite sans enfreindre aucune règle écrite — c'est exactement le défaut. | Poser la règle au niveau du noyau et de `gabarits\CLAUDE-PRODUIT.md` : **aucun livrable (rapport, note de synthèse, kit, dashboard, maquette) ne passe par un outil de publication hébergée**. Un livrable est un fichier autoportant sur disque, à l'emplacement du produit. Corollaire à écrire aussi : ce qui a déjà été publié doit pouvoir être retiré, et le retrait n'est pas outillé aujourd'hui. |
| RG-08 | majeur | **Le fichier HTML produit pour une publication hébergée n'est pas autoportant** : l'hôte fournit `<!doctype>`, `<html>`, `<head>` et `<body>` à la publication, si bien que le fichier écrit sur disque n'en a aucun. Constaté sur pièces avant correction : ni `<!doctype html>`, ni `<html lang="fr">`, ni `<meta charset>`, ni `<meta name="viewport">`. Trois règles violées d'un coup — **A1** (« Tout livrable reste auto-portant »), **A3** (« `charset` puis `viewport` en tête de `<head>`, `<html lang="fr">` ; charset dans les 1024 premiers octets »), **A4** (`<title>` porteur de marque + scope + version + date : le titre valait `Écarts Approval V1`, sans marque ni indice de version). Conséquence mesurable sur un rapport rédigé en français : sans déclaration d'encodage, l'affichage dépend de la devinette du navigateur, et le document est truffé d'accents. **R-30/G1 était également en défaut** : le thème sombre était câblé sur `prefers-color-scheme`, précisément le mécanisme retiré le 13/08 (TF-0158) et dont la contradiction a été levée par RV-9 le 14/08 — clair par défaut STRICT ; aucune bascule, aucune persistance, aucun bloc d'impression claire. Corrigé après coup sur le livrable Approval2, mais le défaut est dans le chemin de production, pas dans ce fichier. | Mécaniser plutôt que documenter : un oracle `oracle-livrable-html.mjs` (ou l'extension de `check_html.py`) qui refuse un HTML livré si `doctype`, `html lang`, `charset` dans les 1024 premiers octets, `viewport`, titre au motif A4, favicon `data:` ou bascule R-30 manquent, et si une seule `src`/`href` sort en réseau. Self-test à double sens, comme les fixtures témoin R-30. Un contrôle exécuté vaut mieux qu'une règle relue. |

## Confirmations positives

- **`BEST-PRACTICES-HTML.md` a fait son travail de référence** : les règles A1–A4 et le pattern
  canonique S-G1 étaient assez précis pour corriger le livrable sans arbitrage — y compris le
  détail qui compte (charset dans les 1024 premiers octets, clair par défaut strict, impression
  toujours claire, `.theme-toggle` masqué à l'impression). Le correctif a été appliqué en
  recopiant les snippets, sans réinvention.
- **La trace de l'amendement TF-0158 / RV-9 a évité de reproduire le défaut** : le commentaire
  du snippet explique *pourquoi* `prefers-color-scheme` a été retiré. Sans cette phrase, le
  pattern initial aurait été jugé correct. À conserver tel quel : c'est le contre-exemple utile
  d'une règle qui se documente elle-même.
- **La convention de nommage des livrables du produit a tenu** : `Nhood - APR - <objet> -
  AAAAMMJJ<lettre>.html` dans `audit\output\00 - Rapport d'audit\`, cohérente avec les livrables
  du 07/07 déjà présents.

## Ordre recommandé

1. **RG-07** — meilleur rapport gain/effort : c'est une règle à écrire, pas du code, et elle
   ferme un chemin de fuite de données de produit. À traiter avant RG-08, dont elle réduit la
   portée (moins de livrables produits par ce chemin).
2. **RG-08** — l'oracle a un coût réel mais il est le seul à rendre la règle A1/A3/A4/R-30
   opposable sur tout livrable, et pas seulement sur ceux qu'un relecteur ouvre.
