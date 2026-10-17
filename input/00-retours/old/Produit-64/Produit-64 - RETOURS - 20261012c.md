# Lot de retours — Produit-64 → digit-ai-forge-ops — 2026-10-12, indice c

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-forge-ops`, c'est-à-dire la prescription Azure Container Apps de `scripts/ops.mjs` (blocs `provision`, `healthcheck` et `rollback`) et les oracles d'exploitation O-1 à O-4.

**Origine** : analyse des coûts de la souscription Azure « Applications IA » du 12/10/2026, puis demande du porteur le même jour : « Remonte ce point à la Factory pour s'assurer que le principe des 2 versions soit mis en œuvre, mais que les anciennes versions soient bien supprimées régulièrement pour ne pas reproduire ce type de problème de conso à l'avenir. »

Ce lot porte **2 retours**, mesurés sur la facture réelle et sur la métrique de plateforme.

- **Contexte** : une chaîne de déploiement d'un produit du parc (Produit-11, Produit-11) applique la prescription de la forge : mode révisions multiples, vérification avant bascule et retour arrière instantané. Elle n'a jamais désactivé une seule révision antérieure. Hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-forge-ops (`scripts/ops.mjs`, cible `azure`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-34 | majeur | générique | **La prescription garde le retour arrière, mais aucune étape ne borne le nombre de révisions actives.** `scripts/ops.mjs` (forge-ops `1e1390f`, 02/10/2026), cible `azure`, impose `revision set-mode --mode multiple`, « SANS multiple, aucun retour instantane possible ». Elle bascule après la vérification de santé et prévoit le retour arrière par `traffic set` et `revision activate`. Elle ne contient **aucune** désactivation de révision. La cible `gcp` écrit même « ne jamais purger les revisions saines anterieures ». Sur Cloud Run, une révision sans trafic ne coûte rien ; **sur Azure Container Apps, une révision active garde ses `minReplicas` réplicas facturés à 0 % de trafic**. Mesuré le 12/10/2026 sur le produit Produit-11, qui applique ce schéma depuis le commit `cb0c813` du 26/08/2026, avec `minReplicas = 1` : métrique `Replicas` découpée par révision, **68 réplicas d'API et 63 de front en même temps le 28/09**, sur 100 et 90 révisions actives. API Cost Management, septembre 2026, groupe de ressources de développement : **1 552,23 € de Container Apps, dont 1 141,72 € (73,6 %) facturés au repos**, pour un budget de 100 € par mois. La qualification était touchée de même (389,79 €). Coût journalier : 63 à 70 € du 20 au 28/09, puis 2,67 à 3,31 € après une désactivation à la main les 29 et 30/09. **Rien n'empêche la récidive** : la qualification est déjà passée de 4,47 € à 9 € par jour depuis le 06/10. | Ajouter à la prescription `azure` une étape `menage`, jouée **après** le contrôle post-bascule : garder la révision servie (N) et la plus récente révision saine à 0 % (N-1), désactiver toutes les autres par `az containerapp revision deactivate`. Une révision désactivée reste dans l'historique et se réactive, donc O-4 tient : le retour instantané vers N-1 est préservé, et le retour vers une version plus ancienne reste possible en quelques minutes. Un ménage raté avertit sans faire échouer un déploiement réussi. Réécrire la ligne de la cible `gcp` en « garder au moins N-1 saine », au lieu de « ne jamais purger ». Le produit a écrit et vérifié ce geste : script dans le rapport `output/03-Syntheses/Client-A - Couts Applications IA - BAV D1 - 20261012a.md`, section C-1, avec `bash -n` vert et la requête jouée en lecture sur l'environnement réel, qui garde `b16503` et désactive `b16500`. |
| RT-35 | majeur | générique | **Aucun oracle ne juge ce que le déploiement laisse tourner, et aucun ménage n'est périodique.** O-1 à O-4 ont été rendus PASS sur ce produit (`forge/etapes/mep/DOSSIER-MEP.md`, M-4, le 11/08) pendant que l'accumulation commençait : ils jugent que le retour arrière est **possible**, jamais combien de révisions restent **actives et facturées**. La dérive a duré **au moins 34 jours** (du run 13994 du 26/08 jusqu'au 29/09) sans qu'aucun contrôle la voie. Le budget de souscription à 100 € par mois était dépassé dès le 03/09. Un ménage placé seulement dans la chaîne ne couvre pas trois cas : un run qui échoue entre la bascule et le ménage, une révision activée à la main, et un environnement que plus aucun run ne touche. | (1) Ajouter un oracle d'exploitation, par exemple **O-5 « révisions actives bornées »** : après déploiement, chaque application porte **au plus 2 révisions actives**, N servie et N-1 saine, sinon FAIL avec la liste à désactiver. Fixtures : rouge, 3 révisions actives dont 2 à 0 % ; verte, N + N-1. (2) Prescrire un **ménage périodique**, indépendant des runs, par exemple une tâche planifiée quotidienne qui applique la même règle N + N-1 et journalise ce qu'elle désactive. Les produits de ce parc ont déjà des Container Apps Jobs planifiés (`caj-Produit-11-retention-dev`, cron `0 3 * * *`). (3) Mettre dans la provision **un budget ou une alerte d'anomalie de coût par groupe de ressources**, pour qu'une dérive se voie en 48 heures plutôt qu'en un mois. |

**Portée** : générique. Tout produit déployé par la forge sur Azure Container Apps avec `minReplicas ≥ 1` y est exposé, et le coût croît d'un réplica permanent par build.

## Rattachement

Registre interrogé le 12/10/2026 (`todo/TODO.jsonl`, termes « révision », « revision », « containerapp », « deactivate », « minReplicas », « FinOps », « coût cloud », « rollback », « N-1 ») : aucun item ne vise le nombre de révisions actives ni le coût d'un retour arrière.

- `TF-1118` (« un geste destructif prescrit sans sa mesure de non-regression ») est voisin : la désactivation proposée en RT-34 est **réversible**, et l'oracle de RT-35 en est la mesure.
- `TF-0865` (cibles plan-first Databricks) est sans rapport.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La chaîne de Produit-11 garde toutes ses révisions actives | Pas encore corrigée : correctif écrit (rapport du 12/10, section C-1), en attente de la décision du porteur sur la chaîne du produit | oui | remonté : RT-34 |
| Aucune alerte n'a signalé la dérive pendant un mois | Alerte par groupe de ressources proposée au rapport (section C-3) | oui | remonté : RT-35, point (3) |
| Un worker de développement d'un autre produit (APR2) est facturé actif en permanence, 210 € en septembre | Diagnostic proposé au rapport (section C-4) | non | rien de généralisable à ce stade : la cause, boucle d'interrogation ou dimensionnement, n'est pas mesurée |
| `minReplicas = 1` n'est justifié nulle part dans la pile du produit | Décision laissée à l'équipe du produit (section C-5) | non | rien de généralisable : c'est un arbitrage entre démarrage à froid et coût, propre à chaque produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le rapport de coûts est un Markdown de session.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : rien n'a été refusé. Le comportement de facturation décrit en RT-34, où une révision active garde ses réplicas minimaux facturés même sans trafic, est une règle de tarification d'Azure Container Apps, pas un refus.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Confirmations positives

- Le mode multiple prescrit par la forge **a tenu son rôle** : le produit l'a rétabli le 26/08 (`cb0c813`), après qu'un `revision_mode = "Single"` avait fait servir une révision avant sa vérification de santé. Le run 13994 l'a révélé en refusant dix fois la bascule. RT-34 ne demande pas d'y renoncer.
- La restauration du produit choisit la cible du retour arrière parmi les révisions **actives et en marche**. Elle reste correcte après un ménage N + N-1 : la requête rejouée le 12/10 désigne la même cible.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucune classe existante ne convient : aucune ne parle d'une ressource accumulée par un geste répété, dont le coût n'est borné par rien.

- Clé proposée : `retention-de-versions-sans-borne`
- Famille : `contrat-interface-forge`
- Libellé : « Une prescription de déploiement conserve les versions antérieures pour garantir le retour arrière, sans borner leur nombre ni prescrire leur ménage : chaque déploiement ajoute une ressource facturée, et aucun oracle ne juge ce qui reste actif. »

Elle couvre RT-34 et RT-35.

## Ordre recommandé

1. **RT-34**, parce que c'est la cause : une étape de la prescription et un commentaire à corriger dans la cible `gcp`. Le geste est déjà écrit et vérifié chez le produit.
2. **RT-35 (1)**, l'oracle O-5, qui rend la récidive visible au run suivant.
3. **RT-35 (2)** puis **(3)**, le ménage périodique et le budget par groupe de ressources, qui couvrent ce que la chaîne ne voit pas.
