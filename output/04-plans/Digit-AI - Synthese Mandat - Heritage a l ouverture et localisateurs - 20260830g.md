---
destinataire: humain
---

# Synthèse de mandat — le contrôle d'héritage joué à chaque ouverture, et la fin d'un faux refus (30/08/2026)

Vos deux arbitrages sont exécutés et vérifiés dans les deux sens. La redescente des doctrines
cesse d'être suspendue au hasard : toute session ouverte chez un produit vérifie désormais, dès
sa première seconde, que les pièces héritées de la Factory y sont à jour, et nomme le fichier
fautif ainsi que le geste exact qui le répare. Éprouvé sur un produit réel dont la copie est
périmée, et sur un produit témoin conforme construit pour l'occasion : le premier reçoit le
défaut avec son remède, le second reçoit « dix artefacts à jour ». Le second point est plus
étroit mais coûtait à chaque rendu : le contrôle refusait qu'on cite comme source un fichier de
configuration, faute de connaître son extension — votre propre document de référence en faisait
les frais. Deux choses appellent encore votre décision, et une seule est neuve.

## 1. En-tête d'identification

- **quoi** — exécution des arbitrages D-13 (b) et D-14 (a) : câbler le contrôle d'héritage à l'ouverture d'une session produit, et élargir les sources reconnues par le contrôle de restitution.
- **sur quoi** — le pilot `digit-ai-factory` : `oracles\hook-ouverture.mjs` et `oracles\oracle-synthese.mjs`, éprouvés contre un produit réel et un produit témoin.
- **quand** — fin le **30/08/2026 à 13:44 (UTC+02:00)**, durée **≈ 25 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail non committé.

## 2. Verdict en une ligne

Les 2 arbitrages sont **TENUS et éprouvés dans les deux sens** : le contrôle d'héritage joué à l'ouverture rend « **DÉFAUT** — forge/RESTITUTION.md diverge » sur le produit périmé et « à jour — 10 artefact(s) hérité(s) » sur un produit témoin conforme ; la liste des sources reconnues passe de 6 à 24 extensions, ce qui fait passer votre rendu de référence de FAIL à **PASS** sur la règle de la source ; bancs restitution **11/11**, crochet **7/7**, conformité projet **44/44**, contrôles injoignables **PASS**.

## 3. Décisions attendues

**Chapeau commun.** La série continue de cette session se poursuit. Les huit décisions posées aux
tours précédents restent ouvertes et ne sont pas reposées ici : elles sont rappelées au dernier
bloc, avec ce qu'il en coûte de les laisser en attente. Les deux qui suivent naissent de ce tour,
et la première est la moitié de la question d'héritage que votre arbitrage ne tranchait pas.

**Comment lire ce qui suit.** Chaque décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, et la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme chaque décision dit ce qui se passe
si vous ne tranchez pas. Vous répondez en citant l'identifiant puis la lettre.

> **D-15 — Le contrôle d'ouverture doit-il RECOPIER lui-même les pièces périmées, ou se contenter de les signaler ?**
> Votre arbitrage demandait de câbler le contrôle et de laisser ensuite chaque produit se mettre à jour ; il ne disait pas qui fait la copie. J'ai livré le signalement seul, avec le fichier en cause et la commande de vérification. Le contrôle s'exécute chez le produit et non chez le pilot : il pourrait donc recopier sans enfreindre la règle qui réserve au produit l'écriture chez lui.
> **Recommandation : (a).** Source consultée : la section « Portée » de `gabarits\RESTITUTION.md`, qui pose qu'un contrôle échouant sur ce qu'il ne peut pas faire réparer apprend à être contourné — et le relevé du parc de ce matin, où quatre produits sur six vivent depuis des jours avec un signalement que personne n'a traité.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Le contrôle recopie les artefacts déclarés en copie identique, et dit lesquels il a remplacés | Effort **moyen × court** ; des fichiers changent au démarrage d'une session, ce que le compte rendu doit annoncer | Exclut qu'un produit garde une variante locale d'une pièce que la doctrine déclare non personnalisable |
| **(b)** Garder le signalement seul, tel qu'il est livré | Effort nul | Exclut la garantie : la mise à jour reste un geste que quelqu'un doit vouloir faire |
| **(c)** Recopier, mais seulement après vous l'avoir demandé une fois par produit | Effort **moyen × moyen** ; suppose de retenir un consentement par produit, donc un état de plus à tenir | Exclut la simplicité des deux autres voies |

> **Si rien n'est décidé** : (b) s'applique — c'est ce qui est livré, et la mise à jour reste facultative.

> **D-16 — Que fait-on des deux clés de configuration que le code lit et que le gabarit ne déclare pas ?**
> Trouvé en passant les contrôles du dépôt après mes modifications, et sans rapport avec elles : le module d'anonymisation arrivé le 28 août lit deux variables d'environnement permettant de déplacer ses deux tables de correspondance, et le fichier d'exemple qui sert de mode d'emploi au repreneur n'en mentionne aucune. Un poste neuf ne peut donc pas savoir que ces réglages existent.
> **Recommandation : (a).** Source consultée : `oracles\oracle-parite-configuration.mjs`, qui rend FAIL sur sa règle PC2 en nommant les deux clés et le fichier qui les lit, et rappelle qu'un fichier local ne révèle jamais ce défaut — il n'est visible que du repreneur, au moment où il ne peut plus poser la question.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Déclarer les deux clés dans le fichier d'exemple, avec leur rôle et leur valeur par défaut | Effort **simple × court** | Exclut de laisser un repreneur découvrir ces réglages par la lecture du code |
| **(b)** Verser le constat au registre et le traiter dans l'ordre des autres tâches | Effort nul maintenant ; le contrôle de parité reste rouge en attendant | Exclut la correction immédiate d'un défaut d'une ligne |
| **(c)** Ne rien faire | Effort nul | Exclut que ce contrôle serve encore : un rouge permanent finit par se lire comme du bruit |

> **Si rien n'est décidé** : (c) s'applique, et le contrôle de parité reste rouge sans que personne ne sache pourquoi.

## 4. Traité — avec sa preuve

- **Le contrôle d'héritage est joué à chaque ouverture de session produit**, arbitrage D-13 (b).
  - preuve, sens ROUGE : lancé depuis le produit dont j'ai lu le journal ce matin, il rend « **DÉFAUT** — héritage du pilot non tenu : 0 absent(s), 1 périmé(s) : forge/RESTITUTION.md diverge de gabarits/RESTITUTION.md », suivi du remède et de la commande de vérification, chemins absolus compris.
  - preuve, sens VERT : un produit témoin a été construit pour l'occasion avec les dix artefacts recopiés depuis le pilot ; le même contrôle y rend « à jour — 10 artefact(s) hérité(s) présent(s) et à jour ». Sans ce second sens, un contrôle qui crierait sur tout aurait passé pour fonctionnel.
  - preuve de la borne : lancé sur le pilot lui-même, il n'imprime aucune section — le pilot EST la source, la comparer à elle-même n'aurait pas de sens.
- **Il signale sans bloquer et sans écrire**, et c'est un choix, pas un oubli.
  - preuve : le compte rendu porte la mention « Non bloquant : ce contrôle DÉCLARE l'écart, il ne l'efface pas ». La raison est écrite dans le code : un contrôle qui échoue sur ce qu'il ne peut pas faire réparer apprend à être contourné, et écrire dans l'arbre d'une session qui vient de s'ouvrir modifierait des fichiers sous les pieds de l'agent qui la commence. La recopie automatique est posée en décision plutôt que prise par défaut.
- **La liste des sources reconnues passe de 6 à 24 extensions**, arbitrage D-14 (a).
  - preuve : votre rendu de référence citait un fichier de chaîne d'intégration comme source de sa recommandation, et la règle le refusait — elle rend désormais **PASS**, « 2 décision(s), chacune recommandée et sourcée ». Le refus n'était pas dans votre document, il était dans une liste écrite au fil des besoins du pilot : `md`, `json`, `mjs`, `py`, `html`, `jsonl` et rien d'autre.
- **L'effet de bord de cet élargissement est déclaré plutôt que découvert plus tard.**
  - preuve : cette même liste sert de preuve à deux autres règles, celle du verdict factuel et celle des affirmations de complétion. Citer un fichier de configuration vaut donc désormais preuve au bloc 4. Le banc le vérifie : la fixture rouge continue d'échouer sur ces deux règles, sans quoi l'élargissement les aurait désarmées.
- **Une fixture tient les deux corrections du jour à la fois.**
  - preuve : la décision témoin écrite en bloc de citation cite désormais sa source SANS accents graves et avec une extension qui n'entrait pas dans la liste avant aujourd'hui. Si l'une des deux corrections se défait, cette fixture tombe. Banc `node oracles\oracle-synthese.mjs --self-test` → **11/11 PASS**.
- **Aucune régression sur le reste du dépôt.**
  - preuve : banc du crochet **7/7**, conformité projet **44 PASS 0 FAIL**, contrôle des contrôles injoignables **PASS** sur ses 40 contrôles, dont la règle qui vérifie que chacun est exercé par une recette.

## 5. Non traité — avec son motif

- **La recopie automatique des pièces périmées** : *dépendance à une décision humaine* — première décision ci-dessus ; votre arbitrage câblait le contrôle sans dire qui fait la copie, et l'écriture automatique dans un arbre au démarrage ne se prend pas par défaut.
- **Les deux clés de configuration non déclarées** : *dépendance à une décision humaine* — seconde décision ci-dessus. Le défaut est antérieur à ce tour : il est arrivé avec le module d'anonymisation du 28 août, et je n'ai pas touché ce module.
- **La recopie chez les deux produits qui portent une doctrine périmée** : *bloqué par un garde-fou* — écrire chez un produit relève du produit. Le contrôle livré aujourd'hui le leur dira à leur prochaine ouverture, ce qui était l'objet de votre arbitrage.
- **Les 4 produits qui ne portent aucune pièce** : *écarté pour ce tour* — le contrôle livré ne les aidera pas, puisqu'il ne se déclenche que là où le lanceur de la Factory est déjà installé. Critère de réouverture : la décision de leur déposer un lot de travaux, posée ce matin et non tranchée.
- **Les 8 décisions ouvertes aux tours précédents** : *hors mandat* — durcissement des deux règles neuves, sort des copies périmées, enregistrement du travail, tables d'anonymisation, 9 dépôts frères divergés, ordre d'exécution des 23 tâches, câblage déjà fait, 4 produits sans pièce.

## 6. Écarts à la lettre

- **vous avez demandé** D-13 (b), « câbler le contrôle puis laisser chaque produit se mettre à jour » → **j'ai fait** le câblage et le signalement, **sans la recopie automatique** → **pourquoi** : votre phrase ne dit pas qui fait la copie, et les deux lectures sont défendables. Écrire dans l'arbre d'une session au moment où elle s'ouvre est un acte à effet visible que je ne prends pas sur une lecture ambiguë. La moitié non tranchée vous est rendue en décision plutôt que décidée à votre place.
- **vous avez demandé** D-14 (a), l'élargissement de la liste → **j'ai fait** l'élargissement **et déclaré son effet de bord sur deux autres règles** → **pourquoi** : la liste ne sert pas qu'à la règle que vous corrigiez ; le taire aurait fait passer pour une correction ciblée ce qui touche aussi ce qui compte comme preuve.
- Aucun autre écart.

## 7. Risques

- **Le contrôle d'héritage ajoute une exécution au démarrage de chaque session produit.**
  - signal : une ouverture de session sensiblement plus lente, ou un compte rendu tronqué par expiration de délai.
  - parade : le contrôle est borné à soixante secondes et son échec ne casse rien — il rend alors « verdict ILLISIBLE », qui est dit comme tel et non transformé en accusation contre le produit.
- **Le signalement seul peut être ignoré, exactement comme les précédents.**
  - signal : un produit ouvre plusieurs sessions de suite avec le même défaut d'héritage au compte rendu, sans que rien ne change.
  - parade : c'est précisément l'objet de la première décision ci-dessus ; en attendant, l'écart est au moins dit à chaque ouverture au lieu d'attendre un lot de retours.
- **Élargir ce qui compte comme preuve peut laisser passer une affirmation faiblement étayée.**
  - signal : une puce du bloc « traité » dont la seule preuve est un nom de fichier cité, sans verdict ni chiffre.
  - parade : la fixture rouge du banc continue d'échouer sur les deux règles concernées, ce qui borne l'élargissement ; et le risque était déjà présent pour six extensions, il change d'échelle, pas de nature.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, six corrections d'oracle, deux règles neuves, un contrôle câblé.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte ; c'est le risque le plus simple à fermer et le plus coûteux à laisser.

## 8. Prochaines actions

Ordre de traitement : enregistrer vient en premier parce que c'est la seule action dont l'absence peut faire **perdre** tout le reste ; les deux suivantes ferment les décisions de ce tour, la dernière solde l'arriéré.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, deux règles neuves, six corrections d'oracle, le comparateur du crochet, le contrôle d'héritage à l'ouverture et les bancs réparés. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin ; la publication relève d'un feu vert humain. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 2 | `neuve` | Faire recopier les artefacts périmés par le contrôle d'ouverture, avec la liste de ce qu'il a remplacé dans son compte rendu, puis l'éprouver dans ses deux sens. | `auto_ia` | `dependance_bloc_3` — attend la première décision ci-dessus. | La mise à jour des produits reste un geste facultatif, et c'est ce qui a produit quatre produits sur six sans aucune pièce. |
| 3 | `neuve` | Déclarer les deux clés de configuration dans le fichier d'exemple avec leur rôle, puis rejouer le contrôle de parité. | `auto_ia` | `dependance_bloc_3` — attend la seconde décision ci-dessus. | Un contrôle du dépôt reste rouge en permanence, et le prochain défaut de parité passera inaperçu au milieu. |
| 4 | `neuve` | Trancher les 8 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Heritage a l ouverture et localisateurs - 20260830g.md`
- Modifiés : `oracles\hook-ouverture.mjs` (contrôle d'héritage joué à l'ouverture d'une session produit, signalement non bloquant) · `oracles\oracle-synthese.mjs` (liste des sources reconnues portée de 6 à 24 extensions, fixture de la forme citée durcie)
- Éprouvé sur : le produit dont le journal a servi de référence ce matin, sens rouge · un produit témoin construit dans le dossier de travail de la session avec les dix artefacts recopiés, sens vert · le pilot lui-même, borne de non-application
- Bancs exécutés : restitution **11/11** · crochet **7/7** · conformité projet **44/44** · contrôles injoignables **PASS** sur 40 contrôles · parité de configuration **FAIL**, défaut antérieur nommé en décision
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
