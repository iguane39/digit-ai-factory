---
destinataire: humain
---

# Synthèse de mandat — réseaux sociaux : la barre est validée, et votre objection est fondée : LinkedIn est le réseau le plus fermé des 9 relevés, pas la norme ; il vous reste à dire jusqu'où élargir (17/09/2026)

Votre validation est exécutée : la barre de qualité d'une publication est en service chez forge-agents. Votre objection est fondée, et la restriction venait de moi. En réécrivant votre demande, j'avais proposé 3 resserrements : la capacité pour Digit-AI seule, « particuliers et professionnels » lu comme 2 types de comptes, et LinkedIn pour seul réseau. Votre « A1 » les a validés en bloc, et l'étude a fermé la liste au lieu de vous reposer la question. J'ai fait relever aussitôt 8 autres réseaux. Ce que cela change pour vous : la conclusion la plus forte de l'étude, « publier est un geste humain par contrat », ne vaut que pour LinkedIn ; 5 réseaux sur 8 ouvrent gratuitement une voie officielle pour publier sur son propre compte. Côté métier, 9 étapes n'ont pas été instruites, dont les avis clients et la vidéo. Ce qui est attendu de vous : dire pour qui et sur quels réseaux l'étude s'élargit.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 4a », soit D-4 (a) : barre validée chez forge-agents ; puis réponse à votre objection sur le périmètre : relevé factuel de 8 réseaux et des étapes non traitées, une candidature au registre.
- **sur quoi** — la forge `digit-ai-forge-agents` (1 commit local) et le pilot `digit-ai-factory` (un relevé, une candidature, le registre).
- **quand** — 2026-09-17 15:35 UTC+02:00 (Europe/Paris), heure relevée par `Get-Date` à 15:29 ; durée mesurée du tour ≥ 20 min, dont 4 min pour le relevé (mesure du harnais : 230 s).
- **qui** — pilot `eb90ae0` (aucun enregistrement fait par moi) ; forge-agents `fc84225` → `1124400` ; session Fable 5.1 au pilotage, un agent Sonnet délégué en lecture seule (46 appels d'outils), escalade de modèle : aucune ; oracles joués : `oracle-todo` (par `journaliser.mjs` et `ingerer-lot.mjs`), `check_markdown.py`, `oracle-synthese`.

## 2. Verdict en une ligne

**Barre validée : 1 commit local chez forge-agents (`1124400`), entrée passée de « todo » à « ok » ; relevé de 9 réseaux : 5 sur 8 hors LinkedIn ouvrent une publication officielle gratuite sur compte propre, 5 sur 8 une programmation native gratuite, 5 un export confirmé ; 9 étapes du métier non instruites ; 10 lignes du relevé reposent sur des sources secondaires et sont marquées ; 1 candidature ingérée (TF-1178), `oracle-todo` PASS ; rien n'est enregistré côté pilot, rien n'est poussé.**

## 3. Décisions attendues de l'humain

> **D-5 — Pour qui et sur quels réseaux l'étude sur la gestion de réseaux sociaux doit-elle s'élargir ?**
>
> L'étude sur la gestion de réseaux sociaux n'a instruit que la présence de Digit-AI sur LinkedIn. Le relevé du jour montre que ce réseau est le plus fermé : Instagram, Facebook, YouTube, Threads et Bluesky offrent une voie officielle et gratuite pour publier sur son propre compte ; TikTok et la fiche d'établissement Google l'offrent sous condition ; X la fait payer. Les étapes laissées de côté sont les avis clients, la déclinaison d'un contenu par format, la vidéo, la publicité, l'écoute, la prospection par messages, la gouvernance des comptes, la mesure jusqu'au contact et la crise. Le choix du bénéficiaire décide du reste : une société de conseil vit sur LinkedIn ; un restaurant ou des gîtes vivent sur Instagram, Facebook et leur fiche Google.
>
> **Recommandation : (a).** Source consultée : `output\03-etudes\20260917-releve-autres-reseaux-sociaux.md` §2 et §3 ; `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.md`, hypothèses H0 (hypothèse sur le bénéficiaire de la capacité), H1 (hypothèse sur le sens de « particuliers et professionnels ») et H2 (hypothèse sur la liste des réseaux). Votre demande d'origine disait « réseaux sociaux particuliers et professionnels » : sa lecture la plus naturelle couvre les 2 familles de réseaux, et les produits que la factory suit comptent des commerces de proximité.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** étude complémentaire large : les 9 réseaux relevés, les 9 étapes, et 2 types d'émetteur (société de conseil, commerce de proximité) ; les faits du relevé rejoués sur pages officielles datées ; l'option « logiciel » et la règle d'accord humain avant publication réexaminées | effort complexe × moyen ; puis mise à jour du référentiel des plateformes et du type de run, simple × court | exclut toute construction et toute publication avant votre lecture du verdict |
| **(b)** élargissement ciblé — répondre « D-5 (b) réseaux : … ; pour : … ; étapes : … » | effort moyen × court à moyen × moyen selon la liste | exclut les réseaux et les étapes non nommés, par écrit cette fois |
| **(c)** rester sur LinkedIn jusqu'à la revue du 2026-10-09 | effort nul | exclut les commerces de proximité et tout réseau grand public ; le type de run garde une phrase fausse hors LinkedIn, que A-24 corrige de toute façon |

> **Si rien n'est décidé** : l'option (c) s'applique — l'étude sur la gestion de réseaux sociaux reste bornée à LinkedIn, la candidature d'élargissement reste « candidat ».

## 4. Traité — avec sa preuve

- **Votre validation D-4 (a) est exécutée** : la barre « publication réseau » passe à « ok », avec votre réserve consignée (elle ne couvre que LinkedIn ; un autre réseau demandera sa propre entrée).
  - preuve : forge-agents, `git commit --only` → `1124400`, « 1 file changed, 3 insertions(+), 9 deletions(-) » ; `journaliser.mjs` → « ecrits=1 apres=PASS » sur TF-1028 (barres externes de qualité, encore en cours pour 2 autres barres).
- **L'origine de la restriction est établie** : 3 hypothèses proposées par mon analyse du prompt, validées en bloc par « A1 », appliquées par l'étude.
  - preuve : analyse L99 (analyse de prompt en 8 couches) du matin, écarts n° 4 et n° 5 ; étude, section « Intention de l'utilisateur », hypothèses H0, H1, H2.
- **8 autres réseaux sont relevés**, sur 6 questions chacun : publier et lire ses chiffres par interface officielle, programmation native, export manuel, règles d'automatisation, déclaration des contenus générés.
  - preuve : rapport de l'agent, 46 appels d'outils ; pages officielles ouvertes et datées pour TikTok (2026-08-04), YouTube (conditions du 2026-09-14), Meta (conditions du 2026-02-03), fiche Google ; sources secondaires déclarées pour X, Threads et la programmation Meta.
- **Le relevé est déposé et jugé**, avec la solidité de chaque ligne et ce qu'il défait dans l'étude.
  - preuve : `output\03-etudes\20260917-releve-autres-reseaux-sociaux.md` ; `check_markdown.py` → « Verdict : PASS ».
- **La candidature d'élargissement est au registre.**
  - preuve : `ingerer-lot.mjs` → « 1 candidature(s) ingérée(s) en CANDIDAT (lot 8f939c072b97) » ; identifiant TF-1178.

## 5. Non traité — avec son motif

- L'étude complémentaire elle-même — motif : dépendance à une décision humaine (D-5) ; c'est précisément le choix du bénéficiaire et des réseaux que j'avais tranché à votre place ce matin, et je ne le refais pas.
- La correction de la phrase « ce n'est pas un choix de doctrine » dans le type de run, vraie pour LinkedIn seulement — motif : écarté de ce tour pour ne pas réécrire le document 2 fois ; A-24 la corrige quelle que soit votre réponse.
- La vérification de la planification native de LinkedIn — motif : non rendue par l'agent ; à rejouer avec l'étude complémentaire ou avec A-24.
- L'enregistrement côté pilot et le push des 2 dépôts — motif : dépendance à une décision humaine ; la règle 38 fait du push un geste sur accord.

## 6. Écarts à la lettre

- **Vous avez écrit** « 4a » → **j'ai fait** D-4 (a), et j'ai consigné dans l'entrée votre réserve du même message → aucun écart.
- **Vous avez posé** 2 questions (« pourquoi que LinkedIn ? », « d'autres éléments sur d'autres réseaux ou d'autres étapes ? ») → **j'ai répondu** par un relevé mesuré et une décision de périmètre, sans lancer l'étude complémentaire → **pourquoi** : le relevé ne dépendait pas de vous, le choix du bénéficiaire et des réseaux si ; l'avoir tranché seul ce matin est la cause du défaut.

## 7. Risques

- Le relevé est pris pour une étude, et une construction part de ses lignes « secondaires » ;
  - signal : un document qui cite le relevé sans avoir rejoué la page officielle ;
  - parade : chaque ligne porte sa solidité, et le relevé se périme le 2026-12-02.
- L'ouverture technique de 5 réseaux pousse à publier sans accord humain ;
  - signal : une proposition d'outil de publication automatique avant toute position écrite sur la règle 38 ;
  - parade : l'option (a) met cette position au programme de l'étude ; d'ici là, la règle tient partout.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, celle qui ne dépend de rien avant celles qui attendent une décision ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-24 | Corriger `references\RUN-RESEAU.md` : borner à LinkedIn la phrase sur le geste humain « par contrat », et dire que la règle d'accord humain tient ailleurs par choix de la factory ; vérifier la planification native de LinkedIn sur sa page d'aide (neuve) | auto_ia | `dependance_bloc_3` — se fait avec l'étude si D-5 (a) ou (b), seule si D-5 (c) ; à défaut, le type de run affirme une chose fausse hors LinkedIn | simple × court |
| A-23 | Jouer l'étude complémentaire selon D-5, au gabarit d'étude, avec sa page ; puis mettre à jour le référentiel des plateformes en référentiel à plusieurs réseaux (TF-1178) | auto_ia | `dependance_bloc_3` — attend D-5 ; à défaut, la capacité reste bâtie sur le cas le plus fermé | complexe × moyen |
| A-18 | Enregistrer côté pilot, par `git commit --only -- <chemins>`, tout le travail de cette session, puis pousser le pilot et forge-agents (19 commits en avance) (neuve le 17/09, reprise) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-21 ; à défaut, rien n'est enregistré côté pilot | simple × court |
| A-25 | Trancher D-5 — répondre « D-5 (a) », « D-5 (b) réseaux : … ; pour : … » ou « D-5 (c) » (neuve) | manuelle_utilisateur | `decision` — le bénéficiaire et les réseaux sont votre intention, que j'ai eu tort de fixer seul ; sinon : le périmètre reste LinkedIn | simple × court |
| A-21 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve le 17/09, reprise) | manuelle_utilisateur | `decision` — règle 38 : le push est un geste sur accord ; sinon : rien n'est publié | simple × court |

## 9. Traces

- Forge-agents, commit local : `1124400` (validation de la barre, TF-1028).
- Pilot : `output\03-etudes\20260917-releve-autres-reseaux-sociaux.md`, `input\01-candidatures\reseaux-sociaux-elargir-perimetre-20260917d.tf.jsonl` (TF-1178), `todo\TODO.jsonl`.
- Aucune page HTML livrée dans ce tour. Tout est indexé, rien n'est enregistré.
