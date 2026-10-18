"""tableau-de-bord-pilotage-interactions.py — les règles TBI d'oracle-tableau-de-bord-pilotage, jouées
dans Chromium sur une page de la famille gd-tableau-de-bord-pilotage.

LE FAIT (lot Produit-79 20261017c, RP-15 ; étude 20261018a, option O4 décidée le 18/10/2026, D-31 (a)).
Le tableau de bord refait par le produit tenait parce qu'un test d'interactions le RECALCULAIT
indépendamment : trois périodes rejouées, tuiles, totaux et parts recomptés depuis les données. Un
contrôle statique ne voit rien de tout cela : la page calcule dans le navigateur, son HTML ne porte
aucun chiffre. Ce script pilote les commandes globales et recompte, en Python, chaque chiffre que le
moteur de la page affiche — jamais en relisant le moteur.

CE QU'IL JUGE (BLOQUANT, sauf TBI7) :
  TBI1 · à chaque état rejoué (période par défaut, une année, une plage personnalisée, la période
         précédente), chaque tuile vaut le recalcul de son indicateur, sa comparaison aussi ; la
         commande change l'état déclaré de la page (data-tdb-rendu) et son bandeau ;
  TBI2 · un tableau déclaré partition (data-partition="oui") : chaque ligne vaut son recalcul, sa
         ligne de total vaut la somme de ses lignes ET le recalcul du tout, ses parts font 100 % ;
  TBI3 · un entonnoir : chaque étape vaut son recalcul et n'excède jamais la précédente (lot
         20261017c : des sessions rapportées à des clics, un taux de passage au-delà de 100 %, vu à
         l'œil seulement) ;
  TBI4 · le choix de l'objet masque les chapitres des autres objets et recalcule les tuiles ;
  TBI5 · chaque objectif vaut départ × (1 ± taux), son départ son recalcul sur la période déclarée ;
  TBI6 · aucune erreur JavaScript, aucune requête réseau, aucun graphique en erreur, et la
         réinitialisation rend l'état de départ ;
  TBI7 · AVERTISSEMENT seulement : chaque bloc de lecture rend un verdict du vocabulaire fermé. La
         règle de lecture (TF-1856) n'est pas écrite : cette famille ne bloque pas sur la lecture.

CE QU'IL NE JUGE PAS : la vérité des données elles-mêmes (le recalcul part du bloc « tdb-donnees »
de la page) ; la justesse de la prose d'auteur ; le rendu (render_page.py) ; un état que ni les
commandes ni les objets déclarés n'atteignent.

Usage : python -X utf8 oracles/tableau-de-bord-pilotage-interactions.py <page.html>
Sortie : JSON {verdict, findings[], non_juge[]} sur stdout.
Exit : 0 PASS · 1 FAIL · 2 SKIP (playwright ou Chromium absents : le contrôle n'a PAS tourné).
"""
import json
import math
import pathlib
import re
import sys

VOCAB_VERDICT = {"bon", "moyen", "mauvais", "non jugeable"}


def jsround(x):
    """Math.round de JavaScript : demi vers le haut (round() de Python arrondit au pair)."""
    return math.floor(x + 0.5)


def idx(m):
    return int(m[:4]) * 12 + int(m[5:7]) - 1


def decaler(m, n):
    i = idx(m) + n
    return f"{i // 12}-{i % 12 + 1:02d}"


class Calcul:
    """Le recalcul INDÉPENDANT : même contrat que le moteur, écrit sans lui."""

    def __init__(self, donnees):
        self.D = donnees
        self.mois = donnees["mois"]

    def objets(self, sel):
        return [o["id"] for o in self.D["objets"]] if sel == "tout" else [sel]

    def somme(self, serie, part, objets, de, a):
        s = self.D["series"].get(serie)
        if not s or de not in self.mois or a not in self.mois:
            return None
        i0, i1 = self.mois.index(de), self.mois.index(a)
        if i1 < i0:
            return None
        if s.get("partition"):
            parts = [part] if part else [p["id"] for p in self.D["partitions"][s["partition"]]["parts"]]
        else:
            parts = [None]
        tableaux = []
        for p in parts:
            bloc = s["valeurs"].get(p) if p else s["valeurs"]
            for o in objets:
                if isinstance(bloc, dict) and isinstance(bloc.get(o), list):
                    tableaux.append(bloc[o])
        total, vu = 0, False
        for i in range(i0, i1 + 1):
            for t in tableaux:
                x = t[i]
                if isinstance(x, (int, float)) and not isinstance(x, bool) and math.isfinite(x):
                    total += x
                    vu = True
        return total if vu else None

    def valeur(self, ind_id, objets, de, a):
        ind = self.D["indicateurs"].get(ind_id)
        if ind is None:
            return None
        if "ratio" in ind:
            n = self.valeur(ind["ratio"][0], objets, de, a)
            d = self.valeur(ind["ratio"][1], objets, de, a)
            return None if n is None or d is None or d == 0 else n / d
        return self.somme(ind["serie"], ind.get("part"), objets, de, a)

    def comparaison(self, de, a, mode):
        n = idx(a) - idx(de) + 1
        if mode == "precedente":
            cde, ca = decaler(de, -n), decaler(de, -1)
        else:
            cde, ca = decaler(de, -12), decaler(a, -12)
        return cde, ca, (cde in self.mois and ca in self.mois)

    def objectif(self, o, ech):
        dep = self.valeur(o["indicateur"], self.objets(o.get("objet", "tout")), o["depart"]["de"], o["depart"]["a"])
        if dep is None:
            return None, None
        f = 1 - ech["taux"] if o["sens"] == "baisse" else 1 + ech["taux"]
        fmt = self.D["indicateurs"][o["indicateur"]].get("format")
        v = dep * f
        if fmt == "euros2":
            cible = jsround(v * 100) / 100
        elif fmt == "pourcent":
            cible = jsround(v * 10000) / 10000
        else:
            cible = jsround(v)
        return dep, cible


def lire_nombre(t):
    t = (t or "").replace("−", "-").replace(" ", "").replace(" ", "").replace(" ", "")
    t = t.replace("€", "").replace("%", "").replace(",", ".")
    m = re.search(r"-?\d+(?:\.\d+)?", t)
    return float(m.group(0)) if m else None


def proche(a, b, rel=1e-9, absolu=1e-9):
    if a is None or b is None:
        return a is None and b is None
    return abs(a - b) <= max(absolu, rel * max(abs(a), abs(b)))


def affiche_conforme(texte, v, fmt):
    """Le texte affiché porte la valeur recalculée, arrondie selon son format."""
    if v is None:
        return "non mesur" in (texte or "") or "aucune" in (texte or "")
    lu = lire_nombre(texte)
    if lu is None:
        return False
    if fmt == "pourcent":
        return abs(lu - v * 100) <= 0.05 + 1e-6
    if fmt == "euros2":
        return abs(lu - v) <= 0.005 + 1e-6
    return abs(lu - v) <= 0.5 + 1e-6


def v_attr(x):
    return None if x in (None, "") else float(x)


LIRE_PAGE = """() => {
  const q = (s, r) => [...(r || document).querySelectorAll(s)];
  const tuiles = q('.tuile[data-tdb-indicateur]').map(t => ({
    id: t.getAttribute('data-tdb-indicateur'),
    visible: !t.closest('[hidden]'),
    texte: (t.querySelector('.tuile-valeur') || {}).textContent || '',
    v: (t.querySelector('.tuile-valeur') || {getAttribute: () => null}).getAttribute('data-v'),
    cmp: (t.querySelector('.tuile-comparaison') || {getAttribute: () => null}).getAttribute('data-v')
  }));
  const tableaux = q('table[data-tdb-tableau]').map(t => ({
    type: t.getAttribute('data-tdb-tableau'), serie: t.getAttribute('data-tdb-serie'),
    entonnoir: t.getAttribute('data-tdb-entonnoir'), partition: t.getAttribute('data-partition'),
    cols: q('thead th', t).map(th => th.getAttribute('data-tdb-col') || ''),
    lignes: [...t.tBodies[0].rows].map(r => [...r.cells].map(c => ({ v: c.getAttribute('data-v'), t: c.textContent }))),
    pied: t.tFoot && t.tFoot.rows[0] ? [...t.tFoot.rows[0].cells].map(c => ({ v: c.getAttribute('data-v'), t: c.textContent })) : null,
    objectifs: [...t.tBodies[0].rows].map(r => r.getAttribute('data-objectif'))
  }));
  return {
    rendu: document.documentElement.getAttribute('data-tdb-rendu'),
    bandeau: (document.querySelector('[data-periode-lib]') || {}).textContent || '',
    tuiles, tableaux,
    objetsSections: q('section[data-objet]').map(s => ({ id: s.id, liste: s.getAttribute('data-objet'), masque: !!s.hidden })),
    verdicts: q('[data-lecture-de]').map(b => ({ de: b.getAttribute('data-lecture-de'),
      mot: (b.querySelector('[data-tdb-auto="verdict"]') || {getAttribute: () => null}).getAttribute('data-verdict') })),
    erreursGraphes: q('.graphe-erreur, .tdb-erreur[role="alert"]').map(e => e.textContent.slice(0, 120)),
    preReglages: q('[data-commande="periode"] option').map(o => o.value),
    objetsChoix: q('[data-tdb-objet]').map(b => b.getAttribute('data-tdb-objet'))
  };
}"""


def juger(page_html):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return {"verdict": "SKIP", "findings": [], "motif": "module playwright absent : les règles TBI n'ont PAS tourné"}
    f = []

    def ajouter(regle, statut, ou, message):
        f.append({"regle": regle, "statut": statut, "ou": ou, "message": message})

    url = pathlib.Path(page_html).resolve().as_uri()
    try:
        p = sync_playwright().start()
        navigateur = p.chromium.launch()
    except Exception as e:  # Chromium absent : le dire, ne pas conclure
        return {"verdict": "SKIP", "findings": [], "motif": f"Chromium indisponible ({str(e)[:120]}) : les règles TBI n'ont PAS tourné"}
    try:
        pg = navigateur.new_page(viewport={"width": 1440, "height": 1000})
        erreurs, reseau = [], []
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.on("request", lambda r: reseau.append(r.url) if not r.url.startswith(("file:", "data:", "blob:", "about:")) else None)
        pg.goto(url)
        pg.wait_for_timeout(400)
        brut = pg.evaluate("() => (document.getElementById('tdb-donnees') || {}).textContent || ''")
        try:
            D = json.loads(brut)
        except Exception as e:
            ajouter("TBI6", "FAIL", "tdb-donnees", f"données illisibles, aucun recalcul possible : {e}")
            return {"verdict": "FAIL", "findings": f}
        C = Calcul(D)
        fmt_ind = {k: v.get("format", "nombre") for k, v in D["indicateurs"].items()}
        fmt_serie = {k: v.get("format", "nombre") for k, v in D["series"].items()}

        def etat():
            return pg.evaluate(LIRE_PAGE)

        def verifier_etat(lu, attendu, libelle, rendus_vus):
            if lu["rendu"] != attendu:
                ajouter("TBI1", "FAIL", libelle, f"la commande n'a pas recalculé la page : état déclaré « {lu['rendu']} », attendu « {attendu} »")
                return
            de, a, mode, objet = attendu.split("|")
            objets = C.objets(objet)
            cde, ca, dispo = C.comparaison(de, a, mode)
            ecarts = []
            for t in lu["tuiles"]:
                if not t["visible"]:
                    continue
                v = C.valeur(t["id"], objets, de, a)
                ref = C.valeur(t["id"], objets, cde, ca) if dispo else None
                if not proche(v_attr(t["v"]), v):
                    ecarts.append(f"tuile « {t['id']} » : affiche {t['v']}, recalcul {v}")
                elif not affiche_conforme(t["texte"], v, fmt_ind.get(t["id"])):
                    ecarts.append(f"tuile « {t['id']} » : le texte « {t['texte']} » ne porte pas {v}")
                if not proche(v_attr(t["cmp"]), ref):
                    ecarts.append(f"tuile « {t['id']} » : comparaison {t['cmp']}, recalcul {ref} ({cde} à {ca})")
            ajouter("TBI1", "FAIL" if ecarts else "PASS", libelle,
                    "; ".join(ecarts[:4]) + (f" (et {len(ecarts) - 4} autre(s))" if len(ecarts) > 4 else "") if ecarts
                    else f"{sum(1 for t in lu['tuiles'] if t['visible'])} tuile(s) égales au recalcul, comparaison comprise")
            if lu["bandeau"].strip() in rendus_vus:
                ajouter("TBI1", "FAIL", libelle, "le bandeau de période n'a pas changé avec la commande")
            rendus_vus.add(lu["bandeau"].strip())
            # TBI2 — partitions, et tableaux d'objets
            for k, tb in enumerate(lu["tableaux"]):
                if tb["partition"] != "oui" or tb["type"] not in ("partition", "objets"):
                    continue
                ou = f"{libelle} · tableau {k + 1} ({tb['type']} « {tb['serie']} »)"
                if tb["type"] == "partition":
                    s = D["series"][tb["serie"]]
                    lignes = [(p["id"], objets) for p in D["partitions"][s["partition"]]["parts"]]
                else:
                    lignes = [(None, [o]) for o in objets]
                ec = []
                if len(tb["lignes"]) != len(lignes):
                    ec.append(f"{len(tb['lignes'])} ligne(s) pour {len(lignes)} attendue(s)")
                for c, col in enumerate(tb["cols"]):
                    base, _, autre = col.partition(":")
                    serie = autre or tb["serie"]
                    if base not in ("valeur", "part", "comparaison"):
                        continue
                    de_, a_ = (cde, ca) if base == "comparaison" else (de, a)
                    if base == "comparaison" and not dispo:
                        continue
                    attendus = [C.somme(serie, part, objs, de_, a_) for part, objs in lignes]
                    total_att = sum(x for x in attendus if x is not None) if any(x is not None for x in attendus) else None
                    lus = [v_attr(l[c]["v"]) if c < len(l) else None for l in tb["lignes"]]
                    pied = v_attr(tb["pied"][c]["v"]) if tb["pied"] and c < len(tb["pied"]) else None
                    if base in ("valeur", "comparaison"):
                        for i, (x, y) in enumerate(zip(lus, attendus)):
                            if not proche(x, y):
                                ec.append(f"colonne « {col} », ligne {i + 1} : {x} pour {y} recalculé")
                        somme_lignes = sum(x for x in lus if x is not None)
                        if pied is None or not proche(pied, somme_lignes, rel=1e-9, absolu=1e-6):
                            ec.append(f"colonne « {col} » : total {pied} pour une somme des lignes de {somme_lignes}")
                        if not proche(pied, total_att, rel=1e-9, absolu=1e-6):
                            ec.append(f"colonne « {col} » : total {pied} pour un recalcul du tout de {total_att}")
                    else:
                        parts = [x for x in lus if x is not None]
                        if total_att and abs(sum(parts) - 1) > 0.0005:
                            ec.append(f"colonne « {col} » : les parts font {sum(parts) * 100:.2f} %, pas 100 %")
                        if total_att and pied is not None and abs(pied - 1) > 0.0005:
                            ec.append(f"colonne « {col} » : la ligne de total dit {pied * 100:.2f} %")
                ajouter("TBI2", "FAIL" if ec else "PASS", ou, "; ".join(ec[:4]) if ec
                        else "lignes égales au recalcul, total égal à leur somme et au tout, parts à 100 %")
            # TBI3 — entonnoirs
            for k, tb in enumerate(lu["tableaux"]):
                if tb["type"] != "entonnoir":
                    continue
                ent = D["entonnoirs"].get(tb["entonnoir"], {"etapes": []})
                c = tb["cols"].index("valeur") if "valeur" in tb["cols"] else None
                ec = []
                attendus = [C.valeur(e["indicateur"], objets, de, a) for e in ent["etapes"]]
                lus = [v_attr(l[c]["v"]) if c is not None and c < len(l) else None for l in tb["lignes"]]
                for i, (x, y) in enumerate(zip(lus, attendus)):
                    if not proche(x, y):
                        ec.append(f"étape {i + 1} : {x} pour {y} recalculé")
                for i in range(1, len(attendus)):
                    if attendus[i] is not None and attendus[i - 1] is not None and attendus[i] > attendus[i - 1]:
                        ec.append(f"étape {i + 1} « {ent['etapes'][i]['libelle']} » ({attendus[i]:g}) dépasse l'étape précédente "
                                  f"({attendus[i - 1]:g}) : taux de passage de {attendus[i] / attendus[i - 1] * 100:.1f} %, le parcours n'est pas emboîté")
                ajouter("TBI3", "FAIL" if ec else "PASS", f"{libelle} · entonnoir « {tb['entonnoir']} »",
                        "; ".join(ec[:4]) if ec else f"{len(attendus)} étape(s) égales au recalcul, chacune comprise dans la précédente")
            # TBI7 — verdicts des blocs de lecture (AVERTISSEMENT : la règle de lecture n'est pas écrite)
            hors = [v for v in lu["verdicts"] if v["mot"] not in VOCAB_VERDICT]
            if hors:
                ajouter("TBI7", "AVERTISSEMENT", libelle, f"{len(hors)} bloc(s) de lecture sans verdict du vocabulaire fermé : "
                        + ", ".join(f"{v['de']} ({v['mot']})" for v in hors[:4]))

        rendus_vus = set()
        initial = etat()
        defaut = initial["rendu"]
        if not defaut:
            ajouter("TBI6", "FAIL", "page", "le moteur n'a rien rendu : aucun état déclaré (data-tdb-rendu) après le chargement")
            return {"verdict": "FAIL", "findings": f}
        de0, a0, mode0, objet0 = defaut.split("|")
        verifier_etat(initial, defaut, "état de départ", rendus_vus)
        # une année, puis une plage personnalisée, puis la période précédente
        annees = [x for x in initial["preReglages"] if x.startswith("annee-")]
        if annees:
            choix = annees[1] if len(annees) > 1 else annees[0]
            pg.select_option('[data-commande="periode"]', choix)
            pg.wait_for_timeout(150)
            an = choix[len("annee-"):]
            de1 = f"{an}-01" if f"{an}-01" in C.mois else C.mois[0]
            a1 = f"{an}-12" if f"{an}-12" in C.mois else C.mois[-1]
            verifier_etat(etat(), f"{de1}|{a1}|{mode0}|{objet0}", f"période « {choix} »", rendus_vus)
        if len(C.mois) >= 6:
            de2, a2 = C.mois[-6], C.mois[-4]
            pg.select_option('[data-commande="de"]', de2)
            pg.wait_for_timeout(100)
            pg.select_option('[data-commande="a"]', a2)
            pg.wait_for_timeout(150)
            verifier_etat(etat(), f"{de2}|{a2}|{mode0}|{objet0}", f"plage {de2} à {a2}", rendus_vus)
            pg.select_option('[data-commande="comparaison"]', "precedente")
            pg.wait_for_timeout(150)
            verifier_etat(etat(), f"{de2}|{a2}|precedente|{objet0}", f"plage {de2} à {a2}, période précédente", rendus_vus)
        # TBI4 — l'objet
        for obj in [o for o in initial["objetsChoix"] if o != "tout"]:
            pg.click(f'[data-tdb-objet="{obj}"]')
            pg.wait_for_timeout(150)
            lu = etat()
            ec = []
            for s in lu["objetsSections"]:
                doit = obj not in (s["liste"] or "").split()
                if s["masque"] != doit:
                    ec.append(f"chapitre « {s['id']} » ({s['liste']}) {'visible' if not s['masque'] else 'masqué'} pour l'objet {obj}")
            ajouter("TBI4", "FAIL" if ec else "PASS", f"objet « {obj} »", "; ".join(ec) if ec
                    else f"{len(lu['objetsSections'])} chapitre(s) propre(s) à un objet masqué(s) ou montré(s) comme déclaré")
            de_, a_, mode_, _ = lu["rendu"].split("|") if lu["rendu"] else ("", "", "", "")
            verifier_etat(lu, f"{de_}|{a_}|{mode_}|{obj}", f"objet « {obj} »", rendus_vus)
        # TBI5 — objectifs (indépendants des commandes)
        lu = etat()
        for k, tb in enumerate(lu["tableaux"]):
            if tb["type"] != "objectifs":
                continue
            ec, n = [], 0
            ci = {c: tb["cols"].index(c) for c in ("depart", "objectif") if c in tb["cols"]}
            for ligne, cle in zip(tb["lignes"], tb["objectifs"]):
                if not cle or ":" not in cle:
                    ec.append("ligne d'objectif sans identifiant (data-objectif)")
                    continue
                oid, rang = cle.split(":")
                o = next((x for x in D.get("objectifs", []) if x["id"] == oid), None)
                if not o:
                    ec.append(f"objectif « {oid} » absent des données")
                    continue
                dep, cible = C.objectif(o, o["echeances"][int(rang)])
                n += 1
                if "depart" in ci and not proche(v_attr(ligne[ci["depart"]]["v"]), dep):
                    ec.append(f"{cle} : départ {ligne[ci['depart']]['v']} pour {dep} recalculé")
                if "objectif" in ci and not proche(v_attr(ligne[ci["objectif"]]["v"]), cible, rel=1e-12, absolu=1e-9):
                    ec.append(f"{cle} : objectif {ligne[ci['objectif']]['v']} pour {cible} = départ × (1 ± taux)")
            attendu_n = sum(len(o["echeances"]) for o in D.get("objectifs", []))
            if n != attendu_n:
                ec.append(f"{n} objectif(s) rendus pour {attendu_n} déclarés")
            ajouter("TBI5", "FAIL" if ec else "PASS", f"tableau des objectifs {k + 1}", "; ".join(ec[:4]) if ec
                    else f"{n} objectif(s) égaux à départ × (1 ± taux), départs recalculés sur leur période déclarée")
        # TBI6 — réinitialisation et hygiène
        pg.click('[data-commande="reinitialiser"]')
        pg.wait_for_timeout(150)
        fin = etat()
        ajouter("TBI6", "PASS" if fin["rendu"] == defaut else "FAIL", "réinitialisation",
                "l'état de départ est rendu" if fin["rendu"] == defaut else f"état « {fin['rendu']} » après réinitialisation, attendu « {defaut} »")
        hygiene = []
        if erreurs:
            hygiene.append(f"{len(erreurs)} erreur(s) JavaScript : {erreurs[0][:120]}")
        if reseau:
            hygiene.append(f"{len(reseau)} requête(s) réseau : {reseau[0][:120]}")
        if fin["erreursGraphes"]:
            hygiene.append(f"{len(fin['erreursGraphes'])} graphique(s) ou bloc en erreur : {fin['erreursGraphes'][0]}")
        ajouter("TBI6", "FAIL" if hygiene else "PASS", "page", "; ".join(hygiene) if hygiene
                else "aucune erreur JavaScript, aucune requête réseau, aucun graphique en erreur")
    finally:
        navigateur.close()
        p.stop()
    verdict = "FAIL" if any(x["statut"] == "FAIL" for x in f) else "PASS"
    return {"verdict": verdict, "findings": f}


NON_JUGE = [
    "la VÉRITÉ des données : le recalcul part du bloc « tdb-donnees » de la page, il ne remonte pas à la source qui l'a rempli",
    "la prose d'auteur des blocs de lecture (cause, fiabilité, action) : seuls les chiffres et le verdict calculés sont relus",
    "le RENDU (débordements, contrastes, chevauchements) : render_page.py du socle, aux largeurs du socle et dans les deux thèmes",
    "un état que ni les commandes globales ni les objets déclarés n'atteignent : il n'est ni rejoué ni recompté",
]

if __name__ == "__main__":
    if len(sys.argv) < 2 or not pathlib.Path(sys.argv[1]).exists():
        print(json.dumps({"verdict": "SKIP", "findings": [], "motif": "usage : tableau-de-bord-pilotage-interactions.py <page.html>"}, ensure_ascii=False))
        sys.exit(2)
    r = juger(sys.argv[1])
    r["non_juge"] = NON_JUGE
    print(json.dumps(r, ensure_ascii=False))
    sys.exit({"PASS": 0, "FAIL": 1}.get(r["verdict"], 2))
