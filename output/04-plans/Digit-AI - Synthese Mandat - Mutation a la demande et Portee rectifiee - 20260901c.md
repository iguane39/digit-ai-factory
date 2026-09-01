---
destinataire: humain
---

# Synthèse de mandat — la mutation devient une porte, et une page de doctrine cessait d'avoir deux jours de retard

Vos deux réponses sont appliquées. La mesure la plus lourde de l'audit ne se joue plus à chaque
fois : elle attend le passage en production, et elle vous est proposée uniquement si le code a
bougé plusieurs fois depuis la dernière. Votre seconde réponse demandait un contrôle que je
croyais absent ; en allant le poser j'ai trouvé qu'il existait déjà depuis deux jours et qu'il
fait davantage que ce que je décrivais. Ce n'est pas moi qui me suis trompé de mémoire : une
page de référence décrivait encore l'ancien fonctionnement, et je l'ai crue. Elle est corrigée,
et la question que je vous ai posée pour rien est retirée. Une seule chose vous attend.

## 1. En-tête

Mandat de session, second tour · pilot digit-ai-factory et forge digit-ai-forge-tests · terminé
le 2026-09-01 à 12h55 (Europe/Paris) · durée 45 min · agent pilot, commits 2626436 et 04c5084.

## 2. Verdict

Les deux réponses sont appliquées et mesurées : 81/81 recettes vertes au pilot, 1 189 tests
verts à la forge de tests dont 10 neufs pour la règle du jour, banc rouge joué à la main avec
4 échecs sur 10 quand l'implémentation est cassée volontairement.

## 3. Décisions attendues

La règle que vous avez posée hier tranche quand la campagne de mutation se joue. Elle ne dit
rien de ce qui se passe à l'intérieur d'une campagne, quand elle se joue : pour chaque
altération de code, faut-il relancer toute la suite, ou seulement les tests qui touchent la
ligne altérée ? Le code qui fait ce tri est écrit, éprouvé et éteint depuis hier, et trancher à
votre place serait une prise de position, pas une déduction.

> **D-36 — À l'intérieur d'une campagne de mutation, chaque altération relance-t-elle la suite entière, ou seulement les tests qui la touchent ?**
> Une campagne éprouve la suite en altérant le code des centaines de fois et en vérifiant à
> chaque fois que quelque chose casse. Aujourd'hui chaque altération relance la totalité des
> tests, dont l'immense majorité ne touche pas la ligne modifiée. Votre règle d'hier dit que
> tous les tests sont pleinement exécutés tout le temps ; elle vise la suite ordinaire, et elle
> est muette sur ce cas particulier. Le tri diviserait la durée de la porte par plusieurs
> dizaines, au risque qu'un défaut de tri rende un vert au lieu d'un rouge.
> **Recommandation : (a).** Source consultée : votre décision d'hier, dont la phrase
> « pleinement exécutés » porte sur la suite ordinaire, et le fichier d'étude
> output/03-etudes/20260901-etude-opportunite-strategie-tests.md, qui oppose à tout raccourci
> une condition de non-perte encore non jouée. Le gain ne se perd pas en attendant.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** garder le tri écrit mais éteint, et le vérifier lors de la prochaine campagne réelle | une campagne à jouer deux fois pour comparer, complexité simple × durée courte | exclut tout gain de durée sur la prochaine porte |
| **(b)** l'allumer maintenant | gratuit à poser, et le risque d'un vert imprévu jamais détecté | exclut de pouvoir attribuer un futur écart de verdict à autre chose |
| **(c)** retirer le tri, la suite entière étant rejouée pour chaque altération sans exception | l'effort déjà consenti, et une porte qui reste longue, complexité simple × durée courte | exclut de raccourcir la porte autrement qu'en la franchissant moins souvent |

> **Si rien n'est décidé** : (a) s'applique — le tri reste éteint, la campagne garde sa durée
> actuelle, et le sujet revient au prochain passage en production.

## 4. Traité — avec sa preuve

- La campagne de mutation ne se joue plus par défaut : elle se demande, et sans demande le pan
  dit ce qu'il n'a pas mesuré au lieu de se taire.
  - preuve : le seuil bloquant du pan est déclaré sans porteur, l'inventaire des modules reste
    publié, et 10 tests neufs verts couvrent les trois conditions de votre règle.
- La proposition est rédigée dans le rapport lui-même, avec son motif chiffré : nombre de
  modifications du code source depuis la dernière campagne, et seuil retenu.
  - preuve : deux tests exigent que le texte porte la proposition et la commande qui la joue ;
    ils tombent tous les deux quand l'implémentation est cassée à la main.
- La campagne jouée se note chez le produit, et les modifications depuis se comptent sur le
  seul périmètre que la mutation éprouve.
  - preuve : un test construit un dépôt réel, y pose un changement de documentation puis un
    changement de source, et vérifie que seul le second est compté.
- Une ancienneté inconnue vaut périmée, plutôt que de laisser un projet neuf passer entre les
  mailles pour toujours.
  - preuve : un test place une référence introuvable et vérifie que la campagne est proposée
    avec le motif « non mesurable » ; il tombe si l'inconnu passe pour récent.
- La règle est écrite là où elle s'exerce : à l'entrée de l'étape de mise en production côté
  pilot, et dans la documentation de la forge de tests.
  - preuve : les deux pages portent la décision mot pour mot, ses trois conditions avec leur
    porteur, et ce qu'elle ferme ; batterie du pilot 81/81.
- Le contrôle de fraîcheur demandé par votre seconde réponse existait déjà, et il va plus loin que
  signaler : il recopie. La page qui décrivait l'ancien fonctionnement est corrigée.
  - preuve : les trois produits instanciés portent le mécanisme et son câblage, vérifié fichier
    par fichier ; la version qu'ils affichent prouve seulement qu'aucune session n'y a été
    ouverte depuis deux jours.

## 5. Non traité — avec son motif

- Le tri des tests à l'intérieur d'une campagne : motif — dépendance à une décision humaine,
  c'est l'objet de la décision ci-dessus.
- Les paliers suivants de l'étude — cache de verdicts, parallélisation, distribution : motif —
  écarté par votre règle pour l'un d'entre eux, la sélection sur la suite ordinaire, qui est
  refusée explicitement ; hors mandat pour les autres, dont l'intérêt baisse fortement dès lors
  que la porte est franchie rarement.
- Le test rouge de la forge de tests, dont une référence externe a durci sa règle : motif —
  hors mandat, consigné au registre avec sa cause.
- Le tri des candidats du registre : motif — dépendance à une décision humaine ; deux d'entre
  eux sont tranchés par ce tour, deux restent.

## 6. Écarts à la lettre

- Vous avez répondu (b) à la seconde question. → Je n'ai rien posé du tout. → Le mécanisme
  demandé existait depuis deux jours et faisait déjà davantage ; le poser une seconde fois
  aurait créé deux vérités là où il en faut une. J'ai corrigé la page qui m'avait induit en
  erreur, et écarté l'item du registre en disant pourquoi.
- Votre première réponse ne retenait aucune des trois options proposées. → Je l'ai appliquée
  telle quelle plutôt que de la ramener à l'option la plus proche. → Elle est plus solide que
  ce que je proposais : rendre la mesure rare traite la cause du coût, là où mes options
  discutaient son prix unitaire.

## 7. Risques

- La porte pourrait ne jamais s'ouvrir si personne ne lit l'état publié au passage en
  production, la mutation devenant alors une mesure qu'on ne joue plus jamais.
  - signal : un passage en production dont le dossier ne mentionne ni campagne jouée, ni
    campagne proposée et refusée.
  - parade : la règle est écrite à l'entrée de l'étape et le rapport porte la proposition
    rédigée ; un contrôle exécuté reste à écrire, et il est nommé ici plutôt que promis.
- Le seuil de dix modifications est un choix, pas une mesure : trop haut, la porte s'ouvre trop
  tard ; trop bas, la proposition devient du bruit qu'on apprend à ignorer.
  - signal : deux campagnes consécutives sans aucun survivant neuf, ou au contraire un
    survivant trouvé sur du code écrit bien avant la campagne précédente.
  - parade : le seuil est publié au rapport et se change par une variable ; il se révisera sur
    les deux premières campagnes réelles.
- Un projet sans dépôt versionné verra la campagne proposée à chaque passage, faute de pouvoir
  compter ses modifications.
  - signal : une proposition dont le motif est « ancienneté non mesurable » deux fois de suite
    sur le même projet.
  - parade : c'est le choix conservateur assumé, et le motif le dit en clair au lieu de se
    présenter comme une péremption ordinaire.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur
dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit
ce que coûte l'attente. **Ordre de traitement** : la décision du jour d'abord, parce qu'elle
conditionne le sort d'un code déjà écrit ; puis les restes par coût d'attente décroissant.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | neuve | Trancher la décision ci-dessus, puis appliquer l'option retenue dans `forge_tests/adaptateurs/mutation.py` — allumer, laisser éteint, ou retirer le tri et ses tests. | manuelle_utilisateur puis auto_ia | decision puis dependance_bloc_3 — la seconde moitié attend la première. | Un code écrit et éprouvé reste sans emploi déclaré, et la prochaine porte garde sa durée actuelle. |
| **A-2** | TF-0745, TF-0747 | Trier les deux candidats restants au registre : la doctrine dictée à l'envers, et le test rouge de la forge de tests. Le registre se lit dans `todo/TODO.md`. | manuelle_utilisateur | decision — tout entre en candidat par construction, la décision de prise est humaine. | Deux constats mesurés restent sans suite, dont un qui laisse une suite de forge rouge. |
| **A-3** | neuve | Écrire le contrôle exécuté qui vérifie qu'un dossier de mise en production porte bien la trace de la campagne de mutation — jouée, ou proposée et refusée — dans `oracles/` du pilot. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre à l'étape de mise en production, que celui du jour ne couvre pas. | La règle du jour vit sans juge, c'est-à-dire qu'elle décore : c'est exactement le défaut que la doctrine nomme depuis l'origine. |
| **A-4** | TF-0747 | Reprendre la garde du masquage dans la page d'essai de la forge de tests, puis rejouer sa suite entière par `pytest tests -q` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre à la forge de tests. | La suite de la forge de tests reste rouge à son premier échec. |
| **A-5** | neuve | Publier les quatre commits du jour sur leurs dépôts distants : `git push` dans `c:/dev/digit-ai-factory`, puis dans `c:/dev/digit-ai-forge-tests`. | manuelle_utilisateur | decision — la publication est un geste humain, aucune tentative n'a été faite. | Le travail du jour reste sur ce poste, et les autres projets n'en bénéficient pas. |
| **A-6** | neuve | Trancher les quatre décisions ouvertes d'avant-hier : leurs tableaux d'options sont dans `output/04-plans/Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md`. | manuelle_utilisateur | decision — arbitrages restés ouverts, leurs replis s'appliquent depuis. | Les portes restées fermées le restent, et la demande d'étude d'un produit reste sans réponse. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Mutation a la demande et Portee rectifiee - 20260901c.md
- Commits : 04c5084 au pilot · 2626436 à la forge de tests — locaux, non publiés
- Doctrine de mise en production : ETAPE-MEP.md section 1 bis
- Doctrine de restitution : gabarits/RESTITUTION.md section Portée, corrigée
- Documentation de la forge : README.md de digit-ai-forge-tests, section campagne à la demande
- Code : forge_tests/adaptateurs/mutation.py · tests/test_d34_mutation_a_la_demande.py
- Registre : todo/TODO.jsonl — TF-0748 décidé, TF-0746 écarté avec son motif, 32 actifs
- Bancs : oracles/self-tests.mjs 81/81 · suite de la forge de tests 1 189 verts
- Étude d'origine : output/03-etudes/20260901-etude-opportunite-strategie-tests.md
