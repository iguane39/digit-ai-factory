---
destinataire: humain
---

# Synthèse Mandat — essai de l'audit de sécurité de Cloudflare (02/11/2026)

## 0. Synthèse d'ouverture

L'essai est joué, et la règle fixée à l'avance écarte l'outil de Cloudflare pour son coût. Il retrouve les 8 failles de code semées, mais une simple requête à un agent les retrouve aussi, pour 20 fois moins de jetons, alors que nos contrôles n'en voient aucune. Ce résultat vaut pour une seule cible, courte et sans doute trop facile. Le second passage prévu n'a pas été joué, faute de marge sous votre plafond. L'avertissement est revenu en tête du tableau de tri. Rien ne vous est demandé : la suite proposée attend votre revue hebdomadaire.

Livré : [Rapport de l'essai](output/03-etudes/Digit-AI%20-%20Rapport%20-%20Essai%20borne%20de%20l%20audit%20de%20securite%20de%20Cloudflare%20-%2020261102k.md) · [Tableau de tri](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20-%2020261102e.md)

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`, exécution de vos réponses 127a et 128a. Période : 02/11/2026 de 11:00 à 12:03, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5 ; 1 agent `constructeur` pour la cible, 28 agents génériques Sonnet pour le jeu de l'outil, 1 pour la requête unique, 2 agents `verificateur`.

Intention de la demande : savoir sur des faits si l'outil de Cloudflare apporte quelque chose à nos contrôles de sécurité, dans la limite de 3 150 000 jetons.

Test rétro : la question reçoit une réponse chiffrée sur cette cible. Sa portée reste bornée par une seule cible et un seul passage.

## 2. Verdict en une ligne

Outil écarté pour coût : 2 185 298 jetons pour un passage contre un plafond de 1 500 000 ; 8 failles de code sur 8 pour l'outil et pour la requête unique à 106 865 jetons, 0 sur 8 pour nos contrôles ; 2 650 033 jetons dépensés sur 3 150 000.

## 3. Décisions attendues

Rien n'attend de décision. Vos réponses 127a et 128a sont exécutées, et la suite `TF-2057` entre au statut candidat pour la revue hebdomadaire.

## 4. Traité

L'essai a suivi le protocole écrit avant le jeu, à ses écarts près, listés au bloc 6.

- **128a.** La section d'avertissement revient en tête du tableau, `oracle-tri-de-sujets` PASS.
- **Résultat par approche**, notée par un script écrit avant le jeu, contre une liste scellée :
  - nos contrôles de `digit-ai-forge-websec` : 0 faille de code sur 8, 4 de configuration sur 4, 0 jeton ;
  - la requête unique : 8 sur 8 et 4 sur 4, 106 865 jetons ;
  - l'outil de Cloudflare : 8 sur 8 et 3 sur 4, 2 185 298 jetons.
- **Les 6 critères.** C1 rappel, C2 manque de nos contrôles et C4 précision sont tenus. C3 apport face à la requête unique et C6 coût ne le sont pas. C5 vérification adverse n'est pas jugé : 3 candidats sans faille, sous le minimum de 4 ; le vérificateur a gardé les 16 candidats.
- **Contrôles.** Les 2 validateurs de l'outil, relus en entier par un agent, passent sans modification dans un conteneur sans réseau : 16 constats et 25 unités valides. Le relevé des appels d'outils des agents rend 0 accès aux fichiers interdits, et la cible reste intacte (`git status` vide). `oracle-ecriture` et `check_markdown.py` à PASS sur le rapport.
- **Registre.** `TF-2054` reçoit le résultat, et `TF-2057` propose d'essayer une revue par agent unique sur un vrai dépôt, avec les classes d'attaque en référentiel, par `journaliser.mjs`.

Relecture d'intention : sert, consignée sous RI-20261102-10, avec 1 écart mineur : `TF-2057` dépasse l'essai demandé, et reste au statut candidat.

## 5. Non traité

- **Le second passage de l'outil** — motif : borne_atteinte, le premier a coûté 2 185 298 jetons et il restait trop peu sous le plafond de 3 150 000.
- **L'effet de la vérification adverse** — motif : borne_atteinte, la cible ne contient pas assez de faux candidats pour la juger.
- **La conservation de la cible et de sa liste** — motif : hors_perimetre, elles restent au dossier temporaire de la session : du code volontairement vulnérable n'a pas sa place dans un dépôt public. `TF-2057` le note.

## 6. Écarts à la lettre

Le protocole de l'étude est tenu, sauf sur ces points.

- Le protocole prévoit 2 passages → 1 seul joué → le coût du premier a dépassé la marge.
- Liste scellée dans le premier commit de la cible → dépôt séparé → sinon les agents joueurs auraient pu la lire.
- Rapport de la requête unique de longueur calée à 20 % près → non écrit, et longueur non contrôlée → un garde-fou de l'environnement a refusé le fichier.
- Consignes de l'outil copiées dans chaque invite → lues par renvoi, plan délégué à un agent et résultats assemblés par script → pour ne pas orienter la chasse et limiter les jetons.

## 7. Risques

- **Conclusion prise pour générale.** Une cible de 1 052 lignes écrite par un modèle n'est pas un vrai dépôt : la requête unique peut y réussir plus qu'ailleurs. Signal : l'essai de `TF-2057` sur un vrai dépôt. Parade : le rapport le dit dès son ouverture.
- **Trop-plein de jetons.** Chaque agent a coûté 65 000 à 118 000 jetons, contre 30 000 estimés par l'étude, surtout à cause du contexte fixe. Signal : tout essai à plusieurs agents dépassera ses plafonds. Parade : compter 70 000 jetons par agent au prochain calcul.

## 8. Prochaines actions

Aucune action ne vous revient ; la seule suite passe par la revue hebdomadaire.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Présenter à la revue hebdomadaire l'essai d'une revue par agent unique sur un vrai dépôt | `TF-2057` | auto_ia | non exécutée : la revue a lieu dans 7 jours | `todo/TODO.jsonl` | si rien n'est fait : le manque de contrôle du code reste entier |

## 9. Traces

- Rapport : `output/03-etudes/Digit-AI - Rapport - Essai borne de l audit de securite de Cloudflare - 20261102k.md`.
- Protocole : `output/03-etudes/Digit-AI - Étude - Audit de securite par agents de Cloudflare - 20261102f.md`, section 3 ter.
- Tableau : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`.
- Registre : `TF-2054`, `TF-2057` ; décisions `D-127` et `D-128` à `decisions/REGISTRE.jsonl`.
- Cible et notation : au dossier temporaire de la session, cible au commit 629e6ce, liste au commit 54a21d1.
