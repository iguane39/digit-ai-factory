---
destinataire: humain
---

# Synthèse Conseil — bases de développement et de qualification dans les forges, prompt 20261029a exécuté (29/10/2026)

## 0. Synthèse d'ouverture

Non : aucune forge ne couvre aujourd'hui l'un des trois scénarios. Une copie anonymisée de la production n'existe nulle part, et forge-tests l'a même écartée par décision de cadrage. Un jeu synthétique existe chez forge-tests, mais en fichier JSON pour ses cahiers, jamais chargé dans une base. La remise à zéro d'une base hors production n'existe pas. 2 produits ont écrit leur propre outil d'anonymisation, hors de toute forge. Les 4 manques sont au registre en propositions (TF-2011 à TF-2014), à décider à la revue hebdomadaire ; le premier suppose que vous tranchiez la doctrine de forge-tests.

## 1. En-tête d'identification

Exécution du prompt `output\04-plans\Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md`, sur votre « exécute le prompt » du 29/10/2026. Run de conseil sur le pilot `digit-ai-factory` (commit 9d9bde7c). Période : 29/10/2026 de 09:34 à 09:43, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, aucun agent.

Intention de la demande : savoir si un produit qui a une base de données trouve dans les forges de quoi alimenter et remettre à zéro ses bases de développement et de qualification, sans faire sortir de donnée personnelle de la production.

Test rétro : le résultat sert cette intention. L'étude répond scénario par scénario avec la preuve de chaque cellule, et chaque manque est au registre avec sa forge pressentie.

## 2. Verdict en une ligne

0 scénario couvert sur 3 : S1 absent, S2 partiel, S3 absent ; 14 dépôts et 23 produits relevés en lecture seule ; 4 propositions inscrites, `oracle-todo` PASS.

## 3. Décisions attendues

Rien n'attend de décision dans ce tour. Les 4 propositions entrent en `candidat` et vous reviendront à la revue hebdomadaire. TF-2011 y portera une question de doctrine : forge-tests refuse toute donnée issue de la production, l'ADR0506 de forge-audit admet un jeu « représentatif mais non sensible ».

## 4. Traité

- **Étape 0** : `node bootstrap.mjs --pull` à 09:34, aucun retard sur origin pour les 14 dépôts. Le poste était « NON prêt » pour 5 worktrees d'agents non ignorés ; tous étaient propres et déjà fusionnés dans `main`. Remède appliqué : `.claude/worktrees/` ajouté au `.gitignore` du pilot, sans rien supprimer.
- **Réponse par scénario** (détail et preuves dans l'étude) :
  - S1, copie anonymisée : absente ; forge-data documente des exports `--data-only` sans masquage, et la décision (c) de forge-tests, ligne 513 de son CDC, dit « synthétiques uniquement » ;
  - S2, jeu synthétique : partiel ; `jeux.py` de forge-tests est jugé mais n'écrit qu'un JSON, la capacité 4 « fabrique de données » de son contrat d'adaptateur est déclarée et non écrite, le seed `MODE_DEMO` du pilot n'est qu'un gabarit ;
  - S3, remise à zéro : absente ; forge-tests rejoue les migrations sur base neuve pour un audit seulement, `ops.mjs restaurer` ne restaure que des fichiers.
- **Matrice scénario × forge** : 14 lignes, 6 portent une trouvaille. Mesuré sur : pilot et 13 forges à leur commit du jour, relue à 09:40, périmètre 14 dépôts.
- **Produits** : 23 produits instanciés relevés sans écriture ; 5 portent un outil pertinent. Produit-01 a un script de synthèse et de pseudonymisation déterministe, né d'une remédiation « REM-ADR0620 » qui n'a jamais existé dans forge-audit. Produit-77 a un extracteur anonymisé qui garde la structure d'un classeur réel.
- **Propositions au registre**, par `journaliser.mjs` (essai puis écriture, `oracle-todo` PASS avant et après) :
  - TF-2011, S1 : masquage par profil-moteur, après décision de doctrine (forge-data, forge-tests) ;
  - TF-2012, S2 : fabrique de données chargée en base depuis le schéma (forge-tests, forge-data) ;
  - TF-2013, S3 : verbe de remise à zéro hors production, refusé sur la production (forge-ops, forge-tests) ;
  - TF-2014 : contrôle d'audit sur la donnée personnelle hors production (forge-audit).
- **Contrôles joués** :
  - `oracle-ecriture` sur l'étude : exit 1 (titre qui annonce, 2 nombres en lettres), puis exit 0 après correction ;
  - jeu d'essai du protocole : 5 cellules rouvertes à leur ligne, 5 conformes ;
  - cas limite tenu : le seed `MODE_DEMO` sort au niveau gabarit, S2 reste « partiel » ;
  - contrôle négatif tenu : S1 n'est pas « couvert » sur la foi d'un export ;
  - données réelles : `git grep -P` des motifs du contrat sur l'étude et les 4 lignes du registre, 0 ligne ; aucun nom réel de produit écrit.

Relecture d'intention : sert.

## 5. Non traité

- **Construction des 4 compétences** : hors du périmètre du prompt, motif `hors_perimetre` ; elle suit votre décision à la revue.
- **Trancher la doctrine de S1** : motif `decision_humaine`, portée par TF-2011.
- **Un produit absent de la table des pseudonymes** porte un seed et 5 migrations de référentiel : cité sans nom, motif `hors_perimetre` ; son inscription relève de la table, pas de ce run.

## 7. Risques

- **Doublon de numéros entre postes** : TF-2011 à TF-2014 sont pris sur ce poste et non publiés. Parade : publier avant toute écriture au registre sur l'autre poste.
- **Relevé par mots-clés** : un outil nommé autrement peut avoir échappé. Parade déjà jouée : lecture des 14 fiches de forge, sans trouvaille.

## 8. Prochaines actions

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | neuve | manuelle_utilisateur | publier exige votre GO (R-38) ; le push du matin a été refusé à 09:15 | dire « publie », puis `FORGE_PUSH_GO="<vos mots>" git push origin main` | l'étude et TF-2011 à TF-2014 restent sur ce poste ; l'autre poste peut reprendre les mêmes numéros |
| A-2 | TF-2011 à TF-2014 | manuelle_utilisateur | décider la construction revient au porteur | revue hebdomadaire du registre (`references\TODO-FORGE.md`) | chaque produit continue d'écrire son seed et son anonymisation seul |

## 9. Traces

- Étude : `output\03-etudes\Digit-AI - Étude - Bases de donnees de dev et qualification - 20261029a.md`.
- Prompt exécuté : `output\04-plans\Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md`.
- Registre : `todo\TODO.jsonl`, événements de création TF-2011 à TF-2014.
- Commits des forges lues : forge-tests 1a4925f, forge-data 3c14112, forge-ops 5991a6b, forge-audit ee0c944, forge-conception 5c23ab3, forge-agents 2e2adfb.
