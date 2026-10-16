# Retours forges — Produit-12 — 20260831b

- **Contexte** : incident de session du 2026-08-31, mandat humain de remontée immédiate — la
  façon de se connecter à Railway par jeton a été **perdue pour la seconde fois** : la session
  a déclaré le déploiement v0.4.0 « bloqué, geste humain requis » alors qu'un jeton valide
  était disponible sur le poste. Le déploiement est parti dans la même soirée, une fois le
  principe retrouvé.
- **Références ledger** : `forge\ledger.jsonl` seq 98 (le blocage déclaré à tort), seq 100
  (le retour), seq 101 (le déploiement réussi par jeton)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-08-31 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RS s'arrêtait à RS-21 (lot 06).

---

## pilot (`digit-ai-factory`) — étape MEP

Un seul constat, mais il s'est produit **deux fois sur le même produit**, à quinze jours
d'écart, et la seconde fois APRÈS que la première avait été remontée et archivée au registre.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-22 | majeur | générique | **Le principe de connexion à Railway par jeton n'est un artefact d'AUCUN référentiel de la route MEP — il ne survit donc pas d'une session à l'autre, et chaque session le reperd.** Épisode 1 (2026-08-16, lot 05) : la session découvre l'API GraphQL (`backboard.railway.com/graphql/v2`, Bearer) pour renommer le domaine — RS-11/RS-13 remontés, archivés au registre du pilot (TF-0704). Épisode 2 (2026-08-31, cette session) : `railway status` répond `Unauthorized. Please run railway login again.` ; la session consigne « déploiement bloqué, reconnexion OAuth navigateur hors de portée de l'agent » (ledger seq 98) et rend une action `manuelle_utilisateur` motif `acces` — **attribution fausse** : trois jetons de 36 caractères vivaient sur le poste (`C:\dev\devplace.pro\.env` → `RAILWAY_API_TOKEN` de compte ; `C:\dev\Produit-07\site\.env.local` et `C:\dev\DashboardMail\.env` → `RAILWAY_TOKEN` + ids de projet), chacun documenté dans le CLAUDE.md de SON produit — jamais dans celui-ci, ni dans le socle, ni dans la route MEP du pilot (le DOSSIER-MEP gabarisé prescrivait `railway login`). Le CLI honore `RAILWAY_API_TOKEN` en variable d'environnement **sans aucun login** : `railway whoami` a répondu du premier coup, `railway up` a déployé la v0.4.0 dans la foulée. Coût mesuré : un aller-retour humain complet (restitution + contre-ordre), une entrée de ledger fausse, et une action humaine inventée — c'est exactement la classe d'attribution non éprouvée que la règle S21 de la consigne de restitution combat, sauf qu'ici la tentative avait EU sa trace (le 401 du CLI) et que c'est la **connaissance du repli** qui manquait | Faire du principe un artefact hérité, pas un souvenir : (1) la fiche `ACCES-TEST.md` du socle (R-20) gagne une ligne OBLIGATOIRE « déploiement » dans son tableau « Accès aux environnements réels » — mécanisme (`RAILWAY_API_TOKEN` en variable d'environnement, jamais `railway login` en session agent) et localisation du jeton sur le poste ; (2) la route MEP du pilot documente le repli d'authentification AVANT le premier `railway up` d'un produit, et son gabarit de DOSSIER-MEP cesse de prescrire `railway login` ; (3) un contrôle de la route MEP échoue TÔT avec « jeton absent, attendu à <emplacement> » plutôt que de laisser la session conclure au geste humain — une impossibilité d'accès ne se déclare qu'après avoir tenté le repli documenté |

## Remarques restées au produit

Deux corrections locales ont été faites dans la même session, chacune avec son verdict de
généralisation écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `docs\projet\ACCES-TEST.md` ne disait pas où vit l'accès de déploiement Railway (le tableau « environnements réels » s'arrêtait aux variables du service) | ligne « déploiement production » ajoutée au tableau, nommant le mécanisme et l'emplacement du jeton sur le poste | oui | c'est le point (1) de RS-22 ci-dessus — la ligne devrait être exigée par le gabarit de la fiche, pas laissée à l'initiative du produit |
| `forge\DOSSIER-MEP.md` §5 prescrivait `railway login` comme unique voie | §5 réécrit : jeton d'abord, `railway login` en dernier recours humain | oui | c'est le point (2) de RS-22 — le gabarit amont doit porter la correction, sinon chaque produit la refera |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-08-31 au soir.

## Confirmations positives

Deux mécanismes ont bien fonctionné dans l'incident, et méritent d'être dits.

- **La trace exigée par la consigne de restitution (règle S21) a fait son office** : le blocage
  déclaré portait le message mesuré du CLI, ce qui a permis à l'humain de contester
  l'attribution en une phrase (« le token est disponible ») au lieu d'un débogage.
- **Le jeton de compte unique a suffi pour tout** : `whoami`, `status`, `up` — aucune
  manipulation de session, aucun navigateur, et le lien projet↔service du poste
  (`~\.railway\config.json`) a été réutilisé tel quel.

## Ordre recommandé

Un seul retour sur ce lot ; son ordre interne est celui des trois points de la proposition —
la fiche d'accès d'abord (une ligne de gabarit), la route MEP ensuite, le contrôle précoce enfin.

1. **RS-22** — chaque produit du parc qui déploie sur Railway reperdra ce principe tant qu'il
   n'est écrit que dans les CLAUDE.md des produits qui l'ont déjà payé.
