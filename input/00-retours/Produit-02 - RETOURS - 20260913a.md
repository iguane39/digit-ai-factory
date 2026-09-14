# Retours forges — Produit-02 — 20260913a

- **Contexte** : session du 13/09/2026, analyse L99 du prompt « planning des pages à générer » puis mandat humain « 127, 126, 128, 129 » — deux frictions du script de ledger hérité du pilot, observées en écrivant les entrées de la session.
- **Références ledger** : `forge\ledger.jsonl` seq 217, 219 (entrées `type: retour`) ; contexte : seq 216 (entrée vide écrite par erreur), 218 (étape close), 220 (réponse humaine).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-13

## Factory (`digit-ai-factory`)

Deux frictions subies avec `forge/ledger.py`, le script d'écriture du ledger recopié depuis le pilot : il accepte une entrée sans aucun champ, et il rend un code d'échec après avoir écrit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-91 | majeur | générique | **`forge/ledger.py` accepte et écrit une entrée sans aucun champ.** Fait : le 13/09 à 08:55 UTC, `python forge/ledger.py etape_close` — lancé pour lire l'usage, le script n'ayant pas de `--help` (tout argument inconnu en première position est refusé comme « type inconnu », mais un type connu sans champ passe) — a écrit `{"seq": 216, "ts": "2026-09-13T08:55:54Z", "type": "etape_close"}` : ni `etape`, ni `resume`. Le contrat CONTRAT-INTERFACE §3 nomme ces champs ; rien ne les exige à l'écriture. Le ledger étant en ajout seul, l'entrée reste : elle a dû être déclarée dans seq 218 et ici. | Refuser à l'écriture toute entrée dont les champs obligatoires du type manquent (au moins `etape` + `resume` pour `etape_open`/`etape_close`, `destinataire` + `resume` pour `retour`), et rendre la docstring sur `--help` ou sans argument AVANT toute écriture. Classe : une règle écrite (le contrat §3) qu'aucun contrôle ne joue à l'endroit où l'entrée naît. |
| RT-92 | mineur | générique | **`forge/ledger.py` écrit l'entrée puis plante à l'affichage et sort en code 1.** Fait : le 13/09 à 09:03 UTC, `python forge/ledger.py etape_close --etape "…" --resume "… 21/100 → 89/100 …"` a écrit seq 218 (vérifié par `tail -1 forge/ledger.jsonl`) puis levé `UnicodeEncodeError: 'charmap' codec can't encode character '→'` dans `print(json.dumps(...))` sous la console Windows en cp1252 — code de sortie 1. L'appelant lit un échec là où l'écriture a réussi ; rejouer l'appel aurait écrit l'entrée deux fois. Contourné par `PYTHONIOENCODING=utf-8`. | `sys.stdout.reconfigure(encoding="utf-8")` en tête du script, ou `ensure_ascii=True` dans le `print` de confirmation ; dans tous les cas, écrire puis confirmer sans qu'une erreur d'affichage puisse contredire l'écriture. Classe : ce que le script REND (JSON sur la sortie standard + code de sortie) n'est contracté nulle part, et le code contredit l'effet. |

## Remarques restées au produit

Aucune remarque n'est restée au produit. Aucune correction locale n'a été faite sur le script : le produit le reçoit du pilot par l'héritage (R-47) et ne le modifie pas, pour que la correction redescende à tous les produits. Le contournement `PYTHONIOENCODING=utf-8` est une variable de session, pas une modification — généralisable : oui, et c'est précisément RT-92, remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — vérifié par la session, le 13/09/2026 (les documents écrits sont une analyse L99, une note de plan, deux restitutions et ce lot).

## Confirmations positives

- **`forge/hooks/prejuger-restitution.mjs` a évité trois affichages** : la restitution du 13/09 a été refusée en fichier (5 règles) puis jugée PASS avant tout affichage ; le hook `Stop` n'a rien eu à refuser.
- **`check_markdown.py` (M7, M10, M14, M18) a rendu PASS du premier coup** sur une analyse L99 de 7 308 mots écrite avec les quatre règles de forme en tête : la règle « à l'écriture, pas après » tient.
- **Le gate d'écriture (traçabilité des chiffres) a attrapé un faux positif utile** : un « 99% » lu dans une adresse encodée (`%20L99%20`) — le lien a été remplacé par un chemin en clair ; le constat est juste dans son effet (un lien encodé n'était pas lisible non plus).

## Ordre recommandé

1. RT-91 d'abord : une entrée invalide dans un journal en ajout seul ne se répare pas, et le geste qui la produit (lire l'usage d'un script sans `--help`) est le premier que fait toute session neuve.
2. RT-92 ensuite : mineur, mais il pousse à rejouer une écriture réussie.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : les deux sont des frictions d'outil observées par la session. RT-91 relève de `regle-ecrite-sans-oracle-qui-la-joue` (le contrat §3 nomme les champs, rien ne les exige à l'écriture). RT-92 relève de `contrat-de-sortie-sans-domicile` (le format de ce que rend le script — JSON et code de sortie — n'est écrit ni vérifié nulle part, et le code de sortie contredit l'effet). Aucune classe nouvelle n'est demandée.
