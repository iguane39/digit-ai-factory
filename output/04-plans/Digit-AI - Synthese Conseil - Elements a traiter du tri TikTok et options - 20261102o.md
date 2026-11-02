---
destinataire: humain
---

# Synthèse Conseil — éléments à traiter du tri TikTok et options (02/11/2026)

## 0. Synthèse d'ouverture

Du tri TikTok, 6 éléments attendent votre choix, et je n'en recommande vraiment que 3 : 2 essais sans installation et 1 inscription d'une minute. S'y ajoutent 2 questions sur le périmètre de ce travail. Le plus important est le manque de revue de code de nos contrôles de sécurité. Sans réponse, rien ne se lance. Le reste du tableau n'attend rien de vous.

| Élément | Ma recommandation |
|---|---|
| Revue de code par un seul agent | L'essayer sur 1 produit que vous nommez |
| Harvey, agent de prospection | Lire son code, sans l'installer |
| Programme Claude pour startups | S'inscrire à l'avis de réouverture |
| Publicités vidéo pour commerces | Laisser |
| Prime Agent, agent de code | Laisser |
| ArtCraft, studio d'images et de vidéos | Laisser |

Livré : [Tableau de tri](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20-%2020261102e.md) · [Rapport de l'essai](output/03-etudes/Digit-AI%20-%20Rapport%20-%20Essai%20borne%20de%20l%20audit%20de%20securite%20de%20Cloudflare%20-%2020261102k.md)

## 1. En-tête d'identification

Conseil sur le pilot `digit-ai-factory`, en réponse à votre question sur les éléments à traiter. Période : 02/11/2026 de 14:35 à 14:46, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : savoir ce qu'il reste à faire du tri TikTok, avec assez de détail pour trancher chaque sujet sans rouvrir les vidéos.

Test rétro : chaque élément porte son contenu, ses options et leur coût, et se tranche par une lettre.

## 2. Verdict en une ligne

8 décisions à prendre : sur les 6 éléments, 3 recommandés pour agir et 3 pour laisser, plus 2 sur le périmètre ; rien n'a été installé ni lancé.

## 3. Décisions attendues

Répondez par exemple « 136a, 137a, 138a, 139c, 140c, 141c, 142a, 143a », en nommant le produit si vous retenez la première option de D-136.

> **D-136 — Faut-il clore l'outil de Cloudflare et essayer une revue de code par un seul agent sur un de vos produits ? (TF-2057)**
>
> - **De quoi s'agit-il** : la vidéo de @henriexploria présente `security-audit-skill`, un outil de Cloudflare où des agents cherchent les failles et un autre tente de les infirmer. Notre essai du jour l'a comparé à nos contrôles et à une simple requête à un agent.
> - **Le problème** : nos contrôles voient 0 faille de code sur 8, et une requête unique les voit toutes pour 106 865 jetons, contre 2 185 298 pour l'outil. La cible faisait 1 052 lignes et était sans doute trop facile : seul un vrai code dira si la requête unique tient.
> - **Pourquoi vous** : l'essai lit le code d'un produit et consomme votre abonnement, et vous seul savez quel produit peut être lu.
> - **Recommandation : (a)** — le manque est mesuré, et l'essai coûte peu face à une faille d'accès en production. Source consultée : `output/03-etudes/Digit-AI - Rapport - Essai borne de l audit de securite de Cloudflare - 20261102k.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Clore l'outil et essayer | L'outil de Cloudflare n'est pas adopté. Un agent relit en lecture seule le produit que vous nommez, et un référentiel daté des classes d'attaque entre dans `digit-ai-forge-websec`. Le rapport reste chez le produit, jamais dans le dépôt public du pilot | Moyen × court, 300 000 jetons au plus | Possible : le référentiel se retire, le produit n'est pas modifié |
| (b) Clore l'outil sans essai | L'outil n'est pas adopté, et le manque reste écrit au registre sans suite | Nul | Possible : rouvrir l'essai plus tard |
| (c) Attendre | Les 2 sujets restent candidats, l'outil revient à la revue du 30/11 | Nul | Sans objet |

> **Comment faire pour la première option** : donnez le nom du produit dans votre réponse, de préférence une application web avec comptes et base de données.
>
> **Sans réponse** : (c), rien n'est lancé et l'outil revient à la revue du 30/11.

> **D-137 — Que fait-on de Harvey, l'agent de prospection open source qui tourne sur un abonnement Claude ?**
>
> - **De quoi s'agit-il** : un agent de vente vu chez @henriexploria, dépôt `ethanplusai/harvey`, licence MIT, 4 000 étoiles. Il cherche des entreprises sur OpenStreetMap par défaut, rédige des courriels à froid, lit les réponses et vise le rendez-vous, avec un tableau de bord local. Chaque courriel attend votre approbation, sauf à l'activer autrement.
> - **Le problème** : il recoupe `digit-ai-prospection`, où un associé envoie lui-même les messages, et dont le run attend depuis le 28/09 une validation d'associé. Le gain serait d'aller plus vite. En face : un domaine dédié, 2 à 4 semaines de préchauffage par un service tiers, et des Conditions d'Anthropic qui excluent l'usage commercial sur un compte personnel et visent un usage « ordinary, individual ».
> - **Pourquoi vous** : c'est votre offre commerciale, votre domaine d'envoi et votre compte qui sont engagés, et vous seriez l'expéditeur légal.
> - **Recommandation : (a)** — lire le code ne coûte presque rien et n'engage aucun envoi ; la vidéo ne dit rien du contrat. Source consultée : `references/JETON-ABONNEMENT.md`, et le README du dépôt lu le 02/11/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lire et comparer | Un agent compare le code de Harvey au référentiel de `digit-ai-prospection`, en lecture seule, et rend une note de ce qui vaut d'être repris, comme son contrôle avant envoi. Rien n'est installé, aucun courriel ne part | Simple × court, environ 70 000 jetons estimés | Possible : la note s'ignore |
| (b) L'essayer pour de vrai | Installation dans un dossier séparé, approbation gardée, boîte et domaine dédiés. Il faut d'abord trancher la question du compte, peut-être par un plan Team | Élevé × long, avec abonnement de préchauffage, et plan Team si retenu | Possible pour l'outil ; difficile pour un domaine ou des courriels déjà envoyés |
| (c) Laisser | Rien ne change, et `digit-ai-prospection` reste en attente de sa validation | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est lancé.

> **D-138 — Vous inscrivez-vous à l'avis de réouverture du programme Claude pour startups, dont les candidatures sont fermées ?**
>
> - **De quoi s'agit-il** : le programme vu chez @ai.with.andrew, sur `claude.com/programs/startups`, destiné aux fondateurs en début d'activité qui construisent sur Claude. La vidéo annonce 1 000 dollars, la page parle de remises partenaires jusqu'à 45 000 dollars, et de 100 000 dollars de plus en crédits d'API si un fonds partenaire vous soutient.
> - **Le problème** : la cohorte est complète, et la page ne donne aucune date de réouverture. Les crédits ne valent que sur l'API directe, or la Factory tourne sur votre abonnement ; 6 dépôts sur 28 du poste citent l'API dans leur code, sans que j'aie mesuré s'ils la paient. Le gain est donc incertain, et le coût d'une inscription minime.
> - **Pourquoi vous** : l'inscription porte votre adresse, et vous seul savez si Digit-AI se présente comme une startup.
> - **Recommandation : (a)** — une minute, sans engagement, pour ne pas manquer une cohorte. Source consultée : `https://claude.com/programs/startups`, lue le 02/11/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) S'inscrire | Vous recevez la lettre d'information du programme, et la candidature reste à décider à la réouverture | Simple × court, une minute | Possible : se désinscrire |
| (b) Laisser | Rien ne change, et la réouverture peut passer inaperçue | Nul | Possible : s'inscrire plus tard |

> **Comment faire pour la première option** : ouvrez `https://claude.com/programs/startups#subscribe` et saisissez l'adresse de votre choix ; je ne transmets pas votre adresse à un tiers sans que vous le demandiez.
>
> **Sans réponse** : (b), rien ne se fait.

> **D-139 — Que fait-on de l'idée de vendre des publicités vidéo aux commerces, vue dans une vidéo qui annonce 350 euros ?**
>
> - **De quoi s'agit-il** : une vidéo de 34 secondes de `@unseulprompt`. L'auteur dit avoir vendu 350 euros une publicité à un spa : Claude écrit le script, anime et pose la voix, puis trouve les commerces, écrit le message et prépare une démo à leurs couleurs.
> - **Le problème** : la seule preuve est 1 vente annoncée par quelqu'un qui échange sa méthode contre un commentaire, sans outil nommé. Y aller ouvrirait une offre neuve à petit prix, là où ne rien faire ne ferme rien : un essai de vidéo générée est déjà décidé pour la prochaine mise en production.
> - **Pourquoi vous** : c'est un choix d'offre commerciale, que rien dans les données ne tranche.
> - **Recommandation : (c)** — trop peu de preuves pour payer une étude. Source consultée : la transcription de la vidéo, écoutée le 02/11/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Greffer sur l'essai vidéo déjà décidé | Lors de `TF-1924`, on produit aussi une publicité pour un commerce fictif, pour mesurer le temps passé et le rendu. Aucun prospect n'est contacté | Simple × court, à la prochaine mise en production | Possible : le fichier se supprime |
| (b) Lancer une étude d'opportunité | Une étude au gabarit évalue le marché, le prix et la concurrence de cette offre | Moyen × moyen | Possible : l'étude conclut, rien ne s'engage |
| (c) Laisser | Le sujet reste au tableau de tri | Nul | Possible : le rouvrir plus tard |

> **Sans réponse** : (c), rien ne se fait.

> **D-140 — Que fait-on de Prime Agent, l'agent de code open source qui s'améliore entre deux exécutions ?**
>
> - **De quoi s'agit-il** : un agent de Prime Intellect vu chez @code_simple, dépôt `PrimeIntellect-ai/prime-agent`, licence MIT, 22 500 étoiles. Son travail survit à la fermeture du terminal, et sa commande `/refine` relit l'exécution pour ajuster ses invites, mémoires et skills, avec retour en arrière.
> - **Le problème** : son éditeur annonce un passage de 30 à 95,5 % sur le banc ARC-AGI-3, sans mesure indépendante trouvée. L'adopter ferait quitter Claude Code, sur lequel repose la Factory ; le suivre coûte peu, mais `oeil-critique` tient déjà ce rôle d'amélioration entre sessions. Il exécute du Python généré avec vos droits, sans bac à sable, et sa page ne nomme pas Claude.
> - **Pourquoi vous** : le choix de l'outil de travail de la Factory vous revient.
> - **Recommandation : (c)** — rien de mesuré ne justifie un changement d'outil. Source consultée : le README du dépôt, lu le 02/11/2026, et des résumés de presse de l'annonce, pas l'article d'origine.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Comparer `/refine` à `oeil-critique` | Un agent lit son code et rend une note sur ce qui vaut d'être repris. Rien n'est installé | Simple × court, environ 70 000 jetons estimés | Possible : la note s'ignore |
| (b) L'essayer sur un dépôt jetable | La session l'installe sur le poste par `install.ps1`, le script de l'éditeur, et compare 1 tâche longue à Claude Code | Moyen × moyen | Possible : désinstaller |
| (c) Laisser | Le sujet reste au tableau de tri | Nul | Possible : le rouvrir plus tard |

> **Sans réponse** : (c), rien ne se fait.

> **D-141 — Que fait-on d'ArtCraft, le studio d'images et de vidéos par IA présenté comme alternative à Adobe ?**
>
> - **De quoi s'agit-il** : un logiciel open source vu chez @ninon.ia, sur `getartcraft.com`, avec des applications d'édition gratuites et une génération par IA. On y place les objets et la caméra avant de générer. Les plans vont de 8 à 48 dollars par mois, ou vos propres abonnements.
> - **Le problème** : aucune forge n'a exprimé ce besoin, et la génération dépend de fournisseurs tiers, ce que nos règles écartent pour la Factory. Il ne vaudrait donc que pour votre usage personnel. Je ne l'ai pas essayé, et les avis sur son rendu divergent.
> - **Pourquoi vous** : c'est un goût et un usage personnels, hors Factory.
> - **Recommandation : (c)** — aucun besoin relevé. Source consultée : `https://getartcraft.com/pricing`, lue le 02/11/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) L'étudier pour la Factory | Une étude cherche si une forge de design y gagnerait | Moyen × moyen | Possible : l'étude conclut, rien ne s'engage |
| (b) L'essayer vous-même | Vous l'ouvrez sur `https://app.getartcraft.com`, sans installation et hors de la Factory | Simple × court ; gratuit sans génération payante | Possible : désinstaller |
| (c) Laisser | Le sujet reste au tableau de tri | Nul | Possible : le rouvrir plus tard |

> **Sans réponse** : (c), rien ne se fait.

> **D-142 — Faut-il écouter les 39 favoris TikTok qui n'ont été lus que par leur légende ou leur couverture ?**
>
> - **De quoi s'agit-il** : les favoris du tableau `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md` que votre réponse 120b n'a pas fait télécharger, parce que leur légende se lisait.
> - **Le problème** : une vidéo peut dire plus que sa légende, donc un sujet classé sans suite peut être mal classé. En face, chaque écoute est un téléchargement que les conditions de TikTok interdisent, et le rythme que vous avez demandé, 5 minutes par vidéo, ferait plus de 3 heures.
> - **Pourquoi vous** : votre demande visait les vidéos non analysées, et le choix de 120b vous appartient.
> - **Recommandation : (a)** — le tableau dit déjà cette limite, et rien ne montre que ces vidéos changeraient un verdict. Source consultée : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) En rester à 120b | Les 39 favoris restent lus par leur légende ou leur couverture, et la limite reste écrite au tableau | Nul | Possible : les écouter plus tard |
| (b) Écouter les 39 | Téléchargement un par un au même rythme, transcription locale, tableau rejugé | Simple × long, plus de 3 heures | Impossible pour les téléchargements faits ; le tableau garde son historique |

> **Sans réponse** : (a), le périmètre de 120b reste.

> **D-143 — Votre liste des éléments à traiter doit-elle couvrir aussi le reste du registre, au-delà du tri TikTok ?**
>
> - **De quoi s'agit-il** : le registre `todo/TODO.jsonl`, qui compte 5 candidats, 11 items décidés et 59 en cours. J'ai lu votre question dans la suite de celle sur les vidéos TikTok, sans vous le demander : la relecture d'intention y voit une dérive, parce que « Quelle est la liste des éléments à traiter ? » ne pose pas cette limite.
> - **Le problème** : si vous visiez tout le travail ouvert, cette liste ne montre que 6 sujets sur ces 75. L'élargir donnerait une vue complète, au prix d'une liste bien plus longue, qui recoupe la revue hebdomadaire.
> - **Pourquoi vous** : vous seul savez ce que votre question visait.
> - **Recommandation : (a)** — votre question suivait celle sur les vidéos. Source consultée : vos messages de cette conversation.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Tri TikTok seulement | La liste reste celle de cette synthèse | Nul | Possible : élargir plus tard |
| (b) Tout le registre ouvert | Une liste des 75 items ouverts, groupés par sujet, avec leurs options quand ils en ont | Moyen × court | Possible : la liste s'ignore |

> **Sans réponse** : (a), la liste reste celle du tri TikTok.

## 4. Traité

La session a relu le tableau, les transcriptions et les sources, sans rien installer ni lancer.

**Sources relues aujourd'hui**

- Les pages de Harvey, de Prime Agent, du programme pour startups et des tarifs d'ArtCraft. Les vidéos de Harvey, de Prime Agent et des publicités ont été transcrites ce matin ; le programme n'est connu que par sa légende, ArtCraft par sa légende et sa couverture.
- Le relevé sur 28 dépôts du poste : 6 citent l'API Claude dans leur code.

**Éléments qui n'attendent plus rien de vous**

- `TF-2055`, regrouper les longues listes : déjà tranché par D-130 (a). La consigne est écrite au gabarit par une autre session, pas encore enregistrée.
- `TF-1924`, vidéo générée par le code : essai déjà décidé, à la prochaine mise en production.
- `TF-2053`, skill de tri : sa revue est fixée au 02/02/2027.
- Les 22 lignes restantes du tableau : 21 sans suite et les liens entrants à écarter, classés spam par Google.

Relecture d'intention : dérive maintenue après 2 passes de correction, consignée sous RI-20261102-14. Les écarts de périmètre vous sont posés en D-142 et D-143. Son écart sur 128a est inexact : la section d'avertissement est bien en tête du tableau, relue à sa ligne 26.

## 5. Non traité

- **Les 39 favoris non écoutés** — motif : hors_perimetre, votre réponse 120b ne visait que les contenus illisibles, et la question vous est posée en D-142.
- **Les 4 autres dépôts du carrousel `i-have-adhd`** — motif : borne_atteinte, seule la première image du carrousel est disponible.
- **Le reste du registre** — motif : hors_perimetre, j'ai lu « éléments à traiter » comme ceux du tri TikTok, et la question vous est posée en D-143.

## 6. Écarts à la lettre

- Vous demandez une liste → 6 décisions au format de la restitution → sinon votre choix ne se trancherait pas par une lettre.

## 8. Prochaines actions

1 seule action, sans ordre à tenir, car elle couvre les 8 décisions.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre aux décisions D-136 à D-143 | neuve | manuelle_utilisateur | decision : offre, compte et produit vous reviennent | `output/04-plans/Digit-AI - Synthese Conseil - Elements a traiter du tri TikTok et options - 20261102o.md`, bloc 3 | si rien n'est fait : aucun essai ne se lance, et le manque de revue de code reste entier |

## 9. Traces

- Tableau : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.
- Rapport de l'essai : `output/03-etudes/Digit-AI - Rapport - Essai borne de l audit de securite de Cloudflare - 20261102k.md`.
- Fiche d'abonnement : `references/JETON-ABONNEMENT.md`.
- Décisions réservées : D-136 à D-143 à `decisions/REGISTRE.jsonl`.
- Sources lues le 02/11/2026 : [Harvey](https://github.com/ethanplusai/harvey), [Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent), [programme pour startups](https://claude.com/programs/startups), [tarifs d'ArtCraft](https://getartcraft.com/pricing), [résumé de presse sur Prime Agent](https://aiweekly.co/alerts/prime-intellects-prime-agent-lifts-arc-agi-3-from-30-to-955).
- Transcriptions : `input/Tiktok/transcriptions-20261102/`, hors du dépôt.
