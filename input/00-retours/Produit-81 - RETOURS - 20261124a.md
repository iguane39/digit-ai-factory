# Retours forges — Produit-81 — 20261124a

- **Contexte** : dossier d'architecture technique de Produit-81 et son schéma d'architecture existant et cible (24/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 55, 56, 57 ;` (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-42 (majeur) — Le sceau et le push passent sans le lanceur complet de quality-oracles ; ses défauts n'apparaissent qu'au verrou « livré »

**Le fait.** Le 24/11/2026, le DAT de Produit-81 passe `check_html` (charte Client-A), `render_page` à 1280, 768 et 390 px et `run-oracles-design`. Il est scellé par `verifier-jugement --sceller`, enregistré et poussé sous les indices `a` et `b`. Le verrou « livré » (`mobiliser --verifier`) exige ensuite le compagnon `.oracles.json` de `quality-oracles`. Son lanceur complet relève 10 oracles en échec : chapitres sans chapeau ni annonce au sommaire, tableaux sans exemple de lecture ni exemption de filtre motivée, en-têtes sans glose, chiffres sans source, page sans phrase d'intention, mesure de lecture et largeur du contenu fausses à 2560 et 3840 px.

**Le coût, prouvé.** Deux indices de plus (`c`, `d`), six déplacements tracés vers `output/old/Architecture/`, trois commits et trois pushs supplémentaires (`18bbf6b`, `8d04675`, `b686f72`).

**La règle qui aurait évité le retour.** Un livrable sous `output/` ne se scelle qu'avec un compagnon `.oracles.json` PASS, daté après sa dernière écriture. **Clé proposée** : `sceau-avant-lanceur-complet`, famille `skill-ou-oracle-non-invoque`, libellé « Un livrable est scellé et publié sur les oracles de skill seuls : le lanceur complet, exigé au verrou livré, trouve ses défauts après la publication ».

**Juge proposé.** `verifier-jugement --sceller` refuse le sceau sans ce compagnon et rend la commande du lanceur à jouer ; banc : livrable sans compagnon refusé, livrable avec compagnon PASS scellé.

## RT-43 (majeur) — Le gabarit du DAT renvoie à `docs/projet/ARCHITECTURE.md` comme seule source, absent chez un produit repris

**Le fait.** Le 24/11/2026, le gabarit `gd-dossier-architecture` 1.1.1 fait de `ARCHITECTURE.md` et `COMPOSANTS-OPS.md` la source de vérité des sections 2 et 3, et interdit de recopier. Produit-81, repris d'un existant, n'a ni l'un ni l'autre. Sa vue logique vit dans 4 documents : matrice des flux, contrat OpenAPI, modèle de données, identités et rôles ; son inventaire vit dans le README et les fichiers `tfvars`. Il a fallu ajouter à la main un tableau « sujet / document qui fait foi ». La confrontation au code a montré que la matrice des flux, relevée le 16/10, était en retard pour 3 flux.

**Le coût, prouvé.** Une section écrite hors gabarit ; sans la confrontation au code, un renvoi pointait vers un document périmé.

**La règle qui aurait évité le retour.** Le gabarit admet, en section 2, une liste déclarée des documents qui font foi quand `ARCHITECTURE.md` manque, et exige la date de relevé de chaque document renvoyé.

**Juge proposé.** `oracle-gabarits-documents --livrable` vérifie, pour la famille DAT, que chaque renvoi de la section 2 porte une date de relevé. **Clé proposée** : `gabarit-source-de-verite-absente`, famille `gabarit-document`, libellé « Un gabarit renvoie à un document de socle que le produit n'a pas, sans prévoir sa substitution déclarée : chaque produit repris réinvente la liste des sources ».

## RT-44 (mineur) — oracle-lecture-tiers T2 ne reconnaît pas une glose qui commence par une élision

**Le fait.** Le 24/11/2026, 3 en-têtes de colonne sur 34 portent `data-definition` et `title` (« L'effet d'une indisponibilité… », « L'outil, le test… », « L'indice… ») ; T2 les déclare non glosés. L'expression exige 3 caractères sans apostrophe dès l'ouverture de l'attribut (`[^"']{3,}`) : l'apostrophe en deuxième position coupe la correspondance.

**Le coût, prouvé.** Un bloquant faux, une passe d'oracle de plus, trois gloses reformulées sans élision.

**La règle qui aurait évité le retour.** La valeur d'un attribut se lit selon son délimiteur réel.

**Juge proposé.** Capturer la valeur entre ses guillemets (doubles ou simples) puis mesurer sa longueur ; banc : `data-definition="L'effet de…"` reconnu.

## Rattachement

Registre interrogé le 24/11/2026 : `todo/CLASSES.json` du pilot (331 classes).

- RT-42 : `gabarit-conception-non-jugee` vise une conception sans oracle, pas un sceau posé avant le lanceur complet ; aucune clé ne vise l'ordre sceau puis oracles. Clé neuve en `classe-a-creer`.
- RT-43 : `gabarit-famille-manquante` vise une famille absente, pas une source de vérité absente. Clé neuve en `classe-a-creer`.
- RT-44 : `oracle-faux-positif`, reproduite.

## Remarques restées au produit

- La procédure Data Factory du 12/11/2026 n'est pas enregistrée dans le dépôt du produit — généralisable : non, propre à Produit-81.

## Retours sur les documents produits

- **Gabarit** : `gd-dossier-architecture`, version `1.1.1`.
- **Ajouté à la main** : un tableau « sujet / document qui fait foi » en section 2 (voir RT-43).
- **Gêne du lecteur** : aucune mesurée à ce jour, le document n'a pas encore été lu par la Design Authority.
- **Manque** : aucune place prévue pour les écarts trouvés entre un document renvoyé et le code.
- **Portée** : valable pour la famille.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
