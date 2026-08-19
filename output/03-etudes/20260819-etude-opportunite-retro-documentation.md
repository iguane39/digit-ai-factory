# Étude d'opportunité — rétro-documentation par profils — 20260819b

Instruite au gabarit `gabarits\ETUDE-OPPORTUNITE.md`. Périmètre d'écriture : ce fichier et
son sidecar de candidature. Aucune forge créée, aucun service construit, aucun commit —
décision humaine (R-29). Deuxième étude du mandat du 19/08 ; elle cite l'étude 1
(`20260819-etude-opportunite-retro-engineering.md`), dont le verdict — service
« rétro-modèle » (O1) — fournit l'artefact d'entrée présumé ici.

## Seuil de déclenchement (vérifié AVANT rédaction)

- **Crée un objet durable** — oui : gabarits de documents par profil + oracle de fidélité
  (R-31, `REGLES-PROJET.md` l.239). **Porte franchie.**
- **Touche ≥ 3 forges ou le noyau** — oui : development (DESIGN.md), tests (cahiers),
  data (restitution sourcée), plus les skills de rendu.
- **Gain ≥ 3 avec preuve ≤ 2** — oui : gain estimé 3, preuve 2. Étude obligatoire.

## 0. Traitement des entrants

La demande instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

- **Demande humaine du 19/08** (verbatim) : « Rétro-documentation — fonctionnel,
  technique, paramétrage, data, services... — déclinée par profil destinataire :
  équipes (PO, Dev, Archi, Data, Sécu, Testeur...), Product Manager, commerciaux,
  Customer Success Manager, utilisateurs finaux (selon leurs profils et usages dans la
  ou les applications). »
- Les énumérations ouvertes (« ... ») sont traitées comme un périmètre NON fermé : la
  partition P2 ferme la liste des profils instruits ici ; tout profil hors liste
  relèvera d'une instance, pas du schéma.
- **Antériorité au registre** : même grep que l'étude 1 (19/08/2026) — aucun candidat
  existant sur la rétro-documentation.

## 1. Partition du problème

- **P1 — La source** : de quoi la documentation est-elle dérivée ? D'un modèle vérifié
  du produit (sortie de l'étude 1), jamais du code relu à chaque document — sinon
  chaque document refait l'acquisition et diverge.
- **P2 — La projection par profil** : un même modèle, des vues distinctes (PO, Dev,
  Archi, Data, Sécu, Testeur, Product Manager, commercial, CSM, utilisateur final) —
  chaque vue = sélection + niveau de détail + vocabulaire, pas une réécriture.
- **P3 — Le rendu** : la forme livrée (Markdown, HTML charté, deck) — couche existante
  à réutiliser, jamais à recréer.
- **P4 — La vie du document** : péremption quand le produit bouge — détection d'écart
  modèle/document, hors génération initiale.
- **P5 — Le régime de preuve** : fidélité au modèle (aucune affirmation sans ancre) et
  conformité de forme (oracles de rendu existants).

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable, relue le 19/08/2026 en lecture seule.

| Existant examiné | Citation | Verdict |
|---|---|---|
| forge-development — document design | `catalogues\CATALOGUES.md` l.40, cat-dev-05 : « produire le document design du produit accepté par le gate » (`generer-design-md.mjs`, prouvé 07/08) | recouvre la doc TECHNIQUE pour le profil Dev/Archi — sur un produit construit PAR la forge seulement, et un seul profil |
| forge-tests — livrables dérivés | `catalogues\CATALOGUES.md` l.50, cat-tst-03 : « obtenir cahiers de tests, jeu de données synthétique et dashboard » (prouvé TF-0144) ; l.54, cat-tst-07 : « verdict et pourquoi de CHAQUE test » | recouvre la doc du profil Testeur — dérivée du code exécutable, prouvée ; rien pour les autres profils |
| forge-data — restitution sourcée | `catalogues\CATALOGUES.md` l.91, cat-dat-03 : « garantir que tout chiffre restitué est ancré à sa source » (`oracle-restituer.mjs`, self-test 15 PASS) | ne recouvre pas la génération — mais fournit le régime de preuve P5 pour tout document chiffré : à composer, rien à créer |
| forge-seo — rapport contrôlé avant remise | `catalogues\CATALOGUES.md` l.122, cat-seo-04 : « recevoir un rapport d'audit autonome et contrôlé avant remise » (rapport client réel, 6e itération) | ne recouvre pas — mais établit le précédent du DOCUMENT LIVRÉ passé aux oracles avant remise : patron à reprendre |
| Consigne de restitution du pilot | `gabarits\RESTITUTION.md` l.6-9 : périmètre = « tout message de fin de traitement … clôture de run, fin de campagne, fin de mandat » | ne recouvre pas — instantané de fin de traitement, pas une documentation produit tenue par audience |
| Skills de rendu chartés | `%USERPROFILE%\.claude\skills\digit-ai-page-html\SKILL.md` (socle : conformité charte + accessibilité + `render_page.py`) et `digit-ai-fiches-html` (gabarits fiches) | recouvrent le RENDU (P3) intégralement — la projection par profil n'a pas à inventer une couche de sortie |
| Profils du pilot | `profils\LISEZMOI.md` + `profils\webapp.md`, `mobile.md`, etc. : profils = TYPES D'APPLICATION (webapp, mobile, e-commerce…) | ne recouvre pas — homonymie : aucun objet versionné ne modélise une AUDIENCE (PO, commercial, CSM, utilisateur) |
| Étude 1 — acquisition | `output\03-etudes\20260819-etude-opportunite-retro-engineering.md` §5 : verdict O1, service « rétro-modèle » (candidature en attente de GO) | ne recouvre pas la projection — mais en est le prérequis : sans modèle vérifié, chaque document refait l'acquisition (P1) |

En une phrase : deux profils (Dev/Archi via DESIGN.md, Testeur via forge-tests) ont une
documentation dérivée et prouvée ; les huit autres audiences n'ont ni vue, ni gabarit, ni
oracle — et aucun objet ne décline un même modèle en plusieurs vues.

## 3. État de l'art daté

Sources relevées par recherche web exécutée le 2026-08-19 ; panorama d'outils, aucun
benchmark primaire — marqué comme tel.

- **Mintlify / Swimm** — génération et maintien de documentation depuis le code par LLM,
  « codebase-aware » (relayé par index.dev, consulté le 2026-08-19).
- **DocuWriter.ai** — docstrings, références API, guides d'architecture générés
  (docuwriter.ai, consulté le 2026-08-19).
- **Panorama 2026** — « 12 Best AI Code Documentation Tools » (techiehub.blog, consulté
  le 2026-08-19) et « Top 7 Documentation Generators » (kodesage.ai, consulté le
  2026-08-19) : le marché est dense sur la doc DÉVELOPPEUR.
- **Constat transversal** (onefileapp.com, guide 2026, consulté le 2026-08-19) :
  l'adaptation à l'audience existe uniquement comme paramètre de prompt (« beginners,
  experienced devs, end users ») — aucun outil relevé ne modélise des vues par profil
  métier (PO, commercial, CSM) dérivées d'un même modèle vérifié, ni la détection de
  péremption (P4). Le différenciant instruit ici n'est pas couvert par l'offre relevée.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : RÉFUTÉE pour les huit audiences sans vue (tableau §2) : le
  statu quo laisse la documentation non-développeur s'écrire à la main, sans source
  unique ni régime de preuve — chaque document devient une réécriture divergente du
  produit. Retenue en revanche pour les profils Dev/Archi et Testeur, déjà servis par
  cat-dev-05 et cat-tst-03 : rien à recréer là.
- **O1 — service « projection par profils » autonome** : gabarits de vues par audience
  générés directement depuis le code, sans passer par le rétro-modèle. Exclue :
  reconstruit l'acquisition à chaque document (P1), régime de preuve impossible à
  tenir — c'est le mode d'échec de la doc générée (affirmations plausibles sans
  ancre).
- **O2 — fusion en un objet unique avec le rétro-engineering** : instruite (mandat).
  Même conclusion que l'étude 1 §4 : régimes de preuve distincts, dettes cumulées —
  la fusion vit dans le CONTRAT d'artefact (modèle → vues), pas dans un objet commun.
- **O3 — couche « vues par profil » consommant le rétro-modèle** : un gabarit de vue
  par audience (sélection, niveau, vocabulaire), un oracle de fidélité (toute
  affirmation d'une vue pointe une entrée du modèle — patron `oracle-restituer`,
  cat-dat-03), rendu délégué aux skills chartés (P3), péremption par empreinte du
  modèle source (patron scellé → vue, comme `derive-les-vues` le fait pour les
  exigences). Coût : gabarits + oracle + fixtures ; commence à 3 profils pilotes
  (PO, CSM, utilisateur) avant d'ouvrir les dix.
- **O4 — nouvelle forge dédiée (forge-docs)** : 14e dépôt. Exclue au même motif que
  l'étude 1 : coût de possession permanent pour une capacité qui est une PROJECTION
  d'artefacts existants ou en candidature — rien n'y déborde un hôte existant.

## 5. Verdict

- **Option retenue** : O3 — couche de vues par profil, dérivée du rétro-modèle
  (étude 1), oracle de fidélité au modèle dès la v0, rendu délégué aux skills
  existants, 3 profils pilotes avant généralisation.
- **Coût** : 2-4 jours après livraison du rétro-modèle ; dépendance dure : la
  candidature de l'étude 1 — sans elle, cette option retombe sur O1, exclue.
- **Candidature émise** :
  `input\01-candidatures\candidature-retro-doc-profils.tf.jsonl` (sidecar, dépendante
  de `candidature-retro-modele`, en attente de GO humain).
- **Plan de revue** : 2026-09-19 — jugée avec l'étude 1 : si le rétro-modèle n'a pas de
  GO, cette candidature tombe d'elle-même ; si un run réel a produit des vues,
  confronter la fidélité mesurée (oracle) au verdict.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé tenu ; chaque ligne de non-recouvrement citée ;
sources datées et qualifiées (panorama, pas de benchmark primaire) ; O0 traitée
profil par profil.
