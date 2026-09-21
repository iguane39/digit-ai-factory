---
destinataire: humain
---

# Synthèse de mandat — la fusion est passée, et j'ai effacé une alerte en cherchant à la lire (21/09/2026)

Votre demande de fusion a été acceptée : tout le travail des huit tours est désormais dans la branche principale, et plus rien n'attend de ce côté. Trois jours ont passé, et deux faits sont remontés à l'ouverture. Le premier est une répétition : le socle partagé porte à nouveau le même numéro de version des deux côtés, et l'écart entre ce poste et le reste a triplé — c'est exactement ce dont parle l'arbitrage que je vous ai posé jeudi et qui attend toujours. Le second est une erreur que j'ai commise ce matin et que je préfère vous dire en premier : la surveillance des retours récurrents signalait une alerte, je l'ai relancée pour la lire, et ce simple geste l'a effacée — l'outil écrit un point de mesure chaque fois qu'on le consulte, si bien que le consulter remet le compteur à zéro. J'ai remis les fichiers en l'état, l'alerte est intacte, et le défaut est consigné. Ce qui est attendu de vous : les deux lettres de jeudi, qui n'ont pas bougé.

## 1. En-tête d'identification

- **quoi** — relevé de l'état après la fusion de la demande, instruction des deux signaux remontés à l'ouverture, et réparation d'une alerte que mon propre diagnostic avait effacée.
- **sur quoi** — le pilot `digit-ai-factory` : son registre et son observabilité ; et le socle `digit-ai-page-html` dans `digit-ai-forge-agents`, **lu seulement**.
- **quand** — 2026-09-21 de 15:25 à 15:35 CEST (UTC+02:00), durée ≈ 10 min, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrement `304db3e` ; oracles exécutés : `oracle-todo.mjs`, `observer-recidives.mjs` et les comparaisons git sur les deux dépôts.

## 2. Verdict en une ligne

La demande de fusion `iguane39/digit-ai-factory#1` est **mergée** : la branche ne porte plus **aucun** enregistrement non fusionné — 0 devant la branche principale, 173 derrière, puisque le dépôt a continué d'avancer. Le socle connaît sa **seconde collision de numéro en quatre jours** — le distant est lui aussi en 1.24.0 — et l'écart passe de **16 à 49** enregistrements ; vérifié, le distant porte désormais L32 (un même ensemble n'est énuméré qu'une fois par page), réimplémentée ailleurs, mais ni V19 (une seule largeur de contenu entre sections sœurs), ni V20 (une information qui lève un doute, invisible au repos), ni la correction de la recette de sommaire, ni le banc élargi** : les quatre enregistrements locaux portent donc encore du travail unique. Et l'alerte de dérive des retours récurrents — **+17 récidives, +9 classes, +21 retours de classe suspecte** entre le 11 et le 21 septembre — a été **effacée par mon propre rejeu**, qui a ajouté un point de mesure une minute après celui du relevé : les trois fichiers touchés sont **restaurés**, la référence revient au 11/09, l'alerte n'est pas consommée. Registre : **2** constats ouverts, `oracle-todo` PASS, **311** actifs.

## 3. Décisions attendues de l'humain

Aucune décision neuve n'est posée : les deux faits de ce tour relèvent d'arbitrages déjà posés ou d'un défaut que je viens seulement de consigner. Les deux arbitrages ouverts restent **D-16** — que fait-on d'un poste qui produit du socle et ne peut pas le publier — et **D-17** — le banc du socle est six fois plus long, garde-t-on ce prix. Ils vivent dans `output/04-plans/Digit-AI - Synthese Mandat - Banc elargi source unique et deux lignees fusionnees - 20260917a.md`, avec leurs options et leurs lignes de repli, et D-16 vient précisément de voir son risque se réaliser une seconde fois : les reposer ici les ferait paraître neuves alors qu'elles attendent depuis jeudi.

## 4. Traité — avec sa preuve

- **La demande de fusion est acceptée, et la branche est entièrement intégrée.**
  - preuve : l'événement reçu porte `{"outcome":"merged","pr":"iguane39/digit-ai-factory#1"}`, et `git log --oneline origin/main..HEAD` rend **0** enregistrement — tout ce qui a été produit en huit tours est dans la branche principale. Cette session s'est désabonnée automatiquement du suivi.
- **La seconde collision de numéro du socle est mesurée, et ce que chaque côté porte est vérifié un à un.**
  - preuve : le distant affiche `version: "1.24.0"`, le même numéro que la fusion enregistrée ici jeudi ; `git log HEAD..origin/main` rend **49** enregistrements contre 16 jeudi. Recherches jouées sur `origin/main` : L32 présente — 6 occurrences dans `check_html.py` —, `largeurs_melangees` (le contrôle de V19) **absente**, `doute_invisible` (le contrôle de V20) **absente**, `position: static` **toujours présent** dans la doctrine de sommaire, et **5** occurrences de `--widths 1440` dans son banc. Constat **TF-1092**, ouvert.
- **Une erreur de ma part ce matin — et la classe est nommée : un geste de diagnostic qui détruit la preuve qu'il cherchait.**
  - preuve : le relevé d'ouverture rendait `DÉRIVE (FAIL)` bloquante, delta **+17** récidives (112 → 129) entre le 11/09 et le point posé à 13:28:07. J'ai rejoué `node todo/observer-recidives.mjs` pour lire le détail : la sortie rend `PASS — aucune dérive entre les deux snapshots comparés`, parce que mon appel avait ajouté un **troisième** point à 13:29:05. Le verdict comparait donc deux relevés distants d'**une minute**.
- **La mécanique du défaut est établie dans le code, pas supposée.**
  - preuve : dans `todo/observer-recidives.mjs`, `jouer()` lance `observer.mjs` — qui **ajoute** un point au ledger — **avant** tout test ; le drapeau `--sans-derive` saute le calcul mais n'empêche pas l'écriture. Toute lecture est donc une écriture, et rien ne le signale à l'appelant.
- **L'alerte est rendue intacte, et la vérification le confirme.**
  - preuve : `git checkout` des trois fichiers touchés par mon rejeu — la vue des récidives, son état et le ledger. Le dernier point du ledger redevient **2026-09-11**, donc la prochaine surveillance mesurera bien la dérive réelle depuis cette date, et non depuis mon passage.
- **La vue des récidives est régénérée sans toucher au ledger, et c'est vérifié avant de le faire.**
  - preuve : `grep` sur `todo/generer-recidives.mjs` rend **0 occurrence** du ledger de points de mesure — le générateur de vue et l'observateur sont deux outils distincts. Après régénération, `git status` sur le dossier d'observabilité rend **0 fichier modifié**.
- **Registre tenu et travail publié.**
  - preuve : `oracle-todo` rend PASS, **311** actifs ; TF-1092 et TF-1093 ouverts en candidats. Enregistrement `304db3e` poussé sur `claude/html-quality-new-formats-qhfgvj`.

## 5. Non traité — avec son motif

- **La dérive des retours récurrents elle-même** — motif : gate de gouvernance, le relevé dit lui-même « décider en revue des classes (rien n'est appliqué automatiquement) » ; et je ne peux plus la lire sans la déplacer tant que le défaut consigné n'est pas corrigé.
- **La correction de l'outil de surveillance** — motif : hors mandat, aucun arbitrage n'a été demandé sur l'observabilité ; le remède tient en un vrai mode lecture seule ou un avertissement qui dise que l'appel a déplacé la référence.
- **La troisième fusion du socle** — motif : hors mandat, les mandats de jeudi sont clos ; refusionner 49 enregistrements engage la doctrine du socle et non son banc, et c'est ce que D-16 arbitre.
- **Les quatre enregistrements du socle** — motif : accès, inchangé — le dépôt reste hors de l'ensemble autorisé de cette session, et le relevé affiche « DIVERGÉ (4 devant, 49 derrière) ».
- **Le site de scellement non déclaré** — motif : hors mandat, ouvert au registre le 17/09 et inchangé.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| (rien — ce tour s'ouvre sur la fusion de la demande, sans instruction) | J'ai relevé l'état des deux dépôts et instruit les deux signaux de l'ouverture | Une alerte bloquante au relevé et une divergence qui triple ne s'ignorent pas, même sans mandat : les mesurer coûte dix minutes, les laisser coûte le prochain tour |
| (non dit) | J'ai rejoué la surveillance des récidives — et ce geste a effacé son alerte | **Erreur de ma part.** Je voulais lire le détail d'un FAIL ; l'outil écrit à chaque lecture, et rien ne le dit. Les fichiers sont restaurés et le défaut est consigné plutôt que tu |
| (non dit) | Je n'ai pas régénéré la vue des récidives avant d'avoir vérifié qu'elle ne touche pas au ledger | Après avoir abîmé une donnée d'observation par inadvertance, vérifier avant le second geste était le minimum |
| (non dit) | Je n'ai reposé ni D-16 ni D-17 | Elles attendent depuis jeudi sans avoir changé, et D-16 vient de voir son risque se réaliser une seconde fois — la réafficher ne la rendrait pas plus urgente qu'elle ne l'est déjà |

## 7. Risques

- **Le socle diverge au point que les quatre enregistrements locaux deviennent inutilisables.**
  - signal : un prochain relevé affiche une divergence encore plus grande, ou une règle locale réimplémentée ailleurs pour la seconde fois.
  - parade : la vérification de ce tour dit exactement ce que chaque côté porte, donc la fusion reste faisable ; c'est l'objet de D-16, et le constat neuf en chiffre l'aggravation.
- **Le défaut de la surveillance se reproduit chez quelqu'un qui ne s'en aperçoit pas.**
  - signal : une alerte de dérive disparaît entre deux sessions sans que personne n'ait rien décidé.
  - parade : le constat est ouvert avec la mécanique exacte et le remède ; en attendant, la vue des récidives se lit sans risque — c'est l'observateur qu'il faut éviter de rejouer.
- **L'alerte restaurée est consommée au prochain démarrage de session, sans être instruite.**
  - signal : le prochain relevé d'ouverture ne montre plus de dérive alors que rien n'a été décidé.
  - parade : le hook pose son propre point à chaque ouverture, donc la comparaison se fera du 11/09 au prochain démarrage — l'alerte survivra, mais son delta grossira ; c'est une raison de plus de l'instruire en revue.
- **La branche fusionnée continue d'être utilisée pour du travail de suite.**
  - signal : un enregistrement neuf s'empile sur une branche dont la demande est close.
  - parade : la règle est explicite — une demande fusionnée est finie, et tout travail de suite repart de la branche principale sous le même nom.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-46** | Répondre `D-16` et `D-17` par leur lettre — par exemple « D-16 a, D-17 b » | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `decision`, ouvrir un droit de publication engage la façon de travailler du parc. Fichier à lire d'abord : `todo/TODO.md`, entrée TF-1092, qui chiffre la récidive | D-16 a déjà vu son risque se réaliser deux fois ; sans réponse, il se réalisera une troisième |
| **A-47** | Publier les quatre enregistrements du socle depuis un poste autorisé | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `acces` — le relevé d'ouverture affiche « digit-ai-forge-agents … DIVERGÉ (4 devant, 49 derrière) », et la dernière tentative rendait `access denied by the git proxy`, erreur HTTP 403 | les deux contrôles de largeur et de doute, la correction de la recette de sommaire et le banc élargi ne vivent que sur cette machine, et l'écart triple de semaine en semaine |
| **A-51** | Instruire la dérive des retours récurrents en revue des classes | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, le relevé dit lui-même « décider en revue des classes (rien n'est appliqué automatiquement) ». Fichier à lire : `todo/RECIDIVES.md`, tableau des classes par récidives décroissantes | dix-sept récidives de plus restent sans lecture, et le delta grossira au prochain relevé |
| **A-52** | Donner à la surveillance des récidives un vrai mode lecture seule, ou lui faire dire qu'un appel déplace la référence | auto_ia | action `neuve`, **non exécutée** — motif : `hors_mandat`, l'observabilité n'a fait l'objet d'aucun arbitrage. Fichier : `todo/observer-recidives.mjs`, fonction `jouer()` | toute tentative de lire une alerte de dérive continue de l'effacer, et le prochain à le faire ne s'en apercevra peut-être pas |
| **A-53** | Fusionner les 49 enregistrements du socle et republier les apports locaux | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-16 ; la méthode est éprouvée — clone d'essai, banc joué avant application, valeur publiée qui l'emporte | la divergence continue de croître, et une troisième collision de numéro devient probable |
| **A-48** | Déclarer le site de scellement de forge-design à la table des empreintes | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `hors_mandat`, arrivé par la mise à jour du parc. Commande de vérification : `node oracles/oracle-empreintes.mjs` | la recette du pilot garde un oracle en défaut sur le parc réel |
| **A-38** | Décider le sort des candidats TF-1075 à TF-1093 encore en attente | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | les constats restent en attente, et le compteur de récidives les ignore |
| **A-39** | Tenir la revue datée : familles outillées, constats produits par les règles neuves, retours humains par famille | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude du 14/09 n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ces derniers jours étant des items de forge.

## 9. Traces

- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html` — 311 actifs ; TF-1092 et TF-1093 ouverts.
- `todo/observabilite/snapshots-recidives.jsonl` — restauré ; dernier point de mesure au 2026-09-11, l'alerte du relevé d'ouverture non consommée.
- `todo/observer-recidives.mjs`, fonction `jouer()` — l'endroit où l'écriture précède tout test, inchangé dans ce tour.
- `output/04-plans/Digit-AI - Synthese Mandat - Banc elargi source unique et deux lignees fusionnees - 20260917a.md` — la synthèse de jeudi, où vivent D-16 et D-17.
- Enregistrement `304db3e` sur `claude/html-quality-new-formats-qhfgvj`, poussé ; demande de fusion `iguane39/digit-ai-factory#1` **mergée**, suivi clos.
- **Aucune page HTML n'a été produite ni modifiée dans ce tour** : la question de la critique d'implémentation ne s'y pose pas, et les vingt-quatre pages de la bibliothèque restent sur le verdict de vendredi — critique **non jouée**, faute de mandat forge-design.
