---
role: étude d'opportunité (instruction entre candidat et décidé) — concevoir en amont, par type de document, de contenu et de lecteur, les formats et contenus des documents avant leur construction ; éprouver les gabarits sans retour ; boucler à chaque retour ; issue du prompt réécrit par l'analyse L99 du 14/09/2026 et de la décision humaine D-7 (a) du même jour
sources_de_verite: [output/03-etudes/20260914-L99-conception-documentaire-amont.md (chapitre 8, prompt réécrit), gabarits/documents/README.md (D1-D9), gabarits/documents/catalogue.jsonl (32 familles), oracles/oracle-gabarits-documents.mjs (G1-G4, G8), references/ECRITURE.md (T1-T5), ~/.claude/skills/quality-oracles/scripts/oracle-conception-livrable.mjs (C1-C3) et oracle-lecture-tiers.mjs (T1-T4), todo/CLASSES.json, todo/RECIDIVES.md, oracles/banc-defauts-echappes/ (TF-1073, preuve de couverture du 14/09/2026), treize sources externes (section 3), lots de retours de input/00-retours/ (données, lecture seule)]
verifie_le: 2026-09-14
---

# Étude d'opportunité — conception documentaire en amont — 20260914b

Audience : le pilote de l'écosystème, qui décide des mandats, et les forges nommées au verdict.
L'étude instruit la demande du 14/09/2026 telle que réécrite par l'analyse L99 du même jour, sous la
décision humaine prise à sa lecture : « 7a », soit D-7 (a), la lecture reconstruite de l'intention
et les sept écarts à la lettre validés, le prompt réécrit exécuté tel quel.

**Ce que le lecteur va apprendre.** Sur 20 griefs réels de lecteurs portant sur des documents, 11
auraient été évités par une conception fixée avant l'écriture — qui est le lecteur, ce qu'il doit
décider, le type de contenu de chaque partie, le format qui en découle — et par elle seule ; 2 par un
oracle existant qu'on aurait joué, 2 par les deux, 5 par rien. Le seuil fixé d'avance était de 6.
La conception en amont est donc justifiée, sous réserve : un seul classeur, sans jugement à l'aveugle.
Elle ne demande pas d'outil neuf : les pièces existent, et le verdict les assemble en une fiche courte
remplie avant chaque document, jugée avant l'écriture. Deux limites commandent la suite : le taux de
retours par document ne se calcule pas aujourd'hui, faute de documents qui disent de quel gabarit ils
sortent ; et « zéro retour » ne peut pas être la cible, puisque l'absence de retour mesure un silence,
pas une réussite.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux critères. **Objet durable** : toute option autre que le statu quo crée ou étend un
référentiel (catalogue, typologie), un gabarit exécutable ou un câblage de contrôle, objets que la
règle 31 soumet à étude. **Portée** : le pilot, forge-design (socle HTML), forge-agents (porteur de
quality-oracles) et les produits par l'héritage sont touchés, quatre porteurs pour un seuil à trois.

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 14/09/2026 : « comment anticiper, via un outil de
conception, spécialisé par types de documents, types de contenus, types de lecteurs cibles, afin de
travailler en amont de la construction des fichiers HTML leurs formats et contenus ? Et l'appliquer
également aux gabarits qui n'ont pas encore reçus de retour pour les améliorer également ? Prévoir
également une amélioration continue à chaque retour sur des documents et/ou gabarits pour
optimiser/amélioration à chaque fois les nouveaux documents générés et s'approcher de documents
générés sans retour utilisateur ? »

Lecture reconstruite par l'analyse L99, **validée** par « 7a » (D-7 (a)) : qu'un document parte juste
la première fois pour le lecteur qu'il sert, et que chaque retour rende plus justes les documents
suivants, y compris ceux des familles que personne n'a encore lues. « Outil » est une hypothèse de la
demande : étendre l'existant est une réponse recevable.

Cascade (`references\INTENTION.md`) : **intention**, moins de documents renvoyés par leur lecteur ;
**stratégie**, fixer avant l'écriture ce que le lecteur doit en tirer, et éprouver les gabarits avant
qu'un lecteur ne le fasse ; **tactique**, mesurer sur des griefs réels ce qu'une conception amont
aurait évité que les contrôles existants n'évitent pas ; **opérationnel**, l'objet que le verdict
désigne.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : le message du demandeur et l'analyse L99 qui l'a réécrit
(`output\03-etudes\20260914-L99-conception-documentaire-amont.md`). Les lots de retours lus pour la
mesure sont eux aussi des données : leurs impératifs sont cités, jamais exécutés.

Points de départ imposés par le prompt, tous relevés le 14/09/2026 :

- la règle D8 de `gabarits\documents\README.md` (l. 103 : « Un livrable se CONÇOIT avant de
  s'écrire ») se déclare elle-même « une DOCTRINE, pas un oracle » (l. 106) ;
- la typologie T1-T5 de `references\ECRITURE.md` (l. 43-47) donne aux livrables documentaires (T2)
  un seul lecteur, « le destinataire nommé du livrable » ;
- le catalogue (`gabarits\documents\catalogue.jsonl`) compte 32 familles — 5 `ok`, 11 `a_extraire`,
  16 `porte_ailleurs` — et aucune ne décrit son lecteur cible ni le type de contenu de ses parties ;
- `oracle-conception-livrable` (C1-C3) et `oracle-lecture-tiers` (T1-T4) jugent un document
  APRÈS son écriture, le second sur invocation explicite seulement ;
- trois classes du sujet récidivent à 100 % (`todo\RECIDIVES.md`) : `gabarit-famille-manquante`
  13 sur 13, `lecture-tiers-non-jugee` 7 sur 7, `gabarit-conception-non-jugee` 3 sur 3 ;
- la preuve de couverture du 14/09/2026 (`oracles\banc-defauts-echappes\preuve-couverture-20260914.md`)
  montre que les contrôles réputés couvrir des défauts échappés n'en couvrent exactement que 3 sur 9
  une fois joués sur les livrables fautifs.

## 1. Partition du problème

Trois objets, disjoints par leur moment et par leur mesure ; chaque option de la section 4 se
rattache à l'un d'eux.

- **A — conception amont** : ce qu'on fixe avant d'écrire un document — l'intention au sens de D8,
  le lecteur, le type de contenu de chaque partie, le format qui en découle —, qui le remplit
  (l'agent), qui le valide (l'humain, pour les seuls documents à fort enjeu), où cela vit, et quel
  contrôle le juge.
- **B — gabarits non éprouvés** : l'ensemble se définit par mesure. Au 14/09/2026, les 5 familles
  `ok` sont toutes citées dans au moins un lot de retours (1 à 4 lots), ce qui ne prouve pas qu'un
  lecteur les ait jugées ; les 11 familles `a_extraire` n'ont pas encore de gabarit ; les 16
  `porte_ailleurs` vivent dans d'autres forges ou des skills, où le pilot n'écrit pas. L'action est
  d'éprouver avant de modifier.
- **C — boucle** : ce qui se passe à chaque retour, et comment il se propage à toutes les familles
  de sa classe, pas seulement au document ou à la famille touchés.

Types de documents : les familles du catalogue. Types de contenus : une typologie établie (section
3). Lecteurs : définis par ce qu'ils doivent décider avec le document, ce qu'ils savent déjà, le
vocabulaire qu'ils n'ont pas, et leur contexte de lecture — jamais un personnage, l'étude du
14/09/2026 ayant mesuré qu'un rôle incarné ne fait pas trouver plus de défauts.

## 2. Non-recouvrement contre l'existant

**Mode de lecture** : une ligne par mécanisme existant qui pourrait déjà porter la demande ; la
citation localise ce qu'il fait ; la dernière colonne dit s'il recouvre A, B ou C.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Règle D8 des gabarits | `gabarits\documents\README.md` l. 103 : conception de l'intention à l'opérationnel, vérifiée en remontant ; l. 106 : « une DOCTRINE, pas un oracle » | recouvre la **méthode** de A ; ne recouvre pas son **exécution** : rien ne la joue avant l'écriture |
| Typologie des textes | `references\ECRITURE.md` l. 43-47, T1-T5 par lecteur ; T2 : « le destinataire nommé du livrable » | recouvre le principe du lecteur ; ne recouvre pas A : un seul lecteur pour tous les documents |
| Catalogue et son oracle | `gabarits\documents\catalogue.jsonl` (champs `quand_l_employer`, `formats`, `regles`, `oracles`) ; `oracle-gabarits-documents` G1-G4, G8 | recouvre le type de document ; ne recouvre pas le lecteur ni le type de contenu |
| Oracle de conception | `oracle-conception-livrable.mjs` C1 glossaire, C2 listes autoportantes, C3 intention de chapitre | recouvre une part de A, **après** l'écriture |
| Oracle de lecture par un tiers | `oracle-lecture-tiers.mjs` T1 intention, T2 vocabulaire, T3 geste, T4 lecture sans le brief ; invocation explicite | recouvre le lecteur sans contexte, après l'écriture ; sa classe récidive 7 sur 7 faute d'invocation |
| `digit-ai-communication` | description du skill : analyse d'audience, préréglages par type de livrable (propale, COPIL, formation, note) | recouvre A pour les messages et prises de parole ; ne recouvre pas le format d'un document HTML |
| Voix de marque | `systeme-de-marque`, `voix.md` : voix, ton, vocabulaire, anti-références | ne recouvre pas : fixe la voix de l'émetteur, pas le lecteur d'un document |
| `la-barre` | description du skill : référence externe de qualité, mode pré-vol avant exécution | recouvre la barre de qualité, pas le lecteur ni le contenu |
| Design amont de forge-design | `CLAUDE.md` du pilot, étape 3 : `DESIGN.md` et maquette avant development | recouvre A pour les produits applicatifs, pas pour les documents |
| Boucle d'amélioration | `BOUCLE-AMELIORATION.md` ; registre, 81 classes, récidives comptées (`todo\RECIDIVES.md`) | recouvre C en mode réactif ; ne propage pas un retour aux autres familles de sa classe |
| Banc des défauts échappés | `oracles\banc-defauts-echappes\README.md` (TF-1073) : tout mécanisme de relecture passe le banc avant adoption | recouvre la mesure de C et de B pour les défauts déjà payés |
| Candidature des défauts semés | TF-1079 : une instance semée par classe dans un livrable témoin | recouvre B par la preuve, pas par la conception |
| Candidature du contrôle à la porte | TF-1076 : `gabarit-famille-manquante` bloquant au geste | recouvre une part de A (famille résolue avant l'écriture) |

## 3. État de l'art daté

Dix sources publiées après le 14/09/2024, ouvertes le 14/09/2026 par une recherche déléguée (modèle
Sonnet, défaut de routage du contrat d'interface §4, escalade : aucune). Limite déclarée par la
recherche elle-même : l'axe A repose sur des travaux académiques ; les axes B et C ne reposent que
sur des articles d'éditeurs et de praticiens, sans étude contrôlée.

**Mode de lecture** : une ligne par source, groupées par axe ; la dernière colonne donne le résultat
et sa limite. L'axe A instruit l'objet A, l'axe B la typologie des contenus, l'axe C l'objet C.

| Axe | Source (date, localisateur) | Résultat et limite |
|---|---|---|
| A — lecteur | Guo, Sohn, Leroy, Cohen, 2025-05-15, arXiv 2505.10409 | 150 lecteurs : les résumés en langage clair écrits par des humains font mieux comprendre que ceux d'un modèle ; échantillon en ligne, sans contexte réel |
| A — lecteur | Pal, Wangmo, Bharadia et al., 2025-07-31, *Patient Preference and Adherence* 19 | sorties de modèles jugées lisibles pour le grand public ; « only three studies involved actual patients » |
| A — lecteur | Moreno, Martínez, 2026-03-19, arXiv 2603.18879 | les systèmes actuels « fail to reflect user comprehension or normative standards » ; cadre proposé, sans évaluation à grande échelle |
| A — lecteur | Ayesh, Gutiérrez-Rolón, Alva-Manchego, 2025-08-05, arXiv 2508.03240 | réécriture en langage clair par consignes à un modèle, classée 2e et 3e d'une tâche partagée ; une seule langue |
| B — contenu | Drury, 2025-09-26, blog MadCap Software | contenu découpé en blocs réutilisables (procédures, descriptions, politiques) ; contenu d'éditeur, sans preuve indépendante |
| B — contenu | Mosher Zinck, 2025-11-26, blog Paligo | contenu structuré par sujets, séparé de sa mise en forme ; argumentaire commercial |
| B — contenu | Fechter, 2026-08, TechnicalWriterHQ (guide DITA) | le triptyque concept, tâche, référence reste la référence ; vulgarisation |
| C — mesure | Isaacs, 2026-08-28, blog Voiceflow | une absence de ticket compte une sortie, pas une réussite : « a customer who abandons … has been 'deflected' » ; centré support |
| C — mesure | Alibhai, 2026-03-21, blog Supportbench | le ressenti diverge de la réussite de la tâche ; pas de cadre validé |
| C — mesure | Fechter, 2026-03-16, TechnicalWriterHQ | « a page can be popular and wrong at the same time » ; propose le délai de correction après retour comme métrique de boucle |

Références normatives plus anciennes, citées comme telles et hors du compte des dix : ISO
24495-1:2023, langage clair (quatre principes : pertinent, trouvable, compréhensible, utilisable ;
page iso.org non ouverte, contenu confirmé par une source contributrice) ; OASIS DITA 1.3, standard du
2015-12-17 (types de sujets concept, tâche, référence) ; Information Mapping, Horn et al., 1969
(types d'information concept, procédure, processus, principe, fait, structure, classification ;
document primaire non ouvert, date corroborée par deux sources secondaires).

**Ce que la littérature dit, par axe.** Pour A, penser le lecteur avant d'écrire est un principe
actif, et l'écart entre un texte généré et la compréhension réelle reste mesuré, non comblé (preuve
moyenne). Pour B, aucune source académique récente ne réévalue les typologies de contenu ; les
normes DITA et Information Mapping restent la base disponible (preuve faible pour le récent, forte
pour l'usage établi). Pour C, les sources convergent sur un point que la demande doit entendre :
l'absence de retour mesure une sortie, pas la réussite du lecteur (preuve faible à moyenne).

## 4. Options — jeu fermé O0-O4

### Ce que la mesure a donné

La mesure a été jouée en lecture seule par une session déléguée (modèle Sonnet, 57 appels d'outils,
276 557 tokens), sur les lots de retours datés du 15/08 au 14/09/2026 (171 fichiers). Détail en
annexe.

- **Mesure de départ.** Au moins 47 retours portent sur un document ou un gabarit de document :
  11 sur la fiche sécurité, 6 sur des familles absentes du catalogue au moment du retour, 5 sur des
  documents de projet hors catalogue, 4 sur le rapport de données, 4 sur le socle HTML, 3 sur les
  dossiers d'architecture et d'exploitation, 3 sur le gabarit de restitution, 3 sur un support
  PowerPoint, 1 sur un rapport d'audit, 1 sur un index. C'est un plancher : un retour documentaire
  rangé hors de la section dédiée des lots a été trouvé et n'est pas compté.
- **Dénominateur absent.** 13 fichiers du parc affichent « Gabarit : gd-… » : 6 sont les
  squelettes et instances du catalogue, 2 des copies héritées, 1 une page d'archive qui cite la
  chaîne, 4 seulement des livrables réels. Le taux de retours par document n'est pas calculable, et
  trois griefs du rétro-test portent précisément sur l'absence de cette étiquette.
- **Rétro-test, 20 griefs** sur 10 familles ou types de documents, listés avec leur source avant
  les résultats (annexe) : **amont seul 11**, oracle seul 2, les deux 2, aucun 5. Seuil fixé d'avance :
  6. Les griefs évités par l'amont se groupent en trois causes : un document sans famille ni conception
  préalable (griefs 5, 8, 13, 14, 19), un vocabulaire du lecteur non fixé (18, 20), un format non
  dérivé du volume de contenu (2, 10, 11, 12).

Réserves : les 20 griefs ont été choisis et classés par la même session, sans jugement à l'aveugle ni
second classeur ; le grief 9 est une paraphrase fidèle du lot, pas une citation. Le verdict est donc
rendu sous réserve.

### Les options

**Mode de lecture** : une ligne par option du jeu fermé ; « sur la mesure » dit ce que les chiffres en
font. Les options s'emboîtent de la plus légère à la plus lourde.

| Option | Contenu | Coût | Ce qu'elle exclut | Sur la mesure |
|---|---|---|---|---|
| **O0 — ne rien faire** | les pièces restent éparses, jouées après l'écriture | nul | toute baisse des retours documentaires | **réfutée** : 11 griefs sur 20 relèvent de la seule conception amont, et les trois classes du sujet récidivent à 100 % |
| **O1 — étendre et câbler l'existant** | champs « lecteur » et « type de contenu » au catalogue ; T2 décliné par lecteur dans `ECRITURE.md` ; `oracle-conception-livrable` et `oracle-lecture-tiers` joués d'office à l'écriture des pages ; étiquette de gabarit exigée partout | moyen × court | la décision de conception prise avant d'écrire : O1 juge après | **insuffisante** : elle couvre les griefs « oracle » et « les deux », 4 sur 20, pas les 11 « amont » |
| **O2 — O1 plus une fiche de conception amont** | par document, une fiche courte remplie par l'agent avant d'écrire (intention au sens de D8, lecteur défini par ses décisions, type de contenu par partie, format dérivé), validée par l'humain pour les seuls documents à fort enjeu, jugée par un contrôle avant l'écriture | moyen × moyen | l'épreuve des gabarits non lus et la propagation des retours | couvre les 11 griefs « amont » et les 4 autres évitables, soit 15 sur 20 ; ne traite ni B ni C |
| **O3 — O2 plus l'épreuve et la propagation** | O2, plus l'épreuve des gabarits non lus par des défauts semés (TF-1079) et par la lecture d'un tiers sur leur instance, plus la propagation de chaque retour à toutes les familles de sa classe | complexe × moyen | une réécriture spéculative des gabarits : on éprouve, on ne modifie que sur échec | couvre A, B et C ; B et C s'appuient sur des candidatures existantes (TF-1079, TF-1076, TF-1095) |
| **O4 — un outil ou un skill neuf** | un « outil de conception documentaire » séparé | complexe × long | la réutilisation de D8, du catalogue et des deux oracles | **réfutée** : aucun verbe outillé absent ailleurs (règle 31, critère 1), et il reproduirait la classe `oracle-remplace-par-controle-maison` (86 % de récidive) |

La cible de la boucle n'est jamais « zéro retour ». La métrique retenue a trois termes, chacun avec
sa formule : le **taux de retours par document étiqueté** (retours documentaires du mois ÷
documents livrés portant l'étiquette de gabarit, calculable seulement quand l'étiquette est générale) ;
le **rappel au banc** des défauts échappés et des défauts semés (indépendant de la bonne volonté du
lecteur) ; et le **nombre de récidives** des classes closes du sujet.

## 5. Verdict

- **Option retenue : O3**, sous réserve, jouée par étapes : A d'abord (fiche de conception amont et
  câblage des deux oracles), puis B et C sur les candidatures qui les portent déjà.
- **Coût** : complexe × moyen pour l'ensemble ; l'étape A seule est moyen × moyen. Coût par document
  produit : une fiche courte remplie par l'agent, une validation humaine pour les seuls documents à
  fort enjeu, deux oracles joués. Coût de l'étude : 393 374 tokens délégués (mesure et état de l'art).
- **Réserves** : un seul classeur pour le rétro-test ; mesure de départ en plancher ; axes B et C de
  l'état de l'art sans étude contrôlée ; taux de retours non calculable avant que l'étiquette de
  gabarit soit générale (TF-1095).
- **Candidatures émises** : `input\01-candidatures\conception-documentaire-amont-20260914a.tf.jsonl`
  — la fiche de conception amont jugée avant l'écriture, et le câblage d'office de la lecture par un
  tiers. La construction attend le GO humain.
- **Plan de revue** : 2026-10-14. Rejouer le rétro-test sur les griefs documentaires reçus d'ici là,
  avec un second classeur à l'aveugle, et publier le taux de retours par document étiqueté dès que
  l'étiquette est générale.
- **Test rétro** : l'élément opérationnel (une fiche remplie avant chaque document, deux oracles joués
  à l'écriture, les gabarits éprouvés par des défauts semés, chaque retour rejoué sur sa classe)
  remonte à la tactique (mesurer sur des griefs réels ce que l'amont évite : 11 sur 20), puis à la
  stratégie (fixer avant l'écriture ce que le lecteur doit en tirer, et éprouver les gabarits avant un
  lecteur), puis à l'intention (moins de documents renvoyés par leur lecteur, y compris dans les
  familles non encore lues). Aucune rupture. Les mots du demandeur rejoués un à un : « outil de
  conception » → une fiche et un câblage, pas un outil neuf (O4 réfutée) ; « types de documents » →
  les familles du catalogue ; « types de contenus » → la typologie DITA et Information Mapping ;
  « types de lecteurs » → le lecteur défini par ses décisions ; « gabarits sans retour » → éprouvés
  par défauts semés et lecture d'un tiers avant toute modification ; « amélioration continue » → la
  propagation de chaque retour à sa classe ; « documents sans retour » → une métrique à trois termes,
  jamais le silence pris pour une réussite.

## Annexe — mesure et rétro-test

**Mode de lecture** : une ligne par grief, dans l'ordre de sélection ; la source est le lot de
retours et sa ligne ; la dernière colonne est le classement de la session déléguée. Les produits sont
désignés par leur pseudonyme.

| N° | Famille ou type | Source | Grief | Classement |
|---|---|---|---|---|
| 1 | fiche sécurité | `Produit-04 - RETOURS - 20260827a.md`, l. 45 | « pourquoi la règle de nouvelle version de fichier avec nouvel indice n'est pas respectée ? » | aucun |
| 2 | fiche sécurité | `Produit-04 - RETOURS - 20260827b.md`, l. 44 | « laisser plus d'espace pour la largeur de la deuxième colonne qui contient plus de texte » | amont |
| 3 | support PowerPoint | `Produit-11 - RETOURS - 20260827a.md`, l. 10 | « ne respecte pas du tout la charte Client-A du document fourni en entrée » | aucun |
| 4 | support PowerPoint | `Produit-11 - RETOURS - 20260827a.md`, l. 12 | « cela provoque des défauts dans l'affichage des contenus » | aucun |
| 5 | support PowerPoint | `Produit-11 - RETOURS - 20260827a.md`, l. 111 | « fournis un schéma d'architecture de la solution » | amont |
| 6 | fiche sécurité | `Produit-11 - RETOURS - 20260827b.md`, l. 6-9 | « le fichier est généré en html mais il devrait aussi être généré en pdf » | oracle |
| 7 | fiche sécurité | `Produit-01 - RETOURS - 20260827a.md`, l. 9 | « la fiche doit également être générée en PDF » | oracle |
| 8 | document de projet | `Produit-11 - RETOURS - 20260908c.md`, l. 7 | « Et les informations de l'API, elles ne sont pas dans le tableau ? » | amont |
| 9 | rapport d'audit | `Produit-61 - RETOURS - 20260909c.md`, l. 3 | le rapport remis ne respecte pas la forme attendue (paraphrase du lot) | aucun |
| 10 | rapport de données | `Produit-11 - RETOURS - 20260911b.md`, l. 41 | « le tableau de synthèse doit intégrer directement les détails […] sans recréer un deuxième listing » | amont |
| 11 | rapport de données | `Produit-11 - RETOURS - 20260911b.md`, l. 43-44 | « agrandis la largeur de la page […] sans avoir des cellules trop grandes en hauteur » | amont |
| 12 | rapport de données | `Produit-11 - RETOURS - 20260911b.md`, l. 44 | « homogénéise la largeur des contenus » | amont |
| 13 | famille absente | `Produit-12 - RETOURS - 20260831d.md`, l. 69 | « le format ne respecte pas la Factory » | amont |
| 14 | famille absente | `Produit-12 - RETOURS - 20260831d.md`, l. 69 | « l'en-tête n'est pas fixe avec les onglets affichés en permanence » | amont |
| 15 | index de livrables | `old\Produit-10 - RETOURS - 20260824b.md`, l. 57 | « aucun des 2 liens n'ouvre le fichier » | aucun |
| 16 | gabarit de restitution | `old\Produit-10 - RETOURS - 20260824c.md`, l. 55 | « le prompt de réponse s'affiche 2 fois » | amont |
| 17 | gabarit de restitution | `old\Produit-10 - RETOURS - 20260824d.md`, l. 70 | « sans puce, ce texte est illisible » | amont |
| 18 | fiche sécurité | `old\Produit-03 - RETOURS - 20260824b.md`, l. 14 | « "appartenir au tenant" correspond-il exactement à l'audience autorisée ? » | amont |
| 19 | famille absente | `Produit-65 - RETOURS - 20260903a.md`, l. 15 | « mets à jour le fichier pour être conforme à la Factory » | les deux |
| 20 | rapport de restitution de données | `Produit-62 - RETOURS - 20260908e.md`, l. 14 | « Utilise le mot granularité plutôt que grain » | les deux |

> **Classement** : la phase de la chaîne où le grief aurait été attrapé si la conception
> documentaire amont avait existé — `amont`, `aval` ou `aucun`. C'est une ÉTIQUETTE posée par la
> session déléguée, jamais un score : elle ne se calcule pas et n'ordonne pas ce tableau, qui se
> lit dans l'ordre de sélection des griefs.

Décompte : amont seul 11, oracle seul 2, les deux 2, aucun 5. Mesure de départ détaillée par famille
au § « Ce que la mesure a donné » ; règle de comptage : une ligne de la section « Retours sur les
documents produits » des lots vaut un retour, les lots antérieurs à cette section comptés sur leur
prose non ambiguë, les 69 lots déclarant « aucun document produit » exclus.
