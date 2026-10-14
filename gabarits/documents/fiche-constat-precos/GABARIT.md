# Gabarit — Fiche constat et préconisations

**Famille** `gd-fiche-constat-precos` · **Version du gabarit** 1.0.0 · **Écrite le** 14/10/2026

> **Formats** Markdown (une page)
> **Règles engagées** D6 D8 D9 D11 (`gabarits\documents\README.md`)
> **Provenance** la fiche remise par `Produit-64` le 12/10/2026 (lot `Produit-64 - RETOURS -
> 20261012d`, RT-36, TF-1640), après que le porteur a dû demander 2 fois un fichier exploitable.
> Son verdict, mot pour mot : « Le fichier MD construit répond bien à la demande "simple, bref,
> lisible & exploitable". » La forme est reprise, jamais la matière : l'instance est fictive.

## La règle qui commande toutes les autres

**Une page pour une équipe qui va agir : chaque constat porte un chiffre, chaque action un gain ou
un effet nommé.** La fiche ne raconte pas la démarche, elle donne ce qui a été vu et ce qu'il faut
faire. *Une fiche qui grossit devient un diagnostic sans en avoir les preuves : au-delà de ses
bornes, le document change de famille.*

## Quand l'employer

Rendre à une équipe technique, qui va agir, le résultat d'une analyse faite en conversation : des
coûts, une panne, une configuration, un écart. Plusieurs actions, chacune chiffrée, une page au plus.

Le livrable se nomme `<Marque> - Constat et precos - <sujet> - AAAAMMJJ<indice>.md` : le type ouvre
le champ `<Objet>` de R-4, sinon `oracle-gabarits-documents` (G8) ne le rattache à aucune famille.
Les deux fiches d'origine nommaient leur sujet d'abord et ne se résolvaient pas.

**Frontière avec `gd-note-synthese-audit`.** Celle-ci porte à un commanditaire NON technique le
résultat d'un audit et UNE décision. La fiche sert une équipe qui exécute plusieurs actions.

**Frontière avec `gd-diagnostic`.** Le diagnostic d'exploitation rend des mesures rejouables, des
causes candidates et un plan de revue, en cinq sections dues : il instruit. La fiche conclut. Quand
la matière dépasse les bornes ci-dessous, ou quand les causes restent à départager, c'est un
diagnostic qu'il faut écrire.

## Structure — les six parties sont dues

| # | Partie | Porte | Ne porte pas |
|---|---|---|---|
| 1 | **En bref** | 3 ou 4 puces, chacune chiffrée : le coût ou l'effet, sa cause principale, le gain possible | Le détail d'une mesure |
| 2 | **Constat** | Un tableau qui situe (composants, coûts, états), puis de 1 à 5 constats numérotés, titrés par une phrase-verdict en gras et suivis d'1 ou 2 puces de preuve | Une cause supposée présentée comme constatée |
| 3 | **Préconisations** | Un tableau `# · Action · Gain · Effort · Attention`, 5 lignes au plus | Une action sans gain ni effet nommé |
| 4 | **Rien à faire** | Ce qu'on a regardé et qu'on laisse, avec son motif | Une liste de ce qu'on n'a pas regardé |
| 5 | **Ordre conseillé** | L'ordre des actions, par leurs numéros, en une phrase | Un planning daté |
| 6 | **Sources** | Une ligne : les relevés, les métriques, le dépôt et son commit | La démarche qui y a mené |

« Rien à faire » et « Ordre conseillé » se posent en tête de paragraphe en gras, comme dans la
fiche d'origine, ou en titres : les deux se lisent.

## Les bornes jugées

Le retour qui fonde la famille demandait des bornes « jugées », pas seulement écrites. Elles le sont
par `oracles\oracle-fiche-constat-precos.mjs` :

| Règle | Borne | Mesure de la fiche d'origine |
|---|---|---|
| CP1 | les six parties présentes et remplies, « Rien à faire » motivé | 6 sur 6 |
| CP2 | 900 mots au plus, hors en-tête, blocs de code et commentaires (« environ 800 mots », tolérance de 100 déclarée) | 617 mots au compte de l'oracle |
| CP3 | « En bref » : 3 ou 4 puces, chacune chiffrée | 4 puces chiffrées |
| CP4 | de 1 à 5 constats numérotés, chacun porteur d'au moins un chiffre | 4 constats |
| CP5 | colonnes Action, Gain, Effort, Attention ; 5 actions au plus, chacune avec un gain ou un effet nommé | 5 actions |
| CP6 | le couple `gabarit` et `version du gabarit` rendu | absent : écrite sans gabarit |

*Le compte des mots.* Le lot annonçait 744 mots ; l'oracle en compte 617, parce qu'il ne compte ni
les lignes de séparation des tableaux ni les signes isolés. La borne s'applique au compte de
l'oracle, le seul qui se rejoue.

*Ce que la borne a vu le lendemain.* La même forme a été reprise le 13/10/2026 pour un second
sujet : 1 474 mots, 6 puces en bref, et une solution durable en cinq couches à la place du tableau
de préconisations. L'oracle la refuse sur CP1, CP2, CP3 et CP5 : c'était un diagnostic.

## Les vocabulaires fermés

- **Gain** : un montant avec son unité de temps (`~180 € par mois`), ou un effet nommé (`Panne
  levée`, `Tenue en charge`). Un tiret, « à chiffrer » ou une case vide ne nomment rien.
- **Effort** : une durée de geste (`30 min`, `2 h, plus la recette`, `plusieurs jours`).
- **Constat** : `**n. Phrase-verdict.**`, puis 1 ou 2 puces de preuve.

## Les refus de ce gabarit

- **Un constat sans chiffre.** Un constat se prouve par une mesure ; sans elle, c'est une opinion.
- **Une action sans gain ni effet.** L'équipe choisit entre des gains : une ligne qui n'en nomme pas
  ne se compare à rien.
- **Une sixième action.** Au-delà de cinq, l'ordre conseillé ne se lit plus d'un coup d'œil ; les
  actions mineures se regroupent, ou la fiche devient un diagnostic.
- **Un « Rien à faire » muet.** Ce qu'on laisse se motive, sinon le lecteur croit à un oubli.
- **La démarche dans la fiche.** Commandes, requêtes et sorties restent à la session ; la fiche cite
  ses sources en une ligne.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête, frontmatter en `md` :

```
role_destinataire: {l'équipe qui va agir, et ce qu'elle décide à la lecture}
```

## Avant de remettre

1. `node oracles\oracle-fiche-constat-precos.mjs <fiche.md>` rend PASS.
2. Les sommes du tableau de constat sont recalculées, et un écart entre la somme et le total est dit
   sous le tableau (D9 : une mesure dit son dénominateur).
3. Aucun `{…}` restant.

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas
dans ses décisions sort d'ici et vit dans le **document d'auteur** : un fichier distinct, tenu par
celui qui produit, cité en renvoi et jamais recopié :

- le **journal de l'analyse** : commandes jouées, requêtes, sorties brutes, pistes abandonnées ;
- l'**historique des versions** de la fiche et ce qui a changé d'un indice à l'autre ;
- les **notes de production** : chiffres à confirmer, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le
lecteur FAIT reste chez lui, même quand elle est inconfortable : « irréversible, vérifier
qu'aucune application ne l'utilise plus » appartient à la colonne Attention. Une information qui ne
change que ce que l'AUTEUR doit encore obtenir part au document d'auteur.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `oracles\oracle-fiche-constat-precos.mjs` du pilot : CP1 à CP6, sur toute fiche remise ;
- `oracle-gabarits-documents.mjs` du pilot : G1 (gabarit, squelette et instance), G2 (instance
  remplie), G4 (le couple rendu), G7, G8 (le nom du livrable résout sa famille), G10, G13 ;
- `oracle-ecriture.mjs` du pilot sur la fiche (tournures creuses, phrases longues).

## Limites du jugement

**La justesse des chiffres.** CP4 exige un chiffre par constat, jamais qu'il soit vrai : la ligne de
sources le rend vérifiable, aucun oracle ne la rejoue. **Le gain annoncé** : CP5 exige qu'il soit
nommé, pas qu'il soit atteignable. **Le choix de la famille** : une fiche qui aurait dû être un
diagnostic passe CP1 à CP6 si elle tient ses bornes.

## Boucle de retour

Le document produit porte `gabarit: gd-fiche-constat-precos` et sa version, en tête et en pied. Un
retour sur la **forme** se remet au pilot, par la section « Retours sur les documents produits » du
lot (`gabarits\RETOURS-FORGES.md`).
