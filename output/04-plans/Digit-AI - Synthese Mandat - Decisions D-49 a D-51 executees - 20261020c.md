---
destinataire: humain
---

# Synthèse Mandat — D-49, D-50 et D-51 exécutées selon l'option (a) (20/10/2026)

## 0. Synthèse d'ouverture

Les 3 réponses sont exécutées. La porte de sécurité des agents ne juge plus dangereux un agent qui porte seulement un shell : sa nouvelle version est publiée dans la forge de sécurité. Elle reste rouge pour 4 des 5 agents de la flotte, pour 2 raisons dites plus bas. La propagation des skills était déjà faite à l'ouverture de la session ce matin. Le skill LinkedIn est déclaré hors de la Factory. Une chose vous revient : publier les 3 enregistrements du pilot faits ce matin.

## 1. En-tête d'identification

Exécution de 3 décisions du pilot digit-ai-factory et de la forge digit-ai-forge-agents-security, poste Dell-XPS-16. Période : 20/10/2026, de 09:31 à 10:24, heure de Paris (UTC+02:00). Session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle : aucune.

Intention de la demande : appliquer l'option recommandée de chacune des 3 décisions et en voir l'effet mesuré.

Test rétro : le résultat sert cette intention ; l'option (a) de D-49 rend la porte plus juste, sans rendre toute la flotte verte, et cet écart est dit au lieu d'être masqué.

## 2. Verdict en une ligne

3 décisions exécutées, forge de sécurité publiée à `279a7f1` (self-test 55/55), agent `campagne` passé de FAIL à PASS, 3 items clos au registre (`verdict_apres` PASS), pilot 3 enregistrements en avance de GitHub.

## 3. Décisions attendues

> **D-52 — Puis-je publier sur GitHub les 3 enregistrements du pilot faits ce matin après la synchronisation ?**
>
> De quoi s'agit-il : la branche main de `digit-ai-factory`, qui porte 3 enregistrements locaux : la synthèse de synchronisation, celle du détail des décisions, et l'exécution des 3 décisions (`references/RUN-RESEAU.md`, `todo/TODO.jsonl`).
>
> Le problème : sans publication, l'autre poste ne voit pas que D-49 à D-51 sont tranchées et pourrait les reposer, comme le 19/10.
>
> Pourquoi vous : la règle de publication du pilot réserve tout envoi du pilot à votre feu vert, et votre réponse de ce matin ne visait que la synchronisation.
>
> **Recommandation : (a).** Source consultée : `git rev-list --left-right --count HEAD...origin/main` rend `3 0` à 10:22.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Publier maintenant | Les 3 enregistrements partent ; la garde des noms dure environ 19 minutes | Simple × court | `git revert` des enregistrements |
| (b) Publier à la prochaine synchronisation | Ils restent sur ce poste jusque-là | Nul | Sans objet |

> **Sans réponse** : (b), rien n'est publié.

## 4. Traité

Chaque option a été exécutée puis mesurée par son contrôle.

- D-49, option (a), dans `digit-ai-forge-agents-security` : `oracle-scan-agentdef` passe en 0.2.0 ; le réseau ne compte plus que par un outil réseau déclaré (`WebFetch`, `WebSearch`). Un shell sans outil réseau laisse une note « mineur », non bloquante.
- Fixtures de D-49 : la fixture `rouge-bash-seul.yaml` requalifiée en `vert-bash-seul.yaml`, et une nouvelle fixture `rouge-bash-reseau.yaml` (Bash avec `WebFetch`) qui rend FAIL ; self-test de la forge 55 PASS, 0 FAIL, contre 54 avant.
- Effet sur la flotte du pilot, mesuré agent par agent : `campagne` passe de FAIL à PASS. `constructeur` et `redacteur` restent FAIL, car ils déclarent `WebFetch`, `Write` et `Read`, la combinaison que l'option garde rouge. `explorateur` et `verificateur` restent FAIL sur une autre règle, celle des permissions plus larges que le mandat (un mandat de lecture qui reçoit Bash).
- Publication de la forge : `git push` puis `git rev-list --left-right --count HEAD...origin/main` rend `0 0` à `279a7f1`.
- D-50, option (a) : la propagation était déjà faite par le hook d'ouverture à 08:47, avec 6 poses journalisées dans `propagations-skills.jsonl` ; les 5 skills sont identiques à leurs sources dans les 2 profils, et `oracle-skills.mjs` rend PASS.
- D-51, option (a) : `references/RUN-RESEAU.md` déclare `linkedin-post-generator` hors de la Factory et nomme sa règle sans source ; `run-oracles` rend PASS.
- Registre : 3 événements écrits par `todo/journaliser.mjs`, `verdict_apres` PASS ; TF-1935 et TF-1931 passent au statut clos, avec le self-test rouge → vert de la fixture `rouge-bash-reseau.yaml` pour le premier ; TF-1929 porte la propagation constatée.
- Relecture d'intention : sans objet, exécution d'options déjà écrites et mesurées.

## 5. Non traité

- Les 71 agents d'Everything Claude Code n'ont pas été remesurés avec la nouvelle porte — motif : hors_mandat, la décision portait sur la flotte du pilot ; repris en A-1.
- La règle des permissions plus larges que le mandat, qui garde `explorateur` et `verificateur` en rouge — motif : hors_mandat, D-49 ne visait que la combinaison réseau, écriture et lecture ; repris en A-2.
- La publication du pilot — motif : decision, elle attend D-52.

## 6. Écarts à la lettre

Un résultat diffère de ce que l'option annonçait.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-49 (a) : qu'un agent de flotte ordinaire passe | 1 agent sur 5 passe | 2 agents cumulent un vrai outil réseau avec l'écriture, et 2 échouent sur une autre règle que celle de la décision |
| D-50 (a) : propager tout de suite | Constaté la propagation, sans la rejouer | Le hook d'ouverture l'avait faite à 08:47 ; la rejouer n'aurait rien changé |

## 7. Risques

- 6 produits rendront FAIL au contrôle de surface à leur prochain run de conception.
  - Énoncé : avec l'option (a) de D-50, les 3 nouvelles clés de la surface implicite sont bloquantes tout de suite.
  - Signal : un run de conception qui échoue sur le consentement aux traceurs, la politique de confidentialité ou l'aperçu de partage.
  - Parade : le produit écarte la clé avec un motif, ou la livre.
- Un agent de la flotte refusé par la porte au moment de l'admettre.
  - Énoncé : 4 agents sur 5 restent rouges.
  - Signal : un FAIL de `oracle-scan-agentdef` sur `constructeur`, `redacteur`, `explorateur` ou `verificateur`.
  - Parade : une dérogation datée par agent, ou la décision de l'action A-2.

## 8. Prochaines actions

Ordre : la mesure du corpus tiers d'abord, parce qu'elle dit si la porte recalibrée sert ; la règle des permissions ensuite ; la publication quand D-52 est tranchée.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1935 | Remesurer les 71 agents d'Everything Claude Code avec la porte 0.2.0 | auto_ia | hors_mandat : hors des 3 décisions | `node oracles/oracle-scan-agentdef.mjs <agent>` dans `digit-ai-forge-agents-security` | Le gain sur le corpus tiers reste inconnu |
| **A-2** | neuve | Instruire la règle des permissions plus larges que le mandat pour les agents de lecture qui portent Bash | auto_ia | hors_mandat : hors des 3 décisions | `node todo/journaliser.mjs --fichier <candidat.json>` | 2 agents de la flotte restent rouges |
| **A-3** | neuve | Publier les 3 enregistrements du pilot | auto_ia | dependance_bloc_3 : attend D-52 | `git push origin main` | L'autre poste ne voit pas les 3 décisions tranchées |

## 9. Traces

- Forge de sécurité : `279a7f1`, fichiers `oracles/oracle-scan-agentdef.mjs`, `oracles/self-test.mjs`, `fixtures/agentdef/vert-bash-seul.yaml`, `fixtures/agentdef/rouge-bash-reseau.yaml`, `README.md`
- Pilot : `4fa21585` (exécution), `fb86c2d9` et `487e3a49` (synthèses)
- Événements journalisés : `c:/dev/_sauvegardes/synchro-20261020/ev-d49-51.json`
- Registre : `decisions/REGISTRE.jsonl` (D-52)
