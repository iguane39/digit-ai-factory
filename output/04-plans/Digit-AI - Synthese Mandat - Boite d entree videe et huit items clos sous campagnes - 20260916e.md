---
destinataire: humain
---

# Le sas d'arrivée n'était pas vide, et trois de vos retours d'écriture ont maintenant un juge

## 0. Synthèse d'ouverture

Quatre lots de retours dormaient dans le dossier d'arrivée depuis le 15 septembre, dont trois
sous un nom réel de client : ils sont entrés, anonymisés, et les 16 demandes qu'ils portaient
sont au registre. Les 19 demandes qui attendaient votre feu vert sont passées en décidées sous
votre mandat, et 17 sont corrigées avec leur mesure. Ce qui change pour vous :
les trois reproches d'écriture que vous avez faits le 15 septembre — la tournure « Ce que… », les
lignes de commande dans un guide qui ne s'adresse pas à des techniciens, et le contenu d'auteur
livré au lecteur — ne dépendent plus de la vigilance de qui écrit ; un contrôle les refuse
désormais au moment où le texte est écrit. Ce qui est attendu de vous : 3 arbitrages, dont un
qui bloque la publication de l'ensemble du dépôt principal.

## 1. En-tête d'identification

- **quoi** — mandat transverse « Traite tous les todos & les retours » : boîte d'entrée, registre
  d'améliorations, et 4 campagnes d'écriture sur les dépôts voisins.
- **sur quoi** — le pilot `digit-ai-factory` ; écritures mandatées chez `digit-ai-forge-data`,
  `digit-ai-forge-design` et `digit-ai-forge-agents` (commits locaux, aucun push).
- **quand** — le 16/09/2026, de 14h10 à 18h00 (Europe/Paris), durée 3 h 50. Les 4 campagnes ont
  rendu leur rapport ; aucun traitement ne court encore.
- **qui** — session pilot Claude Opus 5 ; dépôt passé de `b485ca3` à `d61c90d` ; 4 agents de
  campagne délégués (3 Opus 5, 1 Sonnet 5), escalade de modèle : aucune.
- **intention** — vider ce qui attend et faire baisser la file, pas seulement produire du travail.
  **Test rétro** : la file passe de 60 à 42 items ouverts *alors que* 16 demandes neuves y sont
  entrées dans le même tour ; sans elles, elle serait à 26. L'intention est tenue sur les deux
  bouts — ce qui attendait est entré, et ce qui était décidé a été fait.

## 2. Verdict en une ligne

**Boîte d'entrée FAIL → PASS** (4 lots, 16 demandes) · **19 candidats décidés** · **17 items clos
sur gains mesurés**, 4 remis en cours avec leur reste nommé, 1 réaffecté sur diagnostic exécuté ·
registre **exit 0**, 42 items ouverts contre 60 · harnais du pilot **122/123** · recettes natives
des 3 forges écrites : forge-data **273 PASS**, forge-design **48 oracles / 132 règles**,
quality-oracles **269 contrôles**, socle des pages **357/357** — toutes exit 0 · porte de
publication du pilot **FAIL, 299 constats sur un seul nom**.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** — chacun dit ce qu'il arrête, ce qu'il faut fournir, et ce qui
se passe si rien ne vient :

- **la publication du dépôt principal est à l'arrêt**, et elle l'était avant ce tour ; il faut
  trancher le statut d'un nom de dépôt de l'écosystème qui figure aussi dans la table des noms
  interdits ; sans ce choix, les 19 enregistrements locaux du pilot restent sur ce poste seul ;
- **la proscription complète de la tournure « Ce que » est à l'arrêt** sur 2 libellés ; il faut
  décider si le gabarit de restitution les réécrit ; sans ce choix, l'exemption datée reste en
  place et ces 2 libellés survivent ;
- **le verrou qui empêcherait une classe de défaut de se fermer sans juge est à l'arrêt** ; il
  faut choisir entre un refus immédiat et un cliquet ; sans ce choix, 30 classes sur 86 restent
  fermées sans protection exécutable, et les récidives continuent d'être comptées sans être
  évitées ;
- **l'unification des 2 moteurs de schéma de base de données est à l'arrêt**, et ce bloquant-là
  n'appelle pas d'arbitrage aujourd'hui : il faut d'abord qu'un mandat couvre la forge de
  l'audit, où vit l'autre moitié, puis trancher si l'on accepte de perdre le rendu anglais des
  rapports ou si l'on assume 2 moteurs déclarés ; sans cela, les 2 continuent de diverger, et le
  canevas dit au moins désormais ce que sa reprise coûterait ;
- **la migration des 1 716 exemptions de recouvrement en forme ancienne est à l'arrêt** ; il faut
  décider à quelle date la forme ancienne cesse d'être admise ; sans cette date, elle reste
  recensée mais jamais refusée, et la migration n'a aucune raison de commencer ;
- **la propagation vers les copies installées des skills est à l'arrêt** ; elle se joue au
  prochain démarrage de session, qui rejoue la fraîcheur du poste, et elle écrit hors de tout
  dépôt ; jusque-là ce qui s'exécute sur ce poste n'est plus ce qui est versionné, sur 5 skills.

> **D-1 — La publication du pilot est fermée sur un seul nom : est-ce le nom qui change, ou la table ?**
> La porte de publication refuse le dépôt du pilot sur 299 constats, et les 299 portent le même
> mot : le nom d'un dépôt de l'écosystème, qui vit dans la table des noms à masquer tout en étant
> le nom réel d'un dépôt que vous avez créé et que le relevé d'ouverture signale par ailleurs
> comme hors de la liste des forges suivies. Le nom est dans 82 fichiers suivis, dans le registre
> d'améliorations, et dans des messages d'enregistrement déjà écrits. Ce n'est pas un défaut de ce
> tour : il précède mon travail, et je n'y ai rien ajouté.
> **Recommandation : (a).** Source consultée : `oracle-nom-client-publie.mjs`, la porte de
> publication, rejouée ce jour sur le
> dépôt (299 constats, tous de la même règle et du même nom), et le relevé d'ouverture du poste,
> qui déclare ce dépôt « hors liste, avec son propre dépôt distant, jamais vérifié ». Les deux
> disent la même chose sous deux angles : cet objet n'a pas de statut tranché.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** retirer ce nom de la table des noms à masquer : c'est une marque à vous, pas un client | simple × court — une ligne de table, puis la porte se rejoue | exclut de le traiter comme un client, donc exclut aussi de le masquer si vous le confiez un jour à un tiers |
| **(b)** le garder masqué et réécrire les 82 fichiers | complexe × long, et une réécriture du passé du dépôt rendrait inutilisable toute copie existante | exclut de nommer ce dépôt en clair dans vos propres documents, y compris ceux que vous lisez |
| **(c)** ne rien décider | gratuit aujourd'hui | exclut toute publication du pilot : les 19 enregistrements locaux s'accumulent sur ce poste, et le nombre monte à chaque tour |

> **Si rien n'est décidé** : (c) s'applique — la publication du pilot reste fermée, rien ne se
> dégrade, et le travail des sessions du jour reste sur ce seul poste.

> **D-2 — Le gabarit de restitution impose 2 libellés de la tournure que vous avez proscrite : les réécrit-on ?**
> Vous avez demandé le 15 septembre d'arrêter d'employer « Ce que ce document tient », « Ce qu'il
> ne tient pas ». Un contrôle le refuse désormais en titre et en en-tête de colonne. Mais le
> gabarit des restitutions — celui qui produit le document que vous lisez — impose lui-même 2
> libellés de cette forme au tableau d'options de ce chapitre, et 3 juges les vérifient au mot
> près. Les proscrire sans réécrire d'abord le gabarit mettrait 2 gardiens du même socle en
> contradiction : toute restitution conforme au gabarit serait refusée par le contrôle d'écriture,
> et toute restitution conforme au contrôle serait refusée à la fin du tour. Les 2 libellés sont
> donc exemptés, l'exemption est datée et motivée dans la donnée, et elle porte le nom de cet
> arbitrage.
> **Recommandation : (b).** Source consultée : `gabarits/RESTITUTION.md`, où les 2 libellés
> apparaissent à 6 endroits, et les 3 contrôles qui les vérifient au mot près — `oracles/oracle-synthese.mjs`,
> `oracles/hook-restitution.mjs` et `oracles/hook-ouverture.mjs` —, plus 2 fixtures et 1 recette. La
> réécriture est mécaniquement sûre mais elle touche le dispositif qui juge chaque fin de tour :
> la faire à froid coûte moins cher que la faire pendant un tour de travail.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** réécrire les 2 libellés maintenant, dans le gabarit et ses 3 juges | moyen × court, mais le geste touche le contrôle qui juge chaque fin de tour : une erreur y bloquerait toutes les sessions | exclut de garder la comparaison visuelle avec vos restitutions antérieures, dont le tableau porte les anciens libellés |
| **(b)** réécrire à froid, dans un tour dédié, l'exemption restant en place d'ici là | simple × court aujourd'hui, moyen × court le jour venu | exclut de voir la tournure disparaître complètement avant ce tour dédié |
| **(c)** garder l'exemption définitivement | gratuit | exclut la proscription complète que vous avez demandée : ces 2 libellés survivraient dans chaque restitution |

> **Si rien n'est décidé** : (b) s'applique de fait — l'exemption datée reste en place, elle est
> lisible dans la donnée, et la lever plus tard coûtera l'édition d'une seule ligne.

> **D-3 — Une classe de défaut peut-elle être déclarée fermée quand aucun contrôle ne la joue ?**
> Vous avez demandé le 15 septembre de comprendre pourquoi des défauts déjà remontés plusieurs
> fois se reproduisent, et d'identifier comment les éradiquer. La mesure est faite, et elle
> répond : sur les 86 familles de défaut du référentiel, 56 nomment un contrôle qui existe et **30
> nomment un contrôle « à créer »**. Une famille fermée dont le juge reste à écrire n'est pas
> une protection, c'est une intention — et celui qui produit ne la rencontre nulle part sur son
> chemin. Par ailleurs 19 familles n'ont aucune correction fondatrice, ce qui est le signe inverse
> et se compte aussi.
> **Recommandation : (c).** Source consultée : `todo/CLASSES.json`, le référentiel des familles
> de défaut, mesuré ce
> jour, et la leçon N4 du noyau — « un contrôle qui crie sur l'usage légitime se fait désactiver
> dans la semaine ». Refuser d'un coup 30 familles sur 86 mettrait le registre au rouge du jour au
> lendemain, et l'histoire du parc dit ce qui arrive ensuite. Le cliquet obtient le même résultat
> sans le risque : il arrête l'hémorragie d'abord, il résorbe ensuite.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** refuser dès maintenant toute famille sans juge | simple × court à écrire, mais 30 familles passent au rouge immédiatement | exclut de garder le registre lisible : un tiers en défaut se lit comme une panne, et le contrôle finit désactivé |
| **(b)** publier le compte au tableau de bord, sans rien refuser | simple × court | exclut toute pression : un compte qu'on regarde sans conséquence ne fait baisser aucun chiffre |
| **(c)** un cliquet — refus d'une famille NEUVE sans juge, les 30 existantes déclarées et résorbées au fil des corrections | moyen × court, et les 30 mettent plusieurs tours à se résorber | exclut de fermer les 30 rapidement : elles se ferment au rythme des corrections qui les fondent |

> **Si rien n'est décidé** : (b) s'applique par défaut — le compte existe dans cette synthèse,
> il n'est publié nulle part, et rien n'empêche la 31e famille sans juge d'être créée demain.

> **D-4 — À quelle date la forme ancienne d'exemption de recouvrement cesse-t-elle d'être admise ?**
> Une exemption servait jusqu'ici d'interrupteur : posée sur un élément, elle éteignait le contrôle
> de recouvrement sur lui tout entier. Elle se déclare désormais par paire — les 2 identifiants dont
> le chevauchement est voulu —, et le contrôle voit à nouveau ce qu'elle avalait : un libellé de
> flèche imprimé dans la boîte voisine, qui avait traversé 2 livraisons et 4 exécutions des 3
> oracles. La forme ancienne n'a pas été supprimée : 1 716 occurrences ont été mesurées dans le
> parc ce jour, et les casser d'un commit rougirait tout le parc avant qu'aucune migration n'ait
> commencé. Elle est donc admise et RECENSÉE, page par page, avec le geste à faire.
> **Recommandation : (b).** Source consultée : le rapport de campagne du socle des pages, qui
> mesure les occurrences dans `.claude/skills/digit-ai-page-html/` et les dépôts qui le
> consomment, et qui signale cet écart comme le plus fort de ses 8 items. Le recensement rend la
> dette visible sans rien casser ; une date lui donne une fin, et l'absence de date la laisse
> croître.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** refuser la forme ancienne dès maintenant | simple × court à écrire, mais 1 716 occurrences passent au rouge avant toute migration | exclut de livrer quoi que ce soit tant que la migration n'est pas finie |
| **(b)** poser une date de fin d'admission, et migrer d'ici là au fil des pages touchées | moyen × long — la migration suit les pages qu'on rouvre, elle ne mobilise pas de tour dédié | exclut de fermer la dette rapidement |
| **(c)** garder la forme ancienne sans date | gratuit | exclut toute fin : le recensement devient un compteur qu'on regarde monter |

> **Si rien n'est décidé** : (c) s'applique — la forme ancienne reste admise, recensée, et les
> occurrences relevées n'ont aucune raison de baisser.

## 4. Traité — avec sa preuve

- **Le sas d'arrivée est vidé** : 4 lots y attendaient depuis le 15/09, dont 3 sous un nom réel
  de client.
  - preuve : `oracle-boite-entree` FAIL nommant les 4 sidecars, puis exit 0 après accueil et
    ingestion ; 16 demandes créées, toutes en candidat.
- **Les noms réels sont substitués avant toute écriture suivie** : 3 lots renommés à l'accueil,
  1 nom substitué au registre à l'ingestion.
  - preuve : sortie de l'accueil, `nom_reecrit: true` et `contenu_reecrit: true` sur les 3 lots ;
    ligne `[ANONYMISÉ] 1 nom(s) substitué(s) avant écriture au registre` à l'ingestion du 4e.
- **2 familles de défaut neuves créées au référentiel** : un lot avait été refusé pour 2 clés
  inconnues, et la sortie prévue pour le défaut vraiment neuf a été jouée.
  - preuve : rejet atomique de l'ingestion nommant les 2 clés et les clés proches, registre
    intact ; puis ingestion acceptée après création, avec le signalement « classe suspecte » que
    le dispositif émet pour toute famille créée sans correction fondatrice.
- **19 candidats passés en décidés** sous votre mandat global.
  - preuve : `19 décidé(s), 19 commenté(s)`, empreinte du lot de décisions consignée au registre.
- **TF-1137 — la tournure « Ce que » a un juge**, refusée en titre et en en-tête de colonne, où
  votre retour l'avait relevée.
  - preuve : contrôle rouge puis vert ; 31 textes refusés sur 484 jugés à la pose ; les
    6 producteurs qui la rejouaient à chaque génération passent au vert, la vue générée comprise ;
    autotest 16/16, exit 0, dont 3 cas à triple sens — titre et en-tête refusés, la même tournure
    dans le corps acceptée, le tableau imposé par le gabarit accepté.
- **TF-1142 — le contenu d'auteur ne part plus au lecteur** : une règle de doctrine, un juge, et
  la section de frontière ajoutée aux 5 familles de gabarits.
  - preuve : juge rouge sur 5 gabarits sur 5, puis vert sur 5 sur 5 ; l'oracle de la bibliothèque
    rend PASS. **La mesure a corrigé la demande** : les 5 familles déclaraient déjà leur lecteur,
    et la règle demandée aurait été verte sur le défaut même qu'elle existe pour attraper.
- **TF-1138 — les lignes de commande dans un guide qui ne s'adresse pas à des techniciens** : une
  règle neuve au plancher d'écriture, et un juge qui LIT le lecteur déclaré du document.
  - preuve : autotest, 3 sens prouvés — commande refusée quand le lecteur n'exécute pas, la même
    commande acceptée pour un exploitant, et non jugée quand le lecteur est inconnu ; un 4e
    contrôle vérifie qu'un bloc qu'on recopie n'est jamais compté.
- **TF-1044 et TF-1151 — le mot que votre lecteur ne lit pas, chez la forge des données**, classe
  `boucle-retour-sans-descente` :
  34 lignes de prose corrigées, les identifiants de code laissés intacts.
  - classe : `boucle-retour-sans-descente` — une correction close le 8 septembre qui n'était pas
    redescendue, et le juge posé ce tour la fait redescendre.
  - preuve : 125 occurrences mesurées au départ ; par fichier, 3 → 0, 2 → 0, 21 → 0, 5 → 0 ; la
    garde neuve a débusqué 2 occurrences en casse différente que la première mesure avait
    manquées, avant même sa mise en service ; recette native 273 PASS, 0 FAIL.
- **TF-1074 — deux variantes d'un visuel qui rendent pareil sont refusées**, y compris le cas que
  l'empreinte seule laissait passer.
  - preuve : recette native 47 oracles / 131 règles → 48 / 132 ; 4 vérifications nommées prouvent
    les 2 sens ; la fixture verte a la même taille et 11 octets d'écart, rien que les couleurs, et
    elle passe — la règle ne mesure donc pas une distance entre fichiers.
- **TF-1066 — un comparateur de rendu était resté à 5 largeurs** quand ses 2 voisins montaient
  à 7, dans le même dossier, depuis 4 jours.
  - preuve : 10 couples largeur × thème → 14 (+ 40 %), et 2 largeurs jamais comparées le sont ;
    la grille devient une donnée datée et sourcée, lue par 3 scripts au lieu d'exister en
    3 copies ; 12 vérifications et 2 fixtures rouges ajoutées, dont un verrou qui refuse qu'un
    script reprenne une grille en dur.
- **TF-1152 — le vocabulaire du destinataire est joué sur un support de présentation**, par appel
  du module existant et non par une liste maison.
  - preuve : recette 263 → 266 contrôles, exit 0 ; la porte native du dépôt, qui portait 1 échec
    hérité, est remise au vert avant la pose de la règle.
- **TF-1006 — le registre des oracles ne s'écrit plus que dans sa source**, et la cause mécanique
  a été trouvée : la valeur par défaut du générateur d'oracles visait la copie installée, et la
  commande d'exemple du skill l'écrivait noir sur blanc. L'auteur du 10 septembre a suivi la
  doctrine à la lettre ; c'est la doctrine qui l'envoyait au mauvais endroit.
  - preuve : recette 266 → 269 contrôles, exit 0, avec un contrôle DIRECTIONNEL — un domaine
    présent à la copie et absent de la source fait échouer, une source en avance ne fait pas
    rougir, sans quoi le banc serait rouge à chaque commit et le contrôle désarmé. Le volet
    resté sans réponse est mesuré par 2 sondes indépendantes : la comparaison des 2 arbres dans
    les 2 sens (installé 58 domaines, source 58, aucun écart), et la lecture des 2 sauvegardes
    d'août laissées par le geste fautif, qui portent 46 domaines tous présents aujourd'hui à la
    source. Les 2 sondes concordent. Borne dite, et elle est celle des 2 : elles ne couvrent que
    3 instantanés, et rien ne garde trace de ce que la copie a porté entre 2 propagations.
- **Le socle des pages ferme ses 8 items**, et 3 d'entre eux corrigent des contrôles qui se
  contredisaient ou se taisaient. Classes fermées : `oracle-perimetre-de-non-mesure-non-publie`,
  `regle-qui-interdit-son-propre-remede`, `deux-regles-du-socle-inconciliables`,
  `controle-vrai-sur-le-mauvais-invariant`, `controle-joue-sur-fichier-pas-sur-instance-servie`
  et `controle-sans-fixture-double-sens`.
  - preuve : recette native du socle 308/308 → **357/357**, exit 0, rejouée avant chacun des
    8 enregistrements. Comparaison avant/après sur **454 pages HTML de 4 dépôts** : 2 échecs
    ajoutés, tous deux sur les fixtures rouges écrites pour les prouver, 7 échecs retirés, tous
    sur les fixtures écrites pour montrer les faux positifs, et **aucune page réelle du parc
    touchée**.
  - TF-1147 et TF-1148 : un identifiant de dessin partagé entre 2 SVG, et un renvoi qui sort de
    son propre SVG, sont refusés — bruit mesuré AVANT la pose sur 467 pages de 11 dépôts, zéro
    fichier touché ; et le contrôle de rendu passe sur les 4 fixtures, ce qui prouve le point de
    l'item : aucune sonde de rendu ne pouvait voir ce défaut.
  - TF-1141 : un verdict vert du contrôle de marquage porte désormais 6 lignes de périmètre au
    lieu de zéro, chaque famille hors champ vérifiée NOMMÉMENT par le banc.
  - TF-1139 : une page trop haute rend son verdict en **2,4 s** avec son constat chiffré, au lieu
    des dizaines de minutes payées le 15 septembre ; le banc mesure la DURÉE, pas seulement le
    message, et c'est elle qui prouve qu'aucune capture n'a été tentée.
  - TF-1144 : la règle d'impression qu'un autre contrôle PRESCRIT dans son message de refus passe
    désormais son propre banc — 3 échecs bloquants → 0 —, et le remède RENFORCE : les sélecteurs
    d'attribut sont évalués au lieu d'être abandonnés, et un sélecteur sans point d'ancrage ne
    retient plus tout.
  - TF-1143 : le contraste d'un actif n'est plus jugé sous l'échelle 1, et l'agent a
    CONTRE-MESURÉ lui-même — 17,85:1 à l'échelle 1, 3,66:1 à 0,25, sans qu'un pixel de la page
    ait bougé. Au-dessus de l'échelle 1, la règle est inchangée, seuil compris.
  - TF-1145 : 2 règles qui lisaient le même premier bloc de navigation lisent toutes les
    navigations ; la contradiction est levée sans rien désactiver, et un contrôle S'ÉLARGIT.
  - TF-1146 : l'exemption de recouvrement se déclare par paire, et le constat qu'elle avalait
    revient — 0 → 1 sur la fixture rouge, 0 → 0 sur sa jumelle verte à une coordonnée près.
- **Un contrôle du parc rouvert par un commit de ce tour a été refermé dans le même tour** : le
  site de scellement neuf de la forge du design est déclaré à la table des empreintes.
  - preuve : contrôle FAIL nommant le site, puis exit 0 ; trouvé par la session voisine et signalé
    en moins d'une heure.

## 5. Non traité

- La généralisation du périmètre de non-mesure au contrat commun des oracles du registre, seconde
  moitié de TF-1141 : motif `borne_atteinte` — elle touche le registre du pilot et un skill qu'une
  autre session modifiait au même moment ; c'est elle qui étendrait la correction au-delà du seul
  oracle de marquage, et elle reste à faire.
- La migration des 1 716 exemptions de recouvrement en forme ancienne : motif
  `dependance_bloc_3` — elle attend la date de D-4. Le recensement la rend visible page par page.
- La propagation vers les copies installées des 5 skills touchés : motif `gate_gouvernance` —
  elle écrit hors de tout dépôt, sous le profil du poste, et c'est un geste humain.
- TF-0940, deux moteurs pour le même schéma de base de données, moitié faite : motif
  `garde_fou` — l'autre moitié vit chez la forge de l'audit, et elle porte un arbitrage que la
  campagne a REFUSÉ de rendre seule. La divergence est de fond et mesurée : le moteur du voisin
  rend dans les 2 langues du rapport d'audit, le canevas canonique est une page française en
  dur, et l'importer tel quel ferait perdre l'anglais à tout rapport produit en anglais. Le
  canevas dit désormais ce que sa reprise coûterait, là où il déclarait seulement faire foi.
- TF-1087, le contraste d'un visuel jugé sur son meilleur pixel : motif `garde_fou` — la
  correction vit entièrement chez la forge des agents, et le pilot n'écrit pas dans un dépôt que la
  campagne ne couvre pas. Le diagnostic est mesuré et non déduit : fichier, fonction et ligne
  nommés, et une sonde exécutée montre qu'un visuel dont 90 % de la surface est littéralement
  invisible passe, sauvé par un accent qui occupe un dixième de sa hauteur, quand le témoin
  monocolore échoue. L'item est réaffecté.
- TF-1149, la tournure « Ce que » dans le gabarit de restitution, 3 volets sur 4 faits : motif
  `dependance_bloc_3` — le 4e volet réécrit le dispositif qui juge chaque fin de tour, et
  l'exécuter en silence mettrait 2 gardiens du même socle en contradiction.
- TF-1140, le verrou des familles de défaut sans juge : motif `dependance_bloc_3` — la mesure est
  faite, la forme du verrou arbitre entre fermer vite et fermer durablement, et ce n'est pas un
  arbitrage d'agent.
- TF-1150, le vocabulaire proscrit pour toute une forge et pas seulement pour un client : motif
  `borne_atteinte` — le mécanisme est clair, une liste transverse à côté de la liste par client,
  mais son contenu vous revient et la poser vide aurait fabriqué un dispositif sans emploi.
- Les 42 items du registre encore ouverts : motif `borne_atteinte` — le mandat demandait tout, et
  21 items ont été traités ou instruits dans ce tour ; aucun des 42 n'est bloqué, le mandat
  d'écriture ouvert ce matin les rend tous exécutables.
- La rotation des identifiants publiés signalée au relevé d'ouverture : motif `acces` — elle se
  joue dans la console de chaque fournisseur, et le relevé d'ouverture le constate à chaque session
  sans jamais pouvoir agir.

## 6. Écarts à la lettre

- **Vous avez demandé** « traite tous les todos & les retours ». **J'ai fait** : tous les retours,
  et 21 des 60 todos. **Pourquoi** : les retours étaient bornés et sont tous entrés ; les todos ne
  le sont pas — plusieurs demandent chacun une campagne complète. J'ai pris les items au score le
  plus fort et ceux que vos retours du 15 septembre venaient de fonder, et je nomme les 42 qui
  restent au chapitre précédent plutôt que de laisser croire à un traitement complet.
- **Vous avez demandé** de traiter, **j'ai aussi décidé** les 19 candidats en attente. **Pourquoi** :
  la gouvernance du registre réserve ce passage à un mandat humain explicite, et « traite tous les
  todos » en est un ; sans ce passage, aucun candidat n'aurait pu être exécuté. Le précédent du
  2 septembre, sur la même formulation, a fait de même.
- **Un outil a été lancé avec une option inexistante** : `--aide` sur l'outil d'accueil des lots,
  qui ne la reconnaît pas et a donc exécuté l'accueil réel au lieu d'afficher son aide. Le geste
  était le bon à cette étape et rien n'a été perdu, mais il n'était pas voulu à cet instant, et il
  est dit ici plutôt que tu.
- **Un agent de campagne a enregistré hors de ses 3 items** : la porte native de son dépôt était
  rouge avant toute écriture de sa part, une fixture dérivée ayant divergé de sa source au pilot.
  **Pourquoi** : sans cela ses 3 enregistrements se faisaient sur une porte rouge. Il l'a remise
  au vert d'abord, l'a déclaré, et n'a touché aucune assertion.
- **Un agent de campagne a étendu 2 règles au-delà de la lettre de son brief** : une liste de
  balises portée de 4 à 8, et un remède qui ÉVALUE les sélecteurs d'attribut au lieu de se borner
  à refuser de tout retenir. **Pourquoi** : mécanisme de défaut identique dans les
  2 cas, bruit vérifié nul sur 467 pages, et la version littérale aurait supprimé les faux
  positifs EN MÊME TEMPS que les vrais. Renforcement des deux côtés, jamais assouplissement.
- **Le même agent a gardé une forme qu'il devait supprimer** : l'exemption de recouvrement en
  forme ancienne continue d'exempter, recensée au lieu d'être refusée. **Pourquoi** : les
  occurrences mesurées dans le parc se compteraient en milliers, et les casser d'un commit ferait
  rougir tout le parc avant toute migration. C'est l'écart qu'il signale lui-même comme le plus
  fort de sa campagne, et il vous revient en D-4.
- **Une erreur de mesure a été trouvée et corrigée avant d'être citée** : la première passe de
  non-régression du socle rapportait 8 échecs apparus, artefact de son propre banc — la copie
  « avant » vivait seule dans un répertoire temporaire et ne trouvait donc pas son référentiel de
  jargon, qu'elle lisait vide. L'arbre « avant » a été reconstruit complet et rejoué ; aucun
  chiffre de la première passe n'est cité nulle part.

## 7. Risques

- **2 sessions écrivent dans le pilot en même temps, et l'une d'elles est la mienne.**
  - signal : une règle numérotée 2 fois dans le même fichier — c'est exactement ce qui est
    arrivé ce tour, 2 règles portant le même identifiant, repérées en lisant le fichier et non par
    un contrôle.
  - parade : appliquée — les 2 sessions se sont écrit, la numérotation a été séparée, la donnée
    porte la trace écrite du numéro de version qui a désigné 2 contenus pendant une heure, et les
    enregistrements se font sur chemins nommés et jamais sur l'index entier. Le risque résiduel
    est réel tant que les 2 sessions durent.
- **Une règle neuve accuse 31 textes existants sur 484.**
  - signal : un avertissement à chaque écriture d'un texte ancien, qui finit par être ignoré.
  - parade : les 6 producteurs qui rejouaient le défaut sont corrigés à la source ; le corpus
    historique n'est pas réécrit, conformément à la portée temporelle du plancher d'écriture, et
    les seuils sont calibrés pour qu'il reste accepté.
- **17 items sont déclarés clos sur la foi de 4 rapports de campagne que je n'ai pas produits.**
  - signal : un rapport qui annonce un item clos sans sortie de recette à l'appui, ou un dépôt
    dont l'arbre n'est pas propre à la fin.
  - parade : le contrat de campagne exige la recette native verte avant chaque enregistrement, et
    le pilot vérifie par sondage. Les 3 sondages ont été faits ce tour et REJOUÉS ici : forge-data
    273 PASS, forge-agents 269 contrôles, socle des pages 357/357, les 3 arbres propres. Reste
    non sondée la forge du design, dont je reprends les chiffres de son rapport sans les avoir
    rejoués — ils sont marqués comme rapportés.

## 8. Prochaines actions

Les 7 travaux que le pilot mène seul sont listés d'abord, puis les 4 gestes qui vous reviennent :
l'ordre suit l'acteur, et à acteur égal ce qui débloque le plus d'items passe devant.

| Sélecteur | Action | Acteur | Identifiant | Motif / raison | Où | Si rien n'est fait |
|---|---|---|---|---|---|---|
| **A-1** | Reprendre les 42 items ouverts non traités, par score décroissant | `auto_ia` | TF-1018 | `borne_atteinte` — borne de temps de ce tour, aucun obstacle | `todo/TODO.md`, sous le mandat d'écriture déjà ouvert | la file cesse de baisser, et les récidives continuent d'être comptées sans être évitées |
| **A-2** | Étendre le périmètre de non-mesure au contrat commun des oracles du registre | `auto_ia` | TF-1141 | `borne_atteinte` — le registre était modifié par une autre session pendant la campagne | registre des oracles du skill `quality-oracles` | la correction reste bornée à un seul oracle, et les autres continuent de rendre un vert sans limite |
| **A-7** | Migrer les exemptions de recouvrement en forme ancienne, au fil des pages rouvertes | `auto_ia` | TF-1146 | `dependance_bloc_3` — D-4 fixe la date de fin d'admission | pages du socle et des dépôts qui le consomment, recensées page par page | la dette reste un compteur qu'on regarde monter |
| **A-3** | Poser le cliquet des familles de défaut sans juge | `auto_ia` | TF-1140 | `dependance_bloc_3` — D-3 arbitre sa sévérité | `todo/CLASSES.json` et `todo/oracle-todo.mjs` | la 31e famille sans juge peut être créée demain |
| **A-4** | Réécrire les 2 libellés du gabarit de restitution et de ses 3 juges | `auto_ia` | TF-1149 | `dependance_bloc_3` — D-2 | `gabarits/RESTITUTION.md`, `oracles/oracle-synthese.mjs`, les 2 hooks | la tournure que vous avez proscrite survit dans chaque restitution |
| **A-5** | Construire la liste de vocabulaire transverse et la faire hériter par les produits | `auto_ia` | TF-1150 | `borne_atteinte` | `gabarits/LEXIQUE-PRODUIT.json` et `gabarits/HERITAGE.json` | un mot refusé par votre lecteur reste proscrit chez un seul produit |
| **A-6** | Rejouer la porte de publication après arbitrage, puis publier | `auto_ia` | neuve | `dependance_bloc_3` — D-1, puis `gate_gouvernance` : la publication reste votre mot | `FORGE_PUSH_GO="<motif>" git push` depuis la racine du pilot | le travail de la journée reste sur ce seul poste |
| **A-8** | Trancher D-1, le statut du nom qui ferme la publication | `manuelle_utilisateur` | neuve | `decision` — arbitrer entre une marque à vous et un nom à masquer n'est pas un geste d'agent | bloc 3 de cette synthèse, option (a) recommandée | rien ne se publie, et le nombre d'enregistrements locaux monte à chaque tour |
| **A-9** | Trancher D-2, D-3 et D-4 | `manuelle_utilisateur` | TF-1149 | `decision` — les 3 arbitrent une sévérité, qu'aucun texte ne prescrit | bloc 3 de cette synthèse, options (b), (c) et (b) recommandées | 3 corrections restent écrites sans être opposables |
| **A-10** | Propager les 5 skills modifiés vers leurs copies installées | `manuelle_utilisateur` | neuve | `decision` — la propagation écrit hors de tout dépôt, sous le profil du poste, et le gabarit réserve ce geste à une décision humaine explicite | au prochain démarrage de session, qui rejoue la fraîcheur du poste | ce qui s'exécute sur ce poste n'est plus ce qui est versionné, sur 5 skills |
| **A-11** | Faire tourner les identifiants publiés | `manuelle_utilisateur` | TF-1090 | `acces` — mesuré : `node oracles/oracle-secrets-hors-perimetre.mjs` rend FAIL sur le parc à chaque ouverture, SP2 « 3 porteurs DANS un dépôt qui ne les ignore pas », et aucune console de fournisseur n'est joignable depuis ce poste | console de chaque fournisseur nommé par la sortie de l'oracle | des identifiants publiés restent valides |

## 9. Traces

- `todo/TODO.jsonl` — registre, 21 événements écrits ce tour ; vues régénérées
  (vue Markdown, page, rapport d'avancement et tableau de bord des récidives). 42 ouverts,
  326 clos, 3 écartés.
- `references/tics-redactionnels.json`, `references/ECRITURE.md`, `oracles/oracle-ecriture.mjs` —
  la donnée, la doctrine et les 2 juges d'écriture posés ce tour.
- `gabarits/documents/README.md`, `oracles/oracle-gabarits-documents.mjs`, et les 5 gabarits de
  familles — la frontière lecteur/auteur.
- `references/EMPREINTES.md` — le site de scellement déclaré.
- `input/00-retours/` — les 4 lots accueillis, sous leur nom pseudonymisé.
- Fichier jugé : ce document — `oracle-synthese` PASS, `oracle-ecriture` PASS.
- enregistrements locaux, tous non poussés : pilot `1e87947`, `453b29b`, `a5b4cf1`, `d61c90d`,
  `3612a6e`, `cf798e0` ; forge-data `0d7f31f`, `a1ed23c` ; forge-design `6add530`, `857785c` ;
  forge-agents `498bb0d`, `5a23b16`, `250e6c0`, `efff210`, `3fbee06`, `93454d8`, `dc84777`,
  `823882a`, `d1240b9`, `89d2792`, `aa0cbba`, `a96f187`.
