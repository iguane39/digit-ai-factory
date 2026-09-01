# Retours forges — contrats d'intégration OVH et Cloudflare, établis par la pratique — 20260825a

- **Contexte** : deux journées d'opérations réelles sur les API OVH et Cloudflare — création
  de jetons, réécriture de quatre zones DNS, migration vers Cloudflare avec préservation de
  la messagerie. Chaque fait ci-dessous a été **mesuré**, pas lu dans une documentation.
  Aucun n'était disponible avant d'avoir été payé par un aller-retour ou une erreur.
- **Références** : sessions des 23, 24 et 25/08/2026 sur `Produit-02.com`. Ce lot
  fournit la matière que réclamait **RT-12** du lot `20260823c` — un `INTEGRATIONS.md` par
  projet — pour deux des onze sources inventoriées.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Pourquoi ce lot n'est pas un rapport de défauts

Les lots précédents remontaient des défauts. Celui-ci remonte de la **connaissance
opérationnelle** : ce qu'il faut savoir avant de toucher à ces deux services, et que rien
nulle part ne dit. Chaque ligne a coûté quelque chose — un jeton créé pour rien, une heure
de validation figée, une affirmation fausse livrée à l'exploitant. Écrite ici, elle ne coûte
plus rien à la session suivante.

Le critère de sélection est simple : ne figure ci-dessous que ce qui **contredit l'attente
raisonnable**. Ce qui se devine n'y est pas.

## OVH — ce qu'il faut savoir avant d'y toucher

Ce chapitre couvre la création du jeton, sa portée réelle, et les limites structurelles du
service de zone DNS. Les trois premiers points ont coûté deux jetons inutilisables.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-22 | majeur | **Six faits sur l'API OVH, tous mesurés, aucun documenté là où on les cherche.** (1) La page de création de jeton, `https://www.ovh.com/auth/api/createToken`, répond **200 en GET et 404 en HEAD** — une sonde `curl -I` la déclare morte à tort. (2) Dans le formulaire, chaque droit doit être ajouté par le bouton `+` : valider sans cliquer enregistre les méthodes avec un **chemin vide**, et le jeton ne donne accès à rien — `403 This call has not been granted` sur tout, y compris la ressource visée. (3) La portée réellement accordée se lit par `GET /auth/currentCredential`, seul appel toujours autorisé ; c'est la seule vérification fiable. (4) Le `*` des droits **traverse les barres obliques** : `/domain/zone/x/*` couvre `/domain/zone/x/record/123`. (5) Mais `/domain/zone/*/*` **ne couvre pas** `/domain/zone` — énumérer les zones du compte exige ce droit à part. (6) Un jeton scopé aux zones **ne couvre pas** `/domain/<nom>/nameServer` : changer les serveurs de noms exige `/domain/*`, découvert au moment précis où l'on en avait besoin. | Ces six lignes vont dans l'`INTEGRATIONS.md` du projet (RT-12) et dans le gabarit `.env.example` (RT-20), en commentaire au-dessus des clés `OVH_*`. Coût nul, elles sont déjà écrites. |
| RT-23 | majeur | **La redirection DNS d'OVH n'écoute pas le port 443.** Mesuré directement : `443 FERMÉ` sur `213.186.33.5`, `80 ouvert`. Toute redirection posée par `POST /domain/zone/<zone>/redirection` est donc **HTTP seulement**. L'objet retourné par l'API ne porte aucun champ SSL — rien n'y signale la limite : `{subDomain, target, type, title, keywords, description}`. Conséquence payée : sept hostnames sur huit déclarés fonctionnels après une mesure en `http://`, et injoignables en `https://`. Deux notes utiles au passage : les types valides sont `visible`, `invisible` et `visiblePermanent` (= 301, le seul qui transfère l'autorité) ; et **supprimer une redirection supprime aussi les enregistrements `A` et `TXT` qu'OVH lui associait**, ce qui évite un nettoyage manuel mais surprend si on ne l'attend pas. | Écrire la limite dans le contrat d'intégration comme une **contre-indication**, pas comme une note : « redirection OVH = HTTP seul, inutilisable dès qu'un visiteur peut arriver en HTTPS », c'est-à-dire toujours. Un mécanisme dont la limite est connue avant se remplace par un autre ; découverte après, elle coûte un changement d'architecture. |
| RT-24 | mineur | **Les marqueurs de parking OVH ressemblent à des enregistrements légitimes.** Une zone parquée porte des `TXT` de la forme `"1|www.exemple.com"`, `"3|welcome"`, `"4|https://…"`. Ce sont des artefacts internes au parking OVH, sans aucun sens hors de chez eux. Migrés tels quels vers un autre fournisseur — ce que fait toute copie aveugle — ils deviennent des `TXT` parasites à la racine du domaine, là où vivent le `SPF`, le `DMARC` et les vérifications de propriété. | Liste des motifs à écarter dans le contrat d'intégration : `TXT` commençant par `<chiffre>|`, et `A` pointant vers `213.186.33.5`. À rapprocher de l'exclusion `input\` demandée en RT-1 : même famille, des artefacts de fournisseur pris pour de la matière du projet. |

## Cloudflare — ce qu'il faut savoir avant d'y basculer

Ce chapitre couvre le modèle de permissions, la migration de zone, et le mécanisme de
redirection. Le point sur le scan automatique est le plus important du lot.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-25 | **bloquant** | **Le scan DNS automatique de Cloudflare peut n'importer strictement rien, en silence.** Mesuré sur quatre zones ajoutées par API : **0 enregistrement importé, 47 manquants**, dont les 12 `MX`, les 4 `SPF`, les 2 clés `DKIM` et les 3 `SRV`. Aucune erreur, aucun avertissement : les zones s'affichent simplement comme prêtes. Basculer les serveurs de noms dans cet état **coupe la messagerie des quatre domaines instantanément**. Le défaut est classé bloquant parce que son mode de défaillance est silencieux et son effet immédiat, irréversible pour les courriels perdus pendant la coupure. | Poser au socle la procédure de migration DNS en quatre temps, dont l'ordre est le correctif : **(1)** lire les enregistrements chez le fournisseur d'origine et les garder ; **(2)** créer la zone cible et **injecter** — jamais se fier au scan ; **(3)** **diffe** la zone cible contre l'origine, enregistrement par enregistrement, et publier le résultat ; **(4)** seulement alors, changer les serveurs de noms. L'étape 3 est un oracle, pas une relecture. Fixture rouge : une zone cible dont il manque un `MX`. |
| RT-26 | majeur | **Le modèle de permissions Cloudflare ne dit pas ce qu'on croit.** (1) Il n'existe **pas** de permission « Account → Zone → Create » : j'en ai inventé le nom et envoyé l'exploitant la chercher dans un menu où elle n'est pas. La création de zone fonctionne avec `Zone:Zone:Edit` plus le compte listé dans *Account Resources* — vérifié, quatre zones créées. (2) La section *Account Resources* n'apparaît **que** si une permission de niveau compte existe ; sans besoin réel, la bonne réponse est de **supprimer la ligne**, car *Zone Resources → All zones from an account* scope déjà le jeton. (3) `GET /user/tokens/verify` donne la validité, et `GET /accounts` l'identifiant de compte — inutile de le faire recopier depuis l'URL du tableau de bord. (4) Une **paire de serveurs de noms identifie le compte** : `dale/magnolia` contre `autumn/hal` a suffi à établir que `Produit-02.fr` appartient à un **autre compte Cloudflare** que les quatre autres domaines. | Les quatre points vont au contrat d'intégration. Le premier vaut au-delà de Cloudflare : **ne jamais dicter un nom d'option d'interface de mémoire**. Soit on l'a vérifié, soit on décrit le résultat cherché et on laisse l'humain trouver l'intitulé — il a l'écran sous les yeux, pas nous. |
| RT-27 | majeur | **Une redirection Cloudflare exige un enregistrement proxifié, et le mécanisme moderne peut être refusé.** (1) Cloudflare ne termine le TLS que pour les hôtes portant un enregistrement **proxifié** : sans lui, le 443 reste fermé et la redirection ne se déclenche jamais. Le motif employé est un `A` proxifié vers `192.0.2.1` — `TEST-NET-1`, RFC 5737, non routable **à dessein** : Cloudflare intercepte à sa périphérie avant toute tentative de joindre une origine. (2) Les *Single Redirects* (`rulesets/phases/http_request_dynamic_redirect`) ont été **refusés** avec `10000 Authentication error` sous un jeton portant pourtant `Zone:Page Rules:Edit` : ils relèvent d'une autre permission. Les *Page Rules* fonctionnent, et `$1` dans la cible préserve le chemin — un lien vers `/gites` atterrit sur `/gites`. (3) Garde-fou indispensable : **aucun `MX`, `SRV`, `CNAME` de messagerie ni clé `DKIM` ne doit être proxifié**. Les proxifier casse le courrier aussi sûrement que les oublier. | Contrat d'intégration, plus un contrôle automatisable : après toute migration, vérifier qu'aucun enregistrement de messagerie n'est proxifié. Deux lignes de code, et le mode de défaillance qu'il couvre est silencieux. |

## Un fait transversal aux deux services

Une zone créée chez Cloudflare reste en statut `pending` et **ne sert absolument rien** tant
que les serveurs de noms pointent ailleurs. Toute la préparation — création des zones,
injection des enregistrements, pose des redirections — est donc **inerte et réversible**.
Le seul geste engageant est le changement de serveurs de noms, et il s'annule en repointant
sur l'ancien fournisseur, dont la zone reste intacte.

Ce n'est pas un détail de confort : c'est ce qui permet de tout préparer et de tout vérifier
avant de rien risquer. Une procédure de migration qui ne s'appuie pas sur cette propriété
travaille sous pression sans raison.

## Confirmations positives

- **Le diff a fait exactement son travail.** Sans lui, la bascule se faisait sur quatre zones
  vides et la messagerie tombait. Il a coûté une quarantaine de lignes.
- **La vérification systématique de portée des jetons a payé trois fois.** Sur les trois
  jetons OVH créés, **deux étaient inopérants** — et `GET /auth/currentCredential` l'a dit en
  deux secondes à chaque fois, avant toute tentative d'écriture.
- **Le garde-fou anti-proxification était utile avant d'être écrit** : il a confirmé que les
  quatorze enregistrements de messagerie des quatre zones étaient corrects.

## Ordre recommandé

1. **RT-25** — le seul bloquant du lot, et le seul dont le mode de défaillance est à la fois
   silencieux et immédiat.
2. **RT-27** — les deux pièges qui font échouer une bascule après coup, alors que tout
   paraissait en place.
3. **RT-22** et **RT-23** — le contrat OVH, dont la limite du port 443 conditionne le choix
   même du mécanisme de redirection.
4. **RT-26**, **RT-24** — connaissance utile, sans effet de bord immédiat.
