---
role: le carnet des ÉCARTS ASSUMÉS d'un produit — ce qu'il a délibérément écarté, avec son motif et sa date
sources_de_verite: [les lots de travaux reçus du pilot (`input\00-travaux\`), les décisions du produit]
authentification: aucune
verifie_le: 2026-08-26
---

# Écarts assumés — `<produit>`

## Pourquoi ce carnet existe (R-20 bis)

**Le fait, remonté par un produit le 26/08/2026 (TF-0655).** `gabarits\TRAVAUX-PILOT.md` impose
depuis sa création qu'un élément écarté « rejoigne les *Écarts assumés* du carnet du produit avec
son motif et sa date (**R-20 bis**) », et ajoute — justement — qu'« un écart tu est indiscernable
d'un oubli ». Mais **aucun gabarit ne créait ce carnet**, et `R-20 bis` n'était défini nulle part :
la seule occurrence de cette chaîne dans tout l'écosystème était la phrase qui l'invoquait.

**Coût mesuré, et il est du genre qui se multiplie.** Pour déclarer un seul écart, un produit a dû
**déduire** l'emplacement, puis écrire dans le fichier lui-même qu'il l'avait placé par défaut et
qu'il le déplacerait si un emplacement officiel était publié. À l'échelle de l'écosystème, chaque
produit en aurait inventé un autre — et des écarts éparpillés sous des noms différents ne se
relèvent pas. *Une règle de socle exprimable comme un fichier doit être livrée comme un fichier,
jamais comme une phrase dans un document de règles.*

## Ce qu'un écart assumé doit porter, et pourquoi

Un écart = une section `##`. Quatre champs, tous obligatoires — l'omission ne vaut pas décision :

- **`objet`** — ce qui a été écarté, nommé assez précisément pour être retrouvé : l'identifiant du
  travail confié, ou le chemin de l'artefact.
- **`motif`** — pourquoi. *« Pas prioritaire » n'est pas un motif* : un motif dit ce qui serait vrai
  pour que la décision change.
- **`date`** — `AAAA-MM-JJ`. Sans elle, un écart de six mois est indiscernable d'un écart d'hier.
- **`reouverture`** — **ce qui ferait revenir sur cette décision**. C'est le champ qui distingue un
  écart assumé d'un refus définitif, et c'est lui qui rend le carnet relisable dans un an.

## Ce que ce carnet n'est PAS

- **Une liste de tâches.** Ce qui reste à faire vit au carnet de reste-à-faire du produit ; ici ne
  vit que ce qui a été **décidé de ne pas faire**.
- **Un refus opposé au pilot.** Le pilot confie et argumente ; le produit décide. Un écart n'a pas
  à être négocié — il a à être **écrit**, pour que personne ne le redécouvre comme un oubli.

## Écarts

<!-- Un écart par section `##`. Supprimer cette ligne au premier écart écrit. -->

*Aucun écart assumé à ce jour.*
