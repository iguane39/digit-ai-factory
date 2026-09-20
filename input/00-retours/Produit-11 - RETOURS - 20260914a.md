# Retours forges — Produit-11 — 20260914a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mandat humain du 14/09/2026 — « `COMPOSANTS-OPS.md` doit lister tous les
  composants utilisés par le projet en les hiérarchisant, pour une vision complète des composants,
  de leurs imbrications et de leurs usages ; les composants inutiles doivent être signalés pour
  suppression ; remonter ce point à la Factory pour généralisation ». Le document a été refait sur
  l'état réel (Resource Graph, Container Apps, registre, base, coffre, Azure DevOps, Entra) ; ce lot
  porte ce que la refonte a révélé du gabarit et de son oracle.
- **Références ledger** : `forge\ledger.jsonl` seq 177
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\` — l'original reste ici (historique du produit).
- **Statut** : **remis le 2026-09-14** — les deux fichiers déposés dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\`, ignoré par git (protocole TF-0981 du 08/09).
  Empreintes SHA-256 au moment du dépôt, vérifiées identiques entre l'original et la copie ;
  elles figurent à l'entrée `seq 177` du ledger. L'ingestion appartient au pilot
  (`accueillir-lot.mjs` puis `ingerer-lot.mjs`), pas à ce produit.

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "forge\retours\Produit-11 - RETOURS - 20260914a.md"
> ```

**Numérotation** : BAV2 tient une séquence `RT-nn`. RT-1 … RT-64 sont consommés au 11/09. Ce lot
continue en **RT-65 … RT-67**.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou
*produit+générique*.

---

## Le fait mesuré, avant toute interprétation

Le `COMPOSANTS-OPS.md` du produit était **conforme** : huit fichiers du socle présents, frontmatter
complet, R-20 au vert à chaque clôture. Il portait `verifie_le: 2026-08-11`. Entre cette date et le
14/09, le parc réel avait gagné deux comptes de stockage, deux tâches planifiées, seize ressources
de supervision et **un second environnement entier** (35 ressources en qualification). Rien de tout
cela n'y figurait, et aucun oracle ne l'a dit : R-20 juge la présence de sections, pas l'écart au
réel.

Une fois l'inventaire refait sur l'état réel — 56 ressources dans deux groupes, plus la chaîne de
livraison, Entra et les services externes — **dix éléments sans aucun consommateur** sont apparus :
trois dépôts d'images d'une application démantelée (dernier manifeste du 24/07), quatre règles de
pare-feu hors description dont une ouverte à `0.0.0.0`, un secret orphelin, deux connexions de
service dont les pipelines ont été supprimés, deux inscriptions Entra jamais activées, deux
Dockerfiles que la chaîne ne bâtit pas. Le gabarit n'a **aucune colonne ni section** pour les
porter : il inventorie ce qui existe, jamais ce qui sert.

Le contrôle qui manquait tient en quarante lignes : confronter les noms du document à un export
Resource Graph. Joué une fois, il a trouvé sept ressources absentes ; corrigé, zéro. C'est le
contrôle qu'aucune règle du socle ne jouait.

---

## pilot (`digit-ai-factory`, gabarit `docs-projet/COMPOSANTS-OPS.md` et règle R-20) et digit-ai-forge-ops

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-65 | majeur | générique | **Le gabarit COMPOSANTS-OPS inventorie la PRÉSENCE des composants, jamais leur USAGE — et un composant inutile y est indiscernable d'un composant vital.** Mesure : `gabarits/docs-projet/COMPOSANTS-OPS.md` porte une hiérarchie, un inventaire par environnement (type, ID, URL, IP) et deux sections déclaratives ; aucune colonne ne dit *qui consomme* le composant, aucun statut ne distingue ce qui est possédé de ce qui est lu sans être possédé, ni ce qui est décrit sans être instancié, et aucune section n'accueille « ce qui ne sert plus ». Sur BAV2 le 14/09/2026, dix éléments sans consommateur (registre `acrbavdevl7762t` : `bav-api`, `bav-front`, `bav-alerts-job` au tag 13325 du 24/07 ; pare-feu `psql-bav-hpr-q7k2x9` : `AllowAllAzureServicesAndResources` 0.0.0.0 ; secret `acs-connection-string` ; connexions ADO `azrm-bav-dev-wif`, `azrm-bav-hpr-wif` ; inscriptions Entra « Acces DEV/QUALIF » avec `az containerapp auth show` → `enabled: null` ; `backend/Dockerfile`, `frontend/Dockerfile` hors chaîne) coexistaient avec un document **conforme** (R-20 PASS). Pire : deux suppressions « évidentes » d'après le nom auraient tué le produit — la plateforme partagée s'appelle `-bav-` sans « 2 » — et le gabarit n'offre aucun endroit où écrire cette frontière. La demande humaine du 14/09 nomme exactement ce trou : « imbrications », « usages », « inutiles à signaler ». | Trois ajouts au gabarit, jugés par R-20 : (1) une colonne **Statut** à vocabulaire fermé — `actif` / `partagé` (lu, non possédé) / `déclaré` (décrit, non instancié) / `inutilisé` / `hors périmètre` — dont chaque valeur est **justifiée par un consommateur résolu** (image référencée, `secretRef`, identité portée, cible d'alerte, appel dans le code), jamais par le nom ; (2) une section **« Composants inutilisés — à supprimer »**, obligatoire et **déclarée même vide** (loi n° 3), chaque ligne portant la preuve d'inutilité, le geste et le **titulaire du droit** (un compte nominatif n'a souvent ni le plan de données ni l'attribution de rôle) ; (3) une table **« qui consomme quoi »** (composant, consommé par, pour quoi, preuve). La règle : *un inventaire qui ne dit pas l'usage ne permet aucune décision de suppression*. Classe proposée : `inventaire-sans-statut-d-usage` ; classe voisine portée au sidecar : `controle-vrai-sur-le-mauvais-invariant` (R-20 mesure la présence des sections, grandeur corrélée, et non l'invariant « chaque composant a un statut prouvé »). |
| RT-66 | majeur | générique | **Un COMPOSANTS-OPS peut rester conforme un mois entier alors que le parc a changé de moitié : la règle « MEP → COMPOSANTS-OPS mis à jour » est écrite, et aucun oracle ne la joue contre le RÉEL.** Mesure : `verifie_le: 2026-08-11` le 14/09 ; entre-temps 2 comptes de stockage (`stbav2img*`), 2 tâches (`caj-bav2-retention-*`), 16 ressources de supervision (`ag-`, `al-`, `wt-bav2-*`) et 35 ressources d'un second groupe (`CL3_APP_BAV_HPR`) sont nées ; R-20 rendait PASS, `oracle-conformite-projet` ne lit ni Resource Graph ni `ops.mjs etat`. La règle est pourtant écrite trois fois : `CLAUDE.md` du produit (« MEP → COMPOSANTS-OPS »), `REGLES-PROJET.md` ligne 114, gabarit (« Actualisé à CHAQUE étape MEP »). Contrôle joué le 14/09 en 40 lignes : export `az graph query` des deux groupes, chaque `name` cherché dans le document → **7 absents** au premier passage (les cinq alertes de qualification écrites « idem », `appi-bav-hpr`, `id-bav-hpr-app`), **0** après correction. Le même contrôle inverse (un nom cité qui n'existe plus) vaut pour les vestiges. | Un oracle **« inventaire ↔ réel »** sur le modèle d'`oracle-domaines-declares` (D1-D4, TF-0651) : (a) l'étape MEP dépose un export machine du parc (Resource Graph filtré sur les étiquettes `app`/`env`, ou `ops.mjs etat`) dans `forge/etapes/mep/` ; (b) l'oracle exige que **chaque nom de l'export figure dans COMPOSANTS-OPS** (littéralement — un « idem » ou une accolade `{a,b}` n'est pas un nom) et que **chaque nom cité comme actif existe dans l'export** ; (c) FAIL sur l'écart, SKIP motivé sans export. Il rend enfin `verifie_le` opposable : un document dont l'export est plus récent que sa date est périmé par construction. Classe : `regle-ecrite-sans-oracle-qui-la-joue`. |
| RT-67 | mineur | générique | **Une correction de sécurité appliquée sur un environnement n'est pas re-mesurée sur le suivant, et la matrice de flux dit « appliquée » là où elle ne l'est pas.** Mesure : `AllowAllAzureServicesAndResources` (0.0.0.0) a été retirée de `psql-bav-dev-l7762t` le 25/08/2026 et `MATRICE-DE-FLUX.md` l'écrit (« ce document est appliqué ») ; le 14/09, la même règle est présente sur `psql-bav-hpr-q7k2x9`, avec une règle nominative permanente — et elle est devenue la **seule voie** de l'API de qualification vers sa base, `qualif.tfvars` portant `adresses_sortantes_autorisees = {}`. La supprimer sans règle de remplacement couperait la qualification. Aucun oracle ne confronte la matrice aux règles réelles de **chaque** serveur ; la matrice ne connaît qu'un environnement. | Deux choses : (1) la matrice de flux se déclare **par environnement**, et un oracle la confronte aux règles réelles de chaque cible (`az postgres flexible-server firewall-rule list`, NSG) — toute règle absente de la matrice est un FAIL, toute règle de la matrice absente du réel aussi ; (2) une fiche de remédiation de sécurité porte la **liste des environnements où elle a été rejouée**, et l'étape MEP d'un nouvel environnement rejoue les remédiations closes sur les précédents. Classe : `regle-ecrite-sans-oracle-qui-la-joue`. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le premier jet du document donnait « 12 étages » au pipeline, qui en compte 10, et « 7 alertes » visant le groupe d'action, qui en compte 6 | relecture contre `deployment.yml` et le relevé Azure Monitor avant les oracles | non | Un effectif de prose sur un artefact **extérieur** au document (un YAML) n'est rapprochable par aucun oracle du document ; `oracle-calculs` le déclare déjà dans son `non_juge` (« effectifs annoncés sans ancre immédiate »). Rien de neuf à remonter : la limite est écrite. |
| L'adresse d'expéditeur servie (`DoNotReply@client-a.com`) diffère de celle annoncée par `.env.example` depuis le 09/09 (`Produit-11-noreply@notifications.client-a.com`) | consignée au § 12 du document comme limite, à trancher dans PARAMETRAGE et à prouver sur un envoi | non | Écart de paramétrage propre au produit ; la classe « deux sources pour une même valeur » est déjà portée par le pipeline lui-même (commentaire RC-25 sur `costCenter`). |
| Un dossier local parasite `frontend/dist;C` (commande mal citée), non suivi et non ignoré | signalé S-10, suppression sur le poste | non | Accident de poste, aucune règle à en tirer. |
| Le journal forge-ops (`forge/etapes/mep/cible-azure/journal.jsonl`) s'arrête au 11/08 : depuis, tous les déploiements passent par `BAV2-CICD` et n'y écrivent pas | déclaré au § 9 du document comme limite, avec la voie de restauration qui ne dépend pas du journal | **oui** | Deux sources de vérité du déploiement, dont une morte : c'est exactement la fraîcheur non mesurée de RT-66. Le retour y est porté — l'export du réel remplace le journal comme référence, plutôt que d'exiger d'un pipeline qu'il écrive dans un journal qu'il ne connaît pas. |
| `wt-bav2-availability-dev` porte `managed-by=azure-cli-audit` (créée à la main le 25/08, adoptée par Terraform avec `ignore_changes=[tags]`) quand la qualif porte `managed-by=terraform` | consignée au § 6 comme vestige sans effet | non | Étiquette historique d'une adoption ; le produit peut la corriger au prochain apply en retirant l'`ignore_changes`. Pas une classe. |

## Retours sur les documents produits

Un document a été produit sur ce lot depuis un gabarit du pilot : `docs/projet/COMPOSANTS-OPS.md`,
depuis `gabarits/docs-projet/COMPOSANTS-OPS.md`. Le gabarit **ne porte pas de numéro de version
dans son en-tête** (frontmatter `role`, `destinataire`, `sources_de_verite`, `verifie_le`,
`environnements`) — le couple `gabarit + version_du_gabarit` demandé ici n'est donc pas
reportable, ce qui est en soi un retour sur les gabarits de `docs-projet/`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `docs/projet/COMPOSANTS-OPS.md` (14/09/2026) | `gabarits/docs-projet/COMPOSANTS-OPS.md` · sans version | statut d'usage par composant ; section « inutilisés à supprimer » ; vue « qui consomme quoi » ; place pour la chaîne de livraison (dépôt, pipelines, connexions, environnements ADO), pour Entra et pour les services externes ; place pour la frontière « partagé, lu sans être possédé » ; place pour « déclaré, non instancié » (interrupteurs Terraform) | le porteur a demandé, mot pour mot, « tous les composants », « imbrications », « usages », « inutiles à signaler pour suppression » — quatre notions dont le gabarit n'a aucune (demande du 14/09/2026) | légende des statuts ; arbre annoté ★/✂ ; § 4 imbrications ; § 5 chaîne de livraison ; § 7 déclaré non instancié ; § 8 inutilisés avec geste et titulaire ; § 12 limites | générique |
| idem | idem | l'en-tête du gabarit porte `destinataire: humain`, que R-2 de `oracle-conformite-projet` sanctionne hors `output\` — le produit l'a **retiré** pour rester conforme | — (défaut trouvé par l'oracle, pas par un lecteur) | rien | générique — le gabarit d'un document de `docs\projet\` ne devrait pas porter un champ qui le fait échouer là où il doit vivre |

## Confirmations positives

- **Les deux sections imposées par R-20 ont produit de l'information, pas du remplissage.**
  « Environnements de données » (TF-0594) a forcé à écrire *par quelle règle* l'API de
  qualification atteint sa base — et c'est ainsi que la règle ouverte `0.0.0.0` est apparue comme
  seule voie (RT-67). « Infrastructure déclarée » (TF-0651) a forcé à revérifier les inscriptions
  Entra, et deux d'entre elles n'authentifient personne depuis le 26/08.
- **`oracle-ecriture` a rendu PASS au second passage**, un seul avertissement (EC-4, gras de 12
  mots) au premier ; la doctrine d'écriture tient sur un document d'inventaire dense.
- **La règle « un nom en `-bav-` sans 2 n'est pas un vestige »**, écrite dans `IDENTITE-PRODUIT.md`
  et en tête de `deployment.yml`, a tenu : aucun composant partagé n'a été classé inutilisé.

## Ordre recommandé

1. **RT-66 d'abord.** L'oracle existe presque (`oracle-domaines-declares` en est le modèle) et
   l'export du réel est une commande ; il rend `verifie_le` opposable pour tous les produits qui
   déploient. Sans lui, RT-65 ajoute des colonnes que personne ne revérifiera.
2. **RT-65 ensuite.** Le gabarit gagne trois structures et R-20 trois contrôles de présence ; la
   classe « inutilisé » n'a de sens que si le réel est mesuré (RT-66).
3. **RT-67 enfin.** Plus lourd (matrice par environnement, oracle sur les règles réelles), mais
   c'est lui qui aurait évité qu'une règle de sécurité retirée d'un environnement devienne le
   pilier invisible du suivant.

## La règle qui aurait évité le retour (TF-0779)

**Pour RT-65**, aucune règle du socle ne couvre l'usage d'un composant : R-20 exige la hiérarchie et
les identifiants, TF-0594 les environnements de données, TF-0651 l'infrastructure hors dépôt. Le trou
est nommé par la demande humaine elle-même. Classe voisine retenue pour ne pas bloquer l'ingestion :
`controle-vrai-sur-le-mauvais-invariant` ; classe propre proposée : `inventaire-sans-statut-d-usage`.

**Pour RT-66 et RT-67**, la règle existe — trois fois écrite pour l'une, une fois pour l'autre
(« ce document est appliqué ») — et personne ne la joue : c'est le cas § 4 de `quality-oracles`.
Classe : `regle-ecrite-sans-oracle-qui-la-joue`.
