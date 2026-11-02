---
role: analyse L99 en mode boucle de la demande de tri des favoris TikTok et du skill qui le généralise
destinataire: humain
---

# Revue — prompt de tri des sujets TikTok et de skill, passé au crible L99 — 02/11/2026

Prompt analysé, cité en entier : « Etudie les vidéos concernant Claude et l'IA non encore analysées, et construis un tableau avec les éléments abordés et la pertinence de lancer une étude d'opportunités pour chacun. input\Tiktok\iguane39 (@iguane39) _ TikTok 2.html De manière plus globale, travaille sur un skill qui permet de construire une analyse complète sur des listes de sujets comme ceux-ci pour identifier si des études d'opportunités sont pertinentes ou non. »

---

## Chapitre 1 — Cadrage et étalon noté

Le prompt vaut 30 sur 100 : il dit bien ce que vous voulez décider, mais laisse ouverts les trois points qui font le résultat, à savoir comment lire une vidéo, quoi compter comme déjà analysé, et si le skill a le droit de naître.

**Observe.** La demande porte 2 tâches liées par « De manière plus globale » :

- un tableau sur un périmètre filtré, « concernant Claude et l'IA » et « non encore analysées » ;
- un skill qui généralise ce tri à « des listes de sujets comme ceux-ci ».

Elle fournit un seul chemin, la page enregistrée le 02/11. Elle ne nomme ni le tri du 19/10, ni les 14 études qui en sont sorties.

**Orient.** Vous avez payé le 19/10 un tri puis 14 études. Aucune n'a recommandé de chantier lourd, et 3 ont conclu de ne rien faire (synthèse `Digit-AI - Synthese Mandat - Etudes des favoris TikTok - 20261019d.md`, bloc 0). L'objectif profond est donc de savoir où une étude changera une décision, avant de la payer. Le skill veut rendre ce filtre permanent.

**Decide.** 3 stratégies se présentaient :

- Rejouer le tri du 19/10 sur les vidéos neuves. C'est rapide, mais la grille n'a jamais été confrontée aux résultats des études. *Corrigé le 02/11/2026 : cette ligne affirmait que le score 21 avait fini écarté, en lisant au registre TF-1900 et TF-1903, numéros de la synthèse du 19/10 qui désignent aujourd'hui d'autres sujets. Relevé par le chemin des études : la suite du score 21 est TF-1921, au statut `corrige`.*
- Construire le skill d'abord, puis l'appliquer. Le skill naîtrait alors sans cas réel.
- Traiter le tableau à la main, en tirer le skill, puis le juger par un back-test sur le tri du 19/10.

**Act.** Je retiens la troisième. Le tableau sert de première fixture, et les 14 études servent de vérité terrain pour la grille.

**Étalon.** Le prompt idéal mesure ses prérequis, définit « analysée », fixe un jeu de verdicts fermé, range chaque contenu exactement une fois, passe le skill par le test d'admission des objets durables, et porte un contrat vérifiable.

Le tableau suivant note le prompt d'origine ; chaque ligne donne les points obtenus sur le barème et le fait qui les justifie.

| Dimension | Points | Justification |
|---|---|---|
| Clarté de l'intention | 11 sur 20 | Les 2 tâches sont nettes ; « étudie », « analysées » et « pertinence » ne se définissent pas |
| Spécification | 5 sur 20 | « un tableau », sans colonnes, sans échelle de verdict, sans emplacement |
| Garde-fous | 0 sur 15 | Aucun, alors que l'entrant vient d'un réseau et appelle à l'action (« Commente "Harvey" ») |
| Ancrage | 9 sur 15 | Le chemin est exact ; ni référence du déjà analysé, ni règle d'admission du skill |
| Vérifiabilité | 2 sur 15 | Rien ne dit quand le tableau ou le skill sont bons |
| Robustesse | 3 sur 15 | 3 lectures du périmètre, de 29 à 54 contenus |

Total : 30 sur 100. Le plafond de 40, posé dès qu'un défaut bloquant existe, ne joue donc pas ici.

---

## Chapitre 2 — Enchaînement logique

La demande repose sur une chaîne en 4 maillons, et 2 d'entre eux cassent : on ne peut pas étudier sans une voie d'accès autorisée, et un skill n'existe pas par simple commande.

- Si le périmètre est « non encore analysé », alors il faut une référence du déjà analysé. Elle existe : l'annexe du tri du 19/10. Le prompt ne la nomme pas, et l'exécutant comparera sans doute les 2 pages, ce qui rend 29 contenus au lieu de 37 (voir le chapitre 4).
- Si « étudie » veut dire regarder, alors il faut lire la vidéo. C'est la première rupture : `references\PLATEFORMES-RESEAUX.md`, ligne 100, cite l'interdiction d'extraction automatisée de TikTok, et le tri du 19/10 s'est arrêté aux légendes pour cette raison.
- Si le tableau juge la pertinence d'une étude, alors il doit composer avec le seuil de `gabarits\ETUDE-OPPORTUNITE.md`, qui dit déjà quand une étude est obligatoire. Le prompt laisse le risque d'une troisième grille.
- Si un skill généralise, alors il passe R-31 *(règle d'admission d'un objet durable : un verbe outillé absent ailleurs, prouvé par un verdict de non-recouvrement)*. C'est la seconde rupture : le 13/08, une étude a rendu un NO-GO sur un skill voisin, avec clause de réveil.

---

## Chapitre 3 — Inventaire des défauts

Cet inventaire est la liste de référence : tout défaut trouvé plus loin y remonte, et le prompt réécrit doit fermer chaque bloquant et chaque majeur. Les lignes sont classées par gravité, puis par ordre d'effet sur le livrable.

| N° | Défaut | Gravité |
|---|---|---|
| 1 | « Etudie les vidéos » ne dit pas par quelle voie, alors que l'extraction automatisée est interdite | bloquant |
| 2 | Le skill est commandé sans le test R-31, ni l'étude que le gabarit rend obligatoire pour un objet durable, ni la réponse au NO-GO du 13/08 | bloquant |
| 3 | « non encore analysées » n'a pas de référence : 29, 37 ou 54 contenus selon la lecture | majeur |
| 4 | « pertinence » n'a ni échelle ni règle, et peut contredire le seuil du gabarit | majeur |
| 5 | « pour chacun » ne dit pas si la ligne est une vidéo ou un élément | majeur |
| 6 | « concernant Claude et l'IA » n'a pas de règle pour les cas limites, comme une fiche Google sans IA | majeur |
| 7 | Rien n'oblige à chercher l'existant : plusieurs sujets neufs recoupent déjà une étude ou un skill | majeur |
| 8 | Le bénéficiaire n'est pas dit : Factory, forge ou offre commerciale | majeur |
| 9 | Pilot public : un tableau complet exposerait des favoris sans rapport avec l'IA, dont des sujets politiques | majeur |
| 10 | La page porte des adresses signées de la session, que rien n'interdit de recopier | majeur |
| 11 | Les légendes appellent à l'action et vantent des chiffres ; rien ne les traite en données | majeur |
| 12 | Les 2 livrables n'ont ni emplacement, ni nom, ni contrat, ni jeu d'essai | majeur |
| 13 | « une analyse complète » ne dit pas ce que le skill doit produire | majeur |
| 14 | Le skill généralise « des listes de sujets » à partir d'un seul format d'entrée | mineur |
| 15 | L'ordre entre tableau et skill n'est pas dit | mineur |

Biais probable de l'auteur : la demande tient pour acquis qu'un tri mène à une décision de lancer des études. Le relevé du 19/10 montre que le filtre utile est souvent « déjà couvert ».

---

## Chapitre 4 — Prémisses vérifiées

3 prémisses tiennent, 1 est périmée en partie, et le chiffre que donnerait la lecture la plus simple du prompt est faux d'un quart.

Prémisse d'accès, mesurée le 02/11/2026 à 08:46 par `node` (script de lecture seule), compte Windows `iguan`, poste Dell-XPS-16 :

- **Code de retour.** Exit 0 sur la page du 02/11 : 117 liens uniques, dont 7 carrousels photo.
- **Contrôle positif.** La même lecture rend 117 liens sur la page du 19/10 et 109 identifiants à l'annexe du tri, le nombre annoncé par ce tri.
- **Familles d'accès au contenu des vidéos.**

Le tableau liste ces familles ; chaque ligne dit si la voie est essayée, son résultat et ce qu'elle permet.

| Voie | État | Résultat |
|---|---|---|
| Légende du HTML enregistré | essayée | 29 légendes non vides sur 29 vidéos neuves ; 3 ne disent presque rien (moins de 30 caractères utiles) |
| Couverture locale dans `_files` | essayée | 101 liens sur 117 ont une image locale à proximité ; le rattachement reste à contrôler |
| Source primaire (dépôt, documentation) | non essayée ici | ouverte, méthode des 14 études du 19/10 |
| Fichier déposé par vous, transcrit en local | outils essayés | `faster_whisper` s'importe, `imageio_ffmpeg` rend son binaire ; pipeline déjà employé (`veille\AMELIORATIONS-TIKTOK.md`) |
| Téléchargement depuis TikTok | outil présent, non appelé | `yt-dlp` 2026.10.21 est installé ; je ne l'ai pas lancé, car la ligne 100 de `references\PLATEFORMES-RESEAUX.md` l'exclut sans accord écrit |

Un refus ne ferme qu'une porte : ici aucune voie permise n'est fermée, et la seule voie refusée l'est par une règle, pas par la technique. Cette voie relève de vous (décision D-120).

Les autres prémisses :

- **« vidéos […] non encore analysées » suppose un registre : vrai, mais caché.** L'annexe du tri porte 109 identifiants. Comparer les 2 pages rend 29 contenus neufs. Comparer à l'annexe en rend 37, car 8 carrousels photo n'ont jamais été rangés. En ajoutant les 17 rangés sans qualification (7 « sans légende » et 10 « légende trop vague »), le périmètre vaut 54. Le chiffre le plus simple, 29, manque donc près de la moitié. *Précisé à l'exécution, le 02/11/2026 : les 7 « sans légende » ne sont pas des favoris, mais des liens du panneau de notifications de la page. Les 54 contenus se lisent donc 47 favoris et 7 notifications.*
- **« le poste n'a ni `yt-dlp`, ni `ffmpeg` » (tri du 19/10) : périmé pour ce poste.** Les outils sont là ; l'interdiction des conditions de TikTok, elle, demeure. Cet argument est à ne pas réutiliser tel quel.
- **Des vidéos se recoupent avec l'existant : vrai.** La n° 25 de la liste neuve (le skill « OBSERVER ») recoupe `output\03-etudes\20261026-comparaison-task-observer-oeil-critique.md` ; la n° 28 (`llm-council-skill`) recoupe `output\03-etudes\20261020-etude-opportunite-conseil-avant-arbitrage.md`.
- **Un NO-GO a déjà visé un skill voisin : vrai.** `output\03-etudes\2026-08\20260813-etude-opportunite-outillage-analyse.md`, ligne 161. Sa clause de réveil (ligne 110) demande 5 emplois du gabarit ; 29 études portent ce nom dans le dossier courant et 107 dans le dépôt. La clause est atteinte, ce qui autorise la réévaluation sans préjuger du verdict.
- **Le pilot est public : vrai.** `gh repo view` rend `PUBLIC` à 08:50.

---

## Chapitre 5 — Causes d'échec les plus probables

Si ce prompt déçoit, ce sera d'abord parce que le tableau aura l'air plus savant qu'il ne l'est. Les 5 causes suivantes sont classées par probabilité décroissante.

1. **Un tableau de légendes présenté comme une étude.** L'exécutant lit les légendes, écrit « étudié », et vous décidez sur une preuve faible. Mécanisme : aucune consigne n'oblige à dire la voie de lecture. Parade : la voie de lecture chiffrée en tête du livrable.
2. **Des études relancées sur du déjà étudié.** La grille note « nouveauté » de mémoire. Mécanisme : pas de recherche d'existant imposée. Parade : citation ou « aucun existant trouvé » avec les termes cherchés dans chaque motif.
3. **Un skill qui emballe une méthode sans outil.** Il passe `write-a-skill`, mais il n'est qu'un corpus, et il coûte son frontmatter à chaque session. Mécanisme : le NO-GO du 13/08 n'est pas nommé. Parade : l'étude et l'arrêt prévu vers un référentiel. Cette cause reprend et chiffre le défaut 2.
4. **Une grille gardée sans preuve.** Le score 19 reste le seuil par habitude, alors que le classement n'a pas prédit la valeur des études. Mécanisme neuf, remonté à l'inventaire comme défaut 13. Parade : le back-test en matrice, rendu même défavorable.
5. **Une fuite de favoris par le dépôt public.** Le rangement exhaustif part avec le livrable, avec des vidéos politiques et des adresses signées. Parade : le rangement complet reste dans le dossier ignoré.

---

## Chapitre 6 — Attaques

3 relecteurs fictifs attaquent ici la direction prise. Ils ont fait évoluer la réécriture sur 3 points : la colonne des motifs, la règle de verdict et l'objet du skill.

**L'utilisateur exigeant.** « Je veux ouvrir le fichier et voir quoi lancer. » Le tableau reste à 3 colonnes, plus un motif si vous le choisissez (décision D-121), et le détail du score reste au fichier de rangement. Une colonne par note aurait noyé la décision, et aurait ajouté du contenu visible que vous n'avez pas demandé.

**L'expert du domaine.** Il relève qu'une étude a de la valeur quand son résultat peut changer la décision. La grille du 19/10 mesure le gain, pas cette valeur. La réécriture exige donc que chaque « Étude poussée » nomme la question à trancher. Il relève aussi que le seuil du gabarit fait déjà foi : sous ce seuil, le gabarit prescrit la décision directe. La règle de verdict compose les deux.

**Le contradicteur.** Un modèle pourrait mettre tout en « Sans suite » avec des citations vagues, ou ranger les 54 contenus en les recopiant. D'où l'oracle : score recalculé, entrée rangée une seule fois, citation dans chaque motif. Reste une conformité littérale que l'oracle ne voit pas : la justesse d'une note. Le back-test la borne, sans la supprimer.

**Lentille robustesse.** Le skill sera réutilisé. Sa surface d'injection, ce sont les légendes et les dépôts qu'il lit : le prompt les traite en données. Calibrage : les notes viennent du modèle, et le script ne calcule que la somme et le verdict, ce qui évite un script qui prétend juger.

---

## Chapitre 7 — Effets à l'échelle

Le prompt engendre un skill réutilisable, donc ses biais se répéteront à chaque liste. 3 effets de second ordre méritent d'être nommés.

- **Le tri devient un péage inversé.** Une grille qui répond souvent « étude poussée » gonfle le stock d'études. Le back-test mesure ce taux, et le seuil du gabarit le contient.
- **Le fichier de rangement devient un registre des centres d'intérêt.** Il dit ce que vous avez regardé, y compris hors IA. Il doit rester hors du dépôt public, et le skill le prend en paramètre sans lui imposer de place versionnée.
- **Le coût de contexte.** Le frontmatter du skill pèse sur toutes les sessions : le NO-GO du 13/08 en faisait un argument. La description doit écarter clairement `veille\MODE-VEILLE.md` et `prompt-analyzer-l99`, sous peine de déclenchements erronés.

---

## Chapitre 8 — Synthèse

Le prompt passe de 30 à 74 sur 100 selon les relecteurs aveugles, et il remonte ses prérequis avant tout travail. Le 74 porte sur la passe 2 ; la version remise y ajoute des corrections vérifiées, mais non renotées.

Les 3 tableaux de ce chapitre se lisent ligne à ligne, chacun avec son mode d'emploi juste au-dessus : une passe de boucle, un ajout rattaché à son défaut, un écart à votre lettre ; aucun n'est trié par importance.

**Score.** 30 avant, 74 mesuré à la passe 2, le plus bas des 2 relecteurs. L'autre relecteur donne 80.

**Diagnostic.**

- Force : l'intention de décision est nette, et le chemin de l'entrant est exact.
- Faiblesse : le prompt ignore l'interdiction d'extraction de TikTok et le NO-GO du 13/08 ; il laisse 3 lectures du périmètre.
- Effet : sans réécriture, vous auriez reçu un tableau de légendes sur 29 contenus au lieu de 54, présenté comme une étude.

**Mode boucle.** Ouvert d'office, parce que le prompt réécrit lance un run qui écrit et que l'analyse a relevé 2 bloquants.

Le tableau suivant retrace les passes ; chaque ligne donne la note des 2 relecteurs, les défauts graves retenus après recompte et la décision prise.

| Passe | Notes | Bloquants | Majeurs retenus | Écartés au recompte | Mots | Décision |
|---|---|---|---|---|---|---|
| 1 | 82 et 74 | 0 | 8 | 1 | 1 579 | Continuer |
| 2 | 80 et 74 | 0 | 6 | 1 | 1 990 | Arrêter |

**Raison de l'arrêt.** Le gain mesuré vaut 0 point, sous le minimum de 3 fixé avant la passe 1. La règle s'applique même avec des majeurs ouverts, et une extension exige ce même gain.

**Après l'arrêt.** Les 6 majeurs retenus à la passe 2 sont corrigés dans la version remise, puis vérifiés par un agent qui ne note pas : il confirme 6 clôtures sur 7 et signale 6 défauts créés, dont un `git commit --only` qui échoue sur un fichier neuf, rejoué dans un dépôt jetable. Les 6 sont corrigés et la 7e clôture avec eux, sans nouvelle vérification. Le prompt remis n'a donc pas de score propre, et le journal le dit.

**Prompt réécrit.** `output\04-plans\Digit-AI - Prompt - Tri des sujets Claude et IA des favoris TikTok et skill - 20261102c.md`.

**Contrat de sortie.** Il est embarqué à la fin du prompt, en 3 branches : skill construit, construction arrêtée par l'étude, boucle échouée. Ses critères communs :

- autant d'entrées au rangement que de contenus au périmètre, chacune une seule fois ;
- 3 colonnes, ou 4 selon la réponse à D-121, et un verdict du jeu fermé ;
- une citation d'existant dans chaque motif, et motifs et notes au fichier de rangement ;
- aucune adresse signée, aucun contenu écarté dans le livrable public ;
- `oracle-etude-opportunite` et `oracle-ecriture` à PASS.

**Protocole de tests du livrable.** Le tableau et le skill sont substantiels : le protocole est embarqué au prompt, et n'est pas joué ici.

- Tableau, type données : `oracle` du skill, contrôle du nombre d'entrées contre le périmètre.
- Skill, type code : fixtures rouge et verte, 4 cas d'essai dont une liste vide et une liste texte à doublon.
- Back-test : matrice de 14 lignes, notes données à l'aveugle.
- Boucle bornée à 3 itérations, et arrêt sans publication après 3 échecs.

**Changelog.** Chaque ligne rattache un ajout au défaut qu'elle ferme (numéros du chapitre 3).

| Ajout | Défaut fermé |
|---|---|
| Étape 0 avec 5 voies de lecture et lettre de la décision D-120 | 1 |
| Étude, test de verbe outillé, réponse au NO-GO, arrêt vers un référentiel | 2 |
| Périmètre relevé contre l'annexe du tri, avec les chiffres attendus | 3 |
| Jeu de verdicts ordonné, seuil du gabarit cité, question à trancher | 4 |
| Une ligne par élément abordé | 5 |
| 3 états de rangement et règle du filtre | 6 |
| Recherche d'existant obligatoire et citée dans chaque motif | 7 |
| Bénéficiaire nommé dans le motif, au fichier de rangement | 8 |
| Rangement dans le dossier ignoré, nombres seuls au livrable | 9 |
| Liens canoniques seuls, contrôle `x-expires` et `tk=` | 10 |
| Légendes et dépôts traités en données, chiffres « selon l'auteur » | 11 |
| Noms selon R-4 et R-25, contrat, jeu d'essai | 12 |
| Script, soustraction, calcul et oracle du skill, back-test | 13 |
| Normalisation de 4 formats d'entrée | 14 |
| Ordre tableau puis skill, tableau enregistré avant l'étape 2 | 15 |

**Écarts à la lettre.** Le tableau suivant compare votre texte et le prompt réécrit ; chaque ligne donne sa catégorie, à valider poste par poste.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « Etudie les vidéos » | Lecture par légende, couverture, source primaire et fichier déposé ; téléchargement selon D-120 | Les conditions de TikTok l'excluent sans accord écrit | Manière d'exécuter |
| « non encore analysées » | 54 contenus : 37 jamais rangés et 17 rangés sans qualification | Lecture au plus large, le tri du 19/10 n'ayant pas lu ces 17 | Manière d'exécuter |
| « pertinence […] pour chacun » | Verdict du jeu fermé, motif et notes au fichier de rangement | La relecture d'intention a fait retirer les notes du tableau | Manière d'exécuter |
| le tableau seul | Colonne Motif | Un verdict sans motif se discute mal | Contenu visible ajouté : décision D-121, à part, absent du tableau sans votre réponse |
| « travaille sur un skill » | Étude d'abord, construction si elle la justifie | R-31 l'exige, et un NO-GO a déjà visé un skill voisin | Manière d'exécuter |
| le tableau seul | Mention en tête de la voie de lecture et des nombres écartés | Votre loi de qualité veut que toute valeur non vérifiable soit marquée | Manière d'exécuter, exigée par votre règle |

Le prompt n'ajoute aucun autre contenu visible au livrable.
