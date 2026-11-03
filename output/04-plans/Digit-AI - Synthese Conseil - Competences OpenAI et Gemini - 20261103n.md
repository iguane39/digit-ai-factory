---
destinataire: humain
---

# Synthèse Conseil — compétences OpenAI et Gemini dans la Factory : oui, 3 à construire, 1 décision attendue (03/11/2026)

## 0. Synthèse d'ouverture

L'étude est faite et rien n'est encore construit. La réponse à votre question est oui : 2 produits et 2 autres dépôts appellent déjà OpenAI ou Gemini sans aucun outillage de forge, et 3 d'entre eux visent un modèle déprécié ou bientôt arrêté, dont un arrêt chez un produit le 14/01/2027. J'ai corrigé la garde de dépense de la Factory, qui ne voyait pas Gemini, et inscrit 7 propositions au registre. Il vous reste une décision, sur une commande d'audit qui fait payer le client, puis à choisir quand lancer la construction.

Livré : [Étude des compétences OpenAI et Gemini](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Competences%20OpenAI%20et%20Gemini%20-%2020261103l.md)

## 1. En-tête d'identification

Run de conseil, exécution du prompt « Competences OpenAI et Gemini dans la Factory » version i, sur le pilot `digit-ai-factory` et en lecture du parc de `C:\dev`. Période : 03/11/2026 de 15:27 à 15:58, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 2 agents `redacteur` Sonnet pour les catalogues ; escalade de modèle : aucune.

Intention de la demande : savoir s'il est pertinent d'ajouter à la Factory des compétences pour les API et bibliothèques d'OpenAI et de Gemini.

Test rétro : le résultat sert cette intention. Il répond par 4 verdicts fondés sur le relevé du parc, et chaque « oui » nomme la compétence, sa forge, son véhicule et son item.

## 2. Verdict en une ligne

Oui aux 4 verdicts : 5 dépôts appellent ces API, aucun véhicule de forge ne sait aider à construire l'intégration, et 2 gardes de la Factory ne voyaient pas ces appels.

## 3. Décisions attendues

> **D-163 — La commande d'audit CTL-D14-04 de forge-audit, qui envoie un test d'injection payant au déploiement Azure OpenAI du client avec sa clé en ligne de commande, doit-elle rester exécutable en audit ?**
>
> - **De quoi s'agit-il** : un contrôle du profil d'audit Azure qui prouve que les filtres de contenu bloquent une injection de prompt, `CTL-D14-04` dans `profiles/azure/bindings.json`.
> - **Le problème** : sa commande envoie une vraie requête au modèle du client, donc payante chez lui, et passe la clé dans la ligne de commande, où elle reste dans l'historique du shell. Aucune garde de la Factory ne lit ce fichier.
> - **Pourquoi vous** : la règle « aucune API tierce payante hors Claude » ne dit pas si un audit peut faire dépenser le client ; c'est une question de doctrine et de dépense.
> - **Recommandation : (a)** — le contrôle garde sa preuve, la seule qui montre un blocage réel, et le client sait d'avance ce qu'il paie. Source consultée : `output/03-etudes/Digit-AI - Étude - Competences OpenAI et Gemini - 20261103l.md`, section 4.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder l'appel sur accord écrit du client, clé lue depuis une variable d'environnement | La commande ne part qu'après l'accord consigné au dossier d'audit, et la clé ne paraît plus dans la ligne. | simple × court | Possible, rétablir la commande |
| (b) Remplacer l'appel par une lecture de la configuration des filtres | Plus d'appel payant ; le contrôle lit les filtres sans prouver qu'ils bloquent, et le test d'injection reste au client. | simple × court | Possible, rétablir la commande |
| (c) Laisser la commande telle quelle | L'audit peut dépenser chez le client et exposer sa clé, sans garde. | aucun | Sans objet |

> **Sans réponse** : (c), la commande reste telle quelle et l'item TF-2112 attend.

## 4. Traité

- **Relevé du parc, rejoué à 15:30.** 35 dépôts et copies de travail font mention d'OpenAI ou de Gemini ; 5 appellent, 2 déclarent une dépendance. Le prompt disait 3 et 1, sur moins de dossiers : le rejeu fait foi, l'étude écrit les deux.
- **Catalogues.** OpenAI : 246 lignes depuis l'index des guides de l'API, et non 40 comme le prompt le disait, car son premier index n'est qu'un aiguillage. Gemini : 225 lignes. `controle-extraits.mjs` retrouve 246 extraits sur 246 et 225 sur 225 à leur adresse.
- **Tri.** OpenAI : 6 pertinentes, 231 à connaître, 9 hors portée. Gemini : 14, 190 et 21. Aucun champ vide sur les 7 colonnes.
- **Jeu d'essai.** Lignes 1, 123 et 246 d'OpenAI, 1, 112 et 225 de Gemini : 6 sur 6 rouvertes à 200, extrait retrouvé, niveau confirmé.
- **Dépréciations qui touchent le parc.** Produit-82 épingle `gpt-4o-mini-2024-07-18`, arrêté le 14/01/2027. forge-design et un dépôt retail visent `gemini-3.1-flash-image`, déprécié le 28/05/2026 ; 2 replis de forge-design sont arrêtés depuis le 25/06/2026.
- **Véhicules existants mesurés.** Ce qui existe détecte ou interdit, rien n'aide à construire : l'adaptateur de prompts de forge-tests reconnaît `openai` et `@google/genai`, forge-development interdit les noms de modèles en dur, forge-seo-geo nomme les robots d'OpenAI, et forge-audit porte 4 contrôles Azure OpenAI.
- **Garde de dépense corrigée.** Le motif de `oracle-depense-voie-par-defaut.mjs` reconnaît désormais Gemini et Azure OpenAI : test unitaire 14 PASS, 0 FAIL. Rejoué sur le parc, il rend FAIL sur une ligne de make-it-better que l'ancien motif accusait déjà, un faux positif inscrit.
- **Registre.** TF-2108 à TF-2114 écrits par `journaliser.mjs`, verdict PASS avant et après, `oracle-todo` exit 0.
- **Décision.** D-163 réservée par `reserver-decision.mjs`, PASS.
- **Contrôles de l'étude.** `oracle-ecriture` exit 0 ; `check_markdown.py` PASS ; `quality-oracles` 5 PASS, 2 SKIP, 0 échec ; 1 272 mots hors tableaux pour 2 500 permis ; 0 motif de clé trouvé.

Relecture d'intention : sans objet, motif : la relecture des consignes des 2 agents n'a pas été jouée avant leur lancement ; leurs catalogues ont été relus à réception, chaque extrait contrôlé par script.

## 5. Non traité

- **La construction des 3 compétences** : motif, dépendance à une décision humaine ; la construction attend votre choix du bloc 8.
- **Le changement des modèles de forge-design et du signalement à Produit-82** : motif, écarté ; un changement de modèle se prouve par un appel payant sous le GO existant, et un produit ne reçoit de geste que sur son run, critère de réouverture : TF-2109 ou TF-2111 décidés.
- **L'enregistrement de la réservation D-163** : motif, bloqué par un garde-fou ; le registre des décisions porte aussi les réservations 160 à 162 d'une autre session, non enregistrées, que je n'emporte pas.
- **La page HTML de l'étude** : motif, écarté ; la page est due pour une proposition remise à un humain, ici une étude au pilot, comme au précédent du 28/10, critère de réouverture : une demande de page.
- **La trace des forges mobilisées** : motif, hors mandat ; `mobiliser.mjs` ne s'exécute que chez un produit.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| le prompt : bibliothèques Node et Python | toutes les bibliothèques officielles listées par les 2 fournisseurs | lire au plus large ne coûtait rien et sert l'étude |
| le prompt : index `llms.txt` d'OpenAI, 40 liens | l'index des guides de l'API, 246 liens | le premier n'est qu'un aiguillage |
| le prompt : relevé sur 3 niveaux connus | relevé par `find`, 35 dépôts et copies | la commande du prompt, rejouée, fait foi |

## 7. Risques

- **Arrêt chez Produit-82.** Énoncé : `gpt-4o-mini-2024-07-18` s'arrête le 14/01/2027, dans 72 jours. Signal : des erreurs de modèle inconnu dans la passerelle. Parade : TF-2109, ou un signalement au produit à son prochain run.
- **Niveau « à connaître » large.** Énoncé : 421 lignes sur 471 y tombent, faute de couple mesuré. Signal : un produit neuf qui emploie une de ces fonctionnalités. Parade : le tri se rejoue par `tri.mjs` à chaque nouvel appelant.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Trancher D-163, la commande d'audit qui fait payer le client | TF-2112 | manuelle_utilisateur | decision, dépense et doctrine | répondre « D-163 a », « D-163 b » ou « D-163 c » | un audit Azure OpenAI peut dépenser chez le client et exposer sa clé |
| A-2 | Lancer la construction du skill de référence, du calendrier des modèles et du constat de test | TF-2108, TF-2109, TF-2110 | manuelle_utilisateur | decision, construire revient au porteur | répondre « A-2 » pour un mandat sur le modèle de celui du 16/10 | chaque produit OpenAI ou Gemini s'intègre et se teste sans aide, et l'arrêt du 14/01/2027 arrive sans alerte |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Competences OpenAI et Gemini - 20261103l.md`.
- Prompt exécuté : `output/04-plans/Digit-AI - Prompt - Competences OpenAI et Gemini dans la Factory - 20261103i.md`.
- Garde corrigée : `oracles/oracle-depense-voie-par-defaut.mjs` et son test.
- Registre : `todo/TODO.jsonl`, TF-2108 à TF-2114 ; décisions : `decisions/REGISTRE.jsonl`, D-163.
- Catalogues bruts, scripts et pages lues : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\a0b92278-318b-4727-aa5e-4ab9fb1eb010\scratchpad\etude`.
