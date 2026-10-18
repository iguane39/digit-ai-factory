---
destinataire: humain
---

# Synthèse Mandat — l'essai est publié ; les alertes ne corrigent encore rien d'elles-mêmes, et une boucle bornée peut le faire (18/10/2026)

## 0. Synthèse d'ouverture

Votre réponse « 24a » est exécutée : l'essai de relecture d'intention est enregistré et publié, les produits le recevront à leur prochaine ouverture, et le sceau de la synthèse de la flotte est reposé. À vos deux questions, la réponse courte est non : aujourd'hui, une alerte est notée puis vous est posée, et aucun agent ne la reprend pour corriger le travail. La seule correction du jour, je l'ai faite à la main. Le moyen de le faire automatiquement est une boucle courte : quand le relecteur signale un écart, le pilot corrige et fait relire à nouveau, au plus 2 fois, et ne vous pose que ce qui reste ou ce qui relève de votre choix. La relecture elle-même s'améliore en lui donnant les règles qui s'appliquent au travail, pas seulement votre demande : c'est ce qui a manqué sur les 3 dérives des produits. Le seuil de dépense de l'essai vient d'être franchi, et deux décisions vous reviennent, D-25 et D-26.

## 1. En-tête d'identification

Exécution de D-24 (a) du 18/10/2026 et réponse à deux questions, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 18/10/2026, de 14:40 à 15:15, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun agent délégué dans ce tour ; escalade de modèle : aucune. Une autre session travaille sur le même pilot : elle a publié ses enregistrements avant les miens, et vient d'en enregistrer un autre, non publié, qu'elle intitule aussi « D-24 (a) ».

Intention de la demande : que l'essai atteigne les produits, et savoir comment rendre la relecture meilleure et ses alertes utiles au résultat final sans attendre une intervention de votre part.

Test rétro : le résultat sert cette intention. L'essai est publié et vérifié à égalité avec le distant. Les deux questions reçoivent une réponse appuyée sur les mesures du jour, avec deux propositions chiffrées, et rien n'est mis en place avant votre accord.

## 2. Verdict en une ligne

Publié : pilot `5cb381d6..63c1d42e` ; contrôle des sceaux PASS après rescellement ; registre TF-1865 en cours ; alertes corrigées automatiquement aujourd'hui : 0 sur 1 ; dépense de relecture du jour : 1 145 733 jetons, seuil de 1 000 000 franchi.

## 3. Décisions attendues

2 décisions neuves, au format B. Chacune se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-25 — Le seuil de dépense de l'essai est franchi aujourd'hui : faut-il suspendre les relectures jusqu'à demain ?**
>
> - **De quoi s'agit-il** : le plafond de 1 000 000 de jetons de relecture par jour que vous avez fixé en lançant l'essai.
> - **Le problème** : 21 relectures ont consommé 1 145 733 jetons aujourd'hui, dont 12 pour la mesure ponctuelle chez les produits et 5 lancées par l'autre session. La règle de l'essai dit d'arrêter et de vous demander.
> - **Pourquoi vous** : c'est une dépense que vous avez plafonnée vous-même.
> - **Recommandation : (a)** — le dépassement vient d'une mesure qui ne se répétera pas ; le compteur repart demain, et la règle reste la même. Source consultée : `references/RELECTURE-INTENTION.md`, seuil d'arrêt ; `node scripts/relever-flotte.mjs --jours 1`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Suspendre les relectures jusqu'à demain | Les tours de ce soir finissent sans relecture et le disent dans leur restitution ; l'essai reprend demain avec le même seuil | Nul | Possible |
| (b) Ne pas compter la mesure ponctuelle et reprendre maintenant | Le relevé distingue l'essai des mesures ; environ 600 000 jetons sortent du compte du jour | Simple × court | Possible |
| (c) Relever le seuil à 1 500 000 jetons par jour | Les relectures reprennent maintenant, et le seuil reste plus haut pour la suite de l'essai | Nul ; jusqu'à 500 000 jetons de plus par jour | Possible |

> **Sans réponse** : (a), les relectures restent suspendues jusqu'à demain.

> **D-26 — Faut-il que la flotte corrige elle-même les écarts signalés, et que le relecteur reçoive les règles applicables, dès cet essai ?**
>
> - **De quoi s'agit-il** : deux changements de l'essai. D'abord une boucle de correction : sur une alerte majeure, le pilot corrige la consigne ou le travail, puis fait relire à nouveau, au plus 2 fois, et ne vous pose que l'écart restant ou celui qui relève de votre choix. Ensuite trois ajouts au relecteur : les règles applicables au type de travail, un contenu visible ajouté sans demande compté comme majeur, et le travail des sous-agents inclus dans ce qu'il relit.
> - **Le problème** : aujourd'hui, 0 alerte sur 1 a été corrigée sans moi ; le relecteur a manqué les 3 dérives des produits, toutes liées à une règle ou à un ajout visible ; et il ne voit pas ce qu'écrivent les sous-agents.
> - **Pourquoi vous** : cela change la doctrine de l'essai en cours, et chaque passe de correction coûte une relecture de plus.
> - **Recommandation : (a)** — la seule correction du jour a fait passer le verdict de « dérive » à « sert » en une passe ; la boucle rend ce geste systématique et borné. Source consultée : `todo/relectures-intention.jsonl`, relectures RI-20261018-01 et RI-20261018-02 ; `output/03-etudes/20261018-mesure-relecteur-d-intention.json`, constats de la mesure chez les produits.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) La boucle de correction bornée à 2 passes et les 3 ajouts au relecteur, dès maintenant | Une alerte devient d'abord une correction, puis une question si elle résiste ; la revue du 08/11 mesure les écarts corrigés sans vous | Moyen × court pour la mise en place ; environ 51 000 jetons par passe de correction | Possible : revenir au référentiel publié ce jour |
| (b) Les 3 ajouts au relecteur seulement, sans boucle | La relecture voit mieux, mais chaque alerte reste une question pour vous | Simple × court | Possible |
| (c) Attendre la revue du 08/11 | L'essai continue tel quel, et ses chiffres serviront à décider | Nul | Sans objet |

> **Sans réponse** : (c), l'essai continue tel quel jusqu'à la revue.

## 4. Traité

Chaque élément du tour, avec sa preuve.

- **Enregistrement de l'essai.** 69 chemins, les miens seuls, en `63c1d42e` ; les changements indexés par l'autre session sont restés hors de l'enregistrement. Preuve : `git commit --only` sur la liste des chemins, `git status` après.
- **Publication.** Garde de publication passée en 674 s avec `FORGE_PUSH_GO="D-24 (a) du 18/10"`. Preuve : `5cb381d6..63c1d42e main -> main`.
- **Rescellement.** La synthèse de la flotte de 08:25 porte de nouveau un sceau juste. Preuve : `node scripts/verifier-jugement.mjs output` rend PASS, FAIL avant.
- **Registre.** TF-1865 créé, décidé par D-21, D-23 et D-24, en cours jusqu'au 08/11. Preuve : contrôle du registre PASS avant et après, sur copie puis pour de bon.
- **Constat : aucune alerte n'est reprise par un agent.** Le script de relecture n'a que 4 modes, qui consignent, confirment, relèvent ou mettent en forme la relecture ; la règle de restitution fait d'une dérive une décision posée à vous. Preuve : `grep -c "corrig|boucle" scripts/relecture-intention.mjs` rend 0 ; `gabarits/RESTITUTION.md`, « Une dérive d'intention majeure se pose en décision ».
- **Constat : la seule alerte du jour a été levée à la main, en une passe.** Preuve : `todo/relectures-intention.jsonl`, RI-20261018-01 « derive » puis RI-20261018-02 « sert ».
- Relecture d'intention : sans objet, seuil de dépense du jour franchi (1 145 733 jetons), relecture suspendue jusqu'à votre réponse à D-25.

## 5. Non traité

- **La relecture de fin de ce tour.** Motif : le seuil de dépense est franchi ; elle attend D-25.
- **La mise en place de la boucle et des ajouts au relecteur.** Motif : vos questions demandaient comment faire ; cela attend D-26.
- **L'enregistrement de l'autre session.** Motif : il n'est pas le mien ; je ne le publie pas.

## 6. Écarts à la lettre

Aucun écart : « 24a » est exécuté tel que posé, et vos deux questions reçoivent une réponse sans rien mettre en place.

## 7. Risques

- **2 sessions numérotent leurs décisions en parallèle.**
  - Énoncé : l'autre session a intitulé « D-24 (a) » un de ses enregistrements, alors que D-24 désignait ici la publication de l'essai.
  - Signal : une réponse « 25a » ou « 26a » qui viserait une décision de l'autre session.
  - Parade : répondre en nommant le sujet si le doute existe ; je vérifierai la décision visée avant d'agir.
- **Une boucle de correction pourrait corriger au-delà de votre demande.**
  - Énoncé : corriger un écart, c'est réécrire, et une réécriture peut dériver à son tour.
  - Signal : une deuxième passe qui signale un écart nouveau.
  - Parade : 2 passes au plus, chaque passe relue, et jamais de retour sur une décision que vous avez prise.

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, la relecture du tour avant la mise en place ; vos réponses ensuite, parce que ces gestes les attendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1865 | Relire la fin de ce tour, selon D-25 | auto_ia | dependance_bloc_3 : attend D-25 | `node scripts/relecture-intention.mjs --preparer fin-de-tour` | Ce tour reste sans relecture |
| **A-2** | TF-1865 | Mettre en place la boucle de correction et les ajouts au relecteur, selon D-26 | auto_ia | dependance_bloc_3 : attend D-26 | `scripts/relecture-intention.mjs` et `references/RELECTURE-INTENTION.md` | Chaque alerte reste une question pour vous |
| **A-3** | TF-1865 | Revue de l'essai sur le relevé des relectures | auto_ia | dependance_externe : la revue est datée du 2026-11-08 | `node scripts/relecture-intention.mjs --releve --depuis 2026-10-18` | Les alertes ne sont pas évaluées |
| **A-4** | `neuve` | Trancher D-25 et D-26 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `25a, 26a` | Les options « sans réponse » s'appliquent |

## 9. Traces

- Enregistrement publié : `63c1d42e` (pilot)
- Essai : `references/RELECTURE-INTENTION.md`, `scripts/relecture-intention.mjs`, `todo/relectures-intention.jsonl`
- Mesures : `output/03-etudes/20261018-mesure-relecteur-d-intention.json`

## Annexe — réponses à vos 2 questions

Cette annexe répond à vos questions telles que posées ; ce sont des propositions, rien n'est mis en place avant D-26.

**Les alertes sont-elles prises en compte automatiquement par la flotte ?** Non. Une alerte est notée au registre de l'essai et vous est posée en décision ; aucun agent ne la reprend.

**Comment le mettre en place ?** Par une boucle courte, sur le modèle « évaluateur-optimiseur » :
- sur une consigne d'agent, une alerte majeure fait réécrire la consigne par le pilot, qui la fait relire à nouveau avant de lancer l'agent ;
- en fin de tour, quand l'écart sort de votre demande (une restriction, une partie oubliée, un ajout visible), le pilot reprend le travail, ou en confie la reprise à un agent `campagne` avec l'écart pour consigne, puis le fait relire ;
- quand l'écart touche un choix qui vous revient (une dépense, un périmètre, une publication), il vous est posé tout de suite, sans reprise ;
- la boucle s'arrête à 2 passes et sous le seuil de dépense ; elle ne revient jamais sur une décision que vous avez prise ; chaque passe s'inscrit au registre, pour que la revue du 08/11 compte les écarts levés sans vous.

**Comment améliorer la relecture sur les travaux ?** Trois ajouts, chacun tiré d'un échec mesuré aujourd'hui :
- donner au relecteur les règles applicables au type de travail, par exemple le composant de filtres pour une page ou la cascade pour un produit : les 3 dérives des produits enfreignaient une règle sans contredire la demande écrite ;
- compter comme majeur tout contenu visible ajouté sans demande : la source ajoutée à la présentation a été classée mineure, 2 fois sur 2 ;
- inclure dans le livrable relu les changements du tour relevés dans le dépôt : le relecteur ne voit pas ce qu'écrivent les sous-agents.

Un quatrième point attend la mesure : 2 restitutions acceptées sur 4 ont reçu une alerte. Vos confirmations pendant l'essai diront s'il faut exempter un écart que vous avez validé point par point, une validation en bloc restant une dérive, ou exiger l'accord de 2 relecteurs.
