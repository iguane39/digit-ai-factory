# Marque — MiniVeille

<!-- Produit par le skill systeme-de-marque (mode dégradé), run 20260804-miniveille.
     Entrées : CADRAGE-DESIGN.md, PRODUIT-TEST.md. Mode : client (MiniVeille est le
     produit final, pas un livrable maison Digit-AI — la charte Digit-AI ne s'applique
     pas ici). Aucune contrainte de marque reprise : produit neuf. -->

## Fiche de marque

| Champ | Valeur |
|---|---|
| Mode | client |
| Secteur | Veille informationnelle, gestion des liens de veille |
| Cible | Consultant indépendant, usage quotidien, seul utilisateur (mono-utilisateur) |
| Ton | Encre, papier, atelier |
| Anti-références | Palette IA violet→bleu ou accent néon sur fond sombre : signature visuelle de générateur, pas de choix ; crème + serif + terracotta pris tel quel : cliché de la matière « papier » sans y ajouter rien de spécifique à ce produit |
| Contraintes reprises | Aucune (produit neuf) |
| Thème par défaut | Clair — usage de bureau, en journée, pendant la veille active ; le sombre reste disponible en un geste (préférence système ou bascule manuelle) |
| Hypothèses | Palette et typographie proposées librement faute de charte existante ; le mono-utilisateur autorise un ton direct, sans vouvoiement de façade |

## Système visuel

### Palette — « Encre et cuivre »

Reprise telle quelle du corpus (`PA04`, hue OKLCH 25, source
[CSS Color 4](https://www.w3.org/TR/css-color-4/#ok-lab)), retenue pour ce brief
parce qu'elle porte littéralement les deux premiers mots du ton : un neutre chaud
qui lit comme du papier (`--fond`, `--surface`), un accent cuivré qui lit comme un
outil d'atelier plutôt qu'une couleur de marque abstraite (`--accent`). La même
teinte (hue 25) irrigue tous les tokens, y compris les traits et les textes — c'est
ce qui fait tenir la palette ensemble plutôt qu'un empilement de gris et d'un
accent posé à côté.

| Token | Clair | Sombre | Rôle |
|---|---|---|---|
| `--fond` | `oklch(0.96 0.010 25)` | `oklch(0.15 0.014 25)` | fond de page, papier |
| `--surface` | `oklch(0.93 0.014 25)` | `oklch(0.20 0.018 25)` | cartes, champs, table |
| `--trait` | `oklch(0.85 0.018 25)` | `oklch(0.31 0.022 25)` | séparateurs, bordures |
| `--texte` | `oklch(0.20 0.022 25)` | `oklch(0.94 0.010 25)` | texte courant, encre |
| `--texte-faible` | `oklch(0.44 0.022 25)` | `oklch(0.74 0.018 25)` | métadonnées, légendes |
| `--accent` | `oklch(0.51 0.150 25)` | `oklch(0.71 0.140 25)` | action primaire, focus, filtre actif |

Explicitement écarté : tout dégradé violet→bleu ou accent saturé sur fond sombre
(signature reconnaissable des interfaces générées, listée en anti-référence) ; le
noir et le blanc purs (chroma ≥ 0.010 partout, y compris aux extrêmes de
luminosité, pour rester sous le seuil qui rend un neutre criard).

### Typographie — trois rôles, stacks système

Aucune police distante : la page témoin doit fonctionner sans réseau, donc pas de
Google Fonts chargée en `<link>`, seulement des stacks système. Le corpus proposait
un appariement éditorial payant (Bespoke Serif / Chivo Mono, `TY16`, ton « signé,
éditorial, haut de gamme ») cohérent avec l'esprit recherché mais indisponible hors
ligne sans licence embarquée ; retenue à la place l'intention qu'il porte —
un titrage serif à caractère plutôt qu'un sans-serif neutre — traduite en stack
système équivalente.

| Rôle | Stack | Pourquoi |
|---|---|---|
| `--police-titre` | `Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, serif` | un serif de labeur, presque une police d'imprimerie, pour les titres — l'« encre » |
| `--police-corps` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif` | un sans-serif système neutre pour le texte courant et l'interface — l'« atelier », l'outil qu'on utilise vite, pas qu'on contemple |
| `--police-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace` | URLs, dates, compteurs : la liste de liens affiche des données, un troisième rôle est nécessaire |

### Échelle et espacement

Échelle typographique en ratio constant ×1.25 (`--texte-xs` à `--texte-2xl`).
Espacement sur la base 4 px (`--espace-xs` à `--espace-2xl`), noms sémantiques,
jamais de valeur en pixels en dehors des tokens. Rayons volontairement inégaux
(`--rayon-sm` 2 px, `--rayon-md` 6 px, `--rayon-lg` 12 px) : un coin légèrement
adouci, jamais la même courbe partout, pour éviter le rectangle arrondi générique.

## Registre

Vouvoiement neutre à l'écrit (formulaires, erreurs) mais impératif direct sur les
actions (« Enregistrer », pas « Vous pouvez enregistrer »). Phrases courtes : le
job principal se fait en moins de dix secondes, la voix ne doit jamais ralentir ce
geste. Mono-utilisateur assumé : jamais de politesse de façade (« bienvenue »,
« nous vous remercions »), l'outil s'adresse à quelqu'un qui l'utilise déjà, pas à
quelqu'un qu'il faut convaincre.

## Vocabulaire

| On dit | On ne dit pas | Pourquoi |
|---|---|---|
| lien | ressource, contenu | c'est le mot du brief et de l'usage — un lien de veille, pas un objet abstrait |
| tag | étiquette, catégorie | le mot que le consultant tape déjà dans ses outils habituels |
| marquer lu | archiver, clôturer | décrit l'action exacte, pas une métaphore de gestion documentaire |
| enregistrer | sauvegarder, capturer | un seul verbe pour l'action d'ajout, du bouton au message de confirmation |

## Actions

Un seul libellé par action, inchangé du bouton à la confirmation :
« Enregistrer » produit un lien enregistré — jamais « Ajouter » sur le bouton puis
« créé » dans la liste. « Marquer lu » produit un lien au statut « Lu » — jamais
« Terminer » puis « Archivé ».

## Erreurs

Ce qui s'est passé, puis comment le réparer. Jamais d'excuse, jamais de vague.
Exemple type : « Ajoute au moins un tag pour retrouver ce lien plus tard. » —
pas « Une erreur est survenue » ni « Champ requis ».

## États vides

Une invitation à agir, jamais un constat de vide.
Exemple type : « Aucun lien enregistré pour l'instant. Colle une adresse pour
commencer ta veille. »

## Anti-références

- Toute palette IA violet→bleu ou accent néon sur fond sombre : signature
  reconnaissable des interfaces générées, à l'opposé d'un outil d'atelier assumé.
- « Crème + serif + terracotta » pris sans discrimination : c'est le réflexe par
  défaut de la matière papier, pas un choix pour ce produit — d'où l'accent cuivré
  plutôt que terracotta, et une seule police serif réservée aux titres.
- Tout registre commercial ou d'onboarding (bienvenue, essai gratuit, témoignages) :
  MiniVeille est un outil personnel mono-utilisateur, pas un produit à vendre à
  l'écran.
