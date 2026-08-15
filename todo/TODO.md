# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=800dc5bfe560 archive=88c26045fb6e · dernier événement: 2026-08-15T17:34:02Z -->

**21 actifs** (candidat 21 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **267 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0286 | candidat | 2 | design : CLI de rendu comparatif léger pour correctif ad hoc (avant/après, breakpoints, une commande) | **oui** — un wrap de texte de menu visible par n'importe quel œil humain a atteint la production |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0282 | candidat | 1 | forge-agents : le hook quality-oracles juge les fragments Jinja comme pages autonomes | **oui** — contournement d'outillage pour 9 templates + 1 retour d'ecriture bloquee |

## digit-ai-forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0275 | candidat | 1 | forge-design : check_maquette C2/C15 scannent le JS inline (Motion vendore = faux positif bloquant) | **oui** — 2 rebuilds de la maquette + contournement base64 du vendored officiel |
| TF-0276 | candidat | 1 | forge-design : oracle-tokens T5 produit cartesien texte-*/fond-* sans co-occurrence | **oui** — renommage de 5 tokens hors convention + perte du controle T5 sur les paires contextuelles |
| TF-0277 | candidat | 1 | forge-design : oracle-images I5/I6 supposent des images generees | **oui** — 18 entrees de manifeste remplies de champs sans objet |
| TF-0278 | candidat | 1 | forge-design : run-oracles-design rapporte render_page FAIL avec findings vides | **oui** — 1 aller-retour de diagnostic (lancement manuel de render_page sur 2 themes) |

## digit-ai-forge-ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0269 | candidat | 6 | fiche expert-ops-railway : domaines generes, renommage API-only, origine publique en variable (complement R6 lot 20260815a) | **oui** — un renommage de domaine a l aveugle (CLI muet), retrouve par exploration API ; a capitaliser pour ne plus le payer |
| TF-0281 | candidat | 1 | forge-ops : oracle-ops O-2 casse avec une cible relative | **oui** — 4 diagnostics dont une copie instrumentee de l'oracle avant de trouver la cause |

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0267 | candidat | 6 | oracle-conformite-projet : juger mecaniquement le suffixe d environnement des URLs R-24 | **oui** — defaut de nommage livre et presente a l humain, un renommage de domaine + une mise a jour documentaire apres cloture |

## digit-ai-forge-seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0273 | candidat | 8 | forge-seo : crux.py sans clé sort en 1 sans écrire de trace — symétriser avec le non-mesurable tracé d’agents_ia | **oui** — asymétrie constatée sur pièce entre deux volets du même service cat-seo-06 |
| TF-0274 | candidat | 6 | forge-seo : les six test_*.py sont des scripts à main() invisibles de pytest — un runner unique éviterait l’oubli | **oui** — 10 vérifications lancées une à une par les campagnes du 15/08 — chaque brief a dû les énumérer, et rien n’attrape un fichier de test oublié |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0268 | candidat | 4.5 | forge-tests pan qualif : confronter les URLs auto-referentes des pages servies a l origine auditee | **oui** — defaut SEO reel (canonique localhost) livre en recette malgre 5 audits verts ; decouvert par ricochet d un renommage de domaine, corrige en run de version (26 tests ajoutes cote produit) |
| TF-0270 | candidat | 4 | forge-tests : data._repli_textuel est du code mort ancré sur backend/tests | **oui** — fonction jamais appelée, vérifiée au balayage de la campagne — zéro effet observable aujourd’hui, piège si rebranchée telle quelle |
| TF-0272 | candidat | 4 | forge-tests : requalifier en « assume » l’entrée NON_JUGE du pan prompts (exclusion forge/ déclarée) | **oui** — contrat du registre de dette : un énoncé neuf entre en todo tant qu’un humain ne l’a pas requalifié — l’entrée restera comptée en dette ouverte à chaque run |
| TF-0279 | candidat | 1 | forge-tests : ids de findings SAST instables, contestation impossible | **oui** — 2 actions manuelle_dev incompressibles au rapport final malgre contestation legitime |
| TF-0280 | candidat | 1 | forge-tests : le vendored de tests n'est pas exclu du pan securite | **oui** — 114 contestations a rediger pour un actif tiers d'outillage |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0271 | candidat | 12 | pilot : ETAPES-RUN prescrit un --livrables DANS le projet audité — que G-1 refuse (désormais bruyamment, exit 4) | **oui** — deux exécutions perdues le 15/08 sur un refus G-1 dont le motif était enfoui — la prescription du pilot fabrique le refus à chaque run qui la suit |
| TF-0285 | candidat | 7.5 | pilot/organization : règle « produit legacy touché = verdicts forge » — le correctif ad hoc hors run n'a aucun gate | **oui** — 2 mises en production défectueuses le même jour sur le site vitrine principal du cabinet |
| TF-0287 | candidat | 4 | Circuit de l’insatisfaction : de la phrase brute à la version corrigée — dépôt une-phrase, instruction six blocs, réouvertures comptées | **oui** — l’exemplaire réel porte ~60 mots de protocole manuscrit et une réouverture non comptée (« toujours pas ») — le coût que le circuit supprime, mesurable dès le premier dossier |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0283 | candidat | 4 | tests : étendre le pan interface aux composants React/JSX — les liens cassés des Header/Footer Next sont invisibles | **oui** — 4 liens faux livrés en production, signalés par l'humain, deux allers-retours de correction |
| TF-0284 | candidat | 4 | tests : créer un pan i18n — parité de routes, parité de navigation et langue du contenu par locale | **oui** — version anglaise annoncée en prod avec un menu au tiers et du contenu français sur 9 pages ; détecté par le client, pas par l'outillage |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
