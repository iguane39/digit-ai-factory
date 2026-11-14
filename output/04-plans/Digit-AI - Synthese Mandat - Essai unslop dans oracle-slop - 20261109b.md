---
destinataire: humain
---

# Synthèse Mandat — essai unslop dans oracle-slop (09/11/2026)

## 0. Synthèse d'ouverture

L'essai réussit : 2 des 5 marqueurs manquants entrent dans l'oracle qui repère les interfaces « qui font IA ». Le premier signale un halo coloré autour d'un élément, le second une tache de couleur floutée derrière le contenu. Les deux avertissent sans jamais faire échouer une page. Sur près de 2 800 pages de vos dépôts, ils lèvent 13 alertes, toutes justes, et aucune fausse. Les 3 autres marqueurs sont écartés, chacun pour une raison mesurée. L'un d'eux touche votre charte, les libellés en capitales espacées : je vous pose la question de les garder.

## 1. En-tête d'identification

Mandat sur `digit-ai-forge-design`, essai choisi par le porteur après le tri des favoris TikTok. Période : 09/11/2026 de 15:12 à 15:49, heure de Paris, relevée par `date`, durée 37 minutes. Session pilote Claude Opus 5.5 ; forge-design au commit `6886e61`.

Intention de la demande : savoir si les signes d'unslop renforcent notre détection du design générique, et les intégrer s'ils tiennent sans fausse alerte.

Test rétro : chaque signe a son sort mesuré, entré ou écarté avec sa raison, et ce qui entre est verrouillé par des fixtures et publié.

## 2. Verdict en une ligne

Essai réussi à 2 sur 5 : S11 (ombre colorée en halo) et S12 (tache de couleur floutée) entrent en avertissement, self-test de forge-design à 857 contrôles réussis, 0 échec ; parc mesuré à 13 constats, tous vrais.

## 3. Décisions attendues

Répondez par exemple « 185a ».

> **D-185 — Faut-il garder le sur-titre en capitales espacées que prescrit le socle des pages Digit-AI, alors qu'unslop le compte parmi les signes d'une interface générée ?**
>
> - **De quoi s'agit-il** : le petit libellé en capitales, aux lettres espacées, posé au-dessus d'un titre ou d'un indicateur. Le socle des pages Digit-AI le prescrit, et 925 pages de 42 projets en portent.
> - **Le problème** : unslop le range parmi les signes d'une interface générée et propose une casse de phrase. Je ne l'ai pas mis dans l'oracle, pour ne pas accuser la charte elle-même. La relecture d'intention relève, à juste titre, que ce choix touche votre charte sans vous l'avoir demandé : la question de fond reste ouverte.
> - **Pourquoi vous** : c'est la doctrine de votre identité visuelle, appliquée à tous vos produits.
> - **Recommandation : (a)** — une seule source le condamne, sans mesure de son effet sur vos lecteurs, et le changer toucherait 42 projets. Source consultée : `assets/boilerplate.html` du skill `digit-ai-page-html`, et `skills/unslop/references/signs.md` d'unslop.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder le sur-titre | La charte reste telle quelle ; l'oracle ne juge pas ce signe | Nul | Possible : choisir (b) plus tard |
| (b) Le faire instruire | Une étude de forge-design compare le sur-titre en capitales et en casse de phrase sur 3 pages témoins, avant tout changement du socle | Moyen × court | Possible : l'étude conclut, rien ne change d'office |

> **Sans réponse** : (a), rien ne change.

Rappels :

- **D-182** : téléchargement du favori TikTok illisible, posée le 09/11 à 14:39, inchangée.
- **D-184** : relecture des 42 favoris déjà triés, posée le 09/11 à 14:52, inchangée.

## 4. Traité

Mesuré sur : `skills/unslop/references/signs.md` d'unslop au commit `97daa3e` et 2 799 pages uniques de `C:\dev`, relus entre 15:12 et 15:40, périmètre 9 signes et 2 799 pages.

- **Les 9 signes.** 4 étaient déjà couverts par `oracle-slop` (dégradé violet S5, texte en dégradé S2, emojis et badges « New ✨ » S6). Sur les 5 restants, 2 entrent et 3 sont écartés.
- **S11, halo coloré.** Une ombre sans décalage, au flou de 12px au moins, d'une couleur saturée ; en CSS, en `drop-shadow` et en classe Tailwind. L'ombre portée, l'ombre grise, l'anneau de focus et l'ombre intérieure restent hors règle. 0 constat dans le parc : la règle est préventive.
- **S12, forme floue.** Un `filter: blur()` de 20px au moins, ou les classes `blur-xl` à `blur-3xl`. Le flou de surcouche et le flou léger restent hors règle. 13 constats, relus : 1 fond de section dans une page tierce reçue en entrée, et 12 pages compilées d'un même produit, où 2 cercles colorés sont floutés.
- **Capitales espacées, écartées de l'oracle.** 925 pages de 42 projets accusées. Le socle des pages Digit-AI prescrit lui-même un sur-titre en capitales espacées : la règle contredirait la charte qu'elle juge. Garder ou non ce sur-titre est posé en D-185.
- **Pulsation, écartée.** 266 pages accusées, et les 7 motifs sont légitimes : squelettes et indicateurs de chargement, voyant « en direct », curseur. Qu'un élément soit vivant ne se lit pas dans un fichier.
- **Valeurs arbitraires, déjà couvertes.** La règle T3 (espacements sur l'échelle de 4px) d'`oracle-tokens` exige déjà des espacements multiples de 4px.
- **Correction de mon tri.** J'y comptais 5 marqueurs absents ; ils sont absents d'`oracle-slop`, mais l'un est déjà jugé par `oracle-tokens`.
- **Preuves.** 2 paires de fixtures, rouge et verte ; bloc de test dédié à 6 sur 6 ; verrou de la liste des règles à vert ; self-test complet de forge-design, sortie 0, « Tout vert — 72 oracles, 170 règles verrouillées ».
- **Attribution.** CC BY 4.0 : nom de l'auteur, adresse du dépôt, licence et nature de l'adaptation, dans `oracles/regles-importees-unslop.md` et en tête d'`oracle-slop.mjs`.
- **Publication.** forge-design de `1f43109` à `6886e61`, `git rev-list` rend 0. L'envoi a aussi publié `ae96d64`, enregistré par une autre session à 15:12, sous le même mandat permanent des forges.

Relecture d'intention : dérive, consignée sous RI-20261109-04. L'écart fondé touche la charte, posé en D-185. Les 3 autres ne tiennent pas : l'attribution est exigée par la licence CC BY 4.0, la page qui la porte suit le précédent de taste-skill, et les questions sur les essais et sur `dsh-superagent` ont reçu leur réponse aux tours précédents.

## 5. Non traité

- **Le lavis radial de couleur derrière le contenu** — motif : hors_perimetre, un `radial-gradient` décoratif ne se distingue pas d'un fond légitime sans rendu ; déclaré dans `non_juge`.
- **Les halos dont la couleur passe par une variable CSS** — motif : hors_perimetre, seules les couleurs littérales sont lues ; déclaré dans `non_juge`.
- **Les classes Tailwind à valeur entre crochets** — motif : hors_perimetre, hors de T3 et non mesurées.

## 7. Risques

- **Règle S11 sans constat réel.** Elle n'a jamais mordu hors de sa fixture. Signal : une page à halo qui passe sans alerte. Parade : sa rouge couvre les 4 formes d'écriture vues dans unslop.

## 8. Prochaines actions

Rien n'est à faire pour cet essai ; l'action ouverte du tri reste la vôtre.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Autoriser la publication du pilot, qui porte le tri des favoris et ses synthèses | neuve | manuelle_utilisateur | decision : la porte de publication R-38 exige votre accord explicite | répondre « GO publication du pilot » ; la session joue alors `FORGE_PUSH_GO="<vos mots>" git push origin main` | si rien n'est fait : le tri et ces synthèses restent sur ce poste seulement |

## 9. Traces

- Attribution et mesure : `C:\dev\digit-ai-forge-design\oracles\regles-importees-unslop.md`.
- Oracle : `C:\dev\digit-ai-forge-design\oracles\oracle-slop.mjs`, règles S11 et S12.
- Fixtures de test, pas des pages livrées : les 2 paires rouge et verte `slop-s11-*` et `slop-s12-*` d'`oracles/fixtures/`.
- Registre : `oracles/registre-entrees.md`, entrée du 09/11/2026.
- Commit : `6886e61` de `digit-ai-forge-design`, publié.
- Source : `https://github.com/heydamir/unslop`, commit `97daa3e`, lu le 09/11/2026.
