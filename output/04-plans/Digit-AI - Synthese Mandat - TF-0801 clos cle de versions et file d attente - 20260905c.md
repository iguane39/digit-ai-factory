---
destinataire: humain
---

# Synthèse de mandat — quatrième chantier pilot clos : une clé de versions malformée a une voie de rectification, et la file de tickets porte son vrai nom (05/09/2026)

Le quatrième chantier de votre tri est clos et publié. Le contrôle des versions consignées à l'ouverture d'un run refusait le vrai nom du dépôt de file de tickets comme un « nom court », et une clé malformée n'avait aucune voie de sortie : le produit avait réécrit son journal, geste que la doctrine interdit, faute de mieux. Désormais le nom de la file est une exception nommée, une clé malformée se rectifie par ajout comme un champ absent, et le message d'échec dit la voie. Ce qui change pour vous : plus aucun échec définitif sur ce contrôle. Ce qui est attendu de vous : une décision de confort sur le nom du dépôt de file, sans urgence.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-6 (a), chantier 4 sur 5 : instruction et clôture de TF-0801 (R-19 sans voie de rectification pour une clé malformée, et le dépôt de file d'attente innommable sous son vrai nom).
- **sur quoi** — le pilot `digit-ai-factory` (oracle de conformité, sa recette, contrat d'interface, registre).
- **quand** — fin le **05/09/2026 à 09:50 (UTC+02:00)**, chantier mené dans la foulée du précédent (≈ 15 minutes).
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `0526e1e` après publication, base `b6b08f7` avant.

## 2. Verdict en une ligne

TF-0801 **corrigé** : R-19 accepte `digit-ai-queue` et consomme la rectification d'une clé malformée (recette 49 → 52, 0 FAIL), contrat §3 amendé, banc 92/93 (défaut préexistant), porte de publication PASS, commit `0526e1e` poussé.

## 3. Décisions attendues

> **D-7 — Garde-t-on le dépôt de file de tickets sous son nom réel, admis comme exception nommée, ou le renomme-t-on pour rentrer dans le motif des forges ?**
> Le dépôt de file de tickets est déclaré au parc par le script d'amorçage sous son nom réel, qui ne suit pas le motif des treize forges ; le contrôle des versions refusait donc ce nom à l'ouverture d'un run. Le lot proposait deux issues : une exception nommée dans le contrôle, ou un renommage du dépôt consigné à la table de correspondance. L'exception est faite et publiée ; elle rend le renommage facultatif.
> **Recommandation : (a).** Source consultée : `bootstrap.mjs` (le dépôt y est déclaré sous son nom réel, avec sa preuve d'existence) et `CONTRAT-INTERFACE.md` § 3 (le pilot y était déjà « seule exception nommée » ; la file devient la seconde).
> Ce dépôt n'est pas une forge : lui donner un nom de forge ferait mentir le motif plutôt que l'honorer, et un renommage touche tous les clones et les tables du parc.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** garder le nom réel, exception nommée au contrat et au contrôle (fait) | rien de plus | exclut l'uniformité du motif ; deux exceptions nommées au lieu d'une |
| **(b)** renommer le dépôt en `digit-ai-forge-queue`, table de correspondance et amorçage à jour, exception retirée | moyen × court : renommage GitHub, clones, amorçage, table, une recette | exclut de dire par le nom que ce dépôt n'est pas une forge |
| **(c)** ne rien décider | gratuit | rien : l'exception tient |

> **Si rien n'est décidé** : (a) s'applique de fait — l'exception est en place et publiée.

## 4. Traité — avec sa preuve

- **Le défaut mesuré avant d'y toucher** : à la clôture d'un run de version du produit 02, l'ouverture consignait la clé `digit-ai-queue` (nom réel du dépôt) → échec R-19 ; la rectification déposée par ajout restait sans effet, la boucle des clés n'ayant aucune échappatoire ; la clé a été réécrite faute de voie.
  - preuve : lecture du code de R-19 (la rectification n'était lue que pour le champ absent, TF-0709 ; le motif des clés n'admettait que le pilot et les forges).
- **Exception nommée** : le nom réel de la file de tickets est accepté par le contrôle et déclaré au contrat comme seconde exception, avec sa raison (ce n'est pas une forge).
  - preuve : `oracles\self-test.mjs` — « la clé digit-ai-queue est acceptée telle quelle » PASS.
- **Rectification d'une clé malformée** — classe : un contrôle dont la sœur immédiate sait pardonner et qui ne pardonne pas ; contrôle rouge → vert : recette 49 → 52 cas. Le même événement de rectification par ajout (seq visé, cause écrite) couvre une clé malformée ; le verdict l'imprime « [RECTIFIÉ] » avec la clé et la cause ; le message d'échec dit désormais la voie par ajout.
  - preuve : `oracles\self-test.mjs` 52 PASS, 0 FAIL — clé malformée couverte → PASS imprimé ; sans rectification → FAIL et le message nomme `rectification_versions_forges`.
- **Le contrat d'interface amendé (§3)** : seconde exception nommée, et rectification par ajout des clés malformées.
  - preuve : `CONTRAT-INTERFACE.md` § 3, clause datée TF-0801 ; sidecars de verdict régénérés.
- **TF-0801 clos avec sa descente** — classe : un contrôle dont la sœur immédiate sait pardonner et qui ne pardonne pas ; contrôle rouge → vert : R-19 FAIL définitif sur la clé réelle → PASS, recette 49 → 52 cas. L'événement de clôture porte corrections, gains, version corrigée, produits bénéficiaires et la règle retenue.
  - preuve : événement de clôture journalisé (verdict PASS) ; vues régénérées (13 ouverts, 8 fermés).
- **Publication** en avance rapide, porte de publication verte.
  - preuve : `oracle-nom-client-publie` PASS sur un clone à branche unique ; `git push` → `b6b08f7..0526e1e main -> main` ; banc `oracles\self-tests.mjs` 92/93, cliquet 49 → 52 consigné.

## 5. Non traité — avec son motif

- **Le journal du produit 02 dont la clé a été réécrite** : *chez le produit* — l'histoire ne se réécrit pas, mais ce qui l'a été ne se défait pas ici ; une entrée de rectification déclarant la réécriture est un geste du produit.
- **Le renommage du dépôt de file** : *dépendance à une décision humaine* — D-7.
- **Le remède de l'oracle des skills** (règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture)) : *hors mandat* — non sélectionné ; seul défaut du banc, préexistant.

## 6. Écarts à la lettre

- Le lot demandait de « trancher le nom du dépôt » → l'exception nommée a été faite sans attendre, et le renommage vous est soumis → parce que l'exception est réversible et débloque immédiatement, tandis qu'un renommage touche tout le parc.
- Rien ne demandait de reformuler le message d'échec d'une clé malformée → il dit désormais la voie par ajout → parce qu'un message qui ne dit pas la voie pousse à la réécriture, le geste même que le produit a payé.

## 7. Risques

- **Une rectification de complaisance** : nommer un seq et une cause de vingt caractères suffit à couvrir une clé malformée.
  - signal : des rectifications répétées sur des run_open récents, après la doctrine.
  - parade : la cause est imprimée à chaque verdict ; la clé malformée reste visible dans l'entrée d'origine.
- **Une troisième exception** demandée demain par un autre dépôt hors motif.
  - signal : un FAIL R-19 sur une clé qui est pourtant un nom réel déclaré à l'amorçage.
  - parade : la liste des exceptions est au contrat, avec la raison de chacune ; une troisième se décide, elle ne se glisse pas.

## 8. Prochaines actions

Ordre de traitement : d'abord le dernier chantier de votre tri, parce que la décision 6a le couvre ; puis la décision de ce message, sans urgence ; les gestes humains inchangés ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-12 | TF-0802 | Instruire le dernier chantier pilot : la page 404 en standard d'office — sa synthèse suit dans la même publication. | `auto_ia` | `borne_atteinte` — une synthèse par chantier clos (D-6 a). | Le standard reste sans lieu de doctrine ni de jugement. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file, mettre à jour l'amorçage, la table de correspondance et le contrat, retirer l'exception, rejouer la recette. | `auto_ia` | `dependance_bloc_3` — D-7. | Rien : l'exception tient. |
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, non sélectionné. | La garde d'ouverture annonce « poste non prêt » ; banc à 92/93. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste, avant tout travail : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements récents. |
| A-7 | `neuve` (reprise de la synthèse 20260903d) | Décider du sort des trois restes de la racine du parc : la seconde copie du pilot, le fichier « null » (à lire avant suppression), le lien brisé. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session. |

## 9. Traces

- Publication : commit `0526e1e` sur `main`, poussé (`b6b08f7..0526e1e`).
- Code et doctrine : `oracles\oracle-conformite-projet.mjs` (R-19 : exception nommée, rectification des clés malformées, message avec la voie) · `oracles\self-test.mjs` (3 cas TF-0801) · `CONTRAT-INTERFACE.md` § 3 (clause TF-0801) · `oracles\baseline-recettes.json` (cliquet 49 → 52).
- Registre : `todo\TODO.jsonl` — événement « corrigé » TF-0801 ; vues `todo\TODO.md`, `todo\AVANCEMENT.md`.
- Oracles rejoués : `oracle-nom-client-publie` (PASS) · `oracles\self-test.mjs` (52/52) · `oracles\self-tests.mjs` (92/93) · `todo\oracle-todo.mjs` (PASS).
