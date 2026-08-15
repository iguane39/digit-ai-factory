# Synthèse de mandat — « fais toute la todo avec le a » (21 items, 4 campagnes, 1 circuit)

## En-tête d'identification

**Quoi** : fin de mandat global — traitement de la totalité du registre + construction du
circuit de l'insatisfaction (option (a) du choix fermé). **Sur quoi** : 6 dépôts (pilot,
design, tests, ops, agents, seo) + instruction en lecture seule du produit digit-ai.fr.
**Quand** : 15/08/2026, fin à 20:45 (Europe/Paris), durée ≈ 55 minutes. **Qui** : session
pilot (Fable) + 4 agents Opus (routage §4, escalade « construction complexe » consignée),
pilot@0aa34e9.

## Verdict

21 items sur 21 corrigés et archivés (287 archivés au total, registre PASS), 6 dépôts
poussés, ~130 tests neufs tous verts, et le circuit de l'insatisfaction est en service —
sa première instruction a trouvé que la cause évidente était fausse.

## Décisions attendues de l'humain

- 8 candidats nés des campagnes de ce soir — en choix fermé :
  - (a) « traite les todo » à nouveau : je les route comme cette vague — coût ~1 h ;
  - (b) décider les deux qui ne peuvent pas attendre : **TF-0290** (le hook C7 n'était
    versionné nulle part, son jumeau C6 ne l'est toujours pas — un gate sans source ni
    self-test) et **TF-0294** (la recette prononce S-01 sur un arbre qui bouge : deux
    faux « NON TENU » en une soirée, indiscernables d'une régression réelle) ;
  - (c) laisser en candidats.
  - Recommandation : (b) — les six autres sont des affinements, ces deux-là sont des
    trous de contrôle.
  - Par défaut : (c) s'applique.

## Traité — avec sa preuve

- **circuit de l'insatisfaction** (TF-0287) — preuve : `oracle-insatisfactions` self-test
  7/7, `oracle-boite-entree` 12/12 (dont « B3 se tait sur un dépôt d'insatisfaction »),
  banc du pilot 10/10, registre réel PASS avec sa mesure publiée (1 dossier,
  **1 réouverture** — la mesure fondatrice, cible 0) ;
- **INS-0001 instruit** en lecture seule — preuve : `HeaderEn.tsx` porte 8 entrées et
  36 liens, utilisé par **36/36** pages EN ; l'écart vit au déploiement, pas dans le
  composant. Cause de la compression FR datée et localisée (`Header.tsx:169-171`) ;
- **R-37** (§Q) et **TF-0271** — preuve : la règle cite sa commande exacte
  (`rendu-comparatif.mjs`, exit 0/1/2), le gabarit `PARAMETRAGE.md` documente le champ
  `ecarts_r24` que l'oracle exige désormais ;
- **campagne design** (5 items, `ed58292`→`5679119`) — preuve : banc 14 oracles/61 règles
  → **19/67**, 133 vérifications, 0 échec ; T5 corrigé montrait 3 FAIL fantômes **et**
  masquait la vraie paire ;
- **campagnes tests** (7 items, 8 commits) — preuve : pytest 502 → **568 verts**, ruff
  clean, dette 127 sans écart, **S-01 TENU** 13/13 sur arbre stable ; les 4 liens fautifs
  réels attrapés **4 sur 4, et exactement 4** ; pan i18n joué de bout en bout (rouge
  3 constats exactement, vert 0, bancs historiques NA avec preuve positive d'absence) ;
- **campagne ops/agents/seo/pilot** (6 items, 7 commits) — preuve : ops 54/0, seo
  10 vérifications / **147 cas** en une commande, socle HTML 43/43, hook 9/9, pilot
  11 PASS et banc 10/10 ; R-24 rend désormais 2 FAIL sur le cas parti en livraison ;
- **6 dépôts poussés** — preuve : fast-forwards listés (steering `0aa34e9`, design
  `5679119`, tests `b701948`, ops `b431ffb`, agents `0a05744`, seo `65dbcd2`).

## Non traité — avec son motif

- le correctif et la release de digit-ai.fr — motif : **remis au produit**, autonome et
  travaillé par une autre session ; le pilot n'a rien écrit chez lui (lecture seule) ;
- la synchronisation de `ameliore-le-design` vers la copie installée — motif : ses
  8 divergences réelles étaient le travail **en vol** de la campagne design ; à faire au
  calme, `experts-forge` l'a été (2 fichiers, vérifiés identiques) ;
- les 8 candidats — motif : décision humaine, aucun mandat reçu sur eux.

## Écarts à la lettre

Les campagnes en ont déclaré une quinzaine, tous motivés. Les trois qui te concernent :
le pan React a **ajouté deux règles** (la lettre n'attrapait que 3 des 4 liens réels) ;
`crux.py` **garde sa sortie 1** contre ma consigne de symétrie (une clé gratuite n'est pas
une donnée hors de portée) ; le hook C7 a été versionné dans `.claude/hooks/` et non
`.claude/skills/` comme je l'avais écrit — il n'était versionné **nulle part**.

## Risques

- deux campagnes concurrentes sur un même dépôt produisent des verdicts de recette
  fantômes (vécu deux fois ce soir) ;
  - signal : un « S-01 NON TENU » sur des sections que la campagne n'a pas touchées ;
  - parade : rejouer sur arbre stable (fait, 13/13) ; parade de fond consignée TF-0294.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — trancher TF-0290 et TF-0294, parce que ce sont les
  deux seuls trous de CONTRÔLE de la liste ; les six autres candidats sont des
  affinements qui peuvent attendre leur tour.
- Ensuite `auto_ia` — sur mandat : router les six restants, synchroniser
  `ameliore-le-design` maintenant que sa campagne est close, et confronter la vague à la
  revue du 2026-09-15 — dans cet ordre, la synchronisation avant la revue.

## Traces

- `output\05-insatisfactions\INS-0001\INSTRUCTION.md` · `insatisfactions\REGISTRE.jsonl` ;
- `output\03-etudes\` (20260815d, e, f) · `REGLES-PROJET.md` §Q · `BOUCLE-AMELIORATION.md` ;
- `todo\TODO.md` (8 actifs, 287 archivés) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Toute la todo avec le a - 20260815a.md`.
