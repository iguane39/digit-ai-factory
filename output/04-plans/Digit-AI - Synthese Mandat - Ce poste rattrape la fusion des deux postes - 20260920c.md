---
destinataire: humain
---

# Ce poste a rattrapé la fusion publiée par l'autre poste : 7 dépôts tirés, 16 sur 16 alignés sur GitHub

## 0. Synthèse d'ouverture

Ce poste porte maintenant le même état que GitHub et que l'autre poste : vous pouvez reprendre le
travail ici sans rien perdre de la fusion de ce matin. 7 dépôts avaient du retard, parce que l'autre
poste a publié sa fusion entre 11h et 12h05. Je les ai tirés en avance rapide, sans fusion et sans
arbitrage. La copie installée des skills est réalignée : le skill de rendu Word, gardé par la
fusion, est invocable depuis ce poste. Pendant ma publication, l'autre poste a publié une fois de plus, à 12h19 ;
j'ai rejoué mes 2 enregistrements par-dessus le sien. J'ai versé 1 constat au registre des travaux.
Ce qui est attendu de vous : 1 décision, sans urgence, sur le dépôt du produit marketing de Digit-AI.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « Synchronise avec github ».
- **sur quoi** — les 16 dépôts git de `c:\dev` que le pilot gouverne : `digit-ai-factory`, les 13
  forges `digit-ai-forge-*`, `digit-ai-queue` et le canal privé `digit-ai-confidentiel`. Les dépôts
  de produits n'en font pas partie.
- **quand** — le 20/09/2026, de 12h18 à 12h40 (Europe/Paris).
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `9a89b7c` à `2a5ef91` ; aucun agent
  délégué, escalade de modèle : aucune.
- **intention** — que ce poste, l'autre poste et GitHub portent le même état, pour que le travail
  reprenne indifféremment sur l'un ou l'autre. **Test rétro** : le relevé rejoué après le dernier
  push rend 0 d'avance, 0 de retard et 0 fichier non enregistré dans les 16 dépôts ; l'intention est
  servie pour le parc, et elle ne l'est pas pour le produit `digit-ai-marketing`, objet de D-1.

## 2. Verdict en une ligne

**16 dépôts sur 16 alignés** : avance 0, retard 0, arbre propre · **7 dépôts tirés** en avance
rapide, 55 enregistrements reçus — pilot 25 puis 1, forge-agents 14, forge-data 6, forge-design 3,
forge-audit 2, forge-organization 2, forge-tests 2 · **2 enregistrements publiés** par ce poste,
`7f5e9b7..2a5ef91` · porte des noms **PASS** · harnais du pilot **125/125** · `oracle-todo`
**PASS** · `oracle-skills` **FAIL** puis **PASS** · 1 candidat entré, TF-1243.

## 3. Décisions attendues de vous

1 décision. Aucun bloquant : rien n'est à l'arrêt.

> **D-1 — Le dépôt du produit `digit-ai-marketing` se synchronise-t-il lui aussi avec GitHub ?**
>
> Ce dépôt vit dans `c:\dev` à côté des forges, mais c'est un produit : le pilot n'y écrit que sur
> un run que vous ouvrez chez lui. Il porte 5 enregistrements jamais publiés et 97 chemins non
> enregistrés, 87 nouveaux et 10 modifiés. Aucun n'a bougé depuis le 17/09 : 4 datent du 12/09, 72
> du 16/09, 11 du 17/09. C'est du travail fini qui ne vit que sur ce poste.
>
> **Recommandation : (a).** Source consultée : la table `PRODUITS_DE_L_ECOSYSTEME` de `bootstrap.mjs`, qui
> classe ce dépôt parmi les produits, et le garde-fou « produits autonomes » du noyau `CLAUDE.md` ; mesure
> du tour : `git rev-list --left-right --count` rend 5 d'avance et 0 de retard, `git status
> --porcelain` rend 97 lignes, `stat` date la plus récente du 17/09.

| Option | Coût | Exclusions |
|---|---|---|
| (a) vous ouvrez une session chez le produit et vous y donnez la même consigne ; la session enregistre, joue la porte des noms et publie | effort simple × court | exclut que le pilot le fasse d'ici : il n'a aucun mandat déclaré sur ce produit |
| (b) le laisser en l'état sur ce poste | effort nul | exclut que l'autre poste ou un clone frais voie le travail des 12 au 17/09 ; une panne de ce poste le perd |
| (c) vous déclarez au pilot un mandat sur ce produit, et je le fais depuis cette session | effort simple × court | exclut la règle « la session s'ouvre chez le produit, jamais ici » pour ce geste |

Comment faire pour l'option (a) : 1) ouvrir le dossier `c:\dev\digit-ai-marketing` dans VS Code ;
2) y ouvrir une session Claude Code ; 3) écrire « Synchronise avec github ».

> **Si rien n'est décidé** : l'option (b) s'applique — le dépôt reste tel quel sur ce poste.

## 4. Traité — avec sa preuve

- **Le relevé avant tout geste.** Le relevé d'ouverture de cette session disait « à jour », mais il
  datait de 10h59 ; votre message est arrivé à 12h18, après la publication de l'autre poste.
  - preuve : `git fetch` puis `git rev-list --left-right --count HEAD...origin/main` dans les 16
    dépôts — 7 en retard, 0 en avance, 9 alignés ; `git merge-base --is-ancestor HEAD origin/main`
    vrai au pilot, donc avance rapide possible partout.
- **Les 6 forges sont tirées.** Leurs arbres étaient propres.
  - preuve : `git pull --ff-only` a rendu « Fast-forward » 6 fois — forge-agents `50e9f0c..7d71271`,
    forge-audit `620cfb7..cdeffcc`, forge-data `a3e6e18..3abcbba`, forge-design `857785c..fa48dfc`,
    forge-organization `487c6fc..c309941`, forge-tests `8bd2387..faed230`.
- **Le pilot est tiré, ses 5 index régénérés mis de côté d'abord.** Seuls des fichiers générés
  différaient ; je les ai rangés dans une mise de côté git, puis régénérés sur l'état reçu.
  - preuve : `git pull --ff-only` a rendu « Fast-forward, 97 files changed » de `9a89b7c` à
    `0be4d79` ; `node scripts/readme-dossiers.mjs` et `node scripts/generer-lisezmoi-output.mjs`
    exit 0 ; la mise de côté est retirée après contrôle, elle ne portait que ces 5 index.
- **L'état reçu fonctionne sur ce poste.**
  - preuve : `node oracles/self-tests.mjs` rend « 125/125 recettes jouées et vertes » ; `node
    todo/oracle-todo.mjs` **PASS** ; `node oracles/oracle-claude-md.mjs` **PASS**.
- **La copie installée des skills est réalignée sur la source reçue.** Classe : copie installée en
  retard sur sa source après un tirage.
  - preuve : `node oracles/oracle-skills.mjs` **FAIL**, exit 1 — K1 sur `digit-ai-docx` jamais
    installé, K2 sur `quality-oracles`, `la-barre` et `digit-ai-propale` ; après `--appliquer`, le
    même oracle rend **PASS**, exit 0.
- **Le reliquat de ce poste est enregistré** : le sceau de la synthèse de ce matin, 1 ligne du
  relevé d'héritage et 4 index.
  - preuve : `git commit --only` a rendu `bbe6d23`, 6 fichiers, accepté par le pré-commit.
- **Le constat vu en passant est au registre, en candidat : TF-1243.** L'index `output\LISEZMOI.md`
  dépend du poste qui le régénère : il lit la taille des fichiers sur le disque et compte les
  fichiers non suivis. Il s'est réécrit sur 389 lignes sans qu'aucun livrable ait changé.
  - preuve : `git show --stat bbe6d23` ; `scripts/generer-lisezmoi-output.mjs` lignes 40 et 78 ;
    `node todo/ingerer-lot.mjs` a rendu « 1 candidature(s) ingérée(s) en CANDIDAT (lot
    7da8f2734a54) », récidive de TF-0914 signalée ; `oracle-todo` **PASS** ensuite.
- **La publication, en 2 temps.** Le premier `git push` a été refusé, exit 1 : l'autre poste avait
  publié `7f5e9b7` à 12h19, votre décision D-1 (a) exécutée là-bas. Le recouvrement tenait à 2 index
  générés. J'ai rejoué mes 2 enregistrements par-dessus, et résolu le conflit en régénérant l'index.
  - preuve : `git rebase origin/main` a rendu « Successfully rebased » ; `bbe6d23` devient
    `14e8184`, `5f17192` devient `2a5ef91` ; `git push origin main`, sous `FORGE_PUSH_GO="GO humain
    du 20/09/2026 : « Synchronise avec github »"`, a rendu `7f5e9b7..2a5ef91` ;
    `oracle-nom-client-publie.mjs` rend « "verdict":"PASS" », exit 0.
- **Le relevé final.**
  - preuve : à 12h34, `git fetch` puis le compte dans les 16 dépôts — avance 0, retard 0, `git
    status --porcelain` 0 ligne partout ; canal confidentiel aligné, aucun contenu affiché.

## 5. Non traité — avec son motif

- Le dépôt du produit `digit-ai-marketing` : motif `decision` — voir D-1.
- Les autres dépôts de produits : motif `hors_mandat` — la demande portait sur le parc que le pilot
  gouverne ; la synchronisation d'un produit appartient à ce produit.
- La correction de TF-1243 : motif `borne_atteinte` — ce tour synchronisait ; le constat attend
  votre décision au registre, comme tout candidat.
- Les actions A-1 et A-2 de la synthèse 20260920b : motif `hors_mandat` — A-2 installe des hameçons
  de pré-push sur l'autre poste et ne peut partir que de là-bas ; ce poste les porte déjà au pilot.
- Cette synthèse et ses fichiers de verdict : motif `borne_atteinte` — elle est enregistrée et
  publiée après son jugement ; le sceau posé après l'affichage laissera au plus 3 fichiers modifiés
  au pilot, qui partiront au prochain enregistrement.

## 6. Écarts à la lettre

- **Vous avez demandé** de synchroniser avec GitHub. **J'ai fait en plus** : le réalignement de la
  copie installée des skills, qui vit hors des dépôts. **Pourquoi** : sans lui, ce poste aurait
  exécuté des skills plus anciens que ceux que GitHub porte, et `digit-ai-docx` y serait resté
  introuvable.
- **J'ai réécrit 2 enregistrements**, par un rejeu sur la tête publiée. Ils n'avaient jamais quitté
  ce poste : aucune histoire publiée n'est touchée. Une fusion aurait ajouté un enregistrement de
  fusion pour 2 index générés.
- **La candidature TF-1243 porte une inférence.** Elle attribue l'écart de 349 à 348 livrables à un
  fichier non suivi de l'autre poste. Je l'ai lu dans le script, qui liste le disque ; je n'ai pas
  ouvert l'autre poste pour le constater.
- **Je n'ai pas relu les 97 fichiers reçus au pilot un à un.** Je me suis appuyé sur le harnais,
  l'oracle du registre, celui du noyau et la porte des noms, tous verts.

## 7. Risques

- **Les 2 postes publient en même temps, et le second est refusé.** C'est arrivé ce tour, à moins de 10
  minutes d'écart.
  - signal : `git push` rend « rejected, non-fast-forward », ou le relevé d'ouverture affiche
    « DIVERGÉ ».
  - parade : `git fetch` juste avant tout enregistrement au pilot ; rejeu des enregistrements non
    publiés ; les index générés se régénèrent, ils ne s'arbitrent pas.
- **Un relevé d'ouverture vieux de plus d'une heure passe pour une mesure du moment.**
  - signal : l'heure du relevé et celle de la demande diffèrent ; ici 10h59 contre 12h18.
  - parade : refaire `git fetch` avant de conclure « à jour » ; ce tour l'a fait.
- **L'index `output\LISEZMOI.md` produit du bruit à chaque changement de poste.**
  - signal : un enregistrement d'index de plusieurs centaines de lignes sans livrable neuf.
  - parade : aucune mécanique aujourd'hui ; TF-1243 la demande.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Rendre l'index `output\LISEZMOI.md` indépendant du poste : fichiers suivis seulement, taille insensible aux fins de ligne, fixture à double sens | `auto_ia` | TF-1243 | `borne_atteinte` — le constat est entré en candidat ce tour ; ce tour synchronisait | chaque synchronisation entre les 2 postes réécrit l'index et expose à un conflit |
| **A-2** | Synchroniser le dépôt du produit `digit-ai-marketing` depuis une session ouverte chez lui | `auto_ia` | neuve | `dependance_bloc_3` — attend D-1 (a) ou (c) | 5 enregistrements et 97 chemins ne vivent que sur ce poste |
| **A-3** | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) » ou « D-1 (c) » ; pour (a), ouvrir `c:\dev\digit-ai-marketing` dans VS Code, y lancer une session et écrire « Synchronise avec github » | `manuelle_utilisateur` | neuve | `decision` — ouvrir un run chez un produit vous revient | l'option (b) s'applique |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié le 20/09/2026 par ce poste : pilot `digit-ai-factory` à `2a5ef91`. Tirés : forge-agents
  `7d71271`, forge-data `3abcbba`, forge-design `fa48dfc`, forge-audit `cdeffcc`, forge-tests
  `faed230`, forge-organization `c309941`.
- Enregistrements du pilot ce tour : `14e8184` (reliquat de ce poste), `2a5ef91` (TF-1243).
- `todo/TODO.jsonl` — 1 création et 1 ingestion ce tour ; 45 candidats, 17 décidés, 19 en cours,
  377 corrigés, 3 écartés.
- Candidature : `input\01-candidatures\lisezmoi-output-depend-du-poste-20260920b.tf.jsonl`.
- Copie installée des skills : `~\.claude\skills\`, réalignée par `oracle-skills.mjs --appliquer`.
- Aucune page HTML livrée dans ce tour.
