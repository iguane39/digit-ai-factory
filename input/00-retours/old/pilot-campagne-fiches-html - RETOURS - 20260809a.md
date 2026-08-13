# Retours forges — campagne « fiches HTML lisibles » — 20260809a

- **Contexte** : clôture de la campagne « fiches HTML lisibles » (mandat humain du 09/08,
  TF-0043/0044/0045/0046/0047 traités) — refonte du socle `digit-ai-page-html`, refonte du
  rapport de `forge-seo`, régénération du rapport réel `auxportesdelabaie.fr`.
- **Références** : commits `17c01ee` (forge-agents), `311f128` (forge-seo), `fa1a595`
  (forge-organization) — non poussés à la remise de ce lot.
- **Remise au steering** : ce fichier et son sidecar sont déposés dans `input\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## forge-seo (`digit-ai-forge-seo`)

Deux défauts de la même famille en une session : `front_matter()` rend des chaînes, et
chaque appelant doit s'en souvenir. TF-0042 corrigeait l'oubli dans `dette()` ; le même
oubli existait dans `collecter()`, avec des conséquences plus graves car silencieuses.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RS-10 | majeur | `collecter()` faisait `{**n, **fm}` : `fm["id"]` (chaîne) écrasait l'entier du manifeste. `noeuds_couverts` étant lu en entiers, **aucune** action n'était rattachée à son nœud. Rien n'échouait : le rapport se générait, complet et faux — « Nœuds couverts : — » sur les 10 actions, branche « — » donc regroupement par branche vide de sens, et le choix du blocage principal retombant sur l'ordre de la grille, c'est-à-dire le défaut que TF-0047 était censé corriger. Détecté en **relisant le rendu**, pas par un contrôle. | Typer `front_matter()` depuis le manifeste (id entier, booléens, listes) plutôt que d'exiger un `int()` de chaque appelant. Troisième occurrence de la famille : c'est le producteur qu'il faut corriger, pas les consommateurs. |
| RS-11 | mineur | `validate.py` ne contrôle aucune **cohérence référentielle** entre `actions-*.csv` et la grille : un `noeuds_couverts` pointant sur un id inexistant, ou d'un type incompatible, passe sans un mot. C'est ce qui a laissé RS-10 invisible. | Contrôle 7 de `validate.py --mission` : tout id cité par `noeuds_couverts` existe dans le manifeste, et au moins une action se rattache effectivement. Un rattachement à 0 % sur un CSV non vide est un échec. |

## forge-agents — socle `digit-ai-page-html` (`digit-ai-forge-agents`)

Le composant de recherche du socle porte un défaut de nommage qui a produit un défaut
visible en production, et l'oracle de rendu génère du bruit qui noie son propre signal.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-12 | majeur | `find-in-page.js` documente son câblage avec un conteneur `class="find"` et surligne en `<mark class="find">` : **même classe pour deux rôles**. Un livrable qui style son conteneur `display:flex` style aussi ses surlignages, qui deviennent des boîtes de bloc. Mesuré au navigateur sur le rapport SEO : le « s » de « clics » atterrissait 606 px avant la fin du « clic » surligné. La règle `mark.find`, de spécificité supérieure, ne pouvait pas gagner : elle ne déclarait pas `display`. | Nommer la classe du surlignage dans l'asset (`mark.dai-hl`), et lui faire porter un jeu défensif complet (`display:inline;padding:0;margin:0`). Un composant du socle ne doit pas dépendre du CSS que l'appelant n'écrira pas. |
| RA-13 | mineur | `render_page.py` écrit ses PNG **à côté du fichier audité**. Auditer le rapport client a déposé 12 PNG dans `seo/livrables/` du projet — le dossier que le client reçoit. Nettoyés à la main. | Option `--out <dossier>` avec défaut hors du dossier audité (ex. `.oracles/` ou le scratchpad). |
| RA-14 | mineur | V7 (rythme vertical) rend **288 avertissements** sur un document dense de 465 Ko, dont l'écrasante majorité sont des suites de paragraphes de longueurs différentes — c'est-à-dire de la prose normale. Le signal utile (V1/V4) est noyé : il a fallu écrire un script d'agrégation pour lire le verdict. | Exclure les suites de `<p>` en flux de prose du calcul V7, ou plafonner par conteneur. Un oracle qui produit 288 lignes de bruit n'est pas lu. |
| RA-15 | majeur | Rayon d'impact du contrôle étendu, mesuré : `digit-ai-schemas/assets/exemple-reference.html` rend **25 échecs** — 18 L3 (badges « Nouveau » et assimilés sans aucune légende) et 7 L4 (tables de 8 lignes ou plus sans filtres). Les 7 L4 **ne sont pas nouveaux** : le composant de filtres est obligatoire au socle depuis le 08/08 ; l'asset ne s'y est jamais conformé, c'est le contrôle qui manquait. Aucun faux positif dans les 25. Le boilerplate du socle lui-même échouait L2 (`max-width:960px`) — corrigé dans la foulée, un boilerplate qui ne passe pas les règles du socle les rend inapplicables. | Passe de conformité sur `digit-ai-schemas`. **Non corrigé ici** : hors périmètre du mandat, et refactorer l'asset de référence d'un skill voisin sans décision serait exactement le drive-by qu'on interdit. |

## Confirmations positives

- **L'oracle d'interaction tient.** `oracle_interaction.py` (forge-seo) est resté 9/9 tout au
  long d'une refonte lourde du JS et du CSS, et il avait déjà attrapé le défaut de
  `</script>` inline. La règle « vérifier que le code tourne, pas qu'il est là » se confirme.
- **Le contrôle de couverture de grille tient.** Le REFUS de `rapport_html.py` sur une étude
  incomplète n'a produit aucun faux positif sur 87 nœuds.
- **La correction TF-0042 était nécessaire et suffisante** : le rafraîchissement du crawl
  était bloqué net (11 écarts au schéma, rien d'écrit) et est passé du premier coup après.
- **Le circuit fixture rouge / fixture verte discrimine.** Les 13 fixtures rouges de
  lisibilité ont toutes échoué sur leur règle et sur elle seule, du premier coup — et la 14e
  (collision de classe) a prouvé qu'une première version du contrôle L5 aurait laissé passer
  le défaut qui l'avait motivé.

## Ordre recommandé

1. **RS-10** — meilleur rapport gain/effort : le producteur `front_matter()` est un point
   unique, trois consommateurs ont déjà payé l'oubli, et le mode de défaillance est
   silencieux (rapport complet et faux).
2. **RA-12** — un défaut du socle qui se propage à tout livrable réutilisant le composant.
3. **RS-11** — le garde-fou qui aurait rendu RS-10 bruyant au lieu d'invisible.
4. **RA-13**, **RA-14** — confort d'exploitation des oracles.
