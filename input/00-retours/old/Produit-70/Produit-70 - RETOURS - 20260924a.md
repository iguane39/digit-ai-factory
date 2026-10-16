---
origine: session Produit-70
destinataire: méthode / factory — à capitaliser pour toute session future qui produit ou
  juge plusieurs documents dérivés d'une même source
classe: controle-vrai-sur-le-mauvais-invariant
statut: retour à ingérer, aucune action Databricks associée
---

> **Note de réception du pilot, 24/09/2026.** Ce lot est arrivé hors canal : remis par l'humain à
> la racine d'`input\`, sans sidecar et hors gabarit (`gabarits\RETOURS-FORGES.md`). Trois
> gestes de réception, le reste du texte est celui du producteur.
>
> - **Date** : le producteur l'a nommé `20260925a` et écrit « le lendemain (25/09) » ; le
>   fichier a été écrit le 24/09/2026 à 11h59 selon l'horloge du poste qui l'a reçu. Il est
>   réindexé `20260924a`, parce qu'un nom daté d'un jour à venir n'ordonne rien. Le texte garde
>   ses dates.
> - **Personne nommée** : le prénom et le nom de la personne qui a mené le contrôle croisé sont
>   remplacés par « un relecteur humain », parce qu'aucune table de pseudonymisation ne couvre les
>   personnes.
> - **Sidecar** : écrit à la réception par la session du pilot, avec une candidature dans la
>   classe que le lot déclare lui-même, `controle-vrai-sur-le-mauvais-invariant`.
>
> Les sections « Remarques restées au produit » et « Retours sur les documents produits » manquent :
> le lot entre par dérogation motivée, consignée à l'ingestion. L'original reçu est gardé hors de
> tout dépôt, sous `c:\dev\_sauvegardes\lots-recus-20260924\`.

# Retour — déclarer « cohérent » sans vérifier l'invariant qui compte

## Ce qui s'est passé

À la question « tous les documents de proposition sont-ils cohérents entre eux ? », la
session a répondu par un contrôle **syntaxique** : grep des noms d'objets clés
(`owner_consolidation_grp`, `fact_lease_receivable`, `dim_asset_strategy`...) à travers les
fichiers, vérification qu'ils s'écrivent pareil partout. Un vrai écart a été trouvé et corrigé
ce tour-là (une table pviz entière absente du mapping). Le tour a été conclu par « tout est
maintenant aligné ».

Un contrôle croisé mené par un relecteur humain le lendemain (25/09) a montré que non : six écarts
supplémentaires vivaient dans les mêmes documents, dont deux étaient des **contradictions
internes à une seule ligne** — une ligne se trouvait dans la table « à réutiliser » alors que
son propre texte disait « pas à réutiliser » ; une autre affichait un nom de colonne Gold
alors que sa cellule Silver disait « source introuvable », rendant fausse l'affirmation
« 0 colonne inventée » portée en en-tête du même document. Aucun de ces six écarts n'aurait
été vu par le contrôle syntaxique déjà joué — les noms concernés étaient orthographiés
correctement partout, le défaut n'était pas dans l'écriture d'un nom mais dans la **cohérence
entre une classification et le contenu qui la justifie**.

## Cause racine

Le contrôle a vérifié un invariant vrai (« les noms d'objets s'écrivent pareil partout ») mais
ce n'était pas l'invariant qui comptait pour répondre à la question posée (« ces documents
peuvent-ils se contredire eux-mêmes ou entre eux sur le fond »). Trois sous-causes précises :

1. **Statut vs contenu, jamais recroisés.** Rien ne vérifiait qu'une ligne classée dans une
   section (« à réutiliser », statut `REUTILISER`...) ne contenait pas, dans son propre texte
   ou sa propre cellule, une affirmation contraire.
2. **Comptes en prose, jamais recalculés.** Des chiffres écrits à la main dans une phrase
   (« 9 notions », « 0 colonne inventée ») n'étaient jamais recomptés depuis la table qu'ils
   résument — ils se sont figés à une version antérieure pendant que la table changeait sous
   eux au fil des tours d'édition.
3. **Deux niveaux de granularité, aucune règle de préséance énoncée.** Un registre par notion
   (`LIGNAGE.md`) et un mapping par colonne (le HTML) décrivaient le même domaine à deux
   finesses différentes, sans qu'aucun des deux ne dise explicitement lequel fait foi en cas
   de désaccord — un désaccord pouvait donc survivre indéfiniment sans être détecté comme tel.

## Ce qu'un contrôle de cohérence documentaire doit vérifier, au minimum

Avant de répondre « cohérent » sur un ensemble de documents dérivés d'une même source, jouer
ces trois vérifications — un grep de noms ne suffit pas :

1. **Contradiction intra-ligne** : pour chaque ligne classée par un statut, chercher dans son
   propre texte les mots qui contrediraient ce statut (« pas réutiliser », « recalculer »,
   « DAX », « à tracer »...) — une ligne qui se contredit elle-même est le signal le moins
   cher à détecter et le plus révélateur.
2. **Compte recalculé, jamais recopié** : tout chiffre énoncé en prose ou en en-tête (« N
   lignes », « 0 colonne inventée », « 9 notions ») doit être recompté depuis la table qu'il
   résume au moment du contrôle, pas relu depuis la dernière fois qu'il a été écrit juste.
3. **Préséance déclarée entre documents de granularité différente** : si deux documents
   décrivent le même objet à deux finesses différentes, l'un des deux doit dire explicitement
   lequel fait foi en cas de désaccord — sinon un désaccord entre eux ne se détecte jamais
   comme une anomalie, seulement comme deux vérités qui coexistent.

## Preuve

Six écarts trouvés en une seule relecture ciblée sur ces trois points, dans un ensemble de
5 documents déjà déclaré « cohérent » un tour plus tôt sur la seule base d'un grep de noms —
voir l'échange du 24→25/09/2026 sur `Produit-70` : `LIGNAGE.md`, la proposition
Bronze/Silver/Gold du 23/09, la Feuille de Route du 24/09 et le mapping colonne par colonne
portaient chacun au moins un des trois défauts ci-dessus.
