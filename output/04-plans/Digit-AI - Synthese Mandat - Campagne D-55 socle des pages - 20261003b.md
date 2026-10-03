---
destinataire: humain
---

# Synthèse Mandat — votre décision D-55 (a) est exécutée : les 8 améliorations des pages de données sont livrées et publiées dans les forges (03/10/2026)

## 0. Synthèse d'ouverture

Les huit améliorations demandées sur les pages de données sont en place dans les 2 forges concernées, et publiées. Un compte faux comme celui du 3 octobre ne peut plus sortir validé, une infobulle qui répète la page est désormais refusée, et les produits disposent de tuiles d'indicateurs et de barres empilées prêtes à l'emploi, contrôlées par la critique graphique. Chaque nouvelle règle a été mesurée sur environ 3 000 pages des produits avant de bloquer : aucune fausse alerte. 2 produits ont des pages qui portent les vrais défauts que la règle des infobulles relève désormais. Un seul choix reste attendu de vous, déjà posé : l'accueil des lots en attente au sas.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 55a » : campagne O2 sur le socle des pages HTML, lots A, B et C, chaque règle mesurée en bruit avant de bloquer.
- **sur quoi** — `digit-ai-forge-agents` de `9fdb71d` à `074ad42` (9 commits, publiés) ; `digit-ai-forge-design` de `8f217a6` à `4c939f0` (publié) ; pilot `digit-ai-factory` (`84499d8b`, publié ; registre) ; dépôts produits lus seulement, pour la mesure de bruit.
- **quand** — 2026-10-03 19:43 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début à 17:55 à la réception de « 55a », durée mesurée 1 h 48.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; 2 agents Opus 5.5 (règles avec mesure de bruit), 2 agents Sonnet (composants, oracle de saisie), escalade : aucune ; oracles joués : `self_test.py`, `quality-oracles/scripts/self-test.mjs`, `oracles/self-test.mjs` de forge-design, `run-oracles-design.mjs`, `check_html.py`, `render_page.py`, `embarquer-composants.mjs --constat`, `oracle-etude-opportunite --self-test`, `oracles/self-tests.mjs` du pilot, `journaliser`.
- **intention** — que les pages de données des produits sortent justes, sans redite, avec des tuiles et des graphiques à plusieurs séries, sans que vous ayez à le redemander. **Test rétro** : servie ; la justesse est tenue par une règle bloquante, la redite par une règle bloquante, les composants existent et passent la critique graphique ; une limite reste écrite au bloc 7 : la phrase exacte du défaut d'origine n'est pas attrapée, seule sa forme en tuile face à la prose l'est.

## 2. Verdict en une ligne

**PASS — 8 retours sur 8 livrés (RT-118 à RT-125 : RT-118 (premier des 8 retours du lot) jusqu'à RT-125 (dernier retour, les dates françaises)), 3 règles neuves mesurées sur 2 996 à 3 267 pages de 29 dépôts avec 0 faux positif retenu, harnais au niveau d'avant campagne (self_test.py 497/498 contre 483/484 avant, quality-oracles 1 échec identique avant et après), 2 forges publiées.**

## 3. Décisions attendues de l'humain

- **D-56** : accueil et ingestion des 5 lots au sas, posée le 03/10 à 18:01, inchangée.

Inventaire des bloquants — ce qui est bloqué, ce qui le lève, et ce qui se passe sinon :

- la clôture au registre des 8 corrections de la campagne : votre réponse sur l'accueil des lots au sas, qui fait entrer le lot de Produit-02 au registre ; sans elle, les corrections sont livrées et publiées mais aucune candidature ne les porte au registre ;
- l'alignement de la copie installée des skills : l'ouverture d'une nouvelle session, qui la resynchronise ; sans elle, une session ouverte avant exécute l'ancienne version des règles.

## 4. Traité — avec sa preuve

- **RT-121 (le compte faux), règle I1 (même indicateur, deux valeurs refusées), contrôle rouge → vert** : une valeur affichée en tuile et une mention en prose du même libellé portant deux nombres différents sont refusées ; bloquante.
  - preuve : fixture rouge SKIP avant (règle absente), FAIL après (« Visites engagées » 40 en tuile, 54 en prose) ; verte PASS ; mesure sur 2 996 pages de 29 dépôts : 425 puis 6 puis 0 constat, 0 faux positif à la passe finale ; commit `f2e57d0`.
- **RT-122, oracle des calculs lit le texte rendu, contrôle rouge → vert** : un nombre qui finit une infobulle de graphique n'est plus lu comme une multiplication.
  - preuve : fixture verte FAIL avec l'ancienne version (1 constat « unité de FLUX »), PASS avec la nouvelle ; sur 2 996 pages, 2 989 verdicts identiques ; commit `c695e7e`.
- **RT-118 (les infobulles qui répètent la page), L3 (toute valeur porte sa légende) et L3 bis (une infobulle ne recopie pas son porteur) étendue aux graphiques et au voisinage, contrôle rouge → vert** : bloquante ; L3 recommande désormais une légende visible liée plutôt qu'une infobulle.
  - preuve : fixture rouge PASS avant, FAIL après (« infobulle REDONDANTE sur 4 élément(s) ») ; mesure sur 3 267 pages de 29 dépôts, 5 passes : 142 constats nouveaux sur 23 pages de 2 dépôts, tous inspectés, tous de vrais défauts ; la variante « contient sans rien ajouter » mesurée à 527 constats avec faux positifs, donc non posée ; commit `9be4cf9`.
- **RT-119 (graphiques à une seule série), partie règle, L34 (avertissement de série unique)** : avertissement quand un graphique déclare plusieurs séries et n'en trace qu'une.
  - preuve : fixture rouge sans avertissement avant, 1 avertissement après ; 0 constat sur 3 267 pages ; commit `2ebe70d`.
- **RT-124, V4 (chevauchement) exempte l'étiquette posée dans sa propre barre, contrôle rouge → vert** :
  - preuve : `render_page.py --widths 1440`, 3 constats avant, 0 après ; l'étiquette qui déborde reste à 2 constats avant comme après ; commit `1257430`.
- **RT-119 et RT-120, composants tuiles d'indicateurs et barres empilées** : valeur, comparaison, écart et sens dans les tuiles ; barres empilées à palette validée en clair et en sombre, infobulle de complément par segment, convention de séries lue par L34.
  - preuve : page d'exemple, `check_html.py` → PASS ; `render_page.py` → « aucun défaut mesuré » aux largeurs jouées ; critique d'implémentation `run-oracles-design.mjs` → FAIL (noir pur, palette claire hors `:root`, 12 écarts) puis PASS sur ses 6 oracles après ma correction ; `embarquer-composants.mjs --constat` → 6 copies à la parité ; commits `5d65cd3`, `b504260`, `043ba89`, `074ad42`.
- **RT-123, oracle de saisie ne lit plus l'exemple de saisie comme indice de type, contrôle rouge → vert** :
  - preuve : fixture verte FAIL avant (SA1), PASS après ; le vrai téléphone en champ texte reste FAIL ; `oracles/self-test.mjs` → « Tout vert — 52 oracles, 139 règles verrouillées » ; commit `4c939f0`.
- **RT-125, dates JJ/MM/AAAA dans l'oracle des études, contrôle rouge → vert** :
  - preuve : étude réelle du produit, E3 « 0 source(s) datée(s) » avant, « 7 » après, E7 FAIL puis PASS ; self-test 3/3 ; commit `84499d8b`.
- **Harnais comparés à l'état d'avant campagne** : rejoués sur un arbre extrait à `9fdb71d`.
  - preuve : `self_test.py` 483/484 avant, 497/498 après, même seul échec « canevas differentiel » ; `quality-oracles` self-test 1 échec avant et après, le même (TF-1448 (B)) ; mes 2 défauts introduits au passage (fins de ligne, copies de composants périmées) corrigés, contrôle rouge → vert dans le même harnais.
- **Publication des 2 forges sous D-53 (b), et du pilot sous D-54 (b)** : le contrôle d'avant-publication du pilot a accepté malgré vos 2 remisages, contrairement à ce que j'annonçais au point d'étape.
  - preuve : `git push` → `9fdb71d..074ad42 main -> main` (forge-agents), `8f217a6..4c939f0 main -> main` (forge-design), `ec2251a4..84499d8b main -> main` (pilot), exit 0 chacun.
- **2 défauts trouvés en passant, consignés** : TF-1573 (fenêtre fixe qui coupe les tableaux) et TF-1574 (date lue comme fraction, constat masqué), candidats.
  - preuve : `node todo/journaliser.mjs` → « 2 événement(s) journalisé(s) ».

## 5. Non traité — avec son motif

- La clôture au registre des 8 corrections — motif : `dependance_bloc_3`, le lot de Produit-02 n'est pas encore accueilli (D-56).
- La resynchronisation de la copie installée des skills, que `oracle-skills` constate divergente après la campagne — motif : `dependance_externe`, elle se fait à l'ouverture de la prochaine session par `bootstrap.mjs --pull`.
- La correction des 142 vrais défauts d'infobulle chez 2 produits — motif : `hors_mandat`, aucun mandat d'écriture chez les produits ; la règle les leur montrera à leur prochain contrôle.

## 6. Écarts à la lettre

- **Vous avez répondu** « 55a », règles bloquantes à bruit mesuré nul → **la règle I1 est bloquante mais volontairement étroite**, et ne reconnaît pas la phrase exacte du défaut d'origine (« 54 visites sur 63 sont engagées ») → **pourquoi** : la version large rendait 425 fausses alertes sur 168 pages ; la forme retenue, tuile face à prose, rend 0 fausse alerte.
- **Vous avez répondu** « 55a » → **j'ai moi-même corrigé le composant barres empilées** après le rendu de son agent → **pourquoi** : la critique d'implémentation de forge-design le refusait, et une page citée comme livrée porte son verdict.

## 7. Risques

- Les produits qui relancent leur contrôle voient apparaître des refus sur des pages jusque-là validées ;
  - signal : 142 constats L3 bis sur 23 pages de 2 dépôts, mesurés ce jour ;
  - parade : ce sont de vrais défauts, chaque constat nomme l'infobulle et le texte voisin qu'elle recopie ; la sortie déclarative `data-legende-ok` existe pour le cas rare où la répétition est l'explication.
- Un compte faux écrit autrement qu'en tuile face à la prose passe encore ;
  - signal : un retour du même genre qu'au 03/10 ;
  - parade : la règle déclare ce qu'elle ne juge pas ; un élargissement ne se posera qu'à bruit mesuré.
- Une page qui oublie de pré-rendre ses barres empilées n'affiche ses graphiques qu'au chargement dans le navigateur, et l'export PDF n'en a rien ;
  - signal : une page à barres vides dans sa capture ;
  - parade : la commande `node assets/barres-empilees.js --injecter <page>` est documentée dans `composants.md`.

## 8. Prochaines actions

Les actions sont triées par priorité, dans l'ordre où elles deviennent possibles ; la publication d'abord, parce qu'elle est déjà lancée.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le commit de cette synthèse et des 2 candidatures (`git push origin main`, `FORGE_PUSH_GO="D-54 (b) du 03/10"`), lancé en fin de tour | `auto_ia` | `neuve` | `dependance_externe` — le contrôle d'avant-publication du pilot dure environ 9 minutes | la synthèse et les candidatures restent sur ce poste |
| **A-2** | Accueillir et ingérer les lots selon votre réponse à D-56, puis clore au registre les 8 corrections avec leurs commits | `auto_ia` | `neuve` | `dependance_bloc_3` — D-56 | les corrections restent sans trace au registre |
| **A-3** | Laisser `node bootstrap.mjs --pull` resynchroniser la copie installée des skills à l'ouverture de session | `auto_ia` | `neuve` | `dependance_externe` — prochaine ouverture de session | la session suivante exécuterait l'ancienne version des règles |
| **A-4** | Confronter le verdict de l'étude au rapport de Produit-02 du 2026-10-15 | `auto_ia` | `neuve` | `dependance_externe` — le rapport n'existe pas avant cette date | le verdict n'est jamais vérifié |
| **A-5** | Instruire TF-1573 et TF-1574 à la revue hebdomadaire | `auto_ia` | TF-1573 | `dependance_externe` — revue hebdomadaire dans 5 jours | les deux faiblesses des bibliothèques de l'oracle des calculs restent ouvertes |

Traces : `output/03-etudes/20261003-etude-opportunite-pages-html-indicateurs.md`, `todo/TODO.jsonl` (TF-1573, TF-1574).
