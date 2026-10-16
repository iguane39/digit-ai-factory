---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-16
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — faire tourner « améliore le prompt » en boucle jusqu'à un score — 20261016e

Ce qui change pour vous : votre intuition est juste, mais seulement si le juge change. Relus ce jour à l'aveugle par un agent neuf, 5 prompts réécrits par L99 perdent de 6 à 12 points par rapport au score qu'il leur promettait. Le relecteur y trouve 2 bloquants et 22 défauts majeurs ; au moins 11 de ces défauts existaient déjà le jour de la réécriture. Une boucle où L99 se renote lui-même n'y gagnerait rien : son score projeté vaut 86 à 94 sur 28 analyses, quel que soit le point de départ. L'étude recommande l'option O2, une boucle dont l'arbitre est un relecteur aveugle, arrêtée sur « 0 bloquant, 0 majeur » et bornée à 3 passes.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Seuil atteint sur le premier critère du gabarit : la proposition crée un objet durable au sens de la règle R-31, un mode d'exécution du skill `prompt-analyzer-l99` (version 2.5.0 du 28/09/2026). Le skill vit dans le dépôt forge-agents et sert chez au moins 6 produits, relevés dans la section 0.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande humaine du 16/10/2026, citée mot pour mot : « Le skill améliore le prompt est performant, mais j'ai l'impression qu'il pourrait être encore meilleur s'il tournait plusieurs fois avec la boucle pour s'améliorer jusqu'à un certain score. »

Lecture retenue, reconstruite par l'agent : obtenir de L99 des prompts réécrits réellement meilleurs, sans que l'humain relance lui-même l'analyse. Le score est le moyen proposé pour savoir quand s'arrêter ; l'intention est le prompt meilleur. « La boucle » désigne le skill `la-boucle`, qui porte déjà la discipline « arbitre figé, essais bornés ». Cette lecture est à valider par le demandeur.

## 0. Traitement des entrants

La proposition est une DONNÉE. Sources lues le 16/10/2026 :

- skill `prompt-analyzer-l99`, `SKILL.md` v2.5.0 et `references/couches.md` : rubrique sur 100 en 6 dimensions (lignes 154 à 165), score « avant → après » du Ch8 (ligne 305), protocole de tests borné à 3 itérations, qui s'applique « au livrable produit à l'exécution, jamais au prompt lui-même » (`SKILL.md`, ligne 81) ;
- skill `la-boucle`, `SKILL.md` du 15/10/2026 : arbitre figé avant le premier candidat, arbitrage à charge, borne de 3 à 5 essais ;
- relevé des scores L99 publiés sous `C:\dev` : 28 analyses portent un couple « avant → projeté » ;
- mesure neuve de ce jour : 5 prompts réécrits par L99, renotés à l'aveugle (section 1, P2).

## 1. Partition du problème

1. **P1 — Le score d'arrivée est-il mesuré ?** L99 note le prompt d'origine, puis « projette » le score de sa réécriture. Une boucle qui s'arrête sur ce chiffre s'arrête sur une auto-estimation.
2. **P2 — Une seconde passe trouve-t-elle encore des défauts réels ?** C'est la condition du gain : si un relecteur neuf ne trouve rien, boucler ne rapporte rien.
3. **P3 — Quel arbitre et quel arrêt ?** Qui note, sur quoi, avec quel seuil et quelle borne.
4. **P4 — Quelles dérives ?** Longueur du prompt qui gonfle à chaque passe, score qui monte sans que la sortie s'améliore, coût en temps.

### P1 — mesuré : le score projeté ne discrimine pas

Sur 28 analyses relevées, le score projeté tombe toujours entre 86 et 94, moyenne 88, que le prompt d'origine parte de 20 ou de 79. Exemples : 20 → 88 (personas par phase, 14/09), 32 → 88 (niveaux d'intervention, 25/09), 79 → 93 (Supabase, 16/10). Un seuil de boucle à 90 serait donc franchi dès la première passe, ou jamais, selon l'humeur de l'auto-estimation. Aucune des 28 analyses n'a fait mesurer son prompt réécrit par une seconde lecture.

### P2 — mesure à l'aveugle du 16/10/2026

Protocole : 5 prompts réécrits par L99 sont extraits tels quels de leur analyse, sans le reste du document. Chacun est confié à un agent neuf (Claude Opus 5.5), qui reçoit la seule rubrique du Ch1 et les définitions de sévérité du Ch3. Il lui est interdit d'ouvrir l'analyse d'origine ou sa synthèse. Il peut vérifier les prémisses en lecture seule sous `C:\dev`. Consigne à charge : un point n'est accordé qu'avec une citation du prompt.

Comment lire le tableau : « projeté » est le score que L99 annonçait pour sa réécriture, « mesuré » celui du relecteur. « Hors plafond » est l'estimation du relecteur sans la règle « un bloquant plafonne à 40 ».

| Prompt réécrit | Date | Projeté | Mesuré | Bloquants / majeurs | Une passe de plus | Longueur après une passe |
|---|---|---|---|---|---|---|
| P1 personas par phase | 14/09 | 88 | 82 | 0 / 7 | +6 | grossit |
| P2 gestion des réseaux sociaux | 17/09 | 87 | 40 (environ 80 hors plafond) | 1 / 4 | +35 | maigrit |
| P3 amélioration continue | 03/09 | 86 | 40 (environ 76 hors plafond) | 1 / 4 | +30 | stable |
| P4 audit et plan d'amélioration | 19/09 | 86 | 74 | 0 / 4 | +8 | maigrit |
| P5 compétences Supabase | 16/10 | 93 | 84 | 0 / 3 | +5 | grossit |

Ce que la mesure établit :

- **L'écart est réel et de même sens partout.** Sur les 2 prompts jugés sans péremption, P1 et P5, le mesuré est 6 et 9 points sous le projeté. P5 a été réécrit ce matin, et son relecteur trouve 2 défauts majeurs déjà présents à l'écriture : la règle compte les fichiers Azure, mais le contrat n'en tire aucune ligne ; le contrôle `oracle-secrets` qu'il prescrit n'existe pas. Le relecteur trouve aussi une prémisse mal lue : les lignes de forge-tests citées pour la décision D-1 décrivent un défaut corrigé (TF-0381), pas une fonction à reproduire.
- **Une seconde lecture trouve des défauts que la première a laissés.** Au moins 11 des 22 majeurs existaient le jour de la réécriture, selon le classement de l'agent pilote, fait défaut par défaut et non vérifié par un second relecteur. Exemple : P1 limite l'écriture à `output\03-etudes\` et `input\01-candidatures\`, puis demande d'ingérer la candidature, ce qui écrit dans `todo\TODO.jsonl`.
- **Le relecteur se trompe aussi.** Recompté à la source par l'agent pilote : `oracle-claims` existe chez forge-conception et chez forge-agents, si bien que le majeur de P2 qui le disait mal rangé est faux. Le registre compte 1 044 créations, et non les 3 982 que le relecteur de P3 annonçait en comptant toutes les lignes. Un relecteur aveugle doit donc lui-même être recompté avant qu'un défaut entre dans la passe suivante.
- **Le reste vient de la péremption, et une boucle à l'écriture n'y peut rien.** P2, P3 et P4 sont plafonnés ou pénalisés par des prémisses que leur propre exécution a rendues fausses : l'étude demandée existe déjà, le registre est passé de 787 à 1 044 créations, le skill `plan-d-amelioration` est né du prompt P4. Seule une ÉTAPE 0 qui remesure l'état au moment d'exécuter s'en protège ; P5 en porte une, P2 et P3 n'en ont pas.
- **Le gain d'une passe de plus est modeste sur un prompt sain** : +5 à +8 points estimés (P1, P4, P5). La longueur grossit dans 2 cas sur 5 et maigrit dans 2, quand la passe renvoie à un outil existant au lieu de le redécrire.
- **Coût mesuré d'une relecture** : de 68 à 432 secondes, et de 69 000 à 75 000 jetons par agent.

Limite assumée : le relecteur est du même modèle que l'auteur, et chaque prompt n'a eu qu'un relecteur. Ces 5 cas montrent le sens de l'écart, ils ne suffisent pas à fixer un seuil universel.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `la-boucle` | « L'arbitre est figé et validé avant le premier candidat », essais « Bornés (~3-5) » (`SKILL.md`, section « L'arbitre ») | Recouvre la discipline ; ne recouvre pas le câblage : rien n'appelle L99 comme générateur ni sa rubrique comme arbitre |
| Protocole de tests du Ch8 de L99 | « boucle bornée à 3 itérations […] s'applique au livrable produit à l'exécution, jamais au prompt lui-même » (`SKILL.md`, lignes 79 à 81) | Ne recouvre pas : il prescrit une boucle sur la sortie, il ne boucle pas sur le prompt |
| `oracle-judge --lecteur-vise` | « prépare la consigne de 2 relecteurs […] Un constat n'est retenu que si les 2 refusent l'unité » (`registre-oracles.md`, rubrique du 13/10/2026) | Recouvre le mécanisme de relecture aveugle à deux voix, réutilisable comme arbitre ; ne note pas un prompt |
| `la-barre`, mode en ligne | « alimente l'arbitre d'une boucle » (description du skill) | Recouvre la fourniture d'une référence externe à l'arbitre ; ne boucle pas |
| `ameliore-un-skill` | « re-test via le runner 6/6 de write-a-skill » (description du skill) | Ne recouvre pas : il juge un skill, pas un prompt |

## 3. État de l'art daté

État de l'art : non instruit. Motif : la question qui tranche est locale et mesurable ce jour (P2), sur les prompts réels du parc ; une source externe sur l'auto-critique des modèles ne dirait pas si L99 en particulier laisse des défauts que sa propre relecture verrait.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée. Coût du statu quo mesuré en section 1 : sur les 5 cas, le prompt part à l'exécution avec 3 à 7 défauts majeurs que le score « projeté » ne laisse pas voir. Le prompt P5 s'exécutait ce matin même avec son contrôle `oracle-secrets` inexistant.
- **O1 — Boucle auto-notée.** L99 relance L99 sur sa propre réécriture jusqu'à un score projeté de 90. Coût : simple × court. Exclut toute mesure indépendante : le juge est l'auteur, et P1 montre que son chiffre d'arrivée ne bouge pas.
- **O2 — Boucle à relecteur aveugle.** Après la réécriture, un agent neuf, sans accès à l'analyse, note le prompt réécrit avec la même rubrique. Arrêt quand le score mesuré atteint le seuil avec 0 bloquant et 0 majeur, ou quand une passe gagne moins de 2 points, borne à 3 passes. Garde de longueur : une passe qui fait grossir le prompt de plus de 15 % sans clore un défaut majeur est rejetée. Coût : moyen × court ; environ 2 fois les jetons d'une analyse par passe. Exclut la mesure de la sortie réelle du prompt.
- **O3 — Boucle par exécution.** Le prompt réécrit est joué sur un cas d'essai, et sa sortie est jugée contre le contrat de sortie du Ch8. Coût : complexe × moyen ; une exécution complète par passe. Exclut les prompts de run, qu'on ne rejoue pas à blanc sans effet de bord.
- **O4 — Score mesuré sans boucle.** Une seule relecture aveugle remplace le chiffre « projeté » par un chiffre mesuré, et ses défauts sont corrigés une fois. Coût : simple × court. Exclut la convergence : un défaut introduit par la correction n'est pas revu.

## 5. Verdict

- **Option retenue** : O2, la boucle à relecteur aveugle, posée comme un mode du skill `prompt-analyzer-l99` (déclencheur proposé : « L99 boucle »), le mode L99 simple restant le défaut. Réglages à figer au cadrage de chaque boucle : l'arbitre est la rubrique du Ch1, jouée par un agent neuf qui ne voit ni l'analyse ni la passe précédente ; l'arrêt tombe à « 0 bloquant, 0 majeur » ou quand une passe gagne moins de 3 points, et la borne est de 3 passes. Une passe qui allonge le prompt de plus de 15 % sans clore un majeur est rejetée. Le Ch8 affiche alors un score « mesuré », et le mot « projeté » disparaît. Le relecteur vérifie les prémisses d'état, et tout prompt réécrit porte une ÉTAPE 0 qui les remesure à l'exécution.
- **Coût** : complexité moyen · durée court ; à l'usage, 1 à 3 relectures par analyse, soit 69 000 à 75 000 jetons et 1 à 7 minutes chacune (mesures de la section 1). Dette : une recette de 2 cas pour le mode, un prompt déjà sain qui s'arrête à la passe 1 et un prompt qui converge en 2 passes.
- **Candidature(s) émise(s)** : une proposition au registre TODO-FORGE, statut `candidat`, classe `amelioration-jugee-sans-ses-effets`, cible forge-agents (dépôt du skill). La construction attend votre décision.
- **Plan de revue** : 2026-11-16. Ce jour-là, sur les analyses faites dans le mode, comparer le score mesuré à la passe 1 et à la dernière passe, et compter les majeurs clos. Si le gain médian reste sous 3 points, le mode redevient optionnel et le seul score mesuré (O4) devient le défaut.
- **Test rétro** : le mode (opérationnel) sert la tactique « un juge distinct de l'auteur, sur une rubrique figée », qui sert la stratégie « mesurer le gain au lieu de le promettre ». Celle-ci sert l'intention : « encore meilleur […] jusqu'à un certain score ». Question du demandeur rejouée : la boucle rend-elle le prompt meilleur ? Oui sur les cas sains, de 5 à 8 points estimés et 3 à 7 majeurs clos ; non contre la péremption, que seule l'ÉTAPE 0 traite. « Un certain score » est conservé comme seuil secondaire ; le premier critère d'arrêt est le nombre de défauts, parce qu'un score de 84 avec 3 majeurs ouverts n'est pas un prompt fini.
