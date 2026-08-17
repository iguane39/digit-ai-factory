# Synthèse de mandat — « traite les TODOs à faire » (8 items, 4 campagnes + doctrine)

## En-tête d'identification

**Quoi** : fin de mandat global (TF-0296..TF-0303 — la totalité du registre actif, dont
2 items nés EN COURS de mandat du lot Produit-01 dénoncé par B1). **Sur quoi** : 4 dépôts
écrits — pilot, forge-tests, forge-ops, forge-agents. **Quand** : 17/08/2026, fin à 11:16
(Europe/Paris), durée ≈ 65 minutes. **Qui** : session pilot (Fable) + 4 agents (3 Opus,
1 Sonnet — routage §4 ; escalades : aucune), pilot@945f102.

## Verdict

8 items sur 8 corrigés et archivés (registre : 304 archivés, oracle R1-R10 PASS avant et
après archivage) ; S-01 TENU 13/13 rejoué (pytest 637 → 656, corpus 23), self-test ops
63 → 68, page-html 43 → 52, oracle-skills 37 → 48 — chaque campagne rejouée par le pilot
en sondage ; règle R-38 encodée au noyau (PASS 6133 ≤ 6144, FAIL N1 hérité réparé).

## Décisions attendues de l'humain

- **Retirer la page publiée par erreur** (R-38 §2, cas fondateur RG-07) : le rapport
  d'écarts Produit-01 — citant deux failles exploitables — vit encore sur
  `claude.ai/code/artifact/7d535fbf-f5b0-4004-8ca8-c0e8d9a456a8`. Le retrait n'est pas
  outillé : geste dans l'interface du service, puis me dire « retiré » pour consignation.
  Par défaut : la page reste en ligne et le risque avec elle.
- **Le gate C7** (reprise de ce matin, enrichie) : (a) décider TF-0304 — le câblage entre
  au settings versionné de forge-agents, puis `--appliquer` + recâblage (K7 guiderait) ;
  (b) déclarer le gate abandonné. Recommandation : (a) — K7 nomme le trou à chaque run
  tant que rien n'est décidé (c'est le défaut).
- **9 candidats neufs (TF-0304..0312)** : (a) « traite les todo » à nouveau (~30 min,
  TF-0304 et TF-0312 d'abord) ; (b) item par item ; (c) laisser. Par défaut : (c).
- **Toujours pendantes** : `assume` sur les 2 dettes TF-0292 ; réinstallation C7 physique.

## Traité — avec sa preuve

- lot Produit-01 : dénoncé par B1 (FAIL à l'ouverture), confronté (zéro recouvrement),
  ingéré (TF-0302/0303), étudié (20260817b PASS 7/7, verdict O3) ;
- TF-0302 (pilot, doctrine) — R-38 encodée aux trois surfaces ; noyau dégraissé 6235 →
  6133 octets, oracle-claude-md rejoué PASS, aucune règle perdue ;
- TF-0303 (agents@8ec054a) — check_html +5 contrôles sans duplication : le fichier
  fautif rejoué en fixture déclenche 11 échecs au lieu de 0 ; self-test 43 → 52 ; la
  règle a corrigé la référence du socle elle-même (charset au 1613e octet) ; copie
  installée synchronisée par le pilot (21 fichiers, oracle-skills PASS) ;
- TF-0296 (agents@f7216b6) — 13 sidecars hors suivi git, chacun tracé à son écrivain ;
  indépendance prouvée (retirés du disque, 4 self-tests verts) ; motif .gitignore
  structurellement manquant bouché ;
- TF-0297 (pilot@945f102) — K7 : câblage des hooks visible, déclaratif par construction ;
  self-test 37 → 48, 4 mutations tuées ; run réel PASS nommant « décrit NULLE PART » ;
- TF-0298 (ops@1c4387d) — canary scelle son empreinte, O-7 PASS au lieu de SKIP à vie ;
  self-test 63 → 68 rejoué pilot ;
- TF-0299/0300/0301 (tests@053141d) — préalable conteneur déclaré aux trois étages
  (10 [MANQUE] → [NON MESURABLE] motivés, S-01 NON PRONONCÉ exit 3) ; H-20 au corpus
  (22 → 23, la branche accusatrice de TF-0288 mesurée en recette) ; test trivial prouvé
  par mutation puis rendu discriminant ; S-01 TENU 13/13 final, pytest 656, dette 140
  sans écart — rejoués pilot.

## Non traité — avec son motif

- le retrait de la page publiée — motif : geste humain dans l'interface du service
  (aucun verbe machine, option O4 de l'étude) ;
- les 9 candidats TF-0304..0312 — motif : nés pendant la vague, décision humaine ;
- INS-0001 — motif : inchangé, remis au produit, se ferme sur release constatée ;
- un exit 1 transitoire d'oracle-skills observé une fois (9 runs suivants PASS) — motif :
  non reproductible, probable écriture concurrente pendant la lecture K2 ; à surveiller.

## Écarts à la lettre

Les agents en ont déclaré treize, tous motivés ; les trois qui te concernent : K7 couvre
« décrit nulle part » au-delà de la lettre (la lettre stricte rendait ZÉRO constat sur le
cas fondateur — forge-agents ne déclare pas son propre hook) ; le verdict TF-0299 distingue
suspension (exit 3) et NON TENU conservé si une section est réellement rouge (une mesure
manquante n'absout pas un échec réel) ; le banc H-20 a demandé 4 fichiers et non 1 (sans
routes déclarées, 3 findings d'une AUTRE classe polluaient le constat).

## Risques

- la page publiée reste accessible tant que le retrait n'a pas eu lieu ;
  - signal : l'URL répond encore ; parade : décision en tête, R-38 §2 pour les suivantes.
- le contrôle servi↔versionné peut accuser à tort un produit sans locale déclarée
  (TF-0312, reproduit hors bancs) ;
  - signal : un FAIL « entrées manquantes » sur un déploiement vérifié correct ;
  - parade : candidature ouverte, suspension déjà idiomatique (TF-0295 (4)) ; aucun des
    deux bancs ne le déclenche aujourd'hui.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — retirer la page publiée (2 min : c'est la fuite
  vivante), puis trancher C7/TF-0304.
- Ensuite `auto_ia` — sur ton mandat : router TF-0304..0312 (TF-0312 tôt : un faux
  positif sur un contrôle né avant-hier lui coûterait sa crédibilité avant son premier
  vrai cas).
- Enfin `manuelle_dev` — côté produit-07 : redéployer et clore INS-0001.

## Traces

- `output\03-etudes\20260817-etude-opportunite-publication-livrables.md` (PASS 7/7) ;
- commits : pilot `970efeb`, `7f3f7f4`, `945f102` (+ celui-ci) · tests `c99d5b7`,
  `3628a47`, `053141d` · ops `1c4387d` · agents `f7216b6`, `8ec054a` ;
- `todo\TODO.md` (9 actifs) · `todo\TODO-ARCHIVE.jsonl` (304) · `BOUCLE-AMELIORATION.md`
  (2e vague du 17/08) · rapports d'agents (4) reçus en session, ~15 émissions relayées ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Traite les todos a faire - 20260817a.md`.
