---
destinataire: humain
---

# Point d'étape — vos 5 décisions : 4 sont exécutées et rejouées, dont la bascule du rapport d'audit ; les squelettes de page sont enregistrés pour 2 familles de gabarits sur 5

## 0. Synthèse d'ouverture

Vos 5 réponses sont prises en compte. Les 5 dépôts de la campagne sont publiés sur GitHub et alignés.
La copie installée des skills est à jour, et pour la première fois la mise à jour a rejoué les
vérifications des 4 dépôts qui s'en servent : elle a fait apparaître 1 test neuf en échec chez la
forge des tests, que l'outil livré ce soir n'a pas su nommer, et 1 commande qu'il ne sait pas jouer
sur ce poste. Les 2 agents concernés ont corrigé, et j'ai rejoué leurs preuves. Les lots de travaux destinés aux produits
sont prêts pour 6 produits ; rien n'a été déposé chez eux. La bascule du schéma du rapport d'audit,
dans l'option que vous avez retenue, est faite et rejouée : le rapport dessine son schéma avec le
canevas. Les squelettes de page sont enregistrés pour 2 familles de gabarits sur 5, les 3 autres sont en cours chez leur agent. Rien n'est attendu de vous à cette étape.

## 1. En-tête d'identification

- **quoi** — **point d'étape** de l'exécution de vos décisions D-2 (a), D-3 (a), D-4 (b), D-5 (a),
  D-6 (b), rendues sur la restitution de campagne du 20/09/2026 ; le résultat de 2 d'entre elles
  n'est pas encore mesurable.
- **sur quoi** — le pilot `digit-ai-factory`, les forges `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-audit`, `digit-ai-forge-tests`, et la copie installée des
  skills de ce poste.
- **quand** — le 20/09/2026, de 21h08 à 22h23 (Europe/Paris), heures relevées par commande.
- **qui** — session pilot Claude Fable 5.1, pilot à `70b26a71` ; 4 agents de campagne relancés avec
  leur contexte (forge-audit, forge-tests, 2 au pilot l'un après l'autre), tous sur le modèle Opus ; escalade : aucune.
- **intention** — que les 5 choix que vous venez de faire deviennent des faits vérifiables, sans
  qu'aucun ne soit exécuté à moitié ni plus loin que ce que vous avez décidé. **Test rétro** : servi
  pour la publication, la mise à jour des skills, la préparation des lots et la bascule du rapport
  d'audit ; non mesurable encore pour les squelettes de page.

## 2. Ce qui reste à mesurer, et par quoi

Les 5 squelettes de page, mesurés par `node oracles/oracle-gabarits-documents.mjs`, par le contrôle
des pages du socle (`check_html.py`, `render_page.py` aux 6 largeurs) et par le point d'entrée de la
critique de forge-design ; puis le harnais complet du pilot, `node oracles/self-tests.mjs`.

## 3. Décisions attendues de vous

Rien n'attend de décision à cette étape. 6 bloquants : le premier tient à la fin d'un agent, les 5 autres à un produit ou à vous.

Inventaire des bloquants :

- **Les squelettes de page des 3 familles de gabarits restantes** — il faut que leur agent rende la
  main — sinon je le relance à la frontière de famille où il s'est arrêté.
- **Le sort des captures d'écran déposées dans le dépôt à côté de chaque gabarit** — il faut votre
  choix entre les suivre avec git, comme 2 familles antérieures le font déjà, ou les tenir hors du
  dépôt — sinon la convention existante continue, à raison d'une dizaine de mégaoctets par famille.
- **Le lot de travaux du contrôle de transparence inexistant** — il faut que le dépôt du produit
  concerné soit présent sur ce poste et connu de la table des pseudonymes — sinon ce constat reste
  orphelin, l'émetteur le nomme à chaque passage.
- **Le lot de travaux du rangement des 14 porteurs de secrets** — il faut désigner, produit par
  produit, à qui chaque porteur revient, l'item visant plusieurs produits sans en nommer aucun — sinon
  l'émetteur, qui n'admet qu'un destinataire explicite, ne le confie à personne.
- **La publication de l'enregistrement qui consigne vos décisions, et de ceux que les agents
  produisent en ce moment** — il faut votre feu vert, que je vous demanderai une seule fois à la
  restitution complète — sinon ils restent sur ce poste.
- **Le dépôt des 6 lots prêts chez les produits** — il faut, pour chaque produit, une session que
  vous ouvrez avec un mandat déclaré sur lui — sinon les lots restent à l'état de rendu à blanc, et
  se régénèrent à l'identique au moment du dépôt.

## 4. Traité — avec sa preuve

- **D-2 (a) — les 5 dépôts sont publiés et alignés.** La porte des noms ne vit pas au pilot mais dans
  le skill des oracles ; je l'ai jouée depuis la copie installée, sur les 5 dépôts, historique
  compris, juste avant de publier. Ce poste n'a pas d'hameçon de publication : je l'ai jouée à la main.
  - preuve : `oracle-nom-client-publie.mjs` rend `"verdict": "PASS"`, 0 constat, exit 0, 5 fois ;
    `git fetch` puis `git rev-list --left-right --count HEAD...origin/main` rendait 17, 8, 2, 1 et 1
    d'avance et 0 de retard ; `git push origin main` a rendu exit 0 dans les 5 dépôts, sous
    `FORGE_PUSH_GO="D-2 (a) du 20/09/2026"` ; le relevé d'après rend `0 0` partout.
- **D-3 (a) — la copie installée des skills est à jour, consommateurs mesurés avant et après.**
  - preuve : `node oracles/oracle-skills.mjs --appliquer` rend `"verdict": "PASS"`, exit 0, mode
    « mesuré » : 5 skills remis à niveau (13, 2, 5, 2 et 3 fichiers) ; le même oracle rejoué en
    lecture rend `"verdict": "PASS"`. Consommateurs : forge-design PASS avant et après, forge-data
    PASS avant et après, forge-tests FAIL avant (1 test) et FAIL après (2 tests), forge-audit non
    jugé — sa vérification sort en 138 ms sur « aucun shell POSIX sur ce poste ».
- **Ce que cette mesure a trouvé, et que l'outil n'a pas dit.** Classe : règle neuve mesurée chez son
  seul auteur. L'outil compare des codes de sortie : la forge des tests étant déjà en échec avant, il
  a conclu que la mise à jour n'y était pour rien, alors qu'un second test est tombé après elle.
  - preuve : sortie de l'outil, extrait d'avant « FAILED tests/test_tf_0117.py::… », extrait d'après
    le même plus « FAILED tests/test_tf_0409_contraste_clavier.py::… » ; rejoué par le pilot, ce test
    rend « AssertionError: la mesure jouée ne vient pas du fichier du socle ». Les 2 agents auteurs
    sont relancés avec ces sorties.
- **D-5 (a) — les lots de travaux sont prêts, aucun n'est déposé.** L'émetteur de travaux, joué à
  blanc, rend 6 lots, chacun jugé par son oracle avant dépôt : les manques d'héritage pour 6 produits
  (10 éléments chacun), et pour l'un d'eux 11 éléments, dont la porte de fraîcheur de déploiement, les
  captures en pleine page et les 15 contrôles sans recette.
  - preuve : `node todo/emettre-travaux.mjs --tous --essai` rend 6 en-têtes « ESSAI, RIEN ÉCRIT »,
    sceaux `80e4c6a2296e`, `5f48ff9b3274` (3 fois), `9540658362ed`, `982f01510035`, et « 0 lot(s)
    déposé(s), 0 déjà présent(s), 0 refusé(s) avant dépôt ».
- **Les décisions D-4 (b), D-5 (a) et D-6 (b) sont consignées au registre.**
  - preuve : `node todo/journaliser.mjs` rend « 1 événement(s) journalisé(s) » puis « 2 événement(s)
    journalisé(s) », `verdict_apres` PASS ; enregistrement local `6f861f7f`.
- **D-4 (b) — le rapport d'audit dessine son schéma de base de données avec le canevas (TF-0940,
  clos).** Classe : 2 moteurs pour un même rendu. Le contrat de données est étendu à 4 attributs
  d'habillage, plus 1 pour le nom accessible du dessin, tous facultatifs et jamais devinés ; la copie
  conforme du canevas est déclarée dans un fichier d'héritage, avec un contrôle de dérive qui se
  tait, en le disant, quand le dépôt frère est absent ; l'ancien moteur n'est plus qu'un appel ; le
  dictionnaire filtrable du rapport est conservé.
  - preuve : forge-audit `8f594f0` et `52a7656`, locaux ; rejoué par le pilot sous Git Bash :
    `node tools/verifier.mjs` rend « 13/13 étape(s) … toutes vertes » (12 au départ),
    `node tools/verifier-heritage.mjs` rend « 1 copie(s) conforme(s), 0 dérive(s) », exit 0 ; selon
    l'agent, 151 tests contre 141, et les contrôles de page du socle à bloquants identiques avant et
    après ; clôture au registre : `node todo/journaliser.mjs`, `verdict_apres` PASS.
- **Le test neuf en échec chez forge-tests est corrigé sans affaiblir le test.** Classe : témoin posé
  sur le mauvais objet. 1 assertion remplacée par 3 : la mesure vient de la porte du socle, le
  gabarit est bien dans le fichier du socle, aucun fichier de forge-tests n'en tient une copie.
  - preuve : forge-tests `e0691b3`, local ; rejoué par le pilot : `uv run pytest -q` rend 1 seul
    échec, `tests/test_tf_0117.py::test_render_page_pass_aussi_sur_le_meme_dashboard`, antérieur à
    la campagne — l'agent en a mesuré la cause : un contraste de 1,21 pour 1 dans le tableau de bord
    que forge-tests produit lui-même, et non la copie installée comme il l'avait d'abord écrit.
- **L'outil de mesure des consommateurs nomme désormais un rouge aggravé, et ne compte plus pour un
  rouge une commande qui n'a rien jugé.** Classe : contrôle vrai sur le mauvais invariant. Règle
  neuve : quand un dépôt échoue avant et après, les échecs sont comparés un à un ; l'innocence ne
  s'affirme que si les 2 ensembles sont identiques, sinon l'état est indéterminé et le dit.
  - preuve : pilot `a548cf02`, local ; rejoué par le pilot :
    `node oracles/consommateurs-skills.test.mjs` rend « 22 PASS, 0 FAIL » (14 au départ), dont le
    cas exact de ce soir ; selon l'agent, le harnais du pilot ne porte plus que 1 défaut préexistant,
    celui du contrôle des skills ayant disparu avec la mise à jour.
- **Le site de scellement neuf de la forge d'audit est déclaré au pilot — et j'ai enregistré une fois
  sans avoir lu le verdict.** Classe : enregistrement posé sans lire le verdict du contrôle qui le
  garde. L'oracle des empreintes refusait le contrôle de dérive neuf, non
  déclaré. Ma première déclaration faisait passer cette règle et en faisait échouer une autre ; je
  l'ai enregistrée en annonçant le contraire, puis corrigée dans l'enregistrement suivant, qui le dit.
  - preuve : `node oracles/oracle-empreintes.mjs` rend FAIL sur E2, puis FAIL sur E1 après
    `00e1403b`, puis `"verdict": "PASS"` avant `70b26a71`, enregistré sous condition de ce verdict.
- **D-6 (b) — 2 familles de gabarits sur 5 ont leur squelette et leur instance de page, preuve
  rapportée par l'agent et non encore rejouée par le pilot.** Le courrier fournisseur a servi de
  patron : 6 corrections mesurées, dont un sommaire repliable sur mobile et un contraste insuffisant
  d'un jeton du socle ; la charte de partenariat n'a coûté qu'un défaut, des largeurs de section
  mêlées. L'agent a mesuré qu'un squelette de page exige une instance de page. Classe : gabarit de
  document sans forme de page.
  - preuve : pilot `8f7f98f8` et `2a2b6109`, locaux, constatés par `git log` ; selon l'agent, les
    4 fichiers rendent `check_html.py` exit 0, `render_page.py` 0 bloquant aux 6 largeurs, et le
    point d'entrée de la critique de forge-design accepte ses 7 oracles, bascule de thème comprise ;
    parc des gabarits à 77 constats tous réussis ; harnais du pilot à 1 défaut sur 130, préexistant.
## 5. Non traité — avec son motif

- Les squelettes de page des 3 familles restantes — kit partenaire, étude de cas client, mode
  d'emploi d'un livrable remis en dossier (TF-1029, D-6 (b)) : motif `dependance_externe` — l'agent
  y travaille ; fin annoncée vers 23h00.
- Le sort des captures d'écran que le hook d'écriture dépose dans le dépôt à côté de chaque gabarit,
  34 fichiers et 14,1 Mo pour une seule famille, 2 familles antérieures en portant déjà : motif
  `gate_gouvernance` — l'agent a suivi la convention existante ; la question vous sera posée en
  choix fermé à la restitution complète.
- 2 espacements hors échelle dans le bloc hérité des familles de gabarits antérieures, et des
  avertissements de contraste qui viennent des jetons du socle : motif `hors_mandat` — vus en
  passant par l'agent, corrigés dans ses seuls fichiers ; ils entreront en candidats.
- Le test de forge-tests en échec depuis avant la campagne, un contraste insuffisant dans son propre
  tableau de bord : motif `hors_mandat` — il n'appartient à aucun item décidé ; il entrera en
  candidat avec les autres constats de ce tour.
- Le lot de travaux du contrôle de transparence (TF-1105) : motif `dependance_externe` — j'ai désigné
  son produit destinataire au registre, l'émetteur le rend « orphelin : aucun produit du parc ne
  correspond ».
- Le rangement des 14 porteurs de secrets (TF-1090) : motif `garde_fou` — l'item vise plusieurs
  produits et n'en désigne aucun ; l'émetteur n'admet qu'un destinataire explicite, jamais déduit ;
  la rotation des identifiants publiés reste votre geste.
- Le dépôt des 6 lots chez les produits : motif `garde_fou` — aucun mandat déclaré sur un produit
  dans cette session.
- 9 enregistrements locaux non publiés — 6 au pilot, 2 chez forge-audit, 1 chez forge-tests : motif
  `gate_gouvernance` — votre feu vert D-2 portait sur les enregistrements de la campagne ; ceux-ci
  et ceux de l'agent des gabarits partiront sur un feu vert que je vous demanderai à la
  restitution complète.

## 6. Écarts à la lettre

- **D-5 (a) disait** que je prépare les lots et les range au pilot. **J'ai fait** le rendu à blanc et
  relevé leurs sceaux, sans écrire de copie au pilot. **Pourquoi** : l'émetteur régénère chaque lot
  depuis le registre au moment du dépôt et garde alors l'original au pilot ; une copie faite ce soir
  serait périmée au premier changement du registre.
- **D-3 (a) disait** que je vous rends le nom de tout dépôt qui passait et ne passe plus. **Aucun
  dépôt n'est dans ce cas** ; mais 1 dépôt déjà en échec a 1 échec de plus, ce que la lettre de la
  question ne couvrait pas. Je vous le rends quand même, et je fais corriger l'outil.

## 7. Risques

- **Les corrections en cours touchent 2 dépôts que je viens de publier.**
  - signal : `git rev-list --left-right --count HEAD...origin/main` rend une avance chez
    forge-tests, forge-audit ou au pilot.
  - parade : ces enregistrements restent locaux ; leur publication vous sera demandée une fois.
- **La forge des tests est publiée avec 1 test qui échoue dès que la copie installée est à jour.**
  - signal : la suite de forge-tests rend 2 échecs sur l'autre poste après sa propre mise à jour.
  - parade : correction en cours chez l'agent auteur, sans affaiblir le test.

## 8. Prochaines actions

Les 2 actions sont à la charge de l'IA, dans cet ordre : recevoir et rejouer d'abord, restituer
ensuite. Aucune n'attend un geste de votre part.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-8** | Recevoir le rapport de l'agent des gabarits, rejouer le contrôle des pages et l'oracle des gabarits, consigner au registre, verser les constats de ce tour en candidats | `auto_ia` | TF-1029 | `dependance_externe` — l'agent n'a pas rendu la main ; je reprends à sa notification | les squelettes de page restent sans preuve rejouée |
| **A-9** | Rendre la restitution complète de l'exécution de vos 5 décisions, avec la demande de publication des enregistrements neufs | `auto_ia` | neuve | `dependance_externe` — suit A-8 | votre décision D-6 (b) reste sans compte rendu |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publiés le 20/09/2026 à 21h10 : pilot `c70de52e`, forge-agents `9b042dc`, forge-data `b58213f`,
  forge-audit `f209679`, forge-tests `29fd97b`.
- Enregistrements locaux non publiés : pilot `6f861f7f`, `a548cf02`, `00e1403b`, `70b26a71`,
  `8f7f98f8`, `2a2b6109` ;
  forge-audit `8f594f0`, `52a7656` ; forge-tests `e0691b3`.
- Copie installée des skills : `~\.claude\skills\`, réalignée par `oracle-skills.mjs --appliquer`.
- Aucune page HTML livrée dans ce tour.
