# Retours forges — Produit-03 — 20260928a

- **Contexte** : mandat de mise en production du 28/09/2026. En mettant à jour le registre des
  retours au projet commun, `oracle-ecriture` a rendu `FAIL` sur la règle `EC-4-gras` pour un texte
  dont aucun passage en gras ne dépassait les passages déjà admis. La cause a été trouvée en lisant
  le code de la règle, puis reproduite par une paire de fixtures.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du
  produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — 2 faux positifs d'oracles : `EC-4-gras` d'`oracle-ecriture`, `S44` d'`oracle-synthese`

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-46 | majeur | générique | **La règle `EC-4-gras` compte un passage en gras qui n'existe pas.** Son motif, `/\*\*([^*\n]{2,})\*\*/g` (`oracles/oracle-ecriture.mjs`, ligne 337), exige 2 caractères au moins entre les étoiles. Un gras d'un seul caractère, `**0**`, n'est donc pas reconnu, et son second `**` s'apparie avec l'ouverture du gras suivant sur la même ligne : le texte ordinaire qui les sépare devient un « passage en gras ». Mesure du 28/09 sur `docs/ops/retours-projet-commun.md` : l'ajout d'un statut « **transmis le 28/09** » sur une ligne qui portait déjà « **0** ressource créée » a fait naître un faux passage de 125 mots, le 5e, et la règle est passée de `PASS` à `FAIL`. Paire de reproduction, jouée le même jour : 5 lignes « Ligne N : un compte de **0** ressource, puis un texte ordinaire de plus de douze mots sans aucune emphase ici, et enfin un statut **transmis**. » rendent `FAIL`, « 5 passages en gras de 12 mots ou plus (1er de 18 mots : « ressource, puis un texte ordinaire de plus de douze mots sa ») » ; les mêmes lignes sans le gras du « 0 » rendent `PASS`, « aucun passage en gras de 12 mots ou plus ». Contourné en retirant le gras du chiffre : le symptôme disparaît, la règle n'apprend rien | Apparier les délimiteurs avant de mesurer : accepter 1 caractère (`{1,}`), ou reconnaître d'abord les gras les plus courts, pour que l'appariement ne glisse pas sur le reste de la ligne. Ajouter la paire rouge/verte ci-contre au banc de la règle |
| RA-47 | majeur | générique | **La règle `S44` cherche le mot d'exclusivité dans tout le bloc 6, et non dans la seule demande citée.** Le code teste `EXCLUSIVITE` sur `b6Net`, le bloc 6 entier hors code (`oracles/oracle-synthese.mjs`, lignes 2073 à 2077), alors que la règle vise « la demande humaine citée au bloc 6 » (`gabarits\RESTITUTION.md`, règles de forme transverses, n° 6). Or la forme prescrite du bloc 6 est « vous avez demandé → j'ai fait → pourquoi » : un « seulement » écrit par l'auteur dans son « pourquoi » est lu comme une exclusivité de la demande. Vécu 2 fois le 28/09, sur 2 restitutions de ce produit dont les demandes, « que doit-il faire ? » et « 55b », ne portaient aucun mot d'exclusivité : `FAIL` à chaque fois, levé en reformulant la phrase de l'auteur. Paire de reproduction, jouée le même jour sur une restitution `PASS` : la seule insertion de « seulement » dans le « pourquoi » d'une ligne du bloc 6 fait passer `S44` de `PASS` (« aucun mot d'exclusivité dans la demande citée ») à `FAIL` (« la demande citée porte un mot d'EXCLUSIVITÉ ») | Ne chercher le mot que dans le segment de la demande — ce qui précède la première flèche d'une ligne du bloc 6, ou le texte entre guillemets qui suit « vous avez demandé » —, ou lire la demande humaine elle-même, que le hook de fin de tour connaît déjà. Verser la paire au banc de `S44`, qui n'a aujourd'hui que ses 2 sens sur la demande |

## La règle qui aurait évité le retour

La classe existe : **`oracle-faux-positif`**, famille `regle-morte` — un oracle rend rouge sur un
artefact conforme, le verdict opposé cesse d'être prononçable, et l'auteur apprend à ignorer le juge.
Les 2 retours en sont des cas neufs, chacun avec son mécanisme. `RA-46` : un motif qui apparie des
délimiteurs ne reconnaît pas la forme la plus courte que la syntaxe admet, et mesure alors le texte
compris entre 2 délimiteurs qui n'appartiennent pas au même élément. `RA-47` : une règle écrite pour
une PARTIE d'un bloc est jouée sur le bloc entier, et accuse la prose de l'auteur au nom de la
demande. La règle générale : un oracle se joue sur le périmètre exact que son texte nomme, et sa
recette porte le cas-limite de ce périmètre — la forme la plus courte, le voisin immédiat.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque : les pièces du jour sont des
restitutions, qui suivent `gabarits\RESTITUTION.md`, et des documents d'exploitation écrits à la
main. Leur seul coût est la reformulation de 2 blocs 6, remontée en `RA-47`.
