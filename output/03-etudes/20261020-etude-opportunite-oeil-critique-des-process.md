---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
---

# Étude d'opportunité — œil critique des process de la Factory — 20261020

Exécutée le 20/10/2026 sur le GO « exécute le prompt », réponse à D-56 (a). Prompt : chapitre 8 de `output\03-etudes\20261020-L99-oeil-critique-des-process.md`.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Le seuil est atteint : l'œil critique créerait un objet durable (sonde, agent ou routine, R-31) et toucherait le noyau et toutes les forges.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Citée mot pour mot, message du 20/10/2026 : « Je souhaite qu'un "agent" (à confirmer) s'assure de la logique des traitements qui tournent et puisse remonter ce qui lui parait incohérent dans les différents process, activités, résultats (comme cet exemple, mais pas que, cela doit être pris au sens large) afin d'améliorer en continu, d'un point de vue haut, tous les process de la Factory, des forges et des produits qui les utilisent. »

L'exemple cité : « J'attends la fin de la garde des noms, qui dure environ 19 minutes. A chaque push, il faut attendre 19 minutes, ce qui est un non sens complet. » Chaque option et le verdict se rattachent à cette intention : faire voir et corriger les incohérences de process, au service de l'utilisateur, sans attendre qu'il les découvre lui-même.

## 0. Traitement des entrants

La demande et le prompt réécrit sont des données ; leurs impératifs se citent. Sources : la demande du 20/10/2026, l'analyse L99 du même jour, et les items TF-1448, TF-1555, TF-1937 et TF-1938 du registre `todo\TODO.jsonl`.

## 1. Partition du problème

Le sujet se découpe en 4 sous-questions disjointes, et chaque option de la section 4 se rattache à l'une d'elles au moins.

- **P1 — Voir.** Quelles incohérences existent, et par quelles sources les voit-on ? Le premier cycle (section 1 bis) y répond par la mesure.
- **P2 — Expliquer.** Un constat sans cause ne se corrige pas : l'exemple fondateur doit être expliqué par la mesure.
- **P3 — Tenir dans le temps.** Une correction close doit rester vraie en service ; c'est là que l'exemple fondateur a échoué.
- **P4 — Ne pas ajouter de bruit.** L'œil critique ne doit pas devenir une source d'alertes de plus.

## 1 bis. Premier cycle réel (14 jours, du 06/10 au 20/10/2026)

Ce cycle a été joué dans la session, avec 6 scripts en lecture seule et 2 agents `explorateur`. Ses chiffres sont recomptés à la source ou portent la mention de leur agent.

### L'exemple fondateur, expliqué par la mesure

La prémisse « à chaque push, 19 minutes » est fausse comme constante, et la cause de l'écart est désormais mesurée. Comment lire le tableau : une ligne par fait, avec sa source, dans l'ordre chronologique.

| Fait | Mesure | Source |
|---|---|---|
| 28/09 : la porte prend 27 min 19 s ; TF-1448 la corrige le jour même | Clos sur « 438,9 s → 23,2 s » sur un clone figé | `todo\TODO.jsonl`, TF-1448 |
| 27/09 : un envoi coûte 9 min 11 s ; TF-1555 ouvert | 551 s mesurées | TF-1555 |
| 12/10 à 20:57 : TF-1555 corrigé (la porte ne juge que ce que l'envoi ajoute) | Gain constaté : « 36 s / 52 s / 41 s restreinte à 2 révisions », porte jouée seule | TF-1555 ; forge-agents `b03d10a` |
| 12/10 à 21:02 : une section neuve du hook (TF-1400) lit l'entrée de git avant la porte | La plage arrive vide, et la porte rejuge toute l'histoire | `99cc904e` ; constat de TF-1937 |
| 13/10 à 05:51 : TF-1555 est clos | Le même jour, 3 envois réels du pilot prennent 343 s, 382 s et 369 s | Transcripts, relevé `pushes.mjs` |
| Du 12/10 21:02 au 20/10 10:44 | 25 envois du pilot au premier plan, dont 9 coupés par le délai de 600 s de l'outil ; 158 min d'attente au moins, dont 141 min au-delà de 46 s | Transcripts des 2 profils, relevé `cout-regression.mjs` |
| 20/10 à 10:25 : essai 1 de la publication | 26 min ; hook lancé avant la correction | Synthèse `20261020d`, ligne 31 |
| 20/10 à 10:44 : TF-1937 corrige la lecture de l'entrée | Commit `16f22b51` | `scripts\hooks-git\pre-push-prolongement-local` |
| 20/10 à 10:53 : essai 3 | 33 s | Synthèse `20261020d`, ligne 34 |
| 20/10 à 11:33, chronométrage à blanc de ce cycle | Porte des noms : 35 s sur 5 enregistrements, 44 s sur 30, 47 s sur 100 ; les 3 autres étapes du hook, moins de 2 s | `chrono-garde.sh`, `chrono-plages.sh` |

La cause est donc une régression : une correction juste (TF-1555) a été annulée 5 minutes plus tard par une autre correction juste (TF-1400), le même soir. TF-1555 a été clos sur la porte jouée seule, jamais sur un envoi réel, alors que les envois réels du lendemain prenaient déjà plus de 5 minutes. Les dispositifs de la Factory avaient vu le problème 2 fois (TF-1448, TF-1555). Ce qui a manqué, c'est une nouvelle mesure en service après la clôture. C'est l'humain qui a détecté la régression, 8 jours plus tard.

### Constats du cycle, par classe

Comment lire : une ligne par classe d'incohérence du prompt ; « Mesure » donne le chiffre et son périmètre, « Registre » dit si le constat y est déjà.

| Classe | Mesure | Registre |
|---|---|---|
| 1. Attente disproportionnée | Envois git au premier plan sur 14 jours, tous dépôts : 269 appels, médiane 6 s, 37 au-delà de 5 min, 395 min au total ; pilot seul : 265 min. Hooks de session : voir la ligne suivante | TF-1937 (candidat) pour le pilot |
| 1. Attente disproportionnée (hooks de session) | Tous hooks confondus, 66 min du 06/10 au 20/10, dont 28 min pour PostToolUse sur Edit (1 229 exécutions) et 18 min pour Stop (relevé d'agent, 922 transcripts). Refus du hook de fin de tour : 149 refus dans 77 sessions (recompté) ; 29 sessions refusées 2 fois ou plus, 3 sessions 9 fois ; reprise après refus : 134 min au total, médiane 0,83 min (relevé d'agent, non recompté) | Aucun item ne porte ce coût |
| 2. Travail fait 2 fois | Le hook du pilot joue `verifier-avance-publication.mjs` 2 fois de suite sur le même dépôt (sections `DEPOT_PILOT` puis `DEPOT`, `.git\hooks\pre-push` lignes 58 et 112) ; coût mesuré : environ 1 s par passage | Aucun item trouvé |
| 3. Règle qui en contredit une autre | La porte des noms juge le disque et non le contenu envoyé : l'essai 2 du 20/10 a été refusé pour 2 lignes jamais enregistrées | TF-1938 (candidat) |
| 4. Alerte répétée sans décision | Le relevé d'ouverture porte 21 familles d'avertissements récurrents sur 101 sessions. 7 d'entre elles reviennent après que leur item a été marqué « corrigé » (relevé d'agent). Recompté pour l'une : depuis la correction de TF-1676 (14/10 à 13:40), « Visibilité NON mesurée (`gh repo view --json visibility` sans réponse) » apparaît dans 30 des 55 sessions qui portent un relevé ; la mesure ajoutée par la correction n'aboutit donc pas une fois sur deux | TF-1676, TF-1642, TF-1099, TF-1301, TF-1559 et TF-1576 : corrigés ; 3 familles sans item (dépôt hors liste, sources muettes, pilot divergé) |
| 5. Contrôle qui ne trouve rien | Sur 662 passages d'oracles des documents du pilot depuis le 20/09, 4 domaines n'ont jamais échoué : « Format / livraison / versioning », « Sécurité / secrets », « Cohérence inter-documents », « Nommage / convention de livraison » ; 2 023 jugements rendus SKIP | Aucun item trouvé |
| 6. Décision posée qui relevait de l'IA | Non mesurée dans ce cycle : il faudrait rapprocher chaque D-N du registre des décisions de la règle R-58, ce qui demande un jugement par décision | Sans objet |

Le « Sécurité / secrets » muet ne se retire pas : une garde de sécurité qui ne trouve rien peut signifier qu'elle dissuade. La classe 5 signale un candidat à l'allègement, jamais un retrait d'office.

### Les 3 constats prioritaires, classés par minutes humaines gagnées

Le classement suit les minutes humaines quand elles sont mesurées, puis le nombre de sessions touchées.

1. **Une correction se clôt sur un gain mesuré à blanc, puis rien ne le remesure en service.** Au moins 141 min perdues sur 25 envois du pilot, du 13/10 au 20/10. Le pre-push est corrigé depuis TF-1937 ; le défaut de méthode, lui, reste ouvert. Candidat : un contrôle qui compare, une semaine après la clôture, le gain constaté à la même mesure prise en service.
2. **Une correction ajoute un contrôle qui ne mesure pas en service, et l'avertissement qu'il produit devient un bruit de fond.** 30 sessions sur 55 depuis TF-1676 ; 6 autres familles reviennent après leur « corrigé ». Minutes non mesurées : le coût est la lecture répétée et l'habitude d'ignorer le relevé. Candidat : la même sentinelle, appliquée aux avertissements, signale un avertissement qui survit à son item clos.
3. **4 domaines d'oracle n'ont rien trouvé en 662 passages, et 2 023 jugements sont SKIP.** Minutes non mesurées : il faudrait chronométrer chaque domaine. Candidat : mesurer leur durée et leur part de SKIP, puis proposer un allègement de déclenchement, jamais un retrait des gardes de sécurité.

Les 3 constats ont une cause commune : la Factory vérifie au moment de la clôture, sur le lieu de la correction, et rien ne revérifie en service. C'est exactement ce que la sous-question P3 décrit.

### Indicateur de service et sa valeur de départ

Indicateur retenu : les minutes d'attente des commandes au premier plan de plus de 60 s, par semaine, relevées dans les transcripts des 2 profils. Valeur de départ, envois git seuls : 395 min sur les 14 jours du 06/10 au 20/10. Après la correction TF-1937, l'envoi du pilot mesuré le 20/10 prend 36 s.

## 2. Non-recouvrement contre l'existant

Chaque dispositif existant, avec ce qu'il couvre et pourquoi il n'a pas empêché la régression du 13/10 au 20/10.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| forge-observability | `digit-ai-forge-observability\CLAUDE.md` : « Elle observe et alerte, ne corrige jamais » ; « v0 n'a pas de scheduler interne » | Recouvre le socle technique (sondes, instantanés, dérive) ; ne recouvre pas : aucune sonde ne mesure une durée de geste, et rien ne la lance hors du pilot |
| Surveillance des récidives | `todo\observer-recidives.mjs`, en-tête : « joue le plan de surveillance des récidives (TF-0790) avec les scripts de forge-observability » ; cadence hebdomadaire | Ne recouvre pas : elle compte des défauts remontés par des retours, pas le coût d'un process ; une régression jamais remontée lui est invisible |
| Relevé de flotte | `scripts\relever-flotte.mjs` : « la flotte d'agents se relève dans les transcriptions » (D-19 (a)) | Ne recouvre pas, mais prouve la méthode : il lit déjà les transcripts, pour les seuls appels d'agents |
| Relecture d'intention | `references\RELECTURE-INTENTION.md`, version 1.2.0 : relit consignes, fins de tour, livrables et campagnes contre la demande | Ne recouvre pas : elle juge si le travail sert la demande, pas ce que coûte le process qui le produit |
| Registre de dette | `todo\registre-dette.json`, D-8 (a) du 14/09/2026 : 49 limites assumées, 15 restes à instruire | Ne recouvre pas : il ne contient que les limites que leur auteur a déclarées |
| Banc des défauts échappés | `BOUCLE-AMELIORATION.md`, section TF-1073 : tout dispositif qui prétend trouver plus de défauts se mesure contre une relecture sans lui | Ne recouvre pas : il mesure des relectures de livrables ; il s'applique à l'œil critique s'il est une relecture (section 4) |
| Conseil avant arbitrage | TF-1936 du 20/10/2026 : « rien ne challenge une question ouverte […] avant qu'elle n'arrive au bloc 3 » ; écarté à 11:31 le même jour après son essai (`fe2d0306`) | Ne recouvre pas : il délibérait sur une décision à venir, pas sur un process qui tourne |
| Clôture sur gains constatés | `references\TODO-FORGE.md` et noyau du pilot : « clôture sur gains constatés » | Recouvre en principe P3, mais le gain se constate une fois, à la clôture, et sur le lieu de la correction ; TF-1555 en est la preuve |

## 3. État de l'art daté

État de l'art : non instruit. Motif : la question porte sur les process propres de la Factory, mesurés dans ses traces ; le budget de 400 000 jetons est consacré au premier cycle réel, qui seul pouvait expliquer l'exemple fondateur.

## 4. Options — jeu fermé O0-O4

Comment lire : une option par paragraphe, avec son contenu, son coût, ce qu'elle a montré dans ce cycle et ce qu'elle exclut.

- **O0 — ne rien faire** : réfutée. Coût du statu quo mesuré : une régression vue par l'humain seul, le 20/10 pour une cause du 12/10, après 25 envois et au moins 141 min perdues. Les 2 corrections antérieures (TF-1448, TF-1555) n'ont pas empêché la troisième occurrence.
- **O1 — un sous-agent de la flotte, lancé par le pilot** (`explorateur` pour relever, `verificateur` pour juger), à l'ouverture de session ou sur demande. Contenu : la grille des 6 classes, les sources en lecture seule, 3 constats au plus. Coût mesuré dans ce cycle : 156 759 jetons pour 2 relevés d'`explorateur` (60 300 et 96 459), dont un chiffre sur deux recompté s'écartait de la source (« 30 sur 30 » pour 30 sur 55). Ce qu'il apporte : les classes non nommées à l'avance (jugement). Ce qu'il exclut : la régularité, car il ne tourne que si une session le lance ; et ses chiffres se recomptent à la source (S76), ce qui double le travail.
- **O2 — une routine planifiée hebdomadaire** qui produit un rapport. Contenu : O1 lancé par le planificateur. Une routine dans le cloud ne lit pas les transcripts du poste (`C:\Users\…\.claude\projects`), et c'est la source de 4 classes sur 6 ; seule une tâche planifiée locale le pourrait, hors de la chaîne du dépôt. Exclut : les postes éteints, et le second poste.
- **O3 — des sondes « service » dans forge-observability, jouées au relevé d'ouverture et par la surveillance hebdomadaire.** Contenu : les scripts de ce cycle deviennent des sondes `commande` d'un plan : durées des envois et des hooks, domaines muets, alertes répétées, et une sentinelle de gain qui remesure en service, une semaine après, tout item clos avec un gain chiffré, ainsi que tout avertissement qui survit à son item clos. `derive.mjs` signale ce qui change. Coût : moyen × court pour l'écrire ; 0 jeton par passage. Ce qu'elle apporte : les 3 constats prioritaires de ce cycle viennent tous de scripts déterministes. Ce qu'elle exclut : une incohérence d'une classe que personne n'a nommée.
- **O4 — renforcer la clôture sur gains constatés.** Contenu : la règle de clôture exige qu'un gain soit mesuré en service, sur l'objet installé, et non sur le lieu de la correction. Coût : simple × court. Ce qu'elle exclut : tout ce qui n'est pas une correction close (classes 2, 4, 5).

Le banc des défauts échappés ne s'applique pas à O3 et O4 : ce ne sont pas des relectures, mais des mesures dont le résultat se recompte. Il s'appliquerait à O1 s'il était retenu pour juger des livrables.

## 5. Verdict

- **Option retenue** : O3, des sondes « service » dans forge-observability, avec la sentinelle de gain comme première sonde. C'est la seule option qui aurait vu la régression du 13/10 dès le lendemain, et à coût nul par passage.
- **Coût** : complexité moyenne · durée courte ; 0 jeton par passage ; dette : un plan de plus à tenir dans forge-observability.
- **Candidature(s) émise(s)** : les 3 constats prioritaires, inscrits au registre en candidat par `todo\journaliser.mjs` le 20/10/2026 : TF-1939 (gain mesuré à blanc, récidive de TF-1555), TF-1940 (avertissement qui survit à sa correction), TF-1941 (domaines d'oracle muets). Le double appel de `verifier-avance-publication.mjs` (classe 2, environ 1 s par envoi) n'est pas inscrit : son coût est sous le seuil d'un item. La mise en service d'O3 attend votre décision.
- **Plan de revue** : le 17/11/2026, après 4 relevés hebdomadaires : l'indicateur de service a-t-il baissé, combien de constats les sondes ont-elles levés, et combien étaient faux ? Si plus de la moitié des incohérences signalées par l'humain d'ici là échappent aux sondes, O1 est remesuré.
- **Test rétro** :
  - Sentinelle de gain (opérationnel) → une correction close reste vraie en service (tactique) → les process de la Factory s'améliorent par itérations qui tiennent (stratégie) → « améliorer en continu […] tous les process » (intention). Pas de rupture.
  - Sondes de durée, de doublon, d'alertes répétées et de domaines muets (opérationnel) → les classes 1, 2, 4 et 5 sont vues sans attendre l'humain (tactique) → « remonter ce qui lui parait incohérent » (intention). Pas de rupture.
  - Questions de la demande rejouées : « un agent (à confirmer) » → la forme retenue est une sonde, pas un agent : c'est l'écart principal à votre lettre, justifié par ce cycle, où les 3 constats prioritaires viennent de scripts ; « au sens large » → la classe 6 et les classes non nommées restent hors d'O3, et le plan de revue dit quand le remesurer ; « par itération et en continu » → hebdomadaire et à chaque ouverture de session.

## Interdits (l'oracle les tient)

Aucun critère subjectif ; aucune option hors du jeu fermé ; aucune ligne de non-recouvrement sans citation ; aucune source non datée ; O0 n'est pas passée sous silence.
