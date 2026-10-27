"""Mesure de concision et de structure d'un Markdown.

Seuils (règle de l'utilisateur du 20/10/2026 : textes courts, simples, clairs, précis) :
- paragraphe de prose : 3 phrases et 60 mots au plus ;
- phrase : 25 mots au plus (prose et puces) ;
- énumération de 3 éléments ou plus en prose (« a, b et c » ou suite de « ; ») : à mettre en liste ;
- deux « $ » sur une même ligne hors code : rendu en formule mathématique par certains lecteurs.
Usage : python -I mesure_concision.py <fichier.md>
Sortie : compteurs, puis les lignes fautives ; code 1 si un défaut.
"""
import re
import sys

path = sys.argv[1]
lignes = open(path, encoding="utf-8").read().splitlines()

def phrases(t):
    t = re.sub(r"`[^`]*`", "X", t)
    return [p for p in re.split(r"(?<=[.!?])\s+(?=[A-ZÀ-Ý«])", t.strip()) if p.strip()]

def mots(t):
    return len(re.findall(r"\S+", re.sub(r"`[^`]*`", "X", t)))

defauts = []
en_code = False
para, debut = [], 0
nb_para = nb_phr = 0

def juger_para(bloc, ligne):
    global nb_para, nb_phr
    t = " ".join(bloc)
    ps = phrases(t)
    nb_para += 1
    nb_phr += len(ps)
    if len(ps) > 3 or mots(t) > 60:
        defauts.append((ligne, f"paragraphe de {len(ps)} phrases, {mots(t)} mots"))
    for p in ps:
        if mots(p) > 25:
            defauts.append((ligne, f"phrase de {mots(p)} mots : « {p[:70]}… »"))
    if t.count(" ; ") >= 2:
        defauts.append((ligne, "énumération par « ; » en prose : à mettre en liste"))

for i, l in enumerate(lignes, 1):
    if l.strip().startswith("```"):
        en_code = not en_code
        continue
    if en_code:
        continue
    hors_code = re.sub(r"`[^`]*`", "", l)
    if len(re.findall(r"(?<!\\)\$", hors_code)) >= 2:
        defauts.append((i, "deux « $ » non échappés sur la ligne : rendu mathématique"))
    s = l.strip()
    prose = s and not s.startswith(("#", "|", "-", "*", ">", "---")) and not re.match(r"\d+\.\s", s)
    if prose and not (i <= 12 and ":" in s and s.split(":")[0].isidentifier()):
        if not para:
            debut = i
        para.append(s)
        continue
    if para:
        juger_para(para, debut)
        para = []
    m = re.match(r"(?:[-*]|\d+\.)\s+(.*)", s)
    if m:
        for p in phrases(m.group(1)):
            if mots(p) > 25:
                defauts.append((i, f"puce, phrase de {mots(p)} mots : « {p[:70]}… »"))
if para:
    juger_para(para, debut)

print(f"{path}\nparagraphes de prose : {nb_para} ; phrases : {nb_phr} ; défauts : {len(defauts)}")
for ligne, msg in defauts:
    print(f"  ligne {ligne} : {msg}")
sys.exit(1 if defauts else 0)
