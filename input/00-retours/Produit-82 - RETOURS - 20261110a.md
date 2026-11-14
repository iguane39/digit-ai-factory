# Retours forges — Produit-82 — 20261110a

- **Contexte** : réception du rapport de l'agent constructeur qui a codé les vues du portail d'après la maquette TCO validée (décision D-20 (a)), campagne `vues-tco-20261110`, run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 187, 188, 189, 190, 191, 192, 193, 194, 195
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-10

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-design (`digit-ai-forge-design`)

Les trois retours portent sur la critique d'implémentation jouée contre un portail servi.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-18 | mineur | générique | Sur une instance servie (`--instance`), `run-oracles-design` ne rattache pas au socle les constats DE3 venus de `table-filters.css`. 7 boutons pleins et bordés de 2 px sont dits fantômes, sur 5 écrans du portail. La contre-épreuve de l'agent rend PASS sans cette feuille : `forge\etapes\development\vues-tco-20261110\releves\etape4-releves-finaux\contre-epreuve-de3\`. Ledger seq 187. **RT-18** : clé proposée `imputation-socle-absente-sur-instance`. | Appliquer à l'instance servie l'imputation au socle que DE3 fait déjà sur fichier, ou exclure les sélecteurs du composant table-filters. |
| RT-19 | mineur | générique | `run-oracles-design.mjs` lit le `.env` du dossier courant : son verdict dépend du dossier d'où on le lance. Rapporté par l'agent constructeur, campagne `vues-tco-20261110`. Ledger seq 188. **RT-19** : clé proposée `environnement-implicite-du-lanceur`. | Ne lire que les variables nommées par option ou par `FORGE_DESIGN_ROOT`. |
| RT-20 | mineur | générique | Un écran d'erreur voulu, la page 404 « Page introuvable » de l'exigence EF-45, rend SKIP exit 2 avec « X0 réponse HTTP 404 : écran non jugé ». Aucune critique d'implémentation ne juge donc les écrans d'état d'un produit. Ledger seq 189. **RT-20** : clé proposée `ecran-d-etat-jamais-juge`. | Une option `--statut-attendu 404` qui juge l'écran quand le code HTTP est celui annoncé. |

## digit-ai-page-html (skill)

Le retour porte sur la détection de la mire de connexion par `render_page.py`.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-21 | mineur | générique | `render_page.py` prend l'écran connecté de changement de mot de passe (`/espace/mot-de-passe`, champs `#actuel`, `#nouveau`, `#confirmation`) pour une mire de connexion. Il ne le juge donc pas comme un écran connecté. Preuve : entrée `4-mot-de-passe` de `forge\etapes\development\vues-tco-20261110\journal.jsonl`. Ledger seq 190. **RT-21** : clé proposée `mire-reconnue-au-champ-mot-de-passe`. | Reconnaître une mire par son action de connexion, non par la présence d'un champ de mot de passe. |

## pilot (`digit-ai-factory`)

Les trois retours portent sur le contrat d'agent de campagne (`gabarits\AGENT-CAMPAGNE.md`).

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-22 | mineur | générique | La cadence d'avancement du contrat n'a pas tenu pendant une campagne de 2 h 30. L'agent a fait 18 émissions, avec 10 écarts de plus de 4 minutes et 33 minutes au plus, pendant les commandes longues et la compaction de son contexte. Ledger seq 191. **RT-22** : clé proposée `cadence-d-avancement-intenable`. | Suspendre la cadence pendant une commande longue déclarée et pendant une compaction, et le dire dans le contrat. |
| RT-23 | mineur | générique | TF-1048 oblige l'agent à écrire un écart au lot de retours dans le tour. Or la consigne de campagne lui interdit le ledger et `forge\retours\`. L'agent a mis ses frictions dans son journal de campagne, et la session les a portées au ledger à la réception. Ledger seq 192. **RT-23** : clé proposée `conflit-tf1048-chemins-de-consigne`. | Dire dans le contrat que le journal de campagne tient lieu du lot pour un agent, et que la session le recopie au ledger à la réception. |
| RT-24 | mineur | générique | L'agent a commité `53677af` (référentiel seul) sans `make test` préalable, et `84f7404` sans `docker compose config`. La session a rejoué les deux sur HEAD `83d969d` à 22:03 UTC : exit 0. Ledger seq 195. **RT-24** : clé proposée `verification-native-avant-commit-non-code`. | Nommer dans le contrat les vérifications natives exigées pour un commit qui ne touche pas au code. |

## harnais (Claude Code)

Le retour porte sur le dossier temporaire partagé entre la session et ses agents.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-25 | mineur | générique | L'agent constructeur a écrit ses scripts et ses captures (`prep2\`, `design\`, `preparer_releves.py`) dans le dossier temporaire de la session, partagé avec elle et avec d'autres agents. Le hook `garde-rm-variable` y bloque aussi les suppressions. Ledger seq 193. **RT-25** : clé proposée `dossier-temporaire-partage-entre-agents`. | Donner à chaque agent délégué un dossier temporaire propre, nommé dans sa consigne. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La consigne de la session disait le composant table-filters « déjà servi par le portail » ; au commit `efb189d`, aucun fichier du portail ne le citait (ledger seq 194) | l'agent l'a ajouté en copie à l'octet près | oui : toute prémisse d'état du code se vérifie par recherche avant d'entrer dans une consigne | corrigé au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les contre-épreuves de l'agent ont isolé chaque faux positif par une mesure rejouable (style calculé, géométrie du panneau qui défile) au lieu de l'écarter sur parole.

## Ordre recommandé

1. RT-18 : 7 faux constats DE3 rendent FAIL 5 écrans servis à chaque critique.
2. RT-20 : les écrans d'état d'un produit n'ont aujourd'hui aucun juge.
3. RT-23 : le contrat d'agent et TF-1048 se contredisent à chaque campagne.
