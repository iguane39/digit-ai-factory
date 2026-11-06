# Retours forges — Produit-84 — 20261105c

- **Contexte** : étude de reprise d'activité de Produit-84, du prompt réécrit (revue L99 du 05/11/2026) à la version c de l'étude, sur 4 retours du porteur dans la journée.
- **Références ledger** : `forge\ledger.jsonl` seq 214, 217, 220 et 225.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-05
- **Complétude** : 4 entrées `type: retour` de destinataire « Factory » écrites depuis le lot 20261105b (seq 214, 217, 220, 225), relues le 05/11/2026 à 17:45 dans `forge\ledger.jsonl` ; elles vont au sidecar. Les entrées 215, 222 et 226 sont des écarts déclarés du produit, sans destinataire Factory.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **L'étude** : écrite en version a, rejetée par le porteur (synthèse illisible, valeurs non remesurées, 2 états au lieu de 3), réécrite en version b, puis en version c après 3 remarques sur l'étape 2.
- **Les oracles** : `oracle-ecriture` et `check_markdown` ont rendu PASS sur la version a, que le porteur a jugée illisible.
- **Les gestes laissés à l'humain** : la session lui a fait écrire des lignes du `.env`, et a réécrit en place une version déjà remise.

## Factory (`digit-ai-factory`) — écriture, gabarits et gestes du socle

4 retours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-48 | majeur | générique | **Le plancher de longueur des paragraphes ne juge rien sans en-tête `destinataire:`.** (1) L'étude 20261105a ouvrait sur une synthèse en 1 paragraphe de 5 phrases denses, et son étape 2 sur un paragraphe qui énumère. (2) `oracle-ecriture` a rendu PASS : EC-14 était en SKIP, « ni en-tête `destinataire:` ni type de nom d'un écrit à un tiers » ; EC-12 ne voit que l'énumération numérotée sur une ligne. (3) Le porteur : « La synthèse est illisible, trop de texte. Je croyais que ce genre de paragraphe était maintenant prohibé ». (4) Avec l'en-tête posé sur la version b, EC-14 a relevé 1 énumération et 3 phrases trop longues. Ledger seq 217. | Juger EC-14 par défaut sur tout document sous `output\`, avec l'en-tête comme exception et non comme condition. Règle qui aurait évité le retour : E-11, dont le juge ne s'applique pas ici. |
| RT-49 | majeur | générique | **Un guide de la session a fait écrire au porteur des lignes du `.env`.** (1) Le guide disait « ajoutez la ligne `CLOUDFLARE_BILLING_TOKEN=<le secret>` », puis « remplacez la valeur de `SUPABASE_ACCESS_TOKEN` ». (2) `forge\ranger-secret.mjs` existe pour ce geste (D-167 (a), TF-2127). (3) Le porteur : « Pourquoi les lignes dans le .env ne sont pas créées automatiquement, comme demandé par la Factory. Corrige. » (4) Le hook `restitution` a rendu le guide affichable. Ledger seq 220. | Faire signaler par le hook `restitution` toute étape de guide qui écrit dans un fichier d'environnement, avec pour remède : préparer la ligne `NOM=`, ou ranger la valeur par `ranger-secret.mjs`. |
| RT-50 | majeur | générique | **Une version déjà remise a été réécrite en place.** (1) L'étude 20261105b a été liée « Livré » dans une restitution, puis réécrite après 3 remarques du porteur sur son étape 2. (2) `allouer-indice.mjs` rendait pourtant `c`. (3) Le porteur : « Pourquoi un nouveau fichier n'a pas été créé pour cette nouvelle version avec un indice c ? » (4) Aucun contrôle ne compare un livrable déjà lié « Livré » à son contenu suivant. Ledger seq 225. | Faire refuser par le hook `restitution` un « Livré » dont le fichier a déjà été lié dans une restitution antérieure et a changé depuis, avec pour remède l'indice suivant et l'ancien sous `old\`. |
| RT-51 | mineur | générique | **Aucune famille du catalogue ne porte une étude de reprise d'activité.** (1) La fiche de conception D8 a déclaré « aucune — candidature remontée ». (2) La plus proche, `gd-diagnostic`, a le type de nom « Diagnostic » et ne porte ni matrice de scénarios RTO et RPO, ni politique de sauvegarde, ni recommandations chiffrées. (3) L'étude 20261105c en est une instance réelle, vérifiée par 14 critères. Ledger seq 214. | Extraire une famille « étude de reprise d'activité » du livrable `Produit-84 - Étude - Reprise d'activite et sauvegarde sur Cloudflare GitHub Supabase - 20261105c.md`. |

## Rattachement

Registre interrogé le 05/11/2026 à 17:44 au pilot, `todo/TODO.jsonl`, sur « EC-14 », « destinataire », « ranger-secret », « allouer-indice », « indice » et « famille » :

- TF-1976 et TF-1960, clos en `corrige` : le plancher chiffré existe, mais ne s'applique qu'avec l'en-tête (RT-48) ;
- TF-2127, clos en `corrige` : le geste `ranger-secret.mjs` existe, mais rien ne le fait employer par un guide (RT-49) ;
- TF-0902, clos en `corrige` : la règle « livrable remplacé, ancien sous `old\` » ; elle ne voit pas une réécriture en place après remise (RT-50).

Items recoupés : TF-1976, TF-1960, TF-2127, TF-0902.

## Remarques restées au produit

- La synthèse fondée sur des valeurs non remesurées était une erreur de la session : il fallait demander les jetons avant d'écrire. Généralisable : oui, mais la règle existe déjà (loi n° 5, mesurer avant de classer).
- L'écart G9, page HTML jumelle non produite, est déclaré au produit (seq 215, 222, 226) : la fiche D8 validée fixe le format Markdown. Généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit : l'étude n'a pas de famille au catalogue (RT-51). La fiche de conception D8 a tenu, et G6 a vu une partie conçue absente du document (« Scénarios d'incident »).

## Documents mûrs

Aucun document mûr : l'étude 20261105c n'est ni jugée réussie par son lecteur, ni reprise 5 fois ; elle reste au produit, parce que le porteur ne l'a pas encore validée.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le vérificateur avec contexte, qui ne note pas, a trouvé à chaque passage des défauts que les oracles laissaient passer : 12, puis 16, puis 6, dont un fait affirmé qu'aucune page ne portait.

## Ordre recommandé

1. RT-50 : une version remise et réécrite fait perdre au porteur la trace de ce qu'il a lu.
2. RT-48 : le même grief revient du porteur depuis le 17/10.
3. RT-49 : un geste existe et n'est pas employé.
4. RT-51 : famille à extraire, sans urgence.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-48 : E-11, si EC-14 s'appliquait sans en-tête.
- RT-49 : D-167 (a), si le guide pointait `ranger-secret.mjs`.
- RT-50 : la règle 7 du pilot, livrable remplacé sous `old\`, si elle couvrait la réécriture après remise.
- RT-51 : aucune ; la famille n'existe pas.
