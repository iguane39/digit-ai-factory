---
destinataire: humain
---

# Synthèse Mandat — D-49, D-50 et D-51 détaillées (20/10/2026)

## 0. Synthèse d'ouverture

Voici les 3 décisions en entier, sous leurs nouveaux numéros. Ce sont les décisions posées hier soir sous D-43, D-44 et D-45, renumérotées ce matin à la synchronisation des 2 postes. Le texte, les options et les recommandations sont repris mot pour mot de la synthèse du 19/10 ; rien n'a changé depuis. Une réponse comme « 49a 50b 51a » suffit.

## 1. En-tête d'identification

Détail de 3 décisions du pilot digit-ai-factory, poste Dell-XPS-16. Période : 20/10/2026, de 09:27 à 09:30, heure de Paris (UTC+02:00). Session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle : aucune.

Intention de la demande : pouvoir trancher D-49, D-50 et D-51 sans rouvrir la synthèse d'hier.

Test rétro : le résultat sert cette intention ; chaque décision est rendue en entier avec ses options.

## 2. Verdict en une ligne

3 décisions rendues en entier (recommandations : D-49 a, D-50 b, D-51 a), aucun geste exécuté.

## 3. Décisions attendues

> **D-49 — Faut-il requalifier la fixture de sécurité qui juge dangereux tout agent portant Bash, pour calibrer oracle-scan-agentdef ?**
>
> De quoi s'agit-il : la porte de sécurité des agents `oracle-scan-agentdef.mjs`, qui vit dans `digit-ai-forge-agents-security` ; son self-test impose que la fixture `rouge-bash-seul.yaml` reste rouge.
>
> Le problème : la porte rend FAIL sur les 5 agents de la flotte sur 5, et sur 55 des 71 agents d'Everything Claude Code ; elle ne distingue donc plus un agent ordinaire d'un agent dangereux.
>
> Pourquoi vous : requalifier cette fixture assouplit une porte de sécurité, ce qu'aucun agent ne fait sans votre accord.
>
> **Recommandation : (a).** Source consultée : la mesure de l'agent de campagne du 19/10 à 18:26, 5 FAIL sur 5, et l'étude `output\03-etudes\20261019-etude-opportunite-packs-agents-skills-tiers.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Requalifier : Bash seul passe, Bash avec une capacité dangereuse réelle reste rouge | Un agent de flotte ordinaire passe ; les fixtures rouges de combinaison dangereuse restent rouges | Simple × court | Annuler le commit dans la forge |
| (b) Garder la porte et exiger une dérogation écrite pour chaque agent qui porte Bash | Les 5 agents de la flotte reçoivent une dérogation datée | Simple × court | Retirer les dérogations |
| (c) Ne rien changer | La porte reste rouge sur toute la flotte | Nul | Sans objet |

> **Sans réponse** : (c), la porte reste telle quelle.

> **D-50 — Faut-il propager maintenant aux skills installés les modifications de conception et de design, sachant que 6 produits verront le contrôle de surface échouer tant qu'ils n'écartent pas les 3 nouveaux éléments ?**
>
> De quoi s'agit-il : les copies installées de `qualifie-l-entrant`, `enumere-la-surface`, `redige-les-exigences`, `derive-les-vues` et `systeme-de-marque`, que `node oracles/oracle-skills.mjs` déclare divergentes de leurs sources publiées.
>
> Le problème : le contrôle de surface de `digit-ai-forge-conception` 1.5.0 exige 16 éléments au lieu de 13 ; 6 produits dont le référentiel en porte 13 rendraient FAIL à leur prochain run de conception.
>
> Pourquoi vous : la propagation touche les produits, et l'outil demande une décision explicite avant `--appliquer`.
>
> **Recommandation : (b).** Source consultée : le rapport de l'agent de la forge de conception, qui relève les 6 produits par recherche texte, et `oracles\oracle-skills.mjs`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Propager tout de suite, par `node oracles/oracle-skills.mjs --appliquer` joué par moi | Les postes ont les nouvelles versions ; les 6 produits échouent au contrôle de surface jusqu'à ce qu'ils écartent les 3 éléments | Simple × court | Réinstaller les versions précédentes |
| (b) Rendre d'abord les 3 nouveaux éléments avertissants jusqu'au 30/11, puis propager | Aucun produit n'échoue ; chacun voit l'avertissement et a 6 semaines pour trancher | Simple × court | Remettre la règle bloquante |
| (c) Ne pas propager | Les postes gardent les anciennes versions et le contrôle des skills reste rouge | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est propagé.

> **D-51 — Faut-il corriger le skill linkedin-post-generator sur le compte claude.ai, ou le déclarer hors de la Factory ?**
>
> De quoi s'agit-il : le skill `linkedin-post-generator`, dont la seule copie est synchronisée depuis votre compte claude.ai, hors de tout dépôt de `C:\dev`.
>
> Le problème : sa page `references/algorithme-best-practices.md` affirme « 70 % de la portée totale » en une heure sans source, ce que `references\RUN-RESEAU.md` refuse dans un skill.
>
> Pourquoi vous : le skill vit sur votre compte, et le rattacher ou non à la Factory est un choix de périmètre.
>
> **Recommandation : (a).** Source consultée : recompté par moi le 19/10 à 19:33, `grep` des `SKILL.md` nommés `linkedin-post-generator` dans les dépôts `C:\dev\digit-ai-*` rend 0 fichier, et l'item TF-1157 qui le disait déjà hors de toute forge.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Le déclarer hors de la Factory et le signaler dans le référentiel des runs de réseau | Le skill reste tel quel, mais un run de réseau sait que ses chiffres ne sont pas sourcés | Simple × court | Retirer la mention |
| (b) Le reprendre dans `digit-ai-forge-agents` comme source versionnée, corrigée | La règle sans source est retirée et le skill passe sous les contrôles des forges | Moyen × court | Retirer le skill de la forge |
| (c) Ne rien faire | La règle sans source reste dans le skill | Nul | Sans objet |

> **Sans réponse** : (c), le skill reste tel quel.

## 4. Traité

La demande ne portait que sur le détail ; rien n'a été modifié.

- Texte repris de `output/04-plans/Digit-AI - Synthese Mandat - Campagne D-41 - 20261019e.md`, lu à 09:28 ; seuls les numéros changent, selon le registre `decisions/REGISTRE.jsonl` (champ `renumerote_de`).
- Relecture d'intention : sans objet, simple restitution d'un texte existant.

## 5. Non traité

- L'exécution des options — motif : decision, elle attend vos réponses.

## 6. Écarts à la lettre

Aucun écart : les 3 décisions sont rendues comme demandé.

## 7. Risques

- Une réponse sous les anciens numéros.
  - Énoncé : sur GitHub, D-43 à D-45 désignent d'autres questions.
  - Signal : « 43a », « 44b » ou « 45a ».
  - Parade : je la lis comme D-49 à D-51 et je le dis.

## 8. Prochaines actions

Ordre : la porte de sécurité d'abord, parce qu'elle bloque l'admission des agents ; puis la propagation, puis le skill LinkedIn.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1935 | Calibrer la porte de sécurité des agents selon l'option retenue | auto_ia | dependance_bloc_3 : attend D-49 | `node oracles/self-test.mjs` dans `digit-ai-forge-agents-security` | La porte reste rouge sur toute la flotte |
| **A-2** | TF-1929 | Propager les skills modifiés selon l'option retenue | auto_ia | dependance_bloc_3 : attend D-50 | `node oracles/oracle-skills.mjs --appliquer` | Les postes gardent les anciennes versions |
| **A-3** | TF-1931 | Traiter le skill LinkedIn selon l'option retenue | auto_ia | dependance_bloc_3 : attend D-51 | `node todo/journaliser.mjs` | La règle sans source reste en service |

## 9. Traces

- Source des décisions : `output/04-plans/Digit-AI - Synthese Mandat - Campagne D-41 - 20261019e.md`
- Registre : `decisions/REGISTRE.jsonl`
