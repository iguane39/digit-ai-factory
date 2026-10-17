---
destinataire: humain
---

# Synthèse Mandat — vos 12 décisions exécutées, rien n'est encore publié (17/10/2026)

## 0. Synthèse d'ouverture

Vos 12 décisions sont appliquées sur ce poste, sauf 2 qui attendent : la campagne d'amélioration de la consigne, qui se lance après publication pour mesurer sur un état stable, et l'essai de publications LinkedIn, qui attend vos 3 informations. Le sigle est masqué, la doctrine de mise en production est alignée sur l'audit, la garde PowerShell est branchée, et 4 défauts du pilot sont corrigés. La recette complète passe à 221 sur 223. Rien n'a quitté ce poste : 4 dépôts attendent votre accord de publication (D-13), sans lequel les produits et l'autre poste ne voient aucun de ces changements.

## 1. En-tête d'identification

Mandat d'exécution, réponse « accepter toutes les décisions recommandées » du 17/10/2026 aux décisions D-1 à D-12 de la synthèse 20261017c, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 17/10/2026 de 09:05 à 11:33, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5 ; 5 agents en parallèle, 2 Opus 5.5 (D-3 doctrine, D-5 outil de consignation : construction complexe) et 3 Sonnet 5.5 (D-6, D-9, D-11), chacun dans un périmètre de fichiers séparé, sans enregistrement ni publication. Escalade de modèle : aucune.

Intention de la demande : que les options recommandées produisent leurs effets, pas seulement qu'elles soient notées.

Test rétro : le résultat sert cette intention sur ce poste. Chaque décision a son effet mesuré par un contrôle joué. Il ne la sert pas encore pour les produits et l'autre poste, qui ne reçoivent rien avant la publication (D-13).

## 2. Verdict en une ligne

10 décisions sur 12 appliquées et mesurées, 2 en attente ; recette complète 221/223, les 2 défauts venant du contrôle des skills ; 4 dépôts modifiés, 0 publié.

## 3. Décisions attendues

4 décisions neuves, au format B. Elles prolongent la numérotation de la session. Chacune se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe après ce choix, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-13 — Puis-je publier les 4 dépôts modifiés aujourd'hui ? (TF-1540, TF-1432, TF-1212, TF-1319, TF-1307)**
>
> - **De quoi s'agit-il** : l'envoi vers GitHub du pilot (70 fichiers modifiés), de la forge de mise en production (5 fichiers), de la forge d'outils (15 fichiers) et du canal confidentiel, qui est privé (3 fichiers).
> - **Le problème** : tant que rien n'est publié, les produits n'ont ni le format B, ni les nouvelles portes de mise en production, et l'autre poste repart de l'état d'hier.
> - **Pourquoi vous** : votre règle exige un accord explicite pour enregistrer et publier.
> - **Recommandation : (a)** — les recettes touchées sont vertes et la garde de publication rejoue la recette complète avant tout envoi. Source consultée : `REGLES-PROJET.md`, R-38 § 4 à 6.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Publier les 4 | J'enregistre chaque dépôt avec un message qui cite ses décisions, puis je publie sous la garde de publication ; un refus de la garde arrête l'envoi | Moyen × court, la garde du pilot dure environ 9 min | Possible, par un enregistrement correctif |
| (b) Publier le pilot et le canal seulement | Le format B et les tables partent ; les règles de mise en production et l'outil de consignation restent sur ce poste | Faible × court | Possible |
| (c) Ne rien publier | Tout reste sur ce poste | Nul | Sans objet |

> **Sans réponse** : (c), rien ne quitte ce poste.

> **D-14 — Faut-il recopier les 2 skills modifiés vers leur copie installée ? (TF-1319, TF-1307)**
>
> - **De quoi s'agit-il** : la copie installée de 2 skills de la forge d'outils, le socle des pages HTML (règle V21 — largeurs de contenu mélangées) et l'outil de journal des runs (commande `consigner`), qui est celle que les sessions exécutent.
> - **Le problème** : le contrôle des skills relève l'écart entre les sources et les copies installées ; tant qu'il dure, les sessions n'appliquent ni V21 ni `consigner`.
> - **Pourquoi vous** : la recopie change ce que toutes les sessions du poste exécutent, et la règle de la maison en fait une décision humaine.
> - **Recommandation : (a)** — après la publication, pour que la copie installée corresponde à une version publiée. Source consultée : `oracles/oracle-skills.mjs`, remède `--appliquer` (TF-0391).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Recopier après la publication | `node oracles\oracle-skills.mjs --appliquer` aligne les copies ; le contrôle des skills sur le parc repasse au vert | Faible × court | Possible, en recopiant l'état d'hier |
| (b) Recopier tout de suite | Les sessions exécutent un code encore non publié | Faible × court | Possible |
| (c) Ne pas recopier | Le contrôle reste rouge, V21 et `consigner` restent inactifs à l'exécution | Nul | Sans objet |

> **Sans réponse** : (c), les copies installées restent à l'état d'hier.

> **D-15 — Le préfixe « U•A » du produit d'audit Produit-72 est-il un nom à protéger ? (TF-1840)**
>
> - **De quoi s'agit-il** : le préfixe de 3 lettres sous lequel le produit d'audit inscrit sous Produit-72 remet ses lots.
> - **Le problème** : il figure tel quel dans le registre publié (12 sujets) et dans un nom de dossier d'archives, et aucune des 2 tables de protection ne le porte.
> - **Pourquoi vous** : vous seul savez s'il permet de reconnaître un client.
> - **Recommandation : (b)** — un audit est souvent désigné par un sigle interne sans valeur hors contexte ; c'est une présomption, pas une mesure. Source consultée : `input/00-retours/old/`, en-tête du lot du 24/09 de ce produit.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Oui, masquer | Inscrit sous Produit-72 et masqué dans les fichiers suivis, comme le sigle de D-1 ; l'histoire publiée le garde | Faible × court | Possible |
| (b) Non, il n'est pas sensible | Rien ne change ; votre réponse est notée | Nul | Possible |
| (c) Plus tard | Chaque nouveau lot de ce produit l'ajoute à d'autres fichiers publics | Nul aujourd'hui | Sans objet |

> **Sans réponse** : (c), plus tard.

> **D-16 — Lancez-vous la correction de 2 défauts trouvés aujourd'hui ? (TF-1839, TF-1841)**
>
> - **De quoi s'agit-il** : la porte des noms ne voit pas le nom complet du projet de Produit-11 quand il est écrit collé, sans séparateurs (16 fichiers suivis) ; et une forge mobilisée comme outil promet tous ses oracles au run.
> - **Le problème** : la porte rend PASS sur un nom de projet publié ; et 5 des 7 refus mesurés du contrôle de fin de run portent sur une forge dont aucun oracle n'a de verdict.
> - **Pourquoi vous** : tout sujet entre au registre en candidature, et seul votre accord le fait passer en traitement.
> - **Recommandation : (a)** — le premier est une fuite mesurée, le second fausse la mesure que D-5 vient d'outiller. Source consultée : sortie d'`oracle-nom-client-publie` et de `oracles/mesure-refus-enclenchement.mjs` du 17/10.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Les 2 | La porte et l'anonymiseur comparent les graphies sans séparateurs, et le nom passe sous Produit-11 dans les 16 fichiers ; une forge outil ne promet que les oracles de sa partie mobilisée | Moyen × moyen | Possible |
| (b) La fuite seulement | Le nom collé est traité ; la promesse des forges reste large | Faible × court | Possible |
| (c) Aucun | Les 2 restent en candidature | Nul | Sans objet |

> **Sans réponse** : (c), aucun n'est lancé.

## 4. Traité

Chacune de vos 12 décisions, avec ce qui a été fait et le contrôle qui le prouve.

- **D-1 (a), le sigle masqué (TF-1540).** Inscrit à la table des produits sous Produit-11, remplacé dans 28 fichiers suivis par `todo/anonymiser-suivis.mjs`, et dans 3 identifiants techniques à la main. Preuves : `git grep` du sigle sur les fichiers texte suivis, 1 fichier restant ; canal confidentiel PASS sur ses 7 règles ; porte des noms `oracle-nom-client-publie` PASS sur le dépôt.
- **D-2 (a), un seul nom de code (TF-1432).** La règle d'unicité du canal tolère un rattachement déclaré ; la clé de Produit-76 rejoint Produit-73, l'indice 76 est réservé. Preuves : essai du canal 11 → 12 PASS, dont 2 rouges ; `todo/ingerer-rattachement.test.mjs` 6/6.
- **D-3 (a), doctrine alignée sur l'audit (TF-1212).** Pipeline exclusif, sauvegarde et fournisseur d'identité, cités mot pour mot du référentiel d'audit ; portes M-16 à M-18 en avertissement, règle O-19 (contrôle de la sauvegarde) de la forge de mise en production, vérificateur `scripts/verifier-exigences-fatales.mjs`. Preuves : forge-ops 208 → 219 PASS, contrôle de mise en production 36 → 43, vérificateur 22 PASS ; taux d'accusation mesuré : 7 dossiers de mise en production sur 7 par exigence, aucun verdict d'ensemble modifié.
- **D-4 (a), aucun secret client par défaut (TF-1396).** La demande est inscrite au registre pour Produit-72 ; l'émetteur des lots la range parmi les produits absents de ce poste. Preuve : `node todo/emettre-travaux.mjs --tous --essai`, ligne « TF-1396 → Produit-72 (à émettre depuis le poste qui porte ce produit) ».
- **D-5 (b), outil de consignation (TF-1319).** `ledger.mjs consigner` dans la forge d'outils, mesure des refus `oracles/mesure-refus-enclenchement.mjs` ; le contrôle de fin de run reste informatif. Code écrit neuf : la sauvegarde du 24/09 n'est pas sur ce poste. Preuves : forge-agents 72 → 82, mesure 11 PASS ; relevé recompté : 17 runs clos, 7 jugés, 7 refus, aucun qualifié.
- **D-6 (a), dossier client englobant (TF-0963).** Gabarit `gabarits/settings-dossier-englobant.json`, qui ne délègue que la reconnaissance des mots-clés ; les contrôles PD3 et PD4 nomment le geste. Preuve : `oracle-portee-doctrine` 12 → 18 cas, dont rouge et vert.
- **D-7 (a), garde PowerShell (TF-1584).** Branchée dans `.claude/settings.json` du pilot. Preuves : `> /dev/null` refusé (exit 2), `> $null` accepté (exit 0) ; recette 8/8.
- **D-8 (a), campagne autorisée (TF-1552).** Décision consignée ; lancement après la publication (bloc 5).
- **D-9 (b), règle des largeurs (TF-1307).** Règle V21 du socle des pages HTML 1.32.0, en avertissement ; « doute invisible » déclarée perdue. Preuves : self-test du socle 614 → 618 ; bruit mesuré à 8 pages sur 52, vrai positif vérifié.
- **D-10 (a), premier essai de publications (TF-1160).** En attente de vos 3 informations (A-6).
- **D-11 (a), 4 défauts du pilot.** TF-1830 corrigé : le contrôle de la boîte des retours juge le dossier qu'on lui passe, self-test 46/47 → 47/47. TF-1838 corrigé : l'essai du contrôle d'ouverture ne dépend plus de la vitesse de la machine, 34/34 sur 3 passages. TF-1829 reproduit puis corrigé : le résumé d'ouverture affiche le pire constat, recette 34 → 36. TF-1837 instruit sans être reproduit (bloc 5).
- **D-12 (a), synthèses à plat.** Rien ne change, conformément à l'option.
- **Registre.** 14 décisions, 12 sujets mis à jour et 3 candidats neufs (TF-1839, TF-1840, TF-1841). Preuve : `node todo/journaliser.mjs`, contrôle du registre PASS avant et après chaque passe.
- **Recette complète.** `node oracles/self-tests.mjs` : « 2/223 oracle(s) en défaut : oracle-skills.mjs, oracle-skills.mjs (parc réel) » ; 6 recettes ont gagné des cas (cliquet).

## 5. Non traité

- **La publication des 4 dépôts.** Motif : votre accord explicite est requis (D-13).
- **La campagne de D-8.** Motif : elle fait varier la consigne de restitution, qui vient de passer en v2.41.0, et doit mesurer sur un état stable ; elle se lance après la publication (A-3).
- **Le premier essai de publications de D-10.** Motif : il attend vos 3 informations, qu'aucune IA ne peut poser sans les inventer.
- **TF-1837, les déplacements annulés le 16/10.** Motif : non reproduit sur un clone jetable, recette jouée seule puis 2 fois en parallèle, 340 renommages intacts ; les recettes sont écartées comme cause.
- **Le reste du sigle.** Motif : un identifiant technique dans un compagnon de lot du 14/09, que l'outil d'empreinte refuse de modifier sans preuve ; et une correspondance dans une image, que la porte des noms ne lit pas.
- **Le contrôle des skills.** Motif : son essai K11 était en défaut avant cette session ; son relevé du parc attend la recopie (D-14).

## 6. Écarts à la lettre

2 écarts, chacun pour servir la décision prise.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Accepter toutes les décisions recommandées | J'ai différé le lancement de la campagne de D-8 | Elle mesurerait sur une consigne en cours de changement |
| Accepter D-1 (a), masquer le sigle | J'ai laissé l'identifiant d'un compagnon de lot en l'état | Le modifier casserait la preuve d'empreinte qui protège le registre contre une édition silencieuse |

## 7. Risques

- **Les nouvelles portes de mise en production signalent tous les produits.**
  - Énoncé : 7 dossiers sur 7 échouent les 3 exigences, en avertissement.
  - Signal : les lignes TM11 à TM13 à la prochaine mise en production d'un produit.
  - Parade : les rendre bloquantes seulement après de vraies mises en production, sur votre décision.
- **Le contrôle de fin de run refuse aujourd'hui 7 runs sur 7.**
  - Énoncé : il reste informatif, mais sa mesure est faussée par la promesse trop large des forges outils.
  - Signal : `oracles/mesure-refus-enclenchement.mjs`.
  - Parade : TF-1841 (D-16).

## 8. Prochaines actions

Votre accord de publication passe en premier : la recopie des skills et la campagne en dépendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1540 | Enregistrer et publier les 4 dépôts | auto_ia | dependance_bloc_3 : attend D-13 | `git commit` puis `git push origin main` dans chaque dépôt, sous la garde de publication | Rien ne quitte ce poste |
| **A-2** | TF-1307 | Recopier les 2 skills modifiés vers leur copie installée | auto_ia | dependance_bloc_3 : attend D-14 | `node oracles\oracle-skills.mjs --appliquer` | V21 et `consigner` restent inactifs à l'exécution |
| **A-3** | TF-1552 | Lancer la campagne d'environ 70 exécutions sur la consigne de restitution | auto_ia | dependance_bloc_3 : attend la publication de D-13 | Campagne d'agents bornée, empreintes des oracles relevées avant et après | Aucune proposition mesurée à la revue du 29/10 |
| **A-4** | TF-1323 | Vous présenter les 5 noms hors table dans un fichier hors dépôt | auto_ia | gate_gouvernance : attend votre accord | Lecture de l'histoire de `todo/HERITAGE-RELEVES.jsonl` | La qualification ne peut pas se faire |
| **A-5** | `neuve` | Accueillir puis ingérer le lot resté au sas d'arrivée | auto_ia | gate_gouvernance : attend votre accord | `node todo\accueillir-lot.mjs` puis `node todo\ingerer-lot.mjs <compagnon>` (le fichier compagnon du lot) | Les retours d'un produit restent non traités |
| **A-6** | TF-1160 | Fournir les 3 informations du premier essai de publications | manuelle_utilisateur | decision | Répondre dans la conversation : une ligne par compte `compte ; rôle ; double facteur ; départ`, le fichier d'export des statistiques de départ, un nombre de minutes par semaine | Aucune publication, aucun gain mesuré |
| **A-7** | TF-1090 | Faire la rotation des identifiants publiés chez les produits | manuelle_utilisateur | decision | `node oracles/oracle-secrets-hors-perimetre.mjs` pour la liste, puis la console de chaque fournisseur | Des identifiants publiés restent valides |
| **A-8** | TF-1584 | Lire puis supprimer le fichier `C:\dev\null` | manuelle_utilisateur | irreversible | `Get-Content C:\dev\null -TotalCount 20` puis `Remove-Item C:\dev\null` | Une page entière reste écrite hors de tout dépôt |
| **A-9** | TF-1837 | Supprimer les clones jetables de l'enquête | manuelle_utilisateur | irreversible | `Remove-Item -Recurse C:\Users\Public\tf1837, C:\Users\Public\pilot2, C:\Users\Public\parc` | Environ 3 copies du pilot occupent le disque |
| **A-10** | `neuve` | Trancher D-13 à D-16 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-13 (a)` | L'option « sans réponse » de chacune s'applique |

## 9. Traces

- Registre : `todo/TODO.jsonl`, 14 + 15 + 1 événements du 17/10 après la synthèse 20261017c
- Canal confidentiel : `C:\dev\_confidentiel\oracle-confidentiel.mjs` (K5), sa recette, la table des produits ; sauvegarde de la table dans le dossier temporaire de la session
- Pilot : `oracles/oracle-boite-entree.mjs`, `oracles/hook-ouverture.mjs`, `oracles/lib-resume-r47.mjs`, `oracles/hook-ouverture.test.mjs`, `oracles/oracle-portee-doctrine.mjs`, `oracles/mesure-refus-enclenchement.mjs`, `scripts/verifier-exigences-fatales.mjs`, `oracles/oracle-trace-mutation-mep.mjs`, `ETAPE-MEP.md`, `references/ETAPES-RUN.md`, `CONTRAT-INTERFACE.md`, `gabarits/settings-dossier-englobant.json`, `gabarits/CLAUDE-PRODUIT.md`, `gabarits/HERITAGE.json`, `.claude/settings.json`
- Forge de mise en production : `C:\dev\digit-ai-forge-ops\oracles\oracle-ops.mjs` (O-19, le contrôle de la sauvegarde) et `fixtures\o19-sauvegarde\`
- Forge d'outils : `ledger.mjs` du skill forge-agents ; `render_page.py` et 4 fixtures V21 du skill digit-ai-page-html
- Recette : sortie de `node oracles/self-tests.mjs` du 17/10 à 11:20, dans le dossier temporaire de la session
