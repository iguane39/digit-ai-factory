# Retours forges — Produit-76 — 20260825b

- **Contexte** : retour humain reçu en clôture du run `20260825-audit-gate1b-et-conformite-factory` — « on ne comprend pas le contexte de la décision, de quoi parle-t-on ? ». L'enquête menée en réponse a confirmé que la règle existe et qu'elle est câblée, puis a mis au jour **deux défauts de gate** et **deux lacunes de registre** que le lot précédent ne portait pas.
- **Références ledger** : `forge\ledger.jsonl` seq 30 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

> **Ce lot ne conteste pas la règle S15.** Elle est écrite, elle est claire, elle est câblée, et
> rejouée à la main sur la restitution fautive elle rend **FAIL sur 4 décisions sur 4**. La faute
> de contexte est celle de l'agent. Ce qui est remonté ici est ce qui a **laissé passer** la faute.

---

## pilot (`digit-ai-factory`)

Un gate bloquant qui ne se rejoue pas après refus n'est pas un gate : c'est un avertissement à
usage unique. C'est le défaut que R-33 bis nomme lui-même — « un gate qu'on apprend à contourner
ne protège plus rien » — et il se produit ici par construction.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-2 | **bloquant** | générique | `oracles\hook-restitution.mjs` ligne 166 : `if (entree.stop_hook_active) process.exit(0);` — commentaire « déjà refusé une fois : on ne boucle pas, le verdict est journalisé ». **Conséquence mesurée le 25/08** : la restitution refusée sur S1/S3/S4/S6 a été réécrite, la réécriture **n'a jamais été rejugée**, et la restitution suivante — quatre décisions réduites à une étiquette et des options, sans rappel du sujet — a été acceptée. Rejouée à la main, elle rend `S15 FAIL — 4 décision(s) sur 4 sans rappel de leur sujet` et `S16 FAIL — 4 décision(s) sur 4 posée(s) sans trace d'instruction`. Fixture reproductible fournie avec ce lot. La garde anti-boucle protège d'une boucle infinie, et **désarme le contrôle dans le même geste** : la seule réécriture qui compte est celle qu'on ne juge pas. | Rejuger la réécriture au moins une fois — par exemple : autoriser **deux** refus par tour au lieu d'un, ou rejuger sans bloquer et **afficher le verdict à l'humain** quand `stop_hook_active` est vrai. Aujourd'hui le verdict est « journalisé », donc invisible du lecteur au moment où il compte. |
| RV-3 | majeur | générique | `oracle-conformite-projet` R-25 lit le type comme « premier mot du 2ᵉ segment », ce qui suppose un nom à **trois** segments `<Projet> - <Objet> - <date>`. Quand le **nom du projet contient lui-même le séparateur ` - `** — cas de ce produit, `Produit-76` — le 2ᵉ segment est la fin du nom de projet, et le type lu est un mot du nom de projet. Mesure du 25/08 : **12 constats R-25 sur 12 fichiers**, tous rendant « type « Ventilation » absent du registre », sur des livrables dont le type réel (`Rapport`, `Cahier`, `Dashboard`, `Note`, `Prompt`, `Runbook`, `Architecture`, `Décisions`) est **pourtant au registre**. Le message oriente vers le registre, jamais vers la cause. | Détecter le cas : si le mot lu apparaît **aussi** dans le 1ᵉʳ segment ou dans le nom du dossier produit, le dire — « le nom de projet semble contenir le séparateur, le type lu est probablement un mot du nom ». La correction est alors évidente pour le lecteur ; aujourd'hui elle demande de lire le code de l'oracle. |

## forge-organization (`digit-ai-forge-organization`)

Le registre des types est complet pour les livrables de la factory. Il l'est moins pour ceux
qu'un **kit client** prescrit, et le produit se retrouve alors à choisir entre un nom faux et un
FAIL.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RO-1 | majeur | générique | `registre-types.json` v1.2.0 (32 types) ne porte ni **`Fiche`** ni **`Présentation`**, alors que le kit d'audit POC-to-Prod Client-A **prescrit nommément** ces deux livrables : « Fiche sécurité mise à disposition (DEV) » et « Présentation Design Authority » (méthodologie §6, tableau des livrables attendus). R-25 dit « un type nouveau s'ajoute au registre dans un commit motivé (D-04), **jamais improvisé dans un nom** » : le produit ne peut donc ni les nommer justement, ni s'en écarter. Constaté le 25/08 sur deux livrables réellement produits. Les 30 autres types du registre couvrent le reste des livrables du run sans difficulté. | Ajouter `Fiche` et `Présentation` au registre, motivés par le kit d'audit Client-A. Plus généralement : quand un kit client prescrit un type de livrable, c'est un **motif d'ajout au registre**, pas un écart de produit — la porte D-04 devrait pouvoir être franchie sur cette seule justification. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'agent a cloné la factory depuis GitHub dans un répertoire temporaire alors qu'elle était **déjà installée** en dépôt frère (`c:\dev\digit-ai-factory`), et le clone était **6 commits en retard**. Verdict de conformité annoncé « 33 PASS / 1 FAIL » ; rejoué avec la factory installée : **14 FAIL** — R-25 déclarée « non jugeable » par le clone (registre des types introuvable) et R-47 ignorant deux artefacts d'héritage ajoutés depuis. | Héritage recomplété depuis la factory installée (`forge\travaux\TRAVAUX-PILOT.md`, `forge\travaux\oracle-travaux.mjs`, plus trois copies conformes remises à jour) ; tous les verdicts rejoués avec la factory installée. | non | `AGENTS.md` prescrit **déjà** la résolution correcte — `$FORGE_ROOT`, puis le parent, puis `c:\dev`, puis `~/.digit-ai-forge` — et `node bootstrap.mjs --pull` pour la fraîcheur. La règle existe, l'agent ne l'a pas suivie. Rien à généraliser : c'est une faute d'exécution, et elle est consignée ici pour qu'elle ne se reperde pas. |
| Quatre décisions rendues à l'humain sans rappel de leur sujet, en réduisant à une étiquette des décisions qui **portaient leur contexte** dans la restitution précédente. | Décisions réécrites avec leur rappel de sujet, leur recommandation et sa source. | non | S15 et S16 le disent déjà, et l'oracle les joue. Le défaut n'est pas dans la règle mais dans le fait de l'avoir jouée une fois puis relâchée — ce qui est précisément l'objet de RV-2. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot.

Le gabarit `gabarits\RESTITUTION.md` a en revanche été **appliqué** deux fois. Ce qui a manqué au
lecteur, dans ses mots : « on ne comprend pas le contexte de la décision, de quoi parle-t-on ? ».
Le gabarit portait pourtant la réponse — S15, 25 mots au moins, sans identifiant nu. Rien à
ajouter au texte : c'est son **exécution** qui a manqué, et c'est l'objet de RV-2.

## Confirmations positives

- **S15 et S16 fonctionnent.** Rejouées sur la restitution fautive, elles la rejettent, nommément
  et en comptant les décisions en défaut. La règle née du retour du 22/08 attrape exactement le
  défaut pour lequel elle a été écrite, un mois plus tard, sur un autre produit.
- **Le message de S15 est utilisable tel quel** : il rappelle *pourquoi* (« un identifiant ne
  désigne rien pour qui ne l'a pas écrit ») et *quoi faire* (« 25 mots au moins qui disent DE QUOI
  on parle »). Aucun aller-retour n'a été nécessaire pour comprendre la correction.
- **R-47 a fait son travail deux fois** : à l'ouverture, en révélant quatre artefacts d'héritage
  absents ; et aujourd'hui, en révélant deux artefacts **ajoutés depuis** que le produit n'avait
  pas — c'est le contrôle de fraîcheur que sa fiche annonce, et il a tenu.
- **`HERITAGE.json` est exploitable en machine** : la vérification artefact par artefact, mode par
  mode, s'écrit en dix lignes et rend un état complet. C'est ce qui a permis de corriger l'écart
  en une passe plutôt qu'en devinant.

## Ordre recommandé

1. **RV-2** — c'est le seul retour bloquant du lot, et il conditionne la valeur de tous les autres
   contrôles de restitution : tant qu'une réécriture n'est pas rejugée, l'oracle ne protège que le
   premier jet.
2. **RO-1** — deux lignes de registre, et deux familles de livrables clients cessent d'être en
   faute par construction.
3. **RV-3** — confort de diagnostic, mais 12 constats identiques et muets sur leur cause coûtent
   plus cher à lire qu'un seul constat qui nomme le problème.
