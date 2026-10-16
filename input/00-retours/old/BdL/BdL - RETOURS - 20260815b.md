# BdL — RETOURS — 20260815b

Second lot du produit BdL, compilé le 15/08/2026 après la clôture du run de version
20260815b-bdl. Déclencheur : remarque humaine sur l'URL de recette
(`brasserie-du-lac-recette-production.up.railway.app` — doublon service+environnement) et
le défaut qu'elle a révélé (URLs absolues sur localhost en production). Trois candidatures :
chaque maillon qui aurait dû attraper l'un ou l'autre avant l'humain.

## R1 — pilot : R-24 jugeable mécaniquement, jugée « revue humaine »

`oracle-conformite-projet` a rendu PASS avec, sur la ligne d'environnement **qualif** de
`PARAMETRAGE.md`, une URL suffixée `-recette-production` (constat du 15/08/2026, commit
`528bd10` du produit). Sa règle R-24 déclare en `non_juge` : « la correspondance
nom-appli ↔ nom réel reste une revue humaine » — or le suffixe est mécaniquement jugeable :
l'URL de la ligne `qualif` doit porter `-qualif.`, celle de `production` `-production.`,
et un doublon `<env1>-<env2>` est toujours un défaut. Effet aggravant constaté : le run a
**documenté l'écart en prose** au lieu de le corriger, et l'oracle n'a rien vu — c'est
l'humain qui a relevé le défaut après livraison. Proposition : juger le suffixe (FAIL si
discordant), et n'accepter un écart que déclaré en champ structuré, jamais en note.

## R2 — forge-tests : le pan qualif ne confronte pas les URLs auto-référentes à l'origine auditée

Le pan qualif a parcouru **184/184 routes** de l'instance servie et rendu vert alors que la
canonique, les 7 `<loc>` du sitemap, le `url` du JSON-LD et `og:url` pointaient tous
`http://localhost:8000` (constat du 15/08/2026, corrigé au run 20260815b-bdl — 26 tests
ajoutés côté produit). Règle proposée, mécanique : toute URL absolue **auto-référente**
d'une page servie (canonical, og:url, sitemap, JSON-LD `url`/`@id`) porte l'origine de
l'instance auditée (`FORGE_TESTS_QUALIF_URL`) ou l'origine déclarée du produit — sinon
FAIL. Ce défaut est invisible aux tests unitaires (TestClient = hôte de test légitime) :
seul l'auditeur d'instance servie est placé pour le voir.

## R3 — forge-ops : complément fiche expert-ops-railway (domaines)

À verser à la fiche en complément du retour R6 du lot 20260815a : (a) le domaine généré
par Railway concatène `<nom-service>-<nom-environnement>.up.railway.app` — avec un service
nommé « -recette » dans l'environnement par défaut « production », on obtient un doublon
contradictoire ; le renommage selon R-24 (`<appli>-qualif`) fait partie du déploiement
type ; (b) le CLI **ne sait pas renommer** un domaine existant (`railway domain` répond
« Domains already exist ») — seule la mutation GraphQL `serviceDomainUpdate` le fait, et
ses 5 champs sont TOUS requis (serviceDomainId, domain, environmentId, serviceId,
targetPort) ; (c) poser l'origine publique du produit en variable (ici `BDL_URL_BASE`)
fait partie du déploiement type, faute de quoi les URLs auto-référentes du produit sortent
sur l'hôte interne (cf. R2). Constats du 15/08/2026, run 20260815b-bdl.
