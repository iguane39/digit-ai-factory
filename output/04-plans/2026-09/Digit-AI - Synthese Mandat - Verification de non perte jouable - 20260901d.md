---
destinataire: humain
---

# Synthèse de mandat — le tri reste éteint, et sa vérification cesse d'être une intention

Votre réponse est appliquée : le tri des tests à l'intérieur d'une campagne reste écrit et
éteint, exactement comme il l'était. Le code n'avait donc rien à changer, mais votre réponse
demandait de le vérifier à la prochaine campagne, et une vérification promise ne vaut rien tant
que personne ne peut la jouer. Elle est désormais un outil qu'on lance, qui joue les deux
campagnes et compare leurs résultats, avec un verdict de sortie. La règle est écrite là où la
campagne se déclenche, pour qu'elle ne se reperde pas d'ici là. Rien n'attend de décision.

## 1. En-tête

Mandat de session, troisième tour · pilot digit-ai-factory et forge digit-ai-forge-tests ·
terminé le 2026-09-01 à 13h35 (Europe/Paris) · durée 30 min · agent pilot, commits 07b370b et
2922ea5.

## 2. Verdict

Votre réponse est appliquée et outillée : 81/81 recettes vertes au pilot, 1 194 tests verts à la
forge de tests dont 5 neufs pour la comparaison, banc rouge joué à la main avec 3 échecs sur 5
quand le comparateur est cassé volontairement.

## 3. Décisions attendues

Rien n'attend de décision ce tour. Les décisions ouvertes d'avant-hier restent ouvertes et leurs
replis s'appliquent depuis ; elles sont rappelées au dernier bloc avec l'endroit où lire leurs
options. **Si rien n'est décidé** : ces replis continuent de s'appliquer, et le tri reste éteint
jusqu'à la première campagne réelle — c'est l'option que vous venez de retenir, et elle a un
effet, pas une absence d'effet.

## 4. Traité — avec sa preuve

- La vérification que votre réponse demande est devenue un outil qu'on lance sur un projet : il
  joue les deux campagnes sur le même code et compare leurs listes de survivants.
  - preuve : la comparaison rend un verdict machine et un code de sortie distinct selon qu'elle
    tient, qu'elle mesure une perte, ou qu'il n'y avait rien à comparer ; 5 tests neufs verts.
- La comparaison distingue les deux sens d'un écart, parce qu'ils ne coûtent pas la même chose.
  - preuve : deux tests séparés exigent qu'un résultat manquant soit nommé comme un vert
    imprévu, et qu'un résultat en trop soit nommé comme du temps perdu ; les deux tombent quand
    le comparateur mélange les deux listes.
- Deux campagnes qui n'ont rien mesuré ne peuvent plus passer pour une vérification réussie.
  - preuve : un test exige un verdict « sans objet » quand aucune altération n'a été jouée des
    deux côtés ; il tombe dès que ce cas rend un vert.
- Les deux passes jouent le même échantillon d'altérations, faute de quoi la comparaison
  porterait sur deux tirages différents.
  - preuve : les variables de tirage sont figées par l'outil et republiées dans son rapport, et
    l'environnement de la session est restauré après chaque passe.
- La règle est écrite là où la campagne se déclenche : à l'entrée de l'étape de mise en
  production, et dans la documentation de la forge de tests.
  - preuve : les deux pages disent que la première campagne se joue deux fois, nomment la
    commande, et disent ce que chaque verdict entraîne ; batterie du pilot 81/81.

## 5. Non traité — avec son motif

- La vérification elle-même, sur un vrai projet : motif — dépendance externe, elle exige une
  campagne réelle, c'est-à-dire un passage en production ; la jouer sur un banc d'essai
  prouverait que le mécanisme tourne, pas qu'il ne perd rien.
- Le contrôle exécuté qui vérifierait qu'un dossier de mise en production porte la trace de la
  campagne : motif — hors mandat, du ressort de l'étape de mise en production ; il reste au
  dernier bloc.
- Le test rouge de la forge de tests, dont une référence externe a durci sa règle : motif —
  hors mandat, consigné au registre avec sa cause.
- Le tri des candidats restants du registre : motif — dépendance à une décision humaine.

## 6. Écarts à la lettre

- Vous avez répondu (a), c'est-à-dire garder le tri éteint et le vérifier plus tard. → J'ai en
  plus construit l'outil de vérification. → Sans lui, votre réponse aurait tenu dans une
  intention que personne n'aurait pu jouer le jour venu : la doctrine du dépôt dit depuis
  l'origine qu'une consigne s'exécute ou décore, et une comparaison faite de mémoire entre deux
  rapports lus à quelques minutes d'intervalle n'est pas une preuve.

## 7. Risques

- L'outil de comparaison pourrait n'être jamais lancé, la vérification restant indéfiniment
  différée et le tri restant éteint sans que personne ne le décide.
  - signal : deux passages en production consécutifs dont le dossier ne mentionne aucune
    comparaison jouée.
  - parade : la règle est écrite à l'entrée de l'étape avec sa commande ; le contrôle exécuté
    qui l'imposerait reste à écrire, et il est nommé au dernier bloc plutôt que promis.
- La comparaison suppose que deux passes du même code jouent les mêmes altérations ; si le
  tirage cessait d'être déterministe, elle rendrait un écart qui ne viendrait pas du tri.
  - signal : une comparaison en échec dont les résultats manquants et en trop sont aussi
    nombreux les uns que les autres, sans lien avec les lignes altérées.
  - parade : les variables de tirage sont figées et republiées dans le rapport, ce qui rend
    l'hypothèse vérifiable au lieu d'implicite.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur
dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit
ce que coûte l'attente. **Ordre de traitement** : ce qui débloque du travail d'abord — le tri
des candidats, puis les décisions restées ouvertes ; la vérification elle-même vient quand une
mise en production se présentera, et non avant.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | TF-0745, TF-0747 | Trier les deux candidats restants au registre : la doctrine dictée à l'envers, et le test rouge de la forge de tests. Le registre se lit dans `todo/TODO.md`. | manuelle_utilisateur | decision — tout entre en candidat par construction, la décision de prise est humaine. | Deux constats mesurés restent sans suite, dont un qui laisse une suite de forge rouge. |
| **A-2** | neuve | Trancher les quatre décisions ouvertes d'avant-hier : leurs tableaux d'options sont dans `output/04-plans/Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md`. | manuelle_utilisateur | decision — arbitrages restés ouverts, leurs replis s'appliquent depuis. | Les portes restées fermées le restent, et la demande d'étude d'un produit reste sans réponse. |
| **A-3** | TF-0749 | Au prochain passage en production, jouer la comparaison : `python recette/non_perte_ciblage.py <projet>` dans `c:/dev/digit-ai-forge-tests`, puis redécider du tri selon son verdict. | auto_ia | dependance_externe — la comparaison exige une campagne réelle, donc un passage en production, qui ne se décide pas ici. | Le tri reste éteint sans que rien ne dise s'il aurait tenu, et son coût d'écriture reste sans retour. |
| **A-4** | neuve | Écrire le contrôle exécuté qui vérifie qu'un dossier de mise en production porte la trace de la campagne de mutation — jouée, ou proposée et refusée — dans `oracles/` du pilot. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre à l'étape de mise en production, que celui du jour ne couvre pas. | Les règles du jour vivent sans juge, c'est-à-dire qu'elles décorent : c'est le défaut que la doctrine nomme depuis l'origine. |
| **A-5** | TF-0747 | Reprendre la garde du masquage dans la page d'essai de la forge de tests, puis rejouer sa suite entière par `pytest tests -q` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre à la forge de tests. | La suite de la forge de tests reste rouge à son premier échec. |
| **A-6** | neuve | Publier les six commits du jour sur leurs dépôts distants : `git push` dans `c:/dev/digit-ai-factory`, puis dans `c:/dev/digit-ai-forge-tests`. | manuelle_utilisateur | decision — la publication est un geste humain, aucune tentative n'a été faite. | Le travail du jour reste sur ce poste, et les autres projets n'en bénéficient pas. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Verification de non perte jouable - 20260901d.md
- Commits : 2922ea5 au pilot · 07b370b à la forge de tests — locaux, non publiés
- Outil de vérification : recette/non_perte_ciblage.py · tests/test_d36_non_perte_ciblage.py
- Doctrine de mise en production : ETAPE-MEP.md section 1 bis
- Documentation de la forge : README.md de digit-ai-forge-tests, section ciblage éteint
- Registre : todo/TODO.jsonl — TF-0749 créé puis décidé, 33 actifs
- Bancs : oracles/self-tests.mjs 81/81 · suite de la forge de tests 1 194 verts
- Étude d'origine : output/03-etudes/20260901-etude-opportunite-strategie-tests.md
