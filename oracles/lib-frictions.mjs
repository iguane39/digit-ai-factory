/**
 * lib-frictions.mjs — LES FRICTIONS D'UN TOUR, RELEVÉES SUR LE FAIT (TF-2141, décision humaine D-172 (b) du 04/11/2026, RT-43 de Produit-84).
 *
 * LE FAIT. Au registre du pilot, la classe `remontee-declaree-nulle-apres-correction` compte 5 occurrences en 23 jours sur 4 produits
 * (TF-1643, TF-1987, TF-1982, TF-2078, RT-42). Chacune a été close par un durcissement de S48 visant une FORMULATION du texte de la
 * restitution ; la suivante est passée par une autre formulation. Chez un même produit, deux jours de suite, c'est le porteur qui a
 * déclenché la remontée (« Pourquoi ce sujet n'est pas remonté à la Factory ? »). S48 lit le texte ; le tour, lui, est écrit dans la
 * transcription : un message qui corrige l'agent, un refus de hook, un oracle qui échoue.
 *
 * CE QUE CE MODULE FAIT, ET RIEN D'AUTRE.
 *   · `releveFrictions(segment)` rend les frictions d'un tour, typées `correction_humaine`, `refus_hook` ou `oracle_fail`. Pure.
 *   · `journaliserFrictions(...)` les ajoute à `frictions.jsonl` — au pilot `.claude/frictions.jsonl`, chez un produit
 *     `forge/frictions.jsonl` —, une ligne JSON par friction, sans doublon d'un passage du hook à l'autre. Ne lève jamais.
 *   · `controlerFrictions(...)` juge, chez un produit, la ligne « Remontée à la factory » contre ces frictions et le ledger.
 * Le journal est l'interface avec le chantier des leçons (`hook-lecons.mjs`), qui le lit pour savoir si une leçon rappelée a récidivé :
 * `{"ts","session","type","extrait"(≤ 200 caractères),"outil"(facultatif)}`. `ts` est l'heure de la friction dans la transcription.
 */
import { appendFileSync, existsSync, mkdirSync, openSync, readSync, closeSync, fstatSync } from "node:fs";
import { join, dirname } from "node:path";
import { decouperCommande } from "./lib-decoupe-commande.mjs";

const contenuDe = (e) => { const c = e?.message?.content; return Array.isArray(c) ? c : typeof c === "string" ? [{ type: "text", text: c }] : []; };
const texteDe = (e) => contenuDe(e).filter((b) => b.type === "text").map((b) => b.text || "").join("\n").trim();
const texteDuResultat = (b) => (typeof b.content === "string" ? b.content
  : Array.isArray(b.content) ? b.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("\n") : "");
/** Un extrait d'une ligne, 200 caractères au plus (interface du journal). */
export const resserrer = (s, n = 200) => { const t = String(s || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1) + "…" : t; };

// ---- LE MESSAGE HUMAIN RÉEL ------------------------------------------------------------------------------------------------------
//
// Une transcription range sous `type: "user"` bien plus que ce que le porteur tape : les résultats d'outils, les messages `isMeta`
// (retour du hook Stop « Stop hook feedback », messages d'une autre session), les notifications de tâche de fond (`origin.kind:
// "task-notification"`, sans `isMeta`), les résumés de compaction (« This session is being continued… », 16 sur 35 messages sans
// origine chez les produits du poste depuis le 01/10/2026) et les interruptions (« [Request interrupted by user] », 15). Un résumé
// de compaction cite les corrections d'avant : lu comme un message, il accuserait un tour d'une correction qui n'est pas la sienne.
// Depuis que Claude Code écrit `origin`, un message tapé porte `origin.kind: "human"` (621 des 846 messages texte des produits) ;
// sans `origin` (invite `claude -p`, versions antérieures), on écarte ces formes de machine par leur tête.
const FORME_MACHINE = /^\s*(?:<(?:task-notification|cross-session-message|local-command-(?:stdout|stderr|caveat)|user-prompt-submit-hook)\b|\[Request interrupted by user|This session is being continued from a previous conversation|Caveat: The messages below|Stop hook feedback)/i;

/** Un message tapé par l'humain : ni résultat d'outil, ni message système ou de hook, ni notification, ni résumé de compaction. */
export function estMessageHumainReel(e) {
  if (!e || e.type !== "user" || e.isMeta || e.isSidechain || e.isCompactSummary) return false;
  const blocs = contenuDe(e);
  if (!blocs.some((b) => b.type === "text") || blocs.some((b) => b.type === "tool_result")) return false;
  const origine = e.origin && typeof e.origin === "object" ? e.origin.kind : null;
  if (origine && origine !== "human") return false;
  return !FORME_MACHINE.test(texteDe(e));
}

// Ce que le message CITE n'est pas ce qu'il DIT : le fichier ouvert dans l'éditeur, le contenu collé, un bloc de code, une citation
// entre guillemets ou en tête de ligne `>`. « Non, ce n'est pas ce qu'on avait convenu » recopié d'un tiers ne corrige pas l'agent.
const BALISES_CITEES = /<(ide_opened_file|ide_selection|system-reminder|pasted_content|command-name|command-message|local-command-stdout|local-command-stderr|local-command-caveat|bash-input|bash-stdout|bash-stderr)\b[^>]*>[\s\S]*?<\/\1>/gi;
export function texteHumainNettoye(texte) {
  return String(texte || "")
    .replace(BALISES_CITEES, " ")
    .replace(/```[\s\S]*?(?:```|$)/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/«[^»]{0,600}»/g, " « » ")
    .replace(/“[^”]{0,600}”/g, " “ ” ")
    .replace(/"[^"\n]{0,400}"/g, ' " " ')
    .replace(/^[ \t]*>.*$/gm, " ");
}

// ---- LE VOCABULAIRE DE CORRECTION, FERMÉ -----------------------------------------------------------------------------------------
//
// Borné à l'agent : la deuxième personne (« pourquoi tu… », « tu as oublié »), le rappel d'une demande déjà faite (« j'ai déjà
// demandé »), ou une question « pourquoi » NÉGATIVE sur ce qui n'est pas fait, hors première personne. Le cas fondateur de RT-43,
// « Pourquoi ce sujet n'est pas remonté à la Factory ? », ne porte aucune deuxième personne : une borne à la seule deuxième personne
// l'aurait tu. La première personne est écartée parce qu'elle parle de la situation du porteur (« Pourquoi je ne peux pas
// développer directement sur le Cloud ? »), et une question positive sur un tiers (« pourquoi ce format est-il le défaut ? ») ne
// porte ni deuxième personne ni négation. `\<` et `\>` marquent le début et la fin d'un mot (lettres accentuées comprises).
const L = "(?<![\\p{L}\\p{N}_])", R = "(?![\\p{L}\\p{N}_])";
const re = (s) => new RegExp(s.replace(/\\</g, L).replace(/\\>/g, R), "iu");
export const VOCABULAIRE_CORRECTION = [
  { nom: "non en tête", motif: re(String.raw`(?:^|[.!?…]\s+|\n\s*)non\s*(?:[,.!:;]|$)`) },
  { nom: "pourquoi à la 2e personne", motif: re(String.raw`\<pourquoi\>[^?!.\n]{0,60}?(?:\<(?:tu|vous)\>|-(?:tu|vous)\>|\<t['’])`) },
  { nom: "pourquoi négatif", motif: re(String.raw`\<pourquoi\>(?!\s+(?:est-ce\s+qu(?:e\s+|['’]))?(?:je\>|j['’]|nous\>|moi\>))[^?!.\n]{0,120}?(?:\<n['’]|\<ne\>)[^?!.\n]{0,60}?\<(?:pas|jamais|plus|point)\>`) },
  { nom: "pourquoi … et pas …", motif: re(String.raw`\<pourquoi\>[^?!.\n]{0,80}?\<et\s+pas\>`) },
  { nom: "… pas …, pourquoi ?", motif: re(String.raw`(?:\<n['’]|\<ne\>)[^?!.\n]{0,80}?\<(?:pas|jamais|plus)\>[^?!.\n]{0,100}?,\s*pourquoi\s*\?`) },
  { nom: "déjà demandé", motif: re(String.raw`\<je\s+(?:t['’]|vous\s+)(?:l['’])?(?:avais|ai)\s+(?:d[ée]j[àa]\s+|pourtant\s+|bien\s+)?(?:dit|demand[ée]|pr[ée]cis[ée]|expliqu[ée]|r[ée]p[ée]t[ée]|indiqu[ée])\>|\<j['’](?:ai|avais)\s+(?:d[ée]j[àa]|pourtant)\s+(?:plusieurs\s+fois\s+)?(?:dit|demand[ée]|pr[ée]cis[ée]|expliqu[ée]|r[ée]p[ée]t[ée]|indiqu[ée])\>|\<alors\s+que\s+j['’](?:avais|ai)\s+(?:d[ée]j[àa]\s+|bien\s+)?(?:dit|demand[ée]|pr[ée]cis[ée])\>|\<comme\s+(?:d[ée]j[àa]|pr[ée]c[ée]demment)\s+(?:demand[ée]|dit|pr[ée]cis[ée])\>|\<(?:avait|a)\s+d[ée]j[àa]\s+[ée]t[ée]\s+(?:demand[ée]|dit|signal[ée]|pr[ée]cis[ée])\>`) },
  { nom: "toujours pas", motif: re(String.raw`\<toujours\s+pas\>`) },
  { nom: "encore une fois", motif: re(String.raw`\<encore\s+une\s+fois\>`) },
  { nom: "c'est faux", motif: re(String.raw`\<c['’]est\s+(?:faux|incorrect|inexact|erron[ée]e?|incompr[ée]hensible)\>|\<(?:ce\s+n['’]est|c['’]est)\s+pas\s+(?:ce\s+que|[çc]a\>|bon\>|correct|conforme|juste\>|le\s+bon\>|la\s+bonne\>)|\<pas\s+conformes?\>|\<ne\s+va\s+pas\>(?=\s*(?:[,.!;:]|$))`) },
  { nom: "tu as oublié", motif: re(String.raw`\<(?:tu\s+as|vous\s+avez)\s+oubli[ée]|\<(?:tu\s+n['’]as|vous\s+n['’]avez)\s+(?:pas|jamais|toujours\s+pas|rien)\s+(?:compris|fait|vu|lu|pris|suivi|respect[ée]|appliqu[ée]|tenu|r[ée]pondu|remont[ée]|test[ée]|v[ée]rifi[ée]|regard[ée]|corrig[ée]|mis|relu|utilis[ée]|r[ée]utilis[ée]|trait[ée]|lanc[ée]|ex[ée]cut[ée]|consign[ée])\>|\<(?:tu\s+aurais|vous\s+auriez)\s+d[uû]\>|\<(?:[çc]a|cela|ce|il|elle)\s+aurait\s+d[uû]\s+(?:[êe]tre|se\>|l['’])|\<tu\s+te\s+trompes\>|\<vous\s+vous\s+trompez\>`) },
  { nom: "recommence", motif: re(String.raw`(?<!\<et\s)\<recommence\>|\<refais\>|\<revois\s+ta\s+copie\>`) },
];

// « recommence » SEUL relance un geste interrompu (une copie coupée par un câble débranché), il ne critique rien : la relecture du
// premier jet l'a trouvé ainsi. Accompagné d'une critique (« Ces textes ne permettent pas de décider. Recommence. »), il corrige.
const RELANCE_SEULE = /^\s*(?:recommence|refais|r[ée]essaie|relance)\s*(?:stp|svp|s['’]il te pla[iî]t)?\s*[.!]*\s*$/iu;
/** La première correction lue dans un message humain : { nom, extrait } ou null. */
export function correctionHumaine(texte) {
  const t = texteHumainNettoye(texte);
  if (RELANCE_SEULE.test(t)) return null;
  for (const { nom, motif } of VOCABULAIRE_CORRECTION) {
    const m = motif.exec(t);
    if (!m) continue;
    const debut = Math.max(0, m.index - 40);
    return { nom, extrait: resserrer(t.slice(debut, debut + 260)) };
  }
  return null;
}

// ---- LE REFUS D'UN HOOK ----------------------------------------------------------------------------------------------------------
//
// Mesuré sur les 573 transcriptions des deux profils depuis le 01/10/2026 : un refus `PreToolUse` n'écrit qu'un résultat d'outil
// en erreur, « PreToolUse:<outil> hook error: [<commande du hook>]: <message> » (58 refus : 49 Bash, 8 PowerShell, 1 Artifact) ; un
// retour bloquant du hook Stop écrit une pièce jointe `hook_blocking_error` ET un message `isMeta` « Stop hook feedback: … » (321 de
// chaque). La pièce jointe fait foi ; le message ne sert qu'à défaut, pour une transcription qui n'en porte aucune.
const REFUS_AVANT_OUTIL = /^\s*(?:PreToolUse|PermissionRequest):([\w.-]+)\s+hook\s+(?:error|denied|blocked|refused)\b[^:\n]*:\s*(?:\[[^\]\n]*\]:\s*)?/i;

// ---- L'ÉCHEC D'UN ORACLE OU D'UN TEST --------------------------------------------------------------------------------------------
//
// Une commande LANCE un oracle ou un test quand l'une de ses commandes simples (`decouperCommande`) appelle un interpréteur sur un
// script dont le chemin porte `oracles/`, `oracle-` ou `.test.mjs`. Lire, chercher ou commiter un tel fichier n'est pas le lancer :
// un `grep` qui ne trouve rien sort en 1. Un programme en ligne (`-e`, `-p`, `-c`) ou un heredoc n'est pas un oracle.
const INTERPRETE = /^\s*(?:&\s*)?(?:[A-Za-z_]\w*=\S*\s+)*(?:(?:timeout|time)\s+(?:-\S+\s+)*(?:\d+\S*\s+)?)?["']?(?:[^\s"']*[\\/])?(?:node|python3?|py|deno|bun)(?:\.exe)?["']?\s+([\s\S]*)$/i;
const SCRIPT_ORACLE = /oracles[\\/]|oracle-|\.test\.mjs/i;
/** Le script d'oracle ou de test que la commande lance, ou null. */
export function commandeLanceOracle(commande) {
  for (const simple of decouperCommande(commande)) {
    if (/<</.test(simple)) continue;
    const m = INTERPRETE.exec(simple);
    if (!m) continue;
    let script = null;
    for (const jeton of m[1].match(/"[^"]*"|'[^']*'|\S+/g) || []) {
      const j = jeton.replace(/^["']|["']$/g, "");
      if (/^-(?:e|p|c|-eval|-print)$/i.test(j)) { script = null; break; }
      if (j.startsWith("-")) continue;
      script = j; break;
    }
    if (script && SCRIPT_ORACLE.test(script)) return script;
  }
  return null;
}
// Le même oracle s'appelle par plusieurs chemins (`oracles/x.mjs`, `C:/dev/…/oracles/x.mjs`) : son nom de fichier le désigne.
const nomDuScript = (script) => String(script || "").split(/[\\/]/).pop().toLowerCase();
/** Le verdict de TÊTE d'une sortie d'oracle (`verdict` d'un objet JSON au premier niveau), jamais celui d'un cas imbriqué. */
export function verdictDeTete(sortie) {
  const t = String(sortie || "").trim();
  try { const o = JSON.parse(t); if (o && typeof o === "object" && typeof o.verdict === "string") return o.verdict.toUpperCase(); } catch { /* plusieurs lignes */ }
  // Ligne à ligne, le premier verdict de tête l'emporte : un objet JSON qui porte `verdict`, ou un verdict en clair (« Verdict : PASS »),
  // que le point d'entrée de la critique d'implémentation écrit avant le détail de ses oracles (relecture du premier jet : un « Verdict :
  // PASS » de tête avait été lu FAIL sur le verdict d'un oracle interne, plus bas).
  let jsonLu = false;
  for (const l of t.split(/\r?\n/)) {
    const s = l.trim();
    const clair = /^Verdict\s*:\s*(PASS|FAIL|SKIP)\b/i.exec(s);
    if (clair) return clair[1].toUpperCase();
    if (!s.startsWith("{")) continue;
    try { const o = JSON.parse(s); jsonLu = true; if (o && typeof o.verdict === "string") return o.verdict.toUpperCase(); } catch { /* ligne non JSON */ }
  }
  if (jsonLu) return null;
  const m = /"verdict"\s*:\s*"(\w+)"/.exec(t);
  return m ? m[1].toUpperCase() : null;
}
/** L'échec que montre le résultat d'un oracle lancé : { signal, ligne } ou null. Le verdict de tête prime sur le code de sortie. */
export function echecDOracle(sortie) {
  const t = String(sortie || "");
  const code = /^\s*Exit code (\d+)/.exec(t);
  const corps = code ? t.slice(code[0].length) : t;
  const verdict = verdictDeTete(corps);
  const ligne = (corps.split(/\r?\n/).map((l) => l.trim()).find((l) => l && !/^[{}[\]]+,?$/.test(l)) || "");
  if (verdict === "FAIL") return { signal: `verdict FAIL${code ? `, exit ${code[1]}` : ""}`, ligne };
  if (verdict === "PASS" || verdict === "SKIP") return null;   // l'oracle dit lui-même qu'il n'a pas échoué (exit 2 : non jugeable)
  if (code && code[1] !== "0") return { signal: `exit ${code[1]}`, ligne };
  return null;
}

// ---- LE RELEVÉ -------------------------------------------------------------------------------------------------------------------

/**
 * Les frictions d'un segment de transcription — le tour, du message humain qui l'ouvre jusqu'au moment du jugement. Pure.
 * Rend [{ ts, type: "correction_humaine" | "refus_hook" | "oracle_fail", extrait (≤ 200), outil? , regle? }], dans l'ordre du tour.
 * `regle` nomme la forme du vocabulaire qui a reconnu une correction ; elle ne va pas au journal.
 */
export function releveFrictions(segment) {
  const out = [];
  const outils = new Map();
  const stopsJoints = [], stopsMeta = [];
  // Le dernier passage de chaque script d'oracle : un échec qu'un passage réussi du même script suit dans le tour est `resolu`.
  const echecsParScript = new Map();
  for (const e of segment || []) {
    if (!e || e.isSidechain) continue;
    if (e.type === "assistant") {
      for (const b of contenuDe(e)) if (b.type === "tool_use") outils.set(b.id, { nom: b.name, commande: String(b.input?.command || "") });
      continue;
    }
    if (e.type === "attachment" && e.attachment && e.attachment.type === "hook_blocking_error") {
      const a = e.attachment;
      const texte = typeof a.blockingError === "string" ? a.blockingError : a.blockingError?.blockingError || a.content || "";
      stopsJoints.push({ ts: e.timestamp || null, type: "refus_hook", outil: a.hookName || a.hookEvent || "Stop", extrait: resserrer(texte) });
      continue;
    }
    if (e.type !== "user") continue;
    if (estMessageHumainReel(e)) {
      const c = correctionHumaine(texteDe(e));
      if (c) out.push({ ts: e.timestamp || null, type: "correction_humaine", extrait: c.extrait, regle: c.nom });
      continue;
    }
    if (e.isMeta) {
      const t = texteDe(e);
      if (/^\s*Stop hook feedback\s*:/i.test(t)) stopsMeta.push({ ts: e.timestamp || null, type: "refus_hook", outil: "Stop", extrait: resserrer(t.replace(/^\s*Stop hook feedback\s*:\s*/i, "")) });
      continue;
    }
    for (const b of contenuDe(e)) {
      if (b.type !== "tool_result") continue;
      const t = texteDuResultat(b);
      const outil = outils.get(b.tool_use_id) || null;
      const refus = REFUS_AVANT_OUTIL.exec(t);
      if (refus) { out.push({ ts: e.timestamp || null, type: "refus_hook", outil: refus[1] || outil?.nom || null, extrait: resserrer(t.slice(refus[0].length)) }); continue; }
      if (!outil || (outil.nom !== "Bash" && outil.nom !== "PowerShell")) continue;
      const script = commandeLanceOracle(outil.commande);
      if (!script) continue;
      const echec = echecDOracle(t);
      if (echec) {
        const f = { ts: e.timestamp || null, type: "oracle_fail", outil: outil.nom, extrait: resserrer(`${script} → ${echec.signal}${echec.ligne ? ` : ${echec.ligne}` : ""}`), resolu: false };
        out.push(f);
        if (!echecsParScript.has(nomDuScript(script))) echecsParScript.set(nomDuScript(script), []);
        echecsParScript.get(nomDuScript(script)).push(f);
      } else if (!/^\s*Exit code [1-9]/.test(t)) for (const f of echecsParScript.get(nomDuScript(script)) || []) f.resolu = true;
    }
  }
  out.push(...(stopsJoints.length ? stopsJoints : stopsMeta));
  return out.map((f, i) => ({ f, i })).sort((a, b) => (Date.parse(a.f.ts || "") || 0) - (Date.parse(b.f.ts || "") || 0) || a.i - b.i).map((x) => x.f);
}

/**
 * Le tour des frictions dans une transcription déjà lue (entrées hors chaîne latérale) : depuis le dernier message humain RÉEL.
 * Une notification de tâche de fond ou un message d'une autre session ne rouvre pas le tour : la correction qui l'a précédée en
 * fait toujours partie. Rend { debut, depuis, segment } ; sans message humain réel, le tour est toute la transcription.
 */
export function tourDesFrictions(entrees) {
  let debut = -1;
  for (let i = (entrees || []).length - 1; i >= 0; i--) if (estMessageHumainReel(entrees[i])) { debut = i; break; }
  const segment = (entrees || []).slice(Math.max(0, debut));
  return { debut, depuis: debut >= 0 ? entrees[debut].timestamp || null : null, segment };
}

// ---- LE JOURNAL ------------------------------------------------------------------------------------------------------------------

/** Où s'écrit le journal : chez un produit (un `forge/retours/`) `forge/frictions.jsonl`, au pilot `.claude/frictions.jsonl`, ailleurs nulle part. */
export function cheminFrictions(racine) {
  if (!racine) return null;
  try {
    if (existsSync(join(racine, "forge", "retours"))) return join(racine, "forge", "frictions.jsonl");
    if (existsSync(join(racine, "bootstrap.mjs")) && existsSync(join(racine, "oracles", "hook-restitution.mjs"))) return join(racine, ".claude", "frictions.jsonl");
  } catch { /* racine illisible : aucun journal */ }
  return null;
}

// Le hook Stop passe plusieurs fois dans un même tour (un refus, puis la réécriture ; une notification de tâche, puis la suite) :
// chaque passage relit tout le tour. Une friction déjà écrite pour la session ne s'écrit pas deux fois. La clé est la friction
// elle-même (session, heure, type, extrait) ; la fin du journal suffit à la retrouver, le tour étant récent.
const FIN_RELUE = 256 * 1024;
const cleDe = (session, f) => `${session || ""}|${f.type}|${f.extrait}|${f.ts || ""}`;
function clesEcrites(chemin, session) {
  const cles = new Set();
  let fd = null;
  try {
    fd = openSync(chemin, "r");
    const taille = fstatSync(fd).size;
    const debut = Math.max(0, taille - FIN_RELUE);
    const tampon = Buffer.alloc(taille - debut);
    readSync(fd, tampon, 0, tampon.length, debut);
    for (const l of tampon.toString("utf8").split(/\r?\n/)) {
      if (!l.trim()) continue;
      let o; try { o = JSON.parse(l); } catch { continue; }
      if ((o?.session || null) !== (session || null)) continue;
      cles.add(cleDe(session, o));
      cles.add(cleDe(session, { ...o, ts: null }));
    }
  } catch { /* journal absent ou illisible : rien n'est encore écrit */ }
  finally { if (fd !== null) { try { closeSync(fd); } catch { /* déjà fermé */ } } }
  return cles;
}

/**
 * Ajoute les frictions du tour au journal. Ne lève jamais : une écriture ratée se dit dans le retour (`erreur`), le hook n'en bloque pas.
 * Rend { chemin, ecrites, deja, erreur? }.
 */
export function journaliserFrictions({ racine = null, session = null, frictions = [], chemin = cheminFrictions(racine), maintenant = new Date() } = {}) {
  if (!chemin) return { chemin: null, ecrites: 0, deja: 0, motif: "ni pilot ni produit : aucun journal des frictions" };
  if (!frictions.length) return { chemin, ecrites: 0, deja: 0 };
  try {
    const deja = clesEcrites(chemin, session);
    const neuves = frictions.filter((f) => !deja.has(cleDe(session, f)));
    if (neuves.length) {
      mkdirSync(dirname(chemin), { recursive: true });
      appendFileSync(chemin, neuves.map((f) => JSON.stringify({ ts: f.ts || maintenant.toISOString(), session, type: f.type,
        extrait: resserrer(f.extrait), ...(f.outil ? { outil: f.outil } : {}) })).join("\n") + "\n", "utf8");
    }
    return { chemin, ecrites: neuves.length, deja: frictions.length - neuves.length };
  } catch (e) { return { chemin, ecrites: 0, deja: 0, erreur: resserrer(e?.message || e) }; }
}

// ---- LE CONTRÔLE, CHEZ UN PRODUIT ------------------------------------------------------------------------------------------------

/** La ligne « Remontée à la factory » d'une restitution, lue comme S48 la lit (oracle-synthese). */
export const LIGNE_REMONTEE = /^[^\n]*remont[ée]e (?:à|a|vers) la factory[^\n]*$/im;
/**
 * La ligne déclare n'avoir rien à remonter : la forme de S48, sans lot nommé, et sans « reste au produit, parce que <motif> », que la
 * doctrine admet (TF-1643) et que S48 juge déjà contre le run ouvert (TF-1982) — la relecture du premier jet a trouvé une ligne qui
 * portait les deux (« rien à remonter. La contradiction de la fiche reste au produit, parce que… »).
 */
export const declareRienARemonter = (ligne) => {
  const l = String(ligne || "");
  return /rien (?:à|a) remonter/i.test(l) && !/RETOURS - \d{8}[a-z]+/.test(l) && !/\breste au produit,?\s+parce qu(?:e\s+\S|['’]\S)/i.test(l);
};

// ---- FRICTIONS (TF-2141, D-172 (b) du 04/11/2026) — « RIEN À REMONTER » APRÈS UNE FRICTION, SANS RETOUR AU LEDGER ----------------
//
// LA RÈGLE. Chez un produit (un `forge/retours/` à la racine du projet), quand le tour porte une friction RETENUE, que la ligne
// « Remontée à la factory » dit « rien à remonter » (sans lot nommé ni « reste au produit, parce que <motif> ») et qu'aucun retour
// n'est consigné depuis le message humain qui ouvre le tour — une entrée `type: retour` de `forge/ledger.jsonl`, ou une commande du
// tour qui l'écrit —, le contrôle rend FAIL en citant la friction, son type et son extrait. Au pilot et dans une forge : SANS_OBJET,
// seul le journal est écrit. Le remède est celui du CLAUDE.md des produits : « une friction forge se consigne au ledger au moment même ».
//
// LA MESURE D'ENTRÉE, rejouée en lecture seule le 04/11/2026 sur les transcriptions des produits du poste (profils `~/.claude` et
// `~/.claude-b`, 157 transcriptions de 15 produits, 68 et 89 par profil, du 01/10 au 04/11/2026) : 804 passages du hook Stop, 552
// restitutions portant la ligne, 347 qui disent « rien à remonter ». Chaque passage est rejoué sur la transcription telle qu'elle était.
//   · À LA LETTRE (toute friction compte), premier jet : 165 refus sur 129 tours. 111 n'avaient pour friction que le refus de forme de la
//     restitution par le hook Stop lui-même, la réécriture disant ensuite « rien à remonter ». Ce refus est déjà journalisé au pilot pour
//     chaque produit (`.claude/hooks-journal.jsonl`) et la garde anti-boucle ne refuse jamais la réécriture : il n'est pas retenu.
//   · SANS LE HOOK STOP, premier jet : 45 tours refusés, relus TOUS à la main selon la grille ci-dessous, 27 justes et 18 à tort (60 %).
//     Quatre des refus à tort venaient du relevé, corrigé ci-dessus : « est-ce que ça ne va pas trop loin ? » lu comme « ça ne va pas » ;
//     « recommence » seul, qui relançait une copie coupée par un câble ; une ligne qui disait aussi « reste au produit, parce qu'elle… » ;
//     un « Verdict : PASS » de tête lu FAIL sur un oracle interne. Relevé corrigé : 43 tours, 28 justes et 15 à tort (65 %).
//   · LES ÉCHECS D'ORACLE en portaient 15 sans autre friction : 12 à tort (10 brouillons refusés puis corrigés dans le tour, la boucle que
//     `--prejuger` prescrit « jusqu'à l'exit 0 » ; un coût que le porteur avait accepté ; un accès de compte refusé), 3 justes, chacun pour
//     autre chose que son oracle. Les 3 échecs qu'aucune réussite du même script ne suit dans le tour sont à tort aussi. Un échec d'oracle
//     se journalise donc, il n'est pas retenu par le contrôle.
//   · LA RÈGLE RETENUE (une correction humaine, ou le refus d'un hook avant outil) : 34 refus sur 28 tours, tous relus, 25 justes et 3 à
//     tort, soit 89,3 %. Les refus d'un hook avant outil : 14 tours, 14 justes (suppression par variable, remisage sans étiquette, identité
//     sortante). Les corrections humaines : 14 tours, 11 justes. Les 3 à tort sont des « pourquoi » sur un état voulu (un réglage verrouillé
//     par une décision du porteur, une fonction fermée exprès) ou sur une cause hors session (le jeton expiré d'un connecteur).
// ENTRÉE : AVERTISSANTE. La règle d'entrée (décision D-172 (b)) veut 90 % de refus justes pour bloquer ; 89,3 % n'y sont pas. Le constat
// s'affiche sous la réponse, `--prejuger` le rend à la session avant l'affichage, et le journal des hooks porte le champ `frictions` qui
// mesure la période d'avertissement. Pour bloquer : `FRICTIONS_BLOQUANTE = true`, après une nouvelle mesure ; `FORGE_FRICTIONS_BLOQUANTE=1`
// arme le refus sans toucher au code, pour la recette qui joue le chemin bloquant (même usage que `FORGE_CRITIQUE_BLOQUANTE_DES`).
//
// LA GRILLE DE RELECTURE (étude « Apprentissage des erreurs » 20261104b, section 1 Q1). Un refus est JUSTE quand le tour montre une
// erreur : un écart de la session, ou d'un outil de la Factory, à une règle, une demande ou un état qui existait au moment du geste,
// évitable, porté par un résultat livré ou par un geste tenté (pas par un brouillon que la boucle prescrite a corrigé). Il est À TORT
// quand la friction n'en montre aucune : une question neutre ou une demande nouvelle, une préférence ou une règle postérieure au geste,
// un choix contesté sans règle, un brouillon refusé puis corrigé, une cause hors de la session.
//
// CE QUE LE CONTRÔLE NE VOIT PAS, dit plutôt que promis : une correction écrite hors du vocabulaire (« focalise-toi sur tel site, pas
// sur tel autre ? ») ; une correction faite au tour d'avant, quand le tour jugé ne répond qu'à « 1a » ; « reste au produit, parce que le
// retour sera consigné » sans retour au ledger (4 passages sur la période, avec une friction retenue), forme que S48 juge contre le run
// ouvert ; « rien de neuf » sans « à remonter » (4 passages), que S48 dit ne pas trancher ; un retour écrit dans un autre ledger que
// celui du projet ; la pertinence du retour consigné, que l'humain tranche.
export const FRICTIONS_BLOQUANTE = process.env.FORGE_FRICTIONS_BLOQUANTE === "1";
/** Les frictions que le contrôle retient : une correction humaine, un refus de hook avant outil (pas le hook Stop, pas un oracle). */
export const frictionRetenue = (f) => f?.type === "correction_humaine" || (f?.type === "refus_hook" && !/^Stop\b/i.test(f.outil || ""));

export const RAPPEL_FRICTIONS = "Une friction du tour (une correction du porteur, le refus d'un hook) se consigne au ledger du produit au moment même : "
  + "`python forge/ledger.py retour --resume \"<la friction, et ce qui l'a corrigée>\"` (ou `ledger.mjs`), avec les 4 réponses du test de généralité "
  + "(`gabarits\\RETOURS-FORGES.md` du pilot), puis la ligne « Remontée à la factory » nomme le lot remis, ou dit « reste au produit, parce que <motif> ». "
  + "Une friction qui ne montre aucune erreur (une question neutre, un état voulu) se dit aussi, au même endroit, plutôt que « rien à remonter ».";

/**
 * Le contrôle. `frictions` vient de `releveFrictions`, `texte` est la restitution jugée, `racine` le projet du tour, `retourConsigne`
 * dit si un retour est consigné depuis le message humain qui ouvre le tour (le hook le lit au ledger et dans les commandes du tour).
 * Rend { applicable, verdict: SANS_OBJET | PASS | FAIL, bloquant, ecarts, retenues, motif? }.
 */
export function controlerFrictions({ frictions = [], texte = "", racine = "", retourConsigne = false } = {}) {
  const retenues = (frictions || []).filter(frictionRetenue);
  const sans = (motif) => ({ applicable: false, verdict: "SANS_OBJET", bloquant: false, ecarts: [], retenues, motif });
  if (!racine || !existsSync(join(racine, "forge", "retours"))) return sans("hors d'un produit (aucun forge/retours/ à la racine du projet) : seul le journal des frictions est écrit");
  if (!retenues.length) return sans(frictions.length ? "aucune friction retenue (refus du hook Stop et échecs d'oracle sont journalisés, pas jugés)" : "aucune friction relevée dans le tour");
  const ligne = (String(texte || "").match(LIGNE_REMONTEE) || [])[0] || null;
  if (!ligne) return sans("aucune ligne « Remontée à la factory » : S48 la réclame");
  if (!declareRienARemonter(ligne)) return { applicable: true, verdict: "PASS", bloquant: false, ecarts: [], retenues, motif: "la ligne nomme un lot ou garde le retour au produit" };
  if (retourConsigne) return { applicable: true, verdict: "PASS", bloquant: false, ecarts: [], retenues, motif: "un retour est consigné depuis le message humain du tour" };
  const cites = retenues.slice(0, 3).map((f) => `${f.type}${f.outil ? ` (${f.outil})` : ""} : « ${resserrer(f.extrait, 160)} »`).join(" ; ");
  return { applicable: true, verdict: "FAIL", bloquant: FRICTIONS_BLOQUANTE, retenues,
    ecarts: [`« ${resserrer(ligne, 120)} » dans un tour qui porte ${retenues.length} friction${retenues.length > 1 ? "s" : ""} — ${cites}${retenues.length > 3 ? ` (+${retenues.length - 3})` : ""} — `
      + "et aucun retour n'est consigné au ledger du produit depuis le message humain"] };
}
