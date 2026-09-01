# Retours forges — Produit-11 — 20260825b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : remédiation complète de Produit-11 après l'audit POC-to-Prod du 25/08/2026, sur
  mandat humain. Demande explicite : *« Plusieurs items de la remédiation sont des doublons et
  ne devraient pas apparaître plusieurs fois dans l'onglet Plan de remédiation de l'audit
  généré. Corriger l'audit et remonter à la Factory ce problème pour correction globale. »*
- **Références ledger** : `forge\ledger.jsonl` seq 163
- **Lot précédent** : `Produit-11 - RETOURS - 20260825a.md`, remis et donc immuable.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-08-25

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-33 sont consommés. Ce lot
continue en RT-34 … RT-35.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

Le plan de remédiation auto-porté par le rapport d'audit annonçait **64 actions**. Après
rapprochement, il en contenait **33 distinctes** : **onze paires disaient exactement la même
chose**, et sept autres se recouvraient partiellement.

Voici quatre des onze paires, telles que le kit les a produites :

| Identifiant | Texte |
|---|---|
| `REM-D01-01` | Placer le front derrière un WAF |
| `REM-ADR0307` | Placer le front derrière un WAF (Application Gateway ou Front Door)… |
| `REM-D04-02` | Implémenter la purge |
| `REM-ADR0611` | Spécifier les durées de conservation et implémenter une purge automatique… |
| `REM-D05-01` | Désigner un Data Owner métier |
| `REM-ADR0601` | Désigner nommément un Data Owner métier et consigner les acteurs data… |
| `REM-D12-03` | Référencer l'application en CMDB |
| `REM-ADR0504` | Référencer l'application et ses composants dans la CMDB… |

**La moitié du défaut nous appartient** : l'auditeur — moi — a écrit en `plan_action` de
domaine des remédiations que le verdict d'ADR portait déjà. Le gabarit dit pourtant, en toutes
lettres : « reporter chaque écart ADR en **`constats`** du domaine concerné ». `constats`, pas
`plan_action`. La faute est lisible, et elle est corrigée dans le rapport du jour : les dix-huit
actions de domaine redondantes ont été retirées, le plan est passé de 64 à 33.

**L'autre moitié appartient à l'outillage**, et c'est l'objet de ce lot. Rien, dans toute la
chaîne, ne voit qu'une action est écrite deux fois : ni le moteur qui agrège, ni la porte
machine qui a rendu « CONFORME — rapport diffusable » sur un plan gonflé de 94 %.

---

## RT-34 — L'agrégation du plan de remédiation ne rapproche jamais deux actions

**Gravité : majeur.**

`REMEDIATION_PLAN` concatène deux sources — les `plan_action` des 17 domaines et les
remédiations des ADR non conformes ou partiels — et attribue à chacune un identifiant stable.
Deux textes identiques produisent donc deux identifiants, deux lignes, deux charges.

**Ce que ça coûte, concrètement**, et ce n'est pas cosmétique :

1. **La charge est fausse.** Deux actions « Terraform » à huit jours chacune faisaient seize
   jours de travail pour une seule chose à faire. Un plan qui surestime de 94 % ne sert pas à
   arbitrer.
2. **Le suivi de clôture devient impossible à tenir juste.** `verifier-remediation.mjs --status`
   exige une preuve par identifiant : la même preuve doit être recopiée sur deux lignes, et le
   jour où l'une est cochée et pas l'autre, le contrôle refuse une remédiation pourtant faite.
3. **Le double comptage est invisible à la lecture.** Les deux lignes ne se suivent pas dans le
   plan — elles sont triées par priorité, et une action de domaine « prio » se retrouve à vingt
   lignes de la remédiation d'ADR qu'elle répète.

**Demande.** Que l'agrégation rapproche les actions et signale les redites plutôt que de les
empiler. Le rapprochement n'a pas besoin d'être malin : sur ce rapport, une comparaison du
vocabulaire des textes, seuils à 45 % de recouvrement, a trouvé les onze paires exactes sans
un seul faux positif — et les quatre paires restantes après correction sont toutes de vrais
sujets distincts. Le minimum utile serait un **avertissement nommant les paires**, que
l'auditeur tranche ; le mieux serait un **rattachement explicite** d'une action de domaine à
l'ADR qui la porte, avec comptage unique.

---

## RT-35 — La porte machine ne compte pas ce qu'elle laisse passer

**Gravité : majeur.**

`verifier-rapport-audit.mjs` a rendu **« CONFORME — format conforme au modèle, rapport
diffusable »** sur ce rapport. Le contrôle est réel et il attrape des choses vraies : il a
refusé, le matin même, un nombre de domaines bloquants saisi à 6 quand le moteur en calculait
7. Sur ce point-là, il a eu raison contre l'auditeur, et c'est précieux.

Mais son périmètre est le **format**. Le plan de remédiation, lui, est une **donnée produite par
le rapport et destinée à être consommée par le projet** — le gabarit le dit : « le projet
récupère la remédiation exhaustive sans export manuel ». Une donnée destinée à être consommée
mérite un contrôle de cohérence, pas seulement de forme.

**Ce qui n'est vérifié nulle part aujourd'hui :**

- deux actions au texte quasi identique ;
- une action de domaine qui redit la remédiation d'un ADR **du même domaine** — cas le plus
  fréquent ici, et le plus mécaniquement détectable ;
- un écart entre le nombre d'actions annoncé et le nombre d'actions distinctes.

**Demande.** Étendre la porte machine — ou ajouter un contrôle voisin dans le
`compliance-pack` — à la **cohérence du plan de remédiation**, avec le même esprit que le
contrôle existant sur les domaines bloquants : ne pas décider à la place de l'auditeur, mais
**refuser de laisser passer en silence** ce qu'une machine sait voir.

**Pourquoi ce retour vaut plus que ce seul rapport** : le défaut n'a rien de propre à Produit-11. Tout
audit qui suit la consigne du gabarit — reporter les écarts ADR dans les domaines — et qui
formule en plus un plan d'action par domaine produira les mêmes doublons. Le kit rend cette
faute facile et ne la signale pas.

---

## Ce que nous avons corrigé de notre côté, pour que le retour soit honnête

- Les 18 actions de domaine redondantes ont été retirées du rapport du 25/08/2026 ; le plan est
  passé de **64 à 33 actions**, dont **17 sont closes avec preuve** dans
  `output/03 - Scans & preuves/audit-20260825/suivi-remediation.json`.
- Le rapprochement a été fait **systématiquement**, par comparaison de vocabulaire sur les 2 016
  paires possibles, et non à l'œil — c'est ainsi que les onze paires exactes ont été trouvées,
  dont plusieurs que la lecture avait laissées passer.
- La méthode est reproductible : elle tient en quinze lignes, et c'est précisément pourquoi
  elle nous semble avoir sa place dans le `compliance-pack` plutôt que dans nos scripts.
