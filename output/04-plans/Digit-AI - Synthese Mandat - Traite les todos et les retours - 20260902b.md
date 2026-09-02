---
destinataire: humain
---

# Synthèse de mandat — trente candidatures décidées, trente et une clôtures qui REDESCENDENT chez les producteurs, et trois forges publiques nettoyées (02/09/2026, second tour)

## 0. Synthèse d'ouverture

Votre second mandat de la journée est exécuté. Trois lots arrivés dans l'après-midi ont été pris, et les trente candidatures en attente ont été décidées en bloc comme le matin — sauf la réécriture de l'historique, qui reste votre décision nominative. Trente et une corrections sont closes avec leur preuve, et chacune dit désormais par quelle règle, quel contrôle ou quel composant elle redescend chez ceux qui produisent : c'est la règle neuve du registre, née de trois récidives en quatre jours sur un seul projet. Le registre passe de dix-neuf à onze actifs, dont cinq constats du soir qui attendent votre tri. Ce qui change pour vous : les pages de données ont un socle et des juges, la restitution refuse quatre défauts de plus, et les quatre forges publiques ne portent plus de nom de produit en clair. Ce qui est attendu de vous : trois décisions, dont deux rappels, et le feu vert de publication des forges.

## 1. En-tête d'identification

- **quoi** — mandat « Traite les todos et les retours », second tour du jour : boîte d'entrée, registre, campagne sur les forges sœurs.
- **sur quoi** — le pilot `digit-ai-factory` ; écritures mandatées chez `digit-ai-forge-agents`, `digit-ai-forge-design`, `digit-ai-forge-tests`, `digit-ai-forge-audit` (commits locaux, aucun push) ; lecture seule chez un produit.
- **quand** — fin le **02/09/2026 à 19:05 (UTC+02:00)**, durée **≈ 3 h**.
- **qui** — session pilot Claude Fable 5.1 ; dépôt passé de `a421e3a` à `04b91fc` puis commit de clôture ; cinq agents délégués (trois Opus 5, deux Sonnet 5), escalade de modèle : aucune.

## 2. Verdict en une ligne

**Boîte d'entrée FAIL → PASS** (3 lots, 19 candidatures) · **30 candidatures décidées** · **31 items clos** avec leur `descente` et archivés, **19 → 11 actifs** (5 candidats, 6 décidés) · registre PASS · banc pilot **84/86 recettes vertes** — les deux rouges sont le même défaut, déclaré (TF-0787 : sommaire latéral des trois familles de gabarits) · bancs des forges : page-html 141 → 173 (36 règles, 18 familles), quality-oracles 186 → 210, gate d'écriture 15 → 21, forge-tests 1227 → 1233 et S-01 (le verdict « la forge attrape ce qu'elle doit et se tait sur ce qui va bien ») corpus ECHEC → OK, design 101 règles et audit 11/11 inchangés · passe d'anonymisation : 0 fichier résiduel sur les cinq dépôts.

## 3. Décisions attendues

> **D-42 — Décide-t-on en bloc les quatre constats en passant entrés ce soir ?**
> Les chantiers du jour ont trouvé quatre défauts hors de leur périmètre et les ont remontés : un skill de schémas qui embarque une copie figée du composant de filtres, donc privée des trois correctifs du jour ; la section de lint de la forge des tests, rouge depuis une dérive de version d'un outil que personne n'a épinglé ; un verdict de recette qui a changé entre deux exécutions parce que les oracles installés sur le poste ont changé de règles pendant la session ; et les trois familles HTML de la bibliothèque de gabarits du pilot, dont le sommaire est un bloc en tête de page que la règle neuve du jour refuse — deux contrôles du banc du pilot restent rouges tant qu'elles n'ont pas de sommaire latéral collant. Les trois premiers relèvent d'une même classe (un verdict qui dépend d'une copie ou d'une version non épinglée n'est pas reproductible) ; le quatrième est la bibliothèque rattrapée par sa propre règle.
> **Recommandation : (a).** Source consultée : les rapports des agents forge-agents et forge-tests (compteurs cités au registre, `todo/TODO.md`), et la règle de fraîcheur R-19 qui traite la même classe pour les forges.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les quatre en bloc, traitement au prochain tour | simple × court ; trois chantiers simples × courts, et un chantier de mise en page moyen × court (le sommaire latéral des trois familles) | exclut de les trier un à un |
| **(b)** ne décider que le quatrième (la bibliothèque) | simple × court | exclut la copie figée, le lint et l'épinglage des oracles : trois dettes connues restent sans juge |
| **(c)** ne rien décider | gratuit | exclut tout traitement : deux contrôles du banc du pilot restent rouges, et le prochain correctif du composant de filtres n'atteint pas le skill de schémas |

> **Si rien n'est décidé** : (c) s'applique — les quatre restent candidats, deux contrôles du banc restent rouges, déclarés, et la classe reste ouverte.

> **D-43 — Dépose-t-on les lots de travaux chez le produit 02, pour les trois correctifs qui attendent au pilot depuis le 26/08 ?**
> Trois items décidés le 28/08 visent le produit lui-même : sa porte de fraîcheur de déploiement empreinte un échantillon au lieu de l'ensemble, ses captures ne sont jamais pleine page, et quinze de ses contrôles ne sont exercés par aucune recette. Le pilot n'écrit pas chez un produit ; le canal prévu est le lot de travaux déposé chez lui, que sa propre session exécute. La question posée le 31/08 est restée sans réponse à travers quatre tours.
> **Recommandation : (a).** Source consultée : `gabarits/TRAVAUX-PILOT.md` (le canal existe, l'outil `todo/emettre-travaux.mjs` a une recette 31/31), et le registre où les trois items attendent avec leurs mesures.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** déposer les lots de travaux chez le produit 02 (un run mandaté, `FORGE_MANDAT_PRODUIT`) | simple × court pour le dépôt ; le produit les exécute à son rythme | exclut de laisser la dernière barrière avant sa production sur un échantillon |
| **(b)** écarter les trois items, avec motif et critère de réouverture | simple × court | exclut les correctifs tant que le produit ne les redemande pas |
| **(c)** ne rien décider | gratuit | exclut tout mouvement : quatrième tour d'attente |

> **Si rien n'est décidé** : (c) s'applique — les trois items restent décidés et sans exécutant, comme depuis le 28/08.

> **D-38 — Réécrit-on le passé du dépôt principal, ou vit-on avec une publication fermée ?**
> Rappel : l'arbre de travail du pilot est propre, deux cents enregistrements passés portent encore des noms de clients, et la porte de publication refuse tant qu'ils y sont. Retirer ces noms suppose de réécrire l'ensemble des enregistrements, ce qui change leur identité et rend inutilisable toute copie existante ; une partie du passé a déjà été publiée, seule l'exposition future est réduite.
> **Recommandation : (b).** Source consultée : la porte de publication rejouée ce jour (`node ~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs .`) — 0 constat sur l'état courant, 200 dans l'historique.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** réécrire le passé maintenant | complexe × moyen ; toute copie existante du dépôt devient inutilisable | exclut de garder une trace consultable de ce qui a été fait sous les anciens noms |
| **(b)** garder la publication fermée, et décider à froid | gratuit ; les enregistrements s'accumulent sur ce poste seulement | exclut la publication du dépôt principal tant que rien n'est décidé |
| **(c)** publier en contournant la porte | gratuit, et le passé part en clair | exclut tout retour en arrière |

> **Si rien n'est décidé** : (b) s'applique — la publication du pilot reste fermée, rien ne se dégrade.

## 4. Traité — avec sa preuve

**Retours**
- **Trois lots du produit 02 pris** (19 candidatures, TF-0765 à TF-0783), anonymisés sur disque par la porte explicite puis ingérés et suivis ; l'original reste chez le produit.
  - preuve : ingestions b1c962820c8a, 0a3739597468, 504c02158980 ; `oracle-boite-entree` FAIL → PASS ; 0 nom interdit (grep).
- **Le nom d'application du produit 12 et une abréviation du produit 11 rejoignent la table de pseudonymes** ; passe rejouée au pilot (12 lots renommés, 54 fichiers, 11 sidecars ré-empreintés avec preuve).
  - preuve : essai après passe → 0 fichier à réécrire ; boîte PASS ; registre PASS ; recettes des trois fichiers de code réécrits rejouées (45/45, 12/12).
- **TF-0764 clos — les quatre forges publiques nettoyées** (design 4 fichiers, agents 28 + 1 renommage, tests 56, audit 2), chacune relue par son banc ; les relectures ont trouvé ce que la passe ne voyait pas (noms hors table dans des exemples, un nom de client dans le commentaire de l'oracle de publication lui-même, élisions cassées, un pseudonyme mal attribué), tous remplacés par des noms inventés.
  - preuve : essai sur les cinq dépôts → 0 résiduel ; bancs inchangés ou en hausse (design 101 règles, audit 11/11 et 93/94, tests 1227 → 1233, agents 186 → 210 et 141 → 173).

**Registre — ce qui redescend**
- **TF-0757 clos** : règle R12 — toute clôture postérieure au 02/09 14:00 Z porte `descente` (règle, oracle, digest ou non mécanisable), sinon l'écriture est annulée.
  - preuve : `todo/self-test.mjs` 48 → 50 (rouge sans descente refusé, verte acceptée) ; 31 clôtures du tour la portent ; `oracle-todo` PASS.
- **Socle HTML — TF-0753, 0754, 0755 clos** : A1 (fichier autoportant) n'autorise plus les web fonts que l'oracle refuse ; B1 (l'en-tête de page qui reste collé en haut) et B6 (l'en-tête de tableau qui reste collé) tranchés au token `--hh` (boilerplate, règle L29 — le décalage sous l'en-tête) ; D5 documente `--red` (tokens dans les trois projections).
  - preuve : check_html.py 31 → 36 règles ; boilerplate.html PASS ; fixtures rouge/verte L29.
- **Pages de données — TF-0771, 0772, 0773, 0777, 0778, 0783 clos** : section I du référentiel HTML et, au skill, quatre familles de rendu bloquantes (rognage_donnees, prose_etroite, sommaire_perdu, controles_desalignes) et quatre règles statiques (L25 sommaire, L26 bride, L27 dictionnaire, L28 temps) ; `oracle-verdict-visuel` W5 (tout écart résiduel de débordement se mesure en pixels) refuse un écart résiduel non mesuré.
  - preuve : sur les fixtures rouges, la console du 02/09 rend « 1252 px pour 1100 disponibles », « bloc à 51 % du conteneur », « 4 contrôles sur 2 hauteurs », « 5 chapitres sans sommaire » ; bruit 0 constat sur 153 documents rendus ; verdict-visuel 7/7 → 9/9.
- **Composant de filtres — TF-0768, 0769, 0781, 0782 clos** : tri sur `data-v` (« 1 000 » cessait de valoir 1), état exposé et re-rendu supporté, facettes chronologiques, une facette par colonne avec exemption motivée (L4 — filtres de tableau — durcie).
  - preuve : banc runtime Playwright sur l'asset réel : 12/12 après, 7 échecs sur 8 avant ; la colonne clé « Marché » porte 8 options contre 0.
- **Conception et mesure — TF-0758, 0759, 0760 clos** : oracle « conception d'un livrable » — C1 (tout terme de méthode est défini), C2 (tout ensemble annoncé par son cardinal est énuméré), C3 (une liste porte son détail sans renvoi), C4 (tout chapitre écrit son intention de lecture) —, doctrine D8 ; oracle-calculs N3 (un pourcentage publié dit sa formule), doctrine D9.
  - preuve : bruit 35 → 0 FAIL sur 103 documents pour C1-C4 ; N3 7 → 0 faux positifs, couverture 1 → 4 PASS ; banc quality-oracles 186 → 210.
- **Lecture par un tiers — TF-0774 clos** : oracle en quatre règles — T1 (que permet-elle de décider), T2 (tout vocabulaire est glosé de façon atteignable), T3 (un geste est offert ou la lecture seule déclarée), T4 (le tiers lit l'instantané seul) — sans brief ni code ; invocation explicite ; preuve : fixture rouge FAIL, verte PASS, banc 200 → 207.
  - preuve : page V6 du 02/09 FAIL sur T1 + T2×2 + T3 ; T4 prouvée sans dépense par lecture fournie ; 1 FAIL réel retenu sur 7 pages.
- **Restitution v2.16.0 — TF-0766, 0767, 0775, 0779 clos** : S34 (aucune écriture demandée à l'humain), S35 (une preuve est une sortie exécutée), S36 (une page HTML livrée porte son verdict de critique d'implémentation), S37 (une correction nomme son contrôle rouge → vert) ; le hook juge le fichier nommé Synthese ou Restitution.
  - preuve : `oracle-synthese --self-test` 13/13 (rouge échoue sur S34-S37, verte passe) ; recette de sélection 4/4 ; hook 7/7 ; cette synthèse jugée PASS.
- **Le socle chez le producteur — TF-0765, 0762 clos** : hook produit `page-html` (règles de socle jouées à chaque écriture d'un .html), section « Règles de socle applicables » du gabarit produit, injection des règles par L99 (l'analyseur de prompts en huit couches) ; relevé d'héritage du parc à chaque ouverture du pilot.
  - preuve : `hook-page-html --self-test` 7/7 ; relevé : 9 produits, 71 manques, 5 sans lanceur nommés avec le geste ; HERITAGE 1.7.0.
- **Gouvernance des runs — TF-0776, 0780 clos** : F6 (run d'interface sans maquette validée) et F7 (l'auteur juge son propre contrat) de l'oracle d'état de forge, doctrines RUN-VERSION et ETAPES-RUN § 4 bis.
  - preuve : fixtures ledger rouge/verte, même manifeste ; banc 197 → 200.
- **TF-0732 clos (D-41 (b))** : précédence de charte écrite au registre et câblée au gate d'écriture (`qo-gate-write.mjs`, banc 21/21) ; **TF-0763 clos** : S-01 de la forge des tests redevient prononçable ; **TF-0770 clos** : forme de la sortie L99 sous fixture ; **TF-0756 clos** : famille gd-consolidation-process ouverte.
  - preuve : gate 15/15 → 21/21 (six cas de précédence) ; corpus ECHEC → OK (rouge 23/23, vert 0 bloquant), K2 60 % → 0 faux positifs ; l99 rouge/verte ; oracle-catalogues PASS.
- **Registre, vues et journal** : 31 items archivés (746 → 777), 10 actifs ; vues et avancement régénérés ; entrée du second tour dans [BOUCLE-AMELIORATION.md](BOUCLE-AMELIORATION.md) ; versions livrées de la forge des outils soldées (F1 — versions livrées à jour — PASS) ; copies installées des skills remises à niveau (oracle-skills PASS).

## 5. Non traité — avec son motif

- **TF-0752** (l'historique du dépôt) : *dépendance à une décision humaine* — D-38, geste irréversible, exclu du bloc.
- **TF-0674, TF-0676, TF-0682** (correctifs côté produit) : *dépendance à une décision humaine* — D-43.
- **TF-0549** (produit sans dépôt git) : *décision humaine 3c du 24/08* — laissé ouvert à dessein.
- **TF-0748, TF-0749** : *dépendance externe* — une campagne réelle.
- **TF-0784, TF-0785, TF-0786, TF-0787** (constats du soir) : *tout entre en candidat* — D-42. Pour TF-0787, la moitié faite ce soir : la règle L25 ne demande plus à un sommaire de se citer lui-même ni de lister les chapitres de service d'un gabarit (marqués `data-toc="hors"` sur les six fichiers) ; reste le sommaire latéral collant, un chantier de mise en page.
- **Le câblage de l'oracle « lecture par un tiers » sur le hook de restitution** : *gate de gouvernance* — chaque tour appellerait un modèle, c'est une dépense (R-29) ; l'oracle existe, son invocation reste explicite.
- **Le dictionnaire de colonnes généré et les unités calculables (volet produit de TF-0777)** : *hors mandat* — ce qui est mécanisable au socle et aux oracles est livré ; la génération des en-têtes depuis un fichier de données vit chez chaque produit.

## 6. Écarts à la lettre

- Vous avez demandé « traite les todos et les retours » → j'ai lu, comme le matin, le mandat global qui décide en bloc les candidatures en attente → sauf TF-0752 (irréversible) ; et j'ai appliqué ma propre recommandation aux deux décisions restées sans réponse depuis le matin (D-40 : nettoyer les forges ; D-41 : la précédence de charte au registre des oracles), parce que les deux sont réversibles et que le mandat les couvre — les deux sont dites ici plutôt que tues.
- Trois lots du produit 02 sont arrivés sous le nom réel du produit → anonymisés sur disque avant ingestion, comme le matin → l'original reste chez le produit.
- Un agent avait attribué au produit de courrier le pseudonyme d'un autre produit → rectifié dans la forge design (commit f99e293) → deux produits sous un même pseudonyme rendraient toute propagation ambiguë.
- Le nom d'application du produit 12 et l'abréviation du produit 11 ne figuraient pas dans la table de pseudonymes → ajoutés comme alias, passe rejouée → sans eux, douze lots restaient en clair au pilot et treize commentaires dans la forge des tests.

## 7. Risques

- Trente et une règles ou familles neuves sont entrées le même jour dans les oracles installés sur le poste : un produit qui rejoue sa recette demain verra des constats qu'il n'avait pas hier, et sa recette de forge peut changer de verdict sans qu'un octet ait bougé chez lui — c'est exactement ce que la forge des tests a mesuré en séance.
  - signal : une section de recette qui passe de vert à rouge entre deux exécutions ; un rapport qui ne cite pas l'empreinte des règles jouées.
  - parade : TF-0786 nomme le remède (l'empreinte des règles dans le rapport, `check_html.py --version-regles`), et toutes les familles neuves ont un bruit mesuré à 0 sur les corpus des forges.
- Quatre forges portent des commits locaux non poussés, et deux skills ont monté de version (quality-oracles 2.15.0 du registre, page-html 1.17.0) : un poste qui tire les forges ne les a pas encore.
  - signal : `bootstrap --pull` qui signale « en avance » sur quatre dépôts.
  - parade : la publication est un GO humain (A-1) ; les versions livrées sont soldées (F1 PASS) donc le push publie un état cohérent.
- Le hook produit `page-html` avertit à chaque écriture d'un .html chez les produits qui portent le lanceur : un produit qui écrit vingt pages recevra vingt avis.
  - signal : un journal de session saturé d'avis identiques.
  - parade : l'avis est court, ne bloque jamais, et ne parle que quand l'oracle de filtres rend FAIL ; une exemption motivée par colonne l'éteint.
- La règle R12 exige une descente pour chaque clôture : une session pressée pourrait écrire « non mécanisable » sans motif réel.
  - signal : des clôtures dont la descente ne nomme ni règle ni oracle, en série.
  - parade : le champ est lisible au registre et à la revue ; sa justesse n'est pas jugée (déclaré au non_juge de R12), comme celle des gains constatés.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit ce que coûte l'attente. **Ordre de traitement** : d'abord la publication, parce que trente et une corrections ne servent à personne tant qu'elles vivent sur ce poste ; puis ce qui dépend d'une décision de ce message ; puis le reste hérité.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | `neuve` | Publier les chantiers des forges sœurs : dans chacun des quatre dépôts (`c:/dev/digit-ai-forge-agents`, `-design`, `-tests`, `-audit`), `git log origin/main..HEAD` pour relire, puis `git push`. Preuve : `node bootstrap.mjs --pull` ne signale plus d'avance. | manuelle_utilisateur | irreversible — R-38 : aucun push sans GO humain. | Trente et une corrections vivent sur ce poste seulement ; un produit qui tire la forge n'en bénéficie pas. |
| **A-2** | TF-0784, TF-0785, TF-0786, TF-0787 | Traiter les quatre constats du soir une fois D-42 tranchée : composant de filtres chargé depuis le skill de pages (ou exemption datée) dans `digit-ai-schemas`, ruff épinglé et section lint soldée dans `c:/dev/digit-ai-forge-tests`, empreinte des règles des oracles consignée au rapport de recette, et sommaire latéral collant (grille deux colonnes, `nav.toc.colle`, `top: var(--hh)`) sur les trois familles de `gabarits/documents/` du pilot. | auto_ia | dependance_bloc_3 — D-42. | Le prochain correctif du composant n'atteint pas le skill de schémas ; deux sections de recette et deux contrôles du banc du pilot restent rouges sans que les dépôts bougent. |
| **A-3** | TF-0674, TF-0676, TF-0682 | Une fois D-43 tranchée (a) : `FORGE_MANDAT_PRODUIT=<produit 02> node todo/emettre-travaux.mjs` depuis `c:/dev/digit-ai-factory`, puis vérifier `forge/travaux/` chez le produit. | auto_ia | dependance_bloc_3 — D-43 ; garde_fou — le pilot n'écrit pas chez un produit sans mandat déclaré. | La dernière barrière avant la production du produit 02 reste sur un échantillon. |
| **A-4** | TF-0752 | Trancher D-38, puis, si (a), jouer `git filter-repo` dans `c:/dev/digit-ai-factory` et prévenir tout porteur d'une copie. | manuelle_utilisateur | irreversible — une réécriture d'historique casse toute copie existante. | La publication du dépôt principal reste fermée. |
| **A-5** | `neuve` | Câbler l'oracle « lecture par un tiers » sur le hook de restitution des produits (`oracles/hook-restitution.mjs`, appel de `oracle-lecture-tiers.mjs` sur toute page HTML citée), après accord sur le coût d'un appel de modèle par tour. | auto_ia | gate_gouvernance — R-29 : chaque tour engagerait une dépense de modèle ; l'oracle existe et se joue à la demande. | Une page que personne ne comprend continue de passer les portes de forme. |
| **A-6** | `neuve` | Supprimer le fichier parasite `c:/dev/null` (page de redirection vers une authentification Microsoft, vérifiée sans jeton) : `Remove-Item c:\dev\null`. | manuelle_utilisateur | irreversible — supprimer un fichier est un geste humain (R-29). | L'avertissement se répète à chaque ouverture. |
| **A-7** | `neuve` | Poser le nettoyage à l'ENREGISTREMENT : un contrôle `pre-commit` dans `c:/dev/digit-ai-factory/.git/hooks/` jouant `node todo/anonymiser-suivis.mjs --essai` et refusant l'enregistrement s'il reste quelque chose à nettoyer. | auto_ia | hors_mandat — mandat propre au socle de publication, hérité des tours précédents. | Le même défaut revient à chaque ajout de dossier entier, et ne se découvre qu'à la publication. |
| **A-8** | TF-0749 | Au prochain passage en production d'un produit audité, jouer la comparaison des deux campagnes : `python recette/non_perte_ciblage.py <projet>` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | dependance_externe — elle exige une campagne réelle. | Le tri des tests reste éteint sans que rien ne dise s'il aurait tenu. |
| **A-9** | `neuve` | Poser le lanceur de hooks chez les cinq produits du parc qui n'en ont pas (nommés à chaque ouverture du pilot) : copier `gabarits/hooks-factory.mjs` en `forge/hooks/factory.mjs` et `gabarits/settings-produit.json` en `.claude/settings.json` chez chacun, puis ouvrir une session du produit — elle recopie le reste. | manuelle_utilisateur | decision — écrire chez un produit est un mandat nominatif (« ne touche pas les produits ») ; le relevé le déclare à chaque ouverture (R-29). | Ces produits ne reçoivent ni le hook de restitution, ni le hook `page-html`, ni les gabarits : leurs livrables restent hors des portes. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Traite les todos et les retours - 20260902b.md (jugée PASS par `oracle-synthese` avant affichage)
- Commits du pilot : 04b91fc (volet pilot du second tour), puis le commit de clôture (registre, vues, journal, passe Produit-11, synthèse) — locaux, publication fermée (D-38)
- Commits des forges (locaux) : forge-agents 529a311, e83a8ca, 3763998, c0cf621, effe6b7, d082ab7, e23bfd6, 7237083, a4c8584, 81a0463, f19faa0, c8f4046, 437e055, c7252b1, ecc9260, c6cbb8e (L25 : exclusions payées sur la bibliothèque du pilot) · forge-design 40d0223, aa18bce, f99e293 · forge-tests 77ffbac, dcb8ffe, b6faef4, 3973a7d, 62fd1b7 · forge-audit 7bc1e4f
- Outils et règles neufs au pilot : todo/oracle-todo.mjs R12 · oracles/hook-page-html.mjs · oracles/hook-restitution-selection.test.mjs · oracles/oracle-synthese.mjs S34-S37 · oracles/oracle-verdict-visuel.mjs W5 · oracles/hook-ouverture.mjs (relevé d'héritage)
- Doctrine : references/BEST-PRACTICES-HTML.md § I et A1/B1/B6/D4/D5 · gabarits/documents/README.md D8-D9 · gabarits/documents/catalogue.jsonl (gd-consolidation-process) · gabarits/RESTITUTION.md v2.16.0 · gabarits/CLAUDE-PRODUIT.md · gabarits/settings-produit.json · gabarits/hooks-factory.mjs · gabarits/HERITAGE.json 1.7.0 · references/RUN-VERSION.md · references/ETAPES-RUN.md § 4 bis · gabarits/RETOURS-FORGES.md · references/TODO-FORGE.md (R12)
- Registre : todo/TODO.jsonl (11 actifs), todo/TODO-ARCHIVE.jsonl (777), todo/AVANCEMENT.md ; journal : BOUCLE-AMELIORATION.md (entrée du second tour)
- Bancs : oracles/self-tests.mjs (84/86 — verifier-rendu-instances et oracle-gabarits-documents rouges sur le parc réel, TF-0787) · todo/self-test.mjs 50/50 · oracle-synthese 13/13 · verdict-visuel 9/9 · hook-page-html 7/7 · sélection de synthèse 4/4 · conformité projet 45/45 · adoption-tests 12/12
