# -*- coding: utf-8 -*-
"""verifier-ooxml.py — l'ordre des enfants d'un paquet OOXML se contrôle AVANT la remise
(TF-0686, 28/08/2026).

LE FAIT QUI L'IMPOSE. Un livrable .pptx remis a fait afficher à PowerPoint « un problème dans
le contenu … PowerPoint peut essayer de réparer ». Cause relevée dans le paquet dézippé : sur
deux connecteurs, l'ordre des enfants de `a:ln` était « prstDash → solidFill → … » alors que le
schéma CT_LineProperties impose « remplissage → prstDash → cap/join → headEnd → tailEnd ». Le
code insérait `prstDash` en tête (`ln.insert(0, …)`). CE QUI REND LE DÉFAUT COÛTEUX :
python-pptx écrit cet arbre SANS RIEN SIGNALER, `unzip -t` déclare l'archive saine, et seul
PowerPoint chez le CLIENT le découvre — en proposant une réparation qui perd du formatage en
silence. Le défaut se paie deux fois : à l'ouverture, puis à l'impression.

CE QUE CE CONTRÔLE FAIT : il ouvre le paquet (.pptx/.docx/.xlsx), parcourt chaque partie XML,
et vérifie que les enfants de `a:ln` et `a:rPr`/`a:defRPr` suivent la séquence de leur schéma.
Mesure de référence sur le cas réel : 120 blocs a:ln et 186 blocs a:rPr contrôlés, 0 en faute
après correctif. Il se joue APRÈS génération et AVANT remise — et tout producteur devrait
l'appeler en gate bloquante (le produit qui a payé le défaut appelle déjà un oracle Node de la
factory depuis Python via subprocess : le motif fonctionne dans les deux sens).

CE QU'IL NE FAIT PAS, et c'est déclaré :
  - il ne couvre que `a:ln`, `a:rPr` et `a:defRPr` — les éléments dont le désordre a été PAYÉ ;
    un autre CT_* mal ordonné passe, et l'étendre se fait en ajoutant sa séquence à SEQUENCES ;
  - il ne valide pas le paquet contre les schémas complets (ce serait refaire un validateur
    OOXML) ; il attrape la classe de défaut mesurée, pas toutes les classes possibles ;
  - un enfant INCONNU d'une séquence est ignoré, jamais accusé : accuser l'inconnu ferait
    crier le contrôle sur chaque extension légitime du format.

Usage : python scripts/verifier-ooxml.py <fichier.pptx|docx|xlsx> [...]
Exit : 0 = conforme · 1 = ordre en faute (fichier, partie, élément nommés) · 2 = illisible.
"""
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

NS_A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"

# La séquence du schéma, par élément contrôlé — les noms locaux, dans l'ordre où le xsd les
# impose. Un enfant absent ne coûte rien ; un enfant PRÉSENT doit venir après ceux qui le
# précèdent dans cette liste.
SEQUENCES = {
    NS_A + "ln": [
        "noFill", "solidFill", "gradFill", "pattFill",       # le remplissage d'abord
        "prstDash", "custDash",                                # puis le tireté
        "round", "bevel", "miter",                             # puis cap/join
        "headEnd", "tailEnd", "extLst",                        # les bouts en dernier
    ],
    NS_A + "rPr": [
        "ln", "noFill", "solidFill", "gradFill", "blipFill", "pattFill", "grpFill",
        "effectLst", "effectDag", "highlight",
        "uLnTx", "uLn", "uFillTx", "uFill",
        "latin", "ea", "cs", "sym",
        "hlinkClick", "hlinkMouseOver", "rtl", "extLst",
    ],
}
SEQUENCES[NS_A + "defRPr"] = SEQUENCES[NS_A + "rPr"]

def local(tag):
    return tag.split("}", 1)[1] if "}" in tag else tag

def fautes_d_ordre(racine, partie):
    fautes = []
    for el in racine.iter():
        seq = SEQUENCES.get(el.tag)
        if not seq:
            continue
        rangs = [seq.index(local(c.tag)) for c in el if local(c.tag) in seq]
        if rangs != sorted(rangs):
            ordre = [local(c.tag) for c in el]
            fautes.append({
                "partie": partie, "element": "a:" + local(el.tag),
                "ordre_trouve": ordre,
                "message": ("ordre des enfants hors schéma — PowerPoint proposera une "
                            "réparation qui perd du formatage en silence (TF-0686). "
                            "Attendu (parmi les présents) : "
                            + " → ".join(sorted(set(ordre) & set(seq), key=seq.index))),
            })
    return fautes

def juger(chemin):
    controles, fautes = 0, []
    try:
        with zipfile.ZipFile(chemin) as z:
            for nom in z.namelist():
                if not nom.endswith(".xml"):
                    continue
                try:
                    racine = ET.fromstring(z.read(nom))
                except ET.ParseError:
                    continue  # une partie non-XML bien nommée n'est pas le sujet de ce contrôle
                for el in racine.iter():
                    if el.tag in SEQUENCES:
                        controles += 1
                fautes.extend(fautes_d_ordre(racine, nom))
    except (zipfile.BadZipFile, OSError) as e:
        return None, str(e)
    return {"controles": controles, "fautes": fautes}, None

def main(argv):
    if not argv:
        print(json.dumps({"outil": "verifier-ooxml", "verdict": "ERREUR",
                          "message": "usage : python scripts/verifier-ooxml.py <fichier.pptx|docx|xlsx> [...]"}))
        return 2
    findings, illisibles, controles = [], [], 0
    for chemin in argv:
        r, err = juger(chemin)
        if r is None:
            illisibles.append({"fichier": chemin, "message": err})
            continue
        controles += r["controles"]
        for f in r["fautes"]:
            findings.append(dict(f, fichier=chemin))
    verdict = "ILLISIBLE" if illisibles else ("FAIL" if findings else "PASS")
    print(json.dumps({
        "outil": "verifier-ooxml", "version": "1.0.0", "verdict": verdict,
        "mesure": {"elements_controles": controles, "en_faute": len(findings)},
        "findings": findings or illisibles or [
            {"message": f"{controles} bloc(s) a:ln / a:rPr / a:defRPr contrôlés, 0 en faute"}],
        "non_juge": [
            "les CT_* hors a:ln / a:rPr / a:defRPr — seule la classe PAYÉE est couverte, l'étendre = une séquence de plus",
            "la validité complète du paquet contre les schémas OOXML — ce contrôle attrape un désordre mesuré, il ne remplace pas un validateur",
            "un enfant inconnu d'une séquence — accuser l'inconnu ferait crier sur chaque extension légitime",
        ],
    }, ensure_ascii=False, indent=1))
    return 2 if illisibles else (1 if findings else 0)

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
