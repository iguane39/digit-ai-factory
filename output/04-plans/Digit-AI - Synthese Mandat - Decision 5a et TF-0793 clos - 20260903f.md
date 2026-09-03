---
destinataire: humain
---

# Synthèse de mandat — décision 5a appliquée et premier chantier du pilot clos (03/09/2026)

Votre tri en bloc est enregistré : les dix candidatures sont décidées dans l'ordre que vous avez retenu, pilot d'abord. Le premier chantier du pilot est déjà clos et publié : la racine web qu'un produit déclare est désormais lue par les deux contrôles qui la demandaient, et le relevé du parc ne compte plus aucun artefact « hors racine » là où il en comptait deux la veille. Ce qui change pour vous : un produit qui sert son site depuis un sous-dossier n'est plus accusé à tort à chaque ouverture, et ce qu'on lui demande de déclarer sert enfin à quelque chose. Ce qui est attendu de vous : dire si j'enchaîne sur les quatre chantiers pilot restants dans la foulée, ou si ce tour s'arrête ici.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-5 (a) : dix candidatures décidées au registre ; instruction et clôture du premier chantier pilot (la déclaration de racine web que rien ne lisait).
- **sur quoi** — le pilot `digit-ai-factory` (scripts, oracle de conformité, recettes, registre) ; le produit 02 lu en lecture seule pour mesurer avant et après ; rien n'a été écrit chez un produit.
- **quand** — fin le **03/09/2026 à 21:29 (UTC+02:00)**, durée depuis votre réponse ≈ 15 minutes.
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `522a7e2` après publication, base `2f8fc25` avant.

## 2. Verdict en une ligne

10/10 candidatures décidées (registre PASS), TF-0793 **corrigé** : relevé du parc 2 → 0 « hors racine », recettes 19 → 23 et 45 → 46 au vert, banc 92/93 (défaut préexistant), porte de publication PASS, commit `522a7e2` poussé.

## 3. Décisions attendues

> **D-6 — Enchaîne-t-on maintenant sur les quatre chantiers pilot restants de votre tri, ou ce tour s'arrête-t-il sur le premier ?**
> Votre décision 5a fixe l'ordre : pilot d'abord. Le premier chantier est clos. Restent, côté pilot, un remède prescrit qui ne solde pas son défaut et un ledger qui collisionne à l'écriture concurrente, un contrôle qui rend vert des sorties jamais exercées, une clé de versions malformée sans voie de rectification, et une page 404 à ériger en standard pour tout site produit. Chacun porte une preuve du coût mesurée par le produit qui l'a remonté ; aucun ne dépend d'une décision de votre part pour être instruit, mais les instruire dans la foulée engage encore plusieurs tours de travail ce soir.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (les quatre items en statut décidé, rang 2 à 5 de votre ordre) et `references\TODO-FORGE.md` (un item décidé s'instruit et se clôt sur gains constatés).
> Le contexte est chargé — les scripts, le contrat d'héritage et le produit qui remonte les constats sont déjà lus — et il se perd à la prochaine session ; enchaîner coûte moins que reprendre.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** enchaîner sur les quatre chantiers pilot, une synthèse par chantier clos | moyen × moyen : quatre instructions avec recette double sens chacune, publication à chaque clôture | exclut de reprendre les quatre à froid ; vous lisez quatre synthèses de plus ce soir |
| **(b)** enchaîner sur un seul chantier de plus (le remède R-42 (le contrôle d'intégrité du ledger produit) et le ledger concurrent), puis s'arrêter | moyen × court | exclut les trois autres ce soir ; ils restent décidés, sans porteur jusqu'au prochain tour |
| **(c)** s'arrêter ici | gratuit | exclut tout chantier de plus ce soir ; les neuf items décidés attendent une session |

> **Si rien n'est décidé** : (c) s'applique — les neuf items restent décidés au registre, visibles en tête des actifs, sans porteur.

## 4. Traité — avec sa preuve

- **Dix candidatures décidées en bloc**, avec le rang de chacune dans votre ordre et la cible, par l'écrivain du registre.
  - preuve : `journaliser.mjs` : « 10 événement(s) journalisé(s) », verdict après écriture PASS ; vue régénérée, 21 actifs.
- **Le défaut de TF-0793 mesuré avant d'y toucher** : la déclaration `racine_web: site` existe bien chez le produit 02 depuis le 01/09, les deux fichiers vivent sous ce dossier, et aucun script du pilot ne lisait la ligne — seul le gabarit d'émission des travaux la citait.
  - preuve : lecture du frontmatter du produit (ligne présente) ; `grep racine_web` sur le pilot : une seule occurrence, dans le gabarit d'émission ; relevé du parc : « 2 HORS RACINE » pour ce produit.
- **La déclaration lue par le relevé d'héritage** : une fonction lit la ligne dans le frontmatter seulement, un artefact absent de la racine du dépôt est cherché sous la racine déclarée, jugé là selon son mode, et la racine est nommée au relevé ; sans déclaration, rien n'est deviné.
  - preuve : `scripts\relever-heritage.test.mjs` 19 → 23 cas, 0 FAIL — présent sous racine déclarée et nommé ; sans déclaration → hors racine ; racine déclarée mais fichier manquant → absent ; lecture frontmatter seul, formes `./public/` et fins de ligne Windows.
- **La même déclaration lue par la règle R-47** (l'héritage du pilot jugé chez le produit à chaque lot) de l'oracle de conformité : même lecteur importé, même résolution — les deux consommateurs du contrat rendent le même verdict.
  - preuve : `oracles\self-test.mjs` 45 → 46 cas, 0 FAIL — avec la déclaration, R-47 compte deux artefacts de plus au vert ; sans elle, pas un de plus.
- **Le gain constaté sur le parc réel** : le produit 02 passe de « 1 absent, 3 divergents, 2 hors racine » à « 1 absent, 3 divergents » ; le total « hors racine » du parc tombe à zéro ; R-47 chez ce produit ne nomme plus ses deux fichiers web.
  - preuve : `scripts\relever-heritage.mjs` rejoué sur le parc (0 ligne « HORS RACINE ») ; `oracles\oracle-conformite-projet.mjs` sur le produit 02 : R-47 « 1 absent : forge/retours/CLASSES.json » seulement.
- **TF-0793 clos avec sa descente** — classe : un contrôle qui prescrit un geste sans jamais le lire ; contrôle rouge → vert : relevé du parc « 2 HORS RACINE » → 0, recette 19 → 23 cas. L'événement de clôture porte corrections, gains, version corrigée, produits bénéficiaires et la règle retenue (« un contrôle qui prescrit une déclaration la lit »).
  - preuve : événement `corrige` journalisé (verdict PASS), vues et avancement régénérés (17 ouverts, 4 fermés).
- **Publication** en avance rapide, porte de publication verte.
  - preuve : `oracle-nom-client-publie` PASS sur un clone à branche unique ; `git push` → `2f8fc25..522a7e2 main -> main` ; banc `oracles\self-tests.mjs` 92/93, cliquet des recettes 19 → 23 et 45 → 46 consigné.

## 5. Non traité — avec son motif

- **Les quatre chantiers pilot restants et les cinq de forges** : *dépendance à une décision humaine* — D-6 pour les pilot ; les cinq de forges relèvent d'un mandat chez chaque forge (le pilot n'y écrit pas sans mandat).
- **Le remède de l'oracle des skills** (règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture)) : *hors mandat* — non sélectionné ; seul défaut du banc, préexistant.
- **Les autres défauts du produit 02 vus en passant** (livrables marqués hors du dossier de sortie, indices en double, types hors registre, ledger rompu) : *chez le produit* — le pilot n'écrit pas chez un produit ; ils apparaissent dans son propre oracle et lui reviennent par ses runs.
- **Le gabarit d'émission des travaux** qui promettait « le relevé cesse de compter » : *rien à changer* — la promesse est désormais tenue par le code ; le texte reste exact.
- **Les restes humains de ce matin** (autre poste, racine du parc, héritage des deux produits) : *inchangés* — repris au bloc 8.

## 6. Écarts à la lettre

- Vous avez répondu « 5a » → j'ai décidé les dix items ET instruit le premier, comme l'action A-8 de la synthèse précédente l'annonçait → parce que la décision en bloc n'a de valeur que si le premier chantier s'ouvre ; il s'est refermé dans le même tour.
- Le lot proposait « faire lire racine_web par relever-heritage.mjs et par l'oracle R-47 » → c'est ce qui a été fait, avec un lecteur unique partagé → parce que deux lecteurs auraient recréé la double vérité que TF-0649 avait déjà payée.
- Rien ne demandait de vérifier la règle R-27 (surface web ouverte aux agents) → elle a été relue → parce qu'elle aurait pu porter le même défaut ; elle cherche déjà les fichiers dans tout le dépôt et rend PASS chez le produit 02, rien n'a été changé.

## 7. Risques

- **Une déclaration fausse** (`racine_web:` pointant sur un dossier d'archives qui contient une copie) rendrait un artefact présent qui n'est pas servi.
  - signal : un relevé vert sur un produit dont la surface servie ne répond pas aux fichiers attendus.
  - parade : la lecture ne devine rien mais ne vérifie pas le service ; c'est le produit qui déclare et qui répond de sa déclaration, comme pour le reste du frontmatter.
- **Deux lecteurs qui divergent à nouveau** si l'un des deux consommateurs évolue seul.
  - signal : relevé et R-47 qui ne disent plus la même chose sur un même produit.
  - parade : le lecteur est une fonction unique importée par les deux ; les deux recettes la jouent.
- **Les quatre chantiers pilot suivants touchent le ledger et un contrôle d'intégration** : plus de surface que celui-ci.
  - signal : un banc qui rougit sur des recettes voisines après un chantier.
  - parade : une recette double sens par chantier, banc rejoué avant chaque publication.

## 8. Prochaines actions

Ordre de traitement : d'abord la suite de votre tri, parce que neuf items décidés attendent un porteur et que le contexte est chargé ; puis les gestes humains inchangés depuis ce matin, parce qu'ils ne bloquent rien d'autre.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-11 | TF-0794 | Instruire le deuxième chantier pilot : le remède prescrit par R-42 qui ne solde pas le défaut et l'écriture concurrente du ledger qui collisionne par construction. | `auto_ia` | `dependance_bloc_3` — D-6. | Le produit 02 garde un ledger à intégrité rompue et un remède qu'il applique sans effet. |
| A-12 | TF-0795, TF-0801, TF-0802 | Instruire les trois chantiers pilot suivants dans l'ordre : contrôle CI3 qui rend vert sans chemin d'échec, clé de versions malformée sans rectification, page 404 en standard d'office. | `auto_ia` | `dependance_bloc_3` — D-6. | Trois défauts mesurés restent ouverts chez les produits qui les ont payés. |
| A-13 | TF-0796, TF-0797, TF-0800, TF-0798, TF-0799 | Mandater un run chez forge-design (trois items), forge-development (un) et forge-conception (un) pour instruire les cinq candidatures décidées de forges. | `auto_ia` | `hors_mandat` — écriture chez une forge : mandat propre à chaque forge (boucle mandatée, journalisée). | Les cinq items restent décidés sans porteur ; les défauts de rendu et de garde lexicale se reproduisent aux prochains runs. |
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, non sélectionné. | La garde d'ouverture annonce « poste non prêt » ; banc à 92/93. |
| A-10 | `neuve` (reprise de la synthèse 20260903e) | Depuis les produits 02 et 12, jouer `node <PILOT_ROOT>\scripts\recopier-heritage.mjs .` dans le dépôt du produit, puis vérifier que l'avertissement R-47 disparaît à la prochaine ingestion. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (mandat du 23/08) ; trace mesurée : R-47 « 1 absent, 3 périmés » sur le produit 02 ce soir encore. | Chaque nouveau lot des deux produits répète l'avertissement. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste, avant tout travail : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot, puis vérifier que la garde d'ouverture rend « à jour (522a7e2) ». | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements de ce soir. |
| A-7 | `neuve` (reprise de la synthèse 20260903d) | Décider du sort des trois restes de la racine du parc : la seconde copie du pilot, le fichier « null » (à lire avant suppression), le lien brisé. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session. |

## 9. Traces

- Publication : commit `522a7e2` sur `main`, poussé (`2f8fc25..522a7e2`), 7 fichiers ; la clôture de TF-0793 et cette synthèse partent dans le commit suivant.
- Code : `scripts\relever-heritage.mjs` (fonction `racineWebDeclaree`, résolution sous racine déclarée dans `etatArtefact`) · `oracles\oracle-conformite-projet.mjs` (R-47, même lecteur) · `scripts\relever-heritage.test.mjs` (4 cas) · `oracles\self-test.mjs` (1 cas) · `oracles\baseline-recettes.json` (cliquets).
- Registre : `todo\TODO.jsonl` — dix événements « décidé » (TF-0793 à TF-0802, rang et cible dans la décision), un événement « corrigé » (TF-0793) ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` (17 ouverts, 4 clos, sceau `d8d6c39794d4`).
- Mesures : `scripts\relever-heritage.mjs` sur le parc (0 « HORS RACINE ») · `oracles\oracle-conformite-projet.mjs` sur le produit 02 (R-47 : 1 absent, 3 périmés, aucun fichier web).
- Oracles rejoués : `oracle-nom-client-publie` (PASS) · `todo\oracle-todo.mjs` (PASS) · `oracles\self-tests.mjs` (92/93).
