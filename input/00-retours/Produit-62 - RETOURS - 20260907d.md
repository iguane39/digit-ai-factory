# Retours forges — Produit-62 — 20260907d

- **Contexte** : quatrième retour humain de la journée sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset` : « Les noms de fichiers générés ne répondent pas aux normes de la factory. Corrige et remonte à la factory. » Onze livrables d'`output\` portaient la forme `AAAAMMJJ<indice>-objet.ext` au lieu de `<Marque> - <Objet> - AAAAMMJJ<indice>.<ext>` (règle R-4).
- **Références ledger** : `forge\ledger.jsonl` seq 19 (retour humain), seq 20 (renommage et table de correspondance), seq 21 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-07

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## pilot (`digit-ai-factory`)

Trois tours de mandat, quatre synthèses jugées PASS, trois lots de retours jugés PASS — et aucun des onze fichiers d'`output\` ne portait le nom que la factory exige. Le renommage est fait (table de correspondance dans `forge\etapes\data\2026-09-07-renommage-r4.json`, références mises à jour dans les livrables, page HTML régénérée). Le fait à remonter est la cause : la règle vit dans un oracle qui n'a jamais tourné ici, et le seul exemple de nommage que l'agent avait sous les yeux dans le pilot était l'exception.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-5 | majeur | générique | **R-4 n'est jugée que par `oracle-conformite-projet.mjs`, qui n'est pas joué sur un mandat sans socle — et RUN-MANDAT nomme la règle sans en donner la forme.** `references\RUN-MANDAT.md` pas 5 : « livrable nommé R-4 dans `output\` » ; la forme `<Marque> - <Objet> - AAAAMMJJ<indice>` n'y figure pas, elle vit dans `oracles\oracle-conformite-projet.mjs` (`MOTIF_DATE = / - \d{8}[a-z]?\.[\w.]+$/`, message « livrable sans nommage « <Marque> - <Objet> - AAAAMMJJ<indice> » »). Mesure : les onze fichiers d'`output\` du produit portaient `20260907-…`, `20260907b-…`, `20260907c-…` ; l'oracle de conformité, joué APRÈS le retour humain, les aurait tous refusés (verdict dans `forge\oracles\2026-09-07-oracle-conformite-projet.txt`). Le modèle copié par l'agent est celui d'`output\03-etudes\` du pilot (`20260907-etude-opportunite-…md`), seule famille du pilot qui déroge à R-4 par exception écrite dans l'oracle (« étude sans préfixe daté « AAAAMMJJ-… » »). Deux conventions coexistent dans un même `output\` ; un lecteur qui imite ce qu'il voit prend l'exception pour la règle. Même cause racine que RF-2 (lot 20260907a) : sans hooks ni oracle de conformité installés, rien ne juge avant le destinataire. | Règle qui aurait évité le retour : R-4 existe ; c'est son exécution qui manquait. Proposer : (1) `RUN-MANDAT.md` pas 5 et `RUN-CONSEIL.md` C5 écrivent la forme en clair avec un exemple (« `<Client> - <Objet> - AAAAMMJJa.md` ») et renvoient à `scripts\allouer-indice.mjs` pour l'indice ; (2) `oracle-conformite-projet` expose un mode `--regles R-4` jouable seul, sans socle, sur un dossier `output\` (l'agent l'aurait joué au pas 4 même sur un existant) ; (3) les études du pilot déclarent leur exception dans un `LISEZMOI.md` d'`output\03-etudes\` (« forme réservée aux études du pilot, jamais un modèle pour les livrables des produits ») ; (4) la synthèse (bloc 4) cite le nom R-4 de chaque livrable — `oracle-synthese` S38 candidate : un chemin `output\…` cité dans une restitution qui ne satisfait pas `MOTIF_DATE` est un constat. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Onze livrables renommés, références mises à jour dans le rapport, les synthèses, le générateur HTML ; page HTML régénérée sous son nouveau nom et rejugée | `git mv` + remplacement des anciens noms, table de correspondance versionnée | oui | remontée ci-dessus (RF-5) |
| Les fichiers `.csv`, `.json`, `.sql` ne sont pas dans `EXT_LIVRABLE` de l'oracle (md, pdf, html, pptx, docx, xlsx, zip, png, svg) : R-4 ne les aurait pas jugés | renommés quand même à la même forme, un indice par livrable | oui, candidat | un mapping CSV ou un DDL SQL remis à un humain est un livrable ; l'extension ne devrait pas l'exempter — à instruire par le pilot (non remonté comme item : c'est un choix de périmètre de l'oracle, pas un défaut constaté) |
| Les journaux d'oracles sous `forge\oracles\` gardent les anciens indices (a, b, c) de la session | laissés tels quels : pièces de preuve datées, pas des livrables | non | propre au run |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- `oracle-conformite-projet.mjs`, joué après renommage, rend R-4 conforme sur les onze livrables (voir journal) : la règle est claire dès qu'elle est jouée.
- `MOTIF_DATE` accepte des noms longs à espaces et un indice sur une lettre : aucune contrainte cachée n'a bloqué le renommage.

## Ordre recommandé

1. RF-5 — parce qu'il rejoue la même cause que RF-1 et RF-2 (une règle qui n'est pas jouée chez le producteur n'existe pas pour lui) sur un troisième objet en une journée.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RF-5 suit un retour humain. La règle existe (R-4, `oracle-conformite-projet`) ; ce qui manquait est sa forme écrite dans le mode opératoire et son exécution hors socle. Classe : `emplacement-livrable-hors-convention` (famille `emplacement-livrable`, « un livrable généré hors du dossier prévu ou sous un nom hors R-4 ») — correspondance exacte.
