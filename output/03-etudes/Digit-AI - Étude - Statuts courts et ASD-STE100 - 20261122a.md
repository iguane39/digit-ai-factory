---
lecteur: le porteur de la Factory, qui décide des règles d'écriture des sessions et des forges
---

# Étude — « Statuts courts » et « écris à 80 % de l'ASD-STE100 »

Le « 80 % » du titre n'est pas une mesure : la consigne demande de suivre la norme à 80 sur 100, sans préciser quelles règles.

Étude du 22/11/2026, poste DESKTOP-ULTRA7, au pilot `digit-ai-factory`. Elle compare votre préférence « Statuts courts » à la consigne montrée dans la vidéo TikTok analysée le même jour. Les mesures datent de 11:05 à 11:07.

## En bref

- Les deux consignes ne règlent pas le même niveau. « Statuts courts » découpe un message, la norme découpe une phrase.
- La norme ne raccourcit pas une réponse par elle-même. Le passage de 1 284 à 64 mots montré dans la vidéo est une maquette, pas une mesure.
- La Factory applique déjà en français environ 4 règles sur 6 de la norme, avec un juge (`oracle-ecriture`). Elle reste plus lâche sur la longueur : elle coupe au-delà de 35 mots, la norme au-delà de 20 ou 25.
- Mesuré sur les 10 dernières synthèses : 33 % des phrases dépassent 20 mots et 16 % dépassent 25 mots. C'est là que la norme agirait.

## Les deux consignes, mot pour mot

- **Statuts courts** (`references\PREFERENCES-PORTEUR.md`, 01/10) : « une phrase qui répond, puis des puces d'une idée. La restitution complète sert la reprise de contexte entre sessions ; ne couper que le vide. »
- **ASD-STE100** (vidéo du 21/11, d'après un post X d'un cofondateur d'OpenAI daté du 02/10) : « écris-moi à 80 % de l'ASD-STE100 ». L'ASD-STE100 est l'anglais technique simplifié des manuels de maintenance aéronautique. Sa version en vigueur est l'édition 9 de janvier 2025, devenue norme internationale la même année.

## Comparaison point par point

Ce tableau dit, axe par axe, ce que chaque consigne règle et ce qu'elle laisse libre.

| Axe | Statuts courts | 80 % de l'ASD-STE100 |
|---|---|---|
| Nature | préférence d'un porteur, en une ligne | norme industrielle de langue contrôlée |
| Niveau réglé | le message : une réponse, puis des puces | la phrase et le mot : longueur, voix, vocabulaire |
| Portée | les statuts et réponses courtes | tout texte écrit par le modèle |
| Langue | français | anglais ; le français n'est couvert que par analogie |
| Seuils chiffrés | aucun | 20 mots par consigne, 25 par description, 6 phrases par paragraphe |
| Vocabulaire | libre | environ 900 mots approuvés, un sens par mot |
| Longueur totale | la réduit : on coupe le vide | ne la vise pas ; découper les phrases peut même l'allonger |
| Garde-fou | « ne couper que le vide » protège le contenu | aucun ; « 80 % » est un assouplissement flou |
| Juge à la Factory | les hooks de fin de tour (forme courte ou restitution) | aucun ; ses règles proches sont jugées par `oracle-ecriture` |

## Constats

### Les deux consignes se complètent, elles ne se remplacent pas

« Statuts courts » dit ce qu'on garde et dans quel ordre. La norme dit comment écrire chaque phrase gardée.

Un statut peut suivre la première avec des puces de 40 mots. Une réponse peut suivre la norme en 1 300 mots de phrases courtes.

### La vidéo prête à la norme un effet qui vient d'ailleurs

L'avant/après de la vidéo (00:51) oppose 1 284 mots à 64 mots en 4 points. Ce gain vient surtout du format en points numérotés, objet même de « Statuts courts ».

Le post d'origine visait la lisibilité, pas la brièveté. La norme rend une phrase plus facile à lire, elle ne retire aucune idée.

### La Factory porte déjà l'essentiel de la norme, en français et sous un juge

Le tableau met chaque règle de la norme en face de la règle d'écriture de la Factory qui s'en rapproche, puis nomme l'écart.

| Règle de la norme | Équivalent dans `references\ECRITURE.md` | Écart |
|---|---|---|
| 20 mots par consigne, 25 par description | E-2 : viser 20 mots, avertir à 3 phrases de plus de 35 d'affilée ; E-17 : 25 mots pour un écrit à un tiers | seuil plus lâche pour les textes internes |
| 6 phrases par paragraphe, un sujet | E-17 : 3 phrases et 60 mots, pour un tiers seulement | rien pour les études et restitutions |
| Un mot, un sens, dans un dictionnaire fermé | E-10 (sigles glosés), E-12 (vocabulaire du lecteur), `gabarits\JARGON-A-GLOSER.json` | liste de mots à expliquer, pas liste de mots permis |
| Une consigne par phrase, à l'impératif | E-11 : une étape par ligne | l'impératif n'est pas demandé |
| Voix active | citée dans les sources de la famille A | ni règle numérotée ni juge |
| Mots simples, pas de formule creuse | E-3, E-5, E-6, E-7 | couvert, et plus finement que par la norme |

### L'écart réel porte sur les phrases de 21 à 35 mots

Mesuré à 11:07 sur les 10 dernières synthèses et les 10 dernières études. Chaque taux est la part des phrases qui dépassent le seuil.

| Corpus | Phrases | Médiane | Plus de 20 mots | Plus de 25 mots | Plus de 35 mots |
|---|---|---|---|---|---|
| synthèses, `output\04-plans` | 524 | 15 mots | 33 % | 16 % | 4 % |
| études, `output\03-etudes` | 655 | 14 mots | 22 % | 7 % | 3 % |

Le comptage découpe les élisions : « d'un » compte pour 2 mots, et les taux sont un peu surestimés. Le plancher actuel laisse passer ces phrases, la norme les couperait.

### La ligne telle quelle ajouterait 2 risques

- La langue : une consigne en anglais pousse le modèle vers l'anglais, alors que vos réponses restent en français (préférence du 26/10, règle EC-15). Le GIFAS (Groupement des industries françaises aéronautiques et spatiales) a défini un « français rationalisé ». Ses règles détaillées ne sont pas en accès libre.
- Le juge. Une ligne dans un profil ne se mesure pas, et la loi 1 de la Factory veut qu'une règle soit jugée. Les seuils de la norme, eux, peuvent entrer dans `oracle-ecriture`.

## Préconisations

Ce que je propose de prendre à la norme, et ce que je propose de laisser.

| # | Action | Gain | Effort | Attention |
|---|---|---|---|---|
| 1 | Ne pas coller la ligne anglaise dans un `CLAUDE.md` ou un profil | évite la dérive vers l'anglais et une règle sans juge | nul | aucune |
| 2 | Resserrer E-2 sur les textes internes : viser 20 mots, avertir dès 25 | cible les 16 % de phrases de synthèse au-delà de 25 mots | un seuil dans `references\tics-redactionnels.json`, puis recalibrage | garder 95 % de PASS sur le corpus déjà jugé |
| 3 | Étendre la règle des paragraphes de E-17 (6 phrases au plus) aux études et restitutions | paragraphes plus faciles à parcourir | une règle de plus dans `oracle-ecriture` | les blocs du gabarit de restitution priment |
| 4 | Ajouter à E-11 « une consigne par phrase, verbe à l'impératif » pour le bloc 8 et les guides | actions lisibles sans relire | une famille de tournures | ne vise que les consignes |
| 5 | Garder « Statuts courts » tel quel | c'est elle qui raccourcit les réponses | nul | aucune |

## Pistes écartées

- Adopter le dictionnaire de 900 mots. Il est en anglais et propre à la maintenance aéronautique. La liste de jargon à expliquer suffit pour le français.
- Remplacer « Statuts courts » par la norme. Elles ne règlent pas la même chose.
- Rouvrir la décision D-221 sur les vidéos pour ce seul cas. Cette analyse est passée par le skill qui lit les vidéos, pas par un run réseau.

## Ordre conseillé

1. Le seuil de 25 mots (n° 2) d'abord : son effet se mesure.
2. Puis l'impératif dans les consignes (n° 4), que vous lisez à chaque tour.
3. Enfin les 6 phrases par paragraphe (n° 3), après relecture du gain du n° 2.

## Sources

- Vidéo TikTok analysée le 22/11/2026 : [lien](https://www.tiktok.com/@melvynx.dev/video/7710579127908093206) ; transcription locale et 16 images, dans le dossier temporaire de la session.
- Le post d'origine, repris par [Search Engine Journal](https://searchenginejournal.com/karpathy-llm-aircraft-manual-writing/591813) ; non lu sur X.
- La norme, dont le texte officiel n'a pas été lu :
  - [asd-ste100.org](https://asd-ste100.org/about_STE.html) ;
  - [Wikipédia](https://en.wikipedia.org/wiki/Simplified_Technical_English), d'où viennent les seuils de 20 et 25 mots ;
  - [tcworld, édition 9](https://www.tcworld.info/news/asd-ste100-issue-9-setting-a-standard-for-technical-documentation).
- Le français rationalisé : [Technical Communication, 1999](https://www.ingentaconnect.com/contentone/stc/tc/1999/00000046/00000002/art00009).
- Factory :
  - `references\PREFERENCES-PORTEUR.md` ;
  - `references\ECRITURE.md`, règles E-2, E-10 à E-12 et E-17.
