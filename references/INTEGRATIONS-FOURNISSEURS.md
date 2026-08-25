---
role: les faits MESURÉS sur les interfaces de fournisseurs tiers — ceux qu'aucune documentation officielle ne dit là où on les cherche, et dont l'ignorance a coûté un aller-retour au moins une fois
sources_de_verite: [todo/TODO.jsonl (les items qui les ont mesurés, avec leur coût), gabarits/.env.example du projet concerné (les clés et leurs portées)]
verifie_le: 2026-08-25
---

# Faits mesurés sur les interfaces de fournisseurs

**Ce document existe parce qu'une donnée périssable est une donnée, pas du code** (loi transverse
n° 4). Chaque fait ci-dessous a été **mesuré**, il porte sa **date**, et il dit **comment le
rejouer** — parce qu'un fait sur une interface tierce se périme sans avertir, et qu'un fait
invérifiable ne vaut pas mieux qu'une intuition.

**Ce n'est pas une documentation de fournisseur.** On n'y trouve que ce qui **n'est pas écrit là
où on le cherche**, et dont l'ignorance a coûté un aller-retour au moins une fois. Un fait
disponible dans la documentation officielle n'a rien à faire ici : il y vieillirait mal et
personne ne l'y chercherait.

**Précaution de lecture.** Aucun secret ne figure ici, jamais — ni jeton, ni identifiant de compte,
ni clé. Les **noms** de variables et les **portées** à demander, oui : c'est précisément ce que la
prose d'une conversation perd (TF-0588).

---

## OVH — API et zones DNS

*Mesuré les 24 et 25/08/2026 par le run `produit-02` (TF-0587, TF-0608, TF-0610).*

### Ce qui coûte si on l'ignore

| Fait mesuré | Ce que ça coûte | Comment le rejouer |
|---|---|---|
| La page de création de jeton répond **200 en GET** et **404 en HEAD** | une sonde `curl -I` déclare la page morte **à tort**, et on cherche ailleurs | `curl -s -o /dev/null -w "%{http_code}" https://www.ovh.com/auth/api/createToken` puis la même avec `-I` |
| Dans le formulaire de jeton, chaque droit doit être **ajouté par le bouton `+`** | valider sans cliquer enregistre les méthodes avec un **chemin VIDE** : le jeton ne donne accès à rien, et tout appel rend `403 This call has not been granted`. **Deux jetons perdus ainsi** | lire la portée réellement accordée, voir la ligne suivante |
| La portée réellement accordée se lit par **`GET /auth/currentCredential`** | c'est le **seul appel toujours autorisé**, donc la seule vérification fiable — et elle prend deux secondes | `GET /1.0/auth/currentCredential` sur l'endpoint EU |
| Le `*` d'un droit **traverse les barres obliques** | `/domain/zone/x/*` couvre bien `/domain/zone/x/record/123` — vérifié empiriquement | comparer la portée accordée à un appel réel sur un sous-chemin |
| Mais `/domain/zone/*/*` **ne couvre PAS** `/domain/zone` | énumérer les zones du compte exige **ce droit à part**, et on le découvre au moment où on en a besoin | demander `GET /domain/zone` explicitement dans la portée |
| Un jeton scopé aux zones **ne couvre pas** `/domain/<nom>/nameServer` | changer les serveurs de noms exige `/domain/*` — découvert au moment précis où il le fallait | `GET /1.0/domain/<nom>/nameServer` avec un jeton scopé aux zones seules |
| La redirection DNS d'OVH **n'écoute pas le port 443** | toute redirection posée par `POST /domain/zone/<zone>/redirection` est **HTTP SEULEMENT**, et l'objet rendu par l'API ne porte **aucun champ SSL** — rien n'y signale la limite | mesure directe : port 443 **FERMÉ** sur `213.186.33.5`, port 80 ouvert (25/08/2026) |

### Points techniques qui font perdre une heure

- **Endpoint EU** : `https://eu.api.ovh.com/1.0`.
- **Signature v1** : SHA1 de `AS + CK + MÉTHODE + URL + CORPS + TS`. Elle est **sensible au temps** :
  appeler `GET /auth/time` d'abord pour calculer le décalage d'horloge.
- **Sous Git Bash**, MSYS convertit les chemins d'API en chemins Windows. `MSYS_NO_PATHCONV=1` est
  **obligatoire**, sans quoi l'URL appelée n'est pas celle qu'on croit.
- **Types de redirection valides** : `visible`, `invisible`, `visiblePermanent`.

### Les marqueurs de parking, qui ressemblent à des enregistrements légitimes

Une zone **parquée** chez OVH porte des artefacts internes au parking, sans aucun sens ailleurs :

- des `TXT` de la forme `"<chiffre>|<valeur>"` — par exemple `1|www.exemple.com`, `3|welcome`,
  `4|https://…` ;
- des `A` pointant vers **`213.186.33.5`**.

**Migrés tels quels vers un autre fournisseur** — ce que fait toute copie aveugle — ils deviennent
des `TXT` parasites **à la racine du domaine**, précisément là où vivent le SPF, le DMARC et les
jetons de vérification de propriété des services tiers. Le `A` est pire : il pointe vers
l'infrastructure de redirection **HTTP seule** d'OVH, donc il **réintroduit le défaut même** qu'on
migre pour corriger.

**À écarter par motif, jamais à l'œil** : un `TXT` commençant par `<chiffre>|`, et un `A` vers
`213.186.33.5`. Même famille que les artefacts de fournisseur pris pour de la matière de projet.

---

## Cloudflare — jetons, zones et redirections

*Mesuré le 25/08/2026 par le run `produit-02` (TF-0611, TF-0612, TF-0613).*

### Le modèle de permissions ne dit pas ce qu'on croit

| Fait mesuré | Ce que ça coûte si on l'ignore |
|---|---|
| Il n'existe **PAS** de permission « Account → Zone → Create » | ce nom a été **inventé de mémoire** et l'exploitant a été envoyé la chercher dans un menu où elle n'est pas. La création de zone fonctionne avec **`Zone:Zone:Edit`** plus le compte listé dans *Account Resources* — vérifié, quatre zones créées |
| La section *Account Resources* n'apparaît **que si** une permission de niveau compte existe | sans besoin réel, la bonne réponse est de **supprimer la ligne** : `Zone Resources > All zones from an account` scope déjà le jeton |
| `GET /user/tokens/verify` donne la validité et le statut du jeton ; `GET /accounts` donne l'identifiant de compte | inutile de faire recopier l'identifiant depuis l'URL du tableau de bord |
| Une **paire de serveurs de noms identifie le compte** | `dale`/`magnolia` contre `autumn`/`hal` a suffi à établir qu'un domaine appartenait à un **autre compte** que les quatre migrés — un fait qu'aucune interface ne dit |

> **La leçon dépasse Cloudflare, et c'est la plus utile du lot** : *ne jamais dicter de mémoire un
> nom d'option d'interface.* Soit on l'a vérifié, soit on décrit le **résultat cherché** et on laisse
> l'humain trouver l'intitulé — il a l'écran sous les yeux, nous non.

### Le scan DNS automatique peut n'importer strictement rien, en silence

**Mesure sur quatre zones ajoutées par API : ZÉRO enregistrement importé, QUARANTE-SEPT manquants**
— dont les 12 `MX`, les 4 `SPF`, les 2 clés `DKIM` et les 3 `SRV`. **Aucune erreur, aucun
avertissement** : les zones s'affichent simplement comme prêtes à basculer.

Changer les serveurs de noms dans cet état **coupe la messagerie des quatre domaines
instantanément**, et les courriels perdus pendant la coupure sont irrécupérables. Le mode de
défaillance est **silencieux**, l'effet **immédiat**, la perte **définitive** : c'est ce qui classe
ce fait au plus haut.

**La procédure de migration DNS et son ORDRE — qui EST le correctif — vit chez forge-ops**
(`docs/migration-dns.md`), avec le contrôle de différence qui en est l'étape 3.

### Redirections : ce qui les fait fonctionner, et ce qui les casse

- Cloudflare ne termine le **TLS** que pour les hôtes portant un enregistrement **proxifié**. Sans
  lui, le 443 reste fermé et la redirection ne se déclenche **jamais**.
- Le motif employé est un `A` **proxifié** vers **`192.0.2.1`** — TEST-NET-1 (RFC 5737), **non
  routable à dessein** : Cloudflare intercepte à sa périphérie avant toute tentative de joindre une
  origine.
- Les **Single Redirects** (phase `http_request_dynamic_redirect`) ont été **refusés** avec
  `10000 Authentication error` sous un jeton portant pourtant `Zone:Page Rules:Edit` — ils relèvent
  d'une **autre permission**. Les **Page Rules** fonctionnent avec ce droit, et **`$1`** dans l'URL
  cible **préserve le chemin** : un lien vers `/gites` atterrit sur `/gites` et non sur l'accueil,
  ce qui change tout pour le référencement. *Réserve à noter : Cloudflare considère les Page Rules
  comme héritées.*
- **Garde-fou indispensable** : **aucun** `MX`, `SRV`, `CNAME` de messagerie ni clé `DKIM` ne doit
  être proxifié — les proxifier **casse le courrier aussi sûrement que les oublier**. Le contrôle
  automatisable qui le vérifie après migration vit chez forge-ops.

---

## Ce que ce document ne garantit pas

- **Il vieillit, et vite.** Les faits ci-dessus sont datés des 24 et 25/08/2026. Une interface de
  fournisseur change sans avertir : chaque ligne porte donc **comment la rejouer**, et une ligne
  qu'on ne sait plus rejouer doit être **retirée** plutôt que conservée par prudence.
- **Il ne couvre que ce qui a été payé.** Aucun fait n'y figure « au cas où » : un fait sans coût
  mesuré n'a ni preuve ni raison d'être retenu, et il diluerait ceux qui en ont une.
- **Il ne remplace pas le réceptacle.** Les clés et leurs portées vivent dans le
  `.env.example` du projet concerné, jugé par `oracles\oracle-parite-configuration.mjs` (TF-0588,
  TF-0589) : *un secret attendu se prépare, il ne se décrit pas en prose.* Ce document explique le
  **pourquoi** d'une portée ; le gabarit porte le **quoi**.
- **Il ne dit rien des tarifs ni des quotas** : ce sont des données commerciales, elles se périment
  plus vite encore, et aucune décision de dépense ne se prend sans l'humain (R-29).
