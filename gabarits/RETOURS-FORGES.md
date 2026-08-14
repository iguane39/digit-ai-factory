# Retours forges — <produit> — <AAAAMMJJ><indice>

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Emplacement : forge\retours\<projet> - RETOURS - <AAAAMMJJ><indice>.md dans le projet.
     Le PRÉFIXE PROJET est obligatoire (décision humaine 13/08) : côté pilot, les lots de
     tous les projets cohabitent dans input\00-retours\ — le nom dit qui retourne quoi.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : <clôture du run <run-id> | inspection production v<X> | incident | autre>
- **Références ledger** : `forge\ledger.jsonl` seq <n, n…> (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Si un retour se rapporte à un item du registre TODO-FORGE du pilot, citer son id
(`TF-xxxx`) — chaque retour intégré recevra le sien. **Les forges aussi** peuvent déposer un
lot avec ce gabarit, ciblant n'importe quelle autre forge (remise : `input\00-retours\` du
pilot, préfixé du nom de la forge émettrice).

**Sidecar machine (obligatoire depuis le 08/08)** : à côté de ce lot, un fichier
`<projet> - RETOURS - <AAAAMMJJ><indice>.tf.jsonl` (même nom que le `.md`) — une ligne JSON
par élément visant une forge :
`{"schema":1, "titre":…, "contenu":…, "demandeur":"<produit ou forge>", "source":"<lot +
seq ledger>", "date_demande":…, "forges_cibles_initiales":[…], "score":{gain,preuve,effort}
si estimable, "preuve_du_cout":…}`. **JAMAIS d'id** : les ids TF sont frappés à l'ingestion
par le pilot. Le sidecar est ce qui rend la remontée automatique — le `.md` reste la
lecture humaine.

**Sidecar hors format (TF-0196, 14/08)** : `ingerer-lot.mjs` rejette le lot ENTIER, motif par
motif, et le registre reste intact — c'est voulu, un rejet atomique vaut mieux qu'une
candidature mal formée. Côté pilot, `todo\normaliser-lot.mjs <sidecar>` convertit la forme
« lot de retours » (`reference`, `gravite`, `preuve`, `proposition`) vers ce contrat et écrit
un **dérivé** `.normalise.tf.jsonl` — l'original reçu n'est jamais modifié. Il **refuse** deux
choses plutôt que de les deviner : un titre où aucune forge n'est nommée (la cible ne se
devine pas — écrire « `<forge>` : … » en tête du titre), et un retour sans preuve.
**Ids uniques par produit** : préfixe par forge (RT/RC/RD/RV/RA/RS) + numéro **jamais
réutilisé** — continuer la séquence des lots précédents du même produit.

---

## <forge concernée> (`digit-ai-forge-<nom>`)

<Une phrase de contexte : ce que le run/l'usage a coûté ou révélé sur cette forge.>

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| <RX-n> | <gravité> | <le fait, pas l'opinion> | <piste, jamais obligatoire> |

<répéter la section par forge concernée — y compris `pilot` pour les auto-retours>

## Confirmations positives

<Ce qui a TENU en conditions réelles — aussi précieux que les défauts : permet de clore les
entrées du backlog comme « vérifiées ». Citer les correctifs concernés.>

## Ordre recommandé

1. <le retour au meilleur rapport gain/effort, et pourquoi>
2. …
