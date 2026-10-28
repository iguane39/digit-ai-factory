---
sources:
  - https://developers.cloudflare.com/llms.txt (lu le 2026-10-28)
  - https://developers.cloudflare.com/pages/ (lu le 2026-10-28, mise à jour de la page du 25/08/2026)
  - https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ (lu le 2026-10-28, mise à jour de la page du 12/10/2026)
  - https://docs.github.com/en et https://docs.github.com/en/actions (lus le 2026-10-28)
  - https://supabase.com/llms.txt et https://supabase.com/docs/guides/security/tls (lus le 2026-10-28)
  - output/04-plans/Digit-AI - Synthese Mandat - Competences Supabase dans les forges - 20261016g.md
verifie_le: 2026-10-28
---

# Étude — compétences Cloudflare, GitHub et Supabase à construire dans les forges (28/10/2026)

## Ce qui change pour la Factory

Les forges savent déjà travailler avec Supabase depuis le 16/10, mais ni avec la plateforme de
développement de Cloudflare ni avec la sécurité de GitHub Actions. Le 28/10/2026, aucun dépôt du
parc ne cite `wrangler`, Workers, R2, D1 ou Turnstile. Aucun ne cite non plus `pull_request_target`,
`actionlint`, `zizmor` ou `id-token: write`. Pourtant, 5 produits du poste portent des workflows
Actions, et leurs zones passent par Cloudflare pour le DNS et les redirections. L'étude retient 17
compétences, inscrites au registre en propositions (TF-1994 à TF-2010). Trois sont à construire en
premier, parce qu'elles coûtent peu et protègent ce qui existe déjà : TF-2000, TF-2005 et TF-2001.

Trois faits datés pèsent sur ces choix :

- Cloudflare écrit de Pages : « Start new projects with Workers ». Un produit neuf part donc sur
  Workers, et Pages devient une voie existante à migrer.
- GitHub bloquera par défaut `pull_request_target` en dépôt public le 02/12/2026. Aucun workflow
  du poste ne l'emploie (mesure du 28/10 à 10:01).
- Supabase peut retirer ses suites TLS CBC dès le 10/11/2026, dans 13 jours. Aucun produit du poste
  n'emploie de bibliothèque Supabase le 28/10.

## Méthode et sources

L'accès a été mesuré avant tout travail, le 28/10/2026 à 09:22 puis à 09:36 : `curl -sL` anonyme
depuis le poste Dell-XPS-16 a rendu 200 sur les 8 adresses de l'étape 0 du prompt. Trois agents
`redacteur` (Sonnet) ont lu chacun une plateforme, de 09:37 à 10:01 environ. Ils sont partis de
l'index officiel et ont daté chaque ligne. Les pages lues ont été traitées comme des données : les
consignes pour agents qu'elles portent (« Agent setup », un « experimental prompt » de migration)
ont été décrites, jamais exécutées.

La session pilote a relu les trois catalogues. Elle a rouvert 3 lignes tirées par plateforme
(6 sur 6 à 200, nom présent dans la page) et relu les trois index à 10:04. Elle a changé 3 niveaux
proposés par l'agent Cloudflare : Agents descend en « connaître », Web Analytics et KV montent en
« approfondir ». Le détail ligne à ligne est dans l'inventaire
`Digit-AI - Inventaire - Fonctionnalites Cloudflare GitHub Supabase - 20261028a.md`, et ses données
dans le fichier JSON de même nom.

Mesuré sur : les index officiels developers.cloudflare.com/llms.txt, docs.github.com/en et
supabase.com/llms.txt, relus à 10:04, périmètre 112, 36 et 42 entrées de premier niveau, toutes
présentes dans l'inventaire.

## Volume des catalogues par niveau

Le tableau compte les lignes de l'inventaire par plateforme et par niveau. Une ligne vaut une
fonctionnalité ou une sous-fonctionnalité. « Approfondir » veut dire qu'une forge doit savoir la
concevoir, la tester, la déployer ou l'auditer.

| Plateforme | Entrées d'index | Lignes | Approfondir | Connaître | Hors de portée |
|---|---|---|---|---|---|
| Cloudflare, dont Pages (51) et Workers (42) | 112 | 205 | 67 | 99 | 39 |
| GitHub, dont Actions (111) | 36 | 313 | 95 | 167 | 51 |
| Supabase | 42 | 275 | 79 | 171 | 25 |

Les lignes « hors de portée » nomment le fait qui les écarte : réseau d'entreprise (Magic Transit,
Cloudflare WAN), facturation, offres d'administration d'entreprise de GitHub, langages clients
absents du parc (Dart, Swift, Kotlin, C# pour Supabase).

## Faits datés qui changent une décision

Chaque fait porte sa page et sa date de lecture. L'ordre suit l'échéance la plus proche.

| Échéance | Fait | Source | Conséquence |
|---|---|---|---|
| 10/11/2026 au plus tôt | « clients on old, unsupported operating systems, or embedded devices that haven't been updated might no longer be able to connect to your project's APIs » | supabase.com/docs/guides/security/tls | contrôle à ajouter au profil d'audit Supabase (TF-2006) ; aucun produit du poste concerné |
| 02/12/2026 | politique par défaut qui bloque `pull_request_target` en dépôt public, en évaluation aujourd'hui | docs.github.com, rubrique Actions | contrôle de workflow (TF-2001) ; aucun workflow du poste concerné |
| en cours | Pages : « Workers supports most Pages use cases and offers a broader feature set. It is Cloudflare's primary platform for building applications. Start new projects with Workers. » | developers.cloudflare.com/pages/ | la cible de plan (TF-1995) et l'expert (TF-1994) partent de Workers |
| en cours | « Unlike Pages, Workers does not support any domain whose nameservers are not managed by Cloudflare. » | guide de migration Pages vers Workers | une migration exige les serveurs de noms chez Cloudflare, à vérifier par zone |
| passé | Workers Sites déprécié, remplacé par Static Assets ; Firewall Rules remplacées par les règles personnalisées du WAF | catalogue Cloudflare | ne jamais prescrire ces deux voies |
| passé | GitHub Models retiré le 30/07/2026 ; registre `docker.pkg.github.com` remplacé par ghcr.io | catalogue GitHub | ne jamais prescrire ces deux voies |
| en cours | clés `anon` et `service_role` héritées, remplacées par `sb_publishable_` et `sb_secret_` | catalogue Supabase | déjà au profil d'audit du 16/10 |

## Existant mesuré dans la Factory

Mesures du 28/10/2026, par `git grep -il` et lecture des dossiers cités.

- **Cloudflare.** Le pilot tient les faits mesurés sur les jetons, les zones et les redirections
  (`references/INTEGRATIONS-FOURNISSEURS.md`, section Cloudflare, du 25/08/2026). forge-ops tient
  la migration DNS : section G-03 de `references/GESTES-EXPLOITATION.md` et
  `scripts/verifier-migration-dns.mjs`. forge-seo-geo ne cite Cloudflare que pour Logpush. Il
  n'existe ni expert, ni cible de plan, ni profil d'audit, ni pan de test, ni motif `.gitignore`
  pour wrangler.
- **GitHub et Actions.** forge-development détecte la présence d'une CI et lit les versions Python
  des workflows (`conductor/onramp/detect.py`, `conductor/gates/runtime_parity_gate.py`).
  forge-tests lit les workflows planifiés (`forge_tests/declencheurs.py`), et forge-audit traite le
  pipeline de déploiement en général (ADR0501). Rien ne juge la sécurité d'un workflow, ni les
  réglages d'un dépôt côté GitHub. La Factory publie par une porte locale (hook pre-push).
- **Supabase.** Le mandat du 16/10 a livré 5 surfaces : l'expert `ops-supabase`, la cible de plan
  `supabase`, le profil d'audit à 7 contrôles, le profil-moteur `supabase.md` et les motifs
  `.gitignore` du CLI. Hors de ces 5 surfaces, 0 fichier dans les 9 autres forges. Sur 275 lignes,
  8 sont couvertes en entier, 42 en partie et 225 pas du tout ; 71 manques sont classés
  « approfondir ».

## Carte des compétences à construire

Une ligne vaut une compétence, avec la forge qui la porte et le véhicule qui existe déjà dans la
Factory. L'item se lit au registre `todo/TODO.jsonl`. La priorité croise la valeur et l'effort
inscrits au registre : P1 se construit d'abord.

| Ligne | Compétence | Forge | Véhicule | Manque mesuré | Preuve attendue | Priorité | Item |
|---|---|---|---|---|---|---|---|
| C8 | motifs wrangler (`.dev.vars`, `.wrangler/`) dans le gabarit `.gitignore` et R-14 | pilot | garde-fou du pilot | 0 motif wrangler, 3 motifs Supabase | fixture rouge et verte au self-test de conformité | P1 | TF-2000 |
| F1 | relevé des protections GitHub des 14 dépôts publics | pilot | contrôle automatique | aucun relevé côté serveur | sortie de `gh api` en lecture seule, datée | P1 | TF-2005 |
| G1 | durcissement des workflows Actions | forge-websec | contrôle automatique | 0 fichier sur les 4 motifs, 14 dépôts | fixtures rouge et verte | P1 | TF-2001 |
| C1 | expert Cloudflare (Workers d'abord, Pages à migrer) | forge-agents | fiche d'expert admise | aucune fiche sur 18 | verdict d'admission MATERIEL | P2 | TF-1994 |
| C2 | cible de plan `cloudflare-workers` | forge-ops | cible de plan | absente des 7 entrées de `PLANS` | O-5 rouge puis vert | P2 | TF-1995 |
| C3, C4 | profil Cloudflare : TLS, en-têtes, WAF, Turnstile, Access, jetons | forge-audit, forge-websec | profil d'audit | aucun profil sur 7 | contrôles sourcés, vérificateur de profils | P2 | TF-1996 |
| S1 | profil Supabase complété, dont TLS CBC | forge-audit | profil d'audit | 4 contrôles écartés le 16/10 ont désormais une source | vérificateur de profils | P2 | TF-2006 |
| X1, X2 | combinaisons Workers ou Pages, Supabase et Actions | forge-conception, forge-ops | patron d'architecture, enchaînement de plans | aucun patron multi-plateforme | patron relu, plans enchaînés jugés par O-5 | P2 | TF-2010 |
| G2 | agent lancé par un workflow | forge-agents-security | règle de la forge | 1 workflow emploie `claude-code-action` | fixtures | P3 | TF-2002 |
| G3 | GO humain traduit en environnement protégé | forge-ops | gabarit de workflow | plans sans workflow porteur | O-5 | P3 | TF-2003 |
| G4 | profil GitHub : rulesets, CODEOWNERS, secret scanning, Dependabot | forge-audit | profil d'audit | aucun profil | vérificateur de profils | P3 | TF-2004 |
| C5 | Cloudflare pour l'indexation et les robots d'IA | forge-seo-geo | référentiel daté | 2 fichiers, Logpush seul | référentiel daté et sourcé | P3 | TF-1997 |
| S2 | cible Supabase complétée : Edge Functions, branching, diff | forge-ops | cible de plan | 5 manques | O-5 | P3 | TF-2007 |
| S4 | serveur MCP de Supabase | forge-agents-security | règle de la forge | aucune règle | fixtures | P3 | TF-2009 |
| C6 | pan de test Workers, dates de compatibilité | forge-tests, forge-development | pan testable, porte | aucune mention | test rouge et vert | P4 | TF-1998 |
| C7 | D1 et Hyperdrive | forge-data | profil-moteur | aucun profil D1 | décision écrite, garde d'inventaire | P4 | TF-1999 |
| S3, S5, S6 | Supabase au-delà de Postgres : pgvector, pooler, pg_cron, pgTAP, `@supabase/ssr` | forge-data, forge-tests, forge-development | profil-moteur, pan testable, porte | 0 fichier hors 16/10 | une décision écrite par forge | P4 | TF-2008 |

## Compétences de la Factory elle-même

GitHub joue deux rôles, et ce ne sont pas les mêmes compétences. Pour un produit client, GitHub est
un outil à concevoir et à auditer, ce que couvrent G1 à G4. Pour la Factory, c'est le lieu de
publication de 14 dépôts publics. Le catalogue classe 59 lignes en usage « factory » : jetons
personnels et leur expiration, CLI `gh`, limites de l'API, règles de dépôt. Le défaut mesuré est
F1 : seule la porte locale juge une publication, et le 24/09/2026 un filtre de sortie mort a fait
publier 13 dépôts sans elle (TF-1360). La protection côté serveur (push protection, rulesets) ne
dépend pas du poste. Le plan GitHub du compte décide de ce qui est disponible en dépôt privé ;
`gh api user` rend ce champ vide, et il n'est donc pas mesuré.

## Ordre de construction recommandé

Je recommande de construire P1 dans un seul mandat court : les trois compétences touchent des
dépôts qui existent aujourd'hui, et TF-2000 a l'effort le plus bas du lot. P2 vient ensuite, en un
mandat Cloudflare sur le modèle du mandat Supabase du 16/10 : expert, cible de plan et profil
d'audit, construits dans cet ordre, puisque la fiche d'expert fixe le vocabulaire des deux autres.
TF-2006 peut s'y joindre, son échéance du 10/11 ne touchant aucun produit du poste. P3 et P4
attendent un premier produit qui emploie ces fonctionnalités : construites sans lui, elles
n'auraient pas de cas réel pour leurs fixtures.

## Limites

- Les niveaux sont un jugement : un agent les a proposés sur un profil de produits donné, puis la
  session pilote les a relus. Les descriptions et les dates viennent des pages lues.
- Le statut « disponible » est le défaut d'une page muette ; 18 lignes Cloudflare, 7 GitHub et 19
  Supabase sont en préversion. La documentation de Supabase se contredit sur le statut du branching
  (« alpha publique » ou « bêta »).
- Le plan GitHub du compte n'est pas mesuré.
- Le traceur des forges mobilisées (`scripts/mobiliser.mjs`) refuse de s'exécuter hors d'un produit :
  ce run de conseil au pilot n'en porte pas la trace.
