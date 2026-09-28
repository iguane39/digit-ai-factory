---
marque: Digit-AI
marque_html: Digit<em>-</em>AI
objet: {Objet du guide — « Guide du développeur », « Guide d'exploitation »…}
sous_titre: {Périmètre — le produit, la plateforme ou le programme couvert}
description: {Une phrase pour les moteurs et les onglets : ce que le guide couvre, en combien de vues, et ce qui s'y ouvre en fenêtre.}
role_destinataire: {qui lit ce guide, et ce qu'il DÉCIDE ou FAIT avec — installer, appliquer une règle, livrer, exploiter}
version: 20260924a
source_affichee: {docs/NOM-DU-GUIDE.md — le chemin du Markdown tenu à jour, que les prompts citent}
cle_theme: {nom-du-guide}-theme
favicon_lettre: {une lettre}
gabarit: gd-guide-de-reference
version_du_gabarit: 1.0.0
---

# {Objet du guide} — {Périmètre}

## Démarrer — {ce que la vue d'entrée promet, en une ligne}
<!-- vue: cle="demarrer" libelle="Démarrer" annonce="{le parcours et les questions fréquentes}" inventaire="{Cette vue porte… — ce qu'elle contient, et ce qui la distingue de la vue suivante.}" -->

{La phrase d'ouverture de la vue : ce que le lecteur saura faire en la quittant, et par où il commence.}

### 1 — {Le parcours en N étapes}

{Le chapeau du chapitre : ce qu'il apprend au lecteur, en une phrase qui ne répète pas son titre.}

| Étape | Ce que vous faites | Vue qui le détaille |
|---|---|---|
| 1 | {geste} | [{vue}](#chapitre-type) |
| 2 | {geste} | [{vue}](#reference) |

**Exemple de lecture.** {La ligne N se lit : … — ce qu'il faut voir dans CE tableau, en une phrase.}

### 2 — {Les questions les plus fréquentes}

{Le chapeau : quelles questions, posées par qui, et comment la table se parcourt — elle se filtre et se trie dès huit lignes.}

| Question | Vue qui répond | Thème |
|---|---|---|
| {question 1} | [{vue}](#chapitre-type) | {thème} |
| {question 2} | [{vue}](#chapitre-type) | {thème} |
| {question 3} | [{vue}](#chapitre-type) | {thème} |
| {question 4} | [{vue}](#chapitre-type) | {thème} |
| {question 5} | [{vue}](#reference) | {thème} |
| {question 6} | [{vue}](#reference) | {thème} |
| {question 7} | [{vue}](#reference) | {thème} |
| {question 8} | [{vue}](#reference) | {thème} |

**Exemple de lecture.** {La ligne N se lit : la question … trouve sa réponse dans la vue …}

## Chapitre type — {une vue de règles, de gestes ou de procédures}
<!-- vue: cle="chapitre-type" libelle="Chapitre type" annonce="{une règle, ses pas, ses vérifications}" inventaire="{Cette vue porte… — les règles ou les gestes qu'elle réunit, et leurs contrôles.}" -->

{La phrase d'ouverture : ce que cette vue engage, et ce qui se passe si on ne l'applique pas.}

### `{CODE-R01}` — {Titre de la règle}

**Niveau : {obligatoire | recommandé}**

**Source** : {le document ou le fait qui fonde la règle, daté}.

**Exceptions** : {les cas où elle ne s'applique pas, ou « aucune »}.

{Le chapeau : la règle elle-même, en une phrase opposable.}

**{Premier geste de la règle, en titre de quatre mots ou plus.}** {Ce qu'on fait, et pourquoi c'est ainsi.}

**Vérification.** {La commande ou le constat qui prouve que la règle est tenue.}

**Attention.** {Le piège qu'un lecteur pressé rencontre, et comment l'éviter.}

### 2 — {Un geste en étapes}

{Le chapeau : le geste, et ce qui le clôt.}

```
{commande 1}
{commande 2}
```

**Vérification.** {Ce que la dernière commande doit répondre ; une citation de `{CODE-R01}` ouvre sa fiche.}

## Référence — {vocabulaire et contacts}
<!-- vue: cle="reference" libelle="Référence" annonce="{le vocabulaire du guide et à qui s'adresser}" inventaire="{Cette vue porte… — les termes définis une fois, et les contacts par sujet.}" -->

{La phrase d'ouverture : les mots du guide ont un sens précis, défini ici une seule fois.}

### 1 — {Vocabulaire}

{Le chapeau : chaque terme, le sens qu'il prend dans ce guide, et la vue où il sert.}

| Terme | Sens dans ce guide | Vue où il sert |
|---|---|---|
| {terme} | {définition en une phrase} | {vue} |
| {terme} | {définition en une phrase} | {vue} |

**Exemple de lecture.** {La ligne N se lit : le terme … veut dire … dans ce guide.}
