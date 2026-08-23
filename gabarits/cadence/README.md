---
role: les cinq artefacts de CADENCE d'une mission longue — ce qui revient chaque semaine, dérivé de l'état, jamais un second état
sources_de_verite: [todo/TODO.jsonl, forge/ledger.jsonl du produit, DECISIONS.md du produit, scripts/generer-avancement.mjs]
verifie_le: 2026-08-23
---

# Cadence — les cinq artefacts d'une mission longue

## Ce qui manquait, et ce que ce dossier n'est pas

La forge couvre le **build** (produire, vérifier, juger) et le **pilotage** (plan, adaptation).
Elle ne couvrait pas la **cadence** : l'artefact qui revient chaque semaine et que tout
commanditaire de mission longue attend. Constat revérifié avant d'écrire : zéro occurrence de
« RAID », « compte rendu », « rapport d'avancement » ou « lessons learned » dans les skills
installés.

**Ce dossier n'ajoute aucun état.** La matière existe déjà — statuts du registre, journal des
décisions, ledger du run, chemin critique. Ce qui manquait est la **vue d'assemblage**, la
**cadence**, et le **régime de preuve** propre à chaque artefact. Un artefact de cadence qui
porterait son propre état serait un second domicile qui dérive en silence : c'est exactement ce que
la règle du 23/08 interdit (`CONTRAT-INTERFACE.md` § 3 quater).

## Les cinq, et comment les lire

Le tableau se lit par ligne : chaque artefact dit **d'où il tire sa matière** (jamais de saisie
libre là où une source existe), **à quelle cadence** il revient, et **ce qui le rend opposable**.
La colonne cadence porte une valeur d'exemple : *la cadence est une donnée d'INSTANCE, jamais une
valeur codée en spécification* — une mission mensuelle et une mission hebdomadaire emploient les
mêmes gabarits.

| Artefact | Matière (l'état qui existe déjà) | Cadence typique | Régime de preuve |
|---|---|---|---|
| `RAID.md` | items ouverts du registre, `non_juge` des oracles, dépendances du contrat d'interface | hebdomadaire | chaque ligne porte sa date de relevé et son propriétaire ; un risque sans propriétaire est un vœu |
| `AVANCEMENT.md` | **généré** depuis `todo/TODO.jsonl` par `scripts/generer-avancement.mjs` | hebdomadaire | **aucun chiffre saisi à la main** : tout nombre vient du registre, donc rien à sourcer après coup |
| `COMPTE-RENDU.md` | décisions prises pendant la réunion, questions posées, actions | par réunion | chaque action nomme son acteur et sa date ; une action sans acteur n'existe pas (vocabulaire de `RESTITUTION.md`) |
| `REX.md` | ledger du run, items clos sur gains constatés, écarts déclarés | fin de mission | chaque enseignement cite le FAIT qui l'a produit — un enseignement sans fait est une opinion |
| `BENEFICES.md` | gains constatés des items clos, mesures avant/après | mensuel, puis à 3 mois | un bénéfice porte sa mesure AVANT et sa mesure APRÈS, ou il se déclare non mesuré |

## Ce qui est déjà outillé, et ce qui reste manuel

**Outillé** : `AVANCEMENT.md` se **génère** (`node scripts\generer-avancement.mjs`). C'est le seul
des cinq dont tous les chiffres sont dérivés, donc le seul qui ne peut pas dériver — et c'est
délibérément celui-là qu'on a outillé d'abord, parce que c'est celui qui porte des chiffres.

**Manuel, et assumé** : les quatre autres demandent un jugement (un risque se pèse, un
enseignement se formule, un bénéfice s'attribue). Leur gabarit impose la **forme** — champs
obligatoires, propriétaire, date, source — et l'oracle applicable à chacun est nommé dans son
en-tête. Ce qui n'a **pas** d'oracle le dit : c'est une entrée en file des candidats, pas un
silence.
