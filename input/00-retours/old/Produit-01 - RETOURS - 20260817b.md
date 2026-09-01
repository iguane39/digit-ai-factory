# Retours forges — Produit-01 — 20260817b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : complément à la revue de périmètre du 17/08 (lot `20260817a`) — instruction de
  la question humaine « les tests ont-ils été faits avec différents profils connectés ? ».
- **Références ledger** : `forge\ledger.jsonl` seq 34 (entrée `type: retour`), encadrée par
  l'étape `conception` seq 33 → 35
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-17

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-08 consommés). Ce lot porte
RG-09.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## tests (`digit-ai-forge-tests`) — couverture du pan qualif par rôle

Le pan `qualif` a rendu `8/8, ratio 1,00, ZERO finding` sur Produit-01 le 12/08. Ce verdict est
exact pour ce qu'il mesure, et le pan est par ailleurs remarquablement prudent sur ses propres
limites — il déclare son mode d'authentification, sous quelle identité il opère, et qu'il
n'émet aucun clic. Le défaut n'est donc pas un mensonge du pan : c'est une dimension de
couverture qu'il ne peut pas exprimer, sur une classe de produits où elle est la seule qui
compte.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-09 | majeur | **Le pan `qualif` n'accepte qu'UNE session, et son ratio ne dit pas qu'il n'a visité qu'un rôle.** `FORGE_TESTS_QUALIF_STORAGE_STATE` est un chemin unique — `Path(str(config['storage_state']))` puis `options["storage_state"] = str(fichier)` (`forge_tests/adaptateurs/qualif.py` l.270-282) : un seul `storageState`, un seul contexte navigateur, donc une seule identité pour tout le parcours. Sur Produit-01, le pan a rendu `8/8 ratio 1,00 — ZERO finding` (ledger seq 28) avec le compte unique `mock-user@example.com`. Or le produit réserve trois surfaces par rôle : la console d'administration (`/admin`, derrière `RequireAdmin`), l'écran de revue et décision (réservé aux approbateurs de la demande) et la vue en lecture seule du destinataire en copie. Aucune n'a été parcourue sous son rôle propre, et **le rapport ne le dit pas** : `ratio 1,00` se lit « tout est couvert ». Le pan sait déjà déclarer la NATURE de la session (anonyme / fournie / mire) — il ne déclare pas la COUVERTURE PAR RÔLE, qui est la seule qui compte pour un produit dont le domaine est l'autorisation multi-acteurs. Aggravant discret : une route qui répondrait 403 à cette identité est indistinguable, dans le ratio, d'une route saine. | Deux niveaux, le second seul si le premier ne suffit pas. (1) **Déclarer, coût quasi nul** : ajouter au rapport du pan « 1 session exercée — les routes refusées ou invisibles à cette identité ne sont pas jugées », et sortir les 401/403/redirections d'autorisation en issue DISTINCTE d'un succès, jamais fondues dans le ratio. (2) **Mesurer** : accepter N sessions étiquetées (`FORGE_TESTS_QUALIF_STORAGE_STATES` = liste `role=chemin`), rejouer le parcours par profil et rendre une couverture par rôle — le coût reste borné, le contexte navigateur étant déjà créé une fois par exécution. La non-destructivité (aucun clic) n'est pas remise en cause : il s'agit de lire plus de surfaces, pas d'agir. |

## Confirmations positives

- **La garde de précondition RT-16 / TF-0211 fait exactement son travail** : le pan distingue
  « aveugle qui se tait » de « aveugle qui accuse », et sur Produit-01 il n'a jamais imputé au
  produit une authentification qu'il n'avait pas obtenue. C'est ce qui rend le présent retour
  étroit — il ne reste qu'une dimension à exprimer, pas un faux négatif à corriger.
- **La déclaration de la nature de session est bien calibrée** : publier le NOM du fichier et la
  NATURE de la session sans le jeton ni le chemin complet (l.74-75), parce que le rapport
  circule, est le bon arbitrage. À conserver tel quel.
- **L'absence de clic est une limite assumée et écrite**, pas un trou découvert par le lecteur.

## Ordre recommandé

1. **RG-09 niveau (1)** — la déclaration seule : quelques lignes de rapport, et le lecteur cesse
   de lire `ratio 1,00` comme une couverture complète. C'est le meilleur rapport gain/effort du
   lot, et il vaut pour tous les produits à rôles, pas seulement Produit-01.
2. **RG-09 niveau (2)** — la mesure multi-sessions, à instruire seulement si la déclaration ne
   suffit pas : elle crée un objet durable (contrat de configuration) et relève donc de l'étude
   d'opportunité (TF-0155) avant décision.
