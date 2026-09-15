---
destinataire: humain
---

# Synthèse de mandat — le circuit hébergé ne dépend plus de ce poste, et l'accueil des lots entre sous le harnais (15/09/2026)

La campagne qui corrigeait le circuit d'intégration continue est revenue et sondée. Rejoué comme sur le service hébergé, le circuit passe de 9 recettes en défaut à 2 causes, toutes deux attendant un de vos feux verts. L'adresse IP masquée est désormais prouvée comme telle, et la boîte d'entrée repasse au vert. Un outil sans contrôle, celui qui pseudonymise chaque lot entrant, est entré sous le harnais. 115 commits attendent votre « publie », sans compter le commit de cette synthèse.

## 1. En-tête d'identification

- **quoi** : sondage et clôture de la campagne du circuit hébergé et du relevé des adresses IP, consignation de l'empreinte du lot masqué, et correction d'un constat neuf du harnais.
- **sur quoi** : le pilot seul — son circuit `ci/hebergee/`, son harnais, ses outils d'accueil et d'ingestion, son registre.
- **quand** : 2026-09-15, de 15:35 à 16:25 UTC+02:00 (Europe/Paris), soit environ 50 min.
- **qui** : pilot digit-ai-factory aa6c75c, avec `oracles/self-tests.mjs`, `scripts/simuler-recette-hebergee.mjs`, `todo/reempreinter-lot.mjs`, `todo/ingerer-lot.mjs`, `todo/journaliser.mjs`, `todo/oracle-todo.mjs`, `oracles/oracle-boite-entree.mjs` ; un agent Opus sous `gabarits/AGENT-CAMPAGNE.md`.

## 2. Verdict en une ligne

**Registre : clos 289 → 292, `oracle-todo` PASS ; simulation hébergée 9 défauts → 3, issus de 2 causes nommées ; harnais du poste 116/116 → 120/120 ; boîte d'entrée FAIL → PASS ; adresse IP 0 occurrence, scratchpad compris ; 115 commits prêts sur 9 dépôts hors le commit de cette synthèse ; 0 publication.**

## 3. Décisions attendues de l'humain

Aucune décision neuve : les deux causes qui restent au circuit tombent avec des feux verts déjà demandés, repris comme actions au bloc 8.

## 4. Traité, avec sa preuve

- **Le circuit hébergé ne dépend plus des tables confidentielles de ce poste (TF-1133).** Il clone l'historique complet et les deux dépôts frères publics, sans secret ; les recettes créent leurs propres tables inventées ; les contrôles du parc réel se déclarent sans objet quand le parc manque ; une simulation locale rejoue l'exécution hébergée avant l'activation. Classe : une recette locale qui ne rejoue pas l'environnement de l'intégration continue.
  - preuve : simulation de la campagne → « 9/115 oracle(s) en défaut » avant, 2 causes après ; simulation rejouée ici → « verdict ROUGE — 3 défaut(s) », tous issus de la page générée du registre ; banc du circuit → « 17 PASS, 0 FAIL » ; harnais du poste → 116/116.
- **Une adresse IP traverse l'accueil et l'ingestion nommée, et la réempreinte reconnaît un masque (TF-1134).** Une seule définition des adresses sert aux trois outils. Contrôle rouge → vert : le banc de réempreinte refusait le masque seul avec l'outil d'avant (14 PASS, 1 FAIL), il l'accepte après et refuse toujours une ligne ajoutée.
  - preuve : `adresses-ip.test.mjs` → « 14 PASS, 0 FAIL » ; `reempreinter-lot.test.mjs` → « 15 PASS, 0 FAIL » ; sur le vrai lot, `reempreinter-lot.mjs` → « CONSIGNE » ; `oracle-boite-entree` → PASS ; `oracle-todo` → PASS.
- **Les dernières copies de l'adresse, dans les notes de session, sont masquées ou supprimées.** La copie d'avant du lot n'avait plus d'usage une fois l'empreinte consignée.
  - preuve : recherche sur le scratchpad → 0 fichier.
- **L'outil qui pseudonymise chaque lot entrant n'était joué par aucun contrôle ; il l'est, avec trois autres (TF-1135).** Le harnais joue désormais tout outil hors `oracles/` dont le code teste son drapeau `--self-test`. Contrôle rouge → vert : sur une extraction où ce self-test est forcé en échec, l'ancien harnais ne voit rien et le nouveau le nomme. Classe : un contrôle écrit, non câblé à son étape.
  - preuve : ancien harnais → « 3/116 oracle(s) en défaut », sans l'accueil ; nouveau → « [ECHEC ] todo/accueillir-lot.mjs » ; poste → « 120/120 recettes jouées et vertes », 4 premières mesures au cliquet ; commit aa6c75c.
- **Un constat de la campagne est mesuré et se révèle sans objet.** Elle rapportait que les recettes modifient 7 fichiers suivis ; sur un clone frais gardé, un seul fichier apparaît modifié, sans aucune ligne différente.
  - preuve : simulation avec `--garder` → `git status` : 1 fichier ; `git diff --ignore-cr-at-eol --numstat` → vide.

## 5. Non traité, avec son motif

- **Les 2 causes qui gardent le circuit rouge** — motif : la page générée du registre porte 3 octets nuls et doit être régénérée, mais c'est un chemin tenu par la session voisine ; le vérificateur de pages publié refuse cette page, et sa correction n'existe que dans un commit non publié de la forge des outils.
- **L'activation du circuit** — motif : elle attend une simulation verte, donc les deux causes ci-dessus, puis votre feu vert.

## 6. Écarts à la lettre

- Vous avez décidé un circuit hébergé construit et prêt à activer → il n'est pas encore vert en simulation → pourquoi : ses deux dernières causes se lèvent par une seule voie chacune, votre feu vert. Aucun autre chemin : publier la forge des outils sans vous enfreint R-38, et régénérer la page d'une session voisine enfreint votre décision D-11.

## 7. Risques

- **Un circuit activé trop tôt.** Signal : une simulation encore rouge. Parade : `ci/hebergee/ACTIVER.md` exige la simulation avant le geste, et son banc le vérifie.
- **Un outil dont le drapeau se lit autrement que par les formes reconnues.** Signal : un self-test présent et absent du harnais. Parade : la limite est écrite au registre ; les quatre outils du dépôt sont couverts aujourd'hui.
- **Du travail présent sur un seul poste.** Signal : aucun, jusqu'à la panne. Parade : votre feu vert de publication, avec la porte des noms jouée avant chaque dépôt.

## 8. Prochaines actions

Six actions restent : une pour moi après vos feux verts, quatre pour vous, et une pour l'environnement du poste.

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-1 | Rejouer la simulation hébergée après la publication et l'enregistrement, puis la déclarer verte ou nommer ce qui reste | TF-1133 | auto_ia | dependance_externe (publication de la forge des outils et régénération de la page du registre) | `node scripts/simuler-recette-hebergee.mjs` | l'activation reste sans preuve |
| A-2 | Publier les 9 dépôts prêts | neuve | manuelle_utilisateur | decision : R-38 (règle de publication du noyau) réserve la publication au feu vert humain | répondre « publie » ; l'agent joue la porte des noms puis `git push origin main` dans chaque dépôt | 115 commits restent sur ce seul poste, et le circuit garde une cause rouge |
| A-3 | Donner le feu vert d'enregistrement à la session voisine, puis régénérer la page du registre et enregistrer le registre et les lots du jour | TF-1125, TF-1127, TF-1133 | manuelle_utilisateur | decision : l'enregistrement du travail d'une autre session vous revient | répondre dans la session voisine ; l'agent joue ensuite `node todo/generer-page.mjs` puis `git commit --only -- todo/ input/` | le registre du jour n'existe que sur ce poste, et le circuit garde une cause rouge |
| A-4 | Inscrire aux tables du canal confidentiel les fragments de noms de ressources, si vous les jugez confidentiels | TF-1134 | manuelle_utilisateur | acces : les tables vivent hors dépôt et ne s'écrivent qu'à la main ; mesuré ici, la porte des noms de la forge d'exploitation rend « verdict PASS » et 0 bloquant sans relever ces fragments | éditer `c:\dev\_confidentiel\tables\noms-interdits.json`, puis rejouer la porte des noms | la porte laisse passer ces fragments à chaque publication |
| A-5 | Activer le circuit hébergé, une fois la simulation verte | TF-1018 | manuelle_utilisateur | decision : R-38 réserve l'activation d'un service hébergé au feu vert humain | `git mv ci/hebergee/recette-pilot.yml .github/workflows/recette-pilot.yml`, puis la publication | rien ne rejoue la recette du pilot à la publication |
| A-6 | Aligner la version de ruff du poste sur celle épinglée par la forge des tests | neuve | manuelle_dev | acces : installer un outil au poste est un geste d'environnement ; mesuré ici, `ruff --version` rend « ruff 0.15.21 » alors que `pyproject.toml` de la forge épingle « ruff==0.16.1 » | `uv tool install ruff==0.16.1` | la recette de cette forge reste rouge sur ce poste |

Ordre : A-2 et A-3 quand vous voulez, parce qu'ils lèvent les deux causes du circuit ; A-1 juste après ; A-5 si A-1 est verte ; A-4 et A-6 ne bloquent rien.

Commits prêts, par dépôt, hors le commit de cette synthèse : pilot 57, outils 16, design 11, données 7, exploitation 7, audit 6, développement 5, tests 5, conventions 1.

## 9. Traces

- Pilot : ddd7f84 (circuit hébergé), 4e1616e (adresses IP et réempreinte), aa6c75c (harnais, I2 ter), locaux non publiés.
- `input/01-candidatures/constat-accueil-hors-harnais-20260915c.tf.jsonl` : constat TF-1135.
- `todo/TODO.jsonl` : TF-1133, TF-1134 et TF-1135 clos, empreinte du lot consignée, non enregistrés.
- Scratchpad de session : verdicts de simulation sous `sim2/` et `sim3/`, clone gardé sous `sim3/digit-ai-factory/`, extractions du sens rouge sous `i2r-av/` et `i2r-ap/`.
- Ce fichier : `output/04-plans/Digit-AI - Synthese Mandat - Circuit heberge corrige et accueil sous harnais - 20260915c.md`.
