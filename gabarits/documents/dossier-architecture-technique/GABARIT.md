# Gabarit — Dossier d'architecture technique (DAT)

> **Famille** `dossier-architecture-technique` · catalogue `gd-dossier-architecture`
> **Formats** Markdown (source) · HTML (rendu remis au comité)
> **Règles engagées** D1 D3 D5 D6 D7 (`gabarits\documents\README.md`)
> **Provenance — extrait de quatre occurrences réelles** :
> `_Nhood/Approval/specs/Nhood - Architecture technique Approval - Cible - 20260604a.html`
> (règles de traitement, authentification et autorisation, protection des données et du réseau,
> conformité et conservation, hypothèses, risques et mesures) ·
> les deux instances vivantes de `docs\projet\ARCHITECTURE.md`
> (`_Nhood/Cockpit IA/nhood-cockpit-ia/`, `_Nhood/SCC_ALX/`) ·
> `_Nhood/BourseAuxVacants/bav-azure/docs/DAT-complements.md` (281 lignes, onze compléments
> répondant chacun à une remédiation d'audit — dont performance mesurée et archivage des
> résultats de charge, SLA et alerting SLO) ·
> `_Nhood/Approval2/docs/exploitation/severite-sla.md` ·
> le catalogue d'ADR de gouvernance de `digit-ai-forge-audit_nhood` (75 décisions).
>
> **Quatre occurrences**, et la quatrième a été trouvée en vérifiant la traçabilité section
> par section : la section 7 était la seule sans source, et plutôt que de la garder sur la
> foi d'un raisonnement d'expert, le corpus a été rebalayé. `DAT-complements.md` la couvre.

## Verdict de non-recouvrement — et pourquoi ce gabarit ASSEMBLE au lieu de décrire

C'est la pièce la plus importante de ce fichier. Le recouvrement avec l'existant est **fort**,
et l'ignorer aurait créé une seconde source de vérité sur l'architecture d'un produit.

| Document confronté | Ce qu'il porte | Frontière retenue |
|---|---|---|
| `docs\projet\ARCHITECTURE.md` (socle du pilot, R-20) | la **vue logique** : vue d'ensemble, composants, flux, données (D06), delivery (D09), choix structurants et renvois ADR. Normé, versionné, projeté en HTML par un générateur | **C'est déjà la moitié d'un DAT, et elle fait foi.** Le DAT n'en réécrit pas une ligne : il y **renvoie**. Ce qu'il ajoute est ce qu'`ARCHITECTURE.md` ne porte pas — trajectoire, sécurité, exigences non fonctionnelles, hypothèses et risques |
| `docs\projet\COMPOSANTS-OPS.md` | l'**instancié déployé** par environnement | Renvoi. Un DAT qui recopie des noms de ressources est périmé au premier redéploiement |
| Rapport d'audit POC-to-Prod (`gd-rapport-audit`) | le **jugement** : notes par dimension, conformité aux ADR, plan de remédiation | Le DAT **décrit et décide** ; il ne note pas. Zéro score, zéro verdict — l'audit est un autre métier, sur mandat |
| `gd-schema-technique` (skill `digit-ai-schemas`) | les **schémas** eux-mêmes | Le DAT les intègre, il ne redéfinit pas leur forme (D5) |

**Verdict : famille NEUVE, mais en COMPOSITION.** Le DAT est un document de **remise** — à un
comité, à un client, à un repreneur — là où `ARCHITECTURE.md` est un document de **travail**
interne au dépôt. Les deux coexistent sans se dupliquer parce que le DAT est une **vue
d'assemblage** : il compose les documents vivants du produit et complète les six sujets qu'aucun
d'eux ne porte. Un DAT rédigé sans `ARCHITECTURE.md` sous les yeux est un DAT qui va diverger.

---

## En-tête — obligatoire

```
---
role: dossier d'architecture technique — la structure, les décisions, et l'écart à la cible
destinataire: humain
role_destinataire: comité d'architecture / client / repreneur
sources_de_verite: ["docs\projet\ARCHITECTURE.md", "docs\projet\COMPOSANTS-OPS.md", "{registre ADR}"]
verifie_le: {AAAA-MM-JJ}
gabarit: gd-dossier-architecture
version_du_gabarit: 1.0.0
etat_decrit: {existant | cible | existant et cible}
---

# Dossier d'architecture technique — {Produit} — {AAAAMMJJ}{indice}
```

`etat_decrit` est **dû**, et c'est le champ le plus souvent oublié. L'occurrence externe la plus
complète du corpus porte « — Cible » jusque dans son nom de fichier : un DAT qui ne dit pas s'il décrit
ce qui tourne ou ce qui est visé est inutilisable en projet de migration, et dangereux en
exploitation.

## Le noyau — huit sections, toutes dues

### 1 · Objet, périmètre et lecteurs

Pour quelle décision ce dossier est écrit, ce qu'il couvre, **ce qu'il ne couvre pas**, et pour
qui. Un périmètre qui n'énumère que ce qu'il inclut laisse le lecteur supposer le reste.

### 2 · Vue logique — par renvoi

> Vue logique : `docs\projet\ARCHITECTURE.md` (composants, flux, données, delivery).
> **Ne pas recopier.** Reprendre ici uniquement ce que le lecteur du DAT ne trouverait pas
> ailleurs : le **résumé en un paragraphe** et le schéma d'ensemble.

Le schéma suit D5 : superpositions déclarées, glyphes prouvés présents dans la pile de repli,
légende et unités dues, et **distinction visuelle entre relevé et cible** quand les deux
coexistent (cible en pointillé, dit en légende).

### 3 · Composants et instances — par renvoi

> Inventaire instancié : `docs\projet\COMPOSANTS-OPS.md`, section « Inventaire par environnement ».

En propre ici : les composants **hors du produit** dont il dépend (services gérés, systèmes
tiers, données reçues), avec pour chacun le **contrat** qui les lie et ce qui se passe s'ils
tombent.

### 4 · Trajectoire — de l'existant à la cible

Due dès que `etat_decrit` vaut « existant et cible ».

| Écart | Existant | Cible | Ce qui le comble | Jalon | Réversible ? |
|---|---|---|---|---|---|

Un écart sans jalon n'est pas une trajectoire, c'est une intention. Un jalon sans porteur nommé
non plus.

### 5 · Décisions d'architecture (ADR)

Chaque décision structurante, **datée**, avec les alternatives écartées et **pourquoi**. Un DAT
sans ADR n'est pas un DAT : c'est une description. Ce qui distingue les deux est la trace du
raisonnement — c'est elle qui permet de rouvrir une décision sans la refaire de zéro.

| ADR | Décision | Alternatives écartées | Motif | Date | Statut |
|---|---|---|---|---|---|

Si le produit s'adosse à un registre d'ADR existant, y **renvoyer** et ne lister ici que les
décisions propres au produit.

### 6 · Sécurité

Quatre sujets, tous présents dans le dossier d'architecture technique externe du corpus : **authentification et
autorisation** (fournisseur, mode, rôles — et la **portée** de la déconnexion, dont l'omission
vaut adoption du comportement le plus large) · **protection des données** (au repos, en
transit, cloisonnement) · **protection du réseau** (exposition, filtrage, points d'entrée) ·
**conservation et conformité** (durées, effacement, obligations applicables).

### 7 · Exigences non fonctionnelles, et comment on les vérifie

| Exigence | Cible chiffrée | Comment elle est mesurée | Constat |
|---|---|---|---|

Disponibilité, temps de réponse, volumétrie, montée en charge, accessibilité si le produit est
public — plus, quand la continuité est engagée, **RPO et RTO** avec la procédure qui les tient
(le DEX en porte le mode opératoire, le DAT en porte l'engagement).

**Une exigence non fonctionnelle sans moyen de mesure est un vœu** — et la colonne « comment
elle est mesurée » est celle qu'on saute par réflexe. Les sources du corpus la remplissent de
deux façons : un **outil de charge dont les résultats sont archivés et datés**, et un **SLA
assorti d'une alerte SLO** qui rend l'écart visible sans attendre la réclamation.

### 8 · Hypothèses, risques et mesures

Ce sur quoi le dossier repose sans l'avoir vérifié (hypothèses, avec leur porteur et leur date
de levée), et ce qui peut mal tourner (risque, impact, probabilité, mesure prise, risque
résiduel **assumé**). Un DAT sans risque déclaré est suspect : il signifie soit une architecture
parfaite, soit une relecture rapide.

## Les sections optionnelles — et comment les omettre

Une section optionnelle non retenue se **déclare en une ligne** (« Sans objet : {motif} »).
Un titre suivi d un emplacement vide est un défaut, pas une omission : le lecteur ne peut pas
distinguer « pas concerné » de « pas rempli », et il tranchera au pire.

| Section | Quand elle est due |
|---|---|
| Coûts et dimensionnement | l'architecture engage une dépense récurrente à arbitrer |
| Règles de traitement métier | le comportement fonctionnel conditionne des choix techniques |
| Schéma d'infrastructure détaillé | le lecteur doit pouvoir reconstruire l'environnement |
| Plan de reprise | une indisponibilité a un coût métier chiffré (et alors le DEX porte la procédure) |
| Alternatives d'architecture écartées | une décision majeure a été contestée, ou le sera |
| Compléments post-audit | un audit a produit des remédiations : elles se répondent dans un document **daté et distinct**, rattaché à chaque remédiation par son identifiant — c'est la forme qu'a prise la quatrième occurrence du corpus, et elle évite de réécrire le DAT à chaque campagne |

## Contrat de personnalisation

| Un projet **doit** | Un projet **peut** | Un projet **ne change pas** |
|---|---|---|
| remplir les huit sections du noyau, ou déclarer l'absence de l'objet | ajouter des sections propres à son domaine | la structure du noyau et l'ordre des huit sections |
| renseigner `etat_decrit` | adapter le vocabulaire à son comité | l'en-tête et ses cinq champs |
| chiffrer chaque exigence non fonctionnelle et dire comment elle se mesure | retirer une section optionnelle **en le déclarant** | les renvois aux documents vivants — jamais de copie |
| porter `version_du_gabarit` de l'instance | | l'interdit de noter : le DAT décrit, il ne juge pas |

## Ce que le gabarit refuse

- **Une vue logique recopiée** depuis `ARCHITECTURE.md` au lieu d'un renvoi.
- **Un `etat_decrit` absent**, ou un schéma qui mêle relevé et cible sans les distinguer (D5).
- **Une décision sans alternative écartée ni motif** — c'est une description, pas une ADR.
- **Une exigence non fonctionnelle sans moyen de mesure.**
- **Une note, un score, un verdict** : l'audit est un autre document, sur mandat.
- **Un tableau d'écarts ou d'ADR sans repli mobile** (D3), **un texte bridé** (D1).

## Avant de remettre

1. Chaque renvoi pointe vers un document **qui existe et qui est à jour** — un renvoi mort est
   pire qu'une copie.
2. Rendu HTML jugé par `check_html.py` **et** `render_page.py --widths 1280,768,390` (D7).
3. Le nombre d'ADR annoncé en tête, s'il l'est, égale le nombre de lignes de la section 5.
4. Aucun `{…}` restant.

## Après la remise — ce que la factory attend de vous

Ce gabarit s'améliore par vos retours, et **par eux seuls**. À la clôture du run, la section
« Retours sur les documents produits » de votre lot (`gabarits\RETOURS-FORGES.md`) attend
quatre choses, dans cet ordre d'utilité :

1. **Ce qu'il a fallu ajouter à la main.** C'est le signal le plus fort : ce que vous avez écrit
   hors gabarit est presque toujours une section que le gabarit devrait porter.
2. **Ce qui a gêné le LECTEUR** — un destinataire qui a demandé deux fois la même information,
   qui a cherché une section ailleurs, qui a refusé une mise en page. Un fait rapporté, pas une
   appréciation d'auteur.
3. **Ce qui a manqué** : section absente, champ non prévu, cas que le gabarit n'anticipe pas.
4. **La portée** : propre à votre projet, ou valable pour la famille. Dans le doute, remontez —
   le tri se fait mieux au registre qu'en silence.

Reportez le couple `gabarit: gd-dossier-architecture` et `version_du_gabarit` tel qu'il figure en en-tête de
votre document : c'est lui qui rend le retour applicable. Sans lui, « il manquait une section »
ne se rattache à aucune famille et à aucune version (R-46).
