---
destinataire: humain
---

# Étude — Parcours d'accueil des nouveaux utilisateurs de la Factory, version intégrée, 21/11/2026

Cette version intègre les trois retours du porteur sur `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121g.md` : l'utilisateur ne repart pas de zéro à chaque projet ; il peut annoncer son niveau, ou le récupérer d'un autre poste par le Drive ; la progression va jusqu'à 100. Tout le reste de la version « g » tient : les gains, le récit d'une première semaine, les mesures M-01 à M-12 et les options écartées ne sont pas repris ici. Run de conseil (`references/RUN-CONSEIL.md`) au pilot `digit-ai-factory`, commit 626b12e2, en lecture seule.

Les écrans de cette version sont **illustratifs** ; le projet « Planning » est fictif.

## 1. Ce qui change en une page

La boussole suit désormais deux choses distinctes, et ne les mélange plus. Ce que l'utilisateur sait le suit partout ; ce que vit un projet reste au projet.

- **Le niveau de l'utilisateur** : 5 niveaux et une note sur 100. Il se calcule sur tous ses projets, il peut être annoncé par l'utilisateur, demandé une fois sur un poste vierge, ou récupéré d'un autre poste par le dossier Drive qu'il utilise déjà pour ses reprises.
- **L'état du projet** : situation détectée (neuf, existant, mandat), run en cours, services utiles. Il est propre à chaque projet.

Le gain pour l'utilisateur : sur son troisième projet, il ne relit plus « répondez par la lettre » ; il voit seulement ce qui est neuf pour ce projet, et le prochain jalon qui le fera progresser.

```text
Boussole — vous : niveau 4 · 57/100. Ce projet : neuf, aucun run ouvert.
Dites par exemple : « Crée un produit : un planning d'équipe pour 30 personnes »
Prochain jalon : votre première étape de mise en production close (+3).
```

## 2. Le niveau suit l'utilisateur, d'un projet à l'autre

La version précédente calculait le palier dans le seul journal de run du projet ouvert ; un deuxième projet repartait au niveau 1. Le niveau devient le plus haut atteint sur l'ensemble des projets de l'utilisateur.

Le tableau se lit par source, dans l'ordre où la boussole les consulte : la première qui répond fixe le niveau, les suivantes ne peuvent que le confirmer ou le compléter.

| Ordre | Source du niveau | Ce que la boussole lit | Statut affiché |
|---|---|---|---|
| 1 | Projets du poste | les journaux de run (`forge/ledger.jsonl`) de tous les projets instrumentés de la racine, que l'ouverture relève déjà | « prouvé » |
| 2 | Dossier de progression synchronisé | le fichier de progression du dossier Drive déclaré, chapitre 4 | « prouvé sur un autre poste » |
| 3 | Annonce de l'utilisateur | ce qu'il a dit lui-même, chapitre 3 | « annoncé » |
| 4 | Aucune trace | niveau 1, et une question unique sur un poste vierge | « à découvrir » |

La règle qui tient l'ensemble honnête : **la note sur 100 ne compte que des jalons prouvés**. Un niveau annoncé change ce que la boussole dit, jamais la note.

## 3. Le niveau annoncé, ou demandé une fois

L'utilisateur peut dire où il en est ; la boussole le croit, le marque comme annoncé, et le vérifie par l'usage. Deux exemples le montrent.

**L'utilisateur l'annonce lui-même**, à n'importe quel moment :

```text
Utilisateur : J'ai déjà mené trois runs de version avec la Factory, sur un autre poste.

Boussole — vous : niveau 4 (annoncé) · 0/100 prouvé sur ce poste.
Je passe les conseils des niveaux 1 à 3. Vos jalons se compteront ici au fil de vos runs ;
pour les reprendre de l'autre poste, dites « récupère ma progression ».
```

**L'annonce est contredite par l'usage** : s'il répond à une décision par une phrase au lieu de sa lettre, la boussole redescend d'un niveau, sans reproche :

```text
Boussole — vous : niveau 3 (annoncé 4). Rappel utile : une décision se tranche par sa lettre, par exemple « 3b ».
```

**Sur un poste vierge**, sans aucune trace ni dossier de progression, la boussole pose une seule question, la seule de tout le parcours :

```text
Boussole — première utilisation sur ce poste.
Avez-vous déjà utilisé la Factory ailleurs ? Répondez « non », « oui », ou « oui, récupère ma progression ».
```

« non » ouvre le niveau 1 ; « oui » demande le niveau, noté annoncé ; « oui, récupère ma progression » lit le dossier synchronisé du chapitre 4.

## 4. Récupérer sa progression depuis le Drive

La Factory sait déjà reprendre un produit d'un poste à l'autre par un dossier synchronisé (Google Drive, OneDrive ou Dropbox) : c'est la règle R-64 *(un produit dont le canal de reprise est déclaré se reprend sur tous les postes sans geste humain)*, avec son manifeste `forge/REPRISE.json` et son hook `reprise`, qui restaure à l'ouverture et envoie en fin de tour. La progression de l'utilisateur emprunte le même canal ; aucun mécanisme neuf, aucune API d'un service tiers, puisque le dossier est un dossier local synchronisé par le client du service.

Ce que contient le fichier de progression, et rien d'autre : le niveau, la note, et chaque jalon prouvé avec sa date et la nature de sa preuve. Aucun nom de projet, aucun chemin, aucun contenu de livrable.

```json
{
  "schema": "progression-utilisateur/1",
  "mise_a_jour": "2026-11-21T14:05:00+01:00",
  "niveau": 4,
  "note": 57,
  "jalons": [
    { "id": "J-01", "libelle": "premier livrable vert", "le": "2026-11-03", "preuve": "oracles_verdict PASS" },
    { "id": "J-02", "libelle": "première décision tranchée", "le": "2026-11-03", "preuve": "reponse_humain" },
    { "id": "J-09", "libelle": "étape de tests close", "le": "2026-11-10", "preuve": "etape_close tests" }
  ]
}
```

Le parcours sur un second poste :

```text
Utilisateur : oui, récupère ma progression

Boussole — progression trouvée dans votre dossier synchronisé, mise à jour le 21/11 à 14:05.
Vous : niveau 4 · 57/100, prouvé sur un autre poste. 17 jalons repris.
```

Ce qui revient au porteur ou à l'utilisateur : nommer une fois le dossier synchronisé, comme pour toute reprise R-64. Ensuite, la lecture à l'ouverture et l'écriture en fin de tour se font seules. Si deux postes ont progressé en parallèle, les jalons s'additionnent : un jalon prouvé ne se perd jamais.

## 5. Cinq niveaux et une note sur 100

Cent paliers prouvés chacun par une trace distincte seraient, pour la plupart, artificiels. La proposition garde 5 niveaux, qui changent ce que la boussole dit, et ajoute une note sur 100, qui monte à chaque jalon réel. La note vaut le nombre de jalons prouvés sur 30, ramené sur 100 et arrondi.

### 5.1 Les 5 niveaux

Le tableau se lit du niveau 1 au niveau 5 : ce que la boussole dit à ce niveau, et ce qui fait passer au suivant. Les critères de passage sont ceux des paliers de la version « g ».

| Niveau | Ce que la boussole dit | Passage au niveau suivant |
|---|---|---|
| 1 — Découverte | 3 phrases d'intention adaptées au dossier | premier livrable vert |
| 2 — Premiers résultats | lire les blocs 0 et 3, trouver ses livrables | première décision tranchée par sa lettre |
| 3 — Décideur | ce que chaque décision arrête | premier run clos |
| 4 — Praticien | les 5 services utiles à sa situation, le prochain jalon | un run ouvert sans aide, ou un premier lot de retours remis |
| 5 — Autonome | rien à l'ouverture, sauf le prochain jalon s'il en reste | — |

### 5.2 Les 30 jalons de la note

Chaque ligne est un jalon, avec la trace qui le prouve et ce que les traces d'aujourd'hui permettent de lire. Le tableau se lit par famille, dans l'ordre : gestes, étapes de run, types de run, forges. La dernière colonne renvoie aux mesures M-13 à M-16, chapitre 6.

| Jalons | Nombre | Trace qui le prouve | Lisible aujourd'hui |
|---|---|---|---|
| Gestes : premier livrable vert, première décision tranchée, premier run clos, premier lot de retours remis | 4 | `oracles_verdict` PASS, `reponse_humain`, `run_close` au journal de run ; un lot dans `forge/retours/` | oui (M-16) |
| Gestes : premier audit complet, première mise en production sur GO, premier skill appelé par une formule, premier run ouvert sans aide | 4 | dossier `forge/audit/`, étape MEP close avec GO, journal du lexique d'invocation, ouverture de run sans recours au détail de la boussole | en partie : la boussole doit tracer le dernier elle-même |
| Étapes de run closes : conception, design, development, tests, MEP | 5 | `etape_close` avec le nom de l'étape | en partie (M-15) |
| Types de run menés : complet, version, mandat, conseil | 4 | le type déclaré à `run_open` | rarement (M-13) |
| Forges mobilisées : une par forge, 13 | 13 | `forge/mobilisation.jsonl`, forges « mobilisee » | rarement (M-14) |
| **Total** | **30** | | |

Exemple de progression : un utilisateur qui a mené un produit neuf de bout en bout (4 gestes, 5 étapes, 1 type de run, 7 forges mobilisées) totalise 17 jalons, soit une note de 57 sur 100.

### 5.3 Le côté ludique, sans gadget

La note monte par paliers visibles, et la boussole nomme toujours le jalon suivant et ce qu'il rapporte : « Prochain jalon : votre premier audit complet (+3) ». Chaque point est la trace d'un verdict ou d'un geste réel, conformément à la loi transverse 1 du `CLAUDE.md` (« toute affordance est câblée ou n'existe pas ») : aucun point ne se gagne en lisant ou en cliquant.

## 6. Ce que les traces permettent aujourd'hui

Les mesures ci-dessous prolongent celles de la version « g » ; elles ont été exécutées en lecture seule le 21/11/2026 à 12:12 sur les 15 produits instrumentés de la racine, et elles expliquent pourquoi un lot est consacré aux traces.

Le tableau se lit par mesure : ce qui a été compté, la valeur, et sa source rejouable. Les 15 journaux n'ont que 11 débuts distincts : 2 groupes de 3 journaux commencent à l'identique, signe de copies d'un même projet, ce qui gonfle un peu les comptes M-13 à M-16 sans changer leur conclusion.

| id | Mesure | Valeur | Source |
|---|---|---|---|
| M-13 | Ouvertures de run qui déclarent leur type | 8 sur 29 | `forge/ledger.jsonl` des 15 produits, événements `run_open` |
| M-14 | Produits dont la mobilisation des forges est tracée | 3 sur 15 | `forge/mobilisation.jsonl` |
| M-15 | Étapes closes sous un nom normalisé (conception 7, design 5, development 5, tests 7, mep 6) | 30 sur 1 382 étapes closes, les autres sous un intitulé libre | `forge/ledger.jsonl`, événements `etape_close`, champ `etape`, relevé à 12:15 |
| M-16 | Produits portant au moins un lot de retours | 15 sur 15 | `forge/retours/` |

Conséquence : sur les 30 jalons, les 4 premiers gestes se lisent dès aujourd'hui ; les étapes se lisent quand leur nom est normalisé ; les types de run et les forges mobilisées manquent le plus souvent. Sans un lot qui normalise ces traces (L-03), la note sous-compterait un utilisateur expérimenté.

## 7. Les lots, mis à jour

Le découpage passe de 4 à 6 lots, détaillés avec leurs critères dans `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121i.md`, qui remplace la démarche « e ». Le tableau dit ce que l'utilisateur voit de nouveau à chaque lot ; il se lit dans l'ordre de construction.

| Lot | Ce que l'utilisateur voit de nouveau | Jalon |
|---|---|---|
| L-01 Boussole sur tous les projets | la ligne d'ouverture, son niveau calculé sur tous ses projets du poste, l'état du projet ouvert | 2026-12-04 |
| L-02 Niveau annoncé et contenus | l'annonce de niveau, la question unique du poste vierge, les messages de chaque niveau, « où en suis-je ? » | 2026-12-11 |
| L-03 Traces normalisées et note sur 100 | la note et le prochain jalon, calculés sur des traces de type de run, d'étape et de mobilisation devenues fiables | 2026-12-18 |
| L-04 Progression synchronisée | « récupère ma progression » sur un autre poste, par le canal de reprise déjà déclaré | 2027-01-08 |
| L-05 Friction de premier tour | sa première réponse s'affiche une fois, sans réécriture | 2027-01-08 |
| L-06 Préférences par utilisateur | ses propres préférences remplacent celles du porteur, si le porteur le décide | 2027-01-15 |

## 8. Limites

Ces limites sont voulues, ou mesurées ; elles disent ce que la proposition ne promet pas.

- La note ne compte que le prouvé ; un utilisateur expérimenté qui arrive sans traces ni dossier synchronisé commence à 0 sur 100, même au niveau 4 annoncé.
- Un poste qui n'a ni les projets ni le dossier synchronisé ne voit que le niveau annoncé.
- Le fichier de progression ne porte aucun nom de projet ; il ne permet donc pas de savoir sur quel projet un jalon a été gagné, et c'est voulu.
- Le choix des préférences par utilisateur reste une question ouverte pour le porteur, et chaque lot ne part en construction que sur son accord, comme le prévoit la section « Gates humains » du mode opératoire du run de conseil.
