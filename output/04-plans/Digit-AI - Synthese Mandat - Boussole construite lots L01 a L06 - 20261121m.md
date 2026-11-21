---
destinataire: humain
---

# Synthèse Mandat — boussole de l'utilisateur construite, les 6 lots, 21/11/2026

## 0. Synthèse d'ouverture

Les 6 lots sont construits et leurs recettes passent. À chaque ouverture de session, au pilot comme chez un produit, la Factory calcule désormais le niveau de l'utilisateur sur tous ses projets du poste, sa note sur 100 et l'état du projet ouvert, et demande à la session de les afficher en tête de sa première réponse. L'utilisateur peut annoncer son niveau, répondre à une question unique sur un poste vierge, récupérer sa progression d'un autre poste par son dossier Drive, et avoir ses propres préférences. La première réponse de chaque session reçoit la consigne d'être vérifiée avant d'être affichée. Rien n'est encore enregistré ni publié : 2 gestes vous reviennent, installer le nouveau skill sur ce poste et autoriser l'enregistrement puis la publication.

## 1. En-tête d'identification

Construction des 6 lots de la démarche « Lots du parcours d'accueil » (version « i »), sur votre consigne « Go L01 à L06 », que je lis aussi comme votre réponse à la question des préférences par utilisateur. Sur le pilot `digit-ai-factory` (commit 626b12e2) et la forge `digit-ai-forge-agents` (commit 5db28fe). Le 21/11/2026, de 12:22 à 12:55, heure de Paris (UTC+01:00), heures relevées par `date`. Session pilote Claude Opus 5.5, aucun sous-agent.

Intention : qu'un nouvel utilisateur sache à chaque ouverture où il en est et quoi faire, sans repartir de zéro d'un projet ou d'un poste à l'autre.

Test rétro : un essai de bout en bout depuis un produit réel rend le niveau, la note, 26 jalons datés avec leur preuve, le prochain jalon et 3 services utiles.

## 2. Verdict en une ligne

6 lots construits ; recettes : boussole 27 sur 27, lexique 97 et 30 sur 30, écrivain du journal de run 86 sur 86, ouverture 103 sur 104, l'échec restant étant antérieur et hors lot.

## 3. Décisions attendues

Aucune décision nouvelle : les 2 gestes qui vous reviennent sont des actions du bloc 8 (A-1 et A-2).

- D-221 : rouvrir l'exclusion « Pas de vidéo » du run d'animation de réseau pour les clips jugés, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.
- D-228 : suivre la veille des notes de version des éditeurs dans le plan de mise à jour des compétences, posée le 21/11 à 11:23 par une autre session, inchangée.

## 4. Traité

- **L-01 (boussole sur tous les projets)** : `scripts/boussole.mjs` lit les journaux de run des projets instrumentés du poste, dédoublonnés par leur début, en tire 30 jalons datés, le niveau (5) et la note ; le relevé d'ouverture (`oracles/hook-ouverture.mjs`) porte la section « Boussole de l'utilisateur » juste après les gates. Mesuré : 10 projets distincts lus en 0,13 s sur ce poste.
- **L-02 (niveau annoncé et contenus)** : `--annoncer`, `--debutant`, question unique du poste vierge, messages par niveau ; une décision ouverte tranchée sans sa lettre fait redescendre un niveau annoncé (`oracles/hook-lexique.mjs`) ; skill `ou-en-suis-je` écrit dans forge-agents et déclaré au manifeste des versions livrées ; formule « où en suis-je ? » ajoutée au lexique.
- **L-03 (traces normalisées du journal de run)** : `gabarits/ledger.py` refuse un `--type_run` ou un `--etape_norme` hors liste et avertit de leur absence ; les journaux passés se lisent normalisés (« Développement / socle » compte pour development). Le gabarit se recopie chez les produits par le contrat d'héritage (`gabarits/HERITAGE.json`, copie conforme).
- **L-04 (progression synchronisée entre postes)** : `~/.digit-ai/progression.json`, sans nom de projet ni chemin ; `--declarer-canal` et `--recuperer` ; union des jalons à chaque calcul, aucun ne se perd.
- **L-05 (consigne du premier tour)** : au premier message humain d'une session, le lexique injecte la consigne de préjuger la réponse avant de l'afficher, avec la commande du lieu (pilot ou produit).
- **L-06 (préférences propres à chaque utilisateur)** : `~/.digit-ai/PREFERENCES-UTILISATEUR.md`, quand il existe, remplace les préférences du porteur dans le relevé ; sans lui, rien ne change.
- Recettes jouées, rouges comprises : `scripts/boussole.test.mjs` 27 PASS ; `oracles/hook-lexique.mjs --self-test` 97 PASS et `oracles/hook-lexique.test.mjs` 30 PASS (2 attentes alignées : compte du self-test, transcription absente ou illisible qui n'injecte rien) ; `gabarits/ledger.test.mjs` 86 PASS dont 5 de L-03 ; `oracles/hook-ouverture.test.mjs` 103 PASS sur 104.
- Défaut trouvé en cours de route et corrigé : la recette d'ouverture écrivait la progression dans le vrai dossier de l'utilisateur à partir de projets factices (classe : recette qui écrit hors de son dossier jetable) ; elle écrit désormais dans un dossier jetable, et le fichier pollué, créé par mon code quelques minutes plus tôt, a été supprimé.
- Référence `references/BOUSSOLE.md` écrite et inscrite à `references/INDEX.md` ; `check_markdown.py` PASS.
- Registre : TF-2752 à TF-2757, un par lot, créés, décidés sur votre consigne et passés « en cours », en attente de leur échéance de mesure ; `todo/oracle-todo.mjs` PASS après 2 corrections de forme (vocabulaire d'attente, date d'échéance).
- Relecture d'intention : sans objet, aucun agent lancé ; le test rétro du bloc 1 est celui de la session sur son propre travail.

## 5. Non traité

- Enregistrement et publication des changements : non faits, motif : votre règle exige une autorisation explicite pour chaque enregistrement et chaque publication (action A-2).
- Installation du skill `ou-en-suis-je` dans les skills de ce poste : non faite, motif : la mise à jour des skills installés exige votre accord explicite (action A-1). D'ici là, la formule « où en suis-je ? » appelle un skill absent du poste.
- Entrée du skill au catalogue des services : non faite, motif : hors des 6 lots de la démarche.
- Écrivain du journal de run de forge-agents (`ledger.mjs`) : non mis à jour pour `type_run`, motif : L-03 visait le gabarit Python que copient les produits.
- Lots de retours en attente à la boîte d'entrée : non traités, motif : hors de votre demande (action A-3).

## 6. Écarts à la lettre

- La démarche disait la progression « écrite en fin de tour » → elle s'écrit et se synchronise à chaque calcul, donc à chaque ouverture et à chaque geste de l'utilisateur → parce que le même calcul sert les deux sens, sans hook de plus.
- Le critère de L-05 visait « une recette du hook de fin de tour » → la consigne est injectée au premier message par le hook du lexique, et sa recette est celle du lexique → parce que le hook de fin de tour juge après l'affichage, trop tard pour éviter la réécriture.

## 7. Risques

- Recette d'ouverture : le cas « TF-2214 (pilot) » échoue depuis aujourd'hui, parce qu'il date une décision « il y a 5 jours » et suppose qu'elle précède le 16/11 ; signal : 1 FAIL sur 104 ; parade : dater le cas par rapport au 16/11, à faire dans un tour dédié.
- L'oracle du noyau signale un orphelin, `references/SESSIONS-MULTIPLES.md`, posé par une autre session ; signal : N3 FAIL ; parade : à cette session de l'inscrire à l'index.

## 8. Prochaines actions

Ordre : d'abord ce qui rend la boussole complète sur ce poste, parce que la formule « où en suis-je ? » en dépend.

| Sélecteur | Action | Identifiant | Acteur | Motif | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Installer le skill « où en suis-je ? » sur ce poste : dites « propage » | TF-2753 | manuelle_utilisateur | decision : la mise à jour des skills installés exige votre accord explicite | `node oracles/oracle-skills.mjs --appliquer` | si rien n'est fait, la formule « où en suis-je ? » appelle un skill absent du poste |
| A-2 | Enregistrer puis publier les changements du pilot et de forge-agents : dites « enregistre et publie » | TF-2752 à TF-2757 | manuelle_utilisateur | decision : votre règle exige une autorisation explicite pour chaque enregistrement et chaque publication | `git commit --only <fichiers du lot>`, puis `node scripts/synchroniser.mjs` | si rien n'est fait, les autres postes et les produits ne reçoivent pas la boussole |
| A-3 | Accueillir et ingérer les lots de retours en attente | neuve | auto_ia | hors_mandat : la demande portait sur les 6 lots, l'ingestion attend votre accord | `node todo/accueillir-lot.mjs`, puis `node todo/ingerer-lot.mjs <fiche>` | si rien n'est fait, des retours de produits restent sans suite |
| A-4 | Relever les sessions de produit qui affichent la boussole | TF-2752 | auto_ia | programmée, départ : l'échéance du 2026-12-18 | `.claude/hooks-journal.jsonl` et relevés d'ouverture | si rien n'est fait, le premier critère « utilisé » n'est pas constaté |

## 9. Traces

- Code : `scripts/boussole.mjs`, `scripts/boussole.test.mjs`, `oracles/hook-ouverture.mjs`, `oracles/hook-ouverture.test.mjs`, `oracles/hook-lexique.mjs`, `oracles/hook-lexique.test.mjs`, `gabarits/ledger.py`, `gabarits/ledger.test.mjs`.
- Skill : `../digit-ai-forge-agents/.claude/skills/ou-en-suis-je/SKILL.md` et `../digit-ai-forge-agents/versions-livrees.json`.
- Référence : `references/BOUSSOLE.md`, `references/INDEX.md`.
- Registre : `todo/TODO.jsonl`, TF-2752 à TF-2757.
- Démarche construite : `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121i.md`.
- Rien n'est enregistré dans git ni poussé.
