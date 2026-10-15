/**
 * lib-gestes-avant-releve.mjs — UN GESTE FAIT AVANT LA FIN DU RELEVÉ D'OUVERTURE SE DÉCLARE (TF-1635,
 * invariant 3 et critère (c), 14/10/2026).
 *
 * LE FAIT. Le hook d'ouverture tourne en asynchrone depuis le 13/10 (palliatif TF-1635) : l'extension
 * VS Code coupe à 60 s une initialisation que son `bootstrap --pull` dépassait. Le coût de ce palliatif
 * a été constaté le jour même : le relevé, gates R-44 compris, est arrivé APRÈS le premier échange.
 * Les gestes de ce premier tour se font donc sur l'état d'avant le tirage, et rien ne le disait.
 *
 * CE QUI EST FAIT. Le hook reçoit sur son entrée le chemin de la transcription de la session
 * (`transcript_path`, entrée standard des hooks). À la fin de son relevé, il y relit les appels
 * d'outil faits entre son propre démarrage et l'instant présent : ce sont les gestes faits avant que
 * la fraîcheur soit établie. Il les déclare EN TÊTE du relevé et en garde une trace locale (fichier
 * des métadonnées git du dépôt ouvert : rien de suivi, rien de publié). Une session qui n'a encore
 * rien fait ne reçoit aucune ligne.
 *
 * CE QUI N'EST PAS FAIT, et c'est déclaré : le geste n'est pas empêché. L'empêcher demanderait un
 * hook PreToolUse sur tous les outils, joué à chaque appel de la session entière pour un risque qui
 * ne dure que le temps du tirage.
 */
import { readFileSync } from "node:fs";

/** L'entrée JSON d'un hook, lue sur l'entrée standard ; `null` hors d'un hook (terminal, recette). */
export function lireEntreeHook() {
  if (process.stdin.isTTY) return null;
  try {
    const brut = readFileSync(0, "utf8");
    return brut.trim() ? JSON.parse(brut) : null;
  } catch { return null; }
}

/**
 * Les appels d'outil d'une transcription (texte JSONL) faits dans la fenêtre [debutMs, finMs].
 * Rend `[{ ts, outil }]`, dans l'ordre de la transcription.
 */
export function gestesDansFenetre(transcription, debutMs, finMs) {
  const out = [];
  for (const ligne of String(transcription || "").split(/\r?\n/)) {
    if (!ligne.includes("tool_use")) continue;
    let e; try { e = JSON.parse(ligne); } catch { continue; }
    if (e.type !== "assistant" || !e.timestamp) continue;
    const t = Date.parse(e.timestamp);
    if (!(t >= debutMs && t <= finMs)) continue;
    for (const c of (e.message && e.message.content) || []) if (c && c.type === "tool_use") out.push({ ts: e.timestamp, outil: String(c.name || "?") });
  }
  return out;
}

/** Les lignes de déclaration, vides s'il n'y a aucun geste. */
export function lignesGestesAvant(gestes) {
  if (!gestes.length) return [];
  const outils = [...new Set(gestes.map((g) => g.outil))];
  return [
    `## Gestes faits AVANT la fin de ce relevé (TF-1635) : ${gestes.length}`,
    `- ${gestes.length} appel(s) d'outil (${outils.join(", ")}) entre ${gestes[0].ts} et ${gestes[gestes.length - 1].ts}, pendant que le tirage et les contrôles ci-dessous tournaient : ils ont lu l'état d'AVANT. Les reprendre si ce relevé change ce qu'ils supposaient (version d'une forge, règle de session, défaut du poste).`,
    "",
  ];
}
