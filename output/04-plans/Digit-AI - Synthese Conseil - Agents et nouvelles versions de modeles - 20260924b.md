---
destinataire: humain
---

# Synthèse de conseil : les agents suivent déjà Fable 5.1 et Opus 5.5 par héritage, mais le contrat de routage, le ledger et le contrôle d'épinglage de forge-tests sont restés à la génération d'août (24/09/2026)

Oui pour l'exécution, non pour la doctrine. Quand la Factory appelle un agent par sa famille, « opus » ou « fable », l'outil prend aujourd'hui Opus 5.5 et Fable 5.1 sans rien changer dans les forges. Les agents qui ne précisent pas de modèle reprennent celui de votre session, réglée sur Opus 5.5 à l'effort maximal. 4 pièces n'ont pas suivi. Le contrat de routage nomme encore Fable 5 et Opus 5, et le journal des runs note la famille sans la version. Aucune veille ne signale une sortie de modèle, et le contrôle de la forge de tests prend les noms de modèles actuels pour des noms instables. Pour vous, la qualité reste gardée : chaque livrable passe par un contrôle exécuté, quel que soit le modèle. En revanche, les agents d'inventaire tournent sur le réglage de votre session, Opus 5.5 à l'effort maximal, là où le contrat prévoit Haiku, et une nouvelle version entre sans être mesurée. Il vous reste 2 choix : la façon dont la Factory suit les versions, et le modèle qui pilote.

## 1. En-tête d'identification

- **quoi** — réponse à votre question, en lecture seule sur les forges : relevé du routage des modèles dans le pilot et 3 forges, lecture de la documentation de Claude Code par un agent, 3 candidatures déposées dans la boîte d'entrée du pilot.
- **sur quoi** — le pilot `digit-ai-factory` ; les forges `digit-ai-forge-agents`, `digit-ai-forge-tests` et `digit-ai-forge-observability` ; les réglages du poste ; 1 produit lu sans écriture (Produit-61).
- **quand** — 2026-09-24 19:02 UTC+02:00 (Europe/Paris), heure relevée par `date` ; durée mesurée 1 h 40, depuis le premier message de la session à 17:22:52.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`, effort max), pilot à `bb589ea` ; 1 agent délégué en lecture seule sur la documentation de Claude Code (7 appels d'outils, 48 784 jetons, modèle non exposé par le harnais) ; escalade de modèle : aucune ; contrôles joués : `est_epingle()` de forge-tests, `ingerer-lot.mjs` sur une copie du registre, `oracle-synthese`.
- **intention** — savoir si les agents de la Factory suivent seuls les nouvelles versions de modèles, Fable 5.1 et Opus 5.5, et sinon ce qui ne suit pas. **Test rétro** : servie. La réponse sépare ce qui suit seul, l'exécution, de ce qui reste figé : contrat, ledger, veille et contrôle d'épinglage, chaque point avec sa preuve exécutée.

## 2. Verdict en une ligne

**Exécution à jour, doctrine en retard : `opus` se résout en Opus 5.5 et `fable` en Fable 5.1, et les 8 agents de forge-agents héritent de la session (`claude-opus-5-5[1m]`, effort max) ; le contrat §4 nomme encore Fable 5 et Opus 5, épinglés le 10/08 ; 1 ledger sur 8 note le modèle, par sa famille seulement ; `est_epingle()` rend False sur 4 identifiants en service ; 3 candidatures valides sur copie du registre (exit 0), non ingérées.**

## 3. Décisions attendues de l'humain

> **D-1 — Comment la Factory doit-elle suivre les nouvelles versions de modèles, Fable 5.1 et Opus 5.5 aujourd'hui, les suivantes demain ?**
>
> Aujourd'hui les agents suivent les versions par héritage. Le nom de famille (`opus`, `fable`) prend la dernière version, et un agent sans modèle déclaré reprend celui de la session. Le contrat `CONTRAT-INTERFACE.md` nomme encore Fable 5 et Opus 5, et ne se révise qu'au changement de famille. Le ledger des runs ne note jamais la version, et les agents compilés par `digit-ai-forge-agents` ne portent aucun modèle. Opus 5.5 a pourtant changé l'effort par défaut côté API (medium au lieu de high), son tarif, et 4 comportements de l'API selon le guide de migration d'Anthropic.
>
> **Recommandation : (a).** Source consultée : `CONTRAT-INTERFACE.md` §4 (« un saut de génération renforce la règle de challenge […] ne jamais reconduire l'ancienne table par habitude ») ; loi n° 4 du noyau `CLAUDE.md` (une donnée volatile est une donnée datée et sourcée) ; documentation de Claude Code, page model-config (le nom de famille suit la dernière version). Suivre par famille garde le bénéfice automatique des versions ; la trace et le re-test le rendent mesurable.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** suivre par famille et mesurer : la génération courante devient un référentiel daté et sourcé ; toute nouvelle version d'un modèle du tableau déclenche le re-test de la règle de challenge ; le ledger note la version servie ; `agent.def` et son compilateur portent un nom de famille dérivé du rôle | effort simple × court pour le contrat et le ledger ; moyen × court pour le compilateur de forge-agents | exclut l'épinglage : une version entre dès sa sortie, et le re-test la juge ensuite |
| **(b)** épingler et monter sur décision : les noms de famille sont fixés par les variables `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL` et `ANTHROPIC_DEFAULT_FABLE_MODEL` ; chaque nouvelle version attend un run de re-test et votre accord | effort moyen × court, puis 1 arbitrage de votre part à chaque sortie | exclut le gain automatique des nouvelles versions ; une version reste en place jusqu'à votre accord |
| **(c)** laisser en l'état | effort nul | exclut toute mesure par version ; le contrat continue de décrire une génération qui n'est plus servie |

> **Si rien n'est décidé** : l'option (c) s'applique ; les agents suivent les versions sans trace, et les 3 candidatures restent au stade de candidat.

> **D-2 — Quel modèle le contrat doit-il désigner pour le pilotage : Fable, comme il l'écrit, ou Opus, comme le poste est réglé ?**
>
> Le tableau de routage de `CONTRAT-INTERFACE.md` réserve le pilotage, l'arbitrage et la synthèse à Fable, « jamais délégué ». Le poste est réglé sur `claude-opus-5-5[1m]` à l'effort max, un identifiant complet qui ne suivra pas une future version d'Opus. Les sessions du pilot ont tourné sur Fable 5.1 du 17 au 21/09, puis sur Opus 5.5 depuis le 23/09. Les agents sans modèle déclaré héritent de ce réglage, effort compris.
>
> **Recommandation : (a).** Source consultée : synthèse de réglage d'une session de Produit-03, le 24/09 à 15h36, dont l'intention écrite est « que toute nouvelle conversation Claude Code ouverte dans VS Code parte sur Opus 5.5 au niveau d'effort Max » ; `CONTRAT-INTERFACE.md` §4. Le contrat doit décrire le réglage que vous avez choisi, et le nom de famille évite de revenir sur ce choix à chaque version d'Opus.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** acter Opus au pilotage par le nom de famille `opus[1m]` : le contrat l'écrit, les 2 fichiers de réglages du poste l'adoptent, la session suit la prochaine version d'Opus | effort simple × court : 1 ligne du contrat, 1 clé par fichier de réglages | exclut Fable 5.1 au pilotage, sauf session ouverte exprès sur Fable |
| **(b)** revenir à Fable 5.1 au pilotage, comme l'écrit le contrat : les réglages du poste passent au nom de famille `fable` | effort simple × court ; tarif API 2,5 fois celui d'Opus 5.5 (10 et 50 USD par million de jetons, contre 4 et 20) | exclut le réglage Opus 5.5 à l'effort max posé le 24/09 |
| **(c)** laisser l'écart : le contrat dit Fable, le poste tourne sur Opus 5.5 épinglé | effort nul | exclut la cohérence entre contrat et poste ; la prochaine version d'Opus attendra un réglage à la main |

> **Si rien n'est décidé** : l'option (c) s'applique ; le contrat et le poste divergent sans que ce soit écrit.

## 4. Traité — avec sa preuve

Le relevé couvre le pilot, 3 forges et les réglages du poste ; chaque point porte la commande ou la source qui l'établit.

- **Le nom de famille suit la dernière version** : `opus` donne Opus 5.5, `fable` Fable 5.1, `sonnet` Sonnet 5, `haiku` Haiku 4.5. Un sous-agent sans `model:` hérite du modèle de la session, et sans `effort:` de son effort.
  - preuve : agent de documentation, pages `code.claude.com/docs/en/model-config` et `code.claude.com/docs/en/sub-agents` ; dérogation possible par `ANTHROPIC_DEFAULT_OPUS_MODEL` et ses 3 pareilles, et par `CLAUDE_CODE_SUBAGENT_MODEL`. Mesure sur ce poste, le 24/09 à 15h36, dans une session de Produit-03 : réglage `opus[1m]`, session neuve servie par `claude-opus-5-5[1m]`.
- **La session et ses agents tournent sur Opus 5.5 à l'effort max** : `"model": "claude-opus-5-5[1m]"` et `CLAUDE_CODE_EFFORT_LEVEL=max` dans les 2 fichiers de réglages du poste ; aucune variable `ANTHROPIC_DEFAULT_*` ni `CLAUDE_CODE_SUBAGENT_MODEL` dans l'environnement.
  - preuve : relevé `grep` des réglages et de l'environnement de la session, le 24/09 à 17h30.
- **Les agents de forge-agents ne déclarent aucun modèle** : 0 champ `model:` sur les 8 fichiers de `.claude/agents` ; `compile-agent-def.mjs` n'émet que `name`, `description` et `tools` ; le schéma `agent.def` n'a pas de champ modèle.
  - preuve : lecture des 8 en-têtes ; `grep` de model, opus, sonnet, haiku et fable dans le compilateur, 0 occurrence ; `references/agent-def.md` de la forge.
- **Le contrat de routage est resté à la génération d'août** : « génération courante (épinglée le 2026-08-10, à réviser à chaque changement de famille) », Fable 5 et Opus 5. Le pilotage a pourtant déclaré Fable 5.1 dès le 02/09 et Opus 5.5 depuis le 23/09.
  - preuve : `CONTRAT-INTERFACE.md` §4 ; bloc 1 des synthèses 20260902a et 20260923b ; `git log -S` du pilot, premiers commits `d3e340e` (02/09) et `020f08d` (23/09).
- **Le ledger note la famille, jamais la version** : le schéma d'invocation porte `"modele": "haiku | sonnet | opus | fable"`, et 1 ledger sur 8 dans le pilot et les forges renseigne le champ, celui du 04/08.
  - preuve : `CONTRAT-INTERFACE.md` §1 ; recherche du champ dans les 8 ledgers, 1 résultat : `runs/20260804-miniveille/ledger.jsonl`, 5 valeurs.
- **Aucune veille ne suit les sorties de modèles.**
  - preuve : 0 mention de Fable, Opus, Sonnet ou Haiku dans le dossier `veille/` du pilot ; la veille IA de `digit-ai-forge-observability` suit la citation d'une marque dans les réponses génératives (README, volet 4).
- **Le contrôle d'épinglage de forge-tests rend faux sur les identifiants en service.**
  - preuve : `est_epingle()` exécuté, False pour `claude-fable-5-1`, `claude-opus-5-5`, `claude-opus-5` et `claude-sonnet-5`, True pour `claude-sonnet-4-5-20250929` ; le tableau `shared/models.md` du skill claude-api ne donne aucune variante datée depuis Opus 4.6 ; 18 constats `modele:claude-opus-5` dans les rapports de Produit-61, contestés le 05/09 jusqu'au 05/12.
- **Les forges n'appellent pas l'API Anthropic en direct** : les changements d'API d'Opus 5.5 et de Fable 5.1 (réflexion toujours active, choix d'outil forcé refusé, effort `medium` par défaut sur Opus 5.5) ne touchent aucun code de forge.
  - preuve : recherche de `@anthropic-ai/sdk`, `import anthropic` et `api.anthropic.com` dans le pilot et les 13 forges, 1 seul fichier trouvé, un banc de test du pilot (`oracles/oracle-depense-voie-par-defaut.test.mjs`).
- **3 candidatures sont déposées dans la boîte d'entrée**, une par défaut relevé : le contrôle d'épinglage de forge-tests, le contrat et le ledger du pilot, les agents compilés de forge-agents.
  - preuve : `ingerer-lot.mjs` joué sur une copie du registre, exit 0, « 3 candidature(s) ingérée(s) en CANDIDAT (lot c242640378f1) », identifiants provisoires TF-1361 à TF-1363 ; registre réel inchangé, empreinte `5256c1b3a320` avant et après.

## 5. Non traité — avec son motif

- L'ingestion des 3 candidatures au registre ; motif : écarté pour ce tour, car d'autres sessions écrivent le registre (23 événements à 17h19 et 1 à 17h25, non enregistrés) ; critère de réouverture : l'ouverture du prochain run, qui ingère la boîte d'entrée.
- Les modifications elles-mêmes (contrat, ledger, compilateur de forge-agents, contrôle d'épinglage de forge-tests) ; motif : hors mandat, votre question demandait un état des lieux. Celles du contrat, du ledger et du compilateur attendent aussi D-1 ; celle de forge-tests attend la décision sur sa candidature.
- Le re-test du routage sur Opus 5.5 et Sonnet 5, par tranches comparables ; motif : hors mandat, il relève du prochain run ou de la prochaine campagne, et du choix fait en D-1.
- Le coût réel des agents qui héritent d'Opus 5.5 à l'effort max ; motif : impossible à prouver ici, aucun relevé de consommation par agent n'existe.
- La relecture des consignes des skills face aux changements de comportement de Fable 5.1 et Opus 5.5 ; motif : hors mandat, proposée en A-3.

## 6. Écarts à la lettre

- **Vous avez demandé** si les agents s'adaptent aux nouvelles versions des modèles → **j'ai répondu** par un relevé en lecture seule, et j'ai déposé en plus 3 candidatures dans la boîte d'entrée → **pourquoi** : la doctrine TODO-FORGE fait entrer tout constat en candidat ; le dépôt ne touche ni au registre ni aux forges, et la décision reste la vôtre.

## 7. Risques

- Une nouvelle version entre sans mesure : le jour où le nom `opus` passe à la version suivante, la session et les agents changent de comportement et de coût sans trace.
  - signal : un écart de consommation ou de verdict d'oracle sans changement de code, et un ledger qui dit « opus » sans version.
  - parade : le choix « suivre par famille et mesurer » de D-1 ; d'ici là, les oracles jugent chaque livrable.
- Le faux positif de forge-tests revient le 05/12/2026 chez Produit-61, à l'expiration de la contestation, et touche tout produit qui nomme un modèle courant.
  - signal : un constat `modele-non-epingle` sur `claude-opus-5-5` ou `claude-fable-5-1` dans un rapport forge-tests.
  - parade : la candidature forge-tests (TF-1361, identifiant provisoire) ; en attendant, une contestation datée chez le produit.
- Les agents d'inventaire tournent sur Opus 5.5 à l'effort max au lieu de Haiku.
  - signal : un quota ou une facture qui monte avec le nombre d'agents d'inventaire lancés.
  - parade : passer `model: haiku` à l'appel, comme le tableau de routage le prescrit déjà ; la candidature forge-agents le rend automatique.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, celle qui ne dépend de rien avant celles qui attendent une décision ; puis vos 2 décisions, dans leur ordre.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Ingérer le lot `constats-versions-de-modeles-20260924b` au registre à l'ouverture du prochain run (neuve) | auto_ia | `hors_mandat` : relève du mandat d'ouverture du prochain run, qui traite la boîte d'entrée ; à défaut, les 3 constats restent hors du registre et hors de votre décision | simple × court |
| A-2 | Rendre le contrôle d'épinglage de forge-tests juste sur les identifiants publiés sans variante datée, avec sa paire de fixtures rouge et verte (neuve) | auto_ia | `hors_mandat` : relève du mandat de traitement du registre, une fois la candidature décidée ; à défaut, le faux positif revient le 05/12 chez Produit-61 | simple × court |
| A-3 | Relire les consignes des skills et des agents des forges face aux changements de comportement de Fable 5.1 et Opus 5.5, par la sous-commande `prompt-audit` du skill claude-api : rapport et proposition de diff, sans rien appliquer (neuve) | auto_ia | `hors_mandat` : relève d'un mandat d'audit ; à défaut, des consignes écrites pour les versions précédentes restent sans relecture, alors que le guide de migration signale sur Fable 5.1 plus de réécritures de fichiers entiers | moyen × court |
| A-4 | Appliquer D-1 : référentiel daté de la génération courante, déclencheur à chaque version, champ `modele_version` au ledger, nom de famille dans `agent.def` et son compilateur (neuve) | auto_ia | `dependance_bloc_3` : attend D-1 ; sinon, le contrat reste à Fable 5 et Opus 5 | simple × court à moyen × court |
| A-5 | Appliquer D-2 : 1 ligne du tableau de routage et la clé `model` des 2 fichiers de réglages du poste (neuve) | auto_ia | `dependance_bloc_3` : attend D-2 ; sinon, contrat et poste divergent | simple × court |
| A-6 | Trancher D-1 : répondre « D-1 (a) », « D-1 (b) » ou « D-1 (c) » (neuve) | manuelle_utilisateur | `decision` : le rythme de montée de version engage le coût et le comportement des agents ; sinon, l'option (c) s'applique | simple × court |
| A-7 | Trancher D-2 : répondre « D-2 (a) », « D-2 (b) » ou « D-2 (c) » (neuve) | manuelle_utilisateur | `decision` : le modèle de pilotage engage la dépense ; sinon, l'option (c) s'applique | simple × court |

## 9. Traces

- Pilot : `input\01-candidatures\constats-versions-de-modeles-20260924b.tf.jsonl` (lot `c242640378f1`, validé sur copie, non ingéré) ; cette synthèse, `output\04-plans\Digit-AI - Synthese Conseil - Agents et nouvelles versions de modeles - 20260924b.md`.
- Relevés en lecture seule : `CONTRAT-INTERFACE.md` §1, §4 et §4 bis ; `.claude\agents\` et `.claude\skills\forge-agents\scripts\compile-agent-def.mjs` chez `digit-ai-forge-agents` ; `forge_tests\adaptateurs\prompts.py` chez `digit-ai-forge-tests` ; les 2 fichiers de réglages du poste ; `forge\constats-contestes.jsonl` de Produit-61.
- Aucune page HTML livrée dans ce tour. Rien n'est enregistré ni poussé.
