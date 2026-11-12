## 0. Synthèse d'ouverture

La campagne A-1 a traité les 16 candidats du matin dans 4 dépôts : 13 sont corrigés, rejoués par moi et publiés. Le mode actif du balayage de sécurité ne lançait que la passe passive ; il lance désormais un vrai balayage, borné par le mandat. Deux sujets restent en cours, et un dernier attend le produit qui porte ses scripts. Le tri A-2 a décidé les 11 candidats de la campagne précédente. Une décision de doctrine vous revient : distribuer ou non aux produits un script qui fusionne leurs fichiers de secrets pour une sauvegarde sur un Drive.

## 1. En-tête d'identification

Synthèse du mandat « A1 et A2 », sur le pilot et 3 forges, le 12/11/2026 à 16:16, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de corriger les 16 candidats triés ce matin, sécurité d'abord, et de trier les 11 nés de la campagne précédente. Test rétro : chaque sujet finit clos sur une recette rejouée par le pilot, ou laissé ouvert avec ce qui manque, ou posé à l'humain avec son motif.

## 3. Décisions attendues

Les bloquants qui retiennent la suite :
- la distribution du script de fusion des fichiers de secrets, écrit pour un sujet du matin, qui attend votre réponse à la décision ci-dessous.

> **D-208 — Faut-il distribuer aux produits, par l'héritage, le script qui fusionne leurs fichiers .env pour une sauvegarde sur un Drive, alors que la règle de reprise multi-poste dit qu'un secret ne transite jamais par ce canal ?**
> - **De quoi s'agit-il** : un script écrit cet après-midi qui fait l'union des clés de 2 fichiers de secrets, sans jamais en perdre une ni afficher une valeur (`scripts/fusionner-env.mjs`). Un produit l'a demandé parce que sa sauvegarde sur un Drive écrasait des clés d'un poste à l'autre.
> - **Le problème** : la règle 4 de la reprise multi-poste dit qu'un secret ne transite jamais par le canal et qu'il se ressaisit sur chaque poste. Distribuer ce script aux produits outillerait le passage de secrets par un Drive, ce que la règle interdit pour la reprise.
> - **Pourquoi vous** : c'est la doctrine du pilot sur les secrets, et la réponse dit si une sauvegarde de secrets par le propriétaire fait exception à cette règle.
> - **Recommandation : (b)** — un secret stocké sur un Drive grand public élargit sa surface d'exposition, et la règle existante y répond déjà. Source consultée : `REGLES-PROJET.md`, règle 4 de la reprise multi-poste.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Distribuer, avec une exception écrite | le script rejoint l'héritage des produits, la règle dit que la sauvegarde de ses propres secrets par le propriétaire est permise | une exception à la règle, des secrets qui restent sur un Drive | retirer le script de l'héritage |
| (b) Ne pas distribuer | la règle vaut aussi pour la sauvegarde ; le produit retire ses fichiers de secrets de sa sauvegarde et les ressaisit par poste ; le script reste au pilot, inutilisé | une ressaisie par poste chez ce produit | distribuer plus tard |
| (c) Rien ne change | le script reste au pilot, le produit garde sa sauvegarde qui écrase des clés | des clés perdues à chaque resynchronisation | trancher plus tard |

> **Sans réponse** : le script reste au pilot, non distribué, et la sauvegarde du produit continue d'écraser des clés.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

Six agents ont travaillé chacun dans son arbre, et j'ai rejoué leur travail avant chaque publication.
- Le tri A-2 : 11 candidats décidés sous R-58, aucun ne touche à la dépense, à la publication ni à la doctrine. La consigne de la campagne a été relue « sert » par un vérificateur.
- forge-websec (TF-2444) : un mode actif autorisé envoyait 8 requêtes et 0 sonde active ; il en envoie 634 sur une cible locale. L'en-tête d'accès, le débit et les exclusions du mandat sont tenus. Recette rejouée à 228 PASS, 0 FAIL.
- Pilot, reprise multi-poste (TF-2441) : un dossier renommé ne revient plus commitable depuis le Drive ; recette rejouée à 11 PASS, 0 FAIL.
- forge-design (TF-2430, TF-2431, TF-2432) : un composant du socle servi n'est plus imputé à l'auteur, le verdict ne dépend plus du dossier de lancement, et un écran d'erreur voulu se juge enfin. Recette complète rejouée tout verte, 81 oracles.
- forge-agents (TF-2433) : l'écran de changement de mot de passe n'est plus pris pour une mire, avec 4 faux positifs sur 8 sondes ramenés à 0 ; 27 cas ciblés verts et quality-oracles à 751 contrôles.
- Pilot, contrat d'agent (TF-2434 à TF-2437) : la cadence, le journal de campagne, la vérification par nature de commit et le dossier propre de chaque agent sont écrits au contrat.
- Pilot, isolation des agents (TF-2443) : le refus vient du harnais, qui compare les chemins à la casse près. Un hook avertit maintenant avant le refus ; 32 PASS, 0 FAIL.
- Pilot, hooks (TF-2445, TF-2442) : le préjugement accepte une réponse courte comme le hook de fin de tour, et l'ouverture signale un workflow hébergé en échec 2 fois de suite. Sur la fusion, le hook de fin de tour passe à 77/77 et oracle-synthese à 364/364.
- Les restes des agents deviennent 8 candidats, de TF-2458 à TF-2465.

Relecture d'intention : sert.

## 5. Non traité

- TF-2440, la distribution du script de fusion des fichiers de secrets — motif : dependance_bloc_3, elle attend votre réponse à la décision du bloc 3.
- TF-2438, une recette qui consomme un budget sans le recréer — motif : borne_atteinte, la règle et son oracle existent au pilot, rien ne les appelle encore côté forge-tests.
- TF-2439, les scripts de sauvegarde à chemin écrit en dur — motif : hors_mandat, ils vivent dans le dépôt du produit, où le pilot n'écrit pas sans run demandé.

## 8. Prochaines actions

Trois actions suivent, dont une seule vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à la décision sur le script de fusion des fichiers de secrets | D-208 | manuelle_utilisateur | decision | options au bloc 3 de `output/04-plans/Digit-AI - Synthese Mandat - Campagne A1 et tri A2 du 12-11 - 20261112c.md` ; répondre « 208a », « 208b » ou « 208c » | si rien n'est fait, la sauvegarde du produit continue d'écraser des clés |
| A-2 | Lancer la campagne qui corrige les 11 candidats triés en A-2, en commençant par le hameçon d'anonymisation du pilot | TF-2457 | auto_ia | hors_mandat : la demande portait sur leur tri | `todo/TODO.jsonl`, décisions du 12/11 ; agents de campagne en arbres de travail | si rien n'est fait, un commit peut encore emporter les lignes non enregistrées d'une autre session |
| A-3 | Trier les 8 candidats nés de cette campagne | TF-2458 | auto_ia | hors_mandat : nés pendant ce tour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, les rouges de digit-ai-schemas restent au self-test |

Ordre : la décision d'abord, parce qu'elle seule vous revient ; puis la campagne, qui ferme un défaut d'enregistrement ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- Forges publiées et vérifiées par `git rev-list --count origin/main..main` à 0 : forge-websec ebada36, forge-design 9928d02, forge-agents 2b0a21c puis c585ebe pour le manifeste.
- Pilot : la fusion des 3 lots, 4edeb91f, publiée ; le commit de ce tour part avec cette synthèse.
- `todo/TODO.jsonl` : 11 décisions de tri, 13 clôtures, 2 sujets en cours, 1 attente du produit et 8 candidats ; oracle du registre PASS après chaque écriture.
- `decisions/REGISTRE.jsonl` : D-208 réservée ; `todo/relectures-intention.jsonl` : la relecture RI-20261112-08.
