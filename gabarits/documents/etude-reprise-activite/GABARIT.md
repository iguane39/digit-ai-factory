# Gabarit — Étude de reprise d'activité

**Famille** `gd-etude-reprise-activite` · **Version du gabarit** 1.0.0 · **Écrite le** 06/11/2026

> **Formats** Markdown
> **Règles engagées** D6 D8 D9 D11 (`gabarits\documents\README.md`)
> **Provenance** l'étude de reprise d'activité et de sauvegarde de `Produit-84`, rendue le 05/11/2026
> (lot `Produit-84 - RETOURS - 20261105c`, RT-51, TF-2192). Aucune famille ne la couvrait :
> `gd-diagnostic` rend compte de constats avant une mise en production, sans matrice de scénarios
> RTO et RPO, sans politique de sauvegarde ni recommandations chiffrées. La fiche de conception a
> déclaré « aucune » et la candidature est remontée. Les parties ci-dessous sont celles de l'étude
> réelle, relue le 06/11/2026 ; la forme est reprise, jamais la matière : l'instance est fictive.

## La règle qui commande toutes les autres

**Une étude de reprise d'activité se lit pour décider quoi dépenser : combien de temps le produit
reste coupé, quelles données il perd, et ce que coûte chaque renforcement.** Chaque chiffre porte sa
nature (mesuré, déclaré, décompté ou estimé), sinon le lecteur prend une hypothèse pour un fait.
*Une restauration que personne n'a jamais rejouée n'est pas une garantie, et l'étude le dit.*

## Quand l'employer

Dire à un comité de pilotage, une DSI ou un porteur ce que devient un produit quand une plateforme
dont il dépend tombe, est suspendue ou perd ses données : scénarios d'incident, délai de reprise
(RTO) et perte de données (RPO) pour chacun, politique de sauvegarde, risques restants et
renforcements chiffrés.

Le livrable se nomme `<Marque> - Étude - Reprise d'activité <sujet> - AAAAMMJJ<indice>.md`. « Étude »
est au registre des types, et « Reprise d'activité » ouvre la suite du champ `<Objet>` de R-4 : sans
ces 2 mots en tête, `oracle-gabarits-documents` (G8) rattache l'étude à `gd-etude-opportunite`.

**Frontière avec `gd-diagnostic`.** Celui-ci rend compte de constats faits sur un environnement vivant
avant une mise en production. L'étude de reprise projette des incidents qui ne sont pas arrivés et
chiffre le remède.

**Frontière avec `gd-etude-opportunite`.** Celle-ci arbitre entre options pour une décision. L'étude de
reprise compare des états d'un même produit face aux mêmes incidents.

**Frontière avec `gd-dossier-exploitation`.** Celui-ci remet les procédures de l'exploitation courante.
L'étude de reprise n'en porte que les procédures de restauration, une par ligne de la politique.

## Structure — sept parties sont dues

| # | Partie | Porte | Ne porte pas |
|---|---|---|---|
| 1 | **Synthèse** | Une ligne par état comparé : ce qui est sauvegardé, la perte au pire, le délai de reprise ; puis le coût total des renforcements | Un chiffre sans nature, une recommandation |
| 2 | **Ce qui a été mesuré** | Un tableau brique × état : la valeur, sa nature, l'heure du relevé ; puis la liste de ce qui reste illisible et pourquoi | Une donnée de production lue |
| 3 | **Les dépendances** | Pour chaque brique, la plateforme qui la sert et ce qui casse quand elle tombe | Un scénario chiffré |
| 4 | **Les scénarios d'incident** | Un tableau scénario × état, chaque cellule donnant la coupure (RTO) et la perte (RPO), avec la nature ; le calcul d'un délai en quatre termes | Une cellule sans RPO, ou sans RTO |
| 5 | **La politique de sauvegarde et de récupération** | Un tableau donnée × état : ce qui la protège et qui la restaure ; une procédure par restauration, un geste par ligne, avec sa preuve de fin | Une restauration présentée comme sûre alors qu'elle n'a jamais été rejouée |
| 6 | **Les risques résiduels** | Un tableau `Id · Risque · État touché · Contrôle qui le couvre`, du plus grave au moins grave | Un risque sans état touché |
| 7 | **Les recommandations chiffrées** | Un tableau `Risque · Renforcement · Effet attendu · Prix · Coût annuel · Lot, retour arrière`, et le total | Une dépense présentée comme décidée |

Les **sources** closent l'étude : un tableau `Source · Lue`, avec la date et l'heure de chaque lecture.

## Les vocabulaires fermés

- **Nature d'un chiffre** : `MESURÉ` (relevé ce jour par une commande) · `DÉCLARÉ` (affirmé par le
  porteur, consigné au ledger) · `DÉCOMPTÉ` (lu dans un document ou une page de fournisseur) ·
  `ESTIMÉ` (jugement de l'auteur, avec son hypothèse).
- **RTO** *(durée d'indisponibilité avant reprise)* et **RPO** *(durée de saisies perdues)* : définis à
  leur premier emploi, puis écrits en durée (« 2 minutes », « 2,5 jours ouvrés »). « Durée de la
  panne » s'écrit quand le fournisseur seul décide.
- **État** : les noms que le produit emploie (`actuel`, `cible`, ou les siens), les mêmes dans les
  parties 2, 4, 5 et 6.
- **Scénario** : au moins la panne de chaque plateforme seule, les pannes combinées, la perte de
  données par un utilisateur, la corruption par une migration, la compromission d'un compte ou d'un
  jeton, la suspension et la perte d'un compte ou d'une région.

## Les refus de ce gabarit

- **Un chiffre sans nature.** Le lecteur ne sait pas s'il peut s'appuyer dessus.
- **Un RTO sans RPO, ou l'inverse.** Les deux se lisent ensemble : une reprise rapide qui perd une
  semaine de saisies n'est pas une bonne reprise.
- **Une restauration jamais rejouée présentée comme garantie.** Elle s'écrit « non rejouée » avec la
  dernière date connue.
- **Un prix sans source.** Chaque prix est `DÉCOMPTÉ` sur une page citée, lue à une date, ou `ESTIMÉ` avec son
  hypothèse ; le coût annuel montre son calcul.
- **Une recommandation présentée comme engagée.** Les dépenses restent des décisions humaines (R-29) :
  la partie 7 dit « aucune n'est engagée ».
- **Une donnée de production lue sans le dire.** L'étude déclare ce qui a été lu et ce qui ne l'a pas
  été ; une valeur secrète ne s'écrit jamais (les fichiers `.env` ne transitent pas).
- **Un état manquant en silence.** Un état dont une brique n'a pas été relevée s'écrit « non relevé »
  avec son motif, sinon le lecteur croit à un oubli.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête, frontmatter en `md` :

```
role_destinataire: {qui décide des renforcements, et ce qu'il décide à la lecture}
```

## Avant de remettre

1. Toute cellule de la partie 4 donne un RTO et un RPO, chacun avec sa nature.
2. Chaque état cité en partie 2 revient en parties 4, 5 et 6, ou dit pourquoi non.
3. Tout prix de la partie 7 porte sa source et sa date, et le total se recalcule.
4. Aucune valeur secrète dans le document : relire la partie 2.
5. Aucun `{…}` restant.

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas dans ses
décisions sort d'ici et vit dans le **document d'auteur** : un fichier distinct, tenu par celui qui
produit, cité en renvoi et jamais recopié :

- le **journal des mesures** : commandes jouées, sorties brutes, heures de relevé (fichier compagnon
  `<livrable>.mesures.md`) ;
- l'**historique des versions** de l'étude et ce qui a changé d'un indice à l'autre ;
- les **notes de production** : valeurs à confirmer, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le lecteur
FAIT reste chez lui, même quand elle est inconfortable : « aucune restauration n'a jamais été
rejouée » appartient à la partie 5. Une information qui ne change que ce que l'AUTEUR doit encore
obtenir part au document d'auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `oracle-gabarits-documents.mjs` du pilot : G1 (gabarit, squelette et instance), G2 (instance
  remplie), G4 (le couple rendu), G7 (les sections déclarées), G8 (le nom du livrable résout sa
  famille), G10, G13 ;
- `oracle-ecriture.mjs` du pilot sur l'étude (tournures creuses, phrases longues) ; l'étude va à un
  tiers, donc EC-14 en juge la concision.

Aucun oracle propre à la famille n'existe : les sept parties, les natures et la présence d'un RPO à
côté de chaque RTO ne sont pas jugés sur une étude remise. La première étude remise dira si un
oracle de forme se justifie.

## Limites du jugement

- **La justesse des mesures** de la partie 2 et des prix de la partie 7 : rien ne les relit à la source.
- **L'exhaustivité des scénarios** de la partie 4 : un incident omis passe tous les contrôles.
- **Le choix de la famille** : un diagnostic avant mise en production qui tiendrait cette forme passe
  les contrôles.
- **Le couple gabarit et version** : G4 le trouve aussi dans le frontmatter, donc un pied de page
  absent n'est pas vu sur un document Markdown.

## Boucle de retour

Le document produit porte `gabarit: gd-etude-reprise-activite` et sa version, en tête et en pied. Un
retour sur la **forme** se remet au pilot, par la section « Retours sur les documents produits » du
lot (`gabarits\RETOURS-FORGES.md`).
