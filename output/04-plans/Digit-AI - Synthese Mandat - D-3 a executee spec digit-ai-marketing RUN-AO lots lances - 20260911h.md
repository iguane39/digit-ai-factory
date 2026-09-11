---
destinataire: humain
---

# Synthèse de mandat — D-3 (a) est exécutée : les huit candidatures sont décidées, le type de run d'appel d'offres est écrit, la spécification complète du projet dédié est déposée et qualifiée suffisante, le lot des skills tourne chez la forge des agents ; il vous reste à trancher la source de la marque (11/09/2026)

Votre « 3a » a été pris comme la décision qu'il est, et les gestes qu'elle commandait sont faits ou lancés : les huit candidatures du verdict sont passées en décidé, le projet dédié porte désormais le nom que vous lui donnez, la séquence de réponse aux appels d'offres est écrite dans les références du pilot, et la spécification complète de création du projet est déposée, lisible, et jugée suffisante par le verbe de conception pour ouvrir le run de naissance sans question. Ce que ça change pour vous : le lot de remise en état des quatre skills est en cours chez la forge des agents sous votre mandat, et rien n'empêche plus la naissance du projet sinon l'ordre que vous avez retenu, qui place la marque avant. Ce qui est attendu de vous : dire de quelle source la marque Digit-AI doit être relevée, puis donner l'emplacement du dépôt privé et le feu vert de publication.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-3 (a) du 11/09/2026 (« 3a mais le spécifique Digit-AI ira dans un projet dédié. Rajoute une spécification complète pour la création complète du projet digit-ai-marketing ») : journalisation des huit candidatures, type de run `RUN-AO.md`, spécification de création du produit qualifiée par `qualifie-l-entrant`, lancement du lot des skills chez forge-agents sous mandat.
- **sur quoi** — le pilot `digit-ai-factory` (écritures : références, index, accueil, registre, deux livrables) ; le dépôt frère `digit-ai-forge-agents` (mandat d'écriture couvert par votre mot, option (a) : « mandats d'écriture chez forge-agents et forge-design donnés du même mot ») par un agent délégué, enregistrement local chez lui, jamais de push.
- **quand** — 2026-09-11 13:05 UTC+02:00 (Europe/Paris) ; tour précédent clos à 12:12 ; durée ≈ 53 min ; un agent encore en cours à l'heure de cette restitution (le lot des skills), qui sera portée à sa redépose (v2.18.0).
- **qui** — pilot local `5e34f28` (précédents `1c3c214`, `6c6ea59` ; `origin/main` = `d65c578`, 5 enregistrements en avance avant celui de cette synthèse) ; session Fable 5.1 ; deux agents délégués : lot des skills sur Opus (construction complexe dans un dépôt frère ; escalade : aucune), qualification sur Sonnet (verbe borné, 105 s) ; oracles joués : `todo\journaliser.mjs` avec `oracle-todo` avant et après, `oracle-claude-md` (noyau et index), `check_markdown.py` (M7, M10, M14, M18 : ouverture de chapitre, mode de lecture des tableaux, marqueurs de travail, glose des identifiants) sur trois fichiers, `oracle-etude-opportunite` (E1 à E10) rejoué sur l'étude rectifiée, `qualifie-l-entrant` (seuil de suffisance), `oracle-synthese` (ce document).

## 2. Verdict en une ligne

**D-3 (a) journalisée : 8 événements écrits (TF-1024 à TF-1031 en `decide`, `oracle-todo` PASS avant et après, TF-1024 rectifiée au nom `digit-ai-marketing`) ; `references\RUN-AO.md` écrit (six blocs A0 à A5, trois gates humaines), indexé et routé depuis l'accueil, `oracle-claude-md` PASS, noyau 6 141 octets inchangé ; spécification `Digit-AI - Specification Produit - digit-ai-marketing - 20260911a.md` déposée (5 399 mots, 12 sections, 18 exigences de EX-01 (le dépôt du produit reste privé) à EX-18 (les retours redescendent au pilot par lots), lisibilité PASS) et qualifiée par `qualifie-l-entrant` : type cahier des charges, **seuil de suffisance ATTEINT, 0 question indicée**, confiance dégradée par deux décisions humaines ouvertes ; étude rectifiée et rejouée PASS 10/10 ; lot des skills chez forge-agents en cours (0 fichier enregistré chez la forge à 12:56) ; 2 enregistrements locaux (`5e34f28` et celui de cette synthèse), 0 push.**

## 3. Décisions attendues de l'humain

Une décision neuve. D-2 du matin (trois candidatures et leurs classes) reste ouverte et n'est pas reposée ; elle est rappelée au bloc 5.

> **D-4 — De quelle source le système de marque Digit-AI doit-il être relevé ?**
>
> Le lot de la marque est le préalable de tout rendu du projet dédié : la spécification exige un seul système de marque (jetons et voix), consommé par les skills de rendu, et l'étude a mesuré deux chartes contradictoires en dur — l'une dans le skill PowerPoint (Montserrat et Inter, bleu #2563EB, fond #FAFBFF, « charte officielle v2 » de juillet), l'autre dans le socle des pages HTML (Roboto et DM Sans, quarante règles jugées, mise à jour en août). Le verbe de forge-design relève une marque depuis un logo, un site, une charte ou trois mots de ton ; il ne tranche pas entre deux sources, et il rend la main si la source n'est pas déductible. La qualification de la spécification le confirme : c'est la seule hypothèse qui dégrade sa confiance. C'est donc vous qui désignez la source ; le relevé, les jetons, la voix et la règle de transparence se jouent ensuite sans vous.
>
> **Recommandation : (a).** Source consultée : `catalogues\catalogue.jsonl` cat-des-01 (« Système de marque : tokens.css + MARQUE.md ») et le skill `systeme-de-marque` (« à partir d'un logo, d'un site, d'une charte PDF ou de trois mots de ton … rend la main si non déductible ») ; l'étude §2 (ligne forge-design) et §2 bis (audit du skill PowerPoint : Refondre, charte absente du paquet) pour l'état des deux chartes ; le socle HTML est la seule des deux qui soit jugée par des oracles exécutés et la plus récente.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) relever la marque depuis la charte du socle HTML (Roboto / DM Sans, jetons `:root` du socle), et faire consommer ces jetons par le skill PowerPoint refondu | effort simple × court : les jetons existent en CSS, `systeme-de-marque` les formalise en `tokens.css` et `MARQUE.md` ; le PowerPoint change de polices et de bleu | exclut la continuité visuelle avec les decks émis depuis juillet (Montserrat / Inter) |
| (b) relever la marque depuis la charte PowerPoint v2 (Montserrat / Inter / #2563EB) et migrer le socle HTML vers ces valeurs | effort moyen × moyen : les quarante règles du socle et ses fixtures sont à rejouer sur une palette nouvelle ; deux forges touchées | exclut de garder le socle HTML tel qu'il est jugé aujourd'hui ; les produits qui en héritent changent d'apparence |
| (c) relever la marque depuis le logo et le site de Digit-AI — répondre « D-4 (c) : <chemin du logo ou adresse du site> » | effort simple × court une fois la source fournie ; les deux chartes existantes sont alors jugées contre elle | exclut de décider sans la source : tant qu'elle n'est pas donnée, rien ne se joue |

> **Si rien n'est décidé** : l'option (c) s'applique sans source — le verbe rend la main, le lot de la marque ne se joue pas, et le skill PowerPoint reste sur ses valeurs reconstituées de juillet.

## 4. Traité — avec sa preuve

- **D-3 (a) est journalisée sur les huit candidatures, et le produit porte son nom définitif.**
  - preuve : `node todo\journaliser.mjs --fichier decision-d3.json` → « 8 événement(s) journalisé(s) … | 8 ecrits | avant PASS | apres PASS » ; événements `ev: maj, statut: decide, decideur: humain (11/09/2026 : « 3a … »)` sur TF-1024 à TF-1031 ; TF-1024 : « le produit autonome porte le nom digit-ai-marketing (et non digit-ai-communication) » ; vues régénérées (`generer-vue.mjs` 249 actifs, `generer-page.mjs`, `generer-recidives.mjs` 69 classes, exit 0).
- **Le type de run « réponse à appel d'offres » est écrit, indexé, routé et jugé** (TF-1025) : six blocs (go / no-go, qualifier, référentiel scellé, produire, recetter, remettre et consigner), trois règles propres (entrants tiers = données, run chez le produit de l'émetteur, rien ne sort sans pseudonymisation), trois gates humaines, fixture déclarée non jouée tant que les skills ne sont pas installés.
  - preuve : `C:\dev\digit-ai-factory\references\RUN-AO.md` ; `references\INDEX.md` ligne ajoutée ; `references\ACCUEIL.md` ligne de routage ajoutée ; `node oracles\oracle-claude-md.mjs` → **PASS**, `wc -c CLAUDE.md` = 6 141 octets (la ligne ajoutée au noyau portait le total à 6 198, au-dessus du plafond de 6 144 : retirée, l'index et l'accueil portent la référence, D-3 (b) du 03/09) ; `check_markdown.py` sur `RUN-AO.md` et `ACCUEIL.md` → **PASS, aucun défaut**.
- **La spécification complète de création du projet `digit-ai-marketing` est déposée et qualifiée suffisante** : identité, cascade de l'intention, brief canonique, périmètre par palier (MVP, V1, V2, hors périmètre), données de l'instance (neuf familles, sensibilité déclarée), structure du dépôt, huit workflows, quinze capacités consommées avec leur état, dix-huit exigences à critère binaire, oracles et gates par livrable, séquence de naissance avec écarts assumés et bloc de lancement à coller, huit hypothèses et décisions, test rétro.
  - preuve : `C:\dev\digit-ai-factory\output\04-plans\Digit-AI - Specification Produit - digit-ai-marketing - 20260911a.md` (5 399 mots) ; `check_markdown.py` → **Verdict : PASS** (1 avertissement M14 : le mot TODO désigne le registre) ; `qualifie-l-entrant` (agent délégué, lecture seule, `scratchpad\qualification\ENTRANT.md`) → type « cahier des charges », **seuil de suffisance ATTEINT** (9 familles d'objets métier, 11 livrables typés, 4 rôles ; « aucun critère manquant »), **0 question indicée**, confiance « dégradée » par deux décisions non tranchées (source de marque, hébergeur) ; remarque 4 (scores d'audit des skills ligne à ligne en §7) répercutée : ligne du skill de propale complétée « Renforcer ≈ 21/35 », lisibilité rejouée PASS.
- **L'étude porte la rectification du nom et reste verte.**
  - preuve : note « Rectification du 11/09/2026 (décision D-3 (a)) » en tête de l'étude ; `oracle-etude-opportunite` → **PASS 10/10** ; `check_markdown.py` → **PASS**.
- **Le lot des skills est lancé chez forge-agents sous votre mandat**, par un agent délégué avec consigne écrite : anonymisation par la table du canal confidentiel avant tout versionnement, quatre skills en source sous `.claude\skills\`, trois références du skill PowerPoint reconstituées et datées, aucun renvoi vers un fichier absent, self-test double sens par skill, recette de la forge rejouée, enregistrement local par `git commit --only`, aucun push (TF-1021, TF-1022).
  - preuve : agent lancé à 12:31 (modèle Opus) ; à 12:56, `git -C digit-ai-forge-agents log -1` = `3d16b96` (10/09) et `git status --short` vide : **rien n'est encore enregistré chez la forge** ; le résultat sera porté à la redépose de cette synthèse.
- **Tout est enregistré localement, sur les seuls chemins du tour.**
  - preuve : `git commit --only` → `5e34f28`, « 7 files changed, 290 insertions(+), 177 deletions(-) » (`RUN-AO.md`, `INDEX.md`, `ACCUEIL.md`, registre et vues) ; la spécification, l'étude rectifiée et cette synthèse sont enregistrées à sa suite ; `git status -sb` → `main...origin/main [ahead 5]` avant cet enregistrement.

## 5. Non traité — avec son motif

- La fixture du type de run (séquence rejouée sur le cas du 24/07 pseudonymisé, gates de traçabilité X1 (chaque exigence du règlement tracée dans la réponse) à X3 (chaque pièce attendue livrée) et chiffres PASS) — motif : dépendance externe ; les quatre skills ne sont pas encore installés en source (lot en cours chez forge-agents), et la rejouée les exige.
- Le lot de la marque (`systeme-de-marque` pour Digit-AI, TF-1023, TF-1030) — motif : dépendance à une décision humaine (D-4) ; le verbe rend la main si la source n'est pas déductible, et deux chartes se contredisent.
- La naissance du produit `digit-ai-marketing` (TF-1024) — motif : dépendance à une décision humaine ; l'ordre décidé (skills et marque d'abord) place ce lot après D-4, et le dépôt privé attend son emplacement (valeur demandée à l'action A-9).
- Les lots chez forge-agents au-delà des skills (référentiel d'exigences outillé, rendu OOXML, barres, contrôle de transparence — TF-1026 à TF-1028, TF-1030) et les gabarits du pilot (TF-1029) — motif : dépendance à une décision humaine ; l'ordre de l'option (a) les place après les skills et la marque, et les skills ne sont pas encore livrés.
- La décision D-2 du matin (TF-1021 à TF-1023 et leurs classes) — motif : dépendance à une décision humaine ; non tranchée par « 3a », non reposée ici.
- Le push du pilot (`d65c578..` cinq enregistrements puis six) — motif : bloqué par un garde-fou, R-38 §4-5 ; les enregistrements portent des livrables explicites, une référence nouvelle et une décision, hors de la couverture d'office.
- La question de la communication interne — motif : dépendance à une décision humaine ; toujours hors typologie (hypothèse H4 de la spécification).

## 6. Écarts à la lettre

- **Vous avez écrit** « 3a » → **j'ai fait** la journalisation des huit candidatures et lancé les lots dans l'ordre du chemin critique, mais **un seul lot est en exécution** (les skills) et deux sont écrits sans être joués (type de run : écrit, fixture en attente ; produit : spécifié et qualifié, non né) → **pourquoi** : l'option (a) ordonne « skills et marque, puis produit et type de run » ; le lot de la marque bute sur une source à trancher (D-4), et la naissance suit la marque.
- **Vous avez écrit** « le spécifique Digit-AI ira dans un projet dédié » → **j'ai fait** le renommage du produit en `digit-ai-marketing` (registre, étude rectifiée, spécification) → **pourquoi** : aucun écart de fond ; l'étude prévoyait déjà le produit dédié sous un nom de travail.
- **Vous avez écrit** « une spécification complète pour la création complète du projet » → **j'ai fait** une spécification-entrant de type cahier des charges, qualifiée suffisante par le verbe de conception, avec un bloc de lancement à coller dans le dossier du produit → **pourquoi** : la conception à quatre verbes se joue chez le produit (noyau : « la session s'ouvre chez le produit, jamais ici ») ; une spécification du pilot ne remplace pas `EXIGENCES.json` scellé, elle l'alimente. Le brouillon d'exigences EX-01 à EX-18 est écrit pour que `redige-les-exigences` ne parte pas de rien.
- **Aucun autre écart** : les mandats d'écriture chez forge-agents et forge-design sont pris comme « donnés du même mot », conformément au texte de l'option (a).

## 7. Risques

- L'agent du lot des skills écrit dans un dépôt frère ; une erreur d'anonymisation laisserait un nom de client dans un fichier versionné en source ;
  - signal : `oracle-nom-client-publie` FAIL sur l'arbre de forge-agents, ou un terme de la table dans `git diff` de la forge ;
  - parade : la consigne impose l'anonymisation avant versionnement et un grep final ; à la redépose, la porte des noms sera rejouée sur forge-agents par le pilot avant tout autre geste.
- Le skill PowerPoint reconstitué porte des valeurs de marque « de juillet » qui contredisent la source que D-4 retiendra ;
  - signal : les oracles de jetons de forge-design, de T1 (les jetons de couleur déclarés et consommés) à T6 (aucune valeur de marque en dur), FAIL sur un deck produit après le lot de la marque ;
  - parade : les références reconstituées sont datées et marquées « à remplacer par la consommation des jetons » ; le lot de la marque fait consommer `tokens.css` par le skill.
- La spécification est qualifiée avec une confiance dégradée : deux hypothèses (source de marque, hébergeur) peuvent changer la phase 0 et l'exigence de marque ;
  - signal : `qualifie-l-entrant` rejoué à l'ouverture du run avec une question indicée ;
  - parade : D-4 et la valeur de l'action A-9 lèvent les deux ; la spécification §11 dit déjà ce qui change dans chaque cas.
- Le noyau est à 3 octets du plafond : toute référence nouvelle ne pourra plus y entrer ;
  - signal : `oracle-claude-md` N1 FAIL à la prochaine ligne ajoutée ;
  - parade : l'index et l'accueil portent les références (décision du 03/09) ; acceptation déclarée.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), dans l'ordre du chemin critique décidé — intégrer le lot en cours, puis la marque, puis la fixture du type de run, puis la naissance du produit, puis les lots suivants, le push en dernier ; puis les actions humaines, dans l'ordre des décisions et valeurs qu'elles fournissent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Intégrer le retour du lot des skills : rejouer `oracle-nom-client-publie` sur `digit-ai-forge-agents`, relever le hash et les self-tests, propager par `node bootstrap.mjs --pull`, jouer `oracle-skills`, redéposer cette synthèse (TF-1021, TF-1022) | auto_ia | `dependance_externe` — l'agent délégué n'a pas rendu (0 fichier enregistré à 12:56) ; à défaut, les skills restent en archive | simple × court |
| A-2 | Jouer `systeme-de-marque` pour Digit-AI depuis la source tranchée, `tokens.css` et `MARQUE.md` avec la règle de transparence, oracles tokens T1-T6 et DTCG D1-D3, artefacts déposés chez le produit à sa naissance (TF-1023, TF-1030) | auto_ia | `dependance_bloc_3` — attend D-4 ; à défaut, deux chartes contradictoires et un PowerPoint sur des valeurs reconstituées | simple × court |
| A-3 | Jouer la fixture de `RUN-AO.md` : séquence rejouée sur le cas du 24/07 pseudonymisé, `oracle-exigences-ao` X1-X3 et `oracle-claims` PASS, verdicts au ledger (TF-1025) | auto_ia | `dependance_externe` — exige les skills installés (A-1) ; à défaut, le type de run décrit sans prouver | moyen × court |
| A-4 | Ouvrir le run de naissance de `digit-ai-marketing` en collant le bloc §10.1 de la spécification dans le dossier du produit : socle, git local, héritage, `oracle-conformite-projet` PASS, `oracle-confidentiel`, conception à quatre verbes (TF-1024, TF-1031) | auto_ia | `dependance_bloc_3` — attend D-4 (ordre décidé) et la valeur A-9 (dépôt privé) ; à défaut, l'instance reste éparse | moyen × court |
| A-5 | Chez forge-agents, après A-1 : référentiel d'exigences outillé, skill de rendu OOXML, trois barres, contrôle de transparence (TF-1026, TF-1027, TF-1028, TF-1030) | auto_ia | `dependance_externe` — après A-1 et A-2 par l'ordre décidé ; mandat couvert par D-3 (a) ; à défaut, la réponse à trame imposée reste à la main | complexe × moyen |
| A-6 | Chez le pilot : quatre familles au catalogue `gabarits\documents` (kit partenaire, charte de partenariat, courrier fournisseur, étude de cas), `oracle-gabarits-documents` PASS (TF-1029) | auto_ia | `dependance_bloc_3` — après A-2 par l'ordre décidé (les gabarits consomment la marque) ; à défaut, deux publics sans forme opposable | simple × moyen |
| A-7 | Pousser le pilot (`d65c578..` six enregistrements), `FORGE_PUSH_GO` posé, porte des noms rejouée par le hook (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend A-11 ; à défaut, tout reste local | simple × court |
| A-8 | Trancher D-4 — répondre « D-4 (a) », « D-4 (b) » ou « D-4 (c) : <logo ou site> » ; le relevé de marque est joué par l'IA (TF-1023) | manuelle_utilisateur | `decision` — le verbe de marque rend la main entre deux sources contradictoires ; sinon : le lot de la marque ne se joue pas | simple × court |
| A-9 | Donner l'emplacement du dépôt privé du produit — répondre « dépôt : <hébergeur/organisation> » (TF-1024) | manuelle_utilisateur | `decision` — hébergement et coût d'un dépôt privé, R-29 ; sinon : le produit naît en local seulement | simple × court |
| A-10 | Trancher D-2 du matin — répondre « D-2 (a) », « (b) » ou « (c) » (TF-1021, TF-1022, TF-1023) | manuelle_utilisateur | `decision` — la décision sur un candidat est humaine (TODO-FORGE) ; sinon : les trois restent en candidat alors que leurs lots s'exécutent | simple × court |
| A-11 | Donner le feu vert de publication du pilot — répondre « pousse le pilot » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'enregistrements portant livrables, référence et décision est un GO humain ; sinon : le pilot reste en avance, en local | simple × court |
| A-12 | Désigner l'appel d'offres ou la propale réels d'exercice — répondre « livrable d'exercice : <objet, échéance> » (neuve) | manuelle_utilisateur | `decision` — le pilot ne connaît aucun cas en cours ; sinon : la rejouée du 24/07 tient lieu de fixture | simple × court |

## 9. Traces

- Type de run : `references\RUN-AO.md` ; index `references\INDEX.md` ; accueil `references\ACCUEIL.md` (commit `5e34f28`).
- Spécification : `output\04-plans\Digit-AI - Specification Produit - digit-ai-marketing - 20260911a.md` ; qualification : `scratchpad\qualification\ENTRANT.md` (hors dépôt) ; étude rectifiée : `output\03-etudes\20260911-etude-opportunite-communication-marketing-ao.md` ; les deux livrables sont enregistrés avec cette synthèse.
- Registre : `todo\TODO.jsonl` (8 événements `decide` du 11/09 sur TF-1024 à TF-1031) ; vues `todo\TODO.md`, `todo\RECIDIVES.md` et la page générée du registre ; fichier d'événements `scratchpad\decision-d3.json` (hors dépôt).
- Lot des skills : `digit-ai-forge-agents` (agent en cours, enregistrement local attendu, aucun push).
- Oracles : `journaliser.mjs` (8 écrits, PASS avant et après), `oracle-claude-md` (PASS), `check_markdown.py` (PASS ×4), `oracle-etude-opportunite` (PASS 10/10), `qualifie-l-entrant` (seuil atteint, 0 question), `oracle-synthese` sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme).
- Aucune page HTML livrée dans ce tour.
