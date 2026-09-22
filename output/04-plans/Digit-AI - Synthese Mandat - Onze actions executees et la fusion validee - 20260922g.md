---
role: restitution de fin de tour, mandat transverse du 22/09/2026, septième tour
sources_de_verite: todo/TODO.jsonl · oracles/self-tests.mjs · scripts/verifier-jugement.mjs · git log
verifie_le: 2026-09-22
---

# Digit-AI — Synthèse de mandat — 11 actions exécutées et la fusion validée — 22/09/2026

## 0. Synthèse d'ouverture

Les onze actions que vous avez autorisées sont exécutées, et le travail des deux derniers jours
est désormais dans la branche principale : la demande de fusion était en conflit, les neuf
conflits étaient tous des vues régénérables ou des journaux à réunir, et la fusion est validée.
5 défauts sont fermés avec leur preuve rejouée, dont les deux qui tenaient le circuit
d'intégration fermé. Une action reposait sur un constat faux, et la vérification l'a montré avant
d'écrire quoi que ce soit : le fichier accusé obéissait, c'est le juge dont la fenêtre était trop
courte de 6 caractères — corriger l'innocent aurait abîmé un en-tête juste. Deux choses demandent
votre attention plus que le reste. D'abord, j'ai commis 2 fois la même erreur dans la journée,
la seconde fois en exécutant le garde censé l'empêcher : un garde qui fait déclarer un geste de
masse ne fait pas vérifier sa portée. Ensuite, et c'est le plus important, j'ai publié un
diagnostic faux ce matin et je le rectifie : les trente et un écarts de sceau ne viennent pas de
la réécriture d'histoire mais d'une dépendance aux fins de ligne du poste, mesurée depuis. J'avais
trois indices convergents et j'ai cessé de chercher trop tôt. Ce qui est attendu de vous : douze
arbitrages de dossiers, et une décision sur la portabilité des sceaux.

## 1. En-tête d'identification

- **quoi** — exécution des 11 actions autorisées, de la remise à niveau des contrôles jusqu'à la
  validation de la fusion vers la branche principale.
- **sur quoi** — le pilotage `digit-ai-factory`, son harnais, son registre et sa branche publiée.
- **quand** — fin le 22/09/2026 à 17:25 (UTC+02:00), durée 7 h 08 depuis l'ouverture de la session.
- **qui** — session du pilotage, `v1.17.30-697-g830f698`.
- **intention** — vous avez listé 11 sélecteurs d'action et rien d'autre : cela autorise, et
  commande la PREUVE EXÉCUTÉE de chacune. **Test rétro** : servie pour 10 — chacune porte sa mesure
  rouge puis verte au bloc 4. La onzième attend une valeur que vous seul détenez, et c'est écrit au
  bloc 5. Trois écarts à la lettre sont au bloc 6, dont un élargissement assumé et une erreur que
  j'ai commise 2 fois.

## 2. Verdict en une ligne

5 contrôles passent de rouge à vert sur le parc, la simulation du circuit hébergé tombe de 2
défauts à 1, la demande de fusion passe de conflictuelle à validée avec 9 conflits résolus et 0
ligne de journal perdue, les livrables en écart de sceau tombent de 31 à 0 sur ce poste, 2 défauts
commis par moi sont consignés, et 1 diagnostic faux est rectifié par ajout.

## 3. Décisions attendues de l'humain

Ce bloc porte 13 décisions, numérotées de D-20 à D-32. Les 12 premières sont les candidatures de
valeur 15 ou plus, que vous m'avez demandé de vous dérouler : chacune rappelle son fait mesuré,
puis les 3 mêmes issues — la décider, l'écarter avec son motif, ou la laisser candidate. La
treizième est neuve et vient d'une mesure de ce tour. Pour répondre, un sélecteur suffit, et
plusieurs tiennent dans un seul message.

Les 3 bloquants qui restent, chacun énoncé sur place :

- **Douze candidatures de valeur 15 ou plus attendent votre arbitrage.** Faire passer une
  candidature en décidé est un geste humain, et ces dossiers portent des contrôles qui rendent
  aujourd'hui un verdict faux, un journal qui accepte une entrée vide, et un moteur de rapport qui
  laisse 3 règles de gouvernance hors de son plan. Pour les lever, il faut trancher chacune.
  Si rien n'est fourni, le registre recomptera les mêmes récidives.
- **Le circuit d'intégration hébergé ne peut toujours pas s'activer, mais pour une seule raison
  désormais.** Ses 2 causes connues sont fermées et sa simulation est passée de 2 défauts à 1 ; le
  défaut restant est que le sceau (empreinte du contenu d'un livrable, posée une fois qu'il est relu) des livrables n'est
  pas portable d'un poste à l'autre. Pour le lever, il faut trancher comment il se calcule. Si rien n'est fourni, l'activation reste
  fermée, et c'est le bon comportement.
- **Le contrôle des empreintes rend rouge sur le parc réel.** Un site de scellement est apparu
  dans une forge sans être déclaré à la table. Pour le lever, il faut dire si ce site se déclare ou
  se retire. Si rien n'est fourni, le harnais garde un rouge permanent, qui finit par ne plus être
  lu.

> **D-20 — Que faites-vous du tableau de routage qui envoie l'audit à la mauvaise forge ?**
>
> Le tableau « Routage forge » du fichier de noyau hérité par chaque produit ne cite que la forge
> de tests pour « valider, clore », et ne mentionne nulle part la forge d'audit ni son référentiel
> de 175 contrôles sur 18 dimensions. Un producteur qui cherche où faire auditer son produit ne
> trouve donc pas la forge qui existe pour cela. Retour humain du 9 septembre.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl` et le gabarit de noyau produit du
> pilotage, dont le tableau est la source héritée. C'est la candidature de plus haute valeur du
> registre, et son remède est une ligne de tableau.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-20 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-20 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-20 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-21 — Que faites-vous du verdict annoncé sur un périmètre de mesure réduit ?**
>
> Le 14 septembre, une restitution affirmait qu'un outil de rendu rendait PASS à une largeur
> sur 6 pages. La mesure rejouée le lendemain sur les mêmes fichiers, extraits de leur
> enregistrement, donne FAIL au périmètre par défaut de l'outil, qui juge 6 largeurs. Le périmètre réduit n'était
> pas dit, et le vert se lisait comme une absence de limite.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, entrée
> `oracle-perimetre-de-non-mesure-non-publie`, dont le contrôle existe et pourrait fermer ce cas.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-21 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-21 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-21 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-22 — Que faites-vous de la surveillance qui efface la dérive qu'elle montre ?**
>
> Le relevé d'ouverture du 21 septembre rendait une dérive bloquante — 17 récidives de
> plus, 9 classes de plus — entre 2 instantanés. En rejouant `todo/observer-recidives.mjs` pour en
> lire le détail, le verdict est passé au vert : l'appel avait posé un TROISIÈME instantané, et la
> dérive comparait désormais deux points rapprochés. Le contrôle déplace sa propre référence.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl`, où ce dossier porte la mention
> « trouvé en le commettant » — le défaut a été rencontré en essayant de lire un rouge, et c'est la
> forme la plus coûteuse : elle transforme un constat vrai en vert muet.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-22 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-22 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-22 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-23 — Que faites-vous du domaine public de la marque resté clé de pseudonymisation ?**
>
> Ce dossier est celui que votre décision de ce matin a fait traiter chez le produit de
> communication : `todo/pre-commit-anonymise.mjs` avait substitué un pseudonyme de produit au
> domaine public de la marque, dans 2 lignes que la session n'avait pas écrites. La clé est
> sortie de la table, son indice est réservé, et 210 occurrences ont été restaurées. Le dossier
> lui-même n'a pas été clos.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl` et la synthèse du troisième tour
> de ce jour, qui porte la preuve exécutée — l'enregistrement chez le produit ne porte plus de
> pseudonyme et le journal d'anonymisation n'a rien écrit à ce commit.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter, donc à clore sur la preuve déjà rejouée | nul | répondre « D-23 a » | exclut de la rouvrir sans nouvelle mesure |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-23 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-23 c » | exclut sa fermeture ; elle restera comptée alors que son geste est fait |

> **Si rien n'est décidé** : l'option (c) s'applique — un dossier dont le travail est fait reste
> compté comme ouvert, ce qui fausse le compteur dans l'autre sens.

> **D-24 — Que faites-vous des générateurs du pilotage lancés depuis un dépôt produit ?**
>
> Le 12 septembre, depuis le dépôt d'un produit, `scripts/readme-dossiers.mjs` a régénéré cinq
> index du pilotage et un autre générateur son index général de 269 livrables : 6 fichiers suivis
> du pilotage modifiés depuis ailleurs, annulés à la main. L'option qui désigne le dépôt cible
> existe, rien ne l'exige, et la sortie ne nomme pas le dépôt sur lequel elle a écrit.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, entrée
> `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`, dont le juge est né ce matin et rend
> vert — ce dossier est la variante en ÉCRITURE du même défaut.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-24 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-24 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-24 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-25 — Que faites-vous du journal de produit qui accepte une entrée vide ?**
>
> Le 13 septembre, `forge/ledger.py` lancé pour lire son usage — le script n'ayant pas d'option
> d'aide — a écrit une entrée de clôture d'étape sans étape ni résumé. Le contrat d'interface nomme
> ces champs ; rien ne les exige à l'écriture, et le journal étant en ajout seul, l'entrée vide y
> reste.
>
> **Recommandation : (a).** Source consultée : `references/CONTRAT-INTERFACE.md` section 3, qui
> nomme les champs, et `todo/CLASSES.json`, entrée `regle-ecrite-sans-oracle-qui-la-joue`, dont le
> juge est né ce matin.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-25 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-25 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-25 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-26 — Que faites-vous du moteur de rapport qui borne les dimensions trop tôt ?**
>
> Chez la forge d'audit, la fonction qui rattache une règle à sa dimension ne reconnaît que les
> dimensions zéro à seize, quand le référentiel fusionné en porte dix-sept. Les trois écarts de
> gouvernance de l'intelligence artificielle sortent donc sous une dimension non rattachée, hors du
> plan de remédiation remis à la forge de développement.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl`, dont ce dossier nomme les trois
> règles perdues. Une règle de gouvernance qui sort du plan de remédiation ne sera corrigée par
> personne, et rien ne le signale.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-26 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-26 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-26 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-27 — Que faites-vous de la seconde collision de numéro sur le socle des pages ?**
>
> Le 17 septembre, deux lignées du socle des pages portaient le même numéro de version et ont été
> fusionnées ici ; 4 jours plus tard, le dépôt distant porte lui aussi ce numéro avec
> quarante-neuf enregistrements d'avance, pendant que ce poste en garde quatre non publiés. Le même
> numéro désigne donc deux contenus, pour la seconde fois en 4 jours, et le registre
> `todo/TODO.jsonl` porte les 2 mesures.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl`, dont ce dossier porte les
> vérifications déjà jouées — une règle du socle a été réimplémentée indépendamment des deux côtés,
> ce qui rend la fusion plus coûteuse à chaque jour d'attente.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-27 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-27 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-27 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-28 — Que faites-vous de la forme qui ne sait pas déclarer un calque ?**
>
> En exécutant le geste de migration que le socle des pages prescrit lui-même, la migration a
> fonctionné sur les onze schémas du guide développeur, puis buté : la forme par paire de
> l'attribut de tolérance de recouvrement ne sait pas déclarer un CALQUE, c'est-à-dire un nœud dont
> la boîte et les textes se superposent légitimement. Le contrôle refuse donc la correction que son
> propre message recommande.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, entrée
> `regle-qui-interdit-son-propre-remede`, et l'échéance de migration que le socle a lui-même fixée
> à la mi-décembre — le geste prescrit est bloqué tant que la forme ne couvre pas ce cas.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-28 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-28 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-28 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-29 — Que faites-vous du garde qui fait déclarer une intention sans vérifier sa portée ?**
>
> Ce dossier est né de ce tour, et il consigne une erreur que j'ai commise 2 fois. Le matin,
> `scripts/verifier-jugement.mjs` a été lancé dans sa forme écrivante à la place de sa forme
> mesurante : 166 sceaux posés sur des livrables que personne n'avait relus. Le garde posé l'après-
> midi exige de DÉCLARER un geste de masse ; l'exécutant l'a déclaré, et le geste a scellé 213
> livrables au lieu des 31 visés. Déclarer une intention n'est pas vérifier une portée.
>
> **Recommandation : (a).** Source consultée : `scripts/verifier-jugement.mjs` et sa recette, qui
> tient désormais les deux gardes dans les deux sens — et qui n'a pourtant pas empêché la seconde
> occurrence, ce qui est précisément ce que ce dossier dit.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-29 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-29 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-29 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-30 — Que faites-vous du test en échec chez la forge de tests ?**
>
> La suite du dépôt `digit-ai-forge-tests` rend un échec avant comme après la campagne du 20
> septembre, sur un test de rendu de page. Un agent de campagne l'avait d'abord attribué à la copie
> installée du socle des pages ; après propagation, l'échec demeure. Une forge de tests qui porte un
> test rouge n'est plus opposable à ceux qu'elle juge.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl`, dont ce dossier porte la mesure
> avant et après la campagne, ce qui écarte la cause la plus évidente et rend le dossier instruit.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-30 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-30 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-30 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-31 — Que faites-vous des deux services « prouvés » dont le point d'entrée n'existe pas ?**
>
> Dans `catalogues/catalogue.jsonl`, 2 entrées sont annoncées en statut « prouvé » et
> prescrivent un point d'entrée dont le chemin a perdu un segment : le fichier n'existe pas à l'endroit annoncé.
> Le constat vient du premier passage du juge des chemins prescrits, né d'un retour de produit, puis
> a été vérifié à la main sur le disque.
>
> **Recommandation : (a).** Source consultée : `catalogues/catalogue.jsonl` et le verdict de
> `oracles/oracle-chemin-prescrit.mjs`, dont le champ de non-mesure déclare justement que les
> référentiels de données lui échappent — ce dossier est le cas qu'il avait annoncé ne pas voir.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la décider — à traiter | nul | répondre « D-31 a » | exclut de traiter d'abord les dossiers de moindre valeur |
| (b) l'écarter, avec son motif écrit | nul | répondre « D-31 b » et me dire pourquoi | exclut toute reprise ultérieure sans réouverture |
| (c) la laisser candidate | nul | répondre « D-31 c » | exclut sa fermeture ; elle restera comptée et vieillira |

> **Si rien n'est décidé** : l'option (c) s'applique — le dossier reste candidat et vieillit.

> **D-32 — Comment le sceau d'un livrable doit-il être calculé pour être portable ?**
>
> Mesure de ce tour : `scripts/verifier-jugement.mjs` empreinte les octets de l'arbre de TRAVAIL,
> que git réécrit à chaque extraction selon la politique de fins de ligne du poste. Le même
> livrable rend une empreinte sur ce poste et une autre dans le dépôt. Un sceau posé ici est donc
> vert ici et rouge partout ailleurs — c'est ce qui tient le circuit d'intégration fermé, et c'est
> aussi la vraie cause des 31 écarts que j'avais attribués ce matin à la réécriture d'histoire.
>
> **Recommandation : (a).** Source consultée : les 3 empreintes relevées sur un même fichier et la
> configuration locale, toutes citées au registre. Normaliser les fins de ligne avant le calcul rend
> le sceau portable sans changer ce qu'il protège ; les 44 sceaux existants sont alors reposés une
> fois, et le geste est déjà outillé.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) empreinter le contenu NORMALISÉ, fins de ligne ramenées à une seule forme | effort simple × court | répondre « D-32 a » | exclut de garder les 44 sceaux actuels : ils sont reposés une fois |
| (b) empreinter le contenu que le DÉPÔT conserve, plutôt que le fichier de travail | effort simple × court | répondre « D-32 b » | exclut de juger un livrable non suivi, qui n'a pas de contenu au dépôt |
| (c) déclarer le contrôle injouable hors du poste qui a scellé | nul | répondre « D-32 c » | exclut son maintien dans la liste des contrôles joués sur le parc, où il vient d'entrer |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — le contrôle reste rouge hors de ce
> poste, et le circuit d'intégration reste fermé pour cette seule raison.

## 4. Traité — chaque point avec sa preuve exécutée

- **La fusion vers la branche principale est validée.** Elle était en CONFLIT, donc non validable.
  Les 9 conflits étaient tous de 2 natures et aucune ne demandait d'arbitrer un contenu : 6 vues
  générées, résolues par RÉGÉNÉRATION parce que le générateur est la source de vérité, et 2 journaux
  en ajout, résolus par UNION dédupliquée parce qu'un journal n'a pas de version gagnante. Preuve :
  0 ligne perdue des deux côtés, vérifié ligne à ligne, le passage de 58 à 57 étant un doublon
  interne. Avant la fusion, 5 candidatures de ce poste ont été renumérotées, les deux postes ayant
  attribué les mêmes numéros en parallèle. Preuve finale : la demande est à l'état fusionné, et le
  poste est sur la branche principale sans écart.
- **La résolution du répertoire de configuration ne fait plus planter un module.** Preuve rouge
  puis verte : le juge des chemins ancrés rendait FAIL sur 2 de ses 3 règles ; il rend PASS sur les
  3, 204 fichiers lus, 0 résolution maison et 0 résolution au chargement d'un module.
- **La recette du registre régénère la vue avant de la juger.** Preuve exacte : la vue a été
  RETIRÉE du disque, comme dans un clone frais. Avant, la recette rendait 55 verts et 3 échecs, tous
  le même fichier manquant ; après, elle régénère et rend 58 verts. Le second générateur nécessaire
  a été trouvé en éprouvant, la première version ne suffisant pas.
- **Un banc ne peut plus rendre le vert d'un autre.** La garde de recette d'un module lisait les
  arguments du processus à son chargement. Preuve : un banc TIERS qui importe ce module et reçoit le
  drapeau de recette garde désormais la main et affiche son propre résumé.
- **Le banc d'une règle pose son propre référentiel au lieu de dépendre du poste.** Preuve : 14 cas
  verts sur 14 AVEC répertoire personnel, et 14 sur 14 SANS. C'était le premier des 2 défauts que la
  simulation nommait, et il avait survécu à la correction de l'oracle.
- **Une action reposait sur un constat faux, et l'innocent n'a pas été réécrit.** L'en-tête accusé
  de ne pas déclarer ses codes de sortie les déclare, et de la façon la plus lisible du dépôt ; la
  fenêtre du motif qui l'accusait admettait 50 caractères entre deux codes, et il y en a 56. Preuve
  rouge puis verte : le contrôle des injoignables passe de FAIL à PASS sur ses 4 règles, 62
  contrôles examinés, et sa recette reste verte à 22 cas.
- **Le vérificateur de sceaux porte 2 gardes et une simulation.** Preuve : la commande EXACTE de
  l'incident du matin rend désormais REFUSÉ, exit 2, et n'écrit rien ; la simulation annonce ce
  qu'elle scellerait et ce qu'elle écraserait sans toucher un fichier ; sceller un seul livrable
  reste le geste ordinaire. Recette : 10 cas avant, 14 après.
- **Le vérificateur de sceaux est câblé à une étape qui le joue.** Il existait depuis le 23 août et
  aucune étape ne le jouait sur ce dépôt. Preuve : il figure dans la liste des contrôles joués sur
  le parc réel, avec son remède nommé, et la simulation du circuit hébergé le joue désormais — c'est
  d'ailleurs elle qui a refusé de passer au vert et forcé la rectification ci-dessous.
- **Les 31 livrables en écart de sceau sont à 0 sur ce poste, et la portée a tenu.** Preuve : 44
  scellés vérifiés avant le geste, 44 après ; 169 non scellés avant, 169 après. Le premier essai
  avait scellé 213 livrables au lieu de 31 ; il a été défait, puis refait fichier par fichier.
- **La simulation du circuit hébergé tombe de 2 défauts à 1.** Preuve : verdict ROUGE, 1 défaut,
  contre 2 à sa dernière exécution. Le défaut restant est le sceau non portable, que D-32 tranche.
- **Un diagnostic faux que j'avais publié est rectifié par ajout.** Preuve mesurée : le même
  livrable rend une empreinte sur le disque et une autre au dépôt, la configuration locale
  réécrivant les fins de ligne à chaque extraction. Les 3 faits que j'avais cités ce matin sont
  exacts ; la conclusion ne l'était pas.

## 5. Non traité — chaque point avec son motif

- Les 12 candidatures de valeur 15 ou plus : motif `gate_gouvernance` — faire passer une
  candidature en décidé est un geste humain.
- L'activation du circuit d'intégration hébergé : motif `dependance_bloc_3` — son unique défaut
  restant attend D-32.
- Le contrôle des empreintes sur le parc réel : motif `dependance_bloc_3` — il attend une décision
  humaine déjà posée au registre.
- La section de non-couverture du registre des repères : motif `decision` — écrire quelles familles
  de livrables n'auront pas de repère est un choix de gouvernance ; le contrôle exige la liste, il
  ne peut pas la composer.
- Le palier de publication du produit de communication : motif `acces` — il attend 3 valeurs que
  seul l'humain détient.

## 6. Écarts à la lettre

- Vous avez autorisé une action nommant UN fichier à corriger. J'en ai corrigé QUATRE. Pourquoi :
  le juge né ce matin rendait rouge sur 3 autres fichiers portant exactement la même classe, dont un
  que j'avais écrit le matin même ; corriger le premier et laisser les 3 autres aurait laissé la
  classe ouverte pour rien, alors que le geste était identique et tenait en une ligne par fichier.
- Vous avez autorisé une action dont le libellé disait de déclarer des codes de sortie manquants.
  Je ne l'ai pas exécutée : je l'ai contredite. Pourquoi : l'en-tête accusé les déclare, et la
  vérification l'a montré avant toute écriture. Exécuter l'action telle qu'elle était écrite aurait
  fait réécrire un en-tête juste pour satisfaire un motif trop étroit.
- J'ai enregistré au passage un fichier de jugement de la session précédente que j'avais
  délibérément laissé hors de tous mes enregistrements de la journée. Pourquoi : une commande
  d'ajout large l'a emporté avec les sceaux. Le fichier est inerte et concerne un livrable déjà
  enregistré, mais le geste n'était pas le mien à faire, et il est dit ici plutôt que tu.
- Le livrable ne contient rien d'autre que ce périmètre : aucune candidature décidée à votre place,
  aucune section écrite à votre place dans le registre des repères, aucun contrôle désactivé.

## 7. Risques

- **Un faisceau d'indices convergents peut être faux en entier.** Trois faits exacts m'ont fait
  publier une conclusion fausse sur la cause des écarts de sceau, et c'est la convergence même qui
  m'a fait cesser de chercher.
  - signal : un diagnostic qui s'appuie sur des corrélations et jamais sur une mesure directe de la
    cause supposée.
  - parade : la simulation du circuit hébergé, qui a refusé de passer au vert et forcé la reprise ;
    la rectification est écrite par ajout, l'erreur reste lisible.
- **Un garde qui fait déclarer une intention ne vérifie pas une portée.** La même erreur a été
  commise 2 fois dans la journée, la seconde en exécutant le garde censé l'empêcher.
  - signal : une commande dont la cible est un RÉPERTOIRE là où l'intention portait sur une liste.
  - parade : le dossier est au registre avec son remède — n'accepter que des fichiers nommés ; en
    attendant, la portée est vérifiée dans le script qui exécute le geste.
- **Une fusion résolue par régénération peut masquer une divergence de fond.** Les 9 conflits
  étaient tous des vues ou des journaux, mais rien ne garantit que le prochain le soit.
  - signal : un conflit sur un fichier qui n'est ni généré ni en ajout seul.
  - parade : les oracles de clôture ont tous été rejoués sur l'arbre fusionné avant de sceller, et
    aucun marqueur de conflit ne subsiste.
- **Un contrôle qui entre dans la liste du parc réel y apporte son rouge.** Le vérificateur de
  sceaux vient d'y entrer, et il rend rouge hors de ce poste.
  - signal : une simulation qui rend rouge sur un contrôle ajouté la veille.
  - parade : D-32 tranche la cause ; jusque-là le rouge est nommé au bloc 5 avec son motif.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-46** | Traiter les candidatures que vous aurez décidées, dans l'ordre de leur valeur | `auto_ia` | TF-1288 | `dependance_bloc_3` — attend D-20 à D-31 | 12 dossiers de valeur 15 ou plus continuent de vieillir |
| **A-47** | Rendre le sceau (empreinte du contenu d'un livrable, posée une fois qu'il est relu) portable selon la voie tranchée, puis reposer les 44 sceaux existants | `auto_ia` | TF-1312 | `dependance_bloc_3` — attend D-32 | le circuit d'intégration reste fermé pour cette seule raison |
| **A-48** | Faire que le scellement n'accepte que des fichiers nommés, jamais un répertoire | `auto_ia` | TF-1306 | `dependance_bloc_3` — attend D-29 | la même erreur de portée reste possible une troisième fois |
| **A-26** | Rejouer la simulation du circuit hébergé après la correction du sceau (empreinte du contenu d'un livrable, posée une fois qu'il est relu) : `node scripts/simuler-recette-hebergee.mjs` | `auto_ia` | TF-1018 | `dependance_bloc_3` — attend A-47 | l'activation resterait fermée sans qu'on sache si le sceau était la dernière cause |
| **A-44** | Écrire au registre des repères la section qui nomme les familles de livrables sans repère, à partir de la liste que vous m'aurez donnée | `auto_ia` | TF-1028 | `dependance_bloc_3` — attend A-45 | le contrôle né hier reste rouge, et une absence de repère reste indiscernable d'un oubli |
| **A-49** | Trancher les 12 candidatures — répondre « D-20 a » à « D-31 c », plusieurs par message | `manuelle_utilisateur` | TF-1288 | `decision` — faire passer une candidature en décidé vous revient | les contrôles rendant un verdict faux continuent |
| **A-50** | Trancher le calcul du sceau (empreinte du contenu d'un livrable, posée une fois qu'il est relu) — répondre « D-32 a », « b » ou « c » | `manuelle_utilisateur` | TF-1312 | `decision` — changer ce que mesure un contrôle invalide les 44 sceaux existants | le sceau reste vert ici et rouge partout ailleurs |
| **A-45** | Me dire quelles familles de livrables n'auront pas de repère externe, et pourquoi | `manuelle_utilisateur` | TF-1028 | `decision` — choisir ce qui ne se compare pas à l'extérieur engage le niveau de qualité visé | la liste reste vide et le contrôle rouge |
| **A-18** | Me donner les 3 valeurs du palier : gouvernance des comptes, état de départ exporté depuis l'écran de statistiques du réseau, temps humain hebdomadaire en minutes | `manuelle_utilisateur` | TF-1160 | `acces` — trace mesurée : le contrôle du palier rend 3 règles rouges, message « valeur humaine absente : gouvernance, etat_de_depart, temps_humain » | le palier reste ouvert sans pouvoir publier |

L'ordre suit l'effet de levier : `A-47` ferme le dernier défaut du circuit d'intégration, `A-48`
empêche une troisième occurrence d'une erreur déjà commise 2 fois, et `A-46` vient après parce
qu'il traite des cas quand les précédents traitent ce qui les produit.

## 9. Traces

- Registre : [TODO.jsonl](todo/TODO.jsonl) — contrôle du registre PASS ; 2 défauts commis par moi
  consignés, 1 diagnostic rectifié par ajout, 1 doublon clos.
- Contrôles passés de rouge à vert : [oracle-chemin-ancre.mjs](oracles/oracle-chemin-ancre.mjs),
  [oracle-controles-injoignables.mjs](oracles/oracle-controles-injoignables.mjs),
  [self-test.mjs](todo/self-test.mjs), [hook-lexique.mjs](oracles/hook-lexique.mjs),
  [hook-ecriture.mjs](oracles/hook-ecriture.mjs).
- Vérificateur de sceaux : [verifier-jugement.mjs](scripts/verifier-jugement.mjs) — 14 cas de
  recette, 2 gardes, PASS sur `output/` de ce poste.
- Fusion : la demande n° 2 est à l'état fusionné, la branche principale porte le travail des 2
  derniers jours, et ce poste est dessus sans écart.
- Remontée à la factory : sans objet — ce tour s'est joué au pilotage seul.
