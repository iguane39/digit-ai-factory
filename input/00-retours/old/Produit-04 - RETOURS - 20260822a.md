# Retours forges — Produit-04 — 20260822a

- **Contexte** : production de la fiche sécurité de mise à disposition (DEV) du produit, le
  22/08/2026, depuis le gabarit `gd-fiche-securite` de la bibliothèque — hors run. Deux défauts
  signalés par le commanditaire à la relecture, tous deux reproduits et instruits ici.
- **Références ledger** : `forge\ledger.jsonl` — **aucune entrée `type: retour`**, et aucun
  ledger : ce produit n'a pas de run ouvert (`oracle-conformite-projet` le constate,
  R-19/R-42 SANS_OBJET). Le travail a été fait hors circuit de run, ce qui est précisément
  la condition dans laquelle les défauts ci-dessous se manifestent.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## pilot (`digit-ai-factory`)

Le rangement des livrables hors `output\` a déjà été demandé, instruit et corrigé (TF-0319,
corrigé le 17/08, archivé le 22/08 à 08:02). Le défaut s'est reproduit le 22/08 à 09:18, six
jours après la correction et une heure après l'archivage. Ce lot ne redemande donc pas la
règle : il apporte le premier cas réel qui la met en défaut, et une cause racine que la limite
déclarée ne nomme pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | **majeur** | générique | **Le faux négatif de R-2 n'est pas un oubli de producteur : il est STRUCTUREL, parce qu'aucun gabarit de la bibliothèque ne porte la marque qui déclenche le jugement.** `oracle-conformite-projet` déclare sa propre limite, mot pour mot : « seul ce qui est MARQUÉ est jugé — un producteur qui oublie de marquer son livrable y échappe (faux négatif ASSUMÉ, mesuré à la revue du 17/09 par le rapport entre livrables marqués et livrables déposés) ». La limite est donc connue et son ampleur est prévue à la mesure. CE QUI NE L'EST PAS : la marque n'est posée **nulle part en amont**. Vérifié le 22/08 — `grep -ril destinataire` sur `digit-ai-forge-audit/deliverables/templates/` et `tools/` : **zéro occurrence** ; le gabarit Client-A de la fiche sécurité (9 485 octets) : **zéro occurrence** ; `oracle-gabarits-documents` (G1-G7) : **aucune règle n'exige la marque d'un gabarit**. Conséquence mesurable : tout document produit depuis la bibliothèque naît non marqué, donc invisible à R-2, donc rangeable n'importe où sans qu'aucun contrôle ne le dise. PREUVE DU COÛT : la fiche sécurité a été écrite dans `audit\` à la racine du produit — hors `output\`, en violation de R-2 et R-39 — et **aucun oracle ne pouvait le voir** : faute de marque, `oracle-conformite-projet` rendait `SANS_OBJET` sur R-2 et un verdict par ailleurs cohérent. Le défaut a été trouvé par relecture humaine, exactement ce que TF-0319 voulait supprimer. La revue du 17/09 mesurera donc un ratio marqués/déposés proche de zéro **sans en donner la cause**, la cause n'étant pas chez les producteurs. | Fermer la boucle à la SOURCE plutôt qu'à la mesure. (1) **G8 dans `oracle-gabarits-documents`** : tout gabarit de livrable destiné à l'humain porte la marque — `destinataire: humain` en frontmatter pour un `.md`, `<meta name="destinataire" content="humain">` pour un `.html` — ou déclare pourquoi il ne la porte pas (un gabarit NORMATIF n'est destiné à personne : c'est déjà la précision D-06, et `gabarits\INSATISFACTION.md` documente explicitement ce choix pour lui-même). La marque descend alors dans chaque document produit, sans que le producteur ait à y penser. (2) **Corollaire pour les générateurs** : un générateur qui rend un livrable pose la marque s'il ne l'hérite pas du gabarit — c'est une ligne, et c'est ce qui a été fait ici en correctif local. (3) La mesure du 17/09 reste utile, mais elle mesurera alors un vrai taux d'oubli, pas l'absence d'un mécanisme. |

## digit-ai-forge-audit (`digit-ai-forge-audit`)

La forge porte le gabarit de la fiche sécurité, son générateur et son oracle (famille
`gd-fiche-securite`, déclarée `porte_ailleurs` par la bibliothèque, qui renvoie ici). Deux
défauts la concernent en propre, indépendants de RP-1.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | **majeur** | générique | **Le générateur officiel de la fiche écrit, par défaut, exactement là où R-2/TF-0319 interdit d'écrire.** `tools/build-fiche.mjs` calcule sa destination par défaut ainsi : `rel('deliverables','generated', <tenant-slug>, 'fiche-securite.html')` — c'est-à-dire **dans le dépôt de la FORGE**, sous une arborescence de travail. TF-0319 nomme ce cas mot pour mot : « pas au fond de dossiers de travail imbriqués où l'utilisateur doit naviguer et finit par se perdre ». Le générateur accepte bien `--out`, mais rien n'exige de s'en servir, et le chemin par défaut est celui qui sera pris par défaut. S'y ajoute que ni le gabarit ni le générateur ne posent la marque de destinataire (cf. RP-1) : le livrable naît au mauvais endroit ET invisible au contrôle qui aurait pu le dire. À NOTER, PARCE QUE C'EST LA MOITIÉ DU SUJET : la forge tient déjà la bonne doctrine à côté — `build-fiche.mjs` refuse un rendu incomplet (« 0 placeholder exigé avant diffusion ») et son en-tête interdit d'éditer les livrables produits à la main. La rigueur est là ; c'est la DESTINATION qui n'en bénéficie pas. | Le générateur prend la **racine du produit** et résout lui-même la famille `XX-audit` d'`output\` (R-39 al. 1-2 : nom au registre D-16, numéro local stable), au lieu d'un chemin par défaut dans la forge. Le `--out` reste pour les cas particuliers. La marque de destinataire est posée au rendu. Un livrable ainsi produit est conforme sans que personne ait à s'en souvenir — c'est la différence entre une règle écrite et une règle tenue. |
| RA-2 | **majeur** | générique | **La famille `gd-fiche-securite` déclare deux formats, `["html","pdf"]`, et la forge n'en produit qu'un.** `build-fiche.mjs` rend le HTML thémé ; **aucun outil HTML → PDF n'existe dans la forge** — vérifié le 22/08 sur `tools/` et `oracles/` : la seule occurrence du mot est `verifier-rapport-html.mjs:130`, qui mentionne l'export PDF pour dire qu'un `@media print` mal fait le sortirait tronqué. Le PDF est donc à la charge de chaque projet, ce qui a trois conséquences observées ici. (a) Le jeu de livrables a été remis INCOMPLET, et c'est le commanditaire qui a dû demander le second format — le PDF est ce qui circule en pièce jointe et ce qui s'imprime, le HTML ce qui reste sur le poste. (b) Le générateur PDF a été écrit de zéro, alors que le gabarit porte déjà tout le travail difficile (`@page{size:A4 portrait;margin:8mm}`, hauteur dimensionnée par le contenu, `overflow:visible`) et que son commentaire ECR-08 dit avoir été « réglé contre l'oracle de rendu (compte de pages du PDF A4), pas à l'estime » : **cet oracle de rendu n'est pas dans la forge**. (c) Un piège réel s'est refermé : sous Windows, un PDF ouvert dans une visionneuse verrouille le fichier ; le navigateur échoue à l'écrire SANS le dire, et le script a revalidé l'ancien tirage en croyant valider le nouveau — le défaut n'a été vu qu'en comparant l'horodatage du fichier au `ls`. | Rendre les deux formats dans la MÊME passe, ou échouer : un jeu incomplet ne se remet pas. Le rendu peut se faire sans dépendance ni binaire embarqué, par le moteur d'impression du navigateur du poste (Edge, sinon Chrome, en `--headless=new --print-to-pdf --no-pdf-header-footer`), la feuille de style du gabarit faisant foi pour les marges. Trois garde-fous, tous éprouvés ici : le format A4 et le nombre de pages **relus dans le PDF produit** (`/MediaBox`, `/Type /Page`) et non déduits de la commande ; la **fraîcheur** du fichier vérifiée (postérieur au lancement, et non antérieur à sa source) — c'est ce qui attrape le verrou Windows ; et un **SKIP motivé** si aucun navigateur n'est présent, jamais un PASS silencieux — c'est déjà la doctrine d'`oracle-sca` de forge-websec. L'oracle de rendu qu'ECR-08 dit avoir employé mériterait d'entrer dans la forge avec. |

## Remarques restées au produit

**Généralisable — retenu, c'est RP-1 et RA-1.** Le correctif local (livrables déplacés dans
`output\01-audit\`, scripts laissés sous `forge\etapes\audit\` conformément à R-16, marque
`<meta name="destinataire" content="humain">` posée au rendu) reste au produit : c'est une
implémentation. Ce qui se généralise est que la marque descende du gabarit et que le
générateur vise `output\` du produit. Preuve que le correctif tient :
`node oracles\oracle-conformite-projet.mjs <racine>` rend désormais **R-2 PASS — « 1 artefact
marqué destinataire-humain, tous rangés dans output\ ou docs\ »**, là où il rendait SANS_OBJET.

**Généralisable — retenu, c'est RA-2.** Le générateur PDF écrit ici reste au produit ; ce qui
se généralise est que les deux formats déclarés sortent ensemble, et les trois garde-fous.

**Resté au produit, non généralisable.** Une balise citée dans une phrase du texte
(« sans balise `<script>` ») s'est injectée pour de bon dans le premier rendu, les valeurs
étant substituées en HTML brut. Corrigé par échappement et par un contrôle qui échoue si le
rendu porte plus d'une balise `<script>` (celle du gabarit). Je ne le remonte pas : c'est une
faute d'auteur dans MES valeurs de substitution, pas un défaut du gabarit, et tout moteur de
substitution la permet. Noté ici pour que le choix de ne pas le remonter soit déclaré.

**Resté au produit, arbitrage humain en attente.** La fiche sort sur **deux** pages A4 quand le
gabarit en vise une (ECR-08). L'écart vient des douze blocs « À COMPLÉTER », verbeux parce
qu'ils portent l'explication de ce qui manque ; la fiche se resserrera une fois renseignée. Je
ne le remonte pas comme défaut de gabarit — mais le manque de FORME qui l'accompagne, lui, est
remonté en section suivante.

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - CAL - Fiche Sécurité Mise à disposition - Dev - 20260822a` (html + pdf) | `gd-fiche-securite` · gabarit Client-A `20260710a` (le catalogue ne porte PAS de `version_du_gabarit` pour cette famille — `"gabarit": null`, `"squelette": null` : la version reportée ici est la date du fichier, faute de mieux) | (1) **Aucune façon de dire « ce champ reste à compléter » dans un document REMPLI** : le gabarit surligne les `{{…}}`, et son script retire le surlignage dès qu'il n'y a plus de marqueur — le document n'a donc que deux états, vierge ou réputé complet. Or une fiche sécurité se remplit en plusieurs mains (le porteur sait l'exposition, pas le budget). (2) **Aucune marque de destinataire** (cf. RP-1). (3) **Aucun format PDF** (cf. RA-2). | **Deux faits, rapportés et non supposés.** Le commanditaire a signalé que le document était rangé hors `output\`, et il a dû **demander le PDF en second temps** — le jeu remis était incomplet sans que rien ne le signale. | (1) Un style ambré en ligne sur chaque champ non établi, pour survivre au script de dé-surlignage — 12 champs concernés ; (2) la balise `<meta name="destinataire" content="humain">` ; (3) tout le rendu PDF et ses garde-fous. | **générique** — (1) vaut pour toute fiche remplie en plusieurs mains ; (2) et (3) sont RP-1 et RA-2 |

Précision sur (1), parce que c'est la seule qui ne soit pas déjà remontée ailleurs : ce n'est
pas un défaut d'esthétique. Une fiche sécurité circule vers un RSSI, et un champ vide s'y lit
comme un oubli d'auteur alors qu'il est le plus souvent une **information** — personne ne l'a
encore arbitré. Le gabarit gagnerait un troisième état déclaré (`{{CHAMP|a_completer}}` ou
équivalent) que le générateur rend visiblement, et que le contrôle « 0 placeholder avant
diffusion » compte à part : un document à douze champs ouverts est diffusable s'ils sont
DÉCLARÉS ouverts, il ne l'est pas s'ils sont oubliés. La distinction manque aujourd'hui.

## Confirmations positives

- **Le gabarit de la fiche tient en conditions réelles.** Les 8 sections ont accueilli sans
  forçage un produit très éloigné du cas d'usage d'origine (un fichier HTML statique sans
  serveur, sans dépendance et sans donnée persistée). Le `@media print` est juste : le PDF
  sort en **A4 exact (209,9 × 297 mm)**, `break-inside: avoid` tient les sections, et rien
  n'est coupé — les trois pièges documentés dans le commentaire ECR-08 sont bien désamorcés.
- **Le chemin de la bibliothèque vers la forge fonctionne.** `gabarits\documents\catalogue.jsonl`
  a mené de « je cherche une fiche sécurité » à la forge qui la porte, en une lecture. Le champ
  `verdict_non_recouvrement` de `gd-fiche-securite` — qui raconte la requalification du 21/08 et
  l'angle mort « forme réutilisée vs forme OUTILLÉE » — a évité de recopier un gabarit.
- **`oracle-conformite-projet` est utilisable hors écosystème.** Joué sur un dépôt produit
  client sans `CLAUDE.md`, sans `forge\`, sans ledger, il rend un verdict lisible, distingue
  FAIL et SANS_OBJET, et sa section `non_juge` déclare ses propres angles morts — c'est elle
  qui a fourni la citation exacte au cœur de RP-1. Un oracle qui documente ses faux négatifs
  est ce qui a rendu ce lot possible.

## Ordre recommandé

1. **RP-1** — meilleur rapport gain/effort de loin : une règle G8 dans un oracle existant, et
   la marque descend dans tous les documents de toutes les familles. C'est aussi ce qui donne
   son sens à la mesure déjà prévue au 17/09, qui sans cela mesurerait l'absence d'un
   mécanisme en croyant mesurer la discipline des producteurs.
2. **RA-1** — corollaire direct de RP-1 côté forge-audit, et le seul des trois qui supprime la
   possibilité même du défaut : un générateur qui vise `output\` du produit ne peut plus se
   tromper de dépôt.
3. **RA-2** — le plus visible pour le destinataire (c'est lui qui a réclamé le PDF), mais le
   plus coûteux des trois : il demande un rendu, trois garde-fous et une décision sur le SKIP
   motivé. Les briques existent toutes ailleurs dans l'écosystème.
