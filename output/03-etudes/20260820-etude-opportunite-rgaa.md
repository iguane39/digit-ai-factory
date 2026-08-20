---
destinataire: humain
---

# Étude d'opportunité — RGAA AA dans le parc : forge-design, forge-tests, et ce qui n'est pas mesurable — 20260820a

## Seuil de déclenchement (à vérifier AVANT d'écrire)

**Franchi deux fois.** L'objet **crée des objets durables** (R-31 : un pan de mesure, des règles
d'oracle, une famille de livrables légaux) **et touche ≥ 3 forges** — design, tests, agents
(socle page-html), conception (surface implicite) et le noyau (dossier MEP). L'étude est donc
**obligatoire** avant tout code.

## 0. Traitement des entrants

Deux entrants, tous deux des **données** :

- la question humaine du 20/08 : « est-ce qu'il serait pertinent d'intégrer les normes
  d'accessibilité RGAA AA, dans forge-design, voire dans d'autres forges comme forge-tests ? » ;
- le retour **RF-6 du lot Produit-09 20260820a** (ingéré ce jour), gravité **bloquant** : « une
  obligation légale que le parc entier ne mesure pas — et un `non_juge` qui ne le dit pas ».
  SCC.FR est un site public français : RGAA 4.1 y est une **obligation**, pas un objectif.

La question et le retour se recoupent sans s'être concertés : c'est un signal, pas une preuve.

## 1. Partition du problème

Quatre sous-questions disjointes — et la première discipline de cette étude est de ne pas les
confondre, parce qu'elles n'ont ni le même juge ni le même coût.

1. **Que mesure déjà le parc**, et où le `non_juge` ment-il par omission ?
2. **Qu'est-ce qui est mécanisable** parmi les critères RGAA AA — et qu'est-ce qui ne le sera
   jamais ?
3. **Où vivent les livrables LÉGAUX** (déclaration d'accessibilité, schéma pluriannuel, plan
   d'action, signalement, recours) qu'aucune mesure ne remplace ?
4. **Qui porte quoi** : design (concevoir accessible), tests (mesurer), pilot (bloquer la MEP) ?

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| **`oracle-a11y.py`** (quality-oracles) | en-tête : contrôles structurels, « NE REMPLACE PAS un audit axe-core complet ni le contrôle de contraste » ; `NON_JUGE` : « audit axe-core complet (ARIA avancé, rôles, ordre focus) », « contraste couleur (voir render_page.py V2) », « navigation clavier / pièges de focus » | **RECOUVRE la structure** (noms accessibles, hiérarchie de titres, alt) et **déclare honnêtement ses trois trous** — en pointant même le porteur du contraste |
| **Pan `accessibilite` de forge-tests** | `adaptateurs/accessibilite.py` : câblage d'`oracle-a11y.py` route par route, sur instance servie ; `NON_JUGE` reprend « ni audit axe-core complet, ni contraste, ni navigation clavier », DOM capturé « à l'état INITIAL de chaque route » | **RECOUVRE le câblage produit** de la mesure structurelle. Mêmes trois trous, déclarés — mais déclarés comme des limites LOCALES, pas comme un trou de PARC (le reproche exact de RF-6a) |
| **`render_page.py` V2** (socle page-html, forge-agents) | `MEASURE_JS` : famille `v2_contrast` — luminance WCAG, ratio calculé sur les styles réels de la page rendue, BLOQUANT | **RECOUVRE LE CONTRASTE, et RF-6 l'avait manqué** : la mesure existe, elle est exécutée, et elle a même déjà tourné contre des écrans produits réels (ledger Produit-01, 11/08 : « render_page.py, verdict FAIL, 7 écrans × 3 breakpoints »). Ce qui manque n'est pas la mesure : c'est son **câblage comme pan de forge-tests** — aujourd'hui elle ne tourne que si quelqu'un y pense |
| **`check_html.py`** (socle page-html) | règles L1-L11 sur les livrables HTML : `aria-label`, `aria-describedby`, légendes, langue déclarée | **RECOUVRE les LIVRABLES de la forge** (rapports, dashboards). Ne recouvre pas les produits |
| **forge-design** | 11 oracles (`tokens`, `mobile`, `motion`, `slop`, `taste`…) ; `REFERENTIEL-RESTITUTION.md` §Lecteurs types | **NE RECOUVRE PAS l'accessibilité** : aucun oracle de design ne juge contraste, focus ou clavier. Le référentiel de restitution pense au « commanditaire novice », pas au lecteur empêché |
| **`enumere-la-surface`** (forge-conception) | §« Exception close : la surface implicite SaaS » — liste fermée et versionnée de candidats « proposés d'office et écartés explicitement, jamais par omission » | **RECOUVRE LE MÉCANISME dont les livrables légaux ont besoin** — c'est une liste d'implicites à proposer d'office — mais sa liste ne porte AUCUN des cinq livrables légaux RGAA |
| **Contrat « prêt client » du noyau** | `CLAUDE.md` : « oracles 1-3 verts · forge-tests exit 0/3 · oracle MEP 5/5 · traçabilité 100 % · ledger vérifié » | **NE RECOUVRE PAS** : un produit public français peut sortir « prêt client » avec une conformité légale **non mesurée et non déclarée** — RF-6b |
| **Garde-fou « aucune API tierce payante »** | noyau, §Garde-fous | **NE BLOQUE PAS axe-core** : bibliothèque open source exécutée localement (injection Playwright), aucun service appelé. Elle se VENDORISE (aucun CDN au runtime) comme toute dépendance |

**Ce que la section établit** : le parc mesure **la structure** (partout) et **le contraste**
(render_page V2 — mais hors de la chaîne d'audit produit) ; il ne mesure **ni le clavier, ni les
états ouverts, ni l'ARIA avancé** ; et les **livrables légaux n'existent nulle part**. RF-6
était juste sur le trou, incomplet sur le contraste — la mesure existait, débranchée.

## 3. État de l'art daté

**Non instruit**, déclaré sans entre-deux. Motif : session sans accès réseau — cinq sources
datées écrites de mémoire fabriqueraient la preuve que cette section existe pour exiger. Raison
de fond : la seule question d'outillage ouverte est le moteur de règles ARIA/focus, et le
candidat (axe-core, bibliothèque de référence du domaine, exécutable localement sous Playwright
— déjà une dépendance de forge-tests, `playwright>=1.47`) n'a pas de concurrent sérieux à
départager ici. Le jour où l'option O3 s'exécute, sa fiche de préparation cite les versions et
la couverture réelle d'axe-core par critère RGAA — comme préalable, pas comme décor.

## 3 bis. Ce qui est mécanisable, et ce qui ne le sera jamais

Le RGAA 4.1 compte 106 critères. Les traiter comme un bloc serait la faute symétrique de les
ignorer. Trois familles, trois régimes :

| Famille | Exemples | Régime |
|---|---|---|
| **Mécanisable, et déjà mesuré quelque part** | noms accessibles, hiérarchie de titres, `alt`, langue déclarée, **contraste** | structure : pan `accessibilite` · contraste : `render_page` V2 — **à câbler**, pas à écrire |
| **Mécanisable, non mesuré** | ARIA avancé, rôles, ordre de focus, navigation clavier, pièges de focus, états ouverts (menu, modale, erreur) | axe-core injecté par Playwright + parcours clavier scripté — **un pan à écrire** |
| **Jamais mécanisable** | pertinence d'un alt, compréhensibilité d'un intitulé, équivalence réelle d'un média, sens de l'ordre de lecture | **audit RGAA humain** — un livrable externe à budgéter (RF-6c), que la machine PRÉPARE (échantillon, mesures brutes) sans le remplacer |

**Et la déclaration de conformité est un calcul, pas une opinion** : taux = critères conformes /
critères applicables. La machine peut établir le dénominateur et une partie du numérateur ; le
reste est l'audit humain. Prétendre un « taux RGAA » mécanique serait un chiffre non sourcé —
exactement ce qu'`oracle-claims` refuse ailleurs.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Coût du statu quo, **mesuré** : un produit public français (SCC.FR) est
en étape 0 avec une obligation légale que rien ne mesure ; le `non_juge` du pan accessibilité
déclare ses limites **locales** sans dire que la famille n'est couverte par **aucun oracle du
parc** (le lecteur croit la famille couverte ailleurs — le mécanisme exact de TF-0379, payé
5 jours de run) ; et « prêt client » peut se prononcer sans que l'écart soit même déclaré.
**Réfutée** : le risque est légal, daté, et le premier produit concerné est déjà dans la file.

**O1 — tout mécaniser** (viser un verdict RGAA machine). *Ce qu'elle exclut* : elle est
**impossible honnêtement** — un tiers des critères demande un jugement humain, et un « taux
RGAA » machine serait un chiffre que la déclaration légale ne peut pas porter. **Écartée** : la
machine prépare l'audit, elle ne le rend pas.

**O2 — déclarer d'abord, câbler l'existant ensuite** (retenue, premier temps — voir §5).
(a) Le `non_juge` du pan accessibilité dit que contraste/clavier/états ne sont couverts par
**aucun oracle du parc** — et pointe render_page V2 comme mesure de contraste existante non
câblée. (b) Le contrat « prêt client » et le dossier MEP portent l'écart : pour un produit
public français, la conformité RGAA non mesurée est un **écart déclaré au GO humain**, jamais un
silence. (c) La liste de surface implicite d'`enumere-la-surface` gagne les **cinq livrables
légaux** (déclaration d'accessibilité, schéma pluriannuel, plan d'action annuel, signalement,
recours) — proposés d'office pour tout site public, écartés explicitement sinon. *Coût* : complexité simple · durée court ;
aucun code de mesure. *Ce qu'elle exclut* : rien — elle rend le trou visible et arrêtable.

**O3 — le pan de mesure** (retenue, second temps). Câbler `render_page` V2 (contraste) dans la
chaîne d'audit produit ; écrire le pan axe-core + navigation clavier sous Playwright (déjà
dépendance), axe-core **vendorisé** (aucun CDN au runtime) ; étendre la capture aux **états
ouverts** (menu, modale, erreur) — la limite « DOM à l'état INITIAL » est déclarée depuis
l'origine et RF-6 la cite. *Coût* : complexité complexe · durée long. *Ce qu'elle exclut* : le verdict légal — le pan rend
des **mesures**, l'audit humain rend la **déclaration**.

**O4 — un pan « design accessible » chez forge-design** (tokens de contraste vérifiés à la
source, focus visible dans le système de marque). *Ce qu'elle apporte* : attraper le défaut
**avant** le produit — un token de couleur au contraste insuffisant est un défaut de charte, pas
de page. *Coût* : complexité moyen · durée moyen, extension d'`oracle-tokens`. **Retenue comme troisième temps**,
conditionnée au constat d'O3 : sans mesure aval, une règle amont ne se vérifie pas.

## 5. Verdict

- **Option retenue** : **O2 puis O3 puis O4 — déclarer, mesurer, remonter à la source** ;
  l'ordre est bloquant, et O2 seule est décidable aujourd'hui sans étude supplémentaire.
- **Motif** : la question posée (« intégrer RGAA AA ? ») suppose un choix ; la mesure dit une
  obligation déjà due (RF-6, produit public en étape 0), un mensonge par omission à corriger en
  premier (le `non_juge` local qui tait le trou de parc), et **une mesure de contraste qui
  existe déjà, débranchée** — la câbler vaut mieux que l'écrire. La réponse à « forge-design,
  voire forge-tests ? » est : **forge-tests mesure, forge-design prévient, le pilot bloque** —
  trois rôles, pas un choix entre forges.
- **Coût** : O2 simple·court · O3 complexe·long · O4 moyen·moyen (échelle du rapport d'audit, TF-0408). Aucun euro, aucun service tiers (axe-core local et
  vendorisé).
- **Ce que le verdict NE dit pas** : qu'un verdict RGAA machine existera. Le pan rendra des
  mesures et le dénominateur ; la **déclaration légale reste un audit humain à budgéter**, que
  la machine prépare. Dire l'inverse serait un chiffre non sourcé.
- **Candidature(s) émise(s)** : RF-6 est déjà au registre (ingéré ce jour) et porte les trois
  temps — aucune candidature de plus. O2 relève du traitement du retour ; O3 et O4 attendent la
  décision humaine sur RF-6.
- **Plan de revue** : **2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) le
  `non_juge` du pan dit-il le trou de parc, et le dossier MEP d'un produit public porte-t-il
  l'écart ; (2) render_page V2 a-t-il été câblé, et sur combien de produits le contraste a-t-il
  été mesuré ; (3) SCC.FR a-t-il budgété son audit RGAA humain, ou la question Q-13 du dossier
  est-elle restée ouverte ; (4) la surface implicite propose-t-elle les cinq livrables légaux,
  et combien de produits les ont retenus ou écartés explicitement.

## Les garde-fous, traités nommément

**Aucune API tierce payante.** axe-core est une bibliothèque open source exécutée localement ;
aucun service, aucun envoi. Vendorisée — aucun CDN au runtime, conformément au socle.

**Aucun second porteur d'état.** Les mesures vivent au rapport d'audit, comme tous les pans ;
la déclaration légale vit chez le produit. Aucun registre RGAA central.

**Le non-mesurable se déclare.** Un tiers des critères RGAA ne sera jamais mécanique : le pan le
dit dans son `non_juge`, le dossier MEP le porte en écart, et l'audit humain reste un livrable
externe à budgéter. La pire issue serait un « taux RGAA » machine que la déclaration légale ne
peut pas porter — c'est l'option O1, écartée pour cela.
