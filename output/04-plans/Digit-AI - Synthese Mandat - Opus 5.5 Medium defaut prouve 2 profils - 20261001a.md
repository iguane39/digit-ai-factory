---
destinataire: humain
---

# Synthèse Mandat — Opus 5.5 en effort medium est le défaut des conversations neuves, prouvé sur les 2 profils (01/10/2026)

## 0. Synthèse d'ouverture

Vos prochaines conversations démarrent sur Opus 5.5 en effort medium, sur vos 2 profils Claude Code. Le changement était fait avant ma première lecture des réglages. Une autre conversation avait reçu la même demande à 09:47, et elle a retiré à 09:51 la variable qui imposait l'effort max. Je ne l'ai pas refait. J'ai prouvé l'effet sur le profil par défaut par une session neuve de 6 secondes, que son transcript enregistre en effort medium. Cette conversation-ci a démarré à 09:50, avant le retrait : elle reste en max jusqu'à sa fin.

## 1. En-tête d'identification

- **quoi** — votre demande « Passe à Opus 5.5 Medium par défaut » : relevé des réglages, recherche de la source de l'effort max, essai d'une session neuve ; aucun réglage modifié par cette session.
- **sur quoi** — les 2 fichiers de réglages du poste, `~\.claude\settings.json` et `~\.claude-b\settings.json`, en lecture ; les transcripts de Claude Code du poste, en lecture ; le pilot `digit-ai-factory`, pour cette synthèse seulement.
- **quand** — 2026-10-01 10:06 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début du tour à 09:51:01, horodatage de votre message lu au transcript ; durée mesurée 15 min.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) à l'effort max, champ `effort` lu au transcript ; pilot à `e3ccd9a1` ; aucun sous-agent ; escalade de modèle : aucune ; 1 session d'essai lancée par la CLI de l'extension 2.1.286 ; oracle joué : `oracle-synthese` sur ce document.
- **intention** — que chaque nouvelle conversation démarre d'elle-même sur Opus 5.5 en effort medium. **Test rétro** : servie pour l'extension VS Code, sur les 2 profils, chacun prouvé par une session neuve en effort medium ; le terminal reste à part, sa CLI 2.1.169 démarre sur Opus 4.8.

## 2. Verdict en une ligne

**Réglage en place sur les 2 profils depuis 09:51, posé par une autre conversation et prouvé ici : session neuve du profil `.claude` sur `claude-opus-5-5[1m]` en effort medium (transcript `ee5dcf91`), session neuve du profil `.claude-b` en medium (transcript `0fa78a9f`) ; 0 réglage modifié par cette session ; les conversations lancées avant 09:51 restent en max.**

## 3. Décisions attendues de l'humain

Rien n'attend de décision de votre part dans ce tour. La seule décision ouverte sur ce sujet, la mise à jour de la CLI du terminal pour qu'il démarre lui aussi sur Opus 5.5, est déjà posée dans la restitution de l'autre conversation, la session `a35d500b` du profil `.claude-b`.

## 4. Traité — avec sa preuve

Les preuves ci-dessous sont des sorties de commandes de ce tour, ou des lignes de transcripts relues dans ce tour.

- **Les 2 profils portent le réglage demandé** : `model` vaut `opus[1m]`, `modelSettings.claude-opus-5-5.effortLevel` vaut `medium`, et le bloc `env` ne contient plus `CLAUDE_CODE_EFFORT_LEVEL`.
  - preuve : lecture des 2 fichiers par `ConvertFrom-Json` à 10:00 → `model=opus[1m]`, `effortLevel=medium` sous `claude-opus-5-5`, variable absente, aucun `effortLevel` global, pour `.claude` comme pour `.claude-b`.
- **Le retrait de la variable vient de l'autre conversation, pas de celle-ci** : elle avait reçu « Passe à Opus 5.5 Medium par défaut » à 09:47:11.
  - preuve : son transcript, session `a35d500b`, porte 2 appels Edit, à 09:51:09 sur `.claude-b` et à 09:51:10 sur `.claude`, qui retirent chacun la ligne `"CLAUDE_CODE_EFFORT_LEVEL": "max"` ; ma première lecture des réglages date de 09:51:57.
- **Une session neuve du profil par défaut démarre sur Opus 5.5 en effort medium** : essai lancé sans la variable, avec la CLI de l'extension.
  - preuve : `claude.exe` 2.1.286, `-p "Réponds uniquement OK."` → code de sortie 0 en 6 s, événement de démarrage `model=claude-opus-5-5[1m]`, réponse « OK » ; son transcript `ee5dcf91` porte `effort=medium` sur sa requête de 10:02:24.
- **Une session neuve du profil `.claude-b` démarre aussi en effort medium** : l'essai lancé par l'autre conversation à 09:53:40.
  - preuve : son transcript `0fa78a9f` porte `effort=medium` sur sa seule requête. L'autre restitution tenait cet effort pour illisible ; le champ `effort` du transcript le donne.
- **Les conversations lancées avant le retrait restent en max** : la variable est lue au lancement du processus.
  - preuve : cette conversation, lancée à 09:50:08, porte encore `CLAUDE_CODE_EFFORT_LEVEL=max` dans son environnement, relevé à 09:52 ; ses requêtes sont toutes en `max` au transcript, comme les 76 requêtes de la conversation `76c67a6d` du pilot, relevées à 09:59.
- **Aucune autre source n'impose l'effort ou le modèle** : ni variable Windows, ni réglage VS Code, ni réglage de projet.
  - preuve : `CLAUDE_CODE_EFFORT_LEVEL` absente des environnements Windows utilisateur et machine ; 4 lignes `claudeCode` dans les réglages VS Code, aucune variable d'environnement ; `managed-settings.json` absent ; 0 clé d'effort ou de modèle dans les `.claude\settings*.json` des dépôts de `C:\dev` ; processus de cette conversation lancé sans `--effort` ni `--model`.

## 5. Non traité — avec son motif

- La mise à jour de la CLI du terminal, qui démarre sur Opus 4.8 avec le même réglage — motif : `hors_mandat`, la décision est déjà posée par l'autre conversation, qui a reçu la même demande ; la reposer ici la ferait trancher 2 fois.

## 6. Écarts à la lettre

- **Vous avez écrit** « Passe à » → **aucun réglage modifié par cette session** → **pourquoi** : l'autre conversation avait fait le retrait à 09:51:10, 47 secondes avant ma première lecture des réglages ; le refaire n'aurait rien changé.
- **Vous avez écrit** « Opus 5.5 » → **le réglage garde le nom de famille `opus[1m]`** → **pourquoi** : c'est votre décision du 25/09, qui fait suivre au poste chaque version d'Opus ; l'essai de 10:02 le résout en `claude-opus-5-5[1m]`.
- **Vous avez écrit** « par défaut » → **l'effet commence à la prochaine conversation** → **pourquoi** : cette conversation a démarré à 09:50 avec la variable dans son environnement, et un processus lancé ne la relit pas.

## 7. Risques

- La prochaine version d'Opus déplacera le nom de famille `opus[1m]`, et l'effort medium, rangé sous `claude-opus-5-5`, ne la suivra pas ;
  - signal : une conversation neuve qui démarre sur un autre modèle qu'Opus 5.5 ;
  - parade : reposer l'effort medium sous le nouveau modèle, ou un `effortLevel` global si vous le voulez pour tous les modèles.
- Le terminal démarre sur Opus 4.8 : sa CLI 2.1.169 résout `opus[1m]` en `claude-opus-4-8[1m]`, mesuré par l'autre conversation à 09:52 ;
  - signal : une session lancée par `claude` dans un terminal annonce Opus 4.8 ;
  - parade : la décision de mise à jour posée par l'autre conversation.

## 8. Prochaines actions

Ordre du tableau : une seule action, parce que le réglage est en place et prouvé, et que seule la fin des conversations déjà ouvertes reste entre vos mains.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Ouvrir une conversation neuve pour tout travail qui doit tourner en medium ; celles lancées avant 09:51, dont celle-ci, gardent l'effort max jusqu'à leur fin (neuve) | manuelle_utilisateur | `presence` — seule une conversation que vous ouvrez lance un processus neuf ; trace mesurée : `CLAUDE_CODE_EFFORT_LEVEL=max` relevée à 09:52 dans le processus de cette conversation, lancé à 09:50 | simple × court | le travail continue en max dans les conversations déjà ouvertes, au coût de max |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Opus 5.5 Medium par defaut prouve sur les 2 profils - 20261001a.md`.
- Essai du profil par défaut : session `ee5dcf91-765c-4ce0-8011-a84a108e6c6c`, transcript rangé sous `~\.claude\projects\`, dans le dossier du répertoire de travail temporaire de cette conversation ; flux de sortie `flux-claude-defaut.jsonl` dans ce même répertoire.
- Transcripts relus : session `a35d500b` et essai `0fa78a9f` sous `~\.claude-b\projects\` ; sessions `5a933fc0` et `76c67a6d` du pilot sous `~\.claude\projects\`.
- Scripts de lecture, dans le répertoire de travail temporaire de cette conversation : `lire-session.mjs`, `entrees-brutes.mjs`, `efforts-par-session.mjs`, `outil-complet.mjs`.
- Mémoire du pilot : 1 fiche ajoutée, `reglages-poste-deux-profils.md`, qui dit les 2 profils du poste et la méthode de l'essai, avec sa ligne d'index dans `MEMORY.md`.
- Aucune page HTML livrée dans ce tour. Rien n'est enregistré ni poussé.
