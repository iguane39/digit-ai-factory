---
destinataire: humain
---

# Synthèse de mandat — les trois runs de forge sont joués et enregistrés, le plancher d'écriture et la grille 4K sont propagés sur le poste, quatre candidatures sont nées des retours ; il vous reste trois décisions sur ces candidatures et le feu vert de quatre publications (12/09/2026)

Vos deux décisions sont exécutées. Les trois forges ont traité leurs lots sur votre mandat, chacune sous ses propres oracles, avec un enregistrement local et un lot de retours remis au pilot. Le registre des oracles connaît désormais le style rédactionnel et le socle Markdown lui délègue le jugement. Le rendu du socle et de forge-design monte au 4K, avec un contrôle neuf qui refuse la prose étirée et le tableau étriqué au-delà de 2560 pixels. Les textes d'application, le type T4 (libellés, erreurs, états vides) de la doctrine, ont leur juge chez forge-design, adossé à la règle E-12 (le vocabulaire du lecteur, jamais celui du système). Le playbook de development cite le plancher et la règle Full HD. Tout cela est propagé sur ce poste, ce que le bootstrap refait à chaque ouverture. Une correction a été nécessaire après propagation : le résolveur du pilot ne trouvait pas le dépôt depuis un skill installé ; elle est enregistrée chez forge-agents. Les seuils du 12/09 restent quatre semaines, comme décidé. Rien n'est publié : quatre dépôts attendent votre feu vert. Les retours des forges ont fait naître quatre candidatures, dont une récidive et un conflit de doctrine, et c'est vous qui les tranchez.

## 1. En-tête d'identification

- **quoi** — exécution de D-1 (b) et D-2 (a) de la synthèse 20260912a : trois runs de forge sur mandat (lots 20260912a, b, c), ingestion des trois lots de retours, propagation des skills vers les copies installées, correction du résolveur du pilot, journalisation des décisions, action A-4 (candidature pour les octets nuls de la page générée du registre).
- **sur quoi** — le pilot `digit-ai-factory` ; `digit-ai-forge-agents` (source des skills `quality-oracles` et `digit-ai-page-html`), `digit-ai-forge-design`, `digit-ai-forge-development`, chacun enregistré localement sous mandat ; les copies installées `~/.claude/skills/` (propagées par `oracle-skills --appliquer`) ; aucun push nulle part.
- **quand** — 2026-09-12 17:55 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 16:50 (journalisation de D-1 (b)) ; durée mesurée ≥ 65 min.
- **qui** — pilot local `be669f2`, bâti sur `7e8573c` (ma synthèse précédente) ; `git status -sb` : le pilot est **21 enregistrements en avance** ; session Fable 5.1 ; trois délégations en parallèle (agents généraux : forge-agents et forge-design sur Opus, forge-development sur Sonnet ; escalade : la correction du résolveur reprise par le pilot après la première propagation) ; oracles joués : `oracle-lot-retours` (3 lots), `ingerer-lot`, `oracle-todo` (5 passes), `oracle-skills --appliquer` (2 passes), `check_markdown.py --style` (copie installée), `self-test.mjs` de `quality-oracles` (copie installée, 2 passes), et chez les forges : `self_test.py` du socle (264 cas), `self-test.mjs` de `quality-oracles` (source), `self-test.mjs` et `self-test-baseline.mjs` de forge-design, `oracle-textes-application --self-test`, `oracle-ecriture` sur le playbook.

## 2. Verdict en une ligne

**forge-agents `a2cc83d` + `38310c7` (registre 2.20.0 à 57 oracles, fixtures écriture au manifest, `check_markdown --style`, `render_page` à six largeurs jusqu'à 3840 avec V18, socle 264/264, banc 253 verts et 1 échec antérieur) ; forge-design `89bcc33` (grille à sept largeurs, largeur de conception 1920, `oracle-textes-application` 24/24, banc 40 oracles verts) ; forge-development `fd73af5` (deux disciplines, playbook PASS au plancher) ; 3 lots de retours PASS ingérés (TF-1068 récidive, TF-1069, TF-1070) ; propagation faite (installé : `quality-oracles` 2.14.0, `digit-ai-page-html` 1.21.0), délégation vérifiée depuis la copie installée : « Règles : M7, M10, M14, M18, EC-1..EC-6 — Style : PASS » (M7 (l'ouverture de chaque chapitre par ce qu'il apprend), M10 (le mode d'emploi de chaque tableau), M14 (aucune plomberie interne dans le texte), M18 (un identifiant porte son sens en ligne), puis EC-1 (la densité de tournures creuses par famille) à EC-6 (l'antériorité déclarée d'un texte normatif), les six règles de l'oracle d'écriture) ; A-4 : TF-1067 en candidat ; D-2 (a) journalisée ; `oracle-todo` PASS, 288 actifs ; pilot `be669f2` (13 fichiers), 0 push sur 4 dépôts.**

## 3. Décisions attendues de l'humain

Trois décisions.

> **D-1 — Le conflit entre la colonne de lecture prescrite (E4, 1 080 px) et le plafond de 100 caractères par ligne du contrôle 4K se tranche-t-il en gardant la colonne et en ne bloquant que la prose que rien ne tient ?**
>
> Il s'agit du conflit que le run de forge-agents a mesuré entre la colonne de lecture que le socle prescrit pour la prose et le plafond de caractères par ligne que le lot du jour demandait au contrôle de rendu 4K (la candidature est au bloc 4). Mesuré : la colonne `.chap.lire` que le socle prescrit depuis l'arbitrage humain du 21/08 rend 134 caractères par ligne en 16 px, à 1920 comme à 3840 ; le lot demandait un plafond de 100. Appliqué à la lettre, le contrôle V18 condamnerait toute page conforme au socle dès 2560 px. La parade posée par la forge : un paragraphe tenu par un conteneur de lecture déclaré n'est pas bloqué (sa mesure est publiée) ; seule la prose que rien ne tient l'est (228 caractères par ligne à 2560, 342 à 3840). Le point ouvert est la doctrine : garder la colonne à 1 080 px, ou la resserrer, ou porter le plafond à 135.
>
> **Recommandation : (a).** Source consultée : `references\BEST-PRACTICES-HTML.md` E4 (« arbitrage du 21/08 : 647 px de texte pour 1 130 px de conteneur, refusé par le lecteur humain ») et E5 (« la mesure de lecture reste portée par le conteneur ») ; `REGLES-PROJET.md`, règle de précédence des factories (renforcer oui, assouplir jamais) ; lot de retours forge-agents du 12/09, troisième écart déclaré.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) garder E4 tel quel ; V18 ne bloque que la prose non tenue ; le plafond 100 reste la doctrine des pages sans colonne | effort nul (c'est l'état livré) ; la candidature se clôt sur ce constat | exclut de mesurer la lisibilité réelle d'une ligne de 134 caractères : E4 reste un arbitrage de remplissage, pas de lecture |
| (b) porter le plafond à 135 pour tout paragraphe, tenu ou non | effort simple × court (une constante dans `render_page.py`, fixtures rejouées) | exclut le contrôle sur la prose non tenue entre 100 et 135 caractères |
| (c) resserrer `.chap.lire` à une mesure de lecture (≈ 80 caractères, soit ≈ 640 px à 16 px) | effort simple × moyen chez forge-agents (socle) et forge-design (maquettes), puis chez chaque produit | exclut l'arbitrage humain du 21/08 : les pages de prose retrouvent une marge droite vide à 1920, ce que le lecteur a refusé |

> **Si rien n'est décidé** : l'option (a) s'applique — l'état livré reste, la candidature reste en candidat.

> **D-2 — La récidive du gabarit de lot de travaux (l'encadré obligatoire prescrit un chemin qui n'existe que chez un produit) se corrige-t-elle maintenant dans le gabarit du pilot ?**
>
> Il s'agit du défaut que forge-design a remonté dans son lot de retours : le gabarit de lot de travaux du pilot prescrit, dans son encadré obligatoire, une commande dont le chemin n'existe que chez les produits instanciés, jamais chez une forge (la candidature, classée récidive de `boucle-retour-sans-descente` après six clôtures antérieures, est au bloc 4). L'encadré ⛔ de `gabarits\TRAVAUX-PILOT.md` dit « node forge\travaux\oracle-travaux.mjs », chemin posé par l'héritage chez les produits seulement ; chez une forge il rend « module introuvable », et la forge a dû jouer `gabarits\oracle-travaux-pilot.mjs` du pilot à la place. Le remède est une phrase dans le gabarit (« chez une forge : node <pilot>\gabarits\oracle-travaux-pilot.mjs ») et une fixture dans son oracle ; c'est une écriture du pilot, dans un texte que les trois lots de ce jour ont déjà cité.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (règle de descente et règle de récidive après descente : « la descente n'a pas tenu chez digit-ai-forge-design ») ; `gabarits\TRAVAUX-PILOT.md` (encadré) ; lot de retours forge-design du 12/09, premier constat en passant.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) corriger le gabarit et son oracle maintenant, clore la candidature sur le rejeu des trois lots du jour | effort simple × court | exclut une septième clôture de la même classe sans descente : la fixture rend la récidive visible |
| (b) attendre la prochaine revue des classes | effort nul maintenant | exclut la clôture avant le prochain lot, qui répétera le défaut |
| (c) écarter : les forges savent jouer l'oracle du pilot | effort nul | exclut la loi n° 1 (une affordance non câblée n'existe pas) : l'encadré reste faux chez une forge |

> **Si rien n'est décidé** : l'option (b) s'applique — la candidature reste en candidat, marquée récidive.

> **D-3 — Les deux candidatures techniques nées ce tour (les octets nuls de la page générée du registre ; le domaine style qui entre au registre sans déclencheur automatique sur les `.md`) sont-elles acceptées ?**
>
> Il s'agit de deux constats techniques nés ce tour, dont les identifiants sont au bloc 4 : d'un côté un défaut du pilot, le générateur de la page du registre lit un chemin Windows cité dans un item comme un octet nul et le harnais de recettes reste à 105 sur 107 ; de l'autre un écart déclaré par forge-agents, l'entrée du registre porte `ext: []` faute de mesure de bruit sur les textes des produits, le calibrage du 12/09 ne portant que sur 204 textes du pilot (quatrième écart déclaré dans son lot). Les remèdes : échapper le texte au rendu et jouer l'oracle des caractères de contrôle après chaque régénération ; mesurer la baseline sur les `.md` d'au moins trois produits, puis poser `ext: [".md"]`.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine, clôture sur gains constatés ») ; `todo\CLASSES.json` (classes `sequence-octale-interpretee-au-rendu`, `regle-neuve-sans-mesure-de-bruit`) ; lot de retours forge-agents du 12/09, quatrième écart déclaré.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) accepter les deux : correction du générateur au pilot, mesure de bruit sur trois produits puis déclenchement automatique | effort simple × court (générateur) + simple × moyen (mesure sur produits, recalibrage éventuel) | exclut un déclenchement automatique avant la mesure : le style des produits reste jugé par le hook `ecriture` seulement, pas par `run-oracles` |
| (b) accepter la seule candidature des octets nuls | effort simple × court | exclut toute couverture automatique des `.md` des produits par le registre |
| (c) laisser les deux en candidat | effort nul | exclut le retour au vert du harnais du pilot (105/107) |

> **Si rien n'est décidé** : l'option (c) s'applique — les deux restent en candidat.

## 4. Traité — avec sa preuve

- **forge-agents a traité son lot, sous ses oracles, et enregistré.** Registre : entrée « Style rédactionnel d'un texte Markdown » (commande `node {pilot}/oracles/oracle-ecriture.mjs {file}`, résolveur `{pilot}` neuf dans `scripts/lib/pilot.mjs`), fixtures `ecriture-red.md` / `ecriture-green.md` au manifest ; socle : `DEFAULT_WIDTHS = [3840, 2560, 1920, 1280, 768, 390]`, contrôle V18 (prose étirée, tableau étriqué, largeurs ≥ 2560) avec quatre fixtures, `check_markdown.py --style`, sections dans `lisibilite.md` et `bonnes-pratiques.md`.
  - preuve : rapport de l'agent : `python self_test.py` → « 264/264 cas passés, exit 0 » (256 avant) ; `node self-test.mjs` (quality-oracles, source) → « 253 verts / 1 échec », l'échec `fixture sca/red` rejoué identique sur HEAD par `git stash` ; `render_page.py <page>` → six captures ; `C:\dev\digit-ai-forge-agents` : `a2cc83d` (20 fichiers, 826 insertions) puis `38310c7` (résolveur, 2 fichiers), `main...origin/main [ahead 4]`.
- **forge-design a traité son lot, sous ses oracles, et enregistré.** Largeur de conception 1920 et grille à sept largeurs dans `contrat-technique.md`, `criteres-sortie.md`, `grille.md`, `run-oracles-design.mjs`, `oracle-baseline.mjs` ; règle dure 1920 dans `ameliore-le-design`, D5 dans `critique-le-design` ; renvois E-12 dans `voix.md` ; `oracle-textes-application.mjs` (règles T4-1 à T4-4, fixtures rouge/verte), critère C14 joué avant C15, D7 le cite, entrée au registre local.
  - preuve : rapport de l'agent : `run-oracles-design.mjs` → « grille de rendu (7 largeurs) : 3840 / 2560 / 1920 / 1440 / 1024 / 768 / 390 px » ; `self-test.mjs` → « Tout vert — 40 oracles, 124 règles verrouillées » (39/120 avant) ; `self-test-baseline.mjs` → exit 0, Playwright présent ; `oracle-textes-application --self-test` → « 24 PASS / 0 FAIL », rouge FAIL (4 bloquants), verte PASS ; lancé sur `fixtures\maquette-cta-rouge.html` il relève un `<button>Valider</button>` réel ; `C:\dev\digit-ai-forge-design` : `89bcc33` (15 fichiers, 906 insertions), `[ahead 1]`.
- **forge-development a traité son lot et enregistré.** Neuvième discipline (E5 : conception à 1920, grille à sept largeurs) et dixième (plancher d'écriture, E-12 en trois formes, chaînes en fichier de ressources, format de commit, gate `ecriture`) dans `docs\run-playbook.md`.
  - preuve : rapport de l'agent : `node oracle-ecriture.mjs docs/run-playbook.md` → PASS (4 186 mots, deux avertissements antérieurs au texte ajouté) ; `C:\dev\digit-ai-forge-development` : `fd73af5` (3 fichiers, 145 insertions), `[ahead 1]`.
- **Les trois lots de retours sont jugés, accueillis et ingérés.**
  - preuve : `oracle-lot-retours.mjs` → PASS sur les trois (R-45, R-46, R-49) ; `ingerer-lot.mjs` → development : sidecar vide, « 0 création (idempotence) » ; design : « 1 candidature ingérée (lot 124ba32644f0) », « [RÉCIDIVE] classe boucle-retour-sans-descente déjà close par TF-0757, TF-0850, TF-0851, TF-0852, TF-0903, TF-0908 » → TF-1068 ; agents : « 2 candidatures ingérées (lot 3daaaa149779) » → TF-1069 (`deux-regles-du-socle-inconciliables`), TF-1070 (`regle-neuve-sans-mesure-de-bruit`) ; `oracle-todo` → PASS ; vues « 288 actifs, 21 forges cibles (sceau 06a122db961f) », « 74 classes, 127 récidives ».
- **Les skills sont propagés sur le poste et vérifiés depuis les copies installées.**
  - preuve : `node oracles\oracle-skills.mjs --appliquer` → verdict PASS (deux passes) ; `~/.claude/skills/quality-oracles/SKILL.md` → 2.14.0 ; `registre-oracles.json` installé → 2.20.0, 57 oracles ; `~/.claude/skills/digit-ai-page-html/SKILL.md` → 1.21.0 ; `render_page.py` installé, ligne 88 → `DEFAULT_WIDTHS = [3840, 2560, 1920, 1280, 768, 390]` ; `python ~/.claude/skills/digit-ai-page-html/scripts/check_markdown.py --style references/ECRITURE.md` → « Règles : M7, M10, M14, M18, EC-1, EC-2, EC-3, EC-4, EC-5, EC-6 — Style : PASS — 1692 mots de prose jugés — Verdict : PASS », exit 0 ; `node ~/.claude/skills/quality-oracles/scripts/self-test.mjs` → « ✅ oracle délégué présent : oracle-ecriture.mjs », « ✅ fixture ecriture/red : FAIL conforme », « ✅ fixture ecriture/green : PASS conforme », deux échecs antérieurs et étrangers (`fixture sca/red` ; « derive-les-vues : description 1048 > 1024 caractères », skill d'une autre forge).
- **Le résolveur du pilot est corrigé après la première propagation.** Depuis un skill installé, la piste « dépôt frère » tombait sur `C:\Users\digit-ai-factory` ; les pistes du lanceur de hooks (`c:\dev`, `~/.digit-ai-forge`) sont ajoutées dans `pilot.mjs` et `check_markdown.py`. Contrôle rouge → vert : `check_markdown.py --style` depuis la copie installée, « INJOIGNABLE » avant, « Style : PASS » après ; classe `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` (le contrôle mesurait un emplacement relatif à la source alors que la session charge la copie installée).
  - preuve : avant : `check_markdown.py --style` (installé) → « [style] oracle de style INJOIGNABLE — pistes essayées : C:\Users\digit-ai-factory\oracles\oracle-ecriture.mjs » ; `resolvePilot('C:/Users/iguan/.claude/skills/quality-oracles')` → `c:\dev\digit-ai-factory` après correction ; `38310c7` chez forge-agents ; après repropagation, le verdict cité au point précédent.
- **Les décisions sont journalisées et A-4 est faite.** TF-1064 et TF-1066 passés en `en_cours` (D-1 (b), D-2 (a) dans le texte de décision) ; TF-1067 créé (octets nuls), classe `sequence-octale-interpretee-au-rendu` fondée par lui.
  - preuve : `journaliser.mjs` → « 2 événement(s) journalisé(s) » ; mesure python : `todo\TODO.html` → 3 octets 0x00, `todo\TODO.jsonl` → 0 ; `ingerer-lot.mjs` → « 1 candidature ingérée (lot 84056136706c) » → TF-1067 ; `CLASSES.json` 1.13.0, 74 classes.
- **Tout est enregistré localement au pilot, sur les seuls chemins du tour.**
  - preuve : `git commit --only` → `be669f2` (13 fichiers : trois lots de retours et sidecars, candidature, registre, vues, index) ; `git status -sb` → `[ahead 21]` ; `input\00-retours\README.md` régénéré par le hook, laissé tel quel.

## 5. Non traité — avec son motif

- Les quatre publications (pilot `be669f2` et cette synthèse ; forge-agents `38310c7` ; forge-design `89bcc33` ; forge-development `fd73af5`) — motif : bloqué par un garde-fou, R-38 §4-5 ; chaque enregistrement porte des livrables explicites ; feu vert par dépôt.
- La correction du générateur de la page du registre (octets nuls) et la mesure de bruit sur les `.md` des produits — motif : dépendance à une décision humaine (D-3).
- La correction du gabarit de lot de travaux (encadré) — motif : dépendance à une décision humaine (D-2).
- L'arbitrage E4 / V18 — motif : dépendance à une décision humaine (D-1) ; l'état livré tient la doctrine du 21/08.
- Les deux échecs antérieurs du banc installé de `quality-oracles` (`fixture sca/red` : l'oracle rend PASS au lieu de SKIP quand l'outil externe ne répond pas ; « derive-les-vues » : description de skill de 1 048 caractères) — motif : hors mandat ; le premier est signalé sans classe par forge-agents (RA-5), le second appartient à forge-conception.
- `versions-livrees.json` de forge-agents non incrémenté — motif : hors mandat, déclaré par la forge ; `oracle-etat-forge` (O3) le relèvera à sa prochaine publication.
- La clôture de TF-1064 et TF-1066 — motif : dépendance à D-2 (a) de la synthèse 20260912a (gains constatés au 10/10, baseline rejouée sur les textes neufs).

## 6. Écarts à la lettre

- **Vous avez écrit** « 1b » (lancer les runs de forge sur les lots) → **j'ai fait** les trois runs, puis la propagation des skills vers les copies installées du poste (`oracle-skills --appliquer`), puis une correction supplémentaire chez forge-agents. **Pourquoi** : sans propagation, aucun résultat de forge-agents n'existe pour la session (les oracles jouent sur la copie installée) ; c'est le geste que le bootstrap joue à chaque ouverture ; et la propagation a révélé le résolveur défaillant, corrigé sous le même mandat.
- **Le lot demandait** des règles nommées TA1 à TA4 (les quatre règles de l'oracle des textes d'application, telles que le lot les désignait) → **forge-design a nommé** T4-1 à T4-4. **Pourquoi** : ces identifiants sont déjà pris par `oracle-taste` et cités sous ce sens par la grille de critique ; écart écrit dans l'oracle, le registre local et le lot de retours (RD-19).
- **Le lot demandait** « le numéro suivant de la série V » → **forge-agents a nommé** V18. **Pourquoi** : V17 est déjà pris par `conteneur_bride_donnees` dans la checklist canonique.
- **Le lot demandait** la grille complète dans `oracle-baseline.mjs` → **forge-design a retenu** cinq largeurs (3840, 2560, 1920, 1024, 390). **Pourquoi** : coût de stockage des captures approuvées ; 1440 et 768 restent jugés par `render_page.py` ; écart déclaré au `non_juge` de l'oracle.
- **Le lot demandait** l'entrée au registre avec déclenchement sur les `.md` → **forge-agents a posé** `ext: []`. **Pourquoi** : aucune mesure de bruit sur les textes des produits ; écart déclaré par la forge et soumis en D-3.

## 7. Risques

- Quatre dépôts en avance non publiés se croisent avec l'autre poste ;
  - signal : un `git pull --ff-only` refusé à l'ouverture d'un de ces dépôts ailleurs ;
  - parade : feu vert par dépôt (A-1), dans l'ordre forge-agents puis pilot puis les deux autres ; acceptation déclarée d'ici là.
- Le contrôle V18 bloque une page conforme au socle si son conteneur de lecture n'est pas déclaré ;
  - signal : un FAIL `v18_prose_etiree` sur une page qui porte pourtant `.chap.lire` ;
  - parade : D-1 ; la parade de forge-agents exempte les conteneurs déclarés (`.lire`, `[data-mesure-lecture]`).
- Le style des `.md` des produits n'est jugé que par le hook, pas par `run-oracles` ;
  - signal : un produit dont `run-oracles.mjs` ne liste aucun contrôle de style sur ses documents ;
  - parade : D-3 (a), mesure de bruit puis `ext: [".md"]`.
- Le harnais du pilot reste à 105/107 et le banc installé à deux échecs, tous antérieurs ;
  - signal : `self-tests.mjs` et `self-test.mjs` (installé) en défaut sur les mêmes entrées à la prochaine ouverture ;
  - parade : D-3 (a) pour les octets nuls ; les deux autres passent la main au bloc 8 (A-6).

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), classées par dépendance — ce qui attend D-2 avant D-3, le push en dernier parce qu'il attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Corriger `gabarits\TRAVAUX-PILOT.md` (encadré : chez une forge, `node <pilot>\gabarits\oracle-travaux-pilot.mjs`) et `oracle-travaux-pilot.mjs` (fixture : un lot reçu par une forge cite la commande du pilot), rejouer les trois lots du jour, journaliser la clôture de TF-1068 (neuve) | auto_ia | `dependance_bloc_3` — attend D-2 (a) ; à défaut, l'encadré reste faux chez une forge | simple × court |
| A-2 | Corriger `todo\generer-page.mjs` (texte échappé pour HTML, inséré tel quel ; `oracle-caracteres-controle` joué après régénération), fixture rouge/verte, rejouer `self-tests.mjs` et journaliser TF-1067 (neuve) | auto_ia | `dependance_bloc_3` — attend D-3 (a) ou (b) ; à défaut, le harnais reste à 105/107 | simple × court |
| A-3 | Mesurer la baseline de `oracle-ecriture` sur les `.md` de trois produits du parc (lecture seule), publier la mesure dans `tics-redactionnels.json`, puis lot de travaux à forge-agents pour `ext: [".md"]` (TF-1070) (neuve) | auto_ia | `dependance_bloc_3` — attend D-3 (a) ; à défaut, le registre ne déclenche pas sur les documents | simple × moyen |
| A-4 | Journaliser D-1 (TF-1069 : clôture sur l'état livré si (a), sinon lot à forge-agents), régénérer les vues, rejouer `oracle-todo` (TF-1069) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, TF-1069 reste en candidat | simple × court |
| A-5 | Rejouer la baseline de l'oracle d'écriture sur les textes du 12/09 au 10/10 et resserrer les seuils (décision D-2 (a) de la synthèse 20260912a ; TF-1064, TF-1066) | auto_ia | `dependance_bloc_3` — attend l'échéance du 10/10 ; à défaut, les seuils du 12/09 restent | simple × court |
| A-6 | Journaliser deux candidatures pour les échecs antérieurs du banc installé (`oracle-sca` rend PASS sans outil ; description de `derive-les-vues` trop longue), cibles forge-agents et forge-conception (neuve) | auto_ia | `hors_mandat` — constats en passant des forges, sans classe adéquate pour le premier ; à défaut, le banc reste à deux échecs sans item qui les porte | simple × court |
| A-7 | Pousser les quatre dépôts (forge-agents `38310c7`, pilot `be669f2` et cette synthèse, forge-design `89bcc33`, forge-development `fd73af5`), `FORGE_PUSH_GO` posé avec le motif, porte des noms rejouée par chaque hook pre-push (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend le GO de A-11 : chaque enregistrement porte des livrables explicites, R-38 §4 ; à défaut, tout reste local | simple × court |
| A-8 | Trancher D-1 — répondre « D-1 (a) », « (b) » ou « (c) » ; exécution par l'IA (neuve) | manuelle_utilisateur | `decision` — c'est un arbitrage de doctrine entre deux règles du socle, réservé à l'humain ; sinon : l'état livré reste et TF-1069 reste en candidat | simple × court |
| A-9 | Trancher D-2 — répondre « D-2 (a) », « (b) » ou « (c) » ; correction du gabarit par l'IA (neuve) | manuelle_utilisateur | `decision` — la décision sur un candidat est humaine ; sinon : TF-1068 reste en candidat, marqué récidive | simple × court |
| A-10 | Trancher D-3 — répondre « D-3 (a) », « (b) » ou « (c) » ; corrections et mesure par l'IA (neuve) | manuelle_utilisateur | `decision` — la décision sur un candidat est humaine ; sinon : les deux restent en candidat | simple × court |
| A-11 | Donner le feu vert de publication — répondre « pousse les quatre » ou nommer les dépôts à pousser (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'un enregistrement portant des livrables explicites est un GO humain ; sinon : quatre dépôts restent en avance, en local | simple × court |

## 9. Traces

- Forges : `C:\dev\digit-ai-forge-agents` (`a2cc83d`, `38310c7`) ; `C:\dev\digit-ai-forge-design` (`89bcc33`) ; `C:\dev\digit-ai-forge-development` (`fd73af5`) ; lots reçus passés à `traite le 2026-09-12`.
- Lots de retours accueillis : `input\00-retours\digit-ai-forge-agents - RETOURS - 20260912a.md`, `…forge-design…`, `…forge-development…` et leurs sidecars (lots 3daaaa149779, 124ba32644f0, sidecar vide).
- Registre : `todo\TODO.jsonl` (TF-1064 et TF-1066 `en_cours` ; TF-1067, TF-1068, TF-1069, TF-1070 créés) ; `todo\CLASSES.json` 1.13.0 ; vues régénérées.
- Candidature A-4 : `input\01-candidatures\page-registre-octets-nuls-20260912a.tf.jsonl` (lot 84056136706c).
- Copies installées : `~/.claude/skills/quality-oracles` 2.14.0 (registre 2.20.0), `~/.claude/skills/digit-ai-page-html` 1.21.0.
- Enregistrement pilot : `be669f2` (13 fichiers) ; cette synthèse et l'index du dossier sont enregistrés à sa suite.
- Oracles : `oracle-lot-retours` (3 PASS), `ingerer-lot` (3), `oracle-todo` (PASS, 5 passes), `oracle-skills --appliquer` (PASS, 2 passes), `check_markdown.py --style` (PASS, copie installée), banc installé `quality-oracles` (cas écriture verts, 2 échecs antérieurs), `oracle-synthese` sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme).
- Aucune page HTML livrée dans ce tour.
