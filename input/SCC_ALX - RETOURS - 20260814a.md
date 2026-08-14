# Retours forges — SCC_ALX — 20260814a

- **Contexte** : demande humaine du 14/08 — « sans le thème sombre, on a dit thème clair par
  défaut » — et le diagnostic qu'elle a révélé
- **Références ledger** : `forge\ledger.jsonl` seq 25
- **Remise au pilot** : copier ce fichier dans `<pilot>\input\` — l'original reste ici.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `RETOURS-20260813a/b/c` (remis) — la séquence d'ids continue.

---

## pilot (`digit-ai-forge-pilot`) et forge-agents — une règle qui se contredit

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RV-9 | majeur | **R-30 est incohérente.** Elle exige un « thème clair par défaut » et, par son pattern S-G1 point 1, de suivre `prefers-color-scheme` **à la première visite**. Les deux clauses se contredisent dès que le poste du lecteur est réglé en sombre : le document s'ouvre alors en sombre, ce qui n'est pas « clair par défaut ». Constaté en session : l'humain a demandé le **retrait du thème sombre** au motif que le clair avait été convenu comme défaut — sa demande visait ce comportement, pas le thème. | Trancher, dans un sens ou dans l'autre. **(a)** Clair inconditionnel : retirer le suivi de la préférence système du pattern S-G1, et le dire. **(b)** Assumer le suivi : reformuler R-30 en « le défaut suit la préférence système » et cesser d'écrire « clair par défaut ». La formulation actuelle laisse chaque implémenteur trancher — deux livrables du même socle peuvent s'ouvrir différemment sur le même poste. |

### Ce qui a été appliqué côté produit, en attendant l'arbitrage

```js
/* Clair TOUJOURS par defaut : prefers-color-scheme n'est PAS suivi. */
var theme = stocke === 'dark' ? 'dark' : 'light';
```

Et `<meta name="color-scheme" content="light">` au lieu de `"light dark"`.

**Preuve exécutée** — contexte navigateur forcé en sombre, trois livrables :

| Livrable | Système en sombre, 1re visite | Fond mesuré | Bascule | Rechargement |
|---|---|---|---|---|
| Gabarit `20260813a` | **light** | `rgb(250, 251, 255)` | → dark | dark |
| Rapport de mapping `20260813a` | **light** | `rgb(250, 251, 255)` | → dark | dark |
| Rapport Hammerson transposé `20260814a` | **light** | `rgb(250, 251, 255)` | → dark | dark |

La bascule reste câblée et le choix du lecteur reste persisté : seul le **défaut** change.

### Ce que cette demande a aussi révélé

En rejouant les oracles après le changement, le rapport de mapping du 13/08 est ressorti en
**FAIL** sur la règle **L13** : son champ de recherche était en `type="text"` là où la règle,
mécanisée au socle le 14/08, exige `input[type=search]`. Même défaut que le gabarit, corrigé au
générateur cette fois — un livrable conforme la veille ne l'est plus le lendemain, et c'est le
rejeu de l'oracle avant remise qui l'a rattrapé, pas le pull d'ouverture.

C'est le troisième cas en deux jours de ce mécanisme (R-7 inversée, R-32 créée, L13 mécanisée) :
**l'oracle de conformité doit être rejoué avant chaque remise**, pas seulement à l'ouverture du
run. Argument déjà consigné au ledger seq 15, confirmé ici.

## Ce que ce retour ne demande pas

Le retrait complet de la bascule sombre. Il contredirait R-30, qui la rend obligatoire depuis le
12/08 ; mécaniquement il serait possible — l'absence de bouton n'est qu'un avertissement de
`check_html.py`, pas un bloquant — mais c'est une décision de règle et non
d'implémentation. Elle n'a pas été prise sans instruction explicite.
