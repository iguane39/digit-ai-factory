---
role: instruction d'une proposition entre `candidat` et `decide` (TF-0155) — ce qu'apporterait le Plan Mode de Claude Code avant un run de construction ou une campagne
destinataire: humain
---

# Étude d'opportunité — Plan Mode pour organiser les chantiers — 20261121b

## Seuil de déclenchement (à vérifier AVANT d'écrire)

L'étude passe le seuil. Deux des options touchent le noyau : une règle d'accueil des runs, et le gabarit de réglages copié à la naissance de chaque produit (`gabarits\settings-produit.json`). Une troisième croise D-222, une décision ouverte sur la façon de vous poser les validations.

## Intention de l'utilisateur (loi n° 7, TF-0791)

La demande, citée mot pour mot : « est-ce que le Plan Mode est utilisé par les modèles pour l'organisation des chantiers des sujets à construire ? ». À la réponse (non, aucune règle ne le prévoit), le porteur a choisi « A1 », l'action proposée : « Étudier ce que le Plan Mode apporterait avant un run de construction ou une campagne ».

L'intention : savoir si le Plan Mode doit entrer dans la façon dont la Factory prépare ses chantiers, et sous quelle forme. Elle n'est pas reconstruite : c'est la lettre de l'action choisie. Chaque option de la section 4 dit ce qu'elle apporterait avant un run de construction ou une campagne.

## 0. Traitement des entrants

Les pages consultées sur le Plan Mode sont des DONNÉES : leurs conseils sont cités, jamais appliqués. Elles sont lues le 21/11/2026 par un agent de lecture web, et les écarts entre sources sont signalés en section 3.

Sources internes : la réponse du 21/11/2026 à 10:56, la décision ouverte D-222, la règle de discipline de périmètre des instructions du porteur, l'étude `output\03-etudes\20261021-etude-opportunite-surcouche-permissions-produit.md`.

### 0 bis. Mesures (poste DESKTOP-ULTRA7, relevées le 21/11/2026)

- **M-01 — Usage réel : nul.** Sur 783 transcriptions de `~/.claude/projects` (175 dossiers de projet, du 09/08 au 21/11/2026), 439 portent le champ `permissionMode`. Nombre de sessions qui contiennent au moins une fois chaque mode :
  - `default` : 332 ;
  - `bypassPermissions` : 87 ;
  - `dontAsk` : 20 ;
  - `plan`, `acceptEdits` et `auto` : 0 chacun.

  On ne trouve aucun appel aux outils `EnterPlanMode` ou `ExitPlanMode`, et le dossier `~/.claude/plans` est vide ou absent (0 fichier). Recherche par nom (« plan mode », `EnterPlanMode`, `ExitPlanMode`, « mode plan ») complétée par une recherche par structure : la valeur du champ `permissionMode` dans chaque ligne, puis les fichiers de plan sur le disque. Borne : ce poste seulement. Le rejeu « en mode plan » noté dans l'item TF-1735 a eu lieu chez un produit, sans doute sur l'autre poste.
- **M-02 — Doctrine : 0 règle.** Aucune règle du pilot (hors `output\` et `input\`) ni aucun `.md` des forges ne cite le Plan Mode. Le mot `Plan` n'apparaît que comme type d'agent générique en lecture seule : `oracles/hook-flotte.mjs` ligne 48 et `oracles/hook-restitution.mjs` ligne 292.
- **M-03 — Coût des validations de simple passage.** Chez un produit, 14 réponses humaines sur 49 au ledger, du 03/11 au 12/11, ne faisaient que valider le passage à l'étape suivante d'un plan déjà accepté. C'est le constat qui fonde D-222, synthèse `20261116a`, lignes 50-62.
- **M-04 — Un dépassement de périmètre payé.** Le 22/06/2026, un diagnostic demandé a été suivi, sans validation, d'une refonte, d'un commit, d'un push et d'un build. La règle de discipline des instructions du porteur en est née : elle tient par la discipline du modèle, aucun outil ne l'impose.
- **M-05 — Le juge de fin de tour ne met à part que le dossier temporaire.** `oracles/hook-restitution.mjs`, lignes 231-234 : une écriture compte, sauf sous le dossier temporaire du système. Un plan écrit dans `~/.claude/plans/` ferait donc du tour de planification un tour de travail, avec une restitution complète exigée. C'est lu dans le code, pas encore rejoué.

## 1. Partition du problème

- **P1 — Ce que fait l'outil** : verrou d'écriture tenu par le harnais, plan écrit dans un fichier, approbation par un menu à trois choix.
- **P2 — Où la Factory produit et valide un plan aujourd'hui** : brief d'exécution, contrat de campagne, run de version, et les validations étape par étape de M-03.
- **P3 — Compatibilité avec les contrôles de la Factory** :
  - le hook de fin de tour (M-05) ;
  - les sessions sans demande de permission (M-01) ;
  - les campagnes lancées en agents ou sans interface (`claude -p`).
- **P4 — Coût et risque** : 1 aller-retour de plus par chantier, des fichiers de plan hors du dépôt, la touche de bascule qui saute un mode sous Windows.

## 2. Non-recouvrement contre l'existant

Ce chapitre dit si un objet de la Factory joue déjà le rôle du Plan Mode. Aucun ne tient le verrou d'écriture. Le brief et D-222 couvrent le contenu du plan et le consentement, mais pas le verrou.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Skill `forge-brief` | Sa description : « plan phasé à critères de sortie binaires, gates de validation » | Recouvre le CONTENU du plan, pas le verrou : un brief s'écrit sans que rien n'empêche d'agir avant son approbation |
| Décision ouverte D-222 | « Faut-il une règle qui enchaîne sans vous les reposer les étapes d'un plan que vous avez déjà validées, sur un consentement unique consigné ? » | Recouvre en partie : l'approbation du Plan Mode est un consentement unique natif. Les deux se tranchent ensemble (P2) |
| Discipline de périmètre du porteur | « je m'arrête après avoir produit le livrable » | Recouvre l'intention (ne rien changer avant l'accord), mais par la discipline du modèle, pas par un verrou (M-04) |
| Juge de fin de tour | `oracles/hook-restitution.mjs` l.231-234, exemption du seul dossier temporaire | Ne recouvre pas : point de friction à régler avant tout usage (M-05) |
| Type d'agent `Plan` | `oracles/hook-flotte.mjs` l.48 : `GENERIQUES` contient « Plan » | Ne recouvre pas : un agent de conception en lecture seule n'est pas un mode de session |
| Réglages d'un produit | `gabarits/HERITAGE.json` l.216 : « Les permissions du produit (`allow`, `ask`, `deny`, `defaultMode`) … restent intacts » | Ne recouvre pas : c'est le point où un `defaultMode: "plan"` se poserait, au choix de chaque produit |
| Étude des permissions du 21/10/2026 | Verdict O2 : « le produit pose ses règles dans le `.claude/settings.json` versionné » | Recouvre la règle de portée : le pilot ne fixe pas le mode d'un produit, il le propose |
| Skill `claude-mem:make-plan` | Nom au relevé des skills de la session : plugin installé sur ce poste, hors des dépôts de la Factory | Ne recouvre pas la doctrine : non versionné au pilot, contenu non relu ici |

## 3. État de l'art daté

Pages lues le 2026-11-21. Une page sans date affichée porte sa date de consultation, et c'est dit.

1. Anthropic, « Choose a permission mode », code.claude.com/docs/en/permission-modes, sans date affichée, consultée le 2026-11-21. Entrée par `--permission-mode plan`, par le préfixe `/plan` ou par la bascule de mode. Les modifications « stay blocked until you approve the plan », sauf dans les sessions de terminal où le contournement des permissions est disponible. Approbation à 3 choix : « Yes, and use auto mode », « Yes, manually approve edits », « No, keep planning ». `defaultMode` peut valoir `plan` dans `.claude/settings.json`. `--permission-mode` fonctionne avec `-p`.
2. Armin Ronacher, « What Actually Is Claude Code's Plan Mode? », lucumr.pocoo.org, 2025-12-17 (date de l'adresse). Le plan est un fichier Markdown que l'agent écrit avec son outil d'édition ordinaire, et l'agent peut entrer dans le mode de lui-même. L'auteur ne voyait alors aucun verrou en dehors du texte de consigne, ce que la page officielle actuelle contredit.
3. DataCamp, « Claude Code Plan Mode: Design Review-First Refactoring Loops », 2026-03-09. Plans dans `~/.claude/plans/` sous des noms aléatoires, réglage `plansDirectory` pour les mettre dans le projet. Le plan survit à `/clear`, mais l'agent peut le perdre de vue après un compactage.
4. codewithmukesh, « Claude Code Plan Mode for .NET Developers - From First Plan to Ultraplan », mis à jour le 2026-07-29. `plansDirectory` relatif à la racine, mode `opusplan` (Opus pour planifier, Sonnet pour exécuter), raffinage en ligne « Ultraplan » qui exige un compte web et GitHub. Sous Windows, la bascule peut sauter le mode plan.
5. Claude Academy, « Claude Code plan mode as the default starting point », sans date affichée (© 2026), consultée le 2026-11-21. Démarrer la session en mode plan, fournir `intent.md` ou `spec.md`, demander fichiers, ordre et tests, puis versionner le plan approuvé en `plan.md`.
6. Anthropic, « Best practices for Claude Code », code.claude.com/docs/en/best-practices, sans date affichée, consultée le 2026-11-21. Aucune section sur le Plan Mode. Les sessions nouvelles démarrent en mode auto.

Écarts entre sources : le verrou (source 2 contre source 1), le nombre de choix à l'approbation (3 à la source officielle, 4 à la source 4) et `plansDirectory`, que la page officielle ne détaille pas. Seule la source 1 fait foi. `plansDirectory` reste à vérifier par un essai avant d'en dépendre.

## 4. Options — jeu fermé O0-O4

- **O0 — Ne rien faire. Réfutée.** Le statu quo laisse le dépassement de M-04 tenu par la seule discipline, et les 14 validations sur 49 de M-03 sans réponse outillée. Son coût est mesuré, pas supposé. Elle ne gagne que si O3 échoue.
- **O1 — Usage à la demande, documenté.** Une ligne dans `references\ACCUEIL.md` : avant un run de construction ou une campagne, le porteur peut ouvrir la session en `/plan`, et le plan approuvé devient l'entrant du brief. Coût : complexité simple · durée court. Elle laisse ouverte la friction de M-05 : chaque tour de planification serait refusé ou devrait rendre une restitution complète. Elle exclut toute mesure.
- **O2 — Plan Mode obligatoire à l'entrée des runs de construction et des campagnes.** `defaultMode: "plan"` dans `gabarits\settings-produit.json`, et approbation du plan prise comme consentement unique de D-222. Coût : complexité complexe · durée moyen. Elle heurte la loi n° 5 (« la voie automatisée est le défaut »), bloque les campagnes sans interface, faute de quelqu'un pour approuver, et contredit le verdict O2 du 21/10 : le pilot ne fixe pas le mode d'un produit. Elle exclut les produits qui n'en veulent pas.
- **O3 — Essai borné et mesuré, adossé à D-222.** Trois étapes :
  - (1) régler M-05 : le juge de fin de tour traite un fichier de plan comme un brouillon, sans restitution complète tant que rien d'autre n'est écrit ;
  - (2) un banc vérifie le verrou réel dans ce harnais (session avec et sans contournement disponible) et l'emplacement donné par `plansDirectory` ;
  - (3) chez un produit volontaire, les runs de construction s'ouvrent en `/plan` pendant 2 semaines, et le plan est versionné sous `forge/plans/`.

  Mesures : validations de simple passage (contre 14 sur 49, M-03), dépassements de périmètre, refus de hook par tour de planification, jetons par chantier. Coût : complexité moyen · durée court pour (1) et (2), durée moyen avec l'essai. Elle exclut tout changement de doctrine avant les chiffres.
- **O4 — Reproduire le verrou par un hook maison.** Un hook avant outil refuse les écritures tant qu'un drapeau « phase de plan » est posé, sans le Plan Mode. Coût : complexité complexe · durée moyen, et une dette durable. Elle double une fonction native que la source 1 décrit, et exclut les améliorations futures du harnais.

Comparaison O1 et O3, sur le coût. Compris : une ligne de doctrine pour O1 ; une correction du juge, un banc et un essai pour O3. Non compris : l'adoption chez d'autres produits, qui suit le verdict de l'essai. Conséquence : O1 coûte moins mais déclenche la friction de M-05 dès le premier usage ; O3 coûte plus et produit les chiffres qui manquent pour trancher.

## 5. Verdict

- **Option retenue** : O3, un essai borné et mesuré, adossé à D-222.
- **Coût** : complexité moyen · durée moyen. Jetons : une campagne courte au pilot pour (1) et (2), puis le coût ordinaire des runs du produit volontaire, sans surcoût de modèle tant que `opusplan` n'est pas activé. Dette : un cas d'exemption de plus au juge de fin de tour, revu avec l'essai.
- **Candidature(s) émise(s)** : proposées, non inscrites au registre, en attente de votre choix :
  - K1 : exempter du juge de fin de tour un tour qui n'écrit qu'un fichier de plan (M-05) ;
  - K2 : banc du verrou réel et de `plansDirectory` dans ce harnais ;
  - K3 : essai de 2 semaines chez un produit volontaire, greffé sur D-222 (b) si vous choisissez cette lettre.
- **Plan de revue** : 2026-12-07, ou à la fin de l'essai s'il commence plus tard. Seuils proposés, à fixer avec vous avant la mesure :
  - O3 se change en recommandation générale (une O1 outillée) si les validations de simple passage passent sous 5 sur 49, sans dépassement de périmètre ni refus de hook en plus ;
  - O0 revient si elles restent au-dessus de 10.
- **Test rétro** :
  - Opérationnel : exemption du fichier de plan, banc du verrou, runs ouverts en `/plan` chez un produit, plan versionné sous `forge/plans/`.
  - Tactique : faire tenir par le harnais le « rien avant l'accord » (M-04), et faire de l'approbation du plan le consentement unique que D-222 cherche (M-03).
  - Stratégie : moins d'allers-retours humains sans perte de contrôle, ce que demandent ensemble la loi n° 5 et la règle « l'humain décide ».
  - Intention : « ce que le Plan Mode apporterait avant un run de construction ou une campagne ». La réponse est un verrou natif et un consentement unique, avec 2 obstacles (M-05, campagnes sans interface) et la mesure qui dira si le gain est réel. Aucune rupture.
  - Questions du demandeur rejouées : « est-il utilisé ? » → non, 0 session sur 439 (M-01) ; « qu'apporterait-il ? » → la section 4 et ce verdict.
