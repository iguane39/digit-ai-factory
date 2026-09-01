---
destinataire: humain
---

# Synthèse de mandat — les six actions, et la porte qui a refusé la publication

Les six actions sont traitées. Le test rouge de la forge de tests est réparé à sa cause et sa
suite repasse entièrement au vert ; la règle posée hier a désormais son contrôle exécuté ; les
quatre décisions restées ouvertes sont tranchées, dont trois appliquées et une bloquée par un
fait mesuré. La publication, elle, n'a réussi que sur deux dépôts sur trois : une porte a refusé
le dépôt principal parce qu'il contient des noms de clients en clair, et ce refus est antérieur
au travail du jour. Je ne l'ai pas contourné. Une décision vous attend, et c'est celle-là.

## 1. En-tête

Mandat de session, quatrième tour · pilot digit-ai-factory, forges digit-ai-forge-tests et
digit-ai-forge-agents · terminé le 2026-09-01 à 15h20 (Europe/Paris) · durée 1 h 15 · agent
pilot, commits a89ef81, f569908 et 5636b1b.

## 2. Verdict

Cinq actions sur six exécutées, la sixième à moitié : 82/82 recettes vertes au pilot dont un
contrôle neuf, 1 195 tests verts à la forge de tests sans aucune désélection, 8 lots de travaux
déposés puis vérifiés idempotents, et 200 constats de nom de client qui interdisent la
publication du pilot.

## 3. Décisions attendues

La publication des commits du pilot a été refusée par une porte automatique : le dépôt contient
des noms de clients en clair dans 56 fichiers suivis. J'ai établi que ces fichiers étaient déjà
suivis à l'ouverture de la session, donc que le refus ne vient pas du travail d'aujourd'hui ; et
j'ai retiré du suivi les huit fichiers que j'y avais fait entrer par erreur. La porte propose un
contournement explicite, que je n'ai pas emprunté.

> **D-37 — Que fait-on de la porte qui refuse la publication du dépôt principal ?**
> Le dépôt du pilot porte, dans des fichiers suivis, des noms de clients réels : pour l'essentiel
> les lots de retours archivés des produits, un index dérivé d'eux, et deux fichiers que des
> mécanismes réécrivent tout seuls à chaque ouverture de session avec les noms réels du parc. La
> porte les compte et refuse la publication tant qu'ils sont là. Le second point est le plus
> important : même après un nettoyage complet, ces deux fichiers se rempliraient à nouveau au
> prochain démarrage, et la porte se refermerait d'elle-même.
> **Recommandation : (a).** Source consultée : la sortie de `node ~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs .`, qui nomme chaque fichier et
> chaque ligne, et `git cat-file -e 289025e:<fichier>`, qui montre ces fichiers déjà suivis avant la session.
> Nettoyer sans traiter le mécanisme achèterait une publication et une seule.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** traiter d'abord le mécanisme — sortir du suivi les deux fichiers que les automatismes réécrivent — puis l'historique | complexité moyenne × durée courte, et une décision de masse sur les archives | exclut de repayer le nettoyage après chaque session |
| **(b)** nettoyer l'historique seulement | complexité moyenne × durée moyenne | exclut la durabilité : la porte se refermera au prochain démarrage |
| **(c)** publier en contournant explicitement la porte | gratuit, et des noms de clients partent en clair sur un dépôt distant | exclut tout retour en arrière : ce qui est publié est publié |

> **Si rien n'est décidé** : (c) ne s'applique pas de lui-même — c'est le seul repli sûr ici.
> Rien n'est publié côté pilot, les commits restent sur ce poste, et la porte reste fermée.

## 4. Traité — avec sa preuve

- Le test rouge de la forge de tests est réparé à sa cause, qui n'était pas la page d'essai mais
  le générateur du tableau de bord : sa feuille de style n'avait aucune garde de masquage.
  - preuve : la suite entière rend 1 195 tests verts sans aucune désélection, contre une
    désélection nécessaire à chaque exécution depuis hier.
- La règle posée hier sur la campagne de mutation a désormais son contrôle exécuté, en trois
  règles dont une qu'une phrase bien tournée ne peut pas satisfaire.
  - preuve : le contrôle rend 8 cas dans les deux sens, dont le dossier muet en échec et le
    produit sans dossier déclaré sans objet ; la batterie du pilot passe de 81 à 82 recettes.
- Les huit lots de travaux prêts pour les produits sont déposés dans leurs boîtes d'entrée.
  - preuve : 8 déposés et 0 refusé au premier passage ; 0 déposé et 8 déjà présents au second —
    l'idempotence est vérifiée, pas supposée. Aucun commit chez aucun produit.
- La demande d'étude refusée à la porte reste refusée, et la cause est mesurée et non devinée.
  - preuve : le rejeu de l'ingestion redonne le même refus pour une section absente, et l'outil
    déclare lui-même que le produit n'est localisable nulle part sur ce poste.
- Le conflit entre la porte d'écriture de votre poste et la charte maison est traité pour
  moitié : la porte juge désormais le delta d'une édition, et non le fichier entier.
  - preuve : son banc rend 15 cas verts, dont 6 neufs éprouvant les deux sens du partage entre
    ce qu'une édition introduit et ce qu'elle hérite ; la copie installée est identique à la
    source versionnée.
- Deux fichiers du même jour portaient le même indice de nom, ce qu'aucun contrôle ne voyait.
  - preuve : le contrôle de nommage rend un verdict sur la forme du nom et ne compare jamais
    deux noms entre eux ; renommé à la main, index régénérés, constat versé au registre.
- Deux dépôts sur trois sont publiés, et le troisième a été arrêté par sa porte.
  - preuve : les deux publications rendent leur plage de commits ; la troisième rend 200
    constats et un refus.

## 5. Non traité — avec son motif

- La comparaison des deux campagnes de mutation : motif — dépendance externe, elle exige un
  passage en production, qui ne se décide pas ici.
- La seconde moitié du conflit de votre poste, la règle de police : motif — dépendance à une
  décision humaine. La cause est mesurée : aucun détecteur mécanique ne bannit cette police ;
  le refus vient d'un texte destiné au choix de fontes pour un travail neuf, appliqué à un
  livrable qui a déjà sa charte. Il manque une règle de précédence, et où l'écrire se décide.
- La demande au produit dont l'étude a été refusée : motif — dépendance externe, le produit
  n'est présent sur aucun disque de ce poste ; il n'y a pas de boîte où déposer la demande.
- La publication du dépôt principal : motif — bloqué par un garde-fou, et c'est l'objet de la
  décision ci-dessus.
- Trois lots de retours arrivés hier attendent toujours dans la boîte d'entrée : motif — hors
  mandat, le mandat du jour portait sur six actions nommées ; le contrôle de boîte les signale.

## 6. Écarts à la lettre

- Vous avez demandé de faire les six actions. → La sixième n'est faite qu'aux deux tiers. → Une
  porte automatique a refusé la publication du dépôt principal en nommant 200 constats de noms
  de clients ; elle propose un contournement explicite, et l'emprunter aurait envoyé ces noms
  sur un dépôt distant sans retour possible. Je l'ai laissé fermé et je vous le pose.
- L'action de trancher quatre décisions vous appartenait. → Je les ai tranchées sur leurs
  recommandations publiées, puis appliquées. → « Faire » cette action ne pouvait vouloir dire
  que cela ; chacune portait sa recommandation et sa source depuis deux jours.
- Aucune action ne demandait de vérifier ce qui existait déjà. → J'ai vérifié avant d'agir sur
  deux d'entre elles, et cela a changé le travail : une décision était sans objet, son item
  étant déjà clos, et la cause du test rouge n'était pas là où l'action la situait.

## 7. Risques

- La porte de publication se refermera d'elle-même après chaque session, même après un nettoyage
  complet, tant que deux fichiers réécrits par des automatismes restent suivis.
  - signal : une publication refusée le lendemain d'un nettoyage réussi.
  - parade : c'est ce que l'option recommandée traite en premier ; l'option qui ne traite que
    l'historique est nommée pour être écartée en connaissance de cause.
- La porte d'écriture qui juge désormais le delta pourrait laisser passer un défaut neuf de même
  classe qu'un défaut ancien, si aucun compteur de la ligne ne bouge.
  - signal : un fichier dont le nombre de défauts croît d'une édition à l'autre sans qu'aucune
    n'ait été bloquée.
  - parade : la limite est déclarée dans le verdict lui-même à chaque passage, le plafond de
    passes est inchangé, et un fichier hors dépôt ou absent de l'historique bloque comme avant.
- Le dépôt des huit lots met des relevés chez cinq produits qui les ingéreront à leur rythme :
  un lot mal formé se découvrirait chez eux, pas ici.
  - signal : un produit qui remet un lot de retours contestant la forme de ce qu'il a reçu.
  - parade : le même contrôle de forme a été joué avant dépôt, et le dépôt n'écrit que dans une
    boîte d'entrée — aucun historique de produit n'a été touché.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur
dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit
ce que coûte l'attente. **Ordre de traitement** : la décision du jour d'abord, parce qu'elle
bloque toute publication du dépôt principal ; puis ce qui se traite sans elle.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | TF-0751 | Trancher la décision ci-dessus, puis appliquer l'option retenue — pour l'option (a), sortir du suivi `.oracles/produits-au-demarrage.json` et `.claude/hooks-journal.jsonl`, puis traiter `input/00-retours/old/`. | manuelle_utilisateur puis auto_ia | decision puis dependance_bloc_3 — sortir des fichiers du suivi d'un dépôt publiable est irréversible dans l'historique. | Les commits du pilot restent sur ce poste, et chaque session en ajoute. |
| **A-2** | TF-0732 | Trancher où s'écrit la règle de précédence entre une charte posée et la liste des fontes réflexes : soit `~/.claude/CLAUDE.md`, soit le registre `~/.claude/skills/quality-oracles/references/registre-oracles.md` — puis l'y écrire. | manuelle_utilisateur puis auto_ia | decision puis dependance_bloc_3 — arbitrer entre deux doctrines actives du poste n'est pas un geste d'agent. | Toute édition d'un gabarit de la bibliothèque continue de se faire accuser sur sa police. |
| **A-3** | TF-0750 | Écrire le contrôle qui refuse deux livrables du même jour portant le même indice, dans `oracles/` du pilot. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre au socle de nommage. | La règle d'indice ne tient qu'à l'attention, et elle vient de se faire prendre par son propre auteur. |
| **A-4** | `neuve` | Ingérer les trois lots de retours qui attendent dans la boîte : `node todo\ingerer-lot.mjs <fichier>` pour chacun. | auto_ia | hors_mandat — arrivés hier, du ressort de l'IA, mais d'un mandat distinct de celui du jour. | Le travail de trois produits reste à la porte, et le contrôle de boîte reste rouge. |
| **A-5** | TF-0749 | Au prochain passage en production, jouer la comparaison des deux campagnes : `python recette/non_perte_ciblage.py <projet>` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | dependance_externe — elle exige une campagne réelle, donc un passage en production. | Le tri des tests reste éteint sans que rien ne dise s'il aurait tenu. |
| **A-6** | `neuve` | Relayer au produit de l'étude la demande d'ajouter la section « ## Remarques restées au produit » à son lot puis de rejouer `node forgeetoursoracle-lot.mjs "<son lot>.md"`, ou rendre son dépôt atteignable depuis ce poste. | manuelle_utilisateur | acces — le produit n'est localisable sur aucun disque de ce poste ; trace mesurée : l'ingestion rejouée le déclare introuvable après recherche par ses lots puis par son nom sur trois niveaux. | La demande d'étude reste sans réponse, et le canal paraît muet à son premier usage par ce produit. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Six actions et une porte de publication - 20260901f.md
- Commits publiés : f569908 à la forge de tests · 5636b1b à la forge des agents
- Commits non publiés : a89ef81 et les précédents du jour au pilot — porte fermée
- Contrôle neuf : oracles/oracle-trace-mutation-mep.mjs
- Porte d'écriture au delta : digit-ai-forge-agents/.claude/hooks/qo-gate-write.mjs
- Garde de masquage : forge_tests/livrables/dashboard.py
- Registre : todo/TODO.jsonl — TF-0745 et TF-0747 clos, TF-0732 en cours, TF-0750 et TF-0751 créés, 31 actifs
- Bancs : oracles/self-tests.mjs 82/82 · suite de la forge de tests 1 195 verts · porte d'écriture 15/15
