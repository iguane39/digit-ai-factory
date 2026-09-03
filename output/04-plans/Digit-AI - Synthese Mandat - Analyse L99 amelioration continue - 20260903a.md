---
destinataire: humain
---

# Synthèse de mandat — analyse L99 (le niveau complet du skill d'analyse de prompt, 8 couches) de votre demande de système d'amélioration continue (03/09/2026)

Votre demande décrit un défaut réel, et l'analyse le confirme par les faits : des corrections déjà
faites par la factory se reproduisent chez les produits. Mais elle demande de concevoir un système
qui existe déjà pour l'essentiel, et elle place le défaut au mauvais endroit. La factory récupère,
consigne et corrige ; ce qu'elle a appris ne redescend pas chez les produits, et elle a interdiction
d'y écrire depuis votre décision du 23 août. Le prompt réécrit garde votre intention entière, mais
change le premier verbe, de « conçois » à « mesure puis complète », et c'est un écart que je vous
soumets plutôt que de le glisser dans un texte long. Rien n'a été construit à ce tour : il vous
revient de valider l'écart, puis de lancer le mandat.

## 1. En-tête d'identification

- **quoi** — invocation du skill d'analyse de prompt sur votre message, par le lexique du noyau ; analyse en 8 couches, prompt réécrit, contrat de sortie et protocole de tests.
- **sur quoi** — votre demande du 03/09 d'un système d'amélioration continue de la factory et de ses forges, confrontée au registre, aux règles et au relevé d'ouverture du pilot.
- **quand** — fin le **03/09/2026 à 09:50 (UTC+02:00)**, durée **≈ 20 minutes**.
- **qui** — session pilot Claude Fable 5.1, dépôt du pilot à `9b7f0d4`, deux fichiers modifiés non committés à l'ouverture.

## 2. Verdict en une ligne

Prompt noté **28/100**, réécrit à **86/100 projeté** : 3 défauts bloquants — le système demandé existe pour ses deux tiers (787 items au registre, règle de descente adoptée hier), le défaut vit dans la descente vers les produits et non dans l'apprentissage de la factory, et « ne se reproduisent pas » n'a aucun compteur — plus 8 majeurs, tous clos par le prompt réécrit.

## 3. Décisions attendues

**Chapeau commun.** Le skill impose de vous soumettre chaque endroit où le prompt réécrit s'écarte
du texte de votre demande. Sept écarts sont listés au bloc 6 ; un seul change la nature du travail,
et il fait l'objet de la décision unique de ce tour.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la prose
rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le tableau donne
les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que la retenir
ferme. La ligne encadrée qui clôt la décision dit ce qui se passe si vous ne tranchez pas.

> **D-1 — Validez-vous que « conçois et construis un système » devienne « mesure les récidives, puis complète le système existant sur ses trous » ?**
> Votre message demande de concevoir et construire un système d'amélioration continue. Le prompt réécrit interdit tout registre ou journal parallèle, impose un pas de mesure des récidives avant toute construction, puis cinq livrables bornés qui étendent l'existant : une clé de classe et la détection de récidive à l'ingestion, la descente mesurée chez chaque produit, un hook qui force l'invocation des skills du lexique, un tableau de bord généré, et une revue périodique des classes pour l'anticipation. C'est un rétrécissement du verbe, pas de l'intention.
> **Recommandation : (a).** Source consultée : le registre `todo/TODO.jsonl` et son archive (787 items comptés ce matin), la règle R12 (règle du registre : toute clôture corrigée porte sa descente vers les producteurs) de `references/TODO-FORGE.md` adoptée le 02/09 sur le constat de trois récidives en quatre jours, le relevé d'ouverture de cette session (9 produits, 72 manques d'héritage, 5 produits sans lanceur de hooks), et la règle N-5 (règle de non-répétition : le pilot n'écrit jamais chez un produit) de `references/REGLES-DE-NON-REPETITION.md`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Valider l'écart et lancer le mandat selon le prompt réécrit, pas 0 de mesure en tête | Effort **complexe × moyen** : cinq livrables, chacun avec son oracle, trois itérations au plus par livrable | Exclut de construire un système neuf, donc exclut aussi de dupliquer le registre existant |
| **(b)** Refuser l'écart et construire un système distinct, comme votre message le demandait | Effort **très complexe × long** : un second registre à alimenter, et 787 items d'historique à migrer ou à abandonner | Exclut la mesure préalable ; le risque nommé est deux vérités sur les mêmes retours |
| **(c)** Ne rien lancer et garder l'analyse comme dossier | Effort nul | Exclut toute suite : les récidives continuent chez les cinq produits sans lanceur de hooks |

> **Si rien n'est décidé** : (c) s'applique, l'analyse reste au dossier et rien n'est mesuré ni construit.

## 4. Traité — avec sa preuve

- **Le skill a été invoqué par le lexique du noyau, au premier mot de votre message.**
  - preuve : l'appel `prompt-analyzer-l99` a été lancé avant toute lecture de fichier, et sa spécification des couches a été chargée — 191 lignes, double ancrage, rubrique en 6 dimensions, règles de forme TF-0770.
- **L'existant a été relu, jamais recopié, avant de juger le prompt.**
  - preuve : compte exécuté ce matin sur `todo/TODO.jsonl` et `todo/TODO-ARCHIVE.jsonl` — 787 items, 11 actifs ; 94 fichiers dans `input/00-retours/` ; hooks actifs relus dans `.claude/settings.json` — SessionStart, Stop, PostToolUse, et **aucun hook `UserPromptSubmit`**, ce qui est la cause mécanique du skill « oublié plusieurs fois » que vous citez.
- **Le prompt est noté 28 sur 100, dimension par dimension.**
  - preuve : clarté 12/20, spécification 4/20, garde-fous 2/15, ancrage 7/15, vérifiabilité 0/15, robustesse 3/15. La vérifiabilité à zéro est le chiffre qui compte : rien dans votre message ne permet de dire que le système marcherait.
- **Trois bloquants sont établis par confrontation aux faits, pas par opinion.**
  - preuve, EXISTANT : registre, boucle du 04/08, R12 du 02/09 avec 31 items clos avec descente au commit `9b7f0d4`, règles N-1 (un travail planifié s'exerce avant d'être déclaré en place) à N-11 (une affordance promise est tenue), héritage R-47 (règle de projet : ce que le pilot copie chez un produit se déclare et se vérifie), portée R-52 (règle de projet : une doctrine nomme ses consommateurs et leur état d'installation).
  - preuve, CIBLE : le retour TF-0757 du 02/09 dit mot pour mot que « la remontée est MONTÉE et n'est jamais REDESCENDUE » ; le relevé d'ouverture de ce matin compte 72 manques sur 9 produits ; N-5 interdit au pilot de les corriger lui-même.
  - preuve, COMPTEUR : aucun champ de récidive au registre ; 5 items contiennent le mot « récidive », 22 « déjà corrigé » ou « redécouvert », en texte libre seulement.
- **Les quatre exemples de votre message sont quatre classes distinctes, et chacune a reçu son mécanisme dans le prompt réécrit.**
  - preuve : dossiers de génération → règle héritée et vérifiée par R-47 ; versions de fichiers → règle 5 de `REGLES-PROJET.md`, câblée au pilot depuis le 23/08 mais non héritée ; formats HTML → socle et oracles existants à invoquer ; skills non exécutés → hook `UserPromptSubmit` neuf, avec self-test.
- **L'analyse complète passe l'oracle de lisibilité du Markdown.**
  - preuve : `check_markdown.py` sur le fichier d'analyse, règles M7 (un chapitre ouvre par une phrase, jamais un tableau nu), M10 (tout tableau dit comment se lire), M14 (aucun marqueur de travail oublié dans le texte) et M18 (tout identifiant porte son sens) : **PASS**, un avertissement M14 sur le mot « TODO », qui désigne ici le registre lui-même.
- **Cette synthèse est jugée par l'oracle de restitution avant affichage.**
  - preuve : `oracle-synthese` exécuté sur ce fichier, verdict rapporté au bloc 9.

## 5. Non traité — avec son motif

- **La construction des cinq livrables** : *dépendance à une décision humaine* — la décision D-1 ci-dessus ; le mandat est un tour de travail entier.
- **La mesure des récidives (pas 0 du prompt réécrit)** : *dépendance à une décision humaine* — elle est le premier livrable du mandat, pas une pièce de l'analyse ; l'analyse n'a compté que ce qui prouvait ses bloquants.
- **La pose du lanceur de hooks chez les cinq produits qui n'en ont pas** : *garde-fou nommé* — N-5, le pilot n'écrit pas chez un produit ; c'est le seul geste humain du dispositif, rappelé au bloc 8.
- **La surveillance entre les runs par forge-observability** : *hors mandat* — effet positif identifié au chapitre 7 de l'analyse, déclaré en candidat dans le prompt réécrit, non implémenté.
- **Les deux fichiers modifiés non committés à l'ouverture** (`output/04-plans/README.md`, `output/LISEZMOI.md`) : *hors mandat* — régénérés par hook, ils ne portent pas de travail de ce tour ; l'enregistrement de la journée du 02/09 reste en attente.
- **Six gabarits de documents HTML modifiés dans l'arbre de travail à 09:50** (`gabarits/documents/`, 156 lignes ajoutées, sommaire latéral référencé TF-0787) : *hors mandat* — ce tour ne les a pas touchés ; leur horodatage et leur contenu désignent une autre session active sur le même dépôt. Ils sont laissés tels quels, ni relus ni committés.

## 6. Écarts à la lettre

Le skill impose de lister chaque écart entre votre texte et le prompt réécrit, poste par poste.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « Conçois et construis un système d'amélioration continue » | **Mesure, puis complète** l'existant ; tout registre parallèle interdit | Le système existe pour ses deux tiers ; construire à côté crée deux vérités. **C'est l'écart soumis en D-1** |
| « la factory … apprendre de ses erreurs » | La cible est la **descente vers les produits**, sous la contrainte que le pilot n'y écrit pas | La factory apprend déjà ; ce qu'elle apprend n'atteint pas les producteurs |
| « s'assurer que des erreurs … ne se reproduisent pas à nouveau » | **Détecter et compter** toute récidive à l'ingestion, exiger une descente mesurée ; jamais refuser un lot pour récidive | Une garantie absolue n'est pas prouvable ; un compteur l'est, et un refus cacherait le défaut |
| « quitte à revoir le format de ses échanges avec les produits » | Format **versionné et rétro-compatible**, deux versions acceptées pendant la transition | 24 produits suivis héritent du contrat ; le casser fait re-remonter ce qui l'était |
| « construire des outils supplémentaires, et/ou proposer des améliorations, process… » | Anticipation = **candidatures** issues d'une revue des classes, au plus une par quinzaine ; construction sur décision ; cinq livrables, trois itérations | La décision reste humaine (R-29) ; un périmètre ouvert n'a pas de fin |
| « les demandes utilisateurs » | Deux sources distinguées : vous, par demande directe, et les utilisateurs finaux, par les lots des produits | Deux canaux existent et ne se traitent pas au même endroit |
| (rien sur l'observabilité) | forge-observability déclarée en candidat, non implémentée | Effet positif identifié ; hors du périmètre demandé |

## 7. Risques

- **L'analyse conclut « ne reconstruis pas », et c'est une conclusion confortable pour la session qui l'écrit.**
  - signal : le pas 0 de mesure rendrait « peu de récidives », et le mandat se réduirait à deux champs de plus.
  - parade : le jeu d'essai du protocole impose un lot réel de fin août contenant les trois récidives que TF-0757 nomme ; une mesure qui ne les retrouve pas est fausse par construction.
- **La clé de classe dérive : deux sessions classent le même défaut sous deux clés voisines, et le bruit revient.**
  - signal : le nombre de classes créées grimpe plus vite que le nombre de récidives détectées.
  - parade : référentiel fermé et daté, refus à l'ingestion d'une clé inconnue, contre-métrique obligatoire au tableau de bord, et signal « classe suspecte » pour toute clé créée à moins de 30 jours d'un retour voisin.
- **Un détrompeur de plus par récidive finit par bloquer le travail, et les sessions contournent les hooks.**
  - signal : un hook neuf refuse une restitution légitime, comme le hook « produits intacts » l'a fait cinq fois le 24/08.
  - parade : toute règle neuve entre avertissante et se durcit sur corpus propre, doctrine déjà écrite dans la consigne de restitution.
- **Cinq produits sans lanceur de hooks restent hors de portée du dispositif tant que le geste humain n'est pas fait.**
  - signal : le relevé d'ouverture continue de les nommer, et leurs lots continuent de porter les mêmes classes.
  - parade : le relevé les nomme avec les classes dont ils ne sont pas protégés, pour que le geste soit un choix informé et non un oubli.

## 8. Prochaines actions

Ordre de traitement : la décision D-1 passe devant, parce que tout le reste en dépend ; la pose du lanceur chez les produits vient ensuite, parce qu'elle supprime à la source la moitié des manques relevés ce matin.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | `neuve` | Lancer le mandat selon le prompt réécrit, pas 0 en tête : mesurer les récidives sur les 787 items et les lots, classer les quatre exemples, puis construire les cinq livrables sous leurs oracles. | `auto_ia` | `dependance_bloc_3` — attend la validation de l'écart D-1. | Les récidives restent une lecture humaine, et les mêmes retours continuent de remonter. |
| A-2 | `neuve` | Committer chez le pilot l'analyse et cette synthèse, avec les deux README régénérés par hook. | `auto_ia` | `gate_gouvernance` — l'enregistrement de la journée du 02/09 attend déjà votre GO, et ce tour ne le décide pas pour lui. | Une fermeture de session, et l'analyse ne vit que dans l'arbre de travail. |
| A-3 | `neuve` | Poser le lanceur de hooks et la configuration produit chez les cinq produits qui n'en ont aucun, nommés au relevé d'ouverture de ce matin. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (N-5, votre mandat du 23/08) ; la pose est un choix par produit. Trace mesurée : le relevé d'ouverture du 03/09 nomme cinq produits « SANS lanceur de hooks : rien ne se remettra à niveau tout seul ». | Ces cinq produits ne reçoivent aucune descente, quel que soit le dispositif construit. |
| A-4 | `neuve` | Trancher D-1, ou dire que l'analyse reste au dossier. | `manuelle_utilisateur` | `decision` — arbitrage du verbe du mandat, entre compléter l'existant et construire à côté. | (c) s'applique : rien n'est mesuré ni construit. |

## 9. Traces

- Analyse complète en 8 couches : `output\03-etudes\20260903-L99-amelioration-continue.md` — `check_markdown.py` M7/M10/M14/M18 : PASS.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Analyse L99 amelioration continue - 20260903a.md` — jugée par `oracle-synthese` avant affichage.
- Spécification suivie : `references\couches.md` du skill, 191 lignes, chargée avant exécution.
- Pièces confrontées au prompt : `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl` (787 items) · `references\TODO-FORGE.md` (R12, TF-0757) · `references\REGLES-DE-NON-REPETITION.md` (N-1 à N-11) · `REGLES-PROJET.md` §R-47 et §AE (R-52) · `BOUCLE-AMELIORATION.md` · `.claude\settings.json` (hooks actifs) · relevé d'ouverture du 03/09 (héritage : 9 produits, 72 manques).
- Dépôt du pilot : `9b7f0d4`, arbre non committé — rien n'est publié.
