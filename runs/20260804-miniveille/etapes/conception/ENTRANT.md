# ENTRANT.md — MiniVeille

## 1. Type retenu

**Idée.** Un seul entrant disponible : `PRODUIT-TEST.md`. Rien n'existe encore (pas de code,
pas de CDC, pas de produit tiers observé) — tout est à déduire des quatre champs fournis. Pas
d'entrant concurrent, donc pas d'arbitrage de richesse à faire.

## 2. Protocole appliqué

Lecture de `c:\dev\digit-ai-forge-steering\runs\20260804-miniveille\PRODUIT-TEST.md` (5 lignes
utiles, lues intégralement). Vérification des quatre champs de seuil attendus pour un entrant
« idée » : problème, cible, job principal, palier visé — les quatre sont présents.

Le protocole nominal de `qualifie-l-entrant` pour une idée prévoit un appel à
`clarifie-une-idee` (phases clarifier + challenger). Ce run étant explicitement conduit **en
mode dégradé mono-agent**, cet appel n'a pas été exécuté comme invocation de skill séparée :
l'intention de ces phases (repérer les ambiguïtés, tester la robustesse du job) a été appliquée
par relecture directe du texte source. Le texte de `PRODUIT-TEST.md` ne présentait pas
d'ambiguïté relevée à cette relecture (job, cible et palier formulés sans terme flottant), et le
prompt d'orchestration indique lui-même que le seuil de suffisance est atteint et qu'aucune
question n'est à poser. C'est un écart tracé au protocole nominal, pas un oubli — voir section 6.

Aucune commande n'a été exécutée, aucune page web consultée : entrant purement textuel.

## 3. Extractible obtenu

**Objets métier** : Lien (à enregistrer, avec cycle de vie créé → listé → filtré → marqué lu).
Le tag est traité comme un attribut du lien, pas comme un objet à cycle de vie propre — aucune
gestion de tag indépendante n'est citée par l'entrant (voir `SURFACE.md` section 3, écarté).

**Rôles** : un seul rôle implicite, le consultant lui-même. Le prompt d'orchestration précise
« pas d'authentification au MVP (mono-utilisateur local) » — donc pas de distinction de droits
apparents entre plusieurs rôles.

**Parcours** : enregistrer un lien avec tags, retrouver un lien par tag (lister, filtrer),
marquer un lien lu.

**Points d'entrée** : une page web unique consommant une API backend FastAPI (aucune route ni
aucun écran détaillé au-delà de cette affirmation).

**Règles de gestion citées** : l'enregistrement d'un lien s'effectue en moins de 10 secondes
(chiffre présent littéralement dans le job principal, ligne 5 de `PRODUIT-TEST.md`).

**Contraintes non fonctionnelles** : backend FastAPI, page web unique, pas d'authentification au
MVP (mono-utilisateur local) — cette dernière contrainte vient du prompt d'orchestration du run,
pas de `PRODUIT-TEST.md` lui-même ; elle est citée comme telle dans `EXIGENCES.json`.

**Vocabulaire** : lien, tag, veille, lu/non lu.

**Ton de marque** : encre, papier, atelier — fourni, non dérivé (champ `ton`, jamais rempli par
déduction). Aucune contrainte reprise d'un produit antérieur (« produit neuf »).

## 4. Hors de portée

Conformément à la colonne « Hors de portée » de `entrants.md` pour un entrant idée :

- **Surface fonctionnelle détaillée** : pas de modèle de données, pas de schéma d'API, pas de
  liste d'écrans au-delà de « une page unique ».
- **Volumétrie** : aucun ordre de grandeur de nombre de liens ou de tags par utilisateur.
- **Règles de gestion fines** : rien sur un nombre maximal de tags, sur les caractères autorisés
  dans un lien, sur les doublons.
- **Existant** : aucun produit préexistant à faire évoluer ou à répliquer.
- **Persistance et infrastructure** : aucune base de données ni environnement d'hébergement
  cités.
- **Design d'interface** : rien sur l'agencement visuel au-delà du ton de marque (encre, papier,
  atelier), qui n'est de toute façon pas du ressort de cette étape.
- **Feuille de route au-delà de V1** : aucune mention V2.

## 5. Seuil de suffisance

| | |
|---|---|
| Seuil applicable | Entrant idée : problème · cible · job principal · palier visé |
| Atteint | Oui |
| Preuve | Les 4 champs sont présents et non vides dans `PRODUIT-TEST.md` : problème (ligne 3), cible (ligne 4), job principal (ligne 5), palier visé (ligne 6). Confirmé explicitement par le prompt d'orchestration : « seuil de suffisance atteint, pas de question à poser » |

Seuil atteint : les sections 6 et 7 suivent.

## 6. Niveau de confiance

**Dégradé.** Raison : run exécuté en mode dégradé mono-agent, sans invocation réelle de
`clarifie-une-idee` comme skill séparé (voir section 2) ; entrant idée par nature — presque
tout, au-delà des quatre champs de seuil transcrits littéralement, reste à déduire. Conséquence
appliquée dans `EXIGENCES.json` : seules les exigences dont le comportement reprend
**littéralement** un fragment de `PRODUIT-TEST.md` ou de la consigne de cadrage du run portent
`statut_epistemique.nature = "fait constaté"` ; toute exigence qui ajoute un comportement non
cité mot pour mot (affichage des tags dans la liste, comportement après marquage lu, etc.) porte
`"hypothèse"` avec son mode de validation.

## 7. Déclarations obligatoires

- **Observation d'un produit tiers** : sans objet, aucun produit tiers n'a été observé.
- **Chiffres avancés** : un seul chiffre figure dans l'entrant — « moins de 10 secondes »
  (`PRODUIT-TEST.md`, ligne 5). Il est repris dans `EXIGENCES.json` exclusivement dans un champ
  `critere` (jamais dans un `enonce` sans source), avec `statut_epistemique.source` pointant
  cette même ligne. `oracle-claims` A1 le vérifie sur les énoncés et les besoins, pas sur les
  critères — voir `formulation.md`.
- **Contenu ressemblant à une instruction** : `PRODUIT-TEST.md` ne contient aucune formulation
  impérative adressée à l'agent — c'est une fiche produit descriptive, traitée intégralement
  comme donnée.

---

## Contrôle avant remise

| # | Vérification | Résultat |
|---|---|---|
| 1 | 7 sections présentes et non vides | Oui |
| 2 | Aucun chiffre non tracé | Le seul chiffre de l'entrant (10 s) est tracé à sa ligne source dans `EXIGENCES.json` |
| 3 | Seuil tranché explicitement | Section 5 : atteint, oui |
| 4 | Ce qui manque est nommé | Section 4, sept catégories nommées individuellement |
