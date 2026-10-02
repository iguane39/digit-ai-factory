---
destinataire: humain
---

# Synthèse Mandat — la recette hébergée du pilot repasse au vert, les 2 lots du jour attendent une décision, la campagne sur les candidatures attend la fin du rejeu (01/10/2026)

## 0. Synthèse d'ouverture

Votre demande portait sur l'ensemble du registre, soit 29 items décidés ou en cours et 193 candidatures, et sur les retours. J'ai traité ce qui pouvait l'être sans vous ce soir. Le circuit de recette hébergée du pilot n'attendait plus que votre feu vert, mais sa simulation était repassée au rouge. Elle est de nouveau verte, après 2 correctifs non enregistrés. Les 2 lots de retours du jour, 5 retours au total, sont refusés à la porte, faute de la section « Documents mûrs », et seule votre décision peut les faire entrer. Je n'ai pas lancé la campagne sur les candidatures : un rejeu de 38 exécutions tourne en ce moment sur votre quota, dans une autre session. 3 décisions vous attendent.

## 1. En-tête d'identification

- **quoi** — traitement du registre et des retours : accueil des lots, tri des 29 items décidés ou en cours, correction de ce qui bloquait l'un d'eux, préparation des décisions.
- **sur quoi** — le pilot `digit-ai-factory` : le sas `input/00-retours/_arrivee/`, le registre `todo/TODO.jsonl`, `scripts/rebatir-clone.mjs`, `todo/generer-page.mjs` et sa recette ; lecture seule dans `digit-ai-forge-agents`, `Produit-12` et `Produit-02.com` ; un clone jetable sous `C:\rjp` et les sorties de simulation sous `C:\rjs`.
- **quand** — 2026-10-01 22:08 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début vers 21:15, heure de la première commande du tour ; durée mesurée 53 min.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; pilot à `e73c96e1` à l'ouverture, `f82270f2` à la fin (3 commits de l'autre session pendant le tour) ; aucun sous-agent ; escalade de modèle : aucune ; oracles joués : `oracle-boite-entree`, `ingerer-lot` (porte des lots), `oracle-lot-retours --murs`, `simuler-recette-hebergee`, `check_html`, `todo/self-test.mjs`, `oracle-todo`, `oracle-synthese`.
- **intention** — que le registre et la boîte d'entrée avancent sans que rien d'important vous échappe, et que vous n'ayez à trancher que ce qui vous revient. **Test rétro** : servie en partie. Ce qui ne dépendait que du pilot est fait et mesuré. Le reste est bloqué par une décision qui vous revient, par un produit sans mandat ou par le rejeu en cours, et chaque blocage est nommé au bloc 5. Traiter les 193 candidatures ce soir en aurait servi la lettre, pas l'intention.

## 2. Verdict en une ligne

**La recette hébergée du pilot repasse du rouge (3 défauts) au vert (0) sur un clone portant 2 correctifs ; 2 lots refusés à la porte au titre de R-57 (remontée des documents mûrs) ; 0 candidature décidée sans vous ; registre PASS avant et après.**

## 3. Décisions attendues de l'humain

Inventaire des bloquants — ce qui est bloqué, ce qui le lève, et ce qui se passe sinon :

- les 5 retours des 2 lots du jour : votre décision sur la dérogation, sinon ils restent dans la boîte ;
- l'activation du circuit de recette hébergée : votre feu vert de publication, sinon le pilot reste publié sans recette ;
- la campagne sur les candidatures, et 7 items en cours qui écrivent là où l'autre session enregistre : votre décision et la fin du rejeu, sinon elles restent à la revue hebdomadaire ;
- 20 items décidés ou en cours : 8 attendent un run ouvert chez leur produit, 1 la rotation d'identifiants publiés à la console de chaque fournisseur, 6 un arbitrage, 3 les décisions d'une mission, 2 une date de mesure (15/10 et 02/10) ; sans cela, ils restent ouverts sans régresser.

3 décisions neuves vous attendent, numérotées D-49 à D-51. Chacune se lit ainsi : la question, le rappel du sujet, la recommandation et sa source, puis le tableau des options. La colonne Coût s'exprime en complexité × durée ; la colonne Exclusions dit ce que l'option laisse de côté. L'option (c) est le repli, appliqué si rien n'est décidé. Celles posées plus tôt aujourd'hui restent ouvertes et inchangées.

> **D-49 — Faut-il faire entrer au registre, par une dérogation tracée, les 2 lots de retours du jour refusés pour absence de la section « Documents mûrs » ?**
>
> Le lot de Produit-12 porte 4 retours, dont le défaut de raisonnement sur les dates de bail ; le lot de Produit-02 en porte 1 : un réglage Google Ads laissé 3 jours à l'humain alors qu'un accès automatisé existait. La porte les refuse en bloc, registre intact : ils sont datés du 01/10, et la règle des documents mûrs vaut pour tout lot daté du 29/09 ou après.
>
> **Avantages** : 5 retours majeurs entrent dès ce soir, dont 3 classes à créer ; la mesure manquante est faite : 0 document mûr chez Produit-12, 1 chez Produit-02 (« Dossier Plan de campagnes Google Ads », 5 versions).
> **Inconvénients** : la dérogation ne fait pas déclarer ce document par son produit ; il reste à déclarer dans le prochain lot de Produit-02.
> **Impacts** : pilot seul : 2 ingestions, chacune avec son motif de dérogation et votre décision ; aucune écriture chez les produits.
>
> **Recommandation : (a).** Source consultée : la sortie de `todo/ingerer-lot.mjs` sur les 2 lots, la section des documents mûrs de `REGLES-PROJET.md` et `node gabarits/oracle-lot-retours.mjs --murs` joué chez les 2 produits, le 01/10/2026 à 21:30. Le canal prévu pour ce cas est la dérogation tracée, et le seul document mûr est déjà nommé.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Ingérer les 2 lots par `--derogation`, avec la mesure en motif ; noter le document de Produit-02 à déclarer dans son prochain lot | simple × court | aucune |
| **(b)** Renvoyer chaque lot à son produit pour qu'il le complète, au prochain run ouvert chez lui | moyen × long | les 5 retours restent hors du registre jusqu'à ces runs |
| **(c)** Laisser les 2 lots en attente dans la boîte | nul | la boîte d'entrée les dénoncera à chaque ouverture, au-delà de 24 heures |

> **Si rien n'est décidé** : (c) Laisser les 2 lots en attente dans la boîte.

> **D-50 — Faut-il enregistrer les 2 correctifs puis activer et publier le circuit de recette hébergée du pilot, maintenant que sa simulation rend vert ?**
>
> Le pilot est publié sans aucune recette rejouée à la publication. Le circuit est écrit et inactif depuis le 15/09, et vous avez fixé son activation comme geste humain. La simulation, rejouée ce soir, rendait rouge : 3 défauts nés de 2 causes neuves.
>
> **Avantages** : le pilot cesse d'être le seul dépôt du parc à publier sans recette ; la simulation du circuit rend 0 défaut sur un clone frais portant les 2 correctifs ; les 2 correctifs ont chacun leur contrôle rouge puis vert.
> **Inconvénients** : chaque recette réécrit `oracles/baseline-recettes.json` dans le clone : effet sans conséquence relevé par la simulation, jamais vérifié sur le serveur d'intégration ; le système Linux du serveur n'est pas simulé.
> **Impacts** : pilot : 1 commit pour les correctifs, 1 déplacement de `ci/hebergee/recette-pilot.yml` vers `.github/workflows/`, puis une publication ; aucune autre forge touchée.
>
> **Recommandation : (a).** Source consultée : `C:\rjs\out\verdict.json` (vert, 0 défaut) et `C:\rjs\verdict.json` (rouge, 3 défauts), produits le 01/10/2026 entre 21:58 et 22:06. Le circuit n'a plus de défaut connu, et une recette jouée à chaque publication attrape plus tôt ce que cette simulation vient d'attraper.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Enregistrer les correctifs, déplacer le circuit dans `.github/workflows/` et publier | simple × court | aucune |
| **(b)** Enregistrer les correctifs en local seulement, sans activer ni publier | simple × court | le pilot reste publié sans recette rejouée |
| **(c)** Laisser les correctifs non enregistrés | nul | une autre session peut les écraser ; la simulation repasse au rouge sur tout clone frais |

> **Si rien n'est décidé** : (c) Laisser les correctifs non enregistrés.

> **D-51 — Faut-il lancer, une fois le rejeu terminé, la campagne qui trie les 193 candidatures en attente et met en œuvre celles qui ne vous reviennent pas ?**
>
> Sur les 193 candidatures en attente, 189 n'ont pas de fiche de décision : la revue hebdomadaire ne peut en présenter aucune. 146 datent de septembre. 71 visent le pilot seul ; les autres visent surtout forge-agents, page-html et forge-audit.
>
> **Avantages** : chaque candidature reçoit sa fiche et son tri ; celles qui ne vous reviennent pas sont mises en œuvre et closes, comme la règle de tri le prévoit ; la revue hebdomadaire ne vous présente plus que les vraies décisions.
> **Inconvénients** : plusieurs sessions de travail, avec des sous-agents en parallèle, donc une consommation de quota non mesurée ; lancée pendant le rejeu, elle pourrait couper des exécutions du banc.
> **Impacts** : pilot et forges : écriture directe, qui leur est permise en permanence ; produits : rien sans un run demandé chez eux.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl` lu le 01/10/2026 à 21:25 (193 candidatures, 4 fiches présentes) et le processus du rejeu vu actif à 21:19. Attendre la fin du rejeu protège une mesure que vous avez payée ; la campagne fera ensuite ce que la revue seule mettrait des mois à absorber, au rythme de 7 par semaine.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Campagne de tri et d'exécution, ouverte après la fin du rejeu | complexe × long | aucune |
| **(b)** Fiches seulement, pour alimenter la revue hebdomadaire, sans exécution | moyen × moyen | rien n'est mis en œuvre hors de la revue |
| **(c)** Laisser les candidatures à la revue hebdomadaire | nul | 189 candidatures restent sans fiche, donc invisibles de la revue |

> **Si rien n'est décidé** : (c) Laisser les candidatures à la revue hebdomadaire.

## 4. Traité — avec sa preuve

- **Le sas d'arrivée vidé** : 2 lots, avec leur sidecar, pseudonymisés et déplacés à la racine suivie.
  - preuve : `node todo/accueillir-lot.mjs` → « 4 lot(s) accueilli(s), 0 refusé(s) ». L'autre session les a enregistrés à `df604d02`.
- **La porte des lots jouée, et la mesure qui manquait faite** : les 2 lots sont refusés au titre de R-57. Les documents mûrs ont été mesurés en lecture seule chez les 2 produits.
  - preuve : `node todo/ingerer-lot.mjs` → « [REJET ATOMIQUE] … registre intact » pour chaque lot ; `oracle-lot-retours.mjs --murs` → 0 chez Produit-12, 1 chez Produit-02.
- **Correctif 1, contrôle rouge → vert** : `scripts/rebatir-clone.mjs` prenait l'arbre principal pour une arborescence liée quand son chemin s'écrit sous la forme courte de Windows. L'arbre principal est maintenant la première entrée de la liste de git (TF-1562, classe `controle-vrai-sur-le-mauvais-invariant`).
  - preuve : `node scripts/rebatir-clone.test.mjs` → 6 PASS, 1 FAIL avant ; 7 PASS, 0 FAIL après.
- **Correctif 2, contrôle rouge → vert** : la vue générée du registre échouait à `check_html` (règle L1, texte tronqué) sur une empreinte abrégée écrite au registre. Le générateur marque maintenant une empreinte abrégée, jamais une phrase. Le cas a été ajouté à la recette, dans les 2 sens.
  - preuve : `check_html` sur la vue générée du registre → FAIL avant, PASS après ; `todo/self-test.mjs` → 57/1 avant, 58/0 après ; `todo/generer-page.test.mjs` → 5 PASS, et 4 PASS 1 FAIL sans le correctif.
- **La simulation du circuit hébergé rejouée** (TF-1018) :
  - preuve : `node scripts/simuler-recette-hebergee.mjs` → « verdict ROUGE — 3 défaut(s) » sur `f82270f2`, puis « verdict VERT » sur le clone jetable portant les 2 correctifs.
- **Le registre tenu à jour** : TF-1562 créée, décidée par la règle de tri et close avec sa descente ; une note ajoutée à TF-1018 ; les vues régénérées.
  - preuve : `node todo/journaliser.mjs` → « 4 événement(s) journalisé(s) », verdict PASS avant et après.

## 5. Non traité — avec son motif

- Les 193 candidatures — motif : `decision`, leur ampleur et le rejeu en cours font de leur campagne votre choix (D-51).
- Les 2 lots de retours, 5 retours — motif : `decision`, la dérogation exige votre mot (D-49).
- TF-0549, TF-0674, TF-0676, TF-0682, TF-1031, TF-1078, TF-1159 et TF-1160 — motif : `hors_mandat`, leur reste se joue chez un produit, et aucun mandat produit n'est déclaré dans cette session.
- TF-1090 — motif : `decision`, la rotation des identifiants publiés se fait à la console de chaque fournisseur.
- TF-1307, puis TF-1281 qui en dépend — motif : `decision`, c'est une fusion de 2 lignées du socle des pages, dont la publication attend votre feu vert.
- TF-0963, TF-1360, TF-1432, puis TF-1430 qui en dépend — motif : `decision`, chacun attend un arbitrage déjà nommé à son item.
- TF-1234, TF-1236 et TF-1237 — motif : `dependance_externe`, ils attendent les 4 décisions de la mission ouverte chez la plateforme le 20/09.
- TF-1070 et TF-1418 — motif : `dependance_externe`, leur mesure est datée : revue du 15/10 pour le premier, rejeu des scripts de l'étude le 02/10 pour le second.
- TF-1559 — motif : `hors_mandat`, l'autre session le mène en ce moment.
- TF-1262, TF-1551, TF-1023, TF-1364, TF-1319, TF-1323 et TF-1255 — motif : `dependance_externe`, ils écrivent dans le juge de fin de tour, les bancs ou les forges, sur l'arbre où l'autre session enregistre en ce moment ; ils entrent dans la campagne de D-51.

## 6. Écarts à la lettre

- **Vous avez écrit** « traite tous les todos » → **j'ai traité 1 item, TF-1018, et trié les 28 autres** → **pourquoi** : le reste attend un produit, une décision ou la fin du rejeu, et décider pour vous irait contre la règle de tri du 01/10.
- **Vous avez écrit** « et retours » → **les 2 lots n'entrent pas ce soir** → **pourquoi** : la porte les refuse, et la seule voie qui les ferait entrer sans leur produit est une dérogation, qui vous revient.
- **Vous avez répondu** « continue », sans choisir parmi mes 3 questions → **j'ai pris l'option prudente de chacune** → **pourquoi** : aucune de ces options n'engage de dépense ni de publication, et aucune ne décide à votre place.

## 7. Risques

- L'autre session enregistre ou écrase les 3 fichiers corrigés ;
  - signal : `git status` ne montre plus `scripts/rebatir-clone.mjs` ni `todo/generer-page.mjs` modifiés, sans commit de ma part ;
  - parade : D-50, qui les enregistre ; le patch est aussi conservé sous `C:\rjs\patch.diff`.
- Les 2 lots dépassent 24 heures dans la boîte ;
  - signal : la règle B8 d'`oracle-boite-entree` passe en défaut à l'ouverture ;
  - parade : D-49.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord ; elles suivent vos réponses au bloc 3.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter les options retenues pour D-49, D-50 et D-51, puis consigner chaque sélecteur reçu au registre par `todo/journaliser.mjs` | `auto_ia` | neuve | `dependance_bloc_3` — suit D-49 à D-51 | (c) s'applique à chacune |
| **A-2** | Retirer le clone jetable `C:\rjp` et les sorties `C:\rjs` une fois D-50 tranchée | `auto_ia` | neuve | `dependance_bloc_3` — le patch y est conservé jusque-là | 2 dossiers restent sur le poste |
| **A-3** | Trancher D-49 à D-51 — répondre par exemple « D-49 a, D-50 a, D-51 a » | `manuelle_utilisateur` | neuve | `decision` — choisir ce qui se fait vous revient | (c) s'applique à chacune |

## 9. Traces

- Registre : `todo/TODO.jsonl`, 4 événements (TF-1562 : création, décision, clôture ; TF-1018 : note), non enregistrés.
- Correctifs non enregistrés : `scripts/rebatir-clone.mjs`, `todo/generer-page.mjs`, `todo/generer-page.test.mjs` ; patch : `C:\rjs\patch.diff`.
- Simulations : `C:\rjs\verdict.json` (rouge), `C:\rjs\out\verdict.json` (vert).
- Lots : `input/00-retours/Produit-12 - RETOURS - 20261001a.md` et `Produit-02 - RETOURS - 20261001a.md`, avec leur sidecar.
- Aucun commit, aucune publication. Aucune page HTML livrée dans ce tour : la vue du registre est régénérée, jugée par `check_html` (PASS).
