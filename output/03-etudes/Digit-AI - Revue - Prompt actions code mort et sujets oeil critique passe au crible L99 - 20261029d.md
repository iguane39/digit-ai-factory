---
destinataire: humain
objet: analyse L99 du prompt « Reprends les éléments cités au-dessus pour identifier les actions à mettre en oeuvre pour les traiter, et élargis le périmètre pour identifier si d'autres sujets doivent y être intégrés. »
date: 2026-10-29
sources: réponse de la session du 29/10/2026 vers 17:00 (5 sujets cités), scripts/relever-appelants.mjs, todo/TODO.jsonl, git worktree list, ../digit-ai-forge-agents/.claude/skills/oeil-critique/ (1.2.0)
---

# Analyse L99 — transformer en actions les sujets laissés de côté par l'œil critique (29/10/2026)

Le prompt analysé est votre message du 29/10/2026, cité en entier : « Reprends les éléments cités
au-dessus pour identifier les actions à mettre en oeuvre pour les traiter, et élargis le périmètre
pour identifier si d'autres sujets doivent y être intégrés. » Le mot-clé « Améliore ce prompt » a
été retiré.

Les « éléments cités au-dessus » sont les 5 sujets de la réponse précédente : le code mort traité en
surface, le faux zéro du relevé, les 13 forges jamais relues, la vitesse de réponse, et les restes
qui s'accumulent (candidats du registre, copies de travail). Deux de ces 5 sujets reposent sur une
prémisse que la mesure de ce soir corrige.

---

## Chapitre 1 — OODA : cadrage stratégique et étalon noté

Le prompt obtient 31 sur 100, plafonné à 40 par un défaut bloquant : il demande de traiter des
sujets dont 2 sur 5 sont mal posés, sans exiger de les remesurer d'abord.

**Observe.** Deux verbes de commande : « identifier les actions » pour les éléments cités, et
« élargis le périmètre » pour trouver d'autres sujets. Le complément « y être intégrés » renvoie à
l'œil critique, sans le nommer. Aucun livrable, aucun format, aucune limite.

**Orient.** Vous voulez que l'œil critique couvre enfin l'existant, et pas seulement les
conversations : c'est la demande du 17/09/2026, citée au chapitre 2 de l'étude
`output/03-etudes/2026-09/20260917-L99-revue-hebdomadaire-amelioration-continue.md`. Le destinataire
est cette session du pilot, qui a le contexte de la réponse précédente.

**Decide.** Trois stratégies possibles :

1. lister les actions sur les 5 sujets tels qu'ils ont été écrits ;
2. remesurer chaque sujet, ne garder que les confirmés, puis élargir sur des périmètres nommés ;
3. exécuter tout de suite les actions évidentes, comme supprimer les copies de travail.

**Act.** La stratégie 2 est recommandée. La 1 bâtirait sur 2 prémisses à corriger ; la 3 toucherait
2 copies de travail verrouillées par un agent encore actif ce soir.

**Étalon.** Le prompt idéal nomme l'œil critique comme cible, demande de remesurer chaque sujet avant
d'agir, nomme les périmètres d'élargissement, fixe un livrable nommé selon les règles du pilot,
interdit d'exécuter et de supprimer, et donne des critères vérifiables.

Comment lire le tableau : une ligne par dimension de la rubrique L99, la note sur le maximum, et la
raison en une phrase.

| Dimension | Note | Raison |
|---|---|---|
| Clarté de l'intention | 11/20 | les 2 tâches sont claires ; « y être intégrés » ne nomme pas l'œil critique |
| Spécification | 4/20 | ni livrable, ni format, ni nombre de périmètres |
| Garde-fous et contraintes | 2/15 | rien n'interdit d'exécuter ou de supprimer |
| Ancrage et contexte | 7/15 | « au-dessus » ne tient que dans cette session |
| Vérifiabilité de la sortie | 3/15 | aucun critère pour juger la liste d'actions |
| Robustesse | 4/15 | « traiter » se lit « planifier » ou « faire » |
| **Total** | **31/100** | plafonné à 40 par le bloquant Ch3 #1 |

---

## Chapitre 2 — Chainlogic : la chaîne implicite

La chaîne implicite tient en 3 maillons : les sujets sont vrais, alors des actions les traitent,
donc l'œil critique s'enrichit. Le premier maillon n'est pas vérifié.

- Si les 5 sujets sont exacts, alors une action par sujet suffit. Or 2 sujets sont faux ou
  partiels (Ch4) : le maillon casse.
- Si « traiter » veut dire « faire », alors la session supprime des copies de travail. Or 2 copies
  servent à un agent actif : le maillon devient dangereux.
- « Élargis le périmètre » ne dit ni jusqu'où, ni sur quels axes : la chaîne s'arrête où la
  session le décide.

---

## Chapitre 3 — Blindspots : inventaire maître

Le prompt porte 1 défaut bloquant et 5 majeurs ; tous tiennent à ce qu'il ne dit pas sur la
mesure, l'exécution et le livrable.

Comment lire la liste : un défaut par ligne, numéroté pour le changelog du Ch8, avec sa sévérité.

1. **bloquant** — Aucune remesure exigée : les sujets « candidats qui vieillissent » et « copies
   orphelines » sont faux ou partiels (Ch4), et le prompt les tient pour acquis.
2. **majeur** — « traiter » : planifier ou exécuter ? Exécuter toucherait des copies verrouillées.
3. **majeur** — « y être intégrés » ne nomme pas l'œil critique ; certains sujets relèvent d'un
   script du pilot, pas du skill.
4. **majeur** — Élargissement sans borne ni axes : la session peut s'arrêter à l'exemple, défaut
   payé le 20/10 (« Le diagnostic n'est pas le bon »).
5. **majeur** — Ni livrable ni nom : la réponse finirait dans une restitution, contre la règle E-16
   *(règle d'écriture 16 : une explication se livre dans une fiche datée)*.
6. **majeur** — Aucun critère de réussite : rien ne dit qu'une action est mesurable ni qu'elle
   porte une barrière plutôt qu'un texte.
7. **mineur** — « au-dessus » ne survit pas à une nouvelle session.

---

## Chapitre 4 — Factcheck : les prémisses remesurées

Sur 6 prémisses mesurées ce soir, 3 tiennent, 2 sont partielles et 1 est fausse ; la fausse est le
défaut bloquant de l'inventaire.

Comment lire le tableau : une prémisse par ligne, la mesure du 29/10/2026 entre 17:30 et 17:44 avec
la commande jouée, puis le verdict.

| Prémisse de la réponse précédente | Mesure | Verdict |
|---|---|---|
| Le relevé ne cherche que les contrôles, dans le seul pilot | en-tête de `scripts/relever-appelants.mjs` ; `sources.mjs existant` l'appelle sans `--racine` | vrai |
| 911 contrôles et 0 sans appelant avec les copies, 102 et 2 sans elles | copie du script, `worktrees` ajouté aux exclusions de la ligne 30 | vrai |
| Les 13 forges ne sont jamais relues | même copie avec `--racine` sur chaque forge : 127 contrôles, 26 sans appelant ; 4 forges comptent 0 contrôle | vrai ; la définition de « contrôle » est aveugle sur 4 forges |
| La vitesse se mesure par la durée des tours | méthode de l'étude du 25/09/2026, horodatages des transcripts | vrai, non mesuré ce soir |
| Les candidats vieillissent au registre | 38 candidats, médiane 2,2 jours, au plus 9,3 jours ; mais 19 items en cours et 3 décidés sans mouvement depuis plus de 14 jours | faux pour les candidats ; vrai pour les items en cours |
| Les copies de travail sont orphelines | 8 copies : 2 verrouillées par un agent actif, 6 dont la branche est fusionnée ; 4 branches fusionnées sans copie ; 6 copies de campagne sous `C:/tmp` | partiel |

Remontées au Ch3 : la prémisse fausse est le #1 ; les 2 partielles alimentent le #2.

---

## Chapitre 5 — Premortem : 5 causes d'échec

Le prompt exécuté tel quel échouerait d'abord en agissant sur du faux, ensuite en s'arrêtant trop
tôt.

1. **Une action sur un faux sujet.** Une barrière « candidats vieillissants » est construite, alors
   qu'aucun candidat n'a 10 jours. Mitigation : remesurer chaque sujet, l'abandonner s'il est
   infirmé.
2. **Une suppression destructive.** La session supprime les 8 copies, dont 2 en usage. Mitigation :
   plan seulement ; toute suppression reste une action listée, gardée par le verrou git.
3. **Un élargissement qui tourne autour du code mort.** 8 sujets sur 10 portent sur le même thème.
   Mitigation : au moins 6 périmètres, au plus 2 sujets sur 10 consacrés au code mort.
4. **Un correctif mis dans le skill au lieu de la source.** Le faux zéro vient de
   `relever-appelants.mjs`, pas de l'œil critique. Mitigation : chaque action nomme le fichier où
   elle se fait.
5. **Une liste sans preuve.** Chaque action cite un chiffre de mémoire. Mitigation : chaque chiffre
   porte sa commande et son heure.

---

## Chapitre 6 — Wargame : 3 attaques

L'attaque la plus sérieuse vient de l'expert : la notion même de « contrôle » du relevé est trop
étroite pour parler de code mort.

1. **L'utilisateur exigeant** demande une liste exploitable : qui fait quoi, où, avec quel effort,
   et ce qui revient à lui. Le prompt n'exige rien de tel.
2. **L'expert** note que `relever-appelants.mjs` ne voit que les contrôles nommés selon sa
   convention : 4 forges en comptent 0, alors qu'elles portent des scripts. Le code mort réel
   (scripts jamais appelés, fonctions exportées sans appel, références jamais lues) n'est pas
   couvert. Remonté au Ch3 #6 : une action doit élargir la définition, ou la déclarer.
3. **Le contradicteur** rend 5 actions, une par sujet cité, et un « rien d'autre à intégrer » :
   conforme à la lettre, inutile pour l'intention.

Lentille robustesse : le prompt est un ordre ponctuel, pas un modèle réutilisable ; le risque
d'injection est nul. Le risque d'outil est réel : un `git worktree remove` sur une copie
verrouillée.

---

## Chapitre 7 — Deepthink

Prompt ponctuel, effets d'échelle non pertinents.

---

## Chapitre 8 — Synthèse et prompt réécrit

Le prompt passe de 31 à 86 sur 100, score projeté et non mesuré. La réécriture ajoute une étape de
remesure, des périmètres nommés et un livrable jugé.

**Diagnostic en 3 lignes.**
- Force : l'intention est juste, faire couvrir l'existant par l'œil critique.
- Faiblesse : 2 sujets sur 5 sont mal posés, et rien n'exige de les vérifier.
- Faiblesse : ni livrable, ni critère, ni interdit d'exécuter.

**Prompt réécrit.**

```
Contexte : session du pilot digit-ai-factory. Skill visé : oeil-critique 1.2.0 de forge-agents.

ÉTAPE 0 — Remesurer avant d'agir. Pour chacun des 5 sujets ci-dessous, rejoue la mesure, note la
commande, l'heure et le résultat. Un sujet infirmé est dit tel, sans action.
  1. Le relevé du code non appelé (scripts/relever-appelants.mjs, repris par sources.mjs existant)
     ne cherche que les « contrôles » et dans le seul pilot.
  2. Il compte les copies de travail .claude/worktrees comme appelants (911 contrôles et 0 sans
     appelant avec elles, 102 et 2 sans elles, mesure du 29/10/2026).
  3. Les 13 forges ne sont relues par aucun relevé du skill.
  4. La vitesse de réponse demandée le 21/10/2026 n'a pas d'indicateur.
  5. Des restes s'accumulent : items en cours ou décidés sans mouvement, copies de travail et
     branches déjà fusionnées.

ÉTAPE 1 — Une action par sujet confirmé : quoi, dans quel fichier et quel dépôt, la barrière qui
l'empêche de revenir (script, contrôle, défaut ; jamais un texte seul), l'effort en complexité ×
durée, et son classement automatique ou majeur selon l'étape 4 du SKILL.md d'oeil-critique.
Distingue ce qui se corrige à la source (un script du pilot) de ce qui entre dans le skill.
Considère aussi une suppression pour chaque sujet.

ÉTAPE 2 — Élargir. Passe en revue au moins 6 périmètres hors des 5 sujets, et pour chacun dis s'il
doit entrer dans l'œil critique, avec une mesure à l'appui : produits (lots jamais parvenus,
héritage), avertissements d'ouverture qui reviennent, interventions laissées à l'humain (demande
du 17/09/2026), coût et durée des tours, couverture de l'autre poste, versions livrées et skills
installés, commandes prescrites qui ne résolvent nulle part. Au plus 2 sujets sur 10 portent sur le
code mort.

INTERDITS : n'exécute aucune action, ne supprime rien, ne relance aucun hook ; lecture seule hors
du livrable. Aucun nom réel de produit ou de client : le pilot est public.

LIVRABLE : une fiche au format E-16 de references/ECRITURE.md, nommée selon R-4 et R-25 :
output/03-etudes/Digit-AI - Fiche - <objet> - AAAAMMJJ<indice>.md, indice alloué par
scripts/allouer-indice.mjs. Au plus 5 préconisations ; les sujets écartés vont dans « Rien à faire »
avec leur motif.

CONTRAT DE SORTIE, à vérifier avant remise :
- chaque sujet de l'étape 0 porte sa commande, son heure et son verdict ;
- chaque action nomme un fichier, une barrière et un classement ;
- au moins 6 périmètres examinés, au plus 2 sujets sur 10 sur le code mort ;
- tout chiffre porte sa source ;
- node oracles/oracle-ecriture.mjs <fiche> rend PASS.
```

**Contrat de sortie, en clair.** Les 5 critères ci-dessus, embarqués dans le prompt.

**Protocole de tests du livrable.** Le livrable est un document texte. Il est jugé par
`oracle-ecriture` et par une relecture des 5 critères du contrat. Jeu d'essai : un sujet infirmé à
l'étape 0, qui doit sortir sans action ; une copie verrouillée, qui ne doit jamais être proposée à
la suppression. Boucle bornée à 3 passes, puis remise avec les écarts restants.

Comment lire le changelog : une modification par ligne, rattachée au défaut qu'elle ferme.

| Modification | Défaut fermé |
|---|---|
| Étape 0 de remesure, sujet infirmé sans action | Ch3 #1, Ch5 #1 |
| « n'exécute aucune action, ne supprime rien » | Ch3 #2, Ch5 #2 |
| Skill nommé ; source et skill distingués | Ch3 #3, Ch5 #4 |
| 6 périmètres nommés, plafond de 2 sur 10 | Ch3 #4, Ch5 #3 |
| Fiche E-16 nommée selon R-4 et R-25 | Ch3 #5 |
| Contrat de sortie et oracle | Ch3 #6, Ch5 #5 |
| Les 5 sujets recopiés dans le prompt | Ch3 #7 |

**Écarts à la lettre.** Comment lire : une ligne par écart, ce que vous avez écrit, ce que je
propose, pourquoi. Tous sont des manières d'exécuter ; aucun contenu visible n'est ajouté.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « Reprends les éléments cités » | les remesurer d'abord, et abandonner un sujet infirmé | 2 sujets sur 5 sont faux ou partiels |
| « actions à mettre en oeuvre pour les traiter » | les identifier sans les exécuter | 2 copies de travail servent à un agent actif |
| « élargis le périmètre » | au moins 6 périmètres nommés | l'exemple a déjà borné une étude, le 20/10 |
| aucun livrable | une fiche E-16 | une explication se livre dans une fiche |

## 3. Décisions attendues

> **D-96 — Faut-il exécuter le prompt réécrit de la revue L99 20261029d sur le code mort et les sujets de l'œil critique ?**
> - **De quoi s'agit-il** : le prompt réécrit ci-dessus, qui produit une fiche d'actions sans rien exécuter.
> - **Le problème** : 2 des 5 sujets sont mal posés, et l'élargissement n'a aujourd'hui ni axes ni borne.
> - **Pourquoi vous** : c'est votre demande ; l'exécuter tel quel ou la restreindre est un arbitrage de périmètre.
> - **Recommandation : (a)** — elle tient vos 2 demandes, remesure les sujets et n'exécute rien. Source consultée : cette revue.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Exécuter le prompt réécrit | Remesure des 5 sujets, actions, élargissement sur 6 périmètres au moins, fiche jugée | moyen × moyen | aucune écriture hors de la fiche |
| (b) Les 5 sujets seuls | Remesure et actions, sans élargissement | simple × court | aucune écriture hors de la fiche |
| (c) Rien | Les sujets restent dans la réponse de ce soir | aucun | sans objet |

> **Sans réponse** : rien n'est exécuté.
