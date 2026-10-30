---
role: étude d'opportunité (gabarit gabarits\ETUDE-OPPORTUNITE.md, TF-0155) — compléter le traitement des PDF et l'intégrer à la Factory
destinataire: humain
sources_de_verite:
  - transcriptions des 2 profils du poste Dell-XPS-16, 522 fichiers, du 2026-09-11 au 2026-10-30
  - PDF du parc C:\dev, 1 044 fichiers lus en lecture seule le 2026-10-30
  - relevé de 9 dépôts par un agent explorateur le 2026-10-30, code lu, rien exécuté
  - banc jetable sur PDF synthétiques, joué le 2026-10-30 dans le dossier temporaire
verifie_le: 2026-10-30
---

# Étude d'opportunité — skill PDF de la Factory — 20261030a

**La réponse.** Oui, un skill maison mince se justifie, à deux conditions : il ne touche pas au skill `pdf` d'Anthropic, dont la licence interdit toute œuvre dérivée, et il ne remplace pas les chaînes des produits. Le besoin réel est plus étroit que prévu : 14 demandes en 49 jours, 2 formulaires à compléter, aucune demande d'OCR ni de classement. Le risque mesuré porte sur les formulaires : un contrat et un mandat de prélèvement ont été remplis le 30/10 sans aucun contrôle exécuté sur le fichier rendu. Le verdict retient O2, construit dans cet ordre : d'abord l'oracle et les formulaires, ensuite le tri des PDF et l'OCR.

O0 à O4 désigne le jeu fermé d'options du gabarit, O0 voulant dire ne rien changer. M-01 à M-10 désignent les mesures de la section qui suit.

## Seuil de déclenchement (vérifié avant écriture)

Le seuil est atteint : le sujet crée un objet durable, un skill et son oracle (`gabarits\ETUDE-OPPORTUNITE.md`, lignes 15-17). Il touche aussi au moins 3 forges si l'on suit la demande au pied de la lettre : forge-agents pour le skill, forge-conception pour la conversion des entrants, forge-audit pour les PDF produits.

## Intention de l'utilisateur (loi n° 7, TF-0791)

L'intention se cite dans les mots du demandeur, tous du 30/10/2026 :

> « Est-ce qu'il y a un ou plusieurs skills PDF liés à la Factory, notamment pour traiter et/ou identifier les différents types de documents PDF, avec ou sans OCR ? Et la gestion des formulaires à compléter ? »
>
> « Est-ce qu'il y a une pertinence à lancer une étude d'opportunités pour compléter le skill pdf avec d'autres fonctionnalités et l'intégrer dans la Factory ? »
>
> « ok, lance l'étude »

La demande porte 4 capacités : traiter, identifier les types, lire avec ou sans OCR, compléter les formulaires. Le mot « types » reste ouvert entre le type technique (natif, scan, formulaire) et le type métier (facture, bail, CV). L'étude instruit les deux. Le demandeur a lancé l'étude après avoir lu que la licence fermait la voie du complément : l'objet instruit est donc un skill maison.

## 0. Traitement des entrants

La proposition instruite est une donnée. Sources : les 3 messages cités, les 2 réponses de la session du 30/10/2026, et aucun lot ni item préalable du registre. Le code et les documents des produits ont été lus sans rien exécuter, et leurs noms sont remplacés par leurs pseudonymes parce que le pilot est public.

Environnement déclaré (étape C0 de `references\RUN-CONSEIL.md`) : le poste Dell-XPS-16, racine `C:\dev`, Windows 11, Python 3.12. L'autre poste du parc n'a pas été mesuré.

## Mesures

| Id | Fait mesuré | Source et limite |
|---|---|---|
| M-01 | 16 messages humains sur 1 159 citent un PDF, dont 2 de cette session. Les 14 autres, classés à la main : 5 pour lire, 5 pour produire, 2 pour compléter, 2 pour modifier. Aucun ne demande de classer des documents. | Transcriptions du 11/09 au 30/10/2026, messages de moins de 4 000 caractères, motif `\bpdfs?\b`. Un message qui dit « ce scan » sans le mot PDF échappe. |
| M-02 | Le skill `pdf` a été appelé 1 fois en 49 jours, dans 1 session. Les 4 sessions relues pour compléter ou modifier ont toutes écrit un script ad hoc sur `pymupdf`. | Mêmes transcriptions, appels d'outils. |
| M-03 | 1 044 PDF, 855 distincts dans 21 dépôts : 740 natifs (86,5 %), 45 scans (5,3 %), 39 hybrides (4,6 %), 31 autres (3,6 %). | Seuil de 40 caractères par page, 30 premières pages pour les fichiers non suivis ; distinct veut dire même taille et même nombre de pages. |
| M-04 | 5 PDF distincts seulement portent de vrais champs de saisie. Les 55 PDF suivis à champs de signature seule et les 61 à boutons de navigation d'un même produit n'en sont pas. XFA, le format de formulaire XML : 0 sur 602 PDF suivis. | Lecture des widgets. Un formulaire plat n'a aucun champ : cette mesure ne le voit pas, et XFA n'a pas été mesuré sur les 442 non suivis. |
| M-05 | Les 2 demandes réelles de formulaire datent du 28 et du 30/10. La première porte 35 champs (6 texte, 28 cases, 1 signature), la seconde 2 PDF plats, sans aucun champ. Durées : 14 et 9 minutes, aucune relance humaine, 2 erreurs `ModuleNotFoundError`. | Transcriptions. La première session dit avoir regardé le rendu ; aucun contrôle sur fichier n'est enregistré dans l'une ou l'autre. |
| M-06 | Sur 9 dépôts repérés par motif, 7 portent du vrai code PDF, 2 de simples mentions. 4 appellent un OCR, tous en local, avec 3 piles : `ocrmypdf`, `pytesseract` 2 fois, `Windows.Media.Ocr`. 2 classent des documents, par règles. 0 remplit un formulaire. 0 ligne de code métier partagée. | Relevé de l'agent, fonctions lues et non fichiers entiers ; déploiement non lu. |
| M-07 | OCR de Windows en français, sur 1 page synthétique : fidélité de 99,2 à 99,5 % sur image propre. Sur image dégradée : 92,5 % à 100 ppp, 98,3 % à 150, 99,5 % à 200, 99,4 % à 300. De 35 à 276 ms par page. | `SequenceMatcher` de Python, pas un taux d'erreur de caractères. Police nette, 1 colonne, ni tableau ni manuscrit : ce banc prouve que la voie fonctionne, pas sa qualité sur un vrai scan. |
| M-08 | `pypdf` 4.3.1 crée puis relit un formulaire synthétique rempli : 2 champs sur 2 relus, accents compris. | Banc jetable, 1 fichier. |
| M-09 | Licences : `pymupdf` AGPL 3.0 ou commerciale ; `pypdf` et `reportlab` BSD ; `pypdfium2` BSD et Apache ; `pdfplumber` MIT. Le `LICENSE.txt` de `pdf` interdit les œuvres dérivées, les copies hors du service et la redistribution. | Métadonnées des paquets installés, lues le 30/10/2026. Cette lecture n'est pas un avis juridique. |
| M-10 | Le registre de `quality-oracles` juge les polices d'un PDF et son format imprimé, `verifier-pdf.mjs` le contenant. Aucun ne juge un champ rempli ni une extraction. | Recherche de `\bpdf\b` dans `registre-oracles.md`, puis lecture des lignes 15, 20 et 614 à 639 ; `verifier-pdf.mjs` ligne 44 le déclare. |

**Limites de cette recherche d'absence.** « 0 remplit un formulaire » (M-06) repose sur des noms de bibliothèques et de fonctions, puis sur la lecture de leurs appels. Une bibliothèque non listée échapperait à ce motif. La recherche par structure, celle des widgets de M-04, porte sur les fichiers et non sur le code.

## 1. Partition du problème

- **P1 — Identifier le type technique** : natif, scan, hybride, formulaire, signé, chiffré.
- **P2 — Identifier le type métier** : facture, bail, CV, contrat.
- **P3 — Lire** : texte et tableaux d'un natif, OCR d'un scan.
- **P4 — Compléter un formulaire** : à champs ou plat, puis contrôler le résultat.
- **P5 — Transformer** : fusion, découpe, rotation, modification d'un texte existant.
- **P6 — Intégrer** : emplacement dans les forges, appel par les autres skills, oracle au registre.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Skill `pdf` d'Anthropic | `FORMS.md` lignes 3-4 et 78-79 ; `SKILL.md` lignes 233-250 pour l'OCR | Recouvre P3 natif, P4 sans contrôle et P5 fusion et découpe ; ne recouvre pas P1, P2 ni le contrôle |
| `verifier-pdf.mjs` de forge-audit | ligne 44 : « le CONTENU du PDF : ni le texte, ni les polices incorporees, ni les images » | Ne recouvre pas : il juge le contenant |
| `fiche-en-pdf.mjs` de forge-audit | en-tête, TF-0700 : « imprimé depuis le HTML, jamais capturé » | Ne recouvre pas : il produit un PDF |
| `oracle-polices-embarquees.mjs` de quality-oracles | `registre-oracles.md` ligne 20 | Ne recouvre pas : il juge les polices |
| `digit-ai-docx` de forge-agents | `SKILL.md` ligne 90 : « Le PDF : exporter depuis Word ou un convertisseur » | Ne recouvre pas : il rend du DOCX |
| `qualifie-l-entrant` de forge-conception | `references/entrants.md` lignes 38-40 : « Un PDF ou un DOCX se convertit avant » | Ne recouvre pas : il exige la conversion sans nommer d'outil, et ce manque est un appel possible du skill |
| `references\RUN-AO.md` du pilot | ligne 62 : « DOCX ou PDF à trame imposée » par le skill de TF-1027 | Ne recouvre pas : TF-1027 a livré `digit-ai-docx`, qui ne rend pas le PDF ; cet écart de la référence devient une proposition à part |
| Chaîne de Produit-12 | `forge/etapes/conception/norme-rangement/lecture.py` ligne 79 et `ocr_windows.ps1` | Recouvre P1 partiel et P3 pour ce produit seul ; source de méthode, licence AGPL par `pymupdf` |
| Chaîne de Produit-01 | `adapters/ocr_tesseract.py` lignes 96-177 | Recouvre P3 pour ce produit seul |
| Chaîne de Produit-73 | `app/services/pdf_parser.py` lignes 85 et 115-166 | Recouvre P2 et P3 pour un seul type de facture |

## 3. État de l'art daté

- Anthropic, *PDF support*, platform.claude.com, lu le 2026-10-30 ; note de version du 2026-03-13 : jusqu'à 600 pages par requête dans une fenêtre de 1 M de jetons, 100 sinon, chaque page traitée comme une image.
- Docling 2.141.0, pypi.org, publié le 2026-10-20 : licence MIT, moteurs OCR interchangeables dont Tesseract, aucune fonction de formulaire trouvée dans les sources lues.
- OCRmyPDF, Debian Package Tracker, 2026-04-27 : version 16.13.0 en testing ; sa licence n'a pas été confirmée par ces sources.
- Codesota, *OCR, best for Python*, 2026, lu le 2026-10-30 : PaddleOCR pour la précision, Tesseract pour le volume, Surya pour la mise en page ; test de 24 éléments en anglais.
- imagetotable.ai, *Receipt OCR benchmark*, 2026, lu le 2026-10-30 : taux d'erreur de caractères de 19,7 % pour docTR, 20,5 % pour PaddleOCR, 33,6 % pour Tesseract, 58,4 % pour Docling ; éditeur commercial, tickets en anglais.
- Unstract, *Best Open Source OCR Tools*, 2026, lu le 2026-10-30 : panorama, lu par un résumé de recherche seulement.

Aucune source lue ne compare ces moteurs sur des documents français. Le choix d'un moteur se fera donc sur un banc propre, au lot 2. Les sources sur XFA et sur `pdf-lib` n'ont rien rendu d'exploitable, et le corpus (M-04) ne rend pas la question urgente.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : réfutée pour les formulaires, tenable pour le reste. Les 14 demandes ont été servies et aucune relance n'a suivi les 2 formulaires (M-05). Le coût du statu quo est ailleurs : un document destiné à la signature sort sans contrôle sur fichier (M-05, M-10), chaque session réécrit son script sur une bibliothèque AGPL (M-02, M-09) et installe ses dépendances au passage (M-05). La loi de qualité du poste impose aussi de définir un oracle pour un domaine qui n'en a pas.
- **O1 — un oracle et une fiche de voies** : un oracle du formulaire rempli au registre de `quality-oracles`, plus une référence qui dit quelle voie prendre. Coût : simple × court. Exclut P1, P2 et tout outil de lecture. Couvre le risque mesuré mais laisse sans réponse 2 des 4 capacités demandées.
- **O2 — un skill maison mince, `digit-ai-pdf`, à forge-agents** : l'oracle de O1, plus P1, P3 et P4 sur des bibliothèques permissives. Renvoie la fusion et la découpe à `pdf`, appelé tel quel. Coût : moyen × court. Exclut le remplacement des chaînes des produits et le type métier avant le lot 3.
- **O3 — une bibliothèque commune aux produits** : O2, plus la migration des 4 chaînes OCR, les modèles lourds et un référentiel de types métier. Coût : complexe × long. Réfutée par M-06 (aucune ligne partagée, donc aucune dette commune à résorber) et par M-01 (aucune demande de classement).
- **O4 — étendre une copie de `pdf`** : la lettre de la demande. Coût : sans objet. Réfutée par M-09 : la licence interdit la copie et l'œuvre dérivée, et les forges sont publiques.

## 5. Verdict

- **Option retenue** : O2.
- **Coût** : complexité moyen · durée court ; dette : 1 skill et 1 oracle à maintenir, 1 banc de scans français à tenir sans donnée réelle publiée.
- **Lots** :
  - Lot 1, oracle et formulaires. L'oracle relit chaque champ, compare aux valeurs demandées, rend chaque page et signale ce qui déborde. Il traite les champs et les PDF plats, avec une fixture rouge et une verte. Utile : M-05 ; utilisable : 1 commande ; utilisé : la prochaine demande de formulaire passe par lui.
  - Lot 2, tri et lecture. Le tri rend la nature page par page et le chemin à suivre, l'OCR passe par Windows d'abord. Le banc compare Windows, Tesseract et la lecture d'image par Claude, en aveugle, sur des scans français. `qualifie-l-entrant` l'appelle pour sa conversion et ses pages illisibles.
  - Lot 3, conditionnel. Type métier par lecture de Claude sur un référentiel éditable, et modification d'un texte existant. Il ne s'ouvre que sur 3 demandes nouvelles relevées à la revue.
- **Limite assumée** : modifier un texte de PDF reste pour l'instant une affaire de session, sur `pymupdf`, sans l'embarquer dans une forge. `pypdf` ne supprime pas proprement un texte en place.
- **Candidature(s) émise(s)** : 2 items au registre, le skill et l'écart de `references\RUN-AO.md`, tous 2 au statut candidat.
- **Plan de revue** : 2026-12-15. Relever les appels du skill contre les demandes PDF de la période. Si le lot 1 est livré et moins de 2 demandes sur 3 passent par lui, retirer ce qui ne sert pas.
- **Test rétro** :
  - Oracle du formulaire → fiabiliser ce qui part à la signature → gestion des formulaires à compléter → intention tenue.
  - Tri page par page → savoir quelle voie suivre → identifier les types, avec ou sans OCR → intention tenue pour le type technique.
  - Lot 3 → type métier → même intention, reportée faute de demande mesurée : l'écart se dit, il ne se cache pas.
  - Question 1 rejouée, y a-t-il des skills PDF : 1 seul, d'Anthropic, hors forges.
  - Question 2 rejouée, y a-t-il une pertinence : oui pour O2, non pour compléter `pdf`.
