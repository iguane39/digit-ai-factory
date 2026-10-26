---
destinataire: humain
---

# Synthèse Mandat — D-74 exécutée : conventions du client chargées à l'ouverture de ses produits (26/10/2026)

## 0. Synthèse d'ouverture

Le fichier des conventions du client existe à la racine de son projet commun et s'affiche désormais à l'ouverture de chacun de ses produits. Il porte les 2 conventions que vous aviez dû rappeler : un enregistrement d'application Entra par environnement, et l'état Terraform sans groupe de ressources `_TFSTATE`. Chaque ligne renvoie à la règle complète déjà écrite dans le projet commun. Le fichier est enregistré chez le client, sans publication. Rien ne vous attend sur ce point.

## 1. En-tête d'identification

Exécution de votre réponse D-74 (a) · sur le projet commun du client et le pilot digit-ai-factory · le 26/10/2026 à 14:36 (heure de Paris, UTC+1) · Claude Opus 5.5, commit local b6aca5e chez le client, sans publication.

Intention : que les conventions du client ne dépendent plus de votre mémoire. Test rétro : le tour sert l'intention, car le relevé d'un produit du client les charge, mesuré depuis l'un d'eux.

## 2. Verdict en une ligne

1 fichier de 823 octets sur 2 048 permis, 2 conventions sur 2, chargé par le relevé d'un produit du client ; aucune écriture chez ce produit.

## 3. Décisions attendues

Aucune décision nouvelle. Rappel : D-71, publication du pilot après rebase, posée à 10:22, inchangée.

## 4. Traité

- Conventions relues dans `docs/REFERENCE-DEVELOPPEUR.md` du projet commun : lignes 1101 et 2765 pour Entra, lignes 1771 à 1776 pour l'état Terraform.
- `CONVENTIONS-CLIENT.md` écrit à la racine du projet commun, 823 octets, une ligne par convention avec son renvoi.
- Enregistrement chez le client : `git commit --only` du seul fichier, commit b6aca5e ; les fichiers déjà modifiés chez lui n'y entrent pas.
- Preuve de chargement : relevé d'ouverture joué depuis un produit du client, section « Conventions du client » présente avec le contenu du fichier.
- Contrôle : aucun fichier écrit chez ce produit pendant l'essai (`find -newermt`, 0 fichier).
- Registre : TF-1946 annoté par `todo/journaliser.mjs`.
- Relecture d'intention : sans objet, une écriture de 2 lignes déjà décrites mot pour mot par D-74.

## 5. Non traité

- Publication du projet commun : non faite, parce qu'aucun feu vert n'a été donné pour le publier ; son dépôt distant n'est pas sur GitHub, sa visibilité n'a pas pu être mesurée par `gh`.
- Barrière dès la 2e fois outillée : toujours à faire dans TF-1946 (A-1).

## 6. Écarts à la lettre

Aucun écart : vous avez retenu l'option (a), le fichier dans le projet commun avec les 2 conventions, enregistré sans publication.

## 7. Risques

- Énoncé : une convention change dans `docs/` et sa ligne résumée devient fausse. Signal : une ligne qui contredit le document qu'elle cite. Parade : chaque ligne renvoie à sa source, qui fait foi.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1946 | Outiller la barrière dès la 2e fois en contrôle du registre | auto_ia | — | `node todo/oracle-todo.mjs` après ajout de la règle et de ses fixtures | une récidive peut encore recevoir une règle reformulée |
| **A-2** | TF-1942 | Rebaser le pilot, renuméroter les collisions locales, publier | auto_ia | gate_gouvernance | `git pull --rebase origin main` puis `git push origin main` | l'autre poste ne reçoit pas T1 |
| **A-3** | TF-1942 | Lancer la première analyse d'œil critique sur chaque poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | T2 ne peut pas s'ouvrir sur une mesure |

## 9. Traces

- `C:\dev\_Client-A\Produit-64\CONVENTIONS-CLIENT.md`, commit b6aca5e.
- `oracles/hook-ouverture.mjs`, fonction `lignesPreferences`.
- `todo/TODO.jsonl`, TF-1946.
