---
destinataire: humain
---

# Synthèse Mandat — seuil relevé à 4 millions, boucle de correction et relecteur renforcé en place sur le poste (18/10/2026)

## 0. Synthèse d'ouverture

Vos réponses « 25 » et « 26 : a » sont exécutées, sur ce poste et sans enregistrement pour l'instant. Le seuil de dépense de l'essai est à 4 millions de jetons par jour, et les relectures ont repris. Quand le relecteur signale un écart qui sort de votre demande, la flotte peut désormais le corriger elle-même puis le faire relire à nouveau, au plus 2 fois. Ce qui résiste, ou ce qui relève de votre choix, vous est posé. Le relecteur reçoit aussi les règles de la Factory propres à chaque type de travail : 40 règles sourcées, dont les 3 que les dérives des produits avaient enfreintes. Il compte comme majeur un contenu visible ajouté sans demande, et il voit enfin ce qu'écrivent les sous-agents. La relecture de ce tour, faite avec ces nouveaux outils, rend « sert ». Une décision vous revient, D-27 : enregistrer et publier, pour que les produits en profitent.

## 1. En-tête d'identification

Exécution de D-25 et de D-26 (a) du 18/10/2026, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 18/10/2026, de 15:20 à 17:15, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5. 3 agents délégués : 1 `campagne` (Claude Sonnet 5.5) pour la mise en place, 2 `verificateur` (Claude Sonnet 5.5) pour la relecture de sa consigne et la relecture de fin de tour. Escalade de modèle : aucune. L'autre session du poste emploie aussi l'essai : 6 des 10 relectures consignées sont les siennes.

Intention de la demande : que l'essai ne s'arrête pas pour une mesure ponctuelle, et que les alertes servent au résultat final sans attendre votre intervention, avec un relecteur qui voit les règles et le travail entier.

Test rétro : le résultat sert cette intention. Le seuil est relevé, la boucle et les 3 ajouts sont en place et passent leurs recettes, et la relecture de ce tour les a employés. Ce qui reste : la publication, qui attend votre accord, et la mesure de la boucle sur des écarts réels, qui viendra avec l'essai.

## 2. Verdict en une ligne

Seuil à 4 000 000 de jetons par jour ; recette du script de relecture 64 cas verts (33 avant), juge des restitutions 206 sur 206 (199 avant), recette complète 226 sur 227, rapporté par l'agent, non recompté, l'échec restant étant préexistant ; relecture de fin de tour : sert ; dépense du jour 1 409 996 jetons ; rien d'enregistré.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-27 — Puis-je enregistrer et publier la boucle de correction, le relecteur renforcé et le nouveau seuil ?**
>
> - **De quoi s'agit-il** : dans le pilot, le script de relecture en version 2, le référentiel des règles par type de travail, le référentiel de l'essai, la règle de restitution 2.46.0, l'héritage 1.35.0, le juge des restitutions, le relevé de dépense et leurs recettes, ainsi que le registre des relectures.
> - **Le problème** : tant que rien n'est publié, la boucle et le nouveau seuil ne valent que sur ce poste ; les produits et l'autre poste gardent le relecteur de ce matin et le seuil de 1 million.
> - **Pourquoi vous** : votre règle exige un accord explicite pour enregistrer et publier.
> - **Recommandation : (a)** — les recettes touchées passent, et l'échec restant de la recette complète existait avant ces changements. Source consultée : `REGLES-PROJET.md`, R-38, sur le push d'un dépôt sous GO humain ; le rapport de l'agent de mise en place, vérifié par sondage.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Enregistrer et publier | Les produits reçoivent la boucle, les règles et le seuil à leur prochaine ouverture | Faible × court, environ 11 min pour la garde de publication du pilot | Possible, par un enregistrement correctif |
| (b) Enregistrer sans publier | Le travail est sauvé sur ce poste, et ne court ni chez les produits ni sur l'autre poste | Faible × court | Possible |
| (c) Ni l'un ni l'autre | Le travail reste sur ce disque, partagé avec une autre session qui écrit dans les mêmes fichiers | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est enregistré.

## 4. Traité

Chaque élément du tour, avec sa preuve.

- **Seuil relevé à 4 000 000 de jetons par jour (D-25).** Constante du relevé, référentiel et 3 recettes ajustées pour que le sens rouge franchisse toujours le seuil. Preuve : `relever-flotte` 11 cas verts, `relecture-intention` vert, recette d'ouverture 38 cas verts ; relevé du jour « seuil de 4 000 000 jetons par jour tenu ».
- **Relecture de la consigne de l'agent, avec l'outil de l'essai.** Verdict « sert » (RI-20261018-08). L'outil n'avait pas retrouvé D-24 à D-26 ; je les ai ajoutées à la main, et la correction a été confiée à l'agent.
- **Boucle de correction (D-26 (a)).** Chaque écart porte sa nature, « hors de la demande » ou « choix humain » ; les passes se chaînent, 2 au plus ; l'écart qui résiste est posé. Preuve : 17 cas dédiés, rouges et verts, dans la recette du script, qui passe de 33 à 64 cas.
- **Règles applicables par type de travail.** `references/RELECTURE-INTENTION-REGLES.json`, 40 règles, chacune sourcée et rejouée par la recette, dont le composant de filtres d'une page, la cascade d'un produit et l'interdiction d'un contenu visible ajouté sans demande. Preuve : la recette rejoue chaque source.
- **Consigne du relecteur, version 2.** La consigne stricte du matin en tête, mot pour mot, puis les 3 ajouts. Preuve : un cas de recette vérifie l'égalité avec la mesure du matin.
- **Travail des sous-agents relu.** La préparation de fin de tour ajoute les fichiers du dépôt modifiés depuis votre dernier message et les écritures des sous-agents, avec des bornes dites. Preuve : sur ce tour, 18 fichiers du dépôt et 52 écritures de sous-agents relevés.
- **Reconnaissance de vos réponses.** « 24a + … » et « 25 … 26 : a » retrouvent désormais leurs décisions. Preuve : avant, aucune décision retrouvée ; après, D-24, puis D-25 et D-26.
- **Doctrine.** Règle de restitution 2.46.0 (« sert après N passe(s) »), juge des restitutions à 206 cas sur 206, héritage 1.35.0, une phrase dans le contrat d'interface et dans le gabarit de campagne, index des références complété par moi. Preuve : `oracle-synthese --self-test` 206 sur 206, rejoué par moi.
- Relecture d'intention : sert — RI-20261018-10, consigne version 2, type code et doctrine, un écart mineur (le correctif de reconnaissance ajouté au mandat).

## 5. Non traité

- **La mesure de la boucle sur des écarts réels.** Motif : aucune alerte n'est encore passée par la boucle ; la revue du 08/11 la comptera (colonnes « levées sans l'humain » du relevé).
- **L'échec préexistant de la recette complète, dans le contrôle des copies installées des skills.** Motif : il existait avant ces changements, sur l'état enregistré ; il ne relève pas de ce mandat.

## 6. Écarts à la lettre

Deux écarts, déclarés.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-26 (a) : la boucle et 3 ajouts au relecteur | J'y ai ajouté la reconnaissance de vos réponses de décision | L'outil manquait D-24 à D-26 : sans elle, le relecteur ne voit pas ce que vous avez décidé |
| « 25 relever le seuil à 4 millions » | Le seuil vaut pour tous les jours de l'essai, pas seulement aujourd'hui | C'est la lecture la plus simple de votre réponse ; dites-le si vous le vouliez pour aujourd'hui seulement |

## 7. Risques

- **La nature des écarts est jugée par le relecteur, sans mesure.**
  - Énoncé : un écart classé « hors de la demande » à tort serait corrigé sans vous.
  - Signal : une correction automatique que vous contestez.
  - Parade : dans le doute, le relecteur classe en « choix humain », et la boucle ne touche jamais une décision que vous avez prise.
- **2 sessions écrivent dans les mêmes fichiers.**
  - Énoncé : l'autre session emploie aussi l'essai et modifie le pilot pendant mes tours.
  - Signal : un fichier modifié sans que je l'aie écrit.
  - Parade : enregistrer mes seuls chemins, comme ce matin, et relire chaque fichier avant de l'écrire.

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, l'enregistrement avant la revue ; votre réponse ensuite, parce que ces gestes l'attendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1865 | Enregistrer mes seuls chemins et publier sous la garde | auto_ia | dependance_bloc_3 : attend D-27 | `git commit --only -- <chemins>`, puis `git push` | Les produits gardent le relecteur du matin |
| **A-2** | TF-1865 | Revue de l'essai, boucle comprise | auto_ia | dependance_externe : la revue est datée du 2026-11-08 | `node scripts/relecture-intention.mjs --releve --depuis 2026-10-18` | La boucle n'est pas évaluée |
| **A-3** | `neuve` | Trancher D-27 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `27a` | L'option (c) s'applique |

## 9. Traces

- Script et règles : `scripts/relecture-intention.mjs` (2.0.0), `references/RELECTURE-INTENTION-REGLES.json`, `references/RELECTURE-INTENTION.md`
- Registre des relectures : `todo/relectures-intention.jsonl` (10 relectures, dont RI-20261018-08 et RI-20261018-10 de ce tour)
- Rien n'est enregistré ni poussé.
