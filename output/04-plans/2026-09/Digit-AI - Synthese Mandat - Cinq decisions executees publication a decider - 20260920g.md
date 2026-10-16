---
destinataire: humain
---

# Vos 5 décisions du 20/09/2026 sont exécutées : dépôts publiés, skills à jour, rapport d'audit basculé sur le canevas, 6 lots de travaux prêts, 5 familles de gabarits avec leur page — 15 enregistrements neufs attendent votre feu vert de publication

## 0. Synthèse d'ouverture

Vos 5 réponses sont devenues des faits, et j'ai rejoué moi-même la preuve de chacune. Les dépôts de la
campagne sont publiés. La copie installée des skills est à jour ; sa mise à jour a, pour la première
fois, mesuré les dépôts qui s'en servent, et cette mesure a trouvé une régression et 2 défauts de
l'outil tout neuf, tous corrigés dans la foulée. Le rapport d'audit dessine son schéma de base de
données avec le canevas, dans l'option que vous avez retenue. Les lots de travaux sont prêts pour 6
produits et rien n'a été déposé chez eux. Les 5 familles de gabarits neuves ont leur page, jugée sur
grand écran, mobile et papier. Ce travail d'exécution a produit 15 enregistrements neufs, tous sur ce
poste. Ce qui est attendu de vous : 1 décision, leur publication.

## 1. En-tête d'identification

- **quoi** — exécution de vos décisions D-2 (a), D-3 (a), D-4 (b), D-5 (a), D-6 (b), rendues sur la
  restitution de campagne du 20/09/2026 ; restitution complète, elle remplace le point d'étape du tour.
- **sur quoi** — le pilot `digit-ai-factory`, les forges `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-audit`, `digit-ai-forge-tests`, et la copie installée des
  skills de ce poste.
- **quand** — le 20/09/2026, de 21h08 à 22h59 (Europe/Paris), heures relevées par commande.
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `c70de52e` à l'enregistrement de cette
  restitution ; 4 agents de campagne relancés avec leur contexte (forge-audit, forge-tests, 2 au
  pilot l'un après l'autre), tous sur le modèle Opus ; escalade de modèle : aucune.
- **intention** — que les 5 choix que vous avez faits deviennent des faits vérifiables, sans qu'aucun
  ne soit exécuté à moitié ni plus loin que ce que vous avez décidé. **Test rétro** : servi pour les 5,
  avec 2 réserves dites plus bas — 2 des lots de travaux ne peuvent pas être émis, et ce que cette
  exécution a produit n'est pas publié, votre feu vert D-2 ne couvrant que la campagne.

## 2. Verdict en une ligne

**5 décisions exécutées sur 5** · 5 dépôts publiés, écart `0 0` après publication · 5 skills remis à
niveau, `oracle-skills` **PASS**, 4 dépôts consommateurs mesurés avant et après · 1 régression et 2
défauts d'outil trouvés par cette mesure, corrigés et rejoués · forge-audit : 13 étapes sur 13, 151
tests contre 141 · 6 lots de travaux rendus à blanc, 0 refusé, 0 déposé · 10 pages de gabarits à 0
bloquant aux 6 largeurs, parc des gabarits **PASS** à 95 constats · harnais du pilot : 1 recette en défaut sur 130, antérieure à la campagne (2 avant la mise à jour des skills) ·
19 items clos sur 36 depuis le début de la campagne · **15 enregistrements locaux, 0 publié**.

## 3. Décisions attendues de vous

1 décision, D-7. Avant elle, l'inventaire de ce qui reste à l'arrêt après l'exécution.

Inventaire des bloquants :

- **La publication des 15 enregistrements neufs** — il faut votre feu vert — sinon l'autre poste ne
  voit ni la bascule du rapport d'audit, ni les pages des gabarits, ni les 2 corrections, et la forge
  des tests reste publiée avec 1 test qui échoue dès que la copie installée est à jour.
- **Le dépôt des 6 lots de travaux chez les produits** — il faut, pour chaque produit, une session que
  vous ouvrez avec un mandat déclaré sur lui — sinon les lots restent à l'état de rendu à blanc ; ils
  se régénèrent à l'identique au moment du dépôt.
- **Le lot de travaux du contrôle de transparence inexistant** — il faut que le dépôt du produit
  concerné soit présent sur ce poste et connu de la table des pseudonymes — sinon ce constat reste
  orphelin, et l'émetteur le nomme à chaque passage.
- **Le lot de travaux du rangement des 14 porteurs de secrets** — il faut désigner, produit par
  produit, à qui chaque porteur revient — sinon l'émetteur, qui n'admet qu'un destinataire explicite,
  ne le confie à personne.

> **D-7 — Les 15 enregistrements produits par l'exécution de vos décisions se publient-ils maintenant sur GitHub ?**
>
> L'exécution a produit 11 enregistrements au pilot, 2 chez la forge d'audit et 1 chez la forge des
> tests, plus celui de cette restitution. Ils portent la bascule du rapport d'audit sur le canevas
> `template-modele-donnees.html`, les 10 pages des gabarits sous `gabarits\documents\`, la correction
> de l'outil `oracles\consommateurs-skills.mjs`, celle du test de forge-tests, et le registre. Votre
> feu vert D-2 (a) portait sur les enregistrements de la campagne ; ceux-ci sont nés après lui.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` R-38 §4-5 (un enregistrement qui
> porte une clôture, une règle ou du code relève du feu vert explicite ; la porte des noms est rejouée
> juste avant la publication) ; mesure du tour : vérifications natives des 3 dépôts sans échec
> nouveau, et `git rev-list --left-right --count HEAD...origin/main` à 0 de retard après `git fetch`.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je publie les 3 dépôts : `git fetch` d'abord, rejeu par-dessus l'autre poste s'il a publié entre-temps, porte des noms jouée sur chacun, puis relevé de fraîcheur | effort simple × court | exclut de relire vous-même les 15 enregistrements avant qu'ils soient publics |
| (b) rien n'est publié pour l'instant | effort nul | exclut que l'autre poste reçoive la correction du test de forge-tests ; sa suite y rendra 2 échecs dès qu'il mettra ses skills à jour |
| (c) je publie forge-audit et forge-tests, pas le pilot | effort simple × court | exclut un registre publié à jour : la clôture de la bascule du rapport d'audit resterait sur ce poste |

> **Si rien n'est décidé** : l'option (b) s'applique — les 15 enregistrements restent sur ce poste.

## 4. Traité — avec sa preuve

- **D-2 (a) — les 5 dépôts de la campagne sont publiés et alignés.** Ce poste n'a pas d'hameçon de
  publication et la porte des noms ne vit pas au pilot mais dans le skill des oracles : j'ai joué la
  garde d'avance et la porte à la main, juste avant de publier.
  - preuve : `oracle-nom-client-publie.mjs`, joué depuis la copie installée, rend `"verdict": "PASS"`,
    0 constat, exit 0, sur les 5 dépôts ; `git push origin main` rend exit 0, 5 fois, sous
    `FORGE_PUSH_GO="D-2 (a) du 20/09/2026"` ; le relevé d'après rend `0 0` partout.
- **D-3 (a) — la copie installée des skills est à jour, consommateurs mesurés avant et après.**
  - preuve : `node oracles/oracle-skills.mjs --appliquer` rend `"verdict": "PASS"`, mode « mesuré », 5
    skills remis à niveau (13, 2, 5, 2 et 3 fichiers) ; rejoué en lecture, `"verdict": "PASS"`.
    Consommateurs : forge-design et forge-data PASS avant et après ; forge-tests FAIL avant (1 test)
    et FAIL après (2 tests) ; forge-audit non jugé, « aucun shell POSIX sur ce poste ».
- **Cette mesure a trouvé 1 régression et 2 défauts de l'outil livré le soir même, tous corrigés.**
  Classes : témoin posé sur le mauvais objet ; contrôle vrai sur le mauvais invariant. Le test neuf en
  échec chez forge-tests est corrigé sans être affaibli, 1 assertion remplacée par 3. L'outil de
  mesure compare désormais les échecs un à un quand un dépôt échoue avant et après, et ne compte plus
  pour un rouge une commande qui n'a rien jugé.
  - preuve : forge-tests `e0691b3` — rejoué par le pilot, `uv run pytest -q` rend 1 seul échec,
    antérieur à la campagne ; pilot `a548cf02` — rejoué par le pilot,
    `node oracles/consommateurs-skills.test.mjs` rend « 22 PASS, 0 FAIL » (14 au départ), dont le cas
    exact de ce soir.
- **D-4 (b) — le rapport d'audit dessine son schéma de base de données avec le canevas (TF-0940,
  clos).** Classe : 2 moteurs pour un même rendu. Contrat de données étendu à 4 attributs
  d'habillage, plus 1 pour le nom accessible du dessin, tous facultatifs et jamais devinés ; copie
  conforme déclarée dans un fichier d'héritage, avec un contrôle de dérive qui se tait, en le disant,
  quand le dépôt frère est absent ; dictionnaire filtrable du rapport conservé.
  - preuve : forge-audit `8f594f0`, `52a7656` ; rejoué par le pilot sous Git Bash :
    `node tools/verifier.mjs` rend « 13/13 étape(s) … toutes vertes » (12 au départ),
    `node tools/verifier-heritage.mjs` rend « 1 copie(s) conforme(s), 0 dérive(s) », exit 0 ; selon
    l'agent, 151 tests contre 141, et contrôles de page du socle à bloquants identiques avant et après.
- **Le site de scellement neuf de la forge d'audit est déclaré au pilot — après 1 enregistrement que
  j'ai posé sans avoir lu le verdict.** Classe : enregistrement posé sans lire le verdict du contrôle
  qui le garde. Ma première déclaration faisait passer une règle de l'oracle des empreintes et en
  faisait échouer une autre ; l'enregistrement suivant corrige et le dit.
  - preuve : `node oracles/oracle-empreintes.mjs` rend FAIL sur E2, puis FAIL sur E1 après `00e1403b`,
    puis `"verdict": "PASS"` avant `70b26a71`, enregistré sous condition de ce verdict.
- **D-5 (a) — 6 lots de travaux sont prêts, aucun n'est déposé.** L'émetteur, joué à blanc, rend 6
  lots jugés par leur oracle : les manques d'héritage pour 6 produits, et pour l'un d'eux la porte de
  fraîcheur de déploiement, les captures en pleine page et les 15 contrôles sans recette.
  - preuve : `node todo/emettre-travaux.mjs --tous --essai` rend 6 en-têtes « ESSAI, RIEN ÉCRIT »,
    sceaux `80e4c6a2296e`, `5f48ff9b3274` (3 fois), `9540658362ed`, `982f01510035`, et « 0 lot(s)
    déposé(s), 0 déjà présent(s), 0 refusé(s) avant dépôt ».
- **D-6 (b) — les 5 familles de gabarits neuves ont leur squelette et leur instance de page.**
  Classe : gabarit de document sans forme de page. 10 pages, faites pour l'écran, le mobile et
  l'impression ; la mention de transparence de l'étude de cas est vérifiée identique à sa source ; le
  mode d'emploi porte sa section obligatoire sur les choix d'architecture. L'agent a d'abord
  enregistré 193 captures d'écran, 83,5 Mo, que le hook d'écriture dépose dans le dépôt, puis les a
  retirées.
  - preuve : pilot `8f7f98f8`, `2a2b6109`, `f0f86942`, `fe7ab198`, `b11d3003`, `ec9cb124` ; rejoué par
    le pilot : `node oracles/oracle-gabarits-documents.mjs` rend `"verdict": "PASS"`, 95 constats, 0
    FAIL (65 au départ), self-test « 29/29 PASS » ; par sondage sur 2 pages, `check_html.py` exit 0
    et `render_page.py` exit 0 ; critique d'implémentation de forge-design par son point d'entrée,
    `run-oracles-design.mjs --mobile`, sur la page du courrier fournisseur : PASS sur ses 7 oracles,
    bascule de thème comprise. Selon l'agent : les 10 pages à 0 bloquant aux 6 largeurs et PASS aux 7
    oracles.
- **Le registre porte vos décisions, la clôture de TF-0940 et 5 candidats neufs : TF-1252 à
  TF-1256.** Parmi eux : ce poste n'a aucun hameçon de publication alors que la doctrine dit que le
  pilot en joue un ; le hook d'écriture dépose ses captures dans le dépôt.
  - preuve : `node todo/journaliser.mjs` rend `verdict_apres` PASS à chacune des 4 écritures ;
    `node todo/ingerer-lot.mjs` rend « 5 candidature(s) ingérée(s) en CANDIDAT (lot e5ec3260713d) » ;
    la vue compte 58 candidats, 9 décidés, 8 en cours.
- **Le harnais complet du pilot, rejoué en fin de tour.**
  - preuve : `node oracles/self-tests.mjs` rend « 1/130 oracle(s) en défaut : scripts/rebatir-clone.test.mjs »,
    exit 1 — 1 seul défaut, antérieur à la campagne ; il y en avait 2 avant la mise à jour des skills.

## 5. Non traité — avec son motif

- La publication des 15 enregistrements neufs : motif `dependance_bloc_3` — attend D-7.
- Le dépôt des 6 lots chez les produits : motif `garde_fou` — aucun mandat déclaré sur un produit
  dans cette session ; c'est l'option que vous avez retenue.
- Le lot de travaux du contrôle de transparence (TF-1105) : motif `dependance_externe` — son produit
  destinataire est désigné au registre, l'émetteur le rend « orphelin : aucun produit du parc ne
  correspond ».
- Le rangement des 14 porteurs de secrets (TF-1090) : motif `garde_fou` — l'item vise plusieurs
  produits et n'en désigne aucun, l'émetteur n'admet qu'un destinataire explicite, jamais déduit ; la
  rotation des identifiants publiés reste votre geste.
- Le test de forge-tests en échec depuis avant la campagne, un contraste de 1,21 pour 1 dans son
  propre tableau de bord : motif `hors_mandat` — il n'appartient à aucun item décidé ; entré en
  candidat, TF-1252.
- Les 16 captures d'écran de 2 familles de gabarits antérieures, encore suivies par git, et les 2
  familles au statut « ok » sans squelette de page : motif `hors_mandat` — D-6 (b) ne les visait pas ;
  entrés en candidats, TF-1253 et TF-1254.
- La recette de reconstruction d'un clone, en défaut sur ce poste depuis avant la campagne : motif
  `hors_mandat` — occurrence notée sur le candidat TF-1231.

## 6. Écarts à la lettre

- **D-5 (a) disait** que je prépare les lots et les range au pilot. **J'ai fait** le rendu à blanc et
  relevé leurs sceaux, sans copie au pilot. **Pourquoi** : l'émetteur régénère chaque lot depuis le
  registre au moment du dépôt et garde alors l'original au pilot ; une copie de ce soir serait périmée
  au premier changement du registre.
- **D-5 (a) parlait** de 6 corrections. **4 sont couvertes** par les lots ; 2 ne peuvent pas être
  émises, le contrôle de transparence et le rangement des secrets. **Pourquoi** : produit absent du
  parc de ce poste pour l'un, aucun destinataire unique pour l'autre.
- **D-3 (a) disait** que je vous rends le nom de tout dépôt qui passait et ne passe plus. **Aucun
  dépôt n'est dans ce cas** ; mais forge-tests, déjà en échec, a eu 1 échec de plus. Je vous l'ai
  rendu, et l'outil sait maintenant le dire.
- **D-4 (b) disait** 4 attributs. **Livré** : 5, le cinquième portant le nom accessible du dessin ; et
  une relation sans colonne rend un avertissement, pas une erreur. **Pourquoi** : refuser aurait
  rendu illisibles des audits existants, ce que la décision excluait.
- **D-6 (b)** : les instances Markdown d'origine sont conservées à côté des pages, l'oracle les admet.

## 7. Risques

- **L'autre poste publie pendant que ces 15 enregistrements restent locaux.**
  - signal : le relevé d'ouverture affiche « DIVERGÉ », ou `git push` rend « rejected ».
  - parade : D-7 (a) ; `git fetch` juste avant toute publication, rejeu par-dessus.
- **La forge des tests est publiée avec 1 test qui échoue dès que la copie installée est à jour.**
  - signal : sa suite rend 2 échecs sur l'autre poste après sa propre mise à jour des skills.
  - parade : la correction `e0691b3` part avec D-7 (a).
- **Ce poste publie sans hameçon : la porte des noms n'est jouée que si la session y pense.**
  - signal : `.git\hooks` du pilot ne porte que `pre-commit`.
  - parade : candidat TF-1255 ; d'ici là je joue la porte à la main avant chaque publication.

## 8. Prochaines actions

Ordre du tableau : l'action de l'IA d'abord, celle que D-7 débloque ; puis vos 3 actions, dans
l'ordre où je recommande de les traiter, la publication avant les lots, les lots avant les candidats.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-10** | Publier le pilot, forge-audit et forge-tests : `git fetch`, rejeu si l'autre poste a publié, porte des noms sur chacun, `git push`, relevé `node bootstrap.mjs --pull` | `auto_ia` | neuve | `dependance_bloc_3` — attend D-7 (a) ou (c) | 15 enregistrements ne vivent que sur ce poste |
| **A-11** | Trancher D-7 — répondre « D-7 (a) », « D-7 (b) » ou « D-7 (c) » | `manuelle_utilisateur` | neuve | `decision` — publier du code et des clôtures est un feu vert humain (R-38) | l'option (b) s'applique |
| **A-12** | Faire déposer les 6 lots de travaux : pour chaque produit, ouvrir une session avec un mandat déclaré sur lui, puis écrire « dépose le lot de travaux du pilot » ; la commande jouée sera `node todo\emettre-travaux.mjs --produit <nom>` | `manuelle_utilisateur` | TF-1078 | `decision` — un mandat d'écriture chez un produit ne se déclare que par vous | les 6 produits ignorent que 61 éléments les attendent |
| **A-13** | Décider les candidats du registre — répondre « décide TF-1255 » pour chacun de ceux que vous retenez ; la liste est dans `todo\TODO.md` | `manuelle_utilisateur` | neuve | `decision` — seul un mandat humain fait passer un candidat en décidé | 58 candidats attendent, dont 3 majeurs entrés ce jour (TF-1244, TF-1248, TF-1255) |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme. Point d'étape du tour :
  `output\04-plans\Digit-AI - Synthese Mandat - Decisions 2a 3a 5a executees 4b et 6b en cours - 20260920f.md`.
- Publiés le 20/09/2026 à 21h10 : pilot `c70de52e`, forge-agents `9b042dc`, forge-data `b58213f`,
  forge-audit `f209679`, forge-tests `29fd97b`.
- Enregistrements locaux non publiés — pilot : `6f861f7f`, `a548cf02`, `00e1403b`, `70b26a71`,
  `8f7f98f8`, `2a2b6109`, `f0f86942`, `fe7ab198`, `b11d3003`, `ec9cb124`, puis ceux du registre et de
  cette restitution ; forge-audit : `8f594f0`, `52a7656` ; forge-tests : `e0691b3`.
- Registre : `todo\TODO.jsonl` — à l'arrivée 9 décidés, 8 en cours, 58 candidats, 396 clos. Lot de
  candidatures : `input\01-candidatures\constats-execution-decisions-20260920d.tf.jsonl`.
- Copie installée des skills : `~\.claude\skills\`, réalignée par `oracle-skills.mjs --appliquer`.
- Pages HTML livrées dans ce tour : les 10 pages de `gabarits\documents\` — `SQUELETTE.html` et
  `INSTANCE.html` de `courrier-fournisseur`, `charte-partenariat`, `kit-partenaire`,
  `etude-de-cas-client`, `mode-emploi-livrable-dossier` ; critique d'implémentation de forge-design
  par `run-oracles-design.mjs --mobile` : PASS, rejouée par le pilot sur 1 page, rapportée par l'agent
  sur les 10.
