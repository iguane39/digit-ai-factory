# Retours forges — Produit-02 — 20261030a

- **Contexte** : autre — retour humain du 30/10/2026, hors run de version, sur le rangement de deux
  formulaires remplis pour la reprise du contrat d'eau.
- **Références ledger** : `forge\ledger.jsonl` seq 110, 111 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-10-30

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT au registre du pilot (dernier relevé : RT-140).

---

## Factory (`digit-ai-factory`)

Une session a posé deux livrables à la racine d'`output\`, et le porteur a dû le relever. La
convention existait et aucun contrôle ne l'a opposée à la session.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-141 | majeur | générique | **Un livrable déposé à la racine d'`output\` ne déclenche rien, alors que le produit range ce dossier en familles numérotées.** Retour humain, mot pour mot : « Pourquoi ce n'est pas dans un dossier à part dans output ? Corrige et remonte à la Factory. » Fait : 2 PDF écrits à la racine le 30/10. `git ls-tree -d origin/main output/` rend 7 familles (`01-audit` à `07-maquettes`) ; l'arbre local, en retard de 194 commits, n'en montre aucune, et la session a copié ce qu'elle voyait. Le relevé d'ouverture disait « lire origin/main, jamais l'arbre local » : il parle de la lecture de code, pas de l'endroit où déposer. `oracle-conformite-projet` déclare ne pas juger la structure interne d'`output\` (D-15, mécanisation « suspendue à un mandat humain »). Le contrôle de nommage de quality-oracles a rendu PASS sur les 2 fichiers à la racine. Correctif chez le produit : `output\08-abonnement-eau\`, premier numéro libre (R-39), à jour sur la référence distante. | Règle qui aurait évité le retour : D-15 et R-39 de `REGLES-PROJET.md`, écrites sans contrôle qui les joue. Pistes : le hook d'écriture avertit un dépôt à la racine d'un `output\` qui porte des familles, en lisant ces familles sur la référence distante quand le clone diverge ; le relevé de fraîcheur TF-1642 ajoute « avant de déposer sous `output\`, lire `git ls-tree -d origin/main output/` » ; une ligne aux préférences du porteur (« les livrables d'une démarche vont dans leur famille d'`output\`, créée si besoin, sans attendre la demande »). |

## Forge agents (`digit-ai-forge-agents`)

Ce retour confirme un item déjà ouvert, par un cas réel du même jour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-142 | mineur | générique | **Le registre de quality-oracles ne juge pas la justesse d'un formulaire PDF rempli.** Fait : sur les 2 PDF, il a jugé secrets, nommage et polices (3 PASS, 1 SKIP) et rien des valeurs. Un contrôle écrit dans le tour a dû lire les valeurs dans le fichier produit, vérifier l'original une fois le calque retiré et placer chaque caractère d'IBAN dans sa case. Il rend PASS sur les 2 PDF et FAIL sur le formulaire vierge et sur un IBAN altéré d'un chiffre. Sa première version accusait à tort : le nom de police ne distinguait pas les ajouts de l'original, la couleur d'encre oui. | Rattaché à TF-2031, qui porte déjà ce manque. Règle qui aurait évité le retour : aucune, § 4 de quality-oracles (domaine sans oracle). À reprendre dans l'oracle : identifier les ajouts par la couleur ou le calque, pas par la police. |

## Rattachement

Registre interrogé le 30/10/2026 : `grep -c 'emplacement-livrable-hors-convention' todo/TODO.jsonl` → 12 ligne(s) trouvée(s).
Registre interrogé le 30/10/2026 : `grep -c -i -E "racine d.?.?output|familles? d.?.?output|D-15" todo/TODO.jsonl` → 20 ligne(s) trouvée(s).
Registre interrogé le 30/10/2026 : `grep -c -i -E 'formulaire[^"]{0,40}pdf|pdf[^"]{0,40}formulaire' todo/TODO.jsonl` → 1 ligne(s) trouvée(s).
Items recoupés : TF-2031 (aucun oracle ne juge un formulaire PDF rempli) pour RT-142. Voisin de RT-141 : TF-1642 (session qui lit une copie locale périmée), qui visait la lecture de code et non le dépôt d'un livrable. Aucun item ne porte le dépôt à la racine d'`output\`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le clone local diverge de `origin/main` (194 commits de retard, 4 d'avance), et `output\LISEZMOI.md` n'existe donc pas localement | Non corrigée : le réalignement du clone n'a pas été demandé ; la ligne de la famille 08 reste à ajouter au LISEZMOI une fois le clone réaligné | non | Rien de généralisable, parce que l'état de ce clone est propre à ce poste ; la classe, elle, est remontée en RT-141 |
| Les 2 PDF portent un IBAN et une date de naissance | Dossier `output\08-abonnement-eau\` exclu de git | non | Rien de généralisable sur ce lot, parce qu'un motif d'exclusion par dossier suffit ici et que `secret-porte-hors-perimetre` couvre déjà la classe |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| `output\Produit-02 - Barometre de positions - 20260830e.html` | 5 | non relevés sur ce lot | aucun | non relevés sur ce lot | Reste au produit, parce que ses versions sont des relevés successifs, pas une forme qui a mûri ; mesuré par `oracle-lot.mjs --murs` |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **Le relevé de fraîcheur d'ouverture (TF-1642)** portait la bonne information : la divergence et la consigne de lire `origin/main`. Il a suffi de l'appliquer pour trouver la convention. Seule sa portée est à étendre (RT-141).
- **La règle R-39** (une famille nouvelle prend le premier numéro libre) a donné le numéro 08 sans hésitation.

## Ordre recommandé

1. RT-141 : l'avertissement du hook d'écriture, parce que le coût est faible et que le défaut touche tout produit à familles.
2. RT-142 : à traiter avec TF-2031, déjà ouvert.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-141 : D-15 et R-39 de `REGLES-PROJET.md`, existantes et sans contrôle qui les joue. RT-142 ne suit pas un retour humain ; aucune règle ne le couvre, § 4 de quality-oracles.
