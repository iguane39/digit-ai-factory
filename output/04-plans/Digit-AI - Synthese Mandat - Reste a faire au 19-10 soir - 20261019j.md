---
destinataire: humain
---

# Synthèse Mandat — ce qui reste à faire au pilot, le 19/10/2026 au soir

## 0. Synthèse d'ouverture

Le plus urgent est l'arrivée : 7 lots de retours de 2 produits attendent au sas, le plus ancien depuis 34 h, et le relevé d'ouverture le classe bloquant. Vient ensuite la publication d'un seul commit local, la correction du script de relecture (D-39 (a)), qui relève du feu vert permanent de publication du pilot. Au registre, 58 sujets restent ouverts : 8 candidats attendent votre décision, 4 décidés attendent leur construction et 46 sont en cours, dont 14 ne citent plus que la publication, désormais faite, comme reste à faire. Enfin, le poste est déclaré non prêt : 68 modifications locales du pilot ne sont pas enregistrées, la plus ancienne depuis 17 jours.

## 1. En-tête d'identification

Relevé du reste à faire du pilot `digit-ai-factory` : sas des retours, registre TODO-FORGE, registre des décisions, état des dépôts, relevé d'ouverture. Période : 19/10/2026 de 21:10 à 21:20, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle : aucune.

Intention de la demande : savoir ce qui reste à engager, et dans quel ordre, après la journée du 19/10.

Test rétro : le résultat sert cette intention ; le relevé est fait en lecture seule, et aucun geste n'a été engagé à la place d'une demande qui n'en commandait pas.

## 2. Verdict en une ligne

7 lots au sas, 1 commit à publier, 58 sujets ouverts au registre (8 candidats, 4 décidés, 46 en cours), 68 modifications locales non enregistrées au pilot.

Mesuré sur : `todo/TODO.jsonl` replié par identifiant, relue à 21:16, périmètre 1 118 sujets ; `input/00-retours/_arrivee/` relu à 21:12, 7 lots.

## 3. Décisions attendues

Aucune décision nouvelle n'est posée dans ce tour. Les sujets qui vous reviennent sont rangés au bloc 8 avec l'acteur manuelle_utilisateur : les 8 candidats à trancher au registre et les gestes humains déjà décidés. Les gestes automatiques A-1 à A-5 n'ont pas été engagés, la question demandant un relevé ; ils partent sur votre feu vert, par exemple « applique A-1 à A-5 ».

## 4. Traité

- Registre replié par identifiant (`todo/TODO.jsonl`, 4 995 événements) : 1 118 sujets, 1 048 corrigés, 11 écartés, 8 candidats, 4 décidés, 46 en cours, 1 sans statut.
- Candidats : TF-1892 et TF-1893 (héritage chez un produit : ledger.py refusé par ruff, réglage de sécurité écrasé), TF-1894 (forge-seo-geo, chiffres périmés dans 4 textes), TF-1895 (forge-agents, règles de petit écran refusées par l'oracle A4), TF-1896 à TF-1899 (pilot : recette complète rouge sur 3 recettes, hook-page-html absent du réglage du pilot, avancement par SendMessage prescrit à des agents qui ne l'ont pas, garde-fou Entra absent du registre des garde-fous).
- Décidés en attente de construction : TF-1031 (registre des issues d'appels d'offres), TF-1090 (secrets publiés chez des produits, rotation humaine), TF-1159 et TF-1160 (palier V2 d'un produit de publication).
- En cours : 15 attendent un produit (lots à remettre, gestes de reprise, dates de budget, ledger.py) ; 14 citent « accord de publication » comme reste à faire, alors que le pilot a été publié à eaebf3a2 ; les autres sont des chantiers ouverts du pilot (TF-0674, TF-0682, TF-1323, TF-1372, TF-1392, TF-1592, TF-1843, TF-1856, TF-1865, TF-1873).
- Dépôts : le pilot porte 1 commit en avance (1a5d4bb3, D-39 (a)) et 0 en retard ; les 13 forges relevées sont à 0 en avance et 0 en retard.
- Décisions : le registre porte D-24 à D-40 ; la remise b9058f2d visée par D-40 n'est plus dans la pile (`git stash list` rend 3 remises, aucune du 19/10).
- Revues datées : aucune due, prochaine TF-1831 le 16/11 (`node todo/revues-datees.mjs`).
- Relecture d'intention : sans objet, relevé en lecture seule dont le seul écrit est cette synthèse.

## 5. Non traité

- L'accueil et l'ingestion des 7 lots du sas — motif : hors_mandat, la question demandait un relevé ; repris en A-1.
- La publication du commit 1a5d4bb3 — motif : hors_mandat, même raison ; reprise en A-2.
- L'enregistrement des 68 modifications locales — motif : hors_mandat, elles appartiennent à plusieurs sessions antérieures ; reprise en A-4.
- La vérification que D-41 existe ailleurs — motif : hors_mandat, le commit 8a542749 cite D-42 (a) alors que le registre local s'arrête à D-40 ; signalé au bloc 7.

## 6. Écarts à la lettre

Aucun écart : la question demandait ce qui reste, et la réponse est un relevé sans geste.

## 7. Risques

- Lots au sas au-delà de 24 h.
  - Énoncé : les produits croient leurs retours remontés, et personne ne les traite.
  - Signal : le relevé d'ouverture les marque bloquants à chaque session.
  - Parade : A-1.
- Numéros de décision divergents entre postes.
  - Énoncé : le commit 8a542749, venu de l'autre poste, cite D-42 (a), absent du registre local qui s'arrête à D-40.
  - Signal : une réponse « D-41 » ou « D-42 » qui ne désigne pas la même question des deux côtés.
  - Parade : réserver tout numéro neuf par `node scripts/reserver-decision.mjs` après un tirage.
- Indice de synthèse partagé.
  - Énoncé : l'indice 20261015g est porté par 2 synthèses de radical distinct.
  - Signal : le relevé d'ouverture le signale en défaut.
  - Parade : A-5.

## 8. Prochaines actions

Ordre : le sas d'abord, parce qu'il dépasse 24 h ; la publication ensuite, parce qu'elle tient en un geste ; puis le rangement du poste et vos décisions.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | aucun | Accueillir puis ingérer les 7 lots du sas | auto_ia | hors_mandat : la question demandait un relevé | `node todo/accueillir-lot.mjs` | Les retours de 2 produits restent sans traitement |
| **A-2** | aucun | Publier le commit 1a5d4bb3 du pilot, porte de publication jouée | auto_ia | hors_mandat : la question demandait un relevé | `git push origin main` | L'autre poste ne voit pas la correction D-39 |
| **A-3** | TF-1829 | Constater la clôture des 14 sujets en cours qui n'attendaient que la publication | auto_ia | hors_mandat : la question demandait un relevé | `node todo/journaliser.mjs` | 14 sujets restent comptés ouverts à tort |
| **A-4** | aucun | Enregistrer ou mettre de côté les 68 modifications locales du pilot | auto_ia | hors_mandat : elles viennent de sessions antérieures | `git status --short` | Le poste reste déclaré non prêt à chaque ouverture |
| **A-5** | aucun | Réindexer la plus récente des 2 synthèses d'indice 20261015g | auto_ia | hors_mandat : la question demandait un relevé | `node scripts/allouer-indice.mjs --dossier output/04-plans --prefixe "Digit-AI - Synthese Mandat - " --jour 20261015` | Le défaut d'indice reste affiché |
| **A-6** | TF-1892 | Trancher les 8 candidats du registre, de TF-1892 à TF-1899 | manuelle_utilisateur | decision : tout candidat attend une décision humaine | `node todo/revue-hebdo.mjs` | Les 8 constats restent sans suite |
| **A-7** | TF-1090 | Faire la rotation des identifiants publiés dans 9 dépôts | manuelle_utilisateur | decision : geste humain déjà décidé, dans la console de chaque fournisseur | `node oracles/oracle-secrets-hors-perimetre.mjs` | Les identifiants publiés restent utilisables |
| **A-8** | TF-1584 | Lire puis supprimer le fichier `C:\dev\null` de 13 530 octets | manuelle_utilisateur | decision : suppression, geste humain (R-29) | `notepad C:\dev\null` | Une réponse authentifiée pourrait y garder un jeton |

## 9. Traces

- `todo/TODO.jsonl` replié par identifiant à 21:16
- `decisions/REGISTRE.jsonl`, 33 lignes, D-24 à D-40
- `input/00-retours/_arrivee/`, 7 lots et leurs sidecars
- `git rev-list --left-right --count main...origin/main` : `1 0` au pilot, `0 0` aux 13 forges
- `node todo/revues-datees.mjs` : aucune revue due, prochaine le 16/11
