# Retours forges — Produit-84 — 20261016b

- **Contexte** : autre — fiches A4 de sécurité refaites en une fiche par langue (français, espagnol) sur demande humaine
- **Références ledger** : `forge\ledger.jsonl` seq 4 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre interrogé le 16/10/2026 : `grep -i -E 'lang=|lang \"fr\"|attribut lang|langue de la page|espagnol' todo/TODO.jsonl | wc -l` → 2 ligne(s) trouvée(s), lues en entier.

Items recoupés : TF-1590 (`check_html.py` L11 prend le mot anglais « None » pour du texte non traduit). Même oracle et même présupposé, une page forcément en français, mais une autre règle : RT-3 entre comme neuf et se rattache à TF-1590 pour le traitement groupé.

## digit-ai-forge-agents (`client-a-page-html`)

Une fiche demandée en espagnol par l'humain est refusée par le contrôle de conformité du socle pour sa seule déclaration de langue.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-3 | mineur | générique | `check_html.py` sur `output\02-fiches\Client-A - Note securite Produit-84 - Acces base ES - 20261016a.html` (`lang="es"`) : FAIL, seul échec « Attribut lang="fr" absent sur <html>. » La même page passée en `lang="fr"` rend PASS. `render_page.py` (7 largeurs), `run-oracles-design.mjs` et l'oracle de format A4 rendent PASS sur la page en `lang="es"`. Déclarer `fr` sur un texte espagnol ferait lire l'espagnol avec une voix française aux lecteurs d'écran (WCAG 3.1.1). En plus de ce faux positif, `check_html.py` plante en console Windows sur le caractère ✗ (`UnicodeEncodeError` cp1252) au moment d'afficher l'échec : il faut `--output json` pour lire le motif. | La règle qui aurait évité le retour : aucune ; la règle « tout livrable en français » du socle ne prévoit pas la langue demandée par le destinataire. Esquisse : exiger un `lang` présent et valide (BCP 47), français par défaut, et une autre langue admise quand elle est déclarée ; écrire la sortie console en UTF-8. Classe : `oracle-faux-positif`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Retour humain : « La fiche n'est pas assez précise sur ce point. On ne comprend pas le début du problème. » La fiche disait « l'inscription est ouverte » sans expliquer comment, alors que l'écran n'a pas de bouton d'inscription | Section 1 refaite : une chaîne en quatre gestes (code source, adresse et clé publique, création du compte auprès de Supabase, connexion), plus la phrase « la clé publique est normale, c'est à la base de filtrer » | non | Rien de généralisable : c'est la justesse d'un contenu propre à ce produit, qu'aucun oracle de forme ne peut juger |
| Retour humain : « crée une fiche A4 par langue, pas un A4 avec les 2 langues » | Deux fiches générées par un même modèle, chacune mesurée à 10 cas sur 10 par l'oracle A4 du lot `20261016a` | non | Préférence de ce destinataire pour ce livrable ; le format bilingue n'est pas une règle du socle |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les fiches partent du boilerplate du skill `client-a-page-html`.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

L'oracle de format A4 remis avec le lot `20261016a` a tenu sur deux nouvelles fiches. Il a départagé les corps de texte : 9,5 pt laissait 1 mm de réserve en espagnol, et 9 pt en laisse 28.

## Ordre recommandé

1. RT-3 : un changement de règle dans `check_html.py`, plus l'encodage UTF-8 de sa sortie.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-3** : aucune règle existante ne prévoit une langue de livrable demandée par le destinataire. Classe : `oracle-faux-positif`.
