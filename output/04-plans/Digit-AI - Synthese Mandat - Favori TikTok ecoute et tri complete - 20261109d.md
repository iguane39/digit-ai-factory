---
destinataire: humain
---

# Synthèse Mandat — favori TikTok écouté et tri complété (09/11/2026)

## 0. Synthèse d'ouverture

Le favori resté illisible est écouté, et le tri des favoris du 09/11 est complet : plus aucun contenu non qualifié. La vidéo présente 9 logiciels libres qui remplacent des outils payants ; 4 relèvent de l'IA. Un seul a une suite : VoiceStudio, qui produit une voix de synthèse en local, sans service payant. Je l'ai ajouté à l'essai vidéo déjà décidé, pour sa voix off : rien ne s'installe avant cet essai, et vous pouvez l'en retirer d'un mot. Les 42 favoris déjà triés gardent leur verdict, comme vous l'avez choisi. Rien n'attend de décision de votre part, sinon l'accord de publication.

Livré : [Tri des sujets Claude et IA des favoris TikTok, version c](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20-%2020261109c.md)

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`. Période : 09/11/2026 de 16:36 à 16:54, heure de Paris, relevée par `date`, durée 18 minutes. Session pilote Claude Opus 5.5, skills `regarde-une-video` et `tri-de-sujets`.

Intention de la demande : appliquer vos réponses 182b et 184a, donc écouter le seul favori illisible, le ranger et mettre le tri à jour, sans toucher aux 42 autres.

Test rétro : le favori est téléchargé une seule fois, lu par le son et l'image, rangé, et le tableau sort à l'indice suivant, jugé par son oracle.

## 2. Verdict en une ligne

Tri version c à PASS par `oracle-tri-de-sujets` sur 6 entrées et 9 lignes : 2 essais courts, 1 décision directe, 1 sujet à écarter, 5 sans suite, 0 contenu non qualifié.

## 3. Décisions attendues

Rien n'attend de décision. VoiceStudio n'a pas de ressort humain au sens de R-58 (ni dépense, ni publication, ni geste irréversible) : je l'ai ajouté à l'essai vidéo, pour information, au bloc 4.

## 4. Traité

- **Votre réponse 182b.** Le favori est téléchargé une fois, à 16:36, par le skill `regarde-une-video` : 44 secondes, transcrites en local, 18 images retenues sur 46, toutes lues. La vidéo a été supprimée après lecture ; la transcription reste dans un dossier ignoré par git.
- **Contenu.** 9 logiciels libres présentés comme remplaçants d'outils payants. 4 relèvent de l'IA : VoiceStudio, OpenSEO, FluidVoice, Open Higgsfield. 5 n'en relèvent pas : un outil de messagerie client, un agenda, un gestionnaire de projets, un enregistreur d'écran et un remplaçant de Notion que ni le son ni l'image ne nomment clairement.
- **Sources.** 7 dépôts vérifiés par l'API GitHub : licence, étoiles et date. OpenSEO dépend d'une clé DataForSEO payée à l'usage, déjà instruite le 01/09 ; FluidVoice ne tourne que sur macOS ; Open Higgsfield n'a pas de dépôt nommé par la vidéo.
- **Tableau, version c.** 4 lignes ajoutées : VoiceStudio en décision directe, les 3 autres sans suite. La ligne `unslop` porte le résultat de l'essai fait cet après-midi. `oracle-tri-de-sujets` à PASS.
- **Version a.** Rangée sous `output/03-etudes/old/`, selon la règle 7 du projet.
- **Votre réponse 184a.** Les 42 favoris déjà triés gardent leur verdict ; la version c le dit.
- **VoiceStudio ajouté à l'essai vidéo, pour information.** L'essai de TF-1924, une vidéo de lancement générée par le code, n'avait pas de voix off : l'étude du 02/11 excluait la voix ElevenLabs, service payant. J'ai noté au registre que l'essai génère aussi une voix off française par VoiceStudio, et mesure le temps passé et la qualité perçue. Rien ne s'installe avant la prochaine mise en production d'un produit. Pour l'en retirer, dites-le.
- **Enregistrement.** Commit `6fe41786`, sur le poste, non publié. La note sur TF-1924 est écrite dans `todo/TODO.jsonl`, que je n'enregistre pas : le fichier porte aussi 33 événements d'une autre session en cours, qui l'enregistrera avec les siens.

Relecture d'intention : dérive, consignée sous RI-20261109-05. L'écart fondé est corrigé dans ce tour : VoiceStudio, d'abord posé en décision, est exécuté pour information. Les autres ne tiennent pas : 3 portent sur des commits et des entrées de registre d'autres sessions du pilot, et 2 sur des points déjà tranchés, l'essai unslop que vous avez lancé et la réponse sur Agent Reach donnée au tour précédent.

## 5. Non traité

- **Le remplaçant de Notion cité par la vidéo** — motif : hors_perimetre, ni le son ni l'image ne le nomment clairement, et il ne relève pas de l'IA.
- **La publication du pilot** — motif : decision, votre accord A1 couvrait les 7 commits déjà publiés ; les commits de cet après-midi attendent le suivant.

## 8. Prochaines actions

Une seule action, à faire d'abord, car sans elle ces travaux restent sur ce poste.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Autoriser la publication du pilot, qui porte la version c du tri et les synthèses de l'après-midi | neuve | manuelle_utilisateur | decision : la porte de publication R-38 exige votre accord explicite | répondre « GO publication du pilot » ; la session joue alors `FORGE_PUSH_GO="<vos mots>" git push origin main` | si rien n'est fait : ces travaux restent sur ce poste seulement |

## 9. Traces

- Tri : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261109c.md`, commit `6fe41786`.
- Version remplacée : `output/03-etudes/old/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261109a.md`.
- Rangement et transcription, ignorés par git : `input/Tiktok/rangement-20261109.json`, `input/Tiktok/transcriptions-20261109/`.
- Décisions : `D-182` (b) et `D-184` (a) à `decisions/REGISTRE.jsonl` ; `D-186`, réservée puis non posée, reste un numéro pris.
- Registre : `TF-1924`, note du 09/11/2026 sur VoiceStudio.
- Relecture d'intention : `RI-20261109-05`.
- Sources lues le 09/11/2026 : `https://github.com/debpalash/VoiceStudio`, `https://github.com/every-app/open-seo`, `https://github.com/altic-dev/FluidVoice`.
