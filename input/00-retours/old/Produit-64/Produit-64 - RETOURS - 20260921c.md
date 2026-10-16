# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-21, indice c

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : le porteur Client-A a redemandé, pour la **seconde fois en 6 jours**, que la
documentation utilisateur ne porte aucun sujet en cours de discussion.

Ce lot porte **1 retour**, et c'est une **récidive** : la classe existe au registre depuis le
16/09, elle a un oracle déclaré, et le défaut est revenu dans le même document, produit par la
même chaîne, 5 jours plus tard.

- **Contexte** : ajout d'un chapitre à une documentation utilisateur, puis reprise du porteur.
  Hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-21** — les 2 fichiers déposés dans le sas d'arrivée du pilot `digit-ai-factory/input/00-retours/_arrivee/` (ignoré par git). Empreintes SHA-256 vérifiées identiques entre l'original et la copie du sas, pour les 2 fichiers — lot `9b8ceb6f…`, sidecar `2863d92c…`. L'original reste ici, historique du produit. L'ingestion au registre du pilot appartient à l'humain : aucun identifiant `TF-####` n'est frappé tant qu'elle n'a pas eu lieu.

---

## RD-15 — Récidive de `contenu-d-auteur-livre-au-lecteur` : la classe est au registre, son oracle juge les GABARITS, et rien ne juge les DOCUMENTS livrés

### Le fait mesuré

Le 15/09/2026, le porteur Client-A demande de sortir du guide développeur le registre des
arbitrages, l'historique et le bandeau de statut. C'est fait le jour même. Le 16/09, la classe
`contenu-d-auteur-livre-au-lecteur` entre au registre du pilot sous `TF-1142`, avec son oracle
déclaré : *« pilot, `oracles/oracle-gabarits-documents.mjs` règle G10 — toute famille de la
bibliothèque déclare son lecteur ET porte la section “Document d'auteur” qui nomme ce qui NE va
PAS au lecteur ».*

Le 21/09/2026, un chapitre neuf est ajouté au **même document**. Il porte, en texte visible :

| Ce qui est revenu | Où |
|---|---|
| un tableau de 2 séances de Design Authority, avec leur état — « tenue ; verdicts non versés au dépôt », « **non tenue** » | vue Composants |
| une section entière « Ce qui n'est pas tranché, et qu'il ne faut donc pas figer dans votre code » | vue Composants |
| l'inventaire de la vue annonçant « les deux séances de Design Authority qui portent le sujet et ce qu'elles n'ont pas tranché » | bandeau de la vue Composants, porté par le générateur |
| 4 lignes marquées **trou**, 1 « en cours », 1 « non arrêté », 1 « relevé, non décidé » | carte de couverture, vue Repères |
| 5 niveaux de règle suffixés d'une parenthèse de gouvernance — « candidat à l'élévation », « en cours de versement en décision d'architecture », « une politique de sécurité IA est en cours d'arbitrage » | 5 chapitres de règle |
| un encart « Cette convention est proposée, pas arrêtée » | `GDE0601-R03` |

Soit **13 emplacements**, dans un document dont le lecteur déclaré est un développeur.

**Les 3 oracles du socle ont rendu PASS sur cette version.** `check_html.py` 42 règles, PASS.
`check_markdown.py --style` PASS. Les 4 oracles de la forge design, PASS. `render_page.py` PASS
aux 7 largeurs. Aucun n'a de règle qui lise le SENS du contenu livré.

### Pourquoi la classe n'a pas mordu

Trois causes, mesurées, et la troisième est la plus coûteuse.

**L'oracle de la classe juge les gabarits, pas les documents.** G10 vérifie qu'une *famille* de
`gabarits/documents/` déclare son lecteur et porte sa section « Document d'auteur ». Ce guide
n'est produit depuis aucune famille de la bibliothèque : il a son propre générateur. G10 ne le
regarde donc jamais, et son verdict sur la bibliothèque reste vert pendant que le défaut est
livré.

**Le document ne déclarait pas son lecteur, et personne ne s'en est ému.**
`check_markdown.py --style` le signale — *« EC-10 aucun lecteur déclaré dans l'en-tête »* — mais
en **avertissement**, et sa conséquence annoncée ne porte que sur les blocs de code : *« donc ses
blocs de code ne sont pas jugés »*. Le lecteur non déclaré n'a jamais été traité comme ce qu'il
est : la condition d'application de toute règle de séparation auteur / lecteur.

**Une demande humaine appliquée une fois n'a pas été capitalisée.** Le 15/09, la correction a
porté sur les 3 sections nommées par le porteur. Rien, ni dans le document, ni dans son
générateur, ni dans un contrôle, n'a enregistré la **règle** derrière la demande. Le chapitre
suivant, écrit 6 jours plus tard par la même chaîne, l'a donc réintroduite — et c'est le porteur,
pas un oracle, qui l'a vue.

### La règle qui aurait évité le retour

La classe existe : **`contenu-d-auteur-livre-au-lecteur`**, famille `gabarit-document`, créée le
2026-09-16 sous `TF-1142`. Ce retour entre en **récidive**. Son champ `regle` porte encore la
mention « à écrire » — ce qui est exactement ce que cette récidive démontre : la classe est
nommée, son oracle est déclaré sur les gabarits, et aucune règle ne protège un document livré.

### Proposition esquissée, jamais obligatoire

Trois gestes, du moins cher au plus utile.

1. **Faire du lecteur déclaré une condition dure.** Un document livré à un lecteur externe
   déclare `lecteur` dans son en-tête ; sans lui, la règle de séparation ne peut pas s'appliquer,
   et c'est un refus, pas un avertissement sur les blocs de code.
2. **Porter le jugement sur le DOCUMENT, pas seulement sur le gabarit.** Une famille de marqueurs
   lexicaux mesurée sur le texte visible d'un document à lecteur externe : *en cours
   d'arbitrage · pas tranché · non tranché · séance à planifier · verdicts non versés · non
   arrêté · proposée, pas arrêtée · candidat à l'élévation · en cours de versement*. Le bruit se
   mesure avant que la règle morde, comme `regle-neuve-sans-mesure-de-bruit` l'exige : sur ce
   document, la mesure serait de **13 emplacements avant correction, 0 après**, et les 21
   occurrences restantes de « Design Authority », « tranché » et « verdict » désignent toutes un
   geste du lecteur — où escalader, quelle porte passer — donc la règle doit distinguer
   l'**état** d'un sujet de la **destination** d'une escalade.
3. **Écrire le champ `regle` de la classe**, aujourd'hui « à écrire ». Une classe sans règle
   nomme un défaut sans dire comment ne pas le refaire : c'est ce qui s'est produit ici.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-15 | majeur · **récidive** | générique | La classe `contenu-d-auteur-livre-au-lecteur` est au registre depuis le 16/09 (`TF-1142`) ; le 21/09 le défaut revient au même document, en **13 emplacements**, et les **7 oracles du socle et de la forge design rendent PASS**. Cause : G10 juge les gabarits de la bibliothèque, pas un document produit par un générateur propre ; `EC-10` signale le lecteur absent en avertissement, sans en tirer de conséquence ; et le champ `regle` de la classe porte encore « à écrire » | rendre le lecteur déclaré bloquant pour un document externe ; mesurer une famille de marqueurs lexicaux sur le texte visible du DOCUMENT (13 → 0 sur ce cas, en distinguant l'état d'un sujet de la destination d'une escalade) ; écrire le champ `regle` de la classe |

## Remarques restées au produit

2 corrections de cette séance restent ici : elles portent sur ce document et sur son générateur.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le contenu de gouvernance vivait aussi dans le GÉNÉRATEUR, pas seulement dans la source : l'inventaire de la vue annonçait les séances de Design Authority alors que le corps de la vue n'en parlait plus | inventaire réécrit dans `tools/construire-reference-developpeur.py` | **oui** → remonté sous RD-15 : un contrôle qui ne lirait que la source Markdown manquerait ce cas, puisque le texte est injecté au rendu ; la mesure doit porter sur la page RENDUE |
| L'en-tête du document ne déclarait pas son lecteur | champ `lecteur` ajouté : « developpeur Client-A qui construit une application — documentation utilisateur » | **oui** → remonté sous RD-15, proposition 1 |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` du pilot sur ce lot —
vérifié le 2026-09-21 : les pièces de cette séance sont un lot de retours, une revue de lecture
et une page HTML générée. **C'est précisément le trou que RD-15 décrit** : un document qui ne
vient d'aucune famille de la bibliothèque échappe à l'oracle des gabarits, et rien d'autre ne le
juge sur ce point.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output/05-Kits/Client-A - Guide développeur POC-to-Prod - 20260921e.html` | aucun — générateur propre au produit | une section « Document d'auteur » disant ce qui NE va PAS au lecteur, telle que G10 l'exige des familles de la bibliothèque | le porteur a redemandé **2 fois en 6 jours** que les sujets en cours de discussion sortent de la documentation utilisateur — fait rapporté, pas supposé | champ `lecteur` dans l'en-tête de la source | générique — remonté sous RD-15 |
| `forge/travaux/REVUE-20260921e-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — sans numéro de version affiché | rien de neuf depuis le lot de ce matin | rien : la revue a été tenue, la porte locale la juge PASS | rien de plus | déjà remonté sous RD-8 — la revue de lecture obligatoire jouée par aucun contrôle du socle — et RD-14 — `--sections` sans capture sur un panneau masqué |

## Confirmations positives

- **La classe était juste, et elle a nommé le bon défaut.** Ce n'est pas la classe qui a manqué,
  c'est sa portée : elle protège la bibliothèque de gabarits, pas les documents livrés. Une
  récidive qui confirme la classe vaut mieux qu'une classe jamais éprouvée.
- **La demande du porteur a produit une correction complète et mesurable** : 13 emplacements
  avant, 0 après, sur 6 chapitres et 3 vues, plus le générateur.
- **Les règles du format de courriel existaient déjà** dans le support de Design Authority du
  10/09 ; elles manquaient seulement à la documentation. Le trou n'était pas de connaissance, il
  était de **transfert** — et aucun contrôle ne mesure qu'une règle connue a bien atteint le
  document qui s'adresse à ceux qui doivent l'appliquer.
