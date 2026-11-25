# Retours forges — Produit-81 — 20261123h

- **Contexte** : README.md de Produit-81 réécrit au gabarit de présentation du projet commun Produit-64 (23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 51, 52, 53, 54 ;` (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 23/11/2026

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-38 (majeur) — Une action laissée à l'humain regroupe des valeurs sans les énumérer, et le verbe « Choisir » suffit à passer S61

**Le fait.** Le 23/11/2026, la restitution du README de Produit-81 laisse au porteur l'action A-1 « Choisir les valeurs encore ouvertes, puis me les donner ». Le premier texte disait « Faire compléter les valeurs » : S61 a refusé le motif `decision` pour un geste d'exécution, et remplacer le verbe par « Choisir » a suffi à le satisfaire. L'action regroupait 17 « à renseigner » sans les compter ni dire, pour chacun, où il va et pourquoi il est ouvert. 5 d'entre eux se mesuraient sans humain : contrôles `M-2` et `M-8` lus dans la chaîne, adresse publique, fiches sécurité, décision de Design Authority. Le porteur : « Tu me demandes de choisir les valeurs encore ouvertes sans me dire lesquelles ni pourquoi, il y a comme un problème ».

**Le coût, prouvé.** Un tour de reprise : 5 valeurs remplies après coup par la session (commit `d71d118`), les 12 restantes réécrites en 5 questions détaillées.

**La règle qui aurait évité le retour.** Une action `manuelle_utilisateur` qui porte plusieurs valeurs les énumère une par une, chacune avec sa destination et la voie automatique essayée. S61 juge le contenu de l'action, pas son verbe. **Clé proposée** : `action-humaine-groupee-sans-detail`, famille `restitution-forme`, libellé « Une action laissée à l'humain lui demande un lot de valeurs sans en lister chacune ni dire pourquoi elle est ouverte : il ne peut ni répondre ni vérifier que la session a essayé la voie automatique ».

**Juge proposé.** Au pré-jugement : une action humaine qui cite « les valeurs », « les champs » ou un compte de valeurs sans les lister est signalée. Un motif `decision` n'est accepté que si les options sont nommées dans la ligne.

## RT-39 (majeur) — « Rien à remonter » accepté après un refus du hook Stop et des frictions écrites dans la même session

**Le fait.** Le 23/11/2026, deux restitutions successives de Produit-81 portent « Remontée à la factory : rien à remonter ». Dans la même session : un refus bloquant du hook Stop (S1, S4), trois passes de pré-jugement, un faux positif d'oracle, et un clone du projet commun que l'avance rapide ne met pas à jour (la première restitution le relevait elle-même). Le pré-jugement a rendu « frictions : sans objet : aucune friction retenue (refus du hook Stop et échecs d'oracle sont journalisés, pas jugés) ». Le porteur : « Comment peux-tu ne rien avoir à remonter à la Factory ? ».

**Le coût, prouvé.** 4 retours perdus jusqu'à la question du porteur ; un tour de plus pour les consigner.

**La règle qui aurait évité le retour.** Après un refus du hook Stop ou une correction du porteur dans la session, « rien à remonter » est refusé tant qu'aucune entrée `type: retour` n'a été écrite dans cette session.

**Juge proposé.** Le pré-jugement lit les refus du hook Stop de la session (transcript ou journal des frictions) et juge FRICTIONS sur eux, au lieu de rendre « sans objet ».

## RT-40 (mineur) — Le README au gabarit de présentation est jugé par un oracle maison, faute d'oracle au registre

**Le fait.** Le 23/11/2026, le README de Produit-81 au gabarit du projet commun n'a aucun oracle au registre. Le gabarit impose : encadré « En bref » de 7 lignes, 9 chapitres, les 6 sections de `GDE0101-R05`, aucune personne nommée, « à renseigner » pour les valeurs absentes. La session écrit un contrôle dans son dossier temporaire (structure, liens, noms, GUID, « TODO », sections R05), qu'elle n'enregistre jamais. Ce contrôle a eu un faux positif : « SSRS » lu comme un nom de famille. La loi `quality-oracles` (domaine sans oracle : en définir un et le remonter au registre) n'a pas été suivie.

**Le coût, prouvé.** Un contrôle à réécrire à chaque produit ; le guide en liste 23 qui doivent écrire ce README. Un faux positif corrigé à la main.

**La règle qui aurait évité le retour.** Un domaine de livrable nouveau dans un guide client reçoit son oracle au registre avant son premier emploi par un produit.

**Juge proposé.** `oracle-readme-presentation` : titre `<TRI> — <Nom>`, 7 lignes « En bref » dans l'ordre, 9 chapitres et leur question, liens relatifs résolus, aucun nom de personne (liste lue dans la fiche produit), 6 sections R05 ; enregistré dans `registre-oracles.md`.

## RT-41 (mineur) — Le pré-jugement de restitution a deux faux positifs, S36 et S26, qui obligent à dégrader le texte

**Le fait.** Le 23/11/2026, au pré-jugement d'une restitution de Produit-81 :

- S36 compte « index.html », cité comme source de jetons, pour 2 pages HTML livrées sans critique de design, alors qu'aucun fichier servi n'a été écrit dans le tour ;
- S26 exige le chemin absolu d'une confirmation d'écriture qu'il trouve dans le bloc 0, où les chemins sont interdits.

Pour passer, « index.html » a été réécrit en « la page d'accueil de l'application web », ce qui est moins précis, et S26 a été motivé.

**Le coût, prouvé.** 3 passes de pré-jugement pour un README ; une précision perdue dans le texte remis.

**La règle qui aurait évité le retour.** S36 ne compte que les pages HTML écrites dans le tour ; S26 ne cherche pas de chemin absolu dans le bloc 0.

**Juge proposé.** Deux cas au banc du hook : une restitution qui cite `index.html` sans l'écrire passe S36 ; une confirmation au bloc 0, avec le chemin absolu au bloc 4, passe S26.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes).

- RT-38 : `restitution-action-humaine-geste-agent` vise une action qui confie un geste d'agent, `action-sans-objet` une action qui ne dit pas ce qu'elle fait ; aucune ne vise le regroupement de valeurs non détaillées. Clé neuve en `classe-a-creer`.
- RT-39 : `remontee-declaree-nulle-apres-correction`, reproduite.
- RT-40 : `oracle-remplace-par-controle-maison`, reproduite.
- RT-41 : `oracle-faux-positif`, reproduite.

## Remarques restées au produit

- Le gabarit du projet commun écrit « fusion sur `main` » alors que la branche principale de Produit-81 est `master` — généralisable : oui, à remonter au projet commun Produit-64, pas à la Factory.
- Le clone local du projet commun n'avance plus : des fichiers non suivis portent le même nom que des fichiers arrivés du serveur — généralisable : oui, à remonter au projet commun Produit-64.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la Factory : le README suit un gabarit du projet commun.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
