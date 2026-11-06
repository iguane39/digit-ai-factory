---
type: etude
role: étude sur la question du porteur du 06/11/2026 (pourquoi les réglages de sécurité standard ne sont pas appliqués par défaut, et comment les appliquer dans toute la chaîne), entre la question et la décision de doctrine D-178
destinataire: humain
date: 2026-11-06
gabarit: aucun, plan imposé par le prompt du 06/11/2026 (sections 0 à 6 et annexe des recherches)
emetteur: session pilote Claude Opus 5.5, sur le prompt du Produit-84 du 06/11/2026 (indice d, passé au crible L99)
hypotheses_non_resolues:
  - le critère C3 (fonctionnement) est mesuré sur un seul produit de référence, le Produit-84 ; un produit qui migre par connexion directe depuis un exécuteur de GitHub casserait sous la restriction réseau
  - la page Supabase du TLS imposé annonce deux durées de coupure (« a few seconds » sur un petit projet, « a few minutes of downtime ») ; le classement défaut tient parce que la coupure tombe à la création
  - la disponibilité de la restriction réseau selon l'offre n'est écrite nulle part ; l'API rend un champ entitlement à lire avant d'appliquer
---

# Étude — Sécurité par défaut de bout en bout — 20261106a

Ce qui change pour vous : la Factory connaît les réglages de sécurité standard de Supabase, GitHub et Cloudflare, et sait les vérifier après coup, mais aucune de ses forges ne les applique à la création d'un projet. Sur les 8 réglages mesurés et les 7 étapes de la chaîne, 0 case sur 56 porte un fichier qui écrit le réglage (DÉCOMPTÉ). Dans l'audit du cas témoin, 7 écarts sur 30 sont une option gratuite laissée à sa valeur d'origine (DÉCOMPTÉ).

Résumé de décision :

1. Cause principale : la connaissance vit dans les forges qui contrôlent (déploiement, audit) ; les forges qui créent (cadrage, conception, implémentation) n'ont ni la liste des réglages ni de quoi les écrire.
2. Ce que la chaîne peut appliquer d'office : 5 réglages sur 9 passent les 5 critères (TLS imposé et restriction des adresses de Supabase, alertes Dependabot, HTTPS imposé et HSTS de Cloudflare) ; 4 restent des décisions du produit (double vérification des membres Supabase, protection des secrets à la poussée en dépôt privé, protection de la branche principale, restauration à la minute).
3. Mécanisme proposé : un registre JSON des réglages, lu à chaque étape ; 9 retours candidats ouverts, TF-2225 à TF-2233.
4. Décision posée au porteur : D-178, adopter le principe en loi transverse, l'essayer sur un seul produit, ou ne rien changer. Recommandation : l'essayer d'abord sur le prochain produit créé.

Vocabulaire du document. Les 8 réglages de la liste fermée portent un code de ligne : R1 (Supabase, TLS imposé), R2 (Supabase, restriction des adresses), R3 (Supabase, double vérification des membres), R4 (GitHub, protection des secrets à la poussée), R5 (GitHub, alertes Dependabot), R6 (GitHub, protection de la branche principale), R7 (Cloudflare, HTTPS imposé), R8 (Cloudflare, en-tête HSTS). Les hypothèses de cause portent H1 à H6 (section 1). Les critères d'admission par défaut portent C1 à C5 (C1 source, C2 coût, C3 fonctionnement, C4 réversibilité, C5 vérifiabilité). Les écarts de l'audit gardent leur identifiant EC-HPR-n. Chaque chiffre porte sa nature : MESURÉ (lu par une commande), DÉCOMPTÉ (compté sur une liste), ESTIMÉ.

## 0. Étape 0 — prérequis

L'étape 0 établit sur quel état la mesure repose : les 13 forges sont présentes, toutes lues sur leur HEAD local, et 4 dépôts portaient déjà des modifications qui ne sont pas celles de cette session.

Heure du relevé : 06/11/2026, de 11:05:55 à 11:30:06 (+01:00), lue par `date`.

Présence. `ls -d <racine>/digit-ai-*` rend les 13 forges attendues (agents, agents-security, audit, conception, data, design, development, observability, ops, organization, seo-geo, tests, websec) et le pilot : aucune forge non couverte (DÉCOMPTÉ : 13 sur 13).

Fraîcheur. Le hook d'ouverture de session a joué de lui-même `node bootstrap.mjs --pull` à 11:05 (relevé asynchrone, fini après les premiers gestes de la session) : ce tirage n'est pas un geste de cette session, il est déclaré ici. La session a ensuite joué `node bootstrap.mjs` sans `--pull` à 11:10 : sortie 1, « Poste NON prêt — 2 défaut(s) » (40 modifications locales non enregistrées au pilot, dont une de plus de 48 h ; oracle du canal confidentiel en échec, hébergeur injoignable), et « [ok] skills installés = skills versionnés » : aucun écart de skills à déclarer. Deux avertissements disent que les skills de forge-agents et de forge-design ne sont pas propagés (commits locaux non publiés).

`git fetch` puis comparaison de HEAD à origin, dépôt par dépôt (MESURÉ, 11:12) :

| Dépôt | HEAD | origin | État | Référence de lecture |
|---|---|---|---|---|
| digit-ai-factory (pilot) | 67035127 | d7fafd09 | en avance de 9 (écart déclaré) | HEAD |
| digit-ai-forge-agents | afcbffc | 053ea4a | en avance de 5 (écart déclaré) | HEAD |
| digit-ai-forge-agents-security | 4b5a5fa | cee8ba9 | en avance de 1 (écart déclaré) | HEAD |
| digit-ai-forge-audit | b03baaf | b03baaf | à jour | HEAD |
| digit-ai-forge-conception | f8737ac | f8737ac | à jour | HEAD |
| digit-ai-forge-data | 3b8cd39 | 3b8cd39 | à jour | HEAD |
| digit-ai-forge-design | 9ab20d3 | eb12152 | en avance de 2 (écart déclaré) | HEAD |
| digit-ai-forge-development | 93c7372 | 93c7372 | à jour | HEAD |
| digit-ai-forge-observability | 9527914 | 9527914 | à jour | HEAD |
| digit-ai-forge-ops | b58dae5 | e5b1fdb | en avance de 2 (écart déclaré) | HEAD |
| digit-ai-forge-organization | 5960051 | 5960051 | à jour | HEAD |
| digit-ai-forge-seo-geo | 2e74296 | 2e74296 | à jour | HEAD |
| digit-ai-forge-tests | f924b20 | e9824ba | en avance de 4 (écart déclaré) | HEAD |
| digit-ai-forge-websec | dcb46d9 | dcb46d9 | à jour | HEAD |

Aucun dépôt n'est seulement en retard : toutes les recherches se font sur HEAD, par `git grep -IilE '<motif>' HEAD`. 4 dépôts ont un status non vide (pilot, design, observability, tests) : le second passage `git grep -IilE --untracked '<motif>'` y a été joué. Différences entre les deux passages (DÉCOMPTÉ) : 1 fichier du pilot sous input/ (R3, exclu de la matrice) et 10 fichiers non suivis sous output/ de forge-tests (R3 : cahiers et tableaux de tests de deux autres produits, noms non recopiés ici car le pilot est public), classés bruit. Aucune autre différence pour les 8 réglages au premier passage (11:21 à 11:23). Au rejeu par étape de 11:44, todo/TODO.jsonl diffère aussi pour R1, R2 et R7 : ce sont les retours TF-2225 à TF-2233 écrits par cette session à 11:38 (section 5), qui ne comptent pas dans la matrice.

Instantané de départ, pris à 11:10:39 après le tirage du hook. Le tableau donne, par dépôt, le nombre de lignes de `git status --porcelain`, l'empreinte de ces lignes, l'empreinte de `git diff HEAD` et l'empreinte de la liste « empreinte chemin » des fichiers non suivis ; chaque empreinte est faite des 16 premiers caractères hexadécimaux du sha256. Le détail fichier par fichier est en annexe B.

| Dépôt | Lignes de status | Empreinte du status | Empreinte de git diff HEAD | Non suivis | Empreinte des non suivis |
|---|---|---|---|---|---|
| digit-ai-factory | 40 | `2055640f0d6c61b4` | `0e9ce62335f57f76` | 29 | `74565894fe810ddf` |
| digit-ai-forge-agents | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-agents-security | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-audit | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-conception | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-data | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-design | 4 | `44066b8c8b11973e` | `8d755d8931722c1e` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-development | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-observability | 1 | `7c0e5cfd5bc2e673` | `e3b0c44298fc1c14` | 1 | `6b9cd47b53a937ce` |
| digit-ai-forge-ops | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-organization | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-seo-geo | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |
| digit-ai-forge-tests | 1 | `055124e8bfb630ca` | `e3b0c44298fc1c14` | 81 | `701e2cf038b529b4` |
| digit-ai-forge-websec | 0 | `e3b0c44298fc1c14` | `e3b0c44298fc1c14` | 0 | `e3b0c44298fc1c14` |

Accès au cas témoin : le fichier d'audit est lisible (147 lignes, 49 334 octets, MESURÉ) ; source citée : audit des écarts de la qualification du Produit-84, 30/10/2026.

État des trois verbes pour le cas témoin (R1 et R2), remesuré à 11:21 par `git grep -IilE` sur chaque dépôt : CONNAÎTRE dans experts-forge (corpus-ops-supabase.md, lignes 50 et 54) ; CONTRÔLER par forge-audit (CTL-D02-14, profiles/supabase/bindings.json:75) et par le plan O5 de forge-ops (scripts/ops.mjs:499-500) ; APPLIQUER nulle part. Le point de départ du 06/11/2026 est confirmé à l'identique.

## 1. Pourquoi

La cause tient en une phrase : les réglages sont connus et contrôlés en aval, jamais écrits en amont, et rien dans la chaîne ne transforme un contrôle en geste de création. Quatre hypothèses sur six sont confirmées.

### 1.1 Réfutations attendues

Écrite à : 2026-11-06 11:26:38 +0100 (commande date), avant les mesures des hypothèses H2 à H6.
| H | Hypothèse de cause | Commande qui la réfuterait | Résultat qui la réfuterait |
|---|---|---|---|
| H1 | La connaissance vit dans les forges qui contrôlent (audit, déploiement, corpus), pas dans celles qui créent (cadrage, implémentation). | git grep -IilE '<motif du réglage>' HEAD dans digit-ai-forge-conception, digit-ai-forge-design, digit-ai-forge-development et gabarits/ du pilot, pour R1 et R2 | au moins un fichier de ces dépôts écrit R1 ou R2 (verbe APPLIQUÉ) |
| H2 | Aucun principe « sûr par défaut » n'existe dans les références du pilot. | git grep -IinE 's[ûu]re? par d[ée]faut\|secure.by.default\|s[ée]curit[ée] par d[ée]faut\|par d[ée]faut.{0,40}s[ée]curis' HEAD -- references CLAUDE.md AGENTS.md REGLES-PROJET.md ETAPE-MEP.md | une ligne qui pose ce principe comme règle de la chaîne |
| H3 | L'inventaire du 28/10/2026 recense des fonctionnalités, pas des décisions de réglage. | node -e (clés des lignes du .json de l'inventaire) | une clé qui porte une valeur attendue, un défaut à appliquer ou un classement défaut/décision |
| H4 | La phase de préparation interdit les gestes distants et repousse les réglages. | git grep -nE 'ssl-enforcement\|network-restrictions\|vulnerability-alerts\|always_use_https\|rulesets\|protection' HEAD -- oracles/hook-gestes-distants.mjs, puis lecture de sa règle sur les verbes PUT/POST/PATCH | le hook laisse passer un PUT ou un POST de réglage sans geste humain |
| H5 | Le cadrage n'a pas de case pour un réglage de plateforme : les exigences ne portent que le produit, jamais la configuration du compte qui l'héberge. | git grep -IinE 'TLS\|chiffrement en transit\|restriction r[ée]seau\|plateforme\|h[ée]bergeur' HEAD -- .claude/skills/redige-les-exigences .claude/skills/derive-les-vues (forge-conception) | une rubrique ou un champ d'exigence dédié aux réglages de la plateforme |
| H6 | Faute de grille coût/fonctionnement, les écarts décidés par le porteur ont mêlé options gratuites et payantes : une option gratuite a été écartée avec les payantes. | grep -nE 'Décision du porteur' <AUDIT>, puis classement de chaque écart cité par C2 | aucun écart décidé par le porteur ne porte sur une option gratuite |
Déclaration d'ordre : les recherches de la matrice (B) ont été jouées de 11:21 à 11:23, avant cette section ; la réfutation de H1 réutilise ces sorties, son ordre n'est donc pas tenu. Pour H2 à H6, les commandes sont jouées après cette heure.

### 1.2 Mesures et verdicts

Les mesures confirment 4 hypothèses et en réfutent 2 : rien n'interdit d'appliquer ces réglages, ni le hook des gestes distants (sauf pour la branche protégée), ni l'absence d'une case au cadrage ; ils ne sont simplement écrits nulle part en amont. Mode d'emploi : une ligne par hypothèse, avec la commande jouée après 11:26:38, son résultat et le verdict.

| H | Commande jouée | Résultat | Verdict |
|---|---|---|---|
| H1 | Recherches de la matrice (annexe A, cases A-01, A-03, A-08, A-10 pour R1 et R2 au cadrage et à l'implémentation ; A-02 et A-09 à la conception) | Sorties vides au cadrage et à l'implémentation ; à la conception, 1 fichier CONNU (corpus-ops-supabase.md). Sur les 56 cases, 0 porte APPLIQUÉ, et tous les CONTRÔLÉ sauf un sont au déploiement ou à l'audit (DÉCOMPTÉ) | confirmée |
| H2 | `git grep -IinE 's[ûu]re? par d[ée]faut\|secure.by.default\|s[ée]curit[ée] par d[ée]faut\|par d[ée]faut.{0,40}s[ée]curis' HEAD -- references CLAUDE.md AGENTS.md REGLES-PROJET.md ETAPE-MEP.md` | 1 ligne, references/INTEGRATIONS-FOURNISSEURS.md:230, qui décrit les contraintes de base de Google Cloud, pas une règle de la chaîne | confirmée |
| H3 | `node -e` sur le JSON de l'inventaire du 28/10/2026 : clés des lignes | 793 lignes, 15 clés : famille, fonctionnalite, parent, description, url, lu_le, statut, remplacant, niveau_propose, motif, forges_candidates, usage, couvert_le_16_10, couvert_par, manque. Aucune clé de valeur attendue ni de classement défaut ou décision (MESURÉ) | confirmée |
| H4 | `git grep -nE 'ssl-enforcement\|network-restrictions\|vulnerability-alerts\|always_use_https\|rulesets\|PUT\|PATCH\|POST' HEAD -- oracles/hook-gestes-distants.mjs` ; puis `git grep -IinE` d'une règle « préparation » liée aux gestes distants dans le pilot, forge-development et forge-ops | La liste fermée du hook couvre suppressions, destruction d'état, droits, DELETE et réécriture d'histoire ; elle dit « les déploiements ordinaires (`terraform apply`, …) ne sont pas concernés ». Un PUT ou POST de réglage Supabase ou Cloudflare passe sans lot. Seules les écritures sur `/branches/…/protection` et `/rulesets` sont classées « droits » (ligne 285) et exigent un lot approuvé. Aucune règle de phase de préparation trouvée (sortie vide) | réfutée, sauf pour R6 |
| H5 | `git grep -IinE 'TLS\|chiffrement en transit\|restriction r[ée]seau\|plateforme\|h[ée]bergeur' HEAD -- skills/redige-les-exigences skills/derive-les-vues` (forge-conception) | La case existe : redige-les-exigences porte un patron de plateformes (Workers, Supabase, Actions) en 7 sections (responsabilités, variables d'environnement, prévisualisations, Hyperdrive, déploiement, questions, hypothèses). Aucune ne nomme un réglage de sécurité : la cause se reporte sur H1 | réfutée |
| H6 | `grep -nE 'Décision du porteur' <AUDIT>`, puis classement de chaque écart cité par le critère C2 | 6 écarts motivés par une décision du porteur : EC-HPR-04 (branche protégée, gratuite en offre team), EC-HPR-06 (Secret Protection, payante), EC-HPR-11 (double vérification Supabase, gratuite en offre pro), EC-HPR-12 (deux propriétaires, pas une option), EC-HPR-13 (double vérification Cloudflare, gratuite), EC-HPR-26 (nom de domaine). Une même entrée du journal de décisions du produit (n° 38) écarte ensemble Secret Protection, payante, et la double vérification, gratuite | confirmée |

Constat de passage, hors hypothèses : le plan O5 de forge-ops prescrit `supabase db push`, qui ouvre une connexion directe à Postgres. Les exécuteurs hébergés de GitHub publient 5 622 plages IPv4 (`GET https://api.github.com/meta`, clé actions, MESURÉ à 11:17) : cette voie, jouée depuis la chaîne, est incompatible avec la restriction des adresses. Le Produit-84 y échappe parce qu'il migre par l'API de gestion. Le retour TF-2230 le porte.

## 2. Étendue

La réponse à la question 2 est oui : le défaut vaut pour toutes les compétences et toutes les étapes. Aucun des 8 réglages n'est appliqué à aucune des 7 étapes ; le contrôle se concentre au déploiement et à l'audit, et 5 réglages sur 8 (R3, R4, R5, R7, R8) ne sont même pas connus des forges qui créent (cadrage, conception, implémentation).

### 2.1 Matrice des 8 réglages sur les 7 étapes

Mode d'emploi : une ligne par réglage et par étape ; chaque case donne le fichier et la ligne qui justifient le verbe, avec l'extrait, ou « absent ». CONNU : une référence ou un corpus décrit le réglage ; CONTRÔLÉ : un oracle, un test ou une commande de lecture le compare à un attendu ; APPLIQUÉ : un gabarit, un script ou un plan l'écrit. Un fichier compte dans l'étape du dossier qui le porte (table du prompt, appliquée sans écart). Chaque « absent » a sa commande et sa sortie en annexe A. Mesuré sur : les 14 dépôts à leur HEAD, relus de 11:21 à 11:23 et rejoués par étape à 11:44, périmètre 8 motifs × 7 étapes, 56 cases.

Bilan (DÉCOMPTÉ sur la matrice) : 56 cases ; CONNU dans 17, CONTRÔLÉ dans 9, APPLIQUÉ dans 0 ; 39 cases entièrement absentes.

| Réglage | Étape | CONNU | CONTRÔLÉ | APPLIQUÉ |
|---|---|---|---|---|
| R1 Supabase, TLS imposé | cadrage | absent | absent | absent |
| R1 Supabase, TLS imposé | conception | digit-ai-forge-agents/.claude/skills/experts-forge/references/corpus-ops-supabase.md:54 — `supabase ssl-enforcement update --project-ref <ref> --enable-db-ssl-enforcement` | absent | absent |
| R1 Supabase, TLS imposé | implémentation | absent | absent | absent |
| R1 Supabase, TLS imposé | tests | absent | absent | absent |
| R1 Supabase, TLS imposé | déploiement | digit-ai-forge-ops/scripts/ops.mjs:499 — plan O5 : « supabase ssl-enforcement get … # attendu « SSL is being enforced. » » | digit-ai-forge-ops/scripts/ops.mjs:499 — même ligne : lecture comparée à l'attendu « SSL is being enforced. » | absent |
| R1 Supabase, TLS imposé | audit | digit-ai-forge-audit/profiles/supabase/README.md:77 — « S7 — https://supabase.com/docs/guides/platform/ssl-enforcement » | digit-ai-forge-audit/profiles/supabase/bindings.json:75 — CTL-D02-14 : « verification_command » … « supabase ssl-enforcement get --project-ref <ref> --experimental » | absent |
| R1 Supabase, TLS imposé | correction | absent | absent | absent |
| R2 Supabase, restriction des adresses | cadrage | absent | absent | absent |
| R2 Supabase, restriction des adresses | conception | digit-ai-forge-agents/.claude/skills/experts-forge/references/corpus-ops-supabase.md:50 — `supabase network-restrictions get\|update --project-ref <ref> --db-allow-cidr <cidr>` | absent | absent |
| R2 Supabase, restriction des adresses | implémentation | absent | absent | absent |
| R2 Supabase, restriction des adresses | tests | absent | absent | absent |
| R2 Supabase, restriction des adresses | déploiement | digit-ai-forge-ops/scripts/ops.mjs:500 — plan O5 : « supabase network-restrictions get … # 0.0.0.0/0 + ::/0 = aucune restriction » | digit-ai-forge-ops/scripts/ops.mjs:500 — même ligne : lecture comparée à l'état ouvert 0.0.0.0/0 + ::/0 | absent |
| R2 Supabase, restriction des adresses | audit | digit-ai-forge-audit/profiles/supabase/README.md:76 — « S6 — https://supabase.com/docs/guides/platform/network-restrictions » | digit-ai-forge-audit/profiles/supabase/bindings.json:75 — CTL-D02-14 : « supabase network-restrictions get --project-ref <ref> --experimental », sortie archivée | absent |
| R2 Supabase, restriction des adresses | correction | absent | absent | absent |
| R3 Supabase, double vérification des membres | cadrage | absent | absent | absent |
| R3 Supabase, double vérification des membres | conception | absent | absent | absent |
| R3 Supabase, double vérification des membres | implémentation | absent | absent | absent |
| R3 Supabase, double vérification des membres | tests | absent | absent | absent |
| R3 Supabase, double vérification des membres | déploiement | absent | absent | absent |
| R3 Supabase, double vérification des membres | audit | digit-ai-forge-audit/core/dimensions/doctrine.yaml:674 — « réf. interne — MFA activé par design partout où c'est possible » | absent | absent |
| R3 Supabase, double vérification des membres | correction | absent | absent | absent |
| R4 GitHub, protection des secrets à la poussée | cadrage | absent | absent | absent |
| R4 GitHub, protection des secrets à la poussée | conception | absent | absent | absent |
| R4 GitHub, protection des secrets à la poussée | implémentation | absent | absent | absent |
| R4 GitHub, protection des secrets à la poussée | tests | absent | absent | absent |
| R4 GitHub, protection des secrets à la poussée | déploiement | absent | absent | absent |
| R4 GitHub, protection des secrets à la poussée | audit | digit-ai-forge-audit/core/adr/05-delivery/ADR0505-cicd-scans-integres.md:75 — « `profil:github` → code scanning, secret scanning avec push protection » | digit-ai-forge-audit/profiles/github/README.md:24 — « CTL-D03-02 \| Secret scanning et push protection actifs, 0 alerte ouverte » | absent |
| R4 GitHub, protection des secrets à la poussée | correction | digit-ai-factory/todo/TODO.jsonl:5330 — TF-2004 « aucun profil GitHub — … secret scanning et push protection » | absent | absent |
| R5 GitHub, alertes Dependabot | cadrage | absent | absent | absent |
| R5 GitHub, alertes Dependabot | conception | absent | absent | absent |
| R5 GitHub, alertes Dependabot | implémentation | absent | absent | absent |
| R5 GitHub, alertes Dependabot | tests | absent | absent | absent |
| R5 GitHub, alertes Dependabot | déploiement | absent | absent | absent |
| R5 GitHub, alertes Dependabot | audit | digit-ai-forge-audit/core/dimensions/doctrine.yaml:488 — « Politique de mise à jour (automatisée via Dependabot/Renovate ou manuelle) » | digit-ai-forge-audit/profiles/github/README.md:25 — « CTL-D02-03 \| Alertes Dependabot actives, plan daté pour chaque alerte critique ou haute » | absent |
| R5 GitHub, alertes Dependabot | correction | digit-ai-factory/todo/TODO.jsonl:5330 — TF-2004 « … Dependabot, SECURITY.md, code scanning » | absent | absent |
| R6 GitHub, protection de la branche principale | cadrage | absent | absent | absent |
| R6 GitHub, protection de la branche principale | conception | absent | absent | absent |
| R6 GitHub, protection de la branche principale | implémentation | digit-ai-forge-development/docs/architecture.md:191 — « HITL 2 … `supervisor.py` + branch protection » | digit-ai-forge-development/digit-ai-forge-development/conductor/harness/branch_protection.py:53 — `GhBranchProtectionReader` : lecture gh api, `enforce_admins` absent signalé comme contournement | absent |
| R6 GitHub, protection de la branche principale | tests | absent | absent | absent |
| R6 GitHub, protection de la branche principale | déploiement | digit-ai-forge-ops/references/WORKFLOW-DEPLOIEMENT.md:73 — « `deployment_branch_policy` : … `protected_branches` » | absent | absent |
| R6 GitHub, protection de la branche principale | audit | digit-ai-forge-audit/core/adr/05-delivery/ADR0505-cicd-scans-integres.md:76 — « rendus bloquants par les règles de ruleset de la branche par défaut » | digit-ai-forge-audit/profiles/github/README.md:23 — « CTL-D09-06 \| Branche par défaut protégée par ruleset ou règle de branche, revue exigée » | absent |
| R6 GitHub, protection de la branche principale | correction | digit-ai-factory/todo/TODO.jsonl:5330 — TF-2004 « règles de branche et rulesets » | absent | absent |
| R7 Cloudflare, HTTPS imposé | cadrage | absent | absent | absent |
| R7 Cloudflare, HTTPS imposé | conception | absent | absent | absent |
| R7 Cloudflare, HTTPS imposé | implémentation | absent | absent | absent |
| R7 Cloudflare, HTTPS imposé | tests | absent | absent | absent |
| R7 Cloudflare, HTTPS imposé | déploiement | absent | absent | absent |
| R7 Cloudflare, HTTPS imposé | audit | absent | absent | absent |
| R7 Cloudflare, HTTPS imposé | correction | absent | absent | absent |
| R8 Cloudflare, en-tête HSTS | cadrage | absent | absent | absent |
| R8 Cloudflare, en-tête HSTS | conception | absent | absent | absent |
| R8 Cloudflare, en-tête HSTS | implémentation | absent | absent | absent |
| R8 Cloudflare, en-tête HSTS | tests | absent | absent | absent |
| R8 Cloudflare, en-tête HSTS | déploiement | absent | absent | absent |
| R8 Cloudflare, en-tête HSTS | audit | digit-ai-forge-audit/core/adr/03-network/ADR0303-chiffrement-en-transit-systematique.md:77 — « jusqu'à l'origine et HSTS sur la zone » | digit-ai-forge-websec/oracles/oracle-exposition.mjs:62 — « EX-3 · Strict-Transport-Security (HTTPS uniquement) » ; aussi forge-audit profiles/cloudflare/README.md:27 (CTL-D02-06) | absent |
| R8 Cloudflare, en-tête HSTS | correction | digit-ai-factory/todo/TODO.jsonl:5322 — TF-1996 « aucun profil Cloudflare — mode SSL/TLS, HSTS » | absent | absent |

Hors matrice, transverses du pilot (references/, oracles/, scripts/, decisions/, racine, et profils/, catalogues/, fiches/, rangés ici faute d'étape) :

| Fichier | Réglage | Verbe | Extrait ou motif |
|---|---|---|---|
| oracles/hook-gestes-distants.mjs:285 | R6 | CONNU (et garde avant APPLIQUÉ) | écriture sur `/branches/[^\s/]+/protection` ou `/rulesets` classée « droits » : lot approuvé exigé |
| catalogues/catalogue.jsonl:68 | R8 | CONNU | entrée « Juger l'exposition runtime » de forge-websec, qui juge HSTS |
| fiches/forge-websec.md:11 | R8 | CONNU | « oracle-exposition.mjs (11 règles EX-1..EX-11 : CSP non triviale, HSTS » |
| oracles/oracle-synthese.mjs:3812 | R5 | bruit | reconnaît le mot « dependabot » dans une restitution, ne lit aucun réglage |
| ETAPE-MEP.md:312, references/ETAPES-RUN.md:257, oracles/oracle-trace-mutation-mep.mjs:64, scripts/verifier-exigences-fatales.mjs:46 (et son test) | R3 | bruit | fournisseur d'identité central avec MFA pour les utilisateurs de l'application (M-18, CTL-D03-01), pas les membres de l'organisation Supabase |
| oracles/oracle-synthese.mjs:3383 | R3 | bruit | motif de geste humain (« s'authentifier ») |
| profils/api-headless.md:8 | R6 | bruit | « ruleset » de Spectral, linter OpenAPI |

Hors matrice, autres forges et reste de forge-agents :

| Fichier | Réglage | Verbe | Extrait ou motif |
|---|---|---|---|
| digit-ai-forge-agents/run-admission/contre-epreuve-ops-cloudflare.md:19 | R7, R8 | CONNU | « Redirections : « Always Use HTTPS », `www` vers apex » ; en-têtes de `public/_headers` |
| digit-ai-forge-agents/.claude/skills/quality-oracles/references/registre-oracles.json:2231 | R8 | CONNU | « les en-têtes posés au niveau de la zone (HSTS de zone, règles de transformation) : invisibles depuis le fichier » |
| digit-ai-forge-agents/.claude/skills/quality-oracles/references/registre-oracles.md:364 | R6 | bruit | « ruleset axe complet » (accessibilité) |
| digit-ai-forge-agents/.claude/skills/digit-ai-schemas/assets/exemple-reference.html:1612 | R3 | bruit | exemple de schéma, accès conditionnel Entra |
| digit-ai-forge-seo-geo/referentiel/cloudflare.json:126, scripts/oracle_redirections.py:447, scripts/test_oracle_redirections.py:296 | R6 | bruit | ruleset de redirection de Cloudflare, autre réglage |
| digit-ai-forge-data, digit-ai-forge-observability, digit-ai-forge-organization, digit-ai-forge-agents-security | tous | — | 0 fichier pour les 8 motifs (DÉCOMPTÉ) |

Exclus de la matrice, output/ et input/ du pilot (DÉCOMPTÉ, par réglage) : R1 2, R2 2, R3 12, R4 4, R5 6, R6 8, R7 0, R8 8 fichiers, dont l'inventaire du 28/10/2026 qui CONNAÎT R1 à R8 sauf R7.

Le registre des retours porte 3 lignes anciennes qui contiennent un nom réel de client ou de produit : TF-2043, TF-2076 et TF-2136. Elles ne sont pas de cette session ; elles sont signalées sans être modifiées ni citées.

### 2.2 Décompte de l'audit du cas témoin

Le décompte retient un écart quand il est dû à une option standard laissée à sa valeur d'origine : une option documentée par l'éditeur, réglable sans dépense, dont la valeur d'origine est la moins sûre. DÉCOMPTÉ : 7 écarts sur 30, EC-HPR-04, EC-HPR-08, EC-HPR-11, EC-HPR-13, EC-HPR-14, EC-HPR-17, EC-HPR-18.

Mode d'emploi : le tableau suit l'ordre de traitement de l'audit, une ligne par écart, 30 lignes. La colonne Objet résume l'écart ; la colonne Décompte vaut « entre » quand l'écart compte, « sort » sinon ; la colonne Raison dit quel élément de la définition le fait entrer ou sortir (option de l'éditeur, coût, valeur d'origine).

| Écart | Objet | Décompte | Raison |
|---|---|---|---|
| EC-HPR-01 | test d'intrusion | sort | geste de test, pas une option |
| EC-HPR-02 | dossier de sécurité | sort | livrable documentaire |
| EC-HPR-03 | classement des données | sort | décision humaine extérieure |
| EC-HPR-04 | branche protégée | entre | ruleset GitHub, gratuit en offre team, aucune règle à l'origine ; écarté par décision du porteur, la valeur reste celle d'origine |
| EC-HPR-05 | CODEOWNERS | sort | fichier à écrire, pas une option de plateforme |
| EC-HPR-06 | Secret Protection | sort | achat requis en dépôt privé (C2) |
| EC-HPR-07 | inventaire des composants | sort | manifeste à écrire |
| EC-HPR-08 | alertes Dependabot | entre | gratuit sur toutes les offres, désactivé à l'origine en dépôt privé |
| EC-HPR-09 | analyses dans la chaîne | sort | étape de workflow à écrire |
| EC-HPR-10 | matrice ASVS | sort | livrable de conception |
| EC-HPR-11 | double vérification Supabase | entre | option d'organisation, incluse dans l'offre pro de Client-A, désactivée à l'origine |
| EC-HPR-12 | deux propriétaires GitHub | sort | nomination de personnes, pas une option |
| EC-HPR-13 | double vérification Cloudflare | entre | `enforce_twofactor`, gratuit, faux à l'origine |
| EC-HPR-14 | jetons Cloudflare sans échéance | entre | échéance optionnelle à la création, sans dépense, absente par défaut ; la condition d'adresse reste une limite de plateforme |
| EC-HPR-15 | tableau « qui fait quoi » | sort | organisation |
| EC-HPR-16 | revue trimestrielle | sort | rituel |
| EC-HPR-17 | restriction réseau | entre | ouverte à 0.0.0.0/0 et ::/0 à l'origine, réglable sans dépense |
| EC-HPR-18 | TLS imposé | entre | database=false à l'origine, réglable sans dépense |
| EC-HPR-19 | restauration à la minute | sort | extension payante, 100 dollars par mois pour 7 jours |
| EC-HPR-20 | copie hebdomadaire hors plateforme | sort | tâche à écrire |
| EC-HPR-21 | restauration rejouée | sort | essai à jouer |
| EC-HPR-22 | contrôles planifiés | sort | workflow à écrire |
| EC-HPR-23 | envoi des journaux | sort | extension payante |
| EC-HPR-24 | notifications | sort | étape de workflow |
| EC-HPR-25 | connexion SAML | sort | changement d'architecture, facturé par utilisateur SSO au-delà du quota |
| EC-HPR-26 | domaine et HSTS mesuré | sort | geste DNS chez un tiers ; HSTS déjà posé par le fichier du produit |
| EC-HPR-27 | nom du compte Cloudflare | sort | pas un réglage de sécurité |
| EC-HPR-28 | écriture du workflow | sort | valeur écrite dans un fichier du produit, pas l'origine de la plateforme |
| EC-HPR-29 | Code Security | sort | achat requis en dépôt privé |
| EC-HPR-30 | procédure de retrait | sort | livrable documentaire |

Sur les 7 écarts retenus, 5 portent sur un réglage de la liste fermée (R1, R2, R3, R5, R6) ; EC-HPR-13 et EC-HPR-14 portent sur Cloudflare (double vérification du compte, échéance des jetons), hors liste : ils montrent que la liste fermée n'épuise pas le sujet.

## 3. Mécanisme

Le mécanisme proposé est un registre de réglages lu par chaque étape : la création écrit les réglages classés défaut, la livraison les relit, et un réglage classé décision devient une option posée au cadrage. Il n'est pas implémenté ici.

### 3.1 Le registre

Le registre est joint au même radical, au format JSON : `Digit-AI - Étude - Securite par defaut de bout en bout - 20261106a.json`. Une entrée par réglage, avec exactement les clés plateforme, reglage, source_url, source_lue_le, criteres (c1 à c5, chacun verdict et preuve), cmd_appliquer, cmd_lire, attendu, cmd_retour, classement. Les secrets y sont écrits `$NOM_DE_VARIABLE`. Les pages des éditeurs ont été lues le 06/11/2026 à 11:17 en texte brut (`curl`), et chaque citation « mot pour mot » a été retrouvée dans ce texte par le script de contrôle.

Mode d'emploi du tableau : une ligne par entrée ; la colonne « échoue » nomme le critère qui empêche le défaut.

| Plateforme | Réglage | Classement | Échoue | Preuve décisive |
|---|---|---|---|---|
| Supabase | TLS imposé (R1) | defaut | — | « On small projects this usually completes in a few seconds » ; aucune connexion en clair dans le Produit-84 |
| Supabase | restriction des adresses (R2) | defaut | — | migrations par l'API de gestion en HTTPS, que la restriction ne couvre pas ; aucune connexion directe |
| Supabase | double vérification des membres (R3) | decision | C2, C4, C5 | offre Pro minimum ; aucune route d'API pour poser ni lire l'obligation |
| GitHub | protection des secrets à la poussée, dépôt privé (R4) | decision | C2 | « Requires GitHub Secret Protection to be enabled » |
| GitHub | alertes Dependabot (R5) | defaut | — | « available for you to use, regardless of the GitHub plan you are on » |
| GitHub | protection de la branche principale (R6) | decision | C3 | la promotion du Produit-84 se fait par poussée directe sur env/uat |
| Cloudflare | HTTPS imposé (R7) | defaut | — | disponible en offre Free ; aucun flux en http |
| Cloudflare | HSTS de zone (R8) | defaut | — | disponible en offre Free ; le Produit-84 sert déjà max-age=31536000 |
| Supabase | restauration à la minute (entrée de contrôle) | decision | C2 | « $100 per month per 7 days retention » |

Jeu d'essai, attendus fixés d'avance par le prompt, comparés aux verdicts observés : TLS imposé, attendu defaut, observé defaut (C2 tenu, C3 tenu sur la citation et sur l'absence de connexion en clair) ; restriction réseau, attendu defaut sous condition, observé defaut (migrations par `POST …/database/query` en HTTPS, `scripts/migrer.mjs:31` de `<PRODUIT>`, aucun exécuteur en direct) ; restauration à la minute, attendu decision, observé decision (C2) ; protection à la poussée en dépôt privé, attendu decision, observé decision (C2). 4 sur 4 conformes (DÉCOMPTÉ).

Contrôle du contrat 5, par un script jetable écrit hors des dépôts (`controle-registre.mjs`, empreinte sha256 `eb4133c36e57afd7`, 16 premiers caractères), qui vérifie les clés, les verdicts, la règle « defaut seulement si c1 à c5 sont tenus » et chaque citation mot pour mot contre le texte brut des pages :

```text
node controle-registre.mjs "output/03-etudes/Digit-AI - Étude - Securite par defaut de bout en bout - 20261106a.json" <pages>
{ "entrees": 9, "defaut": 5, "decision": 4, "citations_verifiees": 25, "defauts": [], "verdict": "PASS" }
```

Contre-épreuve du script : une copie altérée (une citation changée d'un mot, une entrée decision passée en defaut) rend FAIL avec les 2 défauts nommés.

### 3.2 Les points d'injection

Chaque étape lit le registre ; la colonne de gauche dit ce qu'elle fait d'un réglage classé defaut, celle de droite d'un réglage classé decision.

| Étape | Branche défaut | Branche décision | Forge qui porte | Retour |
|---|---|---|---|---|
| cadrage | une exigence vérifiable par réglage, attendu = cmd_lire | une question de conception avec ses options et son coût | forge-conception (redige-les-exigences) | TF-2226 |
| conception | le corpus classe le réglage et cite le registre | le choix du porteur est consigné avec son motif | forge-agents (experts-forge) | TF-2227 |
| implémentation | le script de création joue cmd_appliquer puis cmd_lire | rien n'est écrit sans le choix consigné | forge-development | TF-2228 |
| tests | la campagne compare cmd_lire à l'attendu, reliée à l'exigence | l'écart accepté est vérifié tel que décidé | forge-tests | TF-2229 |
| déploiement | oracle bloquant avant la MEP, rubrique du dossier de MEP | écart accepté listé au dossier | forge-ops, pilot (ETAPE-MEP) | TF-2230, TF-2233 |
| audit | contrôle du réglage | contrôle de l'écart accepté écrit, pas d'écart nu | forge-audit | TF-2231 |
| correction | un écart sur un réglage défaut rouvre un retour vers la forge qui crée | un écart sur un réglage décision renvoie à sa décision | pilot (todo, contrat de campagne) | TF-2232 |

Le registre lui-même devient une référence datée du pilot, avec son oracle (TF-2225).

## 4. Cas témoin

Le cas témoin traverse la chaîne par la branche défaut, puisque le TLS imposé et la restriction des adresses sont tous deux classés defaut. À chaque étape, la ligne dit ce qui se passe et quel écart de l'audit aurait été évité.

| Étape | TLS imposé (R1, EC-HPR-18) | Restriction des adresses (R2, EC-HPR-17) |
|---|---|---|
| cadrage | exigence « la base refuse toute connexion sans TLS », attendu `currentConfig.database = true` | exigence « seules les plages déclarées atteignent Postgres », avec la condition « migrations par l'API de gestion » ; le produit déclare au moins une plage, car une liste vide laisse tout passer |
| conception | le corpus ops-supabase classe R1 en défaut ; aucune question au porteur | le corpus classe R2 en défaut et nomme la voie de migration ; le Produit-84 la remplit déjà (`scripts/migrer.mjs`) |
| implémentation | le script de création joue `PUT …/ssl-enforcement {database: true}` à la création, quand le redémarrage ne coupe aucun usage | le script joue `POST …/network-restrictions/apply` avec les plages déclarées ; la configuration de l'infrastructure ne règle plus « que l'authentification » |
| tests | la campagne lit `GET …/ssl-enforcement` : PASS si `true` | la campagne lit `GET …/network-restrictions` : PASS si les plages sont celles déclarées et `status = applied` |
| déploiement | l'oracle de forge-ops relit le réglage avant la MEP ; le dossier de MEP porte l'état lu | même lecture ; un `supabase db push` depuis un exécuteur de GitHub est refusé par la règle du plan O5 |
| audit | CTL-D02-14 relit le réglage et le trouve conforme : EC-HPR-18 n'existe pas | CTL-D02-14 relit les plages : EC-HPR-17 n'existe pas |
| correction | si l'audit trouvait `false`, l'écart rouvrirait un retour vers forge-development, pas seulement une correction chez le produit | idem pour une restriction trouvée ouverte |

Un réglage classé decision, comme la branche protégée (R6, EC-HPR-04), prendrait l'autre colonne du tableau 3.2 : option posée au cadrage, choix du porteur consigné (ici, la décision du 29/10/2026 de ne pas protéger les branches), puis contrôle de l'écart accepté à l'audit au lieu d'un écart nu.

## 5. Retours ouverts

Neuf pièces à construire sont ouvertes au registre, au statut candidat, chacune avec sa forge destinataire. Écrivain : `node todo/journaliser.mjs --fichier <evenements.json>`, joué d'abord avec `--essai` puis sans, à 11:38 ; oracle du registre PASS avant et après l'écriture (MESURÉ). Le fichier d'événements a été posé hors des dépôts.

| Identifiant | Forge | Pièce |
|---|---|---|
| TF-2225 | digit-ai-factory | registre des réglages sûrs par défaut, référence datée, et son oracle de schéma |
| TF-2226 | digit-ai-forge-conception | section « réglages de sécurité de la plateforme » du patron de plateformes |
| TF-2227 | digit-ai-forge-agents | corpus d'experts-forge classés défaut ou décision, MFA d'organisation et HTTPS imposé compris |
| TF-2228 | digit-ai-forge-development | script de création qui applique les réglages défaut, migrations par l'API de gestion |
| TF-2229 | digit-ai-forge-tests | lecture des réglages exigés en campagne, reliée à l'exigence |
| TF-2230 | digit-ai-forge-ops | contrôle bloquant des réglages dans oracle-ops, voie db push déclarée incompatible |
| TF-2231 | digit-ai-forge-audit | contrôles de l'écart accepté, d'Always Use HTTPS et de la MFA des membres d'organisation |
| TF-2232 | digit-ai-factory | un écart d'audit sur un réglage défaut rouvre un retour vers la forge qui crée |
| TF-2233 | digit-ai-factory | rubrique des réglages de plateforme dans ETAPE-MEP et le dossier de MEP |

Ces retours ne se construisent qu'après la décision D-178, par un run de version.

## 6. Décision de doctrine

La décision porte sur une doctrine, elle relève donc du porteur. Elle a été réservée par `node scripts/reserver-decision.mjs` à 11:30 et inscrite à decisions/REGISTRE.jsonl sous le numéro D-178.

> **D-178 — Faut-il adopter comme loi transverse le principe « réglage admissible appliqué à la création, vérifié à chaque livraison, exception décidée », l'essayer d'abord sur un seul produit, ou ne rien changer ?**

| Option | Effet | Coût de construction | Risque |
|---|---|---|---|
| (a) loi transverse | les 9 retours se construisent pour toute la chaîne ; tout produit créé ensuite reçoit les 5 réglages défaut | complexité moyen, durée moyen | le critère de fonctionnement n'est mesuré que sur le Produit-84 : un produit qui migre par connexion directe casserait sous la restriction réseau |
| (b) essai sur un seul produit | TF-2225, TF-2226 et TF-2228 se construisent d'abord, appliqués au prochain produit créé ; passage en loi si sa première MEP lit les 5 réglages conformes sans flux cassé | complexité faible, durée faible | les produits déjà en service gardent leurs écarts jusqu'à la généralisation |
| (c) ne rien changer | l'audit continue de trouver ces écarts après coup | aucun | 7 écarts sur 30 du cas témoin se reproduisent à chaque produit |

Recommandation : (b). Les 5 réglages défaut ont passé leurs critères sur un seul produit, et la mesure a déjà trouvé une voie de la Factory (le `db push` du plan O5) que le défaut casserait ; un essai sur le prochain produit créé mesure ce risque avant d'en faire une loi, pour un coût faible.

## 7. Contrôles et écarts déclarés

Le contrat de sortie se vérifie ici, item par item, avec la commande jouée.

Mode d'emploi : le premier tableau suit les 10 items du contrat de sortie, une ligne par item ; la colonne Preuve donne la commande jouée ou la section qui le montre, la colonne Verdict dit « tenu » ou nomme l'écart. Le second tableau liste, fichier par fichier, ce qui a changé au pilot depuis l'instantané de départ et qui l'a écrit. Un écart est dit, jamais lissé.

| Item | Preuve | Verdict |
|---|---|---|
| 1. Étape 0 écrite | section 0 : commandes, heures (11:05:55 à 11:30:06), référence de lecture des 14 dépôts, instantané résumé et détaillé (annexe B) | tenu |
| 2. Réfutations avant mesures | section 1.1 datée 11:26:38 par `date` ; mesures de H2 à H6 jouées après ; H1 réutilise les recherches de la matrice jouées de 11:21 à 11:23, ordre non tenu pour H1 seule, déclaré | tenu, avec un écart déclaré |
| 3. Matrice complète | 8 réglages × 7 étapes = 56 cases, 3 valeurs chacune ; 56 blocs en annexe A, un par case qui porte au moins un « absent » | tenu |
| 4. Décompte de l'audit | 7 écarts sur 30, liste et raison des 30 en section 2.2 | tenu |
| 5. Registre | `node controle-registre.mjs <registre> <pages>` : 9 entrées, 5 defaut, 4 decision, 25 citations retrouvées, 0 défaut, PASS ; contre-épreuve FAIL sur copie altérée | tenu |
| 6. Cas témoin | section 4 : TLS imposé et restriction des adresses sur les 7 étapes, branche défaut | tenu |
| 7. Retours au registre | TF-2225 à TF-2233, 9 lignes `creation` dans todo/TODO.jsonl ; `node todo/oracle-todo.mjs` : exit 0, verdict PASS | tenu |
| 8. Décision réservée | D-178 inscrite à decisions/REGISTRE.jsonl par reserver-decision.mjs à 11:30 ; `--verifier` : plus grand numéro 178, 0 doublon ; options (a), (b), (c) en section 6 | tenu |
| 9. Instantané de fin | voir ci-dessous : 12 forges sur 13 identiques ; forge-design diffère par un commit d'une autre session | écart déclaré, non imputable |
| 10. Noms réels et jetons | voir ci-dessous : 0 fichier, 0 ligne | tenu |

Instantané de fin, pris à 11:46:13 par le même script qu'à l'étape 0 (MESURÉ) :

- 12 forges identiques sur les 5 valeurs (lignes de status, empreinte du status, empreinte de `git diff HEAD`, nombre et empreinte des non suivis).
- digit-ai-forge-design : 4 lignes de status au départ, 0 à la fin. Son journal porte le commit `f6daff1` de 11:30:21, « Le rendu statique ne juge plus la page recouverte par la bulle de la visite guidée (TF-2199) » : une autre session a enregistré les modifications qu'elle y avait en cours. Cette session n'a joué dans forge-design que des lectures (`git grep`, `git fetch`, `git status`).
- Toutes les forges : `git fetch` de l'étape 0 a mis à jour leurs références distantes (`refs/remotes/origin/*`), ce que ni le status ni le diff ne voient.

Au pilot, fichiers changés depuis l'instantané de départ, avec leur écrivain :

| Fichier | Écrivain |
|---|---|
| output/03-etudes/Digit-AI - Étude - Securite par defaut de bout en bout - 20261106a.md | cette session (copie du brouillon jugé) |
| output/03-etudes/Digit-AI - Étude - Securite par defaut de bout en bout - 20261106a.json | cette session (outil Write) |
| todo/TODO.jsonl | cette session pour TF-2225 à TF-2233 (journaliser.mjs), et TF-2235, constat en passant sur l'outil de relecture d'intention ; une autre session pour 3 lignes : maj de TF-2184 et TF-2186, création de TF-2234 |
| decisions/REGISTRE.jsonl | cette session pour D-178 (reserver-decision.mjs) |
| gabarits/documents/catalogue.jsonl | non identifié, hors de cette session : écrit à 11:29:13, ligne gd-rapport-audit ; aucune commande de la session n'écrit ce fichier |

Les README de output/ ne changent pas : `node scripts/readme-dossiers.mjs --racines output` rend « 2 fichier(s) présent(s) sur ce poste et NON suivi(s) par git, écarté(s) des index publiés (TF-0914) » ; l'étude entrera dans l'index à son enregistrement. Le défaut de README de input/ (un rôle non rédigé sous input/Tiktok) précède la session.

Contrat 10. Fichier de motifs jetable hors des dépôts, `<motifs.txt>`, 11 lignes, sha256 `2c1523a27a23e91220b8c7fee44a3b416c6799138b066e04fe50adb4992bf238` :

```text
grep -ilEf <motifs.txt> <étude .md> <registre .json> <evenements.json>
(sortie vide, exit 1)
git diff -U0 -- todo/TODO.jsonl decisions/REGISTRE.jsonl | grep '^+' | grep -iEf <motifs.txt>
(sortie vide, exit 1 ; 14 lignes ajoutées lues, dont 11 de cette session : D-178, TF-2225 à TF-2233 et TF-2235)
```

Les 3 lignes anciennes du registre des retours qui portent un nom réel sont TF-2043, TF-2076 et TF-2136 (section 2.1).

Oracles du protocole de tests, sur le fichier final :

- `python check_markdown.py <étude>` (skill digit-ai-page-html) : PASS sur M7, M10, M14 et M18 ; 1 avertissement M14, les mentions du fichier todo/TODO.jsonl, légitimes.
- `node oracles/oracle-ecriture.mjs <étude>` : PASS ; 2 avertissements, EC-2 (phrases de plus de 35 mots, non consécutives) et EC-5 (trois attaques sur « absent » dans la matrice).
- `node controle-registre.mjs <registre> <pages>` : PASS (item 5).
- `node todo/oracle-todo.mjs` : PASS (item 7).

Boucle bornée : passe 1, `check_markdown.py` FAIL (M7 sur 1.2, M10 sur 2.2) et `oracle-ecriture.mjs` FAIL (EC-2, 7 phrases longues consécutives dans l'annexe A ; EC-9, 4 valeurs en lettres, dont 2 dans des noms de fichiers) ; corrections chirurgicales sur copie (ouverture de 1.2, mode d'emploi de 2.2, motifs d'écart raccourcis, chiffres, annexe B en blocs de code) ; passe 2 au vert.

## Annexe A — Recherches « absent »

Chaque bloc donne, pour un réglage et une étape, les commandes `git grep -IilE` jouées à 11:44 sur HEAD et leur sortie : vide, ou la liste des fichiers trouvés, chacun écarté avec son motif ou retenu pour un autre verbe de la même case. Les verbes absents de la case sont dans le titre du bloc. `<racine>` désigne le dossier qui porte les dépôts.

**A-01 — R1 Supabase, TLS imposé, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-02 — R1 Supabase, TLS imposé, conception** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.claude/skills/experts-forge'
```

Sortie : 2 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-agents/.claude/skills/experts-forge/references/corpus-ops-supabase.md.

- digit-ai-forge-agents/.claude/skills/experts-forge/fixtures/fixture-ops-supabase.md (écarté : fixture de test, au mieux CONNU)

**A-03 — R1 Supabase, TLS imposé, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-04 — R1 Supabase, TLS imposé, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.'
```

Sortie : vide.

**A-05 — R1 Supabase, TLS imposé, déploiement** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.'
```

Sortie : 5 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-ops/scripts/ops.mjs.

- digit-ai-forge-ops/fixtures/o5-supabase/plan-rouge-avant-tf2007.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-ops/fixtures/o5-supabase/plan-rouge-rollback-vide.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-ops/fixtures/o5-supabase/plan-rouge-sans-cli.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-ops/fixtures/o5-supabase/plan-vert.json (écarté : fixture de test, au mieux CONNU)

**A-06 — R1 Supabase, TLS imposé, audit** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- '.'
```

Sortie : 3 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/profiles/supabase/README.md, digit-ai-forge-audit/profiles/supabase/bindings.json.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)

**A-07 — R1 Supabase, TLS imposé, correction** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE 'ssl-enforcement|ssl_enforcement|enforce.?ssl|sslmode' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-08 — R2 Supabase, restriction des adresses, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-09 — R2 Supabase, restriction des adresses, conception** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.claude/skills/experts-forge'
```

Sortie : 2 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-agents/.claude/skills/experts-forge/references/corpus-ops-supabase.md.

- digit-ai-forge-agents/.claude/skills/experts-forge/fixtures/fixture-ops-supabase.md (écarté : fixture de test, au mieux CONNU)

**A-10 — R2 Supabase, restriction des adresses, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-11 — R2 Supabase, restriction des adresses, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.'
```

Sortie : vide.

**A-12 — R2 Supabase, restriction des adresses, déploiement** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.'
```

Sortie : 5 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-ops/scripts/ops.mjs.

- digit-ai-forge-ops/fixtures/o5-supabase/plan-rouge-avant-tf2007.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-ops/fixtures/o5-supabase/plan-rouge-rollback-vide.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-ops/fixtures/o5-supabase/plan-rouge-sans-cli.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-ops/fixtures/o5-supabase/plan-vert.json (écarté : fixture de test, au mieux CONNU)

**A-13 — R2 Supabase, restriction des adresses, audit** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- '.'
```

Sortie : 3 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/profiles/supabase/README.md, digit-ai-forge-audit/profiles/supabase/bindings.json.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)

**A-14 — R2 Supabase, restriction des adresses, correction** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE 'network-restrictions|network_restrictions|db-allow-cidr|dbAllowedCidrs' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-15 — R3 Supabase, double vérification des membres, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-16 — R3 Supabase, double vérification des membres, conception** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.claude/skills/experts-forge'
```

Sortie : 1 fichier(s).

- digit-ai-forge-agents/.claude/skills/experts-forge/references/corpus-migration-plateforme-brownfield.md (écarté : R3 : reconnexion des utilisateurs (SSO, MFA), pas la double vérification des membres de la plateforme)

**A-17 — R3 Supabase, double vérification des membres, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 1 fichier(s).

- digit-ai-forge-development/docs/spike-S2-S3.md (écarté : R3 : MFA d'une brique d'authentification applicative (Authlib, WorkOS))

**A-18 — R3 Supabase, double vérification des membres, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.'
```

Sortie : 3 fichier(s).

- digit-ai-forge-tests/README.md (écarté : R3 : session fournie pour une instance derrière un IdP d'entreprise à MFA (accès du testeur), pas un réglage de la plateforme)
- digit-ai-forge-tests/forge_tests/adaptateurs/qualif.py (écarté : R3 : session fournie pour une instance derrière un IdP d'entreprise à MFA (accès du testeur), pas un réglage de la plateforme)
- digit-ai-forge-tests/tests/test_tf_0222_session_fournie.py (écarté : R3 : session fournie pour une instance derrière un IdP d'entreprise à MFA (accès du testeur), pas un réglage de la plateforme)

**A-19 — R3 Supabase, double vérification des membres, déploiement** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.'
```

Sortie : vide.

**A-20 — R3 Supabase, double vérification des membres, audit** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- '.'
```

Sortie : 18 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/core/dimensions/doctrine.yaml.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)
- digit-ai-forge-audit/core/adr-en/02-identity-sec/ADR0202-authentification-idp-central-mfa.md (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/adr/02-identity-sec/ADR0202-authentification-idp-central-mfa.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/core/controls-en/D03.json (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/controls/D03.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/core/controls/controls-core-v1.en.json (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/controls/controls-core-v1.json (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/deliverables/templates/fiche-securite.template.en.md (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/deliverables/templates/fiche-securite.template.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/deliverables/templates/manifeste-preuves.example.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/docs/CORRESPONDANCE-ASVS-4.0.x-5.0.0.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/docs/MAPPING-CONTROLES-ASVS.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/azure/bindings.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/supabase/README.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/supabase/bindings.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/tests/fixtures/pack-fixture.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/referentiels/classes-attaque.md (écarté : classe d’attaque, connaissance générique (R3 : MFA applicative))

**A-21 — R3 Supabase, double vérification des membres, correction** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE '\bmfa\b|multi-factor|two-factor|\b2fa\b' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 2 fichier(s).

- digit-ai-factory/todo/TODO-ARCHIVE.jsonl (écarté : registre de retours, au mieux CONNU ; TF-2006 vise la MFA applicative, TF-0886 la lecture de protection de forge-development)
- digit-ai-factory/todo/TODO.jsonl (écarté : registre de retours, au mieux CONNU ; TF-2006 vise la MFA applicative, TF-0886 la lecture de protection de forge-development)

**A-22 — R4 GitHub, protection des secrets à la poussée, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-23 — R4 GitHub, protection des secrets à la poussée, conception** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.claude/skills/experts-forge'
```

Sortie : vide.

**A-24 — R4 GitHub, protection des secrets à la poussée, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-25 — R4 GitHub, protection des secrets à la poussée, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.'
```

Sortie : vide.

**A-26 — R4 GitHub, protection des secrets à la poussée, déploiement** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.'
```

Sortie : vide.

**A-27 — R4 GitHub, protection des secrets à la poussée, audit** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- '.'
```

Sortie : 6 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/core/adr/05-delivery/ADR0505-cicd-scans-integres.md, digit-ai-forge-audit/profiles/github/README.md.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)
- digit-ai-forge-audit/core/adr-en/05-delivery/ADR0505-cicd-scans-integres.md (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/profiles/azure/bindings.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/github/bindings.json (écarté : même fichier que la ligne retenue, ou autre verbe déjà retenu)

**A-28 — R4 GitHub, protection des secrets à la poussée, correction** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE 'push.?protection|secret.?scanning|secret_scanning' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 1 fichier(s). Retenus pour un autre verbe de la case : digit-ai-factory/todo/TODO.jsonl.

**A-29 — R5 GitHub, alertes Dependabot, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-30 — R5 GitHub, alertes Dependabot, conception** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.claude/skills/experts-forge'
```

Sortie : vide.

**A-31 — R5 GitHub, alertes Dependabot, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-32 — R5 GitHub, alertes Dependabot, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.'
```

Sortie : vide.

**A-33 — R5 GitHub, alertes Dependabot, déploiement** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.'
```

Sortie : vide.

**A-34 — R5 GitHub, alertes Dependabot, audit** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- '.'
```

Sortie : 6 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/core/dimensions/doctrine.yaml, digit-ai-forge-audit/profiles/github/README.md.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)
- digit-ai-forge-audit/profiles/azure/bindings.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/github/bindings.json (écarté : même fichier que la ligne retenue, ou autre verbe déjà retenu)
- digit-ai-forge-websec/oracles/oracle-workflows.mjs (écarté : R5 : ligne des limites de l'oracle (« … Dependabot, la protection des branches … » non couverts))

**A-35 — R5 GitHub, alertes Dependabot, correction** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE 'dependabot|vulnerability.?alerts' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 1 fichier(s). Retenus pour un autre verbe de la case : digit-ai-factory/todo/TODO.jsonl.

**A-36 — R6 GitHub, protection de la branche principale, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-37 — R6 GitHub, protection de la branche principale, conception** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.claude/skills/experts-forge'
```

Sortie : vide.

**A-38 — R6 GitHub, protection de la branche principale, implémentation** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 7 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-development/docs/architecture.md, digit-ai-forge-development/digit-ai-forge-development/conductor/harness/branch_protection.py.

- digit-ai-forge-development/digit-ai-forge-development/backlog/seed.md (écarté : plan, test, ré-export ou texte tiers, au mieux CONNU, doublon du fichier retenu)
- digit-ai-forge-development/digit-ai-forge-development/conductor/harness/__init__.py (écarté : plan, test, ré-export ou texte tiers, au mieux CONNU, doublon du fichier retenu)
- digit-ai-forge-development/digit-ai-forge-development/tests/test_branch_protection.py (écarté : plan, test, ré-export ou texte tiers, au mieux CONNU, doublon du fichier retenu)
- digit-ai-forge-development/digit-ai-forge-development/vendor/bad/references/subagents/phase3-merge.md (écarté : plan, test, ré-export ou texte tiers, au mieux CONNU, doublon du fichier retenu)
- digit-ai-forge-development/docs/superpowers/specs/2026-06-18-real-bad-runner-design.md (écarté : plan, test, ré-export ou texte tiers, au mieux CONNU, doublon du fichier retenu)

**A-39 — R6 GitHub, protection de la branche principale, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.'
```

Sortie : vide.

**A-40 — R6 GitHub, protection de la branche principale, déploiement** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.'
```

Sortie : 2 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-ops/references/WORKFLOW-DEPLOIEMENT.md.

- digit-ai-forge-ops/fixtures/o21-workflow-deploiement/protection-verte.json (écarté : fixture de test, au mieux CONNU)

**A-41 — R6 GitHub, protection de la branche principale, audit** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- '.'
```

Sortie : 11 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/core/adr/05-delivery/ADR0505-cicd-scans-integres.md, digit-ai-forge-audit/profiles/github/README.md.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)
- digit-ai-forge-audit/core/adr-en/05-delivery/ADR0505-cicd-scans-integres.md (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/controls-en/D08.json (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/controls-en/D09.json (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/controls/controls-core-v1.en.json (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/dimensions/doctrine.yaml (écarté : même fichier que la ligne retenue, ou autre verbe déjà retenu)
- digit-ai-forge-audit/profiles/cloudflare/README.md (écarté : R6 : « ruleset » de règles WAF Cloudflare, autre réglage ; R8 : doublon du contrôle CTL-D02-06 cité avec EX-3)
- digit-ai-forge-audit/profiles/cloudflare/bindings.json (écarté : R6 : « ruleset » de règles WAF Cloudflare, autre réglage ; R8 : doublon du contrôle CTL-D02-06 cité avec EX-3)
- digit-ai-forge-audit/profiles/github/bindings.json (écarté : même fichier que la ligne retenue, ou autre verbe déjà retenu)

**A-42 — R6 GitHub, protection de la branche principale, correction** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE 'branch.?protection|rulesets?|protected.?branch' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 2 fichier(s). Retenus pour un autre verbe de la case : digit-ai-factory/todo/TODO.jsonl.

- digit-ai-factory/todo/TODO-ARCHIVE.jsonl (écarté : registre de retours, au mieux CONNU ; TF-2006 vise la MFA applicative, TF-0886 la lecture de protection de forge-development)

**A-43 — R7 Cloudflare, HTTPS imposé, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-44 — R7 Cloudflare, HTTPS imposé, conception** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.claude/skills/experts-forge'
```

Sortie : 1 fichier(s).

- digit-ai-forge-agents/.claude/skills/experts-forge/fixtures/fixture-ops-cloudflare.md (écarté : fixture de test, au mieux CONNU)

**A-45 — R7 Cloudflare, HTTPS imposé, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-46 — R7 Cloudflare, HTTPS imposé, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.'
```

Sortie : vide.

**A-47 — R7 Cloudflare, HTTPS imposé, déploiement** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.'
```

Sortie : vide.

**A-48 — R7 Cloudflare, HTTPS imposé, audit** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- '.'
```

Sortie : vide.

**A-49 — R7 Cloudflare, HTTPS imposé, correction** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE 'always.?use.?https|always_use_https|https.?redirect' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-50 — R8 Cloudflare, en-tête HSTS, cadrage** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE '\bhsts\b|strict-transport-security' HEAD -- 'skills/redige-les-exigences' 'skills/derive-les-vues'
```

Sortie : vide.

**A-51 — R8 Cloudflare, en-tête HSTS, conception** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-conception grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.' ':!skills/redige-les-exigences' ':!skills/derive-les-vues'
git -C <racine>/digit-ai-forge-design grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.'
git -C <racine>/digit-ai-forge-agents grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.claude/skills/experts-forge'
```

Sortie : 1 fichier(s).

- digit-ai-forge-agents/.claude/skills/experts-forge/fixtures/fixture-ops-cloudflare.md (écarté : fixture de test, au mieux CONNU)

**A-52 — R8 Cloudflare, en-tête HSTS, implémentation** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-development grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.'
git -C <racine>/digit-ai-factory grep -IilE '\bhsts\b|strict-transport-security' HEAD -- 'gabarits' ':!gabarits/AGENT-CAMPAGNE.md'
```

Sortie : vide.

**A-53 — R8 Cloudflare, en-tête HSTS, tests** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-tests grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.'
```

Sortie : vide.

**A-54 — R8 Cloudflare, en-tête HSTS, déploiement** (absent : CONNU, CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-ops grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.'
```

Sortie : vide.

**A-55 — R8 Cloudflare, en-tête HSTS, audit** (absent : APPLIQUÉ)

```text
git -C <racine>/digit-ai-forge-audit grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.'
git -C <racine>/digit-ai-forge-websec grep -IilE '\bhsts\b|strict-transport-security' HEAD -- '.'
```

Sortie : 36 fichier(s). Retenus pour un autre verbe de la case : digit-ai-forge-audit/core/adr/03-network/ADR0303-chiffrement-en-transit-systematique.md, digit-ai-forge-websec/oracles/oracle-exposition.mjs.

- digit-ai-forge-audit/CHANGELOG.md (écarté : CHANGELOG : au mieux CONNU, doublon du fichier source retenu)
- digit-ai-forge-audit/core/adr-en/03-network/ADR0303-chiffrement-en-transit-systematique.md (écarté : traduction ou agrégat du même contrôle déjà retenu (même verbe))
- digit-ai-forge-audit/core/dimensions/doctrine.yaml (écarté : même fichier que la ligne retenue, ou autre verbe déjà retenu)
- digit-ai-forge-audit/docs/CORRESPONDANCE-ASVS-4.0.x-5.0.0.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/docs/MAPPING-CONTROLES-ASVS.md (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/azure/bindings.json (écarté : MFA des utilisateurs de l’application (R3) ; autre plateforme ou doublon du contrôle retenu (autres réglages))
- digit-ai-forge-audit/profiles/cloudflare/README.md (écarté : R6 : « ruleset » de règles WAF Cloudflare, autre réglage ; R8 : doublon du contrôle CTL-D02-06 cité avec EX-3)
- digit-ai-forge-audit/profiles/cloudflare/bindings.json (écarté : R6 : « ruleset » de règles WAF Cloudflare, autre réglage ; R8 : doublon du contrôle CTL-D02-06 cité avec EX-3)
- digit-ai-forge-websec/README.md (écarté : R8 : doublon du contrôle EX-3 retenu (README, self-test, oracle statique, référentiels ASVS et WSTG : CONNU))
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-cookie-insecure/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-csp-absente/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-detache-csp/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-ligne-trop-longue/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-racine-nue/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-syntaxe/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/rouge-trop-de-regles/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition-statique/vert-complet/_headers (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-clickjacking.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-cookie-insecure.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-cookie-sans-httponly.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-cookie-sans-samesite.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-csp-absente.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-csp-triviale.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-permissions-absente.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-referrer-absente.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-referrer-unsafe.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-version-leak.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/rouge-xcto-absente.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/fixtures/exposition/vert-complet.json (écarté : fixture de test, au mieux CONNU)
- digit-ai-forge-websec/oracles/oracle-exposition-statique.mjs (écarté : R8 : doublon du contrôle EX-3 retenu (README, self-test, oracle statique, référentiels ASVS et WSTG : CONNU))
- digit-ai-forge-websec/oracles/self-test.mjs (écarté : R8 : doublon du contrôle EX-3 retenu (README, self-test, oracle statique, référentiels ASVS et WSTG : CONNU))
- digit-ai-forge-websec/referentiels/asvs-l1.md (écarté : R8 : doublon du contrôle EX-3 retenu (README, self-test, oracle statique, référentiels ASVS et WSTG : CONNU))
- digit-ai-forge-websec/referentiels/classes-attaque.md (écarté : classe d’attaque, connaissance générique (R3 : MFA applicative))
- digit-ai-forge-websec/referentiels/wstg-cas.md (écarté : R8 : doublon du contrôle EX-3 retenu (README, self-test, oracle statique, référentiels ASVS et WSTG : CONNU))

**A-56 — R8 Cloudflare, en-tête HSTS, correction** (absent : CONTRÔLÉ, APPLIQUÉ)

```text
git -C <racine>/digit-ai-factory grep -IilE '\bhsts\b|strict-transport-security' HEAD -- 'todo' 'gabarits/AGENT-CAMPAGNE.md'
```

Sortie : 1 fichier(s). Retenus pour un autre verbe de la case : digit-ai-factory/todo/TODO.jsonl.

## Annexe B — Instantané de départ détaillé

Sortie de `git status --porcelain`, empreinte de `git diff HEAD` et empreinte de chaque fichier non suivi, par dépôt, à 11:10:39 ; empreintes en 16 premiers caractères hexadécimaux du sha256. Les fichiers non suivis de forge-tests sont des livrables de tests d'autres produits : leurs noms ne sont pas recopiés dans ce dépôt public, seule leur empreinte l'est, dans l'ordre de `git ls-files --others`.


**digit-ai-factory** — 40 ligne(s) de status, empreinte de git diff HEAD : `0e9ce62335f57f76`.

```text
status     M gabarits/documents/catalogue.jsonl
status    MM output/03-etudes/README.md
status    MM output/04-plans/README.md
status    MM output/LISEZMOI.md
status    MM output/README.md
status     M todo/HERITAGE-RELEVES.jsonl
status     M todo/observabilite/RECIDIVES.json
status     M todo/observabilite/couts-pilot-Dell-XPS-16.jsonl
status     M todo/observabilite/revues-hebdo.jsonl
status     M todo/observabilite/snapshots-recidives.jsonl
status    MM todo/relectures-intention.jsonl
status    ?? ".oracles/output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md.oracles-historique.jsonl"
status    ?? ".oracles/output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md.oracles.json"
status    ?? ".oracles/output/03-etudes/Digit-AI - \303\211tude - Video Make it better cent fois - 20261102b.md.oracles-historique.jsonl"
status    ?? ".oracles/output/03-etudes/Digit-AI - \303\211tude - Video Make it better cent fois - 20261102b.md.oracles.json"
status    ?? ".oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102e.md.oracles-historique.jsonl"
status    ?? ".oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102e.md.oracles.json"
status    ?? ".oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102g.md.oracles-historique.jsonl"
status    ?? ".oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102g.md.oracles.json"
status    ?? ".oracles/output/04-plans/Digit-AI - Synthese Mandat - Skill make-it-better construit - 20261102m.md.oracles-historique.jsonl"
status    ?? ".oracles/output/04-plans/Digit-AI - Synthese Mandat - Skill make-it-better construit - 20261102m.md.oracles.json"
status    ?? "input/CLAUDE_CODE_PENTEST_ARCHITECTURE (1).md"
status    ?? "output/04-plans/Digit-AI - Synthese Conseil - D-177 charge suivie en 3 indicateurs - 20261105f.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Conseil - Etude suivi des temps et couts rendue - 20261105e.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Conseil - Prompt suivi des temps et couts passe au crible L99 - 20261104h.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Conseil - Prompt tri TikTok et skill passe au crible L99 - 20261102d.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Decisions D-130 a D-135 construites - 20261102p.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Largeur des gabarits de lecture corrigee - 20261103e.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Moment de la revue de code dans la mise en production - 20261103q.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Prompt d activation du releve des couts - 20261105i.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Registre des mutants et index des dossiers corriges - 20261103o.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Releve des couts par session construit - 20261105g.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Reponses D-165 a D-169 appliquees - 20261105a.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Reponses de la revue D-114 a D-119 construites - 20261102k.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Restes de campagne corriges et largeur des gabarits - 20261103b.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Retours et TODOs du 05-11 - 20261105d.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Revue D-114 a D-119 et restes de campagne - 20261102b.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Revue de code proposee a la mise en production - 20261103p.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Skill PDF construit - 20261030a.md.jugement.json"
status    ?? "output/04-plans/Digit-AI - Synthese Mandat - Suites du tri TikTok et revues de code - 20261103c.md.jugement.json"
non suivi f881535669a76281  .oracles/output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md.oracles-historique.jsonl
non suivi e7c4fe6e0e0d3ff8  .oracles/output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md.oracles.json
non suivi f26c370dd5e14366  .oracles/output/03-etudes/Digit-AI - Étude - Video Make it better cent fois - 20261102b.md.oracles-historique.jsonl
non suivi 688c576b34fb6c73  .oracles/output/03-etudes/Digit-AI - Étude - Video Make it better cent fois - 20261102b.md.oracles.json
non suivi fe90288792ea870f  .oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102e.md.oracles-historique.jsonl
non suivi c627bab6f329541f  .oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102e.md.oracles.json
non suivi bbde716cb3f7fbf6  .oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102g.md.oracles-historique.jsonl
non suivi d366df566711743c  .oracles/output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102g.md.oracles.json
non suivi a88887ea599c8b12  .oracles/output/04-plans/Digit-AI - Synthese Mandat - Skill make-it-better construit - 20261102m.md.oracles-historique.jsonl
non suivi 3335a7100923c5c7  .oracles/output/04-plans/Digit-AI - Synthese Mandat - Skill make-it-better construit - 20261102m.md.oracles.json
non suivi 71ad2f6a8d034586  input/CLAUDE_CODE_PENTEST_ARCHITECTURE (1).md
non suivi 4da4dfe858b4c897  output/04-plans/Digit-AI - Synthese Conseil - D-177 charge suivie en 3 indicateurs - 20261105f.md.jugement.json
non suivi e6360eef0b8f35eb  output/04-plans/Digit-AI - Synthese Conseil - Etude suivi des temps et couts rendue - 20261105e.md.jugement.json
non suivi 0bc190bf35c23ab6  output/04-plans/Digit-AI - Synthese Conseil - Prompt suivi des temps et couts passe au crible L99 - 20261104h.md.jugement.json
non suivi f36ae13cf878c94f  output/04-plans/Digit-AI - Synthese Conseil - Prompt tri TikTok et skill passe au crible L99 - 20261102d.md.jugement.json
non suivi d89aae85c68d06c7  output/04-plans/Digit-AI - Synthese Mandat - Decisions D-130 a D-135 construites - 20261102p.md.jugement.json
non suivi 6fe031a464871cb2  output/04-plans/Digit-AI - Synthese Mandat - Largeur des gabarits de lecture corrigee - 20261103e.md.jugement.json
non suivi 21d5602e0ab7824e  output/04-plans/Digit-AI - Synthese Mandat - Moment de la revue de code dans la mise en production - 20261103q.md.jugement.json
non suivi 5b0795a08b85faee  output/04-plans/Digit-AI - Synthese Mandat - Prompt d activation du releve des couts - 20261105i.md.jugement.json
non suivi b2962900c8e8e63c  output/04-plans/Digit-AI - Synthese Mandat - Registre des mutants et index des dossiers corriges - 20261103o.md.jugement.json
non suivi b87468efd0226ba7  output/04-plans/Digit-AI - Synthese Mandat - Releve des couts par session construit - 20261105g.md.jugement.json
non suivi 8fe3d985d9b9a84c  output/04-plans/Digit-AI - Synthese Mandat - Reponses D-165 a D-169 appliquees - 20261105a.md.jugement.json
non suivi 0df14550382039be  output/04-plans/Digit-AI - Synthese Mandat - Reponses de la revue D-114 a D-119 construites - 20261102k.md.jugement.json
non suivi 363a0e09cfbdad64  output/04-plans/Digit-AI - Synthese Mandat - Restes de campagne corriges et largeur des gabarits - 20261103b.md.jugement.json
non suivi e8333c811eccb8e9  output/04-plans/Digit-AI - Synthese Mandat - Retours et TODOs du 05-11 - 20261105d.md.jugement.json
non suivi 052ad286e3855b68  output/04-plans/Digit-AI - Synthese Mandat - Revue D-114 a D-119 et restes de campagne - 20261102b.md.jugement.json
non suivi b2fd4aa27ead0fe0  output/04-plans/Digit-AI - Synthese Mandat - Revue de code proposee a la mise en production - 20261103p.md.jugement.json
non suivi ddb7e493913eaf04  output/04-plans/Digit-AI - Synthese Mandat - Skill PDF construit - 20261030a.md.jugement.json
non suivi 63c4fcab5d574718  output/04-plans/Digit-AI - Synthese Mandat - Suites du tri TikTok et revues de code - 20261103c.md.jugement.json
```

**digit-ai-forge-agents** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-agents-security** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-audit** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-conception** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-data** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-design** — 4 ligne(s) de status, empreinte de git diff HEAD : `8d755d8931722c1e`.

```text
status     M oracles/lib/rendu.mjs
status     M oracles/run-oracles-design.mjs
status     M oracles/self-test.mjs
status     M skills/critique-le-design/references/critique-implementation.md
```

**digit-ai-forge-development** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-observability** — 1 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.

```text
status    ?? --racine
non suivi ec61480622e90880  --racine
```

**digit-ai-forge-ops** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-organization** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-seo-geo** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.


**digit-ai-forge-tests** — 1 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.

```text
status    ?? output/
non suivi df18fe35854bf396  output/ (livrable de tests n° 1, nom non recopié)
non suivi 0fd8e0a90997bbd0  output/ (livrable de tests n° 2, nom non recopié)
non suivi 9765d62c025f9f88  output/ (livrable de tests n° 3, nom non recopié)
non suivi 9ddc3ac13b0d5857  output/ (livrable de tests n° 4, nom non recopié)
non suivi de589f338aefb688  output/ (livrable de tests n° 5, nom non recopié)
non suivi 454d2ac6572fb1c9  output/ (livrable de tests n° 6, nom non recopié)
non suivi 0b358cc4664c997c  output/ (livrable de tests n° 7, nom non recopié)
non suivi 4557411cde61a4be  output/ (livrable de tests n° 8, nom non recopié)
non suivi 7b2f367700135302  output/ (livrable de tests n° 9, nom non recopié)
non suivi 6339aad35dfa4e7f  output/ (livrable de tests n° 10, nom non recopié)
non suivi 2dbcdd05eae8d59b  output/ (livrable de tests n° 11, nom non recopié)
non suivi 7630a9e05353071f  output/ (livrable de tests n° 12, nom non recopié)
non suivi 4b78eedd10f4d830  output/ (livrable de tests n° 13, nom non recopié)
non suivi fd0e14ac38fc6fe7  output/ (livrable de tests n° 14, nom non recopié)
non suivi 40c9df0127647683  output/ (livrable de tests n° 15, nom non recopié)
non suivi 7e54c4039192bcc5  output/ (livrable de tests n° 16, nom non recopié)
non suivi 3815811f78cbad4c  output/ (livrable de tests n° 17, nom non recopié)
non suivi 42657b1a1e84da79  output/ (livrable de tests n° 18, nom non recopié)
non suivi c0e92aca8468844d  output/ (livrable de tests n° 19, nom non recopié)
non suivi 7668c2f5db0b4f59  output/ (livrable de tests n° 20, nom non recopié)
non suivi 608b5bb24eb405f9  output/ (livrable de tests n° 21, nom non recopié)
non suivi e6490b49f86d6a78  output/ (livrable de tests n° 22, nom non recopié)
non suivi 6344ffbb05176bf6  output/ (livrable de tests n° 23, nom non recopié)
non suivi 233e59579d266cb6  output/ (livrable de tests n° 24, nom non recopié)
non suivi b223518a7232e337  output/ (livrable de tests n° 25, nom non recopié)
non suivi 7443dffce1050527  output/ (livrable de tests n° 26, nom non recopié)
non suivi 2cae440e8cfc0f78  output/ (livrable de tests n° 27, nom non recopié)
non suivi 9e30843fc12d78c3  output/ (livrable de tests n° 28, nom non recopié)
non suivi 2ffe8aea63ce6e68  output/ (livrable de tests n° 29, nom non recopié)
non suivi 7f4bfc0f883ebc5f  output/ (livrable de tests n° 30, nom non recopié)
non suivi 75e04c57f7d6ba94  output/ (livrable de tests n° 31, nom non recopié)
non suivi 5a1c0d941b5357f2  output/ (livrable de tests n° 32, nom non recopié)
non suivi 48c8cd962509bcbc  output/ (livrable de tests n° 33, nom non recopié)
non suivi 85823877e27063c6  output/ (livrable de tests n° 34, nom non recopié)
non suivi 8f242694c0915bb2  output/ (livrable de tests n° 35, nom non recopié)
non suivi 57114f7ebe81eec2  output/ (livrable de tests n° 36, nom non recopié)
non suivi 9852c80f18dd511b  output/ (livrable de tests n° 37, nom non recopié)
non suivi 662c89975761fc4c  output/ (livrable de tests n° 38, nom non recopié)
non suivi 7ead480f44e41ac0  output/ (livrable de tests n° 39, nom non recopié)
non suivi 1da20b83b7d2fdda  output/ (livrable de tests n° 40, nom non recopié)
non suivi 7c103ee36c73be11  output/ (livrable de tests n° 41, nom non recopié)
non suivi 12f6ffccdb89e447  output/ (livrable de tests n° 42, nom non recopié)
non suivi ed4a9ff5f698e6f8  output/ (livrable de tests n° 43, nom non recopié)
non suivi 6a4a77b60060f124  output/ (livrable de tests n° 44, nom non recopié)
non suivi 9c39bbdbf73a3507  output/ (livrable de tests n° 45, nom non recopié)
non suivi fd276670782cf98f  output/ (livrable de tests n° 46, nom non recopié)
non suivi 5ec1e8d1a72357ff  output/ (livrable de tests n° 47, nom non recopié)
non suivi 5976908300bdcc66  output/ (livrable de tests n° 48, nom non recopié)
non suivi 58a2012414e6f552  output/ (livrable de tests n° 49, nom non recopié)
non suivi f0a3e8e0dafa351f  output/ (livrable de tests n° 50, nom non recopié)
non suivi 6492f8863375f52c  output/ (livrable de tests n° 51, nom non recopié)
non suivi d43bad68ab3a1797  output/ (livrable de tests n° 52, nom non recopié)
non suivi 544dd879c092e766  output/ (livrable de tests n° 53, nom non recopié)
non suivi d613a5411094abf1  output/ (livrable de tests n° 54, nom non recopié)
non suivi 13c3641fe8a0758c  output/ (livrable de tests n° 55, nom non recopié)
non suivi aa77270e69751696  output/ (livrable de tests n° 56, nom non recopié)
non suivi 712c9baaf20a885c  output/ (livrable de tests n° 57, nom non recopié)
non suivi 3f135679256cde5d  output/ (livrable de tests n° 58, nom non recopié)
non suivi d978db6a0987bb0d  output/ (livrable de tests n° 59, nom non recopié)
non suivi 3d1369e15cb4901b  output/ (livrable de tests n° 60, nom non recopié)
non suivi ff191f9e97d9c427  output/ (livrable de tests n° 61, nom non recopié)
non suivi 275e614310a52131  output/ (livrable de tests n° 62, nom non recopié)
non suivi e76c64368186895b  output/ (livrable de tests n° 63, nom non recopié)
non suivi 69bed2c7b858fa40  output/ (livrable de tests n° 64, nom non recopié)
non suivi fa0a16cf518cea37  output/ (livrable de tests n° 65, nom non recopié)
non suivi 6df1b336da1862cb  output/ (livrable de tests n° 66, nom non recopié)
non suivi a315428d459ef601  output/ (livrable de tests n° 67, nom non recopié)
non suivi 8d649ba067934bfd  output/ (livrable de tests n° 68, nom non recopié)
non suivi 307b7dcbd6a26f81  output/ (livrable de tests n° 69, nom non recopié)
non suivi 303c8d2310ec2ca5  output/ (livrable de tests n° 70, nom non recopié)
non suivi 30f35fdbb06a9a02  output/ (livrable de tests n° 71, nom non recopié)
non suivi 30f35fdbb06a9a02  output/ (livrable de tests n° 72, nom non recopié)
non suivi 5210a9c56f563449  output/ (livrable de tests n° 73, nom non recopié)
non suivi d0ae8b059ff31989  output/ (livrable de tests n° 74, nom non recopié)
non suivi 42be470ef5f6d2f6  output/ (livrable de tests n° 75, nom non recopié)
non suivi 69bdda72c71db525  output/ (livrable de tests n° 76, nom non recopié)
non suivi 13e0c80a57876190  output/ (livrable de tests n° 77, nom non recopié)
non suivi 5f524ecb6f455983  output/ (livrable de tests n° 78, nom non recopié)
non suivi 34c5989b1d908e8f  output/ (livrable de tests n° 79, nom non recopié)
non suivi df9a04277c04b7be  output/ (livrable de tests n° 80, nom non recopié)
non suivi ea9e0826395411fe  output/ (livrable de tests n° 81, nom non recopié)
```

**digit-ai-forge-websec** — 0 ligne(s) de status, empreinte de git diff HEAD : `e3b0c44298fc1c14`.
