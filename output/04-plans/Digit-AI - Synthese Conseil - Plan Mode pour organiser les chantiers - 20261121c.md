---
destinataire: humain
---

# Synthèse Conseil — étude d'opportunité du Plan Mode pour organiser les chantiers, 21/11/2026

## 0. Synthèse d'ouverture

L'étude est faite et jugée conforme. Le Plan Mode apporterait ce qui manque aujourd'hui : un verrou, tenu par l'outil lui-même, qui empêche toute modification avant votre accord sur le plan, et un accord unique qui pourrait remplacer les validations étape par étape. Il n'a jamais servi sur ce poste. Deux obstacles sont à lever d'abord : le contrôle de fin de tour refuserait les tours de planification, et les campagnes sans interface ne peuvent pas faire approuver un plan. La recommandation est un essai mesuré de 2 semaines chez un produit volontaire, greffé sur votre décision ouverte D-222. Rien n'est construit tant que vous n'avez pas choisi.

Livré : [Étude — Plan Mode pour organiser les chantiers](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Plan%20Mode%20pour%20organiser%20les%20chantiers%20-%2020261121b.md)

## 1. En-tête d'identification

- **Quoi** : étude d'opportunité sur le Plan Mode de Claude Code, action A-1 de la réponse précédente, au gabarit du pilot pour ces études.
- **Sur quoi** : le pilot digit-ai-factory, les forges et les transcriptions de ce poste.
- **Quand** : 21/11/2026, de 10:56 à 11:07, heures relevées par `date`.
- **Qui** : Claude Opus 5.5, session du pilot au commit 626b12e2, avec 1 agent de lecture web.
- **Intention** : « Étudier ce que le Plan Mode apporterait avant un run de construction ou une campagne », action choisie par « A1 ».
- **Test rétro** : l'étude dit ce qu'il apporterait (un verrou natif et un accord unique), ce qui s'y oppose (2 obstacles mesurés) et comment le vérifier (essai à seuils). Elle sert l'intention.

## 2. Verdict

- Oracle des études d'opportunité : PASS sur les règles E1 à E10, code de sortie 0.
- Oracle d'écriture : code de sortie 0.
- Contrôle de lisibilité à l'écriture : 1 constat (chapitre 2 sans phrase d'ouverture), corrigé, puis repassé sans refus.
- Option retenue par l'étude : O3 (un essai borné et mesuré).

## 3. Décisions attendues

Aucune décision nouvelle : les 3 suites de l'étude sont des actions du bloc 8, et la seule qui touche un produit dépend de D-222, déjà posée. Rappel des 3 décisions ouvertes :
- D-221 : rouvrir l'exclusion « Pas de vidéo » pour publier les clips sur LinkedIn, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée. L'étude y ajoute un fait : l'approbation du Plan Mode est l'accord unique que cette décision cherche.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.

## 4. Traité

- **Usage mesuré : nul.** Sur 439 sessions de ce poste relevées du 09/08 au 21/11/2026, aucune n'a utilisé le mode plan : 332 en mode par défaut, 87 sans demande de permission, 20 en `dontAsk`. On trouve 0 appel aux outils d'entrée ou de sortie du mode et 0 fichier de plan (preuve : comptage par `rg` sur `~/.claude/projects`, joué dans ce tour).
- **État de l'art** : 6 sources lues le 21/11/2026, dont 2 pages officielles d'Anthropic. Les écarts entre sources sont notés (l'étendue du verrou, le nombre de choix à l'approbation).
- **Obstacle lu dans le code** : le contrôle de fin de tour ne met à part que le dossier temporaire (`oracles/hook-restitution.mjs` lignes 231-234). Un plan écrit dans `~/.claude/plans/` compterait donc comme une écriture.
- **Recouvrements** : 8 objets de la Factory examinés, chacun avec sa citation. Aucun ne tient le verrou d'écriture.
- **Options** : 5 options du jeu fermé, de O0 (ne rien faire) à O4 (un verrou maison). Ne rien faire est réfuté par 2 coûts mesurés : 14 validations de simple passage sur 49 chez un produit, et le dépassement de périmètre du 22/06/2026.

Relecture d'intention : sert.

## 5. Non traité

- **Candidatures non inscrites au registre** : l'étude les propose, et la discipline de périmètre arrête le tour au livrable.
- **Correction du contrôle de fin de tour et banc du verrou** : non construits, pour le même motif.
- **Page HTML de l'étude** : non produite. Les études du pilot sont livrées en Markdown, et la page autoportante est exigée pour les runs de conseil remis à un client.
- **Lots de retours en attente** (43 au sas d'arrivée, 2 en boîte d'entrée depuis plus de 24 h, signalés bloquants à l'ouverture) : non traités, hors de la demande.
- **Enregistrement git de l'étude** : non fait, il demande votre accord.

## 7. Risques

- **Le verrou peut ne pas tenir dans ce harnais.** La page officielle exclut du verrou les sessions de terminal où le contournement des permissions est disponible. Signal : une écriture acceptée en mode plan pendant le banc. Parade : le banc (action A-2) passe avant tout essai.
- **Le réglage qui range les plans dans le projet n'est décrit que par des sources tierces.** Signal : un plan qui reste dans `~/.claude/plans/` malgré le réglage. Parade : le vérifier dans le même banc, sans en dépendre avant.

## 8. Prochaines actions

Ordre : A-1 et A-2 d'abord, parce qu'elles lèvent les obstacles de l'essai A-3 ; A-4 et A-5 sont indépendantes.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Faire accepter par le contrôle de fin de tour un tour qui n'écrit qu'un fichier de plan | neuve | auto_ia | hors_mandat : la demande était une étude | `oracles/hook-restitution.mjs` | Si rien n'est fait : chaque tour de planification est refusé ou doit rendre une restitution complète |
| A-2 | Vérifier par un banc que le mode plan bloque bien les écritures ici, et où il range le plan | neuve | auto_ia | hors_mandat : la demande était une étude | `claude --permission-mode plan` | Si rien n'est fait : l'essai repose sur un verrou non vérifié |
| A-3 | Essayer 2 semaines chez un produit volontaire les runs de construction ouverts en mode plan | neuve | manuelle_utilisateur | decision : se greffe sur D-222 (b), et le choix du produit volontaire vous revient | répondre « 222b », puis nommer le produit ; détail : `output/03-etudes/Digit-AI - Étude - Plan Mode pour organiser les chantiers - 20261121b.md`, section 5 | Si rien n'est fait : la question reste sans chiffres, et les validations de simple passage continuent |
| A-4 | Faire entrer au registre les lots de retours en attente | neuve | auto_ia | hors_mandat : hors de la demande | `node todo/accueillir-lot.mjs`, puis `node todo/ingerer-lot.mjs <fiche du lot>` (le fichier d'accompagnement que l'accueil produit) | Si rien n'est fait : des producteurs croient leur travail remonté et personne ne le traite |
| A-5 | Enregistrer dans git l'étude et cette synthèse | neuve | auto_ia | garde_fou : un commit demande votre accord explicite | `git commit --only -- <étude> <synthèse> output/03-etudes/README.md output/04-plans/README.md` | Si rien n'est fait : l'étude n'existe que sur ce poste |

## 9. Traces

- L'étude : `output/03-etudes/Digit-AI - Étude - Plan Mode pour organiser les chantiers - 20261121b.md`.
- Cette synthèse : `output/04-plans/Digit-AI - Synthese Conseil - Plan Mode pour organiser les chantiers - 20261121c.md`.
- Le gabarit et son oracle : `gabarits/ETUDE-OPPORTUNITE.md`, `oracles/oracle-etude-opportunite.mjs`.
- Le contexte de D-222 : `output/04-plans/Digit-AI - Synthese Mandat - Retours et TODOs du 16-11 - 20261116a.md` lignes 50-62.
- Index régénéré par `node scripts/readme-dossiers.mjs` (code de sortie 0).
