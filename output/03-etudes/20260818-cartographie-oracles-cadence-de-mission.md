---
destinataire: humain
---

# Digit-AI — Cartographie des oracles : les cinq artefacts de cadence — 20260818a

**TF-0324, critère d'acceptation n°2**, livré seul. Émis le 2026-08-18 par le pilot, sur mandat
humain (« fais les 6 ouverts »).

## Pourquoi ce document existe, et pourquoi il ne livre pas l'item

TF-0324 demande cinq artefacts de cadence de mission (revue RAID, rapport d'avancement, compte
rendu de réunion, REX de fin, suivi des bénéfices). Son **critère n°1** est un verrou :

> chaque artefact a un gabarit **ET au moins une instanciation sur une mission réelle**
> (jamais un gabarit seul)

Vérifié une quatrième fois le 18/08 : **aucune mission réelle n'est instrumentée dans les
dépôts.** `digit-ai-forge-seo/missions.json` ne porte que « Exemple Synthetique » et « Test »,
toutes deux pointant des répertoires temporaires. Les deux instanciations que documente
`pilote-de-mission` (APDLB 20-21/07, AO OPCO EP 21/07) sont des missions **closes, jouées hors
dépôt** : leur état n'existe nulle part, on ne peut donc rien y instancier.

Livrer les gabarits aujourd'hui produirait exactement ce que le critère interdit. **Ce n'est pas
un report : c'est l'item qui s'interdit lui-même**, et ce qui le débloquera est un fait — une
mission réelle instrumentée — pas une décision.

En revanche son **critère n°2** ne dépend d'aucune mission :

> pour chacun, **oracle applicable identifié ou entrée N0 écrite** en file des candidats

C'est ce que ce document livre. Il n'anticipe pas les gabarits : il dit, pour chacun des cinq,
**par quoi il serait jugé le jour où il existe** — et pour ceux qui n'ont pas de juge, il le dit
aussi. Le faire maintenant a un effet précis : le jour où une mission arrive, la question « et
qui juge ça ? » ne recommence pas à zéro.

## La cartographie

| artefact | oracle applicable | ce qu'il juge déjà | ce qui manquerait |
|---|---|---|---|
| **revue RAID** | `oracle-plan-de-mission.mjs` (forge-agents), **W5** | « registre de risques : ≥ 1 risque, chacun coté (probabilité, impact) avec propriétaire et parade » — le R de RAID est **déjà** couvert, W5 a été écrit pour ça (TF-0323) | A (actions), I (issues), D (décisions) n'ont aucune règle. **Extension de W5, pas oracle neuf** : même artefact, même schéma |
| **rapport d'avancement** | `oracle-claims.mjs` (quality-oracles) | le **contrôle des affirmations chiffrées** — c'est exactement le critère n°3 de l'item (« aucun chiffre non sourcé »), et il existe déjà, exécuté | rien pour la cadence elle-même (le rapport est-il à jour ?). Voir la ligne « cadence » ci-dessous |
| **compte rendu de réunion** | **aucun** | — | **entrée N0** : un compte rendu est de la prose structurée (présents, décisions, actions avec porteur et échéance). Le juge naturel est un oracle de complétude de champs, proche de `oracle-cdc-cadrage.mjs` dans sa forme |
| **REX de fin de mission** | `oracle-synthese.mjs` (pilot), **S1-S8** | un REX **est** un message de fin : blocs obligatoires, verdict factuel, non-traité motivé, écarts à la lettre, risques, actions par acteur. Huit règles applicables **telles quelles** | S2 (horodatage) et S4 (choix fermé) demandent vérification sur un REX réel — un REX n'attend pas de décision, donc S4 y serait « aucune », ce qui est déjà géré |
| **suivi des bénéfices** | `oracle-claims.mjs` + **N0** | les chiffres sourcés (critère n°3) | **entrée N0** : le propre du suivi de bénéfices est la comparaison **attendu ↔ constaté dans le temps**. Aucun oracle de l'écosystème ne juge une série temporelle. C'est le seul des cinq qui demande une capacité nouvelle |

## Deux constats que la cartographie fait apparaître

**1. Trois des cinq ont déjà leur juge, et deux d'entre eux sont exécutés aujourd'hui.** W5 de
`oracle-plan-de-mission` et S1-S8 d'`oracle-synthese` sont livrés et joués par leurs self-tests.
Le coût de l'item est donc plus bas que son score ne le suggère — l'essentiel du régime de preuve
existe.

**2. La cadence elle-même n'a aucun juge, et c'est le vrai trou.** L'item le dit : « la cadence
est une donnée d'instance, jamais une valeur codée ». Or aucun oracle ne sait répondre à « cet
artefact est-il à jour par rapport à sa cadence déclarée ? » — c'est-à-dire à la seule question
qui distingue un artefact de cadence d'un artefact ordinaire. `oracle-fraicheur-doc.mjs` du pilot
en est le plus proche parent : il compare un compte cité à un compte constaté. La transposition
serait « comparer une date de mise à jour à une périodicité déclarée ».

**C'est donc deux entrées N0, pas cinq** : le compte rendu (complétude de champs) et la
**cadence** (fraîcheur au regard d'une périodicité déclarée) — cette seconde étant transverse aux
cinq artefacts, et la seule capacité réellement nouvelle.

## Ce que ce document ne fait pas

Il n'écrit aucun gabarit, aucune règle, aucun oracle. Il ne passe TF-0324 en `decide` ni ne
recommande de le faire. Les deux entrées N0 ne sont pas ouvertes au registre : les ouvrir
maintenant créerait deux candidats dont l'instruction dépendrait du même fait manquant — une
mission. Elles sont **nommées ici** pour être reprises telles quelles le jour où ce fait existe.

## Plan de revue

**2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) une mission réelle est-elle
instrumentée — si oui, TF-0324 se débloque et cette cartographie est son point de départ ;
(2) les trois oracles identifiés jugent-ils encore ce que cette table leur prête (W5,
`oracle-claims`, S1-S8 peuvent avoir évolué) ; (3) un artefact de cadence a-t-il été produit
hors de ce cadre — auquel cas c'est le cadre qui a échoué, pas l'item.
