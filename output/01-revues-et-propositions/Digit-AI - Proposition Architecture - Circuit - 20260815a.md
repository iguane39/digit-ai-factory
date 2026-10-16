# Proposition d'architecture — le circuit de l'insatisfaction

**Statut : PROPOSITION — aucune implémentation.** Mandat humain du 15/08/2026 (prompt
« circuit de l'insatisfaction », issu de l'analyse L99). Candidature : TF-0287, étude
d'opportunité 20260815d jointe. Construction après GO (« décide TF-0287 »).

**Promesse mesurable** : remonter une insatisfaction coûte UNE phrase + des captures ;
tout le reste — étude, cause, gates en défaut, retours forge, correctif, version — suit
sans l'humain ; « ça ne va toujours pas » devient une réouverture comptée, cible zéro.

## 1. Le dépôt — une phrase suffit

- **Gabarit `gabarits\INSATISFACTION.md`** : frontmatter minimal (`produit` si connu,
  `urls`, `langue`, `largeur` si visuel — chaque champ optionnel sauf le texte) + texte
  libre (une phrase acceptée) + captures à côté. L'humain n'écrit JAMAIS le protocole.
- **Canal unique, règle 18 étendue** : le dossier se dépose là où les lots vivent déjà —
  `<produit>\forge\retours\` (produit connu) ou `<pilot>\input\00-retours\` (produit
  inconnu), nommé `INSATISFACTION - <produit|a-identifier> - AAAAMMJJ<i>` avec ses
  captures. **Aucun sidecar exigé de l'humain** : c'est l'instruction qui le produira.
- **Boîte d'entrée étendue (appelant mécanique)** : règle **B4** dans
  `oracle-boite-entree.mjs` — un dépôt `INSATISFACTION - *` sans dossier d'instruction
  correspondant est dénoncé, comme un sidecar non ingéré. Fixtures double sens.

## 2. Le registre — l'identifiant qui rend le « toujours pas » comptable

- **`insatisfactions\REGISTRE.jsonl`** (pilot, écrivain unique : le pilot) — événements
  `depot` (INS-0001…, ts, produit, dossier), `reouverture` (référence un INS existant,
  compteur), `instruction` (chemin du dossier des 6 blocs), `release` (version, ts) ;
  vue `REGISTRE.md` générée, jamais éditée.
- **`oracle-insatisfactions.mjs`** (I1-I4, self-test double sens) : I1 id unique et
  séquentiel ; I2 une réouverture référence un INS existant (jamais un nouveau dossier
  pour un « toujours pas ») ; I3 un INS instruit porte ses 6 blocs (le manquant est
  nommé) ; I4 la mesure est calculable (ts partout, réouvertures sommables).

## 3. L'instruction — automatique, six blocs, jamais réécrite à la main

- **Gabarit `gabarits\AGENT-INSATISFACTION.md`** = AGENT-CAMPAGNE (périmètre, écarts à
  la lettre, §Avancement, synthèse jugée) + les six blocs :
  (a) **reproduction** aux conditions réelles (largeur de la capture, langue, contenu
  réel — render aux largeurs fournies) ; (b) **cause racine produit** ; (c) **gates en
  défaut** : quel oracle/test aurait dû voir, et pourquoi il n'a pas vu — inexistant ·
  aveugle · jamais joué (R-35) ; l'hypothèse se vérifie, jamais présumée ; (d)
  **solutions par destinataire** : PRODUIT / FORGES / PILOT ; (e) **correctif + release
  par la voie du produit** (RUN-VERSION, tests entiers, décision humaine — R-29) ; si
  un run ou une session vit déjà sur le produit, le correctif lui est REMIS (consigné),
  jamais imposé par-dessus ; (f) **retours forge en lot sidecar standard** + constats
  → candidats TF. Sortie : `output\05-insatisfactions\INS-<n>\` (étude + lot + traces).
- Une insatisfaction sans capture nécessaire : le complément se demande **UNE fois** ;
  non reproductible ou préférence : conclusion explicite, jamais un silence.

## 4. La mesure — « première demande » devient un chiffre

Par dossier : réouvertures (cible 0 — le cas fondateur des menus vaut 1) et délai
dépôt → release. Revue datée (2026-09-15, avec les autres revues du jour) : si les
réouvertures ne baissent pas, c'est l'INSTRUCTION qu'on corrige, pas les forges.

## 5. Les appelants (nommés, R-35)

- **Mécanique** : `oracle-boite-entree` B4 — joué à l'ouverture de tout run (déjà
  câblé au noyau) : zéro octet de noyau consommé, le circuit est surveillé par un
  contrôle existant.
- **Doctrinal** : section « Insatisfactions » dans `references\TODO-FORGE.md` (chargé
  par le noyau) et entrée de routage dans `references\ACCUEIL.md` (« signaler une
  insatisfaction → gabarit INSATISFACTION, instruction automatique »).
- **Self-tests** : les fixtures B4 + I1-I4 entrent au banc `self-tests.mjs` (invariant
  I1 du banc : tout oracle est couvert).

## 6. Périmètre tranché

Le « client » du circuit est l'humain remonteur (propriétaire/commanditaire). Les
visiteurs finaux des sites sont hors périmètre — dit, pas oublié.

## 7. Validation — le cas fondateur

INS-0001 = menus produit-07 (FR compressé à 1900 px, EN 3 entrées sur 8, parité des
pages à instruire). Instruction de bout en bout à la construction du circuit — en
composant avec la session qui travaille déjà sur ce produit : blocs (a)-(d) et (f)
complets, bloc (e) remis à sa session si elle est encore vivante, repris sinon.
Attendu côté forges (à vérifier, pas à présumer) : parité i18n des surfaces FR/EN et
rendu aux largeurs réelles avec contenu réel — deux règles candidates à outiller.

## 8. Coût et ordre de construction (après GO)

1. Registre + oracle I1-I4 + B4 (½ j) — le squelette comptable d'abord, parce que
   tout le reste s'y accroche ;
2. gabarits INSATISFACTION + AGENT-INSATISFACTION + appelants doctrinaux (½ j) ;
3. INS-0001 instruit de bout en bout (½-1 j, agent) — la recette du circuit.
Total ≈ 1,5-2 j. Zéro nouveau canal : tout est extension de l'existant.
