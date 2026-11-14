---
destinataire: humain
role_destinataire: {qui approuve les gestes et le découpage, et ce qu'il décide à la lecture}
gabarit: gd-cadrage-reprise
version_du_gabarit: 1.0.0
---

# {Produit} — Cadrage de la reprise : {sujet}

*{JJ/MM/AAAA} · {produit repris, dépôt, branche de départ}*

## Le besoin

> « {La demande, dans les mots du demandeur.} » — {demandeur, date}

- **Résultat attendu** : {ce qui sera constaté à la fin de la reprise}.
- **Périmètre** : {ce qui est repris}.
- **Hors périmètre** : {ce qui ne l'est pas, et pourquoi}.

## Les configurations par environnement

| Élément | {dev} | {recette} | {production} | Source |
|---|---|---|---|---|
| {élément} | {sa valeur en dev, ou l'emplacement du secret} | {en recette} | {en production} | {fichier, console ou commande où la valeur se lit} |

*{Les écarts entre environnements qui comptent pour la reprise, ou « aucun écart relevé ».}*
*{Un environnement non relevé s'écrit ici avec son motif.}*

## Les lots

| # | Lot | Contenu | Dépend de | Preuve de fin |
|---|---|---|---|---|
| 1 | {nom du lot} | {ce qu'il livre} | {aucun, ou numéros de lots} | {fait constatable : fichier, code de retour, affichage} |
| 2 | {nom du lot} | {ce qu'il livre} | {1} | {fait constatable} |

## La recette

| Lot | Critère (oui ou non) | Qui le joue | Avec quoi | Où le résultat se lit |
|---|---|---|---|---|
| 1 | {ce qui doit être vrai} | {rôle} | {commande, jeu de données, page} | {fichier ou écran} |

## Les gestes distants à approuver

| # | Geste | Cible distante | Effet | Réversible | Approbateur | État |
|---|---|---|---|---|---|---|
| 1 | {verbe et objet} | {hébergement, domaine, service de données, dépôt distant} | {ce qui change, et ce qui peut se perdre} | {oui : retour arrière en quelques mots / non} | {personne ou rôle nommé} | à approuver |

*Le Build ne joue que les gestes passés à `approuvé le JJ/MM/AAAA`.*

## Sources

{Les fichiers, relevés et commits lus, avec leur date, en une ligne.}

*Gabarit : gd-cadrage-reprise · version du gabarit 1.0.0*
