---
destinataire: humain
---

# Synthèse Mandat — recette complète du pilot jouée : 2 contrôles en défaut sur 221, aucun dû aux six travaux (15/10/2026)

## 0. Synthèse d'ouverture

La recette complète du pilot, attendue à la synthèse précédente, est terminée. Deux contrôles sur 221 sont en défaut, et j'ai vérifié qu'aucun ne vient des six travaux du soir. Le premier échoue aussi sans eux, et le second dépend de l'endroit où la copie du pilot est posée sur le disque. Cela peut compter au moment de publier : la garde de publication rejoue cette recette et pourrait refuser l'envoi pour ces deux raisons. Vos décisions sont inchangées ; la première, la publication, reste la plus utile à trancher.

## 1. En-tête d'identification

Synthèse de mise à jour de la synthèse « Six travaux faits et onze fiches », sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 15/10/2026 de 22:20 à 22:30, heure de Paris (UTC+02:00), soit 10 min. Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : que les six travaux de la réponse « 1a » soient sûrs à publier, sans rien casser ailleurs dans le pilot.

Test rétro : le résultat sert cette intention. La recette complète est jouée, et chaque défaut est rejoué sur la base sans mes changements, pour les attribuer avant de vous les présenter.

## 2. Verdict en une ligne

Recette complète : 219 contrôles sur 221 au vert ; 2 en défaut, 0 imputable aux six travaux (1 présent sur la base, 1 dû à l'emplacement de l'arbre de travail) ; 202 recettes vertes sur 206 jouent leur cas rouge.

## 3. Décisions attendues

Un bloquant reste : la publication du pilot, bloquée faute de votre feu vert ; si rien n'est fourni, les dix enregistrements restent sur ce poste et les produits ne reçoivent pas les corrections du jour. Les décisions de la synthèse précédente sont inchangées :

- **D-2** : publication des dix enregistrements du pilot, posée le 15/10 à 22:20, inchangée.
- **D-3** : purge de l'histoire publiée, posée le 15/10 à 22:20, inchangée.
- **D-4** : sigle de projet à protéger, posée le 15/10 à 22:20, inchangée.
- **D-5** : rattachement des deux pseudonymes, posée le 15/10 à 22:20, inchangée.
- **D-6** : dépense de la campagne d'agents, posée le 15/10 à 22:20, inchangée.
- **D-7** : doctrine contre référentiel d'audit, posée le 15/10 à 22:20, inchangée.
- **D-8** : garde-fous du dossier englobant, posée le 15/10 à 22:20, inchangée.
- **D-9** : garde du puits sous PowerShell, posée le 15/10 à 22:20, inchangée.
- **D-10** : secret client du guide, posée le 15/10 à 22:20, inchangée.
- **D-11** : consignation des verdicts par contrôle, posée le 15/10 à 22:20, inchangée.
- **D-12** : deux règles de page perdues, posée le 15/10 à 22:20, inchangée.
- **D-13** : trois valeurs du premier cas de publications, posée le 15/10 à 22:20, inchangée.

## 4. Traité

- **Recette complète du pilot jouée sur la branche des six travaux.** `node oracles/self-tests.mjs` : « 2/221 oracle(s) en défaut : oracle-run-reseau.mjs, oracle-skills.mjs ».
- **Contrôle des skills : défaut présent sans mes changements.** `oracle-skills.mjs --self-test` rend « 96/98 » sur l'arbre principal, à la base de ma branche, avec les mêmes 2 cas en échec (règle K11, copie identique à un état antérieur de la source).
- **Contrôle des publications sur les réseaux : défaut dû à l'emplacement de l'arbre.** Sur l'arbre principal : « 27/27 PASS ». Sur la même base posée en arbre séparé au même niveau que le mien : « FAIL ». Mes changements ne touchent aucun fichier que ce contrôle lit ; l'arbre de contrôle a été retiré.
- **Cas rouges des recettes.** « 202/206 recette(s) verte(s) déclarent au moins un cas ROUGE joué » ; les 4 autres sont en avertissement jusqu'au 20/10, aucune n'est touchée par les six travaux.

## 5. Non traité

- **Cause du défaut K11 du contrôle des skills.** Motif : présent sur la base sans mes changements ; à instruire hors de ce mandat, et il pourrait faire refuser la publication (D-2).
- **Cause de la dépendance du contrôle des publications à l'emplacement de l'arbre.** Motif : non instruite ; une publication depuis l'arbre principal ne la rencontre pas.
- **Écriture de l'index du dossier des comptes rendus pendant la recette.** Motif : signalée par la recette (règle I7) ; l'index est aussi régénéré à chaque écriture par le hook de ce poste, cause non départagée.

## 6. Écarts à la lettre

Aucun écart : la recette attendue est jouée et ses défauts sont attribués.

## 7. Risques

- **La garde de publication refuse l'envoi.**
  - Énoncé : elle rejoue la recette complète, et les 2 défauts pourraient l'arrêter même s'ils ne viennent pas des six travaux.
  - Signal : un refus de la garde à la publication de D-2 (a).
  - Parade : publier depuis l'arbre principal, ce qui écarte le défaut lié à l'emplacement ; le défaut K11 se corrige à part.

## 8. Prochaines actions

La publication vient d'abord, la correction du défaut des skills ensuite, parce qu'elle peut conditionner la première.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1821 | Publier les dix enregistrements du pilot selon D-2 | auto_ia | dependance_bloc_3 : attend D-2 | `FORGE_PUSH_GO="D-2 (a) du 15/10" git -C .claude/worktrees/c2-lot push origin HEAD:main` | Les produits ne reçoivent pas les corrections du jour |
| **A-2** | `neuve` | Instruire le défaut K11 du contrôle des skills | auto_ia | gate_gouvernance : un constat neuf entre en candidat | `node oracles/oracle-skills.mjs --self-test` | La garde de publication peut refuser tout envoi du pilot |
| **A-3** | `neuve` | Trancher D-2 à D-13 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `2a, 3b, 4a` | Les options par défaut s'appliquent |

## 9. Traces

- Journal de la recette complète : sortie de `node oracles/self-tests.mjs` sur la branche `c2-sujets-traitables`
- Synthèse précédente : `output/04-plans/Digit-AI - Synthese Mandat - Six travaux faits et onze fiches - 20261015l.md`
