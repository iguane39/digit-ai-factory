# Retours forges — Produit-62 — 20260921a

- **Contexte** : le commanditaire a demandé ce qu'était le dossier `C\` présent à la racine du produit. L'instruction a établi que c'est un **profil Azure CLI** créé par erreur le 2026-09-15 à 14:33 — l'outil d'authentification a reçu `AZURE_CONFIG_DIR=C`, un chemin relatif — et qu'il a été **commis** dans le dépôt trois minutes plus tard, dans le même commit que les livrables du jour, sans qu'aucun contrôle le voie.
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-21 à 16:35 (`type: constat`) et 16:40 (`type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-21

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (`oracles\oracle-conformite-projet.mjs`, référentiel `REGLES-PROJET.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-32 | majeur | générique | **Le profil d'un outil d'AUTHENTIFICATION peut naître à la racine d'un produit et y être commis sans qu'aucun contrôle le voie : les règles d'arborescence jugent la PRÉSENCE des dossiers attendus, jamais la présence d'entrées INATTENDUES.** Fait observé le 2026-09-15 sur Produit-62, mesuré le 2026-09-21. Azure CLI a reçu `AZURE_CONFIG_DIR=C` — un chemin **relatif** — au lieu du profil isolé `%USERPROFILE%\.azure-client-a-pbi`, et a créé son arborescence complète dans le répertoire courant, c'est-à-dire **à la racine du dépôt** : `C\az.json`, `C\az.sess`, `C\azureProfile.json`, `C\config`, `C\commands\`, `C\logs\telemetry.log`, `C\telemetry\`, `C\versionCheck.json` — **17** fichiers, 32 Ko. La preuve est dans l'outil lui-même : `C\logs\telemetry.log` ligne 1 porte « *Attempt start. Configuration directory [C]* ». **Trois minutes plus tard, les 17 fichiers sont commis** au `351f381` du 2026-09-15 14:36:56, dans le même commit que la synthèse du jour, pour **713** insertions ; `git check-ignore -v C` ne rend rien — aucune ligne de `.gitignore` ne le couvre. Et le contrôle censé juger le dépôt a tourné **sur ce commit** : `forge\oracles\2026-09-15d-oracle-conformite-projet.json` rend **PASS**, 43 constats, dont « R-1 `input/` présent », « R-2 `output/` présent », « R-3 `docs/` présent » — aucune règle ne regarde ce qui est là **en plus**. **Ce que ça a coûté ici : rien**, et c'est un hasard mesurable : le profil n'a jamais abouti de connexion (`azureProfile.json` ne porte qu'un `installationId`, `az.json` et `az.sess` valent `{}`, pas de `msal_token_cache`), si bien que les **6** appels `account get-access-token` du même horodatage sortent tous en **exit 1** sur « *Please run 'az login' to setup account* ». **Le même geste 2 h 30 plus tôt aurait commis un cache de jetons** : le compte humain était connecté depuis 11:58 le même jour (ledger, A-83/A-61 aboutie). *La règle R-14 juge les motifs de fichiers de secrets connus (`.env`) ; un profil d'outil d'authentification n'est pas un motif connu, et personne ne l'a vu passer.* | **(1)** Une règle d'**entrées inattendues à la racine** au référentiel de conformité : la racine d'un produit porte une liste FERMÉE d'entrées attendues (`input\`, `output\`, `docs\`, `forge\`, `.claude\`, fichiers de socle) — toute autre entrée **versionnée** est un constat, avec sa taille et son commit d'ajout. Le coût de la règle est nul quand le dépôt est propre, et elle voit d'un coup tous les artefacts de shell (dossier `C`, fichier `null`, `NUL`, `~`). **(2)** Un **motif de garde dédié aux profils d'outils d'authentification** dans le `.gitignore` de socle des produits et dans R-14 : `**/azureProfile.json`, `**/msal_token_cache*`, `**/az.sess`, `**/.databrickscfg`, `**/credentials.json` — le motif se reconnaît au NOM du fichier, indépendamment du dossier qui le porte, ce qui est précisément la propriété qui manquait. **(3)** Une **garde côté producteur** : tout script de forge qui pose `AZURE_CONFIG_DIR` (ou l'équivalent d'un autre outil) refuse une valeur qui n'est pas un chemin **absolu** — trois scripts de ce produit calculent bien un chemin absolu depuis `%USERPROFILE%`, et c'est un appel **ad hoc** hors script qui a produit la valeur fautive ; la garde appartient donc au lanceur, pas au script. **(4)** Le hameçon d'ouverture sait déjà déclarer un artefact de shell (il l'a fait le 2026-09-21 pour le fichier `null` de 47 octets à la racine du parc) : **étendre ce même contrôle à la racine du produit ouvert**, pas seulement au parc. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le dossier `C\` est commis et attend un geste humain de suppression (R-29) | porté en décision D-50 au commanditaire, avec 3 traitements chiffrés et leurs commandes | non — le geste est local ; c'est l'absence de DÉTECTION qui est générique, et elle est portée par RF-32 (1) | resté au produit |
| Aucune ligne de `.gitignore` du produit ne couvre un profil d'outil d'authentification | proposé dans la décision D-50, non appliqué (le fichier est suivi et la suppression est un geste humain) | oui — c'est RF-32 (2), qui vise le `.gitignore` de socle des produits | remonté via RF-32 |
| La cause exacte du chemin `C` n'est pas prouvée : l'hypothèse de la conversion de chemin MSYS a été **écartée par la mesure** | documenté comme non prouvé dans la synthèse plutôt que supposé | non — mais la mesure est réutilisable : sous Git Bash, `AZURE_CONFIG_DIR=C:/…` et `C:\…` arrivent **intacts** à un exécutable Windows | resté au produit |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de la bibliothèque sur ce lot : le tour n'a produit qu'une note de synthèse, écrite sur `gabarits\RESTITUTION.md`, qui n'a pas manqué.

## Confirmations positives

- La règle du produit « un test proposé s'exécute » a tenu, et elle a **tué l'hypothèse la plus séduisante** : la conversion de chemin MSYS de Git Bash a été soupçonnée, testée en trois valeurs, et mesurée **non coupable** — la variable arrive intacte à un exécutable Windows. La cause est donc déclarée non prouvée plutôt qu'inventée.
- La question « y a-t-il un secret là-dedans ? » a été traitée **avant** la question « faut-il l'effacer ? », dans l'ordre que le hameçon d'ouverture prescrit pour le fichier `null` du parc : vérifier le contenu AVANT d'effacer, parce qu'une réponse authentifiée y conserverait un jeton.
- R-29 a tenu : le dossier n'a pas été supprimé par la session. Il est décrit, chiffré, et sa suppression est posée en décision.

## Ordre recommandé

1. **RF-32 (2)** — les motifs de garde dans le `.gitignore` de socle : c'est une liste de cinq lignes, et c'est la seule pièce qui protège du cas grave (un cache de jetons commis).
2. **RF-32 (1) et (4)** — la règle d'entrées inattendues à la racine, de préférence branchée sur le hameçon d'ouverture qui fait déjà ce travail au niveau du parc.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-32** → `secret-porte-hors-perimetre` (famille `hook-ou-gate`, correspondance **exacte** sur le mécanisme, **approchée** sur l'issue : la classe décrit un fichier porteur de secrets qui vit dans un dépôt qui ne l'ignore pas, jusqu'à être publié, et note que R-14 juge un dépôt sans voir ce qui s'y crée en cours de route. Ici le porteur potentiel — un profil d'outil d'authentification — a bien été créé, commis et poussé dans un dépôt qui ne l'ignore pas ; il s'est trouvé **vide** parce que la connexion n'avait pas abouti dans ce profil-là. C'est un raté de peu, pas une fuite, et c'est exactement ce que la classe existe pour attraper avant qu'il soit gros).
