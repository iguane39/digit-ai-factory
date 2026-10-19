# Retours forges — Produit-84 — 20261016c

- **Contexte** : autre — prompt de cadrage passé au crible puis exécuté : cadrage des deux scénarios d'architecture cible
- **Références ledger** : `forge\ledger.jsonl` seq 6, 7, 9 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 16/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre interrogé le 16/10/2026 : `grep -i -E "readme-dossiers" todo/TODO.jsonl | grep -i -E "bash|barre|antislash|oblique|racine"`, puis `grep -i "EC-10" todo/TODO.jsonl` et `grep -i -E "hook-lexique.*(collé|colle|prompt)" todo/TODO.jsonl` : lignes trouvées lues en entier.

Items recoupés : TF-1201 (readme-dossiers lancé sans `--base` écrit chez le pilot) et TF-1785 (EC-10 rend SKIP sur des gabarits sans lecteur). Aucun ne couvre ces trois retours : RT-4, RT-5 et RT-6 entrent comme neufs.

## digit-ai-factory (pilot)

Trois frictions d'un même tour : un hook prescrit la mauvaise route, un oracle refuse le remède d'un prompt, une commande prescrite ne tourne pas dans le shell de la session.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-4 | mineur | générique | Message humain du 16/10 : « Améliore ce prompt : » suivi d'un prompt de cadrage collé. `hook-lexique` (UserPromptSubmit) a injecté la route forge-audit (TF-1735). La formule figure littéralement aux déclencheurs de `prompt-analyzer-l99` (RV-6). Le mot qui a déclenché l'audit est probablement dans le texte collé (conformité, gouvernance, sécurité), pas dans la demande. Ledger seq 6 | Juger la route sur le texte de l'humain, hors bloc collé, et faire primer un déclencheur littéral de skill. Classe : `skill-non-invoque-lexique` |
| RT-5 | mineur | générique | Prompt `Produit-84 - Prompt - Cadrage des scenarios d'architecture cible - 20261016b.md`, lecteur déclaré « la session Claude Code ouverte dans C:\dev\_Client-A\Produit-84 ». EC-10 FAIL sur 2 blocs bash : « lecteur déclaré n'exécute pas ». Le lecteur est un agent qui exécute. Contournement : commandes passées en spans dans la prose. Ledger seq 7 | Reconnaître une session ou un agent comme lecteur qui exécute. Classe : `oracle-faux-positif` |
| RT-6 | mineur | générique | Le relevé d'ouverture prescrit `node "C:\dev\digit-ai-factory\scripts\readme-dossiers.mjs" --base . --racines <dossier écrit, ex. output\03-Syntheses>`. Jouée par l'outil Bash avec `--racines output\04-cadrages` : exit 2, « output04-cadrages\ : racine absente ». Bash avale la barre oblique inverse. Avec `--racines "output/04-cadrages"` : README régénéré. Ledger seq 9 | Écrire les chemins des commandes prescrites avec des barres obliques, que Node accepte sous Windows comme sous Bash. Classe : `point-entree-declare-rouge-sur-toute-cible` |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le prompt du produit (version d) recopiait la commande des README avec une barre oblique inverse | Exécutée avec une barre oblique ; le prompt n'est pas réécrit, il a servi | oui, par RT-6 | La cause est la forme prescrite par le pilot |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

`allouer-indice.mjs` appelé par sa fonction, comme le prompt le prescrivait, a rendu l'indice `a` sur un dossier neuf. `oracle-ecriture` a rendu PASS sur un cadrage de 5 273 mots sans faux positif.

## Ordre recommandé

1. RT-6 : un changement de texte dans le relevé d'ouverture.
2. RT-5 : un changement de règle dans EC-10.
3. RT-4 : un changement de garde dans `hook-lexique`.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-4** : RV-6 existe, mais `hook-lexique` ne l'applique pas avant sa propre route. Classe : `skill-non-invoque-lexique`.
- **RT-5** : aucune règle ne déclare qu'un agent est un lecteur qui exécute. Classe : `oracle-faux-positif`.
- **RT-6** : aucune règle ne demande qu'une commande prescrite soit jouable dans le shell de la session. Classe : `point-entree-declare-rouge-sur-toute-cible`.
