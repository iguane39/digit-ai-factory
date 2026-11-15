---
destinataire: humain
---

# Synthèse Mandat — troisième campagne et alertes des fixtures closes (15/11/2026)

## 0. Synthèse d'ouverture

Les 2 actions demandées sont faites et publiées. Les 12 sujets décidés hier soir sont traités : 11 corrigés, 1 écarté parce que le défaut annoncé n'existait pas. Votre choix sur les alertes a produit l'effet attendu : l'hébergeur a fermé de lui-même les 190 alertes portées par des fichiers d'exemple, et ses alertes ne désignent plus que de vraies dépendances. Les 7 dépôts touchés sont publiés. 2 gestes vous attendent : accepter la mise à jour des 8 skills installés que la campagne a fait évoluer, et supprimer un dossier jetable que la protection du poste me refuse.

Livré : [Synthèse du 15/11, troisième campagne et alertes closes](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Troisieme%20campagne%20et%20alertes%20des%20fixtures%20closes%20-%2020261115b.md)

## 1. En-tête d'identification

Exécution de votre réponse « 220a, A1 puis A2 » à la synthèse 20261115a, puis « A1, A2, A3 » et « A1 A3 » aux points d'étape, sur le pilot `digit-ai-factory` et 6 forges. Synthèse relevée le 15/11/2026 à 10:32, heure de Paris (`date`). Session pilote Claude Opus 5.5 ; 9 agents `campagne` Claude Sonnet 5.5, un par lot, tous revenus ; 2 relectures d'intention.

Intention de la demande : corriger les 12 sujets décidés, puis cacher à l'hébergeur les fixtures vulnérables pour que ses alertes ne désignent plus que de vraies dépendances.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Chaque sujet est clos sur une preuve rejouée et publié, ou écarté avec sa preuve, et la fermeture des alertes est mesurée chez l'hébergeur après publication.

## 2. Verdict

14 sujets traités sur 14 : 13 corrigés (les 12 du tri moins TF-2571, plus TF-2579 et TF-2580), 1 écarté (TF-2571, non reproduit) ; registre PASS (`node todo/oracle-todo.mjs`) ; alertes ouvertes chez l'hébergeur : 0 sur forge-websec (155 avant), 0 sur forge-agents (35 avant) ; recette entière du pilot : 281 oracles verts sur 282, le seul défaut est la mise à jour des skills qui vous revient.

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient ; deux gestes vous attendent, inventoriés ci-dessous.

Bloquants de ce tour, chacun avec ce qui le lève :
- 8 skills installés sur ce poste divergent de leur source après la campagne (systeme-de-marque, studio-de-direction, redige-les-exigences, quality-oracles, forge-agents, critique-le-design, clip-de-presentation, ameliore-le-design), et la règle de propagation exige votre accord explicite pour les mettre à jour : votre « propage » le lève ; je lance alors la mise à jour, puis le retrait des 6 anciens fichiers d'exemple que la copie installée de quality-oracles garde encore sous leur vrai nom.
- `C:\tmp-pb`, 741 fichiers de bancs de test sans commit ni dépôt distant, reste sur le disque : la protection du poste refuse sa suppression à la session ; votre commande `Remove-Item -Recurse -Force C:\tmp-pb` dans un PowerShell le lève.

## 4. Traité

- Campagne A-1, 7 lots revenus, chacun rejoué par moi avant publication :
  - forge-audit (TF-2567, TF-2568) : `node tools/verifier.mjs` 17 étapes sur 17, `npm audit` 0 vulnérabilité ; publié jusqu'à 3801281 ;
  - forge-conception (TF-2569) : recette VERTE, 19 oracles, 60 règles ; publié jusqu'à 3fdd9a5 ;
  - forge-tests (TF-2577) : `uv run pytest -q` exit 0 ; publié jusqu'à b419a27 ;
  - forge-design (TF-2576) : « Tout vert », 80 oracles, 183 règles, verrou des plages à 140 vérifications ; publié jusqu'à 8f1ff28 ;
  - forge-agents (TF-2575, TF-2573) : recette de forge-agents 134 sur 134, banc du hameçon 92 sur 92 ;
  - pilot, 2 lots fusionnés sans conflit (TF-2570, TF-2574, TF-2572, TF-2573, TF-2578, et TF-2571 écarté) : recette entière 281 sur 282, 18 cliquets relevés.
- TF-2573, les 2 moitiés accordées : après la fusion du pilot, j'ai vidé la liste des divergences tolérées de forge-agents ; l'accord est strict sur 14 formes (134 sur 134, commit 6f9c644).
- A-2, D-220 (a), 2 lots :
  - forge-agents (TF-2580) : 6 fichiers d'exemple renommés ; quality-oracles PASS, 825 contrôles (816 avant), versions quality-oracles 2.39.0 et forge-agents 1.8.0 ; publié jusqu'à 6f9c644 ; 35 alertes fermées par l'hébergeur entre 09:57 et 09:58 ;
  - forge-websec (TF-2579) : 5 fichiers d'exemple renommés ; recette 352 PASS, 0 FAIL (330 avant) ; publié jusqu'à c892c01 ; 155 alertes fermées par l'hébergeur à 09:59 et 10:00.
- Ménage : 4 processus figés laissés par des agents le 14/11 arrêtés ; le contrôle de rendu des instances, mis en cause par la recette pour une écriture dans l'arbre suivi, rejoué seul : il ne modifie rien (`cmp` sur le cliquet).
- Registre : 13 clôtures avec leur descente, TF-2571 écarté, TF-2521 annoté d'une récidive ; 10 candidats inscrits (TF-2582 à TF-2591), un par reste neuf relevé par les agents.

Relecture d'intention : sert, en 1 passe pour chacune des 2 consignes (RI-20261115-03 pour A-1, RI-20261115-05 pour A-2), écarts mineurs seulement.

## 5. Non traité

- La mise à jour des 8 skills installés — motif : `gate_gouvernance`, elle exige votre accord explicite (TF-0391).
- La suppression de `C:\tmp-pb` — motif : `garde_fou`, la protection du poste la réserve à un geste humain.
- TF-2521 (fichiers de contrôle écrits dans l'arbre d'une forge) — motif : `borne_atteinte`, récidive annotée, le périmètre reste à préciser avant correction.

## 6. Écarts à la lettre

- Vous avez demandé la correction de TF-2571 → je l'ai écarté → l'agent a montré que le hook refuse déjà la remise sans critique pour les 2 formes de page ; il a ajouté 4 cas qui figent ce comportement.
- La décision D-220 (a) citait `requirements.fixture.txt` en exemple → les fichiers sont nommés `requirements.txt.fixture` → la forme de l'exemple garde le motif `requirements*.txt`, dont rien ne prouve que l'hébergeur l'ignore.
- TF-2578 demandait de relever le cliquet → c'est la recette entière de la session qui l'a relevé, et non le lot → un lot ne peut pas écrire le cliquet hors de l'arbre principal.

## 7. Risques

- La copie installée de quality-oracles garde 6 anciens fichiers d'exemple sous leur vrai nom ; après la mise à jour sans retrait, sa recette les refuserait ; signal : un échec du contrôle de rangement dans la copie installée ; parade : le retrait, prévu avec votre « propage ».

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Mettre à jour les 8 skills installés et retirer les anciens fichiers d'exemple de la copie | neuve | auto_ia | gate_gouvernance : accord humain exigé par la règle de propagation | votre « propage » | les sessions du poste exécutent les anciennes versions |
| A-2 | Supprimer les 2 dépôts jetables d'un agent avec `Remove-Item -Recurse -Force C:\tmp-pb` | neuve | manuelle_utilisateur | irreversible : la protection du poste réserve à l'humain la suppression d'un dossier de la racine du disque (refusée à la session sous PowerShell et à l'agent sous Bash) | votre geste | 741 fichiers inutiles restent sur le disque |
| A-3 | Trier les 10 candidats TF-2582 à TF-2591 | neuve | auto_ia | gate_gouvernance : le tri se demande | votre « A3 » | ils restent candidats |

## 9. Traces

Registre `todo\TODO.jsonl` (13 clôtures, TF-2571 écarté, TF-2582 à TF-2591 candidats) ; pilot, fusions 33145028 et e7d8e261, cliquet `oracles\baseline-recettes.json` ; forge-audit 3801281, forge-conception 3fdd9a5, forge-tests b419a27, forge-design 8f1ff28, forge-agents 6f9c644, forge-websec c892c01 ; recette entière dans `recette-pilot3.txt`, dossier temporaire de la session.
