---
destinataire: humain
---

# Synthèse Mandat — campagne du 12/10 sur 86 sujets du registre : 50 clos, 35 en cours avec leur reste, publication et 2 arbitrages en attente de votre décision (12/10/2026)

## 0. Synthèse d'ouverture

La campagne est finie. Sur les 86 sujets traités, 50 sont clos avec leur preuve, 35 restent en cours avec le geste précis qui manque, et 1 est écarté selon une décision déjà prise. Le travail est fusionné sur ce poste et vérifié par les recettes, mais il n'est pas publié : la publication vous revient. Deux arbitrages vous reviennent aussi, sur une règle nouvelle concernant les sources des contenus et sur la charte de la marque. Un garde-fou nouveau bloque désormais toute publication hébergée sans votre feu vert.

## 1. En-tête d'identification

- **quoi** — votre demande « Traite tous les sujets en cours et tous les sujets à décider supérieur ou égal à 10 », périmètre « Les deux », mode « Campagne d'agents ».
- **sur quoi** — pilot `digit-ai-factory` (de `e11ffcff` à `52a717c1`, 43 commits non publiés), `digit-ai-forge-agents` (de `074ad42` à `7e0b01e`, 15 commits non publiés), `digit-ai-forge-audit` (aucun commit), boîte d'entrée de Produit-02.
- **quand** — 2026-10-12, de 11:36 à 14:10 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; 10 agents de campagne, 4 sur Opus et 6 sur Sonnet, chacun dans un espace isolé ; escalade : aucune.
- **intention** — faire baisser le stock de sujets ouverts du registre, en commençant par ceux qui pèsent le plus. **Test rétro** : servie. Les sujets ouverts passent de 194 à 144 au registre, et chacun des 35 sujets restants porte le geste exact qui le fermera.

## 2. Verdict en une ligne

**86 sujets traités : 50 corrigés, 35 en cours avec leur reste, 1 écarté ; registre PASS ; harnais du pilot 192 oracles verts sur 195, puis 2 des 3 rouges corrigés et rejoués un à un, le dernier attendant la propagation des skills.**

## 3. Décisions attendues de l'humain

Les 3 bloquants qui retiennent la suite, ce qui les lève, et ce qui se passe sinon :

- la publication des 2 dépôts : votre décision D-61 ; sans elle, l'autre poste ne voit rien de la campagne et peut frapper les mêmes numéros au registre.
- la règle nouvelle sur les sources des contenus : votre décision D-62 ; sans elle, elle reste écrite dans la doctrine du pilot sans avoir été validée.
- la charte de la marque Digit-AI : votre décision D-63 ; sans elle, 2 chartes contradictoires restent en service.

> **D-61 — Publiez-vous les 43 commits du pilot `digit-ai-factory` et les 15 commits de `digit-ai-forge-agents` ?**
>
> Rappel du sujet : les 2 dépôts portent le travail de la campagne, fusionné et vérifié sur ce poste. La porte des noms durcie de forge-agents refuse le pilot tant que 19 occurrences de noms ne sont pas nettoyées. Elle n'agit qu'une fois les skills installés propagés, ce qui peut attendre le nettoyage.
>
> **Recommandation : (a).** Source consultée : le refus de publication de ce matin, qui exige `FORGE_PUSH_GO`, et la mesure de la porte par l'agent forge-agents (pilot PASS avant, FAIL après). Le pre-push du pilot lit la copie installée de la porte, encore l'ancienne : la publication passe.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier les 2 dépôts maintenant, sans propager les skills installés avant le nettoyage des 19 occurrences | complexité faible · durée courte | la porte durcie n'agit pas avant le nettoyage |
| (b) publier le pilot seul | complexité faible · durée courte | les 15 corrections de forge-agents restent sur ce poste |
| (c) ne rien publier | aucun | l'autre poste travaille sur un registre périmé |

> **Si rien n'est décidé** : (c) — les commits restent sur ce poste.

> **D-62 — Gardez-vous la règle nouvelle de `REGLES-PROJET.md` sur les sources des contenus remis au client final et sur les citations de pages tierces ?**
>
> Rappel du sujet : un agent l'a écrite pour 2 retours d'un produit. Une déduction avait été publiée comme un fait constaté, sur l'accessibilité d'un gîte. Une citation « mot pour mot » d'une page d'aide venait d'un outil de lecture résumée qui avait changé un mot. Une règle opposable neuve relève de votre décision.
>
> **Recommandation : (a).** Source consultée : `oracles/oracle-source-contenu.mjs` (recette 12/12, cas fondateur rouge) et la mesure de la règle de citation sur 327 documents du pilot, 8 accusés, tous de vraies citations non vérifiées.

| Option | Coût | Exclusions |
|---|---|---|
| (a) garder la règle entière, ses 2 contrôles restant avertissants jusqu'à une revue de bruit | aucun | aucune |
| (b) garder le seul point sur les citations | complexité faible · durée courte | une déduction peut encore être servie au client comme un fait |
| (c) retirer la règle | complexité faible · durée courte | les 2 cas fondateurs peuvent se reproduire sans signal |

> **Si rien n'est décidé** : (a) reste en place, puisque la règle est déjà écrite et ses contrôles avertissants.

> **D-63 — Quelle charte de marque Digit-AI retenez-vous pour le dossier de marque et le corpus de `digit-ai-forge-design` ?**
>
> Rappel du sujet : le socle des pages et les présentations emploient Montserrat et Inter. Le dossier de marque du produit et le corpus de forge-design déclarent encore Roboto et DM Sans pour les pages. Votre décision du 22/09 disait que la charte des présentations fait foi, et la source de la marque ne l'a pas suivie.
>
> **Recommandation : (a).** Source consultée : le relevé de l'agent forge-agents sur les 4 sources de la charte, et votre décision du 22/09 citée dans le registre.

| Option | Coût | Exclusions |
|---|---|---|
| (a) charte unique Montserrat et Inter sur tous les supports | complexité moyenne · durée moyenne | demande une session ouverte chez le produit de la marque |
| (b) Montserrat et Inter, avec Roboto et DM Sans en repli déclaré | complexité faible · durée courte | la divergence reste visible là où le repli s'affiche |
| (c) revenir à une charte par support | complexité moyenne · durée moyenne | contredit votre décision du 22/09 |

> **Si rien n'est décidé** : (b), l'état actuel du socle.

## 4. Traité — avec sa preuve

Les 10 groupes ont rendu leur rapport, et le pilot a fusionné et vérifié chaque branche.

- **Juge de restitution** : 7 sujets traités par fixture rouge → vert. Une étape de guide se clôt par « Résultat attendu : … ». S5 accepte la sous-puce prescrite. Un `cp` vers le dossier temporaire n'est plus un effet. 2 règles neuves avertissantes : un geste humain ne renvoie pas à un autre message, et le texte écrit au nom du commanditaire figure en entier dans la restitution.
  - preuve : `oracle-synthese.mjs --self-test` 137/137 après fusion ; rejoué sur 237 synthèses, aucun verdict changé.
- **Demandes aux équipes tierces** : 6 sujets traités par contrôle rouge → vert, avec un gabarit à 4 parties, son juge et un contrôle des écarts présentés comme normaux.
  - preuve : `oracle-demande-tierce.test.mjs` 29/29, `oracle-ecart-normal.test.mjs` 10/10, bruit 1 phrase sur 843 fichiers.
- **Chaînes de déploiement et Entra** : 5 sujets traités par contrôle rouge → vert : formulaire Entra, réplication d'annuaire, leçon authV2, étape remise sans exécution.
  - preuve : `verifier-etape-chaine.test.mjs` 21/21, `verifier-formulaire-entra.test.mjs` 12/12, `oracle-trace-mutation-mep` 28/28.
- **Noms et accueil** : 4 sujets traités par contrôle rouge → vert (âge des fichiers non enregistrés, point médian et accents, README sous `input\`, pull bloqué), 2 déjà faits.
  - preuve : `bootstrap.test.mjs` 25/25 après fusion, `readme-dossiers.test.mjs` 24/24.
- **Corpus et oracles** : 3 sujets traités par contrôle rouge → vert (voie automatique d'abord, périmètre d'un verdict, profil d'authentification commis), 2 déjà faits.
  - preuve : `oracles/self-test.mjs` 135/135 ; accusation des 2 règles neuves 2,1 % du corpus chacune.
- **Références** : 5 sujets traités par fixture rouge → vert (Google Ads, source d'aide en langue étrangère, sources des contenus, citations).
  - preuve : `oracle-source-contenu.test.mjs` 12/12, `oracle-integrations` 9/9.
- **Socle des pages** : 6 sujets traités par fixture rouge → vert (calque, logo, recherche à travers le gras, infobulle qui recopie la page), 3 déjà faits.
  - preuve : self-test du socle 513/514, le seul rouge préexistant ; bruit de la règle des infobulles mesuré sur 1 979 pages, d'où son entrée en avertissement.
- **Forge-agents** : 5 sujets traités par fixture rouge → vert (registre des oracles, pre-push lisible, propriétés d'un PPTX vidées, squelette d'oracle, ledger).
  - preuve : `quality-oracles` 428 PASS, self-test forge-agents 66/0, banc des hameçons 55/0 (10 rouges au départ).
- **Publication** : un hameçon nouveau bloque toute publication hébergée sans feu vert humain, et la CI du pilot est réparée de ses 4 causes de rouge.
  - preuve : `hook-publication-hebergee.test.mjs` 10/10 ; simulation du circuit hébergé ROUGE 5 défauts → VERT.
- **Fusion et registre** : 2 conflits résolus en gardant les 2 côtés, 3 règles renumérotées S61 à S63 ; 1 recette non isolée corrigée ; 2 sceaux de synthèse reposés après rejugement.
  - preuve : `bancs-isoles.test.mjs` 6/7 → 7/7 ; `verifier-jugement.mjs output` FAIL → PASS ; `journaliser.mjs` 70 puis 15 événements, verdict PASS avant et PASS après.

## 5. Non traité — avec son motif

- La publication des 2 dépôts — motif : `decision`, D-61.
- La propagation des skills installés — motif : `decision`, elle attend le nettoyage des 19 occurrences de noms, sans quoi la porte durcie bloque le pilot.
- 35 sujets en cours, chacun avec son geste noté au registre — motif : `dependance_externe`, gestes chez un produit, sur l'autre poste ou soumis à un feu vert humain.
- Les lots de travaux de Produit-01, Produit-03, Produit-12 et Produit-77 — motif : `dependance_externe`, leurs dépôts ne sont pas sur ce poste.
- 2 rouges préexistants hors campagne : un cas du socle des pages et l'écart des skills installés — motif : `hors_mandat`, présents avant le départ.

## 6. Écarts à la lettre

- **Vous avez demandé** de traiter tous ces sujets → **35 restent en cours** → **pourquoi** : leur dernier geste est chez un produit, sur l'autre poste, ou soumis à votre feu vert ; chacun est écrit au registre.
- **Des agents ont livré des règles avertissantes là où le sujet demandait un contrôle** → **pourquoi** : toute règle neuve entre avertissante jusqu'à une mesure de bruit nulle.
- **J'ai scindé TF-1536 en 2 sujets** → **pourquoi** : un sujet ne désigne qu'un produit destinataire, et 2 produits étaient visés.

## 7. Risques

- L'autre poste peut ingérer des lots et prendre les mêmes numéros au registre tant que rien n'est publié.
  - signal : un refus de publication pour divergence au prochain `git fetch` ;
  - parade : publier vite (D-61), sinon renuméroter la version locale au rebase.
- Une propagation des skills avant le nettoyage des noms bloque toute publication du pilot.
  - signal : « PUBLICATION REFUSEE — verdict FAIL de oracle-nom-client-publie » ;
  - parade : nettoyer les 19 occurrences avant `node oracles/oracle-skills.mjs --appliquer`.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 2 dépôts avec `FORGE_PUSH_GO` citant votre réponse | `auto_ia` | `neuve` | `dependance_bloc_3` — D-61 | la campagne reste sur ce poste |
| **A-2** | Appliquer vos choix sur la règle des sources et sur la charte | `auto_ia` | TF-1023 | `dependance_bloc_3` — D-62 et D-63 | 2 chartes restent en service |
| **A-3** | Nettoyer les 19 occurrences de noms, puis propager les skills installés | `auto_ia` | TF-1456 | `hors_mandat` — geste de publication à suivre | la porte durcie reste inactive |
| **A-4** | Déposer les lots de travaux des 4 produits absents depuis l'autre poste | `auto_ia` | TF-1631 | `dependance_externe` — poste des produits | ces produits ignorent leurs travaux |
| **A-5** | Tenir la revue hebdomadaire des 56 candidats restants | `auto_ia` | `neuve` | `hors_mandat` — revue en retard depuis le 01/10 | les candidats s'accumulent |
| **A-6** | Répondre à D-61, D-62 et D-63 | `manuelle_utilisateur` | `neuve` | `decision` | les 3 bloquants restent en place |

Traces : `todo/TODO.jsonl`, `oracles/oracle-synthese.mjs`, `C:\tmp\c12\CONSIGNE-COMMUNE.md`.
