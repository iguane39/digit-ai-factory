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
livrables, 0 atteignable**, pendant onze jours sans que la cause soit nommée.

Ce fichier-ci n'a pas d'espace dans son nom : il s'ouvre. Les chemins ci-dessous sont donnés
à **copier-coller** — c'est ce qui marche aujourd'hui, et le dire vaut mieux que laisser
essayer. *Le nom daté n'est pas le problème : il porte la version et la traçabilité.*

**État** : 167 livrable(s) courant(s), 10 archivé(s), 6 famille(s).

### 01-revues-et-propositions

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| 20260825-releve-heritage-produits.md | — | 5.8 Ko | `01-revues-et-propositions/20260825-releve-heritage-produits.md` |
| Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md | 20260815a | 5.5 Ko | `01-revues-et-propositions/Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md` |
| Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md.jugement.json | — | 0.4 Ko | `01-revues-et-propositions/Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md.jugement.json` |
| Digit-AI - Proposition Forge - Restitution lisible - 20260815a.md | 20260815a | 11 Ko | `01-revues-et-propositions/Digit-AI - Proposition Forge - Restitution lisible - 20260815a.md` |
| Digit-AI - Proposition Forge - Restitution lisible - 20260815a.md.jugement.json | — | 0.3 Ko | `01-revues-et-propositions/Digit-AI - Proposition Forge - Restitution lisible - 20260815a.md.jugement.json` |
| Digit-AI - Proposition Forge - Tuyauterie cognitive - 20260809a.md | 20260809a | 9.5 Ko | `01-revues-et-propositions/Digit-AI - Proposition Forge - Tuyauterie cognitive - 20260809a.md` |
| Digit-AI - Proposition Forge - Tuyauterie cognitive - 20260809a.md.jugement.json | — | 0.3 Ko | `01-revues-et-propositions/Digit-AI - Proposition Forge - Tuyauterie cognitive - 20260809a.md.jugement.json` |
| Digit-AI - Revue D8 - Restitutions du 15-08 - 20260815a.md | 20260815a | 3.7 Ko | `01-revues-et-propositions/Digit-AI - Revue D8 - Restitutions du 15-08 - 20260815a.md` |
| Digit-AI - Revue D8 - Restitutions du 15-08 - 20260815a.md.jugement.json | — | 0.3 Ko | `01-revues-et-propositions/Digit-AI - Revue D8 - Restitutions du 15-08 - 20260815a.md.jugement.json` |
| Digit-AI - Revue Forge - Écosystème - 20260808a.md | 20260808a | 11.4 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260808a.md` |
| Digit-AI - Revue Forge - Écosystème - 20260808a.md.jugement.json | — | 0.3 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260808a.md.jugement.json` |
| Digit-AI - Revue Forge - Écosystème - 20260808a.md.oracles-cache.json | — | 0 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260808a.md.oracles-cache.json` |
| Digit-AI - Revue Forge - Écosystème - 20260808a.md.oracles-historique.jsonl | — | 0.1 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260808a.md.oracles-historique.jsonl` |
| Digit-AI - Revue Forge - Écosystème - 20260808a.md.oracles.json | — | 1.9 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260808a.md.oracles.json` |
| Digit-AI - Revue Forge - Écosystème - 20260819a.md | 20260819a | 6.1 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260819a.md` |
| Digit-AI - Revue Forge - Écosystème - 20260819a.md.jugement.json | — | 0.3 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260819a.md.jugement.json` |
| Digit-AI - Revue Forge - Écosystème - 20260819a.md.oracles-cache.json | — | 0 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260819a.md.oracles-cache.json` |
| Digit-AI - Revue Forge - Écosystème - 20260819a.md.oracles-historique.jsonl | — | 0.3 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260819a.md.oracles-historique.jsonl` |
| Digit-AI - Revue Forge - Écosystème - 20260819a.md.oracles.json | — | 2.1 Ko | `01-revues-et-propositions/Digit-AI - Revue Forge - Écosystème - 20260819a.md.oracles.json` |
| Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html *(archivé)* | 20260815a | 35.1 Ko | `01-revues-et-propositions/old/Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html` |
| Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html.jugement.json *(archivé)* | — | 0.3 Ko | `01-revues-et-propositions/old/Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html.jugement.json` |
| Produit-02 - Proposition Refonte - Rapport SEO - 20260815a.md | 20260815a | 7 Ko | `01-revues-et-propositions/Produit-02 - Proposition Refonte - Rapport SEO - 20260815a.md` |
| Produit-02 - Proposition Refonte - Rapport SEO - 20260815a.md.jugement.json | — | 0.3 Ko | `01-revues-et-propositions/Produit-02 - Proposition Refonte - Rapport SEO - 20260815a.md.jugement.json` |

### 02-schema-ecosysteme

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| Forge Pilot - Schéma Écosystème - 20260820a.html | 20260820a | 57.9 Ko | `02-schema-ecosysteme/Forge Pilot - Schéma Écosystème - 20260820a.html` |
| Forge Pilot - Schéma Écosystème - 20260820a.html.jugement.json | — | 0.3 Ko | `02-schema-ecosysteme/Forge Pilot - Schéma Écosystème - 20260820a.html.jugement.json` |
| Forge Pilot - Schéma Écosystème - 20260811h.html *(archivé)* | 20260811h | 53 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260811h.html` |
| Forge Pilot - Schéma Écosystème - 20260811h.html.jugement.json *(archivé)* | — | 0.3 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260811h.html.jugement.json` |
| Forge Pilot - Schéma Écosystème - 20260812a.html *(archivé)* | 20260812a | 55.9 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260812a.html` |
| Forge Pilot - Schéma Écosystème - 20260812a.html.jugement.json *(archivé)* | — | 0.3 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260812a.html.jugement.json` |
| Forge Pilot - Schéma Écosystème - 20260812b.html *(archivé)* | 20260812b | 57.2 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260812b.html` |
| Forge Pilot - Schéma Écosystème - 20260812b.html.jugement.json *(archivé)* | — | 0.3 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260812b.html.jugement.json` |
| Forge Pilot - Schéma Écosystème - 20260813a.html *(archivé)* | 20260813a | 57.4 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260813a.html` |
| Forge Pilot - Schéma Écosystème - 20260813a.html.jugement.json *(archivé)* | — | 0.3 Ko | `02-schema-ecosysteme/old/Forge Pilot - Schéma Écosystème - 20260813a.html.jugement.json` |

### 03-etudes

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| 20260822-etude-opportunite-fraicheur-des-verdicts.md.oracles-cache.json | — | 0 Ko | `03-etudes/_oracles/20260822-etude-opportunite-fraicheur-des-verdicts.md.oracles-cache.json` |
| 20260822-etude-opportunite-fraicheur-des-verdicts.md.oracles-historique.jsonl | — | 0.8 Ko | `03-etudes/_oracles/20260822-etude-opportunite-fraicheur-des-verdicts.md.oracles-historique.jsonl` |
| 20260822-etude-opportunite-fraicheur-des-verdicts.md.oracles.json | — | 2.4 Ko | `03-etudes/_oracles/20260822-etude-opportunite-fraicheur-des-verdicts.md.oracles.json` |
| 20260822-etude-opportunite-troisieme-point-observation-i18n.md.oracles-cache.json | — | 0 Ko | `03-etudes/_oracles/20260822-etude-opportunite-troisieme-point-observation-i18n.md.oracles-cache.json` |
| 20260822-etude-opportunite-troisieme-point-observation-i18n.md.oracles-historique.jsonl | — | 0.2 Ko | `03-etudes/_oracles/20260822-etude-opportunite-troisieme-point-observation-i18n.md.oracles-historique.jsonl` |
| 20260822-etude-opportunite-troisieme-point-observation-i18n.md.oracles.json | — | 1.9 Ko | `03-etudes/_oracles/20260822-etude-opportunite-troisieme-point-observation-i18n.md.oracles.json` |
| 20260822-etude-opportunite-vue-portefeuille.md.oracles-cache.json | — | 0 Ko | `03-etudes/_oracles/20260822-etude-opportunite-vue-portefeuille.md.oracles-cache.json` |
| 20260822-etude-opportunite-vue-portefeuille.md.oracles-historique.jsonl | — | 0.2 Ko | `03-etudes/_oracles/20260822-etude-opportunite-vue-portefeuille.md.oracles-historique.jsonl` |
| 20260822-etude-opportunite-vue-portefeuille.md.oracles.json | — | 1.8 Ko | `03-etudes/_oracles/20260822-etude-opportunite-vue-portefeuille.md.oracles.json` |
| 20260812-etude-forge-data-moteurs.md | — | 7.4 Ko | `03-etudes/20260812-etude-forge-data-moteurs.md` |
| 20260812-etude-opportunite-forges.md | — | 15.2 Ko | `03-etudes/20260812-etude-opportunite-forges.md` |
| 20260813-etude-opportunite-outillage-analyse.md | — | 20.1 Ko | `03-etudes/20260813-etude-opportunite-outillage-analyse.md` |
| 20260813-etude-personas-agents.md | — | 11.4 Ko | `03-etudes/20260813-etude-personas-agents.md` |
| 20260814-etude-opportunite-pans-tests-prompts.md | — | 18.6 Ko | `03-etudes/20260814-etude-opportunite-pans-tests-prompts.md` |
| 20260814-etude-opportunite-pentest-owasp.md | — | 17.4 Ko | `03-etudes/20260814-etude-opportunite-pentest-owasp.md` |
| 20260814-etude-opportunite-taste-skill.md | — | 14.5 Ko | `03-etudes/20260814-etude-opportunite-taste-skill.md` |
| 20260815-etude-opportunite-ce-que-personne-ne-juge.md | — | 6.4 Ko | `03-etudes/20260815-etude-opportunite-ce-que-personne-ne-juge.md` |
| 20260815-etude-opportunite-circuit-insatisfaction.md | — | 5.3 Ko | `03-etudes/20260815-etude-opportunite-circuit-insatisfaction.md` |
| 20260815-etude-opportunite-cout-du-faux-positif.md | — | 7 Ko | `03-etudes/20260815-etude-opportunite-cout-du-faux-positif.md` |
| 20260815-etude-opportunite-lecons-audit-reel.md | — | 5.6 Ko | `03-etudes/20260815-etude-opportunite-lecons-audit-reel.md` |
| 20260815-etude-opportunite-qualite-graphique.md | — | 5.7 Ko | `03-etudes/20260815-etude-opportunite-qualite-graphique.md` |
| 20260815-etude-opportunite-restitution-lisible.md | — | 6.3 Ko | `03-etudes/20260815-etude-opportunite-restitution-lisible.md` |
| 20260817-etude-opportunite-cadence-de-mission.md | — | 24.3 Ko | `03-etudes/20260817-etude-opportunite-cadence-de-mission.md` |
| 20260817-etude-opportunite-consignes-de-mise-a-jour.md | — | 20.3 Ko | `03-etudes/20260817-etude-opportunite-consignes-de-mise-a-jour.md` |
| 20260817-etude-opportunite-conventions-parametrables.md | — | 20.6 Ko | `03-etudes/20260817-etude-opportunite-conventions-parametrables.md` |
| 20260817-etude-opportunite-couverture-par-role.md | — | 5.4 Ko | `03-etudes/20260817-etude-opportunite-couverture-par-role.md` |
| 20260817-etude-opportunite-ecart-servi-versionne.md | — | 6.4 Ko | `03-etudes/20260817-etude-opportunite-ecart-servi-versionne.md` |
| 20260817-etude-opportunite-publication-livrables.md | — | 6.3 Ko | `03-etudes/20260817-etude-opportunite-publication-livrables.md` |
| 20260817-etude-opportunite-rangement-output.md | — | 18.3 Ko | `03-etudes/20260817-etude-opportunite-rangement-output.md` |
| 20260817-etude-opportunite-renommage-factory.md | — | 23 Ko | `03-etudes/20260817-etude-opportunite-renommage-factory.md` |
| 20260817-etude-opportunite-sequencement-factory.md | — | 44.8 Ko | `03-etudes/20260817-etude-opportunite-sequencement-factory.md` |
| 20260817-etude-opportunite-tests-bout-en-bout.md | — | 27.3 Ko | `03-etudes/20260817-etude-opportunite-tests-bout-en-bout.md` |
| 20260817-etude-opportunite-todo-produit.md | — | 27.4 Ko | `03-etudes/20260817-etude-opportunite-todo-produit.md` |
| 20260818-cartographie-oracles-cadence-de-mission.md | — | 5.8 Ko | `03-etudes/20260818-cartographie-oracles-cadence-de-mission.md` |
| 20260818-etude-opportunite-admission-digit-ai-queue.md | — | 14.9 Ko | `03-etudes/20260818-etude-opportunite-admission-digit-ai-queue.md` |
| 20260818-etude-opportunite-cablage-orchestrer-boucle.md | — | 12.4 Ko | `03-etudes/20260818-etude-opportunite-cablage-orchestrer-boucle.md` |
| 20260818-etude-opportunite-memoire-partagee.md | — | 25.4 Ko | `03-etudes/20260818-etude-opportunite-memoire-partagee.md` |
| 20260818-etude-opportunite-retour-usage-vers-delta.md | — | 9.1 Ko | `03-etudes/20260818-etude-opportunite-retour-usage-vers-delta.md` |
| 20260819-etude-opportunite-forge-consulting.md | — | 13.4 Ko | `03-etudes/20260819-etude-opportunite-forge-consulting.md` |
| 20260819-etude-opportunite-forge-consulting.md.oracles-cache.json | — | 0 Ko | `03-etudes/20260819-etude-opportunite-forge-consulting.md.oracles-cache.json` |
| 20260819-etude-opportunite-forge-consulting.md.oracles-historique.jsonl | — | 0.1 Ko | `03-etudes/20260819-etude-opportunite-forge-consulting.md.oracles-historique.jsonl` |
| 20260819-etude-opportunite-forge-consulting.md.oracles.json | — | 1.9 Ko | `03-etudes/20260819-etude-opportunite-forge-consulting.md.oracles.json` |
| 20260819-etude-opportunite-meta-oracle-enclenchement.md | — | 16.8 Ko | `03-etudes/20260819-etude-opportunite-meta-oracle-enclenchement.md` |
| 20260819-etude-opportunite-module-de-traduction.md | — | 16.6 Ko | `03-etudes/20260819-etude-opportunite-module-de-traduction.md` |
| 20260819-etude-opportunite-retro-documentation.md | — | 9.6 Ko | `03-etudes/20260819-etude-opportunite-retro-documentation.md` |
| 20260819-etude-opportunite-retro-documentation.md.oracles-cache.json | — | 0 Ko | `03-etudes/20260819-etude-opportunite-retro-documentation.md.oracles-cache.json` |
| 20260819-etude-opportunite-retro-documentation.md.oracles-historique.jsonl | — | 0.1 Ko | `03-etudes/20260819-etude-opportunite-retro-documentation.md.oracles-historique.jsonl` |
| 20260819-etude-opportunite-retro-documentation.md.oracles.json | — | 1.9 Ko | `03-etudes/20260819-etude-opportunite-retro-documentation.md.oracles.json` |
| 20260819-etude-opportunite-retro-engineering.md | — | 10.4 Ko | `03-etudes/20260819-etude-opportunite-retro-engineering.md` |
| 20260819-etude-opportunite-retro-engineering.md.oracles-cache.json | — | 0 Ko | `03-etudes/20260819-etude-opportunite-retro-engineering.md.oracles-cache.json` |
| 20260819-etude-opportunite-retro-engineering.md.oracles-historique.jsonl | — | 0.1 Ko | `03-etudes/20260819-etude-opportunite-retro-engineering.md.oracles-historique.jsonl` |
| 20260819-etude-opportunite-retro-engineering.md.oracles.json | — | 1.9 Ko | `03-etudes/20260819-etude-opportunite-retro-engineering.md.oracles.json` |
| 20260820-etude-opportunite-communication-interlocuteur.md | — | 10.4 Ko | `03-etudes/20260820-etude-opportunite-communication-interlocuteur.md` |
| 20260820-etude-opportunite-rgaa.md | — | 12.9 Ko | `03-etudes/20260820-etude-opportunite-rgaa.md` |
| 20260822-etude-opportunite-fraicheur-des-verdicts.md | — | 14 Ko | `03-etudes/20260822-etude-opportunite-fraicheur-des-verdicts.md` |
| 20260822-etude-opportunite-troisieme-point-observation-i18n.md | — | 8.2 Ko | `03-etudes/20260822-etude-opportunite-troisieme-point-observation-i18n.md` |
| 20260822-etude-opportunite-vue-portefeuille.md | — | 8.4 Ko | `03-etudes/20260822-etude-opportunite-vue-portefeuille.md` |
| 20260830-L99-etat-de-l-art-marche.md | — | 27.3 Ko | `03-etudes/20260830-L99-etat-de-l-art-marche.md` |
| 20260831-opportunite-etat-de-l-art-marche.md | — | 9.1 Ko | `03-etudes/20260831-opportunite-etat-de-l-art-marche.md` |
| 20260901-etude-opportunite-dataforseo.md | — | 20.6 Ko | `03-etudes/20260901-etude-opportunite-dataforseo.md` |
| 20260901-etude-opportunite-strategie-tests.md | — | 23.9 Ko | `03-etudes/20260901-etude-opportunite-strategie-tests.md` |
| 20260902-etude-opportunite-dataforseo-produit-02.md | — | 43.7 Ko | `03-etudes/20260902-etude-opportunite-dataforseo-produit-02.md` |

### 04-plans

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| 20260813-plan-strategie-tests-e2e.md | — | 13.3 Ko | `04-plans/20260813-plan-strategie-tests-e2e.md` |
| Digit-AI - Note Migration - Chemins du pilot renomme - 20260818b.md | 20260818b | 4.3 Ko | `04-plans/Digit-AI - Note Migration - Chemins du pilot renomme - 20260818b.md` |
| Digit-AI - Note Migration - Chemins du pilot renomme - 20260818b.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Note Migration - Chemins du pilot renomme - 20260818b.md.jugement.json` |
| Digit-AI - Note Revue - Denominateur des freres - 20260818a.md | 20260818a | 4.1 Ko | `04-plans/Digit-AI - Note Revue - Denominateur des freres - 20260818a.md` |
| Digit-AI - Note Revue - Denominateur des freres - 20260818a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Note Revue - Denominateur des freres - 20260818a.md.jugement.json` |
| Digit-AI - Plan Renommage - Fenetre A factory - 20260817a.md | 20260817a | 3.2 Ko | `04-plans/Digit-AI - Plan Renommage - Fenetre A factory - 20260817a.md` |
| Digit-AI - Plan Renommage - Fenetre A factory - 20260817a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Plan Renommage - Fenetre A factory - 20260817a.md.jugement.json` |
| Digit-AI - Synthese Boucle - 17 restants du registre - 20260818a.md | 20260818a | 13.3 Ko | `04-plans/Digit-AI - Synthese Boucle - 17 restants du registre - 20260818a.md` |
| Digit-AI - Synthese Boucle - 17 restants du registre - 20260818a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Boucle - 17 restants du registre - 20260818a.md.jugement.json` |
| Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md | 20260815a | 3.6 Ko | `04-plans/Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md` |
| Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md.jugement.json` |
| Digit-AI - Synthese Diagnostic - Avancement des traitements longs - 20260815a.md | 20260815a | 3.8 Ko | `04-plans/Digit-AI - Synthese Diagnostic - Avancement des traitements longs - 20260815a.md` |
| Digit-AI - Synthese Diagnostic - Avancement des traitements longs - 20260815a.md.jugement.json | — | 0.4 Ko | `04-plans/Digit-AI - Synthese Diagnostic - Avancement des traitements longs - 20260815a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Analyse L99 etat de l art marche - 20260830n.md | 20260830n | 15.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Analyse L99 etat de l art marche - 20260830n.md` |
| Digit-AI - Synthese Mandat - Anatomie du bloc 3 armee - 20260830e.md | 20260830e | 17.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Anatomie du bloc 3 armee - 20260830e.md` |
| Digit-AI - Synthese Mandat - Anonymisation cablee sur git - 20260901g.md | 20260901g | 11.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Anonymisation cablee sur git - 20260901g.md` |
| Digit-AI - Synthese Mandat - Architecture du circuit insatisfaction - 20260815a.md | 20260815a | 3.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Architecture du circuit insatisfaction - 20260815a.md` |
| Digit-AI - Synthese Mandat - Architecture du circuit insatisfaction - 20260815a.md.jugement.json | — | 0.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Architecture du circuit insatisfaction - 20260815a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815a.md | 20260815a | 3.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815a.md` |
| Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Bloc 3 forme de reference - 20260830f.md | 20260830f | 15.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Bloc 3 forme de reference - 20260830f.md` |
| Digit-AI - Synthese Mandat - Campagne tous les todos - 20260901b.md | 20260901b | 13.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Campagne tous les todos - 20260901b.md` |
| Digit-AI - Synthese Mandat - Etude opportunite etat de l art - 20260831a.md | 20260831a | 15.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Etude opportunite etat de l art - 20260831a.md` |
| Digit-AI - Synthese Mandat - Forme du bloc 3 et redescente aux produits - 20260830c.md | 20260830c | 17.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Forme du bloc 3 et redescente aux produits - 20260830c.md` |
| Digit-AI - Synthese Mandat - Heritage a l ouverture et localisateurs - 20260830g.md | 20260830g | 16.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Heritage a l ouverture et localisateurs - 20260830g.md` |
| Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md | 20260830i | 16.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md` |
| Digit-AI - Synthese Mandat - Ingestion rouverte et banc au vert - 20260831c.md | 20260831c | 13.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Ingestion rouverte et banc au vert - 20260831c.md` |
| Digit-AI - Synthese Mandat - Juste milieu du canal de remontee - 20260830k.md | 20260830k | 15.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Juste milieu du canal de remontee - 20260830k.md` |
| Digit-AI - Synthese Mandat - Lexique d invocation inerte - 20260830l.md | 20260830l | 14.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Lexique d invocation inerte - 20260830l.md` |
| Digit-AI - Synthese Mandat - Lexique d invocation reactive - 20260830m.md | 20260830m | 14.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Lexique d invocation reactive - 20260830m.md` |
| Digit-AI - Synthese Mandat - Mutation a la demande et Portee rectifiee - 20260901c.md | 20260901c | 12.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Mutation a la demande et Portee rectifiee - 20260901c.md` |
| Digit-AI - Synthese Mandat - Pourquoi le bloc 3 derive - 20260830d.md | 20260830d | 16.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Pourquoi le bloc 3 derive - 20260830d.md` |
| Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817a.md | 20260817a | 7.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817a.md` |
| Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Publication et campagne des items decides - 20260831d.md | 20260831d | 23.1 Ko | `04-plans/Digit-AI - Synthese Mandat - Publication et campagne des items decides - 20260831d.md` |
| Digit-AI - Synthese Mandat - Recopie de l heritage et parite - 20260830h.md | 20260830h | 14.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Recopie de l heritage et parite - 20260830h.md` |
| Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817a.md | 20260817a | 7.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817a.md` |
| Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Remise a niveau et renommage - 20260830b.md | 20260830b | 19.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Remise a niveau et renommage - 20260830b.md` |
| Digit-AI - Synthese Mandat - Remontee automatique des retours produits - 20260830j.md | 20260830j | 16.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Remontee automatique des retours produits - 20260830j.md` |
| Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md | 20260901a | 12.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md` |
| Digit-AI - Synthese Mandat - Selecteurs de familles et palier 1 des tests - 20260901e.md | 20260901e | 13.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Selecteurs de familles et palier 1 des tests - 20260901e.md` |
| Digit-AI - Synthese Mandat - Six actions et une porte de publication - 20260901f.md | 20260901f | 12.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Six actions et une porte de publication - 20260901f.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md | 20260822a | 13.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md` |
| Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815a.md | 20260815a | 5.6 Ko | `04-plans/Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815a.md` |
| Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815a.md | 20260815a | 4.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815a.md` |
| Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817a.md | 20260817a | 6.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817a.md` |
| Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite les todos et les retours - 20260902b.md | 20260902b | 24.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite les todos et les retours - 20260902b.md` |
| Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md | 20260830a | 17.9 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md` |
| Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md | 20260817a | 6.4 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md` |
| Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260822b.md | 20260822b | 16.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite todos et retours - 20260822b.md` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260822b.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite todos et retours - 20260822b.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260822c.md | 20260822c | 9.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite todos et retours - 20260822c.md` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260822c.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite todos et retours - 20260822c.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite todos et retours - 20260831b.md | 20260831b | 17.5 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite todos et retours - 20260831b.md` |
| Digit-AI - Synthese Mandat - Traite tous les retours - 20260817a.md | 20260817a | 5.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite tous les retours - 20260817a.md` |
| Digit-AI - Synthese Mandat - Traite tous les retours - 20260817a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite tous les retours - 20260817a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Traite tous les retours et todos - 20260902a.md | 20260902a | 27.7 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite tous les retours et todos - 20260902a.md` |
| Digit-AI - Synthese Mandat - Traite tous les sujets - 20260823a.md | 20260823a | 9.8 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite tous les sujets - 20260823a.md` |
| Digit-AI - Synthese Mandat - Traite tous les sujets - 20260823a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Traite tous les sujets - 20260823a.md.jugement.json` |
| Digit-AI - Synthese Mandat - Verification de non perte jouable - 20260901d.md | 20260901d | 9 Ko | `04-plans/Digit-AI - Synthese Mandat - Verification de non perte jouable - 20260901d.md` |
| Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815a.md | 20260815a | 3.2 Ko | `04-plans/Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815a.md` |
| Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815a.md.jugement.json | — | 0.3 Ko | `04-plans/Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815a.md.jugement.json` |

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
| tests-section-catalogue.md | — | 2.1 Ko | `05-catalogues-readmes-forges/tests-section-catalogue.md` |
| websec-section-catalogue.md | — | 1.2 Ko | `05-catalogues-readmes-forges/websec-section-catalogue.md` |

### 05-insatisfactions

| Livrable | Version | Poids | Chemin à copier |
|---|---|---|---|
| INSTRUCTION.md | — | 6.9 Ko | `05-insatisfactions/INS-0001/INSTRUCTION.md` |

*Un livrable présent et absent de ce tableau est un défaut : cet index est régénéré, et un
index qui a dérivé de son dossier ne sert plus qu'à donner confiance à tort.*

<!-- index-livrables:fin -->
