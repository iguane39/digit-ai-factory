# INS-0001 — « le menu français est compressé et le menu anglais ne reprend pas tout »

**Produit** : produit-07 (site vitrine, produit **legacy** — hors doctrine forge).
**Déposé** : 15/08/2026, par l'humain, en une phrase + deux captures (1790×1454 et
1900×1536). **Réouverture** : 1 — le dépôt s'ouvre sur « ça ne va **toujours** pas », un
premier signalement ayant précédé la naissance de ce circuit. C'est la mesure fondatrice :
cible zéro, ce dossier vaut 1.
**Instruit** : 15/08/2026 par le pilot, **en lecture seule** — le produit est autonome et
une session y travaille ; aucun octet n'a été écrit chez lui.

---

## a — Reproduction, aux conditions réelles

| Ce qui est reproduit | Comment | Résultat |
|---|---|---|
| Structure des deux menus | lecture des sources `site/src/components/layout/` | **FR** : 8 entrées de premier niveau, 36 liens · **EN** : 8 entrées de premier niveau, 36 liens — **les deux menus sont identiques dans le dépôt** |
| Ce que sert la production | captures humaines du 15/08 | **FR** : les 8 entrées + « Prendre RDV » + pastille EN, « Nos Services » **chevauche le logo** à 1900 px · **EN** : **3 entrées** (Services, Blog, Contact) |
| Composant réellement utilisé par les pages EN | comptage sur les 36 `page.tsx` sous `src/app/en/` | **36/36 utilisent `HeaderEn`** — aucune page EN ne retombe sur l'en-tête français |

**Écart de reproduction déclaré** : le rendu en pixels n'a **pas** été rejoué (produit non
buildé sur ce poste, et le geste outillé de R-37 est en construction — TF-0286). La
reproduction est **structurelle et exacte** ; la preuve visuelle reste les captures du
dépôt. C'est une limite, elle est dite : elle sera levée au premier usage du CLI comparatif.

## b — Cause racine côté produit : deux défauts distincts, pas un

**1. Le menu anglais amputé n'est PAS dans le composant.** `HeaderEn.tsx` porte les
8 entrées de premier niveau et les 36 liens, en miroir exact du français, et les 36 pages
anglaises l'utilisent toutes. L'écart vit **entre la source et ce que la production sert** :
le déployé est antérieur à la source. C'est aussi ce qui explique le « toujours pas » —
un correctif a pu être fait sans jamais atteindre la production.

**2. Le menu français compressé a une cause datée et locale.** `Header.tsx:169-171` :
`{/* CTA Button + bascule de langue */}` puis `<LangSwitch to="en" />`, posé **à côté** du
bouton « Prendre RDV », en plus des 8 entrées de premier niveau. La barre ne tient plus la
largeur : c'est l'ajout de la pastille de langue du 15/08 qui a produit le chevauchement,
exactement le scénario que la règle R-37 décrit.

**3. Constat structurel qui explique les deux** : le produit n'a **ni git, ni `CLAUDE.md`,
ni `output/`, ni `forge/`** (vérifié). Aucun historique, donc aucune traçabilité de ce qui
est déployé ; aucun routage forge, donc aucune obligation de vérification. Le gate n'a pas
été retiré : il n'a jamais été posé.

## c — Gates en défaut : vérifiés, jamais présumés

| Défaut | Quel contrôle aurait dû voir | Pourquoi il n'a pas vu | Preuve |
|---|---|---|---|
| Liens fautifs dans les composants (logo EN, Contact header/footer, bascule) | pan **interface** de forge-tests | **inexistant** sur ce périmètre — les composants `.jsx/.tsx` sont déclarés hors analyse | `README.md:415` de forge-tests : « les composants de framework (.jsx, .tsx, .vue, .svelte) ne sont pas analysés comme gabarits » |
| Menu EN amputé, routes non traduites | un oracle **i18n** | **inexistant** — aucun oracle de l'écosystème ne juge le multilingue | balayage de non-recouvrement, étude 20260815f §2 |
| Compression du menu FR après l'ajout | rendu en **pixels** (étape 5 bis, `render_page`) | **jamais joué** — les gates de rendu vivent dans un run ; le correctif du 15/08 n'en était pas un, et le produit legacy n'a pas de routage forge | absence de `CLAUDE.md` dans le produit (vérifiée ci-dessus) ; `ETAPES-RUN.md` §1 sur la section « Routage forge » |
| Écart source ↔ production | aucun | **inexistant** — rien ne compare ce qui est servi à ce qui est versionné, et le produit n'est même pas versionné | absence de `.git` (vérifiée) |

**Ce qui a été joué le 15/08 à la place** : un crawl HTTP (401 routes en 200) et des greps
de présence de liens — des contrôles de la **modification**, jamais de l'**expérience**.

## d — Solutions, par destinataire

**PRODUIT (produit-07)** — remis à son propriétaire, aucune écriture du pilot :
1. porter en production la source courante de `HeaderEn` (le menu EN complet **existe
   déjà** : c'est un déploiement, pas un développement) ;
2. corriger la mise en page de la barre FR — 8 entrées + « Prendre RDV » + `LangSwitch` ne
   tiennent pas à 1900 px ;
3. poser le socle minimal : **git** (aucun historique aujourd'hui) et la seule section
   « Routage forge » d'un `CLAUDE.md` (R-37 alinéa 3) — c'est l'appelant durable qui
   manquait, il se pose une fois et sert toutes les sessions suivantes.

**FORGES** — les trois trous sont déjà en construction ce soir, décidés sous étude :
TF-0283 (pan interface étendu aux composants React), TF-0284 (pan i18n : parité de routes,
parité de navigation, langue du contenu), TF-0286 (CLI de rendu comparatif avant/après).

**PILOT** — fait ce soir : **R-37** encodée (`REGLES-PROJET.md` §Q — toucher une UI engage
les verdicts, run ou pas) et ce circuit lui-même (TF-0287).

## e — Correctif et release : REMIS, pas exécuté

Le produit est autonome et une session y travaille. Le pilot n'a rien écrit chez lui —
lecture seule, conformément au garde-fou. Le correctif et sa mise en production suivent la
voie du produit **sous décision humaine** (R-29), et **R-37 s'y applique désormais** :
rendu en pixels des pages touchées avant/après, et verdict de parité (le produit est
bilingue). Ce dossier reste ouvert jusqu'à la clôture — il ne se clôt pas sur une intention.

## f — Retours aux forges

**Aucun lot nouveau n'est nécessaire, et c'est dit plutôt que tu** : les constats de cette
instruction sont **déjà** au registre TF (TF-0283, TF-0284, TF-0285, TF-0286 — issus du lot
`digit-ai-fr - RETOURS - 20260815a` ingéré ce matin par la voie régulière), tous décidés ce
soir sous les études 20260815e et 20260815f. Le seul constat neuf de cette instruction est
l'**écart source ↔ production**, qu'aucun contrôle ne couvre : il est consigné en
candidature.

---

## Ce que ce dossier a appris au circuit lui-même

L'instruction a trouvé ce que le signalement ne disait pas : **le menu anglais complet
existe déjà dans le code**. Sans le bloc (b), la réponse évidente aurait été « ajouter les
entrées manquantes au menu anglais » — un développement inutile sur un défaut de
déploiement, et un troisième « toujours pas ».
