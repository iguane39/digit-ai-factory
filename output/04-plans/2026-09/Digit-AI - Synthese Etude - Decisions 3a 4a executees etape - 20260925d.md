---
destinataire: humain
---

# Synthèse Étude — décisions 3a et 4a exécutées : l'étape 1 des niveaux est en place au pilot, la candidature est en cours, les 4 fichiers des 2 tours sont enregistrés (25/09/2026)

Vos 2 décisions sont exécutées. La première étape des niveaux d'intervention est en place au pilot : une question simple peut recevoir une réponse directe de 150 mots au plus, et un message qui commence par « vite : » la demande explicitement ; « complet : » demande au contraire le traitement complet. Le juge de fin de tour et le niveau de réflexion ne changent pas, pour que l'essai mesure le seul effet de la réponse directe. L'essai court du 26 septembre au 2 octobre, et la mesure sera rejouée le 2 octobre. La proposition est inscrite au registre, et les 4 fichiers des 2 tours précédents sont enregistrés localement, sans publication. Ce qui est attendu de vous : dire si les 5 fichiers de cette étape s'enregistrent aussi, et poser vos questions simples comme d'habitude, ou précédées de « vite : ».

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-3 a (mener l'étape 1 de l'étude, inscrire la candidature) et D-4 a (enregistrer localement les fichiers des 2 tours précédents).
- **sur quoi** — le pilot `digit-ai-factory` : 1 fichier créé (`references\NIVEAUX.md`), 4 modifiés (`CLAUDE.md`, `oracles\hook-lexique.mjs`, `oracles\hook-lexique.test.mjs`, `todo\TODO.jsonl`), 2 vues du registre régénérées, 1 commit local, cette synthèse.
- **quand** — 2026-09-25 14:16 UTC+02:00 (Europe/Paris) ; début du tour à 14:04:01, horodatage du message « 3a, 4a » lu au transcript ; durée mesurée 12 min.
- **qui** — session Opus 5.5 à l'effort « max » (champ lu au transcript de la session) sur le pilot local `1b2c6bd` ; aucun sous-agent ; escalade de modèle : aucune ; oracles joués : `oracle-claude-md`, le self-test et le banc de `hook-lexique`, les bancs de ses 2 modules importateurs, `oracle-todo` par `todo\journaliser.mjs`, et `oracle-synthese` sur ce document.
- **intention** — obtenir des réponses rapides et courtes aux questions simples, sans relancer tout le process, en gardant le process complet pour les vrais travaux. Test rétro : l'étape 1 sert cette intention dès le prochain message, par la réponse directe et le mot « vite : » ; ce qui ne la sert pas encore : le gain reste à mesurer le 2026-10-02, et les questions de recherche gardent le format complet jusqu'à l'étape 2.

## 2. Verdict en une ligne

**Les 2 décisions sont exécutées : étape 1 en place au pilot, avec le noyau à 6 144 octets sur 6 144 et `oracle-claude-md` PASS, le hook de lexique à 29 cas sur 29 au self-test et 10 sur 10 au banc ; candidature TF-1391 inscrite, décidée et en cours, `oracle-todo` PASS ; commit local `1b2c6bd` de 10 fichiers ; 0 push.**

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent la suite de ce travail :

- l'enregistrement local des 5 fichiers de l'étape 1 est à l'arrêt ; il faut votre accord ; si rien n'est fourni, ils restent modifiés sur disque, hors de l'historique du dépôt.
- la mesure de revue est à l'arrêt jusqu'au 2 octobre ; il faut que la semaine d'essai s'écoule ; si elle n'est pas rejouée, l'essai ne dit rien.

> **D-5 — Les 5 fichiers de l'étape 1 s'enregistrent-ils localement dans le dépôt `digit-ai-factory` ?**
>
> L'étape 1 a créé `references\NIVEAUX.md` et modifié `CLAUDE.md`, `oracles\hook-lexique.mjs`, `oracles\hook-lexique.test.mjs` et `todo\TODO.jsonl`. L'accord que vous avez donné pour l'enregistrement ne couvrait que les 4 fichiers des 2 tours précédents, et ces 5 fichiers sont nés après lui. Les vues du registre sont ignorées par git et restent hors du sujet.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain »). Un enregistrement local est réversible, ne publie rien, et protège le noyau modifié d'une remise à niveau du poste.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** enregistrer localement les 5 chemins, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : le noyau et le hook modifiés restent hors de l'historique pendant l'essai |

> **Si rien n'est décidé** : l'option (b) s'applique ; les 5 fichiers restent modifiés sur disque, non enregistrés.

## 4. Traité — avec sa preuve

Chaque décision reçue a son geste ; chaque élément ci-dessous porte la sortie qui l'établit.

- **Le référentiel des niveaux est écrit, sur la décision D-3 a** : `references\NIVEAUX.md`, version 1.0.0, porte le niveau Simple, les invariants, les 2 mots-clés, le niveau Moyen différé et l'essai.
  - preuve : `node oracles\oracle-claude-md.mjs` → « references\NIVEAUX.md cité par le noyau et présent », « aucune référence orpheline ».
- **Le noyau y renvoie sans grossir** : la ligne « Restitution » porte « question simple : `references\NIVEAUX.md` », et le détail des options et des acteurs, que le gabarit de restitution porte déjà, en sort.
  - preuve : `oracle-claude-md` → PASS, « noyau 6144 octets ≤ 6144 », « aucun quantificateur perdu par rapport à la version commise ».
- **Les mots-clés entrent au lexique, au pilot seul** : « vite : » demande le niveau Simple, « complet : » le niveau Complexe ; la ligne ne sort que si le dossier de la session porte le référentiel, ce qui tient les produits hors de l'étape 1.
  - preuve : `node oracles\hook-lexique.mjs --self-test` → « 29 PASS, 0 FAIL » ; `node oracles\hook-lexique.test.mjs` → « 10 PASS, 0 FAIL », dont « vite : » au pilot → ligne Simple et le même message dans un dossier de produit → rien ; modules importateurs : `hook-amorcage.test.mjs` 17 sur 17, `oracle-portee-doctrine` PASS et 12 sur 12 à son self-test.
- **La candidature est au registre, décidée et en cours** : TF-1391 (niveaux d'intervention, étape 1), nature opportunité, score 5,33, décision humaine consignée avec votre réponse « 3a, 4a ».
  - preuve : `node todo\journaliser.mjs` → 3 événements écrits, `oracle-todo` PASS avant et après ; les 2 vues générées du registre, la vue Markdown et la page, régénérées : 609 actifs, TF-1391 affichée « en_cours ».
- **Les fichiers des 2 tours sont enregistrés, sur la décision D-4 a** : les 4 fichiers, leurs 2 fichiers de jugement et les 4 index de dossiers régénérés par ces seuls ajouts.
  - preuve : commit local `1b2c6bd`, 10 fichiers, 1 774 insertions, par `git commit --only` sur ces 10 chemins ; les index indexés par d'autres sessions sont laissés tels quels ; `git rev-list --left-right --count HEAD...origin/main` → 10 commits d'avance, 0 de retard, aucun push.

## 5. Non traité — avec son motif

- L'enregistrement local des 5 fichiers de l'étape 1 — motif : dépendance à une décision humaine (D-5), l'accord reçu ne couvrant que les fichiers des 2 tours précédents.
- La phrase prévue au §Portée du gabarit de restitution sur le niveau Simple — motif : écarté pour l'étape 1, parce que ce gabarit est recopié tel quel chez chaque produit à l'ouverture de sa session ; critère de réouverture : l'étape 2, avec la forme Moyen.
- La mesure de revue — motif : dépendance externe, la semaine d'essai ; elle se rejoue le 2026-10-02.
- Le push — motif : hors mandat, aucune décision ne l'a demandé.

## 6. Écarts à la lettre

- **Vous avez écrit** « 4a », qui enregistre les 4 fichiers → **j'ai enregistré** aussi leurs 2 fichiers de jugement et les 4 index de dossiers → **pourquoi** : 36 des 40 fichiers de jugement du dossier sont suivis par git, et un index publié ne nomme que ce que le dépôt porte ; sans eux, les index auraient décrit un dépôt qui n'existe pas.
- **Vous avez écrit** « 3a », où l'étape 1 prévoyait un mot-clé → **j'en ai ajouté 2**, « vite : » et « complet : » → **pourquoi** : l'étude nomme les 2 ; « complet : » vous rend la main pour forcer le traitement complet.
- **L'étape 1 prévoyait** un renvoi au noyau → **j'ai retiré** de la même ligne le détail des options et des acteurs → **pourquoi** : le noyau est plein, ce détail vit dans le gabarit de restitution, et aucun mot protégé n'a disparu.
- **La table des porteurs de l'étude prévoyait** une phrase au gabarit de restitution pour le niveau Simple → **je l'ai reportée** à l'étape 2 → **pourquoi** : ce gabarit part chez les produits à leur prochaine ouverture, et l'étape 1 est au pilot seul.

## 7. Risques

- L'autre poste n'a pas l'étape 1 tant que rien n'est poussé ;
  - signal : sur l'autre poste, « vite : » ne produit aucune ligne de niveau ;
  - parade : le push, sur votre feu vert ; la mesure de revue ne lit que les transcripts de ce poste.
- Une réponse Simple porte un mot de verdict et se fait juger en entier ;
  - signal : un refus du hook de fin de tour sur une réponse courte ;
  - parade : le référentiel liste les mots de verdict à éviter, et la revue compte ces refus.
- Les 5 fichiers de l'étape 1 se perdent dans une remise à niveau du poste ;
  - signal : `git status` ne les montre plus modifiés, et le noyau a perdu son renvoi ;
  - parade : la décision D-5.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-5 avant la mesure datée du 2026-10-02, parce qu'elle protège ce que la mesure jugera ; puis la décision humaine.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Enregistrer localement les 5 fichiers de l'étape 1 par `git commit --only`, sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-5 | simple × court | le noyau et le hook modifiés restent hors de l'historique |
| A-2 | Rejouer les scripts de mesure de l'étude sur les tours du 2026-09-26 au 2026-10-02 et confronter l'essai à ses cibles (TF-1391) | auto_ia | `dependance_externe` — la semaine d'essai, jusqu'au 2026-10-02 | simple × court | l'essai ne dit rien, et l'étape 2 se déciderait sans mesure |
| A-3 | Trancher D-5 en répondant « D-5 a » ou « D-5 b » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — l'enregistrement dans git attend votre accord | simple × court | rien n'est enregistré |

## 9. Traces

- Référentiel : `references\NIVEAUX.md` (version 1.0.0).
- Noyau : `CLAUDE.md`, ligne « Restitution ».
- Hook et banc : `oracles\hook-lexique.mjs`, `oracles\hook-lexique.test.mjs`.
- Registre : `todo\TODO.jsonl`, TF-1391 ; ses 2 vues générées, ignorées par git.
- Commit local : `1b2c6bd`, « Niveaux d intervention : analyse L99 du prompt, etude d opportunite (verdict O3) et leurs syntheses du 25/09 ».
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Etude - Decisions 3a 4a executees etape 1 des niveaux en essai - 20260925d.md`.
- Oracles : `oracle-claude-md` PASS ; `hook-lexique` 29 sur 29 et 10 sur 10 ; `oracle-todo` PASS ; `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
