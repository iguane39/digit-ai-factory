---
destinataire: humain
---

# Synthèse Mandat — publication du pilot et détail de D-182 et D-184 (09/11/2026)

## 0. Synthèse d'ouverture

Le pilot est publié : le tri des favoris, ses synthèses et le travail d'une autre session sont en ligne. Les 2 décisions restantes sont détaillées ci-dessous, chacune avec une option de plus. Pour le favori illisible, vous pouvez le regarder vous-même et me donner les dépôts qu'il cite, sans rien télécharger. Pour les favoris déjà triés, seuls les 10 triés le 19/10 n'ont jamais été écoutés ; ce sont eux qu'une relecture viserait. Ma recommandation reste de ne rien faire de plus sur les deux.

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`. Période : 09/11/2026 de 16:10 à 16:16, heure de Paris, relevée par `date`, durée 6 minutes. Session pilote Claude Opus 5.5.

Intention de la demande : publier le pilot, puis avoir assez de détail pour trancher les 2 décisions restantes sur les favoris TikTok.

Test rétro : la publication est vérifiée par `git rev-list`, et chaque décision porte ce qu'elle vise, ce qu'on en sait et ses options chiffrées.

## 2. Verdict en une ligne

Pilot publié de `7ed68fdc` à `ebbd96da`, 7 commits, `git rev-list` rend 0 ; 2 décisions détaillées.

## 3. Décisions attendues

Répondez par exemple « 182a, 184a ».

> **D-182 — Le tri peut-il télécharger le favori TikTok du 09/11 resté illisible par sa légende et sa couverture, alors que les conditions de TikTok interdisent l'extraction automatisée ?**
>
> - **De quoi s'agit-il** : un favori de la page du 09/11 dont la légende dit seulement « RDV sur le lien en bio pour recevoir le guide ! ». Sa couverture titre « 9 dépôts GitHub » et montre le premier : `CapSoftware/Cap`, un outil libre d'enregistrement d'écran, 24 400 étoiles. Les 8 autres dépôts ne sont nommés ni dans la légende ni sur l'image.
> - **Le problème** : la légende et la couverture ne disent pas si la vidéo parle d'IA ; le seul dépôt visible n'en relève pas. Télécharger la vidéo s'écarte des conditions de TikTok : vos réponses 120b et 142b l'avaient accepté pour 47 favoris le 02/11, sans refus de la plateforme, mais elles ne valent que pour ce tri-là.
> - **Pourquoi vous** : c'est une question de doctrine envers les conditions d'un tiers, et le téléchargement est irréversible.
> - **Recommandation : (a)** — 1 contenu sur 6, dont le seul indice ne parle pas d'IA, ne change pas le tableau ; si vous tenez à le qualifier, (c) le fait sans s'écarter des conditions. Source consultée : la rangée TikTok du tableau de `references/PLATEFORMES-RESEAUX.md`, et le tri du 02/11.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ne pas télécharger | Le contenu reste non qualifié dans le fichier de rangement, et le prochain tri le reprend | Nul | Possible : choisir (b) ou (c) plus tard |
| (b) Télécharger ce seul contenu | Je le télécharge une fois par `yt-dlp`, le transcris en local par `faster-whisper`, lis ses images, puis le range ; le tableau sort à l'indice suivant | Simple × court | Impossible pour le téléchargement ; la transcription se supprime |
| (c) Vous la regardez | Vous ouvrez la vidéo dans TikTok et me donnez les 9 dépôts qu'elle cite ; je les lis à leur source et range le contenu | Simple × court, une minute de votre temps | Possible : rien n'est téléchargé |

> **Comment faire pour la troisième option** : dans vos favoris TikTok, ouvrez la vidéo dont l'écran titre « 9 dépôts GitHub », puis écrivez-moi les noms de dépôts qu'elle affiche.
>
> **Sans réponse** : (a), rien n'est téléchargé.

> **D-184 — Faut-il relire les 42 favoris TikTok de la page du 09/11 déjà triés le 19/10 ou le 02/11, que le tri du 09/11 a laissés à leur verdict ?**
>
> - **De quoi s'agit-il** : 32 de ces favoris ont été triés le 02/11, et tous écoutés ou lus sur leurs images. Ils donnent 21 sujets sur l'IA : 1 étude poussée, l'audit de sécurité de Cloudflare ; 1 essai court ; 4 décisions directes, dont Harvey et le programme Claude pour startups ; 1 sujet à écarter ; 14 sans suite. 10 autres sortent du filtre IA. Les 10 restants ont été triés le 19/10, sur leur seule légende : 5 rattachés à des sujets alors étudiés (vidéo de lancement générée par le code 2 fois, tactiques SEO et GEO, packs d'agents tiers, rétro-ingénierie par agents), 1 rangé en contexte sans geste et 4 hors du champ.
> - **Le problème** : la relecture d'intention lit votre demande comme visant les 48 favoris. Relire les 32 du 02/11 referait un travail complet. Les 10 du 19/10 n'ont jamais été écoutés : le 02/11, un favori jugé sur sa légende a changé de sujet à l'écoute. Mais les 4 sujets distincts de ces 5 favoris ont chacun leur étude d'opportunité du 19/10.
> - **Pourquoi vous** : c'est un arbitrage sur le périmètre de votre demande, que seul vous pouvez lever.
> - **Recommandation : (a)** — aucun fait neuf ne vise ces favoris, et les sujets des 10 du 19/10 sont déjà étudiés. Source consultée : `input/Tiktok/rangement-20261102.json` et l'annexe de `output/03-etudes/20261019-tri-opportunites-favoris-tiktok.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder leurs verdicts | Le tri du 09/11 reste tel quel, avec son rappel chiffré des 42 | Nul | Possible : choisir (b) ou (c) plus tard |
| (b) Relire les 10 du 19/10 sans télécharger | Je les relis par couverture et source primaire ; le tableau sort à l'indice suivant avec les sujets dont le verdict change | Simple × court | Possible : la nouvelle version s'ignore |
| (c) Écouter les 10 du 19/10 | Comme (b), avec téléchargement et transcription locale, un par un ; même écart aux conditions de TikTok que D-182 (b) | Moyen × court | Impossible pour les téléchargements ; les transcriptions se suppriment |

> **Sans réponse** : (a), rien ne change.

## 4. Traité

- **Publication du pilot, votre réponse A1.** 7 commits de `7ed68fdc` à `ebbd96da` : le tri des favoris, ses 3 synthèses, et le commit `2a850901` d'une autre session sur la loi n° 8. Envoi avec vos mots en accord de publication, `git rev-list` rend 0. Cette synthèse-ci est enregistrée sur le poste et partira avec la prochaine publication que vous autoriserez.
- **Détail des 42 favoris.** Relevé par script sur les fichiers de rangement du 02/11 et l'annexe du 19/10, identifiant par identifiant.
- **D-185.** Votre réponse (a) est appliquée : le sur-titre en capitales reste dans la charte, sans changement de fichier.

Relecture d'intention : sans objet, le tour publie et détaille 2 décisions déjà posées, sans livrable neuf.

## 5. Non traité

- **Le favori illisible** — motif : decision, détaillée en D-182.
- **La relecture des favoris déjà triés** — motif : decision, détaillée en D-184.

## 8. Prochaines actions

Rien n'attend en dehors des 2 décisions du bloc 3.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Trancher le favori illisible et la relecture des favoris déjà triés | neuve | manuelle_utilisateur | decision : les 2 choix touchent les conditions de TikTok et le périmètre de votre demande | relire le bloc 3 de `output/04-plans/Digit-AI - Synthese Mandat - Publication du pilot et detail de D-182 et D-184 - 20261109c.md`, puis répondre par exemple « 182a, 184a », ou « 182c » avec les noms de dépôts | si rien n'est fait : rien n'est téléchargé ni relu |

## 9. Traces

- Publication : `digit-ai-factory`, de `7ed68fdc` à `ebbd96da`.
- Tri : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261109a.md`.
- Rangements, ignorés par git : `input/Tiktok/rangement-20261109.json` et `input/Tiktok/rangement-20261102.json`.
- Décisions : `D-182`, `D-184` et `D-185` à `decisions/REGISTRE.jsonl`.
