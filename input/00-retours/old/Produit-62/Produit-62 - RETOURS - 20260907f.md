# Retours forges — Produit-62 — 20260907f

- **Contexte** : sixième retour humain de la journée sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset`. La synthèse du tour précédent posait à l'humain une décision D-4 (« que faire de la version j de la page HTML, remplacée par la version m ? ») avec deux options, garder ou supprimer. L'humain a répondu par une question : « que dit la factory et pourquoi ça n'a pas été appliqué ? ». La factory répond déjà : règle 7 de `REGLES-PROJET.md` (section C), « quand un livrable documentaire est remplacé par une version plus récente, l'ancien migre dans `old\` du même dossier », conflit C1 tranché le 13/08 (TF-0150, `old\` versionné). La décision n'aurait pas dû être posée ; l'option juste n'était pas dans la liste.
- **Références ledger** : `forge\ledger.jsonl` seq 26 (question humaine, causes), seq 27 (rangement en `output\old\`, conformité rejouée), seq 28 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-07

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## pilot (`digit-ai-factory`)

Le rangement est fait (`git mv` de la version j vers `output\old\`, `oracle-conformite-projet` rejoué : R-4, R-6, R-7, R-25, R-32 PASS, journal `forge\oracles\2026-09-07o-oracle-conformite-projet.txt`). Le fait à remonter est double : une règle écrite depuis le 13/08 n'a pas été rencontrée par le producteur sur la voie de mandat, et la restitution a pu poser à l'humain une décision que la doctrine tranchait, en passant l'oracle de synthèse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-6 | majeur | générique | **La règle 7 (livrable remplacé → `old\`) n'est ni citée sur la voie de mandat, ni jouée par un oracle, ni vue par S16 quand la restitution pose la question à l'humain.** (1) `references\RUN-MANDAT.md` : `grep -i "old\|remplac"` ne rend rien ; la règle vit dans `REGLES-PROJET.md` ligne 72 (tableau C), dans `gabarits\CLAUDE-PRODUIT.md` ligne 75 (CLAUDE.md produit non installé ici : socle absent, écart R-35 déclaré au ledger seq 5) et dans `references\ETAPES-RUN.md` ligne 128 (voie de construction). Le producteur a lu la règle 5 parce qu'elle est câblée dans `scripts\allouer-indice.mjs` (commentaire de tête), et s'est arrêté là. (2) `oracles\oracle-conformite-projet.mjs` lignes 384-392 : R-7 ne juge que le `.gitignore` d'un `old\` déjà existant ; deux versions du même radical (`… - 20260907j.html` et `… - 20260907m.html`) cohabitant dans `output\` passent R-4 (« indices uniques par jour et par dossier ») et ne déclenchent rien — journal `forge\oracles\2026-09-07m-oracle-conformite-projet.txt`, verdict PASS sur R-4/R-25/R-32 avec les deux fichiers présents. (3) `oracles\oracle-synthese.mjs` S16 : la synthèse `output\Client-A - Note Synthese Entete Tableau Tenancy Schedule Asset - 20260907n.md` bloc 3 posait D-4 avec options (a) garder / (b) supprimer, recommandation (a), source citée (journal R-32) ; verdict PASS (`forge\oracles\2026-09-07n-oracle-synthese.json`). S16 vérifie qu'une source est nommée, pas que la doctrine du pilot a été consultée ; son propre texte dit pourtant « une question dont la réponse est dans un document déjà fourni ne se pose pas : elle se répond ». Même cause racine que RF-2 et RF-5 : une règle qui n'est pas jouée chez le producteur n'existe pas pour lui — quatrième objet en une journée. | (1) `RUN-MANDAT.md` pas 5 et `RUN-CONSEIL.md` C5 : une ligne « version remplacée → `git mv` vers `old\` du même dossier (règle 7, C1) », à côté de la forme R-4 déjà demandée par RF-5. (2) `oracle-conformite-projet` : R-7 bis — deux livrables de même radical (`<Marque> - <Objet> - AAAAMMJJ`) et d'indices différents dans un même dossier hors `old\` = constat « version remplacée non rangée » ; contrôle purement lexical, jouable sans socle. (3) `oracle-synthese` S16 : quand une décision du bloc 3 contient un mot-clé d'un objet régi par `REGLES-PROJET.md` (version, indice, `old\`, nommage, `.env`, commit, push, publication), exiger que la source citée soit `REGLES-PROJET.md` ou déclarer « la doctrine du pilot ne répond pas » — sinon constat « décision déjà tranchée par la doctrine ». |
| RF-7 | mineur | générique | **Deux textes normatifs sont en retard sur la décision C1 du 13/08.** `references\ETAPES-RUN.md` ligne 128 : « un livrable remplacé migre dans `Old\` (jamais versionné) » — graphie `Old\` majuscule et « jamais versionné », contraires à D-15 (minuscule) et à TF-0150 (versionné). `REGLES-PROJET.md` ligne 72, colonne Recommandation de la règle 7 : « option (conflit C1) », alors que la section « Conflits à trancher » du même fichier (ligne 746) écrit « C1 — TRANCHÉ le 13/08 (TF-0150) ». Un lecteur qui tombe sur la ligne 72 lit une règle optionnelle ; s'il tombe sur la ligne 128, il lit l'inverse de l'oracle R-7 (qui refuse désormais un `old\` gitignoré). Mesure : `grep -n "jamais versionné" references\ETAPES-RUN.md` rend la ligne 128 ; `grep -n "option (conflit C1)" REGLES-PROJET.md` rend la ligne 72. | Aligner les deux lignes sur C1 tranché : ligne 128 → « migre dans `old\` du même dossier (versionné, C1/TF-0150) » ; ligne 72 → recommandation « **défaut** (C1 tranché 13/08) ». Candidat pour un contrôle de non-répétition : une décision consignée « tranchée » dans `REGLES-PROJET.md` dont le libellé antérieur subsiste ailleurs dans `references\` = constat (`REGLES-DE-NON-REPETITION.md`). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Version j de la page HTML rangée dans `output\old\` (règle 7), version m seule dans `output\` | `git mv`, ledger seq 27, conformité rejouée (R-7 PASS « old\ présent et versionné ») | oui | remontée ci-dessus (RF-6) |
| Le journal R-32 de la version j reste sous `forge\oracles\` sous son nom d'origine | conservé : pièce de preuve datée, R-32 juge par nom de fichier (« 1 livrable HTML avec journal ») | oui, candidat | R-32 pourrait dire ce que devient le journal d'un HTML rangé en `old\` — à instruire par le pilot (non remonté : aucun défaut constaté, l'oracle rend PASS) |
| La décision D-4 de la synthèse n est retirée dans la synthèse suivante (o) au profit de l'action faite | nouvelle synthèse (règle 5 : la synthèse n jugée ne se réécrit pas) | non | propre au run |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- La doctrine répondait, et sans ambiguïté une fois lue : règle 7 + C1 tranché donnent une action unique (`git mv` vers `old\`), exécutée en une commande ; R-7 rend PASS immédiatement après.
- `oracle-conformite-projet` R-6 confirme qu'aucun code n'a suivi dans `old\` : la frontière livrable documentaire / code (règle 6) est tenue par le geste.
- La question humaine « que dit la factory ? » a suffi à retrouver la règle en quatre `grep` : la doctrine est trouvable, c'est son déclencheur qui manque.

## Ordre recommandé

1. RF-6 — parce qu'il rejoue pour la quatrième fois en une journée la cause « règle écrite, jamais jouée chez le producteur », et qu'une décision posée à tort à l'humain lui coûte un tour.
2. RF-7 — parce que deux lignes à corriger suffisent et qu'elles contredisent l'oracle en vigueur.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RF-6 et RF-7 suivent un retour humain. La règle existe (règle 7, C1 tranché) ; ce qui manquait est sa présence sur la voie de mandat, un oracle qui la joue, et une synthèse qui refuse de poser une décision déjà tranchée. Classes : RF-6 → `emplacement-livrable-hors-convention` (famille `emplacement-livrable`, « un livrable généré hors du dossier prévu ») — la version remplacée est restée hors de `old\` ; RF-7 → `boucle-retour-sans-descente` (famille `heritage-produit`, « une correction close au pilot ne redescend pas sous une forme que le producteur rencontre ») — C1 est clos depuis le 13/08 et le producteur rencontre encore son libellé antérieur. Aucune classe neuve n'est créée.
