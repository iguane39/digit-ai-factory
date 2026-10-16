---
destinataire: humain
---

# 28 todos sont clos, la boîte d'entrée est de nouveau vide, et une campagne travaille encore

## 0. Synthèse d'ouverture

Depuis votre « continue », la seconde vague est sondée et close, et les 6 lots arrivés entre-temps
sont entrés au registre. 28 todos sont clos depuis le début du mandat, chacun sur une preuve que
j'ai rejouée moi-même. L'un d'eux corrige une régression que ce mandat avait lui-même créée il y a
2 jours, et qu'un produit a remontée hier. Une campagne travaille encore sur 3 demandes,
et son résultat n'est pas encore mesurable. Ce qui est attendu de vous : une réponse sur le
moment où les outils corrigés remplacent ceux de ce poste, et un feu vert pour publier la forge
d'audit.

## 1. En-tête d'identification

- **quoi** — **point d'étape** du mandat transverse « Traite les todos et retours », repris sur
  votre « continue ».
- **sur quoi** — le pilot `digit-ai-factory` ; campagnes rendues chez `digit-ai-forge-data`
  et au pilot ; campagne en cours chez `digit-ai-forge-agents`.
- **quand** — le 19/09/2026, de 16h30 à 17h20 (Europe/Paris) pour cette reprise ; le mandat s'est
  ouvert le 17/09/2026 à 15h10, et sa première partie a duré 2 h 20.
- **qui** — session pilot Claude Fable 5.1 ; dépôt passé de `eb90ae0` à `0150305` ; 11 agents de
  campagne délégués depuis l'ouverture (9 Opus 5, 2 Sonnet 5), escalade de modèle : aucune.
- **intention** — vider ce qui attend et faire baisser la file des todos, sans qu'une correction
  en casse une autre. **Test rétro** : la boîte d'entrée est vide une seconde fois ; la file est à
  40 todos ouverts contre 45 à l'ouverture alors que 23 y sont entrés, et la régression créée par ce
  mandat est fermée dans ce mandat.

## 2. Ce qui reste à mesurer, et par quoi

Restent à mesurer les corrections de la campagne en cours, sur 3 todos : le pilot rejouera `python
.claude/skills/digit-ai-page-html/scripts/self_test.py` chez `digit-ai-forge-agents` avant toute
clôture.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** :

- **la mise en service sur ce poste des outils corrigés de `digit-ai-forge-agents` est à l'arrêt** ;
  il faut votre réponse à D-1 ; sans elle, le poste exécute encore les versions d'avant ;
- **la preuve sur Linux de la correction des polices de `digit-ai-forge-audit` est à l'arrêt** ; il
  faut votre feu vert de publication de ce dépôt, que le pilot exécutera ; sans lui, la correction
  reste prouvée sur ce seul poste et TF-1020 reste ouvert ;
- **la clôture des 3 todos confiés à la campagne en cours est à l'arrêt** ; rien n'est à fournir,
  son rapport réveille le pilot ; si elle ne rend pas, le pilot reprend son chantier, comme il
  vient de le faire pour la seconde vague ;
- **l'indexation au pilot de la procédure de migration Power BI est à l'arrêt** ; il faut que
  l'autre session enregistre son travail sur l'index des références, qu'elle tient modifié depuis
  le 17/09 ; d'ici là la procédure existe chez `digit-ai-forge-data` sans être citée par le pilot ;
- **l'enregistrement du registre des comptes de cas des recettes est à l'arrêt**, pour la même
  raison ; d'ici là les comptes montés vivent sur le disque, et le cliquet les lit quand même ;
- **la mise à jour de la phrase des règles de projet sur le moment où un sceau (l'empreinte qui fige un livrable jugé) se pose est à
  l'arrêt** ; il faut que l'autre session enregistre son travail sur ce fichier ; d'ici là la
  règle écrite dit « au premier passage » quand l'outil scelle à chaque passage ;
- **la demande d'étude complémentaire sur les réseaux sociaux, TF-1178, est à l'arrêt** ; il faut
  qu'elle passe par une étude d'opportunité avant toute décision, son score dépassant le seuil ;
  d'ici là elle reste candidate, sans rien dégrader ;
- **les 9 todos dont la correction vit chez un produit sont à l'arrêt** (TF-0549, TF-0674, TF-0676,
  TF-0682, TF-1031, TF-1078, TF-1090, TF-1105, TF-1160) ; ils s'exécutent au prochain run ouvert
  chez chaque produit ; d'ici là ils restent ouverts, sans rien dégrader d'autre.

> **D-1 — Les outils corrigés de `digit-ai-forge-agents` remplacent-ils dès maintenant ceux qui s'exécutent sur ce poste ?**
> Les campagnes du 17/09 ont corrigé le socle des pages HTML `digit-ai-page-html`, le registre du
> skill `quality-oracles` et le hook d'écriture `qo-gate-write.mjs`, et une campagne y travaille
> encore aujourd'hui. Ces corrections vivent dans le dépôt `digit-ai-forge-agents`. Ce qui
> s'exécute sur ce poste est une copie installée sous votre profil, hors de tout dépôt, et elle
> date d'avant. Le contrôle `oracle-skills.mjs` compte 7 écarts entre les deux, dont une part
> précède ce mandat. La règle du pilot réserve cette recopie à votre mot.
>
> **Recommandation : (a).** Source consultée : `gabarits/AGENT-CAMPAGNE.md`, section « Gate de
> propagation des skills » — un écart né d'une campagne se règle dans la même session, sur décision
> humaine explicite, jamais reporté ; l'écart a déjà été payé 2 fois.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** le pilot recopie dès que la campagne en cours chez `digit-ai-forge-agents` a rendu, par `node oracles/oracle-skills.mjs --appliquer` | simple × court — une commande, puis le contrôle se rejoue | exclut de garder sur ce poste les versions d'avant, y compris pour les sessions ouvertes en parallèle |
| **(b)** attendre la publication de `digit-ai-forge-agents`, la recopie se jouant seule à l'ouverture de session suivante | gratuit aujourd'hui, mais la publication de 24 enregistrements reste à décider | exclut que les pages produites d'ici là bénéficient des corrections |
| **(c)** ne rien décider | gratuit | exclut tout : le poste continue d'exécuter ce qui n'est plus versionné, et le harnais du pilot reste à 124/125 |

> **Si rien n'est décidé** : (c) s'applique — rien ne casse, les corrections restent sans effet sur
> ce poste.

## 4. Traité — avec sa preuve

- **La seconde vague du pilot est sondée : 6 todos clos**, TF-1182, TF-0791, TF-1047, TF-1088,
  TF-1150 et TF-1184, enregistrements `7919607`, `cb1df57`, `ba2f4f3`, `83c5c2f`, `284ae63` et
  `c66b7a4`. Le point d'étape a enfin son juge, et un relais d'avancement ne rejoue plus la
  synthèse entière ; l'intention de la demande est exigée au bloc 1 de toute restitution ; le jeu
  de hooks actif se compare au jeu attendu à l'ouverture ; la page de connexion servie est lue, pas
  seulement la fiche d'accès ; les mots que vous proscrivez pour tous les produits descendent par
  l'héritage.
  - preuve, rejouée le 19/09 : `node oracles/oracle-synthese.mjs --self-test` 37/37 contre 29 ;
    `node oracles/hook-restitution.test.mjs` 29/29 contre 23 ; `node oracles/self-test.mjs`
    84 PASS contre 82 ; `node scripts/recopier-heritage.test.mjs` 14 PASS ; `node
    oracles/self-tests.mjs` 124/125, le seul défaut étant celui que D-1 traite.
  - la campagne s'est arrêtée sur un blocage technique de son flux après son 6e enregistrement ;
    TF-1081 et la part pilot de TF-1170 n'ont pas été abordés.
- **TF-1136 est clos : les 2 oracles de cadence homonymes jugent 2 moitiés disjointes**, et chacun
  nomme désormais l'autre. La campagne l'avait écrit sans l'enregistrer ; je l'ai vérifié puis
  enregistré, `104f535`.
  - preuve, rejouée : `node oracles/oracle-controle-maison.mjs .` rend PASS, là où il portait cette
    seule accusation le 16/09 ; recette de `oracles/oracle-cadence.mjs` 16/16.
- **TF-1187 est clos : une régression créée par ce mandat est fermée dans ce mandat.** Le
  correctif TF-1184 du 17/09 faisait passer un fichier relu du disque devant la synthèse écrite
  dans le tour ; un produit l'a payé le soir même d'une restitution conforme refusée, et l'a
  remonté le 18/09. `oracles/hook-restitution.mjs` examine désormais d'abord ce que le tour a
  écrit, la relecture du disque restant un repli. Enregistrement `1ad860c`.
  - preuve : cas 30 du banc posé d'abord, **rouge** — la synthèse du tour antérieur était choisie —
    puis **vert** après correction ; `node oracles/hook-restitution.test.mjs` 30/30. Le cas ne
    dépend pas des dates. Classe : `restitution-fichier-juge-mal-choisi`.
- **La campagne de `digit-ai-forge-data` a rendu : TF-1188, TF-1186 et TF-1190 sont clos**,
  enregistrements locaux `b96699d`, `5c4ab97` et `a3e6e18`. La question « ce rapport migré peut-il
  remplacer l'original ? » a son contrat et son juge, `oracles/oracle-qualifier.mjs` : 6 dimensions,
  un angle mort écrit sur chacune, et un verdict de bascule composé, jamais posé. Un chiffre que la
  cible recalcule là où la source le stockait n'est plus rangé en défaut : c'est une question, avec
  ses 2 définitions et l'accord daté du commanditaire. Un export déclaré réussi se chiffre, et un
  champ affiché se compte à l'occurrence.
  - preuve, rejouée : `node oracles/self-test.mjs` rend « 356 PASS, 0 FAIL » contre 324 ;
    `qualification-definition-verte` PASS, `qualification-definition-rouge` FAIL ; la procédure de
    migration réelle rend PASS à `oracles/oracle-enchainer.mjs`, avec son étape neuve.
  - mesure rapportée par la campagne : l'export du 15/09, déclaré réussi avec 1 page à 0 caractère,
    passait en silence et rend désormais 5 constats bloquants.
  - vérifié par le pilot : aucun nom de client n'est entré dans la forge.
- **La troisième campagne du pilot a rendu : TF-1189 et TF-1081 sont clos**, enregistrements
  `02e07bd` et `0150305`. Écrire « il n'existe aucun autre chemin » ne suffit plus : la règle `S25` (une incapacité d'accès se prouve)
  compte les familles de chemins réellement essayés, avec leurs codes de retour — *un refus prouve
  qu'une porte est fermée, jamais qu'il n'y en a qu'une*. Et le sceau d'une synthèse se pose sans
  geste humain, sur ce que le tour a écrit, à chaque passage de son juge.
  - preuve, rejouée : `node oracles/oracle-synthese.mjs --self-test` 39/39 contre 37 ; `node
    oracles/hook-restitution.test.mjs` 34/34 contre 30 ; `node scripts/verifier-jugement.test.mjs`
    10 PASS ; `gabarits/RESTITUTION.md` en 2.27.0.
  - mesure rapportée par la campagne : le texte fautif du 18/09 passait cette règle et échoue ; taux
    d'accusation 0,0 % sur 149 synthèses ; 22,3 % des synthèses sont jugées plusieurs fois sous le
    même nom, ce qu'un sceau posé une seule fois aurait accusé à tort.
- **6 lots arrivés depuis le 17/09 sont accueillis et ingérés**, soit 8 demandes neuves, TF-1185 à
  TF-1192, toutes décidées sous votre mandat.
  - preuve : `node todo/ingerer-lot.mjs` exit 0 sur les 6 lots ; `node
    oracles/oracle-boite-entree.mjs` **PASS** ; `node todo/appliquer-export.mjs
    todo/TF-decisions-20260919a.json` a rendu « 8 décidé(s) ».
- **3 campagnes sont lancées sur 8 todos** : `digit-ai-forge-data` (TF-1188, TF-1186, TF-1190),
  `digit-ai-forge-agents` (TF-1191, TF-1192, TF-1185) et le pilot (TF-1189, TF-1081).
  - preuve : `git status --porcelain` rendait 0 ligne dans les 2 forges avant le lancement.
- **Le bilan du 17/09 tient** : 7 lots ingérés, 18 candidats décidés, 15 todos clos sur preuve
  rejouée dans 5 dépôts — TF-1042, TF-1154, TF-1168, TF-1169, TF-1171, TF-1172, TF-1173, TF-1174,
  TF-1175, TF-1176, TF-1177, TF-1180, TF-1181, TF-1087 et TF-0836.
  - preuve : synthèse `Digit-AI - Synthese Mandat - Boite d entree videe et cinq campagnes
    lancees - 20260917k.md`, jugée PASS, et l'inscription de 4 oracles au registre de
    `quality-oracles`, 297 contrôles.
- **Le travail est enregistré localement** par chemins nommés, `6bc355c`.
  - preuve : `git commit --only` a rendu 14 fichiers créés.

## 5. Non traité

- Les 3 todos confiés à la campagne en cours, TF-1191, TF-1192 et TF-1185 : motif
  `dependance_externe` — elle n'a pas rendu.
- La phrase de `REGLES-PROJET.md` qui dit le sceau posé « au premier passage d'oracles » : motif
  `garde_fou` — ce fichier porte le travail non enregistré d'une autre session.
- 2 constats de la campagne de `digit-ai-forge-data`, à verser au registre : motif
  `borne_atteinte` — le compte des entités en écart pour la réconciliation, et une liste de
  fichiers gardés écrite à la main.
- TF-1170, sa part au pilot : motif `borne_atteinte` — mesuré le 19/09, aucun gabarit de mode
  d'emploi d'un dossier livré n'existe ; il faut créer cette famille de gabarits, à instruire avec
  TF-1029.
- TF-1179, sa part au pilot, et l'enregistrement de `oracles/baseline-recettes.json` : motif
  `garde_fou` — ces 2 fichiers portent le travail non enregistré d'une autre session.
- TF-1178 reste candidat : motif `garde_fou` — il demande une étude, et son score dépasse le seuil
  d'étude d'opportunité.
- La recopie des outils corrigés vers ce poste : motif `dependance_bloc_3` — D-1.
- TF-1020, la preuve sur Linux : motif `gate_gouvernance` — la publication reste votre mot.
- Les 9 todos dont la correction vit chez un produit : motif `garde_fou` — le pilot n'écrit chez un
  produit que sur run demandé.
- Le journal `BOUCLE-AMELIORATION.md` : motif `garde_fou` — il porte les modifications non
  enregistrées de l'autre session.

## 6. Écarts à la lettre

- **Vous avez demandé** « traite les todos et retours ». **J'ai fait** : tous les retours, 2 fois,
  et 28 todos clos. **Pourquoi** : les retours sont bornés, les todos ne le sont pas — 23 sont
  entrés pendant le mandat, dont 18 remontés par les produits.
- **Une correction de ce mandat a créé une régression** chez un produit, TF-1187. Elle est fermée,
  et son cas de banc ne dépend plus des dates ; la campagne d'origine avait prouvé son correctif
  sur le cas qu'elle visait, pas sur la coexistence avec un fichier écrit dans le tour.

## 7. Risques

- **Une autre session tient des fichiers du pilot modifiés depuis 2 jours.**
  - signal : `git status` liste `CLAUDE.md`, `REGLES-PROJET.md`, l'index des références et une
    trentaine de fichiers indexés que ce mandat n'a pas écrits.
  - parade : enregistrements par chemins nommés ; 2 todos attendent qu'elle enregistre.
- **Le modèle Power BI déjà livré chez le produit échouera la règle neuve sur les décisions.**
  - signal : un FAIL M7 au prochain passage d'`oracle-modeliser` chez ce produit.
  - parade : c'est l'effet voulu ; le lot de travaux le dira au produit à son prochain run.
- **La règle d'intention, neuve, accuse 94,6 % des synthèses antérieures.**
  - signal : un avertissement S51 à chaque relecture d'une synthèse d'avant le 17/09.
  - parade : elle est entrée avertissante, et le corpus antérieur ne se réécrit pas.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Sonder le rapport de campagne à venir, rejouer les vérifications natives et clore au registre | `auto_ia` | TF-1191 | `dependance_externe` — la campagne n'a pas encore rendu | 3 corrections restent sans preuve rejouée |
| **A-2** | Recopier les outils corrigés vers ce poste, puis rejouer `node oracles/oracle-skills.mjs` | `auto_ia` | TF-1173 | `dependance_bloc_3` — D-1 | le poste exécute ce qui n'est plus versionné |
| **A-3** | Journaliser le mandat dans `BOUCLE-AMELIORATION.md`, indexer la procédure de migration et enregistrer les comptes de cas | `auto_ia` | TF-1179 | `garde_fou` — ces 3 fichiers portent le travail non enregistré d'une autre session | le journal narratif ne dit rien de ce mandat |
| **A-4** | Déposer chez le produit concerné le lot de travaux qui annonce la règle neuve sur les décisions d'un modèle | `auto_ia` | TF-1170 | `garde_fou` — le dépôt chez un produit exige un mandat déclaré sur ce produit | le produit découvre la règle par un FAIL |
| **A-5** | Donner le feu vert de publication de `digit-ai-forge-audit`, puis le pilot pousse et lit le job `oracles (ubuntu-latest)` | `manuelle_utilisateur` | TF-1020 | `decision` — la publication d'un dépôt reste votre mot (R-38) ; commande que le pilot jouera : `git -C ../digit-ai-forge-audit push origin main` | la correction des polices reste sans preuve sur Linux, et le todo reste ouvert |

## 9. Traces

- Fichier jugé : ce document — `oracle-synthese` PASS.
- `todo/TODO.jsonl` — depuis l'ouverture du mandat : 14 ingestions, 23 créations dont 1 d'une autre
  session, 26 décisions, 28 clôtures ; 40 ouverts, 367 clos.
- `input/00-retours/` — 13 lots ingérés, dont `Produit-62 - RETOURS - 20260918a` à `20260918d`.
- Enregistrements locaux du 19/09, non poussés : pilot `104f535`, `1ad860c`, `6bc355c`, `02e07bd`,
  `0150305` ;
  `digit-ai-forge-data` `b96699d`, `5c4ab97`, `a3e6e18`.
