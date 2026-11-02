---
destinataire: humain
---

# Synthèse Mandat — vos 6 réponses construites et publiées, 1 geste vous revient (02/11/2026)

## Guide — Remplacer la consigne page HTML sur vos 2 comptes Claude

Source officielle : article d'Anthropic « Using Skills in Claude », https://support.claude.com/en/articles/12512180-using-skills-in-claude, lu le 02/11/2026. Faites ces 3 étapes sur chacun de vos 2 comptes Claude, avec le même fichier : [paquet de la consigne, version 1.42.0](output/06-travaux-confies/Digit-AI%20-%20Skill%20-%20digit-ai-page-html%201.42.0%20pour%20le%20compte%20Claude%20-%2020261102a.zip).

1. Ouvrez la consigne sur claude.ai.
   - Ouvrez Customize, puis Skills.
   - Cliquez sur `digit-ai-page-html`.
   - Résultat attendu : la fiche de la consigne s'affiche et sa description cite Roboto et DM Sans.
2. Supprimez l'ancienne copie.
   - Désactivez la consigne avec son interrupteur.
   - Ouvrez le menu « ... », puis cliquez sur « Delete ».
   - Confirmez par « Delete ».
   - Résultat attendu : `digit-ai-page-html` a disparu de la liste.
3. Envoyez la nouvelle version.
   - Cliquez sur « + ».
   - Cliquez sur « + Create skill ».
   - Cliquez sur « Upload a skill ».
   - Choisissez le fichier du paquet.
   - Résultat attendu : `digit-ai-page-html` revient dans la liste et sa description cite Montserrat et Inter.

## 0. Synthèse d'ouverture

Vos 6 réponses sont en service, sauf la 117 : elle attend le remplacement ci-dessus, que je ne peux pas faire depuis le poste. Désormais, un comparatif de coûts sans périmètre et un texte chargé de phrases longues déclenchent un avertissement, sans rien bloquer. Une consigne qui nomme une règle sans son texte déclenche une alerte, et un gain de durée se remesure en service. Les écrits à un tiers portent la ligne demandée. J'ai aussi corrigé un chiffre faux que j'avais écrit au registre.

Livré : [Paquet de la consigne page HTML, version 1.42.0](output/06-travaux-confies/Digit-AI%20-%20Skill%20-%20digit-ai-page-html%201.42.0%20pour%20le%20compte%20Claude%20-%2020261102a.zip)

## 1. En-tête d'identification

Exécution de votre réponse « 114a, 115a, 116b, 117a, 118a, 119b » du 02/11/2026, sur le pilot `digit-ai-factory` et forge-agents. Période : 02/11/2026 de 10:55 à 11:25, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 1 relecteur d'intention.

Intention de la demande : que chaque option retenue soit réellement en place, et non seulement notée.

Test rétro : le résultat sert cette intention pour 5 décisions sur 6. La 117 est préparée et vérifiée, et son dernier geste vous revient.

## 2. Verdict

5 décisions construites et closes sur 6, 1 en attente de votre geste ; recettes rejouées en fin de tour, toutes vertes ; `oracle-todo` PASS après chaque écriture.

## 3. Décisions attendues

Aucune décision n'est attendue.

## 4. Traité

Le code a été construit d'abord, puis le registre écrit, puis les chiffres annoncés recontrôlés : ce contrôle a trouvé l'erreur décrite plus bas.

- **D-114 (a), comparatifs de coûts** (TF-1971) : nouvelle règle EC-17 d'`oracle-ecriture`, qui avertit sur une ligne opposant 2 montants dans un texte sans rubrique « Compris, non compris, conséquence ». La rubrique entre dans 2 gabarits et dans le skill de proposition (forge-agents 560c6ac). Rejouée sur les 1 209 Markdown suivis : 5 accusés.
- **D-115 (a), phrases longues** (TF-2025) : EC-2 avertit dès 15 phrases de plus de 35 mots, même non consécutives. Self-test 91/91.
- **D-116 (b), règle nommée sans son texte** (TF-1972) : `scripts/relecture-intention.mjs` affiche l'alerte en tête de la consigne préparée. Recette 78/78 ; sur le script d'avant, 77 PASS et 1 FAIL, le cas rouge.
- **D-117 (a), copie du compte** (TF-1991) : paquet de 49 fichiers prêt, 927 302 octets, description de 994 caractères. Voies automatiques rejouées : https://api.anthropic.com/v1/skills rend HTTP 401, https://claude.ai/api/skills rend HTTP 403, `ANTHROPIC_API_KEY` est absente, `sync-skills.mjs` ne vise pas le compte (0 mention), et la session ne touche qu'une copie locale écrasée à la synchronisation. Le poste porte 2 comptes, chacun avec sa copie en 1.1.0 du 20/07/2026 : le geste vaut pour les 2.
- **D-118 (a), sentinelle de remesure** (TF-1954) : `todo/remesurer.mjs`, relevé d'ouverture et règle R18 d'`oracle-todo`. Recette 20/20, relevé d'ouverture 50/50, self-test du registre 64/64. Première sentinelle posée sur TF-1955.
- **D-119 (b), questions à un tiers** (TF-1983) : la ligne entre dans 5 gabarits, sans contrôle, comme décidé. `oracle-gabarits-documents` PASS.
- **Correction de ma part** (TF-1971) : j'avais écrit au registre 813 Markdown suivis et 4 accusés, présentés comme de vrais comparatifs, sans sortie pour le prouver. La mesure rejouée donne 1 209 et 5, et au moins 3 des 5 comparent des tarifs de modèle, où la rubrique a peu d'objet. Le registre est corrigé. Classe du défaut : un gain écrit au registre sans sortie à l'appui, qu'aucun contrôle ne garde ; `oracle-todo` a rendu PASS. Elle entre en candidat sous TF-2056.
- **Registre** : 2 classes créées (`cout-perimetre-non-declare`, `conception-sur-resume-sans-texte-de-regle`), référentiel en version 1.56.0.
- **Publication** : le pilot sous son GO permanent (D-54 (b) du 03/10), forge-agents sous le sien (D-53 (b) du 03/10).

Relecture d'intention : sert, gravité mineure, 3 écarts, verdict consigné sous RI-20261102-08.

## 5. Non traité

- Le remplacement de la copie sur vos 2 comptes — motif : `acces`, l'API rend 401 et aucune voie du poste n'écrit sur le compte.
- Les 21 candidats du registre restent à instruire, dont TF-2056 ouvert à l'instant — motif : `hors_mandat`, votre réponse visait les 6 décisions.
- Deux montants placés dans 2 cellules d'un tableau échappent à EC-17 — motif : `hors_mandat`, l'option retenue vise une ligne de texte et rien de plus n'a été mesuré.

## 6. Écarts à la lettre

- Vous avez demandé une ligne dans les gabarits (D-119 (b)) → j'ai ajouté un intitulé et le rappel de l'incident du 26/10 → le rédacteur doit comprendre pourquoi la ligne existe.
- Vous avez demandé une rubrique et un avertissement (D-114 (a)) → j'ai ajouté la règle E-18 à `references/ECRITURE.md` → un contrôle d'écriture cite sa règle dans ce référentiel.

## 7. Risques

- **Aucune remesure n'a encore tourné en service** : la recette prouve le mécanisme, pas son usage réel.
  - Signal : ligne de TF-1955 dans `todo/observabilite/remesures.jsonl` à partir du 05/11.
  - Parade : si elle manque après le 05/11, le relevé d'ouverture est à reprendre.
- **La copie vieillira de nouveau** : le dépôt a sorti 10 versions de cette consigne en 12 jours, et le compte n'a aucune mise à jour automatique.
  - Signal : l'écart entre `updatedAt` du manifeste et la version du dépôt.
  - Parade : aucune construite, conséquence acceptée en retenant (a) plutôt que (c).
- **Lien de cause non prouvé** : l'ancienne copie est l'explication la plus directe du brief du 22/10, sans preuve.
  - Signal : un nouveau brief aux anciennes polices après le remplacement.
  - Parade : chercher alors une autre source.

## 8. Prochaines actions

Ordre : le geste d'abord, car lui seul ferme la décision 117.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Remplacer la consigne page HTML sur vos 2 comptes, pour que les sessions hors dépôt lisent les bonnes polices | TF-1991 | manuelle_utilisateur | `acces` : API de la plateforme https://api.anthropic.com/v1/skills HTTP 401 et https://claude.ai/api/skills HTTP 403 ; identité de la session sans clé ; aucune identité de service ; script du dépôt `sync-skills.mjs` 0 mention du compte | suivre le guide en tête de ce message | si rien n'est fait, un brief écrit hors du dépôt peut reprendre Roboto et DM Sans |
| A-2 | Instruire et corriger les 21 candidats du registre, sauf ce qui vous revient | TF-2041 | auto_ia | `hors_mandat` : 21 candidats, dont TF-2041 à TF-2047 et TF-2056 | instruire et traiter ces candidats par R-58 | si rien n'est fait, ces défauts remontés par les produits continuent de leur coûter des allers-retours |

## 9. Traces

- Pilot : commits ce18790d, bc69c28e, c4a3ad62 et 7257edfe. Forge-agents : 560c6ac.
- Registre : `todo/TODO.jsonl`, `todo/CLASSES.json`.
- Clôture de TF-1991 : `updatedAt` postérieur au 02/11/2026 dans les 2 fichiers `manifest.json` sous `~/.claude/skills/synced/`, et `SKILL.md` en 1.42.0.
