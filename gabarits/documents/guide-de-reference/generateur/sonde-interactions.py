#!/usr/bin/env python3
"""sonde-interactions.py — gd-guide-de-reference : les composants MARCHENT, pas seulement se forment.

Les oracles du socle jugent le marquage (check_html.py) et le rendu (render_page.py) ; aucun ne
clique. Cette sonde joue chaque composant de la famille dans un vrai navigateur, sur n'importe quel
guide produit par construire-guide.py : elle DÉRIVE ses cibles de la page (vues, dernier chapitre,
tableau filtrable, ligne dépliable, codes cités, terme présent dans deux vues) au lieu de les
connaître d'avance.

Usage : python sonde-interactions.py <page.html> [--terme mot]
Exit 0 : toutes les assertions tiennent · 1 : au moins une échoue · 2 : Playwright absent (dit).
Une assertion sans matière dans la page (aucune ligne dépliable, aucun code cité) est SANS OBJET,
et elle le dit — elle ne passe pas en silence.

Dépendance : playwright pour Python (celle de render_page.py du socle), Chromium installé.
"""
import argparse
import sys
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("playwright absent : la sonde n'a PAS tourné (pip install playwright ; playwright install chromium)")
    sys.exit(2)

TERME_JS = """() => {
  // Un mot d'au moins 7 lettres présent dans DEUX vues au moins : la recherche doit les nommer.
  const parVue = {};
  document.querySelectorAll('#contenu [data-vue]').forEach(v => {
    const mots = new Set((v.textContent.toLowerCase().match(/[a-zàâäéèêëîïôöùûüç]{7,}/g) || []));
    mots.forEach(m => { parVue[m] = (parVue[m] || 0) + 1; });
  });
  const communs = Object.keys(parVue).filter(m => parVue[m] >= 2).sort();
  return communs.length ? communs[Math.floor(communs.length / 2)] : '';
}"""


def main():
    a = argparse.ArgumentParser()
    a.add_argument("page")
    a.add_argument("--terme", default="")
    args = a.parse_args()
    uri = Path(args.page).resolve().as_uri()
    res = []

    def verifier(nom, condition, mesure=""):
        res.append(("PASS" if condition else "FAIL", nom, mesure))

    def sans_objet(nom, motif):
        res.append(("SANS_OBJET", nom, motif))

    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_context(viewport={"width": 1600, "height": 1000}).new_page()
        erreurs = []
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.goto(uri)
        pg.wait_for_load_state("load")
        vues = pg.eval_on_selector_all('nav.vues a[href^="#vue-"]', "as => as.map(a => a.getAttribute('href').slice(5))")
        actives = lambda: pg.eval_on_selector_all(".vue.active", "els => els.map(e => e.dataset.vue)")
        montrer = lambda cle: (pg.click('nav.vues a[href="#vue-%s"]' % cle), pg.wait_for_timeout(200))

        # Coquille multi-vues.
        verifier("une seule vue peinte au chargement, la première", actives() == vues[:1], str(actives()))
        courant = pg.eval_on_selector('nav.vues a[aria-current="page"]', "a => a.getAttribute('href')")
        verifier("l'onglet courant porte aria-current", courant == "#vue-" + vues[0], courant)
        hh = pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--hh').trim()")
        verifier("la hauteur du bandeau est mesurée et publiée (--hh)", hh.endswith("px") and hh != "128px", hh)
        if len(vues) >= 2:
            montrer(vues[1])
            verifier("cliquer un onglet affiche sa vue", actives() == [vues[1]], str(actives()))
        else:
            sans_objet("cliquer un onglet affiche sa vue", "une seule vue")

        # Adresse profonde + menu latéral, sur le DERNIER chapitre de la DERNIÈRE vue (le cas limite).
        dernier = pg.evaluate("""() => { const v = [...document.querySelectorAll('#contenu [data-vue]')].pop();
          const c = v ? [...v.querySelectorAll('section.ch')].pop() : null; return c ? c.id : ''; }""")
        if dernier:
            pg.goto(uri + "#" + dernier)
            pg.wait_for_timeout(900)  # le défilement est animé (scroll-behavior: smooth)
            verifier("une adresse profonde ouvre la vue qui porte le chapitre", actives() == [vues[-1]], str(actives()))
            haut = pg.eval_on_selector("#" + dernier, "e => Math.round(e.getBoundingClientRect().top)")
            bas_bandeau = pg.eval_on_selector("header.bandeau", "b => Math.round(b.getBoundingClientRect().bottom)")
            verifier("et amène le chapitre sous le bandeau", bas_bandeau <= haut < 1000, "top %s px, bandeau %s px" % (haut, bas_bandeau))
            marque = pg.eval_on_selector_all(".vue.active nav.chapitres li.toc-s.actif > a", "as => as.map(a => a.getAttribute('href'))")
            verifier("le menu latéral marque ce chapitre, même en fin de page", marque == ["#" + dernier], str(marque))
        else:
            sans_objet("adresse profonde et menu latéral", "aucun chapitre dans la dernière vue")

        # Ligne dépliable.
        ligne = pg.evaluate("""() => { const b = document.querySelector('#contenu button.td-btn[aria-controls]');
          return b ? [b.closest('[data-vue]').dataset.vue, b.getAttribute('aria-controls')] : null; }""")
        if ligne:
            montrer(ligne[0])
            pg.click('.vue.active button.td-btn[aria-controls="%s"]' % ligne[1])
            verifier("un chevron ouvre sa ligne de détail", pg.eval_on_selector("#" + ligne[1], "d => !d.hidden"), ligne[1])
            pg.click('.vue.active button.td-btn[aria-controls="%s"]' % ligne[1])
        else:
            sans_objet("un chevron ouvre sa ligne de détail", "aucune ligne dépliable")

        # Recherche et tableau des résultats.
        terme = args.terme or pg.evaluate(TERME_JS)
        lue = actives()
        if terme:
            pg.fill("#recherche", terme)
            pg.wait_for_timeout(350)
            n = pg.eval_on_selector_all("#recherche-resultats tbody tr", "t => t.length")
            verifier("la recherche ouvre le panneau des résultats", pg.eval_on_selector("#recherche-resultats", "p => !p.hidden") and n >= 1,
                     "« %s » : %s" % (terme, pg.inner_text("#res-resume")))
            nommees = pg.eval_on_selector_all("#recherche-resultats a.res-aller", "as => [...new Set(as.map(a => a.textContent))]")
            verifier("les résultats nomment chaque vue touchée", len(nommees) >= (1 if args.terme else 2), str(nommees))
            verifier("la frappe garde la vue que l'on lisait", actives() == lue, str(actives()))
            pg.click("#recherche-resultats tbody tr:first-child")
            pg.wait_for_timeout(300)
            verifier("un clic sur un résultat cercle son occurrence", pg.eval_on_selector_all("#contenu .find-hit.courant", "m => m.length") == 1)
            verifier("et referme le panneau", pg.eval_on_selector("#recherche-resultats", "p => p.hidden"))
            pg.fill("#recherche", "")
            pg.wait_for_timeout(300)
        else:
            sans_objet("recherche", "aucun mot de 7 lettres partagé par deux vues ; passer --terme")

        # RAF-084 : après une recherche effacée, un filtre de tableau répond encore.
        table = pg.evaluate("""() => { const t = document.querySelector('#contenu table[data-filterable]');
          return t ? t.closest('[data-vue]').dataset.vue : ''; }""")
        if table and terme:
            montrer(table)
            boutons = '.vue.active table[data-filterable] th button'
            nb = pg.eval_on_selector_all(boutons, "b => b.length")
            if nb:
                pg.click(boutons)
                pg.wait_for_timeout(200)
                ouvert = pg.evaluate("[...document.querySelectorAll('.vue.active table[data-filterable] th [aria-expanded]')].some(b => b.getAttribute('aria-expanded') === 'true')")
                verifier("après une recherche effacée, un filtre s'ouvre encore (RAF-084)", ouvert, "%d bouton(s) de filtre" % nb)
                pg.keyboard.press("Escape")
            else:
                verifier("les filtres du tableau sont construits", False, "0 bouton de filtre")
        else:
            sans_objet("filtres après recherche (RAF-084)", "aucun tableau filtrable, ou recherche non jouée")

        # Fenêtre du fichier source.
        if pg.query_selector(".vue.active .lien-source"):
            pg.click(".vue.active .lien-source")
            pg.wait_for_timeout(150)
            verifier("le bouton source ouvre la fenêtre Markdown", pg.eval_on_selector("#modale-source", "m => !m.hidden"))
            pg.click("#md-onglet-brut")
            verifier("« Sans formatage » montre le Markdown brut",
                     pg.eval_on_selector("#md-panneau-brut", "p => !p.hidden") and pg.eval_on_selector("#md-panneau-forme", "p => p.hidden"))
            pg.keyboard.press("Escape")
            focus = pg.evaluate("!!(document.activeElement && document.activeElement.classList.contains('lien-source'))")
            verifier("Échap ferme la fenêtre et rend le focus au bouton", pg.eval_on_selector("#modale-source", "m => m.hidden") and focus)
        else:
            sans_objet("fenêtre du fichier source", "aucun bouton .lien-source dans la vue")

        # Fiche d'un code cité.
        fiche = pg.evaluate("""() => { const a = document.querySelector('#contenu a.code-fiche[data-fiche]');
          return a ? a.closest('[data-vue]').dataset.vue : ''; }""")
        if fiche:
            montrer(fiche)
            pg.click(".vue.active a.code-fiche[data-fiche]")
            pg.wait_for_timeout(150)
            titre = pg.inner_text("#modale-fiche .modale-titre")
            verifier("un code cité ouvre sa fiche", pg.eval_on_selector("#modale-fiche", "m => !m.hidden") and len(titre) > 2, titre)
            pg.keyboard.press("Escape")
        else:
            sans_objet("fiche d'un code cité", "aucun code lié à une fiche")

        # Bascule de thème.
        pg.click(".theme-toggle")
        verifier("la bascule passe au thème sombre et se relibelle",
                 pg.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and "clair" in pg.inner_text(".theme-toggle").lower())

        # Téléphone : résultats en surimpression fixe.
        if terme:
            mob = nav.new_context(viewport={"width": 390, "height": 844}).new_page()
            mob.goto(uri)
            mob.fill("#recherche", terme)
            mob.wait_for_timeout(350)
            pos = mob.eval_on_selector("#recherche-resultats", "p => getComputedStyle(p).position")
            verifier("au téléphone, les résultats s'ouvrent en surimpression fixe", pos == "fixed", pos)
        verifier("aucune erreur de script", not erreurs, "; ".join(erreurs)[:300])
        nav.close()

    for statut, nom, mesure in res:
        print("  [%s] %s%s" % (statut, nom, (" — " + mesure) if mesure else ""))
    echecs = sum(1 for r in res if r[0] == "FAIL")
    print("sonde : %d PASS, %d FAIL, %d SANS_OBJET" % (sum(1 for r in res if r[0] == "PASS"), echecs,
                                                    sum(1 for r in res if r[0] == "SANS_OBJET")))
    return 1 if echecs else 0


if __name__ == "__main__":
    sys.exit(main())
