---
destinataire: humain
---

# Synthèse Mandat — six travaux faits, onze décisions instruites, publication du pilot en attente de votre feu vert (15/10/2026)

## 0. Synthèse d'ouverture

Les six travaux que vous avez retenus sont faits et vérifiés. L'outil qui dépose le travail chez les produits n'accuse plus le registre à tort : les neuf sujets qu'il disait perdus vont à des produits de l'autre poste. Trois comptes rendus qui partageaient un indice sont renommés, et la liste des modèles en service est à jour. La version des gabarits d'audit monte désormais d'elle-même, et cette correction est publiée. Les produits liront les classes et le gabarit des lots au pilot au lieu d'en garder une copie qui dérive. Onze décisions qui vous reviennent ont maintenant leur fiche complète. Il vous reste à dire si le pilot peut publier, et à trancher ces onze décisions quand vous le voudrez.

## 1. En-tête d'identification

Synthèse de clôture de la réponse « 1a » du 15/10/2026 à la décision de la synthèse « Sujets traitables maintenant », sur le pilot digit-ai-factory et la forge forge-audit, poste DESKTOP-ULTRA7. Période : 15/10/2026 de 21:33 à 22:20, heure de Paris (UTC+02:00), soit 47 min. Session pilote Claude Opus 5.5 ; 5 agents : 3 Sonnet pour les fiches et la correction de forge-audit, 1 Opus pour la correction d'héritage du pilot (construction complexe), escalade consignée ici.

Intention de la demande : faire avancer, sans attendre personne, tout ce que la session pouvait faire avancer, et vous laisser seulement ce qui vous revient, prêt à trancher.

Test rétro : le résultat sert cette intention. Les travaux sont faits et vérifiés, et ce qui reste à votre main est réduit à des choix fermés, une fiche par sujet. Un point corrige la lettre de ma propre annonce : le « défaut de localisation » n'en était pas un, et c'est le message de l'outil qui a été corrigé (bloc 6).

## 2. Verdict en une ligne

6 travaux sur 6 faits ; 3 sujets clos sur 3 avec contrôle rouge → vert ; 11 fiches complètes sur 11 ; 7 recettes touchées vertes (38/38, 43/43, 20/20, 34/34, 20/20, 90/90, 10/10) ; forge-audit publiée à 0 commit d'écart ; pilot non publié.

## 3. Décisions attendues

Un bloquant d'abord : la publication du pilot. Mes six enregistrements sont empilés sur quatre enregistrements de l'autre session de ce poste, qui attendent votre feu vert. Pour lever le blocage, il faut votre accord de publication ; si rien n'est fourni, rien ne part, ce poste reste en retard sur l'état publié, et les produits ne reçoivent ni la reprise multi-poste ni les relais d'héritage. Viennent ensuite les onze décisions instruites, rangées par coût du statu quo : histoire publiée et noms d'abord, doctrine ensuite, valeurs d'un produit en dernier.

> **D-2 — Le pilot peut-il publier ses dix enregistrements en attente, les quatre de l'autre session et mes six ?**
>
> L'autre session de ce poste a fusionné la reprise multi-poste et attend votre feu vert pour publier ; elle dit que son contrôle avant envoi l'exige pour ses enregistrements. Mes six enregistrements de ce tour sont posés par-dessus les siens, dans une copie séparée de l'arbre de travail : un seul feu vert publie les dix.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md`, R-38 § 6, qui donne au pilot un feu vert permanent pour son propre travail mais réserve le travail d'une autre session ; et le message de l'autre session reçu à 20:56. Les recettes touchées par mes six enregistrements sont vertes ; la garde de publication rejoue la recette complète avant tout envoi.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Publier les dix maintenant, sous la garde de publication | Faible × court : la garde dure environ 9 min | La garde peut encore refuser ; aucun envoi sans son verdict |
| (b) Publier mes six seuls, réordonnés sur l'état publié | Faible × court | L'autre session devra fusionner à nouveau, et son registre entrera en conflit avec le mien |
| (c) Ne rien publier | Nul | Ce poste reste en retard, et les produits ne reçoivent pas les corrections du jour |

> **Si rien n'est décidé** : (c), les dix enregistrements restent sur ce poste.

> **D-3 — Faut-il purger l'histoire publiée du pilot des noms que le journal des relevés d'héritage y a écrits en clair ?**
>
> Le journal des relevés d'héritage du pilot a écrit en clair, depuis début septembre, des noms de produits que la table des pseudonymes ne connaissait pas, et ces noms sont lisibles dans l'histoire d'un dépôt public ; la cause est corrigée, il reste à décider si l'on purge cette histoire publiée et ce qu'on fait de cinq noms encore hors table.
>
> **Avantages** : Mesuré le 22/09 : dix valeurs distinctes en clair dans le journal publié, aucune dans la table des noms interdits ; une seule est identifiée comme le nom d'une plateforme client ; Fuite stoppée depuis le 23/09 : le relevé écrit un marqueur pour tout produit inconnu, et le journal suivi repasse sous pseudonymes (167 valeurs, 0 hors pseudonyme ni marqueur) ; Une purge faite en une seule passe permet ensuite d'inscrire les cinq noms restants à la table sans bloquer les envois des dépôts (qui les portent dans six messages d'enregistrement déjà publiés).
> **Inconvénients** : Geste irréversible : l'histoire du dépôt est réécrite et publiée de force ; la branche principale n'est pas protégée chez l'hébergeur (réponse 404 le 22/09), donc le refus ne viendra pas de là ; Tous les clones du pilot divergent et doivent être reclonés, pas fusionnés ; une copie qui n'est pas ancêtre de la nouvelle histoire garde l'ancienne atteignable (arborescence liée, remisages) : sur ce poste, une arborescence liée (8 valeurs) et deux remisages (9 et 8 valeurs) sont concernés ; Deux branches publiées secondaires portent aussi ces valeurs (9 et 5) : à réécrire ou à retirer dans le même geste, sinon la purge de la branche principale les laisse lisibles ; Les empreintes de commit citées au registre deviennent orphelines : 106 relevées le 16/09 pour une autre purge, non remesurées pour celle-ci ; Une purge ne retire pas ce qu'un tiers a déjà copié depuis la publication : non mesuré.
> **Impacts** : Pilot : réécriture des commits publiés depuis le 03/09 (trois semaines au 22/09), publication forcée soumise à l'accord de publication ; Histoire publiée : empreintes de toutes les révisions postérieures au 03/09 changées sur trois branches publiées ; Postes de travail : au moins deux postes à recloner, avec sauvegarde en paquet hors dépôt avant le geste ; Forges et produits : non touchés directement (aucun n'est réécrit), mais leurs messages d'enregistrement qui citent ces noms restent lisibles si la table n'est pas étendue ; Registre : empreintes de commit citées à vérifier après coup.
>
> **Recommandation : (b).** Source consultée : todo/TODO.jsonl, notes de TF-1323 des 22/09, 23/09, 26/09, 12/10 et 13/10/2026 ; references/TODO-FORGE.md (mode opératoire de réécriture d'historique, TF-0752, et la mention des 106 empreintes, section du 16/09) ; vecteurs locaux : TF-1008 ; mesure de la protection de branche : note du 22/09 (HTTP 404). Aucune des dix valeurs n'est un nom de la table des noms interdits et une seule est identifiée comme nom client : l'urgence d'une purge irréversible n'est pas établie tant que personne n'a dit si les cinq restantes sont sensibles. Qualifier coûte peu, et si la réponse est oui, la purge se paie une seule fois avec le sigle du sujet voisin. L'humain a déjà choisi le 23/09 de ne pas réécrire (exclusion acceptée) ; cette fiche ne rouvre que ce qui reste.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Purger l'histoire publiée maintenant, en une seule passe avec le sigle du sujet voisin, puis inscrire les cinq noms restants à la table | élevé × long | ne retire pas les copies déjà faites par des tiers ; ne dispense pas du reclonage des deux postes ni du traitement des deux branches secondaires et des vecteurs locaux |
| **(b)** *(recommandée)* Faire d'abord dire par la personne porteuse lesquels des cinq noms restants sont sensibles, et ne purger que si l'un l'est, dans une passe commune avec le sigle du sujet voisin | faible × court | ne purge rien aujourd'hui : les noms restent lisibles dans l'histoire publiée tant que la qualification n'est pas faite ; n'inscrit aucun nom tant qu'une purge n'est pas décidée |
| **(c)** Ne pas purger et laisser les cinq noms hors table (repli) | faible × court | les dix noms restent lisibles dans l'histoire publiée du dépôt public ; les cinq noms restants ne sont arrêtés par aucune porte ; la fuite à venir reste couverte par le marqueur seulement |

> **Si rien n'est décidé** : (c) Ne pas purger et laisser les cinq noms hors table (repli).


> **D-4 — Ce sigle est-il un nom à protéger, à inscrire aux tables de protection et à substituer dans les fichiers suivis du pilot ?**
>
> Deux produits emploient un même sigle de projet pour se nommer eux-mêmes ; aucune des deux tables de protection des noms ne le porte, si bien que la porte de publication ne l'a jamais arrêté et qu'il est publié dans de nombreux fichiers du pilot.
>
> **Avantages** : Mesuré le 01/10/2026 : le sigle figure dans 22 fichiers suivis publiés ; mesuré de nouveau le 15/10 en recherche littérale insensible à la casse : 30 fichiers suivis de la branche principale locale ; Aucun message de commit ne le porte (0 sur la branche principale et sur toutes les références locales, mesure du 15/10) : l'inscrire aux tables ne bloquerait pas les envois par la règle qui juge les messages ; Le relevé à la réception est livré : un sigle de même forme est désormais signalé à l'entrée d'un lot, sans refus, pour qu'on le qualifie avant qu'il voyage.
> **Inconvénients** : Seule la personne porteuse sait si le sigle désigne une identité à protéger : le code ne peut pas le déduire ; Si c'est un nom à protéger, l'histoire déjà publiée le garde lisible (21 commits ont touché ce texte depuis le 11/08, mesure du 15/10) ; le nettoyer suppose une purge irréversible, traitée dans le sujet voisin ; La substitution dans l'état courant touche des dizaines de fichiers suivis dont le registre et ses archives : exception à la règle d'immutabilité à accepter explicitement ; Le relevé ne voit que la forme « tient une séquence » : une désignation écrite autrement lui échappe.
> **Impacts** : Pilot : tables de protection (canal confidentiel) et 30 fichiers suivis, dont des lignes du registre, à rendre propres par enregistrement ordinaire ; Deux produits dont les lots emploient le sigle : leurs lots à venir seront substitués à la réception une fois la table inscrite ; Publication : la porte de publication est à rejouer après substitution ; l'histoire déjà publiée n'est pas modifiée ; Autre poste : doit récupérer la table du canal confidentiel.
>
> **Recommandation : (a).** Source consultée : todo/TODO.jsonl, notes de TF-1540 des 02/10, 12/10 et 13/10/2026 ; todo/designation-projet.mjs (relevé livré) ; mesures du 15/10/2026 par git grep -F -i et git log -S / --grep sur la branche principale locale et toutes les références (sigle non recopié ici). Inscrire est réversible, peu coûteux et sans effet de blocage (aucun message de commit concerné), alors que ne pas inscrire laisse le sigle gagner des fichiers à chaque lot. La purge de l'histoire reste un geste distinct à décider avec le sujet voisin. Les mesures du 15/10 sont des comptes de correspondances littérales sur un sigle de quatre caractères, à relire avant de s'en servir pour autre chose qu'un ordre de grandeur.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Oui : inscrire le sigle aux tables, le substituer dans l'état courant des fichiers suivis, puis rejouer la porte de publication | moyen × court | ne nettoie pas l'histoire déjà publiée (purge séparée, irréversible, décidée avec le sujet voisin) ; ne couvre pas une désignation écrite autrement que dans la phrase relevée |
| **(b)** Non : déclarer que ce sigle n'est pas un nom sensible et le consigner au registre, sans rien inscrire | faible × court | le sigle reste publié tel quel ; si l'avis change plus tard, l'inscription et la substitution restent à faire |
| **(c)** Ne rien décider pour l'instant (repli) | faible × court | le sigle reste non protégé et publié dans les fichiers suivis ; chaque nouveau lot des deux produits en ajoute, seul l'avertissement à la réception le signale |

> **Si rien n'est décidé** : (c) Ne rien décider pour l'instant (repli).


> **D-5 — Faut-il activer le rattachement dans le canal confidentiel en déclarant le pseudonyme le plus récent de ce produit comme alias du plus ancien ?**
>
> Un même produit a reçu deux pseudonymes selon la façon dont son nom s'écrit, ce qui empêche les règles qui comparent les lots d'un même produit de les voir ensemble ; le code qui rattache un nom entrant au pseudonyme existant est livré mais ne sert à rien tant que le canal confidentiel n'a pas été réglé.
>
> **Avantages** : Mesuré le 28/09 : le produit a cinq lots antérieurs dans son dossier, et l'oracle de lot en voit zéro (« aucun identifiant repris des 0 lot(s) antérieur(s) du même produit ») ; Le code est livré et rejoué : recette de rattachement 6 cas sur 6 verts contre 2 sur 6 avant ; la racine publiée du lot concerné rend bien le pseudonyme ancien ; Le pseudonyme ancien (inscrit le 27/09) est le moins répandu dans le dépôt : 19 fichiers suivis contre 23 pour le récent (mesure du 15/10), donc l'alias porte sur le plus grand nombre de fichiers déjà écrits.
> **Inconvénients** : Il faut amender la règle d'unicité de l'oracle du canal pour qu'un alias déclaré ne soit plus compté comme un doublon : une règle opposable change ; Le rattachement n'efface rien : les fichiers déjà publiés restent sous le pseudonyme récent ; Les lots archivés le 14/08 sous un troisième nom ne sont rattachés que si leur racine est déclarée : non mesuré ; Le canal est un dépôt privé distinct, à mettre à jour et à publier, et à reprendre par l'autre poste.
> **Impacts** : Canal confidentiel : table des produits (nouveau bloc de rattachements) et oracle du canal (règle d'unicité amendée) ; Pilot : l'ingestion des lots affiche déjà un avertissement de double pseudonyme et rattache les noms entrants une fois le bloc posé ; Produit concerné : ses lots à venir comparables à ses cinq lots antérieurs par les règles d'identifiants ; Histoire publiée : aucune modification.
>
> **Recommandation : (a).** Source consultée : todo/TODO.jsonl, notes de TF-1432 des 28/09, 12/10 et 13/10/2026 ; todo/anonymiser-entrant.mjs (pseudonymeDeRacine, rattachements) ; table des produits du canal confidentiel : pas de bloc de rattachements au 15/10 ; comptes de fichiers par git grep sur la branche courante le 15/10 ; oracle du canal, règle d'unicité. L'alias est le chemin déjà codé et testé, il ne réécrit rien et se défait en retirant le bloc ; la fusion coûte beaucoup plus pour le même résultat pour les règles de comparaison.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Activer : amender la règle d'unicité, poser le bloc de rattachements et déclarer le pseudonyme récent comme alias de l'ancien | moyen × court | ne renomme aucun fichier déjà écrit ; ne fusionne pas les deux pseudonymes dans la table ; ne rattache pas le troisième nom sans racine déclarée |
| **(b)** Fusionner pour de bon : ne garder qu'un seul pseudonyme, remplacer l'autre dans la table et dans les fichiers suivis de l'état courant | élevé × moyen | n'efface pas le pseudonyme abandonné de l'histoire publiée ; demande une exception à l'immutabilité des archives du registre ; touche jusqu'à 42 fichiers suivis (19 et 23 selon le pseudonyme, recoupement possible) |
| **(c)** Ne rien activer : le code reste en sommeil et les deux pseudonymes demeurent (repli) | faible × court | les règles qui comparent les lots de ce produit continuent de n'en voir aucun ; chaque graphie nouvelle ouvre un pseudonyme de plus |

> **Si rien n'est décidé** : (c) Ne rien activer : le code reste en sommeil et les deux pseudonymes demeurent (repli).


> **D-6 — Autorisez-vous la dépense d'une campagne d'environ 70 exécutions de modèle pour que des agents proposent des modifications à la consigne de restitution, mesurées sur une part des cas tenue à l'écart, aucune modification n'entrant en service sans votre décision ?**
>
> Une campagne d'agents proposerait des modifications à la consigne qui cadre les fins de tour, chacune mesurée sur une partie des cas gardée à l'écart ; elle consomme des exécutions de modèle et la décision d'engager cette dépense revient à l'humain après la revue de la première étape.
>
> **Avantages** : La consigne de restitution a le banc le plus riche : 514 refus en 41 jours, donc de quoi apprendre ; La première étape est livrée et a donné une mesure en main : banc de mutation de 10 oracles (69 mutations, 94 % détectées, un défaut de juge trouvé), 26 restitutions refusées sur 26 encore refusées, 5 paires fautif/corrigé sur 5 dont les fautifs sont toujours refusés ; Garde-fous prévus : le juge reste hors de portée des agents, l'empreinte des oracles est relevée, chaque proposition reste à l'état de candidature avec sa mesure avant et après, rien n'est en service sans décision humaine ; Le critère de réussite est chiffrable : une proposition qui baisse le taux de refus sur la part tenue à part, sans hausse ailleurs.
> **Inconvénients** : Dépense chiffrée au registre : environ 70 exécutions de modèle, soit 3,5 h, repère de 70 $ au prix de liste ; borne fixée d'avance mais non rejouée ici ; Gain non garanti : les skills auto-écrits sans validation ont dégradé les résultats dans une étude citée (−1,3 point en moyenne, jusqu'à −11,5), et aucun essai n'a encore été mené ici ; Modifie une doctrine centrale : la consigne qui cadre toutes les fins de tour ; Dette : une archive de variantes à ranger.
> **Impacts** : Le porteur : tranche la dépense, puis les propositions retenues en revue hebdomadaire ; Toutes les sessions du pilot, dont les fins de tour sont encadrées par cette consigne ; La suite de l'étude : le niveau suivant (jugement des changements de la boucle elle-même, diffusion aux forges puis aux produits) attend la revue de cette étape.
>
> **Recommandation : (a).** Source consultée : Registre des améliorations, note du 13/10/2026 sur la candidature (chiffrage : environ 70 exécutions, 3,5 h, repère 70 $ au prix de liste) et synthèse du 13/10/2026 (output/04-plans/, campagne du matin reprise et close, 20261013h) ; output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md, sections 5 (étape 2, critère de réussite, retour arrière, plan de revue) et « Candidatures proposées » (514 refus en 41 jours) ; mesures de l'étape 1 au registre, gains constatés de la candidature sur les bancs auto-étiquetés. L'étape 1 a tenu et a produit les mesures que l'étude exigeait avant l'étape 2 ; la dépense est bornée d'avance, réversible (rien n'entre en service sans décision) et le risque identifié par l'étude est couvert par la part tenue à l'écart. La décision reste humaine car elle engage une dépense et touche une doctrine.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Autoriser la campagne (environ 70 exécutions, 3,5 h, 70 $ au prix de liste) sur la seule consigne de restitution, et juger ses résultats à la revue prévue, mesures en main | élevé × moyen | n'inclut ni la mise en service d'une proposition sans votre décision, ni la modification d'un oracle, ni le niveau suivant de l'étude |
| **(b)** Ne retenir que la mesure sur une part des cas tenue à l'écart : un humain ou une session propose les modifications à la main et les mesure sur ce banc, sans campagne d'agents | moyen × court | pas de propositions multiples par des agents ; pas de dépense en exécutions de modèle au-delà des sessions ordinaires ; l'apport de la boucle de proposition n'est pas éprouvé |
| **(c)** Laisser en attente | faible × court | aucune dépense, aucune campagne ; la consigne n'évolue que par les corrections ordinaires après refus ; c'est ce qui s'applique si rien n'est décidé |

> **Si rien n'est décidé** : (c) Laisser en attente.


> **D-7 — Faut-il aligner la doctrine sur le référentiel d'audit pour les trois contrôles bloquants en contradiction (déploiement par pipeline exclusif, contrôle de sauvegarde à la mise en production, règle sur le fournisseur d'identité) ?**
>
> Un produit a franchi toutes les étapes de sa construction puis échoué de nombreux contrôles du référentiel d'audit de la maison ; la déclaration de couverture des domaines est livrée, mais trois contradictions entre la doctrine et ce référentiel restent à trancher.
>
> **Avantages** : Mesuré sur un produit réel : 12 contrôles bloquants non tenus sur 175 au référentiel d'audit, dont ces trois contradictions ; Trancher supprime une incohérence : la doctrine ne peut pas valider ce que l'audit de la même maison refuse ; La déclaration de couverture des cinq domaines sans propriétaire est déjà livrée, en avertissement.
> **Inconvénients** : Interdire la route de déploiement manuelle à porte change le parcours de mise en production de tous les produits ; Ajouter un contrôle de sauvegarde à l'oracle de mise en production peut rougir des produits aujourd'hui verts : taux d'accusation non mesuré ; Effort de rédaction et de mise en œuvre : non mesuré.
> **Impacts** : La doctrine de mise en production et l'oracle de mise en production de la forge qui outille la MEP ; Tous les produits à venir, et les produits déjà livrés au prochain passage ; L'humain, qui garde la porte de mise en production.
>
> **Recommandation : (a).** Source consultée : references/ETAPES-RUN.md (déclaration de la couverture des dimensions d'audit, passage « ce que la règle ne fait pas ») ; todo/TODO.jsonl (note du 13/10) ; commit e9b8af51 ; REGLES-PROJET.md, règle de couverture des dimensions d'audit. Les trois points sont des contrôles bloquants du référentiel de la même maison ; l'écart assumé reste ouvert si l'humain refuse une exigence précise.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Aligner la doctrine sur le référentiel d'audit : pipeline exclusif, contrôle de sauvegarde à l'oracle de mise en production, règle sur le fournisseur d'identité | élevé × moyen | Ne rend pas ces contrôles bloquants d'emblée si l'humain préfère un passage en avertissement d'abord ; ne touche pas aux produits déjà livrés |
| **(b)** Garder la doctrine actuelle et déclarer les trois contradictions comme écarts assumés au référentiel d'audit, avec leur motif | faible × court | Les produits continuent d'échouer ces trois contrôles bloquants à l'audit, de façon assumée |
| **(c)** Laisser les trois contradictions en l'état | faible × court | Chaque audit de produit les relèvera de nouveau, sans décision consignée |

> **Si rien n'est décidé** : (c) Laisser les trois contradictions en l'état.


> **D-8 — Quels garde-fous faut-il proposer par défaut à un dossier de travail qui englobe un produit, en les déléguant à ceux du produit ?**
>
> Quand une session s'ouvre dans un dossier qui contient le produit sans être le produit, aucun des garde-fous de la doctrine ne s'exécute et rien ne l'annonce ; la détection existe désormais, mais on n'a pas décidé quels garde-fous poser dans ce dossier englobant.
>
> **Avantages** : Constaté le 08/09 : plusieurs heures de travail, trois commits, un déploiement et deux restitutions sans qu'aucun garde-fou d'ouverture ni de fin de tour ne se déclenche ; La détection du défaut est déjà livrée : la session le nomme à l'ouverture, avec le geste qui répare ; Le produit concerné a déjà posé et vérifié le 09/09 un fichier de réglages qui ne délègue que la reconnaissance du lexique d'invocation.
> **Inconvénients** : Un garde-fou posé au dossier englobant juge aussi tous les messages écrits pour les dossiers voisins du produit ; Le gabarit d'héritage compte plusieurs familles de garde-fous (ouverture, lexique, restitution, publication, identité sortante, remisage) : les reporter toutes élargit la portée ; Nombre de produits imbriqués dans un dossier client : non mesuré.
> **Impacts** : Le gabarit d'héritage du pilot et le fichier de réglages que les produits reçoivent ; Les produits livrés dans un dossier de travail client, qui sont le cas le plus courant ; Le jugement de chaque message écrit depuis le dossier englobant.
>
> **Recommandation : (a).** Source consultée : todo/TODO.jsonl (notes du 09/09, 14/09 et 19/09) ; oracles/oracle-portee-doctrine.mjs règles PD3 et PD4 (message du constat) ; gabarits/settings-produit.json (liste des garde-fous du gabarit). C'est la seule portée déjà éprouvée par le produit ; élargir change le jugement de tous les messages du dossier et doit se décider sur mesure, pas par défaut.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Ne proposer au dossier englobant que le garde-fou du lexique d'invocation, déjà posé et vérifié par le produit, et le valider en gabarit | faible × court | Ne reporte ni l'ouverture, ni la restitution jugée, ni les refus avant outil : leur absence reste seulement signalée par la détection |
| **(b)** Proposer au dossier englobant tous les garde-fous du gabarit, chacun délégué au produit par chemin préfixé | moyen × moyen | Ne dit pas comment protéger les dossiers voisins du produit, dont les messages seraient jugés à tort |
| **(c)** Laisser en l'état : la détection nomme le défaut et rien n'est proposé au dossier englobant | faible × court | Une session ouverte au-dessus du produit reste hors doctrine tant que l'humain n'ouvre pas la session dans le produit |

> **Si rien n'est décidé** : (c) Laisser en l'état : la détection nomme le défaut et rien n'est proposé au dossier englobant.


> **D-9 — Faut-il brancher cette garde sur l'outil PowerShell dans la configuration du pilot ?**
>
> Une redirection vers le puits des systèmes POSIX, jouée par PowerShell sous Windows, crée un fichier à la racine du parc et y écrit ce qu'on croyait jeter ; la garde qui refuse ce geste est écrite et testée, mais elle n'est pas branchée dans la configuration du pilot.
>
> **Avantages** : Mesuré le 26/09 : le fichier fautif pesait 117 octets à 08:27 et 13 530 octets à 10:25, réécrit par une session voisine sans qu'aucune garde ne l'empêche ; le fichier existe toujours, à 13 530 octets (mesure du 15/10) ; La garde est livrée : recette de 8 cas sur 8 verts ; elle indique le remède (écrire la valeur nulle de PowerShell) ; Elle laisse passer une citation de la redirection dans un message de commit ou un texte (les chaînes entre guillemets et les here-strings sont ignorées) et ne touche pas à l'outil Bash, où le puits est réel ; Le contrôle d'ouverture efface déjà seul un tel fichier s'il est vide (0 octet) et signale sa date quand il ne l'est pas.
> **Inconvénients** : Elle refuse la commande entière : un faux positif bloque le tour jusqu'à réécriture ; taux de faux positifs non mesuré ; Elle ne voit pas une redirection bâtie dynamiquement, un script lancé par PowerShell qui redirige ailleurs, ni les formes sans barre oblique : seul l'amorçage les signale après coup ; Elle ne protège pas les produits, où la câbler est une décision séparée ; Un réglage de configuration appliqué à toutes les sessions du pilot : son retrait se fait par la même voie.
> **Impacts** : Pilot : toutes les sessions qui utilisent l'outil PowerShell passent par la garde ; réglage versionné dans le dépôt du pilot, donc repris par l'autre poste à la mise à jour ; Produits et forges : non touchés ; Fichier existant à la racine du parc : n'est pas supprimé par ce choix ; l'effacer reste un geste humain ; Publication : aucune.
>
> **Recommandation : (a).** Source consultée : todo/TODO.jsonl, création de TF-1584 (04/10) et notes du 13/10/2026 ; oracles/hook-puits-windows.mjs (en-tête) et sa recette ; commit 0a8fd4c9 ; .claude/settings.json (PreToolUse sans cette garde au 15/10) ; état du fichier à la racine du parc le 15/10. Le geste est réversible, peu coûteux, déjà testé, et ne touche que le pilot ; l'étendre aux produits relève d'une règle neuve à décider séparément. L'effacement du fichier existant reste à faire par l'humain, hors de ce choix.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Brancher la garde en refus sur l'outil PowerShell dans la configuration du pilot | faible × court | ne supprime pas le fichier déjà présent ; ne couvre pas les produits ni les formes dynamiques ou indirectes |
| **(b)** Brancher la garde chez le pilot et proposer aux produits un câblage en avertissement d'abord, par leur gabarit d'ouverture | moyen × moyen | ne supprime pas le fichier déjà présent ; le câblage chez les produits reste une règle neuve à décider produit par produit |
| **(c)** Ne pas brancher la garde : elle reste livrée mais dormante, et seul le signalement à l'ouverture subsiste (repli) | faible × court | rien n'empêche qu'une session réécrive le fichier fautif ; le contenu ne se contrôle qu'après coup |

> **Si rien n'est décidé** : (c) Ne pas brancher la garde : elle reste livrée mais dormante, et seul le signalement à l'ouverture subsiste (repli).


> **D-10 — Faut-il retenir l'absence de secret client comme posture du guide, avec le secret au coffre en repli déclaré comme écart borné dans le temps, ou au contraire retenir le secret au coffre avec échéance comme voie normale ?**
>
> Le guide de mise en production d'une application écrit à un endroit qu'aucun secret client n'est créé, et à un autre qu'un secret est déposé au coffre avec une échéance ; il faut dire laquelle des deux postures fait foi.
>
> **Avantages** : Mettrait fin à une contradiction interne du guide, constatée par le développeur du produit qui a dû trancher seul entre deux de ses règles ; Fixerait une posture unique pour toutes les mises en production suivant ce guide ; Option (a) : s'aligne sur la règle du socle qui n'admet de secret client que lorsqu'une identité fédérée ne suffit pas, et sur la proposition esquissée dans le retour d'origine ; Effort d'écriture estimé à une ligne à trancher dans le guide : coût de migration des configurations déjà posées non mesuré.
> **Inconvénients** : Choix de doctrine de sécurité, pas coquille : retenir une posture engage toutes les mises en production suivantes ; Option (a) : demande d'ajuster les configurations existantes qui déposent déjà un secret sans le déclarer en écart ; coût de cette migration non mesuré ; Option (b) : abaisse le niveau de sécurité affiché par défaut et contredit la règle du socle sur les identités fédérées ; Une posture plus stricte peut demander plus de travail d'intégration selon les environnements : non mesuré.
> **Impacts** : Le texte à corriger vit chez un produit : appliquer le choix suppose un lot de travaux à lui adresser ; La forge d'audit, dont les contrôles jugent aujourd'hui sur la règle qui écrit « aucun secret client » ; Les développeurs qui suivent le guide et ceux dont la configuration existante dépose déjà un secret.
>
> **Recommandation : (a).** Source consultée : Fiche d'options inscrite au registre le 02/10/2026 (relue : contradiction toujours présente) ; lot de retours du 24/09/2026 du produit, input/00-retours/, retour RX-9 et sa proposition esquissée (voie sans secret documentée pour App Service, secret au coffre en repli déclaré comme écart) ; décision d'architecture voisine sur les clients sans secret : C:/dev/digit-ai-forge-audit/core/adr/07-app-int/ADR0703-consommation-api-clients-sans-secrets.md. La réévaluation du 24/09/2026 avait déjà qualifié ce choix de doctrine de sécurité. Le texte corrigé vit chez le produit, pas dans la forge d'audit (le guide cité n'existe pas dans ses fichiers) : choisir (a) ou (b) déclenche donc un lot de travaux au produit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Retenir « aucun secret client » comme posture par défaut, avec identité fédérée, et traiter le dépôt d'un secret au coffre comme un écart déclaré et borné dans le temps | moyen × court | demande d'ajuster les configurations existantes qui déposent déjà un secret sans le déclarer en écart |
| **(b)** Retenir le secret au coffre avec échéance comme voie normale, et retirer du guide la mention d'absence de secret client | moyen × court | abaisse le niveau de sécurité affiché par défaut du guide et s'écarte de la règle du socle sur les identités fédérées |
| **(c)** Laisser en attente | faible × court | la contradiction reste dans le guide, chaque lecteur continue de trancher seul ; c'est ce qui s'applique si rien n'est décidé |

> **Si rien n'est décidé** : (c) Laisser en attente.


> **D-11 — Faut-il reprendre l'outil de consignation d'un verdict par contrôle et rendre le juge bloquant à la clôture du run ?**
>
> Le juge qui confronte les contrôles découverts aux verdicts consignés au journal d'un run est livré et joué à la clôture à titre informatif ; il reste à décider si on construit l'outil qui consigne un verdict par contrôle, pour pouvoir le rendre bloquant.
>
> **Avantages** : Mesuré : 174 contrôles découverts sur 14 dépôts, contre 19 sur 76 derrière une découverte automatique avant ; Une variante déjà écrite le 24/09 existe en sauvegarde : l'outil de consignation et le blocage à la clôture pour les runs au schéma récent ; Sans cet outil, le juge ne peut pas être bloquant : il n'a aucun verdict à lire.
> **Inconvénients** : Sur les journaux réels, le juge rend un échec sur les deux runs du seul produit qui déclare ses forges mobilisées ; Un juge bloquant peut empêcher la clôture d'un run : taux de faux rejets non mesuré ; La reprise touche la forge d'outils, qui doit être republiée : non mesuré.
> **Impacts** : La forge d'outils (journal de run et clôture), le pilot (séquence d'un run) et les produits au schéma récent ; Tous les runs futurs, dont la clôture pourrait être refusée ; Le temps de chaque run : non mesuré.
>
> **Recommandation : (b).** Source consultée : todo/TODO.jsonl (notes du 23/09, 26/09, 27/09, 28/09 et 12/10/2026) ; sauvegarde de synchronisation du 28/09 (paquets de la forge d'outils et du pilot) ; étude du 19/08 sur le méta-oracle d'enclenchement, section du verdict en trois temps. Le juge échoue déjà sur les deux runs qui le subissent ; le rendre bloquant avant d'avoir mesuré ses faux rejets risquerait de bloquer des clôtures à tort.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Reprendre depuis la sauvegarde l'outil de consignation et le blocage à la clôture, pour les runs au schéma récent | moyen × moyen | Ne mesure pas d'abord les faux rejets sur les runs passés ; bloque dès la livraison |
| **(b)** *(recommandée)* Reprendre l'outil de consignation seul, garder le juge informatif, et ne le rendre bloquant qu'après une mesure des faux rejets sur plusieurs runs | moyen × moyen | Ne bloque aucune clôture tant que la mesure n'est pas faite |
| **(c)** Laisser le juge informatif et ne pas construire l'outil | faible × court | Le juge ne pourra jamais devenir bloquant ; l'enclenchement des contrôles reste observé, pas imposé |

> **Si rien n'est décidé** : (c) Laisser le juge informatif et ne pas construire l'outil.


> **D-12 — Faut-il réécrire les deux règles perdues (largeurs de contenu mélangées, doute invisible) comme candidatures neuves, ou clore en déclarant leur perte ?**
>
> Deux règles de contrôle des pages, écrites sur un poste et jamais publiées, ont disparu des deux postes ; il faut décider si on les réécrit ou si on déclare leur perte.
>
> **Avantages** : Mesuré le 14/09 : l'une des deux règles a relevé 2 constats sur 41 pages livrables, tous deux sur une même famille de gabarits ; La vérification du 14/10 a établi la perte sur les 13 forges, les copies installées des skills et les sauvegardes du 19 et du 20/09 ; Le dépôt distant et ce poste sont à 0 écart depuis le 12/10 : réécrire ne rouvre aucune divergence.
> **Inconvénients** : La numérotation a changé : une autre règle porte aujourd'hui l'ancien numéro de la première, il faudra des numéros neufs ; Le coût de réécriture : non mesuré ; Clore en déclarant la perte laisse sans contrôle le défaut que la première règle détectait.
> **Impacts** : Le socle des pages HTML de la forge d'outils, lu par toutes les pages livrées ; Les familles de gabarits du pilot, dont l'une portait le défaut de largeur ; La publication du socle, soumise au feu vert de publication déjà consigné.
>
> **Recommandation : (b).** Source consultée : todo/TODO.jsonl (note du 14/10/2026 sur la vérification, et mesure du 14/09 sur 41 pages, ajoutée au sujet de la largeur des pages). Seule la règle de largeurs a un chiffre de détection ; pour l'autre, aucune mesure n'est consignée, donc rien ne justifie de la réécrire d'avance.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Réécrire les deux règles comme deux candidatures neuves, chacune avec son juge et ses essais dans les deux sens | moyen × moyen | Ne récupère pas le texte perdu ; ne rouvre pas le chantier de fusion entre postes |
| **(b)** *(recommandée)* Réécrire seulement la règle de largeurs mélangées, qui a une mesure, et déclarer l'autre perdue | faible × court | Le défaut de doute invisible reste sans contrôle jusqu'à un nouveau constat |
| **(c)** Clore en déclarant la perte des deux règles | faible × court | Aucun contrôle ne remplace les deux règles ; un retour humain devra les redemander |

> **Si rien n'est décidé** : (c) Clore en déclarant la perte des deux règles.


> **D-13 — Fournissez-vous maintenant les trois valeurs qui manquent pour démarrer le premier cas réel de publications, à savoir la répartition des rôles sur les comptes, l'export de départ des statistiques et le temps humain hebdomadaire actuel en minutes ?**
>
> Le premier cas réel de gestion de réseaux sociaux (le profil du dirigeant, quatre semaines, une publication par semaine) est prêt côté documents, mais ne peut pas démarrer tant que l'humain n'a pas fourni trois faits qu'aucune IA ne peut poser sans les inventer.
>
> **Avantages** : Tout le reste est déjà déposé chez le produit depuis le 21/09 : un objectif à 4 semaines avec 3 indicateurs et leur seuil, 2 personas, la ligne éditoriale, le calendrier et la première publication rédigée ; Le contrôle du dossier de la semaine rend aujourd'hui 4 règles vertes sur 7 ; les 3 rouges sont exactement l'accord du dirigeant, le relevé de mesures et la fiche de l'émetteur, donc les entrées humaines ; Sans le temps humain actuel en minutes, aucun gain ne peut se démontrer : le fournir dès maintenant rend la mesure avant/après possible dès la première semaine.
> **Inconvénients** : Demande un effort humain : décrire qui tient quel rôle sur chaque compte, si le double facteur est activé, ce qui se passe au départ d'une personne, puis exporter les statistiques de départ et chronométrer une semaine type ; La fiche de l'émetteur porte des faits sur des personnes réelles : elle ne s'écrit qu'en rôles, jamais avec un identifiant ni un mot de passe, et le contrôle refuse la fiche qui en évoque un ; Durée de collecte du temps humain hebdomadaire : non mesurée.
> **Impacts** : Le dirigeant, qui donne ensuite l'accord de publication par lot hebdomadaire et valide la fiche, les objectifs et les personas ; Le produit qui porte l'instance, dont le dossier de publications attend ces valeurs pour passer de « ouvert » à « exercé » ; La page de l'organisation, qui relaie sans calendrier propre en attendant ce premier cas.
>
> **Recommandation : (a).** Source consultée : Registre des améliorations : mesure du 22/09/2026 sur le produit (3 règles rouges du contrôle de la semaine : accord, mesures, fiche de l'émetteur) ; references/RUN-RESEAU.md section « La séquence », étape 0 (contenu de la fiche de l'émetteur, état de départ, temps humain hebdomadaire) ; output/03-etudes/20260917-etude-opportunite-gestion-reseaux-sociaux.md section 5. Les trois valeurs sont des faits sur des personnes et des comptes réels : les inventer reviendrait à écrire un faux dans un fichier de gouvernance. La note du 13/10 les résume en « objectifs, personas sources, calendrier », mais ces trois-là sont déjà déposés depuis le 21/09 ; ce qui manque réellement est la gouvernance, l'export de départ et le temps humain.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Fournir les trois valeurs maintenant, en une réponse : (1) gouvernance, une ligne par compte au format « compte ; qui tient quel rôle ; double facteur oui ou non ; ce qui se passe au départ d'une personne », rôles seulement ; (2) l'export manuel de départ des statistiques de chaque compte, déposé dans le dossier des mesures du produit ; (3) le temps humain hebdomadaire actuel, un nombre de minutes par semaine, programmation comprise | moyen × court | n'inclut pas l'accord de publication, qui se donne ensuite par lot hebdomadaire après lecture de la première publication, ni la validation de la fiche, des objectifs et des personas |
| **(b)** Voie réduite : fournir seulement la répartition des rôles sur les comptes et l'export de départ, et relever le temps humain en minutes pendant la première semaine plutôt qu'avant | faible × court | le gain ne se démontre qu'à partir du relevé de la première semaine : la comparaison avant/après de ce premier cas est affaiblie ; aucune des trois valeurs n'est inventée ni estimée par une IA |
| **(c)** Reporter : le dossier reste ouvert sans publication, comme aujourd'hui | faible × court | aucune publication ne paraît, aucun gain n'est mesuré, la capacité reste décorative ; rien ne s'applique de plus que l'état actuel |

> **Si rien n'est décidé** : (c) Reporter : le dossier reste ouvert sans publication, comme aujourd'hui.


## 4. Traité

- **Outil de dépôt des lots : un produit absent du poste n'est plus un orphelin (TF-1828, créé, décidé et clos).**
  - Mesure : les 8 produits « orphelins » sont connus de la table des pseudonymes et n'ont aucun dossier sur ce poste, recherche à 6 niveaux ; le 9e est un produit déclaré de l'écosystème.
  - Rouge → vert : recette `todo/emettre-travaux.test.mjs` 37 → 38 PASS, le cas neuf échoue sur le module d'avant. Parc réel : 9 « absents du poste », 0 orphelin (avant : 9 orphelins, sortie en échec). Classe : contrôle vrai sur le mauvais invariant.
- **3 comptes rendus du 01/10 réindexés.** Le plus récent de chaque paire passe de g, h, i à l, m, n, avec ses compagnons de jugement ; l'index du dossier est régénéré par l'enregistrement.
- **Liste des modèles en service en 1.2.0.** `oracle-modeles-en-service` : MS2 FAIL (« claude-sonnet-5-5 plus récente que la courante ») → verdict PASS ; recette 31/31. Date relevée dans les transcriptions : première réponse le 03/10 à 15:58 UTC.
- **Version des gabarits d'audit (TF-1820, décidé et clos).** forge-audit f82aa77 : contrôle `version-gabarit`, rouge « contenu modifié sans montée de version (reste 1.0.0) », vert « 14 gabarits, versions cohérentes » ; recette 7/7 rejouée par le pilot, `npm test` 13/13 étapes. Publié : `git rev-list --left-right --count HEAD...origin/main` rend « 0 0 ».
- **Gabarit des lots et référentiel des classes par relais (TF-1821, décidé et clos).**
  - Rouge → vert : cas TF-1821 de `scripts/relever-heritage.test.mjs`, 41 PASS 2 FAIL sous le contrat 1.26.0, 43/43 sous 1.27.0.
  - Rejoué par le pilot après réunion des deux correctifs : recopier-heritage 20/20, hook d'ouverture 34/34, lanceur des hooks 20/20, contrôle de lot 90/90, outil de dépôt 38/38, ingestion R-47 10/10.
- **11 fiches de décision au registre.** `todo/revue-hebdo.mjs` (`manques`) : aucun champ manquant sur 11 ; aucun identifiant dans les textes rendus ; 0 nom des tables confidentielles sur 90 comparés. Rendues au bloc 3 par le rendu officiel de la revue.
- **Registre.** `journaliser.mjs` : « 18 événement(s) journalisé(s) », puis 1 ; `oracle-todo` PASS après chaque écriture. Défaut voisin trouvé par l'agent d'héritage inscrit en candidat : TF-1829.

## 5. Non traité

- **Publication du pilot.** Motif : dependance_bloc_3, attend D-2.
- **Recette complète du pilot.** Motif : lancée à 21:52, encore en cours à la rédaction ; la garde de publication la rejoue de toute façon avant envoi (D-2).
- **Échec de l'outil de dépôt sur l'autre poste, où le dossier d'un produit existait.** Motif : non reproductible d'ici ; la note du registre le rapporte, et seule une session de l'autre poste peut le mesurer.
- **Les autres copies conformes chez les produits.** Motif : le correctif d'héritage ne couvre que le canal des lots ; la consigne de restitution et le lanceur des hooks dérivent encore de la même façon, dit au registre.
- **Re-test de la règle de challenge des modèles.** Motif : il exige une campagne à deux tranches comparables, aucune n'est prévue.
- **TF-1829, défaut voisin du relevé d'ouverture.** Motif : gate_gouvernance, il entre en candidat et attend une décision.

## 6. Écarts à la lettre

Un écart, sur ma propre annonce.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Corriger le défaut de localisation des produits | Corrigé le message de l'outil de dépôt, pas la localisation | La mesure a montré que les produits étaient absents du poste : la localisation était juste, le message accusait le registre à tort |

## 7. Risques

- **Les produits reçoivent les relais d'héritage à leur prochaine ouverture.**
  - Énoncé : deux fichiers de chaque produit sont remplacés par un relais, que le produit devra enregistrer une fois.
  - Signal : le relevé d'héritage, qui les dira « non commis » jusqu'à cet enregistrement.
  - Parade : le relais exige le pilot sur le poste, comme le contrôle de lot qui le fait déjà.
- **Deux sessions publient sur la même branche.**
  - Énoncé : si l'autre session publie seule, mes enregistrements devront être réordonnés sur les siens.
  - Signal : un enregistrement neuf sur l'état publié avant D-2.
  - Parade : D-2 (a) publie les deux ensemble.

## 8. Prochaines actions

La publication passe en premier, parce que les produits n'en reçoivent rien avant ; l'application des décisions ensuite.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1821 | Publier les dix enregistrements du pilot selon D-2 | auto_ia | dependance_bloc_3 : attend D-2 | `FORGE_PUSH_GO="D-2 (a) du 15/10" git -C .claude/worktrees/c2-lot push origin HEAD:main` | Ce poste reste en retard, les produits ne reçoivent pas les corrections |
| **A-2** | `neuve` | Appliquer les options retenues en D-3 à D-13, une clôture par sujet | auto_ia | dependance_bloc_3 : attend D-3 à D-13 | `node todo/journaliser.mjs --fichier <décisions>` | Les onze sujets restent bloqués |
| **A-3** | TF-1829 | Instruire le défaut voisin du relevé d'ouverture | auto_ia | gate_gouvernance : candidat en attente de décision | `node todo/revue-hebdo.mjs --self-test` | Un verdict persistant peut rester masqué à l'ouverture |
| **A-4** | `neuve` | Trancher D-2 à D-13 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `2a, 3b, 4a` | Les options par défaut s'appliquent |

## 9. Traces

- Branche du pilot `c2-sujets-traitables`, arbre `.claude/worktrees/c2-lot` : 42bd0e27, 6ae9f5f9, 78dc3967, 1b7817a8, f86cd4c4
- forge-audit : f82aa77, publiée
- `todo/TODO.jsonl` (TF-1820, TF-1821, TF-1828, TF-1829, 11 fiches), `todo/CLASSES.json` (1.41.0), `gabarits/HERITAGE.json` (1.27.0), `references/MODELES-EN-SERVICE.json` (1.2.0)
