# Étape 5 — MEP (mise en production)

Version 1.0.0 — 2026-08-04

Development s'arrête volontairement à « PR-ready, jamais mergé ». L'étape MEP est **portée
par le pilot** et **outillée par forge-ops** (TF-0040, 11/08) : la forge fournit les gestes
(déployer, restaurer, journal) et leurs verdicts O-1…O-4 — le pilot orchestre, l'oracle
M-1…M-7 ci-dessous reste la seule vérité de l'étape, et la production reste sur **GO humain**.
Principe : **le staging est autonome, la production est sur GO humain.** La confiance du client
final se fabrique par un dossier de preuve, pas par l'absence de gate.

## 0 bis. Outillage forge-ops (articulation)

Qui fait quoi, et surtout qui NE decide pas : ce tableau se lit par acteur, et la colonne de droite dit le geste concret que chacun porte.

| Qui | Fait quoi |
|---|---|
| forge-ops | `ops.mjs deployer <build> <cible>` (healthcheck **avant** bascule, `COURANT` atomique), `restaurer` (rollback re-vérifié puis journalisé), `journal.jsonl` append-only |
| oracle-ops (O-1…O-4) | pointeur sain, healthcheck rejoué, journal intègre, rollback prouvable — verdicts versés au dossier MEP |
| oracle-ops (O-8, TF-0527) | tout travail PLANIFIÉ installé par la MEP est exerçable à la demande, câblé et distinct de sa cadence — consommé par M-7, § 3 quinquies |
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
| M-7 | Travail planifié | **si et seulement si** le produit embarque une définition planifiée (cron) : elle porte un mode d'exercice à la demande CÂBLÉ, distinct de sa cadence, et elle a été EXERCÉE une fois — verdict O-8 de forge-ops, § 3 quinquies, TF-0527 |

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

## 3 quinquies. Un travail planifié s'exerce avant d'être déclaré en place (M-7, TF-0527, 23/08)

**Ce qui a été mesuré.** Une définition de veille mensuelle venait d'être créée et enregistrée, et
le relevé remis à l'humain annonçait « la veille est en place ». Son premier passage a rendu
« Pas le premier lundi du mois — rien à faire » et s'est terminé **en succès**. Le script n'avait
donc **jamais tourné sur un agent** : ni ses dépendances, ni son accès réseau, ni la présence de
son interpréteur n'avaient été éprouvés. Le premier passage réel aurait eu lieu **quinze jours plus
tard**, au moment précis où l'on compte dessus. Après ajout d'un paramètre d'exécution forcée
— distinct de la cadence, qui n'a pas changé — le mécanisme a tourné pour de vrai : trois contrôles
rendus, tous verts, en 40 secondes.

**La doctrine, et elle existe déjà ailleurs.** Un ✓ sans oracle exécuté n'est pas un ✓ ; un
mécanisme qui n'a jamais tourné n'est pas un mécanisme, c'est une **intention planifiée**. M-7
n'est que cette phrase appliquée aux traitements différés. Elle vaut pour tout ce que la MEP
installe et qui ne s'exécutera que plus tard : veille, purge, sauvegarde, rapport périodique.

**Deux moitiés, et une seule est mécanisable.** Que le mode d'exercice **existe et soit câblé** se
lit dans la définition — un paramètre déclaré mais jamais lu affiche une case à cocher qui ne fait
rien, et vaut zéro. Qu'on s'en soit **servi** ne se lit pas dans un fichier : cela vit dans
l'historique du système d'intégration. La déclaration `# exerce_le: AAAA-MM-JJ` en tête de
définition porte ce fait, datée ; elle reste un avertissement et jamais un échec, parce qu'une
définition antérieure au contrôle n'a rien fait de mal. Le dossier MEP, lui, cite le **numéro du
passage forcé** : c'est la preuve, et elle est humaine à produire une seule fois.

**Ce que M-7 ne fait pas** : il ne devine aucune planification. Un produit sans définition planifiée
rend `SANS_OBJET`, jamais un échec — et les planifications posées **hors dépôt** (interface web du
système d'intégration, tâche planifiée d'un serveur) ne laissent aucun fichier à lire : elles sont
déclarées hors jugement, pas jugées vertes.

**Contrôle exécutable** (chez forge-ops) :
`node <ops>\oracles\oracle-ops.mjs <racine-du-produit> --planifie` — verdict O-8.

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
pas un échec. **Ce gate est incompressible.** Il change de FORME dans la variante « déploiement
continu » (§4 bis) — la poussée sur un commit nommé y tient lieu de GO — mais il n'y disparaît
pas : sans acte humain, rien ne part. Si une autonomie totale sans GO devait un jour
être voulue, elle devrait être demandée explicitement et consignée comme décision assumée dans
`HYPOTHESES.md` — elle est déconseillée : elle contredit les constitutions de forge-development
(HITL non négociables) et la fabrique de confiance client.

## 4 bis. La variante DÉPLOIEMENT CONTINU (TF-0651, décision humaine du 26/08/2026)

*Ce que cette variante échange, et ce qu'elle ne relâche pas. Elle ne retire aucune preuve : elle
change l'endroit où la preuve vit, et la forme que prend la porte humaine.*

**Le fait qui l'ouvre.** Un produit du parc fait du déploiement continu, et le fait bien : la
poussée sur la branche principale déclenche des contrôles, l'hébergeur n'installe qu'au vert, puis
une vérification de production **se place sur le commit déclencheur** — pas sur la tête de branche —
attend que l'URL publique serve **cette** version, et rejoue les contrôles décisifs dans un vrai
navigateur. Ce dernier garde-fou existe parce qu'un incident du **15/08/2026** l'a exigé : une
poussée réussie n'avait rien déployé, et la production a servi l'ancienne version **cinq minutes**
sans qu'aucun signal ne le dise.

**La route standard fabriquait donc une non-conformité permanente pour un produit qui fait mieux
qu'elle.** Un dispositif dont la porte est un dossier rédigé et relu ne prouve pas que la version
poussée est servie ; celui-ci le prouve à chaque déploiement. *Une règle qui déclare non conforme
ce qui la dépasse s'apprend à être contournée.*

### Ce que le GO devient, et pourquoi ce n'est pas une autonomie sans porte

**Le GO humain reste incompressible — il change de forme, pas de nature.** Dans cette variante,
c'est **la poussée sur un commit nommé** : un acte humain, délibéré, daté, attribué et
irréversible sans un second acte. Ce n'est pas « aucune porte » ; c'est une porte dont l'artefact
est un identifiant de commit plutôt qu'une signature au bas d'un dossier.

Ce que §4 déconseille — « une autonomie totale sans GO » — reste déconseillé, et cette variante n'y
touche pas : sans poussée humaine, rien ne part.

### Les quatre conditions, toutes exigées ensemble

Cette variante ne s'applique QUE si les quatre tiennent. Il en manque une, la route standard
s'applique : **on ne panache pas.**

1. **Les contrôles précèdent le déploiement, et le déploiement y est CONDITIONNÉ.** L'hébergeur
   n'installe qu'au vert. Un déploiement qui part en parallèle des contrôles n'est pas couvert.
2. **Une vérification de production se place sur le COMMIT DÉCLENCHEUR**, attend que l'URL
   publique serve cette version, puis rejoue les contrôles décisifs contre l'instance servie.
   C'est la condition qui remplace la relecture humaine du dossier — et la seule qui aurait vu
   l'incident du 15/08.
3. **Les preuves M-1 à M-7 restent dues, à l'identique.** Elles vivent dans le run plutôt que dans
   un dossier rédigé, et le run doit les rendre **récupérables** : un journal effacé au bout de
   trente jours n'est pas une preuve opposable. Le rollback (M-4) reste écrit ET exercé — §2 bis
   ne bouge pas d'une ligne.
4. **La variante est DÉCLARÉE au brief produit**, au même titre que la cible de déploiement, et
   consignée au ledger à l'ouverture du run. Jamais improvisée en cours de route : un produit qui
   choisirait sa route selon ce qu'il a réussi à faire ne serait pas audité, il serait raconté.

### Ce qui reste écrit, et ce qui disparaît

**Disparaît** : `DOSSIER-MEP.md` comme artefact de la porte — le run le remplace.

**Reste dû, et ne se dilue pas dans un journal de CI** : les **limites déclarées** du run (modes
dégradés, `non_juge`, hypothèses), l'**écart RGAA** d'un produit public français tant que le trou
de §3 tient, et la **liste des saisies attendues de l'utilisateur** extraite du rapport de tests.
Ces trois-là ne sont pas des verdicts de contrôle : ce sont des choses qu'un humain doit LIRE, et
un humain ne lit pas un journal de CI. Elles vivent donc dans un artefact court, versionné avec le
produit.

### Ce qui n'est pas encore mécanisé, et c'est dit

L'oracle MEP ne sait pas encore **lire un run de CI** : il vérifie des preuves posées sur disque.
Tant que ce câblage n'existe pas, cette variante se prouve par les **traces du run citées au
ledger**, exactement comme les verdicts d'oracles y sont cités par leur `seq`. C'est une preuve
opposable — un identifiant de run est vérifiable par un tiers — mais elle n'est pas **rejouée**
par le pilot, et le déclarer vaut mieux que de laisser croire l'inverse.

## 5. Après la MEP

Les retours de production (incidents, monitoring, remontées client) entrent au ledger avec
`type: "retour"`, source `production`, et alimentent la boucle d'amélioration — même cycle borné,
même gate humain que pour les forges.
