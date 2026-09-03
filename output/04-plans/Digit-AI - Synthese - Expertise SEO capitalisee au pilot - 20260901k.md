---
destinataire: humain
---

# Synthèse — L'expertise « données de recherche » capitalisée dans la factory — 20260901k

**0. Synthèse d'ouverture.** Tout ce que le chantier du jour a appris est maintenant capitalisé dans la factory : un référentiel d'expertise durable — les six familles de données, la doctrine de cadence, la découverte de mots-clés multilingue, l'événementiel, la lecture du prix du clic, l'escalier budgétaire et le schéma d'intégration type — sans aucun prix recopié, puisqu'un prix périme et vit dans une étude datée. Ce référentiel est branché au démarrage de toute future session, donc chaque prochain projet en héritera d'office. Ce qui est attendu de vous : dire si la forge spécialisée en référencement doit l'ingérer dans son propre corpus, et les deux actions en attente restent ouvertes — la session produit à lancer, et l'autorisation de versionner la journée.

## 1. En-tête

**Quoi** : capitalisation d'expertise SEO (mandat humain du 01/09). **Sur quoi** : pilot `digit-ai-factory` (référentiel + noyau + registre). **Quand** : fin le 2026-09-01 à 22:49 (+02:00), durée ≈ 7 min. **Qui** : Claude Fable 5, session VSCode, dépôt à `6d1cee5` (non committé).

## 2. Verdict en une ligne

1 référentiel écrit (`references\SEO-RECHERCHE.md` v1.0.0, 8 chapitres), cité par le noyau — `oracle-claude-md` : N1 (plafond de taille du noyau) PASS à 6140/6144 octets, citation vérifiée ; TF-0792 créé au registre (`journaliser` PASS, 32 actifs).

## 3. Décisions attendues

Le référentiel vit chez le pilot et sera chargé par toute session future ; mais la forge spécialisée du domaine — celle qui outille les missions de référencement — ne le porte pas encore dans son propre corpus, et écrire chez elle est hors du mandat de ce soir. La proposition d'ingestion est au registre en attente de votre arbitrage.

> **D-4 — La forge de référencement doit-elle ingérer ce référentiel d'expertise dans son propre corpus ?**
> Il s'agit de faire entrer les acquis du jour (familles de données, cadence, escalier budgétaire, doctrine du prix du clic) dans la baseline ou les gabarits de la forge spécialisée, adaptés à sa grille, pour que ses missions futures en partent d'office.
> **Recommandation : (a).** Source consultée : la proposition consignée au registre (TF-0792) et le référentiel `references\SEO-RECHERCHE.md` lui-même.
> Pourquoi : la forge est l'exécutant naturel des missions de référencement ; une expertise qui ne vit que chez le pilot dépend du chargement de session, quand la forge l'appliquerait par construction.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** mandater l'ingestion à un prochain run de la forge | complexité simple × durée courte (un run d'intégration documentaire) | rien — le pilot garde la version transverse |
| **(b)** laisser l'expertise au pilot seulement | rien | l'application d'office par la forge — chaque mission devra charger la référence du pilot |
| **(c)** décider plus tard | rien maintenant | rien — l'item reste candidat au registre |

> **Si rien n'est décidé** : (c) — la proposition reste candidate au registre, sans effet jusqu'à votre arbitrage.

## 4. Traité — avec sa preuve

- Référentiel d'expertise écrit : six familles de données, doctrine de cadence, découverte multilingue explorer-large-puis-resserrer, événementiel et Google Trends, doctrine du prix du clic, escalier budgétaire à critères mesurables, schéma d'intégration type, checklist de réutilisation — généralisé, daté, sourcé, sans aucun prix recopié ;
  - preuve : `references\SEO-RECHERCHE.md` v1.0.0 créé, gate d'écriture C7 (contrôle qualité à l'écriture) passé sans constat.
- Référentiel branché au noyau (ligne SEO des références chargées avant tout run), avec deux compressions pour tenir le plafond ;
  - preuve : `oracle-claude-md` — N1 PASS « noyau 6140 octets ≤ 6144 », « references\SEO-RECHERCHE.md cité et présent ».
- Proposition d'ingestion par la forge du domaine consignée au registre, ciblée sur elle ;
  - preuve : `journaliser` PASS, TF-0792 créé (candidat) horodaté 2026-09-01T20:48:35Z ; vues régénérées, 32 actifs, sceau acfdb892f6b1.

## 5. Non traité — avec son motif

- L'écriture du référentiel chez la forge de référencement — motif : hors mandat, « alimente la factory » couvre le pilot, pas les dépôts frères ; la voie est la décision D-4 puis un run de la forge.
- La mise à jour de la fiche d'audit de la forge — motif : écarté, cette fiche est une baseline d'audit remise à jour par les audits eux-mêmes, pas un lieu d'expertise ; critère de réouverture : le prochain audit de la forge.
- Le commit git de la journée — motif : bloqué par un garde-fou, l'autorisation explicite n'a pas été donnée (action A-8).

## 6. Écarts à la lettre

- Vous avez demandé « collecte toutes les données travaillées » → les prix relevés le 01/09 ne sont PAS recopiés dans le référentiel, seulement pointés vers l'étude datée → parce qu'un prix est une donnée périssable (péremption au 01/10) : le recopier dans un référentiel durable fabriquerait du faux au premier changement de grille.

## 7. Risques

- Le référentiel pourrait dériver de la réalité du terrain si les prochains chantiers n'y reversent pas leurs acquis ;
  - signal : un chantier SEO qui découvre une doctrine absente du référentiel sans que la version bouge ;
  - parade : la loi des données périssables impose version + date à chaque mise à jour, et le canal des candidatures au registre reste ouvert pour les acquis nouveaux.

## 8. Prochaines actions

Ordre : A-11 attend D-4 ; A-10 et A-8 sont les deux actions déjà ouvertes de la soirée, inchangées.

| Sélecteur | Action | Acteur | Motif / raison | Si rien n'est fait | Identifiant |
|---|---|---|---|---|---|
| **A-11** | Mandater un run de la forge de référencement pour ingérer `references\SEO-RECHERCHE.md` dans son corpus (baseline, gabarits ou skill), adapté à sa grille | auto_ia | dependance_bloc_3 (D-4) | l'expertise reste au pilot seul ; les missions de la forge repartent de leur baseline actuelle | TF-0792 |
| **A-10** | Ouvrir une session dans `C:\dev\Produit-02.com` et lancer : `Traite ta boîte d'entrée input\00-travaux\ — en priorité le lot pilot - TRAVAUX - 20260901a.md` | manuelle_utilisateur | decision — mandater un run chez un produit autonome est un arbitrage humain | l'escalier décidé reste sans chantier ; les tarifs relevés périment le 01/10 | TF-0741 |
| **A-8** | Autoriser ou refuser le commit git local des travaux du jour — répondre `A-8 : commit` ou `A-8 : non` dans le chat | manuelle_utilisateur | decision — geste à autorisation explicite | les travaux du jour (études, noyau, référentiels, registre) restent non versionnés | neuve |

## 9. Traces

- `references\SEO-RECHERCHE.md` — le référentiel d'expertise (v1.0.0, 01/09/2026) ;
- `CLAUDE.md` — citation ajoutée à la ligne des références, deux compressions ;
- `todo\TODO.jsonl` — TF-0792 (création, candidat) du 2026-09-01T20:48:35Z ; vues `todo\TODO.md` et `todo\TODO.html` (sceau acfdb892f6b1) ;
- `output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md` — l'étude source, avec les prix datés ;
- synthèse jugée : `output\04-plans\Digit-AI - Synthese - Expertise SEO capitalisee au pilot - 20260901k.md`.
