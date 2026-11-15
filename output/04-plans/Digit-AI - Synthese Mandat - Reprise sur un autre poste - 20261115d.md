---
destinataire: humain
---

# Synthèse Mandat — reprise sur un autre poste (15/11/2026)

## 0. Synthèse d'ouverture

La Factory peut maintenant être reprise sur un autre poste sans perte. Sa mémoire de travail voyage par le canal confidentiel, et les captures de référence comme les 2 vieux commits sont sauvegardés sur votre Drive. Les 2 commits n'ont pas pu aller sur GitHub : ils portent des noms de produits en clair, que la garde de publication a refusés à juste titre. Pour les autres projets du poste, le détail est ci-dessous. 4 d'entre eux portent un vrai risque de perte, et 3 n'ont même aucun dépôt distant. Leur sauvegarde se fait projet par projet ; je vous la propose sans l'avoir lancée.

Livré : [Synthèse du 15/11, reprise sur un autre poste](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Reprise%20sur%20un%20autre%20poste%20-%2020261115d.md)

## 1. En-tête d'identification

Exécution de votre réponse « A1. A2, A3, A4 » à la restitution de 17:19, sur le canal confidentiel `_confidentiel`, forge-design, le pilot `digit-ai-factory`, votre Drive, et en lecture seule les projets de `C:\dev`. Synthèse relevée le 15/11/2026 à 17:26, heure de Paris (`date`). Session pilote Claude Opus 5.5 ; aucun agent.

Intention de la demande : que le poste puisse tomber ou être quitté sans rien perdre, et savoir précisément ce qui reste exposé ailleurs.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre : les 3 réserves de la Factory sont levées ou sauvegardées autrement, preuve à l'appui, et chaque projet exposé a son détail et son remède.

## 2. Verdict

Factory : mémoire publiée au canal confidentiel (c8aab12..7456a0a, garde du canal exit 0) ; 18 fichiers de captures sur 18 et 1 paquet git vérifié (`git bundle verify` : « is okay ») sur Drive, file d'envoi vide à 17:26. Hors Factory : 19 projets relevés, dont 4 à risque élevé.

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient ; les sauvegardes des projets sont proposées au bloc 8.

Bloquants de ce tour, chacun avec ce qui le lève :
- devplace.pro, Produit-68, BdL et digit-desk.fr portent du travail jamais publié, dont 3 sans dépôt distant : la sauvegarde se fait dans chaque projet, qui est autonome ; votre « A1 » ci-dessous la lance, projet par projet.
- 2 dossiers de pièces de banc du canal confidentiel, sur la lecture d'usage et sur les restitutions, n'y sont pas enregistrés et ne sont pas de mon fait : votre « A2 » ci-dessous les enregistre, après lecture de leur contenu.

## 4. Traité

- A-1 : les 10 notes de la mémoire de travail de la Factory sont copiées sous `memoire\DESKTOP-ULTRA7\` du canal confidentiel, privé, avec une ligne au mode d'emploi du canal qui dit ce que porte ce dossier ; la garde du canal (`node oracle-confidentiel.mjs .`) rend exit 0 ; publié c8aab12..7456a0a.
- A-2 : les 5 dossiers de captures non suivis de forge-design (18 fichiers, 7 Mo : maquettes et rendus de 2 produits, sans secret relevé) sont copiés dans « Factory - captures de reference forge-design », sous 40-Digit-AI, et retrouvés en ligne.
- A-3 : la publication des 2 branches du pilot sur GitHub est refusée par la garde de publication (153 noms de produits en clair, ces branches datant d'avant la pseudonymisation) ; je ne l'ai pas contournée. Les 2 branches sont sauvegardées dans un paquet git de 48 Ko, vérifié, dans « Factory - sauvegardes git » sous 40-Digit-AI ; il se restaure dans un clone du pilot par `git fetch <paquet> <branche>`.
- A-4 : relevé en lecture seule des 19 projets (`git log`, `git for-each-ref`, `git stash list`, `git status`), ci-dessous, du plus exposé au moins exposé.

| Projet | Ce qui ne vit que sur ce poste | Risque | Ce qui le sauvegarde |
|---|---|---|---|
| devplace.pro | 36 commits non poussés (du 20/04, audit et refonte), 5 branches locales, 2 remisages, 21 fichiers modifiés dans `packages` | élevé | publier `main` et les branches après relecture, puis enregistrer ou remiser les modifications |
| digit-desk.fr | 12 commits, aucun dépôt distant, alors que le produit est en production | élevé | créer un dépôt distant privé et y publier |
| BdL | 25 commits, aucun dépôt distant | élevé | créer un dépôt distant privé et y publier |
| Produit-68 | 5 commits, aucun dépôt distant, 25 fichiers modifiés, 156 non suivis (`forge`, `output`) | élevé | créer un dépôt distant privé, enregistrer `forge`, publier |
| `_wt-apb-styqr` (copie de travail d'Produit-02.com) | 1 commit du 21/10 (réservation du sauna par QR-code), 664 fichiers modifiés sous `site` | moyen | publier la branche `fix/livrets-styqr-162` ; vérifier si les 664 fichiers sont un rendu régénérable |
| `_wt-apb-livret` (idem) | 345 fichiers modifiés sous `site`, branche `feat/livret-traduit` | moyen | idem |
| Produit-02.com | 2 branches de sauvegarde locales, 3 remisages (22/10 à 11/11), 7 fichiers modifiés sous `forge` | moyen | publier les 2 branches de sauvegarde, convertir les remisages en branches publiées |
| Produit-12 | 5 commits du 14/10 (générateurs, pages des propriétaires), 10 fichiers modifiés et 15 non suivis sous `forge` | moyen | publier, puis enregistrer `forge` |
| Produit-85 | 1 commit du 31/10 (visite 3D), 22 fichiers modifiés, 66 non suivis (`forge`, `output`), 1 remisage | moyen | enregistrer et publier |
| forge-digit-ai-fr | 1 commit du 15/11 d'une session en cours, 23 branches de runs sans amont | faible | laisser la session en cours publier ; les branches de runs sont fusionnées ou jetables |
| EnlargeAIChat | 1 commit du 18/07 (version 3.1.0), 3 fichiers modifiés, 7 non suivis | faible | publier |
| Produit-69 | dépôt sans aucun commit, 11 fichiers non suivis | faible | premier commit et dépôt distant, ou rangement ailleurs |
| Produit-02.fr | 1 remisage du 10/11, 3 fichiers non suivis | faible | convertir le remisage en branche publiée |
| RAG4AO | 1 remisage du 06/01 | faible | convertir en branche publiée, ou abandonner |
| DPGFast | 19 fichiers non suivis (`spec`), 1 réglage local modifié | faible | enregistrer `spec` si c'est du travail |
| DriveOps | 9 fichiers non suivis (`onedrive`, `sharepoint`), `package-lock.json` modifié | faible | enregistrer si c'est du travail |
| LinkedInPostGenerator | 4 fichiers modifiés et 4 non suivis dans l'extension v3 | faible | enregistrer et publier |
| AugmentedPro.ai | 1 réglage local modifié, 1 fichier `nul` parasite | faible | rien à sauver |
| inZM_Extension | 1 fichier modifié dans l'extension | faible | enregistrer et publier |

Relecture d'intention : sans objet, motif : aucune consigne d'agent dans ce tour.

## 5. Non traité

- La sauvegarde des projets — motif : `garde_fou`, chaque projet est autonome et le pilot n'y écrit que sur un run demandé ; je propose A-1.
- Les 2 dossiers non enregistrés du canal confidentiel — motif : `garde_fou`, ils ne sont pas de mon fait ; je propose A-2.

## 6. Écarts à la lettre

- Vous avez accordé A-3, « publier les 2 branches du pilot sous un nom de sauvegarde » → je les ai sauvegardées dans un paquet git sur Drive → la garde de publication refuse leur envoi sur GitHub pour 153 noms de produits en clair, et Drive est privé.
- A-2 annonçait 14 Mo de captures → la copie en compte 7 Mo → mon relevé précédent mesurait tout le dossier `baseline\`, y compris les dossiers déjà suivis par git.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Sauvegarder les 4 projets à risque élevé (devplace.pro, digit-desk.fr, BdL, Produit-68), un run par projet, dépôts distants privés créés pour les 3 qui n'en ont pas | neuve | auto_ia | garde_fou : run de produit à demander | votre « A1 » | 36, 12, 25 et 5 commits et le travail en cours de ces projets perdus avec le poste |
| A-2 | Enregistrer et publier les 2 dossiers non enregistrés du canal confidentiel, après lecture de leur contenu | neuve | auto_ia | garde_fou : travail d'une autre session | votre « A2 » | ces pièces de banc restent sur ce seul poste |
| A-3 | Mettre à jour les skills installés forge-agents et ameliore-le-design | neuve | auto_ia | gate_gouvernance : accord humain exigé par la règle de propagation | votre « propage » | les sessions du poste exécutent les anciennes versions |
| A-4 | Supprimer les 2 dépôts jetables d'un agent avec `Remove-Item -Recurse -Force C:\tmp-pb` | neuve | manuelle_utilisateur | irreversible : la protection du poste réserve à l'humain la suppression d'un dossier de la racine du disque (refusée à la session sous PowerShell et à l'agent sous Bash) | votre geste | 741 fichiers inutiles restent sur le disque |

## 9. Traces

Canal confidentiel 7456a0a (`memoire\DESKTOP-ULTRA7\`, `LISEZMOI.md`) ; Drive, sous 40-Digit-AI : « Factory - captures de reference forge-design », « Factory - sauvegardes git » (`pilot-branches-locales-20261115.bundle`) ; relevé des projets dans `releve-projets.txt`, dossier temporaire de la session.
