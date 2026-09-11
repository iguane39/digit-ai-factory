---
role: étude d'opportunité (instruction entre candidat et décidé) — communication, marketing et réponse aux appels d'offres pour Digit-AI (« forge communication & marketing ») ; issue du prompt réécrit par l'analyse L99 du 11/09/2026 et de la décision humaine D-1 (a) du même jour (« exécute le prompt »)
sources_de_verite: [output/03-etudes/20260911-L99-forge-communication-marketing.md (prompt réécrit, chapitre 8), digit-ai-forge-agents/input/03-skills/{digit-ai-communication,digit-ai-propale,digit-ai-propale-review,digit-ai-pptx}.skill (archives décompressées en lecture seule le 11/09, quatre audits ameliore-un-skill), digit-ai-forge-agents/.claude/agents/{contenu-propale,chiffrage-propale,rendu-pptx,review-propale}.md, digit-ai-forge-agents/p4/pv-recette-v2.md (recette C2 du 24/07/2026, lecture seule, contenu client non repris), digit-ai-forge-agents/.claude/skills/quality-oracles/{references/registre-oracles.md,scripts/oracle-pptx.mjs,oracle-charte-pptx-semantique.mjs,oracle-exigences-ao.mjs,oracle-claims.mjs,oracle-nommage.mjs}, digit-ai-forge-agents/.claude/skills/experts-forge/references/registre-experts.md, digit-ai-forge-agents/.gitignore l.35 et README.md l.96-99, catalogues/catalogue.jsonl (cat-des-01, cat-des-06, cat-des-09, cat-seo-01…07, cat-agt-01), ~/.claude/skills/digit-ai-page-html/SKILL.md, references/PRODUCTION-OOXML.md, references/RUN-MANDAT.md, references/RUN-CONSEIL.md, references/INTENTION.md, REGLES-PROJET.md §H (R-28) §K (R-31) et R-38, gabarits/ETUDE-OPPORTUNITE.md, gabarits/documents/catalogue.jsonl, c:/dev/_confidentiel/LISEZMOI.md, todo/TODO.jsonl (antériorité par nom et par structure, 11/09), la-barre/references/registre-barres.md, references/INTEGRATIONS-FOURNISSEURS.md]
verifie_le: 2026-09-11
---

# Étude d'opportunité — communication, marketing et réponse aux appels d'offres pour Digit-AI (« forge communication & marketing ») — 20260911a

Audience : le pilote de l'écosystème, qui décide des mandats, et les forges nommées au verdict,
qui recevront chacune un lot. L'étude instruit la demande du 11/09/2026 telle que réécrite par
l'analyse L99 du même jour, sous la décision humaine prise à sa lecture — « exécute le prompt »,
soit D-1 (a) : la lecture reconstruite de l'intention et les huit écarts à la lettre sont validés.
La question de l'interne (collaborateurs, recrutement) n'a pas été tranchée : elle est traitée ici
comme question ouverte de l'hypothèse H1. **Rectification du 11/09/2026 (décision D-3 (a), « le
spécifique Digit-AI ira dans un projet dédié »)** : le produit autonome de l'objet M4 se nomme
`digit-ai-marketing` ; le nom de travail `digit-ai-communication` employé plus bas désigne ce
même produit (TF-1024 rectifiée ; spécification de création : `output\04-plans\Digit-AI -
Specification Produit - digit-ai-marketing - 20260911a.md`).

Mesures relevées le **2026-09-11** sur les dépôts tels que présents sur le poste (relevé
d'ouverture : forge-agents à jour, forge-design à jour, pilot 2 enregistrements en avance).
**Date de péremption : 2026-11-11** — au-delà, la table de la section 2 doit être rejouée, parce
que les quatre skills examinés sont datés de juillet 2026 et qu'aucune forge ne les versionne :
leur état peut changer sans laisser de trace.

**Ce que le lecteur va apprendre.** La demande ne justifie aucune forge nouvelle, ni unique ni par
métier : chacune des trois partitions échoue au premier critère de la règle d'admission, parce que
les verbes outillés qu'elle exigerait existent déjà dans forge-agents, mais en mauvais état. Ce qui
manque tient en **dix objets** répartis dans **quatre porteurs existants** (forge-agents,
forge-design, le pilot, et un produit autonome à faire naître pour l'instance Digit-AI), plus un
**type de run** pour la réponse à appel d'offres, sur le modèle du run de conseil. Le premier
livrable réel sur lequel la capacité sera exercée n'existe pas encore : c'est le prochain appel
d'offres reçu, et l'étude dit ce qui se rejoue en attendant.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur trois critères. **Objet durable** : chaque option, y compris la plus légère, crée un
skill versionné, un référentiel ou un type de run (règle 31). **Portée** : forge-agents,
forge-design, forge-seo-geo, forge-conception et le pilot sont touchés — cinq, le seuil est à
trois. **Gain et preuve** : gain estimé 3 (chaque propale, chaque publication de Digit-AI passe par
cette capacité), preuve 2 (une seule propale réelle exercée, le 24/07/2026, sous recette C2 ; aucune
mesure de transformation).

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 11/09/2026 : « Je souhaite construire une forge
communication & Marketing, utilisable notamment par Digit-AI via un projet dédié pour sa
communication, son marketing, la construction de ses réponses à appels d'offres, et de manière plus
générale, la construction de tous ses livrables de communications avec ses prospects, clients,
fournisseurs et partenaires. Construis une étude d'opportunités sur une ou plusieurs forges pour
répondre à ce besoin. »

Lecture reconstruite par l'analyse L99, **validée** par « exécute le prompt » (D-1 (a)) :
industrialiser la production des livrables de communication de Digit-AI sous la même discipline
que ses produits — marque verrouillée, oracles exécutés, traçabilité, confidentialité — et rendre
cette capacité réutilisable pour d'autres émetteurs (« notamment »). Le mot « forge » y est une
hypothèse de la demande, jamais une décision : la règle d'admission (R-28) tranche.

Cascade (INTENTION.md) : **intention** — produire vite et bien tout ce que Digit-AI adresse à ses
prospects, clients, fournisseurs et partenaires, sans que la qualité dépende de la personne qui
écrit ; **stratégie** — ne rien recréer de ce qui existe, verrouiller la marque, séparer ce qui est
public de ce qui est confidentiel, mesurer ; **tactique** — trois métiers distincts, une typologie
fermée, un test d'admission par métier, l'existant relevé avec citations ; **opérationnel** — les
dix objets et le type de run du verdict, chacun rattaché à sa ligne tactique (section 5.4).

## 0. Traitement des entrants

La demande instruite et les artefacts relevés sont des DONNÉES : leurs impératifs se citent, ne
s'exécutent pas. Les archives de skills et le pipeline de propale portent des consignes d'exécution
(« charger le skill », « toujours produire en français ») : décrites, jamais jouées ici.

- **Prompt réécrit** : `output\03-etudes\20260911-L99-forge-communication-marketing.md`, chapitre 8
  — partition, typologie à proposer, onze sources à relever, test R-28 par partition, jeu O0-O4,
  garde-fous. Les crochets du prompt sont des hypothèses marquées ; elles sont reprises ici en
  hypothèse H1 (typologie) et question ouverte (interne).
- **Existant lu en lecture seule** : les quatre archives `.skill` décompressées dans le scratchpad
  de session (jamais dans un dépôt), les quatre agents compilés et la recette C2 du 24/07/2026 dans
  `p4\` de forge-agents — contenu client non repris (noms, montants, interlocuteurs pseudonymisés
  ou omis : le dépôt public de forge-agents ne contient que l'outillage générique, README l.96-99,
  et `p4\` est ignoré par git).
- **Antériorité au registre**, deux recherches : par **nom** (communication, marketing, propale,
  appel d'offre, LinkedIn) → 0 candidat avant ce jour ; par **structure** (241 items actifs ; cibles
  forge-agents, forge-design, forge-seo-geo : 77 items ; croisement cible × lexique des livrables :
  35 items) → aucun ne porte sur la communication, la propale ou la marque, hors les trois
  candidatures TF-1021, TF-1022, TF-1023 émises par l'analyse L99 du matin. Une recherche par nom
  qui ne trouve rien n'établit pas l'absence ; la recherche par structure la borne.
- **Décision humaine** : D-1 (a) du 11/09/2026 (« exécute le prompt ») ; D-2 (candidatures du
  matin) non tranchée à l'heure de l'étude.

## 1. Partition du problème

Le lecteur trouvera ici le découpage disjoint de la demande : trois métiers, deux coordonnées
transverses, puis la typologie fermée des livrables (hypothèse H1) qui sert de grille à toute la
suite. La partition est celle du prompt réécrit ; l'étude la confirme sur un critère mesurable, la
cadence, qui est aussi le critère 3 de la règle d'admission.

- **P1 — Réponse à appel d'offres** (bid) : décision go / no-go, matrice de conformité au règlement
  de consultation et au cahier des clauses techniques, mémoire technique, pièces administratives,
  bordereau de prix, dépôt sur le profil d'acheteur dans les délais. Cadence **événementielle à
  échéance**.
- **P2 — Marketing** : positionnement, offres, cibles et personas, contenu (le référencement
  naturel et la visibilité dans les moteurs d'IA sont forge-seo-geo), nurturing, mesure. Cadence
  **continue, par campagne**.
- **P3 — Communication** : messages, ton, publications, courriers, kits partenaires et
  fournisseurs, presse, interne (question ouverte). Cadence **au fil de l'eau**.
- **T1 — Marque et rendu** : système de marque, decks, documents bureautiques, pages, visuels —
  forge-design et les skills de rendu.
- **T2 — Capacité contre instance** : la capacité (skills, oracles, gabarits, type de run) est
  publique et agnostique de la marque ; l'instance Digit-AI (marque, offres, références, prix,
  interlocuteurs, issues d'appels d'offres) est confidentielle et vit hors de tout dépôt publié.

### Hypothèse H1 — typologie fermée livrable × public × format

**Mode de lecture du tableau.** Une ligne vaut un type de livrable ; les colonnes disent le public
qui le reçoit, le format de sortie, la partition qui le porte et l'existant qui le couvre aujourd'hui
(cité en section 2). Les lignes sont classées par partition (P1 puis P2 puis P3), puis par
fréquence d'usage décroissante. La typologie est une hypothèse à valider : une ligne peut être
retirée ou ajoutée par le demandeur sans que le verdict change, sauf pour les lignes L1, L2 et L7,
qui portent les manques du verdict.

| # | Livrable | Public | Format | Partition | Existant |
|---|---|---|---|---|---|
| L1 | Réponse à appel d'offres public : mémoire technique à trame imposée, pièces, bordereau de prix | prospects (acheteurs publics) | DOCX ou PDF imposé, dépôt sur profil d'acheteur | P1 | contenu et chiffrage couverts ; rendu à trame imposée non couvert ; matrice de conformité non couverte |
| L2 | Proposition commerciale privée (propale) | prospects, clients | PPTX, PDF | P1 | couvert de bout en bout (contenu, chiffrage, rendu, revue, oracles) — en mauvais état |
| L3 | Revue de propale avant envoi | interne au métier P1 | rapport MD + fiche HTML | P1 | couvert |
| L4 | Pitch ou présentation orale (deck + script) | prospects | PPTX + plan | P1, P3 | couvert (presets « pitch », « conférence ») |
| L5 | Fiche offre, plaquette, page d'atterrissage | prospects | PDF, HTML | P2 | page HTML couverte par le socle ; contenu marketing non couvert ; visibilité couverte par forge-seo-geo |
| L6 | Publication réseau (150 à 300 mots) | prospects, partenaires | texte | P2, P3 | dosage couvert (presets), aucun oracle |
| L7 | Courriel de prospection et séquence de relance | prospects | texte | P2 | séquence de relance couverte (propale-review), prospection non couverte |
| L8 | Note, compte rendu, support de comité de pilotage | clients | MD, PPTX | P3 | couvert (presets « COPIL », « note/email » ; rendu PPTX) |
| L9 | Support de formation, de lancement de mission | clients | PPTX | P3 | couvert (skill PPTX : « supports de formation, kickoffs ») |
| L10 | Kit partenaire, charte de partenariat, courrier fournisseur | partenaires, fournisseurs | DOCX, PDF | P3 | non couvert : aucun preset, aucun gabarit |
| L11 | Étude de cas, référence client | prospects | PDF, HTML | P2 | non couvert ; dépend d'un accord client |
| L12 | Communication interne (collaborateurs, recrutement) | interne | texte, HTML | P3 | question ouverte — hors typologie tant que non confirmée |

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable, relue le 11/09/2026 en lecture seule ; le verdict nomme
les livrables de H1 que l'existant couvre. Le lecteur y verra que l'existant couvre déjà L2, L3, L4,
L8 et L9 en entier, et que les manques réels sont concentrés sur L1, L5 à L7, L10 et L11, plus
l'état de la marque.

**Mode de lecture du tableau.** Une ligne vaut un élément de l'existant ; la citation est un
fichier, une ligne ou un identifiant de catalogue ; le verdict dit « recouvre » suivi des livrables
couverts, ou « ne recouvre pas » suivi de ce qui manque. Les lignes suivent l'ordre des sources du
prompt réécrit.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Skill `digit-ai-communication` (forge-agents, archive) | SKILL.md : « presets de réglage par type de livrable — propale, conférence, formation, COPIL, pitch, note/email, négociation » ; `references/presets-livrables.md`, `corpus-patterns.md` | **recouvre** le dosage du message pour L2, L4, L6, L8, L9 ; ne recouvre pas L10, L11 (aucun preset partenaire, fournisseur, étude de cas) |
| Skill `digit-ai-propale` v1.1.2 (forge-agents, archive) | SKILL.md : « deux gabarits canoniques (Trajectoire produit / Sommaire numéroté), la variante lot suivant, la grammaire commerciale, les personas, les règles dures de chiffrage » ; « le rendu PPTX est intégralement délégué au skill digit-ai-pptx » | **recouvre** le contenu et le chiffrage de L2 ; ne recouvre pas le rendu à trame imposée de L1 (le rendu est PPTX seulement) ni la matrice de conformité |
| Skill `digit-ai-propale-review` (forge-agents, archive) | SKILL.md : « grille canonique en 7 dimensions notées /5 … verdict Envoyer / Retravailler / Refondre, top 5 corrections … séquence de relance » ; `scripts/extract_propale.py`, `templates/rapport-review.html` | **recouvre** L3 et la relance de L7 ; ne recouvre pas la prospection initiale |
| Skill `digit-ai-pptx` v2.5.0 (forge-agents, archive) | SKILL.md : « propales commerciales, plans de transformation, supports de formation, kickoffs, comités de pilotage, restitutions » ; « Charger references/charte.md — toujours » ; archive : 4 fichiers, aucun `references/charte.md`, `layouts.md`, `assets.md` | **recouvre** le rendu PPTX de L2, L4, L8, L9 — **charte absente du paquet** ; ne recouvre pas DOCX/PDF à trame imposée (L1, L10) |
| Pipeline P4 (forge-agents, agents compilés) | `.claude/agents/contenu-propale.md`, `chiffrage-propale.md`, `rendu-pptx.md`, `review-propale.md` ; `defs-p4/recette-c2.yaml` ; `p4/pv-recette-v2.md` : « oracles réellement exécutés : oracle-exigences-ao, oracle-claims, oracle-calculs, oracle-coherence, oracle-charte-pptx-semantique, oracle-pptx, oracle-nommage » (24/07/2026) | **recouvre** L2 de bout en bout, exercé une fois sous recette ; les artefacts vivent sous `p4\`, ignoré par git |
| Oracles de propale (forge-agents, `quality-oracles`, versionnés en source) | `registre-oracles.md` l.15 (`oracle-pptx.mjs` : zip, Content_Types, smoke-test LibreOffice), l.25 (`oracle-charte-pptx-semantique.mjs` S1-S4), l.27 (`oracle-exigences-ao.mjs` X1-X3 : exigences tracées, rubriques à l'identique, pièces livrées), l.45 (`oracle-claims.mjs` : montant sans source = bloquant) | **recouvre** le jugement de L1 (traçabilité des exigences) et de L2 (rendu, charte, chiffres) ; ne recouvre pas la construction du référentiel d'exigences depuis un règlement de consultation (fait à la main le 24/07 : `p4/referentiel-exigences-ao.md`) |
| Experts admis (forge-agents, `experts-forge`) | `registre-experts.md` l.13 `marches-publics-ao` (ok, 24/07/2026), l.16 `copilot-m365` (ok), l.19 `seo-web` (ok) ; fiche `expert-conformite-rgpd-ia.md` | **recouvre** l'expertise marchés publics de L1 et la conformité ; ne recouvre pas la mesure marketing (P2) |
| forge-design | `catalogue.jsonl` cat-des-01 « Système de marque : tokens.css + MARQUE.md », cat-des-06 « Générer les visuels », cat-des-09 « Contrôler la généricité d'une interface » ; recherche `MARQUE.md` / `tokens.css` Digit-AI sur le poste : 0 fichier | **recouvre** T1 comme verbe ; **ne recouvre pas** l'instance : aucun système de marque Digit-AI n'a été joué, et deux chartes contradictoires coexistent (pptx : Montserrat / Inter / #2563EB ; page-html : Roboto / DM Sans) |
| forge-seo-geo | `catalogue.jsonl` cat-seo-01 à cat-seo-07 (mission d'audit, 87 nœuds, rapport HTML, runs de suivi, CSV d'actions) ; fiche : « le volet GEO (nœuds 53-58) entre au nom » | **recouvre** la visibilité de L5 (référencement, moteurs d'IA) ; ne recouvre pas le contenu marketing ni sa mesure de transformation |
| Socle `digit-ai-page-html` et `digit-ai-schemas` (installés) | SKILL.md l.4 : « pages HTML autonomes au socle commun Digit-AI … charte (Roboto titres / DM Sans corps) … script de conformité … oracle zéro défaut visuel » | **recouvre** le rendu HTML de L5, L11 ; ne recouvre pas leur contenu |
| `references\PRODUCTION-OOXML.md` (pilot) | « Production d'un document OOXML depuis une référence client — relevé de charte et gates » ; « le relevé de charte : trois gestes, AVANT d'écrire une ligne (TF-0687) » ; « le contrôle d'ordre des enfants : bloquant AVANT remise (TF-0686) » | **recouvre** la méthode du rendu DOCX à trame imposée (L1, L10) ; ne recouvre pas le verbe : c'est une référence, pas un skill outillé |
| `gabarits\documents\catalogue.jsonl` (pilot) | familles : rapport-audit, synthese-lineage, note-de-synthese, revue-raid, rapport-avancement, compte-rendu-reunion, rex-fin-de-mission, suivi-benefices — aucune famille partenaire, fournisseur, étude de cas | **ne recouvre pas** L10, L11 |
| Skill `la-barre` (forge-agents, installé) | `registre-barres.md` : aucune entrée contenant propale, communication, marketing, pitch ou LinkedIn (grep du 11/09) | **ne recouvre pas** : aucune barre externe pour aucun livrable de H1 |
| Canal confidentiel et porte de publication (pilot) | `c:\dev\_confidentiel\LISEZMOI.md` : « tables\ (noms-interdits.json, produits-pseudonymes.json) », « entrants\ … un fichier par remise » ; `oracle-nom-client-publie` joué au pre-push | **recouvre** T2 pour les noms et les entrants ; ne recouvre pas l'hébergement de l'instance (offres, prix, personas, issues d'appels d'offres) |
| Types de run du pilot | `RUN-MANDAT.md` : « quand le livrable est un document » ; `RUN-CONSEIL.md` : « quand le livrable est une trajectoire », né « du GO humain du 19/08/2026 sur l'étude forge-consulting (verdict O1) » | **recouvre** partiellement L2 (un document sous socle) ; **ne recouvre pas** P1 : ni go / no-go, ni échéance, ni entrants tiers à consignes, ni pièces administratives, ni dépôt |
| `references\INTEGRATIONS-FOURNISSEURS.md` (pilot) | 0 occurrence de Canva, LinkedIn, HubSpot (grep du 11/09) | **ne recouvre pas** : aucun connecteur déclaré pour la diffusion ; tout usage serait une affordance non câblée (loi n° 1) |
| Registre TODO-FORGE (antériorité) | par nom : 0 ; par structure : 35 items, dont TF-1021, TF-1022, TF-1023 du matin | **ne recouvre pas** hors les trois candidatures du matin, reprises au verdict |

### 2 bis. État des quatre skills — audits `ameliore-un-skill` du 11/09/2026

Les quatre archives ont été auditées en lecture seule par quatre agents distincts, chacun chargeant
le skill `ameliore-un-skill` (grille canonique à 7 dimensions notées sur 5, red flags bloquants,
verdict Ajuster / Renforcer / Refondre). Les rapports complets sont dans le scratchpad de session ;
ce qui suit est ce qui pèse sur le verdict.

**Mode de lecture du tableau.** Une ligne vaut un skill ; les colonnes donnent le verdict du grille,
les liens morts (fichiers cités par SKILL.md et absents du paquet), les valeurs en dur qui lient le
skill à une marque ou à des personnes, et ce qui manque pour qu'il soit exercé sous oracle.

| Skill | Verdict audit | Liens morts | Valeurs en dur | Manque pour être exercé |
|---|---|---|---|---|
| `digit-ai-communication` | **Ajuster** — 27/30 sur les dimensions évaluables (pas de scripts), zéro red flag | aucun (contrôle exécuté : `missing: []`) ; un renvoi mort dans `presets-livrables.md` vers « le compositeur de messages », introuvable dans l'écosystème | aucune donnée périssable ni confidentielle ; branding cosmétique (`digit-ai-*`), contenu rhétorique agnostique | aucun oracle ni contrat de sortie vérifiable : la « Sortie » en 7 points n'a pas de critère binaire |
| `digit-ai-propale` v1.1.2 | **Renforcer** — ≈ 21/35 sur six dimensions évaluables (pas de scripts) | aucun (5 chemins relatifs, tous présents) ; référence à un skill `digit-ai-prospection` introuvable ; aucune clause d'exclusion dans la description | **cinq clients ou prospects réels nommés dans 4 des 5 références (11 occurrences, avec pile technique, dates, volumétries)** — en contradiction avec sa propre règle dure 2 (aucune migration de nom de client entre propales) | rendu PPTX seul ; aucun oracle embarqué (deck fantôme et lisibilité sont des contrôles textuels manuels) ; la vérification réelle est déléguée à `digit-ai-propale-review` |
| `digit-ai-propale-review` | **Renforcer** — 28/35, aucun red flag de conception | aucun sur les fichiers propres (grille, objections, relance, template, script présents) ; un renvoi vers un skill `pdf-reading` introuvable dégrade la voie PDF (1 format sur 3) | l'exemple d'invocation nomme deux fois un client potentiellement réel ; template HTML charté Digit-AI (cohérent avec son objet), `© 2026` en dur | `extract_propale.py` valide (109 lignes, stdlib + python-pptx, s'exécute sans crash à vide) ; contrat de sortie binaire (7 dimensions + D8 + red flags + 3 seuils) — il manque une fixture double sens et une calibration du juge |
| `digit-ai-pptx` v2.5.0 | **Refondre** — 15/35 (seuil 21), red flag de conception | **11 liens morts sur 14 ressources citées (79 %)** : `references/charte.md` (« toujours »), `layouts.md`, `assets.md`, `scripts/inject_canonical_slide.py` (pivot du cas « intégrer un slide canonique »), et sept autres | Montserrat / Inter, `#2563EB`, `#FAFBFF` en dur ; verrouillé Digit-AI sans renvoi vers `systeme-de-marque` ; identifiants de dossiers de partage en dur dans les scripts | seule la brique images fonctionne (`py_compile` PASS, Pillow non déclarée, accès réseau fragile) ; la passe QA finale (rastérisation, inspection) est **décrite, pas outillée** : aucun script ne rend PASS / FAIL |

Deux faits des audits pèsent directement sur le verdict et n'étaient pas visibles depuis les
seuls SKILL.md : le skill de propale porte **des noms de clients réels dans ses références**, ce qui
interdit de le versionner tel quel dans un dépôt publié (T2 : la partie confidentielle doit en
sortir avant le versionnement en source, M1) ; et le skill PowerPoint est à **refondre**, pas à
compléter — sa charte et ses scripts pivots n'existent que dans sa description (M2).

Constat commun, indépendant des notes : les quatre skills sont des archives sous un dossier ignoré
par git (`.gitignore` l.35), non installées au poste (24 skills installés, aucun des quatre), et
le pipeline versionné qui les appelle ne peut pas être rejoué depuis un clone (TF-1021).

### 2 ter. Test d'admission R-28, joué par partition

Le lecteur trouvera ici le test que le prompt exige et que la lettre de la demande sautait : une
forge naît si et seulement si elle porte au moins deux verbes outillés absents partout ailleurs,
prouvés par non-recouvrement écrit, naît exercée, a une cadence propre, et intègre les surfaces le
jour même (R-28, `REGLES-PROJET.md` §H).

**Mode de lecture du tableau.** Une ligne vaut une partition ; chaque colonne est un critère de
R-28, avec le fait qui le tient ou le fait défaut ; la dernière colonne est le verdict d'admission.
Un seul critère en défaut suffit à refuser la forge.

| Partition | 1. ≥ 2 verbes absents ailleurs | 2. v0 exercée | 3. Cadence propre | 4. Surfaces le jour même | Admission |
|---|---|---|---|---|---|
| P1 appel d'offres | **non** : contenu, chiffrage, rendu, revue et cinq oracles existent dans forge-agents ; les deux verbes manquants (référentiel d'exigences depuis un règlement de consultation ; rendu DOCX à trame imposée) sont des extensions de skills existants, pas des verbes sans porteur | oui, une fois (24/07/2026, recette C2) | **oui** — événementielle, à échéance | non testé | **refusée** — critère 1 |
| P2 marketing | **non** : la visibilité est forge-seo-geo, le dosage est digit-ai-communication, la page est le socle HTML ; le verbe manquant (mesure de transformation) n'a pas de donnée sans connecteur payant | non | oui — continue | non testé | **refusée** — critère 1 |
| P3 communication | **non** : les presets couvrent COPIL, note, pitch ; ce qui manque (kits partenaires et fournisseurs) est un gabarit de document, objet du catalogue du pilot | non | oui — fil de l'eau | non testé | **refusée** — critère 1 |
| P1 + P2 + P3 en une forge | **non** : chaque partition échoue, et trois cadences ne font pas une cadence propre (critère 3 en défaut par construction) | partiel | **non** | non testé | **refusée** — critères 1 et 3 |

Corollaire de R-28 : ce qui reste est un ensemble de skills à versionner et étendre, un système de
marque à jouer, des gabarits à créer, un référentiel et un type de run — jamais une forge.

## 3. État de l'art daté

Le lecteur y trouvera sept sources de moins de 24 mois qui pèsent sur le verdict : elles disent que
la génération assistée de réponses à appels d'offres est devenue banale mais jamais fiable sans
revue humaine, que la transparence des contenus générés devient une obligation le 2 août 2026,
que le format de jetons de marque a atteint sa version stable, que les acheteurs B2B se méfient
précisément du contenu générique, et que la notation par rubrique reste le mode de jugement
opposable d'un texte généré.

**Mode de lecture du tableau.** Une ligne vaut une source ; les colonnes donnent le nom, la date
(année et mois au minimum), le localisateur, et ce que l'étude en retient. Les lignes sont classées
par partition concernée (P1, puis transverse, puis P2, puis jugement).

| Source | Date | Localisateur | Ce que l'étude en retient |
|---|---|---|---|
| Loopio, « 2026 Rankings: The 7 Best AI Tools for RFP Responses » et « Best RFP Response Management Software » | 2026-01 | loopio.com/blog/best-ai-software-rfp-responses/ | L'usage de l'IA générative dans les équipes de réponse a doublé en un an (34 % → 68 %) ; tous les éditeurs livrent une génération de premier jet ; « neither platform's AI can be trusted to submit without human review » (comparatif autorfp.ai, 2026). Pour P1 : la génération est acquise, la valeur est dans la revue et la traçabilité des exigences — ce que `oracle-exigences-ao` et `digit-ai-propale-review` font déjà. |
| marche-public.fr, « Dématérialisation des marchés publics : textes 2026 » ; décret n° 2025-1386 du 29/12/2025 (seuil 60 000 € HT au 2026-04-01) | 2026-04 | marche-public.fr/Dematerialisation/Dematerialisation-des-procedures.htm | Réponse électronique obligatoire sur le profil d'acheteur (« salle des marchés », jamais la messagerie), DUME réutilisable, signature à l'attribution seulement, eForms et données essentielles en vigilance 2026. Pour P1 : le dépôt et les pièces administratives sont des gestes humains outillables par liste de contrôle, pas par génération. |
| Commission européenne, « Transparency obligations under Article 50 of the AI Act » (FAQ) et Orrick, « EU AI Act — Transparency Obligations for AI-Generated Content (Article 50) » | 2026-08 | digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act ; orrick.com/en/Insights/2026/08/… | Obligations applicables depuis le 2026-08-02 : marquage lisible par machine des sorties génératives, information des personnes ; l'accord « AI Omnibus » de 2026-05 laisse jusqu'au 2026-12-02 aux systèmes déjà sur le marché pour le marquage. Portée explicite sur « marketing content, social media posts, websites, advertising » (DarwinApps, 2026). Pour T2 et P2 : la capacité doit porter une règle de transparence dans `MARQUE.md` et un contrôle de marquage — objet neuf. |
| Design Tokens Community Group (W3C), « Design Tokens specification reaches first stable version » — Format Module 2025.10 | 2025-10-28 | w3.org/community/design-tokens/2025/10/28/… ; designtokens.org/tr/2025.10/format/ | Première version stable : « theming and multi-brand support … one token file generates platform-specific code ». Pour T1 : le système de marque de forge-design (cat-des-01, DTCG D1-D3 déjà au registre des oracles) est le bon porteur d'une marque multi-support ; deux chartes en dur dans deux skills est l'anti-modèle. |
| MarketScale, « 94 % of B2B buyers fact-check AI research outputs » (enquête TrustRadius / 6sense citée) et NIM, « Transparency without trust » | 2025-11 | marketscale.com/industries/business-services/94-of-b2b-buyers-fact-check-ai-research-outputs… ; nim.org/en/publications/detail/transparency-without-trust | 72 % des acheteurs vérifient toujours ou très souvent les informations générées (58 % l'année précédente) ; un contenu étiqueté « généré par IA » est jugé moins naturel et moins utile à contenu identique. Pour P2 et P3 : le risque de premier ordre est le contenu générique reconnaissable ; la parade est une barre externe par livrable et des faits sourcés (`oracle-claims`). |
| arXiv 2605.30568, « Generating and Refining Dynamic Evaluation Rubrics for LLM-as-a-Judge » ; arXiv 2601.08430, « RubricHub » | 2026-05 | arxiv.org/html/2605.30568v1 ; arxiv.org/pdf/2601.08430 | Un score global direct est « unstable and biased » ; la notation par rubrique décomposée en critères interprétables est la forme retenue par la recherche 2025-2026, avec correction de biais du juge. Pour L3 : la grille à 7 dimensions de `digit-ai-propale-review` est conforme à l'état de l'art ; ce qui lui manque est une fixture double sens et une calibration du juge. |
| arXiv 2609.02942, « Judging LLM-as-a-Judge: Concerning Rubric Artifacts » | 2026-09 | arxiv.org/html/2609.02942 | Les rubriques peuvent introduire des artefacts que le juge apprend à récompenser. Pour L3 et pour toute barre : la rubrique se valide contre des livrables réels jugés par un humain (précédent forge-design B1-B4 : oracles verts, direction rejetée). |

## 4. Options — jeu fermé O0-O4

Cinq options, celles du prompt réécrit. Chacune porte son contenu, son coût en complexité × durée,
ce qu'elle exclut, la frontière qu'elle trace avec forge-design, forge-seo-geo, forge-agents et le
canal confidentiel, et le porteur des manques. Le lecteur verra que les options se départagent sur
deux questions seulement : faut-il un dépôt de plus, et faut-il un type de run.

**O0 — ne rien faire.** Réfutée. Coût du statu quo, mesuré : quatre skills exercés hors de tout
versionnement (TF-1021), une charte PowerPoint absente du paquet qui la charge (TF-1022), une marque
portée par deux chartes contradictoires (TF-1023), aucune barre externe, aucune mesure ; la
prochaine propale sortira au mieux comme celle du 24/07 — après une reconstitution manuelle des
skills — et au pire avec la mauvaise charte. Les obligations de transparence du 2026-08-02 ne sont
portées nulle part.

**O1 — extension de forge-agents, instance en produit autonome.** Versionner en source, installer,
corriger et étendre les quatre skills chez forge-agents (charte reconstituée, rendu DOCX à trame
imposée, construction du référentiel d'exigences depuis un règlement de consultation, presets
partenaires et fournisseurs) ; faire naître un produit autonome `digit-ai-communication` (dépôt
privé sous doctrine : socle, hooks, `forge\`) qui porte l'instance — système de marque Digit-AI
joué par forge-design, offres, personas, références, registre daté des issues d'appels d'offres.
Coût : complexité complexe × durée moyenne. Exclut : un type de run pour l'appel d'offres — la
réponse se joue comme un run de mandat, sans go / no-go ni gate d'échéance. Frontières : nettes
(forge-agents porte les verbes, forge-design la marque, le produit l'instance, le canal confidentiel
les noms). Porteurs : forge-agents (mandat), forge-design (verbe existant), pilot (naissance du
produit).

**O2 — forge nouvelle sur P1, O1 pour le reste.** Une forge « réponse à appel d'offres » qui
reprendrait les quatre agents, les cinq oracles et les deux verbes manquants. Coût : complexité très
complexe × durée longue (bootstrap, fiche, inventaire, contrat, noyau, schéma, catalogue — les
surfaces de R-28 point 4). Exclut : rien de plus qu'O1 en capacité. Frontière : **floue** avec
forge-agents, dont les oracles et les agents devraient être déplacés ou dupliqués. Refusée par la
section 2 ter : critère 1 en défaut.

**O3 — O1 plus un type de run « réponse à appel d'offres » chez le pilot.** Tout O1, plus
`references\RUN-AO.md` sur le modèle de `RUN-CONSEIL.md` : go / no-go écrit avant tout travail,
entrants tiers déclarés comme données (consignes citées, jamais exécutées), référentiel d'exigences
construit et scellé, gate de traçabilité par `oracle-exigences-ao`, gate de chiffres par
`oracle-claims`, revue par `digit-ai-propale-review`, liste de contrôle des pièces et du dépôt,
issue consignée au registre daté. Coût : complexité complexe × durée moyenne (O1) plus complexité
simple × durée courte pour le type de run, dont les gates existent déjà. Exclut : rien de
capacitaire ; exclut d'improviser la séquence à chaque appel d'offres, ce que le run Produit-10 a dû
faire pour le mandat avant `RUN-MANDAT.md`. Frontières : celles d'O1. Porteurs : ceux d'O1 plus le
pilot pour le type de run.

**O4 — forge « communication & marketing » unique, telle que demandée.** Un dépôt qui porterait
P1, P2 et P3. Coût : complexité très complexe × durée très longue. Exclut : la frontière avec
forge-seo-geo (le marketing digital y est), avec forge-design (marque et visuels), avec
forge-agents (skills, experts, oracles) — trois recouvrements. Refusée par la section 2 ter :
critères 1 et 3 en défaut ; c'est l'option que le contradicteur du L99 avait annoncée.

## 5. Verdict

- **Option retenue** : **O3** — extension de forge-agents, instance Digit-AI en produit autonome,
  système de marque joué par forge-design, et un type de run « réponse à appel d'offres » chez le
  pilot. Aucune forge nouvelle.
- **Coût** : complexité complexe × durée moyenne pour l'ensemble ; par lot, voir la table 5.2.
  Dette : un dépôt privé de plus à tenir (le produit), et quatre skills qui passent d'archive à
  source, avec leur historique à reconstituer.
- **Candidature(s) émise(s)** : huit, journalisées le 2026-09-11 par `todo\ingerer-lot.mjs`
  depuis `input\01-candidatures\forge-communication-verdict-o3-20260911a.tf.jsonl` (lot
  55e62d952490 : TF-1024 produit autonome, TF-1025 type de run, TF-1026 référentiel d'exigences
  outillé, TF-1027 rendu OOXML, TF-1028 barres, TF-1029 gabarits, TF-1030 transparence, TF-1031
  registre des issues ; `oracle-todo` PASS), en plus des trois du matin (TF-1021, TF-1022, TF-1023) que le verdict
  reprend sans les dupliquer.
- **Plan de revue** : **2026-10-09** — confrontation du verdict au premier appel d'offres reçu (ou,
  à défaut, à la rejouée pseudonymisée du cas du 24/07) et à l'état des skills chez forge-agents.
- **Test rétro** : joué en section 5.4, depuis chaque élément opérationnel jusqu'à l'intention ;
  un élément retiré.
- **Premier livrable réel** : le prochain appel d'offres ou la prochaine propale reçus par Digit-AI,
  à désigner par l'humain au moment où il arrive (action au bloc 8 de la restitution). En attendant,
  la v0 se rejoue sur le cas du 24/07/2026 pseudonymisé, présent sous `p4\` : c'est une fixture
  réelle, pas un cas neuf, et l'étude le dit.
- **Prérequis de tout rendu** : le système de marque Digit-AI (cat-des-01) joué avant le premier
  livrable ; une barre externe (`la-barre`) par type de livrable retenu (L1, L2, L6 au minimum) ;
  la règle de transparence de l'article 50 écrite dans `MARQUE.md`.

### 5.1 Les dix objets, typés et attribués

**Mode de lecture du tableau.** Une ligne vaut un manque ; les colonnes disent son type (verbe
outillé, référentiel versionné, gabarit, type de run, produit), son porteur selon les frontières
écrites, le livrable de H1 qu'il sert, et la candidature qui le porte (TF existant, ou « sidecar »
pour celles émises par cette étude). Les lignes sont classées par chemin critique (ce qui
conditionne le reste d'abord).

| # | Manque | Type | Porteur | Sert | Candidature |
|---|---|---|---|---|---|
| M1 | Les quatre skills versionnés en source, installés, sous self-test | verbes outillés (existants, à porter) | forge-agents | L2, L3, L4, L8, L9 | TF-1021 |
| M2 | Charte du skill PowerPoint reconstituée, puis remplacée par la consommation des jetons de marque | référentiel dans un skill | forge-agents | L2, L4, L8, L9 | TF-1022 |
| M3 | Système de marque Digit-AI (tokens.css + MARQUE.md), une seule charte, deux supports | instance (verbe existant cat-des-01 à jouer) | forge-design (verbe), produit (artefacts) | tous | TF-1023 |
| M4 | Produit autonome `digit-ai-communication` : dépôt privé sous doctrine portant marque, offres, personas, références, registre des issues | produit | pilot (naissance), puis le produit lui-même | tous | sidecar |
| M5 | Type de run « réponse à appel d'offres » (`RUN-AO.md`) : go / no-go, entrants = données, référentiel d'exigences scellé, gates existantes, pièces et dépôt, issue consignée | type de run | pilot | L1, L2 | sidecar |
| M6 | Construction outillée du référentiel d'exigences depuis un règlement de consultation et un cahier des clauses (aujourd'hui à la main) | verbe outillé, jugé par `oracle-exigences-ao` | forge-agents (`digit-ai-propale`) ; forge-conception consultée (`qualifie-l-entrant`, type d'entrant « appel d'offres ») | L1 | sidecar |
| M7 | Rendu DOCX ou PDF à trame imposée, sous les gates de `PRODUCTION-OOXML.md` | verbe outillé | forge-agents (skill de rendu OOXML, frère de `digit-ai-pptx`) | L1, L10 | sidecar |
| M8 | Barres externes par livrable : propale, mémoire technique, publication réseau | barres (`la-barre`) | forge-agents (registre des barres) | L1, L2, L6 | sidecar |
| M9 | Gabarits de documents : kit partenaire, charte de partenariat, courrier fournisseur, étude de cas | gabarits (catalogue `gabarits\documents`) | pilot | L10, L11 | sidecar |
| M10 | Transparence des contenus générés (article 50) : règle dans `MARQUE.md`, marquage et contrôle sur les livrables publics | référentiel versionné + contrôle | forge-design (règle de marque), forge-agents (contrôle) | L5, L6, L11 | sidecar |
| M11 | Registre daté des issues d'appels d'offres (gagné, perdu, sans suite, motif) et mesure de transformation | donnée volatile (loi n° 4) | produit `digit-ai-communication` | L1, L2 | sidecar |

Onze lignes pour dix objets neufs et un existant à porter (M1) : les trois premières sont les
candidatures du matin, les huit suivantes sont émises par cette étude.

### 5.2 Plan de mise à jour par canal, ordonné par chemin critique

**Mode de lecture du tableau.** Une ligne vaut un lot ; les colonnes disent le canal (mandat
d'écriture chez une forge, run du pilot, naissance de produit), l'effort en complexité × durée, la
preuve de « prêt » exigée et la conséquence de ne pas le faire. L'ordre est celui des dépendances :
un lot ne démarre pas avant ceux qu'il cite.

| Lot | Contenu | Canal | Effort | Preuve de « prêt » | Si non fait |
|---|---|---|---|---|---|
| L-A | M1 + M2 : versionner les quatre skills en source, installer, charte reconstituée, self-test double sens par skill | mandat humain d'écriture chez forge-agents | moyen × court | `bootstrap --pull` : quatre skills installés ; self-test 4/4 ; `oracle-skills` PASS sur les liens internes | tout le reste se construit sur des archives |
| L-B | M3 : système de marque Digit-AI | run de mandat forge-design (verbe cat-des-01), artefacts déposés chez le produit | simple × court | `tokens.css` + `MARQUE.md` jugés par les oracles tokens T1-T6 et DTCG D1-D3 ; `digit-ai-pptx` et `digit-ai-page-html` consomment la même source | rendu générique ou contradictoire (loi n° 6) |
| L-C | M4 : naissance du produit `digit-ai-communication` | ouverture de run du pilot (socle, git local, héritage, oracle de conformité PASS) — dépôt privé | moyen × court | `oracle-conformite-projet` PASS ; `oracle-confidentiel` : dépôt privé ; porte de publication : 0 nom | l'instance reste éparse entre `p4\`, des archives et des têtes |
| L-D | M5 : `RUN-AO.md` | référence du pilot, index mis à jour, contrôle `oracle-claude-md` N3 | simple × court | fixture : la séquence rejouée sur le cas du 24/07 pseudonymisé, gates X1-X3 et claims PASS | chaque appel d'offres improvise sa séquence |
| L-E | M6 + M7 : référentiel d'exigences outillé, rendu OOXML à trame imposée | mandat chez forge-agents | complexe × moyen | `oracle-exigences-ao` X1-X3 PASS sur un règlement synthétique ; DOCX ouvert sans réparation, gates OOXML PASS | L1 reste à la main et au format PowerPoint |
| L-F | M8 : trois barres externes | run `la-barre` (pré-vol), registre des barres | simple × moyen | test d'existence de chaque référence, critères décomposés au registre | oracles verts, livrable rejeté (précédent B1-B4) |
| L-G | M9 : gabarits partenaires, fournisseurs, étude de cas | catalogue `gabarits\documents` du pilot | simple × moyen | `oracle-gabarits-documents` PASS ; une famille par livrable | L10, L11 sans forme opposable |
| L-H | M10 : transparence article 50 | règle dans `MARQUE.md` (L-B) + contrôle chez forge-agents | simple × court | fixture : un livrable public sans marquage → FAIL | obligation en vigueur depuis le 2026-08-02 non portée |
| L-I | M11 : registre des issues, mesure | donnée du produit (L-C), vue générée | simple × court | une ligne par appel d'offres, datée, sourcée ; taux calculé par script | la capacité ne s'améliore jamais |
| L-J | Premier livrable réel | run `RUN-AO.md` sur le prochain appel d'offres, désigné par l'humain | selon le cas | recette C2 PASS, issue consignée | la v0 reste décorative (R-28 point 2) |

### 5.3 Ce que Digit-AI fait SANS mise à jour

Ce que le lecteur doit savoir avant de décider : le statu quo n'est pas zéro. Une propale privée
(L2) se produit aujourd'hui en reconstituant les quatre skills à la main depuis les archives et en
rejouant le pipeline P4 ; sa revue (L3) et ses oracles existent. Un pitch, un COPIL, un support de
formation (L4, L8, L9) passent par les mêmes archives. Ce qui ne se fait pas : une réponse à trame
imposée (L1) autrement qu'à la main ; un kit partenaire (L10) ; une publication (L6) jugée par
autre chose que l'œil ; un livrable dont la marque soit la même que celle de la page HTML ; un
contenu public marqué comme généré.

### 5.4 Test rétro (Opérationnel → Tactique → Stratégie → Intention)

Depuis chaque élément opérationnel du verdict :

- **M1, M2 skills versionnés et charte** → tactique « l'existant relevé avec citations, ne rien
  recréer » → stratégie « ne rien recréer de ce qui existe » → intention « produire vite et bien ».
  Sans rupture.
- **M3 système de marque** → tactique « une typologie, une marque, deux supports » → stratégie
  « verrouiller la marque » → intention « sans que la qualité dépende de qui écrit ». Sans rupture.
- **M4 produit autonome** → tactique « capacité contre instance » → stratégie « séparer public et
  confidentiel » → intention « via un projet dédié », mot pour mot. Sans rupture.
- **M5 type de run** → tactique « trois métiers, trois cadences » → stratégie « discipline des
  produits appliquée aux livrables » → intention « construction de ses réponses à appels d'offres ».
  Sans rupture.
- **M6, M7 référentiel d'exigences et rendu OOXML** → tactique « L1 non couvert par l'existant » →
  stratégie « ne rien recréer, étendre » → intention. Sans rupture.
- **M8 barres** → tactique « un rendu générique est un défaut » → stratégie « mesurer » → intention
  « vite et bien ». Sans rupture.
- **M9 gabarits** → tactique « publics fournisseurs et partenaires nommés par le demandeur » →
  stratégie → intention « fournisseurs et partenaires », mot pour mot. Sans rupture.
- **M10 transparence** → tactique « garde-fous : obligation en vigueur » → stratégie « discipline
  des produits » → intention « livrables de communication avec ses prospects ». Sans rupture.
- **M11 registre des issues** → tactique « mesurer » → stratégie → intention « marketing » (une
  capacité qui ne mesure pas n'est pas du marketing). Sans rupture.
- **Élément retiré** : un connecteur de diffusion (réseau social, outil de conception en ligne)
  envisagé en O1 ne remonte à aucune ligne tactique tant qu'il n'est pas déclaré dans
  `INTEGRATIONS-FOURNISSEURS.md` et qu'aucune API payante n'est admise ; retiré du verdict,
  question laissée au produit.

Les deux questions du demandeur, rejouées : « une forge communication & marketing … » → section
2 ter, admission refusée sur les trois partitions avec le critère en défaut ; « étude
d'opportunités sur une ou plusieurs forges pour répondre à ce besoin » → sections 4 et 5, cinq
options, une retenue, dix objets attribués à quatre porteurs existants, plus un type de run.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé O0-O4 ; chaque ligne de non-recouvrement citée ; chaque source
datée ; O0 réfutée sur coût cité ; aucun effort en jours ; aucun nom de client, de personne ni
montant (le cas du 24/07 est cité par sa date et son emplacement) ; aucune écriture dans une forge
ni dans une archive de skill par cette étude ; les connecteurs non déclarés ne sont pas employés.
