---
destinataire: humain
---

# Synthèse Mandat — prompt « retravaille la cible » analysé : contrôles par forge et par capacité, sans rallonger les réponses (26/10/2026)

## 0. Synthèse d'ouverture

Votre prompt est prêt à exécuter dans sa version réécrite, en annexe. Il produira une version révisée du diagnostic d'œil critique qui intègre vos 5 remarques. Votre remarque sur seo-geo corrige un défaut de la cible : la règle qui faisait redescendre une capacité restée silencieuse 30 jours est remplacée par une preuve d'utilité comptée sur les seules demandes où la capacité s'appliquait. Les contrôles par forge et par capacité restent exhaustifs, mais ils passent par un script et un fichier de trace : l'écran n'en montre qu'une ligne. Il vous reste à dire « exécute le prompt », ou à corriger un des 5 écarts du bloc 6.

## 1. En-tête d'identification

Analyse L99 de votre message · sur le pilot digit-ai-factory · le 26/10/2026 à 11:50 (heure de Paris, UTC+1) · Claude Opus 5.5, lecture seule hors l'analyse et cette synthèse.

Intention : retravailler la cible pour que rien d'applicable ne soit oublié, ni une forge ni une capacité, et que vous n'ayez plus à intervenir après coup. Test rétro : le prompt réécrit sert l'intention, car chaque contrôle demandé y devient vérifiable par une trace, sans réponse plus longue à l'écran.

## 2. Verdict en une ligne

Score du prompt 49 → 86 sur 100, projeté (non mesuré) ; 10 défauts majeurs et aucun bloquant, tous corrigés dans le prompt réécrit ; `oracle-ecriture` PASS sur l'analyse.

## 3. Décisions attendues

Aucune décision nouvelle. Vos remarques amendent D-68, D-69 et D-70 ; l'exécution du prompt les repose en entier sur le texte révisé. Rappel : D-71, publication du pilot après rebase, posée à 10:22, inchangée.

## 4. Traité

- Analyse L99 en 8 chapitres : `output/03-etudes/20261026-L99-oeil-critique-cible-retravaillee.md`, `oracle-ecriture` PASS.
- Prémisses vérifiées dans le dépôt : script `scripts/relecture-intention.mjs` 2.1.0 ; format de remontée dans `gabarits/CLAUDE-PRODUIT.md` (« Routage forge » et « Remontée automatique vers le pilot ») et `gabarits/oracle-lot-retours.mjs` ; forge seo-geo présente.
- Stock compté par `git ls-files` : 90 oracles au pilot et 125 dans les 13 forges, soit environ 215 ; 36 skills installés au relevé d'ouverture.
- Défaut de la cible relevé grâce à votre remarque : la rétrogradation au calendrier de l'annexe A5 de la synthèse 20261026b déclassait seo-geo entre deux sites web.
- Relecture d'intention : sans objet, analyse de prompt sans livrable de code.

## 5. Non traité

- Exécution du prompt : non faite, parce que la méthode L99 vous laisse valider le prompt réécrit avant.
- Valeur de départ de la mesure « rien d'oublié » : non mesurée, parce que le skill d'œil critique n'a pas encore tourné ; le prompt demande de la donner ou de dire qu'elle manque.

## 6. Écarts à la lettre

Comment lire : une ligne par endroit où le prompt réécrit s'écarte de votre texte. Les 5 sont des manières d'exécuter, validées avec le prompt ; aucun contenu visible n'est ajouté sans votre demande.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| un contrôle argumenté de chaque forge à chaque demande (T4) | argumentation complète dans une trace de la demande, une ligne à l'écran | ne pas ramener la récidive « textes trop longs » des 01/10 et 20/10 |
| un contrôle de chaque fonctionnalité (A5) | un script évalue la condition d'applicabilité de chaque capacité ; la trace dit appliquée ou écartée, avec motif | environ 215 oracles et 36 skills ne se relisent pas à chaque demande |
| « demander si besoin de plus d'infos » (T1) | une seule question groupée, pour un champ obligatoire du lot qu'aucune trace ne donne | ne pas rouvrir la récidive des questions évitables |
| « OK + le script de relecture » (T3) | la relecture corrige d'abord, par 2 passes, et ne vous interroge que sur un choix qui vous revient ; sa prolongation au-delà du 01/11 est posée en décision avec budget | elle vous a posé 34 écarts pour 0 alerte confirmée ; sa prolongation annule un retrait du 21/10 |
| « OK » sur T1, T3, T4 et A5 | D-68 à D-70 reposées sur le texte révisé | vous n'avez pas encore lu les amendements rédigés |

## 7. Risques

- Énoncé : la relecture gardée coûte environ 0,53 million de jetons par jour au rythme de l'essai. Signal : le relevé d'ouverture, section « Œil critique ». Parade : le budget posé en décision par le prompt.
- Énoncé : la ligne « Je mobilise » se recopie d'une demande à l'autre et cesse de contrôler. Signal : 2 demandes de profils différents avec la même ligne. Parade : la relecture la compare au profil du produit et à la demande.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 attend votre feu vert, A-2 reste celle de la synthèse 20261026a.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | aucun | Exécuter le prompt réécrit, produire le diagnostic 20261026a et reposer D-68 à D-70 | auto_ia | gate_gouvernance | réponse « exécute le prompt » | la cible reste dans sa version du 21/10, rétrogradation au calendrier comprise |
| **A-2** | TF-1942 | Lancer la première analyse d'œil critique sur chaque poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | aucune mesure de départ pour « rien d'oublié » |

## 9. Traces

- `output/03-etudes/20261026-L99-oeil-critique-cible-retravaillee.md`, chapitres 1 à 8.
- `output/04-plans/Digit-AI - Synthese Mandat - Oeil critique T1 a T4 detaillees et catalogue - 20261026b.md`, annexe A5.
- `gabarits/CLAUDE-PRODUIT.md`, sections « Routage forge » et « Remontée automatique vers le pilot ».

## Annexe — prompt réécrit

```text
Retravaille la cible d'œil critique : produis la version révisée du diagnostic,
« Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md » dans output\03-etudes\
(R-4 : le projet en tête ; R-25 : le type « Diagnostic » en premier mot du 2e segment),
qui remplace la version 20261021a pour les sections d, e, f, g et i, et intègre le
catalogue de l'annexe A5 de la synthèse 20261026b. Ne modifie aucun autre fichier de
doctrine : c'est une proposition.

Sources : le diagnostic 20261021a, les synthèses 20261026a et 20261026b, et mes
remarques ci-dessous.

1. T1, retenue, avec 2 ajouts.
   a. Contrôle de portée : une remarque remonte à la Factory si au moins un de ces
      critères est vrai, et la trace dit lequel : elle vise un artefact du pilot ou d'une
      forge (gabarit, oracle, skill, hook, règle) ; elle se reproduirait chez un autre
      produit du même profil ; c'est une préférence de ma part ou une convention d'un
      client, qui vaut pour tous ses produits. Sinon elle reste au produit.
   b. Forçage : si je demande de remonter à la Factory, la remontée se fait même si le
      contrôle dit « produit ». Elle suit le format existant : ledger (type: retour),
      lot « <projet> - RETOURS - … » et sidecar .tf.jsonl déposés au sas _arrivee\,
      oracle-lot-retours vert. Les champs se remplissent depuis les traces ; une
      question ne se pose que pour un champ obligatoire qu'aucune trace ne permet de
      remplir, en une seule question groupée.

2. T2, retenue telle quelle.

3. T3, retenue, et la relecture d'intention gardée avec elle. Objectif : que la
   réponse corresponde à ma demande sans que j'intervienne, sauf sur un élément
   nouveau. Décris :
   - les 3 lignes du tour 1 (je livre, je suppose, je mobilise) deviennent le contrat
     contre lequel la relecture juge la réponse ;
   - la relecture corrige d'abord, par sa boucle de 2 passes, et ne me pose une
     question que pour un écart qui relève de mon choix ;
   - la prolongation au-delà du 01/11 annule le retrait 2 du 21/10 : pose-la en
     décision, avec un budget en jetons par jour mesuré sur l'essai.

4. T4, retenue, sans figer les forges. La carte donne des forges privilégiées par type.
   À chaque demande, chacune des 13 forges reçoit un verdict « mobilisée » ou
   « écartée » avec son motif, au regard de la demande et du profil du produit ;
   une forge mobilisée a aussi son motif. L'argumentation complète s'écrit dans un
   fichier de trace de la demande ; l'écran n'en montre qu'une ligne : les forges
   mobilisées, puis celles qui sortent de la carte, ajoutées ou écartées, avec leur
   motif. Le verrou « livré » vérifie les livrables des forges mobilisées.

5. A5, retenu, avec le même principe.
   - Chaque capacité du catalogue (skill, oracle, règle) porte une condition
     d'applicabilité lisible par un script : profil de produit, type de demande,
     présence d'un fichier ou d'un signal.
   - Le profil du produit est déclaré une fois et revu quand un signal change
     (domaine public, page indexable, données personnelles, agents).
   - À chaque demande, un script liste les capacités applicables ; à la fin, la trace
     dit, pour chacune, appliquée ou écartée avec motif. Une capacité applicable sans
     trace est un oubli, signalé avant « livré ».
   - Une capacité rare reste due : sa preuve d'utilité se compte sur les seules
     demandes où elle était applicable, jamais au calendrier. Remplace la règle de
     rétrogradation après 30 jours de silence de la synthèse 20261026b.

6. Mesure de « rien d'oublié » : la mission 5 du skill oeil-critique compare, pour
   chaque demande analysée, les forges et capacités applicables à celles appliquées ;
   donne la valeur de départ si elle se mesure, sinon dis-le.

7. Chiffre chaque ajout : fichiers, octets chargés à l'ouverture (plafond 9,6 Ko),
   jetons par jour. Chaque ajout dit ce qu'il retire, ou pourquoi il n'entre pas
   dans la couche plafonnée.

8. Repose D-68, D-69 et D-70 en entier, au format B, sur le texte révisé, option (a)
   = la version amendée ; ajoute la décision de prolonger la relecture (point 3).
   Réserve chaque nouvelle décision par scripts\reserver-decision.mjs. D-71 reste
   inchangée.

Contrat de sortie, à vérifier avant de rendre :
- le fichier existe au nom ci-dessus, avec un en-tête « remplace » et « ce qui change
  depuis 20261021a » ;
- les 5 points (T1, T2, T3, T4, A5) ont chacun : ce qui change, avantages,
  inconvénients, coût chiffré ;
- le critère de portée de T1 tient en 3 conditions, chacune vérifiable dans une trace ;
- aucune règle de la version ne rétrograde une capacité au calendrier ;
- le tour 1 affiché tient en 3 lignes, quelle que soit la demande ;
- chaque chiffre porte sa source ou « à vérifier » ;
- oracle-ecriture PASS sur le diagnostic ; la synthèse passe
  hook-restitution --prejuger avant affichage.
```
