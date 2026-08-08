# Retours forges — <produit> — <AAAAMMJJ><indice>

<!-- Gabarit du steering (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Emplacement : forge\retours\RETOURS-<AAAAMMJJ><indice>.md dans le projet produit.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : <clôture du run <run-id> | inspection production v<X> | incident | autre>
- **Références ledger** : `forge\ledger.jsonl` seq <n, n…> (entrées `type: retour`)
- **Remise au steering** : copier ce fichier dans `<steering>\input\` — l'original reste ici
  (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée
  après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Si un retour se rapporte à un item du registre TODO-FORGE du steering, citer son id
(`TF-xxxx`) — chaque retour intégré recevra le sien. **Les forges aussi** peuvent déposer un
lot avec ce gabarit, ciblant n'importe quelle autre forge (remise : `input\` du steering).

**Sidecar machine (obligatoire depuis le 08/08)** : à côté de ce lot, un fichier
`RETOURS-<AAAAMMJJ><indice>.tf.jsonl` — une ligne JSON par élément visant une forge :
`{"schema":1, "titre":…, "contenu":…, "demandeur":"<produit ou forge>", "source":"<lot +
seq ledger>", "date_demande":…, "forges_cibles_initiales":[…], "score":{gain,preuve,effort}
si estimable, "preuve_du_cout":…}`. **JAMAIS d'id** : les ids TF sont frappés à l'ingestion
par le steering. Le sidecar est ce qui rend la remontée automatique — le `.md` reste la
lecture humaine.
**Ids uniques par produit** : préfixe par forge (RT/RC/RD/RV/RA/RS) + numéro **jamais
réutilisé** — continuer la séquence des lots précédents du même produit.

---

## <forge concernée> (`digit-ai-forge-<nom>`)

<Une phrase de contexte : ce que le run/l'usage a coûté ou révélé sur cette forge.>

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| <RX-n> | <gravité> | <le fait, pas l'opinion> | <piste, jamais obligatoire> |

<répéter la section par forge concernée — y compris `steering` pour les auto-retours>

## Confirmations positives

<Ce qui a TENU en conditions réelles — aussi précieux que les défauts : permet de clore les
entrées du backlog comme « vérifiées ». Citer les correctifs concernés.>

## Ordre recommandé

1. <le retour au meilleur rapport gain/effort, et pourquoi>
2. …
