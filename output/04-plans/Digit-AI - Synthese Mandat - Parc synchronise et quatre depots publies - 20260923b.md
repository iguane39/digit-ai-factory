---
destinataire: humain
role: restitution de fin de tour, message « synchronise avec github » du 23/09/2026
sources_de_verite: git des 16 dépôts gouvernés · output/04-plans/Digit-AI - Synthese Mandat - Quatre decisions executees et quatre nouvelles posees - 20260923a.md · gabarits/RESTITUTION.md (v2.27.0)
verifie_le: 2026-09-23
---

# Digit-AI — Synthèse de mandat — Parc synchronisé et 4 dépôts publiés — 23/09/2026

## 0. Synthèse d'ouverture

C'est synchronisé. Le travail du mandat des huit rangs était enregistré sur ce poste sans être
publié : il l'est maintenant, dans le pilotage et dans 3 forges. J'ai d'abord enregistré les traces
de sa dernière étape, dont la synthèse de ce matin. Les 16 dépôts du parc portent désormais le même
état que GitHub. Un seul fichier reste volontairement hors de la publication : le journal des relevés
d'héritage. Il écrit en clair des noms de produits, et c'est l'objet d'une décision que vous n'avez
pas encore prise. Aucun nom n'est parti avec ce qui a été publié. Ce qui est attendu de vous : les
3 décisions posées ce matin, dont la première porte sur ces noms.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « synchronise avec github ».
- **sur quoi** — les 16 dépôts git de `c:\dev` que le pilotage gouverne : `digit-ai-factory`, les
  13 forges `digit-ai-forge-*`, `digit-ai-queue` et le canal privé, cloné sous `c:\dev\_confidentiel`.
  Les dépôts de produits n'en font pas partie.
- **quand** — le 23/09/2026, de 07:02 à 07:13 (UTC+02:00), heures relevées par `date` ; environ
  11 minutes au mur.
- **qui** — session de pilotage Claude Opus 5.5 ; pilotage passé de `dc190374` à `020f08df` ; aucun
  agent délégué, escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état, pour que l'autre poste voie le travail
  du mandat, sans publier les noms que la décision D-10 protège. **Test rétro** : le relevé rejoué
  après le dernier envoi rend 0 d'avance et 0 de retard dans les 16 dépôts, et aucun des 10 noms
  hors pseudonyme n'est dans ce qui est parti ; l'intention est servie. La lettre, « synchroniser »,
  ne l'est pas pour un fichier, le journal des relevés, laissé local à dessein (bloc 6).

## 2. Verdict en une ligne

**16 dépôts sur 16 alignés**, avance 0, retard 0 · **4 dépôts publiés** : pilotage
`6aee79de..020f08df` (4 enregistrements, dont celui des traces), `digit-ai-forge-agents`
`47590ee..4727e50` (2), `digit-ai-forge-audit` `06801a1..310bcf8` (1), `digit-ai-forge-design`
`fa48dfc..11fc6f5` (2) · porte des noms **PASS 4 fois sur 4** · porte de périmètre de publication
**PASS** · **0 nom** hors pseudonyme sur 5 495 lignes publiées · skills installés identiques aux
skills versionnés.

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient une partie de la synchronisation, énoncé ici en entier :

- **Le journal des relevés d'héritage ne peut pas être publié tant que D-10 n'est pas tranchée.**
  Il écrit en clair 10 noms de produits absents de la table des pseudonymes, et chaque ouverture de
  session y ajoute une ligne. Pour le lever : trancher D-10 ci-dessous. Si rien n'est fourni : le
  fichier reste différent entre ce poste et GitHub, et l'autre poste ne reçoit pas ces relevés.

Votre message répond à D-12 de ce matin par l'option recommandée : enregistrer les traces, puis
publier les 4 dépôts. Ce tour ne pose aucune décision neuve. Les 3 décisions
qui suivent ont été posées ce matin et restent ouvertes. Elles sont reprises mot pour mot de la
synthèse 20260923a, pour que vous puissiez y répondre sans l'ouvrir : ce tour n'en a changé ni les
options ni les recommandations. Comment lire leurs tableaux : chaque tableau porte une option par
ligne ; la colonne Coût dit la complexité et la durée, la colonne Exclusions ce que retenir l'option
ferme. La recommandation et sa source précèdent le tableau ; la ligne « Si rien n'est décidé » le
suit et dit ce qui s'applique sans réponse. Pour répondre, un sélecteur suffit, par exemple
« D-10 (b) ».

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
> l'historique d'un dépôt est un geste humain décidé, outillé par un mode opératoire fixe », écrit le
> 03/09, et paragraphe du canal confidentiel, « ce qui ne doit jamais entrer dans un dépôt publié ».
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

- **Le relevé avant tout geste : rien en retard, 4 dépôts en avance.** Aucun des 16 dépôts n'avait
  reçu de travail de l'autre poste : pas de fusion à faire.
  - preuve : `git fetch` puis `git rev-list --left-right --count HEAD...origin/main` sur les 16
    dépôts : pilotage 3 et 0, forge-agents 2 et 0, forge-audit 1 et 0, forge-design 2 et 0, les
    12 autres 0 et 0.
- **Les traces de la dernière étape du mandat sont enregistrées au pilotage.** Ce sont 14 fichiers :
  la synthèse 20260923a et ses sceaux, l'étude et le plan mis à jour, les index régénérés et les
  3 notes au registre sur TF-1323 et TF-1023.
  - preuve : les 2 gardes d'avant-enregistrement du pilotage, l'anonymiseur et la garde des
    quantificateurs, ont laissé passer l'enregistrement `020f08df` ; `git show --stat` rend
    14 fichiers, sans `todo/HERITAGE-RELEVES.jsonl` ; le sceau de la synthèse 20260923a rend
    `"verdict":"PASS"`.
- **La porte de périmètre de publication, jouée sur le pilotage.** Elle sépare ce qu'un feu vert
  sur un travail couvre d'office de ce qui exige un feu vert explicite.
  - preuve : `node scripts/verifier-avance-publication.mjs --plage origin/main..HEAD --go "D-12 (a) —
    « synchronise avec github » du 23/09/2026"` rend `"verdict": "PASS"`, exit 0.
- **La porte des noms, jouée sur les 4 dépôts avant l'envoi**, historique compris.
  - preuve : `oracle-nom-client-publie.mjs` rend `"verdict":"PASS"`, exit 0, 0 bloquant sur les 4 ;
    antériorités déclarées et non bloquantes : 1 au pilotage, 21 chez forge-agents.
- **Les 10 noms hors pseudonyme ne sont pas partis.** La porte des noms ne connaît que les noms de
  sa table, et ces 10 n'y sont pas : je les ai cherchés à part, sans les écrire.
  - preuve : les 10 valeurs relues dans le journal, publié et local, puis cherchées dans les lignes
    ajoutées et les messages des 4 plages → 4 933 lignes au pilotage, 562 dans les 3 forges,
    0 nom trouvé.
- **Les 4 envois.**
  - preuve : `git push origin main` rend `6aee79de..020f08df`, `47590ee..4727e50`,
    `06801a1..310bcf8` et `fa48dfc..11fc6f5`.
- **Le relevé final du parc.**
  - preuve : `git fetch` puis `git rev-list --left-right --count` sur les 16 dépôts rend 0 et 0
    partout ; `node bootstrap.mjs --pull` rend « Poste prêt — présent, à jour, skills alignés » et
    « skills installés = skills versionnés » ; l'avertissement d'ouverture sur les skills non
    propagés de forge-agents a disparu.

## 5. Non traité — avec son motif

- Le journal `todo/HERITAGE-RELEVES.jsonl`, modifié sur ce poste par 4 relevés d'ouverture :
  motif `gate_gouvernance` — il écrit en clair des noms hors pseudonyme, et la décision D-10 qui
  dit comment l'arrêter n'est pas prise ; la synthèse 20260923a le tenait déjà hors de ses
  enregistrements.
- Les fichiers non suivis par git : 5 dossiers de maquettes sous `baseline\` chez forge-design,
  1 fichier de verdict chez forge-agents, 1 chemin chez forge-conception, 2 chez forge-tests, et
  `.claude\worktrees\` au pilotage : motif `hors_mandat` — déjà non suivis lors des
  synchronisations du 20 et du 21/09 ; plusieurs chemins portent des noms de produits réels.
- Le lot qui attend au sas d'arrivée depuis 9 h : motif `hors_mandat` — son accueil est un tour de
  la boîte d'entrée, pas un geste de synchronisation.

## 6. Écarts à la lettre

- **Vous avez écrit** « synchronise avec github ». **J'ai lu** la décision D-12 (a) de ce matin :
  enregistrer les traces de la dernière étape, puis publier les 4 dépôts. **Pourquoi** : c'est
  exactement le geste que D-12 (a) décrit, et c'est le sens que cette phrase a reçu les 13, 20 et
  21/09. D-10, D-11 et D-13 ne sont pas tranchées par ce message.
- **Vous avez demandé** que ce poste et GitHub portent le même état. **J'ai laissé** un fichier
  différent : le journal des relevés d'héritage. **Pourquoi** : l'enregistrer publiait de nouvelles
  lignes portant les 10 noms, ce que D-10 (c), l'option qui s'applique faute de décision, laisse
  hors des enregistrements.
- **J'ai traité** les 16 dépôts gouvernés, pas le seul pilotage. **Pourquoi** : 3 des 4 dépôts en
  avance sont des forges, et D-12 les nomme.
- **Le feu vert passé à la porte de périmètre est ma lecture de votre message.** L'outil prend ce
  feu vert tel quel et ne le vérifie pas ; il est écrit en entier dans le message d'enregistrement.
- **Je publie cette synthèse et les index régénérés sous la même demande**, dans un enregistrement
  qui suit `020f08df`. Aucun autre contenu ne part avec eux.

## 7. Risques

- **Une autre session enregistre le journal des relevés d'héritage.** Chaque ouverture de session y
  ajoute une ligne portant les 10 noms, et rien ne l'arrête à la porte des noms.
  - signal : `git diff --stat origin/main..HEAD -- todo/HERITAGE-RELEVES.jsonl` n'est pas vide avant
    un envoi.
  - parade : trancher D-10 ; d'ici là, ne jamais publier une plage qui touche ce fichier.
- **L'autre poste a frappé des travaux à partir de TF-1324 sans avoir tiré.** Le registre publié
  s'arrête à TF-1323.
  - signal : son envoi est refusé, puis `oracle-todo` rend FAIL sur un identifiant en double.
  - parade : `node todo/renumeroter.mjs` sur ses seuls numéros, chez lui ; les numéros publiés ne
    bougent plus.

## 8. Prochaines actions

Une seule action reste. Elle vous revient parce qu'elle tranche 3 décisions.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Trancher D-10, D-11 et D-13, reprises en entier au bloc 3 — répondre par exemple « D-10 (b), D-11 (a), D-13 (b) » | `manuelle_utilisateur` | neuve | `decision` — purger l'histoire publiée, cloner un dépôt privé et décider des candidatures vous reviennent | D-10 (c), D-11 (c) et D-13 (c) s'appliquent : les 10 noms restent lisibles dans l'histoire publiée, la charte reste illisible, les 5 candidatures restent sans traitement |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié le 23/09/2026 : pilotage `digit-ai-factory` à `020f08df` avant cette synthèse ;
  `digit-ai-forge-agents` à `4727e50` ; `digit-ai-forge-audit` à `310bcf8` ; `digit-ai-forge-design`
  à `11fc6f5`.
- `todo/TODO.jsonl` — 0 création et 0 mise à jour ce tour ; les 3 notes publiées datent du 22/09.
- Aucune page HTML livrée dans ce tour.
