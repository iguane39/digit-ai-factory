---
destinataire: humain
---

# Synthèse de mandat : vos décisions D-1 (a) et D-2 (a) sont exécutées, la Factory suit les modèles par famille et mesure la version servie, et le pilotage passe à Opus (25/09/2026)

Vos 2 choix sont appliqués. La Factory désigne maintenant ses modèles par leur famille, et elle mesure la version réellement servie. Chaque ouverture de session du pilot lit les réponses récentes du poste et signale toute version plus récente que celle inscrite au référentiel daté. Le journal des runs note la version servie, et les agents fabriqués par la forge d'agents déclarent leur famille au lieu d'hériter de votre session. Le pilotage passe à Opus dans le contrat, et vos 2 réglages du poste suivront la prochaine version d'Opus sans geste. Le premier passage a trouvé 2 produits encore épinglés sur Opus 4.8. Le re-test du routage est dû, et il se fera au premier run qui s'y prête. Il vous reste 2 gestes : trancher la correction du contrôle de la forge de tests, et donner le feu vert d'enregistrement et de publication.

## 1. En-tête d'identification

- **quoi** — exécution de vos décisions D-1 (a) et D-2 (a) : référentiel daté et oracle câblé à l'ouverture du pilot, contrat et noyau, compilateur et ledger de forge-agents, réglages du poste, registre.
- **sur quoi** — le pilot `digit-ai-factory`, la forge `digit-ai-forge-agents`, les 2 fichiers de réglages du poste ; lecture seule des transcripts de Claude Code du poste.
- **quand** — 2026-09-25 16:39 UTC+02:00 (Europe/Paris), heure relevée par `date` ; durée mesurée 32 min, depuis la première commande du tour à 16:07:53.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5`, effort max). Pilot à `1a747f5`, travail non enregistré ; forge-agents de `58bd7cc` à `c03fb1e`. Aucun agent délégué, escalade de modèle : aucune. Contrôles joués : `oracle-modeles-en-service`, `hook-ouverture`, `oracle-claude-md`, `oracle-chemin-prescrit`, `oracle-banc-double-sens`, `oracle-controles-injoignables`, `oracle-regle-sans-juge`, `oracle-ecriture`, `oracle-fraicheur-doc`. Côté forge-agents et registre : self-test, `oracle-defs`, `ingerer-lot.mjs`, `journaliser.mjs`, `oracle-todo`, `oracle-boite-entree`, puis `oracle-synthese`.
- **intention** — que la Factory suive les nouvelles versions de modèles et le mesure, et que le contrat désigne au pilotage le modèle que le poste sert. **Test rétro** : servie. Une version plus récente fait désormais échouer un contrôle joué à chaque ouverture, la version servie entre au ledger, et le contrat, le noyau et le poste disent tous Opus au pilotage.

## 2. Verdict en une ligne

**D-1 (a) et D-2 (a) exécutées. Oracle câblé à l'ouverture : recette 16/16 PASS, 196 transcripts lus en 473 ms. forge-agents : 52/52 PASS, commit local `c03fb1e`. Pilotage Opus au contrat, au noyau et dans les 2 réglages du poste ; TF-1393 et TF-1394 clôturées, TF-1392 en D-3 ; rien n'est poussé.**

## 3. Décisions attendues de l'humain

> **D-3 — Faut-il rendre juste le contrôle d'épinglage de forge-tests, qui prend les identifiants Claude en service pour des alias instables ?**
>
> Le pan prompts de `digit-ai-forge-tests` ne tient un modèle pour épinglé que si son identifiant porte une date. Anthropic ne publie aucune variante datée pour les modèles sortis depuis Opus 4.6 : `claude-opus-5-5` ou `claude-fable-5-1` y sont lus comme des alias mouvants, et le message du constat pousse vers un identifiant plus ancien. Produit-61 a contesté 18 constats de ce type le 05/09, et la contestation expire le 05/12.
>
> **Recommandation : (a).** Source consultée : exécution de `est_epingle()` le 24/09, False sur 4 identifiants en service ; tableau `shared/models.md` du skill claude-api, sans variante datée depuis Opus 4.6 ; candidature TF-1392 au registre. Le contrôle reste utile aux produits : un vrai alias change le système testé sans qu'aucun commit ne bouge.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** reconnaître comme épinglé un identifiant publié sans variante datée, par une liste datée et sourcée (loi n° 4) ; les vrais alias (formes `-latest`, `claude-haiku-4-5` qui pointe vers un instantané daté) restent signalés ; paire de fixtures rouge et verte | effort simple × court dans `digit-ai-forge-tests` | exclut la règle actuelle « suffixe daté ou rien » |
| **(b)** exempter les modèles Anthropic du contrôle d'épinglage | effort simple × court | exclut la détection des vrais alias Anthropic, dont les formes `-latest` |
| **(c)** laisser la candidature en attente | effort nul | exclut toute correction ; chaque produit qui nomme un modèle courant doit contester le constat |

> **Si rien n'est décidé** : l'option (c) s'applique ; le constat revient chez Produit-61 à l'expiration de sa contestation, le 05/12/2026.

## 4. Traité — avec sa preuve

Chaque geste commandé par D-1 (a) et D-2 (a) est listé ici avec la sortie qui l'établit.

- **D-2 (a), le contrat et le noyau** : le tableau de routage de `CONTRAT-INTERFACE.md` donne le pilotage à Opus, par le nom de famille `opus[1m]` ; le noyau `CLAUDE.md` dit « pilotage Opus ».
  - preuve : `oracle-claude-md` PASS, noyau à 6 143 octets pour un plafond de 6 144 ; `grep` de « pilotage Fable » : 0 occurrence dans le contrat et le noyau.
- **D-2 (a), le poste** : `"model": "opus[1m]"` dans `~\.claude\settings.json` et `~\.claude-b\settings.json`, effort max conservé.
  - preuve : relecture par Node, JSON valide dans les 2 fichiers ; mesure du 24/09 sur ce poste : un réglage `opus[1m]` est servi par `claude-opus-5-5[1m]`.
- **D-1 (a), le référentiel** : `references\MODELES-EN-SERVICE.json`, daté du 25/09 et sourcé (3 sources), une version par famille, les versions antérieures, et le re-test de la règle de challenge inscrit « dû ».
  - preuve : règle MS1 PASS ; entrée ajoutée à `references\INDEX.md`, règle N3 de `oracle-claude-md` PASS.
- **D-1 (a), le déclencheur** : `oracles\oracle-modeles-en-service.mjs` lit les versions servies dans les transcripts du poste, sessions et sous-agents compris. Il les situe par rang et échoue sur une version plus récente que la génération courante. Il est câblé à chaque ouverture du pilot.
  - preuve : recette à double sens 16/16 PASS, dont 4 cas rouges (nouvelle version, famille inconnue, référentiel sans source, famille mal nommée). Passage réel : 196 transcripts lus en 473 ms, 6 versions situées, verdict PASS. Hook d'ouverture rejoué en 35 s, section « Modèles en service » rendue. `oracle-banc-double-sens`, `oracle-controles-injoignables`, `oracle-chemin-prescrit` et `oracle-regle-sans-juge` : PASS, 0 constat sur ces fichiers.
- **D-1 (a), le contrat** : §1 champ `modele_version` ; §4 nom de famille, génération renvoyée au référentiel, déclencheur à toute nouvelle version d'un modèle du tableau ; §4 bis version servie consignée.
  - preuve : diff de `CONTRAT-INTERFACE.md` ; `oracle-ecriture` rend SKIP sur ce document, antérieur à ses règles.
- **D-1 (a), le ledger** : `ledger.mjs append` relève `modele_version` dans le transcript de la session, fil principal et sous-agents, quand l'entrée porte une famille sans version ; sinon il écrit l'entrée sans, et le dit.
  - preuve : relevé réel dans cette session, sur un ledger jetable : `opus` donne `claude-opus-5-5`, `haiku` donne `claude-haiku-4-5`, `sonnet` absent et dit `[NON VÉRIFIÉ]` ; `verify` PASS.
- **D-1 (a), les agents compilés** : champ `modele` d'`agent.def` compilé en `model:`, `sonnet` quand il est absent, identifiant de version refusé ; collecte-scripts et collecte-structure en `haiku`, synthese-rapport en `sonnet`.
  - preuve : self-test de forge-agents 45 puis 52 PASS, 0 FAIL, dont 1 cas rouge sur `claude-opus-5-5` ; `oracle-defs` PASS ; commit local `c03fb1e`, 11 fichiers. Skill 1.1.0 propagé au poste, `sync-skills --diff` aligné ; `.claude-b\skills` est une jonction vers `.claude\skills`.
- **Registre** : les 3 candidatures d'hier sont ingérées sous TF-1392 à TF-1394. TF-1393 et TF-1394 passent « décidé » par D-1 (a), puis au statut de clôture sur preuve ; TF-1392 reste candidate.
  - preuve : `ingerer-lot.mjs` exit 0, lot `c242640378f1` ; `journaliser.mjs`, oracle du registre PASS avant et après ; `oracle-todo` PASS ; `oracle-boite-entree` PASS ; les recettes 16/16 et 52/52 sont citées dans les entrées.
- **Premier constat du déclencheur** : Opus 5 n'a plus été servi après le 24/09 dans aucun des 11 dossiers de projet qui en portent ; Opus 4.8 reste épinglé chez Produit-11 et Produit-71.
  - preuve : sortie de l'oracle, 2 avertissements MS2 (Opus 5 : 5 031 réponses ; Opus 4.8 : 128 réponses, dernière le 24/09) ; décompte par dossier de projet.

## 5. Non traité — avec son motif

- Le re-test de la règle de challenge lui-même ; motif : hors mandat, il demande 2 tranches comparables d'un vrai run ou d'une campagne. Il est inscrit « dû » au référentiel et se redit à chaque ouverture.
- Les 5 agents compilés de l'espace d'engagement local de forge-agents (propale, recette, rendu) ; motif : hors mandat, ce sont les artefacts d'un run client, ignorés par git. Ils prendront `model:` à leur prochaine compilation.
- L'enregistrement du pilot et le push des 2 dépôts ; motif : décision humaine, la règle 38 fait du push un geste sur accord (A-11).
- Le manifeste `versions-livrees.json` de forge-agents, qui dit encore 1.0.0 ; motif : écarté, `--livrer` se joue quand le lot part.
- La densité de tirets de `references\INDEX.md`, règle EC-1 en échec ; motif : écarté, antérieur à ce tour (58 ‰ avant, 53 ‰ après mon ajout). Les tirets viennent des titres des documents que l'index recopie : laissé tel quel.
- L'échec de fraîcheur sur le compte des produits de `references\PRODUITS.md` (17 cités, 18 au registre) ; motif : hors mandat, constaté en passant et antérieur à ce tour.
- La relecture des consignes des skills face aux changements de comportement de Fable 5.1 et Opus 5.5 ; motif : hors mandat, proposée en A-3.

## 6. Écarts à la lettre

- **Vous avez répondu** « 1a, 2a » → **j'ai exécuté** les 2 options, et j'ai aussi ingéré les 3 candidatures d'hier → **pourquoi** : les décisions portaient sur 2 d'entre elles. Le registre était calme depuis 14h12, alors que l'ingestion était prévue au prochain run.
- **L'option D-1 (a) disait** « un nom de famille dérivé du rôle » → **j'ai fait** un champ `modele` choisi par l'auteur de la définition, `sonnet` à défaut → **pourquoi** : le rôle ne se lit pas mécaniquement dans un mandat en prose. Le compilateur ne le devine pas : il refuse l'identifiant et applique le défaut du tableau.
- **L'option D-1 (a) disait** « le ledger note la version servie » → **j'ai fait** un relevé automatique à l'écriture, sans exigence à la relecture → **pourquoi** : un journal ne refuse pas un fait faute d'une précision. Un ledger ancien n'est jamais mis en échec.

## 7. Risques

- Un agent compilé sans modèle tourne désormais sur `sonnet`, là où il reprenait le modèle de la session ; un agent qui avait besoin d'Opus peut rendre moins bien.
  - signal : un critère d'arbitre qui échoue sur un agent recompilé, là où il passait.
  - parade : la règle de challenge, avec l'escalade vers `opus` consignée, ou `modele: opus` dans la définition.
- Produit-11 et Produit-71 restent sur Opus 4.8, 2 versions derrière la génération courante, et le relevé d'ouverture le redit jusqu'à 14 jours après leur dernier usage.
  - signal : l'avertissement MS2 sur `claude-opus-4-8` au relevé d'ouverture.
  - parade : un run demandé à ces produits, le pilot n'y écrivant pas sans mandat.
- La lecture des transcripts dépend du format de Claude Code (`"type":"assistant"` et `message.model`) ; un changement de format rendrait MS2 sans objet.
  - signal : « 0 version(s) servie(s) lue(s) » au relevé d'ouverture.
  - parade : la recette de l'oracle porte des lignes au format réel ; relire une ligne de transcript et adapter la lecture.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, celles qui attendent une décision en tête parce qu'elles dépendent de vous, puis vos 2 gestes.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-2 | Rendre le contrôle d'épinglage de forge-tests juste sur les identifiants publiés sans variante datée, avec sa paire de fixtures rouge et verte (reprise du 24/09, TF-1392) | auto_ia | `dependance_bloc_3` : attend D-3 ; à défaut, le faux positif revient le 05/12 chez Produit-61 | simple × court |
| A-9 | Enregistrer le travail du pilot par `git commit --only -- <chemins>`, puis pousser le pilot et forge-agents (neuve) | auto_ia | `gate_gouvernance` : attend A-11 ; à défaut, le pilot garde ce travail hors de tout commit | simple × court |
| A-3 | Relire les consignes des skills et des agents des forges face aux changements de comportement de Fable 5.1 et Opus 5.5, par la sous-commande `prompt-audit` du skill claude-api : rapport et proposition de diff, sans rien appliquer (neuve le 24/09, reprise) | auto_ia | `hors_mandat` : relève d'un mandat d'audit ; à défaut, des consignes écrites pour les versions précédentes restent sans relecture | moyen × court |
| A-8 | Mesurer le routage sur 2 tranches comparables, une en Opus 5.5 et une en Sonnet 5, au premier run ou à la première campagne qui en porte, puis clore le re-test au référentiel (neuve) | auto_ia | `hors_mandat` : relève du prochain run ou de la prochaine campagne ; à défaut, le relevé d'ouverture redit le re-test dû à chaque session | moyen × moyen |
| A-10 | Trancher D-3 : répondre « D-3 (a) », « D-3 (b) » ou « D-3 (c) » (neuve) | manuelle_utilisateur | `decision` : corriger un contrôle de forge-tests change ce que voient tous les produits audités ; sinon, l'option (c) s'applique | simple × court |
| A-11 | Donner le feu vert d'enregistrement et de publication : répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` : règle 38, le push est un geste sur accord ; sinon, rien n'est enregistré au pilot ni publié | simple × court |

## 9. Traces

- Pilot, non enregistré : `references\MODELES-EN-SERVICE.json`, `oracles\oracle-modeles-en-service.mjs`, `oracles\hook-ouverture.mjs`, `CONTRAT-INTERFACE.md`, `CLAUDE.md`, `references\INDEX.md`, `todo\TODO.jsonl` (TF-1392 à TF-1394), cette synthèse.
- forge-agents : commit local `c03fb1e`, 11 fichiers, 4 commits d'avance sur l'origine.
- Poste : `~\.claude\settings.json`, `~\.claude-b\settings.json` ; skill forge-agents 1.1.0 sous `~\.claude\skills\`.
- Aucune page HTML livrée dans ce tour. Rien n'est poussé.
