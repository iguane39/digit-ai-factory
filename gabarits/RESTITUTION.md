# Consigne de restitution — le message de fin de traitement

**Marquage du fichier de synthèse (TF-0331, 18/08)** : la synthèse remise à l'humain naît
avec `destinataire: humain` en frontmatter YAML. La localisation R-2/E9 ne juge que ce qui
est MARQUÉ — sans porteur, la règle est un faux négatif volontaire : elle est livrée,
prouvée à zéro faux positif, et ne voit rien. Le marquage a été vérifié toléré par
`oracle-synthese` (S1-S8) sur une synthèse réelle PASS avant d'être prescrit ici.
Cette consigne, elle, ne se marque PAS : c'est un référentiel normatif, pas un livrable.

Référentiel versionné (loi n° 4, daté-éditable) — **version 2.5.0, 22/08/2026** (retour humain
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

- l'objet de la décision, en une phrase ;
  - les options `(a)` / `(b)` / `(c)`, chacune avec **son coût et ce qu'elle exclut** ;
  - la recommandation, **et pourquoi** ;
  - ce qui se passe si rien n'est décidé (l'option par défaut existe toujours — la nommer).

Si rien n'attend l'humain : le dire en une ligne.

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

### 8. Prochaines actions — ordonnées, et par acteur

Deux classements simultanés, aucun des deux facultatif :

- **par acteur** — `auto_ia` / `manuelle_dev` / `manuelle_utilisateur` (vocabulaire gelé de
  `actions[]`, règle 29) : chaque reste porte celui qui peut le faire ;
- **par ordre de traitement** — priorité **dérivée**, jamais ressentie : le score de risque du
  rapport (criticité × probabilité × coût tardif) quand il existe, l'ordre recommandé par le
  produit quand un lot en donne un, l'effet de levier mesuré sinon. **L'ordre se justifie en
  une clause** — « d'abord X, parce qu'il supprime N constats à la source ».

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
**l'horodatage et le verdict, eux, sont exigibles partout**.

## Contrôle

**Exécuté** : `node oracles\oracle-synthese.mjs <synthese.md>` — règles S1-S8 binaires,
fixtures double sens au self-test. Une restitution qui viole une règle est un défaut de forme,
signalé comme tel et corrigeable. Mise à jour = nouvelle version + date.

**Appelants (R-35, TF-0249)** — la consigne est chargée et JOUÉE, jamais laissée à la
mémoire : clôture de run (pas 7, `ETAPES-RUN.md`) · fin de campagne (`AGENT-CAMPAGNE.md`
§Synthèse) · fin de mandat (`RUN-MANDAT.md`) · noyau §Parallélisme. Dans tous les cas la
synthèse s'écrit EN FICHIER (`output\` du pilot ou `forge\` du produit), passe
`oracle-synthese` et ne s'affiche qu'après son verdict — un message de chat ne passe
devant aucun contrôle, un fichier si.
