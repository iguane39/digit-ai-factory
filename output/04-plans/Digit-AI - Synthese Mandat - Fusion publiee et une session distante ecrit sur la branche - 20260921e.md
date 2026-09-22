---
destinataire: humain
---

# La fusion est publiée, mais une session Claude distante écrit encore sur la branche : ne la supprimez pas

## 0. Synthèse d'ouverture

Votre décision est exécutée : la fusion est sur main et sur GitHub. Une chose a changé 2 minutes
après, et elle corrige ma synthèse précédente. Une session Claude ouverte sur GitHub travaille
encore sur la branche. Elle a vu sa demande de fusion passer à l'état fusionné, puis elle a poussé 2
enregistrements de plus. Si vous supprimiez la branche maintenant, comme je vous le proposais, ce
travail serait perdu. Je l'ai déjà reporté sur une branche locale, contrôles verts, sans le
publier. Cette session numérote ses travaux sur un registre périmé : chaque tour qu'elle joue
recrée une collision. Ce qui est attendu de vous : 2 décisions, publier ce complément, et dire ce
que devient cette session distante.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 3a », posée par la synthèse 20260921b, puis report local
  de 2 enregistrements apparus sur la branche `claude/html-quality-new-formats-qhfgvj` après la
  publication.
- **sur quoi** — le dépôt du pilot `digit-ai-factory` : main publié, et la branche locale
  `report/complement-20260921`, non publiée.
- **quand** — le 21/09/2026, de 15h24 à 15h45 (Europe/Paris), heures relevées par `date`.
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `0038b31` à `659e511` sur GitHub ;
  aucun agent délégué, escalade de modèle : aucune. L'autre acteur du tour est une session Claude
  Opus 5 ouverte sur GitHub, qui signe ses enregistrements « Claude ».
- **intention** — que le travail de la branche vive sur main, et qu'aucune branche du pilot ne
  reste hors de main. **Test rétro** : à 15h27 `git branch -r --no-merged origin/main` ne rendait
  rien ; à 15h45 il rend de nouveau 1 branche, en avance de 2 enregistrements. L'intention a été
  servie pendant 3 minutes ; elle ne tiendra pas tant que la session distante écrit, objet de D-5.

## 2. Verdict en une ligne

**Fusion publiée, `0038b31..ac337df`**, puis synthèse et candidat TF-1271, `ac337df..659e511` ·
**2 enregistrements neufs sur la branche distante**, `304db3e` à 15h30 et `d8c8e56` à 15h32 ·
**2 travaux en collision**, TF-1092 et TF-1093, renumérotés TF-1272 et TF-1273 · complément
fusionné en local, `9d96605`, 5 enregistrements d'avance sur GitHub · harnais **131/131** ·
`oracle-todo` **PASS** · main et GitHub alignés, avance 0, retard 0.

## 3. Décisions attendues de vous

2 décisions. Aucun bloquant : rien n'est à l'arrêt.

> **D-4 — Le complément reporté en local part-il sur main et sur GitHub ?**
>
> La session distante a poussé 2 enregistrements sur la branche après ma publication. Le premier
> ajoute 2 travaux au registre : une collision de version sur le socle des pages HTML, et un défaut
> de la surveillance des récidives, qui déplace sa propre référence quand on la rejoue. Le second
> est sa restitution du tour. Je les ai fusionnés sur la branche locale `report/complement-20260921`,
> avec la même méthode que ce matin. Publier revient à avancer main de 5 enregistrements, puis à
> pousser.
>
> **Recommandation : (a).** Source consultée : le message de l'enregistrement `304db3e`, qui décrit
> ses 2 travaux, et le précédent de votre décision D-1 (a) du 20/09, enregistrement `7f5e9b7`, pour
> l'indice de la synthèse ; mesure du tour : `node oracles/self-tests.mjs` rend 131 recettes vertes
> sur la branche locale, `oracle-todo` rend PASS, et main y est contenu.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je publie le complément : relevé de GitHub, avance de main, porte des noms, push, relevé final | effort simple × court | exclut d'attendre que la session distante ait fini ; si elle pousse encore, un autre complément suivra |
| (b) attendre votre décision D-5, puis publier en une fois ce que la session aura laissé | effort nul aujourd'hui | exclut que main porte ces 2 travaux entre-temps ; ils ne vivent que sur la branche et sur ce poste |
| (c) j'abandonne ce complément local | effort simple × court | exclut que main porte les 2 travaux ; la branche distante reste seule à les porter |

Comment faire pour relire avant de choisir : 1) ouvrir un terminal dans `c:\dev\digit-ai-factory` ;
2) lancer `git log --stat origin/main..report/complement-20260921`.

> **Si rien n'est décidé** : l'option (b) s'applique — le complément reste local, non publié.

> **D-5 — Que devient la session Claude distante qui écrit encore sur la branche ?**
>
> Cette session est celle qui a produit les 23 enregistrements du 14 au 17/09. Elle tourne sur
> GitHub, hors de ce poste, et son adresse figure dans ses enregistrements. Son registre des travaux
> date d'avant la fusion : elle a donné à ses 2 derniers travaux des numéros que main avait déjà
> attribués à d'autres. Elle a aussi daté sa restitution de l'indice « a » du 21/09, déjà pris sur
> main. Elle ignore enfin que ses règles d'oracle et ses 19 premiers travaux ont changé de nom sur
> main. Tant qu'elle écrit sur cette branche, chaque tour recrée ces collisions.
>
> **Recommandation : (a).** Source consultée : les messages des enregistrements `304db3e` et
> `d8c8e56`, qui portent l'adresse de la session et disent qu'elle tient encore un sujet ouvert ;
> mesure du tour : `git rev-list --left-right --count` rend 174 de retard et 2 d'avance pour sa
> branche face à main, et TF-1092 désigne 2 travaux différents des 2 côtés.

| Option | Coût | Exclusions |
|---|---|---|
| (a) vous lui dites de repartir de main sur une branche neuve, et de ne plus écrire sur l'ancienne | effort simple × court | exclut qu'elle garde ses numéros et ses noms de règle d'avant fusion |
| (b) vous fermez cette session, puis vous supprimez la branche une fois D-4 (a) publiée | effort simple × court | exclut de poursuivre là-bas le sujet qu'elle tient encore ouvert |
| (c) la laisser continuer ; je reporte ses enregistrements sur main quand vous me le demandez | effort moyen × court à chaque fois | exclut la fin des collisions : chaque tour là-bas coûte un report ici |

Comment faire pour l'option (a) : 1) ouvrir `https://claude.ai/code/session_013NndDLth6iQ66XdYSk7T4h` ;
2) y coller : « Ta branche est fusionnée dans main, avec renumérotation. Lis la note journalisée
sous TF-1252 du registre de main. Repars de origin/main sur une branche neuve et n'écris plus sur
l'ancienne. » Comment faire pour l'option (b) : 1) ouvrir la même adresse et arrêter la session ;
2) ouvrir `https://github.com/iguane39/digit-ai-factory/branches` et cliquer sur la corbeille de la
ligne `claude/html-quality-new-formats-qhfgvj`.

> **Si rien n'est décidé** : l'option (c) s'applique — la session continue, et la branche reste en
> avance sur main.

## 4. Traité — avec sa preuve

- **D-3 (a) : la fusion est publiée, sans refusion.** GitHub n'avait pas bougé depuis la fusion.
  - preuve : à 15h24, `git rev-list --left-right --count main...origin/main` rend 0 et 0 ; `git
    merge --ff-only` avance main de 27 enregistrements ; `git push origin main`, sous
    `FORGE_PUSH_GO="D-3 (a) du 21/09"`, a rendu `0038b31..ac337df`, exit 0, porte des noms tenue
    au pré-push.
- **Le relevé de 15h27 ne trouvait plus aucune branche hors de main.**
  - preuve : `git fetch --prune` puis `git branch -r --no-merged origin/main` ne rend aucune
    ligne ; `gh pr list --state all` rend la demande de fusion n° 1 à l'état « MERGED ».
- **Le reste de la fusion est au registre, en candidat : TF-1271**, publié avec la synthèse
  20260921c.
  - preuve : `node todo/ingerer-lot.mjs` a rendu « 1 candidature(s) ingérée(s) en CANDIDAT (lot
    460016ae560a) » ; `git push` a rendu `ac337df..659e511`, exit 0.
- **Le relevé qui a suivi ce second push a montré la branche de nouveau en avance.**
  - preuve : `git branch -r --no-merged origin/main` rend 1 ligne ; `git log` rend `304db3e` du
    21/09 à 13:30 +0000 et `d8c8e56` à 13:32 +0000, signés « Claude », avec l'adresse de la session.
- **Les 2 travaux de la session distante sont renumérotés par l'outil du registre.** Classe : même
  numéro frappé par 2 sessions qui ne se voient pas.
  - preuve : rouge, TF-1092 titre « seconde collision de numéro sur le socle » sur la branche et
    « reste archivé TF-0530 » sur main ; vert, `node todo/renumeroter.mjs` joué 2 fois, 1 ligne
    réécrite chacune, `oracle-todo` **PASS** avant et après.
- **Le complément est fusionné en local, en 2 fusions.**
  - preuve : `e5b5591` réunit le registre, 1 900 lignes et 2 propres à la branche, et le relevé
    d'héritage, 56 et 1 ; `9d96605` apporte la restitution distante ; `git branch -r --no-merged`
    sur la branche locale ne rend rien.
- **La restitution distante prend l'indice « d », texte inchangé.** L'indice « a » du 21/09 était
  pris sur main par ma première synthèse du jour.
  - preuve : `git mv` vers « … - 20260921d.md » ; précédent : votre décision D-1 (a) du 20/09,
    enregistrement `7f5e9b7`, qui a fait de même pour une synthèse du 19/09.
- **Le harnais complet passe sur la branche locale.**
  - preuve : `node oracles/self-tests.mjs` rend « 131/131 recettes jouées et vertes », exit 0.

## 5. Non traité — avec son motif

- La publication du complément local : motif `decision` — voir D-4.
- Le sort de la session distante et de sa branche : motif `decision` — voir D-5.
- La suppression de la branche sur GitHub, action A-3 de la synthèse 20260921c : motif `hors_mandat` —
  ce geste est le vôtre, et il n'est plus sûr : il perdrait 2 enregistrements tant que D-4 (a)
  n'est pas publiée.
- Les 2 travaux de la session distante sur le fond, TF-1272 et TF-1273 : motif `borne_atteinte` —
  ce tour les reporte sans les instruire ; ils sont entrés en candidat là-bas et le restent ici.
- La synchronisation de Produit-02 et de Produit-61 : motif `hors_mandat` — votre choix D-2 (a) la
  confie à une session ouverte chez chacun.
- Cette synthèse : motif `borne_atteinte` — elle est enregistrée sur la branche locale après son
  jugement, et part avec elle.

## 6. Écarts à la lettre

- **Vous avez choisi** de publier la fusion. **J'ai fait en plus** : le report local de 2
  enregistrements arrivés après. **Pourquoi** : votre question d'origine portait sur les branches
  non fusionnées, et la branche l'était redevenue 3 minutes après ma réponse.
- **La synthèse 20260921c, déjà publiée, vous proposait de supprimer la branche en disant que rien
  ne serait perdu.** C'était vrai à 15h27 et faux à 15h30. Je ne la réécris pas : cette synthèse la
  corrige.
- **J'ai renommé un fichier venu d'une autre session**, sa restitution, de l'indice « a » à « d ».
  Son texte est inchangé ; la branche distante garde l'ancien nom.
- **Je n'ai pas couru après un troisième enregistrement.** La branche n'a plus bougé entre 15h32 et
  15h45 ; si elle bouge encore, D-5 le règle mieux qu'un report de plus.
- **Le dépôt reste positionné sur la branche locale du complément, pas sur main.**

## 7. Risques

- **Vous supprimez la branche sur GitHub en suivant la synthèse 20260921c.**
  - signal : la page des branches de GitHub n'affiche plus la ligne de la branche.
  - parade : ne rien supprimer avant D-4 (a) ; les 2 enregistrements vivent aussi sur ce poste,
    dans la branche locale `report/complement-20260921`.
- **La session distante pousse encore pendant que vous décidez.**
  - signal : `git branch -r --no-merged` rend de nouveau la branche après une publication.
  - parade : D-5 (a) ou (b) ; tant que D-5 n'est pas tranchée, chaque report se refait à la demande.
- **La session distante reprend TF-1272 ou un numéro voisin pour un autre travail.**
  - signal : `oracle-todo` rend FAIL sur un identifiant en double après un report.
  - parade : `node todo/renumeroter.mjs` sur ses seuls numéros ; ceux de main ne bougent plus.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le complément : `git fetch`, avance de main jusqu'à la branche locale ou refusion si GitHub a bougé, push, relevé final, retour du dépôt sur main | `auto_ia` | neuve | `dependance_bloc_3` — attend D-4 (a) | les 2 travaux de la session distante ne vivent que sur sa branche et sur ce poste |
| **A-2** | Trancher D-4 et D-5 — répondre par exemple « D-4 (a), D-5 (a) » ; pour D-5 (a), ouvrir `https://claude.ai/code/session_013NndDLth6iQ66XdYSk7T4h` et y coller la consigne écrite sous le tableau de D-5 | `manuelle_utilisateur` | neuve | `decision` — publier sur GitHub et diriger une autre session vous reviennent | le complément reste local, et la session distante recrée une collision à chaque tour |
| **A-3** | Ne pas supprimer la branche `claude/html-quality-new-formats-qhfgvj` sur GitHub avant la publication du complément ; la page concernée est `https://github.com/iguane39/digit-ai-factory/branches` | `manuelle_utilisateur` | neuve | `irreversible` — la suppression d'une branche publiée est votre geste, et elle perdrait aujourd'hui 2 enregistrements | rien n'est perdu tant que vous n'y touchez pas |
| **A-4** | Synchroniser Produit-02 et Produit-61 : ouvrir le dossier du produit sous `c:\dev` dans VS Code, y lancer une session et écrire « Synchronise avec github » | `manuelle_utilisateur` | neuve | `decision` — votre choix D-2 (a) confie ce geste à une session que vous ouvrez chez le produit | 4 enregistrements locaux ne vivent que sur ce poste |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié le 21/09/2026 par ce poste : pilot `digit-ai-factory` à `659e511` ; fusion `e902784`.
- Branche locale non publiée : `report/complement-20260921` à `9d96605` ; fusions `e5b5591` et
  `9d96605` ; préparation `9abf4b6`.
- Branche distante : `origin/claude/html-quality-new-formats-qhfgvj` à `d8c8e56`.
- Restitution de la session distante, sur la branche locale :
  `output\04-plans\Digit-AI - Synthese Mandat - Fusion mergee et une alerte que son diagnostic effacait - 20260921d.md`.
- `todo/TODO.jsonl` — sur main : TF-1271 en candidat ; sur la branche locale : TF-1272 et TF-1273.
- Aucune page HTML livrée dans ce tour.
