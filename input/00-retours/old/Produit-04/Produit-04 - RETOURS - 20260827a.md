# Retours forges — Produit-04 — 20260827a

- **Contexte** : évolution applicative « contrôles de saisie P2.2 » du 27/08/2026 — mise à jour,
  déploiement sur l'environnement de développement, et **quatre régénérations successives** de la
  fiche de sécurité depuis le gabarit `gd-fiche-securite`. Hors run. Le défaut remonté ici a été
  commis par le produit, constaté par le commanditaire à la relecture, puis reproduit et mesuré.
- **Références ledger** : `forge\ledger.jsonl` — **aucune entrée `type: retour`**, et aucun
  ledger : ce produit n'a pas de run ouvert. L'absence est déclarée au carnet des écarts assumés
  (`forge\travaux\ECARTS-ASSUMES.md`, écart « ledger absent », 27/08). Le travail a été fait hors
  circuit de run, ce qui est exactement la condition dans laquelle le défaut ci-dessous se produit.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `digit-ai-factory\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-27

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## pilot (`digit-ai-factory`)

La règle 5 du socle — « l'indice est une lettre par itération du même jour ; une nouvelle version
= un **nouveau fichier daté**, jamais d'écrasement » — a été enfreinte **quatre fois en quatre-vingts
minutes** par ce produit, le 27/08. Elle est pourtant écrite, connue, et déclarée **CÂBLÉE depuis le
23/08** dans le tableau des règles. Ce lot n'en redemande pas l'application : il apporte la mesure
qui montre **où le câblage s'arrête**, et pourquoi celui qui vient de citer la règle l'enfreint
quand même — ce que TF-0523 avait déjà nommé, sans que le remède couvre le cas d'un GÉNÉRATEUR.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-2 | **majeur** | générique | **Le câblage de la règle 5 DÉTECTE après coup ; il n'ALLOUE jamais avant d'écrire — et un livrable produit par script n'est donc protégé par rien.** `scripts\verifier-jugement.mjs` compare un livrable à un sceau posé au premier passage d'oracles, et refuse une modification à indice inchangé. Deux conditions bornent ce contrôle, toutes deux assumées et écrites : il ne juge que les livrables **SCELLÉS** (« un livrable non scellé n'est pas en défaut : c'est un état, et il est déclaré », REGLES-PROJET.md), et il ne juge que `.html/.htm/.md` (`const JUGES = new Set([".html", ".htm", ".md"])`, ligne 37). Or **un générateur écrit son nom de sortie AVANT tout passage d'oracle** : il n'y a pas de sceau à ce moment-là, par construction. Le script de ce produit portait donc son indice dans une constante — `const BASE = '... - Dev - 20260827a'` — et réécrivait le même nom à chaque exécution. PREUVE DU COÛT, mesurée sur ce dépôt le 27/08 : le nom `…20260827a.html` a désigné **TROIS contenus différents** — empreintes `dac2a310…` (commit 25c59fd), `e0ace645…` (commit 7e3e9ff), `54ceefbd…` (arbre de travail) — dont **DEUX ont été poussés sur `main`**. Quatre écritures horodatées à 15:45, 15:46, 16:05 et 16:24. Aucun contrôle n'a rien vu, et il n'y avait rien à voir : le fichier n'était pas scellé. C'est la reproduction exacte du défaut fondateur de TF-0523 — « le même fichier écrasé quatre fois » — quatre jours plus tard, par un autre acteur, **par la voie que le remède ne couvre pas**. | Livrer l'allocation comme une **fonction**, pas seulement la violation comme un **verdict**. Un module du pilot — `scripts\allouer-indice.mjs` — exposant `allouerIndice({ dossier, prefixe, jour, contenu })` qui rend l'indice à employer : `a` si rien n'existe ce jour ; l'indice EXISTANT si le contenu est identique (une re-génération à contenu inchangé n'est pas une nouvelle version, sans quoi l'outil pond un fichier par lancement) ; l'indice SUIVANT sinon. La comparaison se fait sur une forme canonique où l'indice est neutralisé, parce que la référence imprimée dans le document contient l'indice et ferait croire à une différence à chaque fois. Corollaire : tout gabarit de générateur de la bibliothèque l'importe, au lieu de porter une constante. `verifier-jugement.mjs` reste utile — il attrape l'édition à la main — mais il ne peut pas attraper ce qu'un script écrit avant d'exister. *Une règle de socle exprimable comme une FONCTION se livre comme une fonction, jamais comme une phrase dans un document de règles* — c'est le raisonnement déjà tenu pour `.gitignore` (TF-0649) et pour le carnet d'écarts (TF-0655), appliqué au nommage. |
| RP-3 | **majeur** | générique | **Le sceau ne couvre pas les PDF, alors que des familles de livrables déclarent deux formats — et la paire se désynchronise sans que rien ne le dise.** `verifier-jugement.mjs` ne juge que `.html/.htm/.md`. La famille `gd-fiche-securite` déclare `["html","pdf"]` : la moitié du jeu de livrables est donc hors du champ du contrôle, **y compris quand elle est scellée**. Fait observé le 27/08 sur ce dépôt : après une régénération, le HTML portait le contenu de 16:24 et le PDF celui de 16:05 — le PDF n'ayant pas pu être réécrit (verrou de visionneuse Windows). Les deux fichiers ont coexisté sous le même nom de base, l'un disant une chose, l'autre une autre, pendant huit minutes ; ils étaient à un `git add` de partir ensemble. Ce n'est pas un cas de figure : le HTML **était** modifié dans l'arbre de travail et le PDF **était** celui du commit précédent, vérifié par empreinte. Le seul rempart a été un contrôle LOCAL au produit (fraîcheur du PDF, cf. confirmation CP-1 ci-dessous) qui a fait échouer la passe — pas le sceau du pilot, qui ne regardait pas ce fichier. | Étendre `JUGES` aux formats binaires livrés, PDF en tête, en scellant sur l'empreinte du fichier plutôt que sur son texte (le mécanisme du sceau est déjà une empreinte : rien n'exige que le contenu soit lisible). À défaut, un contrôle de COHÉRENCE DE JEU : pour un même nom de base, tous les formats déclarés par la famille doivent exister et être **postérieurs ou égaux** au plus ancien scellé — un jeu dépareillé se voit sans qu'il soit besoin de lire le PDF. Le second est moins ambitieux et attrape le cas réel rencontré ici. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le générateur de fiche portait son indice en dur et réécrivait le même nom | Allocateur d'indice dans `forge\etapes\audit\generer-fiche-securite.mjs` : trois cas, aucun n'écrit sur un fichier existant ; garde-fou qui refuse l'écriture si la cible existe malgré tout ; référence interne du document alignée sur l'indice alloué | **oui** | Remonté en **RP-2**. Ce qui reste au produit est l'implémentation ; ce qui se généralise est que l'allocation soit fournie par le pilot au lieu d'être réécrite par chaque générateur — et surtout oubliée par chacun d'eux jusqu'à ce qu'un humain relise |
| `…20260827a` a désigné trois contenus dans l'histoire git, dont deux poussés | Non réparable : l'histoire ne se réécrit pas. `…20260827a` a été **restauré** à son contenu commité, et le contenu courant est sorti en `…20260827b`. Le fait est consigné au message de commit `5f3b480` | non | Propre à ce dépôt. La CLASSE du défaut, elle, est remontée en RP-2 — c'est elle qui a produit ce dégât, pas une maladresse ponctuelle |
| Le `JOUR` de la fiche aurait pu être dérivé de `new Date()` | Laissé en saisie manuelle, à côté de `DATE_LONGUE`, avec le motif écrit dans le code | non | Choix de contenu propre à un livrable d'audit : la date est celle des OBSERVATIONS, pas de l'exécution. Une re-génération le lendemain redaterait des constats non refaits. Rien à généraliser, mais le piège mérite d'être connu de quiconque écrira l'allocateur de RP-2 : **il alloue l'indice, il ne choisit pas le jour** |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - CAL - Fiche Sécurité Mise à disposition - Dev - 20260827b` (html + pdf) | `gd-fiche-securite` · gabarit Client-A `20260710a` | **Aucune allocation d'indice fournie avec le gabarit.** Le gabarit décrit la MISE EN PAGE d'une fiche ; rien dans la famille ne dit comment nommer les itérations successives, alors que le nommage daté est une règle de socle et que toute fiche est régénérée plusieurs fois dans la journée où on l'écrit | Le commanditaire a demandé, à la relecture : « pourquoi la règle de nouvelle version de fichier avec nouvel indice n'est pas respectée ? ». La question porte sur le NOM du livrable, pas sur son contenu — c'est le premier signal qu'il a eu que quatre versions s'étaient écrasées | L'allocateur d'indice, écrit dans le générateur du produit (~45 lignes avec ses commentaires). Également : le champ `REF_FICHE` imprimé dans la fiche a dû être rendu dynamique, sinon le nom du fichier et la référence interne divergent — divergence invisible tant qu'on n'ouvre pas les deux | **générique** — vaut pour toute famille de la bibliothèque dont un générateur produit un livrable daté |
| idem | idem | Le champ « porteur » et le champ « Business Owner » peuvent désigner la même personne sans que le gabarit ne le signale | Non observé chez le lecteur — anticipé par le produit lors d'un changement de porteur demandé le 27/08 | Une phrase, dans la valeur du champ, disant que les deux rôles sont tenus par la même personne et qu'il n'y a donc aucune relecture croisée entre construire et valider | **générique** — un gabarit de fiche sécurité gagnerait à poser la question plutôt qu'à laisser deux champs se remplir à l'identique en silence |

## Confirmations positives

- **CP-1 — le garde-fou de fraîcheur du PDF a tenu, en conditions réelles, et il a évité la remise
  d'un jeu incohérent.** Le lot `Produit-04 - RETOURS - 20260822a` (item **RA-2**, ingéré
  par le pilot) proposait, entre autres, de vérifier que le PDF produit est « postérieur au
  lancement, et non antérieur à sa source », précisément pour attraper le verrou de visionneuse
  Windows. Le contrôle a été implémenté dans `forge\etapes\audit\generer-pdf.mjs`. **Le 27/08 à
  16:24, il s'est déclenché** : « Le PDF n'a PAS été réécrit : le fichier existant est antérieur au
  lancement. Il est probablement ouvert dans une visionneuse qui le verrouille. » La passe a échoué,
  le jeu incomplet n'a pas été remis, et le commanditaire a été averti au lieu de recevoir un PDF
  périmé sous un nom à jour. C'est exactement le scénario décrit en 20260822a, rencontré cinq jours
  plus tard. **L'entrée peut être close comme vérifiée en usage.**
- **CP-2 — la marque de destinataire descend et le rangement tient.** Les correctifs de
  `RP-1`/`RA-1` (20260822a) sont en place chez ce produit : les fiches naissent dans
  `output\01-audit\` avec `<meta name="destinataire" content="humain">`, le générateur reste sous
  `forge\etapes\`. Quatre générations successives le 27/08 : la marque était présente à chaque fois,
  sans intervention. Rien à signaler, et c'est le but.

## Ordre recommandé

1. **RP-2 d'abord**, et de loin. C'est le seul des deux qui produit un dégât SILENCIEUX et
   IRRÉVERSIBLE : un nom qui désigne plusieurs contenus dans une histoire git ne se répare pas
   après coup, et rien ne le signale sur le moment. Le remède est une fonction d'une trentaine de
   lignes, dont la difficulté réelle tient en un point déjà résolu ici — la comparaison sur forme
   canonique, sans laquelle l'outil crée un fichier à chaque lancement.
2. **RP-3 ensuite**, dans sa variante « cohérence de jeu » plutôt que dans sa variante « étendre le
   sceau aux binaires » : elle attrape le cas réellement rencontré, elle ne demande pas de décider
   ce qu'est l'empreinte d'un PDF, et elle bénéficie à toute famille multi-formats.
3. Le retour sur le gabarit `gd-fiche-securite` (section « documents produits ») **est le même sujet
   que RP-2 vu depuis la bibliothèque** : si l'allocateur existe côté pilot, le gabarit n'a qu'à
   l'importer. À traiter dans la foulée de RP-2, pas séparément.
