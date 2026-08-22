# Retours forges — Hoopiz — 20260822c

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : retour **direct du client**, en cours de session, sur la restitution elle-même.
  Après une passe où quatre livrables Markdown et l'ensemble des réponses employaient des
  identifiants codés — écarts `E1`–`E8`, constats `C1`–`C7`, questions `H1`–`H19` et `Q-M*`,
  retours `RA-*`/`RD-*`, tickets `TF-*` — le client a répondu : **« je ne sais pas ce qu'est
  E2 »**. Sa consigne : garder les codes, ils servent la traçabilité, mais **les accompagner
  de leur sens à chaque emploi**. Ce lot remonte les deux causes outillées de ce défaut.
- **Références ledger** : aucun ledger dans ce projet (run hors pilot, skills appelés depuis
  Claude Code). Pièces : `output/v2-architecture-cible/` livrables `04` à `09`,
  `rapport/REVUE.md`, mesures d'exécution citées en RA-12.
- **Lots précédents** : `20260820a`, `20260820b`, `20260821a`, `20260822a`, `20260822b` —
  **tous remis**, donc immuables. Ce lot est un fichier neuf.
- **Remise au pilot** : copier ce fichier et son sidecar `.tf.jsonl` dans
  `<pilot>\input\00-retours\`. **Remise soumise à validation humaine** (règle 18) —
  **accordée explicitement par le client** (« remonte ce point à la factory »).
- **Statut** : remis le 2026-08-22

**Numérotation** : les lots précédents ont consommé RD-1 à RD-21 et RA-1 à RA-11. Ce lot
continue en RD-22 et RA-12.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-design (`digit-ai-forge-design`) — skill `digit-ai-page-html`, référence `lisibilite.md`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-22 | majeur | **Aucune règle de lisibilité n'impose qu'un identifiant porte son sens — le troisième cas n'est pas couvert.** La référence en couvre deux voisins et laisse celui-ci entre les deux : **L3** exige que *toute valeur mise en avant porte sa légende* (« Maturité 1/5 sans barème n'informe pas ») ; **L14** interdit que *la plomberie interne s'affiche* (`[c:ec-sources]` en clair). Rien ne traite le cas d'un identifiant qui **appartient légitimement au vocabulaire du livrable** — `E2`, `C1`, `H3`, `Q-M8`, `ADR 0009` — mais dont le sens n'est jamais donné à l'endroit où on le lit. Ce n'est ni une valeur ni une fuite : c'est un renvoi muet. **Fait constaté sur livrable client** : quatre documents Markdown (`04`, `06`, `07`, `08`) et l'ensemble d'une restitution conversationnelle employaient une trentaine de codes distincts sans glose ; le client a dû demander ce que désignait le plus fréquent d'entre eux. **Le plus instructif** : le rapport HTML du même projet, lui, **fait la chose correctement** — chaque renvoi `H3` y porte une infobulle « Question ouverte H3 : … » et un lien vers sa définition. La bonne pratique existe donc déjà dans le produit, **mais comme elle n'est écrite nulle part, elle s'arrête à la frontière du HTML** et ne passe ni dans les livrables Markdown ni dans la restitution. | Étendre **L3** — « toute valeur porte sa légende » devient « toute valeur porte sa légende, **tout identifiant porte son sens** » — ou ouvrir une règle dédiée. **Mécanisable côté HTML** : collecter les jetons du motif `\b(E\|C\|H)\d+\b`, `Q-[A-Z]+\d*`, `TF-\d+`, `RA-\d+`, `RD-\d+`, `ADR \d{4}` présents dans le texte rendu ; chacun doit **résoudre** à sa première occurrence par chapitre — `title` non vide, `aria-describedby` résolu, ou ancre interne vers sa définition. Le rapport de ce projet fournit la **fixture verte**. **Hors HTML, la glose doit être en ligne** : c'est un point de revue de lecture, pas un contrôle mécanique — et c'est précisément ce que RA-12 rend aujourd'hui impossible à attraper. |

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-12 | majeur | **Un livrable Markdown ne reçoit aucun contrôle de lisibilité — la famille L1–L17 est enfermée derrière une porte HTML.** Le registre compte **48 domaines**. Mesuré sur un livrable réel (`09-travaux-par-lot.md`, 85 Ko, 297 entrées) : `run-oracles` juge **quatre** domaines — *Format / livraison / versioning*, *Sécurité / secrets*, *Calculs / chiffres*, *Traçabilité des affirmations chiffrées* — et en écarte deux. Verdict `4 PASS, 2 SKIP`. **Aucun domaine de lisibilité n'est appliqué**, ni ne peut l'être : les règles L1–L17 vivent dans `check_html.py`, qui ne s'exécute que sur du HTML. Or **le Markdown est le format de livraison dominant** des runs d'architecture et de conseil : ce projet remet **dix documents Markdown** et un seul HTML. Conséquence directe et mesurable : le défaut décrit en RD-22 s'est produit **dans les documents Markdown**, c'est-à-dire exactement là où aucun oracle ne regarde — et c'est un humain qui l'a trouvé, comme pour le défaut fondateur de L14. | Enregistrer un domaine **« Lisibilité d'un document »** applicable aux `.md`, portant le sous-ensemble des règles L **indépendantes du format de rendu** : L3 (toute valeur porte sa légende), L7 (un chapitre ouvre par ce qu'il apprend), L10 (un chapitre de données porte son mode d'emploi), L12 (une énumération de données n'est pas une phrase), L14 (pas de plomberie dans le texte), plus la règle d'identifiant proposée en RD-22. Les règles qui dépendent du rendu — L1 texte tronqué, L2 largeur, L5 surlignage, L15 glyphes — restent hors périmètre et doivent le dire. **Le partage mécanique / revue de lecture déjà écrit dans `lisibilite.md` s'applique tel quel** : il n'y a pas de doctrine à inventer, seulement une porte à ouvrir. |

## Confirmations positives

- **`TF-0501` : corrigé en une heure et sept minutes.** Le retour `RA-11` du lot `20260822b`
  — les journaux d'oracles écrits dans l'arbre de livraison alors que le message annonçait
  l'inverse — a été remis à **13h32** et le correctif était en place à **14h46**. Vérifié par
  ré-exécution sur deux cibles : les journaux sortent maintenant au-dessus du premier segment
  de livraison, dans un `.oracles/` qui rejoue l'arborescence relative, et **plus aucun
  `_oracles/` n'apparaît dans ce que le client reçoit**. Le commentaire du correctif reprend
  le constat mesuré, y compris « supprimé à la main deux fois ». C'est le cycle le plus court
  observé depuis le début de ce projet.
- **L'oracle des calculs a fait son travail sur un livrable Markdown.** Il a vérifié par
  re-somme le total d'une colonne de 189 lignes et l'a validé. Il avait auparavant signalé un
  écart — `189 ≠ 99` — qui était un **faux positif** : la cellule `**90**` en gras n'était pas
  lue comme un nombre. Corrigé en déplaçant l'emphase hors de la cellule numérique, ce qui est
  sans doute la bonne réponse côté livrable ; le signaler ici pour mémoire, sans en faire un
  retour : un nombre mis en gras dans un tableau reste une écriture courante.

## Ordre recommandé

1. **RA-12** — c'est la porte fermée. Tant qu'aucun oracle ne lit un livrable Markdown sous
   l'angle de la lisibilité, toute règle ajoutée en RD-22 restera inapplicable là où le défaut
   se produit réellement.
2. **RD-22** — la règle elle-même. Peu coûteuse côté HTML, où la fixture verte existe déjà
   dans un livrable de ce projet.
