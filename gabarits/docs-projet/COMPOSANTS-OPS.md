---
role: composants déployés — vue consolidée depuis forge-ops et le dossier MEP (R-20)
destinataire: humain
sources_de_verite: ["ops.mjs etat <cible>", "forge/etapes/mep/DOSSIER-MEP.md", "plan forge-ops (O-5)"]
verifie_le: {AAAA-MM-JJ}
environnements: [locale, staging, production]
---

# Composants Ops — {Produit}

> Actualisé à CHAQUE étape MEP depuis `ops.mjs etat` + le plan forge-ops.
> Instanciations datées. Sur dépôt public : valeurs d'infra réelles en placeholders,
> l'instanciation vit dans le dossier MEP du run.

## Hiérarchie (depuis la racine)

*L'arborescence des composants déployés, du plus englobant au plus fin. Elle se lit de haut en bas : chaque niveau contient le suivant, et un composant absent d'ici est un composant que personne ne sait retrouver.*

```
{produit}
├── {front}            — type: {statique|SPA} · id: {<ID_COMPOSANT>}
├── {api}              — type: {service HTTP} · id: {<ID_COMPOSANT>}
│   └── {bdd}          — type: {PostgreSQL managé} · id: {<ID_COMPOSANT>}
└── {taches}           — type: {worker} · id: {<ID_COMPOSANT>}
```

## Inventaire par environnement

*Le même parc, vu par environnement plutôt que par hiérarchie. Cette vue sert à répondre à « qu'est-ce qui tourne en production ? » — une question que l'arborescence ci-dessus ne tranche pas.*

| Composant | Type | Environnement | ID | URL | IP | Vérifié le |
|---|---|---|---|---|---|---|
| {api} | {service} | staging | {<ID>} | {<URL_STAGING>} | {<IP|n/a>} | {AAAA-MM-JJ} |
| {api} | {service} | production | {<ID>} | {<URL_PROD>} | {<IP|n/a>} | {AAAA-MM-JJ} |

## Cible d'exploitation forge-ops

*Où ce produit se déploie, et avec quel plan. Une seule ligne par cible : c'est elle que l'étape MEP lit pour savoir à quoi elle s'adresse.*

| Cible | Plan (O-5) | Dernière release | Journal |
|---|---|---|---|
| {locale|railway|gcp|azure|aws} | {plan-<cible>.json — PASS} | {release} | {n événements} |

---

## Infrastructure déclarée

*Ce qui a été posé HORS du dépôt, et que rien ne revérifie sans cette table.*

**Le fait qui l'exige (TF-0651, 26/08/2026).** Sur un produit en production, quatre domaines, les
zones et règles d'un frontal, les enregistrements DNS, les certificats et les comptes de mesure
avaient été posés **par appels d'API depuis une session** — sans aucun artefact, et sans
revérification. Si un enregistrement change demain, rien ne le voit.

**Et le parc portait déjà la sonde.** `oracles\oracle-domaines-declares.mjs` (D1-D4) confronte au
réel les URL déclarées ; il existe depuis le 24/08, il est juste, et il **n'avait rien à lire**.
*Le chaînon manquant était la déclaration, pas la sonde.* Un contrôle sans donnée déclarée ne rend
pas un défaut : il rend un silence.

| Élément | Valeur | Posé comment | Revérifié le |
|---|---|---|---|
| domaine / hostname | {exemple.fr, www.exemple.fr} | {console fournisseur · appel d'API · IaC} | {AAAA-MM-JJ} |
| zone / règles du frontal | {nom de zone, règles de redirection} | {…} | {AAAA-MM-JJ} |
| enregistrements DNS | {A, CNAME, TXT — et où ils vivent} | {…} | {AAAA-MM-JJ} |
| certificats | {émetteur, hostnames couverts, échéance} | {…} | {AAAA-MM-JJ} |
| comptes de mesure | {propriété analytique, console de recherche} | {…} | {AAAA-MM-JJ} |

**La colonne « Posé comment » n'est pas décorative** : une infrastructure posée à la console ne se
reconstruit pas, une infrastructure posée par API se rejoue. La colonne « Revérifié le » distingue
une déclaration éprouvée d'une déclaration plausible — c'est le même champ, et la même raison, que
`verifie_le` des fiches du socle.

**Cette section se déclare même VIDE.** « Aucune infrastructure posée hors dépôt » est une réponse
**complète** : la loi n° 3 demande que l'absence se déclare, elle n'exige pas qu'il y ait quelque
chose à déclarer. Le silence, lui, est indiscernable d'un oubli.

---

## Environnements de données

<!-- SECTION OBLIGATOIRE depuis le 24/08/2026 (TF-0594, retour Produit-10). Vérifiée par
     `oracle-conformite-projet` (R-20) dès le premier `verifie_le` postérieur au 24/08 : avant,
     c'est la règle qui a bougé, pas le produit.

     POURQUOI ELLE EXISTE. Ce fichier ne portait que les composants DÉPLOYÉS. Un produit
     d'analyse qui ne déploie RIEN mais interroge PLUSIEURS entrepôts n'avait donc, en toute
     conformité, qu'à y écrire « aucun composant déployé » — et c'est ce qu'un produit a fait
     pendant onze jours, en une ligne, avec pour seule trace un identifiant d'hôte nu dans un
     tableau de dépendance externe. Le 24/08, l'humain donne un nom de workspace ; ce nom ne se
     rapproche d'AUCUN élément du dépôt ; la réponse rendue est FAUSSE, et le reproche tombe :
     « si tu ne sais déjà pas de quoi on parle, forcément tu ne peux pas aller très loin. »
     Le fichier qui aurait dû porter ce rapprochement existait, était conforme, et vide de
     l'information.

     AUCUN ENVIRONNEMENT DE DONNÉES ? Écrire « aucun environnement de données interrogé » et
     pourquoi. La section se déclare même vide — jamais par silence (loi n° 3). -->

**Écriture** : {jamais — ce projet lit seulement | oui, et voici où}. Si la lecture seule est
une garantie, dire CE QUI la tient (un garde dans l'outil de mesure, un droit de connexion),
pas seulement l'intention.

### {W-1} — {rôle de cet environnement}, joint par le profil `{profil}`

*Une fiche par environnement réellement JOINT. Elle sert à rapprocher un nom entendu — dans une
phrase d'humain, dans un message d'erreur — de quelque chose qui existe dans le dépôt ; c'est le
rapprochement dont l'absence a produit une réponse fausse le 24/08.*

| Attribut | Valeur |
|---|---|
| **Nom d'affichage** | {<NOM_TEL_QU_AFFICHÉ_PAR_LA_CONSOLE>} — et **comment on le sait** : mesuré, donné par un humain, ou corroboré sans être certifié |
| Hôte | {<URL_HÔTE>} |
| Identifiant | {<ID_WORKSPACE_OU_PROJET>} |
| Metastore / catalogue racine | {<ID_METASTORE>} |
| Profil de connexion | {profil} — un nom de profil est un **alias local**, jamais une identité : deux postes nomment différemment la même instance |
| Entrepôt / moteur employé | {<ID_ENTREPÔT>} |
| Compte utilisé | {<COMPTE>} |
| Mesures de référence | {ids des mesures qui établissent ces valeurs} |

**Catalogues, et à quel titre** — le *mode d'accès* est la colonne qui compte : un catalogue
visible et jamais ouvert n'est pas un catalogue utilisé, et le confondre avec un catalogue lu
fausse toute revue de périmètre.

| Catalogue | Schémas lus | Ce qu'on y lit | Mode d'accès |
|---|---|---|---|
| {catalogue} | {schémas} | {tables, ce qu'elles portent} | {lu / écrit / jamais ouvert} |

### {W-3} — {environnement} connu par **documents interposés** uniquement

**Jamais atteint.** Tout ce qu'on en sait vient de documents déposés — donc tout chiffre qui en
vient est *lu dans un document produit ailleurs*, jamais une mesure de ce projet.

| Attribut | Valeur | Comment on le sait |
|---|---|---|
| Hôte, identifiant | **inconnus** | jamais joints |
| {catalogue cité} | {valeur} | {document qui le porte, et sa PÉREMPTION s'il en a une} |

| Document qui en porte la connaissance | Date | Périmé ? |
|---|---|---|
| {input\<fichier>} | {AAAA-MM-JJ} | {non / oui — et sur quel point} |

## Comment retrouver un environnement à partir d'un fragment de nom

À écrire dès qu'il existe plus d'un environnement joignable, parce que le cas se présente et
qu'il a déjà produit une réponse fausse :

1. **Chercher le fragment dans ce fichier**, tableau par tableau — c'est ce qu'il existe pour.
2. Si le fragment ressemble à un suffixe d'environnement (`_D2`, `_P1`, `_H1`…), **ne pas le
   chercher dans les noms de catalogues** : le nommage d'un environnement et celui de ses
   catalogues sont **INDÉPENDANTS**. Un workspace `…_D2` peut parfaitement héberger des
   catalogues `…_d1`, et deux environnements d'un même groupe portent les mêmes noms de
   catalogues **par construction**. Une recherche par nom qui ne trouve rien établit que LE NOM
   cherché n'existe pas — jamais que la CHOSE cherchée n'existe pas.
3. Lister les profils de connexion du poste, et pour chacun lire l'hôte dans sa configuration.
4. Ce que les droits du compte ne permettent PAS de lire se déclare ici, avec la commande
   essayée et sa réponse — un « inconnu » sourcé vaut mieux qu'un rapprochement deviné.
5. Le rapprochement établi se **consigne ici**, avec sa preuve.
