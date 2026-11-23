# Retours forges — digit-ai-marketing — 20261122b

> **Annoté à la réception le 23/11/2026** : ce lot a été refusé à la porte le 23/11/2026 (les deux lignes « classe-a-creer » du sidecar n'avaient pas de libellé, et leurs familles « prompt » et « relecture » ne sont pas au référentiel). RA-233 prend la classe existante `livrable-exige-hors-perimetre-de-la-demande` (famille `hook-ou-gate`) : la ligne ne porte plus de classe proposée. RP-224 reste « classe-a-creer », avec la clé, le libellé et la famille nommés dans la section « La règle qui aurait évité le retour » ; sa famille « relecture », absente du référentiel, est rattachée à `hook-ou-gate`. Le tableau ci-dessous garde les mots du produit. Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : correction du porteur — la page de formation à Claude, produite le 22/11/2026 à partir du prompt réécrit par une revue L99, a été rejetée en entier : trop de théorie sur les modèles de langage, pas assez de pratique, forme pauvre et sans menu.
- **Références ledger** : `forge\ledger.jsonl` seq 817 et 818 (entrées `type: retour`), correction du porteur seq 816, livrable seq 819.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 22/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 1 page sur 1 rejetée par le porteur après une revue L99 notée 88/100 et une relecture d'intention « sert ». Ce lot remonte 2 retours, tirés de 2 entrées du ledger, au pilot.

---

## digit-ai-forge-agents (`prompt-analyzer-l99`)

La réécriture d'un prompt a élargi son périmètre sans le dire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-233 | majeur | générique | **Une description du public devenue objectif de contenu.** Faits : le prompt du porteur disait « ne connaissant pas forcément tous les rouages des LLMs ». La revue `output/07-restitutions/Interne/Digit-AI - Revue - Prompt formation Claude passé au crible L99 - 20261122a.md` l'a classé en défaut majeur (Ch3 #10) et a imposé un domaine « fonctionnement d'un modèle de langage et ses limites ». Elle n'a fixé aucune part de pratique. Le porteur a rejeté la page produite : « une formation sur Claude Web & Desktop, pas sur les LLMs », « didactique […] pratiquer ». Score projeté de la réécriture : 88/100. (ledger seq 817) | Avant d'ajouter un contenu visible, la réécriture classe chaque ajout « demandé » ou « déduit », et pose les « déduits » au porteur. Une phrase qui décrit le public ne devient pas un objectif. Fixture : ce prompt, avec le Ch3 #10 attendu en « hors demande ». Classe à créer, famille `prompt`. |

## Pilot (`digit-ai-factory`)

La relecture d'intention a jugé une demande qui renvoyait à un fichier qu'elle n'a pas lu.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-224 | majeur | générique | **Demande par renvoi, intention invisible.** Faits : la demande humaine était « exécute le prompt : <chemin de la revue L99> ». `scripts/relecture-intention.mjs --preparer fin-de-tour` a écrit cette seule phrase dans `demande.txt`. Le relecteur, qui ne lit que `demande.txt` et `livrables.md`, a rendu « sert », confiance faible (RI-20261122-01). Le porteur a rejeté le livrable en entier, au premier message suivant. (ledger seq 818) | Quand la demande cite un fichier du dépôt, `--preparer` copie dans `demande.txt` le contenu de ce fichier, et le premier message humain dont il descend s'il est retrouvable. Fixture : une demande « exécute le prompt : <fichier> ». Classe à créer, famille `relecture`. |

## Rattachement

Registre interrogé le 22/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-233 | `grep -i "prompt-analyzer-l99" todo/TODO.jsonl \| grep -ic "perimetre\|périmètre"` | 1 | **récidive de TF-1391** (candidat) : « le skill prompt-analyzer-l99 ajoute au livrable un contenu visible non demandé et le fait valider en bloc avec le prompt réécrit » ; ce lot en apporte un second cas, avec le coût mesuré |
| RP-224 | `grep -i "relecture-intention" todo/TODO.jsonl \| grep -ic "demande.txt"` | 2 | voisins : TF-2160 (corrigé) et TF-2235 (candidat, aucun message humain retrouvé) ; aucun ne traite une demande qui renvoie à un fichier |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La question de cadrage posée avant la refonte (plan et mise en page, avec aperçu) a été validée en une réponse ; la version b est construite sur ce plan.

## Ordre recommandé

1. RA-233, parce qu'il a produit le livrable rejeté.
2. RP-224, parce qu'il a laissé passer ce rejet.

## La règle qui aurait évité le retour

Un contenu visible ajouté sans demande se pose au porteur avant d'être produit ; la relecture d'intention lit la demande telle que le porteur l'a écrite, fichiers cités compris.

- RA-233 : classe existante `livrable-exige-hors-perimetre-de-la-demande` (famille `hook-ou-gate`) : une exigence que la demande ne porte pas est imposée au livrable.
- RP-224 : classe à créer `relecture-intention-sur-demande-par-renvoi`, famille `hook-ou-gate`, libellé « La relecture d'intention ne lit pas le fichier qu'une demande par renvoi cite et juge sur la seule phrase de renvoi ».
