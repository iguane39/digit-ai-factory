# Lot de retours — Produit-64 → digit-ai-factory, digit-ai-page-html — 2026-09-24, indice e

**Émetteur** : produit `Produit-64` · **Cibles** : le pilot `digit-ai-factory` (bibliothèque
de gabarits de documents, règles projet) et le socle `digit-ai-page-html` · **Origine** : la demande
du porteur du 24/09/2026 de hisser le guide développeur en gabarit de la Factory, entier ou composant
par composant, et d'en faire une règle.

Ce lot porte **5 retours** et la **première déclaration de la section « Documents mûrs »** (R-57,
née de ce lot même : la section n'est due qu'à partir du 25/09, elle est portée ici volontairement).

- **Contexte** : demande du porteur du 24/09/2026, mot pour mot : « Le format du guide du développeur
  et l'usage des composants utilisés, comme la recherche, les onglets, les menus sur le côté, la
  popup pour les fichiers MD, les chapitres, sous-chapitres sont vraiment tops. Enregistre ce
  document en gabarit pour la Factory afin de pouvoir être réutilisé entier ou en partie (composant
  par composant) dans de prochains documents. Crées en également une règle pour la Factory afin que
  les documents matures comme celui-ci remonte automatiquement en gabarit à la Factory, pour être
  réutilisé entièrement ou en partie. » Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-24** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.
- **Travail livré** : la branche `gabarit/guide-de-reference` du pilot, commit `8fc9115`, posé sur
  `main` à `19822ac` — **fusion en avance rapide possible**, **non fusionnée et non poussée**. Une
  session pilote travaillait dans le même arbre à la même heure (fichiers modifiés à 18:56) : la
  branche a été construite dans un arbre de travail séparé, puis rebasée sur les commits que cette
  session a publiés entre-temps ; ses 31 fichiers ne recouvrent que le juge des lots, résolu à la
  main (LOT-DATE du pilote conservé, version portée à 1.4.0).


> **Note de réception du pilot, 25/09/2026.** Le producteur a numéroté RT-22 le retour sur la branche
> `gabarit/guide-de-reference`. Le pilot avait donné ce numéro, le 24/09, au retour de son lot
> `Produit-64 - RETOURS - 20260924d`, dont le RT-21 reprenait un identifiant du lot du 22/09 ; ce lot
> est ingéré, donc immuable (R-49). Le RT-22 de ce lot-ci devient RT-25, premier numéro libre ; RT-23,
> RT-24, RD-26 et RD-27 gardent le leur. L'accueil a relevé 2 formes « Prénom NOM » : « Propositions
> ADR » et « Contraintes ADR » ne désignent pas des personnes. Le reste du texte est celui du producteur.

---

## digit-ai-factory (`digit-ai-factory`)

Le guide est remonté en famille de la bibliothèque, et la règle qui fera remonter les suivants est
écrite et câblée. Tout est sur une branche : il reste à l'intégrer.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-25 | majeur | générique | Branche `gabarit/guide-de-reference` (commit `8fc9115`, sur `main` à `19822ac`) prête à fusionner : **famille `gd-guide-de-reference` v1.0.0** — générateur Markdown → HTML à N vues, 8 composants posables un à un (`--poser`, `--constat`), squelette et instance fictive générés, sonde d'interactions — et **règle R-57** câblée aux deux bouts (consigne de `hook-lexique`, règles `R-57` et `LOT-MURS` d'`oracle-lot-retours` 1.4.0, classe `document-mur-non-remonte`). Verdicts exécutés sur le commit : oracle de la bibliothèque PASS sur le parc (G1-G5, G7, G10, G11 verts sur la famille, 0 FAIL), auto-test 39/39 ; recette des lots 44/44 ; lexique 30/30 et 8/8 ; juge des règles PASS (57 déclarées) ; `check_html`, `render_page` et forge-design verts sur les deux pages et chacune de leurs vues ; sonde 21/21 et 20/20 ; agrégateur `self-tests.mjs` 156/159, les 3 défauts (`oracle-skills`, `oracle-empreintes`, `oracle-readme-dossiers`, parc réel) rejoués À L'IDENTIQUE sur un arbre vierge de `bb589ea` | fusionner (`git merge --ff-only gabarit/guide-de-reference`, ou `--no-ff` si `main` a bougé), rejouer `node oracles\self-tests.mjs`, puis laisser l'héritage R-47 recopier chez les produits le juge des lots 1.4.0, le gabarit de lot et le registre des classes |
| RT-23 | majeur | générique | Le garde de pré-enregistrement `scripts/pre-commit-index-livrables.mjs` (TF-1325) **VIDE `output\LISEZMOI.md` quand on committe depuis un arbre de travail LIÉ** (`git worktree`) : git exporte `GIT_DIR` aux crochets d'un worktree lié, et `suivis()` de `generer-lisezmoi-output.mjs` lance `git -C <output> ls-files` sous cette variable — les chemins rendus ne correspondent plus, **aucun livrable n'est « suivi »**, l'index passe de 410 livrables à 0 et le garde le ré-indexe dans le commit. Reproduit hors commit le 24/09 : sans variable 410 livrables, `GIT_INDEX_FILE` seule 410, `GIT_DIR` seule **0**, les deux **0**. Le même commit refait dans un clone ordinaire rend l'index intact | dans `suivis()`, retirer `GIT_DIR` et `GIT_WORK_TREE` de l'environnement du `git` lancé (ou lister depuis la racine du dépôt avec `--full-name` et filtrer sur le préfixe `output/`) ; fixture rouge : un worktree lié, un commit, un index qui garde ses livrables |
| RT-24 | mineur | générique | `oracle-empreintes` ne voit pas un site de scellement rangé SOUS la bibliothèque : le générateur d'une famille (`gabarits/documents/<famille>/generateur/`, nouveauté du 24/09) hache ses composants, et le déclarer dans `references\EMPREINTES.md` le fait accuser « site DÉCLARÉ qui ne hache plus ou n'existe plus » — la déclaration a été retirée pour ne pas rougir le parc. Le site reste invisible, alors que la doctrine dit « déclaré plutôt que promis » | étendre le balayage d'`oracle-empreintes` à `gabarits/documents/*/generateur/` (et plus largement aux générateurs de famille), puis déclarer le site du générateur de `gd-guide-de-reference` |

### RT-25 — La famille `gd-guide-de-reference` et la règle R-57, sur une branche à intégrer

**Ce que la branche porte.**

- `gabarits/documents/guide-de-reference/` : `GABARIT.md` (doctrine, lecteur, frontière
  lecteur/auteur, anatomie d'un chapitre, oracles), `COMPOSANTS.md` (le catalogue des composants à
  la carte), `composants/` (13 fichiers : jetons, coquille multi-vues, menu latéral des chapitres,
  hiérarchie chapitres et pas, recherche et ses résultats, fenêtre modale à onglets, tableaux,
  bascule de thème), `generateur/construire-guide.py` et `generateur/sonde-interactions.py`,
  `SQUELETTE.md` → `SQUELETTE.html`, `INSTANCE.md` → `INSTANCE.html` ;
- une ligne au catalogue (`statut: ok`, `point_de_depart: generateur`, section obligatoire
  « Les composants — entiers ou à la carte ») et la bibliothèque recomptée (40 familles) ;
- R-57 dans `REGLES-PROJET.md` (section AL), la section « Documents mûrs » dans
  `gabarits/RETOURS-FORGES.md`, les règles `R-57` et `LOT-MURS` dans `gabarits/oracle-lot-retours.mjs`,
  la consigne R-57 dans `oracles/hook-lexique.mjs`, la classe `document-mur-non-remonte`, et les
  trois cliquets de recettes relevés dans `oracles/baseline-recettes.json` (44, 30, 8 cas).

**Réemploi « composant par composant », prouvé.** Trois composants posés seuls dans une page vierge
(`--poser … --composants jetons.css,modale.css,modale.js`) : `--constat` rend 3 blocs, 0 écart ; une
copie altérée d'un seul mot : 1 écart, sortie 1 ; la même page extraite en CRLF : 0 écart.

**RT-23, et pourquoi le commit a été refait ailleurs.** Le premier commit, fait dans l'arbre de
travail lié, embarquait un `output\LISEZMOI.md` vidé de ses 410 livrables et trois index d'entrée
réécrits d'après ce disque isolé (sas d'arrivée absent, fichiers non suivis du poste absents). Le
garde n'a PAS été contourné : le commit a été refait dans un clone ordinaire, garde installé par
`node scripts\verifier-hooks-git.mjs --installer` (H1-H2 PASS), l'état du poste reproduit par des
témoins non committés — et le commit final ne touche plus AUCUN index.

**Ce que l'extraction a appris, et que le guide d'origine porte encore** — trois défauts qu'aucun
oracle du socle ne signalait sur le guide, levés sur le gabarit :

- le rail de chapitre peint en `::before` dégradé rendait le contraste de tout le chapitre non
  mesurable : **440** éléments « à vérifier à l'œil » sur l'instance, **4** après l'avoir sorti en
  élément frère (RD-27) ;
- la recherche remettait des filtres de tableau sans écouteurs (RAF-084 du produit, RD-17) : fermé
  dans le composant de recherche par un relevé brut pris avant tout câblage, prouvé par la sonde ;
- le poseur du socle, appelé par un chemin de jonction, ne posait rien et sortait 0 (RD-26) : le
  générateur compte désormais les blocs posés et refuse de livrer sans eux.

**Ce que la branche ne fait PAS.** Elle ne pousse rien (R-38) et ne touche pas au noyau `CLAUDE.md`.
Elle n'écrit pas dans `todo/TODO.jsonl`, que la session pilote avait en cours : les candidatures
entrent par CE lot. Elle ne hisse pas les composants au socle : R-57 les y fait monter quand une
seconde famille les emploiera.

## digit-ai-page-html (`digit-ai-page-html`)

Deux défauts du socle, trouvés en extrayant les composants, et un complément à un retour déjà remis.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-26 | majeur | générique | `embarquer-composants.mjs --poser <page> --composants …`, appelé par un chemin qui traverse une **jonction de répertoire** (ici `C:\Users\<poste>\.claude-b\skills`, jonction vers `.claude\skills`, le profil VS Code du poste chargeant `.claude-b`), **ne pose rien et sort 0**, sans un mot. Cause lue : la garde de point d'entrée compare `import.meta.url` (chemin résolu) à `process.argv[1]` (chemin de la jonction) ; elles diffèrent, `main()` ne s'exécute pas. Mesuré le 24/09 : 0 bloc posé par ce chemin, 4 posés par le chemin résolu, même commande | résoudre les deux côtés avant de comparer (`realpathSync`) ; et, au `--poser`, sortir NON nul si aucun bloc n'a été posé. Fixture rouge : appeler le poseur par une jonction ou un lien symbolique vers le skill, verte si les blocs sont posés |
| RD-27 | mineur | générique | Un décor peint en `::before` **dégradé** sur l'ANCÊTRE du texte rend le contraste de tout ce texte « NON MESURABLE » pour la sonde de `render_page.py` : **440** éléments « à vérifier à l'œil » sur une page de guide, **4** après avoir sorti le même rail dans un élément frère. La sonde a raison de le dire (TF-0582) ; ce qui manque, c'est la règle d'auteur qui évite de l'aveugler | écrire dans `references/composants.md` qu'un décor se peint sur un élément FRÈRE du texte, jamais sur son ancêtre ; ou faire mesurer à la sonde le fond sous la boîte du texte quand le `::before` ne la recouvre pas |
| complément à RD-17 | — | — | RD-17 (lot `20260923a`) : la recherche du socle remet à chaque frappe un relevé pris APRÈS le câblage des autres composants, et les filtres meurent. Voie prouvée le 24/09 : relevé brut pris au chargement, avant tout câblage (mode `getHTML` de `find-in-page.js`), puis recâblage de la vue courante après chaque frappe — sonde navigateur 21/21, dont « après une recherche effacée, un filtre s'ouvre encore » | adopter la même voie dans le socle : `find-in-page.js` relève au premier `init`, et publie un événement après chaque réécriture pour que les composants se recâblent |

### RD-26 — Un poseur qui sort 0 sans rien poser

**Le fait.** Le générateur de la famille appelait le poseur par le chemin du skill tel que la
configuration du poste le donne (`CLAUDE_CONFIG_DIR` → `.claude-b\skills\digit-ai-page-html`). La
page sortait sans aucun composant du socle — recherche, filtres, lignes dépliables absents — et le
code de sortie était 0. Le même appel par `C:\Users\<poste>\.claude\skills\…` posait les 4 blocs.
`dir /AL` confirme la jonction ; `os.path.realpath` la résout.

**Pourquoi c'est un défaut du socle.** Toute porte qui s'appuie sur le code de sortie du poseur
croit la pose faite. Un produit ne peut pas le deviner : il a appelé la commande documentée.

**Ce que le produit a fait chez lui.** Le générateur de la famille résout le chemin avant l'appel et
compte les blocs posés ; une page sans eux n'est pas écrite.

### RD-27 — Un décor sur l'ancêtre du texte aveugle la sonde de contraste

**Le fait.** Sur l'instance du gabarit, rendue aux six largeurs, `render_page.py` publiait 440
lignes « contraste NON MESURABLE par styles calculés — ::before peint (linear-gradient(…)) » : tout
le texte des chapitres, parce que le rail de gouttière était un `.ch-corps::before`. Rail sorti en
`<div class="ch-rail">` frère du texte : 4 lignes restantes, qui sont des mesures de longueur de
ligne publiées. Le guide d'origine du produit porte le même rail, donc le même angle mort.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le guide du produit (`20260924f`) garde son rail de chapitre en `::before` dégradé : le contraste de ses chapitres n'est pas mesuré | non corrigée dans ce tour — adoption des composants de la famille par le générateur du produit, RAF-125 | oui | généralisable, donc **remonté** : RD-27, et la famille porte la forme corrigée |
| Le guide du produit garde RAF-084 (filtres morts après une recherche) | non corrigée dans ce tour — même adoption, RAF-125 | oui | généralisable, donc **remonté** : complément à RD-17, et le composant de recherche de la famille le ferme |
| Le générateur du produit reste la source du guide servi, et la famille a désormais le sien : deux générateurs pour une forme | non corrigée — RAF-125 dit d'adopter la famille (composants posés, générateur de la famille ou le sien réduit à la matière propre au client) | non | propre au produit : la famille ne peut pas porter les schémas, les fiches et le formulaire qui nomment le client |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le guide est la SOURCE de
la famille `gd-guide-de-reference`, il n'en est pas une instance.

## Documents mûrs

Première déclaration, portée volontairement par ce lot du 24/09 (R-57 n'est due qu'à partir du
25/09). Les huit documents d'`output\` qui comptent cinq versions datées ou plus
(`node forge\retours\oracle-lot.mjs --murs .`, une fois le juge 1.4.0 recopié), chacun avec son
verdict. Déclarés ici, ils n'ont pas à l'être de nouveau dans les lots suivants.

| Document (chemin chez le produit) | Versions | Oracles du dernier indice | Verdict humain cité | Composants | Verdict de remontée |
|---|---|---|---|---|---|
| `output\05-Kits\Client-A - Guide développeur POC-to-Prod - 20260924f.html` | 23 | `check_html` PASS 42 règles, `render_page` PASS, forge-design PASS 9/9 (RAF-111) | « Le format du guide du développeur et l'usage des composants utilisés […] sont vraiment tops », le 24/09/2026 | recherche et résultats, vues, menu latéral, fenêtre Markdown, chapitres et pas, tableaux, thème | **remonté** : famille `gd-guide-de-reference` 1.0.0 (RT-25) |
| `output\01-Referentiel-audit\Client-A - Modèle Rapport d'audit POC-to-Prod - 20260924c.html` | 17 | non rejoués dans ce tour | aucun | — | **reste au produit**, parce que sa forme est générée par `digit-ai-forge-audit` (`gd-rapport-audit`, porté ailleurs) : ses écarts remontent à cette forge, pas en famille neuve |
| `output\old\02-ADR-gouvernance\Client-A - Propositions ADR par domaine - 20260630a.html` | 16 | non rejoués | aucun | — | **reste au produit**, parce qu'il est supplanté par le catalogue ADR par domaine, déjà source de `gd-catalogue-adr` (à extraire) ; sa dernière version date du 30/06 |
| `output\03-Syntheses\Client-A - Schéma Process POC-to-Prod End-to-end - 20260708c.html` | 14 | non rejoués | aucun | — | **reste au produit**, parce que les schémas relèvent des canevas de `digit-ai-schemas` (`gd-schema-technique`, porté ailleurs) |
| `output\01-Referentiel-audit\Client-A - Référentiel POC-to-Prod - Audit - 20260821a.html` | 10 | non rejoués | aucun | — | **reste au produit**, parce que c'est l'application générée du produit d'audit `auditcore\`, déjà citée comme modèle d'un tenant par `gd-rapport-audit` |
| `output\07-Standards Client-A\Client-A - Compliance Pack - Format & Contenus des contraintes - 20260710b.html` | 10 | non rejoués | aucun | — | **reste au produit**, parce que sa forme est celle du compliance-pack que `digit-ai-forge-audit` assemble (`build-kit.mjs`) ; sa matière est le référentiel du client |
| `output\03-Syntheses\Client-A - Process Ingénierie POC-to-Prod - Consolidation et cible - 20260901a.html` | 7 | non rejoués | aucun | — | **déjà remonté** : première source de `gd-consolidation-process` (à extraire) — l'extraction reste à faire côté bibliothèque |
| `output\07-Standards Client-A\Client-A - Matrice Contraintes ADR Light-Complet - 20260708a.html` | 6 | non rejoués | aucun | — | **reste au produit**, parce que c'est une matrice de contenu propre au client, dont la forme — un tableau filtrable — est déjà celle du socle |

## Confirmations positives

- La **décision D11** (un document long = un fichier à N vues) et **G10** (frontière lecteur /
  auteur) ont tenu à l'extraction : la famille les porte sans aménagement, et G10 est vert sur sa
  doctrine.
- Le **mode `getHTML` de `find-in-page.js`** existait déjà dans le socle et suffit à fermer RD-17 :
  aucune réécriture du composant n'a été nécessaire.
- `oracle-regle-sans-juge` a vu R-57 **déclarée et nommée par un exécutable** dès son écriture (RJ1).

## Ordre recommandé

1. RT-25 — fusionner la branche : la règle ne joue qu'une fois dans `main`, et l'héritage R-47 ne
   recopie le juge 1.4.0 chez les produits qu'à ce moment.
2. RT-23 — tout commit fait depuis un worktree lié publie aujourd'hui un index des sorties vide.
3. RD-26 — un poseur qui se tait fausse toute porte qui s'appuie sur lui.
4. RT-24, RD-27, puis le complément à RD-17.

## La règle qui aurait évité le retour

- **RT-25** — classe `gabarit-famille-manquante` : le guide était un type de document qu'aucune
  famille ne couvrait. La classe propre à R-57, `document-mur-non-remonte`, est créée par la branche
  même ; elle servira aux lots suivants, une fois la branche fusionnée.
- **RT-23** — classe `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` : le générateur
  d'index interroge git depuis un chemin écrit en dur (`-C <output>`) alors que l'exécution réelle,
  sous crochet, en désigne un autre par une variable d'environnement (`GIT_DIR`).
- **RT-24** — classe `site-de-scellement-hors-table-d-empreintes` : un site de scellement né sous la
  bibliothèque, que la table ne peut pas déclarer sans être accusée.
- **RD-26** — classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` : l'appel documenté du poseur
  échoue sur un poste dont les skills sont atteints par une jonction, et il échoue en silence.
- **RD-27** — classe `preuve-produite-mais-illisible` : la sonde produit un verdict PASS sur une page
  dont elle n'a pas pu lire le contraste de la plupart des textes.
