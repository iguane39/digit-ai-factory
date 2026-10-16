# Retours forges — Produit-83 — 20261015b

- **Contexte** : run de version `Produit-83-20261015-construction`, étapes conception, design, development, tests et MEP en staging ; lot remis avant la clôture, le run attendant des décisions humaines
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: retour` seq 74, 75, 76, 77, 78, 79, 80, 81, 86, 87, 88, 89, 90, 91, 94, 95, 107, 108, 109, 120, 121, 122, 123, 124, 125, 126, 127, 136, 137, 138, 139, 140, 142, 155, 156, 157, 158, 159, 160, 175, 176, 177
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar.
- **Statut** : a_remettre

---

## Pilot (`digit-ai-factory`)

9 retour(s) relevé(s) en exécutant les outils de cette forge pendant le run, chacun avec sa preuve consignée au journal.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-8 | majeur | générique | oracle-ecriture EC-8 refuse le titre « Ce que les tests simulent », lu comme une annonce (ledger seq 91, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RT-9 | majeur | générique | gabarits/docs-projet/MODELE-DONNEES.md prescrit « — » pour une cellule Clé vide ; oracle-ecriture compte chacun comme un tiret d incise (EC-1) : un modèle de 20 tables écrit comme le gabarit échoue (120 occurrences, 77 pour mille, seuil 40) (ledger seq 94, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `deux-regles-du-socle-inconciliables` |
| RT-10 | mineur | générique | les gabarits docs-projet ne déclarent ni lecteur ni role_destinataire : EC-10 rend SKIP sur les cinq fichiers et leurs blocs de code ne sont jamais jugés (ledger seq 95, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `regle-ecrite-sans-oracle-qui-la-joue` |
| RT-11 | mineur | générique | R-21 ignore sans le dire une clé de version entre guillemets comme "@vitejs/plugin-react", alors qu une clé YAML ne peut commencer par @ sans guillemets (ledger seq 108, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `contrainte-de-saisie-ignoree-en-silence` |
| RT-12 | mineur | générique | oracle-adoption-tests cherche les cahiers sous la cible alors que G-1 les impose hors du projet ; lancé sur le projet, il rend SKIP (ledger seq 124, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` |
| RT-13 | majeur | générique | ETAPES-RUN 5 bis attend un verdict Accepter/Retravailler/Refondre, la référence critique-implementation de forge-design dit Livrer/Renforcer/Refondre (ledger seq 140, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `deux-regles-du-socle-inconciliables` |
| RT-14 | majeur | générique | Le peuplement de qualification a été annoncé à 13 087 établissements (ledger seq 119 et synthèses du 15/10). Mesure sur la base copiée le 15/10/2026 : 9 872 établissements distincts (8 802 SIREN), 13 087 étant la somme des résultats comptés tuile par tuile (collecte_tuiles.nb_etablissements), où les cercles de collecte se chevauchent. Le chiffre affiché par l'orchestrateur reprenait le rapport de l'agent sans recompte en base. (ledger seq 142, étape run) | corriger la cause pour que le constat ne se reproduise pas ; classe `compte-total-hors-canal-des-constats` |
| RT-15 | majeur | générique | oracle-trace-mutation-mep (ligne 152) lit « jouée » dans une phrase niée et dans DECLAREE_JOUEE (ledger seq 155, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RT-16 | majeur | générique | verifier-portes-du-jour PJ-3 prend le premier mot de la ligne « Objet lancé » et refuse « version N, image … » (ledger seq 177, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |

## Forge design (`digit-ai-forge-design`)

10 retour(s) relevé(s) en exécutant les outils de cette forge pendant le run, chacun avec sa preuve consignée au journal.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | mineur | générique | ETAPES-RUN §3 prescrit oracle-baseline.mjs approuver ; joué, il rend SKIP exit 0 (artefact « approuver ») ; syntaxe réelle --approuver --slug, et sans --racine la baseline s écrit dans digit-ai-forge-design (ledger seq 74, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` |
| RD-2 | majeur | générique | le contrat de jetons et generer-tokens-css.mjs émettent @media (prefers-color-scheme: dark), que check_html G1 refuse en bloquant (ledger seq 75, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `deux-regles-du-socle-inconciliables` |
| RD-3 | majeur | générique | run-oracles-design lance oracle-surcouche sur le mot ::backdrop d un commentaire de tokens.css ; SKIP, verdict agrégé SKIP exit 2 (ledger seq 76, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RD-4 | majeur | générique | oracle-textes-application T4-1 prend « Date du refus », l état de tuile « échec » (E-020) et la classe badge erreur pour des messages d erreur, en bloquant (ledger seq 77, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RD-5 | majeur | générique | oracle-perceptibilite PC3 et PC2 ignorent la cascade CSS : couleur de a.btn lue depuis .pied a (1,22:1 à tort) (ledger seq 78, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RD-6 | mineur | générique | render_page --theme sombre neutralisé par une page qui réécrit data-theme au chargement (ledger seq 79, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-vrai-sur-le-mauvais-invariant` |
| RD-7 | majeur | générique | check_html applique L25, L7, L9, h1 unique et L6 à une maquette d application multi-écrans ; L25 reste bloquante sans issue (ledger seq 80, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `deux-regles-du-socle-inconciliables` |
| RD-8 | mineur | générique | voix.md ne prévoit pas les sections « Principes / Parti pris » et « Voix » que generer-design-md.mjs lit ; sans elles DESIGN.md perd la dérivation de la DA (ledger seq 81, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `regle-ecrite-sans-oracle-qui-la-joue` |
| RD-9 | mineur | générique | oracle-baseline et oracle-taste ne lisent qu un fichier ; sur une URL, oracle-baseline rend SKIP « fichier absent », sans option de session (ledger seq 136, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-joue-sur-fichier-pas-sur-instance-servie` |
| RD-10 | majeur | générique | oracle-baseline B3 refuse --approuver tant que le dernier jugement de historique.jsonl est FAIL, même pour un écart voulu (ledger seq 137, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `regle-qui-interdit-son-propre-remede` |

## Forge development (`digit-ai-forge-development`)

6 retour(s) relevé(s) en exécutant les outils de cette forge pendant le run, chacun avec sa preuve consignée au journal.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-1 | mineur | générique | la cible targets/fastapi-saas est vide : bricks/ ne porte que .gitkeep ; copier.yml impose multi-locataire, RBAC Casbin et SSO (ledger seq 86, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `chaine-declaree-etapes-non-ecrites` |
| RV-2 | mineur | générique | le gate grep du playbook fait jq .[].id sur EXIGENCES.json, qui est un objet : il faut .exigences[].id (ledger seq 87, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` |
| RV-3 | mineur | générique | l exemple de nommage du playbook test_facture_sans_client_E-042 n est pas un identifiant Python valide (SyntaxError) (ledger seq 88, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` |
| RV-4 | mineur | générique | le playbook dit qu aucune section « Contrat du projet audité » n existe côté forge-tests, alors que le README de forge-tests la porte (ledger seq 89, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `boucle-retour-sans-descente` |
| RV-5 | mineur | générique | Windows bloque les extensions compilées de SQLAlchemy 2.1 (DLL load failed, stratégie de contrôle d application) : installation en Python pur nécessaire (ledger seq 90, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `garde-fou-de-plateforme-non-releve` |
| RV-6 | majeur | générique | le contrôle grep du playbook « textes dans le fichier de ressources » signale 17 fichiers React pour des attributs JSX ("col" 30 fois, "button" 26 fois), pas des textes affichés (ledger seq 107, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |

## Forge agents (`digit-ai-forge-agents`)

3 retour(s) relevé(s) en exécutant les outils de cette forge pendant le run, chacun avec sa preuve consignée au journal.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-4 | mineur | générique | render_page.py sur une URL d application derrière connexion ne voit que la mire sans --etat-session, que la consigne de l étape ne mentionne pas (ledger seq 109, étape development) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-joue-sur-fichier-pas-sur-instance-servie` |
| RA-5 | majeur | générique | render_page L2 : brider le paragraphe déclenche « bride par max-width », brider le conteneur « conteneur de lecture calé à gauche », et le message n oriente pas vers data-page="donnees" (ledger seq 138, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `regle-qui-interdit-son-propre-remede` |
| RA-6 | majeur | générique | render_page mesure un en-tête de tableau masqué de 1 px : « entete_desaligne … decale de 176px » (ledger seq 139, étape design) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |

## Forge tests (`digit-ai-forge-tests`)

11 retour(s) relevé(s) en exécutant les outils de cette forge pendant le run, chacun avec sa preuve consignée au journal.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RE-1 | majeur | générique | le pan api accuse 19 codes émis par des adresses sans route (repli 404, interface servie, /openapi.json) qu aucun responses= ne peut déclarer ; l exemption RT-10 ne couvre que app.mount (ledger seq 120, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `regle-qui-interdit-son-propre-remede` |
| RE-2 | majeur | générique | la mire du pan qualif soumet par le sélecteur « button[type=submit], input[type=submit], button », qui retient la bascule de thème, premier bouton du document (ledger seq 121, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RE-3 | majeur | générique | le pan qualif ne cherche la délégation d événements que sur document et document.body ; React 19 la pose sur l élément racine : 64 faux constats « formulaire sans action ni écouteur » et seuil:qualif bloquant (ledger seq 122, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RE-4 | mineur | générique | le parcours qualif multiplié par 4 états dérive 10 728 cas pour une instance de 13 000 établissements, et les chapitres F1 et F2 partagent leurs références (ledger seq 123, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-vrai-sur-le-mauvais-invariant` |
| RE-5 | mineur | générique | le pan fichiers dit « suite rouge ou environnement absent » sur une suite verte, et les pans fichiers et prompts sortent « non couverts » au lieu de « sans objet » sur un produit sans import ni prompt (ledger seq 125, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-vrai-sur-le-mauvais-invariant` |
| RE-6 | majeur | générique | le pan data attribue un NOT NULL par le seul nom de colonne, quelle que soit la table (ledger seq 126, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-faux-positif` |
| RE-7 | mineur | générique | la convergence de la boucle compte des faux positifs contestés comme anomalies révélées (ledger seq 127, étape tests) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-vrai-sur-le-mauvais-invariant` |
| RE-8 | mineur | générique | quatre_cent_quatre.py exige --prefixes même sans préfixe de langue (ledger seq 159, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` |
| RE-9 | mineur | générique | ETAPE-MEP § 4 exige une copie datée du tableau de bord de tests sous output, que forge-tests n a pas produite (ledger seq 160, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `chaine-declaree-etapes-non-ecrites` |
| RE-10 | mineur | générique | quatre_cent_quatre.py n a pas d issue « sans objet » pour un produit sans sitemap : NON_MESURABLE, exit 2, alors que tout passe (ledger seq 175, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-perimetre-de-non-mesure-non-publie` |
| RE-11 | mineur | générique | quatre_cent_quatre.py lit le HTML servi sans <nav> d une application monopage : cas « adresse inconnue » non mesurable sans --marqueur-menu (ledger seq 176, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-joue-sur-fichier-pas-sur-instance-servie` |

## Forge ops (`digit-ai-forge-ops`)

3 retour(s) relevé(s) en exécutant les outils de cette forge pendant le run, chacun avec sa preuve consignée au journal.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RO-1 | mineur | générique | oracle-ops.mjs lancé sur un .md comme le prescrit § 3 septies le juge aussi comme cible de release et écrit un FAIL dans .ops-journal.jsonl (ledger seq 156, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` |
| RO-2 | mineur | générique | ops.mjs restaurer ne gère que des releases de fichiers, pas la cible par défaut du pilot (conteneur Docker local) (ledger seq 157, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `chaine-declaree-etapes-non-ecrites` |
| RO-3 | mineur | générique | O-8 ne cherche que des fichiers cron et rend SKIP sur un worker qui planifie lui-même (ledger seq 158, étape mep) | corriger la cause pour que le constat ne se reproduise pas ; classe `controle-vrai-sur-le-mauvais-invariant` |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Six défauts d'affichage des erreurs de lecture (faux états vides) | corrigés par la boucle de tests | non | rien de généralisable : défauts de ce code, attrapés par les oracles existants |
| Établissements superposés à une même adresse | regroupés et écartés au clic | non | rien de généralisable : la classe est déjà tenue par oracle-exploitabilite au volume réel |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\Digit-AI - Fiche produit Beef Project - Prospection - 20261015a.html` | gd-fiche-produit · 1.0.0 | une section Personas et usages, et l'état « en attente de composant » d'un usage | le commanditaire a demandé le 15/10/2026 la réponse aux personas et à tous leurs usages | sous-section « Personas et usages » au chapitre 1, ajoutée par le générateur du produit | générique |
| `output\Produit-83 - Dossier MEP - 20261015d.md` | aucune famille de gabarit ; structure de ETAPE-MEP.md § 4 | une famille de gabarit pour le dossier de MEP d'un produit | aucun retour du lecteur à ce jour | tableau M-1 à M-15, section garde-fous, limites déclarées | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La chaîne complète a tenu sur un produit réel : 80 exigences, maquette validée, 479 tests serveur, 104 tests d'interface, 36 tests Playwright, staging Docker avec retour arrière éprouvé.
- `oracle-exposition` de forge-websec a fait poser une politique de contenu absente avant tout GO.
- `oracle-exploitabilite` au volume réel a révélé 3 051 établissements superposés, invisibles sur le jeu de démonstration.

## Ordre recommandé

1. Les faux positifs de forge-tests sur la délégation d'événements React, parce qu'ils bloquent seuls le seuil de qualification.
2. Les commandes prescrites inopérantes (baseline, playbook, recette 404), parce que chaque produit les rejoue.
3. Les autres, par gain décroissant.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : tous viennent d'outils exécutés ou du recomptage de la session.
