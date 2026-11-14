# Retours forges — Produit-02 — 20261103a

- **Contexte** : clôture du run « planning des gîtes » (D-892) — page de planning construite le 30/10/2026,
  ouverte en production le 03/11/2026 (`forge\ledger.jsonl` seq 652, entrée `type: etape_close`).
- **Références ledger** : `forge\ledger.jsonl` seq 617, 619, 620, 622, 623, 624, 627, 638, 639, 640, 645
  (entrées `type: retour`). Les trois premiers retours à destinataire forge deviennent RT-145 à RT-147 ;
  les huit autres (destinataire `produit`) sont traités en « Remarques restées au produit ».
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-11-03

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT au registre du pilot (dernier relevé : RT-140 au registre ; RT-141 à RT-144 déjà définis par
les lots 20261030a et 20261102a de ce produit). Correspondance avec le ledger : RT-145 = seq 617,
RT-146 = seq 640, RT-147 = seq 620.

---

## Factory (`digit-ai-factory`)

Deux scripts du pilot ont coûté un aller-retour : un juge de brouillon que rien n'aligne sur le hook qu'il
anticipe, et un générateur d'index dont la portée par défaut est tout `input` et tout `output`. (Le retour
seq 617 porte `destinataire: pilot` au ledger ; le hook qu'il vise vit dans le dépôt `digit-ai-factory`.)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-145 | mineur | générique | **Le préjugement d'un brouillon (`--prejuger`) ne rejoue pas la décision de jugeabilité du hook de fin de tour, et la consigne de refus ne prescrit que lui.** Fait (ledger seq 617, `type: retour`, 30/10/2026) : un plan demandé en 10 lignes, sans écriture, a été refusé à 275 mots ; puis le préjugement d'un brouillon de 230 mots a rendu S1 et S4 bloquants, alors que `references\NIVEAUX.md` prévoit une réponse courte pour un tour sans écriture. Lecture du pilot le 03/11/2026 : `oracles/hook-restitution.mjs` appelle `jugeable()` pour `--pre-vol` (ligne 1893) et pour le hook (ligne 1936), jamais dans le bloc `--prejuger` (lignes 1803 à 1870), qui rend le verdict des règles bloquantes sur le texte seul ; le rappel de refus (ligne 1786) ne cite que `--prejuger`. **Part non tranchée** : le même tour posait D-892 (seq 616, `type: question_humain`, même seconde), et un tour qui pose une décision est jugé même court (TF-2029, D-101 (b)) : S4 peut être légitime, S1 reste à expliquer. | Règle qui aurait évité le retour : `references\NIVEAUX.md` (un tour sans écriture rend une réponse courte), que `--pre-vol` joue et que `--prejuger` ne joue pas. Pistes : `--prejuger` applique `jugeable()` avant les règles et dit quelle exemption il retient ; ou le rappel de refus oriente une réponse courte vers `--pre-vol`. À rejouer d'abord sur le brouillon d'origine, que ce lot ne détient pas. |
| RT-146 | mineur | générique | **`scripts/readme-dossiers.mjs` lancé à la main parcourt `input` et `output` en entier ; son option de portée `--racines` n'a pas de ligne d'explication.** Fait (ledger seq 640, `type: retour`, 02/11/2026) : lancé pour réindexer un seul dossier avant un commit, le script a créé 6 README et en a modifié 2 dans des dossiers sans rapport, retirés aussitôt. Le ledger dit que le script n'offre que `--check`, `--silencieux` et `--base`, et propose une option `--dossier` : **c'est inexact**. Lecture du script au pilot le 03/11/2026 : `--racines input,output` figure à la ligne d'usage (ligne 27) et comme valeur par défaut (ligne 47), les lignes 28 et 29 n'expliquent que `--check` et `--silencieux`, et aucune ligne ne traite `--help`. Voisin : seq 613 (`type: retour`, `destinataire: digit-ai-factory`, autre session, 30/10/2026) a vu `--racines a b c` ne traiter que la première racine, sans message. | Règle qui aurait évité le retour : aucune ne borne la portée d'un lancement manuel (TF-1667 borne ce que le script écrase, pas ce qu'il parcourt), § 4 de quality-oracles. Pistes : une ligne de description pour `--racines` à côté de `--check` ; imprimer « racines : input, output » avant d'écrire quand l'option est absente ; traiter `--help`. L'option `--dossier` du ledger est sans doute inutile : `--racines output/<dossier>` est déjà ce que prescrit le relevé d'ouverture (TF-1887). |

## Forge websec (`digit-ai-forge-websec`)

Une ligne du README d'une forge prescrit une forme de commande que son script ne lit pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-147 | mineur | générique | **La table d'usage du README prescrit `capturer.mjs <url> <capture.json>`, forme que le script ne lit pas.** Fait (ledger seq 620, `type: retour`, `destinataire: digit-ai-forge-websec`, 30/10/2026) : sous cette forme la capture part sur la sortie standard, le fichier n'existe pas et `oracle-exposition` rend SKIP « capture introuvable » : un aller-retour subi sur le planning. Relu au dépôt `digit-ai-forge-websec` le 03/11/2026 (révision f69d226, README sans modification locale) : `README.md` ligne 18 écrit `node scripts\capturer.mjs <url> <capture.json> puis node oracles\oracle-exposition.mjs <capture.json>` ; `scripts/capturer.mjs` ligne 7 attend `[--sortie <fichier.json>]` et n'écrit le fichier que si `--sortie` est donné (lignes 55 à 60) ; `oracles/oracle-exposition.mjs` ligne 145 rend SKIP quand le fichier manque. Les lignes 67 et 91 du même README sont justes. | Règle qui aurait évité le retour : classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` (tout chemin d'usage prescrit est joué dans sa recette ; `oracles/oracle-chemin-prescrit.mjs` du pilot, CP1 à CP3). Pistes : écrire la ligne 18 sur la forme de la ligne 91 ; faire jouer par ce contrôle les commandes des tables d'usage des README de forge, si elles n'y sont pas. |

## Rattachement

Registre interrogé le 03/11/2026 (depuis la racine du pilot) :
`grep -c -i -E 'pr[ée]jug[^"]{0,120}(r[ée]ponse courte|Simple|sans [ée]criture|tour sans)' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -c -i -E 'prejuger|pre-vol' todo/TODO.jsonl` → 29 ligne(s) trouvée(s) ;
`grep -c -i -E 'NIVEAUX\.md' todo/TODO.jsonl` → 6 ligne(s) trouvée(s) ;
`grep -c -i -E 'readme-dossiers' todo/TODO.jsonl` → 45 ligne(s) trouvée(s) ;
`grep -c -i -E -e '--racines' todo/TODO.jsonl` → 4 ligne(s) trouvée(s) ;
`grep -c -i -E 'capturer\.mjs' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -c -i -E 'oracle-exposition' todo/TODO.jsonl` → 6 ligne(s) trouvée(s) ;
`grep -c -i -E 'digit-ai-forge-websec[^"]{0,200}(README|table d.usage)' todo/TODO.jsonl` → 0 ligne(s) trouvée(s).

Items recoupés :
- RT-145 : TF-1541 (juge de fin de tour, classe `oracle-faux-positif`, a créé `--pre-vol`, corrigé), TF-1647 (a créé `--prejuger`, corrigé), TF-2029 (D-101 (b) : réponse courte portée à 250 mots, corrigé le 30/10/2026), TF-1418 (niveaux d'intervention, corrigé). Aucun ne porte l'écart entre `--prejuger` et `jugeable()` : c'est le recoupement partiel, la part neuve.
- RT-146 : TF-1610, TF-1620 (écriture dans `input`, corrigés), TF-1667 (README rédigés écrasés, dossier gelé, corrigé), TF-1887 (la commande `--racines output\03-Syntheses` du relevé d'ouverture, corrigé). Aucun ne porte la portée par défaut d'un lancement manuel ni l'absence d'explication de `--racines`.
- RT-147 : aucun item. Les cinq items qui citent `oracle-exposition` (TF-1046, TF-1216, TF-1229, TF-1996, TF-2015) portent sur d'autres défauts.

Entrées du ledger à rapprocher, non comptées comme retours de plus : seq 629 (`type: retour`, `destinataire: produit`) est un doublon voisin de seq 619, écrit par une autre session le 02/11/2026 pour le même défaut `PORT=0` ; il est rattaché à la remarque correspondante ci-dessous. Seq 613 (`type: retour`) vient d'une autre session et n'est pas repris comme retour de ce lot (voir RT-146).

Registre interrogé le 03/11/2026 pour les verdicts de généralisation ci-dessous :
`grep -c -i -E 'beds24' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -c -i -E 'beds24' todo/TODO-ARCHIVE.jsonl` → 4 ligne(s) trouvée(s) (TF-0544, TF-0547, TF-0635, TF-0679) ;
`grep -c -i -E 'hideblack|unavaildates' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -c -i -E 'PORT=0|port libre|127\.0\.0\.1:3000' todo/TODO.jsonl` → 2 ligne(s) trouvée(s) (TF-0842, TF-1093) ;
`grep -c -i -E 'RAILWAY_TOKEN|jeton de compte' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -rl -i beds24 input/00-retours` → 12 fichier(s) trouvé(s) : 8 de ce produit, 4 de deux autres produits, dont aucun ne parle de l'export iCal.

## Remarques restées au produit

Les huit retours du run à destinataire `produit` (seq 619, 622, 623, 624, 627, 638, 639, 645), regroupés en quatre remarques, chacune avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `server.mjs` lit `PORT=0` comme 3000 (`Number(PORT)\|\|3000`), contrairement à son commentaire. Quand un autre processus écoute sur 127.0.0.1:3000 (un service Docker, sur ce poste), un script de contrôle qui passe `PORT=0` interroge cet autre processus et rend de faux échecs (seq 619, `type: retour`, 30/10/2026 ; seq 629, doublon voisin, 02/11/2026 : `build/check-sauna.mjs` échouait en 404 sans aucun défaut du sauna). | `build/check-planning.mjs` choisit un port libre depuis le début ; `build/check-sauna.mjs` depuis le 02/11/2026. `build/check-console.mjs` et `build/check-chaines.mjs` passaient encore `PORT=0`, et `server.mjs` n'était pas corrigé au 02/11/2026 (il portait des modifications non enregistrées du planning) : état non relu pour ce lot. | non | Rien de généralisable, parce que le défaut est un idiome du code du produit (`0` est faux en JavaScript) rencontré avec une particularité de ce poste ; le registre n'a aucun item de ce genre (`PORT=0\|port libre\|127.0.0.1:3000` → TF-0842, port resté occupé après un audit, et TF-1093, banc de rendu : ni l'un ni l'autre n'est une sonde qui interroge un autre processus). À reconsidérer si un second produit montre une sonde de recette qui n'établit pas l'identité du serveur qu'elle interroge. |
| Comportement des exports iCal du moteur de réservation. Le wiki lu le 30/10/2026 présente `hideblack` comme le masque des réservations de statut black et les dates bloquées comme un réglage distinct (seq 622, `type: retour`). La sonde des 5 flux réels du 01/11/2026 montre que `hideblack` ne retire aucun événement et que `unavaildates=0` retire exactement les 6 événements sans lien de réservation (seq 624, `type: retour`). Le flux ne dit ni le statut ni le canal d'une réservation : un séjour de couleur différente dans le calendrier sort comme réservation (seq 627, `type: retour`), et un séjour reste présent avec `hiderequest=true`, donc n'est pas une demande non confirmée (seq 638, `type: retour`). | Relais réglé sur `PLANNING_DISTINCTION=unavaildates` et `back=30` sur toute lecture (seq 624) ; la page affiche tout séjour présent comme une réservation et ne dépend pas du canal (seq 638). Critère 1 : 5 gîtes rattachés, 6 séjours et 1 date bloquée conformes jour par jour à la capture du calendrier fournie par l'exploitant le 01/11/2026 (seq 627). Reste ouverte : la nature de l'événement d'une nuit posé sur le soir même dans chacun des 5 flux (seq 624). | non | Rien de nouveau à remonter, parce que la classe est déjà généralisée : R-51 et `gabarits\INTEGRATIONS.md` (TF-0547, corrigé le 24/08/2026) demandent, par service externe, la sonde exhaustive, l'écart connu entre l'API et l'interface et le « risque de faux silence ». `hideblack` est une option acceptée sans effet, le cas que cette colonne décrit ; le cas fondateur de TF-0547 était déjà un plafonnement silencieux du même moteur. Les valeurs (quel paramètre filtre quoi) sont des faits périssables d'un seul fournisseur : elles se datent chez le produit, et aucune forge ne les consomme (`hideblack\|unavaildates` → 0 ligne au registre ; deux autres produits du pilot citent ce moteur, aucun pour l'export iCal). Le produit n'a pas d'`INTEGRATIONS.md` (le contrat s'instaure, R-51) : le consigner est son choix, non fait par ce lot. À reconsidérer si un second produit lit ces exports. |
| Débit des exports : le 01/11/2026, une trentaine de requêtes en quelques minutes (sondes de mise au point) ont déclenché un refus HTTP 503 sur les 5 flux ; le relais lisait tous les flux en parallèle, soit 10 requêtes d'un coup à un démarrage à froid en double lecture. Seuil et durée du refus non documentés (seq 623, `type: retour`). | Flux lus en série (seq 624). Le rejet d'une réponse qui n'est pas un calendrier reste en place : le gîte est signalé en échec. | non | Rien de généralisable, parce que la limite de débit est celle d'un fournisseur dont seuil et durée sont inconnus : aucune règle n'en sort. Le réflexe (espacer les sondes, lire en série) relève du métier du produit, et l'échec bruyant (503 rejeté, gîte signalé) est le cas que R-51 classe sans danger. |
| Accès Railway du poste : le 02/11/2026, le jeton `RAILWAY_TOKEN` du `.env` répondait Not Authorized à toutes les requêtes GraphQL (`me`, `projects`, `project`) et comme jeton de projet ; la session CLI répondait Unauthorized. Plus aucune voie automatique pour poser une variable sur le service ; la ligne 70 de `docs/projet/PARAMETRAGE.md` (jeton vide en local, session CLI) était périmée depuis le 18/10/2026 (seq 639, `type: retour`). | Nouveau jeton de compte posé par l'exploitant le 03/11/2026 : `me`, `projects`, `project`, `link` et la lecture des variables passent, 26 variables sur le service dont aucune `PLANNING_` (seq 645, `type: retour`) ; 7 variables ensuite posées par la CLI (seq 652, `type: etape_close`). Correction de la ligne 70 de PARAMETRAGE : non relue pour ce lot. | non | Rien de généralisable, parce qu'un jeton révoqué est un événement du compte de l'exploitant. GFP-003 est écarté : ses refus visent des sous-commandes précises sous un jeton de portée réduite, alors qu'ici toutes les requêtes étaient refusées et que le remplacement du jeton a tout rétabli. Le document périmé est un cas d'application manquée de R-20 (« toute évolution de config → PARAMETRAGE »), propre au produit, et la session l'a vu le jour même. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : aucune des onze entrées citées ne rapporte un manque de gabarit, relu le 03/11/2026.

## Documents mûrs

Deux documents de `output\` du produit atteignent le seuil de cinq versions ; ni l'un ni l'autre n'appartient au run, et leur verdict de remontée est donné ici.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| `output\06-supports-de-communication\Produit-02 - Notice Piscine A3 - 20261029a.html` | 7 | non relevés sur ce lot | aucun | non relevés sur ce lot | Reste au produit, parce que ses sept versions sont des reprises successives d'un même support A3 du 13/10 au 29/10/2026 et qu'aucun verdict de lecteur n'est cité dans les entrées de ce lot ; mesuré par `oracle-lot.mjs --murs` |
| `output\06-supports-de-communication\Produit-02 - Notice Sauna A3 - 20261014c.html` | 6 | non relevés sur ce lot | aucun | non relevés sur ce lot | Reste au produit, parce que ses six versions sont des reprises successives d'un même support A3 les 13 et 14/10/2026 et qu'aucun verdict de lecteur n'est cité dans les entrées de ce lot ; mesuré par `oracle-lot.mjs --murs` |

Le Dossier Plan de campagnes Google Ads (5 versions, mesuré par la même commande) est déjà déclaré au lot 20261001b avec son verdict ; il n'est pas redéclaré.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Considéré et écarté : le refus HTTP 503 des exports iCal du 01/11/2026 (seq 623, `type: retour`) est une limite de débit rencontrée en mise au point, hors déploiement ; seuil et durée ne sont pas documentés, donc les champs d'un garde-fou ne peuvent pas être renseignés. Il reste noté dans « Remarques restées au produit ».

## Confirmations positives

- **La consigne de la seq 622** (« à trancher avec le relevé et la sonde, avant toute pose de la variable ») a tenu : la sonde des 5 flux réels du 01/11/2026 a invalidé la lecture du wiki sur `hideblack` (seq 624) avant que la moindre variable `PLANNING_` n'existe sur le service (seq 645 : aucune) ; les 7 variables n'ont été posées que le 03/11/2026, relais corrigé (seq 652).
- **Les critères d'acceptation du planning ont été mesurés sur les vrais flux** : critère 2, 294 valeurs sensibles cherchées, 0 trouvée, dans la réponse de l'API et dans l'onglet Réseau, 39 séjours lus, 0 échec (seq 624) ; critère 1, 6 séjours et 1 date bloquée conformes à la capture de l'exploitant (seq 627) ; critère 4, un jeton retiré refusé (401) 156 s après son retrait, redémarrage compris (seq 652).
- **`oracle-exposition` a refusé de conclure** sur une capture absente : il rend SKIP « capture introuvable » (`oracles/oracle-exposition.mjs` ligne 145) et non un PASS silencieux, ce qui a rendu le défaut de RT-147 visible dans la minute.

## Ordre recommandé

1. RT-147 : une ligne du README de la forge websec à réécrire sur la forme de la ligne 91 ; effort minimal, et la table d'usage est la première chose que lit un produit qui juge son exposition.
2. RT-146 : documenter `--racines` et annoncer la portée avant d'écrire ; c'est le quatrième retour sur ce script après TF-1610, TF-1620 et TF-1667, et le ledger du produit montrait qu'une session ne trouve pas l'option qui existe.
3. RT-145 : après avoir rejoué le brouillon d'origine pour isoler la part qui revient à la décision D-892 posée dans le même tour.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun des trois retours ne suit un retour humain : tous ont été trouvés par des sessions en cours de travail. RT-145 : `references\NIVEAUX.md`, existante, jouée par `--pre-vol` et non par `--prejuger`. RT-146 : aucune règle ne borne la portée d'un lancement manuel d'un générateur d'index, § 4 de quality-oracles (domaine sans oracle). RT-147 : la classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`, existante, dont l'oracle du pilot ne joue pas (à ma connaissance) les tables d'usage des README de forge.
