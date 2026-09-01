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

## 1 bis. La campagne de MUTATION se propose ICI, et nulle part ailleurs (D-34, 01/09/2026)

**La décision humaine, mot pour mot** : « Tous les tests sont pleinement exécutés tout le temps,
sauf les tests sur les mutants qui sont exécutés à la demande, lors d'un passage en Prod sur
proposition de l'IA, et uniquement s'ils n'ont été exécutés depuis plusieurs modifications de
code. »

**Ce qu'elle tranche, et ce n'est aucune des options qui lui étaient proposées.** L'étude du 01/09
cherchait à rendre la mutation moins CHÈRE ; la décision la rend plus RARE. Le raisonnement est le
plus solide des deux et il faut le dire : le coût d'une campagne de mutation ne devient un problème
que parce qu'on la joue à chaque fois. Jouée une fois avant une mise en production, après plusieurs
modifications, une campagne longue n'est plus un coût — c'est le prix d'une porte, et une porte se
franchit rarement.

**Ce qu'elle interdit, et c'est le versant qu'on oublierait** : « pleinement exécutés tout le
temps » ferme la porte à toute SÉLECTION sur la suite ordinaire. Ne rejouer que les tests touchés
par un changement — le troisième palier de l'étude — est refusé, et ne se représentera pas sous un
autre nom. La suite entière reste la mesure de chaque changement.

**Les trois conditions, et qui les porte** :

| Condition | Qui l'exécute | Ce qui se passe si elle manque |
|---|---|---|
| à la demande | l'adaptateur de mutation de forge-tests, éteint par défaut (`FORGE_TESTS_MUTATION=1`) | chaque audit repaie la campagne entière, et le coût redevient la raison de la couper |
| sur proposition de l'IA, au passage en production | **cette étape** : l'entrée de la MEP lit l'état publié par le pan et pose la proposition au GO humain | la porte n'a aucun moment où s'ouvrir, et la mutation ne se joue jamais |
| seulement si périmée | la campagne précédente est notée chez le produit (`forge\mutation-derniere-campagne.json`), et les modifications du code source depuis se comptent | la proposition tombe à chaque passage, devient du bruit, et se fait ignorer |

**Le geste, à l'entrée de l'étape** : lire `mutation.a_la_demande` au rapport de forge-tests. S'il
porte `perimee: true`, la campagne se PROPOSE au bloc de décisions de la restitution, avec son
motif chiffré — nombre de modifications depuis la dernière campagne, et seuil retenu. La décision
de la jouer reste humaine (R-29) : elle coûte du temps machine, et une dépense de temps se décide.

**Le seuil est un chiffre, pas un mot.** « Plusieurs modifications » vaut **10 commits touchant le
paquet de sources** par défaut, et se change par `FORGE_TESTS_MUTATION_PEREMPTION`. Il est publié
au rapport : un seuil qu'on ne lit pas est un seuil qu'on ne discute pas.

**Une ancienneté inconnue vaut périmée.** Sans dépôt git, sans campagne antérieure notée, ou si le
compte échoue, la campagne est proposée. Le choix inverse ferait passer un projet neuf entre les
mailles pour toujours, et personne ne le verrait — c'est la forme la plus coûteuse du silence.

**Ce que le seuil bloquant devient quand le pan n'est pas joué** : sans porteur, et le rapport le
DIT. Un pan non demandé et un pan dont le score est nul sont deux choses différentes ; les
confondre au tableau de bord ferait lire une absence de mesure comme un échec de mesure.

**Et quand la campagne est jouée, elle l'est DEUX FOIS la première fois (D-36 (a), 01/09/2026).**
Le ciblage par ligne mutée — ne rejouer, pour un mutant, que les tests couvrant la ligne
altérée — est écrit et éteint. La décision humaine le laisse éteint jusqu'à sa vérification, et
cette vérification se joue **à la prochaine campagne réelle**, pas « un jour » :
`python recette/non_perte_ciblage.py <projet>` côté forge-tests joue les deux campagnes et
compare les listes de survivants. Verdict `PASS` : le ciblage peut devenir le défaut, et cela
se redécide. Verdict `FAIL` : il reste éteint, et l'écart mesuré est consigné.

*Pourquoi la vérification vit ici et pas dans une intention* : une campagne réelle est le seul
endroit où les deux passes portent sur du code qui compte. La jouer sur un banc d'essai
prouverait que le mécanisme tourne, pas qu'il ne perd rien.

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
| M-8 | **Jalon de fraîcheur DÉRIVÉ DE TOUT L'ENSEMBLE DÉPLOYÉ** | **si et seulement si** le déploiement est gardé par une porte qui attend de voir « la nouvelle version en ligne » : la valeur qu'elle compare est une **fonction de l'ENSEMBLE déployé** — empreinte du **manifeste de l'arbre de sortie** (chemins triés + hachages, condensés), ou **identifiant de commit injecté à la génération**. Jamais un numéro tenu à la main ; **jamais non plus l'empreinte d'un artefact échantillonné**. Le critère tient en une phrase : *si on ne sait pas dire « elle change dès que N'IMPORTE QUOI change », le jalon échantillonne.* Preuve exigée : un **test négatif joué sur un fichier QUELCONQUE de l'arbre**, pas sur celui que la porte regarde — §3 sexies, TF-0666 et TF-0672 |

### § 3 sexies — Une porte qui ne distingue pas l'avant de l'après valide un déploiement qui n'a pas eu lieu (M-8, TF-0666)

**Le fait, du 26/08/2026.** Une porte de production attendait que l'URL publique serve un actif
portant un numéro de version lu dans le dépôt, avant de lancer ses contrôles navigateur. **Ce
numéro est resté identique sur les SIX POUSSÉES CONSÉCUTIVES de la journée.** La porte
reconnaissait donc la version que servait encore **l'ancien conteneur**, écrivait « déploiement
en ligne au bout de 1 essai », et les contrôles partaient pendant le redémarrage.

**Constat direct le même jour** : un contrôle en ÉCHEC à 09:52, **le même contrôle VERT au rejeu
à 09:54**, code identique, sans un octet de différence. Vérification faite en production : le
balisage attendu était bien servi. *Le rouge était faux.*

**Le faux rouge est le symptôme bénin ; le faux vert est le vrai risque.** Une porte incapable de
distinguer l'avant de l'après valide aussi bien un déploiement **qui n'a pas eu lieu** — et c'est
exactement le défaut que cette porte avait été écrite pour empêcher, après qu'une poussée n'eut
rien déclenché et que la production eut servi l'ancienne version cinq minutes sans que rien ne le
signale. **La promesse était tenue à la lettre — la version est bien LUE dans le dépôt — et
manquée dans l'esprit, puisqu'elle n'y VARIE pas.**

**La classe est générique** : tout jalon de déploiement indexé sur un numéro tenu à la main porte
ce défaut, *puisqu'un numéro manuel ne bouge que quand on y pense*. D'où M-8 : la valeur de
fraîcheur est **dérivée**, ou il n'y a pas de jalon. Une empreinte de contenu change **par
construction** dès que le contenu change ; c'est ce que « par construction » veut dire, et c'est
ce qu'aucune discipline humaine ne remplace.

**PREMIÈRE CORRECTION, ET ELLE EST TOMBÉE LE JOUR MÊME.** Le remède évident — remplacer le
numéro figé par l'empreinte du HTML servi — a été appliqué, puis **il a récidivé le
lendemain**. La porte lisait l'empreinte d'**UNE** page et concluait sur les **203**. Mesure
sur une poussée réelle : **70 pages HTML modifiées, la page échantillonnée inchangée**, donc
empreinte attendue identique à celle que servait encore l'ancien conteneur. La porte a écrit
« déploiement en ligne au bout de 1 essai », les dix contrôles sont passés au vert et le
rapport a conclu « production conforme » — pendant qu'au même instant deux pages servaient
encore le contenu supprimé. Le déploiement réel a atterri **90 secondes plus tard**.

**Une valeur qui ne varie JAMAIS avait été remplacée par une valeur qui ne varie QUE POUR UN
ÉCHANTILLON — et le second défaut est plus dangereux que le premier, parce qu'une empreinte
A L'AIR dérivée là où un numéro figé se lit.** D'où la formulation actuelle de M-8 : *fonction
de l'ensemble déployé*, et un test négatif joué sur un fichier QUELCONQUE de l'arbre — pas
sur celui que la porte regarde, qui ne prouve que lui-même.

**LA LEÇON DE SECOND ORDRE VAUT AU-DELÀ DE CE JALON, et elle porte sur cette page même.**
La première rédaction de ce paragraphe déclarait un angle résiduel : « une poussée qui ne
modifie ni le livrable ni ses actifs laisse l'empreinte inchangée ». C'était vrai. Le cas qui
a mordu était l'INVERSE — le contenu avait changé sur 70 pages et la porte n'a rien vu — et
il était **plus probable** que celui qui avait été prévu. **Déclarer un angle résiduel ne
couvre que l'angle nommé**, et la déclaration donne un faux sentiment d'exhaustivité :
l'écrire fait croire qu'on a fait le tour. Un aveu borné reste un aveu, jamais une couverture.
*Cette page a payé sa propre règle en moins de vingt-quatre heures.*

**CE QUI RESTE OUVERT, sans prétendre que la liste soit close.** Le mécanisme d'attente
lui-même n'est pas revu : même avec une valeur correcte, la porte reste une **comparaison
ponctuelle** et ne dit pas que le conteneur a fini de basculer. Et **aucune mesure n'a été
prise sur les autres produits du parc**, qui portent peut-être la même classe.

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

## 4 ter. Piloter Railway — le mode d'emploi qui se reperdait à chaque session (TF-0704, 0705, 0706, 0735)

Railway est la cible cloud la plus fréquente du parc, et son mode d'emploi a été payé QUATRE
fois avant d'être écrit ici : un domaine anonyme laissé onze jours en production, une campagne
de tests qui a audité la mauvaise application, deux impasses de diagnostic en une session, et
un déploiement déclaré « bloqué, geste humain requis » pendant qu'un jeton valide vivait sur le
poste. Quatre faits, une cause : le principe vivait dans la mémoire des sessions.

- **L'authentification est le JETON, jamais `railway login`** (TF-0735). Le CLI honore
  `RAILWAY_API_TOKEN` en variable d'environnement SANS aucun login — `railway whoami` répond du
  premier coup ; `railway login` ouvre un parcours OAuth navigateur hors de portée d'une session
  agent, et ne se prescrit jamais. L'emplacement du jeton sur le poste se lit dans la fiche
  `docs\projet\ACCES-TEST.md` du produit (ligne « déploiement », obligatoire depuis le 01/09).
  **Une impossibilité d'accès ne se déclare qu'après avoir tenté ce repli** : le contrôle
  d'entrée de l'étape échoue TÔT avec « jeton absent, attendu à `<emplacement>` » plutôt que de
  laisser la session conclure au geste humain — l'épisode du 31/08 a coûté un aller-retour
  humain complet et une entrée de ledger fausse pour un déploiement qui a réussi trente minutes
  plus tard avec le jeton du poste.
- **Le CLI ne sert qu'à téléverser** (TF-0704). `railway service` ne sait ni renommer un
  service ni corriger un domaine ; tout le reste passe par l'API GraphQL —
  `https://backboard.railway.com/graphql/v2`, en-tête `Authorization: Bearer <jeton>` :
  renommage de domaine, lecture d'état, vérification de disponibilité.
- **Le domaine se NOMME au premier déploiement** (TF-0705). Le domaine généré par défaut
  (`app-production-<hash>`) ne nomme ni le produit ni son environnement — une campagne a
  crawlé la mauvaise application à cause de lui. La MEP nomme le domaine à partir du nom de
  projet et de l'environnement (`<produit>-production.up.railway.app`, R-24), et l'inscrit au
  dossier de MEP et au ledger. La garde côté forge-tests reste une défense en profondeur, elle
  cesse d'être la seule.
- **Deux pièges de l'API, mesurés** (TF-0706) : toute requête SANS en-tête `User-Agent` reçoit
  un 403 du WAF avant d'atteindre l'API — symptôme trompeur qui se lit comme un défaut de
  jeton ; et un refus de schéma revient en HTTP 400 avec le seul message « Problem processing
  request », sans nommer le champ fautif — introspecter le schéma
  (`__type(name: …) { inputFields }`) AVANT d'écrire une mutation plutôt que la déduire de la
  documentation (`ServiceDomainUpdateInput` exige quatre champs non nuls).

## 5. Après la MEP

Les retours de production (incidents, monitoring, remontées client) entrent au ledger avec
`type: "retour"`, source `production`, et alimentent la boucle d'amélioration — même cycle borné,
même gate humain que pour les forges.
