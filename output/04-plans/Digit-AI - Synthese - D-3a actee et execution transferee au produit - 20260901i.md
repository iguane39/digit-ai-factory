---
destinataire: humain
---

# Synthèse — Décision d'engagement actée, exécution transférée au produit — 20260901i

**0. Synthèse d'ouverture.** Vous avez raison : tout ce qui s'exécute — comptes, dépôt, choix des mots-clés, script de relevé, référentiel de prix — appartient au produit et vivra dans sa propre session ; la factory, elle, a fini sa part avec l'étude, la règle de méthode et l'arbitrage de la dépense. Votre décision d'engager l'escalier est consignée au registre avec ce partage des rôles, et les apports de nos échanges du soir y sont attachés pour que le futur chantier ne reparte pas de zéro. Ce qui est attendu de vous : ouvrir la session du produit avec le point d'entrée fourni au tableau des actions, et y jouer la création des comptes et le dépôt.

## 1. En-tête

**Quoi** : consignation de la décision D-3 (a) et recadrage du partage pilot/produit. **Sur quoi** : pilot `digit-ai-factory`, exécution transférée à Produit-02. **Quand** : fin le 2026-09-01 à 22:31 (+02:00), durée ≈ 3 min. **Qui** : Claude Fable 5, session VSCode, dépôt à `6d1cee5` (non committé).

## 2. Verdict en une ligne

1 événement journalisé au registre (`journaliser` PASS avant et après), vues régénérées (31 actifs, sceau 1562f4886ce9) ; part factory close, exécution au produit.

## 3. Décisions attendues

Rien n'attend de décision : D-3 est tranchée (« 3a ») et votre recadrage du soir est acté tel quel.

## 4. Traité — avec sa preuve

- Décision D-3 (a) consignée au registre, avec le recadrage cité mot pour mot et le transfert d'exécution au produit — y compris les trois apports de la session (exploration large puis resserrage, calendrier événementiel + Google Trends gratuit, doctrine « l'intention de la requête prime le prix du clic ») ;
  - preuve : `journaliser` PASS, événement horodaté 2026-09-01T20:29:50Z ; vues régénérées, sceau 1562f4886ce9.

## 5. Non traité — avec son motif

- Le dossier de première campagne que j'allais rédiger côté pilot — motif : écarté sur votre recadrage, c'est le run produit qui le produira chez lui ; critère de réouverture : aucun, le transfert est le bon état.
- L'enrichissement de l'étude v2 avec les explications du soir — motif : dépendance à une décision humaine, l'offre d'intégration reste ouverte mais rien ne bloque sans elle (les apports voyagent déjà par le registre).
- Le commit git des travaux du jour — motif : bloqué par un garde-fou, l'autorisation explicite n'a pas été donnée (action A-8, toujours ouverte).

## 6. Écarts à la lettre

- Vous avez répondu « 3a » → je n'ai PAS exécuté l'action A-5 telle qu'annoncée (préparer la campagne depuis le pilot) → parce que votre message suivant a recadré le périmètre : les produits sont autonomes, le pilot n'écrit pas chez eux, et la préparation appartient au run produit. À la place, la décision et le transfert sont consignés.

## 7. Risques

- La session produit pourrait s'ouvrir sans lire l'étude et réinventer le chantier ;
  - signal : un run produit qui repart sur DataForSEO sans citer l'étude ni la décision du 01/09 ;
  - parade : le point d'entrée fourni en A-9 cite l'étude comme donnée d'entrée, et l'entrée de registre porte les apports à reprendre.

## 8. Prochaines actions

Ordre : A-9 d'abord — tout le reste se joue dans la session qu'elle ouvre.

| Sélecteur | Action | Acteur | Motif / raison | Si rien n'est fait | Identifiant |
|---|---|---|---|---|---|
| **A-9** | Ouvrir la session du produit et lancer le run avec ce prompt : `Run de mise en œuvre — première campagne de données de recherche. Lire comme donnée l'étude de la factory : digit-ai-factory\output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md. Décision D-3 (a) du 01/09 : socle gratuit, dépôt, première campagne explorer-large (jusqu'à 1000 mots-clés par marché, 8 combinaisons langue-pays) puis resserrage 50-150 par langue. Reprendre les apports du 01/09 consignés au registre de la factory (TF-0741).` | manuelle_utilisateur | decision — mandater un run chez un produit autonome est un arbitrage humain (garde-fou « produits autonomes ») | l'escalier décidé reste sans chantier ; les tarifs relevés périment le 01/10 | TF-0741 |
| **A-6** | Pendant ce run produit : activer Bing Webmaster Tools sur `https://www.bing.com/webmasters` et créer le compte Google Ads sans dépense sur `https://ads.google.com` ; preuve : les deux consoles affichent le domaine vérifié | manuelle_utilisateur | acces — comptes au nom du titulaire ; trace mesurée : `Get-ChildItem env:` filtré sur BING/GOOGLE/ADS/DATAFORSEO rend 0 variable, aucun identifiant tiers en session | le socle gratuit reste théorique | TF-0741 |
| **A-7** | Pendant ce run produit : créer le compte DataForSEO sur `https://app.dataforseo.com` et verser le dépôt minimal ; preuve : solde visible au tableau de bord | manuelle_utilisateur | depense — R-29, toute dépense est humaine | le palier à l'acte reste inaccessible ; relevés à rejouer après le 01/10 | TF-0741 |
| **A-8** | Autoriser ou refuser le commit git local des travaux du jour côté factory — répondre `A-8 : commit` ou `A-8 : non` dans le chat | manuelle_utilisateur | decision — geste à autorisation explicite | les travaux restent non versionnés, vulnérables à une écriture concurrente | neuve |

## 9. Traces

- `todo\TODO.jsonl` — événement TF-0741 du 2026-09-01T20:29:50Z ; vues `todo\TODO.md` et `todo\TODO.html` (sceau 1562f4886ce9) ;
- `output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md` — l'étude, donnée d'entrée du run produit ;
- synthèse jugée : `output\04-plans\Digit-AI - Synthese - D-3a actee et execution transferee au produit - 20260901i.md`.
