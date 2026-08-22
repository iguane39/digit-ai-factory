# Retours forges — digit-ai-fr — 20260822a

- **Contexte** : audit d'exhaustivité de la traduction anglaise du site en production
  (201 pages FR / 201 pages EN, 22/08/2026), hors run — le produit n'a jamais été passé à la
  factory (aucun `forge/` avant ce lot, aucun rapport forge-tests le référençant).
- **Références ledger** : sans objet — produit legacy sans ledger. Le présent lot **est** la
  trace.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le constat qui tient les autres

Le pan `i18n` a **deux points d'observation** — le build servi (TF-0284) et le catalogue de
chaînes (TF-0383). Sur digit-ai.fr, **aucun des deux ne s'applique** :

| Point d'observation | Sur digit-ai.fr | Décision qui l'écarte |
|---|---|---|
| **build servi** — parité de routes, parité de menus, langue du contenu | `next.config.ts` porte `output: "standalone"` : aucune arborescence de pages sur le disque | **hors champ**, décision explicite de TF-0405 |
| **catalogue de chaînes** — complétude, paramètres, constance des libellés | aucun catalogue : les locales sont des **composants dupliqués** (`Footer.tsx` / `FooterEn.tsx`, `Header.tsx` / `HeaderEn.tsx`) | rien à lire — `catalogue_i18n.py` ne trouve pas de source |

Le pan sortirait donc en NA/SKIP sur ce produit, pendant que **quatre défauts réels** vivent en
production sur 201 pages. Et le produit en question est **celui sur lequel le pan a été conçu** :
l'étude fondatrice du 15/08 (« une route sur 201, un menu à 4 entrées contre 9, 9 pages sur 200 »)
a été faite ici.

Le mécanisme est nommable et se reproduira ailleurs : **les deux points d'observation ont été
calibrés chacun sur un produit différent** — le build sur digit-ai.fr, le catalogue sur Approval
(TF-0383 : « le pan est structurellement aveugle à cette forme — qui est la forme dominante du
parc ») — **et chacun a déclaré hors champ ce que l'autre était censé couvrir**. TF-0405 avait
raison de trancher que le SSR sort de l'analyse statique ; ce que la décision n'a pas vérifié,
c'est qu'un produit puisse n'avoir **ni l'un ni l'autre**. La charge a été transférée en silence
sur un point d'observation dont l'existence n'est pas garantie.

Le levier est déjà nommé dans TF-0405 : `FORGE_TESTS_BASE_URL`, le crawl du site servi, « à
défaut ». Pour une architecture à composants dupliqués, ce n'est pas un défaut : c'est le **seul**
point d'observation qui existe.

## digit-ai-forge-tests (`digit-ai-forge-tests`)

Les quatre défauts ci-dessous ont été trouvés à la main en une heure sur le site en production,
et **les quatre sont scriptables sans le moindre modèle de langage** — comme les trois de l'étude
fondatrice. Ils forment, ensemble, le jeu de contrôles qui manque au troisième point
d'observation.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | **bloquant** | générique | **Un produit peut échapper aux deux points d'observation du pan.** `output: "standalone"` (hors champ TF-0405) + aucun catalogue de chaînes (rien à lire pour TF-0383) = NA/SKIP, sur le produit même qui a fondu le pan. Preuve : `Digit-ai.fr/site/next.config.ts:4` et l'absence de `src/i18n`, `src/locales`, `messages/` — les locales sont `Footer.tsx`/`FooterEn.tsx`, `Header.tsx`/`HeaderEn.tsx`. Quatre défauts réels en production pendant ce silence. | Implémenter le levier déjà nommé par TF-0405 (`FORGE_TESTS_BASE_URL`, crawl des liens) comme **troisième point d'observation**, et non « à défaut ». Et surtout : faire dire au pan, quand **aucun** point ne s'applique, qu'il n'a **rien mesuré** — un NA qui ne distingue pas « pas multilingue » de « multilingue non observable » est un vert non mérité. |
| RT-2 | **bloquant** | générique | **La navigation est extraite sur la balise `<nav>` : un repère qui n'en est pas est invisible des DEUX côtés, et 21 liens contre 3 se compare 0 contre 0 — PASS.** Preuve : `i18n.py:187` (`if tag == "nav": self._dans_menu += 1`) ; `Digit-ai.fr/site/src/components/layout/Footer.tsx:36` et `FooterEn.tsx:7` sont des `<footer>` sans `<nav>` ; pied FR = 21 liens (services, solutions, à-propos, réalisations, LinkedIn, courriel), pied EN = 3. Le garde-fou `muettes` (`i18n.py:720`) ne se déclenche que si une locale a **zéro** entrée : l'en-tête étant un `<nav>`, la navigation passe pour « vue ». | Étendre l'extraction au repère `contentinfo`/`<footer>`, ou plus généralement à tout lien du **chrome partagé** (présent sur ≥ 90 % des pages d'une locale). Et déclarer en `non_juge` les repères où rien n'a été trouvé : le pan tient déjà cette doctrine pour les lexiques (« aucun anglais détecté » et « la langue n'a été mesurée contre aucun lexique » ne sont pas le même rapport) — elle vaut mot pour mot ici. |
| RT-3 | **majeur** | générique | **La densité de mots-outils est structurellement aveugle à un libellé court codé en dur.** « Réponse courte » s'affiche en français sur **36 pages anglaises** : 2 mots sur ~1 200, soit 0,17 % contre un seuil à 8 %. Preuve : `src/components/ui/GeoShortAnswer.tsx:12`, titre en dur dans un composant partagé par les deux locales. Le pan sait que la densité est du bruit **sous** 40 mots ; le cas symétrique — un îlot français dans une grande page anglaise — n'a aucun contrôle. TF-0383 couvre ce défaut **via le catalogue**, donc pas ici : sans catalogue, l'îlot est indétectable. | Ajouter un **lexique de chaînes littérales interdites** par locale, indépendant de la densité : la *présence* de la chaîne est le constat, pas sa fréquence. Source des chaînes : le catalogue de la locale par défaut quand il existe (déjà lu depuis TF-0383), sinon une liste déclarable par le projet. |
| RT-4 | **majeur** | générique | **Le pan ne lit que le texte visible ; métadonnées et données structurées ne sont jamais examinées.** **78 articles anglais sur 131** portent des `<meta property="article:tag">` et des `keywords` JSON-LD en français — 67 tags distincts (« Automatisation », « Souveraineté », « Productivité », « Conformité »). C'est exactement ce que consomment moteurs et aperçus sociaux : une page traduite dont les mots-clés sont dans l'autre langue est un défaut de référencement, mesurable sans rendu. | Étendre le contrôle de langue à `<title>`, `meta[name=description]`, `og:*`, `article:tag`, et aux `keywords`/`articleSection` du JSON-LD. Avec un constat **distinct** pour « identique octet pour octet à la locale par défaut » et pour « lexique étranger détecté » : le premier dit *non traduit*, le second dit *mal traduit*, et le lecteur n'en fait pas la même chose. |
| RT-5 | mineur | générique | **La renonciation à l'attribut `lang` a été étendue à un second cas, non examiné.** Le pan a raison de ne jamais opposer `lang` au contenu (« le croire reviendrait à interroger le suspect ») — mais un fragment **délibérément** étranger doit, lui, porter `lang` : WCAG 2.2 critère 3.1.2, Langue d'un passage. Preuve : les 201 pages anglaises portent `aria-label="Voir cette page en français"` sans `lang="fr"`, et `/en/blog` affiche « Voir tous les articles en français » de même. Un lecteur d'écran les prononce avec la phonétique anglaise. | Le contrôle vient **gratuitement** avec RT-3 : une chaîne du lexique étranger trouvée sur une page est soit non traduite (RT-3), soit non signalée (RT-5) — la présence d'un ancêtre portant `lang=` tranche mécaniquement entre les deux. Un seul balayage, deux constats distincts. |

## Remarques restées au produit

**Généralisable — retenu, c'est RT-3 et RT-5.** Le défaut « libellé français en dur dans un
composant partagé entre locales » n'est pas propre à ce produit : il naît de l'architecture à
composants dupliqués, où rien ne force à traiter une chaîne comme traduisible. Il est remonté.

**Généralisable — retenu, c'est RT-2.** Le pied de page amputé porte une leçon qui dépasse
l'i18n : **une méthode statistique ne voit que ce qui varie.** Le pied était identique sur les
201 pages anglaises ; toute analyse de la forme « quelles pages sont suspectes ? » y est aveugle
par construction. Il n'est apparu qu'en comparant chaque page anglaise **à sa source française**
— l'appariement, pas l'anomalie. Le pan compare déjà les locales entre elles sur les routes et
les menus ; l'extension naturelle est de le faire **champ par champ** sur la paire.

**Resté au produit, non généralisable.** Le contenu des tags eux-mêmes (choisir « Quotes » pour
« Devis ») est un arbitrage éditorial du produit. La forge doit dire *qu'ils sont en français*,
pas *ce qu'ils devraient devenir* — cohérent avec la limite que TF-0383 a déjà posée : la
justesse d'une traduction n'est pas décidable par script.

**Resté au produit, et c'est une erreur de spécification de ma part, pas de la forge.** Le brief
de traduction que j'ai donné disait « conserver le même slug, la même date et les mêmes tags » —
une consigne qui **gèle du contenu non traduit**. Une spécification de traduction doit énumérer
les champs à traduire un par un, et déclarer explicitement ceux qui ne le sont pas. La classe de
défaut est réelle mais elle vise un gabarit de brief, pas un oracle : elle est notée ici et ne
donne pas de candidature.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque** pour ce lot, hormis le présent
fichier (`gabarits\RETOURS-FORGES.md`) — dont une seule chose a gêné, mineure : le gabarit prévoit
« Références ledger » comme champ, sans cas prévu pour un **produit sans ledger**. Un produit
legacy qui remonte un retour n'a ni run ni seq à citer, et laisser le champ vide se lit comme un
oubli. Renseigné ici en « sans objet » avec son motif ; le gabarit gagnerait à prévoir la mention.
