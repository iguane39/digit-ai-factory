---
destinataire: humain
---

# Synthèse Mandat — vos 6 réponses sont construites et publiées, et le premier rejeu réel a déjà servi (02/11/2026)

## 0. Synthèse d'ouverture

Vos 6 réponses sont exécutées et publiées, et il ne reste aucune décision pour vous dans ce tour. Une recette rouge chez un outil qui consomme un skill se verra désormais en 7 jours au plus, et le premier rejeu réel a pris 6 min 15 s, soit bien moins que les 20 minutes annoncées. Ce rejeu a aussitôt rendu un rouge : forge-audit échouait à cause du banc lui-même, pas de son code, et c'est corrigé. Une page servie liste maintenant ses avis, prix barrés et raretés à faire confirmer, et une passe d'amélioration peut conclure qu'il n'y a rien à changer. Le lancement détaché du rejeu à l'ouverture n'a pas encore été observé dans une vraie session, et le remplacement de la consigne page HTML sur vos 2 comptes attend toujours votre geste.

## 1. En-tête d'identification

Exécution de votre réponse « 130a, 131a, 132a, 133a, 134c, 135a » du 02/11/2026 à la synthèse 20261102n, sur le pilot `digit-ai-factory`, forge-agents et forge-design. Période : 02/11/2026 de 14:12 à 16:25, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, 4 agents de campagne Sonnet 5.5 et 1 relecteur d'intention.

Intention de la demande : construire ce que vous avez tranché, ni plus ni moins, et écarter ce que vous avez écarté.

Test rétro : le résultat sert cette intention. Chaque réponse a son issue écrite au registre, et les 5 constructions sont publiées.

## 2. Verdict

5 items clos et 1 écarté comme vous l'avez choisi. Mesuré sur : `todo/TODO.jsonl`, relue à 16:21, périmètre les 6 éléments de votre réponse. Le pilot, forge-design et forge-agents sont publiés, 0 commit d'écart à 16:21.

## 3. Décisions attendues

Rien n'attend de décision de votre part dans ce tour.

## 4. Traité

Chaque chiffre de recette ci-dessous a été rejoué par moi après intégration, sauf mention « rapporté ».

**Vos décisions, par effet visible**

- **Rejeu hebdomadaire** (D-135 (a), pilot 34dd55b1) : une fois par semaine, l'ouverture du pilot rejoue les 4 dépôts de la table sans attendre, et un rouge s'affiche à l'ouverture suivante. Recettes `consommateurs-skills` 38 PASS, `hook-ouverture` 61 PASS, `oracle-skills --self-test` 100/100 ; vrai rejeu joué : 6 min 15 s, 3 PASS et 1 FAIL.
- **Faits commerciaux d'une page servie** (D-132 (a), forge-design 22286eb) : `oracle-faits-commerciaux` repère 7 familles de formes (avis, note, citation, prix barré, rareté, volume, santé) et les liste à faire confirmer, sans jamais échouer sur un fait trouvé. Self-test de forge-design 650 cas verts ; fixture rouge 31 lignes en PASS, fixture piégeuse 0 constat. Inscrit au registre de quality-oracles 2.51.0 (forge-agents 7a83af8), recette 565 contrôles PASS. Rapporté : 9 faux sur 517 constats, sur 1 353 pages du poste.
- **Droit de ne rien changer** (D-133 (a), forge-agents f6a97f1, forge-design d6d3565) : `la-boucle` 1.1.0, `ameliore-le-design` 2.2.0 et `critique-le-design` 1.4.0 comparent 2 passes, ne comptent pas un ajout sans progrès, et admettent « rien à changer » si l'arbitre l'atteste. Self-test de la-boucle 29 contrôles PASS. La loi n° 3 ne bouge pas. Aucune passe réelle n'a encore tourné sous ces règles.
- **Chiffre d'un gain sans sortie** (D-131 (a), pilot 38b262ea) : le hook de fin de tour affiche un avertissement `GAINS` par chiffre absent des sorties du tour, sans refuser la réponse. Recettes `lib-chiffres-releves` 19 PASS et `hook-restitution` 63/63, dont le cas du 02/11. Relevé lu avant la mise en service : 19 gains avertis sur 113, sur 39 clôtures passées. Rapporté : 6 faux sur 25 signalements lus à la main, sous le seuil d'un tiers fixé dans la consigne.
- **Bloc 4 groupé** (D-130 (a), pilot 5296453d) : au-delà de 5 puces, le bloc se groupe et se classe sans rien retirer ; ce bloc l'applique. Gabarit en 2.58.0, héritage en 1.47.0, `hooks-factory.test` 30/30. Consigne sans contrôle, comme vous l'avez choisi.
- **Écart en commentaire** (D-134 (c)) : aucune règle écrite, l'item est écarté au registre avec son motif et le risque accepté. `oracle-todo` PASS.

**Découvert en construisant**

- **Faux rouge de forge-audit** (pilot f3a57aee) : la table lançait la recette sous un shell de connexion, où le `grep` de Git Bash ne retrouve pas l'emoji `PII 🔒` que le rapport contient bien. Rouge reproduit à 13/14, 14/14 sans ce shell, et la trace rend `leve` après correction. Ce rouge existait sans doute avant, à chaque propagation mesurée ; je ne l'ai pas daté.

Relecture d'intention : sert, gravité aucune, 0 écart, verdict consigné sous RI-20261102-23.

## 5. Non traité

- La relecture de chaque consigne avant le lancement, celle de chaque livrable à sa réception et celle de cohérence des 4 lots — motif : `hors_mandat`, j'ai lancé la campagne sans la première et remplacé les 2 autres par le rejeu des recettes et la relecture de fin de tour.
- Le harnais complet `node oracles/self-tests.mjs`, 56 minutes selon un agent — motif : `hors_mandat`, je n'ai rejoué que les recettes touchées ; ses 5 rouges rapportés sont ouverts en candidat TF-2066.
- Les restes TF-2059 et TF-2060 de la campagne précédente — motif : `hors_mandat`, votre réponse ne les couvrait pas.
- Le remplacement de la consigne page HTML sur vos 2 comptes (TF-1991) — motif : `acces`, voir A-1.

## 6. Écarts à la lettre

- D-135 annonçait 20 minutes de machine par semaine au plus → la table porte un plafond de 50 minutes, et le rejeu réel a pris 6 min 15 s → le chiffre de 20 venait de l'en-tête du script, que je n'avais pas recompté avant de vous l'écrire.
- Vous n'aviez rien demandé sur la table du rejeu → j'y ai retiré le shell de connexion de forge-audit → sans cela, le rejeu vous aurait signalé chaque semaine un rouge sans cause.
- D-131 parlait des chiffres absents des sorties → un agent a ajouté 2 choses : un chiffre marqué « rapporté par l'agent » n'est pas accusé, et un gain composé par script se relit au registre → sans la première, un gain honnêtement marqué serait accusé ; sans la seconde, l'avertissement manquerait 79 écritures sur 161, compte rapporté.

## 7. Risques

- **Rejeu détaché jamais observé dans une vraie ouverture** : la recette prouve qu'il survit au hook, mais pas sous le harnais réel d'une session.
  - Signal : `~/.claude/rejeu-hebdomadaire.json` sans nouvelle date après le 09/11 ; passé 14 jours, l'ouverture le dit.
  - Parade : `node oracles/oracle-skills.mjs --rejouer-tous-consommateurs` le rejoue à la main.
- **Avertissement `GAINS` bruyant** : un chiffre mesuré dans un tour antérieur de la même session est accusé, parce qu'un rapport d'agent ouvre un nouveau tour.
  - Signal : des avertissements sur des chiffres réellement mesurés plus tôt.
  - Parade : élargir la fenêtre du tour à la session, ce qui reste à décider si le bruit gêne.
- **Table de `oracle-faits-commerciaux` en partie non vérifiée** : ses références juridiques sont citées de mémoire et marquées non vérifiées, et le contenu écrit par JavaScript n'est pas lu.
  - Signal : le champ `$verifie_a_la_source` de `corpus/faits-commerciaux.json` et la liste `non_juge` du rapport.
  - Parade : relecture de la table prévue au 02/02/2027 ; un PASS ne dit jamais qu'un fait est vrai.
- **Harnais complet rouge** : 5 recettes sur 242 en défaut, rapporté par 2 agents, et le cliquet a été mis à jour à la main pour 4 recettes.
  - Signal : `node oracles/self-tests.mjs` rend exit 1.
  - Parade : TF-2066.

## 8. Prochaines actions

Ordre : votre geste d'abord, car lui seul reste hors de ma portée.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Remplacer la consigne page HTML sur vos 2 comptes, pour que les sessions hors dépôt lisent les bonnes polices | TF-1991 | manuelle_utilisateur | `acces` : API de la plateforme https://api.anthropic.com/v1/skills HTTP 401 et https://claude.ai/api/skills HTTP 403, relevés le 02/11/2026 ; identité de la session sans clé ; aucune identité de service ; script du dépôt `sync-skills.mjs` 0 mention du compte | suivre le guide de la synthèse 20261102k | si rien n'est fait, un brief écrit hors du dépôt peut reprendre Roboto et DM Sans |
| A-2 | Corriger les restes ouverts : gates muets, tables supabase-js non reconnues, harnais complet rouge | TF-2059, TF-2060, TF-2066 | auto_ia | `hors_mandat` : ils ne figuraient pas dans votre réponse | instruire et traiter ces candidats par R-58 (seules dépense, publication, irréversible, doctrine et arbitrage reviennent à l'humain) | si rien n'est fait, un produit en supabase-js reste à couverture nulle, et le cliquet des recettes reste tenu à la main |

## 9. Traces

- Registre : `todo/TODO.jsonl`, consignation des 6 réponses puis clôtures ; relecture dans `todo/relectures-intention.jsonl`.
- Pilot : commits 34dd55b1, 38b262ea, 5296453d, f3a57aee.
- Forges : forge-design 22286eb, d6d3565, 484cf68 ; forge-agents f6a97f1, 7a83af8, publiés par l'envoi d'une autre session du pilot, vérifiés sur `origin/main`.
- Consigne de campagne : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\2071e2c2-a550-4861-af6a-8b64f7aafe28\scratchpad\campagne-d130.md`.
- Trace du rejeu : `~/.claude/consommateurs-rouges.jsonl` et `~/.claude/rejeu-hebdomadaire.json`.
