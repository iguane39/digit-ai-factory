# Retours forges — Bibliothèque vidéo IA Ceetrus — 20260822a

- **Contexte** : retour humain du 22/08/2026 sur la **forme des listes de tâches remises au
  développeur**, instruit sur les fichiers du pilot et mesuré sur les synthèses réelles de
  `output\04-plans\`
- **Références ledger** : sans objet — retour hors run, formulé en session produit
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-22

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot.** Demande humaine du 22/08, littérale : *« je travaille sur 5 à 8 projets
en parallèle ; la liste des tâches affichée est trop longue, trop complexe, sans assez de
détails sur les problèmes, les solutions possibles, menées par l'IA ou ne pouvant être traitées
que par moi. Ce qui peut être traité par l'IA doit remonter en tête et être traité
exhaustivement, sans être répété d'une liste à une autre. »*

L'instruction sur les fichiers donne un résultat qui n'était pas celui attendu : **la doctrine
demandée existe déjà presque entièrement**, et ce qui manque n'est pas une consigne mais son
**contrôle**. `gabarits\RESTITUTION.md` v2.4.0 impose déjà le bloc 3 (décisions en choix fermé
avec coût, recommandation et option par défaut) et le bloc 8 (actions classées **par acteur**
`auto_ia` / `manuelle_dev` / `manuelle_utilisateur`, et **par ordre dérivé, jamais ressenti**).
La loi transverse n° 5 du noyau dit déjà : *« l'IA fait, l'humain décide — la voie automatisée
est le défaut ; l'action laissée à l'humain se justifie. »*

Les six retours ci-dessous sont donc tous du même genre : **une règle écrite que rien
n'exécute**, ou **deux référentiels de l'écosystème qui se contredisent**. Aucun ne demande une
doctrine nouvelle. C'est aussi pourquoi ce lot vise le `pilot` seul : la méthode se partage aux
autres projets par `RESTITUTION.md`, qui régit « tout message de fin de traitement, quelle que
soit la forge et quel que soit le projet », et non par une copie de fichier dans chaque produit.

---

## pilot (`digit-ai-factory`) — consigne de restitution, registre produit, vue du développeur

Ce que le retour humain a coûté à mesurer : la restitution remise au développeur classe le
travail par acteur mais ne garantit ni que la part IA a été faite, ni que la part humaine est
exécutable telle quelle, ni qu'elle est la même d'un tour au suivant.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-11 | bloquant | générique | **`auto_ia` au bloc 8 est une ÉTIQUETTE, pas une obligation d'exécution : S6 ne juge que la PRÉSENCE d'un acteur.** Lu le 22/08 dans `oracles\oracle-synthese.mjs` (S6, l. 148-157) : le test est une expression régulière cherchant un nom d'acteur, plus un marqueur d'ordre — rien sur l'exécution. Mesuré sur les **13 synthèses de `output\04-plans\` portant un bloc 8** : **15 lignes `auto_ia`**, dont **2** déclarent « aucune — mandat soldé » et **9 renvoient explicitement le travail à l'humain** (« sur ton mandat », « sur mandat », « sur ton signal *renommé* », « sur décision (a) », « sur *décide TF-0287* »). Le lecteur est donc rendu responsable de relancer l'IA sur du travail que l'IA a elle-même classé comme sien. Ces neuf renvois sont **légitimes** (gate de gouvernance R-29) — le défaut n'est pas qu'ils existent, c'est que **rien ne les distingue** d'une part IA simplement non faite. | Règle **S11** : une action `auto_ia` au bloc 8 est un défaut **sauf si la même puce porte son motif de non-exécution**, pris dans un vocabulaire fermé — `gate_gouvernance` (R-29, décision ou dépense), `dependance_bloc_3` (attend une décision listée au bloc 3), `garde_fou` (nommé), `borne_atteinte` (G-2), `dependance_externe` (nommée). Effet recherché : neuf lignes qui disent toutes « donne-moi un mandat » se lisent comme **une** gate, pas comme neuf tâches. |
| RA-12 | majeur | générique | **Une action laissée à l'humain ne porte jamais la raison de son impossibilité IA, alors que le noyau l'exige.** `CLAUDE.md` loi n° 5 : « l'action laissée à l'humain **se justifie** ». `gabarits\RESTITUTION.md` §8 impose l'acteur et l'ordre, jamais la justification ; S6 ne la teste pas. Mesuré sur `output\` : **6 occurrences `manuelle_dev`** et **17 `manuelle_utilisateur`**, **aucune** ne dit pourquoi l'IA ne peut pas le faire. Conséquence : rien ne permet de mesurer quelle part du travail humain reste humaine **par nécessité** plutôt que **par défaut d'automatisation** — c'est-à-dire exactement la question que pose le retour du 22/08. | Règle **S12** : chaque action `manuelle_dev` / `manuelle_utilisateur` porte sa raison d'impossibilité, vocabulaire fermé — `acces` (droit, console ou compte hors portée agent), `decision` (arbitrage métier, budget, risque), `depense`, `presence` (geste physique, réunion, signature), `irreversible` (R-38 et assimilés). Une raison hors vocabulaire n'est pas un refus : c'est un **candidat à l'automatisation**, à verser au registre. |
| RA-13 | majeur | générique | **Une ligne du bloc 8 n'est pas exécutable sans recharger le contexte du projet — or c'est précisément ce que le lecteur ne peut pas faire huit fois par jour.** Le bloc 0 (S9, TF-0407) impose le langage commanditaire au niveau du TOUR ; aucune règle ne s'applique à la LIGNE d'action. Pièce : `output\04-plans\Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817a.md` l. 101-102 — « `manuelle_dev` — compléter les 2 plans de mission réels (W5-W7) et redéployer digit-ai.fr (INS-0001) » : deux actions, **aucun chemin, aucune commande, aucun libellé d'écran, aucune preuve attendue**. Le lecteur doit rouvrir le projet pour savoir ce qu'on lui demande, ce qui est le coût que le retour du 22/08 décrit. | Règle **S13**, testable mécaniquement : une puce `manuelle_*` qui ne porte **ni chemin, ni commande, ni libellé d'écran** est un défaut. Et au gabarit, trois champs courts par action humaine — **rappel du sujet** (une phrase, même exigence de langage que S9), **ce qui est attendu** (livrable, format, destinataire), **mode opératoire** (le geste exact, et la preuve qui clôt l'action). |
| RA-14 | majeur | générique | **Rien ne relie une action d'une restitution à la suivante : sans identifiant stable, le lecteur ne distingue pas ce qui est neuf de ce qui traîne, et relit tout.** `gabarits\docs-projet\TODO-PRODUIT.md` porte des ids `Q-01` / `A-01` et se déclare source du reste-à-faire du produit ; `RESTITUTION.md` §8 ne cite jamais TODO-PRODUIT et n'exige aucun id. Mesuré : sur les **13 synthèses à bloc 8**, **0** cite un id `A-` ou `Q-`. Les actions sont réécrites en prose à chaque tour — deux tours successifs ne se comparent pas, et la demande « sans être répétés d'une liste à une autre » est mécaniquement impossible à tenir. | Le bloc 8 référence l'id `TODO-PRODUIT` de chaque action ; une action sans id est une action **neuve**, et la restitution la crée. Contrôle : règle **S14** — chaque puce du bloc 8 porte un id stable ou la mention explicite `neuve`. C'est l'exact pendant de la doctrine TODO-FORGE (ids frappés, jamais réutilisés, archive séparée) côté PRODUIT. |
| RA-15 | majeur | générique | **`TODO-PRODUIT.md` et `RESTITUTION.md` §8 se contredisent sur les deux informations qui servent au développeur.** (1) La table « Améliorations » du gabarit n'a **pas de colonne acteur** : le vocabulaire gelé `actions[]` de la règle 29 n'y figure nulle part. (2) Sa priorité est **déclarative** — colonne `Priorité` valuée « haute / moyenne / basse » — alors que §8 exige une priorité **dérivée, jamais ressentie, justifiée en une clause**. Le seul document que le développeur est censé lire **hors session** est donc celui qui perd « qui peut le faire » et « pourquoi dans cet ordre ». | Aligner le gabarit sur §8 : colonnes `Acteur` (vocabulaire gelé) et `Pourquoi pas IA` (vocabulaire de S12) ajoutées à « Améliorations » ; `Priorité` remplacée par `Ordre` et sa clause d'une ligne. Le pilot est écrivain des deux référentiels : la contradiction se corrige sans toucher aucun produit. |
| RA-16 | majeur | générique | **Aucune vue PORTEFEUILLE n'existe, et la vue par produit n'est instanciée nulle part.** `RESTITUTION.md` régit le message de fin d'UN traitement ; `TODO-PRODUIT.md` est le reste-à-faire D'UN produit, généré par produit (`generer-todo-produit.mjs`). Rien n'agrège. Deux mesures du 22/08 : (1) `find` sur `c:\dev` et `c:\dev\_Nhood` ne trouve **aucun `TODO-PRODUIT.md` instancié** — le fichier n'existe qu'à l'état de gabarit, dans le pilot et dans `digit-ai-forge-pilot_old` ; (2) `input\00-retours\old\` porte des lots de **14 émetteurs distincts** sur 9 jours (13→21/08). L'écosystème est déjà multi-produits ; sa restitution ne l'est pas, et le développeur qui en tient 5 à 8 n'a aucun endroit unique où voir son reste. | Deux temps. D'abord **instancier** `TODO-PRODUIT.md` là où il manque — c'est ce qui débloque le reste et ne coûte qu'un fichier par produit. Ensuite seulement, une vue transverse **générée en lecture seule** par le pilot depuis les `TODO-PRODUIT.md` des produits déclarés, triée par acteur puis par ordre dérivé, avec la même interdiction de saisie que TODO-PRODUIT (verdict O3 de l'étude du 17/08 : aucun champ, aucun bouton, aucun dossier écouté). Objet durable touchant le noyau : **étude d'opportunité requise avant `decide`** (R-31, TF-0155). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le format de liste rédigé en session pour répondre au retour humain chiffrait l'effort en durées absolues (« moins de 5 min », « demi-journée ») | Retiré et remplacé par l'échelle **complexité × durée** de l'écosystème avant toute remise | non | Déjà couvert, et par une règle exécutée : TF-0408 et la règle **S10** d'`oracle-synthese` interdisent l'effort en jours depuis le 20/08. Le défaut était une ignorance de session, pas un manque du référentiel — R-43 tranche, la factory prime. |
| Le format rédigé proposait une taxonomie à quatre niveaux (IA seule · IA plus un choix · décision dev · action dev) au lieu du vocabulaire gelé `auto_ia` / `manuelle_dev` / `manuelle_utilisateur` | Abandonnée au profit du vocabulaire gelé de la règle 29 | non | Le niveau « IA plus un choix » n'est pas un acteur : c'est une action `auto_ia` **dépendante d'une décision du bloc 3**. Le couple bloc 3 et bloc 8 le couvre déjà exactement — à condition que RA-11 soit câblé, sans quoi cette dépendance reste invisible. Créer un cinquième terme aurait dupliqué la doctrine au lieu de l'exécuter. |
| Le format rédigé exigeait un registre d'état local au projet (`docs\backlog\registre.md`), inventé pour l'occasion | Abandonné avant toute écriture | oui → **RA-14 et RA-16** | `TODO-PRODUIT.md` EST ce registre, il existe depuis le 17/08 (TF-0318) et il n'est instancié dans aucun produit. Écrire un registre parallèle aurait créé le doublon que la factory a déjà payé (TF-0453). Ce qui est généralisable — et remonté — c'est **l'absence d'instanciation** et **l'absence de lien vers le bloc 8**. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le retour du 22/08
porte sur la **forme d'un message de restitution**, non sur un livrable. Le seul référentiel
mobilisé est `gabarits\RESTITUTION.md` (version_du_gabarit 2.4.0, 20/08) — qui est une
**consigne normative** et se déclare explicitement non marquée comme livrable — et le présent
lot, tiré de `gabarits\RETOURS-FORGES.md`. Sur ce dernier, rien n'a manqué ni gêné : les
sections R-45 et R-46 ont été trouvées, comprises et remplies sans ajout hors gabarit.

## Confirmations positives

- **Le socle demandé par l'humain existait déjà à 80 %, et c'est la mesure la plus utile du
  lot.** Bloc 3 en choix fermé avec coût, recommandation et option par défaut ; bloc 8 par
  acteur et par ordre dérivé ; interdiction de l'effort en jours ; interdiction du ✓ sans
  preuve ; bloc « non traité » avec motif obligatoire. Une doctrine écrite en août répond à un
  retour formulé le 22/08 sans l'avoir anticipé nommément.
- **R-45 a fonctionné sur ce lot exactement comme prévu.** Trois remarques allaient rester au
  produit comme « défauts de ma session ». La section obligatoire a forcé le verdict écrit, et
  l'une des trois s'est révélée généralisable — elle est devenue RA-14 et RA-16. Sans la
  section, l'absence d'instanciation de `TODO-PRODUIT.md` restait invisible.
- **Le refus d'ingestion R-46 est arrivé au bon moment** : ce lot est daté du 22/08, donc le
  premier soumis au seuil. La section a été trouvée au gabarit sans chercher, et la phrase
  d'échappement (« aucun document produit depuis un gabarit ») est explicitement prévue — la
  règle ne force pas à inventer de la matière.

## Ordre recommandé

1. **RA-11** — le seul bloquant, et le seul qui rende les cinq autres mesurables : tant que
   `auto_ia` n'engage à rien, aucune règle en aval ne peut être vérifiée. Complexité simple,
   durée courte : une règle de plus dans un oracle qui en porte déjà dix.
2. **RA-12 puis RA-13** — mêmes fichiers, même oracle, même passe : ils transforment la ligne
   remise à l'humain en ligne exécutable. C'est ce que le retour du 22/08 demande le plus
   directement.
3. **RA-15** — corriger la contradiction entre les deux référentiels du pilot avant
   d'instancier quoi que ce soit, sinon chaque produit instancie la version fausse.
4. **RA-14** — le lien entre le bloc 8 et `TODO-PRODUIT`, qui n'a de sens qu'une fois RA-15 fait.
5. **RA-16** — le plus structurant et le plus cher. À scinder : l'instanciation des
   `TODO-PRODUIT.md` (immédiate, sans étude) ne se confond pas avec la vue portefeuille
   (objet durable, étude d'opportunité due avant `decide`).
