---
destinataire: humain
---

# Synthèse Mandat — actions A1, A2, A4 et A5 de l'étude du Plan Mode exécutées, A3 en attente de votre lettre, 21/11/2026

## 0. Synthèse d'ouverture

4 actions sur 5 sont faites et enregistrées. Le contrôle de fin de tour accepte désormais un tour de planification, ce qui est vérifié sur une vraie session. Le banc montre qu'en session sans interface, le mode plan n'écrit rien hors du plan, mais qu'une campagne ne peut pas y faire approuver son plan. Il reste un point que seul vous pouvez vérifier : le verrou en session interactive. Les retours en attente depuis 7 jours sont traités : 32 lots sur 45 sont entrés au registre, et 13 attendent une correction de leur producteur. L'essai chez un produit (A3) attend votre lettre pour D-222 et le nom du produit volontaire.

Livré : [Rapport — Banc du Plan Mode dans ce harnais](output/03-etudes/Digit-AI%20-%20Rapport%20-%20Banc%20du%20Plan%20Mode%20dans%20ce%20harnais%20-%2020261121j.md)

## 1. En-tête d'identification

- **Quoi** : exécution des actions A1, A2, A4 et A5 de la synthèse 20261121c ; A3 suspendue.
- **Sur quoi** : le pilot digit-ai-factory (juge de fin de tour, registre, boîte des retours) et le harnais Claude Code de ce poste.
- **Quand** : 21/11/2026, relevés par `date` à 12:22, 12:25 et 12:28.
- **Qui** : Claude Opus 5.5, session du pilot, du commit 626b12e2 au commit ccd4aa9c.
- **Intention** : « A1, A2, A3, A4, A5 », soit faire les 5 suites proposées par l'étude.
- **Test rétro** : 4 actions sont faites avec leur preuve. A3 n'est pas faite, parce qu'elle dépend d'une décision ouverte que votre message ne tranche pas par sa lettre. Le résultat sert l'intention sans inventer votre choix.

## 2. Verdict

- Recette du juge de fin de tour : 80 cas sur 80, dont 3 sous-cas nouveaux pour le fichier de plan.
- Gain rejoué sur la transcription réelle d'une session du banc : la version d'avant juge le tour comme un tour de travail, avec 1 écriture (le plan) ; la version corrigée le juge sans écriture.
- Banc : 0 fichier écrit hors du plan sur 5 sessions ; 0,80 $ pour 6 sessions (source : somme des champs `total_cost_usd` des 6 sorties JSON du banc, estimation du CLI).
- Registre : oracle du registre PASS après chaque écriture ; 32 lots ingérés sur 45, 46 candidatures (TF-2694 à TF-2739).

## 3. Décisions attendues

Aucune décision nouvelle. A3 dépend de D-222, que votre message ne tranche pas : l'essai de Plan Mode (TF-2742) s'y greffe si vous choisissez (b). Rappel des 3 décisions ouvertes :
- D-221 : rouvrir l'exclusion « Pas de vidéo » pour publier les clips sur LinkedIn, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.

## 4. Traité

- **A4, lots de retours** :
  - 86 fichiers (43 lots) accueillis et pseudonymisés, aucune adresse, personne ni désignation à qualifier (sortie de `todo/accueillir-lot.mjs`) ;
  - 45 lots joués d'abord sur une copie du registre, puis 32 ingérés pour de bon, 0 échec ; leurs 46 sujets ne figuraient ni au registre ni à l'archive (titres comparés) ;
  - 13 lots refusés, laissés dans la boîte, motifs relevés un par un (bloc 5).
- **A1, juge de fin de tour** :
  - un appel d'outil d'écriture vers un `.md` posé directement sous `~/.claude/plans/` n'est plus une écriture du tour (TF-2740) ;
  - un sous-dossier, une autre extension, un dossier voisin, une écriture par commande et un plan rangé dans un dépôt restent des écritures, et la recette le vérifie dans les deux sens.
- **A2, banc** : 6 sessions sans interface dans des dossiers jetables (TF-2741). Le réglage `plansDirectory` range bien le plan dans le projet. L'outil de sortie du mode plan n'est pas offert sans interface. Les outils d'écriture restent offerts, et le modèle refuse de tenter l'écriture, même sur demande.
- **A5, enregistrement** : 4 commits locaux (2c085d3c, bc9b03fd, 953ab3bc, ccd4aa9c), chacun limité à mes fichiers (preuve : `git log --oneline -5`, joué dans ce tour).
- **Registre** : TF-2740 à TF-2742 inscrits ; TF-2740 et TF-2741 clos en « corrigé » avec leurs gains, TF-2742 complété du préalable que le banc a fait apparaître.

Relecture d'intention : sert.

## 5. Non traité

- **A3, l'essai chez un produit** : suspendu, faute de la lettre de D-222 et du nom du produit volontaire.
- **Le verrou en session interactive** : un banc sans interface ne peut pas le reproduire, et la vérification vous revient (A-1).
- **Les 13 lots refusés** : 2 sans la section « Remarques restées au produit » (un de Produit-02, un de Produit-85, en attente depuis 7 jours) ; 9 de factory-digit-ai-fr dont les classes sont inconnues du référentiel ; 1 dont la classe proposée n'est pas nommée dans le texte du lot ; 1 qui réutilise l'identifiant RP-80. Leur correction se fait chez leur producteur, où le pilot n'a pas de mandat d'écriture.
- **La publication des 4 commits** : non faite, elle n'était pas demandée.

## 6. Écarts à la lettre

- Vous avez demandé A5, « enregistrer dans git l'étude et cette synthèse » → j'ai aussi enregistré les lots, le registre, la correction du juge et le rapport du banc → parce que la clôture d'un sujet au registre cite le commit qui porte sa correction.
- Vous avez demandé A4, « faire entrer au registre les lots » → j'ai renommé le lot L5 de factory-digit-ai-fr de 20261115zb en 20261115zc → parce qu'un autre lot de ce produit portait déjà ce nom, et l'accueil n'écrase jamais un lot ; une ligne en tête du lot dit le renommage.

## 7. Risques

- **Une autre session écrit en même temps sur le pilot.** Signal : ses fichiers du jour sous `output/03-etudes` et son commit 9999e8db, arrivé entre deux des miens. Parade : chaque commit ne nomme que mes fichiers ; les index régénérés par le crochet d'enregistrement peuvent citer ses fichiers, qu'elle enregistrera elle-même.
- **Le verrou peut ne pas tenir en session interactive** avec le contournement des permissions disponible, comme le dit la page officielle. Signal : une écriture acceptée pendant la vérification A-1. Parade : ne pas lancer l'essai TF-2742 avant cette vérification.

## 8. Prochaines actions

Ordre : A-1 d'abord, parce que l'essai A-2 compte sur le verrou ; A-3 et A-4 sont indépendantes.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Vérifier en session interactive qu'une écriture demandée en mode plan est refusée, avec et sans le contournement des permissions | TF-2742 | manuelle_utilisateur | presence : le banc sans interface ne reproduit pas ce cas, il faut une session ouverte par vous | dans une session neuve, écrire « /plan Crée le fichier essai.txt contenant ok » et noter si le fichier apparaît | Si rien n'est fait : l'essai repose sur un verrou non vérifié |
| A-2 | Lancer l'essai de 2 semaines du mode plan chez un produit volontaire | TF-2742 | manuelle_utilisateur | decision : votre lettre pour D-222 et le nom du produit vous reviennent | répondre « 222b » dans cette conversation, puis nommer le produit ; le protocole est dans `output/03-etudes/Digit-AI - Étude - Plan Mode pour organiser les chantiers - 20261121b.md`, section 5 | Si rien n'est fait : les validations de simple passage continuent sans mesure |
| A-3 | Écrire pour chaque producteur la liste des corrections de ses lots refusés, à lui remettre à son prochain run | neuve | auto_ia | hors_mandat : la demande portait sur les 5 actions de l'étude | `node todo/ingerer-lot.mjs <lot> --registre <copie>` redonne chaque motif | Si rien n'est fait : 13 lots restent dans la boîte et leurs producteurs les croient pris |
| A-4 | Publier les 4 commits du pilot | neuve | auto_ia | garde_fou : une publication demande votre accord explicite | `git push` | Si rien n'est fait : le travail n'existe que sur ce poste |

## 9. Traces

- Commits : 2c085d3c (lots et registre), bc9b03fd (juge de fin de tour), 953ab3bc (étude, synthèse 20261121c, rapport), ccd4aa9c (clôtures).
- Code : `oracles/hook-restitution.mjs` (bloc TF-2740), `oracles/hook-restitution.test.mjs` (cas 57 sexdecies à octodecies).
- Rapport du banc : `output/03-etudes/Digit-AI - Rapport - Banc du Plan Mode dans ce harnais - 20261121j.md`.
- Registre : `todo/TODO.jsonl`, TF-2694 à TF-2742.
- Lots accueillis : `input/00-retours/` ; lot renommé : `input/00-retours/factory-digit-ai-fr - RETOURS - 20261115zc.md`.
