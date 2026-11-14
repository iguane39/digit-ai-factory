# Produit-85 — candidature : une décision ouverte se repose en entier, jamais en rappel d'une ligne

- **Demandeur** : Produit-85, ledger seq 117, 28/10/2026 20:43 (+01:00)
- **Destinataire** : digit-ai-factory (gabarit `gabarits/RESTITUTION.md`, `oracles/hook-restitution.mjs`)
- **Classe proposée** : `decision-rappelee-sans-ses-options` ; voisine : `regle-de-forme-primant-sur-la-demande` (TF-1851)

## RT-1 — Constat

Le 28/10/2026, la décision D-32 (fluidité de la visite 3D Bray) a été rappelée en une ligne dans 3 restitutions de suite (19:12, 19:25, 20:25). Le RAPPEL du hook v2.51.0 le prescrit : « Une décision déjà posée et inchangée se rappelle en une ligne ». Les options y tenaient en 4 à 6 mots, sans ce qui se passe, coût ni retour arrière. Les 3 restitutions ont été préjugées sans avertissement.

Retour humain, mot pour mot : « Je l'avais déjà remonté, si on me donne des choix sans me rappeler ceux-ci, je n'ai pas le contexte suffisant pour pouvoir décider et donc la demande n'est pas correctement posée et doit être revue dans sa forme, à remonter à la factory. »

TF-1851 n'a corrigé que le cas où l'humain demande le détail d'une décision. Le défaut de fond est la règle elle-même.

## Proposition

1. Retirer du gabarit et du RAPPEL du hook la phrase « Une décision déjà posée et inchangée se rappelle en une ligne ».
2. Toute D-N ouverte présente au bloc 3 ou au bloc 8 se repose en format B complet : citation (de quoi s'agit-il, problème, pourquoi vous, recommandation et source), tableau Option · Ce qui se passe · Coût · Retour arrière, ligne « Sans réponse ».
3. S4/S78 refusent une D-N ouverte présentée sans son tableau.

## Preuve du coût

1 retour humain récidivant ; 3 restitutions à reprendre ; décision D-32 non tranchée faute de contexte.

## RT-2 — Écart voisin relevé dans le même tour

S48 (`oracles/oracle-synthese.mjs`) n'accepte comme ligne de remontée que « rien à remonter », un lot « … - RETOURS - AAAAMMJJ<indice> » ou « reste au produit, parce que » : la candidature isolée « <projet> - CANDIDATURE - <objet> - AAAAMMJJ<indice> », prescrite par le `CLAUDE.md` des produits, y est refusée en avertissement. Proposition : S48 reconnaît aussi « - CANDIDATURE - \d{8}[a-z]+ ».
