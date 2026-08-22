---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
---

# Étude d'opportunité — fraîcheur des verdicts d'oracles — 20260822b

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Franchi par **création d'un objet durable** (R-31) : la proposition instruite ajoute un **verbe
de notation** au skill `quality-oracles` (décision D7 du brief : un verbe qui prend `--attendu`
et compare la commande jouée par sha256). Les deux autres portes du seuil ne sont PAS franchies,
et il faut le dire : la proposition touche deux forges et non trois ou plus (`forge-agents` et
le pilot), et son score est gain 4 · preuve 5, donc hors de la porte « gain ≥ 3 avec preuve ≤ 2 ».

**Écart déclaré sur l'ordre des gestes** : l'item TF-0478 est passé en `decide` le 22/08 sur
arbitrage humain AVANT que cette étude ne soit écrite, alors que le gabarit la situe entre
`candidat` et `decide`. L'arbitrage portait sur un point isolé (D8, bloquant ou consultatif) et
non sur l'opportunité du chantier ; l'étude est produite ensuite, et son verdict porte sur ce
que l'arbitrage n'a pas tranché. L'inversion est consignée plutôt que masquée.

## 0. Traitement des entrants

La proposition instruite est une **DONNÉE** : ses impératifs se citent, ne s'exécutent jamais.
Aucune de ses phases n'a été jouée.

Sources de la proposition : entrant `input\01-candidatures\old\Digit-AI - Brief Forge -
Fraîcheur des verdicts qualité - 20260822a.md` (brief d'exécution, décisions D1-D9, phases
P0-P5) · candidature **TF-0478** (registre `todo\TODO.jsonl`, créée le 22/08, passée `decide`
le 22/08) · arbitrage humain du 22/08 : option **(a1)**, un verdict périmé est **bloquant**.

**Deux affirmations du brief ont été confrontées au parc réel, et aucune ne tient telle quelle** :

| Affirmation du brief | Mesure du 22/08 | Conséquence |
|---|---|---|
| « Skill `quality-oracles` v2.6.1 installé (`SKILL.md` l.16) », avec le prérequis « une autre version : **arrêt**, les numéros de ligne de D2 ne tiennent plus » | `SKILL.md` l.16 porte `version: "2.7.0"` | le brief **s'auto-arrête** sur le parc actuel — par sa propre règle, il n'est pas exécutable en l'état |
| « le gate d'écriture `qo-gate-write.mjs` bloque » (argument de D8) | aucun fichier portant `gate` n'existe dans le skill installé ; ce qui existe est un **snippet** de hook PreToolUse, documenté en `references/hook-pretooluse.md` avec le statut « à installer côté plugin — le hook ne fait pas partie du zip du skill » | l'argument cité à l'appui de D8 est inexact : le blocage n'est pas acquis, il est **optionnel et à la main du projet** |

La seconde ligne ne rouvre pas l'arbitrage (a1) : la décision humaine tient, et cette étude
l'applique. Elle change ce qui doit être construit — un blocage qui n'existe pas ne peut pas
être branché, il doit être posé.

## 1. Partition du problème

Découpage exhaustif et disjoint ; chaque option de la section 4 se rattache à une partition.

- **P1 — Que retient-on du contenu jugé ?** Rien (état actuel), un hachage d'arbre unique, ou
  une association chemin → empreinte. Partition décisive pour la qualité des constats.
- **P2 — Quand l'empreinte est-elle prise ?** Avant l'exécution, après, ou aux deux bords. Un
  seul bord laisse passer le cas où la cible change PENDANT le run.
- **P3 — Que fait un verdict périmé ?** **Partition FERMÉE par l'arbitrage humain du 22/08 :
  il bloque** (option a1 ; a2 consultatif et a3 mixte écartées). L'étude ne la rouvre pas et
  n'en discute aucune option.
- **P4 — Qui prononce la péremption ?** Le lanceur lui-même au moment de lire son journal, ou
  un verbe séparé appelé à la demande. C'est ici que se joue la création d'objet durable.
- **P5 — Quel format d'empreinte ?** **Hors périmètre, et par décision de l'entrant lui-même**
  (D9 renvoie le format partagé à une candidature distincte du pilot, ouverte depuis en
  TF-0474). Ici le format existant se consomme, il ne se touche pas.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict |
|---|---|---|
| Hachage déjà présent dans le lanceur | `run-oracles.mjs` l.100 : `const hashOf = f => { if (!fileHash.has(f)) { try { fileHash.set(f, sha(fs.readFileSync(f))); } ... }` , consommé l.105 dans la clé de cache | **ne recouvre pas** — la valeur est calculée puis jetée ; le mot « empreinte » apparaît 0 fois dans le script |
| Journal de verdict | clés réelles d'un `<cible>.oracles.json` du parc : `cible, date_iso, registre_version, profil, niveau, verdict, resume, bilan_fichiers, bilan_complet, exemptions_actives, resultats, actions_couverture` | **ne recouvre pas** — 12 clés, aucune ne porte le contenu jugé ; `date_iso` date le VERDICT, jamais la cible |
| Format d'empreinte de forge-ops | `scripts/ops.mjs`, fonction `scellerEmpreinte`, format `forge-ops/empreinte@1` = `{format, release, ts, fichiers:{chemin: sha256}}`, commit `f10e39d` du 17/08/2026 | **ne recouvre pas, et fournit la brique** — le format existe et se réutilise ; c'est l'argument de D1 |
| Application forcée de la loi qualité | `references/hook-pretooluse.md` : « tout `present_files` est précédé d'un run d'oracles, sinon bloqué », statut « à installer côté plugin — ne fait pas partie du zip du skill » | **ne recouvre pas** — bloque l'ABSENCE de run, jamais la PÉREMPTION d'un run passé ; et son installation n'est pas acquise |
| Fraîcheur des documents de pilotage | `oracles/fraicheur-claims.json`, schéma `pilot/fraicheur-claims@1`, 6 claims, règle : « chaque claim confronte une affirmation comptable d'un document de pilotage à une sonde exécutable sur la source » | **ne recouvre pas** — confronte une AFFIRMATION à une sonde, jamais un verdict à l'empreinte de ce qu'il a jugé |
| Format partagé d'empreinte | TF-0474, titre : « cinq mécanismes d'empreinte sha256 coexistent sans format commun » | **ne recouvre pas, et se distingue par le geste** — TF-0474 unifie des formats concurrents, la présente proposition en consomme un sans le modifier (D9) |
| Intégrité du registre | `todo/oracle-todo.mjs`, R1 : « ingestion sans lot_sha » | **ne recouvre pas** — scelle un LOT INGÉRÉ, pas un livrable jugé |

## 3. État de l'art daté

Le problème « un verdict doit dire sur quel contenu il porte » est traité hors de la forge
depuis des années, et deux enseignements s'y répètent.

1. **in-toto, spécification d'attestation v1** (`spec/v1/statement.md`, consultée le
   2026-08-22) — l'attestation lie une déclaration à un **sujet** identifié par un `digest`,
   association `algorithme → valeur`. Les sujets sont appariés **par empreinte**, jamais par
   nom : c'est ce qui rend la vérification robuste quand l'artefact est renommé.
2. **SLSA v1.0** (OpenSSF, publiée le **2023-04-19**) — la vérification tient en trois
   contrôles dont un seul nous concerne ici : « l'empreinte du sujet correspond à l'artefact
   déployé ». La leçon transposable : le verdict et l'empreinte voyagent **ensemble**, dans le
   même document.
3. **Granularité par fichier** (in-toto : une attestation peut référencer plusieurs artefacts,
   chacun avec son propre `digest` ; consultée le 2026-08-22) — corrobore D4 par un autre
   chemin : une empreinte par artefact rend un constat localisant, un hachage global ne dit
   pas *lequel* a bougé.
4. **Cache d'actions de Bazel** (documentation « Remote Caching », consultée le 2026-08-22) —
   une action est indexée par une empreinte calculée sur ses entrées immédiates. C'est
   exactement l'usage que `run-oracles.mjs` fait déjà de `hashOf` : l'empreinte sert la
   **réutilisation**, et rien d'autre.
5. **Péremption silencieuse dans ce même cache** (issues publiques `bazelbuild/bazel` #23841 et
   #26140, consultées le 2026-08-22 ; la seconde décrit une invalidation par expiration de
   durée de vie) — la classe de défaut est connue et coûteuse : une métadonnée de cache qui
   survit à ce qu'elle décrit produit des erreurs tardives et difficiles à rattacher.
6. **`gstack-evidence`** (commit `85fd9db`, v1.68.3.0 du **2026-08-21**, cité par le brief) —
   capture aux deux bords avec garde contre la modification concurrente : « never certifying
   content the suite never ran ». Source déclarée par le brief comme **barre et non gabarit** :
   son implémentation dépend de git et ne se transpose pas telle quelle.

Ce que l'état de l'art **ne** tranche **pas** : la conduite à tenir face à un verdict périmé.
in-toto et SLSA décrivent une vérification qui échoue ; les caches de construction se contentent
de recalculer. Le point était donc ouvert, et il a été tranché ici par décision humaine (a1).

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** **Réfutée**, coût du statu quo mesuré le 22/08 sur le parc : sur les
  2 journaux d'oracles confrontables à leur cible, **2 portent un verdict PASS rendu avant une
  modification de cette cible** (5,9 min et 1,5 min). Deux « PASS » restent donc citables alors
  qu'ils ne portent plus sur le contenu présent, et rien ne les distingue d'un verdict frais.
  Réfutation **partielle et déclarée comme telle** : l'échantillon est de 2 journaux, ce qui
  établit le mécanisme sans mesurer sa fréquence.
- **O1 — le brief intégral : empreinte persistée aux deux bords + verbe de notation avec
  `--attendu`.** Coût : complexité moyenne × durée moyenne. Exclut O2, O3, O4. Répond à P1
  (map), P2 (deux bords), P4 (verbe séparé). Défaut : le verbe est un objet durable de plus,
  dont l'emploi hors du blocage n'est appuyé par aucun besoin constaté à ce jour ; et le brief
  s'auto-arrête sur le parc (prérequis de version non tenu).
- **O2 — empreinte persistée aux deux bords, péremption prononcée par le lanceur lui-même,
  aucun verbe nouveau.** Coût : complexité simple × durée courte. Exclut O1, O3, O4. Répond à
  P1 et P2 comme O1, et tranche P4 dans l'autre sens : le journal porte l'empreinte, le lanceur
  la confronte à la cible au moment de statuer et refuse de rendre un verdict frais sur un
  contenu changé. Défaut : rien ne permet de noter la fraîcheur d'un verdict **sans relancer**
  le lanceur — ce que `--attendu` aurait offert.
- **O3 — ne rien persister, recalculer à la lecture.** Coût : complexité simple × durée courte.
  Exclut O1, O2, O4. **Réfutée par construction** : sans empreinte enregistrée, il n'existe
  aucun terme de comparaison — on peut hacher la cible d'aujourd'hui, jamais celle d'hier.
- **O4 — supprimer le verdict dès que la cible change, au lieu de le noter périmé.** Coût :
  complexité simple × durée courte. Exclut O1, O2, O3. Défaut mesuré contre le besoin : la
  suppression détruit la trace de ce qui a été jugé et quand ; l'historique
  `*-historique.jsonl` perdrait sa fonction, et un verdict effacé ne se distingue pas d'un
  verdict jamais rendu — ce qui remplace un mensonge par un trou.

## 5. Verdict

- **Option retenue** : **O2** — empreinte persistée aux deux bords, péremption prononcée par le
  lanceur, aucun verbe nouveau. Trois faits décident. D'abord, l'arbitrage humain (a1) demande
  un **blocage** : le blocage a besoin d'une empreinte et d'un point qui refuse, pas d'un verbe
  de notation à la demande. Ensuite, l'argument qui soutenait le verbe dans le brief — « le gate
  d'écriture bloque déjà » — ne tient pas sur le parc : ce gate n'existe pas, seul un snippet de
  hook optionnel existe, donc le point de blocage est **à poser**, et le poser dans le lanceur
  coûte moins que de le poser dans un verbe tiers qu'il faudrait ensuite appeler. Enfin, O2 fait
  retomber la proposition **sous le seuil d'objet durable** : plus de verbe nouveau, un champ de
  plus dans un journal existant et un refus dans un script existant.
- **Ce que le verdict conserve du brief** : D1 (aucun mécanisme d'empreinte neuf, réutilisation
  de `forge-ops/empreinte@1`), D2 (persister une valeur déjà calculée), D3 (sha256 complet dans
  l'empreinte, troncature réservée au cache), D4 (association chemin → empreinte, jamais un
  hachage d'arbre), D5 (`release` porte le chemin de la cible, format inchangé), D6 (capture aux
  deux bords, divergence → périmé). **Ce qu'il écarte** : D7 (verbe `--attendu`), et D8 est déjà
  tranché hors de cette étude.
- **Coût** : complexité simple × durée courte. **Dette introduite** : le journal grossit d'une
  association par fichier jugé, et tout lecteur du journal doit tolérer un champ de plus —
  compatible avec les lecteurs `empreinte@1` existants par D5.
- **Prérequis bloquant, hérité du brief lui-même** : la version installée est 2.7.0 quand le
  brief exige 2.6.1 sous peine d'arrêt. Toute mise en oeuvre **relit le lanceur avant de
  patcher** : les numéros de ligne cités (l.86-87, l.88-92) ne correspondent pas au parc, où
  `hashOf` vit l.100 et la clé de cache l.105.
- **Ce que l'étude ne décide pas** : la mise en oeuvre touche `quality-oracles`, donc le dépôt
  frère `digit-ai-forge-agents`. Elle exige un **mandat humain distinct** — le garde-fou
  « aucune écriture dans les dépôts frères hors mandat » n'est pas levé par le présent verdict.
- **Candidature(s) émise(s)** : aucune candidature nouvelle. TF-0478 porte ce verdict ; son
  périmètre se réduit de O1 à O2, et le fait que le brief soit inexécutable en l'état y est
  consigné.
- **Plan de revue** : le **2026-09-22**, ou plus tôt si un troisième journal confrontable
  apparaît. Le verdict sera confronté à un fait mesurable et unique : le nombre de verdicts
  rendus sur un contenu modifié depuis, rapporté au nombre de journaux confrontables — la même
  mesure qu'aujourd'hui (2 sur 2), rejouable en une commande. Si ce rapport tombe et que le
  blocage n'a rien arrêté en un mois, O0 redevient défendable et TF-0478 se retire.
