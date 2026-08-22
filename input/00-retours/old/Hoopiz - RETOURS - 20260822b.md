# Retours forges — Hoopiz — 20260822b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : quatrième passe sur le rapport HTML de synthèse Hoopiz (version `20260822a`),
  qui intègre un arbitrage de direction, une analyse d'architecture et les corrections d'une
  contre-expertise. Les trois oracles sont **verts du premier coup après correction**, et
  **le bug bloquant du lot `20260821a` est corrigé** — voir les confirmations positives.
  Ce lot ne remonte donc que ce que la **revue de lecture** a trouvé et que les oracles ne
  pouvaient pas voir, plus un écart entre ce qu'un outil annonce et ce qu'il fait.
- **Références ledger** : aucun ledger dans ce projet (run hors pilot, skills appelés depuis
  Claude Code). Pièces : `output/v2-architecture-cible/rapport/REVUE.md` §0.6 et §3.1,
  `rapport/…20260822a.html` (livrée), fixture de mesure décrite en RD-20.
- **Lots précédents** : `20260820a`, `20260820b`, `20260821a`, `20260822a` — **tous remis**,
  donc immuables. Ce lot est un fichier neuf.
- **Remise au pilot** : copier ce fichier et son sidecar `.tf.jsonl` dans
  `<pilot>\input\00-retours\`. **Remise soumise à validation humaine** (règle 18).
- **Statut** : remis le 2026-08-22

**Numérotation** : les lots précédents ont consommé RD-1 à RD-19 et RA-1 à RA-10. Ce lot
continue en RD-20/RD-21 et RA-11.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-design (`digit-ai-forge-design`) — skill `digit-ai-page-html`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-20 | majeur | **Le composant « tableau repliable en cartes » de `references/composants.md` §6 met `table` en `display: block` sans traiter sa légende — la légende est alors réduite à une colonne d'un mot.** La règle est `table, tbody, tr, td { display: block; width: 100%; }` sous 640 px, alors que le même extrait déclare `caption { text-align: left; … }` juste au-dessus : une légende est donc bien attendue. Une `caption` dont le tableau parent passe en `display: block` reçoit une **boîte de tableau anonyme** qui se réduit au contenu. **Mesuré sur fixture minimale** (deux tableaux, même viewport 390 px, même texte de légende de 108 caractères) : extrait du socle → **58,9 px de large pour 220 px de haut** ; variante `table.repli-cartes` du boilerplate → **374 px de large pour 44 px de haut**. **Les deux implémentations du même composant, dans le même skill, divergent — et une seule est saine** : le boilerplate ne met jamais `table` en `display: block` (il ne touche que `thead`, `tr`, `td`), donc sa légende reste dans une vraie boîte de tableau. C'est l'extrait de référence, celui qu'on copie, qui porte le défaut. Constaté sur livrable réel : **quinze tableaux**, sur toutes les versions depuis la première, jamais vu par aucun oracle ni par quatre passes de relecture client. | Ajouter `table > caption { display: block; width: 100% }` à l'extrait §6 — une ligne. Et **aligner les deux implémentations**, ou dire laquelle fait foi : aujourd'hui le lecteur qui copie l'extrait §6 obtient un défaut que le lecteur qui part du boilerplate n'a pas. Fixture rouge fournie par la mesure ci-dessus. |
| RD-21 | majeur | **La règle L2-rendu existe précisément pour attraper « du texte comprimé là où il y a de la place », et elle ne peut structurellement pas voir le défaut RD-20 — pour trois raisons indépendantes, chacune suffisante.** (1) Sa collecte est `querySelectorAll('p, dd, li, blockquote, .va, .prose')` : **`caption` n'y est pas**. (2) Même ajoutée, elle serait écartée par la ligne suivante, `if (el.closest('table') \|\| el.closest('nav')) continue;` — une légende est **toujours** dans un tableau. (3) `L2_MIN_VIEWPORT = 1100` : la règle ne s'exécute pas sous 1 100 px, or le défaut n'existe **que sous 640 px**. Le commentaire justifie ce seuil — « sous cette largeur, une bride de lecture est sans effet visible » — ce qui est juste pour le défaut d'origine (colonne étroite sur écran large), mais laisse **toute la famille « texte écrasé en filet » non surveillée en mobile**, c'est-à-dire là où elle est la plus probable, puisque c'est là que les mises en page basculent de `table` à `block`. | Le seuil de 1 100 px protège d'un faux positif précis ; le supprimer serait excessif. Proposition : une **variante mobile de L2** qui ne mesure pas une mesure de lecture mais un **rapport d'aspect anormal** — un bloc de texte dont la largeur est inférieure à ~25 % de celle de son conteneur *alors que son contenu passe à la ligne à chaque mot* est un défaut à toute largeur. Et retirer `caption` de l'exclusion `closest('table')`, qui vise les cellules, pas la légende. |

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-11 | majeur | **`run-oracles.mjs` écrit ses journaux DANS l'arbre de livraison tout en annonçant l'inverse.** Le code calcule `const dossierSidecars = fs.statSync(target).isFile() ? path.dirname(target) : target;` puis `const horsLivraison = sousLivraison(target) ? path.join(dossierSidecars, '_oracles') : null;`. Pour une cible `output/v2-architecture-cible/rapport/livrable.html`, cela donne **`output/v2-architecture-cible/rapport/_oracles/`** — un dossier frère du livrable, **à l'intérieur** du dossier que le client reçoit. La variable s'appelle pourtant `horsLivraison`, et la ligne 221 imprime « journaux d'oracles écrits **HORS livraison** (TF-0428) ». Le commentaire d'intention est explicite et n'est pas tenu : « sous un arbre de LIVRAISON, aucun journal à côté du livrable — ce que le client reçoit ne contient pas les traces de son audit ». **Divergence avec le précédent qu'il cite** : `render_page.py` (TF-0230), invoqué comme « même doctrine », écrit lui dans un **dossier temporaire nommé** hors de l'arbre. Mesuré : deux exécutions cette passe, deux fois `_oracles/` créé dans le dossier de livraison, **supprimé à la main** les deux fois. **Et le phénomène n'est pas limité aux lancements manuels** : l'écriture de *ce lot de retours* a fait apparaître `output/v2-architecture-cible/retours/_oracles/` avec trois fichiers (`.oracles.json`, `-historique.jsonl`, `-cache.json`) horodatés à la seconde de l'écriture, alors qu'aucun oracle n'avait été lancé sur ce fichier — c'est le **hook d'écriture** qui les dépose. Le dossier se recrée donc **à chaque écriture surveillée**, et le supprimer avant remise ne suffit pas : la remise elle-même le fait revenir. Le correctif TF-0428 traite la cible du reproche (« pas de sidecar collé au fichier ») mais pas son motif (« pas de trace d'audit dans ce que le client reçoit »). | Reprendre la règle de `render_page.py` : sous un segment de livraison, écrire dans un dossier temporaire nommé, pas dans un sous-dossier du livrable. Et **faire porter au message ce que le code fait réellement** — un message qui affirme « HORS livraison » alors que le chemin est dans `output/` empêche de voir le problème, puisqu'il répond d'avance à la question qu'on se poserait. Test de bout en bout possible : lancer sur une cible sous `output/`, vérifier qu'aucun fichier n'y est créé. |

## Confirmations positives

- **RA-6 est corrigé, et c'était le bloquant de l'écosystème.** Le lanceur imprime maintenant
  son bilan et **retourne 0 sur un verdict PASS** (mesuré : `✅ CONFORME — 14 PASS, 3 SKIP,
  0 échec`, `echo $?` → `0`). Le hook d'écriture ne bloque plus. La variable est déclarée
  `JSONOUT` et la ligne 221 l'utilise correctement. **Aucun contournement n'a été nécessaire
  cette passe** — contre deux écritures refusées à la passe précédente.
- **La règle L4 sur les filtres a fait exactement son travail.** L'ajout d'une ligne au tableau
  des écarts l'a porté à huit lignes : échec bloquant immédiat, message clair désignant le
  sélecteur exact. L'exemption `data-filterable="off"` + motif a permis de déclarer le cas au
  lieu de le contourner — c'est le comportement recherché, et il a fonctionné du premier coup.
- **`render_page --etats-ouverts` reste l'outil le plus rentable de la chaîne.** Il a validé
  122 lignes dépliées et les panneaux de filtre ouverts, états que le rendu par défaut ne
  montre jamais.
- **Non re-testé, à signaler comme tel** : RA-7 et RA-8 (analyse du JavaScript et du CSS par
  `oracle-claims`) n'ont **pas** été re-vérifiés cette passe — les contournements posés au
  20/08 (fonctions de remplacement au lieu de `$1`, couleurs en `rgb()`) sont toujours en
  place dans le livrable, donc leur absence d'échec ne prouve rien.

## Ordre recommandé

1. **RD-20** — une ligne de CSS dans l'extrait §6, plus la décision sur laquelle des deux
   implémentations fait foi. Coût quasi nul, défaut présent sur tout livrable qui copie
   l'extrait de référence.
2. **RA-11** — le message trompeur est plus coûteux que le mauvais chemin : il empêche de
   voir le problème. À traiter même si le déplacement du dossier attend.
3. **RD-21** — le plus structurant des trois : il ouvre une famille de défauts que la chaîne
   ne surveille pas du tout en mobile. À cadrer avant d'implémenter.
