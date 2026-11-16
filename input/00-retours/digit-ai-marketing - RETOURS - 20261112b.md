# Retours forges — digit-ai-marketing — 20261112b

- **Contexte** : autre — demande humaine du 12/11/2026 : « Crée une animation vidéo pour le projet digit-ai-queue afin d'expliquer ses concepts, fonctionnements et avantages », premier clip produit par le skill clip-de-presentation 1.0 depuis son versement (TF-2405).
- **Références ledger** : `forge\ledger.jsonl` seq 711 et 712 (entrées `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 1 clip de 66 s construit, 3 planches et 8 images pleine taille relues, oracle-clip et run-oracles-design joués. Ce lot remonte 2 retours, tirés de 2 entrées du ledger, à 1 forge.

---

## skill clip-de-presentation et oracle-clip (`digit-ai-forge-design`)

Le premier clip du skill hors de sa série d'origine bute sur deux étapes que le skill prescrit sans les outiller.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-21 | majeur | produit+générique | **Les jetons que `motion.js` lit n'existent pas dans le dossier de marque Digit-AI, et la bibliothèque retombe sans bruit sur sa palette neutre.** Faits : `motion.js` lit `--fond`, `--texte`, `--texte-faible`, `--trait`, `--accent`, `--accent-2`, `--texte-succes`, `--texte-alerte`, `--texte-erreur` (`scripts/motion.js:65-66`) ; le `donnees/marque/tokens.css` du produit, produit par systeme-de-marque en mode digit-ai, porte les noms du socle HTML (`--bg`, `--ink`, `--muted`, `--line`, `--blue`, `--teal`, `--green`, `--amber`, `--red`) et seuls `--surface` et `--police-*` concordent. Sans pont, `motion.js` garde ses couleurs de repli pour 9 clés sur 10 de `M.C` (`scripts/motion.js:67-68`), et aucune des règles CL1 à CL7 d'`oracle-clip` ne lit les jetons (en-tête d'`oracles/oracle-clip.mjs`). Le pont posé sous `:root[data-theme="dark"]` a fait échouer `run-oracles-design` : `oracle-bascule` B-T1 et B-T3 (palette sombre sans bouton de bascule), `oracle-tokens` T4 (4 jetons définis en sombre seulement). Posé sous `:root` seul, le pont passe (PASS le 12/11/2026). (ledger seq 711) | `motion.js` lit aussi les noms du socle en repli de chaque jeton, ou le skill fournit un pont de variables en gabarit ; `oracle-clip` refuse un clip dont aucun jeton de couleur n'a été lu (`M.C` égal au repli neutre). Classe : `oracle-chemin-prescrit-inoperant-sur-sa-cible`. |
| RA-22 | mineur | générique | **La planche réduit chaque image à 480 px de large : le contrôle « étiquette rendue sous 24 px » qu'elle prescrit ne peut pas s'y lire.** Faits : `scripts/rendre.py:58` redimensionne chaque vignette à 480 px, soit un quart de 1 920 ; une étiquette de 24 px y fait 6 px. La bible demande de lire sur la planche le texte coupé, le chevauchement et l'étiquette rapetissée par le zoom. Pour juger ce clip, j'ai écrit un script d'images pleine taille hors du skill (8 instants relus) ; deux défauts n'étaient visibles qu'à cette taille (orbe sur le titre du ticket A, tampon sur la ligne `suite`). (ledger seq 712) | `rendre.py --plein <dossier>` écrit chaque instant à 1 920 × 1 080, et la bible prescrit 4 images pleine taille au moins à côté des 3 planches. Classe : `oracle-chemin-prescrit-inoperant-sur-sa-cible`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-21 | `grep -c -i -E "clip-de-presentation.*(jeton\|token\|--fond)\|motion\.js.*(jeton\|token)" todo/TODO.jsonl` | 0 | aucun |
| RA-22 | `grep -c -i -E "clip-de-presentation.*planche\|planche.*(480\|vignette\|pleine taille)" todo/TODO.jsonl` | 1 | aucun : TF-1881 parle de planches de photos pour un classement, sans rapport |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le surtitre de l'introduction répète le nom de la marque quand le logo le porte déjà | `surtitre: ''` passé à `M.introduire` | oui, pour tout logo qui contient le nom | gardé au produit : l'option existe déjà dans `motion.js` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-clip` a rendu CL2 à CL7 sans écart avant le rendu, ce qui a permis de rendre le MP4 une seule fois.
- `M.introduire`, `M.carteFin` et la déclaration de marque ont posé logo, titre de fin et lien sans un pixel réglé à la main.

## Ordre recommandé

1. RA-21, parce qu'un clip sans pont sort aux couleurs neutres avec un PASS.
2. RA-22.

## La règle qui aurait évité le retour

RA-21 et RA-22 suivent la construction d'un clip ; aucune règle ne juge les jetons lus ni la taille de lecture des planches, et la colonne « Proposition esquissée » nomme la classe existante `oracle-chemin-prescrit-inoperant-sur-sa-cible`.
