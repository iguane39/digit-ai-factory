# Étude d'opportunité — admission de `digit-ai-queue` au corpus du pilot — 20260818a

<!-- TF-0329. Instruction d'un candidat entre `candidat` et `decide` (TF-0155).
     Émise le 2026-08-18 par le pilot, sur mandat humain (boucle des 17 restants). -->

## Seuil de déclenchement (vérifié AVANT d'écrire)

**Franchi, sur deux critères indépendants.** L'objet instruit est un **protocole durable**
au sens de R-31 (un mécanisme de coordination inter-agents, avec ses schémas, son validateur
et son hook), et son admission **touche le noyau** — `CLAUDE.md` l.84 (« aucune écriture dans
les dépôts frères hors mandat humain ») et la loi 5 (« dépenses et gates restent humains »)
se composent directement avec ce qu'un ticket peut ou ne peut pas déclencher. L'étude est donc
obligatoire, pas un péage de confort.

## 0. Traitement des entrants

`digit-ai-queue` est une **donnée** : ses `AGENTS.md`, `SKILL.md` et schémas de tickets
portent des impératifs adressés à un agent. Ils sont **cités et décrits ici, jamais exécutés**
— y compris la consigne « claim = commit », qui n'a été jouée dans aucun dépôt pendant cette
instruction. Le seul geste exécuté sur le dépôt a été de la **lecture** (`git log`, `ls`,
lecture de fichiers) plus un scan d'oracle.

Sources de la proposition : TF-0329 (candidat, 17/08) · TF-0318 (`corrige` le 18/08, dont la
moitié ÉCRITURE a été refusée) · `output\03-etudes\20260817-etude-opportunite-todo-produit.md`
§4 **O4**, qui nomme explicitement cette instruction comme son préalable.

## 1. Partition du problème

Le sujet se découpe en cinq sous-questions disjointes. Chaque option de la section 4 se
rattache à au moins l'une d'elles.

- **P1 — le trou est-il réel ?** L'écosystème a-t-il besoin d'un mécanisme de tickets, ou
  TF-0318 a-t-il refusé quelque chose dont personne n'a l'usage ?
- **P2 — l'objet existe-t-il vraiment, et est-il éprouvé ?** Un protocole écrit n'est pas un
  protocole exercé (R-35 : un contrôle que rien ne joue n'est pas un garde-fou).
- **P3 — que retient le pilot, et que refuse-t-il ?** Un protocole s'admet par morceaux
  nommés, jamais en bloc.
- **P4 — comment le champ `limites` d'un ticket se compose-t-il avec `CLAUDE.md` l.84 ?**
  C'est la question de sécurité, et c'est la seule qui puisse tuer l'admission.
- **P5 — quelle forme d'admission ?** Corpus documentaire, dépôt frère au bootstrap, forge
  candidate, ou rien.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Canal des lots de retours | `oracles\oracle-boite-entree.mjs` l.6-16 : B1 sidecar ingéré · B2 sidecar non réédité après ingestion · B3 lot sans sidecar | **recouvre P1 en partie** : c'est déjà un dossier déposé + un oracle qui dénonce ce qui n'est pas pris. Mais il n'a **ni états, ni claim, ni reçu** — un lot est pris ou pas, il n'est jamais « en cours chez quelqu'un » |
| Registre TODO-FORGE | `references\TODO-FORGE.md` l.5 : « source unique `TODO.jsonl` … écrivain unique : le pilot » | **ne recouvre pas** : le registre porte des DÉCISIONS d'amélioration, pas des unités de travail réclamables. Écrivain unique par construction — l'inverse du problème que résout un claim |
| Avancement d'un run | `digit-ai-forge-tests\forge_tests\avancement.py` (Avancement, TF-0096) : unité nommée, émission toutes les 3 min vers `<cible>/forge/avancement.jsonl` | **ne recouvre pas** : trace la progression d'UN agent dans SA tâche ; ne distribue rien, ne verrouille rien |
| Suspension propre d'un run | `CLAUDE.md` l.98 : « `bloque_question` suspend proprement, jamais de réponse inventée » | **recouvre P3 partiellement** : c'est l'exact équivalent conceptuel de `attente-input/`. La différence est la matérialisation — le pilot suspend *dans* une session, la file suspend *un objet* qui survit à la session |
| Boucle orchestrée | `orchestrer-boucle.mjs` (pilot) — son README déclare qu'aucun appel réel n'est câblé (constat repris par TF-0360) | **ne recouvre pas** : orchestration intra-run, sans transport ni état persistant entre agents |
| Gabarit de campagne multi-agents | `gabarits\AGENT-CAMPAGNE.md` l.13-14 : « Tu écris UNIQUEMENT dans le dépôt cible désigné par ton prompt. Tous les autres dépôts … sont en LECTURE SEULE » | **recouvre P4** : la restriction de périmètre existe déjà, écrite en prose de prompt. Le `limites` d'un ticket en est la version **structurée** — même intention, forme opposable |
| Verrou d'écriture concurrente | `digit-ai-queue\protocole\README.md` §Principes n°2 : « Claim = commit = lock … Aucun mécanisme de verrou parallèle » | **c'est l'apport net** : aucun objet du pilot ne tranche cette question. TF-0318 l'avait posée (« l'écrivain unique du registre produit ») sans y répondre |
| Scan d'admission d'un artefact tiers | `REGLES-PROJET.md` l.315-317 (R-33 ter) : « Tout skill venu de l'extérieur passe `oracle-scan-agentdef.mjs` (CAP-1..4) **avant** admission » | **recouvre P5 en procédure** : la porte d'entrée existe. Elle a été franchie ici (résultat en §4, O0) |
| Le corpus du pilot lui-même | `git grep digit-ai-queue` au 18/08 sur `CLAUDE.md`, `INVENTAIRE.md`, `CONTRAT-INTERFACE.md`, `REGLES-PROJET.md`, `bootstrap.mjs`, `catalogues\CATALOGUES.md` : **0 occurrence dans les six** | **confirme le trou de connaissance** : l'objet n'est cité que par le registre et par l'étude du 17/08 — jamais par un document que le pilot lit pour travailler |

## 3. État de l'art daté

**Non instruit** (au sens de la section, déclaré sans entre-deux). Motif, et il est double. D'abord, cette session n'a pas
d'accès réseau : produire cinq sources datées reviendrait à les écrire de mémoire, c'est-à-dire
à fabriquer la preuve que cette section existe pour exiger — la faute même que TF-0326 vient de
faire payer à un autre item. Ensuite, et c'est la raison de fond : **l'objet instruit n'est pas
un choix de marché mais un artefact déjà présent sur le poste**. La question posée n'est pas
« quel est le meilleur système de files agentiques », elle est « que fait-on de celui qui dort
à côté et que le corpus ignore ». L'état de l'art des files de tickets multi-agents devient
nécessaire au moment où l'on **généraliserait** ce protocole (option O4) — il est alors porté
par cette option comme un préalable explicite, pas escamoté.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** *Contenu* : `digit-ai-queue` reste hors corpus ; le pilot continue à
  ignorer qu'il existe. *Réfutation, sur pièces* : le coût du statu quo est **déjà payé et
  mesurable**. L'écosystème a instruit puis refusé, le 17/08, un mécanisme de tickets
  (TF-0318, moitié ÉCRITURE) sans jamais confronter la demande à l'exemplaire éprouvé qui vit
  dans `c:\dev` — l'étude a dû l'exhumer en section « non-recouvrement », par accident. Le
  trou est **de connaissance, pas technique** : un objet dont le corpus ne parle pas sera
  réinventé au prochain besoin, ou refusé une seconde fois pour des raisons qu'il tient déjà.
  Et le fait établi qui achève O0 : **0 occurrence dans les six documents que le pilot lit pour
  travailler**. O0 est donc réfutée — mais uniquement pour la partie CONNAISSANCE ; O0 reste la
  bonne réponse pour tout ce qui serait un câblage d'écriture, et les options ci-dessous le
  tiennent.
- **O1 — admettre le protocole au corpus documentaire, sans aucun câblage.** *Contenu* : une
  fiche d'inventaire (`INVENTAIRE.md`), une entrée au catalogue disant ce que l'objet fait et
  ce qu'il ne fait pas, et une ligne dans `references\` renvoyant à `protocole\README.md` comme
  référence externe LUE. Aucun hook, aucun dossier écouté, aucune écriture. *Coût* : une fiche,
  une entrée de catalogue, ~0 ligne de code ; le noyau n'est pas touché (l'objet vit dans
  `references\`, plafond de 6 Ko préservé). *Ce qu'elle exclut* : elle ne fait rien fonctionner
  — aucun ticket ne circulera entre le pilot et un produit.
- **O2 — O1, plus l'adoption des invariants comme RÈGLES du pilot.** *Contenu* : O1, plus la
  reprise nominative de trois principes dans `REGLES-PROJET.md`, chacun avec sa provenance :
  « claim = commit = lock » (verrou par l'historique, jamais de verrou parallèle), « pas de
  reçu, pas de done » (la complétion se prouve, ne se déclare pas), « un ticket peut
  RESTREINDRE les permissions, jamais les ÉLARGIR ». *Coût* : trois règles écrites, plus la
  question — non triviale — de leur mécanisation ultérieure. *Ce qu'elle exclut* : toujours
  aucun transport ; les règles s'appliqueraient à un objet que le pilot n'utilise pas encore,
  ce qui est le patron de la règle morte que R-35 dénonce.
- **O3 — O2, plus le câblage RÉEL du transport entre le pilot et un produit.** *Contenu* : le
  hook `PreToolUse` de projet, un `QUEUE_DIR` déclaré, des tickets échangés pour de vrai.
  *Coût* : le câblage lui-même est documenté et ses pièges connus (`local\hook-claude-settings.md`
  : réglages de PROJET et non globaux ; bash de Git explicite contre le bash WSL). Mais il ouvre
  une **surface d'entrée non fiable** dans une session qui a des droits d'écriture. *Ce qu'elle
  exclut* : elle contredit frontalement le refus rendu par TF-0318 le 17/08 sur exactement ce
  point, sans qu'aucun fait nouveau ne soit venu le renverser depuis. Un dossier écouté qui fait
  « enchaîner les développements » heurte `CLAUDE.md` l.84 et la loi 5.
- **O4 — généraliser le protocole comme mécanisme de coordination de l'écosystème.** *Contenu* :
  faire de la file le canal des campagnes multi-dépôts, en remplacement des prompts de campagne.
  *Coût* : plusieurs jours, trois forges au moins, et un état de l'art à instruire pour de bon.
  *Ce qu'elle exclut* : tout, tant qu'O1 n'a pas été faite — on ne généralise pas un objet que
  le corpus ne décrit pas encore.

## 5. Verdict

- **Option retenue** : O2 — admission documentaire, plus les trois invariants portés en règles.
- **Motif opposable** : le trou constaté est **de connaissance** (0 occurrence dans les six
  documents de travail du pilot), et O1 le comble exactement. Le supplément d'O2 est justifié
  par un fait daté, pas par un goût : TF-0318 a buté le 17/08 sur « l'écrivain unique du
  registre produit » et a refusé sa moitié écriture faute de réponse — or `claim = commit =
  lock` **est** cette réponse, éprouvée sur cinq tickets réels. Une réponse trouvée et laissée
  hors du corpus se reperd. À l'inverse, O3 est écartée sur le même constat qui a fondé le refus
  de TF-0318, qu'aucun fait nouveau n'a renversé : la surface d'entrée non fiable reste ouverte
  et le mapping OWASP LLM01 de l'écosystème déclare sa couverture « partielle … ni modèle
  vivant ». O4 est prématurée par construction.
- **Note datée du 23/08/2026 — ce verdict n'est PAS renversé, et il faut le dire précisément.**
  Le dépôt est entré ce jour-là dans la liste des dépôts SUIVIS de `bootstrap.mjs`, sur décision
  humaine confirmée (TF-0535). Cette entrée ne touche à aucun des quatre refus ci-dessous : elle
  ne câble aucun hook, ne déclare aucun `QUEUE_DIR`, n'échange aucun ticket et n'écoute aucun
  dossier. Elle vérifie **une seule chose** — que le dépôt présent sur le poste ne se périme pas
  en silence. Ce qui a changé n'est donc pas le verdict d'admission, mais une conséquence que
  l'inventaire en avait tirée (« hors bootstrap ») et qui ne tenait pas pour un poste où le dépôt
  vit déjà : présent depuis le 2026-07-16, jamais mis à jour, absent du ledger, et nommé par
  aucun contrôle jusqu'au 23/08. *Une admission documentaire sans vérification de fraîcheur
  laisse l'objet admis hors de toute surveillance, ce qui est le contraire d'une admission.*

- **Ce que le verdict REFUSE explicitement** : aucun hook n'est câblé, aucun `QUEUE_DIR` n'est
  déclaré, aucun ticket n'est échangé, aucun dossier n'est écouté par une session. L'admission
  est **documentaire et normative**, pas opérationnelle. Les deux invariants posés par TF-0318
  restent non négociables le jour où O3 reviendrait : un fichier déposé ne peut que **désigner**
  des ids déjà au registre et déjà décidés, et l'engagement de crédit reste un **gate humain**.
- **Preuve d'admission déjà faite (R-33 ter)** : `oracle-scan-agentdef.mjs` exécuté le
  2026-08-18 sur `digit-ai-queue\local\skill-digit-ai-queue\SKILL.md` → **PASS**, aucun défaut
  sur les quatre familles CAP-1..4. Verdict consigné et non bloquant, comme la règle le prévoit.
  Cinq limites sont déclarées par l'oracle lui-même (v0 statique : ni sandbox, ni interprétation
  du prompt par un modèle, ni vérification que les artefacts déclarés existent) — elles sont
  reprises telles quelles, et elles suffisent pour une admission documentaire, pas pour O3.
- **Ce qui est établi sur P2 (l'objet est éprouvé)** : dépôt git daté du 2026-07-16, 18 commits,
  cycle de vie à quatre états matérialisé par les dossiers (`a-faire/`, `en-cours/`,
  `attente-input/`, `termine/`), 5 tickets créés dont **4 bouclés avec reçu structuré**
  (`recus/T-2026-0716-00{1,3,4,5}-recu.md`) et un cinquième passé par `attente-input/` puis
  repris — c'est-à-dire que **le chemin de blocage a réellement été exercé**, pas seulement
  décrit. Le validateur `protocole/scripts/check-ticket.sh` est autoportant (6 champs
  obligatoires, énumération d'assignés paramétrable, exit 0/1/2).
- **Coût** : une fiche d'inventaire, une entrée de catalogue, une entrée `references\`, trois
  règles dans `REGLES-PROJET.md`. Aucune ligne au noyau. **Dette créée, déclarée** : trois
  règles admises portant sur un objet que le pilot n'exécute pas encore — c'est le patron de la
  règle dormante (R-35). Elle est bornée par le plan de revue ci-dessous : si aucun usage n'est
  constaté à la revue, les trois règles se retirent plutôt que de dormir.
- **Candidature(s) émise(s)** : aucune candidature nouvelle. Cette étude n'écrit rien au
  registre (écrivain unique : le pilot). Elle propose UN mouvement : **TF-0329 passe en
  `decide` avec O2 pour plan**, ses refus nommés et son plan de revue.
- **Plan de revue** : 2026-11-17, alignée sur la revue de l'étude 20260817h. Faits confrontés,
  dans cet ordre : (1) les six documents de travail du pilot citent-ils l'objet, et un lecteur
  y trouve-t-il ce qu'il fait ET ce qu'il ne fait pas ? (2) les trois invariants ont-ils servi à
  trancher au moins UNE question réelle depuis l'admission — sinon ils sont dormants et se
  retirent ; (3) TF-0318 ou un successeur a-t-il rouvert la moitié écriture, et sur quel fait
  nouveau ? (4) `digit-ai-queue` a-t-il bougé depuis le 2026-07-16 — un protocole admis puis
  abandonné par son auteur est une référence morte au corpus.
