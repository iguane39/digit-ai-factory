---
destinataire: humain
---

# Synthèse Mandat — prompt de l'agent nocturne amélioré : skill dans VS Code, liste de modifications (21/10/2026)

## 0. Synthèse d'ouverture

Le prompt de l'agent nocturne est réécrit avec vos deux évolutions : un lancement à la main par un skill dans VS Code, et un agent qui liste les modifications sans écrire de code. Le skill change la donne, car il lit les échanges sur le poste et n'en fait rien sortir. Il a pourtant une limite : il ne voit pas les échanges de l'autre poste. Il vous est demandé de trancher 3 points avant d'exécuter le prompt : qui exécute les modifications automatiques, comment couvrir les 2 postes, et faut-il plafonner les décisions.

## 1. En-tête d'identification

Analyse L99 d'un prompt · sur le pilot digit-ai-factory · le 21/10/2026, fin à 09:52 (heure de Paris, UTC+2), durée 20 minutes · Claude Opus 5.5, commit local 5d7c8aac.

Intention : obtenir un prompt prêt à exécuter qui ajoute à l'agent nocturne un lancement à la main par un skill et le réduit à lister les modifications, automatiques ou soumises à décision. Test rétro : le prompt réécrit intègre les deux éléments et retire tout droit d'écrire ; trois de ses choix vous reviennent et sont posés ci-dessous.

## 2. Verdict en une ligne

Prompt amendé à la lettre : 40 sur 100, plafonné par 1 défaut bloquant ; prompt réécrit : 84 sur 100, projeté et non mesuré ; 1 bloquant et 9 majeurs clos ; `oracle-ecriture` et `check_markdown` PASS.

## 3. Décisions attendues

> **D-61 — Qui exécute les modifications automatiques que l'agent liste sans écrire de code ?**
>
> - **De quoi s'agit-il** : le second état de chaque modification automatique, « ce qui aura été fait une fois exécuté », dans le prompt réécrit.
> - **Le problème** : l'agent n'écrit plus ; sans exécutant nommé, les automatiques restent « va être fait » et se répètent d'une liste à l'autre.
> - **Pourquoi vous** : c'est un arbitrage sur le fonctionnement du dispositif que votre message laisse ouvert.
> - **Recommandation : (a)** — la session qui reçoit la liste a déjà le mandat d'écrire dans les forges et l'oracle qui prouve le geste. Source consultée : l'analyse `output/03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md`, Chapitre 6.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* La session qui reçoit la liste exécute les automatiques dans le même tour | Chaque automatique passe à « fait » avec son commit et la sortie de son oracle | simple × court par exécution | annuler le commit |
| **(b)** Vous lancez l'exécution des automatiques par une commande à part | Les automatiques attendent votre geste, puis passent à « fait » | simple × court, plus un geste à chaque fois | sans objet |
| **(c)** Ne pas nommer d'exécutant | Le prompt garde les deux états sans dire qui remplit le second | nul | sans objet |

> **Sans réponse** : (c), le prompt s'exécute sans exécutant nommé.

> **D-62 — Comment le skill couvre-t-il les échanges des 2 postes et la première exécution, faute de repère ?**
>
> - **De quoi s'agit-il** : la portée de « tous les échanges depuis sa dernière exécution » dans le prompt réécrit.
> - **Le problème** : sur ce poste, 17 sessions ont produit 106 Mo d'échanges depuis le 20/10, et l'autre poste reste invisible d'ici ; sans repère, une première exécution lirait 2,2 Go.
> - **Pourquoi vous** : c'est le périmètre de l'analyse que vous avez demandée complète.
> - **Recommandation : (a)** — elle couvre les 2 postes sans faire sortir les échanges de leur poste. Source consultée : l'analyse `output/03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md`, Chapitre 4.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Lancer le skill sur chaque poste, repère par poste, première exécution depuis le 20/10/2026 | Chaque exécution déclare son poste et sa période ; l'analyse complète est la somme des 2 | simple × court, 2 lancements | changer la borne du repère |
| **(b)** Copier les échanges d'un poste vers l'autre avant l'analyse | Une seule exécution voit tout, mais les échanges sortent de leur poste | moyen × moyen, une copie à protéger | supprimer la copie |
| **(c)** Analyser le seul poste où le skill tourne, depuis tout l'historique | L'autre poste manque, et la première exécution lit 2,2 Go | élevé en jetons à la première exécution | sans objet |

> **Sans réponse** : (c), le prompt ne couvre que le poste où il tourne.

> **D-63 — Faut-il plafonner à 5 le nombre de modifications majeures posées en décision à chaque exécution ?**
>
> - **De quoi s'agit-il** : le nombre de décisions que vous recevez à chaque exécution, alors que la liste reste complète.
> - **Le problème** : le prompt du 21/10 fixait au plus 5 propositions majeures par semaine ; votre message demande « toutes les modifications ».
> - **Pourquoi vous** : c'est votre charge de lecture, et un arbitrage entre exhaustivité et attention.
> - **Recommandation : (a)** — toutes restent listées, et seules 5 attendent une réponse à la fois. Source consultée : l'analyse `output/03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md`, Chapitre 5, cause 4.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Au plus 5 posées par exécution, les autres listées en entier et posées ensuite | Vous tranchez 5 décisions au plus à chaque fois | nul | relever le plafond |
| **(b)** Toutes posées à chaque exécution | Vous recevez toutes les décisions d'un coup | nul, plus de lecture | ajouter un plafond |
| **(c)** Reprendre le plafond de 5 par semaine du prompt du 21/10 | Les décisions au-delà de 5 attendent la semaine suivante | nul | relever le plafond |

> **Sans réponse** : (a), le plafond reste celui du prompt réécrit.

## 4. Traité

- Analyse L99 en 8 chapitres de votre évolution, appliquée au prompt du 21/10 : `oracle-ecriture` PASS sur 2 808 mots, `check_markdown` PASS sur les règles M7, M10, M14 et M18.
- Prémisses mesurées le 21/10 à 09:40 en lecture seule :
  - le skill se lance dans VS Code ;
  - ce poste porte 6 et 11 sessions depuis le 20/10 dans ses 2 profils, soit 37 Mo et 69 Mo ;
  - l'autre poste n'est visible ni par fichier ni par dépôt ;
  - aucun repère de dernière exécution n'existe pour ce dispositif.
- Prompt réécrit : il retire la branche de nuit, les commits de l'agent et le retour arrière automatique. Il nomme le format B du bloc 3 et y ajoute vos 6 lignes, de « Résultat de l'analyse » à « Améliorations attendues ».
- Votre message tient lieu de levée de « tout entre en candidat » pour les seules automatiques ; le prompt le consigne au lieu de le reposer.
- D-61 à D-63 réservées au registre des décisions : `reserver-decision` rend PASS pour chacune.
- Commits locaux 972e9920 et 5d7c8aac, limités à mes fichiers par `git commit --only`.
- Relecture d'intention : dérive, RI-20261021-02, passe 1 après RI-20261021-01. 2 écarts hors de la demande ont été corrigés : 5 mécanismes ajoutés sont retirés, et une décision déjà tranchée n'est plus reposée. Les choix restants sont posés en D-61 à D-63.

## 5. Non traité

- Exécution du prompt réécrit : non faite, parce qu'elle attend vos réponses à D-61 à D-63.
- Seconde passe de correction : non jouée. Les écarts restants portent surtout sur des exigences reprises du prompt du 21/10, que le relecteur ne voit pas : alerte après 2 nuits, bornes de coût, livrable en nouvelle version de la proposition. S'y ajoute le contrat de sortie qu'impose la méthode L99.
- Push du pilot : non fait, parce qu'une publication attend votre feu vert ; le pilot a 7 commits d'avance et 3 de retard sur GitHub.

## 6. Écarts à la lettre

- Vous avez demandé « tous les échanges » → le prompt déclare l'autre poste non analysé et borne la première exécution → parce que les transcripts ne quittent pas leur poste ; posé en D-62.
- Vous avez demandé « toutes les modifications » → toutes sont listées, 5 majeures posées à la fois → posé en D-63.
- Vous avez demandé « selon le format du prompt de sortie » → j'ai retenu le format B du bloc 3 des restitutions, seul format de décision nommé de la Factory.
- Le prompt garde les exigences du prompt du 21/10 que votre message ne change pas : pseudonymisation, comparaison des hébergements de nuit, bornes de coût.

## 7. Risques

- Énoncé : le pilot local et GitHub ont divergé, 7 commits d'avance et 3 de retard. Signal : `git rev-list --left-right --count main...origin/main` rend `7 3` à 09:47. Parade : rebase sur GitHub avant la prochaine publication, index régénérés.
- Énoncé : une autre session a écrit `output/03-etudes/20261021-L99-agent-nocturne-oeil-critique.md`, non enregistré, dont ce prompt dépend. Signal : le fichier reste hors de git. Parade : il part avec le travail de la session qui l'a écrit ; je ne l'ai pas modifié.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 dépend de vos réponses, A-2 suit parce qu'elle publie A-1.

| Sélecteur | Registre | Action | Acteur | Motif | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Reporter vos réponses dans le prompt réécrit, puis l'exécuter | auto_ia | dependance_bloc_3 | réponse « D-61 a, D-62 a, D-63 a » | la proposition suivante de l'œil critique n'est pas produite |
| **A-2** | `neuve` | Rebaser le pilot sur GitHub et publier | auto_ia | gate_gouvernance | `git pull --rebase origin main` puis `git push origin main` | la divergence avec l'autre poste grandit |

## 9. Traces

- `output/03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md`.
- `decisions/REGISTRE.jsonl`, réservations de D-61 à D-63.
- `todo/relectures-intention.jsonl`, entrées RI-20261021-01 et RI-20261021-02.
- Commits 972e9920 et 5d7c8aac.
