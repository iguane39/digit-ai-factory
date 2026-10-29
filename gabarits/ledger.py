"""Écriture du ledger de run — contrat CONTRAT-INTERFACE §3 du pilot (gabarit du pilot, TF-1205).

JSON Lines append-only, `seq` strictement croissant depuis 1 (numéroté après le plus grand déjà pris), `ts` ISO non décroissant,
première entrée `run_open`. Écrivain unique : l'orchestrateur de session.

  python forge/ledger.py <type> --champ valeur ...
  python forge/ledger.py --verifier

POUR QUI. Un produit dont la pile est Python et qui n'a pas Node sous la main. La voie de doctrine
reste `ledger.mjs` de `digit-ai-forge-agents` (références\\ETAPES-RUN.md : « un produit écrit son
ledger par `ledger.mjs`, jamais par une copie réécrite ») ; ce gabarit n'est pas une réécriture libre,
c'est la copie que deux produits portaient déjà, remise à un seul endroit pour qu'elle ne dérive plus.

AFFICHAGE EN UTF-8, TOUJOURS (TF-1205). Sous une console Windows en cp1252, `print` d'une entrée qui
porte une flèche ou une lettre hors de la page de code levait `UnicodeEncodeError` APRÈS l'écriture de
l'entrée : code de sortie 1, l'appelant lit un échec là où l'écriture a réussi, et rejouer la commande
écrivait l'entrée deux fois (ledger d'un produit, 13/09/2026, seq 218). Les flux sont donc forcés en
UTF-8 en tête de fichier, et l'affichage de confirmation retombe sur l'ASCII échappé plutôt que de
planter : l'écriture a eu lieu, le code de sortie le dit.
"""
import json
import os
import pathlib
import sys
import time

# Forcer l'UTF-8 sur les flux AVANT toute écriture. `reconfigure` existe depuis Python 3.7 ; un flux
# remplacé par un objet sans cette méthode (redirection exotique) garde son encodage, et l'affichage
# de confirmation se replie alors sur l'ASCII (voir `afficher`).
for _flux in (sys.stdout, sys.stderr):
    try:
        _flux.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

FORGE = pathlib.Path(__file__).resolve().parent
RUNS = FORGE.parent / "runs"
# Les quatre rectifications PAR AJOUT sont prescrites par les juges du pilot et par `ledger.mjs` :
# `rectification_versions_forges` et `rectification_run_open` par R-19 d'oracle-conformite-projet
# (TF-0801, TF-1454), les deux autres par
# `ledger.mjs` (R-42, TF-1722). Absentes d'ici, le produit qui suivait la consigne de l'oracle voyait
# son entrée refusée à l'écriture puis déclarée hors vocabulaire (retour RT-28, TF-2018, 29/10/2026).
# La recette croise ce vocabulaire avec les types que les oracles du pilot prescrivent.
TYPES = {"run_open", "etape_open", "invocation", "oracles_verdict", "escalade_modele",
         "question_humain", "reponse_humain", "etape_close", "retour", "relais_arme",
         "run_close", "rectification_versions_forges", "rectification_run_open",
         "rectification_horodatage", "rectification_forges_mobilisees"}


def chemin(run: str = "") -> pathlib.Path:
    """Le ledger du run COURANT vit a `forge/ledger.jsonl` — chemin de doctrine (R-19, R-42,
    ETAPES-RUN, CONTRAT-INTERFACE §3), et celui qu'annonce le CLAUDE.md de ce produit.

    Un ledger de run CLOS vit sous `runs/<run-id>/ledger.jsonl` : ces ledgers sont des ARCHIVES
    et se lisent en passant leur identifiant (`--run`). Un run reel ecrit sous `runs/` devient
    INVISIBLE pour R-19 et R-42 et se lit comme « aucun run ouvert »."""
    if run:
        d = RUNS / run
        if d.exists():
            return d / "ledger.jsonl"
    return FORGE / "ledger.jsonl"


def lignes(p: pathlib.Path) -> list[dict]:
    if not p.exists():
        return []
    return [json.loads(ligne) for ligne in p.read_text(encoding="utf-8").splitlines() if ligne.strip()]


VERROU_ESSAIS = 100
VERROU_PAUSE_S = 0.05


def prendre_verrou(verrou: pathlib.Path) -> None:
    """Verrou d'écriture (TF-1575, TF-1367) : un fichier `<ledger>.lock` créé en exclusif, pris pour
    toute la section lecture-de-la-fin → écriture. Deux sessions simultanées recevaient le même `seq`
    (seq 283 porté deux fois le 22/09/2026) parce que le numéro était calculé sans verrou. Même
    mécanisme que `ledger.mjs append`. Un verrou resté pris (processus tué) se supprime à la main."""
    for _ in range(VERROU_ESSAIS):
        try:
            os.close(os.open(verrou, os.O_CREAT | os.O_EXCL | os.O_WRONLY))
            return
        except FileExistsError:
            time.sleep(VERROU_PAUSE_S)
        except PermissionError:           # Windows : création/suppression concurrente du même fichier
            time.sleep(VERROU_PAUSE_S)
    raise SystemExit(f"verrou non obtenu après {VERROU_ESSAIS * VERROU_PAUSE_S:.0f} s — un autre "
                     f"processus détient {verrou} (s'il est mort, supprimer ce fichier)")


def ajouter(run: str, type_: str, **champs) -> dict:
    if type_ not in TYPES:
        raise SystemExit(f"type inconnu : {type_} — attendus {sorted(TYPES)}")
    p = chemin(run)
    verrou = p.with_name(p.name + ".lock")
    prendre_verrou(verrou)
    try:
        dejà = lignes(p)                         # relu SOUS verrou : la fin du fichier au moment d'écrire
        if not dejà and type_ != "run_open":
            raise SystemExit("la première entrée d'un ledger doit être `run_open`")
        # TF-1867 : après le PLUS GRAND numéro déjà pris, pas après le nombre de lignes (une copie
        # de produit portait `len(dejà) + 1` : 13 seq en double relevés le 15/10/2026) ni après le
        # numéro de la dernière ligne (faux dès qu'elle porte un numéro inférieur à une précédente).
        seq = max((x["seq"] for x in dejà), default=0) + 1
        ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        if dejà and ts < dejà[-1]["ts"]:
            ts = dejà[-1]["ts"]                  # `ts` non décroissant, jamais falsifié
        e = {"seq": seq, "ts": ts, "type": type_, **champs}
        with p.open("a", encoding="utf-8", newline="\n") as fh:
            fh.write(json.dumps(e, ensure_ascii=False) + "\n")
    finally:
        try:
            verrou.unlink()
        except FileNotFoundError:
            pass
    return e


def afficher(e: dict) -> None:
    """Confirme l'entrée écrite. Jamais un échec de l'affichage après une écriture réussie : si le flux
    refuse un caractère, la même entrée sort en ASCII échappé, et le code de sortie reste 0."""
    try:
        print(json.dumps(e, ensure_ascii=False))
    except UnicodeEncodeError:
        print(json.dumps(e, ensure_ascii=True))


def verifier(run: str) -> int:
    """Deux niveaux, et l'écart de vocabulaire n'est pas au même que la rupture de structure.

    Un `seq` rompu ou un `ts` décroissant rend le ledger INEXPLOITABLE : c'est bloquant.
    Un type hors vocabulaire, lui, désigne une entrée DÉJÀ ÉCRITE, et le contrat du pilot
    (CONTRAT-INTERFACE §3) interdit de réécrire un ledger existant — « on ne juge que ce qui
    s'est déclaré jugeable, et on ne réécrit jamais un ledger existant ». Le déclarer et
    bloquer dessus reviendrait à exiger une correction interdite, donc à faire désactiver le
    contrôle (motif que R-33 bis donne pour le verdict websec). Il sort donc DÉCLARÉ, avec son remède, sans mise en échec.

    Le type conforme pour un arbitrage humain consigné est `reponse_humain`.
    """
    p = chemin(run)
    e = lignes(p)
    bloquants, declares = [], []
    if not e:
        bloquants.append("ledger vide")
    else:
        # TF-1575 : un seq porté par plusieurs entrées (deux écrivains sans verrou commun) se NOMME,
        # EN TÊTE, à part des ruptures en cascade qu'il provoque ensuite (« seq N attendu M »).
        lignes_par_seq: dict = {}
        for i, x in enumerate(e, start=1):
            lignes_par_seq.setdefault(x["seq"], []).append(i)
        for s, ls in lignes_par_seq.items():
            if len(ls) > 1:
                bloquants.append(f"seq {s} porté par {len(ls)} entrées, lignes "
                                 f"{', '.join(map(str, ls))} — deux écrivains sans verrou commun")
        if e[0]["type"] != "run_open":
            bloquants.append("première entrée ≠ run_open")
        for i, x in enumerate(e, start=1):
            if x["seq"] != i:
                bloquants.append(f"seq {x['seq']} attendu {i}")
            if i > 1 and x["ts"] < e[i - 2]["ts"]:
                bloquants.append(f"ts décroissant en seq {x['seq']}")
            if x["type"] not in TYPES:
                declares.append(f"seq {x['seq']} : type « {x['type']} » hors du vocabulaire du "
                                f"pilot — entrée déjà écrite, non réécrite ; employer "
                                f"`reponse_humain` pour un arbitrage humain")
    etat = "INTÈGRE" if not bloquants else "ANOMALIES"
    print(f"{len(e)} entrée(s) · {etat}"
          + (f" · {len(declares)} écart(s) déclaré(s)" if declares else ""))
    for x in bloquants:
        print("    [BLOQUANT]", x)
    for x in declares:
        print("    [DÉCLARÉ] ", x)
    return 1 if bloquants else 0


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        raise SystemExit(__doc__)
    # Le run est VIDE par défaut, pour que `chemin("")` rende le chemin de doctrine
    # `forge/ledger.jsonl`. Un run-id figé rendrait INERTE ce chemin : `chemin()` prendrait toujours
    # la branche `runs/`, et les entrées partiraient dans l'archive sans que rien ne le signale.
    # Un run précis reste adressable : `--run <identifiant>`.
    run = ""
    if "--run" in a:
        i = a.index("--run")
        if i + 1 < len(a):
            run = a[i + 1]
            del a[i:i + 2]
    if a and a[0] == "--verifier":
        sys.exit(verifier(run))
    # `--help` écrivait une entrée « help: true » au ledger : une demande d'aide n'écrit rien, et un
    # type d'entrée ne commence jamais par un tiret (revue de l'œil critique, 26/10/2026).
    if "--help" in a or "-h" in a:
        print(__doc__)
        sys.exit(0)
    if not a or a[0].startswith("-"):
        raise SystemExit(f"type d'entrée manquant ou invalide (« {a[0] if a else ''} ») — rien n'est écrit\n{__doc__}")
    type_ = a[0]
    champs = {}
    i = 1
    while i < len(a):
        if a[i].startswith("--"):
            champs[a[i][2:]] = a[i + 1] if i + 1 < len(a) else True
            i += 2
        else:
            i += 1
    for k, v in list(champs.items()):
        if isinstance(v, str) and v.startswith(("{", "[")):
            champs[k] = json.loads(v)
        # R-19 compare `seq_vise` au `seq` du run_open en NOMBRE strict : écrit en texte, la
        # rectification serait ignorée sans un mot (TF-2018).
        elif k == "seq_vise" and isinstance(v, str) and v.isdigit():
            champs[k] = int(v)
    afficher(ajouter(run, type_, **champs))
    # R-19 exige `versions_forges` au `run_open` ; l'entrée est écrite, l'oubli se dit tout de suite,
    # avec la voie par ajout, plutôt qu'au premier relevé de conformité (TF-2018).
    if type_ == "run_open" and "versions_forges" not in champs:
        print("[À PORTER] run_open sans versions_forges (R-19) : la prochaine fois, "
              "--versions_forges '{\"<forge>\": \"<sha court>\"}' ; pour celui-ci, ajouter "
              "rectification_versions_forges --seq_vise <seq> --cause \"…\" --versions_forges '{…}'",
              file=sys.stderr)
