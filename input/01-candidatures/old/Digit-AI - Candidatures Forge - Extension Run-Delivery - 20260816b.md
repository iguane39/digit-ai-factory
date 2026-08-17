# Candidatures forge — extension « run de delivery »

**Date** : 2026-08-16 · **Destination** : todo de `iguane39/digit-ai-forge-pilot`
**Origine** : comparaison exécutée de la checklist PM publique *Claude Setup for Project Managers*
(@parm.ai, TikTok, 16/08/2026) avec le corpus des 33 skills installés.
**Nature** : 2 expressions de besoin. **Aucune cible d'hébergement désignée** — le choix du
skill, du dépôt et de la forme relève de l'arbitrage de la forge.
*Remplace l'itération 20260816a, qui prescrivait une cible et un périmètre de fichiers.*

## Convention de lecture

Des noms d'artefacts existants apparaissent **dans les constats uniquement**, pour que les
contrôles soient rejouables à l'identique. Aucun n'est désigné comme cible. Les sections
« capacité attendue » et « critères d'acceptation » sont volontairement exprimées en résultats
observables, jamais en diffs de fichiers.

## Réserves à lever avant ingestion

- **Schéma d'ingestion non relu dans cette session.** Les champs du bloc JSONL sont neutres ;
  ils doivent être remappés sur le schéma réel du sidecar `candidature-*.tf.jsonl` du pilot.
- **`id`** : laissé vide — attribué à l'ingestion (précédent connu : TF-0177).
- **`score`** : laissé vide — les axes du triplet du repo (format `3/1/2`) ne sont pas relus
  ici ; un score inventé fausserait la priorisation. *À vérifier* avant dépôt.
- **Anti-doublon** à rejouer contre l'archive d'événements, puis ingestion prouvée sur
  registre scratch avant dépôt réel.
- **Nommage** : ce fichier suit la convention Digit-AI (document remis) ; le sidecar déposé
  suit la convention interne du pilot — exception documentée, même régime que `DESIGN.md`.

---

## Invariants — applicables à toute solution retenue

Ces contraintes bornent l'espace des solutions sans en choisir une.

1. **Porteur d'état unique.** Aucune solution ne doit créer un second système d'état de
   mission. Tout artefact nouveau est *dérivé* de l'état existant, jamais concurrent.
2. **Pas de capacité non jugée.** Toute capacité ajoutée est couverte par un oracle
   réellement exécuté, avec sa paire de fixtures rouge/verte. À défaut : entrée N0 écrite en
   file des candidats (règle §4). Une capacité livrée sans l'un ou l'autre est refusée.
3. **Balayage de classe obligatoire.** Le lot couvre **tous** les consommateurs de la
   capacité — spécification, protocole d'usage, instances réelles, oracle, fixtures et
   manifest, entrée de registre. Un lot partiel qui laisse un consommateur en arrière produit
   un verdict conforme faux : c'est le motif de refus n°1.
4. **Non-régression de déclenchement.** Toute description de skill touchée est diffée et la
   baseline de déclenchement rejouée.
5. **Traçabilité.** Aucune donnée affichée sans source citée ou calcul rejoué ; marquage
   « à vérifier » sinon.
6. **Anti-drive-by.** Ajout seulement : aucun renommage, réordonnancement ou refonte
   d'objets existants qui ne serait pas strictement requis par la capacité demandée.

---

## C1 — Capacité manquante : gouvernance de mission

### Constat (prouvé par exécution, 2026-08-16)

- `grep -rn -i "risque"` sur le skill de conduite de mission (`pilote-de-mission` v1.0.0) →
  **0 occurrence**.
- `grep -ril "parties prenantes\|stakeholder"` sur les 33 skills → aucun hit dans ce skill.
  Idem « gouvernance ».
- Le schéma de plan gère les **hypothèses** — ce dont le plan dépend sans le contrôler. Objet
  distinct d'un **risque** (événement probable × impact × parade × porteur) et d'une **partie
  prenante** (attente, position, canal, cadence).
- Le critère de fin de mission est binaire ; aucune mesure de succès suivie dans le temps.
- L'oracle de domaine existant juge quatre contrôles structurels (deadlines, dépendances,
  critères de sortie, chemin critique) et **ignore** les trois objets ci-dessus — d'où
  l'invariant n°2 : ajouter la capacité sans étendre son jugement produirait un verdict
  conforme faux. Classe identique au signalement N0 du 16/08/2026 sur `oracle-nommage`.

**Effet métier** : une mission client pilotée par la forge ne produit aujourd'hui aucun des
trois objets qu'un commanditaire attend en premier en comité de pilotage.

### Capacité attendue

Un plan de mission peut porter, et faire vivre dans le temps :

- un **registre de risques** — événement, probabilité, impact, parade, porteur, statut, liens
  vers les travaux impactés ;
- une **cartographie des parties prenantes** — rôle, attente principale, position, canal,
  cadence, avec les communications planifiées rattachées à une partie prenante identifiée ;
- des **mesures de succès** suivies dans le temps, distinctes du critère binaire de fin.

Articulation exigée : la réalisation d'un risque doit alimenter le mécanisme d'adaptation
**existant** comme information entrante — pas ouvrir un second protocole.

### Critères d'acceptation — binaires

1. Une mission réelle en cours porte ≥ 3 risques et ≥ 3 parties prenantes, tous champs
   renseignés, aucun placeholder résiduel.
2. Un plan dépourvu de registre de risques est **rejeté par un oracle exécuté** ; un plan
   complet passe. Les deux rejoués, jamais déclarés.
3. Le compteur de contrôles du self-test est ≥ à sa baseline avant lot.
4. `run-oracles` conforme sur l'ensemble des artefacts du lot.
5. Diff fourni prouvant qu'aucune description de skill n'a régressé.
6. Preuve que la réalisation d'un risque emprunte le mécanisme d'adaptation existant.

### Non prescrit — arbitrage de la forge

Skill ou dépôt hôte · nommage et numérotation des objets · forme du registre (bloc de
schéma, artefact séparé, table) · échelle de cotation des risques · granularité des mesures
de succès.

---

## C2 — Capacité manquante : artefacts périodiques du run de delivery

### Constat (prouvé par exécution, 2026-08-16)

Sur les 33 skills installés : **0 occurrence** de « RAID », « compte rendu »,
« compte-rendu », « rapport d'avancement », « status report », « lessons learned ».
« retour d'expérience » n'apparaît que dans des contextes LinkedIn et prospection.

Cinq artefacts récurrents sans équivalent : **revue RAID**, **rapport d'avancement**,
**compte rendu de réunion**, **REX de fin de mission**, **suivi des bénéfices**.

**Lecture** : la forge couvre le *build* (produire, vérifier, juger) et le *pilotage* (plan,
adaptation). Elle ne couvre pas la **cadence** — l'artefact qui revient chaque semaine. C'est
le terrain vendu en mission longue chez un grand compte.

### Capacité attendue

Produire à cadence, depuis l'état de mission et sans le dupliquer, les cinq artefacts
ci-dessus. La matière est déjà majoritairement présente dans un plan de mission (statuts,
journal des décisions, communications, chemin critique) ; ce qui manque est la vue
d'assemblage, la cadence et le régime de preuve propre à chaque artefact.

Dépendance : le volet risques de C1 conditionne le R de la revue RAID.

### Critères d'acceptation — binaires

1. Chaque artefact dispose d'un gabarit **et** d'au moins une instanciation sur une mission
   réelle en cours — jamais un gabarit seul.
2. Pour chaque artefact : oracle applicable identifié, ou entrée N0 écrite en file des
   candidats. Aucun artefact livré sans l'un ou l'autre.
3. Le rapport d'avancement et le suivi des bénéfices passent le contrôle des affirmations
   chiffrées sans aucun chiffre non sourcé.
4. Preuve qu'aucun second porteur d'état n'a été créé (invariant n°1).
5. La cadence est une donnée d'instance, jamais une valeur codée dans une spécification.

### Non prescrit — arbitrage de la forge

Extension d'un skill existant ou skill dédié · répartition entre skill de pilotage et skill
de communication · format des gabarits · fréquences par défaut.

---

## Bloc d'ingestion (à remapper sur le schéma réel du sidecar)

```jsonl
{"id":null,"slug":"gouvernance-de-mission","titre":"Capacité manquante : gouvernance de mission (risques, parties prenantes, mesures de succès)","type":"capacite","statut":"candidat","date":"2026-08-16","origine":"comparaison checklist PM externe vs corpus 33 skills","cible":null,"arbitrage_heberge_par_la_forge":true,"preuve":"grep 0 occurrence de risque / parties prenantes / gouvernance sur le skill de conduite de mission, 2026-08-16","invariants":["porteur d'etat unique","pas de capacite non jugee (oracle + fixtures ou entree N0)","balayage de classe complet","non-regression de declenchement","tracabilite des donnees","ajout seulement"],"depend_de":[],"score":null,"reserve":"score et schema de champs a caler avant depot"}
{"id":null,"slug":"artefacts-periodiques-run","titre":"Capacité manquante : artefacts périodiques du run de delivery (RAID, avancement, CR, REX, bénéfices)","type":"capacite","statut":"candidat","date":"2026-08-16","origine":"comparaison checklist PM externe vs corpus 33 skills","cible":null,"arbitrage_heberge_par_la_forge":true,"preuve":"grep 0 occurrence de RAID / compte rendu / rapport d'avancement / lessons learned sur 33 skills, 2026-08-16","invariants":["porteur d'etat unique","pas de capacite non jugee (oracle + fixtures ou entree N0)","cadence en donnee d'instance","tracabilite des chiffres"],"depend_de":["gouvernance-de-mission"],"score":null,"reserve":"score et schema de champs a caler avant depot"}
```

---

*Aucune donnée chiffrée non sourcée dans ce document. Les champs `id`, `score` et `cible`
sont laissés vides à dessein : les deux premiers par réserve, le troisième par décision.*
