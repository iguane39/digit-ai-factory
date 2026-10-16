---
destinataire: humain
---

# 32 todos sont clos, la boîte d'entrée est vide, et tout le travail attend votre mot pour être publié

## 0. Synthèse d'ouverture

Le mandat est rendu. Les 13 lots de retours arrivés en 3 jours sont entrés au registre, et 32
todos sont clos, chacun sur une preuve que j'ai rejouée moi-même après la campagne qui l'a corrigé.
La file passe de 45 à 43 todos ouverts alors que 30 y sont entrés pendant le mandat, presque tous
remontés par vos produits. Ce qui change pour vous : vos restitutions sont jugées sur 4 points de
plus, un rapport Power BI migré a désormais sa procédure et ses contrôles, et un lot remis ne peut
plus attendre 2 jours sans que personne le voie. Ce qui est attendu de vous : 2 réponses, sur la
mise en service des outils corrigés sur ce poste, et sur la publication des 5 dépôts.

## 1. En-tête d'identification

- **quoi** — mandat transverse « Traite les todos et retours », puis sa reprise sur votre
  « continue ».
- **sur quoi** — le pilot `digit-ai-factory` ; écritures chez `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-audit` et `digit-ai-forge-development`, sous le mandat
  permanent R-55 ; enregistrements locaux, aucun push.
- **quand** — le 17/09/2026 de 15h10 à 17h30, puis le 19/09/2026 de 16h30 à 17h45
  (Europe/Paris), durée 3 h 35.
- **qui** — session pilot Claude Fable 5.1 ; dépôt passé de `eb90ae0` à `28a9779` ; 11 agents de
  campagne délégués (9 Opus 5, 2 Sonnet 5), escalade de modèle : aucune.
- **intention** — vider ce qui attend et faire baisser la file des todos, sans qu'une correction
  en casse une autre. **Test rétro** : la boîte d'entrée est prouvée vide 2 fois ; la file baisse
  malgré 30 entrées ; la seule régression créée par ce mandat a été fermée dans ce mandat, avec le
  cas de banc qui l'aurait attrapée.

## 2. Verdict en une ligne

**32 todos clos sur preuve rejouée** · 13 lots ingérés, boîte d'entrée **PASS** · 30 demandes
entrées, 33 candidats décidés, 1 laissé à l'étude · file ouverte **43 contre 45** · 10 campagnes
rendues sur 11, la 11e reprise et finie par le pilot · recettes rejouées, toutes exit 0 : socle des
pages **406/406**, `quality-oracles` **301 contrôles**, `digit-ai-forge-data` **356 PASS**,
`digit-ai-forge-audit` **12/12 étapes**, `digit-ai-forge-development` **5/5 étapes**,
`oracle-synthese` **39/39**, `hook-restitution` **34/34**, boîte d'entrée **39/39** · harnais du
pilot **124/125**, le seul défaut étant celui que D-1 lève.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** :

- **la mise en service sur ce poste des outils corrigés de `digit-ai-forge-agents` est à l'arrêt** ;
  il faut votre réponse à D-1 ; sans elle, le poste exécute encore les versions d'avant, et les
  pages produites ici ne bénéficient d'aucune des 7 corrections du socle ;
- **la publication des 5 dépôts est à l'arrêt** ; il faut votre réponse à D-2 ; sans elle, 59
  enregistrements restent sur ce seul poste, et la correction des polices de
  `digit-ai-forge-audit` reste sans preuve sur Linux ;
- **3 écritures du pilot sont à l'arrêt** : le journal d'amélioration, l'index des références et le
  registre des comptes de cas ; il faut que l'autre session, qui tient ces fichiers modifiés depuis
  le 17/09, enregistre son travail ; d'ici là la procédure de migration Power BI n'est pas citée
  par le pilot, et ce mandat n'est pas au journal ;
- **la demande d'étude complémentaire sur les réseaux sociaux, TF-1178, est à l'arrêt** ; il faut
  qu'elle passe par une étude d'opportunité, son score dépassant le seuil ; d'ici là elle reste
  candidate, sans rien dégrader ;
- **les 9 todos dont la correction vit chez un produit sont à l'arrêt** (TF-0549, TF-0674, TF-0676,
  TF-0682, TF-1031, TF-1078, TF-1090, TF-1105, TF-1160) ; ils s'exécutent au prochain run ouvert
  chez chaque produit ; d'ici là ils restent ouverts, sans rien dégrader d'autre.

> **D-1 — Les outils corrigés de `digit-ai-forge-agents` remplacent-ils dès maintenant ceux qui s'exécutent sur ce poste ?**
> Les campagnes des 17 et 19/09 ont corrigé 4 outils : le socle des pages HTML
> `digit-ai-page-html`, le registre du skill `quality-oracles`, l'analyse de prompts
> `prompt-analyzer-l99` et le hook d'écriture `qo-gate-write.mjs`. Ces corrections vivent dans le
> dépôt `digit-ai-forge-agents`. Ce qui s'exécute sur ce poste est une copie installée sous votre
> profil, hors de tout dépôt, et elle date d'avant. Le contrôle `oracle-skills.mjs` comptait 7
> écarts le 17/09, dont une part précède ce mandat. La règle du pilot réserve cette recopie à
> votre mot.
>
> **Recommandation : (a).** Source consultée : `gabarits/AGENT-CAMPAGNE.md`, section « Gate de
> propagation des skills » — un écart né d'une campagne se règle dans la même session, sur décision
> humaine explicite, jamais reporté ; l'écart a déjà été payé 2 fois.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** le pilot recopie maintenant, par `node oracles/oracle-skills.mjs --appliquer` | simple × court — une commande, puis le contrôle se rejoue | exclut de garder sur ce poste les versions d'avant, y compris pour les sessions ouvertes en parallèle |
| **(b)** attendre la publication de `digit-ai-forge-agents`, la recopie se jouant seule à l'ouverture de session suivante | gratuit, mais dépend de D-2 | exclut que les pages produites d'ici là bénéficient des corrections |
| **(c)** ne rien décider | gratuit | exclut tout : le poste continue d'exécuter ce qui n'est plus versionné, et le harnais du pilot reste à 124/125 |

> **Si rien n'est décidé** : (c) s'applique — rien ne casse, les corrections restent sans effet sur
> ce poste.

> **D-2 — Le pilot publie-t-il les 5 dépôts, ou seulement la forge d'audit ?**
> Tout le travail du mandat est enregistré localement et rien n'est publié : 27 enregistrements
> chez `digit-ai-forge-agents`, 10 chez `digit-ai-forge-data`, 2 chez `digit-ai-forge-audit`, 1 chez
> `digit-ai-forge-development` et 19 au pilot `digit-ai-factory`. Une part de ceux de
> `digit-ai-forge-agents` précède ce mandat. La correction des polices de la fiche d'audit
> ne peut se prouver que sur le runner Linux hébergé, donc après publication de
> `digit-ai-forge-audit`. La publication du pilot passe par la porte des noms de clients, et son
> arbre porte le travail non enregistré d'une autre session.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md`, R-38 § 4-5 — le push se fait sur
> GO humain ; et le relevé `git rev-list --count @{u}..HEAD` joué ce jour dans les 5 dépôts. Les 4
> forges ont un arbre propre et des recettes vertes rejouées aujourd'hui ; le pilot, lui, n'est pas
> dans cet état.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** le pilot publie les 4 forges, après avoir joué la porte des noms sur chacune, par `git -C ../<forge> push origin main` ; le pilot `digit-ai-factory` attend que l'autre session ait enregistré | simple × court — 4 portes, 4 commandes, puis la lecture du job Linux de la forge d'audit | exclut de relire les 40 enregistrements des forges avant qu'ils circulent |
| **(b)** le pilot publie la seule `digit-ai-forge-audit`, par `git -C ../digit-ai-forge-audit push origin main` | simple × court — ferme TF-1020 si le job Linux est vert | exclut que les autres postes reçoivent les 38 autres enregistrements des forges |
| **(c)** ne rien publier | gratuit | exclut toute preuve sur Linux, et le travail de 3 jours reste sur ce seul poste |

> **Si rien n'est décidé** : (c) s'applique — rien ne se dégrade, mais le nombre d'enregistrements
> locaux monte à chaque tour.

## 4. Traité — avec sa preuve

- **La boîte d'entrée est vide, 2 fois : 13 lots accueillis et ingérés**, dont 10 arrivés sous un
  nom réel et pseudonymisés à l'accueil ; 18 demandes en sont sorties, 17 étant des récidives
  marquées.
  - preuve : `node oracles/oracle-boite-entree.mjs` est passé de FAIL sur 3 constats B1 à **PASS**,
    rejoué après le dernier lot ; `node todo/oracle-todo.mjs` exit 0.
- **33 candidats sont décidés sous votre mandat**, aucun n'atteignant le seuil d'étude.
  - preuve : `node todo/appliquer-export.mjs` a rendu 12, 6, 8 puis 7 « décidé(s) » sur les 4
    fichiers `todo/TF-decisions-20260917b.json` à `todo/TF-decisions-20260919b.json`.
- **Vos restitutions : 8 todos clos au pilot.** Une option qui vous demande un geste dit comment
  le faire (TF-1172, règle S49) ; le point d'étape a son juge et un relais d'avancement ne rejoue
  plus la synthèse entière (TF-1182) ; l'intention de la demande est exigée au bloc 1 (TF-0791) ;
  écrire « aucun autre chemin » ne suffit plus, les familles de chemins essayés font foi
  (TF-1189) ; le sceau d'une synthèse se pose sans geste humain (TF-1081) ; une synthèse renommée
  reste celle du tour (TF-1184, TF-1187) ; TF-1154 et TF-1168 étaient déjà faits, preuve rejouée.
  - preuve, rejouée : `node oracles/oracle-synthese.mjs --self-test` 39/39 contre 28 à
    l'ouverture ; `node oracles/hook-restitution.test.mjs` 34/34 contre 23 ;
    `gabarits/RESTITUTION.md` passé de 2.23.0 à 2.27.0, hérité par vos produits.
- **TF-1187 : une régression créée par ce mandat, fermée dans ce mandat.** Le correctif du 17/09
  faisait passer un fichier relu du disque devant la synthèse écrite dans le tour ; un produit l'a
  payé le soir même et l'a remonté le 18/09.
  - preuve : cas 30 du banc posé d'abord, **rouge**, puis **vert** après correction ; il ne dépend
    pas des dates. Classe : `restitution-fichier-juge-mal-choisi`.
- **L'outillage du pilot : 9 todos clos.** Le cliquet des recettes ne lit plus une date comme un
  compte de cas (TF-1169) ; la recopie d'héritage ne refuse plus à cause de sa propre sortie
  (TF-1171) ; le nommage daté juge un dossier livré, plus ses images (TF-1177) ; l'outil d'accueil
  refuse une option inconnue (TF-1181) ; le jeu de hooks actif se compare au jeu attendu à
  l'ouverture (TF-1047) ; la page de connexion servie est lue (TF-1088) ; les mots que vous
  proscrivez pour tous descendent par l'héritage (TF-1150) ; les 2 oracles de cadence se nomment
  l'un l'autre (TF-1136) ; le sas d'arrivée est compté à chaque ouverture (TF-1198).
  - preuve, rejouée : `node oracles/self-test.mjs` 84 PASS contre 81 ; `node
    oracles/oracle-boite-entree.mjs --self-test` 39/39 contre 35, les 4 cas du sas vérifiés rouges
    avant la règle ; `node scripts/recopier-heritage.test.mjs` 14 PASS contre 12 ; `node
    oracles/self-tests.mjs` 124/125.
- **Power BI, chez `digit-ai-forge-data` : 6 todos clos**, TF-1176, TF-1175, TF-1180, TF-1188,
  TF-1186 et TF-1190. Un rapport fourni en entrée garde sa mise en page ; son périmètre se prend à
  ce que ses visuels lisent ; un export déclaré réussi se chiffre ; la question « ce rapport peut-il
  remplacer l'original ? » a son contrat et son juge ; un chiffre que la cible recalcule n'est plus
  rangé en défaut. La procédure de migration est écrite en 11 étapes, chacune gardée par un
  contrôle qui existe.
  - preuve, rejouée : `node oracles/self-test.mjs` rend « 356 PASS, 0 FAIL » contre 273 à
    l'ouverture ; les 5 paires de fixtures rendent vert puis rouge ; la procédure réelle rend PASS
    à `oracles/oracle-enchainer.mjs`.
  - vérifié par le pilot : aucun nom de client n'est entré dans la forge.
- **Le socle des pages et les skills, chez `digit-ai-forge-agents` : 7 todos clos**, TF-1173,
  TF-1174, TF-1087, TF-0836, TF-1191, TF-1192 et TF-1185. Le socle nomme les 4 oracles de
  `digit-ai-forge-design` ; une page amputée de son texte est refusée ; un logo invisible à 90 %
  n'est plus sauvé par son accent ; le bandeau collant ne fausse plus la mesure d'un schéma ;
  l'infobulle tient l'échelle d'espacement ; le hook d'écriture n'accuse plus un gabarit de ce que
  son assemblage injecte ; une prémisse d'accès se mesure avant d'être dite invérifiable.
  - preuve, rejouée : recette du socle 406/406 contre 366, exit 0 ; `quality-oracles` 301 contrôles
    contre 289 ; banc du hook 50/50 contre 37 ; `oracle-tokens` de `digit-ai-forge-design` rend
    PASS sur la page témoin de l'infobulle.
- **TF-1042 et TF-1175, chez `digit-ai-forge-development` et `digit-ai-forge-audit`** : la parité
  entre la CI et l'image servie a son gate ; un OK d'audit sur un modèle Power BI ne se lit plus
  « livrable vérifié ».
  - preuve, rejouée : `uv run python -m conductor.recette_locale` 5/5 étapes ; `node
    tools/verifier.mjs` 12/12 étapes, exit 0.
- **11 constats du mandat sont entrés au registre**, TF-1181 à TF-1184 et TF-1193 à TF-1199, par 2
  fichiers de `input/01-candidatures/` ; 4 sont déjà clos.
  - preuve : `node todo/ingerer-lot.mjs` a rendu « 4 » puis « 7 candidature(s) ingérée(s) ».
- **Le travail est enregistré localement et les vues du registre sont régénérées.**
  - preuve : pilot à `28a9779`, 19 enregistrements d'avance ; les 5 générateurs de vues exit 0.

## 5. Non traité

- TF-1020, la police embarquée de la fiche d'audit : motif `dependance_bloc_3` — corrigée et verte
  ici, sa seule preuve qui compte est sur Linux, donc après D-2.
- La recopie des outils corrigés vers ce poste : motif `dependance_bloc_3` — D-1.
- TF-1170 et TF-1179, leur part au pilot : motif `borne_atteinte` — la part forge est faite ; il
  reste à créer une famille de gabarits pour le mode d'emploi d'un dossier livré, à instruire avec
  TF-1029, et à citer la procédure de migration dans l'index des références.
- Le journal `BOUCLE-AMELIORATION.md`, l'index des références et `oracles/baseline-recettes.json` :
  motif `garde_fou` — ces fichiers portent le travail non enregistré d'une autre session.
- TF-1178 reste candidat : motif `garde_fou` — il demande une étude, son score dépasse le seuil.
- Les 9 todos dont la correction vit chez un produit : motif `garde_fou` — le pilot n'écrit chez un
  produit que sur run demandé.
- Les 6 constats neufs décidés, TF-1193 à TF-1197 et TF-1199, et les 25 todos en cours plus
  anciens : motif `borne_atteinte` — chaque vague en fait entrer de nouveaux ; ils partent à la
  prochaine campagne, aucun n'est bloqué.

## 6. Écarts à la lettre

- **Vous avez demandé** « traite les todos et retours ». **J'ai fait** : tous les retours, 2 fois,
  et 32 todos clos sur 75 passés par la file. **Pourquoi** : les retours sont bornés, les todos ne
  le sont pas — 30 sont entrés pendant le mandat.
- **Une correction de ce mandat a créé une régression** chez un produit, TF-1187. Elle est fermée ;
  la campagne d'origine avait prouvé son correctif sur le cas visé, pas sur sa coexistence avec un
  fichier écrit dans le tour.
- **Un outil a été lancé avec une option inexistante** le 17/09 : `--help` sur
  `todo/accueillir-lot.mjs`, qui a exécuté l'accueil réel. Le geste était le bon, pas voulu à cet
  instant ; l'outil refuse désormais, TF-1181.
- **Des heures ont été écrites 3 fois sans relever l'horloge**, et corrigées à chaque fois avant
  l'affichage final ; celles de ce document sont relevées.
- **Une commande d'édition a laissé le shell interpréter des accents graves** le 17/09 : des
  fragments de prose ont été tentés comme commandes, tous ont échoué sans rien écrire.
- **Une campagne du pilot s'est arrêtée sur un blocage technique** après 6 enregistrements ; j'ai
  vérifié puis enregistré ce qu'elle avait écrit, et relancé le reste.

## 7. Risques

- **Une autre session tient des fichiers du pilot modifiés depuis 2 jours.**
  - signal : `git status` liste `CLAUDE.md`, `REGLES-PROJET.md`, l'index des références et une
    trentaine de fichiers indexés que ce mandat n'a pas écrits.
  - parade : enregistrements par chemins nommés ; 3 écritures attendent qu'elle enregistre.
- **Le modèle Power BI déjà livré chez le produit échouera la règle neuve sur les décisions.**
  - signal : un FAIL M7 au prochain passage d'`oracle-modeliser` chez ce produit.
  - parade : c'est l'effet voulu ; le lot de travaux le dira au produit à son prochain run.
- **11 règles neuves entrent en 3 jours, et l'une accuse 94,6 % des synthèses antérieures.**
  - signal : un avertissement S51 à chaque relecture d'une synthèse d'avant le 17/09.
  - parade : elle est entrée avertissante ; les 10 autres ont un taux d'accusation mesuré entre
    0 % et 2 %, et le corpus antérieur ne se réécrit pas.
- **117 espacements hors échelle subsistent dans les canevas de schémas.**
  - signal : toute page dérivée de ces canevas échoue la règle T3 d'`oracle-tokens`.
  - parade : compté et entré au registre, TF-1193, décidé.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Recopier les outils corrigés vers ce poste, puis rejouer `node oracles/oracle-skills.mjs` | `auto_ia` | TF-1173 | `dependance_bloc_3` — D-1 | le poste exécute ce qui n'est plus versionné |
| **A-2** | Jouer la porte des noms sur chaque forge, publier, puis lire le job `oracles (ubuntu-latest)` de `digit-ai-forge-audit` et clore TF-1020 | `auto_ia` | TF-1020 | `dependance_bloc_3` — D-2 | 40 enregistrements restent sur ce poste, et la police reste sans preuve sur Linux |
| **A-3** | Lancer la prochaine campagne sur les 6 constats neufs et les todos en cours, par dépôt : `digit-ai-forge-agents` (TF-1193, TF-1194, TF-1197), `digit-ai-forge-data` (TF-1195, TF-1196), pilot (TF-1199, TF-1170) | `auto_ia` | TF-1193 | `borne_atteinte` — le mandat s'arrête sur une file stable, chaque vague en faisant entrer de nouveaux | la file cesse de baisser |
| **A-4** | Journaliser le mandat dans `BOUCLE-AMELIORATION.md`, citer la procédure de migration dans l'index et enregistrer les comptes de cas | `auto_ia` | TF-1179 | `garde_fou` — ces 3 fichiers portent le travail non enregistré d'une autre session | le journal narratif ne dit rien de ce mandat |
| **A-5** | Déposer chez le produit concerné le lot de travaux qui annonce les règles neuves sur les modèles et les rapports migrés | `auto_ia` | TF-1170 | `garde_fou` — le dépôt chez un produit exige un mandat déclaré sur ce produit | le produit découvre les règles par un FAIL |
| **A-6** | Répondre à D-1 et à D-2 | `manuelle_utilisateur` | TF-1020 | `decision` — la recopie sous votre profil et la publication d'un dépôt restent votre mot (R-38) ; répondre par exemple `1a, 2a` | les corrections restent sans effet sur ce poste et hors des autres |

## 9. Traces

- Fichier jugé : ce document — `oracle-synthese` PASS.
- Points d'étape du mandat : `Digit-AI - Synthese Mandat - Boite d entree videe et cinq campagnes
  lancees - 20260917k.md` et `Digit-AI - Synthese Mandat - Todos et retours 23 clos et troisieme
  vague - 20260919a.md`, dans `output/04-plans/`.
- `todo/TODO.jsonl` — 15 ingestions, 30 créations dont 1 d'une autre session, 33 décisions,
  32 clôtures ; 43 ouverts, 371 clos ; vues régénérées.
- `input/00-retours/` — 13 lots ; `input/01-candidatures/` — 2 fichiers de constats.
- Enregistrements locaux, tous non poussés. Pilot : `be80825`, `d72b814`, `ea3cd8f`, `12a84da`,
  `614f884`, `26d1db9`, `7919607`, `cb1df57`, `ba2f4f3`, `83c5c2f`, `284ae63`, `c66b7a4`, `104f535`,
  `1ad860c`, `6bc355c`, `02e07bd`, `0150305`, `057f065`, `28a9779`.
- `digit-ai-forge-agents` : `ba75fd5`, `f93cfaf`, `832306e`, `3ac04c9`, `fc764c0`, `50b994e`,
  `d0668db`, `50e9f0c`. `digit-ai-forge-data` : `0a8d7c9`, `acbdc84`, `4fafdb7`, `337896a`,
  `6dbe8de`, `b96699d`, `5c4ab97`, `a3e6e18`. `digit-ai-forge-audit` : `726a7b0`, `620cfb7`.
  `digit-ai-forge-development` : `69fad77`.
