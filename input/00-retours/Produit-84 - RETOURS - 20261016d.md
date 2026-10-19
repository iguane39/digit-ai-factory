# Retours forges — Produit-84 — 20261016d

- **Contexte** : autre — demande humaine hors run du 16/10/2026 : lire les emails d'un interlocuteur dans la messagerie Microsoft 365 du client, puis « intégrer cette compétence avec ce moyen de connexion, la méthode la plus automatisée possible et le moins d'actions manuelles possibles »
- **Références ledger** : `forge\ledger.jsonl` seq 11, 12 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 16/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre interrogé le 16/10/2026 : `grep -a -o -i -E '"id":"TF-[0-9]+","titre":"[^"]{0,200}(outlook|microsoft 365|messagerie|connecteur|mcp|oauth)' todo/TODO.jsonl` sur 4 618 lignes. Deux items trouvés et lus : TF-1161 (LinkedIn déclaré sans connecteur) et TF-1311 (8 autres réseaux sans connecteur). Ils fixent la forme d'une déclaration dans `references\INTEGRATIONS-FOURNISSEURS.md` ; aucun ne couvre Microsoft 365. RT-7 et RT-8 entrent comme neufs.

## digit-ai-factory (pilot)

Une demande humaine simple, lire des emails, a coûté 21 minutes : la session a essayé deux voies fermées avant la bonne. L'humain demande que la compétence entre à la factory, avec la voie la plus automatisée et le moins de gestes manuels possible.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-7 | majeur | générique | `references\INTEGRATIONS-FOURNISSEURS.md` ne déclare pas Microsoft 365. Voies essayées le 16/10 : (1) Outlook classique par COM, 7 refus `RPC_E_CALL_REJECTED` et fenêtre « Nouveau profil », car la messagerie vit dans le nouvel Outlook, non pilotable ; (2) Microsoft Graph par code d'appareil : `Connect-MgGraph -UseDeviceAuthentication` échoue dans l'hôte non interactif (« Une erreur s'est produite lors de l'écriture dans un écouteur »), puis le tenant du client rend « Approbation requise » ; (3) connecteur claude.ai Microsoft 365 : fonctionne. Coût : 21 minutes, 1 module PowerShell installé, 2 décisions posées à l'humain. Ledger seq 11 | Ajouter une section « Microsoft 365 » au document, avec ces trois faits mesurés et l'ordre des voies : connecteur claude.ai d'abord ; ni COM, ni Graph en ligne de commande chez un client dont le consentement est réservé à l'administrateur ; jamais d'identifiant d'une autre application Microsoft pour contourner ce consentement. Classe : `interface-tierce-ecrite-de-memoire` |
| RT-8 | majeur | générique | Aucune compétence ne lit la messagerie, l'agenda ou Teams de l'utilisateur. Mesures du 16/10 : les outils `mcp__claude_ai_Microsoft_365__*` sont absents de la session tant que le profil Claude Code est connecté à un autre compte Claude (ToolSearch : « No matching deferred tools found »), présents après `/login` ; `get_me`, `search_people`, `outlook_email_search` (`totalResultCount` 4) et `read_resource` jouent ensuite sans geste ; 2 corps d'email sur 3 dépassent la limite de sortie (78 744 et 137 372 caractères), arrivent dans un fichier et demandent un script d'extraction. Ledger seq 12 | Un skill de poste, par exemple `lis-la-messagerie`, qui enchaîne sans geste : (1) mesurer la présence des outils Microsoft 365 par ToolSearch ; absents, rendre un guide de deux gestes au plus (`/login` sur le compte Claude du connecteur, `/mcp`) ; (2) `get_me` pour vérifier le domaine du compte ; (3) `search_people` pour résoudre le nom en adresse ; (4) `outlook_email_search` par adresse, du plus récent au plus ancien, avec le total ; (5) `read_resource`, et pour un corps renvoyé en fichier, un script livré avec le skill (HTML retiré, coupe à `divRplyFwdMsg` et à `Signature`, sortie UTF-8). Écritures (envoi, suppression) hors du skill, sur demande expresse. Classe à créer, voir la dernière section |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le module `Microsoft.Graph.Authentication` 2.41.2, installé pour le compte Windows pendant l'essai de la voie Graph, reste sur le poste sans usage | Non corrigé : il se retire avec `Uninstall-Module Microsoft.Graph.Authentication` sur demande de l'humain | généralisable : non | Reste au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou, décrit par ses champs :

- **Client** : Client-A (pseudonymisé par le pilot à l'accueil).
- **Plateforme** : Microsoft Entra ID du client, consentement aux applications.
- **Mécanisme** : consentement des utilisateurs désactivé, approbation de l'administrateur requise.
- **Effet** : la page de connexion rend « Approbation requise » et propose une demande justifiée à l'administrateur.
- **Portée** : tout le tenant du client, pour toute application sans consentement déjà accordé.
- **Ce qu'il vise** : les applications qui demandent l'accès à la messagerie (`Mail.Read`) ou au profil.
- **Ce qu'il refuse** : « Microsoft Graph Command Line Tools » par code d'appareil, mesuré ; le connecteur claude.ai Microsoft 365 passe, mesuré.
- **Date du relevé** : 16/10/2026, capture fournie par l'humain.

## Confirmations positives

Le connecteur claude.ai Microsoft 365 a lu la boîte sans geste supplémentaire après `/login` : 4 emails trouvés, 3 lus en entier. Sa connexion à Microsoft ne dépend pas de l'adresse du compte Claude.

## Ordre recommandé

1. RT-7 : une section de document, qui évite dès demain les deux voies fermées.
2. RT-8 : le skill, qui s'appuie sur l'ordre des voies déclaré par RT-7.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-7** : la loi n° 5 demande d'énumérer les voies automatiques, mais aucun document ne dit dans quel ordre les essayer pour Microsoft 365, ni lesquelles sont fermées chez un client. Classe : `interface-tierce-ecrite-de-memoire`.
- **RT-8** : aucune règle ne demande qu'une compétence de poste exercée à la main (lire sa messagerie, son agenda) soit outillée, avec ses voies ordonnées et ses gestes humains comptés. Classe à créer : clé `competence-de-poste-sans-voie-outillee`, famille `skill-ou-oracle-non-invoque`, libellé « Une compétence demandée par l'humain, comme lire sa messagerie ou son agenda, n'a ni skill ni ordre de voies déclaré : la session essaie des voies fermées avant la bonne, et le geste humain restant n'est pas réduit à son minimum ».
