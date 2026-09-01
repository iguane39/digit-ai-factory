# Retours forges — Produit-11 — 20260825a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mandat humain du 24-25/08 — branchement de Produit-11 sur la passerelle d'API de
  Client-A pour l'envoi des courriels. Demande humaine du 25/08 : *« Remonte à la Factory le
  problème sur le fichier .env créé au mauvais endroit. »*
- **Références ledger** : `forge\ledger.jsonl` seq 157 à 159
- **Lot précédent** : `Produit-11 - RETOURS - 20260824a.md`, remis et donc immuable.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-08-25

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-31 sont consommés. Ce lot
continue en RT-32 … RT-33.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**CE QUI S'EST PASSÉ, SANS ENJOLIVER.** L'agent devait ajouter deux lignes au `.env` du produit.
Il a écrit `cat >> .env` sans chemin absolu, depuis un répertoire de travail qui n'était pas
celui qu'il croyait. Le fichier a été **créé** — pas modifié, créé — dans
`c:\dev\_Client-A\BourseAuxVacants2\`, le dossier PARENT du dépôt. L'humain y a collé une clé
d'abonnement réelle. L'application, elle, lit `…\Produit-11\.env` : la clé était dans un
fichier que rien ne consulte, et il a fallu un aller-retour pour s'en apercevoir. **C'est une
faute de l'agent.** Les deux retours ci-dessous portent sur ce que l'outillage aurait pu voir et
n'a pas vu — pas sur la faute elle-même, qui n'a pas besoin d'une règle pour être une faute.

**Vérification préalable, faite avant rédaction** (doctrine du lot 20260817b : un retour qui
réclame l'existant se fait renvoyer).

- **R-14 existe** — « `.env` réel toujours gitignoré ; aucun secret committé, jamais »,
  mécanisme O, coût nul, statut « quasi-loi déjà ». Elle couvre exactement ce sujet, **et le
  fichier lui a échappé** : voir RT-32, dont c'est tout l'objet.
- **La classe « chemin relatif résolu contre un cwd inattendu » est connue du corpus** — retours
  `digit-desk.fr` RV-1 et `forge-digit-ai-fr` RO-1 du 15/08, tous deux corrigés par un
  `path.resolve()` en tête d'oracle. Ces correctifs portent sur les **outils de la forge** qui
  reçoivent un chemin en argument. Aucun ne porte sur un **agent qui écrit un fichier** : c'est
  la différence, et c'est ce que RT-33 demande.
- Aucune règle du corpus ne traite d'un fichier de secrets créé **hors du dépôt déclaré**, ni de
  la façon dont un contrôle **désigne l'objet** qu'il vient de vérifier.

---

## pilot (`digit-ai-factory`)

### RT-32 — Un fichier de secrets créé HORS du dépôt échappe entièrement à R-14 — gravité **bloquant**

**Le fait, mesuré.** Un fichier `.env` a été créé dans le dossier parent du dépôt et a reçu une
clé d'abonnement d'API réelle. R-14 impose que le `.env` réel soit gitignoré et qu'aucun secret
ne soit committé ; son oracle juge le dépôt. **Ce fichier n'était dans aucun dépôt.** Il n'y
avait donc ni `.gitignore` pour le couvrir, ni oracle pour le voir, ni `git status` pour le
signaler : la règle n'a pas été violée, elle a été **contournée par la géographie**.

**Ce qui a empêché la fuite n'est pas un mécanisme, c'est une coïncidence** : le dossier parent
se trouvait ne pas être un dépôt git. S'il l'avait été — cas courant, un dossier de travail qui
porte plusieurs projets et un dépôt de notes — la clé se serait retrouvée **prête à être
committée**, dans un dépôt dont le `.gitignore` n'a aucune raison de prévoir un `.env` à sa
racine.

**Pourquoi c'est bloquant et pas majeur.** La gravité ne vient pas du coût payé — un
aller-retour — mais de la classe : *un justificatif d'accès déposé dans un endroit que rien ne
gouverne*. C'est exactement ce que R-14 existe pour empêcher, et la seule chose qui manquait
pour que ça tourne mal, c'est que le voisin soit un dépôt.

**Demande.** Un contrôle de **périmètre**, pas de contenu — et il est bon marché :

1. la session **déclare sa racine de produit** (elle la connaît : c'est celle du `CLAUDE.md`, du
   `.git`, ou du dossier passé au run) ;
2. **tout fichier de la famille « porteur de secrets »** — `.env`, `.env.*`, `*.pem`, `*.key`,
   `credentials*`, `secrets*` — **apparu HORS de cette racine pendant la session** est un
   défaut, signalé nommément ;
3. le contrôle est **local et instantané** : une comparaison de chemins, aucun appel, aucune
   lecture du contenu — donc rien qui puisse fuiter en le faisant.

Le point 2 est le cœur : R-14 demande « est-il ignoré ? », qui n'a de sens que dans un dépôt. La
question qui manque est antérieure : **« est-il au bon endroit ? »**

### RT-33 — Un contrôle qui réemploie un chemin RELATIF ne vérifie pas l'objet qu'on vient d'écrire — gravité **majeur**

**Le fait, mesuré, et c'est le plus instructif des deux.** Après avoir écrit le fichier, l'agent
a vérifié — sincèrement — qu'il était bien protégé :

```
git check-ignore -v .env      →  .gitignore:3:.env   .env
git status --short | grep .env →  (rien)
```

Les deux réponses sont **vraies**. Elles portent sur `…\Produit-11\.env`, parce que la
commande a tourné depuis le dépôt. Le fichier écrit, lui, était
`…\BourseAuxVacants2\.env`. **Le contrôle était juste ; son objet était faux.** Il a donc rendu
un vert sur un fichier que personne n'avait touché, et l'agent a rapporté à l'humain que sa clé
était en sécurité.

C'est pire qu'un contrôle absent : un contrôle absent laisse le doute, un contrôle qui se trompe
d'objet **produit de la confiance**. Et il est indétectable à la relecture — les deux commandes
sont correctes, la sortie est correcte, seule la variable cachée (le répertoire de travail)
diffère entre l'écriture et la vérification.

**Le corpus connaît la cause, mais pas ce cas.** RV-1 et RO-1 (15/08) ont corrigé la même racine
— un chemin relatif résolu contre un cwd inattendu — par un `path.resolve()` **dans les
oracles**. Ils protègent l'outil qui reçoit un chemin. Rien ne protège **l'agent qui en écrit
un**, ni ne l'oblige à dire lequel.

**Demande.** Une règle de forme, mécanisable, et symétrique de **S17** (« un renvoi nomme son
sujet, jamais une position ») transposée du texte au système de fichiers :

- **toute écriture d'un fichier de configuration ou de secrets se fait par chemin ABSOLU** ;
- **tout contrôle qui confirme une écriture nomme le chemin ABSOLU qu'il a vérifié**, et le
  message rendu à l'humain le cite. « Le `.env` est bien gitignoré » n'est pas une preuve ;
  « `c:\…\Produit-11\.env` est couvert par `.gitignore:3` » en est une, et elle serait
  tombée en défaut toute seule le 24/08 — l'humain aurait lu un chemin qui n'était pas le sien.

Le coût est nul et le bénéfice est double : la vérification devient opposable, et **le lecteur
peut la contredire**, ce qui est le seul contrôle qui ne se trompe jamais deux fois de la même
façon.

---

## Ce que ce lot NE demande pas

- **Rien sur R-14 elle-même** : sa formulation et son oracle sont bons pour ce qu'ils jugent.
  RT-32 demande un contrôle **en amont**, pas un remplacement.
- **Rien sur `path.resolve()` dans les oracles** : c'est fait depuis le 15/08 et ça marche.
- **Aucune anomalie produit** : la clé est désormais dans le bon fichier, le fichier parasite est
  supprimé après vérification qu'il ne portait que le bloc ajouté, et la passerelle accepte
  maintenant l'abonnement.
