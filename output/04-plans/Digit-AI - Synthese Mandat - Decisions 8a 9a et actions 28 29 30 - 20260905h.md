---
destinataire: humain
---

# Synthèse de mandat — décisions 8a et 9a exécutées : trois forges publiées, quatre candidatures du pilot closes, deux lots de travaux déposés (05/09/2026)

Vos deux décisions sont appliquées. Trois forges sur quatre sont publiées après passage de la porte de publication ; la quatrième, la forge de développement, a été retenue : la porte y est rouge sur son histoire ancienne, pas sur le commit du jour — c'est une décision à part, posée ci-dessous. Les sept candidatures sont décidées dans l'ordre que vous avez retenu ; les quatre du pilot sont closes : l'ingestion ne prend plus une forge pour un produit (trois pseudonymes parasites retirés, six demandeurs rectifiés au registre), le contrôle de mise en production nomme la recette générique de la 404 et juge aussi l'adresse sans préfixe, et la quatrième était déjà tenue. Les deux chantiers restants sont confiés par lot de travaux à la forge des outils (le gate d'écriture qui impute des constats préexistants) et à la forge de conception (un champ pour l'écart explicite de la surface implicite). Ce qui change pour vous : la descente est effective chez trois forges, et le pilot ne fabrique plus de faux produits. Ce qui est attendu de vous : trancher la publication de la forge de développement, et ouvrir les deux sessions de forges quand vous le voudrez.

## 1. En-tête d'identification

- **quoi** — mandat humain « D-8a, 9a, A-28, A-29, A-30 » sur la synthèse 20260905g : publication des forges (A-28), sept décisions D-9, candidatures du pilot instruites (A-29), lots de travaux déposés (A-30).
- **sur quoi** — le pilot `digit-ai-factory` (ingestion, contrat de MEP, patron, registre, recette neuve) ; forge-design, forge-conception, forge-tests publiées ; forge-development retenue ; boîtes d'entrée de forge-agents (créée) et forge-conception.
- **quand** — fin le **05/09/2026 à 15:25 (UTC+02:00)**, ≈ 40 minutes depuis votre réponse.
- **qui** — Claude Fable 5.1 (extension VS Code) ; pilot en version `6b740df` après publication, base `bab76c6` avant.

## 2. Verdict en une ligne

3 forges **publiées** (design `f99e293..98122d0`, conception `afdd154..0830694`, tests `89d6bc8..23c7622`, porte PASS avant chaque push), 1 **retenue** (development, porte FAIL sur 89 constats d'historique ancien) ; 7/7 candidatures **décidées**, 4/4 du pilot **closes** (TF-0807 recette 2/2, TF-0808, TF-0809, TF-0810) ; 2 lots de travaux **déposés** et jugés PASS (forge-agents, forge-conception) ; registre PASS ; pilot publié `6b740df`.

## 3. Décisions attendues

> **D-10 — Publie-t-on le commit du jour de la forge de développement malgré une porte de publication rouge sur son histoire ancienne, ou réécrit-on d'abord cette histoire ?**
> La porte de publication, jouée sur le dépôt de la forge de développement avant tout push, rend FAIL sur quatre-vingt-neuf constats — tous dans des messages de commit et des chemins d'anciens enregistrements, aucun dans le commit du jour ni dans l'arbre courant. Cette histoire est déjà publiée telle quelle sur GitHub depuis des semaines : pousser le commit du jour n'y ajoute aucun nom, mais la règle dit qu'on ne pousse pas sur une porte rouge. Le pilot a vécu la même situation le 03/09 et l'a résolue par une réécriture d'historique outillée (mode opératoire consigné dans la doctrine du registre), suivie d'un push forcé.
> **Recommandation : (b).** Source consultée : sortie de `oracle-nom-client-publie` sur la forge (C3 : 38 messages, C4 : 51 chemins, commit du jour `00097b6` absent des constats) et `references\TODO-FORGE.md` § « Réécrire l'historique d'un dépôt est un geste humain décidé, outillé par un mode opératoire fixe ».
> Publier maintenant n'expose rien de neuf et livre la discipline des statiques aux produits ; la réécriture reste due, comme pour le pilot, et se décide à part parce qu'elle force tout clone de la forge à se rebâtir.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** réécrire l'historique de la forge selon le mode opératoire du pilot, puis pousser le tout en force | complexe × moyen : sauvegarde, filter-repo, porte PASS, push forcé, clones à rebâtir | exclut la descente immédiate de la discipline des statiques ; les produits attendent |
| **(b)** pousser le commit du jour en avance rapide maintenant, et ouvrir la réécriture comme candidature séparée | simple × court : un push ; une candidature au registre | exclut de tenir la lettre de la règle « porte verte avant push » sur ce seul cas, motivé : rien de neuf n'est exposé |
| **(c)** ne pas publier | gratuit | exclut tout effet chez les produits ; ce poste seul porte le commit |

> **Si rien n'est décidé** : (c) s'applique — le commit reste local, l'histoire ancienne reste publiée telle quelle.

## 4. Traité — avec sa preuve

- **A-28 — trois forges publiées, une retenue** — classe : un dépôt frère publié sans porte ; contrôle rouge → vert : porte de publication PASS sur design, conception, tests avant chaque push. Forge-development : porte FAIL, aucun push, décision D-10.
  - preuve : `git push` en avance rapide : design `f99e293..98122d0`, conception `afdd154..0830694`, tests `89d6bc8..23c7622` ; development : 89 constats, tous antérieurs au commit du jour.
- **D-9 — sept candidatures décidées** dans votre ordre (rangs 1 à 6, TF-0806 et TF-0812 au même rang comme un seul chantier).
  - preuve : sept événements de décision journalisés (PASS).
- **TF-0807 clos — une forge n'est plus un produit à l'ingestion** — classe : un émetteur public pseudonymisé comme un client ; contrôle rouge → vert : recette neuve 0/2 → 2/2. L'anonymiseur d'entrée reconnaît les émetteurs forge (forges, pilot, file de tickets) et ne les inscrit jamais ; l'ingestion l'annonce et déclare R-47 sans objet ; la table hors dépôt est nettoyée de ses trois entrées parasites ; six items du registre portent un événement de rectification avec le demandeur réel.
  - preuve : `todo\ingerer-emetteur-forge.test.mjs` 2 PASS (lot de forge → nom conservé, table intacte ; lot de produit → pseudonymisé) ; table 62 → 59 entrées ; `oracle-todo` PASS après les sept événements.
- **TF-0808 et TF-0809 clos — M-9 (la 404 jugée à la mise en production) nomme la recette générique et juge la racine** — classe : une doctrine qui prescrit de réécrire un contrôle existant, et un cas du patron absent du contrôle ; contrôle rouge → vert : texte de M-9 et de P-2 avant/après. La preuve exigée est la sortie de `recette\quatre_cent_quatre.py` de forge-tests ; une adresse sans préfixe rend le 404 dans la langue par défaut.
  - preuve : `ETAPE-MEP.md` ligne M-9 et `references\PATRONS-EPROUVES.md` exigence 5 ; deux événements de clôture.
- **TF-0810 clos — déjà tenu** (événement de clôture PASS) : le pilot employait la forme exacte de frontière (lettres, chiffres, tiret bas) depuis TF-0805.
  - preuve : `oracles\oracle-synthese.mjs` (aide de frontière) ; événement de clôture citant `6e92bd8`.
- **A-30 — deux lots de travaux déposés** chez forge-agents (TF-0806 + TF-0812 : normaliser le chemin avant masquage dans le partage neufs/préexistants du gate, fixture double sens) et forge-conception (TF-0811 : un champ d'écart explicite de la surface implicite dans le référentiel, S4 (la règle de surface qui juge la 404) jugeante), boîte de forge-agents créée selon la convention.
  - preuve : `gabarits\oracle-travaux-pilot.mjs` PASS ×2 ; fichiers non suivis chez les forges, aucun commit.
- **Publication du pilot** en avance rapide.
  - preuve : `git push` → `bab76c6..6b740df main -> main`.

## 5. Non traité — avec son motif

- **La publication de forge-development** : *dépendance à une décision humaine* — D-10.
- **L'instruction des deux lots déposés** : *chez la forge* — ils décrivent, ils ne commandent pas ; une session chez chaque forge les prend.
- **A-25 et A-19 (produit 02)** : *garde-fou* — son journal a encore bougé à 15:17 ; à rejouer au repos.
- **A-6 (l'autre poste)** et **A-17 (nom de la file, D-7)** : *inchangés*.
- **La réécriture de l'historique de forge-development** : *dépendance à une décision humaine* — D-10 (a) ou candidature séparée.

## 6. Écarts à la lettre

- D-8 (a) disait « publier les huit commits » → sept sont publiés, un est retenu → parce que la porte, jouée comme (a) l'exigeait, est rouge sur ce dépôt ; la cause est ancienne et la décision vous revient (D-10).
- A-29 disait « TF-0810 close comme déjà tenue » → close, sans changement de code → parce que la mesure de la forge et celle du pilot coïncident.
- Rien ne demandait de rectifier le registre → six événements de rectification ont été ajoutés → parce que corriger l'ingestion sans dire quels items portaient un faux demandeur aurait laissé le registre illisible ; l'histoire s'annote, elle ne se réécrit pas.

## 7. Risques

- **Le commit de forge-development reste local** tant que D-10 n'est pas tranchée.
  - signal : `origin/main` inchangé chez la forge ; gate « static-cache » absent des projets neufs.
  - parade : D-10, deux options rapides.
- **Un lot de forge dont le préfixe n'est pas de la forme attendue** (nom court, sans `digit-ai-`) serait encore pseudonymisé.
  - signal : « [ANONYMISÉ] produit du lot → Produit-NN » sur un lot de forge.
  - parade : le gabarit impose le nom complet de la forge en préfixe ; la recette le joue.
- **Les deux lots déposés qu'aucune session ne lit**.
  - signal : statut `a_traiter` inchangé au prochain relevé.
  - parade : bloc 8.

## 8. Prochaines actions

Ordre de traitement : d'abord la décision sur forge-development, parce qu'un commit prouvé attend ; puis les deux sessions de forges, dans l'ordre de votre tri ; le produit au repos et les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-31 | TF-0798 | Si D-10 (b) : `git push` du commit `00097b6` chez forge-development et créer la candidature de réécriture d'historique ; si D-10 (a) : jouer le mode opératoire de réécriture (sauvegarde en paquet, filter-repo, porte PASS), puis push forcé. | `auto_ia` | `dependance_bloc_3` — D-10. | La discipline des statiques ne descend chez aucun produit. |
| A-32 | TF-0806, TF-0812 | Ouvrir une session chez forge-agents : elle trouve `input\00-travaux\pilot - TRAVAUX - 20260905a.md`, joue l'oracle de forme cité en tête, corrige le partage neufs/préexistants du gate (la porte qui juge un fichier avant d'en autoriser l'écriture) et remet son lot de retours. | `manuelle_utilisateur` | `acces` — une session chez une forge s'ouvre sur votre poste ; trace mesurée : lot déposé, T1 (moyen de vérification par élément) à T5 (l'ordre recommandé porte son motif) PASS, boîte créée. | Chaque édition de document chez une forge ou un produit paie le gate. |
| A-33 | TF-0811 | Ouvrir une session chez forge-conception : même geste sur `input\00-travaux\pilot - TRAVAUX - 20260905b.md` (champ d'écart explicite, S4 jugeante). | `manuelle_utilisateur` | `acces` — même raison ; trace mesurée : lot déposé, T1-T5 PASS. | La 404 et tout candidat d'office continuent de disparaître par omission. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : relire sa queue, ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run) jusqu'à PASS. | `auto_ia` | `garde_fou` — session vivante (journal modifié à 15:17). | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée ou forcée. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Pilot : commit `6b740df` poussé (`todo\anonymiser-entrant.mjs`, `todo\ingerer-lot.mjs`, `todo\ingerer-emetteur-forge.test.mjs`, `ETAPE-MEP.md`, `references\PATRONS-EPROUVES.md`, registre et vues) ; cette synthèse part dans le commit suivant.
- Forges publiées : forge-design `98122d0`, forge-conception `0830694`, forge-tests `23c7622` ; retenue : forge-development `00097b6`.
- Lots déposés : `digit-ai-forge-agents\input\00-travaux\pilot - TRAVAUX - 20260905a.md` (+ `input\LISEZMOI.md`) · `digit-ai-forge-conception\input\00-travaux\pilot - TRAVAUX - 20260905b.md`.
- Registre : `todo\TODO.jsonl` — sept décisions, TF-0807 à TF-0810 corrigés, six rectifications de demandeur ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` (11 ouverts, 20 fermés). Table hors dépôt `c:\dev\_produits-pseudonymes.json` : 62 → 59 entrées.
- Oracles rejoués : `oracle-nom-client-publie` ×4 sur les forges (3 PASS, 1 FAIL) · `gabarits\oracle-travaux-pilot.mjs` ×2 (PASS) · `todo\ingerer-emetteur-forge.test.mjs` (2/2) · `todo\oracle-todo.mjs` (PASS).
