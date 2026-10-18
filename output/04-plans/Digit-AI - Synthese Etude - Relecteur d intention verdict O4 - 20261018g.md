---
destinataire: humain
---

# Synthèse Étude — un relecteur d'intention voit les dérives à condition d'avoir une consigne stricte ; verdict O4, une relecture avant chaque étude (18/10/2026)

## 0. Synthèse d'ouverture

L'étude que vous avez lancée par « 21a » est faite, et sa réponse est oui, mais pas comme on l'attendait. Un relecteur tiers n'a vu qu'une des 2 dérives d'intention connues tant qu'il pouvait excuser une restriction annoncée par l'auteur, ou validée par vous en bloc. Avec une consigne stricte, il les voit toutes les deux, dans 4 relectures sur 4. Il ne signale qu'une étude sur les 5 que vous aviez acceptées, et cette alerte se discute. Chaque relecture coûte environ 51 000 jetons et 7 secondes. Le placement « à chaque étape » n'a pas pu être mesuré. L'étude recommande donc de commencer là où la mesure existe : une relecture stricte avant la remise de chaque étude d'opportunité. Ses écarts vous seraient posés comme questions, sans rien bloquer. Une décision vous revient, D-22.

## 1. En-tête d'identification

Exécution de D-21 (a) du 18/10/2026 : étude d'opportunité sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 18/10/2026, de 08:59 à 09:20, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5. 25 agents délégués : 23 `verificateur` (Claude Sonnet 5.5, effort medium) pour les relectures, et 2 `explorateur` (Claude Haiku 5.5, effort medium) pour le corpus. Escalade de modèle : aucune.

Intention de la demande : pouvoir décider, sur des chiffres et pas sur une opinion, s'il faut un relecteur tiers qui garde l'intention initiale d'une demande, et où le placer.

Test rétro : le résultat sert cette intention, avec une limite dite. La réponse est chiffrée pour le placement « à la fin d'une étude ». Les placements « aux jalons » et « à chaque étape » restent non mesurés, et le corpus ne compte que 2 dérives au lieu des 4 exigées.

## 2. Verdict en une ligne

Étude PASS sur les 10 contrôles de son gabarit, de E1 (sections présentes) à E10 (test rétro écrit) ; consigne stricte : 2 dérives sur 2 vues, 1 fausse alerte discutable sur 5 ; consigne souple : 1 sur 4 relectures ; 23 relectures sur 24 permises, 1 196 357 jetons ; verdict O4 (relecture stricte avant chaque étude).

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-22 — Faut-il ajouter une relecture d'intention stricte avant la remise de chaque étude d'opportunité ?**
>
> - **De quoi s'agit-il** : un agent vérificateur, distinct de l'auteur, relirait chaque étude avant qu'elle vous soit remise. Il se demanderait si vous obtenez ce que vous demandiez, sans excuser une restriction que l'auteur annonce ou dit avoir fait valider. Ses écarts majeurs apparaîtraient dans la synthèse comme questions à trancher.
> - **Le problème** : aujourd'hui, l'auteur juge lui-même que son étude sert votre demande. Les 2 dérives du corpus sont passées ainsi, et c'est vous qui les avez trouvées, au prix d'une étude refaite et d'un complément.
> - **Pourquoi vous** : c'est une étape ajoutée à chaque étude, qui dépense des appels de modèle et vous posera des questions de plus.
> - **Recommandation : (a)** — c'est la seule option mesurée sur toute sa portée : 2 dérives vues sur 2, 1 alerte discutable sur 5 ; l'option (b) s'étend à des livrables jamais mesurés. Source consultée : `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention.md`, section « Mesure », et ses données `output/03-etudes/20261018-mesure-relecteur-d-intention.json`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) La relecture stricte avant chaque étude (O4), revue le 15/11 | Chaque étude reçoit une section « Points à confirmer » quand le relecteur trouve un écart majeur ; rien n'est bloqué | Simple × court ; environ 51 000 jetons et 7 s par étude | Possible : retirer l'étape du gabarit |
| (b) La relecture stricte à la fin de tout livrable : études, restitutions, lots (O1) | La même relecture s'applique partout, sans mesure hors des études | Moyen × court ; environ 51 000 jetons par livrable, soit un million par jour à 20 livrables | Possible |
| (c) Ne rien ajouter | L'auteur reste seul juge de son test rétro | Nul ; une reprise quand une dérive passe | Sans objet |

> **Sans réponse** : (c), rien n'est ajouté.

## 4. Traité

Chaque élément de l'étude, avec ce qui le prouve.

- **Étude au gabarit.** `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention.md`. Preuve : `node oracles/oracle-etude-opportunite.mjs` rend PASS.
- **Corpus.** 2 dérives mesurables (DataForSEO du 01/09, réseaux sociaux du 17/09) et 5 études acceptées sur décision directe. Preuve : deux relevés de l'explorateur, chaque pièce sourcée par fichier et ligne ; les 3 autres dérives sont écartées, avec leur motif.
- **23 relectures.** Variantes aveugle et avec traces, consignes souple et stricte, cas sous numéros neutres. Preuve : verdicts consignés dans `output/03-etudes/20261018-mesure-relecteur-d-intention.json`.
- **Coût recompté à la source.** 23 relectures servies par Sonnet 5.5 à l'effort medium ; 51 322 jetons en médiane, 1 196 357 au total, 6,7 s en médiane. Preuve : transcriptions des sous-agents, une réponse comptée sur sa dernière ligne.
- **Citation vérifiée.** Un relecteur disait que l'étude réseaux sociaux portait un test rétro complet. Vérifié à la source : sa section 5.4 conclut « Sans rupture » à chaque élément rejoué, alors que vous avez ensuite contesté son périmètre.

## 5. Non traité

- **Les placements « aux jalons » et « à chaque étape ».** Motif : aucun état intermédiaire n'est archivé avec sa demande ; le relevé de flotte et les rapports d'agents le permettront.
- **Le dépôt de la candidature.** Motif : l'étude recommande, et la candidature attend D-22.
- **La version de Haiku servie à l'explorateur.** Claude Haiku 5.5 a répondu, alors que le référentiel des modèles nomme Haiku 4.5. Motif : le contrôle des modèles la signalera à la prochaine ouverture ; c'est le déclencheur prévu pour mettre à jour le référentiel.

## 6. Écarts à la lettre

Quatre écarts entre le prompt que vous avez validé et ce qui a été fait.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Au moins 4 dérives au corpus | 2 dérives, déclarées comme corpus incomplet | Les autres n'ont pas leur demande ou leur livrable dans le pilot |
| Comparer un relecteur aveugle et un relecteur avec traces | J'ai ajouté une 2e consigne, stricte, sur 9 des relectures | Les 14 premières montraient que la consigne excusait les restrictions annoncées ; c'était la variable décisive |
| Le prompt « se lance dans une session neuve » | Je l'ai lancé dans cette session | Pour enchaîner sur votre réponse ; le travail lourd a été délégué à 25 agents neufs |
| Un plan de revue daté | Le 15/11/2026, ou après 5 études relues | La revue porte sur des études réelles, pas sur une date seule |

## 7. Risques

- **Les alertes vous lassent.**
  - Énoncé : 1 étude acceptée sur 5 a reçu une alerte ; à ce taux, vous recevriez une question de plus toutes les 5 études.
  - Signal : des alertes que vous écartez sans les lire.
  - Parade : la revue du 15/11 mesure la part d'alertes que vous confirmez ; sous 1 sur 2, la consigne se revoit.
- **Une intention jamais écrite échappe au relecteur.**
  - Énoncé : sur DataForSEO, le relecteur a signalé des questions mal traitées, pas l'absence d'explication que vous aviez reprochée.
  - Signal : une étude reprise sans alerte préalable.
  - Parade : la validation de l'intention en amont (ISTO), qui existe déjà.

## 8. Prochaines actions

Ordre : le geste de l'IA d'abord, votre décision ensuite, parce que ce geste attend cette décision et se lit avec elle.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Déposer la candidature, ajouter l'étape au gabarit d'étude et la consigne stricte figée | auto_ia | dependance_bloc_3 : attend D-22 | `node todo/journaliser.mjs --fichier <événements>`, puis modification de `gabarits/ETUDE-OPPORTUNITE.md` | Les études restent jugées par leur seul auteur |
| **A-2** | `neuve` | Trancher D-22 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `22a` | L'option (c) s'applique |

## 9. Traces

- Étude : `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention.md`
- Données de mesure : `output/03-etudes/20261018-mesure-relecteur-d-intention.json`
- Analyse L99 (l'analyse en 8 couches du prompt) d'origine : `output/03-etudes/20261018-L99-relecteur-critique-d-intention.md`
- Rien n'est enregistré ni poussé.
