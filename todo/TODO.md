# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=f0aaef783a71 archive=cdda120396ac · dernier événement: 2026-08-17T08:42:34Z -->

**8 actifs** (candidat 0 · décidé 0 · en cours 8 · corrigé 0 · écarté 0) · **296 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0296 | en_cours | 8 | forge-agents : 13 sidecars d'oracles COMMITTÉS dans .claude/skills — la convention TF-0065 les veut hors dépôt | **oui** — le bruit versionné a masqué le défaut TF-0289 pendant deux jours : K2 vert à tort, le contrôle disait l'inverse du réel |

## digit-ai-forge-ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0298 | en_cours | 6 | forge-ops : canary ne scelle pas d'empreinte — une cible promue par canary reste SKIP permanent sur O-7 | **oui** — un SKIP permanent sur la voie canary est un trou déclaré aujourd'hui, silencieux le jour où canary devient la voie courante |

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0302 | en_cours | 9 | pilot : interdire la publication d un livrable de produit sur un service heberge externe (regle de doctrine absente du socle) | **oui** — livrable d audit contenant deux ecarts de securite non corriges publie hors du poste avant validation humaine ; aucun moyen outille de le retirer |
| TF-0303 | en_cours | 4.5 | pilot : mecaniser l autoportance d un HTML livre — le chemin de publication hebergee produit un fichier sans doctype, charset ni viewport (A1/A3/A4 et R-30 en defaut) | **oui** — livrable reecrit apres coup (head complet, palette sombre basculee de prefers-color-scheme vers data-theme, bascule et bloc impression ajoutes) ; 4 regles ecrites du socle violees sans qu aucun controle ne le signale |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0299 | en_cours | 6 | forge-tests : la recette ne DIT pas que le conteneur est la cause — 10 [MANQUE] indiscernables d'une régression | **oui** — ~5 minutes de diagnostic consommées en pleine campagne, et sans agent vigilant un faux « S-01 NON TENU » de plus |
| TF-0300 | en_cours | 3 | forge-tests : entrée de corpus H-20 prouvant la branche FAIL de l'écart servi ↔ versionné en recette | **oui** — un contrôle dont la recette ne prouve que les branches vertes repose sur pytest seul pour sa branche accusatrice — exactement l'écart que TF-0293 vient de fermer pour le pan i18n |
| TF-0301 | en_cours | 3 | forge-tests : un test du pan i18n passe trivialement — l'assertion ne discrimine rien sur un banc sans finding | **oui** — un test vert qui ne discrimine rien vaut un contrôle jamais joué (R-35) : il rassure sans prouver |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0297 | en_cours | 6 | oracle-skills : K6 juge l'INTÉGRITÉ d'un hook, pas son CÂBLAGE — un hook sain jamais référencé ne s'exécute jamais | **oui** — le gate le plus joué de l'écosystème ne bloque plus rien depuis une date inconnue, et seul un agent parti vérifier autre chose l'a vu |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
