#!/usr/bin/env python3
"""construire-guide.py — gd-guide-de-reference : UN Markdown tenu à jour → UN fichier HTML à N VUES.

Le générateur de la famille « guide de référence ». Il porte la FORME d'un guide du développeur
remonté par un produit le 24/09/2026 (règle R-57) : vues d'un fichier unique, menu latéral des
chapitres à deux niveaux, chapitres et pas derrière leur gouttière, recherche avec le tableau de
ses résultats, fenêtre du fichier source et fiches des codes cités. La MATIÈRE du guide d'origine
n'est pas ici, et c'est voulu : seule la forme se hisse à la bibliothèque.

Trois usages :
  python construire-guide.py <source.md> [--sortie <page.html>] [--version AAAAMMJJx]
                             [--vues a,b] [--fiches <fiches.json>] [--socle <dossier>]
      construit la page. Sans --sortie : à côté de la source, même nom en .html.
  python construire-guide.py --poser <page.html> --composants coquille-vues.css,coquille-vues.js
      pose UN OU PLUSIEURS composants de la famille dans une page QUELCONQUE (réemploi à la carte) ;
      un bloc déjà posé est remis à sa source.
  python construire-guide.py --constat <page.html> [--socle <dossier>]
      rejoue la parité des blocs posés contre leurs sources : ceux de la famille ET les 4 du socle
      qu'elle embarque (exit 1 si une copie a dérivé, 2 si un bloc n'a pas pu être comparé — le
      verdict dit lesquels et pourquoi). `--self-test` rejoue sa recette à double sens.

La source (format complet dans ../GABARIT.md) :
  - un en-tête `---` de lignes `cle: valeur` : marque, objet, sous_titre, description, version,
    role_destinataire, source_affichee, cle_theme, favicon_lettre, marque_html, anatomie,
    accent, accent_fonce, accent_sombre, accent_fonce_sombre ;
  - `# Titre` (ignoré au rendu : le bandeau porte la marque et l'objet) ;
  - `## Titre — annonce` : une VUE ; juste dessous, facultatif :
    `<!-- vue: cle="demarrer" libelle="Démarrer" annonce="…" inventaire="Cette vue porte …" -->` ;
  - `### Titre` : un CHAPITRE (« 3 — Titre » met 3 dans la pastille ; un titre qui s'ouvre sur un
    `code` met le code) ;
  - un paragraphe qui s'ouvre sur une amorce en gras qui est un titre (« **Installer le poste.** »)
    devient un PAS ; « Vérification », « Attention » et « Exemple de lecture » sont typés ;
  - `<!-- deplier:etapes -->` devant un tableau range chaque pas « Étape N · … » dans la ligne N.

Chaque page est AUTOPORTANTE : aucune requête réseau, styles et scripts embarqués, favicon en data
URI. Les composants du SOCLE (recherche, filtres, lignes dépliables) sont posés par le poseur du
skill digit-ai-page-html ; ceux de la FAMILLE par ce script, scellés par l'empreinte de leur source.

Dépendance : le paquet Python `markdown` (pip install markdown). Node pour le poseur du socle.
"""

import argparse
import hashlib
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
FAMILLE = ICI.parent
COMPOSANTS_DIR = FAMILLE / "composants"
GABARIT_ID = "gd-guide-de-reference"
VERSION_GABARIT = "1.0.0"
SAUT = chr(10)

# Ordre de POSE : les feuilles avant le style de marque (qui les surcharge), les scripts dans
# l'ordre de leurs dépendances — la coquille d'abord, la recherche en dernier (elle lit les vues).
CSS_FAMILLE = ("jetons.css", "bascule-theme.css", "coquille-vues.css", "sommaire-chapitres.css",
               "hierarchie-chapitres.css", "tableaux.css", "modale.css", "recherche-resultats.css")
JS_FAMILLE = ("bascule-theme.js", "coquille-vues.js", "sommaire-chapitres.js", "modale.js",
              "recherche-resultats.js")
COMPOSANTS_SOCLE = "find-in-page.js,table-filters.js,table-filters.css,table-detail.js"
SEUIL_FILTRE = 8   # règle L4 du socle : un tableau parcouru de 8 lignes ou plus porte ses filtres

AMORCE = ("(function(){var c=document.documentElement,cleTheme=c.getAttribute('data-cle-theme')||"
          "'guide-theme',s=null;try{s=localStorage.getItem(cleTheme);}catch(e){}c.setAttribute("
          "'data-theme',s==='dark'?'dark':'light');c.className+=' js';})();")

try:
    import markdown
except ImportError:  # pragma: no cover - dit, jamais tu
    markdown = None


# --------------------------------------------------------------------------- outils de texte

def ardoise(texte):
    remplacements = {"à": "a", "â": "a", "ä": "a", "é": "e", "è": "e", "ê": "e", "ë": "e",
                     "î": "i", "ï": "i", "ô": "o", "ö": "o", "ù": "u", "û": "u", "ü": "u",
                     "ç": "c", "'": "-", "’": "-", "·": "-", "—": "-", "–": "-"}
    bas = texte.lower()
    for source, cible in remplacements.items():
        bas = bas.replace(source, cible)
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", bas)).strip("-")


def sans_balises(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def premiere_phrase(fragment):
    net = re.sub(r"\s+", " ", sans_balises(fragment))
    phrases = re.split(r"(?<=[.!?]) ", net)
    return phrases[0] if phrases else net


def slug_github(titre):
    """L'ancre qu'un hébergeur de dépôt pose sur un titre Markdown — celle qu'écrivent les liens."""
    t = sans_balises(titre).lower().strip()
    t = re.sub(r"[^\w\- ]", "", t, flags=re.U)
    return t.replace(" ", "-")


def decouper_frontmatter(brut):
    brut = brut.replace("\r\n", "\n")
    if not brut.startswith("---\n"):
        return {}, brut
    fin = brut.index("\n---\n", 4)
    meta = {}
    for ligne in brut[4:fin].split("\n"):
        if ":" in ligne and not ligne.startswith((" ", "#")):
            cle, _, valeur = ligne.partition(":")
            meta[cle.strip()] = valeur.strip().strip('"')
    return meta, brut[fin + 5:]


def md(texte):
    return markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"],
                             output_format="html5").convert(texte)


# --------------------------------------------------------------------------- vues

RE_VUE = re.compile(r"^\s*<!--\s*vue:(.*?)-->\s*", flags=re.S)
RE_ATTR = re.compile(r'([a-z_]+)="([^"]*)"')


def decouper_vues(corps):
    """`## Titre — annonce` ouvre une vue ; un commentaire `<!-- vue: … -->` dessous la précise."""
    morceaux = re.split(r"(?m)^## (.+)$", corps)
    vues, cles = [], set()
    for i in range(1, len(morceaux), 2):
        titre, texte = morceaux[i].strip(), morceaux[i + 1]
        attrs = {}
        m = RE_VUE.match(texte)
        if m:
            attrs = dict(RE_ATTR.findall(m.group(1)))
            texte = texte[m.end():]
        tete, _, suite = titre.partition("—")
        libelle = attrs.get("libelle") or tete.strip()
        annonce = attrs.get("annonce") or suite.strip()
        cle = attrs.get("cle") or ardoise(libelle)[:24] or ("vue-%d" % (len(vues) + 1))
        base, n = cle, 2
        while cle in cles:
            cle, n = base + "-" + str(n), n + 1
        cles.add(cle)
        vues.append({"titre": titre, "texte": texte, "cle": cle, "libelle": libelle,
                     "annonce": annonce, "inventaire": attrs.get("inventaire", "")})
    return vues


# --------------------------------------------------------------------------- hiérarchie de lecture

def est_titre_de_pas(texte):
    """Une amorce en gras est-elle un TITRE de pas, ou une mise en exergue ?

    Trois gardes, chacune payée par un cas réel du document source (171 amorces relevées le
    22/09/2026, 70 promues, 26 laissées en gras, relues une par une) : 60 caractères au plus —
    au-delà c'est une phrase en exergue ; une MAJUSCULE initiale — une amorce qui continue la
    phrase commence en minuscule ; une ponctuation de fin OU quatre mots au moins — sans quoi une
    étiquette de valeur (« Forme du nom : … ») passerait pour un titre.
    """
    if not texte or len(texte) > 60:
        return False
    if not texte[:1].isalpha() or not texte[:1].isupper():
        return False
    return texte[-1] in ".?!" or len(texte.split()) >= 4


TYPES_DE_PAS = (("Vérification", "verification", "✓"), ("Exemple de lecture", "exemple", "▸"),
                ("Attention", "attention", "!"))


def typologie_du_pas(texte):
    for amorce, cle, puce in TYPES_DE_PAS:
        if texte.startswith(amorce):
            return cle, puce
    return "", "▸"


def anatomie(corps, champs):
    """Remonte les champs d'ANATOMIE d'une règle en bandeau — seulement si le PREMIER est là.

    Le premier champ est la garde : lui seul distingue un chapitre de règle d'une section où les
    mêmes mots portent sur plusieurs règles à la fois et doivent rester à leur place. Un champ
    peut porter une précision après son gras (« **Niveau : recommandé** *(pratique relevée…)* »).
    """
    if not champs:
        return "", corps
    garde = re.compile(r"<p>\s*<strong>" + re.escape(champs[0]) + r"\s*:\s*(.*?)</strong>(.*?)</p>",
                       flags=re.S)
    m = garde.search(corps)
    if not m:
        return "", corps
    precision = m.group(2).strip()
    # Une valeur isolée dans un badge se lit sans sa question : la règle L3 du socle exige qu'elle
    # porte sa légende — ici, le nom du champ dont elle est la valeur.
    cellules = [(champs[0], '<span class="badge" title="' + html.escape(champs[0] + " de la règle", quote=True)
                 + '">' + m.group(1).strip() + "</span>" + ((" " + precision) if precision else ""))]
    corps = corps.replace(m.group(0), "", 1)
    for etiquette in champs[1:]:
        motif = re.compile(r"<p>\s*<strong>" + re.escape(etiquette) + r"</strong>\s*:?\s*(.*?)</p>",
                           flags=re.S)
        mm = motif.search(corps)
        if mm:
            cellules.append((etiquette, mm.group(1).strip()))
            corps = corps.replace(mm.group(0), "", 1)
    return ('<p class="regle-meta">' + "".join('<span class="meta-i"><b>' + e + "</b> " + v + "</span>"
                                               for e, v in cellules) + "</p>"), corps


def promouvoir_pas(corps, cle_chapitre, vus):
    """Chaque amorce qui est un titre devient un PAS, jusqu'à l'amorce suivante ou la fin du chapitre."""
    motif = re.compile(r"<p>\s*<strong>(.*?)</strong>(.*?)</p>", flags=re.S)

    def suite_continue(reste):
        # Une amorce que la suite CONTINUE par une virgule, un deux-points ou une minuscule est un
        # début de phrase. TF-1516 (01/10/2026) — le deux-points manquait : la garde ne testait que
        # les signes DÉJÀ VUS (virgule, 22/09), pas l'INVARIANT qu'elle protège (le corps d'un pas
        # ne s'ouvre jamais sur une ponctuation). Une amorce en gras suivie d'un deux-points — « **Ce
        # qui…** : les noms, … » — devenait un titre de pas, et son paragraphe s'ouvrait sur
        # « : les noms… » : 6 paragraphes dans le guide servi 20261001b, invisibles de check_html,
        # render_page et des neuf oracles de forge-design, aucun des trois ne jugeant la PROSE.
        net = sans_balises(reste).lstrip()
        return bool(net) and (net[0] in ",;:" or net[0].islower())

    # Une amorce DANS un encadré n'ouvre pas de pas : l'encadré est une unité (5 cas le 22/09).
    encadres = [(m.start(), m.end()) for m in re.finditer(r"<blockquote>.*?</blockquote>", corps, flags=re.S)]
    coupes = [m for m in motif.finditer(corps)
              if est_titre_de_pas(sans_balises(m.group(1))) and not suite_continue(m.group(2))
              and not any(d <= m.start() < f for d, f in encadres)]
    if not coupes:
        return corps, []
    sortie, entrees, curseur = [], [], 0
    for i, m in enumerate(coupes):
        fin = coupes[i + 1].start() if i + 1 < len(coupes) else len(corps)
        sortie.append(corps[curseur:m.start()])
        texte = sans_balises(m.group(1)).rstrip(" .:")
        base = cle_chapitre + "-pas-" + ardoise(texte)
        ident, n = base, 2
        while ident in vus:
            ident, n = base + "-" + str(n), n + 1
        vus.add(ident)
        cle_type, puce = typologie_du_pas(texte)
        reste = m.group(2).strip()
        corps_pas = (("<p>" + reste + "</p>") if reste else "") + corps[m.end():fin]
        if cle_type == "exemple":
            # La classe que la règle L10 attend se pose sur le PARAGRAPHE, jamais sur la section.
            corps_pas = corps_pas.replace("<p>", '<p class="exemple-lecture">', 1)
        apres = ""
        if i + 1 == len(coupes):
            # Un encadré qui CLOT le chapitre porte un avertissement de portée générale : il sort du
            # dernier pas et revient au chapitre (décision du 22/09/2026 sur le document source).
            queue = re.search(r"((?:\s*<blockquote>.*?</blockquote>)+)\s*$", corps_pas, flags=re.S)
            if queue:
                apres, corps_pas = queue.group(1), corps_pas[:queue.start()]
        sortie.append('<section class="pas-bloc" id="' + ident + '"'
                      + (' data-type="' + cle_type + '"' if cle_type else "") + ">"
                      + '<h4 class="pas"><span class="puce" aria-hidden="true">' + puce + "</span>"
                      + re.sub(r"\s*\.\s*$", "", m.group(1)) + "</h4>" + corps_pas + "</section>" + apres)
        entrees.append((ident, texte))
        curseur = fin
    sortie.append(corps[curseur:])
    return "".join(sortie), entrees


RE_MARQUEUR_DEPLIER = re.compile(r"<!--\s*deplier:etapes\s*-->\s*(<table>.*?</table>)", flags=re.S)
RE_PAS_BLOC = re.compile(r'<section class="pas-bloc" id="([^"]+)"(?: data-type="([a-z]+)")?>(.*?)</section>',
                         flags=re.S)
RE_TITRE_ETAPE = re.compile(r"^Étape\s+(\d{1,2})\s*·\s*")


def deplier_etapes(corps, pas):
    """Range chaque pas « Étape N · … » — et ses vérifications — dans la ligne N du tableau marqué."""
    m_table = RE_MARQUEUR_DEPLIER.search(corps)
    if not m_table:
        return corps, pas
    textes = dict(pas)
    blocs = list(RE_PAS_BLOC.finditer(corps))
    etapes = {}
    for i, b in enumerate(blocs):
        m_num = RE_TITRE_ETAPE.match(textes.get(b.group(1), ""))
        if not m_num:
            continue
        fin, j = b.end(), i + 1
        while j < len(blocs) and blocs[j].group(2) == "verification" and not corps[fin:blocs[j].start()].strip():
            fin, j = blocs[j].end(), j + 1
        etapes[int(m_num.group(1))] = (b, fin, [x.group(1) for x in blocs[i + 1:j]])
    table = m_table.group(1)
    lignes = re.findall(r"<tr>\s*<td>.*?</tr>", table, flags=re.S)
    numeros = [sans_balises(re.search(r"<td>(.*?)</td>", l, flags=re.S).group(1)) for l in lignes]
    if sorted(numeros) != sorted(str(n) for n in etapes):
        # Un tableau et des pas qui ne se répondent pas un à un sont un défaut de la SOURCE.
        print("deplier:etapes — lignes %s, pas « Étape N » %s : ils doivent se répondre un à un"
              % (numeros, sorted(etapes)), file=sys.stderr)
        raise SystemExit(7)
    absorbes, coupes = set(), []
    for ligne, numero in zip(lignes, numeros):
        b, fin, verifications = etapes[int(numero)]
        ident = b.group(1)
        absorbes.update(verifications)
        interieur = re.sub(r'(<h4 class="pas">(?:<span class="puce"[^>]*>.*?</span>)?)\s*Étape\s+\d{1,2}\s*·\s*',
                           r"\1", b.group(3), count=1)
        detail = interieur + corps[b.end():fin]
        if "<table" in detail:
            print("deplier:etapes — l'étape %s porte un tableau : une ligne de détail n'en porte pas"
                  % numero, file=sys.stderr)
            raise SystemExit(7)
        action = RE_TITRE_ETAPE.sub("", textes[ident])
        bouton = ('<button type="button" class="td-btn" aria-expanded="false" aria-controls="' + ident
                  + '" aria-label="' + html.escape("Détail de l'étape " + numero + " — " + action, quote=True)
                  + '">›</button> ')
        colonnes = len(re.findall(r"<td[\s>]", ligne))
        table = table.replace(ligne, ligne.replace("<td>", "<td>" + bouton, 1) + SAUT
                              + '<tr data-detail id="' + ident + '" hidden><td colspan="' + str(colonnes) + '">'
                              + regrouper_prose(detail) + "</td></tr>", 1)
        coupes.append((b.start(), fin, ""))
    coupes.append((m_table.start(), m_table.end(), table))
    for debut, fin, remplacement in sorted(coupes, reverse=True):
        corps = corps[:debut] + remplacement + corps[fin:]
    restants = [(i, t) for i, t in pas if i not in absorbes]
    restants.sort(key=lambda e: corps.find('id="' + e[0] + '"'))
    return corps, restants


SEPARATEURS_PROSE = re.compile(
    r'(<table>.*?</table>|<hr\s*/?>|<figure class="schema[^"]*"[^>]*>.*?</figure>'
    r'|<section class="pas-bloc"[^>]*>|</section>|<h4 class="pas">.*?</h4>)', flags=re.S)


def regrouper_prose(corps):
    """La prose consécutive va dans une colonne de lecture DÉCLARÉE (`.chap.lire`)."""
    morceaux = []
    for fragment in SEPARATEURS_PROSE.split(corps):
        if not fragment.strip() or SEPARATEURS_PROSE.fullmatch(fragment):
            morceaux.append(fragment)
            continue
        morceaux.append('<div class="chap lire" data-colonne-ok>' + fragment + "</div>")
    return "".join(morceaux)


RE_CODE_EN_TETE = re.compile(r"^\s*<code>([^<]{2,40})</code>")
RE_NUM_CHAPITRE = re.compile(r"^\s*(\d{1,2})\s*[—–-]\s*")


def annoter(corps_html, cle_vue, champs_anatomie):
    """Pose ids, chapeaux, pas et anatomies ; rend le corps et le menu latéral à DEUX niveaux."""
    reperes = [(m.start(), m.end(), m.group(1)) for m in re.finditer(r"<h3>(.*?)</h3>", corps_html, flags=re.S)]
    vus, entrees, sortie, curseur = set(), [], [], 0
    for i, (debut, fin_titre, titre) in enumerate(reperes):
        fin = reperes[i + 1][0] if i + 1 < len(reperes) else len(corps_html)
        texte = sans_balises(titre)
        base = cle_vue + "-" + ardoise(texte)
        cle, n = base, 2
        while cle in vus:
            cle, n = base + "-" + str(n), n + 1
        vus.add(cle)
        corps = corps_html[fin_titre:fin]
        annonce = texte
        # Le chapeau est le PREMIER paragraphe substantiel ; jamais le champ de garde de l'anatomie,
        # jamais un paragraphe qui ouvre sur un titre de pas (il le ferait disparaître du menu).
        for chapeau in re.finditer(r"<p>(.*?)</p>", corps, flags=re.S):
            contenu = chapeau.group(1)
            if len(sans_balises(contenu)) < 45:
                continue
            # AUCUN champ d'anatomie n'est un chapeau — pas seulement la garde : pris pour chapeau,
            # « **Source** : … » échappait au bandeau et privait la règle de son énoncé en tête
            # (revue des captures de l'instance, 24/09/2026).
            if any(contenu.lstrip().startswith("<strong>" + c) for c in champs_anatomie):
                continue
            amorce = re.match(r"\s*<strong>(.*?)</strong>(.*)", contenu, flags=re.S)
            if amorce and est_titre_de_pas(sans_balises(amorce.group(1))) \
                    and (sans_balises(amorce.group(2)).lstrip()[:1] or " ") not in ",;":
                continue
            annonce = premiere_phrase(contenu)
            corps = corps[:chapeau.start()] + '<p class="ch-apprend">' + contenu + "</p>" + corps[chapeau.end():]
            break
        meta, corps = anatomie(corps, champs_anatomie)
        corps, pas = promouvoir_pas(corps, cle, vus)
        corps, pas = deplier_etapes(corps, pas)
        m_code = RE_CODE_EN_TETE.match(titre.strip())
        m_num = RE_NUM_CHAPITRE.match(texte)
        titre_affiche = titre
        if m_code:
            pastille, classe = m_code.group(1).split("-")[-1][:8], " code"
        elif m_num:
            pastille, classe = m_num.group(1), ""
            titre_affiche = re.sub(r"^\s*\d{1,2}\s*[—–-]\s*", "", titre.lstrip(), count=1)
        else:
            pastille, classe = str(i + 1), ""
        tete = corps_html[curseur:debut]
        if curseur == 0:
            # Le chapeau de la VUE : sans lui, son lecteur entre dans un chapitre sans savoir où il est.
            for ouverture in re.finditer(r"<p>(.*?)</p>", tete, flags=re.S):
                if len(sans_balises(ouverture.group(1))) < 45:
                    continue
                tete = tete[:ouverture.start()] + '<p class="ch-apprend">' + ouverture.group(1) + "</p>" \
                    + tete[ouverture.end():]
                break
        sortie.append(regrouper_prose(tete))
        corps_rendu = regrouper_prose(corps)
        sortie.append('<section class="ch" id="' + cle + '">' + SAUT
                      + '<div class="ch-tete"><div class="ch-pastille' + classe + '" aria-hidden="true">'
                      + html.escape(pastille) + '</div><div class="ch-titres"><h3>' + titre_affiche + "</h3>"
                      + meta + "</div></div>"
                      + '<div class="ch-corps"><div class="ch-rail" aria-hidden="true"></div>' + corps_rendu
                      + "</div></section>" + SAUT)
        curseur = fin
        entrees.append((cle, texte, annonce, pas, slug_github(titre),
                        m_code.group(1) if m_code else "", meta, corps_rendu))
    sortie.append(regrouper_prose(corps_html[curseur:]))
    corps_html = "".join(sortie)
    if re.search(r"<!--\s*deplier:", corps_html):
        print("marqueur deplier:etapes sans tableau qui le suit, ou hors d'un chapitre", file=sys.stderr)
        raise SystemExit(7)
    if not entrees:
        return corps_html, "", []
    lignes = ['<nav class="chapitres" aria-label="Chapitres de cette vue"><p class="toc-titre">Dans cette vue</p><ol>']
    for cle, texte, annonce, pas, *_ in entrees:
        sous = ""
        # Un « Exemple de lecture » est un mode d'emploi de SON tableau, pas un pas du chapitre : au
        # menu, il répétait la même entrée sous chaque chapitre à tableau (revue du 24/09/2026).
        pas = [(i, t) for i, t in pas if not t.startswith("Exemple de lecture")]
        if pas:
            sous = ('<ol class="toc-n2">' + "".join('<li><a href="#' + ident + '"><span class="toc-t">'
                                                   + html.escape(t) + "</span></a></li>" for ident, t in pas)
                    + "</ol>")
        lignes.append('<li class="toc-s"><a href="#' + cle + '" title="' + html.escape(annonce[:140], quote=True)
                      + '"><span class="toc-t">' + html.escape(texte) + "</span></a>" + sous + "</li>")
    lignes.append("</ol></nav>")
    # Chaque chapitre rend : son ancre, l'ancre qu'un hébergeur de dépôt lui donnerait (pour les
    # liens écrits dans le Markdown), le code qui ouvre son titre s'il en a un, son anatomie et son corps.
    return corps_html, SAUT.join(lignes), [(e[0], e[4], e[5], e[1], e[6], e[7]) for e in entrees]


# --------------------------------------------------------------------------- tableaux

PLAFOND_CARACTERES = 46   # au-delà, une cellule de prose étire le tableau sans gain de lecture
PLANCHER_REM = 7.5
CAR_EN_REM = 0.52
MARGE_CELLULE = 1.8
BOUTON_REM = 1.6


def besoins_de_colonnes(entetes, lignes):
    """Le besoin de chaque colonne, en rem, et si elle est INCOMPRESSIBLE (elle porte du code)."""
    n = len(entetes)
    cellules, dominantes, remplies = [[] for _ in range(n)], [0] * n, [0] * n
    plus_long_code, boutons = [0] * n, [0] * n
    for ligne in lignes:
        for i, cell in enumerate(re.findall(r"<td[^>]*>(.*?)</td>", ligne, flags=re.S)):
            if i >= n:
                break
            texte = sans_balises(cell)
            cellules[i].append(len(texte))
            if 'class="td-btn"' in cell:
                boutons[i] += 1
            codes = [sans_balises(c) for c in re.findall(r"<code[^>]*>(.*?)</code>", cell, flags=re.S)]
            if texte.strip():
                remplies[i] += 1
            if codes:
                plus_long_code[i] = max(plus_long_code[i], max(len(c) for c in codes))
                if sum(len(c) for c in codes) >= 0.6 * max(1, len(texte)):
                    dominantes[i] += 1
    # INCOMPRESSIBLE quand le code est le contenu — la moitié des cellules au moins —, pas quand une
    # phrase cite un code : traiter une prose en identifiant faisait déborder un tableau (17/09).
    code = [remplies[i] > 0 and dominantes[i] * 2 >= remplies[i] for i in range(n)]
    besoins = []
    for i, entete in enumerate(entetes):
        long_max = max(cellules[i]) if cellules[i] else 0
        brut = max(len(sans_balises(entete)), min(long_max, PLAFOND_CARACTERES))
        besoin = brut * CAR_EN_REM + MARGE_CELLULE
        if boutons[i] and boutons[i] == remplies[i]:
            besoin += BOUTON_REM
            code[i] = True
        besoins.append(round(besoin, 1))
    planchers = [round(plus_long_code[i] * CAR_EN_REM + MARGE_CELLULE, 1) if plus_long_code[i] else 0
                 for i in range(n)]
    return besoins, code, planchers


def outiller_tableaux(corps_html, prefixe, compteur):
    """TOUTES les colonnes portent une largeur ; le tableau n'est jamais étiré au-delà de son contenu."""
    def traiter(correspondance):
        compteur["n"] += 1
        table = correspondance.group(0)
        identifiant = prefixe + "-t{:02d}".format(compteur["n"])
        entetes = re.findall(r"<th[^>]*>(.*?)</th>", table, flags=re.S)
        lignes = re.findall(r"<tr>\s*<td.*?</tr>", table, flags=re.S)

        def etiqueter(ligne):
            index = {"i": 0}

            def cellule(m):
                libelle = sans_balises(entetes[index["i"]]) if index["i"] < len(entetes) else ""
                index["i"] += 1
                return '<td data-label="' + html.escape(libelle, quote=True) + '"' + m.group(1)
            return re.sub(r"<td(>|\s)", cellule, ligne)

        for ligne in lignes:
            table = table.replace(ligne, etiqueter(ligne), 1)
        table = re.sub(r"<code>([^<\s/]{4,40})</code>", r'<code class="ident">\1</code>', table)
        rems, dur, planchers = besoins_de_colonnes(entetes, lignes)
        souples = [i for i, d in enumerate(dur) if not d]
        plafond = None if souples else round(sum(rems), 1)
        total = sum(rems) or 1

        def col(i):
            if i not in souples:
                return '<col style="width:%grem">' % rems[i]
            part = round(rems[i] / total * 100, 2)
            if planchers[i]:
                return '<col style="width:max(%g%%, %grem)">' % (part, min(planchers[i], rems[i]))
            return '<col style="width:%g%%">' % part
        colonnes = "".join(col(i) for i in range(len(rems)))
        if colonnes:
            table = table.replace("<thead>", "<colgroup>" + colonnes + "</colgroup><thead>", 1)
        # Le seuil se compte comme le socle le compte : TOUTES les lignes du corps, lignes de détail
        # comprises — six étapes dépliables font douze lignes, et un tableau de douze lignes se filtre.
        filtrable = " data-filterable" if len(re.findall(r"<tr\b[^>]*>\s*<td", table)) >= SEUIL_FILTRE else ""
        retrait = (";--retrait-detail:%grem" % rems[0]) if 'class="td-btn"' in table else ""
        table = table.replace("<table>", '<table id="%s" class="repli-cartes" style="width:100%%%s%s"%s>'
                              % (identifiant, "" if plafond is None else ";max-width:%grem" % plafond,
                                 retrait, filtrable), 1)
        compte = ('<div class="tf-count" data-tf-count-for="' + identifiant + '" aria-live="polite"></div>') \
            if filtrable else ""
        return '<div class="table-hote">' + table + "</div>" + compte
    return re.sub(r"<table>.*?</table>", traiter, corps_html, flags=re.S)


def marquer_pre_de_prose(corps_html):
    """Un bloc de PROSE (ligne > 70 caractères, aucun dessin d'arborescence) se replie."""
    def marquer(m):
        texte = html.unescape(re.sub(r"<[^>]+>", "", m.group(2)))
        if any(c in texte for c in "├└│─"):
            return m.group(0)
        if max((len(x) for x in texte.split(SAUT)), default=0) <= 70:
            return m.group(0)
        return '<pre class="prose"' + m.group(1) + ">" + m.group(2) + "</pre>"
    return re.sub(r"<pre([^>]*)>(.*?)</pre>", marquer, corps_html, flags=re.S)


# --------------------------------------------------------------------------- liens et fiches

def resoudre_liens(corps_html, vues, chapitres, retenues=None):
    """Les ancres écrites pour UN fichier Markdown visent désormais une vue ou un chapitre.

    Sur un ÉCHANTILLON (--vues), un lien vers une vue non rendue serait une ancre MORTE : il est
    dégradé en texte, avec l'infobulle qui dit où la cible se lit.
    """
    par_vue = {}
    for v in vues:
        for ancre in {slug_github(v["titre"]), ardoise(v["titre"].split("—")[0]), v["cle"]}:
            if ancre:
                par_vue[ancre] = v
    par_chapitre = {c[1]: c[0] for c in chapitres}

    def remplacer(m):
        ancre = m.group(1)
        if ancre in par_chapitre:
            return 'href="#' + par_chapitre[ancre] + '"'
        v = par_vue.get(ancre)
        if v is None:
            return m.group(0)
        if retenues is not None and v["cle"] not in retenues:
            return 'data-vue-absente="1"'
        return 'href="#vue-' + v["cle"] + '" title="Aller à la vue « ' + html.escape(v["libelle"], quote=True) + ' »"'
    rendu = re.sub(r'href="#([^"]+)"', remplacer, corps_html)
    return re.sub(r'<a data-vue-absente="1">(.*?)</a>',
                  lambda m: '<span class="vue-absente" title="Vue non rendue dans cet échantillon">'
                            + m.group(1) + "</span>", rendu, flags=re.S)


def degrader_ancres_mortes(page):
    """Un lien interne dont la cible n'existe pas devient du TEXTE : un lien mort ment davantage
    qu'une absence de lien (doctrine du lecteur de source du socle)."""
    ids = set(re.findall(r'\sid="([^"]+)"', page))

    def juger(m):
        cible = html.unescape(m.group(2))
        if not cible or cible in ids:
            return m.group(0)
        return '<span class="lien-sans-cible" title="Cible absente de ce document : ' \
            + html.escape(cible, quote=True) + '">' + m.group(3) + "</span>"
    return re.sub(r'<a\b([^>]*?)href="#([^"]*)"[^>]*>(.*?)</a>', juger, page, flags=re.S)


RE_HORS_LIEN = re.compile(r"(<pre\b.*?</pre>|<h3>.*?</h3>|<a\b[^>]*>.*?</a>)", flags=re.S)


def fiches_du_guide(chapitres):
    """Un chapitre dont le titre s'ouvre sur un code a sa FICHE : ce code, cité ailleurs, l'ouvre.

    La fiche se lit dans la fenêtre sans quitter la vue où le code est cité ; son dernier
    paragraphe mène au chapitre lui-même. Elle est construite depuis les PARTIES du chapitre, au
    moment où il est annoté — jamais relue dans la page par une expression régulière, qu'un pas
    imbriqué couperait à sa première balise fermante.
    """
    fiches = {}
    for ident, _, code, texte, meta, corps, vue in chapitres:
        if not code:
            continue
        fiches[code] = {"titre": texte, "ancre": ident,
                        "meta": ("Vue « " + html.escape(vue) + " »" if vue else "") + ((" · " + meta) if meta else ""),
                        "panneaux": [{"nom": "Chapitre", "html": corps
                                      + '<p class="fiche-aller"><a href="#' + ident + '">Lire ce chapitre dans le document</a></p>'}]}
    return fiches


def lier_codes(corps_html, fiches, cites):
    """Un code cité qui a sa fiche devient un lien — sauf dans un bloc de code, un titre ou un lien."""
    if not fiches:
        return corps_html
    motif = re.compile(r"<code(?: class=\"ident\")?>(" + "|".join(re.escape(c) for c in sorted(fiches, key=len, reverse=True))
                       + r")</code>")

    def lier(m):
        code = m.group(1)
        cites.add(code)
        cible = fiches[code].get("ancre", "")
        return ('<a class="code-fiche" href="#' + cible + '" data-fiche="' + html.escape(code, quote=True)
                + '" title="Ouvrir la fiche de ' + html.escape(code, quote=True) + '">' + m.group(0) + "</a>")
    return "".join(f if RE_HORS_LIEN.fullmatch(f) else motif.sub(lier, f) for f in RE_HORS_LIEN.split(corps_html))


# --------------------------------------------------------------------------- pièces de la page

def sommaire_document(vues):
    """Le sommaire du document, en cartes, sur la vue d'ENTRÉE — là où un lecteur arrive."""
    cartes = "".join('<li><a href="#vue-' + v["cle"] + '"><span class="toc-n">' + str(i + 1) + "</span>"
                     '<span class="toc-t">' + html.escape(v["libelle"]) + '</span><span class="toc-d">'
                     + html.escape(v["annonce"] or v["libelle"]) + "</span></a></li>" for i, v in enumerate(vues))
    n = len(vues)
    return ('<nav class="toc" aria-label="Sommaire du document"><p class="toc-titre">Le document en '
            + str(n) + (" vue" if n < 2 else " vues") + "</p><ol>" + cartes + "</ol></nav>")


def rendre_vue(v, index, vues, compteur, champs_anatomie, source_affichee):
    corps_html = md(v["texte"])
    corps_html = marquer_pre_de_prose(corps_html)
    corps_html, menu, chapitres = annoter(corps_html, v["cle"], champs_anatomie)
    corps_html = outiller_tableaux(corps_html, v["cle"], compteur)
    precedent = ('<a href="#vue-' + vues[index - 1]["cle"] + '">← ' + html.escape(vues[index - 1]["libelle"])
                 + "</a>") if index > 0 else "<span></span>"
    suivant = ('<a href="#vue-' + vues[index + 1]["cle"] + '">' + html.escape(vues[index + 1]["libelle"])
               + " →</a>") if index < len(vues) - 1 else "<span></span>"
    meta = ('<div class="meta"><div><b>Vue</b>' + str(index + 1) + " sur " + str(len(vues)) + "</div>"
            '<div><b>Source tenue à jour</b><button type="button" class="lien-source" data-ouvre-modale="modale-source"'
            ' aria-label="Ouvrir le fichier source ' + html.escape(source_affichee, quote=True) + '">'
            + html.escape(source_affichee) + "</button></div></div>")
    inventaire = ('<div class="chap lire" data-colonne-ok><p class="contenu">' + html.escape(v["inventaire"])
                  + "</p></div>") if v["inventaire"] else ""
    rendu = ('<div class="vue" data-vue="' + v["cle"] + '">\n  <div class="page">\n    '
             + (menu or "<div></div>") + "\n    <main>\n      " + meta
             + '\n      <section class="vue-corps" id="vue-' + v["cle"] + '"><h2 class="titre-vue">'
             + html.escape(v["titre"]) + "</h2>" + inventaire + corps_html + "</section>\n"
             + (sommaire_document(vues) if index == 0 else "")
             + '      <nav class="pagination" aria-label="Vue précédente et suivante">' + precedent + suivant
             + "</nav>\n    </main>\n  </div>\n</div>\n")
    return rendu, chapitres


def construire_modale_source(source_md, source_affichee):
    """La fenêtre du fichier source : deux onglets. Les titres y sont DÉGRADÉS en paragraphes
    stylés (un titre de plus dans l'arbre ferait croire à un chapitre), et ses tableaux déclarent
    leur exemption de filtres : c'est un aperçu, pas un parcours."""
    _, sans_entete = decouper_frontmatter(source_md)
    rendu = md(re.sub(r"<!--.*?-->", "", sans_entete, flags=re.S))
    rendu = re.sub(r"<(/?)h([1-6])>", lambda m: ("</p>" if m.group(1) else '<p class="md-h' + m.group(2) + '">'), rendu)
    rendu = rendu.replace("<table>", '<table data-filterable="off" data-filterable-reason="aperçu du fichier source, non parcouru">')
    # Les ancres du Markdown sont résolues vers leur vue par l'appelant (resoudre_liens), comme
    # dans le corps : un lien qui visait « #contenu » était muet pour la règle L8 et ne menait nulle part.
    nom = html.escape(source_affichee)
    return ('<div class="modale" id="modale-source" hidden><div class="modale-fond" data-fermer></div>'
            '<div class="modale-boite" role="dialog" aria-modal="true" aria-label="Fichier source ' + nom + '">'
            '<div class="modale-tete"><p class="modale-titre">' + nom + '</p>'
            '<div class="modale-onglets" role="tablist" aria-label="Présentation du fichier source">'
            '<button type="button" role="tab" id="md-onglet-forme" data-onglet="forme" aria-controls="md-panneau-forme"'
            ' aria-selected="true">Mise en forme</button>'
            '<button type="button" role="tab" id="md-onglet-brut" data-onglet="brut" aria-controls="md-panneau-brut"'
            ' aria-selected="false">Sans formatage</button></div>'
            '<button type="button" class="modale-fermer" data-fermer>Fermer</button></div>'
            '<div class="modale-corps" id="md-panneau-forme" role="tabpanel" aria-labelledby="md-onglet-forme"'
            ' data-panneau="forme">' + rendu + "</div>"
            '<div class="modale-corps modale-brut" id="md-panneau-brut" role="tabpanel" aria-labelledby="md-onglet-brut"'
            ' data-panneau="brut" hidden><pre>' + html.escape(source_md) + "</pre></div></div></div>")


def construire_modale_fiche():
    return ('<div class="modale" id="modale-fiche" hidden><div class="modale-fond" data-fermer></div>'
            '<div class="modale-boite" role="dialog" aria-modal="true" aria-label="Fiche d\'un code cité">'
            '<div class="modale-tete"><p class="modale-titre">Fiche</p>'
            '<div class="modale-onglets" role="tablist" aria-label="Panneaux de la fiche"></div>'
            '<button type="button" class="modale-fermer" data-fermer>Fermer</button></div>'
            '<p class="fiche-meta" hidden></p><div class="fiche-panneaux"></div></div></div>')


def favicon(couleur, lettre):
    return ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64'"
            " height='64' rx='14' fill='" + couleur.replace("#", "%23") + "'/%3E%3Ctext x='32' y='45'"
            " font-family='Segoe UI,Arial,sans-serif' font-size='40' font-weight='800' fill='white'"
            " text-anchor='middle'%3E" + html.escape(lettre[:1] or "g") + "%3C/text%3E%3C/svg%3E")


RE_HEX = re.compile(r"^#[0-9A-Fa-f]{6}$")


def style_de_marque(meta):
    """Les jetons de la MARQUE du document, posés APRÈS jetons.css : ils le surchargent."""
    clair = [("--accent", meta.get("accent")), ("--accent-fonce", meta.get("accent_fonce"))]
    sombre = [("--accent", meta.get("accent_sombre")), ("--accent-fonce", meta.get("accent_fonce_sombre"))]
    for nom, valeur in clair + sombre:
        if valeur and not RE_HEX.match(valeur):
            print("jeton de marque invalide : %s = %r (attendu #RRGGBB)" % (nom, valeur), file=sys.stderr)
            raise SystemExit(5)
    regles = []
    if any(v for _, v in clair):
        regles.append(":root { " + " ".join("%s: %s;" % (n, v) for n, v in clair if v) + " }")
    if any(v for _, v in sombre):
        regles.append(':root[data-theme="dark"] { ' + " ".join("%s: %s;" % (n, v) for n, v in sombre if v) + " }")
    return ("<style>/* Jetons de la marque du document (en-tête de la source). */\n" + SAUT.join(regles)
            + "\n</style>") if regles else ""


# --------------------------------------------------------------------------- pose des composants

def echapper(texte):
    return re.sub(r"</script", r"<\\/script", texte, flags=re.I)


def empreinte(texte):
    return hashlib.sha256(texte.encode("utf-8")).hexdigest()


def bloc_composant(nom):
    """Le bloc canonique d'un composant de la FAMILLE : ce que --poser pose, mot pour mot."""
    source = (COMPOSANTS_DIR / nom).read_text(encoding="utf-8").replace("\r\n", "\n")
    balise = "style" if nom.endswith(".css") else "script"
    corps = echapper(source) if balise == "script" else source
    return ("<!-- COMPOSANT-GABARIT:DEBUT " + nom + " — copie de " + GABARIT_ID + "/composants/" + nom + ",\n"
            "     posée par generateur/construire-guide.py. NE PAS ÉDITER ICI : la SOURCE fait foi (--constat). -->\n"
            "<" + balise + ' data-composant-gabarit="' + GABARIT_ID + "/" + nom + '" data-empreinte="sha256:'
            + empreinte(source) + '">\n' + corps.rstrip("\n") + "\n</" + balise + ">\n"
            "<!-- COMPOSANT-GABARIT:FIN " + nom + " -->")


RE_BLOC = re.compile(r"<!-- COMPOSANT-GABARIT:DEBUT ([A-Za-z0-9._-]+) .*?<!-- COMPOSANT-GABARIT:FIN \1 -->", flags=re.S)


def poser(page, noms):
    """Pose des composants de la famille dans une page QUELCONQUE ; un bloc déjà posé est remis à sa source."""
    page = page.replace("\r\n", "\n")
    for nom in noms:
        if not (COMPOSANTS_DIR / nom).is_file():
            raise SystemExit("composant inconnu de la famille : %s (disponibles : %s)"
                             % (nom, ", ".join(sorted(p.name for p in COMPOSANTS_DIR.iterdir()))))
        bloc = bloc_composant(nom)
        deja = [m for m in RE_BLOC.finditer(page) if m.group(1) == nom]
        if deja:
            page = page[:deja[0].start()] + bloc + page[deja[0].end():]
            continue
        ancre = "</head>" if nom.endswith(".css") else "</body>"
        i = page.rfind(ancre)
        page = (page[:i] + bloc + SAUT + page[i:]) if i >= 0 else (page.rstrip() + SAUT + bloc + SAUT)
    return page


def constat(page):
    """Chaque bloc posé confronté à sa source : [(nom, 'à jour' | 'PÉRIMÉ' | 'inconnu')].

    Les fins de ligne sont normalisées AVANT la comparaison, des deux côtés : un dépôt extrait avec
    conversion (`core.autocrlf`) rend la page en CRLF, et la même copie, juste octet pour octet
    une fois normalisée, serait déclarée périmée — un faux rouge apprend à ignorer le contrôle.
    """
    page = page.replace("\r\n", "\n")
    etats = []
    for m in RE_BLOC.finditer(page):
        nom = m.group(1)
        if not (COMPOSANTS_DIR / nom).is_file():
            etats.append((nom, "inconnu"))
            continue
        etats.append((nom, "à jour" if m.group(0) == bloc_composant(nom) else "PÉRIMÉ"))
    return etats


# TF-1433 (28/09/2026) — LA PARITÉ NE VOYAIT PAS LE SOCLE QUE LA PAGE EMBARQUE. `constat` ne lit que
# les blocs COMPOSANT-GABARIT de la famille ; toute page du générateur porte AUSSI les 4 blocs
# COMPOSANT-EMBARQUE du socle (COMPOSANTS_SOCLE). Mesuré en intégrant la famille au pilot : le
# squelette du commit 3941463 embarquait find-in-page.js à l'empreinte sha256:108b35a7313c quand le
# socle installé était à sha256:c12d95c744a5, et `--constat` rendait « 13 bloc(s), 0 écart(s) »
# sans un mot des 4 autres. Ces blocs sont désormais confrontés au socle RÉSOLU, par le juge du
# socle lui-même : sa fonction pure `confronterBlocs`, importée par son chemin réel. Aucun format de
# bloc n'est réécrit ici — un second poseur est le défaut même que le socle existe pour éteindre
# (TF-0890). La page lui arrive fins de ligne normalisées, comme aux blocs de la famille : son propre
# `--constat` compare octet pour octet et déclare PÉRIMÉE toute copie d'une page extraite en CRLF.
RE_BLOC_SOCLE = re.compile(r"<!--\s*COMPOSANT-EMBARQUE:DEBUT\s+([A-Za-z0-9._-]+)")
PONT_SOCLE = ("const { confronterBlocs } = await import(process.env.JUGE_DU_SOCLE);"
              "const morceaux = []; for await (const m of process.stdin) morceaux.push(m);"
              "const html = Buffer.concat(morceaux).toString('utf8').split('\\r\\n').join('\\n');"
              "const r = confronterBlocs(html, 'page');"
              "process.stdout.write(JSON.stringify({ ecarts: r.ecarts, ajour: r.ajour }));")
RE_ETAT_SOCLE = ((re.compile(r"^page · ([A-Za-z0-9._-]+)$"), "à jour"),
                 (re.compile(r"^page · ([A-Za-z0-9._-]+) : copie PÉRIMÉE"), "PÉRIMÉ"),
                 (re.compile(r"^page : composant « ([A-Za-z0-9._-]+) » introuvable"), "inconnu"),
                 (re.compile(r"^page : marqueur DEBUT ([A-Za-z0-9._-]+) sans marqueur FIN"), "sans FIN"))


def constat_socle(page, socle):
    """Les blocs du SOCLE embarqués dans la page, confrontés au socle résolu par SON juge.

    Rend (etats, non_compares, motif) : `etats` = [(nom, 'à jour' | 'PÉRIMÉ' | 'inconnu' | 'sans FIN')],
    `non_compares` = les blocs qu'on n'a PAS pu comparer, et pourquoi — jamais tus, jamais comptés à jour.
    """
    page = page.replace("\r\n", "\n")
    noms = RE_BLOC_SOCLE.findall(page)
    if not noms:
        return [], [], ""
    if socle is None:
        return [], noms, "socle digit-ai-page-html introuvable (--socle <dossier>, ou skill installé)"
    juge = Path(os.path.realpath(socle / "scripts" / "embarquer-composants.mjs"))
    # En OCTETS, pas en texte : un tube ouvert en mode texte réécrit chaque saut de ligne en CRLF sous
    # Windows, et le juge du socle déclarait alors PÉRIMÉE une page qu'il venait de poser (mesuré ici).
    try:
        r = subprocess.run(["node", "--input-type=module", "-e", PONT_SOCLE], input=page.encode("utf-8"),
                           capture_output=True, env=dict(os.environ, JUGE_DU_SOCLE=juge.as_uri()))
    except OSError as e:
        return [], noms, "node injoignable, le juge du socle n'a pas été appelé : %s" % e
    try:
        rendu = json.loads(r.stdout.decode("utf-8", errors="replace"))
    except ValueError:
        rendu = None
    if not isinstance(rendu, dict):
        derniere = (r.stderr.decode("utf-8", errors="replace").strip().splitlines() or ["aucune sortie"])[-1]
        return [], noms, "le juge du socle (%s) n'a rien rendu de lisible (exit %s) : %s" % (juge, r.returncode,
                                                                                          derniere[:160])
    restants = {}
    for texte in rendu.get("ajour", []) + rendu.get("ecarts", []):
        for motif, etat in RE_ETAT_SOCLE:
            m = motif.match(texte)
            if m:
                restants.setdefault(m.group(1), []).append(etat)
                break
    etats, non_compares = [], []
    for nom in noms:
        if restants.get(nom):
            etats.append((nom, restants[nom].pop(0)))
        else:
            non_compares.append(nom)
    return etats, non_compares, ("le juge du socle (%s) ne rend aucun état lisible pour ce bloc" % juge
                                 if non_compares else "")


def socle_page_html(explicite=None):
    candidats = [Path(explicite)] if explicite else []
    for racine in (os.environ.get("CLAUDE_CONFIG_DIR"), str(Path.home() / ".claude")):
        if racine:
            candidats.append(Path(racine) / "skills" / "digit-ai-page-html")
    for c in candidats:
        if (c / "scripts" / "embarquer-composants.mjs").is_file():
            return c
    return None


def poser_socle(cible, socle):
    """Pose les composants du socle, puis VÉRIFIE qu'ils sont là.

    Le chemin du poseur est RÉSOLU avant l'appel. Mesuré le 24/09/2026 : appelé par un chemin qui
    traverse une jonction de répertoire (une configuration dont `skills` pointe sur celle d'un
    autre profil), le poseur ne reconnaît pas son propre point d'entrée, ne fait RIEN et sort 0.
    Un code de sortie nul ne prouve donc pas la pose : seul le compte des blocs la prouve.
    """
    poseur = Path(os.path.realpath(socle / "scripts" / "embarquer-composants.mjs"))
    r = subprocess.run(["node", str(poseur), "--poser", str(cible), "--composants", COMPOSANTS_SOCLE],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        print((r.stderr or r.stdout or "").strip(), file=sys.stderr)
        raise SystemExit(r.returncode)
    page = Path(cible).read_text(encoding="utf-8")
    manquants = [n for n in COMPOSANTS_SOCLE.split(",") if "COMPOSANT-EMBARQUE:DEBUT " + n not in page]
    if manquants:
        print("le poseur du socle a rendu 0 sans poser : %s — page non autoportante, construction refusée"
              % ", ".join(manquants), file=sys.stderr)
        raise SystemExit(3)


def rendre_constat(page, socle):
    """Le verdict de --constat : (lignes, code). Il dit ce qu'il a comparé ET ce qu'il n'a pas pu comparer.

    Code : 1 si un bloc comparé a dérivé de sa source ; sinon 2 si un bloc n'a pas pu être comparé
    (socle introuvable, juge du socle muet) — « je n'ai pas tout regardé » a son code, il ne passe
    jamais pour un vert ; 0 si tous les blocs posés sont à la parité de leur source.
    """
    famille = constat(page)
    socle_etats, non_compares, motif = constat_socle(page, socle)
    lignes = ["  [%s] %s" % (etat, nom) for nom, etat in famille]
    lignes += ["  [%s] %s (socle)" % (etat, nom) for nom, etat in socle_etats]
    lignes += ["  [NON COMPARÉ] %s (socle) — %s" % (nom, motif) for nom in non_compares]
    ecarts = sum(1 for _, etat in famille + socle_etats if etat != "à jour")
    poses = len(famille) + len(socle_etats) + len(non_compares)
    parts = ["%d de la famille %s (sources : composants/)" % (len(famille), GABARIT_ID)]
    if socle_etats:
        parts.append("%d du socle digit-ai-page-html (socle résolu : %s)" % (len(socle_etats),
                                                                          Path(os.path.realpath(socle))))
    if non_compares:
        parts.append("%d du socle NON comparé(s) : %s" % (len(non_compares), motif))
    lignes.append("constat : %d bloc(s) posé(s), %d comparé(s) — %s — %d écart(s)%s"
                  % (poses, len(famille) + len(socle_etats), " ; ".join(parts), ecarts,
                     " sur les blocs comparés" if non_compares else ""))
    return lignes, (1 if ecarts else 2 if non_compares else 0)


# --------------------------------------------------------------------------- complétude

def compter_mots_visibles(texte):
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", texte, flags=re.S | re.I)
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.S)
    return len(re.sub(r"<[^>]+>", " ", t).split())


def compter_mots_markdown(texte):
    """Les mots d'une source Markdown, SANS sa syntaxe : un `|` de tableau, une ligne `---|---`, un
    `#` de titre ou une clôture de bloc ne sont pas des mots, et les compter ferait crier la perte
    sur une page qui n'a rien perdu."""
    t = re.sub(r"<!--.*?-->", " ", texte, flags=re.S)
    t = re.sub(r"(?m)^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$", " ", t)
    t = re.sub(r"(?m)^\s*(#{1,6}|>|```\w*|[-*+]|\d+\.)\s", " ", t)
    t = t.replace("|", " ").replace("**", " ").replace("`", " ")
    return len([w for w in t.split() if re.search(r"\w", w)])


def verifier_completude(corps_html, corps_md):
    """Une page qui a PERDU de la prose reste bien formée : aucun oracle de forme ne la voit.

    Le 16/09/2026, une édition du générateur d'origine a supprimé toute la prose sauf le dernier
    fragment de chaque chapitre ; tous les oracles de forme ont rendu PASS sur la page amputée.
    Seul ce compte l'aurait vue : le rendu porte EN PLUS les libellés du générateur, il est donc
    normalement plus riche que sa source — plus pauvre, c'est une PERTE.
    """
    rendu, source = compter_mots_visibles(corps_html), compter_mots_markdown(corps_md)
    if rendu < source:
        print("PERTE DE CONTENU : %d mots rendus pour %d mots de source" % (rendu, source), file=sys.stderr)
        raise SystemExit(4)
    return rendu, source


# --------------------------------------------------------------------------- construction

def construire(chemin_source, sortie=None, version=None, retenues=None, chemin_fiches=None, socle=None):
    if markdown is None:
        raise SystemExit("paquet Python « markdown » absent : pip install markdown")
    source_md = Path(chemin_source).read_text(encoding="utf-8").replace("\r\n", "\n")
    meta, corps = decouper_frontmatter(source_md)
    marque = meta.get("marque") or "Marque"
    objet = meta.get("objet") or "Guide de référence"
    sous_titre = meta.get("sous_titre", "")
    version = version or meta.get("version") or "sans-version"
    source_affichee = meta.get("source_affichee") or Path(chemin_source).name
    champs_anatomie = [c.strip() for c in meta.get("anatomie", "Niveau, Source, Exceptions").split(",") if c.strip()]
    corps = re.sub(r"(?m)^# .+$", "", corps, count=1)
    vues = decouper_vues(corps)
    if not vues:
        raise SystemExit("aucune vue : la source doit porter au moins un titre « ## »")
    if retenues:
        inconnues = [c for c in retenues if c not in [v["cle"] for v in vues]]
        if inconnues:
            raise SystemExit("vue(s) inconnue(s) : %s — disponibles : %s"
                             % (", ".join(inconnues), ", ".join(v["cle"] for v in vues)))
        tout = vues
        vues = [v for v in vues if v["cle"] in retenues]
    else:
        tout = vues

    compteur = {"n": 0}
    rendus, chapitres = [], []
    for i, v in enumerate(vues):
        r, ch = rendre_vue(v, i, vues, compteur, champs_anatomie, source_affichee)
        rendus.append(r)
        chapitres.extend(c + (v["libelle"],) for c in ch)
    garder = set(retenues) if retenues else None
    corps_vues = resoudre_liens("".join(rendus), tout, chapitres, garder)

    fiches = {}
    if chemin_fiches:
        fiches.update(json.loads(Path(chemin_fiches).read_text(encoding="utf-8")))
    fiches.update(fiches_du_guide(chapitres))
    cites = set()
    corps_vues = lier_codes(corps_vues, fiches, cites)
    reference = corps if not retenues else SAUT.join(v["texte"] for v in vues)
    mots_rendus, mots_source = verifier_completude(corps_vues, reference)
    fiches_json = json.dumps({k: {c: fiches[k][c] for c in ("titre", "meta", "panneaux") if c in fiches[k]}
                              for k in sorted(cites)}, ensure_ascii=False)
    fiches_json = fiches_json.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")

    onglets = "".join('<li><a href="#vue-' + v["cle"] + '" title="' + html.escape(v["annonce"], quote=True) + '">'
                      '<span class="toc-t">' + html.escape(v["libelle"]) + "</span></a></li>" for v in vues)
    titre = marque + " — " + objet + (" · " + sous_titre if sous_titre else "") + " — " + version
    accent = meta.get("accent") or "#2563EB"
    marque_html = meta.get("marque_html") or html.escape(marque)
    description = meta.get("description") or (objet + " en " + str(len(vues)) + " vues.")
    cle_theme = meta.get("cle_theme") or (ardoise(marque + "-" + objet)[:40] + "-theme")
    css = SAUT.join(bloc_composant(n) for n in CSS_FAMILLE)
    js = SAUT.join(bloc_composant(n) for n in JS_FAMILLE)
    tete = (
        '<!DOCTYPE html>\n<html lang="fr" data-cle-theme="' + html.escape(cle_theme, quote=True) + '">\n<head>\n'
        '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n'
        "<script>" + AMORCE + "</script>\n"
        "<title>" + html.escape(titre) + "</title>\n"
        '<meta name="description" content="' + html.escape(description, quote=True) + '">\n'
        '<meta name="theme-color" content="' + accent + '">\n<meta name="color-scheme" content="light">\n'
        '<link rel="icon" type="image/svg+xml" href="' + favicon(accent, meta.get("favicon_lettre") or marque[:1].lower())
        + '">\n' + css + "\n" + style_de_marque(meta) + "\n</head>\n")
    # Le CORPS seul passe au crible des ancres mortes : les commentaires des composants embarqués
    # citent des exemples de marquage, et les toucher romprait leur empreinte.
    corps_page = (
        '<body data-largeur="lecture">\n<header class="bandeau">\n  <div class="bandeau-haut" data-colonne-ok>\n'
        '    <h1 class="marque">' + marque_html + "<small>" + html.escape(objet)
        + (" · " + html.escape(sous_titre) if sous_titre else "") + "</small></h1>\n"
        '    <div class="outils">\n      <div class="barre-recherche">\n'
        '        <label for="recherche" hidden>Rechercher dans le document</label>\n'
        '        <input id="recherche" type="search" placeholder="Rechercher dans le document…"'
        ' aria-controls="recherche-resultats" aria-expanded="false">\n'
        '        <div id="rechercheCompte" class="find-count" aria-live="polite"></div>\n      </div>\n'
        '      <button type="button" class="theme-toggle" aria-pressed="false">Thème sombre</button>\n'
        "    </div>\n  </div>\n"
        '  <nav class="vues" aria-label="Vues du document"><ol>' + onglets + "</ol></nav>\n"
        '  <div id="recherche-resultats" class="resultats" role="region" aria-label="Résultats de la recherche" hidden>\n'
        '    <div class="res-tete"><p class="res-resume" id="res-resume"></p>'
        '<button type="button" class="res-fermer">Fermer</button></div>\n    <div class="res-corps"></div>\n  </div>\n'
        "</header>\n"
        '<div class="wrap">\n  <div id="contenu">\n' + corps_vues + "  </div>\n</div>\n"
        + resoudre_liens(construire_modale_source(source_md, source_affichee), tout, chapitres, garder) + "\n"
        + construire_modale_fiche() + "\n"
        '<script type="application/json" id="fiches-donnees">' + fiches_json + "</script>\n"
        '<footer class="pied"><p>' + html.escape(marque) + " · " + html.escape(objet) + ", version " + html.escape(version)
        + ". Source tenue à jour : <code>" + html.escape(source_affichee) + "</code>.</p>"
        "<p>Gabarit : " + GABARIT_ID + " · version du gabarit " + VERSION_GABARIT + "</p></footer>\n")
    page = tete + degrader_ancres_mortes(corps_page) + js + "\n</body>\n</html>\n"
    cible = Path(sortie) if sortie else Path(chemin_source).with_suffix(".html")
    cible.write_text(page, encoding="utf-8", newline="\n")
    racine_socle = socle_page_html(socle)
    if racine_socle is None:
        raise SystemExit("socle digit-ai-page-html introuvable (--socle <dossier>, ou skill installé) : "
                         "la recherche et les filtres n'auraient pas leurs composants")
    poser_socle(cible, racine_socle)
    return cible, len(vues), mots_rendus, mots_source, len(cites)


# --------------------------------------------------------------------------- recette de --constat

def _alterer(page, marqueur, ligne):
    """Insère `ligne` en tête du corps du bloc que `marqueur` ouvre : la copie d'une autre version."""
    debut = page.index(marqueur)
    corps = page.index(">\n", debut) + 2
    return page[:corps] + ligne + "\n" + page[corps:]


def self_test(socle_explicite=None):
    """La parité de --constat dans ses deux sens, sur des pages jetables (TF-1433).

    Rouge : des blocs du socle qu'aucun socle ne juge sont DITS non comparés (exit 2) ; un bloc de la
    famille qui a dérivé reste PÉRIMÉ ; un find-in-page.js d'une autre version que le socle installé
    est PÉRIMÉ (exit 1). Vert : la page posée par le poseur du socle passe, la même en CRLF aussi, et
    la page périmée reposée par ce poseur repasse (exit 0). Sans socle installé, les quatre cas qui le
    posent se déclarent NON JOUÉS dans la forme que lit le cliquet du harnais du pilot (TF-1434).
    """
    import tempfile
    casse, joues, non_joues = [], [0], 0

    def attendre(nom, lignes, code, code_attendu, motif):
        joues[0] += 1
        if code != code_attendu or not re.search(motif, SAUT.join(lignes)):
            casse.append("%s : exit %s (attendu %s), motif « %s » absent — %s"
                         % (nom, code, code_attendu, motif, lignes[-1] if lignes else "aucune ligne"))

    # 0. TF-1516 (01/10/2026) — UNE AMORCE SUIVIE D'UN DEUX-POINTS NE DEVIENT PAS UN PAS, DANS LES
    #    DEUX SENS. Rouge (défaut d'origine, fait reproduit le 01/10) : « **Ce qui differe...** :
    #    les noms, ... » devenait un titre de pas, et son paragraphe s'ouvrait sur « : les noms… »
    #    — 6 cas dans le guide servi du produit, vus par aucun des trois oracles qui le jugent
    #    (check_html, render_page, les neuf oracles de forge-design : aucun ne juge la PROSE). Vert,
    #    la borne : la MÊME forme, sans deux-points, dont la suite commence par une MAJUSCULE, reste
    #    un vrai titre de pas — la garde ne doit pas sur-corriger au point d'avaler les pas réels.
    joues[0] += 2
    corps_deux_points = ('<p><strong>Ce qui differe d un environnement a l autre</strong> : les noms, '
                         'les secrets, et l approbation avant deploiement.</p>')
    corps_apres, pas_deux_points = promouvoir_pas(corps_deux_points, "ch-tf1516", set())
    if pas_deux_points:
        casse.append("TF-1516 : une amorce en gras suivie d'un deux-points devient un titre de pas — %s"
                     % corps_apres[:160])
    if re.search(r"<p>\s*:", corps_apres):
        casse.append("TF-1516 : le paragraphe s'ouvre encore sur un deux-points résiduel — %s" % corps_apres[:160])
    _, pas_reel = promouvoir_pas(
        '<p><strong>Premier geste a faire</strong> Ouvrez le terminal du poste.</p>', "ch-tf1516", set())
    if not pas_reel:
        casse.append("TF-1516 borne : la garde du deux-points empêche aussi un VRAI titre de pas "
                     "(amorce suivie d'une majuscule) de se promouvoir")

    base = poser("<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<title>recette</title>\n</head>\n"
                 "<body>\n<p>recette</p>\n</body>\n</html>\n", ["jetons.css"])
    # 1. ROUGE, jouable partout : des blocs du socle, et aucun socle pour les juger.
    marque = ("<!-- COMPOSANT-EMBARQUE:DEBUT find-in-page.js -->\n<script>//</script>\n"
              "<!-- COMPOSANT-EMBARQUE:FIN find-in-page.js -->\n")
    lignes, code = rendre_constat(base.replace("</body>", marque + "</body>"), None)
    attendre("socle introuvable", lignes, code, 2,
             r"\[NON COMPARÉ\] find-in-page\.js \(socle\)[\s\S]*1 du socle NON comparé")
    # 2. ROUGE, jouable partout : un bloc de la famille qui a dérivé reste PÉRIMÉ.
    lignes, code = rendre_constat(_alterer(base, 'data-composant-gabarit="', "/* autre version */"), None)
    attendre("bloc de la famille dérivé", lignes, code, 1, r"\[PÉRIMÉ\] jetons\.css[\s\S]*1 écart")
    socle = socle_page_html(socle_explicite)
    if socle is None:
        non_joues = 4
        print("[NON JOUÉ] %d cas — construire-guide 3 à 6 (TF-1433) : socle digit-ai-page-html introuvable, "
              "aucun bloc du socle ne peut être posé ni jugé sur ce poste" % non_joues)
    else:
        with tempfile.TemporaryDirectory() as d:
            cible = Path(d) / "page.html"
            cible.write_text(base, encoding="utf-8", newline="\n")
            try:
                poser_socle(cible, socle)
                posee = cible.read_text(encoding="utf-8")
                # 3. VERT : les blocs posés, famille ET socle, sont tous comparés, et à jour.
                lignes, code = rendre_constat(posee, socle)
                attendre("page posée", lignes, code, 0,
                         r"5 bloc\(s\) posé\(s\), 5 comparé\(s\) — 1 de la famille[^;]*; 4 du socle "
                         r"digit-ai-page-html[\s\S]*0 écart")
                # 4. VERT : la même page extraite en CRLF n'est pas un faux rouge.
                lignes, code = rendre_constat(posee.replace("\n", "\r\n"), socle)
                attendre("page en CRLF", lignes, code, 0, r"5 comparé\(s\)[\s\S]*0 écart")
                # 5. ROUGE : un find-in-page.js d'une autre version que le socle installé est PÉRIMÉ.
                ancienne = _alterer(posee, 'data-composant="find-in-page.js"', "// version antérieure au socle")
                lignes, code = rendre_constat(ancienne, socle)
                attendre("bloc du socle d'une autre version", lignes, code, 1,
                         r"\[PÉRIMÉ\] find-in-page\.js \(socle\)[\s\S]*1 écart")
                # 6. VERT : la même page, reposée par le poseur du socle, repasse la parité.
                cible.write_text(ancienne, encoding="utf-8", newline="\n")
                poser_socle(cible, socle)
                lignes, code = rendre_constat(cible.read_text(encoding="utf-8"), socle)
                attendre("page reposée", lignes, code, 0, r"5 comparé\(s\)[\s\S]*0 écart")
            except SystemExit as e:
                casse.append("le poseur du socle a refusé la page de recette (exit %s)" % e.code)
    if casse:
        print("construire-guide --self-test : FAIL" + SAUT + SAUT.join("  - " + c for c in casse))
        return 1
    print("construire-guide --self-test (TF-1433) : %d/%d%s — TF-1516 : une amorce suivie d'un deux-points "
          "ne devient pas un pas et ne laisse pas de deux-points résiduel, la MÊME suivie d'une majuscule "
          "reste un vrai pas ; la parité de --constat dans ses DEUX sens : "
          "blocs du socle non jugés DITS non comparés (exit 2), bloc de la famille dérivé PÉRIMÉ, page posée "
          "par le poseur du socle à jour, en LF comme en CRLF, find-in-page.js d'une autre version PÉRIMÉ "
          "(exit 1) puis à jour une fois reposé"
          % (joues[0], joues[0], (" (+%d NON JOUÉ(S) sur ce poste, déclaré(s) plus haut)" % non_joues)
                                  if non_joues else ""))
    return 0


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("source", nargs="?", help="le Markdown tenu à jour")
    a.add_argument("--sortie", help="la page produite (défaut : à côté de la source)")
    a.add_argument("--version", help="AAAAMMJJ + indice (défaut : champ « version » de l'en-tête)")
    a.add_argument("--vues", default="", help="clés de vues à rendre (échantillon), séparées par des virgules")
    a.add_argument("--fiches", help="fiches JSON des codes cités hors du guide")
    a.add_argument("--socle", help="dossier du skill digit-ai-page-html (défaut : skill installé)")
    a.add_argument("--poser", help="page où poser des composants de la famille")
    a.add_argument("--composants", default="", help="composants à poser, séparés par des virgules")
    a.add_argument("--constat", help="page dont les blocs posés, famille et socle, sont confrontés à leurs sources")
    a.add_argument("--self-test", action="store_true", help="rejoue la recette de --constat (fixtures à double sens)")
    args = a.parse_args()
    if args.self_test:
        return self_test(args.socle)
    if args.constat:
        lignes, code = rendre_constat(Path(args.constat).read_text(encoding="utf-8"), socle_page_html(args.socle))
        print(SAUT.join(lignes))
        return code
    if args.poser:
        noms = [n.strip() for n in args.composants.split(",") if n.strip()]
        if not noms:
            print("--poser exige --composants a.css,a.js", file=sys.stderr)
            return 2
        p = Path(args.poser)
        p.write_text(poser(p.read_text(encoding="utf-8"), noms), encoding="utf-8", newline="\n")
        print("posé(s) dans %s : %s" % (p, ", ".join(noms)))
        return 0
    if not args.source:
        a.print_usage(sys.stderr)
        return 2
    cles = [c.strip() for c in args.vues.split(",") if c.strip()]
    cible, n, rendus, source, cites = construire(args.source, args.sortie, args.version, cles or None,
                                                 args.fiches, args.socle)
    print("écrit : %s — %d vues, %d octets, %d mots rendus pour %d de source, %d code(s) liés à leur fiche"
          % (cible, n, cible.stat().st_size, rendus, source, cites))
    print("RAPPEL : aucune livraison sans les oracles du socle (check_html.py ET render_page.py) et la revue "
          "de lecture (TF-0422).", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
