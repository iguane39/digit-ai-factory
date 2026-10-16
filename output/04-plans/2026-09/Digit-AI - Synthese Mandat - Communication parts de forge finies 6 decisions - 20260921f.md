---
destinataire: humain
---

# Communication : les parts de forge sont finies en local, et 6 décisions vous attendent, détaillées

## 0. Synthèse d'ouverture

Vous aviez demandé 3 choses sur le relevé des travaux de communication : finir les parts de
forge, préparer la validation des 2 barres de qualité, détailler les choix qui vous reviennent.
Les parts de forge sont faites et vérifiées. Un appel d'offres se qualifie désormais par un type
d'entrant qui lui est propre, et le mode opératoire des appels d'offres le dit. Le manifeste des
versions de la forge des agents voit enfin les 5 skills de communication. Rien n'est publié :
3 enregistrements attendent sur ce poste. Les 2 barres sont prêtes, et l'une a perdu un
candidat depuis le 14/09. Ce qui est attendu de vous : 6 décisions, toutes avec une recommandation.

## 1. En-tête d'identification

- **quoi** — exécution de votre message « 1, puis 3, puis détaille 4 », sur les actions A-1, A-3
  et A-4 du relevé des travaux de communication rendu ce jour à 15h27.
- **sur quoi** — `digit-ai-forge-conception` et `digit-ai-forge-agents`, écrits sous le mandat
  permanent des forges ; le pilot `digit-ai-factory`, branche locale `report/complement-20260921` ;
  le produit `digit-ai-marketing`, que le registre nomme Produit-66, lu et non modifié.
- **quand** — le 21/09/2026, de 17h21 à 17h41 (Europe/Paris), heures relevées par `date`.
- **qui** — session pilot Claude Fable 5.1 ; aucun agent délégué, escalade de modèle : aucune.
- **intention** — que les travaux de communication restés à moitié faits soient finis là où la
  machine peut finir, et que vous puissiez trancher le reste sans rouvrir un seul fichier.
  **Test rétro** : 2 travaux sont clos au registre avec leur preuve, 2 autres disent exactement ce
  qui reste, et chaque décision du bloc 3 porte ses faits, ses options et sa recommandation ;
  l'intention est servie, sauf pour la publication, qui attend D-11.

## 2. Verdict en une ligne

**2 travaux clos, TF-1026 et TF-1223**, 2 mis à jour, TF-1028 et TF-1023 · forge-conception
`f4b06a9`, self-test **VERT avant et après**, 16 oracles, 56 règles, 4 cas neufs sur 4 ·
forge-agents `006acd7`, manifeste de **10 écarts à 0**, recette de `quality-oracles` **PASS 313
contrôles** · pilot `7d34047`, 5 événements au registre, `oracle-todo` **PASS** · test d'existence
des barres : **5 références atteignables sur 6**, 1 candidat éliminé · 3 enregistrements locaux,
0 publié.

## 3. Décisions attendues de vous

6 décisions. Aucun bloquant : rien n'est à l'arrêt.

> **D-6 — Retenez-vous la collection de propositions réelles de cabinets comme barre de la propale privée ?**
>
> Une barre est une référence externe qui fixe le niveau à atteindre par un livrable. Le protocole
> du skill `la-barre` interdit de la choisir sans vous : c'est son pas 5. 2 candidats avaient
> passé le test le 14/09. Rejoué ce jour, le second est tombé : la page des consultations de
> conseil de l'Administrative Conference of the United States rend HTTP 503 au script et 403 à
> `curl`. Il est éliminé. Il reste un survivant : Slideworks, « 14 Real Consulting Proposals »,
> `https://slideworks.io/resources/10-real-consulting-proposals-free-to-download`, HTTP 200 ce
> jour. Ce sont des propositions réelles de cabinets, dont certaines devenues publiques après une
> consultation. La barre fixe un niveau de rigueur : le problème du client ouvre le document, le
> prix se lit par phase, chaque promesse est testable. Elle n'autorise la reprise d'aucun texte ni
> d'aucune identité.
>
> **Recommandation : (a).** Source consultée : `registre-barres.md` du skill `la-barre`, entrée
> « propale privée » ; mesure du tour : `python scripts/test_existence.py` rend HTTP 200 sur le
> survivant et HTTP 503 sur l'éliminé.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je retiens Slideworks, l'entrée passe à `ok`, puis je la branche dans `digit-ai-propale` et dans l'arbitre de `digit-ai-propale-review` | effort moyen × court | exclut une barre francophone ; les propositions sont anglo-saxonnes |
| (b) je cherche d'abord 2 autres candidats, puis je vous les soumets | effort moyen × moyen | exclut une barre servie aujourd'hui |
| (c) la propale reste sans barre externe | nul | exclut que le niveau d'une propale soit mesuré à autre chose qu'à nos propres règles |

> **Si rien n'est décidé** : l'option (c) s'applique — l'entrée reste en `todo` et n'est servie à
> aucun skill.

> **D-7 — Quelle barre retenez-vous pour le mémoire technique de réponse à un appel d'offres ?**
>
> L'entrée du 14/09 déclarait « source française à chercher ». Je l'ai cherchée et trouvée :
> l'annexe 1 du guide de l'Observatoire économique de l'achat public, décembre 2012, « Aide à la
> rédaction d'un mémoire technique ». Elle vit sous 2 miroirs, l'un et l'autre HTTP 200, et j'en ai
> extrait et lu le texte. 3 réserves : c'est une trame commentée et non une réponse rédigée,
> elle vise un marché de travaux et non une prestation intellectuelle, elle date de 2012. Aucune
> réponse rédigée française n'est ouverte : les offres sont confidentielles. Les 2 candidats
> du 14/09 tiennent : Open Grants, `https://www.ogrants.org/`, des propositions de financement
> réellement soumises avec leur issue, et le catalogue G-Cloud britannique. Open Grants a rendu
> une panne passagère au premier passage, puis HTTP 200. Le contrat d'une barre permet 2
> entrées pour une même cible, une par dimension.
>
> **Recommandation : (a).** Source consultée : `SKILL.md` du skill `la-barre`, champ `dimension`
> (règle RB-1 du 14/08) ; mesure du tour : test d'existence à 4 références atteignables sur 4 au
> second passage, texte des 2 miroirs extrait, 10 149 et 13 670 caractères.

| Option | Coût | Exclusions |
|---|---|---|
| (a) 2 entrées : Open Grants pour « réponse complète à une trame imposée », l'annexe de l'Observatoire pour « attente d'un acheteur public français » | effort moyen × court | exclut une référence unique, plus simple à servir |
| (b) Open Grants seul | effort simple × court | exclut toute référence française ; l'écart de juridiction reste entier |
| (c) l'annexe de l'Observatoire seule | effort simple × court | exclut toute réponse rédigée comme référence ; une trame ne montre pas un niveau d'écriture |

> **Si rien n'est décidé** : aucune des trois ne s'applique — l'entrée reste en `todo` et n'est
> servie à aucun skill.

> **D-8 — L'étude des réseaux sociaux s'élargit-elle au-delà de LinkedIn maintenant ?**
>
> C'est un candidat du registre, né de votre objection du 17/09 : « pourquoi que LinkedIn ? ». Le
> relevé du même jour mesure que l'étude a fermé son périmètre par 3 hypothèses empilées.
> Sur 8 autres réseaux, 5 ouvrent gratuitement une interface officielle de publication sur son propre
> compte : Instagram, Facebook, YouTube, Threads et Bluesky. La conclusion « publier est un geste
> humain par contrat » ne vaut donc que pour LinkedIn. 9 étapes du métier n'ont pas été
> instruites, dont les avis clients, la vidéo, la publicité et la crise. Le candidat demande une
> étude complémentaire : une matrice réseaux × étapes × types d'émetteur, les accès rejoués sur
> des pages officielles datées, puis un référentiel de plateformes à plusieurs réseaux. 10 lignes
> du relevé reposent sur des sources secondaires. Le premier cas réel sur LinkedIn, décidé
> le 17/09, n'est pas commencé.
>
> **Recommandation : (a).** Source consultée : `todo\TODO.jsonl`, TF-1178, et
> `output\03-etudes\20260917-releve-autres-reseaux-sociaux.md` ; mesure du tour : TF-1160 est au
> statut « décidé » sans correction, et `output\03-publications\` du produit ne contient que son
> README.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je lance l'étude complémentaire maintenant, même gabarit que celle du 17/09 | effort élevé × moyen | exclut d'attendre les leçons du premier cas réel sur LinkedIn |
| (b) l'étude attend la fin du premier cas réel de 4 semaines sur LinkedIn | nul maintenant | exclut tout autre réseau pendant au moins 4 semaines ; le type de run reste écrit sur le réseau le plus fermé |
| (c) le candidat est écarté, le périmètre reste LinkedIn | nul | exclut la réponse à votre objection du 17/09 |

> **Si rien n'est décidé** : l'option (b) s'applique de fait — TF-1178 reste candidat.

> **D-9 — Le gabarit des agents de campagne prescrit-il de rejouer la recette de l'agrégateur ?**
>
> C'est un candidat du registre, né le 14/09. Un agent qui modifie un skill rejoue le self-test de ce skill, et pas
> la recette de `quality-oracles`, qui juge tous les skills ensemble. Le défaut a été payé 2 fois.
> Le 14/09, une description de 1 026 caractères pour une limite de 1 024 n'a été vue qu'en fin de
> campagne. Le 20/09, un outil a réécrit 8 copies de travail avec de mauvaises fins de ligne, et la
> recette rendait 3 échecs que seul le rejeu du pilot a trouvés. La consigne a été ajoutée à la
> main au prompt des agents suivants ; elle n'est pas au gabarit `gabarits\AGENT-CAMPAGNE.md`. Je
> l'ai vécu ce tour : ma description est montée à 1 025 caractères, et je ne l'ai vu que parce que
> je la mesurais.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (un candidat du pilot
> passe en décidé sur votre mot) et `todo\TODO.jsonl`, TF-1224 et sa note du 20/09 ; mesure du
> tour : description de `qualifie-l-entrant` à 1 025 puis 1 016 caractères.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je décide TF-1224 et j'écris la consigne au gabarit dans la foulée | effort simple × court | rien |
| (b) décidé, pour une campagne ultérieure | nul maintenant | exclut que la prochaine campagne en profite ; la consigne reste recopiée à la main |
| (c) il reste candidat | nul | exclut la correction ; une troisième occurrence est probable |

> **Si rien n'est décidé** : l'option (c) s'applique — TF-1224 reste candidat.

> **D-10 — Que fait la marque Digit-AI des 2 teintes sous le seuil de contraste du texte ?**
>
> C'est la dernière chose qui empêche de clore le travail sur la marque à 2 chartes. Sur le fond clair de la marque, `#FAFBFF`,
> j'ai recalculé ce jour : `--amber` `#D97706` rend 3,08:1 et `--teal` `#0E9488` rend 3,62:1. Le
> relevé du 14/09 donnait 3,07 et 3,59. Le seuil d'un texte courant est 4,5:1 ; celui d'un élément
> graphique, 3:1. Les 2 teintes tiennent donc pour un filet ou une icône, et échouent pour un
> texte. La marque porte déjà 2 variantes pleines qui passent : `--amber-solid` `#92400E`
> à 6,86:1 et `--teal-solid` `#0F5F8F` à 6,65:1. En thème sombre, les 2 teintes passent, à 11,39
> et 12,28:1. La page témoin du produit n'emploie aucune des 2 teintes en texte.
>
> **Recommandation : (a).** Source consultée : WCAG 2.2, critères 1.4.3 (texte, 4,5:1) et 1.4.11
> (éléments graphiques, 3:1), et `donnees\marque\tokens.css` du produit ; mesure du tour : les 6
> rapports de contraste ci-dessus, recalculés par la formule de luminance relative.

| Option | Coût | Exclusions |
|---|---|---|
| (a) les valeurs ne bougent pas ; la règle s'écrit dans `MARQUE.md` : ces 2 teintes ne portent jamais de texte, le texte passe par les variantes pleines | effort simple × court, dans une session chez le produit | exclut un texte ambre ou sarcelle clair sur fond clair |
| (b) les 2 teintes sont foncées jusqu'à 4,5:1 | effort moyen × moyen, chez le produit puis chez forge-design | exclut les teintes actuelles ; les diapositives et les pages déjà produites changent de couleur |
| (c) rien ne change | nul | exclut la clôture de TF-1023 ; un texte sous le seuil reste possible |

Comment faire pour la première option : 1) ouvrir `c:\dev\digit-ai-marketing` dans VS Code ; 2) y lancer
une session ; 3) écrire « Applique D-10 (a) de la synthèse 20260921f du pilot : règle d'usage des
teintes ambre et sarcelle dans MARQUE.md ».

> **Si rien n'est décidé** : l'option (c) s'applique — TF-1023 reste en cours.

> **D-11 — Les 2 enregistrements de forge partent-ils sur GitHub maintenant ?**
>
> `digit-ai-forge-conception` est en avance de 1 enregistrement, `f4b06a9`. `digit-ai-forge-agents`
> est en avance de 1 enregistrement, `006acd7`. Les 2 recettes natives sont vertes. Le 3e
> enregistrement, `7d34047` au pilot, vit sur la branche locale `report/complement-20260921` : il
> part avec elle, sous la décision D-4 de la synthèse 20260921e, que je ne repose pas ici.
>
> **Recommandation : (a).** Source consultée : la règle R-38 (tout push attend le GO humain) ;
> mesure du tour : `git status -sb` rend `ahead 1` dans chacune des 2 forges, self-test de
> forge-conception VERT, recette de `quality-oracles` PASS à 313 contrôles.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je publie les 2 forges : relevé de GitHub, porte des noms, push, relevé final | effort simple × court | exclut une relecture humaine du détail avant publication |
| (b) vous relisez d'abord, puis vous me dites de publier | effort moyen × moyen | exclut une publication aujourd'hui |
| (c) les 2 enregistrements restent locaux | nul | exclut que l'autre poste voie le sixième entrant et le manifeste aligné |

Comment faire pour l'option (b) : 1) ouvrir un terminal ; 2) lancer
`git -C c:\dev\digit-ai-forge-conception show f4b06a9` puis
`git -C c:\dev\digit-ai-forge-agents show 006acd7` ; 3) me dire de publier.

> **Si rien n'est décidé** : l'option (c) s'applique — les 2 enregistrements restent sur ce poste.

## 4. Traité — avec sa preuve

- **TF-1026 est clos : un appel d'offres a son type d'entrant.** Le skill `qualifie-l-entrant` de
  forge-conception passe en 1.3.0 et porte un sixième entrant, « dossier d'appel d'offres ». Son
  protocole tient en 4 pas : inventaire des pièces, conversion en texte, construction du
  référentiel par l'outil `construire-referentiel-ao.mjs` de forge-agents, relevé manuel de ce que
  l'outil déclare ne pas capter. Votre « 1 » tranche la décision D-7 du 14/09, restée sans réponse,
  en faveur du type dédié. Preuve : `f4b06a9` ; `node oracles/self-test.mjs` VERT avant et après.
- **La typologie des entrants a maintenant un contrôle.** Elle est écrite 2 fois et annoncée
  4 fois en toutes lettres. Une branche neuve du self-test vérifie que les 2 tables nomment
  les mêmes entrants et que les 4 nombres sont le nombre de lignes. 2 témoins rouges
  prouvent qu'elle juge. Preuve : 4 cas tenus sur 4.
- **Le mode opératoire des appels d'offres est à jour.** `references\RUN-AO.md`, étape A1, nomme le
  nouveau type ; l'étape A2 nomme l'outil livré et sa relecture humaine. Preuve : `7d34047` ;
  `oracle-claude-md` exit 0.
- **TF-1223 est clos : le manifeste voit les 5 skills de communication.** Le constat rendait 10
  écarts, dont 5 skills absents et 5 versions en retard. L'outil exige que le lot soit parti avant
  de déclarer : j'ai vérifié que forge-agents était aligné sur `origin/main`. Preuve : `006acd7` ;
  `node maj-versions-livrees.mjs --constat` rend exit 1 avant, exit 0 après.
- **TF-1028 avance : les 2 barres sont prêtes pour votre validation.** Test d'existence rejoué,
  un candidat éliminé, une source française trouvée et lue. Les 2 entrées restent en `todo`.
  Preuve : `006acd7`, `registre-barres.md` ; détail en D-6 et D-7.
- **TF-1023 dit ce qui reste.** Les 3 fichiers que la note du 14/09 donnait comme manquants
  existent chez le produit, sous `donnees\marque\`. Il ne reste que D-10. Preuve : événement du
  registre, lecture seule chez le produit.
- **Le registre porte 5 événements neufs.** Le premier passage a été annulé par l'outil : la règle
  R12 refusait de clore TF-1223 sans dire par quoi la correction redescend. J'ai nommé le constat
  de l'outil du manifeste, puis rejoué. Preuve : `oracle-todo` PASS avant et après.

## 5. Non traité — avec son motif

- La validation des 2 barres : motif `decision` — le pas 5 du protocole n'est pas sautable ;
  voir D-6 et D-7.
- Le branchement des barres dans `digit-ai-propale`, `digit-ai-communication` et l'arbitre de
  `digit-ai-propale-review` : motif `decision` — une barre en `todo` n'est servie à personne ;
  il suit D-6 et D-7.
- La publication des 3 enregistrements : motif `decision` — voir D-11, et D-4 de la synthèse
  20260921e pour le pilot.
- Les 3 travaux du produit, TF-1160, TF-1159 et TF-1031 : motif `hors_mandat` — ils vivent chez
  le produit, où seule une session ouverte chez lui écrit ; c'est l'action A-7.
- Un oracle pour un `ENTRANT.md` de type appel d'offres : motif `borne_atteinte` — aucun oracle ne
  juge un `ENTRANT.md` d'aucun type ; le premier cas réel dira s'il en faut un.
- L'installation au poste du skill `qualifie-l-entrant` 1.3.0 : motif `decision` — la propagation
  au poste suit la publication, donc D-11.
- L'oracle `etat-forge` de forge-agents : motif `borne_atteinte` — je ne l'ai pas rejoué après
  l'alignement du manifeste ; le constat de l'outil, lui, est rejoué et vert.

## 6. Écarts à la lettre

- **Vous avez écrit « 1 ».** L'action A-1 nommait 4 parts ; je les ai toutes faites. **J'ai
  fait en plus** : une branche de self-test chez forge-conception et la mise à jour de l'étape A2
  de RUN-AO. **Pourquoi** : 7 retouches de prose sur 3 fichiers n'avaient aucun contrôle, et
  l'étape A2 disait encore « demain par le verbe outillé » d'un outil livré le 14/09.
- **Vous avez écrit « puis 3 ».** L'action A-3 est votre geste, pas le mien. J'ai fait ce qui le
  rend possible en un tour : les 2 barres sont posées en D-6 et D-7, avec leurs faits.
- **Vous avez écrit « détaille 4 ».** J'ai détaillé les 3 sujets de A-4 en D-8, D-9 et D-10.
  Je n'en ai exécuté aucun.
- **J'ai écrit sur la branche locale `report/complement-20260921` du pilot, pas sur main.** Cette
  branche portait déjà 2 lignes du registre ; un enregistrement sur main aurait créé un conflit à
  la fusion. Mon travail au pilot part donc avec elle.
- **Une commande a été refusée en cours de tour**, puis vous avez écrit « continue ». Je l'ai
  scindée : la recette de `quality-oracles` a été jouée, l'oracle `etat-forge` ne l'a pas été.
- **Les décisions sont numérotées D-6 à D-11**, pour ne pas croiser D-4 et D-5 de la synthèse
  20260921e, encore ouvertes.

## 7. Risques

- **L'autre poste publie chez une des 2 forges avant D-11.**
  - signal : `git status -sb` y rend un retard non nul après `git fetch`.
  - parade : rebase de l'enregistrement local, recette native rejouée, puis push.
- **Un 2e candidat de barre tombe, comme le premier.**
  - signal : `python scripts/test_existence.py` rend FAIL sur Slideworks ou sur Open Grants.
  - parade : l'entrée repasse en `todo` et je cherche un remplaçant ; le champ `dernier_test` date
    chaque passage.
- **Le type « dossier d'appel d'offres » est conçu sans cas réel.**
  - signal : le premier appel d'offres qualifié demande une pièce ou un seuil que le protocole ne
    prévoit pas.
  - parade : le retour se remet au pilot en lot, et le protocole se corrige sur ce fait.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Trancher D-6 à D-11 — répondre par exemple « D-6 (a), D-7 (a), D-8 (a), D-9 (a), D-10 (a), D-11 (a) » | `manuelle_utilisateur` | TF-1028, TF-1178, TF-1224, TF-1023 | `decision` — la validation d'une barre, le périmètre d'une étude, la marque et la publication vous reviennent | les défauts écrits sous chaque décision s'appliquent |
| **A-2** | Passer les barres retenues à `ok`, puis les brancher dans `digit-ai-propale`, `digit-ai-communication` et l'arbitre de `digit-ai-propale-review` | `auto_ia` | TF-1028 | `dependance_bloc_3` — attend D-6 et D-7 | les propales et les mémoires restent sans niveau externe |
| **A-3** | Publier `f4b06a9` et `006acd7` : `git fetch`, porte des noms, push, relevé final | `auto_ia` | TF-1026, TF-1223 | `dependance_bloc_3` — attend D-11 (a) | le sixième entrant et le manifeste aligné ne vivent que sur ce poste |
| **A-4** | Écrire au gabarit `gabarits\AGENT-CAMPAGNE.md` la consigne de rejouer la recette de l'agrégateur, et clore TF-1224 | `auto_ia` | TF-1224 | `dependance_bloc_3` — attend D-9 (a) | la consigne reste recopiée à la main dans chaque prompt de campagne |
| **A-5** | Lancer l'étude complémentaire des réseaux sociaux | `auto_ia` | TF-1178 | `dependance_bloc_3` — attend D-8 (a) | le type de run « animation de réseau » reste écrit sur le seul LinkedIn |
| **A-6** | Appliquer D-10 chez le produit : ouvrir `c:\dev\digit-ai-marketing` dans VS Code, y lancer une session et écrire « Applique D-10 (a) de la synthèse 20260921f du pilot » | `manuelle_utilisateur` | TF-1023 | `acces` — le pilot n'a aucun mandat d'écriture chez un produit ; seule une session ouverte chez lui l'écrit ; mesure : le relevé d'ouverture de cette session rend « produits suivis : 24 dépôt(s) relevé(s) — aucun mandat déclaré : toute écriture chez eux sera refusée » | TF-1023 reste en cours |
| **A-7** | Ouvrir chez le produit le premier cas réel de publications, le plan de mesure et le registre des issues : même geste, en écrivant « Ouvre le palier V2 des publications, TF-1160, TF-1159 et TF-1031 » | `manuelle_utilisateur` | TF-1160, TF-1159, TF-1031 | `acces` — le pilot n'a aucun mandat d'écriture chez un produit ; seule une session ouverte chez lui l'écrit ; mesure : le relevé d'ouverture de cette session rend « produits suivis : 24 dépôt(s) relevé(s) — aucun mandat déclaré : toute écriture chez eux sera refusée » | la voie d'animation de réseau reste prouvée à blanc seulement |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- `digit-ai-forge-conception` : `f4b06a9`, local, avance 1 sur `origin/main`.
- `digit-ai-forge-agents` : `006acd7`, local, avance 1 sur `origin/main`.
- Pilot : `7d34047` sur `report/complement-20260921`, local ; main et `origin/main` inchangés.
- `todo/TODO.jsonl` : 5 événements, TF-1026, TF-1223 (2), TF-1028, TF-1023.
- Sources web lues ce tour, 2 documents PDF tiers :
  `https://www.marche-public.info/wp-content/uploads/2020/05/exemple-memoire-technique-oeap.pdf`,
  `https://www.cclpa.fr/sites/cclpa.fr/files/inline-files/Exemple%20de%20trame%20de%20m%C3%A9moire%20technique.pdf`.
- Scripts du tour : dossier temporaire de la session, non versés au dépôt.
- Aucune page HTML livrée dans ce tour ; rien publié sur un service hébergé.
