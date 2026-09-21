---
destinataire: humain
---

# La branche du pilot est fusionnée dans une branche locale, harnais vert : il reste votre accord pour la publier

## 0. Synthèse d'ouverture

Le travail du 14 au 17/09 qui dormait hors de main est maintenant réuni avec main, sur une branche
locale de ce poste. Main et GitHub n'ont pas bougé : rien n'est publié tant que vous ne l'avez pas
dit. Tous les contrôles du pilot passent sur le résultat. La fusion a demandé plus qu'un
rapprochement de fichiers : les deux côtés avaient donné les mêmes numéros à des travaux
différents, les mêmes noms à des règles différentes, et corrigé 2 fois le même défaut. Chaque
cas est arbitré et tracé. Pour les 2 produits, votre choix est noté : le geste part de chez eux.
Ce qui est attendu de vous : 1 décision, publier ou relire d'abord.

## 1. En-tête d'identification

- **quoi** — exécution de vos décisions « 1a, 2a », posées par la synthèse 20260921a : report de
  la branche `claude/html-quality-new-formats-qhfgvj` du pilot, et synchronisation de 2 produits
  depuis une session ouverte chez eux.
- **sur quoi** — le dépôt du pilot `digit-ai-factory`, branche locale
  `report/html-quality-new-formats-20260921` ; main et `origin/main` lus, non modifiés ; Produit-02
  et Produit-61 lus, non modifiés.
- **quand** — le 21/09/2026, de 14h41 à 15h08 (Europe/Paris), heures relevées par `date`.
- **qui** — session pilot Claude Fable 5.1 ; aucun agent délégué, escalade de modèle : aucune.
- **intention** — que le travail de la branche rejoigne main sans abîmer le registre des travaux,
  et que vous voyiez le résultat avant qu'il parte. **Test rétro** : la branche de report contient
  main et la branche d'origine, `git branch -a --no-merged` n'y rend plus rien, le harnais rend
  131 recettes vertes, et main est resté à `0038b31` ; l'intention est servie, la publication
  attend D-3.

## 2. Verdict en une ligne

**Fusion enregistrée en local, `e902784`**, parents `0038b31` et `ffe9c2f` · 347 fichiers, 305
ajoutés et 42 modifiés · **13 conflits résolus sur 13** · **19 travaux renumérotés**, TF-1073 à
TF-1091 devenus TF-1252 à TF-1270 · harnais du pilot **131/131** · `oracle-gabarits-documents`
**FAIL 31 constats** puis **PASS 177/177**, self-test **36/36** · `oracle-todo` **PASS** · porte
des noms **PASS** · main et GitHub inchangés, avance 0, retard 0.

## 3. Décisions attendues de vous

1 décision. Aucun bloquant : rien n'est à l'arrêt.

> **D-3 — La branche locale de report part-elle sur main et sur GitHub maintenant ?**
>
> La branche `report/html-quality-new-formats-20260921` vit sur ce poste seulement. Elle contient
> main tel que GitHub le porte, plus un enregistrement de fusion qui apporte les 23 enregistrements
> de la branche du 14 au 17/09 et mes arbitrages. Publier revient à avancer main jusqu'à cet
> enregistrement, puis à pousser. La branche d'origine apparaîtra alors comme fusionnée sur GitHub.
> L'autre poste publie sur main plusieurs fois par jour : chaque publication de sa part m'oblige à
> refusionner les index générés avant de pousser, sans nouvel arbitrage de fond.
>
> **Recommandation : (a).** Source consultée : la règle R-38 (tout push attend le GO humain), citée par
> la porte de publication du pilot ; mesure du tour : `node oracles/self-tests.mjs`
> rend 131 recettes vertes sur l'arbre fusionné, `git rev-list --left-right --count main...origin/main`
> rend 0 et 0, et `git merge-base --is-ancestor main` sur la branche de report est vrai.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je publie : relevé de GitHub, avance de main jusqu'à la fusion, porte des noms, push, puis relevé final | effort simple × court | exclut une relecture humaine du détail avant publication ; le harnais et 4 oracles sont la seule relecture |
| (b) vous relisez d'abord, puis vous me dites de publier | effort moyen × moyen | exclut une publication aujourd'hui si l'autre poste avance entre-temps sans que je refusionne |
| (c) j'abandonne le report : la branche locale est supprimée, la branche d'origine reste sur GitHub | effort simple × court | exclut que main porte les 7 familles de gabarits ; les arbitrages de ce tour sont perdus |

Comment faire pour l'option (b) : 1) ouvrir un terminal dans `c:\dev\digit-ai-factory` ; 2) lancer
`git diff --stat main report/html-quality-new-formats-20260921` pour la liste, et `git show e902784`
pour le détail ; 3) me dire de publier quand la relecture est faite.

> **Si rien n'est décidé** : l'option (b) s'applique — la branche de report reste locale, non publiée.

## 4. Traité — avec sa preuve

- **D-1 (a) : les 19 travaux de la branche sont renumérotés par l'outil du registre.** Nouveau
  numéro égal à l'ancien plus 179.
  - preuve : `node todo/renumeroter.mjs` joué 19 fois, exit 0, 43 lignes réécrites, `oracle-todo`
    **PASS** avant et après chaque pas ; 6 citations en texte du registre et 16 citations de 10
    fichiers de code et de données suivent ; 0 ligne de la base touchée, mesuré par `git diff`.
- **Une première passe de mon script de citations a abîmé 8 annotations anciennes du registre.**
  Classe : remplacement de texte trop large sur un journal. Je suis reparti du registre intact.
  - preuve : rouge, `git diff a3cde26` rendait 8 lignes de base modifiées ; vert, après reprise
    avec un script qui protège les annotations, le même contrôle rend 0.
- **Le registre et le relevé d'héritage sont réunis en ordre chronologique.**
  - preuve : 1 852 lignes de main et 46 propres à la branche ; relevé d'héritage, 45 et 10.
- **TF-1038 avait été corrigé 2 fois, 1 fois de chaque côté.** Classe : même travail clos par 2
  sessions qui ne se voient pas. Le cycle de main fait foi. Les 2 événements de statut de la
  branche sont écartés et remplacés par une note journalisée.
  - preuve : rouge, `oracle-todo` sur l'union rendait **FAIL** R5 « transition illégale corrige →
    en_cours » ; vert, **PASS** sans ces 2 lignes ; `node todo/journaliser.mjs` a écrit 2 notes,
    sous TF-1038 et sous TF-1252, **PASS** avant et après.
- **2 règles de l'oracle des gabarits portaient le même nom des 2 côtés.** Main garde les siennes :
  G5 (la largeur de page se déclare) et
  G6 (la fiche de conception amont). Celles de la branche changent de nom :
  G11 (le point de départ se déclare) et
  G12 (l'empêchement se classe, vocabulaire fermé).
  - preuve : `node --check` exit 0 ; `node oracles/oracle-gabarits-documents.mjs --self-test` rend
    « 36/36 PASS », soit 29 recettes de main et 7 de la branche.
- **Le catalogue des gabarits est fusionné à trois voies, champ par champ.** Les deux côtés
  l'avaient reformaté en entier.
  - preuve : 40 lignes, 47 champs pris de la branche, 1 seul champ en conflit, la date de
    génération.
- **Les règles de main s'appliquent au contenu venu de la branche, et l'inverse.** Classe : règle
  née d'un côté, contenu né de l'autre.
  - preuve : rouge, `oracle-gabarits-documents` sur le parc rendait **FAIL**, 31 constats — 22 en
    G5, 7 en G10 (section « Document d'auteur »), 2 en G11 ; vert, **PASS 177/177** après 22 pages déclarées « lecture », 7
    gabarits complétés de la déclaration du lecteur et de la section « Document d'auteur », et 2
    familles de main dotées de leur point de départ. Aucune règle CSS ne lit l'attribut ajouté :
    `grep` rend 0 fichier, le rendu est inchangé.
- **3 gabarits changent de version.** Le rapport de données passe en 1.1.1 : les 2
  corrections de TF-1038 convergent. Le dossier d'architecture et le dossier d'exploitation passent
  de 1.1.0 à 1.1.1, avec leur note.
  - preuve : la page fusionnée porte `data-largeur="lecture"` et 6 chapitres bridés sur 6 ; G4
    (couple gabarit et version) et G5 **PASS** sur ces 3 familles.
- **Le harnais complet passe sur l'arbre fusionné.**
  - preuve : `node oracles/self-tests.mjs` rend « 131/131 recettes jouées et vertes », exit 0 ;
    `oracle-claude-md` exit 0 ; `lib-extensions-jugees.test.mjs` rend « 11/11 PASS ».
- **La fusion est enregistrée, et la branche d'origine y est contenue.**
  - preuve : `git commit` a rendu `e902784`, accepté par le pré-commit ; `git branch -a
    --no-merged` sur la branche de report ne rend rien ; `oracle-nom-client-publie.mjs` rend
    « PASS », aucun des 10 termes ni des 21 noms de produit.
- **D-2 (a) est actée : je n'ai rien écrit chez les 2 produits.** Le geste part d'une session que
  vous ouvrez chez eux.
  - preuve : `git rev-parse HEAD` rend toujours `1490051` chez Produit-02 et `04466b6` chez
    Produit-61 ; leurs écarts sont inchangés, 3 et 86, 1 et 0.

## 5. Non traité — avec son motif

- La publication de la fusion sur main et sur GitHub : motif `decision` — voir D-3.
- La suppression de la branche d'origine sur GitHub : motif `hors_mandat` — une fois la fusion
  publiée, elle ne porte plus rien d'unique ; la supprimer reste votre geste.
- Le lecteur et les types de contenu des 7 familles apportées, au catalogue : motif
  `borne_atteinte` — ce tour fusionnait ; les définir est un travail de conception, famille par
  famille. Le catalogue dit encore « famille sans gabarit écrit » pour elles, ce qui est devenu
  faux.
- Le contrôle de rendu au navigateur des 24 pages de gabarits : motif `borne_atteinte` —
  l'attribut ajouté ce tour ne change aucun rendu ; la branche avait joué ce contrôle le 17/09,
  « 24 pages sur 24 tiennent », enregistrement `020111f` ; il se rejoue après publication.
- La synchronisation de Produit-02 et de Produit-61 : motif `hors_mandat` — D-2 (a) la confie à
  une session ouverte chez chacun.
- Cette synthèse : motif `borne_atteinte` — elle est enregistrée sur la branche de report après
  son jugement, et part avec elle.

## 6. Écarts à la lettre

- **Vous avez choisi** « les 19 travaux renumérotés, les index régénérés, les oracles rejoués ».
  **J'ai fait en plus** : le renommage de 2 règles d'oracle, 22 déclarations de largeur, 7 sections
  ajoutées à des gabarits, 3 changements de version. **Pourquoi** : sans eux le harnais du pilot
  aurait été rouge sur main dès la publication.
- **J'ai fait une vraie fusion git, et non un enregistrement de report unique.** Elle garde les 23
  enregistrements d'origine, et GitHub verra la branche comme fusionnée.
- **Les livrables datés de la branche gardent leurs anciens numéros.** Ses 10 synthèses, son étude
  et son lot de travaux citent TF-1073 à TF-1091 et les règles G5 et G6 au sens de la branche. La
  table de correspondance vit au registre, sous TF-1252.
- **La synthèse 20260921a comptait 9 synthèses sur la branche ; il y en a 10.**
- **Le dépôt reste positionné sur la branche de report, pas sur main.** La synthèse y vit ; main
  n'est pas touché.
- **Je n'ai pas relu les 305 fichiers ajoutés un à un.** Je me suis appuyé sur le harnais et sur 4
  oracles.

## 7. Risques

- **L'autre poste publie sur main avant votre décision.**
  - signal : `git rev-list --left-right --count main...origin/main` rend un retard non nul.
  - parade : je refusionne main dans la branche de report ; seuls les index générés et le registre
    se recouvrent, et ils se régénèrent ou se réunissent par l'outil.
- **L'autre poste frappe un numéro entre TF-1252 et TF-1270 avant la publication.**
  - signal : `oracle-todo` rend FAIL sur un identifiant en double après refusion.
  - parade : `renumeroter.mjs` de nouveau, sur les seuls numéros touchés ; publier vite ferme la
    fenêtre.
- **La prochaine session s'ouvre sur la branche de report, sans amont.**
  - signal : le relevé d'ouverture avertit que le tirage en avance rapide ne s'applique pas.
  - parade : trancher D-3 ; en (a) comme en (c), je remets le dépôt sur main.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier la fusion : `git fetch`, avance de main jusqu'à `e902784` ou refusion si main a bougé, porte des noms, push, relevé final, retour du dépôt sur main | `auto_ia` | neuve | `dependance_bloc_3` — attend D-3 (a) | le travail du 14 au 17/09 ne vit que sur ce poste, et chaque publication de l'autre poste ajoute une refusion |
| **A-2** | Verser au registre, en candidat, la définition du lecteur et des types de contenu des 7 familles apportées | `auto_ia` | neuve | `dependance_bloc_3` — se verse après D-3 (a), sur le registre publié, pour ne pas frapper un numéro de plus avant publication | le catalogue garde une mention devenue fausse sur 7 familles |
| **A-3** | Trancher D-3 — répondre « D-3 (a) », « D-3 (b) » ou « D-3 (c) » ; pour relire, lancer `git show e902784` dans `c:\dev\digit-ai-factory` | `manuelle_utilisateur` | neuve | `decision` — publier sur GitHub vous revient (R-38) | l'option (b) s'applique |
| **A-4** | Synchroniser Produit-02 et Produit-61 : ouvrir le dossier du produit sous `c:\dev` dans VS Code, y lancer une session et écrire « Synchronise avec github » | `manuelle_utilisateur` | neuve | `decision` — votre choix D-2 (a) confie ce geste à une session que vous ouvrez chez le produit | 4 enregistrements locaux ne vivent que sur ce poste |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Branche locale : `report/html-quality-new-formats-20260921` à `e902784` ; préparation `ffe9c2f`.
- Main et `origin/main` : `0038b31`, inchangés. Rien n'est publié ce tour.
- Branche d'origine : `origin/claude/html-quality-new-formats-qhfgvj` à `a13a8d0`.
- `todo/TODO.jsonl` — 44 lignes reportées sur 46, dont 43 renumérotées ; 2 écartées ; 2 notes journalisées.
- Scripts du tour : dossier temporaire de la session, non versés au dépôt.
- Aucune page HTML livrée dans ce tour ; 22 pages de gabarits reçoivent un attribut sans effet de
  rendu.
