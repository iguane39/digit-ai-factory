---
destinataire: humain
---

# Synthèse Conseil — prompt du plan de mise à jour des compétences passé au crible L99 (21/11/2026)

## 0. Synthèse d'ouverture

Le prompt qui fera construire le plan de mise à jour des compétences est prêt. Il passe de 24 à 82 sur 100, une note mesurée par des relecteurs qui n'avaient pas vu l'analyse. Joué au pilot, il fera inventorier chaque compétence où qu'elle vive, relire en lecture seule chaque produit et les lots en attente, puis proposer un mécanisme contrôlé et des lots à décider. Il ne modifie rien chez les produits et ne publie rien. Une seule question vous revient : faut-il ajouter la veille des éditeurs aux retours des produits ?

Livré : [Revue du prompt de mise à jour des compétences](output/04-plans/Digit-AI%20-%20Revue%20-%20Prompt%20mise%20a%20jour%20competences%20pass%C3%A9%20au%20crible%20L99%20-%2020261121g.md)

## 1. En-tête d'identification

Revue L99 (analyse d'un prompt en 8 couches) en mode boucle, menée sur votre prompt « Construis le prompt qui va permettre de construire le plan de mise à jour… », le 21/11/2026 à 11:32, au pilot, par la session orchestratrice (Claude Opus 5.5). L'intention : obtenir un prompt générique pour les compétences sectorielles, fonctionnelles et techniques, qui rattrape la connaissance de chaque produit. Test rétro : le prompt nomme les trois types et ce qui les distingue, fait mesurer la population des produits avant d'en lire un seul, et porte un contrat de sortie vérifiable ; la relecture aveugle l'a confirmé sur ces trois points.

## 2. Verdict

Prompt d'origine : 24/100 (4 bloquants, 11 majeurs). Prompt retenu : 82/100 mesuré, moyenne de 2 relecteurs aveugles (82 et 82) à la passe 3 ; journal de boucle PASS à `oracle-boucle-l99.mjs`. Les 4 majeurs que la dernière relecture a trouvés sont amendés dans le texte livré, sans nouvelle mesure.

## 3. Décisions attendues

> **D-224 — Le plan de mise à jour des compétences doit-il aussi suivre la veille des notes de version des éditeurs, en plus des retours des produits ?**
> - **De quoi s'agit-il** : la source des nouveautés que le plan fera entrer dans les compétences. Votre demande vise les informations reçues des projets ; un éditeur (Cloudflare, Beds24) change pourtant sa plateforme avant qu'un produit le voie.
> - **Le problème** : sans veille, une compétence technique n'est révisée qu'après qu'un produit a buté sur le changement ; avec elle, le plan ajoute une source et un coût de relecture que vous n'avez pas demandés.
> - **Pourquoi vous** : c'est un contenu ajouté au livrable, hors de la lettre de la demande, et un arbitrage de périmètre.
> - **Recommandation : (b)** — les compétences techniques sont celles qui changent en semaines, et la Factory sait déjà dater une page d'éditeur ; les deux autres types évoluent par textes officiels ou pratiques, plus lentement. Source consultée : `digit-ai-forge-seo-geo/referentiel/cloudflare.json`, référentiel daté qui porte pour chaque réglage la page de l'éditeur, sa date affichée et sa citation.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ajouter la veille des notes de version des éditeurs pour les trois types | Le plan ajoute une quatrième source de signal à chaque type, avec sa fréquence de relecture | Une relecture web par compétence à chaque échéance, pour les 20 fiches d'experts et les référentiels | Retirer la ligne de source du plan |
| (b) Ajouter cette veille aux seules compétences techniques | Le plan l'ajoute pour Cloudflare, Beds24, Supabase et les autres plateformes, pas pour les métiers ni les pratiques | Une relecture web par plateforme à chaque échéance | Retirer la ligne de source du plan |
| (c) Ne pas ajouter la veille des éditeurs (défaut) | Le plan ne lit que les retours des produits, conformément à la lettre de votre demande | Aucun | Sans objet |

> **Sans réponse** : le prompt reste tel quel, sans veille des éditeurs (option c), et peut être joué ainsi.

Rappel des trois questions déjà posées au registre et toujours sans réponse, inchangées :
- D-221 : rouvrir l'exclusion « Pas de vidéo » des réseaux, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans vous les reposer les étapes d'un plan validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusion automatique des fichiers d'environnement d'un produit par le socle, posée le 16/11 à 15:06, inchangée.

## 4. Traité

- Analyse en 8 couches écrite ; `check_markdown.py` PASS sur la revue.
- 3 passes jugées par 6 relecteurs aveugles et 2 vérificateurs de clôture ; chaque défaut grave recompté par commande avant d'entrer dans une correction : 8 majeurs en passe 1, 5 en passe 2, 4 en passe 3, tous tenus au recompte.
- 4 corrections proposées par les agents étaient fausses au recompte et n'ont pas été reprises telles quelles (table des pseudonymes au canal et non à la racine, localisateur sans ligne de commande, et 2 autres au journal).
- Journal de boucle écrit à côté de la revue ; `oracle-boucle-l99.mjs` PASS.
- Conformité R-4 et R-25 rejouée : 0 constat sur la revue. Un indice partagé avec un livrable d'une autre session, déposé avant, a été levé en prenant l'indice « g » alloué par `allouer-indice.mjs --dossier output/04-plans`.
- Index d'`output/` régénéré par `readme-dossiers.mjs` (exit 0).
- D-224 réservée au registre par `reserver-decision.mjs` (PASS).

Relecture d'intention : sert — les trois exigences de la demande (générique sur les trois types, rattrapage de chaque produit, plan) sont chacune portée par une étape du prompt, vérifiée par la relecture aveugle.

## 5. Non traité

- Les 4 amendements post-borne n'ont pas été relus à l'aveugle. Motif : la borne de 3 passes est atteinte et l'extension exige un gain de 3 points que la moyenne n'a pas montré.
- Le prompt n'est pas exécuté. Motif : vous avez demandé le prompt, pas le plan.
- Rien n'est enregistré dans git. Motif : aucun enregistrement demandé ; la revue reste à enregistrer.

## 6. Écarts à la lettre

- Vous avez demandé « le prompt qui va permettre de construire le prompt du plan » → j'ai livré directement le prompt qui produit le plan → sous L99, les deux étages n'en font qu'un.
- Vous avez demandé « chaque produit » → le prompt couvre chaque produit mesuré à l'ÉTAPE 0, et ceux d'un autre poste figurent avec leur motif → ils ne se lisent pas d'ici.
- Vous n'avez pas parlé du sas → le prompt y lit aussi les lots arrivés non ingérés → c'est de la connaissance remontée que personne n'a traitée.

## 7. Risques

- Énoncé : un des 4 amendements crée un défaut. Signal : le contrat de sortie du plan échoue sur la population ou l'anonymisation. Parade : le prompt porte sa propre boucle de 3 itérations contre son contrat.

## 8. Prochaines actions

Trois actions restent, et seule la première vous revient. Le tableau se lit dans l'ordre des sélecteurs.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-224 par sa lettre (« 224b », par exemple) | neuve | manuelle_utilisateur | decision : arbitrage de périmètre, qui vous revient | `decisions/REGISTRE.jsonl`, entrée D-224 ; répondre dans cette session « 224a », « 224b » ou « 224c » | si rien n'est fait, le plan ne lira que les retours des produits |
| A-2 | Jouer le prompt livré dans une session ouverte au pilot | neuve | auto_ia | dependance_bloc_3 : attend la réponse à D-224, puis votre GO | section « Prompt réécrit » de la revue | si on ne le fait pas, les compétences restent sans circuit de mise à jour |
| A-3 | Enregistrer la revue et son journal dans git | neuve | auto_ia | gate_gouvernance : aucun enregistrement demandé dans ce tour | `git commit --only -- "output/04-plans/Digit-AI - Revue - Prompt mise a jour competences passé au crible L99 - 20261121g.md"*` | à défaut, la revue reste locale et l'ouverture suivante la signalera non enregistrée |

Ordre : A-1 d'abord, parce qu'elle fixe une ligne du prompt ; A-2 ensuite ; A-3 indépendante.

## 9. Traces

- `output/04-plans/Digit-AI - Revue - Prompt mise a jour competences passé au crible L99 - 20261121g.md`
- `output/04-plans/Digit-AI - Revue - Prompt mise a jour competences passé au crible L99 - 20261121g.md.boucle.json`
- `decisions/REGISTRE.jsonl` (D-224)
- `output/04-plans/Digit-AI - Synthese Conseil - Prompt mise a jour competences passe au crible L99 - 20261121h.md` (cette synthèse, déposée)
- passes, différences et jugements dans le dossier temporaire de la session, sous `l99/`
