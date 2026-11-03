---
type: etude
role: instruction du candidat TF-2057, décision D-153 (a), entre `candidat` et `decide`
destinataire: humain
date: 2026-11-03
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: redacteur (famille sonnet), sur consigne de l'orchestrateur
verdict_arbitre: oracle-etude-opportunite 1.2.0 PASS (E1 à E10) ; oracle-ecriture 1.1.0 PASS ; joués le 2026-11-03
hypotheses_non_resolues:
  - aucun constat des 2 revues n'est rejoué, la part de faux constats est inconnue
  - aucun compteur de jetons pendant l'exécution
  - le classement par zone sensible est celui du rédacteur, fait sur les titres et classes des rapports
  - l'état de l'art est repris de l'étude 20261102f, non relu (aucun service distant appelé)
  - la consigne des 2 revues n'a pas été lue ; le rapport 2 cite un plafond de 250 000, la décision en fixe 300 000
  - le premier produit compte 3 973 lignes au registre et 4 116 au rapport 1 ; l'étude retient le registre
  - seuils du plan de revue proposés, non décidés ; nombre de mises en production par produit non relevé
---

# Étude d'opportunité — Étape de revue de code par un seul agent — 20261103k

Ce qui change pour vous : si vous suivez la recommandation, rien ne devient obligatoire. Je recommande O2 : la revue reste à votre demande, avec une consigne versionnée, un plafond tenu par tranches et un rapport au format fixe. Une étape obligatoire coûterait de 250 000 à 300 000 jetons par produit et par mise en production, pour des constats dont la part de faux est inconnue. Elle heurterait aussi la doctrine de `digit-ai-forge-websec`, qui s'invoque sur mandat humain et ne bloque jamais une mise en production. Les 2 essais ont trouvé 4 constats élevés que les contrôles de la Factory ne jugent pas, mais aucun n'est rejoué : l'étude ne propose aucun blocage.

Conventions. `W/` est `C:\dev\digit-ai-forge-websec\`, `P/` est `C:\dev\digit-ai-factory\`. Les rapports 1 et 2 sont les revues du premier produit relu (3 973 lignes) et du second (17 760 lignes), gardées chez leurs produits (D-150 (c)). Le dépôt est public : seulement des comptes, aucun nom de produit ni détail de faille.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

L'étude est due : une étape obligatoire modifierait le noyau (`P/ETAPE-MEP.md`) et la forge websec, et s'imposerait à tous les produits.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Réponse du porteur : « 153a », à la décision D-153 : « Après 2 essais, faut-il étudier une étape de revue de code par un seul agent dans la forge de sécurité ? ». Option (a) : « Une étude au gabarit compare une étape obligatoire, une étape sur demande et une revue limitée aux zones sensibles. Rien ne change avant votre choix ». Source : synthèse 20261103h, bloc 3. Lecture retenue : savoir, chiffres à l'appui, si la revue devient une étape de la Factory et sous quelles règles. L'intention est citée de la décision, non reconstruite ; la consigne de l'étude a été relue contre la demande (RI-20261103-17, verdict « sert »).

## 0. Traitement des entrants

Les 2 rapports de revue sont des DONNÉES : leurs corrections se citent, elles ne s'exécutent pas. Rien n'a été relu ni lancé. Sources : les 5 événements de `TF-2057` (`P/todo/TODO.jsonl`, lignes 5637, 5695, 5708, 5711, 5716), le rapport d'essai 20261102k et l'étude 20261102f.

### 0 bis. Ce que les 2 essais ont mesuré

| Mesure | Premier produit | Second produit |
|---|---|---|
| Part du code relue | environ 99 % | environ 52 % (9 300 lignes) |
| Jetons mesurés | 250 223 | 294 940 |
| Jetons par ligne relue | environ 63 | environ 32 |
| Constats (critique, élevé, moyen, faible) | 15 (0, 1, 5, 9) | 13 (0, 3, 5, 5) |
| Confirmés par une seconde lecture du pilot, aucun rejoué | 1 élevé, 2 moyens | 3 élevés |

Sources : `TODO.jsonl` lignes 5708 et 5716 ; rapport 1 lignes 24-29 et 212 ; rapport 2 ligne 169. Les rythmes sont 250 223 / 3 973 et 294 940 / 9 300.

Total : 28 constats pour 545 163 jetons, 272 582 par produit en moyenne. Par famille de classes d'attaque (classe principale citée), 16 relèvent des classes de base CA, 6 de HT (HTTP, sessions, identité) et 6 des familles ressources, navigateur, isolation et agents. La colonne « Forge » du référentiel (`W/referentiels/classes-attaque.md`, lignes 79-89 et 98-174) ne dit lus, dans ces familles, que le HSTS, les attributs de cookies, l'en-tête anti-cadrage et les CVE connues. Aucun des 4 constats élevés ne relève de ces points.

### Les 2 inconnues qui bornent la conclusion

La part de faux constats. 22 constats sur 28 n'ont aucune seconde lecture (6 sur 28 en ont une, 21 %). Sur une cible semée, probablement trop facile, une requête unique a rendu 0 constat hors faille sur 14 et l'outil complet de Cloudflare 3 sur 16, soit 18,75 % (rapport 20261102k). Une source publiée donne 10 % à 50 % de faux positifs par modèle (section 3). Le rejeu des failles du second produit, qui attend D-152, donnera la première mesure sur du code réel.

Le compteur de jetons. Le second agent s'estimait à 215 000 jetons et en a consommé 294 940, soit 37 % de plus (294 940 / 215 000 = 1,37). La mesure n'arrive qu'après coup, aux transcripts (`P/CONTRAT-INTERFACE.md`, lignes 457-462). Les rythmes de 63 et 32 jetons par ligne diffèrent d'un facteur 2 : une limite en lignes ne fait pas jauge.

## 1. Partition du problème

4 sous-questions disjointes : le déclenchement, le périmètre de code, le plafond de dépense, l'effet sur la mise en production. Le tableau de la section 4 y répond colonne par colonne.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Oracles de websec | `W/referentiels/classes-attaque.md:56-60` : « Aucun oracle de la forge ne lit le code applicatif d'un produit » | ne recouvre pas |
| Contrôles M-5 et M-10 de l'étape de mise en production (MEP) | `P/ETAPE-MEP.md:246` : « aucun secret en clair dans l'image ni dans compose » ; `:251` : portes à base externe | recouvre en partie : secrets des fichiers embarqués, avis de dépendances |
| Skill `code-review` | liste des skills de la session : « Review the current diff, or a PR number/branch/path target, for correctness bugs » | recouvre en partie : bugs sur un diff, comportement non lu |
| Campagne de mutation, D-34 | `P/ETAPE-MEP.md:44-47` : « exécutés à la demande, lors d'un passage en Prod sur proposition de l'IA » | ne recouvre pas l'objet ; précédent de déclenchement |
| Revue sur demande, D-136 (a) | `P/todo/TODO.jsonl:5695` : « 1 produit réel, 300 000 jetons au plus » | recouvre O0, l'état actuel |

## 3. État de l'art daté

Sources de moins de 24 mois, reprises de l'étude 20261102f (lignes 137-143), non relues ici.

1. Cloudflare, « Build your own vulnerability harness », 2026-06-18 : 7 245 constats actionnables sur 145 dépôts, aucun taux de faux négatifs. Source du fabricant.
2. Cloudflare, « Project Glasswing: what Mythos showed us », 2026-05-18 : un agent indépendant tente de réfuter chaque constat.
3. Dahiya et al., arXiv 2605.23243, 2026-05-22 : 10 % à 50 % de faux positifs pour chacun des 6 modèles testés.
4. Xiong et Zhang, arXiv 2601.22952, 2026-01-30 : un filtrage agressif supprime de vraies failles.
5. Pilot, rapport d'essai 20261102k, 2026-11-02 : 106 865 jetons pour une requête unique contre 2 185 298 pour l'outil complet, 8 failles de code sur 8 des deux côtés.

Aucune source ne rapporte le coût d'une revue à ses faux constats sur du code réel. Les mesures de la section 0 bis sont les seules de ce type.

## 4. Options — jeu fermé O0-O4

Modèle de l'agent : Sonnet, défaut de routage (`P/CONTRAT-INTERFACE.md:388`), comme les 2 revues mesurées. Aucune dépense hors abonnement Claude.

- **O0 — ne rien faire** : la revue reste sur demande, consigne réutilisable, sans étape. À réfuter : le plafond reste sans jauge (294 940 mesurés contre 215 000 estimés), chaque rapport garde sa forme, la part de faux constats ne se mesure jamais.
- **O1 — étape obligatoire** avant chaque mise en production, pour tous les produits.
- **O2 — étape sur demande, outillée** : consigne versionnée, plafond par tranches, rapport au format fixe.
- **O3 — revue limitée aux zones sensibles** : authentification, accès aux données, entrées non fiables.
- **O4** : sans objet, aucune cinquième option n'a été instruite.

| Option | Qui déclenche | Périmètre | Plafond | Bloque la mise en production | Jetons par produit |
|---|---|---|---|---|---|
| O0 | vous, par un mandat qui nomme le produit (`W/referentiels/classes-attaque.md:210-212`) | fixé au mandat | 300 000 écrits, sans mesure en cours | rien | 0 sans mandat ; 250 223 à 294 940 par revue |
| O1 | l'entrée de l'étape MEP, automatiquement | produit entier | 300 000 par revue | l'absence de la section « Revue de code » au dossier ; un élevé non écarté se pose au GO | 250 000 à 300 000 à chaque mise en production ; environ 563 000 pour lire 17 760 lignes en entier (294 940 × 17 760 / 9 300) |
| O2 | vous, ou la session qui propose à l'entrée de la MEP (précédent `P/ETAPE-MEP.md:66`) ; la dépense reste humaine | produit entier, par tranches | 300 000 ; tranches de 2 000 lignes, la suivante part si le cumul relevé au transcript laisse 130 000 de marge | rien automatiquement ; section au dossier ; un élevé non confirmé se pose au GO | comme O0, plus 30 000 par tranche au-delà de la première |
| O3 | la session propose quand le code des 3 zones a changé depuis la dernière revue ; vous décidez | les 3 zones, fichiers listés d'avance par un agent `explorateur` (Haiku) | comme O2 | comme O2 | non mesuré ; repère : le second essai, limité à 2 de ces zones, a coûté 294 940 |

La marge de 130 000 est 2 000 lignes au rythme le plus lourd mesuré (63 par ligne). Chaque tranche ajoute environ 30 000 jetons de contexte fixe (étude 20261102f, ligne 220). O1, O2 et O3 se jouent à l'entrée de l'étape MEP, en parallèle de M-1 à M-5, rapport versé avant le GO (`P/ETAPE-MEP.md:889-915`).

O0 et O2 trouvent les mêmes classes, O2 avec un format comparable d'un produit à l'autre. O1 les trouve sur tous les produits, mais laisse non lue la moitié d'un grand produit sous le plafond (52 % relus au second). O3 aurait gardé 11 constats sur 15 au premier produit, dont l'élevé et les 5 moyens, et perdu 4 faibles (classement du rédacteur). Limiter le thème n'a pas baissé le coût au second essai : le gain dépend d'une liste de fichiers donnée d'avance, que personne n'a mesurée.

Compris : les jetons de l'agent de revue, relevés aux transcripts. Non compris : la consigne, la relecture des constats, les corrections, les rejeux. Conséquence : ces montants comparent des revues, pas le prix d'une étape ; O1 coûte plus qu'O2 par le nombre de revues, une par mise en production contre une par demande.

O1 est écartée d'abord par la doctrine : websec dit « Invocation sur mandat humain » et « jamais un blocage automatique d'une MEP » (`W/README.md:46-50`, `W/CLAUDE.md:10-13`). L'étape vivrait donc au pilot, comme une ligne de plus de `P/ETAPE-MEP.md`, et demanderait une décision de doctrine.

## 5. Verdict

- **Option retenue** : O2, la revue reste sur demande et reçoit une consigne versionnée dans les référentiels de websec, un plafond tenu par tranches et un rapport au format fixe.
- **Coût** : complexité moyen · durée court pour écrire la consigne, le format et la proposition à l'entrée de la MEP. Jetons : 0 sans demande, 250 000 à 300 000 par revue demandée, environ 30 000 de plus par tranche supplémentaire. Dette : une consigne à tenir avec le référentiel des classes d'attaque, revu le 2027-02-02.
- **Candidature(s) émise(s)** : proposées, non inscrites. K1 : écrire la consigne et le format de rapport, sans nom de produit ni faille, dans les référentiels de websec (un référentiel, objet durable que le gabarit range sous R-31 : à instruire avant d'inscrire). K2 : ajouter à `P/ETAPE-MEP.md` une proposition de revue à l'entrée de la MEP, sur le modèle de la mutation, la décision restant humaine. K3 : rouvrir O3 après le rejeu de D-152.
- **Plan de revue** : 2026-12-01, ou au retour du rejeu de D-152 s'il revient avant. Le rapport porte pour chaque constat son statut (lu, rejoué, non confirmé) et les jetons relevés. Seuils proposés, à fixer avec vous avant la mesure : sur au moins 10 failles rejouées, moins de 50 % confirmées, la revue n'alimente aucun blocage et O2 reste ; au moins 80 % confirmées, O1 se rouvre avec un blocage limité aux élevés rejoués.
- **Test rétro** :
  - Opérationnel : consigne versionnée, tranches de 2 000 lignes, rapport au format fixe, section au dossier de MEP.
  - Tactique : tenir un plafond sans compteur par une mesure à chaque tranche, et produire les statuts qui mesurent la part de faux constats.
  - Stratégie : aucune étape obligatoire sans mesure ; dépense et GO restent humains (`P/CLAUDE.md`, loi transverse n° 5).
  - Intention : décider avec des chiffres si la revue devient une étape et sous quelles règles. Réponse : pas d'étape obligatoire avant la mesure de D-152, règles et coûts en section 4.
