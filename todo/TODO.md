# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=396b8154e34a archive=cdda120396ac · dernier événement: 2026-08-17T08:14:46Z -->

**6 actifs** (candidat 6 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **296 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0296 | candidat | 8 | forge-agents : 13 sidecars d'oracles COMMITTÉS dans .claude/skills — la convention TF-0065 les veut hors dépôt | **oui** — le bruit versionné a masqué le défaut TF-0289 pendant deux jours : K2 vert à tort, le contrôle disait l'inverse du réel |

## digit-ai-forge-ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0298 | candidat | 6 | forge-ops : canary ne scelle pas d'empreinte — une cible promue par canary reste SKIP permanent sur O-7 | **oui** — un SKIP permanent sur la voie canary est un trou déclaré aujourd'hui, silencieux le jour où canary devient la voie courante |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0299 | candidat | 6 | forge-tests : la recette ne DIT pas que le conteneur est la cause — 10 [MANQUE] indiscernables d'une régression | **oui** — ~5 minutes de diagnostic consommées en pleine campagne, et sans agent vigilant un faux « S-01 NON TENU » de plus |
| TF-0300 | candidat | 3 | forge-tests : entrée de corpus H-20 prouvant la branche FAIL de l'écart servi ↔ versionné en recette | **oui** — un contrôle dont la recette ne prouve que les branches vertes repose sur pytest seul pour sa branche accusatrice — exactement l'écart que TF-0293 vient de fermer pour le pan i18n |
| TF-0301 | candidat | 3 | forge-tests : un test du pan i18n passe trivialement — l'assertion ne discrimine rien sur un banc sans finding | **oui** — un test vert qui ne discrimine rien vaut un contrôle jamais joué (R-35) : il rassure sans prouver |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0297 | candidat | 6 | oracle-skills : K6 juge l'INTÉGRITÉ d'un hook, pas son CÂBLAGE — un hook sain jamais référencé ne s'exécute jamais | **oui** — le gate le plus joué de l'écosystème ne bloque plus rien depuis une date inconnue, et seul un agent parti vérifier autre chose l'a vu |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
