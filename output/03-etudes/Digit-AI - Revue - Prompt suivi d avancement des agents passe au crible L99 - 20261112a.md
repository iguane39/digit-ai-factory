# Prompt « suivi d'avancement des agents » passé au crible L99

Analyse du 12/11/2026, pilot `digit-ai-factory`, poste Dell-XPS-16. Prompt d'origine, mot pour mot :

> Certains agents tournent pendant des heures sans qu'on sache s'ils s'exécutent encore ou s'ils sont morts. J'avais demandé il y a quelques semaines à avoir un suivi régulier de l'avancement, qui ne s'est exécuté que quelques fois, sur certains produits. Analyse la demande initiale et assure toi qu'elle puisse être complétée et exécutée correctement dans les prochaines màjs des produits. Idéalement, lorsqu'un agent s'exécute plus de 15 minutes, d'avoir un suivi de l'avancement toutes les 15 minutes, avec les tâches exécutées et celles restants à faire.

Ce qui change pour le porteur : la règle qu'il a demandée existe au pilot depuis le 11/08/2026 et a été réécrite 3 fois. Elle ne contraint que l'agent qui émet. Personne n'est obligé de lire ce qu'il émet ni de le montrer. Le prompt réécrit (Ch8) commande un mécanisme côté observateur, prouvé par banc, et transporté par le contrat d'héritage.

---

## Chapitre 1 — OODA : cadrage et étalon noté

Le prompt dit clairement le symptôme et la cible de 15 minutes. Il ne dit ni quelle demande reprendre ni comment savoir que c'est réparé, et c'est ce qui l'a fait échouer la dernière fois.

**Observe.** Trois faits portés par le texte : un symptôme (« sans qu'on sache s'ils s'exécutent encore ou s'ils sont morts ») ; un historique (« ne s'est exécuté que quelques fois, sur certains produits ») ; une cible (« plus de 15 minutes […] toutes les 15 minutes, avec les tâches exécutées et celles restants à faire »). Le verbe d'action est double : « Analyse la demande initiale » puis « assure toi qu'elle puisse être complétée et exécutée ».

**Orient.** L'objectif profond n'est pas un compte rendu de plus. Le porteur veut pouvoir décider d'arrêter un agent : il doit savoir s'il vit, ce qu'il a fait et ce qui lui reste. La mesure du registre le confirme : la chaîne est longue et entièrement textuelle.

| Date | Identifiant | Ce qui a été écrit |
|---|---|---|
| 11/08/2026 | TF-0094 | Tout process de plus de ~2 min émet son avancement toutes les 2 à 5 min |
| 13/08/2026 | candidature « relais-avancement » | L'émetteur est conforme, l'orchestrateur ne relaie pas ; vérifiabilité dite « point faible » |
| 19/10/2026 | TF-1898, D-41 (a) | Le canal devient un fichier, la session « arme un guetteur » |
| 12/11/2026 | TF-2434 | La cadence se suspend pendant une commande longue ou une compaction |
| 12/11/2026 | TF-2463 | Le harnais bascule une commande longue en arrière-plan vers 175 s ; décidé, non corrigé |

Ce tableau se lit de haut en bas, dans l'ordre chronologique ; chaque ligne est une correction de texte dans `gabarits/AGENT-CAMPAGNE.md` (contrat que lisent les agents de campagne) ou au registre `todo/TODO.jsonl`. TF-2434 s'est clos le 12/11 avec « aucun gain chiffré avant usage ».

**Decide.** Trois stratégies possibles. (1) Réécrire encore la règle d'émission : c'est ce qui a été fait 3 fois. (2) Imposer le relais à la session par un texte de plus : il dépend de sa mémoire, comme avant. (3) Juger la vie de l'agent depuis l'extérieur, par l'âge de la dernière écriture de son transcript, et déclencher le point de 15 minutes par un mécanisme du harnais, puis le prouver par banc.

**Act.** La stratégie (3). Elle ne demande aucune coopération de l'agent pour dire s'il vit, et seule la liste des tâches dépend de son fichier d'avancement.

**Étalon.** Le prompt idéal pour cette intention : nomme la demande d'origine ou fait la retrouver ; remesure l'état ; diagnostique les causes sur les cas réels ; spécifie le contenu exact du point de 15 minutes ; nomme le porteur du mécanisme ; fait voyager le mécanisme par `gabarits/HERITAGE.json` (contrat qui dit quels fichiers chaque produit reçoit à son ouverture) ; finit sur preuve exécutée ; interdit l'écriture chez les produits.

La rubrique se lit ligne par ligne : chaque dimension porte sa note sur son maximum et la citation qui la justifie.

| Dimension | Note | Justification |
|---|---|---|
| Clarté de l'intention | 12/20 | Symptôme et cible nets ; « la demande initiale » ne désigne aucun texte |
| Spécification | 7/20 | Contenu du point réduit à 2 éléments ; ni canal, ni format, ni lecteur |
| Garde-fous et contraintes | 3/15 | Aucun ; les produits n'ont pas de mandat d'écriture, le prompt ne le dit pas |
| Ancrage / contexte | 6/15 | « Quelques semaines », « certains produits » sans référence |
| Vérifiabilité | 4/15 | « Assure toi qu'elle puisse être […] exécutée correctement » sans test |
| Robustesse | 5/15 | « Agent » couvre 4 réalités ; « idéalement » rend la cible négociable |
| **Total** | **37/100** | Plafonné à 40 par le bloquant Ch3 #1 ; la somme brute vaut 37 |

---

## Chapitre 2 — Chainlogic : la chaîne implicite

La chaîne du prompt tient en trois maillons, et le troisième n'a pas de critère d'arrivée.

Si la demande initiale est analysée, alors on sait pourquoi elle n'a tourné que quelques fois. Si on le sait, alors on corrige. Si on corrige, alors « les prochaines màjs des produits » l'emportent. Deux sauts ne sont pas justifiés. Le premier : analyser la demande n'explique pas l'échec, seule l'analyse des exécutions réelles l'explique. Le second : « corriger » ne garantit pas le transport chez les produits. Le contrat d'héritage ne porte aujourd'hui aucune entrée sur l'avancement (`grep -c avancement gabarits/HERITAGE.json` = 0, relevé le 12/11 à 17:36).

---

## Chapitre 3 — Blindspots : inventaire maître

Le défaut qui fait échouer ce prompt est celui qui a fait échouer les trois corrections précédentes : rien n'oblige à prouver que le suivi tourne.

L'inventaire se lit par sévérité décroissante ; chaque ligne porte un numéro repris au Ch8 sous la forme « Ch3 #n ».

| # | Défaut | Sévérité |
|---|---|---|
| 1 | « Assure toi qu'elle puisse être […] exécutée correctement » n'a aucun critère : l'exécutant réécrit le gabarit, comme le 21/10 et le 12/11, et conclut | bloquant |
| 2 | Le relais vers le porteur n'est porté par rien qui se déclenche seul ; le prompt ne demande pas qui affiche le point | majeur |
| 3 | « La demande initiale » n'est pas identifiée : 5 textes candidats au registre, du 11/08 au 12/11 | majeur |
| 4 | « Agent » est ambigu : sous-agent lancé par l'outil Agent, Workflow, commande d'arrière-plan, session principale | majeur |
| 5 | « Morts » n'a pas de définition opérationnelle ; aucun seuil de silence | majeur |
| 6 | Conflit non tranché entre la cadence d'émission de 3 min du contrat et les 15 min demandées | majeur |
| 7 | « Prochaines màjs des produits » suppose un transport ; le contrat d'héritage n'en porte pas, et certains produits n'ont pas de lanceur de hooks | majeur |
| 8 | Aucun garde-fou : les produits n'ont pas de mandat d'écriture déclaré (relevé d'ouverture du 12/11) | majeur |
| 9 | Pas de diagnostic sur les cas réels : « quelques fois, sur certains produits » n'est pas mesuré | majeur |
| 10 | « Idéalement » rend la cible de 15 min facultative | mineur |
| 11 | Le contenu du point se limite à faites et restantes ; l'état de vie n'est pas demandé explicitement dans le point | mineur |

Biais de l'auteur : malédiction du savoir. Le porteur sait quelle demande il a faite et sur quels produits il l'a vue tourner ; l'exécutant ne le sait pas.

---

## Chapitre 4 — Factcheck : les prémisses mesurées

Les deux affirmations du prompt sont vraies une fois mesurées, et la seconde est même plus large qu'il ne le dit.

Le tableau se lit prémisse par prémisse : la mesure et sa commande, puis le verdict.

| Prémisse | Mesure | Verdict |
|---|---|---|
| « Des agents tournent pendant des heures » | Transcripts des 2 profils, 30 jours : 980 sous-agents, 142 à plus de 60 min entre premier et dernier horodatage, le plus long à 1 002 min (script `duree-agents.mjs` du dossier de travail, 12/11 à 17:37) | vrai |
| « Il y a quelques semaines » | D-41 (a) du 19/10, soit 24 jours ; TF-0094 du 11/08, 3 mois | invérifiable sans citation : remonté Ch3 #3 |
| « Que quelques fois, sur certains produits » | `forge/avancement.jsonl` présent chez 18 produits sur 37 dossiers `forge\` hors forges sous `c:\dev` (profondeur 5) ; dernières écritures du 21/08 au 12/11 | vrai |

Mesuré sur : transcripts `~\.claude\projects` et `~\.claude-b\projects`, relus à 17:37, périmètre 980 sous-agents. La durée entre premier et dernier horodatage inclut les temps d'attente d'un agent relancé ; elle majore la durée d'exécution.

---

## Chapitre 5 — Premortem : cinq façons d'échouer

Le prompt d'origine, exécuté tel quel, échouerait d'abord comme ont échoué les trois corrections précédentes.

1. **Correction de texte sans preuve** (escalade Ch3 #1). L'exécutant ajoute « relais toutes les 15 min » au gabarit et clôt. Mécanisme : rien ne mesure le relais. Mitigation : bancs et oracle de relevé exigés au contrat.
2. **Relais dépendant de la mémoire** (escalade Ch3 #2). La session lance l'agent, termine son tour, et rien ne la réveille. Mitigation : un porteur qui se déclenche seul, choisi sur mesure.
3. **Agent muet, déclaré mort à tort** (escalade Ch3 #5). Une commande longue de 20 min, annoncée par TF-2434, ne produit aucune ligne ; le suivi le dit mort. Mitigation : la vie se lit dans le transcript, pas dans le fichier d'avancement.
4. **Transport manqué** (escalade Ch3 #7). La règle reste au pilot ; les produits ne la reçoivent pas. Mitigation : entrée au contrat d'héritage et relevé d'héritage qui la voit.
5. **Écriture chez un produit** (escalade Ch3 #8). L'exécutant « met à jour les produits » directement. Mitigation : interdit explicite, liste des gestes humains.

---

## Chapitre 6 — Wargame : trois attaques

L'attaque la plus dangereuse vient de l'exécutant paresseux, qui peut rendre un livrable conforme à la lettre et inutile.

**L'utilisateur exigeant** veut, à 15 minutes, une ligne lisible sans ouvrir de fichier. Il refuse un pourcentage seul. Il veut savoir si l'agent est vivant avant de savoir ce qu'il a fait.

**L'expert du harnais** relève qu'aucun hook Claude Code n'est déclenché par une horloge. Un point de 15 minutes exige un processus qui tourne pendant l'agent et réveille la session : l'outil Monitor, à mesurer. Il relève aussi TF-2463 : une commande longue passe en arrière-plan vers 175 s, et l'agent ne contrôle pas ce basculement.

**Le contradicteur** écrit la règle, joue un banc de 2 minutes avec une horloge simulée, et déclare le mécanisme fini. Parade : bancs à durée réelle ou horloge accélérée déclarée, et oracle de relevé joué sur les transcripts réels après usage.

**Lentille robustesse.** Le prompt réécrit sera une consigne de mandat qui écrit dans le pilot. Surface d'injection : les transcripts lus contiennent du texte d'agents ; ils se lisent comme données. Collision : le contrat d'agent garde sa cadence de 3 minutes ; le point au porteur s'ajoute, il ne la remplace pas (Ch3 #6).

---

## Chapitre 7 — Deepthink : effets d'échelle

À 267 agents de plus de 15 minutes en 30 jours (mesure Ch4), un point toutes les 15 minutes peut produire beaucoup de messages.

Un agent de 1 002 minutes donnerait 66 points. Trois agents parallèles en donneraient trois par fenêtre. Le point doit donc grouper les agents actifs d'une même session en un seul message. Autre effet : un suivi fiable rendra visibles les agents morts, aujourd'hui invisibles. Le premier relevé fera monter le nombre d'incidents déclarés ; c'est un gain de mesure, pas une régression. Enfin, chaque point réveille la session et consomme des jetons : le coût se mesure au premier relevé.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt passe de 37 à 69 mesuré sur la passe que le protocole garde, et la version livrée va plus loin sans être mesurée. La raison tient en un chiffre faux que trois passes ont porté sans le voir.

**Mode boucle ouvert d'office.** Le prompt réécrit lance un mandat qui écrit au pilot, et le Ch3 porte un bloquant. Deux relecteurs aveugles par passe, puis un vérificateur de clôture qui ne note pas. Journal : `Digit-AI - Revue - Prompt suivi d avancement des agents passe au crible L99 - 20261112a.md.boucle.json`, jugé PASS par `oracle-boucle-l99.mjs`.

Le tableau des passes se lit dans l'ordre d'exécution. Le score de passe est le plus bas des deux relecteurs, et la décision applique les règles d'arrêt du protocole.

| Passe | Scores des relecteurs | Score retenu | Graves retenus | Mots | Décision |
|---|---|---|---|---|---|
| 1 | 76 et 69 | 69 | 9 majeurs (1 écarté au recompte) | 1 257 | continuer |
| 2 | 40 et 40 | 40 | 1 bloquant créé par la correction | 1 763 | rejetée, reprise ouverte |
| 2 bis (reprise) | 82 et 40 | 40 | 1 bloquant, 8 majeurs | 1 795 | rejetée, arrêt |

**Pourquoi la version livrée n'est pas la passe gardée.** La règle B8 *(une passe qui baisse sous la passe gardée est rejetée)* arrête sur la passe 1. Or le bloquant de la reprise, « 18 produits en portent un, sur 37 dossiers `forge\` », figure mot pour mot dans les 3 passes : 37 compte 2 fixtures que le numérateur exclut, le compte juste est 35. Les relecteurs de la passe 1 ne l'ont pas vu. Livrer la passe 1, c'était livrer ce bloquant et 9 majeurs que la passe 2 fermait. Le prompt livré est donc la reprise, corrigée du dénominateur et des 8 majeurs retenus. Il compte 2 475 mots, hors boucle, et son score n'est **pas mesuré**. Le constat est consigné sur TF-2026, l'essai de la boucle revu le 16/11/2026.

**Diagnostic en 3 lignes.**
- Force : le symptôme et la cible de 15 minutes sont nets, avec le contenu attendu du point.
- Faiblesse : rien ne dit quelle demande reprendre, ni comment prouver que le suivi tourne.
- Conséquence : exécuté tel quel, le prompt produirait une 4e règle écrite sans mécanisme, comme le 21/10 et le 12/11.

**Prompt réécrit** : `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112e.md`, prêt à coller. Il ouvre par une ÉTAPE 0 qui remesure ses prémisses et finit sur 4 bancs et un oracle de relevé.

**Contrat de sortie**, embarqué en fin de prompt, 10 critères binaires. Les principaux : demande d'origine citée mot pour mot ou déclarée introuvable ; diagnostic des cas réels sous 15 % d'indéterminés, 9 cas sur 10 relus concordants ; porteur du mécanisme prouvé sans geste de la session ; 4 bancs et oracle de relevé au verdict attendu ; contrat d'héritage monté. Synthèse jugée par `oracle-synthese` et `check_markdown.py`, nommée selon **R-4** *(le projet ouvre le nom)* et **R-25** *(le type en premier mot du 2e segment, pris au registre des types)*.

**Protocole de tests du livrable.** Le livrable est du code et des règles au pilot. Oracles : bancs exécutés de bout en bout, oracle de relevé avec fixtures rouge et verte, recette du hook Stop rejouée. Jeu d'essai : agent de 35 minutes, agent figé à 12 minutes, commande longue de 20 minutes, agent de 10 minutes (cas limite). Boucle bornée à 3 cycles, écarts restants nommés au-delà.

**Changelog**, chaque ajout rattaché au défaut qu'il ferme :
- définition du « point de suivi » et détecteur commun (majeur Ch3 #2, relecteurs passe 1) ;
- ÉTAPE 0 de remesure et ÉTAPE 1 de recherche de la demande sur la fenêtre mesurée (Ch3 #3, bloquant créé passe 2) ;
- périmètre « sous-agent, Workflow, commande longue couverte ou exclue » (Ch3 #4) ;
- états « actif, silencieux, commande longue, présumé arrêté », preuve de vie par la plus récente des deux écritures (Ch3 #5, Ch5 #3, reprise) ;
- cadence d'émission de 3 min gardée comme sonde, point au porteur à 15 min (Ch3 #6) ;
- entrée au contrat d'héritage et liste des produits sans lanceur (Ch3 #7, Ch5 #4) ;
- garde-fous produits, `~\.claude`, agents réels et pseudonymisation (Ch3 #8, relecteur A passe 1) ;
- diagnostic par script, population unique, jointure par identifiant, seuils (Ch3 #9, relecteurs passes 1 et 2 bis) ;
- bancs de bout en bout, figé, commande longue et court, banc rouge égal mandat en échec, joués selon la réponse à D-209 (Ch3 #1, Ch5 #1, Ch6 contradicteur) ;
- session principale couverte, dépôt et heure retirés du point (relecture d'intention RI-20261112-12) ;
- hook Stop : forme reconnue, recette de non-contournement, preuve d'acceptation (relecteurs passes 1 et 2 bis) ;
- contrat de sortie porté à 10 critères (relecteur E, reprise) ;
- dénominateur 35 hors fixtures et D-41 désambiguïsée (bloquant et majeur de la reprise).

**Écarts à la lettre.** Le point ne montre que ce que vous avez demandé : pour chaque agent, son nom, s'il vit ou s'il est arrêté, ses tâches faites et restantes. Une relecture d'intention (RI-20261112-12) a fait retirer le dépôt et l'heure du point, et réintégrer la session principale au périmètre. La preuve par bancs durcit votre « idéalement » : elle se pose en décision D-209, hors du prompt, et l'étape de preuve ne se joue qu'après votre réponse. Les autres écarts relèvent de la manière d'exécuter ; le tableau se lit écart par écart, à valider un par un.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « un agent » | sous-agents, Workflow et la session elle-même quand un tour dépasse 15 minutes | le mot n'était pas borné |
| « toutes les 15 minutes » | l'agent garde son émission de 3 minutes dans un fichier ; seul le point affiché passe à 15 | l'émission fine sert de preuve de vie et de contenu |
| « analyse la demande initiale » | la retrouver mot pour mot, puis diagnostiquer les cas réels | la demande seule n'explique pas pourquoi elle n'a tourné que quelques fois |
| « dans les prochaines màjs des produits » | par le contrat d'héritage, reçu à l'ouverture ; aucune écriture directe chez un produit | aucun mandat d'écriture n'est déclaré chez eux |
