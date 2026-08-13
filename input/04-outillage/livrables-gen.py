# -*- coding: utf-8 -*-
"""Produit les deux livrables que le rapport consomme : le CSV d'actions et le snapshot.

Le scoring suit `referentiel/scoring.md` : Priorité = (Gain × Confiance) / Effort, chaque
cran cité. Les nœuds du snapshot sont relus des fiches — jamais ressaisis — pour qu'aucun
verdict ne puisse diverger entre la fiche et le livrable.
"""
import sys, re, csv, json, pathlib
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

M = pathlib.Path(__file__).resolve().parent
GRILLE = pathlib.Path(r"c:\dev\digit-ai-forge-seo\seo")
MAN = json.loads((GRILLE / "manifest.json").read_text(encoding="utf-8"))["noeuds"]
DOM, JOUR = "produit-02.fr", "20260808"
LIV = M / "livrables"; LIV.mkdir(exist_ok=True)

SRC_GSC = ("export Search Console donnees/gsc/, période 2025-04-07 → 2026-08-06, "
           "consulté le 2026-08-08")
SRC_GA4 = "export GA4 donnees/ga/ga4.json, même fenêtre, consulté le 2026-08-08"

# ── actions ──────────────────────────────────────────────────────────────────
# (id, libellé, volet, nœuds, gain, cran_gain, effort, cran_effort, confiance,
#  cran_confiance, horizon, j_réalisation, j_effet, critère, hypothèse, exécution,
#  régime, coût, €, trimestre, dépendance)
A = [
 ("A1",
  "Réécrire les 79 balises title et les 78 méta-descriptions dupliquées : marque, nom du "
  "gîte et commune dans chaque title, description propre à chaque page",
  "ETAT", [43, 19, 74, 16, 11], 4,
  "gain 4 — structurant : porter le CTR hors marque de 1,55 % à 3 % sur 21 809 impressions "
  "de première page ajoute environ 320 clics par an ; porter le CTR global de 2,04 % à "
  "2,6-3,2 % ajoute 686 à 1 426 clics par an sur une base de 2 514, soit +27 % à +57 % du "
  "trafic organique",
  2,
  "effort 2 — 0,5 à 2 jours-homme : 157 balises sur un site de 79 pages, compétence de "
  "rédacteur, aucune intervention technique",
  4,
  "confiance 4 — preuve [T2] du manque à gagner : position 5,5 pour 512 impressions et "
  "zéro clic sur « location maison avec piscine mont saint michel »",
  "quick-win", 2, 28,
  "les 79 balises title sont uniques, longues de 40 à 60 caractères, et contiennent chacune "
  "la marque, le nom du gîte et un toponyme ; les 79 méta-descriptions sont distinctes deux "
  "à deux",
  "Le CTR est limité par la promesse affichée, non par la position : le même site obtient "
  "26,66 % en position 1-3 sur sa marque et 1,55 % hors marque en première page.",
  "IA", "ia-assistee-validation-humaine", "GRATUIT", 0, "T1", None),

 ("A8",
  "Établir la table de correspondance d'URLs de l'ancien vers le nouveau site, et les "
  "redirections 301, avant la bascule de domaine",
  "ETAT", [33, 54, 74, 77], 5,
  "gain 5 — changement de palier, en perte évitée : la bascule met en jeu la totalité des "
  "3 352 clics annuels et la position 1,2 sur les six requêtes de marque qui portent 48,7 % "
  "des clics",
  3,
  "effort 3 — 2 à 10 jours-homme : crawl du site de remplacement, appariement de 286 URLs, "
  "écriture et recette des redirections",
  4,
  "confiance 4 — preuve [T2] du volume exposé : 3 352 clics et 164 393 impressions mesurés "
  "sur 487 jours",
  "quick-win", 5, 30,
  "chacune des 286 URLs du sitemap actuel répond 301 vers une URL du nouveau site répondant "
  "200, vérifié par crawl automatisé après la bascule",
  "Une migration sans plan de redirection efface l'acquis de référencement ; c'est la seule "
  "action du dossier dont l'inaction a un coût certain plutôt que probable.",
  "IA", "ia-assistee-validation-humaine", "GRATUIT", 0, "T1", None),

 ("A9",
  "Reconnecter les 208 pages orphelines par des liens contextuels depuis les fiches de "
  "gîte, et retirer /checkout, /paypal-checkout et /order-confirmation du sitemap",
  "ETAT", [13, 14, 33, 56, 12], 4,
  "gain 4 — structurant : 208 pages, soit 73 % du site, ne reçoivent aucun lien entrant ; "
  "elles portent le contenu non substituable — restauration, menus, piscine, produits "
  "locaux — et expliquent les 202 pages à zéro clic sur 255",
  3,
  "effort 3 — 2 à 10 jours-homme : liens contextuels à poser dans cinq gabarits, plus le "
  "nettoyage du sitemap",
  3,
  "confiance 3 — preuve [T1] du défaut et volume établi : 208 pages comptées par "
  "confrontation du sitemap au graphe de liens, dont 10 vérifiées une à une en HTTP 200",
  "structurant", 4, 90,
  "aucune URL du sitemap n'est sans lien entrant depuis une page navigable, hors menu et "
  "pied de page ; aucune page de tunnel n'est déclarée au sitemap",
  "Une page atteignable seulement par le sitemap est explorée mais ne reçoit pas d'autorité "
  "interne ; le contenu différenciant du site est intégralement dans ce cas.",
  "IA", "ia-assistee-validation-humaine", "GRATUIT", 0, "T1", None),

 ("A2",
  "Créer 4 pages de destination géolocalisées et saisonnières — week-end hors saison, "
  "piscine à Pontorson, séjour de groupe, bain nordique — ciblant les requêtes qui portent "
  "75 % des impressions",
  "STRATEGIE", [62, 5, 73, 20, 78, 83], 4,
  "gain 4 — ouverture d'un territoire à demande démontrée : 45 requêtes en position 11-30 "
  "cumulent 19 576 impressions, et aucune page du site ne porte un nom de commune",
  3,
  "effort 3 — 2 à 10 jours-homme : quatre pages documentées, avec recherche de contenu local",
  4,
  "confiance 4 — preuve [T2] du manque à gagner : position 11-30 à volume établi sur "
  "45 requêtes, dont « piscine pontorson » à 977 impressions et zéro clic",
  "structurant", 8, 180,
  "les 4 pages sont publiées, chacune de plus de 800 mots, portant un toponyme dans son "
  "title et son H1, et chacune positionnée dans le top 20 de sa requête cible à 6 mois",
  "La demande de recherche ne baisse pas hors saison — 165 à 278 clics par mois sans creux — "
  "alors que l'occupation tombe de 83 % à 27 % : le trafic d'hiver existe et n'est pas capté.",
  "IA", "ia-assistee-validation-humaine", "GRATUIT", 0, "T2", "A1"),

 ("A5",
  "Poser une balise canonique auto-référente sur chaque page, et arbitrer le doublon "
  "/normandie/gites contre /contact/gites",
  "ETAT", [30, 74, 75], 2,
  "gain 2 — gain localisé sur une poignée de pages : /contact/gites cumule 17 635 "
  "impressions pour 108 clics en position 45,3, en doublon de titre",
  1,
  "effort 1 — moins de 0,5 jour-homme : une balise dans le gabarit, un arbitrage à trancher",
  2,
  "confiance 2 — preuve structurelle [T1] seule : aucune canonique sur les 79 pages, sans "
  "mesure du coût réel de leur absence",
  "quick-win", 1, 30,
  "les 79 pages portent une canonique auto-référente ; une seule des deux pages « Gîtes » "
  "reste indexable, l'autre pointant vers elle",
  "Sans canonique, l'arbitrage entre deux pages jumelles revient à Google et peut changer ; "
  "le site en expose sept séries.",
  "IA", "bout-en-bout", "GRATUIT", 0, "T2", None),

 ("A3",
  "Consolider les pages de moins de 300 mots : fusionner inclus, options, tarifs, "
  "réservation et informations en une fiche unique et complète par gîte",
  "ETAT", [74, 25, 66, 22, 21, 56], 5,
  "gain 5 — levée d'un blocage : cannibalisation généralisée, 45 pages se partageant "
  "10 titres, dont huit pages de réservation dispersées de 1 % en volume",
  4,
  "effort 4 — 10 à 30 jours-homme : 35 pages à fusionner en 7 fiches rédigées, avec plan de "
  "redirection",
  3,
  "confiance 3 — preuve [T1] du défaut et volume établi : dispersion mesurée gabarit par "
  "gabarit, et 31 pages sous 300 mots",
  "structurant", 20, 120,
  "chaque gîte dispose d'une fiche unique de plus de 1 200 mots portant capacité, "
  "équipements, tarifs et saisons ; aucun titre n'est dupliqué sur le site ; les URLs "
  "supprimées répondent 301",
  "Cinq fragments de 260 à 570 mots par gîte ne peuvent pas se positionner séparément et se "
  "cannibalisent ; une fiche unique le peut.",
  "IA", "ia-assistee-validation-humaine", "GRATUIT", 0, "T2", "A8"),

 ("A10",
  "Réclamer les 4 fiches tierces — TripAdvisor, gites.fr, annu-hotel, ville-data — et "
  "mettre en place la sollicitation d'avis auprès des clients satisfaits",
  "ETAT", [61, 60, 59, 41, 42, 47, 81], 3,
  "gain 3 — famille de requêtes commerciales débloquée : la marque porte 48,7 % des clics, "
  "et la note publique la plus visible est de 2 sur 5",
  2,
  "effort 2 — 0,5 à 2 jours-homme pour la revendication ; la sollicitation d'avis est "
  "ensuite un dispositif récurrent, non un chantier",
  2,
  "confiance 2 — preuve structurelle [T3] seule : la note est mesurée, son effet sur le clic "
  "ne l'est pas, et le registre trafic du barème n'exprime pas un effet de conversion",
  "quick-win", 2, 90,
  "les 4 fiches sont revendiquées et leurs coordonnées alignées sur une commune unique ; au "
  "moins 25 avis sont déposés sur TripAdvisor, pour une note supérieure ou égale à 4,0",
  "8 avis pour 1 337 séjours : la note publique repose sur un échantillon non représentatif "
  "que huit avis suffisent à faire basculer.",
  "MANUEL", "manuel-strict", "GRATUIT", 0, "T1", None),

 ("A4",
  "Déployer les données structurées LodgingBusiness et Accommodation, les sameAs vers les "
  "fiches tierces, et les balises Open Graph sur tous les gabarits",
  "ETAT", [32, 53, 59, 45, 26], 2,
  "gain 2 — gain localisé : un seul type d'enrichissement remonte aujourd'hui dans Search "
  "Console, pour 3 clics sur 66 impressions en 16 mois",
  2,
  "effort 2 — 0,5 à 2 jours-homme : balisage posé une seule fois dans les gabarits",
  2,
  "confiance 2 — preuve structurelle [T1] seule : aucun JSON-LD et aucun Open Graph sur les "
  "79 pages, sans mesure du gain de clic associé",
  "structurant", 2, 90,
  "les 7 fiches de gîte exposent un LodgingBusiness valide au test des résultats enrichis, "
  "avec adresse, coordonnées géographiques et au moins 3 sameAs ; toutes les pages portent "
  "og:title, og:description et og:image",
  "À position égale, un résultat enrichi capte davantage ; et un lien partagé sans Open "
  "Graph s'affiche nu dans les messageries.",
  "IA", "bout-en-bout", "GRATUIT", 0, "T2", None),

 ("A7",
  "Configurer l'événement de réservation dans GA4, transmettre l'identifiant Beds24, et "
  "arbitrer la campagne Google Ads",
  "ETAT", [71, 84, 46, 76, 8], 1,
  "gain 1 — effet indirect, non attribuable à une page : l'action ne produit aucun clic "
  "supplémentaire",
  2,
  "effort 2 — 0,5 à 2 jours-homme : un événement, un paramètre transmis, un arbitrage à "
  "rendre",
  3,
  "confiance 3 — preuve [T1] de l'absence et volume établi : aucun événement de conversion, "
  "et 379 112 sessions dont 87 % de trafic publicitaire invalide",
  "quick-win", 2, 90,
  "l'événement de réservation se déclenche et reste visible dans GA4 sur 30 jours "
  "consécutifs, et le taux de transformation visite vers réservation du canal organique "
  "devient lisible",
  "Sans événement de conversion, aucun gain SEO n'est exprimable en euros autrement que par "
  "hypothèse ; cette action ne rapporte rien et rend le reste jugeable.",
  "MANUEL", "manuel-strict", "GRATUIT", 0, "T1", "A1"),

 ("A6",
  "Publier un llms.txt et une page de questions-réponses factuelle : accès, capacités, "
  "équipements, saisons, distances",
  "STRATEGIE", [24, 26, 57, 55], 1,
  "gain 1 — effet indirect : la citation en réponse générative n'est attribuable à aucune "
  "page, et le canal ne pèse que 100 sessions mesurées",
  2,
  "effort 2 — 0,5 à 2 jours-homme : une page et un fichier, écrits à partir de faits déjà "
  "connus",
  2,
  "confiance 2 — preuve structurelle [T1] : aucun des 5 critères de citabilité n'est rempli, "
  "sans mesure de l'effet d'une correction",
  "fondation", 2, 180,
  "au moins 20 couples question-réponse de moins de 60 mots sont publiés sous un titre "
  "explicite et balisés en FAQPage ; /llms.txt répond 200",
  "Un moteur de réponse ne reprend que des faits attribuables ; le site publie des adjectifs "
  "là où un concurrent publie des nombres.",
  "IA", "bout-en-bout", "GRATUIT", 0, "backlog", "A4"),
]

# Colonnes imposées par `scripts/livrables.py` (COLONNES_ACTIONS) depuis la refonte du
# pipeline : `delai_realisation` et non `delai_realisation_jours`, pas de `libelle` ni de
# `remontee_par_dependance`. Le rapport lit `action` pour le libellé.
COLS = ["id", "action", "volet", "noeuds_couverts", "gain", "cran_gain_cite",
        "effort", "cran_effort_cite", "confiance", "cran_confiance_cite", "score",
        "horizon", "delai_realisation", "delai_effet_mesurable",
        "critere_acceptation", "hypothese_structurante", "axe_execution",
        "regime_automatisation", "axe_cout", "cout_eur", "trimestre_cible",
        "dependance_de"]

lignes, sn_actions = [], []
for (i, lib, volet, nds, g, cg, e, ce, c, cc, hz, jr, je, crit, hyp, ax, reg, co, eur,
     tri, dep) in A:
    score = round(g * c / e, 2)
    remontee = bool(dep) and score < 2
    lignes.append({"id": i, "action": lib, "volet": volet,
                   "noeuds_couverts": " ".join(map(str, nds)), "gain": g,
                   "cran_gain_cite": cg, "effort": e, "cran_effort_cite": ce,
                   "confiance": c, "cran_confiance_cite": cc, "score": score,
                   "horizon": hz, "delai_realisation": jr,
                   "delai_effet_mesurable": je, "critere_acceptation": crit,
                   "hypothese_structurante": hyp, "axe_execution": ax,
                   "regime_automatisation": reg, "axe_cout": co, "cout_eur": eur,
                   "trimestre_cible": tri, "dependance_de": dep or ""})
    sn_actions.append({"id": i, "libelle": lib, "volet": volet, "noeuds_couverts": nds,
                       "gain": g, "cran_gain_cite": cg, "effort": e, "cran_effort_cite": ce,
                       "confiance": c, "cran_confiance_cite": cc, "score": score,
                       "horizon": hz, "delai_realisation_jours": jr,
                       "delai_effet_mesurable_jours": je, "critere_acceptation": crit,
                       "hypothese_structurante": hyp, "axe_execution": ax,
                       "regime_automatisation": reg, "axe_cout": co,
                       "cout": None, "trimestre_cible": tri, "dependance_de": dep,
                       "remontee_par_dependance": remontee,
                       "statut_execution": "non-demarree", "effet_constate": None})

lignes.sort(key=lambda l: -l["score"])
sn_actions.sort(key=lambda a: -a["score"])

# Séparateur VIRGULE, imposé par le lecteur : rapport_html.py ouvre le fichier avec
# csv.DictReader(f) sans argument de délimiteur. Écrit en points-virgules, chaque ligne
# était lue comme un champ unique et les dix actions sortaient intégralement en « n/d »,
# sans que rien ne le signale — le rapport s'imprimait vide et se disait complet.
csv_p = LIV / f"actions-{DOM}-{JOUR}.csv"
with csv_p.open("w", encoding="utf-8-sig", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=COLS)
    w.writeheader(); w.writerows(lignes)

# ── nœuds relus des fiches ───────────────────────────────────────────────────
sn_noeuds = []
for n in MAN:
    t = (M / "analyse" / n["chemin"] / "_fiche.md").read_text(encoding="utf-8")
    g = lambda k: (re.search(rf"^{k}: (.*)$", t, re.M) or [None, ""])[1].strip()
    sn_noeuds.append({
        "id": n["id"], "branche": n["branche"], "noeud": n["noeud"], "volet": n["volet"],
        "statut": n["statut"], "verdict": g("verdict") if g("verdict") != "null" else None,
        "motif_non_mesure": (g("motif_hors_perimetre").strip('"')
                             if g("motif_hors_perimetre") not in ("null", "") else None),
        "mesures": [], "actions_liees": re.findall(r"A\d+", g("actions_liees"))})

snap = {
 # Le schéma impose désormais la constante 1.1.0. Les parties « noeuds », « pages »,
 # « perimetre » et « dette_instrumentation » écrites ici sont ensuite RÉGÉNÉRÉES par
 # scripts/livrables.py depuis les fiches et le crawl ; seules les parties de jugement —
 # cible, sensibilité, maturité, sources, actions — sont conservées telles quelles.
 "schema_version": "1.1.0",
 "run": {"date": "2026-08-08", "domaine": DOM, "url": "https://www." + DOM,
         "marque": "Produit-02", "modele_acquisition": "local",
         "marche": {"pays": "France", "langue": "fr"}, "audience_livrable": "dirigeant",
         "concurrents": ["domainedelabesnerie.com", "gite-romantique-spa-bretagne.com",
                         "La Maison Saint-Leonard (Vains)", "hotel-mont-saint-michel.com",
                         "Hotel Ariane & Spa (Avranches)"],
         "snapshot_precedent": None},
 "perimetre": {"pages_decouvertes": 286, "pages_echantillonnees": 79,
   "methode_echantillonnage":
     "crawl exhaustif en suivant les liens depuis l'accueil, plafond de 80 pages atteint à "
     "79 ; les 208 URLs restantes du sitemap ne reçoivent aucun lien entrant et ont été "
     "vérifiées par échantillon de 10, toutes en HTTP 200",
   "rendu_js_detecte": False, "gabarits_affectes_rendu_js": [],
   "plafond_run": {"fetches_max": 80, "fetches_consommes": 158,
                   "recherches_max": 25, "recherches_consommees": 5}},
 # Clés imposées par le rapport : `disponible`, `periode_debut`, `periode_fin`, `note`.
 # Nommées `fourni` / `periode` / `reserve`, elles étaient lues comme absentes et le
 # rapport déclarait « non » sur trois sources pourtant exploitées de bout en bout.
 "sources": {
   "gsc": {"disponible": True, "periode_debut": "2025-04-07", "periode_fin": "2026-08-06",
           "note": "onglet Requêtes plafonné à 1 000 lignes, soit 28 % des clics ; "
                   "rapport d'indexation des pages non fourni, faute d'accès administrateur"},
   "ga": {"disponible": True, "periode_debut": "2025-04-07", "periode_fin": "2026-08-06",
          "note": "379 112 sessions dont 87 % de trafic publicitaire invalide ; premier pays "
                  "émetteur DZ à 51,1 % des utilisateurs, France 6,5 %. Aucune moyenne de "
                  "comportement n'en est exploitable."},
   "crm": {"disponible": True, "periode_debut": "2023-11-01", "periode_fin": "2026-10-31",
           "note": "1 337 séjours, valeur nette d'une réservation directe connue ; aucun "
                   "rapprochement entre une session web et une réservation"},
   "logs_serveur": {"disponible": False,
                    "note": "hébergement mutualisé derrière Cloudflare, logs non ouverts"},
   "index_backlinks": {"disponible": False, "note": "aucun outil de netlinking souscrit"},
   "source_volume": {"disponible": False,
                     "note": "aucun outil de volume ; les impressions GSC servent de proxy"}},
 # Le schéma nomme la clé `cle` et refuse tout champ inconnu — `nom` faisait échouer les
 # douze métriques, et `jours` la période. `source` est exigée pour T2 et T3.
 "baseline": {"periode": {"debut": "2025-04-07", "fin": "2026-08-06"},
   "metriques": [
     {"cle": "clics organiques", "valeur": 3352, "unite": "clics sur 487 jours",
      "preuve": "T2", "source": SRC_GSC},
     {"cle": "impressions", "valeur": 164393, "unite": "impressions sur 487 jours",
      "preuve": "T2", "source": SRC_GSC},
     {"cle": "CTR moyen", "valeur": 2.04, "unite": "%", "preuve": "T2", "source": SRC_GSC},
     {"cle": "CTR hors marque en première page", "valeur": 1.55, "unite": "%",
      "preuve": "T2", "source": SRC_GSC},
     {"cle": "position moyenne pondérée", "valeur": 21.62, "unite": "position",
      "preuve": "T2", "source": SRC_GSC},
     {"cle": "position médiane sur requêtes géolocalisées", "valeur": 37.0,
      "unite": "position", "preuve": "T2", "source": SRC_GSC},
     {"cle": "part de l'accueil dans les clics", "valeur": 82.1, "unite": "%",
      "preuve": "T2", "source": SRC_GSC},
     {"cle": "pages à zéro clic", "valeur": 202, "unite": "pages sur 255",
      "preuve": "T2", "source": SRC_GSC},
     {"cle": "requêtes à plus de 100 impressions et zéro clic", "valeur": 130,
      "unite": "requêtes, 30 840 impressions", "preuve": "T2", "source": SRC_GSC},
     {"cle": "pages du sitemap sans lien entrant", "valeur": 208, "unite": "pages sur 286",
      "preuve": "T1"},
     {"cle": "titres dupliqués", "valeur": 45, "unite": "pages pour 10 titres",
      "preuve": "T1"},
     {"cle": "méta-descriptions distinctes", "valeur": 2, "unite": "pour 79 pages",
      "preuve": "T1"},
     {"cle": "part du trafic publicitaire invalide", "valeur": 86.82, "unite": "%",
      "preuve": "T2", "source": SRC_GA4},
     {"cle": "part de l'organique dans les sessions", "valeur": 2.0, "unite": "%",
      "preuve": "T2", "source": SRC_GA4},
     {"cle": "sessions AI Assistant", "valeur": 100, "unite": "sessions",
      "preuve": "T2", "source": SRC_GA4}]},
 "pages": [], "noeuds": sn_noeuds,   # `pages` est rempli juste après, depuis le crawl
 "cible": {"calculable": True, "motif_non_calculable": None,
   "horizons": [
     {"echeance_mois": 12, "indicateur": "clics organiques annuels", "unite": "clics",
      "borne_basse": 3200, "borne_haute": 3940,
      "calcul": "base de 2 514 clics par an pour 123 000 impressions par an et un CTR de "
                "2,04 % [T2]. À impressions constantes, un CTR porté à 2,6 % donne "
                "3 200 clics (+686) ; porté à 3,2 %, il donne 3 940 clics (+1 426). Aucun "
                "gain de position n'est supposé.", "preuve": "T4"},
     {"echeance_mois": 12, "indicateur": "chiffre d'affaires net supplémentaire",
      "unite": "EUR", "borne_basse": 1500, "borne_haute": 9300,
      "calcul": "clics supplémentaires (686 à 1 426) × taux de transformation supposé "
                "(0,5 % à 1,5 %, non mesuré faute d'événement GA4) × 434 € de valeur nette "
                "moyenne d'une réservation directe [T2]. Borne basse : 686 × 0,5 % × 434 = "
                "1 488 €. Borne haute : 1 426 × 1,5 % × 434 = 9 283 €.", "preuve": "T4"},
     {"echeance_mois": 24, "indicateur": "clics organiques annuels", "unite": "clics",
      "borne_basse": 3400, "borne_haute": 4300,
      "calcul": "cible à 12 mois augmentée du gain de position sur les 45 requêtes à portée "
                "(position 11-30, 19 576 impressions sur 16 mois, soit environ 14 700 par "
                "an [T2]) : amener un quart de ce volume en position 10-15, où le CTR usuel "
                "se situe entre 1,5 % et 3 %, ajoute 55 à 110 clics par an, cumulé sur "
                "quatre pages.", "preuve": "T4"}],
   "jalons_observables": [
     {"libelle": "CTR moyen Search Console", "valeur_actuelle": "2,04 %",
      "valeur_cible": "2,6 à 3,2 %", "echeance_mois": 3},
     {"libelle": "pages à zéro clic", "valeur_actuelle": "202 sur 255",
      "valeur_cible": "moins de 120 sur 255", "echeance_mois": 12},
     {"libelle": "pages du sitemap sans lien entrant", "valeur_actuelle": "208",
      "valeur_cible": "0", "echeance_mois": 6},
     {"libelle": "note TripAdvisor", "valeur_actuelle": "2,0 sur 5 pour 8 avis",
      "valeur_cible": "4,0 ou plus pour au moins 25 avis", "echeance_mois": 12},
     {"libelle": "taux de transformation visite vers réservation",
      "valeur_actuelle": "non mesurable", "valeur_cible": "mesuré sur 90 jours consécutifs",
      "echeance_mois": 6}],
   "sensibilite": [
     {"hypothese": "le taux de transformation visite vers réservation se situe entre 0,5 % "
                   "et 1,5 %",
      "effet_si_fausse":
        "à 0,25 %, la borne basse du gain à 12 mois tombe à environ 740 € et le "
        "référencement ne couvre plus que 2,5 % du déficit d'exploitation ; à 3 %, la borne "
        "haute atteint environ 18 600 €. L'amplitude est donc d'un facteur 25 entre les "
        "extrêmes, et c'est la variable la plus fragile de toute la projection.",
      "plus_fragile": True},
     {"hypothese": "les impressions restent stables à 123 000 par an",
      "effet_si_fausse":
        "elles reculent déjà de 11,0 % d'une moitié de période à l'autre [T2] ; si le rythme "
        "se poursuit, la base de calcul du levier de CTR perd environ 13 500 impressions par "
        "an, soit une centaine de clics sur la cible haute.",
      "plus_fragile": False},
     {"hypothese": "la réécriture des balises améliore effectivement le taux de clic",
      "effet_si_fausse":
        "l'état de départ étant « Tarifs », « Inclus » et « spa », le risque est faible ; "
        "mais le levier est plafonné : sans gain de position, le CTR ne dépassera pas "
        "durablement 3,5 %.",
      "plus_fragile": False},
     {"hypothese": "la note publique de 2 sur 5 ne dissuade ni le clic ni la réservation",
      "effet_si_fausse":
        "si elle dissuade, tout gain de trafic issu de A1 et A2 est amorti à la conversion, "
        "et A10 devient le prérequis de toute la trajectoire alors que son score la place en "
        "backlog. Le barème, qui note le gain sur le registre du trafic, ne sait pas "
        "exprimer cet effet.",
      "plus_fragile": True}]},
 "actions": sn_actions,
 "maturite": {"score": 1, "justification":
   "Aucun cycle SEO ne tourne sans impulsion externe : aucune tâche agentifiée (nœud 63), "
   "aucune alerte de surveillance (65), aucun événement de conversion (71), aucun mécanisme "
   "de détection d'opportunités (67), aucune boucle mesurer-agir-remesurer documentée (77). "
   "Seul point d'appui : la capacité d'audit en série, créée pendant ce run à coût nul (64), "
   "et une compétence technique interne réelle, attestée par un pipeline de données de "
   "1 337 séjours contrôlé par 78 vérifications."},
 "dette_instrumentation": [],   # rempli juste après, depuis les fiches
}

# La dette se déduit des fiches plutôt que de se ressaisir : toute ligne écrite à la main
# finirait par diverger des nœuds réellement hors périmètre. Les nœuds écartés par le
# modèle d'acquisition et les renvois de doublon n'en font pas partie — il n'y a rien à
# obtenir pour les lever.
A_OBTENIR = {
 3: "outil de volume et de valeur de requête — 0 à 100 €/mois",
 6: "outil de volume de recherche — 0 à 100 €/mois",
 7: "imputation analytique du coût d'acquisition, inexistante aujourd'hui",
 9: "indice de difficulté d'un outil SEO — 100 à 200 €/mois",
 10: "horodatage publication / premier revenu, impossible sans événement de conversion",
 29: "accès aux logs serveur ou au journal Cloudflare — coût nul si l'hébergeur l'ouvre",
 34: "rapport d'indexation des pages de Search Console — accès administrateur, coût nul",
 35: "rapport d'indexation, même accès que le nœud 34 — coût nul",
 36: "rapport d'indexation, même accès que le nœud 34 — coût nul",
 38: "index de liens entrants — 100 à 200 €/mois",
 40: "index de liens entrants, même outil que le nœud 38",
}
DEFAUT = "source déclarée dans la fiche — voir la colonne Motif"
snap["dette_instrumentation"] = [
    {"noeud_id": n["id"], "motif": (n["motif_non_mesure"] or "").strip(),
     "a_obtenir": A_OBTENIR.get(n["id"], DEFAUT),
     "date_premiere_constatation": "2026-08-08"}
    for n in sn_noeuds
    # Le critère est le MOTIF hors-périmètre, pas le verdict : les nœuds 79 et 80 sont
    # « sans-objet » parce qu'un site distinct et un investissement média ont été examinés
    # puis écartés avec argument. Ce sont des décisions, pas des mesures manquantes.
    if n["motif_non_mesure"] and n["statut"] != "RV"
    and "modele d'acquisition" not in n["motif_non_mesure"]
    and "modèle d'acquisition" not in n["motif_non_mesure"]
]

# ── pages[] : projection du crawl officiel ───────────────────────────────────
# Normalement produite par scripts/livrables.py. Cet assemblage est fait ici parce que
# livrables.py refuse d'écrire : sa fonction dette() reprend l'identifiant du nœud tel
# que lu dans le front-matter, donc une CHAÎNE, là où le schéma exige un entier — le
# même piège que noeuds_snapshot() évite ligne 75 par un int() explicite. Toute étude
# comportant au moins un nœud hors périmètre est bloquée. Défaut signalé, non corrigé
# ici : le dépôt forge-seo n'est pas le nôtre.
CRAWLS = sorted((M / "donnees" / "crawl").glob("crawl-*.json"))
if CRAWLS:
    cr = json.loads(CRAWLS[-1].read_text(encoding="utf-8"))
    CHAMPS = ("url", "type_gabarit", "profondeur_clic", "code_http", "title", "h1",
              "canonical", "indexable", "liens_internes_entrants", "poids_ko", "preuve")
    snap["pages"] = [{k: p[k] for k in CHAMPS if k in p} for p in cr["pages"]]
    snap["perimetre"]["pages_echantillonnees"] = cr["synthese"]["pages_crawlees"]
    # `pages_decouvertes` reste à 286 et non aux 79 URLs vues par le crawler : celui-ci
    # ne lit pas le sitemap, et s'aligner sur son compte ferait disparaître du rapport
    # les 208 pages orphelines — soit 73 % du site.
    snap["perimetre"]["pages_decouvertes"] = 286
    snap["perimetre"]["rendu_js_detecte"] = cr["collecte"].get("rendu_javascript", False)

snap_p = LIV / f"snapshot-{DOM}-{JOUR}.json"
snap_p.write_text(json.dumps(snap, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")

print(f"{len(lignes)} actions -> {csv_p.name}")
for l in lignes:
    t = "RETENUE" if l["score"] >= 6 else ("backlog" if l["score"] >= 2 else "sous le trait")
    print(f"   {l['id']:>3}  score {l['score']:>5}  G{l['gain']} E{l['effort']} "
          f"C{l['confiance']}  {t:14} {l['horizon']:12} {l['action'][:44]}")
print(f"\n{len(sn_noeuds)} nœuds -> {snap_p.name}")
print(f"dette d'instrumentation : {len(snap['dette_instrumentation'])} lignes")
