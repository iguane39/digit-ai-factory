# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260824b

- **Contexte** : revue documentaire du propriétaire métier sur la fiche sécurité, le DAT et le DEX,
  le 24/08/2026 — **une question de relecteur a trouvé un écart de sécurité réel** que trois
  dispositifs successifs n'avaient pas vu
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot.** Le propriétaire métier a relu la fiche sécurité et posé cinq questions.
La deuxième — *« "appartenir au tenant" correspond-il exactement à l'audience autorisée,
notamment pour les comptes invités ? »* — a une réponse mesurée, et c'est **non** : l'application
admet **3 128 comptes invités** en plus des collaborateurs. La fiche remplie était **exacte sur
tous les champs que le canevas lui demandait**. Elle taisait l'essentiel parce que **le canevas ne
le demande pas**.

Cet écart a traversé sans être vu : un audit statique du dépôt le 18/08, un dossier de passage en
comité, et une revue documentaire de sécurité. Il n'a été trouvé que parce qu'un relecteur a posé
une question **en prose**, hors de tout gabarit. C'est le sujet de ce lot.

---

## socle `gd-fiche-securite` — ce que le canevas demande, et ce qu'il oublie de demander

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-33 | bloquant | générique | **Le canevas de fiche sécurité demande COMMENT on s'authentifie, jamais QUI est effectivement admis — ni combien ils sont.** Le bloc `## Authentification` de `digit-ai-forge-audit/deliverables/templates/fiche-securite.template.md` porte cinq champs : mode d'authentification, fournisseur d'identité, MFA, comptes de test, modèle d'autorisation. **Aucun n'oblige à chiffrer la population réellement admise.** Mesuré le 24/08 sur le produit : l'application Entra porte `appRoleAssignmentRequired = false`, les listes `allowedPrincipals` et `allowedApplications` de Easy Auth sont **vides**, et l'annuaire du tenant compte **3 128 comptes invités** — tous admis. La fiche disait « Entra ID mono-tenant, login obligatoire », ce qui est **vrai**, et laissait comprendre « audience restreinte », ce qui est **faux**. Le champ « modèle d'autorisation » aurait dû recevoir « aucun rôle, aucune granularité » : rien dans le canevas ne rend cette réponse alarmante. **L'écart a survécu à un audit statique, à un dossier de comité et à une revue de sécurité** ; il n'a été trouvé que par une question posée en prose par un relecteur. | Champ **obligatoire** au canevas, dans le bloc Authentification : **« Audience effectivement autorisée »**, exigeant trois choses dans la même cellule — la **population** admise, son **effectif mesuré**, et le **mécanisme qui exclut le reste**. Refus à la production tant que l'effectif n'est pas chiffré : « les collaborateurs » n'est pas une réponse, « 412 comptes du groupe X, invités exclus par attribution obligatoire » en est une. *Un mécanisme d'authentification décrit sans son audience chiffrée décrit une porte sans dire qui a la clé.* |
| RA-34 | majeur | générique | **Le canevas ne porte aucun champ d'engagement de service, chaque instance en écrit un à la main, et rien n'y distingue un objectif d'un engagement opposable.** Vérifié : aucune occurrence de SLA, disponibilité, RTO ou RPO dans le gabarit. Notre instance a donc ajouté la section elle-même — et y a écrit *« engagements validés le 22/08/2026 par le porteur, et donc opposables : disponibilité 99,5 % »*. Le relecteur métier l'a contesté. Mesuré ensuite : plan **B1 Basic, 1 instance, non redondant en zone, 0 emplacement de déploiement** — chaque livraison redémarre l'unique conteneur, aucune bascule sans coupure n'est possible. L'engagement n'était donc **pas tenable**, et rien dans le document ne l'avait obligé à citer la mesure qui l'aurait révélé. Le même document mélangeait par ailleurs le délai de rétablissement **cible** (2 à 4 minutes, écrit dans le dépôt) et une **mesure ponctuelle** de 45 secondes. | Section **« Contrat de service »** au canevas, avec **deux champs séparés qui ne peuvent pas se confondre** : *objectif visé* (SLO) et *engagement opposable*. Le second n'est acceptable **qu'accompagné de la mesure d'infrastructure qui l'autorise** — nombre d'instances, redondance de zone, existence d'un emplacement de bascule. Et deux champs distincts pour le rétablissement : *cible* et *dernière mesure, avec sa date et son périmètre*. **Un engagement opposable sans la mesure qui le porte est une promesse, pas un engagement** — et c'est le lecteur sécurité qui le découvre, au pire moment. |
| RA-35 | majeur | générique | **Les squelettes de dossier posent une classe qu'ils ne stylent pas : les deux documents produits échouaient leur propre oracle depuis leur production.** Mesuré le 24/08 : la classe `ch-apprend` est employée sur **11 paragraphes du DEX et 8 du DAT**, et **aucune règle CSS ne la vise** dans l'un ni dans l'autre. `check_html` rend `FAIL` sur la règle **L21** — *« composant déclaré sans style »* — sur les deux fichiers **du 23/08**, donc avant toute modification de ma part. Le chapeau de chapitre se rendait comme un paragraphe ordinaire, sans que rien ne le signale à l'écran. C'est la **deuxième fois** que ces mêmes squelettes livrent un défaut que seule la production d'un vrai document révèle : deux défauts de mise en page avaient déjà été trouvés le 23/08 de la même manière. | Deux gestes. **(1)** Le squelette embarque le style de **tout** composant qu'il pose — une classe sans règle est un composant annoncé qui n'existe pas. **(2)** Surtout : **le squelette passe son propre oracle avant publication**, sur une instance de démonstration remplie. Un squelette qui n'a jamais été instancié n'a jamais été éprouvé — c'est le même mécanisme que le travail planifié jamais déclenché (RA-28 du 23/08), appliqué aux gabarits. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'audience de l'application n'est pas restreinte : 3 128 comptes invités admis | **Non corrigée**, et volontairement : le geste correctif — créer un groupe, l'attribuer, **puis** basculer `appRoleAssignmentRequired` — coupe l'accès à tout le monde si l'ordre est inversé, et il manque la seule donnée qui le débloque, la population autorisée. Écrit dans la fiche et en tête du tableau des risques | **oui**, et c'est RA-33 | La correction locale appartient au propriétaire métier. Ce qui remonte est le **canevas qui ne pose pas la question** |
| Le DEX recopiait la topologie déjà portée par le DAT | Le schéma sort du DEX, remplacé par un renvoi | non | Arbitrage éditorial propre à ce couple de documents. Les deux revues le signalaient déjà ; aucune règle ne manque |
| Les commandes du DEX nommaient un environnement en dur alors que le dossier en couvre deux | Matrice de cinq variables par environnement ; plus aucun nom d'environnement dans une commande | **peut-être** | Le gabarit de dossier d'exploitation gagnerait une consigne explicite — *un dossier qui couvre N environnements n'écrit aucune commande nommant l'un d'eux*. Non remonté en candidature : un seul cas observé, la portée n'est pas établie |
| La rétention des images était formulée « tant que le registre les conserve » | Règle mesurable : au moins 5 empreintes et 90 jours, propriétaire nommé, avec la contrainte qui la rend manuelle — le niveau Basic n'offre pas la purge automatique | non | Défaut de rédaction locale, pas de canevas |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - IAC - Fiche Sécurité Mise à disposition - Dev - 20260824b.html` | `gd-fiche-securite` · **aucune version portée par le document** — le gabarit est `porte_ailleurs`, dans `digit-ai-forge-audit/deliverables/templates/`, et l'instance n'inscrit ni son identifiant ni sa version en en-tête | **Le champ d'audience effective** (RA-33) et **toute la section contrat de service** (RA-34). Manque aussi une consigne sur les affirmations d'absence : la fiche écrivait « Logs sans PII » sans dire **pourquoi** ils en sont dépourvus — mesuré ensuite : par **absence de collecte**, aucun paramétrage de diagnostic n'existant sur le service. Une absence obtenue par non-collecte cache un second défaut, l'absence de trace d'accès | Le propriétaire métier a posé **cinq questions** et relevé **huit points** sur un document que le canevas déclarait complet. Trois de ses cinq questions portaient sur des informations qu'aucun champ du canevas ne réclame | Section contrat de service, tableau des risques résiduels avec acceptation, trois scénarios de compromission distincts, bloc de journalisation avec finalité / accès / rétention, et cinq rôles nommés là où le canevas n'en demande qu'un | **générique** — les quatre valent pour toute fiche de la famille |
| `Client-A - DAT - … - 20260824a.html` et `Client-A - DEX - … - 20260824a.html` | `gd-dossier-architecture` et `gd-dossier-exploitation` · **1.0.2** tous deux | Le **style du composant `ch-apprend`** (RA-35). Manque aussi une frontière écrite entre les deux familles : les deux revues ont relevé la même duplication de topologie, chacune de son côté | Les deux revues notent le **minimalisme à 4/10 et 6/10**, et attribuent la longueur à trois blocs de **doctrine de gabarit** livrés dans les documents : en-tête « à renseigner », « sections optionnelles », « contrat de personnalisation ». Le lecteur les a identifiés comme ne lui étant pas destinés | Retrait de ces trois blocs — **4 746 octets sur le DAT, 4 630 sur le DEX** — et ajout au DAT d'une règle de répartition écrite : architecture stable ici, inventaire dans son fichier, preuves datées dans la réponse à l'audit | **générique** — un gabarit livré ne doit pas contenir son mode d'emploi |

## Confirmations positives

- **La règle L21 a fait exactement son travail.** Elle a trouvé un composant sans style que ni la
  relecture humaine ni l'oracle de rendu ne pouvaient voir — le rendu était visuellement plausible.
  C'est le pendant utile de TF-0551 : là où un oracle de rendu est aveugle à ce qui manque, un
  oracle de marquage voit l'intention non honorée.
- **La discipline de mesure avant correction a payé trois fois.** Sur treize remarques de revue,
  chaque fait contesté a été re-mesuré avant d'être corrigé. Deux se sont révélées justes et
  périmées, une troisième — les 10 contrôles annoncés contre 9 écrits — l'était dans les **deux**
  documents à la fois. Aucun fait n'a été corrigé sur la foi de la remarque seule.
- **La règle 5 a de nouveau joué** : trois documents ont pris un nouvel indice daté le même jour
  plutôt qu'un écrasement, et l'indice précédent reste lisible avec son défaut.

## Ordre recommandé

1. **RA-33** — c'est le seul retour de ce lot dont l'absence a laissé passer un **écart de sécurité
   réel**, à travers trois dispositifs de contrôle successifs. Un champ obligatoire, et le trou se
   ferme pour toutes les fiches de la famille.
2. **RA-34** — deux champs à ajouter, qui empêchent une promesse non tenable d'entrer dans un
   document que le lecteur sécurité tient pour engageant.
3. **RA-35** — mécanique et peu coûteux, mais il vaut pour tous les squelettes : *un gabarit qui
   n'a jamais été instancié n'a jamais été éprouvé*.
