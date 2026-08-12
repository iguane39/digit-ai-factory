# Profils produit — doctrine en 10 lignes

1. Un profil est un **référentiel versionné** (frontmatter `version` + `challenge_date` +
   `sources` datées), **jamais une forge** — loi transverse n° 4, R-28 (`REGLES-PROJET.md` §H).
2. Il ne porte aucun verbe outillé nouveau : il **qualifie** un entrant déjà couvert par les
   forges existantes (design, development, tests, seo) et pointe leurs oracles gratuits.
3. Sept profils à ce jour, un seul axe « type de produit » : `website.md`, `webapp.md`,
   `mobile.md` (vague 1, étude `output\20260812-etude-opportunite-forges.md` §0) puis
   `api-headless.md`, `e-commerce.md`, `extension-navigateur.md`, `desktop.md` (vague 2,
   mandat humain du 12/08 soir, TF-0126, anticipant leur premier brief — §5 de l'étude) —
   pas sept métiers, sept qualifications d'un même axe.
4. Chaque profil sépare : (a) standards vérifiables machine (norme · seuil · oracle gratuit),
   (b) savoir périssable daté-sourcé, (c) mapping de consommation par forge.
5. Un run consomme un profil à l'étape ACCUEIL (routage de l'intention, §4 de
   `references\ACCUEIL.md`), puis chaque étape lit sa ligne de mapping (§3 du profil).
6. Le profil n'exécute rien : il **active** des règles et seuils déjà outillés ailleurs
   (design, tests, seo) — aucune duplication d'oracle.
7. Fraîcheur = les `sources` datées en frontmatter, pas une confiance implicite : une source
   dépassée (échéance passée, version supplantée) rend la ligne concernée à re-challenger.
8. Mise à jour = **nouvelle `version`** (SemVer) + `challenge_date` rafraîchie + sources
   revérifiées — jamais une édition silencieuse d'un fait daté.
9. Un doute sur une valeur chiffrée/datée se vérifie (web ou dépôt source) avant d'entrer
   dans un profil ; une valeur non vérifiable se marque comme telle, jamais affirmée.
10. Le mobile natif porte une **clause de réveil** (voir `mobile.md`) : trou réel documenté,
    forge dédiée écartée faute de produit à exercer — réévaluation au premier brief mobile natif.

## Inventaire des profils actifs (7)

`website.md` · `webapp.md` · `mobile.md` · `api-headless.md` · `e-commerce.md` ·
`extension-navigateur.md` · `desktop.md`

## Liste d'attente (candidats non créés)

| Candidat | Statut | Vigilance |
|---|---|---|
| chatbot / agent conversationnel | reste « au premier brief » (étude §5, 12/08/2026) — non créé dans la vague 2 | le contrat de canal relèverait d'un profil, mais **évaluer la qualité d'une conversation est un verbe nouveau** (candidat forge, critère R-28) — ne jamais l'anticiper dans un profil sans produit à exercer |
