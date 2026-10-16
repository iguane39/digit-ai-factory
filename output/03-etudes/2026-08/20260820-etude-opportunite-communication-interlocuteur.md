---
destinataire: humain
---

# Étude d'opportunité — adapter la communication à l'interlocuteur — 20260820b

## Seuil de déclenchement (à vérifier AVANT d'écrire)

**Franchi.** L'objet **crée un objet durable** (R-31 : une règle de restitution et son contrôle)
et touche le noyau — toute restitution du pilot passe par les surfaces qu'il faudrait amender
(`gabarits/RESTITUTION.md`, `oracle-synthese`, `ACCUEIL`). L'étude est donc **obligatoire**.

## 0. Traitement des entrants

L'entrant est un retour humain direct du 20/08, et il est **la mesure elle-même** :

> « il peut être pertinent de travailler la façon de communiquer pour s'adapter à ton
> interlocuteur, qui peut être pas assez technique pour comprendre tout ce que tu remontes »

C'est un retour d'usage sur **mes propres restitutions**, émis par leur unique lecteur. Il n'y a
pas de mesure plus directe : le destinataire dit qu'une partie de ce que je remonte ne lui
parvient pas. Le coût n'est pas hypothétique — une information remontée et non comprise a le
même effet qu'une information tue, avec le coût de lecture en plus.

## 1. Partition du problème

Quatre sous-questions disjointes.

1. **Qui est l'interlocuteur, et où sa compétence est-elle déclarée ?** Aujourd'hui : nulle part.
2. **Quelles surfaces parlent** — et lesquelles ont déjà une doctrine d'audience ?
3. **Qu'est-ce qu'une restitution adaptée** — sans perdre la précision qui fait la valeur du
   registre (un fait daté, une preuve, un identifiant) ?
4. **Qu'est-ce qui se contrôle**, et qu'est-ce qui restera du jugement ?

## 2. Non-recouvrement contre l'existant

L'écosystème a déjà tranché cette question **trois fois — pour tout sauf la conversation**.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| **`REFERENTIEL-RESTITUTION.md`** (forge-design) | §2 Lecteurs types : « rapport → **commanditaire (novice du domaine)** : quel est l'état, qu'est-ce que ça change, que dois-je décider ? » ; RL-1 « la vue d'ensemble tient en un écran » ; RL-7 « le texte s'ancre : constat → impact → action » | **RECOUVRE les LIVRABLES** : la doctrine « trois lecteurs » existe, avec des règles contrôlées (`oracle-restitution`). Elle ne s'applique qu'aux artefacts HTML/rapports — pas à ce que j'écris en session |
| **TF-0389 — vues par profil** (clos le 19/08 par l'autre session) | « décliner le rétro-modèle en documentations par audience (PO, PM, commercial…) » | **RECOUVRE la DOCUMENTATION** : le principe « une audience, une vue » est acquis et outillé pour les docs. Pas pour la conversation |
| **`generer-page.mjs` — vocabulaire par niveau** (d850f88, 18/08) | commit : « un vocabulaire par niveau » sur la page du registre | **RECOUVRE une PAGE** : le registre lui-même a déjà payé ce défaut et corrigé — précédent interne direct |
| **`gabarits/RESTITUTION.md`** (pilot) | synthèse de fin « EN FICHIER, jugée avant affichage » | **RECOUVRE la forme et la traçabilité** de la synthèse de fin. **Ne dit rien de l'audience** : aucune règle n'y distingue ce que le commanditaire doit comprendre de ce que l'expert doit pouvoir vérifier |
| **`oracle-synthese` S1-S8** (pilot) | blocs obligatoires, verdict factuel, non-traité motivé, écarts à la lettre, actions par acteur | **RECOUVRE la complétude factuelle**. Un message peut être 8/8 conforme et illisible pour un non-technicien : S1-S8 garantit que tout y est, pas que c'est compris |
| **R-29 al. 2** (règles projet) | « tout rapport classe les actions restantes en trois catégories : IA, développeur, utilisateur » | **RECOUVRE le routage des ACTIONS par acteur** — le seul endroit où la doctrine du pilot pense déjà au destinataire. Rien sur le niveau de langue du reste |
| **Mémoire persistante de session** | `MEMORY.md` — profil utilisateur | **NE RECOUVRE PAS** : aucun niveau technique d'interlocuteur n'y est déclaré à ce jour |

**Ce que la section établit** : le principe « une audience, une forme » est déjà doctrine pour
les rapports, les docs et une page — **la conversation est la seule surface qui parle sans
audience déclarée**, et c'est précisément celle que le retour vise.

## 3. État de l'art daté

**Non instruit**, déclaré sans entre-deux. Motif : session sans accès réseau. Raison de fond :
l'objet n'est pas un choix d'outil — les options se départagent sur la doctrine interne déjà
écrite (trois lecteurs, vues par profil) et sur un retour d'usage local. Le jour où un contrôle
mécanique de lisibilité serait envisagé (indice de lisibilité, densité de jargon), son état de
l'art serait porté par cette option comme préalable — l'option O3 le nomme.

## 3 bis. Ce qu'« adapter » veut dire ici — et ce que ça ne veut pas dire

Le risque symétrique du jargon est la **perte de précision** : ce registre vaut parce que chaque
affirmation porte un fait daté, un identifiant, une preuve. Vulgariser en supprimant les
identifiants produirait des restitutions agréables et **invérifiables** — la faute que
l'écosystème refuse partout ailleurs.

La doctrine des rapports a déjà résolu cette tension, et elle se transpose : **on n'enlève rien,
on ordonne**. RL-1 : la vue d'ensemble d'abord, en langage du commanditaire (quel est l'état,
qu'est-ce que ça change, que dois-je décider). RL-7 : constat → impact → action. Le détail
technique — identifiants, chemins, verdicts d'oracles — vient **après**, pour le lecteur qui
vérifie. Un terme technique employé dans la partie haute se paie d'une glose d'une ligne, comme
le fait déjà le glossaire par niveau du registre.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Coût du statu quo : le retour lui-même — le destinataire unique des
restitutions dit qu'une partie ne lui parvient pas. Une information remontée et non comprise
coûte sa production ET sa lecture, pour un transfert nul ; et la décision humaine (GO, arbitrage)
se prend alors sur la partie comprise, pas sur la partie dite. **Réfutée** : le coût est attesté
par le seul témoin compétent.

**O1 — un profil d'interlocuteur déclaré + une règle de restitution** (retenue, voir §5).
(a) Le niveau et les attentes de l'interlocuteur se déclarent **une fois**, en mémoire de
session (profil utilisateur) et au `CLAUDE.md` d'un produit quand l'interlocuteur en diffère.
(b) `gabarits/RESTITUTION.md` gagne la règle transposée de RL-1/RL-7 : **toute restitution
s'ouvre par une synthèse en langage commanditaire** — l'état, ce que ça change, ce qui est
attendu de vous — avant le détail technique ; un terme technique dans cette partie porte sa
glose. (c) `oracle-synthese` gagne une règle S9 : la synthèse d'ouverture existe et ne contient
ni identifiant nu ni chemin de fichier sans glose. *Coût* : complexité simple · durée court. *Ce qu'elle exclut* : la
mesure de lisibilité — S9 vérifie une structure, pas une compréhension.

**O2 — deux restitutions par sujet** (une technique, une commanditaire). *Ce qu'elle exclut* :
elle **double le coût de lecture** et divise la vérité en deux documents qui divergeront — le
défaut « second porteur » appliqué à la prose. **Écartée** : la doctrine des rapports a montré
qu'ordonner suffit (« aucun contenu n'est résumé ni supprimé : les blocs changent de
conteneur »).

**O3 — un contrôle mécanique de lisibilité** (densité de jargon, longueur de phrases). *Ce
qu'elle exclut* : un indice de lisibilité est une heuristique dont le bruit se paie en
contournement (leçon D-18 et R5 : un contrôle bruyant se fait ignorer) ; et la compréhension
réelle ne se mesure que chez le lecteur. **Différée** : à réexaminer si O1 ne suffit pas, avec
un état de l'art instruit.

**O4 — étendre les « vues par profil » (TF-0389) à la conversation** — générer chaque
restitution en N variantes par audience. *Ce qu'elle exclut* : en conversation, il n'y a qu'**un
lecteur à la fois** ; générer des variantes que personne ne lit est un coût sans destinataire.
Le mécanisme vues-par-profil reste juste pour les **documents**, où plusieurs audiences
coexistent. **Écartée pour la conversation, confirmée pour les docs.**

## 5. Verdict

- **Option retenue** : **O1 — profil d'interlocuteur déclaré + règle d'ouverture commanditaire +
  contrôle S9**.
- **Motif** : l'écosystème a déjà tranché trois fois « une audience, une forme » (rapports,
  docs, page du registre) et la conversation est la seule surface restée sans doctrine — alors
  que c'est celle que le retour vise. La solution n'est pas d'inventer : c'est de **transposer
  RL-1/RL-7 à la restitution conversationnelle**, sans rien perdre (on ordonne, on n'enlève
  pas), et de déclarer l'interlocuteur une fois plutôt que de le deviner à chaque message.
- **Coût** : complexité simple · durée court (gabarit + règle S9 + profil). Aucun euro.
- **Ce que le verdict NE dit pas** : que la compréhension devienne mesurable. S9 contrôle une
  structure (la synthèse d'ouverture existe, sans jargon nu) ; la compréhension réelle reste
  jugée par le lecteur, et le signal qui compte restera ses retours — comme celui-ci.
- **Candidature(s) émise(s)** : une seule, pour O1 en trois gestes (profil + gabarit + S9). Les
  options O3/O4 ne s'ouvrent qu'au constat d'O1.
- **Plan de revue** : **2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) un retour
  « pas compris » a-t-il été réémis par l'interlocuteur depuis O1 — c'est LE critère ; (2) S9
  a-t-elle échoué au moins une fois sur une vraie synthèse, ou n'a-t-elle jamais rien trouvé ;
  (3) la précision a-t-elle survécu — les identifiants et preuves sont-ils toujours dans les
  restitutions, ou la vulgarisation les a-t-elle érodés (le risque symétrique, à surveiller
  autant que le jargon).

## Les garde-fous, traités nommément

**Aucune perte de précision.** La règle est d'ordonner, jamais de supprimer : identifiants,
preuves et chemins restent dans la restitution, après la synthèse. Une restitution agréable et
invérifiable serait pire que l'état actuel.

**Aucun second porteur.** Une seule restitution par sujet — la variante par audience est
réservée aux documents (TF-0389), où plusieurs lecteurs coexistent.

**Le profil est une déclaration, pas une inférence.** Deviner le niveau de l'interlocuteur à
chaque message produirait des condescendances et des erreurs ; il se déclare une fois, se révise
sur demande, et la restitution le dit quand elle s'y adapte.
