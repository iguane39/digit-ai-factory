---
destinataire: humain
---

# Synthèse Conseil — skill PDF de la Factory, étude rendue, 1 décision attendue (30/10/2026)

## 0. Synthèse d'ouverture

L'étude est faite, et elle recommande un skill maison mince plutôt qu'un complément au skill d'Anthropic, que sa licence interdit de modifier. Pour vous, le besoin est plus étroit que je ne l'avais dit : 14 demandes en 49 jours, 2 formulaires à compléter, aucune demande de reconnaissance de caractères (OCR). Le vrai risque est ailleurs, car le contrat et le mandat de prélèvement remplis ce matin sont sortis sans contrôle exécuté sur le fichier. Vous avez à choisir le périmètre à construire, ci-dessous ; je recommande de commencer par ce contrôle.

Livré : [Étude — skill PDF de la Factory](output/03-etudes/Digit-AI%20-%20Étude%20-%20Skill%20PDF%20de%20la%20Factory%20-%2020261030a.md)

## 1. En-tête d'identification

Run de conseil, étude d'opportunité sur le traitement des PDF, sur le pilot `digit-ai-factory`, en lecture seule du parc. Période : 30/10/2026 de 10:51 à 11:04, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, 1 agent `explorateur` pour le relevé du code, 1 agent `verificateur` pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : savoir s'il vaut la peine de doter la Factory d'un outil PDF qui traite, identifie les types, lit avec ou sans OCR et gère les formulaires à compléter.

Test rétro : le résultat sert cette intention, et il la borne sur un point. Le type métier des documents est reporté faute de demande mesurée, et l'écart est écrit au bloc 6.

## 2. Verdict en une ligne

L'étude retient un skill mince et son oracle, 1 option sur 5, sur 10 mesures sourcées ; `oracle-etude-opportunite` PASS, `oracle-ecriture` PASS.

## 3. Décisions attendues

> **D-112 — Faut-il construire le skill PDF maison digit-ai-pdf, en commençant par l'oracle des formulaires, ou se limiter à cet oracle ? (TF-2031)**
>
> - **De quoi s'agit-il** : un outil de la Factory qui trie les PDF, les lit avec ou sans OCR et vérifie un formulaire rempli, sous le nom `digit-ai-pdf`, rangé dans `digit-ai-forge-agents`.
> - **Le problème** : les 14 demandes PDF des 49 derniers jours ont toutes été servies sans lui, mais un contrat à signer est sorti ce matin sans contrôle exécuté. Construire le tout couvre les 4 capacités que vous citiez ; cela ajoute 1 skill à maintenir pour 0 demande d'OCR mesurée.
> - **Pourquoi vous** : vous seul savez si des scans et des formulaires vont arriver plus souvent que ces 49 jours ne le montrent, et la réponse engage une maintenance durable.
> - **Recommandation : (a)** — elle tient les 4 capacités demandées, et son premier lot ferme le risque mesuré avant toute autre construction. Source consultée : `output/03-etudes/Digit-AI - Étude - Skill PDF de la Factory - 20261030a.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Skill complet, en 2 lots | Lot 1 : l'oracle du formulaire rempli et la voie de remplissage. Lot 2 : le tri des PDF et l'OCR, avec un banc sur des scans français. Le type métier et la modification de texte attendent 3 demandes. | moyen × court | Possible, retirer le skill du dépôt et de son installation |
| (b) Oracle seul | Un formulaire rempli est contrôlé avant remise. Rien ne trie les PDF et l'OCR reste une affaire de session. | simple × court | Possible, retirer l'oracle du registre |
| (c) Rien | Le skill d'Anthropic et les scripts de session continuent. Un document à signer sort encore sans contrôle exécuté. | aucun coût de construction | Sans objet |

> **Sans réponse** : (c), rien ne se construit et la proposition reste au registre pour la revue hebdomadaire.

## 4. Traité

Les 2 relevés de fond viennent du poste Dell-XPS-16, racine `C:\dev`, en lecture seule.

- **Demande.** 16 messages humains sur 1 159 citent un PDF, dont 2 de cette session. Les 14 autres : 5 pour lire, 5 pour produire, 2 pour compléter, 2 pour modifier. Le skill `pdf` a été appelé 1 fois.
- **Corpus.** 1 044 PDF, 855 distincts dans 21 dépôts : 740 natifs, 45 scans, 39 hybrides, 31 autres. 5 seulement portent de vrais champs de saisie.
- **Chaînes des produits.** Sur 9 dépôts repérés, 7 portent du vrai code PDF. 4 appellent un OCR, tous en local, avec 3 piles différentes, et aucune ligne de code métier n'est partagée.
- **Banc jetable, sur PDF synthétiques.** L'OCR de Windows en français rend de 99,2 à 99,5 % de fidélité sur image propre, et 92,5 % au pire, à 100 ppp sur image dégradée. `pypdf` remplit et relit 2 champs sur 2.
- **Licences.** `pymupdf` est en AGPL, `pypdf`, `reportlab`, `pypdfium2` et `pdfplumber` sont permissives. `pdfplumber` a été installé pendant ma mesure par une autre session.
- **Rectifications de mes 2 réponses précédentes.**
  - « 9 dépôts portent du code PDF » : 7, les 2 autres n'ont que des mentions.
  - « chaque produit semble refaire sa chaîne » : les chaînes diffèrent et ne se copient pas, il n'y a donc pas de dette commune à résorber.
  - « l'OCR n'est pas jouable au poste » : faux, celui de Windows fonctionne ; seul le chemin du skill `pdf` manque de ses dépendances.
  - « TF-1027 attend aussi le rendu PDF » : faux, cet item est clos depuis le 14/09 sur le seul DOCX ; c'est la référence d'appel d'offres qui promet encore un PDF.
- **Registre.** TF-2031 et TF-2032 écrits par `journaliser.mjs`, tous 2 au statut candidat, et D-112 réservée par `reserver-decision.mjs`.
- **Publication du pilot** sous le GO permanent `D-54 (b) du 03/10` : `git push` exit 0, f76959e6..59a03800 pour l'étude et le registre, puis `git rev-list --left-right --count` rend 0 0 à 11:04. Cette synthèse part ensuite par le même geste.

Relecture d'intention : sert, 2 écarts mineurs consignés (l'objet recadré vers un skill maison, déjà dit au bloc 6, et le constat TF-2032 ajouté en passant).

## 5. Non traité

- **Construction du skill** : motif `decision`, elle attend votre choix au bloc 3.
- **Banc sur de vrais scans français** : motif `decision`, il appartient au lot 2 de l'option recommandée.
- **Lecture d'image par Claude en aveugle** : motif `hors_perimetre`, je connaissais le texte de mon banc, ma lecture n'aurait rien prouvé.
- **Autre poste du parc** : motif `hors_perimetre`, ses transcriptions et ses fichiers ne se lisent pas d'ici.
- **Trace des forges mobilisées** : motif `hors_perimetre`, l'outil ne s'exécute que chez un produit.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| compléter le skill `pdf` | une étude d'un skill maison, à côté de lui | sa licence interdit copie et œuvre dérivée ; vous avez lancé l'étude après l'avoir lu |
| identifier les types de documents | le type technique au lot 2, le type métier reporté au lot 3 | 0 demande de classement sur 14, et seulement 2 chaînes sur 7, chacune sur ses propres règles |
| un run de conseil complet | 1 étude en Markdown, sans page HTML ni diagnostic et démarche de retour sur investissement séparés | le gabarit d'étude porte mesures et lots, comme le précédent du 28/10 |

## 7. Risques

- **Formulaire invisible.** Énoncé : un formulaire plat n'a aucun champ, et 2 des 3 PDF réellement demandés l'étaient. Signal : le tri rend « natif » sur un formulaire. Parade : l'oracle du lot 1 juge les 2 cas et compare au rendu.
- **Mesure courte.** Énoncé : 49 jours sur 1 seul poste sous-estiment peut-être la demande. Signal : plus de 3 demandes de formulaire d'ici la revue du 15/12/2026. Parade : la revue rejoue la mesure.
- **Banc trop propre.** Énoncé : la fidélité de 99 % vient d'une police nette sur 1 colonne, et un vrai scan fera moins bien. Signal : les pages illisibles relevées au lot 2. Parade : choisir le moteur sur des scans français réels, jamais sur ce chiffre.

## 8. Prochaines actions

Une seule action, parce que la construction en dépend.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Choisir le périmètre à construire : le skill complet, l'oracle seul, ou rien | TF-2031 | manuelle_utilisateur | decision, le périmètre revient au porteur | répondre dans cette conversation « D-112 a », « D-112 b » ou « D-112 c » ; le détail est dans `output/03-etudes/` | si rien n'est fait, un document à signer continue de sortir sans contrôle exécuté |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Skill PDF de la Factory - 20261030a.md`.
- Registre : `todo/TODO.jsonl`, TF-2031 et TF-2032 ; `decisions/REGISTRE.jsonl`, D-112.
- Relevé du code des 9 dépôts et banc : résultats repris dans l'étude ; scripts et sorties détaillées, noms compris, laissés au dossier temporaire de la session, jamais publiés.
