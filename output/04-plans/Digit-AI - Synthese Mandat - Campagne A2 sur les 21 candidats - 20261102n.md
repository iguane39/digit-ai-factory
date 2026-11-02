---
destinataire: humain
---

# Synthèse Mandat — 21 candidats instruits, 14 corrigés et publiés, 6 décisions pour vous (02/11/2026)

## 0. Synthèse d'ouverture

Sur les 21 candidats, 14 sont corrigés et publiés, et 6 vous reviennent en décisions, une ligne suffit pour les trancher. Le plus visible : le contrôle de mutation d'une forge échouait à chaque envoi depuis le 05/09 sans que personne le lise, il est vert. Une page qui affiche une autre version que sa source peut désormais être refusée, et le contrôle de livraison ne juge plus une session sur la ligne d'une autre. Une correction reste partielle : une recette rouge peut encore passer inaperçue plusieurs jours, d'où la dernière décision. Le remplacement de la consigne page HTML sur vos 2 comptes attend toujours votre geste.

## 1. En-tête d'identification

Exécution de votre réponse « A2 » du 02/11/2026 à l'action A-2 de la synthèse 20261102k, sur le pilot `digit-ai-factory`, forge-agents, forge-design, forge-tests et forge-development. Période : 02/11/2026 de 11:36 à 13:08, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, 6 agents de campagne Sonnet 5.5 et 2 relecteurs d'intention.

Intention de la demande : vider la file des candidats sans vous laisser ce qui s'exécute seul, et ne vous poser que ce qui vous revient.

Test rétro : le résultat sert cette intention. Chaque candidat a une issue écrite au registre, et les 6 décisions sont affichées en entier.

## 2. Verdict

14 clos, 1 construit en partie et à décider, 4 à décider, 1 en attente de sa revue du 02/02/2027, 1 porté par une autre session. Mesuré sur : `todo/TODO.jsonl`, relue à 13:06, périmètre 21 éléments. Les 5 dépôts sont publiés, 0 commit d'écart.

## 3. Décisions attendues

Pour répondre, une ligne suffit, par exemple : « 130a, 131a, 132a, 133a, 134c, 135a », qui suit mes recommandations.

> **D-130 — Faut-il grouper le bloc 4 d'une restitution quand il dépasse 5 puces ? (TF-2055)**
>
> - **De quoi s'agit-il** : le bloc « Traité » des restitutions que vous lisez à chaque fin de tour.
> - **Le problème** : 99 synthèses sur 141 dépassent 5 puces à ce bloc, avec 7 en médiane et jusqu'à 36 : rien ne les regroupe ni ne les classe. L'effet d'un regroupement sur votre lecture n'est pas mesuré.
> - **Pourquoi vous** : le format des restitutions est votre outil de reprise entre sessions, et le toucher est une décision de doctrine.
> - **Recommandation : (a)** — l'effet sur la lecture n'est pas mesuré, et un avertissement sur 70 % des synthèses serait du bruit. Source consultée : note output/03-etudes, Essai des regles i-have-adhd contre nos regles d ecriture, 20261102g ; gabarits/RESTITUTION.md.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Consigne au gabarit, sans contrôle | Au-delà de 5 puces, le bloc se groupe par sujet et se classe par effet, sans rien retirer ; on observe si la lecture s'améliore avant de contrôler | Simple × court | Possible |
| (b) Consigne et avertissement | La consigne, et un contrôle qui avertit au-delà de 5 puces non groupées ; 99 synthèses sur 141 auraient averti | Moyen × une demi-journée | Possible |
| (c) Ne rien faire | Le bloc reste une liste plate, que vous pouvez juger utile telle quelle | Nul | Sans objet |

> **Sans réponse** : (c), ne rien faire.

> **D-131 — Faut-il contrôler qu'un gain écrit à la clôture d'un item vient d'une sortie du tour ? (TF-2056)**
>
> - **De quoi s'agit-il** : le champ du registre qui dit le gain obtenu quand un item est clos, et le contrôle de fin de tour.
> - **Le problème** : le 02/11, une clôture a annoncé 813 fichiers et 4 accusés sans sortie à l'appui ; la mesure rejouée donne 1 209 et 5. Le contrôle du registre a rendu PASS, et le chiffre a été publié. Le contrôle des chiffres de fin de tour lit la restitution, pas ce champ. Trouvé par un relevé fait à la main, sans règle.
> - **Pourquoi vous** : la règle de clôture d'un item est une décision de doctrine, comme D-118 ; et un gain peut légitimement citer une mesure d'un tour précédent, ce qui fera de faux signalements.
> - **Recommandation : (a)** — la consigne seule n'aurait rien changé le 02/11 : le chiffre a été écrit sans que rien ne demande de le rejouer. Source consultée : registre TF-2056 et correction de TF-1971 du 02/11/2026 ; règle S90 de gabarits/RESTITUTION.md.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Avertissement au hook de fin de tour | Un chiffre d'un gain écrit dans le tour, absent des sorties du tour, s'affiche en avertissement ; bruit à mesurer sur les clôtures passées avant la mise en service | Moyen × une demi-journée | Possible |
| (b) Consigne à la clôture, sans contrôle | `references/TODO-FORGE.md` demande de rejouer la mesure avant de l'écrire ; rien ne le vérifie | Simple × court | Possible |
| (c) Ne rien faire | Un chiffre de clôture faux reste possible et invisible ; 1 cas mesuré à ce jour | Nul | Sans objet |

> **Sans réponse** : (c), ne rien faire.

> **D-132 — Faut-il un contrôle qui exige une source pour un avis, une rareté ou un chiffre de vente affichés sur une page servie ? (TF-2050)**
>
> - **De quoi s'agit-il** : les faits commerciaux d'une page servie : nombre d'avis, citation de client, rareté, volume de ventes, prix barré, allégation de santé.
> - **Le problème** : une page améliorée par un agent peut inventer ces faits, et rien ne le voit : une vidéo tierce du 02/11 montre 2 modèles qui les ajoutent à un site fictif. Dans les 7 forges mesurées, le code ne juge ni les données d'avis, ni le prix barré, ni les témoignages ; la règle existe seulement sous la forme d'un bandeau de maquette.
> - **Pourquoi vous** : le contrôle impose à chaque produit de déclarer ses sources de faits commerciaux, ce qui change son contrat de livraison, et un produit peut légitimement afficher un avis réel.
> - **Recommandation : (a)** — aucun cas réel n'est mesuré chez un produit : l'avertissement donne cette mesure sans imposer un contrat à tous ; l'obligation reste possible si des cas apparaissent. Source consultée : registre TF-2050 ; recherche du 02/11/2026 dans le code de 7 forges ; vidéo tierce du 02/11/2026, étude 20261102b de output/03-etudes.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Contrôle avertissant, sans déclaration du produit | Un oracle repère sur la page servie les formes d'un fait commercial (données d'avis, prix barré, rareté) et les liste au rapport, à faire confirmer ; aucune obligation nouvelle pour le produit | Moyen × 1 jour | Possible |
| (b) Contrôle de provenance, avec déclaration du produit | Le produit déclare la source de chaque fait commercial ; un fait affiché sans source fait échouer la recette | Complexe × 2 à 3 jours, plus une reprise chez chaque produit | Possible |
| (c) Ne rien faire | La règle reste jouée par le seul bandeau de maquette ; aucun cas réel chez un produit n'est mesuré à ce jour | Nul | Sans objet |

> **Sans réponse** : (c), ne rien faire.

> **D-133 — Faut-il qu'une passe d'amélioration d'une page soit jugée sur ce qu'elle ajoute, avec le droit de ne rien changer ? (TF-2051)**
>
> - **De quoi s'agit-il** : les outils qui améliorent une page en plusieurs passes : la boucle bornée et la critique de design.
> - **Le problème** : forcés à changer un site à chaque tour, les modèles d'une vidéo tierce passent de 438 à 20 898 lignes et cassent des sections ; 74,5 % des lignes finales arrivent après le tour où l'auteur se serait arrêté. Chiffres rapportés par la vidéo, non rejoués ici. Nos outils bornent le nombre d'essais, mais aucun critère ne compare 2 passes sur ce qu'elles ajoutent.
> - **Pourquoi vous** : la loi n° 3 propose d'office la surface implicite, ce qui pousse vers l'ajout ; récompenser le retrait doit s'articuler avec elle, et c'est de la doctrine.
> - **Recommandation : (a)** — la phrase seule ne mesure rien, et un critère comparant 2 passes reste sans effet sur une page qu'on ne repasse pas. Source consultée : lois transverses de CLAUDE.md, loi n° 3 : « L'oubli n'existe pas » ; étude 20261102b de output/03-etudes ; registre TF-2051.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Critère d'arbitre et droit de ne rien changer | La boucle compare 2 passes et note ce que l'ajout apporte ; répondre qu'il n'y a rien à changer devient une sortie valide, sans toucher à la loi n° 3 : ce qui manque se propose toujours une fois | Moyen × 1 jour | Possible |
| (b) Droit de ne rien changer, sans critère | Une phrase dans la boucle et dans la critique autorise cette sortie ; rien ne mesure l'inflation | Simple × court | Possible |
| (c) Ne rien faire | La boucle reste bornée en essais et pas en volume ; aucun cas réel chez un produit n'est mesuré à ce jour | Nul | Sans objet |

> **Sans réponse** : (c), ne rien faire.

> **D-134 — Faut-il écrire qu'un écart connu, noté en commentaire de code, se lève ou s'inscrit au carnet ? (TF-2058)**
>
> - **De quoi s'agit-il** : la règle du dépôt qui dit quand un écart reconnu reste acceptable pour un produit ; elle parle du carnet des écarts déclarés, et pas des commentaires de code.
> - **Le problème** : un produit a noté en commentaire que sa page affichait une ancienne version, sans lever de défaut : l'écart a survécu à 4 étiquettes. La règle ne dit rien de ce cas, et aucun contrôle ne peut lire l'intention d'un commentaire.
> - **Pourquoi vous** : une règle de plus est une décision de doctrine, et celle-ci resterait sans contrôle.
> - **Recommandation : (c)** — 1 seul cas, déjà couvert par le contrôle construit ce jour ; une règle sans contrôle n'aurait pas arrêté cette session. Source consultée : REGLES-PROJET.md, sections AG et AH ; retour de Produit-84 du 30/10/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ajouter 1 alinéa à la règle, sans contrôle | Un écart noté en commentaire n'est pas assumé : il se lève ou s'inscrit au carnet ; le respect dépend de la relecture | Simple × court | Possible |
| (b) Écrire la consigne dans le contrat d'agent seulement | Les agents la lisent, pas les sessions de produit qui écrivent le commentaire | Simple × court | Possible |
| (c) *(recommandée)* Ne rien écrire | Le contrôle de valeur affichée construit ce jour voit ce cas précis quand le produit déclare sa version ; les autres écarts notés en commentaire restent possibles | Nul | Sans objet |

> **Sans réponse** : (c), ne rien écrire.

> **D-135 — Comment rejouer les recettes des outils qui consomment un skill, puisque l'ouverture ne les rejoue jamais ? (TF-2048)**
>
> - **De quoi s'agit-il** : les recettes des forges qui utilisent un skill partagé, comme celle de forge-design, rejouées quand ce skill change.
> - **Le problème** : une règle neuve du socle a laissé la recette de forge-design rouge 12 jours, sans que personne le voie. La trace construite ce jour ne se remplit que sur une propagation mesurée ; or l'ouverture propage sans rejouer : 44 des 56 minutes de propagation relevées depuis le 20/09 n'ont aucune commande manuelle, attribuées à l'ouverture par inférence. Comptes rapportés par l'agent, non recomptés.
> - **Pourquoi vous** : tout rejouer à l'ouverture ajouterait jusqu'à 20 minutes selon l'en-tête du script, et VS Code coupe l'ouverture à 60 s : c'est un arbitrage entre durée et couverture.
> - **Recommandation : (a)** — seul (a) couvre le cas des 12 jours sans allonger l'ouverture ; le workflow (b) a déjà prouvé qu'on peut l'ignorer des semaines. Source consultée : registre TF-2048 ; mesure du 02/11/2026 sur 1 117 transcriptions et 2 journaux de propagation ; en-tête d'oracles/consommateurs-skills.mjs.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Rejeu hebdomadaire en arrière-plan | Une fois par semaine, l'ouverture lance le rejeu sans attendre son résultat ; un rouge s'affiche à l'ouverture suivante, avec 7 jours de retard au plus | Moyen × une demi-journée, plus 20 minutes de machine par semaine au plus | Possible |
| (b) Workflow dans chaque forge consommatrice | La recette tourne à chaque envoi sur GitHub ; mais le workflow de forge-development a échoué 12 fois sur 12 relevées depuis le 05/09 sans que personne le lise : il faudrait aussi relever ces échecs | Moyen × 1 jour | Possible |
| (c) En rester à la trace d'aujourd'hui | Un rouge ne se voit qu'après une propagation mesurée, soit 12 minutes sur 56 de celles relevées | Nul | Sans objet |

> **Sans réponse** : (c), en rester à la trace d'aujourd'hui.

## 4. Traité

Chaque chiffre de recette ci-dessous a été rejoué par moi après intégration, sauf mention « rapporté ».

**Pilot**

- **Nommage des études** (TF-2028, 6e066f97) : l'oracle de conformité accepte la forme de la règle de nommage et garde les noms datés anciens. Self-test 197/197. Rapporté : 134 FAIL sur le pilot avant, 112 après ; le registre en citait 63, écart non expliqué.
- **Appel d'offres en PDF** (TF-2032, 7a45708f) : `references/RUN-AO.md` décrit les 2 voies réelles, et aucun skill ne rend un PDF sur trame. Correction de prose, sans contrôle possible.
- **Question à la forge design** (TF-2044, 6632f9ba) : « un texte affiché change-t-il de sens ou de source ? » ; `verifier-carte-forges` 19/19, `mobiliser.test` 18/18. La question est posée, pas imposée.
- **Dossier de cadrage de reprise** (TF-2047, 32ff43a3) : famille `gd-cadrage-reprise` au catalogue ; `oracle-gabarits-documents --self-test` 63/63. Aucun cadrage réel écrit dessus.
- **Lecture git** (TF-2034, 39868250) : `git stash list` et `git tag -l` ne font plus prendre un tour pour un tour d'écriture ; recettes 26/26 et 62/62.
- **Livrable à la racine d'output** (TF-2041, a6f0e617) : avertissement à l'écriture, y compris sur un clone en retard ; self-test sans défaut. Lecture retenue : la mécanisation suspendue par D-15 vise un autre oracle, et un revert de ce seul commit suffit si vous lisez autrement.
- **Verrou « livré » par session** (TF-2045, fde721a8) : chaque ligne de mobilisation porte sa session ; `oracle-synthese --self-test` 291/291. Le gabarit passe en 2.57.0 et l'héritage en 1.46.0, et `hooks-factory.test` rend 30/30.
- **Trace des recettes rouges** (TF-2048, 03a92c65) : construite, recette 27/27 et ouverture 54/54 ; couverture partielle, d'où D-135.

**Forges**

- **Porte du pre-push** (TF-2027, forge-agents 64fc375) : le hook demande au distant ce qu'il porte. Recette 73/73. Hook reposé sur le pilot et les 13 forges, car l'installation d'ouverture ne le repose pas ; un envoi réel du pilot est passé dessus. La cause exacte du refus du 29/10 reste non établie.
- **Fixture du juge** (TF-2033, e059a33) : la rouge devient déterministe, et le juge réel est déclaré non probant. Rapporté : 10 passes réelles donnent 10 PASS, cette rouge n'était donc pas un défaut que le juge attrape. Recette de quality-oracles 564 contrôles.
- **Formulaire PDF** (TF-2042, 54bb9c7) : un IBAN tassé ou décalé est refusé, règles F9 et P6 ; self-test 67/67, `digit-ai-pdf` en 1.1.0.
- **Valeur affichée contre sa source** (TF-2043, forge-design 964633f) : oracle neuf, sur déclaration du produit, remonté au registre 2.50.0 ; self-test 62 oracles. Aucun produit n'a encore de déclaration.
- **Banc RLS par l'API** (TF-2046, forge-tests 2d784a7) : une table appelée depuis un dossier de tests compte comme exercée ; `pytest` de ce pan vert, registre de dette à jour, lint vert sous ruff 0.16.1. Rapporté : 1 588 tests. Le cas réel du produit n'est pas rejoué.
- **Gate Supabase** (TF-2049, forge-development 618489e) : un `package.json` illisible rend SKIP, plus PASS ; `pytest` 520 verts et 1 sauté.
- **Job de mutation** (TF-2052, dac1654) : `gh run list` rend `success` sur dac1654. Rapporté : 653 mutants jugés contre 0, score 85,76 %.

**Registre**

- 5 classes créées, référentiel en version 1.58.0 ; `oracle-todo` PASS après chaque écriture. TF-2053 reste ouvert jusqu'à sa revue du 02/02/2027 : son back-test a donné 5 accords sur 14, le gain n'est pas constaté.
- Publication : le pilot sous son GO permanent (D-54 (b) du 03/10), les 4 forges sous le leur (D-53 (b) du 03/10) ; `git rev-list` rend 0 commit d'écart sur chacune après envoi.

Relecture d'intention : sert, gravité mineure, 2 écarts, verdict consigné sous RI-20261102-11 ; la consigne de campagne a été relue avant le lancement, RI-20261102-09.

## 5. Non traité

- TF-2054, l'essai de Cloudflare, et TF-2057, né de cet essai — motif : `hors_mandat`, une autre session du pilot les porte et j'aurais fait son travail en double.
- La relecture de chaque livrable à sa réception et la relecture de cohérence des 6 lots — motif : `hors_mandat`, j'ai remplacé ces 2 passes par le rejeu des recettes et la relecture de fin de tour.
- Les restes des lots, ouverts en candidats TF-2059 et TF-2060 — motif : `hors_mandat`, ils ne figuraient pas dans les 21.
- Le remplacement de la consigne page HTML sur vos 2 comptes (TF-1991) — motif : `acces`, voir A-2.

## 6. Écarts à la lettre

- Vous avez demandé de traiter 21 candidats → j'en ai ouvert 3 de plus (TF-2058 à TF-2060) → ce sont des restes mesurés pendant le travail, qui se seraient perdus dans les rapports d'agents.
- Vous avez demandé de corriger TF-2048 → le code est publié, mais je le laisse ouvert → la mesure montre que le cas d'origine n'est pas couvert.
- Vous n'aviez rien demandé sur le hook de publication des forges → je l'ai reposé sur 13 dépôts → sans cela, la correction de TF-2027 n'agissait nulle part.

## 7. Risques

- **Verrou « livré » plus strict chez les produits** : une session reprise sous un nouvel identifiant, sans ligne propre, est refusée quand elle déclare une livraison.
  - Signal : un refus pour trace de mobilisation absente, dans une session qui a mobilisé avant sa reprise.
  - Parade : `mobiliser` se rejoue dans la session ; si le cas revient, le repli de ce contrôle est à élargir.
- **Déclaration de tables exercées sans preuve** : un produit peut déclarer une table sans qu'aucun test ne soit lu ; c'est publié au rapport comme non jugé.
  - Signal : la ligne `non_juge` du pan supabase.
  - Parade : TF-2060.
- **Le pilot reste rouge à son propre oracle de conformité** : 115 constats FAIL relevés à 13:06, dont l'indice 20261028a porté par 3 études.
  - Signal : `node oracles/oracle-conformite-projet.mjs .`
  - Parade : non traitée ici ; la règle de nommage interdit de renommer les fichiers historiques.
- **Docker Desktop reste démarré** : un agent l'a lancé à 11:43 pour jouer la mutation, ce qui a relevé 3 conteneurs d'autres projets ; 2 autres sessions l'ont utilisé depuis, donc je ne l'arrête pas.
  - Signal : `docker ps`.
  - Parade : le quitter quand ces sessions auront fini.

## 8. Prochaines actions

Ordre : vos réponses d'abord, car la construction en dépend.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Trancher les 6 décisions, pour que je construise ce que vous retenez | TF-2055, TF-2056, TF-2050, TF-2051, TF-2058, TF-2048 | manuelle_utilisateur | `decision` : doctrine ou arbitrage | répondre en une ligne, par exemple « 130a, 131a, 132a, 133a, 134c, 135a » | si rien n'est fait, chaque décision prend son option (c), et une recette rouge reste invisible |
| A-2 | Remplacer la consigne page HTML sur vos 2 comptes, pour que les sessions hors dépôt lisent les bonnes polices | TF-1991 | manuelle_utilisateur | `acces` : API de la plateforme https://api.anthropic.com/v1/skills HTTP 401 et https://claude.ai/api/skills HTTP 403 ; identité de la session sans clé ; aucune identité de service ; script du dépôt `sync-skills.mjs` 0 mention du compte | suivre le guide de la synthèse 20261102k | si rien n'est fait, un brief écrit hors du dépôt peut reprendre Roboto et DM Sans |
| A-3 | Corriger les restes de cette campagne, gates muets et tables supabase-js non reconnues | TF-2059, TF-2060 | auto_ia | `hors_mandat` : ouverts ce jour, hors des 21 | instruire et traiter ces candidats par R-58 | si rien n'est fait, un produit en supabase-js reste à couverture nulle |

## 9. Traces

- Registre : `todo/TODO.jsonl`, `todo/CLASSES.json`, `decisions/REGISTRE.jsonl`.
- Pilot : commits 6e066f97, 7a45708f, 6632f9ba, 32ff43a3, 39868250, a6f0e617, fde721a8, 03a92c65, 78862a55, 33cf70c5, 1501b858.
- Forges : forge-agents e059a33, 64fc375, 54bb9c7, 670bfff ; forge-design 964633f, b249b62 ; forge-tests 2d784a7 ; forge-development 618489e, dac1654.
- Consigne de campagne : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\2071e2c2-a550-4861-af6a-8b64f7aafe28\scratchpad\campagne-sujets.md`.
- Flotte : `todo/observabilite/flotte-campagnes.jsonl`, étiquette `campagne-a2`.
