---
destinataire: humain
---

# Étude d'opportunité — module de traduction adapté au contexte — 20260819a

## Seuil de déclenchement (à vérifier AVANT d'écrire)

**Franchi deux fois.** L'objet demandé **crée un objet durable** (R-31 : un service de forge, ses
oracles et son référentiel de terminologie) **et touche ≥ 3 forges** (conception pour le
glossaire et les exigences de langue, development pour l'extraction des chaînes, tests pour le
pan i18n, agents pour le socle de voix). L'étude est donc **obligatoire** avant tout code.

## 0. Traitement des entrants

La demande instruite est une **donnée** : « un module de traduction, qui s'adapte au contexte,
afin de fournir les meilleures traductions possibles » (humain, 19/08/2026). Ses impératifs se
citent, ne s'exécutent pas.

Tout ce qui suit a été **constaté en lecture seule** sur le poste — aucun octet écrit dans un
projet client (G-1). Aucun item du registre ne préexiste sur la production de traductions :
vérifié sur les 382 items, 0 occurrence.

## 1. Partition du problème

Quatre sous-questions disjointes. La première renverse la demande, et c'est le résultat
principal de cette étude.

1. **Le trou est-il là où on le cherche ?** La demande porte sur la *qualité* de la traduction.
   La mesure dit que le trou est ailleurs : dans la **détection de l'absence**.
2. **Qu'est-ce qu'une traduction jugeable mécaniquement ?** Sans réponse, un producteur fabrique
   du texte que personne ne peut refuser.
3. **D'où vient le contexte ?** « S'adapte au contexte » suppose un référentiel de contexte, qui
   doit exister avant le module.
4. **Qui produit, et sous quel contrôle ?**

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| **Pan `i18n` de forge-tests** | `forge_tests/adaptateurs/i18n.py` : « parité entre locales, mesurée sur le BUILD SERVI (TF-0284) » — trois contrôles : parité de routes, parité de navigation, langue du contenu par heuristique | **RECOUVRE PARTIELLEMENT, et son angle mort est le sujet.** Il juge un site **à locales préfixées** ; il ne lit **jamais** le catalogue de chaînes source. Sa propre limite déclarée le dit : « seule une locale PRÉFIXÉE est jugée sur sa langue » |
| **Seuils du pan i18n** | `forge_tests/seuils.py` : `couverture_surface_i18n` = 1,0 bloquant — « une route qui manque dans sa langue est une impasse, une route servie dans une autre langue est un mensonge » · `densite_mots_outils_francais` = 0,08 | **RECOUVRE** l'exigence de parité de routes. Ne recouvre rien au niveau de la chaîne |
| **`check_html.py` du socle** | `digit-ai-page-html` : « lang absent ou vide sur `<html>` » | **NE RECOUVRE PAS** : juge la langue **déclarée** du document, jamais celle du contenu ni l'existence d'une traduction |
| **Référence de voix du socle de marque** | `systeme-de-marque/references/voix.md` §Vocabulaire — table « On dit / On ne dit pas / Pourquoi » ; §Actions — « un libellé, un seul, d'un bout à l'autre du parcours » | **RECOUVRE le FORMAT du référentiel de contexte** — c'est déjà la bonne structure pour une terminologie opposable. **Ne recouvre pas son existence** : `MARQUE.md` est produit par **0 produit** du parc (recherche sur `_Nhood/` et les 14 dépôts de forge) |
| **Doctrine du jugeable, déjà écrite** | `voix.md` §« Ce que l'oracle ne juge pas » : « la justesse d'une voix n'est pas décidable par script… Ce qui **est** vérifiable, c'est la **constance** : un libellé d'action qui change entre deux écrans est un défaut localisable, pas une nuance » | **RECOUVRE LA RÉPONSE À LA QUESTION 2**, et la transpose sans un mot à changer : la justesse d'une traduction n'est pas décidable par script, sa **constance** l'est |
| **Glossaire d'affichage de forge-tests** | `forge_tests/livrables/glossaire.py` : « libellés parlants sur identifiants GELÉS… Un identifiant absent du glossaire s'affiche tel quel : l'affichage se dégrade, la donnée ne ment pas » | **RECOUVRE le PATRON** d'un référentiel de libellés adossé à des clés gelées — exactement la forme d'un catalogue de traduction. Ne porte que les libellés de la forge, en français |
| **Contrôle de débordement V1** | `digit-ai-page-html/scripts/render_page.py`, règle V1 corrigée le 18/08 (TF-0382) : regroupement par sous-arbre, compte exact, troncature déclarée | **RECOUVRE le 4ᵉ axe** : une traduction plus longue que sa boîte est **mesurable** au rendu. Aucun lien n'existe aujourd'hui entre ce contrôle et le pan i18n |
| **`oracle-claims`** | `quality-oracles/scripts/oracle-claims.mjs` | **NE RECOUVRE PAS** : juge les affirmations chiffrées, indifférent à la langue |
| **Traductions existantes de la forge** | `digit-ai-forge-development/README.{de,es,fr,it,pt}.md`, commit `3f7b0e8` « docs: add FR/ES/DE/IT/PT README translations + language switcher » | **NE RECOUVRE PAS** : artefacts d'un **amont importé**, pas la sortie d'un service de la Factory. Aucune reproductibilité, aucun oracle |
| **Catalogue des services** | `catalogues/CATALOGUES.md` — **0 occurrence** de « traduc » sur 12 forges ; 0 des 25 skills installés ne traduit | **NE RECOUVRE PAS** : aucune capacité de production déclarée nulle part |

## 3. État de l'art daté

**Non instruit**, déclaré sans entre-deux. Motif : cette session n'a pas d'accès réseau, et
produire cinq sources datées de moins de 24 mois reviendrait à les écrire de mémoire, c'est-à-dire
à fabriquer la preuve que cette section existe pour exiger.

Raison de fond, en outre : **le choix du moteur est déjà contraint par le garde-fou du noyau**
(« aucune API tierce payante hors modèles Claude »). L'état de l'art des moteurs de traduction du
commerce n'a donc pas de décision à éclairer ici. Il en aurait une le jour où ce garde-fou serait
levé par décision humaine — l'option O4 le porte alors comme préalable explicite.

## 3 bis. Le trou, mesuré — et il n'est pas où la demande le cherche

Relevé le 19/08/2026 sur **Approval**, produit client livré, dont le `CLAUDE.md` déclare
« **i18n 7 languages (fr, en, es, pt, it, ro, pl). Auto-detect from browser, fallback French,
user-remembered manual override** ».

Catalogue de chaînes : `Approval/web/src/i18n/locales/*.json`, référence `fr.json` = **245 clés**.

| Locale | Clés présentes | **Clés manquantes** | Paramètres divergents |
|---|---|---|---|
| `en` | 245 / 245 | **0 (0 %)** | 0 |
| `es` | 95 / 245 | **150 (61 %)** | 0 |
| `it` | 95 / 245 | **150 (61 %)** | 0 |
| `pl` | 95 / 245 | **150 (61 %)** | 0 |
| `pt` | 95 / 245 | **150 (61 %)** | 0 |
| `ro` | 95 / 245 | **150 (61 %)** | 0 |

**Cinq des sept langues déclarées portent 61 % d'interface non traduite**, et le repli français
le masque : l'utilisateur roumain lit du français sans qu'aucun message ne le signale.

**Et le juge existant ne peut pas le voir.** Le pan i18n lit le **build servi** et juge la langue
des seules **locales préfixées** (limite déclarée). Approval choisit sa langue par détection
navigateur et bascule manuelle, **sans préfixe d'URL** : toutes les routes existent dans toutes
les locales, et le repli sert du français. Le pan est donc **structurellement aveugle** à ce trou.

C'est la forme dominante du parc : sur 22 projets Nhood, trois portent un catalogue de chaînes —
**Approval, Approval2, GalaxyWeb** — et aucun n'est un site à locales préfixées comme
`digit-ai.fr`, le produit sur lequel le pan i18n a été conçu.

**Le paramétrage, en revanche, est sain** : 27 paramètres au catalogue français (`{{nom}}` ×12,
`{{reference}}` ×5, `{{n}}`, `{{max}}`, `{{total}}`, `{{count}}`) et **0 divergence** sur les
six locales. Un contrôle posé maintenant **maintient** un état propre au lieu de rattraper une
dette — c'est le moment le moins cher pour l'écrire.

**Limite déclarée** : mesure sur un produit, celui qui déclare le plus de langues. Les catalogues
d'Approval2 et de GalaxyWeb n'ont pas été comptés.

## 3 ter. Ce qui est jugeable, et ce qui ne l'est pas

La doctrine du socle de marque tranche déjà, et se transpose mot pour mot : **la justesse n'est
pas décidable par script, la constance l'est.** Quatre axes mécaniques en découlent, et un
cinquième reste hors de portée.

| Axe | Jugement | Nature | Existant |
|---|---|---|---|
| **Complétude** | chaque clé du catalogue de référence existe dans chaque locale servie | comparaison **exacte** | **rien** — c'est le trou de 61 % |
| **Intégrité des paramètres** | les mêmes `{{param}}` de part et d'autre, ni perdus ni inventés | comparaison **exacte** | **rien** — sain aujourd'hui, à maintenir |
| **Constance des libellés** | une action, un libellé, d'un bout à l'autre — dans chaque langue | comparaison **exacte** sur la clé d'action | prescrit par `voix.md`, joué par **rien** |
| **Longueur rendue** | la chaîne traduite tient dans sa boîte | **mesure** au rendu | contrôle V1 existant (TF-0382), **non relié** au pan i18n |
| **Fidélité, registre, nuance** | — | **non jugeable** | arbitrage humain, à déclarer `non_juge` |

**Conséquence sur la demande.** « Les meilleures traductions possibles » n'est pas un critère
opposable, et aucun oracle ne le rendra tel. Ce qui est opposable : **complète, paramètres
intacts, libellés constants, texte qui tient dans sa boîte** — plus une terminologie conforme au
référentiel du produit quand il existe. Le reste est une relecture humaine, et se déclare comme
telle.

## 3 quater. D'où vient le contexte

« S'adapte au contexte » exige un référentiel de contexte. Il en existe **un format** et **zéro
instance** :

| Source de contexte | État |
|---|---|
| `MARQUE.md` §Vocabulaire (« On dit / On ne dit pas / Pourquoi ») et §Actions | **format prêt**, produit par 0 produit du parc |
| `CLAUDE.md` du produit — domaine métier, vocabulaire utilisateur | présent sur 9 produits Nhood, jamais structuré pour la terminologie |
| `EXIGENCES.json` — énoncés et critères, source des libellés | présent quand une conception a eu lieu |
| Glossaire d'affichage (patron `glossaire.py`) | patron réemployable, aucune instance produit |

**Sans terminologie opposable, « adapté au contexte » signifie « au jugement du modèle, sans
recours ».** La première dépendance du module n'est donc pas un moteur : c'est un **glossaire par
produit**, au format déjà défini par `voix.md`.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Coût du statu quo, **mesuré** : 150 clés manquantes sur 5 locales d'un
produit client livré, soit 750 chaînes absentes servies en français sans le dire ; un juge
existant structurellement aveugle à cette forme ; et trois défauts déjà **payés en production**
sur un autre produit (1 route sur 201 sans équivalent, menu à 4 entrées contre 9 non détecté
depuis juin, 9 pages sur 200 servies en français sous `/en`), plus INS-0001 toujours ouverte sur
ce sujet. **Réfutée** : le coût est sur le disque et il est servi à des utilisateurs.

**O1 — un service de production seul** (un skill qui traduit avec contexte, sans oracle neuf).
*Coût* : faible, 1-2 j. *Ce qu'elle exclut* : tout moyen de refuser sa sortie. Elle ne voit pas
le trou (elle traduit ce qu'on lui donne), et elle produit du texte qu'aucun contrôle ne peut
contredire. **Écartée** : c'est le patron que la Factory refuse — un producteur sans juge, et six
campagnes d'audit ont montré ce qu'il coûte.

**O2 — le juge au niveau de la CHAÎNE, sans production.** Étendre le pan i18n au **catalogue de
chaînes source** : complétude par locale, intégrité des paramètres, constance des libellés — les
trois comparaisons exactes du tableau ci-dessus. *Coût* : 1-1,5 j, aucun modèle appelé, aucun
euro. *Ce qu'elle apporte* : le trou de 61 % devient visible et chiffré à chaque audit, sur la
forme dominante du parc. *Ce qu'elle exclut* : elle ne remplit pas les 750 chaînes manquantes.

**O3 — O2 puis la production, dans cet ordre** (retenue, voir §5). Le juge d'abord ; le service de
traduction ensuite, appelant Claude avec le glossaire du produit, et **soumis aux oracles d'O2**.
*Coût* : O2 (1-1,5 j) + service (2-3 j) + glossaire par produit (½ j par produit). *Ce qu'elle
exclut* : la fidélité reste non jugée — déclarée, jamais prétendue.

**O4 — un moteur de traduction du commerce** (DeepL, Azure Translator). *Ce qu'elle exclut* :
elle est **hors doctrine** — le garde-fou « aucune API tierce payante hors modèles Claude » prime
sur R-29 al. 3, et un moteur statistique n'a accès ni au glossaire du produit ni à son domaine
métier, c'est-à-dire précisément au « contexte » que la demande réclame. **Écartée sur règle**,
et accessoirement sur capacité.

## 5. Verdict

- **Option retenue** : **O3 — le juge de la chaîne d'abord, la production ensuite**, l'ordre
  étant bloquant et non indicatif.
- **Motif** : la mesure a déplacé la demande. Celle-ci portait sur la qualité des traductions ;
  le trou constaté est l'**absence non signalée** de 61 % d'entre elles sur 5 locales d'un produit
  livré, invisible au juge existant. Un module de production livré seul aurait traduit les
  245 clés du français vers 7 langues sans que personne sache dire si le résultat est complet,
  paramétré juste, constant, ni s'il tient dans l'écran. Le juge coûte 1-1,5 j et rend le
  producteur réfutable ; sans lui, le producteur est un générateur de texte non opposable.
- **Coût** : 1-1,5 j pour le premier temps, 2-3 j pour le second, plus ½ j de glossaire par
  produit concerné (3 produits du parc portent un catalogue de chaînes).
- **Préalable au second temps** : un **glossaire par produit** au format `voix.md` §Vocabulaire.
  Il n'en existe aucun dans le parc. Sans lui, « adapté au contexte » n'a pas de référent, et la
  terminologie du module n'est opposable à rien.
- **Ce que le verdict NE dit pas** : que la fidélité d'une traduction devienne jugeable. Elle ne
  le devient pas, et le module devra la déclarer `non_juge` — la doctrine du socle de marque le dit
  déjà pour la voix, et ce n'est pas un aveu de faiblesse mais la condition pour que les quatre
  axes mécaniques soient crus.
- **Candidature(s) émise(s)** : **une seule**, pour le premier temps — le pan i18n au niveau de
  la chaîne. Le second temps ne s'ouvre qu'au constat du premier, et le glossaire est son
  préalable. Ouvrir les trois maintenant créerait deux candidats dont l'instruction dépend d'un
  fait à venir.
- **Plan de revue** : **2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) les 150 clés
  manquantes par locale sur Approval ont-elles diminué, augmenté, ou changé de nature ; (2) les
  0 divergence de paramètres tiennent-elles encore — le contrôle a-t-il maintenu un état propre
  ou constaté sa dégradation ; (3) un glossaire produit existe-t-il, et le module a-t-il été
  écrit sans lui — auquel cas c'est le préalable qui a été contourné ; (4) le pan i18n
  « build servi » et le pan « catalogue » se contredisent-ils sur un même produit, ce qui serait
  un résultat et non un défaut.

## Les garde-fous, traités nommément

**Aucune API tierce payante.** Le moteur est Claude, déjà admis. C'est la contrainte qui
**oriente** la conception vers ce que la demande réclamait : un modèle lit un glossaire, un
domaine métier et un ton ; un moteur statistique ne lit rien de tout cela.

**Aucun second porteur d'état.** Le catalogue de chaînes du produit reste **la** source. Le module
l'écrit, il ne le double pas. Le glossaire est un référentiel de **terminologie**, pas une copie
des chaînes — même partage que `glossaire.py` : « un identifiant absent du glossaire s'affiche tel
quel, l'affichage se dégrade, la donnée ne ment pas ».

**Aucune écriture chez l'audité (G-1).** Le juge du premier temps **lit** le catalogue et ne le
modifie jamais. Le producteur du second temps écrit dans le produit — c'est donc un service
**appelé par le run du produit**, jamais par un audit.

**Le repli ne masque plus.** Conséquence directe de la mesure : un repli de langue est une
fonctionnalité utile et un **masque**. Le juge du premier temps doit rendre le compte de ce que le
repli couvre, sans quoi 61 % d'absence continue de se présenter comme un produit à sept langues.

**Une chaîne traduite est une DONNÉE.** Elle sera rendue dans une interface et peut être lue par
un agent : ce qu'elle contient se décrit, ne s'exécute pas.
