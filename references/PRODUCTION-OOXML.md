# Production d'un document OOXML depuis une référence client — relevé de charte et gates

Référence chargée à la demande depuis le noyau. Elle existe parce qu'un livrable `.pptx` a été
ENTIÈREMENT REFAIT après le verdict de son destinataire — « ne respecte pas DU TOUT la charte du
document fourni en entrée » — et qu'un second a été refusé à l'ouverture par PowerPoint
(TF-0686, TF-0687, TF-0688, lots Produit-11 des 27-28/08/2026). Les trois défauts avaient la
même racine : produire AVANT d'avoir relevé, et remettre AVANT d'avoir contrôlé.

## Le relevé de charte : trois gestes, AVANT d'écrire une ligne (TF-0687)

Quand un document de référence est fourni, la charte se RELÈVE — elle ne se déduit jamais. Le
cas payé : l'identité visuelle avait été déduite d'un histogramme des couleurs du XML des
diapositives, or la couverture de la référence était un DÉGRADÉ VERT porté par une IMAGE
(`ppt/media/image1.png`) — aucun comptage de couleurs de XML ne peut la voir. Le livrable est
sorti BLEU, c'est-à-dire avec la mauvaise couleur de marque en couverture.

1. **Inventaire de `ppt/media/`** — dimensions et couleurs dominantes de chaque média : c'est
   LÀ que vit l'identité. La référence du cas réel offrait 11 médias, dont 9 icônes 256×256
   monochromes directement réemployables, et personne ne les a vus.
2. **Extraction COMPLÈTE, jamais tronquée**, de la géométrie et de la typographie d'une
   diapositive de contenu, run par run. Le cas payé : la géométrie relevée sur une liste de
   formes tronquée aux 14 premières a donné des cartes de 4-6 cm là où la référence en porte
   de 9,83 × 11,23 cm au pas de 10,44 — mesurable au centième de centimètre, si on lit tout.
3. **Réemploi des ressources de la référence** plutôt que réinvention — médias, grille,
   polices : ce que le client a fourni est ce que le client attend.

**Corollaire, à lire quand une page paraît vide** : une page creuse est un SYMPTÔME de grille
mal relevée, pas un espace à combler. Le premier réflexe du cas réel a été de rattraper le
creux par des rustines verticales — c'était la cause qu'il fallait corriger, pas l'effet.

## Le contrôle d'ordre des enfants : bloquant AVANT remise (TF-0686)

Un paquet OOXML généré peut être invalide sans que RIEN ne le signale à la génération :
python-pptx écrit un arbre hors schéma sans un mot, `unzip -t` déclare l'archive saine, et
seul PowerPoint chez le client découvre le défaut — en proposant une réparation qui perd du
formatage en silence.

```
python scripts/verifier-ooxml.py <fichier.pptx|docx|xlsx>
```

Exit 0/1/2 ; verdict JSON ; les parties et éléments fautifs sont nommés. Tout producteur de
`.pptx`/`.docx`/`.xlsx` le joue en gate bloquante après génération et avant remise — un
générateur Python l'appelle par `subprocess` et s'arrête sur son code de retour, exactement
comme le produit du cas réel appelle déjà `oracles/verifier-pdf.mjs`. Le contrôle couvre
`a:ln`, `a:rPr` et `a:defRPr` — la classe payée — et déclare ce qu'il ne couvre pas.

## La destination et le nom : réglés ailleurs, rappelés ici

Deux règles voisines complètent la chaîne, chacune chez elle : la destination — `input\` en
LECTURE SEULE pour tout producteur, le livrable va sous `output\` dans le sous-dossier
existant (TF-0688, règle 1 de `REGLES-PROJET.md`) — et l'indice du nom de sortie, alloué par
`scripts/allouer-indice.mjs` (TF-0691) au lieu d'une constante dans le générateur.
