---
destinataire: humain
role: restitution de fin de tour, décision « 31a » du 28/09/2026
sources_de_verite: git du pilot et du canal confidentiel · todo/TODO.jsonl · les 14 lots accueillis sous input/00-retours · output/04-plans/Digit-AI - Synthese Mandat - Parc synchronise et travail des deux postes reuni - 20260928a.md (D-31) · gabarits/RESTITUTION.md (v2.28.0)
verifie_le: 2026-09-28
---

# Digit-AI — Synthèse de mandat — Décision 31a exécutée, quatorze lots accueillis et ingérés — 28/09/2026

## 0. Synthèse d'ouverture

Votre décision est exécutée : les 14 lots de retours qui attendaient au sas d'arrivée (la salle
d'attente des lots) sont accueillis, pseudonymisés et versés au registre, soit 34 candidatures. Le
sas est vide, et le contrôle d'ouverture qui échouait à chaque session peut repasser au vert. Pour
qu'aucun nom réel n'entre en clair dans le dépôt, j'ai inscrit 2 produits à la table des
pseudonymes avant l'accueil, et corrigé 4 lots à la réception, chacun annoté. L'inscription
inexpliquée de ce matin est élucidée : le lot du produit concerné la décrit lui-même. Ce qui vous
attend : 1 décision, choisir lesquelles des 34 candidatures traiter.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-31 (a), accueil et ingestion des lots du sas, puis
  publication.
- **sur quoi** — le pilot `digit-ai-factory` et le canal confidentiel cloné sous `_confidentiel` ;
  aucun dépôt de produit n'a été modifié.
- **quand** — le 28/09/2026, de 16:03 à 16:46 (UTC+02:00), soit 0 h 43, heures relevées par
  `date` ; la fin est l'heure de dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle :
  aucune. Pilot passé de `01d6b37` à `c38e3fd`, canal de `9aea531` à `cf6b1c1`.
- **intention** — que les lots remis par les produits entrent au registre sans perdre un retour et
  sans qu'un nom réel entre en clair dans un dépôt publié.
  **Test rétro** : servie ; les 14 lots sont ingérés, le sas est vide, et aucun des 28 fichiers
  déposés ne porte un terme de la table. La décision parlait de 11 lots : 3 de plus, arrivés du
  même produit avant votre réponse, sont traités avec eux (bloc 6).

## 2. Verdict en une ligne

**14 lots accueillis et ingérés, 34 candidatures** (TF-1422 à TF-1455) · sas d'arrivée vide ·
**2 produits inscrits** à la table avant l'accueil (Produit-77, Produit-78) · **4 lots corrigés** à
la réception, chacun annoté · `oracle-lot-retours` PASS sur les 14 lots, `oracle-todo` PASS ·
publiés : canal `9aea531..cf6b1c1`, pilot `01d6b37..c38e3fd` · **1 décision** attendue.

## 3. Décisions attendues de l'humain

Comment lire le tableau : il porte une option par ligne ; la colonne Coût dit la complexité et la
durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa source précèdent
le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur suffit, par
exemple « D-32 b ». La numérotation suit D-31, posée ce matin.

> **D-32 — Faut-il décider les 34 candidatures que les 14 lots accueillis aujourd'hui ont versées à `todo/TODO.jsonl` ?**
>
> Elles viennent de 4 produits : 20 de Produit-78, sur les études, les pages générées et les
> oracles d'écriture ; 6 de Produit-76, sur `oracles/oracle-synthese.mjs` et l'anonymisation à
> l'entrée ; 5 de Produit-77, sur les horodatages du journal de run ; 3 de Produit-64, sur le
> gabarit de guide intégré ce matin et sur la durée de la porte des noms. Les 11 candidatures de
> Produit-76 et Produit-77 portent le score par défaut, faute d'un score utile dans leur fichier
> d'accompagnement ; leur valeur de 1 ne dit donc rien de leur intérêt. L'une d'elles explique
> l'inscription de ce matin : l'option `--registre` de `todo/ingerer-lot.mjs`, prévue pour un
> registre jetable, étend la table réelle des pseudonymes.
>
> **Recommandation : (b).** Source consultée : les scores inscrits à l'ingestion, 2 candidatures de
> valeur 10 ou plus ; et le fait mesuré de 09:45:43, une table confidentielle étendue par un essai,
> qui pèse plus que sa valeur par défaut.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 34 | complexe × long | le mandat suivant traite aussi 11 candidatures sans score utile, avant de savoir ce qu'elles valent |
| **(b)** *(recommandée)* Décider les 2 de valeur 10 ou plus, TF-1434 (le cliquet des recettes qui dépend du poste, valeur 20) et TF-1433 (la parité du gabarit de guide qui ne voit pas le socle, valeur 15), plus TF-1431 (l'essai qui étend la table réelle) ; j'évalue en même temps les 11 sans score utile, pour votre prochaine décision | moyen × moyen | 31 restent candidates jusqu'à votre prochaine décision |
| **(c)** Ne rien décider | nul | les 34 restent candidates, et un essai d'ingestion peut encore inscrire un nom dans la table réelle |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Chaque lot est passé par les mêmes étapes, dans l'ordre que prescrit le pilot : oracle des lots,
accueil, réception, ingestion ; les corrections se sont faites avant l'ingestion, qui fige
l'empreinte d'un lot.

- **Le relevé avant tout geste.** Le sas portait 14 lots et non 11 : le produit devenu Produit-78
  en avait déposé 3 de plus entre 14:45 et 15:15, avant votre réponse. Aucune session n'y écrivait
  plus ; la dernière activité de ce produit date de 15:19.
  - preuve : relevé du sas à 16:03, 28 fichiers ; journaux des sessions du poste, lus sans en
    recopier les noms ; les 16 dépôts rendaient `0 0` à 16:03:22.
- **L'oracle des lots, avant l'accueil.**
  - preuve : `gabarits/oracle-lot-retours.mjs` sur les 14 lots du sas, sortie 0, aucun écart.
- **2 produits absents de la table y sont inscrits avant l'accueil.** L'accueil ne pseudonymise que
  les noms déjà inscrits : à blanc, 14 fichiers gardaient leur nom réel, dont le sigle d'un nom
  protégé. L'écrivain officiel de la table, celui que l'ingestion appelle, les a inscrits sous
  Produit-77 et Produit-78, datés du 28/09.
  - preuve : aucune occurrence des 2 noms ni de leurs variantes dans les arbres, les messages et
    l'histoire du jour des 16 dépôts ; `oracle-confidentiel` PASS ; l'accueil à blanc rejoué dépose
    alors 28 fichiers sur 28 sous pseudonyme.
- **L'accueil.** 28 fichiers déposés dans `input/00-retours`, tous sous Produit-64, 76, 77 ou 78 ;
  le sas est vide.
  - preuve : `todo/accueillir-lot.mjs`, 28 écrits sur 28, 0 refus, 0 adresse IP et 0 nom de
    personne à qualifier.
- **4 lots corrigés à la réception, chacun annoté d'une note du pilot.** Au lot de Produit-64 du
  matin, RT-25 devient RT-28 : le pilot avait donné ce numéro le 25/09 à un autre retour du même
  produit. Aux 2 lots de Produit-76, la clé de Produit-73, apparue quand la pseudonymisation du
  client a transformé un chemin, est remplacée par son pseudonyme. Au lot 20260928b de Produit-78, 2
  octets U+0008 redeviennent la séquence `\b` que le lot écrit au même passage.
  - preuve : `oracle-lot-retours` rouge sur LOT-IDS (un identifiant de retour jamais repris) puis
    vert ; relevé des termes de la table, 2 fichiers en défaut puis 0 ; ingestion refusée par la
    règle des caractères de contrôle (TF-1067), puis acceptée ; `oracle-lot-retours` PASS sur les
    14 lots après réception.
- **L'ingestion.** 34 candidatures créées, TF-1422 à TF-1455 ; 19 récidives nommées, 4 classes de
  défaut proposées, 1 identifiant à qualifier : `FORGE_PUSH_GO`, la variable du pilot lui-même,
  sans rien de confidentiel.
  - preuve : `todo/ingerer-lot.mjs` sur les 14 fichiers d'accompagnement, sortie 0 ;
    `todo/oracle-todo.mjs` PASS sur le registre de 2464 lignes.
- **L'inscription de 09:45:43 est élucidée.** Le lot 20260928b de Produit-76 la décrit : sa session
  a joué `todo/ingerer-lot.mjs --registre` sur une copie du registre, sans table jetable, et la
  table réelle s'est étendue à cette heure-là ; le registre réel est resté intact. C'est la
  candidature TF-1431.
  - preuve : le fichier d'accompagnement de ce lot, « modifiée à 07:45:43Z, heure de l'essai ;
    registre réel à la même empreinte avant et après ».
- **Le canal confidentiel est publié.**
  - preuve : `git push` rend `9aea531..cf6b1c1`, sortie 0 ; `git rev-list` rend `0 0` après
    `git fetch`.
- **Le pilot est publié.**
  - preuve : `git push` rend `01d6b37..c38e3fd` à 16:45:05, sortie 0, après 26 minutes de porte des
    noms ; `git rev-list` rend `0 0` après `git fetch`.
- **Le relevé final.**
  - preuve : après `git fetch`, les 16 dépôts rendent `0 0` à 16:45:24 ; le sas ne porte plus que son
    README.

## 5. Non traité — avec son motif

- L'évaluation des 11 candidatures sans score utile — motif : `decision` — D-32 la lie à votre
  choix.
- La création des 4 classes de défaut que les lots proposent — motif : `hors_mandat` — une classe
  neuve exige un contrôle existant qui la vérifie, travail de tenue du registre que la décision
  n'a pas commandé.
- Les 2 pseudonymes d'un même produit, Produit-73 et Produit-76 — motif : `decision` — le produit
  lui-même le signale, et TF-1432 attend votre décision.

## 6. Écarts à la lettre

- **Vous avez choisi** d'accueillir les 11 lots. **J'en ai accueilli 14.** **Pourquoi** : 3 lots du
  même produit sont arrivés entre 14:45 et 15:15, après la rédaction de la décision et avant votre
  réponse ; l'option disait de vérifier qu'aucun lot neuf n'arrivait plus, et j'ai lu votre
  intention comme vider le sas.
- **J'ai inscrit** 2 produits à la table avant l'accueil, là où l'outillage les inscrit à
  l'ingestion. **Pourquoi** : sinon leurs lots entraient au dépôt suivi sous leur nom réel, et
  l'ingestion figeait ce nom dans l'empreinte du lot.
- **J'ai modifié** 4 lots avant de les ingérer. **Pourquoi** : un lot ingéré ne se modifie plus ;
  chaque retouche est dite par une note de réception, et le reste du texte est celui du producteur.
- **J'ai déclaré** le feu vert de publication en citant vos mots, `FORGE_PUSH_GO` « décision
  humaine « 31a » du 28/09/2026 ». **Pourquoi** : l'option retenue dit « puis je publie ».

## 7. Risques

- **Un même produit porte 2 pseudonymes**, Produit-73 sous son nom de dossier et Produit-76 sous
  son préfixe de lot.
  - signal : ses retours se comptent sous 2 noms, et le contrôle des identifiants de retour ne voit
    pas les lots de l'autre.
  - parade : D-32, par TF-1432, que le produit propose de régler en rattachant un nom entrant au
    pseudonyme existant.
- **Un essai d'ingestion peut encore étendre la table réelle.**
  - signal : `git -C C:\dev\_confidentiel status` montre la table modifiée sans enregistrement.
  - parade : D-32 (b), par TF-1431.
- **La porte des noms du pilot dure de 15 à 26 minutes** par envoi, mesurée sur les 3 envois aboutis
  aujourd'hui.
  - signal : un envoi du pilot qui attend sa porte plus de 15 minutes.
  - parade : l'action A-7 retire les 2 branches locales du gabarit, qu'elle relit à chaque fois.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord ; l'exécution de D-32 passe en tête, parce qu'elle
porte l'essai qui étend la table réelle. Côté humain, trancher d'abord, puis les 3 suppressions
laissées ce matin.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter D-32 selon votre réponse : décider au registre les candidatures retenues, les traiter, et évaluer les 11 sans score utile | `auto_ia` | TF-1431, TF-1433, TF-1434 | `dependance_bloc_3` — suit D-32 | les 34 restent candidates |
| **A-2** | Créer au référentiel `todo/CLASSES.json` les 4 classes que les lots proposent, chacune avec le contrôle existant qui la vérifie, puis y rattacher leurs retours | `auto_ia` | neuve | `hors_mandat` — la tenue du registre, que ce tour n'a pas reçue | 4 retours restent hors du compte des récidives |
| **A-3** | Consigner au registre la décision d'intégrer le gabarit de guide et la clôture de TF-1413, avec les mots de la décision rendue chez le produit | `auto_ia` | TF-1413 | `hors_mandat` — la session qui a reçu la décision la consigne ; sans ses mots, je ne l'écris pas | la candidature reste ouverte alors que son travail est publié |
| **A-4** | Trancher D-32 — répondre par exemple « D-32 b » | `manuelle_utilisateur` | neuve | `decision` — choisir les candidatures à traiter vous revient | D-32 (c) s'applique |
| **A-5** | Supprimer le fichier de 22 octets : `Remove-Item C:\dev\null` dans PowerShell ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve | `irreversible` — R-29 (une suppression reste un geste humain décidé) | le relevé d'ouverture le signale à chaque session |
| **A-6** | Supprimer la copie du 22/09 : `Remove-Item C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` ; preuve : `git -C C:\dev\_confidentiel status` ne la liste plus | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | des noms réels restent lisibles dans un fichier que rien ne suit |
| **A-7** | Retirer les 2 branches locales du gabarit, intégrées à `main` : `git -C C:\dev\digit-ai-factory branch -d report/guide-de-reference-20260928`, puis `git -C C:\dev\digit-ai-factory branch -D gabarit/guide-de-reference` (sauvegardée en paquet) ; preuve : `git -C C:\dev\digit-ai-factory branch` ne liste plus que `main` et `report/complement-20260921` | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | la porte des noms relit leurs 8 enregistrements jamais publiés à chaque envoi du pilot |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publiés : canal `9aea531..cf6b1c1` ; pilot `01d6b37..c38e3fd` ; cette synthèse et les index
  régénérés partent par un dernier envoi.
- Registre `todo/TODO.jsonl` : 34 créations, TF-1422 à TF-1455, et 28 événements d'ingestion ; table
  des produits : Produit-76, Produit-77 et Produit-78, datés du 28/09.
- Lots accueillis sous `input/00-retours` : Produit-77 du 25/09 (3 lots), Produit-76 (2),
  Produit-64 (2) et Produit-78 (7) du 28/09 ; 4 d'entre eux portent une note de réception.
- Aucune page HTML livrée dans ce tour.
