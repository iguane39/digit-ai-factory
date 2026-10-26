---
destinataire: humain
---

# Synthèse Mandat — réponses « 68a, 69a, 70a, 73b » : registre à jour, T1 engagée, relecture prolongée (26/10/2026)

## 0. Synthèse d'ouverture

Vos 4 réponses sont exécutées pour ce qui se fait aujourd'hui. Les 5 transformations sont au registre, décidées, dans l'ordre T1, T2, puis T3 avec T4, puis A5. T1 est engagée : vos préférences s'affichent désormais en tête de chaque ouverture de session, au pilot comme chez les produits. Les conventions du client y sont lues dès qu'un fichier existe, et la doctrine des produits porte le test de portée, le forçage d'une remontée et la barrière dès la 2e fois. La relecture d'intention reste en service après le 01/11, avec le seuil de 4 millions de jetons par jour. Une décision vous attend : écrire le fichier de conventions du client dans son projet commun.

## 1. En-tête d'identification

Point d'étape · exécution de vos réponses D-68 (a), D-69 (a), D-70 (a) et D-73 (b) · sur le pilot digit-ai-factory · le 26/10/2026 à 14:28 (heure de Paris, UTC+1) · Claude Opus 5.5, commit local dc2de806, sans publication.

Intention : faire entrer la cible retravaillée dans le fonctionnement, campagne par campagne, en commençant par ce qui vous évite de vous répéter. Test rétro : le tour sert l'intention, car vos préférences sont chargées partout dès la prochaine ouverture ; T2 à A5 attendent la mesure de T1, comme le prévoit votre réponse 68a.

## 2. Ce qui reste à mesurer, et par quoi

- L'effet de T1 sur les consignes répétées (35 par mois au départ) : mesuré par la première analyse du skill `oeil-critique`, mission 3, sur chaque poste.
- Les oublis de forges (8 produits sur 10 clos ou publiés sans leurs 4 livrables) : mesurés par la mission 5 du même skill, avant T4.

## 3. Décisions attendues

> **D-74 — Puis-je écrire le fichier CONVENTIONS-CLIENT.md du client dans son projet commun, seule écriture chez lui pour T1 ?**
>
> - **De quoi s'agit-il** : un fichier de 2 Ko au plus, à la racine du projet commun du client, qui porte ses conventions en une ligne datée chacune ; le relevé d'ouverture de ses produits le chargera.
> - **Le problème** : aucun mandat d'écriture n'est déclaré chez les produits ; sans ce fichier, le relevé de ses produits dit seulement qu'il manque, et les conventions déjà rappelées (inscription Entra, groupe de ressources `_TFSTATE`) restent dans votre mémoire.
> - **Pourquoi vous** : écrire chez un produit relève de votre décision.
> - **Recommandation : (a)** — le projet commun se tire déjà à chaque ouverture chez les produits du client, et le diagnostic demandait de le prolonger plutôt que de le copier. Source consultée : `~/.claude/skills/projet-commun-client-a/SKILL.md` et le diagnostic 20261026a, §d-T1.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Écrire le fichier dans le projet commun, avec les 2 conventions déjà rappelées, et l'enregistrer chez lui sans publication | Les produits du client le chargent à leur prochaine ouverture | simple × court | supprimer le fichier |
| **(b)** Le poser dans le dossier du client, hors de tout dépôt | Il se charge, mais n'est ni versionné ni présent sur l'autre poste | simple × court | supprimer le fichier |
| **(c)** Ne rien écrire | Le relevé signale l'absence à chaque ouverture chez le client | nul | sans objet |

> **Sans réponse** : (c), rien n'est écrit chez le client.

Rappel : D-71, publication du pilot après rebase, posée à 10:22, inchangée.

## 4. Traité

- Registre : TF-1946 (T1), TF-1947 (T2), TF-1948 (T3), TF-1949 (T4), TF-1950 (A5) créés et décidés par `todo/journaliser.mjs`, numérotés au-delà de TF-1945, le plus haut numéro de GitHub, pour ne pas ajouter de collision.
- D-73 (b) appliquée :
  - `references/RELECTURE-INTENTION.md` : relecture prolongée en service, seuil de 4 000 000 de jetons par jour, retrait du 21/10 remplacé ;
  - `scripts/relever-flotte.mjs` et `oracles/hook-ouverture.mjs` : le relevé dit « prolongé en service par D-73 (b) » ;
  - recettes : `relever-flotte.test.mjs` 16 PASS, `hook-ouverture.test.mjs` 40 PASS.
- T1 engagée :
  - `references/PREFERENCES-PORTEUR.md`, 1 147 octets, 8 préférences datées tirées de vos consignes ;
  - `oracles/hook-ouverture.mjs` : section « Préférences du porteur » en tête du relevé, pilot et produits, plafond de 2 Ko ; section « Conventions du client » chez un produit d'un dossier client, jouée depuis un produit du client, qui signale le fichier absent ;
  - `gabarits/CLAUDE-PRODUIT.md` : portée d'un retour par le test de généralité, forçage, barrière dès la 2e fois ;
  - `BOUCLE-AMELIORATION.md` : tri en 3 voies et accord de la barrière avec T2 ;
  - `oracle-claude-md` FAIL (règle N3, fichier de préférences orphelin) puis PASS après sa citation dans `references/INDEX.md` ; `relever-heritage.test.mjs` 46 PASS, `recopier-heritage.test.mjs` 20 PASS.
- Contrôle : l'essai du relevé chez un produit du client n'y a écrit aucun fichier (`find -newermt`, 0 fichier).
- Enregistrement : commit dc2de806 par `git commit --only`.
- Relecture d'intention : sert (RI-20261026-04), aucun écart.

## 5. Non traité

- Fichier de conventions du client : non écrit, parce qu'aucun mandat d'écriture n'est déclaré chez les produits ; posé en D-74.
- Barrière dès la 2e fois outillée en contrôle du registre : non faite dans ce tour, parce qu'elle demande une règle d'oracle et ses fixtures ; elle reste dans TF-1946.
- T2, T3 (hors D-73), T4 et A5 : non engagées, parce que votre réponse 68a les fait suivre la mesure de T1.
- Publication : non faite, elle attend D-71 ; le pilot a 17 commits d'avance et 17 de retard sur GitHub.

## 6. Écarts à la lettre

Aucun écart : vos réponses retenaient les options (a), (a), (a) et (b), et l'ordre des campagnes est celui de l'option (a) de D-68.

## 7. Risques

- Énoncé : les préférences s'affichent à l'ouverture, mais rien ne prouve encore qu'elles sont suivies. Signal : une consigne de la liste répétée par vous après le 26/10. Parade : la mission 3 du skill d'œil critique la compte, et la barrière dès la 2e fois s'applique.
- Énoncé : le relevé chez un produit nomme le chemin du dossier client. Signal : un lot de retours qui le recopierait. Parade : la pseudonymisation à l'accueil des lots, inchangée.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 suit D-74, A-2 suit D-71, A-3 précède l'ouverture de T2.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1946 | Écrire le fichier de conventions du client selon D-74 | auto_ia | gate_gouvernance | réponse « 74a » | les conventions du client restent hors du relevé |
| **A-2** | TF-1942 | Rebaser le pilot, renuméroter les collisions locales, publier | auto_ia | gate_gouvernance | `git pull --rebase origin main` puis `git push origin main` | l'autre poste ne reçoit ni les préférences ni la prolongation |
| **A-3** | TF-1946 | Outiller la barrière dès la 2e fois en contrôle du registre | auto_ia | — | `node todo/oracle-todo.mjs` après ajout de la règle et de ses fixtures | une récidive peut encore recevoir une règle reformulée |
| **A-4** | TF-1942 | Lancer la première analyse d'œil critique sur chaque poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | T2 ne peut pas s'ouvrir sur une mesure |

## 9. Traces

- `references/PREFERENCES-PORTEUR.md`.
- `oracles/hook-ouverture.mjs`, fonctions `lignesPreferences` et `dossierClient`.
- `gabarits/CLAUDE-PRODUIT.md`, paragraphe « Portée d'un retour » ; `BOUCLE-AMELIORATION.md`, section T1.
- `references/RELECTURE-INTENTION.md`, section « Dates, seuil, revue ».
- `todo/TODO.jsonl`, TF-1946 à TF-1950 ; `decisions/REGISTRE.jsonl`, D-74.
- Commits 70019fae et dc2de806.
