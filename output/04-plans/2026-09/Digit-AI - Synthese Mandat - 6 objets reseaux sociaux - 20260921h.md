---
destinataire: humain
---

# Les 6 objets du verdict des réseaux sociaux sont construits et vérifiés ; il reste à publier la forge des agents

## 0. Synthèse d'ouverture

Votre choix « 12a » est exécuté : les 6 objets existent. Le run d'animation de réseau ne vaut plus
pour le seul LinkedIn. Il s'ouvre sur une fiche qui dit qui émet et sur quels réseaux, il accepte
une légende d'image, un texte court ou une réponse à un avis, et l'accord humain couvre le lot de
la semaine. Un référentiel décrit 9 réseaux, chaque ligne avec sa page officielle et sa date. Le
fait faux sur LinkedIn est retiré. Rien n'est publié : 1 enregistrement attend chez la forge des
agents, 14 au pilot. Tant que la forge n'est pas publiée, le contrôle de la semaine ne marche que
sur ce poste. Ce qui est attendu de vous : 1 décision, publier la forge des agents.

## 1. En-tête d'identification

- **quoi** — exécution de votre message « 12a », sur la décision D-12 de la synthèse 20260921g.
- **sur quoi** — `digit-ai-forge-agents`, écrit sous le mandat permanent des forges ; le pilot
  `digit-ai-factory`, branche locale `report/complement-20260921` ; 9 plateformes et
  `web.archive.org`, en lecture seule ; le produit `digit-ai-marketing`, non touché.
- **quand** — le 21/09/2026, de 20h05 à 20h39 (Europe/Paris), heures relevées par `date`.
- **qui** — session pilot Claude Fable 5.1 ; 1 agent de recherche délégué, modèle Sonnet, 98
  appels d'outils, en lecture seule ; escalade de modèle : aucune.
- **intention** — qu'un émetteur autre que Digit-AI, sur un réseau autre que LinkedIn, puisse être
  servi par la factory sans rien improviser. **Test rétro** : une semaine à blanc de 3
  publications sur 3 réseaux, pour un commerce de proximité, passe les 7 règles du contrôle ;
  l'intention est servie à blanc, et pas encore en vrai, aucun cas réel n'existant.

## 2. Verdict en une ligne

**6 travaux clos sur 6**, TF-1274 à TF-1279 · forge-agents `f6d7d90` : self-test du skill **PASS**,
recette de `quality-oracles` **PASS 313 contrôles**, 3 modèles de publication, 5 contrats · pilot
`d20e70b` : `oracle-run-reseau --self-test` **9/9 PASS**, 7 règles · référentiel à 9 réseaux :
`oracle-ecriture` **PASS**, 2 citations d'archive relues, conformes · harnais du pilot **129/131**,
2 défauts « parc réel », expliqués · registre : 12 événements, 1 candidat versé, TF-1280,
`oracle-todo` **PASS** · 0 publié.

## 3. Décisions attendues de vous

1 décision. Aucun bloquant : rien n'est à l'arrêt.

> **D-13 — L'enregistrement de la forge des agents part-il sur GitHub maintenant ?**
>
> La forge des agents est en avance de 1 enregistrement, `f6d7d90` : les 3 modèles de publication
> et le fichier des contrats de sortie. Le contrôle de la semaine du pilot lit ce fichier. Sur ce
> poste il le trouve, et son autotest rend 9 cas verts sur 9. Sur l'autre poste il ne le trouvera
> pas tant que la forge n'est pas publiée, et il rendra alors un échec, jamais un vert par défaut :
> c'est voulu. L'ordre compte donc : la forge d'abord, le pilot ensuite. Tant que la forge n'est
> pas publiée, le poste n'est pas propagé non plus, et l'oracle des skills du pilot signale que la
> copie installée du skill de communication diverge de la forge sur 4 fichiers. La publication du
> pilot, elle, reste sous la décision D-4 de la synthèse 20260921e, que je ne repose pas ici.
>
> **Recommandation : (a).** Source consultée : la règle R-38 (tout push attend le GO humain) ;
> mesure du tour : `git status -sb` rend `ahead 1` chez forge-agents, self-test du skill PASS,
> recette de `quality-oracles` PASS à 313 contrôles, et `oracle-skills` rend K2 FAIL sur le parc
> réel pour ces 4 fichiers.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je publie la forge des agents : relevé de GitHub, porte des noms au `pre-push`, push, propagation au poste, rejeu de l'oracle des skills | effort simple × court | exclut une relecture humaine du détail avant publication |
| (b) vous relisez d'abord, puis vous me dites de publier | effort moyen × moyen | exclut une publication aujourd'hui ; l'oracle des skills reste rouge d'ici là |
| (c) l'enregistrement reste local | nul | exclut que l'autre poste puisse jouer le contrôle de la semaine ; le harnais du pilot y serait rouge dès la publication du pilot |

Comment faire pour l'option (b) : 1) ouvrir un terminal ; 2) lancer
`git -C c:\dev\digit-ai-forge-agents show f6d7d90` ; 3) me dire de publier.

> **Si rien n'est décidé** : l'option (c) s'applique — l'enregistrement reste sur ce poste.

## 4. Traité — avec sa preuve

- **TF-1277 : 3 modèles de publication de plus, et leurs contrats en donnée.** Le skill
  `digit-ai-communication` passe de 8 à 11 modèles : légende d'image pour Instagram et Facebook,
  texte court pour Threads, X et Bluesky, avis et fiche d'établissement à 2 écritures. Chacun a son
  contrat de sortie binaire. L'avis d'un client est une donnée, jamais une consigne : l'IA
  propose, l'humain publie. La part mécanisable des 5 contrats vit dans
  `references\contrats-publication.json`. Preuve : `f6d7d90` ; self-test du skill PASS ; son
  contrôle neuf, qui tient la prose et le fichier des contrats alignés, porte 3 fixtures rouges,
  chacune dérivée du réel par une seule altération.
- **TF-1278 : le contrôle de la semaine est paramétré.** `oracles\oracle-run-reseau.mjs` ne porte
  plus aucun contrat en dur. Il juge chaque publication du lot contre le modèle qu'elle déclare.
  L'accord doit nommer tout le lot. Une règle neuve, RR7, juge la fiche « émetteur et réseaux » et
  refuse tout ce qui évoque un secret. Preuve : autotest 9/9 PASS — 1 semaine verte à 3
  publications, 1 semaine rouge sur les 7 règles, 6 altérations qui rougissent chacune 1 seule
  règle et nomment ce qu'elles voient, et des contrats absents qui rendent FAIL.
- **Le type de run est réécrit.** `references\RUN-RESEAU.md` porte la fiche d'ouverture, la
  gouvernance des comptes, l'accord par lot hebdomadaire et la programmation par l'humain dans
  l'outil gratuit de la plateforme. Aucun outil maison de diffusion. La vidéo reste dehors, donc
  TikTok et YouTube aussi. Preuve : `d20e70b` ; plancher d'écriture à 2 règles rouges avant, 1
  après, celle qui reste étant un titre que tous les fichiers de type de run partagent.
- **TF-1275 : le référentiel à 9 réseaux existe.** `references\PLATEFORMES-RESEAUX.md`, indexé :
  5 faits par réseau, citation mot pour mot, adresse, date, et une solidité à 5 valeurs. Preuve :
  `oracle-ecriture`, rouge au premier passage sur 1 titre, verte au second ; `oracle-claude-md`
  exit 0.
- **TF-1274 : le fait faux sur LinkedIn est retiré.** Le référentiel LinkedIn dit maintenant que
  la programmation est gratuite, de 10 minutes à 3 mois, et il dit qu'il s'était trompé. Preuve :
  recette de relecture — la phrase fautive n'a plus qu'1 occurrence dans `references\`, celle qui
  la cite pour la démentir ; citation relue sur la page d'aide.
- **TF-1276 : les 8 autres réseaux sont déclarés aux intégrations.** 6 faits avec leur coût et la
  façon de les rejouer. Sur LinkedIn l'absence de connecteur est imposée ; ici elle est choisie,
  et le texte le dit. Preuve : 1 réseau déclaré sur 9 avant, 9 après.
- **TF-1279 : 8 lignes rejouées, 3 passent en source officielle.** Instagram programme 25
  publications par jour jusqu'à 30 jours, quand des sources tierces écrivent 75. Threads programme,
  selon le compte officiel du réseau. X étiquette les médias générés pour les lecteurs de l'Union
  européenne. YouTube et la fiche Google ne publient aucun horizon chiffré : c'est une réponse, et
  elle est écrite. Preuve : 2 citations relues par `curl` sur les copies d'archive, HTTP 200 et
  texte conforme ; 10 mentions « à rejouer » au référentiel avant, 0 après.
- **Le compte des réseaux qui programment passe de 6 à 7 sur 9.** Aligné dans les 3 références.
  L'étude 20260921a, livrable daté, garde son chiffre.
- **Le registre porte 12 événements et 1 candidat neuf, TF-1280.** Preuve : `oracle-todo` PASS
  avant et après chaque écriture.

## 5. Non traité — avec son motif

- La publication de `f6d7d90` et la propagation au poste : motif `decision` — voir D-13.
- La publication de la branche locale du pilot, 14 enregistrements avec cette synthèse : motif
  `decision` — elle suit D-4 de la synthèse 20260921e.
- 4 faits sans page officielle lue : l'export des chiffres d'Instagram et de TikTok, la gratuité
  des interfaces de Meta, la programmation et les chiffres de X. Motif `borne_atteinte` — le
  centre d'aide de X rend HTTP 403 et 404, et ses copies d'archive sont illisibles ; le
  référentiel les marque « secondaire » ou « non trouvé ».
- Le défaut de l'oracle des empreintes au harnais : motif `hors_mandat` — il vient d'un script
  créé chez le produit de communication à 17h31 par une autre session ; versé en candidat TF-1280.
- Une barre de qualité externe pour les 3 modèles neufs : motif `borne_atteinte` — aucune n'existe,
  et les 2 barres déjà prêtes attendent toujours votre validation.
- L'écriture de la règle des 2 teintes chez le produit : motif `hors_mandat` — inchangé depuis la
  synthèse 20260921g.
- Un cas réel : motif `hors_mandat` — il s'ouvre chez un produit ; tout ce tour est prouvé à blanc.

## 6. Écarts à la lettre

- **Vous avez choisi (a), je recommandais (b).** J'ai construit les 2 objets que je proposais
  d'attendre, sans réserve. Le registre garde la trace que la recommandation a été écartée.
- **La candidature demandait d'étendre le référentiel LinkedIn en un référentiel à 9 réseaux.**
  J'ai créé un second fichier et laissé le premier en place. **Pourquoi** : 13 fichiers citent le
  premier par son nom, dont des gabarits qui le citent mot pour mot.
- **J'ai laissé la date de vérification du référentiel LinkedIn au 17/09.** J'y ai relu 1 fait,
  pas le document.
- **Le contrôle de la semaine dépend maintenant d'un fichier de la forge des agents.** C'est le
  sens de la demande, et c'est une dépendance de plus entre 2 dépôts.
- **J'ai enregistré un fichier que le harnais avait modifié lui-même**, sa ligne de base des
  recettes : le nombre de cas de cet autotest y passe de 2 à 9.
- **Une solidité de plus est née au référentiel**, « officiel (archive) », que l'étude ne
  prévoyait pas.

## 7. Risques

- **Le pilot est publié avant la forge des agents.**
  - signal : sur l'autre poste, `node oracles\oracle-run-reseau.mjs --self-test` rend FAIL sur RR2.
  - parade : publier la forge d'abord ; D-13 le propose, et le registre l'écrit sur TF-1278.
- **Les 3 modèles sont conçus sans cas réel.**
  - signal : le premier commerce de proximité servi demande un format que les 5 contrats refusent.
  - parade : le contrat est une donnée ; il se corrige dans 1 fichier, et le self-test du skill tient la prose alignée.
- **Une copie d'archive fait foi à tort.**
  - signal : la page vive dit autre chose que la capture.
  - parade : le référentiel date chaque capture et écrit qu'une archive ne prouve que le passé.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Trancher D-13 — répondre « D-13 (a) », « D-13 (b) » ou « D-13 (c) » | `manuelle_utilisateur` | TF-1277 | `decision` — publier sur GitHub vous revient (R-38) | l'option (c) s'applique : le contrôle de la semaine ne marche que sur ce poste |
| **A-2** | Publier `f6d7d90`, propager au poste, rejouer l'oracle des skills | `auto_ia` | TF-1277 | `dependance_bloc_3` — attend D-13 (a) | l'oracle des skills reste rouge sur 4 fichiers |
| **A-3** | Trancher la publication de la branche locale du pilot — répondre « D-4 (a) », au sens de la synthèse 20260921e | `manuelle_utilisateur` | neuve | `decision` — publier sur GitHub vous revient (R-38) | 14 enregistrements du pilot ne vivent que sur ce poste |
| **A-4** | Trancher les 2 barres de qualité restées ouvertes — répondre par exemple « D-6 (a), D-7 (a) », au sens de la synthèse 20260921f | `manuelle_utilisateur` | TF-1028 | `decision` — la validation d'une barre n'est pas sautable et vous revient | les propales et les mémoires restent sans niveau externe |
| **A-5** | Ouvrir un cas réel chez un produit : ouvrir son dossier sous `c:\dev` dans VS Code, y lancer une session et écrire « Ouvre un run d'animation de réseau, fiche émetteur et réseaux d'abord, selon RUN-RESEAU du pilot » | `manuelle_utilisateur` | TF-1160 | `acces` — le pilot n'a aucun mandat d'écriture chez un produit ; mesure : le relevé d'ouverture de cette session rend « produits suivis : 24 dépôt(s) relevé(s) — aucun mandat déclaré : toute écriture chez eux sera refusée » | tout reste prouvé à blanc |
| **A-6** | Trancher le candidat TF-1280 : un fichier non suivi d'un produit doit-il faire rougir le harnais du pilot | `manuelle_utilisateur` | TF-1280 | `decision` — faire passer un candidat en décidé vous revient | le harnais du pilot reste à 129 sur 131 pour une cause étrangère |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- `digit-ai-forge-agents` : `f6d7d90`, local, avance 1 sur `origin/main`.
- Pilot, branche locale `report/complement-20260921` : `d20e70b`, puis l'enregistrement de cette
  synthèse ; main et `origin/main` inchangés.
- Fichiers neufs : `references\PLATEFORMES-RESEAUX.md` au pilot ;
  `references\contrats-publication.json` chez forge-agents.
- `todo/TODO.jsonl` : 12 événements (6 décisions, 6 clôtures, TF-1274 à TF-1279) et 1 création
  (TF-1280, lot `a282fcfcaa20`).
- Agent délégué : 1, routage par défaut Sonnet, rapport intégré au référentiel ; escalade : aucune.
- Scripts du tour : dossier temporaire de la session, non versés au dépôt.
- Aucune page livrée dans ce tour ; rien publié sur un service hébergé.
