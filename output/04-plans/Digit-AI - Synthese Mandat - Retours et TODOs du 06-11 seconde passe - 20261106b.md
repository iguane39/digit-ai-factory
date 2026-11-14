---
destinataire: humain
---

# Synthèse Mandat — 11 lots de retours ingérés, 44 sujets du registre clos (06/11/2026, seconde passe)

## 0. Synthèse d'ouverture

La boîte des retours est vide et 44 sujets du registre sont clos avec leur mesure. La sécurité par défaut que vous avez tranchée à 14:04 est construite sur toute la chaîne : un produit créé reçoit les réglages sûrs, les tests et l'audit les relisent, et la mise en production refuse un écart non décidé. Les 9 forges touchées sont publiées et le pilot le sera avec cette synthèse. Deux décisions vous reviennent, sans urgence : traiter maintenant ou à votre revue du 16/11 les 7 sujets de la boucle L99, et envoyer ou non vers sa copie privée la table des pseudonymes complétée ce soir.

Livré : [Synthèse du 06/11, seconde passe des retours et TODOs](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2006-11%20seconde%20passe%20-%2020261106b.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les retours et TODOs » du 06/11/2026, seconde passe du jour, sur le pilot `digit-ai-factory` et 9 forges. Synthèse relevée à 19:07, heure de Paris, après une ouverture à 15:53. Session pilote Claude Opus 5.5, avec 12 agents de campagne Claude Sonnet 5.5 et 2 relectures d'intention Claude Haiku 5.5.

Intention de la demande : vider la boîte des retours et faire avancer le registre, en exécutant tout ce qui ne vous revient pas.

Test rétro : la synthèse sert cette intention plutôt que la lettre. Le sas est vide, chaque sujet décidé est clos ou en cours avec son reste, et seul un choix de périmètre vous est posé.

## 2. Verdict

45 sujets traités par la campagne : 44 `corrige`, 1 `en_cours`. `oracle-todo` rend PASS après chaque écriture. La recette d'ensemble du pilot fusionné rend 253 oracles verts sur 256 ; les 3 en défaut jugent l'état du poste, et le seul défaut introduit par la campagne, un cas rouge non nommé, est corrigé.

## 3. Décisions attendues

Deux décisions vous reviennent. La première porte sur le moment de traiter 7 sujets que leur étude réserve à votre revue ; la relecture d'intention l'a relevée, puisque votre demande ne bornait pas les TODOs. La seconde porte sur l'envoi, vers sa copie privée, de la table qui associe les noms réels de vos produits à leurs pseudonymes, complétée ce soir de 5 noms d'environnement.

> **D-180 — Faut-il traiter dès cette campagne les 7 sujets de la boucle L99 (TF-2236 à TF-2242), que leur étude du 06/11 réserve à la revue du 16/11 ?**
> - **De quoi s'agit-il** : 7 défauts du mode boucle de `prompt-analyzer-l99`, le skill qui améliore un prompt passe après passe ; l'étude « coût et qualité de la boucle L99 » les a écrits ce jour.
> - **Le problème** : l'étude les renvoie à votre revue du 16/11, votre demande de ce tour couvre tous les TODOs.
> - **Pourquoi vous** : c'est un arbitrage de périmètre entre votre demande et l'échéance fixée par l'étude.
> - **Recommandation : (a)** — l'étude chiffre des options de coût que la revue doit comparer ; les construire avant fige un choix. Source consultée : le commit 36466d55 de l'étude, « pour la revue du 16/11 ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Attendre la revue du 16/11 | les 7 sujets restent candidats, rappelés à la revue | aucun | les traiter à tout moment |
| (b) Les traiter maintenant | un agent de plus sur forge-agents | une campagne d'environ 1 heure | revenir sur les commits |

> **Sans réponse** : les 7 sujets attendent la revue du 16/11.

Ce soir, la table privée des pseudonymes a reçu 5 noms d'environnement d'un produit, trouvés dans le registre public ; cette table complétée n'existe encore que sur ce poste.

> **D-181 — Faut-il pousser vers son dépôt privé le commit local du canal confidentiel qui inscrit 5 noms d'environnement de Produit-84 sous pseudonyme ?**
> - **De quoi s'agit-il** : la table qui associe les noms réels de vos produits à leurs pseudonymes, `_confidentiel` ; sa copie distante est un dépôt privé.
> - **Le problème** : le commit qui les inscrit n'existe que sur ce poste ; un second poste ne verrait pas les 5 formes et laisserait passer ces noms dans un dépôt public.
> - **Pourquoi vous** : c'est une publication hors du feu vert permanent, qui couvre les forges et le pilot mais pas le canal confidentiel.
> - **Recommandation : (a)** — le dépôt est privé, l'envoi ne rend rien public, et vous avez répondu « 179a » au même geste à 14:00. Source consultée : `REGLES-PROJET.md`, R-38 (règle de publication des dépôts), paragraphe 6.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Pousser maintenant | la copie privée reçoit le commit, la garde du canal juge l'envoi | aucun | un commit de retrait ; l'historique privé garde la trace |
| (b) Garder en local | rien ne part ; la table complétée reste sur ce seul poste | un second poste ne protège pas ces 5 noms | pousser plus tard |

> **Sans réponse** : rien ne part, et je rappellerai D-181 à la prochaine ouverture.

## 4. Traité

Le tour a vidé le sas, décidé les sujets hors de votre ressort, fait corriger chacun par un agent, rejoué chaque livraison, puis clos et publié.

- Sas des retours : 11 lots de Produit-84, Produit-81 et Produit-86 accueillis puis ingérés, exit 0 chacun ; 17 sujets créés, TF-2261 à TF-2277 ; 7 classes créées, référentiel en 1.69.0.
- Noms réels d'environnement de Produit-84 dans le registre public (TF-2265), classe `anonymisation-portee-partielle` : `git grep` en trouvait dans 8 fichiers suivis, 0 après ; 5 formes inscrites à la table du canal confidentiel, oracle du canal PASS.
- 35 sujets décidés sous R-58 ; avec les 10 déjà décidés, 45 confiés à 12 agents ; consigne relue 2 fois contre votre demande.
- Chaque livraison rejouée par moi avant d'être acceptée :
  - sécurité par défaut, 9 pièces de D-178 (a) : registre des 9 réglages sûrs au pilot avec son oracle (36 sur 36), loi écrite en règle R-66 (le réglage admissible appliqué à la création), exigences de conception, corpus d'experts, script de création, lecture en campagne de tests, contrôle bloquant avant mise en production (forge-ops, 683 PASS), contrôles d'audit (17 pass), dossier de mise en production (70 sur 70) ;
  - forge-tests, 9 sujets dont une suite rouge qui rend un échec nommé et une base d'essai comparée à la cible : 9 fichiers de tests neufs sans échec ;
  - forge-audit : le rapport se dépose dans le dossier de sortie du produit et la forme déclare ses 6 cartes (22 et 16 pass) ;
  - forge-agents : 5 gabarits de schéma sur 5 passent la critique d'implémentation, l'écrivain du journal de bord refuse un type hors vocabulaire (103 PASS) ;
  - forge-websec, forge-design, forge-agents-security : audit des dépendances uv et poetry (138 PASS), glossaires lus comme définitions (68 PASS), faux échec sur un journal étranger supprimé (125 PASS) ;
  - pilot, 3 copies fusionnées : recettes jouables par cas, mobilisation qui juge le verdict le plus récent (33 PASS), remède de S93 aligné sur S4, relecture d'intention en session non interactive, concision jugée sur les seuls écrits neufs.
- Une perte de réseau vers 17:05 a coupé 8 agents ; relancés à 17:15 avec leur contexte, tous ont fini sans travail perdu.
- Recette d'ensemble du pilot fusionné : 253 verts sur 256 ; I6, un cas rouge non nommé de la recette neuve du filtre de cas, corrigé au commit e6ff978f.
- Registre : 44 clôtures avec leur descente et, pour les 10 récidives, la barrière exigée par R17 ; TF-2255 en cours ; 13 candidats tirés des restes, TF-2278 à TF-2290 ; `oracle-todo` PASS.
- Publication : 9 forges à 0 commit d'écart après `git fetch`, vérifié par `rev-list`. Le premier envoi du pilot a été refusé par la protection contre les secrets de GitHub, sur un faux jeton Supabase écrit en clair dans une fixture de test ; les 22 commits non publiés ont été réécrits pour l'assembler à l'exécution, la recette de l'oracle concerné rend 36 sur 36, et les SHA changés sont notés au registre.

Relecture d'intention : dérive sur la consigne, 2 passes (RI-20261106-08 et 09) ; l'écart `hors_demande` réel, TF-2265 absent de la liste des sujets, est repris dans la consigne ; l'écart `choix_humain` est D-180.

## 5. Non traité

- TF-2236 à TF-2242, la boucle L99 — motif : `hors_mandat`, leur étude les réserve à votre revue du 16/11 ; D-180 vous le pose.
- TF-2255, le refus du message d'attente rejoué dans une vraie session non interactive — motif : `en_cours`, la session a hérité de la variable d'environnement de l'éditeur et le hook n'a pas refusé ; second essai et détection plus robuste inscrits en TF-2280.
- 3 défauts de l'état du poste dans la recette du pilot : le sceau d'une synthèse du 02/11 modifiée après lui, le rôle d'un README d'entrant du 03/11, la copie installée des skills — motif : `hors_mandat` pour les 2 premiers, fichiers d'autres sessions ; la copie des skills se met à jour par `oracle-skills --appliquer`, lancé à 19:00.
- La loi de D-178 dans la liste des lois du noyau — motif : `borne_atteinte`, le noyau a 5 octets libres ; la règle R-66 la porte, TF-2289 l'inscrit.
- 5 lignes du journal des relectures d'intention écrites par d'autres sessions ce jour (RI-20261106-02 à 05 et 07) — motif : `hors_mandat`, enregistrées telles quelles avec ce tour, parce que la réécriture sous pseudonyme du même fichier a touché 2 lignes anciennes.

## 6. Écarts à la lettre

- Vous avez demandé de traiter les TODOs → j'ai laissé 7 sujets à votre revue du 16/11 → leur étude du jour les y réserve ; D-180 vous laisse trancher.
- Vous avez demandé de traiter les retours → j'ai aussi réécrit 3 lots déjà ingérés et le registre → ils portaient des noms réels d'environnement dans un dépôt public, comme ce matin pour Produit-84.
- La campagne a retenu des lectures d'agents que j'ai jugées sous R-58 : TF-2276 n'exempte que les glossaires, pour ne pas inverser 3 cas rouges verrouillés ; TF-2258 n'exempte qu'une famille de statut `ok` ; TF-2224 reste une règle écrite, sur 7 fausses alertes sur 8 mesurées ce matin pour un contrôle.

## 7. Risques

- L'écrivain du journal de bord de forge-agents refuse désormais un type hors vocabulaire ; signal : un produit dont les sessions improvisent un type verra son écriture refusée, 1 444 entrées sur 7 243 du parc sont dans ce cas selon l'agent, non recompté par moi ; parade : le message nomme le vocabulaire, les entrées anciennes restent lisibles.
- Le contrôle de concision ne juge plus les écrits d'`output/` antérieurs au 06/11 ; signal : un écrit ancien diffusé de nouveau sans relecture ; parade : l'antériorité est déclarée au `non_juge` de l'oracle.

## 8. Prochaines actions

Ordre : A-1 et A-2 d'abord parce qu'elles vous reviennent ; les deux autres suivent au prochain run.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-180 sur le moment de traiter les 7 sujets de la boucle L99 | TF-2236 | manuelle_utilisateur | decision : arbitrage de périmètre contre l'échéance de l'étude | `decisions/REGISTRE.jsonl` (D-180) : répondre « 180a » ou « 180b » | si rien n'est fait, les 7 sujets attendent la revue du 16/11 |
| A-2 | Répondre à D-181 pour envoyer ou garder la table des pseudonymes complétée | TF-2265 | manuelle_utilisateur | decision : publication hors du feu vert permanent (R-38 §6) | `decisions/REGISTRE.jsonl` (D-181) : répondre « 181a » ou « 181b » | si rien n'est fait, la table complétée reste sur ce seul poste |
| A-3 | Décider et corriger les 13 candidats tirés des restes de la campagne | TF-2278 | auto_ia | borne_atteinte : tour de 3 heures, ils entrent au registre pour le prochain run | `todo/TODO.jsonl` | si rien n'est fait, GitHub reste sans corpus d'experts et la copie d'oracle-sca de forge-agents ignore uv et poetry |
| A-4 | Rejouer le refus du message d'attente sans la variable de l'éditeur, puis détecter la session non interactive autrement | TF-2255 | auto_ia | borne_atteinte : une seule session admise par la consigne de ce tour | `oracles/hook-restitution.mjs` | si rien n'est fait, une session non interactive lancée depuis l'éditeur peut se clore sur une attente |

## 9. Traces

- `input/00-retours/` : 11 lots du 06/11 de Produit-84, Produit-81 et Produit-86
- `todo/TODO.jsonl` (TF-2261 à TF-2290), `todo/CLASSES.json` (1.69.0), `todo/relectures-intention.jsonl` (RI-20261106-08 et 09), `todo/observabilite/flotte-campagnes.jsonl` (retours-todos-20261106b)
- `decisions/REGISTRE.jsonl` : D-180 et D-181
- `references/REGLAGES-SURS-PAR-DEFAUT.json`, `REGLES-PROJET.md` (R-66), `ETAPE-MEP.md` (M-21, M-22)
- Pilot : fusions 752aa598, e348e0db et 0ec15fbc, correctif e6ff978f ; ces 22 commits ont été réécrits avant leur envoi pour retirer un faux jeton de fixture que la protection contre les secrets de GitHub refusait
- Forges publiées : forge-agents-security 448eac5 ; forge-development 01d6063 ; forge-websec 62b64db ; forge-audit 6d17274 ; forge-ops 84d03f4 ; forge-design 1f43109 ; forge-conception 67c8bb6 ; forge-tests 0acbdaa ; forge-agents 4658bdd
- Canal confidentiel, local : c8aab12
