# Retours forges — Produit-02.com — 20260826k

- **Contexte** : reprise d'un livrable HTML remis le 15/08, sur mandat de l'exploitant. Sur les
  26 constats rendus par le contrôle de mise en page, 20 étaient réels et sont corrigés ; les
  6 derniers accusent un sélecteur CSS qui ne s'applique pas aux éléments incriminés.
- **Références ledger** : `forge\ledger.jsonl` seq 7 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qu'un faux positif pousse à faire

Ce chapitre existe parce que le coût de ce défaut n'est pas le constat lui-même.

Un faux positif isolé se contourne : on le lit, on hausse les épaules, on passe. Celui-ci est
différent, et c'est ce qui le rend cher. Le contrôle affirme qu'un lien de prose est **mis en
bloc** par une règle de sommaire, et il nomme cette règle. Pour rendre le document vert, il n'y
a que deux gestes possibles : **retirer les liens** d'une prose où ils ont un sens, ou
**renommer la classe** du sommaire pour tromper le matcher.

Les deux dégradent le document. Le premier appauvrit le texte, le second falsifie le balisage.
*Un contrôle qui n'a d'issue que par la dégradation de ce qu'il juge travaille contre son propre
objet* — et L1 existe précisément pour protéger la prose d'une coupure qui la casse.

La mesure a été faite avant de conclure, puis reproduite hors du document, parce qu'un faux
positif affirmé sans preuve est une excuse.

## `digit-ai-factory`

Un retour, sur un contrôle qui attribue une propriété CSS sans vérifier qu'elle s'applique.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-65 | majeur | générique | **La règle L1 de `check_html.py` accuse un sélecteur de mettre en bloc des éléments qui ne lui sont pas soumis : son matcher ignore la contrainte d'ancêtre.** **Mesure sur pièce** : le livrable `output\Produit-02 - Audit SEO - 20260815a.html` reçoit **six** constats *« L1 ponctuation orpheline … mis en bloc par le sélecteur `.toc a` »* sur des liens situés dans `section#synthese`, `div.verdict`, `ul.chemins` et `section#actions`. Or `<nav class="toc vues">` **ouvre à l'octet 33433 et ferme à 35102**, tandis que les liens incriminés **commencent à 35661** : aucun n'est descendant de `.toc`, donc `.toc a{display:block}` ne s'applique à aucun d'eux dans un navigateur. **Fixture jouée avant remise, qui reproduit le défaut hors de tout contexte** : un document de vingt-cinq lignes, un `<nav class="toc">` portant un seul lien, une règle `.toc a{display:block}`, et un `<a>` **inline dans un `<p>`** d'une `<section>` placée **après** la fermeture du nav — `check_html.py` rend *« L1 ponctuation orpheline … `body > section#s1 > p > a` (mis en bloc par le sélecteur `.toc a`) »*. **Le coût n'est pas le faux positif, c'est ce qu'il pousse à faire** : les deux seuls gestes qui rendraient ce livrable vert sont de retirer des liens d'une prose où ils ont un sens, ou de renommer une classe de sommaire pour tromper le matcher — dégrader un document pour obtenir un vert, ce qui est l'inverse de ce que L1 protège. | **Résoudre la contrainte de descendance avant d'attribuer une propriété à un élément.** À défaut — et c'est le minimum tenable — **ne pas NOMMER un sélecteur dont on n'a pas vérifié qu'il s'applique** : un message qui accuse la mauvaise pièce envoie corriger au mauvais endroit, et il le fait avec l'autorité d'un constat mesuré. La distinction se formule en une phrase : *un contrôle peut dire « cette ligne s'ouvre sur une ponctuation » sans savoir pourquoi, mais dès qu'il dit POURQUOI, il en répond.* Piste d'implémentation la moins coûteuse : le matcher connaît déjà l'arbre — il suffit qu'il remonte les ancêtres du candidat et vérifie la présence de la classe avant de retenir la règle. |

## Ce que ce retour ne couvre pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

**Les autres règles du contrôle n'ont pas été auditées.** Ce lot établit le défaut sur L1, où il
a été rencontré. Si le même matcher sert d'autres règles — et rien n'indique le contraire —
elles portent la même classe de défaut, et **personne ne l'a vérifié**.

**Le livrable reste en ÉCHEC après correction**, et c'est assumé : les six constats subsistent au
journal d'oracles, avec leur preuve, plutôt que d'être effacés par une dégradation du document.
Un lecteur pressé du journal lira « FAIL » ; c'est le prix de ne pas mentir.

**Aucun correctif n'a été tenté côté factory.** Le matcher appartient au socle, et le modifier
sans rejouer le banc de fixtures de `check_html.py` — qui n'est pas chez le produit — ferait
courir le risque inverse : un matcher trop strict qui laisserait passer une vraie coupure.

## Remarques restées au produit

Ce que le produit a corrigé — ou délibérément pas — chez lui, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 20 constats réels sur le livrable d'audit du 15/08 | Titre doté de son indice de version daté ; favicon-lettre en `data:` URI ; `overflow-wrap:anywhere` retiré de cinq classes de **prose** et laissé sur `.jeton` et `td .mono`, où il vise des identifiants techniques ; six onglets dotés d'un `id` et d'un `aria-controls`, six panneaux échangeant leur `aria-label` contre l'`aria-labelledby` qui désigne leur onglet ; chapeau de 68 mots ramené à 49 | non | **Rien de généralisable** — ce sont les défauts d'un document produit avant que ce contrôle n'existe. Ce qui l'est, c'est la règle qui a permis de les voir, et elle fonctionne. |
| Le script de correction cherchait `.champ{` par sa première occurrence, et la feuille de style en contient **deux** — une seule portant la propriété visée | Recherche de la **règle qui porte la propriété**, jamais de la première qui porte le nom. Le script s'est arrêté de lui-même sans rien écrire quand la garde a échoué | oui | **Généralisable, mais mineur et non remonté séparément** : c'est la version CSS de ce que RT-65 dit du matcher — nommer une pièce sans vérifier qu'elle est la bonne. Consigné ici parce que les deux se sont produits dans la même heure, sur le même fichier, dans deux outils différents. |
| `aria-label` et `aria-labelledby` cohabitaient sur les panneaux | L'`aria-label` est **remplacé**, pas doublé : deux étiquettes concurrentes sur un même élément, c'est la seconde qui gagne et la première qui trompe le lecteur du source | non | **Rien de généralisable** — le contrôle a bien nommé le défaut, et le remède était le sien. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Le livrable repris
est un rapport d'audit SEO antérieur, produit par une autre chaîne ; ce lot ne crée ni ne
consomme de gabarit de la bibliothèque. La section est **déclarée vide, elle n'est pas omise**.

## Confirmations positives

- **Vingt constats sur vingt-six étaient justes, et utiles.** Le titre sans indice de version, le
  favicon absent, la coupure de mot en prose, les onglets qui ne désignent pas leur panneau : rien
  de cela n'aurait été vu à la relecture, et tout cela dégrade la lecture ou l'accessibilité. Le
  contrôle a payé son coût plusieurs fois avant de rendre son faux positif.
- **Le message d'échec porte assez d'information pour être réfuté.** L1 ne dit pas seulement
  « ponctuation orpheline » : il nomme le chemin de l'élément et le sélecteur qu'il accuse. C'est
  précisément parce qu'il nomme le sélecteur qu'on a pu mesurer que ce sélecteur ne s'applique
  pas. *Un message assez précis pour avoir tort est plus utile qu'un message trop vague pour
  être vérifié.*
- **Le second contrôle, celui du rendu, rend PASS avant comme après.** Les corrections n'ont donc
  cassé ni la mise en page, ni les contrastes, ni le comportement aux différentes largeurs — ce
  qui est la seule chose qui rendait la reprise d'un livrable remis un peu risquée.

## Ordre recommandé

1. **RT-65** — seul retour du lot. Il vaut d'être traité avant que la règle ne soit rencontrée
   par un autre produit : un faux positif dont la seule issue est de dégrader le document juge
   se paie en documents dégradés, et cette dégradation-là ne laisse aucune trace.
