---
date: AAAA-MM-JJ
source: aucune séance à la naissance du fichier ; chaque séance porte sa propre source dans le tableau
verifie_le: AAAA-MM-JJ
---

# Calendrier des séances

Toute séance datée que ce produit prépare s'inscrit ici dès que sa date est connue : formation, atelier, comité,
soutenance, démonstration, séminaire. Le hook d'ouverture lit ce fichier. De J-5 à J-0, il nomme la revue de préparation de
chaque séance, ses 5 points et la commande qui la joue. Une séance passée, ou à plus de 5 jours, ne dit rien. Règle :
R-67 de `REGLES-PROJET.md` du pilot, décision D-193 (a) du 10/11/2026.

Les dates de remise et les appels d'offres n'entrent pas ici : ils gardent leur propre suivi.

## Séances

| Date | Séance | Pour qui | Documents | Revue de préparation | Source |
|---|---|---|---|---|---|
| *(aucune)* | — | — | — | — | — |

## Forme d'une ligne

- **Date** : le jour de la séance, au format AAAA-MM-JJ ; une heure peut suivre (`2026-11-13 09:00`).
- **Séance** : ce qui se tient, en quelques mots.
- **Pour qui** : le client ou le public.
- **Documents** : les pièces remises pour la séance, ou leur dossier, en chemins relatifs à la racine du produit, entre
  accents graves. La revue juge leurs engagements.
- **Revue de préparation** : `à faire`, puis `faite le AAAA-MM-JJ` une fois la revue jouée et ses relevés corrigés.
- **Source** : d'où vient la date, par exemple la convention signée, le courriel du client ou la décision consignée au
  ledger avec son seq.

Une ligne mal formée est dite à l'ouverture et à l'écriture de ce fichier : sa séance n'est pas lue, et sa revue ne serait
pas rappelée. La clé `verifie_le` de l'en-tête prend la date de chaque relecture des dates.
