---
destinataire: humain
---

# Synthèse Mandat — D-45 (b) exécutée, le 19/10/2026 au soir

## 0. Synthèse d'ouverture

Votre choix est appliqué : les quatre défauts repris ce soir n'ont plus la famille que je leur avais donnée, et le produit est invité à la choisir lui-même parmi les familles existantes. Le retour non repris reste à compléter par le produit, et la publication de ce soir reste en place. Pour que la demande atteigne le produit, il a fallu lui déposer un second lot de travaux, qui reprend aussi les onze éléments déjà confiés : je l'ai signalé comme défaut de l'outil. Le pilot est publié sur GitHub et aligné ; seule cette synthèse, écrite après l'envoi, reste en local pour le prochain.

## 1. En-tête d'identification

Exécution de l'option (b) de D-45 sur le pilot `digit-ai-factory`, branche main, poste DESKTOP-ULTRA7. Période : 19/10/2026 de 22:14 à 22:35, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; un agent `verificateur` pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : que le choix des familles de ces quatre défauts revienne au produit qui les a remontés, sans rien défaire d'autre.

Test rétro : le résultat sert cette intention ; les familles sont retirées au registre et la demande est déposée chez le produit.

## 2. Verdict en une ligne

4 familles retirées (TF-1912, TF-1915, TF-1916, TF-1917), 1 demande au produit (TF-1919) déposée dans le lot de travaux 20261019b, 1 candidat neuf (TF-1920), 2 commits publiés (0 en avance, 0 en retard).

## 3. Décisions attendues

Aucune décision nouvelle : votre réponse à D-45 est exécutée.

## 4. Traité

- **Familles retirées.** `journaliser.mjs` écrit 4 événements : `classe_a_creer.famille` passe à vide sur TF-1912, TF-1915, TF-1916 et TF-1917, avec la famille proposée par le produit et le rattachement retiré notés dans `famille_a_choisir` ; oracle-todo PASS avant et après.
- **Demande au produit.**
  - Ma première voie, compléter la demande de TF-1918, n'est pas partie : `emettre-travaux.mjs --produit` rend « [INCLUS DANS UN LOT NON TRAITÉ] … les 11 élément(s) de ce lot sont déjà tous dans 20261019a », et ne dépose rien. TF-1918 a été ramené à son texte d'origine.
  - Voie retenue : TF-1919, créé et décidé, porte la demande de choisir une famille parmi les 18 du référentiel pour RT-128, RT-132, RT-133 et RT-134. Essai sur une copie du registre, puis écriture réelle : oracle-todo PASS.
  - `emettre-travaux.mjs` rend « [DÉPOSÉ] … pilot - TRAVAUX - 20261019b.md (12 élément(s), sceau 6798ea4737fd) », sans commit chez le produit.
- **TF-1920 candidat** : le canal de travaux ne livre pas une demande modifiée sur un élément déjà présent dans un lot encore à traiter ; classe à créer `demande-modifiee-retenue-par-lot-non-traite`, famille `contrat-interface-forge`.
- **Publication.** `FORGE_PUSH_GO="D-54 (b) du 03/10" git push origin main`, porte avant envoi jouée, rend `5694b180..df0b1a7a  main -> main` à 22:31 ; `git rev-list --left-right --count main...origin/main` rend `0 0`.
- Relecture d'intention : sert, RI-20261019-16, 3 écarts mineurs déjà déclarés : le second lot de travaux, la publication de ce tour sous le GO permanent, le candidat TF-1920.

## 5. Non traité

- La création des 4 classes au référentiel — motif : dependance_externe, elle attend les familles que Produit-02 choisira (TF-1919).
- La construction des 7 sujets décidés de D-41 — motif : hors_mandat, la demande portait sur D-45.

## 6. Écarts à la lettre

Deux points diffèrent de l'option telle qu'écrite.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-45 (b) : ajouter la demande au lot de travaux du produit | Déposé un second lot (20261019b), qui reprend les 11 éléments du premier et ajoute TF-1919 | L'outil refuse de compléter un lot que le produit n'a pas encore traité ; retoucher à la main un fichier déposé chez lui n'était pas couvert par l'option |
| D-45 (b) : le reste est gardé, publication comprise | Publié aussi les enregistrements de ce tour, sous le GO permanent du pilot (D-54 (b) du 03/10) | Ce GO couvre toute publication du pilot ; ma question D-44 de ce soir n'avait donc pas lieu d'être |

## 7. Risques

- Le produit reçoit deux lots de travaux qui se recouvrent.
  - Énoncé : 20261019a et 20261019b portent les mêmes 11 éléments ; seul TF-1919 est neuf dans le second.
  - Signal : le produit traite deux fois le même élément, ou se demande lequel suivre.
  - Parade : TF-1920 corrige l'outil ; d'ici là, cette synthèse consigne que TF-1919 est le seul élément neuf du second lot.

## 8. Prochaines actions

Ordre : la réparation de l'outil vient d'abord, parce qu'elle évite le doublon au prochain cas ; la construction des sujets décidés ensuite.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1920 | Faire livrer par l'émetteur une demande modifiée sous l'indice suivant, comme une correction de rédaction | auto_ia | gate_gouvernance : TF-1920 est candidat, sa décision est humaine | `node todo/emettre-travaux.mjs --produit <dossier> --essai` | Chaque demande complétée doublonne un lot entier chez le produit |
| **A-2** | TF-1897 | Construire les 7 sujets décidés de D-41, en commençant par TF-1895, TF-1897, TF-1898 et TF-1899 | auto_ia | hors_mandat : la demande portait sur D-45 | `node todo/stock-sans-classe.mjs` | Les décisions restent sans effet |
| **A-3** | TF-1920 | Trancher les 19 candidats ouverts, dont TF-1920 | manuelle_utilisateur | decision : tout candidat attend une décision humaine | `node todo/revue-hebdo.mjs` | Les retours restent sans suite |

## 9. Traces

- `todo/TODO.jsonl` : TF-1912, TF-1915 à TF-1918 mis à jour ; TF-1919 et TF-1920 créés
- Lot de travaux : `pilot - TRAVAUX - 20261019b.md` dans la boîte `input\00-travaux\` de Produit-02, sceau 6798ea4737fd
- Synthèse expliquant D-45 : `output/04-plans/Digit-AI - Synthese Mandat - D-45 expliquee - 20261019g.md`
