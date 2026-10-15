---
destinataire: humain
---

# Synthèse Mandat — retours du 14/10 traités, deux vagues de corrections publiées, produits servis (15/10/2026)

## 0. Synthèse d'ouverture

Les retours arrivés hier sont tous entrés au registre et tous traités, sauf un, qui attend votre choix. Les corrections sont publiées dans le pilot et dans 2 forges, et les outils à jour sont en service sur ce poste. Les produits présents ont reçu leur lot de travaux. Trois questions de règle vous reviennent ci-dessous. Elles ne bloquent rien, et la recommandation est donnée pour chacune.

## 1. En-tête d'identification

Synthèse de clôture de la campagne « Traite tous les TODOs & retours », complétée par votre réponse « A1 & A2 ». Elle porte sur le pilot digit-ai-factory, la forge des outils, forge-organization, le canal confidentiel et les produits de ce poste. Période : 15/10/2026 de 08:27 à 12:14, heure de Paris (UTC+02:00), soit 3 h 47. Session pilote Claude Opus 5.5 ; sept agents Opus 5.5 à l'effort high et un agent Sonnet 5.5.

Intention de la demande : qu'il ne reste aucun travail remonté sans traitement. Les retours des produits entrent au registre, les défauts sont corrigés à la racine, et la correction atteint les produits.

Test rétro : le résultat sert cette intention, et pas seulement sa lettre. Les restes que les agents ont trouvés en corrigeant ont eux aussi été traités dans une seconde vague. Les corrections sont publiées, et les skills propagés sur le poste. Seul reste ouvert ce qui dépend de vous ou d'un produit absent.

## 2. Verdict en une ligne

42 sujets clos sur 43 (dont 1 écarté par sa règle), 13 lots ingérés, 4 dépôts publiés à 0 commit d'écart, 19 lots de travaux déposés ; recette complète du pilot : 217 sur 218, la 218e verte rejouée seule (29/29).

## 3. Décisions attendues

Trois questions de doctrine sont nées de la campagne. Aucune ne bloque un produit : tout ce qui pouvait s'exécuter l'a été, et chaque option par défaut laisse le parc dans un état sûr. Je les classe par coût du statu quo.

> **D-1 — Le skill d'itération doit-il être versionné dans la forge des outils ?**
>
> Le skill `la-boucle` sert à faire progresser un livrable par cycles. Il n'existe que dans votre synchronisation claude.ai, et aucune forge ne le porte. La correction qui lui ajoute la méthode d'amélioration décidée aujourd'hui est prête et testée hors dépôt. Elle passe son contrôle, sur lequel la version actuelle échoue 7 fois. Je ne l'ai pas versée au dépôt public sans vous.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, classe `capacite-hors-versionnement-de-forge`. Une capacité qu'aucune forge ne versionne ne reçoit aucune correction de campagne, et ce sujet en est l'exemple.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Verser le skill dans la forge des outils, appliquer la correction, propager | Faible × court : un commit, une recette, une propagation | Son contenu devient public, comme les autres skills de la forge |
| (b) Le garder dans claude.ai et y importer la correction prête | Faible × court, geste humain. Comment faire : 1) ouvrir claude.ai, Réglages, Capacités, Skills ; 2) remplacer le skill par le dossier `tf1728\la-boucle` du répertoire temporaire de session | Aucune campagne future ne le corrigera |
| (c) Ne rien changer | Nul | La règle d'amélioration reste absente de l'outil qui itère |

> **Si rien n'est décidé** : (c), le sujet reste ouvert au registre avec sa correction prête.

> **D-2 — La garde d'identité sortante doit-elle devenir exigée chez tous les produits ?**
>
> La garde `oracles/hook-identite-sortante.mjs` bloque l'envoi de votre adresse électronique vers un service tiers. Elle est câblée au pilot et dans le gabarit des nouveaux produits. L'exiger dans l'héritage ferait déclarer non conformes les produits existants jusqu'à leur prochaine remise à niveau, faite à leur ouverture. Ce choix change la doctrine d'héritage.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md`, R-62. L'incident du 14/10 s'est produit chez un produit existant, que le seul gabarit ne protège pas.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Exiger le câblage dans l'héritage (version suivante) | Faible × court pour le pilot ; chaque produit le reçoit à son ouverture | Signal non conforme temporaire chez les produits non rouverts |
| (b) Le laisser au gabarit des nouveaux produits | Nul | Les produits existants restent sans garde |

> **Si rien n'est décidé** : (b), la garde reste câblée au pilot et chez les nouveaux produits seulement.

> **D-3 — La règle de nommage doit-elle garder sa tolérance pour les types du catalogue ?**
>
> La règle de nommage des livrables, jouée par `oracle-conformite-projet`, refusait les noms que les gabarits de documents eux-mêmes prescrivent. Un agent l'a assouplie : un nom au type d'une famille du catalogue passe désormais en avertissement. J'ai aussi ajouté le type « Fiche » au registre d'organization. La dette restante est mesurée : 27 familles sur 45.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md`, règle 25 et son alinéa du 15/10. La tolérance supprime une contradiction entre 2 règles du socle, et le nouveau contrôle de dette empêche qu'elle s'oublie.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Garder l'alinéa en avertissement, et réduire la dette au fil de l'eau | Nul | Un nom au type du catalogue passe tant que le registre ne l'a pas admis |
| (b) Revenir au refus et inscrire d'un coup les 31 mots de tête au registre d'organization | Moyen × moyen : 31 entrées motivées | Le registre grossit de types peu employés |

> **Si rien n'est décidé** : (a), l'alinéa reste en place.

## 4. Traité

- **Retours entrés au registre.** `accueillir-lot` rend « 22 lot(s) accueilli(s), 0 refusé(s) », et 13 lots donnent 27 candidatures. Les noms de 2 produits neufs ont été inscrits sans voisin dans la table de 82 entrées. Leurs dépôts sont privés (`gh repo view` rend PRIVATE).
- **Première vague : 30 sujets clos.**
  - Pilot, chantier C, 7 sujets : installer-projet 27/27, ouvrir-run 10/10, accueil 10/10.
  - Pilot, chantier B, 6 sujets : conformité fusionnée 171/171, nouvel oracle de fiche produit 21/21.
  - Pilot, chantier D, 7 sujets : oracle-synthese 169/169, hook-restitution 49/49, garde d'identité sortante 8/8.
  - Forge des outils, 6 sujets : quality-oracles 498, puis 521 après la seconde vague ; socle de pages HTML 587/587.
  - Garde-fous Railway, 2 sujets : recette 15/15. Les deux échéances du jour sont tranchées par leur règle : 68,4 % de PASS contre 95 % exigés, et 0 retour sur 130 lots.
- **Seconde vague : 12 sujets clos sur 13.** Ce sont les restes trouvés par les agents et les 4 défauts antérieurs de la recette complète.
  - Pilot, chantier E, 7 sujets : gabarits de documents 55/55, et exit 0 sur le parc ; ouvrir-run 11/11 ; compte des produits 5/5 ; contrôle des livrables scellés repassé à exit 0.
  - Forge des outils, 4 sujets : forge-agents 73/73, quality-oracles 521.
  - Forge-organization, 1 sujet : « fraîcheur A0 » passe d'ECHEC à ok.
- **Classes de défaut.** 10 classes créées, référentiel 1.35.0. `oracle-todo` rend PASS.
- **Publication.** Pilot (46 commits), forge des outils (10), forge-organization (2) et canal confidentiel (1) sont envoyés. Après `git fetch`, `git rev-list --left-right --count HEAD...origin/main` rend 0 et 0 sur les 4 dépôts.
- **Skills en service.** `oracle-skills` passe de FAIL (K2) à PASS après propagation.
- **Produits servis.** `emettre-travaux --tous` rend « 19 lot(s) déposé(s), 4 déjà présent(s), 0 refusé(s) avant dépôt ». Aucun commit n'a été fait chez un produit.
- **Recette complète finale.** 217 recettes sur 218 sont vertes, et toutes les 204 recettes vertes jouent leur cas rouge. La 218e, la recette du hook d'ouverture, passe 29/29 rejouée seule.

## 5. Non traité

- **TF-1728, skill d'itération.** Motif : il attend la décision D-1.
- **TF-1630.** Motif : le produit visé est absent du parc de ce poste, et aucun lot ne peut l'atteindre.
- **Sujets qui attendent un produit ou une échéance.** Motif : attente déclarée au registre, champ `attente`.
- **Décisions posées lors des sessions précédentes.** Motif : décision humaine, inchangée par cette campagne. Les sujets sont TF-0963, TF-1160, TF-1212, TF-1319, TF-1323, TF-1396, TF-1432, TF-1540, TF-1552 et TF-1584.
- **Les 3 nouvelles règles de restitution restent avertissantes.** Motif : les rendre bloquantes est une décision à prendre une fois le corpus propre, et c'est la doctrine de toute règle neuve.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Traiter tous les TODOs et retours | J'ai aussi inscrit puis traité 13 restes trouvés en corrigeant | Un reste laissé en candidat repousse le travail à la prochaine campagne |
| Traiter tous les TODOs et retours | 1 sujet écarté et 1 sujet clos à leur échéance, par leur règle déjà décidée | La règle tranchait ; la mesure du jour a été rejouée avant |
| Traiter les retours | J'ai inscrit moi-même 2 noms de produits neufs à la table | L'accueil les refusait à tort, défaut corrigé ensuite (TF-1721) |
| A-2 : publier | Le skill d'itération n'est pas versé au dépôt public | Il appartient à votre synchronisation claude.ai : c'est D-1 |

## 7. Risques

- **Noms réels écrits dans le registre public.**
  - Énoncé : un motif rédigé à la main a porté des noms réels de produits.
  - Signal : `git diff` sur le registre, avant chaque commit.
  - Parade : corrigé avant tout commit, aucune occurrence publiée. Les motifs suivants ont été écrits en pseudonymes.
- **Recettes perturbées par la charge.**
  - Énoncé : avec plusieurs agents en parallèle, la recette complète a vu 2 recettes échouer puis passer seules.
  - Signal : un défaut qui disparaît au rejeu isolé.
  - Parade : chaque défaut rejoué seul avant d'être compté, et la recette finale jouée sans agent actif.
- **Héritage 1.21.0 chez les produits.**
  - Énoncé : les produits reçoivent 2 évolutions d'héritage à leur prochaine ouverture.
  - Signal : le relevé d'héritage de la prochaine ouverture.
  - Parade : la remise à niveau se fait seule à l'ouverture, et le relevé nomme chaque manque.

## 8. Prochaines actions

Les décisions viennent d'abord, parce que TF-1728 en dépend. Le nettoyage vient ensuite, parce que rien n'en dépend.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1728 | Appliquer la voie choisie en D-1 pour le skill d'itération, puis clore | auto_ia | dependance_bloc_3 : attend D-1 | `node .claude\skills\quality-oracles\scripts\self-test.mjs` | La règle d'amélioration reste hors de l'outil qui itère |
| **A-2** | TF-1716 | Appliquer la voie choisie en D-2 à l'héritage des produits | auto_ia | dependance_bloc_3 : attend D-2 | `node scripts/relever-heritage.mjs` | Les produits existants restent sans garde |
| **A-3** | `neuve` | Trancher D-1, D-2 et D-3 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a), D-2 (a), D-3 (a)` | Les options par défaut s'appliquent |
| **A-4** | `neuve` | Effacer l'archive du correctif du 13/10, déjà appliqué | manuelle_utilisateur | irreversible | `Remove-Item "input\Digit-AI - Correctif Factory - Ouverture de session sous le delai client - 20261013b.zip"` | Un fichier non suivi reste dans l'état du dépôt |

## 9. Traces

- `todo/TODO.jsonl` et `todo/CLASSES.json` (1.35.0)
- `references/GARDE-FOUS-PLATEFORME.json` (1.1.0)
- Pilot : de c28ac2a6 à 5e883f92, publiés
- Forge des outils : de 0af0510 à cfb768f, publiés
- Forge-organization : 6e96a57 et b0ecaf5, publiés
- Canal confidentiel : c57041f, publié
- Lots déposés : `input\00-travaux\` chez 19 produits
