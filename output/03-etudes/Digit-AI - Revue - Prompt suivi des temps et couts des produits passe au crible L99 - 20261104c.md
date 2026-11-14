---
role: analyse L99 (8 couches, mode boucle ouvert d'office) du prompt « tracer temps, délais, charges, jetons et coûts des produits » du 04/11/2026 ; livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, protocole de tests)
sources_de_verite: [c:\dev\*\forge\ledger.jsonl (11 journaux, relevés le 04/11/2026), scripts/relever-flotte.mjs, ~/.claude/projects et ~/.claude-b/projects (transcriptions), references/JETON-ABONNEMENT.md, references/MODELES-EN-SERVICE.json, CONTRAT-INTERFACE.md §3, §4 bis et §4 ter, gabarits/ETUDE-OPPORTUNITE.md]
verifie_le: 2026-11-04
---

# Revue L99 — « Tracer temps, délais, charges, jetons et coûts de chaque produit »

Prompt reçu le 04/11/2026, analysé au niveau **L99** *(analyse complète en 8 couches, chacune
relisant le prompt d'origine)*, en **mode boucle** *(le prompt réécrit est noté par des relecteurs
aveugles, sans l'analyse, jusqu'à ne plus porter de défaut grave)*. Les mesures ont été relevées le
04/11/2026 entre 16:54 et 16:58, sur le poste Dell-XPS-16.

**Ce qui change pour vous.** Deux de vos cinq grandeurs ne se mesurent pas en l'état. Le coût
n'existe pas au jeton : la Factory tourne sur l'abonnement, et aucune transcription ne porte de
montant. L'historique des produits déjà construits est en grande partie perdu : les transcriptions
les plus anciennes datent du 25/09/2026, les journaux de run du 05/08/2026. Le prompt réécrit fait
définir chaque grandeur avant de la mesurer, et fait partir l'étude de ce qui existe.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt d'origine vaut 22 sur 100. Il perd l'essentiel de ses points sur un même silence : il
nomme cinq grandeurs sans en définir aucune, et suppose qu'elles se lisent quelque part.

### Observe

Le prompt porte une phrase de besoin et deux demandes. Le besoin : « tracer le temps, délai et
charges, + tokens utilisés & coûts, des différents produits construits, déployés et/ou remédiés ».
La première demande : « Identifie ce qu'il est nécessaire de rajouter pour avoir un suivi fin de
chaque projet ». La seconde : « des éléments à rajouter dans la Factory pour rajouter et suivre ces
informations finement dans chaque projet ». Une prémisse : « La Factory trace déjà une partie des
différentes informations ».

Le prompt ne dit ni le livrable, ni la granularité de « fin », ni la définition de « charges » et
de « coûts », ni la période couverte.

### Orient

Le demandeur pilote une Factory qui construit des produits par agents. Il veut savoir ce que coûte
un produit, en temps et en ressources, et pouvoir le suivre au fil des runs. Trois usages sont
plausibles et le prompt n'en nomme aucun : piloter la Factory (quel modèle, quelle étape coûte),
chiffrer une mission future, montrer à un client le coût d'un produit. La granularité utile change
avec l'usage.

L'exécutant sera une session Claude Code ouverte au pilot. Elle connaît la doctrine par le
`CLAUDE.md`, mais elle ne sait pas ce que les journaux contiennent réellement : elle le supposera.

### Decide

Trois stratégies de réponse se présentent.

1. **Étude d'écart puis plan.** Inventorier ce qui existe, définir chaque grandeur, mesurer la
   couverture, proposer des options d'ajout, laisser le choix au porteur.
2. **Construction directe.** Écrire un script de relevé et un champ de journal. Rapide, mais le
   prompt demande d'« identifier », et un ajout chez les produits sans run est interdit au pilot.
3. **Tableau de bord d'abord.** Produire tout de suite les chiffres par produit. Séduisant, mais il
   fige des définitions non posées et chiffrerait des coûts qui n'existent pas.

### Act

La stratégie 1 est retenue. Elle suit la lettre (« identifie ») et l'esprit (pouvoir suivre). Elle
est la seule qui force la définition du coût avant tout chiffre. L'étude porte une démonstration
sur un run réel : elle prouve que les définitions se calculent.

### Étalon

Le prompt idéal pour cette intention :

- inventorie l'existant mesuré, avec ses commandes, et le fait remesurer à l'exécution ;
- définit chaque grandeur (temps actif, délai calendaire, charge, jetons par catégorie, coût) ;
- traite l'abonnement : distingue coût payé, équivalent au tarif public et hébergement ;
- traite la conservation : ce qui est perdu, et comment ne plus le perdre ;
- pose l'unité de suivi et la règle d'attribution d'une session à un produit ;
- respecte l'autonomie des produits et la pseudonymisation du pilot public ;
- nomme le livrable, son gabarit, son contrat et ses tests.

**Rubrique.** Comment lire : une ligne par dimension, le score obtenu sur le maximum, et la raison
tirée du texte du prompt.

| Dimension | Score | Raison |
|---|---|---|
| Clarté de l'intention | 9 / 20 | Les cinq grandeurs et les deux demandes sont nettes ; « charges », « coûts » et « finement » ne le sont pas |
| Spécification | 3 / 20 | Aucun livrable, aucun format, aucune granularité, aucun lecteur |
| Garde-fous et contraintes | 1 / 15 | Rien sur l'autonomie des produits, les noms réels, la construction |
| Ancrage et contexte | 4 / 15 | « La Factory trace déjà une partie » renvoie à l'existant sans le nommer |
| Vérifiabilité de la sortie | 2 / 15 | Aucun critère de réussite |
| Robustesse | 3 / 15 | « et/ou » et « rajouter dans chaque projet » ouvrent des lectures divergentes |
| **Total** | **22 / 100** | 2 bloquants (Ch3) : plafond de 40, non atteint |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

La chaîne du prompt tient en trois maillons, et le premier repose sur une prémisse que la mesure
dément en partie.

- **Si** la Factory trace déjà une partie des grandeurs, **alors** il suffit d'identifier le reste.
- **Si** on identifie le reste, **alors** on sait quoi ajouter à la Factory.
- **Donc** chaque projet suivra finement les cinq grandeurs.

Rupture 1. Le premier maillon suppose que les cinq grandeurs sont de même nature, et qu'il manque
seulement des champs. Le coût n'est pas un champ manquant : sous abonnement, il n'existe pas au
jeton, il faut le définir (B1). L'historique n'est pas un champ manquant non plus : il est purgé
(B2).

Rupture 2. Le troisième maillon saute de « ajouter à la Factory » à « suivre dans chaque projet ».
Le pilot n'écrit pas chez un produit hors run demandé ; l'ajout descend par l'héritage ou un run de
version, produit par produit (M6).

Rupture 3. « Construits, déployés et/ou remédiés » nomme trois cycles de vie sans dire lequel est
l'unité : un produit remédié 3 fois a-t-il un coût ou quatre ? (M3)

---

## Chapitre 3 — Blindspots · Inventaire maître

Le prompt porte 2 défauts bloquants et 10 majeurs. Les deux bloquants feraient produire des
chiffres faux présentés comme mesurés.

**Comment lire.** Une ligne par défaut, classés par sévérité. B désigne un bloquant, M un majeur,
m un mineur. La colonne « Origine » dit quelle couche l'a trouvé ; les défauts remontés par une
couche aval y figurent aussi.

| # | Défaut | Sévérité | Origine |
|---|---|---|---|
| B1 | « coûts » non défini, alors que la Factory tourne sur l'abonnement (`apiKeySource` vaut `none`) et qu'aucune transcription ne porte de montant : l'exécutant multipliera les jetons par des prix de mémoire | bloquant | Ch3, confirmé Ch4 |
| B2 | Le prompt suppose l'historique des « produits construits » disponible ; les transcriptions remontent au 25/09/2026, les journaux de run au 05/08/2026 | bloquant | Ch4 |
| M1 | « charges » polysémique : temps humain, temps agent, jours facturables | majeur | Ch3 |
| M2 | « temps » et « délai » non distingués : durée active ou calendaire, seuil d'inactivité | majeur | Ch3 |
| M3 | Unité et granularité de « fin » non posées : produit, run, étape, session | majeur | Ch2, Ch3 |
| M4 | « trace déjà une partie » sans inventaire : 11 journaux de produits, 0 champ de jetons, 1 champ de durée | majeur | Ch3, confirmé Ch4 |
| M5 | Attribution d'une session à un produit non traitée : sessions du pilot pour un produit, forges, dossiers temporaires, 2 profils | majeur | Ch3 |
| M6 | « rajouter … dans chaque projet » heurte l'autonomie des produits | majeur | Ch2 |
| M7 | Les dossiers de transcriptions encodent des noms réels ; le pilot est public | majeur | Ch3 |
| M8 | Aucun livrable, gabarit, contrat ni frontière étude ou construction | majeur | Ch3 |
| M9 | Le second poste porte ses propres transcriptions, invisibles d'ici | majeur | Ch4 |
| M10 | Finalité des chiffres non dite (pilotage, chiffrage d'une mission, restitution client) ; la granularité en dépend | majeur | Ch6 |
| M11 | Un relevé automatique ajouté en hook peut ralentir chaque ouverture ou chaque tour | majeur | Ch5 |
| M12 | Temps des agents parallèles : somme ou union des durées, non dit | majeur | Ch6 |
| m1 | Catégories de jetons (cache en création et en lecture, réflexion) non nommées | mineur | Ch3 |
| m2 | « remédiés » : run de version, mandat ou correction hors run, non dit | mineur | Ch3 |
| m3 | Ponctuation « + » et « & » dans la phrase de besoin | mineur | Ch3 |

Biais probable de l'auteur : la malédiction du savoir. Il sait que la Factory journalise beaucoup
et suppose que les jetons et les durées en font partie. La mesure du Ch4 montre le contraire.

---

## Chapitre 4 — Factcheck · Audit des prémisses

Une prémisse explicite est vraie mais partielle ; deux prémisses implicites sont fausses en l'état.

**Comment lire.** Une ligne par affirmation, explicite ou implicite, avec son verdict et la mesure
qui le fonde. Commandes jouées en Git Bash depuis `c:\dev` le 04/11/2026 entre 16:54 et 16:58.

| # | Affirmation | Verdict | Mesure |
|---|---|---|---|
| P1 | « La Factory trace déjà une partie des différentes informations » | vrai, partiel | 11 journaux `forge\ledger.jsonl` ; `run_open` 12, `run_close` 9, `etape_open` 26, `etape_close` 64 ; 0 champ de jetons, 1 champ `duree_s`. `scripts\relever-flotte.mjs` relève les jetons par sous-agent, rangés par campagne et non par produit. 7 fichiers `avancement.jsonl` |
| P2 | (implicite) les jetons sont traçables | vrai pour la fenêtre conservée | chaque réponse des transcriptions porte `usage` avec 4 catégories, `model`, `timestamp`, `cwd`, `sessionId` |
| P3 | (implicite) les coûts sont traçables | faux en l'état | aucun champ de coût dans `usage` ; `apiKeySource` vaut `none` (abonnement, mémoire du 02/11/2026) ; `grep -ci prix references/MODELES-EN-SERVICE.json` rend 0 |
| P4 | (implicite) l'historique des produits construits est disponible | faux pour les runs anciens | plus ancienne transcription : 2026-10-02 (profil `~\.claude`, 1 055 fichiers), 2026-09-25 (profil `~\.claude-b`, 260 fichiers) ; plus ancien journal de run : 2026-08-05 ; `cleanupPeriodDays` absent des deux profils |

P3 et P4 remontent au Ch3 comme bloquants (B1, B2). La rétention par défaut des transcriptions de
Claude Code n'a pas été relue dans sa documentation pour cette revue : l'écart de 30 à 40 jours le
suggère, le prompt réécrit fait vérifier la page et la date de lecture.

**Prémisse d'accès.** L'étude devra ouvrir les journaux des produits et les transcriptions. L'accès
a été mesuré en lecture locale, sans réseau :

1. appels et retours : `cat */forge/ledger.jsonl`, `find ~/.claude/projects -name '*.jsonl'`,
   `find ~/.claude-b/projects …`, code de retour 0 ;
2. horodatage 2026-11-04, 16:54 à 16:58 ; identité : le compte Windows de la session, poste
   Dell-XPS-16 ;
3. contrôle positif : la transcription de la session en cours a été lue et portait `usage` ;
4. familles d'accès : profil `~\.claude` (ouvert), profil `~\.claude-b` (ouvert), poste
   DESKTOP-ULTRA7 (non essayé : aucune voie de lecture connue depuis ce poste), page d'usage de
   l'abonnement (non essayée : interface humaine, pas de lecture outillée connue).

Le second poste reste donc hors de portée de l'étude, ce qui remonte en M9.

---

## Chapitre 5 — Premortem · Anticipation d'échec

L'étude a été produite et le porteur la juge inutilisable. Voici les cinq causes les plus
probables, de la plus à la moins probable.

**Comment lire.** Chaque cause projette un défaut du Ch3 en scénario, ou en ajoute un neuf
(remonté au Ch3) ; la mitigation est intégrée au prompt réécrit.

1. **Des coûts en dollars inventés** (B1). L'étude affiche « le produit X a coûté 214 $ ». Le
   chiffre multiplie les jetons par des prix tirés de la mémoire du modèle, sans date. Mécanisme :
   un coût demandé et non défini se calcule par le chemin le plus court. Mitigation : trois coûts
   distincts, table de prix lue en ligne et datée, prix non relu marqué.
2. **Une consignation à la main qui meurt** (M4 escaladé). L'étude recommande d'ajouter un champ
   `jetons` au journal, rempli par l'orchestrateur. Le §4 bis l'avait déjà prescrit : aucune
   consignation après le 25/09/2026, selon l'en-tête de `relever-flotte.mjs`. Mitigation : tout
   relevé recommandé est automatique et lit les transcriptions (loi n° 5).
3. **Des totaux faux par attribution** (M5). Une session du pilot qui servait un produit est
   comptée au pilot ; les sous-agents sont comptés 2 fois. Mitigation : règle d'attribution
   testée sur 3 sessions réelles, sous-agents comptés une fois.
4. **Une étude bloquée à la publication** (M7). Le tableau par produit reprend les noms des dossiers
   de transcription. La porte de publication refuse, ou laisse passer un nom qu'elle ne connaît
   pas. Mitigation : pseudonymes de `references\PRODUITS.md`, contrat ligne 10.
5. **Un hook qui ralentit tout** (neuf, remonté en M11). Le relevé se branche à l'ouverture et
   parcourt 1 300 transcriptions. VS Code coupe l'ouverture à 60 secondes. Mitigation : relevé
   borné aux sessions du produit, budget de temps chiffré.

---

## Chapitre 6 — Wargame · Stress-test adversarial

Les trois attaques ajoutent 2 défauts au Ch3 et confirment la frontière entre étude et
construction.

**L'utilisateur exigeant.** Il veut lire, pour un produit, « combien il m'a coûté et combien de
temps il a pris », par étape. Il ne dit pas pour quoi faire : piloter la Factory, chiffrer la
prochaine mission ou montrer le coût au client. Une étude qui ne nomme pas l'usage dimensionne mal
la granularité. Défaut neuf, remonté en M10.

**L'expert du domaine.** Trois remarques. Les jetons lus en cache coûtent bien moins que les
jetons d'entrée au tarif public : un total de jetons non ventilé ne dit rien du coût (m1). Sous
abonnement, la ressource rare est le quota de la fenêtre, pas le dollar : le coût payé (a) doit
pouvoir se lire en part de quota. Enfin, dix agents parallèles pendant une heure font 10 heures
de temps agent et une heure de délai : la somme et l'union des durées sont deux grandeurs. Défaut
neuf, remonté en M12.

**Le contradicteur.** Lecture littérale paresseuse : « des éléments à rajouter dans la Factory »
devient une liste de souhaits sans ordre ni coût. Lecture extensive : « rajouter … dans chaque
projet » devient une campagne d'écriture chez 11 produits. Le prompt réécrit borne les deux :
options comparées avec leur coût, et étude seulement.

**Lentille robustesse.** Non obligatoire : le prompt est un prompt de run, pas un template.
Une seule exposition : les valeurs de l'ÉTAPE 0 vieilliront dès la prochaine session ; le prompt
réécrit les fait remesurer.

---

## Chapitre 7 — Deepthink · Implications profondes

Prompt de run exécuté une fois : les effets d'échelle du prompt lui-même ne sont pas pertinents.
Ceux du dispositif qu'il fera recommander (un relevé sur 41 dépôts, un hook par produit) sont
traités dans l'étude, par les quatre risques que chaque option doit chiffrer.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt passe de 22 à **86 sur 100, score mesuré** par 2 relecteurs aveugles à la passe 1 ; on
retient le plus bas des deux. La passe 2 a été notée 74 : elle régresse, elle est rejetée, et c'est
la passe 1 qui est livrée. Elle porte 10 défauts majeurs connus, listés plus bas avec leur
correction : le prompt n'est pas fini.

**Comment lire la table des passes.** Une ligne par passe, dans l'ordre. Le score mesuré est le
plus bas des 2 relecteurs ; « majeurs retenus » compte les défauts graves qui tiennent au
recompte ; « écartés » ceux que le recompte a démentis. Journal jugé PASS par
`oracle-boucle-l99.mjs` : `Digit-AI - Revue - Prompt suivi des temps et couts des produits passe au crible L99 - 20261104c.md.boucle.json`.

| Passe | Relecteurs A / B | Score mesuré | Bloquants | Majeurs retenus | Écartés | Mots | Décision |
|---|---|---|---|---|---|---|---|
| 1 | 86 / 88 | 86 | 0 | 5 | 0 | 1 448 | continuer |
| 2 | 84 / 74 | 74 | 0 | 5 | 0 | 1 989 | rejetée, régression |
| 3 | 84 / 84 | 84 | 0 | 4 | 0 | 2 057 | rejetée, régression |

**La passe 3, demandée par le porteur le 05/11/2026** (« A2 puis A1 »). Elle repart de la passe 1
et y applique les 10 corrections ci-dessous. Le vérificateur de clôture en a jugé 9 fermées sur
10 ; il a relevé 1 défaut créé, corrigé avant la relecture : `--projet <pseudonyme>`, exécuté tel
quel, filtre 0 dossier. Les 2 relecteurs l'ont notée 84 : sous les 86 de la passe 1, elle est
rejetée, et la passe 1 reste le prompt livré par la revue. Ses 4 majeurs, recomptés à la source,
sont neufs :
- aucune correspondance entre le contrat et les sections du gabarit ;
- aucun ordre de sacrifice ;
- les sections du gabarit absentes du contrat ;
- aucun repli si la page de rétention est illisible.

L'étude a été lancée sur la passe 3 corrigée de ces 4 majeurs, sans relecture aveugle de ces
corrections : c'est la seule version qui porte les 10 corrections demandées. Livrable :
`Digit-AI - Étude - Suivi des temps et des couts par produit - 20261105a.md`, dans ce dossier.

**Pourquoi la passe 2 a régressé.** Avant la relecture, un vérificateur neuf, qui ne notait pas, a
jugé fermés les 7 défauts visés. Il a relevé 2 défauts créés, corrigés avant la relecture : la
seconde méthode de décompte ne rendait pas les 4 catégories de jetons, et l'option `--projet` de
`relever-flotte.mjs` attend un fragment de nom réel. Mais 2 des 5 majeurs trouvés ensuite viennent
des corrections elles-mêmes : un plafond de 3 500 mots incompatible avec le gabarit d'étude, et des
preuves sorties de l'étude, que le porteur n'aurait plus pu juger. Ces deux corrections sont donc
écartées de la liste ci-dessous.

**Les 10 majeurs ouverts, et la correction proposée sans mesure.** Les 5 premiers viennent des
relecteurs de la passe 1, les 2 suivants de l'inventaire du Ch3 (le prompt de la passe 1 ne les
ferme pas), les 3 derniers des relecteurs de la passe 2, parce qu'ils touchent aussi la passe 1.
Les corrections 1 à 4 ont été jugées fermées par le vérificateur ; aucune n'a été relue à l'aveugle
dans la forme ci-dessous.

1. *Commandes de E1.* Remplacer la commande par 4 commandes filtrées : nombre de journaux, comptes
   des 4 types d'événements, recherche de la clé JSON de jetons, recherche de `duree_s`.
2. *Seuil d'inactivité.* Le calculer sur les transcriptions principales de la fenêtre, des 2
   profils ; seuil au 95e centile des écarts, temps recalculé aux 90e et 99e centiles. Pas de
   « rupture visible », que la passe 2 a jugée non opérante.
3. *Décomptes de jetons.* Deux décomptes écrits séparément, chacun sur les 4 catégories ; contrôle
   croisé des sous-agents contre les champs `jetons_sortie_sous_agents` et
   `jetons_relus_sous_agents` de `relever-flotte.mjs`, qui ne compte pas les sessions
   principales ; le motif de `--projet` remplacé par `<pseudonyme>` dans toute commande citée.
4. *Prix introuvable.* Un modèle sans prix vérifié a un coût (b) « non calculable », sorti du total.
5. *Résumé et run de preuve.* Un résumé de décision de 5 lignes après l'intention, sans plafond de
   mots ; run de preuve choisi avec au moins 3 sessions, un sous-agent et une étape clôturée.
6. *Usages des chiffres* (M10). Nommer les usages (piloter la Factory, chiffrer une mission,
   montrer son coût à un client) et la granularité que chacun exige.
7. *Temps parallèle* (M12). Le temps agent est la somme des durées actives ; le délai couvre leur
   union.
8. *Unité du coût de construction.* L'oracle d'étude refuse un effort chiffré en jours (sa règle
   E8) : exiger la complexité (simple, moyen, complexe), les fichiers touchés et les secondes
   ajoutées à chaque ouverture et à chaque tour.
9. *État de l'art.* Le gabarit exige au moins 5 sources datées ou la mention « état de l'art : non
   instruit » avec son motif : le dire dans le prompt.
10. *Priorité et repli.* L'étude d'abord, les preuves ensuite ; une preuve non tenue se déclare
    « non réalisée » avec sa cause, sans bloquer le livrable.

**Les écarts avec le texte mesuré.** Le prompt ci-dessous est celui de la passe 1, à 4 retouches
près. Le paragraphe de démonstration et la ligne 9 du contrat suivent la décision D-173 (b) du
05/11/2026 : l'étude montre une ligne de résultat par preuve, et les calculs vont dans la
restitution du run. Ces 2 passages n'ont pas été relus à l'aveugle. Un titre-annonce
refusé par `oracle-ecriture.mjs` devient « Définitions à poser avant de mesurer », et « cinq » passe
en chiffres. Un `diff` prouve que le prompt inclus ici est identique à la copie livrée.

### Diagnostic en 3 lignes

- Force : l'intention est nette. Cinq grandeurs, deux demandes ordonnées, et la bonne intuition
  que la Factory trace déjà une partie.
- Faiblesses bloquantes : le coût n'est pas défini alors que la Factory tourne sur l'abonnement,
  et le prompt suppose disponible un historique que la purge des transcriptions a effacé.
- Faiblesses majeures : ni définition de la charge, ni unité de suivi, ni règle d'attribution,
  ni frontière avec l'autonomie des produits, ni livrable.

### Pourquoi le mode boucle a été ouvert

Le prompt réécrit lance un run de conseil qui écrit une étude et une candidature au registre, et
l'analyse a relevé 2 défauts bloquants : ce sont 2 des 3 cas d'ouverture d'office (TF-2022,
autorisation humaine du 29/10/2026). Chaque passe a donc été notée par 2 relecteurs aveugles.

### Prompt réécrit

Le prompt de la passe 1 est reproduit ci-dessous, prêt à coller dans une session ouverte au pilot.
Appliquer d'abord les 10 corrections ci-dessus est l'action A-2 de la restitution.

# Étude d'opportunité : suivre temps, délais, charges, jetons et coûts de chaque produit

Session à ouvrir au pilot `c:\dev\digit-ai-factory` (run de conseil, `references\RUN-CONSEIL.md`).
Lecteur de l'étude : le porteur de la Factory, qui décidera quoi construire. Il n'a pas vu ce travail.

## Intention du demandeur (à citer telle quelle dans l'étude)

> Je cherche à tracer le temps, délai et charges, + tokens utilisés & coûts, des différents
> produits construits, déployés et/ou remédiés. La Factory trace déjà une partie des différentes
> informations. Identifie ce qu'il est nécessaire de rajouter pour avoir un suivi fin de chaque
> projet puis des éléments à rajouter dans la Factory pour rajouter et suivre ces informations
> finement dans chaque projet.

L'étude rend deux choses, dans cet ordre : (1) ce qui manque pour suivre finement chaque projet ;
(2) ce qu'il faut ajouter à la Factory pour que chaque projet produise et suive ces informations.
Elle ne construit rien.

## ÉTAPE 0 — remesurer l'existant avant d'écrire une ligne

Les valeurs ci-dessous ont été relevées le 04/11/2026 vers 16:55, sur le poste Dell-XPS-16. Rejoue
chaque commande (Git Bash, depuis `c:\dev`) et écris la valeur remesurée avec ta date : elle fait
foi, la valeur ci-dessous n'est rappelée qu'en cas d'écart. Une source introuvable se dit
introuvable, elle ne se remplace pas.

| # | Existant | Où | Valeur relevée le 04/11/2026 | Commande |
|---|---|---|---|---|
| E1 | Journal de run des produits | `c:\dev\*\forge\ledger.jsonl` | 11 journaux ; `run_open` 12, `run_close` 9, `etape_open` 26, `etape_close` 64 ; 0 champ de jetons, 1 champ `duree_s` | `cat */forge/ledger.jsonl \| grep -o '"type":"[a-z_]*"' \| sort \| uniq -c` |
| E2 | Relevé de la flotte d'agents | `scripts\relever-flotte.mjs` du pilot | jetons, modèle et effort servis par sous-agent, rangés par campagne (`--etiquette`), pas par produit | lire l'en-tête du script |
| E3 | Transcriptions de Claude Code | `~\.claude\projects\<dossier du répertoire de travail>\*.jsonl` et `~\.claude-b\projects\…` | 1 055 et 260 fichiers ; plus anciens du 2026-10-02 et du 2026-09-25 ; chaque réponse porte `usage` (`input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`), `timestamp`, `model`, `cwd`, `sessionId` ; aucun coût en dollars | `find ~/.claude/projects -name '*.jsonl' -printf '%TY-%Tm-%Td\n' \| sort \| head -1` |
| E4 | Réglage de rétention des transcriptions | `~\.claude\settings.json`, `~\.claude-b\settings.json` | `cleanupPeriodDays` absent des deux profils | `grep cleanupPeriodDays ~/.claude*/settings.json` |
| E5 | Avancement des process longs | `<run>\avancement.jsonl` (`CONTRAT-INTERFACE.md` §4 ter) | 7 fichiers chez les produits | `ls */forge/avancement.jsonl */avancement.jsonl \| wc -l` |
| E6 | Jetons des relectures d'intention | `todo\relectures-intention.jsonl` du pilot | jetons par relecture et par jour | lire le fichier |
| E7 | Mode de facturation | `references\JETON-ABONNEMENT.md`, mémoire « claude -p sur l'abonnement » | abonnement : `apiKeySource` vaut `none`, aucun prix au jeton facturé ; aucune table de prix dans `references\MODELES-EN-SERVICE.json` | `grep -ci prix references/MODELES-EN-SERVICE.json` |
| E8 | Voie de descente chez les produits | `gabarits\hooks-factory.mjs`, `HERITAGE.json`, `references\RUN-VERSION.md` | le pilot n'écrit jamais chez un produit hors run demandé | lire `CLAUDE.md`, garde-fou « Produits autonomes » |

Deux faits en découlent, à vérifier puis à traiter dans l'étude. Les journaux de produits commencent
le 2026-08-05, mais les transcriptions les plus anciennes datent du 2026-09-25 : les jetons des runs
antérieurs semblent perdus. Vérifie dans la documentation de Claude Code la rétention par défaut des
transcriptions, cite la page et sa date de lecture. Le poste DESKTOP-ULTRA7 porte ses propres
transcriptions, invisibles depuis celui-ci : dis ce que l'étude ne voit pas.

## Définitions à poser avant de mesurer

Chaque mesure reçoit une définition, une formule et sa source (E1 à E8 ou une source nouvelle nommée).

1. **Temps** : durée active de travail des sessions et des agents. Pose un seuil d'inactivité au-delà
   duquel un écart entre deux messages ne compte pas, et justifie-le par la distribution mesurée des
   écarts.
2. **Délai** : durée calendaire entre deux jalons du journal (`run_open`, `etape_open`,
   `etape_close`, GO de MEP, `run_close`). Dis quoi faire d'une étape ouverte sans clôture.
3. **Charge** : le prompt ne la définit pas. Propose au plus 3 lectures (temps humain, temps agent,
   nombre d'interventions humaines lues dans `question_humain` et `reponse_humain`), recommande-en une
   et pose le choix au porteur. Aucun taux journalier ni montant de main-d'œuvre n'est inventé.
4. **Jetons** : par catégorie (entrée, création de cache, lecture de cache, sortie), par modèle,
   sous-agents compris et comptés une seule fois.
5. **Coût** : distingue (a) ce qui est réellement payé (abonnement), (b) l'équivalent au tarif public
   de l'API, (c) les coûts d'hébergement du déploiement s'ils existent. Pour (b), une table de prix
   datée et sourcée, lue en ligne le jour de l'étude ; un prix non relu se marque « non vérifié ».
   Un prix est une donnée volatile : il vit dans un référentiel daté, jamais dans du code (loi n° 4).

## Les cinq questions que l'étude tranche

1. **Unité et granularité.** Le suivi porte sur le produit, le run (construction, run de version,
   remédiation), l'étape et la session. Quelle granularité est « fine » sans coûter plus qu'elle
   n'apprend ?
2. **Attribution.** Comment une session ou un sous-agent est rattaché à un produit, un run et une
   étape : session ouverte chez le produit, session du pilot qui travaille pour un produit, agent
   d'une forge, dossier temporaire. Teste la règle sur au moins 3 sessions réelles, dont une du pilot.
3. **Couverture.** Pour chaque mesure, quelle part des 11 journaux et des transcriptions permet de la
   calculer aujourd'hui, chiffrée.
4. **Conservation.** Comment ne plus perdre les jetons à la purge des transcriptions : relevé au fil
   de l'eau, à la fin de chaque session ou de chaque étape, écrit chez le produit. Les runs déjà hors
   fenêtre sont listés, jamais reconstruits par estimation.
5. **Ajouts à la Factory.** Quoi (script, champ de journal, hook, vue), où (pilot, forge-data qui porte
   la restitution, forge-observability qui veille entre runs), et comment chaque produit le reçoit
   par l'héritage ou un run de version (E8). Un hook ajouté à l'ouverture tient sous 45 secondes.

## Comment construire et comparer les options

Pose O0, le statu quo chiffré par les mesures de l'ÉTAPE 0, puis au moins deux options. Chaque option
dit son coût de construction, la couverture qu'elle atteint par mesure, et comment elle évite quatre
risques : un nom réel de produit dans un dépôt public, un double comptage (sous-agents, cache), un prix
périmé, un hook qui ralentit l'ouverture. Recommande une option.

## Garde-fous

- Étude seulement : aucun script, hook ni champ n'est construit. La recommandation entre au registre
  par `node todo\journaliser.mjs`, au statut `candidat` ; le porteur décide.
- Lecture seule chez les produits : aucun fichier n'y est écrit.
- Le pilot est public. Aucun nom réel de produit ou de client n'y entre : les dossiers de transcription
  encodent des noms réels, désigne chaque produit par son pseudonyme (`references\PRODUITS.md`).
- Aucune API payante. Chaque chiffre de l'étude sort d'une commande citée.

## Livrable

`output\03-etudes\Digit-AI - Étude - Suivi des temps et des couts par produit - 20261104<indice>.md`,
selon R-4 (le projet ouvre le nom) et R-25 (le type « Étude » est le premier mot du deuxième segment,
pris au registre des types de forge-organization). L'indice est le premier libre du jour dans le dossier
(`scripts\allouer-indice.mjs`). Gabarit : `gabarits\ETUDE-OPPORTUNITE.md`.

L'étude porte une preuve sur un run réel d'un produit, dans la fenêtre de conservation, sous
pseudonyme. Elle n'en montre qu'une ligne de résultat par preuve : le seuil d'inactivité retenu,
l'écart entre les deux décomptes de jetons du run, et le verdict de la règle d'attribution. Les
calculs vont dans la restitution de fin de run (`gabarits\RESTITUTION.md`).

## Contrat de sortie

1. Le tableau E1 à E8 remesuré, chaque ligne avec sa commande, sa valeur et sa date.
2. Les cinq définitions, chacune avec sa formule et sa source.
3. Une matrice mesure × source avec la couverture chiffrée.
4. La règle d'attribution et son test sur 3 sessions réelles nommées par leur `sessionId`.
5. La table de prix datée et sourcée, ou chaque prix marqué « non vérifié ».
6. La date du plus ancien relevé possible et la liste des runs hors fenêtre, sous pseudonyme.
7. O0 et au moins deux options, chacune avec coût, couverture et les quatre risques.
8. Une recommandation et son identifiant de candidat au registre.
9. Les 3 lignes de résultat de la preuve dans l'étude ; dans la restitution du run, les calculs, dont
   le total de jetons recompté par une seconde méthode, écart d'au plus 1 %.
10. Aucun nom réel de produit ni de client dans le fichier.

## Protocole de tests du livrable

- T1 : `node oracles\oracle-ecriture.mjs <étude>` rend PASS.
- T2 : la conformité au gabarit d'étude (oracle cité par `gabarits\ETUDE-OPPORTUNITE.md`) rend PASS.
- T3 : la porte de publication du pilot (hook pre-commit) accepte le fichier.
- T4 : chaque ligne du contrat est cochée avec la sortie de la commande qui la prouve.

Boucle : générer, tester T1 à T4, corriger ; 3 itérations au plus. Après 3, livre avec la liste des
écarts restants.

### Contrat de sortie

Le contrat est embarqué dans le prompt, section « Contrat de sortie » : 10 lignes vérifiables, du
tableau de l'existant remesuré à l'absence de nom réel. La ligne 9 suit la décision D-173 (b) du
05/11/2026 : 3 lignes de résultat dans l'étude, les calculs dans la restitution du run.

### Protocole de tests du livrable

Le livrable est un document texte. Le protocole est embarqué dans le prompt : `oracle-ecriture.mjs`,
`oracle-etude-opportunite.mjs`, la porte de publication du pilot, puis chaque ligne du contrat
cochée avec la commande qui la prouve. Boucle bornée à 3 itérations ; après 3, livraison avec la
liste des écarts restants.

### Changelog

**Comment lire.** Chaque modification du prompt de la passe 1 renvoie au défaut de l'inventaire
(Ch3) ou à la cause d'échec (Ch5) qu'elle ferme. Les défauts que la passe 1 ne ferme pas figurent
en fin de table, avec le numéro de leur correction proposée.

| Modification | Défaut fermé |
|---|---|
| Section « Ce que l'étude définit » : coût en 3 parts (payé, équivalent au tarif public, hébergement), table de prix datée et lue en ligne | B1, Ch5 #1 |
| Note sur la rétention de l'ÉTAPE 0, question 4 « Conservation » : runs hors fenêtre listés, jamais reconstruits | B2 |
| Charge : 3 lectures au plus, choix posé au porteur, aucun taux inventé | M1 |
| Temps actif avec seuil d'inactivité, délai calendaire entre jalons du journal | M2 |
| Question 1 : unité et granularité | M3 |
| ÉTAPE 0 : 8 existants mesurés avec leurs commandes, remesurés à l'exécution | M4, Ch5 #2 |
| Question 2 : attribution testée sur 3 sessions réelles ; sous-agents comptés une fois | M5, Ch5 #3 |
| Question 5 et existant E8 : descente par l'héritage ou un run de version ; garde-fou de lecture seule | M6 |
| Garde-fou : pseudonymes de `references\PRODUITS.md` ; ligne 10 du contrat | M7, Ch5 #4 |
| Livrable nommé selon R-4 et R-25, gabarit, contrat, protocole de tests ; étude sans construction | M8 |
| Note sur le second poste et ce que l'étude ne voit pas | M9 |
| Question 5 : hook sous 45 secondes à l'ouverture | M11 en partie, Ch5 #5 ; le coût par tour reste ouvert, correction 8 |
| Catégories de jetons | m1 |
| Ouvert : usages des chiffres | M10, correction 6 |
| Ouvert : somme et union des durées | M12, correction 7 |

### Écarts à la lettre

**Comment lire.** Une ligne par endroit où le prompt réécrit s'écarte de votre texte ; la
catégorie dit comment l'écart se valide. Les manières d'exécuter se valident avec le prompt ; le
contenu visible ajouté se décide à part.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « coûts » | trois coûts distincts : payé (abonnement), équivalent au tarif public, hébergement | sous abonnement, aucun coût n'existe au jeton (Ch4, P3) | manière d'exécuter |
| « charges » | l'étude propose 3 lectures au plus et vous laisse choisir | le mot a 3 sens, et le choix vous revient | manière d'exécuter |
| « des différents produits construits » | les runs sortis de la fenêtre de conservation sont listés, pas reconstruits | leurs jetons sont purgés (Ch4, P4) | manière d'exécuter |
| « rajouter … dans chaque projet » | l'étude dit comment chaque produit reçoit l'ajout, par l'héritage ou un run de version ; elle n'écrit chez aucun | le pilot n'écrit pas chez un produit hors run demandé | manière d'exécuter |
| « Identifie … puis des éléments à rajouter » | une étude qui compare des options et en recommande une, et une candidature au registre ; vous décidez | l'arbitrage vous revient (R-58) | manière d'exécuter |
| (rien sur une démonstration) | une ligne de résultat par preuve dans l'étude, les calculs dans la restitution du run | une définition qui ne se calcule pas ne vaut rien | contenu visible ajouté : décidé par D-173 (b) le 05/11/2026 |
