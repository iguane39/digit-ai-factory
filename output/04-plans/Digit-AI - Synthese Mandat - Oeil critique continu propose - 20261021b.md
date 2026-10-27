---
destinataire: humain
---

# Synthèse Mandat — vos réponses 61a, 62a et 63a appliquées, proposition d'œil critique du 21/10 produite (21/10/2026)

## 0. Synthèse d'ouverture

Vos 3 réponses sont reportées dans le prompt de l'agent nocturne, et le prompt a été exécuté : la proposition d'œil critique a une nouvelle version. Elle ajoute un dispositif continu, un skill que vous lancez sur chaque poste. Le skill lit les échanges sur place, n'écrit rien et rend la liste des modifications à faire. Aucune dépense n'est nécessaire, car tout tourne sur l'abonnement du poste. Il vous est demandé de dire si vous gardez cette version, puis de trancher la création du skill, le passage de nuit et le budget.

## 1. En-tête d'identification

Exécution de vos réponses D-61 (a), D-62 (a) et D-63 (a) · sur le pilot digit-ai-factory · le 21/10/2026, fin à 10:01 (heure de Paris, UTC+2), durée 8 minutes · Claude Opus 5.5, commit local cd6ee8f3.

Intention : disposer d'un prompt de l'agent nocturne arrêté sur vos choix, puis de la proposition qu'il produit, pour décider du dispositif d'œil critique continu. Test rétro : le prompt porte vos 3 choix, et la proposition répond à ses 10 critères de sortie ; l'exécution suit l'action A-1 du message précédent, ce que la relecture d'intention conteste et que D-67 vous pose.

## 2. Verdict en une ligne

Proposition du 21/10 : `oracle-ecriture` PASS sur 7 379 mots, `check_markdown` PASS après 7 corrections, dont 6 héritées de la version c ; 10 critères du contrat de sortie tenus sur 10 ; 0 € de dépense nouvelle.

## 3. Décisions attendues

> **D-67 — Faut-il garder la proposition d'œil critique du 21/10, produite en exécutant le prompt réécrit, ou vous en tenir au prompt ?**
>
> - **De quoi s'agit-il** : la version du 21/10 de la proposition d'œil critique, avec sa nouvelle section j sur le dispositif continu.
> - **Le problème** : j'ai lu « 61a, 62a, 63a » selon l'action A-1, « reporter vos réponses dans le prompt réécrit, puis l'exécuter » ; la relecture d'intention les lit comme un simple report et juge la nouvelle version non demandée (RI-20261021-03, 3 écarts).
> - **Pourquoi vous** : le périmètre de votre réponse est à vous seul de le trancher.
> - **Recommandation : (a)** — la version répond au contrat du prompt, et ses décisions D-64 à D-66 restent à votre main. Source consultée : la synthèse du 21/10 à 09:52, action A-1.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Garder la version du 21/10 | Elle devient la proposition en vigueur ; D-64 à D-66 attendent votre réponse | nul | revenir à la version c |
| **(b)** Retirer la version du 21/10 et vous en tenir au prompt | La version c reste en vigueur ; D-64 à D-66 tombent | nul | réexécuter le prompt |
| **(c)** Ne rien décider | Les 2 versions coexistent, la plus récente sans votre accord | nul | sans objet |

> **Sans réponse** : (c), les 2 versions coexistent.

> **D-64 — Faut-il créer le skill oeil-critique et son script d'extraction, seuls objets durables du dispositif d'œil critique continu ?**
>
> - **De quoi s'agit-il** : le skill `oeil-critique` du §j.2, lancé à la main dans VS Code, et le script qui extrait les échanges du poste.
> - **Le problème** : sans eux, l'analyse de ce diagnostic se refait à la main ; avec eux, la Factory gagne 2 objets durables, compensés par 3 retraits (§j.8).
> - **Pourquoi vous** : créer un skill est un motif de décision (motif g du §j.5).
> - **Recommandation : (a)** — le skill seul suffit aux 5 missions s'il est lancé sur chaque poste (§j.1). Source consultée : les mesures d'accès du §j.0.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Créer le skill et le script, avec les 3 retraits du §j.8 | Vous lancez « œil critique » sur chaque poste ; la sortie tient en 10 lignes | moyen × court | retirer le skill et rétablir les 3 éléments retirés |
| **(b)** Créer le skill et le script, sans les retraits | Le dispositif s'ajoute à la relecture d'intention et au relevé d'ouverture | moyen × court, contraire au §f point 1 | retirer le skill |
| **(c)** Ne rien créer | L'analyse reste à refaire à la main, comme ce diagnostic | nul | sans objet |

> **Sans réponse** : (c), rien n'est créé.

> **D-65 — Faut-il commencer le dispositif d'œil critique par le skill seul, et n'ajouter une tâche planifiée de nuit sur chaque poste que si des périodes restent non analysées ?**
>
> - **De quoi s'agit-il** : le passage de nuit du §j.3, comparé sur 4 hébergements.
> - **Le problème** : seul un hébergement sur le poste lit les transcripts sans les faire sortir ; la routine d'Anthropic et Railway ne les lisent pas sans export.
> - **Pourquoi vous** : une tâche planifiée est un agent permanent (motif g), et un hébergement hors du poste relève de R-38.
> - **Recommandation : (a)** — elle garde le moins de pièces et ne fait rien sortir du poste. Source consultée : le tableau du §j.3.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Skill seul d'abord, tâche planifiée sur chaque poste ensuite si besoin | Aucune exécution sans votre geste au départ | nul au départ | sans objet |
| **(b)** Tâche planifiée sur chaque poste dès le départ | Une exécution chaque nuit si le poste est allumé | simple × court, quota de l'abonnement | supprimer la tâche |
| **(c)** Pas de passage de nuit | Le skill seul, à la main | nul | sans objet |

> **Sans réponse** : (c), pas de passage de nuit.

> **D-66 — Faut-il faire tourner le dispositif d'œil critique sur l'abonnement du poste, sans aucune dépense nouvelle ?**
>
> - **De quoi s'agit-il** : le coût du dispositif, plafonné à 1 million de jetons par exécution (§j.7).
> - **Le problème** : sur le poste, `claude -p` consomme le quota de l'abonnement, sans clé d'API facturée ; l'usage professionnel d'un compte personnel reste une question ouverte par l'étude du 19/10 sur le jeton d'abonnement.
> - **Pourquoi vous** : une dépense, ou son absence, est votre décision (R-29).
> - **Recommandation : (a)** — aucune dépense n'est nécessaire aux options recommandées de D-64 et D-65. Source consultée : `output/03-etudes/20261019-etude-opportunite-jeton-abonnement-taches-sans-ecran.md`, section 5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Abonnement du poste en l'état | Le dispositif consomme le quota partagé, sans facture nouvelle | 0 € de plus | sans objet |
| **(b)** Passer à un plan d'équipe pour lever la question de l'usage professionnel | Le dispositif tourne sous un compte d'organisation | dépense mensuelle, non chiffrée ici | revenir au plan actuel |
| **(c)** Ne rien décider | Le dispositif reste sans budget décidé | nul | sans objet |

> **Sans réponse** : (c), aucun budget n'est décidé.

## 4. Traité

- Vos réponses reportées dans le prompt de `output/03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md` : 4 mentions « sous réserve » remplacées par D-61 (a), D-62 (a) et D-63 (a).
- Correction rouge → vert du volume de référence : les 106 Mo comptaient les sous-agents. Mesuré par script le 21/10 à 09:55, ce poste porte 77 Mo hors sous-agents et 1,30 million de caractères extractibles depuis le 20/10. Le chiffre est corrigé dans l'analyse L99. La décision D-62 du message précédent citait 106 Mo pour 17 sessions.
- Accès de l'étape 0 mesurés le 21/10 en lecture seule :
  - `railway whoami` rend « Unauthorized » ;
  - la commande `claude` est installée ;
  - `schtasks` ne porte aucune tâche de la Factory ;
  - l'étude du 19/10 établit que `claude -p` tourne sur l'abonnement du poste.
- Proposition `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md`, construite sur copie de la version c par éditions ciblées. Elle ajoute la section j : accès, réponse en 5 lignes, skill, 4 hébergements, 5 missions et leurs outils, liste des modifications, sortie en 10 lignes, bornes, 3 retraits et 6 cas d'essai.
- `oracle-ecriture` PASS sur 7 379 mots ; `check_markdown` FAIL puis PASS. 7 défauts M7 et M10 sont corrigés : 6 viennent de la version c, 1 de mes tableaux de décision.
- Contrat de sortie du prompt, 10 critères tenus sur 10. Parmi eux, aucune trace de branche de nuit ni de retour arrière automatique (`grep` : 0).
- Pseudonymisation automatique de 4 termes par le pre-commit à l'enregistrement.
- D-64 à D-67 réservées au registre : `reserver-decision` rend PASS.
- Commit local cd6ee8f3, limité à mes fichiers par `git commit --only`.
- Relecture d'intention : dérive (RI-20261021-03). Ses 3 écarts relèvent de votre choix et aucun ne se corrige sans vous ; ils sont posés en D-67.

## 5. Non traité

- Création du skill : non faite, parce qu'elle attend D-64.
- Push du pilot : non fait, parce qu'une publication attend votre feu vert ; le pilot a 9 commits d'avance et 3 de retard sur GitHub.

## 6. Écarts à la lettre

- Vous avez répondu « 61a, 62a, 63a » → j'ai reporté les choix puis exécuté le prompt → parce que l'action A-1 du message précédent le prévoyait ; posé en D-67.
- Le prompt demandait les décisions « chacune au format B » → je les ai d'abord écrites en puces, comme la version c, puis converties.

## 7. Risques

- Énoncé : le pilot local et GitHub divergent davantage, 9 commits d'avance et 3 de retard. Signal : `git rev-list --left-right --count main...origin/main` rend `9 3` à 09:59. Parade : rebase sur GitHub avant la prochaine publication.
- Énoncé : la version c et les analyses L99 du 20/10 restent hors de git, écrites par une autre session. Signal : `git ls-files` ne rend pas la version c. Parade : elles partent avec le travail de la session qui les a écrites.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 dépend de D-67 et D-64, A-2 publie le tout.

| Sélecteur | Registre | Action | Acteur | Motif | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Créer le skill `oeil-critique` et son script, avec les 3 retraits | auto_ia | dependance_bloc_3 | réponse « D-67 a, D-64 a » | l'analyse reste à refaire à la main |
| **A-2** | `neuve` | Rebaser le pilot sur GitHub et publier | auto_ia | gate_gouvernance | `git pull --rebase origin main` puis `git push origin main` | la divergence avec l'autre poste grandit |

## 9. Traces

- `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md`, section j.
- `output/03-etudes/20261021-L99-agent-nocturne-skill-vs-code.md`.
- `decisions/REGISTRE.jsonl`, réservations de D-64 à D-67.
- `todo/relectures-intention.jsonl`, entrée RI-20261021-03.
- Commit cd6ee8f3.
