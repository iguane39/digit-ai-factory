# Retours forges — digit-ai-marketing — 20261112c

- **Contexte** : autre — retours humains du 12/11/2026 sur le support de formation « Fondamentaux de Claude » livré pour FIT Retail, avec la demande « remonte ce point à la Factory. Des exemples adaptés aux clients servis des formations. »
- **Références ledger** : `forge\ledger.jsonl` seq 716, 717 et 718 (entrées `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 7 retours humains sur un deck de 30 diapositives, dont 5 sur des exemples hors du contexte du client ; 1 oracle demandé introuvable sur le poste ; 1 deck jugé PASS ou FAIL selon son dossier. Ce lot remonte 3 retours, tirés de 3 entrées du ledger, à 1 forge.

---

## digit-ai-communication, digit-ai-pptx, quality-oracles et oracle-charte-pptx-semantique (`digit-ai-forge-agents`)

Une formation livrée au client porte des exemples d'un autre métier que le sien, et deux contrôles demandés ou joués ne disent pas la même chose selon le poste et le dossier.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-23 | majeur | produit+générique | **Les exemples d'une formation ne viennent pas du contexte du client servi.** Faits : sur le support « Fondamentaux de Claude » livré pour FIT Retail le 09/11/2026, 5 des 7 retours humains du 12/11 portent sur des exemples : consigne type sur la réouverture d'un magasin, démonstration de comptes rendus de visite magasin, fichier de ventes de magasins, exemple de conformité abstrait, courriel supposé à l'exercice 6. Le public est les fonctions transverses de FIT Retail. Consigne humaine, mot pour mot : « Des exemples adaptés aux clients servis des formations. » Le porteur a fourni 2 consignes de remplacement (annonce interne du déploiement sur Teams, programme d'un séminaire) et 3 sujets (règlement intérieur, suivi des temps en mission, skill d'analyse de prompt). Corrigé chez le produit : deck 20261112f. (ledger seq 716) | Le preset formation de `digit-ai-communication` exige que chaque consigne type, démonstration et jeu d'exercice parte d'un usage nommé du client servi : sa fonction, son outil, son document. `oracle-programme-formation` relève un exemple sans ancrage dans le client. Règle qui aurait évité le retour : aucune ne juge l'ancrage client d'un exemple. Classe à créer : `exemple-de-formation-hors-du-contexte-client`, famille `gabarit-document`. |
| RA-24 | mineur | générique | **Un oracle demandé par une consigne de travail n'existe pas au poste.** Faits : la consigne humaine du 12/11 exige « Passe quality-oracles/scripts/oracle-langue.py sur le livrable avec --client "FIT Retail". Joins la sortie. » Mesure du 12/11 : `find` sur `~/.claude/skills`, `digit-ai-forge-agents` et `digit-ai-factory`, 0 fichier `oracle-langue*` ; 0 mention dans les références de `quality-oracles`. Substitut joué : la règle S5 d'`oracle-charte-pptx-semantique` et une recherche des 2 tournures bannies par la consigne. (ledger seq 717) | Créer `oracle-langue` au registre (tournures bannies par client, lexique du destinataire, typographie française), ou dire au registre quel oracle tient ce rôle. Règle qui aurait évité le retour : aucune ne relie un nom d'oracle cité à sa présence au registre. Classe à créer : `oracle-nomme-absent-du-poste`, famille `contrat-interface-forge`. |
| RA-25 | majeur | générique | **Le même deck reçoit PASS ou FAIL selon le dossier où l'oracle de charte le lit.** Faits : le 12/11, le deck 20261112c joué par `oracle-charte-pptx-semantique --mesurer` rend PASS depuis le dossier de travail de la session (S5 sur le lexique du destinataire `forge\LEXIQUE.json`, 3 termes) et FAIL depuis `output\04-supports-clients\` (S5 sur le tableau « On dit / On ne dit pas » de `donnees\marque\MARQUE.md`, 9 constats bloquants : « propale », « profil », « itération », « limite »). La chaîne de fabrication du produit juge dans son dossier de travail : elle rend vert ce que l'emplacement de livraison refuse. (ledger seq 718) | L'oracle annonce en tête de sortie le référentiel qu'il a résolu, et applique les deux lexiques quand le fichier appartient à un produit, quel que soit son dossier. Règle qui aurait évité le retour : aucune ne fixe le référentiel d'un oracle indépendamment du chemin. Classe à créer : `verdict-d-oracle-dependant-de-l-emplacement`, famille `contrat-interface-forge`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-23 | `grep -c -i -E "exemple.{0,60}(client servi\|adapt.{0,20}client\|contexte du client)" todo/TODO.jsonl` | 0 | aucun |
| RA-24 | `grep -c -i "oracle-langue" todo/TODO.jsonl` | 0 | aucun |
| RA-25 | `grep -c -i -E "selon (le\|l.)(emplacement\|dossier\|chemin).{0,80}(verdict\|lexique)\|lexique.{0,80}(emplacement\|dossier de travail)" todo/TODO.jsonl` | 1 | aucun : TF-2404 traite des tests du hook de restitution sous un dossier temporaire |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 11 termes de la marque relevés par S5 au dossier de livraison (« propale », « profil », « itération », « limite ») | pas encore : identiques avant et après cette version | non | le tableau de la marque vise les propositions commerciales ; à trancher à la prochaine version des supports |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La passe de correction ajoutée à l'assembleur du produit, où chaque remplacement vérifie d'abord l'ancien texte, a laissé les 2 autres modules de formation identiques à l'octet.

## Ordre recommandé

1. RA-25 d'abord, parce qu'un verdict qui dépend du dossier fausse tous les autres contrôles de charte.
2. RA-23 ensuite, parce qu'il porte la demande du porteur et 5 retours humains.
3. RA-24 en dernier, parce qu'un substitut existe déjà.

## La règle qui aurait évité le retour

RA-23 et RA-24 suivent des retours humains ; RA-25 a été vu en comparant deux passes du même oracle. Aucune règle existante ne couvre l'un des 3 : chaque colonne « Proposition esquissée » nomme la classe à créer et sa famille.
