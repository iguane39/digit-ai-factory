---
destinataire: humain
---

# Synthèse de mandat — la Factory se recopie chez les produits, et un contrôle de configuration repasse au vert (30/08/2026)

Vos deux arbitrages sont exécutés et éprouvés dans six situations différentes. La redescente des
doctrines cesse d'être un geste que quelqu'un doit vouloir faire : toute session ouverte chez un
produit remet à jour, dès sa première seconde, les pièces que la Factory déclare non
personnalisables, dit lesquelles elle a remplacées, puis se juge. Ce qu'elle ne touche jamais est
aussi vérifié : le fichier de consignes propre à un produit témoin est ressorti intact de
l'épreuve. Le second arbitrage ferme un contrôle du dépôt qui était rouge depuis deux jours. En
passant le reste du banc, un contrôle de sécurité a remonté un fait grave et sans aucun rapport
avec ce tour : des identifiants sont publiés dans plusieurs dépôts de ce poste, dont trois de
l'écosystème. Je n'y ai pas touché — c'est la seule décision de ce message, et elle est urgente.

## 1. En-tête d'identification

- **quoi** — exécution des arbitrages D-15 (a) et D-16 (a) : faire recopier les pièces héritées par le contrôle d'ouverture, et déclarer deux clés de configuration au gabarit.
- **sur quoi** — le pilot `digit-ai-factory` : `oracles\hook-ouverture.mjs` et `.env.example`, éprouvés contre quatre produits témoins jetables.
- **quand** — fin le **30/08/2026 à 14:22 (UTC+02:00)**, durée **≈ 30 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail non committé.

## 2. Verdict en une ligne

Les 2 arbitrages sont **TENUS et éprouvés dans 6 situations** : recopie sur un produit périmé (1 pièce remplacée puis verdict à jour), sur un produit dépourvu (6 pièces créées), idempotence au second passage (0 écriture), produit non instancié (0 fichier créé), pilot lui-même (aucune section), et fichier personnalisé **intact** ; parité de configuration passée de FAIL à **PASS** sur ses 10 clés ; bancs restitution **11/11**, crochet **7/7**, conformité projet **44/44**.

## 3. Décisions attendues

**Chapeau commun.** Une seule décision naît de ce tour, et elle ne vient pas du mandat : elle a été
remontée par un contrôle de sécurité du dépôt joué en fin de banc. Les huit décisions posées aux
tours précédents restent ouvertes et sont rappelées au dernier bloc, avec ce qu'il en coûte de les
laisser en attente.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la prose
rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le tableau
donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que la
retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si vous
ne tranchez pas. Vous répondez en citant l'identifiant puis la lettre.

> **D-17 — Que fait-on des identifiants publiés dans les dépôts de ce poste, dont trois de l'écosystème ?**
> Relevé en fin de banc, sans rapport avec ce tour. Onze porteurs de secrets sont signalés : trois vivent hors de tout dépôt, donc hors de toute exclusion et de toute recherche ; huit sont dans un dépôt qui ne les exclut pas, et cinq d'entre eux sont **publiés sur un dépôt distant** — l'un d'eux étant contenu par six cent quatre-vingt-trois branches. Le contrôle le dit sans détour : retirer le fichier du disque n'y change rien, seule une rotation de l'identifiant réduit le risque. Trois des dépôts touchés sont des produits de l'écosystème.
> **Recommandation : (a).** Source consultée : `oracles\oracle-secrets-hors-perimetre.mjs`, qui rend FAIL sur ses règles SP1 et SP2 en nommant chaque fichier, son dépôt, son commit de publication et le nombre de branches qui le contiennent. Le contrôle se déclare lui-même non bloquant hors du pilot et des forges, précisément parce que le remède ne lui appartient pas.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Traiter d'abord les 5 identifiants PUBLIÉS — vérifier ce qu'ils ouvrent, faire tourner ceux qui sont vivants — puis les 6 autres | Effort **moyen × moyen**, essentiellement humain : une rotation se fait chez le fournisseur, pas ici | Exclut de commencer par le rangement du disque, qui ne réduit aucun risque tant que la valeur publiée reste valide |
| **(b)** Ranger d'abord les fichiers — déplacer, exclure, supprimer — et faire tourner ensuite | Effort **simple × court** au début ; laisse les valeurs publiées actives pendant ce temps | Exclut la réduction immédiate du risque : le contenu publié reste exploitable |
| **(c)** Verser le constat au registre et le traiter dans l'ordre des autres tâches | Effort nul maintenant | Exclut toute urgence sur des identifiants dont certains sont publics depuis des semaines |

> **Si rien n'est décidé** : (c) s'applique de fait, et les identifiants publiés le restent.

## 4. Traité — avec sa preuve

- **Le contrôle d'ouverture recopie désormais les pièces héritées**, arbitrage D-15 (a) — et il le dit avant de se juger.
  - preuve, produit PÉRIMÉ : un témoin portant une copie de doctrine falsifiée reçoit « **1 artefact(s) MIS À JOUR à l'instant** : forge/RESTITUTION.md — remplacé depuis gabarits/RESTITUTION.md », puis « à jour — 10 artefact(s) hérité(s) présent(s) et à jour ».
  - preuve, produit DÉPOURVU : un témoin instancié sans aucune pièce reçoit **6 artefacts créés**, chacun nommé avec sa source, puis un défaut résiduel correctement attribué aux 3 pièces que ce hook ne touche jamais.
  - preuve d'IDEMPOTENCE : rejoué sur le témoin déjà remis à jour, il ne recopie rien et rend directement le verdict. Un contrôle qui réécrit à chaque ouverture ferait du bruit et userait la confiance.
- **Ce qu'il ne touche jamais est vérifié**, et c'est la borne la plus importante.
  - preuve : un témoin portant un fichier de consignes personnalisé, avec une ligne locale explicite, ressort de l'épreuve **inchangé** — seules les pièces déclarées en copie identique sont remplacées. Les pièces que le produit adapte légitimement restent son affaire, et le compte rendu le dit.
- **Un produit jamais instancié n'est pas instancié par surprise.**
  - preuve : un témoin sans dossier de forge reçoit « sans objet — ce projet n'a pas été instancié », et le comptage des fichiers créés chez lui rend **0**.
- **Le pilot ne se recopie pas sur lui-même.**
  - preuve : lancé sans le paramètre du lanceur produit, le contrôle n'imprime aucune section et n'écrit rien.
- **Les deux clés de configuration sont déclarées**, arbitrage D-16 (a).
  - preuve : le contrôle de parité passe de « FAIL — 2 clé(s) LUE(s) par le code et absente(s) du gabarit » à « **PASS** — les 10 clé(s) lue(s) par le code sont couvertes ». Les deux entrées disent leur rôle, leur emplacement par défaut, et ce qui se passe en leur absence.
- **Aucune régression sur le reste du dépôt.**
  - preuve : banc de restitution **11/11**, banc du crochet **7/7**, conformité projet **44 PASS 0 FAIL**, contrôles injoignables **PASS** sur 40 contrôles, oracle des gabarits **PASS**, oracle d'écosystème **PASS**.
- **Un constat grave, sans rapport avec ce tour, est remonté plutôt que noyé** : 11 porteurs de secrets, dont 5 publiés.
  - preuve : le contrôle des secrets hors périmètre rend **FAIL** sur ses deux règles, avec 3 porteurs hors de tout dépôt et 8 dans un dépôt qui ne les exclut pas, dont 5 publiés — commits et nombres de branches nommés. Il se déclare non bloquant hors du pilot et des forges.

## 5. Non traité — avec son motif

- **Les identifiants publiés** : *dépendance à une décision humaine* — une rotation se fait chez le fournisseur du service et engage des comptes ; c'est la décision ci-dessus, et c'est la plus urgente du lot.
- **La recopie chez les deux produits réels du poste** : *bloqué par un garde-fou* — je n'ai lancé le contrôle que sur des témoins jetables du dossier de travail, jamais sur un dépôt frère. Ils se mettront à jour d'eux-mêmes à leur prochaine ouverture de session, ce qui est exactement l'objet de votre arbitrage.
- **Les 4 produits qui ne portent aucune pièce** : *écarté pour ce tour* — le contrôle ne s'exécute que là où le lanceur de la Factory est déjà câblé, et il ne l'est pas chez eux. Critère de réouverture : la décision de leur déposer un lot de travaux, posée ce matin et non tranchée.
- **La clé d'interface d'images que rien ne lit** : *écarté* — le contrôle de parité la signale en avertissement, pas en défaut ; une clé peut être lue par un déploiement ou un service tiers. Réouverture si le gabarit accumule d'autres clés mortes.
- **Les 8 décisions ouvertes aux tours précédents** : *hors mandat* — durcissement des deux règles neuves, sort des copies périmées, enregistrement du travail, tables d'anonymisation, 9 dépôts frères divergés, ordre d'exécution des 23 tâches, 4 produits sans pièce, et l'arriéré du registre.

## 6. Écarts à la lettre

- **vous avez demandé** D-15 (a) et D-16 (a) → **j'ai fait** les deux, **et j'ai remonté un troisième sujet que vous n'aviez pas demandé** → **pourquoi** : il est apparu en passant le banc complet après mes modifications, il concerne des identifiants publiés, et le taire au motif qu'il sort du mandat aurait été le seul vrai défaut de ce tour. Il est posé en décision, pas traité de moi-même.
- **vous avez demandé** la recopie → **j'ai fait** la recopie **et l'annonce systématique de ce qui a été remplacé, même quand tout est vert** → **pourquoi** : un fichier changé sous les pieds d'une session sans que rien ne le dise est le pire des deux mondes — l'agent lit un contenu qu'il n'a pas vu changer et n'a aucun moyen de savoir pourquoi.
- Aucun autre écart.

## 7. Risques

- **La recopie s'appliquera aux deux produits réels du poste sans autre annonce que son compte rendu.**
  - signal : à leur prochaine ouverture de session, leur copie de doctrine sera remplacée et le compte rendu le dira en tête.
  - parade : c'est l'effet voulu de votre arbitrage, et il est réversible — les fichiers concernés sont suivis par git chez eux, donc un `git diff` montre exactement ce qui a changé.
- **Une modification locale d'une pièce déclarée non personnalisable serait écrasée sans retour.**
  - signal : un produit constate qu'une adaptation qu'il avait faite a disparu après une ouverture de session.
  - parade : le mode de copie identique déclare littéralement que ces pièces ne se personnalisent pas, et le compte rendu le redit à chaque recopie. Une adaptation légitime relève des modes de simple présence, auxquels ce hook ne touche pas — vérifié sur témoin.
- **Le contrôle ajoute une lecture de manifeste et jusqu'à six copies au démarrage de chaque session produit.**
  - signal : une ouverture sensiblement plus lente, ou un compte rendu tronqué par expiration de délai.
  - parade : la comparaison précède toute écriture, donc le cas courant ne copie rien ; le jugement reste borné à soixante secondes et son échec est dit sans être transformé en accusation.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, six corrections d'oracle, deux règles neuves, un contrôle câblé puis rendu réparateur, un gabarit de configuration complété.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte. C'est le risque le plus simple à fermer et le plus coûteux à laisser courir.

## 8. Prochaines actions

Ordre de traitement : les identifiants publiés passent devant tout, parce que leur coût **croît avec le temps** et qu'aucune autre action ne le réduit ; enregistrer vient ensuite, parce que son absence peut faire perdre le reste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Vérifier ce qu'ouvrent les 5 identifiants publiés, faire tourner ceux qui sont vivants chez leur fournisseur, puis ranger les 6 autres porteurs. | `manuelle_utilisateur` | `acces` — une rotation se fait dans la console du fournisseur, hors de portée de l'agent. Trace mesurée : le contrôle nomme les commits de publication et le nombre de branches qui les contiennent, jusqu'à 683 pour l'un d'eux, sans qu'aucun accès à ces services ne soit possible d'ici. | Des identifiants publics restent exploitables, et leur retrait du disque n'y changera rien. |
| 2 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, deux règles neuves, six corrections d'oracle, le comparateur du crochet, le contrôle d'héritage réparateur, le gabarit de configuration complété. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin ; la publication relève d'un feu vert humain. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 3 | `neuve` | Déposer chez les 4 produits sans pièce un lot de travaux décrivant les artefacts à installer, pour que le contrôle d'ouverture puisse ensuite les tenir à jour tout seul. | `auto_ia` | `dependance_bloc_3` — attend la décision de dépôt posée ce matin. | Le contrôle livré aujourd'hui ne les atteindra jamais : il ne s'exécute que là où le lanceur est déjà câblé. |
| 4 | `neuve` | Trancher les 8 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Recopie de l heritage et parite - 20260830h.md`
- Modifiés : `oracles\hook-ouverture.mjs` (recopie des pièces en copie identique, annonce de ce qui est remplacé, verdict après recopie) · `.env.example` (2 clés de l'anonymiseur déclarées avec leur rôle)
- Éprouvé sur 4 produits témoins jetables du dossier de travail — périmé, dépourvu, non instancié, personnalisé — plus le pilot lui-même ; aucun dépôt frère n'a été touché
- Bancs exécutés : restitution **11/11** · crochet **7/7** · conformité projet **44/44** · parité de configuration **PASS** · contrôles injoignables **PASS** sur 40 contrôles · gabarits **PASS** · écosystème **PASS** · secrets hors périmètre **FAIL**, non bloquant, porté en décision
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
