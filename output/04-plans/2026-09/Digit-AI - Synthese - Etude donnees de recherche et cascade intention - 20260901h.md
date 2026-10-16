---
destinataire: humain
---

# Synthèse — Étude des données de recherche et cascade de l'intention — 20260901h

**0. Synthèse d'ouverture.** Vos deux décisions du jour sont exécutées. L'étude a été entièrement rejouée sur votre intention validée : elle explique désormais les six familles de données de recherche, ce qu'on envoie et reçoit, les usages et l'intérêt de chacune à l'échelle réelle du site, compare dix outils avec leurs prix relevés ce jour, justifie chaque choix de périmètre avec son alternative écartée, et conclut par un escalier de budget conditionné aux résultats — de zéro euro aujourd'hui jusqu'au plafond que vous avez fixé. En parallèle, la règle de méthode est gravée dans la factory : loi transverse au noyau, référence dédiée, gabarit enrichi et contrôle exécuté — toute étude future sans intention citée ni test rétro sera refusée mécaniquement. Il vous reste à décider si l'on engage le premier palier payant, et à autoriser ou non le versionnage des travaux du jour.

## 1. En-tête

**Quoi** : exécution des décisions D-1 et D-2 (étude v2 + implémentation de la cascade). **Sur quoi** : pilot `digit-ai-factory` et Produit-02. **Quand** : fin le 2026-09-01 à 21:25 (+02:00), durée ≈ 30 min. **Qui** : Claude Fable 5, session VSCode, dépôt à `6d1cee5` (non committé).

## 2. Verdict en une ligne

Étude v2 rendue, PASS 10/10 à `oracle-etude-opportunite` v1.2.0 — dont E9 (règle « intention de l'utilisateur présente ») et E10 (règle « test rétro présent ») ; loi n° 7 au noyau, N1 (plafond de taille du noyau) PASS ; self-test de l'oracle 2/2 ; 4 événements journalisés, registre PASS.

## 3. Décisions attendues

Une seule décision reste ouverte. L'étude conclut à un escalier de paliers de dépense pour obtenir les données de recherche qui manquent au site : un socle gratuit (consoles des moteurs, fourchettes de volumes, audit des balises de langue), puis un palier payant à l'acte — l'achat de campagnes de volumes chez DataForSEO — dont l'entrée est un dépôt initial. Toute dépense étant un geste humain, l'engagement de ce palier vous revient ; le socle gratuit, lui, demande la création de comptes que seul le titulaire du site peut faire.

> **D-3 — Engage-t-on l'escalier : socle gratuit seul, ou socle gratuit plus le premier palier payant (dépôt de 50 $, plafond de perte) ?**
> L'étude retient le palier à l'acte (cf. étude v2, section 5 — source des montants) : quatre campagnes de volumes par an sur 8 combinaisons langue-pays, ≈ 0,72 $ la campagne, une photo de la concurrence par marché, le tout déclenché manuellement, secret sur le runner d'intégration continue seulement. Le dépôt de 50 $ ne périme pas et borne la perte maximale.
> **Recommandation : (a).** Source consultée : le verdict de l'étude v2 (`output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md`, section 5).
> Pourquoi : le coût réel est le dépôt, la donnée manquante bloque le plan de campagnes, et les tarifs relevés périment le 01/10.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** socle gratuit + dépôt 50 $ et première campagne | 50 $ une fois (plafond de perte) ; complexité simple × durée courte | rien — c'est le verdict de l'étude |
| **(b)** socle gratuit seulement d'abord | 0 € ; complexité simple × durée courte | les volumes précis par marché — le plan de campagnes reste en fourchettes |
| **(c)** ne rien engager | rien | toute donnée amont ; les tarifs périment le 01/10 et la section des coûts sera à rejouer |

> **Si rien n'est décidé** : (c) — rien ne s'engage, et la revue du 01/10 imposera de rejouer les relevés tarifaires avant tout achat.

## 4. Traité — avec sa preuve

- Étude v2 « données de recherche » écrite : six familles expliquées (donnée envoyée et reçue, usages, intérêt et non-intérêt à l'échelle mesurée du site), dix outils tarifés au 01/09, périmètres tranchés — 8 combinaisons langue-pays au lieu de « 6 marchés », profondeur top 20 avec photo top 100 unique, maille pays, 50-150 mots-clés par langue, cadence saisonnière —, verdict en escalier avec critères de passage mesurables ;
  - preuve : `oracle-etude-opportunite` v1.2.0 PASS 10/10 sur `output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md`, E9 et E10 compris.
- Cadrage v2 amendé : intention citée verbatim et validée, périmètre élargi au-delà de DataForSEO, budget en escalier ;
  - preuve : gate d'écriture C7 (contrôle qualité à l'écriture) PASS après correction, sur `output\03-etudes\20260901-etude-dataforseo-cadrage-v2.md`.
- Loi transverse n° 7 au noyau — « le résultat sert l'intention, pas la lettre » — et référence `references\INTENTION.md` v1.0.0 (doctrine complète : quatre niveaux, test rétro, portée tous types de demande) ;
  - preuve : `oracle-claude-md` — N1 PASS (noyau sous le plafond après quatre compressions), la nouvelle référence citée donc non orpheline.
- Section « Intention de l'utilisateur » et ligne « Test rétro » ajoutées au gabarit des études ; règles E9 et E10 ajoutées à l'oracle avec fixtures dans les deux sens ;
  - preuve : self-test `oracle-etude-opportunite` 2/2 PASS — la fixture verte passe, la rouge échoue sur E2, E8, E9 et E10.
- Registre TODO-FORGE : les deux entrées du jour passées `candidat → decide → en_cours` avec décideur humain et date de décision ;
  - preuve : `journaliser` PASS avant et après, 4 événements horodatés 2026-09-01T19:18:24Z ; vues régénérées, 31 actifs, sceau e14430aeb596.
- Mémoire persistante de l'agent mise à jour : la règle pointe vers la loi n° 7 et ses contrôles ;
  - preuve : écriture confirmée par l'outil — aucun oracle ne juge la mémoire, déclaré `non_juge`.

## 5. Non traité — avec son motif

- L'exécution du palier gratuit et la première campagne payante — motif : dépendance à une décision humaine (D-3), puis création de comptes et dépôt hors de portée de l'agent.
- La préparation opérationnelle chez le produit (jeu de mots-clés, script d'appel sur le runner) — motif : hors mandat, aucune écriture dans les dépôts frères sans run demandé au produit.
- Le commit git des travaux du jour — motif : bloqué par un garde-fou, le commit exige une autorisation humaine explicite (A-8).
- Les 6 références orphelines signalées par la règle N3 (fichier de `references\` non cité par le noyau) — motif : écarté, préexistantes au 01/09 et hors du périmètre des décisions du jour ; critère de réouverture : un prochain mandat d'entretien du noyau.

## 6. Écarts à la lettre

- Vous avez demandé « DataForSEO, mais pas que » → l'étude compare dix outils mais ne retient que DataForSEO au palier payant immédiat → parce que sous votre cible de budget mensuel, l'achat à l'acte est la seule voie payante existante (tableau 3.2 de l'étude) ; les suites d'abonnement entrent aux paliers supérieurs, avec leurs critères d'entrée.
- Les prix des outils concurrents viennent de sources secondaires datées de 2026, pas des grilles officielles des éditeurs → parce que ces grilles exigent souvent un compte ; l'étude l'assume et impose la confrontation à la grille officielle le jour de l'achat.

## 7. Risques

- Les tarifs relevés périment le 01/10 — un engagement décidé après cette date reposerait sur des prix morts ;
  - signal : la date du plan de revue ;
  - parade : rejouer la section 3.2 de l'étude avant tout achat (écrit dans son verdict).
- Le critère de passage vers le palier haut suppose d'attribuer les réservations au canal de recherche, et le site n'a pas de suivi de conversion câblé ;
  - signal : critère de passage inapplicable au moment de la revue de décembre ;
  - parade : traiter le suivi de conversion comme exigence produit lors d'un prochain run — nommé dans les modes d'échec de l'étude.

## 8. Prochaines actions

Ordre : A-5 d'abord — sans préparation rien ne se mesure ; A-6 et A-7 suivent la décision D-3 ; A-8 fige l'état du dépôt.

| Sélecteur | Action | Acteur | Motif / raison | Si rien n'est fait | Identifiant |
|---|---|---|---|---|---|
| **A-5** | Demander un run au produit pour préparer la campagne : jeu de 50-150 mots-clés par langue dérivé des 13 requêtes nommées, script d'appel sur le runner, ligne au référentiel tarifaire | auto_ia | dependance_bloc_3 (D-3), puis run produit à mandater | la première campagne s'improvisera hors doctrine le jour venu | TF-0741 |
| **A-6** | Si D-3 (a) ou (b) : activer Bing Webmaster Tools sur `https://www.bing.com/webmasters` (vérification DNS ou balise) et créer le compte Google Ads sans dépense sur `https://ads.google.com` pour Keyword Planner ; preuve : les deux consoles affichent le domaine vérifié | manuelle_utilisateur | acces — comptes au nom du titulaire ; trace mesurée : `Get-ChildItem env:` filtré sur BING/GOOGLE/ADS/DATAFORSEO rend 0 variable — aucun identifiant tiers en session, la tentative n'a aucun support | le socle gratuit reste théorique et l'escalier ne démarre pas | TF-0741 |
| **A-7** | Si D-3 (a) : créer le compte DataForSEO sur `https://app.dataforseo.com` et verser le dépôt minimal (carte bancaire) ; preuve : solde visible au tableau de bord | manuelle_utilisateur | depense — R-29, toute dépense est humaine | le palier à l'acte reste inaccessible ; relevés à rejouer après le 01/10 | TF-0741 |
| **A-8** | Autoriser ou refuser le commit git local des travaux du jour (noyau, référence, gabarit, oracle, études, registre) — répondre `A-8 : commit` ou `A-8 : non` dans le chat | manuelle_utilisateur | decision — geste à autorisation explicite | les travaux restent non versionnés, vulnérables à une écriture concurrente | neuve |

## 9. Traces

- `output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md` — l'étude v2 (PASS 10/10) ;
- `output\03-etudes\20260901-etude-dataforseo-cadrage-v2.md` — le cadrage amendé ;
- `CLAUDE.md` (loi n° 7) · `references\INTENTION.md` · `gabarits\ETUDE-OPPORTUNITE.md` · `oracles\oracle-etude-opportunite.mjs` (v1.2.0) ;
- `todo\TODO.jsonl` — 4 événements du 2026-09-01T19:18:24Z ; vues `todo\TODO.md` et `todo\TODO.html` ;
- sources tarifaires du 01/09 : https://www.demandsage.com/semrush-pricing/ · https://clarorank.com/ahrefs-pricing/ · https://propicked.com/marketing/se-ranking/pricing · https://getspike.ai/blog/mangools-pricing-plans-costs/ · https://costbench.com/software/web-scraping/serpapi/ · https://rankdots.com/blog/google-keyword-planner
