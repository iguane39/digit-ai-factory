# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20261001i

- **Contexte** : première exécution, par l'exploitant de production, de l'étape « Fiche Entra » de la chaîne de livraison (exécution 15803, 01/10/2026, 16h29). Elle a échoué. Le commanditaire a demandé pourquoi ce plantage n'avait pas été anticipé ; la revue ligne par ligne qui a suivi a trouvé un second arrêt, qui attendait la relance. 4 leçons en sortent, valables pour tout produit qui confie une étape neuve à une chaîne.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une étape remise sans qu'aucune de ses commandes ait tourné : 2 arrêts, et une permission accordée à l'écran

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-67 | bloquant | produit+générique | **La réplication d'Entra.** L'exécution 15803 a créé la fiche (`az ad app create` : « Fiche créée : e83d0f6a-… », 16h29:38), puis la commande suivante, `az ad app update`, a échoué : « Resource 'e83d0f6a-c7b2-4c23-bc98-c8ed35d830b0' does not exist or one of its queried reference-property objects are not present. » Entra réplique une fiche neuve en quelques secondes. En juillet, la même chaîne n'avait jamais heurté ce délai : elle trouvait chaque fois une fiche déjà présente. L'étape attend désormais que la fiche soit lisible (12 essais, 10 secondes), et réessaie la création de l'application d'entreprise (6 essais) ; correctif urgent du produit, demande de fusion 4029 | Que tout gabarit ou tout guide qui fait créer un objet d'annuaire par une chaîne attende sa lecture avant de le compléter, avec un nombre d'essais borné ; et qu'un contrôle de chaîne signale une création d'objet d'annuaire suivie d'une écriture sur cet objet sans attente |
| RA-68 | majeur | produit+générique | **Une permission accordée à l'écran échappe à la fenêtre.** Le produit n'ouvrait l'autorisation de sa chaîne sur une connexion à droits étendus qu'après avoir lu la chaîne au commit lancé, et la refermait à la fin. À 16h29, l'exploitant a accordé lui-même la permission demandée à l'écran (« Checkpoint.Authorization » réussi), avant le passage du guetteur. Celui-ci ne refermait que ce qu'il avait ouvert : l'autorisation est restée ouverte jusqu'à 16h32:21, quand je l'ai retirée (« oui 14 » → « non 13 »). Aucune autre exécution n'a compilé l'étape dans l'intervalle | Qu'une fenêtre d'autorisation se referme à la fin de l'exécution QUOI QU'IL ARRIVE, qui que ce soit qui l'ait ouverte, et que l'état se relise ensuite ; et qu'une procédure d'exploitant dise explicitement ce qu'il fait de l'écran de permission, puisqu'il a le droit de l'accorder |
| RA-69 | bloquant | produit+générique | **Une leçon restée en commentaire de script.** Le 22/08, le produit a mesuré que l'agent hébergé n'a pas l'extension `authV2` : `az webapp auth` y retombe sur la première génération du réglage. La leçon est restée dans un commentaire de `infra/verifier-reglages-servis.sh`. Le 01/10, l'étape neuve a écrit `az webapp auth update --set` : la commande est refusée sans l'extension (« unrecognized arguments: --set », mesuré avec un client sans extension, `AZURE_EXTENSION_DIR` vide), et la lecture rend du vide. La relance aurait échoué au job « brancher ». La revue l'a trouvé avant toute exécution ; corrigé par la demande de fusion 4031 (écriture par l'API `authsettingsV2`) | Qu'une leçon d'outillage mesurée sur l'agent devienne une règle du guide commun, pas un commentaire ; que le gabarit de chaîne lise et écrive `authsettingsV2` par l'API ; et que le guide donne la façon d'essayer une commande comme sur l'agent (`AZURE_EXTENSION_DIR` vide) |
| RA-70 | bloquant | générique | **Une étape remise sur sa compilation.** L'étape « Fiche Entra » est partie chez l'exploitant après 3 contrôles : compilation par Azure DevOps, syntaxe bash, relecture. Aucune de ses commandes n'avait tourné, et sa branche de création ne pouvait tourner qu'en production, les fiches de développement et de qualification existant déjà. 2 arrêts en sont nés, `RA-67` à l'exécution et `RA-69` à la revue. La loi de qualité le dit (« un ✓ sans oracle exécuté n'est pas un ✓ ») : l'oracle d'une étape de chaîne est son exécution, et le registre des oracles n'en porte aucun pour ce domaine | Que le registre des oracles inscrive l'oracle d'une étape de chaîne : chaque ligne exécutée sur un client semblable à l'agent, hors production, avec les mêmes valeurs ; chaque écriture de production jouée à blanc, avec sa différence ; et la liste des branches que seule la production exécutera, jointe à la demande faite à l'exploitant. Candidat inscrit à la file : `revue-pipelines-execution`, famille `revue` (7 occurrences au 01/10/2026) |

## La règle qui aurait évité le retour

La règle de `RA-70` existe et n'a pas été appliquée : la loi de qualité exige un oracle exécuté, et seule une compilation l'a été. La leçon de `RA-69` existait au produit, mais en commentaire : elle n'était pas une règle lue avant d'écrire une étape. `RA-67` et `RA-68` ne sont couverts par aucune règle. La règle manquante : un objet d'annuaire créé par une chaîne se relit avant d'être complété, et une autorisation temporaire se referme sur l'événement de fin, pas sur l'identité de qui l'a ouverte.


> **Note de réception du pilot (01/10/2026, avant ingestion).** Le sidecar propose 4 classes que le référentiel `todo/CLASSES.json` ne porte pas encore ; elles sont nommées ici, comme l'exige l'ingestion (TF-1128) :
> - `objet-annuaire-complete-avant-replication` (famille `contrat-interface-forge`) : Une chaine cree un objet d annuaire puis l ecrit aussitot, sans attendre qu il soit lisible : la replication d Entra fait echouer la seconde commande.
> - `fenetre-refermee-selon-qui-l-a-ouverte` (famille `hook-ou-gate`) : Une autorisation temporaire ne se referme que si l outil l a ouverte lui-meme : ouverte par un humain a l ecran, elle reste ouverte.
> - `lecon-outillage-restee-en-commentaire` (famille `contrat-interface-forge`) : Une lecon mesuree sur l agent de chaine reste en commentaire de script au lieu de devenir une regle : le code suivant la repete.
> - `etape-remise-sur-compilation` (famille `hook-ou-gate`) : Une etape de chaine est remise sur sa compilation et sa syntaxe, sans qu aucune de ses commandes ait tourne hors production.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'étape complétait la fiche aussitôt créée | attente de lecture et essais bornés, demande de fusion 4029, `env/prd` | oui | remonté ci-dessus en `RA-67` |
| Le guetteur ne refermait que ce qu'il avait ouvert | le guetteur referme à la fin de l'exécution dans tous les cas, puis relit l'état | oui | remonté ci-dessus en `RA-68` |
| La procédure disait à l'exploitant de ne rien autoriser | elle lui dit d'accorder la permission, retirée en fin d'étape, demande de fusion 4030 | non | traité au produit |
| L'étape « brancher » dépendait de l'extension `authV2` | écriture par l'API, essayée sur le développement et à blanc en production, demande de fusion 4031 | oui | remonté ci-dessus en `RA-69` |
| La leçon du 22/08 n'était qu'un commentaire | elle devient la contrainte de plateforme 3 du `CLAUDE.md` du produit, avec la façon d'essayer une commande comme sur l'agent | oui | remonté ci-dessus en `RA-69` |
| L'étape est partie sans qu'aucune commande ait tourné | contrainte 4 du `CLAUDE.md` : chaque commande tourne avant la remise, et la demande liste les branches que seule la production exécutera | oui | remonté ci-dessus en `RA-70` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont une chaîne, un script et une procédure du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- La lecture de l'état au tour suivant, prescrite par la procédure, a fait son office : elle a révélé la permission restée ouverte, refermée 3 minutes après la fin de l'exécution.
- La revue ligne par ligne, faite avant la relance et non après, a trouvé le second arrêt sans coûter une exécution de production de plus.

## Ordre recommandé

1. `RA-70` : la cause commune des 2 arrêts ; l'oracle d'une étape de chaîne manque au registre.
2. `RA-67` : un défaut qui arrête toute première création de fiche par une chaîne.
3. `RA-69` : la leçon d'outillage à porter dans le guide et le gabarit.
4. `RA-68` : la règle de fermeture sur l'événement de fin.
