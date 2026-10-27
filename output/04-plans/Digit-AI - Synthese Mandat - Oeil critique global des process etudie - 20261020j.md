---
destinataire: humain
---

# Synthèse Mandat — l'œil critique global des process est étudié : 10 périmètres, 7 leviers, 12 scénarios mesurés (20/10/2026)

## 0. Synthèse d'ouverture

L'étude regarde enfin la Factory entière, et le constat est net : elle corrige vite, mais surtout elle-même, et elle ne retire presque rien. En 30 jours, 605 défauts ont été corrigés, en 6 heures en médiane. Mais 44 % d'entre eux portaient sur ses propres contrôles. Pour 14 lignes ajoutées, 1 seule a été retirée. Environ un message sur 5 que vous écrivez revient corriger ce qui vous a été rendu, et 12 décisions par jour vous arrivent. L'étude décrit l'œil critique : des relevés automatiques chaque semaine, un jugement chaque mois, avec le droit de proposer des suppressions. Elle propose 12 scénarios, classés et appuyés sur une trace. Une décision vous revient, D-60 : mettre l'œil critique en service et lancer les 3 premiers scénarios.

## 1. En-tête d'identification

Exécution du prompt réécrit de l'analyse L99 (`output/03-etudes/20261020-L99-oeil-critique-global-des-process.md`, chapitre 8), sur votre réponse « exécute le prompt », lue comme D-59 (a) avec ses 5 écarts acceptés. Pilot digit-ai-factory, poste Dell-XPS-16. Période : 20/10/2026, de 14:09 à 14:22, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5. Agents délégués : 3 `explorateur` pour les relevés et 2 `verificateur` pour les relectures d'intention, sans escalade de modèle.

Intention de la demande : juger si les process de la Factory, des forges et des produits sont les mieux à même de répondre aux demandes, et identifier lesquels ajouter, modifier, optimiser ou supprimer, avec une dizaine de scénarios d'amélioration.

Test rétro : le résultat sert cette intention. L'étude couvre 10 périmètres et juge chaque process par ce qu'il rend aux demandes ; elle propose ajouts, modifications, optimisations et suppressions, puis 12 scénarios. Un relecteur aveugle, qui n'avait que votre demande et l'étude, rend « sert ». Il reste une limite : les appels réels de chaque process ne sont pas mesurés, et les scénarios 10 et 11 restent à confirmer.

## 2. Verdict en une ligne

Étude PASS par `oracle-ecriture` ; 11 sections ; 12 scénarios sur 10 périmètres, dont 6 de suppression, fusion ou allègement ; 7 critères d'adéquation, dont 5 mesurés ; relecteur aveugle « sert » ; 208 491 jetons de sous-agents rendus, sous le budget de 600 000.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-60 — Faut-il mettre en service l'œil critique (relevés chaque semaine, jugement chaque mois) et lancer d'abord les scénarios 3, 1 et 12 ?**
>
> - **De quoi s'agit-il** : l'œil critique décrit par l'étude. Les scripts de cette étude seraient rejoués chaque semaine, sans jeton. Un agent les lirait chaque mois contre vos demandes et proposerait au plus 5 améliorations, dont des suppressions. 3 premiers scénarios seraient lancés tout de suite :
>   - le 3 : une réponse courte n'est plus refusée comme une restitution manquée ;
>   - le 1 : le gabarit de restitution a une taille plafonnée ;
>   - le 12 : vos reprises deviennent des insatisfactions suivies.
> - **Le problème** : environ 2 refus de fin de tour sur 3 sanctionnent un format absent, le gabarit de restitution a triplé en 7 semaines, et le registre des insatisfactions n'a rien reçu depuis le 14/09 alors qu'environ un message sur 5 est une reprise.
> - **Pourquoi vous** : la mise en service crée un dispositif durable qui jugera tout le parc et pourra proposer des retraits de règles (R-31) ; le choix des premiers scénarios est un arbitrage de priorité.
> - **Recommandation : (a)**. Ces 3 scénarios visent les coûts les plus mesurés de l'étude. Sources consultées :
>   - `output/03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md`, sections 3, 8 et 9 ;
>   - les 250 refus de fin de tour du 20/09 au 20/10, relevés dans les transcripts.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Mettre l'œil critique en service et lancer les scénarios 3, 1 et 12 | Les relevés tournent chaque semaine ; le premier jugement mensuel tombe en novembre ; les 3 scénarios passent en campagne | Complexe × moyen | Possible : retirer les relevés, revenir sur chaque scénario par git |
| (b) Mettre l'œil critique en service, sans lancer de scénario | Les relevés et le jugement tournent ; les 12 scénarios restent à choisir | Moyen × court | Possible |
| (c) Ne rien mettre en service | L'étude reste une photographie du 20/10 | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est mis en service.

## 4. Traité

Chaque point du contrat de sortie du prompt, avec ce qui le prouve.

- **Les 11 sections, dans l'ordre.** Preuve : `output/03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md`, nommé selon R-4 et R-25 (type « Étude » pris au registre des types), indice alloué par `allouer-indice.mjs`.
- **Chaque phrase de la demande 2 citée, avec sa section.** Preuve : tableau de la section 1.
- **Inventaire recompté.** Preuve : section 2, par `git`, `ls` et `croissance.sh` ; 13 familles, chacune avec sa source.
- **5 critères mesurés sur 7.** Reprises (environ 20 % des messages), attente, charge de décision (47 décisions en 4 jours, recomptées), coût, défauts de contrôle (166 « règles mortes ») ; les critères a et g en partie. Preuve : section 3.
- **12 scénarios au gabarit, répartition tenue.** 10 périmètres, 6 suppressions ou fusions, 3 sur les produits, 2 sur la publication et les hooks. Preuve : section 9, compte en fin de section.
- **Aucun scénario sans trace.** Chaque déclencheur cite un script, un fichier ou un item ; le diagnostic du scénario 10 est marqué « à confirmer ».
- **Chiffres d'agents recomptés à la source (S76).** Les décisions (47 numéros, D-13 à D-59) et les insatisfactions (aucune après le 14/09) sont recomptés. Les commits des forges aussi : 304 et non 311, 173 pour forge-agents et non 175 ; l'étude porte les chiffres recomptés.
- **Jetons dépensés.** 208 491 jetons pour les 4 sous-agents qui ont rendu : relecture des consignes 30 151, demandes 98 088, forges et lots 43 443, relecteur aveugle 36 809. Le relevé des appels tourne encore. Session principale : pas de relevé par appel.
- **Forme jugée.** `node oracles/oracle-ecriture.mjs` rend PASS.
- **Relecteur aveugle.** Un `verificateur` qui n'avait que votre demande et l'étude rend « sert », gravité mineure, confiance élevée. Ses 3 écarts : appels des process non mesurés, critères a et g non mesurés, 4 scénarios sur le même thème d'allègement. Consigné en `RI-20261020-14`.
- **Relecture d'intention : sert (RI-20261020-14, relecteur aveugle, gravité mineure).**
- **Relecture d'intention des consignes.** RI-20261020-13 : « sert », 1 écart corrigé avant lancement (la pièce B ne couvrait que le pilot ; forges et skills ajoutés).

## 5. Non traité

- **L'effet des 77 règles S au préjugement.** Motif : aucune trace n'en est gardée ; l'étude le déclare non mesuré.
- **Le relevé C sur le registre.** Motif : ma consigne exigeait un outil d'écriture que l'agent `explorateur` n'a pas ; j'ai refait moi-même la partie registre, et l'agent n'a rendu que les forges et les lots.
- **Les appels réels de chaque process, et les process orphelins.** Motif : le relevé délégué n'avait pas rendu à la remise ; l'étude le déclare non mesuré, et les scénarios 2 et 11 en dépendent.
- **La mise en service.** Motif : elle attend D-60.

## 6. Écarts à la lettre

| Vous avez écrit | J'ai fait | Pourquoi |
|---|---|---|
| « s'assurer que les process […] sont les mieux à même » | Juger chaque périmètre sur des critères mesurés | Écart accepté avec D-59 (a) |
| « identifier automatiquement » | Le mécanisme est décrit et sa première passe jouée ; il n'est pas mis en service | Écart accepté avec D-59 (a) ; la mise en service est D-60 |
| « 10 environ » | 12 scénarios | Dans la borne de 10 à 12 acceptée |

## 7. Risques

- **Alléger laisse passer des défauts.**
  - Énoncé : retirer des règles ou des contrôles peut rouvrir des défauts qu'ils arrêtaient.
  - Signal : les défauts échappés (critère f) remontent après un retrait.
  - Parade : toute suppression passe la preuve de la section 5 de l'étude ; les gardes de sécurité ne se retirent jamais sur leur silence.
- **L'œil critique ajoute une couche de plus.**
  - Énoncé : il s'ajoute à la pile qu'il est censé alléger.
  - Signal : aucune de ses propositions n'est acceptée en 2 cycles.
  - Parade : il porte sa propre règle de retrait (section 8).

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, votre décision ensuite ; A-1 attend D-60.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Mettre en service les relevés et lancer la campagne des scénarios 3, 1 et 12 | auto_ia | dependance_bloc_3 : attend D-60 | Scripts de l'étude, à reprendre comme sondes ; une campagne d'agents par scénario | L'œil critique reste une photographie |
| **A-2** | `neuve` | Enregistrer les études, analyses et synthèses du jour et les items TF-1939 à TF-1941 | auto_ia | hors_mandat : enregistrement non demandé dans ce tour | `git commit --only -- <chemins>` | L'autre poste ne voit pas ce travail |
| **A-3** | `neuve` | Trancher D-60 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `60a` | Rien n'est mis en service |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md`
- Analyse L99 : `output/03-etudes/20261020-L99-oeil-critique-global-des-process.md`
- Scripts de mesure, dans le dossier temporaire de la session : `croissance.sh`, `regles-qui-refusent.mjs`, `registre-30j.mjs`, `contexte-ouverture.mjs`, `pushes.mjs`, `recompte-refus.mjs`, `recompte-visibilite.mjs`
- Registre : `decisions/REGISTRE.jsonl`, D-60 réservée ; relectures `RI-20261020-13` et suivante dans `todo/relectures-intention.jsonl`
- Rien n'est enregistré ni poussé.
