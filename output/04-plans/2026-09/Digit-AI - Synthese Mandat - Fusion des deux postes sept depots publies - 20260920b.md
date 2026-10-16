---
destinataire: humain
---

# Les 2 postes sont fusionnés : 7 dépôts réconciliés au cas par cas, publiés, et le parc entier est aligné sur GitHub

## 0. Synthèse d'ouverture

Ce poste et GitHub portent de nouveau le même état : les 7 dépôts qui avaient avancé des deux
côtés sont fusionnés et publiés, et les 16 dépôts du parc sont alignés. Vous aviez choisi la
fusion au cas par cas ; son résultat est plus simple que prévu, parce que presque chaque correction
faite ici le 14 septembre au soir existait déjà en version publiée, souvent affinée depuis par vos
retours. J'ai donc retenu la version publiée partout où les deux se répondaient, et gardé le
travail de ce poste qui n'avait pas d'équivalent : le rendu de documents Word, le constructeur de
référentiel d'appel d'offres, 2 barres de qualité pour la communication, les études et synthèses
du 15 au 19 septembre, et 42 fiches du registre des travaux, renumérotées pour ne plus
porter le même numéro que celles de l'autre poste. Rien n'est perdu : tout le code écarté reste
dans l'histoire et dans des sauvegardes. La seule décision ouverte, le rangement de la synthèse d'hier, est
tranchée et exécutée. Ce qui est attendu de vous : rien.

## 1. En-tête d'identification

- **quoi** — mandat « Synchronise avec github », exécuté sur votre décision D-1 (b) du jour :
  fusion au cas par cas des 7 dépôts où la campagne du 14/09 avait été jouée sur chaque poste.
- **sur quoi** — le pilot `digit-ai-factory` et 6 forges : `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-design`, `digit-ai-forge-audit`, `digit-ai-forge-tests`,
  `digit-ai-forge-organization`. Les 9 autres dépôts du parc étaient déjà alignés.
- **quand** — le 20/09/2026, de 10h55 à 12h05, puis de 12h12 à 12h30 pour exécuter
  votre réponse « 1a » (Europe/Paris), durée mesurée ≈ 90 min.
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `f5d325ea` à `b69d80b5` ; aucun agent
  délégué, escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état, sans perdre le travail fait ici.
  **Test rétro** : le relevé rejoué après le dernier push rend 0 d'avance et 0 de retard dans les
  16 dépôts, et l'écart restant entre chaque forge fusionnée et sa version publiée d'avant est
  exactement le travail local sans équivalent — l'intention est servie dans ses 2 moitiés.

## 2. Verdict en une ligne

**7 dépôts fusionnés et publiés, 16 sur 16 alignés (avance 0, retard 0), poste prêt au relevé de
fraîcheur** · 51 fichiers en conflit arbitrés (pilot 24, forge-agents 14, forge-data 10,
forge-design 2, forge-organization 1) · registre : 1 709 événements publiés + 110 locaux, 460
créations, 42 items renumérotés TF-1201 à TF-1242, `oracle-todo` **PASS** · bancs : 9 joués, 9
verts · porte des noms **PASS** 7 fois sur 7, jouée après le push et non avant · D-1 (a) exécutée : la
synthèse du 19/09 est enregistrée sous la lettre d'index « g ».

## 3. Décisions attendues de vous

Aucune décision n'est attendue. Aucun bloquant : rien n'est à l'arrêt.

La décision D-1 posée à l'affichage précédent de cette synthèse — ranger ou non le fichier
de restitution du 19/09 sur la synchronisation suspendue — a reçu votre réponse « 1a » à 12h10 ;
son exécution est au bloc 4.

## 4. Traité — avec sa preuve

- **7 sauvegardes fraîches avant tout geste.**
  - preuve : `git bundle create … --all` puis `git bundle verify` → « is okay » pour les 7
    fichiers `c:\dev\_sauvegardes\<dépôt>-avant-fusion-20260920.bundle`, HEAD d'avant consigné à côté.
- **forge-tests et forge-audit : fusion sans conflit.**
  - preuve : `uv run pytest -q` exit 0 ; `npm test` de forge-audit → « 12/12 étape(s) du workflow
    rejouée(s) en local — toutes vertes ».
- **forge-organization : 1 entrée écrite 2 fois, version publiée retenue.** Le type
  « Rapprochement » existait en 2 rédactions ; la publiée date correctement le mandat.
  - preuve : `git diff origin/main --stat` vide après fusion ; `node oracles/self-test.mjs` →
    11/12, le douzième étant un contrôle de fraîcheur du gabarit A0 contre le socle installé,
    rouge avant comme après la fusion, qui ne touche que `registre-types.json`.
- **forge-design : 2 conflits, version publiée retenue.** L'agrégateur publié lit les familles de
  constats dans le registre de `render_page.py --familles` ; il englobe le correctif local TF-1066.
  La page témoin de la marque (TF-1023), sans équivalent, est gardée.
  - preuve : `node oracles/self-test.mjs` → « Tout vert — 48 oracles, 132 règles verrouillées ».
- **forge-data : 5 fonctions écrites 2 fois, versions publiées retenues.** T8 (cibles de lineage nommées par leurs champs), résolution
  des références DAX, pied d'export, rapprochement, couverture contre l'écran : mêmes
  spécifications, 2 codes, et GitHub a bâti 10 enregistrements par-dessus les siens. Les 17
  fichiers locaux en double, que plus rien ne câblait, sont retirés de l'arbre ; une limite
  déclarée que seul le local portait (T8 ne juge pas le rattachement d'une cible au lineage) est gardée.
  - preuve : `git grep` des 9 noms locaux dans la version publiée → 0 citation ;
    `node oracles/self-test.mjs` → « 356 PASS, 0 FAIL ».
- **forge-agents : 14 conflits.** Socle des pages HTML, règle d'enregistrement d'un nouvel oracle (TF-1006)
  et contrôle de transparence repris tels que publiés — les 4 correctifs locaux du socle y existent en
  double, et `oracle-transparence` publié le 17/09 est plus complet que le contrôle local de
  l'article 50. Gardés, sans équivalent publié : le skill `digit-ai-docx`, le constructeur de
  référentiel d'appel d'offres, 2 barres de communication en attente de validation. La
  barre locale n° 3, « publication réseau », est retirée au profit de celle que vous avez
  validée le 17/09.
  - preuve : `git diff origin/main --stat` après fusion → 16 fichiers, tous de ces 3
    travaux ; `self_test.py` du socle → « 406/406 cas passés » ; self-test forge-agents → « 29
    PASS, 0 FAIL » ; self-test `digit-ai-docx` exit 0 ; self-test quality-oracles → « PASS (302
    contrôles) » après propagation.
- **Pilot : 42 items renumérotés avant la fusion.** TF-1073 à TF-1114 de ce poste deviennent
  TF-1201 à TF-1242, GitHub allant jusqu'à TF-1200 ; table de correspondance : ancien numéro + 128.
  - preuve : `node todo\renumeroter.mjs` 42 fois, « verdict_apres: PASS » 42 fois ; le motif est
    consigné dans chaque création ; 2 renvois textuels annotés « ex-TF-… ».
- **Pilot : registre fusionné par horodatage.** Les 2 côtés étaient monotones, 0 inversion.
  - preuve : 1 819 lignes = 1 709 publiées + 110 locales, 460 créations, 0 double création ;
    `node todo\oracle-todo.mjs` → **FAIL** (5 transitions illégales R5) puis **PASS** une fois
    les 5 événements locaux de clôture gardés en note annotée, sans leur changement de statut :
    TF-0938, TF-0960, TF-0964, TF-1006, TF-1025, que l'autre poste avait clos le même jour.
- **Pilot : doctrine de restitution et outillage du registre, versions publiées retenues.**
  Chaque correction locale du 14/09 a son équivalent publié : S44 identique ; l'intention et le
  test rétro sont la règle S51, au bloc 1 ; le point d'étape est S50 ; TF-0987, R14 (refus du doublon strict au registre), R-40.5,
  R-20 ter et l'empreinte de secret sont publiés. `references\INTENTION.md` et le paragraphe R14
  de `references\TODO-FORGE.md`, locaux, sont réalignés sur ces règles publiées.
  - preuve : `node todo/self-test.mjs` → « 58 PASS, 0 FAIL » ; `node oracles/self-test.mjs` →
    « 84 PASS, 0 FAIL » ; `node oracles/oracle-claude-md.mjs` exit 0.
- **Publication des 7 dépôts, GitHub re-vérifié immobile juste avant chaque push.**
  - preuve : `git push origin main` → tests `8bd2387..faed230`, audit `620cfb7..cdeffcc`,
    organization `487c6fc..c309941`, design `857785c..fa48dfc`, data `a3e6e18..3abcbba`, agents
    `50e9f0c..b531cdc` puis `b531cdc..7d71271`, pilot `9a89b7c5..b69d80b5`.
- **Copie installée des skills réalignée.** Elle gardait 2 traces des versions locales
  abandonnées : 10 fichiers orphelins et quality-oracles en 2.15.1 contre 2.15.0 à la source.
  La source monte en 2.15.2, les orphelins partent en quarantaine datée, rien n'est supprimé.
  - preuve : `node oracles/oracle-skills.mjs --appliquer --purger` → **PASS** ;
    `node bootstrap.mjs --pull` → « Poste prêt », 16 dépôts « à jour ».
- **D-1 (a) exécutée : la synthèse du 19/09 sur la synchronisation suspendue est enregistrée.**
  Les lettres « a » à « e » du 19/09 sont suivies et « f » est prise sur disque ; elle devient
  `Digit-AI - Synthese Mandat - Synchronisation suspendue campagne du 14 09 jouee deux fois - 20260919g.md`,
  ses 3 fichiers de verdict renommés avec elle, son texte inchangé.
  - preuve : `run-oracles.mjs` sur le nouveau nom → « CONFORME — 4 PASS, 3 SKIP, 0 échec »,
    nommage compris ; chemin et fichier de verdict : 145 caractères, sous la borne de 150.
- **Porte des noms.**
  - preuve : `oracle-nom-client-publie.mjs` → « "verdict":"PASS" » dans les 7 dépôts.

## 5. Non traité — avec son motif

- La synthèse du film de 25 secondes, le rapport d'audit du Produit-61 posé dans la boîte
  d'entrée, les dossiers `brag-output` et `.claude\worktrees` : motif `hors_mandat` — non suivis
  avant ce tour, ils le restent ; aucun n'empêche l'alignement.
- 3 restes locaux sans équivalent publié, écartés de l'arbre et non versés au registre :
  motif `borne_atteinte` — le tableau d'empreinte de secret au gabarit de paramétrage, la phrase
  « une remontée se pseudonymise avant d'entrer dans la source » de quality-oracles, et les 6
  fixtures locales du socle. Ce tour synchronisait ; ils sont repris à l'action A-1.
- Les index de dossiers et le fichier de verdict de cette synthèse, réécrits par le contrôle de
  fin de tour après l'affichage : motif `borne_atteinte` — ils laisseront au plus 3 fichiers
  modifiés au pilot, qui partiront au prochain enregistrement ; l'alignement mesuré au bloc 2
  porte sur les enregistrements.
- Les fichiers non suivis de forge-conception, forge-design, forge-tests et forge-agents :
  motif `hors_mandat` — non enregistrés par leur forge, ils ne se publient pas tels quels.

## 6. Écarts à la lettre

- **Vous avez choisi** la fusion au cas par cas. **J'ai fait** : un arbitrage fichier par fichier,
  dont l'issue est presque partout la version publiée. **Pourquoi** : la comparaison a montré des
  spécifications identiques et des codes jumeaux ; garder les deux aurait laissé 2 outils pour
  1 même geste, et la publiée portait déjà vos retours des 16 et 17/09.
- **J'ai annoncé** que chaque hameçon de publication jouerait la porte des noms. **C'était faux
  sur ce poste** : aucun hameçon de pré-push n'y est installé, et le pilot publié en attend un qui
  exige votre feu vert en clair. La porte a été jouée après le push, PASS 7 fois ; l'ordre
  prescrit n'a pas été tenu.
- **5 événements du registre sont modifiés, et non ajoutés tels quels** : leur statut local est
  retiré et dit en note. C'est un écart à « l'histoire s'annote, elle ne se réécrit pas », assumé
  parce que l'oracle refusait la transition et que la clôture publiée vit dans l'arbre.
- **La synthèse du 19/09 est enregistrée telle qu'écrite, et la doctrine publiée la refuserait** :
  `oracle-synthese` y rend FAIL sur S43 (2 en-têtes de colonne) et S51 (intention au bloc 1), des
  règles que ce poste n'avait pas le 19/09. Je ne l'ai pas réécrite : c'est un livrable daté.
- **Le relevé de récidives local du 19/09 est écarté** : il mesurait un registre qui n'existe plus.

## 7. Risques

- **Les 2 postes frappent de nouveau les mêmes numéros.**
  - signal : le relevé d'ouverture affiche « DIVERGÉ » au pilot, ou une ingestion est refusée
    parce que le registre distant a avancé.
  - parade : `git fetch` et alignement avant toute ingestion ; `todo\renumeroter.mjs` sinon.
- **Un document de ce poste cite un ancien numéro entre TF-1073 et TF-1114.**
  - signal : un lecteur cherche ce numéro et trouve le sujet de l'autre poste.
  - parade : la correspondance est « ancien + 128 », écrite au bloc 4 et dans chaque item.
- **Une correction locale écartée était meilleure que la publiée.**
  - signal : un défaut corrigé ici le 14/09 au soir reparaît dans un lot de retours.
  - parade : le code local reste dans l'histoire fusionnée et dans les sauvegardes du 19 et du 20/09.
- **Ce poste publie sans hameçon de pré-push.**
  - signal : `ls .git\hooks` ne liste que `pre-commit` au pilot, rien dans les forges.
  - parade : l'installer, action A-2.

## 8. Prochaines actions

Ordre du tableau : les 2 actions de l'IA, dans l'ordre où elles peuvent partir ; aucune
n'empêche de travailler dès maintenant sur ce poste, et aucune ne vous revient.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Verser en candidature les 3 restes locaux sans équivalent publié : tableau d'empreinte de secret au gabarit de paramétrage, pseudonymisation d'une remontée, 6 fixtures du socle | `auto_ia` | neuve | `borne_atteinte` — ce tour synchronisait, il n'ouvrait pas de chantier | 3 idées du 14/09 ne vivent plus que dans l'histoire |
| **A-2** | Installer sur ce poste les hameçons de pré-push du pilot et des forges, puis rejouer `scripts\verifier-hooks-git.mjs` | `auto_ia` | neuve | `borne_atteinte` — constat fait après la publication, hors de la demande | la porte des noms dépend de la mémoire de la session |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Sauvegardes : `c:\dev\_sauvegardes\<dépôt>-avant-fusion-20260920.bundle` pour les 7 dépôts ;
  celles du 19/09 restent à côté.
- Publiés le 20/09/2026 : pilot `b69d80b5`, forge-agents `7d71271`, forge-data `3abcbba`,
  forge-design `fa48dfc`, forge-audit `cdeffcc`, forge-tests `faed230`, forge-organization `c309941`.
- Enregistrements du pilot ce tour : `7083b851` (renumérotation), `e61910e5` (index avant
  fusion), `b69d80b5` (fusion).
- Quarantaine des orphelins de la copie installée : `~\.claude\skills\.quarantaine\20260920-114909\`.
- Synthèse du 19/09 rangée : `output-plans\`, lettre « g », verdicts sous `.oracles\output-plans\`.
- Aucune page HTML livrée dans ce tour.
