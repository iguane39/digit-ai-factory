---
role: relevé des restes déclarés à la clôture des items archivés du registre du pilot (proposition P-2 de la synthèse 20260914c, décision humaine D-4 (a) du 14/09/2026) — pour chacun des 103 restes, une catégorie et sa preuve ou sa proposition
sources_de_verite: [todo/TODO-ARCHIVE.jsonl (781 items archivés, 103 avec un reste_a_faire non vide, fusion des événements par id), todo/TODO.jsonl, todo/CLASSES.json, c:/dev/digit-ai-forge-tests/registre-dette.json (modèle de registre de restes, lecture seule)]
verifie_le: 2026-09-14
methode: relevé délégué en lecture seule (modèle Sonnet, 24 appels d'outils, 221 333 tokens) ; reprise établie par l'id cité ET par le contenu de l'item cité, jamais par la seule citation ; recherche par mots-clés et codes de règle ; deux vérifications sur disque
---

# Relevé des restes archivés du pilot — 103 restes, quatre catégories (14/09/2026)

Ce relevé dit ce que sont devenus les 103 « restes à faire » écrits à la clôture d'items du
registre du pilot, aujourd'hui archivés. Le pilot n'a pas de registre de dette : ces restes n'ont
vécu nulle part ailleurs que dans l'archive. Près de la moitié sont des limites qu'il faut assumer
par écrit ; une quarantaine décrivent un manque encore actif ; une dizaine sont repris ou caducs.

**Le reste le plus grave n'est pas une amélioration.** TF-0616 déclare 14 porteurs de secrets hors
périmètre chez les produits, dont une clé d'API réelle non retirée. Il passe en tête des
candidatures, et son traitement relève d'un run demandé aux produits concernés.

## 1. Décompte

**Mode de lecture** : une ligne par catégorie ; la dernière colonne dit ce que la catégorie appelle.

| Catégorie | Restes | Ce qu'elle appelle |
|---|---|---|
| assumer | 49 | une limite écrite, motivée et datée, sur le modèle du registre de dette de forge-tests |
| candidature | 44 | une candidature au registre, 15 regroupements par manque commun |
| repris | 5 | rien : un autre item le traite (preuve citée) |
| caduc | 5 | rien : l'objet a disparu ou le reste décrivait un défaut déjà corrigé dans le même tour |
| **Total** | **103** | |

Limite du relevé : pour 88 restes sans piste de reprise, l'absence de preuve trouvée n'établit pas
l'absence de reprise ; la recherche a porté sur l'identifiant cité, les mots-clés et les codes de
règle.

## 2. Candidatures regroupées, par gain décroissant

**Mode de lecture** : une ligne par manque commun à un ou plusieurs restes ; « ids » sont les items
archivés dont le reste est couvert ; le score est gain / preuve / effort, de 1 à 3.

| N° | ids | Manque | Forge | Score |
|---|---|---|---|---|
| 1 | TF-0616 | 14 porteurs de secrets hors périmètre chez les produits, dont une clé d'API réelle non retirée | pilot, produits | 3/3/2 |
| 2 | TF-0548 | 14 exigences non couvertes par un oracle (R-15.1 en tête) | pilot | 3/3/2 |
| 3 | TF-0523 | scellement des livrables posé à la main, pas en fin de run d'oracle | pilot | 3/2/3 |
| 4 | TF-0531 | la sévérité déclarée d'une famille de mesure n'est pas vue par ses consommateurs | pilot | 2/3/2 |
| 5 | TF-0666, TF-0672 | M-8 (fraîcheur de la mise en production) invérifiable en CI réelle — déjà porté par TF-1075 | ops | 2/3/2 |
| 6 | TF-0530 | règles N-10 et N-11 du mandat sans mécanisme | pilot | 2/2/3 |
| 7 | TF-0480, TF-0493 | contrôles visuels et d'interaction jamais joués sur une instance servie | forge-tests, design | 2/2/3 |
| 8 | TF-0679, TF-0681 | une recette peut rester verte sans exercer le sens rouge ; 11 exemptions non protégées | agents | 2/2/2 |
| 9 | TF-0664 | 7 des 10 étapes de la chaîne de traduction non écrites | tests, conception | 2/2/3 |
| 10 | TF-0645 | un lot de travaux ne se corrige pas en rédaction sans changer son sceau | pilot | 2/2/2 |
| 11 | TF-0652 | héritage produit incomplet (robots.txt, llms.txt, mention R-43) — voisin de TF-1078 | produit | 2/2/1 |
| 12 | TF-0650, TF-0657, TF-0579 | la justesse d'une preuve rejouée n'est pas jugée, seulement sa présence | agents, seo-geo, ops | 2/2/2 |
| 13 | TF-0690, TF-0702 | fiche sécurité sans identifiant et version de gabarit ; contournement `--gabarit` | audit | 2/1/2 |
| 14 | TF-0522, TF-0592, TF-0594, TF-0647, TF-0669, TF-0726, TF-0733 | sept contrôles déclarés mais non câblés à leur étape | pilot, tests, conception, agents | 2/2/2 |
| 15 | TF-0324, TF-0483, TF-0607, TF-0648, TF-0654, TF-0658, TF-0659, TF-0638, TF-0651, TF-0667, TF-0692, TF-0712, TF-0578, TF-0524, TF-0735 | restes ponctuels, gain plus faible ou effort incertain | diverses | 1-2 |

## 3. Repris et caducs

**Mode de lecture** : une ligne par reste qui ne demande rien ; la preuve est ce qui l'établit.

| id | Catégorie | Preuve |
|---|---|---|
| TF-0504 | repris | TF-0505, corrigé le 22/08 : « la part du corollaire que TF-0504 avait laissée ouverte, et elle est close ici » |
| TF-0517 | repris | TF-0518, corrigé le 22/08 : règle M18 de `check_markdown.py` |
| TF-0586 | repris | décomposé en TF-0585 et TF-0587, qui gardent chacun leur reste : décomposition, pas clôture |
| TF-0663 | repris | TF-0665, corrigé le 02/09 : troisième contrôle nommé, `forge_tests/orphelins.py` |
| TF-0691 | repris | TF-0693, corrigé le 02/09 : allocateur d'indice vendorisé et employé |
| TF-0598 | caduc | le fichier `null` à la racine du parc est absent du disque au 14/09/2026 |
| TF-0631 | caduc | aucun lien symbolique à la racine du parc au 14/09/2026 |
| TF-0580 | caduc | le reste décrit un défaut « corrigé au passage » dans le même tour |
| TF-0587 | caduc | le reste décrit deux défauts « corrigés sur place » |
| TF-0639 | caduc | le reste décrit un défaut « CORRIGÉ DANS LE MÊME TOUR » |

## 4. Limites à assumer (49)

Les 49 restes classés « assumer » citent eux-mêmes leur motif : coût disproportionné, faux positifs
prouvés, jugement humain irréductible (relecture native, justesse d'une glose), accès hors de portée
de l'agent. Ils ne demandent pas de travail ; ils demandent d'être **écrits** comme limites datées,
pour ne plus se confondre avec du travail oublié. Liste : TF-0474, 0476, 0477, 0481, 0482, 0489,
0490, 0491, 0492, 0494, 0495, 0506, 0509, 0511, 0514, 0515, 0516, 0518, 0519, 0525, 0526, 0527,
0528, 0529, 0582, 0585, 0606, 0629, 0632, 0633, 0635, 0636, 0640, 0642, 0644, 0646, 0649, 0653,
0656, 0660, 0661, 0662, 0668, 0670, 0671, 0673, 0678, 0688, 0689. Le motif cité de chacun est au
tableau détaillé du relevé délégué, reproduit dans la trace de session ; il se reprend mot pour mot
dans le registre de dette du pilot si celui-ci est créé.
