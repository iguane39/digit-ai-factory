---
destinataire: humain
---

# Synthèse de mandat — réseaux sociaux : votre règle de mandat permanent est écrite, et les quatre pièces de forge-agents sont construites et vertes ; il vous reste à valider la barre de qualité d'une publication (17/09/2026)

Votre décision est exécutée, et votre règle est entrée dans la doctrine : la Factory écrit désormais dans les forges sans vous demander de mandat, et seul le résultat vous remonte. La question que je vous avais posée n'avait pas à l'être ; elle ne se reposera pas. Sous cette règle, trois agents ont construit chez forge-agents les quatre pièces qui manquaient : un modèle de publication à deux écritures, la reprise propre du skill de publication installé, la barre de qualité d'une publication, et le contrôle de transparence des contenus générés. Chez le pilot, la semaine d'essai à blanc du rendez-vous hebdomadaire a tourné dans les deux sens. Ce que cela change pour vous : tout ce qu'il faut pour sortir une publication sous contrôle existe. Ce qui est attendu de vous : valider ou amender la barre de qualité, puis dire si tout s'enregistre et se publie.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 3a », soit D-3 (a), et de votre règle du même message (mandat permanent d'écriture dans les forges) : doctrine mise à jour, campagne de trois agents chez forge-agents, semaine d'essai à blanc du type de run, registre et journal de boucle.
- **sur quoi** — le pilot `digit-ai-factory` (doctrine, références, un oracle, registre) et la forge `digit-ai-forge-agents` (4 commits locaux) ; lectures seules chez `digit-ai-marketing` et sur le skill installé `linkedin-post-generator`.
- **quand** — 2026-09-17 11:30 UTC+02:00 (Europe/Paris), heure relevée par `Get-Date` à 11:26 ; durée mesurée du tour ≥ 95 min, dont 43 min pour la campagne la plus longue (mesure du harnais : 2 608 s).
- **qui** — pilot, parti de `b284504` puis porté à `eb90ae0` par une autre session pendant le tour (aucun enregistrement fait par moi) ; forge-agents `11da7be` → `fc84225` ; session Fable 5.1 au pilotage, trois agents délégués (deux Sonnet, un Opus pour la construction de l'oracle), escalade de modèle : aucune ; oracles joués : `oracle-claude-md`, `oracle-todo`, `check_markdown.py`, `oracle-run-reseau --self-test`, `oracles\self-tests.mjs`, les bancs natifs de forge-agents, `oracle-synthese`.

## 2. Verdict en une ligne

**4 commits locaux chez forge-agents, 4 bancs natifs verts (dont `quality-oracles` 269 → 289 contrôles) ; 5 candidatures closes en « corrige » dans ce tour (TF-1155, TF-1157, TF-1030, TF-1158, TF-1167) et 1 en cours (TF-1028) ; semaine à blanc 2 cas sur 2 PASS ; noyau à 6 144 octets pour un plafond de 6 144, `oracle-claude-md` PASS ; 1 contrôle reste rouge sur le parc : `oracle-skills`, copies installées en retard sur les sources ; rien n'est enregistré côté pilot par cette session, rien n'est poussé.**

## 3. Décisions attendues de l'humain

> **D-4 — Validez-vous la barre de qualité d'une publication LinkedIn, telle qu'elle est entrée au registre des barres ?**
>
> La barre de qualité d'une publication LinkedIn fixe le niveau que tout texte produit devra atteindre. Le protocole des barres exige votre validation en un tour, et ne permet pas de la sauter : sans elle, la barre reste en attente. Elle s'appuie sur 4 pages officielles de LinkedIn ouvertes et datées : les critères de sélection des « Top Voices », leur promotion du 27 janvier 2026, les bonnes pratiques des pages, et les conseils d'écriture. Ses critères : une accroche en une phrase autonome, un seul sujet, 150 à 300 mots, un fait concret nommé, aucun remplissage, une clôture qui appelle une réponse, la mention de transparence, et une voix à la première personne pour un profil ou une voix de marque pour une page. Elle écarte par écrit les chiffres d'engagement que LinkedIn publie sans méthode.
>
> **Recommandation : (a).** Source consultée : `digit-ai-forge-agents\.claude\skills\la-barre\references\registre-barres.md`, entrée TF-1028 du 17/09/2026 ; rapport de l'agent : `test_existence.py` PASS, 4 références atteignables sur 4, dates et citations relevées sur le HTML brut. Les critères recoupent un à un le contrat de sortie du modèle de publication ; la longueur vient de votre étude, et la barre le dit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** valider la barre telle quelle : l'entrée passe de « todo » à « ok » | effort simple × court, fait par l'IA chez forge-agents | exclut de juger une publication sur l'heure, la fréquence ou le nombre de hashtags |
| **(b)** amender — répondre « D-4 (b) ajouter … » ou « D-4 (b) retirer … » | simple × court, plus un nouveau test d'existence si une référence s'ajoute | exclut l'usage de la barre tant que l'amendement n'est pas rejoué |
| **(c)** refuser cette barre | effort nul | exclut tout jugement d'une publication autrement qu'à l'œil ; le premier cas réel partirait sans référence |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — la barre de qualité d'une publication reste « todo », et le rendez-vous hebdomadaire jouerait cette porte à la main.

## 4. Traité — avec sa preuve

- **Votre règle est écrite : mandat permanent d'écriture dans les forges** (TF-1167, close). Noyau : « Forges : mandat d'écriture permanent (17/09) — aucune décision humaine ; le résultat remonte ». Règle R-55 (numéro de la nouvelle règle de projet) : quatre points, dont ce qu'elle n'ouvre pas — produits autonomes, dépenses, push, suppressions, secrets. Accueil aligné. Enregistrée aussi dans ma mémoire de session à session.
  - preuve : `oracle-claude-md` → « verdict=PASS », noyau 6 144 octets ; deux essais refusés avant (6 155 octets, puis un quantificateur disparu), formulation reprise ; `journaliser.mjs` → « ecrits=2 avant=PASS apres=PASS ».
- **Modèle « publication réseau » à deux écritures** (TF-1155, close), commit `677be41` : huitième modèle du skill de communication, contrat de sortie binaire à 7 critères, interdit écrit des « règles d'algorithme », rappel que publier et répondre sont vos gestes.
  - preuve, rejouée par le pilot : `self-test.mjs` du skill → « "verdict": "PASS" », exit 0 ; 8 lignes au tableau des modèles (7 avant).
- **Reprise propre du skill de publication installé** (TF-1157, close), commit `87e354f` : trois structures réécrites sans nom ni chiffre non sourcé ; mise en forme Unicode portée avec un auto-test.
  - preuve, rejouée par le pilot sous console cp1252 : « Tous les tests PASSENT », exit 0 ; l'original plantait (rapporté par l'agent : `UnicodeEncodeError`, exit 1) ; contrôle bloquant des noms propres : 0 occurrence sur 16 termes (rapporté par l'agent, non rejoué par moi).
- **Contrôle de transparence des contenus générés** (TF-1030, close), commit `fc84225` : mention lisible exigée, marquage des pages HTML avec échéance tenue en donnée (2026-12-02), contenu déclaré non généré rendu « non jugé » et jamais vert.
  - preuve : banc de `quality-oracles` PASS 269 contrôles avant, PASS 289 après (rapporté par l'agent) ; sondage du pilot : fixture rouge → FAIL exit 1 ; fixture verte avec ses formules → PASS ; fixture par défaut → PASS.
- **Barre de qualité d'une publication** (TF-1028, en cours), commit `0f73b46`.
  - preuve : `test_existence.py` → PASS, 4 références sur 4 (rapporté par l'agent) ; entrée « TF-1028 (17/09/2026) » lue par le pilot dans le registre des barres.
- **La semaine d'essai à blanc a tourné, dans les deux sens** (TF-1158, close) : nouvel oracle du pilot, 6 règles sur un dossier de semaine, dont les verdicts des 2 oracles de forge-agents repris tels quels. Correction en cours de route, contrôle rouge → vert : mon autotest prenait pour « non joué » un oracle qui n'avait rien à juger ; classe : verdict « sans objet » lu comme une absence.
  - preuve : `node oracles\oracle-run-reseau.mjs --self-test` → « 2/2 PASS (semaine à blanc verte PASS ; semaine rouge FAIL sur RR1 à RR6) » ; `oracles\self-tests.mjs` le découvre et le joue « OK ».
- **Le fichier des intégrations retrouve sa lisibilité**, contrôle rouge → vert (A-14 du tour précédent) ; classe : chapitre ouvert par un tableau nu.
  - preuve : `check_markdown.py` → « Verdict : FAIL » sur la version enregistrée, « Verdict : PASS » après deux phrases d'ouverture.
- **Registre et journal** : 8 événements écrits dans ce tour, vue régénérée, campagne consignée.
  - preuve : `journaliser.mjs` → trois lots « avant=PASS apres=PASS » ; `generer-vue.mjs` → « 387 actifs » ; section du 17/09 ajoutée à `BOUCLE-AMELIORATION.md`.

## 5. Non traité — avec son motif

- La validation de la barre — motif : dépendance à une décision humaine (D-4) ; le protocole des barres la déclare non sautable, et c'est un jugement de niveau, pas un mandat d'écriture.
- La propagation des skills modifiés vers les copies installées à votre poste — motif : le contrôle `oracle-skills` reste rouge sur le parc (sources en avance ; l'écart existait avant la campagne sur 6 skills non touchés). Votre poste n'est pas une forge : la règle R-55 ne le couvre pas, et la propagation suit la publication des forges au prochain rafraîchissement du poste.
- Chez le produit de communication : déposer son fichier de formules de transparence et remplacer ses 17 appels au script absent — motif : les produits autonomes ne sont pas couverts par R-55 ; à faire au prochain run ouvert chez lui.
- Le doublon de nom du skill de publication — motif : introuvable sur disque (dossiers de plugins et de skills cherchés par l'agent) ; il vit probablement du côté de votre compte, hors de portée.
- L'enregistrement côté pilot et le push des 2 dépôts — motif : dépendance à une décision humaine ; la règle 38 fait du push un geste sur accord, et R-55 ne l'ouvre pas.

## 6. Écarts à la lettre

- **Vous avez écrit** « 3a » → **j'ai fait** D-3 (a) : les quatre écritures chez forge-agents, puis la semaine d'essai → aucun écart.
- **Vous avez écrit** « dans toutes les forges […] tout le temps » → **j'ai écrit** la règle pour les forges, et j'en ai **exclu** les produits autonomes, les dépenses, le push, les suppressions et les secrets → **pourquoi** : votre phrase nomme les forges ; ces cinq sujets sont tenus par d'autres règles que votre message ne lève pas. Si vous voulez aussi ouvrir les produits ou le push, dites-le : c'est une ligne à changer.
- **Vous avez écrit** « seuls les résultats […] sont remontés » → **je pose quand même** D-4 → **pourquoi** : ce n'est pas un mandat d'écriture mais la validation d'un niveau de qualité, que le protocole des barres vous réserve.
- **L'agent de l'oracle devait** suivre le générateur du skill `write-an-oracle` → **il l'a exécuté** sur une copie, puis a réinjecté ses entrées à la main → **pourquoi** : le générateur reformatait 2 fichiers entiers, soit un diff sans rapport avec l'item.

## 7. Risques

- Les copies installées à votre poste restent en retard sur les forges, et ce qui s'exécute n'est pas ce qui est versionné ;
  - signal : `oracle-skills` rouge à la prochaine ouverture de session ;
  - parade : A-18 sur votre accord, puis un rafraîchissement du poste.
- La règle R-55 est lue plus large qu'écrite, et une session écrit chez un produit sans run demandé ;
  - signal : un commit du pilot dans un dépôt de produit hors run ;
  - parade : la règle nomme ce qu'elle n'ouvre pas, et le relevé d'ouverture de session déclare déjà « aucun mandat » chez les produits suivis.
- Une autre session du pilot enregistre mes fichiers indexés avec les siens ;
  - signal : un enregistrement d'une autre session contenant `RUN-RESEAU.md` ;
  - parade : acceptation déclarée ; l'autre session a enregistré par chemins nommés ce matin sans emporter les miens.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, celle qui attend D-4 avant celle qui attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-19 | Passer la barre « publication réseau » de « todo » à « ok » dans `digit-ai-forge-agents\.claude\skills\la-barre\references\registre-barres.md`, commit local, puis avancement de TF-1028 au registre | auto_ia | `dependance_bloc_3` — attend D-4 ; à défaut, la porte de qualité du rendez-vous hebdomadaire se joue à la main | simple × court |
| A-18 | Enregistrer côté pilot, par `git commit --only -- <chemins>`, la doctrine, les références, l'oracle, l'étude, les lots de candidatures et les synthèses de cette session ; puis pousser le pilot et forge-agents (18 commits en avance), porte des noms rejouée avant envoi (neuve, remplace A-13) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-21 ; à défaut, rien n'est enregistré côté pilot et les copies installées restent en retard | simple × court |
| A-20 | Trancher D-4 — répondre « D-4 (a) », « D-4 (b) ajouter … » ou « D-4 (c) » (neuve) | manuelle_utilisateur | `decision` — le protocole des barres réserve cette validation à l'humain ; sinon : la barre reste « todo » | simple × court |
| A-21 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve, remplace A-17) | manuelle_utilisateur | `decision` — règle 38 : le push est un geste sur accord ; sinon : rien n'est publié | simple × court |
| A-22 | Après publication et rafraîchissement du poste, retirer vous-même le skill synchronisé `linkedin-post-generator` depuis les réglages de skills de claude.ai, et y vérifier s'il existe en double (neuve) | manuelle_utilisateur | `irreversible` — une suppression de skill à votre poste ou sur votre compte reste votre geste ; sinon : un skill à noms réels et règles de 2025 continue de servir | simple × court |
| A-10 | D'ici là, ajouter vous-même la mention « rédigé avec l'aide d'une IA » à toute publication issue de ce skill, dans l'éditeur de LinkedIn avant « Publier » (neuve le 17/09, reprise inchangée) | manuelle_utilisateur | `decision` — règle 38 : publier est un geste humain ; sinon : obligation d'information en vigueur depuis le 2026-08-02 non tenue | simple × court |

## 9. Traces

- Forge-agents, commits locaux : `677be41` (TF-1155), `87e354f` (TF-1157), `0f73b46` (TF-1028), `fc84225` (TF-1030).
- Pilot, écrits ou modifiés : `CLAUDE.md`, `REGLES-PROJET.md` (R-55), `BOUCLE-AMELIORATION.md`, `references\ACCUEIL.md`, `references\RUN-RESEAU.md`, `references\INTEGRATIONS-FOURNISSEURS.md`, `oracles\oracle-run-reseau.mjs`, `todo\TODO.jsonl`, `input\01-candidatures\mandat-permanent-ecriture-forges-20260917c.tf.jsonl`.
- Mémoire de session : `mandat-permanent-ecriture-forges.md`.
- Aucune page HTML livrée dans ce tour.
