---
destinataire: humain
---

# Synthèse de mandat — l'anonymisation était câblée sur une porte, elle l'est maintenant sur toutes

Votre question avait une réponse mesurable, et elle n'est pas flatteuse : l'anonymisation
existait, elle était juste, et elle ne s'appliquait qu'à un seul chemin — celui qui mène au
registre. Tout le reste passait à côté : le fichier déposé, l'index qui le liste, et deux
fichiers d'état que des automatismes réécrivent à chaque démarrage. Le nettoyage est désormais
branché non plus sur les écrivains, mais sur ce que le dépôt suit — ce qui couvre aussi celui
qu'on n'a pas encore écrit. Le dépôt est propre. Son passé ne l'est pas, et le rendre propre est
un geste destructif qui vous revient. C'est la seule chose qui vous attend.

## 1. En-tête

Mandat de session, cinquième tour · pilot digit-ai-factory · terminé le 2026-09-01 à 16h40
(Europe/Paris) · durée 1 h 20 · agent pilot, commit 186fe5c.

## 2. Verdict

La porte de publication comptait 200 constats sur 56 fichiers ce matin ; elle n'en rend plus
aucun sur l'état actuel du dépôt — 968 fichiers balayés, 223 réécrits, 15 renommés, 15 noms
retirés — et 200 constats subsistent, tous dans l'historique.

## 3. Décisions attendues

Le nettoyage de l'état courant est complet et vérifié. Ce qui reste vit dans le passé du dépôt :
les noms sont présents dans le contenu de commits antérieurs et dans des noms de fichiers ayant
existé. Aucun outil du parc ne les en retire, et la porte refuse tant qu'ils y sont.

> **D-38 — Réécrit-on le passé du dépôt principal, ou vit-on avec une publication fermée ?**
> Le dépôt porte son histoire avec lui : ce qui a été enregistré un jour y reste, même si le
> fichier a changé depuis. Le retirer suppose de réécrire l'ensemble des enregistrements passés,
> ce qui change leur identité une par une et rend inutilisable toute copie existante du dépôt.
> Il faut aussi dire ce que cela n'achète pas : une partie de ce passé a déjà été publiée, donc
> l'exposition passée n'est pas annulée — seule l'exposition future l'est.
> **Recommandation : (b).** Source consultée : le rapport de la porte, joué par
> `node ~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs .`, qui compte 200
> constats de la seule règle d'historique et zéro sur l'état courant. Rien ne presse tant que la
> publication n'est pas nécessaire, et un geste destructif se joue reposé, pas en fin de session.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** réécrire le passé maintenant | complexité complexe × durée moyenne, toute copie existante du dépôt devient inutilisable | exclut de garder une trace consultable de ce qui a été fait sous les anciens noms |
| **(b)** garder la publication fermée, et décider à froid | gratuit ; les enregistrements s'accumulent sur ce poste seulement | exclut la publication du dépôt principal tant que rien n'est décidé |
| **(c)** publier en contournant la porte | gratuit, et le passé part en clair | exclut tout retour en arrière : ce qui est publié est publié |

> **Si rien n'est décidé** : (b) s'applique — la publication reste fermée, le travail reste sur
> ce poste, et rien ne se dégrade ; c'est le seul repli qui ne coûte rien d'irréversible.

## 4. Traité — avec sa preuve

- La question a reçu une réponse mesurée, pas une hypothèse : l'anonymisation était branchée sur
  un seul chemin, celui de l'entrée au registre.
  - preuve : une recherche sur tout le dépôt ne trouve qu'un seul appelant au module
    d'anonymisation, et le module lui-même écrit dans son en-tête qu'il garde la porte et ne
    rattrape rien.
- Le nettoyage est désormais branché sur ce que le dépôt suit, et non sur la liste des
  mécanismes qui écrivent.
  - preuve : l'outil neuf travaille sur la liste des fichiers suivis ; son banc rend 6 cas dans
    les deux sens, dont le fichier propre qu'il ne réécrit pas et le référentiel manquant qui
    arrête tout sans écrire une ligne.
- L'index des dossiers se nettoie à l'écriture, et refuse d'écrire plutôt que d'écrire sale.
  - preuve : l'index du dossier d'entrée listait six noms réels avant, zéro après, et le
    générateur signale un index non régénéré au lieu de le publier sans nettoyage.
- Les deux fichiers d'état que des automatismes réécrivent sortent du suivi.
  - preuve : ce sont des clés d'un comparateur d'empreintes, pas de la prose ; les nettoyer
    aurait cassé leur fonction, et les suivre remettait des noms à chaque démarrage.
- La passe complète est jouée, et son compte est mesuré.
  - preuve : 968 fichiers suivis balayés, 223 réécrits, 15 renommés, 48 binaires sautés, aucun
    illisible ; la batterie du pilot rend 82 recettes vertes après la passe, le registre passe.
- Trois défauts payés en chemin sont corrigés et écrits, tous de classes déjà nommées ici.
  - preuve : un banc qui s'exécutait à la place de celui d'un autre module et rendait vert sans
    rien avoir testé ; une casse désaccordée entre le nettoyeur et la porte, qui a coûté une
    passe entière ; et l'ajout d'un dossier entier au suivi, répété deux fois dans la session.

## 5. Non traité — avec son motif

- L'historique du dépôt : motif — dépendance à une décision humaine, c'est l'objet de la
  décision ci-dessus ; le geste est destructif et se décide à froid.
- Les fichiers déposés que le dépôt ne suit pas : motif — écarté par construction. L'artefact
  reçu d'un produit est une donnée et se conserve tel qu'il est arrivé ; l'outil ne touche que
  ce qui est suivi, et c'est déclaré.
- Deux fichiers d'outillage modifiés avant cette session : motif — hors mandat, ils étaient déjà
  en cours d'édition à l'ouverture ; ils ont été laissés hors des enregistrements du jour.
- Les trois lots de retours qui attendent dans la boîte : motif — hors mandat, inchangé depuis
  le tour précédent.

## 6. Écarts à la lettre

- Votre message posait une question, pas une consigne. → J'ai répondu, puis construit ce qui
  manquait. → La question portait sur une absence d'automatisme ; y répondre sans poser
  l'automatisme aurait laissé le défaut entier, et la réponse aurait été une explication de
  pourquoi il persiste.
- Je n'avais pas prévu de toucher au passé des enregistrements. → J'ai réécrit deux
  enregistrements du jour. → Ils énuméraient les noms retirés, donc les réintroduisaient dans ce
  qui se publie ; ils n'étaient pas encore sortis de ce poste, et les corriger était sans risque.
  Un message d'enregistrement est du contenu publié, et rien ne le vérifie avant la porte.

## 7. Risques

- L'outil de nettoyage réécrit en masse des fichiers suivis : une substitution malheureuse dans
  un fichier de données casserait quelque chose sans qu'on le voie tout de suite.
  - signal : une recette qui échoue sur un fichier que personne n'a édité à la main.
  - parade : la batterie complète a été rejouée après la passe et rend tout vert, le registre
    est vérifié, et l'état antérieur de chaque fichier reste consultable dans le dépôt.
- Le nettoyage ne connaît que les noms de ses deux référentiels : un client absent des tables
  passera sans être vu.
  - signal : la porte de publication qui refuse sur un nom que le nettoyage n'a pas retiré.
  - parade : la table des produits s'étend d'elle-même à la découverte ; celle des clients est
    alimentée à la main, et cette limite est déclarée par l'outil à chaque exécution.
- Un ajout de dossier entier au suivi peut réintroduire des fichiers non nettoyés, comme cela
  s'est produit deux fois dans cette session.
  - signal : la porte qui refuse sur des fichiers qu'on croyait hors du dépôt.
  - parade : la porte les a arrêtés les deux fois ; ce qui manque est un contrôle plus tôt, à
    l'enregistrement plutôt qu'à la publication, et il est nommé au dernier bloc.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur
dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit
ce que coûte l'attente. **Ordre de traitement** : la décision d'abord, puis ce qui empêche le
défaut de revenir, puis le reste à faire hérité des tours précédents.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | TF-0752 | Trancher la décision ci-dessus, puis, si l'option (a) est retenue, jouer la réécriture avec `git filter-repo` dans `c:/dev/digit-ai-factory` et prévenir tout porteur d'une copie. | manuelle_utilisateur puis auto_ia | decision puis dependance_bloc_3 — une réécriture d'historique casse toute copie existante, elle ne se décide pas ici. | La publication du dépôt principal reste fermée, et les enregistrements s'accumulent sur ce poste. |
| **A-2** | `neuve` | Poser le nettoyage à l'ENREGISTREMENT plutôt qu'à la publication : un contrôle `pre-commit` dans `c:/dev/digit-ai-factory/.git/hooks/`, jouant `node todo\anonymiser-suivis.mjs --essai` et refusant l'enregistrement s'il reste quelque chose à nettoyer. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre au socle de publication, que celui du jour ne couvre pas. | Le même défaut peut revenir à chaque ajout de dossier entier, et ne se découvre qu'à la publication. |
| **A-3** | TF-0750 | Écrire le contrôle qui refuse deux livrables du même jour portant le même indice, dans `oracles/` du pilot. | auto_ia | hors_mandat — mandat propre au socle de nommage. | La règle d'indice ne tient qu'à l'attention. |
| **A-4** | `neuve` | Ingérer les trois lots de retours qui attendent dans la boîte : `node todo\ingerer-lot.mjs <fichier>` pour chacun. | auto_ia | hors_mandat — arrivés avant-hier, mandat distinct. | Le travail de trois produits reste à la porte, et le contrôle de boîte reste rouge. |
| **A-5** | TF-0732 | Trancher où s'écrit la règle de précédence entre une charte posée et la liste des fontes réflexes : `~/.claude/CLAUDE.md` ou `~/.claude/skills/quality-oracles/references/registre-oracles.md`. | manuelle_utilisateur | decision — arbitrer entre deux doctrines actives du poste n'est pas un geste d'agent. | Toute édition d'un gabarit de la bibliothèque continue de se faire accuser sur sa police. |
| **A-6** | TF-0749 | Au prochain passage en production, jouer la comparaison des deux campagnes : `python recette/non_perte_ciblage.py <projet>` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | dependance_externe — elle exige une campagne réelle. | Le tri des tests reste éteint sans que rien ne dise s'il aurait tenu. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Anonymisation cablee sur git - 20260901g.md
- Commit : 186fe5c au pilot — local, la porte de publication reste fermée
- Outil neuf : todo/anonymiser-suivis.mjs
- Écrivains câblés : scripts/readme-dossiers.mjs · .gitignore
- Corrections : todo/anonymiser-entrant.mjs (garde d'import, casse alignée)
- Registre : todo/TODO.jsonl — TF-0751 clos, TF-0752 créé, 31 actifs
- Bancs : oracles/self-tests.mjs 82/82 · anonymiser-suivis 6/6 · anonymiser-entrant 4/4
