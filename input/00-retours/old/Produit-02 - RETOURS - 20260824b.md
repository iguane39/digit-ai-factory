# Retours forges — sept hostnames sur huit injoignables en HTTPS, et personne ne le mesurait — 20260824b

- **Contexte** : l'exploitant signale que le site n'est pas accessible sur
  `https://Produit-02.com`, seulement sur le `www`. La vérification montre que le
  défaut est bien plus large que le symptôme rapporté, et qu'il avait été **déclaré résolu
  par moi la veille** sur la foi d'une mesure faite sur le mauvais schéma.
- **Références** : session des 23 et 24/08/2026 sur `Produit-02.com`,
  `build/check-redirects.mjs`, zones DNS OVH des quatre domaines. Lots précédents :
  `20260823c` (dont ce lot est la cinquième occurrence du motif) et `20260824a`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui a été affirmé, et ce qui était vrai

Ce chapitre pose l'écart avant d'en tirer quoi que ce soit, parce que l'affirmation fausse a
été livrée à l'exploitant sous forme d'un tableau de contrôle rassurant.

Le 23/08, après avoir écrit les redirections des quatre domaines, j'ai mesuré et publié ceci :

```
Produit-02.com          → https://www.Produit-02.com/   ✅
Produit-02.net          → https://www.Produit-02.com/   ✅
Produit-02.com      → https://www.Produit-02.com/   ✅
Produit-02.net      → https://www.Produit-02.com/   ✅
```

Toutes ces mesures ont été faites en `http://`. Le 24/08, la même vérification en `https://`
donne un résultat opposé : **sept hostnames sur huit échouent au TLS**, seul
`www.Produit-02.com` répond. Cause mesurée : le port **443 est fermé** sur le serveur
de redirection OVH (`213.186.33.5`) ; seul le 80 écoute. La redirection DNS d'OVH est HTTP
par construction.

Le tableau n'était pas faux dans ce qu'il mesurait. Il était faux dans ce qu'il laissait
croire — et c'est ce que l'exploitant en a retenu, légitimement.

## Trois artefacts pour que cela ne se reproduise pas

Les trois retours ci-dessous vont du plus général au plus spécifique : une règle de méthode,
un oracle qui l'applique, et une limite d'intégration à documenter.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-17 | majeur | **Un comportement destiné aux visiteurs a été validé sur un protocole que les visiteurs n'utilisent pas.** Les navigateurs modernes tentent HTTPS en priorité, et un lien partagé porte presque toujours `https://`. Vérifier une redirection en `http://` mesure donc un chemin que la quasi-totalité du trafic n'emprunte pas. Le coût n'est pas seulement l'erreur : c'est qu'elle a été **présentée comme une preuve**, sous forme d'un tableau de huit lignes avec des coches vertes. C'est la cinquième occurrence du motif du lot `20260823c` — une sonde partielle prise pour la mesure complète — mais avec un angle propre : ici la sonde n'était pas incomplète, elle portait sur **le mauvais axe**. | Règle de méthode : un comportement destiné aux visiteurs se vérifie sur le **schéma, la méthode et le protocole qu'ils emploient réellement**, jamais sur le plus commode à tester. Quand plusieurs axes existent — `http`/`https`, `apex`/`www`, `GET`/`HEAD`, avec ou sans barre finale — la matrice se parcourt entière ou l'écart se déclare. À rapprocher du défaut OVH `HEAD` vs `GET` du 23/08, même famille, autre axe. |
| RT-18 | majeur | **Aucun oracle ne vérifie qu'un nom de domaine déclaré répond.** Le seul contrôle voisin, `build/check-redirects.mjs`, teste **des chemins sur une base unique** — 24 anciennes URLs — et jamais des **hostnames**. Le projet en déclare pourtant huit, répartis sur quatre domaines. Aucun n'était contrôlé, ni en existence, ni en schéma, ni en certificat. Preuve supplémentaire du même angle mort : la valeur par défaut de cet oracle pointe encore sur `https://Produit-02-site-production.up.railway.app`, l'URL technique, alors que le site a basculé sur son domaine — personne ne s'en est aperçu parce que rien ne confronte la liste des domaines à la réalité. | Un oracle « domaines déclarés » qui lit l'inventaire des hostnames du projet et vérifie pour **chacun** : résolution DNS, réponse en `https`, validité et nom du certificat, chaîne de redirections aboutissant à l'adresse canonique, et code final. Fixture rouge : un hostname déclaré dont le 443 est fermé — exactement le cas présent. L'inventaire vient du `INTEGRATIONS.md` proposé en RT-12. |
| RT-19 | mineur | **Le mécanisme de redirection a été choisi sans connaître sa limite.** La redirection DNS d'OVH est le geste naturel quand on tient déjà la zone par l'API, et rien dans sa documentation d'API ne signale qu'elle n'écoute pas le 443 : l'objet retourné ne porte que `subDomain`, `target`, `type`. La limite ne se découvre qu'en testant le port. Conséquence concrète ici : le seul remède complet est de déplacer les zones derrière un service qui aplatit le CNAME à l'apex et sert le TLS, ce qui **impose de recréer les enregistrements de messagerie** — un risque sans commune mesure avec le confort initial. | Le contrat d'intégration proposé en RT-12 doit porter, pour chaque service, non seulement la source faisant autorité mais aussi les **limites structurelles connues** : ici « redirection OVH = HTTP seul, port 443 fermé ». Une limite découverte après coup coûte un changement d'architecture ; la même limite écrite avant coûte le choix d'un autre mécanisme. |

## Ce que la correction exige, et pourquoi elle n'est pas appliquée ici

Ce chapitre existe pour que le lot ne laisse pas croire le problème résolu : il ne l'est pas,
et sa résolution engage une décision qui n'appartient pas à la session.

Deux voies seulement traitent l'apex, et aucune n'est mécanique.

- **Déplacer les zones derrière Cloudflare** — aplatissement du CNAME à l'apex, certificats
  universels, règles de redirection en HTTPS. Traite les huit hostnames d'un coup. Mais
  déplace les serveurs de noms et impose de recréer chaque enregistrement, **`MX` compris**.
- **Un hébergement servant le TLS** sur chaque apex, qui porterait la redirection. Évite de
  déplacer les serveurs de noms, mais se configure domaine par domaine, hors API DNS.

Le jeton OVH de la session, scopé à `/domain/zone/*/*`, ne couvre d'ailleurs **pas** le
changement de serveurs de noms — mesuré : `403` sur `/domain/Produit-02.com/nameServer`.
La première voie exigerait donc, en plus, un élargissement de portée.

## Confirmations positives

- **Le contrôle de préservation DNS avait bien fonctionné.** Les quatre zones ont été
  réécrites sans perdre un seul enregistrement à préserver, `MX`, `SPF`, `DKIM` et `SRV`
  compris. Le défaut porte sur ce que la redirection **sait faire**, pas sur la façon dont
  elle a été posée.
- **L'exploitant a de nouveau trouvé ce que l'outillage ne cherchait pas.** Troisième fois en
  deux jours, après la capture Railway et le texte illisible. Ce n'est pas une anecdote :
  c'est la mesure de l'écart entre ce que les oracles couvrent et ce que le produit promet.

## Ordre recommandé

1. **RT-18** — l'oracle des domaines déclarés ; c'est le seul des trois qui aurait attrapé ce
   défaut le jour même, et il attrape aussi le certificat expiré et la base périmée.
2. **RT-17** — la règle de méthode, qui couvre la famille entière et pas ce seul cas.
3. **RT-19** — la limite d'intégration, à traiter avec RT-12 du lot `20260823c` plutôt que
   séparément.
