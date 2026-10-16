---
destinataire: humain
---

# Synthèse d'étude — « plan d'amélioration après audit, rendu en page HTML » : l'étude d'opportunité est livrée en Markdown et en page HTML, son verdict est un skill outillé chez forge-agents extrait de la première mission ; il vous reste à retenir ou non ce verdict et à dire si les candidatures entrent au registre (19/09/2026)

L'étude d'opportunité que vous avez demandée est écrite, jugée conforme par son oracle, et remise aussi en page HTML autoportante. Ce qu'elle établit : il ne faut ni forge nouvelle, ni extension de forge-audit. Ce qui manque à la Factory tient en un seul skill à trois gestes que personne ne sait faire aujourd'hui — joindre un plan d'amélioration aux actions de remédiation d'un audit, juger ce plan contre un contrat, et le rendre en page HTML complète. Ce skill vivrait chez forge-agents, là où vivent déjà les skills transverses et le socle de page ; forge-audit, forge-design et le pilot recevraient chacun un lot léger ; les autres forges ne changeraient pas et fourniraient seulement des mesures. Un point d'ordre compte : le skill doit s'extraire de la première mission réelle, jouée à la main avec le prompt réécrit ce matin, et non la précéder. Rien n'est enregistré dans git ni publié, et rien n'a été écrit hors du pilot. Ce qui est attendu de vous : retenir ou corriger ce verdict et la lecture de votre intention, dire si les candidatures entrent au registre maintenant, et dire si les fichiers s'enregistrent localement.

## 1. En-tête d'identification

- **quoi** — étude d'opportunité au gabarit `gabarits\ETUDE-OPPORTUNITE.md`, sur la capacité « axes d'amélioration d'une application après un audit, livrable HTML complet », avec identification des forges impliquées ; rendu de l'étude en page HTML sur le socle `digit-ai-page-html` ; critique d'implémentation de la page.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit (l'étude, sa page, cette synthèse) ; lectures seules sur forge-audit, forge-agents, forge-conception, forge-design, sur les skills installés et sur sept sources externes.
- **quand** — 2026-09-19 13:22 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour à 12:58 ; durée mesurée ≥ 24 min.
- **qui** — session Fable 5.1 sur le pilot local `1514d3e4` ; une délégation : un sous-agent Explore en lecture seule pour le relevé de l'existant (49 lectures, aucune écriture ; escalade : aucune), dont chaque citation employée a été revérifiée par la session ; oracles joués : `oracle-etude-opportunite`, `check_markdown.py`, `check_html.py`, `render_page.py` (six largeurs, puis matrice d'états), `oracle-filtres-tableau`, parité des composants embarqués, six oracles de forge-design et `oracle-a11y`, puis `oracle-synthese` sur ce document.

## 2. Verdict en une ligne

**Étude `oracle-etude-opportunite` PASS 10/10, de la règle E1 (sections du gabarit présentes) à la règle E10 (test rétro présent), option retenue O2 (un skill outillé chez forge-agents, un contrat de données avec forge-audit, un amendement du run de conseil), 23 pièces de l'existant citées, 7 sources datées dont 5 de moins de 24 mois ; `check_markdown.py` PASS ; page HTML : `check_html.py` PASS sur 40 règles, `render_page.py` PASS à 6 largeurs de 390 à 3840 px, matrice d'états PASS, `oracle-filtres-tableau` PASS, parité 2 composants sur 2 ; critique de forge-design : `oracle-tokens` FAIL avec 22 écarts, tous dans les fichiers du socle embarqués, 0 dans la feuille propre à la page ; 3 fichiers écrits dans le pilot, 0 enregistrement git, 0 push.**

## 3. Décisions attendues de l'humain

Trois décisions. La décision du tour précédent sur le lancement de la mission avec le prompt réécrit reste ouverte ; elle est rappelée au bloc 8 et n'est pas reposée ici.

Comment lire les tableaux de ce bloc : chaque décision porte le sien, une ligne par option, l'option recommandée en premier ; la colonne du milieu dit ce que l'option coûte en complexité et en durée, la dernière ce qu'elle ferme si on la retient ; la ligne « si rien n'est décidé », sous le tableau, nomme l'option qui s'applique par défaut.

> **D-3 — Le verdict de l'étude est-il retenu, avec la lecture que j'ai faite de votre intention ?**
>
> L'étude conclut qu'un skill outillé, de nom de travail « plan d'amélioration », doit naître chez forge-agents avec trois gestes — joindre, juger, rendre — et qu'il doit être extrait de la première mission réelle plutôt que construit avant elle. Elle lit votre mot « global » comme « indépendant du produit et de la source de l'audit », et votre « au format HTML » comme le livrable que le skill produira, l'étude étant remise en page elle aussi. Cette lecture est la mienne : elle n'est pas dans vos mots.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` règle 31 (« il naît exercé : oracle ou self-test à double sens dès la v0 ») et l'analyse du matin, chapitre 7 (« à décider après ce premier run et sur gains constatés, pas avant »). Construire avant la mission figerait treize domaines et dix champs que personne n'a éprouvés.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** retenir le verdict tel quel : la mission d'abord, l'extraction du skill ensuite | effort complexe × moyen, étalé après la mission | exclut un skill disponible pour cette première mission : elle se joue avec le prompt réécrit |
| **(b)** retenir le verdict mais construire le skill avant la mission | effort complexe × moyen, tout de suite | exclut des fixtures réelles à la naissance : l'oracle du skill naîtrait sur des cas inventés |
| **(c)** ne retenir que la méthode, écrite en référentiel au pilot, sans skill | effort simple × court | exclut la jonction, le jugement et le rendu outillés : le contrat se vérifierait à la main à chaque mission |

> **Si rien n'est décidé** : l'étude reste instruite et non décidée — aucun lot n'est ouvert chez aucune forge.

> **D-4 — Les candidatures et les constats en passant entrent-ils au registre maintenant ?**
>
> L'étude nomme quatre lots (le skill chez forge-agents avec quatre fiches d'expert manquantes, le contrat de données chez forge-audit, la critique du gabarit chez forge-design, l'amendement du run de conseil au pilot). Le tour a aussi relevé trois constats en passant : le socle de page échoue au contrôle des jetons de forge-design sur ses propres fichiers embarqués ; le hook de lexique s'est déclenché sur une notification automatique de fin de sous-agent parce qu'elle contenait le nom du skill ; la fiche du pilot sur forge-audit annonce 17 dimensions et 162 contrôles quand le dépôt en porte 18 et 184. Je n'ai rien déposé : vous aviez demandé une étude, pas une entrée au registre.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine ») et le noyau du pilot, garde-fous (« constat en passant → candidat »). Entrer en candidat n'engage aucun travail.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** déposer et ingérer les quatre candidatures et les trois constats, en candidat | effort simple × court | exclut toute exécution : chaque item attend sa propre décision |
| **(b)** déposer les trois constats seulement | effort simple × court | exclut la trace des lots tant que D-3 n'est pas tranchée |
| **(c)** ne rien déposer | effort nul | exclut la mémoire des trois constats : ils ne vivent que dans cette synthèse |

> **Si rien n'est décidé** : l'option (c) s'applique — rien n'entre au registre.

> **D-2 — Les fichiers de cette session s'enregistrent-ils localement dans le dépôt du pilot ?**
>
> La question du tour précédent porte maintenant sur cinq fichiers : l'analyse du matin et sa synthèse, l'étude, sa page HTML et cette synthèse, plus les index de dossiers régénérés. Le noyau demande un historique local dès la naissance d'un travail ; vos instructions personnelles réservent tout enregistrement git à votre autorisation. Je n'ai donc rien enregistré.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain ») et vos instructions de profil sur les actions à autorisation explicite. Un enregistrement local est réversible et ne publie rien.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** enregistrer localement les seuls chemins de cette session, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : cinq fichiers restent non suivis, exposés à la prochaine synchronisation du dépôt |

> **Si rien n'est décidé** : l'option (b) s'applique — les fichiers restent sur disque, non enregistrés.

## 4. Traité — avec sa preuve

- **L'étude d'opportunité est écrite et jugée** : seuil, intention citée, entrants, sept partitions, 23 lignes de non-recouvrement toutes citées, 7 sources datées, cinq options, verdict unique O2, porteurs, séquencement, revue au 2026-10-19, test rétro.
  - preuve : `output\03-etudes\20260919-etude-opportunite-plan-d-amelioration-post-audit.md` ; `node oracles\oracle-etude-opportunite.mjs` → verdict PASS, dix règles sur dix ; `check_markdown.py` → « Verdict : PASS ».
- **Les forges impliquées sont identifiées, avec le fait qui désigne chacune** : forge-agents (18 skills transverses relevés dans son dossier de skills, dont le socle de page et le registre des oracles), forge-audit (schéma d'actions existant, `core\schemas\remediation-actions.schema.json`), forge-design (critique du gabarit), le pilot (run de conseil) ; six forges mobilisées à l'exécution sans modification.
  - preuve : tableau des porteurs, chapitre « Verdict » de l'étude ; sorties de `ls` sur les dossiers de skills de forge-agents, forge-conception, forge-design, forge-audit et forge-data.
- **L'antériorité au registre est cherchée par nom et par structure** : par nom, six motifs (« plan d'amélioration », « post-audit », « après un audit », « forge-consulting », « run de conseil », « trajectoire ») ; par structure, les champs de forge cible et de classe du registre. Deux items trouvés par nom, 14 par structure, aucun dont le titre porte sur le sujet.
  - preuve : sortie du script de recherche sur `todo\TODO.jsonl` (« 2 items ») et relevé du sous-agent (14 items visant forge-audit, listés avec leur identifiant).
- **La page HTML de l'étude est produite sur le socle et jugée** : sommaire permanent, tableau de 23 lignes filtrable avec recherche câblée, bande de sommaire repliable sous 900 px, bascule de thème.
  - preuve : `check_html.py` → PASS, 40 règles, empreinte 695359b17ff5 ; `render_page.py` → PASS à 3840, 2560, 1920, 1280, 768 et 390 px ; `--matrice-etats` → PASS ; `oracle-filtres-tableau` → PASS ; `embarquer-composants.mjs --constat` → « 2 copie(s) à la parité de leur source ».
- **Cinq corrections de la page, chacune avec son contrôle passé du rouge au vert** : recherche statique absente (`check_html` L13) ; terme de jargon non glosé (`check_html` L30, retiré de la source) ; lignes de prose à plus de 100 caractères à 2560 et 3840 px (`render_page` V18, classe « mesure de lecture hors conteneur ») ; sommaire perdu au défilement à 768 et 390 px (`render_page`, famille sommaire perdu) ; tableau filtrable non initialisé par son nom (`oracle-filtres-tableau` G3).
  - preuve : sorties successives des trois oracles dans ce tour, FAIL puis PASS.
- **La critique d'implémentation de forge-design est jouée, en mode dégradé déclaré** (aucun artefact de design de run : la promesse est la charte du socle). Trois défauts de ma feuille corrigés (bandeaux latéraux de 3 px, espacements hors échelle de 4, anneau de focus hors jeton — `oracle-slop` S1 et S6, `oracle-tokens` T3 et T8, du rouge au vert pour la feuille de la page).
  - preuve : `oracle-taste` PASS, `oracle-declencheurs` PASS, `oracle-textes-application` PASS, `oracle-a11y` PASS ; `oracle-tokens` FAIL — 22 écarts, 0 hors des fichiers du socle (filtre exécuté sur les sélecteurs) ; `oracle-slop` FAIL — 1 écart, une couleur pure dans la feuille du composant de filtres.
- **Une affirmation de l'analyse du matin est rectifiée dans l'étude** : le fichier d'actions de forge-audit porte bien un champ d'effort, facultatif.
  - preuve : `core\schemas\remediation-actions.schema.json` ligne 31, relue par la session.

## 5. Non traité — avec son motif

- Les 22 écarts de jetons et la couleur pure restants sur la page — motif : bloqué par un garde-fou ; ils vivent dans le gabarit et le composant de filtres du socle, embarqués à parité d'octets, et corriger la copie casserait la parité que le socle exige ; le remède appartient à forge-agents (constat proposé à D-4).
- Le dépôt des candidatures et des trois constats — motif : dépendance à une décision humaine (D-4).
- La validation de la lecture de votre intention — motif : dépendance à une décision humaine (D-3) ; l'étude la déclare « reconstruite, non encore validée ».
- L'enregistrement local — motif : dépendance à une décision humaine (D-2).
- Le générateur de la page (un script d'environ 230 lignes) reste dans le dossier temporaire de la session — motif : hors mandat ; verser un outil neuf dans le pilot n'était pas demandé, et le geste « rendre » du skill le remplacerait.
- La lecture à la source de deux références externes (OWASP ASVS 5.0.0, article ACM EASE 2025, ce dernier refusé par le serveur) — motif : impossible à prouver ici ; l'étude les marque « relayées » et aucune ne fonde seule le verdict.

## 6. Écarts à la lettre

- **Vous avez écrit** « pour fournir un livrable complet au format HTML » → **j'ai fait** les deux lectures : l'étude définit le livrable HTML que le skill produira (huit chapitres), et elle est elle-même remise en page HTML → **pourquoi** : la phrase admet les deux sens, et servir les deux coûtait moins qu'un aller-retour.
- **Vous avez écrit** « Identifie le ou les forges impliquées » → **j'ai distingué** quatre porteurs qui reçoivent un lot et six forges mobilisées sans modification → **pourquoi** : « impliquées pour la mise en place » et « sollicitées à l'exécution » ne demandent pas le même mandat.
- **Vous avez écrit** « ce skill global » → **l'étude conclut** à un skill, mais né avec un seul adaptateur (forge-audit) et après la première mission → **pourquoi** : la règle 31 veut un objet né exercé ; promettre cinq adaptateurs non éprouvés aurait servi le mot, pas l'intention.
- **Le hook de lexique a demandé** de relancer l'analyse de prompt sur une notification automatique → **je ne l'ai pas fait** → **pourquoi** : ce n'était pas un message de votre part ; le fait est proposé en constat à D-4.
- Le nom du produit reste absent des trois fichiers, comme au tour précédent.

Intention : « Crée maintenant une étude d'opportunité sur ce sujet d'axes d'amélioration d'une application après un audit pour fournir un livrable complet au format HTML. Identifie le ou les forges impliquées pour la mise en place de ce skill global. » — reconstruite pour le fond : faire de l'enchaînement audit puis amélioration une capacité répétable, et savoir qui mandater.

Test rétro : le tableau des porteurs et le séquencement servent « savoir qui mandater, et dans quel ordre » ; la définition du livrable en huit chapitres sert « un livrable complet » ; ce qui ne sert pas encore l'intention : « global » n'est tenu qu'à moitié (un seul adaptateur à la naissance), et la page remise garde 22 écarts de jetons hérités du socle.

## 7. Risques

- Le skill est construit avant la mission, sur des cas inventés ;
  - signal : un oracle du skill dont toutes les fixtures sont synthétiques ;
  - parade : D-3 (a), et la règle 31 qui exige un objet né exercé.
- La première mission n'a pas lieu avant le 2026-10-01, date de revue de l'étude « conseil » du 19/08, qui requalifierait alors le run de conseil vers le report ;
  - signal : aucun ledger de run de conseil à cette date ;
  - parade : la décision du tour précédent sur le lancement de la mission ; la revue de la présente étude est fixée au 2026-10-19.
- La page HTML ne peut plus être régénérée si le dossier temporaire de la session disparaît ;
  - signal : une correction de l'étude en Markdown qui ne se reflète pas dans la page ;
  - parade : le Markdown fait foi et la page le dit en pied ; le générateur se réécrit, et le geste « rendre » du skill le remplace à terme.
- Les écarts de jetons du socle se propagent à toute page qui embarque ses composants ;
  - signal : le même FAIL de `oracle-tokens` sur une autre page du parc ;
  - parade : constat proposé à D-4 ; acceptation déclarée pour cette page.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, celle qui attend D-4 avant celle qui attend D-2 ; puis les actions humaines dans l'ordre des décisions, le lancement de la mission en dernier parce que tout le séquencement du verdict en dépend.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Déposer sous `input\01-candidatures\` et ingérer par `todo\ingerer-lot.mjs` les quatre candidatures et les trois constats, régénérer les vues, rejouer `oracle-todo` (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 | simple × court | les lots et les constats ne vivent que dans cette synthèse |
| A-2 | Enregistrer localement les seuls chemins de cette session, sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-2 (a) | simple × court | cinq fichiers restent non suivis |
| A-3 | Rééditer l'étude et régénérer sa page si vous corrigez la lecture de l'intention, rejouer les oracles (neuve) | auto_ia | `dependance_bloc_3` — attend D-3 | simple × court | l'étude reste sur une intention non validée |
| A-4 | Trancher D-3 — répondre « D-3 (a) », « D-3 (b) » ou « D-3 (c) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — une intention reconstruite se valide par son auteur (loi n° 7) | simple × court | aucun lot n'est ouvert chez aucune forge |
| A-5 | Trancher D-4 — répondre « D-4 (a) », « (b) » ou « (c) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — l'entrée au registre n'était pas dans votre demande | simple × court | rien n'entre au registre |
| A-6 | Trancher D-2 — répondre « D-2 (a) » ou « D-2 (b) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — vos instructions réservent l'enregistrement git à votre autorisation | simple × court | rien n'est enregistré |
| A-7 | Trancher la décision D-1 du tour précédent et lancer la mission : ouvrir une session Claude Code dans le dossier de la plateforme et y lancer le prompt réécrit ; preuve de clôture : la session rend ses cinq questions d'ouverture (neuve) | manuelle_utilisateur | `decision` — le lancement d'un run est un feu vert humain | simple × court | le skill n'a aucune mission dont s'extraire, et la revue du 2026-10-01 trouve un run de conseil jamais exercé |

## 9. Traces

- Étude : `output\03-etudes\20260919-etude-opportunite-plan-d-amelioration-post-audit.md`.
- Page HTML de l'étude : `output\03-etudes\20260919-etude-opportunite-plan-d-amelioration-post-audit.html` — verdict de la critique d'implémentation de forge-design du 19/09/2026 (mode dégradé, express) : FAIL sur `oracle-tokens` (22 écarts, tous dans les fichiers du socle embarqués à parité) et sur `oracle-slop` (1 écart, même origine) ; PASS sur `oracle-taste`, `oracle-declencheurs`, `oracle-textes-application`, `oracle-a11y` ; revue de lecture faite sur les captures à 1920 et 390 px, un constat corrigé (compte de lignes annoncé au sommaire).
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Etude - Plan d amelioration post-audit verdict O2 forges impliquees - 20260919c.md`.
- Analyse du matin, dite L99 (analyse de prompt en huit couches), et sa synthèse : `output\03-etudes\20260919-L99-audit-et-plan-d-amelioration-plateforme.md` ; `output\04-plans\Digit-AI - Synthese L99 - Audit et plan d amelioration plateforme prompt reecrit - 20260919b.md`.
- Captures de rendu et générateur de page : dossier temporaire de la session (hors dépôt).
- Git : aucun enregistrement dans ce tour ; pilot local `1514d3e4`.
