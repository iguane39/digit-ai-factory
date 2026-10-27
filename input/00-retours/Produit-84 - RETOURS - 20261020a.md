# Retours forges — Produit-84 — 20261020a

- **Contexte** : autre — travail hors run du 20/10/2026 : revue L99 d'un prompt, exécution du prompt réécrit en proposition de sécurité, version b de la proposition
- **Références ledger** : `forge\ledger.jsonl` seq 40, 42, 48 et 53 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 20/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil. RT-21 à RT-23 entrent comme neufs. RT-23 est une demande explicite de l'utilisateur, qui demande qu'elle s'applique à toutes les restitutions qui livrent un fichier.

## digit-ai-factory

3 règles de la doctrine qui ne se rencontrent pas, ou se contredisent, au moment de restituer ou d'écrire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-23 | majeur | générique | Restitution du 20/10/2026 de la proposition `output\04-cadrages\Produit-84 - Proposition - Proteger sans contraindre - 20261020b.md` : le lien du livrable n'apparaît qu'au bloc 9, sous un nom court. `hook-restitution --prejuger` : affichable, aucun bloquant. L'utilisateur, capture à l'appui : « Lorsqu'un livrable est construit en sortie de prompt, ajoute le lien vers le livrable créé, avec son chemin complet à la fin du chapitre 0 pour qu'il soit visible directement de l'utilisateur. Remonte cette règle à la Factory pour qu'elle soit appliquée dans tous les prompts de sortie qui ont construit un livrable. » Ledger seq 53 | Dans `gabarits\RESTITUTION.md`, bloc 0 : tout tour qui a écrit un livrable sous `output\` finit le bloc 0 par une ligne par livrable, le lien cliquable et le chemin absolu complet. Contrôle de l'oracle-synthese : un chemin `output\` cité au bloc 4 ou 9 doit figurer aussi, en chemin absolu, dans la dernière ligne du bloc 0. Le gabarit des prompts réécrits (skill `prompt-analyzer-l99`) ajoute la même exigence au rapport final de l'exécutant |
| RT-22 | mineur | générique | Le prompt `output\03-prompts\Produit-84 - Prompt - Proteger sans contraindre - 20261020b.md` impose le titre exact « Ce que la proposition ne protège pas » (clause 7 de son contrat). `oracle-ecriture.mjs` le refuse en tête de titre comme annonce nominalisée (EC-8). L'exécutant l'a numéroté « 8. Ce que… » pour passer, ce qui contourne la règle sans en lever la raison. Ledger seq 48 | Exempter d'EC-8 un titre de section que le contrat de sortie du prompt impose mot pour mot, ou publier au lexique une formulation de remplacement (« Limites de la proposition ») que les prompts réécrits emploient |
| RT-21 | mineur | générique | 3 fichiers de `output\03-prompts\` portent le type « Analyse » (16/10 et 19/10/2026). `registre-types.json` de forge-organization, relu le 20/10/2026 : 36 types, ni « Analyse » ni alias. Le skill `prompt-analyzer-l99` ne prescrit pas de type, et rien ne l'a signalé à l'écriture. Ledger seq 40, corrigé en seq 42 | Faire prescrire par `prompt-analyzer-l99` le type « Revue » (au registre) pour une analyse de prompt, et faire contrôler le type R-25 par le hook `ecriture` à l'écriture d'un `.md` sous `output\` |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Lien du livrable absent du bloc 0 | restitution suivante corrigée ; règle gardée en mémoire du produit | oui, par RT-23 | Remonté en RT-23 |
| Script de vérification des clauses plus strict que le contrat : numérotation consécutive exigée, indice précédent cherché hors de `old\` | script corrigé ; rouge → vert sur la version b | non, script propre au livrable | Corrigé sur place |
| Nouvelle analyse de prompt à nommer | nommée « Revue » ; historiques non renommés (R-4) | oui, par RT-21 | Remonté en RT-21 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot.

## Documents mûrs

- « Etude comparative - Pages Supabase ou Azure » (5 versions datées) : reste au produit, parce que sa forme est celle d'une page HTML de données du socle, sans famille de document nouvelle ; ses reprises portaient sur le contenu, déjà remontées en RT-15 à RT-20 du lot 20261019e.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

L'exécution du prompt réécrit par un agent sans la conversation a produit une proposition qui part des risques, sans reprendre la solution que l'utilisateur avait écartée. Le contrat de sortie à 10 clauses, dont 7 vérifiées par script, a tenu sur deux versions.

## Ordre recommandé

1. RT-23 : demande explicite de l'utilisateur, visible à chaque restitution.
2. RT-22 : conflit entre un contrat de prompt et un oracle du socle.
3. RT-21.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-23** : le bloc 0 ne demande pas le chemin du livrable. Classe à créer : clé `livrable-absent-du-bloc-0`, famille `restitution`, libellé « Le livrable construit n'est ni lié ni nommé par son chemin complet en fin de synthèse d'ouverture ».
- **RT-22** : EC-8 ne connaît pas les titres imposés par contrat. Classe à créer : clé `titre-impose-refuse-par-oracle`, famille `hook-ou-gate`, libellé « Un titre exigé mot pour mot par un contrat de sortie est refusé par l'oracle d'écriture ».
- **RT-21** : le type R-25 n'est pas contrôlé à l'écriture. Classe à créer : clé `type-livrable-hors-registre`, famille `hook-ou-gate`, libellé « Un livrable porte un type absent du registre des types, sans signal à l'écriture ».
