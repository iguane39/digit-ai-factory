# Étude d'opportunité — circuit de l'insatisfaction (TF-0287) — 20260815d

## Seuil de déclenchement (vérifié)

TF-0287 **crée des objets durables** (registre, oracle, deux gabarits — R-31) et touche
la boîte d'entrée du pilot. Étude obligatoire avant `decide`.

## 0. Traitement des entrants

La demande instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : mandat humain du 15/08 (prompt « circuit de l'insatisfaction », analyse L99),
exemplaire réel joint (menus digit-ai.fr : FR compressé à 1900 px, EN 3 entrées sur 8,
texte commençant par « ça ne va toujours pas »).

## 1. Partition du problème

- **P-a Dépôt** : le coût humain d'une remontée (aujourd'hui : un paragraphe qui
  prescrit lui-même le protocole).
- **P-b Instruction** : le protocole étude → cause → gates en défaut → solutions →
  correctif/release → retours, aujourd'hui réinventé à chaque remontée.
- **P-c Comptabilité** : identité des dossiers, réouvertures (« toujours pas »), délais.
- **P-d Appelants** : qui charge et qui joue le circuit (leçon TF-0249/TF-0252).

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Canal des retours produits (règle 18) | `BOUCLE-AMELIORATION.md` : « un lot = un fichier RETOURS-<AAAAMMJJ><indice>.md […] sidecar » | recouvre le TRANSPORT aval (produit → pilot) ; ne recouvre ni le dépôt brut humain (une phrase + captures, sans sidecar), ni l'instruction, ni la réouverture |
| TODO-FORGE (registre TF) | `TODO-FORGE.md` : « registre des améliorations — tout entre en candidat, la décision est humaine » | recouvre la trace des AMÉLIORATIONS ; un item TF n'a ni réouverture, ni délai dépôt→release, ni dossier à 6 blocs — cycle de vie différent |
| `oracle-boite-entree.mjs` B1-B3 | « un registre à jour ne dit rien de ce qui n'y est jamais entré » | recouvre les sidecars et lots .md ; un dépôt INSATISFACTION sans sidecar est invisible de B1-B3 (B3 exige un sidecar que l'humain ne doit justement pas produire) |
| `RUN-VERSION.md` | « jamais improvisé — socle, delta, tests entiers » | recouvre la RELEASE corrective (bloc e) ; ne recouvre pas l'amont |
| `AGENT-CAMPAGNE.md` (+ §Avancement du 15/08) | « prompt = gabarit + delta spécifique » | recouvre la discipline d'exécution de l'instruction ; pas ses six blocs |
| Consigne RESTITUTION v2.1 | « tout message de fin de traitement » | recouvre la forme de la synthèse d'instruction ; pas le circuit |
| Lot `forge-digit-ai-fr - RETOURS - 20260815a` (ingéré ce jour) | événement d'ingestion au registre TF | preuve que l'aval fonctionne — et que l'amont (le paragraphe manuscrit de l'exemplaire) reste le coût à supprimer |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; l'instruction
s'appuie sur les mécanismes internes cités en section 2, tous exécutés ce jour. La
revue datée (section 5) confrontera le circuit à l'usage réel — premier critère de
validité d'un système de tickets : son taux de réouverture, mesuré chez soi.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité : l'exemplaire commence par
  « ça ne va toujours pas » (une réouverture non comptée) et contient ~60 mots de
  protocole manuscrit que l'humain doit réécrire à chaque insatisfaction.
- **O1 — un gabarit de remontée seul (formulaire)** : coût ½ j ; exclut l'instruction
  normée et la mesure — les allers-retours persistent (le défaut de l'exemplaire n'est
  pas le dépôt, c'est le premier traitement incomplet).
- **O2 — le circuit complet en extension de l'existant** (dépôt une-phrase + registre
  à réouvertures + instruction six blocs + B4 + appelants) : coût 1,5-2 j ; exclut
  tout nouveau canal parallèle (B4 étend B1-B3, le dépôt vit dans le circuit règle 18).
- **O3 — étendre TODO-FORGE aux insatisfactions (un type d'item de plus)** : coût 1 j ;
  rejetée — cycle de vie incompatible (réouvertures, délai dépôt→release, dossier
  multi-blocs) : forcer ça dans TF déformerait les deux registres et casserait les
  oracles R1-R10 ou les affaiblirait.
- **O4 — déléguer la conception à forge-organization** : rejetée — le circuit est de
  la tuyauterie de PILOTAGE (boîte d'entrée, registres, gabarits d'agent), périmètre
  du pilot ; organization sera consommée pour les conventions de nommage, pas pour
  concevoir.

## 5. Verdict

- **Option retenue : O2** — architecture détaillée dans `output\01-revues-et-propositions\
  Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md`.
- **Coût** : 1,5-2 j en trois pas (registre+oracles ; gabarits+appelants ; INS-0001
  instruit en recette) ; dette assumée : la détection B4 repose sur le préfixe de
  nommage `INSATISFACTION - ` — un dépôt mal nommé n'est vu par personne (limite dite,
  compensée par l'entrée ACCUEIL qui donne le nom).
- **Candidature(s) émise(s)** : TF-0287 (ce jour) ; décision : « décide TF-0287 ».
- **Plan de revue : 2026-09-15** — réouvertures par dossier (cible 0), délai
  dépôt→release, et la question de validité : l'humain a-t-il pu remonter en une
  phrase sans écrire une seule fois le protocole ?
