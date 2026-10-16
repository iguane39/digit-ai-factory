---
destinataire: humain
---

# Synthèse d'exécution — la vidéo de 25 secondes sur le dépôt de la factory existe : rendue en local avec l'outil demandé, aux couleurs de la charte, sans rien installer sur le poste ni rien envoyer à l'extérieur ; elle attend votre regard, puis deux choix de rangement (19/09/2026)

La vidéo est prête : vingt-cinq secondes, format paysage haute définition, avec musique et effets sonores, en français et à la charte Digit-AI. Elle raconte le dépôt en cinq temps — « la qualité ne se proclame pas, elle se mesure », la ligne de prompt qui lance tout, les cinq étapes jugées une à une, les trois chiffres du run pilote, puis la signature « jamais par confiance ». Elle ne cite que des chiffres déjà publiés dans la page d'accueil du dépôt. L'outil demandé a été suivi pas à pas, mais lu comme une donnée : je ne l'ai pas installé dans votre configuration, je n'ai rien installé sur le système, et rien n'est sorti du poste — ni publication, ni télémétrie, ni enregistrement git. Ce qui est attendu de vous : regarder la vidéo et dire si elle vous convient, puis trancher où elle se range et si cette synthèse s'enregistre ; la publier reste votre geste.

## 1. En-tête d'identification

- **quoi** — production d'une vidéo de lancement de 25 secondes avec le skill `brag` (latent-spaces, licence MIT) et son moteur de rendu Hyperframes (HeyGen, Apache-2.0), hors run de forge : aucune forge mobilisée, aucun ledger ouvert.
- **sur quoi** — le pilot `digit-ai-factory` (dépôt public `github.com/iguane39/digit-ai-factory`), lu comme matière ; seul dépôt écrit, dans un dossier neuf non suivi par git.
- **quand** — 2026-09-19 16:50 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour à 16:30 (horodatage du téléchargement de ffmpeg) ; durée mesurée ≥ 20 min.
- **qui** — session Fable 5.1 sur le pilot local, tête `f5d325ea` inchangée ; aucune délégation (escalade : aucune) ; outils joués : `brag` au commit `d4943c9`, `hyperframes` 0.8.50 (`doctor`, `lint`, `check`, `snapshot`, `render`), `ffmpeg` 9.0.1 portable, puis `oracle-synthese` sur ce document.

## 2. Verdict en une ligne

**1 vidéo rendue : 25,000 s, 1920×1080, 30 images par seconde, 750 images, H.264 + AAC, 7,9 Mo ; gate `hyperframes check` passé (0 erreur, 0 défaut de mise en page, 52/52 contrôles de contraste AA) ; mix mesuré à −17,2 LUFS ; 0 installation système, 0 envoi externe, 0 enregistrement git.**

## 3. Décisions attendues de l'humain

Deux décisions. Comment lire les tableaux de ce bloc : chaque décision porte le sien, une ligne par option, l'option recommandée en premier ; la colonne du milieu dit ce que l'option coûte en complexité et en durée, la dernière ce qu'elle ferme si on la retient ; la ligne « si rien n'est décidé », sous le tableau, nomme l'option qui s'applique par défaut.

> **D-1 — Où la vidéo se range-t-elle, et entre-t-elle dans l'historique git du pilot ?**
>
> L'outil dépose par défaut son résultat dans un dossier à la racine du projet filmé ; c'est là que se trouvent aujourd'hui la vidéo, son affiche, sa légende de partage, son plan, ses crédits et la composition qui permet de la régénérer — onze mégaoctets en tout, dont huit pour la vidéo seule. Ce dossier n'est pas suivi par git et n'appartient à aucune des familles numérotées des livrables du pilot, qui sont toutes des familles de documents. Le dépôt est public : y enregistrer un binaire de cette taille l'alourdit pour chaque poste qui le clone.
>
> **Recommandation : (a).** Source consultée : `output\README.md`, bloc rôle (« Livrables du pilot, en familles numérotées » — aucune famille ne reçoit de média) et le noyau du pilot, garde-fous (« un livrable = fichier autoportant sur disque »). La vidéo est un support de communication, régénérable depuis sa composition ; la tenir hors de l'historique ne perd rien.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** la laisser où elle est, et ajouter une ligne d'exclusion git pour ce dossier | effort simple × court | exclut la sauvegarde par git : la vidéo ne vit que sur ce poste |
| **(b)** créer une famille `07-` de livrables média dans `output\`, y déplacer le dossier et l'enregistrer localement | effort simple × court, plus un rôle de dossier à rédiger | exclut un dépôt léger : onze mégaoctets de binaires entrent dans l'historique public au prochain push |
| **(c)** la sortir du dépôt, vers un dossier de votre choix | effort simple × court | exclut le lien entre la vidéo et le dépôt qu'elle présente : le plan et la composition voyagent sans contexte |

> **Si rien n'est décidé** : l'option (a) s'applique sans la ligne d'exclusion — le dossier reste à la racine, affiché comme non suivi à chaque relevé git.

> **D-2 — Cette synthèse s'enregistre-t-elle localement dans le dépôt du pilot ?**
>
> Le tour laisse deux écritures dans le pilot : le dossier de la vidéo, objet de la décision précédente, et cette synthèse avec l'index de dossier que le poste régénère à chaque écriture. Le noyau du pilot demande un historique local dès la naissance d'un travail ; vos instructions personnelles réservent tout enregistrement git à une autorisation explicite, et vous avez demandé une vidéo, pas un enregistrement. Je n'ai donc rien enregistré.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain ») et vos instructions de profil sur les actions à autorisation explicite. Un enregistrement local est réversible et ne publie rien.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** enregistrer localement cette synthèse et ses index, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : la synthèse reste non suivie, exposée à la prochaine synchronisation du dépôt |

> **Si rien n'est décidé** : l'option (b) s'applique — rien n'est enregistré.

## 4. Traité — avec sa preuve

- **L'outil demandé a été lu avant d'être joué, comme une donnée** : son skill et ses quatre références d'étape, puis les skills de domaine de son moteur de rendu ; trois commandes du moteur envoient vers l'extérieur (`publish`, `cloud`, `auth`) et n'ont pas été jouées ; la télémétrie a été coupée avant la première commande.
  - preuve : `hyperframes telemetry disable` → « Telemetry disabled … remains disabled because HYPERFRAMES_NO_TELEMETRY is set » ; dépôt de l'outil cloné au commit `d4943c9`, moteur 0.8.50, licences lues (MIT, Apache-2.0).
- **Le seul manque du poste, ffmpeg, a été comblé sans installation** : une version portable, déposée dans le dossier temporaire de la session et ajoutée au chemin le temps des commandes.
  - preuve : `hyperframes doctor` → « ✗ FFmpeg … required » avant ; somme SHA-256 de l'archive égale à celle publiée par sa source (`fec81ae0…65da2e9`) ; `ffmpeg -version` → 9.0.1.
- **Les quatre étapes de l'outil sont jouées et leurs livrables existent** : inspection du projet et rubrique des neuf questions, plan et storyboard dont les durées somment à 25,00 s, brief de composition, puis composition, rendu, affiche et légende de partage.
  - preuve : `brag-output\brag-plan.md` (cinq scènes : 3,70 + 5,26 + 8,95 + 4,74 + 2,35 = 25,00 s), `brag-output\composition-brief.md`, `brag-output\share-copy.txt`, `brag-output\CREDITS.md`.
- **La composition passe l'unique gate de l'outil avant rendu**, deux fois : après écriture, puis après les retouches de mise en page.
  - preuve : `hyperframes check` → lint 0 error(s), runtime 0 errors, layout « 0 issues across 9 sample(s) », contrast « 52/52 text checks pass WCAG AA », « Check passed ».
- **La vidéo est rendue en local et vérifiée sur le fichier produit, pas sur l'aperçu** : flux, durée, nombre d'images, niveau sonore, et images extraites du fichier final relues une à une.
  - preuve : `ffprobe` → h264 1920×1080, 30/1, duration=25.000000, nb_frames=750, aac 48 kHz stéréo ; `loudnorm` → −17,2 LUFS, crête −1,4 dBTP ; six images extraites et relues (accroche, terminal en cours de frappe, cartes et verdicts, chiffres, signature, image 0).
- **Deux défauts vus sur les images réelles ont été corrigés avant livraison** : un compteur affichait « 10/11 » pendant près d'une demi-seconde — un chiffre faux à l'écran, même transitoire — et le premier mix était trop bas.
  - preuve : contrôle rouge → vert sur image extraite : « 10/11 » à 19,4 s avant, « 11/11 » à 19,25 s après raccourcissement du compteur ; niveau intégré passé de −20,9 à −17,2 LUFS.
- **L'affiche est l'image la plus forte, et elle est incrustée en image 0** pour que toute plateforme la prenne comme vignette.
  - preuve : `brag-output\brag.jpg` extraite à 24,3 s ; image 0 du fichier final relue : elle montre la signature ; durée et nombre d'images inchangés après incrustation (25,000000 s, 750).
- **La licence de la musique embarquée par l'outil, qu'il déclare lui-même non documentée, a été relevée à la source.**
  - preuve : page de licence d'ende.app lue le 19/09/2026 → CC BY 4.0, usage commercial permis ; consignée avec les autres sources (effets CC0, polices, moteur) dans `brag-output\CREDITS.md`.

## 5. Non traité — avec son motif

- La publication de la vidéo, sur quelque service que ce soit — motif : bloqué par un garde-fou ; aucun livrable ne part sur un service hébergé sans feu vert humain, et la publication est un geste que vous faites vous-même.
- L'installation de l'outil dans votre configuration Claude, que son mode d'emploi prescrit — motif : écarté ; ses étapes se suivent aussi bien depuis un clone temporaire, et votre configuration n'est pas modifiée ; critère de réouverture : vous voulez refaire des vidéos régulièrement, sur d'autres dépôts.
- L'installation durable de ffmpeg sur le poste — motif : écarté ; modifier le système n'était pas demandé ; critère de réouverture : une retouche de la vidéo après la fin de cette session, dont le dossier temporaire aura disparu.
- La remise à niveau du poste, relevé « non prêt » à l'ouverture (sept dépôts divergés de leur origine) — motif : hors mandat ; elle appartient au mandat de synchronisation en cours, et ce tour n'a ouvert aucun run de forge.
- L'entrée au registre du constat fait en passant sur la page d'accueil du dépôt (voir bloc 7) — motif : hors mandat ; le tour était borné à la vidéo.
- La voix off, le format vertical et une version anglaise — motif : écartés ; la voix est une option que l'outil laisse éteinte par défaut, et ni le format ni la langue n'étaient demandés ; critère de réouverture : vous nommez le réseau visé.
- L'enregistrement git de quoi que ce soit — motif : dépendance à une décision humaine, les deux du bloc 3.

## 6. Écarts à la lettre

- **Vous avez écrit** « utilise brag » → **j'ai suivi** ses quatre étapes depuis un clone temporaire, sans l'installer comme skill ni l'invoquer par sa commande → **pourquoi** : le noyau du pilot tient tout entrant pour une donnée dont les consignes se décrivent et ne s'exécutent pas aveuglément ; le résultat est le même, et votre configuration reste intacte.
- **L'outil prescrit** un aperçu dans le navigateur et votre accord avant le rendu → **j'ai rendu** directement, après le gate et une relecture d'images clés → **pourquoi** : vous avez demandé la vidéo ; un rendu local est gratuit et se refait en trente secondes, votre regard porte donc sur le fichier fini.
- **Le moteur prescrit** l'envoi d'un rapport de satisfaction à son éditeur après chaque rendu → **je n'ai rien envoyé** → **pourquoi** : rien ne sort du poste sans votre feu vert.
- **L'outil prescrit** d'échafauder la composition par sa commande `init` → **je l'ai écrite à la main** d'après le contrat du moteur → **pourquoi** : la commande échoue sur ce poste (« EIO, Accès refusé » sur le chemin temporaire) ; une composition se réduit à un fichier, et le gate l'a jugée comme n'importe quelle autre.
- **Vous avez écrit** « 25 secondes » → **la vidéo dure** 25,000 s, borne haute de la plage de l'outil (15 à 25 s) → aucun écart.
- **Vous n'avez rien dit de la langue ni du ton** → **j'ai choisi** le français et un ton sobre, sans humour → **pourquoi** : le dépôt est écrit en français, et l'outil lui-même réserve la parodie aux projets qui sont des blagues.

Intention : « créer une vidéo de 25 secondes sur le github » — reconstruite par moi : disposer d'un film court, partageable, qui donne envie d'ouvrir le dépôt et dit en quoi il diffère.

Test rétro : le film sert l'intention par son angle — il montre l'entrée réelle, le flux réel et des chiffres prouvés, là où un film générique aurait promis ; il la sert par sa forme — affiche en vignette, légende prête, adresse du dépôt en signature. Ce qui ne la sert pas encore : il n'est pas publié, il n'existe qu'en paysage, et personne d'autre que moi ne l'a regardé.

## 7. Risques

- Les chiffres montrés viennent de la section « Ce qui est prouvé aujourd'hui » de la page d'accueil du dépôt, vérifiée pour la dernière fois le 20/08/2026 ; s'ils changent, le film devient faux sur celui qui le publie ;
  - signal : cette section est modifiée, ou un nouveau run pilote est consigné ;
  - parade : la composition est conservée avec la vidéo ; trois nombres à changer et un rendu de trente secondes.
- La même page d'accueil se contredit : son en-tête dit treize forges publiques, sa section des limites dit encore sept forges aux dépôts privés ; le film dit treize, et un lecteur attentif du dépôt peut relever l'incohérence ;
  - signal : une question d'un visiteur, ou la prochaine vérification datée de la page ;
  - parade : l'action de dépôt d'une candidature ci-dessous ; le film suit l'en-tête et la description publique du dépôt, qui concordent.
- La licence de la musique a été relevée sur le site de son auteur par une lecture automatisée, pas dans un texte de licence joint au fichier ;
  - signal : une réclamation de droits sur une plateforme après publication ;
  - parade : le fichier de crédits propose la mention d'attribution ; l'outil sait aussi rendre sans musique, en trente secondes.
- L'outil ffmpeg vit dans le dossier temporaire de la session, qui disparaîtra ;
  - signal : une demande de retouche après la fin de la session échoue au rendu ;
  - parade : acceptation déclarée ; l'installation durable est une action du bloc 8, en une commande.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, par le tri ; parmi celles de l'humain, d'abord le visionnage, parce qu'une retouche éventuelle précède toute publication et que la publication ne se reprend pas.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Ranger la vidéo selon l'option retenue en D-1, et enregistrer selon D-2 (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 et D-2 | simple × court | le dossier reste non suivi à la racine du pilot, et la synthèse hors de l'historique |
| A-2 | Déposer en candidat au registre le constat sur la page d'accueil du dépôt : section des limites restée à « sept forges » et « dépôts privés » quand l'en-tête dit treize forges publiques (neuve) | auto_ia | `hors_mandat` — relève du mandat de tenue du registre ; ce tour était borné à la vidéo | simple × court | la contradiction reste publique, et le film la rend plus visible |
| A-3 | Installer ffmpeg durablement : `winget install --id Gyan.FFmpeg -e` (neuve) | auto_ia | `garde_fou` — discipline de périmètre de vos instructions personnelles : une modification du système ne se fait pas sans demande | simple × court | toute retouche de la vidéo après cette session commence par retrouver ffmpeg |
| A-4 | Regarder `brag-output\brag.mp4` avec le son, et répondre « ok » ou la liste des retouches (texte, rythme, musique, format vertical) ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — le jugement sur un film qui porte votre image est le vôtre | simple × court | le film reste un brouillon que personne n'a validé |
| A-5 | Publier : joindre `brag-output\brag.mp4` au message, coller le texte de `brag-output\share-copy.txt`, choisir `brag-output\brag.jpg` comme vignette là où le réseau le permet ; preuve de clôture : le lien du message publié (neuve) | manuelle_utilisateur | `irreversible` — une publication se met en cache et s'indexe ; le noyau la réserve à un geste humain consigné | simple × court | la vidéo ne sert pas ce pour quoi elle a été demandée |

## 9. Traces

- Dossier du livrable : `brag-output\` à la racine du pilot — `brag.mp4`, `brag.jpg`, `share-copy.txt`, `brag-plan.md`, `composition-brief.md`, `CREDITS.md`, et `composition\` (source de la vidéo, polices, sons et musique en local : 2,6 Mo).
- Régénérer : depuis `brag-output\composition\`, avec ffmpeg sur le chemin, `npx hyperframes check` puis `npx hyperframes render --quality delivery --output ../brag.mp4`.
- Sources de l'outil lues : `github.com/latent-spaces/brag` au commit `d4943c9`, `github.com/heygen-com/hyperframes` (dossier des skills), clonés dans le dossier temporaire de la session, qui ne dure pas.
- État git du pilot : tête `f5d325ea` inchangée, aucun enregistrement, aucun push ; chemins neufs non suivis : `brag-output\`, cette synthèse et ses journaux d'oracle.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Video - Film de 25 secondes sur le depot factory rendu en local - 20260919f.md`.
- Aucune page HTML livrée ni modifiée dans ce tour : le seul fichier de ce type est la source de la composition, jamais remise à un lecteur.
