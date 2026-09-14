# INS-0004 — « le lien vers la page client n'est pas accessible depuis l'administration »

**Produit** : produit-61 (le dépôt d'insatisfaction porte, dans son en-tête `produit:`, le
nom déclaré au dépôt — pseudonymisé ici, jamais recopié).
**Déposé** : 06/09/2026 à 18:53, par l'humain, une phrase (dépôt « c » du lot du jour, sans
capture ni URL).
**Instruit** : 14/09/2026 par le pilot, **en lecture seule** — aucun octet n'a été écrit chez
le produit ; instruction rétrospective, un correctif du produit lui-même étant intervenu entre
le dépôt et l'instruction (bloc e).

---

## a — Reproduction, aux conditions réelles

Le dépôt ne fournit pas l'URL de l'administration ; la reproduction « aux conditions réelles »
n'est pas jouable ici. Ce chapitre reproduit **structurellement**, sur les deux écrans nommés
par le dépôt (accueil et configuration de l'administration).

| Ce qui est vérifié | Comment | Résultat |
|---|---|---|
| L'état au moment du dépôt | lecture du parent du correctif, deux gabarits admin | `backend/app/templates/admin/accueil.html` et `backend/app/templates/admin/configuration.html` : le lien client était rendu `<p class="mono">{{ reglages.app_base_url }}/r/{{ restaurant.slug }}</p>` — un **texte**, sans balise `<a>`, sans bouton, sans aucun attribut de copie |
| L'état après correctif | lecture de l'état courant (identique au commit du correctif) | les deux mêmes écrans portent `<a … data-fonctionnalite="ouvrir-page-client">` (lien cliquable, nouvel onglet) et `<button type="button" data-copier="…" data-fonctionnalite="copier-lien-client">Copier le lien</button>` dans un conteneur `id="lien-client"` |
| Le bouton copier est câblé côté script | lecture de `backend/app/static/app.js` après correctif | un gestionnaire délégué sur `[data-copier]` utilise `navigator.clipboard.writeText`, avec un repli `document.execCommand('copy')` si l'API est indisponible, et un message si la copie échoue des deux façons |
| L'adresse copiée est la même que l'adresse affichée | lecture du test dédié | `test_E074_lien_client_copiable` compare l'attribut `href` du lien et l'attribut `data-copier` du bouton : identiques |

## b — Cause racine côté produit

Ce chapitre nomme le fichier et la ligne où vivait le défaut, pas le symptôme qu'il produisait.

**`backend/app/templates/admin/accueil.html`** et **`backend/app/templates/admin/configuration.html`**
(avant correctif, une ligne dans chacun) : le lien vers la page client existait bien comme
**donnée affichée**, mais jamais comme **affordance** — aucune balise `<a>`, donc rien à cliquer
pour l'ouvrir, et aucun bouton, donc rien à cliquer pour le copier. Ce n'est pas un bug
d'exécution (rien n'était cassé), c'est une fonctionnalité qui n'avait jamais été construite :
l'exigence qui l'impose (E-074) n'existait pas encore au moment du dépôt.

## c — Gates en défaut : vérifiés, jamais présumés

Pour ce défaut, ce chapitre nomme le contrôle qui aurait dû le voir, dit lequel des trois cas
s'applique et l'appuie sur une preuve lue.

| Défaut | Quel contrôle aurait dû voir | Pourquoi il n'a pas vu | Preuve |
|---|---|---|---|
| Absence de lien cliquable et de bouton copier sur l'accueil et la configuration admin | seuil `couverture_surface_interface` (forge-tests, pan interface, bloquant 1.0) | **inexistant sur ce cas précis** — ce seuil juge que les affordances **déclarées** sont câblées ; il ne juge pas qu'une affordance **absente** aurait dû exister. Avant E-074, aucune exigence ne demandait un lien ou un bouton à cet endroit : il n'y avait rien à câbler, donc rien que ce seuil pouvait refuser | `forge/etapes/tests/rapport-20260905g.json`, `seuils.couverture_surface_interface` : « porte_sur : affordances (bouton, lien, formulaire) câblées » — le mot « câblées » suppose l'affordance déjà voulue |
| Manque fonctionnel lui-même (le produit ne rendait pas ce service) | un oracle de conformité au référentiel d'exigences | **inexistant** — E-074 n'entre au référentiel qu'avec le run de version 20260906, en réponse à ce dépôt même | `forge/etapes/conception/EXIGENCES.md`, ligne E-074, sous l'en-tête « Run de version 20260906 — retours humains » |

Ce dossier illustre un cas net du bloc c : un manque **fonctionnel** (une chose que le produit
ne fait pas encore) n'est pas un défaut de gate — aucun contrôle ne peut juger la conformité à
une exigence qui n'existe pas. Le classer « inexistant » plutôt que d'accuser un pan de test
évite une candidature qui viserait le mauvais objet.

## d — Solutions, par destinataire

**PRODUIT (produit-61)** — déjà fait, remis par la voie du produit (bloc e) :
1. rendre le lien client cliquable sur l'accueil et la configuration admin ;
2. ajouter un bouton de copie de la même adresse, avec repli si le presse-papiers moderne est
   indisponible.

**FORGES** — aucune candidature : le trou constaté n'est pas un défaut de gate (bloc c), c'est
un cycle exigence → retour → exigence normal.

**PILOT** — rien à consigner : pas de constat de doctrine ici.

## e — Correctif et release : CONSTATÉ, par la voie du produit

Le produit a livré ce correctif de lui-même, par un run de version régulier — rien n'a été
exécuté par cette instruction, seul l'état existant est constaté.

- **Commit** `a9d56b1` (06/09/2026 19:11), run de version 20260906, exigence E-074 ajoutée au
  référentiel scellé (« L'admin copie le lien de sa page client depuis l'accueil et la
  configuration ») ;
- **Tests** : `backend/tests/test_version_20260906.py::test_E074_lien_client_copiable` vérifie,
  sur les deux écrans (`/admin` et `/admin/configuration`), la présence du lien et du bouton, et
  l'égalité de l'adresse affichée et de l'adresse copiée ;
- **MEP** : `forge/DOSSIER-MEP.md`, section « Run de version 20260906 », M-3 smoke PASS et
  parcours navigateur qualif rejoué 4/4 (ledger, entrée d'étape `tests`, 06/09/2026 17:09) ;
- **État courant** : les deux gabarits et `app.js` sont identiques entre le commit du correctif
  et l'état lu ce jour ;
- **Production** : toujours non déployée à ce jour (GO humain Q-01 ouverte) ; le correctif vit
  sur l'environnement qualif.

## f — Retours aux forges

Aucun lot nouveau : ce dossier ne porte aucune candidature de gate (bloc c et d).

---

## Verdict proposé

**`corrige`** — le lien client est cliquable et copiable sur les deux écrans nommés par le
dépôt, avec un test qui compare l'adresse affichée et l'adresse copiée. Réserve : la preuve
visuelle au navigateur sur l'URL réelle (rendu du bouton, retour visuel « Lien copié ») n'a pas
été rejouée par cette instruction, faute d'URL fournie.
