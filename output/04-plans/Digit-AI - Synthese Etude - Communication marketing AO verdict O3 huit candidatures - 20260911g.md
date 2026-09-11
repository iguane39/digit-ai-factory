---
destinataire: humain
---

# Synthèse d'étude — l'étude d'opportunité « communication, marketing et appels d'offres » est jouée et jugée 10/10 : aucune forge nouvelle, dix objets répartis chez quatre porteurs existants et un type de run ; huit candidatures attendent votre décision (11/09/2026)

Votre « exécute le prompt » a été pris comme la validation de la lecture de votre intention, et l'étude est faite. Ce qu'elle établit : aucune des trois partitions (appel d'offres, marketing, communication) ne passe la règle d'admission d'une forge, parce que les verbes qu'il faudrait existent déjà dans la forge des agents, mais en mauvais état — le skill PowerPoint est à refondre, le skill de propale porte des noms de clients réels dans ses références, et rien n'est versionné. Ce que ça change pour vous : le chemin retenu ne crée pas de dépôt de forge, il crée un produit privé pour l'instance Digit-AI, un type de run pour les appels d'offres, et il remet en état ce qui existe. Ce qui est attendu de vous : décider les huit candidatures du verdict, désigner le premier appel d'offres réel sur lequel la capacité sera exercée, et donner le feu vert de publication.

## 1. En-tête d'identification

- **quoi** — exécution du prompt réécrit par l'analyse L99 (l'analyse de prompt en huit couches) du matin : étude d'opportunité au gabarit du pilot, quatre audits de skills en lecture seule délégués, huit candidatures émises et ingérées ; décision humaine D-1 (a) prise par « exécute le prompt ».
- **sur quoi** — le pilot `digit-ai-factory` (seul dépôt écrit) ; lectures seules sur `digit-ai-forge-agents` (archives de skills décompressées dans le scratchpad de session, agents compilés, recette du 24/07/2026, oracles de propale, registre des experts), `digit-ai-forge-design`, le canal confidentiel, et le web pour l'état de l'art.
- **quand** — 2026-09-11 12:12 UTC+02:00 (Europe/Paris) ; le tour précédent s'est clos à 11:25 et la première mesure d'horloge de celui-ci est 12:03 ; durée ≈ 45 min, dont quatre audits délégués de 226 à 484 s chacun (mesurés par l'outillage).
- **qui** — pilot local `6c6ea59` (précédents `8fae8b3`, `b1c80b4` ; `origin/main` = `d65c578`, **3 enregistrements en avance**, tous de cette session) ; session Fable 5.1 ; quatre agents délégués sur Sonnet (routage par défaut : audit borné d'un artefact ; escalade : aucune) ; oracles joués : `oracle-etude-opportunite` avec ses dix règles, de E1 (les cinq sections du gabarit présentes) à E10 (le test rétro écrit et joué), `check_markdown.py` (M7, M10, M14, M18 : ouverture de chapitre, mode de lecture des tableaux, marqueurs de travail, glose des identifiants), `todo\ingerer-lot.mjs`, `todo\oracle-todo.mjs`, `oracle-nom-client-publie` (porte des noms de clients), `oracle-synthese` (ce document).

## 2. Verdict en une ligne

**Étude `20260911a` déposée, `oracle-etude-opportunite` PASS 10/10 (22 lignes de non-recouvrement citées, 16 dates de sources, jeu fermé tenu de O0 (l'option de ne rien faire) à O4 (la forge unique telle que demandée), verdict unique O3, plan de revue 2026-10-09), lisibilité PASS ; règle d'admission R-28 refusée sur les trois partitions et sur la forge unique (critère 1 ; critère 3 pour la forge unique) ; quatre audits : `digit-ai-pptx` Refondre 15/35 avec 11 liens morts sur 14, `digit-ai-propale` Renforcer avec cinq clients réels nommés dans 4 références sur 5, `digit-ai-propale-review` Renforcer 28/35, `digit-ai-communication` Ajuster 27/30 ; 8 candidatures TF-1024 à TF-1031 ingérées (lot 55e62d952490), `oracle-todo` PASS, vues régénérées (249 actifs) ; porte des noms PASS (0 terme sur 10, 0 produit sur 20) ; 1 enregistrement local `6c6ea59` (9 fichiers), 0 push.**

## 3. Décisions attendues de l'humain

Une décision neuve ; la décision D-2 du matin (trois candidatures et trois classes) reste ouverte et n'est pas reposée ici — elle est rappelée au bloc 5.

> **D-3 — Le verdict de l'étude et les huit candidatures qu'il émet sont-ils décidés, et dans quel ordre les lots partent-ils ?**
>
> L'étude retient l'option O3 (l'option qui n'ouvre aucune forge : remettre en état et étendre les skills de la forge des agents, faire naître un produit privé pour l'instance Digit-AI, jouer le système de marque par la forge de design, et écrire un type de run pour la réponse aux appels d'offres chez le pilot). Elle range ce chemin en dix lots ordonnés par dépendance : la remise en état des skills et la marque d'abord, la naissance du produit et le type de run ensuite, puis le référentiel d'exigences outillé et le rendu à trame imposée, les barres externes, les gabarits partenaires et fournisseurs, la transparence des contenus générés, et le registre des issues. Les identifiants des huit candidatures sont au bloc 4 ; chacune porte son porteur, son effort en complexité × durée et sa preuve de « prêt ». Deux des lots sont des écritures chez des dépôts frères et exigent un mandat en plus de la décision.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine, clôture sur gains constatés ») et l'étude `output\03-etudes\20260911-etude-opportunite-communication-marketing-ao.md` §5.2 (plan par chemin critique : un lot ne démarre pas avant ceux qu'il cite) ; `REGLES-PROJET.md` §H R-28 (la règle d'admission d'une forge) pour le refus des options O2 (une forge sur la seule partition des appels d'offres) et O4.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) décider les huit candidatures et lancer les lots dans l'ordre du chemin critique : skills et marque, puis produit et type de run, puis le reste — mandats d'écriture chez forge-agents et forge-design donnés du même mot | effort complexe × moyen pour l'ensemble ; le pilot commence par ce qu'il peut écrire seul (type de run, naissance du produit) pendant que les mandats s'exécutent | exclut de garder la propale en PowerPoint par défaut et les skills en archive ; exclut une forge de plus |
| (b) décider les huit mais ne lancer que le chemin critique : skills versionnés et corrigés, marque, produit, type de run — le reste attend le premier appel d'offres réel | effort moyen × court d'abord ; les six autres lots restent en candidat décidé, datés | exclut, jusqu'au premier cas réel, le rendu à trame imposée, les barres, les gabarits partenaires et la transparence des contenus publics — dont l'obligation est en vigueur depuis le 2026-08-02 |
| (c) laisser les huit en candidat | effort nul | exclut tout : la prochaine propale se produit en reconstituant les skills à la main, avec une charte absente et des noms de clients dans les références |

> **Si rien n'est décidé** : l'option (c) s'applique — les huit candidatures restent en candidat, aucun lot ne part, et le plan de revue du 2026-10-09 constatera l'écart.

## 4. Traité — avec sa preuve

- **L'étude d'opportunité est déposée et jugée** : seuil franchi sur trois critères, intention citée mot pour mot, partition en trois métiers et deux coordonnées, typologie fermée H1 (la typologie livrable × public × format, hypothèse à valider) de douze lignes, 22 lignes de non-recouvrement citées, test R-28 par partition, sept sources datées, cinq options, verdict O3, onze objets typés et attribués, dix lots ordonnés, test rétro avec un élément retiré.
  - preuve : `C:\dev\digit-ai-factory\output\03-etudes\20260911-etude-opportunite-communication-marketing-ao.md` (6 735 mots) ; `node oracles\oracle-etude-opportunite.mjs` → **verdict PASS, 10/10** (E1 : les cinq sections du gabarit présentes ; E2 : 22 lignes de non-recouvrement, toutes citées ; E3 : 16 dates de sources relevées ; E4 : jeu fermé tenu, O0 traitée ; E5 : verdict unique ; E6 : aucun terme subjectif nu ; E7 : plan de revue daté ; E8 : aucun effort en jours ; E9 : intention citée et substantielle ; E10 : test rétro présent et joué) ; `check_markdown.py` → **PASS** (2 avertissements M14 : le mot TODO désigne le registre) ; rejoué après l'insertion des identifiants de candidatures : PASS 10/10, PASS.
- **Les quatre skills ont été audités en lecture seule par quatre agents distincts** chargeant `ameliore-un-skill`, archives décompressées dans le scratchpad de session, aucune écriture ailleurs.
  - preuve : rapports `scratchpad\audit-digit-ai-{communication,propale,propale-review,pptx}.md` ; verdicts : PowerPoint **Refondre 15/35**, 11 liens morts sur 14 ressources citées (`references/charte.md`, `layouts.md`, `assets.md`, `scripts/inject_canonical_slide.py`…), `py_compile` PASS sur les deux scripts restants, passe QA décrite et non outillée ; propale **Renforcer** ≈ 21/35, 0 lien mort, **cinq clients ou prospects réels nommés dans 4 références sur 5 (11 occurrences)**, rendu PPTX seul, référence à un skill `digit-ai-prospection` introuvable ; propale-review **Renforcer 28/35**, `extract_propale.py` valide et exécuté à vide sans crash, renvoi vers un skill `pdf-reading` introuvable ; communication **Ajuster 27/30**, `missing: []`, aucune donnée en dur, aucun contrat de sortie.
- **L'existant a été relevé avec citations, y compris ce que le matin n'avait pas vu** : cinq oracles de propale versionnés en source chez forge-agents (`oracle-pptx`, `oracle-charte-pptx-semantique`, `oracle-exigences-ao` X1-X3, `oracle-claims`, `oracle-nommage`) et la recette C2 du 24/07/2026 qui les a exécutés.
  - preuve : `registre-oracles.md` l.15, 25, 27, 45 ; `git ls-files` de forge-agents liste les trois scripts ; `p4\pv-recette-v2.md` en-tête « oracles réellement exécutés » (contenu client non repris).
- **L'antériorité a été cherchée par nom ET par structure.**
  - preuve : par nom, 0 candidat ; par structure, 241 items actifs, 77 ciblant forge-agents, forge-design ou forge-seo-geo, 35 au croisement cible × lexique des livrables, aucun sur le sujet hors TF-1021, TF-1022, TF-1023 du matin.
- **L'état de l'art est daté et sourcé** : sept sources de 2025-10 à 2026-09 (réponses aux appels d'offres assistées, textes 2026 de la dématérialisation, article 50 du règlement européen sur l'IA en vigueur depuis le 2026-08-02, format stable des jetons de marque 2025.10, confiance des acheteurs B2B, notation par rubrique).
  - preuve : `WebSearch` ×6 le 11/09 ; table §3 de l'étude, une date et un localisateur par ligne ; E3 « 16 source(s) datée(s) ».
- **Huit candidatures sont au registre en candidat.**
  - preuve : `node todo\ingerer-lot.mjs … --sans-fetch` → « [OK] 8 candidature(s) ingérée(s) en CANDIDAT (lot 55e62d952490) » ; TF-1024 produit autonome `digit-ai-communication`, TF-1025 type de run « réponse à appel d'offres », TF-1026 référentiel d'exigences outillé, TF-1027 rendu OOXML à trame imposée, TF-1028 trois barres externes, TF-1029 quatre familles de gabarits, TF-1030 transparence article 50, TF-1031 registre des issues ; `node todo\oracle-todo.mjs` → **PASS** ; `generer-vue.mjs` « 249 actifs, 19 forges cibles » exit 0, `generer-page.mjs` exit 0, `generer-recidives.mjs` « 69 classe(s), 112 récidive(s) » exit 0.
- **Aucun nom de client, de personne ni montant n'est entré dans le pilot.**
  - preuve : `node oracle-nom-client-publie.mjs .` → **verdict PASS**, « aucun des 10 terme(s) du référentiel, ni des 20 nom(s) de produit de la table, dans les contenus, les noms de fichiers ni les messages de commit » ; le cas du 24/07 est cité par sa date et son emplacement seulement.
- **Tout est enregistré localement, sur les seuls chemins du tour.**
  - preuve : `git commit --only` → `6c6ea59`, « 9 files changed, 636 insertions(+), 18 deletions(-) » ; `git status -sb` → `main...origin/main [ahead 3]` ; les modifications d'autres sessions (`todo\HERITAGE-RELEVES.jsonl`, lots de retours non ingérés) sont laissées hors de l'enregistrement.

## 5. Non traité — avec son motif

- Les dix lots du verdict (versionner les skills, marque, produit, type de run, référentiel outillé, rendu OOXML, barres, gabarits, transparence, registre des issues) — motif : dépendance à une décision humaine (D-3) ; R-29 (la règle « l'IA fait, l'humain décide ») et R-31 (la règle d'admission de tout objet durable) : un objet durable naît sur décision, jamais sur étude.
- Le premier livrable réel d'exercice de la capacité — motif : dépendance à une décision humaine ; aucun appel d'offres ni propale en cours n'est connu du pilot, et l'étude refuse d'en inventer un : en attendant, la v0 se rejoue sur le cas du 24/07/2026 pseudonymisé, fixture réelle mais pas cas neuf.
- La question de la communication interne (collaborateurs, recrutement) — motif : dépendance à une décision humaine ; non tranchée avec « exécute le prompt », traitée comme la ligne L12 (la ligne « communication interne » de la typologie) hors typologie tant que non confirmée.
- La décision D-2 du matin (trois candidatures TF-1021 à TF-1023 et leurs trois classes) — motif : dépendance à une décision humaine ; non reposée ici, l'étude reprend les trois candidatures au verdict sans les dupliquer.
- Le push du pilot (`d65c578..6c6ea59`, trois enregistrements) — motif : bloqué par un garde-fou, R-38 §4-5 ; les trois portent des livrables explicites (analyse, étude, synthèses) et une évolution de référentiel, hors de la couverture d'office du paragraphe 5.
- L'anonymisation des références du skill de propale et la refonte du skill PowerPoint — motif : hors mandat ; écritures chez forge-agents, dépôt frère ; elles attendent D-3 puis un mandat.

## 6. Écarts à la lettre

- **Vous avez écrit** « exécute le prompt » → **j'ai fait** l'étude d'opportunité que le prompt réécrit prescrit, et rien de ce que son verdict prescrit (aucun lot lancé) → **pourquoi** : le prompt réécrit borne le tour à l'étude et à ses candidatures (règles 29 et 31) ; les lots sont des objets durables qui attendent D-3.
- **Vous n'avez pas répondu** sur l'interne → **j'ai** traité l'interne comme question ouverte, hors typologie → **pourquoi** : loi n° 3, une omission se déclare ; l'action A-9 vous le redemande en un mot.
- **Le prompt réécrit demandait** « audit ameliore-un-skill des quatre skills » → **j'ai** délégué les quatre audits à quatre agents sur Sonnet, en lecture seule, archives décompressées hors dépôt → **pourquoi** : routage par défaut du contrat d'interface (audit borné d'un artefact), parallélisme entre tâches indépendantes d'une même étape ; les rapports sont cités, pas recopiés.
- **Le prompt réécrit demandait** un « état de l'art : ≥ 5 sources datées » → **j'ai** cité sept sources, dont trois avec une date au mois seulement (année-mois lus dans le localisateur ou l'identifiant) → **pourquoi** : l'oracle exige la date, pas le jour ; le plan de revue du 2026-10-09 rejouera la fraîcheur.
- **Aucun autre écart** : la partition, la typologie H1, les onze sources à relever, le test R-28 par partition, le jeu O0-O4 et le verdict unique sont ceux du prompt réécrit.

## 7. Risques

- Les références du skill de propale portent cinq noms de clients réels : versionner ce skill en source tel quel (lot des skills) ferait entrer ces noms dans un dépôt publié ;
  - signal : `oracle-nom-client-publie` FAIL au pre-push de forge-agents, ou un nom dans `git log` de la forge ;
  - parade : l'anonymisation est écrite comme préalable du lot dans l'étude (§2 bis, §5.1) et dans TF-1021 ; la porte des noms tourne au pre-push des deux dépôts.
- Les audits portent sur des archives datées de juillet 2026 ; une version plus récente des skills peut exister hors du poste (espace de conception des skills) et rendre les constats périmés ;
  - signal : une archive de date postérieure sous `input\03-skills\`, ou un SKILL.md dont la version diffère de 2.5.0 / 1.1.2 ;
  - parade : date de péremption de l'étude écrite (2026-11-11) ; le lot des skills commence par relever la version vivante avant de versionner.
- La capacité reste décorative si aucun appel d'offres réel ne l'exerce (R-28 point 2 transposé par R-31) ;
  - signal : plan de revue du 2026-10-09 sans ligne au registre des issues ;
  - parade : la rejouée sur le cas du 24/07 pseudonymisé est écrite comme fixture ; l'action A-8 demande la désignation du premier cas réel.
- Le produit autonome (instance Digit-AI) est un dépôt privé de plus à tenir, avec des données confidentielles au-delà des noms (prix, personas) ;
  - signal : `oracle-confidentiel` qui ne le voit pas privé, ou un miroir public ;
  - parade : naissance sous doctrine avec `oracle-confidentiel` et porte des noms dès le premier enregistrement ; acceptation déclarée du coût de tenue.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), dans l'ordre du chemin critique de l'étude — journaliser la décision, puis ce que le pilot écrit seul (type de run, naissance du produit), puis ce qui attend un mandat, le push en dernier ; puis les actions humaines, dans l'ordre des décisions et des valeurs qu'elles fournissent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Journaliser D-3 sur les huit candidatures (`journaliser.mjs`), régénérer les vues, rejouer `oracle-todo` (TF-1024 à TF-1031) | auto_ia | `dependance_bloc_3` — attend D-3 ; à défaut, les huit restent en candidat | simple × court |
| A-2 | Écrire `references\RUN-AO.md` (type de run « réponse à appel d'offres »), l'indexer, rejouer `oracle-claude-md`, puis sa fixture : la séquence rejouée sur le cas du 24/07 pseudonymisé avec `oracle-exigences-ao` et `oracle-claims` (TF-1025) | auto_ia | `dependance_bloc_3` — attend D-3 ; à défaut, chaque appel d'offres improvise sa séquence | simple × court |
| A-3 | Ouvrir le run de naissance du produit privé `digit-ai-communication` : socle, git local, héritage, `oracle-conformite-projet` PASS, `oracle-confidentiel` (TF-1024) | auto_ia | `dependance_bloc_3` — attend D-3 et l'emplacement du dépôt privé (valeur A-10) ; à défaut, l'instance reste éparse | moyen × court |
| A-4 | Jouer `systeme-de-marque` pour Digit-AI (tokens.css + MARQUE.md avec la règle de transparence), artefacts déposés chez le produit, oracles tokens T1-T6 et DTCG D1-D3 (TF-1023, TF-1030) | auto_ia | `dependance_bloc_3` — attend D-3 et A-3 ; à défaut, deux chartes contradictoires | simple × court |
| A-5 | Chez forge-agents : anonymiser les références du skill de propale, versionner les quatre skills en source, reconstituer la charte PowerPoint, self-test double sens, installer par bootstrap (TF-1021, TF-1022) | auto_ia | `hors_mandat` — écriture dans un dépôt frère ; attend le mandat A-11 ; à défaut, tout se construit sur des archives | moyen × court |
| A-6 | Chez forge-agents : référentiel d'exigences outillé, skill de rendu OOXML à trame imposée, trois barres externes, contrôle de transparence (TF-1026, TF-1027, TF-1028, TF-1030) | auto_ia | `hors_mandat` — écriture dans un dépôt frère ; attend D-3 et A-11 ; à défaut, la réponse à trame imposée reste à la main | complexe × moyen |
| A-7 | Pousser le pilot (`d65c578..6c6ea59` et l'enregistrement de cette synthèse), `FORGE_PUSH_GO` posé, porte des noms rejouée par le hook (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend A-12 ; à défaut, tout reste local | simple × court |
| A-8 | Désigner l'appel d'offres ou la propale réels sur lesquels la capacité sera exercée sous le type de run — répondre « livrable d'exercice : <objet, échéance> » (neuve) | manuelle_utilisateur | `decision` — R-28, critère 2 (une v0 naît exercée), et le pilot ne connaît aucun cas en cours ; sinon : la rejouée du 24/07 tient lieu de fixture | simple × court |
| A-9 | Dire si la communication interne entre au périmètre — répondre « interne oui » ou « interne non » (neuve) | manuelle_utilisateur | `decision` — ligne L12 de la typologie H1 ; sinon : hors typologie | simple × court |
| A-10 | Donner l'emplacement du dépôt privé du produit `digit-ai-communication` — répondre « dépôt : <hébergeur/organisation> » (TF-1024) | manuelle_utilisateur | `decision` — un dépôt privé chez un hébergeur est un choix d'hébergement et de coût, R-29 ; sinon : le produit naît en local seulement | simple × court |
| A-11 | Donner le mandat d'écriture chez forge-agents (A-5, A-6) et forge-design (A-4) — répondre « mandat A-5 A-6 A-4 » (neuve) | manuelle_utilisateur | `decision` — aucune écriture dans un dépôt frère hors mandat ; sinon : les lots restent chez le pilot | simple × court |
| A-12 | Trancher D-3 — répondre « D-3 (a) », « (b) » ou « (c) » ; et D-2 du matin — « D-2 (a) », « (b) » ou « (c) » ; journalisation par l'IA (TF-1021 à TF-1031) | manuelle_utilisateur | `decision` — TODO-FORGE : la décision sur un candidat est humaine ; sinon : tout reste en candidat | simple × court |
| A-13 | Donner le feu vert de publication des trois enregistrements — répondre « pousse le pilot » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'enregistrements portant des livrables explicites est un GO humain ; sinon : le pilot reste 3 en avance, en local | simple × court |

## 9. Traces

- Étude : `output\03-etudes\20260911-etude-opportunite-communication-marketing-ao.md` (commit `6c6ea59`) ; analyse source : `output\03-etudes\20260911-L99-forge-communication-marketing.md` (commit `b1c80b4`).
- Sidecar des candidatures : `input\01-candidatures\forge-communication-verdict-o3-20260911a.tf.jsonl` (lot 55e62d952490) ; registre `todo\TODO.jsonl` (TF-1024 à TF-1031) ; vues `todo\TODO.md`, `todo\RECIDIVES.md` et la page générée du registre.
- Audits délégués (hors dépôt, scratchpad de session) : `audit-digit-ai-communication.md`, `audit-digit-ai-propale.md`, `audit-digit-ai-propale-review.md`, `audit-digit-ai-pptx.md`.
- Enregistrements locaux : `6c6ea59` (9 fichiers) ; cette synthèse et les index régénérés sont enregistrés à sa suite.
- Oracles : `oracle-etude-opportunite` (PASS 10/10, 2 passes), `check_markdown.py` (PASS, 2 passes), `todo\ingerer-lot.mjs` (OK, 8), `todo\oracle-todo.mjs` (PASS), `oracle-nom-client-publie` (PASS), `oracle-synthese` sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme).
- Aucune page HTML livrée dans ce tour.
