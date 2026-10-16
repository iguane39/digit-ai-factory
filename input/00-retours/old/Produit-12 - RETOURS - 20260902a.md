# Retours forges — Produit-12 — 20260902a

- **Contexte** : clôture du run `Produit-12-20260902a` (v0.6.0, tranche B — pièce jointe
  inversée). Une friction d'oracle mesurée au moment même de la clôture : la règle des clés de
  versions des forges n'offre aucune voie de rectification pour une clé MALFORMÉE, et un dépôt
  de l'écosystème qui ne porte pas le préfixe des forges est innommable sous son vrai nom.
- **Références ledger** : `forge\ledger.jsonl` seq 134 (le run_open fautif), 141 (la
  rectification par ajout restée sans effet), 142 (le retour), 143 (la remise)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-09-02 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RS s'arrêtait à RS-22 (lot 08).

---

## pilot (`digit-ai-factory`)

Le cas tient en une phrase : **une clé de versions des forges consignée sous le vrai nom du
dépôt (`digit-ai-queue`) met le produit en FAIL définitif** — la voie de rectification par
ajout ne couvre que le champ ABSENT, jamais la clé malformée, et la forme canonique exige un
préfixe que ce dépôt ne porte pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-23 | majeur | générique | **La règle R-19 (versions des forges au run_open) n'a pas de voie de sortie pour une clé malformée.** Mesuré le 2026-09-02 à la clôture du run v0.6.0 d'Produit-12 : le run_open consignait la clé « digit-ai-queue » — le NOM RÉEL du dépôt sur le poste, tel que le bootstrap du jour l'affiche — et l'oracle de conformité exige « digit-ai-forge-queue » (motif `RE_CLE_DEPOT`, seul `digit-ai-forge-*` ou `digit-ai-factory` admis). Une rectification par ajout a été déposée (seq 141, carte canonique complète) : SANS EFFET — le code ne lit les rectifications que pour le champ absent (`!v`), la boucle des clés malformées n'a pas d'échappatoire. Le produit était en FAIL définitif sur une règle dont l'autre moitié sait pardonner — exactement le défaut que TF-0709 venait de corriger pour le champ absent. Issue prise en session : la clé de l'entrée a été portée à la forme canonique, geste documenté par la rectification déjà consignée et visible au diff git — une réécriture que R-42 réprouve, choisie faute de toute autre voie | Deux volets : (1) étendre la lecture des rectifications par ajout à la boucle des clés malformées (même pardon que le champ absent, même exigence de cause ≥ 20 caractères) ; (2) trancher le nom du dépôt de file d'attente — soit `digit-ai-queue` entre dans `RE_CLE_DEPOT` comme exception nommée (comme `digit-ai-factory`), soit le dépôt se renomme `digit-ai-forge-queue` et la table de correspondance du renommage le consigne |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par la session du 2026-09-02 :
la friction est entièrement générique (oracle du pilot), rien n'a été corrigé localement hors
la mise en conformité de l'entrée elle-même, décrite dans le retour.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-09-02.

## Confirmations positives

- **La voie de rectification par ajout du champ ABSENT fonctionne** : les trois run_open
  antérieurs sans versions de forges ont été pardonnés par simple annotation datée (seq 131 à
  133) — la doctrine « l'histoire s'annote » tient, c'est sa moitié malformée qui manque.
- **La consignation des versions au run_open a payé** : le run du jour portait sa carte
  complète en noms canoniques (14 clés justes sur 15) — le diff de versions entre deux runs
  est désormais calculable, ce que la règle cherchait.

## Ordre recommandé

1. **RS-23** — le volet (1) d'abord : une règle dont une moitié pardonne et l'autre condamne
   à un FAIL définitif pousse à la réécriture qu'elle veut interdire — c'est la mesure de ce
   lot, et le correctif est une extension de lecture déjà écrite pour l'autre moitié.
