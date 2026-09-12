# Retours forges — digit-ai-forge-development — 20260912a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260912c` (items de registre TF-1064,
  TF-1066), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain du 12/09/2026
  (décision D-1 (b) de la synthèse 20260912a du pilot).
- **Références ledger** : aucune — le dépôt `digit-ai-forge-development` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  `fd73af5`, local, aucun push (garde-fou du mandat), et aux verdicts d'oracle rejoués ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-12

## Ce que le lot de travaux a produit (TF-1064, TF-1066)

Le lot confiait deux disciplines pour `docs\run-playbook.md`, dans l'ordre recommandé par le
pilot lui-même (E5 d'abord). Les deux sont écrites, sous le plancher d'écriture. Le compteur de
la section passe de huit à dix.

| Item | Ce qui a été écrit | Preuve |
|---|---|---|
| TF-1066 | Neuvième discipline de la section « Produit livrable » : « Tout écran de bureau se conçoit à 1920 px, et se vérifie jusqu'au 4K ». Cite E5, la grille de rendu à sept largeurs (3840, 2560, 1920, 1440, 1024, 768, 390), les grilles fluides qui gagnent des colonnes plutôt que des marges, l'absence de hauteur fixe, la mesure de lecture portée par le conteneur. | `docs\run-playbook.md` lignes 614-639. Limite déclarée dans le texte lui-même : `render_page.py` vit chez forge-design, pas dans ce dépôt. |
| TF-1064 | Dixième discipline : « Les textes du produit suivent le plancher d'écriture, et ses textes d'application vivent dans un fichier de ressources ». Cite `forge\ECRITURE.md` hérité du pilot, E-12 en trois formes (libellé, erreur, état vide), l'obligation d'un fichier de ressources extractible pour les chaînes d'application, le format de commit T5 (sujet puis corps, aucun mot nu), et le gate de fin de development qui rejoue `node forge\hooks\factory.mjs ecriture --fichier <chaque .md écrit par le run>`. | `docs\run-playbook.md` lignes 640-679. Limite déclarée : l'oracle T4 reste confié à forge-design, cette forge garantit seulement le support qu'il lira. |

**Preuve d'écriture, jouée avant remise** — `node oracle-ecriture.mjs docs/run-playbook.md
--chemin-relatif docs/run-playbook.md` (oracle du pilot, appelé par chemin absolu depuis cette
forge : elle ne porte pas de dossier `forge\`, donc pas de hook `ecriture` local — l'appel direct
est la voie prévue pour une forge, pas un contournement). Verdict **PASS**, 4186 mots. Deux
avertissements relevés, tous deux préexistants au lot et sans rapport avec le texte ajouté :
EC-2 ligne 228 (trois phrases consécutives de 38, 39 et 43 mots) et EC-4-gras ligne 447 (un
passage en gras de seize mots). Repris ci-dessous en « Remarques restées au produit ».

**Aucun self-test ni oracle de cette forge ne juge le playbook lui-même** — recherché par
`self-test`, `self_test`, `oracle-*`, `package.json` sur tout le dépôt (hors `.venv`) : zéro
résultat. Les gates existants (`conductor\gates\*.py`) vérifient le code produit par un run, pas
la prose de ce document ; aucun n'a donc été rejoué pour cette étape.

**Commit** : `fd73af5` — 3 fichiers, 145 insertions, 2 suppressions. Local, non poussé. Le lot de
travaux reçu (`pilot - TRAVAUX - 20260912c.md` et son sidecar) entre dans l'histoire avec les deux
disciplines : `git check-ignore` les a déclarés tous deux NON ignorés avant l'ajout (exit 1 sur
chacun). Statut du lot passé à `traite le 2026-09-12`, seule ligne éditée.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `docs\run-playbook.md` porte deux avertissements préexistants de l'oracle d'écriture, mesurés en rejouant l'oracle sur le fichier entier (pas de mode delta disponible) : EC-2 ligne 228, trois phrases consécutives de 38/39/43 mots (section « Traçabilité des exigences ») ; EC-4-gras ligne 447, un passage en gras de seize mots (« Le run qui a mis cette panne totale en service était VERT DE BOUT EN BOUT »). | Non corrigée — hors périmètre du mandat, qui porte sur TF-1064 et TF-1066 seuls, pas sur une réécriture des huit disciplines antérieures. Les deux restent des AVERT, jamais un FAIL : le calibrage de l'oracle (E-2) tolère jusqu'à sept phrases longues consécutives avant échec. | non | Deux tics isolés dans un document déjà PASS, pas une classe neuve : le seuil d'échec de l'oracle est calibré pour les distinguer d'un défaut structurel. Signalés pour mémoire ; aucune ligne de sidecar. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot : le
travail a porté sur un playbook existant (deux disciplines ajoutées) et sur la ligne de statut
d'un lot de travaux reçu.

## Confirmations positives

- **L'oracle d'écriture du pilot se joue depuis une forge sans aucune adaptation.** Aucun
  `forge\` local, aucun hook `ecriture` — l'appel direct par chemin absolu a suffi, et le fichier
  entier de 4186 mots a rendu son verdict en une passe.
- **Le contrôle `git check-ignore` a confirmé, avant tout `git add`, que le lot reçu et son
  sidecar entrent bien dans l'histoire** — exactement ce que la ligne « Sort du lot reçu » du lot
  de travaux annonçait, vérifié plutôt que supposé.
- **Le compteur de disciplines (« Huit… » devenu « Dix… ») s'est édité au même endroit que les
  disciplines elles-mêmes** : aucune ligne de décompte séparée n'a divergé du contenu qu'elle
  annonce.

## Ordre recommandé

Aucun retour générique n'accompagne ce lot : les deux items sont des clôtures de travaux confiés,
pas des défauts découverts. Rien à ordonner au-delà de l'ordre déjà tenu par le pilot lui-même —
E5 d'abord (TF-1066), le plancher d'écriture ensuite (TF-1064).

## La règle qui aurait évité le retour (TF-0779)

Sans objet : ce lot ne porte aucun retour suivant un défaut. Les deux items closent des travaux
confiés par le pilot. La seule remarque restée au produit (les deux AVERT préexistants) n'a pas
de ligne de sidecar, faute de classe applicable à un tic isolé déjà toléré par le calibrage de
l'oracle.
