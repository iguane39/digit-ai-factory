---
destinataire: humain
---

# Synthèse de mandat — le juste milieu entre les deux voies de remontée, et pourquoi ce n'est pas celui qu'on croit (30/08/2026)

Oui, il en existe un, mais pas celui qui vient d'abord à l'esprit. L'idée naturelle — laisser le
mécanisme de fin de tour relire ce qui s'est passé et en tirer les constats tout seul — a été
mesurée et elle ne tient pas : elle ne verrait que six contrôles sur dix, et prendrait pour un
défaut le simple fait qu'un texte contienne le mot « échec ». Deux journaux fiables existent
pourtant déjà, écrits par des machines et non par des agents ; mais leur contenu, mesuré, se
révèle être à quatre-vingt-dix pour cent le gardien qui refuse des messages ordinaires, pas des
constats sur la Factory. La conclusion est nette et elle simplifie beaucoup : ce qui s'automatise,
ce n'est pas le CONTENU d'un retour, c'est l'OBLIGATION d'en produire un et le TRANSPORT qui le
porte. Le jugement, lui, reste à l'agent — et c'est très bien ainsi, parce qu'aucun contrôle ne
saura jamais dire qu'une amélioration serait souhaitable.

## 1. En-tête d'identification

- **quoi** — recherche d'une voie intermédiaire entre les deux options proposées pour le canal de remontée ; mesure de faisabilité, aucune modification.
- **sur quoi** — le journal de session de cette session, les journaux de verdicts du pilot `.claude\hooks-journal.jsonl` et `*.oracles-historique.jsonl`.
- **quand** — fin le **30/08/2026 à 16:14 (UTC+02:00)**, durée **≈ 20 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail inchangé par ce tour.

## 2. Verdict en une ligne

Le juste milieu naïf est **réfuté par la mesure** — sur 107 appels de contrôle de cette session, seuls **59 %** exposent un verdict extractible, et le relevé compte pour un défaut une commande de recherche qui affiche le mot « échec » ; les 2 journaux fiables qui existent portent bien **610** entrées en 10 jours, mais **414** d'entre elles sont le gardien refusant des messages ordinaires, non des constats sur la Factory.

## 3. Décisions attendues

**Chapeau commun.** La question posée était de trouver une voie entre l'émetteur complet avec son
carnet et le simple crochet qui relit la restitution. La mesure déplace la ligne de partage : elle
ne passe pas entre « beaucoup de machine » et « peu de machine », mais entre ce qu'une machine
peut établir et ce qu'elle ne pourra jamais établir. Une machine sait dire qu'un tour de travail
s'est terminé sans qu'aucun retour n'ait été remis depuis longtemps ; elle ne saura jamais dire
qu'une évolution serait souhaitable. La décision ci-dessous répartit le travail sur cette ligne-là,
et remplace le choix entre les deux options précédentes.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la prose
rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le tableau
donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que la
retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si vous
ne tranchez pas. Vous répondez en citant l'identifiant puis la lettre.

> **D-22 — Sur quelle ligne partage-t-on le travail entre la machine et l'agent, pour la remontée des retours ?**
> La mesure du jour tranche une chose : la machine ne peut pas décider CE QUI mérite d'être remonté. Elle peut en revanche rendre impossible de terminer un tour de travail sans avoir répondu à la question, et elle peut porter le lot jusqu'à la Factory sans qu'on ait à composer quoi que ce soit à la main. Trois façons de découper cela, dont une seule tient les deux bouts.
> **Recommandation : (a).** Source consultée : la loi transverse n° 3 du noyau `CLAUDE.md` — « l'oubli n'existe pas : la surface implicite est proposée d'office et s'écarte explicitement, jamais par omission ». C'est exactement le mécanisme qui manque au canal : aujourd'hui, ne rien remonter et n'avoir rien à remonter sont indiscernables, et c'est cette confusion qui produit les huit jours de silence médian.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** L'OBLIGATION et le TRANSPORT à la machine, le JUGEMENT à l'agent : au-delà d'un seuil de tours ou de jours sans lot, le crochet de fin de tour exige soit un lot, soit une déclaration « rien à remonter » à vocabulaire fermé et journalisée ; l'émetteur compose, vérifie et dépose | Effort **moyen × court** ; le seuil produira des relances jugées inutiles les jours où il n'y a réellement rien | Exclut que le silence reste ambigu : ne rien avoir à dire devient une déclaration, pas une absence |
| **(b)** L'OBLIGATION seule, sans émetteur : le crochet relance, et le produit compose son lot à la main comme aujourd'hui | Effort **simple × court** | Exclut la partie du problème qui est mécanique : composer un lot, son sidecar (le fichier jumeau qui porte les données du lot sous forme lisible par machine) et le porter dans la boîte reste trois gestes manuels à chaque fois |
| **(c)** Le TRANSPORT seul, sans obligation : l'émetteur existe, on s'en sert quand on y pense | Effort **simple × moyen** | Exclut la régularité que vous demandez : c'est l'état actuel avec un outil de plus, et rien ne garantit qu'on l'appelle |

> **Si rien n'est décidé** : aucune des trois, et le canal reste ce qu'il est — un geste de fin de run que sept sources sur quinze n'ont accompli qu'une seule fois.

## 4. Traité — avec sa preuve

- **Le juste milieu naïf a été mesuré, puis écarté** : faire relire au crochet ce qui s'est passé pendant le tour ne marche pas.
  - preuve de RAPPEL : sur les **107** appels de contrôle de cette session, **63 seulement** — 59 % — exposent un verdict extractible de leur sortie. Les 44 autres passent par une mise en forme qui ne laisse aucun jeton reconnaissable. Un mécanisme fondé là-dessus manquerait quatre défauts sur dix.
  - preuve de PRÉCISION : parmi les commandes comptées comme ayant rendu un échec figure une simple recherche de texte dans un fichier source, qui affichait le mot recherché. Le relevé confond donc « un contrôle a échoué » et « un texte contient ce mot » — c'est un contrôle qui accuse à tort, et la doctrine dit ce qu'il devient : contourné.
- **Deux journaux fiables existent déjà**, écrits par des machines et non par des agents.
  - preuve : `.claude\hooks-journal.jsonl`, **120 303 octets**, écrit par le crochet de fin de tour, avec un enregistrement par tour portant l'horodatage, le verdict, les règles en défaut et les règles bloquantes ; et un journal par document `*.oracles-historique.jsonl`, écrit par le gardien de qualité à chaque écriture, avec la date, le verdict, le profil et la liste des échecs.
- **Mais leur contenu n'est pas ce qu'on espérait**, et c'est le point qui déplace la solution.
  - preuve : **610** entrées de fin de tour journalisées du 20 au 30/08, dont **414 non vertes**. Les règles les plus fréquemment en défaut sont celles de la structure d'une restitution — huit règles totalisant plus de 1 700 occurrences. Autrement dit, l'écrasante majorité de ce journal enregistre le gardien refusant un message ordinaire, pas un constat sur la Factory. Une alimentation automatique depuis cette source produirait plusieurs centaines d'entrées sans valeur.
- **La ligne de partage utile a été identifiée**, et elle n'est pas celle de la question.
  - preuve : les lots réellement remontés par les produits décrivent des défauts DE LA FACTORY constatés à l'usage — un contrôle qui accuse à tort, un gabarit qui manque, une règle qui coûte. Or aucun oracle ne juge la Factory : ils jugent le produit. Il n'existe donc, par construction, aucun verdict machine dont on puisse déduire un retour. Ce qui reste automatisable est l'obligation d'en produire un et le transport qui le porte.
- **L'ordre de grandeur du seuil est disponible**, si la voie retenue en demande un.
  - preuve : le pilot journalise environ **61 tours de travail par jour** sur les dix derniers jours ; côté produits, le silence médian entre deux lots est de **8 jours** et le maximum observé de **16**. Un seuil exprimé en jours plutôt qu'en tours est donc le plus lisible.

## 5. Non traité — avec son motif

- **L'écriture du mécanisme** : *dépendance à une décision humaine* — la décision ci-dessus, dont les trois voies ne partagent pas le même code.
- **Le seuil exact de relance** : *dépendance bloc 3* — il n'a de sens que si la voie retenue comporte une obligation ; la mesure du jour en donne l'ordre de grandeur et non la valeur, qui est un arbitrage entre relances inutiles et silences longs.
- **Le vocabulaire fermé de la déclaration « rien à remonter »** : *dépendance bloc 3* — il se conçoit avec le mécanisme, sur le modèle des vocabulaires fermés déjà employés pour les motifs d'action, et il n'a pas d'existence séparée.
- **L'exploitation des deux journaux de verdicts comme source de constats** : *écarté* — la mesure montre qu'ils enregistrent le gardien plutôt que la Factory. Critère de réouverture : si un jour un contrôle jugeait les outils de la Factory eux-mêmes, son journal deviendrait une source légitime.
- **Les 4 produits sans aucune pièce** : *écarté pour ce tour* — aucun crochet ne s'y exécute, donc aucune obligation ne les atteindra. Réouverture avec la décision de dépôt posée ce matin.
- **Les 10 décisions ouvertes aux tours précédents** : *hors mandat*.

## 6. Écarts à la lettre

- **vous avez demandé** un juste milieu entre les deux options → **j'ai fait** une mesure de faisabilité qui écarte le milieu attendu et en propose un autre → **pourquoi** : la voie intermédiaire évidente consistait à faire déduire les constats par la machine à partir de ce qu'elle observe. Elle est séduisante et elle ne tient pas — 59 % de rappel et des accusations fausses. Proposer un milieu qui ne fonctionne pas aurait été pire que de n'en proposer aucun.
- **votre question portait sur deux décisions à la fois**, la première sur le mécanisme et la seconde sur ce qui l'alimente → **j'ai répondu par une seule** → **pourquoi** : la mesure montre que les deux moitiés ne se découpent pas séparément. Dès lors qu'aucune machine ne peut établir le contenu d'un retour, la question de l'alimentation se réduit à celle de l'obligation, et les deux décisions n'en font plus qu'une.
- Aucun autre écart.

## 7. Risques

- **Un seuil de relance produira des rappels les jours où il n'y a rien à dire.**
  - signal : plusieurs tours de suite se terminent par une déclaration « rien à remonter », toujours la même.
  - parade : c'est le coût assumé de la voie recommandée, et il est faible — une déclaration coûte une ligne. Le seuil se règle ensuite sur les journaux, puisqu'ils enregistrent chaque déclaration.
- **Rendre la déclaration obligatoire peut produire une déclaration de complaisance.**
  - signal : des déclarations « rien à remonter » systématiques, dans des tours où des défauts ont manifestement été rencontrés.
  - parade : acceptation déclarée — aucun mécanisme ne distingue une déclaration sincère d'une déclaration de confort, exactement comme aucun ne distingue un motif d'action sincère d'un motif de contournement. La doctrine le dit déjà pour les motifs, et le dirait ici.
- **Le canal automatisé n'atteindra que les produits équipés.**
  - signal : les remontées viennent toujours des deux mêmes produits.
  - parade : le contrôle d'héritage livré aujourd'hui installe désormais les pièces tout seul, mais seulement là où le lanceur existe déjà — quatre produits sur six restent hors de portée.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte.

## 8. Prochaines actions

Ordre de traitement : enregistrer passe devant, parce que son absence peut faire perdre tout le reste ; la construction du canal vient ensuite, une fois la ligne de partage tranchée.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, comparateur du crochet, contrôle d'héritage réparateur, gabarit de configuration complété. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin ; la publication relève d'un feu vert humain. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 2 | `neuve` | Écrire l'émetteur du canal produit vers Factory et, selon la voie retenue, l'obligation de fin de tour ; éprouver les deux dans leurs deux sens sur un produit témoin jetable. | `auto_ia` | `dependance_bloc_3` — attend la décision ci-dessus, qui détermine entièrement ce qui s'écrit. | Le canal reste un geste de fin de run, et sept sources sur quinze resteront muettes après un seul envoi. |
| 3 | `neuve` | Déposer chez les 4 produits sans pièce un lot de travaux décrivant les artefacts à installer, sans quoi aucun mécanisme décidé ici ne les atteindra. | `auto_ia` | `dependance_bloc_3` — attend la décision de dépôt posée ce matin. | Quatre produits sur six resteront hors de portée de tout crochet, donc de toute remontée automatique. |
| 4 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés il y a deux tours. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 5 | `neuve` | Trancher les 10 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Juste milieu du canal de remontee - 20260830k.md`
- Mesure de faisabilité : journal de session de cette session, 107 appels de contrôle, 63 verdicts extractibles, un faux positif identifié sur une commande de recherche
- Journaux de verdicts examinés : `.claude\hooks-journal.jsonl` (120 303 octets, 610 entrées du 20 au 30/08, 414 non vertes) et les journaux par document `*.oracles-historique.jsonl` (date, verdict, profil, résumé, échecs)
- **Aucune modification dans ce tour** : ce message est une étude de faisabilité, le dépôt est inchangé
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
