# Retours forges — Produit-11 — 20260914c

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : troisième lot du 14/09. Le `20260914a` portait ce que la refonte de
  `COMPOSANTS-OPS.md` avait révélé, le `20260914b` ce que le nettoyage avait révélé. Celui-ci naît
  d'une **question humaine** posée après le nettoyage : « Est-ce que les composants inutiles ont
  été supprimés sur dev & qualif ainsi que dans les pipelines pour ne pas les créer en prod ? ».
  La réponse était non sur deux volets sur trois, et l'audit qu'elle a déclenché a trouvé un
  composant qui serait bien créé en production sans servir.
- **Références ledger** : `forge\ledger.jsonl` seq 182 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\` — l'original reste ici (historique du produit).
- **Statut** : **remis le 2026-09-14** — les deux fichiers déposés dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\`, ignoré par git (protocole TF-0981 du 08/09).
  Empreintes SHA-256 au moment du dépôt, vérifiées identiques entre l'original et la copie ;
  elles figurent à l'entrée `seq 183` du ledger. L'ingestion appartient au pilot
  (`accueillir-lot.mjs` puis `ingerer-lot.mjs`), pas à ce produit.

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "forge\retours\Produit-11 - RETOURS - 20260914c.md"
> ```

**Numérotation** : BAV2 tient une séquence `RT-nn`. RT-1 … RT-71 sont consommés au 14/09. Ce lot
continue en **RT-72 … RT-74**.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou
*produit+générique*.

---

## Le fait mesuré, avant toute interprétation

Un nettoyage de composants inutilisés a été mené, restitué, et deux lots de retours en ont été
tirés. Il a fallu **une question humaine** pour découvrir que le geste était incomplet sur deux
volets que personne n'avait pensé à nommer :

| Volet | Traité | Ce que la question a révélé |
|---|---|---|
| Instances de développement | oui | — |
| Instances de qualification | non | non traité, et justifié après vérification seulement |
| Code qui les crée | non | jamais audité, et il porte un défaut qui partira en production |

Le troisième volet est le plus coûteux. Une suppression d'instance sans audit de ce qui la produit
est, au mieux, temporaire, et au pire elle laisse intact un défaut qui se rejouera sur le prochain
environnement. Ici, l'audit du code a montré que les six ressources inutiles supprimées ou
conservées ne partiront pas en production, ce qui est une bonne nouvelle. Mais il a aussi montré
qu'un **autre** composant y partira sans servir : la sonde de disponibilité vise le nom de domaine
de l'origine, alors que la règle réseau de production n'accepte en entrée que le préfixe de service
du frontal. La sonde émet depuis Azure Monitor, donc elle sera refusée, en échec permanent, et
l'alerte de sévérité 1 qu'elle nourrit se déclenchera sans cause réelle.

Ce n'est pas une projection. Le défaut est déjà vivant en qualification, où l'environnement porte
`publicNetworkAccess=Disabled` : la sonde y vise une adresse que personne ne peut ouvrir, et
l'alerte associée s'est déclenchée cette semaine.

---

## pilot (`digit-ai-factory`) et digit-ai-forge-ops

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-72 | majeur | générique | Supprimer un composant inutile **sans auditer ce qui le crée** rend le nettoyage temporaire, et laisse partir le même défaut sur le prochain environnement. Mesure du 14/09/2026 : dix composants ont été traités, cinq supprimés, un journal daté écrit, une restitution rendue et deux lots de retours remis. Aucun de ces artefacts ne portait la question « qu'est-ce qui crée ce composant, et le recréera-t-il ailleurs ? ». Il a fallu une question humaine pour qu'un audit du code soit mené. Cet audit a établi en deux mesures ce que le nettoyage n'avait pas regardé : les 32 variables du pipeline sont toutes employées, aucune n'est morte ; et l'évaluation statique des 43 ressources Terraform contre les trois fichiers de variables montre que les 6 ressources Entra inutiles de développement et de qualification ne sont pas créées en production, leurs deux interrupteurs y valant faux. Le résultat était bon, et **personne n'était allé le vérifier**. La section « inutilisés » que je proposais en RT-65 et RT-69 des lots du jour reste donc incomplète une seconde fois. | Une troisième colonne à la section des inutilisés, et un volet de plus au geste. Colonne : **« créé par quoi »** — pile d'infrastructure avec l'adresse de la ressource, étape de pipeline avec sa ligne, geste manuel, ou tiers nommé. Volet : un nettoyage se clôt sur **trois questions**, pas une — l'instance est-elle supprimée sur **chaque** environnement où elle existe, ce qui la crée est-il traité, et le **prochain** environnement la recréera-t-il ? La règle : *supprimer une instance sans traiter sa source est un nettoyage qui se défait tout seul.* Classe propre proposée : `suppression-sans-traitement-de-la-source`. |
| RT-73 | majeur | générique | **Une sonde de disponibilité qui vise l'origine, et non l'adresse servie, mesure une adresse que personne n'utilise** — et dès qu'un frontal existe, elle alerte en permanence sans cause réelle. Mesure du 14/09/2026 : `infra-tf/monitoring.tf:181` pose `url = "https://${azurerm_container_app.front.ingress[0].fqdn}/"`, le nom de domaine de l'origine. En qualification, l'environnement porte `publicNetworkAccess=Disabled` : cette adresse n'est joignable par personne, la sonde est pourtant `Enabled`, et l'alerte `al-bav2-availability-qualif`, sévérité 1, évaluation toutes les minutes, s'est déclenchée cette semaine. En production, `infra-tf/network.tf:88` n'autorise en entrée que le préfixe de service `AzureFrontDoor.Backend` sur le port 443 : la sonde, qui émet depuis Azure Monitor, sera refusée de la même façon. Le défaut est donc présent sur deux environnements sur trois, et il produit du **bruit de sévérité 1** sur le canal du porteur, ce qui désensibilise au lieu d'informer. | Une variable **adresse servie**, employée par la sonde quand elle est renseignée et par le nom de domaine de l'origine sinon, plus une **précondition qui refuse le plan** quand un frontal est actif et que cette variable est vide. C'est le principe déjà appliqué à la connexion Entra dans le pipeline de ce produit, où une fonctionnalité se déclare au lieu de se déduire d'une variable vide. Règle générale : *une sonde de disponibilité mesure ce que l'utilisateur ouvre, jamais ce que l'infrastructure expose en interne.* Classe retenue : `controle-vrai-sur-le-mauvais-invariant` — la sonde mesure « l'origine répond » quand l'invariant est « le service est joignable par ses utilisateurs ». |
| RT-74 | majeur | générique | **Les ressources qu'une pile LIT sans les créer ne sont déclarées nulle part comme prérequis**, et l'environnement neuf qui en manque échoue à la première commande au lieu d'être arrêté par une garde lisible. Mesure du 14/09/2026 : `infra-tf/*.tf` porte **7 blocs `data`** — groupe de ressources, environnement d'exécution, registre, coffre, base, journaux, télémétrie, identité applicative — que la pile lit et ne crée jamais. Sur les deux environnements existants, c'est la pile d'une **autre application** qui les a créés, et cette dépendance ne figure dans aucun document opposable ni dans aucune garde du pipeline. `az group exists -n CL3_APP_BAV_P1` rend `false` : en production, personne ne les crée, et le premier déploiement échouerait sur la résolution des sources de données. Le pipeline porte pourtant une garde de cible qui vérifie l'existence du **groupe** avant tout étage — elle s'arrête à la coquille et ne regarde aucune des sept ressources qu'elle contiendra. | Déclarer les **prérequis d'environnement** comme un artefact de la pile, au même rang que les variables : la liste des ressources lues sans être créées, qui les possède, et la commande qui vérifie leur présence. Deux usages immédiats : la garde de cible du pipeline les vérifie toutes au lieu du seul groupe, et le document d'ouvrage exécuté du produit les porte comme dépendances externes. *Un bloc de lecture est une dépendance contractuelle ; ne pas l'écrire, c'est découvrir le contrat le jour de la mise en production.* Classe retenue : `surface-implicite-non-livree`. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le registre d'images de qualification porte encore les trois dépôts de la v1, non supprimés | vérifié avant de conclure : quatre charges de la v1 y sont encore en service et les consomment | non | Cohabitation propre à ce produit, pendant le démantèlement de son prédécesseur. Aucune classe : la vérification a fonctionné et a évité la suppression. |
| Le secret périmé du coffre n'a pas d'équivalent à supprimer en qualification | vérifié : la ressource de messagerie existe toujours dans ce groupe, donc le secret n'y est pas orphelin | non | Le contrôle qui a servi ici est celui de RT-69, « ce qui cesse de fonctionner si on supprime », déjà remonté. |
| Le domaine commercial du frontal de production n'est pas tranché, donc la variable d'adresse servie resterait vide | non corrigé : c'est un arbitrage de Design Authority, porté au registre sous RAF-060 | non | Décision produit en attente, pas un défaut de socle. La précondition proposée en RT-73 la rend visible au lieu de la laisser silencieuse. |
| Les treize versions périmées de `TECHNOS.md` signalées la veille ne sont toujours pas corrigées | non corrigé : hors mandat, et la correction exige de revérifier aussi le front | non | La règle R-21 du pilot couvre ce cas et elle est écrite. Dette du produit, pas manque du socle. |

## Retours sur les documents produits

Aucun document n'a été produit depuis un gabarit de la bibliothèque sur ce lot : le tour est un
**audit de code et d'infrastructure**, et son livrable est la réponse rendue à l'humain plus ce
lot. Les trois documents touchés la veille ne l'ont pas été aujourd'hui.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| — aucun document produit depuis un gabarit sur ce lot | — | — | — | — | — |

Un retour de forme demeure, déjà porté aux deux lots précédents et confirmé une troisième fois :
les gabarits de `gabarits\docs-projet\` ne portent **pas de numéro de version** dans leur en-tête,
donc le couple demandé par cette section n'est reportable pour aucun document de ce socle.

## Confirmations positives

- **La garde de cible du pipeline fait ce qu'elle promet.** Elle refuse tout run dont la branche
  n'a pas de bloc de variables, et elle vérifie l'existence du groupe de ressources avant tout
  étage. C'est elle qui empêche aujourd'hui un déploiement de production de partir dans le vide.
- **La séparation des interrupteurs par environnement tient.** Les six ressources Entra inertes de
  développement et de qualification ne partiront pas en production, et la mesure le prouve sans
  qu'aucun geste n'ait été nécessaire.
- **Une question humaine a plus trouvé que deux lots de retours.** Ce n'est pas une confirmation
  agréable, mais c'en est une : le canal de retour fonctionne dans les deux sens, et le lecteur a
  posé la question que la méthode aurait dû poser. C'est exactement ce que RT-72 propose d'outiller.

## Ordre recommandé

1. **RT-73 d'abord.** Le défaut est vivant, mesurable, et sa correction tient en une variable plus
   une précondition. C'est aussi le seul des trois qui produit du bruit d'alerte aujourd'hui.
2. **RT-72 ensuite**, parce qu'il ferme la méthode que les lots `20260914a` et `20260914b` ont
   ouverte, et qu'il est sans valeur séparé d'eux : les trois se lisent comme une seule règle sur
   ce qu'un inventaire de suppression doit porter.
3. **RT-74 enfin**, le plus structurant et le plus long, mais celui qui décide si une mise en
   production peut seulement commencer.

## La règle qui aurait évité le retour (TF-0779)

**Pour RT-72**, aucune règle du socle ne demande, après une suppression, ce qui recréera l'objet
supprimé. La doctrine la plus proche est celle des corrections de code, où l'on exige la classe du
défaut et non le symptôme. Elle n'a jamais été transposée aux gestes d'exploitation, où le symptôme
est l'instance et la classe est ce qui la produit.

**Pour RT-73**, la règle existe dans l'esprit du socle et nulle part dans sa lettre : une sonde
mesure le service rendu. Aucun oracle ne confronte l'adresse d'une sonde à l'adresse servie
déclarée par le produit, alors que les deux sont écrites dans le même dépôt. Cas de figure § 4 de
`quality-oracles`.

**Pour RT-74**, aucune règle ne demande la liste des dépendances externes d'une pile. Le document
d'ouvrage exécuté porte depuis le 26/08 une section pour l'infrastructure posée hors dépôt, ce qui
en est le symétrique exact côté sortie. Ce qui manque est le côté entrée : ce que la pile exige
sans le créer.
