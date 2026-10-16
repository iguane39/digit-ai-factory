---
role: protocole de mesure de l'étude d'opportunité « personas par phase » du 14/09/2026, figé AVANT la sélection de l'échantillon, AVANT la baseline et AVANT l'écriture des fiches de persona (décision humaine D-1 (a) du 14/09/2026 sur le prompt réécrit de l'analyse L99)
fige_le: 2026-09-14 09:12 +0200
sources_de_verite: [output/03-etudes/20260914-L99-personas-par-phase.md (chapitre 8, prompt réécrit, section MESURE), ~/.claude/skills/experts-forge/references/schema-fiche-expert.md (modèle de fiche, loi « matériellement différente »)]
---

# Protocole de mesure — personas par phase (figé le 14/09/2026 à 09:12)

Ce protocole fixe, avant tout résultat, ce qui sera mesuré et comment on le jugera. Il est écrit
avant que l'auteur de l'étude ait lu un seul défaut de l'échantillon, pour que ni les points de vue
ni la consigne ne soient taillés sur les défauts cherchés.

## 1. Les trois points de vue candidats

Ils sont choisis parmi les parties prenantes que la factory ne porte aujourd'hui dans aucune fiche
`experts-forge` (les 17 fiches admises sont des domaines de contenu, pas des rôles).

- **exploitant** : la personne qui fait tourner le produit, le surveille et le dépanne ;
- **utilisateur final** : la personne qui lit ou utilise le livrable sans avoir vu sa fabrication ;
- **mainteneur** : la personne qui reprendra le livrable dans six mois pour le faire évoluer.

Les fiches sont rédigées **après** le gel de la baseline, par un agent qui ne reçoit ni
l'échantillon ni les défauts : seulement le rôle, les phases de la factory et le modèle de fiche.

## 2. La consigne de relecture commune

Toutes les passes, baseline comprise, reçoivent la même consigne et le même modèle (Sonnet, défaut
de routage du contrat d'interface §4). La passe persona y ajoute seulement la fiche.

> Tu relis un livrable de la phase `<phase>` d'un run produit. Ce livrable a passé ses contrôles
> automatiques. Trouve les défauts qui subsistent : ce qui est faux, manquant, incohérent, ou qui
> posera un problème plus tard. Rends au plus 8 constats. Pour chacun : la localisation (fichier,
> section ou ligne), l'énoncé du défaut en une phrase, sa conséquence en une phrase. Ne propose
> aucune correction et ne réécris rien. Chaque constat pointe un passage du livrable ; un constat
> qui ne pointe rien n'est pas recevable.

Passe persona, ajout unique : « Relis depuis le point de vue décrit dans la fiche ci-dessous. »

## 3. Séquence et séparation

Chaque condition est jouée dans une **session séparée** (un sous-agent neuf par condition). Ordre :
échantillon listé → livrables reconstitués → baseline jouée et **enregistrée dans un fichier
horodaté** → fiches écrites → trois passes persona → jugement.

## 4. Le jugement

Un agent juge, distinct des relecteurs, reçoit pour chaque livrable l'énoncé du défaut échappé et
les listes de constats des quatre conditions, **anonymisées et mélangées** (étiquettes L1 à L4, la
correspondance gardée hors de sa vue). Pour chaque constat il rend une étiquette parmi trois :

- **retrouvé** : le constat désigne le défaut échappé (même endroit ou même cause) ;
- **autre** : un défaut différent, vérifiable dans le passage pointé ;
- **faux** : contredit par le livrable, ou générique (transposable tel quel à n'importe quel
  livrable, critère « non matériel » du schéma de fiche `experts-forge`).

## 5. Ce qui est compté, et le seuil fixé d'avance

**Mode de lecture** : une ligne par grandeur mesurée, par condition ; la dernière colonne dit comment
elle entre dans le verdict.

| Grandeur | Définition | Usage au verdict |
|---|---|---|
| Rappel | nombre de livrables (sur 10) où au moins un constat est « retrouvé » | un persona est retenu s'il fait au moins **baseline + 2** |
| Constats faux | nombre total de constats « faux » sur les 10 livrables | un persona est refusé s'il fait plus du **double** de la baseline |
| Autres | nombre de constats « autre » | rapporté, sans seuil : il mesure l'apport hors échantillon |
| Tokens | tokens consommés par la condition | rapporté, entre dans le coût des options |

Borne : 3 personas × 10 livrables, plus la baseline ; une seule campagne ; aucune passe rejouée pour
atteindre le seuil. Si moins de 10 livrables sont reconstituables, le seuil est ramené à la même
proportion (un cinquième de l'échantillon) et le verdict est déclaré **sous réserve**.
