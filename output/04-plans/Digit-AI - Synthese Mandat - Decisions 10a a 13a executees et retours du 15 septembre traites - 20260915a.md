---
destinataire: humain
---

# Synthèse de mandat — vos décisions 10a à 13a sont exécutées, et les retours du 15/09 sont traités (15/09/2026)

Vos quatre décisions d'hier sont exécutées. Les 22 candidatures nées des retours reçus depuis hier sont instruites : 20 sont closes, 2 restent reportées au titre de D-11. Le registre passe de 265 à 289 items clos. Rien n'est publié. Vous demandiez s'il y a quelque chose à pousser : oui, 110 commits attendent sur 9 dépôts, sans compter le commit de cette synthèse. 102 sont prêts, et les 8 de l'exploitation attendent votre décision D-14.

## 1. En-tête d'identification

- **quoi** : exécution des décisions D-10 à D-13 du 15/09, puis traitement des retours arrivés depuis le 14/09. Huit lots accueillis, 22 candidatures instruites, une étude d'opportunité, cinq campagnes, le sondage de chaque rapport, et les clôtures au registre.
- **sur quoi** : le registre et la boîte d'entrée du pilot ; cinq dépôts corrigés (pilot, outils, design, exploitation, développement) ; les 10 produits de `c:\dev`, lus sans écriture.
- **quand** : 2026-09-15, de 11:55 à environ 14:45 UTC+02:00 (Europe/Paris), soit environ 2 h 50. Une campagne tourne encore après cette synthèse.
- **qui** : pilot digit-ai-factory 775d8e4, avec `todo/journaliser.mjs`, `todo/ingerer-lot.mjs`, `todo/accueillir-lot.mjs`, `todo/oracle-todo.mjs`, `oracles/oracle-etude-opportunite.mjs`, `oracles/oracle-skills.mjs`, `oracles/self-tests.mjs` ; six agents sous `gabarits/AGENT-CAMPAGNE.md` (Opus pour les constructions, Sonnet pour l'étude et les petites forges).

## 2. Verdict en une ligne

**Registre : clos 265 → 289, en cours 36 → 34, candidats 3 → 2, `oracle-todo` PASS ; 25 décisions et 24 clôtures journalisées ; D-10 à D-13 exécutées ; harnais du pilot 115/115 après propagation, contrôle des skills PASS ; 110 commits locaux sur 9 dépôts hors le commit de cette synthèse, dont 102 prêts à publier ; 0 publication.**

## 3. Décisions attendues de l'humain

Deux décisions portent sur des identifiants réels découverts pendant les sondages. Chacune a une option recommandée, et l'option par défaut ne publie rien.

> **D-14 — Faut-il réécrire les 6 commits non publiés de la forge d'exploitation avant de la publier ?**
>
> Des fixtures de cette forge portaient cinq noms de ressources réels d'un produit. L'arbre est corrigé, mais trois commits non publiés gardent ces noms, et le message du commit correctif cite le fragment commun. La porte des noms rend PASS, parce que les tables du canal confidentiel ne les portent pas.
>
> **Recommandation : (a).** Source consultée : la procédure de réécriture de `references/TODO-FORGE.md` (§ canal confidentiel), qui réserve toute réécriture d'histoire à l'humain, et le constat TF-1134.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Réécrire les 6 commits non publiés, puis rejouer la recette et la porte des noms | environ 20 min, avec une sauvegarde du dépôt en paquet avant le geste | rien : aucun de ces commits n'est publié |
| (b) Publier tel quel | aucun délai | la chance de garder ces cinq noms hors du dépôt public |
| (c) Ne pas publier la forge d'exploitation | rien | ses 8 commits, dont les contrôles d'exploitation O-10 à O-17 (inventaire, gestes destructifs, prérequis d'environnement), restent sur ce seul poste |

> **Si rien n'est décidé** : (c). Les 8 commits restent locaux, et les 102 autres peuvent partir sans eux.

> **D-15 — Faut-il retirer l'adresse IP d'un poste du lot de retours qui la porte et de la ligne du registre qui la recopie, avant leur enregistrement ?**
>
> Un lot de retours accueilli aujourd'hui cite l'adresse IP d'un poste en service. L'accueil ne relève pas les adresses IP, et l'ingestion l'a recopiée au registre. Rien de cela n'est publié : le lot n'est pas suivi par git, et le registre attend l'enregistrement de la session voisine.
>
> **Recommandation : (a).** Source consultée : l'outil `todo/anonymiser-suivis.mjs`, que le registre donne comme règle de la classe `anonymisation-portee-partielle`, et le constat TF-1134.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Masquer l'adresse dans le lot et au registre, puis rejouer l'empreinte du lot et `oracle-todo` | environ 15 min, après votre feu vert à la session voisine qui tient le registre | rien : le fait mesuré reste, seule l'adresse part |
| (b) Enregistrer tel quel | aucun délai | la confidentialité de cette adresse dès la prochaine publication du pilot |
| (c) Ne rien décider | rien | l'enregistrement du registre, qui ne peut partir sans trancher |

> **Si rien n'est décidé** : (c). Le registre et le lot restent sur ce poste, non enregistrés.

## 4. Traité, avec sa preuve

- **D-10 exécutée : les copies installées des skills sont l'état sondé et commité.** La fixture verte du design est rescellée, et la propagation a été rejouée à la fin des campagnes. Classe : un automate qui recopiait des états intermédiaires.
  - preuve : `oracle-skills.mjs --appliquer`, puis le contrôle → `"verdict": "PASS"` ; harnais du pilot → « 115/115 recettes jouées et vertes » ; design 51a783f, empreinte 36a64400.
- **D-11 exécutée : les items qui touchent les chemins de la session voisine sont reportés.** Aucune campagne n'a modifié, indexé ni commité ces chemins, dont le registre lui-même.
  - preuve : `git status` du pilot en fin de chaque campagne, et commits faits par `git commit --only` sur les seuls chemins de la campagne.
- **D-12 exécutée, puis sondée : le circuit hébergé du pilot est construit inactif.** Le sondage a trouvé qu'il serait rouge dès son activation, avec 7 recettes en défaut sur 115 sur un clone frais. Classe : une recette locale qui ne rejoue pas l'environnement de l'intégration continue.
  - preuve : commit 2e4913c et `scripts/recette-pilot-hebergee.test.mjs` → « 10 PASS » ; simulation sur un clone frais de 775d8e4 → « 7/115 oracle(s) en défaut », mêmes échecs sur l'état publié a3cde26 ; constat TF-1133 décidé, campagne de correction en cours.
- **D-13 exécutée : le plafond de ligne passe à 135 caractères**, et la largeur de lecture des chapitres reste à 1 080 pixels.
  - preuve : forge-agents 0c7bb1b, `V18_MAX_CPL = 135` ; cliquet des pages → « 304/304 ».
- **Retours : 8 lots accueillis, 22 candidatures créées puis décidées.** L'accueil pseudonymise les noms ; un lot refusé pour deux classes inconnues est entré après leur ajout par la session voisine.
  - preuve : `accueillir-lot.mjs` vide le sas ; `ingerer-lot.mjs` → créations TF-1111 à TF-1132 ; `oracle-todo` PASS après chaque écriture.
- **Une étude d'opportunité instruit l'inventaire des composants.** Quatre candidats décrivaient une seule chaîne cassée ; l'étude retient d'étendre deux oracles existants plutôt que d'en créer un. Un candidat est fusionné avec un autre.
  - preuve : `oracle-etude-opportunite.mjs` → PASS, 10 règles sur 10 ; étude versée en adcf5cb.
- **24 items portés au statut corrigé**, dont 20 candidatures du jour. Contrôle rouge → vert : chaque item porte au registre une fixture ou un cas qui échoue avant la correction et passe après, rejoué ici. Classe dominante : un contrôle vrai sur le mauvais invariant.
  - preuve outils : recette des pages « 308/308 cas passés », oracles du socle « PASS (263 contrôles) », hameçons « 28 PASS, 0 FAIL » ; fixture rouge des diapositives FAIL avec l'oracle d'après et PASS avec celui d'avant.
  - preuve exploitation et pilot : exploitation « 153 PASS, 0 FAIL » (128 au départ) ; conformité « 81 PASS, 0 FAIL » sur un clone frais ; registre et bancs du pilot verts, ingestion 13/13, hooks 6/6, verdicts archivés 8/8.
- **La règle neuve des fichiers hérités ne bloque aucun produit.** Sans date d'entrée en vigueur, elle doublait les échecs bloquants du parc ; son correctif la fait entrer en vigueur le 15/09. Classe : une règle neuve qui rend le passé fautif.
  - preuve : oracle de conformité rejoué sur les 10 produits → échecs bloquants 7 avant la règle, 14 sans borne, 7 avec le correctif (01faf22) ; FAIL totaux identiques produit par produit.
- **Deux constats du jour inscrits et décidés (TF-1133 et TF-1134).** L'ingestion compte deux récidives de classes closes ; c'est la mesure de la descente, pas un refus.
  - preuve : `ingerer-lot.mjs` → « 2 candidature(s) ingérée(s) en CANDIDAT (lot 60eddbce9453) » avec deux lignes « [RÉCIDIVE] » ; `journaliser.mjs` → 2 décisions.

## 5. Non traité, avec son motif

- **La correction du circuit hébergé et le relevé des adresses IP à l'accueil** — motif : la campagne qui les construit tourne encore ; je la sonderai à son retour.
- **TF-1125 et TF-1127** — motif : ils touchent des chemins de la session voisine, et restent reportés par D-11.
- **Six items en cours avec un plan chiffré** (TF-1029, TF-1097, TF-0965, TF-1079, TF-1082, TF-1084) — motif : chacun demande de 2 à 4 h de construction, que la campagne a préféré chiffrer plutôt que bâtir à moitié.
- **La migration des oracles de diapositives chez le produit, et les prérequis d'environnement de ses piles** — motif : ce sont des gestes chez le produit, sans mandat d'écriture déclaré.
- **L'enregistrement du registre et des 8 lots du jour** — motif : `todo/TODO.jsonl` porte aussi le travail de la session voisine, qui attend votre feu vert, et D-15 doit être tranchée avant.
- **Trois constats mineurs d'agents** (trois contrôles sans appelant, une bibliothèque qui annonce sept règles pour dix, un README d'exploitation muet sur O-9 à O-17) — motif : ils ne sont pas encore rejoués ici ; ils le seront au prochain passage avant d'entrer au registre.

## 6. Écarts à la lettre

- Vous avez demandé de construire le circuit hébergé inactif → je l'ai livré sans l'avoir exécuté dans son environnement → pourquoi : mon banc jugeait le fichier du circuit, pas son exécution ; le sondage l'a trouvé, et la correction est en cours.
- Vous avez demandé de tout traiter → une règle a d'abord été commitée sans date d'entrée en vigueur → pourquoi : ma consigne de campagne ne l'exigeait pas ; le correctif a suivi avant toute publication.
- Vous avez demandé de tout traiter → quatre candidatures ont attendu une étude → pourquoi : leur correction créait un objet durable, que la règle TF-0155 soumet à étude avant construction.

## 7. Risques

- **Un circuit hébergé rouge à son activation.** Signal : la simulation locale rend des recettes en défaut. Parade : la campagne en cours livre un script qui rejoue l'exécution hébergée, et ACTIVER.md l'exigera avant le geste.
- **Des identifiants réels publiés sous une porte qui rend PASS.** Signal : un nom de ressource ou une adresse dans un fichier suivi. Parade : D-14 et D-15, puis le relevé des adresses IP à l'accueil ; les tables du canal restent un geste humain.
- **Travail présent sur un seul poste.** Signal : aucun, jusqu'à la panne. Parade : votre feu vert de publication ; la porte des noms est jouée avant chaque dépôt.
- **Une recette verte seulement sur l'arbre de son auteur.** Signal : un défaut que le harnais complet voit et que la recette seule ne voit pas, arrivé une fois aujourd'hui. Parade : le sondage rejoue désormais sur un clone frais.

## 8. Prochaines actions

Sept actions restent : deux pour moi, dont une attend votre réponse à D-14, quatre pour vous, et une pour l'environnement du poste.

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-1 | Sonder la campagne du circuit hébergé et du relevé des adresses IP, puis clore au registre | TF-1133, TF-1134 | auto_ia | dependance_externe (campagne en cours) | simulation sur un clone frais, `node oracles/self-tests.mjs`, puis `node todo/journaliser.mjs` | le circuit reste rouge à son activation |
| A-2 | Appliquer la réponse à D-14 dans la forge d'exploitation | TF-1134 | auto_ia | dependance_bloc_3 (D-14) | sauvegarde en paquet, `python -m git_filter_repo --replace-text` sur les commits non publiés, recette et porte des noms | ses 8 commits restent locaux |
| A-3 | Publier les dépôts prêts | neuve | manuelle_utilisateur | decision : R-38 (règle de publication du noyau) réserve la publication au feu vert humain | répondre « publie » ; l'agent joue la porte des noms puis `git push origin main` dans chaque dépôt prêt | 102 commits restent sur ce seul poste |
| A-4 | Donner le feu vert d'enregistrement à la session voisine, puis appliquer D-15 et enregistrer le registre | TF-1125, TF-1127, TF-1134 | manuelle_utilisateur | decision : l'enregistrement du travail d'une autre session vous revient | répondre dans la session voisine ; l'agent applique ensuite `node todo/anonymiser-suivis.mjs` et `git commit --only -- todo/` | le registre du jour n'existe que sur ce poste |
| A-5 | Inscrire aux tables du canal confidentiel les fragments de noms de ressources, si vous les jugez confidentiels | TF-1134 | manuelle_utilisateur | acces : les tables vivent hors dépôt et ne s'écrivent qu'à la main ; mesuré ici, `c:\dev\_confidentiel\tables\` porte `noms-interdits.json` et `produits-pseudonymes.json`, et la porte des noms de la forge d'exploitation y rend « verdict=PASS \| total=8 » sans relever ces fragments | éditer `noms-interdits.json`, puis rejouer la porte des noms | la porte laisse passer ces fragments à chaque publication |
| A-6 | Activer le circuit hébergé, une fois sa simulation verte | TF-1018 | manuelle_utilisateur | decision : R-38 réserve l'activation d'un service hébergé au feu vert humain | `git mv ci/hebergee/recette-pilot.yml .github/workflows/recette-pilot.yml`, puis la publication | la recette du pilot n'est rejouée par rien à la publication |
| A-7 | Aligner la version de ruff du poste sur celle épinglée par la forge des tests | neuve | manuelle_dev | acces : installer un outil au poste est un geste d'environnement ; mesuré ici, `ruff --version` rend « ruff 0.15.21 » alors que `pyproject.toml` de la forge épingle « ruff==0.16.1 » | `uv tool install ruff==0.16.1` | la recette de cette forge reste rouge sur ce poste |

Ordre : A-1 au retour de la campagne, puisque rien d'autre n'est en cours ; A-2 dès votre réponse à D-14 ; A-3 quand vous voulez pour les 102 commits prêts, parce qu'ils sont tous sondés ; A-4 et A-5 ensemble, pour trancher la confidentialité avant d'enregistrer ; A-6 après A-1 et A-3 ; A-7 ne bloque rien.

Commits prêts, par dépôt : pilot 51, plus le commit de cette synthèse, outils 16, design 11, données 7, audit 6, développement 5, tests 5, conventions 1. Exploitation 8, après D-14.

## 9. Traces

- `todo/TODO.jsonl` : 25 décisions, 24 clôtures, 22 créations et 2 constats de ce jour, non enregistrés.
- `input/01-candidatures/` : `constat-agent-attente-fantome-20260915a.tf.jsonl`, `constats-ci-et-confidentialite-20260915b.tf.jsonl`.
- `output/03-etudes/20260915-etude-opportunite-inventaire-des-composants.md` : commit adcf5cb.
- Pilot : 17 commits du jour, de 2e4913c à 775d8e4. Outils : 0c7bb1b, 5ae5398, 1897ee8. Design : 51a783f, 4559f54, 6fb8d00. Exploitation : 8ca51d7 à 97b0a61. Développement : 79eef0b.
- Scratchpad de session : clones frais et extractions rejoués, fichiers de clôtures, mesure du parc (`parc-r20.mjs`).
- Ce fichier : `output/04-plans/Digit-AI - Synthese Mandat - Decisions 10a a 13a executees et retours du 15 septembre traites - 20260915a.md`.
