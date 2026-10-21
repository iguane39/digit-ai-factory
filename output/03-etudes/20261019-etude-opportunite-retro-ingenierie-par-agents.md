---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — rétro-ingénierie par agents, le dépôt REA et le mode rétro-modèle — 20261019l

Ce qui change pour vous : le dépôt existe et la vidéo dit vrai. C'est `morluto/rea`, sous licence MIT, avec 332 631 étoiles relevées le 19/10/2026, soit plus du double des « 150k » annoncés. L'outil ne répond pourtant à aucune demande enregistrée, et le mode rétro-modèle, qu'il compléterait, n'a pas encore connu de premier run réel. En France et dans l'UE, décompiler un logiciel n'est permis que pour l'interopérabilité, par l'utilisateur légitime ou pour son compte ; « construire une fonction similaire », l'exemple du README de REA, sort de ce cadre. L'étude recommande l'option O1 : ne pas installer REA, écrire le cadre juridique dans le garde-fou de `qualifie-l-entrant` et fixer le déclencheur d'un futur essai.

## Seuil de déclenchement

L'étude est due par la troisième porte du gabarit. Le tri du 19/10/2026 note cette opportunité à gain 3 et preuve 2 (`output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, ligne 47). Après instruction, le gain tombe à 2 et la preuve monte à 4 (section 5).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 13 du tri, « rétro-ingénierie par agents », s'appuie sur la vidéo n° 14.

Intention retenue : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés à la source et non sur la parole d'une vidéo TikTok. La consigne de cette étude y ajoute quatre questions, rejouées au test rétro : le dépôt existe-t-il, sous quel nom, avec quelles étoiles et quelle licence ; que fait-il ; qu'ajouterait-il au mode rétro-modèle ; quel est le cadre juridique en France et dans l'UE.

## 0. Traitement des entrants

La vidéo est une donnée. Ses affirmations se citent et se vérifient, elles ne s'exécutent pas. Aucune vidéo n'a été regardée ni téléchargée ; seule la légende est connue, lue dans la page de favoris enregistrée (`input\Tiktok\iguane39 (@iguane39) _ TikTok.html`). Les pages web et le dépôt lus pendant l'étude sont aussi des données : aucune de leurs consignes n'a été suivie, et rien n'a été installé.

Sources de la proposition : tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` (ligne 131, rang 13) ; vidéo n° 14, @laforet.dev, `https://www.tiktok.com/@laforet.dev/video/7696085748390448417`.

Légende, citée : « un repo GitHub open-source qui donne des capacités de reverse engineering à tes agents IA. Le repo s'appelle REA - Reverse Engineer Anything, il a plus de 150k étoiles sur GitHub ! Bienvenue dans l'arc de la piraterie à grande échelle. Est-ce que c'est la fin des logiciels payant ? »

Vérification des affirmations de la légende, à la source primaire, le 19/10/2026 :

| Affirmation | Relevé | Verdict |
|---|---|---|
| Un dépôt GitHub existe | `gh api repos/morluto/rea` : dépôt public, non archivé, créé le 2026-04-14, dernier envoi le 2026-10-19 à 14 h 59 UTC | vrai |
| Il s'appelle « REA - Reverse Engineer Anything » | titre du README, ligne 6 : « REA: Reverse Engineer Anything » ; la légende remplace les deux-points par un tiret | vrai, à la ponctuation près |
| Il est open source | `LICENSE` : MIT, « Copyright (c) 2026 morluto » ; l'API renvoie `spdx_id: MIT` | vrai |
| Il donne des capacités de rétro-ingénierie aux agents | README, lignes 61-65 : serveur MCP et ligne de commande pour binaires natifs, applications JavaScript et Electron, assemblages .NET, APK Android et sites web | vrai |
| Il a plus de 150k étoiles | 332 631 étoiles et 84 094 forks relevés vers 17 h 08 le 19/10/2026 ; la presse en donne 110 000 à 145 000 le 12/10 | vrai en plancher ; chiffre non audité |
| C'est « la piraterie à grande échelle » et peut-être « la fin des logiciels payant » | `DISCLAIMER.md` : le projet n'aide pas à contourner un DRM, ni à copier un logiciel propriétaire ; les outils commerciaux (IDA Pro, Hopper, JEB) doivent être licenciés (README, lignes 397-403) | non étayé, contredit par les conditions du dépôt |

La date de la vidéo se déduit de son identifiant : 2026-10-13. Cette lecture suit une convention d'identifiants non documentée par TikTok ; elle reste une hypothèse. Elle rend le chiffre de 150k plausible le jour de la publication.

## 1. Partition du problème

5 sous-questions disjointes ; chaque option de la section 4 répond à chacune.

- **P1 — Identité et état du dépôt.** Nom, propriétaire, licence, étoiles, rythme de publication.
- **P2 — Capacités.** Ce que l'outil analyse, avec quels prérequis, et ce qu'il exécute.
- **P3 — Apport au mode rétro-modèle.** Ce que REA ajoute aux 5 volets et à la règle « ancre ou rien ».
- **P4 — Cadre juridique en France et dans l'UE.** Ce que le droit permet, interdit et laisse à l'appréciation d'un conseil.
- **P5 — Exploitation.** Chaîne d'approvisionnement, confidentialité des cibles, données hostiles.

### Faits relevés

**P1.** Le propriétaire est un compte individuel, `morluto` (type `User` à l'API). Le paquet npm `rea-agents` a été créé le 2026-07-12. 5 versions ont paru en 9 jours, de la 6.3.0 le 2026-10-09 à la 6.7.0 le 2026-10-18. Le dépôt compte 1 250 tickets et demandes de fusion ouverts. Le README affiche « 300,000 GitHub stars » (ligne 356). Il met en garde contre les dépôts au nom voisin (lignes 29-33) : seuls `morluto/rea`, `rea.tools` et le paquet npm sont officiels.

**P2.** Le tableau du README (lignes 177-201) liste plus de 20 types de cibles. L'analyse native passe par Hopper, Ghidra ou IDA, installés à part. La prise en charge de Ghidra sous Windows est dite « expérimentale » (lignes 216-218) ; le poste de la Factory est sous Windows 11. L'analyse statique de JavaScript et de .NET lit les fichiers sans les lancer. La capture de comportement, elle, « runs or interacts with the selected target » avec les droits de l'utilisateur (lignes 203-205). Chaque résultat porte ses preuves (« Evidence ») et ses limites (README, ligne 63 ; `docs/cli.md`, lignes 216-225).

**P5.** `npx rea-agents setup` enregistre un serveur MCP et des instructions de travail dans la configuration de l'agent, avec sauvegarde et approbation (`docs/installation.md`, lignes 46-47 et 59-60) ; pour Claude Code, il écrit dans `.claude.json` (ligne 169). Un usage en ligne de commande seule, sans `setup`, existe (README, lignes 104-108). Le paquet déclare 40 dépendances directes et aucun script `preinstall`, `install` ni `postinstall` (`npm view rea-agents`, 2026-10-19). Le README précise que le modèle reçoit les résultats d'outil et que son fournisseur applique sa propre politique de données (lignes 310-315). Un commentaire du 2026-10-12 note qu'un binaire hostile peut loger des chaînes conçues pour piéger l'agent (source S5, section 3).

### Cadre juridique (P4)

Sources : Légifrance, article L122-6-1 du Code de la propriété intellectuelle (CPI) ; directive 2009/24/CE, article 6 ; CJUE, arrêts SAS Institute (2 mai 2012, C-406/10) et Top System (6 octobre 2021, C-13/20), lus dans des commentaires (section 3).

| Acte | Texte | Conditions et limites | Conséquence pour la Factory |
|---|---|---|---|
| Observer, étudier ou tester le fonctionnement ou la sécurité | L122-6-1, III ; directive, article 5, paragraphe 3 | par la personne ayant le droit d'utiliser le logiciel, pendant les opérations qu'elle est en droit d'effectuer ; but : dégager les idées et principes | permis sans autorisation de l'auteur, sans décompiler |
| Reproduire le code ou traduire sa forme (décompiler) | L122-6-1, IV ; directive, article 6 | indispensable à l'interopérabilité d'un logiciel créé de façon indépendante ; acte fait par l'utilisateur légitime ou pour son compte ; informations pas déjà aisément accessibles ; limité aux parties nécessaires | seule voie de décompilation, avec un mandat du titulaire de la licence |
| Usage des informations ainsi obtenues | directive, article 6, paragraphe 2 ; L122-6-1, IV | ni autre but que l'interopérabilité, ni communication à des tiers hors nécessité, ni développement ou commercialisation d'un logiciel d'expression substantiellement similaire | « construire une fonction similaire à partir de ce que REA montre » n'est pas couvert |
| Corriger des erreurs | L122-6-1, I ; arrêt Top System, 2021 | l'acquéreur légitime peut décompiler pour corriger des erreurs qui affectent le fonctionnement | pertinent seulement pour la maintenance d'un logiciel licencié |
| Réimplémenter une fonction observée | arrêt SAS Institute, 2012 | fonctionnalités, langage de programmation et formats de fichiers ne sont pas protégés ; les manuels et le code restent protégés | l'idée reste libre, pas la copie du code, des actifs ni de la documentation |

3 limites. Les clauses de licence qui interdisent ces actes sont tenues pour nulles, selon un commentaire (Baumann Avocats) que la lecture directe de Légifrance n'a pas confirmé. Le contournement d'une protection technique est une autre infraction, que le dépôt exclut lui-même (`DISCLAIMER.md`) et que cette étude n'a pas instruite. La conformité juridique d'une reprise reste `non_juge` : c'est un arbitrage humain, au besoin un avis de conseil (`entrants.md`, lignes 161-163).

## 2. Non-recouvrement contre l'existant

Lecture seule, le 19/10/2026. 10 lignes, chacune avec une citation vérifiable.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Mode rétro-modèle de `qualifie-l-entrant` | `C:\Users\iguan\.claude\skills\qualifie-l-entrant\SKILL.md` l.68-76 : un `RETRO-MODELE.md` à 5 volets (fonctionnel, technique, paramétrage, data, services), « chaque affirmation ancrée » | recouvre le besoin de compréhension pour un dépôt lisible ; ne recouvre pas les cibles sans source |
| Protocole du mode, règle de lecture seule | `references\retro-modele.md` l.54-56 : « aucun fichier du projet analysé modifié, aucun serveur démarré » ; `SKILL.md` l.65-66, même règle | recouvre, et entre en conflit avec la capture de comportement de REA, qui exécute la cible (README l.203-205) |
| Entrées du catalogue | `catalogues\catalogue.jsonl` l.46, `cat-con-08` : entrée « dépôt lisible (lecture seule) » ; preuve « pas encore de run réel » | recouvre le service, sans demande réelle ; aucune entrée « artefact sans source » |
| Oracle RM1-RM5 | `C:\dev\digit-ai-forge-conception\oracles\oracle-retro-modele.mjs` l.107-113 : une ancre est valide si sa cellule compte au moins 4 caractères | ne recouvre pas : il accueillerait un identifiant d'Evidence tel quel, mais ne juge pas sa nature ; la confrontation RM3 (l.124-139) reste la garantie |
| Garde-fou juridique du 5e entrant | `references\entrants.md` l.15 et l.145-163 : règles de gestion et modèle de données « hors de portée » ; code « jamais reprenable » ; conformité `non_juge` | recouvre en plus strict que la loi ; ne cite ni la directive 2009/24/CE ni L122-6-1, et ne dit rien de la décompilation |
| Étude 20260819a (rétro-engineering) | `output\03-etudes\2026-08\20260819-etude-opportunite-retro-engineering.md` l.101-104 (forge dédiée exclue, 70 % de composition) et l.126-127 (revue au 2026-09-19 sur un premier run réel) | recouvre la question de l'hébergement ; ne recouvre pas les cibles compilées ; le catalogue dit encore « pas encore de run réel » |
| Registre TODO-FORGE | `todo\TODO.jsonl`, `grep -i` du 19/10/2026 sur « décompil », « ghidra », « rétro-ingénierie », « reverse engineer » : 0 occurrence | ne recouvre pas : aucune demande de décompilation enregistrée |
| Admission d'un skill ou serveur tiers | `REGLES-PROJET.md` l.514-519 (R-33 ter : scan avant admission) et l.551 (« Skill tiers en exécution : NON ») | recouvre la porte d'entrée de REA, qui installe un serveur MCP et un skill |
| Sécurité agentique, données hostiles | `C:\dev\digit-ai-forge-agents-security\README.md` l.121 : `INJ-2`, la charge d'une entrée devient un acte d'outil | recouvre en partie le risque d'injection par chaînes d'un binaire |
| Skills installés | `C:\Users\iguan\.claude\skills\` : 34 entrées, aucun `SKILL.md` ne mentionne Ghidra, décompilation ou reverse | ne recouvre pas : aucun outil de rétro-ingénierie installé |

## 3. État de l'art daté

9 sources. Les 6 premières datent de moins de 24 mois, les textes de loi sont des versions en vigueur, et les arrêts de la CJUE sont plus anciens, cités pour la règle de droit.

- **S1. Dépôt `morluto/rea`**, métadonnées lues par `gh api repos/morluto/rea` le 2026-10-19, `https://github.com/morluto/rea` : MIT, 332 631 étoiles, 84 094 forks, créé le 2026-04-14.
- **S2. README et `DISCLAIMER.md` du dépôt**, dernier commit du 2026-10-19 à 14 h 09 UTC, `https://github.com/morluto/rea/blob/main/README.md` et `.../DISCLAIMER.md` : cibles, prérequis, usages exclus, texte de licence.
- **S3. Paquet npm `rea-agents` et versions publiées**, version 6.7.0 du 2026-10-18, `https://www.npmjs.com/package/rea-agents` : 40 dépendances, aucun script d'installation, un mainteneur.
- **S4. Anthropic, Usage Policy**, consultée le 2026-10-19, `https://www.anthropic.com/legal/aup` : ne mentionne pas la rétro-ingénierie ; interdit de violer la propriété intellectuelle d'un tiers et de contourner des contrôles de sécurité sans autorisation. La page affiche une date d'effet au 2026-11-12, postérieure à ce jour : à relire à la revue.
- **S5. Kunal Ganglani, « REA: Reverse Engineer Anything With AI Agents »**, 2026-10-12, `https://www.kunalganglani.com/blog/rea-reverse-engineer-anything-agents.md` : environ 145 000 étoiles ; risque d'injection par les chaînes d'un binaire ; l'analyse reste locale, le raisonnement part chez le fournisseur du modèle.
- **S6. Inside (Taïwan), article sur REA**, 2026-10-12, `https://www.inside.com.tw/article/42615-rea-reverse-engineer-anything-open-source-mcp-ai-agent-github` : plus de 110 000 étoiles dans le corps, 120 000 dans le titre ; les deux chiffres divergent.
- **S7. Légifrance, CPI article L122-6-1**, version en vigueur depuis le 2021-11-26, lue le 2026-10-19, `https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044365559/2026-10-19` : alinéas I à V.
- **S8. Directive 2009/24/CE, article 6 (décompilation)**, texte de 2009 en version du 2020-01-31, copie en anglais lue le 2026-10-19, `https://www.legislation.gov.uk/eudr/2009/24/article/6`. Le texte français d'EUR-Lex n'a pas pu être lu.
- **S9. CJUE, SAS Institute c. World Programming**, 2012-05-02, C-406/10, commenté par la Society for Computers and Law, `https://www.scl.org/2436-sas-v-wpl-no-copyright-says-ecj/` ; **CJUE, Top System**, 2021-10-06, C-13/20, commenté par Cuatrecasas, `https://www.cuatrecasas.com/es/spain/articulo/descompilacion-software-correccion-errores-sentencia-tjue-caso-top-system`. Les arrêts eux-mêmes n'ont pas été lus.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée, à coût faible. Aucune demande de décompilation n'est au registre, et le mode rétro-modèle n'a pas de run réel (section 2). Mais un agent qui reçoit demain un logiciel sans source n'a aucune règle écrite : `entrants.md` ne parle pas de décompilation, et la presse présente REA comme un outil de « piraterie ». Le coût du statu quo est une décision improvisée, sur un sujet où la loi pose des conditions précises.
- **O1 — garde-fou écrit, outil non adopté.** Ajouter à `entrants.md`, section « Juridique », un paragraphe sur les artefacts compilés ou empaquetés. Refus par défaut. 3 cas admis : un titulaire de licence qui mandate la Factory par écrit, l'interopérabilité (L122-6-1, IV), la correction d'erreurs. 3 interdits : copier le code ou les actifs, construire un logiciel d'expression similaire, contourner une protection technique. Y inscrire REA comme outil connu et son déclencheur d'essai (section 5). Coût : simple × court. Exclut : tout essai de l'outil et toute modification d'oracle.
- **O2 — essai borné de REA en ligne de commande seule.** Sans `setup`, donc sans toucher à la configuration d'agent. Cible : le bundle JavaScript d'un site de la Factory elle-même, en lecture seule, sur un poste isolé. Mesure : au moins 5 affirmations confrontées à la source, comme l'exige RM3. Il exécute du code tiers et ses 40 dépendances : GO humain et scan préalable (R-33 ter). Coût : moyen × moyen. Exclut : toute cible tierce, les binaires natifs (Windows « expérimental »), l'enregistrement MCP.
- **O3 — étendre le mode rétro-modèle d'un type d'entrant « artefact sans source ».** REA fournit les ancres ; l'oracle gagne une règle exigeant l'autorisation écrite du titulaire. Coût : complexe × long. Exclut : rien, mais le mode de base n'a pas de run réel et aucune demande n'existe : le besoin serait inventé.
- **O4 — adopter REA tel quel dans la flotte.** `npx rea-agents setup` pour tous les agents : serveur MCP et skill tiers en exécution permanente. Coût : complexe × long, avec une surface d'exécution tierce durable. Exclut : la règle R-33 ter et la ligne « Skill tiers en exécution : NON » de `REGLES-PROJET.md` (l.551).

## 5. Verdict

- **Option retenue** : O1.
- **Pourquoi pas O2 à O4** : aucune demande n'existe (0 occurrence au registre), le mode rétro-modèle n'a pas de run réel, et chaque option qui installe REA exécute du code d'un mainteneur unique, publié il y a 3 mois, à raison de 5 versions en 9 jours. La vidéo montre un outil ; elle ne montre pas un besoin de la Factory.
- **Ce qu'O1 apporte** : la réponse juridique à la question posée, écrite là où un agent la lira. Elle ne dépend pas de REA et reste vraie si le dépôt disparaît.
- **Coût** : simple × court. Un paragraphe d'environ 8 lignes dans `entrants.md`, à modifier à la source dans `digit-ai-forge-conception` puis à réinstaller ; aucune dette de code ni de dépendance. Aucun jeton de relecture n'est mesuré.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 4, effort 1. Gain 2 : la clause évite un usage illicite, sans perte mesurée. Preuve 4 : dépôt, licence, README, avertissement et texte du CPI lus à la source. Effort 1 : un paragraphe.
- **Plan de revue** : 2026-11-19. Critères écrits d'avance : une mission avec un logiciel sans source est-elle arrivée, avec mandat écrit du titulaire ; le premier run réel du mode rétro-modèle a-t-il eu lieu ; la Usage Policy d'Anthropic, datée du 2026-11-12, dit-elle quelque chose de la rétro-ingénierie ; le dépôt REA a-t-il toujours la licence MIT. Si une mission et un run réel existent, O2 se rouvre ; sinon O1 reste.
- **Test rétro** :
  - *Opération → Tactique* : le paragraphe de `entrants.md` fixe où l'agent s'arrête (P4) ; la mention de REA et de son déclencheur garde l'outil à portée sans l'admettre (P2, P5).
  - *Tactique → Stratégie* : décider sur des faits lus à la source, pas sur une légende, et ne rien installer tant qu'un besoin n'est pas écrit.
  - *Stratégie → Intention* : vous vouliez savoir si la Factory doit faire quelque chose de cette vidéo, entre rien, un essai et un objet durable. La réponse est un objet durable minimal, une clause, parce que la question de droit subsiste même si l'outil n'est pas adopté.
  - *Questions rejouées* : le dépôt existe, c'est `morluto/rea` (section 0) ; son nom exact est « REA: Reverse Engineer Anything » ; 332 631 étoiles le 19/10/2026, donc l'annonce de 150k est vraie en plancher ; licence MIT ; il donne à l'agent des outils d'analyse de binaires, d'applications JavaScript, .NET, APK et de sites (P2) ; il ajouterait au mode rétro-modèle les cibles sans source, que le mode refuse aujourd'hui, mais aucune demande n'existe (section 2) ; le cadre juridique est le tableau de la section 1.
  - *Rupture constatée* : la vidéo n'a pas été regardée, donc son propos oral n'est pas vérifié ; seule sa légende l'est. Les hypothèses non résolues sont : la date de la vidéo, déduite de son identifiant ; le chiffre d'étoiles, non audité ; les arrêts de la CJUE et la nullité des clauses contraires, lus dans des commentaires ; la directive, lue en copie anglaise ; le secret d'affaires, l'accès frauduleux et la protection technique, non instruits. Un avis de conseil reste nécessaire avant toute mission réelle.
