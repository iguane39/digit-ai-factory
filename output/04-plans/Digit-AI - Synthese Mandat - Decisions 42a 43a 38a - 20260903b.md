---
destinataire: humain
---

# Synthèse de mandat — vos trois décisions du matin exécutées : l'historique du pilot réécrit et publiable, les travaux déposés chez le produit 02, les quatre constats du soir clos (03/09/2026)

## 0. Synthèse d'ouverture

Vos trois réponses « 42a, 43a, 38a » sont exécutées. Le passé du dépôt principal a été réécrit après une sauvegarde vérifiée : la porte de publication rend zéro nom de client, historique compris, et le pilot est publiable pour la première fois. Le lot de travaux du produit 02 est déposé chez lui, sans rien commettre à sa place. Sur les quatre constats du soir, celui du pilot est clos : les trois familles de gabarits ont un sommaire latéral qui reste visible en lisant, et les deux contrôles rouges d'hier sont verts. Deux autres sont clos chez la forge des tests : son outil de lint est épinglé et ses cent constats soldés, et chaque rapport de recette dit désormais avec quelles règles il a jugé, refusant de comparer deux rapports jugés par des règles différentes. Le dernier est clos chez la forge des outils : la copie manuelle d'un composant, restée sept correctifs en arrière, est désormais posée par un outil, scellée par l'empreinte de sa source, et un juge de parité rougit le banc à la moindre dérive. Deux constats neufs, trouvés en chemin, attendent votre tri au prochain tour. En passant, votre demande d'améliorer le prompt du système d'amélioration continue avait déjà été traitée avant votre interruption : l'analyse existe, et elle vous soumet un écart plutôt qu'un système. Ce qui est attendu de vous : une décision sur cet écart, et deux gestes de publication, dont celui qui installe la nouvelle histoire du pilot chez l'hébergeur.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-42 (a), D-43 (a) et D-38 (a) prises sur la synthèse du second tour du 02/09 ; clôtures, réécriture d'historique, dépôt de travaux, banc.
- **sur quoi** — le pilot `digit-ai-factory` ; écritures mandatées chez `digit-ai-forge-tests` (deux commits locaux) et `digit-ai-forge-agents` (un commit local) ; aucun push ; dépôt d'un lot de travaux chez le produit 02 (fichiers non suivis, aucun commit chez lui).
- **quand** — fin le **03/09/2026 à 11:35 (UTC+02:00)**, durée depuis vos réponses **≈ 1 h 50**.
- **qui** — session pilot Claude Fable 5.1 ; dépôt passé de `9b7f0d4` (identité d'avant la réécriture) à `961ea5b` puis commit de clôture ; deux agents délégués (Opus 5), tous deux rendus ; escalade de modèle : aucune.

## 2. Verdict en une ligne

**TF-0752 clos** (D-38 (a)) : porte de publication du pilot **FAIL (200 constats dans l'historique) → PASS (0)**, 459 commits réécrits · **TF-0787 clos** : `oracle-gabarits-documents` et `verifier-rendu-instances` FAIL → PASS · **TF-0785 et TF-0786 clos** : forge-tests ruff 100 constats → 0, recette entière S-01 (le verdict d'ensemble de la recette : la forge attrape ce qu'elle doit et se tait sur ce qui va bien) NON TENU → TENU (13/13 sections), banc 1233 → 1257 tests, 0 échec · **TF-0784 clos** : forge-agents, oracle de parité neuf (bruit 6 détections / 6 vraies / 0 faux positif sur 178 pages), quality-oracles 210 → 215, exemple de référence check_html FAIL → PASS · **TF-0788 et TF-0789 candidats** (constats en passant) · banc pilot **86/86** (les deux rouges d'hier verts, les deux rouges transitoires du chantier de l'agent soldés : sites déclarés, copies installées identiques) · registre PASS, **11 → 8 actifs** (2 candidats, 6 décidés) · lot de travaux déposé chez le produit 02 (3 items, 8 éléments).

## 3. Décisions attendues

> **D-44 — Validez-vous l'écart de l'analyse de votre prompt : « conçois et construis un système » devient « mesure les récidives, puis complète le système existant sur ses trous » ?**
> Votre demande du matin (« Améliore ce prompt : conçois et construis un système d'amélioration continue… ») a été traitée par L99 (le niveau complet de l'analyse de prompt, en huit couches) avant votre interruption ; le dossier existe, avec le prompt réécrit, son contrat de sortie et son protocole de tests. L'analyse conclut que le système demandé existe déjà pour l'essentiel — le registre récupère, consigne et corrige —, et que le défaut réel est ailleurs : ce que la factory apprend ne redescend pas chez les produits, chez qui elle a interdiction d'écrire depuis votre décision du 23 août. Le prompt réécrit garde votre intention entière mais change le premier verbe ; rien n'a été construit, parce que cet écart est le vôtre à valider.
> **Recommandation : (a).** Source consultée : `output/03-etudes/20260903-L99-amelioration-continue.md` (chapitre 8 : prompt réécrit, contrat de sortie, protocole) et la synthèse `output/04-plans/Digit-AI - Synthese Mandat - Analyse L99 amelioration continue - 20260903a.md` (jugée PASS) ; le relevé d'héritage de l'ouverture du 03/09 (9 produits, 72 manques, 5 sans lanceur).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** valider l'écart et lancer le mandat selon le prompt réécrit, la mesure des récidives en tête | complexe × moyen : cinq livrables, chacun avec son oracle, trois itérations au plus par livrable | exclut de construire un système neuf ; le registre reste la source unique |
| **(b)** refuser l'écart et construire un système distinct, comme votre message le demandait | très complexe × long : un second registre à alimenter, 787 items d'historique à migrer ou à abandonner | exclut la mesure préalable ; le risque est de rebâtir ce qui existe |
| **(c)** ne rien lancer et garder l'analyse comme dossier | gratuit | exclut toute suite : les récidives continuent chez les cinq produits sans lanceur de hooks |

> **Si rien n'est décidé** : (c) s'applique — l'analyse reste un dossier, rien ne se dégrade, les récidives continuent.

## 4. Traité — avec sa preuve

**D-42 (a) — les quatre constats du soir fermés**
- **TF-0784 clos — une copie d'un composant ne reçoit aucun correctif : elle se pose, se scelle et se juge** : l'exemple de référence du skill de schémas embarquait une copie manuelle du composant de filtres, corrigé sept fois depuis sans qu'elle bouge ; un poseur (`embarquer-composants.mjs --constat / --ecrire`) ne touche que les blocs marqués et scelle l'empreinte de la source ; un oracle de parité (`oracle-parite-assets.mjs`, P1 déclaration, P2 empreinte du jour, P3 parité octet pour octet, P4 exemption datée) juge tout le dépôt sans rien écrire et est rejoué sur le dépôt réel par le banc ; six copies remises à la parité ; l'exemple de référence reçoit son sommaire collant à toutes les largeurs. Au pilot, les deux scripts sont déclarés comme sites de scellement.
  - preuve : bruit de l'oracle neuf sur 178 pages : 6 détections, 6 vraies, 0 faux positif ; `check_html.py` sur l'exemple de référence FAIL (L25) → PASS ; `render_page.py` sommaire perdu 2 → 0, états de filtres 5/5 sans bloquant ; bancs quality-oracles 210 → 215, page-html 173/173, `oracle-etat-forge` PASS (page-html 1.18.0, quality-oracles 2.12.0) ; au pilot `oracle-empreintes` E2 FAIL → PASS et `oracle-skills` K2 FAIL → PASS ; commit forge-agents 921a5a0.
- **TF-0785 clos — l'outil de lint de la forge des tests épinglé, ses cent constats soldés** : `pyproject.toml` passe de `ruff>=0.5` à `ruff==0.16.1` ; les cent constats sont corrigés, pas mis en dette ; la section lint de la recette consigne la version jouée et la déclaration lue, et échoue si la déclaration n'épingle pas ou si la version jouée diffère.
  - preuve : dérive mesurée sur le même arbre, ruff 0.5.7 = 115 constats contre ruff 0.16.1 = 100, zéro octet changé ; `uv run ruff check` 100 → 0 (« All checks passed ») ; `verifier_corpus.py --section lint` ECHEC → OK ; fixture double sens : 5 déclarations non épinglées refusées, `ruff==0.16.1` acceptée ; banc 1233 → 1240 tests, 0 échec ; commit forge-tests 0000ff7.
- **TF-0786 clos — un rapport de recette dit avec quelles règles il a jugé** : la recette lit l'empreinte publiée par `check_html.py --version-regles` et celle des familles de `render_page.py`, les consigne au rapport et déclare non comparables deux rapports d'empreintes différentes ; le tableau de bord de la forge reçoit un identifiant stable par ligne de détail et l'alignement à 768 px qui manquait.
  - preuve : `check_html.py` sur le tableau de bord du banc rouge : exit 1, 196 constats L17 → exit 0, PASS, 0 constat ; `render_page.py --widths 1280,768,390` FAIL (22 px d'écart) → PASS ; recette entière S-01 NON TENU (2 sections rouges) → S-01 TENU, 13/13, exit 0 ; bruit du contrôle neuf sur 33 documents HTML versionnés : 0 accusation ; banc 1240 → 1257 tests, 0 échec ; commit forge-tests 89d6bc8.
- **TF-0787 clos — sommaire latéral collant sur les trois familles de gabarits** : grille deux colonnes, sommaire collé au bord haut avec sa propre barre de défilement, bloc statique en tête sous 900 px ; la famille `gabarits/documents/rapport-de-donnees/`, qui n'avait pas de sommaire, reçoit six entrées et un chapeau d'ouverture par chapitre (règle L7 du socle, jugée par `check_html.py`), avec le style qui manquait (L21) — les six fichiers rendent PASS.
  - preuve : `check_html.py` sur les six fichiers 4 PASS + 2 FAIL → 6/6 PASS ; `oracle-gabarits-documents` FAIL → PASS ; `verifier-rendu-instances` (parc réel, famille de rendu « sommaire perdu ») FAIL → PASS ; les deux contrôles rouges du banc d'hier (84/86) sont verts.

**D-38 (a) — le passé du dépôt principal**
- **TF-0752 clos — historique réécrit** : sauvegarde entière (`git bundle --all`, 94,6 Mo, vérifiée, HEAD d'avant consigné à côté, hors dépôt) ; règles dérivées des deux tables hors git par un générateur (44 règles de contenu et de messages, 35 paires de noms de fichiers) ; `git filter-repo` en deux passes sur 459 commits ; `origin` remis. La première passe a laissé 96 constats, tous le sigle d'un client en minuscules dans un identifiant de run : le générateur remplace désormais les sigles sans tenir compte de la casse, comme la porte les juge.
  - preuve : `oracle-nom-client-publie .` (arbre + noms de fichiers + messages + historique) : 200 constats → 96 → **0, PASS** ; `git fsck` propre ; le générateur entré au dépôt (`scripts/generer-remplacements-historique.mjs`) reproduit à l'identique le jeu de règles joué (diff vide) ; mode opératoire consigné dans `references/TODO-FORGE.md`.

**D-43 (a) — les travaux du produit 02**
- **TF-0674, TF-0676, TF-0682 — lot de travaux déposé** : `pilot - TRAVAUX - 20260903a` (.md + sidecar, 8 éléments dont ces trois items) dans le dossier d'entrée des travaux du produit 02, sous mandat déclaré ; le produit ingère à son prochain travail.
  - preuve : `ls input/00-travaux/` chez le produit rend les deux fichiers (`pilot - TRAVAUX - 20260903a.md`, `.tf.jsonl`) et `git status --short` chez lui les liste `??` (non suivis, aucun commit passé à sa place) ; trois événements `travaux_deposes` au registre (`todo/TODO.jsonl`, 07:46 Z).

**Registre, vues et journal**
- Cinq clôtures avec leur `descente` (TF-0787, TF-0752, TF-0785, TF-0786, TF-0784), archivées (781 items à l'archive) ; un constat en passant entré en candidat (TF-0788 : une montée de version d'un skill dans la journée n'est sue d'aucune forge qui le consomme — le volet transverse que la forge des tests ne pouvait pas fermer chez elle ; TF-0789 : l'exemple de référence du skill de schémas déborde à 390 px sur 16 blocs et n'a pas de verdict de lecture par un tiers — mesuré identique avant et après le chantier, hors de son périmètre) ; vues et avancement régénérés ; entrée du point d'étape dans [BOUCLE-AMELIORATION.md](BOUCLE-AMELIORATION.md).
  - preuve : `oracle-todo` PASS ; `oracles/self-tests.mjs` 86/86 — `oracle-skills` K2 (règle : la copie installée d'un skill diverge de la forge) et `oracle-empreintes` E2 (règle : un site de scellement n'est pas déclaré au registre) ont rougi pendant le chantier de l'agent, puis repassent au vert une fois les deux sites déclarés dans `references/EMPREINTES.md` et les copies resynchronisées.

## 5. Non traité — avec son motif

- **La publication forcée du pilot et la publication des forges** : *irréversible, GO humain* — R-38 ; le pilot est publiable pour la première fois (porte PASS), mais la nouvelle histoire ne s'installe chez l'hébergeur que par `git push --force`.
- **La seconde copie locale du pilot (`c:/dev/_archive-digit-ai-forge-pilot_old`)** : *geste humain* — elle porte l'ancienne histoire et ne peut plus se fusionner ; la garder, la recloner ou la supprimer est votre geste, réservé par R-29 (la règle qui réserve à l'humain dépenses, suppressions et portes).
- **TF-0788, TF-0789** (constats en passant) : *tout entre en candidat* — décision humaine au prochain tour.
- **Le mandat de l'amélioration continue** : *dépendance à une décision humaine* — D-44 ; l'analyse est faite, rien n'est construit.
- **TF-0549** (produit sans dépôt git) : *décision humaine 3c du 24/08* — laissé ouvert à dessein.
- **TF-0748, TF-0749** : *dépendance externe* — une campagne réelle.
- **TF-0674, TF-0676, TF-0682** : *chez le produit* — déposés, ils se ferment quand le produit les exécute et le dit dans son prochain lot de retours.

## 6. Écarts à la lettre

- Vous avez répondu « 42a, 43a, 38a » → j'ai lu les trois lettres comme les options (a) des trois décisions de la synthèse du 02/09 (second tour) et les ai exécutées jusqu'au bout, clôtures comprises → une décision prise vaut mandat de traitement (précédent du 28/08).
- Votre demande « Améliore ce prompt… » a été interrompue par vous → elle avait déjà été traitée avant l'interruption (dossier et synthèse datés de 09:47 et 09:50) ; je ne l'ai pas rejouée et je vous soumets son résultat en D-44 plutôt que de le taire ou de l'exécuter.
- La réécriture d'historique demandait une passe → il en a fallu deux, parce que la règle des sigles était sensible à la casse alors que la porte ne l'est pas → la seconde passe est jouée sur la sauvegarde de la première, et le générateur corrigé est ce qui entre au dépôt.
- Le mode opératoire de la réécriture devait être consigné → il l'est dans `references/TODO-FORGE.md`, pas dans `references/EMPREINTES.md` comme la première clôture le disait → la clôture a été corrigée par un second événement (le registre ne se réécrit pas).

## 7. Risques

- L'historique du pilot a changé d'identité : tout clone existant (le vôtre sur un autre poste, la copie `_old`) diverge de la nouvelle histoire ; une fusion naïve réintroduirait les anciens enregistrements, noms compris.
  - signal : `git pull` qui annonce des centaines de commits divergents ; la porte de publication qui repasse FAIL sur l'historique.
  - parade : recloner, jamais fusionner ; la sauvegarde d'avant (bundle) reste consultable hors dépôt ; la porte se rejoue en une commande avant tout push.
- La publication forcée expose la nouvelle histoire, mais ce qui a déjà été publié sous les anciens noms reste dans les caches et miroirs (déclaré au non_juge de la porte).
  - signal : un moteur de recherche qui rend encore un ancien nom sur le dépôt.
  - parade : l'exposition future est réduite ; le passé publié ne se rappelle pas.
- Un chantier d'agent qui crée un script scellant fait rougir deux contrôles du banc du pilot tant que le script n'est pas déclaré au registre des empreintes : le banc voit la fourche avant l'humain, mais une session pressée pourrait lire ces rouges comme du bruit.
  - signal : `oracle-empreintes` E2 ou `oracle-skills` K2 rouges juste après un commit de forge.
  - parade : la déclaration au registre des empreintes entre dans le brief de tout chantier qui crée un script scellant (consigné au journal), et le banc se rejoue en clôture de tour.
- Le générateur de règles lit les tables au moment du geste : un nom ajouté à la table demain n'est pas dans l'histoire d'aujourd'hui.
  - signal : un constat de la porte dans l'historique après un ajout à la table.
  - parade : le mode opératoire se rejoue tel quel (sauvegarde, générateur, deux passes au besoin, porte).

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit ce que coûte l'attente. **Ordre de traitement** : d'abord la publication, parce que le pilot est publiable pour la première fois et que les forges portent des chantiers de deux jours sur ce poste seulement ; puis ce qui dépend d'une décision de ce message ; puis le reste hérité.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | TF-0752 | Publier la nouvelle histoire du pilot : dans `c:/dev/digit-ai-factory`, relire `git log --oneline -8`, rejouer la porte (`node ~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs .` doit rendre PASS), puis `git push --force origin main`. Ensuite, sur tout autre poste : recloner, ne pas tirer. | manuelle_utilisateur | irreversible — R-38 : aucun push sans GO humain ; un push forcé remplace l'histoire publiée. | Le dépôt hébergé garde les 200 enregistrements aux noms de clients. |
| **A-2** | `neuve` | Publier les chantiers des forges sœurs : dans chacun des quatre dépôts (`c:/dev/digit-ai-forge-agents`, `-design`, `-tests`, `-audit`), `git log origin/main..HEAD` pour relire, puis `git push`. Preuve : `node bootstrap.mjs --pull` ne signale plus d'avance. | manuelle_utilisateur | irreversible — R-38. | Trente-cinq corrections de deux jours vivent sur ce poste seulement ; un produit qui tire la forge n'en bénéficie pas. |
| **A-3** | `neuve` | Décider du sort de la copie `c:/dev/_archive-digit-ai-forge-pilot_old` (ancienne histoire, incompatible) : la supprimer (`Remove-Item -Recurse c:\dev\_archive-digit-ai-forge-pilot_old`) ou la garder comme archive hors publication. La sauvegarde d'avant réécriture vit dans `c:/dev/_sauvegarde-avant-filter-repo-20260903/` ; à conserver hors de tout dépôt publié. | manuelle_utilisateur | irreversible — supprimer un dossier est un geste humain (R-29). | Deux histoires du même dépôt cohabitent sur le poste ; une fusion par erreur réintroduit les noms. |
| **A-4** | TF-0788, TF-0789 | Au prochain tour, décider les deux constats en passant (une montée de version d'un skill dans la journée n'est sue d'aucune forge qui le consomme ; l'exemple de référence du skill de schémas déborde à 390 px et n'a pas de verdict de lecture tierce) puis, si décidés, comparer à l'ouverture du pilot et dans chaque recette de forge l'empreinte des oracles installés à la dernière consignée (`check_html.py --version-regles`, journal par forge). | auto_ia | dependance_bloc_3 — tout entre en candidat, décision humaine au prochain tour. | Le même diagnostic (« la recette a changé de verdict sans qu'un octet bouge ») se refait à la main à chaque montée de version. |
| **A-10** | `neuve` | Une fois D-44 tranchée (a) : lancer le mandat d'amélioration continue avec le prompt réécrit du chapitre 8 de `output/03-etudes/20260903-L99-amelioration-continue.md` (mesure des récidives en tête, cinq livrables sous oracle). | auto_ia | dependance_bloc_3 — D-44. | Les récidives chez les produits restent comptées à la main, tour après tour. |
| **A-5** | TF-0674, TF-0676, TF-0682 | Chez le produit 02, ouvrir une session qui ingère le lot `input/00-travaux/pilot - TRAVAUX - 20260903a` et exécute les trois correctifs ; le retour arrive au pilot par son prochain lot de retours. | auto_ia | garde_fou — le pilot n'exécute pas chez un produit ; le produit exécute ses propres travaux. | La dernière barrière avant la production du produit 02 reste sur un échantillon. |
| **A-6** | `neuve` | Supprimer le fichier parasite `c:/dev/null` (page de redirection vers une authentification Microsoft, vérifiée sans jeton) : `Remove-Item c:\dev\null`. | manuelle_utilisateur | irreversible — supprimer un fichier est un geste humain (R-29). | L'avertissement se répète à chaque ouverture. |
| **A-7** | `neuve` | Poser le nettoyage à l'ENREGISTREMENT : un contrôle `pre-commit` dans `c:/dev/digit-ai-factory/.git/hooks/` jouant `node todo/anonymiser-suivis.mjs --essai` et refusant l'enregistrement s'il reste quelque chose à nettoyer. | auto_ia | hors_mandat — mandat propre au socle de publication, hérité des tours précédents. | Le même défaut revient à chaque ajout de dossier entier, et ne se découvre qu'à la publication — ou, désormais, qu'à la prochaine réécriture. |
| **A-8** | TF-0749 | Au prochain passage en production d'un produit audité, jouer la comparaison des deux campagnes : `python recette/non_perte_ciblage.py <projet>` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | dependance_externe — elle exige une campagne réelle. | Le tri des tests reste éteint sans que rien ne dise s'il aurait tenu. |
| **A-9** | `neuve` | Poser le lanceur de hooks chez les cinq produits du parc qui n'en ont pas (nommés à chaque ouverture du pilot) : copier `gabarits/hooks-factory.mjs` en `forge/hooks/factory.mjs` et `gabarits/settings-produit.json` en `.claude/settings.json` chez chacun, puis ouvrir une session du produit — elle recopie le reste. | manuelle_utilisateur | decision — écrire chez un produit est un mandat nominatif ; le relevé le déclare à chaque ouverture (R-29). | Ces produits ne reçoivent ni le hook de restitution, ni le hook `page-html`, ni les gabarits : leurs livrables restent hors des portes. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Decisions 42a 43a 38a - 20260903b.md (jugée PASS par `oracle-synthese` avant affichage)
- Analyse de prompt (traitée avant l'interruption) : output/03-etudes/20260903-L99-amelioration-continue.md · output/04-plans/Digit-AI - Synthese Mandat - Analyse L99 amelioration continue - 20260903a.md
- Commits du pilot (identités d'APRÈS réécriture) : 517afb0 (TF-0787, analyse L99, décisions au registre), aa36c74 (TF-0787 clos), 961ea5b (TF-0752 clos, générateur et doctrine), puis le commit de clôture de ce point d'étape (registre, vues, journal, synthèse) — locaux, publication sur GO (A-1)
- Sauvegarde d'avant réécriture : c:/dev/_sauvegarde-avant-filter-repo-20260903/digit-ai-factory-avant-filter-repo.bundle (+ HEAD-avant.txt) — hors dépôt, à ne jamais publier
- Commits des forges (locaux) : forge-tests 0000ff7 (TF-0785), 89d6bc8 (TF-0786) · forge-agents 921a5a0 (TF-0784) ; ceux d'hier restent locaux (A-2)
- Outils et règles neufs au pilot : scripts/generer-remplacements-historique.mjs · gabarits/documents/*/{SQUELETTE,INSTANCE}.html (grille `.doc-grille`, sommaire collant, chapeaux) · references/TODO-FORGE.md § réécriture d'historique · references/EMPREINTES.md (deux sites forge-agents déclarés)
- Outils neufs aux forges : forge-agents digit-ai-page-html/scripts/embarquer-composants.mjs · quality-oracles/scripts/oracle-parite-assets.mjs (registre v2.16.0) · forge-tests recette/verifier_corpus.py (sections lint et dashboard), tests/test_tf_0785_epinglage_ruff.py, tests/test_tf_0786_oracles_du_socle.py
- Lot de travaux : c:/dev/<produit 02>/input/00-travaux/pilot - TRAVAUX - 20260903a.md et .tf.jsonl (non suivis chez le produit)
- Registre : todo/TODO.jsonl (8 actifs : 2 candidats, 6 décidés), todo/TODO-ARCHIVE.jsonl (781), todo/AVANCEMENT.md ; journal : BOUCLE-AMELIORATION.md (entrée du 03/09)
- Bancs : oracles/self-tests.mjs 86/86 (rejoué en clôture) · todo/oracle-todo PASS · oracle-nom-client-publie PASS (historique compris) · oracle-gabarits-documents PASS · verifier-rendu-instances PASS · check_html.py 6/6 sur gabarits/documents · forge-tests : pytest 1233 → 1257 (0 échec), ruff 100 → 0, recette entière exit 0 S-01 TENU 13/13 · forge-agents : quality-oracles 210 → 215, page-html 173/173, forge-agents 30 PASS, experts-forge 7/7, oracle-etat-forge PASS
