# Lot de retours — Produit-81 → pilot et canal confidentiel (initialisation sur un dépôt tiers) — 2026-10-13, indice a

**Émetteur** : produit `Produit-81`, clone local d'un dépôt Azure DevOps d'un client, développé par un tiers · **Cibles** : `pilot` (`bootstrap.mjs`, `scripts/adopter-projet-existant.mjs`, `references/ACCUEIL.md`, `PROMPT-PRODUIT-EXISTANT.md`) et `digit-ai-confidentiel` (`oracle-confidentiel.mjs`).

**Origine** : demande du porteur, le 13/10/2026 : « Remonte à la Factory les problèmes rencontrés lors de l'initialisation. » Le porteur est **coach et auditeur** de ce projet, pas son développeur. Le dépôt est géré par un autre développeur, et le porteur a fixé la règle : « Ne pousse jamais sur le Repo. »

Ce lot porte **4 retours** (RT-1 à RT-4).

- **Contexte** : ouverture d'une session sur un projet existant. Le hook d'amorçage a appelé `accueil-factory`, puis la phase 0 et la phase 0 bis ont été jouées en essai à blanc, et le protocole d'accueil s'est arrêté avant l'accord. Aucun run n'est ouvert.
- **Références ledger** : sans objet. Aucun ledger n'est ouvert, et l'adoption n'a pas été jouée (voir RT-3).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d’arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L’original est provisoirement dans le dossier temporaire de la session (voir RT-3).

---

## digit-ai-confidentiel (`oracle-confidentiel.mjs`, règle K3)

La phase 0 a fini sur « Poste NON prêt ». Son seul défaut venait de ce canal, sans rapport avec le produit ouvert.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | générique | **K3 rend FAIL sur l’identifiant d’accès d’exemple de la documentation AWS (préfixe AKIA, suffixe EXAMPLE), présent dans des fixtures de banc.** Le 13/10/2026, `node oracle-confidentiel.mjs C:\dev\_confidentiel` rend `verdict: FAIL`. Message K3 : « 4 fichier(s) ressemblent à un secret ». Les fichiers sont `bancs/paires/fichiers/{172,179}/{avant,apres}/self-test.mjs`, créés le 13/10/2026 à 08:42 et non suivis (`git status` : `??`). Chacun est une copie du self-test d'`oracle-conformite-projet`. Sa ligne 278 plante volontairement une affectation `aws_key` de cet identifiant d’exemple dans une fixture ROUGE de R-23. K3 juge donc l'oracle qu'il protège sur la fixture de son voisin. `grep EXAMPLE oracle-confidentiel.mjs` ne rend rien : aucune liste d'exemples documentés. Second fait : le message annonce **4** fichiers mais n'en cite que **3** (`suspects.slice(0, 3)`, ligne 64), et `bootstrap.mjs` tronque encore la citation (« …\avant\self-tes »). Le 4ᵉ chemin n'est lisible nulle part. | (1) Une liste fermée de clés d'exemple documentées par leur éditeur (l’identifiant d’accès et la clé secrète d’exemple de la documentation AWS) qui ne déclenche pas K3, avec une fixture rouge où une vraie forme de clé reste refusée. (2) Ou une exemption déclarée des chemins `bancs/**/fichiers/**`, portée par un fichier d'exemptions jugé. (3) Citer tous les suspects, ou les écrire dans un fichier dont le message donne le chemin. |

**Portée** : générique. Toute copie d'un self-test du parc dans un banc de paires reproduit le défaut, et il bloque le poste entier (voir RT-2).

## pilot (`bootstrap.mjs`, `scripts/adopter-projet-existant.mjs`, `references/ACCUEIL.md`, `PROMPT-PRODUIT-EXISTANT.md`)

L'initialisation a demandé trois arbitrages faute de règle. Un seul défaut hors du produit a bloqué l'état du poste. L'adoption allait écrire dans le dépôt d'un tiers. Et la surface web posée par l'adoption ne serait pas servie.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-2 | majeur | générique | **`bootstrap.mjs --pull` rend « Poste NON prêt » (exit 1) pour toute session de produit, à cause d'un défaut d'un dépôt que ce produit ne touche pas.** Le 13/10/2026, les 14 forges et le pilot sont à jour, les preuves des forges sont toutes `[ok]`, et l'unique `[DEFAUT]` est RT-1, dans `C:\dev\_confidentiel`. Le skill `accueil-factory` §2 prescrit : « Chaque défaut qu'il nomme porte son remède : l'appliquer avant de continuer. » Ici, le remède (« corriger » des fixtures de banc d'un canal confidentiel) est hors du périmètre de la session, et il modifierait un banc qu'une autre session a posé le matin même. La session doit donc soit enfreindre §2, soit sortir de son périmètre. Le verdict agrégé ne distingue pas un défaut qui empêche CE produit de travailler d'un défaut du parc. | Séparer deux verdicts : « poste prêt pour un produit » (outillage, pilot, forges, skills, amorçage) et « parc sain » (canal confidentiel, fichiers à la racine, clones périmés). Un défaut du second rend un avertissement nommé, avec son dépôt et son remède, sans exit 1 pour l'ouverture d'un produit. Écrire dans `accueil-factory` §2 la conduite à tenir face à un défaut hors périmètre : le relever au lot, ne pas le corriger. |
| RT-3 | majeur | générique | **La voie « projet existant » suppose que la session possède le dépôt. Aucune posture ne couvre un dépôt tiers, où le porteur fait du coaching ou de l'audit.** `adopter-projet-existant.mjs . --essai` sur ce clone annonce 25 éléments écrits **dans l'arbre de travail du dépôt tiers** : `CLAUDE.md`, `.claude/settings.json` (avec hooks), `robots.txt`, `llms.txt`, `forge/**`, `input/`, `output/`, `docs/`. Aucune option ne les place ailleurs. `ACCUEIL.md` ne demande jamais à qui appartient le dépôt, et ses garde-fous écrivent « Projet produit sous git local dès sa naissance ; remote et push sur GO humain ». La démarche proposée en a déduit un pas « commit dans le dépôt local ». Le porteur a dû intervenir : « Ne pousse jamais sur le Repo. Le projet est géré par un autre développeur. » Un `git add .` du développeur, ou de toute session ultérieure, aurait emporté ces 25 artefacts dans son dépôt. Conséquence directe : **ce lot n'a pas de domicile côté produit**. Le gabarit veut que « l'original reste ici (historique du produit) », mais « ici » est le dépôt d'un tiers. L'original est provisoirement dans le dossier temporaire de la session. | (1) Une question fermée à l'étape 1 d'`ACCUEIL.md` : « Ce dépôt est-il le vôtre ? (oui / tiers : audit, coaching) ». (2) Une option `--hors-depot <dossier>` d'`adopter-projet-existant.mjs` qui pose le socle dans un dossier frère (par exemple `<projet>-forge\`). Ce dossier serait sous git local et déclarerait le clone tiers comme entrant en lecture seule (`input\`, chemin et commit relevés). (3) Une règle jugée dans ce mode : aucune écriture sous la racine du clone tiers, vérifiée par `git status --porcelain` vide en fin de run. (4) Une ligne au tableau de routage : « auditer ou documenter un dépôt tiers » → run de mandat ou de conseil, posture hors dépôt. |
| RT-4 | mineur | générique | **L'adoption pose `robots.txt` et `llms.txt` à la racine d'un dépôt multi-projets, où ils ne seront jamais servis.** Le dépôt a deux sous-projets, `FRONT/` (React, racine web servie `FRONT/public/`) et `BACK/` (.NET). Aucun `robots.txt` n'existe dans le dépôt, hors `node_modules`. L'essai à blanc annonce « `[artefact] robots.txt — posé depuis gabarits/web/robots.txt` » et « `llms.txt` » à la racine. Ces fichiers satisferaient le contrôle de présence du socle sans rien changer à la surface publiée : un vert sur ce qu'ils doivent garantir. | Avant de poser la surface web, relever la racine servie (`*/public/`, `wwwroot/`, `static/`, sortie de build déclarée au manifeste). Poser les fichiers là, ou consigner l'écart au carnet quand la racine est ambiguë. Faire juger par le contrôle de surface la présence **sous la racine servie**, pas à la racine du dépôt. |

**Portée** : générique pour les trois. Tout projet existant d'un tiers, et tout dépôt multi-projets, rencontre RT-3 et RT-4 à sa première adoption.

## Rattachement

Le 13/10/2026, aucune recherche au registre (`todo/TODO.jsonl`) n'a été faite par cette session. Ce lot n'avait pas encore de run, et l'ingestion fait le rapprochement. Voisins connus, cités par les gabarits lus pendant la session : `TF-1285` et `TF-1286` (création de la voie « projet existant », D-2 (b) du 22/09/2026) pour RT-3 ; `TF-0981` (sas d'arrivée) pour le domicile du lot.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'adoption n'a pas été jouée : le socle n'est pas posé dans ce clone | Décision du porteur : rien n'est écrit dans le dépôt tiers ; le livrable demandé (schéma d'architecture) sera produit hors du clone | oui | remonté : RT-3 |
| Pas de domicile pour l'original de ce lot | Original provisoire dans le dossier temporaire de la session ; seule la copie remise au sas fait foi | oui | remonté : RT-3 |
| Fichier `C:\dev\null` de 0 octet, daté du 01/10/2026 16:57 | Non corrigé ici : `bootstrap.mjs` le déclare déjà, et sa suppression est un geste humain (R-29) | non : déjà couvert | non remonté |
| Le pilot a 1 commit local non poussé | Non touché : la publication est un geste humain | non : état du poste, pas un défaut | non remonté |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Le dépôt est sur Azure DevOps, mais aucune règle de branche ni stratégie n'a été lue ou rencontrée : la session n'a rien poussé et ne poussera rien.

## Confirmations positives

- Le hook d'amorçage au poste a tenu : le message qui nommait la forge depuis un dossier non instrumenté a appelé `accueil-factory` avant toute action. C'est le défaut fondateur de `TF-1285`, et il ne s'est pas reproduit.
- La résolution du pilot a suivi l'ordre prescrit et l'a dit : `$FORGE_ROOT` absent, parent `C:\dev\_Client-A` sans pilot, puis `C:\dev\digit-ai-factory` retenu.
- `--essai` a rempli son rôle : il a montré les 25 écritures avant qu'aucune n'ait lieu, ce qui a permis au porteur de les refuser sans rien défaire.
- `bootstrap.mjs` a déclaré le fichier `null` et le dossier `_archive-…_vide` sans les supprimer, comme R-29 le veut.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-1** : classe `oracle-faux-positif`. K3 rend rouge sur un artefact conforme, une fixture qui contient une clé d'exemple publique.
- **RT-2** : classe `point-entree-declare-rouge-sur-toute-cible`. Le point d'entrée du poste rend FAIL pour toute ouverture de produit, même verte, à cause d'un contrôle hors du domaine de ce produit.
- **RT-3** : aucune classe existante ne convient. `produit-instancie-a-moitie-hors-de-tout-depot` parle d'un produit invisible, pas d'un dépôt qui appartient à un autre.
  - Clé proposée : `adoption-ecrit-dans-un-depot-tiers`
  - Famille : `emplacement-livrable`
  - Libellé : « L'entrée d'un projet existant suppose que la session possède le dépôt : sur le dépôt d'un tiers (audit, coaching), le socle et les livrables s'écrivent dans son arbre de travail, faute d'une posture hors dépôt »
- **RT-4** : aucune classe existante ne convient.
  - Clé proposée : `surface-web-posee-hors-racine-servie`
  - Famille : `heritage-produit`
  - Libellé : « Un artefact de surface web hérité (robots.txt, llms.txt) est posé à la racine du dépôt au lieu de la racine servie : le contrôle de présence passe, la surface publiée ne change pas »

## Ordre recommandé

1. **RT-3**, parce que c'est le seul retour qui expose le dépôt d'un client. Une question fermée à l'étape 1 de l'accueil suffit à arrêter la session avant toute écriture.
2. **RT-2**, parce qu'il rend rouge chaque ouverture de produit tant qu'un défaut du parc subsiste, et pousse les sessions soit à l'ignorer, soit à sortir de leur périmètre.
3. **RT-1**, dont la correction fait aussi passer RT-2 au vert aujourd'hui, sans traiter sa cause.
4. **RT-4**, au prochain passage sur la surface web de l'adoption.
