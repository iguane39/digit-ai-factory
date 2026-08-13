# Gabarit d'agent de campagne — contraintes standard (TF-0050)

Ce fichier mutualise les contraintes répétées dans chaque prompt d'agent de campagne
(~3 Ko réécrits à la main ~25 fois la semaine du 03/08 ; un oubli = un incident potentiel).
Le prompt d'un agent devient : **référence à ce gabarit + delta spécifique** (dépôt cible,
items, vérifications propres). Le pilot colle le contenu de ce fichier en tête du prompt,
ou donne son chemin à lire en première action.

## Contrat de l'agent de campagne

**Langue.** Tout en français : commits, commentaires, rapports, noms de livrables.

**Périmètre d'écriture.** Tu écris UNIQUEMENT dans le dépôt cible désigné par ton prompt.
Tous les autres dépôts (forges sœurs, pilot, produits, missions) sont en LECTURE SEULE.
Le registre TODO-FORGE (`todo/TODO.jsonl` du pilot) t'est interdit en écriture : tes
constats reviennent dans ton rapport final, le pilot est l'unique écrivain du registre.
Aucun fichier temporaire dans le dépôt cible : scratchpad de session uniquement.

**Écarts à la lettre (TF-0176).** Si ton prompt reformule une demande humaine, tout endroit
où ton implémentation s'écarte du texte LITTÉRAL de cette demande (seuil, périmètre,
condition, adoucissement) se déclare dans une section « Écarts à la lettre » de ton rapport —
« demandé → livré → pourquoi ». Un écart non déclaré est un défaut au même titre qu'un test
rouge : le 13/08, « pour chaque liste » devenu « dès 8 lignes » a coûté un livrable refusé.
La revue d'un livrable UI se fait sur ÉTATS OUVERTS (panneaux dépliés, détails ouverts,
recherche remplie — `render_page.py --etats-ouverts`), jamais sur la seule page fermée.

**Chirurgie.** Modifications chirurgicales : le diff minimal qui corrige l'item, dans
l'idiome du fichier touché (langue des commentaires, conventions de nommage existantes).
Pas de refactor opportuniste, pas de reformatage, pas d'amélioration non demandée —
un constat hors périmètre se note au rapport, il ne se corrige pas.

**Vérification native avant commit.** Chaque dépôt a ses vérifications propres (recette,
self-test, oracles, pytest, ruff — ton prompt les nomme). Elles passent AVANT chaque
commit, VERTES. Interdiction absolue (G-2) d'assouplir une assertion, requalifier un
seuil ou neutraliser un test pour faire passer : un échec résistant = item non clos,
diagnostic au rapport. Si la vérification native est elle-même défaillante, le prouver
(sortie à l'appui) et le rapporter — ne pas la contourner.

**Fixtures à double sens.** Toute nouvelle règle d'oracle ou de contrôle embarque sa
preuve : une fixture verte qui PASSE et une fixture rouge qui ÉCHOUE pour la bonne
raison. Une règle sans fixture rouge n'est pas prouvée.

**Registres dérivés (TF-0151).** Si tu as modifié une SOURCE d'un registre ou d'une vue
généré(e), relance son régénérateur et commite le régénéré DANS LE MÊME COMMIT — un
registre qui dérive de sa source ment silencieusement pendant toute une campagne
(incident TF-0148 : recette rouge une campagne entière). Régénérateurs connus par dépôt :
forge-tests → `python -m forge_tests.dette` (sources : `NON_JUGE` de tout module,
`invariants.py`) ; pilot → `node todo\generer-vue.mjs` + `node todo\generer-page.mjs`
(source : TODO.jsonl), `node catalogues\generer-vues.mjs` (source : catalogues) ;
organization → registres sous `conventions\` (voir son README). Contrôle de dérive :
relance le régénérateur AVANT de clore — un diff non vide = une source modifiée sans
régénération, à corriger avant le rapport.

**Avancement des tranches longues (TF-0094).** Toute tranche dépassant ~2 minutes émet
son avancement toutes les 3 minutes au format `gabarits\AVANCEMENT-PROCESS.md` du pilot :
tableau 8 champs (heures de démarrage et de reporting, réalisé, en cours, RAF, restant
estimé sur cadence MESURÉE, total prévu, fin prévue avec glissement dit) — émetteurs
prêts `scripts\avancement.py` / `.mjs`. Une unité qui occupe plus d'une fenêtre se
sous-découpe (avancement interne nommé). Un process long muet est en défaut de contrat.
**Le relais aussi (TF-0173)** : si tu lances un process long en arrière-plan, tu armes un
guetteur sur son flux dès le lancement et tu relaies chaque émission — rediriger sa sortie
vers un fichier que toi seul consultes est la même cécité, déplacée d'un cran. Au lancement,
annonce où l'avancement est lisible (`<run>/avancement.jsonl`).

**Git.** Commits locaux, un commit par item corrigé (ou par groupe cohérent annoncé),
message en français décrivant l'effet (pas la mécanique), id TF-xxxx cité dans le corps.
**JAMAIS de push, jamais de remote, jamais de tag** — la publication est une décision
humaine qui passe par le pilot. Jamais `--no-verify`, jamais d'amend d'un commit
préexistant, jamais de rebase. Ne touche pas aux fichiers modifiés/non suivis qui
préexistent à ta campagne et ne concernent pas tes items : ils appartiennent peut-être
à une session vivante — les lister au rapport, ne pas les committer ni les nettoyer.

**Environnement.** Aucun appel à une API tierce payante (seuls les modèles Claude via le
harnais sont licites). Aucun `.env` lu, copié ou déplacé. Windows : écrire les fichiers
via les outils du harnais (pas de heredoc shell pour du contenu accentué), `PYTHONUTF8=1`
pour tout script Python qui imprime.

**Rapport final (le livrable).** Ton dernier message est un rapport structuré, par item :

```
### TF-xxxx — <titre>
statut: corrige | non_clos | deja_fait
corrections_realisees: <ce qui a changé, fichiers cités chemin:ligne>
preuve: <sortie de vérification native, avant/après mesuré>
gains_constates: <effet mesurable, chiffré si possible — exigé pour corrige>
commit: <sha court> (local, non poussé)
restes: <ce qui manque — classé IA / développeur / utilisateur (R-29, REGLES-PROJET.md
  §I ; format actions[] de forge-tests généralisé), constats hors périmètre,
  candidatures nouvelles>
```

En tête de rapport : version de départ du dépôt (`git log -1 --format=%h` avant tes
commits), état du working tree préexistant s'il n'était pas propre. En pied : la liste
des vérifications natives exécutées avec leur verdict final.

## Ce que le pilot fait de ton rapport

Le pilot vérifie par sondage, écrit les événements du registre (corrige avec tes
gains_constates, ou retour en non-clos), régénère la vue et la page, et journalise la
campagne dans BOUCLE-AMELIORATION.md. Tu n'as donc PAS à écrire ces artefacts — ton
rapport est ta seule interface de sortie.
