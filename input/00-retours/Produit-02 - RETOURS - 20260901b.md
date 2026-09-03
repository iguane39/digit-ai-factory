# Retours forges — la page que personne ne conçoit : la 404 — 20260901b

Lot de retours du produit *Produit-02*, remis le 01/09/2026 sur demande explicite
de l'exploitant : « remonter ce point à la factory pour toujours personnaliser la 404 avec
menu dans toutes les langues sur les sites créés — un standard qui aurait dû être vu et créé
d'office ». Le lot porte **un** retour, avec le standard proposé, sa réalisation de
référence livrée le jour même sur ce produit, et le piège d'implémentation mesuré en route.

## Contrôle de complétude

Le ledger du produit porte, depuis la remise du lot précédent (20260901a, seq 65), **une**
entrée `type: retour` : la seq 76. Ce lot en porte la candidature. Un retour, un
acheminement : rien n'est perdu.

## Le retour — la 404 personnalisée comme standard de tout site créé

**Destinataire : digit-ai-factory · gravité : majeur · ledger seq 76.**

### Le constat, et pourquoi il a la valeur d'un mécanisme

L'exploitant a rencontré, sur son propre site multilingue en production depuis le 25/08, le
404 nu du serveur de fichiers : « The requested path could not be found », page blanche,
sans menu, sans langue, sans issue. Le mécanisme qui l'explique dépasse ce produit : **la
404 est la page que personne ne conçoit parce que personne ne la visite volontairement**.
Aucun gabarit ne la génère, aucun oracle ne la juge, aucune revue ne la voit — elle n'existe
qu'à l'état de comportement par défaut du serveur, et chaque produit redécouvre le défaut le
jour où un visiteur réel tombe dessus. C'est le profil type du standard d'office : un
invariant que tout site devrait porter, et qu'aucune demande de fonctionnalité ne fera
jamais émerger.

### Le standard proposé, en cinq exigences

- **Une 404 par langue, du même gabarit que les autres pages** : menu complet, charte,
  bandeau de consentement, liens de secours (accueil, offre principale, contact). Une
  impasse doit offrir ses issues.
- **Le statut 404 conservé** : une page d'erreur servie en 200 est un soft-404 que les
  moteurs indexent — l'habillage ne doit jamais coûter le code de statut.
- **Non-indexation et exclusion du sitemap**, l'exclusion étant **déclarée** dans l'oracle
  SEO (une page absente du sitemap y est un choix nommé, pas un oubli).
- **La langue se choisit au préfixe du chemin** : `/de/...` inconnu reçoit la 404
  allemande, pas la française.
- **Un contrôle exécutable joue les cas** : adresse inconnue → 404 avec menu ; préfixe de
  langue respecté ; requête non-HTML → 404 nu (les machines n'ont pas besoin d'un menu).

### La réalisation de référence, et le piège mesuré

Livrée sur ce produit le jour même : 14 pages générées (7 langues × 404 + page de retour de
réservation, même mécanique d'exclusion), textes ajoutés aux sept catalogues avec structure
vérifiée, et côté serveur une **enveloppe** de `writeHead`/`write`/`end` autour du serveur
de fichiers plutôt qu'une réimplémentation de sa résolution — deux implémentations de la
même règle feraient deux vérités, la leçon déjà remontée au lot 20260831b. Cinq contrôles
d'oracle jouent le contrat (52 au total sur ce produit, tous verts).

**Le piège d'implémentation, mesuré et documenté pour le suivant** : envelopper `writeHead`
sans envelopper `write` produit une réponse **pendue** — le corps nu du 404 d'origine part
par `write()` avant les en-têtes différés, et le `end()` substitué se brise sur des
en-têtes implicites déjà émis. Première exécution : réponse `000`, serveur vivant. Le
remède tient en une ligne : avaler aussi les écritures du corps d'origine quand le 404 est
intercepté.

## Remarques restées au produit

Une remarque examinée pour généralisation, et son verdict.

- **La page de retour de réservation (`/merci`) partage la mécanique d'exclusion** de la
  404 (hors sitemap, noindex, 7 langues) mais son contenu est propre au moteur de
  réservation de ce produit. Généralisable : **non** en contenu, **oui** en mécanique —
  c'est la même option `horsIndex` du générateur qui porte les deux, et c'est elle que le
  standard ci-dessus décrit.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit `gd-…`** dans ce cycle — les pièces produites
sont des pages du site et des contrôles, jugés par les seize oracles du produit et la
chaîne d'intégration continue.

## Ce que ce lot ne couvre pas, et c'est dit

- **Le patron n'a tourné que sur ce produit** — serveur Node avec serve-handler ; un site
  factory servi autrement (hébergeur statique pur, CDN) devra loger l'exigence « langue du
  préfixe » là où son serveur le permet, et le standard dit le contrat, pas le moyen.
- **Le coût du 404 nu sur ce produit est inconnu** : personne ne sait combien de visiteurs
  l'ont rencontré entre le 25/08 et aujourd'hui — aucun événement ne le mesurait, et c'est
  précisément le genre d'angle mort que le standard ferme.
