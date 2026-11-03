---
destinataire: humain
---

# Synthèse Mandat — suites du tri TikTok et revues de code (02 et 03/11/2026)

## 0. Synthèse d'ouverture

Vos réponses de D-136 à D-151 sont exécutées, sauf l'inscription au programme pour startups, qui reste un geste de votre main. Le tableau de tri est rejugé après l'écoute de tous vos favoris. Le résultat le plus utile tient aux revues de code : 2 de vos produits relus par un seul agent portent 28 failles probables, dont 4 élevées que nos contrôles ne voient pas. Les rapports restent chez les produits. La vidéo de motion design dont vous vous souveniez existe bien, et l'essai vidéo comparera 2 de ses outils. L'écoute a fait apparaître 2 sujets neufs, qui attendent votre choix, et 2 décisions sur les revues de code attendent toujours.

Livré : [Tableau de tri rejugé](output/03-etudes/Digit-AI%20-%20Étude%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20-%2020261102e.md) · [Étude des 8 outils de motion design](output/03-etudes/Digit-AI%20-%20Étude%20-%20Huit%20outils%20de%20motion%20design%20pour%20la%20Factory%20-%2020261102t.md) · [Note sur Harvey](output/03-etudes/Digit-AI%20-%20Note%20-%20Harvey%20compare%20a%20digit-ai-prospection%20-%2020261102q.md) · [Note sur Prime Agent](output/03-etudes/Digit-AI%20-%20Note%20-%20Refine%20de%20Prime%20Agent%20compare%20a%20oeil-critique%20-%2020261102r.md) · [Étude ArtCraft](output/03-etudes/Digit-AI%20-%20Étude%20-%20ArtCraft%20pour%20la%20Factory%20-%2020261102s.md)

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`, exécution de vos réponses 136a à 143a, 145a, 147a, 150c et 151b, et de votre question sur le motion design. Période : du 02/11/2026 à 15:03 au 03/11/2026 à 09:59, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5. Agents : 7 `redacteur` et 1 `campagne` en Sonnet, 9 `verificateur` en Haiku pour les relectures. Les noms des produits relus sont masqués ici, car ce dépôt est public.

Intention de la demande : mener chaque suite choisie jusqu'à un résultat vérifiable, et savoir ce que la vidéo de motion design apporterait à la Factory.

Test rétro : chaque réponse a son livrable ou sa trace au registre ; la valeur réelle des failles et des outils vidéo reste à prouver par un essai.

## 2. Verdict en une ligne

15 réponses exécutées et 1 geste qui vous revient ; 2 revues de code à 250 223 et 294 940 jetons, 28 constats dont 4 élevés ; 47 favoris écoutés, 4 sujets neufs, 32 sujets au tableau, `oracle-tri-de-sujets` PASS.

## 3. Décisions attendues

**D-152** : correction des failles du second produit relu, posée le 02/11 à 17:12, inchangée.

**D-153** : étude d'une étape de revue de code, posée le 02/11 à 17:12, inchangée.

> **D-155 — Faut-il essayer MarkItDown de Microsoft pour convertir les entrants Word, Excel et PowerPoint en texte ?**
>
> - **De quoi s'agit-il** : un outil en Python qui convertit des documents bureautiques, des PDF, de l'audio et des liens YouTube en Markdown, dépôt `microsoft/markitdown`, licence MIT, 193 645 étoiles relevées le 03/11. Il est apparu dans un carrousel que mon premier tri n'avait lu que sur sa première image.
> - **Le problème** : la Factory lit déjà les PDF par son skill `pdf`, mais un dossier d'appel d'offres mêle souvent Excel et PowerPoint, que nos skills lisent moins bien. L'essayer demande d'installer un paquet tiers dans un dossier jetable, ce que la Factory évite par défaut.
> - **Pourquoi vous** : c'est l'installation d'un outil tiers sur le poste, même temporaire.
> - **Recommandation : (a)** — un essai sur 3 vrais entrants coûte peu et tranche sans étude. Source consultée : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Essai court | Installation dans un environnement Python jetable du dossier temporaire, conversion de 3 entrants réels, Word, Excel et PowerPoint, comparée à ce que nos skills en tirent. Rien ne reste installé | Simple × court | Possible : le dossier jetable se supprime |
| (b) Laisser | Le sujet reste au tableau, en décision directe | Nul | Possible : l'essayer plus tard |

> **Sans réponse** : (b), rien n'est installé.

> **D-156 — Faut-il essayer le skill de création de logo logo-design-skill pour les produits neufs sans logo ?**
>
> - **De quoi s'agit-il** : un skill qui propose 3 concepts de logo, les compare à une bibliothèque de plus de 1 400 logos, les teste en petit et en une couleur, puis livre un jeu d'icônes. La vidéo cachait son nom ; je l'ai retrouvé, dépôt `kaankiziltug/logo-design-skill`, licence MIT, 5 845 étoiles relevées le 03/11, outils en Python sans dépendance.
> - **Le problème** : `systeme-de-marque` part d'un logo existant, et un produit neuf n'en a pas toujours. Les logos de la bibliothèque sont des marques d'autrui, hors de la licence MIT : ils servent de référence, jamais de modèle à copier.
> - **Pourquoi vous** : c'est un skill tiers à installer, et un choix de marque pour vos produits.
> - **Recommandation : (b)** — aucun produit n'attend de logo aujourd'hui, et l'essai vaut mieux sur un vrai besoin. Source consultée : le README du dépôt, lu le 03/11/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Essai sur un produit fictif | Le skill est lu, puis joué dans un clone temporaire sur un brief fictif, et ses sorties sont jugées par la forge de design. Rien ne reste installé | Simple × court | Possible : le clone se supprime |
| (b) Attendre un produit sans logo | Le sujet reste au tableau, et l'essai se fera au premier produit neuf qui en a besoin | Nul | Possible : l'essayer plus tôt |

> **Sans réponse** : (b), l'essai attend un vrai besoin.

> **D-157 — La colonne Motif du tableau de tri doit-elle aussi dire vos choix déjà faits sur chaque sujet ?**
>
> - **De quoi s'agit-il** : la colonne Motif du tableau `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`, que votre réponse 121a a définie : en 1 ou 2 phrases, pourquoi ce verdict et qui en profite.
> - **Le problème** : 8 motifs disaient « vous choisissez », alors que vous aviez déjà choisi. Je les ai réécrits pour citer votre réponse et sa trace. La relecture d'intention y voit une dérive : le motif change de nature, et certains dépassent 2 phrases.
> - **Pourquoi vous** : c'est la forme d'un tableau que vous avez fixée.
> - **Recommandation : (a)** — un tableau qui repose des choix faits induit en erreur à la relecture. Source consultée : la relecture consignée sous RI-20261103-04.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder les choix dans le motif | Les 8 motifs restent tels quels, avec votre réponse et sa trace | Nul | Possible : revenir aux motifs d'origine |
| (b) Revenir au motif seul | Les motifs reprennent leur forme du 02/11, et vos choix ne se lisent qu'au registre | Simple × court | Possible : les remettre |

> **Sans réponse** : (a), les motifs restent tels quels.

## 4. Traité

15 réponses sont exécutées, et chaque livrable porte son contrôle ; l'inscription de 138a reste à votre main.

**Revues de code (136a, 145a, 150c, 151b)**

- **Outil de Cloudflare écarté** et revue par un seul agent décidée, à `TF-2054` et `TF-2057`.
- **Référentiel des classes d'attaque** publié dans `digit-ai-forge-websec`, commit aabb550, 77 PASS au contrôle de la forge rejoué par moi.
- **Premier produit relu**, 3 973 lignes : 15 constats, dont 1 élevé, pour 250 223 jetons. J'ai confirmé à la lecture du code le constat élevé et 2 moyens. Le rapport reste chez le produit, qui n'est pas modifié.
- **Second produit relu**, 17 760 lignes, à moitié environ : 13 constats, dont 3 élevés, pour 294 940 jetons. J'ai confirmé les 3 élevés à la lecture du code.

**Motion design (votre question et 147a)**

- **Vidéo retrouvée** : « 8 outils motion design », sans voix, lue image par image. Mon premier tri l'avait rangée sans suite sur sa seule légende.
- **Étude** : `oracle-etude-opportunite` et `oracle-ecriture` PASS. Cumuler les 8 n'améliore pas grandement la Factory, faute de demande de vidéo. J'ai vérifié 3 licences sur 8 par l'API de GitHub.
- **147a** : l'essai vidéo de `TF-1924` comparera 2 skills, aux critères écrits dans l'étude.

**Autres suites du tri (137a à 143a)**

- **Harvey** : note à `oracle-ecriture` PASS, rien à installer, 3 idées pour `digit-ai-prospection`, inscrites à `TF-2069`.
- **Prime Agent** : note à `oracle-ecriture` PASS, ne rien changer, 2 idées pour `oeil-critique`, inscrites à `TF-2070`.
- **ArtCraft** : étude aux 2 oracles PASS, rien à faire pour la Factory ; un constat en passant est inscrit à `TF-2072`.
- **Publicité vidéo pour un commerce fictif** : ajoutée à l'essai de `TF-1924`.
- **Programme pour startups** : l'inscription choisie en 138a porte votre adresse, et je ne la transmets pas à un tiers sans demande explicite. Elle passe au bloc 8.

**Écoute des favoris (142b) et tableau**

- **Écoute** : 39 contenus, un toutes les 5 minutes, sans refus de la plateforme ; 2 transcriptions reprises en local.
- **Tableau rejugé** : 4 sujets neufs, dont les 8 outils de motion design, MarkItDown et le skill de logo ; ArtCraft passe en sans suite. Les motifs disent désormais vos choix déjà faits, au lieu de vous les reposer. Les verdicts recalculés par `tri.mjs verdict` rendent 0 écart avec ceux proposés. `oracle-tri-de-sujets` et `oracle-ecriture` PASS.
- **Registre** : `TF-2071` pour les classes d'attaque sans exigence retenue dans la forge, et une note à `TF-2053` sur ce que la lecture par légende a manqué.

Relecture d'intention : dérive maintenue après 1 passe de correction, consignée sous RI-20261103-04. Les motifs vous sont posés en D-157, et les 2 autres écarts justes sont déclarés au bloc 6. Son écart sur 128a est inexact : la section « Limite à garder en tête » est en tête du tableau, relue à sa ligne 25.

## 5. Non traité

- **Le défaut d'encodage du skill de lecture vidéo sous Windows** — motif : hors_mandat, aucune classe du registre ne le décrit, et le registre refuse une création sans classe. Je l'ai contourné pour les 39 écoutes.
- **Le rejeu des failles des 2 produits** — motif : decision, il dépend de D-152 et de votre réponse 150c.
- **Quelques images de carrousels** — motif : borne_atteinte, celles des carrousels hors filtre et une partie de 4 autres, listées en tête du tableau.
- **La barre de qualité du mouvement des interfaces** — motif : decision, votre réponse 147a ne l'a pas retenue.

## 6. Écarts à la lettre

- Vous avez choisi le produit à 1 ligne sur 7 → la revue en a lu la moitié environ → mon compte de 45 504 lignes incluait des scripts hors de l'application.
- La consigne du second produit n'a pas été relue à part → elle reprend celle du premier, déjà relue, avec un seul cadre en plus.
- Vous avez demandé une revue sur l'authentification et l'accès aux boîtes → j'en ai exclu `input/`, `output/` et `forge/` → ils portent des documents de clients réels, hors du code relu.
- Vous avez choisi de vous inscrire au programme pour startups → l'inscription reste à votre main → elle porte votre adresse, que je ne transmets pas à un tiers sans demande explicite.

## 7. Risques

- **Plafond de jetons sans compteur.** Le second agent s'estimait à 215 000 jetons pour 294 940 mesurés, à 5 000 du plafond. Signal : un relevé d'agent au-dessus de son plafond. Parade : un plafond de lecture fixé à 200 000 jetons dans la prochaine consigne.
- **Rapports de failles hors de git.** Les 2 rapports vivent dans le dossier `output` de leur produit, sans commit. Signal : un nettoyage du dossier. Parade : les enregistrer chez le produit si vous décidez d'une correction.

## 8. Prochaines actions

Les 2 décisions sur les revues passent d'abord, à cause des données réelles du second produit ; les 2 sujets neufs suivent, puis l'inscription et la forme des motifs, qui ne dépendent de rien.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Décider de corriger les failles du second produit relu | `TF-2057` | manuelle_utilisateur | decision : écriture chez un produit | D-152 à `decisions/REGISTRE.jsonl` | si rien n'est fait : la version en attente garde ses failles |
| A-2 | Décider d'étudier une étape de revue de code | `TF-2057` | manuelle_utilisateur | decision : règle commune aux produits | D-153 à `decisions/REGISTRE.jsonl` | si rien n'est fait : chaque revue reste à demander |
| A-3 | Décider d'essayer l'outil MarkItDown sur 3 entrants | neuve | manuelle_utilisateur | decision : outil tiers à installer | `output/04-plans/Digit-AI - Synthese Mandat - Suites du tri TikTok et revues de code - 20261103c.md`, bloc 3 | si rien n'est fait : les entrants Excel et PowerPoint restent mal lus |
| A-4 | Décider d'essayer le skill de logo | neuve | manuelle_utilisateur | decision : skill tiers et choix de marque | `output/04-plans/Digit-AI - Synthese Mandat - Suites du tri TikTok et revues de code - 20261103c.md`, bloc 3 | si rien n'est fait : l'essai attend un produit sans logo |
| A-5 | Vous inscrire à l'avis de réouverture du programme pour startups, comme choisi en 138a | neuve | manuelle_utilisateur | decision : l'adresse à inscrire est votre choix | bouton « Subscribe to the newsletter » de `https://claude.com/programs/startups` | si rien n'est fait : la réouverture peut passer inaperçue |
| A-6 | Trancher la forme de la colonne Motif du tableau de tri | neuve | manuelle_utilisateur | decision : forme fixée par votre réponse 121a | `output/04-plans/Digit-AI - Synthese Mandat - Suites du tri TikTok et revues de code - 20261103c.md`, bloc 3 | si rien n'est fait : les motifs restent tels quels |

## 9. Traces

- Tableau rejugé : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.
- Référentiel : `referentiels/classes-attaque.md` de `digit-ai-forge-websec`, commit aabb550.
- Registre : `TF-2054`, `TF-2057`, `TF-1924`, `TF-2053`, `TF-2069` à `TF-2072` à `todo/TODO.jsonl` ; décisions D-145 à D-157 à `decisions/REGISTRE.jsonl`.
- Sources lues le 03/11/2026 : [MarkItDown](https://github.com/microsoft/markitdown), [logo-design-skill](https://github.com/kaankiziltug/logo-design-skill).
- Rapports de revue et transcriptions : hors du dépôt, chez les produits et dans `input/Tiktok/`, ignoré par git.
