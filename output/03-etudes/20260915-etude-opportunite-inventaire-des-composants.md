---
role: étude d'opportunité (instruction entre candidat et décidé) — quatre candidats groupés du registre TODO-FORGE (TF-1113, TF-1117, TF-1120, TF-1122), nés des retours Produit-11 du 14/09/2026 et décidés le 15/09/2026 sous mandat humain global, sous le seuil d'étude ; leur correction exige un oracle nouveau (objet durable, R-31), d'où l'étude requise (TF-0155)
sources_de_verite: [todo/TODO.jsonl (événements creation et maj de TF-1113, TF-1117, TF-1120, TF-1122, TF-1114, TF-1115, TF-1116, TF-1118, TF-1121), input/00-retours/Produit-11 - RETOURS - 20260914a.md/b.md/c.md (données, lecture seule), oracles/oracle-conformite-projet.mjs (l. 1191-1276, R-20 et R-20 ter), REGLES-PROJET.md (l. 136-160 règle 20 et son historique TF-0594 ; l. 319-329 R-31), gabarits/docs-projet/COMPOSANTS-OPS.md (gabarit intégral), digit-ai-forge-ops/oracles/oracle-ops.mjs (l. 162-215 O-7, l. 314-355 O-10, l. 357-424 O-11, l. 426-469 O-14, l. 697-733 O-9/O-12/O-13), gabarits/ETUDE-OPPORTUNITE.md, oracles/oracle-etude-opportunite.mjs (E1-E10), references/INTENTION.md, output/03-etudes/20260914-etude-opportunite-personas-par-phase.md et 20260914-etude-opportunite-conception-documentaire-amont.md (gabarit de forme, verdicts « non instruit » motivés)]
verifie_le: 2026-09-15
---

# Étude d'opportunité — inventaire des composants et prérequis d’environnement — 20260915a

Audience : le pilote de l'écosystème, qui décide des mandats, et les deux dépôts nommés au
verdict — le pilot et `digit-ai-forge-ops`. L'étude instruit quatre candidats du registre
TODO-FORGE, tous nés le 14/09/2026 des retours d'un même produit (Produit-11) et rangés
`décidé` le 15/09/2026 sous le mandat humain global, avant d'être repassés `en_cours` le même
jour parce que leur correction exige un objet durable — un oracle — que TF-0155 soumet à étude.

**Ce que le lecteur va apprendre.** Les quatre candidats ne portent pas quatre défauts
indépendants : ils décrivent une seule chaîne cassée en quatre points — un inventaire qui
confond présence et usage (TF-1113), un usage nul confondu avec une suppression sûre alors que
cinq lignes sur dix ne l'étaient pas et qu'une aurait coupé l'accès humain à la base (TF-1117),
une suppression jouée sans jamais demander ce qui recrée le composant, découvert seulement par
une question humaine après coup (TF-1120), et sept ressources Terraform lues sans être créées,
invisibles à toute garde de pipeline (TF-1122). Aucun des deux oracles existants qui touchent au
sujet — R-20 côté pilot, O-14 côté `digit-ai-forge-ops` — ne les couvre : R-20 vérifie la
PRÉSENCE du document, jamais le contenu de ses colonnes ; O-14, construit la veille sur le même
produit, confronte déjà un export réel au document dans un seul sens, et son propre `non_juge`
nomme TF-1113 comme la raison pour laquelle l'autre sens ne se joue pas encore. Le verdict retenu
étend les deux oracles existants — trois règles ajoutées à `oracle-ops.mjs`, un bloc structurel
ajouté à R-20 — plutôt que de créer un fichier neuf : le verbe qu'un oracle neuf outillerait
existe déjà, en germe, dans O-11, O-13 et O-14.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur un critère, suffisant seul. **Objet durable (R-31)** : la correction des quatre
candidats exige, de leur propre aveu (`reste_a_faire` du 15/09/2026), « un oracle » — un objet
que R-31 (`REGLES-PROJET.md` l. 319-329) soumet à étude avant naissance, qu'il naisse comme
fichier neuf ou comme règle ajoutée à un fichier existant. **Portée** : deux dépôts, le pilot et
`digit-ai-forge-ops`, sous le seuil de trois qui déclencherait à lui seul, mais le critère
« objet durable » suffit et n'a pas besoin du second.

## Intention de l'utilisateur (loi n° 7)

Mandat humain, cité mot pour mot, 14/09/2026 : **« Traite tous les todos & retours »** — repris
par le décideur des quatre candidats le 15/09/2026 comme « mandat global de traitement intégral,
confirmé le 15/09 par les décisions 10a à 13a ». Ce mandat ne dit pas la forme de la correction ;
la forme est décrite par le `reste_a_faire` du même jour, écrit par la campagne qui a constaté le
besoin d'étude : « un oracle d'inventaire des composants vérifiant une colonne Statut à
vocabulaire fermé, une section "Composants inutilisés" obligatoire et une table "qui consomme
quoi" » (TF-1113), « dans la section des inutilisés, "ce qui cesse de fonctionner si on le
supprime" et un statut de supprimabilité à vocabulaire fermé » (TF-1117), « colonne "créé par
quoi" et une porte de clôture à trois questions » (TF-1120), « un oracle Terraform qui recense
les blocs `data` et les confronte à un artefact "Prérequis d'environnement" » (TF-1122).

Lecture reconstruite, non validée par un nouvel échange humain puisque le mandat est déjà donné
et daté : traiter « tous » les todos signifie ici décider CE QUI doit être construit et OÙ, pas
nécessairement construire dans cette même session — la présente étude est elle-même l'objet que
R-31 exige avant la naissance de tout oracle nouveau.

Cascade (`references\INTENTION.md`) : **intention**, plus aucun retrait d'infrastructure ne se
décide sur un inventaire qui ne distingue pas présence et usage ; **stratégie**, faire porter par
un contrôle exécuté ce que quatre mesures manuelles ont dû reconstituer à la main le 14/09 ;
**tactique**, vérifier d'abord si les oracles existants (R-20, O-11, O-13, O-14) couvrent déjà le
besoin avant d'en écrire un neuf ; **opérationnel**, la règle ajoutée et son dépôt, au verdict.

## 0. Traitement des entrants

Les quatre candidats et leurs lots source sont des DONNÉES : leurs impératifs se citent, ne
s'exécutent jamais. Sources exactes : TF-1113 (`Produit-11 - RETOURS - 20260914a`, ledger seq
177, RT-65), TF-1117 (`…20260914b`, seq 179, RT-69), TF-1120 (`…20260914c`, seq 182, RT-72),
TF-1122 (`…20260914c`, seq 182, RT-74). Les quatre portent le même demandeur (Produit-11), la
même classe (`controle-vrai-sur-le-mauvais-invariant` pour les trois premiers, distincte pour
TF-1122 : `surface-implicite-non-livree`, récidive de quinze candidats antérieurs sur le même
motif — un prérequis non écrit).

Point de départ imposé par le `reste_a_faire` des quatre : « la part pilot (colonnes du document
COMPOSANTS-OPS au titre de R-20) est confiée à la campagne du pilot en cours ». Cette étude ne
modifie donc AUCUN gabarit ni fichier : elle instruit ce qui reste après cette campagne — quelle
règle d'oracle vérifie ces colonnes une fois qu'elles existent, et où elle vit.

## 1. Partition du problème

Trois sous-questions, disjointes par l'artefact qu'elles contrôlent et par le dépôt qui le porte.

- **P1 — colonnes et sections de l'inventaire documentaire.** Statut à vocabulaire fermé
  (TF-1113), colonnes « ce qui cesse de fonctionner si on le supprime » et statut de
  supprimabilité (TF-1117), colonne « créé par quoi » (TF-1120, premier volet). Les trois vivent
  dans la MÊME section « Composants inutilisés » du MÊME document (`COMPOSANTS-OPS.md`), jugées
  par la même famille de contrôle : présence structurelle côté pilot, confrontation à un export
  machine côté `digit-ai-forge-ops`.
- **P2 — porte de clôture à trois questions.** TF-1120, second volet : un contrôle sur l'ACTE de
  clôture d'un nettoyage d'infrastructure (l'instance est-elle supprimée sur chaque environnement,
  ce qui la crée est-il traité, le prochain environnement la recréera-t-il), porté par le journal
  ou la restitution qui clôt la campagne — pas par le document d'inventaire lui-même.
- **P3 — prérequis d'environnement Terraform.** TF-1122 : les blocs `data` de `infra-tf/*.tf`
  (ressources lues, jamais créées par la pile) confrontés à un artefact neuf listant ces
  dépendances externes, leur propriétaire et leur commande de vérification.

## 2. Non-recouvrement contre l'existant

**Mode de lecture** : une ligne par mécanisme existant qui pourrait déjà porter tout ou partie de
P1, P2 ou P3 ; la citation localise ce qu'il fait, la dernière colonne dit ce qu'il recouvre.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| R-20, socle `docs\projet\` | `oracle-conformite-projet.mjs` l. 1191-1257 : vérifie la PRÉSENCE des 8 fichiers, un frontmatter complet (`role`, `sources_de_verite`, `verifie_le`) et l'absence de marqueurs de gabarit `{…}` non instanciés | ne recouvre pas P1 : aucune règle ne lit le CONTENU d'une colonne ou d'une section — un document avec un Statut absurde ou une section « Inutilisés » vide de sens serait déjà `PASS` |
| R-20, historique TF-0594 | `REGLES-PROJET.md` l. 136-157 : `COMPOSANTS-OPS.md` porte deux inventaires (déployé + environnements de données) ; « `oracle-conformite-projet` vérifie la présence des huit fichiers et leur frontmatter, jamais la pertinence de leur contenu, et il le déclare lui-même » | confirme, par l'aveu de la règle elle-même, que P1 est hors de son périmètre déclaré |
| Section « Infrastructure déclarée » du gabarit | `gabarits\docs-projet\COMPOSANTS-OPS.md` l. 64-93 (TF-0651, 26/08/2026) : table de ce qui est posé HORS dépôt (domaines, DNS, certificats), jamais revérifié sans elle | ne recouvre pas P3 : c'est le symétrique de SORTIE (ce que le produit CRÉE hors du dépôt) ; TF-1122 est le symétrique d'ENTRÉE (ce que le produit LIT sans le créer) — la proposition le dit elle-même |
| Section « Inventaire par environnement » du gabarit | `gabarits\docs-projet\COMPOSANTS-OPS.md` l. 45-52 : une table Composant/Type/Environnement/ID/URL/IP, aucune colonne Statut ni section Inutilisés | ne recouvre pas P1 : aucune des colonnes demandées n'existe dans le gabarit actuel |
| O-14, inventaire vs export réel | `oracle-ops.mjs` l. 426-469 (TF-1114, corrigé le 15/09) : confronte un export machine (`az graph query`) au document, un seul sens — chaque nom de l'export doit figurer littéralement dans le document | recouvre P1 au sens EXISTENCE (un composant omis se voit) ; NE recouvre PAS le sens inverse — et le dit lui-même : `non_juge` l. 448-449, « le sens inverse … dépend d'un vocabulaire de statut fermé (colonne « Statut ») que le gabarit pilot ne porte pas encore (TF-1113) » |
| O-11, sonde de disponibilité | `oracle-ops.mjs` l. 357-424 (TF-1121) : parseur de fichiers `.tf` (marche des répertoires, regex de bloc `resource "…" "…" { … }`), limité aux types `web_test`/`availability` et à l'attribut `url` | ne recouvre pas P3 : aucune lecture de bloc `data`, aucune confrontation à un artefact de prérequis ; fournit le patron de parcours de fichiers `.tf` réutilisable |
| O-13, gestes destructifs | `oracle-ops.mjs` l. 718-731 (TF-1116 + TF-1118) : tout geste destructif porte sa maturité (éprouvé le AAAA-MM-JJ) ET sa mesure de non-régression, jugées sur un document `.md` quelconque | recouvre le PRINCIPE de P2 (un geste sur l'infrastructure se clôt sur une preuve, pas sur une déclaration) ; ne recouvre pas les trois questions précises de clôture d'un nettoyage, ni leur artefact (journal/restitution) |
| O-7, empreinte de déploiement | `oracle-ops.mjs` l. 162-215 (TF-0288/TF-0298) : compare les fichiers d'une release SERVIE à leur empreinte scellée | ne recouvre pas : porte sur la dérive d'un contenu déjà déployé, pas sur l'usage ou la création d'un composant d'infrastructure |
| O-9/O-12, gouvernance de sécurité | `oracle-ops.mjs` l. 697-717 : authentification déclarée des `sources_de_verite`, périmètre d'une `remediation_securite` | ne recouvre pas : domaine sécurité documentaire, pas inventaire ni Terraform |

## 3. État de l'art daté

**Non instruit** — motif : la question n'oppose pas des choix de marché ou de méthode
généralement disponibles, mais une convention d'organisation interne à deux dépôts propriétaires
(le pilot et `digit-ai-forge-ops`) — étendre une règle numérotée existante ou créer un fichier
neuf. Cette question est entièrement tranchée par la lecture directe du code, exhaustive à la
section 2, et par la règle interne R-31 qui la gouverne depuis le 13/08/2026. Le même choix a déjà
été fait cinq fois sur le même fichier `oracle-ops.mjs` dans les deux jours qui précèdent
(O-10, O-11, O-12, O-13, O-14, toutes décidées et corrigées sans fichier neuf) : c'est le
précédent qui fait foi, pas une source externe. Aucune littérature ne documente la convention
d'un registre d'oracles propriétaire.

## 4. Options — jeu fermé O0-O4

### Ce que la lecture directe établit

Les trois sous-questions de la partition (P1, P2, P3) demandent chacune soit une extension d'un
fichier déjà mandaté et cadencé, soit un nouveau fichier. R-31 (critère 1) exige, pour qu'un objet
durable naisse, qu'AUCUN verbe outillé équivalent n'existe déjà ailleurs. Or : le verbe « confronter
un document déclaratif à un export machine » existe déjà (O-14) ; le verbe « parcourir des fichiers
`.tf` et juger un bloc par motif » existe déjà (O-11) ; le verbe « exiger une preuve de clôture sur
un geste d'infrastructure » existe déjà (O-13). Aucun des trois candidats ne demande un verbe
absent : chacun demande une variante ou une extension d'un verbe déjà tenu.

### Les options

| Option | Contenu | Coût | Ce qu'elle exclut | Sur la lecture directe |
|---|---|---|---|---|
| **O0 — ne rien faire** | les quatre candidats restent `en_cours` sans oracle ; chaque nettoyage futur refait la mesure manuelle du 14/09 | nul | toute prévention du défaut mesuré (cinq suppressions sur dix auraient été dangereuses, une aurait coupé l'accès humain) | **réfutée** : le coût du statu quo est écrit dans les candidats eux-mêmes — une question humaine a dû suppléer l'absence de contrôle une fois, rien ne garantit qu'elle sera reposée la prochaine fois |
| **O1 — étendre les oracles existants, aucun fichier neuf** | côté pilot : bloc structurel ajouté au sein de R-20 (`oracle-conformite-projet.mjs`), sur le modèle de R-20 ter déjà présent dans le même fichier — vérifie la PRÉSENCE du Statut à vocabulaire fermé, de la section Inutilisés (même vide, loi n° 3), des colonnes supprimabilité et créé par quoi, une fois que la campagne pilot en cours les a posées dans le gabarit. Côté `digit-ai-forge-ops` : une règle **O-15** dans `oracle-ops.mjs`, symétrique inverse d'O-14, qui croise le Statut déclaré à l'export réel — exactement le sens qu'O-14 déclare aujourd'hui `non_juge` en nommant TF-1113 ; une règle **O-16**, sur le modèle d'O-13, qui exige les trois questions de clôture sur le journal ou la restitution d'un nettoyage d'infrastructure ; une règle **O-17**, qui réutilise le parseur de fichiers `.tf` d'O-11 pour recenser les blocs `data` et les confronter à un artefact « Prérequis d'environnement » (référentiel versionné, loi n° 4) | complexité moyen · durée court pour le bloc pilot (P1, structure) ; complexité moyen · durée court pour O-15 et O-16 chacune ; complexité moyen · durée moyen pour O-17 (nouveau parseur de blocs `data`, nouvel artefact à définir) | la création d'un fichier `oracle-inventaire-composants.mjs` séparé — le contrat JSON, le harnais self-test et l'entrée de registre restent ceux d'`oracle-ops.mjs`, déjà mandatés et cadencés | **retenue** : couvre P1, P2 et P3 sans dupliquer un mécanisme déjà tenu |
| **O2 — créer un oracle neuf autonome pour l'inventaire (P1 + P2)** | nouveau fichier `oracle-inventaire-composants.mjs`, nouveau registre, nouveau couple de fixtures rouge/verte, nouvelle entrée de manifeste, sur le standard §3 de `quality-oracles` | complexité complexe · durée moyen | la réutilisation du contrat JSON, du harnais self-test et du registre qu'`oracle-ops.mjs` porte déjà pour quatorze règles | **réfutée par R-31 lui-même** (critère 1) : le verbe « confronter un déclaratif à un export machine » est déjà outillé par O-14 ; créer un fichier neuf duplique le harnais sans ajouter de capacité |
| **O3 — créer un oracle Terraform neuf autonome pour P3 seul** | nouveau fichier dédié aux blocs `data`, hors d'`oracle-ops.mjs` | complexité complexe · durée moyen | la réutilisation du parseur de fichiers `.tf`, du walker de répertoire et du contrat JSON qu'O-11 porte déjà dans le même fichier | **réfutée** pour la même raison qu'O2 : le verbe « parcourir des `.tf` et juger un bloc par motif » existe déjà ; dupliquer coûte plus cher qu'ajouter une règle |
| **O4 — traiter P2 et le contenu de P1 comme une consigne humaine, sans oracle exécuté** | les trois questions de clôture et le Statut restent une checklist dans un gabarit, jamais vérifiée mécaniquement | nul | toute garantie que la checklist sera lue avant une suppression | **réfutée** : la loi transverse du pilot n'accepte un livrable que sur le verdict d'un oracle exécuté, jamais sur confiance ; et la preuve du 14/09 est déjà celle d'une consigne non vérifiée qui a échoué une première fois (restitution + deux lots de retours rendus sans que la question de clôture soit posée) |

## 5. Verdict

- **Option retenue : O1.** Étendre les deux oracles existants — R-20 côté pilot, `oracle-ops.mjs`
  côté `digit-ai-forge-ops` (règles O-15, O-16, O-17) — sans créer de fichier neuf.
- **Coût** : complexité moyen · durée court pour le bloc pilot et pour O-15/O-16 ; complexité
  moyen · durée moyen pour O-17, seule règle qui introduit un parseur (`data`) et un artefact
  (« Prérequis d'environnement ») réellement neufs. Coût de l'étude elle-même : lecture directe du
  code dans la session courante, sans délégation ; le compte de tokens n'est pas mesurable depuis
  cette session — valeur non vérifiable, marquée comme telle.

**Verdict par candidat**

| Id | Verdict | Exécution retenue | Dépôt cible | Effort |
|---|---|---|---|---|
| TF-1113 | décider | structure (Statut à vocabulaire fermé + section Inutilisés même vide) ajoutée à R-20 dans `oracle-conformite-projet.mjs`, une fois le gabarit posé par la campagne pilot en cours ; puis règle O-15 dans `oracle-ops.mjs`, qui lève exactement le `non_juge` qu'O-14 déclare aujourd'hui en la nommant | pilot, puis `digit-ai-forge-ops` | complexité moyen · durée court (les deux volets) |
| TF-1117 | **fusionner** avec TF-1113 | mêmes colonnes de la même section « Composants inutilisés » (« ce qui cesse de fonctionner » + statut de supprimabilité) ; même extension R-20, un seul chantier structurel, pas de règle O-15 distincte | pilot | inclus dans TF-1113 |
| TF-1120 | **décider sous réserve** | colonne « créé par quoi » fusionnée à TF-1113/TF-1117 (pilot, R-20) ; porte de clôture à trois questions : règle O-16 nouvelle dans `oracle-ops.mjs`, sur le modèle d'O-13 — sous réserve tant que le journal ou la restitution qui clôt un nettoyage d'infrastructure n'a pas un format stabilisé pour porter la règle | pilot (colonne) + `digit-ai-forge-ops` (O-16) | complexité moyen · durée court |
| TF-1122 | décider | règle O-17 nouvelle dans `oracle-ops.mjs`, parseur de blocs `data` réutilisant le walker de fichiers `.tf` d'O-11, confrontée à un artefact neuf « Prérequis d'environnement » (référentiel versionné, loi n° 4) | `digit-ai-forge-ops` | complexité moyen · durée moyen |

- **Candidature(s) émise(s)** : aucune candidature neuve — le mandat humain global du 14/09
  (« Traite tous les todos & retours ») couvre déjà la décision de construire ; cette étude
  fournit l'objet que R-31 exigeait avant que l'oracle naisse. L'exécution retourne aux deux
  campagnes déjà nommées par les candidats : la campagne pilot en cours (colonnes du gabarit,
  bloc R-20) et la prochaine campagne `digit-ai-forge-ops` (O-15, O-16, O-17), sur le modèle des
  cinq règles O-10 à O-14 déjà closes cette semaine sur le même fichier.
- **Plan de revue** : 2026-10-15. Rejouer O-15 sur le prochain export machine d'un produit sous
  gate, vérifier qu'O-16 a fermé au moins un nettoyage d'infrastructure sans question humaine
  supplétive, et confirmer qu'O-17 a été joué sur `infra-tf/*.tf` d'au moins un produit avant son
  premier déploiement sur un environnement neuf.
- **Test rétro** : l'élément opérationnel (trois règles ajoutées à `oracle-ops.mjs`, un bloc
  structurel ajouté à R-20, aucun fichier neuf) remonte à la tactique (vérifier d'abord que les
  oracles existants ne couvrent pas déjà le besoin : ils ne le couvrent qu'à moitié, et le disent
  eux-mêmes dans leur propre `non_juge`), puis à la stratégie (faire porter par un contrôle
  exécuté ce qu'une question humaine a dû suppléer une fois), puis à l'intention (plus aucun
  retrait d'infrastructure décidé sur un inventaire qui confond présence et usage). Aucune
  rupture. Les mots du mandat rejoués un à un : « Traite » → une décision d'exécution écrite pour
  chacun, pas un report ; « tous » → les quatre candidats couverts, un fusionné, aucun écarté ;
  « les todos » → TF-1113, TF-1117, TF-1120, TF-1122 ; « & retours » → les trois lots Produit-11
  du 14/09 cités par ledger et par RT, jamais reformulés sans source.
