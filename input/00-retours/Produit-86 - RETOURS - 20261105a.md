# Retours forges — Produit-86 — 20261105a

- **Contexte** : revue du porteur du 05/11/2026 sur la préproduction : saisie « costcontrol » au périmètre d'un mandat client, refus affiché en bandeau « Refusé : CIBLE_INVALIDE » en tête de page. Consigne : « Il y a de toute évidence un gros problème dans le design, l'accessibilité du formulaire et la gestion des erreurs à revoir complètement dans la Factory. » S'y ajoutent les deux retours du 03/11 restés sans lot (seq 211, 212).
- **Références ledger** : `forge\ledger.jsonl` seq 442 (gestion des erreurs de formulaire), 211 (forge-tests, outil Python hors de backend/), 212 (pilot, `--run` de `forge/ledger.py`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 :
- `grep -ciE "erreur.*(champ|formulaire)|aria-invalid|validation.*(champ|saisie)|formulaire.*erreur" todo/TODO.jsonl` → 13 lignes, aucune sur la gestion des erreurs de saisie (404, provenance de colonnes, champs de rapports). RP-12 propose sa classe.
- RP-13 et RP-14 reprennent les retours seq 211 et 212 du 03/11, consignés au ledger sans lot. `todo/CLASSES.json` (227 classes) relu : `banc-de-tests-hors-format-non-reconnu` vise un format de test, pas une disposition de projet ; `type-de-ledger-prescrit-refuse-par-l-ecrivain` vise un type, pas un champ. Chacun propose sa classe.

## digit-ai-forge-design

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-12 | majeur | générique | **Demande du porteur du 05/11/2026** : une saisie refusée s'affichait en bandeau en haut de page, loin du formulaire, avec un code technique en titre (« Refusé : CIBLE_INVALIDE »), sans désigner le champ ni la ligne fautive, avec un exemple générique, et seulement à l'envoi. Le champ n'avait ni `aria-invalid` ni message relié. Les 15 juges de `run-oracles-design` avaient rendu PASS sur ces écrans le 04/11 (`forge/etapes/design/rendus-mode-client/mission-client.json`) : aucun juge n'envoie de saisie fausse ni ne regarde où tombe l'erreur. La forge ne fournit ni composant d'erreur par champ, ni règle de vérification au champ, ni règle d'écriture du message d'erreur. Corrigé au produit (exigence E-126) : règles rassemblées côté serveur, erreur sous le champ, `aria-invalid` et `aria-describedby`, résumé d'erreurs à liens focalisé, vérification à la sortie du champ, effacement dès la correction, envoi fautif retenu avec focus sur le premier champ, message qui reprend la saisie et donne la forme corrigée (« costcontrol » → « costcontrol.domaine-du-client.fr »). Ledger seq 442. **RP-12** : clé proposée `erreur-de-saisie-sans-champ-designe`. | (1) un composant de saisie au socle (`digit-ai-page-html`) : erreur sous le champ, état invalide et liaison ARIA, résumé à liens focalisé, vérification à la sortie du champ (« punir tard, récompenser tôt »), envoi retenu ; il fixe aussi la mise en évidence admise, `oracle-slop` S1 refusant le filet latéral de 4 px du motif de référence ; (2) un `oracle-erreurs-formulaire` joué sur l'instance servie : une valeur fausse par champ, puis il exige une erreur liée au champ, visible dans la fenêtre près du champ, qui reprend la saisie et porte un exemple ; (3) `ECRITURE.md` : un message d'erreur reprend la saisie et donne la forme corrigée, jamais un code en titre. |

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-13 | majeur | générique | (seq 211, 03/11) `forge_tests` ne sait pas juger un outil Python autonome rangé hors de `backend/` (`outils/compteur-foundry`) : pan back non couvrable faute de paquet app/src et d'environnement, `couverture_par_pan` vide, verdict PARTIEL alors que l'outil a 11 tests verts (`rapport-20261103-compteur-foundry.json` : code 3, 0 pan couvert sur 2 demandés). | accepter une racine Python plate (modules `.py` et `tests/` voisins) et un interpréteur désigné par option (`--python <chemin>`) pour les pans back et mutation. |

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-14 | mineur | générique | (seq 212, 03/11) `forge/ledger.py` ne peut pas écrire le champ `run` d'un `run_open` : `--run` est consommé comme sélecteur d'archive, et un second `--run` lève `TypeError` (« ajouter() got multiple values for argument 'run' ») ; l'entrée 207 est partie sans identifiant de run, rectifiée en seq 208 par `ledger.mjs`. | renommer le sélecteur d'archive (`--archive`) ou écrire `--run` dans l'entrée quand le type est `run_open`, `run_close` ou `rectification_*`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'entrée seq 442 a d'abord été écrite avec des guillemets en trop dans ses champs texte (valeurs passées en JSON à `forge/ledger.py`, qui ne décode que `{` et `[`) | ligne réécrite sur place dans la minute, avant tout commit ; `ledger.py --verifier` relu | non | erreur d'appel de la session, corrigée |
| Le contrat d'API `docs/projet/openapi.json` n'avait pas été régénéré depuis le premier commit (29 chemins au lieu de 35) | régénéré depuis `app.main:creer_app` | non | rattrapé dans ce tour |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261104b) |

## Garde-fou de plateforme relevé

Aucun nouveau garde-fou heurté. GFP-005 (stratégie de contrôle d'application Windows) reste celui des lots précédents.

## Confirmations positives

- `run-oracles-design --rendu --instance` a rendu PASS (13 et 15 juges) sur les écrans d'erreur capturés après correction, et `oracle-slop` S1 a fait retirer un filet latéral décoratif.
- Les oracles de conception ont fait reformuler E-126 (prédicat observable, geste indiqué, pronom) avant son entrée au référentiel.

## Ordre recommandé

1. RP-12 : demande explicite du porteur, et tout produit à formulaire est exposé.
2. RP-13 : un outil livré reste sans verdict de tests.
3. RP-14 : contournement connu (`ledger.mjs`).

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RP-12 suit un retour humain. La règle qui l'aurait évité : une saisie refusée se dit sous son champ, dès sa sortie, avec la saisie reprise et la forme attendue ; un juge l'éprouve sur l'instance servie avant toute livraison d'un formulaire.

Trois retours n'ont aucune clé du référentiel qui convienne ; chacun propose sa classe :

- **RP-12** : clé proposée `erreur-de-saisie-sans-champ-designe`, famille `affordance-ui`, libellé « Une saisie refusée ne désigne pas son champ et ne dit pas la forme attendue ».
- **RP-13** : clé proposée `outil-autonome-hors-application-sans-verdict-de-tests`, famille `contrat-interface-forge`, libellé « Un outil Python autonome rangé hors de l'application principale ne peut recevoir aucun verdict de la forge de tests ».
- **RP-14** : clé proposée `champ-d-entree-capture-par-une-option-de-l-ecrivain`, famille `tracabilite-ledger`, libellé « Un champ d'entrée de ledger porte le nom d'une option de l'écrivain et ne peut pas être écrit ».
