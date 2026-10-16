---
destinataire: humain
---

# Synthèse de mandat — votre « 2a » est exécuté : les 4 améliorations sont décidées, 3 sont livrées et closes, la surveillance hebdomadaire lit maintenant la descente, le stock, le silence des sources et les contrôles sans appelant ; il vous reste une décision sur l'émission des retours (17/09/2026)

Votre décision est exécutée : les 4 améliorations de l'étude sont passées en décidé, 3 sont construites, éprouvées et closes au registre, et la quatrième vous est reposée ici comme elle le demandait. Ce que cela change pour vous : le tableau de bord des récidives dit désormais quel produit ouvrir en premier, et la surveillance hebdomadaire regarde les 4 endroits où l'étude avait mesuré le retard. Le premier passage, joué à la demande, montre 13 produits en retard de plus de 7 jours sur 14, dont 2 à 34 jours. Il signale aussi une dérive qui existait avant ce tour : 70 récidives et 22 classes de plus depuis le 11 septembre. Rien n'est écrit chez un produit, rien n'est supprimé, rien n'est enregistré ni publié. Ce qui est attendu de vous : trancher la décision sur l'émission des retours, et donner ou non le feu vert d'enregistrement.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 2a », c'est-à-dire l'option (a) de la décision sur les 4 candidatures de l'étude « revue hebdomadaire de l'existant » : passage en décidé, mise en œuvre au pilot, recettes, premier passage exercé, clôtures.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; forge-observability lue et appelée, jamais écrite ; aucun produit ouvert.
- **quand** — 2026-09-17 09:55 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 09:39 ; durée mesurée ≈ 15 min, dont 5 min de recette complète du pilot.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : 3 recettes ciblées, la recette complète du pilot, `oracle-todo` *(juge du registre)* et `oracle-synthese` sur ce document.
- **intention** — que la boucle d'amélioration tourne plus vite et vous demande moins de gestes, sans vous retirer une décision réservée. Test rétro : les sondes ne vous demandent rien tant qu'elles sont vertes, et la vue par produit cible le seul geste qui reste le vôtre, ouvrir une session chez un produit. L'intention n'est pas encore servie sur un point : aucune descente n'a progressé aujourd'hui, elle est seulement devenue visible.

## 2. Verdict en une ligne

**TF-1163, TF-1164 et TF-1165 décidés, livrés et clos avec leur descente ; TF-1166 décidé, en cours, reposé en D-3 ; recettes ciblées 9/9, 5/5 et 4/4 PASS ; recette complète du pilot 123 oracles sur 124, le seul échec étant l'oracle des skills installés sur le parc réel, antérieur à ce tour ; premier passage du plan étendu exercé, snapshot n° 5 écrit, dérive FAIL sur 4 compteurs antérieurs (récidives 112 → 182, classes 65 → 87) ; `oracle-todo` PASS ; aucun enregistrement git, aucun push.**

## 3. Décisions attendues de l'humain

Bloquants — un travail est à l'arrêt, et voici ce qui le lève :

- **ce qui est bloqué** : le câblage de l'émission des retours chez les produits, dernière des 4 améliorations ; **ce qu'il faut décider** : jusqu'où la machine oblige un produit à dire ce qu'il remonte, en répondant par le sélecteur ci-dessous ; **si rien n'est fourni** : le pilot mesure le silence des sources chaque semaine, mais rien ne change chez les produits, et 21 sources restent muettes depuis plus de 7 jours.

> **D-3 — Jusqu'où oblige-t-on un produit à dire ce qu'il remonte à la factory ?**
>
> Le 30 août, la mesure avait établi que le canal par lequel un produit remonte ses retours n'a ni déclencheur ni transport, et que seuls l'obligation d'émettre et le transport s'automatisent : le contenu d'un retour reste un jugement de l'agent du produit. La décision posée alors est restée sans exécution. Depuis, le silence médian des sources est passé de 8 à 11 jours. Deux pièces sont possibles. La première agit chez le produit, à la fin d'un tour de travail : la restitution doit dire soit « rien à remonter », soit quel lot a été remis. Elle joue quand la session est déjà ouverte, donc sans geste de plus pour vous. La seconde agit au pilot, à l'ouverture : une ligne nomme les sources muettes depuis plus de 7 jours. Elle vous informe, mais vous laisse le geste d'ouvrir le produit.
>
> **Recommandation : (a).** Source consultée : la synthèse du 30/08 sur le juste milieu du canal de remontée (`output\04-plans\`, indice `20260830k`), qui cite la loi transverse n° 3 du noyau, « l'oubli n'existe pas » : aujourd'hui, ne rien remonter et n'avoir rien à remonter sont indiscernables ; l'annexe de mesure du 17/09, section 6 ; la section 7 du tableau de bord généré aujourd'hui (21 sources muettes). La première pièce est la seule qui n'ajoute aucun geste humain.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** les 2 pièces : la déclaration en fin de tour chez le produit, entrée en avertissement avant de se durcir, et la ligne des sources muettes à l'ouverture du pilot | effort moyen × moyen ; touche le juge des restitutions et le gabarit hérité, donc descend chez les produits à leur prochaine ouverture | exclut un canal qui reste muet sans que personne le sache |
| **(b)** la seule ligne des sources muettes à l'ouverture du pilot | effort simple × court, tout au pilot | exclut toute obligation chez le produit : le silence est vu, pas réduit |
| **(c)** ne rien câbler | effort nul | exclut tout changement : la mesure hebdomadaire existe, et c'est tout |

> **Si rien n'est décidé** : l'option (c) s'applique — TF-1166 reste en cours au registre, avec sa mesure.

## 4. Traité — avec sa preuve

- **Votre « 2a » a reçu son geste : les 4 candidatures sont décidées.**
  - preuve : `node todo/appliquer-export.mjs todo/TF-decisions-20260917a.json` → « [OK] export appliqué — 4 décidé(s), 4 commenté(s) (empreinte 5341472b8c33) ».
- **La surveillance hebdomadaire lit 4 grandeurs de plus** (TF-1163) : couples produit × classe non atteints, items ouverts de plus de 7 jours, stock d'items décidés non clos, sources muettes ; et une sonde de plus compte les contrôles sans appelant. Même cadence, même porteur, même signal. Le tableau de bord gagne la section du stock, avec les candidatures émises contre tranchées sur 4 semaines, et celle du silence des sources.
  - preuve : `node todo/generer-recidives.test.mjs` → « 9 PASS, 0 FAIL », dont un couple de cas qui ne diffère que par l'état des sources (7 jours de retard : nommé, non proposé ; 16 jours : proposé) et un cas où l'absence de mesure rend `null`, jamais 0 ; `node todo/observer-recidives.test.mjs` → « 4 PASS, 0 FAIL ».
- **Le premier passage est exercé à la demande**, comme l'exige la règle de non-répétition sur les travaux planifiés : un mécanisme qui n'a jamais tourné n'est pas déclaré en place.
  - preuve : `node todo/observer-recidives.mjs` → snapshot n° 5 écrit ; valeurs lues : 88 couples non atteints, 13 produits en retard, 12 items ouverts de plus de 7 jours, 49 items décidés non clos, 21 sources muettes, 4 contrôles sans appelant ; la sonde neuve est rendue « apparue », sans blocage.
- **Le tableau de bord dit quel produit ouvrir en premier** (TF-1164) : une ligne par produit, triée par retard, avec les classes en retard datées ; la relance par lot de travaux est proposée, jamais jouée.
  - preuve : `todo\RECIDIVES.md` section 5, régénérée → 14 produits, 13 en retard de plus de 7 jours, 2 à 34 jours, 1 entièrement atteint ; total 88, identique au compte manuel de l'étude.
- **Les 4 contrôles sans appelant sont instruits, aucun n'est retiré** (TF-1165). Celui qui n'était cité nulle part contrôle qu'un jeu de livrables est complet ; sa clôture du 28/08 le destinait aux produits, qui ne pouvaient pas le connaître. Il est maintenant cité à la règle qui le concerne, avec son mode d'appel. Deux autres sont des outils de l'étape de mise en production, joués chez le produit. Le dernier, qui juge ce qu'un push peut emporter, reste sans appelant : le câbler touche l'installeur de hooks de la forge des outils.
  - preuve : `node scripts/relever-appelants.mjs` → « 55 contrôle(s), 4 sans appelant exécutable », les 4 « cité en doctrine seulement » (1 « cité nulle part » avant) ; `node scripts/relever-appelants.test.mjs` → « 5 PASS, 0 FAIL » ; citation ajoutée dans `references\REGLES-DE-NON-REPETITION.md`, à la règle N-8 (un jeu de livrables est complet, ou la passe le dit).
- **3 items clos avec leur descente, le quatrième en cours.**
  - preuve : `node todo/journaliser.mjs` → « 7 événement(s) journalisé(s) », verdict du registre PASS avant et après ; `node todo/oracle-todo.mjs` → `"verdict": "PASS"` ; vues régénérées → « TODO.md générée — 384 actifs ».
- **Rien d'autre n'est cassé.**
  - preuve : `node oracles/self-tests.mjs` → 123 oracles sur 124 au vert en 5 min ; le cliquet des recettes a pris « 4 → 5 cas » et « 5 → 9 cas » ; l'échec restant est l'oracle des skills installés sur le parc réel, dont le remède affiché est une décision humaine déjà ouverte, et que le relevé d'ouverture de ce matin annonçait.

## 5. Non traité — avec son motif

- Le câblage de l'émission des retours (TF-1166) — motif : dépendance à une décision humaine (D-3).
- Le câblage du contrôle d'avant-push à un hook git — motif : hors mandat ; l'installeur des hooks vit dans la forge des outils, où le pilot n'écrit pas sans mandat. Consigné au reste à faire de TF-1165.
- Le dépôt de lots de travaux chez les 13 produits en retard — motif : bloqué par un garde-fou ; l'étude et la candidature font de la relance une proposition, jamais un geste d'office.
- L'instruction de la dérive signalée par le premier passage (70 récidives et 22 classes de plus depuis le 11/09) — motif : hors mandat ; c'est l'objet de la revue des classes, bornée à une par quinzaine, et non de ce tour.
- L'enregistrement local et le push — motif : dépendance à une décision humaine ; le push d'un dépôt est un GO humain.

## 6. Écarts à la lettre

- **Vous avez écrit** « 2a » → **j'ai décidé et mis en œuvre** les 4 → **écart** : TF-1166 n'est pas clos, parce que son contenu est de vous reposer une décision, ce que D-3 fait.
- **La candidature TF-1163 demandait** 4 sondes → **le plan lit 6 compteurs de plus et 1 sonde de plus** → **pourquoi** : le stock se lit en 2 nombres (candidats, décidés non clos) et la descente en 2 (couples, produits) ; seuls 4 portent un seuil, les 2 autres sont lus sans alerte.
- **La candidature TF-1163 demandait** des seuils à régler après 2 passages → **j'ai posé** une tolérance de 10 sur le stock d'items décidés non clos, et 0 ailleurs → **pourquoi** : ce stock bouge de plusieurs unités par jour, un seuil à 0 sonnerait à chaque passage.
- **La candidature TF-1165 demandait** de câbler ou de proposer au retrait chacun des 4 contrôles → **aucun n'est proposé au retrait** → **pourquoi** : les 4 ont un usage prescrit ; le relevé d'usage chez les produits n'a pas été fait, et n'est plus nécessaire faute de retrait.

## 7. Risques

- La dérive reste rouge à chaque ouverture et cesse d'être lue, parce que les compteurs de récidives montent chaque semaine par construction ;
  - signal : le relevé d'ouverture affiche la même dérive 2 semaines de suite sans revue des classes ;
  - parade : la revue des classes par quinzaine est le lieu prévu ; si elle ne suffit pas, les seuils à 0 des compteurs antérieurs sont à régler, ce que la candidature des sondes prévoit après 2 passages.
- La section par produit nomme des produits que vous ne rouvrirez pas, et les affiche en retard indéfiniment ;
  - signal : un produit en tête de liste depuis plus de 30 jours ;
  - parade : acceptation déclarée ; la vue dit qu'elle nomme sans condamner, et un produit abandonné se déclare hors périmètre par le geste existant.
- Les fichiers du tour, non enregistrés, sont emportés par l'enregistrement d'une autre session qui travaille dans le pilot en ce moment ;
  - signal : un enregistrement d'une autre session contenant le générateur du tableau de bord ou le plan de sondes ;
  - parade : acceptation déclarée ; A-2 enregistre les seuls chemins de ce tour sur votre demande.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-3 avant celle qui attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent, et enfin le geste qui fait baisser le compteur de descente.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Câbler l'émission des retours selon l'option choisie en D-3, recettes dans les 2 sens, puis clore TF-1166 | auto_ia | `dependance_bloc_3` — attend D-3 ; à défaut, le silence des sources est mesuré mais pas réduit | moyen × moyen |
| A-2 | Enregistrer localement les chemins de ce tour et des 2 tours précédents par `git commit --only -- <chemins>`, puis pousser si vous le demandez (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, les 3 clôtures vivent dans un arbre de travail non enregistré | simple × court |
| A-3 | Trancher D-3 — répondre « D-3 (a) », « D-3 (b) » ou « D-3 (c) » ; le câblage est joué par l'IA (neuve) | manuelle_utilisateur | `decision` — l'obligation faite aux produits change leur gabarit hérité ; sinon : TF-1166 reste en cours | simple × court |
| A-4 | Donner le feu vert d'enregistrement — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — le push d'un dépôt est un GO humain ; sinon : rien n'est enregistré | simple × court |
| A-5 | Ouvrir une session chez les 2 produits en tête de la section 5 du tableau de bord `todo\RECIDIVES.md`, en retard de 34 jours ; preuve de clôture : leur ligne passe à 0 classe en retard à la génération suivante (neuve) | manuelle_utilisateur | `presence` — l'ouverture d'une session chez un produit est votre geste, trace mesurée : la recopie de l'héritage ne se joue qu'à l'ouverture du produit, et le relevé du 16/09 rend 12 et 11 classes non atteintes chez eux ; sinon : 23 des 88 couples restent non atteints | simple × court |

## 9. Traces

- Code : `todo\generer-recidives.mjs` et sa recette ; `scripts\relever-appelants.mjs` et sa recette ; `todo\observabilite\plan-recidives.json` ; snapshot n° 5 dans `todo\observabilite\snapshots-recidives.jsonl`.
- Doctrine : `BOUCLE-AMELIORATION.md`, paragraphe « Plan étendu le 17/09/2026 » ; `references\REGLES-DE-NON-REPETITION.md`, règle du jeu de livrables complet.
- Registre : `todo\TF-decisions-20260917a.json` ; `todo\TODO.jsonl`, items TF-1163 à TF-1166 ; vue `todo\RECIDIVES.md`, sections 5 à 7.
- Étude d'origine : `output\03-etudes\20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.md`.
- Oracles : recettes ciblées (PASS) ; recette complète du pilot (123 sur 124, échec antérieur) ; `oracle-todo` (PASS) ; `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour ; la page du registre a été régénérée par son générateur, comme à chaque écriture, et n'est pas un livrable.
