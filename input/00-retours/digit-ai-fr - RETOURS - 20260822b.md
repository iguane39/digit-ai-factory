# Retours forges — digit-ai-fr — 20260822b

- **Contexte** : suites de l'audit de traduction du 22/08 (lot `20260822a`, devenu TF-0463 à
  TF-0467, tous corrigés le jour même). Deux constats qui ne relèvent pas de l'i18n mais que
  l'audit a mis au jour : ce qui juge une interface RENDUE, et ce qui s'est passé pendant
  l'ingestion du lot précédent.
- **Références ledger** : sans objet — produit legacy sans ledger (même motif qu'au lot `a`).
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## digit-ai-forge-tests (`digit-ai-forge-tests`)

Le lot `a` a fermé les trous de la parité entre locales. Celui-ci porte sur la couche
d'en dessous : ce qu'une page **rendue** montre, et que rien ne regarde sur un produit servi.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-6 | **bloquant** | générique | **Le plancher visuel existe, est bon, et n'est pas atteignable sur un produit servi.** `render_page.py` juge V1 débordement horizontal, V2 contraste WCAG, V4 chevauchements entre frères — tous bloquants, tous déterministes. Mais sa signature est `render_page.py <page.html>` : **un fichier HTML local**, et il vit dans un *skill* de forge-agents (`.claude/skills/digit-ai-page-html/scripts/`) dédié à la production de pages autonomes. On ne peut le pointer ni sur une application servie (Next.js, FastAPI SSR), ni sur un jeu de routes, ni sur une paire de locales. LES TROIS AUTRES PORTES SONT FERMÉES, chacune pour une raison valable : (1) `oracle-mobile.mjs` de forge-design déclare que « ce qui exige un rendu réel (taille effective après cascade, gestes, **débordements au breakpoint**) est déclaré non jugé et **délégué à render_page.py** » — une délégation vers un outil qui ne sait pas lire un site servi ; (2) le pan `visuel` de forge-tests est un pan de **non-régression sur goldens** — sa propre doctrine dit « un golden absent produit un SKIP motivé », donc il ne peut rien dire au premier regard, et un golden accepté après coup **entérine** un défaut déjà présent ; (3) le pan `accessibilite` juge des règles axe-core, pas une mise en page. PREUVE DU COÛT : sur digit-ai.fr, un en-tête compressé et un menu anglais au tiers de la largeur ont vécu de juin à août 2026, à travers deux « retests complets » qui étaient des crawls HTTP 200 et des greps. Aucun de ces contrôles ne pouvait les voir. | Rendre le plancher V1/V2/V4 opposable à un **jeu de routes servi**, sur le modèle de ce que le pan `accessibilite` fait déjà avec `FORGE_TESTS_BASE_URL` : forge-tests embarque déjà Playwright et sait relever les routes depuis la racine servie. Aucun golden requis — V1, V2 et V4 sont des **absolus**, pas des comparaisons à une référence : c'est précisément ce qui les rend utilisables au premier run, là où le pan `visuel` ne le peut pas. Les deux pans sont complémentaires et ne se remplacent pas. |

## digit-ai-factory (`pilot`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | **majeur** | générique | **Le préflight anti-collision de TF-0394 est un contrôle à fenêtre, et il a re-cédé le jour même de sa mise en service.** Le correctif compare `HEAD..origin/main` **avant** de frapper les ids et refuse si le distant a avancé. C'est un *check-then-act* : il détecte une divergence **déjà publiée**, pas deux sessions qui frappent **simultanément** avant que l'une ait poussé. PREUVE, première main, 22/08 : l'ingestion du lot `digit-ai-fr - 20260822a` (empreinte `8bbe4190e51d`) a affiché `[OK]` **sans aucun avertissement de préflight** — donc origin n'était pas en avance à cet instant — et m'a rendu les ids **TF-0457 à TF-0461**. Ces cinq ids portent aujourd'hui les items d'une **autre session** (règles S11-S14 d'oracle-synthese, gabarit TODO-PRODUIT), et mes cinq candidatures ont fini en **TF-0463 à TF-0467**. Trois commits du jour portent la trace du rattrapage : « alignement sur une session parallèle » (`2baf24a`), « alignement sur le travail publié en parallèle » (`d53cfe0`), « après l'alignement sur les deux sessions parallèles » (`b6090df`). Aucun item postérieur à TF-0394 ne traite cette fenêtre. | Trois voies, de la moins à la plus coûteuse. (a) **Frapper les ids au push et non à l'ingestion** : le sidecar entre sans numéro, le numéro se pose au moment où le registre est publié — la fenêtre disparaît au lieu d'être surveillée. (b) **Réserver un bloc atomiquement sur origin** avant de frapper (une ligne `reservation` poussée d'abord, en échec si rejetée). (c) **Rendre l'id non séquentiel** — `TF-<session>-<n>` — ce qui supprime la collision mais coûte la lisibilité d'un compteur unique, sans doute trop cher. À noter : le refus actuel reste **utile** et doit rester ; le constat porte sur ce qu'il ne peut pas couvrir, pas sur ce qu'il fait. |

## Remarques restées au produit

**Généralisable — retenu, c'est RT-6.** La leçon dépasse le visuel : un **crawl HTTP qui rend
200 et des greps qui trouvent leurs chaînes ne testent pas une expérience**. Les deux fois où
j'ai déclaré digit-ai.fr « retesté complètement », j'avais mesuré la disponibilité et la
présence de mots, jamais ce que l'écran montrait. La correction côté produit a été une
discipline personnelle (regarder des captures aux breakpoints avant de pousser) ; la
généralisation est de rendre cette vérification **opposable par un oracle**, sans quoi elle
dépend de la vigilance de l'opérateur — c'est-à-dire de rien.

**Généralisable — retenu, c'est RP-1.** Le mécanisme « je vérifie que personne n'a bougé, puis
j'écris » se retrouvera partout où un écrivain unique n'est unique que par session. Le remonter
sur le registre TF le remonte pour cette famille entière.

**Resté au produit, non généralisable.** Trois tags du corpus anglais portaient du mojibake
(`RÃ©glementation`, `ConformitÃ©`, `IntÃ©gration`) : un défaut d'encodage dans mes propres
fichiers de traduction, corrigé au dictionnaire. Rien n'indique que l'outillage de la forge y
soit pour quelque chose, et je ne remonte pas un soupçon comme un constat.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque** pour ce lot, hormis le présent
fichier (`gabarits\RETOURS-FORGES.md`). La remarque déjà faite au lot `20260822a` tient et n'est
pas redoublée ici : le gabarit ne prévoit pas le cas d'un **produit sans ledger**, dont le champ
« Références ledger » n'a ni run ni seq à citer. Renseigné en « sans objet » avec son motif.
