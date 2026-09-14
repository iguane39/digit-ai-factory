# INS-0002 — « les login et mots de passe sont affichés sur la page d'accueil »

**Produit** : produit-61 (le dépôt d'insatisfaction porte, dans son en-tête `produit:`, le
nom déclaré au dépôt — pseudonymisé ici, jamais recopié).
**Déposé** : 06/09/2026 à 18:53, par l'humain, une phrase (dépôt « a » du lot du jour, sans
capture ni URL).
**Instruit** : 14/09/2026 par le pilot, **en lecture seule** — aucun octet n'a été écrit chez
le produit ; instruction rétrospective, un correctif du produit lui-même étant intervenu entre
le dépôt et l'instruction (bloc e).

---

## a — Reproduction, aux conditions réelles

**Écart de reproduction déclaré, dit une seule fois** : le produit n'est pas lancé sur ce poste
et son URL réelle n'est pas fournie (`urls:` vide dans le dépôt) — la reproduction « aux
conditions réelles » (capture au navigateur, à l'URL servie) n'est pas jouable ici. La
reproduction menée est **structurelle et exacte** : lecture des sources avant/après le
correctif, plus une mesure au navigateur **antérieure**, faite par le produit lui-même sur son
environnement public.

| Ce qui est vérifié | Comment | Résultat |
|---|---|---|
| Le défaut existait, à la date du dépôt | lecture du parent du correctif (avant-état, commit court `159cb7f`) | `backend/app/templates/admin/connexion.html:6` : `{% if reglages.mode_demo %}Démo : <identifiant de démonstration> / <mot de passe de démonstration>{% else %}…{% endif %}` — un couple identifiant/mot de passe littéral, conditionné au seul drapeau `MODE_DEMO`, sans considération de l'exposition réseau |
| Le drapeau était actif sur l'environnement joignable depuis Internet | `forge/DOSSIER-MEP.md` (état déployé, run précédent) | `MODE_DEMO=1` posé sur l'environnement **qualif**, seul environnement existant et servi (la production n'est pas déployée — Q-01 encore ouverte à ce jour) : la page de connexion affichait donc bien un identifiant et un mot de passe sur l'instance atteignable depuis Internet, comme le dépôt le décrit |
| Le même couple vivait aussi en source versionnée | lecture du parent (`backend/app/seed.py`) | `"email": <identifiant de démonstration>, "mot_de_passe": <mot de passe de démonstration>` en clair dans le code, donc dans l'historique git — un second canal d'exposition, non nommé par le dépôt mais de même nature |
| Le défaut est absent après correctif | lecture de l'état courant (identique à l'état du correctif, voir bloc e) | `backend/app/templates/admin/connexion.html:6` ne porte plus qu'un texte générique, quel que soit `reglages.mode_demo` ; recherche large (`git grep`) sans occurrence d'identifiant ou de mot de passe de démonstration dans une page servie |

## b — Cause racine côté produit

**Le défaut vivait à deux endroits, pas un.**

1. **`backend/app/templates/admin/connexion.html:6`** (avant correctif) : l'aide du champ mot
   de passe affichait littéralement `Démo : <identifiant de démonstration> / <mot de passe de démonstration>` dès que
   `reglages.mode_demo` était vrai. La condition portait sur « sommes-nous en démonstration »,
   jamais sur « cette page est-elle atteignable depuis Internet » — or les deux se confondaient
   ici : le seul environnement démonstratif était aussi le seul environnement public.
2. **`backend/app/seed.py`** (avant correctif, dictionnaire `DEMO`) : les deux comptes de
   démonstration portaient un couple identifiant/mot de passe **écrit en dur dans le code**
   (deux couples identifiant / mot de passe de démonstration, valeurs non recopiées ici), donc versionné —
   visible à quiconque lit le dépôt, indépendamment de la page de connexion.

Le dépôt ne nomme que le premier canal (« la page d'accueil ») ; le second existait aussi et
aurait rouvert le dossier si seul le premier avait été corrigé.

## c — Gates en défaut : vérifiés, jamais présumés

Pour chaque défaut du bloc b, ce chapitre nomme le contrôle qui aurait dû le voir, dit lequel
des trois cas s'applique (inexistant, aveugle, jamais joué) et l'appuie sur une preuve lue —
jamais une supposition sur ce que « la forge n'a pas vu ».

| Défaut | Quel contrôle aurait dû voir | Pourquoi il n'a pas vu | Preuve |
|---|---|---|---|
| Mot de passe affiché par une page servie | seuil `couverture_surface_interface` (forge-tests, pan interface, bloquant 1.0) | **aveugle** — ce seuil juge que les affordances sont « câblées », pas ce qu'un texte d'aide affiche ; aucune règle de ce pan ne lit le contenu textuel d'un champ pour y chercher un secret | `forge/etapes/tests/rapport-20260905g.json`, section `seuils.couverture_surface_interface` : « porte_sur : affordances (bouton, lien, formulaire) câblées » — le périmètre est la présence d'un gestionnaire, pas l'absence de secret dans le texte |
| Identifiant/mot de passe versionné dans `seed.py` | un grep de secrets au gate de MEP (M-5 propreté) | **aveugle sur ce cas précis** — M-5 vérifie l'absence de `.env` et de motif de clé dans l'**image construite**, pas l'absence d'un identifiant de démonstration **volontairement lisible** dans le code source ; `docs/projet/ACCES-TEST.md` (état avant correctif) qualifiait explicitement ces identifiants de « volontairement triviaux et notoires », donc hors du périmètre qu'un scan de secrets réels couvre | `forge/DOSSIER-MEP.md`, ligne M-5 (« aucun `.env`, aucun motif de clé ») ; `docs/projet/ACCES-TEST.md` avant correctif, section « Comptes de démo » |
| Confusion entre « démonstration active » et « page atteignable depuis Internet » | aucun | **inexistant** — rien dans la doctrine ou l'outillage relu ne distingue, pour une page servie, l'environnement de démonstration de l'environnement public quand les deux coïncident (ce qui était le cas : qualif est à la fois le seul démonstratif et le seul joignable) | absence de tout contrôle de ce nom dans `forge/etapes/tests/rapport-20260905g.json` et dans `forge/DOSSIER-MEP.md` avant le run de version 20260906 |

**Ce qui a été vérifié avant de conclure** (R-35/bloc c) : la lecture du rapport de tests
`rapport-20260905g.json` (le dernier avant le correctif) montre que le seuil interface a rendu
1.0 (bloquant tenu) alors même que le défaut existait — preuve directe que ce gate ne couvrait
pas cette dimension, pas une supposition.

## d — Solutions, par destinataire

**PRODUIT (produit-61)** — déjà fait, remis par la voie du produit (bloc e) :
1. retirer tout identifiant/mot de passe du texte servi par la page de connexion ;
2. sourcer les comptes de démonstration depuis des variables d'environnement
   (`DEMO_ACCOUNT_*`), jamais depuis une valeur écrite dans le code.

**FORGES** — deux trous à couvrir, proposés en candidature (aucune écriture de ce dossier) :
- un contrôle de contenu textuel des pages admin/connexion cherchant des motifs
  identifiant/mot de passe (pan interface ou pan websec, forge-tests ou forge-websec) ;
- un contrôle de source cherchant des couples identifiant/mot de passe en dur, y compris
  « volontairement triviaux », dans tout fichier qui alimente une page servie.

**PILOT** — candidat à consigner (constat en passant, décision humaine) : la distinction
« démonstration active » / « page atteignable depuis Internet » n'existe dans aucune doctrine
relue ; deux environnements différents qui coïncident (comme ici) ne doivent jamais se couvrir
l'un l'autre pour un contrôle d'exposition.

## e — Correctif et release : CONSTATÉ, par la voie du produit

Le correctif n'a pas été demandé par ce dossier : le produit l'a déjà fait, de lui-même, par
un run de version régulier chaîné au run initial. Ce qui est constaté, sans rien exécuter :

- **Commit** `a9d56b1` (06/09/2026 19:11), run de version 20260906, brief
  `forge/BRIEF-DELTA-20260906.md`, chaîné au run précédent ;
- **Tests** : `backend/tests/test_version_20260906.py::test_E075_aucun_identifiant_affiche`
  vérifie qu'aucun couple identifiant/mot de passe de démonstration n'apparaît dans la page de
  connexion rendue ; suite complète à 121 tests verts (ledger, entrée d'étape `tests`,
  06/09/2026 17:09) ;
- **MEP** : `forge/DOSSIER-MEP.md`, section « Run de version 20260906 » — M-5 propreté PASS
  (« `git grep` sans clé ni mot de passe de démo »), déploiement qualif confirmé ;
- **Confirmation indépendante et postérieure** : l'audit du 09/09/2026 (entrée d'étape `audit`
  du ledger) mesure à nouveau la qualif servie et note explicitement « 0 identifiant exposé » —
  le correctif tient neuf jours après sa livraison, sans régression ;
- **État courant** : les fichiers du correctif (`connexion.html`, `seed.py`, `config.py`,
  `.env.example`) sont identiques entre le commit `a9d56b1` et l'état lu ce jour (aucune
  modification entre les deux) ;
- **Production** : toujours non déployée à ce jour (GO humain Q-01 encore ouverte) ; le
  correctif vit donc uniquement sur l'environnement qualif, qui reste l'unique environnement
  public du produit.

## f — Retours aux forges

Aucun lot nouveau porté par ce dossier : les deux candidatures du bloc d (contrôle de contenu
textuel, contrôle de secrets « triviaux » en source) sont consignées ici en candidature, pas
écrites ailleurs — la décision de les instruire en TF reste humaine.

---

## Verdict proposé

**`corrige`** — le défaut décrit par le dépôt (identifiant/mot de passe affichés sur une page
servie) n'existe plus dans le code courant, le correctif est daté et testé, et une mesure
indépendante huit jours plus tard confirme l'absence de régression. La preuve visuelle au
navigateur sur l'URL réelle n'a pas été rejouée par cette instruction (écart déclaré en a) ;
c'est la seule réserve.
