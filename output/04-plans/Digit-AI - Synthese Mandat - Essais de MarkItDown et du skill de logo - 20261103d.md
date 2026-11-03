---
destinataire: humain
---

# Synthèse Mandat — essais de MarkItDown et du skill de logo (03/11/2026)

## 0. Synthèse d'ouverture

Les 2 essais sont joués, et aucun outil n'est à installer. MarkItDown convertit bien vos documents, mais la Factory a déjà un moyen équivalent ou meilleur pour chaque format. Le skill de logo apporte une vraie méthode, que je propose de reprendre dans la forge de design, alors que son contrôle automatique note 100/100 des logos illisibles en petit. 3 concepts de logo vous attendent pour le produit de pentest, et c'est le seul choix qui vous revient, avec les 2 décisions sur les revues de code.

Livré : [Essai de MarkItDown](output/03-etudes/Digit-AI%20-%20Note%20-%20Essai%20de%20MarkItDown%20sur%203%20entrants%20bureautiques%20-%2020261103a.md) · [Essai du skill de logo](output/03-etudes/Digit-AI%20-%20Note%20-%20Essai%20du%20skill%20logo-design-skill%20sur%20un%20produit%20en%20construction%20-%2020261103b.md)

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`, exécution de vos réponses 155a, 156a et 157a. Période : 03/11/2026 de 10:30 à 10:59, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5 ; 2 agents `redacteur` en Sonnet, 1 `verificateur` en Haiku pour la relecture de leur consigne.

Intention de la demande : savoir sur des faits si ces 2 outils servent la Factory, le second sur le produit de pentest en construction.

Test rétro : chaque outil a son verdict mesuré ; le goût des logos reste à votre jugement.

## 2. Verdict en une ligne

MarkItDown à laisser, 3 formats sur 3 déjà couverts ; skill de logo à reprendre comme méthode, 3 concepts dessinés, audit du skill à 100/100 sur 6 fichiers dont 3 défectueux à 16 px.

## 3. Décisions attendues

**D-152** : correction des failles du second produit relu, posée le 02/11 à 17:12, inchangée.

**D-153** : étude d'une étape de revue de code, posée le 02/11 à 17:12, inchangée.

> **D-158 — Quel concept de logo retenir pour le produit de pentest, avant de finir son jeu d'icônes ?**
>
> - **De quoi s'agit-il** : 3 logos en une couleur pour le produit en construction dans `C:\dev\_Client-A\PenTests`, dessinés par la méthode du skill, sur la planche `output/logo-essai-20261103/planche-comparaison.png` de ce produit. Le skill s'arrête ici pour une revue humaine, avant les icônes et les favicons.
> - **Le problème** : A reste net de 64 à 16 px ; B devient des points en diagonale à 16 px ; C se lit « P! » dès 64 px. La planche du skill marque B « recommended », mais c'est l'étiquette de son outil, pas un jugement fondé sur la lisibilité.
> - **Pourquoi vous** : c'est un choix de marque, et le nom du produit n'est pas encore arrêté.
> - **Recommandation : (a)** — c'est le seul qui tient à la taille d'un favicon, et son idée, ce qui est hors cadre n'existe pas, dit le périmètre signé. Source consultée : `output/03-etudes/Digit-AI - Note - Essai du skill logo-design-skill sur un produit en construction - 20261103b.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Équerres | Le jeu d'icônes et de favicons se produit sur A, dans le même dossier du produit, sans commit | Simple × court | Possible : les fichiers se suppriment |
| (b) Maillon vide | Même suite sur B, avec un épaississement de plus pour le rendre lisible à 16 px | Simple × court | Possible : les fichiers se suppriment |
| (c) P au pied détaché | Même suite sur C, dont la lecture « P! » reste à corriger | Simple × court | Possible : les fichiers se suppriment |
| (d) Aucun pour l'instant | Les 3 concepts restent dans le dossier du produit, et la marque se décidera avec le nom | Nul | Sans objet |

> **Sans réponse** : (d), les 3 concepts restent en l'état.

## 4. Traité

Les 2 essais suivent la consigne relue, et leurs notes passent `oracle-ecriture`.

**MarkItDown (155a)**

- **Mesure** : sur un Word, un Excel et un PowerPoint réels, le texte retrouvé est le même qu'avec `pandoc`, `openpyxl` et `slide_text.py` du skill `pptx`, en 5 à 20 fois plus de temps. Sur un tableau Word synthétique, MarkItDown perd l'en-tête et les cellules fusionnées.
- **Poste** : l'installation tire 31 paquets et 260 Mo ; `pandoc`, qu'exige le skill `docx`, manque au poste. Le dossier jetable est vidé.

**Skill de logo (156a)**

- **Méthode** : la recherche dans sa bibliothèque a écarté un concept trop proche d'un logo existant avant qu'il soit dessiné, et l'épreuve de l'étagère montre les 3 concepts distincts de leur catégorie.
- **Contrôle** : `svg_audit.py` du skill note 100/100 les 6 fichiers produits, dont 3 défectueux à 16 px. La page qui porte la planche passe `run-oracles-design.mjs --rendu` : PASS sur 12 juges.
- **Registre** : `TF-2073` pour reprendre la méthode dans `systeme-de-marque`, et `TF-2074` pour un contrôle de lisibilité à 16 px.

**Motifs du tableau (157a)** : ils restent tels quels, rien à exécuter.

**Coût** : 127 958 et 184 090 jetons mesurés ; le second dépasse le budget de 150 000 que la consigne fixait, alors que l'agent s'estimait à 115 000.

Relecture d'intention : dérive consignée sous RI-20261103-08, sans passe de correction. Ses 2 écarts majeurs sont les 2 documents synthétiques, déclarés au bloc 6, et des commits d'autres sessions du même dépôt, qui ne viennent pas de ce tour. Ses 4 écarts de choix sont l'écriture chez le produit, la part de la fiche lue pour le brief, le budget de jetons et des décisions d'un autre fil ; les 3 premiers sont dits ici et au bloc 6.

## 5. Non traité

- **Le manque de `pandoc` pour le skill `docx`** — motif : hors_mandat, aucune classe du registre ne le décrit, et le registre refuse une création sans classe.
- **Le jeu d'icônes du logo** — motif : decision, il attend D-158.
- **L'enregistrement des logos chez le produit** — motif : hors_mandat, une autre session construit ce produit, et les fichiers restent hors de git.

## 6. Écarts à la lettre

- Vous avez choisi un essai sur un produit fictif → l'essai a porté sur le produit de pentest → c'est la précision de votre réponse 156a.
- Le premier essai portait sur 3 entrants → l'agent a ajouté un Word et un PowerPoint synthétiques → pour juger les tableaux, qu'aucun des 3 entrants ne contenait.
- Vous n'avez fixé aucun budget → j'ai posé 150 000 jetons par essai, et le second l'a dépassé → pour borner la dépense ; je ne la contrôle pas pendant l'exécution.
- Vous avez nommé le produit → le brief vient des sections 0 à 3 de sa fiche → elles décrivent l'intention, le produit et ses invariants, le reste décrit sa construction.

## 8. Prochaines actions

Le logo passe d'abord, parce que le produit avance ; les 2 décisions sur les revues restent ouvertes en parallèle.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Choisir le concept de logo du produit de pentest | `TF-2073` | manuelle_utilisateur | decision : choix de marque | `output/04-plans/Digit-AI - Synthese Mandat - Essais de MarkItDown et du skill de logo - 20261103d.md`, bloc 3 | si rien n'est fait : le produit reste sans logo |
| A-2 | Décider de corriger les failles du second produit relu | `TF-2057` | manuelle_utilisateur | decision : écriture chez un produit | D-152 à `decisions/REGISTRE.jsonl` | si rien n'est fait : la version en attente garde ses failles |
| A-3 | Décider d'étudier une étape de revue de code | `TF-2057` | manuelle_utilisateur | decision : règle commune aux produits | D-153 à `decisions/REGISTRE.jsonl` | si rien n'est fait : chaque revue reste à demander |

## 9. Traces

- Notes : `output/03-etudes/Digit-AI - Note - Essai de MarkItDown sur 3 entrants bureautiques - 20261103a.md` et `output/03-etudes/Digit-AI - Note - Essai du skill logo-design-skill sur un produit en construction - 20261103b.md`.
- Logos : `C:\dev\_Client-A\PenTests\output\logo-essai-20261103\`, hors de git.
- Registre : `TF-2073` et `TF-2074` à `todo/TODO.jsonl` ; D-158 à `decisions/REGISTRE.jsonl`.
