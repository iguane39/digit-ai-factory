---
destinataire: humain
---

# Synthèse Mandat — seconde campagne du 14/11/2026 close et publiée

## 0. Synthèse d'ouverture

Les sujets décidés que la Factory pouvait corriger seule sont corrigés, rejoués et publiés : 37 sujets clos, 1 écarté car déjà corrigé, 1 laissé ouvert avec son motif. Les 6 forges touchées et le pilot sont à jour chez l'hébergeur. Les constats faits en chemin sont inscrits au registre comme 12 sujets candidats, sans rien décider à votre place. Deux gestes vous attendent, qui ne bloquent rien : accepter la mise à jour des 11 skills installés sur ce poste, et fermer chez l'hébergeur 190 alertes portées par des fixtures volontairement vulnérables.

Livré : [Synthèse du 14/11, seconde campagne close](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Seconde%20campagne%20du%2014-11%20close%20et%20publiee%20-%2020261114e.md)

## 1. En-tête d'identification

Exécution de vos réponses « A1 & A2 » à la synthèse 20261114d, puis « A1, A2, A3 » 2 fois aux points d'étape, sur le pilot `digit-ai-factory` et 6 forges. Synthèse relevée le 14/11/2026 à 19:40, heure de Paris (`date`). Session pilote Claude Opus 5.5 ; 9 agents `campagne` Claude Sonnet 5.5, un par lot, tous revenus.

Intention de la demande : vider le stock des sujets décidés que la Factory peut corriger seule.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Chaque sujet confié est clos sur une preuve rejouée et publié, ou laissé ouvert avec son motif ; aucun constat fait en chemin n'est perdu.

## 2. Verdict

37 sujets clos sur 39 confiés, 1 écarté (TF-2544, déjà corrigé le 05/11), 1 ouvert (TF-2521) ; registre PASS (`node todo/oracle-todo.mjs`) ; 7 dépôts publiés, 0 commit d'écart avec leur distant. Recette entière du pilot : 269 oracles verts sur 277, et les 8 en défaut sont expliqués (§ 4).

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient ; deux gestes vous attendent, inventoriés ci-dessous.

Bloquants de ce tour, chacun avec ce qui le lève :
- 11 skills installés sur ce poste divergent de leur source après la campagne (quality-oracles, forge-agents, experts-forge, prompt-analyzer-l99, digit-ai-page-html, digit-ai-schemas, systeme-de-marque, studio-de-direction, critique-le-design, ameliore-le-design, redige-les-exigences), et la règle de propagation exige votre accord explicite pour les mettre à jour : votre « propage » le lève, je les mets alors à jour dans cette session ; sans réponse, les sessions de ce poste exécutent les anciennes versions.
- 190 alertes de dépendances restent ouvertes chez l'hébergeur, 155 sur forge-websec et 35 sur forge-agents, toutes portées par des fixtures volontairement vulnérables et déclarées comme telles : les fermer est une publication sur un service hébergé, que seul votre GO autorise (la règle de publication) ; votre GO le lève, avec le motif « fixture de test » pour chacune ; sans réponse, les alertes restent affichées, sans risque réel.
- TF-2521 (des fichiers de contrôle écrits dans l’arbre d’une forge éditée par un agent) attend un périmètre précis, car la correction proposée les retirerait aussi chez les produits : la reprise du sujet à une prochaine campagne le lève.

## 4. Traité

- Seconde campagne, 9 lots revenus, chacun rejoué par moi avant publication :
  - forge-design, 5 sujets (TF-2562, TF-2546, TF-2541, TF-2535, TF-2534) : recette « Tout vert », 80 oracles, 0 échec, dans le vrai clone ; publié jusqu'à 7bf0b3e ;
  - forge-tests, 4 sujets (TF-2524, TF-2523, TF-2552, TF-2525) et la part tests de TF-2539 : 60 alertes réelles fermées par mise à jour, tests des 5 sujets verts ; publié jusqu'à 0220fcc ;
  - forge-agents, 2 lots fusionnés par moi, 12 sujets (dont TF-2522 : un contrôle PDF dont une bibliothèque manque rend désormais un SKIP motivé qui nomme la commande d'installation) : quality-oracles 816 contrôles, 0 échec, 12 avant ; publié jusqu'à fa881de ;
  - forge-audit (TF-2536, TF-2539), forge-conception (TF-2537), forge-websec (TF-2539) : recettes vertes ; publiés ;
  - pilot, 2 lots fusionnés, 19 sujets : publié jusqu'à c2622716.
- Recette entière du pilot après fusion : 15 cliquets relevés, dont 5 premières mesures ; 1 défaut neuf corrigé par moi (la règle de la fiche de sécurité du contrôle TM18 écrite en deux expressions, exigée par `oracle-pieges-regex`) ; `hook-ouverture.test` vert à 99 sur 99 rejoué seul, rouge sous la charge de la recette ; `oracle-skills` sur le parc attend votre « propage » ; 4 autres rouges à l'identique sur le pilot d'avant les fusions, donc antérieurs à la campagne, portés en TF-2578.
- Registre : 37 sujets clos avec leur descente, TF-2544 écarté, TF-2521 annoté ; 12 candidats inscrits (TF-2567 à TF-2578), un par reste neuf relevé par les agents, plus TF-2578.
- Branches des lots supprimées ; les copies de travail retirées de git.

Relecture d'intention : sans objet, motif : la consigne de campagne a été relue avant le lancement (RI-20261114-05), et ce tour n'en écrit aucune.

## 5. Non traité

- TF-2521 (des fichiers de contrôle écrits dans l'arbre d'une forge éditée par un agent) — motif : `borne_atteinte`, la correction proposée par l'agent retirerait aussi ces fichiers chez les produits, qui les enregistrent ; le sujet reste décidé, annoté du périmètre à tenir.
- 2 dossiers de copies de travail, `C:\dev\_wt-fb` et `C:\dev\_wt-pilot-pg`, restent sur le disque sans être suivis par git — motif : `dependance_externe`, Windows refuse leur suppression (« Permission denied »), des fichiers y sont encore ouverts par un autre programme.
- Les 4 recettes du pilot rouges avant la campagne — motif : `borne_atteinte`, hors du périmètre confié ; portées en TF-2578.

## 6. Écarts à la lettre

- Vous avez confié 39 sujets ; 1 est écarté et non corrigé : TF-2544 était déjà corrigé depuis TF-2174, l'agent l'a rejoué sur une copie jetable.
- TF-2536 est clos sur une prescription et son contrôle, sans exécutable qui rejoue la fiche avec l'étiquette déployée ; la limite est écrite dans sa clôture, et l'exécutable manquant est porté en TF-2572.
- Les 12 candidats reprennent les constats des agents sans que je les aie rejoués, sauf TF-2578 ; chacun le dit dans sa source.

## 7. Risques

- Un produit dont la fiche de sécurité est rendue par `build-fiche` reste sans ligne « Version déployée » : le contrôle de version de la fiche y rend SKIP (TF-2567) ; signal : un SKIP du contrôle FS12 au dossier de MEP ; parade : ajouter la ligne à la main d'ici la correction.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Mettre à jour les 11 skills installés sur ce poste | neuve | humain puis IA | accord humain exigé par la règle de propagation | votre « propage » | les sessions du poste exécutent les anciennes versions |
| A-2 | Fermer chez l'hébergeur les 190 alertes portées par des fixtures | neuve | humain | publication sur service hébergé | votre GO | les alertes restent affichées, sans risque réel |
| A-3 | Retirer les 2 dossiers de copies restés sur le disque | neuve | auto_ia | dependance_externe : fichiers ouverts | prochaine session | 65 et 1 342 fichiers inutiles sous `C:\dev` |
| A-4 | Trier les 12 candidats TF-2567 à TF-2578 | neuve | humain | décision du registre | prochaine demande « TODOs et retours » | ils restent candidats |

## 9. Traces

Registre `todo\TODO.jsonl` (37 clôtures, TF-2544 écarté, TF-2521 annoté, TF-2567 à TF-2578 candidats) ; pilot c08c312b, 2449fdf2, c2622716 ; forge-agents fa881de ; forge-design 7bf0b3e ; forge-tests 0220fcc ; forge-audit 3912b07 ; forge-conception 25ab9fe ; forge-websec 90d9923 ; recette entière du pilot dans `recette-pilot2.txt`, dossier temporaire de la session.
