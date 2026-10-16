# Retours forges — COMPTA · Ventilation de facture Fournisseur-A — 20260928a

- **Contexte** : clôture du run `20260925-chaine-de-qualification` — préparer la qualification derrière sa garde de fermeture : infrastructure Terraform en plan seul, chaîne de livraison, poussée et fusion (25 au 28/09/2026).
- **Références ledger** : `forge\ledger.jsonl` seq 88–91 et 94 (entrées `type: retour`) ; seq 86–87 et 92 pour le geste, le bilan et la clôture ; seq 93 et 95, après la clôture, pour les écarts de l'agent et les constats hors run.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) ; un lot
  au nom réel posé à la racine est refusé (règle LOT-SAS de l'oracle, TF-1054) —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-28

> **Note de réception du pilot, 28/09/2026.** Après l'accueil, un chemin du fichier
> d'accompagnement portait encore la forme du nom de dossier de ce produit, qui est à la table la clé
> de Produit-73 : la pseudonymisation du client l'a fait apparaître après le passage des noms de
> produits. Le pilot l'a remplacée par Produit-73 avant l'ingestion. Le reste du texte est celui du
> producteur.

---

## pilot (`digit-ai-factory`)

Trois défauts de l'oracle des restitutions, `oracles/oracle-synthese.mjs`, constatés en rédigeant les restitutions du 25/09 : chacun a coûté une réécriture, et l'un allonge chaque restitution d'une décision déjà posée. Un quatrième, constaté en rédigeant ce lot : une correction du pilot qui n'a pas redescendu jusqu'au produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-7 | mineur | générique | **S12 accuse une action d'être sans raison quand c'est sa ligne de tableau qui est coupée.** Une cellule qui contient deux barres verticales dans une portée de code découpe la ligne, à l'affichage comme pour l'oracle : le rouge est mérité. Mais S12 lui donne une autre cause, « une action laissée à l'humain sans raison d'impossibilité ». *Mesuré le 25/09* sur « Synthese bascule de la connexion de dev » : la ligne A-10 citait la commande `2>/dev/null \|\| echo 0` ; reformulée sans barre, S12 passe. | Compter les cellules de chaque ligne contre l'en-tête du tableau, et nommer la cause : une barre verticale dans une cellule, à échapper. Classe proposée : `oracle-verdict-juste-cause-fausse`. |
| RV-8 | mineur | générique | **S14 rejette une référence de registre valide de la forme A-NN.** Elle retire ces identifiants, qu'elle confond avec les sélecteurs d'action A-N : une action portée au registre du produit sous A-18 doit se déclarer « neuve ». *Mesuré le 25/09* sur « Synthese besoin de la permission Graph » : « A-18 » en colonne Registre rejeté, « neuve » accepté ; la trace vers le registre a dû passer dans la colonne Comment. | Distinguer la colonne Registre des sélecteurs, ou admettre une forme qualifiée, « registre A-18 ». Classe : `oracle-faux-positif`. |
| RV-9 | majeur | générique | **S4 refuse un bloc 3 qui ne fait que rappeler des décisions déjà posées.** Elle compte les options étiquetées du bloc : sans « (a) » ni « (b) », elle rend « décision demandée sans choix fermé », et sa seule autre issue, « aucune décision en attente », serait fausse. *Mesuré le 25/09* : « à décider : D-6, posée à 14:20 » a rendu FAIL ; D-4 a été reposée en entier dans 8 restitutions du même jour, et celle de 15:08 a dû reprendre D-6 et D-4 mot pour mot, 562 mots autour d'un message de 142. | Admettre une ligne de rappel — identifiant, heure de pose, « inchangée » — que S4 compte comme rappelée, pas comme redemandée. Classe proposée : `decision-rappelee-non-prononcable`. |
| RV-10 | majeur | générique | **Deux corrections closes au pilot ne redescendent pas jusqu'au texte que le produit lit.** Le `CLAUDE.md` du produit, issu de `gabarits/CLAUDE-PRODUIT.md`, désigne le gabarit `forge\retours\RETOURS-FORGES.md` et la copie dans `<pilot>\input\00-retours\`. Or cet alias survit périmé à côté de la copie canonique (empreinte `18847fad553f` contre `3e4370cd6fa8` pour la source), et la racine est refusée par LOT-SAS depuis le 14/09. Le gabarit du pilot porte encore cette racine (ligne 41), et le remède de R-45 et R-46 dans `oracle-lot-retours.mjs` (ligne 247) nomme encore l'alias. Le relevé d'héritage voit l'alias et son geste de retrait ; aucun des deux lots de travaux reçus ne le porte. *Mesuré le 28/09* : ce lot, rédigé d'abord d'après l'alias, n'avait ni classe — refus à l'ingestion — ni remise par le sas ; corrigé avant remise, à la lecture du gabarit canonique. | Écrire le chemin canonique et le sas dans `CLAUDE-PRODUIT.md` et dans le remède de la ligne 247 ; porter au produit, par un lot de travaux, le geste de retrait que le relevé nomme déjà. Classe : `boucle-retour-sans-descente`. |

**Portée** (R-45, 21/08) : les quatre sont *génériques* — RV-7 à RV-9 tiennent à l'oracle, RV-10 aux textes que le pilot fait lire à tout produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Depuis le 26/09, la chaîne compile ses étages de livraison pour `env/uat` : la garde de fermeture était la seule barrière, et l'environnement `vfs-hpr` n'avait pas d'approbation. | Approbation nommée posée sur `vfs-hpr` le 28/09 (contrôle 263) : retirer la garde ne suffit plus à livrer sans approbation. | non | Rien de généralisable : l'approbation double une garde propre à la chaîne du produit ; le geste est consigné au ledger (seq 86). |
| Le gabarit Terraform commun nomme par défaut son environnement `<tri>-<env>`, le nom que les chaînes applicatives donnent à leurs environnements de livraison. | Nommé explicitement `vfs-<env>-infra` dans `terraform/azure-pipelines-infra.yml`. | oui | Généralisable, hors factory : le gabarit vit dans le dépôt d'engagement ; retour consigné pour son porteur (ledger seq 91). |
| Le modèle de branches admet la fusion `env/dev` → `main` par demande de fusion ; faite par commit de fusion, elle laisse `main` hors de l'ascendance d'`env/dev`, et le modèle ne dit pas s'il faut réaligner. | Réaligné le 25/09 (demande 3858) ; de nouveau écarté par les demandes 3871 et 3872 du 26/09, sans écart de contenu : seuls les commits de fusion manquent à `env/dev`. | oui | Généralisable, hors factory : le modèle de branches est celui du dépôt d'engagement ; retour consigné pour son porteur (ledger seq 91). |
| Après la bascule d'identité du 25/09, 2 commentaires de la cible dev nommaient encore le SP transverse et son rôle d'annuaire. | Réalignés dans `c936d06`. | non | Rien de généralisable : des commentaires propres à la chaîne du produit. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les documents du run — `terraform/README.md`, `docs/projet/COMMANDES.md`, les restitutions — suivent les formats du produit et de `forge\RESTITUTION.md`, pas un gabarit de `gabarits\documents\`.

## Confirmations positives

- **La garde de fermeture a tenu en conditions réelles** : la poussée du 26/09 vers `env/uat` (demande 3873) a lancé la livraison 15347, arrêtée à l'étage 1 sur « Cible 'hpr' FERMÉE (source refs/heads/env/uat) : rien n'est construit ni déployé » ; les étages 2 et 3 ont été sautés.
- **Le gabarit Terraform commun s'adopte sans modification** : le fichier consommateur ne porte que le trigramme, les comptes d'état, le répertoire Terraform et les environnements. Sur l'exécution 15348, l'étage 0 a créé le compte d'état de qualif, l'application n'a pas eu lieu faute de `doApply`, et le plan — 7 créations — est égal au plan de référence calculé en local le 25/09.
- **La compilation Azure DevOps en surcharge juge une chaîne sans la commiter** : le 25/09, `previewRun` avec `yamlOverride` a rendu dev identique avant et après, hors garde de cible, la qualif fermée identique hors variables, et une variante « qualif ouverte » valide.
- **L'oracle différentiel sur Terraform** — le plan de dev avec et sans la modification — a prouvé l'absence d'effet en dev.
- **La loi de re-mesure** a rattrapé 4 écarts qu'une valeur recopiée aurait laissés passer : un commit du pilot cité à tort, une permission Graph posée sur le mauvais objet, un correctif poussé directement sur `main`, et le 28/09 les numéros des demandes qui ont écarté `main` — 3871 et 3872, là où le ledger du produit écrivait 3872 et 3873 (seq 87, rectifiée en seq 93).

## Ordre recommandé

1. RV-10 — le moins cher à corriger, deux lignes de texte et un lot de travaux ; il évite un lot refusé à chaque produit qui suit son `CLAUDE.md`.
2. RV-9 — le plus coûteux : il allonge chaque restitution d'une décision déjà posée.
3. RV-7 — un diagnostic faux coûte une recherche à chaque occurrence.
4. RV-8 — contournable, mais il fait perdre la trace vers le registre.

## La règle qui aurait évité le retour

Aucun des quatre retours ne suit un retour humain : ce sont des défauts rencontrés en écrivant. Deux classes existantes conviennent ; pour les deux autres, aucune clé du référentiel ne décrit le défaut, d'où deux classes proposées.

- **RV-10** — classe `boucle-retour-sans-descente`, famille `heritage-produit` : une correction close au pilot ne redescend pas sous une forme que le producteur rencontre. La correction en cause est celle de `alias-de-transition-perime-survivant` (TF-0881) : le relevé compte l'alias et nomme son retrait, mais rien de ce que le produit lit ne le lui dit.

- **RV-8** — classe `oracle-faux-positif`, famille `regle-morte` : un rouge sur un artefact conforme. La règle qui l'aurait évité est la fixture à double sens de quality-oracles : une restitution qui cite « A-18 » au registre doit passer.
- **RV-7** — classe proposée **`oracle-verdict-juste-cause-fausse`**, famille **`regle-morte`**, libellé : « Un oracle rend un rouge mérité sous une cause fausse : l'auteur corrige ce qu'on lui nomme, et la vraie cause se cherche à la main ». Voisine : `oracle-faux-positif`, où c'est le rouge lui-même qui est faux.
- **RV-9** — classe proposée **`decision-rappelee-non-prononcable`**, famille **`regle-morte`**, libellé : « Une décision déjà posée et inchangée ne se rappelle qu'en la reposant en entier : le contrôle ne connaît que le choix fermé ou l'absence de décision, et chaque restitution répète le même texte autour du message utile ». Voisine : `decision-humaine-rendue-restituee-sans-geste`, dont la règle S-GESTE refuse déjà la même `D-N` reposée après un mot de décision.
