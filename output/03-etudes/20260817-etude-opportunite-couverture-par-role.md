# Étude d'opportunité — couverture par rôle du pan qualif (TF-0316) — 20260817c

## Seuil de déclenchement (vérifié)

Le niveau (2) de TF-0316 **crée un contrat de configuration durable** (liste de sessions
étiquetées par rôle — R-31) ; le lot demandeur le déclare lui-même justiciable de
TF-0155. Étude obligatoire avant `decide`.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : lot `Produit-01 - RETOURS - 20260817b` (TF-0316, ledger Produit-01 seq 34) ;
contexte : lot `Produit-11 - RETOURS - 20260817a` (TF-0313..0315, même pan).

## 1. Partition du problème

- **P-a Dire** : le rapport affirme « 8/8 ratio 1,00 zéro finding » sans dire qu'UNE seule
  identité a parcouru — trois surfaces réservées par rôle jamais visitées, lu « tout est
  couvert » pendant 5 jours.
- **P-b Distinguer** : une route répondant 401/403/redirection d'autorisation à cette
  identité est indistinguable, dans le ratio, d'une route saine.
- **P-c Mesurer** : parcourir sous chaque rôle fourni et rendre une couverture par rôle.
- **P-d Non-destructivité** : lire plus de surfaces, jamais agir — le contrat du pan
  (aucun clic émis) ne bouge pas.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `FORGE_TESTS_QUALIF_STORAGE_STATE` | `qualif.py` l.270-282 (cité au lot) : « un chemin unique […] un seul contexte navigateur » | recouvre l'injection d'UNE session ; le pluriel n'existe pas — trou exact de P-c |
| `provenance_session()` (TF-0222 étendu) | `qualif.py` l.216-254 : déclare la NATURE de la session (anonyme / fournie / mire) | recouvre le QUI d'une session ; ne dit rien du COMBIEN ni de ce que chaque rôle n'a pas vu |
| Garde RT-16/TF-0211 | citée au lot : « le pan n'a rien imputé à tort au produit » | recouvre la non-imputation ; le lot le confirme (« CE N'EST PAS un faux négatif ») — le défaut est un silence, pas une accusation |
| TF-0313..0315 (même vague, même pan) | mire SPA attendue, provenance CONSTATÉE, état CONNEXION_ECHOUEE | recouvrent l'ouverture et la vérité d'UNE session ; aucun ne parle de rôles multiples |
| `couverture_surface_i18n` (TF-0284) | seuils forge-tests : « routes servies dans chaque locale » | même geste (parité par dimension) appliqué à la LOCALE ; la dimension rôle n'existe nulle part |
| `forge-websec` (ASVS, R-33) | `REGLES-PROJET.md` §M : exigences opposées à la conception, méthode à l'étape tests | recouvre l'EXIGENCE d'autorisation ; pas le parcours mesuré d'une instance servie par rôle — websec ne parcourt pas, qualif parcourt |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; le besoin est
défini par un verdict réel mal lu (ledger Produit-01 seq 28 du 12/08, écart découvert le
17/08 par une question humaine) et l'existant cité en section 2 a été vérifié sur pièces.
La revue datée (section 5) confrontera le contrat au premier produit multi-rôles audité.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité (TF-0316) : « verdict lu comme
  une couverture complète alors que 3 surfaces réservées n'avaient jamais été visitées ;
  écart découvert 5 jours plus tard par une question humaine, non par l'outil ».
- **O1 — déclarer seulement (niveau 1)** : « 1 session exercée : les routes refusées ou
  invisibles à cette identité ne sont pas jugées » + les 401/403/redirections en issue
  DISTINCTE du succès. Coût ½ j. Exclut la mesure : le rapport devient honnête, la
  couverture par rôle reste inconnue.
- **O2 — mesurer seulement (niveau 2)** : `FORGE_TESTS_QUALIF_STORAGE_STATES`
  (liste rôle=chemin), un contexte navigateur par session, parcours rejoué par profil,
  couverture par rôle au rapport. Coût 1 j. Exclut l'honnêteté du cas mono-session :
  un produit qui ne fournit qu'un rôle garderait son ratio muet.
- **O3 — les deux niveaux, la déclaration d'abord** : O1 puis O2 dans la même campagne —
  la déclaration reste vraie quel que soit N (chaque session déclare ce qu'elle n'a pas
  vu ; N=1 est le cas dégradé déclaré, pas un cas à part). Coût 1-1,5 j, un seul dépôt.
  Exclut tout nouveau verbe : c'est le pan qualif qui grandit, pas une surface neuve.
- **O4 — porter la dimension rôle chez forge-websec** : rejetée — websec oppose des
  exigences et scanne sur mandat, il ne parcourt pas d'instance servie ; dupliquer le
  parcours créerait deux lecteurs de la même chose (la maladie que TF-0288 a évitée).

## 5. Verdict

- **Option retenue : O3** — déclarer d'abord (le silence de P-a est le défaut payé),
  mesurer ensuite dans la même campagne ; la non-destructivité inchangée (P-d).
- **Coût** : 1-1,5 j sur forge-tests seul ; dette assumée : l'étiquette de rôle est
  déclarative (l'outil ne vérifie pas qu'une session « admin » EST admin — il constate
  ce qu'elle voit ; une étiquette fausse produit une couverture faussement nommée, dit
  au non_juge).
- **Candidature(s) émise(s)** : aucune nouvelle — TF-0316 existe ; décision : mandat
  global du 17/08 (« traite tous les retours »), cette étude au dossier.
- **Plan de revue : 2026-09-15** — un produit multi-rôles a-t-il été audité avec N ≥ 2
  sessions, et le cas N=1 déclare-t-il son périmètre sur un rapport réel ?
