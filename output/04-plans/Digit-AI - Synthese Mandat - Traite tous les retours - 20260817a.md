# Synthèse de mandat — « tous les retours de 00-retours sont-ils traités ? traite-les, archive-les » (4 items, 1 campagne)

## En-tête d'identification

**Quoi** : fin de mandat global — audit de la boîte des retours, traitement du reliquat,
classement des paires. **Sur quoi** : 2 dépôts écrits — pilot, forge-tests. **Quand** :
17/08/2026, fin à 12:14 (Europe/Paris), durée ≈ 55 minutes. **Qui** : session pilot
(Fable) + 1 agent (Opus — routage §4 ; escalades : aucune), pilot@94f01d4.

## Verdict

La question a sa preuve : les 14 lots de `input\00-retours` étaient TOUS ingérés et tous
leurs items archivés SAUF 4 (TF-0313..0316, lots du matin) — désormais corrigés et
archivés (registre : 308, oracle R1-R10 PASS) ; S-01 TENU 13/13 rejoué (pytest 656 → 721,
dette 143 sans écart) ; les 14 paires de lots classées en `old\`, boîte d'entrée PASS.

## Décisions attendues de l'humain

- **10 candidats actifs** (TF-0304..0312 + TF-0317) : (a) « traite les todo » à nouveau
  (~30-40 min ; TF-0304 et TF-0312 d'abord) ; (b) item par item ; (c) laisser — défaut.
- **Toujours pendantes, reprises des synthèses du jour** : retrait de la page publiée
  (`claude.ai/code/artifact/7d535fbf-…`, fuite vivante) · câblage du gate C7 (TF-0304
  est le remède durable) · `assume` sur les 2 dettes TF-0292.

## Traité — avec sa preuve

- cartographie lot → items → statuts exécutée sur les 14 lots (script, événements
  d'ingestion croisés registre + archive) — preuve : 12 lots à items 100 % archivés,
  2 lots portant les 4 candidats restants ;
- TF-0313 (tests@f6c5eb0) — la mire d'une SPA est ATTENDUE (10 s/route) : le cas BAV2
  passe de « 0 élément, compte valide accusé » à mesurable (91 éléments en contre-épreuve
  du lot) ; 10 tests, suite 656 → 666 ;
- TF-0314 (tests@78179b4) — provenance CONSTATÉE (cookie posé / mire rendue), la
  contradiction du 17/08 rejouée en test et rendue impossible ; 13 tests, dette 141 ;
- TF-0315 (tests@45f1a7e) — état CONNEXION_ECHOUEE : motif = TENTÉ + ARRÊT, sans
  redemander LOGIN/PASSWORD ; non-régressions TF-0211/0222 tenues ; 14 tests ;
- TF-0316 (tests@26b6d96, étude 20260817c PASS 7/7) — « N session(s) exercée(s) » déclaré
  à chaque rapport, refus d'autorisation (401/403 ET redirections) en issue distincte
  HORS ratio, N sessions étiquetées avec un contexte par rôle et couverture par rôle ;
  28 tests, bout en bout /admin exercée sous admin et refusée sous lecteur ;
- vérifications rejouées par le pilot : dette 143/0 écart, pytest exit 0, commits et
  arbre sondés ; recette entière S-01 TENU 13/13, banc rouge 23/23, arbre stable (262
  fichiers empreintés) ;
- classement : 32 fichiers (12 lots) puis les 4 derniers — `old\` complet, B1-B3 PASS.

## Non traité — avec son motif

- les 10 candidats actifs — motif : tout entre en candidat, la décision est humaine ;
- le délai d'attente de mire en constante (10 s) non paramétrable — motif : un paramètre
  d'environnement est un contrat durable (R-31), hors de la lettre du lot ; écart déclaré
  par la campagne, réouverture si un cas réel l'exige ;
- INS-0001 — motif : inchangé, remis au produit digit-ai.fr.

## Écarts à la lettre

La campagne en a déclaré cinq, tous motivés au rapport ; les deux qui te concernent :
les refus d'autorisation restent des findings de sévérité inchangée (les basculer en
non_testables aurait relâché un verdict existant — G-2) et sortent SEULEMENT du ratio ;
le préfixe role: n'apparaît qu'à N ≥ 2 sessions (les identifiants mono-session et les
rapports antérieurs ne bougent pas, prouvé par test).

## Risques

- l'étiquette de rôle est déclarative : une session « admin » qui n'est pas admin produit
  une couverture faussement nommée ;
  - signal : une couverture par rôle incohérente avec les refus observés ;
  - parade : dette déclarée au registre (qualif-navigateur-007/008) et dite au rapport.
- les refus via page d'erreur maison (hors 401/403/redirection) restent fondus ;
  - signal : un produit à /erreur/403 sans refus détecté ; parade : TF-0317 ouvert.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — les trois pendantes (retrait de la page publiée en
  premier : c'est la seule fuite encore vivante), puis le sort des 10 candidats.
- Ensuite `auto_ia` — sur ton mandat : router TF-0304..0312 + TF-0317 (TF-0312 tôt).
- Enfin `manuelle_dev` — redéployer digit-ai.fr et clore INS-0001.

## Traces

- `output\03-etudes\20260817-etude-opportunite-couverture-par-role.md` (PASS 7/7) ;
- commits : pilot `94f01d4` (+ celui-ci) · tests `f6c5eb0`, `78179b4`, `45f1a7e`,
  `26b6d96` ;
- `todo\TODO.md` (10 actifs) · `todo\TODO-ARCHIVE.jsonl` (308) · `BOUCLE-AMELIORATION.md`
  (3e vague du 17/08) · `input\00-retours\old\` (14 lots, 36 fichiers) ;
- rapport d'agent (1) reçu en session, 6 émissions d'avancement relayées ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Traite tous les retours - 20260817a.md`.
