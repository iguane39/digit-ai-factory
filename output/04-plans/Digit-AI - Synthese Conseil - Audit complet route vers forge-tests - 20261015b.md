---
destinataire: humain
---

# Synthèse Conseil — pourquoi « audit complet » part encore vers forge-tests, et comment le fermer (15/10/2026)

## 0. Synthèse d'ouverture

Un développeur qui tape « lance un audit complet du projet » obtient un audit de tests, parce que le `CLAUDE.md` de son produit le lui prescrit en toutes lettres. La correction du 22/09 a ajouté forge-audit au gabarit sans retirer le mot « audit complet » à forge-tests, n'a atteint aucun produit existant et a été close sans rejouer la demande. Je propose 5 corrections, dont un détrompeur au hook de saisie qui agit chez tous les produits relayés sans recopie. Rien n'est encore appliqué : votre feu vert est la seule décision ci-dessous.

## 1. En-tête d'identification

Analyse de cause demandée sur une capture d'une session produit, menée depuis le pilot digit-ai-factory le 15/10/2026 de 16:15 à 16:25, heure de Paris (UTC+02:00). Session Claude Opus 5.5, sans agent.

Intention de la demande : qu'une demande d'audit complet ouvre forge-audit chez n'importe quel produit, et que la correction tienne cette fois.

Test rétro : la réponse sert l'intention et pas seulement sa lettre. Elle ne s'arrête pas à la ligne du gabarit : elle mesure pourquoi la correction précédente n'a pas tenu, et chaque correction proposée ferme une de ces causes, avec la preuve qui dira qu'elle tient.

## 2. Verdict en une ligne

Cause établie : 5 défauts cumulés, dont la ligne « Audit complet (verdict) » du gabarit présente chez 16 produits, 7 d'entre eux sans aucune mention de forge-audit ; correction proposée, non appliquée, candidat TF-1735 inscrit au registre.

## 3. Décisions attendues

> **D-1 — Faut-il appliquer les 5 corrections au pilot et aux produits ?**
>
> Votre règle est posée : un audit complet ouvre forge-audit par défaut. Pour la tenir, il faut modifier `gabarits/CLAUDE-PRODUIT.md`, le détrompeur `oracles/hook-lexique.mjs`, le contrat d'héritage, et déposer un lot de travaux chez 16 produits. La doctrine change aussi sur un point : la demande d'audit de l'humain vaut mandat pour forge-audit, alors que le noyau du pilot la réserve aujourd'hui à un mandat distinct.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, classe `boucle-retour-sans-descente`. La correction du 22/09 n'a changé que le gabarit, et c'est elle qui récidive aujourd'hui.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Appliquer les 5 corrections, recette et rejeu chez un produit compris | Moyen × court : 4 fichiers du pilot, 1 lot de travaux par produit | Aucune |
| (b) Corriger le pilot seulement : gabarit, détrompeur, héritage | Faible × court | Les 2 produits sans hook de saisie gardent leur `CLAUDE.md` fautif jusqu'à leur prochain run |
| (c) Ne rien changer | Nul | Chaque « audit complet » continue de lancer forge-tests |

> **Si rien n'est décidé** : (c), le candidat TF-1735 reste ouvert au registre.

## 4. Traité

Le diagnostic repose sur la lecture du gabarit, du registre et des `CLAUDE.md` du parc ; chaque cause ci-dessous est mesurée.

- **Le gabarit prescrit forge-tests pour « audit complet ».** Dans `gabarits/CLAUDE-PRODUIT.md`, la section Commandes dit « Audit complet (verdict) : voir Routage forge ci-dessus ». La seule ligne de verdict du tableau est forge_tests, pour « valider, clore ». La session de la capture a suivi cette lettre.
- **La correction du 22/09 a borné forge-audit au lieu de l'ouvrir.** Sa ligne vise « auditer la gouvernance, mesurer la maturité POC-to-Prod », « sur mandat humain », et sa colonne Jamais interdit de « lancer un audit sans mandat ». Une session prudente lit donc forge-audit comme l'exception. La ligne cite aussi 175 contrôles, quand le README de forge-audit en compte 184.
- **forge-tests se nomme lui-même « audit ».** Son README dit « Auditer une suite de tests » et `--pans restreint l'audit` ; `references/RUN-VERSION.md` écrit « tests : audit complet ». Le mot appartient aux 2 forges.
- **Les produits n'ont rien reçu.** Le `CLAUDE.md` produit est copié à l'ouverture du run, puis il n'entre pas au contrat d'héritage. Relevé du 15/10 : 16 `CLAUDE.md` de `c:\dev` portent la ligne « Audit complet (verdict) », et 7 n'ont aucune mention de forge-audit.
- **La clôture n'a pas rejoué la demande.** TF-1206 a été clos le 22/09 sur « `oracle-gabarits-documents` reste vert », un oracle qui ne joue aucun routage.
- **Le détrompeur ne connaît pas ce mot.** `oracles/hook-lexique.mjs` traduit déjà « l99 » ou « barre » en appel, sur l'événement de saisie. Les produits l'exécutent par le relais `forge\hooks\factory.mjs`, qui lit le module du pilot. Il ne reconnaît pas « audit ».
- **Récidive inscrite.** `node todo/journaliser.mjs` a écrit TF-1735, classe `boucle-retour-sans-descente`, récidive de TF-1206 ; `oracle-todo` rend PASS avant et après.

La solution proposée ferme chaque cause par une couche distincte :

1. Doctrine : « audit complet », « audite le projet » ou « audit du produit » désignent forge-audit, et la demande vaut mandat. forge-tests garde les mots « tests », « couverture », « valider, clore ».
2. Gabarit : la ligne forge-audit devient la route de l'audit, la section Commandes la désigne, et le compte de contrôles se lit dans forge-audit au lieu d'être écrit en dur.
3. Détrompeur : une consigne « audit » dans `hook-lexique`, injectée avant toute action, avec ses cas rouge et vert. « Lance un audit complet du projet » donne forge-audit ; « relance les tests » ne donne rien ; « audite ce skill » reste au skill d'amélioration.
4. Descente : un motif exigé au contrat d'héritage, pour que le relevé d'ouverture nomme chaque produit fautif, et un lot de travaux par produit pour corriger son `CLAUDE.md`.
5. Clôture : TF-1735 se clôt sur un rejeu de la phrase de la capture chez un produit, transcript à l'appui, jamais sur un oracle de gabarit.

## 5. Non traité

- **Les 5 corrections.** Motif : decision, votre demande portait sur une proposition, et D-1 la soumet.
- **L'identité du produit de la capture.** Motif : hors_mandat, la session n'est pas dans les transcripts de ce poste ; la correction couvre les 16 produits sans la connaître.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Identifier et proposer | J'ai aussi inscrit la récidive au registre | Tout constat entre en candidat, et l'inscription n'engage aucune correction |

## 7. Risques

- **Détrompeur trop large.**
  - Énoncé : « audit » apparaît dans des demandes qui ne visent pas le produit, comme l'audit d'un prompt, d'un skill ou du SEO.
  - Signal : un cas vert de la recette du hook qui devient rouge.
  - Parade : la consigne exige un objet produit ou projet, et cède la place aux appels de skill déjà reconnus.
- **Produits sans hook de saisie.**
  - Énoncé : 2 produits, `apdlb-com-livrets` et `Produit-12`, n'ont pas de hook de saisie dans `.claude\settings.json`.
  - Signal : le relevé d'héritage de l'ouverture.
  - Parade : leur lot de travaux corrige le `CLAUDE.md`, seul canal qui les atteint.

## 8. Prochaines actions

Votre décision vient d'abord, parce que les 3 actions de correction en dépendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1735 | Réécrire la ligne de routage et la section Commandes du gabarit, puis ajouter la consigne « audit » au détrompeur avec ses cas rouge et vert | auto_ia | dependance_bloc_3 : attend D-1 | `node oracles/hook-lexique.test.mjs` | Chaque nouveau produit reçoit la route fautive |
| **A-2** | TF-1735 | Ajouter le motif exigé au contrat d'héritage et déposer un lot de travaux chez les 16 produits | auto_ia | dependance_bloc_3 : attend D-1 | `node scripts/relever-heritage.mjs` | Les produits existants gardent leur ligne fautive |
| **A-3** | TF-1735 | Rejouer la phrase de la capture chez un produit et clore sur ce transcript | auto_ia | dependance_bloc_3 : attend D-1 | `claude -p "lance un audit complet du projet"` depuis la racine du produit | La clôture redevient déclarative, comme le 22/09 |
| **A-4** | `neuve` | Trancher D-1 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option par défaut s'applique |

## 9. Traces

- `todo/TODO.jsonl` : création de TF-1735
- `gabarits/CLAUDE-PRODUIT.md` : section Commandes et tableau de routage, lus
- `oracles/hook-lexique.mjs` : lexique et consignes, lus
