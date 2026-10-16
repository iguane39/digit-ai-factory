---
destinataire: humain
role: restitution de fin de tour, message « Synchronise avec github » du 23/09/2026 (second poste)
sources_de_verite: git des 16 dépôts gouvernés · output/04-plans/Digit-AI - Synthese Mandat - Parc synchronise et quatre depots publies - 20260923b.md · gabarits/RESTITUTION.md (v2.27.0)
verifie_le: 2026-09-23
---

# Digit-AI — Synthèse de mandat — Parc resynchronisé après le travail des 2 postes — 23/09/2026

## 0. Synthèse d'ouverture

C'est synchronisé. Ce poste avait 7 enregistrements non publiés, écrits hier soir, pendant que l'autre
poste en publiait 11. Les 2 travaux sont maintenant réunis sur GitHub, dans le pilotage et dans
3 forges. Un défaut avait été corrigé 2 fois, une fois sur chaque poste : c'est la version publiée
par l'autre poste, plus stricte, qui reste. La réunion n'ajoute aucun contrôle rouge. En revanche, le
circuit d'intégration hébergé est rouge sur 2 contrôles, et il l'était déjà avant la réunion. Je vous
demande une décision neuve pour le rendre vert, en plus des 3 posées ce matin.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « Synchronise avec github ».
- **sur quoi** — les dépôts git de `c:\dev` gouvernés par le pilotage : `digit-ai-factory`, les
  13 forges `digit-ai-forge-*` et `digit-ai-queue`. Le canal privé et les dépôts de produits n'en font
  pas partie.
- **quand** — le 23/09/2026, de 08:15 (relevé d'ouverture, 06:15 UTC) à 08:57 (UTC+02:00), heure
  de fin relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5 ; pilotage passé de `6bb9d6f` (local) à `a8999a0`
  (publié) ; aucun agent délégué, escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état sans perdre le travail d'aucun des
  2 postes, et sans publier les noms que la décision D-10 protège. **Test rétro** : le relevé rejoué
  après le dernier envoi rend un état identique au distant dans les 15 dépôts relevés, les 7
  enregistrements de ce poste sont publiés et les 11 de l'autre poste sont conservés ; l'intention est
  servie. La lettre ne l'est pas pour un fichier : le journal des relevés d'héritage reste local, à
  dessein (bloc 6).

## 2. Verdict en une ligne

**15 dépôts sur 15 alignés** · **4 dépôts publiés** : pilotage `a3b40b4..a8999a0` (5 enregistrements),
`digit-ai-forge-agents` `4727e50..6af56b8` (1), `digit-ai-forge-audit` `310bcf8..2fc9df1` (1),
`digit-ai-forge-tests` `e0691b3..3bf0e17` (1) · registre des tâches **PASS** · circuit d'intégration
simulé **ROUGE, 2 défauts**, les mêmes avant et après la réunion.

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient une partie de la synchronisation, énoncé ici en entier :

- **Le journal des relevés d'héritage ne peut pas être publié tant que D-10 n'est pas tranchée.**
  Il écrit en clair 10 noms de produits absents de la table des pseudonymes, et chaque ouverture de
  session y ajoute une ligne. Pour le lever : trancher D-10 ci-dessous. Si rien n'est fourni : le
  fichier reste différent entre ce poste et GitHub, et l'autre poste ne reçoit pas ces relevés.

Ce tour pose 1 décision neuve, D-14. Les 3 autres ont été posées ce matin et restent ouvertes. Elles
sont reprises mot pour mot de la synthèse 20260923b, pour que vous puissiez y répondre sans l'ouvrir :
ce tour n'en a changé ni les options ni les recommandations. Comment lire leurs tableaux : chaque
tableau porte une option par ligne ; la colonne Coût dit la complexité et la durée, la colonne
Exclusions ce que retenir l'option ferme. La recommandation et sa source précèdent le tableau ; la
ligne « Si rien n'est décidé » le suit et dit ce qui s'applique sans réponse. Pour répondre, un
sélecteur suffit, par exemple « D-14 b ».

> **D-14 — Faut-il re-sceller les 2 synthèses du 20/09 accusées par `scripts/verifier-jugement.mjs`, et corriger `scripts/generer-page-etude.mjs`, pour rendre vert le circuit d'intégration hébergé ?**
>
> Le circuit `ci/hebergee/recette-pilot.yml`, rejoué sur un clone frais par
> `scripts/simuler-recette-hebergee.mjs`, rend 2 défauts. Le générateur de pages d'étude lève une
> erreur sur un poste sans skills installés, parce que sa coquille exige le gabarit du socle depuis
> hier soir. Sur ce poste, socle installé, il passe 12/12. Le vérificateur de sceaux accuse 2
> synthèses du 20/09 dont le sceau précède la normalisation des fins de ligne. Elles sont arrivées de
> l'autre poste et ont échappé au re-scellement fait ici hier.
>
> **Recommandation : (a).** Source consultée : le remède écrit par `scripts/verifier-jugement.mjs`,
> « rejouer `--sceller` sur ce livrable une fois son contenu relu, c'est le geste prévu par D-32 »,
> et la candidature TF-1324 du registre `todo/TODO.jsonl`, qui mesure le défaut du générateur.
> Les 2 gestes sont petits, et un circuit rouge en permanence finit lu comme du bruit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Je relis les 2 synthèses et je rejoue `--sceller` sur elles seules, puis je traite TF-1324 : sans socle, le générateur dit ce qui lui manque et son test se déclare sans objet au lieu de lever | simple × court | aucune |
| **(b)** Je traite TF-1324 seule ; les 2 sceaux restent accusés | simple × court | le circuit reste rouge sur les sceaux |
| **(c)** Ne rien faire | nul | le circuit reste rouge sur 2 défauts et ne peut pas être activé |

> **Si rien n'est décidé** : (c). TF-1324 reste candidate au registre.

> **D-10 — Faut-il arrêter l'écriture en clair des noms de produits dans le journal publié du pilotage, et purger aussi l'histoire déjà publiée ?**
>
> Le relevé d'héritage, joué à chaque ouverture de session, écrit dans le journal
> `todo/HERITAGE-RELEVES.jsonl` une ligne qui nomme chaque produit du parc. Quand la table des
> pseudonymes ne connaît pas un produit, il écrit son nom réel. Le dépôt `digit-ai-factory` est
> public : 10 noms y sont lisibles depuis le 03/09, dont celui du produit client de la mission de
> conseil, sur 3 branches publiées. La table n'en connaît aucun, et la porte d'avant-enregistrement
> ne juge que les noms qu'elle connaît : rien ne les a arrêtés.
>
> **Recommandation : (b).** Source consultée : `references/TODO-FORGE.md`, paragraphe « Réécrire
> l'historique d'un dépôt est un geste humain décidé, outillé par un mode opératoire fixe »,
> écrit le 03/09, et paragraphe du canal confidentiel, « ce qui ne doit jamais entrer dans un dépôt publié ».
> Le nom d'un produit client est ce que la doctrine interdit de publier, et la purge du 03/09 en est
> le précédent. La première option seule arrête la fuite mais laisse ce nom lisible dans l'histoire.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Arrêter la fuite sans réécrire : j'inscris les 10 produits à la table des pseudonymes (enregistrée et publiée aussitôt dans le dépôt privé du canal confidentiel, comme la doctrine le veut), le relevé écrit un marqueur pour tout produit inconnu, et le journal suivi repasse sous pseudonymes par un enregistrement ordinaire | simple × court | les 10 noms restent lisibles dans l'histoire publiée depuis le 03/09 |
| **(b)** *(recommandée)* L'option (a), puis la purge selon le mode opératoire : sauvegarde entière, règles tirées des tables, réécriture des 3 branches publiées, de l'arborescence liée et des 2 remisages de ce poste, jugement par la porte de publication ; vous faites ensuite l'envoi forcé, et l'autre poste se rebâtit | complexe × long | aucune session ne doit enregistrer dans le pilotage pendant la purge ; une copie déjà faite par un tiers et les vues en cache chez l'hébergeur y échappent, et seul son support retire les secondes |
| **(c)** Ne rien faire | nul | chaque ouverture de session ajoute une ligne portant les 10 noms, publiée au prochain envoi |

> **Comment faire (b)**, pour vos 2 gestes : 1) répondre « D-10 (b) » ; 2) quand je vous rends la
> porte verte, lancer `git push --force origin main` dans `C:\dev\digit-ai-factory`, puis la même
> commande pour les 2 autres branches publiées ; 3) sur l'autre poste, lancer
> `node bootstrap.mjs --rebatir digit-ai-factory`.
>
> **Si rien n'est décidé** : (c). Je continue de laisser le journal hors de mes enregistrements, ce
> qui n'empêche pas une autre session de l'enregistrer.

> **D-11 — Faut-il cloner sur ce poste le dépôt privé `digit-ai-marketing`, pour exécuter l'alignement des pages sur la charte des présentations que vous avez choisi ?**
>
> Vous avez décidé que la charte des présentations fait foi et que les pages s'y alignent. Le skill des présentations lit cette charte dans le dossier de marque du produit `digit-ai-marketing`, qui n'est pas sur ce poste : aligner les pages sur une charte illisible reviendrait à l'inventer. Le dépôt existe, privé, dans votre compte : son dossier de marque, publié le 20/09, porte la charte complète en 10 fichiers.
>
> **Recommandation : (a).** Source consultée : l'item TF-1023 du registre `todo/TODO.jsonl`
> (blocage mesuré : « dossier de marque introuvable »), et la liste du dossier de marque rendue par
> `gh api repos/iguane39/digit-ai-marketing/contents/donnees/marque`. Un clone est local,
> réversible, ne publie rien, et reste à jour par la synchronisation d'ouverture ; le pilotage ne fait
> que le lire, sans ouvrir de session chez le produit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Je clone le dépôt sous la racine du parc, puis j'aligne le socle des pages sur la charte lue à la source | moyen × moyen | aucune écriture chez le produit ; il entre au relevé d'héritage du parc |
| **(b)** Je lis la charte à distance, sans clone, dans une copie de travail désignée au lecteur de charte | simple × court | la copie n'est pas versionnée, elle dérive du produit, et la session suivante ne la retrouve pas |
| **(c)** Ne rien faire | nul | les pages gardent leurs propres polices, contre votre décision sur la charte |

> **Si rien n'est décidé** : (c). L'item reste bloqué, et la décision sur la charte reste
> inexécutable.

> **D-13 — Faut-il décider les 5 candidatures ouvertes pendant le mandat, pour que je les traite ensuite ?**
>
> Les 5 défauts constatés en passant sont entrés au registre comme candidatures, et une candidature ne se traite qu'après votre décision. Deux font mentir un contrôle aujourd'hui : la recette du skill `accueil-factory`, rouge pour une description trop longue, et le lanceur général des oracles, qui applique le contrat mobile à toute page. Un troisième laisse 2 générateurs de pages du pilotage hors du socle. Les deux derniers sont des constructions entières : les étapes sans porteur de la chaîne d'audit des traductions, et les 2 derniers temps du méta-oracle d'enclenchement.
>
> **Recommandation : (b).** Source consultée : les événements de création des 5 candidatures dans
> `todo/TODO.jsonl`, mesurés le 22/09. Les 3 correctifs rendent juste un contrôle qui ment ou
> ramènent 2 générateurs au socle, pour un coût borné ; les 2 constructions touchent toutes les
> forges et méritent un mandat à elles.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 5 : je traite les 3 correctifs (TF-1316, TF-1321, TF-1322), puis j'ouvre les 2 constructions (TF-1318, TF-1319) | complexe × long | le mandat suivant est occupé par 2 chantiers qui touchent toutes les forges |
| **(b)** *(recommandée)* Décider les 3 correctifs (TF-1316, TF-1321, TF-1322) ; TF-1318 et TF-1319 restent candidates | moyen × court | le méta-oracle et la chaîne des traductions restent sans porteur |
| **(c)** Ne rien décider | nul | les 5 restent candidates, la recette du skill d'accueil reste rouge et le lanceur général refuse toute page du socle |

> **Si rien n'est décidé** : (c). Les 5 restent au registre, sans traitement.

## 4. Traité — avec sa preuve

Le relevé d'ouverture annonçait 2 dépôts divergés ; après `git fetch`, il y en avait 3.

- **Le relevé avant tout geste.** Le pilotage portait 4 enregistrements d'avance et 8 de retard,
  `digit-ai-forge-agents` 1 et 2, `digit-ai-forge-audit` 1 et 1, `digit-ai-forge-tests` 1 et 0 ; les
  11 autres dépôts étaient alignés.
  - preuve : `git fetch` puis `git status -sb` sur chaque dépôt.
- **`digit-ai-forge-tests` publié tel quel**, sans rien à réunir.
  - preuve : `git push` rend `e0691b3..3bf0e17`.
- **`digit-ai-forge-agents` rebasé, sans fichier touché des 2 côtés.**
  - preuve : `git rebase origin/main` rend « Successfully rebased » ; `git push` rend
    `4727e50..6af56b8`.
- **`digit-ai-forge-audit` : le même défaut corrigé 2 fois, la version distante gardée.** Ce poste
  avait fait reconnaître une dimension d'audit à sa seule forme. L'autre poste l'a fait valider par le
  référentiel déclaré dans l'audit, ce qui est plus strict. J'ai gardé son code, puis aligné sur sa
  règle le 3e cas de la recette locale, qui disait l'inverse.
  - preuve : `node --test tests/oracles/dimension-referentiel.test.mjs` rend 3/3 verts ; la batterie
    des oracles rend 153 verts et 4 rouges, tous sur l'attente de 30 s du navigateur d'impression,
    sans lien avec le fichier réuni ; `git push` rend `310bcf8..2fc9df1`.
- **Le pilotage : 4 enregistrements rebasés sur 8, 4 fichiers réunis à la main.** Le registre des
  tâches n'avait reçu que des ajouts des 2 côtés : je les ai réunis ligne à ligne, distant d'abord.
  - preuve : les 2037 premières lignes sont identiques des 2 côtés (`cmp`), et le fichier réuni compte
    2119 lignes JSON valides ; la base de recette de `verifier-jugement` prend 19 cas, relus à
    l'exécution (19 PASS).
- **TF-1207 clos une seule fois.** Les 2 postes l'avaient clos le 22/09. Rejoués après la clôture
  distante, les 2 événements locaux faisaient échouer le registre sur 2 règles.
  - preuve : `node todo/oracle-todo.mjs` rendait FAIL sur TF-1207, par R5 — une transition de statut que le registre interdit, et par R9 — des horodatages qui décroissent dans le journal ; après retrait des
    2 événements non publiés et une note journalisée, il rend PASS.
- **Le circuit d'intégration simulé, sur la réunion et sur le distant seul.**
  - preuve : `node scripts/simuler-recette-hebergee.mjs` rend ROUGE, 2 défauts, sur `a8999a0` comme
    sur `a3b40b4` : le générateur de pages sans socle, et 2 sceaux du 20/09. La réunion n'en ajoute
    aucun.
- **Le défaut du générateur, reproduit et consigné.**
  - preuve : `node scripts/generer-page-etude.mjs --self-test` rend 12/12 sur ce poste, et lève
    « gabarit du socle introuvable » avec `HOME` vide ; TF-1324 est entrée en candidature,
    `oracle-todo` rend PASS avant et après.
- **La publication du pilotage**, sous votre demande nommée à la porte de périmètre.
  - preuve : la porte avant envoi refuse sans feu vert ; avec
    `FORGE_PUSH_GO="demande humaine « synchronise avec github » du 23/09"`, `git push` rend
    `a3b40b4..a8999a0`.
- **Le relevé final.**
  - preuve : `git fetch` puis `git status -sb` rend `main...origin/main`, sans avance ni retard, sur
    les 15 dépôts.

## 5. Non traité — avec son motif

- Le journal `todo/HERITAGE-RELEVES.jsonl`, 3 lignes locales : motif `gate_gouvernance` — il écrit
  en clair des noms hors pseudonyme, et D-10 n'est pas tranchée ; le bloquant est inventorié au bloc 3.
- Les 2 défauts du circuit d'intégration : motif `decision` — re-sceller est un geste humain prévu
  par D-32, et TF-1324 est une candidature ; D-14 les pose.
- Les 4 tests d'impression de `digit-ai-forge-audit` : motif `hors_mandat` — ils attendent un
  navigateur d'impression absent de ce poste, sans lien avec la réunion.
- La recette de `digit-ai-forge-agents` après son rebase : motif `borne_atteinte` — aucun fichier
  n'était touché des 2 côtés, je ne l'ai pas rejouée.
- Le canal privé et ses modifications locales : motif `hors_mandat` — il n'est pas dans la boucle
  de synchronisation des forges.

## 6. Écarts à la lettre

- **Vous avez demandé** que ce poste et GitHub portent le même état. **J'ai laissé** un fichier
  différent : le journal des relevés d'héritage. **Pourquoi** : l'autre poste l'a tenu hors de la
  publication ce matin, pour la même raison, et D-10 (c) s'applique faute de décision.
- **J'ai retiré de la réunion 2 événements du registre écrits ici**, sur TF-1207. **Pourquoi** : la
  clôture distante les rendait contradictoires ; ils n'avaient jamais été publiés, et une note
  journalisée garde leur contenu.
- **Le feu vert passé à la porte de publication est ma lecture de votre message.** L'autre poste l'a
  lu de la même façon ce matin ; le texte du feu vert figure en entier au bloc 4.
- **Je publie cette synthèse, TF-1324 et les index régénérés sous la même demande**, dans un
  enregistrement qui suit `a8999a0`. Aucun autre contenu ne part avec eux.

## 7. Risques

- **Les 2 postes travaillent encore en parallèle sur les mêmes items.** TF-1207 a été clos 2 fois
  hier, avec 2 correctifs différents.
  - signal : `oracle-todo` rend FAIL sur R5 ou R9 après une réunion.
  - parade : `git fetch` avant de commencer un item, et une réunion le jour même.
- **Une autre session enregistre le journal des relevés d'héritage.** Chaque ouverture de session y
  ajoute une ligne portant les 10 noms, et rien ne l'arrête à la porte des noms.
  - signal : `git diff --stat origin/main..HEAD -- todo/HERITAGE-RELEVES.jsonl` n'est pas vide avant
    un envoi.
  - parade : trancher D-10 ; d'ici là, ne jamais publier une plage qui touche ce fichier.

## 8. Prochaines actions

Il ne reste qu'une action. Elle vous revient parce qu'elle tranche 4 décisions.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Trancher D-14, D-10, D-11 et D-13, reprises en entier au bloc 3 — répondre par exemple « D-14 a, D-10 b, D-11 a, D-13 b » | `manuelle_utilisateur` | neuve | `decision` — re-sceller des livrables, purger l'histoire publiée, cloner un dépôt privé et décider des candidatures vous reviennent | D-14 (c), D-10 (c), D-11 (c) et D-13 (c) s'appliquent : le circuit reste rouge, les 10 noms restent lisibles dans l'histoire publiée, la charte reste illisible, les candidatures restent sans traitement |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié le 23/09/2026 : pilotage `digit-ai-factory` à `a8999a0` avant cette synthèse ;
  `digit-ai-forge-agents` à `6af56b8` ; `digit-ai-forge-audit` à `2fc9df1` ; `digit-ai-forge-tests`
  à `3bf0e17`.
- `todo/TODO.jsonl` : 1 création (TF-1324) et 1 note (TF-1207) ce tour.
- Aucune page HTML livrée dans ce tour.
