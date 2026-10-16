# Retours forges — lot 05 (2026-08-16)

Run `Produit-12-20260805a`, cycle v0.3.0 en production. Refonte de l'écran Stockage
(inspection utilisateur) et reprise du domaine de production. Retours postérieurs au lot 04
uniquement. Références ledger : seq 30 (`railway up`, domaine généré).

---

## steering — étape MEP

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RS-11 | majeur | **L'étape MEP pilote Railway par le CLI, qui ne sait pas tout faire.** `railway service` n'expose que `link`, `status`, `logs`, `redeploy`, `restart`, `scale` — **aucun renommage** ; `railway domain` ne sait qu'**ajouter ou générer**, jamais renommer ni supprimer. La MEP a donc laissé en production le domaine généré par défaut, `app-production-cfe7.up.railway.app`, dérivé du nom de service générique `app`. Le CLI n'offrait aucun moyen de le corriger : le dossier de MEP a enregistré le domaine subi comme un fait acquis (`DOSSIER-MEP.md` §5 ne mentionne que `railway up`) | Piloter Railway par son **API GraphQL** (`https://backboard.railway.com/graphql/v2`, `Authorization: Bearer <jeton>`), le CLI ne servant qu'au téléversement (`railway up`). L'étape MEP gagne alors le renommage de domaine, la lecture d'état et la vérification de disponibilité, tous absents du CLI |
| RS-12 | majeur | **RT-14 (lot 04) traitait le symptôme, pas la cause.** Le pan qualif avait crawlé la mauvaise application faute de marqueur produit dans l'URL ; la correction esquissée portait sur la forge-tests (garde de correspondance). Or la cause est en amont : **c'est la MEP qui produit une URL anonyme**. Un domaine `app-production-<hash>` ne nomme ni le produit ni, de façon lisible, son environnement — tout produit déployé par la forge porte la même forme, et rien ne distingue deux produits l'un de l'autre | La MEP **nomme le domaine** dès le premier déploiement, à partir du nom de projet et de l'environnement (ici `asd-mail-manager-2-production.up.railway.app`), et l'inscrit au dossier de MEP et au ledger. La garde RT-14 côté forge-tests reste utile en défense en profondeur, elle cesse d'être la seule |
| RS-13 | mineur | **Deux pièges de l'API Railway à documenter**, rencontrés en une session : (1) toute requête **sans en-tête `User-Agent` reçoit un 403** du WAF, avant même d'atteindre l'API — symptôme trompeur, qui ressemble à un défaut d'authentification ; (2) un refus de schéma revient en **HTTP 400 avec le seul message « Problem processing request »**, sans indiquer le champ fautif. `ServiceDomainUpdateInput` exige quatre champs non nuls (`serviceDomainId`, `environmentId`, `serviceId`, `domain`) : en omettre deux produit ce message opaque | Poser un `User-Agent` sur tous les appels ; **introspecter le schéma** (`__type(name: …) { inputFields }`) avant d'écrire une mutation plutôt que de la déduire de la documentation ; enregistrer ces deux pièges au mode d'emploi de l'étape MEP |

## Constats de production — refonte de l'écran Stockage

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RS-14 | majeur | **L'écran de connexion d'un stockage affichait simultanément les champs des deux modes Dropbox** (App key, App secret, code d'autorisation *et* jeton direct), derrière un encart replié toujours présent en bas de page. L'utilisateur en a déduit une alternative entre « App key » et « OAuth » — alors que l'App key **est** le `client_id` du flux OAuth. Le formulaire demandait par ailleurs l'App key **deux fois**, et le libellé « Connecter un stockage » portait deux actions différentes sur le même écran | Un choix exclusif se pose **avant** les champs qu'il commande, jamais au milieu d'un formulaire qui les affiche déjà tous. Règle de conception à verser à forge-design : *un panneau de tâche ne coexiste pas avec la liste qu'il alimente, et ne rend que les champs de la branche retenue* |
| RS-15 | mineur | **Le motif « formulaire replié toujours présent » (`<details>` + `data-cible`) est vérifié par un test d'exigence d'interface** appliqué à tous les écrans. Ce motif est bon quand le formulaire est court et unique ; il devient nuisible dès que le formulaire porte des branches exclusives, car le repli masque la contradiction au lieu de la résoudre. Le test a dû être assoupli pour l'écran des connexions | Distinguer dans les exigences d'interface **deux motifs légitimes** — le formulaire replié (création simple) et le panneau adressable (`?nouveau=…`, tâche à branches) — plutôt qu'un seul imposé partout |

---

Rappel de convention : ce lot est figé à la remise ; les retours suivants iront dans un
nouveau fichier de `forge\retours\`, au nommage de la factory (R-18) —
`Produit-12 - RETOURS - AAAAMMJJ<indice>.md`.
