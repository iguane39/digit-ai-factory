---
destinataire: humain
---

# Synthèse de mandat — décisions 11 (b) et 12 (a) exécutées : l'histoire de la forge des outils est réécrite et publiée, les trois candidatures sont confiées, une classe et un item de plus au registre (05/09/2026)

Vos deux décisions sont exécutées. La forge des outils a été réécrite selon le mode opératoire du pilot, jugée propre sur son histoire entière, publiée en force avec ses étiquettes, et son clone rebâti sur ce poste ; le commit du jour y est désormais public dans une histoire sans nom réel, et les skills installés n'ont pas bougé parce que l'arbre courant n'a jamais porté de nom. Les trois candidatures du matin sont décidées et confiées : un lot chez la forge des outils pour les deux constats du gate d'écriture (la porte qui juge un fichier avant d'en autoriser l'écriture), un lot chez la forge de conception pour les trois exigences socle candidates. La classe « le sceau (l'empreinte qui scelle une vue dérivée) prouve la provenance, pas le contenu » existe au référentiel, et le retour qui l'attendait est entré au registre par elle. Ce qui change pour vous : la forge des outils est publiable, et le mode opératoire de réécriture a été rejoué en une passe et cinq minutes. Ce qui est attendu de vous : trois décisions — supprimer ou non deux branches locales anciennes qui gardent les noms sur ce poste seul, rejouer ou non le même geste sur la forge de développement dont l'histoire reste rouge, et trier les deux constats qui attendent encore.

## 1. En-tête d'identification

- **quoi** — mandat humain « 11b, 12a » sur la synthèse 20260905i : D-11 (b) réécrire l'histoire de forge-agents avant de la publier ; D-12 (a) décider les trois candidatures en bloc, deux lots de travaux, une classe neuve.
- **sur quoi** — forge-agents (histoire réécrite, publiée en force, clone rebâti) ; forge-conception (lot déposé, rien d'autre) ; le pilot `digit-ai-factory` (registre, classes, dossier des originaux de lots, vues).
- **quand** — fin le **05/09/2026 à 16:58 (UTC+02:00)**, ≈ 35 minutes depuis votre mandat.
- **qui** — Claude Fable 5.1 (extension VS Code), sans agent subordonné ; pilot en version `8ccbcdf` avant, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

D-11 (b) **fait** (forge-agents : porte 200 → 0 constats, PASS sur l'histoire entière, `921a5a0 → 0dc0b2a` poussé en force avec 19 étiquettes, clone rebâti, TF-0817 clos) ; D-12 (a) **fait** (TF-0814, TF-0815, TF-0816 décidés ; lots 20260905c chez forge-agents et 20260905d chez forge-conception, PASS T1-T5 (les cinq règles de forme d'un lot de travaux) ; classe neuve ; TF-0818 candidat) ; 13 forges mesurées : 11 PASS, forge-development FAIL (89, histoire), forge-agents FAIL sur deux branches locales seulement.

## 3. Décisions attendues

Les trois décisions découlent des mesures du jour : ce qui reste rouge après la réécriture, et ce qui reste candidat après le tri. Chaque décision porte le même tableau de trois lignes, à lire ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » donne sa complexité et sa durée, « Ce qu'elle exclut » dit ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction, rien n'est trié ni omis.

> **D-13 — Supprime-t-on, sur ce poste, les deux branches locales anciennes de la forge des outils qui gardent l'histoire non réécrite, alors que la sauvegarde hors dépôt les porte déjà ?**
> La réécriture a porté sur ce que GitHub connaissait : la branche principale et ses étiquettes. Le clone de ce poste porte aussi deux branches locales antérieures à la bascule d'août (une cinquantaine de commits chacune, jamais publiées) qui gardent le nom réel dans les mêmes quinze commits ; la porte de publication, jouée sur le clone entier, rend encore deux cents constats, et zéro sur la branche principale seule. Ces branches sont dans le paquet de sauvegarde, vérifié, hors dépôt. Une suppression est un geste humain, jamais celui de l'outil.
> **Recommandation : (a).** Source consultée : `oracle-nom-client-publie` sur le clone entier (FAIL, 200) et sur un clone à branche unique (PASS) ; `git rev-list` des deux branches (58 et 59 commits hors `main`, derniers commits des 09 et 15 août) ; `git bundle verify` du paquet.
> Rien ne référence plus ces branches, et tant qu'elles existent, la porte sur ce clone contredit la porte sur le dépôt publié — deux mesures pour un seul dépôt.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** supprimer les deux branches locales (`git branch -D`), le paquet de sauvegarde faisant foi | simple × court : deux commandes, porte rejouée | exclut de retrouver ces commits sans passer par le paquet |
| **(b)** les garder et les renommer en `archive/…` | simple × court | exclut une porte verte sur le clone entier ; le contraste des deux mesures demeure |
| **(c)** ne rien faire | gratuit | exclut tout effet ; la porte sur ce clone reste rouge |

> **Si rien n'est décidé** : (c) s'applique — les branches restent, invisibles de GitHub, rouges sur ce poste.

> **D-14 — Rejoue-t-on sur la forge de développement, dont l'histoire porte encore quatre-vingt-neuf constats, le même mode opératoire que celui qui vient de tenir en une passe sur la forge des outils ?**
> Ce matin, le commit du jour de la forge de développement a été publié sur une histoire rouge, et sa réécriture est entrée au registre comme chantier séparé. La mesure des treize forges faite ce tour la laisse seule dans cet état : onze forges rendent PASS, la forge des outils est propre sur ce qui est publié, la forge de développement rend quatre-vingt-neuf constats répartis sur cinquante et un commits anciens. Le geste vient d'être rejoué : sauvegarde, règles dérivées des tables, une passe, arbre identique, porte verte, publication forcée, clone rebâti — cinq minutes d'outillage, un feu vert humain pour le push.
> **Recommandation : (a).** Source consultée : mesure de la porte sur les treize clones de `c:\dev` ce jour ; `references\TODO-FORGE.md` (mode opératoire) ; le registre (chantier de réécriture de la forge de développement, candidat depuis ce matin).
> Chaque publication de cette forge contredit la règle « porte verte avant push » tant que l'histoire n'est pas réécrite ; le coût est connu et petit.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** rejouer le mode opératoire sur forge-development, push forcé compris, comme pour la forge des outils | simple × court : même séquence ; tout autre clone de cette forge à recloner | exclut de garder l'histoire telle quelle |
| **(b)** réécrire sans publier, et décider le push à la lecture de la porte | simple × court, plus un aller-retour | exclut la publication ce jour |
| **(c)** ne rien faire | gratuit | exclut tout effet ; la forge reste rouge à chaque push |

> **Si rien n'est décidé** : (c) s'applique — la forge de développement reste publiée sur une histoire rouge.

> **D-15 — Que fait-on des deux constats de la forge de conception qui restent en attente : celui du sceau (l'empreinte qui scelle une vue dérivée) qui prouve la provenance et pas le contenu, entré au registre ce tour, et celui d'un lot de travaux qui nomme le mauvais module producteur, toujours sans classe ?**
> Le premier a désormais une classe et un item : une vue dérivée peut perdre un tiers de son corps, dont deux écarts déclarés, et l'oracle de traçabilité rend PASS parce qu'il ne compare que l'empreinte de la source ; la forge propose deux voies, sceller la liste des sections attendues, ou faire porter à la vue l'empreinte de son propre corps. Le second vise le pilot lui-même : le lot du matin attribuait au mauvais verbe la production d'un champ, et la forge a dû répartir — aucune classe ne couvre « un lot de travaux qui nomme le mauvais module producteur », et le pilot en est le seul producteur.
> **Recommandation : (a).** Source consultée : le lot de retours de la forge de conception du jour (RC-5 : le sceau (même empreinte) ; section « La règle qui aurait évité le retour ») ; `todo\CLASSES.json` (classe créée ce tour, famille « règle morte ») ; `todo\TODO.md` (TF-0818 candidat).
> Le constat du sceau (même empreinte) est mesuré, généralisable et grandit avec chaque champ neuf porté par une vue ; celui du lot est un défaut du pilot, qui se corrige chez lui en lisant le module producteur avant d'écrire.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider TF-0818 et le confier à la forge de conception en un lot (variante « empreinte du corps » d'abord, la moins coûteuse) ; créer la classe « lot de travaux nommant le mauvais producteur » (famille lot-forme) et l'inscrire au registre contre le pilot | simple × court pour la décision ; un lot, une classe, une candidature | exclut un tri fin des deux voies du sceau (même empreinte) |
| **(b)** décider le sceau (même empreinte) seulement | simple × court | exclut la trace du défaut du pilot ; il se reproduira sans être compté |
| **(c)** ne rien décider | gratuit | exclut toute instruction ; les deux restent en attente |

> **Si rien n'est décidé** : (c) s'applique — TF-0818 reste candidat, le second constat reste sans classe ni item.

## 4. Traité — avec sa preuve

- **D-11 (b) — histoire de forge-agents réécrite et publiée** — classe : une histoire ancienne qui porte un nom réel dans des commits que l'arbre courant ne porte plus ; contrôle rouge → vert : porte de publication 200 constats (1 message, 199 contenus, 14 commits, 15 chemins) → 0, PASS sur le clone entier réécrit. Séquence jouée telle quelle : paquet de sauvegarde hors dépôt, vérifié, HEAD consigné à côté ; 34 règles de contenu et 24 paires de noms de fichiers dérivées des deux tables hors dépôt ; `git-filter-repo` (l'outil qui réécrit l'histoire d'un dépôt) installé sur ce poste, une passe sur un clone frais, 109 commits ; `origin` remis ; arbre de `HEAD` identique avant et après (même empreinte) ; publication forcée de `main` et des 19 étiquettes ; clone local rebâti sur `origin/main`.
  - preuve : `c:\dev\_sauvegardes\digit-ai-forge-agents-avant-filter-repo-20260905.bundle` (« is okay ») ; `+ 921a5a0...0dc0b2a main -> main (forced update)` ; `oracle-nom-client-publie` PASS sur le clone réécrit et sur un clone à branche unique du poste ; `oracle-skills` PASS après rebâti (copies installées inchangées) ; TF-0817 décidé et clos au registre (PASS).
- **D-12 (a) — trois candidatures décidées et confiées** — classe : des constats de forges qui attendaient une décision ; TF-0815 et TF-0816 décidés (rangs 2 et 3) et confiés en UN lot à forge-agents ; TF-0814 décidé (rang 4) et confié à forge-conception ; le pilot a tranché la question laissée ouverte par la forge des outils (allonger la ligne de constat du nombre de constats : accepté, borné à ce compte ; classe existante conservée).
  - preuve : `pilot - TRAVAUX - 20260905c.md` (deux éléments) et `20260905d.md` (un élément), sidecars `.tf.jsonl` à côté, `oracle-travaux-pilot` T1 (le moyen de vérification) à T5 (l'ordre justifié) PASS sur les deux ; déposés dans `input\00-travaux\` des deux forges (boîtes ignorées ou non suivies par git, rien n'y est commis) ; originaux dans `output\06-travaux-confies\`, dossier neuf avec son rôle rédigé (`readme-dossiers --check` PASS).
- **Classe neuve et retour sans classe entré au registre** — `sceau-de-vue-provenance-sans-contenu` (famille « règle morte », voisine « verdict de recette non prononçable ») créée dans `todo\CLASSES.json` (32 → 33, version 1.1.0) ; le retour RC-5 de la forge de conception, remis sans sidecar faute de classe, entre sous TF-0818 (candidat, score mesuré).
  - preuve : `oracle-todo` PASS après six événements journalisés (quatre décisions, une clôture, une création) ; vues régénérées (37 actifs, 13 ouverts, 24 clos).
- **Mesure des treize forges** (proposée par TF-0817) : porte de publication jouée sur chaque clone de `c:\dev`.
  - preuve : 11 PASS (agents-security, audit, conception, data, design, observability, ops, organization, seo-geo, tests, websec) ; forge-development FAIL 89 constats sur 51 commits ; forge-agents FAIL 200 sur le clone entier (deux branches locales), PASS sur `main` seule.

## 5. Non traité — avec son motif

- **La suppression des deux branches locales anciennes de forge-agents** : *irréversible* — R-29 (la règle qui réserve toute suppression à l'humain), D-13.
- **La réécriture de forge-development** : *dépendance à une décision humaine* — D-14 ; la mesure est faite, le geste ne l'est pas.
- **L'instruction des deux lots déposés** : *hors mandat* — D-12 (a) disait « déposer » ; ouvrir une session chez chaque forge est une action à mandater (A-36, A-37).
- **TF-0818 et le constat sans classe sur le lot du pilot** : *tout entre en candidat* — D-15.
- **A-25 et A-19 (produit 02), A-6 (l'autre poste), A-17 (D-7)** : *inchangés* — non mandatés ce tour.
- **Le fichier `run\rapport-jouet.md.oracles.json` laissé non suivi chez forge-agents** par la mesure de l'agent du matin : *non supprimé* — une suppression est un geste humain, même d'un artefact d'atelier.

## 6. Écarts à la lettre

- Le mode opératoire dit « répondre N si l'outil propose de continuer une passe d'un autre jour » → aucune question posée par l'outil, clone frais → sans effet.
- Le gabarit des lots de travaux exige un sidecar `.tf.jsonl` → les deux lots du matin n'en avaient pas, ceux de ce tour en ont → écart du matin déclaré ici, non rétro-corrigé (un lot déposé ne se modifie jamais).
- Le gabarit dit que l'original reste au pilot « `output\` daté » → aucun dossier ne l'accueillait, les originaux du matin n'existent qu'en copie chez les forges → dossier `output\06-travaux-confies\` créé ce tour, rôle rédigé ; les originaux du matin ne sont pas recopiés (leur ligne de statut a été éditée par les forges).
- Le lot de la forge des outils demandait « allonger le detail est un changement de contrat, le choix reste au pilot » → tranché dans le lot déposé (accepté, borné au compte) → parce que la décision D-12 (a) portait la candidature entière.

## 7. Risques

- **Tout autre clone de forge-agents est devenu incompatible** (l'autre poste, tout produit qui aurait cloné la forge plutôt qu'installé ses skills).
  - signal : un `git pull` qui rapporte des centaines de commits divergents, ou une fusion qui réintroduit l'ancienne histoire.
  - parade : recloner, jamais fusionner — écrit dans le lot déposé chez la forge et dans la mémoire du poste (A-38).
- **Deux mesures contradictoires sur un même dépôt** tant que D-13 n'est pas tranchée : la porte est verte sur GitHub, rouge sur le clone du poste.
  - signal : une porte FAIL en tête de push depuis ce poste, sur des commits qu'aucune branche publiée ne porte.
  - parade : D-13 (a), ou jouer la porte sur un clone à branche unique, comme le pilot le fait déjà.
- **La forge de développement publie sur une histoire rouge** à chaque push tant que D-14 n'est pas tranchée.
  - signal : quatre-vingt-neuf constats à chaque porte.
  - parade : D-14 (a).
- **Le troisième constat d'un même oracle ouvre encore le gate** (la porte qui juge un fichier avant d'en autoriser l'écriture) tant que le lot 20260905c n'est pas instruit.
  - signal : une écriture acceptée alors qu'elle ajoute un constat de forme.
  - parade : A-36.

## 8. Prochaines actions

Ordre de traitement : d'abord les deux lots à instruire, parce qu'ils sont déposés et que le gate (la porte qui juge un fichier avant d'en autoriser l'écriture) reste ouvert au troisième constat ; puis les gestes qui attendent une décision ; les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-36 | TF-0815, TF-0816 | Ouvrir une session chez forge-agents sur le lot `pilot - TRAVAUX - 20260905c.md` (agent mandaté, porte verte avant push), puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — D-12 (a) disait « déposer » ; ouvrir une session chez un dépôt frère exige un mandat. | Le gate (même porte) s'ouvre au troisième constat ; le repli muet demeure. |
| A-37 | TF-0814 | Ouvrir une session chez forge-conception sur le lot `pilot - TRAVAUX - 20260905d.md`, puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — même règle : une session chez un dépôt frère exige un mandat. | Trois lois transverses restent injugeables en conception. |
| A-38 | TF-0817 | Si D-13 (a) : `git branch -D master sauvegarde/20260809` chez forge-agents, rejouer la porte sur le clone entier (attendu PASS). | `auto_ia` | `dependance_bloc_3` — D-13 ; R-29. | La porte reste rouge sur ce clone. |
| A-39 | TF-0813 | Si D-14 (a) : rejouer le mode opératoire sur forge-development (paquet, règles, filter-repo, porte PASS, push forcé, clone rebâti), clore TF-0813. | `auto_ia` | `dependance_bloc_3` — D-14 ; R-38 pour le push. | La forge publie sur une histoire rouge. |
| A-40 | TF-0818 | Si D-15 (a) : déposer un lot chez forge-conception pour le sceau (variante « empreinte du corps »), créer la classe « lot de travaux nommant le mauvais producteur » et journaliser la candidature contre le pilot. | `auto_ia` | `dependance_bloc_3` — D-15. | Une vue peut perdre une décision opposable sans qu'un oracle le voie. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot ; recloner forge-agents (histoire réécrite). | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | Une fusion depuis l'autre poste réintroduit l'ancienne histoire. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session vivante ce matin ; à vérifier à la reprise. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Forge-agents : paquet `c:\dev\_sauvegardes\digit-ai-forge-agents-avant-filter-repo-20260905.bundle` (+ `…-HEAD.txt`) ; `main` `0dc0b2a` publié en force, 19 étiquettes reposées ; clone local `c:\dev\digit-ai-forge-agents` sur `origin/main` ; lot `input\00-travaux\pilot - TRAVAUX - 20260905c.md` + sidecar déposés.
- Forge-conception : lot `input\00-travaux\pilot - TRAVAUX - 20260905d.md` + sidecar déposés ; rien d'autre.
- Pilot : `todo\TODO.jsonl` — TF-0817 décidé et clos, TF-0814/0815/0816 décidés, TF-0818 créé ; `todo\CLASSES.json` 1.1.0 (33 classes) ; `output\06-travaux-confies\` (originaux, README rédigé) ; vues `todo\TODO.md` et `todo\AVANCEMENT.md` ; cette synthèse — le tout dans le commit qui suit `8ccbcdf`.
- Règles de réécriture : `%TEMP%\regles-reecriture\` (dérivées des tables hors dépôt, jamais copiées dans un dépôt) ; `git-filter-repo` installé par `pip` sur ce poste.
- Oracles rejoués : `oracle-nom-client-publie` sur les 13 forges (11 PASS, 2 FAIL) et sur le clone réécrit (PASS) · `oracle-travaux-pilot` ×2 (PASS) · `oracle-skills` (PASS) · `oracle-todo` (PASS) · `readme-dossiers --check` (PASS).
- Mémoire du poste : note de reconstruction complétée (réécriture de forge-agents, piège des branches locales).
