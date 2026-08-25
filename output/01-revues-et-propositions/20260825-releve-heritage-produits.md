---
role: l'état DATÉ de l'héritage du pilot chez tous les produits localisables du parc — un relevé, pas un jugement
destinataire: humain
sources_de_verite: [gabarits/HERITAGE.json (le contrat), scripts/relever-heritage.mjs (la mesure, rejouable)]
verifie_le: 2026-08-25
---

# Relevé de l'héritage chez les produits — 25/08/2026

**Ce document est un état, pas une demande.** Il ne propose aucun geste et n'en a posé aucun :
la mesure lit des noms de fichiers et compare des empreintes, elle n'écrit rien chez aucun produit.
La recopie est une décision humaine, produit par produit.

## Pourquoi ce relevé existe

Le contrat `gabarits\HERITAGE.json` (v1.2.0) nomme **huit artefacts** que le pilot destine à
chaque produit : quatre en **copie conforme** — le gabarit de retours et l'outil qui le vérifie, le
hook de fin de tour, le gabarit de restitution — deux en **présence et motif** — les consignes du
produit et sa configuration d'agent — et deux en **présence** — les fichiers d'ouverture aux agents
web.

La règle R-47 juge cette conformité et elle est câblée à l'ingestion des lots. Elle rendait
pourtant « non vérifié » sur la plupart de ses cibles, pour une raison découverte le 25/08 : **son
résolveur ne savait pas les localiser** — il cherchait par préfixe de nom, sans normalisation, et
sur deux niveaux de profondeur seulement. Un produit rangé plus bas, ou dans un dossier dont le nom
ne lui ressemble pas, était invisible. *Le parc croyait avoir un juge de conformité là où il n'en
avait pas, et aucun signal ne le disait.*

Le résolveur corrigé identifie un produit à **ce qu'il produit** — il porte ses lots dans
`forge\retours\` — et non à sa profondeur de rangement. Ce relevé est la première mesure que cette
correction rend possible.

## L'état, au 25/08/2026

| Produit | Absents | Périmés | Conformes | Ce qui manque |
|---|---|---|---|---|
| `_Client-A/Produit-04` | 8 | 0 | 0/8 | tout : gabarit de retours, outil de vérification, hook de fin de tour, gabarit de restitution, configuration d'agent, consignes, robots.txt, llms.txt |
| `_Client-A/Cockpit IA/client-a-cockpit-ia` | 7 | 0 | 1/8 | gabarit de retours, outil de vérification, hook de fin de tour, gabarit de restitution, configuration d'agent, robots.txt, llms.txt |
| `_Client-A/Plateforme_video_IA_complet` | 7 | 0 | 1/8 | gabarit de retours, outil de vérification, hook de fin de tour, gabarit de restitution, configuration d'agent, robots.txt, llms.txt |
| `_Client-A/Produit-01` | 6 | 0 | 2/8 | gabarit de retours, outil de vérification, hook de fin de tour, gabarit de restitution, robots.txt, llms.txt |
| `_Client-A/BourseAuxVacants2/Produit-11` | 6 | 0 | 2/8 | hook de fin de tour, gabarit de restitution, configuration d'agent, consignes, robots.txt, llms.txt |
| `_Client-A/COMPTA---Ventillation-de-facture-Fournisseur-A` | 2 | 0 | 6/8 | robots.txt, llms.txt |
| `_Client-A/Produit-10` | 2 | 0 | 6/8 | robots.txt, llms.txt |

**7 produits relevés · 38 manques sur 56 possibles · contrat v1.2.0.**

## Ce que le relevé dit, et qui n'était pas su

**Le trou n'est pas propre à un produit : il est général.** Cinq produits sur sept manquent au
moins six artefacts sur huit. Deux seulement sont à 6/8, et aucun n'est complet.

**Ce qui manque n'est pas décoratif.** Le hook de fin de tour et le gabarit de restitution sont
absents de **cinq** produits sur sept. Un produit qui ne les a pas rend ses travaux hors du format
prescrit *sans qu'aucun contrôle ne le refuse* — c'est exactement la classe de défaut mesurée en
son temps sur dix produits, dont un seul portait le hook et zéro le texte. Le présent relevé
indique que la situation n'a pas fondamentalement changé, et qu'elle était masquée.

**AUCUNE copie périmée dans tout le parc.** Zéro divergence sur les quatre artefacts en copie
conforme, partout où ils sont présents. Ce résultat *contredit une hypothèse portée depuis le
24/08* : parmi les trois causes énumérées par le message de refus des lots, la première était « le
produit écrit avec une copie du gabarit prise à la création de son run et jamais rafraîchie ».
Elle n'a **aucune instance** aujourd'hui. Les deux causes réelles sont donc l'absence pure et
simple, et le fait de ne pas jouer un contrôle qu'on possède.

**Les deux fichiers d'ouverture aux agents web manquent chez les sept.** Ils sont en mode
`presence`, donc admis absents sur un produit sans surface web ; leur absence uniforme mérite
néanmoins d'être lue avant d'être excusée — sept sur sept ressemble moins à sept décisions qu'à une
étape jamais faite.

## Ce que ce relevé NE dit PAS

- **Il ne juge pas les produits.** Un artefact absent n'est pas une faute du produit : c'est le
  plus souvent une livraison que le pilot n'a jamais faite. R-47 nomme un état, elle n'accuse pas.
- **Il n'est pas exhaustif, et le déclare** : tout produit rangé au-delà de **trois** niveaux sous
  la racine du parc, et tout produit absent de ce poste, ne figure pas ici. La borne est écrite
  dans l'outil et prouvée tenue par un cas construit exprès.
- **Il ne lit aucun contenu**, sauf pour calculer l'empreinte des artefacts en copie conforme — le
  seul moyen de distinguer « présent » de « présent et à jour », sur les lignes normalisées pour
  qu'une fin de ligne Windows ne fasse pas paraître tout le parc divergent.
- **Il n'a rien écrit chez aucun produit**, et sa recette le vérifie par empreinte de
  l'arborescence avant et après.

## Rejouer cette mesure

    node scripts\relever-heritage.mjs
    node scripts\relever-heritage.mjs --md <fichier>   # le tableau seul
    node scripts\relever-heritage.mjs --json           # l'état détaillé, artefact par artefact

Recette : `node scripts\relever-heritage.test.mjs` — 8 cas, dont la distinction absent/périmé et la
preuve de non-écriture.
