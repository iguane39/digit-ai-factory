# Retours forges — Produit-79 — 20261018a

- **Contexte** : autre — accès Meta, analyse L99 et exécution de l'étude des réseaux sociaux, puis rapport HTML de l'étude itéré jusqu'à conformité, session du 17 et du 18/10/2026
- **Références ledger** : `forge\ledger.jsonl` seq 318, 348, 349, 350, 373, 374, 375 (entrées `type: retour` de cette session)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 18/10/2026

---

## pilot (`digit-ai-factory`)

Quatre frictions de la factory chez ce produit : une règle de forme contraire à la consigne de l'exploitant, deux contrôles qui se contredisent ou comptent mal, et un hook qui se tait sous un agent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-16 — guide en étapes | majeur | générique | 18/10/2026 : un guide de création d'application Meta rendu en dix étapes numérotées à paragraphe, comme S53 de `gabarits/RESTITUTION.md` le décrit, renvoyé par l'exploitant : « Pour le guide, des puces et sous-puces, déjà demandé... ». Récidive de RP-10 (lot 20261017a) : la consigne de l'exploitant vit dans la mémoire de la session, la forme prescrite dans le gabarit (ledger, entrée 318). | Règle qui aurait évité le retour : RP-10, encore candidate. Proposition : S53 montre et accepte une étape numérotée suivie d'une sous-puce par geste, « Résultat attendu » en dernière sous-puce. |
| RP-17 — DEM-3 et EC-8 | majeur | générique | 18/10/2026 : les demandes `Produit-79 - DEMANDE - 20261018a` et `20261018b` restent en échec EC-8 d'`oracle-ecriture.mjs` sur le titre « Ce que cette demande ne réclame pas », que DEM-3 d'`oracle-demande.mjs` exige mot pour mot ; corriger l'un casse l'autre (ledger, entrée 348). | Règle qui aurait évité le retour : aucune n'arbitre entre les deux. Proposition : EC-8 exempte un titre imposé par un gabarit jugé, comme pour TF-1507 et TF-1453. |
| RP-18 — source d'un chiffre | mineur | générique | 18/10/2026 : l'agent qui a rédigé l'étude réseaux sociaux a dû écrire « source : » sur chaque ligne d'un tableau dont la source était donnée sous le titre de la section ; le contrôle de traçabilité des chiffres ne reconnaît une source que sur la même ligne que le chiffre (ledger, entrée 349). | Règle qui aurait évité le retour : aucune. Proposition : la source déclarée sous un titre ou sous un tableau couvre les lignes qu'il porte. |
| RP-19 — hook muet sous agent | majeur | générique | 18/10/2026 : l'agent qui a écrit l'étude a joué `oracle-ecriture.mjs` à la main ; le hook d'écriture du produit (`forge/hooks/factory.mjs`) ne s'est pas déclenché sur ses fichiers `.md`, alors que le hook global `qo-gate-write` l'a fait (ledger, entrée 350). | Règle qui aurait évité le retour : aucune ; un livrable écrit par un sous-agent échappe au contrôle d'écriture sans que rien ne le signale. Proposition : les hooks du produit s'appliquent aux écritures d'un sous-agent, ou la restitution dit quels fichiers n'ont pas été jugés. **RP-19 : clé proposée `hook-produit-muet-sous-agent`.** |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Le contrôle de conformité des pages a pris des dates pour des notes, et lit une exemption de chiffres clés tuile par tuile.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-15 — date lue comme une note | majeur | générique | Rapport `Produit-79 - Étude - Réseaux sociaux, opportunités et stratégie - 20261018t.html` : 16 échecs bloquants L3 « valeur sans barème lié » sur « 19/10 », « 26/10 »… d'une table de semaines ; `RE_NM` de `check_html.py` lit tout « N/M » de cellule comme une note. Levés en reliant l'en-tête de colonne à une légende « Les dates des tableaux s'écrivent jour/mois » (ledger, entrée 373). | Règle qui aurait évité le retour : aucune. Proposition : L3 exclut un JJ/MM plausible quand l'en-tête de colonne ou sa légende nomme une date, ou accepte une date balisée par `<time datetime>`. |
| RA-16 — exemption de chiffres clés | mineur | générique | Même rapport : `data-kpi-hors-page` posé sur la rangée `div.tuiles-statiques` laisse l'avertissement L13 (« 4 KPI non cliquables ») ; il tombe en répétant l'attribut sur chacune des 4 tuiles (ledger, entrée 374). | Règle qui aurait évité le retour : le barème de groupe de L3 (TF-0231) existe, son équivalent L13 non. Proposition : une exemption portée par le conteneur vaut pour les tuiles qu'il contient. |

## digit-ai-forge-design (`digit-ai-forge-design`)

L'oracle des bascules ne reconnaît pas un alias déclaré dans une déclaration multiple.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-3 — alias de bascule | majeur | générique | Même rapport : `var racine = document.documentElement, bouton = document.getElementById('theme');` puis `bouton.addEventListener('click', …)` rend B-T2 bloquant « bascule morte » ; la bascule marchait (test d'interactions Chromium 13 sur 13, bascule comprise). PASS en écrivant `document.getElementById('theme').addEventListener` (ledger, entrée 375). | Règle qui aurait évité le retour : la reconnaissance d'alias de B-T2 (motif 1) ne lit que le premier déclarateur. Proposition : lire chaque déclarateur d'un `var`, `let` ou `const` séparé par des virgules ; voisin de TF-0800. |

## Rattachement

Registre interrogé le 18/10/2026 : `node -e "…"` sur `todo\TODO.jsonl` du pilot, filtre des entrées dont le titre ou le contenu répond à `/(EC-8|DEM-3|S53|puces et sous-puces|bar[eè]me|RE_NM|JJ\/MM|kpi-hors-page|oracle-bascule|B-T2|alias|hook.{0,30}(sous-agent|subagent)|tra[cç]abilit[ée] des chiffres)/i`, sans borne → 40 ligne(s) trouvée(s).
Items recoupés : TF-0800 (candidat, B-T2 qui déclare morte une bascule câblée par écouteur délégué ; même règle que RD-3, autre forme d'alias), TF-1453 et TF-1507 (candidats, titres de gabarit refusés par EC-8 ; même famille que RP-17), TF-1409 (candidat, EC-8 sur deux références du pilot). Les 36 autres répondent au filtre par « alias » ou « B-T2 » sans recouper ces retours.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui pendant la session, et pourquoi cela ne remonte pas.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Numéro de décision D-68 posé sans être consigné au registre, puis pris par une autre session | renuméroté D-69 et consigné, entrées 292 à 294 | non | erreur de la session, corrigée |
| Heure de pose de D-76 composée au lieu d'être relevée | corrigée à l'entrée 333 | non | erreur de la session, corrigée |
| Étude : 75 et 61 nuits de fin de période comparées aux 18 nuits réservées à date | recompte Beds24, comparaison à date égale (45, 33, 18) écrite dans l'étude | non | erreur de l'agent rédacteur, vue au recompte à la source |
| Générateur du rapport HTML : `<thead>` abîmé par une expression régulière sur `<th` | expression corrigée ; `oracle-filtres-tableau` G4 rouge puis vert | non | erreur de la session, vue par l'oracle |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : l'étude et son rapport HTML n'ont pas de famille au catalogue, et le rapport reprend la feuille du tableau de bord du produit.

## Documents mûrs

Premier document mûr : le générateur `forge/etapes/reseaux/generer_rapport.py`, qui convertit une étude Markdown en rapport HTML au socle (sommaire annoté, chapeaux, repli en cartes, filtres et recherche du socle, volets ouverts à l'impression). Verdict : reste au produit, parce que ses chapeaux et ses exemples de lecture sont écrits pour cette étude ; il devient générique le jour où le Markdown porte lui-même ces éléments.

Un second document mûr, mesuré par le contrôle du lot : le tableau de bord « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Nouveau garde-fou, absent du registre, décrit par ses champs :

- plateforme : Meta, API Graph v21.0 ;
- mécanisme : niveau d'accès des autorisations d'une application en mode développement ;
- effet : refus, HTTP 403 `(#200)` sur les conversations de la page et `(#230)` sur les messages Instagram ;
- portée : toute application Meta non publiée et non examinée ;
- ce qu'il vise : la lecture et l'envoi de messages privés (`pages_messaging`, `instagram_manage_messages`) et les réponses automatiques par webhooks ;
- ce qu'il refuse : toute réponse automatique à un voyageur sans rôle sur l'application ;
- date où il a été heurté : 18/10/2026, documentation lue le même jour : `https://developers.facebook.com/docs/messenger-platform/overview`.

## Confirmations positives

- `render_page.py` a trouvé un débordement à 390 px que la lecture du code ne montrait pas : un texte de citation sans coupure possible ; corrigé, puis vert aux 7 largeurs dans les deux thèmes.
- La règle « sommaire perdu au défilement » a fait poser une bande de sommaire repliable sur mobile, jouée 13 sur 13 dans Chromium.
- `check_completude.py` a confirmé que le rapport porte tout le Markdown : 8 019 mots visibles pour 7 151, titres et listes conservés.

## Ordre recommandé

1. RP-16 : il récidive RP-10 et coûte un aller-retour à chaque guide rendu.
2. RA-15 et RD-3 : deux faux positifs bloquants qui imposent un contournement.
3. RP-17, RP-19.
4. RP-18, RA-16.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Chaque ligne nomme sa règle dans « Proposition esquissée ». Un retour n'en trouve aucune et propose une classe : RP-19, clé `hook-produit-muet-sous-agent`, famille `hook-ou-gate`, libellé « Un fichier écrit par un sous-agent échappe aux hooks d'écriture du produit sans que rien ne le dise ».
