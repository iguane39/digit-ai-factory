---
role: synthèse de fin de tour (R-44) — quatre décisions exécutées le 03/09/2026
destinataire: humain
sources_de_verite: [todo/TODO.jsonl, todo/HERITAGE-RELEVES.jsonl, oracles/self-tests.mjs, git log du pilot et de forge-agents]
verifie_le: 2026-09-03
---

# Synthèse — décisions 1a, 2a, 3a, 4a du 03/09/2026

Le pilot est publié sur une histoire propre pour la première fois, les quatre forges qui portaient du travail local sont publiées, le poste ne porte plus ni clone mort ni fichier parasite, les cinq produits sans lanceur en ont un, et les deux constats en passant sont clos avec leur mesure. Ce que ça change pour vous : l'ouverture du poste ne se déclare plus « non prêt », et une montée de version d'un skill vous est dite à l'ouverture avant qu'un verdict de recette ne change. Ce qui est attendu de vous : rien n'est en suspens ; deux publications de suite (forge-agents et le pilot après ce tour) attendent votre prochain GO.

## 1. En-tête d'identification

- **quoi** : exécution de quatre décisions humaines (publication, ménage du poste, deux candidats décidés, équipement de cinq produits) ;
- **sur quoi** : digit-ai-factory (pilot), digit-ai-forge-agents, digit-ai-forge-design, digit-ai-forge-tests, digit-ai-forge-audit, et cinq produits du parc ;
- **quand** : 2026-09-03, 16:35 Europe/Paris, durée environ 1 h 15 ;
- **qui** : Claude Fable 5.1, pilot au commit 21563be (après réécriture d'historique), forge-agents bec13c2.

## 2. Verdict en une ligne

Pilot publié en force (a89ef81 → 21563be, divergence `0 0`, porte PASS historique compris), quatre forges publiées (0 commit en avance), poste « prêt » (1 avertissement déclaré), produits sans lanceur 5 → 0, TF-0788 et TF-0789 clos (16 → 0 débordements ; montée de version lue à l'ouverture), recette du pilot 93/93.

## 3. Décisions attendues de l'humain

> **D-5 — Décidez-vous le constat en passant que la critique forge-design a rendu sur l'exemple des schémas ?**
> La critique d'implémentation jouée sur la page modèle du skill de schémas rend « Refondre », plafonnée par un red flag : bandeau latéral de trois pixels sur les blocs de code et les encadrés, deux cent trente-neuf couleurs en dur dans les schémas vectoriels générés, aucune règle de mouvement réduit. Ces défauts existaient à l'identique avant le chantier du jour, qui visait le débordement mobile et la lecture tierce. Chaque schéma produit à partir de ce modèle en hérite.
> **Recommandation : (a).** Source consultée : verdicts d'`oracle-slop`, `oracle-tokens` et `oracle-mobile` joués sur les deux versions de la page ; règle de verdict de `critique-le-design`.
> Parce que la cause est le générateur de schémas vectoriels, qui émet des hexadécimaux au lieu de jetons : corriger le générateur corrige tous les schémas à venir, pas seulement l'exemple.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Décider TF-0856 : le générateur émet des jetons, le bandeau est arbitré, le mouvement réduit ajouté | Moyen × moyen, chez forge-agents et forge-design | Rien |
| **(b)** Écrire une exemption motivée pour le bandeau et laisser le reste | Simple × court | Les couleurs en dur restent dans chaque schéma produit |
| **(c)** Laisser le candidat au registre | Rien | La page modèle garde un red flag |

> **Si rien n'est décidé** : (c), TF-0856 reste candidat.

## 4. Traité — avec sa preuve

- **D-1 (a), forges** : `git push origin main` sur agents, design, tests, audit ; `git rev-list --left-right --count origin/main...HEAD` rend `0 0` sur les quatre (24, 7, 11 et 3 commits publiés).
- **D-1 (a), pilot — la porte était rouge sur l'arbre** : `oracle-nom-client-publie .` rendait FAIL, 21 constats C1 sur `todo/HERITAGE-RELEVES.jsonl` (5 lignes) et `todo/RECIDIVES.md` — les deux fichiers écrits ce matin par le relevé d'héritage avec les chemins réels du parc. Classe : `restitution`/publication, même classe que D-37 du 01/09 (état machine à noms réels dans un fichier suivi).
  - correction à la source : `scripts/lib-pseudonyme-produit.mjs` (recette 7/7) et `oracles/hook-ouverture.mjs` — le journal ne porte plus que des pseudonymes ; la table des pseudonymes n'est PAS étendue par le relevé (un premier jet l'étendait, et l'anonymiseur voulait alors réécrire 14 fichiers suivis dont l'archive immuable) ;
  - nettoyage : 6 relevés réécrits, tableau de bord régénéré (`generer-recidives.mjs` : 30 classes, 0 récidive, 6 relevés) ; `anonymiser-suivis.mjs --essai` : 0 fichier à nettoyer ;
  - l'historique portait encore ces noms dans les quatre commits du matin : sauvegarde `git bundle` (vérifiée) puis `git filter-repo` avec les règles générées (44 règles de contenu, 35 paires de noms), mode opératoire de `references/TODO-FORGE.md` ; `oracle-nom-client-publie .` rejoué sur l'historique local : PASS (1 constat informatif) — 200 constats à 15:41, 21 sur l'arbre, 16 dans l'historique, 0 à 16:33. Le dernier commit (vues régénérées du registre, 21563be) est postérieur à ce passage ; `anonymiser-suivis --essai` sur l'arbre après lui : 0 fichier à nettoyer ;
  - **publication** : `git push --force origin main` → `a89ef81...21563be main -> main (forced update)` ; `git rev-list --left-right --count origin/main...HEAD` → `0 0` ; `node bootstrap.mjs --pull` → « Poste prêt », pilot `v1.17.30-227-g21563be` à jour.
- **D-2 (a)** : fichier parasite `c:\dev\null` (1 317 octets, page de redirection sans jeton, relu avant suppression) et trois clones morts supprimés ; vérifié avant : 0 commit non poussé chez chacun (le HEAD du clone de forge-development existait dans le dépôt vivant). Le relevé d'ouverture ne les signale plus : `bootstrap --pull` ne rend plus qu'un avertissement, la mise de côté déclarée `_archive-digit-ai-forge-pilot_vide` (pierre tombale portant `PERIME.md`, hors de la décision).
- **D-3 (a), TF-0788** : `scripts/relever-empreintes-skills.mjs` + recette 8/8, câblé dans `oracles/hook-ouverture.mjs`, site déclaré dans `references/EMPREINTES.md` (`oracle-empreintes` E2 rouge → vert). Exercé sur le parc : première consignation 24 skills ; l'ouverture suivante a rendu « RÈGLES DU SOCLE CHANGÉES — digit-ai-schemas 9ad6f80d1135 → e14fe6941a8d » après la propagation de TF-0789. Clos au registre avec descente.
- **D-3 (a), TF-0789** : forge-agents bec13c2 — exemple de référence transformé (17 tables en cartes sous 640 px, 494/494 cellules étiquetées, 67/67 en-têtes définis, intention déclarée, sigles glosés). `render_page.py --widths 390` : 16 → 0 débordement, PASS aux quatre largeurs ; `oracle-lecture-tiers` FAIL → PASS ; `check_html.py` PASS ; `oracle-parite-assets` PASS ; rendu 390 px lu (cartes étiquette/valeur). Propagé à la copie installée (`sync-skills --diff` : aligné). Clos au registre avec descente.
  - **critique d'implémentation forge-design (`critique-le-design`, mode aval dégradé en critique classique faute d'artefact design de référence, déclaré)** — verdict calculé : **Refondre**, plafonné par le red flag RF3 (`oracle-slop` S1 : bandeau latéral de 3 px, 3 constats) ; `oracle-tokens` FAIL (239 couleurs en dur T1 dans les SVG générés) ; `oracle-mobile` FAIL (M6, `prefers-reduced-motion` absent) ; `oracle-taste` PASS ; `oracle-a11y` PASS ; `render_page` PASS. Les mêmes oracles joués sur la version AVANT le chantier rendent les mêmes constats (slop 3, tokens 239, mobile 2 → 1) : ces défauts sont préexistants et hors du périmètre de TF-0789 ; ils entrent au registre comme constat en passant, TF-0856 (candidat, score 2,7).
- **D-4 (a)** : `gabarits/hooks-factory.mjs` copié en `forge/hooks/factory.mjs` chez les cinq produits (copie identique vérifiée par `cmp`) ; `.claude/settings.json` copié chez trois, FUSIONNÉ chez deux qui en avaient un (hooks existants conservés, 4 événements ajoutés). Lanceur exercé depuis un produit : le hook du lexique répond. Relevé après pose : 9 produits, 69 manques (77 avant), 0 sans lanceur (5 avant). Rien n'est enregistré chez eux : leur prochaine ouverture recopie le reste et enregistre.
- **Recette du pilot** : `oracles/self-tests.mjs` exit 0, 93 oracles et recettes (91 + 2 neuves), cliquet tenu ; registre : 10 actifs (6 décidés, 3 corrigés, 1 candidat entré ce tour), oracle-todo PASS à chaque écriture (`journaliser.mjs`, 7 événements).

## 5. Non traité — avec son motif

- **La publication de forge-agents après ce tour (commit bec13c2)** : *gate de gouvernance* — R-38 ; le GO de D-1 couvrait les 45 commits existants au moment de la décision, pas un commit né ensuite.
- **La recette de forge-design et de forge-audit ne consigne pas l'identité des oracles qu'elle joue** : *hors mandat* — TF-0788 visait le pilot ; le volet local de chaque forge est celui que forge-tests a fermé pour elle-même (TF-0786), à reproduire chez elles sur mandat.
- **L'enregistrement chez les cinq produits** : *garde-fou* — le pilot pose, le produit enregistre (N-5) ; leur hook d'ouverture recopie les onze autres artefacts à la prochaine session.
- **Le contrôle pre-commit d'anonymisation** : *hors mandat* — proposé le 03/09 au matin, non décidé ; ce tour a payé une fois de plus son absence (la porte rouge ne s'est vue qu'à la publication).
- **Les défauts préexistants de l'exemple des schémas (bandeau latéral, couleurs en dur, mouvement réduit)** : *dépendance à une décision humaine* — D-5 ; consignés en TF-0856, rien n'est corrigé.
- **Le relevé d'héritage affiché à l'écran garde les chemins réels** : *écarté pour ce tour* — il n'est pas suivi par git, et l'humain qui décide de poser un lanceur a besoin du vrai chemin.

## 6. Écarts à la lettre

| Vous avez décidé | Ce qui est fait | Pourquoi |
|---|---|---|
| D-1 (a) « push forcé du pilot puis push des forges » | Forges publiées d'abord, pilot ensuite | La porte du pilot était rouge ; les forges étaient propres et avançables, les publier n'attendait rien |
| D-1 (a) ne parlait que de publier | Deux modules et une réécriture d'historique en plus | La porte refuse l'arbre ET l'historique ; publier sans corriger l'écrivain aurait rendu la porte rouge à la prochaine ouverture |
| D-2 (a) « supprimer » | Chaque cible relue avant suppression (contenu du fichier, commits non poussés des clones) | Supprimer est irréversible ; la décision portait sur quatre cibles vérifiées sans jeton ni travail perdu |
| D-4 (a) « copier deux gabarits » | Fusion, pas copie, chez deux produits qui avaient déjà un `settings.json` | Écraser aurait retiré leurs hooks existants |

## 7. Risques

- **Tout autre clone du pilot diverge de la nouvelle histoire** (deuxième réécriture du jour).
  - signal : `git pull` annonçant des centaines de commits divergents.
  - parade : recloner, jamais fusionner ; deux bundles de sauvegarde datés du 03/09 hors dépôt.
- **La table des pseudonymes n'est pas étendue par le relevé : un produit jamais ingéré est journalisé sous son nom de dossier anonymisé.**
  - signal : deux étiquettes pour un même produit dans `HERITAGE-RELEVES.jsonl` après sa première ingestion.
  - parade : l'ingestion inscrit le pseudonyme ; un alias dans la table (geste humain, hors dépôt) réconcilie les deux.
- **Le relevé d'empreintes compare à l'ouverture précédente du même poste : un skill monté puis remonté entre deux ouvertures n'est pas vu.**
  - signal : un verdict qui change sans ligne « CHANGÉES ».
  - parade : la recette de forge-tests consigne l'identité à chaque exécution (TF-0786) ; le journal de ce relevé peut être relu à la main.
- **Le repli en cartes masque les filtres de colonne sous 640 px.**
  - signal : un retour « les filtres ont disparu sur mobile ».
  - parade : la recherche dans la page reste offerte (T3) ; le socle le documente comme voulu.

## 8. Prochaines actions

Ordre de traitement : les deux GO de publication d'abord, parce que le travail de ce tour ne vit que sur ce poste tant qu'ils ne sont pas donnés ; puis ce qui reste hérité.

| # | Identifiant | Action | Acteur | Motif / raison | Exécutable par | Si elle n'est pas faite |
|---|---|---|---|---|---|---|
| **A-9** | `neuve` | Publier forge-agents (commit bec13c2, TF-0789) | auto_ia | `gate_gouvernance` : R-38, GO postérieur à D-1 | `git -C c:/dev/digit-ai-forge-agents push origin main` | L'exemple corrigé ne vit que sur ce poste |
| **A-10** | `neuve` | Publier le pilot après ce tour (commit de synthèse, porte à rejouer avant) | auto_ia | `gate_gouvernance` : R-38 — le commit de cette synthèse est né après le push forcé | porte puis `git push --force origin main` | La synthèse de ce tour ne vit que sur ce poste |
| **A-11** | `neuve` | Reproduire chez forge-design et forge-audit la consignation d'identité des oracles joués (modèle forge-tests TF-0786) | auto_ia | `hors_mandat` | `recette/verifier_corpus.py` de forge-tests comme modèle | Leurs recettes peuvent changer de verdict sans le dire |
| **A-12** | `neuve` | Poser le contrôle pre-commit d'anonymisation dans le pilot | auto_ia | `hors_mandat` : proposé le 03/09, non décidé | `node todo/anonymiser-suivis.mjs --essai` dans `.git/hooks/pre-commit` | Le prochain écrivain à noms réels ne se découvre qu'à la publication |
| **A-13** | TF-0674, TF-0676, TF-0682 | Chez le produit 02, ingérer le lot de travaux du 03/09 et exécuter les trois correctifs | auto_ia | `garde_fou` : le produit exécute ses propres travaux | session chez le produit 02 | La porte de fraîcheur du produit 02 reste sur un échantillon |
| **A-14** | TF-0749 | Comparer les deux campagnes au prochain passage en production d'un produit audité | auto_ia | `dependance_externe` : une campagne réelle | `python recette/non_perte_ciblage.py <projet>` dans forge-tests | Le ciblage par ligne mutée reste éteint sans preuve |
| **A-15** | `neuve` | Ouvrir une session chez chacun des cinq produits équipés : leur hook d'ouverture recopie les onze artefacts restants et enregistre le lanceur | manuelle_utilisateur | `presence` : la session d'un produit s'ouvre chez lui — trace mesurée : relevé après pose, 69 manques dont 55 chez ces cinq produits | Les artefacts restent absents jusqu'à leur prochaine ouverture |
| **A-16** | `neuve` | Donner le GO des deux publications (A-9, et A-10 si elle reste ouverte) | manuelle_utilisateur | `decision` : R-38 | ce message | Le tour ne vit que sur ce poste |
| **A-17** | TF-0856 | Décider le constat en passant de la critique forge-design sur l'exemple des schémas (couleurs en dur émises par le générateur de SVG, bandeau latéral à arbitrer contre S1, mouvement réduit) | manuelle_utilisateur | `decision` : tout entre en candidat | `décide TF-0856` | La page modèle garde un red flag que chaque schéma produit hérite |

## 9. Traces

- `scripts/lib-pseudonyme-produit.mjs`, `scripts/lib-pseudonyme-produit.test.mjs` (7 cas)
- `scripts/relever-empreintes-skills.mjs`, `scripts/relever-empreintes-skills.test.mjs` (8 cas), `.oracles/empreintes-skills.json` (ignoré)
- `oracles/hook-ouverture.mjs` (journal pseudonymisé, section « Skills installés »), `references/EMPREINTES.md`, `.gitignore`
- `todo/HERITAGE-RELEVES.jsonl` (6 relevés), `todo/RECIDIVES.md`, `todo/TODO.jsonl` (décisions et clôtures TF-0788, TF-0789 ; candidat TF-0856), `todo/TODO.md`, `todo/AVANCEMENT.md`
- Critique forge-design : `c:/dev/digit-ai-forge-design/oracles/oracle-slop.mjs`, `oracle-tokens.mjs`, `oracle-taste.mjs`, `oracle-mobile.mjs` et `quality-oracles/scripts/oracle-a11y.py`, joués sur bec13c2 et bec13c2~1
- `c:/dev/digit-ai-forge-agents` bec13c2 : `.claude/skills/digit-ai-schemas/assets/exemple-reference.html`, `.claude/skills/digit-ai-schemas/SKILL.md`
- `c:/dev/_sauvegarde-avant-filter-repo-20260903/digit-ai-factory-avant-filter-repo-20260903d.bundle`, `HEAD-avant-20260903d.txt`
- Chez les cinq produits : `forge/hooks/factory.mjs`, `.claude/settings.json` (non enregistrés, geste du produit)

## 9. Annotation de réconciliation (07/09/2026)

Cette synthèse a été écrite le 03/09/2026 sous l'indice `20260903d` et portait le numéro TF-0791 pour le constat en passant de la critique forge-design. Lors de la synchronisation du 07/09 (décision D-7 option (a) de la synthèse du 04/09), l'indice `d` s'est révélé pris par la synthèse de synchronisation de l'autre session du pilot, et le numéro TF-0791 frappé le 01/09 par cette même session pour un autre sujet : le fichier est réindicé `20260903g` et le numéro réécrit en TF-0856 par `todo/renumeroter.mjs`, motif consigné dans l'événement de création. Rien d'autre n'a changé.
