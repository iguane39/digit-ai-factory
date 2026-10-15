#!/usr/bin/env node
/**
 * hook-identite-sortante.mjs — R-62 SE JOUE SUR L'OUTIL qui envoie la requête (TF-1716, lot Produit-83
 * 20261014a, RT-5).
 *
 * LE FAIT. Le 14/10/2026, pendant un run de conception, la session a placé l'adresse électronique de
 * l'utilisateur dans l'en-tête `User-Agent` d'un appel à une API publique tierce (un annuaire
 * d'entreprises), sans qu'il l'ait demandé. Aucune garde ne l'a vu ; les appels suivants portaient
 * un en-tête neutre. Une donnée d'identité était partie chez un tiers, et rien ne permet de la
 * reprendre. Classe : `secret-porte-hors-perimetre` (récidive de TF-0616 et TF-1284).
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur `Bash`, `PowerShell` et `WebFetch`. Il lit l'entrée de
 * l'outil et REFUSE (exit 2, motif sur stderr) une requête HTTP vers un hôte tiers qui porte :
 *   · une adresse d'IDENTITÉ de l'utilisateur, où qu'elle soit dans la requête (adresse, en-tête,
 *     corps) — les adresses connues du poste : `git config user.email` (dossier courant, puis
 *     global) et la liste `FORGE_IDENTITES` (adresses séparées par des virgules) ;
 *   · ou n'importe quelle adresse électronique dans un en-tête `User-Agent` ou `From` : c'est la
 *     forme exacte du 14/10, et l'usage « contact dans l'agent » que certaines API publiques
 *     suggèrent se décide par l'humain, il ne se prend pas.
 * Une requête vers la machine locale (`localhost`, `127.0.0.1`, `::1`) n'est pas jugée.
 *
 * LA DEMANDE EXPLICITE, deux voies :
 *   · l'adresse figure dans un message HUMAIN de la session (transcript lu par `transcript_path`) :
 *     l'utilisateur l'a donnée lui-même dans la conversation ;
 *   · la variable `FORGE_IDENTITE_GO`, posée par l'humain avant d'ouvrir la session (un hook hérite
 *     de l'environnement du harnais : l'agent ne peut pas la poser par un outil).
 *
 * NON JUGÉ (déclaré). Une requête émise par un script dont le texte n'est pas dans la commande
 * (`python appel.py`) ; les autres données d'identité (nom, téléphone) ; une adresse donnée par
 * l'humain mais pour un autre usage que cet appel ; les outils `mcp__*` connectés.
 *
 * Usage : node oracles\hook-identite-sortante.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const OUTILS = new Set(["Bash", "PowerShell", "WebFetch"]);
const ADRESSE = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
/** Une commande qui ÉMET une requête HTTP : client en ligne de commande, ou client d'un langage dans la commande. */
export const CLIENT_HTTP = /\b(curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm|http(?:ie)?\s|requests\.(?:get|post|put|patch|request)|urllib|http\.client|fetch\s*\(|axios|WebClient|HttpClient)\b/i;
const URL_DISTANTE = /https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[?::1\]?)(?:[:/]|$))[^\s"'`)]+/i;
/** Un en-tête User-Agent ou From, sous ses formes courantes (curl -H / -A / --user-agent, PowerShell -UserAgent, dictionnaire). */
const ENTETE_IDENTITE = /(user-?agent|\bFrom)\s*["']?\s*[:=]\s*["']?[^"'\n]*?[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:\s-A|--user-agent|-UserAgent)\s+["']?[^"'\n]*?[\w.+-]+@[\w-]+(?:\.[\w-]+)+/i;
const NEUTRES = /@(?:example\.(?:com|org|net)|exemple\.(?:fr|com)|invalid|test|localhost)\b|^no-?reply@/i;

/** Les adresses d'identité connues du poste, en minuscules. */
export function identites(env = process.env, cwd = process.cwd()) {
  const out = new Set();
  for (const a of String(env.FORGE_IDENTITES || "").split(/[,;\s]+/)) if (a.includes("@")) out.add(a.toLowerCase());
  if (env.FORGE_IDENTITES_SANS_GIT !== "1") {
    for (const args of [["config", "--get", "user.email"], ["config", "--global", "--get", "user.email"]]) {
      try {
        const r = spawnSync("git", args, { cwd, encoding: "utf8", timeout: 3000 });
        const v = String(r.stdout || "").trim().toLowerCase();
        if (r.status === 0 && v.includes("@")) out.add(v);
      } catch { /* git absent : la liste de l'environnement suffit */ }
    }
  }
  return [...out].filter((a) => !NEUTRES.test(a));
}

/** Le texte de la requête que l'outil va émettre, ou null s'il n'émet pas de requête vers un tiers. */
export function requeteSortante(entree) {
  const outil = String(entree?.tool_name || "");
  const i = entree?.tool_input || {};
  if (outil === "WebFetch") {
    const u = String(i.url || "");
    return URL_DISTANTE.test(u) ? u : null;
  }
  if (outil === "Bash" || outil === "PowerShell") {
    const c = String(i.command || "");
    return CLIENT_HTTP.test(c) && URL_DISTANTE.test(c) ? c : null;
  }
  return null;
}

/** Les messages humains de la session, lus au transcript. */
export function messagesHumains(cheminTranscript) {
  if (!cheminTranscript || !existsSync(cheminTranscript)) return "";
  const out = [];
  try {
    for (const l of readFileSync(cheminTranscript, "utf8").split(/\r?\n/)) {
      if (!l.trim()) continue;
      let e; try { e = JSON.parse(l); } catch { continue; }
      if (e?.type !== "user" || e.isMeta) continue;
      const c = e.message?.content;
      if (typeof c === "string") out.push(c);
      else if (Array.isArray(c) && !c.some((b) => b.type === "tool_result")) out.push(c.filter((b) => b.type === "text").map((b) => b.text).join("\n"));
    }
  } catch { /* transcript illisible : aucune demande lue */ }
  return out.join("\n").toLowerCase();
}

/** Le verdict : { decision: "laisse"|"refuse", motif }. */
export function juger(entree, env = process.env) {
  if (!OUTILS.has(String(entree?.tool_name || ""))) return { decision: "laisse", motif: "outil hors requête sortante" };
  const req = requeteSortante(entree);
  if (!req) return { decision: "laisse", motif: "aucune requête vers un hôte tiers" };
  const bas = req.toLowerCase();
  const portees = identites(env, entree?.cwd || process.cwd()).filter((a) => bas.includes(a));
  const enEntete = ENTETE_IDENTITE.test(req) ? (req.match(ADRESSE) || []).filter((a) => !NEUTRES.test(a)) : [];
  const fautes = [...new Set([...portees, ...enEntete.map((a) => a.toLowerCase())])];
  if (!fautes.length) return { decision: "laisse", motif: "aucune donnée d'identité dans la requête" };
  if (String(env.FORGE_IDENTITE_GO || "").trim()) return { decision: "laisse", motif: `demande consignée : ${env.FORGE_IDENTITE_GO}` };
  const humain = messagesHumains(entree?.transcript_path);
  if (fautes.every((a) => humain.includes(a))) return { decision: "laisse", motif: "adresse donnée par l'utilisateur dans la conversation" };
  const masque = (a) => a.replace(/^(.{2})[^@]*(@.*)$/, "$1…$2");
  return {
    decision: "refuse",
    motif: `IDENTITÉ SORTANTE REFUSÉE (R-62) — cette requête vers un service tiers porte une adresse électronique `
      + `(${fautes.map(masque).join(", ")}) ${portees.length ? "de l'utilisateur" : "dans un en-tête User-Agent ou From"}, `
      + "sans demande de sa part. Le 14/10/2026, une adresse de l'utilisateur est partie ainsi chez une API publique (TF-1716). "
      + "Remède : un en-tête neutre (`User-Agent: digit-ai-factory`), sans adresse. Si l'utilisateur demande que son adresse "
      + "accompagne cet appel, il la donne dans la conversation, ou pose FORGE_IDENTITE_GO avant d'ouvrir la session.",
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
