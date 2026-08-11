# -*- coding: utf-8 -*-
"""Émetteur d'avancement des process longs — contrat gabarits/AVANCEMENT-PROCESS.md (TF-0094).

Huit champs, tableau pour l'humain (stderr) + ligne JSON machine (<run>/avancement.jsonl),
émission au démarrage puis toutes les `intervalle_s` secondes (défaut 180), et à la fin.
Cadence MESURÉE (unités finies / temps écoulé), glissement d'ETA annoncé, sous-découpe de
l'unité courante via `interne=`. Zéro dépendance.

    from avancement import Avancement
    av = Avancement(run_dir, unite="module", raf=modules, intervalle_s=180)
    for m in modules:
        av.en_cours(m, interne=None)      # ou interne="mutants 120/280"
        ... travail ...
        av.unite_finie(m)
    av.final()
"""
from __future__ import annotations

import io
import json
import os
import sys
import time
from datetime import datetime, timedelta


class Avancement:
    def __init__(self, dossier_run: str, unite: str, raf: list[str], intervalle_s: int = 180,
                 libelle: str = ""):
        self.unite = unite
        self.libelle = libelle or f"process {unite}s"
        self.raf = list(raf)
        self.total = len(raf)
        self.faits: list[str] = []
        self.courant: str | None = None
        self.interne: str | None = None
        self.intervalle = intervalle_s
        self.debut = time.time()
        self.derniere_emission = 0.0
        self.eta_precedente: str | None = None
        os.makedirs(dossier_run, exist_ok=True)
        self.jsonl = os.path.join(dossier_run, "avancement.jsonl")
        self._emettre(force=True)

    # --- événements -------------------------------------------------------
    def en_cours(self, nom: str, interne: str | None = None) -> None:
        self.courant = nom
        self.interne = interne
        self._tick()

    def sous_etape(self, interne: str) -> None:
        """Sous-découpe d'une unité lente : l'avancement se montre À L'INTÉRIEUR."""
        self.interne = interne
        self._tick()

    def unite_finie(self, nom: str) -> None:
        if nom in self.raf:
            self.raf.remove(nom)
        self.faits.append(nom)
        if self.courant == nom:
            self.courant, self.interne = None, None
        self._tick()

    def final(self) -> None:
        self._emettre(force=True, final=True)

    # --- mécanique --------------------------------------------------------
    def _tick(self) -> None:
        if time.time() - self.derniere_emission >= self.intervalle:
            self._emettre()

    def _heure(self, t: float | None = None) -> str:
        return datetime.fromtimestamp(t if t is not None else time.time()).strftime("%H:%M")

    def _emettre(self, force: bool = False, final: bool = False) -> None:
        maintenant = time.time()
        ecoule = maintenant - self.debut
        cadence = (len(self.faits) / (ecoule / 60)) if ecoule > 0 and self.faits else None
        restant_min = (len(self.raf) + (1 if self.courant else 0)) / cadence if cadence else None
        fin = self._heure(maintenant + restant_min * 60) if restant_min is not None else "non estimable (cadence à venir)"
        total_min = (ecoule / 60 + restant_min) if restant_min is not None else None

        en_cours = "—"
        if self.courant:
            rang = len(self.faits) + 1
            en_cours = f"{self.courant} — {rang}e sur {self.total}"
            if self.interne:
                en_cours += f" · interne : {self.interne}"
        raf_txt = f"{len(self.raf)} {self.unite}(s)" + (f" : {', '.join(self.raf[:10])}" + (" …" if len(self.raf) > 10 else "") if self.raf else "")
        glisse = f" (glisse : {self.eta_precedente} à l'émission précédente)" if (self.eta_precedente and self.eta_precedente != fin and not final) else ""

        lignes = [
            f"## Avancement — {self.libelle}" + (" — TERMINÉ" if final else ""),
            "| Champ | Valeur |", "|---|---|",
            f"| Heure de démarrage | {self._heure(self.debut)} |",
            f"| Heure du reporting | {self._heure()} — émis toutes les {self.intervalle // 60 or 1} min |",
            f"| Réalisé | {len(self.faits)} {self.unite}(s) |",
            f"| En cours | {en_cours} |",
            f"| RAF | {raf_txt} |",
            f"| Temps restant estimé | {f'~{restant_min:.0f} min (cadence mesurée : {cadence:.1f} {self.unite}/min)' if restant_min is not None else 'non estimable (aucune unité finie)'} |",
            f"| Temps total prévu | {f'~{total_min:.0f} min' if total_min is not None else '—'} |",
            f"| Heure de fin prévue | {'terminé ' + self._heure() if final else '~' + fin + glisse} |",
        ]
        print("\n".join(lignes), file=sys.stderr, flush=True)
        with io.open(self.jsonl, "a", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps({
                "ts": datetime.now().isoformat(timespec="seconds"),
                "heure_demarrage": self._heure(self.debut), "heure_reporting": self._heure(),
                "realise": len(self.faits), "en_cours": self.courant, "interne": self.interne,
                "raf": list(self.raf), "cadence_par_min": round(cadence, 2) if cadence else None,
                "temps_restant_min": round(restant_min) if restant_min is not None else None,
                "heure_fin_prevue": fin if not final else self._heure(), "final": final,
            }, ensure_ascii=False) + "\n")
        self.derniere_emission = maintenant
        if not final:
            self.eta_precedente = fin
