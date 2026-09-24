---
destinataire: humain
role: restitution de fin de tour, demande « Synchronise avec github et prends en compte ces retours » du 24/09/2026 (lot remis à la racine d'input, reçu sous Produit-70)
sources_de_verite: git des 13 dépôts gouvernés et du canal confidentiel · todo/TODO.jsonl · input/00-retours/Produit-70 - RETOURS - 20260924a.md · gabarits/RESTITUTION.md (v2.27.0)
verifie_le: 2026-09-24
---

# Digit-AI — Synthèse de mandat — Parc synchronisé et le retour de cohérence devenu oracle — 24/09/2026

## 0. Synthèse d'ouverture

Le parc est synchronisé avec GitHub : les 29 enregistrements d'hier sont publiés, puis ceux de ce
tour. Votre retour ne dort pas au registre. L'oracle de cohérence vérifie désormais le fond : une
ligne qui contredit son statut, une affirmation absolue démentie, un compte figé, une préséance non
écrite. Mesuré sur 2 144 documents, il a trouvé 10 comptes figés, dont un dans notre propre
gabarit de restitution, recopié chez 3 produits : corrigé à la source. Il ne recompte que les
comptes qui annoncent leur table : le reste accusait à tort, et c'est déclaré. Le sas d'arrivée est vide après 47 heures, 9 lots
ingérés. Une faute de ma part est aussi à dire : un envoi de 13h49 est parti sans que sa garde de
publication juge. Rejouée ensuite sur les 13 dépôts, elle rend PASS. La brèche est reproduite, et
sa parade tient en une ligne. J'attends 6 décisions.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, puis prise en compte du lot de retours remis à la
  racine d'`input\`, et des 8 lots qui attendaient au sas d'arrivée.
- **sur quoi** — le pilot `digit-ai-factory`, les 12 forges qui portaient des enregistrements non
  publiés, `digit-ai-forge-agents` pour l'oracle, et le canal confidentiel `digit-ai-confidentiel`
  pour 3 noms de produits.
- **quand** — le 24/09/2026, de 13:39 à 16:26 (UTC+02:00), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5, sans agent délégué ; escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état, et que la leçon du retour serve à
  toute session future : ne plus répondre « cohérent » sur un contrôle qui ne vérifie pas le fond.
  **Test rétro** : l'intention est servie sur la synchronisation (les 13 dépôts et le canal rendent `0/0` face à GitHub, relevé après `git fetch`) et sur les
  3 formes de défaut que le retour décrit par l'exemple, rejouées rouge puis vert. Elle ne l'est
  qu'en partie sur les comptes : seul un compte qui introduit sa table est recalculé par la machine,
  les autres restent une vérification humaine (bloc 6).

## 2. Verdict en une ligne

**14 dépôts à égalité avec GitHub** · `oracle-coherence` v2 : **4 règles**, 2 paires de
fixtures rouge et verte · bruit : **3 FAIL sur 694** documents du pilot et **8 sur 1 450** chez
8 produits, tous des comptes figés · recette de quality-oracles **sortie 0, 329 contrôles verts** · **9 lots**
ingérés, **23 candidatures**, 1 clôture sur preuve · 1 garde de publication contournée à 13:49,
rejouée PASS ensuite · **6 décisions** posées.

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent un geste, énoncés ici en entier :

- **Le fichier « null » de 266 389 octets, à la racine du parc, ne se supprime pas sans vous**, en
  vertu de R-29 (une suppression reste un geste humain décidé). Une commande Windows a posé sur le
  disque ce qu'elle croyait jeter. Pour le lever : l'ouvrir, vérifier qu'aucun jeton n'y figure,
  puis le supprimer. Si rien n'est fait : le relevé d'ouverture le signale à chaque session.
- **La copie de la table des produits datée du 22/09, laissée dans le canal confidentiel, ne se
  supprime pas sans vous**, pour la même règle. Pour la lever : la supprimer vous-même. Si rien
  n'est fait : le canal reste signalé « modifié » à chaque ouverture.

Comment lire les tableaux : chaque tableau porte une option par ligne ; la colonne Coût dit la
complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa
source précèdent le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur
suffit, par exemple « D-21 b ». Les décisions D-15 et D-17 à D-19 viennent de la synthèse
20260923d, reprises ici à l'identique sauf un numéro de candidature ; D-20 est celle que l'autre
poste avait numérotée D-15 le même soir, renumérotée pour ne pas confondre deux sujets.

> **D-15 — Faut-il inscrire à la table des pseudonymes les 8 noms de produits que `todo/HERITAGE-RELEVES.jsonl` écrivait en clair, au prix de corriger tous les fichiers suivis qui les citent ?**
>
> Le journal ne les écrit plus : il pose un marqueur. Mesuré avec la porte de publication et une
> table jetable, les inscrire rendrait bloquantes 174 occurrences dans l'arbre courant du pilot et
> de 3 forges. Parmi elles figure l'archive du registre, que la règle R8 (l'archive du registre
> reste immuable) interdit de réécrire. S'y ajoutent 12 occurrences dans des messages
> d'enregistrement déjà publiés, pour 5 des noms : seule une réécriture d'histoire les efface. Aucun
> des 8 ne porte un nom, un identifiant ni un sigle de client, et 2 sont des noms publics de la marque.
>
> **Recommandation : (a).** Source consultée : la simulation de `oracle-nom-client-publie` du 23/09
> sur `digit-ai-factory`, `digit-ai-forge-conception`, `digit-ai-forge-tests` et
> `digit-ai-forge-design` ; la lecture des 10 valeurs contre la table des clients ; la doctrine de
> TF-1293, « un domaine public n'est pas un nom à pseudonymiser ». La fuite qui continuait, celle du
> journal, est arrêtée ; ce qui reste lisible est antérieur et ne désigne aucun client.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Les laisser hors table : le journal garde le marqueur, rien d'autre ne bouge | nul | les 8 noms restent lisibles dans 174 occurrences suivies et dans l'histoire publiée ; le journal ne mesure pas la descente de ces 8 produits |
| **(b)** Inscrire les 3 noms absents de tout message et corriger leurs 40 occurrences au pilot par un enregistrement ordinaire, archive du registre comprise | moyen × court | une exception à l'immuabilité de l'archive ; les 5 autres restent hors table |
| **(c)** Inscrire les 8 et purger l'histoire publiée du pilot et de 3 forges | complexe × long | envois forcés sur 4 dépôts, l'autre poste se rebâtit, et les produits qui portent leur propre nom voient leurs envois bloqués |

> **Si rien n'est décidé** : (a), qui est l'état présent.

> **D-17 — Faut-il valider les 3 étapes que la chaîne `references/CHAINE-TRADUCTION.md` laisse manuelles ?**
>
> Chaque étape de la chaîne « audite les traductions » a désormais un porteur, sauf 3 résidus.
> B2 (la carte des sources de vérité du produit) : savoir quel fichier en régénère un autre exige de
> connaître le build du produit. B4 (la preuve de marché de chaque terme) : l'outil sait rendre une
> preuve échue, mais aucune durée par défaut n'est fixée. B7 (les entités et la citabilité GEO) :
> elles exigent le site en ligne et une recherche web.
>
> **Recommandation : (a).** Source consultée : le lot source `Produit-02 - RETOURS - 20260826f`,
> section « Chaîne B » ; la mesure de l'agent sur ce lot : aucun incident lié à l'âge d'une preuve,
> donc aucun fondement mesuré pour une durée par défaut.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Valider les 3 propositions : B2 et B7 restent manuelles avec leur motif écrit, B4 n'a pas de durée par défaut et chaque glossaire déclare la sienne | nul | aucune |
| **(b)** Même chose, mais B4 à 365 jours par défaut, la cadence annuelle de forge-seo-geo | simple × court | une preuve de 366 jours devient échue partout, sans mesure qui fonde ce seuil |
| **(c)** Ne rien décider | nul | les 3 étapes restent au statut « décision proposée », et TF-1318 ne se clôt pas |

> **Si rien n'est décidé** : (c).

> **D-18 — Où brancher le juge `oracles/oracle-enclenchement.mjs` dans un run, et faut-il rendre obligatoire la liste des forges mobilisées ?**
>
> Le juge confronte les oracles que chaque forge mobilisée découvre sur son disque aux verdicts
> consignés au ledger du run. Jugé sur les 2 seuls runs réels qui déclarent le schéma et leurs
> forges, il rend FAIL : ces runs consignent tous les verdicts d'un lanceur en une seule entrée, et
> l'outil qui consignerait un verdict par oracle n'existe pas encore. La liste des forges mobilisées
> est facultative au ledger ; la rendre obligatoire ouvre un schéma 1.1. La recommandation garde les
> choix de classement de l'agent : les 9 gates de forge-development comptent comme oracles, les
> vérificateurs de forge-audit n'en sont pas.
>
> **Recommandation : (a).** Source consultée : les 2 ledgers réels jugés le 23/09, en échec par
> regroupement et non par oubli ; `scripts/ledger.mjs`, qui dit qu'étendre sa table des champs dus
> est une décision.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Informatif à la clôture du run, liste des forges obligatoire au prochain schéma du ledger, bloquant une fois l'outil de consignation livré | moyen × moyen | aucun run n'est bloqué avant l'outil |
| **(b)** Bloquant au gate (le contrôle qui autorise la mise en production) dès maintenant | simple × court | tout run qui regroupe ses verdicts est bloqué à la mise en production |
| **(c)** Ne pas le brancher | nul | le juge existe et ne juge aucun run |

> **Si rien n'est décidé** : (c).

> **D-19 — Faut-il décider les 12 candidatures nées du tour du 23/09 dans `todo/TODO.jsonl` ?**
>
> Toutes sont des constats faits en passant pendant l'exécution de vos décisions. Les plus coûteuses
> sont dans le registre des tables : l'écrivain de la table ne pose pas la date d'inscription, et 2
> produits récents ont une histoire jugée sans borne. Viennent ensuite la règle de sceaux qui
> présente une modification réelle comme un simple écart de fins de ligne, et 2 octets de contrôle
> dans une expression du socle des pages. Une dernière garde la recette complète du pilot rouge : un
> contrôle prend le produit de marque pour une forge.
>
> **Recommandation : (b).** Source consultée : les scores des 12 créations du 23/09 au registre, et la
> recette complète du pilot, rouge sur le seul écart du produit de marque.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 12 | complexe × moyen | le mandat suivant les traite toutes, dont 5 de valeur inférieure à 10 |
| **(b)** *(recommandée)* Décider les 7 de valeur 10 ou plus (TF-1328, TF-1330, TF-1333, TF-1331, TF-1334, TF-1326, TF-1332), plus TF-1327 qui garde la recette du pilot rouge | moyen × court | TF-1337 (frappée TF-1325, renumérotée ce jour), TF-1329, TF-1335 et TF-1336 restent candidates |
| **(c)** Ne rien décider | nul | les 12 restent candidates, et la recette complète du pilot reste rouge sur ce poste |

> **Si rien n'est décidé** : (c).

> **D-20 — Faut-il corriger les 2 générateurs d'index d'output qui dépendent du poste et du moment de leur passage, pour que ce poste cesse de s'ouvrir « non prêt » après chaque synchronisation croisée ?**
>
> Le 23/09 au soir, sur l'autre poste, `node bootstrap.mjs --pull` a refusé de rapatrier le pilotage. Les index
> `output/README.md` et `output/04-plans/README.md`, régénérés sur ce poste par
> `scripts/readme-dossiers.mjs` après la dernière publication, entraient en conflit avec ceux que
> l'autre poste avait publiés. La cause est mesurée : chaque synthèse part avec un index généré avant
> qu'elle soit suivie par git, donc en retard d'un fichier, et le passage suivant du hook le corrige
> en local. Le troisième index, `output/LISEZMOI.md`, pèse les fichiers sur le disque : il se
> réécrit sur 316 lignes à chaque changement de poste, sans qu'aucun livrable ait changé.
>
> **Recommandation : (a).** Source consultée : les candidatures TF-1325 (23/09 au soir) et
> TF-1243 (du 20/09) du registre `todo/TODO.jsonl`, et le remède imprimé par `node bootstrap.mjs --pull`,
> « résoudre (stash/commit), relancer --pull », qui renvoie à l'humain un geste que l'outillage
> provoque lui-même. Les 2 correctifs restent dans le pilotage et ne touchent aucun livrable.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Décider TF-1325 et TF-1243 : l'index se régénère une fois la synthèse suivie par git, au moment de l'enregistrement, et le troisième index lit le poids des fichiers dans git plutôt que sur le disque ; recette jouée avant et après | simple × court | aucune |
| **(b)** Décider TF-1325 seule | simple × court | le troisième index continue de se réécrire sur plus de 300 lignes à chaque changement de poste |
| **(c)** Ne rien décider | nul | le poste s'ouvre « non prêt » après chaque synchronisation croisée, et chaque synthèse publiée porte un index faux d'un fichier |

> **Si rien n'est décidé** : (c). Je continue de remettre les index à l'état du dépôt avant chaque
> rapatriement, et les 2 candidatures restent au registre.

> **D-21 — Faut-il décider les 22 candidatures ouvertes aujourd'hui dans `todo/TODO.jsonl`, nées des lots reçus et de ce tour ?**
>
> La plus urgente est née de ce tour : un envoi dont la sortie part dans un filtre qui échoue
> publie malgré le refus de la garde `pre-push`. C'est arrivé ici à 13:49 sur 13 dépôts, et la
> parade d'une ligne est éprouvée sur un dépôt jetable. Les lots de Produit-64 portent 11
> candidatures, presque toutes sur la recherche dans la page du socle `digit-ai-page-html`, et
> sur 2 juges de `digit-ai-forge-design`. Les 2 lots du produit UIA en portent 7, venues d'un audit
> « du prototype à la production » : faux positifs d'oracles et une fiche de sécurité à livrer
> aussi en PDF ; leur sidecar ne portait pas de score utile, d'où une valeur de 1. Ce tour en
> ajoute 3 autres au pilot : les noms de personnes que l'accueil laisse passer, un lot daté d'un
> jour à venir, l'indice que 2 postes prennent le même jour.
>
> **Recommandation : (b).** Source consultée : les scores inscrits à l'ingestion de ce jour ; l'essai
> reproductible de la garde contournée ; le risque de publier un nom de personne, qui pèse plus
> que sa valeur calculée.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 22 | complexe × long | le mandat suivant traite aussi les 7 candidatures du produit UIA sans score |
| **(b)** *(recommandée)* Décider les 9 de valeur 10 ou plus (TF-1360 la garde contournée, puis TF-1338, TF-1341, TF-1343, TF-1359, TF-1339, TF-1340, TF-1353, TF-1358), plus TF-1357 sur les noms de personnes | moyen × moyen | 12 restent candidates, dont les 7 du produit UIA en attendant un score |
| **(c)** Ne rien décider | nul | les 22 restent candidates, la garde de publication reste contournable par un filtre cassé, et un lot qui nomme une personne passe l'accueil sans alerte |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Chaque ligne ci-dessous nomme ce qui a changé et la mesure rejouée qui l'établit : la
synchronisation d'abord, puis les lots, puis la prise en compte du retour.

- **Le pilot avait divergé ; il est réaligné.** Ce poste portait 8 enregistrements jamais publiés,
  GitHub 2 venus de l'autre poste. Les 8 sont rebasés sur les 2 : union au registre, index
  régénérés, jamais arbitrés.
  - preuve : `git rev-list --left-right --count main...origin/main` rendait `8 2` avant ; après
    l'envoi de 13:51 et un nouveau `git fetch`, les 13 dépôts rendaient `0/0`.
- **Les 2 postes avaient pris le même numéro de candidature le 23/09.** Le numéro publié garde
  TF-1325 ; celle de ce poste devient TF-1337 par `todo/renumeroter.mjs`, motif écrit dans sa source.
  - preuve : `oracle-todo` rendait FAIL R2 (seconde création pour TF-1325) avant, PASS après.
- **Les 2 postes avaient aussi pris l'indice « d » pour 2 synthèses du 23/09.** La plus récente,
  celle de l'autre poste, porte désormais « e », avec ses 3 fichiers d'oracles, contenu inchangé.
  - preuve : `oracle-conformite-projet`, règle R-4 (le nommage daté des livrables d'output),
    nommait les 2 radicaux sous le même indice ;
    `verifier-jugement` rend PASS, 35 livrables scellés, aucun modifié après jugement.
- **Le parc est publié, en 2 envois.** À 13:49, les 29 enregistrements d'hier et du rebase, dans
  le pilot et 12 forges, sur votre demande de synchronisation, qui tranche la D-16 d'hier ; mais cet
  envoi est passé sans que sa garde juge (bloc 6). À 16:01 puis 16:20, le travail du tour :
  `digit-ai-forge-agents` `01b4805..1f40504`, canal `f69f31d..006d962`, pilot `4b3b758..3fbd6ba`.
  - preuve : reflog d'`origin/main` au pilot, 13:49:51, et à la forge suivante, 13:49:56 : trop vite
    pour une porte qui prend 4 min 30 sur le pilot, mesuré par l'envoi de 16:20 ; porte des noms
    rejouée ensuite : PASS sur le pilot et sur les 12 forges ; `0/0` face à GitHub pour les 13
    dépôts et le canal.
- **La brèche de cette garde est reproduite, et sa parade éprouvée.** Un hameçon qui refuse meurt
  au premier message écrit dans un tuyau fermé, et git publie quand même.
  - preuve : sur 2 dépôts jetables, refusé sans filtre, PUBLIÉ avec le filtre cassé, refusé avec
    `trap '' PIPE` en tête du hameçon ; candidature TF-1360, en tête de D-21.
- **Le sas d'arrivée est vide.** 9 lots accueillis et ingérés : 6 de Produit-64, 2 du produit UIA,
  et le vôtre.
  - preuve : `accueillir-lot` a pseudonymisé 18 fichiers, sans adresse IP à qualifier ;
    `oracle-lot-retours` : 8 PASS et 1 FAIL couvert par la dérogation ; `oracle-boite-entree` PASS.
- **3 noms de produits entrent à la table**, hors de tout dépôt : Produit-70 pour l'émetteur de
  votre lot, Produit-71 et Produit-72 pour les 2 noms longs du produit UIA.
  - preuve : aucune occurrence de ces noms dans les fichiers suivis ni dans les messages du pilot et
    des 13 forges, mesuré avant ; `oracle-confidentiel` rendait FAIL K5 sur un alias, PASS avec 2
    pseudonymes distincts.
- **Votre lot est reçu en forme ingérable, sans changer son texte.** Une note de réception en tête
  dit les 3 gestes : date ramenée au jour d'écriture, personne nommée retirée, sidecar écrit par le
  pilot. L'original est gardé hors dépôt.
  - preuve : `git grep` du nom de la personne et du nom du produit dans le pilot et
    `digit-ai-forge-agents` : 0 fichier ; TF-1352 ingérée, marquée récidive de la classe que le
    lot déclarait.
- **`oracle-coherence` passe en v2 dans `digit-ai-forge-agents`.** 4 règles de fond s'ajoutent aux
  grandeurs, et les 3 premières jugent aussi un fichier seul :
  - CF1 : une ligne dont le propre texte nie son statut ;
  - CF2 : une affirmation absolue démentie par une cellule de table ;
  - CF3 : un compte faux dans la phrase qui annonce sa table ;
  - CF4 : 2 documents qui décrivent les mêmes objets sans préséance écrite, en avertissement.
  - preuve : la fixture rouge de dossier, qui rejoue votre cas avec des données inventées, rend
    FAIL avec 6 constats sur les 4 règles, la verte PASS ; la paire sur fichier seul rend FAIL puis
    PASS ; les 2 fixtures d'avant gardent leur verdict ; recette de quality-oracles sortie 0, 329 contrôles verts.
- **Le bruit a été mesuré avant l'enregistrement, et chaque passe a resserré l'oracle.** Première
  version : 43 constats bloquants sur les 694 documents du pilot, dont 38 faux sur les comptes, puis
  61 chez 8 produits, dont 33 faux sur les affirmations ; en cible dossier, 342 faux sur les statuts
  (« a déclaré » lu comme « à déclarer ») et 297 paires de préséance, surtout des versions.
  - preuve : version enregistrée : 134 PASS, 3 FAIL et 557 SKIP au pilot, 236 PASS, 8 FAIL et 1 206 SKIP, plus 81 avertissements de préséance en cible dossier chez les produits ;
    chaque borne est écrite à son endroit dans `lib/coherence-fond.mjs`.
- **La mesure a trouvé un emballement, fermé par une garde rouge puis verte.** Une page d'audit de 479 Ko tenait l'oracle plus
  de 9 minutes : une table masquée y laissait 410 699 caractères sur une ligne. L'extraction des
  grandeurs de la v1 y était déjà quadratique.
  - preuve : garde neuve dans la recette, rouge sur l'ancienne version (sans verdict après 20 s),
    verte sur la nouvelle (0,24 s en cible dossier) ; aucune cible au-delà de 60 s sur 2 144
    documents.
- **Le gabarit de restitution du pilot portait un compte figé.** Il annonçait « les TROIS seules
  exemptions » puis « les quatre exemptions » au-dessus d'une table qui en porte 5.
  - preuve : `oracle-coherence` sur `gabarits/RESTITUTION.md` : FAIL CF3 avant, PASS après, 2 comptes
    recalculés justes.
- **La candidature de votre lot est close sur preuve**, avec sa règle de descente : l'oracle
  lui-même, propagé à chaque poste par le skill.
  - preuve : `oracle-todo` PASS après les 3 événements de décision, d'ouverture et de clôture.
- **3 candidatures naissent de ce tour** (TF-1357 à TF-1359), chacune marquée récidive d'une classe
  close.
  - preuve : ingérées par `ingerer-lot`, `oracle-todo` PASS.
- **La recette complète du pilot** est rejouée sur l'état final.
  - preuve : 157/159 ; les 2 rouges sont des contrôles de l'état du parc : `oracle-skills`, PASS dès la propagation des skills, et `oracle-empreintes`, sur un site de `digit-ai-marketing` que TF-1327 décrit depuis hier.

## 5. Non traité — avec son motif

- La parade de la garde contournée, dans l'installateur des hameçons de `digit-ai-forge-agents` et
  sur les 14 dépôts : motif `decision` — c'est une modification de garde-fou que personne n'a
  décidée ; TF-1360 la décrit, D-21 la recommande en premier.
- La création des 5 classes que les lots de Produit-64 proposent (`classe-a-creer`) : motif
  `hors_mandat` — ces lots ne sont pas celui que vous avez nommé ; les ingérer était le geste
  obligatoire du sas, créer leurs classes relève du traitement de leurs candidatures, que D-21 ouvre.
- Les 22 candidatures ouvertes aujourd'hui, et les 12 du 23/09 : motif `decision` — D-21 et D-19.
- Les 8 noms restés hors table, les 3 étapes manuelles de la chaîne des traductions, le branchement
  du juge d'enclenchement, les 2 générateurs d'index : motif `decision` — D-15, D-17, D-18, D-20.
- Les 3 comptes figés que l'oracle a trouvés dans des documents reçus ou datés (2 lots de produits,
  1 étude du 13/08) : laissés tels quels, motif `hors_mandat` — un lot remis ne se modifie jamais
  (`gabarits/RETOURS-FORGES.md`), et une étude datée se corrige par un nouveau fichier (règle 5 de
  `REGLES-PROJET.md`), que rien ne demande ici.
- Les comptes figés trouvés chez 8 produits pendant la mesure (dont « 22 routes » au-dessus de 23,
  « Deux environnements » au-dessus de 3) : laissés tels quels, motif `hors_mandat` — le pilot
  n'écrit pas chez un produit ; le relevé d'ouverture le confirme, « aucun mandat déclaré ». Chaque
  produit les verra lui-même à sa prochaine livraison jugée par `run-oracles`.
- Les 2 avertissements CF1 du pilot, dans `catalogues/CATALOGUES.md` et
  `references/BEST-PRACTICES-HTML.md` : laissés tels quels, motif `hors_mandat` — la négation y vise
  une partie de la ligne, pas son statut.
- Le fichier `C:\dev\null` et la sauvegarde `.bak-20260922` du canal : motif `garde_fou` — R-29,
  inventoriés au bloc 3.

## 6. Écarts à la lettre

- **Vous avez demandé** de synchroniser. **J'ai publié à 13:49** en envoyant la sortie de
  `git push` dans un filtre mal écrit, qui a échoué. **Conséquence** : la garde de publication de
  13 dépôts n'a pas jugé. C'est ma faute ; la porte, rejouée ensuite sur les 13, rend PASS, et
  TF-1360 porte la brèche et sa parade.
- **J'ai déclaré** le feu vert `FORGE_PUSH_GO` en citant vos mots, « Synchronise avec github et
  prends en compte ces retours », pour publier les lots, le gabarit corrigé et la clôture de
  TF-1352. **Pourquoi** : R-38 §4-5 classe ces enregistrements « explicite », et votre demande de
  synchroniser est ce feu vert. Si vous vouliez les relire avant, un `git revert` les retire.
- **Vous avez demandé** de prendre en compte ce lot. **J'ai aussi ingéré** les 8 lots qui
  attendaient au sas depuis 47 heures. **Pourquoi** : le relevé d'ouverture les déclarait BLOQUANTS,
  et leur ingestion ne décide rien ; leurs candidatures vous attendent en D-21.
- **Vous avez demandé** de prendre en compte le retour. **J'ai lu** « prendre en compte » comme une
  décision sur sa candidature, TF-1352, décidée puis close sans D-N. **Pourquoi** : le lot dit
  lui-même qu'il est « à capitaliser pour toute session future » ; une candidature laissée ouverte
  n'aurait rien changé à la prochaine session. Si vous vouliez un simple enregistrement, la clôture
  se défait par un événement au registre.
- **Le lot demande** que tout chiffre écrit en prose soit recompté. **L'oracle ne recompte que** le
  compte écrit dans la phrase qui annonce sa table. **Pourquoi** : rattaché par section ou par
  préambule, le compte accusait à tort 37 fois sur 38 au pilot. Les autres comptes restent une
  vérification humaine, déclarée dans le « non jugé » de l'oracle.
- **Vous avez remis** un lot sous une date du 25/09. **Je l'ai reçu** sous le 24/09, avec une note de
  réception. **Pourquoi** : le lot date du 24/09 à 11:59 à l'horloge de ce poste, et une date à venir
  n'ordonne rien.
- **Vous avez demandé** de synchroniser. **J'ai aussi réindexé** la synthèse de l'autre poste, de
  « d » en « e ». **Pourquoi** : 2 synthèses du 23/09 portaient le même indice, et R-4 réindexe la
  plus récente.
- **Vous avez demandé** de prendre en compte un retour. **J'ai aussi corrigé** le gabarit de
  restitution du pilot. **Pourquoi** : le nouvel oracle y a trouvé le défaut même que le retour
  décrit, un compte figé pendant que sa table grandissait.

## 7. Risques

- **La garde de publication reste contournable** par un filtre de sortie qui échoue, sur ce poste
  comme sur l'autre, tant que la parade de TF-1360 n'est pas posée.
  - signal : un envoi du pilot qui aboutit en quelques secondes, là où la porte des noms prend
    4 min 30.
  - parade : ne jamais filtrer la sortie de `git push`, et vérifier chaque envoi par
    `git rev-list --left-right --count HEAD...origin/main` ; D-21 b fait poser la parade.
- **Chez les produits, `run-oracles` jugera désormais chaque fichier livré** sur CF1 à CF3, là où
  `oracle-coherence` rendait SKIP. Des FAIL apparaîtront sur des comptes figés existants.
  - signal : `run-oracles` rend « CF3 compte figé » ou « CF2 affirmation absolue démentie » à la
    prochaine livraison d'un produit.
  - parade : le constat nomme la table et le vrai compte ; mesuré le 24/09, 8 fichiers sur 1 450
    chez 8 produits rendront FAIL, dont 3 copies du gabarit de restitution, que la propagation
    corrige d'elle-même.
- **L'autre poste porte encore l'indice « d » pour sa synthèse du 23/09 au soir** s'il n'a pas tiré.
  - signal : `node bootstrap.mjs --pull` y rapatrie un renommage.
  - parade : aucune, le tirage est une avance rapide.
- **Les 2 postes peuvent encore frapper les mêmes numéros de candidature** : TF-1337 à TF-1359 sont
  pris ici et publiés.
  - signal : `oracle-todo` rend FAIL R2 après réunion.
  - parade : `node todo/renumeroter.mjs` sur le seul numéro non publié ; TF-1359 demande que la
    synchronisation le voie seule.

## 8. Prochaines actions

Les actions ci-dessous sont triées, celles de l'IA d'abord ; chacune porte son acteur et son motif.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Créer au référentiel `todo/CLASSES.json` les 6 classes proposées, 5 par les lots de Produit-64 et 1 par ce tour, puis y rattacher les 7 candidatures par rectification | `auto_ia` | TF-1340, TF-1342, TF-1343, TF-1353, TF-1354, TF-1355, TF-1360 | `dependance_bloc_3` — suit D-21 | 7 candidatures restent sans classe, hors du compte des récidives |
| **A-2** | Exécuter D-15 et D-17 à D-21 selon vos réponses | `auto_ia` | TF-1323, TF-1318, TF-1319, TF-1243 | `dependance_bloc_3` — attend vos réponses | les candidatures et les constructions restent en l'état |
| **A-3** | Trancher D-15 et D-17 à D-21, reprises en entier au bloc 3 — répondre par exemple « D-15 a, D-17 a, D-18 a, D-19 b, D-20 a, D-21 b » | `manuelle_utilisateur` | neuve | `decision` — décider des candidatures et publier des règles vous reviennent | D-15 (a) s'applique, les autres (c) |
| **A-4** | Ouvrir `C:\dev\null`, vérifier qu'il ne contient aucun jeton, puis le supprimer | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain | le relevé d'ouverture le signale à chaque session |
| **A-5** | Supprimer `C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain | le canal reste signalé « modifié » à chaque ouverture |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publiés à 13:49, garde non jouée puis rejouée PASS : pilot `b1201c7..4b3b758` (10
  enregistrements) ; 12 forges, 19 enregistrements, dont `digit-ai-forge-agents` `01b4805` et
  `digit-ai-forge-design` `0ee5706`.
- Publiés ensuite, garde jouée : `digit-ai-forge-agents` `01b4805..1f40504` (oracle-coherence v2),
  canal confidentiel `f69f31d..006d962` (Produit-70 à Produit-72), pilot `4b3b758..3fbd6ba` ; puis
  l'enregistrement de cette synthèse, avec la candidature TF-1360.
- `todo/TODO.jsonl` : TF-1325 de ce poste renumérotée TF-1337 ; 23 créations, TF-1338 à TF-1360 ;
  TF-1352 décidée, ouverte et close.
- Lots reçus : `input/00-retours/`, 9 lots ; original du lot remis gardé hors dépôt sous
  `c:\dev\_sauvegardes\lots-recus-20260924\`.
- Mesures de bruit et essai de la garde : fichiers de la session, hors dépôt ; leurs chiffres sont
  écrits dans le registre de quality-oracles et dans le message de `1f40504`.
- Aucune page HTML livrée dans ce tour : les fixtures HTML de l'oracle sont des données d'essai.
