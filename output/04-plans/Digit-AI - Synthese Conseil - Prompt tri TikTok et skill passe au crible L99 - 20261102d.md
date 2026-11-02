---
destinataire: humain
---

# Synthèse Conseil — prompt de tri des favoris TikTok et de skill passé au crible L99 (02/11/2026)

## 0. Synthèse d'ouverture

Votre prompt est réécrit, et prêt à lancer dès que vous aurez répondu à 2 questions : le run peut-il télécharger les vidéos, et le tableau doit-il expliquer ses verdicts. Il valait 30 sur 100 ; 2 relecteurs à l'aveugle notent la version intermédiaire 74 et 80, et les dernières corrections n'ont pas été renotées. Le fait qui change le plus la suite : les vidéos à reprendre sont 54 et non 29, car le tri du 19 octobre avait laissé de côté 8 carrousels et 17 contenus sans légende utile. Le skill passera d'abord par une étude, parce qu'une règle de la Factory l'exige et qu'un refus a déjà visé un skill voisin en août. Il vous reste à répondre à ces 2 questions, puis à lancer le prompt.

Livré : [Prompt réécrit](output/04-plans/Digit-AI%20-%20Prompt%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20et%20skill%20-%2020261102c.md) · [Analyse complète](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20tri%20des%20sujets%20TikTok%20et%20skill%20passe%20au%20crible%20L99%20-%2020261102a.md)

## 1. En-tête d'identification

Analyse L99 (grille d'analyse de prompt en 8 couches, skill `prompt-analyzer-l99`), en mode boucle, de la demande sur les vidéos Claude et IA et le skill d'étude de listes de sujets, sur le pilot `digit-ai-factory`. Période : 02/11/2026 de 08:45 à 09:03, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5 ; 8 agents `verificateur` : 4 relecteurs aveugles, 2 vérificateurs de correction, 2 relecteurs d'intention.

Intention de la demande : savoir quels sujets Claude et IA de vos favoris méritent une étude d'opportunité, et rendre ce tri réutilisable sur toute liste de sujets.

Test rétro : le prompt réécrit sert cette intention ; il livre le tableau, puis le skill ou, si l'étude le refuse, un référentiel. Les écarts à votre lettre sont au bloc 6.

## 2. Verdict en une ligne

Score 30 sur 100 avant, 74 mesuré à la passe 2 (le plus bas des 2 relecteurs) ; 2 bloquants du prompt d'origine fermés ; `oracle-boucle-l99` rend PASS, arrêt pour gain de 0 point.

## 3. Décisions attendues

> **D-120 — Le run peut-il télécharger les vidéos TikTok de vos favoris pour les regarder, alors que les conditions de TikTok interdisent l'extraction automatisée ?**
>
> - **De quoi s'agit-il** : regarder réellement les vidéos, par `yt-dlp` ou le skill `anthropic-skills:regarde-une-video`, tous 2 présents sur ce poste, plutôt que lire leur légende, leur couverture et leurs sources.
> - **Le problème** : les conditions citées dans `references\PLATEFORMES-RESEAUX.md` l'interdisent sans accord écrit. Sans téléchargement, 3 légendes neuves ne disent presque rien, et les 17 contenus à reprendre risquent de rester non qualifiés ; aucune de ces lectures ne regarde la vidéo elle-même.
> - **Pourquoi vous** : c'est un écart assumé ou non aux conditions d'une plateforme, sur votre compte, et la session ne peut pas le prendre pour vous.
> - **Recommandation : (a)** — le 19/10, ce sont les sources primaires qui ont démenti les vidéos, pas leur visionnage, et vous pouvez déposer le fichier d'une vidéo qui compte. Source consultée : `output\04-plans\Digit-AI - Synthese Mandat - Etudes des favoris TikTok - 20261019d.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ne rien télécharger | Lecture par légende, couverture, source primaire et fichiers que vous déposez ; un contenu illisible reste « non qualifié » et compté | Simple × court | Possible : relancer avec une autre lettre |
| (b) Télécharger les seuls contenus restés illisibles | Lecture réelle de ces contenus, écart aux conditions limité à eux | Simple × court, plus la transcription locale | Partiel : la suite s'arrête, l'extraction faite reste faite |
| (c) Télécharger tout le périmètre | Lecture réelle des 54 contenus, écart aux conditions complet | Moyen × moyen | Partiel : la suite s'arrête, l'extraction faite reste faite |

> **Sans réponse** : (a), le run ne télécharge rien.

> **D-121 — Le tableau doit-il porter une colonne qui donne le motif de chaque verdict, que vous n'avez pas demandée ?**
>
> - **De quoi s'agit-il** : une colonne de plus, pour comprendre un verdict sans quitter le tableau. Le motif existe de toute façon dans `input\Tiktok\rangement-AAAAMMJJ.json`, hors du dépôt public.
> - **Le problème** : la relecture d'intention relève cette dérive : votre demande dit « un tableau avec les éléments abordés et la pertinence », et le prompt y ajoutait un motif. Correction proposée : le retirer sauf si vous le choisissez. Sans colonne, un verdict se lit seul ; avec elle, le tableau s'allonge d'une à 2 phrases par ligne.
> - **Pourquoi vous** : c'est du contenu visible que vous n'avez pas demandé, et la règle veut que vous le choisissiez à part du prompt.
> - **Recommandation : (a)** — vous décidez plus vite d'une étude en voyant sa raison sur la même ligne, comme dans le tri du 19/10. Source consultée : `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Contenu visible ajouté : colonne Motif en 1 ou 2 phrases, pourquoi ce verdict et qui en profite | Le tableau a 4 colonnes | Effet : tableau plus long | Possible : retirer la colonne |
| (b) Contenu visible ajouté : colonne Motif réduite au chemin de l'existant, ou à « aucun existant trouvé » | Le tableau a 4 colonnes, sans la raison du verdict | Effet : tableau court, raison hors du tableau | Possible : la compléter depuis le rangement |
| (c) Contenu visible ajouté : aucune colonne Motif | Le tableau a 3 colonnes, les motifs restent au fichier de rangement | Nul | Possible : ajouter la colonne depuis le rangement |

> **Sans réponse** : (c), pas de colonne Motif.

## 4. Traité

L'analyse a mesuré l'entrant avant de réécrire, puis a soumis le prompt à 2 passes de relecture aveugle.

- **Périmètre mesuré** par script à 08:46 : 146 contenus dans l'union des 2 pages, 109 à l'annexe du tri, 37 jamais rangés (29 vidéos neuves, 8 carrousels), 17 rangés sans qualification, soit 54. Le contrôle retrouve les 109 identifiants de l'annexe.
- **Accès.** Les légendes se lisent en local, `faster_whisper` et `imageio_ffmpeg` répondent, `yt-dlp` 2026.10.21 est présent et n'a pas été lancé. Le motif du 19/10, « le poste n'a ni yt-dlp ni ffmpeg », ne vaut plus sur ce poste ; l'interdiction des conditions demeure.
- **Défauts du prompt d'origine** : 2 bloquants, 11 majeurs, 2 mineurs, tous fermés dans la version remise, chacun rattaché à son ajout au changelog de l'analyse. Les 2 bloquants :
  - « Etudie les vidéos » ne dit pas par quelle voie ;
  - le skill est commandé sans le test d'admission des objets durables, alors que l'étude du 13/08 a refusé un skill voisin. Sa clause de réveil, 5 emplois du gabarit, est atteinte : 107 études portent ce nom au dépôt.
- **Passes mesurées** : passe 1 notée 82 et 74, 8 majeurs retenus, 1 écarté au recompte ; passe 2 notée 80 et 74, 6 retenus, 1 écarté. La relecture à charge prend le plus bas ; le gain vaut 0, et la règle arrête la boucle.
- **Après l'arrêt.** Les 6 majeurs retenus sont refermés dans la version remise. Le vérificateur, qui ne note pas, a confirmé 6 clôtures sur 7 et signalé 6 défauts créés, dont un `git commit --only` qui échoue sur un fichier neuf, rejoué dans un dépôt jetable. Ils sont refermés à leur tour, sans nouvelle vérification.
- **Points d'intention traités.** Notes et seuil sont retirés du tableau et passent au fichier de rangement, sur la relecture RI-20261102-02. La colonne Motif, relevée par RI-20261102-04, sort du prompt par défaut et devient la seconde décision.
- **Contrôles joués** : `oracle-ecriture` exit 0 sur le prompt et sur l'analyse, `check_markdown.py` PASS sur l'analyse, `oracle-boucle-l99` PASS sur le journal.
- **Publication du pilot** sous le GO permanent `D-54 (b) du 03/10` : ces fichiers partent par ce geste, envoi vérifié par `git rev-list`.

Relecture d'intention : dérive au sens du relecteur, qui ne connaît pas les règles de la Factory. Ses 2 passes signalent le skill conditionnel, le périmètre élargi et le téléchargement subordonné, tous posés à vous au bloc 3 ou au bloc 6 ; aucun écart n'est masqué.

## 5. Non traité

- **Exécution du prompt** — motif : hors_perimetre, vous avez demandé de l'améliorer, et son lancement attend vos 2 réponses.
- **Score de la version remise** — motif : hors_perimetre, la règle de boucle s'est arrêtée à la passe 2 ; les 74 et 80 portent sur la version d'avant les corrections finales.
- **Lecture des 54 contenus** — motif : hors_perimetre, le tableau revient au run ; l'analyse n'a lu en détail que les légendes qui fondent ses exemples.

## 6. Écarts à la lettre

Tous relèvent de la manière d'exécuter, et la relecture d'intention en relève 4 pour vous : les 3 premières lignes et la dernière. Pour en retirer un, dites-le en lançant le prompt.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « travaille sur un skill » | Une étude d'abord, puis le skill, ou un référentiel si aucun outil nouveau n'est justifié | La règle d'admission des objets durables l'exige ; je n'ai pas le droit de l'assouplir |
| « non encore analysées » | 54 contenus, dont 17 déjà rangés mais jamais qualifiés | Lecture au plus large ; pour 37 seulement, dites-le |
| « Etudie les vidéos » | Lecture par 4 voies permises, téléchargement selon votre réponse | Conditions de TikTok, posé en décision ci-dessus |
| « pertinence […] pour chacun » | Un verdict d'un jeu fermé, motif et notes au fichier de rangement | Le verdict reste comparable d'une ligne à l'autre ; la colonne Motif est posée à part |
| le tableau seul | En tête, la voie de lecture et le nombre de contenus écartés | Votre loi de qualité veut que toute valeur non vérifiable soit marquée |
| le skill | Back-test sur les 14 études, publication de la forge sous son mandat permanent | Un skill naît exercé et intégré le jour même, selon la même règle |

## 7. Risques

- **Grille non prédictive.** Le score 21 du 19/10 a fini écarté, et le score 16 a donné une suite corrigée. Signal : le taux d'accord du back-test, sous 9 sur 14. Parade : le réglage est proposé, jamais appliqué seul.
- **Prompt long.** Il passe de 1 579 à plus de 2 000 mots. Signal : une étape sautée dans la restitution du run. Parade : le contrat de sortie vérifiable et le tableau enregistré avant le skill.

## 8. Prochaines actions

Une seule action, la vôtre : elle vient en tête parce que tout le reste en dépend et se déroule dans le run.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre aux 2 questions et lancer le run qui produit le tableau puis le skill | neuve | manuelle_utilisateur | decision : les réponses à D-120 et D-121 vous reviennent | relire `output/04-plans/Digit-AI - Prompt - Tri des sujets Claude et IA des favoris TikTok et skill - 20261102c.md`, puis écrire « exécute le prompt, 120a, 121a » avec vos lettres | si rien n'est fait : ni tableau ni skill, et les 54 contenus restent non triés |

## 9. Traces

- Prompt réécrit : `output/04-plans/Digit-AI - Prompt - Tri des sujets Claude et IA des favoris TikTok et skill - 20261102c.md`.
- Analyse : `output/03-etudes/Digit-AI - Revue - Prompt tri des sujets TikTok et skill passe au crible L99 - 20261102a.md`.
- Journal de boucle : même nom, suffixe `.boucle.json`.
- Décisions réservées : `decisions/REGISTRE.jsonl`, entrées `"n":120` et `"n":121`.
- Relectures d'intention : RI-20261102-02, puis RI-20261102-04, dans `todo/relectures-intention.jsonl`.
- Indice du prompt porté de b à c : une autre session a pris 20261102b dans `output/04-plans/` à 09:00.
