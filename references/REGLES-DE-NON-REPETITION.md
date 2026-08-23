---
role: les règles génériques nées des défauts RÉELLEMENT rencontrés — chacune avec le mécanisme qui l'exécute, pour qu'elle ne dépende pas de la discipline
sources_de_verite: [todo/TODO.jsonl (les faits datés), oracles/self-tests.mjs (les mécanismes joués à chaque recette)]
verifie_le: 2026-08-23
---

# Règles de non-répétition

## À quoi sert ce document, et à quoi il ne sert pas

Chaque règle ci-dessous est née d'un **défaut réellement payé**, jamais d'une bonne intention. Et
chacune est suivie de son **mécanisme** : le contrôle qui l'exécute, avec son verdict et son
compte. Une règle sans mécanisme est une consigne, et une consigne se suit par discipline — c'est-à-
dire qu'on finira par ne pas la suivre. C'est la première loi transverse appliquée aux règles
elles-mêmes : *une règle est câblée ou elle n'existe pas.*

Ce document ne remplace ni `REGLES-PROJET.md` (ce qu'un produit doit tenir) ni
`CONTRAT-INTERFACE.md` (comment le pilot parle aux forges). Il rassemble les **classes de défaut**
que le parc a rencontrées plus d'une fois, ou une fois trop cher.

## Comment lire la table

Une ligne par règle. **Le fait** est daté et mesuré : c'est ce qui empêche la règle d'être une
opinion. **Le mécanisme** est exécutable et nommé — s'il manque, la colonne le dit, et c'est alors
une entrée en file des candidats, jamais un silence. Aucun tri par importance : l'ordre suit la
date du fait.

| # | Règle générique | Le fait qui l'a produite | Mécanisme qui l'exécute |
|---|---|---|---|
| N-1 | **Un travail planifié s'exerce avant d'être déclaré en place.** Tout traitement différé embarque un mode de déclenchement à la demande, distinct de sa cadence, et il est exercé une fois. | Une veille mensuelle déclarée « en place » dont le premier passage a rendu « rien à faire » **en succès** : pas une ligne n'avait tourné sur un agent, et le premier passage réel aurait eu lieu quinze jours plus tard. | `oracle-ops --planifie` (O-8, forge-ops) · gate **M-7** de l'étape MEP · `80` PASS à la recette de forge-ops |
| N-2 | **Un état vide se déclare.** Une liste, un filtre ou une recherche qui ne rend rien le dit, avec le chemin pour en sortir. | Un bouton « Aucun » qui réduisait un tableau à quelques pixels **sans un mot** : la page était géométriquement irréprochable et ne disait plus rien. Trouvé par le client. | famille bloquante `etat_muet` de `render_page.py --matrice-etats` · `112` cas au self-test du socle |
| N-3 | **Un contrôle statique ne rend pas la page.** Un livrable HTML n'est conforme qu'après les DEUX contrôles : le marquage et le rendu. | Deux instances de gabarit livrées vertes au marquage et rouges au rendu, sur **trois** causes distinctes — contraste 2,48:1, mesure de lecture mal posée, quatre chevauchements. | `scripts/verifier-rendu-instances.mjs`, joué à chaque recette du pilot (I4) |
| N-4 | **Une règle neuve se joue sur un cas fautif construit exprès.** Et les deux pièges connus d'expression régulière sont balayés : frontière ASCII collée à un mot accentué, drapeau insensible sur une plage de majuscules. | Trois règles écrites le même jour étaient **mortes en croyant vivre** : elles rendaient PASS sur ce qu'elles existaient pour refuser. Une quatrième, dans l'oracle qui traque ces pièges, a été attrapée par sa propre fixture. | `oracle-pieges-regex` (P1, P2) — `10/10` au self-test, `208` fichiers balayés sur `16` dépôts, **4 règles mortes trouvées et corrigées** dans trois dépôts |
| N-5 | **Le pilot n'écrit pas chez un produit.** Seuls les produits se modifient eux-mêmes ; le pilot fournit les gabarits et vérifie en lecture. Un run demandé se déclare. | Le garde-fou existait dans `CLAUDE.md` depuis l'origine et **rien ne l'exécutait** : il tenait par discipline seule. Décision humaine du 23/08 : « ne touche pas les produits ». | `oracles/hook-produits-intacts.mjs` — relevé à l'ouverture, comparaison à la fin du tour, **blocage** si un produit a bougé sans mandat ; `7/7` au self-test, `20` produits suivis |
| N-6 | **Une valeur mobile ne se recopie pas.** Une note documente la FORME d'un contrat, jamais sa valeur courante ; une valeur citée nomme son dépendant, ou devient un pointeur. | Six sondes nominatives sur un seul document, quand les deux dernières dérives avouées vivaient ailleurs. Une dérive réelle attrapée **une heure après avoir été créée** : 12 oracles cités pour 13 réels. | claims de `oracle-fraicheur-doc` (la preuve) + balayage **F-CLASSE** (la classe) — `26` assertions signalées sur `6` documents |
| N-7 | **Un mécanisme de scellement rejoint le registre.** Un format unique déclaré, et tout nouveau site de hachage entre dans la table ou devient un constat. | **Sept** items de la même classe traités un par un, dont **deux redécouvertes strictes** du même défaut — les fins de ligne, dans deux forges ; un chemin de scellement oublié, dans la même forge. | `oracle-empreintes` (E1, E2, E3) — `7/7` au self-test, `22` sites déclarés sur `15` dépôts ; il a attrapé **deux** sites créés le jour même, dont un par son propre auteur |
| N-8 | **Un jeu de livrables est complet, ou la passe le dit.** Ce qu'un catalogue déclare se produit dans la même passe, et l'écart s'annonce avec un code distinct. | Un jeu remis **incomplet** : c'est le commanditaire qui a réclamé le second format, et le générateur a ensuite été réécrit de zéro côté produit. | `build-fiche.mjs` rend les deux formats en une passe (forge-audit) · `oracles/verifier-pdf.mjs` **relit** le tirage · `13` tests |
| N-9 | **Ce qui est mesuré est relu dans l'artefact, jamais déduit de la commande.** Un code de retour 0 ne prouve pas qu'un octet a été écrit. | Un PDF verrouillé par une visionneuse : le navigateur a échoué **sans le dire**, et le script a revalidé l'ancien tirage en croyant valider le nouveau. Vu en comparant les horodatages. | `verifier-pdf.mjs` P1-P4, dont la **fraîcheur** (postérieur au lancement ET à sa source) — le seul contrôle qui attrape ce cas |

## Les deux règles qui n'ont pas encore de mécanisme

Elles sont écrites ici pour ne pas se perdre, et **déclarées sans contrôle** — c'est une dette, pas
une omission.

- **N-10 · Une mesure qui rend plusieurs familles est lue en entier, ou son reste est déclaré.**
  Le fait : une mesure tournait sur les routes servies depuis le 20/08 et rendait débordements,
  chevauchements et largeurs **en même temps** que le contraste ; seul le contraste était lu, le
  reste était **jeté**. Un consommateur de mesure doit avoir une branche par défaut qui rapporte
  les familles qu'il ne connaît pas — c'est ce que fait déjà `rendu-comparatif` de forge-design, et
  ce qu'aucun contrôle n'exige. *Candidat : comparer, par machine, les familles produites par la
  mesure du socle aux familles consommées par chaque appelant.*
- **N-11 · Une affordance promise dans un commentaire est vérifiée.** Le fait : un commentaire
  annonçait « une infobulle par forme, aucun script » et aucune forme ne la portait ; un paramètre
  était déclaré et jamais lu ; une classe était employée sans une seule règle de style. Les deux
  derniers cas **ont** leur contrôle (O-8 et L21) ; le premier n'en a pas, parce que vérifier une
  promesse de prose demande de comprendre la prose. *Candidat : restreindre au cas mécanisable —
  un commentaire qui nomme un élément absent du même bloc.*

## Ce que ce document ne garantit pas

- **Il ne remplace pas la fixture à double sens.** Chaque règle ci-dessus a été trouvée parce qu'un
  cas fautif a été construit exprès. Aucune liste de règles ne dispense de cet exercice.
- **Il ne couvre que ce qui a été rencontré.** Une classe de défaut jamais payée n'y figure pas, et
  c'est assumé : une règle écrite « au cas où » n'a ni mesure ni mécanisme, donc aucune force.
- **Il vieillit.** Les comptes cités sont ceux du 23/08/2026 ; le balayage de classe
  (`oracle-fraicheur-doc`) signalera ceux qui dérivent, et c'est exactement l'usage prévu de N-6.
