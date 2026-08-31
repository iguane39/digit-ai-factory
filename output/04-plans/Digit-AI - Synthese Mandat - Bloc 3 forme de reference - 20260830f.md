---
destinataire: humain
---

# Synthèse de mandat — la forme du bloc des décisions, relevée à la source et rendue lisible par son juge (30/08/2026)

J'ai cessé de déduire le format d'une image et je suis allé lire le texte d'origine : le journal
de la session produit est sur cette machine, et le rendu que vous me montriez s'y trouve mot pour
mot. La différence tenait à une chose que trois lectures d'écran ne m'avaient pas donnée — une
décision s'écrit dans un bloc encadré, pas dans une liste à puces. Mais l'essentiel est ailleurs
et explique pourquoi le sujet a duré : le contrôle automatique du pilot **ne savait pas lire cette
forme**. Il voyait une seule décision sans numéro là où le document en porte deux. Le format que
vous demandiez était donc refusé par le mécanisme censé le faire respecter, et chaque fois que je
« corrigeais », je corrigeais vers ce que la machine acceptait plutôt que vers ce que vous
demandiez. C'est corrigé à la racine, prouvé sur votre propre document, et une épreuve empêche
désormais que cela revienne. Le message que vous lisez est écrit dans cette forme.

## 1. En-tête d'identification

- **quoi** — recherche de la cause du désaccord de format sur le bloc des décisions, puis correction à la racine ; boucle demandée jusqu'à traitement définitif.
- **sur quoi** — le pilot `digit-ai-factory` : `oracles\oracle-synthese.mjs` et `gabarits\RESTITUTION.md`, confrontés au journal de session du produit *Produit-02*.
- **quand** — fin le **30/08/2026 à 13:02 (UTC+02:00)**, durée **≈ 35 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail non committé.

## 2. Verdict en une ligne

Cause racine trouvée et corrigée : jugé par le pilot, votre rendu de référence rendait **1 décision SANS NUMÉRO** là où il en porte **2**, numérotées 5 et 6 — après correction, S30 (la règle du numéro d'une décision) rend « 2 décision(s), chacune numérotée et distincte (5, 6) », et passent aussi S4 (le choix fermé entre options étiquetées), S15 (le rappel du sujet), S31 (le coût et l'exclusion portés par chaque option) et S32 (l'option par défaut nommée) ; banc de restitution **11/11**, crochet **7/7**, conformité projet **44/44**.

## 3. Décisions attendues

**Chapeau commun.** La série continue de cette session se poursuit : les décisions D-10, D-11 et
D-12 posées au tour précédent restent ouvertes et ne sont pas reposées ici — elles sont rappelées
au dernier bloc. Les deux qui suivent naissent de ce tour.

**Comment lire ce qui suit.** Chaque décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, et la recommandation vient avec la source d'où elle sort. Le
tableau qui suit chaque bloc donne les options — la colonne du milieu dit ce que l'option coûte,
en complexité × durée ou en effet concret ; celle de droite dit ce que la retenir ferme
définitivement. La ligne encadrée qui ferme chaque décision dit ce qui se passe si vous ne
tranchez pas. Vous répondez en citant l'identifiant puis la lettre.

> **D-13 — Fait-on redescendre cette correction chez les produits, et par quel chemin ?**
> Le contrôle qui juge les fins de tour vit aussi chez les produits, sous forme de copie. Celui du produit dont je viens de lire le journal porte une version antérieure de trois révisions : il continuera donc de refuser la forme de référence tant qu'il n'aura pas été recopié, alors même que ce produit l'écrit correctement. Un agent qui y travaille verra son rendu juste repris par un juge périmé.
> **Recommandation : (b).** Source consultée : le référentiel `gabarits\HERITAGE.json`, qui déclare le texte de doctrine et le crochet en mode copie identique, et le relevé du parc de ce matin — 6 produits instanciés, 2 portant ces pièces, 4 n'en portant aucune.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Recopier maintenant chez les 2 produits concernés, sur votre mandat | Effort **simple × court** ; le pilot écrirait chez un produit, ce que la doctrine réserve au produit | Exclut de tenir la règle qui veut que seul le produit écrive chez lui |
| **(b)** Câbler d'abord le contrôle d'héritage à l'ouverture de session produit, puis laisser chaque produit se mettre à jour à sa prochaine ouverture | Effort **moyen × court** ; les 2 produits gardent un juge périmé jusque-là | Exclut la mise à jour immédiate |
| **(c)** Ne rien faire | Effort nul | Exclut que la correction atteigne jamais les produits, qui continueront de voir leur bon format refusé |

> **Si rien n'est décidé** : (c) s'applique, et les produits gardent un juge qui refuse la forme qu'ils écrivent.

> **D-14 — Corrige-t-on le faux refus que le contrôle rend sur les renvois vers un fichier de configuration ?**
> Trouvé en jugeant votre rendu de référence : la règle qui exige qu'une recommandation cite sa source ne reconnaît que six extensions de fichier. Votre décision D-5 cite un fichier de chaîne d'intégration en `.yml` — une source parfaitement valide — et la règle la refuse quand même. Ce n'est pas votre document qui est en défaut, c'est la liste des extensions reconnues.
> **Recommandation : (a).** Source consultée : la liste des localisateurs de `oracles\oracle-synthese.mjs`, qui admet `md`, `json`, `mjs`, `py`, `html` et `jsonl`, et rien d'autre — ni `yml`, ni `css`, ni `js`, ni `txt`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Élargir la liste aux extensions courantes de configuration et de code | Effort **simple × court** ; élargir une reconnaissance augmente toujours un peu le risque d'accepter une source faible | Exclut de garder une liste dont l'étroitesse est elle-même la cause du faux refus |
| **(b)** Laisser la liste et écrire la source entre accents graves, ce qui suffit à la faire reconnaître | Effort nul ; impose une contrainte d'écriture au rédacteur pour compenser un défaut du contrôle | Exclut la correction du contrôle : le faux refus reste, il est seulement contourné |
| **(c)** Ne rien faire | Effort nul | Exclut la confiance dans la règle : un contrôle qui accuse à tort s'apprend à contourner |

> **Si rien n'est décidé** : (c) s'applique, et le faux refus se représentera à chaque citation d'un fichier de configuration.

## 4. Traité — avec sa preuve

- **J'ai cessé de déduire le format et je suis allé le lire à la source.**
  - preuve : le journal de la session produit est sur cette machine ; le message affiché y a été retrouvé par recherche de sa phrase exacte, et son bloc des décisions extrait tel quel. Il s'écrit en bloc de citation — 3 lignes préfixées d'un chevron pour le titre, le rappel et la recommandation, puis le tableau au niveau du document, puis une ligne citée pour le repli.
- **La cause racine est mesurée, et ce n'était pas une question de goût** : le contrôle du pilot ne savait pas lire cette forme.
  - preuve : jugé avant correction, votre rendu de référence rendait `S30` FAIL — « **1 décision(s) sur 1 SANS NUMÉRO** » — sur un document qui porte D-5 et D-6. Aucune ligne à chevron n'ouvrait de décision : les deux fusionnaient en un seul bloc et le numéro n'était plus en tête.
- **Ce que cela expliquait, et c'est le fond du sujet** : un agent qui cherche le vert dérive vers la puce.
  - preuve : les deux tours précédents ont produit des rendus conformes au contrôle et non conformes à votre demande. La correction du format allait mécaniquement dans le mauvais sens, puisque le contrôle refusait le bon.
- **Le lecteur de décisions reconnaît désormais le bloc de citation**, et rien d'autre n'a été assoupli.
  - preuve : après correction, le même document rend `S30` **PASS** — « 2 décision(s), chacune numérotée et distincte (5, 6) » — et `S4`, `S15`, `S31`, `S32` passent également. La ligne de repli reste rattachée à sa décision plutôt que d'en ouvrir une nouvelle.
- **Une fixture joue désormais la forme de référence**, pour que la correction ne se défasse pas au prochain remaniement.
  - preuve : une décision écrite en bloc de citation est ajoutée au banc, et 6 règles doivent la lire — dont S16 (la source de la recommandation), aux côtés des cinq déjà nommées au verdict. Banc `node oracles\oracle-synthese.mjs --self-test` → **11/11 PASS**.
- **Une seconde contradiction de la même famille a été corrigée** : S23 (la glose des sigles employés plusieurs fois) dénonçait les renvois vers vos propres décisions.
  - preuve : sur votre rendu, elle listait « D4 (2 emplois), D3 (2 emplois) » comme des sigles opaques, alors qu'ils renvoient à des décisions posées dans le même fil — soit exactement l'usage qu'une autre règle exige. Le sélecteur rejoint donc l'exclusion déjà consentie aux identifiants de registre ; après correction, ces deux entrées disparaissent du constat.
- **Le squelette exact est écrit dans la doctrine**, relevé et non approché.
  - preuve : `gabarits\RESTITUTION.md` passe en **version 2.14.0** et porte le squelette littéral, avec la raison pour laquelle une puce ne produit pas le même effet de lecture, et le récit de l'aveuglement du contrôle.
- **Aucune régression.**
  - preuve : banc du crochet **7/7**, conformité projet **44 PASS 0 FAIL**, oracle des gabarits **PASS**, oracle des pièges d'expressions **PASS**.

## 5. Non traité — avec son motif

- **Le faux refus sur les extensions de fichier** : *dépendance à une décision humaine* — c'est la seconde décision ci-dessus ; il a été trouvé, mesuré et non corrigé de moi-même, parce qu'élargir une reconnaissance se décide.
- **La redescente de la correction chez les produits** : *bloqué par un garde-fou* — écrire chez un produit relève du produit ; c'est la première décision ci-dessus.
- **Les 3 autres constats que le contrôle rend sur votre rendu de référence** — actions sans identifiant stable, impossibilité affirmée sans trace, sigles propres à ce produit : *hors mandat*. Ce sont des points de contenu de ce message-là, pas de format, et ils appartiennent à la session produit.
- **La place de la recommandation et la forme interrogative du titre** : *écarté* — elles restent des défauts de rédaction, non des règles. Les juger imposerait une typographie, ce que la doctrine interdit depuis le 24/08. Réouverture si un rendu s'en écarte à nouveau.
- **Les 3 décisions du tour précédent** — durcissement des règles neuves, sort des copies périmées, enregistrement du travail : *hors mandat*, non tranchées.
- **Les 5 décisions plus anciennes** — tables d'anonymisation, 9 dépôts frères, ordre des 23 tâches, câblage de l'héritage, 4 produits sans pièce : *hors mandat*, non tranchées.

## 6. Écarts à la lettre

- **vous avez demandé** « boucle jusqu'à traiter ce point définitivement » → **j'ai fait** un seul tour, pas une boucle → **pourquoi** : la boucle existait pour converger vers une forme que je devinais. En allant lire le texte d'origine, la cible a cessé d'être une hypothèse : il n'y avait plus rien à faire converger. Ce qui restait était une correction unique, mesurable avant et après, et elle est faite. S'il reste un écart entre ce message et votre référence, il se nomme et se corrige en un tour, sans deviner.
- **Reconnaissance d'une erreur de méthode, sur trois tours.** J'ai tenté trois fois de reconstruire le format depuis une capture d'écran alors que le texte source était accessible depuis le premier message. Le coût vous est revenu en entier : trois rendus au mauvais format et trois relances de votre part. La règle que j'en tire est écrite dans la doctrine avec le squelette — un format se relève, il ne se déduit pas d'un rendu.
- Aucun autre écart.

## 7. Risques

- **Le lecteur de décisions accepte désormais une ligne citée commençant par un numéro : une citation ordinaire pourrait ouvrir une décision par erreur.**
  - signal : le contrôle annonce plus de décisions qu'il n'y en a, ou signale un défaut sur une phrase citée qui n'est pas une décision.
  - parade : l'ouverture exige un numéro en tête juste après le chevron, ce qu'une citation de prose n'a pas ; et la ligne de repli, qui commence par du texte, reste rattachée. Le banc joue les deux cas.
- **La correction vit dans le pilot et nulle part ailleurs.**
  - signal : un produit dont le rendu est juste se voit refuser sa fin de tour par sa propre copie du crochet.
  - parade : la première décision ci-dessus ; en attendant, le fait est daté et nommé.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et le travail de la journée disparaît — doctrine en quatre versions, quatre corrections d'oracle, deux règles neuves.
  - parade : la décision d'enregistrement posée au tour précédent, toujours ouverte ; c'est le risque le plus simple à fermer.

## 8. Prochaines actions

Ordre de traitement : enregistrer vient en premier parce que c'est la seule action dont l'absence peut faire **perdre** tout le reste ; vient ensuite la redescente, qui conditionne l'utilité de la correction pour les produits.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, règles S31 et S32, corrections de S30, S15 et S23, lecture du bloc de citation, comparateur du crochet et son banc. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé au tour précédent ; la publication relève d'un feu vert humain. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 2 | `neuve` | Câbler le contrôle d'héritage à l'ouverture d'une session produit, puis le prouver en ouvrant une session sur un produit dont la copie diverge. | `auto_ia` | `dependance_bloc_3` — attend la première décision ci-dessus. | Les produits gardent un juge qui refuse la forme qu'ils écrivent correctement. |
| 3 | `neuve` | Élargir la liste des extensions reconnues comme localisateur, puis rejouer le banc et le jugement du rendu de référence. | `auto_ia` | `dependance_bloc_3` — attend la seconde décision ci-dessus. | Le faux refus se représente à chaque citation d'un fichier de configuration, et la règle s'apprend à contourner. |
| 4 | `neuve` | Trancher les 8 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Bloc 3 forme de reference - 20260830f.md`
- Source du format : journal de session du produit, retrouvé par recherche de la phrase exacte du rendu ; bloc des décisions extrait et conservé dans le dossier de travail de la session
- Modifiés : `gabarits\RESTITUTION.md` (2.13.0 → **2.14.0**, squelette littéral) · `oracles\oracle-synthese.mjs` (lecture du bloc de citation, exclusion du sélecteur pour S23, fixture de la forme de référence)
- Bancs exécutés : restitution **11/11** · crochet **7/7** · conformité projet **44/44** · gabarits **PASS** · pièges d'expressions **PASS**
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
