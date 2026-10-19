# Retours forges — Produit-12 — 20261018a

- **Contexte** : autre — réorganisation sur place d'un dossier Dropbox de 81 414 fichiers à la norme de rangement (versions 2.16 à 2.18, 17 et 18/10/2026), remontée sur décision humaine D-62 (a) et action A-1 du 18/10/2026
- **Références ledger** : `forge\ledger.jsonl` seq 319, 332, 335, 336 (entrées `type: retour` et `oracles_verdict`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-18

---

## pilot (`digit-ai-factory`)

Le lot 20261014a a remonté la méthode de mesure d'une sortie automatisée de classement (RS-31, RS-32). Son application à une population dix fois plus grande en confirme le principe et y ajoute trois enseignements : un jeu de développement surestime le gain, un dossier synchronisé impose un garde-fou de plateforme, et deux étapes de la méthode se sont révélées utiles.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-34 | majeur | produit+générique | Une version 2.17 des règles déplaçait 27 des 44 erreurs du jeu de développement (les 150 fichiers déjà jugés) sans toucher un fichier juste. Mesurée sur 150 fichiers neufs, puis comparée à la version précédente sur ces mêmes fichiers, elle ne gagnait que 2 fichiers nets (4 faux devenus justes, 2 justes devenus faux, 18 faux restés faux). La version suivante, 2.18, gagnait 5 fichiers nets et aucun perdu sur un troisième échantillon neuf (75,8 % contre 72,5 %). Deux échantillons différents de la même version ont aussi donné 69,7 % et 62,3 % : sept points d'écart dus au seul tirage. Preuve : ledger seq 331 et 335, `verdicts217-lot*.csv`, `verdicts216-apparie.csv`, `verdicts217-apparie.csv` | Ajouter à la méthode de RS-32 deux règles. Une règle ne se juge que sur un échantillon neuf, jamais sur celui qui a servi à l'écrire. Deux versions ne se comparent que sur les mêmes fichiers, en jugeant à l'aveugle la place de l'ancienne version pour les seuls fichiers qui changent |
| RS-35 | majeur | produit+générique | Dans un dossier synchronisé par le client Dropbox pour Windows, chaque renommage d'un fichier déjà synchronisé prenait 3,0 s (3 031, 3 029 et 3 022 ms mesurés), contre 0 ms pour un fichier neuf et 0 ms Dropbox quitté. 2 526 déplacements ont pris 2 h 06, puis 21 237 ont pris 84 s Dropbox quitté. Aucun gabarit ni aucune règle ne prévoyait ce frein, découvert en cours d'application. Preuve : ledger seq 336 et 339, `vitesse_reel.py` | Inscrire au registre des garde-fous de plateforme : « une modification en masse d'un dossier synchronisé (Dropbox, Google Drive, OneDrive) se fait synchronisation suspendue, après une mesure de vitesse sur un fichier réel du dossier » |
| RS-36 | mineur | produit+générique | Deux étapes, absentes de la méthode remise le 14/10, ont amélioré la mesure sans coût humain. Un second étiquetage à l'aveugle (accord 91,3 %) a réduit de 65 à 19 les questions au métier. Des planches de vignettes numérotées ont permis de lire 996 images que l'OCR ne lisait pas, et de sortir 52 pièces sensibles de dossiers de photos. Preuve : ledger seq 318 et 319, étude qualité du classement 20261014r chapitre 8 | Compléter la méthode de RS-32 par ces deux étapes : double étiquetage avec référence d'accord, et lecture des images sans texte par planches |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Des noms de dossiers d'origine (« FACTURE CHARGES », « ASD », « ETE 2024 ») pris pour des locataires, des pièces du bien rangées chez le propriétaire, des biens mal découpés | passes 7 et 8 de `passes.py`, 90 tests dans `tests_passes.py` | non | Rien de généralisable dans les règles, qui décrivent le courrier d'un cabinet ; la méthode qui les a jugées est en RS-34 |
| Des échappements Python (`\b`, préfixe de chemin long) abîmés par les heredocs du shell, et une liste de propriétaires mal encodée lue vide, qui a fait appliquer tous les propriétaires | code écrit par fichier ; `appliquer.py` refuse désormais une liste vide | non | Erreurs de méthode de la session, corrigées au produit (ledger seq 332 et 336) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : l'analyse critique du 18/10 a été écrite hors famille, comme l'étude du 14/10 déjà signalée dans le lot 20261014a.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| Produit-12 - Analyse critique reorganisation Gestion locative - 20261018a | aucun gabarit (analyse hors famille) | la même famille « étude de qualité mesurée » que demandée le 14/10 | rien n'a encore été rapporté par le lecteur | tout le document, dont l'extrapolation à la population avec son intervalle | générique |

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Restitutions de la réorganisation (20261017a à 20261018e) | 7 | reste au produit, parce que ce sont des synthèses de tour au gabarit RESTITUTION, déjà outillé |
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Nouveau garde-fou, remonté en RS-35 :
- **plateforme** : client Dropbox pour Windows (dossier synchronisé) ;
- **mécanisme** : la synchronisation retient chaque renommage d'un fichier déjà synchronisé ;
- **effet** : process ralenti, 3,0 s par renommage (3 031, 3 029, 3 022 ms mesurés), sans refus ;
- **portée** : tout dossier synchronisé par le client, pour les fichiers déjà synchronisés ;
- **ce qu'il vise** : la cohérence de la synchronisation pendant les changements locaux ;
- **ce qu'il refuse** : rien, il retarde — 2 526 déplacements en 2 h 06 au lieu de quelques minutes ;
- **heurté le** : 18/10/2026, application de la norme 2.18 (ledger seq 336), levé en quittant le client (ledger seq 339) ; suspension décrite par https://help.dropbox.com/sync/pause-resume, lue le 18/10/2026.
