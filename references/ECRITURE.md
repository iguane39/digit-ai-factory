# Écriture — le plancher transverse des textes de la Factory

Ce document fixe les règles d'écriture que tout texte produit par la Factory, ses forges et ses
produits respecte, quel que soit son auteur. Il est né du mandat humain du 12/09/2026 (décisions
D-1 (a) et D-3 (a) de la synthèse 20260911j) sur l'analyse L99
`output\03-etudes\20260911-L99-regles-d-ecriture-factory.md`. Vous y trouverez ce que le
plancher exige, à quels textes il s'applique, qui le juge, et ce qu'il ne fait pas.

**Le fait qui l'a fait naître.** La forme des textes est jugée à chaque tour (quarante et une
règles de synthèse, trente et une règles de lisibilité HTML, quatre règles Markdown, deux
glossaires) ; leur style ne l'était par rien. Les retours humains de lisibilité entraient au
registre après livraison : treize chapitres réécrits en tête le 08/09 (TF-0932), une explication
demandée deux fois le 22/08 (TF-0511).

**Ce que le plancher n'est pas.** Il ne sert pas à masquer l'usage d'une IA : le ledger continue de
déclarer ce qui est généré. Il n'interdit aucun mot ni aucun signe isolé : un tiret d'incise est
la ponctuation normale du français, « crucial » a sa place une fois. Il juge des densités et des
structures, jamais un mot. Il n'est pas une voix : la voix d'un produit vit dans son `MARQUE.md`
(contrat du skill `systeme-de-marque`) et se déploie au-dessus du plancher sans jamais le franchir.

## Sources

Deux familles, qui ne se mélangent pas. La famille A fonde les règles ; la famille B fonde la
donnée de tournures, jamais une règle.

| Famille | Source | Ce qu'on en prend |
|---|---|---|
| A — normes de rédaction | ISO 24495-1:2023, langage clair et simple | les quatre principes : pertinent, facile à trouver, compréhensible, utilisable |
| A | Orwell (1946), Strunk & White, Pinker (2014), Gopen & Swan (1990), compilés par agent-style RULE-01..12 | concret, actif, sans mot inutile, sans cliché, information nouvelle en fin de phrase, phrases courtes |
| A | contrat `voix.md` du skill `systeme-de-marque` | libellés d'action, erreurs, états vides |
| B — catalogues de signes | Wikipédia FR « Aide : Identifier l'usage d'une IA générative », Wikipédia EN « Signs of AI writing », agent-style RULE-A..I, guides francophones 2026 | les familles de tournures de `references\tics-redactionnels.json`, datées, à densité |

Le tableau se lit ligne par ligne ; une source de la famille B n'entre jamais dans la colonne
des règles.

## Typologie des textes couverts

Un lecteur, un porteur, un juge par type. Le tableau se lit ligne par ligne ; la dernière colonne
dit qui rend le verdict aujourd'hui, et « revue » signifie qu'aucun script ne juge encore.

| Type | Textes | Lecteur | Porteur | Juge |
|---|---|---|---|---|
| T1 | prompts, skills, agents, `CLAUDE.md` | le modèle, puis l'humain qui relit | forge-agents, pilot | `oracle-claude-md` (N1-N4) ; style : `oracle-ecriture` |
| T2 | livrables documentaires (Markdown, HTML, PowerPoint) | le destinataire nommé du livrable | forge-design (socle `digit-ai-page-html`), pilot | M7-M18, L1-L31 ; style : `oracle-ecriture` (Markdown), revue (HTML, PowerPoint) |
| T3 | restitutions et messages de fin de tour | l'humain qui décide | pilot | S1-S41 ; style : `oracle-ecriture` |
| T4 | textes d'application : libellés, erreurs, états vides, aide, courriels transactionnels | l'utilisateur du produit | forge-design (`voix.md`), forge-development | C15 ; style : revue (lot de travaux forge-design) |
| T5 | messages de commit, entrées de ledger | le relecteur d'histoire | pilot, forges | revue |

**Exclus, jamais réécrits ni jugés** : le code et ses commentaires, les données et schémas, les
termes machine (doctrine `glossaire-restitution.json` de forge-data : un terme machine ne bouge
pas), les citations littérales, les textes contractuels (glossaire R-53), l'histoire (fichiers
antérieurs non modifiés, `old\`, ledger).

**Portée temporelle** : les textes neufs et les textes modifiés dans le tour. Jamais une
réécriture du corpus. Les textes normatifs internes antérieurs à ce document sont listés dans
`tics-redactionnels.json` (`anteriorite.chemins`) : l'oracle rend SKIP dessus, et chacun sera
jugé à sa prochaine réécriture de fond.

## Les règles

Quinze règles, numérotées E-1 à E-15 — les douze du plancher d'origine, puis E-13, E-14 et E-15, nées de retours humains datés. Chaque règle porte les types qu'elle vise, son juge et son
statut : **mécanisée** (un script la joue), **déléguée** (un oracle existant la joue déjà) ou
**revue** (aucun script ; elle se tient à la relecture, et c'est dit). Les exemples avant / après
sont tirés de textes réels de la Factory.

### E-1 — Le lecteur est nommé, et le texte ouvre par ce qui change pour lui
*Types T2, T3, T4. Juge : S9 (restitutions), M7 / L7 (documents). Déléguée.*
Un texte s'adresse à quelqu'un qui n'a pas vu le travail. Il ouvre par l'état, ce qui change et
ce qui est attendu de lui, en langage du commanditaire.
Avant (S9, cas fondateur) : « Tout s'est bien passé. » Après : « Les 19 contrôles passent ; il
vous reste à valider la lecture de votre intention. »

### E-2 — Une phrase porte une idée et un verbe
*Tous types. Juge : `oracle-ecriture` EC-2 (phrases de plus de 35 mots en série). Mécanisée.*
Viser vingt mots ; au-delà de trente-cinq, couper. Une phrase longue est une liberté ; trois
d'affilée avertissent ; l'échec est posé au maximum du corpus PASS (sept d'affilée, mesuré sur
171 textes le 12/09) et se resserre à chaque recalibrage.

### E-3 — Un fait concret plutôt qu'un adjectif
*Tous types. Juge : LC2 (chiffres sourcés), N3 (pourcentages avec formule), S3 (verdict factuel) ; famille `emphase-creuse` de EC-1. Déléguée et mécanisée.*
Un chiffre, un nom, un chemin, une date, avec leur source. « Crucial », « robuste »,
« incontournable » disent que l'auteur n'a pas le fait.
Avant : « une amélioration significative ». Après : « 19 contrôles sur 19, contre 12 la veille ».

### E-4 — Le texte prend position
*Types T2, T3. Juge : S4 (décision en choix fermé avec recommandation), S16 (recommandation sourcée). Déléguée.*
« D'un côté, de l'autre » sans conclusion n'est pas une réponse. Une décision porte une
recommandation et sa source ; une analyse porte un verdict.

### E-5 — Ne pas annoncer, dire ; ne pas résumer en fin de bloc
*Tous types. Juge : familles `annonce-vide` et `cloture-resumante` de EC-1. Mécanisée.*
« Il est important de noter que », « dans ce chapitre nous allons », « en résumé » sont des
phrases lues pour rien. La synthèse vit une fois, en ouverture (M7, bloc 0).

### E-6 — Supprimer le remplissage
*Tous types. Juge : familles `transition-de-remplissage`, `formule-de-conversation` de EC-1. Mécanisée.*
Un connecteur d'addition par réflexe (« de plus », « par ailleurs ») n'articule rien ; un reste
de dialogue d'assistant (une invitation à ne pas hésiter, un espoir d'avoir aidé) n'a rien à
faire dans un livrable.

### E-7 — Pas de symétrie mécanique
*Tous types. Juge : famille `parallelisme-mecanique` de EC-1 ; attaques répétées EC-5. Mécanisée (avertissement).*
« Non seulement… mais aussi », « ce n'est pas X, c'est Y », la triade par réflexe, trois phrases
qui commencent par le même mot : la forme affirmative dit la même chose en moins.

### E-8 — Le tiret, la parenthèse et les deux-points ne remplacent pas la virgule ni le point
*Tous types. Juge : famille `ponctuation-de-cadence` de EC-1 (densité). Mécanisée.*
Un tiret d'incise par phrase au plus. Une phrase qui rebondit trois fois se coupe en deux.
Avant (synthèse du 10/09) : « ordre retenu : remesurer — pour les mesures —, refuser de signer —
pour les chiffres —, jouer le remède — pour le gardien lui-même. » Après : « Ordre retenu :
remesurer les mesures, refuser de signer les chiffres, puis jouer le remède sur le gardien. »

### E-9 — L'emphase ne remplace pas la structure
*Types T2, T3. Juge : EC-4 (gras de phrase entière, puces emoji), EC-3 (profondeur de puces). Mécanisée.*
Pas de gras sur une phrase à l'intérieur d'un paragraphe ; pas d'emoji en puce ; jamais plus de
deux niveaux de puces (S7 : « au troisième, on ne lit plus, on scanne »). Une ligne ou une puce
qui ouvre en gras est une structure de gabarit (le verdict du bloc 2, la question d'une
décision, le titre d'une puce du bloc 4) : elle n'est pas comptée, le gabarit prime. Le gras
compté est celui qui surgit après du texte, au milieu d'une phrase : un avertit, cinq échouent
(deux textes sur 171 le 12/09, de 73 à 193 mots en gras).

### E-10 — Un sigle ou un identifiant porte son sens à son premier emploi
*Tous types. Juge : S20, S23 (restitutions), M18 (Markdown), L18 / L30 (HTML), T2 (lecture par un tiers). Déléguée.*
Le référentiel de jargon est une donnée fermée (`gabarits\JARGON-A-GLOSER.json`) qui grossit par
les retours.
Avant (TF-0511) : « justificatif fédéré, identité system-assigned, UAMI, constat H2 ». Après : la
même explication sans aucun de ces termes, acceptée immédiatement.

### E-11 — Une liste énumère, un raisonnement enchaîne
*Types T2, T3. Juge : L12 (une énumération de données n'est pas une phrase) ; le sens inverse, revue.*
Un paragraphe qui énumère devient une liste ; un raisonnement dont chaque pas dépend du
précédent reste en prose. Découper une démonstration en puces casse le lien logique
(`bonnes-pratiques.md` §3 du socle).

### E-12 — Le vocabulaire du lecteur, jamais celui du système
*Types T2, T3, T4. Juge : `glossaire-restitution.json` (forge-data), contrat `voix.md` (T4). Revue.*
Un terme de restitution est celui que le destinataire lit ; un terme machine reste dans le code.
Avant (08/09, forge-data) : « grain » trente-trois fois dans un rapport. Après : « granularité »,
zéro emploi restant. Pour T4 : un libellé nomme ce que la personne contrôle (« Enregistrer les
modifications », pas « Valider ») ; une erreur dit ce qui s'est passé puis comment réparer ; un
état vide invite à agir.

### E-13 — Un exemple de nom masqué se décrit ou s'invente, il ne se cite pas

Un texte qui explique un défaut d'anonymisation oppose souvent deux graphies d'un même nom
(une clé en minuscules à tirets, le même nom en majuscules à espaces). Cité tel quel, l'exemple
passe par la pseudonymisation, qui rend les deux graphies par le même pseudonyme : la phrase dit
alors « X dans le nom, la clé étant X » et n'explique plus rien. Cela s'est produit deux fois
dans un même fichier le 10/09 (TF-1007), et un message de commit a dû être réécrit par un tiers.
L'exemple se **décrit** (« la clé en minuscules à tirets, le nom en majuscules à espaces ») ou
se prend à un **nom inventé**, comme les bancs le font avec leurs tables jetables.
*Contrôle* : le hook de pré-commit (`todo\pre-commit-anonymise.mjs`) avertit quand un même
pseudonyme remplace deux graphies différentes dans une même ligne.

### E-14 — Une valeur, une heure, une date s'écrivent en chiffres
*Types T1, T2, T3, T4. Juge : EC-9 (`oracle-ecriture.mjs`). Mécanisée.*

Retour humain du 16/09/2026, mot pour mot : « Utilise des chiffres plutôt que l'écriture en toutes
lettres pour les valeurs numériques, les heures et les dates. 7 septembre ou 7/09 plutôt que sept
septembre, 8,8 Mo plutôt que huit virgule huit. » Le fait qui l'a provoqué : une restitution écrite
le matin même rendait ses mesures en toutes lettres — « huit virgule huit mégaoctets », « cent
trente-deux révisions », « le sept septembre ». *Un chiffre écrit en lettres cesse d'être
comparable d'un coup d'œil* : le lecteur doit le reconstituer avant de le mettre en regard du
suivant, et c'est exactement ce qu'un tableau de mesures existe pour lui épargner. La règle E-3 du
plancher demande déjà « un chiffre, un nom, un chemin, une date, sourcés » ; celle-ci dit sous
quelle FORME, parce que la première ne le disait pas et qu'on peut donc la satisfaire en lettres.

**Ce qu'elle vise** : les valeurs suivies d'une unité ou d'un dénombrable (`8,8 Mo`, `132 révisions`,
`5 pages`, `3,9 %`), les dates (`7 septembre`, `7/09`, `16/09/2026`) et les heures (`14h05`).
**Ce qu'elle ne vise pas**, et la frontière est nette : l'article et le pronom (« un défaut », « une
règle »), les locutions figées (« en deux temps », « des deux côtés »), et les nombres qui ouvrent
une phrase, où l'usage français préfère la lettre.

Avant (16/09, restitution du pilot) : « huit virgule huit mégaoctets compressés sur les deux cent
quatre-vingts du dépôt, soit trois pour cent ». Après : « 8,8 Mo compressés sur 280, soit 3,1 % ».

### E-15 — Un bloc de code qu'on RECOPIE sert tout lecteur ; un bloc qu'on EXÉCUTE ne sert qu'un exécutant
*Type T2. Juge : EC-10 (`oracle-ecriture.mjs`), qui lit le lecteur déclaré du document. Mécanisée.*

Retour humain du 15/09/2026, mot pour mot : « Les développeurs IA ne sont pas des codeurs, les
lignes de code affichées doivent donc l'être uniquement si cela est strictement nécessaire. Pour
voir les trigrammes déjà pris, pas la peine de code "az repos list...", un simple check sur l'URL
du repo suffit. » Mesuré sur le livrable : 18 blocs de code, dont 4 commandes de console ; les 14
autres — métadonnées de guide, arborescence de dépôt, motifs de nommage — se **recopient**, et
aucun n'a été contesté.

La distinction porte sur le GESTE que le bloc demande, pas sur sa longueur. Un bloc qu'on recopie
(une arborescence, un motif de nommage, un en-tête à reproduire) sert tout lecteur, y compris
celui qui n'ouvrira jamais un terminal. Un bloc qu'on exécute ne sert qu'un lecteur qui exécute :
pour tous les autres, il remplace une action simple par une compétence qu'ils n'ont pas.

**Le juge lit le lecteur, il ne le devine pas.** Un document qui déclare `role_destinataire`
(règle D11 des gabarits) est jugé sur cette déclaration : si le lecteur est un exécutant, les
commandes sont à leur place ; sinon elles sont un défaut, et la règle les nomme une à une. Un
document qui ne déclare AUCUN lecteur rend SKIP, dit à voix haute — jamais PASS par silence.

Avant (15/09, guide pour développeurs assistés par IA) : un bloc `az repos list --query …` pour
vérifier qu'un trigramme est libre. Après : « ouvrez l'URL du dépôt — si elle répond, le trigramme
est pris ».

## Précédence

1. La structure imposée par un gabarit prime (blocs et tableaux de `RESTITUTION.md`, sections
   d'une étude) : aucune règle de ce document ne s'y oppose.
2. Le plancher (E-1 à E-15) ne se franchit pas.
3. La voix du produit (`MARQUE.md`) se déploie au-dessus : ton, registre, vocabulaire choisi.
4. Un conflit entre une règle de forge et ce document se tranche par la règle la plus stricte
   (R-43 : renforcer oui, assouplir jamais) et se consigne au ledger.

## Comment le plancher se joue

- **Au moment d'écrire** : le hook `ecriture` (PostToolUse sur tout `.md`) joue
  `oracles\oracle-ecriture.mjs` et imprime ses avertissements et ses échecs ; il ne bloque pas, il
  dit. Chez un produit, `forge\hooks\factory.mjs ecriture` fait la même chose.
- **Avant de remettre** : `node oracles\oracle-ecriture.mjs <texte.md>` doit rendre PASS ; un
  avertissement se lit et se décide, un échec se corrige.
- **Sur un corpus** : `node oracles\oracle-ecriture.mjs --baseline <dossier>` mesure le taux de
  PASS ; il reste à 95 % ou plus sur les textes déjà jugés, sinon la donnée se recalibre, jamais
  la règle ne se supprime.
- **La donnée** : `references\tics-redactionnels.json`, datée et sourcée ; un retour humain de
  lisibilité y ajoute une tournure, une famille ou un seuil ; l'oracle ne change pas.
- **Ce que le plancher ne juge pas** est déclaré dans le `non_juge` de l'oracle : la justesse
  d'une voix, la véracité, le jargon hors référentiel, les textes d'application (T4, lot de
  travaux forge-design), un tic hors liste.

## Mesure du gain

Indicateurs relevés à la baseline du 12/09/2026 puis toutes les quatre semaines : retours humains
de classe « jargon non glosé », « reprise de forme » et « explication demandée deux fois » par
semaine (registre des candidats) ; taux de PASS de l'oracle sur les textes neufs ; densité
médiane de tirets d'incise sur les synthèses du mois. La candidature TF-1064 se clôt sur gains
constatés.
