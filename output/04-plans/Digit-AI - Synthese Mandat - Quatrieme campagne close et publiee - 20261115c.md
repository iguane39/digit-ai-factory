---
destinataire: humain
---

# Synthèse Mandat — quatrième campagne close et publiée (15/11/2026)

## 0. Synthèse d'ouverture

Les 10 sujets décidés ce matin sont traités : 9 corrigés, 1 écarté parce que son défaut n'a pas été reproduit. Les 5 dépôts touchés sont publiés. Le pilot et la forge des agents jugent désormais un journal de run de la même façon, sans exception. Les constats faits en chemin sont inscrits comme 7 sujets candidats. 2 gestes vous attendent : accepter la mise à jour de 2 skills installés, et supprimer le dossier jetable que la protection du poste me refuse.

Livré : [Synthèse du 15/11, quatrième campagne close](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Quatrieme%20campagne%20close%20et%20publiee%20-%2020261115c.md)

## 1. En-tête d'identification

Exécution de votre réponse « A1 & A2 » au point d'étape de 11:19, sur le pilot `digit-ai-factory`, forge-audit, forge-tests, forge-design et forge-agents. Synthèse relevée le 15/11/2026 à 13:46, heure de Paris (`date`). Session pilote Claude Opus 5.5 ; 6 agents `campagne` Claude Sonnet 5.5, un par lot, tous revenus ; 1 relecture d'intention.

Intention de la demande : corriger les 10 sujets décidés et retirer le dossier jetable.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre : chaque sujet est clos sur une preuve rejouée et publié, ou écarté avec son motif, et le blocage du dossier jetable est dit avec son remède.

## 2. Verdict

10 sujets traités sur 10 : 9 corrigés, 1 écarté (TF-2591, non reproduit) ; registre PASS (`node todo/oracle-todo.mjs`) ; recette entière du pilot : 285 oracles verts sur 286, le seul défaut est la mise à jour des skills qui vous revient ; 5 dépôts publiés, 0 commit d'écart.

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient ; deux gestes vous attendent, inventoriés ci-dessous.

Bloquants de ce tour, chacun avec ce qui le lève :
- 2 skills installés sur ce poste divergent de leur source après la campagne, forge-agents et ameliore-le-design, et la règle de propagation exige votre accord explicite pour les mettre à jour : votre « propage » le lève. Un 3e, oeil-critique, diverge parce qu'une autre session le modifie sans l'avoir enregistré : je ne le propagerai qu'une fois son travail enregistré.
- `C:\tmp-pb`, 741 fichiers de bancs de test sans commit ni dépôt distant, reste sur le disque : la protection du poste refuse sa suppression à la session ; votre commande `Remove-Item -Recurse -Force C:\tmp-pb`, lancée par vous dans un PowerShell, le lève.
- Une autre session modifie sans les avoir enregistrés 2 fichiers du pilot (le relevé de la flotte et le suivi des agents) et le skill oeil-critique de forge-agents ; ils restent hors de mes publications : leur enregistrement par cette session le lève.

## 4. Traité

- Les lots revenus, par dépôt (5 dépôts), chacun rejoué par moi avant publication :
  - forge-audit (TF-2582) : une fiche de sécurité sans valideur est refusée ; `node tools/verifier.mjs` 17 étapes sur 17 ; publié jusqu'à 2ce08a2 ;
  - forge-tests (TF-2583) : un contrôle refuse tout jugement du chemin du poste au lieu du chemin du projet ; `uv run pytest -q` 2355 passés ; publié jusqu'à 7b903e4 ;
  - forge-design (TF-2584, TF-2585) : 4 contrôles gardent leur ligne « sans écart » à côté d'une simple information, et les plages de règles citées sont à jour ; « Tout vert », 80 oracles, 183 règles, verrou des plages à 161 vérifications ; publié jusqu'à 9c65ac9 ;
  - forge-agents (TF-2586, TF-2587) : l'écrivain de journal refuse une rectification inopérante et le contrôle exige une date estimée lisible ; recette de forge-agents 141 sur 141 ; publié jusqu'à a52cbdd ;
  - pilot, 2 lots fusionnés sans conflit (TF-2586, TF-2587, TF-2588, TF-2589, TF-2590) : recette entière 285 sur 286, 6 hausses de cliquet enregistrées.
- TF-2587, accord des 2 juges : j'ai fait aligner le pilot sur forge-agents pour la date estimée des rectifications, puis vidé les 2 listes de divergences tolérées de forge-agents ; sa recette rend 141 sur 141 sans aucune divergence imprimée contre le pilot fusionné.
- La recette entière a signalé une écriture dans l'arbre suivi : ce sont les modifications non enregistrées d'une autre session (`scripts/relever-flotte.mjs`, `oracles/oracle-suivi-agents.mjs`), que je n'enregistre pas ; de même pour l'échec de quality-oracles sur oeil-critique dans forge-agents, dont l'état publié reste cohérent (1.5.2 des deux côtés).
- Registre : 9 clôtures avec leur descente, TF-2591 écarté avec son motif ; 7 candidats inscrits (TF-2592 à TF-2598, journalisés par `todo/journaliser.mjs`), dont le faux refus du hook de remise qui a bloqué le rapport détaillé de l'agent de forge-agents.

Relecture d'intention : sert, gravité mineure, en 1 passe (RI-20261115-08) : 2 écarts mineurs, le dossier jetable laissé à votre geste et la reproduction du défaut exigée avant correction.

## 5. Non traité

- La mise à jour de 2 skills installés — motif : `gate_gouvernance`, elle exige votre accord explicite (TF-0391).
- La suppression de `C:\tmp-pb` — motif : `garde_fou`, la protection du poste la réserve à un geste humain.
- Le travail non enregistré d'une autre session, dans le pilot et dans forge-agents — motif : `garde_fou`, je n'enregistre pas le travail d'une autre session.

## 6. Écarts à la lettre

- Vous avez demandé la correction de TF-2591 → je l'ai écarté → l'agent n'a pas reproduit le défaut ; sa preuve est rapportée et non rejouée, son rapport détaillé ayant été bloqué par le hook de remise.
- TF-2587 demandait des cas d'accord sur la date estimée illisible, puis l'alignement → le pilot refuse désormais une date qui n'est pas un instant, mais seulement pour les rectifications écrites à partir du 15/11 → refuser les anciennes aurait rendu fautif pour toujours le journal d'un produit, qui porte 4 dates en prose.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Mettre à jour les skills installés forge-agents et ameliore-le-design | neuve | auto_ia | gate_gouvernance : accord humain exigé par la règle de propagation | votre « propage » | les sessions du poste exécutent les anciennes versions |
| A-2 | Supprimer les 2 dépôts jetables d'un agent avec `Remove-Item -Recurse -Force C:\tmp-pb` | neuve | manuelle_utilisateur | irreversible : la protection du poste réserve à l'humain la suppression d'un dossier de la racine du disque (refusée à la session sous PowerShell et à l'agent sous Bash) | votre geste | 741 fichiers inutiles restent sur le disque |
| A-3 | Trier les 7 candidats TF-2592 à TF-2598 | neuve | auto_ia | gate_gouvernance : le tri se demande | votre « A3 » | ils restent candidats |

## 9. Traces

Registre `todo\TODO.jsonl` (9 clôtures, TF-2591 écarté, TF-2592 à TF-2598 candidats) ; pilot, fusions 85153344 et 35b83ada, cliquet `oracles\baseline-recettes.json` ; forge-audit 2ce08a2, forge-tests 7b903e4, forge-design 9c65ac9, forge-agents a52cbdd ; recette entière dans `recette-pilot5.txt`, dossier temporaire de la session.
