---
destinataire: humain
---

# Synthèse Conseil — prompt « aide aux nouveaux utilisateurs de la Factory » passé au crible L99 (analyse de prompt en 8 couches), 21/11/2026

## 0. Synthèse d'ouverture

Votre demande vise juste mais part d'un angle mort : l'accueil existe déjà (phrase d'usage, installateur, skill d'accueil, protocole en 7 étapes). Ce qui manque, c'est l'aide des premières sessions, là où les contrôles de la Factory surprennent un habitué de Claude Code : 85 refus au premier passage du 19 au 26/10/2026, relevés au référentiel des niveaux de réponse. Le prompt réécrit lance un run de conseil qui part de cet existant, mesure les frictions, traduit vos six qualités en critères vérifiables, compare trois options et isole un premier lot constructible en un run. Votre demande est notée 30 sur 100, la réécriture 82, projeté et non mesuré. Pour l'exécuter, dites « exécute le prompt » ; pour mesurer le score par relecteurs aveugles, dites « L99 boucle ».

Livré : [Revue L99 du prompt](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20aide%20aux%20nouveaux%20utilisateurs%20passe%20au%20crible%20L99%20-%2020261121c.md)

## 1. En-tête d'identification

Analyse L99 en mode simple (skill `prompt-analyzer-l99`, 8 couches, sans relecteur aveugle) de la demande « Comment pourrait-on mettre en place une aide pour les nouveaux utilisateurs de la Factory… adapté à leurs contextes et leurs projets ». Sur le pilot `digit-ai-factory` (commit 626b12e2). Le 21/11/2026, de 10:57 à 11:00, heure de Paris (UTC+01:00), heures relevées par `date`. Session pilote Claude Opus 5.5, aucun sous-agent.

Intention de la demande : que les nouveaux utilisateurs deviennent productifs avec la Factory sur leurs propres projets, vite et sans passer par vous.

Test rétro : le prompt réécrit sert cette intention ; il vise le maillon manquant (les premières sessions) au lieu de réinventer l'accueil, et il s'arrête à la proposition, comme le verbe « propose » le demande.

## 2. Verdict en une ligne

Demande notée 30 sur 100, aucun défaut bloquant, 6 majeurs ; prompt réécrit à 82 projeté, non mesuré.

## 3. Décisions attendues

Aucune décision nouvelle : les cinq écarts à la lettre du bloc 6 relèvent de la manière d'exécuter et se valident avec le prompt.

- D-221 : rouvrir l'exclusion « Pas de vidéo » du run d'animation de réseau pour les clips jugés, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.

## 4. Traité

- Lu en lecture seule l'existant d'accueil : `README.md`, `references/ACCUEIL.md`, `references/NIVEAUX.md`, `references/RUN-CONSEIL.md`, `profils/` (8 profils), `catalogues/catalogue.jsonl` (112 lignes).
- Produit la revue en 8 chapitres : étalon noté 30 sur 100, inventaire de 11 défauts (0 bloquant, 6 majeurs, 5 mineurs), premortem de 5 causes, wargame en 3 rôles, prompt réécrit, contrat de sortie, protocole de tests, changelog.
- La prémisse implicite « aucune aide n'existe » est jugée partiellement fausse contre le dépôt, et l'étape 0 du prompt réécrit impose l'inventaire de l'existant.
- Contrôle de lisibilité de la revue : M10 rouge à la première écriture (classe : tableau de plus de 12 lignes sans phrase qui dit comment le lire, ici le changelog), vert après ajout de ce mode de lecture, le hook d'écriture n'ayant plus rien refusé.
- Relecture d'intention : sans objet, aucun agent lancé ; le test rétro du bloc 1 est celui de la session sur son propre livrable.

## 5. Non traité

- Le score de la réécriture n'est pas mesuré : le mode boucle n'a pas été ouvert, car le prompt réécrit n'écrit qu'un document, ne sera pas réutilisé comme gabarit, et aucun défaut bloquant n'a été relevé.
- Le prompt réécrit n'est pas exécuté : vous avez demandé de l'améliorer, pas de le lancer.

## 6. Écarts à la lettre

Les cinq écarts sont détaillés à la fin de la revue : proposition seule sans construction, six critères chiffrés dont « 5 paliers au plus », une population par défaut déclarée, deux indicateurs de productivité, une adaptation détectée avec une question au plus. La borne de 5 paliers et le choix des deux indicateurs sont des choix de l'analyse : corrigez-les si besoin avant l'exécution.

## 7. Risques

- Le poste n'est pas prêt (contrôle de fraîcheur, code 1) : 5 modifications locales non enregistrées, la plus ancienne de 5 jours. Un run lancé dessus partirait d'un état non daté.
- La boîte d'entrée est bloquante : 2 lots attendent depuis plus de 24 h et 43 lots sont au sas d'arrivée, le plus ancien depuis 163 h. Je ne les ai pas traités : ce n'était pas dans votre demande.

## 8. Prochaines actions

Ordre : d'abord ce qui conditionne l'exécution du prompt, parce que c'est l'objet de votre demande.

1. Vous (humain) : valider ou corriger les écarts du bloc 6, puis dire « exécute le prompt » pour lancer le run de conseil, ou « L99 boucle » pour faire d'abord mesurer le score par des relecteurs aveugles.
2. Moi (IA), sur votre accord : accueillir et ingérer les lots en attente (`node todo/accueillir-lot.mjs`, puis `node todo/ingerer-lot.mjs` sur la fiche d'accompagnement de chaque lot), puis enregistrer les modifications locales, avant tout run.
3. Vous (humain) : répondre à D-221, D-222 et D-223 en écrivant la lettre collée au numéro.

## 9. Traces

- Revue : `output/03-etudes/Digit-AI - Revue - Prompt aide aux nouveaux utilisateurs passe au crible L99 - 20261121c.md` (réindexée de « a » à « c » le 21/11 : une session concurrente avait pris « a » 72 s plus tôt).
- Cette synthèse : `output/04-plans/Digit-AI - Synthese Conseil - Prompt aide aux nouveaux venus passe au crible L99 - 20261121a.md`.
- Rien n'est enregistré dans git ni poussé.
