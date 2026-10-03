---
destinataire: humain
---

# Synthèse Mandat — la remontée sur les pages HTML et les indicateurs est instruite ; l'étude retient O2 en trois lots, à vous de lancer la campagne (03/10/2026)

## 0. Synthèse d'ouverture

La remontée existe : le dernier lot de retours de Produit-02, arrivé au sas à 17:47, porte 8 retours sur les pages HTML de données, dont 1 bloquant, un compte faux publié avec un verdict PASS. J'ai écrit l'étude d'opportunité côté factory : elle contre-vérifie l'étude jointe par le produit, corrige 2 de ses affirmations, mesure la demande sur le parc (111 pages à graphique écrit à la main et 116 à grille d'indicateurs, sur 20 dépôts), et retient O2 : des règles et des composants au socle, en trois lots ordonnés, justesse d'abord. L'oracle de l'étude rend PASS sur ses 10 règles. Rien n'est encore modifié dans le socle ni au registre : la campagne pose des règles bloquantes neuves, elle attend votre décision D-55.

## 1. En-tête d'identification

- **quoi** — étude d'opportunité sur les améliorations demandées par la remontée « pages HTML / KPIs » du 03/10/2026, livrée et jugée.
- **sur quoi** — le pilot `digit-ai-factory` (`output/03-etudes/`, `output/04-plans/`) ; lecture seule du lot au sas, de l'étude du produit, de `digit-ai-forge-agents` (socle `digit-ai-page-html`, `quality-oracles`), de `digit-ai-forge-design` (`oracle-saisie`) et de 20 dépôts produits.
- **quand** — 2026-10-03 17:53 UTC+02:00 (Europe/Paris), heure relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; pilot à `ec2251a4` ; oracles joués : `oracle-etude-opportunite`, gate d'écriture qualité (lisibilité Markdown) ; 5 sources web relues.
- **intention** — que la remontée sur les pages HTML et leurs indicateurs soit prise en compte, et qu'une étude dise quelles améliorations demandées valent d'être posées au socle, dans quel ordre. **Test rétro** : servie ; les 8 retours sont chacun rattachés à une sous-question et à un lot, et le verdict est unique ; la lecture de votre demande comme « étude au niveau factory des 8 retours » reste à confirmer par vous.

## 2. Verdict en une ligne

**PASS — étude livrée, `oracle-etude-opportunite` 10/10 règles PASS, 8 retours sur 8 instruits, verdict O2 en 3 lots ; aucune écriture au socle avant D-55.**

- **L'étude** : [20261003-etude-opportunite-pages-html-indicateurs.md](../03-etudes/20261003-etude-opportunite-pages-html-indicateurs.md), verdict O2.
- **Numérotation** : RT-118 (premier des 8 retours numérotés du lot) à RT-125 ; L3 (règle « toute valeur porte sa légende ») est la règle du socle que L3 bis prolonge.
- **Lot A, justesse et faux positifs** : une règle « même indicateur, deux valeurs » contre le défaut bloquant RT-121 (le compte faux), et les 4 faux positifs RT-122 à RT-125 (lecture du source brut par `oracle-calculs`, placeholder lu comme indice de type, étiquette dans un segment jugée en chevauchement, dates JJ/MM/AAAA ignorées par l'oracle des études).
- **Lot B, infobulles** : la règle L3 bis (une infobulle ne recopie pas sa cellule) étendue aux infobulles de graphique et au texte voisin (RT-118).
- **Lot C, composants** : une tuile d'indicateur avec comparaison et écart, des barres empilées à palette validée, propagées au parc (RT-119, RT-120).
- **Coût total** : complexité complexe · durée moyenne.

## 3. Décisions attendues de l'humain

Inventaire des bloquants — ce qui est bloqué, ce qui le lève, et ce qui se passe sinon :

- la campagne sur le socle des pages : votre décision D-55, car elle pose des règles bloquantes neuves ; sans elle, l'étude reste un document et le prochain rapport de Produit-02, le 2026-10-15, se relira à la main.

> **D-55 — Lancez-vous la campagne O2 sur le socle des pages HTML, et jusqu'où ?**
>
> Rappel du sujet : 8 retours du 03/10 sur les pages de données ; le seul bloquant est un compte faux sorti PASS 15/15 (54 visites engagées sur 63, au lieu de 40 sur 64). Les règles proposées sont neuves et bloquantes, et une règle neuve vous revient.
>
> **Recommandation : (a).** Source consultée : `output/03-etudes/20261003-etude-opportunite-pages-html-indicateurs.md`, section 5 (ordre justesse, puis infobulles, puis composants) ; la méthode de TF-0954 du 08/09, qui a mesuré le bruit d'une règle d'infobulle sur 355 pages de 8 dépôts avant de la poser, avec zéro constat nouveau. Chaque règle neuve sera d'abord jouée en avertissement sur le parc, et ne deviendra bloquante qu'à bruit mesuré.

| Option | Coût | Exclusions |
|---|---|---|
| (a) les 3 lots dans l'ordre A, B, C, chaque règle mesurée en bruit avant de bloquer | complexité complexe · durée moyenne | exclut une bibliothèque de graphiques externe |
| (b) le lot A seul, justesse et faux positifs | complexité moyenne · durée courte | exclut les tuiles, les barres empilées et la règle d'infobulle étendue ; les produits continuent d'écrire leurs graphiques à la main |
| (c) ne rien lancer | aucun | exclut toute correction ; un compte faux peut encore sortir PASS |

> **Si rien n'est décidé** : (c) — l'étude reste au dossier, les 8 candidatures entrent au registre à l'ingestion du lot et attendent la revue hebdomadaire.

## 4. Traité — avec sa preuve

- **Remontée trouvée et lue** : lot « Produit-02 - RETOURS - 20261003b » au sas, retours RT-118 à RT-125, gravités 1 bloquant, 3 majeurs, 4 mineurs.
  - preuve : `grep -il kpi input/00-retours/_arrivee/*.md` → ce seul lot.
- **Étude écrite et jugée** : 6 sous-questions, 12 lignes de non-recouvrement citées, 6 sources datées relues, options O0 à O4, verdict unique.
  - preuve : `node oracles/oracle-etude-opportunite.mjs output/03-etudes/20261003-etude-opportunite-pages-html-indicateurs.md` → PASS, E1 à E10, exit 0 ; gate de lisibilité Markdown FAIL sur M7 (chapitre 2 sans phrase d'ouverture), puis PASS après ajout de la phrase.
- **Correction de l'étude du produit, sur le registre** : elle dit TF-0954 « toujours candidat » ; le registre la porte `corrige` depuis le 08/09, règle L3 bis posée sur la seule égalité entre une cellule `<td>` et son infobulle. RT-118 est une récidive à côté de cette règle, pas un retour sans règle.
  - preuve : `todo/TODO.jsonl`, événement `maj` de TF-0954, statut `corrige` ; `check_html.py`, bloc L3 bis, boucle sur `n.tag == "td"`.
- **Correction de l'étude du produit, sur ses sources** : la recommandation des barres empilées attribuée à ClearPoint ne figure pas dans cette source à la relecture ; 5of10 ne publie pas de jour, la source n'est pas comptée comme datée.
  - preuve : relecture web du 2026-10-03 des 5 adresses citées.
- **Causes des 4 faux positifs confirmées dans le code** : `oracle-calculs.mjs` lit le fichier brut (ligne 49) ; `oracle-saisie.mjs` met le placeholder dans l'indice de type (ligne 245) ; `render_page.py` V4 n'a pas d'exemption d'étiquette ; `oracle-etude-opportunite.mjs` E3 et E7 n'acceptent que l'année en tête.
  - preuve : lecture des lignes citées, reprises à l'étude, section 2.
- **Demande mesurée sur le parc** : 111 pages à graphique SVG écrit à la main et 116 à grille d'indicateurs, sur 20 dépôts produits.
  - preuve : recherche en lecture seule dans les dépôts produits, heuristique `<rect` de barre et `class="kpi`, dossiers `old/` exclus.

## 5. Non traité — avec son motif

- L'accueil et l'ingestion des 5 lots au sas, dont celui-ci — motif : `hors_mandat`, votre demande portait sur une étude ; l'accueil déplace et pseudonymise des fichiers, je ne le joue pas sans votre accord.
- La correction des indices partagés de 3 livrables du 01/10 signalée à l'ouverture — motif : `hors_mandat`, sans rapport avec la demande.
- Toute écriture au socle, aux oracles ou au registre — motif : `decision`, suspendue à D-55.

## 6. Écarts à la lettre

- **Vous avez demandé** « une étude d'opportunités sur des études d'améliorations » → **j'ai écrit une seule étude qui instruit les 8 améliorations et contre-vérifie celle du produit**, sans refaire cette dernière → **pourquoi** : l'étude du produit existe et rend PASS chez lui ; le travail de la factory est de vérifier ses affirmations, de mesurer la demande sur tout le parc et de séquencer.

## 7. Risques

- La règle « même indicateur, deux valeurs » rougit des pages saines, où un même libellé porte deux périmètres légitimes (le jour et le total) ;
  - signal : constats nouveaux à la mesure de bruit sur le parc ;
  - parade : avertissement d'abord, sortie déclarative `data-indicateur-portee`, blocage seulement à bruit mesuré nul.
- L'extension de L3 bis au voisinage rougit des infobulles qui répètent la valeur pour la compléter ;
  - signal : constats sur les pages des 8 dépôts déjà mesurés pour TF-0954 ;
  - parade : la variante « contient sans rien ajouter » n'est posée qu'après mesure, comme TF-0954 l'a fait.
- Les composants du lot C n'atteignent pas les 111 pages déjà livrées ;
  - signal : le relevé d'héritage montre les produits sans la version du socle qui les porte ;
  - parade : propagation par `embarquer-composants.mjs` à l'ouverture de chaque produit, sans réécriture forcée.

## 8. Prochaines actions

Les actions sont triées dans l'ordre où elles deviennent possibles ; les deux premières attendent votre réponse.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Accueillir puis ingérer les 5 lots au sas : `node todo\accueillir-lot.mjs`, puis `node todo\ingerer-lot.mjs` sur chaque sidecar (le fichier des candidatures joint au lot), RT-118 rattaché à TF-0954 comme récidive | `auto_ia` | neuve | `hors_mandat` — votre demande portait sur une étude ; dites « vas-y » pour l'accueil | le contrôle d'ouverture reste bloquant, le plus ancien lot a 44 h |
| **A-2** | Jouer la campagne selon votre réponse à D-55, lot A d'abord, chaque règle mesurée en bruit sur le parc avant de bloquer | `auto_ia` | neuve | `dependance_bloc_3` — D-55 | le prochain rapport de Produit-02 se relit à la main |
| **A-3** | Confronter le verdict aux faits sur le rapport de Produit-02 du 2026-10-15 | `auto_ia` | neuve | `dependance_externe` — le rapport n'existe pas avant le 2026-10-15 | le verdict n'est jamais vérifié |
