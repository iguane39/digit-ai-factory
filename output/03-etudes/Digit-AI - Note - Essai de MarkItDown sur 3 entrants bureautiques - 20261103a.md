# Digit-AI - Note : essai de MarkItDown sur 3 entrants bureautiques

> Provenance : agent `redacteur` (Sonnet), essai de la décision D-155 (a) du 03/11/2026. Destinataire : humain (le porteur).
> Verdict de l'arbitre : `oracle-ecriture` rejoué avant remise, résultat dans la section Contrôles.
> Hypothèses non résolues : le PowerPoint essayé est un gabarit à texte de remplissage, donc ses images et ses graphiques réels ne sont pas jugés ; les temps viennent d'un seul poste, une exécution à froid et une à chaud.

## Ce qui change pour vous

Je recommande de laisser MarkItDown. Il convertit correctement les 3 entrants, mais sur chacun la Factory a déjà un moyen qui donne le même résultat ou un meilleur. Le script `slide_text.py` du skill `pptx` produit le même texte que lui sur le PowerPoint. La commande du skill `docx` donne un résultat équivalent sur le Word, mais `pandoc`, qu'elle exige, n'est pas installé sur ce poste : c'est un trou de la Factory, à traiter sans MarkItDown. Sur l'Excel, MarkItDown tient en quelques lignes de `pandas`, déjà présent sur le poste. Vous n'avez rien à installer.

## Ce qui a été fait

J'ai installé `markitdown` 0.1.9 (licence MIT, selon la décision D-155) avec les options docx, xlsx et pptx dans un environnement Python jetable, puis converti des copies des 3 entrants désignés par la consigne : un Word de 80 paragraphes, un Excel de 7 onglets et 1 939 lignes, un PowerPoint de 2 diapositives pesant 20,9 Mo. J'ai lu en entier les 3 convertisseurs avant de les lancer et cherché les appels réseau dans le cœur de l'outil : il n'y en a pas pour un fichier local. Les comparaisons portent sur les skills `docx`, `xlsx` et `pptx` de `~\.claude\skills\synced\`, identiques dans les deux jeux synchronisés du poste. L'environnement, les copies et les sorties sont supprimés ; seules les mesures restent dans `mesures.txt`, au dossier jetable de la session.

## Mesures par format

| Format | MarkItDown | Moyen de la Factory | Écart constaté |
|---|---|---|---|
| Word | 1 862 mots, 16 titres, 25 puces, 11 311 caractères, 1,9 s à chaud | `pandoc -t markdown` : mêmes 1 862 mots et 16 titres, 12 155 octets, 0,12 s | Aucun sur le texte. Pandoc coupe à 72 colonnes et ajoute 80 antislash. |
| Excel | 107 933 caractères, 1 958 lignes, 7 sections, 2,6 s à chaud | `openpyxl` : 0,27 s de chargement, formules et formats lisibles | Les 7 onglets et 1 939 lignes sont rendus ; seules les cellules de type date diffèrent du source. |
| PowerPoint | 800 caractères, 86 mots, 1,4 s à chaud | `slide_text.py` : 793 caractères, 86 mots, 0,3 s | Texte identique ligne à ligne, hors lignes vides et images. |

Sources : `mesures.txt` (lignes 10 à 28), produit par `run_conv.py`, `docx_struct.py`, `xlsx_baseline.py` et `xlsx_parity.py` du même dossier. Estimation en jetons, à raison d'un jeton pour 4 caractères : environ 2 800 pour le Word, 27 000 pour l'Excel, 200 pour le PowerPoint. L'Excel pèse 6 % de plus que son équivalent CSV (101 425 caractères).

## Ce qui se perd

Word : les 63 sauts de ligne du document deviennent de simples retours à la ligne, qui se confondent avec le paragraphe dans un rendu Markdown strict. Pandoc les garde sous forme d'antislash. Ni l'un ni l'autre ne perd de titre.

Excel : 535 des 1 930 valeurs de la colonne Position sont déjà des dates dans le fichier, au format jour.mois ; une position comme 19.4 a été lue comme le 19 avril par le tableur qui a produit l'export. MarkItDown les écrit sous la forme année-mois-jour 00:00:00 et supprime le format. Openpyxl les lit aussi comme des dates, mais son champ `number_format` permet de retrouver 19.4. La perte vient du fichier, pas de l'outil, et elle touche 28 % de la colonne.

PowerPoint : les 10 images du gabarit (20,9 Mo) ne sont lues par aucun des deux outils. Ils donnent le nom ou le texte alternatif, qui est vide ici. Le rendu des diapositives en image demande LibreOffice, absent du poste.

Hors des 3 entrants, j'ai joué un Word synthétique avec un tableau. Là, MarkItDown se trompe : l'en-tête est vide, les deux cellules fusionnées sont mises bout à bout dans la première, et une barre verticale dans une cellule crée une quatrième colonne. Pandoc rend un tableau de grille fidèle. Sur un PowerPoint synthétique avec tableau, graphique et notes, les deux sorties sont équivalentes.

## Coût et fragilité

L'installation a pris 1 min 46 s et 31 paquets, pour un environnement de 260 Mo hors l'outil de comparaison. Le premier import à froid a pris 23,7 s. Sur ce poste, une règle de contrôle d'application a bloqué le module natif de `pandas` 3.1.0, que MarkItDown tire : 3 imports sur 3 ont échoué, et l'Excel n'a été converti qu'après avoir fixé `pandas` 3.0.3, version déjà présente dans le Python système. Une installation dont l'import échoue sur ce poste demande un contournement à chaque mise à jour.

## Verdict : laisser

La raison tient en un constat : sur les 3 formats, MarkItDown ne rend aucun service qu'un moyen déjà disponible ne rende. Le skill `xlsx` le cite lui-même comme coup d'œil rapide, mais il l'indique préinstallé dans son bac à sable, ce qu'il n'est pas ici. Deux suites ne demandent pas votre décision. Le skill `docx` lit un Word avec `pandoc`, absent du poste : je propose de remonter ce trou au registre. La lecture des dates d'un export Excel mérite une ligne dans les consignes de lecture d'entrants.

## Contrôles

`node oracles\oracle-ecriture.mjs` sur cette note : verdict PASS, 972 mots, 68 phrases dont 5 de plus de 35 mots (seuil d'échec non atteint), 0 avertissement après réécriture du paragraphe d'ouverture (EC-5 avait relevé trois phrases de suite ouvrant sur « pour »). EC-7, EC-10 et EC-14 rendent SKIP : aucun lexique client, aucun lecteur déclaré en `role_destinataire`, aucun écrit à un tiers.

Limites : un seul poste, un seul jeu de 3 entrants, dont un PowerPoint sans contenu réel. Si un dossier d'appel d'offres apporte des tableaux Word complexes ou des PowerPoint chargés de graphiques, l'essai se rejoue sur eux avant de conclure autrement.
