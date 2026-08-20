# Retours forges — nhood-cockpit-ia — 20260820a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : exploitation de l'environnement déployé `cockpit-ia-d1`, 19 et 20/08/2026.
  Deux défauts constatés en ligne par le porteur, capture à l'appui, sur un produit dont les
  parcours étaient **verts de bout en bout** (68 parcours Playwright sur le bundle de
  déploiement) : le bouton de déconnexion avait disparu de l'environnement déployé, puis,
  une fois revenu, il déconnectait le compte Microsoft du navigateur entier — messagerie
  comprise — là où l'attendu était de sortir de l'application seule. Les deux corrigés et
  déployés le 20/08. Le lot ne remonte pas ces défauts, qui appartiennent au produit, mais
  les **trois angles morts d'outillage** que leur diagnostic a rendus visibles.
- **Références ledger** : `forge\ledger.jsonl` seq 76, 77, 78 (entrées `type: retour`)
- **Lot précédent** : aucun. Premier lot de ce produit, d'où l'amorce des séquences en `-1`.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-20

**Numérotation** : ce produit ouvre ses séquences. RT-1, RT-2 (forge-tests), RC-1
(forge-conception), RS-1 (pilot). Aucun id TF cité : rien dans le registre remis à ce jour ne
porte ces classes.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Vérification préalable, faite avant rédaction.** Les trois retours ci-dessous demandent des
généralisations, pas des inventions : le catalogue d'invariants réclamé en RT-1 existe en
pièces détachées dans le produit (chaque suite de mode affirme les siennes) ; la notion de
portée réclamée en RC-1 est déjà écrite dans le produit, mais après coup — il s'agit de la
faire exiger **avant** ; la vérification d'écart réclamée en RS-1 est le pendant exact du
retour seq 72 (« un changement de réglages ne suffit pas : vérifier que le processus a
redémarré »), déjà admis par le pilot.

---

## forge-tests (`digit-ai-forge-tests`)

Deux retours, une même racine : **une suite de tests affirme ce que son auteur avait en tête,
et rien ne lui demande ce qu'elle a omis.** Les deux défauts constatés en ligne sont passés
sous 68 parcours verts — non par faiblesse d'un parcours, mais faute de poser la question
« qu'est-ce que cette suite n'affirme pas, que la suite voisine affirmait ? ».

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-1 | majeur | **La couverture est organisée par mode, pas par invariant : une régression d'un mode à l'autre est structurellement invisible.** La bascule EasyAuth du 17/08 a produit une suite neuve (`e2e/easyauth/`, 13 parcours) qui affirme l'entrée, les rôles et les refus — mais aucune des assertions que la suite SSO portait déjà (`e2e/profils/connexion-profils.spec.ts:205`, « la déconnexion referme réellement la session »). Résultat mesuré : le bouton de déconnexion, conditionné à `ssoConfigure()` dans `src/components/app-header.tsx`, a disparu de l'environnement déployé — où aucune des cinq variables du SSO applicatif n'est posée — pendant **trois jours**, sous 68 parcours verts, jusqu'à ce que le porteur le voie. | Faire produire par la forge, pour toute famille de suites parallèles (ici : les modes d'authentification), un **catalogue d'invariants partagé** exécuté par chaque membre de la famille, et **signaler comme trou de couverture** toute assertion présente dans une suite sœur et absente ici. C'est une comparaison inter-suites, pas une métrique de plus. |
| RT-2 | majeur | **Un parcours qui affirme la PRÉSENCE d'un élément d'interface laisse passer un élément qui en fait trop.** Preuve par notre propre correctif, et c'est la partie gênante : le parcours écrit le 19/08 pour couvrir RT-1 affirmait `expect(location).toContain("/.auth/logout")`. Il était **vert sur le comportement défectueux**, `/.auth/logout` (déconnexion complète, qui ferme le compte Microsoft du navigateur) et `/.auth/logout/complete` (déconnexion de l'application seule) partageant ce préfixe. Le défaut n'a pas été trouvé par le test écrit pour lui, mais par un humain qui a cliqué. | Quand un parcours affirme un lien, une action ou une redirection, exiger une assertion **de cible exacte** (égalité, ou appartenance à un ensemble énuméré), et refuser un `contains` sur un chemin dont un préfixe est lui-même un chemin valide de l'application. Vérifiable statiquement sur les fichiers de parcours, sans exécution. |

## forge-conception (`digit-ai-forge-conception`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RC-1 | majeur | **Déléguer un geste d'identité à un fournisseur sans en trancher la PORTÉE fait hériter du comportement le plus large, en silence.** La spec de bascule EasyAuth (ledger seq 69-75) a correctement décidé de déléguer les écrans d'identité à Entra — règle du seq 74, elle reste juste. Elle n'a nulle part décidé **où s'arrête** la déconnexion. Le produit a donc appelé `/.auth/logout`, qui purge la session App Service **puis enchaîne sur le point de déconnexion d'Entra** : cliquer « se déconnecter » du Cockpit fermait la session Microsoft du navigateur, Outlook et Teams compris. Constaté en production par le porteur le 20/08, corrigé le jour même (`/.auth/logout/complete` plus expiration explicite des cookies `AppServiceAuthSession`). | Ajouter aux artefacts de conception une **rubrique obligatoire « portée » pour tout geste délégué à un fournisseur d'identité** (connexion, déconnexion, révocation, changement de compte), à trancher parmi trois niveaux nommés : session applicative seule · session du fournisseur sur cet appareil · comptes fédérés. Une spec de délégation sans ce champ est incomplète, et le self-test de la forge peut l'exiger. Le principe se généralise au-delà de l'identité : **le défaut d'un fournisseur est toujours le plus large, et l'omission vaut adoption**. |

## pilot (`digit-ai-forge-pilot`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RS-1 | majeur | **Un pipeline qui crée une ressource d'identité hors IaC laisse l'infrastructure décrire un environnement qui n'existe pas — et un contrôle de sécurité inerte sans que rien ne le dise.** Mesuré sur `cockpit-ia-d1` le 19/08 : EasyAuth actif côté plateforme (clientId `4f0167c7-…`, redirection Entra vérifiée), mais app settings **sans** `COCKPIT_EASYAUTH` ni `AZURE_TENANT_ID` — le module Terraform ne les écrit que si `client_id_entra` lui est fourni, or l'app registration avait été créée par un pipeline séparé qui ne rendait pas l'identifiant à l'IaC. Deux conséquences : l'application ne tenait que par un repli (`WEBSITE_AUTH_ENABLED`) prévu comme filet, et le **contrôle de tenant du décodeur de principal était inerte**, alors qu'un parcours e2e (« un principal d'un AUTRE tenant est refusé ») l'affirme actif. Un test vert attestait d'un contrôle absent de la cible. | Deux gestes à l'étape MEP : (1) **tout pipeline qui crée une ressource rend son identifiant à l'IaC** (variable, tfvars, sortie consommée) — aucun réglage ne doit dépendre d'une valeur que l'IaC ignore ; (2) **vérification d'écart post-déploiement** : comparer les réglages SERVIS à ceux qu'exige le mode déclaré, et échouer si un réglage de sécurité manque. C'est le pendant exact du retour seq 72, déjà admis, sur le redémarrage du processus. |

## Confirmations positives

Ce qui a tenu, et qui a permis le diagnostic :

- **Deux drapeaux distincts plutôt qu'un** (`COCKPIT_AUTH` dit ce qu'on sert, `COCKPIT_EASYAUTH`
  dit ce qu'on peut croire, ledger seq 71) : c'est cette séparation qui a rendu l'écart de
  configuration lisible en une commande, et elle a empêché l'usurpation par en-tête sur un
  environnement déclaré en easyauth avant que la plateforme n'y soit branchée.
- **La règle du seq 46** — jouer tous les profils en local d'abord, contre un fournisseur
  d'identité de test, sans attendre le fournisseur réel : c'est elle qui a rendu le mode
  EasyAuth exerçable sur un poste. Le correctif du 19/08 a pu être **prouvé** (parcours rendu
  rouge sur le code d'avant, vert après) sans aucun déploiement intermédiaire.
- **Le retour seq 72** (un changement de réglages ne relance pas le processus) s'est vérifié
  deux fois de plus le 20/08 : redémarrage forcé après chaque changement, sans quoi l'ancien
  environnement continuait d'être servi.

## Ordre recommandé

1. **RT-2** — le meilleur rapport gain/effort : une règle statique sur les fichiers de parcours,
   vérifiable sans exécution, qui aurait attrapé le défaut que le test écrit pour lui a laissé
   passer. Elle protège toutes les suites existantes, pas seulement celles de ce produit.
2. **RC-1** — la racine. RT-1 et RT-2 attrapent la conséquence ; la rubrique « portée » empêche
   la décision d'être omise. Coût faible (un champ obligatoire), portée large (tout geste délégué).
3. **RT-1** — la comparaison inter-suites est le plus gros morceau des trois, et le plus
   structurant : elle transforme « ce que l'auteur a pensé à écrire » en « ce que la famille de
   suites affirme ».
4. **RS-1** — déjà à moitié admis (seq 72). Le compléter ferme la classe entière des écarts
   entre l'infrastructure décrite et l'infrastructure servie.
