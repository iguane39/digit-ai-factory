---
destinataire: humain
---

# Synthèse Mandat — Skill clip de présentation intégré à la Factory (10/11/2026, 21:16)

## 0. Synthèse d'ouverture

Le savoir-faire des clips vidéo fait désormais partie de la Factory. Tout produit du poste peut produire un clip de présentation avec le skill de forge-design. Ce skill prend le logo, le nom, le lien et les couleurs dans la marque du produit. Un contrôle automatique juge chaque clip : appliqué à un clip réel de la série, il a relevé 29 défauts que rien ne signalait. Les 2 forges sont publiées, et rien n'attend de geste de votre part.

## 1. En-tête d'identification

- Quoi : actions A-1 et A-2 de la décision D-203 (a), le skill de clip de présentation et l'inscription de son oracle.
- Sur quoi : la forge de design, la forge des agents et le pilot.
- Quand : 10/11/2026 21:16, heure relevée par `date`.
- Qui : session pilot, Opus 5.5, avec un agent constructeur pour la construction.
- Intention : votre réponse « A1 puis A2 », qui demande de vérifier, installer et publier le skill, puis d'inscrire son oracle au registre.
- Test rétro : un autre produit peut-il produire et faire juger un clip ? Oui : le skill est installé dans les 2 profils du poste, et l'oracle est routé par le registre des oracles.

## 2. Verdict

A-1 et A-2 faites : 4 commits publiés dans 2 forges, `git rev-list origin/main..main` rend 0 dans chacune. L'oracle de clip rend PASS sur un clip tiré du gabarit et FAIL avec 29 constats sur un clip de la série.

## 3. Décisions attendues

Aucune décision ne vous revient.

## 4. Traité

- Skill `clip-de-presentation` 1.0.0 versé dans forge-design par l'agent, commit `9da1b66` : 3 scripts, 4 références et 2 gabarits. La marque du produit y entre en paramètre, jamais celle de Digit-AI. Preuve rejouée : la recette du skill rend 38 cas verts. Chacun des 6 défauts est vu dans les 2 sens, rouge sur l'ancien code et vert sur le nouveau.
- Oracle de clip, 7 règles, commit `9517ff4`, avec ses fixtures rouge et verte de 45 Ko. Il juge le format du MP4, le storyboard et ses planches, les budgets de texte, les étiquettes de 24 px, les chiffres de décor, la marque et le déterminisme du rendu. Preuves rejouées :
  - PASS, exit 0, sur un clip de 18 s tiré du gabarit ;
  - FAIL, exit 1, sur le clip ingénierie logicielle de la série, avec 29 constats : 22 tailles d'étiquette, 3 chiffres de décor non étiquetés, 3 marques codées en dur, 1 storyboard sans table de preuves.
- Recette de forge-design rejouée : `self-test.mjs` rend « 81 oracles, 190 règles verrouillées », et les 4 autres recettes de la forge sont vertes.
- Conception de forge-design mise à jour, commit `470a814` : la forge porte 5 verbes, et non plus 4.
- Skill installé par `oracle-skills --appliquer` : verdict PASS. Les copies des 2 profils sont identiques à la source. Les 2 dépôts consommateurs rendent PASS avant et après.
- A-2, commit `54c4434` de forge-agents : l'oracle entre au registre en 2.58.0 et quality-oracles passe en 2.28.0, en invocation explicite. Preuve : la recette de quality-oracles rend PASS sur 732 contrôles, dont la commande du registre FAIL sur la rouge et PASS sur la verte. `verifier-accord-registre` rend PASS sur les 2 vues.
- Pilot : TF-2405 clos au registre avec ses preuves et ses gains, et l'inventaire porte le 5e verbe de forge-design. Preuve : `oracle-todo` PASS avant et après l'écriture.
- Relecture d'intention : sert.

## 5. Non traité

- Les 28 clips de la série restent sur l'ancienne bibliothèque. Motif : leur portage est un choix du produit marketing, et les vidéos livrées n'en dépendent pas.
- 3 défauts mineurs relevés par l'agent restent ouverts. La musique plante sous 2,5 s de durée, un chemin de longueur nulle rend une position invalide, et le sous-titre de fin n'a pas de contrôle de largeur. Motif : hors du périmètre de la décision ; ils sont notés au registre en restes de TF-2405.
- Le paquet `dist/clip-de-presentation.skill` n'est pas construit. Motif : l'installation passe par `oracle-skills`, qui n'en a pas besoin.

## 7. Risques

- Énoncé : un clip de la série, repris tel quel avec le nouveau skill, change d'aspect. Il passe en effet de 20 à 24 px et ses couleurs viennent de la marque. Signal : un écart visible entre un clip repris et sa version livrée. Parade : la bible du skill liste les 5 renommages de couleurs à faire, et l'oracle signale chaque étiquette sous 24 px.

## 8. Prochaines actions

Rangées par échéance : la revue datée vient en premier.

| Sélecteur | Action | Identifiant | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Revoir le verdict de l'étude : un second produit s'est-il servi du skill, l'essai HyperFrames a-t-il eu lieu | TF-2405 | auto_ia | dependance_externe : revue datée du 2026-12-10 | `todo/TODO.jsonl` | si rien n'est fait : un skill inutilisé reste au parc sans être retiré |
| A-2 | Opposer HyperFrames au skill de clip sur le même brief, lors de l'essai décidé | TF-1924 | auto_ia | dependance_externe : la prochaine mise en production d'un produit | `output/03-etudes/Digit-AI - Étude - Huit outils de motion design pour la Factory - 20261102t.md` | si rien n'est fait : le moteur se choisit sans point de comparaison |

## 9. Traces

- forge-design : commits `9da1b66`, `9517ff4` et `470a814`, `skills/clip-de-presentation/`, `oracles/oracle-clip.mjs`.
- forge-agents : commit `54c4434`, `.claude/skills/quality-oracles/references/registre-oracles.json`.
- Pilot : `INVENTAIRE.md` ; `todo/TODO.jsonl`, TF-2405 clos et TF-1924 amendé.
- Remontée à la factory : rien à remonter.
