---
destinataire: humain
role: proposition de principe d'analyse critique des sorties automatisées (tri, classement, rangement, rédaction), à valider par le porteur avant toute remontée à la Factory
sources_de_verite: [critique du 14/10/2026 des pages avant / après et des réponses contextualisées de six propriétaires, output/06-dossiers-dropbox/Produit-12 - Spec - Regles de rangement et de reponse - 20261014a.md]
date: 2026-10-14
---

# Principe d'analyse critique des sorties automatisées — proposition du 14/10/2026

Ce document propose à la Factory une règle qui manque à ses forges : une sortie qui trie, classe, range ou rédige à la place d'un humain ne se juge ni sur la part de ce qu'elle a traité, ni sur sa conformité à ses propres règles. Il est soumis au porteur avant tout envoi ; rien n'a été remonté.

## 1. Le principe

Ce chapitre énonce la règle en une phrase, puis dit d'où elle vient.

**Une sortie automatisée qui trie, classe, range ou rédige se juge sur un échantillon étiqueté par le métier et sur les conséquences de ses erreurs, jamais sur son taux d'affectation ni sur sa conformité aux règles qu'elle s'est données.**

Le constat qui la fonde vient d'un produit de la Factory, le 14/10/2026. Six pages de rangement affichaient de 97 à 98 % de fichiers « rangés », et leurs portes d'invariants étaient vertes. Une relecture adverse y a pourtant trouvé des pièces d'identité dans des dossiers de photos, des actes de procédure rangés en quittances et des doublons rangés deux fois. Sur 45 exemples de mails, environ 20 portaient un type faux. Plusieurs brouillons engageaient la signature du cabinet, dont une attestation de loyer dite « signée » sur un montant non fixé. Chaque règle de rédaction était appliquée, et c'est son application littérale qui produisait l'erreur.

## 2. Les règles d'application

Ce chapitre traduit le principe en six règles qu'une forge peut tenir sans outil propre au produit. Mode de lecture : une ligne par règle ; la dernière colonne dit le contrôle qui prouve qu'elle est tenue.

| Règle | Énoncé | Contrôle |
|---|---|---|
| **PC-1** *(principe critique 1 : justesse avant couverture)* | Tout indicateur « part traitée » s'accompagne d'un taux de justesse mesuré sur un échantillon étiqueté hors du système, ou de la mention « justesse non mesurée » | l'indicateur et son taux, ou la mention, figurent côte à côte |
| **PC-2** *(échantillon indépendant)* | Les exemples qui servent à juger une classification ne sont jamais choisis par cette classification | la méthode de tirage est écrite et n'utilise pas la sortie jugée |
| **PC-3** *(lecture par conséquence)* | Chaque sortie est relue sous l'angle « appliquée ou envoyée telle quelle, qu'est-ce qui casse et pour qui », avec une gravité ; la plus forte bloque la remise | une gravité est notée pour chaque sortie relue |
| **PC-4** *(recoupement des sources)* | Toute entité déduite (une personne, une date, un rattachement) se recoupe avec une seconde source disponible ; une contradiction est présentée en anomalie, jamais tranchée en silence | liste des entités sans seconde source, et des contradictions |
| **PC-5** *(règle tenue ≠ règle juste)* | Une règle de traitement s'évalue par ses cas d'échec ; elle porte sa condition de non-application | chaque règle a au moins un cas où elle ne s'applique pas, testé |
| **PC-6** *(compteurs recalculés)* | Tout chiffre de synthèse se recalcule par script depuis la table qu'il résume | 0 écart entre la synthèse et la table |

## 3. Les tests de niveau

Ce chapitre vérifie que le principe n'est ni trop restrictif ni trop général. Il passe trois tests ; chacun est prouvé par des faits du 14/10 ou par des domaines nommés.

**(a) Il aurait détecté au moins cinq défauts majeurs.** Il en détecte sept classes :
- les types de mails faux, par PC-1 et PC-2 ;
- les pièces sensibles mal rangées, par PC-1 et PC-3 ;
- les dossiers « à dater » alors qu'une pièce datait l'entrée, par PC-4 ;
- les brouillons qui engagent le cabinet, par PC-3 ;
- les règles de rédaction appliquées contre le bon sens, par PC-5 ;
- les compteurs d'en-tête faux, par PC-6 ;
- les locataires connus des mails sans dossier, par PC-4.

**(b) Il s'applique tel quel à au moins deux autres domaines de la Factory.**
- Le **tri des anomalies** d'une campagne de tests : un taux de cas « classés » ne dit pas qu'ils le sont bien (PC-1, PC-2).
- Le **rapprochement et le dédoublonnage de données** : une fusion se juge sur un échantillon de paires vérifiées, et une entité fusionnée se recoupe avec une seconde source (PC-1, PC-4).
- La **génération de documents** (propositions commerciales, restitutions, brouillons) : un texte conforme à son gabarit peut engager son émetteur au-delà des faits (PC-3, PC-5).

**(c) Il ne prescrit aucun outil propre au produit.** Les contrôles se disent en termes d'échantillon, de source, de gravité et de recalcul ; aucun ne nomme un script, un format ou un dossier du produit.

## 4. Où il pourrait vivre dans la Factory

Ce chapitre propose un point d'atterrissage ; le choix revient au pilot. La loi transverse de qualité porte déjà une grille de classes de défaut et un registre d'oracles par domaine. Le principe y trouverait sa place comme domaine « sortie automatisée de tri, de classement ou de rédaction », avec PC-1 à PC-6 pour contrôles et un premier oracle candidat : le recalcul des compteurs d'une page (PC-6), le seul des six déjà exécutable sans le métier.

## 5. Ce que la proposition ne dit pas

Ce chapitre borne la proposition. Elle ne fixe ni la taille d'un échantillon, ni un seuil de justesse : ce sont des choix du métier de chaque produit. Elle ne remplace pas les oracles de forme existants ; elle s'ajoute à eux pour juger le fond. Les chiffres cités au chapitre 1 viennent d'une relecture faite par l'IA et vérifiée par sondage, pas d'un échantillon étiqueté.
