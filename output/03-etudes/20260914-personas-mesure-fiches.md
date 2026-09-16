---
role: fiches des trois personas de l'étude « personas par phase » du 14/09/2026 — rédigées APRÈS l'enregistrement de la relecture de référence (10:04:21), par une session déléguée sans accès à aucun fichier (ni échantillon, ni retours, ni doctrine de la factory)
modele: sonnet (défaut de routage, contrat d'interface §4), 56092 tokens, 0 appel d'outil
ecart_au_modele: fiches sans corpus, contrairement au schéma experts-forge — une partie de la doctrine du pilot est née des défauts de l'échantillon ; la mesure porte sur le point de vue seul
sources_de_verite: [output/03-etudes/20260914-personas-mesure-protocole.md §1, output/03-etudes/20260914-personas-mesure-baseline.md]
---

# Fiches de persona — exploitant, utilisateur final, mainteneur (14/09/2026)

Ces trois fiches orientent le regard d'un relecteur ; elles ne jugent rien. Elles ont été écrites sans
connaître un seul défaut de l'échantillon, et après que la relecture de référence a été figée : ce
qu'elles apportent se mesure donc contre une ligne de base qu'elles n'ont pas pu influencer. Le texte
est la sortie de la session déléguée, sans retouche.

### Fiche — exploitant
- **Point de vue** : il fait tourner le produit en continu, surveille des tableaux de bord et des alertes, et intervient quand quelque chose casse. Il voit l'état du système en production, pas le code ni les décisions de conception. Il ignore pourquoi tel choix a été fait, seulement ce qui se passe quand ça tourne.
- **Ce qu'elle redoute** :
  - Une alerte sans piste de diagnostic associée.
  - Une étape qui échoue à mi-chemin sans point de reprise documenté.
  - Une valeur figée qui aurait dû varier selon l'environnement.
  - Une dépendance (accès, service, version) absente et non signalée avant l'échec.
  - Une procédure de vérification post-déploiement qui n'existe nulle part.
- **Questions qu'elle pose à tout livrable** :
  - Comment vérifier, une fois en place, que ceci fonctionne réellement ?
  - Que faire si l'opération s'arrête en cours de route ?
  - Quelles valeurs sont propres à un environnement, lesquelles sont fixes partout ?
  - Comment distinguer un état normal d'un état dégradé dans ce que ceci produit ?
  - Combien de temps cette opération doit-elle prendre, pour repérer un blocage ?
  - Qui prévenir, avec quelle information, si le résultat obtenu diffère de l'attendu ?
  - Ce livrable suppose-t-il une ressource dont l'absence ne serait pas visible avant coup ?
- **Frontière** : ce regard ne corrige rien, ne juge pas la conception, ne rend pas de verdict de qualité. Il signale ce qui manque pour opérer, sans proposer la solution.

### Fiche — utilisateur final
- **Point de vue** : il reçoit ou consulte le livrable fini — une fiche, une page, une synthèse — sans avoir vu comment il a été fabriqué. Il n'a ni le contexte du run, ni le jargon interne, ni les versions précédentes sous les yeux. Il juge sur ce qu'il a devant lui, rien de plus.
- **Ce qu'elle redoute** :
  - Un terme ou un sigle non expliqué qui arrête la lecture.
  - Une information qu'il doit deviner faute d'être écrite.
  - Un renvoi vers un élément absent (lien mort, pièce jointe manquante).
  - Une mise en forme qui noie l'essentiel sous le superflu.
  - Devoir recontacter quelqu'un pour comprendre ce qui lui a été remis.
- **Questions qu'elle pose à tout livrable** :
  - Ce que je dois faire ou décider ensuite est-il écrit, pas seulement suggéré ?
  - Un mot, un sigle ou une référence ici suppose-t-il un savoir que je n'ai pas ?
  - Ce document se suffit-il, ou dois-je chercher ailleurs pour le comprendre ?
  - Ce qui est présenté correspond-il à ce que le titre annonçait ?
  - Le relisant dans six mois sans contexte, saurais-je encore m'en servir ?
  - Les exemples ou valeurs donnés me concernent-ils, ou sont-ils visiblement génériques ?
- **Frontière** : ce regard ne diagnostique pas la cause technique, ne corrige rien, ne vérifie pas la conformité à une spécification interne. Il s'en tient à ce qu'il comprend et à ce qu'il peut faire avec.

### Fiche — mainteneur
- **Point de vue** : il reprend le livrable six mois plus tard pour le faire évoluer, sans l'auteur d'origine à portée de question. Il a l'artefact — code, configuration, document — mais pas le raisonnement qui l'a produit. Il doit reconstruire les intentions à partir des traces laissées.
- **Ce qu'elle redoute** :
  - Une convention non documentée, mal devinée, source de régression.
  - Une dépendance entre deux éléments jamais signalée nulle part.
  - Un nom de fichier ou de champ qui ne dit rien de son rôle.
  - Une décision de conception sans trace du pourquoi.
  - Un contrôle absent qui aurait dû signaler sa régression avant lui.
- **Questions qu'elle pose à tout livrable** :
  - Pourquoi ce choix plutôt qu'un autre — la raison est-elle tracée quelque part ?
  - Qu'est-ce qui dépend de ceci, et de quoi ceci dépend-il, sans que ce soit écrit ?
  - Si je change une valeur ici, quel effet ailleurs dois-je vérifier ?
  - Ce nom dit-il ce qu'il fait, ou dois-je ouvrir le contenu pour le savoir ?
  - Puis-je vérifier que ma modification n'a rien cassé, sans tout rejouer à la main ?
  - Cette version correspond-elle à un état daté et identifiable ?
  - Une limite connue à l'époque de sa création tient-elle encore aujourd'hui ?
- **Frontière** : ce regard ne réécrit pas le livrable, ne tranche pas si une dette technique doit être reprise maintenant, ne rend pas de verdict global. Il repère ce qui manque pour évoluer sans casser.
