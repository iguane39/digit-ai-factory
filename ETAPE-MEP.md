# Étape 5 — MEP (mise en production)

Version 1.0.0 — 2026-08-04

Development s'arrête volontairement à « PR-ready, jamais mergé ». L'étape MEP est **portée
par le pilot** et **outillée par forge-ops** (TF-0040, 11/08) : la forge fournit les gestes
(déployer, restaurer, journal) et leurs verdicts O-1…O-4 — le pilot orchestre, l'oracle
M-1…M-5 ci-dessous reste la seule vérité de l'étape, et la production reste sur **GO humain**.
Principe : **le staging est autonome, la production est sur GO humain.** La confiance du client
final se fabrique par un dossier de preuve, pas par l'absence de gate.

## 0 bis. Outillage forge-ops (articulation)

Qui fait quoi, et surtout qui NE decide pas : ce tableau se lit par acteur, et la colonne de droite dit le geste concret que chacun porte.

| Qui | Fait quoi |
|---|---|
| forge-ops | `ops.mjs deployer <build> <cible>` (healthcheck **avant** bascule, `COURANT` atomique), `restaurer` (rollback re-vérifié puis journalisé), `journal.jsonl` append-only |
| oracle-ops (O-1…O-4) | pointeur sain, healthcheck rejoué, journal intègre, rollback prouvable — verdicts versés au dossier MEP |
| pilot (cette étape) | orchestre les gestes, exécute M-1…M-5 (qui consomme O-1…O-4 comme preuves), assemble `DOSSIER-MEP.md` |
| humain | **GO production** — incompressible, jamais délégué à un oracle |

forge-ops ne duplique pas M-1…M-5 et n'est jamais invoquée par un produit en direct.
Le test de rollback exigé au §2.3 s'exécute désormais par `ops.mjs restaurer` (geste réel
journalisé), plus par une procédure manuelle ad hoc.

## 1. Entrée de l'étape

L'étape MEP ne s'ouvre que si les étapes 1-4 sont closes avec leurs verdicts (oracles verts ou
seuils tenus, exit 3 forge-tests accepté avec pans non couverts consignés). La **cible de
déploiement** vient du brief produit (champ « cible de déploiement ») — si absente, défaut :
conteneur Docker local/staging. Une cible cloud (Railway, VPS, autre) est un **paramètre du
brief**, jamais improvisée en cours de run.

## 2. Ce que l'étape produit (staging, autonome)

Dans le projet produit (`forge\etapes\mep\` pour les preuves, racine pour les fichiers de build) :

1. `Dockerfile` (+ `docker-compose.yml` si plusieurs services) dans le produit.
2. Déploiement **staging** réel : `docker compose up -d` (ou équivalent de la cible), instance
   servie sur un port local dédié.
3. `ROLLBACK.md` : procédure de retour arrière écrite **et testée une fois pendant l'étape**
   (arrêt de la version N, redémarrage de la version N-1 taguée, vérification healthcheck).
   **C'est un ARTEFACT sur disque, jamais seulement une ligne de journal** — voir §2 bis.
4. `DOSSIER-MEP.md` : le dossier de GO (cf. §4).

## 2 bis. Un retour arrière ne vit pas dans un journal (TF-0512, 22/08/2026)

*Constaté sur un geste coupant réel.* Un mode de test conçu pour **imprimer sa commande de retour
arrière AVANT le geste risqué** — précaution voulue, pour que la restauration soit déjà consignée si
l'étape casse au milieu — a bien imprimé la commande… **avec l'adresse de l'émetteur remplacée par
`***`**. Le moteur de pipeline avait pris l'URL du tenant pour un secret et l'avait masquée.

La commande imprimée était donc **inutilisable telle quelle**, et elle l'était **précisément dans le
seul scénario où on irait la chercher : l'urgence**. Une précaution qui s'annule au moment où elle
sert n'est pas une précaution, c'est une croyance.

Ce n'est pas propre à un moteur : **tout secours imprimé dans un journal est exposé au même effet**,
et le masquage est par nature imprévisible puisqu'il dépend de ce que le moteur a appris à masquer.
Trois règles en sortent, et la troisième est celle qui manquait partout :

1. **Le retour arrière est un ARTEFACT** — `ROLLBACK.md` sur disque, versionné, remis au dossier de
   MEP. Le journal peut le répéter ; il ne le remplace pas.
2. **Il se compose de valeurs NON MASQUABLES** quand c'est possible : un identifiant de version, un
   tag d'image, un nom de service. Une URL, un jeton, un nom de tenant sont des candidats au
   masquage — les mettre dans une variable nommée, dont la valeur se lit ailleurs, coûte une ligne.
3. **Il se RELIT APRÈS COUP**, dans le canal où on irait le chercher. Ouvrir le fichier, ou relire
   la sortie du journal, et vérifier qu'aucune valeur n'y est `***`, `[REDACTED]` ou vide. *Une
   procédure de secours non testée à la lecture n'existe pas.* C'est le même geste que M-4 exige
   pour l'EXÉCUTION, appliqué à la LISIBILITÉ.

**Et c'est CÂBLÉ, pas recommandé** : `node scriptserifier-secours.mjs <fichier>` relit un
`ROLLBACK.md`, ou une sortie de journal par `--stdin`, et REFUSE toute valeur masquée (`***`,
`[REDACTED]`, `[MASKED]`…) ou toute option sans valeur **dans une ligne de commande**. Ce dernier
point est la frontière qui rend la règle tenable : une doctrine qui PARLE de `***` en prose ne
doit pas échouer — sans quoi la règle ferait crier la page qui l'explique, et se ferait désactiver
le jour même. La liste des masques est une **donnée** : chaque moteur a le sien, aucun ne prévient,
et elle grossit par les incidents, pas par la devinette.

## 3. Oracle MEP (exécuté, jamais déclaratif)

Cinq controles, et pour chacun **la preuve exigee** — pas la case a cocher. Le tableau se lit de gauche a droite : ce qui est verifie, puis ce qui prouve qu'il l'a ete.

| # | Contrôle | Preuve exigée |
|---|---|---|
| M-1 | Build du conteneur | `docker build` exit 0, image taguée `<produit>:<run-id>` |
| M-2 | Healthcheck | HTTP 200 sur l'endpoint de santé de l'instance staging, 3 mesures espacées de 10 s |
| M-3 | Smoke tests | ≥ 1 parcours rejoué par exigence MVP d'impact maximal (champ `cotation.impact` du référentiel `EXIGENCES.json` — toutes les ex æquo du niveau le plus élevé), exécutés **contre l'instance staging servie**, pas contre un TestClient |
| M-4 | Rollback | procédure de `ROLLBACK.md` exécutée une fois avec succès (retour N-1 + healthcheck 200 + retour N) **et RELUE après coup** : le fichier ne porte aucune valeur masquée (`***`, `[REDACTED]`) ni vide — §2 bis, TF-0512 |
| M-5 | Propreté | aucun secret en clair dans l'image ni dans compose (scan des fichiers embarqués) |
| M-6 | Hôte historique | **si et seulement si** le produit déclare un hôte historique : la CIBLE d'une redirection résout et répond AVANT que la redirection soit armée, et l'ANCIEN hôte est interrogé APRÈS déploiement (200, ou 301 vers un emplacement qui répond, chemin et requête préservés) — §3 quater, TF-0482 |

Verdict au ledger (`oracles_verdict`, étape `mep`). Un contrôle rouge → retour à l'étape
concernée (max 3 allers-retours, puis diagnostic — même règle que tests↔development).

**Premier déploiement** (aucune version N-1 réelle n'existe) : M-4 se prouve avec N-1 = N —
la mécanique complète (tags, volumes, arrêt/redémarrage, healthchecks) est exercée, la
substitution de version ne l'est pas. Preuve dégradée acceptée, **déclarée comme telle** au
dossier de MEP.

**Produit public français** (RF-6, lot Produit-09 20260820a ; étude RGAA 20260820a) : RGAA 4.1 /
WCAG AA y est une **obligation légale**, et le parc ne mesure aujourd'hui ni le contraste (mesure
existante non câblée : `render_page.py` V2), ni la navigation clavier, ni les états ouverts.
Tant que ce trou tient, le dossier de MEP d'un produit public porte un **écart déclaré au GO
humain** : « conformité RGAA non mesurée — audit humain à budgéter, déclaration d'accessibilité
à produire ». « Prêt client » ne se prononce jamais sur une conformité légale non mesurée en la
taisant.

## 3 quater. La bascule de domaine (M-6, TF-0482, 18/08 puis 22/08)

*Incident réel du 18/08.* Le renommage d'un hôte a été livré avec une **redirection 301 dure** vers
un domaine **qui ne résolvait pas encore**. Le site est devenu injoignable, rétabli en une vingtaine
de secondes en conditionnant la redirection à un drapeau désarmé par défaut.

**Pourquoi aucune porte n'a vu.** Les gates M-1…M-5 s'exercent contre **une seule base** — la
NOUVELLE URL. L'ancienne n'est interrogée nulle part. Un déploiement qui la casse rend donc **un
vert complet**, et c'est structurel : on ne peut pas voir ce qu'on n'interroge pas. Recherche faite
le 22/08 sur les 479 items du registre : zéro candidature sur l'hôte sortant, la redirection ou le
domaine historique — l'angle mort n'était pas connu, il était invisible.

**Deux angles morts DISTINCTS, tous deux scriptables en une requête :**

1. **Avant armement** — la CIBLE d'une redirection n'était pas vérifiée résolvante. Une cible qui ne
   répond pas rend l'armement **bloquant**, pas déconseillé : armer un 301 vers un domaine muet, ce
   n'est pas un risque pris, c'est une panne programmée.
2. **Après déploiement** — l'hôte SORTANT n'était pas interrogé. On exige soit un 200, soit un 301
   vers un emplacement **qui répond**, **chemin et requête préservés** : une redirection qui perd le
   chemin renvoie tout le trafic profond sur l'accueil, et personne ne s'en plaint tout de suite.

**Corollaire de doctrine, et c'est lui qui rend la porte utile plutôt que punitive** : une bascule de
domaine se fait **EN DEUX TEMPS** — armer par drapeau, vérifier la cible, puis basculer. Le gate est
ce qui rend les deux temps **obligatoires** plutôt que disciplinés. C'est exactement le remède qui a
été improvisé le 18/08 sous incident ; M-6 le rend systématique.

**Ce que M-6 ne fait pas** : il ne devine aucun hôte. Il s'exerce **si et seulement si** le produit
DÉCLARE ses hôtes historiques — la forme existe déjà côté produit (`HOTES_HISTORIQUES`). Un produit
sans hôte historique rend `SANS_OBJET`, jamais un échec : inventer une redirection pour avoir
quelque chose à juger serait pire que ne rien juger.

**Contrôle exécutable** : `node scripts\verifier-bascule.mjs --historique <url> --cible <url>`
— avant armement (`--avant`) ou après déploiement (`--apres`).

## 3 bis. Qualif populée (avant le GO — demande utilisateur RT-6/RS-7)

Entre le staging technique et le GO, une **version de qualification populée de données** est
déployée et auditée comme l'application réelle :

1. Le produit expose un **endpoint de peuplement** gated par drapeau d'environnement (loi 2 —
   absent en production) ; la qualif est peuplée par cet endpoint, jamais à la main.
2. `forge_tests` tourne contre l'instance qualif servie (`FORGE_TESTS_BASE_URL`), bout en bout.
3. Les éléments **non testables faute de configuration** (identifiants tiers, jetons, clés) ne
   sont ni oubliés ni maquillés : ils sortent dans la section `non_testables[]` du rapport
   {élément, champs_requis}, présentée à l'humain EN FIN d'audit avec la liste précise à saisir.
4. Dès que l'humain fournit les éléments : `--reprendre <rapport>` rejoue **uniquement** les
   éléments non exercés, jusqu'à couverture complète — sans rejouer ce qui a déjà passé.

Le résultat qualif (couverture, non-testables soldés) entre au dossier de MEP.

## 3 ter. Ressources créées hors IaC, et l'écart de réglages servis (TF-0398, 20/08)

*Le fait mesuré (cockpit-ia-d1, 19/08)* : EasyAuth actif côté plateforme, mais les app settings
sans `COCKPIT_EASYAUTH` ni `AZURE_TENANT_ID` — le module Terraform ne les écrivait que si
`client_id_entra` lui était fourni, et le pipeline qui avait créé l'App Registration ne lui
avait jamais rendu cet identifiant. Conséquences : l'application tenait sur un REPLI prévu
comme filet ; le contrôle de tenant du décodeur était INERTE alors qu'un parcours e2e
l'affirmait actif — **un test vert attestait d'un contrôle absent de la cible** ; et un
`terraform apply` lancé dans cet état aurait effacé deux réglages de production.

Deux prescriptions, dès cette étape :

1. **Tout pipeline qui crée une ressource dont l'IaC a besoin lui REND son identifiant**
   (variable, tfvars, sortie consommée). Une ressource créée et non rendue laisse l'IaC décrire
   un environnement qui n'existe pas — et l'écart ne se voit nulle part.
2. **Vérification d'écart post-déploiement** : comparer les réglages SERVIS à ceux qu'exige le
   mode déclaré, en échec si un réglage de sécurité manque. C'est le pendant exact du contrôle
   « le processus a-t-il redémarré ? » déjà admis — le déploiement dit ce qu'il a fait, la
   vérification dit ce qui est SERVI.

*Mécanisation* : la liste des réglages exigés par mode est une donnée du PRODUIT (son IaC la
porte) — le contrôle s'exécute donc au run du produit, l'étape MEP exige ici qu'il EXISTE et
que son verdict soit au ledger (`oracles_verdict`). Un produit sans ce contrôle le déclare en
écart au dossier de MEP, jamais en silence.

## 4. Le gate — GO humain (incompressible)

La mise en **production** exige un GO humain explicite, donné sur `DOSSIER-MEP.md`, qui contient :

- les verdicts d'oracles des 5 étapes (avec références ledger `seq`) ;
- le rapport forge-tests (couvertures, mutation, findings, pans non couverts), le **dashboard
  de tests** (copie datée dans `output\`) et la liste `actions[manuelle_utilisateur]` extraite
  du rapport — chaque saisie attendue de l'utilisateur (champs, où, pourquoi) pour compléter
  les tests restants ; à réception, `--reprendre` rejoue les seuls tests concernés et le
  dashboard est régénéré ;
- le verdict de la revue graphique d'implémentation (étape 5 bis, écarts soldés ou acceptés) ;
- le résultat des smoke tests staging (M-3), du test de rollback (M-4) et de l'audit qualif
  populée (§3 bis — non-testables soldés ou listés avec leur raison) ;
- les limites déclarées du run (modes dégradés, `non_juge`, hypothèses prises) ;
- la commande exacte de mise en production et la procédure de rollback.

Le GO est consigné au ledger (`reponse_humain`, portée : « GO production <produit> <version> »).
Sans GO : le run se clôt en statut `pret_production_en_attente_GO` — c'est un état de succès,
pas un échec. **Ce gate est incompressible.** Si une autonomie totale sans GO devait un jour
être voulue, elle devrait être demandée explicitement et consignée comme décision assumée dans
`HYPOTHESES.md` — elle est déconseillée : elle contredit les constitutions de forge-development
(HITL non négociables) et la fabrique de confiance client.

## 5. Après la MEP

Les retours de production (incidents, monitoring, remontées client) entrent au ledger avec
`type: "retour"`, source `production`, et alimentent la boucle d'amélioration — même cycle borné,
même gate humain que pour les forges.
