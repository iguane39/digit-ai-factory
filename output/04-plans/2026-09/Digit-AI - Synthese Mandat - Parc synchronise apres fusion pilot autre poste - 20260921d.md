---
destinataire: humain
---

# Le parc est synchronisé : le pilot a fusionné les 30 enregistrements de l'autre poste, et 3 dépôts sont publiés

## 0. Synthèse d'ouverture

C'est synchronisé. Le pilot avait avancé des 2 côtés : 12 enregistrements sur ce poste, 30
publiés par l'autre poste. Je les ai fusionnés, puis publiés. 2 fichiers étaient en conflit, le
registre des travaux et le catalogue des gabarits ; ils sont résolus et les contrôles sont verts.
5 travaux de ce poste portaient les mêmes numéros que 5 travaux publiés : je les ai renumérotés
avant la fusion. La forge d'audit et la forge des tests avaient du travail fini non publié : il
l'est. Les 16 dépôts du parc rendent 0 d'avance et 0 de retard. 1 seul test du harnais échoue, et
il échouait déjà avant la fusion. Rien n'est attendu de vous.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « synchronise avec github ».
- **sur quoi** — les 16 dépôts git de `c:\dev` que le pilot gouverne : `digit-ai-factory`, les 13
  forges `digit-ai-forge-*`, `digit-ai-queue` et le canal privé `digit-ai-confidentiel`, cloné
  sous `c:\dev\_confidentiel`. Les dépôts de produits n'en font pas partie.
- **quand** — le 21/09/2026, de 20h33 à 21h05 (Europe/Paris), heures relevées par `date`.
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `a1edfdd` à `e00dfb3` ; aucun agent
  délégué, escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état, sans rien perdre du travail de
  l'un ni de l'autre poste. **Test rétro** : le relevé rejoué après le dernier push rend 0 d'avance
  et 0 de retard dans les 16 dépôts, et les 12 enregistrements de ce poste comme les 30 de l'autre
  sont tous ancêtres de main ; l'intention est servie.

## 2. Verdict en une ligne

**16 dépôts sur 16 alignés**, avance 0, retard 0 · **3 dépôts publiés** : pilot
`659e511..e00dfb3` (14 enregistrements dont la fusion), `digit-ai-forge-audit` `f209679..52a7656`
(2), `digit-ai-forge-tests` `29fd97b..e0691b3` (1) · fusion du pilot : **2 conflits résolus**, **5
travaux renumérotés** TF-1252…TF-1256 en TF-1272…TF-1276 · porte des noms **PASS 3 fois sur 3** ·
`oracle-todo`, `oracle-gabarits-documents`, `oracle-catalogues` **PASS** · harnais du pilot
**130/131**, le rouge est antérieur à la fusion.

## 3. Décisions attendues de vous

Aucune décision n'est attendue. Aucun bloquant : rien n'est à l'arrêt.

## 4. Traité — avec sa preuve

- **Le relevé avant tout geste : une vraie double avancée, donc une fusion.** Les 2 postes avaient
  travaillé ; rien n'avait été réécrit. C'est le cas traité le 20/09/2026, pas celui d'un
  historique réécrit.
  - preuve : `git fetch` puis `git status -sb` rend « ahead 12, behind 30 » ; `git merge-base` rend
    `c70de52`, ancêtre commun des 2 lignées.
- **5 numéros de travaux étaient pris des 2 côtés, et sont renumérotés avant la fusion.** L'autre
  poste avait publié ses TF-1252 à TF-1271 ; ce poste avait frappé ses propres TF-1252 à TF-1256 le
  20/09. C'est le risque que la synthèse 20260921c annonçait, et sa parade.
  - preuve : 5 appels à `node todo/renumeroter.mjs`, chacun « 1 ligne réécrite », verdict PASS
    avant et après ; le motif, qui porte l'ancien numéro, est écrit dans chaque item ; enregistrement
    `d580b63`.
- **Le registre des travaux : les 2 postes ajoutaient en fin de fichier.** Le bloc de ce poste,
  daté du 20/09, passe avant le bloc publié, daté du 21/09.
  - preuve : 1 912 lignes lisibles, 494 créations, aucun identifiant en double ; `oracle-todo`
    **PASS**, exit 0.
- **Le catalogue des gabarits : fusionné champ par champ.** Chaque ligne du fichier est un long
  objet ; les 2 postes avaient modifié les mêmes lignes, mais jamais le même champ.
  - preuve : une comparaison à 3 versions (ancêtre, ce poste, publié) sur les 40 lignes ne rend
    aucun champ modifié des 2 côtés ; après fusion, 0 champ sans origine dans l'un des 2 postes.
- **Un conflit que git ne voit pas : 5 familles de gabarits devaient déclarer leur point de
  départ.** Ce poste leur avait donné un squelette de page ; l'autre poste avait apporté la règle
  qui exige d'une telle famille qu'elle dise d'où elle démarre. 3 familles se retrouvaient sans
  déclaration, et 2 portaient « aucun » alors que leur squelette existe maintenant.
  - preuve : après la fusion brute, `oracle-gabarits-documents` rend 3 FAIL sur la règle G11 ; les
    5 familles déclarent leur squelette, dans la forme que l'autre poste emploie pour les siennes,
    et les 5 fichiers déclarés existent sur ce poste ; `oracle-gabarits-documents` **PASS** exit 0,
    `oracle-catalogues` **PASS**.
- **Le harnais complet sur l'arbre fusionné, et le seul rouge rapporté à sa cause.**
  - preuve : `node oracles/self-tests.mjs` rend « 1/131 oracle(s) en défaut :
    scripts/rebatir-clone.test.mjs », 6 PASS et 1 FAIL ; le même test, joué sur l'arbre d'avant
    fusion exporté hors du dépôt, rend le même « 6 PASS, 1 FAIL » ; ni ce test, ni l'outil qu'il
    juge, ni leurs 2 dépendances n'ont été modifiés par l'un ou l'autre poste.
- **La publication du pilot.**
  - preuve : porte des noms jouée à la main, **PASS**, exit 0 ; `git fetch` rend encore 14 et 0 ;
    `git push origin main` rend `659e511..e00dfb3` ; le relevé suivant rend 0 et 0.
- **La publication de la forge d'audit et de la forge des tests.** Ce sont les 3 enregistrements
  que la synthèse 20260920g laissait à publier. Aucune des 2 forges n'avait de retard.
  - preuve : porte des noms **PASS** sur chacune, exit 0 ; `git push` rend `f209679..52a7656` et
    `29fd97b..e0691b3` ; le relevé suivant rend 0 et 0 pour les 2.
- **Le relevé final du parc.**
  - preuve : `git fetch` puis `git rev-list --left-right --count` sur les 16 dépôts rend 0 et 0
    partout, canal privé compris, dont l'arbre est propre ; `node bootstrap.mjs --pull` rend le
    pilot « présent, à jour ».

## 5. Non traité — avec son motif

- Les fichiers non suivis par git dans 4 forges — 5 dossiers de maquettes sous `baseline\` chez
  forge-design, `input\` chez forge-conception, `input\` et `output\` chez forge-tests, 1 fichier
  de verdict chez forge-agents : motif `hors_mandat` — plusieurs chemins portent des noms de
  produits réels, et les enregistrer dans un dépôt publié n'est pas un geste de synchronisation.
- Au pilot, 2 fichiers non suivis sous `input\00-retours\` (un rapport d'audit de Produit-61 et son
  plan de remédiation), la synthèse vidéo 20260919f, les fichiers de verdict de 3 synthèses
  antérieures, le dossier `brag-output\` (11 Mo, le film du 19/09) et `.claude\worktrees\` :
  motif `hors_mandat` — ils étaient déjà non suivis lors des synchronisations du 20/09 et du 21/09 ;
  un rapport d'audit ne se publie pas sans que vous le demandiez.
- La correction du test `scripts/rebatir-clone.test.mjs` : motif `hors_mandat` — le rouge est
  antérieur à la fusion et étranger à la synchronisation ; il fait l'objet de l'action A-1.
- La correction des 6 citations de TF-1252 à TF-1256 dans la synthèse 20260920g : motif
  `borne_atteinte` — un livrable daté garde ses numéros d'origine, règle déjà appliquée au report
  du 21/09 ; la correspondance est écrite dans chaque item renuméroté.

## 6. Écarts à la lettre

- **Vous avez écrit** « synchronise avec github », dans une session ouverte au pilot. **J'ai
  traité** les 16 dépôts gouvernés, pas le seul pilot. **Pourquoi** : c'est le périmètre que cette
  même phrase a reçu les 20/09 et 21/09, et la publication de ces 2 forges était la question
  laissée ouverte par la synthèse 20260920g.
- **J'ai écrit 5 déclarations de point de départ au catalogue pendant la fusion.** **Pourquoi** :
  sans elles, l'arbre fusionné était rouge sur une règle que chaque poste, seul, tenait ; publier
  un rouge né de la fusion aurait transmis le défaut à l'autre poste.
- **J'ai d'abord cru le canal privé absent de ce poste, et c'était faux.** Je l'avais cherché sous
  son nom de dépôt ; il est cloné sous `c:\dev\_confidentiel`. `oracle-synthese` a refusé ce
  constat tiré d'une seule sonde ; la lecture de `bootstrap.mjs` a donné le bon dossier, que le
  relevé trouve aligné et propre.
- **Ce poste n'a pas de hameçon de pré-push** : la porte des noms a été jouée par un appel séparé
  avant chacun des 3 push. Mon premier appel sur les 2 forges portait un chemin mal écrit ; l'outil
  a rendu SKIP, pas PASS, et je l'ai rejoué avec le bon chemin avant de publier.
- **Je publie cette synthèse, son sceau et les index régénérés sous la même demande.** Ils closent
  le même geste ; aucun autre contenu ne part avec eux.

## 7. Risques

- **L'autre poste porte encore l'ancien main.**
  - signal : son relevé d'ouverture affiche un retard de 15 enregistrements ou plus.
  - parade : son tirage en avance rapide à l'ouverture suffit ; aucune fusion n'est à refaire.
- **L'autre poste a frappé de nouveaux travaux à partir de TF-1272 sans avoir tiré.**
  - signal : son `git push` est refusé, puis `oracle-todo` rend FAIL sur un identifiant en double.
  - parade : `node todo/renumeroter.mjs` sur ses seuls numéros, chez lui ; TF-1272 à TF-1276 sont
    publiés et ne bougent plus.
- **La synthèse 20260920g cite TF-1252 à TF-1256, qui désignent maintenant d'autres travaux.**
  - signal : un lecteur cherche TF-1253 au registre et trouve un travail du report du 21/09.
  - parade : chaque item TF-1272 à TF-1276 porte son ancien numéro dans son motif de
    renumérotation ; la correspondance est « ancien numéro plus 20 ».
- **Le rouge du harnais masque un futur rouge du même test.**
  - signal : `scripts/rebatir-clone.test.mjs` rend autre chose que « 6 PASS, 1 FAIL ».
  - parade : l'action A-1 ; d'ici là, comparer le compte de cas et pas seulement le code de sortie.

## 8. Prochaines actions

1 action reste après ce tour, donc sans ordre à arbitrer. Elle n'est pas urgente, parce que le
rouge qu'elle vise est connu et stable ; l'IA peut la jouer dès votre accord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Verser au registre, en candidat, le constat « `scripts/rebatir-clone.test.mjs` rend 6 PASS et 1 FAIL sur ce poste, hors de toute arborescence liée : une arborescence liée attendue retirée est encore listée » | `auto_ia` | neuve | `gate_gouvernance` — le constat est étranger à la synchronisation demandée ; son entrée au registre attend votre accord | le harnais de ce poste reste à 130/131, et un rouge neuf sur ce test passerait inaperçu |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié le 21/09/2026 par ce poste : pilot `digit-ai-factory` à `e00dfb3`, fusion `e00dfb3`,
  renumérotation `d580b63` ; `digit-ai-forge-audit` à `52a7656` ; `digit-ai-forge-tests` à
  `e0691b3`.
- `todo/TODO.jsonl` — 0 création ce tour ; 5 items renumérotés, TF-1272 à TF-1276.
- `gabarits/documents/catalogue.jsonl` — en-tête 1.5.0, 5 points de départ déclarés.
- Mise de côté conservée : `git stash list` rend « reliquat genere avant fusion 20260921 », les
  index d'avant fusion, régénérés depuis.
- Aucune page HTML livrée dans ce tour.
