---
destinataire: humain
---

# Synthèse de mandat — pourquoi « Améliore le prompt » ne déclenche rien, et depuis quand (30/08/2026)

Vous avez raison de trouver ça absurde, et ce n'est pas une prudence de ma part : le noyau de la
Factory m'ordonne bien d'appeler ce skill quand vous employez ces mots, et le skill lui-même
porte un réglage qui interdit à un modèle de l'appeler. Deux référentiels se contredisent, et
c'est celui qui a un mécanisme qui gagne — l'ordre du noyau n'en a aucun, le réglage du skill en
est un. Le réglage n'est pas arrivé par accident : il a été posé le 23 août, sur autorisation
écrite, et précisément sur les trois skills que le noyau désigne comme appelés par mot-clé. Son
intention était de réserver ces skills à une décision humaine ; son effet est d'avoir rendu
inerte la totalité du dispositif qui traduit vos mots-clés en appels. Depuis sept jours, aucune
des trois formules du lexique ne fonctionne. La correction est simple et tient en une ligne par
skill, mais elle touche un dépôt frère et vous appartient.

## 1. En-tête d'identification

- **quoi** — recherche de la cause du refus d'invocation d'un skill du lexique du noyau ; diagnostic seul, aucune modification.
- **sur quoi** — les trois skills du lexique d'invocation, dans leur copie installée et dans leur source chez `digit-ai-forge-agents`, confrontés au noyau `CLAUDE.md` et au registre.
- **quand** — fin le **30/08/2026 à 16:52 (UTC+02:00)**, durée **≈ 15 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail inchangé par ce tour.

## 2. Verdict en une ligne

Le lexique d'invocation du noyau est **entièrement inerte depuis le 23/08** : ses 3 formules routent vers 3 skills qui portent tous `disable-model-invocation: true`, réglage qui interdit à un modèle de les appeler — 7 copies du drapeau sur le parc, 4 installées et 3 en source, posées par une correction tracée au registre dont l'intention était l'inverse de son effet.

## 3. Décisions attendues

**Chapeau commun.** Le noyau consacre un paragraphe entier à ce dispositif : certaines de vos
phrases sont des appels de skill déguisés, je dois retirer le mot-clé et traiter le reste comme
l'entrant. C'est une bonne idée, et elle est morte à la naissance du réglage qui l'empêche. La
décision porte sur le côté qu'on corrige — le réglage ou le lexique —, et elle se tranche sur une
distinction que le réglage ne sait pas faire.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si
vous ne tranchez pas.

> **D-23 — Corrige-t-on le réglage qui bloque, ou le lexique qui promet ?**
> Le réglage existe pour empêcher un modèle d'appeler un skill de sa propre initiative. Or ce n'est pas ce qui se passe ici : vous tapez les mots, et le noyau se contente de les router. Votre phrase EST l'invocation explicite ; le réglage ne sait pas distinguer « le modèle a décidé tout seul » de « l'humain a employé la formule et la doctrine l'achemine ». C'est cette confusion qu'il faut lever, d'un côté ou de l'autre.
> **Recommandation : (a).** Source consultée : la fiche de correction du 23/08 au registre, qui écrit avoir câblé ce réglage « sur les trois skills que le noyau declare APPELES PAR MOT-CLE » — l'intention y est explicite, et elle visait à honorer le lexique, non à l'éteindre. Le noyau `CLAUDE.md`, de son côté, décrit toujours le dispositif comme actif.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Retirer le réglage des 3 skills du lexique, à leur source puis par propagation aux copies installées | Effort **simple × court**, mais dans un dépôt frère : il faut un mandat nommé, et le geste s'y journalise | Exclut la protection contre une invocation spontanée de ces trois skills — protection qui n'a d'objet que si le modèle les appelle sans mot-clé, ce que le noyau n'a jamais demandé |
| **(b)** Retirer le lexique du noyau et écrire que ces trois skills se tapent à la main | Effort **simple × court**, entièrement dans le pilot, sans mandat à demander | Exclut la traduction automatique de vos formules : « Améliore le prompt » redeviendra une phrase ordinaire à laquelle je répondrai par une phrase |
| **(c)** Ne rien changer | Effort nul | Exclut la cohérence : le noyau continuera de promettre un acheminement que le réglage interdit, et chaque emploi d'une des trois formules coûtera un aller-retour |

> **Si rien n'est décidé** : (c) s'applique, et les trois formules du lexique continueront de ne rien déclencher.

## 4. Traité — avec sa preuve

- **La cause est identifiée et elle est unique** : un champ de configuration dans l'en-tête du skill.
  - preuve : `SKILL.md` de `prompt-analyzer-l99` porte `disable-model-invocation: true` à sa ligne 7, et la tentative d'invocation rend le refus explicite — « cannot be used with Skill tool due to disable-model-invocation. Ask the user to run /prompt-analyzer-l99 themselves ». Le refus interdit aussi d'en reproduire la méthode autrement, ce qui est pourquoi je n'ai pas contourné.
- **Les TROIS skills du lexique portent le réglage**, et non un seul.
  - preuve : relevé sur le parc — **7 copies** portent le champ : `ameliore-un-skill`, `la-barre`, `prompt-analyzer-l99` et `review-animations` côté installé, plus les trois premiers dans leur source chez `digit-ai-forge-agents`. Les trois formules du lexique du noyau sont donc toutes concernées.
- **Ma première lecture était fausse sur ce point, et la correction change la conclusion.**
  - preuve : mon premier relevé ne lisait que les douze premières lignes de chaque fiche, et l'en-tête de `la-barre` comme celui d'`ameliore-un-skill` portent une description sur plusieurs lignes qui repousse le champ au-delà. J'en avais conclu qu'un seul skill était concerné, donc un cas isolé ; le relevé complet montre un dispositif entier hors service.
- **Le réglage n'est pas un accident : c'est une correction tracée, autorisée, et datée.**
  - preuve : la fiche TF-0475 du registre, close le 23/08, écrit « AUTORISATION HUMAINE OBTENUE LE 23/08 », puis « câblé aujourd'hui : […] `disable-model-invocation` sur les trois skills que le noyau declare APPELES PAR MOT-CLE ». Le commit correspondant chez `digit-ai-forge-agents` est `7621c8f`.
- **L'intention de cette correction était l'inverse de son effet.**
  - preuve : la même fiche présente le câblage comme l'honneur rendu au lexique — les trois skills sont choisis PARCE QUE le noyau les déclare appelés par mot-clé. Le champ retenu produit pourtant l'effet contraire : il n'empêche pas une invocation spontanée tout en autorisant l'acheminement d'un mot-clé, il interdit les deux sans distinction.
- **Le remède ne tient pas dans la copie installée.**
  - preuve : `bootstrap.mjs` déclare propager les skills versionnés vers la copie installée. Retirer le champ de la copie du poste serait donc défait à la prochaine mise à jour de fraîcheur ; la correction doit se faire à la source, dans un dépôt frère.

## 5. Non traité — avec son motif

- **Le retrait du réglage** : *bloqué par un garde-fou* — la source vit dans `digit-ai-forge-agents`, et aucune écriture dans un dépôt frère ne se fait sans mandat humain nommé. Aucun n'est déclaré dans cette session.
- **L'amélioration du prompt que vous demandiez** : *bloqué par un garde-fou* — le refus d'invocation interdit explicitement d'en reproduire la méthode par un autre chemin. Je ne l'ai donc pas fait, et je ne le ferai pas tant que le blocage tient.
- **Le cas de `review-animations`** : *écarté* — ce skill porte le même réglage mais n'appartient pas au lexique du noyau ; rien ne dit que son réglage soit une erreur, et le corriger serait supposer une intention. Critère de réouverture : si un jour le noyau le déclare appelé par mot-clé.
- **La vérification que les deux autres formules du lexique échouent bien à l'usage** : *écarté, et le chemin essayé est nommé*. Un seul chemin a été tenté — l'invocation de `prompt-analyzer-l99` par l'outil de skill, qui a rendu le refus cité plus haut. Les deux autres n'ont PAS été tentées : les déclencher pour observer leur refus reviendrait à lancer une réécriture de skill ou un traitement de message sans que vous l'ayez demandé. La conclusion vaut donc par identité du champ dans les trois fiches, et c'est un raisonnement, pas une mesure. Critère de réouverture : si vous employez l'une des deux autres formules, le refus se constatera de lui-même.
- **Les 11 décisions ouvertes aux tours précédents** : *hors mandat* — les 10 recensées plus tôt, et la ligne de partage du canal de remontée posée au tour précédent.

## 6. Écarts à la lettre

- **vous avez demandé** pourquoi je me retrouve bloqué → **j'ai fait** le diagnostic, **sans corriger** → **pourquoi** : la correction touche un dépôt frère, et la doctrine y interdit toute écriture sans mandat nommé. Une ligne à retirer dans trois fichiers reste une écriture chez un voisin.
- **Correction d'une affirmation que je vous ai faite il y a un instant.** Je vous ai écrit que seul `prompt-analyzer-l99` portait le réglage et que les deux autres formules du lexique fonctionnaient. C'est **faux** : les trois le portent. Mon relevé s'arrêtait aux douze premières lignes de chaque fiche, et deux d'entre elles ont une description assez longue pour repousser le champ plus bas. Le sujet n'est donc pas un skill isolé mais un paragraphe entier du noyau resté sans effet pendant sept jours.
- Aucun autre écart.

## 7. Risques

- **Retirer le réglage rouvre la porte qu'il fermait.**
  - signal : un de ces trois skills se déclenche dans un tour où vous n'avez employé aucune de leurs formules.
  - parade : le noyau borne déjà l'appel à des mots-clés précis, et la description de chaque skill porte ses propres déclencheurs. Si le déclenchement s'avérait trop large, c'est la description qu'il faudrait resserrer, pas l'invocation qu'il faudrait interdire.
- **La correction sera défaite si elle n'est faite qu'au poste.**
  - signal : la formule refonctionne un jour, puis cesse après une mise à jour de fraîcheur.
  - parade : corriger à la source chez la forge, et laisser la propagation faire le reste — c'est exactement ce que la mise à jour de fraîcheur est faite pour.
- **Le même défaut peut exister ailleurs : une règle du noyau sans mécanisme, ou contredite par un mécanisme.**
  - signal : une consigne du noyau qu'aucune session n'applique jamais, sans que personne ne sache pourquoi.
  - parade : acceptation déclarée pour ce tour — aucun contrôle ne confronte aujourd'hui les prescriptions du noyau aux réglages qui les rendent possibles ou impossibles. C'est un candidat, pas une mesure.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte.

## 8. Prochaines actions

Ordre de traitement : la décision ci-dessus vient en premier parce qu'elle est la seule qui débloque votre demande initiale ; enregistrer vient ensuite, parce que son absence peut faire perdre le reste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Selon la voie retenue : retirer le champ des 3 fiches chez `digit-ai-forge-agents` puis propager par la mise à jour de fraîcheur, ou retirer le lexique du noyau `CLAUDE.md`. | `auto_ia` | `dependance_bloc_3` — attend la décision ; et la voie (a) exige en plus un mandat nommé pour écrire dans un dépôt frère. | Les 3 formules du lexique continuent de ne rien déclencher, et chaque emploi coûte un aller-retour. |
| 2 | `neuve` | Relancer votre demande d'amélioration de prompt une fois la voie (a) appliquée, ou la jouer vous-même par la commande directe si vous retenez (b). | `auto_ia` | `dependance_bloc_3` — attend la décision et, pour la voie (a), la propagation effective. | Votre demande initiale reste sans réponse. |
| 3 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, comparateur du crochet, contrôle d'héritage réparateur, gabarit de configuration complété. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 4 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés il y a trois tours. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 5 | `neuve` | Trancher les 11 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Lexique d invocation inerte - 20260830l.md`
- Cause : champ `disable-model-invocation: true`, ligne 7 des fiches concernées ; 7 copies sur le parc, 4 installées et 3 en source
- Décision d'origine : fiche TF-0475 au registre, close le 23/08 sur autorisation humaine ; commit `7621c8f` chez `digit-ai-forge-agents`
- Prescription contredite : section « Lexique d'invocation » du noyau `CLAUDE.md`, 3 formules routées vers ces 3 skills
- **Aucune modification dans ce tour** : ce message est un diagnostic, le dépôt est inchangé et aucun dépôt frère n'a été touché
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
