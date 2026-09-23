---
destinataire: humain
role: restitution de fin de tour, message « synchronise avec github » du 23/09/2026 au soir
sources_de_verite: git des 16 dépôts gouvernés · output/04-plans/Digit-AI - Synthese Mandat - Parc resynchronise apres le travail des deux postes - 20260923c.md · todo/TODO.jsonl · gabarits/RESTITUTION.md (v2.27.0)
verifie_le: 2026-09-23
---

# Digit-AI — Synthèse de mandat — Pilotage rattrapé sur l'autre poste, index en retard consigné — 23/09/2026

## 0. Synthèse d'ouverture

C'est synchronisé. Ce poste n'avait rien à publier. Il lui manquait le travail que l'autre poste a
publié ce matin, et il l'a maintenant : les 16 dépôts du parc portent le même état que GitHub. Le
rapatriement avait d'abord été refusé à l'ouverture de la session. En cause, 2 index de fichiers que
l'outillage régénère tout seul et qui partent toujours avec une synthèse de retard. J'ai consigné ce
défaut au registre, sans le corriger. Le journal des relevés d'héritage reste hors de la publication,
comme ce matin. Ce qui est attendu de vous : 5 décisions, dont une neuve sur ces index.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « synchronise avec github ».
- **sur quoi** — les 16 dépôts git de `c:\dev` que le pilotage gouverne : `digit-ai-factory`, les
  13 forges `digit-ai-forge-*`, `digit-ai-queue` et le canal privé `c:\dev\_confidentiel`. Les dépôts
  de produits n'en font pas partie.
- **quand** — le 23/09/2026, de 21:12 à 21:25 (UTC+02:00), heures relevées par `date` ; environ
  13 minutes au mur, après le relevé d'ouverture de la session.
- **qui** — session de pilotage Claude Opus 5.5 ; pilotage passé de `a3b40b45` à `cb4ec57b` par
  avance rapide ; aucun agent délégué, escalade de modèle : aucune.
- **intention** — que ce poste reparte du même état que GitHub, avec le travail publié ce matin par
  l'autre poste, sans publier les noms que la décision D-10 protège. **Test rétro** : le relevé
  rejoué après le rapatriement rend 0 d'avance et 0 de retard dans les 16 dépôts, et le relevé de
  fraîcheur rend « Poste prêt » ; l'intention est servie. La lettre ne l'est pas pour un fichier : le
  journal des relevés d'héritage reste local, à dessein (bloc 6).

## 2. Verdict en une ligne

**16 dépôts sur 16 alignés**, avance 0, retard 0 · pilotage rapatrié `a3b40b45..cb4ec57b`
(6 enregistrements de l'autre poste, 45 fichiers) · 15 dépôts déjà alignés, **rien à publier** hors
ce compte rendu · relevé de fraîcheur : **Poste prêt**, skills installés = skills versionnés ·
**1 candidature neuve** au registre, `oracle-todo` **PASS** avant et après.

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient une partie de la synchronisation, énoncé ici en entier :

- **Le journal des relevés d'héritage ne peut pas être publié tant que D-10 n'est pas tranchée.**
  Il écrit en clair 10 noms de produits absents de la table des pseudonymes, et chaque ouverture de
  session y ajoute une ligne : 5 lignes locales sur ce poste ce soir. Pour le lever : trancher D-10
  ci-dessous. Si rien n'est fourni : le fichier reste différent entre ce poste et GitHub, et l'autre
  poste ne reçoit pas ces relevés.

Ce tour pose 1 décision neuve, D-15. Les 4 autres ont été posées aujourd'hui et restent ouvertes.
Elles sont reprises mot pour mot de la synthèse 20260923c, pour que vous puissiez y répondre sans
l'ouvrir : ce tour n'en a changé ni les options ni les recommandations. Comment lire leurs tableaux :
chaque tableau porte une option par ligne ; la colonne Coût dit la complexité et la durée, la colonne
Exclusions ce que retenir l'option ferme. La recommandation et sa source précèdent le tableau ; la
ligne « Si rien n'est décidé » le suit et dit ce qui s'applique sans réponse. Pour répondre, un
sélecteur suffit, par exemple « D-15 a ».

> **D-15 — Faut-il corriger les 2 générateurs d'index d'output qui dépendent du poste et du moment de leur passage, pour que ce poste cesse de s'ouvrir « non prêt » après chaque synchronisation croisée ?**
>
> Ce soir, `node bootstrap.mjs --pull` a refusé de rapatrier le pilotage. Les index
> `output/README.md` et `output/04-plans/README.md`, régénérés sur ce poste par
> `scripts/readme-dossiers.mjs` après la dernière publication, entraient en conflit avec ceux que
> l'autre poste avait publiés. La cause est mesurée : chaque synthèse part avec un index généré avant
> qu'elle soit suivie par git, donc en retard d'un fichier, et le passage suivant du hook le corrige
> en local. Le troisième index, `output/LISEZMOI.md`, pèse les fichiers sur le disque : il se
> réécrit sur 316 lignes à chaque changement de poste, sans qu'aucun livrable ait changé.
>
> **Recommandation : (a).** Source consultée : les candidatures TF-1325 (ce soir) et TF-1243 (du
> 20/09) du registre `todo/TODO.jsonl`, et le remède imprimé par `node bootstrap.mjs --pull`,
> « résoudre (stash/commit), relancer --pull », qui renvoie à l'humain un geste que l'outillage
> provoque lui-même. Les 2 correctifs restent dans le pilotage et ne touchent aucun livrable.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Décider TF-1325 et TF-1243 : l'index se régénère une fois la synthèse suivie par git, au moment de l'enregistrement, et le troisième index lit le poids des fichiers dans git plutôt que sur le disque ; recette jouée avant et après | simple × court | aucune |
| **(b)** Décider TF-1325 seule | simple × court | le troisième index continue de se réécrire sur plus de 300 lignes à chaque changement de poste |
| **(c)** Ne rien décider | nul | le poste s'ouvre « non prêt » après chaque synchronisation croisée, et chaque synthèse publiée porte un index faux d'un fichier |

> **Si rien n'est décidé** : (c). Je continue de remettre les index à l'état du dépôt avant chaque
> rapatriement, et les 2 candidatures restent au registre.

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

- **Le relevé avant tout geste : 1 dépôt en retard, aucun en avance.** Le pilotage portait
  6 enregistrements de retard, publiés ce matin par l'autre poste ; les 15 autres dépôts étaient
  alignés. Rien à réunir : aucun enregistrement local non publié.
  - preuve : `git fetch` puis `git rev-list --left-right --count HEAD...@{u}` sur les 16 dépôts :
    pilotage 0 et 6, les 15 autres 0 et 0.
- **La cause du refus d'ouverture, identifiée.** Le pilotage portait 3 fichiers modifiés : les
  2 index `output/README.md` et `output/04-plans/README.md`, et le journal des relevés d'héritage.
  Les 2 index ne différaient que d'une ligne : la synthèse 20260923b, suivie depuis son
  enregistrement, que l'index publié avec elle ne nommait pas.
  - preuve : `git diff output/` rend 1 ligne ajoutée à l'index des plans et le compteur de fichiers
    passé de 193 à 194 ; `git diff --stat HEAD origin/main` montre ces 2 index modifiés aussi par
    l'autre poste, et le journal des relevés intouché par lui.
- **Le pilotage rapatrié par avance rapide.** Les 2 index ont été remis à l'état du dépôt, puisque
  le hook d'écriture les régénère ; le journal des relevés est resté tel quel.
  - preuve : `git checkout -- output/README.md output/04-plans/README.md` puis `git pull --ff-only`
    rend l'avance rapide sur 45 fichiers, 1438 insertions et 276 suppressions ; `git status -sb`
    rend `main...origin/main`, sans avance ni retard.
- **Le relevé de fraîcheur rejoué.**
  - preuve : `node bootstrap.mjs --pull` rend « Poste prêt — présent, à jour, skills alignés »,
    « skills installés = skills versionnés », et le pilotage « cb4ec57b 2026-09-23 à jour » ; le
    défaut d'ouverture a disparu.
- **Le troisième index ne porte que des poids de fichiers.** Régénéré après le rapatriement,
  `output/LISEZMOI.md` change sur 316 lignes.
  - preuve : les lignes ajoutées et retirées, poids remplacés par un marqueur puis comparées par
    `comm`, rendent 0 ligne propre à un côté : aucun livrable n'apparaît ni ne disparaît.
- **Le défaut des index en retard, consigné.** Il n'était pas au registre ; son proche parent, le
  poids lu sur le disque, y est depuis le 20/09.
  - preuve : `node todo/journaliser.mjs --fichier tf-1325.json` rend « 1 événement(s)
    journalisé(s) », `verdict_avant` PASS et `verdict_apres` PASS ; TF-1325 entre en candidature,
    avec une classe proposée, `index-genere-avant-l-enregistrement-qu-il-decrit`.
- **Le relevé final du parc.**
  - preuve : `git rev-list --left-right --count HEAD...@{u}` rend 0 et 0 sur les 16 dépôts, et
    aucun fichier suivi n'est modifié hors du pilotage.

## 5. Non traité — avec son motif

- Le journal `todo/HERITAGE-RELEVES.jsonl`, 5 lignes locales : motif `gate_gouvernance` — il écrit
  en clair des noms hors pseudonyme, et D-10 n'est pas tranchée ; le bloquant est inventorié au
  bloc 3.
- La correction des 2 générateurs d'index : motif `decision` — TF-1325 et TF-1243 sont des
  candidatures, qui ne se traitent qu'après votre décision ; D-15 les pose.
- Les fichiers non suivis par git : 5 dossiers de maquettes chez forge-design, 1 fichier de verdict
  chez forge-agents, 1 dossier chez forge-conception, 2 chez forge-tests, et `.claude\worktrees\`
  au pilotage : motif `hors_mandat` — déjà non suivis lors des synchronisations précédentes ;
  plusieurs chemins portent des noms de produits réels.
- Le lot qui attend au sas d'arrivée : motif `hors_mandat` — son accueil est un tour de la boîte
  d'entrée, pas un geste de synchronisation.

## 6. Écarts à la lettre

- **Vous avez demandé** que ce poste et GitHub portent le même état. **J'ai laissé** un fichier
  différent : le journal des relevés d'héritage. **Pourquoi** : les 2 synchronisations de ce matin
  l'ont tenu hors de la publication pour la même raison, et D-10 (c) s'applique faute de décision.
- **J'ai remis 2 index à l'état du dépôt**, ce qui efface leur version locale. **Pourquoi** : ce
  sont des vues que le hook régénère après chaque écriture ; je les ai relues avant, elles ne
  différaient que de la ligne de la synthèse 20260923b, que le dépôt porte déjà.
- **J'ai consigné un défaut au registre**, alors que vous demandiez une synchronisation.
  **Pourquoi** : c'est lui qui a rendu le poste « non prêt » à l'ouverture, et la doctrine veut
  qu'un constat fait en passant entre en candidature ; je ne l'ai pas corrigé.
- **Je publie cette synthèse, TF-1325 et les 3 index régénérés sous la même demande**, dans un
  enregistrement qui suit `cb4ec57b`. L'index des poids part avec eux : ne pas le publier le
  laisserait modifié sur ce poste, ce qui bloquerait le prochain rapatriement. Aucun autre contenu
  ne part.

## 7. Risques

- **Le poste s'ouvre de nouveau « non prêt » après la prochaine publication de l'autre poste.** Le
  défaut des index n'est pas corrigé, seulement consigné.
  - signal : `node bootstrap.mjs --pull` rend « pull impossible » sur le pilotage, avec des index
    d'output dans la liste des fichiers modifiés.
  - parade : trancher D-15 ; d'ici là, `git checkout -- output/README.md output/04-plans/README.md
    output/LISEZMOI.md` dans le pilotage, puis relancer `node bootstrap.mjs --pull`.
- **Une autre session enregistre le journal des relevés d'héritage.** Chaque ouverture de session y
  ajoute une ligne portant les 10 noms, et rien ne l'arrête à la porte des noms.
  - signal : `git diff --stat origin/main..HEAD -- todo/HERITAGE-RELEVES.jsonl` n'est pas vide avant
    un envoi.
  - parade : trancher D-10 ; d'ici là, ne jamais publier une plage qui touche ce fichier.

## 8. Prochaines actions

Il ne reste qu'une action. Elle vous revient parce qu'elle tranche 5 décisions.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Trancher D-15, D-14, D-10, D-11 et D-13, reprises en entier au bloc 3 — répondre par exemple « D-15 a, D-14 a, D-10 b, D-11 a, D-13 b » | `manuelle_utilisateur` | neuve | `decision` — décider des candidatures, re-sceller des livrables, purger l'histoire publiée et cloner un dépôt privé vous reviennent | D-15 (c), D-14 (c), D-10 (c), D-11 (c) et D-13 (c) s'appliquent : le poste s'ouvre « non prêt » après chaque synchronisation croisée, le circuit reste rouge, les 10 noms restent lisibles dans l'histoire publiée, la charte reste illisible, les candidatures restent sans traitement |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Pilotage `digit-ai-factory` à `cb4ec57b` avant cette synthèse, par avance rapide depuis
  `a3b40b45` ; les 15 autres dépôts inchangés.
- `todo/TODO.jsonl` : 1 création (TF-1325) ce tour.
- Aucune page HTML livrée dans ce tour.
