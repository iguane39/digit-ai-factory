---
destinataire: humain
---

# Synthèse de mandat — D-4 est exécutée : le système de marque Digit-AI existe à deux supports, jugé par les oracles de forge-design et déposé chez le produit ; le produit `digit-ai-marketing` naît sur disque et le skill PowerPoint apprend à consommer les jetons ; il vous reste à valider trois hypothèses de marque (11/09/2026)

Votre « 4a pour le HTML, 4b pour les PowerPoint » a été pris comme la décision qu'il est, et le geste qu'elle commandait est fait : la marque Digit-AI est écrite en jetons pour ses deux supports — les pages sur la charte du socle, les diapositives sur la charte v2 —, avec sa voix, sa règle de transparence des contenus assistés par IA et une vue consolidée, et chaque artefact a passé les oracles de forge-design avant d'être déposé dans le dossier de marque du projet dédié. Ce que ça change pour vous : le projet dédié existe désormais sur disque et son socle se construit, et le skill PowerPoint est en train d'être branché sur ces jetons au lieu de ses valeurs en dur. Ce qui est attendu de vous : valider ou corriger les trois hypothèses que la marque porte encore (le fond sombre des diapositives, les encres reprises du socle, les trois mots de ton), et les valeurs déjà demandées ce matin (dépôt privé, table des pseudonymes, feu vert de publication).

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-4 du 11/09/2026 (« 4a pour le HTML, 4b pour les powerrpoints ») : journalisation sur les candidatures de la marque et de la transparence, lot de la marque joué par `systeme-de-marque` en mode digit-ai (deux sources DTCG, deux feuilles dérivées, voix, vue consolidée, page témoin), oracles de forge-design exécutés, dépôt chez le produit ; lancement du run de naissance du produit (socle et conception, délégué) et du branchement du skill PowerPoint sur les jetons (délégué, sous mandat) ; deux constats en passant journalisés.
- **sur quoi** — le pilot `digit-ai-factory` (registre, candidatures, cette synthèse) ; le produit `digit-ai-marketing` (`C:\dev\digit-ai-marketing`, créé ce jour, dépôt local sans distant : dossier `donnees\marque\` déposé par le pilot, socle et conception par un agent délégué) ; le dépôt frère `digit-ai-forge-agents` (skill `digit-ai-pptx`, par un agent délégué sous mandat D-3 (a)) ; lectures seules sur `digit-ai-forge-design` (corpus, générateurs, oracles) et le socle HTML installé.
- **quand** — 2026-09-11 14:20 UTC+02:00 (Europe/Paris) ; tour précédent clos à 13:45 ; durée ≈ 35 min ; deux agents encore en cours à l'heure de cette restitution (naissance lancée à 13:52, branchement PowerPoint lancé à 14:14), qui sera redéposée à leur retour (v2.18.0).
- **qui** — pilot local `d46a676` (`origin/main` = `d65c578`, 9 enregistrements en avance) ; forge-agents local `7db103e` (1 en avance) ; produit `digit-ai-marketing` : `git init` fait, aucun enregistrement encore ; session Fable 5.1 ; deux agents délégués sur Opus (construction dans un dépôt neuf ; modification bornée d'un skill dans un dépôt frère ; escalade : aucune) ; oracles joués : `todo\journaliser.mjs` avec `oracle-todo` avant et après, `oracle-dtcg` (D1 forme des jetons, D2 alias résolus, D3 régénération à l'octet) ×3, `oracle-tokens` ×2 (de T1 (aucune couleur littérale hors des jetons) à T8 (focus prescrit et contrasté contre le fond)), `oracle-motion` (R1 à R10), `check_markdown.py` (M7, M10, M14, M18 : ouverture de chapitre, mode de lecture des tableaux, marqueurs de travail, glose des identifiants) ×2, `generer-tokens-css.mjs` ×2, `generer-design-md.mjs`, `todo\ingerer-lot.mjs`, `oracle-synthese` (ce document).

## 2. Verdict en une ligne

**D-4 journalisée (2 événements `decide` sur TF-1023 et TF-1030, `oracle-todo` PASS avant et après) ; système de marque Digit-AI produit à deux supports : `tokens.tokens.json` (26 jetons de couleur par thème relevés dans le socle HTML, focus prescrit, encre des badges ajoutée) → `tokens.css`, `oracle-dtcg` PASS ; `tokens-diapositives.tokens.json` (20 par thème, charte v2, hypothèses marquées) → `tokens-diapositives.css`, `oracle-dtcg` PASS ; page témoin `oracle-tokens` **FAIL puis PASS** (T5 (contraste du texte posé sur sa surface) à 2,41:1 corrigé par le jeton d'encre blanche des badges, 4 avertissements T7 (contraste non textuel des filets posés) sur des filets décoratifs), `oracle-motion` PASS (1 avertissement R5 (origine de transformation d'un élément ancré)) ; `MARQUE.md` lisibilité PASS ; `DESIGN.md` généré (contraste texte 17,26:1, primaire 5,00:1) ; 9 fichiers déposés dans `digit-ai-marketing\donnees\marque\`, `oracle-dtcg` rejoué sur place PASS ; produit sur disque (`CLAUDE.md`, `forge\`, `docs\`, `input\`, `output\`, `donnees\`), socle et conception en cours ; branchement de `digit-ai-pptx` sur les jetons en cours ; 2 constats en passant ingérés (TF-1034, TF-1035, lot 67e4e9f44eba) ; 1 enregistrement local du pilot `d46a676`, 0 push.**

## 3. Décisions attendues de l'humain

Une décision neuve. D-2 du matin reste ouverte et n'est pas reposée (bloc 5).

> **D-5 — Les trois hypothèses que le système de marque porte encore sont-elles validées telles quelles ?**
>
> Le lot de la marque a relevé ce qui était attesté et marqué ce qui ne l'était pas, sans rien inventer en silence. Trois choses restent des hypothèses datées du 11/09/2026 : la valeur du fond sombre des couvertures et intercalaires de diapositives, que la charte v2 nomme sans la chiffrer (retenue : l'encre du socle, un bleu marine) ; les encres, filets, accents sémantiques, rayons et espacements des diapositives, repris du socle HTML pour qu'une seule famille de valeurs serve les deux supports là où la charte v2 ne dit rien ; et les trois mots de ton de la voix — « précis, testable, franc » —, relevés dans les règles déjà écrites des skills en service plutôt que choisis. Tant que ces hypothèses ne sont pas validées, la marque est consommable mais le dirigeant n'a pas dit que c'est la sienne.
>
> **Recommandation : (a).** Source consultée : le skill `systeme-de-marque` (« Trois mots de ton concrets » ; « ce qui EST vérifiable, c'est la constance » ; la justesse d'une voix « relève de l'arbitrage du commanditaire ») et `references\PRODUCTION-OOXML.md` (« la charte se RELÈVE — elle ne se déduit jamais ») ; `MARQUE.md` du produit, sections « Supports » et « Barre externe et provenance », qui listent ces hypothèses avec leur provenance.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) valider les trois hypothèses telles quelles — les mentions « à valider » sont retirées, la marque devient attestée | effort simple × court : trois éditions de sources, régénération des dérivés, oracles rejoués | exclut un fond de couverture différent de l'encre du socle sans un lot de marque de plus |
| (b) valider avec corrections — répondre « D-5 (b) : fond sombre = <hex>, ton = <trois mots> » ou toute partie | effort simple × court une fois les valeurs données : mêmes gestes avec vos valeurs | exclut de deviner : sans valeur fournie, l'hypothèse reste |
| (c) ne pas valider maintenant | effort nul | exclut que les livrables sortent sous une marque attestée : ils porteront la mention « à valider » dans leur provenance |

> **Si rien n'est décidé** : l'option (c) s'applique — les hypothèses restent datées et marquées, les livrables les portent en provenance, et le plan de revue de l'étude (2026-10-09) les rejoue.

## 4. Traité — avec sa preuve

- **D-4 est journalisée** sur la candidature de la marque et celle de la transparence.
  - preuve : `node todo\journaliser.mjs --fichier decision-d4.json` → « 2 événement(s) journalisé(s) … | avant PASS | apres PASS » ; TF-1023 : « la marque Digit-AI se relève à DEUX supports, divergence datée et motivée » ; TF-1030 : règle de transparence portée par le lot de la marque.
- **Le système de marque existe à deux supports, jugé avant dépôt.** Support HTML : source DTCG relevée dans le boilerplate du socle installé (26 jetons de couleur par thème dont le registre « refus » et les six fonds pleins de badges absents du corpus de forge-design, thème sombre S-G1 du socle, focus prescrit, encre blanche des badges), feuille dérivée par le générateur de forge-design. Support diapositives : source DTCG sur la charte v2 (Montserrat / Inter, accent #2563EB, contenu #FAFBFF, couverture sombre), hypothèses marquées « à valider » dans la description. Voix : `MARQUE.md` (ton, registre, vocabulaire à dix lignes, actions, erreurs, états vides, anti-références, supports, transparence article 50, barre externe non instruite déclarée, provenance). Vue consolidée `DESIGN.md` scellée.
  - preuve : `build-sources-dtcg.mjs` → « tokens.tokens.json (web, 26 couleurs claires), tokens-diapositives.tokens.json (20 couleurs claires) » ; `generer-tokens-css.mjs` ×2 ; `oracle-dtcg` → **PASS** (web), **PASS** (diapositives), « D1–D3 sans écart » ; page témoin : `oracle-tokens` première passe **FAIL** (T5 majeur : « contraste 2.41:1 < 4.5:1 — --surface (#121B2E) sur --green-solid (#166534), thème sombre »), correction = jeton `solid-ink` #FFFFFF prescrit par la charte (TF-0910 « encre blanche »), seconde passe **PASS** (T7 ×4 avertissements : filets sur surface, déclarés décoratifs) ; `oracle-motion` **PASS** (R5 avertissement) ; `check_markdown.py` sur `MARQUE.md` **PASS** ; `generer-design-md.mjs` → « contraste texte 17.26:1 / sombre 17.26:1, primaire 5.00:1 » (depuis `tokens.resolu.css`, voir bloc 5 et TF-1035).
- **Les artefacts sont déposés chez le produit.**
  - preuve : `C:\dev\digit-ai-marketing\donnees\marque\` : `tokens.tokens.json` (9 342 o), `tokens.css` (6 492 o), `tokens-diapositives.tokens.json` (6 909 o), `tokens-diapositives.css` (5 093 o), `MARQUE.md` (11 964 o), `DESIGN.md` (5 627 o), `tokens.resolu.css`, `temoin.html`, `README.md` (rôle du dossier) ; `oracle-dtcg` rejoué sur place → **PASS**.
- **Le run de naissance du produit est ouvert** (agent délégué, étapes 1 et 2 de `ETAPES-RUN.md`, la spécification comme entrant).
  - preuve : à 14:13, `C:\dev\digit-ai-marketing` porte `CLAUDE.md`, `docs\`, `donnees\`, `forge\`, `input\`, `output\`, `llms.txt`, `robots.txt`, `.claude\`, `.gitignore` ; `git status` : fichiers non suivis, **aucun enregistrement encore** ; verdicts (`oracle-conformite-projet`, quatre oracles de conception) attendus à la redépose.
- **Le branchement du skill PowerPoint sur les jetons est lancé** (agent délégué, mandat D-3 (a) : `digit-ai-pptx` charge `tokens-diapositives.css` du dossier de marque de l'émetteur, rend la main sans dossier, script de lecture avec fixture double sens, 2.5.1 → 2.6.0).
  - preuve : agent lancé à 14:14 ; résultat attendu à la redépose (TF-1022, TF-1023).
- **Deux constats en passant sont au registre** : TF-1034 (le corpus de jetons de forge-design n'est plus le socle : quatre écarts mesurés) et TF-1035 (le générateur de feuille écrit un en-tête figé, le générateur de vue ne lit pas les alias qu'il prescrit).
  - preuve : `ingerer-lot.mjs` → « [OK] 2 candidature(s) ingérée(s) en CANDIDAT (lot 67e4e9f44eba) » ; `oracle-todo` **PASS** ; vues régénérées (253 actifs).
- **Le pilot est enregistré localement.**
  - preuve : `git commit --only` → `d46a676` (registre, vues, sidecar, index) ; `main...origin/main [ahead 9]`.

## 5. Non traité — avec son motif

- L'enregistrement local des artefacts de marque chez le produit — motif : dépendance externe ; l'agent de naissance écrit dans le même dépôt (index partagé) ; le pilot enregistre `donnees\marque\` par `git commit --only` dès que l'agent a rendu, pour ne pas croiser ses gestes.
- La barre externe du système de marque (`BARRE-EXTERNE.md`, étape 0 du skill) — motif : écart déclaré ; aucune direction artistique nouvelle n'a été proposée, deux chartes existantes ont été relevées et tranchées par décision humaine ; la barre s'instruira au premier livrable qui demande une direction neuve (TF-1028).
- Le scellement de `DESIGN.md` sur `tokens.css` — motif : bloqué par un garde-fou de l'outil ; le générateur refuse les alias `var()` et le jeton composite de focus, la vue a été générée depuis une feuille résolue et le dit (TF-1035) ; sa mention « focus NON PRESCRIT » est fausse pour `tokens.css` et `MARQUE.md` le déclare.
- Les étapes suivantes de la naissance (design au-delà de la marque, scripts, tests, mise en service) — motif : dépendance externe ; l'agent joue les étapes 1 et 2, le reste suit ses verdicts.
- La fixture du type de run, les lots suivants chez forge-agents (TF-1026 à TF-1028, TF-1032), les gabarits (TF-1029), la vérification du sigle (TF-1033), les constats forge-design (TF-1034, TF-1035) — motif : dépendance à une décision humaine ; l'ordre de D-3 (a) et le statut candidat des quatre derniers.
- La décision D-2 du matin — motif : dépendance à une décision humaine ; non reposée.
- Le push du pilot (neuf enregistrements), de forge-agents et du produit — motif : bloqué par un garde-fou, R-38 §4-5 ; le produit n'a pas de distant (valeur A-7 non donnée).

## 6. Écarts à la lettre

- **Vous avez écrit** « 4a pour le HTML, 4b pour les powerrpoints » → **j'ai fait** un seul système de marque à deux supports (deux sources de jetons, une voix, une vue) plutôt que deux marques → **pourquoi** : le skill produit « un tokens.css et un MARQUE.md par marque » ; deux supports d'une même marque sont une divergence datée dans un système, pas deux systèmes ; la classe `marque-emettrice-portee-par-deux-chartes` (TF-1023) admet « une divergence datée et motivée ».
- **Le skill demandait** une barre externe avant toute proposition → **j'ai** déclaré la barre non instruite → **pourquoi** : aucune proposition visuelle n'a été faite ; le relevé de deux chartes tranchées par vous n'est pas une direction à barrer.
- **Le skill demandait** des couleurs OKLCH → **j'ai** gardé les valeurs hexadécimales du socle → **pourquoi** : « la charte fait foi : ces valeurs ne sont pas retouchées » (corpus de forge-design, même choix) ; la conversion changerait des valeurs que le socle juge par quarante règles.
- **Aucun autre écart** : le mode digit-ai, les oracles exécutés avant restitution, les conflits déclarés (S4 blanc pur, T4 parité) sont ceux du skill.

## 7. Risques

- L'agent de naissance et le pilot écrivent dans le même dépôt neuf ; un enregistrement croisé emporterait des fichiers de l'autre ;
  - signal : `git show --name-only` d'un enregistrement du produit listant `donnees\marque\` sans que le pilot l'ait commis, ou l'inverse ;
  - parade : l'agent a consigne de ne pas toucher `donnees\marque\` et de n'enregistrer que ses chemins ; le pilot attend son retour avant `git commit --only -- donnees/marque`.
- Le skill PowerPoint consomme des hypothèses « à valider » (fond sombre, encres) : un deck produit avant D-5 porte des valeurs non attestées ;
  - signal : un deck livré avec la mention « à valider » dans sa provenance ;
  - parade : D-5 ; en attendant, `MARQUE.md` et la source DTCG portent la mention, et le skill la recopie dans la provenance du deck.
- Les jetons du produit divergent du corpus de forge-design (TF-1034) ; une page produite par forge-design avec son corpus et une page produite par le produit ne se ressemblent pas en thème sombre ;
  - signal : `oracle-tokens` sur une page du produit consommant le corpus de la forge ;
  - parade : le produit ne consomme que ses jetons (spécification EX-04) ; TF-1034 réaligne le corpus.
- `DESIGN.md` porte une mention fausse (« focus NON PRESCRIT ») que le gate design de forge-development pourrait lire ;
  - signal : un FAIL de `design_gate` sur le focus alors que `tokens.css` le prescrit ;
  - parade : `MARQUE.md` le déclare, TF-1035 corrige le générateur ; à défaut, le gate se lit avec la page témoin T8 PASS.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), dans l'ordre des dépendances — enregistrer la marque chez le produit dès le retour de l'agent, intégrer les deux agents, valider les hypothèses, puis les lots suivants, le push en dernier ; puis les actions humaines, dans l'ordre des décisions et valeurs qu'elles fournissent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Enregistrer `donnees\marque\` chez le produit par `git commit --only -- donnees/marque` dès le retour de l'agent de naissance, puis rejouer `oracle-conformite-projet` sur le produit (TF-1023) | auto_ia | `dependance_externe` — l'agent écrit dans le même dépôt ; à défaut, la marque reste non suivie par git | simple × court |
| A-2 | Intégrer le retour de la naissance : verdicts `oracle-conformite-projet` et des quatre oracles de conception, `EXIGENCES.json` scellé, hypothèses et questions, puis redéposer cette synthèse (TF-1024, TF-1031) | auto_ia | `dependance_externe` — agent en cours depuis 13:52 ; à défaut, le socle et la conception restent non prouvés | simple × court |
| A-3 | Intégrer le retour du branchement de `digit-ai-pptx` : `lire-marque.mjs` sur le dossier réel, self-test, recette de la forge, hash (TF-1022, TF-1023) | auto_ia | `dependance_externe` — agent en cours depuis 14:14 ; à défaut, le PowerPoint garde ses valeurs en dur | simple × court |
| A-4 | Appliquer D-5 : retirer les mentions « à valider » ou poser les valeurs fournies dans les deux sources DTCG et `MARQUE.md`, régénérer `tokens-diapositives.css` et `DESIGN.md`, rejouer `oracle-dtcg`, `oracle-tokens`, `oracle-motion`, `check_markdown.py` (TF-1023) | auto_ia | `dependance_bloc_3` — attend D-5 ; à défaut, la marque reste consommable avec ses hypothèses marquées | simple × court |
| A-5 | Poursuivre la naissance après la conception : scripts du produit avec fixtures (`consigner-issue`, `generer-mesures`, `controler-transparence`, `allouer-indice`), audit forge-tests, dossier de mise en service (TF-1024, TF-1031) | auto_ia | `dependance_externe` — après A-2 ; à défaut, le produit n'a ni registre opérationnel ni contrôle de transparence | moyen × court |
| A-6 | Jouer la fixture de `RUN-AO.md` chez le produit (cas du 24/07 pseudonymisé, `oracle-exigences-ao` X1-X3 et `oracle-claims` PASS) (TF-1025) | auto_ia | `dependance_externe` — après A-3 et A-5 ; à défaut, le type de run décrit sans prouver | moyen × court |
| A-7 | Chez forge-agents, après A-3 : référentiel d'exigences outillé, rendu OOXML, barres, contrôle de transparence, corrections TF-1032 (TF-1026, TF-1027, TF-1028, TF-1030, TF-1032) | auto_ia | `dependance_bloc_3` — ordre de D-3 (a) ; TF-1032 en candidat ; à défaut, la réponse à trame imposée reste à la main | complexe × moyen |
| A-8 | Chez le pilot : gabarits partenaires et fournisseurs (TF-1029) ; run dédié du sigle (TF-1033) ; chez forge-design sous mandat : réaligner le corpus et corriger les deux générateurs (TF-1034, TF-1035) | auto_ia | `dependance_bloc_3` — quatre candidatures en candidat ; mandat forge-design donné par D-3 (a) pour la marque seulement ; à défaut, le corpus de la forge reste désaligné | simple × moyen |
| A-9 | Pousser le pilot (neuf enregistrements), forge-agents et le produit une fois son distant créé, `FORGE_PUSH_GO` posé, portes des noms rejouées (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend A-13 et la valeur A-10 ; à défaut, tout reste local | simple × court |
| A-10 | Donner l'emplacement du dépôt privé du produit — répondre « dépôt : <hébergeur/organisation> » (TF-1024) | manuelle_utilisateur | `decision` — hébergement et coût d'un dépôt privé, R-29 ; sinon : le produit reste local | simple × court |
| A-11 | Trancher D-5 — répondre « D-5 (a) », « D-5 (b) : fond sombre = <hex>, ton = <trois mots> » ou « D-5 (c) » ; les éditions et oracles sont joués par l'IA (TF-1023) | manuelle_utilisateur | `decision` — la justesse d'une voix et d'une valeur de marque relève du commanditaire (skill `systeme-de-marque`) ; sinon : hypothèses datées en provenance des livrables | simple × court |
| A-12 | Inscrire à la table du canal confidentiel les seize correspondances de pseudonymes du lot des skills — répondre « table : inscris les seize » (neuve) | manuelle_utilisateur | `decision` — la table est alimentée à la main par l'humain (canal confidentiel) ; sinon : seize identités hors table | simple × court |
| A-13 | Donner le feu vert de publication — répondre « pousse le pilot et forge-agents » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'enregistrements portant livrables, skills et décisions est un GO humain ; sinon : tout reste en local | simple × court |
| A-14 | Trancher D-2 du matin — répondre « D-2 (a) », « (b) » ou « (c) » (TF-1021, TF-1022, TF-1023) | manuelle_utilisateur | `decision` — la décision sur un candidat est humaine (TODO-FORGE) ; sinon : deux candidats restent en candidat alors que leurs lots sont livrés | simple × court |
| A-15 | Désigner l'appel d'offres ou la propale réels d'exercice — répondre « livrable d'exercice : <objet, échéance> » (neuve) | manuelle_utilisateur | `decision` — le pilot ne connaît aucun cas en cours ; sinon : la rejouée du 24/07 tient lieu de fixture | simple × court |

## 9. Traces

- Marque chez le produit : `C:\dev\digit-ai-marketing\donnees\marque\` (`tokens.tokens.json`, `tokens.css`, `tokens-diapositives.tokens.json`, `tokens-diapositives.css`, `MARQUE.md`, `DESIGN.md`, `tokens.resolu.css`, `temoin.html`, `README.md`) ; dossier de travail `scratchpad\marque\` (`build-sources-dtcg.mjs`, hors dépôt).
- Registre : `todo\TODO.jsonl` (2 événements `decide` sur TF-1023 et TF-1030 ; TF-1034, TF-1035 créées, lot 67e4e9f44eba) ; sidecar `input\01-candidatures\forge-design-marque-digit-ai-constats-20260911a.tf.jsonl` ; vues `todo\TODO.md`, `todo\RECIDIVES.md` et la page générée du registre ; enregistrement `d46a676`.
- Produit en naissance : `C:\dev\digit-ai-marketing` (agent délégué, étapes 1 et 2) ; skill PowerPoint : `digit-ai-forge-agents\.claude\skills\digit-ai-pptx\` (agent délégué) ; résultats attendus à la redépose.
- Oracles : `journaliser.mjs` (2 écrits, PASS avant et après), `oracle-dtcg` (PASS ×3), `oracle-tokens` (FAIL puis PASS), `oracle-motion` (PASS), `check_markdown.py` (PASS ×2), `generer-design-md.mjs` (généré), `ingerer-lot.mjs` (OK, 2), `oracle-todo` (PASS), `oracle-synthese` sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme).
- Aucune page HTML livrée dans ce tour (la page témoin n'est pas un livrable).
