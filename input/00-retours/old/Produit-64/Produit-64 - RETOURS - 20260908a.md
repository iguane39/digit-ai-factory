# Retours forges — Produit-64 — 20260908a

- **Contexte** : livraison du tableau de correspondance Service Connection ↔ Service Principal pour les fédérations Entra ID, projet Azure DevOps APP-IA. Retour humain direct pendant la relecture du livrable.
- **Références ledger** : sans entrée `type: retour` — le lot naît d'une relecture humaine du livrable, pas d'une clôture de run.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : **remis le 2026-09-11** — les deux fichiers déposés dans le **sas d'arrivée** du pilot `digit-ai-factory\input\00-retours\_arrivee\` (ignoré par git, `.gitignore` ligne 26), et non à la racine de `input\00-retours\` comme l'écrit encore le gabarit : le sas est le protocole en vigueur depuis le 08/09 (TF-0981). Empreintes SHA-256 vérifiées identiques aux originaux (`4a3cb049…185a4` pour le `.md`, `bdad033b…b7656` pour le sidecar). L'écart entre le gabarit et le protocole est remonté au lot `20260911a` (RT-13). L'ingestion appartient au pilot.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Le fait qui ouvre ce lot

Le destinataire du livrable a écrit, mot pour mot : **« Il doit y avoir un problème de login, il y a toujours la même valeur, et un oracle n'est pas passé. »** Il regardait la colonne *Issuer OIDC* d'un tableau de vingt lignes, où la même chaîne apparaît vingt fois.

**La valeur était juste** : l'émetteur est celui du tenant Entra ID, unique par construction pour toute l'organisation — mesuré par `az devops service-endpoint list --project APP-IA`, **22 connexions, 1 seul émetteur distinct**. Il n'y avait aucun problème d'authentification.

**Mais le lecteur avait raison sur les deux autres points**, et c'est ce qui fait ce lot :

1. rien, dans le tableau qu'il lisait, ne lui disait que cette colonne ne portait qu'une valeur — il a donc supposé une panne ;
2. aucun oracle n'avait vu que la cellule affichée provenait d'une **constante** du générateur et non du relevé de sa ligne. Le tableau était juste **par accident** : une connexion à émetteur différent aurait affiché une valeur fausse en silence.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Les trois retours portent sur le skill `digit-ai-page-html` et son composant de filtres de tableau, dont cette forge est la source vivante. L'usage réel : une page de données à vingt lignes et neuf colonnes, dont deux colonnes à valeur unique.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RX-1 | majeur | générique | **La note de cardinalité n'est lisible qu'à panneau ouvert.** Le composant rend bien « Une seule valeur dans cette colonne. » sur les colonnes *Issuer OIDC* et *Audience*, mais à l'intérieur du panneau de facette, qui est replié par défaut. Le lecteur qui parcourt le tableau ne la voit jamais. Mesure : sonde Playwright sur `output/04-Go-Prod/Client-A - Reponse Federations Entra - Correspondance SC et SP - 20260908a.html`, `th.querySelector('.tf-forme-note')` présent sur 8 colonnes sur 9, aucune visible sans clic. Coût réel : un aller-retour humain, avec une hypothèse de panne d'authentification formulée par le destinataire. | Rendre la cardinalité visible **dans l'en-tête**, pas seulement dans le panneau — une mention discrète « 1 valeur » à côté du libellé quand `distincts == 1`. Un tableau qui répète vingt fois la même chaîne doit dire pourquoi là où on le lit. |
| RX-2 | majeur | générique | **`data-tf-forme` est prescrit par le référentiel et n'est jamais posé.** `references/composant-filtres-tableau.md` §G7 écrit : « La cardinalité ne décide que de la **forme** du panneau, publiée en `data-tf-forme` » avec les valeurs `liste` / `recherche` / `unique`. Mesure sur la même page après `initAll()` : `data-tf-forme` vaut `null` sur **les 9 colonnes**, alors que les notes correspondantes sont bien rendues. Conséquence : aucun oracle ne peut vérifier mécaniquement la forme d'une facette, et le référentiel décrit une affordance non câblée — exactement ce que le socle refuse (« une affordance est câblée ou n'existe pas »). | Poser l'attribut dans `assets/table-filters.js` au moment où la note est construite, les deux venant du même calcul de cardinalité. Puis armer un contrôle G7 côté `oracle-filtres-tableau.mjs`, que le référentiel annonce déjà comme « restant à faire ». |
| RX-3 | majeur | produit+générique | **Aucun oracle ne compare une cellule rendue à la source dont elle se réclame.** Mon générateur remplissait la colonne *Issuer OIDC* avec une constante reconstruite depuis l'identifiant de tenant, au lieu de la valeur relevée pour chaque connexion. Les seize contrôles joués sur cette page — `check_html.py` 38 règles PASS, `render_page.py` PASS aux quatre largeurs, matrice d'états PASS, `oracle-tokens.mjs` PASS, `oracle-slop.mjs` sans red flag — n'ont rien vu, **par construction** : ils jugent la forme, la charte et le rendu, jamais la provenance. Une page peut donc être verte sur tous les axes et afficher une valeur qui n'est pas celle de sa ligne. Corrigé chez le produit par une assertion de provenance à la génération. | Une règle de socle pour les pages de données : toute colonne présentée comme **relevée** porte sa source par ligne, et le producteur expose un contrôle qui compare la cellule à cette source. À défaut d'un oracle générique — la source est propre à chaque produit —, exiger du générateur qu'il **déclare** son garde-fou de provenance, et que le livrable le cite. |

**Portée** : RX-1 et RX-2 sont *génériques* — tout projet employant le composant de filtres les rencontre. RX-3 est *produit+générique* : corrigé ici par une assertion, la classe vaut pour tout livrable qui présente des valeurs relevées.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La colonne *Issuer OIDC* avait d'abord été sortie du tableau, en valeur commune, alors que la demande la réclamait par ligne | Colonne rétablie sur chaque ligne, avec l'audience | non | Arbitrage de rédaction propre à ce livrable : factoriser une valeur constante est légitime en général, il se trouve qu'ici c'était précisément la valeur corrigée, donc celle qu'il fallait exposer. Rien de généralisable au-delà du bon sens éditorial. |
| La définition de la nouvelle colonne faisait 215 caractères pour un plafond de 200 | Réécrite à 126 caractères | non | Le contrôle L3 du socle a fait son travail au premier passage et a nommé le geste : la règle existe, elle est câblée, elle a mordu. Rien à remonter. |
| L'ajout de deux colonnes a fait tomber la largeur utile sous le plancher des pages de données | Conteneur passé en pleine largeur | non | Même verdict : `render_page.py` a relevé le défaut avec sa mesure chiffrée et le geste attendu. La règle vaut, elle a servi. |
| Le générateur avait dupliqué la logique de composition du sujet de fédération | Assertion `subject == prefixe + id de connexion` posée à la génération | non | Garde-fou propre à ce jeu de données, sans portée hors du contexte Azure DevOps. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot : les deux livrables concernés sont une page HTML au socle `digit-ai-page-html` et son jumeau Markdown, qui ne relèvent pas d'une famille de gabarit de document.

## Confirmations positives

- **L3 du socle a mordu au premier passage** sur une infobulle de 215 caractères, avec le plafond, le compte réel et le geste de réparation dans le message. Aucun aller-retour perdu.
- **La règle de largeur des pages de données a mordu** dès que le tableau s'est élargi, avec la mesure chiffrée (« conteneur à 1680px pour 1920px de fenêtre, 88 %, plancher 96 % »). Le correctif était évident à la lecture du message.
- **L30, règle neuve reçue en cours de session**, a exigé le dénominateur de couverture sur un tableau de correspondances — exactement le cas fondateur qu'elle décrit. Elle a fait ajouter le compte des connexions sans principal dédié, information que le livrable ne portait pas et que le lecteur aurait cherchée.
- **Le composant de filtres calcule bien la cardinalité** et rend la bonne note pour les colonnes à valeur unique : le calcul est juste, seule sa publication manque (RX-1, RX-2).
- **La montée de 36 à 38 règles de `check_html.py` en cours de session** s'est faite sans casser les pages déjà livrées, qui sont repassées vertes après correction ciblée.

## Ordre recommandé

1. **RX-2 d'abord** : poser `data-tf-forme` est un geste de quelques lignes dans le composant, et c'est lui qui rend RX-1 vérifiable mécaniquement plutôt qu'à l'œil. Meilleur rapport gain sur effort du lot.
2. **RX-1 ensuite** : la visibilité de la cardinalité en en-tête, une fois l'attribut posé, se style sans logique nouvelle. C'est le retour qui supprime le doute à la lecture, et c'est celui qui a coûté l'aller-retour humain.
3. **RX-3 en dernier** : il demande un arbitrage de doctrine avant tout code, puisqu'aucun oracle générique ne peut connaître la source d'un produit. Le geste utile est d'écrire la règle, pas de coder un contrôle universel.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Pour RX-1 et RX-2, la règle existe et n'est pas tenue : **G7 du composant de filtres** prescrit la publication de la forme en `data-tf-forme`. Le référentiel décrit, le code ne pose pas. Classe retenue : `page-html-filtres-tableau`.

Pour RX-3, **aucune classe du référentiel ne couvre exactement le défaut**. La plus proche est `champ-transcrit-de-prose-sans-correspondance` — un champ machine déclaré transcrit d'une source, dont aucun contrôle ne vérifie la correspondance. Mon cas en est le frère : une cellule présentée comme relevée d'une interface, dont aucun contrôle ne vérifie qu'elle vient bien de la ligne qu'elle décrit. La différence est la nature de la source, prose dans un cas, relevé machine dans l'autre ; le défaut, lui, est le même — **une valeur affichée dont la provenance est affirmée et jamais vérifiée**. Je retiens cette classe pour ne pas bloquer l'ingestion, et je propose au pilot soit d'élargir son libellé aux sources machine, soit de créer une classe sœur `cellule-affichee-sans-provenance-verifiee` dans la famille `tracabilite-ledger`.
