// Émetteur d'avancement des process longs — contrat gabarits/AVANCEMENT-PROCESS.md
// (TF-0094). Miroir Node de scripts/avancement.py : huit champs, tableau humain sur
// stderr + ligne JSON machine (<run>/avancement.jsonl), émission au démarrage puis
// toutes les intervalle_s secondes (défaut 180), et à la fin. Cadence MESURÉE,
// glissement d'ETA annoncé, sous-découpe via `interne`. Zéro dépendance.
//
//   import { creerAvancement } from ".../scripts/avancement.mjs";
//   const av = creerAvancement({ dossierRun, unite: "image", raf: ids, intervalleS: 180 });
//   av.enCours(id, "palier 2/5");  ...  av.uniteFinie(id);  ...  av.final();
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function creerAvancement({ dossierRun, unite, raf, intervalleS = 180, libelle = "" }) {
  const etat = {
    unite, libelle: libelle || `process ${unite}s`, raf: [...raf], total: raf.length,
    faits: [], courant: null, interne: null, debut: Date.now(), derniere: 0, etaPrec: null,
  };
  mkdirSync(dossierRun, { recursive: true });
  const jsonl = join(dossierRun, "avancement.jsonl");
  const heure = (t = Date.now()) => new Date(t).toTimeString().slice(0, 5);

  function emettre(force = false, final = false) {
    const maintenant = Date.now();
    const ecouleMin = (maintenant - etat.debut) / 60000;
    const cadence = etat.faits.length && ecouleMin > 0 ? etat.faits.length / ecouleMin : null;
    const restantMin = cadence ? (etat.raf.length + (etat.courant ? 1 : 0)) / cadence : null;
    const fin = restantMin !== null ? heure(maintenant + restantMin * 60000) : "non estimable (cadence à venir)";

    let enCours = "—";
    if (etat.courant) {
      enCours = `${etat.courant} — ${etat.faits.length + 1}e sur ${etat.total}`;
      if (etat.interne) enCours += ` · interne : ${etat.interne}`;
    }
    const rafTxt = `${etat.raf.length} ${unite}(s)` +
      (etat.raf.length ? ` : ${etat.raf.slice(0, 10).join(", ")}${etat.raf.length > 10 ? " …" : ""}` : "");
    const glisse = etat.etaPrec && etat.etaPrec !== fin && !final
      ? ` (glisse : ${etat.etaPrec} à l'émission précédente)` : "";

    process.stderr.write([
      `## Avancement — ${etat.libelle}${final ? " — TERMINÉ" : ""}`,
      "| Champ | Valeur |", "|---|---|",
      `| Heure de démarrage | ${heure(etat.debut)} |`,
      `| Heure du reporting | ${heure()} — émis toutes les ${Math.max(1, Math.round(intervalleS / 60))} min |`,
      `| Réalisé | ${etat.faits.length} ${unite}(s) |`,
      `| En cours | ${enCours} |`,
      `| RAF | ${rafTxt} |`,
      `| Temps restant estimé | ${restantMin !== null ? `~${Math.round(restantMin)} min (cadence mesurée : ${cadence.toFixed(1)} ${unite}/min)` : "non estimable (aucune unité finie)"} |`,
      `| Temps total prévu | ${restantMin !== null ? `~${Math.round(ecouleMin + restantMin)} min` : "—"} |`,
      `| Heure de fin prévue | ${final ? "terminé " + heure() : "~" + fin + glisse} |`,
      "",
    ].join("\n"));
    appendFileSync(jsonl, JSON.stringify({
      ts: new Date().toISOString().slice(0, 19),
      heure_demarrage: heure(etat.debut), heure_reporting: heure(),
      realise: etat.faits.length, en_cours: etat.courant, interne: etat.interne,
      raf: [...etat.raf], cadence_par_min: cadence ? +cadence.toFixed(2) : null,
      temps_restant_min: restantMin !== null ? Math.round(restantMin) : null,
      heure_fin_prevue: final ? heure() : fin, final,
    }) + "\n");
    etat.derniere = maintenant;
    if (!final) etat.etaPrec = fin;
  }

  const tick = () => { if (Date.now() - etat.derniere >= intervalleS * 1000) emettre(); };
  emettre(true);
  return {
    enCours(nom, interne = null) { etat.courant = nom; etat.interne = interne; tick(); },
    sousEtape(interne) { etat.interne = interne; tick(); },
    uniteFinie(nom) {
      const i = etat.raf.indexOf(nom);
      if (i >= 0) etat.raf.splice(i, 1);
      etat.faits.push(nom);
      if (etat.courant === nom) { etat.courant = null; etat.interne = null; }
      tick();
    },
    final() { emettre(true, true); },
  };
}
