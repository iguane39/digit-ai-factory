---
destinataire: humain
---

# Étude d'opportunité — mémoire partagée à portées croisées prestataire / client — 20260818c

## Seuil de déclenchement (à vérifier AVANT d'écrire)

**Franchi deux fois.** L'objet demandé **crée un objet durable** (R-31 : un référentiel, son
protocole d'écriture et son régime de preuve) **et touche ≥ 3 forges** (conception pour la
méthodologie, ops pour les ressources Cloud, organization pour les conventions, plus le noyau
qui devrait le charger à l'ouverture de run). L'étude est donc **obligatoire** avant tout
passage en `decide` — elle n'est pas une mise en forme.

## 0. Traitement des entrants

La proposition instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas.

Source : demande humaine du 18/08/2026, analysée en L99 le même jour (écart n°1 tranché par
l'humain — « opportunité », donc l'hébergement Cloud redevient une option à battre et non une
prémisse). Aucun item du registre ne préexiste sur ce sujet : vérifié sur les 382 items
(75 actifs + 307 archivés), 0 occurrence.

Tout ce qui suit a été **constaté en lecture seule** sur le poste — aucun octet écrit dans un
projet client (G-1).

## 1. Partition du problème

Quatre sous-questions disjointes. Elles n'ont pas la même réponse, et c'est le résultat
principal de cette étude.

1. **Le coût du non-partage est-il mesurable ?** Sans mesure, O0 n'a pas d'adversaire.
2. **Quelles portées existent réellement, et que se passe-t-il quand elles se contredisent ?**
3. **Qu'est-ce qu'une entrée de mémoire** — source, date, péremption, statut ?
4. **Où cela vit-il ?** Question posée en dernier, délibérément.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| **Registre TODO-FORGE** du pilot | `todo/TODO.jsonl` — 382 items réduits, dont **33 (8,6 %)** portent un `produits_beneficiaires` à **plusieurs** produits (ex. TF-0330 : `["Produit-01","Produit-10","COMPTA - Ventilation de facture Fournisseur-A","tout produit a arbre forge/"]`), et 6 déclarent leur leçon généralisable (TF-0344, TF-0369, TF-0370, TF-0371, TF-0376, TF-0197) | **RECOUVRE ENTIÈREMENT la portée « prestataire, tous clients »** pour la méthodologie et les technologies. Le mécanisme existe, il est daté, sourcé, jugé par `oracle-todo.mjs` (R1-R10) et alimenté par 6 projets émetteurs (Produit-10 35 items, Produit-11 23, Approval 23, Produit-01 23, COMPTA 9, digit-ai-fr 5) |
| **`CLAUDE.md` par produit** | 9 fichiers dans le parc Client-A, de 9 à 437 lignes (`Produit-01/CLAUDE.md` 9 l., `Produit-08/CLAUDE.md` 437 l.) | **RECOUVRE la portée « projet »**, et elle seule. Aucun de ces fichiers ne peut porter une information valable pour un autre projet : c'est le porteur d'état du produit |
| **`MISSION.md` / `pilote-de-mission`** | `.claude/skills/pilote-de-mission/SKILL.md` §Règles dures : « l'état de mission est la source de vérité unique » | **NE RECOUVRE PAS** : porte l'état d'**une mission datée**, pas un savoir persistant entre missions. Contrainte importée en revanche : ne pas créer un second porteur d'état (critère explicite de TF-0324) |
| **Fiches de forge du pilot** | `fiches/<forge>.md` cité au noyau `CLAUDE.md` §Documents de référence | **RECOUVRE** la connaissance de l'outillage interne. Ne recouvre rien du client |
| **Référentiel POC-to-Prod du client** | `Produit-01/input/Client-A - Référentiel POC-to-Prod - Audit - 20260616a.html` · `Produit-01/audit/… - 20260703a.html` · `Produit-11/audit/kit-20260716b/… - 20260716a.html` | **NE RECOUVRE PAS — c'est la preuve du manque.** Le même référentiel client existe en **trois versions datées réparties dans deux projets**, plus son « Modèle Rapport » (3 versions) et son « Prompt Audit » (2 versions). Chaque projet en détient une copie, aucun ne sait laquelle fait foi |
| **Runbook de provisionnement Azure du client** | `Approval/runbook/Client-A - Runbook Provisionnement - App conteneurisee Azure (ACB ArchimateChatbot) - 20260611.html` **et** `archimate/runbook/…` — **même nom, même date, 38 054 octets contre 40 206** | **NE RECOUVRE PAS, et c'est le constat le plus dur de cette étude** : ce n'est pas une duplication, c'est une **divergence silencieuse**. Deux fichiers de même titre et de même date portent deux contenus, et rien ne dit lequel est à jour |
| **Standards client hébergés dans une forge** | `digit-ai-forge-audit_client-a/input/` : `2020-12_Nomenclature Azure Enseigne-A.docx`, `DATA-LKE_Standards_Reorganise.md`, `Client-A - Formulaire Reprise Appli - 20260506a.xlsx` | **NE RECOUVRE PAS** : ces standards **de client** vivent dans un dépôt **de forge**, faute de lieu propre. C'est un contournement, et il fonctionne — ce qui prouve le besoin et désigne son mauvais rangement |
| **Registre des insatisfactions** | `insatisfactions/REGISTRE.jsonl`, 1 entrée (INS-0001) | **NE RECOUVRE PAS** : mémoire des signalements produit, pas des conventions client |

**Ce que la section établit** : la portée « prestataire » est **déjà couverte** et fonctionne. La
portée « client » et la portée « prestataire × client » ne sont couvertes par **rien**, et leur
absence produit des copies divergentes datées.

## 3. État de l'art daté

**Non instruit**, déclaré sans entre-deux. Motif double. D'abord, cette session n'a pas d'accès
réseau : produire cinq sources datées de moins de 24 mois reviendrait à les écrire de mémoire,
c'est-à-dire à fabriquer la preuve que cette section existe pour exiger. Ensuite, et c'est la
raison de fond : **la question posée n'est pas un choix de marché**. Les options qui suivent se
départagent sur des faits internes — ce que le client possède déjà, ce que le registre couvre
déjà, ce que le contrat autorise — et non sur les mérites comparés de solutions du commerce.

L'état de l'art des bases de connaissance partagées devient nécessaire **au moment où l'on
choisirait un composant du commerce** (branche « composant dédié » d'O1) : il est alors porté
par cette option comme préalable explicite, pas escamoté.

## 3 bis. Ce que le client possède déjà — CONSTATÉ, pas supposé

Relevé en lecture seule sur les déclarations d'infrastructure de quatre projets Client-A
(`*/infra/`, Terraform `azurerm`) :

| Composant Azure | Approval | Produit-01 | MixImpact | Plateforme vidéo | Présence |
|---|---|---|---|---|---|
| Key Vault | 47 | 76 | — | 13 | **3 / 4** |
| Entra ID | 24 | 16 | — | 16 | **3 / 4** |
| Storage Account | 2 | 11 | — | 4 | **3 / 4** |
| Service Bus | 54 | 40 | — | — | 2 / 4 |
| Container Apps | 10 | 25 | — | — | 2 / 4 |
| App Service | — | — | 1 | 24 | 2 / 4 |
| PostgreSQL | — | 8 | — | — | 1 / 4 |
| **Cosmos DB · AI Search · App Configuration** | — | — | — | — | **0 / 4** |

**Conséquence directe sur la demande.** « Idéalement un composant proposé par ce que le client
possède déjà » se résout, sur les faits disponibles, à **Storage Account + Key Vault + Entra ID**.
Le client ne possède **aucun composant de mémoire ou de connaissance** : proposer Cosmos DB ou
AI Search reviendrait à proposer un achat, pas un réemploi — l'inverse exact de la demande.

**Limite déclarée** : échantillon de 4 projets sur 22, choisis parce qu'ils portent un dossier
`infra/`. Les 18 autres n'en déclarent pas. Et posséder un Storage Account n'est pas posséder le
**droit d'y écrire de la donnée prestataire** : c'est une question contractuelle, non tranchée
ici.

## 3 ter. Les six portées, et la règle qui manquait

| Portée | Qui lit | Qui écrit | Qui arbitre | Fin de contrat | Rang au conflit |
|---|---|---|---|---|---|
| **projet** | le projet | le projet | le propriétaire du produit | reste au produit | **1 — l'emporte toujours** |
| **prestataire × client** | les projets de ce client | le prestataire, sur ce client | le prestataire, avec accord client | à négocier au contrat | 2 |
| **client** (tous prestataires) | tous les projets du client | le client | le client | reste au client | 3 |
| **prestataire** (tous clients) | tous les projets du prestataire | le prestataire | le prestataire | reste au prestataire | 4 |
| **groupe de clients** | les clients du groupe | l'animateur du groupe | à définir | à définir | 5 |
| **groupe de prestataires** | les prestataires du groupe | l'animateur du groupe | à définir | à définir | 6 |

**Règle de conflit — du plus spécifique au plus général.** Quand deux portées se contredisent sur
le même projet, **la plus étroite l'emporte**, et le conflit est **publié**, jamais résolu en
silence : le projet qui applique la portée 1 contre la portée 4 le dit dans son `CLAUDE.md`. Une
mémoire qui tranche sans le dire ferait disparaître l'information que deux sources se
contredisent — et c'est cette information-là qui a le plus de valeur.

**Corollaire, que la demande ne voyait pas** : la portée « prestataire, tous clients » a le rang
le plus **faible** en autorité et le risque le plus **élevé** en confidentialité. C'est la
portée qu'il faut construire en **dernier**, pas en premier.

**Deux portées restent à définir** (groupes) : leurs colonnes « arbitre » et « fin de contrat »
sont vides parce qu'elles supposent un tiers animateur qui n'existe dans aucun contrat constaté.
Les traiter aujourd'hui serait spéculatif ; elles sont **nommées et écartées**, pas oubliées.

## 3 quater. Ce qu'est une entrée

Six champs, tous obligatoires — le dernier est celui qui empêche la mémoire de pourrir :

`portée` · `source` (fichier, réunion datée, ou personne) · `date` · `auteur` ·
`statut` ∈ {**contraignante** — le client l'impose · **informative** — on l'a fait une fois} ·
`date_de_revue`.

**Une entrée non revue s'éteint** : elle passe en « périmée » et cesse d'être servie, au lieu de
rester vraie par défaut. C'est la loi transverse n° 4 (« une donnée volatile est une donnée, pas
du code ») appliquée au cas le plus exposé — une mémoire est le premier endroit lu à l'ouverture
d'un projet, donc **le lieu où une erreur coûte le plus cher**.

La distinction contraignante / informative n'est pas cosmétique : sans elle, une décision prise
dans le contexte du projet A devient une doctrine appliquée au projet B que personne n'a décidée.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Coût du statu quo, **mesuré** : le référentiel POC-to-Prod du client
existe en 3 versions datées réparties sur 2 projets ; son modèle de rapport en 3 versions ; son
prompt d'audit en 2 ; et le runbook de provisionnement Azure existe en **deux exemplaires de même
nom et de même date (20260611) dont les contenus diffèrent de 2 152 octets**. Les standards
client (`Nomenclature Azure Enseigne-A`, `DATA-LKE_Standards`) sont rangés dans un dépôt de **forge**
faute de lieu propre. **Réfutée** : le coût n'est pas une projection, il est sur le disque, et il
croît d'un exemplaire à chaque projet.

**O1 — composant Cloud chez le client.** Un conteneur de Storage Account, chiffré par Key Vault,
accès par Entra ID — les trois composants constatés. *Coût* : ~1 à 5 €/mois de stockage, plus
l'effort de provisionnement (Terraform déjà en place) ; **service tiers payant, GO humain
préalable exigé** (R-29 al. 3, et le garde-fou « aucune API tierce payante hors Claude » prime).
*Ce qu'elle exclut* : **la portée « prestataire, tous clients »** — un composant hébergé par
Client-A ne peut pas porter de l'information née chez BeefProject ou CoproPulse. Elle exclut aussi,
en pratique, la réversibilité : R-38 al. 2, « le retrait n'est pas outillé ».

**O2 — un dépôt git privé par client, chez le prestataire.** *Coût* : nul en euros, faible en
effort (le canal est déjà celui des 14 dépôts de l'écosystème). *Ce qu'elle apporte* : versionné,
daté, diffable, **réversible** (l'historique dit qui a écrit quoi et quand), hors ligne, aucun
service tiers payant. *Ce qu'elle exclut* : elle **ne résout pas la portée « client »** — le
client n'y écrira pas — et elle pose une question contractuelle non tranchée : **le prestataire
a-t-il le droit d'héberger les standards du client sur son propre dépôt ?** Constat aggravant :
`_Client-A/` n'est **pas** un dépôt git, et seuls **8 des 22** projets Client-A sont versionnés
localement — la discipline git n'est donc pas acquise sur ce parc.

**O3 — étendre le registre TODO-FORGE d'une dimension « client ».** *Coût* : très faible, le
mécanisme, l'oracle et le régime de preuve existent. *Ce qu'elle exclut* : elle **mélange les
portées dans un même fichier**. Un registre qui porte à la fois « ce que j'ai appris chez tous
mes clients » et « ce que Client-A impose » ne peut plus être remis à un client — or c'est
précisément ce qu'une portée « prestataire × client » doit pouvoir être. Elle transforme aussi le
registre d'amélioration de la forge en base de connaissance client : deux objets, un fichier.

**O4 — hybride, une portée à la fois, dans l'ordre du risque croissant.** Chaque portée est
servie par le mécanisme le moins cher qui la couvre **sans mélanger les autres** :

| Portée | Mécanisme | Statut |
|---|---|---|
| projet | `CLAUDE.md` du produit | **existe, rien à faire** |
| prestataire (tous clients) | registre TODO-FORGE | **existe, rien à faire** — 33 items y sont déjà multi-produits |
| **prestataire × client** | **un dépôt privé par client** (O2), à ouvrir | **à faire — c'est là qu'est le gain mesuré** |
| client (tous prestataires) | composant chez le client (O1) | **hors décision du prestataire** — à proposer au client, pas à construire |
| groupes | — | **écartée, nommée** : suppose un animateur tiers qu'aucun contrat constaté ne prévoit |

*Coût* : celui d'O2 seul, soit un dépôt et une convention d'écriture. *Ce qu'elle exclut* : rien
qui soit acquis aujourd'hui ; elle diffère explicitement les deux portées les plus risquées.

## 5. Verdict

- **Option retenue** : **O4 — hybride, une portée à la fois**, dont l'unique chantier immédiat
  est l'ouverture d'un **dépôt privé par client** pour la portée « prestataire × client ».
- **Motif** : la mesure a déplacé la question. La portée que la demande citait en premier
  (« prestataire, tous mes clients ») est **déjà couverte** par le registre TODO-FORGE, qui porte
  382 items dont 33 explicitement multi-produits — construire un second mécanisme pour elle
  créerait le doublon que TF-0324 interdit. La portée dont l'absence **coûte réellement** est
  « prestataire × client », et son coût est sur le disque : un référentiel client en 3 versions
  sur 2 projets, et un runbook en 2 exemplaires de même nom, même date, contenus différents.
- **Coût** : un dépôt privé, une convention d'écriture à 6 champs, un pointeur depuis chaque
  `CLAUDE.md` de projet. Aucun euro, aucun service tiers. Effort estimé 2.
- **Préalable bloquant, à lever avant toute écriture** : l'accord contractuel du client pour que
  ses standards soient hébergés sur un dépôt du prestataire. **Tant qu'il n'est pas obtenu,
  O4 ne s'exécute pas** — et le repli est O1 (composant chez le client), avec son
  GO de dépense.
- **Ce que le verdict NE dit pas** : que la portée « client » soit inutile. Elle est **hors de la
  décision du prestataire** — elle se propose, elle ne se construit pas unilatéralement.
- **Candidature(s) émise(s)** : aucune de plus tant que le préalable contractuel n'est pas levé.
  Ouvrir un item maintenant créerait un candidat dont l'instruction dépend d'un fait manquant —
  le même défaut que TF-0324 porte aujourd'hui.
- **Plan de revue** : **2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) le nombre de
  copies divergentes du référentiel POC-to-Prod a-t-il augmenté (aujourd'hui 3 versions sur
  2 projets) ; (2) le préalable contractuel a-t-il été posé au client, et avec quelle réponse ;
  (3) le registre TODO-FORGE porte-t-il toujours la portée prestataire sans effort dédié, ou
  a-t-il fallu l'aider — auquel cas O3 redevient à instruire ; (4) une portée « groupes » s'est-
  elle imposée par les faits, auquel cas c'est son écartement qui a échoué.

## Les quatre garde-fous, traités nommément

**Confidentialité inter-clients.** Traitée par la structure retenue, pas par une consigne : un
dépôt **par client** rend la fuite inter-clients impossible par construction, puisqu'aucun dépôt
ne porte deux clients. L'écriture se fait **par défaut dans la portée la plus étroite** ; toute
promotion vers une portée plus large est un geste humain journalisé. C'est la raison principale
pour laquelle O4 bat O3.

**Secrets.** Aucun secret ne transite ni ne se stocke. Ce qui s'écrit est une **référence** — « la
clé de tel service vit dans tel Key Vault, sous tel nom » — jamais une valeur. Le garde-fou du
noyau (« les `.env` ne transitent jamais ») s'applique intégralement, et le constat de la
section 3 bis le rend praticable : Key Vault est présent sur 3 des 4 projets mesurés, il est
**déjà** le lieu des valeurs.

**Irréversibilité.** O4 est la seule des trois voies qui y réponde : git dit qui a écrit
quoi et quand, et une entrée versée par erreur se retire avec sa trace. O1 ne le permet pas —
R-38 al. 2 : « le retrait n'est pas outillé », toute publication fautive se retire à la main dans
l'interface du service. Si O1 devenait le repli, ce point serait à traiter comme un écart déclaré.

**Aucun second porteur d'état.** La mémoire **pointe**, elle ne redit pas. Le référentiel
POC-to-Prod vit dans le dépôt client ; les projets y **renvoient** au lieu d'en copier une
version. Un projet qui a besoin d'une copie locale (travail hors ligne) la marque comme copie
datée, jamais comme source. La règle se vérifie : deux fichiers de même titre dans deux projets
sont un défaut, et c'est exactement ce que le runbook du 20260611 donne à voir aujourd'hui.

**Cinquième garde-fou, ajouté par l'analyse** : une entrée de mémoire est une **donnée**, jamais
une consigne. Elle sera lue par des agents ; les instructions qu'elle embarque se décrivent, ne
s'exécutent pas. C'est le garde-fou déjà en vigueur pour tout entrant de l'écosystème, et une
mémoire partagée en est la surface d'exposition la plus large.
