#!/usr/bin/env node
/**
 * hook-remise-agent.mjs — UN AGENT NE SE REMET PAS SANS LE VERDICT D'UN ORACLE DATÉ APRÈS SA DERNIÈRE ÉCRITURE DU FICHIER JUGÉ
 * (TF-2548, retour de factory-digit-ai-fr 20261114g, décision R-58 « A1, A2, A3, A4 » du 14/11/2026 ; classe `gate-cout-invite-au-contournement`).
 *
 * LE FAIT. Le 14/11/2026, au design du run `forge-digit-ai-fr-20261114a`, l'agent générateur B du studio de direction a vu trois de ses écritures refusées par
 * le hook qualité d'écriture (C7), plafond atteint ; ses corrections suivantes sont passées par la ligne de commande, que ce hook ne voit pas. Une page
 * servie a été écrite hors de toute garde pendant plusieurs passes, et n'a été rattrapée que parce que l'orchestrateur a rejoué la critique. Le hook de fin
 * de tour de la session (`hook-restitution.mjs`, CRITIQUE, D-82 (a)) juge déjà un fichier servi écrit dans le tour sans verdict de critique daté après sa
 * dernière écriture, commandes d'écriture comprises ; il ne voit pas la transcription d'un SOUS-AGENT, qui est à part (« NE VOIT PAS : l'écriture d'un
 * sous-agent »).
 *
 * CE QUE FAIT CE HOOK. Hook `SubagentStop` du pilot : à la fin d'un agent, il relit la transcription de CET agent et joue le même contrôle
 * (`critiqueDuTour` et `controlerCritique` de `hook-restitution.mjs`, un seul jeu de règles) : chaque fichier servi (page, feuille de style, script livrés à un
 * navigateur) que l'agent a écrit, par un outil d'écriture ou par une commande (`sed -i`, redirection, `tee`, copie), doit être suivi du verdict de la critique
 * d'implémentation (`run-oracles-design.mjs`, PASS ou FAIL, jamais SKIP) rendu APRÈS sa dernière écriture. Sinon la remise est REFUSÉE (`decision: "block"`) :
 * l'agent continue, joue la critique lui-même et cite son verdict. C'est la remise qui exige le verdict, quel que soit le moyen par lequel le fichier a été
 * écrit : le plafond de refus du hook d'écriture ne laisse plus la fin de l'agent passer sans lui.
 * Un second refus n'a pas lieu (`stop_hook_active`) : le défaut est alors DIT sous la réponse (`systemMessage`), jamais bouclé.
 *
 * NON JUGÉ (déclaré). Un fichier qui n'est pas servi (outillage, fixture, gabarit, brouillon du dossier temporaire : `fichierServi`) ; un oracle autre que la
 * critique d'implémentation, faute d'un verdict que la transcription porterait ; une page produite par un générateur lancé en commande (`node generer.mjs`) ;
 * le plafond de refus du hook d'écriture lui-même (`qo-gate-write.mjs`, forge-agents), que ce hook ne change pas ; un harnais sans `SubagentStop`.
 * Chez un produit, le hook n'est pas posé : l'héritage ne le porte pas.
 *
 * Usage : node oracles\hook-remise-agent.mjs      (stdin : JSON du hook SubagentStop : `agent_transcript_path` ou `transcript_path` + `agent_id`)
 * Exit : toujours 0 ; le refus sort sur stdout en JSON `decision: "block"`, l'avertissement en `systemMessage`.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { controlerCritique, critiqueDuTour, RAPPEL_CRITIQUE } from "./hook-restitution.mjs";
import { racineDuProjet } from "./lib-racine-projet.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

/** La transcription de l'agent : `agent_transcript_path` du hook, sinon le fichier que le harnais écrit à côté de celle de la session. */
export function transcriptDeLAgent(entree) {
  if (typeof entree?.agent_transcript_path === "string" && existsSync(entree.agent_transcript_path)) return entree.agent_transcript_path;
  const session = entree?.transcript_path, id = entree?.agent_id;
  if (typeof session !== "string" || typeof id !== "string" || !/^[\w-]+$/.test(id)) return null;
  const f = join(session.replace(/\.jsonl$/i, ""), "subagents", `agent-${id}.jsonl`);
  return existsSync(f) ? f : null;
}

/** Les enregistrements d'une transcription JSONL (une ligne illisible est sautée). */
export function lireTranscript(texte) {
  const entrees = [];
  for (const l of String(texte).split(/\r?\n/)) {
    if (!l.trim()) continue;
    try { entrees.push(JSON.parse(l)); } catch { /* ligne tronquée : sautée */ }
  }
  return entrees;
}

/** Juge la remise d'un agent sur sa transcription : { verdict: "PASS" | "FAIL" | "SANS_OBJET", ecarts, servis, sans }. */
export function jugerRemise(entrees, { racine = "" } = {}) {
  const c = controlerCritique({ critique: critiqueDuTour(entrees, { racine }) });
  return { verdict: c.verdict, ecarts: c.ecarts, servis: (c.servis || []).map((s) => s.fichier), sans: (c.sans || []).map((s) => ({ fichier: s.fichier, motif: s.motif })) };
}

export const messageRefus = (j, agent) => `[remise d'agent — TF-2548] ${agent ? `l'agent « ${agent} » ne peut pas se remettre : ` : "la remise est refusée : "}${j.ecarts.join(" ; ")}. `
  + "C'est la remise qui exige le verdict, quel que soit le moyen par lequel le fichier a été écrit (outil, commande, après un refus du hook d'écriture). " + RAPPEL_CRITIQUE;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let entree = {};
  try { entree = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { /* entrée illisible : rien à juger */ }
  try {
    const chemin = transcriptDeLAgent(entree);
    if (chemin) {
      const j = jugerRemise(lireTranscript(readFileSync(chemin, "utf8")), { racine: racineDuProjet(entree.cwd) });
      if (j.verdict === "FAIL") {
        const journal = process.env.FORGE_HOOKS_JOURNAL || join(ICI, "..", ".claude", "hooks-journal.jsonl");
        try {
          mkdirSync(dirname(journal), { recursive: true });
          appendFileSync(journal, JSON.stringify({ ts: new Date().toISOString(), hook: "remise-agent", session: entree.session_id || null, agent: entree.agent_type || null, agent_id: entree.agent_id || null,
            verdict: "FAIL", servis: j.servis.length, sans_verdict: j.sans, deja_refuse: !!entree.stop_hook_active }) + "\n");
        } catch { /* journal facultatif */ }
        if (entree.stop_hook_active) process.stdout.write(JSON.stringify({ systemMessage: `${messageRefus(j, entree.agent_type)} (déjà refusée une fois : l'agent est laissé finir, le défaut est dit ici)` }) + "\n");
        else process.stdout.write(JSON.stringify({ decision: "block", reason: messageRefus(j, entree.agent_type) }) + "\n");
      }
    }
  } catch { /* une panne du hook ne retient jamais la fin d'un agent */ }
  process.exit(0);
}
