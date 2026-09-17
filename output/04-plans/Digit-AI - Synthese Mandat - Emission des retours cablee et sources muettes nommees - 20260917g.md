---
destinataire: humain
---

# Synthèse de mandat — votre « 3a » est exécuté : un produit doit désormais dire ce qu'il remonte en fin de tour, et le pilot nomme à chaque ouverture les sources muettes ; les 4 améliorations de l'étude sont closes, il reste à décider de l'enregistrement (17/09/2026)

Votre décision est exécutée : les 2 pièces de l'émission des retours sont construites, éprouvées et closes au registre. Ce que cela change pour vous : chez un produit, une restitution qui ne dit ni « rien à remonter » ni quel lot a été remis reçoit maintenant un avertissement, sans geste de votre part, puisque la session est déjà ouverte. Au pilot, chaque ouverture nomme les sources qui se taisent depuis plus de 7 jours : elles sont 21 aujourd'hui. Les 4 améliorations sorties de l'étude sont donc toutes livrées. Rien n'est écrit chez un produit, rien n'est supprimé, rien n'est enregistré ni publié. Ce qui est attendu de vous : dire si ces 4 tours de travail s'enregistrent, et s'ils se poussent.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 3a », c'est-à-dire l'option (a) de la décision sur l'obligation faite aux produits de dire ce qu'ils remontent : règle neuve au juge des restitutions, gabarit, rappels des hooks, ligne d'ouverture, recettes, clôture.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; une restitution d'un produit lue et jugée en lecture seule pour éprouver la règle ; aucun produit ni aucune forge écrits.
- **quand** — 2026-09-17 10:16 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 09:59 ; durée mesurée ≈ 17 min, dont 5 min de recette complète du pilot.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : recette du juge des restitutions, recettes des 2 hooks, recette du tableau de bord, recette complète du pilot, `oracle-todo` *(juge du registre)* et `oracle-synthese` sur ce document.
- **intention** — que la boucle d'amélioration tourne plus vite et vous demande moins de gestes, sans vous retirer une décision réservée. Test rétro : la règle neuve agit sans vous, à la fin d'un tour déjà ouvert, et n'automatise que l'obligation de déclarer, jamais le contenu d'un retour. Limite : elle ne produit d'effet que chez un produit où une session s'ouvre.

## 2. Verdict en une ligne

**TF-1166 clos avec sa descente, les 4 items de l'étude sont clos ; règle S48 (chez un produit, le tour dit ce qu'il remonte) au juge des restitutions, recette 28/28 PASS (27 avant) ; éprouvée sur 1 restitution réelle de produit : FAIL attendu, et sans objet sur celles du pilot ; hook d'ouverture exercé : 21 sources muettes nommées ; recettes des hooks 5/5 et 22/22, tableau de bord 9/9 ; recette complète du pilot 123 oracles sur 124, même échec antérieur (oracle des skills sur le parc réel) ; `oracle-todo` PASS ; aucun enregistrement git, aucun push.**

## 3. Décisions attendues de l'humain

Bloquants — un travail est à l'arrêt, et voici ce qui le lève :

- **ce qui est bloqué** : l'enregistrement git des 4 tours de ce matin, soit l'analyse du prompt, l'étude, les 4 améliorations et leurs clôtures ; **ce qu'il faut décider** : enregistrer seulement, enregistrer et pousser, ou attendre ; **si rien n'est fourni** : tout reste dans un arbre de travail qu'une autre session partage en ce moment, et la règle neuve s'applique quand même, puisque les hooks lisent les fichiers du pilot tels qu'ils sont sur le disque.

> **D-4 — Les 4 tours de travail de ce matin sur la revue hebdomadaire de l'existant s'enregistrent-ils dans git, et se poussent-ils ?**
>
> Depuis ce matin, le pilot porte sans enregistrement : l'analyse du prompt et l'étude d'opportunité avec son annexe, 4 synthèses, le fichier des 4 candidatures, le lot de décisions, le générateur du tableau de bord des récidives et le plan de sondes étendus, le relevé des contrôles sans appelant, la règle S48 du juge des restitutions avec le gabarit de restitution en version 2.23.0, et les 2 hooks. Une autre session travaille dans le même dépôt en ce moment, et l'index git porte déjà son travail. Le dépôt du pilot est en avance de 32 enregistrements non poussés.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` l. 594-596, la règle 38 (le push d'un dépôt reste un GO humain ; un GO donné sur un travail couvre d'office ses enregistrements de restitution) ; l'état relevé à l'ouverture de session (pilot en avance de 32 enregistrements, travail d'une autre session à l'index). Enregistrer par chemins nommés protège ce travail sans emporter celui de l'autre session ; pousser emporterait aussi les 32 enregistrements antérieurs, ce qui mérite votre regard.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** enregistrer seulement, par chemins nommés | effort simple × court | exclut la publication : rien ne quitte le poste |
| **(b)** enregistrer et pousser | effort simple × court, plus le passage de la porte de publication sur 33 enregistrements | exclut un tri préalable de ce que les 32 enregistrements antérieurs emportent |
| **(c)** attendre | effort nul | exclut toute protection : le travail reste exposé à l'enregistrement d'une autre session |

> **Si rien n'est décidé** : l'option (c) s'applique — rien n'est enregistré.

## 4. Traité — avec sa preuve

- **Votre « 3a » a reçu son geste, pièce 1 de TF-1166 : chez un produit, le tour dit ce qu'il remonte.** La règle S48 demande une ligne au bloc des traces : « Remontée à la factory : rien à remonter » ou le lot remis, nommé. Le silence est refusé, et une ligne qui ne tranche pas aussi. Un produit se reconnaît à son dossier de lots de retours ; au pilot et dans une forge, la règle se déclare sans objet. Elle avertit, elle ne bloque pas.
  - preuve : `node oracles/oracle-synthese.mjs --self-test` → « Self-test restitution : 28/28 PASS », S48 dans 4 sens qui ne diffèrent que d'une ligne (muet FAIL, « rien à remonter » PASS, lot nommé PASS, « à voir plus tard » FAIL), plus le sans-objet hors produit.
- **La règle de TF-1166 mord sur du réel.** Jouée en lecture seule sur une restitution existante d'un produit, elle la refuse et prescrit la ligne due ; jouée sur les synthèses du pilot, elle se dit sans objet.
  - preuve : `node oracles/oracle-synthese.mjs "<dossier de mise en production d'un produit du 05/09>"` → `"S48" … "FAIL"`, « le tour ne dit pas ce qu'il remonte à la factory », message de la règle livrée par TF-1166 ; sur la synthèse précédente du pilot → `"S48" … "SANS_OBJET"`.
- **Les 3 porteurs de la forme sont mis à jour ensemble**, comme le gabarit l'exige depuis le 01/09 : le texte (version 2.23.0, section S48), le juge, et ce que l'agent lit quand on lui refuse sa réponse, plus la ligne des gates affichée à l'ouverture.
  - preuve : `node oracles/hook-restitution.test.mjs` → « 22/22 » ; `node oracles/hook-ouverture.test.mjs` → « 5 PASS, 0 FAIL » ; hook d'ouverture exercé → la ligne des gates porte « v2.23.0 (17/09) : CHEZ UN PRODUIT ».
- **Pièce 2 : le pilot nomme les sources muettes à chaque ouverture.** Le hook ne recompte rien lui-même : il rejoue le générateur du tableau de bord vers des fichiers temporaires et lit son résultat, sans toucher aucune vue suivie.
  - preuve : hook d'ouverture exercé → « 21 source(s) de retours muette(s) depuis plus de 7 j », les 8 premières nommées avec leur silence, de 39 à 26 jours ; `node todo/generer-recidives.test.mjs` → « 9 PASS, 0 FAIL ».
- **Une erreur ancienne corrigée au passage** : la ligne des gates écrivait le chemin du gabarit de restitution sans son séparateur, visible dans le relevé d'ouverture de ce matin. Classe : séquence d'échappement perdue dans une chaîne ; contrôle rouge → vert : la ligne affichée avant et après.
  - preuve : relevé de ce matin → « suit gabaritsRESTITUTION.md » ; hook exercé après correction → « suit gabarits\RESTITUTION.md ».
- **TF-1166 est clos avec sa descente ; les 4 items de l'étude sont clos.**
  - preuve : `node todo/journaliser.mjs` → « 1 événement(s) journalisé(s) », registre PASS avant et après ; vues régénérées → « TODO.md générée — 385 actifs ».
- **Rien d'autre n'est cassé.**
  - preuve : `node oracles/self-tests.mjs` → 123 oracles sur 124 ; le cliquet a pris « oracle-synthese.mjs : 27 → 28 cas » ; l'échec restant est l'oracle des skills installés sur le parc réel, identique au tour précédent et antérieur à ce travail.

## 5. Non traité — avec son motif

- L'enregistrement local et le push — motif : dépendance à une décision humaine (D-4) ; le push d'un dépôt est un GO humain.
- La descente du gabarit de restitution 2.23.0 chez les produits — motif : dépendance externe ; la copie héritée se recopie à la prochaine ouverture de chaque produit, geste humain. Le juge, lui, est lu au pilot par le lanceur de hooks des produits : la règle s'applique dès maintenant là où ce lanceur est installé.
- Le câblage du contrôle d'avant-push à un hook git, reste de TF-1165 — motif : hors mandat ; l'installeur des hooks vit dans la forge des outils.
- La mesure du taux d'accusation de S48 sur le corpus des produits avant écriture — motif : écarté ; la règle est neuve et accuse par construction toute restitution de produit antérieure, ce que sa sévérité d'avertissement assume. Critère de réouverture : plus de 2 retours de produits la disant bruyante.

## 6. Écarts à la lettre

- **Vous avez écrit** « 3a » → **j'ai câblé** les 2 pièces → **écart** : l'option parlait du « gabarit hérité » comme seule voie de descente ; la règle s'applique en fait sans attendre, parce que le juge est lu au pilot. Seul le texte du gabarit attend l'ouverture de chaque produit.
- **L'option (a) disait** « entrée en avertissement avant de se durcir » → **la règle avertit**, et aucune date de durcissement n'est posée → **pourquoi** : le durcissement se décide sur une mesure, au plan de revue du 15/10.
- **Hors du périmètre demandé**, 1 correction de plus : le séparateur manquant dans la ligne des gates, sur la ligne même que je modifiais. Rien d'autre n'a été touché.

## 7. Risques

- La règle neuve avertit à chaque fin de tour chez tous les produits tant que leurs agents n'ont pas pris le pli, et l'avertissement cesse d'être lu ;
  - signal : des restitutions de produit qui portent encore l'avertissement S48 après 2 semaines ;
  - parade : le rappel du hook donne les 2 formes exactes de la ligne due ; si le signal se réalise, la ligne entre dans le gabarit de restitution comme ligne fixe du bloc des traces.
- La ligne des sources muettes nomme 21 sources dont plusieurs sont des chantiers clos, et devient un bruit d'ouverture ;
  - signal : vous ne lisez plus cette ligne, ou les mêmes noms y figurent un mois durant ;
  - parade : acceptation déclarée pour 2 passages ; le seuil de 7 jours se règle ensuite, et une source close se retire par le geste existant de mise hors périmètre.
- Le tableau de bord suivi nomme désormais des sources par leur nom de fichier, et l'un de ces noms pourrait ne pas être pseudonymisé ;
  - signal : la porte de publication refuse le tableau de bord avant un push ;
  - parade : la porte joue avant tout envoi ; les noms viennent de fichiers déjà suivis, et la section par classe en portait déjà.

## 8. Prochaines actions

Ordre du tableau : l'action de l'IA d'abord (tri par acteur) ; puis les actions humaines, la décision avant le geste qui fait baisser les compteurs.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Enregistrer par `git commit --only -- <chemins>` les fichiers des 4 tours de ce matin, puis pousser si D-4 (b) (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 ; à défaut, 4 clôtures et 1 règle vivent dans un arbre de travail partagé | simple × court |
| A-2 | Trancher D-4 — répondre « D-4 (a) », « D-4 (b) » ou « D-4 (c) » (neuve) | manuelle_utilisateur | `decision` — le push d'un dépôt est un GO humain ; sinon : rien n'est enregistré | simple × court |
| A-3 | Ouvrir une session chez les 2 produits en tête de la section 5 du tableau de bord `todo\RECIDIVES.md`, en retard de 34 jours ; preuve de clôture : leur ligne passe à 0 classe en retard à la génération suivante (neuve) | manuelle_utilisateur | `presence` — l'ouverture d'une session chez un produit est votre geste, trace mesurée : la recopie de l'héritage ne se joue qu'à l'ouverture du produit, et le tableau de bord rend 12 et 11 classes non atteintes chez eux ; sinon : 23 des 88 couples restent non atteints, et le gabarit 2.23.0 n'y descend pas | simple × court |

## 9. Traces

- Juge : `oracles\oracle-synthese.mjs`, règle S48 et ses 4 fixtures ; gabarit : `gabarits\RESTITUTION.md`, version 2.23.0.
- Hooks : `oracles\hook-restitution.mjs` (rappel) ; `oracles\hook-ouverture.mjs` (ligne des sources muettes, ligne des gates).
- Tableau de bord : `todo\generer-recidives.mjs` (champs des sources muettes au JSON) ; vue `todo\RECIDIVES.md`, régénérée.
- Registre : `todo\TODO.jsonl`, item TF-1166 clos ; TF-1163, TF-1164 et TF-1165 clos au tour précédent.
- Synthèses des tours précédents : indices `20260917b`, `20260917d` et `20260917f` de `output\04-plans\`.
- Oracles : recette du juge (28/28) ; recettes des hooks (22/22, 5/5) ; recette complète du pilot (123 sur 124, échec antérieur) ; `oracle-todo` (PASS) ; `oracle-synthese` sur ce fichier (PASS au troisième jugement ; refus corrigés : nom de fichier trop long, sigle de la règle non glosé, 2 lignes où le verbe « remonter » se lisait comme une remontée sans identifiant).
- Aucune page HTML livrée dans ce tour ; la page du registre est régénérée par son générateur à chaque écriture et n'est pas un livrable.
