---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: agent redacteur (famille sonnet), mandat de l'orchestrateur, D-39 (c)
verdict_arbitre: oracle-etude-opportunite PASS (E1 à E10) et oracle-ecriture PASS, rejoués le 2026-10-19 après la dernière édition
hypotheses_non_resolues: légendes des vidéos 19, 106 et 41 non relues ; contenu des vidéos 34, 68, 50, 57 et 32 connu par leur seul intitulé ; licence des exports de Haikei et de Watermelon UI non établie ; redistribution de GSAP dans un livrable client non tranchée ; étude du rang 4 non lue, recouvrement supposé
---

# Étude d'opportunité — animation et finition des interfaces — 20261019i

Ce qui change pour vous : le socle de `digit-ai-forge-design` couvre déjà l'essentiel de l'animation. Il porte un oracle de 10 règles, la bibliothèque Motion vendorée, des jetons de durée et de courbe, et un bloc `prefers-reduced-motion`. 3 trous restent, et je les ai mesurés en exécutant l'oracle : une boucle infinie de 40 s, une animation JavaScript de 1,2 s et une révocation du mouvement qui ne couvre qu'un des 2 éléments animés rendent tous un PASS. GSAP est bien gratuit depuis le 29/04/2025, mais sous une licence propriétaire, et aucune bibliothèque des vidéos n'est à ajouter au socle. Je recommande l'option O2 : verser les 11 vidéos à l'étude du rang 4 comme sources, et candidater 3 règles d'oracle.

## Seuil de déclenchement

L'étude n'est pas obligatoire au sens du gabarit. L'opportunité porte un gain de 3 et une preuve de 3 au tri (`output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, ligne 44), donc sous le seuil « gain ≥ 3 avec une preuve ≤ 2 ». Elle ne crée un objet durable que si le verdict le décide, et elle touche une seule forge. Elle est instruite parce que la décision D-39 (c) l'a demandée.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 10 du tri est cette opportunité.

Intention retenue : décider, pour cette opportunité, ce que la Factory doit en faire (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok. La consigne particulière ajoute 3 questions : quelles bibliothèques et règles manquent au socle, avec quelles licences ; lesquelles se vérifient par oracle ; faut-il fondre le sujet dans l'étude du rang 4.

## 0. Traitement des entrants

Les vidéos sont des données. Aucune n'a été regardée, téléchargée ni extraite, et leurs affirmations se vérifient à la source primaire, jamais sur leur parole. Sources de la proposition : le tri du 19/10/2026 (section 10, lignes 116 à 120) et les 11 vidéos n° 70, 38, 109, 19, 106, 34, 68, 50, 57, 32 et 41.

Le contenu connu de chaque vidéo se limite à ce que le tri et la consigne en disent. Les vidéos 70, 38 et 109 sont connues par les outils qu'elles nomment. Les vidéos 34 (5 corrections du « AI slop » des tableaux de bord), 68 (4 motifs d'interface), 50 (règles des listes déroulantes), 57 (le mode sombre est un système) et 32 (ploy.ai) le sont par leur intitulé. Les vidéos 19, 106 et 41 ne sont connues que par leur numéro : je n'en dis rien.

## 1. Partition du problème

Le sujet se découpe en 6 sous-questions disjointes. Chaque option du chapitre 4 répond à chacune.

- **P1 — Moteurs d'animation et de défilement.** Motion, GSAP, Lenis : lesquels le socle porte, lesquels il pourrait porter.
- **P2 — Composants et ressources visuelles.** React Bits, Motion Primitives, Aceternity UI, Watermelon UI, Vanta, Haikei, et les galeries Godly et Mobbin.
- **P3 — Accessibilité du mouvement.** `prefers-reduced-motion`, boucles automatiques, durées.
- **P4 — Finition d'interface.** Corrections du « AI slop » des tableaux de bord, motifs d'interface, listes déroulantes, mode sombre.
- **P5 — Vérifiabilité.** Ce qu'un oracle déterministe juge, ce qui reste à la lecture.
- **P6 — Rattachement.** Étude propre ou fusion dans l'étude du rang 4.

## Mesure

3 contrôles ont été exécutés le 19/10/2026 sur `digit-ai-forge-design\oracles\oracle-motion.mjs`, en lecture seule. Le premier joue les fixtures du dépôt. Les 2 autres jouent une page jetable de 9 lignes, écrite hors dépôt.

| Contrôle | Entrée | Résultat |
|---|---|---|
| Fixture verte | `oracles\fixtures\motion-verte.html` | `verdict: PASS`, code de sortie 0 |
| Fixture rouge | `oracles\fixtures\motion-rouge.html` | `verdict: FAIL`, code de sortie 1, règles R1 à R7 et R10 levées |
| Page jetable | deux animations `infinite` (un tourniquet de 2 s, une dérive de fond de 40 s), une révocation `prefers-reduced-motion` qui ne neutralise que le tourniquet, un appel `Motion.animate(…, {duration: 1.2})` | `verdict: PASS`, code de sortie 0, aucune alerte |

La page jetable est un contre-exemple, pas un produit : elle montre que 3 défauts connus ne sont pas jugés. Le registre `todo\TODO.jsonl` ne contient aucun incident lié à une boucle infinie (une seule ligne correspond au motif, sur un autre sujet). Le gain reste donc faible.

## 2. Non-recouvrement contre l'existant

18 lignes, chacune avec sa citation. Les lignes « ne recouvre pas » désignent les trous réels.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Oracle de mouvement, règles R1 à R7 | `digit-ai-forge-design\oracles\oracle-motion.mjs`, lignes 4 à 17 : `transition: all`, `scale(0)`, `ease-in`, durée > 300 ms, `transform-origin`, propriété de layout, survol sans `@media (hover: hover)` | recouvre : durées, courbes, propriétés animées et survol des feuilles CSS |
| Oracle de mouvement, règles R8 à R10 et plafond | même fichier, lignes 19 à 33 et 46 (`PLAFOND_MS = 300`), 293 à 316 (R10) | recouvre l'existence d'une révocation `prefers-reduced-motion` ; ne recouvre pas sa couverture : le test de la ligne 305 se satisfait d'un seul sélecteur neutralisé |
| Limites déclarées de l'oracle de mouvement | même fichier, lignes 48 à 56 : « durées passées à `animate()` en JavaScript (Motion vendoré) — R8 ne juge que le CSS » ; aucune règle sur `infinite` | ne recouvre pas : boucle infinie et durées JavaScript ne sont pas jugées, contrôle exécuté en section Mesure |
| Motion vendorée | `digit-ai-forge-design\oracles\vendor\README.md`, lignes 6 à 13 (version 12.23.12, 79 ko, empreinte SHA-256) et 35 à 46 (usage inline sous garde `matchMedia`) | recouvre le moteur d'animation ; la version a 2 majeures de retard sur le registre npm (14.4.0 le 2026-10-19) |
| Choix de Motion et refus de l'AI Kit en livrable | `digit-ai-forge-design\conception-forge-design.md`, lignes 33 et 34, puis 155 à 160 (§5.4 d) | recouvre : le moteur et le principe « réseau au build, jamais au runtime » sont décidés |
| Règles importées de taste-skill | `digit-ai-forge-design\oracles\regles-importees-taste-skill.md`, lignes 120 à 131 : pile imposée écartée, dont Motion et « GSAP / ScrollTrigger », et lignes 104 à 118 : assets distants refusés | recouvre le refus de GSAP comme pile imposée ; ne recouvre pas GSAP comme bibliothèque vendorée, jamais examinée |
| Arbitrage d'autorité sur le mouvement | `digit-ai-forge-design\oracles\registre-entrees.md`, lignes 176 à 192 : « Le mouvement — prescription ET jugement — appartient à forge-design » | recouvre : toute règle nouvelle de mouvement entre dans `oracle-motion`, aucun second oracle |
| Jetons de mouvement | `C:\Users\iguan\.claude\skills\systeme-de-marque\references\tokens.md`, lignes 43 à 53 (`--dur-etat` à `--dur-plafond`, 3 `--ease-*`), 84 et 85, 132 à 143 | recouvre dans la marque ; ne recouvre pas dans le socle : 0 occurrence de `--dur-` dans `digit-ai-page-html\assets\boilerplate.html` et dans `references\charte-et-tokens.md` (`grep -c`) |
| Bloc de mouvement réduit du socle | `C:\Users\iguan\.claude\skills\digit-ai-page-html\assets\boilerplate.html`, lignes 326 à 328 (règle universelle `*, *::before, *::after`) ; `references\bonnes-pratiques.md`, ligne 87 ; `references\BEST-PRACTICES-HTML.md` du pilot, lignes 108 et 227 (E2 soldé) | recouvre : la page de base neutralise tout mouvement CSS |
| Contrôle M6 de l'oracle mobile | `digit-ai-forge-design\oracles\oracle-mobile.mjs`, lignes 10 et 190 à 197 | recouvre la présence de `prefers-reduced-motion` ; ne recouvre pas sa portée, même limite que R10 |
| Référence d'animation d'impeccable | `C:\Users\iguan\.claude\skills\impeccable\reference\animate.md`, lignes 54 à 59 (durées), 71 (propriétés de layout), 77 (« Every web animation needs a `prefers-reduced-motion` path ») | recouvre la doctrine ; ne recouvre pas le contrôle exécuté, c'est de la prose |
| Étude précédente sur les skills d'animation | `output\03-etudes\2026-08\20260816-etude-skills-animation-motion.md`, lignes 57 à 71 (§4) et 77 à 79 (I1 à I3) | recouvre : I2 et I3 ont donné les jetons et `oracle-motion` ; la barre externe I1 (`lottiefiles/motion-design-skill`) reste à évaluer |
| Marqueurs de slop et tableaux de bord | `digit-ai-forge-design\oracles\oracle-slop.mjs`, lignes 2 et 3 (S1 à S10) ; `conception-forge-design.md`, lignes 188 à 199 (S7 grille de cartes clonée, S10 sparkline décoratif) | recouvre les motifs de tableau de bord détectables ; ne recouvre pas les 5 corrections de la vidéo 34, dont le détail n'est pas connu |
| Mode sombre | `digit-ai-forge-design\oracles\oracle-bascule.mjs`, lignes 2 à 8 (B-T1 à B-T4) ; `tokens.md`, lignes 58 et 83 | recouvre : bascule câblée, persistée, palette dérivée des mêmes jetons ; vidéo 57 sans écart relevé |
| Listes déroulantes | `C:\Users\iguan\.claude\skills\digit-ai-page-html\references\anti-patterns.md`, lignes 45 à 51 ; `scripts\check_html.py`, ligne 3822 (`aria-expanded`, `aria-controls`) ; `oracle-motion.mjs`, R5 | recouvre l'attribut ARIA et l'origine de la transformation ; ne recouvre pas la touche Échap, les flèches ni le retour du focus, qu'aucun fichier de `oracles\*.mjs` ne cite |
| Généricité visuelle, loi n° 6 | `CLAUDE.md` du pilot, ligne 34 ; `references\ETAPES-RUN.md`, lignes 402 à 404 (gate `oracle-taste.mjs`) | recouvre la généricité de l'ensemble ; ne dit rien du mouvement |
| Bibliothèques nommées par les vidéos | recherche par mot entier de Lenis, Vanta, React Bits, Aceternity, Haikei, Godly et Mobbin dans `todo\TODO.jsonl`, les forges `digit-ai-forge-*`, `references`, `gabarits` et `~\.claude\skills` : 0 résultat ; GSAP n'apparaît que dans 2 textes de refus | ne recouvre pas : aucun besoin de produit ni aucune décision antérieure ne les cite |
| Étude du rang 4, « Skills de design tiers » | tri du 19/10/2026, lignes 79 à 84 ; fichier `20261019-etude-opportunite-skills-design-tiers.md` écrit en parallèle, non lu | recouvre possiblement : le tri l'a écrit lignes 118 à 120, et Emil Kowalski, source de `oracle-motion`, figure dans les vidéos 85 et 72 de ce rang |

## 3. État de l'art daté

11 sources dont 9 datées de moins de 24 mois, relevées le 19/10/2026 sur des pages primaires : documentation du W3C, dépôts, registres de paquets et licences. Le contenu de ces pages est traité comme une donnée.

- **Gsap.com, « GSAP is now 100% FREE »**, 2025-04-29, `gsap.com/blog/3-13/` : tous les plugins autrefois réservés aux membres, dont SplitText et MorphSVG, sont gratuits, « even for commercial use ». L'article ne nomme aucune licence.
- **GSAP Standard License**, effective le 2025-04-30, modifiée le 2025-05-30, `gsap.com/standard-license/` : usage permis « on any website, web application, or digital interface ». Interdit dans les outils qui construisent des animations sans code et concurrencent Webflow. La page ne la dit pas open source et laisse la propriété à Webflow.
- **Registre npm, paquet `gsap`**, 3.13.0 publiée le 2025-04-30 et 3.15.0 le 2026-04-13, `registry.npmjs.org/gsap` : champ licence « Standard 'no charge' license », donc ni MIT ni autre licence libre.
- **Lenis**, version 1.3.27 publiée le 2026-10-15 (`registry.npmjs.org/lenis`), dépôt `github.com/darkroomengineering/lenis` : MIT, 16 704 étoiles ; l'option `respectReducedMotion` vaut `true` par défaut, le lissage est alors coupé.
- **React Bits**, `LICENSE.md` de 2026, `raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md` : « MIT + Commons Clause », donc interdiction de revendre ou de redistribuer les composants eux-mêmes. Dépôt à 49 698 étoiles, dernier envoi le 2026-10-19.
- **Motion**, `registry.npmjs.org/motion` : version 14.4.0 publiée le 2026-10-19, MIT ; la version 12.23.12 du socle date du 2025-07-30.
- **Motion Primitives**, `github.com/ibelick/motion-primitives`, dernier envoi le 2026-09-28 : MIT, 6 749 étoiles, composants React et Tailwind, annoncé en bêta.
- **W3C, WCAG 2.2, critère 2.3.3 « Animation from Interactions »**, mis à jour le 2025-09-16, `w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html` : niveau AAA, technique C39 (`prefers-reduced-motion`).
- **W3C, WCAG 2.2, critère 2.2.2 « Pause, Stop, Hide »**, mis à jour le 2026-08-10, `w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html` : niveau A ; un contenu qui bouge seul pendant plus de 5 secondes demande un moyen de pause, d'arrêt ou de masquage.
- **Web Platform Status**, interrogé le 2026-10-19, `api.webstatus.dev/v1/features/` : les transitions de vue sont « newly » depuis le 2025-10-14 ; les animations pilotées par le défilement restent « limited », Safari 26 les livrant le 2025-09-15 et Firefox n'y figurant pas ; `prefers-reduced-motion` est « widely » depuis le 2022-07-15.
- **Aceternity UI, licence**, `ui.aceternity.com/licence`, © 2026, sans date d'effet : licence propriétaire permissive, produits finaux vendables, revente des composants interdite, composants tiers soumis à leur propre licence.

Hors fenêtre ou non lues. Vanta (`github.com/tengbao/vanta`) : MIT, dernier envoi le 2024-03-03, paquet npm 0.5.24 du 2022-09-16, exige three.js, environ 120 ko compressés selon son fichier de présentation. Les conditions de Haikei, `haikei.app/terms/`, datent du 2022-07-20 et ne disent rien de la licence des SVG produits. Les conditions de Mobbin ont répondu 403. Watermelon UI n'a pas de licence lue à la source, seulement un en-tête MIT sur des extraits republiés par 21st.dev.

**Licences relevées, outil par outil.**

| Outil | Licence relevée | Adéquation au socle HTML autonome et sans réseau |
|---|---|---|
| Motion | MIT | présent, version vendorée en retard |
| GSAP | propriétaire « no charge », effective le 2025-04-30 | moteur redondant avec Motion ; redistribution dans un livrable client à faire lire |
| Lenis | MIT | vendorable, réduit son lissage par défaut ; aucun besoin recensé |
| Vanta | MIT | inactif depuis 2024, exige three.js |
| React Bits | MIT + Commons Clause | suppose React |
| Motion Primitives | MIT | suppose React et Tailwind |
| Aceternity UI | propriétaire permissive | suppose React |
| Haikei | non établie | usage au build possible, licence des exports à lever |
| Watermelon UI | MIT indirect | non établie |
| Godly, Mobbin | sans objet | galeries d'inspiration, aucun code à intégrer |

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée, de justesse. Le socle couvre l'essentiel, et le registre ne contient aucun incident de boucle infinie. Mais 3 défauts connus rendent un PASS (section Mesure), et le correctif se chiffre en simple × court. Garder un PASS que l'on sait trop indulgent coûte plus que l'écart à fermer.
- **O1 — fondre dans l'étude du rang 4, sans candidature propre.** Les 11 vidéos deviennent des sources de l'étude « Skills de design tiers ». Coût : nul en plus. Exclut toute règle d'oracle tant que l'étude du rang 4 n'a pas conclu, donc laisse ouverts les trois trous mesurés.
- **O2 — fondre les sources dans l'étude du rang 4 et candidater 3 règles d'`oracle-motion`.** R11 : animation `infinite` de plus de 5 s sans mécanisme de pause (WCAG 2.2.2, niveau A). R12 : durée littérale passée à `animate()` au-delà de 300 ms. R13 : révocation `prefers-reduced-motion` qui ne couvre pas chaque sélecteur animé, sauf règle universelle. Chacune avec une fixture rouge et une verte, selon le standard du registre. Coût : simple × court. Exclut toute bibliothèque nouvelle.
- **O3 — vendorer une bibliothèque de plus au socle**, Lenis pour le défilement lissé ou GSAP avec ScrollTrigger. Coût : complexe × moyen, plus la lecture de la licence GSAP et une empreinte à tenir dans `vendor\README.md`. Exclut la simplicité du socle, pour un besoin qu'aucun produit n'a exprimé.
- **O4 — importer des composants prêts à l'emploi** (React Bits, Aceternity UI, Motion Primitives, Watermelon UI). Coût : complexe × long. Exclut la neutralité de pile du socle, qui produit des pages HTML autonomes sans React : c'est le motif du refus de taste-skill (`regles-importees-taste-skill.md`, lignes 120 à 131). S'y ajoutent la clause de non-redistribution de React Bits et la licence propriétaire d'Aceternity.

## 5. Verdict

- **Option retenue** : O2.
- **Pourquoi O2** : il faut fondre le sujet dans l'étude du rang 4 pour les sources, parce que `oracle-motion` descend déjà d'Emil Kowalski, cité dans ce rang. Les 3 règles se candidatent à part, parce qu'elles reposent sur un contrôle exécuté et non sur la décision relative aux skills tiers. O1 les laisserait sans porteur ; O3 et O4 ajoutent une dépendance sans besoin recensé.
- **Coût** : simple × court. 3 règles ajoutées à un oracle qui en compte 10, 6 fixtures, une ligne de registre. Aucun jeton de relecture supplémentaire ni dépendance neuve ; la dette est la tenue de la règle R13, qui lit des sélecteurs.
- **Candidature(s) émise(s)** :
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 4, effort 1. Objet : ajouter R11 (boucle infinie), R12 (durées JavaScript) et R13 (couverture de la révocation) à `digit-ai-forge-design\oracles\oracle-motion.mjs`, avec fixtures, et reporter les 3 cas de la section Mesure comme fixtures rouges.
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 1, preuve 4, effort 1. Objet : relire la version de Motion vendorée (12.23.12 contre 14.4.0 au registre npm) et décider du maintien ou de la montée, empreinte SHA-256 à l'appui.
- **Plan de revue** : 2026-11-19. Critères écrits d'avance : l'étude du rang 4 est décidée et ne contient pas déjà les 3 règles ; les fixtures rouges de R11 à R13 échouent et la verte passe ; `oracle-motion` rejoué sur les pages témoins de la forge n'ajoute aucun faux refus.
- **Test rétro** :
  - *Opération → Tactique* : R11, R12 et R13 répondent chacune à un trou mesuré en section Mesure, et la fusion des sources répond à P6.
  - *Tactique → Stratégie* : le mouvement se prescrit et se juge en un seul lieu, `oracle-motion`, comme l'arbitrage du registre l'exige (`registre-entrees.md`, lignes 189 à 192). Aucune bibliothèque n'entre sans besoin recensé ni sans licence lue.
  - *Stratégie → Intention* : vous vouliez savoir ce que la Factory doit faire de cette opportunité, sur des faits vérifiés. La réponse est un objet durable minimal, 3 règles dans un oracle existant, et rien d'autre.
  - *Questions rejouées* : « quelles bibliothèques et règles manquent ? » : aucune bibliothèque, 3 règles (section 2 et Mesure). « Quelles licences, GSAP est-il gratuit ? » : oui depuis le 2025-04-29, sous licence propriétaire (section 3). « Lesquelles se vérifient par oracle ? » : boucle infinie, durée JavaScript, couverture de la révocation oui ; fluidité perçue, fréquence d'usage, clavier d'une liste déroulante et défilement lissé non, faute de rendu ou de comportement mesurable sur le fichier seul. « Fondre dans le rang 4 ? » : les sources oui, les règles non.
  - *Rupture constatée* : les vidéos 19, 106 et 41 n'ont pas été relues et 5 autres ne sont connues que par leur intitulé ; leur apport éventuel n'est ni confirmé ni écarté. La rupture est déclarée, pas comblée.

## Limites et hypothèses non résolues

- Le contenu des vidéos est connu par leurs légendes et par le tri, jamais par leur image. Aucune de leurs affirmations chiffrées n'est reprise.
- L'étude du rang 4 n'a pas été lue. Si elle propose les mêmes règles de mouvement, l'orchestrateur déduplique : une règle ne se juge que dans `oracle-motion`.
- La redistribution de GSAP dans une page remise à un client n'est pas tranchée. La licence permet l'usage « on any website », mais le cas du fichier autoportant livré n'y est pas nommé. Une lecture humaine est nécessaire avant toute option qui l'embarquerait.
- La montée de Motion de la version 12 à la version 14 n'a pas été testée : les changements incompatibles ne sont pas relevés.
- Les 3 règles proposées sont statiques. R12 ne lit que les durées littérales, et R13 ne résout pas la cascade : le rendu réel relève de `render_page.py`.
