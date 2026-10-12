# Revue de lecture d'une présentation — la forme

<!-- Gabarit du pilot (gabarits\REVUE-DECK.md). Juge exécutable :
     node gabarits\oracle-revue-deck.mjs <REVUE.md> --captures <dossier des captures>
     Il rend 0 si la forme est tenue, 1 sinon, 2 si le fichier est illisible.
     Fixtures rouge et verte : oracles\fixtures\revue-deck-*.md.
     Origine : retour du 26/09/2026 d'un produit (RP-64) ; tâche TF-1388 ; extension au deck de la
     revue de lecture que `digit-ai-page-html` exige déjà pour une page (TF-0422). -->

Un deck ne se remet pas sans une revue écrite. La relecture « j'ai regardé les captures » ne laisse aucune
trace : le 24/09/2026, vingt captures déclarées relues une à une, et un décalage de 18 px à 1 920 px, visible
sur la dixième, est passé. La revue écrite fixe ce qu'on regarde, capture par capture, et ce qu'on a décidé.

## Où elle vit

Un fichier `REVUE.md` à côté des captures du deck (pour un run : sous `forge\etapes\…`). Le titre porte la date
et l'heure de la lecture, la revue cite chaque capture avec ses dimensions lues dans le fichier, et la
restitution qui remet le deck cite la revue.

## Le fichier

```markdown
# Revue de lecture du deck — <livrable> — AAAA-MM-JJ HH:MM

Lecteur : <qui lit, pour qui le deck est fait>.

| Critère | Verdict | Diapositives et constat | Suite |
|---|---|---|---|
| Alignement des repères | constat | diapo 10 : le titre est décalé de 18 px à 1 920 px | recaler sur la grille, rastériser à nouveau |
| Débordements | conforme | aucun | — |
| Lisibilité à la projection | conforme | corps de 18 pt au minimum | — |
| Même libellé d'une diapositive à l'autre | conforme | aucun | — |
| Typographie aux coupures | non applicable | deck sans texte coupé en fin de ligne | — |

Captures lues :

- diapo-01.png — 1920 × 1080
- diapo-02.png — 1920 × 1080
```

## La grille fermée

Cinq critères, tous présents, dans une première table (le juge lit la première ligne qui nomme chaque critère) :

1. **Alignement des repères** : titres, logos, pieds de page et filets tombent aux mêmes endroits d'une diapositive
   à l'autre. C'est le critère que la relecture du 24/09 ne cherchait pas.
2. **Débordements** : rien ne sort de son encart ni de la diapositive, rien ne se chevauche.
3. **Lisibilité à la projection** : la plus petite police et le contraste restent lisibles à distance.
4. **Même libellé d'une diapositive à l'autre** : un même objet porte le même nom partout.
5. **Typographie aux coupures** : pas de mot isolé en fin de ligne, pas de coupure au milieu d'une expression.

Chaque ligne porte un verdict : **conforme**, **constat** ou **non applicable**. Un constat nomme la diapositive
et la suite décidée. Un « non applicable » dit pourquoi. Une revue sans aucun constat le dit à la fin :
« aucun constat, captures lues le <date> ».

## Ce que la revue n'est pas

Pas un oracle de rendu : elle juge ce qu'un oracle ne voit pas. Pas une preuve de lecture : le juge exécutable
vérifie qu'elle est datée, complète et qu'elle cite chaque capture avec ses vraies dimensions, pas que
quelqu'un a regardé.
