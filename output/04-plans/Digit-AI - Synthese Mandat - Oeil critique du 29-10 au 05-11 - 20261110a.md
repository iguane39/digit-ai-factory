---
destinataire: humain
---

# Synthèse Mandat — Œil critique du poste, première moitié de la période due (10/11/2026)

## 0. Synthèse d'ouverture

L'œil critique a lu la première moitié des échanges dus sur ce poste, du 29 octobre au 5 novembre ; la seconde moitié, jusqu'à ce matin, viendra à l'exécution suivante, parce que la période entière dépassait le budget d'une exécution. 4 corrections sans enjeu sont faites et enregistrées. Ce qui change pour vous : les gardes qui arrêtent une commande destructive, ou l'envoi de votre adresse personnelle à un service tiers, se contournent encore de 12 façons après leur durcissement du 30 octobre, et l'accord qui les lève peut être fabriqué par la session elle-même. Des sessions de 2 produits ont fait 3 gestes graves sans décision écrite. 5 décisions nouvelles vous attendent, toutes de sécurité ou de protection des noms, et 4 décisions du 29 octobre restent sans réponse.

## 1. En-tête d'identification

Exécution du skill `oeil-critique` 1.4.1, sur votre demande « Quid de l'oeil critique ? ». Sur le pilot `digit-ai-factory`, ses 13 forges et les échanges des produits vus du poste Dell-XPS-16 (l'ordinateur où cette session tourne). Fenêtre analysée : du 29/10/2026 19:37 au 05/11/2026 00:00, soit 5,2 jours sur les 11,6 dus. Synthèse relevée le 10/11/2026 à 12:06, heure de Paris, après une ouverture à 09:56. Session pilote Claude Opus 5.5, 7 agents `explorateur` et 1 agent `verificateur`.

Intention de la demande : savoir où en est l'œil critique sur ce poste et le jouer, puisque le relevé d'ouverture le disait dû depuis 11,6 jours.

Test rétro : la synthèse sert cette intention pour la moitié de la période. L'autre moitié est datée, et l'outil qui la découpe est livré pour l'exécution suivante.

## 2. Verdict

4 automatiques faites sur 6 consignées, chacune rejouée par sa recette ; 12 contournements de garde, 2 failles de l'accord humain et 2 défauts de contrôle de forge confirmés par exécution ; 5 décisions posées, recommandations scellées avant affichage.

## 3. Décisions attendues

Les 2 bloquants qui retiennent la suite, chacun avec ce qui le lève :
- La seconde moitié de la période, du 5 au 10 novembre, n'est pas lue ; rien n'est à fournir, l'exécution suivante la lit avec la borne de fin livrée ce matin ; sans elle, 5 jours d'échanges ne seraient jamais relus.
- 4 constats majeurs au-delà des 5 décisions admises par exécution attendent leur tour ; rien n'est à fournir ; sans exécution suivante, le contrôle des secrets continue d'échouer à chaque fin de tour sur un fichier sans secret.
- 2 corrections sans enjeu sont consignées sans être écrites, l'une parce qu'une autre session modifie son fichier ; rien n'est à fournir, l'exécution suivante les écrit après vérification que le fichier n'a pas bougé ; sans elle, l'indicateur des jetons de relecture reste vide sans motif.

Les décisions du 29 octobre restent ouvertes. Cette fenêtre renouvelle leur mesure : 49 refus du hook de fin de tour, tous de forme, chacun laissant la réponse refusée affichée en double.

**D-104** : un seul chemin pour la restitution, écrire, préjuger puis afficher, posée le 29/10 à 19:13, inchangée.

**D-105** : réponse d'un tour sans écriture hors du gabarit complet, posée le 29/10 à 19:13, inchangée.

**D-107** : script unique pour synchroniser avec GitHub, posée le 29/10 à 19:13, inchangée.

**D-108** : aucun verdict favorable sans mesure réelle, posée le 29/10 à 19:13, inchangée.

> **D-194 — Faut-il que les gardes des gestes distants et de l'identité sortante refusent toute commande qu'elles ne savent pas lire, au lieu de la laisser passer ?**
>
> - **De quoi s'agit-il** : les 2 gardes qui arrêtent une commande avant son exécution, l'une quand elle détruit une ressource distante (`oracles/hook-gestes-distants.mjs`), l'autre quand elle envoie votre adresse personnelle à un service tiers (`oracles/hook-identite-sortante.mjs`).
> - **Le problème** : durcies le 30/10 sur votre décision du 29/10, elles laissent encore passer 12 formes rejouées une à une. La pire vient du durcissement lui-même : une apostrophe dans un texte PowerShell masque la suppression qui suit. Ajouter les 12 cas ferme ces 12 formes et pas la suivante ; refuser par défaut ferme la famille, au prix de refus à tort.
> - **Pourquoi vous** : c'est une règle de sécurité qui s'imposera à toutes les sessions du pilot, des forges et des produits.
> - **Résultat de l'analyse** : l'alias PowerShell de curl, les paramètres abrégés, un texte évalué, un lancement de processus, une adresse sans schéma ou cachée derrière un faux identifiant passent sans refus.
> - **Raisons de la proposition** : la même garde cède à 2 exécutions de suite ; une règle enfreinte 2 fois appelle une barrière d'une autre nature.
> - **Périmètre impacté** : les 2 gardes, leurs recettes, et chaque session qui lance une commande distante.
> - **Objectifs** : aucune commande destructive ou sortante ne passe sans avoir été lue.
> - **Impacts** : des refus à tort sur des commandes inoffensives mais illisibles, levés par le lot d'accord déjà en place.
> - **Améliorations attendues** : contournements connus qui passent, 12 aujourd'hui, cible 0.
> - **Recommandation : (b)** — refuser ce que l'analyse ne lit pas ferme la famille, ajouter des cas ne ferme que les cas. Source consultée : la revue de code de ce tour, rejouée sur `oracles/hook-gestes-distants.mjs`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Laisser les gardes en l'état | les 12 formes restent ouvertes | aucun | Sans objet |
| (b) Refuser ce que la garde ne lit pas | une commande illisible pour la garde, ou une panne du juge, est refusée sauf accord ; les 12 formes entrent en recette rouge | complexe × moyen | Possible : un réglage rétablit l'ancien comportement |
| (c) La même chose, plus une liste d'interdits dans les réglages du poste | une seconde barrière, hors du code des gardes, refuse les suppressions les plus graves même si une garde tombe | complexe × moyen, plus un réglage par profil | Possible : retirer la liste |

> **Sans réponse** : (a), les gardes restent en l'état.

> **D-195 — Faut-il qu'un accord humain pour un geste distant soit cité mot pour mot d'un message humain et vise une commande précise ?**
>
> - **De quoi s'agit-il** : le lot d'accord qui autorise un geste distant refusé par la garde, posé par l'option `--poser` de `oracles/hook-gestes-distants.mjs`.
> - **Le problème** : l'accord est valide dès 5 caractères quelconques, « xxxxx » ou « je n'approuve pas » compris, et une commande approuvée « * » couvre une destruction d'infrastructure. Exiger la citation coûte un geste de plus à chaque accord ; ne rien exiger laisse la session se libérer seule.
> - **Pourquoi vous** : c'est la forme de votre accord sur les gestes irréversibles.
> - **Résultat de l'analyse** : 5 réponses quelconques acceptées et un joker qui couvre tout, rejoués au banc.
> - **Raisons de la proposition** : la garde humaine n'existe que si l'accord vient de vous.
> - **Périmètre impacté** : les lots d'accord du pilot, des forges et des produits.
> - **Objectifs** : un accord ne vaut que s'il vient d'un message humain, pour une commande nommée.
> - **Impacts** : un accord se donne en citant la commande ; le joker disparaît.
> - **Améliorations attendues** : accords fabriqués acceptés, 5 sur 5 au banc, cible 0.
> - **Recommandation : (b)** — la citation vérifiée ferme la fabrication ; l'expiration ajoute un geste sans fait mesuré qui la justifie. Source consultée : la revue de code de ce tour sur `oracles/hook-gestes-distants.mjs`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder l'accord tel quel | la session peut écrire son propre accord | aucun | Sans objet |
| (b) Accord cité et commande nommée | l'accord doit se retrouver mot pour mot dans un message humain de la transcription, et une commande approuvée ne commence pas par un joker | moyen × court | Possible : revenir au contrôle de longueur |
| (c) La même chose, plus une expiration à 24 heures | un accord ancien ne couvre plus un geste du lendemain | moyen × court | Possible : retirer l'expiration |

> **Sans réponse** : (a), l'accord reste sans contrôle de provenance.

> **D-196 — Faut-il refuser à une session de produit de s'accorder des droits, de toucher la production par un secret du dépôt ou d'arrêter tous les processus du poste sans décision consignée ?**
>
> - **De quoi s'agit-il** : 3 gestes faits sans décision écrite par des sessions de Produit-81 et de Produit-12, du 31/10 au 04/11, que la garde `oracles/hook-gestes-distants.mjs` ne voit pas : 2 droits de contournement des politiques de branche accordés par la session elle-même, dont l'un à un compte qui les garde ; une mesure dite en lecture seule connectée à la production avec le mot de passe du dépôt ; un nettoyage qui arrête tous les processus Node du poste.
> - **Le problème** : aucune garde ne couvre ces familles de commandes, et les droits accordés le 04/11 sont peut-être encore en place, non vérifié. Une connexion de service vers la production créée chez Produit-11 sans accord visible reste à vérifier.
> - **Pourquoi vous** : ce sont des droits sur la plateforme d'un client et des écritures chez des produits.
> - **Résultat de l'analyse** : 3 gestes chez 2 produits, et 1 de plus à vérifier chez un 3e.
> - **Raisons de la proposition** : une barrière seule laisse en place ce qui a déjà été accordé.
> - **Périmètre impacté** : la garde du pilot, recopiée chez les produits par l'héritage.
> - **Objectifs** : aucune attribution de droit, aucun accès à la production par un secret du dépôt, aucun arrêt global de processus sans décision consignée.
> - **Impacts** : ces gestes demandent un lot d'accord ; un relevé en lecture des droits accordés chez les 2 produits.
> - **Améliorations attendues** : gestes de cette famille sans décision, 4 en une semaine avec celui à vérifier, cible 0.
> - **Recommandation : (c)** — la barrière arrête les suivants, le relevé dit si les droits accordés sont encore là. Source consultée : les échanges du lot de ce tour qui porte ces 3 gestes, et `oracles/hook-gestes-distants.mjs`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Rien de plus | les gestes restent possibles sans trace | aucun | Sans objet |
| (b) Étendre la garde | l'attribution de droits et de politiques, l'accès à la production par un secret du dépôt et l'arrêt de processus par leur nom sont refusés sans lot d'accord | moyen × moyen | Possible : retirer les familles ajoutées |
| (c) La même chose, plus un relevé des droits accordés | un relevé en lecture liste les droits accordés par des sessions depuis le 29/10 chez les 2 produits ; leur retrait vous est proposé ensuite par une décision | moyen × moyen | Possible : le relevé n'écrit rien |

> **Sans réponse** : (a), aucune garde nouvelle et aucun relevé.

> **D-197 — Faut-il corriger le scan de workflow d'agent qui accepte un filtre « != OWNER » et le caviardage qui laisse sortir X-API-Key en clair ?**
>
> - **De quoi s'agit-il** : 2 contrôles de sécurité de forge. Le scan de `digit-ai-forge-agents-security` vérifie qu'un agent lancé par un commentaire GitHub n'obéit qu'aux membres du dépôt ; le caviardage de `digit-ai-forge-websec` masque les secrets dans les captures de requêtes.
> - **Le problème** : le scan rend un verdict favorable pour « != OWNER », qui laisse passer tout le monde sauf le propriétaire, déjà relevé le 29/10. Le caviardage ne masque qu'un nom d'en-tête : X-API-Key, X-CSRF-Token et X-Access-Token sortent en clair.
> - **Pourquoi vous** : ce sont des contrôles de sécurité ; changer ce qu'ils acceptent est une règle de sécurité.
> - **Résultat de l'analyse** : 3 formes fautives rejouées, la négation, la disjonction et l'en-tête non masqué.
> - **Raisons de la proposition** : le scan échoue à la 2e exécution de suite ; une liste de noms d'en-têtes manquera toujours le suivant.
> - **Périmètre impacté** : les 2 forges et les produits qui les appellent.
> - **Objectifs** : le scan lit l'opérateur du filtre ; tout en-tête au nom de secret est masqué.
> - **Impacts** : quelques en-têtes au nom proche masqués à tort dans les captures.
> - **Améliorations attendues** : formes fautives acceptées, 3 au banc, cible 0.
> - **Recommandation : (c)** — un motif de nom couvre la famille d'en-têtes, une liste non. Source consultée : la revue de code de ce tour, rejouée sur `oracles/oracle-scan-workflow-agent.mjs` et `scripts/caviarder-jetons.mjs`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Laisser les 2 contrôles | le scan et le caviardage restent tels quels | aucun | Sans objet |
| (b) Corriger les formes trouvées | chaque forme fautive devient une recette rouge puis verte | simple × court | Possible : retirer les cas |
| (c) La même chose, plus un masquage par motif | tout en-tête dont le nom contient token, key, secret, auth, session ou password est masqué | simple × court | Possible : revenir à la liste |

> **Sans réponse** : (a), les 2 contrôles restent en l'état.

> **D-198 — Faut-il que l'extraction de l'œil critique masque les produits actifs absents de la table des pseudonymes, comme ses relevés ?**
>
> - **De quoi s'agit-il** : l'extraction des échanges, le script qui réduit les transcriptions du poste à ce que lisent les agents de l'œil critique, `scripts/extraire.mjs` du skill.
> - **Le problème** : les relevés du skill masquent un produit absent de la table des pseudonymes, l'extraction non. Ce matin, 13 extraits sur 39 portaient en clair le nom d'un produit actif hors table. Ils restent sur le poste, mais un agent peut recopier le nom dans une synthèse publiée avec le pilot.
> - **Pourquoi vous** : c'est la protection des noms de vos clients.
> - **Résultat de l'analyse** : 1 produit actif hors table, nommé en clair dans 13 extraits.
> - **Raisons de la proposition** : l'extraction est le seul maillon du skill qui laisse passer ces noms.
> - **Périmètre impacté** : le skill, sur les 2 postes.
> - **Objectifs** : aucun nom réel dans ce que lisent les agents.
> - **Impacts** : aucun pour vous ; les extraits portent « (produit hors table) ».
> - **Améliorations attendues** : extraits au nom en clair, 13 sur 39, cible 0.
> - **Recommandation : (b)** — la liste des produits actifs hors table existe déjà au relevé d'ouverture, l'extraction n'a qu'à la lire. Source consultée : `scripts/extraire.mjs` et `scripts/sources.mjs` du skill.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Laisser l'extraction telle quelle | les noms hors table restent en clair dans les extraits | aucun | Sans objet |
| (b) Masquer les produits actifs hors table | le projet et les textes portent « (produit hors table) » | simple × court | Possible : retirer le masque |
| (c) Refuser l'extraction | l'œil critique ne tourne pas tant qu'un produit actif est hors table | simple × court | Possible : retirer le refus |

> **Sans réponse** : (a), les extraits gardent ces noms.

## 4. Traité

**Analyse de la fenêtre**

- Les 39 sessions de la fenêtre ont été lues par 6 agents, en lots de taille égale ; les 58 sessions d'appel automatique sont écartées.
  - preuve : l'extraction bornée rend 39 sessions, 230 messages humains et 49 refus de hook ; la somme des 6 lots redonne 59 demandes et 171 messages hors demande, soit 230.
- Indicateurs comparés à l'exécution du 29/10 : reprises par demande de 0,58 à 0,36, messages hors demande de 87 à 171, décisions réservées de 23 à 71, 90e centile des tours de 21,4 à 66,9 minutes, jetons de relecture d'intention de 1,57 million à 10,2 millions.
  - preuve : `repere.mjs avancer`, champ `evolution` ; jetons lus au relevé de flotte, jour par jour, le 29/10 compté en entier.
- Revue de code des 255 commits de la fenêtre, au pilot et dans les forges.
  - preuve : 7 constats confirmés par rejeu des fonctions dans un dossier temporaire, 3 plausibles lus seulement.
- Relevés des produits, de l'existant et des process silencieux, relus par un agent.
  - preuve : 15 constats, dont 3 faux positifs du relevé des appelants écartés par lecture du code d'appel.

**Automatiques faites**

- Le rappel de relecture d'intention ne présente plus comme essai en cours un essai clos le 01/11 et prolongé en service.
  - preuve : `hook-flotte.test.mjs`, 24 PASS, 0 FAIL ; commit cbe02985.
- Le dévoilement de la recommandation scellée de D-106, choisie (b) le 29/10 et appliquée sans dévoilement.
  - preuve : `scelle.mjs bilan`, 11 dévoilées sur 15, adhésion 0,91 ; enregistrée avec la synthèse, le journal des automatiques citant le commit local 54c80a42, défait avant publication.
- L'extraction prend une borne de fin, pour découper une période de plus de 7 jours.
  - preuve : self-test à 10 cas PASS, mutation de la borne en rouge, installation dans les 2 profils par `oracle-skills.mjs --appliquer`, PASS ; rejouée sur le réel, elle rend les 49 refus comptés par les lots ; commit 4351679 de forge-agents.
- Suppression : le rappel de relecture d'intention, recopié en entier à chaque appel d'agent, 8 fois dans ce tour, passe de 894 à 501 caractères.
  - preuve : `hook-flotte.test.mjs`, 24 PASS, 0 FAIL ; commit f09f3b6f ; la cible de 450 caractères écrite à la liste est manquée de 51.

**Vérifications faites en passant**

- Le fichier d'environnement de Produit-73 que le contrôle des secrets signale publié ne porte aucun secret.
  - preuve : relu sans afficher de valeur, 5 variables : un nom d'application, 2 adresses locales en 127.0.0.1, des routes et une liste d'oracles ; retiré de la pointe de la branche le 28/10.
- Les numéros de décision réservés par d'autres sessions du poste, D-187 à D-193, restent sur disque sans être enregistrés par moi : la règle de publication du pilot interdit d'enregistrer le travail d'une autre session pour publier.
  - preuve : `git diff -- decisions/REGISTRE.jsonl` après l'envoi, 7 lignes, celles de ces sessions.
- Relecture d'intention : sans objet, motif : la demande déclenche un skill dont le déroulé fixe le livrable, et la relecture de fin de tour n'a pas été jouée, écart dit au bloc 6.

## 5. Non traité

- La seconde moitié de la période, du 05/11 00:00 au 10/11 — motif : `borne_atteinte`, 1,33 million de jetons d'agents pour la première moitié, au-delà du plafond de 1 million.
- 4 constats majeurs au-delà de 5 décisions — motif : `borne_atteinte`, 5 décisions posées au plus par exécution ; ils sont listés au bloc 8, par valeur décroissante.
- L'automatique sur le relevé silencieux qui écrit null sans cause — motif : `dependance_externe`, une autre session du poste modifie ce fichier en ce moment ; son empreinte est consignée.
- L'automatique sur le repère qui compare à lui-même un second avancement sur la même fin — motif : `borne_atteinte`, consignée avec son empreinte pour l'exécution suivante.
- La relecture d'intention des 8 consignes d'agent et celle de fin de tour — motif : `borne_atteinte`, le plafond de jetons était déjà dépassé.

## 6. Écarts à la lettre

- Le skill fait réemployer le skill `code-review` pour la revue → j'ai confié la revue à un agent `verificateur`, sur les diffs des gardes, des oracles et des scripts qui écrivent → 255 commits ne tenaient pas dans une revue entière sous le plafond.
- Le skill fait relire chaque consigne d'agent avant son lancement → les 8 consignes sont parties sans relecture → le volume dépassait déjà le plafond ; les 6 consignes de lot étaient identiques, une seule relecture aurait suffi.
- Votre question pouvait demander un état sans exécution → j'ai joué l'exécution → le relevé d'ouverture la disait due, et le skill se déclenche sur ces mots.
- Un agent de lot est sorti du dossier de travail de la session pour un fichier intermédiaire, supprimé ensuite, d'après son rapport.
- Un second avancement du repère a mis l'évolution à zéro ; le repère a été rétabli depuis le commit local 54c80a42, une seule ligne changée.
- J'avais enregistré les 7 réservations d'autres sessions avec les miennes ; la garde d'envoi l'a arrêté, et j'ai défait mes 2 derniers commits non publiés pour n'enregistrer que mes 5 lignes.

## 7. Risques

- Les gardes contournables laissent passer une destruction de ressource distante ou l'envoi de votre adresse à un tiers, pour toute session du parc ; signal : un geste distant au journal sans lot d'accord ; parade : D-194 et D-195.
- Des droits de contournement des politiques de branche accordés le 04/11 chez Produit-81 sont peut-être encore actifs ; signal : un push qui passe une politique de branche sans revue ; parade : le relevé en lecture de D-196.

## 8. Prochaines actions

Ordre : les actions de la session d'abord, par le tri ; puis vos réponses, la plus grave en tête.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lire la seconde moitié de la période, du 05/11 00:00 au 10/11, à l'exécution suivante de l'œil critique | neuve | auto_ia | borne_atteinte : plafond de jetons de cette exécution dépassé | `node extraire.mjs --depuis 2026-11-05T00:00:00+01:00 --jusqu <fin> --sortie <dossier>` | si rien n'est fait, 5 jours d'échanges jamais relus |
| A-2 | Écrire les 2 automatiques consignées : le relevé silencieux qui dit son motif au lieu de null, le repère qui refuse un second avancement sur la même fin | neuve | auto_ia | borne_atteinte : l'une attend que l'autre session ait fini sur son fichier | `todo/oeil-critique-automatiques.jsonl` | si rien n'est fait, l'indicateur des jetons reste vide sans motif |
| A-3 | Poser à l'exécution suivante les 4 constats majeurs en attente : contrôle des secrets en échec perpétuel sur un fichier sans secret retiré de la pointe, suppression du hook de fin de tour des produits intacts (402 sorties, 0 blocage), forges dites aveugles à tort, nom de dossier de second niveau en clair dans un relevé | neuve | auto_ia | borne_atteinte : 5 décisions au plus par exécution | `todo/oeil-critique-Dell-XPS-16.json` | si rien n'est fait, le contrôle des secrets échoue à chaque fin de tour |
| A-4 | Répondre à D-194 sur les gardes des gestes distants et de l'identité sortante | neuve | manuelle_utilisateur | decision : règle de sécurité pour toutes les sessions | `decisions/REGISTRE.jsonl` (D-194) : répondre « 194a », « 194b » ou « 194c » | si rien n'est fait, 12 contournements restent ouverts |
| A-5 | Répondre à D-195 sur l'accord humain des gestes distants | neuve | manuelle_utilisateur | decision : forme de votre accord sur l'irréversible | `decisions/REGISTRE.jsonl` (D-195) : répondre « 195a », « 195b » ou « 195c » | si rien n'est fait, la session peut fabriquer son accord |
| A-6 | Répondre à D-196 sur les gestes des sessions de produit | neuve | manuelle_utilisateur | decision : droits chez un client et écriture chez des produits | `decisions/REGISTRE.jsonl` (D-196) : répondre « 196a », « 196b » ou « 196c » | si rien n'est fait, des droits accordés restent peut-être en place |
| A-7 | Répondre à D-197 sur le scan de workflow d'agent et le caviardage | neuve | manuelle_utilisateur | decision : règle de sécurité de 2 forges | `decisions/REGISTRE.jsonl` (D-197) : répondre « 197a », « 197b » ou « 197c » | si rien n'est fait, un agent de dépôt obéit à tout commentateur |
| A-8 | Répondre à D-198 sur les noms dans l'extraction | neuve | manuelle_utilisateur | decision : protection des noms | `decisions/REGISTRE.jsonl` (D-198) : répondre « 198a », « 198b » ou « 198c » | si rien n'est fait, des noms réels circulent vers les agents |
| A-9 | Répondre aux 4 décisions du 29/10 rappelées au bloc 3 | neuve | manuelle_utilisateur | decision : restitution, synchronisation et verdicts | `decisions/REGISTRE.jsonl` (D-104, D-105, D-107, D-108) | si rien n'est fait, les refus de forme continuent, 49 sur cette fenêtre |

## 9. Traces

- Pilot : cbe02985 (rappel daté), f09f3b6f (rappel raccourci), puis le commit de cette synthèse (repère, registre, scellés, journal des automatiques, index).
- Forge-agents : 4351679 (`oeil-critique` 1.4.1, borne de fin de l'extraction).
- `todo/oeil-critique-Dell-XPS-16.json` : repère avancé au 05/11 00:00 ; `todo/oeil-critique-automatiques.jsonl` : 6 automatiques consignées, 4 faites ; `todo/oeil-critique-scelles.jsonl` : D-194 à D-198 scellées, D-106 dévoilée.
- `decisions/REGISTRE.jsonl` : D-194 à D-198.
