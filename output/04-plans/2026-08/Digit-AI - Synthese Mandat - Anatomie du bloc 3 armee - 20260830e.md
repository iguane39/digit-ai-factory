---
destinataire: humain
---

# Synthèse de mandat — l'anatomie du bloc des décisions, écrite et armée (30/08/2026)

Le format que vous demandiez est maintenant écrit en entier et, pour la première fois, tenu par
des contrôles plutôt que par la bonne volonté du rédacteur. En instruisant, j'ai trouvé un défaut
qui aurait rendu la consigne inapplicable : la forme d'identifiant que vous employez dans vos
rendus était refusée par le contrôle même qui exige qu'une décision soit désignable. Il est
corrigé, et une épreuve empêche désormais qu'il revienne. Deux exigences écrites depuis la
mi-août et jamais vérifiées le sont désormais, chacune éprouvée dans les deux sens sur un
document réel. Enfin, le décalage entre ce qui est déposé sur disque et ce qui vous est affiché
ne peut plus passer inaperçu : le message est comparé au document, et l'arrêt est refusé s'ils ne
disent pas la même chose. Trois arbitrages restent à rendre, tous de portée limitée.

## 1. En-tête d'identification

- **quoi** — exécution des trois arbitrages « 1a, 2a, 3a » : armer les juges manquants, fixer l'anatomie du bloc des décisions, comparer l'affiché au déposé.
- **sur quoi** — le pilot `digit-ai-factory` : `gabarits\RESTITUTION.md`, `oracles\oracle-synthese.mjs`, `oracles\hook-restitution.mjs` et son banc.
- **quand** — fin le **30/08/2026 à 12:06 (UTC+02:00)**, durée **≈ 55 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail non committé.

## 2. Verdict en une ligne

Les trois arbitrages sont **TENUS et éprouvés** : 2 règles neuves armées — S31 (le coût et l'exclusion portés par chaque option) et S32 (l'option par défaut nommée) —, 2 défauts bloquants corrigés — S30 (le numéro d'une décision) refusait la forme prescrite, et S15 (le rappel du sujet) accusait ce même numéro d'être un identifiant nu, doctrine passée en 2.13.0, comparateur affiché-déposé livré — banc de restitution 11/11 PASS, banc du crochet 7/7 (il était à 4/7 avant, rouge depuis le 28/08), conformité projet 44/44, et 3 mutations jouées sur un document réel font tomber chacune sa seule règle.

## 3. Décisions attendues

**Chapeau commun.** Les décisions de cette session étaient jusqu'ici renumérotées à chaque tour,
ce qui rend une réponse ambiguë dès qu'on répond à un message qui n'est plus le dernier. La
doctrine prescrit désormais une série continue par session ; elle démarre ici à **D-10** pour ne
pouvoir se confondre avec aucun des « 1a », « 2a », « 3a » déjà employés. Les décisions restées
ouvertes aux tours précédents ne sont pas reposées : elles sont rappelées au dernier bloc.

**Comment lire les trois tableaux qui suivent.** Un tableau par décision, une ligne par option,
et l'ordre des lignes n'est pas un classement : la recommandation est nommée dans la phrase qui
précède chaque tableau, jamais dans le tableau lui-même. La colonne du milieu dit ce que l'option
coûte — en complexité × durée, ou en effet concret, jamais en jours ; celle de droite dit ce que
la retenir ferme définitivement, et c'est elle qui départage deux options de coût voisin. Ce qui
n'y figure pas : les conséquences de ne rien décider, qui sont dites en une ligne sous chaque
tableau. Vous répondez en citant l'identifiant puis la lettre de l'option retenue.

- **D-10 — Durcit-on les deux règles neuves en bloquantes, ou restent-elles avertissantes ?** Une règle avertissante est dite sous la réponse et ne fait rien réécrire ; une règle bloquante refuse l'arrêt et impose une réécriture, au prix d'un affichage en double. Les deux nouvelles règles vérifient qu'une option porte son coût et ce qu'elle ferme, et qu'une décision nomme son option par défaut. **Recommandation : (a).** Source consultée : la doctrine des sévérités de `oracles\hook-restitution.mjs`, qui pose que toute règle neuve entre en avertissement et se durcit « quand le corpus sera propre » — et le corpus ne l'est pas : les restitutions de cette session même violaient ces deux règles avant aujourd'hui.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Les laisser avertissantes | Effort nul ; un rendu fautif est signalé sans être réécrit | Exclut la garantie immédiate : un message peut encore partir avec une option nue |
| **(b)** Les durcir en bloquantes tout de suite | Effort **simple × court** ; chaque défaut de détail fera relire une restitution entière | Exclut la tolérance dont ont bénéficié les seize règles précédentes |
| **(c)** Les durcir après une semaine de mesure au journal | Effort **simple × court**, différé ; suppose de relire le journal des verdicts | Exclut le durcissement immédiat |

  - **Si rien n'est décidé** : (a) s'applique, les deux règles restent avertissantes.

- **D-11 — Que fait-on des deux produits dont la copie de doctrine a maintenant deux versions de retard ?** Le texte de doctrine est passé de la version 2.11.0 à la version 2.13.0 dans la journée ; les deux seuls produits qui en portent une copie sont restés à 2.11.0 et 2.10.0. La règle d'héritage les déclare périmés, mais elle ne se joue qu'à l'ingestion d'un lot de retours. **Recommandation : (b).** Source consultée : le référentiel `gabarits\HERITAGE.json`, qui déclare ce texte en mode copie identique, et le relevé du parc fait ce matin — 6 produits instanciés, 2 portant la doctrine, 4 n'en portant aucune pièce.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Recopier maintenant chez les deux produits, sur votre mandat | Effort **simple × court** ; le pilot écrirait chez un produit, ce que la doctrine réserve au produit | Exclut de tenir la règle qui veut que seul le produit écrive chez lui |
| **(b)** Câbler d'abord le contrôle d'héritage à l'ouverture de session produit, décidé ce matin et non exécuté, puis laisser chaque produit se mettre à jour | Effort **moyen × court** ; les deux produits restent périmés jusqu'à leur prochaine session | Exclut la mise à jour immédiate |
| **(c)** Ne rien faire | Effort nul | Exclut que la doctrine du jour atteigne jamais les produits |

  - **Si rien n'est décidé** : (c) s'applique, les deux copies restent périmées.

- **D-12 — Enregistre-t-on ce travail dans l'historique du dépôt, et jusqu'où ?** Rien n'a été committé depuis la remise à niveau de ce matin : l'arbre porte la doctrine en deux versions successives, deux règles neuves, un défaut corrigé, le comparateur du crochet et son banc réparé. Tout est vérifié, rien n'est enregistré. **Recommandation : (a).** Source consultée : les garde-fous du noyau `CLAUDE.md`, qui posent « git local dès la naissance, push sur GO humain » — le commit local est donc le comportement prescrit, la publication ne l'est pas.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Commit local, pas de publication | Effort **simple × court** | Exclut que les autres postes reçoivent ces règles tant que vous n'aurez pas donné le feu vert |
| **(b)** Commit local **et** publication vers le dépôt distant | Effort **simple × court** ; engage les neuf dépôts frères encore divergés à se réaligner sur une doctrine plus récente | Exclut de garder ces règles à l'essai sur ce seul poste |
| **(c)** Ne rien enregistrer | Effort nul | Exclut la conservation : une fermeture de session perdrait le travail de la journée |

  - **Si rien n'est décidé** : (c) s'applique, et le travail reste hors de tout historique.

## 4. Traité — avec sa preuve

- **Un défaut bloquant a été trouvé et corrigé avant tout le reste** : la forme d'identifiant `D-5 —`, celle de vos rendus et celle que la doctrine allait prescrire, était **refusée** par la règle de numérotation.
  - preuve : l'expression n'admettait la lettre que collée à son chiffre — `D5` acceptée, `D-5` et `D-12` refusées, rejoué sur cinq écritures avant correction. Une épreuve dédiée le fixe : une décision titrée `D-5 —` doit rendre PASS, faute de quoi le banc casse.
- **Une SECONDE collision a été trouvée en jouant la règle neuve sur ce document même** : l'identifiant que la doctrine venait de prescrire était lu par la règle du rappel du sujet comme un identifiant de registre nu, celui qu'elle interdit.
  - preuve : les 3 décisions de cette synthèse rendaient FAIL sur S15 pour leur seul titre. La carve-out posée est la même que celle de `TF-####` pour S23 : un sélecteur introduit dans le MÊME message n'est pas un identifiant écrit ailleurs et avant. Le banc l'avait manqué parce que sa fixture employait un numéro à UN chiffre, quand la reconnaissance en exige deux : elle passait par chance et non par conformité. Elle porte désormais `D-12`, et une assertion dédiée casse le banc si la collision revient.
- **Les deux exigences sans juge en ont désormais un**, arbitrage « 1a ».
  - preuve : `S31` — chaque option porte son coût et ce qu'elle exclut, une ligne de tableau étant jugée avec son en-tête comme le veut la borne posée pour S19 ; `S32` — chaque décision nomme son option par défaut. Banc `node oracles\oracle-synthese.mjs --self-test` → **11/11 PASS**, chaque règle éprouvée dans ses deux sens.
- **Les deux règles ont été éprouvées sur un document réel, pas seulement sur leurs témoins**, pour écarter le risque d'une règle morte en croyant vivre.
  - preuve : 3 mutations jouées sur la synthèse du tour précédent — document intact → S31 PASS, S32 PASS ; colonne d'exclusion retirée → **S31 FAIL**, S32 PASS ; lignes de repli retirées → S31 PASS, **S32 FAIL**. Chaque mutation ne fait tomber que sa règle.
- **L'anatomie complète du bloc des décisions est écrite**, arbitrage « 2a ».
  - preuve : `gabarits\RESTITUTION.md` passe en **version 2.13.0** avec une section qui donne le squelette et ses 5 points — identifiant `D-N` continu dans la session, titre en question, recommandation et source avant le tableau, tableau à 3 colonnes, ligne de repli — en distinguant ce qui est mesuré (les points 4 et 5) de ce qui reste défaut de rédaction.
- **L'affiché est désormais comparé au déposé**, arbitrage « 3a ».
  - preuve : le crochet de fin de tour repère la synthèse écrite dans le tour par son marqueur `destinataire: humain`, jamais par son nom, et compare 2 propriétés — la liste des numéros de décision et le nombre d'options par défaut nommées. Éprouvé dans ses deux sens : affiché identique → aucun écart ; lignes de repli perdues → « 7 dans le fichier jugé, 4 à l'écran » ; décision disparue → « décisions du fichier : 1, 2, 3 — décisions affichées : 1, 2 ».
- **Le banc du crochet, rouge depuis le 28/08, est réparé** — et ce n'était pas dans le mandat, mais modifier le crochet sans son banc revenait à travailler sans filet.
  - preuve : `node oracles\hook-restitution.test.mjs` → **7/7**, contre 4/7 avant. Cause du rouge : la règle de numérotation livrée le 28/08 sans mettre à jour les cas témoins, qui déclaraient une décision sans numéro.
- **Aucune régression ailleurs.**
  - preuve : conformité projet **44 PASS, 0 FAIL** ; oracle des gabarits **PASS**.

## 5. Non traité — avec son motif

- **Le durcissement des deux règles neuves** : *dépendance à une décision humaine* — objet de la première décision ci-dessus ; elles entrent en avertissantes, comme les seize précédentes.
- **La recopie de la doctrine chez les deux produits** : *bloqué par un garde-fou* — écrire chez un produit relève du produit ; c'est l'objet de la deuxième décision.
- **L'enregistrement du travail dans l'historique** : *dépendance à une décision humaine* — troisième décision.
- **Les 6 exigences du bloc des décisions restées sans juge** — la place de la recommandation, la forme du titre, la continuité des numéros : *écarté*. Les juger reviendrait à imposer une typographie, ce que la doctrine interdit depuis le 24/08 ; elles restent défauts de rédaction. Réouverture si un rendu s'en écarte à nouveau.
- **Le banc de recettes du registre, à 42 réussites et 6 échecs** : *dépendance externe* — les deux tables d'anonymisation sont absentes de cette machine, ce qui arrête toute ingestion ; c'est une décision posée ce matin et non tranchée, non un défaut de ce tour.
- **Les 5 décisions ouvertes aux tours précédents** : *hors mandat* — tables d'anonymisation, 9 dépôts frères divergés, ordre d'exécution des 23 tâches, câblage du contrôle d'héritage à l'ouverture, 4 produits sans aucune pièce.

## 6. Écarts à la lettre

- **vous avez demandé** « corrige le pour l'aligner avec les attentes », puis « 1a & 2a & 3a » → **j'ai fait** les trois, **plus deux choses non demandées** → **pourquoi** : la première est la correction de la règle de numérotation, sans laquelle la forme prescrite aurait été refusée par le contrôle dès le premier rendu — la consigne aurait été inapplicable le jour de son écriture ; la seconde est la réparation du banc du crochet, sans laquelle je modifiais un crochet dont aucune épreuve ne disait plus s'il fonctionnait. Les deux sont dans le périmètre de ce qui rendait le mandat exécutable, et elles sont signalées plutôt que fondues dans le lot.
- **vous avez demandé** la comparaison de l'affiché et du déposé → **j'ai fait** une comparaison portant sur 2 propriétés seulement, non sur le texte → **pourquoi** : un message abrège légitimement une prose ; ce qui ne s'abrège pas, c'est ce sur quoi vous tranchez. Comparer les textes mot à mot aurait produit un refus à chaque tour.
- Aucun autre écart.

## 7. Risques

- **Le comparateur de l'affiché et du déposé peut refuser un tour à tort.**
  - signal : un refus dont le motif dit un écart de numéros alors que le message porte bien toutes les décisions — par exemple si un document porte deux blocs de décisions, ou si un numéro est cité dans une autre section.
  - parade : la garde anti-boucle existante limite le coût à une seule relecture par tour ; et le motif nomme le fichier comparé, donc l'écart est contredisable. Si un faux refus survient, la voie est de restreindre la comparaison aux seuls numéros, en le disant.
- **Les deux règles neuves peuvent crier sur une option légitimement sans coût.**
  - signal : une option « ne rien faire » reprise pour absence de coût alors que son coût est nul.
  - parade : le vocabulaire admet « gratuit » et « effort nul » ; le témoin vert du banc porte exactement ce cas. Si un autre tour apparaît, il s'ajoute au vocabulaire plutôt que de contourner la règle.
- **La doctrine a changé deux fois dans la journée, et les copies des produits ne suivent pas.**
  - signal : la règle d'héritage rendra échec sur les 2 produits qui la portent, au prochain lot ingéré — pas avant, faute du câblage décidé ce matin.
  - parade : la deuxième décision ci-dessus ; en attendant, l'écart est nommé et daté.
- **Rien n'est committé depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et le travail de la journée disparaît sans trace.
  - parade : la troisième décision ; c'est le risque le plus simple à fermer des trois.

## 8. Prochaines actions

Ordre de traitement : enregistrer vient en premier parce que c'est la seule action dont l'absence peut faire **perdre** tout le reste ; viennent ensuite la propagation aux produits, puis le durcissement, puis les restes déjà posés.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer localement le travail de la journée — doctrine 2.12.0 puis 2.13.0, règles S31 et S32, correction de S30, comparateur du crochet, banc réparé — puis publier si vous le demandez. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage sur l'enregistrement ; la publication relève d'un feu vert humain par les garde-fous du noyau. | Une fermeture de session perd la journée : rien de ce qui a été écrit et vérifié n'existe dans l'historique. |
| 2 | `neuve` | Câbler le contrôle d'héritage à l'ouverture d'une session produit, décidé ce matin et non exécuté, puis le prouver en ouvrant une session sur un produit dont la copie diverge. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage sur la propagation, et le choix signaler ou recopier change le code écrit. | La doctrine du jour n'atteint aucun produit, et les 2 qui la portent restent à deux versions de retard. |
| 3 | `neuve` | Durcir les deux règles neuves en bloquantes, après relecture du journal des verdicts. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage sur la sévérité. | Un rendu peut encore partir avec une option sans coût ou une décision sans repli, signalé mais non corrigé. |
| 4 | `neuve` | Trancher les 5 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner : tables d'anonymisation, 9 dépôts frères, ordre des 23 tâches, câblage de l'héritage, 4 produits sans pièce. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Anatomie du bloc 3 armee - 20260830e.md`
- Fichiers modifiés : `gabarits\RESTITUTION.md` (2.11.0 → 2.12.0 → **2.13.0**) · `oracles\oracle-synthese.mjs` (S30 et S15 corrigées, S31 et S32 ajoutées, 4 fixtures neuves dont une durcie) · `oracles\hook-restitution.mjs` (comparateur affiché-déposé) · `oracles\hook-restitution.test.mjs` (cas témoin remis au format)
- Bancs exécutés : restitution **11/11** · crochet **7/7** (4/7 avant) · conformité projet **44/44** · gabarits **PASS** · registre 42 réussites et 6 échecs, cause externe nommée
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
