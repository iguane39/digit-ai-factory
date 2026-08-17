# Étude d'opportunité — gouvernance et cadence d'une mission (TF-0323 · TF-0324) — 20260817g

Instruite au gabarit `gabarits\ETUDE-OPPORTUNITE.md`. Périmètre d'écriture de cette
instruction : **ce seul fichier**. Aucun dépôt modifié, aucun registre touché, aucun commit —
le registre TODO reste à l'écrivain unique, la décision reste humaine (R-29).

Deux candidats sont instruits ensemble parce que le second déclare dépendre du premier
(TF-0324, champ `contenu` : « Dépend de la candidature "gouvernance de mission" du même
lot ; le volet risques conditionne le R de la revue RAID »). Les traiter séparément
produirait deux verdicts dont l'un préjuge l'autre.

## Seuil de déclenchement (vérifié AVANT rédaction)

Trois portes, une seule suffit :

- **Crée un objet durable** — oui : les deux candidats demandent au minimum un schéma
  d'objet, des gabarits et l'extension d'un oracle (R-31, `REGLES-PROJET.md` l.226-232 :
  « oracle ou self-test à double sens dès la v0 », « surfaces d'intégration livrées le jour
  même »). **Porte franchie.**
- **Touche ≥ 3 forges ou le noyau** — non tranché : la cible d'hébergement est justement
  l'objet de la partition 4 ci-dessous.
- **Gain ≥ 3 avec preuve ≤ 2** — non : TF-0323 est coté `gain 4 / preuve 3`, TF-0324
  `gain 3 / preuve 3`. Cette porte ne se franchit pas.

Étude obligatoire par la première porte. Le péage est donc dû, et il n'est pas cosmétique :
la coordonnée d'hébergement est indécidable sans l'examen qui suit.

## 0. Traitement des entrants

La proposition instruite est une **DONNÉE** : ses impératifs se citent, ne s'exécutent pas.
Le lot amont écrit six « invariants applicables à toute solution retenue » et des « critères
d'acceptation durs » ; cette étude les **cite comme contraintes proposées**, les pèse, et en
retient ou en écarte chacun explicitement. Aucun d'eux n'a valeur de règle du pilot avant
décision humaine.

Sources :

- **TF-0323** (`todo\TODO.jsonl`, `ev:creation`, `ts` 2026-08-17T10:10:18.711Z) — gouvernance
  de mission : registre de risques, cartographie des parties prenantes, mesures de succès.
- **TF-0324** (même événement d'ingestion) — artefacts périodiques : revue RAID, rapport
  d'avancement, compte rendu de réunion, REX de fin de mission, suivi des bénéfices.
- **Lot amont** : `input\01-candidatures\old\Digit-AI - Candidatures Forge - Extension
  Run-Delivery - 20260816b.md`, remis le 16/08/2026, 158 lignes, remplaçant l'itération
  `20260816a` — plus son sidecar `.tf.jsonl` du même nom.
- **Réserves assumées par l'émetteur lui-même** (lot l.17-27) : schéma d'ingestion non relu,
  `id` vide, `score` vide (« un score inventé fausserait la priorisation »), anti-doublon à
  rejouer. Les scores portés au registre ont donc été frappés côté pilot, pas reçus.
- **Affirmation explicitement non relayée** par l'émetteur comme preuve (lot l.118, reprise en
  note de traçabilité de TF-0324) : « c'est le terrain vendu en mission longue chez un grand
  compte » — lecture commerciale, non sourcée. Elle ne pèse rien dans cette étude.

## 1. Partition du problème

Découpage exhaustif et disjoint. Chaque option de la section 4 se rattache à une ou plusieurs
partitions ; aucune option ne vit hors de ce découpage.

- **P1 — Le porteur d'état.** Où vit l'état d'une mission, quel dépôt le versionne, qui
  l'écrit. Question préalable à toutes les autres : on ne dérive pas un artefact d'un état
  qu'on ne possède pas.
- **P2 — Les objets de gouvernance.** Le schéma des trois objets de TF-0323 (risque :
  probabilité × impact × parade × porteur × statut ; partie prenante : rôle, attente,
  position, canal, cadence ; mesure de succès distincte du critère binaire de fin) et leur
  articulation avec le mécanisme d'adaptation existant.
- **P3 — La cadence.** Les cinq artefacts périodiques de TF-0324 : leur dérivation depuis
  l'état, leur fréquence, et le fait que la fréquence soit une donnée d'instance.
- **P4 — L'hébergement.** Quel dépôt porte la capacité, sachant que ni TF-0323 ni TF-0324 ne
  prescrivent de cible (lot l.6-7 : « Aucune cible d'hébergement désignée »).
- **P5 — Le régime de preuve.** Quel contrôle exécuté juge quoi, et — symétriquement — ce qui
  reste explicitement non jugé et le dit.

Les deux candidats se projettent proprement : TF-0323 = P1 + P2 + P5 ; TF-0324 = P1 + P3 + P5.
P4 est commune et n'appartient à aucun des deux : c'est l'arbitrage que le lot a délégué.

## 2. Non-recouvrement contre l'existant

Vingt-et-une lignes, chacune portant une citation vérifiable (fichier + ligne ou section).
Les vérifications marquées « exécutée le 17/08/2026 » ont été rejouées pour cette étude, en
lecture seule, et non reprises de l'entrant.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Skill `pilote-de-mission` v1.0.0 — cible de la preuve amont | recherche exécutée le 17/08/2026 : `ls -d c:\dev\digit-ai-forge-*/.claude/skills/*/` → 12 skills, `%USERPROFILE%\.claude\skills` → 24 skills, aucun répertoire `pilote-de-mission` ; `grep -ril` sur `c:\dev` → 11 fichiers le MENTIONNENT (dont 6 hors pilot), 0 le contient | ne recouvre pas — et le constat amont n'est pas rejouable ici : le skill n'est versionné dans aucun dépôt de l'écosystème |
| Contrôles de l'oracle de domaine | `digit-ai-forge-agents\.claude\skills\quality-oracles\scripts\oracle-plan-de-mission.mjs` l.7-11 : « W1 aucune étape après la deadline de son workstream ; W2 dépendances acycliques et toutes référencées ; W3 chaque étape porte un critère de sortie non vide ; W4 chemin critique désigné » | ne recouvre pas — aucun des trois objets de TF-0323 n'entre dans W1-W4 |
| Schéma canonique du plan, versionné | même fichier l.3-6 : « format canonique (versionné ici) : ## Workstream nom — deadline : AAAA-MM-JJ ; - etape: id · titre · echeance: … · sortie: … · depend: … » | ne recouvre pas — aucun champ risque, partie prenante ni mesure de succès dans la seule forme que l'écosystème versionne |
| Affirmation amont « le schéma de plan gère les HYPOTHÈSES » | lot l.61-63 ; contre-vérification exécutée le 17/08/2026 : `grep -c -i hypoth` sur l'oracle et sur ses deux fixtures → 0, 0, 0 | ne recouvre pas ; et l'affirmation n'est pas vérifiable sur la part versionnée — réserve à porter au ledger, pas à recopier |
| Fixture de conformité du domaine | `quality-oracles\fixtures\plan-de-mission-green.md` l.1-11 : 2 workstreams, 4 étapes, chemin critique `E1 > E2 > E4` — zéro risque, zéro partie prenante, zéro mesure | ne recouvre pas — la référence de conformité enseigne l'absence, et c'est sur elle que s'appuie l'arbitrage de la section 5 |
| Liste `non_juge` de l'oracle | même oracle l.21-24 : « réalisme des charges et des dates » · « export Notion non encore câblé (réserve inventaire O-8) » | ne recouvre pas — et le silence n'est même pas déclaré : les trois objets n'y figurent pas. Un PASS y promet plus qu'il ne juge |
| Consigne de restitution, bloc 7 « Risques » | `gabarits\RESTITUTION.md` l.87-94 : « l'énoncé — quoi, et sur qui ça tombe ; le signal qui le rendrait visible ; la parade ou l'acceptation déclarée » | recouvre PARTIELLEMENT — 3 attributs sur 7 demandés (ni probabilité, ni impact coté, ni porteur, ni statut), et l'objet est un instantané de fin de traitement, jamais tenu dans le temps |
| Consigne de restitution, bloc 8 | même fichier l.102-105 : « le score de risque du rapport (criticité × probabilité × coût tardif) quand il existe » | ne recouvre pas — la restitution CONSOMME un score produit ailleurs ; la clause « quand il existe » avoue qu'aucun artefact du pilot ne le produit |
| Périmètre déclaré de la restitution | même fichier l.6-9 : « tout message de fin de traitement … clôture de run, fin de campagne, fin de mandat, synthèse remise à l'humain » | ne recouvre pas la cadence — l'objet est la FIN d'un traitement, pas la semaine en cours d'une mission |
| « Rapport d'avancement » déjà normé au pilot | `gabarits\AVANCEMENT-PROCESS.md` l.3-5 : « tout process dépassant ~2 minutes publie son avancement toutes les 3 minutes » ; l.17-26 : 8 champs dont « RAF : 11 modules » et « cadence services/ MESURÉE : 0,8 module/min » | ne recouvre pas — homonymie totale : c'est l'avancement d'un PROCESS machine à l'intérieur d'un run, pas celui d'une mission devant un commanditaire |
| Appelant de cette convention | `CONTRAT-INTERFACE.md` §4 ter l.170-176 : « tout process dépassant ~2 minutes (mutation, rendu, scan, migrations, MEP, génération d'images, campagne) » | ne recouvre pas — l'énumération de l'appelant confirme le périmètre machine ; « campagne » y désigne une campagne de forge, pas une mission client |
| Clôture d'un mandat transverse | `references\RUN-MANDAT.md` pas 5 « Clore » l.45-50, puis l.57-58 : « Pas de MEP ni de GO production — la remise du livrable EST la fin du run » | ne recouvre ni le REX de fin de mission ni le suivi des bénéfices : rien n'est prévu APRÈS la remise |
| Circuit insatisfactions | `gabarits\AGENT-INSATISFACTION.md` blocs a-c, l.12-44 : reproduction aux conditions réelles, cause racine au fichier et à la ligne, gates en défaut « inexistant / aveugle / jamais joué » | ne recouvre pas — il instruit un défaut SURVENU ; un risque est un événement non survenu. C'est en revanche l'ancrage naturel du « risque réalisé », donc la preuve que l'articulation demandée par le lot a déjà un tuyau |
| Registre TODO-FORGE, clôture sur gains | `references\TODO-FORGE.md` l.13 : « Clôture corrige : gains_constates, corrections_realisees, date_correction exigés (R7) » | ne recouvre pas — c'est un suivi de bénéfices, mais des AMÉLIORATIONS DE LA FORGE ; aucun champ ne parle d'une mission ni d'un commanditaire |
| Journal des campagnes | `BOUCLE-AMELIORATION.md` l.3-8 : « journal narratif (campagnes, décisions, contexte) — il référence les ids TF-xxxx » | ne recouvre pas — sujet = la forge ; déclencheur = un lot reçu, donc l'événement, jamais le calendrier |
| Objet « mission » déjà outillé ailleurs | `digit-ai-forge-seo\missions.json` l.2-8 : champs `client`, `domaine`, `chemin`, `date`, `version_grille` ; `digit-ai-forge-seo\referentiel\strategie-future.md` l.49 : « Cible en jalons observables … vérifiable, et suffit à piloter » | ne recouvre pas — index de missions sans gouvernance ; des mesures observables suivies existent, mais bornées au domaine SEO et à une cible de stratégie, pas au succès d'une mission |
| Parties prenantes formalisées ailleurs | `digit-ai-forge-audit\core\adr\00-meta\ADR0004-roles-responsabilites-actifs-raci.md`, en-tête l.1-5 : `decision-makers`, `consulted: roles.change_board, responsables de domaine` | ne recouvre pas — ce sont les parties prenantes des ACTIFS du SI audité, pas celles de la mission qui l'audite |
| Forge d'observabilité | `digit-ai-forge-observability\CLAUDE.md` l.3-7 : « surveille entre les runs. Trois verbes : observer (exécuter les sondes d'un plan, produire un snapshot), dériver (comparer deux snapshots) » | ne recouvre pas la mesure de succès d'une mission — sondes techniques, aucune cadence de reporting vers un commanditaire. Reste le porteur naturel si une mesure devient un jour une sonde |
| Juge des chiffres non sourcés — critère 3 de TF-0324 | `quality-oracles\references\registre-oracles.md` l.45 : « oracle-claims.mjs — montant € sans source ni "à vérifier" = bloquant ; incohérence intra-document » | **RECOUVRE** — le régime de preuve exigé pour le rapport d'avancement et le suivi des bénéfices existe déjà et se réutilise. Rien à créer de ce côté |
| Vocabulaire « entrée N0 en file des candidats » (invariant n°2 du lot) | `grep -n "\bN0\b"` sur `c:\dev\digit-ai-forge-agents`, exécuté le 17/08/2026 → 0 occurrence ; le mécanisme réel est `registre-oracles.md` l.5 : « tout domaine sans oracle reçoit un oracle (standard §3) remonté ici (règle §4) » | le mot ne recouvre rien — le MÉCANISME recouvre : l'invariant se lit contre la règle §4 du registre, pas contre un « N0 » qui n'existe nulle part dans le dépôt cité |
| Preuve d'un coût déjà payé par un client | `insatisfactions\REGISTRE.jsonl` : 3 lignes, toutes sur INS-0001 (menus de digit-ai.fr) ; `grep -c -i mission` → 0 ; `input\00-retours\` ne contient que `old\` | ne recouvre pas — et surtout : **aucun incident enregistré**. Le coût cité par les deux candidats est un MANQUE (« 0 occurrence »), pas une facture |

Ce que le tableau établit, en une phrase : les trois objets de TF-0323 et les cinq artefacts
de TF-0324 sont bien absents de la part versionnée de l'écosystème — mais le porteur d'état
que l'amont désigne implicitement l'est aussi, et le juge des chiffres qu'il réclame existe
déjà.

## 3. État de l'art daté

**Verdict : non instruit** — et le motif est triple, chacun vérifiable :

1. **La source unique citée par l'amont n'est pas localisable.** Le lot l.4-5 écrit :
   « comparaison exécutée de la checklist PM publique *Claude Setup for Project Managers*
   (@parm.ai, TikTok, 16/08/2026) ». Le localisateur est un compte plus une date, sans
   identifiant de publication ni URL — donc non adressable et non rejouable. Recherche web
   exécutée le 17/08/2026 sur `parm.ai "Claude Setup for Project Managers" checklist` : aucun
   résultat correspondant à cette source. Une source qu'on ne peut pas rouvrir n'est pas une
   source, c'est un souvenir.
2. **Les référentiels qui définissent réellement les objets demandés sont hors fenêtre.**
   Registre de risques, cartographie des parties prenantes et journal RAID sont normés par des
   corpus dont les éditions courantes sont antérieures de plus de 24 mois à cette étude. Les
   citer serait produire des sources datées mais périmées au regard du seuil du gabarit — un
   entre-deux que le gabarit interdit explicitement.
3. **La décision ne dépend pas de la fenêtre.** Les objets en cause sont stables depuis des
   décennies ; l'arbitrage porte sur le porteur d'état, l'hébergement et le régime de preuve —
   tous internes à l'écosystème. Une revue documentaire fraîche n'aurait déplacé aucune option
   du jeu fermé ci-dessous. Elle reste due, et devient exigible, au moment où il faudra
   arrêter une échelle de cotation des risques : c'est inscrit au plan de revue.

Conséquence assumée : ce verdict prive l'étude de tout appui externe. Elle ne s'appuie donc
que sur des citations internes vérifiées, ce que la section 2 fait ligne à ligne.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** *(couvre P1 à P5 par abstention.)*

  **Réfutée, mais sur un coût qu'il faut nommer honnêtement.** Ce que la preuve amont établit
  est un manque, pas un incident : `preuve_du_cout` de TF-0323 et de TF-0324 se réduit à
  « 0 occurrence », et la vérification exécutée le 17/08 confirme qu'aucun client n'a réclamé
  ces objets — `insatisfactions\REGISTRE.jsonl` compte 3 lignes, aucune ne mentionne une
  mission ; `input\00-retours\` n'a reçu aucun lot sur le sujet. Les deux instanciations
  réelles connues du domaine (brief `Digit-AI - Inventaire Forge - Candidats oracles et fiches
  experts - 20260723b.md` l.76 : « pilote-de-mission, 2 instanciations réelles : APDLB v1.1,
  AO OPCO EP ») n'ont produit aucun retour de friction. **Sur ce fondement seul, O0 tiendrait :
  ce serait de l'anticipation, et l'anticipation ne franchit pas le seuil du registre.**

  O0 tombe pour une autre raison, elle présente et payée dans le dépôt : `oracle-plan-de-mission.mjs`
  se déclare, l.2, oracle du domaine « Plan de mission (cohérence structurelle) », rend **PASS**
  sur un plan sans aucun risque, sans aucune partie prenante et sans aucune mesure — et ne le
  dit pas, puisque sa liste `non_juge` l.21-24 ne mentionne que le réalisme des charges et
  l'export Notion. Sa fixture verte, `plan-de-mission-green.md` l.1-11, canonise cette absence.
  Le registre l'affiche « exécutable » (`registre-oracles.md` l.31). Un lecteur du PASS lit
  « plan de mission conforme » ; l'oracle a mesuré quatre contrôles de structure. C'est
  exactement le défaut que la loi transverse n° 3 du noyau nomme — l'oubli n'existe pas : une
  dimension absente est indiscernable d'une dimension oubliée. **Ce coût-là n'est pas anticipé,
  il est en place aujourd'hui, dans un dépôt versionné, et il se cite. O0 est réfutée sur
  celui-ci, et sur aucun autre.**

- **O1 — déclarer seulement.** *(P5.)* Ajouter les trois objets de TF-0323 et les cinq
  artefacts de TF-0324 à la liste `non_juge` de `oracle-plan-de-mission.mjs`, et une ligne de
  périmètre au registre des oracles. **Contenu** : deux éditions chirurgicales, aucun contrôle
  nouveau. **Coût** : quasi nul (une passe Haiku, self-test rejoué). **Exclut** : toute
  capacité — un plan sans registre de risques continuerait de passer. Le critère d'acceptation
  dur de TF-0323 (« un plan dépourvu de registre de risques est REJETÉ par un oracle exécuté »)
  resterait non tenu. Éteint le faux PASS sans rien apporter à une mission.

- **O2 — étendre le schéma canonique versionné et son oracle.** *(P2 + P5, et P1 par le fait
  que l'état reste dans le seul artefact que l'écosystème possède.)* **Contenu** : trois blocs
  ajoutés au format canonique décrit l.3-6 de l'oracle — `risque:` (énoncé, probabilité,
  impact, parade, porteur, statut, étapes impactées), `partie-prenante:` (rôle, attente,
  position, canal, cadence), `mesure:` (intitulé, valeur de départ, cible, relevé daté,
  distincte du critère de sortie binaire) ; trois contrôles W5-W7 correspondants, chacun
  bloquant ; les deux fixtures mises à jour et **une fixture rouge par contrôle** ; entrée du
  manifest (`quality-oracles\fixtures\manifest.json` l.484-497, où la paire rouge/verte du
  domaine est déjà déclarée) ; ligne du registre l.31 réécrite ; `run-oracles` et le self-test
  rejoués. La réalisation d'un risque n'ouvre aucun protocole : elle entre par le circuit
  insatisfactions existant (`AGENT-INSATISFACTION.md` l.12-44), ce qui satisfait l'articulation
  exigée par le lot l.83-84 sans second mécanisme. **Coût** : une tranche de construction
  (Sonnet, escalade Opus non attendue sur un oracle de format), ~250 lignes touchées sur un
  seul dépôt frère, zéro dépendance nouvelle. **Dette assumée, à déclarer** : les deux plans
  réels connus (APDLB v1.1, AO OPCO EP) échoueront aux nouveaux contrôles jusqu'à ce que leur
  propriétaire les complète — c'est l'effet voulu, pas une régression, et la décision de les
  compléter appartient à leur propriétaire ; la réserve « export Notion » l.12-13 de l'oracle
  reste ouverte et non aggravée. **Exclut** : les cinq artefacts de cadence (TF-0324 reste
  `candidat`), toute planification de communication vers une partie prenante, tout suivi de
  bénéfices après remise.

- **O3 — objet durable dédié.** *(P1 + P2 + P4.)* **Contenu** : un skill
  `gouvernance-de-mission` dans `digit-ai-forge-agents`, portant le schéma des trois objets,
  son protocole d'usage, son oracle propre, ses fixtures et son entrée de registre — R-31 au
  complet. **Coût** : plusieurs tranches, un balayage de classe entier sur sept consommateurs
  (le lot l.40-43 en fait son « motif de refus n°1 »), et une baseline de déclenchement à
  differ. **Ce qui la disqualifie n'est pas le coût mais R-31 alinéa 4** : ses surfaces
  d'intégration ne sont pas livrables le jour même, puisque le skill qui conduit réellement les
  missions n'est versionné nulle part (ligne 1 du tableau). Le nouvel objet porterait un état
  de mission concurrent de celui qui vit hors dépôt : violation directe de l'invariant n°1 du
  lot (l.35-37, « aucune solution ne doit créer un second système d'état de mission »), invoqué
  contre la solution qui s'en réclamerait. **Exclut** : rien, et c'est le problème — elle
  autorise tout, y compris le doublon d'état.

- **O4 — périmètre entier des deux candidats.** *(P1 à P5.)* **Contenu** : O3 plus les cinq
  artefacts de cadence, chacun avec gabarit, oracle applicable ou entrée de file, et cadence en
  donnée d'instance. **Coût** : le plus élevé du jeu, et un blocage net. **Non réalisable en
  l'état** : TF-0324 exige, critère 1, « au moins une instanciation sur une mission réelle en
  cours — jamais un gabarit seul ». Aucune mission réelle n'est présente dans les dépôts
  (`digit-ai-forge-seo\missions.json` ne contient que deux entrées de test, l.2-16 : « Exemple
  Synthetique » et « Test »). O4 ne peut pas satisfaire ses propres critères d'acceptation
  aujourd'hui : la retenir serait s'engager à livrer une preuve indisponible.

## 5. Verdict

- **Option retenue** : O2 — étendre le schéma canonique versionné du plan de mission et son
  oracle (W5 risques, W6 parties prenantes, W7 mesures de succès), avec fixtures rouges par
  contrôle, manifest, registre et self-test rejoués.

  *Pourquoi elle, et pas sa voisine* : c'est la seule qui éteigne le coût réellement cité
  (le PASS qui promet plus qu'il ne juge) **en produisant une capacité**, sans créer de second
  porteur d'état, et en restant entièrement dans la part de l'écosystème que les dépôts
  versionnent. Elle tient le critère d'acceptation dur de TF-0323 mot pour mot. O1 déclare sans
  faire ; O3 et O4 construisent au-dessus d'un porteur d'état que la forge ne possède pas.

- **Coût** : une tranche de construction sur un seul dépôt frère (`digit-ai-forge-agents`),
  routage Sonnet par défaut (`CONTRAT-INTERFACE.md` §4), escalade non attendue ; ~250 lignes
  touchées sur 6 fichiers (oracle, 2 fixtures + fixtures rouges dédiées, manifest, registre
  humain, registre machine) ; aucune dépendance nouvelle, aucune API tierce. **Dette créée** :
  deux plans réels hors dépôt deviennent non conformes jusqu'à complétion par leur propriétaire
  — à déclarer au ledger en écart, jamais à corriger d'office. **Dette non résorbée** : la
  réserve « export Notion » de l'oracle l.12-13, et l'absence de version versionnée du skill de
  conduite de mission. **Préalable non négociable** : toute écriture dans
  `digit-ai-forge-agents` exige un mandat humain (garde-fou du noyau, « aucune écriture dans
  les dépôts frères hors mandat humain ») — cette étude recommande, elle n'autorise pas.

- **Candidature(s) émise(s)** : **aucune** — le périmètre d'écriture de cette instruction est
  ce seul fichier, le registre appartient à son écrivain unique. Trois écritures sont
  **recommandées** à la session principale, dans cet ordre : (a) TF-0323 → `decide` sur O2 ;
  (b) TF-0324 → maintenu `candidat` avec sa condition de blocage NOMMÉE au champ `contenu`
  (« une mission réelle instrumentée + un porteur d'état versionné »), car un candidat bloqué
  sans condition écrite se rouvre indéfiniment ; (c) un candidat nouveau, issu de cette étude
  et absent des deux entrants : *« le skill qui conduit les missions n'est versionné dans aucun
  dépôt — la forge juge un artefact dont elle ne possède ni la spécification ni les
  instances »*, preuve du coût = la ligne 1 de la section 2, rejouable telle quelle.

- **Plan de revue** : **2026-09-17** — le mandat humain sur `digit-ai-forge-agents` est-il
  accordé ou refusé, et W5-W7 sont-ils exécutés avec leurs fixtures rouges rejouées ? Puis
  **2026-11-17** : les trois questions qui confronteront ce verdict aux faits — (1) au moins un
  plan réel a-t-il été complété et jugé PASS sur W5-W7, ou les deux instances connues sont-elles
  restées non conformes, auquel cas O2 aura produit un contrôle que personne ne joue (R-35) ;
  (2) un risque s'est-il réalisé et a-t-il emprunté le circuit insatisfactions comme prévu, sans
  second protocole ; (3) la condition de blocage de TF-0324 est-elle levée — si oui, réinstruire
  P3 seule ; si non, la refermer. À cette date, l'échelle de cotation des risques devra être
  arrêtée : c'est là que la revue documentaire différée en section 3 devient exigible.
