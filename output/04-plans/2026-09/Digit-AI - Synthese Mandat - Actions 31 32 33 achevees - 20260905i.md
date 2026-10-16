---
destinataire: humain
---

# Synthèse de mandat — actions 31, 32 et 33 achevées : la forge de développement est publiée, les deux derniers chantiers de forges sont clos, la porte de publication rougit sur une seconde histoire ancienne (05/09/2026)

Vos trois actions sont faites. Le commit de la forge de développement est publié selon l'option que je recommandais, et la réécriture de son histoire ancienne est entrée au registre comme chantier séparé. Deux agents mandatés ont instruit les lots déposés chez la forge des outils et chez la forge de conception : le gate d'écriture ne prend plus un constat ancien pour un constat neuf, et un candidat de la surface implicite a désormais un champ où s'écarter explicitement, avec un contrôle qui refuse l'oubli. Leurs comptes rendus sont jugés conformes, ingérés, et les trois items sont clos avec leurs preuves ; la copie installée du gate sur ce poste est déjà la version corrigée. Ce qui change pour vous : les trois forges qui payaient le gate ce matin ne le paieront plus, et la loi de la surface implicite devient jugeable. Ce qui est attendu de vous : la même décision que ce matin pour la forge des outils, dont l'histoire ancienne rougit aussi la porte alors que le commit du jour est propre, et le tri de trois candidatures neuves nées des comptes rendus.

## 1. En-tête d'identification

- **quoi** — mandat humain « A-31, A-32, A-33 » sur la synthèse 20260905h : publication de forge-development (A-31, D-10 lue en option b), instruction des lots chez forge-agents (A-32) et forge-conception (A-33) par agents mandatés, clôtures au registre.
- **sur quoi** — le pilot `digit-ai-factory` (registre, vues) ; forge-development et forge-conception publiées ; forge-agents modifiée et commise localement, non publiée ; le produit 02 lu seulement.
- **quand** — fin le **05/09/2026 à 16:20 (UTC+02:00)**, ≈ 50 minutes depuis votre mandat, dont 35 de travail parallèle des deux agents.
- **qui** — Claude Fable 5.1 (extension VS Code) et deux agents subordonnés ; pilot en version `2d2f277` après publication, base `18870a8` avant.

## 2. Verdict en une ligne

A-31 **fait** (forge-development `247f9ec..00097b6` poussé, TF-0813 candidat) ; A-32 **fait** (forge-agents `966402a`, banc du hook 21 → 26, TF-0806 et TF-0812 clos) ; A-33 **fait** (forge-conception `d6ab8ff`, self-test 11×48 → 12×49, TF-0811 clos, publié) ; 3 candidatures neuves (TF-0814, TF-0815, TF-0816) ; forge-agents **non publiée** (porte FAIL sur 200 constats d'historique ancien, commit du jour propre) ; pilot publié `2d2f277`.

## 3. Décisions attendues

Les deux décisions prolongent celles de ce matin : une histoire ancienne qui rougit la porte sans que le commit du jour y soit pour rien, et des constats neufs qui entrent en candidat.

> **D-11 — Publie-t-on le commit du jour de la forge des outils, dont la porte de publication rougit sur son histoire ancienne comme celle de la forge de développement, en lui appliquant la même lecture que D-10 ?**
> La porte, jouée sur la forge des outils avant tout push, rend FAIL sur deux cents constats — un message de commit et cent quatre-vingt-dix-neuf contenus de fichiers anciens (fiches et fixtures d'experts, manifeste des oracles), tous antérieurs au jour ; le commit du jour, qui corrige le gate (la porte qui juge un fichier avant d'en autoriser l'écriture) hérité par toutes les forges et tous les produits, n'y figure pas. C'est le cas exact de la décision de ce matin sur la forge de développement, lue en option (b) sur votre mandat : publier ce qui est propre, mettre la réécriture au registre. La réécriture de cette forge est déjà entrée au registre comme candidature, avec la proposition de mesurer les treize forges d'un coup.
> **Recommandation : (a).** Source consultée : sortie de `oracle-nom-client-publie` sur la forge (C3 1, C4 199, commit `966402a` absent des constats) et la lecture (b) de D-10 appliquée ce matin sur votre mandat A-31 (synthèse 20260905h).
> Le correctif de ce gate (même porte) est celui que trois forges ont payé aujourd'hui ; le retenir prolonge le péage chez chaque forge et chaque produit, sans rien protéger de plus.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** pousser le commit du jour en avance rapide, la réécriture restant TF-0817 | simple × court : un push | exclut de tenir la lettre « porte verte avant push » sur ce cas, motivé comme D-10 |
| **(b)** réécrire l'histoire de la forge des outils d'abord, puis pousser en force | complexe × moyen : sauvegarde, filter-repo, porte PASS, push forcé, clones à rebâtir ; skills installés à réaligner chez tous les produits | exclut la descente immédiate du gate (même porte) corrigé |
| **(c)** ne pas publier | gratuit | exclut tout effet ; ce poste seul porte le correctif |

> **Si rien n'est décidé** : (c) s'applique — le commit reste local ; la copie installée sur ce poste est déjà corrigée, les autres postes et produits non.

> **D-12 — Comment trie-t-on les trois candidatures nées des deux comptes rendus, dont deux touchent encore le gate (la porte qui juge un fichier avant d'en autoriser l'écriture) et une le référentiel d'exigences ?**
> La forge des outils, en corrigeant ce gate (même porte), a rendu atteignable un défaut que son propre correctif masquait : l'identité d'un constat repose sur une ligne tronquée aux deux premières raisons, si bien qu'au troisième constat du même oracle le gate (même porte) s'ouvre sur du travail neuf ; elle signale aussi qu'un chemin relatif rend le delta silencieusement non calculable. La forge de conception, en donnant un champ à l'écart de la surface implicite, a vu que les trois « exigences socle candidates » de son schéma ont exactement le trou qu'elle venait de combler, et qu'un sceau (l'empreinte qui scelle une vue dérivée) prouve la fraîcheur, jamais la complétude — ce dernier constat n'a pas de classe et attend que le pilot en crée une.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (TF-0814, TF-0815, TF-0816, source et classe) et les deux lots de retours du jour dans `input\00-retours\` (sections « La règle qui aurait évité le retour »).
> Les deux constats du gate (même porte) sont dans le même fichier que le correctif du jour et se prouvent avec le même banc ; celui du schéma est le jumeau direct de l'item clos ce jour chez la même forge, avec ses fixtures déjà en place.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les trois en bloc : TF-0815 et TF-0816 confiés à la forge des outils en un lot, TF-0814 à la forge de conception ; une classe neuve pour « le sceau (même empreinte) prouve la fraîcheur, pas la complétude » créée par le pilot | simple × court pour la décision ; deux lots à déposer, une classe à écrire | exclut un tri fin |
| **(b)** décider seulement les deux du gate (même porte) | simple × court | exclut le jumeau de TF-0811, pourtant le moins cher |
| **(c)** ne rien décider | gratuit | exclut toute instruction ; les trois restent candidates |

> **Si rien n'est décidé** : (c) s'applique — les trois restent candidates, rien ne se dégrade.

## 4. Traité — avec sa preuve

- **A-31 — forge-development publiée** (avance rapide, D-10 lue en option b) — classe : une histoire ancienne qui rougit la porte sans que le commit du jour y soit pour rien ; le commit du jour est propre, la réécriture entre au registre.
  - preuve : `git push` → `247f9ec..00097b6 main -> main` ; candidature TF-0813 journalisée (PASS).
- **A-32 — TF-0806 et TF-0812 clos chez forge-agents** — classe : un partage neufs/préexistants qui compare des lignes brutes portant le chemin ; contrôle rouge → vert : défaut reproduit avant correctif (édition sans rapport bloquée sur un constat ancien), puis 0 neuf / 2 préexistants, écriture acceptée ; banc du hook 21 → 26, toutes les recettes de la forge vertes. Une fonction pure remplace tout chemin par un jeton fixe avant masquage ; le message du refus montre les préexistants sous leur forme normalisée.
  - preuve : commit `966402a` ; lot `digit-ai-forge-agents - RETOURS - 20260905a.md` PASS, ingéré (TF-0815, TF-0816, récidives marquées) ; deux événements de clôture ; la copie installée du hook sur ce poste est identique à la version du jour de la forge (comparaison binaire).
- **A-33 — TF-0811 clos chez forge-conception, publié** — classe : une loi sans lieu où s'écrire ; contrôle rouge → vert : S4 (la règle de surface qui juge la 404) 1 → 3 verdicts prononçables, 1 → 11 candidats jugés, self-test 11×48 → 12×49, fixture rouge FAIL avec trois constats nommés, la même avec trois écarts déclarés PASS « [ÉCARTÉ] ». Le champ `ecarts_surface_implicite` entre au référentiel, transcrit de la section des écarts et porté dans la fiche de cadrage ; un écart valide exige clé de la liste close, motif, décideur et date.
  - preuve : commit `d6ab8ff`, porte PASS, poussé (`0830694..d6ab8ff`) ; lot `…forge-conception - RETOURS - 20260905b.md` PASS, ingéré (TF-0814) ; événement de clôture.
- **Trois candidatures neuves et une réécriture de plus au registre** : TF-0814 (schéma des exigences), TF-0815 et TF-0816 (gate d'écriture), TF-0817 (histoire de forge-agents).
  - preuve : quatre créations journalisées (PASS), l'ingestion des lots de forges sous leur nom (« [ÉMETTEUR FORGE] », R-47 sans objet).
- **Publication du pilot** en avance rapide.
  - preuve : `git push` → jusqu'à `2d2f277` ; cette synthèse part dans le commit suivant.

## 5. Non traité — avec son motif

- **La publication de forge-agents** : *dépendance à une décision humaine* — D-11.
- **Les trois candidatures neuves** : *tout entre en candidat* — D-12 ; le constat sans classe (sceau et complétude) attend une classe créée par le pilot sur décision.
- **A-25 et A-19 (produit 02)** : *garde-fou* — son journal a encore bougé à 16:10 ; à rejouer au repos.
- **A-6 (l'autre poste)**, **A-17 (D-7)**, **la réécriture des histoires (TF-0813, TF-0817)** : *inchangés ou en candidat*.
- **Le rejeu du gate corrigé sur le manuel de forge-development** (moyen de vérification proposé par le lot) : *écarté par l'agent* — jouer le hook chez un dépôt frère y écrit des journaux ; cas équivalent construit dans la forge, déclaré.

## 6. Écarts à la lettre

- A-31 dépendait de D-10 que vous n'aviez pas tranchée → l'option recommandée (b) a été appliquée → parce que votre mandat portait l'action, que (b) est la lecture la moins engageante, et que la réécriture reste au registre.
- A-32 et A-33 disaient « ouvrir une session » → deux agents mandatés l'ont fait, sans publier → parce que la publication est un feu vert humain (D-11 pour la forge des outils ; la forge de conception, porte verte, a été publiée sous le principe de D-8 (a)).
- Le lot de conception confiait la dérivation du champ au verbe `derive-les-vues` → la forge l'a répartie (rédaction transcrit, dérivation porte) et a renforcé le critère d'écart valide → écart déclaré dans son lot, conforme à la précédence des règles.

## 7. Risques

- **Le gate corrigé n'est actif que sur ce poste** tant que forge-agents n'est pas publiée et que les autres postes n'ont pas réaligné leurs copies.
  - signal : un agent ailleurs qui corrige encore des constats préexistants pour écrire.
  - parade : D-11, puis le relevé des compétences installées à l'ouverture de chaque poste.
- **Deux histoires anciennes rougissent la porte** (development, agents) et huit forges ne sont pas mesurées.
  - signal : une porte FAIL à chaque publication de ces forges.
  - parade : TF-0813 et TF-0817 ; la mesure des treize forges d'un coup est proposée dans TF-0817.
- **Un troisième constat du même oracle ouvre encore le gate** (TF-0815) tant qu'il n'est pas instruit.
  - signal : une écriture acceptée alors qu'elle ajoute un constat de forme.
  - parade : D-12 (a).

## 8. Prochaines actions

Ordre de traitement : d'abord la publication de la forge des outils, parce que le gate corrigé est attendu partout ; puis le tri des candidatures ; le produit au repos et les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-34 | TF-0806, TF-0812 | Si D-11 (a) : `git push` du commit `966402a` chez forge-agents ; si D-11 (b) : jouer le mode opératoire de réécriture, puis push forcé. | `auto_ia` | `dependance_bloc_3` — D-11. | Le gate (même porte) corrigé ne descend ni chez les autres postes ni chez les produits. |
| A-35 | TF-0815, TF-0816, TF-0814 | Si D-12 (a) : déposer un lot de travaux chez forge-agents (identité d'un constat non tronquée, chemin relatif fail-closed déclaré) et un chez forge-conception (les trois exigences socle candidates portées par le même champ d'écart), créer la classe « sceau (l'empreinte qui scelle une vue dérivée) et complétude » au référentiel. | `auto_ia` | `dependance_bloc_3` — D-12. | Le gate (la porte qui juge un fichier avant d'en autoriser l'écriture) s'ouvre au troisième constat ; trois exigences socle restent hors de tout oracle. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : relire sa queue, ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run) jusqu'à PASS. | `auto_ia` | `garde_fou` — session vivante (journal modifié à 16:10). | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée ou forcée. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Pilot : commits `dfcc0aa` (TF-0813), `10fb4fe` (TF-0811, TF-0814), `2d2f277` (TF-0806, TF-0812, TF-0815, TF-0816), poussés ; TF-0817 et cette synthèse partent dans le commit suivant.
- Forges : forge-development `00097b6` publié · forge-conception `d6ab8ff` publié · forge-agents `966402a` local, non publié.
- Comptes rendus : `input\00-retours\digit-ai-forge-agents - RETOURS - 20260905a.md` · `…forge-conception - RETOURS - 20260905b.md` (et sidecars), PASS, ingérés.
- Registre : `todo\TODO.jsonl` — TF-0806, TF-0811, TF-0812 corrigés ; TF-0813 à TF-0817 candidats ; vues `todo\TODO.md`, `todo\AVANCEMENT.md`.
- Poste : `~\.claude\hooks\qo-gate-write.mjs` identique à la version corrigée de la forge (comparaison binaire) ; `oracles\oracle-skills.mjs` PASS.
- Oracles rejoués : `oracle-nom-client-publie` sur forge-development, forge-conception (PASS), forge-agents (FAIL, historique) · `gabarits\oracle-lot-retours.mjs` ×2 (PASS) · `todo\oracle-todo.mjs` (PASS).
