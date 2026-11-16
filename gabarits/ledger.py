"""Écriture du ledger de run — contrat CONTRAT-INTERFACE §3 du pilot (gabarit du pilot, TF-1205).

JSON Lines append-only, `seq` strictement croissant depuis 1 (numéroté après le plus grand déjà pris), `ts` ISO non décroissant,
première entrée `run_open`. Écrivain unique : l'orchestrateur de session.

  python forge/ledger.py <type> --<nom du champ> <valeur> [--<autre champ> <valeur>] ...
  python forge/ledger.py --verifier
  python forge/ledger.py <type> --archive <run clos> --<nom du champ> <valeur> ...   (écrit dans runs/<run clos>/ledger.jsonl)
  python forge/ledger.py --hors-run                  (liste forge/hors-run.jsonl) ; --verifier --hors-run en juge l'intégrité
  python forge/ledger.py <type> --essai --<nom du champ> <valeur> ...   (mode d'essai : rien n'est écrit)

EXEMPLE RÉEL (TF-2630). Le nom du champ s'écrit dans l'option elle-même, une option par champ, jamais `--champ clé=valeur` :
  python forge/ledger.py oracles_verdict --oracle oracle-conformite-projet --verdict PASS --cible forge
Un verdict d'oracle porte `oracle` et `verdict` (CONTRAT-INTERFACE §3) ; l'écrivain refuse l'entrée qui n'a pas l'un des deux,
et tout champ nommé « champ », AVANT d'écrire : le 12/11/2026, `--champ clé=valeur` répété a écrit une entrée au seul champ
« champ », sans oracle ni verdict, code 0 (seq 976 de Produit-86), et un ledger ne se réécrit pas.

MODE D'ESSAI (TF-2549). `--essai` joue tous les contrôles d'une écriture (type, forme, première entrée, numérotation) et AFFICHE
l'entrée qui serait écrite, sans l'écrire : ni ledger, ni journal hors run, ni verrou. Un agent en lecture seule qui veut
tester l'usage de l'écrivain le fait par `--essai` : sans lui, un `oracles_verdict --etape x` joué pour voir a écrit une
entrée définitive au ledger d'un run (retour factory-digit-ai-fr, 14/11/2026, entrée 84, neutralisable seulement par un
retour). Le `seq` affiché est celui que prendrait l'écriture à cet instant, à titre indicatif : une autre session peut le prendre.

HORS RUN (TF-2223). Sans ledger de run, `retour`, `question_humain`, `reponse_humain` et `demande_humain` s'écrivent à
`forge/hors-run.jsonl`, pas au ledger du run : R-42 exige que celui-ci s'ouvre par `run_open`. Le prochain lot de retours les compile.

REMPLACEMENT (TF-2206). `--remplace D-46` nomme la décision remplacée ; `--artefacts_remplaces '[{"artefact": "…", "sort":
"retire|conserve|a_decider"}]'` liste ce qu'elle avait créé et ce que cela devient.

SESSION (D-218 (b), item I1, 15/11/2026). Chaque entrée nouvelle porte `session` (les 8 premiers caractères de l'identifiant de la
session qui l'écrit) et `session_source` : `session_start` quand la variable `FORGE_SESSION_ID` posée par le hook SessionStart de la
session est là, `heritee_possible` quand seule `CLAUDE_CODE_SESSION_ID` répond (une session enfant l'hérite de sa mère), `inconnue`
sinon. Un `--session` donné par l'appelant est gardé tel quel, avec `session_source: argument`.

`--run <identifiant>` est un CHAMP comme un autre : il s'écrit dans l'entrée (run_open, run_close, rectification_*...). Il ne
désigne plus l'archive d'un run clos, c'est `--archive` ; `--verifier --run <identifiant>` reste lu pour l'ancien usage (TF-2174).

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
import datetime
import json
import os
import pathlib
import re
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
# `go_publication` est le feu vert R-38 que lit oracles/hook-publication-hebergee.mjs du pilot
# (retour RP-5, TF-1990, 22/10/2026 : refusé ici, consigné de travers en reponse_humain).
# `conflit_regles`, `demande_emise`, `demande_recue`, `deplacement_effectue` et
# `deplacement_en_attente` sont prescrits « au ledger » du produit par CLAUDE-PRODUIT.md,
# CLAUDE-PRODUIT-DETAIL.md et REGLES-PROJET.md (R-43 pour le premier) : absents d'ici, le produit
# qui suivait la doctrine voyait son entrée refusée comme type inconnu (retour RT-38, TF-2083,
# 29/10/2026, même classe que RT-28). La recette croise désormais ce vocabulaire avec les types que
# les oracles du pilot ET les gabarits de doctrine prescrivent, pour que la dérive ne se répète pas.
# `secret_range` est l'entrée du geste `forge/ranger-secret.mjs` (TF-2127, D-167 (a), 04/11/2026) : le nom, l'empreinte
# et la date d'un secret rangé au fichier d'environnement local, jamais sa valeur.
# `demande_humain` consigne une demande humaine MOT POUR MOT ; refusé ici, il s'écrivait à la main ou se résumait (retour
# RP-18, TF-2198, 06/11/2026 : revue du 04/11 consignée en résumé, 2 entrées à la main sur 458). `qualification_enclenchement`
# est la qualification d'un refus du juge d'enclenchement (CONTRAT-INTERFACE.md, `ledger.mjs`) : le croisement de la recette
# avec les constantes `TYPE_*` de `ledger.mjs` l'a relevé absent le même jour.
# `anteriorite_ledger` est le type que le message de R-42 d'oracle-conformite-projet PRESCRIT (TF-1203) pour couvrir en bloc les
# écarts de `seq` ou d'horodatage antérieurs à une date (`--avant <date ISO> --cause "<≥ 20 caractères>"`) : refusé ici comme type
# inconnu, le produit qui suivait le message de l'oracle voyait son remède refusé (TF-2494, 13/11/2026, même classe que TF-2018).
# `rectification_doublon` désigne, sans les effacer, des entrées écrites deux fois par un script rejoué (`entrees: [{seq,
# doublon_de, cause}]`) : `ledger.mjs` de forge-agents l'a reçu le 14/11/2026 (TF-2424) et sa parité de vocabulaire avec ce
# fichier rougit sans lui.
# `decision_retiree` dit qu'une décision posée est retirée, sans réponse ni décision de remplacement : `oracles/lib-decisions.mjs` la lit
# comme une sortie de la décision depuis TF-2415, et ni cet écrivain ni `ledger.mjs` ne l'acceptaient (TF-2527, 14/11/2026) ; une retraite
# s'écrivait en `reponse_humain --decision D-M --remplace D-N`. Elle nomme la décision retirée (`decision`, `decisions` ou
# `decisions_retirees`, au format D-N) et sa `cause` (20 caractères au moins) : une décision qui disparaît sans motif ne se relit pas.
# `secret_range` reste le DERNIER type : la chirurgie du banc de `scripts/ranger-secret.test.mjs` le retire par sa position.
TYPES = {"run_open", "etape_open", "invocation", "oracles_verdict", "escalade_modele",
         "question_humain", "reponse_humain", "etape_close", "retour", "relais_arme",
         "run_close", "rectification_versions_forges", "rectification_run_open",
         "rectification_horodatage", "rectification_forges_mobilisees", "go_publication",
         "conflit_regles", "demande_emise", "demande_recue", "deplacement_effectue",
         "deplacement_en_attente", "demande_humain", "qualification_enclenchement",
         "anteriorite_ledger", "rectification_doublon", "decision_retiree", "secret_range"}


# TF-2223 (RP-2, 06/11/2026) : hors run, ces types s'écrivent à `forge/hors-run.jsonl`, jamais au ledger du run, dont R-42
# exige qu'il s'ouvre par `run_open`. Le journal garde la même discipline de `seq` et de `ts` ; le prochain lot de retours le compile.
HORS_RUN = {"retour", "question_humain", "reponse_humain", "demande_humain"}
JOURNAL_HORS_RUN = FORGE / "hors-run.jsonl"

# TF-2206 (RP-26, 06/11/2026) : ce que devient ce qu'une décision remplacée avait créé.
SORTS = ("retire", "conserve", "a_decider")

# D-218 (b), item I1 (15/11/2026, RP-25 du lot factory-digit-ai-fr 20261114u) : l'identité de la session qui écrit, dans l'ordre de
# `sessionCourante()` de `oracles/lib-session.mjs` du pilot. Le fait : D-218 a été signée du nom de la session mère, parce qu'une
# session lancée depuis une autre hérite de `CLAUDE_CODE_SESSION_ID`. La variable que pose le hook SessionStart de la session
# elle-même (par `CLAUDE_ENV_FILE`) passe d'abord ; la variable héritée vient ensuite, et sa source le dit.
VARIABLE_SESSION = "FORGE_SESSION_ID"
SOURCES_SESSION = ((VARIABLE_SESSION, "session_start"), ("CLAUDE_CODE_SESSION_ID", "heritee_possible"))


def session_courante() -> tuple:
    """(identifiant de 8 caractères, source) de la session qui écrit ; (None, "inconnue") quand rien ne l'identifie."""
    for nom, source in SOURCES_SESSION:
        valeur = os.environ.get(nom, "").strip()
        if valeur:
            return valeur[:8], source
    return None, "inconnue"


def controler_remplacement(type_: str, champs: dict) -> None:
    """`remplace` nomme la ou les décisions remplacées ; `artefacts_remplaces` liste ce qu'elles avaient créé avec son sort.
    La forme fausse est refusée AVANT d'écrire : une entrée écrite ne se réécrit pas.
    `secret_range` est hors de ce contrôle : son champ `remplace` est un booléen (« la ligne existait déjà »), écrit par
    `forge/ranger-secret.mjs` ; la recette d'ensemble du 06/11/2026 l'a relevé (ranger-secret.test.mjs rouge après TF-2206)."""
    if type_ == "secret_range":
        return
    if "remplace" in champs:
        r = champs["remplace"]
        refs = r if isinstance(r, list) else [r]
        if not refs or not all(isinstance(x, str) and x.strip() for x in refs):
            raise SystemExit("`remplace` doit nommer la ou les décisions remplacées (« D-46 »), pas une valeur vide")
    if "artefacts_remplaces" in champs:
        a = champs["artefacts_remplaces"]
        if "remplace" not in champs:
            raise SystemExit("`artefacts_remplaces` sans `remplace` : de quelle décision ces artefacts sont-ils ?")
        if not isinstance(a, list) or not a or not all(
                isinstance(x, dict) and str(x.get("artefact", "")).strip() and x.get("sort") in SORTS for x in a):
            raise SystemExit(f"`artefacts_remplaces` : liste non vide de {{artefact, sort}}, sort parmi {', '.join(SORTS)}")


# TF-2630 (retour RP-69 de Produit-86, 12/11/2026) : l'usage affiché disait `<type> --champ valeur` ; un appel `--champ clé=valeur` répété a écrit une
# entrée `oracles_verdict` au seul champ « champ » (la dernière valeur), sans `oracle` ni `verdict`, code 0. Un ledger est en ajout seul : le refus
# vient AVANT l'écriture. Le nom du champ est celui de l'option (`--oracle x`), et un verdict d'oracle porte les deux champs que le contrat exige.
EXEMPLE_VERDICT = "python forge/ledger.py oracles_verdict --oracle oracle-conformite-projet --verdict PASS --cible forge"
CHAMPS_VERDICT = ("oracle", "verdict")


def controler_forme(type_: str, champs: dict) -> None:
    """Refuse AVANT d'écrire un champ nommé « champ » (la lettre de l'ancien usage, jamais un nom de champ) et une entrée `oracles_verdict` à qui il
    manque `oracle` ou `verdict` (absent, vide, fait d'espaces, ou option donnée sans valeur). Le refus nomme le champ et donne un exemple réel."""
    if "champ" in champs:
        raise SystemExit("`--champ` n'est pas un nom de champ : le nom du champ s'écrit dans l'option elle-même (`--oracle oracle-x`, une option par champ), "
                         f"jamais `--champ clé=valeur` ; exemple : `{EXEMPLE_VERDICT}` — rien n'est écrit")
    if type_ != "oracles_verdict":
        return
    manquants = [c for c in CHAMPS_VERDICT if not isinstance(champs.get(c), str) or not champs[c].strip()]
    if manquants:
        raise SystemExit(f"`oracles_verdict` sans {' ni '.join(f'`{c}`' for c in manquants)} : une entrée sans oracle ou sans verdict ne dit pas ce qui a tourné "
                         f"(CONTRAT-INTERFACE §3) ; exemple : `{EXEMPLE_VERDICT}` — rien n'est écrit")


# TF-2527 : les champs où `oracles/lib-decisions.mjs` (`decisionsRetirees`) lit la décision qu'une entrée `decision_retiree` retire.
CHAMPS_DECISION_RETIREE = ("decision", "decisions", "decisions_retirees")
CAUSE_MIN = 20


def controler_retrait(type_: str, champs: dict) -> None:
    """Une `decision_retiree` nomme la ou les décisions retirées (« D-12 », en `decision`, `decisions` ou `decisions_retirees`, chaîne ou
    liste) et dit pourquoi (`cause`, 20 caractères au moins). Refusée AVANT d'écrire : une entrée écrite ne se réécrit pas, et un
    retrait sans décision nommée ne sort rien chez `lib-decisions.mjs`."""
    if type_ != "decision_retiree":
        return
    nommees = []
    for c in CHAMPS_DECISION_RETIREE:
        v = champs.get(c)
        nommees += v if isinstance(v, list) else ([] if v is None else [v])
    if not nommees or not all(isinstance(x, str) and re.fullmatch(r"D-?\s*\d{1,4}", x.strip(), re.IGNORECASE) for x in nommees):
        raise SystemExit("`decision_retiree` doit nommer la ou les décisions retirées au format « D-12 » "
                         "(`--decision`, `--decisions` ou `--decisions_retirees`) — rien n'est écrit")
    cause = champs.get("cause")
    if not isinstance(cause, str) or len(cause.strip()) < CAUSE_MIN:
        raise SystemExit(f"`decision_retiree` doit dire pourquoi : `--cause` d'au moins {CAUSE_MIN} caractères — rien n'est écrit")


# TF-2586 (15/11/2026) : les quatre champs d'une déclaration de `rectification_horodatage`, ceux que `ledger.mjs verify` (CHAMPS_RECTIFICATION)
# et R-42 d'oracle-conformite-projet exigent depuis TF-2573. Une déclaration à qui il manque l'un d'eux est INOPÉRANTE : elle ne couvre
# rien, et l'entrée écrite ne se réécrit pas. Le fait : l'écrivain ne les exigeait pas et pouvait écrire une entrée que les deux juges refusent.
CHAMPS_RECTIFICATION = ("seq", "ts_consigne", "ts_reel_estime", "cause")
# TF-2587 (suite, 15/11/2026) : `ts_reel_estime` est un INSTANT — date ET heure ISO 8601 (« vers midi », un nombre, « 2026-01-01 » n'ordonnent rien).
# `ledger.mjs verify` (`tsReelLisible`) et R-42 l'exigent d'une rectification écrite à partir du 15/11/2026 ; une entrée que l'écrivain écrit est toujours
# neuve, il l'exige donc toujours. Forme volontairement plus étroite que `Date.parse` de Node (calendrier réel, fuseau Z ou ±hh:mm, secondes facultatives) :
# ce qui passe ici passe chez les deux juges.
INSTANT_ISO = re.compile(r"(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?")


def est_un_instant(v) -> bool:
    m = INSTANT_ISO.fullmatch(v.strip()) if isinstance(v, str) else None
    if not m:
        return False
    a, mo, j, h, mi, sec = m.groups()
    try:
        datetime.datetime(int(a), int(mo), int(j), int(h), int(mi), int(sec or 0))
    except ValueError:
        return False
    return True


def controler_rectification(type_: str, champs: dict) -> None:
    """Une `rectification_horodatage` porte `entrees: [{seq, ts_consigne, ts_reel_estime, cause}]`, liste non vide, chaque déclaration avec
    ses quatre champs (ni absent, ni null, ni vide, ni fait d'espaces — le prédicat de `verify`) un `seq` entier ≥ 1 et un `ts_reel_estime` qui est un instant. Refusée AVANT
    d'écrire : une entrée écrite ne se réécrit pas."""
    if type_ != "rectification_horodatage":
        return
    forme = "`--entrees '[{\"seq\": 7, \"ts_consigne\": \"<ts de l entrée visée>\", \"ts_reel_estime\": \"<instant ISO 8601, 2026-01-01T12:30:00Z>\", \"cause\": \"<pourquoi>\"}]'`"
    entrees = champs.get("entrees")
    if not isinstance(entrees, list) or not entrees:
        raise SystemExit(f"`rectification_horodatage` doit porter {forme} : une rectification qui ne déclare aucun seq ne rectifie rien — rien n'est écrit")
    for d in entrees:
        manquants = [c for c in CHAMPS_RECTIFICATION
                     if not isinstance(d, dict) or d.get(c) is None or str(d[c]).strip() == ""]
        if manquants:
            raise SystemExit(f"`rectification_horodatage` : déclaration incomplète, champ(s) {', '.join(f'`{c}`' for c in manquants)} manquant(s) "
                             f"dans {json.dumps(d, ensure_ascii=False)} — elle ne couvrirait rien chez `verify` ni chez R-42 ; forme attendue {forme} — rien n'est écrit")
        if isinstance(d["seq"], bool) or not isinstance(d["seq"], int) or d["seq"] < 1:
            raise SystemExit(f"`rectification_horodatage` : `seq` invalide ({json.dumps(d['seq'], ensure_ascii=False)}) — entier ≥ 1 attendu — rien n'est écrit")
        if not est_un_instant(d["ts_reel_estime"]):
            raise SystemExit(f"`rectification_horodatage` : `ts_reel_estime` illisible ({json.dumps(d['ts_reel_estime'], ensure_ascii=False)}) — une date ET une heure ISO 8601 "
                             "sont attendues (2026-01-01T12:30:00Z), l'heure réelle estimée de l'action ; une rectification neuve qui n'en porte pas est refusée chez `verify` et R-42 — rien n'est écrit")


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


def ajouter(archive: str, type_: str, essai: bool = False, /, **champs) -> dict:
    # Paramètres POSITIONNELS SEULEMENT (TF-2174) : un champ d'entrée nommé `run`, `archive`, `type_` ou `essai` ne collisionne plus avec eux
    # (un second `--run` levait « multiple values for argument 'run' »).
    # `essai` (TF-2549) : tous les contrôles sont joués et l'entrée est rendue, mais ni le journal ni le verrou ne sont touchés.
    if type_ not in TYPES:
        raise SystemExit(f"type inconnu : {type_} — attendus {sorted(TYPES)}")
    controler_forme(type_, champs)
    controler_remplacement(type_, champs)
    controler_retrait(type_, champs)
    controler_rectification(type_, champs)
    # Hors run (aucune entrée au ledger du run, hors archive), un retour ou une décision s'écrit au journal hors run.
    hors_run = type_ in HORS_RUN and not archive and not lignes(chemin(archive))
    p = JOURNAL_HORS_RUN if hors_run else chemin(archive)
    verrou = p.with_name(p.name + ".lock")
    if not essai:
        prendre_verrou(verrou)
    try:
        dejà = lignes(p)                         # relu SOUS verrou : la fin du fichier au moment d'écrire
        if not dejà and type_ != "run_open" and not hors_run:
            raise SystemExit("la première entrée d'un ledger doit être `run_open`")
        # TF-1867 : après le PLUS GRAND numéro déjà pris, pas après le nombre de lignes (une copie
        # de produit portait `len(dejà) + 1` : 13 seq en double relevés le 15/10/2026) ni après le
        # numéro de la dernière ligne (faux dès qu'elle porte un numéro inférieur à une précédente).
        seq = max((x["seq"] for x in dejà), default=0) + 1
        ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        if dejà and ts < dejà[-1]["ts"]:
            ts = dejà[-1]["ts"]                  # `ts` non décroissant, jamais falsifié
        e = {"seq": seq, "ts": ts, "type": type_, **({"hors_run": True} if hors_run else {}), **champs}
        # D-218 (b), item I1 : la session qui écrit l'entrée, et la source de cette identité.
        if "session" not in champs:
            e["session"], e["session_source"] = session_courante()
        elif "session_source" not in champs:
            e["session_source"] = "argument"
        if not essai:
            with p.open("a", encoding="utf-8", newline="\n") as fh:
                fh.write(json.dumps(e, ensure_ascii=False) + "\n")
    finally:
        if not essai:
            try:
                verrou.unlink()
            except FileNotFoundError:
                pass
    if essai:
        print(f"[ESSAI] rien n'est écrit : cette entrée serait écrite à {p.name} (seq {e['seq']}, indicatif)", file=sys.stderr)
        return e
    if hors_run:
        print(f"[HORS RUN] aucun run ouvert : entrée écrite à {JOURNAL_HORS_RUN.name} (seq {e['seq']}), pas au ledger du run ; "
              "le prochain lot de retours la compile (`python forge/ledger.py --hors-run` la liste)", file=sys.stderr)
    elif type_ == "run_open" and not archive and lignes(JOURNAL_HORS_RUN):
        print(f"[À COMPILER] {len(lignes(JOURNAL_HORS_RUN))} entrée(s) hors run attendent au prochain lot de retours "
              f"({JOURNAL_HORS_RUN.name}) : `python forge/ledger.py --hors-run` les liste", file=sys.stderr)
    return e


def afficher(e: dict) -> None:
    """Confirme l'entrée écrite. Jamais un échec de l'affichage après une écriture réussie : si le flux
    refuse un caractère, la même entrée sort en ASCII échappé, et le code de sortie reste 0."""
    try:
        print(json.dumps(e, ensure_ascii=False))
    except UnicodeEncodeError:
        print(json.dumps(e, ensure_ascii=True))


def verifier(run: str, hors_run: bool = False) -> int:
    """Deux niveaux, et l'écart de vocabulaire n'est pas au même que la rupture de structure.

    Un `seq` rompu ou un `ts` décroissant rend le ledger INEXPLOITABLE : c'est bloquant.
    Un type hors vocabulaire, lui, désigne une entrée DÉJÀ ÉCRITE, et le contrat du pilot
    (CONTRAT-INTERFACE §3) interdit de réécrire un ledger existant — « on ne juge que ce qui
    s'est déclaré jugeable, et on ne réécrit jamais un ledger existant ». Le déclarer et
    bloquer dessus reviendrait à exiger une correction interdite, donc à faire désactiver le
    contrôle (motif que R-33 bis donne pour le verdict websec). Il sort donc DÉCLARÉ, avec son remède, sans mise en échec.

    Le type conforme pour un arbitrage humain consigné est `reponse_humain`.
    """
    p = JOURNAL_HORS_RUN if hors_run else chemin(run)
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
            if not hors_run:                     # le journal hors run ne s'ouvre pas par run_open (TF-2223)
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
            # TF-2206 : une entrée qui en remplace une autre sans lister ce que celle-ci avait créé (D-49 avait remplacé D-46
            # chez un produit, et onze ressources, deux exigences et leurs contrôles étaient restés).
            # TF-2284 : `secret_range` est exempté, comme à l'écriture (`controler_remplacement`) — son `remplace` est un booléen « la ligne existait déjà », pas une décision remplacée.
            if x["type"] != "secret_range" and x.get("remplace") and not x.get("artefacts_remplaces"):
                declares.append(f"seq {x['seq']} : remplace {x['remplace']} sans `artefacts_remplaces` — entrée déjà écrite, non "
                                f"réécrite ; consigner par ajout `--remplace <D-N> --artefacts_remplaces "
                                f"'[{{\"artefact\": \"…\", \"sort\": \"retire|conserve|a_decider\"}}]'`")
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
    # Un run CLOS reste adressable : `--archive <identifiant>` (TF-2174, 05/11/2026). `--run` était ce sélecteur : il était donc
    # consommé et l'identifiant du run n'entrait jamais dans l'entrée (seq 207 d'un produit, partie sans run). `--run <identifiant>`
    # s'écrit désormais au champ `run` de l'entrée, comme tout autre champ (run_open, run_close, rectification_*...). L'ancien nom
    # reste LU hors écriture : `--verifier --run <identifiant>` désigne encore l'archive.
    archive = ""
    if "--archive" in a:
        i = a.index("--archive")
        if i + 1 < len(a):
            archive = a[i + 1]
            del a[i:i + 2]
    # TF-2549 : `--essai` est un DRAPEAU, retiré avant la lecture des champs (sinon il avalerait la valeur qui le suit).
    essai = "--essai" in a
    while "--essai" in a:
        a.remove("--essai")
    if a and a[0] == "--hors-run":
        # TF-2223 : le journal hors run, tel quel, pour le prochain lot de retours.
        for x in lignes(JOURNAL_HORS_RUN):
            afficher(x)
        sys.exit(0)
    if a and a[0] == "--verifier" and "--hors-run" in a:
        sys.exit(verifier("", hors_run=True))
    if a and a[0] == "--verifier":
        if not archive and "--run" in a:
            i = a.index("--run")
            archive = a[i + 1] if i + 1 < len(a) else ""
        sys.exit(verifier(archive))
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
        # Même défaut pour un booléen : `--r38 true` écrivait le texte "true", et le hook de
        # publication du pilot, qui exige `r38 === true`, ignorait le feu vert (TF-1990).
        elif v in ("true", "false"):
            champs[k] = v == "true"
    afficher(ajouter(archive, type_, essai, **champs))
    # TF-2206 : une décision qui en remplace une autre dit ce que la première avait créé, et son sort.
    if "remplace" in champs and "artefacts_remplaces" not in champs:
        print("[À PORTER] remplace sans artefacts_remplaces : lister ce que la décision remplacée avait créé (ressources, exigences, "
              "contrôles) avec son sort, par une entrée de plus : --remplace <D-N> --artefacts_remplaces "
              "'[{\"artefact\": \"…\", \"sort\": \"retire|conserve|a_decider\"}]'", file=sys.stderr)
    # R-19 exige `versions_forges` au `run_open` ; l'entrée est écrite, l'oubli se dit tout de suite,
    # avec la voie par ajout, plutôt qu'au premier relevé de conformité (TF-2018).
    if type_ == "run_open" and "versions_forges" not in champs:
        print("[À PORTER] run_open sans versions_forges (R-19) : la prochaine fois, "
              "--versions_forges '{\"<forge>\": \"<sha court>\"}' ; pour celui-ci, ajouter "
              "rectification_versions_forges --seq_vise <seq> --cause \"…\" --versions_forges '{…}'",
              file=sys.stderr)
