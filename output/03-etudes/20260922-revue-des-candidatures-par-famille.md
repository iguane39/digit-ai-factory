---
role: revue complète des candidatures ouvertes du registre d'améliorations, groupées par famille de défaut — décision humaine D-4 (b) du 22/09/2026 ; livrable arbitrable au chapitre 8 (ce qu'il faut décider, et dans quel ordre)
sources_de_verite: [todo/TODO.jsonl (état au 2026-09-22T10:18Z), todo/CLASSES.json v1.18.0, todo/oracle-todo.mjs (règles R13 et R15, seuil du cliquet 2026-09-16), references/TODO-FORGE.md, todo/RECIDIVES.md, oracles/oracle-amorcage-poste.mjs, oracles/oracle-chemin-prescrit.mjs]
verifie_le: 2026-09-22
---

# Revue des candidatures du registre, par famille de défaut

Décision humaine **D-4 (b)** du 22/09/2026 : revue complète, par famille, des candidatures que le
registre tient ouvertes. Le relevé porte sur l'état du registre au 22/09 à 10:18 UTC, après
l'ingestion des 6 lots du jour et les 6 candidatures nées de constats en passant — dont 3 trouvées
en exécutant les décisions de ce tour.

## 1. Ce que la revue trouve, en une phrase

Le retard du registre n'est pas un problème de volume : c'est un problème de **porteurs**. Sur
72 candidatures ouvertes, **39 appartiennent à une classe dont le juge n'existe pas** — son champ
`oracle` vaut « à créer » ou reste vide — et **38 sont marquées récidive**. Pendant la même
quinzaine, 150 items ont été clos. Le débit n'est donc pas en cause ; ce qui s'accumule, c'est ce
que rien ne garde.

## 2. Les chiffres du relevé

Ce que le registre porte à l'instant du relevé, et comment ces nombres se lisent : la valeur est
le score du registre, gain × preuve ÷ effort ; un porteur exécutable est un contrôle qui existe,
par opposition à un champ `oracle` qui annonce « à créer ».

| Mesure | Valeur |
|---|---|
| candidatures ouvertes | 72 |
| dont la classe n'a **aucun porteur exécutable** | 39, soit 54 % |
| dont **aucune classe** n'est déclarée | 8 |
| **marquées récidive** d'une classe déjà close | 38, soit 53 % |
| dont le score est resté **par défaut**, donc non arbitré | 2 |
| plus ancienne | 13 jours (09/09) |
| âge médian | 6 jours |
| valeur cumulée | 616,9 |
| items clos en `corrige` au registre, pour comparer | 421 |
| clôtures depuis le 15/09, contre 40 candidatures encore ouvertes nées dans la même fenêtre | 150 |

**L'âge médian de 6 jours est le chiffre qui tranche.** Ce n'est pas un arriéré ancien qu'on
aurait laissé dormir : c'est un flux qui arrive plus vite que les porteurs ne se créent. Un
arriéré ancien se rattrape par une campagne ; un flux se traite en changeant ce qui le produit.

## 3. Les familles, par nombre de candidatures

Où les 72 candidatures se rangent, et ce que chaque groupe pèse. La colonne « sans porteur »
compte celles dont la classe n'a aucun contrôle exécutable — c'est elle qui porte la conclusion.

| Famille | Candidatures | Valeur | Sans porteur | Ce que la famille désigne |
|---|---|---|---|---|
| `regle-morte` | 22 | 156,0 | 10 | un contrôle qui rend PASS sur ce qu'il existe pour refuser, ou un verdict qui n'est plus prononçable |
| `skill-ou-oracle-non-invoque` | 17 | 147,6 | 13 | un skill, un oracle ou un contrôle existant non joué, ou remplacé par un contrôle maison |
| _(sans classe)_ | 8 | 103,0 | 8 | rien : ces candidatures n'ont pas de famille, donc aucune lecture par famille ne les voit |
| `contrat-interface-forge` | 7 | 55,0 | 4 | un contrat entre deux forges dont une moitié n'existe pas, ou dont le chemin prescrit n'atteint pas sa cible |
| `gabarit-document` | 5 | 20,3 | 3 | un gabarit de document dont le rendu ou l'identité ne sont pas jugés |
| `hook-ou-gate` | 4 | 42,5 | 1 | une porte qui laisse passer, ou un constat qu'aucun lecteur ne rencontre |
| `anonymisation` | 3 | 46,5 | 1 | un nom réel qui sort dans un dépôt ou un registre |
| `page-html-socle` | 2 | 8,0 | 1 | une page hors socle : charte, contraste, lisibilité |
| `affordance-ui` | 1 | 25,0 | 0 | une affordance non câblée, un état vide muet |
| `heritage-produit` | 1 | 9,0 | 0 | un artefact du pilot absent ou divergent chez un produit |
| `versionnement-livrable` | 1 | 3,0 | 1 | un livrable écrasé, ou sans indice ni version datée |
| `emplacement-livrable` | 1 | 1,0 | 0 | un livrable rangé au mauvais endroit |

**Deux familles portent 39 des 72 candidatures**, soit 54 %, et 303 des 616,9 points de valeur.
Les deux disent la même chose sous deux angles : un contrôle qui ne contrôle pas. `regle-morte`
rend un verdict faux ; `skill-ou-oracle-non-invoque` ne rend aucun verdict parce que personne ne
le joue. *Le registre n'accumule pas des défauts de produit : il accumule des défauts de juges.*

## 4. Le levier : les classes qui reviennent, et celles dont le juge manque

Les dix classes les plus fréquentes chez les candidatures ouvertes. La colonne de droite dit si la
classe nomme un contrôle qui existe — une classe sans porteur garantit la récidive, puisque le
producteur ne rencontre la règle nulle part sur son chemin.

| Classe | Candidatures | Son juge existe ? |
|---|---|---|
| `regle-ecrite-sans-oracle-qui-la-joue` | 9 | **non** |
| _(sans classe)_ | 8 | sans objet — il n'y a pas de classe |
| `oracle-faux-positif` | 7 | oui |
| `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` | 5 | **non** |
| `fixture-jugee-par-son-seul-oracle` | 4 | oui |
| `controle-vrai-sur-le-mauvais-invariant` | 4 | **non** |
| `contrat-de-sortie-sans-domicile` | 3 | oui |
| `regle-qui-interdit-son-propre-remede` | 2 | **non** |
| `recette-verdict-non-prononcable` | 2 | oui |
| `anonymisation-portee-partielle` | 2 | oui |

**La classe la plus fréquente est « une règle est écrite et aucun oracle ne la joue », et cette
classe n'a elle-même pas d'oracle.** Neuf candidatures la portent. C'est la récursion au cœur du
retard : le dispositif sait nommer ce défaut, il ne sait pas le mesurer, donc il le recompte
chaque semaine sans jamais le voir baisser.

Le cliquet R15 du registre l'a déjà arrêté pour l'avenir — depuis le 16/09, une classe **créée**
doit nommer un contrôle qui existe, sinon elle ne se crée pas. Les deux classes nées ce jour l'ont
payé : elles ont exigé qu'on écrive leurs 2 oracles avant d'entrer. Mais le cliquet ne rattrape
pas les 28 classes antérieures, et ce sont elles qui portent les 39 candidatures sans juge.

## 5. Les 8 candidatures sans classe, et pourquoi elles sont le trou le plus coûteux

Huit candidatures, 103 points de valeur — le troisième groupe par la valeur — ne portent **aucune
classe**. Conséquences enchaînées, toutes mesurables :

- aucune lecture par famille ne les voit, y compris cette revue, qui a dû leur faire un groupe ;
- le compteur de récidives ne peut pas les compter, puisqu'il compte par classe ;
- le tableau de bord des récidives ne les affiche pas ;
- et les deux plus fortes, à 25 points chacune, décrivent des contrôles qui rendent aujourd'hui un
  verdict faux : un oracle qui annonce son verdict sur un périmètre de mesure réduit sans le dire,
  et une surveillance qui déplace sa propre référence à chaque exécution, si bien que la rejouer
  efface la dérive qu'elle devait montrer.

**La cause est une asymétrie de la porte.** Un retour qui arrive par un LOT est refusé sans classe
— `ingerer-lot.mjs` le refuse en nommant les clés proches, et c'est ainsi que les 2 classes du jour
sont nées. Un item créé par le pilot lui-même, par `journaliser.mjs`, passe sans classe : la règle
R13 refuse une classe **hors référentiel**, jamais une classe **absente**. Les 8 sont donc toutes
des constats en passant du pilot, et le pilot est le seul producteur exempté de la règle qu'il
impose aux autres.

## 6. Où vivent ces candidatures

Quel dépôt chaque candidature nomme comme cible. Une candidature peut en nommer plusieurs, donc
le total dépasse 72 ; ce qui se lit ici est la concentration, pas une répartition.

| Cible nommée | Candidatures |
|---|---|
| `digit-ai-factory` (et son alias `factory`) | 44 |
| `digit-ai-forge-agents` | 11 |
| `digit-ai-forge-audit` | 6 |
| `digit-ai-forge-tests` | 6 |
| `digit-ai-forge-design` | 6 |
| `digit-ai-page-html` | 4 |
| `digit-ai-forge-observability` | 2 |
| `digit-ai-forge-websec` | 2 |
| `digit-ai-forge-ops`, `digit-ai-forge-data`, `digit-ai-forge-organization` | 1 chacune |

**44 des 72 visent le pilot lui-même**, soit 61 %. Une candidature sur cinq seulement concerne une
forge de production. C'est cohérent avec la lecture des familles : ce qui s'accumule est de
l'outillage de jugement, et l'outillage de jugement vit au pilot.

## 7. Ce que cette revue ne dit pas

- **Elle ne juge pas la JUSTESSE d'une classe déclarée.** Le producteur déclare, le registre
  compte ; une classe mal choisie fausse ce groupement sans qu'aucun contrôle le voie. C'est la
  limite que la règle R13 déclare elle-même.
- **Elle ne juge pas les scores.** La valeur est gain × preuve ÷ effort, et les trois facteurs sont
  déclarés par qui crée l'item. Deux d'entre eux portent encore un score par défaut, donc non
  arbitré : leur valeur de 1,0 ne veut rien dire.
- **Elle ne mesure pas le coût réel de chaque correction**, seulement l'effort déclaré sur trois
  crans. Un effort « 1 » couvre aussi bien une fenêtre de motif à élargir de 6 caractères qu'un
  oracle à écrire avec ses fixtures.
- **Elle ne dit pas si les 38 récidives sont la même récidive**. Le lien `recidive_de` pointe les
  clôtures fondatrices, pas les occurrences entre elles ; deux candidatures peuvent récidiver la
  même correction sans que rien ne les rapproche.

## 8. Ce qu'il faut décider, et dans quel ordre

Trois décisions, ordonnées par ce qu'elles suppriment à la source plutôt que par leur valeur
cumulée.

**Première décision — fermer l'asymétrie de la porte.** Que `journaliser.mjs` exige une classe sur
toute création, comme `ingerer-lot.mjs` l'exige d'un lot, avec la même sortie pour le défaut
vraiment neuf : la clé réservée `classe-a-creer` plus une proposition de classe. Coût : simple ×
court, un contrôle à ajouter à une règle qui existe. Effet : les 8 candidatures sans classe
rejoignent une famille, le compteur de récidives les voit, et le pilot cesse d'être exempté de la
règle qu'il impose. C'est la seule des trois qui empêche le trou de se recreuser.

**Deuxième décision — écrire les porteurs des 4 classes qui portent 20 candidatures.**
`regle-ecrite-sans-oracle-qui-la-joue` (9), `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`
(5), `controle-vrai-sur-le-mauvais-invariant` (4) et `regle-qui-interdit-son-propre-remede` (2)
n'ont aucun juge. Écrire 4 oracles, chacun avec sa paire de fixtures, met sous contrôle 20 des
72 candidatures — et surtout empêche leurs récidives, qui sont la moitié du flux. Coût : moyen ×
moyen, et il est connu — les 2 oracles écrits ce jour ont demandé chacun une demi-journée
d'agent, bancs et calibrages compris, dont 3 faux positifs mesurés pour l'un et 5 pour l'autre.

**Troisième décision — arbitrer les 10 candidatures de valeur 15 ou plus, une par une.** Ce sont
celles qui décrivent un contrôle rendant un verdict faux aujourd'hui : un périmètre de mesure
réduit annoncé sans le dire, une surveillance qui efface sa propre dérive, une collision de numéro
sur le socle des pages, deux outils du pilot qui écrivent chez le pilot quand on les lance depuis
un produit, un journal de run qui accepte une entrée vide. Coût : simple × court pour la décision,
variable pour l'exécution. Effet : les verdicts faux cessent de l'être.

**Ce qui reste après ces trois décisions** : 42 candidatures de valeur inférieure à 15, dont l'âge
médian est de 6 jours. Elles se traitent au fil, et le registre les tient sans coût. *Un registre
n'a pas à être vide ; il a à être lisible, et à ne pas recompter chaque semaine le même défaut.*
