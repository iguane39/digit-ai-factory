---
destinataire: humain
---

# Synthèse Étude — la relecture d'intention étendue à tous les travaux : deux points de relecture, environ 0,5 million de jetons par jour, un essai de 2 semaines pour mesurer (18/10/2026)

## 0. Synthèse d'ouverture

L'étude est reprise dans le sens que vous avez donné : la relecture d'intention vaut pour tous les travaux, pas seulement pour les études. La version 2 la place en deux endroits. Le premier est la consigne passée à un agent, comparée à votre demande avant qu'il travaille. Le second est la fin de chaque tour de travail, quel que soit le livrable, comparée à votre demande citée mot pour mot. Cela coûterait environ 0,5 million de jetons par jour pour l'activité actuelle, contre 1,4 million pour une relecture à chaque étape. La mesure n'existe que pour les études, où le relecteur voit 2 dérives sur 2 avec une consigne stricte. Pour les autres travaux, l'étude propose un essai de 2 semaines, en alerte et sans blocage, qui les mesure un par un. La décision posée tout à l'heure sur les seules études est donc remplacée par une nouvelle, D-23.

## 1. En-tête d'identification

Reprise de l'étude d'opportunité du relecteur d'intention, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 18/10/2026, de 09:22 à 09:35, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun agent délégué dans ce tour ; escalade de modèle : aucune.

Intention de la demande : décider, sur des chiffres, comment garder l'intention initiale d'une demande dans tous les travaux de la Factory, et non dans les seules études.

Test rétro : le résultat sert cette intention. Les 5 options couvrent tous les travaux, le coût de chacune est chiffré sur les volumes relevés ce jour, et la seule partie non mesurée, la détection hors études, devient l'objet de l'essai proposé.

## 2. Verdict en une ligne

Étude version 2 PASS sur les 10 contrôles de son gabarit ; 89 restitutions et 56 délégations relevées en 14 jours ; coût estimé de 0,5 million de jetons par jour pour l'option retenue, contre 1,4 million pour une relecture à chaque étape ; verdict O4 (relecture des consignes d'agents et de chaque fin de tour), en essai.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

**D-22** : relecture des seules études avant leur remise, posée le 18/10 à 09:20, sans objet depuis votre demande d'étendre la relecture à tous les travaux ; D-23 la remplace.

> **D-23 — Faut-il lancer un essai de 2 semaines de relecture d'intention sur tous les travaux, aux consignes d'agents et à chaque fin de tour ?**
>
> - **De quoi s'agit-il** : un agent vérificateur, distinct de l'auteur, relirait chaque consigne passée à un agent avant son travail, puis chaque fin de tour de travail, en comparant à votre demande mot pour mot. Ses écarts vous seraient posés comme questions, sans rien bloquer, et un relevé dirait, type de travail par type de travail, combien d'alertes vous confirmez.
> - **Le problème** : 6 dérives documentées sont toutes arrivées jusqu'à vous, dans des études, une présentation, une console, un tableau de bord et une cascade de produit. La relecture n'est mesurée que sur les études, et l'essai coûterait environ 0,5 million de jetons par jour.
> - **Pourquoi vous** : c'est une dépense d'appels de modèle sur 2 semaines, et une étape ajoutée à tous les travaux, chez les produits compris.
> - **Recommandation : (a)** — c'est la seule voie qui mesure les consignes d'agents et les restitutions sur le travail réel, et elle ne bloque rien. Source consultée : `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention-v2.md`, chapitres « Mesure » et 5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Essai de 2 semaines de l'option O4 sur tous les travaux, revue le 08/11 ; arrêt et question si le coût dépasse 1 million de jetons par jour | Chaque consigne d'agent et chaque fin de tour sont relues ; les écarts majeurs vous sont posés ; un relevé par type de travail prépare la revue | Moyen × court pour la mise en place, puis environ 0,5 million de jetons par jour | Possible : retirer la relecture rend l'état actuel |
| (b) Mesurer d'abord sur les 4 dérives des produits, en lecture seule, avant tout essai | 16 relectures au plus sur la présentation, la console, le tableau de bord et la cascade, et autant de travaux sains ; puis une nouvelle décision | Simple × court, environ 0,8 million de jetons en une fois | Possible, rien n'entre en service |
| (c) Ne rien lancer | La relecture reste à l'état d'étude | Nul ; une reprise chaque fois qu'une dérive passe | Sans objet |

> **Sans réponse** : (c), rien n'est lancé.

## 4. Traité

Chaque élément de la reprise, avec ce qui le prouve.

- **Version 2 de l'étude.** `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention-v2.md`, avec votre révision citée mot pour mot comme changement d'intention décidé. Preuve : `node oracles/oracle-etude-opportunite.mjs` rend PASS, après correction d'une ligne de coût que le contrôle E8 *(aucun effort chiffré en jours)* refusait.
- **Volume des travaux.** 89 restitutions de travail en 14 jours, sur le pilot et 4 produits du poste. Preuve : recherche des fichiers de synthèse modifiés depuis le 04/10.
- **Tours et délégations.** 319 tours en 14 jours, dont 260 chez les produits ; 56 appels d'agents. Preuve : `node scripts/relever-contexte-sessions.mjs --jours 14` et `node scripts/relever-flotte.mjs --jours 14`.
- **Intention écrite par l'auteur.** 71 restitutions sur 71 relues portent une intention et un test rétro au bloc 1. Preuve : lecture du bloc 1 de chaque fichier. C'est pourquoi la version 2 fait lire votre demande dans la transcription, et non dans la restitution.
- **Version 1 conservée.** `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention.md` reste telle qu'elle a été jugée ; la version 2 la cite et la remplace.

## 5. Non traité

- **La détection hors études.** Motif : les 24 relectures autorisées par D-21 en ont consommé 23 ; la mesurer est l'objet de D-23.
- **La mise en place de la relecture.** Motif : elle attend D-23.

## 6. Écarts à la lettre

Un écart, et il découle de la mesure.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Ne pas restreindre la lecture d'intention aux études, mais l'étendre à tous les travaux | Toutes les options couvrent tous les travaux, mais seules les études ont une mesure ; l'option retenue passe donc par un essai | Une détection non mesurée ne s'annonce pas comme acquise : l'essai la mesure type par type |

## 7. Risques

- **Le coût dépasse l'estimation.**
  - Énoncé : une relecture de code ou d'une page longue peut coûter plus que les 51 000 jetons mesurés sur des études.
  - Signal : plus de 1 million de jetons par jour au relevé de flotte.
  - Parade : l'option (a) s'arrête et vous pose la question à ce seuil.
- **Les alertes vous lassent.**
  - Énoncé : environ 6 restitutions et 4 consignes par jour relues ; à 1 alerte sur 5, cela ferait 2 questions de plus par jour.
  - Signal : des alertes écartées sans être lues.
  - Parade : un type dont vous confirmez moins d'une alerte sur 2 passe à l'accord de 2 relecteurs.

## 8. Prochaines actions

Ordre : le geste de l'IA d'abord, votre décision ensuite, parce que ce geste attend cette décision et se lit avec elle.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Déposer la candidature, puis mettre en place l'option choisie : relecture des consignes et des fins de tour pour (a), ou mesure sur les dérives des produits pour (b) | auto_ia | dependance_bloc_3 : attend D-23 | `node todo/journaliser.mjs --fichier <événements>` | Les travaux restent jugés par leur seul auteur |
| **A-2** | `neuve` | Trancher D-23 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `23a` | L'option (c) s'applique |

## 9. Traces

- Étude, version 2 : `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention-v2.md`
- Étude, version 1 : `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention.md`
- Données des 23 relectures : `output/03-etudes/20261018-mesure-relecteur-d-intention.json`
- Rien n'est enregistré ni poussé.
