# Retours forges — l'écart déclaré qui remplaçait la solution disponible — 20260901a

Lot de retours du produit *Produit-02*, remis le 01/09/2026 sur demande de
l'exploitant. Il porte **un seul retour**, à deux volets : un mécanisme d'agent — la
déclaration d'écart employée comme sortie de moindre effort alors que le système possédait
déjà la solution — et le patron réutilisable qui en est sorti, pour toute forge qui doit
planifier une tâche en heure locale sur un planificateur qui ne connaît que l'UTC. Le patron
est éprouvé : appliqué le jour même, couvert par douze cas de test dont les quatre instants
de bascule d'heure à la minute près.

## Contrôle de complétude

Le ledger du produit porte, depuis la remise du lot précédent (20260831b, seq 55 et 60,
seq 58 acheminée par le canal des candidatures), **une** entrée `type: retour` : la seq 65.
Ce lot en porte la candidature. Un retour, un acheminement : rien n'est perdu.

## Le retour — la gestion des heures

**Destinataire : digit-ai-factory · gravité : majeur · ledger seq 65.**

### Les faits, datés du 01/09/2026

L'exploitant demande « un relevé tous les lundis matins à 6 h ». L'agent règle un cron UTC
unique et **déclare l'écart** — 6 h à Paris l'été, 5 h l'hiver — avec une justification
chiffrée : viser l'heure locale exacte « exigerait deux crons et un test d'heure locale »,
présenté comme un coût dissuasif. Or le produit portait **déjà** la mécanique exacte de la
solution : un battement quotidien et un script de décision, construits la veille précisément
pour que la cadence soit une donnée et non du cron. Une question d'une ligne de l'exploitant
— « tu ne peux pas traiter à l'heure de Paris systématiquement ? » — a suffi. La solution
complète a coûté une demi-heure, douze cas de test compris.

### Le mécanisme d'agent

La déclaration d'écart est une pratique saine — un écart tu est pire qu'un écart déclaré.
Mais ici elle a servi de **sortie de moindre effort** : l'agent a chiffré le coût de la
solution sans le comparer au coût de l'écart sur sa durée de vie, et sans vérifier si le
système contenait déjà le mécanisme qui la rendait triviale. Il le contenait. La
justification écrite avait la forme de la rigueur — un coût nommé, un arbitrage posé — et le
fond d'un renoncement.

**Règle proposée, mécanique** : toute déclaration d'écart répond à deux questions avant
d'être écrite — le système contient-il déjà le mécanisme qui fermerait l'écart ? le coût
estimé de la fermeture est-il supérieur au coût de l'écart sur sa durée de vie ? Un écart
qui se ferme en moins de temps qu'il n'en faut pour le documenter n'est pas un écart :
c'est une solution refusée. **Non éprouvé** : la règle est formulée pour être jouée à la
relecture de tout livrable portant une section d'écarts ; elle ne l'a pas encore été.

### Le patron réutilisable — planifier en heure locale sur un planificateur UTC

Le principe qui gouverne tout le reste : **une consigne humaine en heure locale ne se
traduit jamais en une heure UTC unique** — l'UTC est un détail d'implémentation, et un
détail d'implémentation ne remonte pas dans le contrat. Le patron appliqué :

- **deux battements UTC encadrent l'heure locale visée** (ici 04:00 et 05:00 UTC pour 6 h
  de Paris) ;
- **un filtre calcule l'heure locale au moment de l'exécution** et ne laisse passer que le
  battement d'après l'heure visée — l'autre se saute en le disant ;
- **la règle européenne des changements d'heure est codée en dur** (fixe depuis 1996 :
  été du dernier dimanche de mars au dernier dimanche d'octobre, bascules à 01:00 UTC).
  Motif : la base de fuseaux n'est pas garantie présente sur tous les postes où le script
  se joue, et un contrôle qui échoue sur une dépendance d'environnement juge
  l'environnement, pas la règle. Le point unique à changer si l'Union abolit le changement
  d'heure est **nommé dans la fonction** ;
- **un battement retardé par le planificateur passe quand même** — mieux vaut un relevé à
  8 h qu'aucun ;
- **l'idempotence absorbe le doublon** : si les deux battements passent le même jour, la
  règle d'ajout seul de la série refuse le second ;
- **le déclenchement manuel ignore le filtre** — on relève à l'heure où on le demande.

**Jeu d'essai livré avec le patron** : douze cas, dont les quatre instants de bascule à la
minute près (une minute avant le dernier dimanche de mars à 01:00 UTC : encore l'hiver ; à
01:00 UTC : l'été commence — et symétriquement en octobre). **Éprouvé** : 26/26 au vert en
local et en intégration continue, production revérifiée le jour même.

## Remarques restées au produit

Une remarque examinée pour généralisation, et son verdict.

- **Le choix des heures d'encadrement (04:00 et 05:00 UTC) est propre à Paris** et à la
  cible de 6 h. Généralisable : **non** en valeurs, **oui** en méthode — c'est précisément
  ce que le patron ci-dessus sépare : les deux battements sont un paramètre, le filtre et
  la règle sont le mécanisme.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit `gd-…`** dans ce cycle — les pièces touchées
sont un workflow, un script de décision et un oracle, jugés par les contrôles du produit
(26/26) et la chaîne d'intégration continue, verte de bout en bout.

## Ce que ce lot ne couvre pas, et c'est dit

- **La règle des deux questions n'est pas éprouvée** — elle attend d'être jouée à la
  relecture d'un livrable portant une section d'écarts ; le patron horaire, lui, l'est.
- **Le patron ne couvre que la règle européenne** : un produit visant une heure locale
  hors de l'Union (heure d'été décalée, ou absente) devra porter sa propre règle — le
  patron dit où elle se loge, pas ce qu'elle contient.
- **Le coût du mécanisme d'agent sur les lots antérieurs n'est pas audité** : d'autres
  écarts déclarés de ce produit pourraient être des solutions refusées ; personne n'a
  rejoué la règle des deux questions sur l'existant.
