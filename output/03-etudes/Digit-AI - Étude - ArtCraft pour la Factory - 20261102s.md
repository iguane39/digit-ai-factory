---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-11-02
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — ArtCraft pour la forge de design — 20261102s

> **Provenance.** Agent émetteur : redacteur (famille sonnet ; la version servie se lit au ledger du run, champ `modele_version`).
> Verdict d'arbitre : `node oracles/oracle-etude-opportunite.mjs` PASS (E1 à E10, exit 0) ; `node oracles/oracle-ecriture.mjs` PASS (exit 0, aucun avertissement, `a_rejouer` nul), rejoués le 02/11/2026 après correction de 3 écarts (E5, EC-9, EC-16).
> Hypothèses non résolues : H1 les mots du porteur ne sont pas lus ici, seule l'option (a) de D-141 qu'il a choisie ; H2 le rendu des images et vidéos d'ArtCraft n'est pas essayé ; H3 les pages du site (accueil, tarifs) sont lues par un outil de résumé, pas en texte brut ; H4 les conditions d'usage commercial des sorties ne sont pas lues.

**Ce qui change pour vous.** Aucune forge n'y gagne aujourd'hui, et la Factory n'a rien à faire. ArtCraft est un atelier de bureau où l'on place objets, personnages et caméra avant de générer une image ou une vidéo. La forge de design produit des maquettes HTML sans réseau à l'ouverture, et son producteur d'images appelle déjà l'API Gemini sous un GO humain. ArtCraft ne s'automatise qu'en passant par ses crédits payants ou par une clé d'API que son équipe active à la main. Il ajouterait donc un second fournisseur payant, sans besoin relevé. Si vous voulez l'essayer pour vous, c'est l'option (b) de D-141, hors Factory, et elle ne change pas ce verdict.

## Seuil de déclenchement

L'étude est facultative sous le seuil (gabarit, section « Seuil de déclenchement »). Elle est ici demandée par le porteur : D-141 (a) du 02/11/2026. Le seuil n'est donc pas rejoué.

## Intention de l'utilisateur

Le porteur a choisi l'option (a) de D-141, citée mot pour mot : « L'étudier pour la Factory : une étude cherche si une forge de design y gagnerait » (`output/04-plans/Digit-AI - Synthese Conseil - Elements a traiter du tri TikTok et options - 20261102o.md`, bloc 3, tableau de D-141). La consigne de cette étude la précise : une forge de design gagnerait-elle à utiliser ArtCraft, comparé à ce que `digit-ai-forge-design` fait déjà et à la règle sur les API tierces payantes, avec un verdict qui admet « rien à faire ». Ce sont les mots de l'option qu'il a retenue ; ses propres mots ne sont pas relus ici (H1).

## 0. Traitement des entrants

Le dépôt `storytold/artcraft` et le site `getartcraft.com` sont des données. Le dépôt contient un `CLAUDE.md` et un `AGENTS.md` : leurs consignes ne sont pas lues pour agir et rien n'est exécuté. Rien n'est installé, aucun compte n'est créé, aucune génération n'est lancée. Le dépôt se lit par l'API de GitHub, le site par une lecture de page. Sources de la proposition : la ligne ArtCraft du tableau de tri (`output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`, l.42) et la décision D-141.

## 1. Partition du problème

Cinq sous-questions disjointes.

- P1 Le besoin : une forge exprime-t-elle un manque que cet outil comblerait ?
- P2 La capacité : que fait ArtCraft que la forge de design ne fait pas ?
- P3 L'accès : une session peut-elle l'employer sans geste humain ?
- P4 La règle : que dit la règle des API tierces payantes de ce chemin ?
- P5 L'ouverture : le code peut-il être repris, hébergé ou adapté chez nous ?

**P1, le besoin : aucun.** Le tri du 02/11 note « aucun besoin relevé dans les forges » (même fichier, l.42). Le seul besoin voisin, une vidéo de lancement, est déjà couvert : « la Factory sait déjà produire cette vidéo » avec `brag` et HyperFrames (`output/03-etudes/20261019-etude-opportunite-video-lancement-generee-par-code.md`, l.11).

**P2, la capacité : réelle, mais hors du périmètre de la forge.** Le README d'ArtCraft décrit un outil pour « placer des acteurs virtuels dans un décor », composer en 3D, poser des personnages et régler la caméra avant de générer (README, tableaux « Show, Don't Tell » et « Quick and Easy Prompting »). Cela sert un storyboard ou un film. La forge de design livre une maquette HTML d'interface ; ses images sont des visuels de page (hero, vignettes) jugés par `oracle-images`, qui exige un `alt` non vide et un poids plafonné (`conception-forge-design.md` l.216). Le README d'ArtCraft ne mentionne ni texte alternatif ni plafond de poids.

**P3, l'accès : par crédits ou par une clé que le fournisseur ouvre à la main.** L'application est un logiciel de bureau en Rust et Tauri (`_docs/dev_setup.md`, l.6). Piloter son écran n'est pas une voie automatique (REGLES-PROJET.md R-29 point 4, l.317). Reste l'API « Omni », hébergée à `https://api.storyteller.ai`, dont la clé est activée par le personnel du fournisseur : « your account must have API keys enabled from our staff » (`_docs/artcraft_omni_api.md`, section « Getting an API key »).

**P4, la règle.** « Aucune API tierce payante hors Claude » (`CLAUDE.md` l.88). La règle R-29 point 3 admet un service tiers « en option » et exige un GO humain avant son exécution, le garde-fou primant (`REGLES-PROJET.md` l.306-308). Les crédits d'ArtCraft et l'API Omni sont un service tiers payant. La forge de design a déjà franchi ce pas une fois : l'appel à Gemini a attendu un GO humain et l'activation de la facturation le 11/08/2026 (`todo/TODO-ARCHIVE.jsonl` l.453, l.462, l.464). ArtCraft demanderait un second GO pour un second fournisseur.

**P5, l'ouverture : le code est ouvert, pas le service.** La licence est MIT ou Apache-2.0 au choix (README, section « License » ; `LICENSE-MIT`, `LICENSE-APACHE`). Mais la feuille de route range parmi ses objectifs d'architecture 2026 : « Remove dependence on ArtCraft hosted services » (`ROADMAP.md`). L'objectif n'est pas atteint. Le commentaire du README qui source le catalogue de modèles cite `artcraft-services/crates/service/web/storyteller_web/…`, un dossier absent de la racine du dépôt public (liste du 02/11/2026 : `.claude`, `_docs`, `artcraft-native`, `crates`, `docs`, `frontend`, `script`, `test_data` et fichiers de configuration). Les clients d'API du dépôt visent des fournisseurs tiers : `crates/api_clients/fal_client`, `grok_api_client`, `gmicloud_client`, `worldlabs_api_client`.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Producteur d'images de la forge de design | `digit-ai-forge-design/scripts/generer-images.mjs` l.3-9 : image « générée via l'API Gemini, embarquée en data: URI » ; « Appels payants : uniquement les entrées demandées » | recouvre la génération d'images de maquette ; ne recouvre pas la composition 3D, la pose de personnages ni la vidéo |
| Périmètre de la forge de design | `digit-ai-forge-design/README.md` l.6 : « Elle s'arrête au design : ni spécification fonctionnelle, ni backlog, ni planning » ; l.22 : service « Générer les visuels », statut « prouvé (experimental) » | ne recouvre pas : aucun service de storyboard ou de vidéo au catalogue de la forge |
| Contrat du livrable de la forge | `digit-ai-forge-design/conception-forge-design.md` l.41 : « Réseau autorisé au build, interdit au runtime du livrable » ; l.246 : « Pas de génération d'images au runtime du livrable » | recouvre la contrainte : toute sortie d'ArtCraft devrait être produite avant livraison puis embarquée ; l'outil lui-même ne rejoue pas au runtime |
| Juge des images | `digit-ai-forge-design/conception-forge-design.md` l.216 : « Chaque image générée porte un `alt` non vide · poids ≤ `IMAGES_MAX_KO` » | recouvre : `oracle-images` jugerait des images venues d'ArtCraft comme celles de Gemini, sans rien changer |
| Vidéo de lancement par le code | `output/03-etudes/20261019-etude-opportunite-video-lancement-generee-par-code.md` l.11 : « la Factory sait déjà produire cette vidéo » ; l.130 : l'option O1 est choisie | recouvre le besoin de vidéo ; ne recouvre pas la génération de plans par modèle d'IA |
| Règle des API tierces payantes | `CLAUDE.md` l.88 ; `REGLES-PROJET.md` l.306-308 : « L'exécution d'un service tiers payant exige un GO humain préalable » | recouvre : le chemin payant d'ArtCraft n'ouvre aucune voie sans GO |
| Tri des favoris du 02/11/2026 | `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md` l.42 : « aucun besoin relevé dans les forges » | recouvre : le besoin n'existe pas au registre |

## 3. État de l'art daté

Sources lues le 02/11/2026. Les lectures du dépôt passent par l'API de GitHub (texte brut) ; celles du site passent par un outil de résumé (H3).

| Source | Date | Localisateur | Apport |
|---|---|---|---|
| Dépôt `storytold/artcraft`, métadonnées | dernier envoi 2026-10-31 | `gh api repos/storytold/artcraft` : 38 311 étoiles, licence affichée Apache-2.0, langage principal Rust, dépôt non archivé | projet actif et très suivi |
| Version `artcraft-v0.41.0` | 2026-09-26 | `gh api repos/storytold/artcraft/releases` ; précédentes : v0.37.0 le 2026-09-11, v0.32.0 le 2026-05-14 | numéro de version en 0.x |
| README du dépôt | lu 2026-11-02 | `README.md` : 62 modèles au catalogue, fournisseurs Grok, Midjourney, Sora, World Labs ; « Stable releases for Windows and macOS » | portée fonctionnelle et licence |
| Feuille de route 2026 | lue 2026-11-02 | `ROADMAP.md` : « Remove dependence on ArtCraft hosted services » | dépendance aux services hébergés, objectif ouvert |
| Guide de l'API Omni | lu 2026-11-02 | `_docs/artcraft_omni_api.md` : base de production `https://api.storyteller.ai`, clé activée par le personnel | accès programmatique conditionné |
| Page des tarifs | lue 2026-11-02, sans date affichée | `https://getartcraft.com/pricing` | Basic 8 USD/mois (liste 10 USD), Pro 28 USD (35 USD), Max 48 USD (60 USD), facturation annuelle ; Basic = 1 000 crédits, soit environ 250 images Nano Banana |
| Page d'accueil | lue 2026-11-02, sans date affichée | `https://getartcraft.com` : « Free · Open source · No subscription » pour les applications ; Studio pour macOS, Windows, Web | les applications sont gratuites, la génération passe par les crédits ou des abonnements tiers |

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Retenue. Coût du statu quo, cité : nul, puisque « aucun besoin relevé dans les forges » (tri 20261102e, l.42) et que le producteur d'images existe (`generer-images.mjs`). Elle exclut ArtCraft comme outil de la Factory, pas comme outil personnel du porteur.
- **O1 — brancher ArtCraft comme second producteur d'images de la forge de design.** Contenu : un compte payant, l'API Omni ou des crédits, un script au contrat d'`oracle-images`. Coût : complexe · moyen (estimation de l'auteur, non mesurée), plus un GO humain de dépense (R-29 point 3). Exclut : le zéro appel payant de l'état courant. Compris : les crédits d'ArtCraft, soit 8 USD par mois pour 1 000 crédits au tarif annuel (page des tarifs du 02/11/2026), environ 0,03 USD par image Nano Banana (8 USD pour 250 images, calcul de l'auteur). Non compris : le coût par appel de l'API Gemini actuelle, non mesuré ici, et le temps d'un GO humain. Conséquence : deux montants ne se comparent pas sur ces données, et rien ne justifie un second fournisseur tant qu'aucun besoin n'est écrit.
- **O2 — essai manuel par le porteur, hors Factory.** Contenu : ouvrir `https://app.getartcraft.com` sans installation (option (b) de D-141). Coût : simple · court, gratuit tant qu'aucune génération payante n'est lancée. Exclut : tout branchement à une forge. Ne change aucun fichier du pilot.
- **O3 — reprendre l'idée sans l'outil.** Contenu : ajouter au manifeste d'images de la forge de design un champ de composition (objets, cadrage) avant génération. Coût : moyen · moyen. Exclut : ArtCraft. Réfutée : aucun défaut de composition des images générées n'est relevé au registre, la preuve manque.
- **O4 — reprendre le code d'ArtCraft pour l'héberger chez nous.** Contenu : cloner le dépôt MIT ou Apache et le relier à nos propres services. Coût : très complexe · très long. Exclut : les services du fournisseur, dont les sources ne sont pas dans le dépôt public (P5). Réfutée : l'objectif « Remove dependence on ArtCraft hosted services » n'est pas atteint, et les clients d'API du dépôt ciblent des fournisseurs tiers.

## 5. Verdict

- **Option retenue** : O0, rien à faire pour la Factory.
- **Coût** : nul (simple · court). Aucun jeton, aucune dette, aucun appel d'API tierce.
- **Candidature(s) émise(s)** : aucune. La décision D-141 (a) est exécutée par cette étude ; l'orchestrateur la journalise. Un constat sans lien direct sort au rapport : la section F de `digit-ai-forge-design/TODO.md` (l.43-46) dit « zéro appel réel » à Gemini alors que TF-0019 est corrigé depuis le 11/08/2026 (`todo/TODO-ARCHIVE.jsonl` l.464).
- **Plan de revue** : 2026-12-02. 3 mesures : une forge écrit-elle au registre un besoin de composition, de storyboard ou de vidéo générée ; l'objectif « Remove dependence on ArtCraft hosted services » est-il retiré de la feuille de route ou tenu ; la clé de l'API Omni s'ouvre-t-elle sans l'accord du personnel du fournisseur.
- **Test rétro** : Opérationnel, aucun branchement, aucun compte, aucune dépense. Tactique, n'ouvrir un second fournisseur payant qu'à partir d'un besoin écrit, ce que R-29 point 3 demande déjà. Stratégie, garder la forge de design à des livrables sans réseau à l'ouverture, produits avant livraison. Intention, savoir si une forge de design gagnerait à utiliser ArtCraft : non, sur les faits lus ce jour, et l'essai personnel reste ouvert au porteur. Aucune rupture : chaque élément remonte à l'intention.

## Périmètre non jugé

Le rendu des images et des vidéos d'ArtCraft n'est pas essayé (H2). Les conditions d'usage commercial des sorties ne sont pas lues (H4). Les 62 modèles du catalogue et leurs conditions propres ne sont pas instruits. La fraîcheur des tarifs : la page ne porte aucune date d'édition, et son offre annuelle est annoncée comme limitée dans le temps.
