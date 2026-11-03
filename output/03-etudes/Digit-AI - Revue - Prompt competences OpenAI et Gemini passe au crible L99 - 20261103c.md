# Revue L99 — prompt « compétences OpenAI et Gemini dans la Factory »

Analyse du 03/11/2026 par `prompt-analyzer-l99`, niveau L99, mode boucle ouvert d'office. Elle
s'adresse au porteur de la Factory, qui a écrit la demande et décidera de lancer le run.

Prompt analysé, cité mot pour mot :

> « Vois s'il est pertinent de rajouter des compétences spécifiques dans la Factory pour
> l'utilisation des APIs et/ou Bibliothèques OpenAI et Gemini. »

Ce qui change pour le lecteur : la demande telle quelle laisse l'exécutant choisir entre deux
questions que la doctrine traite à l'opposé. Le prompt réécrit (chapitre 8) les sépare, fournit
l'existant mesuré le 03/11/2026 et fixe un critère de pertinence qu'on peut contrôler.

---

## Chapitre 1 — OODA : cadrage et étalon noté

La demande est courte et son intention se lit sans peine. Elle perd pourtant presque tous ses
points sur un seul silence : elle ne dit pas qui appellerait OpenAI ou Gemini, la Factory ou ses
produits.

**Observe.** Une seule instruction, « Vois s'il est pertinent », sur un objet en trois termes :
« compétences spécifiques », « dans la Factory », « APIs et/ou Bibliothèques OpenAI et Gemini ».
Aucun livrable, aucun format, aucun critère de pertinence, aucune contrainte.

**Orient.** La Factory dispose du skill `claude-api` pour Claude, et ce skill se tait dès
qu'OpenAI ou Gemini est nommé. Or le parc les emploie déjà : mesuré le 03/11/2026 par `git grep`
sur les dépôts de `C:\dev`, 3 dépôts portent un appel réel (14:55), 1 déclare la dépendance
`openai` (15:09), et 28 dépôts plus 3 copies de travail en font mention (15:14). L'auteur veut savoir si ce trou mérite un outillage. Le destinataire est une
session Claude Code au pilot, soumise à la règle « Aucune API tierce payante hors Claude »
(`CLAUDE.md`, section garde-fous).

**Decide.** Trois stratégies sont possibles :

1. répondre de mémoire en une note : rapide, mais la mémoire du modèle s'arrête en juin 2026 ;
2. lancer un run de conseil (`references\RUN-CONSEIL.md`) qui mesure l'existant, lit la
   documentation du jour et rend une recommandation par fonctionnalité ;
3. construire tout de suite un skill par fournisseur sur le modèle de `claude-api`.

**Act.** La stratégie 2 est la bonne. La 1 écrirait des noms de modèles et des prix périmés. La 3
construit avant de savoir si un produit en a besoin, et confond peut-être les deux questions.

**Étalon.** Le prompt idéal pour cette intention :

- sépare la compétence produit (aider un produit qui intègre OpenAI ou Gemini) de l'usage par la
  Factory (une forge qui les appelle elle-même) ;
- ouvre par une étape 0 qui mesure l'accès à la documentation et l'existant du parc ;
- définit « pertinent » par un fait mesurable ;
- nomme le livrable selon **R-4** *(le nom du projet ouvre le nom du fichier)* et **R-25** *(le
  type, pris au registre des types, ouvre le deuxième segment)* ;
- interdit tout appel payant et pose à l'humain toute décision de dépense ou de doctrine.

**Note de l'étalon.** Le tableau qui suit note le prompt d'origine dimension par dimension. Chaque
ligne donne les points obtenus sur le maximum de la rubrique, et la raison en une phrase. Le
total décide du plafond.

| Dimension | Points | Justification |
|---|---|---|
| Clarté de l'intention | 9 / 20 | « pertinent » se comprend, mais « compétences » et « dans la Factory » ont deux lectures |
| Spécification | 3 / 20 | aucun livrable, aucun format, aucune forme de réponse |
| Garde-fous et contraintes | 2 / 15 | aucune limite, et la collision avec la règle des API payantes n'est pas traitée |
| Ancrage et contexte | 3 / 15 | les deux fournisseurs sont nommés ; rien sur l'existant ni la doctrine |
| Vérifiabilité de la sortie | 2 / 15 | aucun critère qui dise si la réponse est bonne |
| Robustesse | 3 / 15 | une réponse de mémoire, ou un skill qui dépense, passent tous deux pour conformes |
| **Total** | **22 / 100** | sous le plafond de 40 qu'impose le bloquant n° 1 du chapitre 3 |

---

## Chapitre 2 — Chainlogic : collisions entre instructions

Le prompt n'a pas de chaîne interne : une seule instruction. Le risque vient de sa collision avec
la doctrine que la session exécutante reçoit par ailleurs.

- **Collision avec la règle des API payantes.** Lu comme « la Factory utilise OpenAI ou
  Gemini », le prompt heurte la règle « Aucune API tierce payante hors Claude » (`CLAUDE.md`,
  `AGENTS.md:58`, `references\RUN-CONSEIL.md:140`). Une session prudente répondrait « non » sans
  regarder les produits. Une session docile proposerait un skill qui appelle l'API.
- **Collision avec le mot « Factory ».** Dans ce pilot, une compétence vit dans une forge ou dans
  un skill installé. « Dans la Factory » ne dit pas laquelle des 13 forges porte la charge.
- **Ordre implicite.** « Vois s'il est pertinent » précède un éventuel « rajoute ». Le prompt ne
  dit pas si l'exécutant s'arrête à l'avis ou construit dans la foulée.

---

## Chapitre 3 — Blindspots : inventaire maître

Voici la liste unique des trous du prompt d'origine, du plus grave au moins grave. Chaque ligne
porte un numéro, repris au changelog du chapitre 8 sous la forme `Ch3 #n`.

1. **bloquant** — Deux questions confondues. Compétence produit et usage par la Factory ont des
   réponses opposées sous la doctrine : la première est permise, la seconde interdite par défaut.
2. **bloquant** — « Pertinent » n'a pas de critère. Sans fait mesurable, toute réponse est une
   opinion, et l'humain ne peut pas la contredire.
3. **majeur** — Aucun livrable : ni étude, ni nom de fichier, ni synthèse. Le run peut finir sur
   un message de conversation qui disparaît.
4. **majeur** — Aucun ancrage dans l'existant. Le prompt ne fait pas mesurer les appels du parc,
   ni le skill `claude-api`, ni les 20 fiches d'experts de `forge-agents`.
5. **majeur** — Aucun garde-fou sur la dépense. Un essai « pour voir » contre l'API d'OpenAI ou
   de Gemini est un appel payant, donc une décision humaine (**R-29** *(dépenses et gates restent
   humains)*).
6. **majeur** — Données volatiles. Noms de modèles, prix et points d'entrée changent plus vite
   que la mémoire du modèle, arrêtée en juin 2026. Le prompt ne demande aucune source datée.
7. **majeur** — Périmètre flou de « APIs et/ou Bibliothèques ». Il ne dit pas si les
   bibliothèques officielles, l'appel REST direct et les variantes hébergées (Azure OpenAI,
   Vertex AI) se traitent ensemble ou séparément.
8. **majeur** — Pas de place pour la décision. Si la conclusion touche la doctrine, le prompt ne
   dit pas qu'elle se pose à l'humain, réservée et au format B *(question à options et
   recommandation scellée, `gabarits\RESTITUTION.md`)*.
9. **majeur** — Remonté du chapitre 4. L'inventaire du pilot est périmé sur Gemini, et l'oracle
   de dépense ne reconnaît pas Gemini. Un exécutant qui s'y fierait conclurait que la Factory
   n'appelle aucune API tierce.
10. **mineur** — « Bibliothèques » prend une majuscule ; « APIs » prend un s anglais.

Biais probable de l'auteur : la malédiction du savoir. Il sait que la question vise les produits,
puisqu'il en a construit deux qui appellent ces API ; l'exécutant, lui, ne le sait pas.

---

## Chapitre 4 — Factcheck : prémisses

Le prompt n'affirme rien de faux. Il présuppose une Factory et deux fournisseurs, et les deux
existent. La couche se déclenche quand même, parce que la réécriture doit s'appuyer sur des
prémisses d'état et d'accès, toutes mesurées le 03/11/2026 depuis le poste Dell-XPS-16.

**Prémisses d'accès.** Le tableau qui suit donne, ligne par ligne, une adresse que le run devra
lire et le code rendu. Il se lit de haut en bas, adresses ouvertes d'abord. Mesure : `curl -s -o
/dev/null -L -m 20 -w '%{http_code}'`, anonyme, à 13:56 UTC (14:56 UTC+01:00).

| Adresse | Code | Lecture |
|---|---|---|
| `developers.openai.com/api/docs` | 200 | documentation OpenAI ouverte |
| `developers.openai.com/llms.txt` | 200 | index lisible par un agent |
| `ai.google.dev/gemini-api/docs` | 200 | documentation Gemini ouverte |
| `ai.google.dev/gemini-api/docs/llms.txt` | 200 | index lisible par un agent |
| `ai.google.dev/api` | 200 | référence de l'API |
| `github.com/openai/openai-node` | 200 | bibliothèque officielle Node |
| `github.com/googleapis/js-genai` | 200 | bibliothèque officielle Node de Gemini |
| `github.com/googleapis/python-genai` | 200 | bibliothèque officielle Python de Gemini |
| `platform.openai.com/docs/overview` | 403 | porte fermée au client anonyme |
| `platform.openai.com/llms.txt` | 404 | adresse absente |

Le contrôle positif est fait le 03/11/2026 à 13:56 UTC, dans la même commande : la même identité
anonyme, sur le même fournisseur, obtient 200 sur `developers.openai.com`. Le 403 de `platform.openai.com` ferme une porte, pas la documentation.
Familles d'accès restantes : WebFetch, les dépôts des bibliothèques, les fichiers `llms.txt`.

**Prémisses d'état.** Ce second tableau confronte chaque fait que le prompt réécrit affirme à sa
mesure. Une ligne fausse serait un bloquant ; aucune ne l'est.

| Fait | Verdict | Mesure |
|---|---|---|
| Le skill `claude-api` exclut OpenAI et Gemini | vrai | sa description : « SKIP only when another provider is being worked on » |
| Produit-12 appelle OpenAI et Gemini | vrai | `backend/app/fournisseurs/ia_openai.py:15` et `ia_gemini.py:15` |
| forge-design appelle Gemini | vrai | `scripts/generer-images.mjs:45`, clé `GEMINI_API_KEY` |
| Aucune fiche d'expert ne cite ces fournisseurs | vrai | `grep -c` à 0 sur `expert-ops-gcp.md` et `expert-ops-azure.md` |
| L'oracle de dépense reconnaît Gemini | **faux** | `RE_APPEL_PAYANT`, `oracle-depense-voie-par-defaut.mjs:54`, n'a ni `GEMINI_API_KEY` ni `generativelanguage` |
| `INVENTAIRE.md` est à jour sur Gemini | **périmé** | ligne 59 : « producteur d'images Gemini spécifié mais non implémenté » |

Les deux dernières lignes ne sont pas des affirmations du prompt d'origine. Ce sont des pièges pour
l'exécutant, remontés au chapitre 3 sous le n° 9 et signalés dans le prompt réécrit. L'item
**TF-2072** *(candidat du registre : section F de forge-design périmée sur Gemini)* couvre déjà
le décalage côté forge-design.

---

## Chapitre 5 — Premortem : cinq causes d'échec

Le run a eu lieu et le porteur n'en tire rien. Voici les cinq causes les plus probables, de la
plus à la moins probable, chacune projetée depuis l'inventaire du chapitre 3.

1. **La réponse « non, doctrine » (Ch3 #1).** La session lit « Aucune API tierce payante » et
   conclut en 3 lignes. Mécanisme : la règle la plus saillante du contexte l'emporte sur une
   demande courte. Mitigation : poser les deux questions séparément, et dire que la première est
   permise.
2. **Le catalogue de mémoire (Ch3 #6).** L'étude cite des modèles et des prix de juin 2026 au
   plus tard. Mécanisme : rien n'oblige à lire la documentation du jour. Mitigation : sources
   mesurées à l'étape 0, adresse et date sur chaque ligne.
3. **Le skill construit trop tôt (Ch3 #2 et #8).** La session écrit un skill `openai-api` sans
   qu'aucun besoin n'ait été établi. Mécanisme : « rajouter » se lit comme un ordre. Mitigation :
   le run étudie seulement ; la construction attend un mandat séparé.
4. **L'existant ignoré (Ch3 #4 et #9).** L'étude conclut « aucun produit ne s'en sert » en se
   fiant à `INVENTAIRE.md`. Mécanisme : un document du pilot passe pour une mesure. Mitigation :
   relevé `git grep` rejoué à l'ouverture, et pièges nommés.
5. **Neuf : la clé dans l'étude.** Pour illustrer, l'exécutant colle un extrait de `.env` d'un
   produit. Mécanisme : Produit-82 porte des variables `OPENAI_API_KEY=` dans ses fichiers
   d'exemple. Mitigation : contrôle `git grep` des motifs de clé sur les fichiers ajoutés,
   remonté au chapitre 3 comme garde-fou du n° 5.

---

## Chapitre 6 — Wargame : trois attaques

Trois lecteurs hostiles attaquent la direction de réécriture. Chacun trouve un point que le
prompt réécrit doit tenir.

**L'utilisateur exigeant.** Il veut une réponse en tête, pas un catalogue. « Oui pour Produit-12,
pas encore pour le reste » lui suffit, s'il est prouvé. Le prompt réécrit impose une réponse
« oui », « non » ou « pas encore » par question, en tête d'étude.

**L'expert des deux API.** Il relève trois approximations à éviter. Les bibliothèques et l'appel
REST direct ne posent pas les mêmes problèmes : Produit-12 passe par `httpx` sans bibliothèque.
Les variantes hébergées (Azure OpenAI, Vertex AI) changent l'authentification et les points
d'entrée. Les besoins transverses comptent plus que les fonctionnalités : bouchons de test,
secrets, coûts, données personnelles envoyées à un tiers.

**Le contradicteur.** Il cherche la conformité littérale la moins chère. Il peut rendre deux
catalogues complets et aucune recommandation. Il peut aussi déclarer « pertinent » tout ce qui
est mentionné une fois. Le critère de pertinence du prompt réécrit exige un appel dans le code,
un retour ou une exigence, et une mention de passage ne compte pas.

**Lentille robustesse.** Le prompt réécrit lance un run qui lit des pages tierces. Les fichiers
`llms.txt` sont faits pour être suivis par des agents, et peuvent porter des consignes. Le prompt
dit que ces pages sont des données. Calibrage : le run demande deux agents `redacteur` sur Sonnet,
ce que le tableau de routage de `CONTRAT-INTERFACE.md` §4 prévoit.

---

## Chapitre 7 — Deepthink : effets de second ordre

Le prompt est un one-shot, mais sa réponse fixera un précédent pour tout fournisseur hors Claude.

- **Précédent.** Si OpenAI et Gemini obtiennent un skill, Mistral et les modèles locaux le
  demanderont. Le critère de pertinence mesuré évite la course aux skills.
- **Dérive de doctrine.** Un appel de forge-design à Gemini existe déjà, sous un GO du 11/08 cité
  en tête du script. Si l'étude le banalise, la règle des API payantes s'érode sans décision. Le
  prompt réécrit le rend visible et pose la décision.
- **Péremption.** Un skill de référence sur des API tierces vieillit vite. Les données volatiles
  doivent vivre dans un référentiel daté (**loi n° 4** *(une donnée volatile est une donnée, pas du
  code)*), et non dans le texte d'un skill.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt passe de 22 à 86 sur 100, et ce score est mesuré par deux relecteurs aveugles, pas
estimé. Un chiffre faux a pourtant traversé les trois passes sans qu'aucun relecteur le voie :
86 vaut pour un texte qui le portait encore.

**Pourquoi le mode boucle.** Il s'est ouvert d'office, pour deux motifs de TF-2022 *(règle
d'ouverture automatique du mode boucle, 29/10/2026)* : le prompt réécrit lance un run de conseil
qui écrit, et l'analyse a relevé 2 bloquants.

### 8.1 Score et passes

Le tableau qui suit donne une ligne par passe de relecture, dans l'ordre. Le score retenu est le
plus bas des deux relecteurs ; les défauts sont ceux retenus à l'union recomptée *(un défaut vu
par un seul relecteur compte, sauf si le recompte le dément)*.

| Passe | Scores A et B | Score retenu | Majeurs retenus | Écartés au recompte | Mots | Décision |
|---|---|---|---|---|---|---|
| Prompt d'origine | — | 22 (Ch1) | 2 bloquants, 7 majeurs (Ch3) | — | 23 | réécrire |
| 1 | 88 et 74 | 74 | 6 | 0 | 1 361 | continuer |
| 2 | 88 et 84 | 84 | 6 | 0 | 1 791 | continuer |
| 3 | 86 et 88 | 86 | 7 | 0 | 2 019 | arrêter |

Raison de l'arrêt : la passe 3 gagne 2 points, sous le gain minimal de 3. Le journal
`… .boucle.json`, à côté de cette analyse, rend PASS à `oracle-boucle-l99`. Avant chaque
relecture des passes 2 et 3, un agent qui ne note pas a vérifié les clôtures : 5 sur 6 fermées
chaque fois, et 3 défauts créés chaque fois, corrigés avant la relecture.

**Après l'arrêt**, la version remise ferme les 7 majeurs de la passe 3 et une prémisse fausse que
la session a trouvée seule. Le relevé des dépendances disait « 0 dépôt » ; rejoué à 15:09 avec un
motif plus large, il en trouve 1, qui déclare `openai>=1.50`. Un vérificateur qui ne note pas
confirme 8 clôtures sur 8 et signale 3 défauts créés, eux aussi corrigés : un compte de mentions
de 27 devenu 31 (28 dépôts et 3 copies de travail), « besoin avéré » défini, rang `⌊n/2⌋` sans
cas `n = 1`. Cette version, de 2 369 mots, n'est pas renotée.

### 8.2 Diagnostic

- Force : l'intention se lit d'emblée, et elle vise un vrai trou, le skill `claude-api` se taisant
  devant OpenAI et Gemini.
- Faiblesse : deux questions sont confondues, compétence produit et usage par la Factory, que la
  doctrine traite à l'opposé.
- Faiblesse : rien ne définit « pertinent », ni le livrable, ni la source des faits.

### 8.3 Prompt réécrit

Le prompt réécrit est remis prêt à exécuter, dans un fichier à part :
`output\04-plans\Digit-AI - Prompt - Competences OpenAI et Gemini dans la Factory - 20261103i.md`.
Son plan : intention, deux questions séparées, étape 0 de mesure, critère de pertinence et règle du
verdict, livrables, décision, contraintes, ordre, contrat de sortie, protocole de tests.

### 8.4 Contrat de sortie, en clair

- Étude nommée selon R-4 et R-25 : `output\03-etudes\Digit-AI - Étude - Competences OpenAI et
  Gemini - AAAAMMJJ<indice>.md`, indice rendu par `allouer-indice.mjs`, enregistrée.
- 4 verdicts en tête (2 questions × 2 fournisseurs), chacun fondé sur un fait cité.
- Plan imposé, deux sections Q1 et Q2, 2 500 mots au plus hors tableaux.
- Catalogues triés à 7 colonnes remplies, fermés par « Mesuré sur », `N_index` compté par commande.
- 100 % des extraits retrouvés à leur adresse par script ou par WebFetch, avec le compte des deux.
- Un item `candidat` par manque, `oracle-todo` à exit 0 ; zéro clé dans les fichiers ajoutés.
- Toute décision de dépense ou de doctrine réservée et posée au format B, jamais exécutée.

### 8.5 Changelog

Chaque ligne rattache une modification du prompt au défaut qu'elle ferme. La colonne de gauche dit
ce qui change, celle de droite le défaut fermé. Les lignes sont triées dans l'ordre de
l'inventaire du chapitre 3 (`Ch3 #n`), puis viennent les défauts des relecteurs par passe (« P1 »
à « P3 »). Les mineurs en sont exclus.

| Modification | Défaut fermé |
|---|---|
| Deux questions séparées, Q2 sans levée de la règle | Ch3 #1 ; Ch5 cause 1 |
| Critère de pertinence par couple fonctionnalité × produit, règle du verdict par question | Ch3 #2 ; P1 n° 3 et 4 ; P2 n° 5 |
| Étude, synthèse, noms R-4 et R-25, plan et longueur | Ch3 #3 ; P2 n° 6 ; P3 n° 4 |
| Étape 0 : relevé du parc, existant de la Factory, périmètre et commandes | Ch3 #4 ; P2 n° 3 ; P3 n° 2 |
| Aucun appel payant, aucune clé ; contrôle des motifs de clé | Ch3 #5 ; Ch5 cause 5 |
| Sources datées, extrait par ligne, contrôle de toutes les lignes | Ch3 #6 ; P1 n° 6 ; P2 n° 2 ; P3 n° 5 |
| Bibliothèques officielles Node et Python en tableau séparé | Ch3 #7 |
| Point « Décision », format B décrit | Ch3 #8 ; P3 n° 7 |
| Pièges nommés : oracle de dépense, inventaire périmé, TF-2072 | Ch3 #9 ; Ch5 cause 4 |
| Phrase exacte du skill `claude-api` et son emplacement | P1 n° 1 |
| Le rejeu fait foi ; lisibilité d'une page au-delà du code 200 | P1 n° 2 ; P3 n° 1 |
| Dépôts publics listés, pseudonymes dans les chemins | P3 n° 3 |

### 8.6 Écarts à la lettre

Le tableau confronte votre texte à ce que le prompt en fait. Les quatre écarts sont de la
catégorie « manière d'exécuter » : ils changent la façon de répondre, pas ce que le livrable
montre au-delà de la réponse. Aucun contenu visible n'est ajouté.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « rajouter des compétences » | étudier et recommander, la construction par un mandat séparé | construire avant de savoir si un produit en a besoin |
| « dans la Factory » | deux questions, compétence produit et usage par la Factory | la doctrine les traite à l'opposé |
| « APIs et/ou Bibliothèques » | les fonctionnalités des deux API, plus les bibliothèques officielles Node et Python | ce sont les langages du parc mesuré |
| « Vois s'il est pertinent » | 4 verdicts fondés sur un critère mesuré | un avis sans critère ne se contredit pas |

### 8.7 Protocole de tests du livrable

Le livrable du run est un document texte. Le protocole embarqué prescrit trois contrôles :
`oracle-synthese`, `oracle-todo` et `oracle-ecriture` ; un script qui retrouve chaque extrait à
son adresse ; et un jeu d'essai de 3 lignes par catalogue, plus un cas de dépréciation par
fournisseur et le contrôle de cohérence sur Produit-12. La boucle est bornée à 3 itérations, puis
le run livre avec ses écarts résiduels.
