# Retours forges — Produit-87 — 20261123a

- **Contexte** : autre — audit complet POC-to-Prod du produit Prism (PRM) le 23/11/2026, conduit par forge-audit au standard publié par le client Client-A (prompt et Compliance Pack 2026-11-05b), hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 1, 2, 3, 4 (entrées `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : a_remettre

Ce lot porte **4 retours** : trois sur forge-audit, rencontrés en rendant et en jugeant le rapport d'audit et la fiche sécurité de Prism, et un sur l'état du pilot relevé à l'ouverture.

## digit-ai-forge-audit (`digit-ai-forge-audit`)

Les trois retours portent sur les portes de rendu de la forge, jouées après que la porte du client a rendu CONFORME.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | générique | **Le thème du tenant Client-A fait échouer la porte de rendu, et les données d'audit ne peuvent pas le corriger.** Le 23/11/2026, `node tools/verifier-rapport-html.mjs` sur `Client-A - PRM - Rapport d'audit POC-to-Prod - 20261123c.html`, tenant `Produit-64/tenants/client-a/tenant.yaml`, rend 1 erreur bloquante : « oracle-tokens T8 anneau de focus 1.97:1 < 3:1 — --focus-anneau (2px solid var(--accent)) sur --brand-bg (#1A1A1A), thème clair ». `build-rapport` prévient aussi que le thème en cache est périmé. La porte du client rend CONFORME sur le même fichier. | Règle qui aurait évité le retour : oracle-tokens T8, joué par `build-theme.mjs` sur le thème produit, avant tout rendu. Piste : choisir pour l'anneau de focus un jeton qui contraste avec chaque fond où il peut tomber, `--brand-bg` compris. Fixture : tenant à accent sombre sur bandeau sombre, refusé à la construction du thème. |
| RT-2 | majeur | générique | **L'oracle de la fiche sécurité juge le canevas de la forge, pas le gabarit que le client a publié.** La fiche `Client-A - PRM - Fiche Sécurité Mise à disposition - Dev - 20261123a.html`, remplie au modèle du Compliance Pack client (`Client-A - Modèle Fiche Sécurité Mise à disposition - Dev - 20260710a.html`), rend FAIL à `oracles/verifier-fiche-securite.mjs` sur FS1 (le `{{…}}` du script du modèle), FS2 (titres « 1. » et non « 1 · »), FS4 (la ligne « Dev-team / run » prise pour la ligne d'URL), FS5 (colonne d'intitulés à 32 %) et FS9 (pas d'identifiant `gd-…`). De son côté, `tools/build-fiche.mjs` imprime la référence avec le code du tenant (`NH-SEC-DEV-…`), alors que le prompt client exige `<TRIGRAMME>-SEC-DEV-…`. Preuve : `forge/audit/20261123/output/01 - Fiche Sécurité/verifier-fiche-securite.json`. | Règle qui aurait évité le retour : aucune ne couvre ce cas (§ 4 de quality-oracles). Pistes : 1) un tenant qui déclare `standard_client` déclare aussi son gabarit de fiche, et l'oracle juge contre ce gabarit, en gardant FS3, FS6, FS7, FS8, FS10 et FS11 qui portent sur le fond ; 2) `build-fiche` prend le trigramme de l'application en paramètre. |
| RT-3 | mineur | générique | **Un contrôle de rendu lit une colonne que le rendu n'affiche pas.** `verifier-rapport-html` avertit « composant déprécié sans successeur nommé » pour 20 composants dont le champ `reco` commence par « Remplacer ». Le contrôle G cherche `remplac|alternative` dans la ligne HTML. Or la table des composants (`tools/rapport-poc-to-prod.mjs:625-626`) n'affiche que `reco_flag` (« Oui » ou « — », au format du client), jamais le texte de la recommandation. | Règle qui aurait évité le retour : aucune. Piste : le contrôle lit `COMPOSANTS` dans les données embarquées, comme la porte client le fait (`r.reco`, `r.remplacant`), et non la cellule rendue. |

**Portée** : générique pour les trois.

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-4 | mineur | générique | **L'état du pilot rend le poste « NON prêt » pour tous les produits.** Relevé d'ouverture de la session du 23/11/2026 : « digit-ai-factory (pilot) — 59 modification(s) locale(s) non enregistrée(s) [...] le plus ancien fichier non généré date de 20 j ». Il conclut « Poste NON prêt — appliquer les remèdes AVANT tout run ». Un produit ne peut pas appliquer ce remède. | Règle qui aurait évité le retour : R-19, jouée à la clôture des sessions du pilot. Piste : la clôture d'une session du pilot refuse de laisser des fichiers non générés de plus de 48 h hors d'un commit. |

## La règle qui aurait évité le retour

- **RT-1** : oracle-tokens T8, à jouer sur le thème au moment où `build-theme` le construit, pas seulement sur le rapport rendu.
- **RT-2** : aucune règle ne couvre ce cas ; le domaine « fiche au gabarit du client » n'a pas d'oracle (§ 4 de quality-oracles). Clé proposée : `oracle-de-forge-oppose-au-gabarit-client`.
- **RT-3** : aucune règle ne couvre ce cas ; un contrôle de rendu qui juge une cellule doit juger une cellule affichée. Clé proposée : `controle-qui-lit-une-colonne-non-rendue`.
- **RT-4** : R-19, appliquée aux sessions du pilot. Clé proposée : `etat-du-pilot-bloque-la-fraicheur-des-produits`.

## Rattachement

Registre interrogé le 23/11/2026 dans `todo/CLASSES.json` du pilot (331 classes), par mots-clés : thème, contraste, focus, fiche, gabarit, client, colonne, rendu, poste, fraîcheur.

- RT-1 se rattache à `gabarit-de-skill-refuse-par-les-oracles-du-socle`.
- RT-2 : `livrable-sans-identite-de-gabarit` ne couvre que FS9, et `contrainte-client-connue-non-consultee` parle d'une contrainte de plateforme. Une classe est proposée.
- RT-3 : `oracle-faux-negatif-sur-rendu` traite le cas inverse (un vert à tort). Une classe est proposée.
- RT-4 : aucune classe ne décrit l'état du pilot qui bloque ses produits. Une classe est proposée.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `compliance-pack/maj-versions.mjs` du client ne lit pas NuGet. Les 76 paquets .NET de Prism n'avaient pas de version actuelle interrogée. | Script rejouable `registre-nuget.mjs` (API NuGet et OSV), rangé avec les preuves de l'audit | oui | à remonter au projet commun Client-A (canal du client, distinct de ce lot) : l'outil appartient au Compliance Pack, pas à une forge |
| Composants hors registre marqués « Oui » : 6 erreurs de version inférieure à la porte de rendu | `reco_flag` à « — » pour les DLL propriétaires, l'action restant portée par un constat D08 (indice c) | non | conforme à la règle du client : « Oui » est réservé aux montées pilotées par un risque |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - PRM - Rapport d'audit POC-to-Prod - 20261123c.html` | gd-rapport-audit-poc-to-prod · 1.0.2 | rien pour le fond | aucun lecteur consulté à ce jour | rien | générique (voir RT-1, RT-3) |
| `Client-A - PRM - Fiche Sécurité Mise à disposition - Dev - 20261123a.html` | gabarit non marqué : `Produit-64/output/07-Standards Client-A/compliance-pack/Client-A - Modèle Fiche Sécurité Mise à disposition - Dev - 20260710a.html` — aucune version du gabarit déclarée dans le document | trois lignes : population admise, restriction effective, comptes invités | aucun lecteur consulté à ce jour | les trois lignes, dans la section Exposition | générique (voir RT-2) |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. L'audit est resté en lecture seule et n'a fait aucun déploiement.

## Confirmations positives

- La porte du client (`verifier-rapport-audit.mjs`, commit 386f14b) rend CONFORME sur un rapport rendu par `build-rapport` au gabarit POC-to-Prod, avec 93 contraintes du pack client. Le défaut D14 relevé le 10/11 chez Produit-88 n'a pas réapparu : D14 et D17 sont marquées « sans objet » avec leur motif.
- `build-rapport --copie-output` range les indices précédents sous `old/` et ne remplace aucun fichier.
- `verifier-chaine-terraform.mjs` et `verifier-posture-azure.mjs` ont tourné en lecture seule sur une session `az`, et leurs constats portent tous un `fichier:ligne` ou une commande de preuve.

## Ordre recommandé

1. **RT-1** : une correction du générateur de thème lève l'erreur sur tous les rapports Client-A.
2. **RT-2** : sans elle, aucune fiche au gabarit du client ne passe l'oracle de la forge.
3. **RT-3** : il ne génère que du bruit d'avertissement.
4. **RT-4** : relève du ménage du pilot.
