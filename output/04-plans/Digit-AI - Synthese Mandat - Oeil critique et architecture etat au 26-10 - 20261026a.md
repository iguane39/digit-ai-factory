---
destinataire: humain
---

# Synthèse Mandat — œil critique et architecture de la Factory : état au 26/10/2026

## 0. Synthèse d'ouverture

Le diagnostic d'œil critique du 21/10 propose 4 transformations de la Factory ; seul le dispositif d'analyse continue (le skill `oeil-critique`) a été décidé et construit. Les transformations elles-mêmes, dont la refonte d'architecture entre le pilot, les forges et les produits, n'ont reçu aucune réponse : rien n'a changé dans le fonctionnement. Le skill n'a jamais tourné, et sa description trop longue bloque sa propagation depuis ce matin. Je vous pose 4 décisions : les transformations T1 à T3, l'architecture T4, la règle anti-inflation, la publication du pilot.

## 1. En-tête d'identification

Synthèse demandée · sur le pilot digit-ai-factory et la forge digit-ai-forge-agents · le 26/10/2026 à 10:22 (heure de Paris, UTC+1) · Claude Opus 5.5, lecture seule hors cette synthèse et 4 réservations de décision.

Intention : vous donner, sur une page, où en est le sujet œil critique, ce qui vous revient de trancher et ce qui suit. Test rétro : la synthèse sert l'intention, car elle sépare ce qui est fait de ce qui attend votre réponse et chiffre chaque point depuis les fichiers.

## 2. Verdict en une ligne

Dispositif construit mais jamais lancé ; les 4 transformations du diagnostic attendent votre réponse depuis le 21/10.

## 3. Décisions attendues

> **D-68 — Faut-il engager les transformations T1, T2 et T3 du diagnostic d'œil critique, dans cet ordre ?**
>
> - **De quoi s'agit-il** : T1 met vos préférences et les conventions de chaque client dans un fichier unique chargé partout, et trie chaque retour en 3 voies ; T2 allège le compte rendu (9 blocs gardés, blocage sur 2 motifs seulement, gabarit de 182 Ko ramené vers 130 Ko) ; T3 fait écrire 3 lignes au tour 1 (je livre, je suppose, je mobilise) à la place de la relecture d'intention après son essai du 01/11.
> - **Le problème** : 35 de vos 105 corrections en 30 jours répètent une consigne déjà donnée, et environ 40 % des appels d'outils servent l'appareil plutôt que la demande.
> - **Pourquoi vous** : T2 et T3 changent la doctrine de restitution et retirent un dispositif en essai.
> - **Recommandation : (a)** — c'est l'ordre recommandé par le diagnostic, du gain le plus sûr au plus incertain. Source consultée : `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md`, sections d et i.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* T1, puis T2, puis T3 | Trois campagnes successives, chacune mesurée par les indicateurs du §g avant la suivante | moyen × moyen | chaque transformation se défait seule |
| **(b)** T1 seule | Les récidives de préférence sont traitées ; le compte rendu et le tour 1 restent tels quels | faible × court | retirer le fichier |
| **(c)** Rien | La relecture d'intention finit son essai le 01/11 sans remplaçant | nul | sans objet |

> **Sans réponse** : (c), rien n'est transformé.

> **D-69 — Faut-il modifier l'architecture des produits selon T4 : carte type de demande → forges → livrables, verrou « livré » sur les fichiers, héritage réduit à la ligne du type ?**
>
> - **De quoi s'agit-il** : une carte unique en 7 types (produit neuf, évolution d'application, audit, site web, données, agents, document) qui dit quelles forges une demande mobilise et quels fichiers doivent exister avant « livré » ; le `CLAUDE-PRODUIT.md` hérité (25,8 Ko) se réduit au noyau commun et à la ligne du type du produit.
> - **Le problème** : sur 10 produits clos ou publiés, 2 seulement portent leurs 4 livrables de forge ; Produit-82 s'est déclaré complet le 14/10 sans exigences, sans design et sans audit de tests.
> - **Pourquoi vous** : c'est un changement d'architecture qui touche tous les produits, et la carte de départ du §d est à valider ou corriger.
> - **Recommandation : (a)** — la même carte sert le verrou et l'allègement, et elle câble le contrat « prêt client » existant au lieu d'en créer un. Source consultée : diagnostic 20261021a, §c-D2 et §d-D2.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Carte de départ validée, verrou et héritage réduit | Chaque produit annonce ses forges au tour 1 ; « livré » exige les fichiers de son type | moyen × moyen | rétablir l'héritage complet |
| **(b)** Carte et verrou, héritage inchangé | Le verrou tient ; le contexte d'ouverture d'un produit reste à 19 144 caractères en médiane | moyen × court | retirer le verrou |
| **(c)** Rien | Un produit peut encore se dire livré sans ses forges | nul | sans objet |

> **Sans réponse** : (c), l'architecture reste inchangée.

> **D-70 — Faut-il adopter la règle anti-inflation et ses plafonds, avec les 3 indicateurs de pilotage, pour le pilot et les forges ?**
>
> - **De quoi s'agit-il** : tout ajout de règle, d'oracle ou de hook retire autant dans sa famille ; plafonds à 6 Ko pour l'héritage d'un produit et 130 Ko pour le gabarit ; 3 indicateurs (demandes reprises 17,5 %, consignes répétées 35 par mois, 2,0 messages par demande).
> - **Le problème** : en 30 jours, le pilot a gagné 277 fichiers de process pour 2 retirés, les forges 482 pour 0 ; l'autre poste propose encore un relecteur neuf avant affichage (TF-1944 sur GitHub, 0,3 à 2,9 millions de jetons par jour).
> - **Pourquoi vous** : c'est une règle de doctrine qui s'impose à tout ajout futur, y compris aux propositions en cours.
> - **Recommandation : (a)** — le seul fichier plafonné, le `CLAUDE.md` du pilot, est resté stable pendant que les autres triplaient. Source consultée : diagnostic 20261021a, §f et §g.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Règle, plafonds et indicateurs adoptés | TF-1944 et tout ajout futur passent par une-entrée-une-sortie | faible × court | lever la règle |
| **(b)** Indicateurs seuls | La croissance se mesure sans être bornée | faible × court | sans objet |
| **(c)** Rien | Chaque reproche continue de devenir un contrôle de plus | nul | sans objet |

> **Sans réponse** : (c), aucune règle n'est adoptée.

> **D-71 — Puis-je publier le pilot sur GitHub après l'avoir rebasé sur les 17 commits de l'autre poste ?**
>
> - **De quoi s'agit-il** : le pilot local a 11 commits d'avance et 17 de retard sur GitHub, mesuré à 10:22 par `git rev-list --left-right --count main...origin/main`.
> - **Le problème** : les 2 postes ont frappé les mêmes numéros, TF-1936 à TF-1942 et D-53 à D-56 ; le TF-1942 local (skill d'œil critique) et celui de GitHub (permissions d'un produit) sont deux sujets différents.
> - **Pourquoi vous** : publier le pilot attend votre feu vert.
> - **Recommandation : (a)** — tant que le pilot n'est pas publié, l'autre poste n'a ni la section « Œil critique » ni le repère d'analyse. Source consultée : mémoire « Rebase du pilot entre 2 postes » (renuméroter la version locale avant l'union).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Rebaser, renuméroter les numéros locaux en collision, publier | L'autre poste reçoit le dispositif ; les synthèses locales citent les nouveaux numéros | moyen × court | revert des commits publiés |
| **(b)** Rebaser sans publier | Le pilot local est à jour ; GitHub reste en retard | moyen × court | sans objet |
| **(c)** Rien | La divergence grandit à chaque session des 2 postes | nul | sans objet |

> **Sans réponse** : (c), le pilot reste divergé.

## 4. Traité

- Chronologie reconstituée depuis le git du pilot : 3 études et 2 analyses L99 le 20/10, diagnostic versions b puis c, proposition révisée 20261021a, skill décidé par vos réponses « 67a, 64a, 65a, 66a » du 21/10 (commit 829e7b8a).
- Skill `oeil-critique` 1.0.0 dans `digit-ai-forge-agents`, commit 5870e92 publié ; 5 missions, liste de modifications sans écriture de code, 5 décisions majeures au plus par exécution.
- 3 retraits faits le 21/10 : 2 sections du relevé d'ouverture remplacées, relecture d'intention non prolongée après le 01/11.
- État du skill relevé à 10:21 : `repere.mjs lire` rend `"premiere":true`, départ au 20/10, âge 6,5 jours ; aucune analyse n'a tourné.
- Décisions a à h du §i du diagnostic : aucune n'apparaît comme répondue au registre `decisions/REGISTRE.jsonl` ni au registre `todo/TODO.jsonl` (recherche de T1 à T4, « carte », « anti-inflation »).
- Divergence du pilot mesurée et collisions de numéros lues dans `git show origin/main:todo/TODO.jsonl`.
- D-68 à D-71 réservées par `scripts/reserver-decision.mjs`, verdict PASS pour chacune.
- Relecture d'intention : sans objet, synthèse en lecture seule sans livrable de code.

## 5. Non traité

- Correction de la description du skill : non faite dans ce tour, parce que vous avez demandé une synthèse ; elle passe en A-1.
- Réparation des hooks qui n'ont pas tourné dans 97 sessions (point h du diagnostic) : non instruite au registre, elle passe en A-2.
- Rebase du pilot : non fait, parce qu'il précède une publication qui attend D-71.
- Lots du sas, indices partagés et effort du poste signalés à l'ouverture : hors du sujet demandé.

## 6. Écarts à la lettre

Aucun écart : vous avez demandé une synthèse, les décisions et les prochaines étapes, et c'est ce qui est rendu.

## 7. Risques

- Énoncé : le skill n'est plus propagé, car sa description fait 1 112 caractères pour 1 024 permis. Signal : le relevé d'ouverture de 10:21 le classe en défaut. Parade : A-1.
- Énoncé : la relecture d'intention s'arrête le 01/11 sans remplaçant si D-68 reste sans réponse. Signal : 6 jours restants. Parade : répondre à D-68 avant le 01/11.
- Énoncé : l'autre poste continue d'ajouter des contrôles (TF-1944) pendant que la règle anti-inflation attend. Signal : TF-1944 en candidat sur GitHub. Parade : D-70.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 et A-2 se font sans attendre, A-3 suit D-71, A-4 suit A-1, A-5 suit vos réponses.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1942 | Ramener la description du skill sous 1 024 caractères, publier la forge, repropager | auto_ia | — | `node bootstrap.mjs --pull` après le commit dans digit-ai-forge-agents | le skill ne se déclenche plus sur les postes |
| **A-2** | aucun | Instruire la réparation des hooks « Cannot find module » | auto_ia | — | `node todo/journaliser.mjs` sur le constat du §b du diagnostic | toute mesure avant / après reste faussée |
| **A-3** | TF-1942 | Rebaser le pilot, renuméroter les collisions locales, publier | auto_ia | gate_gouvernance | `git pull --rebase origin main` puis `git push origin main` | l'autre poste reste sans le dispositif |
| **A-4** | TF-1942 | Lancer la première analyse sur chaque poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | aucune liste de modifications n'est produite |
| **A-5** | aucun | Ouvrir les campagnes T1 à T4 selon vos réponses | auto_ia | gate_gouvernance | `node todo/journaliser.mjs`, un item par transformation retenue | le diagnostic reste sans effet |

## 9. Traces

- `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md`, sections c, d, f, g, i, j.
- `output/04-plans/Digit-AI - Synthese Mandat - Skill oeil-critique installe - 20261021c.md`.
- `C:\dev\digit-ai-forge-agents\.claude\skills\oeil-critique\`, commit 5870e92.
- `decisions/REGISTRE.jsonl`, D-68 à D-71.
