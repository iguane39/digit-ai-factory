# Avancement des process longs — convention d'émission (TF-0094, décidée le 11/08/2026)

**Règle dure** : tout process dépassant ~2 minutes publie son avancement **toutes les
3 minutes** (au démarrage, à chaque fenêtre, à la fin) — un process long muet est en
défaut de contrat, au même titre qu'un adaptateur qui ne sait pas énumérer sa surface.
Origine : run forge_tests du 11/08 (mutation silencieuse, l'opérateur ne pouvait pas
décider d'abandonner) ; format arrêté par décision humaine du 11/08 sur le rapport réel.

## Double sortie

- **Pour l'humain** : le tableau ci-dessous, sur stderr (ou dans le fil de session).
- **Pour la machine** : une ligne JSON par émission, appendue à `<run>/avancement.jsonl`
  (survit à la session ; mêmes champs, en snake_case).

## Le tableau — huit champs, jamais un pourcentage seul

| Champ | Valeur |
|---|---|
| Heure de démarrage | 16:04 |
| Heure du reporting | 16:31 — émis toutes les 3 min |
| Réalisé | 58 modules |
| En cours | `app/services/identity.py` — **59ᵉ sur 70** · interne : mutants 120/280 (3/7 classes) |
| RAF | **11 modules** : `notification_templates`, `notifications`, `purge`, … |
| Temps restant estimé | ~14 min (cadence `services/` **mesurée** : 0,8 module/min) |
| Temps total prévu | ~45 min de mutation |
| Heure de fin prévue | ~16:49 *(glisse : 16:43-16:45 à l'émission précédente — dit, jamais tu)* |

Suivi d'une à deux phrases de **delta** : ce qui a changé depuis la dernière émission,
et l'interprétation quand elle éclaire (« le ralentissement est un signal, pas un
problème : un module dont les mutants survivent longtemps est un module que la suite
met du temps à contredire »).

## Les lois du format

1. **L'unité est déclarée par le process** (module muté, écran rendu, nœud scanné,
   fichier migré, image générée) — le noyau n'en connaît aucune. On **nomme**, on
   n'agrège pas : un « 43 % » sans unité courante ne diagnostique rien.
2. **Cadence MESURÉE, jamais devinée** : unités finies ÷ temps écoulé, recalculée à
   chaque émission — et par segment quand les unités changent de nature (la cadence
   `services/` n'est pas celle de `ports/`).
3. **Le glissement se dit** : si l'heure de fin prévue bouge, l'émission cite
   l'estimation précédente.
4. **Sous-découpe des unités lentes** : une unité qui occupe plus d'une fenêtre
   (> 3 min) se découpe en sous-unités nommées — étapes internes, fichiers, compteur
   mesurable (`mutants 120/280`) — l'avancement se montre À L'INTÉRIEUR de l'unité,
   sinon deux émissions identiques sont indistinguables d'un blocage.
5. **Jamais recopié** : chaque émission est recalculée depuis l'état réel (doctrine
   quality-oracles — recopier un rapport antérieur est le défaut, pas l'économie).

## Émetteurs prêts à l'emploi (pilot)

- Python : `scripts/avancement.py` — `Avancement(dossier_run, unite="module",
  raf=[...], intervalle_s=180)` puis `en_cours(nom, interne=None)`,
  `unite_finie(nom)`, `final()`. Émission automatique à fenêtre échue.
- Node : `scripts/avancement.mjs` — même contrat (`creerAvancement(...)`).

Les process des forges (mutation forge-tests, rendu design, scan seo, migrations,
MEP ops, génération d'images) consomment l'un des deux ou réimplémentent le contrat —
mais le contrat, jamais moins.
