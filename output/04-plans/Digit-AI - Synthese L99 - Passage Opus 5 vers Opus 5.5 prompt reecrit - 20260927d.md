---
destinataire: humain
---

# Synthèse L99 — le prompt « étude d'opportunités après le passage d'Opus 5 à Opus 5.5 » est analysé et réécrit ; il vous reste à valider la lecture de votre intention et 10 écarts, puis à dire si l'étude se lance (27/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en 8 couches est déposée, elle passe les contrôles de lisibilité, d'écriture, de sources et d'accès, et le prompt réécrit est prêt à l'emploi. Ce qu'elle change pour vous : votre prompt préparait un passage au nouveau modèle qui est déjà fait. Depuis le 22 septembre au soir, vos sessions tournent sur Opus 5.5, parce que votre réglage appelle toujours le dernier Opus, et elles tournent au niveau de réflexion le plus élevé, alors que l'éditeur recommande de partir du niveau moyen. Des différences publiées, celles de l'interface de programmation ne touchent pas la Factory, qui ne l'appelle jamais directement ; ce qui la touche, ce sont le niveau de réflexion, les prix (la relecture du contexte, qui domine vos volumes, coûte 60 % de moins ; source : page des prix de l'éditeur, lue ce jour) et la place du modèle dans votre table de routage, restée figée sur la génération précédente. Le prompt réécrit fait donc mesurer l'état réel sur vos propres journaux avant d'écrire, et interdit de rien modifier pendant l'étude. Ce qui est attendu de vous : valider la lecture de votre intention et les 10 écarts à la lettre, dire si l'étude se lance maintenant, si les 2 fichiers du tour s'enregistrent localement, et si 3 constats faits en passant entrent au registre.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation du noyau (« Améliore ce prompt » est un appel de skill) ; analyse complète en 8 couches, prompt réécrit, contrat de sortie de 12 critères, 10 écarts à la lettre, protocole de tests ; mesures en lecture seule des prémisses du prompt.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit (2 fichiers) ; lectures seules : `gabarits\ETUDE-OPPORTUNITE.md`, `CONTRAT-INTERFACE.md` §4 et §4 bis, `BOUCLE-AMELIORATION.md`, `.claude\hooks-journal.jsonl`, les journaux de session du pilot (champs d'usage seulement), `~/.claude/settings.json`, le code des 15 dépôts `digit-ai-*`, 7 pages de documentation officielle.
- **quand** — 2026-09-27, fin à 19:06 heure de Paris (UTC+02:00) ; première mesure d'horloge du tour à 18:38 (16:38 UTC), prise après les lectures de cadrage ; durée mesurée ≥ 28 min.
- **qui** — session de pilotage Claude Opus 5.5 (contexte 1M), effort `max` par variable d'environnement ; pilot passé de `55087f79` à `13f2ea00` pendant le tour, par une autre session ; aucune délégation, escalade de modèle : aucune ; oracles joués sur l'analyse : `run-oracles.mjs` du socle qualité, `check_markdown.py`, `oracle-premisse-acces.mjs`, `oracle-ecriture.mjs` ; `oracle-synthese` sur ce document.
- **intention** — obtenir un prompt qui fasse produire une étude utile pour décider ce que le nouveau modèle doit changer dans la Factory, et pas seulement un prompt mieux tourné. **Test rétro** : le prompt réécrit sert cette intention par l'état réel mesuré avant d'écrire, des différences sourcées et triées selon qu'elles touchent la Factory, et un objet borné par la mesure ; il ne la sert pas encore sur 2 points : la lecture de fond de votre intention est reconstruite par moi et attend votre validation, et le score de 88 reste une projection tant que l'étude n'a pas été jouée.

## 2. Verdict en une ligne

**Prompt d'origine 24/100 → prompt réécrit 88/100 (projeté) ; 19 défauts inventoriés dont 2 bloquants, tous rattachés au changelog ; 10 écarts à la lettre soumis un à un ; prémisses mesurées le 27/09 : 6 pages officielles en 200, bascule Opus 5 → Opus 5.5 le 22/09 entre 19:01 et 19:37 UTC avec un effort passé de `high` à `max`, 0 appel direct à l'interface de programmation dans le code des 15 dépôts ; oracles de l'analyse : 4 sur 4 PASS ; 2 fichiers écrits, 0 enregistrement git.**

## 3. Décisions attendues de l'humain

4 décisions, dans l'ordre où elles se prennent. Chacune se lit de haut en bas : la question, son sujet, la recommandation et sa source, puis un tableau dont chaque ligne est une option, avec ce qu'elle coûte en deuxième colonne et ce qu'elle exclut en troisième, et enfin l'option qui s'applique si rien n'est décidé.

> **D-1 — La lecture reconstruite de votre intention et les 10 écarts à la lettre du prompt réécrit sont-ils validés ?**
>
> Le prompt réécrit garde votre demande d'étude d'opportunités sur le passage d'Opus 5 à Opus 5.5, mais s'en écarte à 10 endroits listés au bloc 6. 3 changent le périmètre : il élargit l'examen à toute la table de routage (Fable 5.1, Sonnet 5, Haiku 4.5), il restreint la « revue globale » aux seuls mécanismes qu'une différence touche et qu'une mesure relie à un goulot constaté, et il interdit d'exécuter pendant l'étude le rejeu comparatif, qui consomme des jetons. L'intention de fond que j'ai reconstruite, faire le même travail plus vite, avec moins de jetons et moins de reprises, n'est pas écrite dans vos mots : c'est à vous de la valider.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (une intention reconstruite est validée par son auteur avant d'exécuter) et `gabarits\ETUDE-OPPORTUNITE.md` (verdict unique, intention citée). Chaque écart ferme un défaut nommé de l'analyse, et aucun ne retire un de vos 5 axes.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** valider la lecture et les 10 écarts tels quels | rien de plus pour ce prompt | exclut une étude limitée au seul couple Opus 5 et Opus 5.5 |
| **(b)** valider avec amendements, en répondant « D-1 (b) sauf écart n° 3 » par exemple | effort simple × court : le prompt est réédité sur les écarts refusés et ses contrôles rejoués | exclut un lancement dans ce tour |
| **(c)** ne pas retenir le prompt réécrit | effort nul | exclut le bénéfice de l'analyse : le prompt d'origine reste à 24 sur 100, avec ses 2 défauts bloquants |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, aucune étude n'est lancée.

> **D-2 — L'étude elle-même se lance-t-elle maintenant, et dans quelle session ?**
>
> Une fois le prompt validé, l'étude peut être jouée dans cette session, qui a déjà relevé l'état réel et reste chargée d'un long contexte, ou dans une session neuve ouverte dans `c:\dev\digit-ai-factory`, plus légère à relire à chaque réponse mais qui refera ses relevés. L'étude se remet quand `oracle-etude-opportunite.mjs` rend PASS. Dans les 2 cas, l'étude n'écrit qu'un fichier, ne modifie aucun réglage et ne lance aucun rejeu payant.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, loi n° 5 (« la voie automatisée est le défaut ; l'action laissée à l'humain se justifie ») : l'option (a) ne vous demande aucun geste. Son coût, un contexte déjà long relu à chaque réponse, est mesuré par l'analyse et reste inférieur au prix d'un aller-retour.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** maintenant, dans cette session | effort complexe × moyen, aucun geste de votre part | exclut un regard entièrement neuf sur le sujet |
| **(b)** maintenant, dans une session neuve du pilot | effort complexe × moyen, plus un geste simple × court de votre part | exclut la réutilisation des relevés de ce tour |
| **(c)** plus tard | effort nul aujourd'hui | exclut toute mesure de l'effort `max` avant la prochaine revue |

Comment faire (b) : 1) ouvrir une session Claude Code dans `c:\dev\digit-ai-factory` ; 2) coller le prompt réécrit affiché sous cette restitution ; 3) vérifier que la session ouvre par l'ÉTAPE 0 et relève le modèle, l'effort et la date de bascule.

> **Si rien n'est décidé** : l'option (c) s'applique — aucune étude n'est jouée.

> **D-3 — Les 2 fichiers de ce tour s'enregistrent-ils localement dans le dépôt du pilot ?**
>
> Ce tour a écrit l'analyse `output\03-etudes\20260927-L99-saut-opus-5-vers-opus-5-5.md` et cette synthèse, et l'index du dossier des études s'est régénéré de lui-même. Le noyau du pilot demande un historique local dès la naissance d'un travail ; vos instructions personnelles demandent une autorisation explicite avant tout enregistrement git. Je n'ai donc rien enregistré. Une autre session a enregistré 2 fois dans le pilot pendant ce tour : l'enregistrement ne prendrait que les chemins de ce tour.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain ») et vos instructions de profil (un enregistrement git exige votre autorisation explicite). Un enregistrement local est réversible et ne publie rien.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** enregistrer localement les seuls chemins de ce tour, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : les 2 fichiers restent non suivis, exposés à la prochaine synchronisation |

> **Si rien n'est décidé** : l'option (b) s'applique — les fichiers restent sur disque, non enregistrés.

> **D-4 — Les 3 constats faits en passant entrent-ils au registre des améliorations comme candidats ?**
>
> En mesurant les prémisses, l'analyse a fait 3 constats sur la Factory elle-même, sans rapport avec la rédaction du prompt : la table de routage du contrat d'interface nomme encore Opus 5 et Fable 5, épinglée le 10 août ; sa règle de re-test ne joue qu'au changement de famille de modèles, si bien que les 2 sauts de septembre ne l'ont pas déclenchée ; et l'effort de réflexion est forcé au maximum pour toutes les sessions par une variable d'environnement, sans mesure consignée.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` et `CLAUDE.md` du pilot (« tout entre en candidat », décision humaine ensuite ; loi n° 3, l'oubli n'existe pas). Un candidat n'engage rien, et l'étude les instruira de toute façon.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** les consigner maintenant en 3 candidats | effort simple × court | exclut leur perte si l'étude ne se fait pas |
| **(b)** les laisser à la seule étude | effort nul aujourd'hui | exclut leur suivi au registre tant que l'étude n'est pas jouée |
| **(c)** ne rien consigner | effort nul | exclut toute trace hors de l'analyse |

> **Si rien n'est décidé** : l'option (b) s'applique — les constats vivent dans l'analyse seulement.

## 4. Traité — avec sa preuve

- **L'analyse en 8 couches est déposée et jugée** : étalon noté, chaîne logique (2 sauts, 4 collisions), inventaire de 19 défauts (2 bloquants, 13 majeurs, 4 mineurs), factcheck de 9 prémisses et de 6 familles d'accès, 5 causes d'échec, 3 attaques et lentille de robustesse, implications d'échelle, prompt réécrit, contrat de 12 critères, 10 écarts à la lettre, protocole de tests, changelog.
  - preuve : `output\03-etudes\20260927-L99-saut-opus-5-vers-opus-5-5.md` ; `run-oracles.mjs` (profil digit-ai, niveau note) → « CONFORME — 5 PASS, 4 SKIP, 0 échec » ; `check_markdown.py` → « Verdict : PASS », exit 0 ; `oracle-premisse-acces.mjs` → PASS, 5 prémisses d'accès contrôlées ; `oracle-ecriture.mjs` → PASS.
- **Le contrôle qualité de votre profil a d'abord refusé l'analyse, et c'est corrigé, du rouge au vert, sur 3 classes de défaut** : des chiffres sans source collée, une phrase qu'un retour à la ligne faisait commencer par « décision : », lue comme une décision sans décideur, et des valeurs écrites en lettres.
  - preuve : hook `qo-gate-write.mjs` → FAIL à la première écriture (19 constats de traçabilité des chiffres, 2 d'autorité), puis vert après ajout des sources : `oracle-claims.mjs` → PASS, `oracle-autorite-decision.mjs` → SKIP (aucun bloc de décision) ; `oracle-ecriture.mjs` → FAIL sur 12 valeurs écrites en lettres (règle E-14 d'écriture : une valeur s'écrit en chiffres), puis PASS après conversion.
- **Les prémisses sont mesurées, pas supposées** : 6 pages officielles en 200 le 2026-09-27 à 16:44:33 UTC, page des prix lue ; réglages relevés (`"model": "opus[1m]"`, `modelSettings` à `xhigh`, `CLAUDE_CODE_EFFORT_LEVEL=max`) ; journaux du pilot agrégés (source : calcul du 27/09/2026, 6 539 réponses dédoublonnées sur 14 283 lignes) ; recherche d'appels directs à l'interface de programmation dans le code des 15 dépôts : 1 seul fichier, une fixture de test.
  - preuve : chapitre 4 de l'analyse ; commandes rappelées au bloc 9.
- **Le score est mesuré dimension par dimension** : 24/100 avant (clarté 9/20, spécification 4/20, garde-fous 1/15, ancrage 5/15, vérifiabilité 2/15, robustesse 3/15), 88/100 projeté après.
  - preuve : tableaux « Notation » du chapitre 1 et « Score avant → après » du chapitre 8 de l'analyse.

## 5. Non traité — avec son motif

- L'étude elle-même — motif : dépendance à une décision humaine (D-1, D-2) ; vous avez demandé d'améliorer un prompt, pas de l'exécuter, et la loi n° 7 interdit de jouer un travail sur une intention reconstruite non validée.
- L'enregistrement local des fichiers du tour — motif : dépendance à une décision humaine (D-3).
- L'entrée au registre des 3 constats faits en passant — motif : dépendance à une décision humaine (D-4).
- La lecture des pages « What's new in Claude Opus 5.5 » et « Prompting Claude Opus 5.5 » — motif : hors mandat ; leur accès est mesuré (200), leur contenu appartient à l'étude, qui doit les citer datées.
- Les journaux de session des forges et des produits (23 autres dossiers de projets) — motif : hors mandat ; seuls ceux du pilot ont servi à qualifier la prémisse, et l'étude dira s'il faut élargir.
- Le fichier du registre d'héritage modifié dans l'arbre de travail — motif : hors mandat ; il n'a pas été écrit par ce tour et n'a pas été touché.

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prrompt : … » → **j'ai fait** l'analyse complète en 8 couches avec prompt réécrit, et non une simple reformulation → **pourquoi** : le lexique d'invocation du noyau fait de ces mots un appel du skill `prompt-analyzer-l99`, dont c'est le livrable.
- **Vous n'avez pas demandé de mesures** → **j'ai mesuré** en lecture seule la documentation officielle, vos réglages, les journaux de session du pilot et le code du parc, sans rien y écrire → **pourquoi** : l'analyse doit mesurer une prémisse d'accès avant de la classer, et ces mesures ont renversé la prémisse principale du prompt (le passage est déjà fait).
- **Les 10 écarts entre votre prompt et le prompt réécrit**, à valider un par un par D-1 ; le numéro est celui du tableau du chapitre 8.6 de l'analyse :

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « Par rapport aux différences entre Opus 5 et Opus 5.5 » | les différences de la documentation officielle du jour, datées, rangées en 3 familles | une différence non datée ou sans prise sur la Factory ferait une étude hors sujet |
| 2 | (implicite : un passage à préparer) | la revue d'un passage fait le 22/09, mesurée sur l'état réel | le passage est en service depuis 5 jours |
| 3 | « Opus 5 et Opus 5.5 » | le cœur Opus 5 → Opus 5.5, plus toute la table de routage | élargissement : la documentation déplace les frontières de la table ; refusez-le si vous visez Opus seul |
| 4 | « revoir le fonctionnement global de la Factory et des forges » | les seuls mécanismes touchés par une différence ET reliés à un goulot mesuré | restriction : une revue globale ne se tranche pas en une option |
| 5 | « améliorer son fonctionnement, ses process, ses performances, sa qualité et sa rapidité » | 5 axes gardés, chacun avec une métrique et une source | sans métrique, un axe ne se mesure pas et 2 axes comptent le même gain |
| 6 | « une étude d'opportunités » | une carte des opportunités, des options en paquets, une seule retenue | le gabarit d'étude exige un verdict unique |
| 7 | « construis » | « produis une étude » : un seul fichier écrit, rien d'autre modifié | une étude s'arrête avant la décision ; vos instructions de profil le demandent |
| 8 | (rien) | le rejeu comparatif écrit en plan, non exécuté | restriction : c'est une dépense soumise à votre feu vert |
| 9 | (rien) | sections « Biais d'auto-évaluation » et « Répétabilité » | ajout : l'exécutant est le modèle évalué ; 2 changements de modèle en 3 semaines |
| 10 | (rien) | intention reconstruite, à valider | une intention reconstruite se valide par son auteur |

## 7. Risques

- L'étude jouée dans cette session hérite d'un contexte déjà long et de l'effort `max`, et coûte plus de jetons et de temps qu'une session neuve ;
  - signal : la restitution de l'étude affiche une durée supérieure à celle de ce tour ;
  - parade : l'option (b) de D-2 ; à défaut, coût accepté contre l'économie d'un geste humain.
- Une session concurrente modifie le pilot pendant l'étude ;
  - signal : la tête du pilot bouge entre le début et la fin de l'étude, comme pendant ce tour ;
  - parade : le prompt réécrit interdit toute écriture hors du livrable et en fait un critère de remise.
- L'effort ou le modèle change pendant la période mesurée, et les périodes ne se comparent plus ;
  - signal : la variable d'effort ou les réglages par modèle diffèrent entre le début et la fin de l'étude ;
  - parade : le prompt exige le relevé des réglages au début et leur empreinte identique à la fin.
- La documentation de l'éditeur change sans prévenir ;
  - signal : un chiffre cité ne correspond plus à la page ;
  - parade : chaque lecture est datée dans l'étude.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, dans l'ordre des décisions qu'elles attendent ; puis l'action humaine qui les débloque toutes.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Rééditer le prompt réécrit sur les écarts refusés, rejouer les 4 contrôles de l'analyse, redéposer une synthèse (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (b) | simple × court | le prompt reste tel qu'il est au chapitre 8 de l'analyse |
| A-2 | Jouer l'étude avec le prompt réécrit jusqu'à `oracle-etude-opportunite.mjs` PASS et les 12 critères tenus (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (a) et D-2 (a) | complexe × moyen | aucune étude n'est produite, et l'effort reste au maximum sans mesure |
| A-3 | Enregistrer localement les seuls chemins de ce tour (l'analyse, cette synthèse, l'index du dossier des études), sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-3 (a) | simple × court | les 2 fichiers restent non suivis dans l'arbre de travail |
| A-4 | Consigner les 3 constats en candidats par `node todo\journaliser.mjs --fichier <evenements.json>` (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 (a) | simple × court | les constats ne vivent que dans l'analyse |
| A-5 | Trancher D-1 à D-4 en répondant par exemple « D-1 (a), D-2 (a), D-3 (a), D-4 (a) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — une intention reconstruite, un enregistrement git et une écriture au registre attendent votre autorisation | simple × court | rien n'est lancé ni enregistré, et le prompt d'origine reste à 24 sur 100 |

## 9. Traces

- Analyse : `output\03-etudes\20260927-L99-saut-opus-5-vers-opus-5-5.md` (prompt réécrit au chapitre 8.3).
- Cette synthèse : `output\04-plans\Digit-AI - Synthese L99 - Passage Opus 5 vers Opus 5.5 prompt reecrit - 20260927d.md`.
- Journaux d'oracles : `.oracles\output\03-etudes\20260927-L99-saut-opus-5-vers-opus-5-5.md.oracles.json` et son historique.
- Mesures : `curl -s -L -o /dev/null -w '%{http_code}'` sur 6 pages officielles (16:44:33 UTC) ; agrégation des journaux de session par script, champs `type`, `timestamp`, `effort`, `message.id`, `message.model`, `message.usage` (16:53 UTC) ; recherche d'appels directs à l'interface de programmation dans le code des 15 dépôts `digit-ai-*`.
- Git : aucun enregistrement dans ce tour ; pilot à `13f2ea00`, tête déplacée pendant le tour par une autre session.
- Aucune page HTML livrée dans ce tour.
