---
destinataire: humain
---

# Synthèse Mandat — tri des favoris TikTok et skill de tri (02/11/2026)

## 0. Synthèse d'ouverture

Le tableau est prêt et le skill est publié. Sur 54 contenus repris, 32 parlent de Claude ou d'IA et donnent 29 sujets : 1 mérite une étude poussée, l'audit de sécurité par agents de Cloudflare, et 1 se tranche par un essai court. Attention à une limite : rejouée à l'aveugle sur les 14 études du 19 octobre, la règle de tri aurait écarté 9 des 11 études qui ont eu une suite, donc un « Sans suite » veut dire « rien ne presse ». Je m'étais aussi trompé ce matin sur un point, repris depuis : les chiffres du 19 octobre que je citais reposaient sur de mauvais numéros. Il vous reste 2 décisions : lancer ou non ces 2 sujets, et assouplir ou non la règle.

Livré : [Tableau de tri](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20-%2020261102e.md) · [Étude du skill et back-test](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Skill%20de%20tri%20de%20sujets%20-%2020261102c.md)

## 1. En-tête d'identification

Run de mandat sur le pilot `digit-ai-factory` et `digit-ai-forge-agents`, exécution du prompt réécrit avec vos réponses 120b et 121a. Période : 02/11/2026 de 09:44 à 10:30, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5 ; 1 agent `explorateur` pour la notation à l'aveugle, 1 agent `verificateur` pour la relecture d'intention.

Intention de la demande : savoir quels sujets Claude et IA de vos favoris méritent une étude d'opportunité, et rendre ce tri réutilisable sur toute liste de sujets.

Test rétro : le tableau répond sujet par sujet et le skill rejoue le tri sur une autre liste. La qualité de la règle reste à régler, et le back-test le montre sans le masquer.

## 2. Verdict en une ligne

54 contenus rangés sur 54, 29 sujets, 1 étude poussée ; `oracle-tri-de-sujets` PASS ; skill au self-test 40/40 ; back-test à 5 accords sur 14, sous le seuil de 9.

## 3. Décisions attendues

> **D-126 — Lance-t-on l'étude sur l'audit de sécurité de Cloudflare et l'essai sur le skill i-have-adhd, seuls sujets que le tri propose de creuser ?**
>
> - **De quoi s'agit-il** : 2 suites du tableau, pour renforcer les contrôles de sécurité et raccourcir les réponses. L'étude compare l'outil d'audit de Cloudflare aux contrôles de `digit-ai-forge-websec`, qui ne lisent pas le code par agents. L'essai compare les 10 règles du skill à nos règles d'écriture.
> - **Le problème** : c'est le seul sujet de sécurité du tableau, à fort gain possible, mais une étude coûte un agent et son relecteur. L'essai, lui, ne coûte qu'une comparaison.
> - **Pourquoi vous** : choisir les chantiers du pilot est votre arbitrage, et votre demande portait sur la pertinence, pas sur le lancement.
> - **Recommandation : (a)** — le dépôt de Cloudflare est vérifié, sous licence MIT, et sa vérification adverse manque à nos contrôles. Source consultée : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lancer l'étude et l'essai | Une étude au gabarit sur Cloudflare, une comparaison des 10 règles ; rien n'est installé | Moyen × moyen pour l'étude, simple × court pour l'essai | Possible : l'étude conclut, rien ne change avant votre choix |
| (b) Lancer l'essai seul | La comparaison est faite, l'étude attend | Simple × court | Possible : lancer l'étude plus tard |
| (c) Ne rien lancer | Les 2 sujets restent au tableau | Nul | Possible : les lancer plus tard |

> **Sans réponse** : (c), rien n'est lancé.

> **D-125 — Faut-il abaisser de 15 à 14 le score minimal du skill de tri, qui a laissé passer 9 études utiles sur 11 au back-test ?**
>
> - **De quoi s'agit-il** : le score sous lequel `tri-de-sujets` répond « Sans suite » sans regarder plus loin.
> - **Le problème** : à 15, il lance 2 études sur 14, utiles toutes les 2, et en manque 9. À 14, il en lance 6 dont 5 utiles. À 10, il en lancerait 10 sur 14 et ne filtrerait plus. La mesure compte toute suite comme utile, même petite, et ne compte pas le coût d'une étude.
> - **Pourquoi vous** : c'est un arbitrage entre payer des études de trop et en manquer, et le réglage s'appliquera à toutes les listes suivantes.
> - **Recommandation : (a)** — le gain est net pour un seul point, et 3 sujets du tableau d'aujourd'hui passent de « Sans suite » à votre décision directe, sans aucune étude de plus. Source consultée : `output/03-etudes/Digit-AI - Étude - Skill de tri de sujets - 20261102c.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Score minimal à 14 | Le script et l'oracle changent ; le tableau du jour est rejugé ; publicités vidéo, Prime Agent et ArtCraft passent en décision directe | Simple × court | Possible : remettre 15 |
| (b) Garder 15 | La règle reste stricte, et sera remesurée à la revue du 02/02/2027 | Nul | Sans objet |
| (c) Score minimal à 10 | Presque tout devient candidat, le tri ne filtre plus | Simple × court, puis plus d'études proposées | Possible : remettre 15 |

> **Sans réponse** : (b), le score minimal reste à 15.

## 4. Traité

Le run a mesuré le périmètre, lu les contenus, puis construit et publié le skill.

Mesuré sur : page du 02/11, page du 19/10 et annexe du tri, relues à 09:44, périmètre 54 éléments.

- **Périmètre.** 47 favoris et 7 liens du panneau de notifications, que le tri du 19/10 avait pris pour des favoris. 32 contenus retenus, 22 hors filtre, 0 non qualifié. Justesse non mesurée : aucun échantillon étiqueté ne contrôle ces états.
- **Lecture.** 28 favoris par leur légende, 11 avec leur couverture, 8 vidéos écoutées et transcrites en local.
- **Téléchargements, votre réponse 120b.** 8 contenus, un par un, de 09:46 à 10:22, à 5 minutes d'intervalle, sans cookie ni déguisement, et 0 refus. Le rythme est celui que vous avez demandé ; je n'ai pas cherché à masquer l'outil.
- **Ce que les vidéos ont changé.** Le mot « Flare » cachait `security-audit-skill` de Cloudflare, seule étude poussée ; le contenu sans légende utile de magenta.agence parle de typographie et sort du filtre.
- **Tableau.** `oracle-tri-de-sujets` rend PASS sur 54 entrées et 29 lignes ; aucune adresse signée n'y figure ; `oracle-ecriture` et `check_markdown.py` à PASS.
- **Étude du skill.** `oracle-etude-opportunite` PASS. Le refus du 13/08 visait un corpus sans outil ; sa clause de réveil est atteinte, avec 89 études au dépôt.
- **Skill `tri-de-sujets` 1.0.0.** Self-test 40/40, depuis la copie installée aussi ; revue en 6 points PASS ; essais du cas limite : 10 lignes donnent 9 entrées, 1 doublon, 1 déjà étudié retiré, et le non qualifié revient ; liste vide : sortie explicite.
- **Contrôle complet de `quality-oracles`.** 556 réussites et 1 échec : `judge/red`, le juge externe, déjà signalé instable le 30/10. Il n'est pas lié à ce skill, et le contrôle de ses 2 vues a rendu rouge puis vert après alignement.
- **Publication.** `digit-ai-forge-agents` de 7904f1a à 33b31a5, `git rev-list` rend 0 0 ; `bootstrap.mjs --pull` a propagé le skill, copie installée identique. Le pilot part sous le GO permanent `D-54 (b) du 03/10`.
- **Erreur reprise.** J'avais écrit que le score 21 du 19/10 avait fini écarté, en lisant des numéros de registre qui désignent aujourd'hui d'autres sujets. Relevé par le chemin des études : 11 études sur 14 ont une suite terminée, dont celle du score 21. Les 3 documents concernés portent la correction, et une note de mémoire évite la récidive.

Relecture d'intention : sert, consignée sous RI-20261102-05. Les 2 relectures précédentes de l'analyse sont au registre, et leurs écarts sont les décisions déjà tranchées.

## 5. Non traité

- **Les 4 autres dépôts du carrousel `your.aimentor`** — motif : hors_perimetre, seule sa première image est dans la page, et un téléchargement ne vise que les contenus illisibles.
- **Les vidéos lues par leur légende** — motif : decision, votre réponse 120b limite le téléchargement aux contenus restés illisibles.
- **Le lancement de l'étude et de l'essai** — motif : decision, posée au bloc 3.

## 6. Écarts à la lettre

Le prompt est tenu, à 2 écarts près.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Inscrire le skill à `fiches\forge-agents.md` et `INVENTAIRE.md` (prompt) | Inscrit à `versions-livrees.json`, au registre `TF-2053` et au registre des oracles | Ces 2 fichiers ne listent pas ce type de skill : `digit-ai-pdf` n'y figure pas non plus |
| « simule l'usage par un humain » | Espacement de 5 minutes et téléchargements un par un, sans déguisement ni contournement | Le rythme répond à votre demande ; je ne me fais pas passer pour un navigateur |

## 7. Risques

- **Conditions de TikTok.** Les 8 téléchargements s'écartent de ses conditions, par votre choix. Signal : un blocage ou un avertissement. Parade : les vidéos restent dans le dossier temporaire de la session, et seules les transcriptions restent, dans un dossier ignoré par git.
- **Favoris publiés.** Le tableau, dans un dépôt public, montre 32 de vos favoris sur l'IA. Signal : votre gêne à le lire en ligne. Parade : les 15 favoris hors sujet et les notifications restent hors du dépôt.
- **Règle mal réglée.** Elle a 5 accords sur 14 sur un petit échantillon. Signal : la revue du 02/02/2027. Parade : la limite est écrite en tête du tableau, et D-125 la pose.

## 8. Prochaines actions

Les 2 actions sont les vôtres ; la première d'abord, car elle dit quels travaux suivent.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Choisir quels sujets du tri lancer, et répondre sur le score minimal | `TF-2053` | manuelle_utilisateur | decision : les réponses à D-126 et D-125 vous reviennent | relire `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`, puis écrire vos lettres, par exemple « 126a, 125a » | si rien n'est fait : rien n'est lancé, et le score reste à 15 |
| A-2 | Trancher les 2 sujets que le tableau vous laisse : essayer Harvey dans le produit de prospection, et s'inscrire à l'avis de réouverture du programme Claude pour startups | neuve | manuelle_utilisateur | decision : ces 2 sujets touchent votre offre | les 2 lignes « Décision directe » de `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md` | si rien n'est fait : les 2 sujets restent au tableau, sans effet |

## 9. Traces

- Tableau : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.
- Étude et back-test : `output/03-etudes/Digit-AI - Étude - Skill de tri de sujets - 20261102c.md`.
- Skill et oracle : `digit-ai-forge-agents/.claude/skills/tri-de-sujets/` et `quality-oracles/scripts/oracle-tri-de-sujets.mjs`, commit 33b31a5.
- Rangement et transcriptions, ignorés par git : `input/Tiktok/rangement-20261102.json`, `input/Tiktok/transcriptions-20261102/`.
- Registre : `TF-2053` ; décisions `D-120`, `D-121`, `D-125`, `D-126` à `decisions/REGISTRE.jsonl`.
