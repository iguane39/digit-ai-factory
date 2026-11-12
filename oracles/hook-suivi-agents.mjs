#!/usr/bin/env node
/**
 * hook-suivi-agents.mjs — UN POINT DE SUIVI TOUTES LES 15 MINUTES POUR TOUT AGENT QUI TOURNE DEPUIS PLUS DE 15 MINUTES.
 *
 * LE FAIT. Le 12/11/2026, le porteur : « Certains agents tournent pendant des heures sans qu'on sache s'ils s'exécutent
 * encore ou s'ils sont morts. » Le suivi demandé dès le 11/08 (TF-0094) reposait sur un geste de la session (« arme un
 * guetteur », `gabarits/AGENT-CAMPAGNE.md`) que rien ne déclenchait ; il n'a tourné que chez 18 produits sur 35. Décision
 * D-209 (a) du 12/11/2026 : le suivi est exigé et prouvé par bancs (prompt 20261112g, `output/04-plans/`).
 *
 * LE PORTEUR DU MÉCANISME, mesuré le 12/11/2026 à 21:21 (essai `claude -p`, CLI 2.1.318) : un hook dont l'entrée porte
 * `"asyncRewake": true` tourne en arrière-plan et RÉVEILLE le modèle quand il sort en code 2, même après la fin du tour ;
 * sa sortie d'erreur entre au contexte (« Stop hook feedback »). Aucun geste de la session n'est requis : le hook Stop se
 * relance à chaque fin de tour, donc la veille se réarme seule après chaque point.
 *
 * DEUX MODES :
 *   · `--veille` (hook Stop, `asyncRewake: true`, délai 1200 s) : tant qu'un agent de la session est en course, attend
 *     l'échéance du prochain point (15 min après le lancement, puis après le dernier point), puis sort en code 2 avec le
 *     point rédigé. Une veille plus récente de la même session remplace la précédente (génération au fichier d'état).
 *     Sans agent en course, sort en 0, muette. Deux réveils d'une même session sont espacés de 4 min au moins.
 *   · défaut (hook PostToolUse, synchrone) : pendant un tour, si un agent ou le tour lui-même a passé l'échéance, met le
 *     point rédigé au contexte (`additionalContext`) ; vérifie au plus une fois par minute, rappelle au plus toutes les
 *     3 min. Sur l'outil Agent lancé en arrière-plan sans fichier d'avancement dans sa consigne, le dit.
 *
 * NON COUVERT, déclaré : une commande d'arrière-plan de la session (`run_in_background`) n'a ni transcript ni avancement,
 * elle n'est pas suivie (le harnais notifie sa fin) ; une session FERMÉE n'a plus de conversation, ses veilles meurent
 * avec elle (S67, `gabarits/RESTITUTION.md`) ; une session `claude -p` lancée par un script n'est pas un sous-agent.
 * Désactivation déclarée : `FORGE_SUIVI_AGENTS=0`.
 *
 * Usage : node oracles/hook-suivi-agents.mjs [--veille]   (stdin : JSON du hook)
 * Exit : 0, ou 2 en mode veille quand un point est dû (réveil).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { etatSuivi, redigerPoint, consignePoint, nommeUnAvancement, MINUTE } from "./lib-suivi-agents.mjs";

const POLL_MS = Number(process.env.FORGE_SUIVI_POLL_MS || 15000);
const ECART_REVEILS_MS = 4 * MINUTE;
const ECART_RAPPELS_MS = 3 * MINUTE;
const BORNE_VEILLE_MS = Number(process.env.FORGE_SUIVI_BORNE_VEILLE_MS || 19 * 60000); // sous le délai de 1200 s du hook

export function dossierEtat() { return process.env.FORGE_SUIVI_ETAT || join(tmpdir(), "suivi-agents"); }
export function lireEtat(session) {
  try { return JSON.parse(readFileSync(join(dossierEtat(), `${session}.json`), "utf8")); } catch { return {}; }
}
export function ecrireEtat(session, maj) {
  try {
    mkdirSync(dossierEtat(), { recursive: true });
    const e = { ...lireEtat(session), ...maj };
    writeFileSync(join(dossierEtat(), `${session}.json`), JSON.stringify(e));
    return e;
  } catch { return null; }
}

function lireStdin() {
  try { return JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { return {}; }
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Mode veille : rend { code, texte } — code 2 avec le point quand il est dû, 0 sinon. */
export async function veiller(entree, { maintenant = () => Date.now(), dormirMs = dormir } = {}) {
  const session = entree.session_id || "inconnue";
  const transcript = entree.transcript_path;
  if (!transcript || !existsSync(transcript)) return { code: 0, motif: "transcript introuvable" };
  const generation = `${maintenant()}-${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
  ecrireEtat(session, { generation_veille: generation, veille_lancee: new Date(maintenant()).toISOString() });
  const debut = maintenant();
  for (;;) {
    const etatFichier = lireEtat(session);
    if (etatFichier.generation_veille && etatFichier.generation_veille !== generation) return { code: 0, motif: "remplacée par une veille plus récente" };
    const t = maintenant();
    const etat = etatSuivi(transcript, t, { pointsDemandes: etatFichier.points_demandes || [] });
    if (!etat.enCourse.length) return { code: 0, motif: "aucun agent en course" };
    const dernierReveil = etatFichier.dernier_reveil ? Date.parse(etatFichier.dernier_reveil) : 0;
    const du = etat.echeance !== null && t >= etat.echeance;
    const borne = t - debut >= BORNE_VEILLE_MS; // jamais sortir muet tant qu'un agent court : la chaîne se casserait
    if ((du && t - dernierReveil >= ECART_REVEILS_MS) || borne) {
      const point = redigerPoint(etat, t);
      if (point) {
        ecrireEtat(session, { dernier_reveil: new Date(t).toISOString(), points_demandes: [...(etatFichier.points_demandes || []), new Date(t).toISOString()].slice(-20) });
        return { code: 2, texte: consignePoint(point), point };
      }
      if (borne) return { code: 0, motif: "borne atteinte sans agent à montrer" };
    }
    await dormirMs(POLL_MS);
  }
}

/** Mode en tour (PostToolUse) : rend le JSON à écrire sur stdout, ou null. */
export function enTour(entree, maintenant = Date.now()) {
  const session = entree.session_id || "inconnue";
  const transcript = entree.transcript_path;
  const sorties = [];
  // Un agent lancé en arrière-plan sans fichier d'avancement : ses tâches ne seront pas visibles (cause (a) du diagnostic).
  if ((entree.tool_name === "Agent" || entree.tool_name === "Task") && entree.tool_input) {
    const consigne = String(entree.tool_input.prompt || "");
    if (!nommeUnAvancement(consigne)) {
      sorties.push("[suivi-agents] La consigne de cet agent ne nomme aucun fichier d'avancement (`…avancement….jsonl`, section « Avancement des campagnes longues » de "
        + "gabarits/AGENT-CAMPAGNE.md) : ses points de suivi diront « non déclaré par l'agent » pour ses tâches faites et restantes.");
    }
  }
  if (transcript && existsSync(transcript)) {
    const e = lireEtat(session);
    const prochaine = e.verif_suivante ? Date.parse(e.verif_suivante) : 0;
    if (maintenant >= prochaine) {
      ecrireEtat(session, { verif_suivante: new Date(maintenant + MINUTE).toISOString() });
      const etat = etatSuivi(transcript, maintenant, { tourEnCours: true, pointsDemandes: e.points_demandes || [] });
      const dernierRappel = e.dernier_rappel ? Date.parse(e.dernier_rappel) : 0;
      if (etat.echeance !== null && maintenant >= etat.echeance && maintenant - dernierRappel >= ECART_RAPPELS_MS) {
        const point = redigerPoint(etat, maintenant);
        if (point) {
          ecrireEtat(session, { dernier_rappel: new Date(maintenant).toISOString(), points_demandes: [...(e.points_demandes || []), new Date(maintenant).toISOString()].slice(-20) });
          sorties.push(consignePoint(point, { enTour: true }));
        }
      }
    }
  }
  if (!sorties.length) return null;
  return { hookSpecificOutput: { hookEventName: entree.hook_event_name || "PostToolUse", additionalContext: sorties.join("\n\n") } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.env.FORGE_SUIVI_AGENTS === "0") process.exit(0);
  const entree = lireStdin();
  if (process.argv.includes("--veille")) {
    const r = await veiller(entree);
    if (r.code === 2) { process.stderr.write(r.texte + "\n"); process.exit(2); }
    process.exit(0);
  } else {
    try {
      const sortie = enTour(entree);
      if (sortie) process.stdout.write(JSON.stringify(sortie));
    } catch { /* un suivi en défaut ne bloque jamais un outil */ }
    process.exit(0);
  }
}
