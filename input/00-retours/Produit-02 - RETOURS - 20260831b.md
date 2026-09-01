# Retours forges — deux défauts que seize oracles verts n'ont pas vus — 20260831b

Lot de retours du produit *Produit-02*, compilé à la clôture de la session du
31/08/2026 (construction et publication de la console de suivi). Il porte **deux retours**,
et ils partagent un trait qui fait leur valeur : dans les deux cas, **la chaîne d'oracles
était entièrement verte** au moment où le défaut existait. L'un a été trouvé en interrogeant
le navigateur au-delà de ce que les oracles demandent ; l'autre a été trouvé **par
l'humain**, en une phrase, après publication. Les deux proposent une règle mécanique et
rejouable — et déclarent exactement ce qui reste à éprouver.

## Contrôle de complétude

Le ledger du produit porte, depuis la remise du lot précédent (20260831a, seq 48-51),
**trois** entrées `type: retour` : seq 55, seq 58, seq 60. Ce lot porte les candidatures des
seq 55 et 60. La seq 58 — la demande d'étude DataForSEO — **n'est pas un retour de défaut
mais une demande d'étude**, remise le jour même par le canal des candidatures hors lot
(`input/01-candidatures/`, paire « Produit-02 - CANDIDATURE - Etude DataForSEO -
20260831a ») ; elle est déclarée ici pour que le compte soit exact. Trois retours, trois
acheminements : aucun n'est perdu.

## Retour 1 — un voile invisible neutralisait toute la page, seize oracles au vert

**Destinataire : digit-ai-page-html · gravité : majeur · ledger seq 55.**

La page de la console porte un panneau modal masqué par l'attribut `hidden`, mais sa règle
de style pose un `display: flex` explicite — qui l'emporte sur le `display: none` que
l'attribut tient de la feuille de l'agent utilisateur. Résultat : un rectangle
**transparent** couvrant l'écran entier, présent au chargement, interceptant **chaque
clic** — bouton de connexion compris. La page était totalement inutilisable.

Ce qui l'a laissé passer, et pourquoi c'est structurel : le voile est transparent, donc
invisible sur une capture (`render_page.py` PASS aux quatre largeurs) ; syntaxiquement
correct, donc invisible à la lecture (`check_html.py` PASS) ; et son attribut de masquage
est bien présent, donc un contrôle qui cherche l'attribut le trouve. Seize oracles du
profil, tous verts. Il a fallu demander au navigateur `document.elementFromPoint` sur le
centre exact du bouton pour que le défaut se nomme : l'élément au point n'était pas le
bouton, c'était le voile.

**Proposition de règle, mécanique** : (a) statique — prescrire au socle la ligne
`[hidden] { display: none !important; }` comme obligatoire de charte, et signaler tout
sélecteur posant un `display` non-`none` sur un élément susceptible de porter `hidden` ;
(b) exécutable — pour chaque élément interactif visible, vérifier que
`elementFromPoint(centre)` rend cet élément ou l'un de ses descendants. Le second contrôle
attrape aussi **tous les recouvrements accidentels**, une classe que le rendu par capture ne
peut structurellement pas voir. **Non éprouvé** : formulé pour être testable, pas testé.

## Retour 2 — la porte parlait trop : six divulgations pré-authentification

**Destinataire : digit-ai-factory · gravité : majeur · ledger seq 60.**

Relevé **par l'exploitant**, après publication, en une phrase — pas par les oracles. Ce
qu'un inconnu apprenait de la surface pré-authentification de la console : sa finalité et
son modèle d'accès (un seul secret, pas d'identifiant) ; la politique de limitation
**chiffrée**, la réponse d'erreur donnant le compte des essais restants et le délai en
secondes — de quoi calibrer un essai automatisé au rythme exact toléré ; la **structure
complète de l'interface**, embarquée dans le source de la page unique (onglets, indicateurs,
quatre routes d'API) ; un **nom de variable interne** dans une réponse d'erreur publique ;
le périmètre de la protection, énoncé sur la porte même ; et un `robots.txt` qui
**désignait le chemin** — le fichier que tout le monde lit en premier nommait précisément ce
qu'on voulait discret. Aucune donnée n'était exposée : la serrure tenait, la porte
divulguait.

Le mécanisme, et il est déjà payé deux fois : le 30/08, une preuve d'anonymisation citée en
clair a réintroduit ce qu'elle documentait ; ici, des explications écrites pour le lecteur
légitime ont été posées sur une surface que n'importe qui lit. La question jamais posée est
la même : **qui d'autre lit cette surface ?** Les oracles jugent la forme — charte,
accessibilité, rendu — aucun ne joue le point de vue de l'inconnu.

**Proposition de règle, mécanique** : pour tout livrable portant une surface authentifiée,
un oracle requête chaque surface pré-authentification (page de garde, réponses d'erreur,
`robots.txt`, en-têtes) et échoue si elle contient un nom de variable ou de technologie
interne, un chiffre de politique de sécurité, la description de ce que protège l'accès, ou
la structure de l'interface protégée. **Éprouvé une fois, à chaud** : la règle, ajoutée à
l'oracle du produit (12 contrôles neufs, 37 au total), a **refusé dès son premier rejeu** le
mot « exploitant » resté dans un commentaire CSS de la porte corrigée — un commentaire est
servi comme le reste. La correction du produit est publiée et mesurée en production ; la
généralisation de la règle au socle appartient à la factory.

## Remarques restées au produit

Trois remarques examinées pour généralisation, et leur verdict.

- **La purge du build efface tout HTML qu'elle n'a pas écrit** — c'est ce qui a imposé de
  loger la console hors de `site/`. Généralisable : **non** — la purge est un choix local de
  ce générateur, documenté dans son architecture, sans objet hors d'un site entièrement
  généré.
- **Le CLI de l'hébergeur refuse un jeton que son API accepte** — piège déjà documenté au
  `.env.example` du produit depuis le 23/08. Généralisable : **non** — particularité d'un
  fournisseur, pas un mécanisme d'agent.
- **La limitation d'essais vit dans la mémoire du processus** et se remet à zéro au
  redéploiement. Généralisable : **non** — l'arbitrage (fenêtre d'une minute, attaquant sans
  prise sur les redéploiements) est écrit dans le code du serveur et n'engage que lui.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit `gd-…`** dans ce cycle — les pages de la console
sont des livrables applicatifs jugés par les oracles du socle de page HTML (11 PASS, et
c'est précisément l'objet des deux retours ci-dessus : cette conformité n'a vu ni le voile,
ni les divulgations), et les huit documents de projet mis à jour suivent leurs gabarits
R-20 existants sans écart de gabarit constaté.

## Ce que ce lot ne couvre pas, et c'est dit

- **Les deux règles proposées ne sont éprouvées que partiellement** : celle du point de vue
  de l'inconnu a refusé un vrai défaut à son premier rejeu sur CE produit ; ni l'une ni
  l'autre n'a été jouée sur fixture rouge/verte au sens du standard des oracles.
- **La demande d'étude DataForSEO** (seq 58) n'est pas instruite ici — elle vit dans le
  canal des candidatures avec son propre document de cadrage.
- **Le coût réel du défaut de la porte est inconnu** : rien ne dit si un tiers a lu la
  surface bavarde pendant les quelques heures où elle a été servie. Aucune donnée n'y était
  lisible ; l'exposition se borne à de la connaissance de structure, et le secret n'a pas
  changé de nature — 20 caractères, empreinte seule côté serveur.
