# output\ — rangement (13/08/2026, amendé le 18/08/2026 — TF-0339)

Livrables du pilot rangés en dossiers numérotés par famille ; **une seule version à la
racine de chaque dossier, versions antérieures dans `old\`** (mandat humain du 13/08).
Le nom des fichiers ne change jamais (`<Projet> - <Objet> - AAAAMMJJ<indice>`, règle
`references\ETAPES-RUN.md`) : seul leur emplacement change.

| Dossier | Famille | Contenu |
|---|---|---|
| `01-revues-et-propositions\` | Revues et propositions d'écosystème | Revue Écosystème 20260808a (+ sidecars `.oracles*`), Proposition Tuyauterie cognitive 20260809a |
| `02-schema-ecosysteme\` | Schéma d'écosystème (HTML) | version courante : `20260820a.html` (V14, forge-seo-geo — TF-0412) ; `old\` : 20260810a.png, 20260811h.html, 20260812a.html, 20260812b.html, 20260813a.html + `.oracles\` (rendus 20260811h) |
| `03-etudes\` | Études d'opportunité | opportunité forges (12/08), forge-data × moteurs (12/08), personas agents (13/08) |
| `04-plans\` | Plans stratégiques | stratégie tests e2e (13/08) |
| `05-catalogues-readmes-forges\` | Sections catalogue proposées aux README des forges | 13 sections + LISEZMOI (générées depuis `catalogues\catalogue.jsonl`) |
| `05-insatisfactions\` | Dossiers d'instruction des insatisfactions (TF-0287) | un dossier par insatisfaction (`INS-XXXX\`), chemins portés par `insatisfactions\REGISTRE.jsonl` |
| `06-travaux-confies\` | Originaux des lots de travaux confiés par le pilot à une forge ou à un produit (gabarit `gabarits\TRAVAUX-PILOT.md`, jugés T1-T6 avant dépôt) | `pilot - TRAVAUX - AAAAMMJJ<i>.md` + sidecar `.tf.jsonl` ; la copie déposée chez le destinataire (`input\00-travaux\`) est la seule qui change de statut (05/09) |

**Deux familles portent le numéro 05, et ce n'est pas une erreur à corriger — c'est une
erreur à DÉCLARER (TF-0339, 18/08).** `05-insatisfactions\` a été créée sans prendre le
premier numéro libre, qui était 06 : la collision est réelle et contraire à D-15. Elle n'est
pourtant PAS résolue par un renumérotage, et R-39 al. 2 dit pourquoi — « le numéro s'attribue à
la création et ne se renumérote JAMAIS : un renumérotage casse les chemins portés par les
registres à événements figés ». Vérifié avant d'écrire ces lignes, et c'est ce qui tranche :
les DEUX familles sont citées dans des registres figés — `todo\TODO.jsonl` porte les deux,
`todo\TODO-ARCHIVE.jsonl` et `insatisfactions\REGISTRE.jsonl` portent
`05-insatisfactions\` (dont le dossier d'INS-0001). Déplacer l'une ou l'autre romprait des
chemins que ces registres ne réécrivent jamais. Ce qui rend la collision tenable : le numéro est
LOCAL au dépôt, le nom de famille est canonique (D-16) — c'est le nom qui identifie, le numéro
qui ordonne. **Conséquence opérationnelle : la prochaine famille créée ici prend `06-`.**

Correspondance des anciens chemins (références des documents antérieurs à ce rangement,
notamment les événements du registre `todo\TODO.jsonl`, jamais réécrits) :

- `output\Digit-AI - Revue Forge - …` → `output\01-revues-et-propositions\…`
- `output\Digit-AI - Proposition Forge - …` → `output\01-revues-et-propositions\…`
- `output\Forge Pilot - Schéma Écosystème - …` → `output\02-schema-ecosysteme\…` (ou `…\old\`)
- `output\.oracles\` → `output\02-schema-ecosysteme\old\.oracles\`
- `output\20260812-etude-*.md`, `output\20260813-etude-*.md` → `output\03-etudes\…`
- `output\20260813-plan-*.md` → `output\04-plans\…`
- `output\20260812-catalogues-readmes-forges\` → `output\05-catalogues-readmes-forges\`

**Archivage du 24/08/2026 (TF-0562 — décision humaine, voie (c)).** Un livrable remis le 15/08 est
passé en `old\` : il rendait **PASS au rendu** et **FAIL au marquage** sous le jeu de règles courant,
sur **cinq familles nées après sa production** — titre sans indice daté, favicon absent, ponctuation
orpheline (×2), composant déclaré sans style, onglets sans panneau (×2).

*Il n'a pas été corrigé, et c'est la règle qui l'impose* : une nouvelle version est un nouveau fichier
daté, jamais un écrasement (R-5). Son **sceau de jugement l'accompagne** dans `old\`, pour que la
preuve reste attachée à l'artefact — vérifié après déplacement : « 1 livrable scellé vérifié, aucun
modifié après jugement ».

- `output\01-revues-et-propositions\Produit-02 - Maquette Vue d'ensemble - Rapport SEO -
  20260815a.html` → `output\01-revues-et-propositions\old\…` (même nom, dossier `old\`)

*Le document frère qui le cite — `Produit-02 - Proposition Refonte - Rapport SEO -
20260815a.md` — n'a **pas** été modifié : il est lui-même scellé, et rouvrir un livrable remis pour
corriger un chemin casserait son sceau. C'est précisément le rôle de cette table de correspondance.*

Même méthode appliquée le 13/08 aux `output\` des forges : agents (01-pv, 02-skills),
design (01-pages-temoins), organization (01-etudes, 02-composants), seo (01-decisions,
02-veille). forge-audit_client-a était déjà conforme (modèle d'origine : `01-…`/`07-…` + `old\`).

<!-- index-livrables:debut — genere par scripts/generer-lisezmoi-output.mjs, NE PAS EDITER A LA MAIN -->

## Index des livrables — le point d'entrée cliquable

**Pourquoi cet index existe, et il vaut d'être lu une fois.** Le nom d'un livrable porte sa
date et son indice — donc au moins trois espaces. Or le résolveur de liens de la session de
travail **coupe le chemin au premier espace** : un livrable n'est jamais atteignable au clic,
ni tel quel, ni encodé, ni entre chevrons. Mesuré le 24/08/2026 sur un produit : **22
livrables, 0 atteignable**, pendant 11 jours sans que la cause soit nommée.

Ce fichier-ci n'a pas d'espace dans son nom : il s'ouvre. Les chemins ci-dessous sont donnés
à **copier-coller** — c'est ce qui marche aujourd'hui, et le dire vaut mieux que laisser
essayer. *Le nom daté n'est pas le problème : il porte la version et la traçabilité.*

**État** : 562 livrable(s) courant(s), 6 archivé(s), 7 famille(s).

### 01-revues-et-propositions

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| 20260825-releve-heritage-produits.md | — | 5.7 Ko | `01-revues-et-propositions/20260825-releve-heritage-produits.md` |
| Digit-AI - Proposition Architecture - Circuit - 20260815d.md | 20260815d | 5.4 Ko | `01-revues-et-propositions/Digit-AI - Proposition Architecture - Circuit - 20260815d.md` |
| Digit-AI - Proposition Forge - Restitution lisible - 20260815a.md | 20260815a | 11 Ko | `01-revues-et-propositions/Digit-AI - Proposition Forge - Restitution lisible - 20260815a.md` |
| Digit-AI - Proposition Forge - Tuyauterie cognitive - 20260809a.md | 20260809a | 9.4 Ko | `01-revues-et-propositions/Digit-AI - Proposition Forge - Tuyauterie cognitive - 20260809a.md` |
| Digit-AI - Revue - Prompt strategie de lancement des agents passe au crible L99 - 20261029a.md | 20261029a | 26.9 Ko | `01-revues-et-propositions/Digit-AI - Revue - Prompt strategie de lancement des agents passe au crible L99 - 20261029a.md` |
| Digit-AI - Revue - Prompt strategie de lancement des agents passe au crible L99 - 20261029a.md.boucle.json | — | 14.6 Ko | `01-revues-et-propositions/Digit-AI - Revue - Prompt strategie de lancement des agents passe au crible L99 - 20261029a.md.boucle.json` |
| Digit-AI - Revue D8 - Restitutions du 15-08 - 20260815c.md | 20260815c | 3.7 Ko | `01-revues-et-propositions/Digit-AI - Revue D8 - Restitutions du 15-08 - 20260815c.md` |
| Digit-AI - Revue Forge - Écosystème - 20260808a.md | 20260808a | 11.2 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260808a.md` |
| Digit-AI - Revue Forge - Écosystème - 20260819a.md | 20260819a | 6 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260819a.md` |
| Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html *(archivé)* | 20260815a | 34.6 Ko | `01-revues-et-propositions/old/Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html` |
| Produit-02 - Proposition Refonte - Rapport SEO - 20260815b.md | 20260815b | 6.9 Ko | `01-revues-et-propositions/Produit-02 - Proposition Refonte - Rapport SEO - 20260815b.md` |

### 02-schema-ecosysteme

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| Forge Pilot - Schéma Écosystème - 20260820a.html | 20260820a | 57.3 Ko | `02-schema-ecosysteme/Forge Pilot - Schéma Écosystème - 20260820a.html` |
| Forge Pilot - Schéma Écosystème - 20260811h.html *(archivé)* | 20260811h | 52.5 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260811h.html` |
| Forge Pilot - Schéma Écosystème - 20260812a.html *(archivé)* | 20260812a | 55.3 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260812a.html` |
| Forge Pilot - Schéma Écosystème - 20260812b.html *(archivé)* | 20260812b | 56.7 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260812b.html` |
| Forge Pilot - Schéma Écosystème - 20260813a.html *(archivé)* | 20260813a | 56.8 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260813a.html` |

### 03-etudes

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| 20260812-etude-forge-data-moteurs.md | — | 7.3 Ko | `03-etudes/2026-08/20260812-etude-forge-data-moteurs.md` |
| 20260812-etude-opportunite-forges.md | — | 15 Ko | `03-etudes/2026-08/20260812-etude-opportunite-forges.md` |
| 20260813-etude-opportunite-outillage-analyse.md | — | 19.8 Ko | `03-etudes/2026-08/20260813-etude-opportunite-outillage-analyse.md` |
| 20260813-etude-personas-agents.md | — | 11.3 Ko | `03-etudes/2026-08/20260813-etude-personas-agents.md` |
| 20260814-etude-opportunite-pans-tests-prompts.md | — | 18.4 Ko | `03-etudes/2026-08/20260814-etude-opportunite-pans-tests-prompts.md` |
| 20260814-etude-opportunite-pentest-owasp.md | — | 17.2 Ko | `03-etudes/2026-08/20260814-etude-opportunite-pentest-owasp.md` |
| 20260814-etude-opportunite-taste-skill.md | — | 14.4 Ko | `03-etudes/2026-08/20260814-etude-opportunite-taste-skill.md` |
| 20260815-etude-opportunite-ce-que-personne-ne-juge.md | — | 6.4 Ko | `03-etudes/2026-08/20260815-etude-opportunite-ce-que-personne-ne-juge.md` |
| 20260815-etude-opportunite-circuit-insatisfaction.md | — | 5.3 Ko | `03-etudes/2026-08/20260815-etude-opportunite-circuit-insatisfaction.md` |
| 20260815-etude-opportunite-cout-du-faux-positif.md | — | 6.9 Ko | `03-etudes/2026-08/20260815-etude-opportunite-cout-du-faux-positif.md` |
| 20260815-etude-opportunite-lecons-audit-reel.md | — | 5.6 Ko | `03-etudes/2026-08/20260815-etude-opportunite-lecons-audit-reel.md` |
| 20260815-etude-opportunite-qualite-graphique.md | — | 5.6 Ko | `03-etudes/2026-08/20260815-etude-opportunite-qualite-graphique.md` |
| 20260815-etude-opportunite-restitution-lisible.md | — | 6.3 Ko | `03-etudes/2026-08/20260815-etude-opportunite-restitution-lisible.md` |
| 20260816-etude-skills-animation-motion.md | — | 10.7 Ko | `03-etudes/2026-08/20260816-etude-skills-animation-motion.md` |
| 20260817-etude-opportunite-cadence-de-mission.md | — | 24 Ko | `03-etudes/2026-08/20260817-etude-opportunite-cadence-de-mission.md` |
| 20260817-etude-opportunite-consignes-de-mise-a-jour.md | — | 20.1 Ko | `03-etudes/2026-08/20260817-etude-opportunite-consignes-de-mise-a-jour.md` |
| 20260817-etude-opportunite-conventions-parametrables.md | — | 20.6 Ko | `03-etudes/2026-08/20260817-etude-opportunite-conventions-parametrables.md` |
| 20260817-etude-opportunite-couverture-par-role.md | — | 5.4 Ko | `03-etudes/2026-08/20260817-etude-opportunite-couverture-par-role.md` |
| 20260817-etude-opportunite-ecart-servi-versionne.md | — | 6.3 Ko | `03-etudes/2026-08/20260817-etude-opportunite-ecart-servi-versionne.md` |
| 20260817-etude-opportunite-publication-livrables.md | — | 6.3 Ko | `03-etudes/2026-08/20260817-etude-opportunite-publication-livrables.md` |
| 20260817-etude-opportunite-rangement-output.md | — | 18.3 Ko | `03-etudes/2026-08/20260817-etude-opportunite-rangement-output.md` |
| 20260817-etude-opportunite-renommage-factory.md | — | 22.8 Ko | `03-etudes/2026-08/20260817-etude-opportunite-renommage-factory.md` |
| 20260817-etude-opportunite-sequencement-factory.md | — | 44.8 Ko | `03-etudes/2026-08/20260817-etude-opportunite-sequencement-factory.md` |
| 20260817-etude-opportunite-tests-bout-en-bout.md | — | 27.2 Ko | `03-etudes/2026-08/20260817-etude-opportunite-tests-bout-en-bout.md` |
| 20260817-etude-opportunite-todo-produit.md | — | 27.4 Ko | `03-etudes/2026-08/20260817-etude-opportunite-todo-produit.md` |
| 20260818-cartographie-oracles-cadence-de-mission.md | — | 5.7 Ko | `03-etudes/2026-08/20260818-cartographie-oracles-cadence-de-mission.md` |
| 20260818-etude-opportunite-admission-digit-ai-queue.md | — | 14.8 Ko | `03-etudes/2026-08/20260818-etude-opportunite-admission-digit-ai-queue.md` |
| 20260818-etude-opportunite-cablage-orchestrer-boucle.md | — | 12.4 Ko | `03-etudes/2026-08/20260818-etude-opportunite-cablage-orchestrer-boucle.md` |
| 20260818-etude-opportunite-memoire-partagee.md | — | 25.4 Ko | `03-etudes/2026-08/20260818-etude-opportunite-memoire-partagee.md` |
| 20260818-etude-opportunite-retour-usage-vers-delta.md | — | 9.1 Ko | `03-etudes/2026-08/20260818-etude-opportunite-retour-usage-vers-delta.md` |
| 20260819-etude-opportunite-forge-consulting.md | — | 13.3 Ko | `03-etudes/2026-08/20260819-etude-opportunite-forge-consulting.md` |
| 20260819-etude-opportunite-meta-oracle-enclenchement.md | — | 16.8 Ko | `03-etudes/2026-08/20260819-etude-opportunite-meta-oracle-enclenchement.md` |
| 20260819-etude-opportunite-module-de-traduction.md | — | 16.3 Ko | `03-etudes/2026-08/20260819-etude-opportunite-module-de-traduction.md` |
| 20260819-etude-opportunite-retro-documentation.md | — | 9.5 Ko | `03-etudes/2026-08/20260819-etude-opportunite-retro-documentation.md` |
| 20260819-etude-opportunite-retro-engineering.md | — | 10.3 Ko | `03-etudes/2026-08/20260819-etude-opportunite-retro-engineering.md` |
| 20260820-etude-opportunite-communication-interlocuteur.md | — | 10.4 Ko | `03-etudes/2026-08/20260820-etude-opportunite-communication-interlocuteur.md` |
| 20260820-etude-opportunite-rgaa.md | — | 12.9 Ko | `03-etudes/2026-08/20260820-etude-opportunite-rgaa.md` |
| 20260822-etude-opportunite-fraicheur-des-verdicts.md | — | 13.8 Ko | `03-etudes/2026-08/20260822-etude-opportunite-fraicheur-des-verdicts.md` |
| 20260822-etude-opportunite-troisieme-point-observation-i18n.md | — | 8.1 Ko | `03-etudes/2026-08/20260822-etude-opportunite-troisieme-point-observation-i18n.md` |
| 20260822-etude-opportunite-vue-portefeuille.md | — | 8.4 Ko | `03-etudes/2026-08/20260822-etude-opportunite-vue-portefeuille.md` |
| 20260830-L99-etat-de-l-art-marche.md | — | 26.9 Ko | `03-etudes/2026-08/20260830-L99-etat-de-l-art-marche.md` |
| 20260831-opportunite-etat-de-l-art-marche.md | — | 9 Ko | `03-etudes/2026-08/20260831-opportunite-etat-de-l-art-marche.md` |
| 20260901-etude-dataforseo-cadrage-v2.md | — | 8.6 Ko | `03-etudes/2026-09/20260901-etude-dataforseo-cadrage-v2.md` |
| 20260901-etude-opportunite-dataforseo.md | — | 20.6 Ko | `03-etudes/2026-09/20260901-etude-opportunite-dataforseo.md` |
| 20260901-etude-opportunite-donnees-de-recherche.md | — | 20.6 Ko | `03-etudes/2026-09/20260901-etude-opportunite-donnees-de-recherche.md` |
| 20260901-etude-opportunite-strategie-tests.md | — | 23.9 Ko | `03-etudes/2026-09/20260901-etude-opportunite-strategie-tests.md` |
| 20260902-etude-opportunite-dataforseo-produit-02.md | — | 43.7 Ko | `03-etudes/2026-09/20260902-etude-opportunite-dataforseo-produit-02.md` |
| 20260903-L99-amelioration-continue.md | — | 42.3 Ko | `03-etudes/2026-09/20260903-L99-amelioration-continue.md` |
| 20260903-recidives-mesure.md | — | 7.3 Ko | `03-etudes/2026-09/20260903-recidives-mesure.md` |
| 20260907-etude-opportunite-mission-data-silver-gold-powerbi.html | — | 133.4 Ko | `03-etudes/2026-09/20260907-etude-opportunite-mission-data-silver-gold-powerbi.html` |
| 20260907-etude-opportunite-mission-data-silver-gold-powerbi.md | — | 46.5 Ko | `03-etudes/2026-09/20260907-etude-opportunite-mission-data-silver-gold-powerbi.md` |
| 20260907-L99-mission-data-silver-gold-powerbi.md | — | 47.5 Ko | `03-etudes/2026-09/20260907-L99-mission-data-silver-gold-powerbi.md` |
| 20260908-pourquoi-on-reecrit-l-histoire-et-comment-cesser.md | — | 10.9 Ko | `03-etudes/2026-09/20260908-pourquoi-on-reecrit-l-histoire-et-comment-cesser.md` |
| 20260911-etude-opportunite-communication-marketing-ao.html | — | 141.1 Ko | `03-etudes/2026-09/20260911-etude-opportunite-communication-marketing-ao.html` |
| 20260911-etude-opportunite-communication-marketing-ao.md | — | 48.9 Ko | `03-etudes/2026-09/20260911-etude-opportunite-communication-marketing-ao.md` |
| 20260911-L99-forge-communication-marketing.md | — | 52.4 Ko | `03-etudes/2026-09/20260911-L99-forge-communication-marketing.md` |
| 20260911-L99-regles-d-ecriture-factory.md | — | 58.5 Ko | `03-etudes/2026-09/20260911-L99-regles-d-ecriture-factory.md` |
| 20260914-etude-opportunite-conception-documentaire-amont.html | — | 112.4 Ko | `03-etudes/2026-09/20260914-etude-opportunite-conception-documentaire-amont.html` |
| 20260914-etude-opportunite-conception-documentaire-amont.md | — | 27.4 Ko | `03-etudes/2026-09/20260914-etude-opportunite-conception-documentaire-amont.md` |
| 20260914-etude-opportunite-personas-par-phase.html | — | 110.9 Ko | `03-etudes/2026-09/20260914-etude-opportunite-personas-par-phase.html` |
| 20260914-etude-opportunite-personas-par-phase.md | — | 26.4 Ko | `03-etudes/2026-09/20260914-etude-opportunite-personas-par-phase.md` |
| 20260914-etude-opportunite-premiers-html-nouveaux-formats.md | — | 31.2 Ko | `03-etudes/2026-09/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` |
| 20260914-L99-conception-documentaire-amont.md | — | 36.8 Ko | `03-etudes/2026-09/20260914-L99-conception-documentaire-amont.md` |
| 20260914-L99-personas-par-phase.md | — | 34.9 Ko | `03-etudes/2026-09/20260914-L99-personas-par-phase.md` |
| 20260914-L99-qualite-premiers-html-nouveaux-formats.md | — | 57.9 Ko | `03-etudes/2026-09/20260914-L99-qualite-premiers-html-nouveaux-formats.md` |
| 20260914-personas-mesure-baseline.md | — | 19.5 Ko | `03-etudes/2026-09/20260914-personas-mesure-baseline.md` |
| 20260914-personas-mesure-echantillon.md | — | 5.8 Ko | `03-etudes/2026-09/20260914-personas-mesure-echantillon.md` |
| 20260914-personas-mesure-fiches.md | — | 5.5 Ko | `03-etudes/2026-09/20260914-personas-mesure-fiches.md` |
| 20260914-personas-mesure-passes.md | — | 54.9 Ko | `03-etudes/2026-09/20260914-personas-mesure-passes.md` |
| 20260914-personas-mesure-protocole.md | — | 4.4 Ko | `03-etudes/2026-09/20260914-personas-mesure-protocole.md` |
| 20260914-releve-restes-archives.md | — | 6.5 Ko | `03-etudes/2026-09/20260914-releve-restes-archives.md` |
| 20260915-etude-opportunite-inventaire-des-composants.html | — | 102.6 Ko | `03-etudes/2026-09/20260915-etude-opportunite-inventaire-des-composants.html` |
| 20260915-etude-opportunite-inventaire-des-composants.md | — | 22.9 Ko | `03-etudes/2026-09/20260915-etude-opportunite-inventaire-des-composants.md` |
| 20260917-etude-opportunite-gestion-reseaux-sociaux.html | — | 129.3 Ko | `03-etudes/2026-09/20260917-etude-opportunite-gestion-reseaux-sociaux.html` |
| 20260917-etude-opportunite-gestion-reseaux-sociaux.md | — | 39.7 Ko | `03-etudes/2026-09/20260917-etude-opportunite-gestion-reseaux-sociaux.md` |
| 20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.html | — | 97.8 Ko | `03-etudes/2026-09/20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.html` |
| 20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.md | — | 20.8 Ko | `03-etudes/2026-09/20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.md` |
| 20260917-L99-gestion-reseaux-sociaux.md | — | 45.7 Ko | `03-etudes/2026-09/20260917-L99-gestion-reseaux-sociaux.md` |
| 20260917-L99-revue-hebdomadaire-amelioration-continue.md | — | 36.5 Ko | `03-etudes/2026-09/20260917-L99-revue-hebdomadaire-amelioration-continue.md` |
| 20260917-releve-autres-reseaux-sociaux.md | — | 8.3 Ko | `03-etudes/2026-09/20260917-releve-autres-reseaux-sociaux.md` |
| 20260917-revue-hebdomadaire-mesure-pas0.md | — | 21.2 Ko | `03-etudes/2026-09/20260917-revue-hebdomadaire-mesure-pas0.md` |
| 20260919-etude-opportunite-plan-d-amelioration-post-audit.html | — | 116.2 Ko | `03-etudes/2026-09/20260919-etude-opportunite-plan-d-amelioration-post-audit.html` |
| 20260919-etude-opportunite-plan-d-amelioration-post-audit.md | — | 33 Ko | `03-etudes/2026-09/20260919-etude-opportunite-plan-d-amelioration-post-audit.md` |
| 20260919-L99-audit-et-plan-d-amelioration-plateforme.md | — | 43.3 Ko | `03-etudes/2026-09/20260919-L99-audit-et-plan-d-amelioration-plateforme.md` |
| 20260921-etude-opportunite-reseaux-sociaux-complement.md | — | 26.1 Ko | `03-etudes/2026-09/20260921-etude-opportunite-reseaux-sociaux-complement.md` |
| 20260922-etude-opportunite-messagerie-inter-sessions.md | — | 35.6 Ko | `03-etudes/2026-09/20260922-etude-opportunite-messagerie-inter-sessions.md` |
| 20260922-L99-echanges-inter-session.md | — | 28.3 Ko | `03-etudes/2026-09/20260922-L99-echanges-inter-session.md` |
| 20260922-revue-des-candidatures-par-famille.md | — | 11.7 Ko | `03-etudes/2026-09/20260922-revue-des-candidatures-par-famille.md` |
| 20260925-etude-opportunite-niveaux-d-intervention.md | — | 47.9 Ko | `03-etudes/2026-09/20260925-etude-opportunite-niveaux-d-intervention.md` |
| 20260925-L99-niveaux-d-intervention.md | — | 51 Ko | `03-etudes/2026-09/20260925-L99-niveaux-d-intervention.md` |
| 20260927-L99-saut-opus-5-vers-opus-5-5.md | — | 54.1 Ko | `03-etudes/2026-09/20260927-L99-saut-opus-5-vers-opus-5-5.md` |
| 20261001-etude-opportunite-rsi-et-ssl.md | — | 30 Ko | `03-etudes/20261001-etude-opportunite-rsi-et-ssl.md` |
| 20261001-etude-opportunite-saut-opus-5-5.md | — | 37.1 Ko | `03-etudes/20261001-etude-opportunite-saut-opus-5-5.md` |
| 20261001-etude-opportunite-textes-affiches.md | — | 18.2 Ko | `03-etudes/20261001-etude-opportunite-textes-affiches.md` |
| 20261001-etude-resultats-rejeu-opus-5-5.md | — | 13.7 Ko | `03-etudes/20261001-etude-resultats-rejeu-opus-5-5.md` |
| 20261001-L99-etude-textes-relance.md | — | 13.8 Ko | `03-etudes/20261001-L99-etude-textes-relance.md` |
| 20261001-L99-textes-affiches-en-session.md | — | 14.2 Ko | `03-etudes/20261001-L99-textes-affiches-en-session.md` |
| 20261003-etude-opportunite-pages-html-indicateurs.md | — | 16.3 Ko | `03-etudes/20261003-etude-opportunite-pages-html-indicateurs.md` |
| 20261013-etude-opportunite-juge-de-comprehension.md | — | 21.9 Ko | `03-etudes/20261013-etude-opportunite-juge-de-comprehension.md` |
| 20261013-revue-essai-niveaux-d-intervention.md | — | 10.5 Ko | `03-etudes/20261013-revue-essai-niveaux-d-intervention.md` |
| 20261016-etude-opportunite-boucle-l99-jusqu-a-un-score.md | — | 12.9 Ko | `03-etudes/20261016-etude-opportunite-boucle-l99-jusqu-a-un-score.md` |
| 20261018-etude-opportunite-connexion-sources-google.md | — | 32.4 Ko | `03-etudes/20261018-etude-opportunite-connexion-sources-google.md` |
| 20261018-etude-opportunite-flotte-d-agents.md | — | 22.7 Ko | `03-etudes/20261018-etude-opportunite-flotte-d-agents.md` |
| 20261018-etude-opportunite-relecteur-d-intention-v2.md | — | 18 Ko | `03-etudes/20261018-etude-opportunite-relecteur-d-intention-v2.md` |
| 20261018-etude-opportunite-relecteur-d-intention.md | — | 18.3 Ko | `03-etudes/20261018-etude-opportunite-relecteur-d-intention.md` |
| 20261018-etude-opportunite-tableau-de-bord-pilotage.md | — | 35.4 Ko | `03-etudes/20261018-etude-opportunite-tableau-de-bord-pilotage.md` |
| 20261018-L99-relecteur-critique-d-intention.md | — | 22.7 Ko | `03-etudes/20261018-L99-relecteur-critique-d-intention.md` |
| 20261018-mesure-relecteur-d-intention.json | — | 14.7 Ko | `03-etudes/20261018-mesure-relecteur-d-intention.json` |
| 20261019-etude-opportunite-animation-finition-interfaces.md | — | 21.2 Ko | `03-etudes/20261019-etude-opportunite-animation-finition-interfaces.md` |
| 20261019-etude-opportunite-base-connaissance-wiki.md | — | 21.2 Ko | `03-etudes/20261019-etude-opportunite-base-connaissance-wiki.md` |
| 20261019-etude-opportunite-check-list-avant-mise-en-ligne.md | — | 22 Ko | `03-etudes/20261019-etude-opportunite-check-list-avant-mise-en-ligne.md` |
| 20261019-etude-opportunite-jeton-abonnement-taches-sans-ecran.md | — | 21.8 Ko | `03-etudes/20261019-etude-opportunite-jeton-abonnement-taches-sans-ecran.md` |
| 20261019-etude-opportunite-modele-local-sans-gpu.md | — | 23 Ko | `03-etudes/20261019-etude-opportunite-modele-local-sans-gpu.md` |
| 20261019-etude-opportunite-packs-agents-skills-tiers.md | — | 27 Ko | `03-etudes/20261019-etude-opportunite-packs-agents-skills-tiers.md` |
| 20261019-etude-opportunite-pilotage-ordinateur-a-distance.md | — | 29.3 Ko | `03-etudes/20261019-etude-opportunite-pilotage-ordinateur-a-distance.md` |
| 20261019-etude-opportunite-retro-ingenierie-par-agents.md | — | 20.8 Ko | `03-etudes/20261019-etude-opportunite-retro-ingenierie-par-agents.md` |
| 20261019-etude-opportunite-service-marketing-agents.md | — | 21.5 Ko | `03-etudes/20261019-etude-opportunite-service-marketing-agents.md` |
| 20261019-etude-opportunite-sessions-paralleles-paliers-autonomie.md | — | 24 Ko | `03-etudes/20261019-etude-opportunite-sessions-paralleles-paliers-autonomie.md` |
| 20261019-etude-opportunite-skills-design-tiers.md | — | 27.6 Ko | `03-etudes/20261019-etude-opportunite-skills-design-tiers.md` |
| 20261019-etude-opportunite-style-ecriture.md | — | 19.7 Ko | `03-etudes/20261019-etude-opportunite-style-ecriture.md` |
| 20261019-etude-opportunite-tactiques-seo-geo-recentes.md | — | 22.3 Ko | `03-etudes/20261019-etude-opportunite-tactiques-seo-geo-recentes.md` |
| 20261019-etude-opportunite-video-lancement-generee-par-code.md | — | 19.9 Ko | `03-etudes/20261019-etude-opportunite-video-lancement-generee-par-code.md` |
| 20261019-tri-opportunites-favoris-tiktok.md | — | 25.7 Ko | `03-etudes/20261019-tri-opportunites-favoris-tiktok.md` |
| 20261020-etude-opportunite-conseil-avant-arbitrage.md | — | 15.7 Ko | `03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md` |
| 20261020-etude-opportunite-oeil-critique-des-process.md | — | 17.1 Ko | `03-etudes/20261020-etude-opportunite-oeil-critique-des-process.md` |
| 20261020-L99-oeil-critique-amelioration-continue-automatisee.md | — | 25.9 Ko | `03-etudes/20261020-L99-oeil-critique-amelioration-continue-automatisee.md` |
| 20261020-L99-oeil-critique-des-process.md | — | 24.6 Ko | `03-etudes/20261020-L99-oeil-critique-des-process.md` |
| 20261020-L99-oeil-critique-global-des-process.md | — | 24.9 Ko | `03-etudes/20261020-L99-oeil-critique-global-des-process.md` |
| 20261021-etude-opportunite-relecteur-de-bon-sens-restitution.md | — | 28.6 Ko | `03-etudes/20261021-etude-opportunite-relecteur-de-bon-sens-restitution.md` |
| 20261021-etude-opportunite-surcouche-permissions-produit.md | — | 19.6 Ko | `03-etudes/20261021-etude-opportunite-surcouche-permissions-produit.md` |
| 20261021-L99-agent-nocturne-oeil-critique.md | — | 27.4 Ko | `03-etudes/20261021-L99-agent-nocturne-oeil-critique.md` |
| 20261021-L99-agent-nocturne-skill-vs-code.md | — | 27.3 Ko | `03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md` |
| 20261026-comparaison-task-observer-oeil-critique.md | — | 5.3 Ko | `03-etudes/20261026-comparaison-task-observer-oeil-critique.md` |
| 20261026-L99-oeil-critique-cible-retravaillee.md | — | 22.8 Ko | `03-etudes/20261026-L99-oeil-critique-cible-retravaillee.md` |
| Digit-AI - Diagnostic Factory - Oeil critique - 20261020b.md | 20261020b | 23.9 Ko | `03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261020b.md` |
| Digit-AI - Diagnostic Factory - Oeil critique - 20261020c.md | 20261020c | 31.8 Ko | `03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261020c.md` |
| Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md | 20261021a | 48.9 Ko | `03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md` |
| Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md | 20261026a | 23.1 Ko | `03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md` |
| Digit-AI - Étude - Bases de donnees de dev et qualification - 20261029a.md | 20261029a | 8.8 Ko | `03-etudes/Digit-AI - Étude - Bases de donnees de dev et qualification - 20261029a.md` |
| Digit-AI - Étude - Competences Cloudflare GitHub Supabase - 20261028a.md | 20261028a | 12.6 Ko | `03-etudes/Digit-AI - Étude - Competences Cloudflare GitHub Supabase - 20261028a.md` |
| Digit-AI - Étude - Oeil critique global des process - 20261020a.md | 20261020a | 30.6 Ko | `03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md` |
| Digit-AI - Fiche - Oeil critique actions pour tenir les 8 demandes - 20261029c.md | 20261029c | 5.5 Ko | `03-etudes/Digit-AI - Fiche - Oeil critique actions pour tenir les 8 demandes - 20261029c.md` |
| Digit-AI - Fiche - Oeil critique ce qu il fait et ne fait pas - 20261029b.md | 20261029b | 4.8 Ko | `03-etudes/Digit-AI - Fiche - Oeil critique ce qu il fait et ne fait pas - 20261029b.md` |
| Digit-AI - Fiche - Oeil critique code mort et sujets a integrer - 20261029e.md | 20261029e | 6.9 Ko | `03-etudes/Digit-AI - Fiche - Oeil critique code mort et sujets a integrer - 20261029e.md` |
| Digit-AI - Inventaire - Fonctionnalites Cloudflare GitHub Supabase - 20261028a.json | 20261028a | 514.7 Ko | `03-etudes/Digit-AI - Inventaire - Fonctionnalites Cloudflare GitHub Supabase - 20261028a.json` |
| Digit-AI - Inventaire - Fonctionnalites Cloudflare GitHub Supabase - 20261028a.md | 20261028a | 190.2 Ko | `03-etudes/Digit-AI - Inventaire - Fonctionnalites Cloudflare GitHub Supabase - 20261028a.md` |
| Digit-AI - Inventaire - Protections GitHub des depots publics - 20261028a.md | 20261028a | 5.1 Ko | `03-etudes/Digit-AI - Inventaire - Protections GitHub des depots publics - 20261028a.md` |
| Digit-AI - Revue - Prompt actions code mort et sujets oeil critique passe au crible L99 - 20261029d.md | 20261029d | 15.2 Ko | `03-etudes/Digit-AI - Revue - Prompt actions code mort et sujets oeil critique passe au crible L99 - 20261029d.md` |

### 04-plans

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| 20260813-plan-strategie-tests-e2e.md | — | 13.3 Ko | `04-plans/2026-08/20260813-plan-strategie-tests-e2e.md` |
| Digit-AI - Note Migration - Chemins du pilot renomme - 20260818b.md | 20260818b | 4.2 Ko | `04-plans/2026-08/Digit-AI - Note Migration - Chemins du pilot renomme - 20260818b.md` |
| Digit-AI - Note Revue - Denominateur des freres - 20260818a.md | 20260818a | 4.1 Ko | `04-plans/2026-08/Digit-AI - Note Revue - Denominateur des freres - 20260818a.md` |
| Digit-AI - Plan Renommage - Fenetre A factory - 20260817e.md | 20260817e | 3.2 Ko | `04-plans/2026-08/Digit-AI - Plan Renommage - Fenetre A factory - 20260817e.md` |
| Digit-AI - Synthese Boucle - 17 restants du registre - 20260818c.md | 20260818c | 13.1 Ko | `04-plans/2026-08/Digit-AI - Synthese Boucle - 17 restants du registre - 20260818c.md` |
| Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md | 20260815a | 3.6 Ko | `04-plans/2026-08/Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md` |
| Digit-AI - Synthese Diagnostic - Avancement traitements longs - 20260815c.md | 20260815c | 3.7 Ko | `04-plans/2026-08/Digit-AI - Synthese Diagnostic - Avancement traitements longs - 20260815c.md` |
| Digit-AI - Synthese Mandat - Analyse L99 etat de l art marche - 20260830n.md | 20260830n | 15.3 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Analyse L99 etat de l art marche - 20260830n.md` |
| Digit-AI - Synthese Mandat - Anatomie du bloc 3 armee - 20260830e.md | 20260830e | 17.8 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Anatomie du bloc 3 armee - 20260830e.md` |
| Digit-AI - Synthese Mandat - Architecture circuit - 20260815f.md | 20260815f | 3.8 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Architecture circuit - 20260815f.md` |
| Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815d.md | 20260815d | 3.4 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815d.md` |
| Digit-AI - Synthese Mandat - Bloc 3 forme de reference - 20260830f.md | 20260830f | 15.3 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Bloc 3 forme de reference - 20260830f.md` |
| Digit-AI - Synthese Mandat - Etude opportunite etat de l art - 20260831a.md | 20260831a | 15.2 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Etude opportunite etat de l art - 20260831a.md` |
| Digit-AI - Synthese Mandat - Forme du bloc 3 et redescente aux produits - 20260830c.md | 20260830c | 17.7 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Forme du bloc 3 et redescente aux produits - 20260830c.md` |
| Digit-AI - Synthese Mandat - Heritage a l ouverture et localisateurs - 20260830g.md | 20260830g | 16 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Heritage a l ouverture et localisateurs - 20260830g.md` |
| Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md | 20260830i | 16.4 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md` |
| Digit-AI - Synthese Mandat - Ingestion rouverte et banc au vert - 20260831c.md | 20260831c | 13.8 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Ingestion rouverte et banc au vert - 20260831c.md` |
| Digit-AI - Synthese Mandat - Juste milieu du canal de remontee - 20260830k.md | 20260830k | 15.1 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Juste milieu du canal de remontee - 20260830k.md` |
| Digit-AI - Synthese Mandat - Lexique d invocation inerte - 20260830l.md | 20260830l | 14.4 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Lexique d invocation inerte - 20260830l.md` |
| Digit-AI - Synthese Mandat - Lexique d invocation reactive - 20260830m.md | 20260830m | 14 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Lexique d invocation reactive - 20260830m.md` |
| Digit-AI - Synthese Mandat - Pourquoi le bloc 3 derive - 20260830d.md | 20260830d | 16.1 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Pourquoi le bloc 3 derive - 20260830d.md` |
| Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817f.md | 20260817f | 7.2 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817f.md` |
| Digit-AI - Synthese Mandat - Publication et campagne des items decides - 20260831d.md | 20260831d | 22.9 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Publication et campagne des items decides - 20260831d.md` |
| Digit-AI - Synthese Mandat - Recopie de l heritage et parite - 20260830h.md | 20260830h | 14.6 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Recopie de l heritage et parite - 20260830h.md` |
| Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817d.md | 20260817d | 7.1 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817d.md` |
| Digit-AI - Synthese Mandat - Remise a niveau et renommage - 20260830b.md | 20260830b | 19.2 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Remise a niveau et renommage - 20260830b.md` |
| Digit-AI - Synthese Mandat - Remontee automatique des retours produits - 20260830j.md | 20260830j | 16.6 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Remontee automatique des retours produits - 20260830j.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md | 20260822a | 13.2 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md` |
| Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815g.md | 20260815g | 5.5 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815g.md` |
| Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815e.md | 20260815e | 4.4 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815e.md` |
| Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817b.md | 20260817b | 6.1 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817b.md` |
| Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md | 20260830a | 17.8 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md` |
| Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md | 20260817a | 6.3 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260822b.md | 20260822b | 16.8 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite todos et retours - 20260822b.md` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260822c.md | 20260822c | 9.2 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite todos et retours - 20260822c.md` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260831b.md | 20260831b | 17.4 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite todos et retours - 20260831b.md` |
| Digit-AI - Synthese Mandat - Traite tous les retours - 20260817c.md | 20260817c | 5.1 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite tous les retours - 20260817c.md` |
| Digit-AI - Synthese Mandat - Traite tous les sujets - 20260823a.md | 20260823a | 9.8 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Traite tous les sujets - 20260823a.md` |
| Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815b.md | 20260815b | 3.2 Ko | `04-plans/2026-08/Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815b.md` |
| Digit-AI - Plan - Mise en oeuvre des huit rangs d opportunites - 20260922h.md | 20260922h | 20.8 Ko | `04-plans/2026-09/Digit-AI - Plan - Mise en oeuvre des huit rangs d opportunites - 20260922h.md` |
| Digit-AI - Restitution - Verification d une rectification et cle confirmee - 20260910a.md | 20260910a | 33.1 Ko | `04-plans/2026-09/Digit-AI - Restitution - Verification d une rectification et cle confirmee - 20260910a.md` |
| Digit-AI - Specification Produit - digit-ai-marketing - 20260911k.md | 20260911k | 36.6 Ko | `04-plans/2026-09/Digit-AI - Specification Produit - digit-ai-marketing - 20260911k.md` |
| Digit-AI - Synthese - D-3a actee et execution transferee au produit - 20260901i.md | 20260901i | 5.7 Ko | `04-plans/2026-09/Digit-AI - Synthese - D-3a actee et execution transferee au produit - 20260901i.md` |
| Digit-AI - Synthese - Etapes transferees au produit par lot de travaux - 20260901j.md | 20260901j | 5.2 Ko | `04-plans/2026-09/Digit-AI - Synthese - Etapes transferees au produit par lot de travaux - 20260901j.md` |
| Digit-AI - Synthese - Etude donnees de recherche et cascade intention - 20260901h.md | 20260901h | 10.4 Ko | `04-plans/2026-09/Digit-AI - Synthese - Etude donnees de recherche et cascade intention - 20260901h.md` |
| Digit-AI - Synthese - Expertise SEO capitalisee au pilot - 20260901k.md | 20260901k | 7.3 Ko | `04-plans/2026-09/Digit-AI - Synthese - Expertise SEO capitalisee au pilot - 20260901k.md` |
| Digit-AI - Synthese Conseil - Agents nouvelles versions modeles - 20260924b.md | 20260924b | 17.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Conseil - Agents nouvelles versions modeles - 20260924b.md` |
| Digit-AI - Synthese Conseil - Qualite sans personas cinq propositions - 20260914g.md | 20260914g | 15.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Conseil - Qualite sans personas cinq propositions - 20260914g.md` |
| Digit-AI - Synthese Etude - Communication marketing AO verdict O3 - 20260911g.md | 20260911g | 22.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Communication marketing AO verdict O3 - 20260911g.md` |
| Digit-AI - Synthese Etude - Decision 5a executee etape - 20260925e.md | 20260925e | 5.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Decision 5a executee etape - 20260925e.md` |
| Digit-AI - Synthese Etude - Decisions 3a 4a 2a executees sept candidatures - 20260919d.md | 20260919d | 16.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Decisions 3a 4a 2a executees sept candidatures - 20260919d.md` |
| Digit-AI - Synthese Etude - Decisions 3a 4a executees etape - 20260925d.md | 20260925d | 11 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Decisions 3a 4a executees etape - 20260925d.md` |
| Digit-AI - Synthese Etude - Decisions 5a 6a executees deux restes au registre - 20260919e.md | 20260919e | 10.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Decisions 5a 6a executees deux restes au registre - 20260919e.md` |
| Digit-AI - Synthese Etude - Gestion reseaux sociaux verdict O2 sans forge - 20260917c.md | 20260917c | 14 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Gestion reseaux sociaux verdict O2 sans forge - 20260917c.md` |
| Digit-AI - Synthese Etude - Niveaux intervention verdict O3 - 20260925c.md | 20260925c | 14.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Niveaux intervention verdict O3 - 20260925c.md` |
| Digit-AI - Synthese Etude - Personas phase verdict statu quo banc rejouable - 20260914h.md | 20260914h | 16.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Personas phase verdict statu quo banc rejouable - 20260914h.md` |
| Digit-AI - Synthese Etude - Plan amelioration post-audit verdict O2 forges - 20260919c.md | 20260919c | 20.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Plan amelioration post-audit verdict O2 forges - 20260919c.md` |
| Digit-AI - Synthese Etude - Revue hebdomadaire existant verdict sondes - 20260917d.md | 20260917d | 13.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Etude - Revue hebdomadaire existant verdict sondes - 20260917d.md` |
| Digit-AI - Synthese L99 - Audit plan amelioration plateforme prompt reecrit - 20260919b.md | 20260919b | 17.2 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Audit plan amelioration plateforme prompt reecrit - 20260919b.md` |
| Digit-AI - Synthese L99 - Forge communication marketing prompt reecrit - 20260911f.md | 20260911f | 19.9 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Forge communication marketing prompt reecrit - 20260911f.md` |
| Digit-AI - Synthese L99 - Gestion reseaux sociaux prompt reecrit - 20260917m.md | 20260917m | 14.7 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Gestion reseaux sociaux prompt reecrit - 20260917m.md` |
| Digit-AI - Synthese L99 - Niveaux d intervention prompt reecrit - 20260925b.md | 20260925b | 26.1 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Niveaux d intervention prompt reecrit - 20260925b.md` |
| Digit-AI - Synthese L99 - Passage Opus 5 vers Opus 5.5 prompt reecrit - 20260927d.md | 20260927d | 20.3 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Passage Opus 5 vers Opus 5.5 prompt reecrit - 20260927d.md` |
| Digit-AI - Synthese L99 - Personas par phase prompt reecrit - 20260914i.md | 20260914i | 12.7 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Personas par phase prompt reecrit - 20260914i.md` |
| Digit-AI - Synthese L99 - Regles ecriture Factory prompt reecrit esquisse - 20260911j.md | 20260911j | 21.5 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Regles ecriture Factory prompt reecrit esquisse - 20260911j.md` |
| Digit-AI - Synthese L99 - Revue hebdomadaire de l existant prompt reecrit - 20260917b.md | 20260917b | 14 Ko | `04-plans/2026-09/Digit-AI - Synthese L99 - Revue hebdomadaire de l existant prompt reecrit - 20260917b.md` |
| Digit-AI - Synthese Mandat - 115 valeurs passees en chiffres chez producteurs - 20260916f.md | 20260916f | 8.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - 115 valeurs passees en chiffres chez producteurs - 20260916f.md` |
| Digit-AI - Synthese Mandat - 4 decisions executees etude - 20260921g.md | 20260921g | 13.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - 4 decisions executees etude - 20260921g.md` |
| Digit-AI - Synthese Mandat - 6 lots ingeres 2 oracles nes - 20260922a.md | 20260922a | 30.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - 6 lots ingeres 2 oracles nes - 20260922a.md` |
| Digit-AI - Synthese Mandat - 6 objets reseaux sociaux - 20260921h.md | 20260921h | 13.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - 6 objets reseaux sociaux - 20260921h.md` |
| Digit-AI - Synthese Mandat - Actions 31 32 33 achevees - 20260905i.md | 20260905i | 15.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Actions 31 32 33 achevees - 20260905i.md` |
| Digit-AI - Synthese Mandat - Actions 36 a 40 achevees - 20260905k.md | 20260905k | 23.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Actions 36 a 40 achevees - 20260905k.md` |
| Digit-AI - Synthese Mandat - Amelioration continue pas 0 a 4 - 20260903h.md | 20260903h | 19.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Amelioration continue pas 0 a 4 - 20260903h.md` |
| Digit-AI - Synthese Mandat - Analyse L99 amelioration continue - 20260903a.md | 20260903a | 15.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Analyse L99 amelioration continue - 20260903a.md` |
| Digit-AI - Synthese Mandat - Analyse L99 qualite premiers HTML nouveaux - 20260914a.md | 20260914a | 21.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Analyse L99 qualite premiers HTML nouveaux - 20260914a.md` |
| Digit-AI - Synthese Mandat - Anonymisation cablee sur git - 20260901g.md | 20260901g | 11.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Anonymisation cablee sur git - 20260901g.md` |
| Digit-AI - Synthese Mandat - Banc elargi source unique deux lignees - 20260917a.md | 20260917a | 21.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Banc elargi source unique deux lignees - 20260917a.md` |
| Digit-AI - Synthese Mandat - Barres validees et publication decisions D6a D7a - 20260907e.md | 20260907e | 10.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Barres validees et publication decisions D6a D7a - 20260907e.md` |
| Digit-AI - Synthese Mandat - Boite d entree videe et cinq campagnes lancees - 20260917k.md | 20260917k | 17.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Boite d entree videe et cinq campagnes lancees - 20260917k.md` |
| Digit-AI - Synthese Mandat - Boite entree videe huit items clos sous - 20260916e.md | 20260916e | 17.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Boite entree videe huit items clos sous - 20260916e.md` |
| Digit-AI - Synthese Mandat - Branche pilot reportee branche - 20260921b.md | 20260921b | 13.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Branche pilot reportee branche - 20260921b.md` |
| Digit-AI - Synthese Mandat - Campagne des todos et retours - 20260915a.md | 20260915a | 22.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Campagne des todos et retours - 20260915a.md` |
| Digit-AI - Synthese Mandat - Campagne des todos et retours 18 items clos - 20260920e.md | 20260920e | 30 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Campagne des todos et retours 18 items clos - 20260920e.md` |
| Digit-AI - Synthese Mandat - Campagne todos retours - 20260920d.md | 20260920d | 17.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Campagne todos retours - 20260920d.md` |
| Digit-AI - Synthese Mandat - Campagne tous les todos - 20260901b.md | 20260901b | 13.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Campagne tous les todos - 20260901b.md` |
| Digit-AI - Synthese Mandat - Campagnes cours trois corrections closes porte - 20260908d.md | 20260908d | 20.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Campagnes cours trois corrections closes porte - 20260908d.md` |
| Digit-AI - Synthese Mandat - Canal confidentiel et actions 58 60 61 62 63 - 20260907m.md | 20260907m | 25.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Canal confidentiel et actions 58 60 61 62 63 - 20260907m.md` |
| Digit-AI - Synthese Mandat - Ce poste rattrape fusion - 20260920c.md | 20260920c | 12.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Ce poste rattrape fusion - 20260920c.md` |
| Digit-AI - Synthese Mandat - Cinq decisions executees publication a decider - 20260920g.md | 20260920g | 18.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Cinq decisions executees publication a decider - 20260920g.md` |
| Digit-AI - Synthese Mandat - Cinq familles de cadence et le controle aveugle - 20260915f.md | 20260915f | 25.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Cinq familles de cadence et le controle aveugle - 20260915f.md` |
| Digit-AI - Synthese Mandat - Circuit heberge corrige et accueil sous harnais - 20260915c.md | 20260915c | 9.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Circuit heberge corrige et accueil sous harnais - 20260915c.md` |
| Digit-AI - Synthese Mandat - Communication parts de forge finies 6 decisions - 20260921f.md | 20260921f | 22.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Communication parts de forge finies 6 decisions - 20260921f.md` |
| Digit-AI - Synthese Mandat - D-11 etait executee 09h10 boucle mesuree deposee - 20260911b.md | 20260911b | 21.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-11 etait executee 09h10 boucle mesuree deposee - 20260911b.md` |
| Digit-AI - Synthese Mandat - D-12 a executee regle etendue registre publie - 20260911c.md | 20260911c | 14.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-12 a executee regle etendue registre publie - 20260911c.md` |
| Digit-AI - Synthese Mandat - D-13 a executee pilot et forge publies CI lue - 20260911e.md | 20260911e | 13.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-13 a executee pilot et forge publies CI lue - 20260911e.md` |
| Digit-AI - Synthese Mandat - D-3 executee spec digit-ai-marketing RUN-AO lots - 20260911h.md | 20260911h | 25.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-3 executee spec digit-ai-marketing RUN-AO lots - 20260911h.md` |
| Digit-AI - Synthese Mandat - D-4 executee marque deux supports produit - 20260911i.md | 20260911i | 27.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-4 executee marque deux supports produit - 20260911i.md` |
| Digit-AI - Synthese Mandat - D-4 executee secrets et conception amont - 20260914j.md | 20260914j | 21.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-4 executee secrets et conception amont - 20260914j.md` |
| Digit-AI - Synthese Mandat - D-6 D-9 D-7 D-8 executees - 20260914k.md | 20260914k | 15.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - D-6 D-9 D-7 D-8 executees - 20260914k.md` |
| Digit-AI - Synthese Mandat - Decision 31a executee quatorze lots accueillis - 20260928b.md | 20260928b | 14.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decision 31a executee quatorze lots accueillis - 20260928b.md` |
| Digit-AI - Synthese Mandat - Decision 31a la porte connait le canal - 20260908a.md | 20260908a | 14.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decision 31a la porte connait le canal - 20260908a.md` |
| Digit-AI - Synthese Mandat - Decision 32a executee trente quatre candidatures - 20260928c.md | 20260928c | 23.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decision 32a executee trente quatre candidatures - 20260928c.md` |
| Digit-AI - Synthese Mandat - Decision 5a et TF-0793 clos - 20260903f.md | 20260903f | 13.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decision 5a et TF-0793 clos - 20260903f.md` |
| Digit-AI - Synthese Mandat - Decision 5a jetons digit-ai-schemas - 20260904a.md | 20260904a | 19.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decision 5a jetons digit-ai-schemas - 20260904a.md` |
| Digit-AI - Synthese Mandat - Decisions 10a 13a executees retours 15 septembre - 20260915e.md | 20260915e | 15.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 10a 13a executees retours 15 septembre - 20260915e.md` |
| Digit-AI - Synthese Mandat - Decisions 11b 12a - 20260905j.md | 20260905j | 19.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 11b 12a - 20260905j.md` |
| Digit-AI - Synthese Mandat - Decisions 13 14 15 executees campagnes en cours - 20260908c.md | 20260908c | 11.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 13 14 15 executees campagnes en cours - 20260908c.md` |
| Digit-AI - Synthese Mandat - Decisions 14a et 15a executees - 20260915b.md | 20260915b | 9.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 14a et 15a executees - 20260915b.md` |
| Digit-AI - Synthese Mandat - Decisions 16a 17a 18a - 20260905l.md | 20260905l | 17.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 16a 17a 18a - 20260905l.md` |
| Digit-AI - Synthese Mandat - Decisions 19a 20a et actions 44 a 48 - 20260905m.md | 20260905m | 24.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 19a 20a et actions 44 a 48 - 20260905m.md` |
| Digit-AI - Synthese Mandat - Decisions 1a 2a 3a 4a - 20260903g.md | 20260903g | 16.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 1a 2a 3a 4a - 20260903g.md` |
| Digit-AI - Synthese Mandat - Decisions 1a 2a 3b 4a synchronisation - 20260903e.md | 20260903e | 16.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 1a 2a 3b 4a synchronisation - 20260903e.md` |
| Digit-AI - Synthese Mandat - Decisions 1a 2a executees modeles - 20260925f.md | 20260925f | 14.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 1a 2a executees modeles - 20260925f.md` |
| Digit-AI - Synthese Mandat - Decisions 1b et 3a executees et cout vues mesure - 20260916c.md | 20260916c | 13.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 1b et 3a executees et cout vues mesure - 20260916c.md` |
| Digit-AI - Synthese Mandat - Decisions 21a 22a 23a et actions 49 a 52 - 20260906n.md | 20260906n | 24.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 21a 22a 23a et actions 49 a 52 - 20260906n.md` |
| Digit-AI - Synthese Mandat - Decisions 24-09 executees - 20260925g.md | 20260925g | 26.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 24-09 executees - 20260925g.md` |
| Digit-AI - Synthese Mandat - Decisions 27a 28a forges rebaties - 20260907b.md | 20260907b | 18.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 27a 28a forges rebaties - 20260907b.md` |
| Digit-AI - Synthese Mandat - Decisions 2a 3a 5a executees - 20260920f.md | 20260920f | 15.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 2a 3a 5a executees - 20260920f.md` |
| Digit-AI - Synthese Mandat - Decisions 42a 43a 38a - 20260903b.md | 20260903b | 25.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 42a 43a 38a - 20260903b.md` |
| Digit-AI - Synthese Mandat - Decisions 8a 9a et actions 28 29 30 - 20260905h.md | 20260905h | 13.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Decisions 8a 9a et actions 28 29 30 - 20260905h.md` |
| Digit-AI - Synthese Mandat - Emission retours cablee sources muettes nommees - 20260917g.md | 20260917g | 13.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Emission retours cablee sources muettes nommees - 20260917g.md` |
| Digit-AI - Synthese Mandat - Enregistrement fait publication refusee porte - 20260917h.md | 20260917h | 11.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Enregistrement fait publication refusee porte - 20260917h.md` |
| Digit-AI - Synthese Mandat - Etat des merges et commits - 20260915d.md | 20260915d | 9.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Etat des merges et commits - 20260915d.md` |
| Digit-AI - Synthese Mandat - Etude opportunite premiers HTML nouveaux formats - 20260914b.md | 20260914b | 19.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Etude opportunite premiers HTML nouveaux formats - 20260914b.md` |
| Digit-AI - Synthese Mandat - Fais tous les A second tour acheve - 20260905g.md | 20260905g | 19.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Fais tous les A second tour acheve - 20260905g.md` |
| Digit-AI - Synthese Mandat - Forge d audit publiee CI hebergee rouge - 20260910g.md | 20260910g | 19.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Forge d audit publiee CI hebergee rouge - 20260910g.md` |
| Digit-AI - Synthese Mandat - Fusion de la branche du pilot publiee sur GitHub - 20260921c.md | 20260921c | 8.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Fusion de la branche du pilot publiee sur GitHub - 20260921c.md` |
| Digit-AI - Synthese Mandat - Fusion des deux postes sept depots publies - 20260920b.md | 20260920b | 14.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Fusion des deux postes sept depots publies - 20260920b.md` |
| Digit-AI - Synthese Mandat - Fusion mergee et une alerte diagnostic effacait - 20260921d.md | 20260921d | 15.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Fusion mergee et une alerte diagnostic effacait - 20260921d.md` |
| Digit-AI - Synthese Mandat - Fusion publiee session distante - 20260921e.md | 20260921e | 14.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Fusion publiee session distante - 20260921e.md` |
| Digit-AI - Synthese Mandat - Garde d envoi canal confidentiel posee eprouvee - 20260927c.md | 20260927c | 12.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Garde d envoi canal confidentiel posee eprouvee - 20260927c.md` |
| Digit-AI - Synthese Mandat - Histoire pilot reecrite republiee zero nom - 20260909a.md | 20260909a | 20.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Histoire pilot reecrite republiee zero nom - 20260909a.md` |
| Digit-AI - Synthese Mandat - Huit enregistrements publies registre ligne jour - 20260911a.md | 20260911a | 12.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Huit enregistrements publies registre ligne jour - 20260911a.md` |
| Digit-AI - Synthese Mandat - Le corpus corrige et 9 arbitrages poses - 20260922d.md | 20260922d | 33.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Le corpus corrige et 9 arbitrages poses - 20260922d.md` |
| Digit-AI - Synthese Mandat - Le registre est entierement classe - 20260922f.md | 20260922f | 15.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Le registre est entierement classe - 20260922f.md` |
| Digit-AI - Synthese Mandat - Les 3 decisions executees branche - 20260922c.md | 20260922c | 30.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Les 3 decisions executees branche - 20260922c.md` |
| Digit-AI - Synthese Mandat - Les 4 decisions executees - 20260922b.md | 20260922b | 30.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Les 4 decisions executees - 20260922b.md` |
| Digit-AI - Synthese Mandat - Les cinq decisions en attente detaillees - 20260922i.md | 20260922i | 20.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Les cinq decisions en attente detaillees - 20260922i.md` |
| Digit-AI - Synthese Mandat - Lots L1 L2 mission data ouverts decision D5a - 20260907d.md | 20260907d | 14.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Lots L1 L2 mission data ouverts decision D5a - 20260907d.md` |
| Digit-AI - Synthese Mandat - Lots L3 L8 mission data livres decisions D8a A24 - 20260907f.md | 20260907f | 16 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Lots L3 L8 mission data livres decisions D8a A24 - 20260907f.md` |
| Digit-AI - Synthese Mandat - Mission data Silver Gold Power BI decisions D3a - 20260907c.md | 20260907c | 9.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Mission data Silver Gold Power BI decisions D3a - 20260907c.md` |
| Digit-AI - Synthese Mandat - Modele corrige et familles outillees - 20260914e.md | 20260914e | 20.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Modele corrige et familles outillees - 20260914e.md` |
| Digit-AI - Synthese Mandat - Mutation a la demande et Portee rectifiee - 20260901c.md | 20260901c | 12.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Mutation a la demande et Portee rectifiee - 20260901c.md` |
| Digit-AI - Synthese Mandat - Neuf decisions executees publiees et propagees - 20260927a.md | 20260927a | 23.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Neuf decisions executees publiees et propagees - 20260927a.md` |
| Digit-AI - Synthese Mandat - Noyau corrige publie exclusivite retablie ligne - 20260910d.md | 20260910d | 11.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Noyau corrige publie exclusivite retablie ligne - 20260910d.md` |
| Digit-AI - Synthese Mandat - Onze actions executees et la fusion validee - 20260922g.md | 20260922g | 33.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Onze actions executees et la fusion validee - 20260922g.md` |
| Digit-AI - Synthese Mandat - Outil de reconstruction de clone decision D12a - 20260907j.md | 20260907j | 11.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Outil de reconstruction de clone decision D12a - 20260907j.md` |
| Digit-AI - Synthese Mandat - Outils recopies quatre forges - 20260919h.md | 20260919h | 10.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Outils recopies quatre forges - 20260919h.md` |
| Digit-AI - Synthese Mandat - Paliers 1 et 2 premiers HTML nouveaux formats - 20260914c.md | 20260914c | 22.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Paliers 1 et 2 premiers HTML nouveaux formats - 20260914c.md` |
| Digit-AI - Synthese Mandat - Paliers 2 et 3 premiers HTML nouveaux formats - 20260914d.md | 20260914d | 23 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Paliers 2 et 3 premiers HTML nouveaux formats - 20260914d.md` |
| Digit-AI - Synthese Mandat - Parc aligne GitHub deux branches non fusionnees - 20260921a.md | 20260921a | 13.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc aligne GitHub deux branches non fusionnees - 20260921a.md` |
| Digit-AI - Synthese Mandat - Parc resynchronise apres travail - 20260923c.md | 20260923c | 18.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc resynchronise apres travail - 20260923c.md` |
| Digit-AI - Synthese Mandat - Parc synchronise apres fusion pilot autre poste - 20260921i.md | 20260921i | 11.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise apres fusion pilot autre poste - 20260921i.md` |
| Digit-AI - Synthese Mandat - Parc synchronise avec GitHub - 20260913a.md | 20260913a | 20.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise avec GitHub - 20260913a.md` |
| Digit-AI - Synthese Mandat - Parc synchronise avec GitHub - 20260920a.md | 20260920a | 9.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise avec GitHub - 20260920a.md` |
| Digit-AI - Synthese Mandat - Parc synchronise et decisions des deux postes - 20260925a.md | 20260925a | 33.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise et decisions des deux postes - 20260925a.md` |
| Digit-AI - Synthese Mandat - Parc synchronise et quatre depots publies - 20260923b.md | 20260923b | 16.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise et quatre depots publies - 20260923b.md` |
| Digit-AI - Synthese Mandat - Parc synchronise et travail deux postes reuni - 20260928a.md | 20260928a | 23.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise et travail deux postes reuni - 20260928a.md` |
| Digit-AI - Synthese Mandat - Parc synchronise retour coherence - 20260924a.md | 20260924a | 30.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Parc synchronise retour coherence - 20260924a.md` |
| Digit-AI - Synthese Mandat - Pilot publie et depot marketing declare produit - 20260917i.md | 20260917i | 9.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Pilot publie et depot marketing declare produit - 20260917i.md` |
| Digit-AI - Synthese Mandat - Pilot rattrape autre poste index retard consigne - 20260923e.md | 20260923e | 21.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Pilot rattrape autre poste index retard consigne - 20260923e.md` |
| Digit-AI - Synthese Mandat - Plancher d ecriture pose regle Full HD 4K - 20260912a.md | 20260912a | 25.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Plancher d ecriture pose regle Full HD 4K - 20260912a.md` |
| Digit-AI - Synthese Mandat - Point d etape fais tous les A - 20260905f.md | 20260905f | 12.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Point d etape fais tous les A - 20260905f.md` |
| Digit-AI - Synthese Mandat - Publication de forge-development actions A39 A37 - 20260907l.md | 20260907l | 10.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Publication de forge-development actions A39 A37 - 20260907l.md` |
| Digit-AI - Synthese Mandat - Publication des forges decision D9a - 20260907g.md | 20260907g | 11.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Publication des forges decision D9a - 20260907g.md` |
| Digit-AI - Synthese Mandat - Publication du parc et branche ancienne retiree - 20260916a.md | 20260916a | 8.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Publication du parc et branche ancienne retiree - 20260916a.md` |
| Digit-AI - Synthese Mandat - Publication faite verifiee clone frais zero - 20260910b.md | 20260910b | 12 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Publication faite verifiee clone frais zero - 20260910b.md` |
| Digit-AI - Synthese Mandat - Quatre decisions executees - 20260923d.md | 20260923d | 23.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Quatre decisions executees - 20260923d.md` |
| Digit-AI - Synthese Mandat - Quatre decisions executees cinq dossiers - 20260922e.md | 20260922e | 30.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Quatre decisions executees cinq dossiers - 20260922e.md` |
| Digit-AI - Synthese Mandat - Quatre decisions executees parc publie tables - 20260908f.md | 20260908f | 14.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Quatre decisions executees parc publie tables - 20260908f.md` |
| Digit-AI - Synthese Mandat - Quatre decisions executees quatre nouvelles - 20260923a.md | 20260923a | 29.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Quatre decisions executees quatre nouvelles - 20260923a.md` |
| Digit-AI - Synthese Mandat - Quinze actions traitees publication en attente - 20260911d.md | 20260911d | 22.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Quinze actions traitees publication en attente - 20260911d.md` |
| Digit-AI - Synthese Mandat - Quinze items registre traites controles poses - 20260916b.md | 20260916b | 17.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Quinze items registre traites controles poses - 20260916b.md` |
| Digit-AI - Synthese Mandat - Reecriture histoires design tests development - 20260907h.md | 20260907h | 13.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Reecriture histoires design tests development - 20260907h.md` |
| Digit-AI - Synthese Mandat - Regle portee GO ecrite publiee restitution - 20260910c.md | 20260910c | 17.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Regle portee GO ecrite publiee restitution - 20260910c.md` |
| Digit-AI - Synthese Mandat - Reseaux sociaux barre validee perimetre LinkedIn - 20260917l.md | 20260917l | 11.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Reseaux sociaux barre validee perimetre LinkedIn - 20260917l.md` |
| Digit-AI - Synthese Mandat - Reseaux sociaux D-2 executee premier lot ecrit - 20260917e.md | 20260917e | 12.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Reseaux sociaux D-2 executee premier lot ecrit - 20260917e.md` |
| Digit-AI - Synthese Mandat - Reseaux sociaux D-3 executee mandat permanent - 20260917j.md | 20260917j | 14.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Reseaux sociaux D-3 executee mandat permanent - 20260917j.md` |
| Digit-AI - Synthese Mandat - Retours ingeres cinq campagnes lancees soixante - 20260908g.md | 20260908g | 37.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Retours ingeres cinq campagnes lancees soixante - 20260908g.md` |
| Digit-AI - Synthese Mandat - Retours ingeres et todos a partager entre postes - 20260908b.md | 20260908b | 17.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Retours ingeres et todos a partager entre postes - 20260908b.md` |
| Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md | 20260901a | 12.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md` |
| Digit-AI - Synthese Mandat - Selecteurs de familles et palier 1 des tests - 20260901e.md | 20260901e | 13.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Selecteurs de familles et palier 1 des tests - 20260901e.md` |
| Digit-AI - Synthese Mandat - Sept campagnes closes et format sortie corrige - 20260908e.md | 20260908e | 22.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Sept campagnes closes et format sortie corrige - 20260908e.md` |
| Digit-AI - Synthese Mandat - Sept decisions executees parc publie puis bloque - 20260908h.md | 20260908h | 45.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Sept decisions executees parc publie puis bloque - 20260908h.md` |
| Digit-AI - Synthese Mandat - Six actions et une porte de publication - 20260901f.md | 20260901f | 12.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Six actions et une porte de publication - 20260901f.md` |
| Digit-AI - Synthese Mandat - Six actions retenues cinq faites derniere erreur - 20260910e.md | 20260910e | 25.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Six actions retenues cinq faites derniere erreur - 20260910e.md` |
| Digit-AI - Synthese Mandat - Sondes etendues descente produit controles - 20260917f.md | 20260917f | 15.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Sondes etendues descente produit controles - 20260917f.md` |
| Digit-AI - Synthese Mandat - Surveillance des recidives TF-0790 - 20260903c.md | 20260903c | 11.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Surveillance des recidives TF-0790 - 20260903c.md` |
| Digit-AI - Synthese Mandat - Synchronisation et action A45 de l autre poste - 20260907k.md | 20260907k | 14.1 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Synchronisation et action A45 de l autre poste - 20260907k.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub et procedure autre poste - 20260907i.md | 20260907i | 15.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Synchronisation GitHub et procedure autre poste - 20260907i.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub et reconstruction clone - 20260903d.md | 20260903d | 25.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Synchronisation GitHub et reconstruction clone - 20260903d.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub reconstruction du clone - 20260907a.md | 20260907a | 19.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Synchronisation GitHub reconstruction du clone - 20260907a.md` |
| Digit-AI - Synthese Mandat - Synchronisation suspendue campagne 14 09 jouee - 20260919g.md | 20260919g | 14.6 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Synchronisation suspendue campagne 14 09 jouee - 20260919g.md` |
| Digit-AI - Synthese Mandat - TF-0794 clos rectification de seq - 20260905a.md | 20260905a | 12.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - TF-0794 clos rectification de seq - 20260905a.md` |
| Digit-AI - Synthese Mandat - TF-0795 clos chemin d echec des controles - 20260905b.md | 20260905b | 9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - TF-0795 clos chemin d echec des controles - 20260905b.md` |
| Digit-AI - Synthese Mandat - TF-0801 clos cle de versions et file d attente - 20260905c.md | 20260905c | 10 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - TF-0801 clos cle de versions et file d attente - 20260905c.md` |
| Digit-AI - Synthese Mandat - TF-0802 clos la 404 d office et fin du tri - 20260905d.md | 20260905d | 12.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - TF-0802 clos la 404 d office et fin du tri - 20260905d.md` |
| Digit-AI - Synthese Mandat - Todos et retours 23 clos et troisieme vague - 20260919a.md | 20260919a | 16.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Todos et retours 23 clos et troisieme vague - 20260919a.md` |
| Digit-AI - Synthese Mandat - Todos retours 32 clos preuve - 20260919i.md | 20260919i | 19.5 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Todos retours 32 clos preuve - 20260919i.md` |
| Digit-AI - Synthese Mandat - Toutes les actions A executees - 20260905e.md | 20260905e | 18 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Toutes les actions A executees - 20260905e.md` |
| Digit-AI - Synthese Mandat - Traite les todos et les retours - 20260902b.md | 20260902b | 24.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Traite les todos et les retours - 20260902b.md` |
| Digit-AI - Synthese Mandat - Traite tous les retours et todos - 20260902a.md | 20260902a | 27.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Traite tous les retours et todos - 20260902a.md` |
| Digit-AI - Synthese Mandat - Traite tous todos retours registre 87 candidats - 20260914f.md | 20260914f | 20.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Traite tous todos retours registre 87 candidats - 20260914f.md` |
| Digit-AI - Synthese Mandat - Treize decisions executees sceau rendu portable - 20260922j.md | 20260922j | 18 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Treize decisions executees sceau rendu portable - 20260922j.md` |
| Digit-AI - Synthese Mandat - Trois correctifs au socle et balayage perimetres - 20260915g.md | 20260915g | 22.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Trois correctifs au socle et balayage perimetres - 20260915g.md` |
| Digit-AI - Synthese Mandat - Trois decisions executees lots adresse garde - 20260927b.md | 20260927b | 17.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Trois decisions executees lots adresse garde - 20260927b.md` |
| Digit-AI - Synthese Mandat - Trois decisions executees moteur couverture - 20260910f.md | 20260910f | 25.4 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Trois decisions executees moteur couverture - 20260910f.md` |
| Digit-AI - Synthese Mandat - Trois forges jouees plancher propage - 20260912b.md | 20260912b | 26.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Trois forges jouees plancher propage - 20260912b.md` |
| Digit-AI - Synthese Mandat - Trois lots ingeres quatre defauts pilot corriges - 20260909b.md | 20260909b | 23.2 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Trois lots ingeres quatre defauts pilot corriges - 20260909b.md` |
| Digit-AI - Synthese Mandat - Verification apres changement d empreinte socle - 20260917n.md | 20260917n | 13.3 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Verification apres changement d empreinte socle - 20260917n.md` |
| Digit-AI - Synthese Mandat - Verification de non perte jouable - 20260901d.md | 20260901d | 9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Verification de non perte jouable - 20260901d.md` |
| Digit-AI - Synthese Mandat - Verification des deux arbitrages deja executes - 20260915h.md | 20260915h | 15.8 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Verification des deux arbitrages deja executes - 20260915h.md` |
| Digit-AI - Synthese Mandat - Vos deux decisions executees clone rebati porte - 20260910h.md | 20260910h | 20 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Vos deux decisions executees clone rebati porte - 20260910h.md` |
| Digit-AI - Synthese Mandat - Vues sorties du suivi et regle ecriture nombres - 20260916d.md | 20260916d | 11.9 Ko | `04-plans/2026-09/Digit-AI - Synthese Mandat - Vues sorties du suivi et regle ecriture nombres - 20260916d.md` |
| Digit-AI - Synthese Video - Film de 25 secondes sur depot factory rendu local - 20260919f.md | 20260919f | 17.7 Ko | `04-plans/2026-09/Digit-AI - Synthese Video - Film de 25 secondes sur depot factory rendu local - 20260919f.md` |
| Digit-AI - Note - Oeil critique des process a travailler - 20261020l.md | 20261020l | 14.7 Ko | `04-plans/Digit-AI - Note - Oeil critique des process a travailler - 20261020l.md` |
| Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md | 20261029a | 8.3 Ko | `04-plans/Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md` |
| Digit-AI - Prompt - Competences Cloudflare GitHub Supabase dans les forges - 20261028a.md | 20261028a | 10.1 Ko | `04-plans/Digit-AI - Prompt - Competences Cloudflare GitHub Supabase dans les forges - 20261028a.md` |
| Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md | 20261016b | 10 Ko | `04-plans/Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md` |
| Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md.boucle.json | — | 3.2 Ko | `04-plans/Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md.boucle.json` |
| Digit-AI - Revue hebdomadaire - Propositions D-81 a D-84 - 20261026r.md | 20261026r | 8.9 Ko | `04-plans/Digit-AI - Revue hebdomadaire - Propositions D-81 a D-84 - 20261026r.md` |
| Digit-AI - Revue hebdomadaire - Propositions D-91 et bases de donnees - 20261029d.md | 20261029d | 3.6 Ko | `04-plans/Digit-AI - Revue hebdomadaire - Propositions D-91 et bases de donnees - 20261029d.md` |
| Digit-AI - Revue Hebdomadaire - Sept propositions D-41 a D-47 - 20261001f.md | 20261001f | 11.9 Ko | `04-plans/Digit-AI - Revue Hebdomadaire - Sept propositions D-41 a D-47 - 20261001f.md` |
| Digit-AI - Synthese Conseil - Audit complet route vers forge-tests - 20261015b.md | 20261015b | 8.4 Ko | `04-plans/Digit-AI - Synthese Conseil - Audit complet route vers forge-tests - 20261015b.md` |
| Digit-AI - Synthese Conseil - Bases de donnees de dev et qualification - 20261029c.md | 20261029c | 6.5 Ko | `04-plans/Digit-AI - Synthese Conseil - Bases de donnees de dev et qualification - 20261029c.md` |
| Digit-AI - Synthese Conseil - Boucle L99 jusqu a un score etudiee - 20261016f.md | 20261016f | 7.1 Ko | `04-plans/Digit-AI - Synthese Conseil - Boucle L99 jusqu a un score etudiee - 20261016f.md` |
| Digit-AI - Synthese Conseil - Competences Cloudflare GitHub Supabase - 20261028a.md | 20261028a | 6.8 Ko | `04-plans/Digit-AI - Synthese Conseil - Competences Cloudflare GitHub Supabase - 20261028a.md` |
| Digit-AI - Synthese Conseil - Decisions a traiter en detail - 20261017a.md | 20261017a | 24.9 Ko | `04-plans/Digit-AI - Synthese Conseil - Decisions a traiter en detail - 20261017a.md` |
| Digit-AI - Synthese Conseil - Flotte d agents analyse critique - 20261018b.md | 20261018b | 11.1 Ko | `04-plans/Digit-AI - Synthese Conseil - Flotte d agents analyse critique - 20261018b.md` |
| Digit-AI - Synthese Conseil - Format des decisions auto-portantes - 20261017b.md | 20261017b | 10.4 Ko | `04-plans/Digit-AI - Synthese Conseil - Format des decisions auto-portantes - 20261017b.md` |
| Digit-AI - Synthese Conseil - Liste des TODOs et retours ouverts - 20261015h.md | 20261015h | 9.1 Ko | `04-plans/Digit-AI - Synthese Conseil - Liste des TODOs et retours ouverts - 20261015h.md` |
| Digit-AI - Synthese Conseil - Prompt bases de donnees passe au crible L99 - 20261029b.md | 20261029b | 10.3 Ko | `04-plans/Digit-AI - Synthese Conseil - Prompt bases de donnees passe au crible L99 - 20261029b.md` |
| Digit-AI - Synthese Conseil - Prompt Cloudflare GitHub Supabase passe au crible L99 - 20261028a.md | 20261028a | 8.3 Ko | `04-plans/Digit-AI - Synthese Conseil - Prompt Cloudflare GitHub Supabase passe au crible L99 - 20261028a.md` |
| Digit-AI - Synthese Conseil - Prompt Supabase passe au crible L99 - 20261016c.md | 20261016c | 6.5 Ko | `04-plans/Digit-AI - Synthese Conseil - Prompt Supabase passe au crible L99 - 20261016c.md` |
| Digit-AI - Synthese Conseil - Sujets traitables maintenant - 20261015k.md | 20261015k | 8.7 Ko | `04-plans/Digit-AI - Synthese Conseil - Sujets traitables maintenant - 20261015k.md` |
| Digit-AI - Synthese Etude - Relecteur d intention tous travaux - 20261018i.md | 20261018i | 8.5 Ko | `04-plans/Digit-AI - Synthese Etude - Relecteur d intention tous travaux - 20261018i.md` |
| Digit-AI - Synthese Etude - Relecteur d intention verdict O4 - 20261018g.md | 20261018g | 9 Ko | `04-plans/Digit-AI - Synthese Etude - Relecteur d intention verdict O4 - 20261018g.md` |
| Digit-AI - Synthese L99 - Oeil critique des process prompt reecrit - 20261020e.md | 20261020e | 16.2 Ko | `04-plans/Digit-AI - Synthese L99 - Oeil critique des process prompt reecrit - 20261020e.md` |
| Digit-AI - Synthese L99 - Oeil critique global des process prompt reecrit - 20261020i.md | 20261020i | 17.2 Ko | `04-plans/Digit-AI - Synthese L99 - Oeil critique global des process prompt reecrit - 20261020i.md` |
| Digit-AI - Synthese L99 - Relecteur critique d intention prompt reecrit - 20261018e.md | 20261018e | 13.6 Ko | `04-plans/Digit-AI - Synthese L99 - Relecteur critique d intention prompt reecrit - 20261018e.md` |
| Digit-AI - Synthese Mandat - A-1 a A-8 du reste a faire - 20261019k.md | 20261019k | 13.3 Ko | `04-plans/Digit-AI - Synthese Mandat - A-1 a A-8 du reste a faire - 20261019k.md` |
| Digit-AI - Synthese Mandat - A-1 et A-2 indices du 19-10 et revue hebdomadaire - 20261026s.md | 20261026s | 14.1 Ko | `04-plans/Digit-AI - Synthese Mandat - A-1 et A-2 indices du 19-10 et revue hebdomadaire - 20261026s.md` |
| Digit-AI - Synthese Mandat - A1 A2 faites A3 en cours - 20261026h.md | 20261026h | 5.3 Ko | `04-plans/Digit-AI - Synthese Mandat - A1 A2 faites A3 en cours - 20261026h.md` |
| Digit-AI - Synthese Mandat - Accueil des lots au sas un ingere quatre refuses - 20261004a.md | 20261004a | 9.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Accueil des lots au sas un ingere quatre refuses - 20261004a.md` |
| Digit-AI - Synthese Mandat - Accueil du sas et trois lots ingeres - 20261012a.md | 20261012a | 10.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Accueil du sas et trois lots ingeres - 20261012a.md` |
| Digit-AI - Synthese Mandat - Affichage double corrige revue - 20261001e.md | 20261001e | 9.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Affichage double corrige revue - 20261001e.md` |
| Digit-AI - Synthese Mandat - Archives classees en sous-dossiers - 20261016h.md | 20261016h | 9 Ko | `04-plans/Digit-AI - Synthese Mandat - Archives classees en sous-dossiers - 20261016h.md` |
| Digit-AI - Synthese Mandat - Audit complet vers forge-audit - 20261015c.md | 20261015c | 7 Ko | `04-plans/Digit-AI - Synthese Mandat - Audit complet vers forge-audit - 20261015c.md` |
| Digit-AI - Synthese Mandat - Bases de donnees de dev et qualification construites - 20261029e.md | 20261029e | 8.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Bases de donnees de dev et qualification construites - 20261029e.md` |
| Digit-AI - Synthese Mandat - Boucle de correction en place - 20261018n.md | 20261018n | 9.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Boucle de correction en place - 20261018n.md` |
| Digit-AI - Synthese Mandat - Boucle de correction publiee - 20261018o.md | 20261018o | 6.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Boucle de correction publiee - 20261018o.md` |
| Digit-AI - Synthese Mandat - Campagne D-41 - 20261019e.md | 20261019e | 13.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne D-41 - 20261019e.md` |
| Digit-AI - Synthese Mandat - Campagne D-55 socle des pages - 20261003b.md | 20261003b | 11.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne D-55 socle des pages - 20261003b.md` |
| Digit-AI - Synthese Mandat - Campagne du matin reprise et close - 20261013h.md | 20261013h | 9.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne du matin reprise et close - 20261013h.md` |
| Digit-AI - Synthese Mandat - Campagne du registre, 50 sujets clos - 20261012c.md | 20261012c | 12.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne du registre, 50 sujets clos - 20261012c.md` |
| Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261014a.md | 20261014a | 9.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261014a.md` |
| Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015a.md | 20261015a | 11.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015a.md` |
| Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015e.md | 20261015e | 13.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015e.md` |
| Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015f.md | 20261015f | 4.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015f.md` |
| Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015g.md | 20261015g | 7.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne TODOs et retours - 20261015g.md` |
| Digit-AI - Synthese Mandat - Cible oeil critique retravaillee - 20261026e.md | 20261026e | 11 Ko | `04-plans/Digit-AI - Synthese Mandat - Cible oeil critique retravaillee - 20261026e.md` |
| Digit-AI - Synthese Mandat - Commande publiee verte et reprise reseau - 20261013i.md | 20261013i | 7.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Commande publiee verte et reprise reseau - 20261013i.md` |
| Digit-AI - Synthese Mandat - Competences Cloudflare GitHub Supabase construites - 20261028a.md | 20261028a | 10.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Competences Cloudflare GitHub Supabase construites - 20261028a.md` |
| Digit-AI - Synthese Mandat - Competences Supabase dans les forges - 20261016g.md | 20261016g | 9.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Competences Supabase dans les forges - 20261016g.md` |
| Digit-AI - Synthese Mandat - Conseil avant arbitrage instruit - 20261020f.md | 20261020f | 6.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Conseil avant arbitrage instruit - 20261020f.md` |
| Digit-AI - Synthese Mandat - Correctif d'ouverture reporte et applique - 20261013b.md | 20261013b | 8 Ko | `04-plans/Digit-AI - Synthese Mandat - Correctif d'ouverture reporte et applique - 20261013b.md` |
| Digit-AI - Synthese Mandat - D-41 D-43 D-44 executees - 20261019f.md | 20261019f | 9.4 Ko | `04-plans/Digit-AI - Synthese Mandat - D-41 D-43 D-44 executees - 20261019f.md` |
| Digit-AI - Synthese Mandat - D-45 b executee - 20261019h.md | 20261019h | 6 Ko | `04-plans/Digit-AI - Synthese Mandat - D-45 b executee - 20261019h.md` |
| Digit-AI - Synthese Mandat - D-45 expliquee - 20261019g.md | 20261019g | 5.8 Ko | `04-plans/Digit-AI - Synthese Mandat - D-45 expliquee - 20261019g.md` |
| Digit-AI - Synthese Mandat - D-74 executee conventions client - 20261026g.md | 20261026g | 3.9 Ko | `04-plans/Digit-AI - Synthese Mandat - D-74 executee conventions client - 20261026g.md` |
| Digit-AI - Synthese Mandat - D-79 c enregistree - 20261026n.md | 20261026n | 2.8 Ko | `04-plans/Digit-AI - Synthese Mandat - D-79 c enregistree - 20261026n.md` |
| Digit-AI - Synthese Mandat - D-79 detaillee - 20261026m.md | 20261026m | 5.7 Ko | `04-plans/Digit-AI - Synthese Mandat - D-79 detaillee - 20261026m.md` |
| Digit-AI - Synthese Mandat - Decisions 36a et 37a executees et publiees - 20261001c.md | 20261001c | 21.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions 36a et 37a executees et publiees - 20261001c.md` |
| Digit-AI - Synthese Mandat - Decisions 49 50 51 en cours - 20261002a.md | 20261002a | 19.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions 49 50 51 en cours - 20261002a.md` |
| Digit-AI - Synthese Mandat - Decisions 58 a 60 executees et publiees - 20261012b.md | 20261012b | 5.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions 58 a 60 executees et publiees - 20261012b.md` |
| Digit-AI - Synthese Mandat - Decisions D-24 a D-28 executees - 20261018m.md | 20261018m | 16.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions D-24 a D-28 executees - 20261018m.md` |
| Digit-AI - Synthese Mandat - Decisions D-29 a D-33 executees - 20261018p.md | 20261018p | 8.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions D-29 a D-33 executees - 20261018p.md` |
| Digit-AI - Synthese Mandat - Decisions D-49 a D-51 detaillees - 20261020b.md | 20261020b | 7.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions D-49 a D-51 detaillees - 20261020b.md` |
| Digit-AI - Synthese Mandat - Decisions D-49 a D-51 executees - 20261020c.md | 20261020c | 7.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions D-49 a D-51 executees - 20261020c.md` |
| Digit-AI - Synthese Mandat - Decisions posees seulement si ressort - 20261001h.md | 20261001h | 10.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Decisions posees seulement si ressort - 20261001h.md` |
| Digit-AI - Synthese Mandat - Depots prives hors d'acces non bloquants - 20261013e.md | 20261013e | 6.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Depots prives hors d'acces non bloquants - 20261013e.md` |
| Digit-AI - Synthese Mandat - Depots prives silencieux confirmation - 20261013f.md | 20261013f | 5.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Depots prives silencieux confirmation - 20261013f.md` |
| Digit-AI - Synthese Mandat - Deux chantiers fusionnes sur quatre - 20261026l.md | 20261026l | 4.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Deux chantiers fusionnes sur quatre - 20261026l.md` |
| Digit-AI - Synthese Mandat - Douze decisions executees - 20261017d.md | 20261017d | 17.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Douze decisions executees - 20261017d.md` |
| Digit-AI - Synthese Mandat - Essai de relecture d intention lance - 20261018j.md | 20261018j | 11.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Essai de relecture d intention lance - 20261018j.md` |
| Digit-AI - Synthese Mandat - Essai du conseil de cinq agents - 20261020g.md | 20261020g | 6.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Essai du conseil de cinq agents - 20261020g.md` |
| Digit-AI - Synthese Mandat - Essai publie et boucle de correction - 20261018l.md | 20261018l | 12.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Essai publie et boucle de correction - 20261018l.md` |
| Digit-AI - Synthese Mandat - Etude opportunite pages HTML et indicateurs - 20261003a.md | 20261003a | 10.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Etude opportunite pages HTML et indicateurs - 20261003a.md` |
| Digit-AI - Synthese Mandat - Etude Opus 5.5 jouee enregistrement local - 20261001g.md | 20261001g | 17.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Etude Opus 5.5 jouee enregistrement local - 20261001g.md` |
| Digit-AI - Synthese Mandat - Etude RSI et SSL dans la Factory - 20261001d.md | 20261001d | 10.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Etude RSI et SSL dans la Factory - 20261001d.md` |
| Digit-AI - Synthese Mandat - Etudes des favoris TikTok - 20261019d.md | 20261019d | 8.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Etudes des favoris TikTok - 20261019d.md` |
| Digit-AI - Synthese Mandat - Extrait de production anonymise admis et outille - 20261029f.md | 20261029f | 6.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Extrait de production anonymise admis et outille - 20261029f.md` |
| Digit-AI - Synthese Mandat - Flotte d agents nommee et mesuree - 20261018c.md | 20261018c | 12.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Flotte d agents nommee et mesuree - 20261018c.md` |
| Digit-AI - Synthese Mandat - Flotte d agents publiee - 20261018d.md | 20261018d | 5.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Flotte d agents publiee - 20261018d.md` |
| Digit-AI - Synthese Mandat - Format B applique aux decisions - 20261017c.md | 20261017c | 28.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Format B applique aux decisions - 20261017c.md` |
| Digit-AI - Synthese Mandat - Fusion des postes et lot Produit-12 ingere - 20261015d.md | 20261015d | 13.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Fusion des postes et lot Produit-12 ingere - 20261015d.md` |
| Digit-AI - Synthese Mandat - Installateur publie commande Windows - 20261013g.md | 20261013g | 8.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Installateur publie commande Windows - 20261013g.md` |
| Digit-AI - Synthese Mandat - Installation sans question banniere - 20261013d.md | 20261013d | 12 Ko | `04-plans/Digit-AI - Synthese Mandat - Installation sans question banniere - 20261013d.md` |
| Digit-AI - Synthese Mandat - L99 agent nocturne et skill VS Code - 20261021a.md | 20261021a | 9.8 Ko | `04-plans/Digit-AI - Synthese Mandat - L99 agent nocturne et skill VS Code - 20261021a.md` |
| Digit-AI - Synthese Mandat - L99 cible oeil critique retravaillee - 20261026c.md | 20261026c | 10.8 Ko | `04-plans/Digit-AI - Synthese Mandat - L99 cible oeil critique retravaillee - 20261026c.md` |
| Digit-AI - Synthese Mandat - Lots refuses traites huit corrections - 20261004b.md | 20261004b | 7.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Lots refuses traites huit corrections - 20261004b.md` |
| Digit-AI - Synthese Mandat - Mode boucle L99 construit et publie - 20261016i.md | 20261016i | 6.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Mode boucle L99 construit et publie - 20261016i.md` |
| Digit-AI - Synthese Mandat - Note oeil critique remise - 20261020m.md | 20261020m | 4.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Note oeil critique remise - 20261020m.md` |
| Digit-AI - Synthese Mandat - Oeil critique continu propose - 20261021b.md | 20261021b | 10.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique continu propose - 20261021b.md` |
| Digit-AI - Synthese Mandat - Oeil critique des process etudie et premier cycle - 20261020h.md | 20261020h | 11 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique des process etudie et premier cycle - 20261020h.md` |
| Digit-AI - Synthese Mandat - Oeil critique et architecture etat au 26-10 - 20261026a.md | 20261026a | 11.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique et architecture etat au 26-10 - 20261026a.md` |
| Digit-AI - Synthese Mandat - Oeil critique global des process etudie - 20261020j.md | 20261020j | 10.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique global des process etudie - 20261020j.md` |
| Digit-AI - Synthese Mandat - Oeil critique global releve des appels - 20261020k.md | 20261020k | 5.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique global releve des appels - 20261020k.md` |
| Digit-AI - Synthese Mandat - Oeil critique premiere analyse du poste - 20261026i.md | 20261026i | 16.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique premiere analyse du poste - 20261026i.md` |
| Digit-AI - Synthese Mandat - Oeil critique recommandations affichees - 20261026j.md | 20261026j | 18.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique recommandations affichees - 20261026j.md` |
| Digit-AI - Synthese Mandat - Oeil critique T1 a T4 detaillees et catalogue - 20261026b.md | 20261026b | 17.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Oeil critique T1 a T4 detaillees et catalogue - 20261026b.md` |
| Digit-AI - Synthese Mandat - Opus 5.5 Medium defaut prouve 2 profils - 20261001a.md | 20261001a | 8.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Opus 5.5 Medium defaut prouve 2 profils - 20261001a.md` |
| Digit-AI - Synthese Mandat - Ouverture session correctif arrete - 20261013a.md | 20261013a | 9.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Ouverture session correctif arrete - 20261013a.md` |
| Digit-AI - Synthese Mandat - Ouverture session reparee chez 19 produits - 20261013c.md | 20261013c | 9.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Ouverture session reparee chez 19 produits - 20261013c.md` |
| Digit-AI - Synthese Mandat - Pilot pousse sur GitHub - 20261026u.md | 20261026u | 2.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Pilot pousse sur GitHub - 20261026u.md` |
| Digit-AI - Synthese Mandat - Pilot publie apres reconstruction - 20261016k.md | 20261016k | 5.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Pilot publie apres reconstruction - 20261016k.md` |
| Digit-AI - Synthese Mandat - Pilot publie T2 en cours - 20261026p.md | 20261026p | 3.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Pilot publie T2 en cours - 20261026p.md` |
| Digit-AI - Synthese Mandat - Plans classes par mois noms raccourcis - 20261016l.md | 20261016l | 8.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Plans classes par mois noms raccourcis - 20261016l.md` |
| Digit-AI - Synthese Mandat - Prompt cible oeil critique adapte a oeil-critique 1.1.0 - 20261026d.md | 20261026d | 10.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Prompt cible oeil critique adapte a oeil-critique 1.1.0 - 20261026d.md` |
| Digit-AI - Synthese Mandat - Publication 48a du pilot et forge-agents - 20261001i.md | 20261001i | 4 Ko | `04-plans/Digit-AI - Synthese Mandat - Publication 48a du pilot et forge-agents - 20261001i.md` |
| Digit-AI - Synthese Mandat - Publication D-52 du pilot - 20261020d.md | 20261020d | 4.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Publication D-52 du pilot - 20261020d.md` |
| Digit-AI - Synthese Mandat - Publication et campagne de consigne - 20261017e.md | 20261017e | 9.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Publication et campagne de consigne - 20261017e.md` |
| Digit-AI - Synthese Mandat - Publication et charte unique actee - 20261012d.md | 20261012d | 5.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Publication et charte unique actee - 20261012d.md` |
| Digit-AI - Synthese Mandat - Quatre lots ingeres et premiere revue hebdomadaire - 20261001l.md | 20261001l | 19.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Quatre lots ingeres et premiere revue hebdomadaire - 20261001l.md` |
| Digit-AI - Synthese Mandat - Rangement des entrants dans input et output - 20261016d.md | 20261016d | 5.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Rangement des entrants dans input et output - 20261016d.md` |
| Digit-AI - Synthese Mandat - Recette complete apres six travaux - 20261015m.md | 20261015m | 6.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Recette complete apres six travaux - 20261015m.md` |
| Digit-AI - Synthese Mandat - Recette Terraform et revues datees - 20261016j.md | 20261016j | 5.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Recette Terraform et revues datees - 20261016j.md` |
| Digit-AI - Synthese Mandat - Rejeu arrete corrige et relance - 20261001n.md | 20261001n | 9.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Rejeu arrete corrige et relance - 20261001n.md` |
| Digit-AI - Synthese Mandat - Rejeu joue effort high retenu sur 6 taches - 20261001k.md | 20261001k | 18.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Rejeu joue effort high retenu sur 6 taches - 20261001k.md` |
| Digit-AI - Synthese Mandat - Rejeu lance candidatures ouvertes etude enregistree - 20261001m.md | 20261001m | 9.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Rejeu lance candidatures ouvertes etude enregistree - 20261001m.md` |
| Digit-AI - Synthese Mandat - Relecteur du lecteur vise construit - 20261013k.md | 20261013k | 7.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Relecteur du lecteur vise construit - 20261013k.md` |
| Digit-AI - Synthese Mandat - Reponses 68a 69a 70a 73b executees - 20261026f.md | 20261026f | 7.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Reponses 68a 69a 70a 73b executees - 20261026f.md` |
| Digit-AI - Synthese Mandat - Reponses 75 a 80 en cours - 20261026k.md | 20261026k | 6.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Reponses 75 a 80 en cours - 20261026k.md` |
| Digit-AI - Synthese Mandat - Reponses 81 a 84 en cours - 20261026t.md | 20261026t | 8.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Reponses 81 a 84 en cours - 20261026t.md` |
| Digit-AI - Synthese Mandat - Reprise multi-poste fusionnee - 20261015i.md | 20261015i | 4.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Reprise multi-poste fusionnee - 20261015i.md` |
| Digit-AI - Synthese Mandat - Reprise multi-poste prete a publier - 20261015j.md | 20261015j | 9.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Reprise multi-poste prete a publier - 20261015j.md` |
| Digit-AI - Synthese Mandat - Reprise reseau publiee, installation close - 20261013j.md | 20261013j | 3.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Reprise reseau publiee, installation close - 20261013j.md` |
| Digit-AI - Synthese Mandat - Reste a faire au 19-10 soir - 20261019j.md | 20261019j | 7.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Reste a faire au 19-10 soir - 20261019j.md` |
| Digit-AI - Synthese Mandat - Retours et sujets du poste traites - 20261014b.md | 20261014b | 12.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Retours et sujets du poste traites - 20261014b.md` |
| Digit-AI - Synthese Mandat - Retours et TODOs traites - 20261029g.md | 20261029g | 10.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Retours et TODOs traites - 20261029g.md` |
| Digit-AI - Synthese Mandat - Sas traite onze lots ingeres deux attente - 20261001b.md | 20261001b | 18.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Sas traite onze lots ingeres deux attente - 20261001b.md` |
| Digit-AI - Synthese Mandat - Six travaux faits et onze fiches - 20261015l.md | 20261015l | 47.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Six travaux faits et onze fiches - 20261015l.md` |
| Digit-AI - Synthese Mandat - Skill oeil-critique installe - 20261021c.md | 20261021c | 6.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Skill oeil-critique installe - 20261021c.md` |
| Digit-AI - Synthese Mandat - Sujets ouverts au 19-10 - 20261019a.md | 20261019a | 9.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Sujets ouverts au 19-10 - 20261019a.md` |
| Digit-AI - Synthese Mandat - Synchronisation avec GitHub - 20261019i.md | 20261019i | 6.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Synchronisation avec GitHub - 20261019i.md` |
| Digit-AI - Synthese Mandat - Synchronisation des deux postes publiee - 20261020a.md | 20261020a | 7 Ko | `04-plans/Digit-AI - Synthese Mandat - Synchronisation des deux postes publiee - 20261020a.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub du 26-10 - 20261026q.md | 20261026q | 4.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Synchronisation GitHub du 26-10 - 20261026q.md` |
| Digit-AI - Synthese Mandat - T2 fusionnee et publiee T4 lancee - 20261026v.md | 20261026v | 8 Ko | `04-plans/Digit-AI - Synthese Mandat - T2 fusionnee et publiee T4 lancee - 20261026v.md` |
| Digit-AI - Synthese Mandat - T4 fusionnee carte des forges en place - 20261026w.md | 20261026w | 8.2 Ko | `04-plans/Digit-AI - Synthese Mandat - T4 fusionnee carte des forges en place - 20261026w.md` |
| Digit-AI - Synthese Mandat - TODOs et retours du 18-10 - 20261018k.md | 20261018k | 17.6 Ko | `04-plans/Digit-AI - Synthese Mandat - TODOs et retours du 18-10 - 20261018k.md` |
| Digit-AI - Synthese Mandat - TODOs et retours du 19-10 - 20261019b.md | 20261019b | 10.7 Ko | `04-plans/Digit-AI - Synthese Mandat - TODOs et retours du 19-10 - 20261019b.md` |
| Digit-AI - Synthese Mandat - Todos et retours recette hebergee au vert - 20261001j.md | 20261001j | 16.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Todos et retours recette hebergee au vert - 20261001j.md` |
| Digit-AI - Synthese Mandat - TODOs et retours, publication cedee a la session d'origine - 20261015n.md | 20261015n | 5.4 Ko | `04-plans/Digit-AI - Synthese Mandat - TODOs et retours, publication cedee a la session d'origine - 20261015n.md` |
| Digit-AI - Synthese Mandat - Tri des favoris TikTok - 20261019c.md | 20261019c | 7.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Tri des favoris TikTok - 20261019c.md` |
| Digit-AI - Synthese Mandat - Trois chantiers fusionnes sur quatre - 20261026o.md | 20261026o | 4.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Trois chantiers fusionnes sur quatre - 20261026o.md` |
| Digit-AI - Prompt - Competences Supabase dans les forges - 20261016a.md *(archivé)* | 20261016a | 4.5 Ko | `04-plans/old/Digit-AI - Prompt - Competences Supabase dans les forges - 20261016a.md` |

### 05-catalogues-readmes-forges

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| agents-section-catalogue.md | — | 1.7 Ko | `05-catalogues-readmes-forges/agents-section-catalogue.md` |
| agents-security-section-catalogue.md | — | 1 Ko | `05-catalogues-readmes-forges/agents-security-section-catalogue.md` |
| audit-section-catalogue.md | — | 1.4 Ko | `05-catalogues-readmes-forges/audit-section-catalogue.md` |
| conception-section-catalogue.md | — | 2 Ko | `05-catalogues-readmes-forges/conception-section-catalogue.md` |
| data-section-catalogue.md | — | 1.9 Ko | `05-catalogues-readmes-forges/data-section-catalogue.md` |
| design-section-catalogue.md | — | 2.2 Ko | `05-catalogues-readmes-forges/design-section-catalogue.md` |
| development-section-catalogue.md | — | 1.9 Ko | `05-catalogues-readmes-forges/development-section-catalogue.md` |
| observability-section-catalogue.md | — | 1.1 Ko | `05-catalogues-readmes-forges/observability-section-catalogue.md` |
| ops-section-catalogue.md | — | 1.5 Ko | `05-catalogues-readmes-forges/ops-section-catalogue.md` |
| organization-section-catalogue.md | — | 1.3 Ko | `05-catalogues-readmes-forges/organization-section-catalogue.md` |
| seo-section-catalogue.md | — | 1.9 Ko | `05-catalogues-readmes-forges/seo-section-catalogue.md` |
| tests-section-catalogue.md | — | 2 Ko | `05-catalogues-readmes-forges/tests-section-catalogue.md` |
| websec-section-catalogue.md | — | 1.2 Ko | `05-catalogues-readmes-forges/websec-section-catalogue.md` |

### 05-insatisfactions

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| INSTRUCTION.md | — | 6.8 Ko | `05-insatisfactions/INS-0001/INSTRUCTION.md` |
| INSTRUCTION.md | — | 9.6 Ko | `05-insatisfactions/INS-0002/INSTRUCTION.md` |
| INSTRUCTION.md | — | 7 Ko | `05-insatisfactions/INS-0003/INSTRUCTION.md` |
| INSTRUCTION.md | — | 6.7 Ko | `05-insatisfactions/INS-0004/INSTRUCTION.md` |
| INSTRUCTION.md | — | 11.2 Ko | `05-insatisfactions/INS-0005/INSTRUCTION.md` |

### 06-travaux-confies

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| pilot - TRAVAUX - 20260905c.md | 20260905c | 9.9 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905c.md` |
| pilot - TRAVAUX - 20260905c.tf.jsonl | — | 1.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905c.tf.jsonl` |
| pilot - TRAVAUX - 20260905d.md | 20260905d | 6.9 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905d.md` |
| pilot - TRAVAUX - 20260905d.tf.jsonl | — | 0.9 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905d.tf.jsonl` |
| pilot - TRAVAUX - 20260905e.md | 20260905e | 6.4 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905e.md` |
| pilot - TRAVAUX - 20260905e.tf.jsonl | — | 0.9 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905e.tf.jsonl` |
| pilot - TRAVAUX - 20260905f.md | 20260905f | 6.3 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905f.md` |
| pilot - TRAVAUX - 20260905f.tf.jsonl | — | 0.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905f.tf.jsonl` |
| pilot - TRAVAUX - 20260905g.md | 20260905g | 9 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905g.md` |
| pilot - TRAVAUX - 20260905g.tf.jsonl | — | 1.5 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905g.tf.jsonl` |
| pilot - TRAVAUX - 20260905h.md | 20260905h | 9.3 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905h.md` |
| pilot - TRAVAUX - 20260905h.tf.jsonl | — | 1.3 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905h.tf.jsonl` |
| pilot - TRAVAUX - 20260905i.md | 20260905i | 6.2 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905i.md` |
| pilot - TRAVAUX - 20260905i.tf.jsonl | — | 0.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905i.tf.jsonl` |
| pilot - TRAVAUX - 20260905j.md | 20260905j | 5.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905j.md` |
| pilot - TRAVAUX - 20260905j.tf.jsonl | — | 0.6 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905j.tf.jsonl` |
| pilot - TRAVAUX - 20260905k.md | 20260905k | 5.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905k.md` |
| pilot - TRAVAUX - 20260905k.tf.jsonl | — | 0.6 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260905k.tf.jsonl` |
| pilot - TRAVAUX - 20260907a.md | 20260907a | 9.4 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260907a.md` |
| pilot - TRAVAUX - 20260907a.tf.jsonl | — | 1.3 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260907a.tf.jsonl` |
| pilot - TRAVAUX - 20260908a.md | 20260908a | 7.3 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260908a.md` |
| pilot - TRAVAUX - 20260908a.tf.jsonl | — | 1 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260908a.tf.jsonl` |
| pilot - TRAVAUX - 20260912a.md | 20260912a | 10.8 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260912a.md` |
| pilot - TRAVAUX - 20260912a.tf.jsonl | — | 1.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260912a.tf.jsonl` |
| pilot - TRAVAUX - 20260912b.md | 20260912b | 10.1 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260912b.md` |
| pilot - TRAVAUX - 20260912b.tf.jsonl | — | 1.5 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260912b.tf.jsonl` |
| pilot - TRAVAUX - 20260912c.md | 20260912c | 7.7 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260912c.md` |
| pilot - TRAVAUX - 20260912c.tf.jsonl | — | 1.4 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260912c.tf.jsonl` |
| pilot - TRAVAUX - 20260914a.md | 20260914a | 12.9 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260914a.md` |
| pilot - TRAVAUX - 20260914a.tf.jsonl | — | 2.2 Ko | `06-travaux-confies/2026-09/pilot - TRAVAUX - 20260914a.tf.jsonl` |

*Un livrable présent et absent de ce tableau est un défaut : cet index est régénéré, et un
index qui a dérivé de son dossier ne sert plus qu'à donner confiance à tort.*

<!-- index-livrables:fin -->
