---
role: essai court décidé par la réponse humaine 126a, comparer les 10 règles du skill i-have-adhd aux règles de restitution et d'écriture de la Factory
destinataire: humain
---

# Essai — les 10 règles du skill i-have-adhd contre nos règles d'écriture — 20261102g

Ne l'installez pas : 6 de ses 10 règles existent déjà chez nous, 1 contredit une de vos décisions, et 3 sont couvertes seulement en partie. Une seule idée vaut d'être reprise : regrouper les longues listes du bloc 4, car 99 synthèses sur 141 dépassent 5 puces.

Lu le 02/11/2026 : `skills/i-have-adhd/SKILL.md` du dépôt ayghri/i-have-adhd, commit 1ecea19 du 11/10/2026, licence MIT. Aucun script n'a été lancé et rien n'a été installé. Comparé à `references/ECRITURE.md`, `gabarits/RESTITUTION.md` et `references/PREFERENCES-PORTEUR.md`.

## Les 10 règles

Le tableau suit l'ordre du skill. Le verdict dit si la règle apporte quelque chose à la Factory.

| Règle du skill | Chez nous | Verdict |
|---|---|---|
| 1. La première ligne est l'action à faire | E-1 et le bloc 0 ouvrent par l'état, ce qui change et ce qui est attendu : l'action y vient en dernier | Couverte en partie, ordre différent et voulu |
| 2. Numéroter les tâches à plusieurs étapes | E-11, et S81 pour les guides : une sous-puce par geste | Couverte |
| 3. Finir par une action de moins de 2 minutes | Le bloc 8 liste les actions, sans borne de durée ni action unique | Couverte en partie |
| 4. Écarter les digressions | Un constat en passant va au registre (`CLAUDE.md`) | Couverte |
| 5. Redire l'état à chaque tour | Bloc 0 et bloc 1 | Couverte |
| 6. Donner des durées précises | La restitution interdit l'effort en jours et le chiffre en complexité × durée, depuis votre retour du 20/08 (TF-0408) | Contredit votre décision |
| 7. Montrer le travail terminé | Bloc 4, et S71 pour ce qu'un utilisateur peut faire à l'instant | Couverte |
| 8. Ton factuel sur les erreurs | E-3 et E-6 | Couverte |
| 9. Listes de 5 éléments au plus, le reste gardé en réserve | E-11 impose la liste, sans borne ; la loi n° 3 interdit d'omettre | Couverte en partie, et c'est le vrai manque |
| 10. Ni préambule, ni résumé, ni formule de fin | E-5 et E-6, jugés par `oracle-ecriture` | Couverte |

## Pourquoi ne pas l'installer

Le skill a pour effet de raccourcir chaque réponse, et il le dit lui-même : le cadre de l'agent passe avant lui (sa section « When to break the rules », point 6). Ici, le hook de fin de tour exige la restitution par blocs. Vous avez aussi tranché le 01/10 : cette restitution sert la reprise de contexte, et seul le vide se coupe. Le skill serait donc soit neutralisé, soit en conflit avec le hook. Il se déclenche aussi à la main seulement, et son nom vise un autre besoin que le nôtre.

## Ce qui vaut d'être repris

**Regrouper les longues listes.** Mesuré sur les 141 synthèses d'`output/04-plans/` depuis octobre 2026 : le bloc 4 compte 7 puces en médiane et jusqu'à 36, et 99 synthèses dépassent 5 puces. Le skill dit comment concilier cela avec notre interdiction d'omettre : grouper et classer, et ne limiter que la présentation, jamais l'analyse. Ma dernière restitution elle-même porte 10 puces au bloc 4.

Je n'ai pas modifié `gabarits/RESTITUTION.md` : une règle de forme de plus s'imposerait à tous les produits, et je n'en ai pas mesuré l'effet. Une proposition part au registre pour votre revue hebdomadaire.

**Le contrôle avant envoi.** « Si le lecteur ne lit que la première et la dernière ligne, sait-il quoi faire et ce qui vient de se passer ? » Chez nous, la dernière ligne d'une restitution est une trace, pas une action. C'est voulu, le bloc 0 porte déjà les deux réponses. Rien à reprendre.

## Limites de l'essai

C'est une comparaison de textes, pas une mesure de l'effet sur un lecteur. Le décompte des puces lit la forme, sans juger si une liste longue était justifiée.
