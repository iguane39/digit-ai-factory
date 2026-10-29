---
destinataire: humain
objet: actions sur le code mort et sujets à intégrer à l'œil critique, exécution du prompt réécrit de la revue 20261029d (D-96 (a) du 29/10/2026)
date: 2026-10-29
sources: script de mesure en lecture seule joué le 29/10/2026 à 17:52 ; relevé d'ouverture de la session du 29/10/2026 à 15:14 ; sources.mjs (oeil-critique 1.2.0) joué à 17:20
---

# Œil critique : code mort et sujets à intégrer (29/10/2026)

## En bref

- Sur 5 sujets remesurés, 4 sont confirmés et 1 est infirmé : aucun candidat du registre n'a vieilli (au plus 9,3 jours).
- Le relevé du code non appelé rend un faux zéro : 911 contrôles et 0 sans appelant, contre 102 et 2 une fois les copies de travail exclues.
- 9 périmètres examinés en plus des 5 sujets ; 5 entrent dans l'œil critique, 4 sont déjà couverts ou sans objet.
- 5 préconisations, dont 4 automatiques et 1 majeure, la suppression des copies de travail.

## Constat

Comment lire : une ligne par sujet ou périmètre, la mesure avec sa source, puis le verdict et ce qui entre dans l'œil critique. Les mesures sans autre mention viennent du script de 17:52.

| Sujet ou périmètre | Mesure | Verdict |
|---|---|---|
| Relevé du code non appelé : portée et copies de travail | `relever-appelants.mjs` : contrôles seuls, pilot seul ; 911 et 0 avec les copies, 102 et 2 sans | confirmé ; à corriger à la source |
| 13 forges | `sources.mjs` n'en lit aucune ; même relevé par forge : 127 contrôles, 26 sans appelant ; 4 forges à 0 contrôle | confirmé ; la définition de « contrôle » est aveugle sur 4 forges |
| Vitesse de réponse (21/10) | 5 indicateurs au repère, aucun de durée ; 174 tours depuis le 26/10, médiane 1,7 min, 90e centile 18,1 min, 32 au-delà de 10 min | confirmé ; à intégrer |
| Candidats qui vieillissent | 38 candidats, au plus 9,3 jours | infirmé, sans action |
| Restes du registre et du dépôt | 19 items en cours et 3 décidés sans mouvement depuis 14 jours ; 14 copies, 2 verrouillées, 11 fusionnées libres ; 15 branches fusionnées sans copie | confirmé ; à intégrer |
| Lots des produits | relevé d'ouverture : 2 lots jamais parvenus au pilot | à intégrer |
| Mobilisation des forges | `sources.mjs produits` : 39 produits sur 40 sans trace | déjà lu par la 1.2.0 |
| Avertissements d'ouverture | `sources.mjs silencieux` : 6 familles dans 5 sessions sur 5, dont un re-test de modèles dû depuis le 25/09 | à intégrer : rapprocher chaque famille de son item |
| Décisions posées | 29 réservées depuis le 26/10 ; 4 recommandations suivies sur 5 | à intégrer : décisions par demande |
| Coût des contrôles | relevé d'ouverture : 5 890 190 jetons pour 62 relectures d'intention | à intégrer avec la vitesse |
| Autre poste | 1 repère sur 2 postes | couvert par le rappel de D-94 (a) |
| Versions livrées des forges | `maj-versions-livrees --constat` : 2 écarts dans forge-agents | à intégrer |
| Commandes prescrites introuvables | relevé d'ouverture : 4 sur 1 139, toutes dans des copies de travail | disparaît avec la préconisation 4 |

### Le zéro du relevé est faux

Les copies de travail d'agents dupliquent chaque contrôle : chacun paraît appelé par sa copie. Sans elles, `oracles/hook-droits-accordes.mjs` et `scripts/verifier-formulaire-entra.mjs` n'ont aucun appelant.

### La vitesse n'a pas de mesure, et elle varie beaucoup

Une demande sur 2 est servie en moins de 2 minutes, mais 1 sur 10 dépasse 18 minutes.

### Les restes sont dans les copies et les items en cours, pas chez les candidats

La revue hebdomadaire vide les candidats. Rien ne vide les items en cours ni les copies fusionnées.

## Préconisations

Quatre actions corrigent la mesure, une seule supprime. Comment lire : une action par ligne, dans l'ordre de valeur, avec le fichier où elle se fait et son classement selon l'étape 4 du skill.

| # | Action | Gain | Effort | Attention |
|---|---|---|---|---|
| 1 | `scripts/relever-appelants.mjs` du pilot : exclure `.claude/worktrees`, cas de recette ajouté ; `sources.mjs existant` le joue sur les 13 forges | fin du faux zéro ; forges couvertes | simple × court | automatique ; les 2 contrôles sans appelant sont proposés à la suppression ou au câblage, majeur (sécurité) |
| 2 | Même relevé, option qui compte tout script exécutable sans appelant ; une forge à 0 script relevé est signalée | code mort réel, 4 forges aveugles couvertes | moyen × moyen | automatique |
| 3 | `repere.mjs` : durée médiane et 90e centile des tours, décisions posées par demande, jetons des contrôles ; `extraire.mjs` les calcule | vitesse et coût mesurés, base 1,7 et 18,1 min | simple × court | automatique ; le repère refuse d'avancer sans eux |
| 4 | `sources.mjs existant` liste copies et branches fusionnées libres et items sans mouvement depuis 14 jours ; script du pilot qui ne supprime que les copies fusionnées et non verrouillées, essai par défaut | 11 copies et 15 branches en moins, 4 commandes introuvables disparues | moyen × court | majeur : une suppression perd les fichiers non suivis d'une copie |
| 5 | `sources.mjs` : lots jamais parvenus, avertissements rapprochés de leur item, écarts de versions livrées des forges | 3 périmètres intégrés | moyen × court | automatique |

## Rien à faire

- Candidats du registre : aucun n'a 10 jours, la revue hebdomadaire suffit.
- Autre poste : le rappel à 7 jours de D-94 (a) le couvre.
- Mobilisation des forges : déjà lue par la version 1.2.0.

## Ordre conseillé

1, puis 3, puis 5 ; 2 ensuite ; 4 après décision, en essai d'abord.

## 3. Décisions attendues

> **D-97 — Faut-il mettre en œuvre les préconisations de la fiche 20261029e sur le code mort et les sujets à intégrer à l'œil critique ?**
> - **De quoi s'agit-il** : les 5 préconisations ci-dessus, 4 automatiques et 1 majeure.
> - **Le problème** : le relevé du code non appelé rend un faux zéro, et la vitesse comme les restes n'ont aucune mesure.
> - **Pourquoi vous** : la préconisation 4 supprime des copies de travail, un geste qui peut perdre des fichiers non suivis.
> - **Recommandation : (a)** — le script de suppression ne touche que les copies fusionnées et libres, et joue d'abord en essai. Source consultée : cette fiche.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Les 5 préconisations | 1, 3, 5, 2, puis 4 en essai ; la suppression réelle sur la liste de l'essai | moyen × moyen | revenir aux commits ; une copie supprimée ne revient pas |
| (b) Les 4 automatiques | 1, 3, 5 et 2 ; les copies restent | moyen × moyen | revenir aux commits |
| (c) Rien | Le faux zéro reste dans les analyses | aucun | sans objet |

> **Sans réponse** : rien n'est mis en œuvre.

Sources : script de mesure en lecture seule du 29/10/2026 à 17:52, relevé d'ouverture de 15:14, `sources.mjs` de 17:20, revue `Digit-AI - Revue - Prompt actions code mort et sujets oeil critique passe au crible L99 - 20261029d.md`.
