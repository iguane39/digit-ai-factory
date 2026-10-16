---
destinataire: humain
---

# Le parc est aligné sur GitHub, et 2 branches n'ont jamais été fusionnées dans main : 1 au pilot, 1 chez un produit

## 0. Synthèse d'ouverture

Oui, il existe 2 branches non fusionnées. La première vit sur le dépôt du pilot : elle porte 23
enregistrements faits du 14 au 17/09, dont 7 familles de gabarits de documents que main n'a pas.
La seconde vit chez un produit et date du 06/09. Pour le reste, ce poste et GitHub portent le même
état : les 16 dépôts que le pilot gouverne sont alignés, et j'ai publié le seul reliquat local du
pilot. La branche du pilot ne se fusionne pas telle quelle : ses numéros de travaux sont déjà pris
par d'autres travaux sur main. Ce qui est attendu de vous : 2 décisions, sans urgence.

## 1. En-tête d'identification

- **quoi** — synchronisation avec GitHub et relevé des branches non fusionnées, sur votre message
  « Synchronise avec github. Est-ce qu'il y a des branches existantes qui n'ont pas été mergées
  avec la branche main ? ».
- **sur quoi** — les 20 dépôts git de `c:\dev` : le pilot `digit-ai-factory`, les 13 forges
  `digit-ai-forge-*`, `digit-ai-queue`, le canal privé, et 4 dépôts de produits lus sans y écrire.
- **quand** — le 21/09/2026, de 14h24 à 14h32 (Europe/Paris), heures relevées par `date`.
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `c70de52` à `ce78bba` ; aucun agent
  délégué, escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état, et que vous sachiez quel travail
  dort hors de main. **Test rétro** : le relevé rejoué après la publication rend 0 d'avance et 0
  de retard dans les 16 dépôts gouvernés, et les 2 branches sont nommées, datées et mesurées ;
  l'intention est servie pour le parc, et elle ne l'est pas pour 2 produits en écart, objets de D-2.

## 2. Verdict en une ligne

**2 branches non fusionnées sur 20 dépôts** : `claude/html-quality-new-formats-qhfgvj` au pilot,
23 enregistrements, 344 fichiers, fusion à blanc **13 conflits**, **19 identifiants TF-1073 à
TF-1091 en collision** avec main ; `claude/credentials-demo-accounts-wecztf` chez Produit-61, 2
enregistrements, aucun ancêtre commun avec main · **16 dépôts gouvernés sur 16 alignés**, avance 0,
retard 0 · **1 enregistrement publié** par ce poste, `c70de52..ce78bba` · 2 produits en écart :
Produit-02 à 3 d'avance et 86 de retard, Produit-61 à 1 d'avance.

## 3. Décisions attendues de vous

2 décisions. Aucun bloquant : rien n'est à l'arrêt.

> **D-1 — Le travail de la branche `claude/html-quality-new-formats-qhfgvj` du pilot rejoint-il main ?**
>
> Cette branche est née le 13/09 d'une session Claude Code lancée sur GitHub, et son dernier
> enregistrement date du 17/09 à 21h26. Elle porte 7 familles de gabarits de documents absentes de
> main : compte-rendu, note de synthèse, rapport d'avancement, revue RAID, REX de fin, suivi des
> bénéfices, synthèse exécutive. Elle porte aussi un registre des extensions jugées avec sa
> bibliothèque testée, une analyse L99, une étude d'opportunité et 9 synthèses. Main a avancé de 167
> enregistrements depuis. La branche a numéroté 19 travaux au registre, et main a donné les mêmes
> numéros à 19 autres travaux : une fusion directe mélangerait les deux.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md`, section TODO-FORGE, qui fait
> de `TODO.jsonl` la source unique écrite par `journaliser.mjs` et `ingerer-lot.mjs` ; mesure du
> tour : `git merge-tree --write-tree` rend 13 conflits, la comparaison des identifiants créés
> depuis la base `a3cde26` rend 19 communs sur 19, et TF-1073 désigne deux objets différents.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je reporte le travail de la branche sur main dans une branche locale : les 19 travaux renumérotés par les écrivains du registre, les index régénérés, les oracles du pilot rejoués, puis je vous rends le résultat avant publication | effort complexe × moyen | exclut de garder les numéros TF-1073 à TF-1091 tels que la branche les cite dans ses 9 synthèses ; une table de correspondance les accompagne |
| (b) laisser la branche sur GitHub, sans y toucher | effort nul | exclut que main porte les 7 familles de gabarits ; l'écart grandit à chaque enregistrement de main et le report coûtera plus cher |
| (c) vous supprimez la branche sur GitHub | effort simple × court | exclut de retrouver les 23 enregistrements ailleurs que dans ce clone ; le travail du 14 au 17/09 est abandonné |

Comment faire pour l'option (c) : 1) ouvrir `https://github.com/iguane39/digit-ai-factory/branches` ;
2) cliquer sur la corbeille de la ligne `claude/html-quality-new-formats-qhfgvj` ; 3) confirmer.

> **Si rien n'est décidé** : l'option (b) s'applique — la branche reste sur GitHub, non fusionnée.

> **D-2 — Les 2 produits en écart avec GitHub se synchronisent-ils, et la branche de Produit-61 est-elle reprise ?**
>
> Produit-02 et Produit-61 sont des produits : le pilot n'y écrit que sur un run ouvert chez eux,
> et ce tour les a seulement lus. Produit-02 a divergé : 3 enregistrements locaux du 02/09 et du
> 11/09 jamais publiés, 86 enregistrements de GitHub jamais tirés, le dernier de ce matin à 9h46.
> Produit-61 porte 1 enregistrement local du 11/09 jamais publié et 15 chemins non enregistrés. Sa
> branche `claude/credentials-demo-accounts-wecztf` porte 2 enregistrements du 06/09 : un contrat
> d'identifiants avec 3 comptes de démonstration, et 2 défauts produit consignés. Elle n'a aucun
> ancêtre commun avec main, dont l'histoire a été réécrite depuis ; elle se reporte, elle ne se
> fusionne pas.
>
> **Recommandation : (a).** Source consultée : le garde-fou « produits autonomes » du noyau
> `CLAUDE.md` et le relevé d'ouverture, qui dit « aucun mandat déclaré : toute écriture chez eux sera
> refusée » ; mesure du tour : `git rev-list --left-right --count` rend 3 et 86 chez Produit-02, 1
> et 0 chez Produit-61 ; `git merge-tree` rend 4 conflits chez Produit-02 ; `git merge-base` rend
> « no merge base » pour la branche de Produit-61.

| Option | Coût | Exclusions |
|---|---|---|
| (a) vous ouvrez une session chez chaque produit et vous y donnez la même consigne ; la session tire, arbitre les conflits, publie, et traite la branche chez Produit-61 | effort moyen × court par produit | exclut que le pilot le fasse d'ici : il n'a aucun mandat déclaré sur ces produits |
| (b) les laisser en l'état sur ce poste | effort nul | exclut que ce poste voie les 86 enregistrements de Produit-02 ; les enregistrements locaux ne vivent que sur ce poste, une panne les perd |
| (c) vous déclarez au pilot un mandat sur ces 2 produits, et je le fais depuis cette session | effort moyen × court | exclut la règle « la session s'ouvre chez le produit, jamais ici » pour ce geste |

Comment faire pour l'option (a) : 1) ouvrir le dossier du produit sous `c:\dev` dans VS Code ;
2) y ouvrir une session Claude Code ; 3) écrire « Synchronise avec github ».

> **Si rien n'est décidé** : l'option (b) s'applique — les 2 produits restent tels quels sur ce poste.

## 4. Traité — avec sa preuve

- **Le relevé du parc, après un `git fetch` frais.** Le relevé d'ouverture disait « à jour » ; je
  l'ai refait avant de conclure.
  - preuve : `git fetch --all --prune` puis `git rev-list --left-right --count HEAD...origin/main`
    dans les 20 dépôts — 18 à 0 et 0, Produit-02 à 3 et 86, Produit-61 à 1 et 0.
- **Les branches non fusionnées sont relevées dans les 20 dépôts.**
  - preuve : `git branch -a --no-merged origin/main` rend 1 branche au pilot, 1 chez Produit-61, 0
    dans les 18 autres dépôts.
- **La branche du pilot est mesurée, sans y toucher.** Aucun de ses enregistrements n'est sur main,
  même recopié.
  - preuve : `git cherry origin/main` rend 23 lignes « + » sur 23 ; `git rev-list --left-right
    --count` rend 167 et 23 ; base `a3cde26` du 13/09 à 17h50 ; `git diff --name-status` depuis la
    base rend 305 ajouts et 39 modifications ; 308 des 344 fichiers sont absents de main.
- **La fusion à blanc dit ce qu'une fusion coûterait.**
  - preuve : `git merge-tree --write-tree origin/main` sur la branche rend exit 1 et 13 conflits —
    10 de contenu, dont `oracles/oracle-gabarits-documents.mjs`, `gabarits/documents/catalogue.jsonl`
    et `todo/TODO.jsonl` ; 3 sur des vues du registre que main a retirées.
- **La collision des identifiants est prouvée.**
  - preuve : les identifiants créés depuis `a3cde26` sont 19 sur la branche, 179 sur main, 19 en
    commun ; TF-1073 titre « le catalogue des gabarits ne dit nulle part… » sur la branche et
    « garder l'échantillon de défauts échappés… » sur main.
- **Le reliquat local du pilot est enregistré** : le sceau de la synthèse 20260920c, 1 ligne du
  relevé d'héritage et 5 index régénérés après le tirage des synthèses 20260920d et 20260920e.
  - preuve : `stat` date le sceau du 20/09 à 12h40 ; `git commit --only` a rendu `ce78bba`, 7
    fichiers, accepté par le pré-commit.
- **La publication, en 2 temps.** Le premier `git push` a été refusé, exit 1 : la porte exige le GO
  humain cité. Je l'ai rejoué en citant votre message, comme le 20/09.
  - preuve : `git push origin main`, sous `FORGE_PUSH_GO="GO humain du 21/09/2026 : « Synchronise
    avec github »"`, a rendu `c70de52..ce78bba`, exit 0 ; le pré-push, qui joue la porte des noms,
    l'a laissé passer ; `git rev-list --left-right --count` rend ensuite 0 et 0, arbre propre.

## 5. Non traité — avec son motif

- Le report de la branche du pilot sur main : motif `decision` — voir D-1.
- La synchronisation de Produit-02 et de Produit-61, et la branche de Produit-61 : motif
  `decision` — voir D-2.
- Le produit `digit-ai-marketing` : motif `hors_mandat` — il est aligné sur GitHub, 0 et 0, mais
  porte 8 chemins non enregistrés du 20/09 ; leur enregistrement appartient à une session chez lui.
- Les dépôts de produits rangés hors de `c:\dev` : motif `hors_mandat` — le relevé d'ouverture en
  suit 24, ce tour n'a lu que les 4 qui vivent à côté des forges.
- Le fichier `null` de 47 octets à la racine du parc, signalé par le relevé d'ouverture : motif
  `hors_mandat` — la demande portait sur GitHub et les branches ; vérifier puis supprimer ce
  fichier reste un geste humain, et ce tour n'y a pas touché.
- Cette synthèse et ses fichiers de verdict : motif `borne_atteinte` — elle est enregistrée et
  publiée après son jugement ; le sceau posé après l'affichage laissera au plus 3 fichiers modifiés
  au pilot, qui partiront au prochain enregistrement.

## 6. Écarts à la lettre

- **Vous avez demandé** si des branches restaient à fusionner. **J'ai fait en plus** : une fusion à
  blanc et une comparaison des identifiants. **Pourquoi** : « oui, une branche » ne disait pas que
  la fusionner telle quelle abîmerait le registre des travaux.
- **J'ai lu 4 dépôts de produits sans y écrire.** Votre demande ne bornait pas « github » au parc
  gouverné ; je l'ai lue au plus large pour le relevé, et au plus étroit pour l'écriture.
- **J'ai enregistré et publié 7 fichiers générés du pilot.** Ils étaient finis et vieux d'un jour ;
  le précédent `14e8184` du 20/09 fait de même.
- **Je n'ai pas relu les 344 fichiers de la branche un à un.** Je me suis appuyé sur `git diff
  --stat`, sur les titres des 23 enregistrements et sur la liste des familles ajoutées.

## 7. Risques

- **La branche du pilot vieillit.** Main a reçu 167 enregistrements en 8 jours depuis la base.
  - signal : le compte de conflits de la fusion à blanc monte ; il est de 13 aujourd'hui.
  - parade : trancher D-1 ; l'option (a) part d'une branche locale et ne touche main qu'après
    votre accord.
- **Une fusion directe de la branche corrompt le registre des travaux.**
  - signal : `node todo/oracle-todo.mjs` rend FAIL sur des identifiants en double.
  - parade : ne jamais jouer `git merge` sur cette branche ; renuméroter par les écrivains du
    registre.
- **Les enregistrements locaux de Produit-02 et de Produit-61 ne vivent que sur ce poste.**
  - signal : `git status -sb` y affiche « ahead » depuis le 02/09 et le 11/09.
  - parade : D-2 (a).

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Reporter le travail de la branche `claude/html-quality-new-formats-qhfgvj` sur une branche locale issue de main, avec renumérotation des 19 travaux et oracles rejoués | `auto_ia` | neuve | `dependance_bloc_3` — attend D-1 (a) | les 7 familles de gabarits restent hors de main, et le report coûte plus cher chaque jour |
| **A-2** | Synchroniser Produit-02 et Produit-61 depuis une session ouverte chez chacun, et y reporter la branche `claude/credentials-demo-accounts-wecztf` | `auto_ia` | neuve | `dependance_bloc_3` — attend D-2 (a) ou (c) | 4 enregistrements locaux ne vivent que sur ce poste, et Produit-02 ignore 86 enregistrements de GitHub |
| **A-3** | Trancher D-1 et D-2 — répondre par exemple « D-1 (a), D-2 (a) » ; pour D-2 (a), ouvrir le dossier du produit sous `c:\dev` dans VS Code, y lancer une session et écrire « Synchronise avec github » | `manuelle_utilisateur` | neuve | `decision` — fusionner du travail dans main et ouvrir un run chez un produit vous reviennent | l'option (b) s'applique aux deux décisions |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié le 21/09/2026 par ce poste : pilot `digit-ai-factory` à `ce78bba`.
- Enregistrement du pilot ce tour : `ce78bba` (reliquat de ce poste).
- Branche du pilot : `origin/claude/html-quality-new-formats-qhfgvj` à `a13a8d0`, base `a3cde26`.
- Branche de Produit-61 : `origin/claude/credentials-demo-accounts-wecztf` à `077c156`.
- `todo/TODO.jsonl` — aucune écriture ce tour.
- Aucune page HTML livrée dans ce tour.
