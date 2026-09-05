---
destinataire: humain
---

# Synthèse de mandat — troisième chantier pilot clos : un contrôle qui déclare ses codes doit aussi savoir échouer (05/09/2026)

Le troisième chantier de votre tri est clos et publié. Un contrôle pouvait déclarer ses codes de sortie dans son en-tête sans posséder aucun chemin d'échec, et l'oracle qui juge les contrôles le tenait pour conforme : il lisait la déclaration, pas l'existence. Une règle nouvelle lit désormais la source et refuse tout contrôle sans sortie non nulle écrite. Ce qui change pour vous : un contrôle qui ne sait que réussir ou planter est nommé, chez le pilot comme chez les produits qui héritent de l'oracle. Ce qui est attendu de vous : rien ce tour, le chantier suivant est déjà clos dans la même publication.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-6 (a), chantier 3 sur 5 : instruction et clôture de TF-0795 (CI3 rend vert des contrôles qui déclarent leurs codes sans posséder aucun chemin d'échec).
- **sur quoi** — le pilot `digit-ai-factory` (oracle des contrôles injoignables, sa recette, registre) ; le produit 02 lu en lecture seule pour mesurer.
- **quand** — fin le **05/09/2026 à 09:50 (UTC+02:00)**, chantier mené dans la foulée du précédent (≈ 20 minutes).
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `0526e1e` après publication, base `b6b08f7` avant.

## 2. Verdict en une ligne

TF-0795 **corrigé** : règle CI5 (chaque contrôle possède un chemin d'échec explicite) livrée avec recette 19 → 22 (0 FAIL), pilot 44/44 contrôles PASS, produit 02 : les deux contrôles nommés par le lot désormais refusés, banc 92/93 (défaut préexistant), porte de publication PASS, commit `0526e1e` poussé.

## 3. Décisions attendues

Rien n'attend de décision ce tour : la règle est bornée à la présence d'une sortie non nulle, et la limite (conditionnalité non jugée) est déclarée plutôt qu'arbitrée.

## 4. Traité — avec sa preuve

- **Le défaut mesuré avant d'y toucher** : deux contrôles du produit 02 déclarent leurs codes de sortie dans leur en-tête et n'ont aucun `sys.exit` ; l'oracle des contrôles injoignables rendait PASS sur ce dépôt, sa règle CI3 (chaque contrôle déclare ses codes de sortie) ne lisant que la déclaration.
  - preuve : lecture du code de CI3 (motif sur l'en-tête, jamais sur la source) ; oracle sur le produit 02 avant : CI3 PASS, aucune règle sur l'existence.
- **Règle CI5 livrée** — classe : une règle qui lit une promesse, jamais son tenu ; contrôle rouge → vert : recette 19 → 22 cas. Chaque contrôle (six extensions) possède une sortie non nulle écrite dans sa source ; les commentaires sont retirés avant la mesure ; la conditionnalité et l'atteignabilité du chemin sont déclarées non jugées (c'est CI4 (chaque contrôle est exercé par une recette) et la recette double sens qui les tiennent).
  - preuve : `oracles\oracle-controles-injoignables.test.mjs` 22 PASS, 0 FAIL — déclaré sans sortie → CI3 tient, CI5 FAIL et nomme ; sortie sous condition en Python comme en Node → PASS ; sortie en commentaire ne compte pas, `process.exitCode` compte.
- **Le gain constaté** : le pilot passe CI5 sur ses 44 contrôles ; le produit 02 est refusé sur exactement les deux contrôles que le lot nommait.
  - preuve : oracle sur le pilot : « CI5 PASS, 44 contrôles » ; sur le produit 02 : « CI5 FAIL, 2 contrôle(s) sur 23 SANS chemin d'échec : build/stats/check-ecarts.py, build/stats/check-ht-ttc.py ».
- **TF-0795 clos avec sa descente** — classe : une règle qui lit une promesse, jamais son tenu ; contrôle rouge → vert : CI5 absent → CI5 PASS 44/44 sur le pilot, recette 19 → 22 cas. L'événement de clôture porte corrections, gains, version corrigée, produits bénéficiaires et la règle retenue.
  - preuve : événement de clôture journalisé (verdict PASS) ; vues régénérées (13 ouverts, 8 fermés).
- **Publication** en avance rapide, porte de publication verte.
  - preuve : `oracle-nom-client-publie` PASS sur un clone à branche unique ; `git push` → `b6b08f7..0526e1e main -> main` ; banc `oracles\self-tests.mjs` 92/93, cliquet 19 → 22 consigné.

## 5. Non traité — avec son motif

- **Les deux contrôles du produit 02 sans chemin d'échec** : *chez le produit* — leur donner une sortie non nulle sous condition et une recette double sens est un geste du produit ; le pilot n'y écrit pas.
- **La conditionnalité du chemin d'échec** : *impossible à prouver ici* — un `exit(1)` inconditionnel passe CI5 ; déclaré non jugé, tenu par CI4 et la recette du contrôle.
- **Le remède de l'oracle des skills** (règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture)) : *hors mandat* — non sélectionné ; seul défaut du banc, préexistant.

## 6. Écarts à la lettre

- Le lot proposait « CI3 vérifie qu'au moins une sortie non-zéro conditionnelle existe, ou déclare cette limite » → j'ai créé une règle séparée, CI5, qui juge l'existence d'une sortie non nulle et déclare ne pas juger la conditionnalité → parce qu'une déclaration tenue (CI3) et un chemin absent (CI5) sont deux défauts distincts, et qu'un contrôle qui les confond rend un seul FAIL pour deux causes.
- Rien ne demandait de jouer l'oracle sur le pilot lui-même → il l'a été → parce qu'une règle neuve qui rougirait le dépôt qui la porte doit se savoir avant la publication ; 44/44.

## 7. Risques

- **Un faux négatif** : un contrôle qui sort par `throw` ou par un lanceur qui convertit une exception en code non nul passe pour « sans chemin d'échec ».
  - signal : CI5 FAIL sur un contrôle dont la recette double sens est pourtant verte.
  - parade : ajouter une sortie non nulle écrite est une ligne ; la règle nomme le fichier.
- **Un faux positif de forme** : `exit(1)` inconditionnel passe la règle.
  - signal : un contrôle toujours rouge que CI5 tient pour conforme.
  - parade : déclaré non jugé ; CI4 exige qu'une recette exerce le contrôle.

## 8. Prochaines actions

Ordre de traitement : d'abord les chantiers restants de votre tri, parce que la décision 6a les couvre ; puis le geste produit, parce qu'il ferme un défaut nommé ; les gestes humains inchangés ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-12 | TF-0801, TF-0802 | Instruire les deux chantiers pilot suivants : clé de versions malformée sans rectification, page 404 en standard d'office — une synthèse par chantier clos. | `auto_ia` | `borne_atteinte` — une synthèse par chantier clos (D-6 a) : ce chantier s'arrête à sa restitution, les suivants portent la leur dans la même publication. | Deux défauts mesurés restent ouverts. |
| A-16 | TF-0795 | Depuis le produit 02, donner à `build/stats/check-ecarts.py` et `build/stats/check-ht-ttc.py` une sortie non nulle sous condition et une recette double sens, puis rejouer `node <PILOT_ROOT>\oracles\oracle-controles-injoignables.mjs .` jusqu'à CI5 PASS. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (mandat du 23/08) ; trace mesurée : CI5 FAIL nommant les deux fichiers. | Deux contrôles continuent de rassurer sans juger, et le produit reste rouge à chaque passage de l'oracle. |
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, non sélectionné. | La garde d'ouverture annonce « poste non prêt » ; banc à 92/93. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste, avant tout travail : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements récents. |
| A-7 | `neuve` (reprise de la synthèse 20260903d) | Décider du sort des trois restes de la racine du parc : la seconde copie du pilot, le fichier « null » (à lire avant suppression), le lien brisé. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session. |

## 9. Traces

- Publication : commit `0526e1e` sur `main`, poussé (`b6b08f7..0526e1e`), 26 fichiers (les trois chantiers ensemble).
- Code : `oracles\oracle-controles-injoignables.mjs` (règle CI5, non jugé déclaré) · `oracles\oracle-controles-injoignables.test.mjs` (3 cas) · `oracles\baseline-recettes.json` (cliquet 19 → 22).
- Registre : `todo\TODO.jsonl` — événement « corrigé » TF-0795 ; vues `todo\TODO.md`, `todo\AVANCEMENT.md`.
- Mesures : oracle sur le pilot (CI5 PASS, 44 contrôles) · oracle sur le produit 02 (CI5 FAIL, deux contrôles nommés).
- Oracles rejoués : `oracle-nom-client-publie` (PASS) · `oracles\self-tests.mjs` (92/93) · `todo\oracle-todo.mjs` (PASS).
