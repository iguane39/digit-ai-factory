# Retours forges — Produit-76 — 20260925a

> **Note de réception du pilot (15/10/2026, R-49)** : ce lot daté du 25/09 a été remis le 15/10 sans classe, exigée depuis le 03/09. Le pilot les attribue : ligne 1 : `couverture-calculee-sur-enumeration-incomplete` (à créer, famille `regle-morte`) ; ligne 2 : `script-de-chaine-sans-controle-statique` (à créer, famille `hook-ou-gate`) ; ligne 3 : `environnement-de-deploiement-sans-verrou` (à créer, famille `contrat-interface-forge`) ; ligne 4 : `convention-de-dossiers-en-collision-avec-le-runtime` (à créer, famille `emplacement-livrable`) ; ligne 5 : `contenu-d-auteur-livre-au-lecteur` (existante) ; ligne 6 : `livrable-sans-identite-de-gabarit` (existante). Le nom de l'auteur de l'audit est retiré du contexte.

- **Contexte** : remédiation de l'audit indépendant du 24/09/2026 (auditeur indépendant, nom retiré à la réception par le pilot, 12 constats VFS-01 à VFS-12) et des restes du registre produit. Deux journées de travail sur la chaîne de livraison, l'authentification et les livrables — dont **quatre défauts introduits par la remédiation elle-même**, qui sont la matière la plus utile de ce lot.
- **Références ledger** : `forge\ledger.jsonl` seq 49, 58–62, 65–67, 76, 80 (entrées `type: retour`, `type: erreur_agent`, `type: correction`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-tests (`digit-ai-forge-tests`)

La mesure de couverture fonctionnelle a compté **2 routes** là où l'application en expose 36. Le défaut n'est pas dans le produit : il tient à une évolution de FastAPI que l'énumération naïve ne traverse pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-9 | majeur | générique | **`app.routes` n'aplatit plus les routeurs inclus.** Sur FastAPI récent, `include_router()` range chaque routeur dans un objet `_IncludedRouter` qui conserve l'original sous `original_router` ; la Ventilation Fournisseur-A en imbrique trois niveaux. *Mesuré le 25/09* : lire `app.routes` sans descendre rend **2 entrées** (un `Mount` et un `_IncludedRouter`) au lieu de 36 routes. Une énumération statique du source ne répare pas le problème : la mienne a elle aussi manqué `/admin/workers/{worker_name}/cancel`, que l'énumération à l'exécution voit. Un verdict de couverture fonctionnelle calculé ainsi est **silencieusement faux** — il ne rate pas quelques routes, il les rate presque toutes, et rend « 100 % » ou « 0 % » sans le dire. | Descendre récursivement dans `original_router` quand l'attribut existe, et **poser un garde-fou** : si l'énumération rend moins de routes qu'un plancher attendu, échouer au lieu de conclure. C'est ce garde-fou qui a révélé le défaut chez nous — sans lui, deux tests de frontière passaient à vide, verts et ne testant rien. |

## pilot (`digit-ai-factory`)

Trois défauts de classe, tous constatés en corrigeant un audit — deux dans le gabarit de chaîne Azure DevOps, un dans l'organisation des dossiers que la factory impose.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-4 | bloquant | générique | **Les scripts embarqués dans la chaîne ne sont vérifiés par rien.** `azure-pipelines.yml` porte 18 scripts, plusieurs centaines de lignes de bash qui pilotent un déploiement ; le lint du gabarit porte sur le code applicatif, jamais sur eux. *Mesuré le 25/09* : l'exécution 15155 a déployé correctement — AcrPull, coffre, empreinte, `/health`, `/ready`, bascule de sonde — puis est morte sur un `fi` en double, reste d'un remplacement de bloc. Le déploiement était bon, la chaîne rouge, et **rien dans le dépôt n'aurait pu le dire avant de l'exécuter**. Un script de chaîne ne se vérifie pas en le lançant : à ce moment-là, il a déjà déployé. | Ajouter à l'étage des contrôles du gabarit une porte qui extrait chaque script du YAML, neutralise les macros `$(nom)` — bash y verrait une substitution de commande — et les passe à `bash -n`. Implémentation de référence chez nous : `tools\verifier-scripts-chaine.py`, 18 scripts analysés en une seconde. **Limite connue à écrire dans le gabarit** : `bash -n` ne voit pas les défauts de comportement. Le même jour, `[ -z "$VAR" ] && affectation` sous `set -e` rendait non-zéro dès la deuxième itération et tuait le script — syntaxe valide, comportement faux. |
| RV-5 | majeur | générique | **Un environnement Azure DevOps créé sans verrou laisse deux livraisons se défaire l'une l'autre.** *Mesuré le 25/09* : les exécutions 15164 (déclenchement automatique) et 15165 (manuelle) ont visé `vfs-dev` à 18 secondes d'écart. Chacune a construit son image et pointé l'App Service ; le contrôle d'empreinte de la seconde a vu l'image de la première, a déclenché son retour arrière — et a **défait un déploiement sain**. L'exécution 15164 est restée **verte alors que son code n'était plus en service**. Une chaîne qui mesure son propre travail ne mesure pas l'état de l'environnement. | Deux gestes, dans cet ordre : au gabarit d'infrastructure, créer l'environnement **avec** un contrôle « Exclusive Lock » ; au gabarit de chaîne, `lockBehavior: sequential` sur l'étage de déploiement — il reste sans effet tant que le contrôle n'existe pas. À défaut de droit sur l'environnement (notre cas : 403 *You do not have permissions to update checks on this resource*), un **contrôle d'état final** à la fin de l'étage : relire l'image réellement configurée et refuser de déclarer verte une livraison qui n'est plus en service. |
| RV-6 | majeur | générique | **L'organisation de fichiers imposée par la factory entre en collision avec le runtime applicatif.** La règle D-15 réserve `output\` aux livrables datés. Or une application web qui n'a pas de racine d'exécution explicite écrit sous la racine du dépôt — donc dans `output\`, au milieu des rapports d'audit et des fiches de sécurité. *Constaté chez nous le 25/09* : dépôts de factures, classeurs produits, journaux et base d'administration cohabitaient avec neuf familles de livrables. Le coût s'est manifesté deux fois : un `git add output` distrait committe l'historique de traitement, et **la purge de conservation RGPD a dû recevoir une liste blanche pour ne pas effacer des mois de livrables** le jour où quelqu'un renseignerait une durée. | Mentionner la collision dans la règle d'organisation, et poser la convention symétrique : `output\` aux livrables, `var\` au runtime. Un produit web instancié depuis un gabarit devrait naître avec une racine d'exécution distincte, pas la découvrir à l'audit. |

**Portée** (R-45, 21/08) : les trois sont *génériques* — aucun ne tient à notre code. Le produit les a corrigés chez lui ET la classe vaut pour tout projet employant les mêmes gabarits.

## forge-audit (`digit-ai-forge-audit` / kit d'audit et gabarits de livrables)

Un défaut mécanique, de la famille exacte que l'en-tête d'`oracle-lot.mjs` décrit : une règle jugée en code qui réclame une information qu'aucun gabarit n'émet.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RA-3 | majeur | générique | **R-46 exige un couple que les gabarits de livrables ne produisent pas.** La règle demande de reporter « le couple `gabarit` + `version_du_gabarit` que le document porte dans son en-tête », et `oracle-lot.mjs` refuse le lot sans lui (motif : *ne porte ni rattachement d'un retour à son gabarit*). Or *mesuré le 25/09* sur nos deux livrables issus de gabarits — rapport d'audit POC-to-Prod et fiche sécurité — `grep -io "gd-[a-z0-9-]*"` **ne rend rien**, et aucun champ de version de gabarit n'apparaît nulle part. Le produit ne peut donc honorer R-46 qu'en écrivant de mémoire ce que le document aurait dû déclarer, ou en usant de la formule d'absence — qui serait fausse, puisque les documents VIENNENT bien de gabarits. *Une affordance non câblée n'existe pas* : c'est le raisonnement même de TF-0597, appliqué un cran plus haut. | Faire porter au gabarit, dans l'en-tête du document généré, son identifiant `gd-…` et sa version — au même endroit que la date et l'indice. Le lot suivant n'aurait alors plus rien à reconstituer, et la porte du pilot jugerait un fait au lieu d'un souvenir. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La lecture de l'état du consentement Entra confondait l'échec et le résultat vide : `az rest … 2>/dev/null \|\| echo 0`. Fausse alerte à chaque livraison, et un geste d'administrateur recommandé à tort alors que le consentement était accordé. | Trois états au lieu de deux — accordé, absent, **illisible** ; la forme `if SORTIE=$(…); then` garde le code de sortie sans heurter `set -e`. | non | La classe — *un échec déguisé en donnée* — est une règle de conception, pas un défaut de gabarit. Elle est portée par le document d'exigences du porteur (« un repli silencieux est un incident qui ne se déclare pas »). **Trois occurrences dans la même chaîne en deux jours** : coffre, révocation des secrets, consentement. Si une quatrième apparaît ailleurs, la classe méritera une règle câblée plutôt qu'écrite. |
| Le rapport d'audit POC-to-Prod portait deux `<h1>` concurrents — bandeau de marque et titre du document. | Le bandeau rétrogradé en `<div>`, avec les propriétés qu'il héritait pour que le rendu ne bouge pas. Le `<h1>` du titre reste : le script du rapport en extrait le nom du projet. | non | Le socle HTML de la factory juge déjà la structure des titres (`check_html`). Le défaut vient de notre instanciation, pas du gabarit. |
| `/admin/export.csv` déclarait ses bornes de période obligatoires : le framework les validait **avant** le contrôle d'authentification, et un anonyme recevait un 422 nommant les paramètres. | Bornes rendues facultatives dans la signature, vérifiées après l'authentification. Un test de frontière balaie désormais les 36 routes. | non | Défaut d'écriture d'une route, propre au produit. Le contrôle systématique qui l'aurait attrapé est en revanche généralisable — il est remonté sous **RT-9**, dont c'est la condition de possibilité. |
| Le secret client d'Easy Auth était fabriqué à chaque livraison sans révocation : 33 secrets valides un an, dont un seul servait. | Supprimé, pas mieux rangé : l'application ne lit que les en-têtes d'identité, Easy Auth n'a aucun code à échanger. Trois gestes, dont deux non devinables. | non | Le relevé comparatif des dix applications de la souscription montre que **les deux régimes corrects sont déjà en service chez Client-A** — la Bibliothèque Vidéo sans aucun secret, Cockpit IA et Calculatrice par référence au coffre. La leçon appartient au document d'exigences d'entreprise, où elle est inscrite, pas à une forge. |

## Retours sur les documents produits

**Avertissement sur la colonne « Gabarit employé + version » — et c'est le premier retour de cette section.** Les deux documents ci-dessous **ne portent ni identifiant `gd-…` ni `version du gabarit`** dans leur en-tête. La colonne est donc renseignée par ce que nous savons de leur origine, pas par ce que le document déclare. C'est vérifiable : `grep -io "gd-[a-z0-9-]*" <livrable>` ne rend rien sur aucun des deux. Voir **RA-3** ci-dessus : R-46 exige un couple que le gabarit n'émet pas.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Ventilation Fournisseur-A - Rapport d'audit POC-to-Prod - 20260923a.html` | kit d'audit POC-to-Prod (`input\01-kits-audit\`) — **aucune version du gabarit déclarée dans le document** | Le rattachement au gabarit et à sa version, que R-46 réclame et que le document ne porte pas. | *Aucun retour de lecteur reçu à ce jour : rien n'est rapporté ici comme gêne. Les points de cette ligne sont des faits mesurés, pas des ressentis supposés.* | Rien hors gabarit | générique |
| `Ventilation Fournisseur-A - Fiche securite mise a disposition Dev - 20260923a.html` | gabarit fiche sécurité — **aucune version du gabarit déclarée dans le document** | Le **dépouillement du surlignage « à remplir » est confié à un script exécuté au chargement** : `span.placeholder` perd sa classe si son texte ne contient plus de marqueur `{{…}}`. Tout usage qui n'exécute pas le JavaScript — contrôle statique, conversion sans rendu, lecture du source — voit donc du contenu **rempli** habillé en fond ambre et bordure pointillée. *Mesuré le 25/09* : 29 et 36 fragments dans nos deux livrables ; un pré-contrôle local a produit autant de fausses alertes sur ce seul motif avant qu'on en comprenne la cause. | — | Rien : la correction appartient au gabarit | générique |

**Proposition sur le surlignage** : retirer la classe **à la génération**, quand la valeur est écrite, plutôt qu'au chargement de la page. Un document remis ne devrait pas dépendre de l'exécution d'un script pour ne pas paraître inachevé. Le script de dépouillement garderait son utilité pour l'auteur qui remplit le gabarit à la main.

## Confirmations positives

- **Le retour arrière automatique de la chaîne a fonctionné trois fois en conditions réelles** les 24 et 25/09 — jamais éprouvé jusque-là autrement que sur banc. À chaque échec de contrôle post-déploiement, l'image précédente a été remise en service et l'application n'a jamais été indisponible. Le gabarit tient sa promesse.
- **Le gabarit de lot de retours et son oracle** ont évité l'écueil qu'ils décrivent : la section « Remarques restées au produit » a forcé un verdict de généralisation sur quatre corrections qui seraient parties sans trace. Trois se sont révélées non généralisables ; la quatrième est devenue RT-9.

## Ordre recommandé

1. **RV-4** (porte `bash -n`) — coût le plus faible, et il protège tous les produits qui héritent de la chaîne. Un défaut de syntaxe ne devrait jamais se découvrir après un déploiement.
2. **RT-9** (énumération des routes) — le verdict de couverture fonctionnelle est aujourd'hui faux sans le dire, ce qui est pire que pas de verdict.
3. **RV-5** (verrou d'environnement) — une exécution verte dont le résultat n'existe plus est le défaut le plus coûteux du lot, mais sa correction demande un droit d'administrateur d'environnement.
4. **RV-6** (collision `output\`) — documentaire, sans urgence, mais il évite à chaque nouveau produit web de refaire la découverte.
