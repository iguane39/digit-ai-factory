---
destinataire: humain
---

# Les vues sortent du suivi, et les nombres s'écrivent en chiffres

Votre « 4a » est exécuté : les 5 vues générées du registre ne sont plus versionnées, et le coût
qu'elles faisaient payer — 2,6 fois le travail nécessaire pour effacer un nom de l'histoire —
retombe à 1. Votre consigne sur les chiffres est devenue une règle du plancher d'écriture, avec un
juge qui la joue à chaque fichier écrit. Ce juge accuse 77 % des textes déjà écrits : ce sont de
vrais défauts, l'existant ne se réécrit pas, mais la sévérité à tenir dans la durée vous revient et
c'est la seule question de ce message.

## 1. En-tête

- **Quoi** : exécution de la décision D-4 (a) et de la consigne d'écriture des nombres ·
  **sur quoi** : le registre d'améliorations, le plancher d'écriture et son oracle.
- **Quand** : le 16/09/2026, de 14h05 à 16h20 (Europe/Paris), durée 2 h 15.
- **Qui** : pilot, doctrine de restitution v2.22.0, plancher d'écriture E-1 à E-15.

## 2. Verdict

5 vues sorties du suivi, 1 règle de plancher et 1 règle d'oracle posées, self-test de l'oracle
d'écriture porté de 7 à 16 cas, 2 défauts trouvés dans ma propre règle et corrigés — le harnais
garde 1 défaut connu, la propagation des skills en attente du prochain démarrage de session.

Coût de la question restante : complexité simple × durée court.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** — chacun dit ce qu'il arrête, ce qu'il faut fournir, et ce qui
se passe si rien ne vient :

- **la sévérité de la règle des nombres est à l'arrêt** ; il faut choisir entre la laisser refuser
  tout texte non conforme, ne corriger que les producteurs, ou déclarer une antériorité datée ;
  sans ce choix, tout fichier que l'une des 2 sessions ouvre affiche la ligne d'avertissement, et
  une règle qu'on voit rougir partout finit par se faire désactiver ;
- **la propagation du correctif écrit hier chez la forge des agents est à l'arrêt** ; elle se joue
  au prochain démarrage de session, qui rejoue la fraîcheur du poste ; jusque-là le contrôle des
  skills reste en défaut sur ce seul fichier ;
- **le nettoyage des 82 révisions déjà écrites est à l'arrêt** ; il faut décider si l'histoire se
  réécrit un jour ; sans cette décision, les 2 remèdes restent à moitié appliqués — l'amplification
  est arrêtée pour l'avenir, le passé garde ses 82 copies.

> **D-5 — Avec quelle sévérité la règle des nombres s'applique-t-elle au corpus déjà écrit ?**
>
> La règle est posée et son juge la joue : une valeur suivie d'une unité ou d'un dénombrable, une
> date, une heure, écrites en lettres, sont refusées. Mesuré avant de l'écrire, sur 235 documents
> de `output\`, `references\` et `gabarits\` : 181 la violent, soit 77,0 %. Ce sont de vrais
> défauts — le parc écrit ses nombres en lettres depuis le début — mais un juge qui refuse 3 textes
> sur 4 se fait désactiver, et ce dépôt a écrit la leçon 4 fois. Je n'ai posé aucune antériorité :
> votre consigne date d'aujourd'hui et vise ce qui s'écrit maintenant, l'existant ne se réécrivant
> pas (règle 5). La question est donc ce qu'on fait des 181.
>
> **Recommandation : (b).** Source consultée : la session voisine a traité le même profil sur sa
> propre règle le même jour — 31 textes refusés sur 484 — en corrigeant les 6 PRODUCTEURS, c'est-à-
> dire les gabarits et les générateurs d'où sortent les textes, et en laissant le corpus historique
> en l'état. La forme se corrige alors une fois et à la source, au lieu d'être poursuivie document
> par document.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (b) corriger les producteurs — gabarits, générateurs, référentiels — et laisser l'historique | effort moyen × court ; les textes neufs naissent conformes | exclut de rendre les 181 documents existants conformes |
| (a) laisser la règle refuser tout, sans antériorité | rien à payer ; la ligne d'avertissement s'affiche sur tout fichier touché | exclut la tranquillité de lecture des avertissements |
| (c) déclarer une antériorité datée au 16/09/2026 | effort simple × court ; l'existant sort du jugement | exclut de voir la dette, qui cesse d'être comptée |

> **Si rien n'est décidé** : (a) — la règle refuse tout texte non conforme, et les avertissements
> s'accumulent sur les fichiers anciens que l'on rouvre.

## 4. Traité

- Décision D-4 (a) exécutée : les 5 vues générées du registre ne sont plus versionnées — preuve : sous `c:\dev\digit-ai-factory\todo\`, `git ls-files` ne rend plus aucune vue, `git check-ignore` rend `.gitignore:47 todo/TODO.md`, et les 5 fichiers y sont régénérés puis vérifiés présents.
  - le facteur que vous payiez tombe de 2,6 à 1 : un identifiant écrit 1 fois dans la source vivait
    dans 132 révisions, dont 82 dues aux seules vues ;
  - ce qui se perd est d'une ligne et vérifié fichier par fichier : la lecture des vues sur
    l'hébergeur sans cloner ; aucun outil du parc ne les lit depuis l'histoire ;
  - la doctrine du registre porte la mesure, ce qui se perd et la commande qui les régénère.
- Un piège du retrait, payé et écrit — preuve : le premier essai a échoué en silence, `git ls-files`
  rendait encore les 5 vues après un commit qui semblait les avoir retirées.
  - un commit partiel sur un chemin suivi reprend la version du disque et défait le retrait de
    l'index ; la suppression se consigne depuis le disque, puis les vues se régénèrent.
- Consigne d'écriture des nombres devenue règle opposable — preuve : self-test de l'oracle
  d'écriture porté de 7 à 16 cas, dont 3 pour cette règle, dans ses 3 sens.
  - la règle E-14 (la quatorzième du plancher d'écriture) au plancher, le vocabulaire fermé en
    donnée datée, et la règle EC-9 (le contrôle exécuté qui la joue) sur chaque `.md` écrit, chez le
    pilot comme chez les produits ;
  - ce qu'elle ne vise pas est écrit avec elle : l'article, le pronom, la locution figée, le nombre
    en tête de phrase — « un défaut », « un banc neuf », « l'un des deux » restent de la prose.
- 2 défauts trouvés dans ma propre règle pendant sa mise au point, tous deux de la classe
  `regle-morte` — un contrôle qui rend des verdicts sans juger ce qu'il prétend juger — et corrigés
  rouge → vert au banc — preuve : le message citait `quarante test` au singulier, ce qui a mis la
  frontière de mot en cause ; après correction, le self-test rend 16 cas sans défaut.
  - la frontière portait 4 antislash au lieu de 2 dans un littéral gabarit, donc « test » matchait à
    l'intérieur de « tests » ; une frontière fausse ne se voit pas, elle rend des verdicts
    plausibles ;
  - le vocabulaire ne connaissait que la forme accentuée, ce qui rendait la règle muette sur la
    moitié d'un corpus qui écrit les 2 graphies.
- 4 valeurs en lettres trouvées dans les fixtures de l'oracle lui-même et corrigées — preuve :
  `quarante tests`, `huit jours`, `deux fois`, `deux jours`, que la règle neuve a refusées dès son
  premier passage sur le banc qui l'héberge. Sa propre donnée déclare que les citations ne sont pas
  jugées : elles vivent donc entre accents graves, y compris ici.
- Un défaut du parc trouvé par ma mesure et refermé dans l'heure par la session voisine — preuve :
  le contrôle des empreintes rendait 1 site de scellement non déclaré, introduit par un commit de
  14h50 ; il rend désormais exit 0.
- Travail mené en parallèle d'une seconde session sur les mêmes fichiers, sans collision — preuve :
  numérotation coordonnée des règles, self-test à 16 cas portant les 3 lots, et aucune
  renumérotation d'identifiant nécessaire au registre.

## 5. Non traité

- Le sort des 181 documents qui violent la règle neuve : motif `dependance_bloc_3` — il attend la
  décision ci-dessus.
- Le nettoyage des 82 révisions déjà écrites dans l'histoire : motif `gate_gouvernance` — il
  coûterait le reclonage du parc et rendrait orphelines 106 empreintes de commit citées au
  registre ; c'est une décision humaine, jamais un geste de session.
- La propagation du correctif écrit hier chez la forge des agents : motif `dependance_externe` —
  elle se joue au démarrage de session suivant.
- Les 21 items des forges voisines couverts par votre mandat : motif `borne_atteinte` — la session
  voisine en traite une partie, ce tour-ci a porté vos 2 décisions.

## 6. Écarts à la lettre

Vous avez demandé les chiffres plutôt que les lettres et « 4a » → j'ai fait les 2 → en ajoutant un
juge que vous n'aviez pas demandé, parce qu'une consigne d'écriture sans contrôle se perd au
troisième document, et en vous rendant la question de sévérité plutôt qu'en la tranchant. Ce
message ne contient rien d'autre que le compte rendu de ces 2 décisions.

## 7. Risques

- La règle neuve refuse 77 % du corpus existant.
  - signal : les avertissements deviennent du bruit et l'on cesse de les lire ;
  - parade : la question vous est posée avant que l'habitude ne se prenne, et 3 voies chiffrées sont
    devant vous.
- 2 sessions écrivent dans les mêmes fichiers du dépôt.
  - signal : un commit partiel qui reprend le travail de l'autre, ou 2 identifiants frappés sur le
    même numéro ;
  - parade : chaque commit nomme ses chemins, le registre s'écrit par son outil, et les 2 sessions
    s'annoncent leurs écritures — vérifié ce tour, aucune renumérotation nécessaire.
- Les vues ne sont plus lisibles sur l'hébergeur.
  - signal : quelqu'un cherche l'état du registre sans cloner et ne trouve rien ;
  - parade : la commande de régénération est écrite dans le fichier d'exclusion et dans la doctrine
    du registre, aux 2 endroits où on la cherche.

## 8. Prochaines actions

Deux travaux que le pilot mène seul dès la prochaine session, et trois gestes qui vous reviennent —
un arbitrage et deux feux verts. Les premiers sont listés d'abord.

| Sélecteur | Action | Acteur | Identifiant | Motif / raison | Où | Si rien n'est fait |
|---|---|---|---|---|---|---|
| **A-1** | Corriger les producteurs de textes une fois D-5 tranchée | `auto_ia` | TF-1153 | `dependance_bloc_3` — la voie retenue décide de ce qui est corrigé | `gabarits\`, `references\`, générateurs de `scripts\` | les textes neufs continuent de naître avec des nombres en lettres |
| **A-2** | Traiter les items des forges voisines restants sous mandat | `auto_ia` | neuve | `borne_atteinte` — un dépôt par session, hors de ce que ce tour pouvait porter | dépôts voisins, en commençant par celui qui porte le plus d'items | le mandat reste ouvert sans être exercé |
| **A-3** | Trancher D-5, la sévérité de la règle des nombres | `manuelle_utilisateur` | TF-1153 | `decision` — 3 voies, dont aucune n'est prescrite par un texte | bloc 3 de cette synthèse, option (b) recommandée | les avertissements s'accumulent jusqu'à ne plus être lus |
| **A-4** | Donner le feu vert de publication du dépôt du pilot | `manuelle_utilisateur` | neuve | `decision` — la porte du dépôt réserve la publication au mot humain | `FORGE_PUSH_GO="<motif>" git push` depuis `c:\dev\digit-ai-factory` | les produits ne reçoivent ni la doctrine à jour ni la règle neuve |
| **A-5** | Donner le feu vert de publication de la forge des agents | `manuelle_utilisateur` | TF-1006 | `decision` — même porte, autre dépôt | `FORGE_PUSH_GO="<motif>" git push` depuis `c:\dev\digit-ai-forge-agents` | la règle de remontée corrigée hier reste locale |

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Vues sorties du suivi et regle d ecriture des nombres - 20260916d.md`
- `.gitignore` et `references\TODO-FORGE.md` — le retrait des vues, sa mesure et sa commande
- `references\ECRITURE.md` E-14, `references\tics-redactionnels.json`, `oracles\oracle-ecriture.mjs` EC-9
- `todo\TODO.jsonl`, `todo\CLASSES.json`
- `input\01-candidatures\valeurs-en-toutes-lettres-20260916a.tf.jsonl`
