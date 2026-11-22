---
role: la recette du lecteur isolé de tout contexte sur l'abonnement (commande, question piège, témoin, garde contre la clé d'API) et sa preuve d'usage ; remplace la prescription de `--bare`
sources_de_verite: [scripts/lecteur-isole.mjs, scripts/lecteur-isole.test.mjs, scripts/controle-comprehension.mjs, scripts/controle-comprehension.test.mjs, references/JETON-ABONNEMENT.md (le mode --bare), TF-2553, TF-2555, TF-2714, TF-2729, TF-2739, TF-2728]
verifie_le: 2026-11-22
revue_prevue: 2026-12-06
---

# Le lecteur isolé sur l'abonnement : la recette

Ce que change ce document pour vous : un lecteur qui doit répondre d'après un texte seul, sans rien savoir du projet, se lance
par une commande qui ne demande aucune clé d'API. `--bare` est écarté, parce qu'il ne lit aucun identifiant OAuth et exige une
clé d'API payante (`references\JETON-ABONNEMENT.md`) : un amendement qui le prescrivait a fait demander une clé et un secret au
créateur du produit, à tort, le 14/11/2026 (TF-2553).

## La commande

La commande suivante isole le lecteur sur l'abonnement du poste. Chacun des cinq verrous retire une source de contexte, et la
question passe par l'entrée standard, parce que `--tools ""` avale l'argument qui le suit.

```
claude -p --setting-sources "" --system-prompt "<consigne du lecteur>" --tools "" --disable-slash-commands --strict-mcp-config
```

| Verrou | Contexte retiré |
|---|---|
| `--setting-sources ""` | les réglages, et avec eux le CLAUDE.md et la mémoire du dossier |
| `--system-prompt` | la consigne système par défaut de Claude Code, remplacée par la seule consigne du lecteur |
| `--tools ""` | tous les outils : le lecteur ne peut ni lire un fichier ni lancer une commande |
| `--disable-slash-commands` | les skills |
| `--strict-mcp-config` | les serveurs MCP déclarés ailleurs que dans la ligne de commande |

## La recette, trois lancements

`node scripts\lecteur-isole.mjs --recette` joue trois lancements et se lit ainsi : une ligne par lancement, puis un verdict
TENU ou DÉFAUT. Le témoin est la même question de fuite sans aucun verrou, depuis le dossier du pilot : il doit citer la première
ligne du CLAUDE.md, sinon la sonde ne voit rien et la recette ne conclut pas. La fuite est cette question posée au lecteur isolé,
qui doit répondre AUCUN. Le piège est un texte qui dit « aucune forge ne s'appelle forge-ops », que le contexte du pilot
contredit : le lecteur isolé répond NON d'après ce texte seul, un lecteur qui laisse passer le contexte répond OUI.

La recette refuse de jouer (exit 2) quand `ANTHROPIC_API_KEY` ou `ANTHROPIC_AUTH_TOKEN` est posée : la CLI les emploie à la
place de l'abonnement et la facturation passe à l'usage. Elle ne demande jamais la valeur d'une clé. Son banc,
`scripts\lecteur-isole.test.mjs`, joue sans modèle une fausse CLI dans huit scénarios : le vert, la fuite, le piège raté, le témoin
muet, la CLI muette, le message tronqué, le contexte qui passe sans que le lecteur le dise et la CLI sans jetons rapportés. Le refus sous une clé d'API se joue à part.

## La CLI sous Windows : `bin\claude.exe`, jamais `claude.CMD` (TF-2729)

Sous Windows, `claude` est un `claude.CMD`, et `cmd.exe` abîme les longs arguments. Le 14/11/2026, un lecteur ne s'est pas lancé (« Input must be provided… »).
Le contournement du produit lançait le fichier `cli.js` par node. Il est tombé quand une mise à jour du paquet a remplacé `cli.js` par `bin\claude.exe`.
Sur ce poste, la CLI 2.1.318 ne porte plus que `bin\claude.exe` (mesuré le 22/11/2026).

La recette résout donc la CLI dans cet ordre : `QO_JUGE_CLI`, puis `bin\claude.exe` du paquet npm global, puis son `cli.js`.
Sous Windows, si aucun des trois n'existe, elle s'arrête (exit 3). Elle ne retombe jamais sur `claude.CMD`.

Un lancement à blanc précède les trois lancements. Il envoie un message de 120 lignes dont seule la dernière porte un code que le lecteur doit rendre.
Un message tronqué par le lanceur ne peut pas le rendre. La recette s'arrête alors (exit 3, « recette NON jouée »), plutôt que de rendre un verdict sur une autre question que la sienne.

`node scripts\lecteur-isole.mjs --a-blanc` ne joue que ce lancement. Le banc l'éprouve par une fausse CLI qui tronque le message. Aucun lancement réel n'a été joué pour ce correctif.

## L'isolement se prouve par un marqueur et par une mesure (TF-2714)

Le 15/11/2026, sur plus de 40 lecteurs aux cinq verrous, un seul a déclaré avoir reçu un bloc `system-reminder` portant l'adresse du compte.
Les cinq verrous ne retirent pas ce contexte automatique du harnais. La question témoin est déclarative : elle ne le voyait que si le lecteur le disait.
Deux contrôles objectifs s'ajoutent, sans clé d'API.

- **Un marqueur injecté.** Sans `--racine`, la recette se joue depuis un dossier jetable. Son `CLAUDE.md` porte un marqueur aléatoire.
  Le témoin doit le citer, sinon la sonde ne voit rien. Le lecteur isolé ne doit pas le contenir. C'est une chaîne cherchée, pas une déclaration.
- **Les jetons d'entrée que la CLI rapporte.** Un lecteur isolé en reçoit une fraction de ceux du témoin. Un contexte qui passe les gonfle, même quand le lecteur répond AUCUN et NON.
  La borne est de 25 % de ceux du témoin (`RATIO_JETONS_MAX`). Elle est provisoire : aucun lancement réel n'a mesuré ce rapport, et elle se confirme au premier rejeu réel.
  Une CLI qui ne rapporte aucun jeton laisse la recette tenir, en disant que ce contrôle n'a pas été joué.

Le mode sans contexte reste celui des cinq verrous. `--bare` est écarté, parce qu'il exige une clé d'API payante.
Un contexte automatique que ni les verrous ni le marqueur ne montrent reste possible. La mesure des jetons le compte, elle ne le nomme pas.

## Le contrôle de compréhension : trois lecteurs par profil, et une relecture par personas avant (TF-2739, TF-2728)

Le 14/11/2026, le contrôle de compréhension d'un texte de présentation a rendu des verdicts qui variaient d'un tirage à l'autre.
Puis le créateur a rejeté le texte pour une raison que le contrôle ne cherchait pas. Deux commandes de `scripts\controle-comprehension.mjs` y répondent, sans appel de modèle.

**Trois lecteurs par profil, et un rejeu avant de compter une réécriture (TF-2739).** Un élément n'est manqué que si la majorité des lecteurs du profil le manque.
Un élément manqué à la majorité se rejoue, avec les mêmes lecteurs, avant qu'une réécriture ne compte :

- manqué de nouveau : manque confirmé, la réécriture compte (exit 1) ;
- rendu au rejeu : aléa, aucune réécriture ne compte (exit 0) ;
- sans rejeu : `REJEU_REQUIS` (exit 3).

Le surcoût s'écrit dans l'autorisation de dépense. `node scripts\controle-comprehension.mjs cout --profils 2 --lecteurs 3` rend 6 lancements au lieu de 2, soit un facteur 3.
Chaque rejeu en ajoute 3 par profil concerné. Le produit a rapporté qu'un faux échec coûtait une réécriture et 3 lancements (nombre rapporté, non recompté ici).

**Une relecture par personas avant tout contrôle (TF-2728).** Le contrôle cherchait des éléments attendus. Il ne jugeait ni l'utilité, ni la logique, ni la place d'une phrase.

- `personas-preparer` numérote les phrases et écrit la consigne d'un relecteur par profil : décideur, technique, métier du sujet.
  Pour chaque phrase, le relecteur dit si elle est utile, logique et bien placée, puis juge le fil.
- Les consignes se lancent par l'agent `relecteur`, en lecture seule.
- `personas-juger` rend FAIL pour une phrase inutile, illogique ou mal placée, pour un « non » sans raison, pour un fil qui ne tient pas ou pour un profil qui n'a pas tout noté.
  Il inscrit son verdict au journal, lié à l'empreinte du texte.
- `autoriser` refuse le contrôle de compréhension tant que le journal ne porte pas un PASS pour ce texte tel qu'il est. Un texte réécrit après la relecture doit être relu.

L'auteur ne réécrit pas après avoir lu les références du contrôle. Il reprend les phrases que les personas ont refusées, puis relit.

## La preuve d'usage

Le tableau se lit ligne par ligne : une ligne est une série de lectures réelles, avec sa provenance. Le coût est celui que la
CLI rapporte ; sur l'abonnement il n'est pas facturé à l'usage.

| Série | Lectures | Fuites | Lancements | Coût rapporté | Provenance |
|---|---|---|---|---|---|
| Relevé du produit forge-digit-ai-fr (TF-2555, amendement 2 du run 20261114a) | 6 | 0 (témoin AUCUN, piège NON) | 9 | 0,442 USD | rapporté par le produit, non recompté ici |
| Recette jouée au pilot le 14/11/2026, CLI 2.1.107 du paquet npm | 1 recette | 0 (isolé AUCUN, piège NON, témoin citant le CLAUDE.md) | 3 | 0,1894 USD | mesuré ici, `node scripts\lecteur-isole.mjs --recette --json` |

## Ce qui n'est pas jugé

- Le contenu des réponses d'un lecteur réel au-delà de la question de fuite et du piège : la recette prouve l'isolement, pas la
  qualité de la lecture.
- Une autre version de la CLI : la recette se rejoue après chaque changement de version, parce qu'un verrou renommé rouvrirait
  la fuite sans bruit.
- La borne de 25 % des jetons (TF-2714) : provisoire, non mesurée sur de vrais lancements.
- Que les retours d'une relecture par personas viennent de lecteurs réels et indépendants (TF-2728) : le journal lie un verdict à un texte, il ne prouve pas qui a lu.
