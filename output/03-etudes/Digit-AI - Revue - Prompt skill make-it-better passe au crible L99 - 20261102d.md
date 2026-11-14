---
role: analyse L99 en mode boucle de la demande de skill make-it-better et de page de versions
destinataire: humain
---

# Revue — prompt du skill make-it-better et de sa page de versions, passé au crible L99 — 02/11/2026

Prompt analysé, cité en entier : « On ne va pas utiliser les APIs, directement Claude Code dans l'abonnement, utilise Opus par défaut. Si besoin je demanderai Sonnet pour comparer. Construis un skill Make it better avec les conditions citées dans ta réponse. Ajoute une page de centralisation des versions, comme sur la vidéo, qui permet, dans un menu sur la gauche, de lister toutes les versions générées (et avec un commentaire sur ce qu'elle apporte par rapport aux versions précédentes, avec un filtre permettant de ne retenir que celles jugées pertinentes. On fera le test sur 5 ou 6 documents pour vérifier si cela a un intérêt ou non. »

---

## Chapitre 1 — Cadrage et étalon noté

L'intention est nette et le prompt d'origine la sert mal sur un point décisif : rien n'y dit comment conclure. Il perd l'essentiel de ses points sur la vérifiabilité et la robustesse, et 2 défauts bloquants plafonnent sa note.

**Observe.** 4 demandes : « directement Claude Code dans l'abonnement » avec « Opus par défaut », un skill « avec les conditions citées dans ta réponse », une page qui liste « toutes les versions générées » avec commentaire et filtre, un test « sur 5 ou 6 documents ».

**Orient.** L'objectif profond est une décision : savoir si l'itération longue vaut son coût sur vos pages de contenu. Le skill et la page sont les moyens de cette décision. L'auteur connaît la conversation, donc « les conditions citées » lui semblent évidentes ; un exécutant neuf ne les a pas.

**Decide.** 3 voies possibles :

- exécuter tel quel, au risque d'un outil joli qui ne permet pas de conclure ;
- séparer la construction du test, et fixer la conclusion avant de voir les résultats ;
- tester d'abord un seul document à la main, sans skill.

**Act.** La 2e voie, parce que « On fera le test » renvoie déjà le test à plus tard, et qu'une règle fixée après coup n'a aucune valeur.

**Étalon.** Le prompt idéal mesure d'abord que l'abonnement est bien la voie employée. Il rend ses conditions autonomes, sépare construction et test, garde l'aveugle malgré une page qui numérote, borne le quota, tient les versions hors des dépôts publics, et fixe d'avance la règle de conclusion.

Le tableau note le prompt d'origine ; une ligne vaut une dimension de la rubrique, dans l'ordre de la rubrique. Cette note est celle de l'auteur de l'analyse : le relecteur aveugle n'a noté que les versions réécrites.

| Dimension | Note | Justification |
|---|---|---|
| Clarté de l'intention (20) | 13 | « vérifier si cela a un intérêt ou non » donne le but, sans dire ce qui compterait comme un intérêt |
| Spécification (20) | 7 | La page est décrite, mais ni le format des documents, ni le nombre de tours, ni le lieu des versions |
| Garde-fous (15) | 4 | Seule limite posée : pas d'API |
| Ancrage (15) | 8 | Renvoi à la vidéo et à la réponse précédente, utiles dans cette conversation seulement |
| Vérifiabilité (15) | 3 | Aucun critère de réussite du skill ni du test |
| Robustesse (15) | 2 | Contradiction entre l'aveugle et la page numérotée, voir le Chapitre 3 |

**Note d'origine : 37 sur 100**, sous le plafond de 40 qu'impose tout défaut bloquant.

---

## Chapitre 2 — Enchaînement logique

La chaîne du prompt tient en 4 maillons, et elle casse au dernier.

- Si l'on passe par l'abonnement, alors il faut une session sans intervention, facturée sur l'abonnement. Le prompt suppose ce point sans le vérifier.
- Si l'on itère, alors il faut garder chaque version et son apport. La page y répond.
- Si l'on garde tout, alors il faut un filtre. Le prompt le demande, sans dire qui juge.
- Si l'on teste 5 ou 6 documents, alors on doit pouvoir conclure. **Rupture** : aucune règle ne relie les jugements à la conclusion.

2 consignes entrent aussi en collision. « Le modèle ne se note pas lui-même » et « juger à l'aveugle », parmi les conditions citées, contredisent un menu qui montre le numéro et le commentaire de chaque version.

---

## Chapitre 3 — Inventaire des défauts

Ce chapitre est la liste de référence : 2 défauts empêchaient de conclure, 11 dégradaient fortement le résultat. Elle se lit par numéro, du plus grave au plus léger, et chaque ligne porte sa sévérité ; le Chapitre 8 rattache chaque correction à un numéro.

| N° | Défaut | Sévérité |
|---|---|---|
| 1 | « vérifier si cela a un intérêt ou non » : aucune règle de conclusion, donc n'importe quel résultat se lit comme on veut | bloquant |
| 2 | L'aveugle, condition citée, contredit un menu qui montre numéro et commentaire | bloquant |
| 3 | « jugées pertinentes » : le juge n'est pas nommé | majeur |
| 4 | « dans l'abonnement » : aucune vérification, et l'option `--bare` exigerait une clé API | majeur |
| 5 | Le quota n'est pas borné : 5 ou 6 documents à 50 tours en Opus pèsent sur la fenêtre de 7 jours | majeur |
| 6 | « 5 ou 6 documents » : ni désignés, ni format connu | majeur |
| 7 | « les conditions citées dans ta réponse » : le prompt dépend de la conversation ; « 2 essais au moins » donnerait 10 à 12 essais | majeur |
| 8 | Lieu des versions non dit : le pilot et les forges sont publics, et des documents réels s'y publieraient | majeur |
| 9 | Nombre de tours absent du prompt, seulement évoqué au message précédent (« peut-être pas 100x mais 50x ») | majeur |
| 10 | « comme sur la vidéo » : le menu seul, ou aussi sa comparaison et sa courbe ? | majeur |
| 11 | Session de tour non isolée : hooks, skills et règles de la Factory peuvent la fausser ou la bloquer | majeur |
| 12 | Le commentaire sur l'apport est écrit par le modèle qui vient de modifier : il risque de se flatter | majeur |
| 13 | Rien sur une version cassée ou qui invente un fait : sert-elle de base au tour suivant ? | majeur |
| 14 | Parenthèse non refermée dans la phrase de la page | mineur |
| 15 | Nom du skill en anglais, quand les skills de la Factory sont surtout en français | mineur |

---

## Chapitre 4 — Prémisses vérifiées

Les 2 prémisses centrales tiennent, mais la plus évidente des options les aurait détruites : `--bare` isole bien une session, et elle exige justement une clé API.

Prémisse d'accès, « Claude Code dans l'abonnement » : mesurée le 02/11/2026 à 09:40 par `claude -p` en version 2.1.299, compte Windows `iguan`, poste Dell-XPS-16, authentification du poste.

- **Code de retour.** Exit 0, `is_error` faux, réponse « OK ».
- **Identité.** `apiKeySource` vaut `none` ; `ANTHROPIC_API_KEY` et `ANTHROPIC_AUTH_TOKEN` sont absentes, relevées par leur nom seul.
- **Contrôle positif.** La même identité sert `claude-opus-5-5` et émet `rate_limit_event` : fenêtre `seven_day`, `utilization` à 0,23, retour à zéro le 05/11/2026 à 08:00.
- **Familles d'accès.** Le tableau suivant les liste ; chaque ligne dit si la voie est essayée et ce qu'elle donne.

| Voie | État | Résultat |
|---|---|---|
| `claude -p` avec `--setting-sources ""` | essayée | Abonnement, 0 événement de hook |
| Même commande avec `--restricted` | essayée | Abonnement, lecture et écriture hors du dossier refusées |
| `--bare` | lue dans `claude --help`, non jouée | « Anthropic auth is strictly ANTHROPIC_API_KEY or apiKeyHelper via --settings (OAuth and keychain are never read) » : écartée |
| Agents de la session (outil Agent) | non essayée pour ce besoin | Ouverte, mais hérite des règles de la Factory |
| API avec clé | non essayée | Exclue par votre demande |

Un refus ne ferme qu'une porte : ici la voie utile est ouverte, et `--bare` n'est écartée que parce qu'elle changerait la facturation.

Les autres prémisses :

- **Confinement : vrai.** Sans `--restricted` comme avec, à 09:53, `Read` et `Write` vers un chemin absolu hors du dossier sont refusés, et le contenu piégé n'est pas lu.
- **Appel depuis Node : faux sous la forme simple.** `spawnSync("claude", …)` rend ENOENT sous Windows ; `claude.exe` du paquet fonctionne.
- **Dépôts publics : vrai.** `gh repo view` rend `PUBLIC` pour `digit-ai-factory` et `digit-ai-forge-agents`.
- **« comme sur la vidéo » : vrai pour le menu.** À 02:18, le menu liste chaque tour avec son coût, ses outils et ses lignes. La vidéo montre aussi les onglets Compare et Time-lapse et une courbe, qui font l'objet de D-122 *(décision sur la comparaison et la courbe)*.
- **Skill `make-it-better` : absent à ce jour.** Aucun dossier de ce nom dans `digit-ai-forge-agents`.

---

## Chapitre 5 — Causes d'échec les plus probables

Voici ce qui aurait le plus de chances de décevoir, de la cause la plus probable à la moins probable ; chaque cause prolonge un défaut du Chapitre 3.

1. **Un test qui ne conclut rien (n° 1).** Après plusieurs jours de quota, chaque résultat reste interprétable. La première règle écrite le montre : atteinte par hasard dans 48,5 % des cas sur 6 documents. Mitigation : une seule comparaison par document, 3 issues, et le risque écrit.
2. **Le quota de la semaine englouti (n° 5).** Au rythme de la vidéo, 8,5 h pour 100 tours en Opus, 6 documents à 50 tours prendraient environ 25 h, et votre travail courant partage cette fenêtre. Mitigation : pause à 0,80, premier document seul, prévision avant la suite.
3. **Un aveugle de façade (n° 2).** Le numéro, le titre ou l'adresse de l'aperçu trahissent la version, et votre préférence va au numéro le plus haut. Mitigation : lettres tirées au hasard, adresse neutre, contrôle en navigateur réel. L'origine reste reconnaissable, et le bilan le dit.
4. **Des faits inventés qui passent pour un progrès (n° 13).** C'est le constat de l'étude de la vidéo : avis, rareté, chiffres de vente. Mitigation : `oracle-faits-sources` *(contrôle des nombres, noms et citations neufs contre les sources)*, version rejetée sans servir de base. Une paraphrase fausse lui échappe, et le bilan le dit aussi.
5. **Des documents privés publiés (n° 8).** 300 versions d'un document réel partent dans un dépôt public au premier enregistrement. Mitigation : espace hors de tout dépôt, refus du lanceur, skill publié avec des fixtures fictives.

---

## Chapitre 6 — Attaques

3 lecteurs attaquent la direction prise, et leurs objections sont intégrées ou assumées.

**L'utilisateur exigeant.** « Je veux voir ce qui a changé, pas relire 50 versions. » Le commentaire et les mots ajoutés ou retirés répondent en partie. La comparaison côte à côte y répondrait mieux, mais elle est visible et non demandée : c'est D-122.

**L'expert du domaine.** « 6 documents et un seul juge ne prouvent rien. » Il a raison, et le bilan l'écrit : c'est une indication. Le bon niveau d'exigence reste celui d'une décision interne réversible, sans prétention scientifique. La vraie mesure, l'effet sur de vrais lecteurs, reste hors de ce test.

**Le contradicteur.** « Un modèle peut satisfaire le test en répondant toujours "rien". » Alors 2 « rien » de suite arrêtent le document, qui compte défavorable : le résultat dit que l'itération n'apporte rien, ce qui répond à la question. Autre détournement : un tour qui change un mot pour éviter l'arrêt. Le classement à l'aveugle le pénalise, et son coût se lit dans le bilan.

**Lentille robustesse, car le prompt devient un skill réutilisable.**

- Injection : `sources/` et `reference/` sont déclarées données, et le tour n'a ni commande, ni réseau, ni MCP.
- Calibrage : un document long pèse à chaque tour, d'où le délai de 15 minutes et le plafond de mots.
- Collision : `la-boucle` *(skill de convergence courte vers un arbitre)* reste distincte, et sa description l'exclut.

---

## Chapitre 7 — Effets à l'échelle

Le skill sera réutilisé si le test conclut : il faut donc penser à ce qu'il installe.

- **Une habitude coûteuse.** Un skill facile à lancer invite à itérer par réflexe. Le verdict fixé d'avance sert aussi de garde-fou : sans « intérêt », le skill ne se généralise pas.
- **Une dérive vers l'ajout.** C'est le risque que TF-2051 *(candidat au registre : rien ne récompense le retrait)* a nommé. La consigne de tour et le plafond de mots le contiennent, sans l'éteindre.
- **Une brique réutilisable.** `oracle-faits-sources` peut servir au-delà de ce test, et c'est la première réponse à TF-2050 *(candidat : contenu commercial inventé sur une page servie)*.
- **Une vérité sur le modèle datée.** Un verdict obtenu avec Opus 5.5 ne vaut pas pour le suivant. Le bilan porte le modèle servi et sa date.

---

## Chapitre 8 — Synthèse

Le prompt passe de 37 à 84 sur 100 selon les relecteurs aveugles, et il ne laisse plus la conclusion ouverte. Le 84 porte sur la passe 3 ; la version remise y ajoute 14 corrections vérifiées, mais non renotées.

Les 3 tableaux de ce chapitre se lisent ligne à ligne, chacun avec son mode d'emploi juste au-dessus : une passe de boucle, un ajout rattaché à son défaut, un écart à votre lettre ; aucun n'est trié par importance.

**Score.** 37 avant, noté par l'auteur. 84 mesuré à la passe 3, le plus bas des 2 relecteurs ; l'autre donne 86.

**Diagnostic.**

- Force : l'intention de décision est nette, et « on fera le test » sépare déjà la construction du test.
- Faiblesse : aucune règle de conclusion, et l'aveugle contredit la page demandée.
- Effet : sans réécriture, vous auriez un outil fonctionnel et un test qui ne tranche rien, pour une part importante du quota de la semaine.

**Mode boucle.** Ouvert d'office, parce que le prompt réécrit lance un run qui écrit et que l'analyse a relevé 2 bloquants.

Le tableau suivant retrace les passes ; chaque ligne donne la note des 2 relecteurs, les défauts graves retenus après recompte et la décision prise.

| Passe | Notes | Bloquants | Majeurs retenus | Écartés au recompte | Mots | Décision |
|---|---|---|---|---|---|---|
| 1 | 82 et 76 | 0 | 9 | 0 | 1 567 | Continuer |
| 2 | 85 et 80 | 0 | 8 | 0 | 2 162 | Continuer |
| 3 | 86 et 84 | 0 | 6 | 0 | 2 535 | Continuer, extension à 4 passes |
| 4 | 85 et 78 | 0 | 8 | 0 | 2 720 | Rejetée, sous la passe 3 |

**Raison de l'arrêt.** La passe 4 baisse de 84 à 78, et la règle fixée avant la passe 1 la rejette. Cette baisse tient au relecteur plus qu'aux corrections : 6 des 8 majeurs vus en passe 4 existaient déjà en passe 3 (recherche des citations dans les 2 fichiers), et 2 seulement viennent de phrases ajoutées.

**Après l'arrêt.** Les 14 majeurs ouverts sont corrigés dans la version remise (6 de la passe 3, 8 de la passe 4), puis vérifiés par un agent qui ne note pas : il confirme les 8 clôtures contrôlées et signale 2 défauts créés, corrigés ensuite. Ce texte de 2 893 mots n'a pas été renoté : ne lisez pas 84 comme sa note. Il reste long pour un prompt, et je l'assume, parce qu'il remplace un cahier des charges.

**Prompt réécrit.** `output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102e.md`.

**Contrat de sortie.** Il est embarqué à la fin du prompt. Ses critères :

- le skill existe à la source et est installé par `node bootstrap.mjs --pull` seulement, sans écart à `oracle-skills` ;
- tous les cas de recette rendent leur verdict attendu, sortie à l'appui ;
- `apiKeySource` vaut `none` sur chaque tour réel de la recette ;
- aucun fichier de version n'est suivi par git ;
- hors périmètre : le test sur les documents réels, tout format autre que Markdown et HTML, la génération d'images, la comparaison côte à côte et la courbe, sauf réponse contraire à D-122 ou D-123 *(décision sur les formats acceptés)*.

**Protocole de tests du livrable.** Il est prescrit, non exécuté par cette analyse. Oracles nommés dans le prompt :

- `check_html.py`, `render_page.py` et `run-oracles-design.mjs` pour la page ;
- `oracle-filtres-tableau` et les règles L4 *(filtres de colonne sur un tableau de données)* et G1-G6 *(garde-fous du composant de filtres)* pour tout tableau ajouté, le menu n'en étant pas un ;
- `oracle-faits-sources.mjs`, avec une paire de fixtures rouge et verte.

Jeu d'essai : 1 fixture Markdown, 1 fixture HTML, plus les cas simulés dont un cas limite par condition d'arrêt. Boucle bornée à 3 itérations par oracle, puis livraison avec les écarts.

**Changelog.** Chaque ligne relie un ajout du prompt à son défaut au Chapitre 3.

| Ajout | Défaut |
|---|---|
| Verdict à 3 issues, une seule comparaison par document, risque calculé et limites écrites | n° 1 |
| Mode « revue à l'aveugle » séparé du menu, classement hors de portée du lanceur | n° 2 |
| Pertinence jugée par vous seul, `jugements.json` jamais écrit par le modèle | n° 3 |
| Étape 0 sur `apiKeySource`, `--bare` interdite, arrêt si l'identité change | n° 4 |
| Pause à 0,80, formule de prévision, premier document seul | n° 5 |
| Construction seule dans ce run, brief et sources exigés, Markdown et HTML en version 1 | n° 6 |
| Conditions réécrites dans le prompt, 1 essai compté par document | n° 7 |
| Espace hors de tout dépôt, refus du lanceur, fixtures fictives | n° 8 |
| `--tours 50`, identique pour tout le test | n° 9 |
| Menu repris de la vidéo, comparaison et courbe renvoyées à D-122 | n° 10 |
| Commande de tour isolée (`--restricted`, sans réglages ni skills), `claude.exe` sans shell | n° 11 |
| Commentaire factuel sans adjectif, mots mesurés par le lanceur | n° 12 |
| Contrôle sans modèle après chaque tour, version rejetée exclue de la base | n° 13 |

**Écarts à votre lettre.** Le tableau liste chaque endroit où le prompt s'écarte de votre texte, avec sa catégorie. Les écarts « manière d'exécuter » se valident avec le prompt ; le seul contenu visible ajouté est posé à part.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « On fera le test » | Ce run construit, le test ouvre un run distinct | Vos documents ne sont pas encore désignés | Manière d'exécuter |
| « les conditions citées » : 2 essais au moins | 1 essai compté par document, 2e essai sur le premier seulement | Sinon 10 à 12 essais de 50 tours | Manière d'exécuter |
| « les conditions citées » : tours 5, 10, 20, 35, 50 | Échantillon : origine et tours 1, 5, 10, 20, 35, 50 | Comparer à une seule passe et à l'origine | Manière d'exécuter |
| « si cela a un intérêt ou non » | Règle à 3 issues, sur le tour 20 contre le tour 1 et l'origine | La première formulation réussissait par hasard | Manière d'exécuter |
| « Opus par défaut » | Effort `medium` par défaut | Votre demande ne fixe pas l'effort ; c'est celui de la vidéo, et il ménage le quota | Manière d'exécuter |
| « 5 ou 6 documents » | Markdown et HTML en version 1 | Format non dit, posé en D-123 | Manière d'exécuter |
| Livrables sous `output\` (préférence du 16/10) | Versions de travail hors de tout dépôt, bilan sous `output\` | `output\` du pilot est public | Manière d'exécuter |
| « comme sur la vidéo » | Mots ajoutés et retirés dans le menu, comme les lignes à 02:18 | Couvert par votre renvoi à la vidéo | Manière d'exécuter |
| « comme sur la vidéo » | Comparaison côte à côte et courbe des mots | Visible et non demandé nommément | Contenu visible ajouté, D-122 |
