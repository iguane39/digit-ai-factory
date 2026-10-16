# Lot de retours — Produit-64 → digit-ai-forge-agents — 2026-09-28, indice c

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-forge-agents` (source versionnée du
skill `quality-oracles`) · **Origine** : la vérification, par l'orchestrateur `run-oracles.mjs`, du support
de Design Authority « Règles communes des applications IA » produit le 28/09/2026 par la session de ce
produit.

Ce lot porte **1 retour**, mesuré pendant cette vérification.

- **Contexte** : demande du porteur du 28/09/2026 — créer une présentation de Design Authority sur six
  sujets transverses des applications IA. Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-28** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`)

L'orchestrateur a jugé le support sur six domaines ; un seul a rendu rouge, et il a rendu rouge sur le
format de référence du client lui-même.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-5 | majeur | générique | **Les règles S3 et S4 d'`oracle-charte-pptx-semantique` jugent tout `.pptx` à la charte Digit-AI, quel que soit le profil.** `node scripts/run-oracles.mjs "output/04-Go-Prod/Client-A - Design Authority - Regles communes des applications IA - 20260928a.pptx" --profil generique` rend FAIL sur le seul domaine « Charte PPTX sémantique » : **69 constats**, 21 × S3 « image au gabarit logo (≤ 2000000 EMU) hors couverture/interlocuteurs » — des icônes de contenu de 0,2 à 0,3 in — et 48 × S4 « footer absent / pagination absente (placeholder ftr / sldNum au niveau slide) ». Les cinq autres domaines rendent PASS ou sans objet. Le même oracle rend FAIL sur le support Design Authority du 10/09 déjà présenté (19 S3, 26 S4). Le deck de référence du format, `input/04-Design Authority/06-Archi Emal & Typologies Projets/Client-A - Design Authority - Architectures Web et Envoi de Mails - 20260901c.pptx`, produit hors des outils de la forge et présenté le 03/09, porte **34 petites images** et **aucun** espace réservé `ftr` ni `sldNum` (relevé par lecture du paquet, 18 diapositives). La cause est au registre : le domaine « Support de diapositives (parité de format par profil) » passe `--profil {profil}` à `oracle-pptx.mjs`, le domaine « Charte PPTX sémantique » n'en passe aucun (`cmd` : `node {skilldir}/scripts/oracle-charte-pptx-semantique.mjs {file}`). Pied de page et pagination du support sont pourtant jugés, en zones de texte, par l'oracle local du produit (`tools/design-authority/oracle-da-pptx.mjs`, règle F4 : PASS, 20 pages paginées sur 25). Seule issue au vert : une exemption par fichier dans `.oracles-exemptions.json` — posée ici, échéance 31/12/2026 — et chaque support suivant en demandera une | piloter S3 et S4 par la politique pptx du profil — une zone admise pour les logos, une forme admise pour le pied de page (`espace-reserve` ou `zone-texte`) — comme `oracle-pptx` le fait déjà pour P1 à P3 ; ou réserver le domaine au profil `digit-ai` dans le registre. Fixture : le deck de référence d'un client, sous une forme FICTIVE (icônes, pied de page en zone de texte), vert sous son profil et rouge sous `digit-ai` |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'oracle local `oracle-da-pptx.mjs` (F6) ne savait vérifier que des adresses, des URL et une redirection : un support sans adresse ne pouvait pas déclarer ses faits attendus | clé générique `textes` ajoutée le 28/09 ; non-régression jouée sur le support du 10/09 (PASS, 0 finding) | non | l'oracle est propre au format Design Authority de ce produit, aucune forge ne l'emploie |
| Le script de rendu `tools/design-authority/rendre-pptx.ps1` quitte l'instance PowerPoint à la fin, même quand l'utilisateur l'avait ouverte | variante qui ne quitte que si l'instance était vide, jouée quatre fois le 28/09 pendant un diaporama ouvert, sans l'interrompre | non | outil local du produit ; la correction de l'outil lui-même est une action du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : le support du 28/09 en est à son premier indice et n'a encore reçu
aucun verdict de son lecteur.

## Confirmations positives

- **L'exemption tracée a tenu son contrat** : posée dans `.oracles-exemptions.json` avec fichier,
  domaine, justification et échéance, elle est affichée en toutes lettres par l'orchestrateur
  (« EXEMPTÉ : … (échéance 2026-12-31) ») et le verdict rendu est « CONFORME — 4 PASS, 1 SKIP,
  0 échec » : rien n'a été masqué.
- **`oracle-pptx` et `verifier-ooxml`** ont rendu PASS sur le paquet produit par pptxgenjs 4.0.1
  (1 541 blocs `a:ln` / `a:rPr` / `a:defRPr` contrôlés, 0 en faute).

## Ordre recommandé

1. RA-5 — chaque support d'un client dont le format n'est pas celui de Digit-AI paiera une exemption,
   et un domaine qui rend rouge à tort apprend à ignorer le juge.

## La règle qui aurait évité le retour

- **RA-5** — la classe existe : `oracle-faux-positif` (famille `regle-morte`, « Un oracle rend rouge
  sur un artefact conforme »). La règle qui l'aurait évité est déjà écrite au registre, pour le domaine
  voisin : la note TF-1130 du domaine « Support de diapositives (parité de format par profil) » — « les
  règles de marque passent par SON profil (format, polices, palette relevés sur son deck de référence),
  qui vit chez lui ». Elle n'a pas été étendue au domaine « Charte PPTX sémantique ».
