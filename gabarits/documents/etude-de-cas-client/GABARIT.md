# Gabarit — Étude de cas client (référence client)

> **Famille** `etude-de-cas-client` · catalogue `gd-etude-de-cas-client`
> **Formats** Markdown (source) · PDF ou HTML à la publication (page autonome par le socle
> `digit-ai-page-html` ; rendu PDF délégué au skill `digit-ai-docx` quand le support est un
> document Word)
> **Règles engagées** D1 D3 D6 D8 D9 D11 (`gabarits\documents\README.md`)
> **Provenance** ouverte par l'étude d'opportunité du 11/09/2026
> (`output\03-etudes\20260911-etude-opportunite-communication-marketing-ao.md`), typologie L11 :
> « Étude de cas, référence client · prospects · PDF, HTML · non couvert ; dépend d'un accord
> client », et mesure M9 : « aucune famille partenaire, fournisseur, étude de cas » au catalogue.
> **Gabarit : gd-etude-de-cas-client** · **Version du gabarit : 1.0.0**

**Ce que ce document est, et ce qu'aucun autre ne fait.** Une étude de cas raconte une mission
réelle à un **prospect** qui se demande si son propre problème ressemble à celui-là. Elle n'est
ni une plaquette (qui vante une offre sans preuve), ni un rapport de mission (qui appartient au
client et porte ses données), ni un témoignage (qui porte la parole du client et pas la nôtre).

**C'est une publication, et cela commande tout le reste.** Une étude de cas quitte notre
périmètre : elle est lue par des gens qui ne nous connaissent pas, indexée, citée, transmise à
des concurrents du client. Deux obligations en découlent, et elles sont *dues, pas
recommandées* — l'accord écrit du client (§ 0), et la transparence sur les contenus générés (§ 7).

**Pourquoi la famille existe (TF-1029).** L'étude du 11/09/2026 a mesuré que L11 n'est « non
couvert » par rien : le socle HTML couvre le rendu d'une page, jamais son contenu ; aucun
préréglage de `digit-ai-communication` ne porte l'étude de cas ; le catalogue de cette
bibliothèque ne portait pas la famille. Une étude de cas écrite sans forme oublie
systématiquement les deux mêmes choses — le dénominateur des chiffres annoncés, et l'accord.

---

## Structure — les sept sections sont dues

### 0 · En-tête, et l'accord qui conditionne tout

```
---
destinataire: humain
role_destinataire: {qui lit — un décideur prospect qui cherche si son problème ressemble à
  celui-ci — et ce qu'il décide : nous contacter, ou écarter}
---

# {Titre : le résultat, pas le nom du client}

**Client** : {raison sociale OU désignation anonymisée — voir l'accord}
**Indice** : {AAAAMMJJ<i>} · **Date de publication** : {JJ/MM/AAAA}
**Accord de publication** : {référence, date de signature, échéance de validité,
  signataire et sa qualité} — OU « anonymisée : aucun élément identifiant »
**Période de la mission** : {du … au …}
**Gabarit : gd-etude-de-cas-client** · **Version du gabarit : 1.0.0**
```

**L'accord de publication est un champ d'en-tête, et il a une échéance.** Un accord obtenu en
2026 pour une étude de cas qui circule encore en 2029 n'est plus un accord : les personnes ont
changé, la stratégie du client aussi. L'échéance est la date à laquelle l'étude est **retirée ou
renégociée**, et elle se relit sur l'artefact lui-même. Loi transverse n° 4 : un référentiel
périssable vit daté, éditable, sourcé.

Sans accord en cours de validité, l'étude est **anonymisée** : ni raison sociale, ni logo, ni
secteur trop étroit, ni chiffre permettant de remonter au client. « Un groupe industriel de
l'Est de la France, 1 800 salariés » identifie son client aussi sûrement que son nom.

### 1 · La situation de départ — le problème du client, dans ses mots

Le contexte et le problème, écrits du point de vue du client et **avant** notre arrivée. Le
prospect lit cette section pour une seule raison : savoir s'il s'y reconnaît. S'il ne s'y
reconnaît pas en cinq lignes, il ne lira pas le reste.

*Ce qui est interdit ici* : commencer par nous. « Émetteur-A a été sollicité par… » fait perdre
la seule section où le lecteur pouvait se projeter.

### 2 · Ce qui avait déjà été tenté, et pourquoi cela n'avait pas suffi

La section qui distingue une étude de cas d'une plaquette. Un problème qui se résout du premier
coup n'intéresse personne : le prospect a lui aussi déjà essayé quelque chose, et il veut savoir
pourquoi cela n'a pas marché.

Elle se rédige **sans dénigrer** ce qui a été tenté, ni le prédécesseur, ni l'équipe du client.
Un lecteur qui voit son propre choix moqué ferme le document.

### 3 · La démarche — ce qui a été fait, dans quel ordre, avec qui

Les étapes, leur durée, et **qui y a participé côté client**. La charge côté client est due : un
prospect évalue d'abord ce que cela va lui coûter à lui, en temps de ses propres équipes, et une
étude de cas muette sur ce point est lue comme une dissimulation.

La démarche se raconte **au niveau du principe**, jamais au niveau de la recette : les détails
d'implémentation appartiennent au client et, souvent, au secret des affaires.

### 4 · Les résultats — chiffrés, et chacun avec son dénominateur

La section où une étude de cas se perd le plus souvent. **Règle D9 appliquée sans exception :**
tout chiffre publié énonce ce qu'il inclut, sur quelle population, mesuré comment et à quelle
date ; un pourcentage affiché sans sa formule écrite à côté est un défaut.

| Résultat | Chiffre | Formule et population | Mesuré le |
|---|---|---|---|

« 40 % de gain de productivité » sans dénominateur n'est pas un résultat, c'est une affirmation
invérifiable — et c'est exactement ce qu'un prospect averti retient contre nous. Un **compte vaut
mieux qu'un pourcentage** quand la population est petite ou hétérogène.

Les résultats **non atteints** ou partiels se disent aussi. Une étude de cas où tout a réussi est
lue comme une publicité ; une étude qui nomme une limite est lue comme un rapport.

### 5 · Ce que le client en dit

Une citation courte, **validée par écrit** par son auteur, avec sa qualité et la date. Une
citation reformulée par nous et soumise « pour accord tacite » n'est pas une citation : c'est
notre texte sous le nom de quelqu'un d'autre.

Cette section est **facultative** et son absence n'est pas un défaut : beaucoup de clients
autorisent la publication sans vouloir y mettre leur voix. Elle ne se remplace jamais par une
citation inventée.

### 6 · Ce que cela dit pour un lecteur qui n'est pas ce client

Trois à cinq lignes qui **généralisent honnêtement** : à quelles situations ce cas se transpose,
et à quelles situations il ne se transpose pas. La seconde moitié est celle qui donne sa
crédibilité à la première.

### 7 · Transparence des contenus générés, et mentions

La section de conformité, et elle est **due sur toute étude de cas destinée à publication**.

La formulation applicable est celle du dépôt, à `references\PLATEFORME-LINKEDIN.md` § 3 « Ce
qu'un contenu généré doit dire », citée ici mot pour mot et non réécrite :

> - **Information du lecteur** : due depuis le **2026-08-02** (règlement européen sur l'IA,
>   article 50 ; lignes directrices de la Commission mises à jour le 2026-08-06). La règle de
>   marque de l'émetteur porte la formule ; le contrôle exécutable est la candidature TF-1030.
> - **Marquage lisible par machine** : reporté au **2026-12-02** pour les systèmes déjà sur le
>   marché, sous un accord qualifié de provisoire le 2026-06-22. Adoption finale non vérifiée : à
>   relire à la péremption.

Conséquence pour cette famille, et elle est simple : **la formule d'information du lecteur est
portée par le `MARQUE.md` de l'émetteur**, et l'étude de cas la reprend telle quelle. Le gabarit
ne l'invente pas et n'en propose pas de variante — une seconde formulation maison créerait deux
vérités sur une obligation réglementaire. Quand l'émetteur n'a pas de `MARQUE.md` portant la
règle, l'étude **ne se publie pas** : c'est un manque à combler, pas un écart à assumer.

La section porte en outre les mentions ordinaires : date de validité de l'accord (reprise de
l'en-tête), propriété des marques citées, et contact.

---

## Ce que ce document ne fait JAMAIS

Cinq exclusions, chacune capable de rendre une étude de cas publiable en pièce à charge. Le
lecteur y apprend ce qui ne doit jamais franchir la porte de publication.

- **il ne publie aucun nom de client sans accord écrit en cours de validité** : l'accord est un
  champ d'en-tête daté, pas une conversation ;
- **il ne porte aucune donnée du client** : ni extrait de son entrepôt, ni copie d'écran de son
  outil, ni nom de ses personnes, ni chiffre d'affaires non public ;
- **il n'affiche aucun pourcentage sans sa formule** (D9) : un chiffre sans dénominateur est une
  affirmation, et elle sera contestée ;
- **il ne dénigre ni le prédécesseur, ni l'équipe du client, ni l'outil remplacé** ;
- **il ne se publie pas sans la mention de transparence du § 7** quand le contenu a été assisté
  par IA — obligation en vigueur depuis le 2026-08-02, pas une politesse.

## Oracles

Ce que la machine juge sur cette famille, et ce que seul un humain peut trancher. Le lecteur y
apprend quels verdicts exiger avant publication, et lesquels n'existent pas encore.

| Contrôle | Invariant tenu |
|---|---|
| `oracle-gabarits-documents.mjs` (G1, G2, G4, G10) | la famille porte sa doctrine, son instance remplie, le couple gabarit + version rendu, le lecteur déclaré et la frontière lecteur/auteur |
| `check_html.py` + `render_page.py` (digit-ai-page-html) | charte, sémantique, accessibilité, zéro défaut visuel sur 4 largeurs, quand l'étude est publiée en page HTML (D7 : les deux, le premier ne voit pas ce que le second mesure) |
| `oracle-calculs` (quality-oracles) | un pourcentage affiché sans sa formule écrite à côté est un défaut (D9) |
| `oracle-nom-client-publie` (pilot, pre-push) | aucun nom de client réel dans un document versionné |
| contrôle de transparence — **CANDIDATURE TF-1030, non câblée à ce jour** | le marquage de l'article 50 sur les livrables publics n'a **aucun contrôle exécutable** : l'étude du 11/09 l'a mesuré (M10), et la candidature reste ouverte. Le dire est dû — une affordance non câblée n'existe pas (loi transverse n° 1) |
| **GO humain de publication** | aucun livrable n'est publié sur un service hébergé sans GO humain (R-38). L'accord client et sa validité se vérifient à l'œil, jamais par un oracle |

## Boucle de retour

Un manque constaté sur ce gabarit remonte par la section **« Retours sur les documents
produits »** du lot de retours du projet (R-46), avec le couple `gd-etude-de-cas-client` +
version.

---

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire` : un décideur prospect qui
cherche si son problème ressemble à celui-ci. Tout ce qui n'entre pas dans sa décision sort d'ici
et vit dans le **document d'auteur** — un fichier distinct, cité en renvoi et jamais publié :

- le **dossier d'accord** : échanges avec le client, versions successives soumises, réserves
  levées, date de renégociation à prévoir ;
- le **registre des arbitrages** : chiffres écartés faute de dénominateur solide, passages retirés
  à la demande du client, et pourquoi ;
- l'**historique des versions** et le statut de relecture.

**La frontière est un critère d'ACTION, pas de confort.** « Les résultats portent sur un seul
site, la généralisation n'est pas acquise » reste chez le lecteur : elle change la conclusion
qu'il en tire. « Le client a refusé qu'on cite le gain financier » part au document d'auteur.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*
