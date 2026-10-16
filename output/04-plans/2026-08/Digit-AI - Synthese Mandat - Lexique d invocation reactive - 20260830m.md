---
destinataire: humain
---

# Synthèse de mandat — le lexique d'invocation redevient actif, à la prochaine session (30/08/2026)

Le blocage est levé à la racine. Le réglage qui interdisait à une session d'appeler vos trois
skills à mot-clé a été retiré de leur source chez la forge qui les publie, puis propagé aux copies
installées sur ce poste : il n'existe plus nulle part, ni dans les trois fichiers d'origine, ni
dans les trois copies. Une seule chose reste à savoir, et elle est due à la mécanique de
l'agent : la liste des skills utilisables est lue à l'ouverture d'une session, si bien que celle-ci
continue de refuser l'appel alors que le fichier sur disque est corrigé depuis 19h43. Votre
formule fonctionnera dès la prochaine ouverture, sans autre geste. En chemin, deux vérifications
ont écarté les risques que je craignais : le garde-fou qui protège les dépôts frères ne couvre
que les produits et non les forges, et la forge en question était parfaitement synchronisée avant
que je n'y touche — contrairement à ce que le contrôle d'ouverture annonçait ce matin.

## 1. En-tête d'identification

- **quoi** — exécution de l'arbitrage D-23 (a) : retirer le réglage qui rend inerte le lexique d'invocation du noyau, à la source puis par propagation.
- **sur quoi** — les 3 fiches de skill chez `digit-ai-forge-agents` et leurs copies installées sur ce poste.
- **quand** — fin le **30/08/2026 à 19:52 (UTC+02:00)**, durée **≈ 20 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt du pilot à `66c76d2` ; forge `digit-ai-forge-agents` à `158dbbb`, 3 fichiers modifiés et non committés.

## 2. Verdict en une ligne

Le réglage est **retiré des 6 fichiers** — 3 sources et 3 copies installées, 0 occurrence restante partout — et `oracle-skills` rend **PASS** après propagation, son recensement de champs ne le listant plus ; l'appel reste refusé dans **cette session seulement**, dont le registre de skills a été lu avant la modification de 19h43.

## 3. Décisions attendues

**Chapeau commun.** Une seule décision naît de ce tour, et elle porte sur la trace : la
modification vit dans un dépôt frère, où elle n'est pour l'instant enregistrée nulle part. Les
onze décisions posées aux tours précédents restent ouvertes et sont rappelées au dernier bloc.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si
vous ne tranchez pas.

> **D-24 — Comment enregistre-t-on cette modification chez la forge qui publie les skills ?**
> Trois lignes ont été retirées dans trois fichiers d'un dépôt qui n'est pas le pilot. Elles sont sur le disque et vérifiées, mais l'historique de ce dépôt n'en sait rien : il est resté sur le même état qu'avant mon intervention. Or ce dépôt est la SOURCE dont les copies installées se rafraîchissent — une source non enregistrée est une source qu'un rapatriement ultérieur peut écraser sans que rien ne le dise.
> **Recommandation : (a).** Source consultée : les garde-fous du noyau `CLAUDE.md`, qui posent « git local dès la naissance, push sur GO humain » — le commit local est le comportement prescrit, la publication ne l'est pas et vous appartient.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Commit local chez la forge, sans publication | Effort **simple × court** ; la correction reste sur ce poste tant qu'elle n'est pas publiée | Exclut qu'un rapatriement futur écrase la correction sans trace |
| **(b)** Commit local **et** publication vers le dépôt distant de la forge | Effort **simple × court** ; engage les autres postes et toute session qui rapatrie cette forge | Exclut de garder la correction à l'essai le temps de vérifier qu'elle produit bien l'effet voulu |
| **(c)** Laisser les 3 fichiers modifiés sans enregistrement | Effort nul | Exclut toute protection : un rapatriement de la forge remettrait le réglage et le lexique redeviendrait inerte, sans que personne ne comprenne pourquoi |

> **Si rien n'est décidé** : (c) s'applique, et la correction reste à la merci du prochain rapatriement de cette forge.

## 4. Traité — avec sa preuve

- **Deux vérifications ont précédé toute écriture chez la forge**, et elles ont écarté les deux risques que je craignais.
  - preuve, GARDE-FOU : le contrôle qui protège les dépôts frères classe les dépôts par leur nom et écrit, en toutes lettres, « Un dépôt. Forge ou pilot : hors sujet. Produit : suivi » — il ne couvre donc pas cette forge, et votre arbitrage nommait explicitement l'écriture chez un frère.
  - preuve, ÉTAT DU DÉPÔT : après rapatriement, la forge rend **0 en retard, 0 en avance** et un arbre de travail propre, sur `158dbbb`. Elle était donc parfaitement synchronisée avant que je n'y touche — ce qui **contredit le contrôle d'ouverture de ce matin**, qui l'annonçait divergée de 75 et 81 commits. Elle a été réconciliée entre-temps, et je n'ai pas cherché par qui.
- **Le réglage est retiré des trois sources**, et l'en-tête de chaque fiche reste valide.
  - preuve : une ligne supprimée dans chacun des trois fichiers, aux positions 7, 18 et 16 ; le résumé de différences rend « 3 files changed, 3 deletions » ; et le bloc d'en-tête de chaque fiche se referme toujours, aux lignes 10, 18 et 16.
- **Aucun contrôle n'exigeait ce champ**, ce qui a été vérifié avant de le retirer.
  - preuve : recherche du nom du champ dans tous les contrôles de la forge — **aucune occurrence**. Le retirer ne pouvait donc mettre aucune règle en défaut.
- **La propagation vers les copies installées a été faite par l'outil prévu, pas à la main.**
  - preuve : le contrôle des skills est d'abord passé **FAIL** sur sa règle K2, en nommant les trois copies désormais divergentes de leur source — exactement l'état attendu après une correction à la source. Son option de mise à niveau a ensuite rendu **PASS**, avec « ameliore-un-skill, la-barre, prompt-analyzer-l99 : 1 fichier remis à niveau » chacun.
- **Le champ a disparu du recensement de la plateforme.**
  - preuve : le relevé des champs de frontmatter du parc liste désormais `name` (21), `description` (21), `version` (8), `metadata` (8), `disallowed-tools` (1) et `paths` (1) — le champ retiré n'y figure plus, alors que la fiche de correction du 23/08 le comptait à 3.
- **L'état final sur disque est vérifié fichier par fichier.**
  - preuve : les 6 fichiers concernés — 3 sources et 3 copies installées — rendent **0 occurrence** du champ.
- **L'appel reste refusé dans cette session, et la cause est identifiée.**
  - preuve : l'invocation rejouée après correction rend le même refus, alors que le fichier installé porte un horodatage de modification à **19h43**, postérieur à l'ouverture de cette session. La liste des skills utilisables est lue au démarrage ; la correction prendra effet à la prochaine ouverture.

## 5. Non traité — avec son motif

- **L'enregistrement de la modification chez la forge** : *dépendance à une décision humaine* — la décision ci-dessus ; committer dans un dépôt frère reste un acte que je ne prends pas de moi-même, même après le mandat d'y écrire.
- **L'amélioration de prompt que vous demandiez à l'origine** : *dependance_externe* — elle attend l'ouverture d'une session neuve, seul moment où la liste des skills est relue. Aucun geste supplémentaire n'est requis de votre part.
- **Le cas de `review-animations`**, qui porte le même réglage : *écarté* — il n'appartient pas au lexique du noyau, et rien ne dit que son réglage soit une erreur. Critère de réouverture : si le noyau le déclarait un jour appelé par mot-clé.
- **L'écart entre le contrôle d'ouverture de ce matin et l'état réel de la forge** : *écarté pour ce tour* — le contrôle annonçait 75 et 81 commits d'écart, la mesure rend 0 et 0. La forge a été réconciliée dans la journée ; comprendre par qui et quand sortirait du mandat. Critère de réouverture : si le même écart réapparaît demain sur un autre dépôt.
- **Les 11 décisions ouvertes aux tours précédents** : *hors mandat* — durcissement des deux règles neuves, sort des copies périmées, enregistrement du travail du pilot, tables d'anonymisation, 9 dépôts frères, ordre des 23 tâches, 4 produits sans pièce, faux positif du contrôle des secrets, fichiers de configuration de tests, ligne de partage du canal de remontée.

## 6. Écarts à la lettre

- **vous avez demandé** la voie (a) → **j'ai fait** le retrait et la propagation, **sans committer** → **pourquoi** : votre arbitrage autorisait l'écriture chez la forge, il ne disait rien de l'enregistrement. Committer dans l'historique d'un dépôt frère est un acte distinct de la modification d'un fichier, et je vous le rends en décision plutôt que de l'ajouter au mandat.
- **vous avez demandé** une correction → **j'ai vérifié avant d'écrire que le garde-fou ne s'y opposait pas et que la forge était saine** → **pourquoi** : j'ai passé la matinée à diagnostiquer les dégâts d'un dépôt divergé, et le contrôle d'ouverture annonçait précisément celui-ci comme divergé. Écrire sans vérifier aurait été refaire l'erreur que j'avais moi-même instruite.
- Aucun autre écart.

## 7. Risques

- **La correction n'est enregistrée nulle part et peut disparaître silencieusement.**
  - signal : la formule fonctionne demain, puis cesse un jour sans raison apparente, après un rapatriement de la forge.
  - parade : la décision ci-dessus ; c'est le risque le plus simple à fermer et le seul qui soit propre à ce tour.
- **Retirer le réglage rouvre la porte qu'il fermait.**
  - signal : l'un des trois skills se déclenche dans un tour où vous n'avez employé aucune de leurs formules.
  - parade : le noyau borne l'appel à des mots-clés précis, et chaque fiche porte ses propres déclencheurs. Si le déclenchement s'avérait large, c'est la description qu'il faudrait resserrer.
- **Aucun contrôle ne confronte les prescriptions du noyau aux réglages qui les rendent possibles.**
  - signal : une autre consigne du noyau qu'aucune session n'applique jamais, sans que personne ne sache pourquoi — exactement le cas qu'on vient de passer sept jours à ne pas voir.
  - parade : acceptation déclarée pour ce tour, et c'est un candidat au registre plutôt qu'une mesure. Le lexique était le seul dispositif du noyau à dépendre d'un réglage extérieur ; rien ne dit qu'il soit le dernier.
- **Rien n'est enregistré côté pilot depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte.

## 8. Prochaines actions

Ordre de traitement : enregistrer la correction de la forge passe devant, parce qu'elle est la seule chose de ce tour qu'un rapatriement peut détruire ; l'enregistrement du pilot suit, pour la même raison à plus grande échelle.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer chez `digit-ai-forge-agents` le retrait du réglage sur les 3 fiches, puis publier si vous le demandez. | `auto_ia` | `dependance_bloc_3` — attend la décision ci-dessus ; la publication relève d'un feu vert humain par les garde-fous du noyau. | Un rapatriement de la forge remet le réglage, et le lexique redevient inerte sans que personne ne comprenne pourquoi. |
| 2 | `neuve` | Rejouer votre demande d'amélioration de prompt à l'ouverture de la prochaine session, la liste des skills y étant relue. | `auto_ia` | `dependance_externe` — la relecture du registre de skills se fait au démarrage de l'agent, pas sur commande. | Votre demande initiale reste sans réponse. |
| 3 | `neuve` | Committer localement la journée côté pilot : doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, comparateur du crochet, contrôle d'héritage réparateur, gabarit de configuration complété. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 4 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés il y a quatre tours. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 5 | `neuve` | Trancher les 11 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Lexique d invocation reactive - 20260830m.md`
- Modifiés chez `digit-ai-forge-agents`, non committés : les 3 fiches de skill du lexique, 1 ligne retirée dans chacune
- Propagé vers les copies installées par l'option de mise à niveau de `oracles\oracle-skills.mjs` — FAIL sur K2 avant, **PASS** après
- Vérifications préalables : périmètre du garde-fou des produits, état de la forge après rapatriement (0/0, arbre propre, `158dbbb`), absence du champ dans tous les contrôles de la forge
- Dépôt du pilot : `66c76d2`, arbre non committé — rien n'est publié
