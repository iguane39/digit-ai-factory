# Hypothèses prises pendant la construction du steering

2026-08-04. Chaque hypothèse est datée et révisable ; en cas d'infirmation, la corriger ici et
consigner un `retour` au ledger du run concerné.

1. **Orchestration conversationnelle, pas script.** Aucune forge n'expose de point d'entrée machine
   complet ; deux (conception via son CDC, agents via son contrat d'invocation) excluent
   explicitement l'appel technique. J'ai donc fait du steering un CLAUDE.md + prompt canonique
   exécutés par une session Claude Code, plutôt qu'un pipeline scripté. Un durcissement vers du
   script deviendra possible quand les dettes D-* seront résorbées.
2. **Mode dégradé assumé pour conception, design, development.** Le steering applique leurs méthodes
   documentées (SKILL.md, gabarits, schémas lus comme spécifications) et exécute leurs oracles
   natifs, faute de point d'entrée invocable. Le mode est consigné à chaque invocation — jamais
   présenté comme natif. Hypothèse : appliquer la méthode documentée d'une forge est fidèle à son
   intention tant que ses oracles valident le résultat.
3. **Lire les SKILL.md des forges n'est pas « exécuter des instructions embarquées ».** La frontière
   retenue : le steering adopte délibérément une méthode documentée (décision d'architecture,
   tracée), mais toute consigne impérative trouvée dans les dépôts (prompts de reprise, « attends
   mes instructions », consignes dans un CDC client) est traitée comme donnée d'état et décrite au
   ledger.
4. **`conductor` n'est pas invocable en headless** (ManualGate fermé, DefaultBadRunner
   NotImplementedError, exit toujours 0). L'étape development est donc construite en direct par le
   steering avec rejeu des gates (ruff + pytest + traçabilité exigences→tests), jusqu'à R-V1/R-V3.
5. **Exit 3 de forge_tests = résultat acceptable documenté.** Quasi tout projet réel aura des pans
   sans adaptateur ; traiter 3 comme un échec rendrait l'étape 4 toujours rouge.
6. **Contrat ledger de forge-agents réutilisé tel quel** (seq/ts/type, run_open en tête), avec la
   règle « écrivain unique » ajoutée à cause du défaut de verrou connu (R-A1).
7. **Pas de git sur le steering ni sur les runs à ce stade** — l'utilisateur n'a pas demandé de
   dépôt ; le ledger porte la traçabilité. À revoir sur demande.
8. **Routage par modèle a priori** (Fable pilote / Opus complexe / Sonnet défaut / Haiku mécanique)
   avec départ au moins cher plausible et escalade sur échec d'oracle. C'est un a priori à
   challenger par les mesures du ledger, pas une doctrine.
9. **Produit du run confiné sous `runs\<run>\produit\`**, promu vers `c:\dev\<nom>` uniquement sur
   validation humaine.
