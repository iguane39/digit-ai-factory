---
destinataire: humain
---

# Synthèse Mandat — 12 lots de retours ingérés, 34 sujets du registre clos (06/11/2026)

## 0. Synthèse d'ouverture

La boîte des retours est vide, et 34 sujets du registre sont clos avec leur mesure ; 3 restent en cours avec leur reste écrit. Les produits recevront à leur prochaine ouverture une préproduction locale qui se redéploie sans attendre votre feu vert, un ledger qui accepte une décision prise hors run, et des tests de bout en bout qui ne peuvent plus passer sans rien vérifier. Les 5 forges touchées et le pilot sont publiés. Une décision vous revient : publier ou non la copie privée du canal confidentiel.

Livré : [Synthèse du 06/11, retours et TODOs](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2006-11%20-%2020261106a.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les retours et TODOs » du 06/11/2026, sur le pilot `digit-ai-factory` et 5 forges. Synthèse relevée à 14:12, heure de Paris, après une ouverture à 09:13. Session pilote Claude Opus 5.5, avec 8 agents de campagne Claude Sonnet 5.5 et 2 relectures d'intention.

Intention de la demande : vider la boîte des retours et faire avancer le registre, en exécutant tout ce qui ne vous revient pas.

Test rétro : la synthèse sert cette intention. Le sas est vide, chaque sujet décidé est clos ou en cours avec son reste, et seule une publication vous est posée.

## 2. Verdict

37 sujets traités par la campagne : 34 `corrige`, 3 `en_cours`. `oracle-todo` rend PASS après chaque écriture. La recette d'ensemble du pilot rend 251 oracles verts sur 253 ; les 2 en défaut jugent l'état du poste et existaient avant la campagne.

## 3. Décisions attendues

Une seule décision vous revient : envoyer, ou non, vers sa copie privée sur GitHub la table qui associe les noms réels de vos produits à leurs pseudonymes. Elle a changé ce matin, quand un lot de retours a présenté une écriture nouvelle du nom d'un produit déjà connu.

> **D-179 — Faut-il pousser vers son dépôt privé les 4 commits locaux du canal confidentiel, dont la graphie rattachée ce matin à Produit-81 et sa borne du 07/11 ?**
> - **De quoi s'agit-il** : le canal confidentiel tient la table des pseudonymes qui protège les noms réels de vos produits, `_confidentiel` ; sa copie distante est un dépôt privé, mesuré `PRIVATE` à 14:12.
> - **Le problème** : 4 commits n'existent que sur ce poste, 2 des sessions du 03/11 et 2 de ce jour ; une perte du poste les perdrait, et un second poste ne verrait pas la graphie rattachée.
> - **Pourquoi vous** : la règle de publication donne un feu vert permanent aux forges et au pilot, pas au canal confidentiel, qui se publie sur votre accord à chaque envoi.
> - **Recommandation : (a)** — le dépôt est privé, l'envoi ne rend rien public, et la table est la seule copie des noms. Source consultée : `REGLES-PROJET.md`, R-38 §6 (règle de publication des dépôts).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Pousser maintenant | la copie privée reçoit les 4 commits, la garde du canal juge l'envoi | aucun | un commit de retrait ; l'historique privé garde la trace |
| (b) Garder en local | rien ne part ; la table reste sur ce seul poste | risque de perte, et un second poste refuserait la graphie | pousser plus tard |

> **Sans réponse** : rien ne part, et je rappellerai D-179 à la prochaine ouverture.

## 4. Traité

Le tour a vidé le sas, décidé et corrigé les sujets, puis publié forges et pilot.

- Sas des retours : 12 lots accueillis puis ingérés, exit 0 chacun ; 36 sujets créés, de TF-2188 à TF-2223 ; 13 classes de défaut créées, référentiel en 1.68.0.
- Graphie inconnue d'un lot : rattachée à Produit-81, oracle du canal confidentiel PASS ; 0 occurrence restante dans les fichiers suivis du pilot.
- Votre consigne sur la préproduction locale (TF-2218) : elle se redéploie sans feu vert quand la demande en dépend, le GO reste dû pour la production ; recette du gabarit produit 22/22.
- Campagne de 8 agents, chaque livraison rejouée par moi avant publication :
  - forge-agents-security : un oracle refuse un job démarré après l'arrêt d'urgence de sa mission ; self-test 120 PASS, 0 FAIL ;
  - forge-ops : la version servie se lit sur l'instance, un composant absent de l'inventaire refuse « prêt » ; self-test 566 PASS, 0 FAIL ;
  - forge-design : 3 faux constats supprimés, dont la visite guidée lue au rendu ; « Tout vert — 71 oracles, 169 règles verrouillées » ;
  - forge-tests : un test qui ne vérifie rien, une route 404 attendue et une garde sans contre-épreuve sont désormais vus ; pytest exit 0 ;
  - forge-agents : filtres de tableau, rendu des panneaux fermés, boucle L99 ; quality-oracles PASS sur 598 contrôles, socle des pages 808 cas sur 808 ;
  - pilot, en 3 copies : restitution, mobilisation et gabarits produits ; recette d'ensemble 251 sur 253, 240 recettes vertes qui jouent un cas rouge.
- Deux restes du pilot corrigés par moi, chacun rouge sur l'ancien code puis vert : la déclaration du profil garde les contrôles du produit (30 sur 30), et une décision réservée hors run passe l'affichage (hook 68 sur 68).
- Registre : 34 clôtures avec leur descente et, pour les 20 récidives, la barrière exigée par R17 ; 3 sujets en cours ; 18 candidats tirés des restes, de TF-2243 à TF-2260 ; `oracle-todo` PASS.
- Publication : 5 forges et le pilot à 0 commit d'écart après `git fetch`, vérifié par `rev-list` ; la garde du pilot rend 0 constat.
- Avant l'envoi du pilot, la garde des noms a trouvé une forme compacte du nom de Produit-84 dans un lot ingéré ce matin, classe `anonymisation-portee-partielle` : garde rouge sur 1 constat de l'arbre, puis verte à 0 constat après correction ; 0 occurrence restante toutes graphies.

Relecture d'intention : sert, avec 2 écarts mineurs, nature `choix_humain`, repris au bloc 6 (RI-20261106-06).

## 5. Non traité

- Historique publié du pilot, où la graphie rattachée ce matin reste lisible depuis le 19/08 — motif : `hors_mandat`, vos réponses D-90 (b) et D-170 (b) ont laissé l'historique tel quel.
- 2 défauts de l'état du poste dans la recette du pilot : le sceau d'une synthèse du 02/11, modifiée après lui, et le rôle d'un README d'entrant du 03/11 — motif : `hors_mandat`, fichiers d'autres sessions ; le premier se re-scelle par votre geste, le second par sa session.
- TF-2183, TF-2184 et TF-2186 — motif : `hors_mandat`, la session voisine les a corrigés et clos.
- 17 lignes du registre écrites par 2 autres sessions (TF-2225 à TF-2233, TF-2235 à TF-2242) — motif : `hors_mandat`, laissées non enregistrées avec leurs études.

## 6. Écarts à la lettre

- Vous avez demandé de traiter les retours → j'ai aussi retouché un lot déjà ingéré et rattaché une graphie à un pseudonyme → les deux protègent un nom réel dans un dépôt public, comme TF-1540 l'a fait le 17/10.
- Vous avez demandé de traiter les TODOs → j'ai laissé 3 sujets à la session voisine et l'historique tel quel → elle les corrigeait déjà, et vos réponses antérieures tranchent l'historique.
- La campagne a retenu 4 lectures d'agents que j'ai jugées sous R-58 : la première occurrence infobulée suffit (TF-2219), le seuil de moitié des cellules composites (TF-2196), l'en-tête interne exempt (TF-2189), la déclaration d'un livrable inchangé (TF-2221).

## 7. Risques

- La règle qui refuse un guide faisant écrire un secret au `.env` (S103) avertit sans bloquer ; signal : un guide de ce genre affiché malgré l'avertissement ; parade : T2 ne rend bloquante qu'une règle qui protège un verdict, et le geste `ranger-secret` reste nommé.
- La borne d'histoire de la graphie rattachée est posée au 07/11 ; signal : une occurrence du 06/11 dans l'histoire ne serait plus vue ; parade : l'arbre courant et les messages restent jugés sans borne, 0 occurrence mesurée.

## 8. Prochaines actions

Ordre : A-1 d'abord parce que seule elle vous revient ; les deux autres suivent au prochain run.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-179 pour publier ou garder la copie privée du canal confidentiel | neuve | manuelle_utilisateur | decision : publication hors du feu vert permanent (R-38 §6) | `decisions/REGISTRE.jsonl` (D-179) : répondre « 179a » ou « 179b » | si rien n'est fait, la table des noms reste sur ce seul poste |
| A-2 | Décider et corriger les 18 candidats tirés des restes de la campagne | TF-2243 | auto_ia | borne_atteinte : tour de 5 heures, ils entrent au registre pour le prochain run | `todo/TODO.jsonl` | si rien n'est fait, les portes de MEP du pilot ne lisent pas encore les contrôles neufs de forge-ops |
| A-3 | Finir les 3 sujets en cours : enchaînement de profils, adaptateur .NET, décisions du pilot | TF-2208 | auto_ia | borne_atteinte : chacun demande une construction neuve | `todo/TODO.jsonl` | si rien n'est fait, ces 3 défauts restent couverts en partie |

## 9. Traces

- `input/00-retours/` : lots Produit-84, Produit-64, Produit-86 et Produit-81 du 05/11
- `todo/TODO.jsonl` (commit e06c6726), `todo/CLASSES.json` (1.68.0), `todo/relectures-intention.jsonl` (RI-20261106-01 et RI-20261106-06), `todo/observabilite/flotte-campagnes.jsonl`
- `decisions/REGISTRE.jsonl` : D-179
- Pilot publié jusqu'à 45da1800, dont les fusions 67035127, 3ed62492, dbb64367 et 89c5e8f5
- Forges publiées : forge-agents-security 4b5a5fa ; forge-ops b58dae5 ; forge-design f6daff1 ; forge-tests f924b20 ; forge-agents afcbffc
- Canal confidentiel, local : a3d03ae et 663992a
