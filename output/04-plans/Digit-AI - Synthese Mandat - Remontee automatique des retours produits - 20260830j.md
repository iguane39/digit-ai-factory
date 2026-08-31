---
destinataire: humain
---

# Synthèse de mandat — pourquoi les produits ne remontent rien tout seuls, et ce qu'il faudrait pour qu'ils le fassent (30/08/2026)

Votre question a une réponse mesurable, et elle est nette : le canal de remontée possède une
forme, un juge, une boîte de réception et un ingesteur, mais il n'a **ni déclencheur, ni
transport, ni cadence**. Rien, nulle part, ne dit à un produit *quand* remonter quelque chose, et
aucun outil ne porte le lot jusqu'à la Factory — alors que le canal inverse, de la Factory vers le
produit, possède exactement ces deux pièces. La remontée dépend donc entièrement d'un agent qui
se souvient, à la clôture d'un run formel, d'accomplir un geste manuel. Le résultat se lit dans
les chiffres : sur quinze sources ayant déjà remonté quelque chose, sept ne l'ont fait qu'un seul
jour et ne sont jamais revenues, et le silence médian atteint huit jours. Le remède n'est pas une
consigne de plus — c'est la pièce manquante, et je vous propose deux façons de la poser.

## 1. En-tête d'identification

- **quoi** — instruction d'une question de conception : comment obtenir des produits une remontée automatique et régulière, sans demande explicite. Diagnostic et propositions, aucune modification.
- **sur quoi** — le canal de retours de l'écosystème : `gabarits\RETOURS-FORGES.md`, `todo\ingerer-lot.mjs`, `input\00-retours\` et le registre, confrontés au canal inverse `todo\emettre-travaux.mjs`.
- **quand** — fin le **30/08/2026 à 15:44 (UTC+02:00)**, durée **≈ 25 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail inchangé par ce tour.

## 2. Verdict en une ligne

Le canal de remontée n'a **aucun déclencheur et aucun transport** : `gabarits\RETOURS-FORGES.md` ne dit nulle part QUAND émettre, 0 script du dépôt n'écrit dans la boîte de réception, et la doctrine ne place l'émission qu'au pas 7 d'un run formel — mesure du résultat : **7 sources sur 15** n'ont émis que sur un seul jour, silence médian **8 jours**, et un produit portant les trois pièces de la doctrine n'a **jamais** rien remonté.

## 3. Décisions attendues

**Chapeau commun.** Le diagnostic tient en une asymétrie. De la Factory vers le produit, le canal
possède un gabarit, un juge, ET un émetteur qui compose le lot, le vérifie et le dépose. Du produit
vers la Factory, il possède un gabarit et un juge, mais l'émetteur n'existe pas et personne ne dit
quand s'en servir. Les deux décisions ci-dessous portent sur les deux moitiés du remède : la
première sur le mécanisme d'émission, la seconde sur ce qui l'alimente — et c'est la seconde qui
est difficile.

**Comment lire ce qui suit.** Chaque décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si
vous ne tranchez pas. Vous répondez en citant l'identifiant puis la lettre.

> **D-20 — Comment un produit émet-il un retour sans qu'on le lui demande ?**
> Aujourd'hui il ne le fait pas : la doctrine place l'émission à la clôture d'un run, un produit qui travaille hors run n'émet donc jamais, et même en run le geste est manuel — composer le fichier, composer son sidecar, le porter dans la boîte de la Factory. Le canal inverse, lui, a un émetteur qui fait ces trois choses et refuse de redéposer un contenu déjà remis.
> **Recommandation : (a).** Source consultée : `todo\emettre-travaux.mjs`, l'émetteur du canal inverse, dont l'en-tête explique qu'il n'écrit que dans une boîte d'entrée et jamais dans le carnet ni le code du destinataire — la contrainte est la même dans l'autre sens, et la solution est donc déjà écrite, à retourner.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Un émetteur hérité en copie identique, plus deux déclencheurs : en fin de tour de travail si des constats attendent, et à l'ouverture si le silence dépasse un seuil | Effort **moyen × moyen** ; une pièce de plus à faire redescendre chez chaque produit, ce que le contrôle d'héritage sait désormais faire seul | Exclut que la remontée reste suspendue à la mémoire d'un agent en fin de run |
| **(b)** Un seul déclencheur en fin de tour, sans carnet : le crochet lit les blocs « non traité » et « risques » de la restitution et compose le lot | Effort **simple × court** ; dépend de la rédaction d'un texte plutôt que d'une donnée, donc fragile au premier changement de forme | Exclut la remontée d'un constat fait en cours de tour et non repris dans la restitution |
| **(c)** Ne rien automatiser, et rappeler à l'ouverture que le canal existe | Effort **simple × court** | Exclut toute garantie : c'est l'état actuel augmenté d'un rappel, et la mesure montre où il mène |

> **Si rien n'est décidé** : (c) s'applique sans même le rappel — la remontée reste un geste de fin de run, et le silence médian de huit jours se maintient.

> **D-21 — Qu'est-ce qui alimente la remontée, et qui décide qu'un constat mérite d'être remonté ?**
> C'est la moitié difficile. Un transport se construit en peu de lignes ; savoir CE QU'ON REMONTE est un jugement. La doctrine dit déjà « constat en passant → candidat », mais aucun mécanisme ne l'exécute, et un agent absorbé par sa tâche ne s'arrête pas pour consigner ce qu'il a remarqué en chemin.
> **Recommandation : (a).** Source consultée : la règle R-48 de `oracles\oracle-sollicitations.mjs`, née d'un retour humain de séance — « demande à la Factory de retravailler les éléments qu'elle peut traiter toute seule sans que j'aie de décisions à prendre à ce niveau-là ». Un verdict d'oracle non vert rencontré chez un produit est exactement cela : un fait déjà mesuré, que personne n'a besoin d'arbitrer pour le transmettre.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Ce qui est déjà MESURÉ entre au carnet tout seul — tout verdict d'oracle non vert rencontré pendant le tour, plus chaque entrée du carnet d'écarts assumés — et l'agent y ajoute ses constats de jugement | Effort **moyen × moyen** ; produit du volume, dont une part sera écartée à l'ingestion | Exclut de perdre un constat parce que personne n'a pensé à l'écrire |
| **(b)** Seulement ce que l'agent inscrit explicitement au carnet, sans alimentation automatique | Effort **simple × court** ; ne change rien au fond, puisque c'est déjà ce que la doctrine demande et que la mesure montre que ça ne se fait pas | Exclut la remontée de tout ce que l'agent n'a pas remarqué ou n'a pas pris le temps d'écrire |
| **(c)** Remonter uniquement les verdicts d'oracle non verts, sans jugement d'agent du tout | Effort **simple × moyen** ; ne remonte que du mécanique, et rate les évolutions et améliorations que vous citez dans votre question | Exclut les propositions d'évolution, qui ne sont jamais le verdict d'un contrôle |

> **Si rien n'est décidé** : (b) s'applique de fait, puisque c'est la doctrine actuelle — et sept sources sur quinze montrent ce qu'elle produit.

## 4. Traité — avec sa preuve

- **Le gabarit du canal ne dit NULLE PART quand émettre.**
  - preuve : recherche dans `gabarits\RETOURS-FORGES.md` du vocabulaire de déclenchement — « quand », « déclenche », « fin de run », « à la clôture », « régulier », « systématique » : **0 occurrence**. Le document décrit la FORME d'un lot, jamais le MOMENT de l'émettre.
- **Aucun outil du dépôt n'écrit dans la boîte de réception.**
  - preuve : les seuls fichiers qui mentionnent `00-retours` sont l'oracle de la boîte, l'oracle de portée de doctrine et le générateur de README — **trois lecteurs, zéro écrivain**. Le transport du lot est donc un geste manuel, non outillé.
- **Le canal INVERSE possède les deux pièces manquantes**, ce qui établit l'asymétrie plutôt que de la supposer.
  - preuve : `todo\emettre-travaux.mjs` et `gabarits\TRAVAUX-PILOT.md` existent tous deux ; l'émetteur compose, vérifie et dépose, et refuse de redéposer un contenu déjà remis. Rien de tel n'existe dans le sens produit vers Factory.
- **La doctrine ne place l'émission qu'à la clôture d'un run formel.**
  - preuve : `CLAUDE.md` pas 7 — « Clore : lot `<projet> - RETOURS - …` + sidecar remis à `<pilot>\input\00-retours\` » — et `references\ETAPES-RUN.md` au même endroit. Un produit qui travaille hors d'un run cadré n'a donc aucun moment prescrit pour remonter quoi que ce soit.
- **La fin de tour ne parle jamais du canal de retours.**
  - preuve : `gabarits\RESTITUTION.md` mentionne trois fois le mot « retours », et les trois désignent un retour HUMAIN ayant fait naître une règle — jamais le lot qu'un produit doit remettre. Le seul crochet qui s'exécute à chaque fin de tour ne pose donc jamais la question.
- **La mesure du résultat confirme le diagnostic structurel.**
  - preuve : 15 sources ont déjà émis au moins un lot ; **7 d'entre elles sur un seul jour** et jamais depuis. Silence médian au 30/08 : **8 jours**. Quatre sources sont muettes depuis 15 jours ou plus.
- **Un produit portant les trois pièces de la doctrine n'a jamais rien remonté.**
  - preuve : le second produit instancié du poste n'apparaît au registre que comme BÉNÉFICIAIRE de corrections — « au prochain audit », « au run de version » — jamais comme émetteur d'un lot. Il a le gabarit, le juge et le câblage, et le canal reste à sens unique pour lui.

## 5. Non traité — avec son motif

- **L'écriture de l'émetteur et de ses déclencheurs** : *dépendance à une décision humaine* — c'est la première décision ci-dessus, et le choix entre les trois voies change entièrement ce qui est écrit.
- **Le choix de ce qui alimente la remontée** : *dépendance à une décision humaine* — seconde décision ; c'est un arbitrage entre volume et exhaustivité, pas une mécanique.
- **Le seuil de silence qui déclencherait une relance** : *dépendance bloc 3* — il n'a de sens que si la première décision retient la voie (a) ; la mesure du jour donne l'ordre de grandeur, un silence médian de 8 jours et un maximum de 16.
- **La question de savoir si les produits SANS lanceur de la Factory pourraient remonter quoi que ce soit** : *écarté* — quatre des six produits instanciés ne portent aucune pièce, donc aucun crochet ne s'y exécute. Tout mécanisme décidé ici les manquera tant que la décision de leur déposer un lot de travaux, posée ce matin, n'est pas tranchée.
- **Les 10 décisions ouvertes aux tours précédents** : *hors mandat* — les 8 anciennes, plus le faux positif du contrôle des secrets et le sort des fichiers de configuration de tests posés au tour précédent.

## 6. Écarts à la lettre

- **vous avez demandé** comment s'assurer que les produits remontent automatiquement → **j'ai fait** un diagnostic mesuré et deux propositions, **sans rien construire** → **pourquoi** : votre message est une question, et la réponse change du tout au tout selon la voie retenue — un émetteur avec carnet et deux déclencheurs, ou un crochet qui relit la restitution, ne partagent pas une ligne de code. Construire d'office aurait figé un choix qui vous appartient.
- **vous avez demandé** les corrections d'erreurs, les évolutions et les améliorations → **j'ai traité les trois ensemble**, en signalant qu'elles ne s'alimentent pas de la même façon → **pourquoi** : une correction d'erreur se déduit d'un verdict de contrôle, donc s'automatise ; une évolution ou une amélioration est un jugement, et aucun oracle ne la produira jamais. C'est précisément ce que la troisième option de la seconde décision exclut, et c'est dit plutôt que noyé.
- Aucun autre écart.

## 7. Risques

- **Une remontée automatique produirait du volume, et le volume enseveli vaut le silence.**
  - signal : la boîte de réception s'emplit de lots dont l'ingestion écarte la majorité, et le contrôle de boîte devient rouge en permanence.
  - parade : l'ingestion possède déjà un refus atomique et une idempotence par empreinte, et la règle de non-redépôt d'un lot inclus dans un lot non traité a été corrigée le 28/08. Le canal sait donc déjà refuser le doublon ; ce qu'il ne sait pas, c'est trier l'utile.
- **Un déclencheur en fin de tour peut émettre au mauvais moment.**
  - signal : un lot part au milieu d'un travail en cours, décrivant un état transitoire qui n'existe déjà plus.
  - parade : le crochet de fin de tour distingue déjà un tour de TRAVAIL d'un tour de lecture, par le compte des écritures et des commandes ; le même critère borne l'émission.
- **Automatiser la remontée sans automatiser le traitement déplace l'engorgement d'un cran.**
  - signal : le registre passe de 23 tâches ouvertes à plusieurs centaines, et l'arbitrage humain devient le goulot.
  - parade : acceptation à déclarer si vous retenez la voie (a) — le registre impose déjà une décision humaine à l'entrée, et c'est un choix de gouvernance, pas un défaut à corriger.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte.

## 8. Prochaines actions

Ordre de traitement : enregistrer passe devant, parce que son absence peut faire perdre tout le reste ; la construction du canal vient ensuite, et elle n'a de sens qu'une fois les deux décisions rendues, puisqu'elles déterminent ce qui s'écrit.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, comparateur du crochet, contrôle d'héritage réparateur, gabarit de configuration complété. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin ; la publication relève d'un feu vert humain. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 2 | `neuve` | Écrire l'émetteur du canal produit vers Factory et ses déclencheurs, selon la voie retenue, puis l'éprouver dans les deux sens sur un produit témoin jetable. | `auto_ia` | `dependance_bloc_3` — attend les deux décisions ci-dessus, qui déterminent entièrement ce qui s'écrit. | Les produits continuent de ne remonter qu'à la clôture d'un run, et sept sources sur quinze resteront muettes après un seul envoi. |
| 3 | `neuve` | Déposer chez les 4 produits sans pièce un lot de travaux décrivant les artefacts à installer, sans quoi aucun mécanisme décidé ici ne les atteindra. | `auto_ia` | `dependance_bloc_3` — attend la décision de dépôt posée ce matin. | Quatre produits sur six resteront hors de portée de tout crochet, donc hors de toute remontée automatique. |
| 4 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés au tour précédent. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 5 | `neuve` | Trancher les 10 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Remontee automatique des retours produits - 20260830j.md`
- Documents examinés : `gabarits\RETOURS-FORGES.md` (0 mention d'un déclencheur) · `CLAUDE.md` pas 7 et `references\ETAPES-RUN.md` (émission placée à la clôture d'un run) · `gabarits\RESTITUTION.md` (3 mentions de « retours », aucune sur le canal) · `todo\emettre-travaux.mjs` et `gabarits\TRAVAUX-PILOT.md` (le canal inverse, complet)
- Mesure de cadence : registre et archive, 15 sources, 7 n'ayant émis que sur un jour, silence médian 8 jours, maximum 16
- **Aucune modification dans ce tour** : ce message est un diagnostic, le dépôt est inchangé
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
