---
destinataire: humain
---

# Synthèse de mandat — décision D-12 (a) exécutée : la reconstruction d'un clone divergé est outillée dans le bootstrap, prouvée par recette, publiée, et renumérotée après une collision avec l'autre poste (07/09/2026)

Votre décision d'outiller la reconstruction d'un clone divergé est exécutée : le bootstrap du pilot porte un mode qui, sur un dépôt dont l'histoire publiée a été réécrite, sauvegarde le clone entier dans un paquet vérifié, isole le travail propre au poste par son contenu et non par ses empreintes, réaligne sur ce que l'hébergeur publie, rejoue ce travail, retire les copies de travail oubliées et joue la porte de publication, sans jamais pousser. Une recette à double sens le prouve sur des dépôts factices, et l'essai sur deux forges à jour répond « rien à rebâtir » sans laisser de trace. En publiant, la porte a révélé que l'autre poste avait frappé pendant ce tour les mêmes numéros de registre que moi : le mien a été renuméroté avant publication, l'histoire n'a pas été réécrite. L'autre poste a d'ailleurs écrit ce soir la même procédure en quatre gestes manuels : l'outil l'exécute et lui parviendra à son prochain pull. Ce qui est attendu de vous : rien de nouveau ; la levée de protection de la forge de développement reste le seul geste en attente.

## 1. En-tête d'identification

- **quoi** — mandat humain « 12a » sur la restitution de 20:49 : outiller la reconstruction d'un clone divergé (candidature, mandat pilot, recette).
- **sur quoi** — le pilot `digit-ai-factory` : `scripts\rebatir-clone.mjs`, `scripts\rebatir-clone.test.mjs`, `bootstrap.mjs` (mode `--rebatir`), `references\TODO-FORGE.md`, registre ; commit ead307a publié (1aaf23c → ead307a).
- **quand** — 2026-09-07 21:18 UTC+02:00 (Europe/Paris), durée ≈ 28 min depuis « 12a ».
- **qui** — pilot digit-ai-factory ead307a ; agrégateur de recettes du pilot (invariants I2 (toute recette du dépôt est jouée) et I5 (cliquet des comptes de cas)).

## 2. Verdict en une ligne

Outil livré et publié : recette 4 PASS, 0 FAIL ; agrégateur 95/95 recettes vertes, cliquet « première mesure 4 cas » ; essai sur forge-data et forge-design → « rien à rebâtir », 0 référence temporaire restante ; collision d'identifiants détectée au push (le distant portait TF-0869 à TF-0876), candidature renumérotée TF-0877 avant publication, registre PASS ; TF-0877 corrigé.

## 3. Décisions attendues de l'humain

Aucune décision nouvelle n'attend : la décision de ce mandat est exécutée, et le seul geste en attente est celui que vous vous êtes réservé au tour précédent, la levée de protection de la branche principale de la forge de développement (action A-39). Si rien n'est décidé : rien ne change, l'outil est publié et la forge de développement reste locale.

## 4. Traité — avec sa preuve

- Script `rebatir-clone.mjs` : refus d'un arbre sale, essai sans déplacement de `origin/main` (lecture du distant dans une référence temporaire effacée ensuite), mesure de l'avance, du retard et du delta propre au poste (commits par-dessus l'ancien distant connu ET absents du distant par contenu, `git cherry`), retrait de l'enregistrement des arborescences liées, paquet de sauvegarde vérifié avec HEAD d'avant, patches par commit, réalignement, rejeu `git am --3way` avec arrêt au premier conflit, porte de publication jouée avec les deux tables de la racine, jamais de push.
  - preuve : `node scripts/rebatir-clone.test.mjs` → « rebatir-clone (D-12 a, TF-0877) : 4 PASS, 0 FAIL » (clone à jour → rien à rebâtir ; arbre sale → exit 2 sans rien toucher ; histoire réécrite + commit propre + arborescence liée → paquet vérifié, un patch rejoué, arborescence retirée, ancienne histoire plus atteignable, porte déclarée SKIP faute d'oracle sur le poste de recette, jamais PASS par défaut ; rejeu en conflit → exit 1, patch conservé, aucun état résiduel).
- Deux défauts de conception trouvés par la recette et corrigés avant publication. Contrôle rouge → vert : (1) le delta était pris par empreinte (`origin/main..HEAD`) et rejouait les commits réécrits, 3 patches au lieu de 1 → delta par contenu depuis l'ancien distant, 1 patch ; (2) l'essai fetchait et déplaçait `origin/main`, si bien que le vrai passage ne connaissait plus l'ancien distant → l'essai lit une référence temporaire ; classe : outil qui consomme la connaissance dont son vrai passage a besoin.
  - preuve : recette 1 PASS 3 FAIL (« 3 !== 1 ») → 3 PASS 1 FAIL → 4 PASS 0 FAIL.
- Mode `--rebatir <dépôt> [--essai]` du bootstrap, délégation au script, aide d'usage.
  - preuve : `node bootstrap.mjs --rebatir digit-ai-forge-data --essai` → « à jour de origin/main — rien à rebâtir », exit 0 ; idem forge-design, « refs temporaires restantes : 0 ».
- Recette jouée par l'agrégateur du pilot, compte lisible et cliquet. Contrôle rouge → vert : « [NON JUGÉ] 1 recette(s) sans compte lisible » (résumé de `node:test` illisible) → lanceur maison du pilot, dernière ligne « 4 PASS, 0 FAIL » → « [CLIQUET] première mesure 4 cas » ; classe : recette sans compte auto-déclaré.
  - preuve : `oracles/self-tests.mjs` → « 95/95 recettes jouées et vertes … cliquet des cas tenu (I5) », exit 0.
- Collision d'identifiants avec l'autre poste, réglée avant publication. Contrôle rouge → vert : push refusé (avance rapide impossible, le distant portait un commit de 20:50 frappant TF-0869 à TF-0876) → mon TF-0869 renuméroté TF-0877 (premier libre sur le distant, archive comprise), commit rebâti sur le distant (mes cinq fichiers de code n'y étaient pas touchés), événements rejournalisés avec le motif de renumérotation, vues régénérées, `oracle-todo` PASS, push accepté ; classe : deux postes, un seul compteur (fenêtre entre préflight et push).
  - preuve : « max id sur origin : TF-0876 (TF-0877 libre ? oui) » ; `journaliser.mjs` → « 3 événement(s) », « 1 événement(s) », avant PASS après PASS, « 2026-09-07T19:12:01Z TF-0877 maj corrige » ; contrôle rouge → vert : push « ! [rejected] » → « 1aaf23c..ead307a main -> main », exit 0.
- Mode opératoire complété : « la copie locale de l'autre poste se rebâtit par l'outil » ; ce qui reste manuel est écrit (copie des deux tables hors git, publication sur GO).
  - preuve : `references\TODO-FORGE.md`, paragraphe « Réécrire l'historique d'un dépôt », publié dans ead307a.

## 5. Non traité — avec son motif

- Publication de forge-development : protection de branche toujours active (« force_interdit » à 20:46), votre geste A-39.
- Publication de forge-agents : décision D-29 du matin en attente.
- Ingestion des lots en attente dans la boîte d'entrée de ce poste : mandat à part ; l'autre poste a ingéré ce soir trois lots du même produit (TF-0869 à TF-0876), ce qui ne dispense pas de vérifier ceux qui restent ici.
- Le script n'est pas rejoué sur un dépôt réellement divergé : aucun dépôt du poste ne l'est ce soir ; la recette sur dépôts factices tient lieu de preuve, et le premier usage réel se consignera.

## 6. Écarts à la lettre

- L'option (a) disait « une candidature puis un mandat pilot » → la candidature, sa décision, sa mise en cours, l'outil et sa clôture ont été faits dans le même tour → pourquoi : votre « 12a » valait décision, et la loi transverse fait de la voie automatisée le défaut ; la candidature porte la décision humaine citée.
- Vous n'aviez pas demandé de renumérotation → TF-0869 est devenu TF-0877 → pourquoi : le distant avait frappé ces numéros pendant le tour ; un identifiant ne se partage pas, et le motif est annoté à la source de la candidature.
- Aucun autre écart.

## 7. Risques

- **Deux postes, un seul compteur** : signal = un push du pilot refusé en avance rapide après une journalisation ; parade = mesurer le distant avant de frapper (fait ce tour), renuméroter avant de publier, jamais après.
- **Premier usage réel du script sur un vrai clone divergé** : signal = un rejeu en conflit ou une porte rouge ; parade = exit 1 avec patch conservé et paquet vérifié, la suite est humaine ; à consigner en mémoire au premier usage.
- **Deux procédures écrites le même soir par les deux postes** : signal = l'autre poste rejoue les quatre gestes à la main alors que l'outil existe ; parade = le mode opératoire et l'aide du bootstrap nomment l'outil, et le pull du pilot l'apporte.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-37 | Publier forge-development en force depuis le clone réécrit, rejouer a7c2ecf, porte, push ordinaire | TF-0829 | auto_ia | dependance_externe (protection active, « force_interdit » mesuré) | `git push --force origin main --tags` dans `…/scratchpad/rw-development`, puis `node bootstrap.mjs --rebatir digit-ai-forge-development` (le clone local porte a7c2ecf, l'outil le rejoue) | le profil `data-transformation` reste sur ce poste |
| A-45 | Sur l'autre poste, à l'ouverture : `git pull --ff-only` dans le pilot, puis `node bootstrap.mjs --pull` ; pour chaque dépôt « DIVERGÉ », `node bootstrap.mjs --rebatir <dépôt> --essai` puis sans `--essai` ; copier les deux tables de `c:\dev\` de ce poste ; pousser sur GO | neuve | manuelle_dev | presence : ces commandes s'exécutent sur l'autre poste, hors de portée d'ici | les commandes citées, dans cet ordre | l'autre poste refait la mesure à la main |
| A-42 | Ingérer les lots en attente dans la boîte d'entrée de ce poste | neuve | auto_ia | gate_gouvernance (ingestion sur mandat) | `node todo\ingerer-lot.mjs` sur chaque lot de `input\00-retours\` | des retours n'entrent pas au registre |
| A-36 | Faire refuser par `todo\journaliser.mjs` tout nom de la table des pseudonymes à l'entrée du registre | neuve | auto_ia | gate_gouvernance (candidature à journaliser puis décider) | mandat pilot, fixture rouge/verte | le pilot peut réécrire un nom en clair au registre |
| A-39 | Autoriser le push forcé sur la branche principale de forge-development, puis me le dire ici | neuve | manuelle_utilisateur | acces : règle de protection modifiable par un administrateur seulement (« GH006 … Cannot force-push » mesuré) | réglages du dépôt chez l'hébergeur, règle de `main` | forge-development reste locale |

Ordre : A-39 d'abord, parce qu'elle débloque A-37 ; A-45 dès que l'autre poste ouvre une session, parce que chaque jour ajoute des réécritures ; A-42 et A-36 sur mandat.

## 9. Traces

- `scripts\rebatir-clone.mjs`, `scripts\rebatir-clone.test.mjs`, `bootstrap.mjs`, `references\TODO-FORGE.md`, `oracles\baseline-recettes.json` — commit ead307a, publié.
- `todo\TODO.jsonl` — TF-0877 (création, décision, en cours, corrigé), horodatages 2026-09-07T19:12Z ; `todo\TODO.md` sceau a26efd9b72aa.
- `output\04-plans\Digit-AI - Synthese Mandat - Synchronisation GitHub et procedure de l autre poste - 20260907i.md` — synthèse de l'autre poste, action A-6 (les quatre gestes manuels que l'outil exécute).
- `~\.claude\projects\c--dev-digit-ai-factory\memory\` — `sync-pilot-reconstruction-clone.md`, `porte-publication-clones-temporaires.md`.
