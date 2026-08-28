# Consigne de restitution — le message de fin de traitement

**Marquage du fichier de synthèse (TF-0331, 18/08)** : la synthèse remise à l'humain naît
avec `destinataire: humain` en frontmatter YAML. La localisation R-2/E9 ne juge que ce qui
est MARQUÉ — sans porteur, la règle est un faux négatif volontaire : elle est livrée,
prouvée à zéro faux positif, et ne voit rien. Le marquage a été vérifié toléré par
`oracle-synthese` (S1-S8 à l'époque, S1-S30 depuis la v2.11.0) sur une synthèse réelle PASS avant d'être prescrit ici.
Cette consigne, elle, ne se marque PAS : c'est un référentiel normatif, pas un livrable.

Référentiel versionné (loi n° 4, daté-éditable) — **version 2.11.0, 28/08/2026** (règle **S30** :
toute décision du bloc 3 porte un NUMÉRO, et les numéros sont distincts — retour humain du 28/08,
« Il n'y a pas de numéro sur les décisions, je ne peux pas les sélectionner »). Précédente :
**2.10.0, 23/08/2026** (règle **S21**,
second volet de S12 : un motif `acces` ou `presence` porte la TRACE MESURÉE de la tentative — un
code de réponse, un message d'erreur, une sortie de commande. Le destinataire a contesté sept lignes
sur neuf d'un relevé, dont plusieurs par « pourquoi ce n'est pas déjà fait par l'IA ») — précédente :
**2.9.0, 22/08/2026** (mandat humain
« traite tous les todos et retours » : cinq retours de forme du 22/08 traités d'un coup, tous
mesurés sur la même session — **S17** un renvoi nomme son sujet et jamais une position ·
**S18** les tableaux d'un même bloc portent le même en-tête · **S19** toute action dit ce qui se
passe si elle n'est PAS faite, symétrique de S16 côté actions · **S20** le jargon des blocs 3 et 8
porte sa glose, référentiel `gabarits\JARGON-A-GLOSER.json` · et le **bloc 8 se rend en TABLEAU**,
l'acteur étant une colonne et non une section. S'y ajoute la correction du faux négatif de S9 sur
son propre titre) — précédente : **2.8.0, 22/08/2026** (règle **S16** : une décision porte sa RECOMMANDATION et la SOURCE consultée d'où elle sort — une question dont la réponse est dans un document déjà fourni ne se pose pas) — 2.7.0 du 22/08 (règle **S15** : une décision RAPPELLE SON SUJET avant ses options — 25 mots au moins, sans identifiant nu ; retour humain du 22/08 « je ne peux pas me rappeler TF-0469 et vue portefeuille ») — 2.6.1 du 22/08 (`hors_mandat` ajoute au vocabulaire de S11 le jour meme, cf. section du bloc 8) — 2.6.0 du 22/08 (TF-0457 à TF-0461, retour humain du 22/08 sur la forme des listes de tâches : le bloc 8 cesse d'être une liste d'étiquettes — une action `auto_ia` non exécutée porte son motif (**S11**), une action laissée à l'humain porte sa raison d'impossibilité IA (**S12**), elle est exécutable telle quelle (**S13**), et elle porte un identifiant stable (**S14**). Les quatre entrent en **AVERTISSANTES** au sens de la v2.5.0 : une action sans motif rend la liste moins utile, jamais illisible — et le doublon d'affichage qu'un blocage provoque coûterait plus que le défaut qu'il dénonce. Elles se durciront quand le corpus sera propre, comme la v2.0.0 l'a fait avant elles) — précédente : **2.5.0, 22/08/2026** (retour humain
« le prompt de résultat s'affiche 2 fois » : un hook `Stop` juge APRÈS l'affichage, donc chaque
refus laissait la version rejetée à l'écran et faisait relire huit blocs. Le gate reste, il
devient **proportionné** : **bloquantes S1, S3, S4, S6** — la restitution est inutilisable sans
elles ; **avertissantes S2, S5, S7, S8, S9, S10** — dites en une ligne sous la réponse,
journalisées, jamais réécrites. Mesure qui a tranché : les trois refus en session réelle
portaient tous sur S8, jamais sur la structure) — précédente : **2.4.0, 20/08/2026** (R-44 : l'oracle devient **BLOQUANT** par le hook `Stop` `oracles\hook-restitution.mjs` — tout message de fin de tour de travail est jugé avant d'être accepté ; décision humaine du 20/08 « à retravailler pour s'assurer que cela est bien exécuté », qui clôt le statut « informatif » de la v2.0.0) — précédente : 2.3.0 du 20/08 (TF-0407 : bloc 0 « synthèse d'ouverture », règle S9 ; TF-0408 : effort en complexité × durée, jamais en jours, règles S10/E8) — antérieure : 2.1.0 du 15/08 (TF-0249 : appelants nommés, synthèse EN FICHIER jugée avant affichage ; TF-0250 : oracle renommé `oracle-synthese`) — **v2.0.0 du 14/08 ADOPTÉE telle
quelle par décision humaine du 14/08** (option (a) : les 8 blocs restent, l'oracle reste
**informatif** et non bloquant tant qu'on ne l'a pas vu tenir sur plusieurs clôtures réelles).
Il régit
**tout message de fin de traitement**, quelle que soit la forge et quel que soit le projet :
clôture de run, fin de campagne, fin de mandat, synthèse remise à l'humain, et le bloc final
qu'une CLI ou une recette imprime au terminal.

Version 1 (TF-0147, 13/08) cadrait la forme en 6 règles. Elle avait deux défauts que cette
version corrige, et le second explique le premier :

- **elle n'était citée par aucun run** — ni au noyau, ni aux étapes, ni à l'accueil. Une
  convention qu'aucun run ne charge ne s'applique pas : elle décore ;
- **elle n'avait aucun contrôle exécuté** (« sa tenue se vérifie à la relecture »), alors que
  la loi transverse de l'écosystème dit qu'un ✓ sans oracle exécuté n'est pas un ✓. Une
  consigne de forme se contrôle mécaniquement — c'est même le seul genre de règle qui le peut
  entièrement.

> **Règles de FORME uniquement, toutes binaires.** Aucune règle de jugement (« exigeant »,
> « satisfaisant », « de qualité ») : un persona ne remplace pas un oracle exécuté. La
> restitution **rapporte ce que les oracles ont mesuré, elle ne le proclame pas**.

## La structure, dans cet ordre

**0. Synthèse d'ouverture — en langage commanditaire (TF-0407, 20/08/2026).** Avant le bloc 1,
un paragraphe de prose (≥ 20 mots) qui dit trois choses et rien d'autre : **l'état** (où en
est-on), **ce que ça change** (la conséquence pour le lecteur), **ce qui est attendu de lui**.
Sans identifiant nu, sans chemin de fichier, sans span de code, sans sha — un terme technique
employé là porte sa glose d'une ligne. *Le retour qui a fait naître ce bloc est la mesure
elle-même* : le destinataire unique des restitutions a dit qu'une partie ne lui parvenait pas,
et une information remontée et non comprise a le même effet qu'une information tue, avec le
coût de lecture en plus. **On ordonne, on ne supprime jamais** : identifiants, preuves et
chemins restent dans les blocs 1 à 8, intacts — une restitution agréable et invérifiable serait
pire que l'état antérieur (doctrine RL-1/RL-7 des rapports, transposée ; contrôle : S9
d'`oracle-synthese`, double sens au self-test). **Et partout dans la restitution comme dans les études : l'effort ne se chiffre JAMAIS en jours** (TF-0408, retour humain du 20/08 : « je croyais qu'on ne parlait plus de jours ») — il parle en **complexité** (simple | moyen | complexe | très complexe) **× durée** (court | moyen | long | très long), l'échelle du rapport d'audit ; les FAITS mesurés (« trois jours de production ») restent des faits. Contrôles : S10 ici, E8 aux études.

Huit blocs ensuite. **Aucun ne disparaît** : un bloc sans contenu se réduit à **une ligne qui le dit**
(« aucun risque identifié », « rien n'attend de décision »). C'est la loi transverse n° 3 —
l'oubli n'existe pas : une section absente est indiscernable d'une section oubliée, et le
lecteur ne peut pas faire la différence.

### 1. En-tête d'identification

Sur une ligne ou deux, toujours les mêmes champs :

- **quoi** — la nature du traitement (run, campagne, mandat, audit, recette) ;
- **sur quoi** — le produit ou la forge, nommé ;
- **quand** — **date ET heure de fin, avec le fuseau**, plus la **durée** du traitement ;
- **qui** — l'agent ou la forge, avec sa version ou son commit.

*Pourquoi l'heure* : plusieurs traitements tombent le même jour — le 14/08 en a vu quatre pour
un seul produit. Sans heure, deux synthèses du même jour ne s'ordonnent pas, et « le dernier
état » devient une devinette. La durée, elle, est ce qui permet de dire si un traitement a été
tronqué.

### 2. Verdict en une ligne

Ce que le lecteur retiendrait s'il ne lisait que ça. Un fait, pas une appréciation : *« recette
S-01 TENU, 19/19 au banc rouge »*, jamais *« tout s'est bien passé »*.

### 3. Décisions attendues de l'humain

**En tête, jamais en fin.** Chaque décision est présentée en **choix fermé** — l'humain
tranche, il ne rédige pas :

- **un NUMÉRO, distinct des autres** (règle **S30**, v2.11.0) — c'est par lui que l'humain
  répond, et sans lui il numérote de tête ou rédige en prose ;
  - **le RAPPEL DU SUJET — au moins 25 mots, sans identifiant nu** (règle **S15**, v2.7.0) ;
  - **la RECOMMANDATION, et la SOURCE consultée d'où elle sort** — ou la déclaration qu'aucune
    source disponible ne répond (règle **S16**, v2.8.0) ;
  - les options `(a)` / `(b)` / `(c)`, chacune avec **son coût et ce qu'elle exclut** ;
  - la recommandation, **et pourquoi** ;
  - ce qui se passe si rien n'est décidé (l'option par défaut existe toujours — la nommer).

Si rien n'attend l'humain : le dire en une ligne.

#### Une question dont la réponse est dans les documents ne se pose pas (S16, 22/08/2026)

*Retour humain du 22/08, sur une décision qui demandait de nommer un rôle* : **« tu aurais dû être
en capacité de déduire son nom du dossier que j'ai fourni, pourquoi ne l'as-tu pas fait ? Fais en
sorte que les prochaines fois, ce genre de questions soit répondu par l'IA automatiquement, au
moins préconisé a minima. »** Le nom était à la **première ligne** du dossier de mise en
production, fourni deux jours plus tôt.

Le coût est **asymétrique**, et c'est ce qui rend la règle nécessaire : chercher coûte une seconde
à l'agent, et ne pas chercher coûte au lecteur un aller-retour, plus la réouverture d'un document
que l'agent avait déjà sous la main. C'est le même défaut que S13 corrige au bloc 8 — faire payer
au lecteur un travail que l'agent pouvait faire — mais au bloc 3 il est le plus cher : **il
transforme une lecture en arbitrage.**

« Dérivable » ne se teste pas à la machine. Ce qui se teste, c'est la **trace d'avoir cherché** :

- une décision **sans recommandation** est une question rendue telle quelle ;
- une recommandation **sans source** est une opinion.

Les deux sont exigées, et la source est un localisateur ordinaire — le document, le fichier, la
ligne d'où sort la réponse proposée. Quand rien dans les pièces disponibles ne répond, **le dire
explicitement** vaut source : c'est une information, pas un aveu.

#### Une décision se SÉLECTIONNE, donc elle porte un NUMÉRO (S30, 28/08/2026)

*Le retour est la mesure, mot pour mot* : **« Il n'y a pas de numéro sur les décisions, je ne peux
pas les sélectionner. »** Et le plus instructif est ce qui l'a précédé : le destinataire avait
déjà répondu **« 1b, 2a, 3a »** à une restitution portant trois décisions non numérotées, puis
**« a »** à une autre. Il avait donc INVENTÉ la numérotation pour pouvoir répondre, l'ordre
d'apparition faisant office de numéro tacite. Ça a marché deux fois ; la troisième, il a dit stop.

**Pourquoi S4 ne le voyait pas**, et c'est la même cécité que S15 corrige au niveau du sujet : S4
compte des OPTIONS étiquetées `(a)`, `(b)`, `(c)` — elle vérifie que le choix est fermé, jamais
que la QUESTION est adressable. Un bloc à trois décisions parfaitement optionnées passe donc S4
et reste insélectionnable : « je prends (b) » ne dit pas laquelle.

**Ce que coûtait l'absence** : soit le lecteur numérote lui-même, et le risque d'un décalage est
sur lui ; soit il rédige sa réponse en prose, c'est-à-dire exactement ce que le choix fermé du
bloc 3 existe pour lui épargner. *Une décision qu'on ne peut pas désigner en deux caractères
n'est pas un choix fermé, c'est un questionnaire.*

**Les numéros doivent aussi être DISTINCTS** — deux décisions numérotées 1 ne se sélectionnent
pas mieux qu'aucune. C'est le second sens de la règle, et il a sa propre fixture.

La **forme est libre**, comme pour les titres de bloc : « **Décision 1 —** », « 1. », « **1)** »,
« D1 — » sont tous acceptés. Juger la typographie n'a jamais été le sujet.

#### Pourquoi « une phrase » ne suffisait pas (S15, 22/08/2026)

*Le retour qui a fait naître cette règle est, là encore, la mesure elle-même.* Une heure après la
livraison de S11 à S14, le destinataire des restitutions a écrit : **« dans tes prompts, rappelle
le contexte des décisions à prendre, je ne peux pas me rappeler TF-0469 et vue portefeuille »**.
Les deux exemples qu'il cite disent les deux moitiés du défaut :

- **un identifiant ne désigne rien** pour qui ne l'a pas écrit — `TF-0469` est le nom que la
  chose porte au registre, et le registre n'est pas dans la tête du lecteur ;
- **un titre court est une étiquette**, pas un sujet — « vue portefeuille » nomme sans rappeler.

La restitution incriminée portait deux décisions et passait **S4** : elle avait bien ses options
étiquetées, leur coût, leur recommandation et son option par défaut. S4 compte des options, elle
ne regarde jamais ce qu'elles arbitrent. C'était exactement le défaut que **S13** venait de
corriger au bloc 8 — sauf qu'au bloc 3 il coûte plus cher : *une action mal écrite se re-demande,
une **décision** mal écrite se tranche quand même, à l'aveugle.*

La règle est celle du bloc 0 appliquée par décision, avec **une différence assumée** : les
chemins et les spans de code restent tolérés dans le chapeau d'une décision, là où S9 les
interdit. Le sujet d'une décision EST parfois un fichier, et l'interdire ferait écrire des
périphrases. L'identifiant, lui, n'est jamais le sujet.

### 4. Traité — avec sa preuve

Un élément par puce, chacun portant **la preuve d'oracle exécuté** qui l'établit : verdict,
compteur, sortie rejouée. Jamais un ✓ nu.

- élément traité — ce qui change concrètement ;
  - preuve : l'oracle, son verdict, son chiffre.

### 5. Non traité — avec son motif

Le bloc qui distingue une restitution honnête d'un rapport de vente. **Un élément par puce,
chacun avec le motif** — jamais un total anonyme, jamais un silence :

- élément non traité ;
  - motif : hors mandat · bloqué par un garde-fou · dépendance à une décision humaine ·
    impossible à prouver ici · écarté (avec son critère de réouverture).

### 6. Écarts à la lettre

Quand une demande humaine a été reformulée, chaque endroit où la réalisation s'écarte du texte
reçu : **« vous avez demandé → j'ai fait → pourquoi »**. Un affaiblissement noyé dans un long
message et validé en bloc n'est pas un écart validé (TF-0176, 13/08 : un seuil ajouté en
silence a traversé une validation humaine, et le livrable a été refusé). Aucun écart : le dire.

### 7. Risques

Ce qui peut casser **à cause de ce qui vient d'être fait ou de ce qui ne l'a pas été**. Chacun
porte trois choses, sinon ce n'est pas un risque mais une inquiétude :

- l'énoncé — quoi, et sur qui ça tombe ;
  - le **signal** qui le rendrait visible (ce qu'on verrait le jour où il se réalise) ;
  - la **parade** ou l'acceptation déclarée.

### 8. Prochaines actions — UN TABLEAU, ordonné, l'acteur en colonne

**La forme est un TABLEAU UNIQUE, et ce n'est plus un goût (S18, TF-0508, 22/08).** Le
destinataire des restitutions l'a réclamé trois fois dans une seule session : « pourquoi tout
n'est pas dans un seul tableau ? », puis « Revois complètement ta présentation », puis
« tableau !! ». Trois phrases opposables en sortent :

1. **L'ACTEUR est une COLONNE, jamais une section.** Découper en sections par acteur oblige le
   lecteur à scanner N listes et à recoller mentalement pour obtenir le total — exactement le
   coût que ce bloc existe pour supprimer.
2. **L'ORDRE est le TRI.** Les actions exécutables par l'IA remontent en tête *par le tri*, ce
   qui satisfait « tous les IAs en premier » sans casser la liste unique. Les deux exigences
   n'étaient jamais en tension : elles étaient compatibles depuis le début, et c'est la lecture
   « une section par acteur » qui était fautive.
3. **Seul le CALENDRIER justifie plusieurs tableaux.** L'exception vient du lecteur lui-même —
   « si plusieurs étapes, crée plusieurs tableaux » : un découpage par ÉTAPE, jamais par acteur.

**Et la forme ne change pas d'un tour au suivant.** Cinq mises en page pour le même contenu ont
été mesurées dans une seule session, dont un bloc portant quatre formes de tableau distinctes. Le
coût n'est pas esthétique : à chaque changement, le lecteur RÉAPPREND la mise en page avant de
pouvoir lire, et il perd la comparaison avec le message précédent — ce qui **annule le bénéfice
de S14**. Une liste dont les colonnes changent ne se compare pas, même avec des identifiants
stables. `oracle-synthese` tient la cohérence *intra*-document (deux en-têtes différents dans un
même bloc = défaut) ; la stabilité d'un tour au suivant est déclarée en `non_juge` plutôt que
faussement promise, faute de conserver l'état du tour précédent.

La forme en puces reste admise — un bloc 8 à trois lignes ne gagne rien à devenir un tableau — et
les deux formes sont jugées à l'identique : `oracle-synthese` lit **une ligne de tableau comme une
action**, au même titre qu'une puce et ses sous-puces. Ce n'était pas le cas avant le 22/08, et le
trou était béant : un bloc 8 rendu en tableau donnait zéro action à S11-S14, qui répondaient
« aucune action concernée ». **Une règle qui se désactive au moment où l'on adopte la forme
demandée est pire qu'une règle absente** — elle récompense le changement de forme par un vert.

Deux classements simultanés, aucun des deux facultatif :

- **par acteur** — `auto_ia` / `manuelle_dev` / `manuelle_utilisateur` (vocabulaire gelé de
  `actions[]`, règle 29) : chaque reste porte celui qui peut le faire ;
  - **et l'étiquette ENGAGE (v2.5.0, TF-0457 à TF-0460)** — voir « Ce que chaque action doit
    porter » juste après ;
- **par ordre de traitement** — priorité **dérivée**, jamais ressentie : le score de risque du
  rapport (criticité × probabilité × coût tardif) quand il existe, l'ordre recommandé par le
  produit quand un lot en donne un, l'effet de levier mesuré sinon. **L'ordre se justifie en
  une clause** — « d'abord X, parce qu'il supprime N constats à la source ».

#### Ce que chaque action doit porter (v2.5.0, 22/08/2026)

*Le retour humain qui a fait naître ces quatre règles est, comme pour le bloc 0, la mesure
elle-même* : « la liste des tâches est trop longue, trop complexe, sans assez de détails sur les
problèmes, les solutions possibles, menées par l'IA ou ne pouvant être traitées que par moi ».
Instruit sur les fichiers, il ne demandait presque **rien de neuf** — la doctrine était écrite
depuis la v2.0.0, et la loi transverse n° 5 dit depuis l'origine « l'IA fait, l'humain décide :
la voie automatisée est le **défaut** ; l'action laissée à l'humain **se justifie** ». Ce qui
manquait n'était pas la règle mais son **contrôle** : S6 ne testait que la PRÉSENCE d'un nom
d'acteur. Mesuré le 22/08 sur les 13 synthèses à bloc 8 de `output\04-plans\` — 15 lignes
`auto_ia` dont **9** renvoyées à un mandat humain sans que rien ne le dise, **6** `manuelle_dev`
et **17** `manuelle_utilisateur` sans **aucune** justification d'attribution, et **0** action
portant un identifiant stable.

- **Une action `auto_ia` est FAITE avant la restitution, ou porte son motif de non-exécution**
  (**S11**) — vocabulaire fermé : `gate_gouvernance` (R-29 : décision ou dépense) ·
  `dependance_bloc_3` (attend une décision listée au bloc 3) · `garde_fou` (nommé) ·
  `borne_atteinte` (G-2) · `dependance_externe` (nommée) · `hors_mandat` (du ressort de l'IA,
  mais d'un AUTRE mandat — nommer lequel). *L'effet recherché n'est pas de
  gronder : c'est que neuf lignes qui disent toutes « donne-moi un mandat » se lisent comme
  **une** gate, et non comme neuf tâches.*
- **Une action laissée à l'humain porte sa raison d'impossibilité IA** (**S12**) — vocabulaire
  fermé : `acces` (droit, console ou compte hors portée agent) · `decision` (arbitrage métier,
  budget, risque) · `depense` · `presence` (geste physique, réunion, signature) ·
  `irreversible` (R-38 et assimilés). *Une raison hors vocabulaire n'est pas un refus valide :
  c'est un candidat à l'automatisation, à verser au registre.*
- **Une action laissée à l'humain est EXÉCUTABLE telle quelle** (**S13**) : un chemin, une
  commande ou un libellé d'écran, plus la preuve qui clôt l'action. *Le lecteur tient 5 à
  8 produits ; une ligne qui exige de rouvrir le projet lui fait payer le rechargement de
  contexte que la restitution était censée lui épargner.*
- **Une action porte un identifiant stable** (**S14**) — celui de `TODO-PRODUIT.md` — **ou se
  déclare `neuve`**, et la restitution la crée alors au registre produit. *Sans identifiant,
  deux restitutions successives ne se comparent pas, et la même ligne se re-sert
  indéfiniment ; c'est le pendant, côté PRODUIT, de ce que TODO-FORGE tient depuis l'origine
  côté forge.*

**`hors_mandat` a été ajouté dans l'heure qui a suivi l'écriture de S11**, sur un cas réel, et
l'anecdote vaut règle : trois lots de retours sont arrivés dans la boîte d'entrée pendant le
mandat du 22/08 ; les ingérer est du ressort de l'IA, mais d'un autre mandat. Aucun des cinq
motifs d'origine ne le disait — la seule issue était d'en choisir un faux, ou de taire la ligne,
c'est-à-dire exactement ce que S11 existe pour empêcher. **Une règle qui force à mentir est une
règle à corriger, pas à contourner.** C'est aussi le motif le plus facile à abuser : apposé sur
une action que le mandat courant couvre, il contourne S11 au lieu de la satisfaire, et aucun
oracle ne le voit — c'est déclaré en `non_juge` plutôt que passé sous silence.

#### Une action dit ce qu'il en coûte de NE PAS la faire (S19, 22/08/2026)

*La demande humaine était SYMÉTRIQUE, et le référentiel n'en couvrait qu'une moitié.* Elle disait,
mot pour mot : **« fournir des actions claires, les impacts de ces actions, les recos sur ces
actions, des décisions claires, les impacts de ces décisions, les recos des décisions »**. Au
bloc 3, S15 et S16 tenaient déjà le sujet, la recommandation et sa source. Au bloc 8, S11 à S14
tenaient le motif, la raison, l'exécutabilité et l'identifiant — et **aucune** n'exigeait la
conséquence.

Or c'est cette colonne qui rend la liste **arbitrable** : une liste de restes sans conséquences
est un inventaire, pas un outil de décision. Mesuré à l'usage la même session : les tableaux
portant une colonne « si on ne fait rien » ont été acceptés, ceux qui ne la portaient pas ont été
redemandés.

**Asymétrie assumée avec S16 : la RECOMMANDATION n'est pas exigée sur une action.** Une action
n'offre pas toujours un choix, et l'imposer partout produirait du remplissage. Formes admises pour
la conséquence : « si rien n'est fait », « si on ne le fait pas », « à défaut », « sinon : »,
« impact si … ».

#### Un renvoi nomme son SUJET, jamais une position (S17, 22/08/2026)

*Fait mesuré sur pièce.* Une restitution renvoyait « préalable : ligne 8 (droit IAM) puis ligne 5
(merge) ». Réponse du lecteur, mot pour mot : **« Que veut dire ligne 8 (droit IAM) puis ligne 5
(merge). C'est incompréhensible. »** Les deux numéros avaient effectivement changé de sens entre
deux messages, le tri par urgence ayant déplacé les lignes.

C'est le pendant, au niveau du **RENVOI**, de ce que S14 corrige au niveau de l'**ITEM** : S14
exige un identifiant stable *pour* l'action, mais rien n'interdisait de la **désigner** par sa
position. **Un identifiant stable qui ne sert jamais à renvoyer ne sert à rien.** Un renvoi nomme
donc le sujet ou son identifiant ; « ligne N », « point N », « item N » sont des défauts. Renvoyer
à un **bloc** du gabarit reste licite : sa position est fixe, pas retriable.

#### Le jargon des blocs 3 et 8 porte sa glose (S20, 22/08/2026)

*Le retour est la mesure elle-même* : le lecteur a demandé DEUX FOIS l'explication du même point —
« détaille 5 », puis « Explique 5 ». La première version employait « justificatif fédéré »,
« identité system-assigned », « UAMI », « constat H2 », « filet » sans les gloser ; la seconde,
écrite sans aucun de ces termes, a été **acceptée immédiatement**.

Le raisonnement de S9 s'applique mot pour mot — *une information remontée et non comprise a le
même effet qu'une information tue, avec le coût de lecture en plus* — mais **S9 ne juge que
l'OUVERTURE**. Or c'est aux blocs qu'on EXÉCUTE que le coût est le plus élevé : un jargon au
bloc 0 fait perdre le fil, **un jargon dans une action fait exécuter de travers, ou pas du tout**.

Le référentiel est une **donnée** (loi n° 4), fermée, datée et sourcée :
`gabarits\JARGON-A-GLOSER.json`. Une heuristique sur les sigles en majuscules aurait un taux de
faux positifs rédhibitoire dans ce corpus, où la MAJUSCULE sert l'emphase — et un oracle qui crie
sur « MESURE » et « AUCUNE » se fait désactiver dans la semaine. **La liste n'attrape que ce qui a
réellement coûté un aller-retour**, et elle grossit par les retours, pas par la devinette : c'est
la limite, elle est déclarée en `non_juge`.

#### Une impossibilité s'ÉPROUVE, elle ne s'affirme pas (S21, « S12 bis », 23/08/2026)

*La mesure tient dans la COMPARAISON de deux cas du même relevé, traités différemment le même jour.*

- **Cas honnête** — pour modifier une application d'authentification, l'appel a été **tenté et
  mesuré** : `HTTP 403 Authorization_RequestDenied`, puis vérification que le compte ne porte aucun
  rôle d'annuaire. L'attribution à l'humain était fondée, **et la trace le prouvait**.
- **Cas fautif** — pour une porte d'approbation bloquée depuis 26 heures, le blocage a été
  **affirmé** et le sujet renvoyé à l'humain… alors que la même classe de contrainte avait déjà été
  levée **deux fois le jour même**, avec l'accord du destinataire. Le motif était vrai ;
  **l'attribution était fausse.**

**S12 ne peut pas voir la différence** : elle lit un jeton de vocabulaire fermé, pas une tentative.
Le destinataire a contesté **sept lignes sur neuf** de ce relevé, dont plusieurs par « pourquoi ce
n'est pas déjà fait par l'IA ». Le coût d'une attribution non éprouvée n'est donc pas théorique :
c'est un aller-retour, et la confiance dans la liste entière.

**S21 exige donc, DANS LE MÊME GROUPE DE PUCE, la trace mesurée de la tentative** — un code de
réponse, un message d'erreur, une sortie de commande.

**Portée volontairement étroite** : seuls `acces` et `presence` sont concernés. Ce sont les deux
motifs qui affirment un **fait du monde**, donc les deux qui se mesurent. `decision`, `depense` et
`irreversible` relèvent d'un arbitrage, et exiger d'« essayer » une décision n'aurait aucun sens —
*ce qui laisse une attribution abusive sous `decision` invisible, et c'est la limite assumée.*

**Un piège payé en écrivant la règle, et il vaut d'être connu** : le motif destiné aux codes
techniques (`ENOTFOUND` et sa famille) avait été mis dans la même expression que les mots français,
avec le drapeau insensible à la casse. Il matchait alors le mot « ecran ». La règle rendait PASS sur
une action sans aucune trace : **elle était morte en croyant vivre**, et c'est le pire état pour un
contrôle — il rassure au lieu de juger. Codes et mots vivent désormais dans deux expressions
séparées.

**Les vocabulaires sont fermés ET non accentués**, et ce n'est pas un détail de style : c'est ce
qui les rend **comptables** (« combien d'actions restent humaines par `acces` ? ») et ce qui les
empêche d'être déclenchés par hasard par de la prose française — « décision », « accès »,
« présence », « dépense » portent leur accent et ne matchent aucun jeton.

**Le second niveau de puce porte le détail**, et c'est voulu : la profondeur reste bornée à
2 niveaux (règle de forme n° 1), et l'oracle juge l'action **groupée** — la puce de premier
niveau avec ses sous-puces. Motif, chemin et commande vivent donc là où ils se lisent, sans
allonger la ligne d'entrée.

### 9. Traces

Les chemins cliquables de ce qui a été produit : livrables, commits, entrées de ledger,
journaux d'oracles. **Relatifs et vérifiables**, jamais décrits de mémoire.

## Règles de forme transverses

1. **Deux niveaux de puces au maximum.** Au troisième, on ne lit plus — on scanne.
2. **Prose bornée** : le récit tient en ≤ 400 mots. Les énumérations ne comptent pas : ce sont
   des faits, et les tronquer reviendrait à cacher un reste.
3. **Chiffres et chemins**, pas d'adjectifs : « 19/19 », « `output\03-etudes\…` ».
4. **Un échec se dit avec sa sortie**, un contournement se dit comme contournement.

## Ce que la restitution ne fait jamais

- Inventer une posture (« utilisateur exigeant », « expert ») pour juger le livrable — le
  jugement vient des oracles, pas d'un rôle incarné (étude personas du 13/08 : effet nul à
  négatif sur l'exactitude).
- Annoncer un ✓ sans oracle exécuté.
- Faire disparaître un bloc vide plutôt que de le dire vide.
- Relancer une boucle non bornée « jusqu'à satisfaction » — les bornes vivent dans les
  références (G-2 ; ≤ 5 cycles depuis le 14/08), pas dans un ressenti.

## Forme dégradée — CLI, oracle, recette

Un outil qui imprime au terminal tient la **même structure, en trois blocs seulement** :
en-tête horodaté · verdict en une ligne · restes classés par acteur. Les décisions, écarts,
risques et traces relèvent de la restitution écrite, pas d'une sortie machine — mais
**l'horodatage et le verdict, eux, sont exigibles partout**. Les règles S11 à S14 ne s'y
appliquent pas non plus : elles jugent un fichier, et une CLI n'en écrit pas.

## Deux formes que le bloc 3 admet, et une qu'il refuse (TF-0568, 0572, 0573 — 24/08/2026)

**La mise en page ne fait pas la conformité (TF-0568).** Le bloc 3 accepte QUATRE mises en page de
la même décision — puce unique, options en puces filles, options en tableau séparé, tableau sans
puce — et rend le même verdict aux quatre. Avant le 24/08 une seule passait, la puce unique, soit un
pavé de douze lignes au rendu ; les trois autres échouaient sur un chapeau vide ou tronqué. Mesuré :
1 forme sur 5 acceptée avant, 4 sur 5 après, la cinquième restant refusée à bon droit (chapeau de
quatre mots). *Une règle qui n'admet qu'une mise en page ne juge plus le fond, elle impose une
typographie* — et elle punit exactement le lecteur qui demande une présentation lisible.

**Le CHAPEAU COMMUN, quand un dossier porte plusieurs décisions d'une même histoire (TF-0573).**
Onze décisions issues d'une même enquête ne peuvent pas répéter onze fois leur contexte : le dossier
devient illisible par sa longueur. Les supposer connues produit l'inverse — « aucune mise en
contexte ». Le bloc 3 admet donc une **prose de tête**, avant la première décision, qui porte
l'histoire une fois : le problème, sa chaîne causale, ce qui est en jeu. Présente et substantielle
(40 mots au moins), elle abaisse le rappel dû par décision de 25 à **12 mots** — le delta suffit,
puisque le contexte est écrit juste au-dessus et non supposé. Douze mots restent dus : il faut
nommer DE QUOI cette décision-là parle, sinon on retombe sur l'étiquette.

Le bloc 0 ne remplace pas ce chapeau et ne le peut pas : il tient l'état, la conséquence et
l'attendu en un paragraphe, pas l'exposé d'un problème et de sa chaîne causale.

**Ce qu'il refuse : le désignateur non glosé (TF-0572, S23).** Un dossier remis le 24/08 nommait ses
objets par des codes créés dans la même session — V1 à V4 pour quatre contrôles, A1, B2, E2 pour les
décisions. Réponse du destinataire, mot pour mot : « Rien compris à V1, V3, V4, de quoi parle-t-on ? »

Ni S15 ni S20 ne le voyaient. S15 interdit l'identifiant nu comme SUJET d'une décision, et vise ce
que le lecteur ne peut pas connaître — un identifiant de registre écrit ailleurs et avant ; un code
introduit dans le même message passe son test dès qu'une phrase de sujet l'accompagne. S20 glose
depuis un référentiel fermé alimenté par les termes du métier : un code né du jour n'y est pas.

**La règle porte sur l'USAGE, pas sur la naissance** : *un désignateur court employé plus d'une fois
porte sa glose à son PREMIER emploi.* Quatre mots suffisent — « V1 (plausibilité de la commune) »,
« V1 — plausibilité de la commune », ou une ligne de tableau « | V1 | plausibilité de la commune | ».
Sans glose il n'existe pas pour le lecteur, et l'écrire c'est écrire pour soi. Seul `TF-####` est
exclu : il est déjà tenu par S14 (obligatoire sur une action), S15 (interdit comme sujet) et S20
(glosé). `R-52`, `V4`, `A1`, `EA6` ne le sont pas — le lecteur n'a pas nos référentiels sous les yeux.

## Portée — où cette consigne s'applique, et comment elle y arrive (TF-0571, 24/08/2026)

**Une doctrine n'existe que là où son mécanisme est installé.** La v1 de ce document le disait
d'elle-même — « elle n'était citée par aucun run […] une convention qu'aucun run ne charge ne
s'applique pas : elle décore » — et la v2 l'a corrigé POUR LES RUNS DU PILOT. Elle ne disait rien
des sessions qui vivent chez le produit.

**Le fait qui ouvre cette section.** Une session de travail a passé cinq heures et onze décisions
dans un dépôt produit, en rendant une dizaine de messages de fin de traitement à l'humain : aucun
ne portait la structure en huit blocs, aucun ne portait de bloc 0, aucun n'a été ni jugé ni refusé.
Il n'y avait ni doctrine chargée ni oracle armé. Le défaut n'a été découvert que par la
contestation humaine, cinq heures plus tard.

**Mesure du 24/08 sur le parc, plus large que le retour** : sur les dix produits rangés sous le
dossier client, CINQ portent un `forge\` — donc ont été instanciés — UN SEUL porte le hook de la
factory, et ZÉRO portait le texte de cette consigne. La doctrine voyageait au mieux comme **un
juge sans son code** : le hook refuse, et l'agent doit deviner les huit blocs.

**Les trois pièces, et ce que chacune vaut seule.** Il faut les trois, et l'oracle les nomme
séparément pour que le remède soit précis :

| Pièce | Chez le produit | Sans elle |
|---|---|---|
| le juge | `forge\hooks\factory.mjs` | aucune fin de tour n'est jugée : la doctrine est un vœu |
| le câblage | `.claude\settings.json` portant le hook | le juge est là et jamais appelé — le pire état, il donne confiance sans rien faire |
| le texte | `forge\RESTITUTION.md` (copie de ce fichier) | le juge refuse sans que rien n'apprenne la forme : l'agent devine |

**Comment elle arrive** : par l'héritage, jamais par bonne volonté. Les trois pièces sont déclarées
dans `gabarits\HERITAGE.json` et contrôlées par **R-47** à chaque ingestion de lot. Le texte y est
entré le 24/08 — il n'y était pas, c'est pourquoi il ne voyageait pas.

**Qui écrit chez le produit** : le produit. « Ne touche pas les produits, seuls les produits se
modifient eux-mêmes » (mandat humain du 23/08). Le pilot NOMME l'état d'installation
(`oracles\oracle-portee-doctrine.mjs`, PD1-PD2) et **ne bloque pas dessus** : un contrôle qui
échoue sur ce qu'il ne peut pas faire réparer apprend à être contourné. Le remède est toujours un
run demandé au produit.

**Un dépôt sans `forge\` est HORS doctrine, et c'est un fait, pas une faute** : il n'a jamais été
instancié. Une session qui y travaille ne recevra ni consigne ni juge — et doit le savoir avant de
rendre son premier message, pas après onze décisions.

## Contrôle

**Trois bornes de domaine, écrites parce qu'elles ont été trouvées en jouant les règles neuves
sur une restitution RÉELLE, le 22/08** — et chaque fois le défaut était celui de la règle NEUVE,
jamais celui de l'auteur :

- **une ligne de tableau se juge AVEC son en-tête.** En forme de puce, le motif d'une action vit
  dans la puce ; en forme de TABLEAU — la forme réclamée trois fois par le lecteur — il vit dans
  la COLONNE, donc dans l'en-tête. S19 refusait un tableau dont la dernière colonne s'appelait
  pourtant « si elle n'est pas faite » : 5 actions sur 5, et elle exigeait de recopier la locution
  dans chacune des cinq cellules. **Deux règles du même jour se contredisaient** — S18 prescrit le
  tableau, S19 le rendait impossible à satisfaire proprement. Une règle qui force à recopier cinq
  fois la même locution pousse au bruit, pas à la clarté ;
- **S8 est bornée aux blocs qui AFFIRMENT** — verdict, traité, actions. Elle balayait le document
  entier et mordait sur deux formes que ce gabarit PRESCRIT ailleurs : le bloc 6, dont la forme
  « vous avez demandé → j'ai fait → pourquoi » est littéralement imposée et dont la preuve est le
  POURQUOI, jamais un verdict d'oracle ; et le bloc 7, où « un travail fait deux fois » n'affirme
  rien. Les blocs 5, 6 et 7 parlent PAR CONSTRUCTION de ce qui n'a pas été fait, de ce qui a
  divergé et de ce qui pourrait casser : y chercher un ✓ sans preuve est une erreur de domaine.
  **Un oracle qui refuse la formulation qu'un gabarit prescrit met le GABARIT en défaut** ;
- **S8 ignore la tournure conditionnelle de S19.** « si rien n'est fait » contient le mot
  « fait », que S8 lisait comme une affirmation de complétion sans preuve.

**Exécuté** : `node oracles\oracle-synthese.mjs <synthese.md>` — règles S1-S21 binaires,
fixtures double sens au self-test (la fixture rouge échoue sur 16 règles distinctes).
**Proportionnalité (v2.5.0, inchangée)** : bloquantes S1, S3, S4, S6 ; tout le reste — S17 à S20
comprises — entre en AVERTISSANTE, dit en une ligne sous la réponse et jamais réécrit. Une action
sans conséquence rend la liste moins utile, jamais illisible ; les règles se durciront quand le
corpus sera propre. Une restitution qui viole une règle est un défaut de forme,
signalé comme tel et corrigeable. Mise à jour = nouvelle version + date.

**Appelants (R-35, TF-0249)** — la consigne est chargée et JOUÉE, jamais laissée à la
mémoire : clôture de run (pas 7, `ETAPES-RUN.md`) · fin de campagne (`AGENT-CAMPAGNE.md`
§Synthèse) · fin de mandat (`RUN-MANDAT.md`) · noyau §Parallélisme. Dans tous les cas la
synthèse s'écrit EN FICHIER (`output\` du pilot ou `forge\` du produit), passe
`oracle-synthese` et ne s'affiche qu'après son verdict — un message de chat ne passe
devant aucun contrôle, un fichier si.
