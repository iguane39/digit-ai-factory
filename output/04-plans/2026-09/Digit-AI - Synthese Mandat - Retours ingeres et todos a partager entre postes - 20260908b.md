---
destinataire: humain
---

# Synthèse de mandat — « fais tous les retours et todos » : les neuf lots en attente sont ingérés et publiés, le second temps attend trois arbitrages parce que l'autre poste joue déjà le même tri (08/09/2026)

Le premier temps de votre demande est fait : les neuf lots de retours qui attendaient dans la boîte d'entrée de ce poste sont ingérés, vingt-trois candidatures en sont nées dont vingt et une récidives de classes déjà closes, les lots sont pseudonymisés sur disque au pseudonyme que le canal confidentiel donne au produit, et le tout est publié avec une porte verte. Le second temps, les soixante et onze candidatures ouvertes, ne peut pas se jouer d'ici sans vous : l'autre poste exécute depuis sept heures ce matin le tri en bloc que vous lui avez accordé hier soir sur les mêmes candidatures, et deux postes qui corrigent les mêmes forges en même temps se contredisent. S'y ajoute un désaccord de fond découvert au passage : mes tables de pseudonymisation locales et celles du canal attribuent six pseudonymes à des produits différents, ce que seule votre lecture des noms réels peut trancher. Ce qui change pour vous : la boîte d'entrée de ce poste est vide sauf un lot du 3 septembre que le canal ne sait pas nommer, et le registre porte tout ce que les produits ont remonté. Ce qui est attendu de vous : arbitrer les tables, partager les candidatures entre les deux postes, et décider de la forge des outils rebâtie ici.

## 1. En-tête d'identification

- **quoi** — mandat humain « Fais tous les retours et todos » : ingestion des lots en attente, puis traitement des candidatures ouvertes.
- **sur quoi** — le pilot `digit-ai-factory` (boîte d'entrée, registre, commit a5e7c47 publié) ; la forge des outils rebâtie sur son histoire réécrite par l'autre poste (commit local edfdb2e, non publié) ; lecture seule chez le canal confidentiel `c:\dev\_confidentiel` cloné par le bootstrap.
- **quand** — 2026-09-08 07:32 UTC+02:00 (Europe/Paris), durée ≈ 20 min depuis le mandat.
- **qui** — pilot digit-ai-factory a5e7c47 ; `todo\ingerer-lot.mjs`, `todo\anonymiser-suivis.mjs`, `scripts\rebatir-clone.mjs`, porte `oracle-nom-client-publie` avec les tables du canal.

## 2. Verdict en une ligne

9 lots ingérés (1 du 03/09, 7 du 07/09, 1 arrivé ce matin), 23 candidatures TF-0889 à TF-0911 (21 récidives, 2 neuves ; 11 pilot, 7 forge des outils, 3 forge des données, 1 socle des pages, 1 pilot-lots), registre PASS, 17 fichiers de lots pseudonymisés « Produit-62 » et publiés (« d5a44b8..a5e7c47 main -> main », porte verte) ; registre ouvert : 71 candidats, 7 décidés, 1 en cours ; forge des outils rebâtie (5 patches rejoués, paquet vérifié) mais porte FAIL 14 dont 12 dans la branche de sauvegarde locale ; fusion des tables : 6 conflits, 10 ajouts, rien écrit.

## 3. Décisions attendues de l'humain

Trois décisions, toutes nées de la même journée à deux postes : le canal confidentiel créé hier soir sur l'autre poste fait des tables la source unique, mais ce poste avait attribué ses pseudonymes seul depuis fin août ; le tri des candidatures a été accordé hier soir à l'autre poste, qui l'exécute ; et la forge des outils, réécrite là-bas, a été rebâtie ici avec cinq commits propres à ce poste qui ne sont pas publiés.

> **D-13 — Comment tranche-t-on les six pseudonymes que mes tables locales et le canal confidentiel attribuent à des produits différents ?**
> La fusion des tables libres de ce poste dans le canal a été essayée sans rien écrire : six pseudonymes de produit (Produit-03, 04, 05, 06, 11, 12) désignent un produit dans le canal et un autre dans ma table locale, et dix noms de ma table sont absents du canal. Tout ce que ce poste a pseudonymisé depuis le 28 août l'a été avec sa table ; tout ce que l'autre poste a pseudonymisé depuis hier soir l'a été avec le canal. Le canal est déclaré source unique par votre décision D-28 d'hier, mais seule votre lecture des noms réels dit lequel des deux a raison ligne à ligne, et ce qui doit être renommé après coup dans les registres et les lots déjà publiés.
> **Recommandation : (a).** Source consultée : `node scripts/fusionner-tables-confidentielles.mjs --essai` → « 6 conflit(s) à arbitrer par l'humain — RIEN n'a été écrit », « ajouts: 10 » ; synthèse 20260907m de l'autre poste (D-28 a : les tables vivent au canal) ; `scripts\lib-confidentiel.mjs` (ordre de résolution : variable d'environnement, puis canal, puis anciens fichiers en le disant).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Le canal fait foi : vous arbitrez les six conflits dans le canal (ligne à ligne, noms réels sous vos yeux), j'ajoute les dix noms manquants, puis je mets mes fichiers libres hors d'usage et je rejoue la porte sur le parc | Un arbitrage de six lignes de votre part, une fusion et un balayage du parc de la mienne, moyen × court | Rien ; les artefacts déjà publiés avec un pseudonyme périmé se renomment ensuite par un lot de rectification |
| (b) Ma table locale fait foi sur les six lignes, le canal est corrigé | Le même geste, en sens inverse | La cohérence avec tout ce que l'autre poste a publié depuis hier soir |
| (c) Rien : deux tables continuent de vivre | Aucun coût | Toute porte, ingestion ou réécriture jouée sur ce poste reste jugée avec une table périmée |

> **Si rien n'est décidé** : (c) — ce poste continue de désigner explicitement les tables du canal à chaque geste, ce qui tient pour les portes mais pas pour les six pseudonymes déjà écrits.

> **D-14 — Le second temps du mandat, les soixante et onze candidatures ouvertes, se partage-t-il entre les deux postes, et comment ?**
> Hier soir, vous avez accordé à l'autre poste le tri en bloc de quarante candidatures par émetteur (sa décision D-31, option a), et il l'exécute depuis 07:07 ce matin : sa première clôture et son premier lot déposé chez la forge des outils sont publiés. Votre mandat de ce matin me demande de traiter toutes les candidatures, dont ces quarante. Deux postes qui corrigent la même forge le même matin produisent des commits concurrents sur les mêmes fichiers et des numéros de registre en collision, ce qui est arrivé deux fois hier soir. Les vingt-trois candidatures nées ici ce matin, elles, ne sont dans aucun tri.
> **Recommandation : (a).** Source consultée : commit d5a44b8 de l'autre poste (« D-31 (a) : TF-0887 decide, lot 20260908a depose chez forge-agents ») ; synthèse 20260907m, décision D-31, ordre du tri par émetteur ; registre : 71 candidats dont 23 nés ici (TF-0889 à TF-0911) ; les collisions TF-0869 et TF-0792 d'hier.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Ce poste prend les vingt-trois candidatures nées ici et les forges où il a déjà mandat (données, audit, design, exploitation, tests, développement) ; l'autre poste garde son tri (pilot, outils, conception, sécurité du produit 61) ; chaque poste journalise ses décisions avant d'écrire chez une forge | Une campagne ici, complexe × long, en commits locaux publiés sur GO ; un message à l'autre poste par le registre | Les collisions de fichiers ; pas les collisions de numéros, qui restent possibles entre deux frappes |
| (b) Tout ici, l'autre poste s'arrête | Une campagne complète ici, très complexe × long | Le travail déjà engagé là-bas depuis 07:07 |
| (c) Tout là-bas, ce poste s'arrête après ce premier temps | Aucun coût ici | Les vingt-trois candidatures nées ici attendent que l'autre poste les tire |

> **Si rien n'est décidé** : (c) — ce poste ne touche à aucune candidature ; l'autre poste les voit toutes au prochain pull, tri compris.

> **D-15 — La forge des outils rebâtie ici se publie-t-elle, après suppression de sa branche de sauvegarde locale ?**
> L'autre poste a réécrit et publié l'histoire de la forge des outils hier soir. Ce poste portait cinq commits propres (le chantier des schémas du 4 septembre et les quatre barres de la mission data d'hier) ; l'outil de reconstruction les a rejoués sur l'histoire publiée après un paquet de sauvegarde vérifié, et ils sont propres. La porte reste rouge : douze constats vivent dans la branche de sauvegarde locale posée hier matin par la reconstruction, jamais poussée, et deux dans l'histoire publiée par l'autre poste que ma table locale seule condamne. Supprimer une branche est un geste humain ; la publication l'est aussi.
> **Recommandation : (a).** Source consultée : `scripts\rebatir-clone.mjs` sur la forge des outils → « 5 patch(es) rejoué(s), paquet digit-ai-forge-agents-20260908-051717.bundle vérifié ; porte FAIL » ; `git for-each-ref --contains` → les douze commits locaux vivent dans `sauvegarde/ancienne-histoire-20260907` ; précédent D-8 (a) d'hier sur la forge des données.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Supprimer la branche de sauvegarde (son paquet existe), rejouer la porte avec les tables du canal, publier les cinq commits | Un `git branch -D` et un push, simple × court | Rien : le paquet conserve l'ancienne histoire |
| (b) Publier sans supprimer la branche | Impossible sans contournement : la porte compte la branche | Une porte verte |
| (c) Laisser la forge des outils locale | Aucun coût | Les quatre barres de la mission data et le chantier des schémas ne sont visibles que sur ce poste |

> **Si rien n'est décidé** : (c) — la forge des outils reste en avance locale de cinq commits, paquet à l'appui.

## 4. Traité — avec sa preuve

- Parc rafraîchi : pilot remis en avance rapide (suivi de branche rétabli), canal confidentiel cloné par le bootstrap, skills installés réalignés.
  - preuve : `git pull --ff-only` → « pilot HEAD=d5a44b8 avance=0 retard=0 » ; `bootstrap.mjs --pull` → « canal confidentiel cloné en c:\dev\_confidentiel », « skills propagés … rejeu PASS », « Poste prêt ».
- Neuf lots ingérés, un par un, avec pseudonymisation à l'entrée et récidives comptées.
  - preuve : `ingerer-lot.mjs` → « [OK] 2 candidature(s) ingérée(s) » (03/09), puis 2, 2, 3, 1, 3, 2, 5 (07/09 a à g), puis 3 (08/09 a) ; « [ANONYMISÉ] produit du lot → Produit-62 (table hors dépôt) » ; `oracle-todo.mjs` → PASS.
- Lots pseudonymisés sur disque, nom et contenu, au pseudonyme du canal. Contrôle rouge → vert : l'anonymiseur avait pris l'alias court du produit (« Produit-10 ») avant son nom complet (« Produit-62 », ce que le registre porte) → quinze fichiers renommés et corrigés ; index sans nom réel ; classe : remplacement par l'alias le plus court avant le plus long.
  - preuve : `anonymiser-suivis.mjs --fichiers` → « ecrits 15 renommes 15 » puis « ecrits 2 renommes 2 » ; `git grep` des noms des deux tables dans l'index → aucune ligne indexée dont le texte porte un de ces noms, recherche complémentaire par structure faite par la porte C1-C5 (motifs de jetons, courriels, domaines, pseudonymes) rendue PASS au push ; `grep -c` des noms réels dans l'index de la boîte → 0.
- Registre et lots publiés. Contrôle rouge → vert : push refusé trois fois (index régénéré non commité, porte jugeant avec mes tables locales périmées : « Client-B » pris pour un nom de produit) → tables du canal désignées à la porte, deux fichiers non résolus retirés de l'index, commit recomposé, push accepté ; classe : porte jugeant avec une table périmée.
  - preuve : « PUBLICATION REFUSEE … C5 scripts/fusionner-tables-confidentielles.test.mjs:32 » puis « d5a44b8..a5e7c47 main -> main ».
- Forge des outils rebâtie sur l'histoire réécrite par l'autre poste, cinq commits propres rejoués, sans perte.
  - preuve : `rebatir-clone.mjs` → « avant {avance: 116, retard: 114, delta_propre: 5} », « 5 patch(es) rejoué(s) », « paquet … vérifié », « après {head: edfdb2e, avance: 5, retard: 0} » ; aucun de mes cinq messages ne porte de nom.
- Fusion des tables essayée sans rien écrire.
  - preuve : `fusionner-tables-confidentielles.mjs --essai` → « 6 conflit(s) à arbitrer par l'humain — RIEN n'a été écrit, ni renommé », « ajouts: 10 ».

## 5. Non traité — avec son motif

- Les soixante et onze candidatures ouvertes : attend D-14, parce que l'autre poste exécute le même tri depuis 07:07 et qu'écrire dans les mêmes forges produirait des commits concurrents.
- Fusion des tables : six conflits que seule une lecture humaine des noms réels tranche (D-13).
- Publication de la forge des outils : branche de sauvegarde à supprimer, geste humain (D-15).
- Le lot du 03/09 (deux fichiers) : ingéré au registre, mais son nom n'est pas résolu par le canal et l'anonymiseur ne l'a pas renommé ; laissé hors suivi jusqu'à D-13.
- Le fichier `null` de 44 octets à la racine du parc, écrit le 07/09 à 18:41 par une redirection Windows : contenu lu par deux sondes, `cat` et `od -c`, qui montrent le même objet JSON de statut de mode (« azure-bare-minimum », 44 octets) ; supprimer un fichier est un geste humain.
- Deux réserves du 01/09 dans la pile de mise de côté du pilot : signalées hier, non touchées.

## 6. Écarts à la lettre

- Vous avez demandé « tous les retours et todos » → les retours sont faits, les todos attendent D-14 → pourquoi : l'autre poste traite ces mêmes todos sous votre décision d'hier soir ; deux postes sur les mêmes forges le même matin se contredisent, et le partage est votre choix, pas le mien.
- Les lots ont été pseudonymisés avec les tables du canal alors que la fusion n'est pas faite → parce que le canal est la source unique décidée hier (D-28 a), et que la porte de publication ne passe qu'avec lui.
- Aucun autre écart.

## 7. Risques

- **Pseudonymes déjà publiés avec une table périmée** : signal = D-13 (a) qui renverse un des six pseudonymes de ma table ; parade = lot de rectification au registre et renommage des lots concernés, jamais une réécriture d'histoire pour un pseudonyme.
- **Collision de numéros entre les deux postes** : signal = un push du pilot refusé après une journalisation ; parade = frapper après un fetch, renuméroter avant de publier (fait deux fois hier).
- **Tri exécuté deux fois** : signal = un item corrigé sur les deux postes avec deux commits différents ; parade = D-14 et le registre comme point de coordination (un item passé en cours par un poste n'est pas touché par l'autre).

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-48 | Fusionner les tables après votre arbitrage, mettre mes fichiers libres hors d'usage, rejouer la porte sur les quatorze dépôts, rectifier les pseudonymes périmés au registre et dans les lots | neuve | auto_ia | dependance_bloc_3 (D-13) | `node scripts/fusionner-tables-confidentielles.mjs`, puis porte sur chaque dépôt, puis `todo/journaliser.mjs` (rectifications) | deux tables continuent de vivre |
| A-49 | Supprimer la branche de sauvegarde de la forge des outils, rejouer la porte avec les tables du canal, publier les cinq commits | TF-0856, TF-0857, TF-0859 | auto_ia | dependance_bloc_3 (D-15) | `git branch -D sauvegarde/ancienne-histoire-20260907` puis porte puis `git push origin main` dans `c:\dev\digit-ai-forge-agents` | quatre barres et le chantier des schémas restent locaux |
| A-50 | Campagne sur les candidatures attribuées à ce poste : décision en bloc journalisée, puis un agent de campagne par forge (données, audit, design, exploitation, tests, développement) sous le contrat de campagne, commits locaux, clôtures avec gains | TF-0889 à TF-0911 et items des forges attribuées | auto_ia | dependance_bloc_3 (D-14) | `todo/journaliser.mjs` (décisions), agents mandatés par forge, `gabarits\AGENT-CAMPAGNE.md` | les candidatures nées ici restent candidates |
| A-51 | Journaliser deux constats en passant : l'anonymiseur remplace l'alias court avant le nom complet en mode `--fichiers` ; le hook d'index de la boîte d'entrée réécrit les noms des fichiers non suivis | neuve | auto_ia | gate_gouvernance (candidatures à journaliser puis décider) | `node todo/journaliser.mjs --fichier <evenements.json>` | la même erreur de pseudonyme se rejoue au prochain lot |
| A-52 | Supprimer le fichier `c:\dev\null` | neuve | manuelle_utilisateur | irreversible : supprimer un fichier est un geste humain (règle 29) ; contenu lu par deux sondes | `Remove-Item c:\dev\null` | un fichier parasite reste à la racine du parc |
| A-53 | Répondre à D-13, D-14 et D-15 | neuve | manuelle_utilisateur | decision : lecture des noms réels, partage entre postes, suppression d'une branche | répondre dans ce fil par `D-13 (a)`, `D-14 (a)`, `D-15 (a)` ou les lettres choisies | ce poste ne touche ni aux tables, ni aux candidatures, ni à la forge des outils |

Ordre : A-53 d'abord, parce qu'elle conditionne A-48, A-49 et A-50 ; A-48 avant A-50, parce qu'une campagne pseudonymise avec la table qu'elle trouve ; A-51 dès que possible, parce que le prochain lot rejouera le défaut ; A-52 quand vous voulez.

## 9. Traces

- pilot a5e7c47 — `todo\TODO.jsonl` (TF-0889 à TF-0911, 9 événements d'ingestion), `input\00-retours\Produit-62 - RETOURS - 20260907a…g` et `…20260908a` (17 fichiers), publié.
- `input\00-retours\Produit-65 - RETOURS - 20260903a.*` — hors suivi, ingéré au registre.
- `..\digit-ai-forge-agents` — HEAD edfdb2e (5 en avance), branche `sauvegarde/ancienne-histoire-20260907` ; `c:\dev\_sauvegardes\digit-ai-forge-agents-20260908-051717.bundle`.
- `c:\dev\_confidentiel\tables\` — tables du canal (lecture seule ici) ; `c:\dev\_noms-interdits.json`, `_produits-pseudonymes.json` — tables libres périmées de ce poste.
- `c:\dev\null` — fichier parasite du 07/09 18:41.
