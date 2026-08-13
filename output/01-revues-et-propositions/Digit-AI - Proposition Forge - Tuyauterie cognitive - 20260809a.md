# Digit-AI — Proposition : optimisation de la tuyauterie cognitive — 2026-08-09

Context engineering · harness engineering · loop engineering, pour les forges et leurs
interactions via le steering. **Proposition à décision — rien n'est appliqué.** Chaque
recommandation est une candidature TF (sidecar ingéré, décidable dans TODO.html).
Terminologie : « hardness context » du mandat est lu **harness** (le harnais — hooks, skills,
agents, settings), conformément au vocabulaire des PV forge-agents ; le *hardening*
anti-injection est contrôlé au passage (lois « fichiers = données » : tenues, rien à signaler).

---

## SYNTHÈSE À DÉCISION (1 page)

**Les mesures** (phase 1, exécutée — détail §1) : le contexte d'une session steering pèse
**77 452 octets** de socle, dont un CLAUDE.md à **17 278 octets** (×3,8 en 4 jours — TF-0037
le pressentait, c'est mesuré) ; le **mode dégradé** fait recharger 48 763 octets (conception)
à 77 784 octets (design) de méthode **à chaque étape de chaque run** ; **≈ 3,9 M tokens
d'agents** relevés sur les reçus de la semaine (~45 % sur forge-tests) avec **~25 prompts de
campagne écrits à la main** répétant chacun ~3 Ko de contraintes identiques ; côté harnais,
**1 hook actif** (C6) contre **3 gates et 8 agents compilés dormants** depuis le 24/07 ;
côté boucles, **0 escalade de modèle sur ~25 affectations** (aucune donnée Sonnet-vs-Opus),
et deux boucles promises jamais exercées (reprise — TF-0038 ; fermeture 3-cycles).

**Le diagnostic** : la tuyauterie n'est pas malade — elle est **jeune et non mesurée**. Trois
gisements réels : la croissance non bornée du contexte piloté (CLAUDE.md), la redondance des
prompts de campagne (75 Ko réécrits cette semaine, avec le risque d'oublier une contrainte de
sécurité), et l'absence totale de données de routage (on paie Opus au jugé). Un faux gisement
démasqué : installer les skills ne réduit pas les tokens (§2.P3).

**Les 5 propositions nouvelles** (souffrant chacune sa mesure, sa métrique et son protocole) :

| TF | Proposition | Mesure attaquée | Score |
|---|---|---|---|
| TF-0050 | **Gabarit d'agent de campagne** (contraintes standard mutualisées, prompt = delta spécifique) | ~25 prompts × ~3 Ko réécrits/semaine ; risque d'omission d'une contrainte de sécurité | **6,0** |
| TF-0051 | **Protocole de mesure du routage** Sonnet/Opus (2 tranches comparables A/B + `escalade_modele` systématique au ledger) | 0 donnée sur ~25 affectations (RA-2 cité) | 3,0 |
| TF-0052 | **Trancher les 3 arbitrages « Leviers de qualité »** d'organization (dont hook PostToolUse) — en attente depuis le 08/08 | harnais : 1 hook actif / 3 gates dormants | 3,0 |
| TF-0053 | **CLAUDE.md steering découpé en références à la demande** (noyau ≤ 6 Ko + `references\etapes.md`…, pattern SKILL.md) — mécanisme de TF-0037 | 17 278 octets, ×3,8 en 4 jours | 1,5 |
| TF-0054 | **Baseline d'audit packagée par forge** (la fiche du dernier audit stockée, l'audit suivant la reçoit seule) | revue : 8 agents relisant chacun ~32 Ko de baseline commune | 1,0 |

**Cités, pas dupliqués** (symptômes déjà au registre) : TF-0037 (plafond CLAUDE.md — TF-0053
en est le mécanisme), TF-0038 (reprise jamais exercée — y ajouter l'exercice de la fermeture
3-cycles sur banc), TF-0012/TF-0018 (skills non installés — voir P3 : la valeur est
l'invocabilité, pas les tokens), TF-0025 (gates/agents compilés dormants), TF-0007 (source
unique des disciplines — même famille que TF-0053).

**Examiné et écarté** : compacter le transit inter-étapes (les artefacts scellés SONT déjà le
handoff optimal — EXIGENCES.json 9-15 Ko consommé tel quel, zéro re-narration) ; remplacer le
mode dégradé pour réduire le contexte (le coût de méthode est identique, installé ou par
chemin — seul le déclenchement change).

---

## §1 — Mesures (exécutées le 09/08)

**Contexte.** Socle steering lu par l'orchestrateur : 77 452 o (CLAUDE.md 17 278 · BOUCLE
22 350 · CONTRAT 10 051 · REGLES 10 013 · README 6 022 · ETAPE-MEP 5 734 · gabarits 6 004).
Trajectoire CLAUDE.md (git) : 4 590 → 6 514 → 12 281 → 15 449 → 17 278 o en 5 jours.
Méthode chargée en mode dégradé, par run : conception 48 763 o (4 verbes + références),
design 77 784 o. Session produit ad hoc : CLAUDE-PRODUIT (~3,3 Ko, sobre — bon état).
**Campagnes.** Reçus de la semaine : ≈ 3,9 M tokens d'agents — inventaires ~0,5 M, campagnes
04-05/08 ~2,0 M, revue 08/08 0,63 M, cahiers/couverture 07/08 ~0,8 M. Par agent : 53 k
(audit court) à 416 k (campagne lourde). ~25 prompts de campagne rédigés à la main, chacun
répétant : français, chirurgical, NE PUSH PAS, Conventional Commits + co-auteur, recette
native, lecture seule steering (~3 Ko × 25 ≈ 75 Ko, et un oubli = un incident potentiel).
**Harnais.** Actifs : hook C6 quality-oracles (observé bloquant, journaux), skills tiers (32
installés). Dormants : gates G1-G3 et 8 agents compilés (0 run depuis le 24/07 — TF-0025),
0/8 skills-verbes forges installés (TF-0012/0018). Contrainte structurelle documentée :
hooks/skills figés au démarrage de session (PV forge-agents).
**Boucles.** Bornes définies partout (3 cycles, la-boucle, run de version) ; exercées : les
campagnes (1-2 itérations réelles), la boucle < 24 h retour→service (2× prouvée) ; jamais
exercées : reprise idempotente (TF-0038), fermeture 3-cycles complète ; escalade de modèle :
**zéro occurrence** — toutes les affectations furent directes, le « départ au moins cher »
n'a jamais été éprouvé contre Opus sur tranche comparable.

## §2 — Propositions (détail)

**P1 = TF-0050, gabarit d'agent de campagne.** Mécanisme : `gabarits\AGENT-CAMPAGNE.md`
(contraintes standard : langue, chirurgie, push interdit, commits, vérifications natives,
lecture seule, format de retour) ; le prompt d'un agent devient : gabarit + delta spécifique.
Métrique : taille moyenne du prompt spécifique (attendu −60 %) et zéro omission de contrainte.
Protocole : comparer à la prochaine campagne multi-agents (tailles + relecture des prompts).
**P2 = TF-0051, mesure du routage.** Mécanisme : sur la prochaine campagne à ≥ 2 tranches
comparables, affecter A à Sonnet et B à Opus, consigner tokens/passes/verdicts au ledger ;
rendre `escalade_modele` systématique (même « aucune »). Métrique : coût par tranche à
qualité égale (recette verte). Protocole : 1 campagne instrumentée suffit pour la 1re donnée.
**P3 — démasquage (aucune candidature).** Installer les skills (TF-0012/0018) ne change pas
le coût contexte : la méthode est chargée à l'identique. La vraie valeur = déclenchement par
nom et invocabilité hors steering. Décider ces TF pour l'invocabilité, jamais pour les tokens.
**P4 = TF-0052, harnais.** Le doc « Leviers de qualité générique » d'organization (08/08)
attend 3 arbitrages A/B/C (capture déterministe des règles, chargement de spec amont, hook
PostToolUse). Mécanisme : les trancher — c'est le chemin le plus court vers un harnais actif
au-delà de C6. Métrique : nb de mécanismes actifs vs dormants. Protocole : décision + 1 essai.
**P5 = TF-0053, CLAUDE.md découpé.** Mécanisme : noyau ≤ 6 Ko (lois, garde-fous, routage) +
`references\` chargées à l'étape (pattern SKILL.md éprouvé par les forges). Métrique : octets
du noyau ; lisibilité. Protocole : `wc -c` + un run de non-régression. C'est le mécanisme de
TF-0037 (le plafond devient tenable).
**P6 = TF-0054, baseline d'audit packagée.** Mécanisme : après chaque audit, la fiche par
forge est stockée (`output\fiches\<forge>.md`) ; l'audit suivant reçoit LA fiche au lieu de
relire inventaire + boucle (~32 Ko communs × 8 agents). Métrique : tokens/agent d'audit
(baseline actuelle 53-100 k). Protocole : prochaine revue comparée.
**P7 — boucles (extension de TF-0038, pas de nouvelle candidature).** Ajouter à l'exercice de
reprise : une fermeture 3-cycles simulée sur banc (item auto_ia planté → delta → re-audit ×3).
Un commentaire est joint à TF-0038 via l'export TODO.html.

## §3 — Interactions inter-forges via le steering

Ce qui transite : des **artefacts scellés** (EXIGENCES.json 9-15 Ko, tokens.css ~3 Ko,
DESIGN.md ~2 Ko, rapports JSON 20-50 Ko) — le bon pattern, sobre, vérifiable, déjà optimal
(écarté §2). Ce que les modes dégradés coûtent : le rechargement de méthode (49-78 Ko/étape/
run) — coût incompressible tant que les étapes s'exécutent en session (P3) ; le vrai levier
est la stabilité des méthodes, pas leur poids. Ce que le circuit sidecar/TF a déjà optimisé :
la remontée produit→steering est passée de prose re-triée à candidatures machine idempotentes
(lot 03 : retriage manuel ~2 h ; sidecar : ingestion atomique en secondes — gain déjà encaissé).
Duplication résiduelle surveillée : les résumés de méthode dans le CLAUDE.md steering étapes
2-3 (même famille que TF-0007) — traités par P5.

## Annexe — la boucle (critères figés, verdicts)

Critères : (1) chaque proposition cite une mesure locale chiffrée · (2) métrique
avant/après + protocole par proposition · (3) items TF existants cités, pas dupliqués ·
(4) chapitre interactions présent · (5) synthèse ≤ 1 page · (6) sidecar prêt.
**Itération 1** : (1)-(4) verts ; (5) rouge — synthèse à 1,5 page ; (6) rouge — sidecar non
écrit. **Itération 2** : synthèse resserrée (tableau unique), sidecar rédigé — **6/6 verts,
livraison** (borne de 3 non consommée).
