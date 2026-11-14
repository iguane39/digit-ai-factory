---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-11-02
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: redacteur (famille sonnet), sur consigne de l'orchestrateur
verdict_arbitre: oracle-etude-opportunite 1.2.0 PASS (E1 à E10) ; oracle-ecriture 1.1.0 PASS ; joués le 2026-11-02
hypotheses_non_resolues:
  - identifiant du candidat au registre inconnu de cette session
  - les billets autres que celui de juin 2026, les articles arXiv et la page InfoQ ont été lus par un outil qui résume, non relus en HTML brut
  - l'aptitude du poste à imposer le bac à sable du skill n'est pas mesurée
  - les deux validateurs du skill ont été lus par recherche de motifs, non en entier
  - l'origine du chiffre « 20 000 étoiles » de la vidéo n'est pas établie
---

# Étude d'opportunité — Audit de sécurité par agents de Cloudflare — 20261102f

Ce qui change pour vous : le skill de Cloudflare est une méthode en 6 phases qui lance des agents neufs pour chasser des failles dans un dépôt, puis d'autres agents neufs pour les réfuter. Il chasse des classes que `digit-ai-forge-websec` ne juge pas aujourd'hui : contrôle d'accès, injection, logique métier, isolation des données. Personne ne sait s'il les trouve. Il n'a pas été joué, et aucun chiffre de la vidéo ne le mesure.

Je recommande O1 : un essai borné sur un dépôt neuf de 12 failles semées et 2 leurres, 2 passages du skill, 3 150 000 jetons au plus, décidé sur 6 critères chiffrés fixés avant le jeu. Rien ne s'installe. La vérification adverse n'entre pas dans les oracles de websec, qui sont déterministes ; si elle se confirme, elle logerait au pilot, comme le skill `contre-expertise`.

Les chiffres de la vidéo ne se rapportent pas au skill. Les « 7 000 problèmes » sont les 7 245 constats actionnables du harnais interne de Cloudflare sur 145 dépôts, donnés par son billet du 2026-06-18. Les « 20 000 étoiles » ne valent plus : la page GitHub en montre 56 764 le 2026-11-02, et la date de tournage de la vidéo n'est pas relevée. Le billet cite 20 799 candidats bruts ; un lien avec le 20 000 de la vidéo n'est qu'une hypothèse.

Ce que vous devez autoriser pour O1 : une dépense en jetons Claude, l'exécution des consignes de la copie tierce sur la seule cible semée, et la relecture complète des deux validateurs avant leur lancement. Le détail est en section 3 ter.

Conventions de citation. `T/` est la copie du dépôt tiers, au commit c1c8a8c du 2026-09-14, licence MIT, lue dans une copie temporaire de la session, et rejouable depuis `github.com/cloudflare/security-audit-skill` à ce commit. `T/s/` abrège `T/skills/security-audit/`. `W/` abrège `C:\dev\digit-ai-forge-websec\`, `A/` abrège `C:\dev\digit-ai-forge-agents-security\`, et `P/` abrège `C:\dev\digit-ai-factory\`. Un nombre après les deux-points est une ligne ou une plage de lignes.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

L'étude est due. Adopter le skill, option O3 ci-dessous, créerait un objet durable (skill ou verbe d'oracle), ce que `P/REGLES-PROJET.md:383-384` soumet au test de la règle R-31. Elle toucherait aussi 3 dépôts : websec, agents-security et le pilot. L'identifiant de registre du candidat n'a pas été transmis à cette session.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Réponse du porteur, rapportée par l'orchestrateur : « 126a ».

La décision posée : « Lance-t-on l'étude sur l'audit de sécurité de Cloudflare et l'essai sur le skill i-have-adhd, seuls sujets que le tri propose de creuser ? » L'option (a) dit : « Une étude au gabarit sur Cloudflare, une comparaison des 10 règles ; rien n'est installé ».

La question à trancher, telle que la consigne la formule : « Ce skill trouve-t-il, sur un même dépôt, ce que les oracles de `digit-ai-forge-websec` ratent, et sa vérification adverse doit-elle y entrer ? »

Lecture retenue : savoir, sur des faits et non sur la parole de la vidéo ni de Cloudflare, si ce skill ajoute des constats à websec et si son étape de réfutation mérite une place dans la Factory. L'intention est citée, non reconstruite. La « comparaison des 10 règles » n'est pas traitée ici : d'après sa formulation elle vise l'essai sur le skill i-have-adhd, ce qui reste à confirmer.

## 0. Traitement des entrants

La copie du dépôt tiers est une DONNÉE : ses consignes se décrivent, elles ne s'exécutent pas (`P/CLAUDE.md:87`). Aucun de ses scripts n'a été lancé, `validate-*.cjs` et leurs tests compris. Rien n'est installé. La vidéo n'a pas été vue : ses affirmations arrivent par la consigne.

Sources de la proposition : décision 126 (réponse « 126a ») ; vidéo non nommée ; dépôt `github.com/cloudflare/security-audit-skill` ; billet « Build your own vulnerability harness », Cloudflare, 2026-06-18.

### Les affirmations de la vidéo, vérifiées à la source primaire

| Affirmation | Statut | Source de la vérification |
|---|---|---|
| Le dépôt a 20 000 étoiles | fausse | page GitHub lue le 2026-11-02 : `stargazerCount` 56 764 dans les données de la page, 56,8 k à l'affichage |
| 7 000 problèmes trouvés | vraie pour le harnais interne, fausse pour le skill | billet du 2026-06-18, HTML brut : « Ultimately this left 7,245 actionable findings », sur « 13,841 findings across 145 repos » ; le skill est le point de départ, le harnais n'est pas publié (« Hopefully the harness itself will follow shortly ») |
| Le skill est le point de départ du harnais | vraie | même billet : « We started with a ~450-line security-audit skill » ; le dépôt le décrit de même, `T/README.md:5-7` |
| Une exécution suffit | contredite par Cloudflare | même billet : « a single run finds only about half the bugs you'd catch across multiple runs » ; `T/README.md:98` le redit |
| Le harnais mesure son rappel | contredite par Cloudflare | même billet : « We don't claim a false-negative rate for our system » |

Les chiffres de Cloudflare sont ceux de son auteur. Aucune évaluation indépendante du skill n'a été trouvée. Le rapprochement entre 12 057 constats validés et 13 841 constats du pool central n'est pas expliqué par le billet, et je ne l'ai pas réconcilié.

## 0 bis. Le skill, phase par phase, et ce qu'il exige

Le skill a deux modes. Le mode conseil est le défaut : il ne crée aucun fichier (`T/s/SKILL.md:10-17`). Le mode audit complet se déclenche sur une demande explicite d'audit, de test d'intrusion ou de livrables (`T/s/SKILL.md:15`).

| Phase | Qui agit | Produit | Citation |
|---|---|---|---|
| 1. Reconnaissance | 4 agents `research` en parallèle : produit et pile, principaux et contrôles, surfaces d'entrée et puits, exécution locale et visibilité du déploiement ; agents ciblés en plus si besoin | `architecture.md` de 1 000 mots environ, `coverage-ledger.json` : une unité par surface × frontière × sous-système × classe d'attaque | `T/s/RECONNAISSANCE.md:9-57, 75, 90-139` |
| 2. Chasse | 1 agent `general` par unité ou groupe d'unités proches ; un prompt de 9 éléments imposés ; après chaque vague, un critique `research` neuf ; en `standard` et `deep`, un second critique distinct pour clore | un JSON par unité (`covered`, `candidate`, `blocked`), des candidats, une liste `uncovered` | `T/s/HUNTING.md:5, 13-25, 168-213, 223-247` |
| 3. Validation des candidats | 1 vérificateur `general` neuf par candidat unique, qui n'a pas chassé. Consigne : « You did not write this candidate. Try to refute it ». Il ne reçoit pas la conclusion d'un autre vérificateur | décision `confirmed`, `needs_validation` ou `rejected` | `T/s/VALIDATION-AND-REPORTING.md:5-7, 11-46` |
| 4. Sortie structurée | le parent seul écrit ; 2 validateurs Node sans dépendance | `findings.json` contrôlé par le schéma | `T/s/VALIDATION-AND-REPORTING.md:95-118` ; `T/s/validate-coverage-ledger.cjs:8-10` |
| 5. Vérification des enregistrements | 1 agent `research` neuf par enregistrement `confirmed` ou `needs_validation` ; un remplacement matériel passe à un autre vérificateur indépendant ; en profil `quick`, fusionnée avec la phase 3 | `verified` ou `replace` | `T/s/VALIDATION-AND-REPORTING.md:122-145` |
| 6. Rapport | le parent dérive 3 fichiers des enregistrements vérifiés | `REPORT.md`, `FINDINGS-DETAIL.md`, `NEEDS-VALIDATION.md` | `T/s/VALIDATION-AND-REPORTING.md:151-186` |

Ce que le skill exige, point par point :

- Modèle : aucun n'est nommé. Les 4 fichiers de procédure (`SKILL.md`, `RECONNAISSANCE.md`, `HUNTING.md`, `VALIDATION-AND-REPORTING.md`) ne contiennent aucun nom de modèle (recherche du 2026-11-02), et le texte se dit neutre vis-à-vis de l'agent (`T/s/SKILL.md:21-29`). Il n'impose pas que le vérificateur soit d'un autre modèle que le chasseur. Le billet de Cloudflare le fait pour son harnais, non pour le skill : « We use one model for VDH, but we use a completely different model for VVS ».
- Sous-agents : un agent de code qui accepte l'appel d'outils et les sous-agents en parallèle (`T/README.md:88`).
- Bac à sable : imposé par le système d'exploitation, sans réseau externe, environnement vide autorisé par liste, cible en lecture seule, écriture dans un seul dossier de travail, limites de ressources (`T/README.md:90`, `T/s/SKILL.md:33-40`). Sans lui, le skill n'exécute rien et garde la piste en `needs_validation`. Docker et WSL sont présents sur ce poste (`where`, 2026-11-02), mais leur aptitude à imposer ces 4 contrôles n'est pas mesurée.
- Profils : `quick`, `standard`, `deep` (`T/s/SKILL.md:107-117`). Le profil `quick` se présente comme une couverture partielle.
- Budget : compté en invocations d'agents, non en jetons (`T/s/SKILL.md:119-134`). En profil `quick`, le plancher est de 6 invocations avant tout chasseur : 4 de reconnaissance, 1 critique, 1 vérificateur (`T/s/SKILL.md:123`).
- Sortie : par défaut `~/security-audit-skill/<repo>/run-<N>`, hors de la cible (`T/s/SKILL.md:51`).
- Coût en jetons : non mesuré. Le dépôt ne donne aucun chiffre en jetons ni en dollars. Le billet donne un ordre relatif, « each additional pass costs roughly half as much as the initial hunt », et un pire balayage de « just over 14 hours », pour le harnais.
- Dépendances : Node.js pour les validateurs (`T/README.md:89`). Les deux validateurs n'importent que `fs`, `path` et `util` (`T/s/validate-coverage-ledger.cjs:8-10`, `T/s/validate-findings.cjs:11-13`). La recherche de `child_process`, `fetch`, `eval` et `spawn` n'y trouve rien. Ce n'est pas une relecture complète.

## 1. Partition du problème

Cinq sous-questions disjointes :

1. Faits : ce que le skill fait et ce qu'il exige. Réponse en section 0 bis.
2. Apport : ce qu'il peut trouver que les oracles de websec ne jugent pas. Réponse partielle en section 2 (recouvrement des classes), complétée par l'essai de la section 3 ter.
3. Réutilisation : ce qui se prend sans installer l'outil, sous quelle licence et malgré quelles doctrines. Section 3 bis.
4. Place de la vérification adverse : dans les oracles de websec, au pilot, ou nulle part. Sections 3 bis et 3 ter.
5. Mesure : l'essai qui sépare l'apport réel de la parole de Cloudflare. Section 3 ter.

Chaque option de la section 4 se rattache à la sous-question 5, qui conditionne les sous-questions 2 et 4.

## 2. Non-recouvrement contre l'existant

Premier tableau : les objets existants de la Factory, face aux fonctions du skill.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `oracle-exposition` et `oracle-exposition-statique` | `W/README.md:66, 68` : juge une capture HTTP et un fichier `_headers` par les règles EX-1 à EX-11 | ne recouvre pas : lit des en-têtes, jamais le code source |
| `oracle-sca` | `W/README.md:69, 125-139` : enveloppe `npm audit` et `pip-audit` | recouvre la ligne « dépendances et CVE » de `T/s/ATTACK-CLASSES.md:120` ; le skill n'y ajoute aucun outil, `oracle-sca` reste l'outil |
| `oracle-dast` | `W/README.md:159-163, 267-269` : passe baseline passive, mode actif jamais lancé | ne recouvre pas : le skill interdit tout trafic vers une cible déployée (`T/s/SKILL.md:42`) |
| `oracle-workflows` | `W/README.md:175-191` : 5 règles WF-1 à WF-5 | recouvre en partie les classes CI du skill (`T/s/SUPPLY-CHAIN-AND-RELEASE.md:33-45`) |
| référentiels ASVS L1 et WSTG | `W/referentiels/asvs-l1.md` : 37 exigences, dont 33 en « manuel » et 4 « outillé » (comptées par `grep` le 2026-11-02) | ne recouvre pas : ce sont des lignes à juger par un humain, que le skill pourrait viser |
| `digit-ai-forge-agents-security` | `A/README.md:15-17, 34-35` : juge définitions d'agents, appels d'outils, corpus d'injection ; « Aucun oracle n'appelle de modèle » | ne recouvre pas : juge l'outillage, non le produit livré ; les agents du skill relèveraient de sa porte Bash |
| skill `contre-expertise` | `~/.claude/skills/contre-expertise/SKILL.md:3, 47-51` : 3 angles, un contradicteur, 1 passe, sur un livrable fini | recouvre en partie le principe d'un contradicteur indépendant ; ne recouvre pas la réfutation de chaque constat contre le code |
| relecteur aveugle de `prompt-analyzer-l99` | étude du pilot `output/03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md:63` : « relecteur aveugle (agent neuf, sans l'analyse) » | recouvre le principe de l'agent neuf ; ne recouvre pas le prompt de réfutation ni les 3 issues |
| fiche `forge-tests` | `P/fiches/forge-tests.md:11-16, 24` : un « registre de dette » de 147 entrées | ne recouvre pas : décrit comme registre de dette ; son contenu n'a pas été lu et rien ne dit qu'il compte des unités surface × frontière × classe |

Second tableau : les classes d'attaque du skill face à ce que websec juge aujourd'hui.

| Classe du skill et citation | Contrôle de websec aujourd'hui, citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Injection, `T/s/ATTACK-CLASSES.md:29-37` | V1.2.4 (SQL) et V1.2.5 (commande OS) classées « revue humaine » et « manuel », `W/referentiels/asvs-l1.md:43-44` ; ZAP passif seulement, `W/README.md:159-163` | ne recouvre pas |
| Contrôle d'accès, `T/s/ATTACK-CLASSES.md:39-47` | WSTG-ATHZ non curé, `W/referentiels/wstg-cas.md:119` ; ASVS V8 non curé, `W/referentiels/asvs-l1.md:23-26` | ne recouvre pas |
| Logique métier, `T/s/ATTACK-CLASSES.md:64-72` | WSTG-BUSL non curé, `W/referentiels/wstg-cas.md:120` ; ASVS V2 non curé, `W/referentiels/asvs-l1.md:23-26` | ne recouvre pas |
| Fichiers et SSRF, `T/s/ATTACK-CLASSES.md:49-54` | V5 non curé, `W/referentiels/asvs-l1.md:23-26` ; aucune règle EX, HD, WF ni SCA n'en parle, `W/README.md:66-72` | ne recouvre pas |
| Cryptographie et secrets, `T/s/ATTACK-CLASSES.md:56-62` | V11 non curé, `W/referentiels/asvs-l1.md:23-26` ; V6.4.1 (codes de réinitialisation) en manuel, `W/referentiels/asvs-l1.md:85` ; aucun secret en dur au catalogue, `W/README.md:66-72` | ne recouvre pas |
| Évidences : cookies, HSTS, CORS, version serveur, CVE, `T/s/ATTACK-CLASSES.md:111-126` | EX-3 et EX-8 à EX-11, `W/README.md:80, 85-88` ; `oracle-sca`, `W/README.md:69` ; CORS en manuel, `W/referentiels/asvs-l1.md:57` | recouvre en partie : websec juge la présence d'un en-tête ou d'un attribut ; le catalogue ne liste ni secrets en dur, ni routes de debug, ni fichiers `.env` |
| Chaîne CI, `T/s/SUPPLY-CHAIN-AND-RELEASE.md:33-45` | WF-1 à WF-5, `W/README.md:183-191` | recouvre en partie : permissions, épinglage, `pull_request_target`, injection dans `run:`, OIDC sont jugés ; cache et artefacts partagés ne le sont pas |
| Dépendances, release, mises à jour, `T/s/SUPPLY-CHAIN-AND-RELEASE.md:19-31, 47-59` | `oracle-sca` : CVE connues seulement, `W/README.md:125-139` | recouvre en partie : ni confusion d'espace de noms, ni signature, ni mise à jour |
| Cache, cadrage, CSRF, session, `T/s/WEB-PROTOCOL-AND-AUTH.md:19-45` | EX-10 (SameSite), `W/README.md:87` ; alerte anti-CSRF de ZAP vue une fois sur une page statique, `W/README.md:263-265` ; V3.5.1 en manuel, `W/referentiels/asvs-l1.md:58` | recouvre en partie, seulement si ZAP est joué |
| JWT, OAuth, SAML, MFA, clés d'API, `T/s/WEB-PROTOCOL-AND-AUTH.md:47-88` | ASVS V9 et V10 non curés, `W/referentiels/asvs-l1.md:23-26` | ne recouvre pas |
| Côté client : DOM, messages, stockage, cadrage, `T/s/CLIENT-SIDE.md:19-69` | EX-1, EX-2 (CSP) et EX-5 (cadrage), `W/README.md:78-79, 82` | recouvre en partie, avec un critère opposé : EX-5 classe l'en-tête absent « majeur », le skill le classe en note de durcissement hors action sensible, `T/s/CLIENT-SIDE.md:66` |
| IAM, conteneurs, périphérie, isolation des données, épuisement de ressources, RPC, applications natives, mémoire, `T/README.md:32-41` | seul le `_headers` de Cloudflare est lu, `W/README.md:68, 98-123` ; rien d'autre au catalogue, `W/README.md:66-72` | ne recouvre pas |
| Agents et LLM dans le produit, `T/s/AI-AND-LLM.md:3-68` | `A/README.md:15-17, 252-262` : définitions d'agents, appels d'outils, 34 charges d'injection rejouées sur artefact statique | recouvre en partie : l'autre objet, l'outillage ; websec ne dit rien du produit |

Deux faits ressortent. Premièrement, 3 classes centrales d'une application web, contrôle d'accès, injection et logique métier, sont aujourd'hui sans verbe outillé dans websec, qui l'écrit lui-même (`W/README.md:276-278, 296-299`). Deuxièmement, le critère diffère : websec juge une conformité à une base de référence, le skill ne retient que les franchissements de frontière exploitables et range les défenses manquantes en durcissement (`T/README.md:96-97`, `T/s/SKILL.md:183-184`). Les deux ne se substituent donc pas.

## 3. État de l'art daté

Sept sources, toutes de moins de 24 mois, lues le 2026-11-02. Le billet de juin et la page GitHub ont été relus en HTML brut ; les autres l'ont été par un outil de lecture qui résume, leurs citations restent à reconfirmer sur la page.

1. Cloudflare, Grant Bourzikas, « Build your own vulnerability harness », 2026-06-18 (modifié le 2026-07-15), `https://blog.cloudflare.com/build-your-own-vulnerability-harness`. Harnais de 8 étapes, 20 799 candidats bruts, 7 245 constats actionnables sur 145 dépôts, aucun taux de faux négatifs, aucun coût en jetons. Source du fabricant.
2. Cloudflare, Grant Bourzikas, « Project Glasswing: what Mythos showed us », 2026-05-18 (modifié le 2026-07-22), `https://blog.cloudflare.com/cyber-frontier-models/`. Un agent indépendant relit le code et tente de réfuter chaque constat ; les harnais sont réglés pour sur-signaler ; aucun taux de faux positifs donné. Source du fabricant.
3. Cloudflare, Blake Darché, « Introducing context-aware vulnerability discovery and remediation with Cloudflare Managed Defense and OpenAI Daybreak Models », 2026-09-03, `https://blog.cloudflare.com/vulnerability-discovery-remediation/`. Service commercial sur invitation, fondé sur le harnais ; aucun résultat mesuré, seul un exemple chiffré d'introduction. Source du fabricant.
4. InfoQ, Matt Foster, « Cloudflare Uses an AI Harness to Probe and Harden its WAF », 2026-10-07, `https://infoq.com/news/2026/10/cloudflare-sec-harness`. 45 scénarios, 1 107 tentatives, 49 constats retenus après tri humain ; ni faux positifs, ni coût, ni évaluation indépendante.
5. Dahiya, Nehra, Dholariya, Shangari et Khatri, « Are Frontier LLMs Ready for Cybersecurity? », arXiv 2605.23243, v1 du 2026-05-22 (v5 du 2026-06-26), `https://arxiv.org/abs/2605.23243`. Entre 10 % et 50 % de faux positifs pour chacun des 6 modèles de pointe testés en détection boîte blanche au niveau fonction.
6. Xiong et Zhang, « Sifting the Noise: A Comparative Study of LLM Agents in Vulnerability False Positive Filtering », arXiv 2601.22952, v1 du 2026-01-30 (v3 du 2026-07-23), `https://arxiv.org/abs/2601.22952`. Un filtrage agressif peut supprimer de vraies failles ; les agents surpassent le prompt simple avec des modèles forts seulement.
7. Pilot, « Étude d'opportunité : un conseil de cinq agents séparés avant un arbitrage humain », 2026-10-20, `P/output/03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md`. Sur 4 décisions, le conseil rejoint le choix humain 2 fois, comme la requête unique, pour 4,7 à 5 fois plus de jetons (lignes 92, 115).

Une huitième source, Simecek, Čadek et Buran, « Silent Failures in LLM Vulnerability Detection: The Expensive Model Trap », atelier ICML 2026 (`https://icml.cc/virtual/2026/78010`), n'est pas comptée : la page n'indique pas de date. Elle rapporte qu'un passage sans constat est peu fiable, car un même modèle trouve une faille à un essai et la manque au suivant. C'est l'argument pour 2 passages dans l'essai.

Ce que fixe cet état de l'art : les chiffres sur l'efficacité viennent tous du fabricant ou de bancs d'essai qui ne jouent pas ce skill. Aucun ne permet de dire que le skill trouve ce que websec manque. Le point utile est ailleurs : Cloudflare sépare le modèle de découverte du modèle de triage, et l'étude du pilot a mesuré que des agents d'une même famille se trompent ensemble (lignes 42 et 77).

## 3 bis. Ce qui se réutilise sans installer l'outil

Licence : MIT, « Copyright (c) 2025-2026 Cloudflare, Inc. » (`T/LICENSE:1-3`). Elle autorise d'utiliser, copier, modifier et redistribuer, à une condition : garder l'avis de droit d'auteur et le texte de la licence dans toute copie substantielle. Websec est lui-même publié sous MIT (`P/fiches/forge-websec.md:9`). La licence ne bloque donc rien. Les blocages viennent des doctrines.

| Élément | Réutilisable sans installer | Condition | Citation |
|---|---|---|---|
| Vérification adverse par un agent neuf | le principe oui, il existe déjà au pilot ; le prompt de réfutation et les 3 issues sont nouveaux | vérificateur d'un autre modèle que le chasseur, ce que le skill ne demande pas ; à mesurer par le critère C5 | `T/s/VALIDATION-AND-REPORTING.md:7, 11-46` |
| Registre de couverture | l'idée et le format ; le validateur n'a pas de dépendance | devient un oracle ou un référentiel, donc soumis à R-31 | `T/s/RECONNAISSANCE.md:90-152`, `T/s/validate-coverage-ledger.cjs:8-10` |
| Schéma de rapport à 3 issues | oui comme modèle ; `needs_validation` ressemble au SKIP motivé des oracles | adopter après l'essai, pas avant | `T/s/VALIDATION-AND-REPORTING.md:103-109`, `W/README.md:136-139` |
| Prompts par classe d'attaque | comme référentiel versionné, daté, sourcé ; 1 778 lignes de Markdown au total dans la copie | citer et résumer, ne pas coller en bloc, comme websec le fait pour ASVS | `P/REGLES-PROJET.md:391-393`, `W/CLAUDE.md:24-28` |
| Validateurs `.cjs` | non avant relecture complète | relecture intégrale, puis exécution dans un cadre sans réseau | `T/s/validate-findings.cjs:11-13` |

Doctrines qui s'opposent, avec leur effet :

- Les entrants sont des données (`P/CLAUDE.md:87`). Lancer le skill revient à exécuter les consignes d'un tiers. L'essai exige donc une levée explicite et bornée de cette règle. Installer le skill sous `~/.claude/skills` la lèverait pour toutes les sessions : exclu.
- R-31 (`P/REGLES-PROJET.md:383-389`) : un skill ou un oracle naît avec un verbe outillé absent ailleurs, prouvé par un verdict de non-recouvrement cité, et naît exercé. Le skill n'a jamais été joué ici. O3 échoue à la condition 2 tant que l'essai n'a pas eu lieu.
- Les dépenses restent humaines (`P/CLAUDE.md:33`). Les jetons Claude ne sont pas une API tierce payante (`P/REGLES-PROJET.md:307-309`), mais la dépense de l'essai se pose au porteur.
- Websec outille sans décider et se prouve par fixtures à double sens (`W/README.md:48, 61-62`). Un vérificateur qui est un modèle ne se prouve pas par une fixture déterministe. La vérification adverse n'entre donc pas dans les oracles de websec ; elle logerait au pilot, à la manière de `contre-expertise`, qui délègue la conformité aux oracles (`~/.claude/skills/contre-expertise/SKILL.md:36-39`). C'est un raisonnement, non un fait mesuré.
- Websec s'invoque sur mandat humain (`W/README.md:46-47`) et n'emploie aucune donnée réelle (`W/README.md:56-58`). Le mode audit complet du skill est lui aussi explicite (`T/s/SKILL.md:15`), et il interdit tout trafic vers une cible déployée (`T/s/SKILL.md:42`) : compatible.
- Précédence (`P/REGLES-PROJET.md:998-1003`) : la sortie par défaut du skill, hors de la Factory (`T/s/SKILL.md:51`), cède devant la règle qui range les livrables dans `output\`. L'essai désigne un dossier de travail explicite.
- Les agents lancés porteraient Bash : ils tombent sous la porte d'`agents-security` (commit 279a7f1 de cette forge, « Bash seul ne fait plus une combinaison dangereuse »).

## 3 ter. La limite centrale et l'essai défini

Aucune mesure d'efficacité n'existe ici. Le skill n'a pas été joué. Je ne l'affirme ni meilleur ni pire que les oracles de websec, ni qu'une requête unique. Le verdict appelle donc une mesure.

Cible. Un dépôt git local neuf de 800 à 1 200 lignes, écrit par une session distincte de celle qui joue et qui n'a pas lu le skill. Aucune donnée réelle, aucun secret, aucun réseau. Il porte 12 failles semées et 2 leurres. La liste est scellée dans un premier commit dont l'identifiant est noté avant le premier passage. La cible est neuve plutôt qu'un dépôt volontairement vulnérable connu : ces derniers sont publics et leurs solutions ont pu entrer dans l'entraînement des modèles.

| Id | Faille semée | Classe | Vue des oracles websec |
|---|---|---|---|
| P1 | `_headers` sans CSP ni HSTS | en-têtes | oui, EX-1 et EX-3 via `oracle-exposition-statique` |
| P2 | verrou npm avec lodash 4.17.15 | dépendances | oui, `oracle-sca` (sens rouge déjà prouvé sur cette version, `P/fiches/forge-websec.md:16-17`) |
| P3 | workflow `pull_request_target` avec extraction de la tête de la requête | CI | oui, WF-3 |
| P4 | titre d'issue substitué dans un `run:` | CI | oui, WF-4 |
| Q1 | lecture d'une note d'un autre utilisateur par son identifiant | contrôle d'accès | non |
| Q2 | requête SQL concaténée sur un paramètre libre | injection | non |
| Q3 | traversée de chemin dans le téléchargement | fichiers | non |
| Q4 | SSRF par l'URL d'un webhook | fichiers et réseau | non |
| Q5 | jeton signé accepté sans vérification de la signature | authentification | non |
| Q6 | double utilisation d'un bon de réduction par requêtes concurrentes | logique métier | non |
| Q7 | export incluant des enregistrements supprimés d'un autre locataire | isolation des données | non |
| Q8 | jeton de réinitialisation sans expiration | récupération de compte | non |
| L1 | leurre : SQL concaténé à partir d'une liste blanche constante | sûr | sans objet |
| L2 | leurre : cookie d'interface sans HttpOnly, lu par le script par conception | sûr selon le skill, `T/s/ATTACK-CLASSES.md:130` | EX-9 le relèverait, `W/README.md:86` |

Trois bras, sur la même cible et le même modèle de base.

- Bras A : les oracles de websec applicables (`oracle-exposition-statique`, `oracle-sca`, `oracle-workflows`). Coût en jetons : nul.
- Bras B : une requête unique à un agent, mêmes sources, rapport de longueur égale à celui du bras C à 20 % près. L'étude du pilot du 2026-10-20 a montré qu'à longueur inégale, la longueur fausse la mesure (lignes 100, 131).
- Bras C : le skill en profil `quick`, budget de 30 invocations, 2 passages indépendants. Le passage 1 emploie un même modèle pour chasser et vérifier, comme le skill le prévoit. Le passage 2 fait vérifier par un modèle d'une autre taille, pour isoler l'effet des erreurs corrélées.

Mode d'exécution. Le bac à sable n'étant pas prouvé sur ce poste, le premier essai se joue en lecture de source seule. Un enregistrement `confirmed` exige un résultat local observé (`T/s/HUNTING.md:145-149`) : il tombera donc en `needs_validation`. Un résultat positif est alors une borne basse du rappel du skill.

Critères, fixés avant le jeu. « Retrouvée » désigne un enregistrement `confirmed` ou `needs_validation` dont une entrée de trace cite le fichier semé et une ligne de la fonction semée.

| Critère | Seuil | Mesure |
|---|---|---|
| C1, rappel hors périmètre de websec | le bras C retrouve au moins 5 des 8 failles Q, à l'union des 2 passages | trace de `findings.json` contre la liste scellée |
| C2, contrôle du tableau de recouvrement | le bras A retrouve au plus 1 des 8 failles Q ; sinon la section 2 est fausse et se corrige | sorties JSON des oracles |
| C3, apport face à la requête unique | le bras C retrouve au moins 2 failles Q de plus que le bras B | même compte, même liste |
| C4, précision | au plus 20 % des enregistrements retenus sans correspondance ni faille réelle établie en revue ; aucun leurre en `confirmed`, au plus 1 en `needs_validation` | revue des enregistrements sans correspondance par une session distincte du joueur ; les cas litigieux vous sont posés |
| C5, vérification adverse | sur les candidats proposés par les chasseurs, le vérificateur écarte ou rétrograde au moins 50 % de ceux sans faille semée, et garde 100 % de ceux qui en ont une ; jugé si les chasseurs proposent au moins 4 candidats sans correspondance | candidats avant et après vérification, par passage |
| C6, coût | au plus 1 500 000 jetons par passage et 150 000 pour le bras B, mesurés aux transcripts de session | somme des jetons des agents |

Règle de décision, fixée avant le jeu :

- C1, C3, C4, C5 et C6 tenus : une étude d'adoption s'ouvre, qui traite R-31 et la place du skill.
- C5 tenu, C1 ou C3 non tenu : seule l'étape de vérification se réutilise, au pilot, sans le reste du skill.
- C5 non tenu : la vérification adverse est écartée.
- C6 non tenu : le skill est écarté pour coût.

Estimation du coût en jetons. Le pilot a mesuré environ 30 000 jetons de contexte fixe par agent (`20261020-etude-opportunite-conseil-avant-arbitrage.md:103`). Pour 30 invocations, l'ordre de grandeur est de 1 000 000 de jetons par passage. C'est un calcul à partir de la mesure du pilot, non une mesure du skill. Le plafond de 1 500 000 laisse une marge, et le plafond total de 3 150 000 jetons couvre 2 passages et le bras B.

Qui le joue. Une session pilote sous mandat, jamais le rédacteur de cette étude. Les agents du skill tournent sur Sonnet, le défaut de routage (`P/CLAUDE.md:77-78`), sauf le vérificateur du passage 2. Le notateur est un script qui compare les traces à la liste scellée ; il est écrit et relu avant le premier passage.

Ce que vous devez autoriser :

1. La dépense : au plus 3 150 000 jetons Claude, le détail en C6 (`P/CLAUDE.md:33`).
2. La levée de `P/CLAUDE.md:87` pour la seule cible semée : la session joueuse suit les consignes de la copie tierce sur cette cible, rien ailleurs, rien d'installé.
3. L'exécution des deux validateurs `.cjs` après relecture intégrale de leurs 1 645 lignes, dans un cadre sans réseau.
4. Le mode lecture de source seule, faute de bac à sable prouvé.
5. L'appel réseau habituel d'`oracle-sca` vers la base d'avis npm, pour le bras A.

Limites de l'essai. Une seule cible, écrite par un modèle : les failles semées peuvent être plus faciles à trouver que des failles réelles. Un seul modèle de base. Le profil `quick` fusionne les phases 3 et 5 (`T/s/VALIDATION-AND-REPORTING.md:124`), donc le skill n'est pas joué au complet. Un signal de ce type ne prouve pas un rappel sur un dépôt réel.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : réfutée. Le coût du statu quo est un angle mort écrit par websec lui-même : 33 des 37 exigences ASVS L1 curées sont en « manuel », 4 chapitres WSTG ne sont pas curés dont l'autorisation et la logique métier (`W/referentiels/wstg-cas.md:119-120`), et la forge « ne remplace ni un audit de sécurité humain, ni un test d'intrusion » (`W/README.md:276-278`). Un produit déclaré prêt peut donc passer les oracles de websec sans qu'aucun ait regardé un contrôle d'accès. Ce coût est déclaré, non mesuré : aucune perte réelle n'est chiffrée.
- **O1 — essai borné sur cible semée** : la section 3 ter. Coût : complexité moyen · durée moyen ; jusqu'à 3 150 000 jetons ; aucune dette, rien ne s'installe. Exclut toute adoption avant les résultats.
- **O2 — réutiliser les idées sans l'outil, tout de suite** : écrire au pilot une étape de vérification par un agent neuf d'un autre modèle, un format de registre de couverture et un schéma de rapport, dans les mots de la Factory. Coût : moyen × moyen. Exclut la chasse par classes d'attaque. Risque : bâtir sur une idée dont l'apport n'est pas mesuré.
- **O3 — adopter le skill** : en faire un verbe de websec ou un skill du pilot, installé, avec sa vérification adverse. Coût : complexe × long. Exclut l'essai préalable. Il échoue à la condition 2 de R-31 : il ne naît pas exercé.
- **O4 — écarter et inscrire écarté** : sur la foi des chiffres du fabricant seuls, qui sont invérifiables. Coût : simple × court. Exclut toute réponse à la question posée. Le sujet reviendra, le dépôt ayant 56 764 étoiles.

## 5. Verdict

- **Option retenue** : O1, l'essai borné sur une cible semée de 12 failles et 2 leurres, 2 passages du skill.
- **Coût** : complexité moyen · durée moyen ; jusqu'à 3 150 000 jetons Claude ; aucune dette, rien ne s'installe ni ne s'écrit dans une forge.
- **Candidature(s) émise(s)** : proposées, non inscrites ; la session pilote les inscrira. K1, jouer l'essai O1, soumis à votre autorisation de dépense. K2, étude d'adoption de la vérification adverse au pilot, seulement si C5 est tenu. K3, curer les classes d'attaque du skill en référentiel pour viser les lignes « manuel » d'`asvs-l1.md`, seulement si C1 est tenu.
- **Plan de revue** : 2026-11-30, ou au retour de l'essai s'il revient avant. Ce jour-là, les 6 critères sont confrontés aux mesures et la règle de décision s'applique ; faute d'essai joué, le verdict est rouvert.
- **Test rétro** :
  - Opérationnel : une cible semée scellée, 3 bras, 2 passages, 6 critères chiffrés, un notateur écrit avant le jeu.
  - Tactique : séparer l'apport des agents multiples de celui de la longueur, et la fiabilité de la vérification de celle du chasseur, par le bras B et par le passage 2.
  - Stratégie : ne créer aucun objet durable sans preuve exécutée (`P/REGLES-PROJET.md:383-389`) et ne laisser aucun chiffre de fabricant décider.
  - Intention : savoir sur des faits si le skill ajoute des constats à websec et si sa réfutation mérite une place.
  - Question « trouve-t-il ce que les oracles ratent ? » : non mesuré ; les classes visées ne sont pas jugées par websec (section 2), l'essai C1 et C3 le mesure.
  - Question « sa vérification adverse doit-elle y entrer ? » : pas dans les oracles de websec ; au pilot si C5 est tenu.

## Limites de cette étude

Ce que je n'ai pas pu vérifier :

- La vidéo n'a pas été vue par le rédacteur de cette étude. Ses chiffres arrivent par la consigne ; la session pilote l'a transcrite en local, et la transcription les confirme.
- Les billets de Cloudflare de mai et de septembre 2026, la page InfoQ et les 2 articles arXiv ont été lus par un outil qui résume. Seuls le billet de juin et le nombre d'étoiles ont été relus en HTML brut.
- Le rapprochement entre les 12 057 constats validés et les 13 841 du pool central du billet de juin n'est pas expliqué par le billet.
- L'origine du « 20 000 étoiles » de la vidéo : le 20 799 du billet est une hypothèse, non un constat.
- Le modèle du validateur du harnais interne n'est pas précisé par le billet de juin ; il dit seulement que le triage tourne sur un autre modèle que la découverte.
- Le skill n'a pas été joué : aucun rappel, aucune précision, aucun coût en jetons mesurés. La copie n'expose qu'un seul commit, du 2026-09-14, trois mois après le billet ; elle n'est pas l'état publié en juin.
- Les deux validateurs ont été lus par recherche de motifs seulement.
- Docker et WSL sont présents sur le poste, mais leur aptitude à imposer le bac à sable du skill n'est pas mesurée. Le README de websec dit que ZAP a tourné par Docker (`W/README.md:258-266`) ; son `CLAUDE.md` dit qu'il n'est installé sur aucun poste (`W/CLAUDE.md:33-35`). Je n'ai pas tranché.
- Le contenu du registre de dette de `forge-tests` n'a pas été lu.
