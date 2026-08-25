---
role: convention transverse d'empreinte — un seul format déclaré pour juger la fraîcheur d'un artefact, et le registre des sites de scellement du parc
sources_de_verite: [oracles/oracle-empreintes.mjs (le contrôle), forge-ops/oracles/oracle-ops.mjs (le format d'origine), todo/TODO.jsonl (les sept items de la classe)]
verifie_le: 2026-08-25
---

# Empreintes — un seul format, et un registre qui le fait tenir

## Pourquoi cette convention existe, et ce que la dispersion a coûté

L'écosystème hache du contenu pour juger la fraîcheur d'un artefact **en au moins cinq endroits**,
chacun avec son format, sa granularité et sa durée de vie. Le coût n'est pas théorique : **sept
items du registre relèvent de la même classe** et ont été traités isolément, sans qu'aucun ne
produise de convention — TF-0072, TF-0247, TF-0253, TF-0288, TF-0294, TF-0298, TF-0338.

**Deux redécouvertes strictes**, et elles suffisent à justifier ce document :

| Le même défaut | Découvert ici | Rejoué là | Ce qui les sépare |
|---|---|---|---|
| fins de ligne non normalisées avant hachage | TF-0072 (forge-seo) | TF-0253 (pilot) | deux forges, deux mois, aucune mémoire commune |
| point de scellement manquant | TF-0288 (forge-ops, `deployer`) | TF-0298 (forge-ops, `canary`) | la **même forge**, et le second chemin oublié |

La leçon est celle-là : **une classe de défaut sans convention se re-paie autant de fois qu'il y a
de sites**. Le format le plus mûr existait déjà — `forge-ops/empreinte@1`, seul format **déclaré et
versionné** du parc. L'enjeu n'était pas d'en construire un neuf : c'était de le **promouvoir** et
d'armer un contrôle qui le fasse tenir.

## Le format

```json
{
  "format": "forge-ops/empreinte@1",
  "release": "<identifiant de ce qui est scellé>",
  "ts": "2026-08-23T09:00:00.000Z",
  "fichiers": { "chemin/relatif.ext": "<sha256 hexadécimal>" }
}
```

**Quatre champs, et aucun n'est décoratif.** `format` porte le nom ET la version : un lecteur qui
rencontre `@2` sait qu'il ne sait pas lire. `release` dit ce qui est scellé, sans quoi une empreinte
orpheline ne prouve rien. `ts` distingue deux scellements du même contenu. `fichiers` porte le
sha256 **par fichier** — un haché global dit qu'il y a une différence, jamais laquelle.

## Les trois écarts que le format doit absorber, tous déjà payés

1. **Normalisation des fins de ligne AVANT hachage.** Sous Windows, le même contenu écrit par deux
   outils rend deux empreintes. C'est exactement TF-0072, rejoué en TF-0253. La règle : hacher le
   contenu **LF**, jamais les octets tels qu'ils sont sur le disque. Un repli sur l'empreinte brute
   reste admis pour les artefacts scellés **avant** la normalisation — c'est une antériorité
   déclarée, pas une tolérance (TF-0359).
2. **Capture avant / après.** Ne jamais certifier un contenu qui a bougé pendant la mesure : on
   relit après l'écriture, et on compare. Un code de retour 0 ne prouve pas qu'un octet a été
   écrit — c'est ce que TF-0506 a payé sur un PDF verrouillé par une visionneuse.
3. **Tous les chemins de scellement, pas seulement le principal.** TF-0288 a fermé `deployer` et
   laissé `canary` ouvert : le même trou, dans la même forge, trouvé deux fois. Quand un artefact
   peut être produit par deux voies, les deux scellent, ou aucune ne compte.

## Registre des sites de scellement

Un site **déclaré** est un endroit du parc où l'on hache pour juger une fraîcheur ou une intégrité.
Le contrôle compare cette table à ce que le parc contient réellement : **un site non déclaré est un
constat**, et c'est ainsi que la convention tient — sans elle, le sixième mécanisme naîtrait comme
les cinq premiers.

**Comment lire cette table.** Une ligne par site, groupée par dépôt puis dans l'ordre où les
sites ont été relevés — aucun tri implicite, et surtout aucune priorité. La colonne **Format**
distingue trois natures qu'il ne faut pas confondre : `forge-ops/empreinte@1` est le format
complet, tenu par le contrôle ; un **sceau court** (12 ou 16 hex dans une page générée) est une
convention locale légitime, déclarée ici pour ne pas être redécouverte ; un **usage interne**
(clé de cache, identifiant de trace, empreinte de jeu de règles) ne juge aucune fraîcheur
d'artefact et n'est donc pas tenu au format. Ce qui est **exclu** de la table : tout hachage hors
des emplacements lus par le contrôle, et les dépôts absents du poste — les deux sont écrits au
`non_juge` plus bas.

### Ce que le registre ne suffisait pas à tenir (TF-0615, 25/08/2026)

Ce document et son contrôle sont nés de TF-0474, qui nommait la classe : *cinq mécanismes
d'empreinte coexistent sans format commun*. Ils ont produit une **liste** et deux règles qui la
tiennent — E1 (aucun site déclaré n'est mort) et E2 (aucun site n'est indéclaré). **Ils n'ont pas
produit de fonction**, et c'est par là que la classe est revenue une cinquième fois.

Mesure du 25/08 : **trois générateurs de vues du registre** étaient dûment déclarés à la table
ci-dessous **et hachaient les octets bruts**. `TODO-ARCHIVE.jsonl` pèse 1 554 831 octets et 0 CRLF
sur un poste, 1 557 156 et 2 325 CRLF sur l'autre — l'écart valant exactement le nombre de retours
chariot que le checkout ajoute — et les deux sceaux différaient pour un registre identique. Onze
fichiers générés rebasculaient à chaque aller-retour entre deux sessions.

*Un registre qui déclare les sites empêche d'en **oublier** un ; il n'empêche pas d'en écrire un
**mal**.* D'où deux ajouts, indissociables :

- **`scripts/lib-empreinte.mjs`** — le calcul n'existe plus qu'à un endroit. Les huit sites du
  pilot y délèguent, y compris les cinq qui normalisaient déjà **à la main** : cinq copies
  correctes d'une même fonction sont cinq occasions que la sixième soit fausse ;
- **la règle E4** — un site qui hache le contenu d'un **fichier** normalise ses fins de ligne, par
  la fonction partagée ou visiblement. E1 et E2 tiennent la liste ; E4 tient le contenu.

La portée d'E4 est **bornée au pilot**, et le motif est écrit : la fonction vit ici, une forge ne
l'adopte qu'après publication, et chaque site demande son jugement — un scelleur de release hache
peut-être des binaires à bon droit. Les sites des autres forges sont **nommés** par un constat non
bloquant, jamais exclus par leur nom : une exclusion nommée signale une cause non traitée (N-13),
un signal nommé ouvre un travail.

> **Limite du rapprochement, constatée le 25/08** : E1 et E2 apparient un site à sa ligne par son
> NOM DE FICHIER seul. `forge-ops` porte désormais son propre `scripts/lib-empreinte.mjs`, distinct
> de celui du pilot — deux fichiers homonymes dans deux dépôts, que le contrôle compte comme un.
> Il ne peut donc pas dire qu'un des deux serait indéclaré. La table est écrite pour un lecteur
> humain, et elle nomme les deux ; le contrôle, lui, ne les distingue pas, et c'est déclaré ici
> plutôt que supposé résolu.

| Dépôt | Site | Ce qui est scellé | Format |
|---|---|---|---|
| pilot | **`scripts/lib-empreinte.mjs`** | LE calcul lui-même — `empreinteFichier`, `empreinteTexte`, `empreinteBinaire`, `tailleNormalisee` | **la fonction partagée** : fins de ligne normalisées LF, rien d'autre |
| forge-ops | **`scripts/lib-empreinte.mjs`** · `scripts/ops.mjs` · `oracles/oracle-ops.mjs` | fichiers d'une release déployée ou promue (O-7) | `forge-ops/empreinte@1` — **texte normalisé LF, binaire brut**, vérification acceptant les deux formes (migration TF-0615) |
| pilot | `oracles/oracle-conformite-projet.mjs` | parité source→projection de `TODO-PRODUIT`, `ARCHITECTURE`, `MODELE-DONNEES` (R-20/R-26) | sceau court (12 hex) dans la page générée |
| pilot | `oracles/oracle-boite-entree.mjs` | lots entrants déjà ingérés (TF-0253) | sceau de contenu normalisé LF |
| pilot | `scripts/verifier-jugement.mjs` | jugements humains scellés (`pilot/jugement@1`) | sha256 par livrable |
| pilot | `todo/generer-page.mjs` · `todo/generer-archive.mjs` · `scripts/lib-vue-html.mjs` | parité registre→vue générée | sceau court (12 hex), **normalisé LF** via `lib-empreinte` |
| pilot | `todo/generer-vue.mjs` · `todo/generer-todo-produit.mjs` | parité registre→vue Markdown, et source produit→projection | sceau court (12 hex), **normalisé LF** via `lib-empreinte` |
| pilot | `todo/ingerer-lot.mjs` | lot de retours ingéré (empreinte d'idempotence) | sceau de contenu normalisé LF |
| pilot | `scripts/generer-avancement.mjs` | source du rapport d'avancement dérivé du registre (TF-0324) | sceau court (12 hex), normalisé LF |
| pilot | `todo/self-test.mjs` | recette du registre : vérifie les sceaux qu'elle produit | usage de test, déclaré |
| pilot | `oracles/hook-produits-intacts.mjs` | état de travail de chaque dépôt PRODUIT, relevé à l'ouverture et recomparé à la fin du tour | sceau court (12 hex) de l'état git |
| pilot | `bootstrap.mjs` | divergence entre un skill versionné et sa copie installée (K2) | sha256 par fichier |
| pilot | `todo/appliquer-export.mjs` | export du registre rendu à un tiers | sha256 du lot, **normalisé LF** via `lib-empreinte` |
| pilot | `scripts/relever-heritage.mjs` | artefact d'héritage chez un produit : « présent » contre « présent ET À JOUR » (TF-0626) — la seule distinction qu'une existence ne donne pas, et un produit portant une copie périmée croit être conforme | sceau court (12 hex), **normalisé LF** via `lib-empreinte` ; comparaison SOURCE↔CIBLE, aucun contenu rendu |
| pilot | `todo/emettre-travaux.mjs` | le CONTENU CONFIÉ d'un lot de travaux — la liste des artefacts et leur état, PAS l'enveloppe qui les porte (TF-0627). Premier jet : le sceau portait le lot entier, titre compris, donc l'indice du jour — deux passages du même relevé déposaient deux lots identiques dans le fond, et la boîte du produit se remplissait. Trouvé par la recette d'idempotence, qui rendait 4 fichiers au lieu de 2 | sceau court (12 hex), **normalisé LF** via `lib-empreinte` ; ÉCRIT dans le lot lui-même, pour qu'un lot porte son identité sans être reparsé |
| forge-seo-geo | `scripts/grille.py` · `scripts/gabarits.py` | empreinte de grille et registre d'évolutions (TF-0072) | sceau court dans le registre |
| forge-conception | `oracles/oracle-tracabilite.mjs` · `oracles/oracle-vues-profil.mjs` | scellement d'`EXIGENCES.json` et parité de ses vues | sha256 du référentiel |
| forge-design | `skills/systeme-de-marque/scripts/generer-design-md.mjs` | `DESIGN.md`, vue dérivée des tokens et de la voix | sceau dans la vue, **normalisé LF** (TF-0615) |
| forge-agents | `skills/quality-oracles/scripts/run-oracles.mjs` | clé de cache d'un lancement d'oracles (16 hex, **non persisté**) | usage interne, déclaré |
| forge-agents | `skills/digit-ai-page-html/scripts/check_html.py` | empreinte du JEU DE RÈGLES, citée au journal d'oracle (R-32) | empreinte de règles, pas de contenu |
| forge-agents | `skills/forge-agents/scripts/otlp-project.mjs` | identifiant de trace d'un envoi de télémétrie | usage interne, déclaré |

**Contrôlé** : `node oracles\oracle-empreintes.mjs [racine]` — E1 les sites déclarés existent
encore · E2 aucun site de scellement non déclaré · E3 une empreinte au format `@1` est complète et
lisible (`--verifier <fichier.json>`).

## Ce qui n'est pas jugé, et pourquoi c'est écrit

- **La JUSTESSE d'un scellement** : que l'empreinte corresponde vraiment au contenu se vérifie sur
  place, par l'oracle qui la lit — jamais d'ici.
- **Les usages internes** : une clé de cache, un identifiant de trace, une empreinte de jeu de
  règles ne jugent aucune fraîcheur d'artefact. Ils sont **déclarés** au registre pour qu'on ne les
  redécouvre pas comme des sites oubliés, et ils ne sont pas tenus au format.
- **Les sites hors des emplacements connus** : le contrôle lit `scripts/`, `oracles/`, `tools/`,
  `todo/` et les scripts de skills, à profondeur bornée. Un hachage enfoui ailleurs reste invisible,
  et c'est déclaré plutôt que promis.
- **Le contenu des dépôts frères non clonés** : ce qui n'est pas sur le poste n'est pas jugé.
- **La clé du registre est le NOM DE FICHIER**, pas le chemin : deux homonymes dans deux dépôts
  comptent pour une seule déclaration. C'est un choix — un chemin complet aurait rendu la table
  fragile au moindre renommage de dossier — et sa conséquence est écrite : un second `self-test.mjs`
  qui se mettrait à sceller autre chose passerait pour déclaré.
