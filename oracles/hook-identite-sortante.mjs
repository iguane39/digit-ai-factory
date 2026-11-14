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
 * SEULE LA REQUÊTE EST JUGÉE (TF-1978, 20/10/2026). Une commande composée se coupe hors guillemets ;
 * seuls les segments qui émettent la requête sont lus. Un hôte propre de l'utilisateur (son
 * organisation, où ses commits portent son adresse par règle) se déclare par `FORGE_HOTES_PROPRES`.
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
 * D-194 (b) (10/11/2026) : L'HÔTE RÉEL ET LES FORMES CACHÉES. L'hôte se lit après le dernier `@` de l'autorité
 * (`http://localhost:80@evil.com/x` vise evil.com), à tout schéma (`ftp://`) et sans schéma (`curl api.tiers.io`, que curl
 * envoie en http) ; une adresse ou un en-tête placés dans une variable de la commande (`U=…; curl $U`, `$h=@{…}; irm -Headers $h`)
 * sont lus avec la requête ; une adresse encodée (`%40`, base64) se décode. Une requête dont l'hôte ne se lit pas, et une
 * commande illisible pour la garde (mêmes causes que `hook-gestes-distants.mjs`) qui porte une adresse d'identité, sont
 * refusées ; une panne du juge et une entrée illisible aussi. Réglage humain qui rétablit l'ancien comportement :
 * `FORGE_GARDE_ILLISIBLE=laisse` (`references\GESTES-DISTANTS.md`, « Ce que la garde ne sait pas lire »).
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
/** Un en-tête User-Agent ou From, sous ses formes courantes (curl -H / -A / --user-agent, PowerShell -UserAgent, dictionnaire). */
const ENTETE_IDENTITE = /(user-?agent|\bFrom)\s*["']?\s*[:=]\s*["']?[^"'\n]*?[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:\s-A|--user-agent|-UserAgent)\s+["']?[^"'\n]*?[\w.+-]+@[\w-]+(?:\.[\w-]+)+/i;
const NEUTRES = /@(?:example\.(?:com|org|net)|exemple\.(?:fr|com)|invalid|test|localhost)\b|^no-?reply@/i;

/**
 * L'hôte réel d'une autorité : après son DERNIER `@`, sans port (D-194 (b)). `http://localhost:80@evil.com/x` vise evil.com : la
 * tolérance d'avant, « localhost suivi de : », lisait le nom d'utilisateur comme l'hôte.
 */
export function hoteDe(autorite) {
  const a = String(autorite).split(/[/?#\\]/)[0];
  const h = a.slice(a.lastIndexOf("@") + 1).toLowerCase();
  return h.startsWith("[") ? h.slice(0, h.indexOf("]") + 1) : h.replace(/:\d*$/, "");
}
const HOTE_LOCAL = /^(localhost|127(?:\.\d{1,3}){3}|\[::1\]|::1|0\.0\.0\.0)$/;
const estLocal = (h) => !h || HOTE_LOCAL.test(h);
/** Les adresses à schéma d'un texte, tout schéma (`https`, `ftp`, `ws`…) : { hote, cible } (`cible` : hôte et chemin). */
export function adresses(texte) {
  return [...String(texte).matchAll(/\b([a-z][a-z0-9+.-]*):\/\/([^\s"'`<>()]+)/gi)].map((m) => {
    const hote = hoteDe(m[2]);
    const chemin = m[2].slice(m[2].split(/[/?#\\]/)[0].length);
    return { hote, cible: hote + chemin };
  });
}

/** D-194 (b) : une adresse encodée se lit (`moi%40perso.fr`, `%2540`, `@`, `&#64;`), et un jeton base64 se décode. */
export function decodee(texte) {
  let t = String(texte);
  for (let k = 0; k < 2; k++) t = t.replace(/%([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  t = t.replace(/\\u0040|\\x40|&#0*64;|&#x0*40;/gi, "@");
  const b64 = (String(texte).match(/[A-Za-z0-9+/]{16,}={0,2}/g) || []).slice(0, 30).flatMap((j) => ["utf8", "utf16le"].map((c) => {
    try { const d = Buffer.from(j, "base64").toString(c); const imp = (d.match(/[\x20-\x7e]/g) || []).length; return d && imp / d.length >= 0.9 ? d : null; } catch { return null; }
  })).filter(Boolean);
  return [t, ...b64].join("\n");
}

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

/**
 * Les segments d'une commande, coupés sur `&&`, `||`, `;`, `|` et les fins de ligne HORS guillemets
 * (TF-1978). Un séparateur dans un corps entre guillemets ne coupe rien : sinon une adresse placée
 * après un « ; » du corps d'un curl sortirait du segment jugé.
 */
export function segments(commande) {
  const out = [];
  let cur = "", q = null;
  const s = String(commande);
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (q) { cur += ch; if (ch === q && s[k - 1] !== "\\") q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === ";" || ch === "\n" || ch === "|" || (ch === "&" && s[k + 1] === "&")) {
      out.push(cur); cur = "";
      if ((ch === "|" && s[k + 1] === "|") || ch === "&") k++;
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}

/**
 * Le texte de la requête que l'outil va émettre, ou null s'il n'émet pas de requête vers un tiers.
 * Pour une commande, SEULS les segments qui émettent la requête sont rendus (TF-1978, 20/10/2026) :
 * `git -c user.email=<adresse> commit … && curl https://dev.azure.com/…` était refusé pour l'adresse
 * d'un commit local, que la requête ne portait pas.
 */
export function requeteSortante(entree, lecteur = null) {
  const outil = String(entree?.tool_name || "");
  const i = entree?.tool_input || {};
  if (outil === "WebFetch") {
    const u = String(i.url || "");
    const distants = adresses(u).filter((a) => !estLocal(a.hote));
    return distants.length ? { texte: u, distants: distants.map((a) => a.cible), inconnu: false } : null;
  }
  if (outil !== "Bash" && outil !== "PowerShell") return null;
  // D-194 (b) : une variable que la commande affecte (`U=https://…; curl $U`, `$h=@{…}; irm -Headers $h`) se lit avec la requête.
  const commande = String(i.command || "");
  const dialecte = lecteur ? lecteur.dialecteDe(outil) : null;
  const ctx = lecteur ? lecteur.contexteDe(commande, dialecte) : null;
  const valeurDe = (nom) => ctx?.variables?.get(nom) ?? ctx?.variables?.get(String(nom).toLowerCase());
  const lues = (texte) => [...String(texte).matchAll(/\$(?:env:)?(?:\{([^}]+)\}|([A-Za-z_]\w*))|%([A-Za-z_]\w*)%/g)]
    .map((m) => valeurDe(m[1] ?? m[2] ?? m[3])).filter((v) => v !== undefined && v !== null);
  const emetteurs = [], distants = [];
  let inconnu = false;
  for (const p of pipelines(commande)) {
    const k = p.findIndex((x) => CLIENT_HTTP.test(x));
    if (k < 0) continue;
    const d = destinationsDe(p[k], lues(p[k]), dialecte, lecteur, ctx);
    const loin = d.filter((x) => !estLocal(x.hote));
    if (!loin.length && !d.inconnu) continue;
    emetteurs.push([...p.slice(0, k + 1), ...p.slice(0, k + 1).flatMap(lues)].join(" | "));
    distants.push(...loin.map((x) => x.cible));
    if (!loin.length) inconnu = true;
  }
  return emetteurs.length ? { texte: emetteurs.join("\n"), distants, inconnu } : null;
}

/** Les options de curl et wget qui prennent une valeur (forme courte) ; une option longue sans `=` en prend une, sauf ces drapeaux. */
const COURTES_A_VALEUR = { curl: new Set("AbcCdDeEFHKmoPQrtTuUwxXyYz"), wget: new Set("OoPUtTweiBaQlARDIX") };
const DRAPEAUX_LONGS = {
  curl: new Set(["silent", "show-error", "location", "compressed", "insecure", "fail", "fail-with-body", "head", "include", "verbose", "globoff", "get", "http1.0",
    "http1.1", "http2", "http2-prior-knowledge", "http3", "ipv4", "ipv6", "no-progress-meter", "progress-bar", "remote-name", "remote-name-all", "remote-header-name",
    "raw", "tlsv1", "tlsv1.0", "tlsv1.1", "tlsv1.2", "tlsv1.3", "path-as-is", "anyauth", "basic", "digest", "ntlm", "negotiate", "no-buffer", "no-keepalive",
    "no-sessionid", "create-dirs", "list-only", "ssl-reqd", "ssl", "tcp-nodelay", "styled-output", "trace-time", "retry-all-errors", "retry-connrefused",
    "proxy-insecure", "location-trusted", "post301", "post302", "post303", "ignore-content-length", "junk-session-cookies", "disable", "manual", "help", "version"]),
  wget: new Set(["quiet", "verbose", "no-verbose", "continue", "timestamping", "server-response", "spider", "recursive", "convert-links", "page-requisites", "mirror",
    "no-parent", "no-directories", "no-check-certificate", "content-disposition", "show-progress", "no-clobber", "inet4-only", "inet6-only", "debug", "version", "help",
    "background", "force-directories", "adjust-extension", "span-hosts", "relative", "delete-after", "no-host-directories", "no-cache", "no-cookies", "https-only"]),
};
const PS_INTERRUPTEURS = ["usebasicparsing", "usedefaultcredentials", "passthru", "disablekeepalive", "skipcertificatecheck", "skiphttperrorcheck", "skipheadervalidation",
  "allowunencryptedauthentication", "allowinsecureredirect", "preserveauthorizationonredirect", "proxyusedefaultcredentials", "resume", "noproxy"];

/** Les cibles d'un client HTTP en ligne de commande : les arguments que curl et wget envoient, le `-Uri` d'Invoke-WebRequest et d'Invoke-RestMethod. */
function ciblesDe(outil, args) {
  const cibles = [];
  if (outil === "curl" || outil === "wget") {
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      if (a.startsWith("--")) {
        const nom = a.slice(2).split("=")[0].toLowerCase(), valeur = a.includes("=") ? a.slice(a.indexOf("=") + 1) : null;
        if (nom === "url") { const v = valeur ?? args[++k]; if (v !== undefined) cibles.push(v); continue; }
        if (valeur === null && !DRAPEAUX_LONGS[outil].has(nom) && args[k + 1] !== undefined && !args[k + 1].startsWith("-")) k++;
        continue;
      }
      if (a.startsWith("-") && a.length > 1) {
        for (let j = 1; j < a.length; j++) if (COURTES_A_VALEUR[outil].has(a[j])) { if (j === a.length - 1) k++; break; }
        continue;
      }
      cibles.push(a);
    }
    return cibles;
  }
  for (let k = 0; k < args.length; k++) {
    const p = /^-([A-Za-z]+)(?::(.*))?$/.exec(args[k]);
    if (!p) { cibles.push(args[k]); break; }
    const nom = p[1].toLowerCase();
    if (nom.length >= 2 && "uri".startsWith(nom)) { cibles.push(p[2] ?? args[k + 1]); break; }
    if (p[2] === undefined && !PS_INTERRUPTEURS.some((s) => nom.length >= 3 && s.startsWith(nom)) && args[k + 1] !== undefined && !/^-[A-Za-z]/.test(args[k + 1])) k++;
  }
  return cibles.filter((c) => c !== undefined);
}

/**
 * Les destinations de l'étage qui émet : adresses à schéma de l'étage et des variables qu'il lit, cibles sans schéma (`curl api.tiers.io`),
 * cibles en variable résolue. Rend [{ hote, cible }] avec `inconnu` : une cible ne se lit pas (variable non résolue, aucune cible).
 */
function destinationsDe(etage, valeurs, dialecte, lecteur, ctx) {
  const d = [...adresses([etage, ...valeurs].join(" "))];
  d.inconnu = false;
  if (!lecteur) return d;
  const l = lecteur.localiser(lecteur.mots(etage, dialecte), dialecte, ctx);
  if (!l?.outil || !/^(curl|wget|irm|iwr|invoke-restmethod|invoke-webrequest)$/.test(l.outil)) return d;
  const cibles = ciblesDe(l.outil === "curl" || l.outil === "wget" ? l.outil : "ps", l.args);
  if (!cibles.length) d.inconnu = true;
  for (const c of cibles) {
    const v = c.includes("$") ? lecteur.resoudreTexte(c, ctx, dialecte) : c;
    if (v === null) { d.inconnu = true; continue; }
    const a = adresses(v);
    if (a.length) { d.push(...a); continue; }
    if (/^(?:[^\s/@]+@)?(?:[\w-]+(?:\.[\w-]+)+|localhost|\[[0-9a-f:]+\])(?::\d+)?(?:[/?#]\S*)?$/i.test(v)) { const hote = hoteDe(v); d.push({ hote, cible: hote + v.slice(v.split(/[/?#]/)[0].length) }); }
  }
  return d;
}

/**
 * Les tubes d'une commande : chacun liste ses étages, dans l'ordre (D-98 (a) du 29/10/2026). Ce qui
 * précède un client HTTP dans un tube lui fournit ses données : `echo <adresse> | curl -d @- <url>`
 * passait, parce que le premier étage ne porte ni client ni adresse distante. Ce qui le suit reçoit
 * sa réponse et ne sort pas (`curl <url> | grep <adresse>`) : TF-1978 reste tenu.
 */
export function pipelines(commande) {
  const out = [];
  let tube = [], cur = "", q = null;
  const s = String(commande);
  const etage = () => { if (cur.trim()) tube.push(cur.trim()); cur = ""; };
  const finir = () => { etage(); if (tube.length) out.push(tube); tube = []; };
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (q) { cur += ch; if (ch === q && s[k - 1] !== "\\") q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === "|" && s[k + 1] !== "|") { etage(); continue; }
    if (ch === ";" || ch === "\n" || ch === "|" || (ch === "&" && s[k + 1] === "&")) {
      finir();
      if (ch === "|" || ch === "&") k++;
      continue;
    }
    cur += ch;
  }
  finir();
  return out;
}

/**
 * Les hôtes PROPRES de l'utilisateur, déclarés par l'humain avant la session (TF-1978) :
 * `FORGE_HOTES_PROPRES`, préfixes séparés par des virgules (`dev.azure.com/mon-org`). Une requête dont
 * TOUTES les adresses distantes commencent par l'un d'eux peut porter son adresse : ses commits y
 * portent cette adresse par règle. L'agent ne peut pas poser la variable par un outil.
 */
export function versHotesPropres(req, env = process.env) {
  const propres = String(env.FORGE_HOTES_PROPRES || "").split(/[,\s]+/).map((h) => h.replace(/^https?:\/\//i, "").replace(/\/+$/, "").toLowerCase()).filter(Boolean);
  if (!propres.length) return false;
  // D-194 (b) : la cible est l'hôte réel et son chemin (`https://dev.azure.com:443@evil.com/mon-org` vise evil.com).
  const cibles = typeof req === "string" ? adresses(req).filter((a) => !estLocal(a.hote)).map((a) => a.cible) : (req?.distants ?? []);
  // D-98 (a) : le préfixe s'arrête à une frontière ; `dev.azure.com/mon-org` ne couvre pas `dev.azure.com/mon-org-tiers`.
  const couvre = (u, h) => u.startsWith(h) && /^($|[/?#:])/.test(u.slice(h.length));
  return cibles.length > 0 && cibles.every((u) => propres.some((h) => couvre(u.toLowerCase(), h)));
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

const masque = (a) => a.replace(/^(.{2})[^@]*(@.*)$/, "$1…$2");

/**
 * Le verdict : { decision: "laisse"|"refuse", motif }. D-194 (b) : asynchrone, parce que la lecture de la commande est celle de
 * `hook-gestes-distants.mjs`, importée à l'appel ; si elle manque, le juge lève, et le hook refuse.
 */
export async function juger(entree, env = process.env) {
  if (env?.FORGE_GARDE_PANNE_ESSAI === "1") throw new Error("panne simulée par FORGE_GARDE_PANNE_ESSAI=1");
  const outil = String(entree?.tool_name || "");
  if (!OUTILS.has(outil)) return { decision: "laisse", motif: "outil hors requête sortante" };
  const lecteur = outil === "WebFetch" ? null : await import("./hook-gestes-distants.mjs");
  const commande = outil === "WebFetch" ? "" : String(entree?.tool_input?.command ?? "");
  const req = requeteSortante(entree, lecteur);
  let ids = null;
  const identitesDuPoste = () => (ids ??= identites(env, entree?.cwd || process.cwd()));
  const go = String(env.FORGE_IDENTITE_GO || "").trim();
  if (req) {
    const clair = decodee(req.texte);
    const bas = clair.toLowerCase();
    const portees = identitesDuPoste().filter((a) => bas.includes(a));
    const enEntete = ENTETE_IDENTITE.test(clair) ? (clair.match(ADRESSE) || []).filter((a) => !NEUTRES.test(a)) : [];
    const fautes = [...new Set([...portees, ...enEntete.map((a) => a.toLowerCase())])];
    if (fautes.length) {
      if (go) return { decision: "laisse", motif: `demande consignée : ${env.FORGE_IDENTITE_GO}` };
      if (!req.inconnu && versHotesPropres(req, env)) return { decision: "laisse", motif: "requête vers un hôte propre de l'utilisateur, déclaré par FORGE_HOTES_PROPRES" };
      const humain = messagesHumains(entree?.transcript_path);
      if (fautes.every((a) => humain.includes(a))) return { decision: "laisse", motif: "adresse donnée par l'utilisateur dans la conversation" };
      return {
        decision: "refuse",
        motif: `IDENTITÉ SORTANTE REFUSÉE (R-62) — cette requête vers ${req.inconnu ? "un hôte que la garde ne sait pas lire (adresse dans une variable non résolue, ou aucune cible lisible ; D-194 (b))" : "un service tiers"} porte une adresse électronique `
          + `(${fautes.map(masque).join(", ")}) ${portees.length ? "de l'utilisateur" : "dans un en-tête User-Agent ou From"}, `
          + "sans demande de sa part. Le 14/10/2026, une adresse de l'utilisateur est partie ainsi chez une API publique (TF-1716). "
          + "Remède : un en-tête neutre (`User-Agent: digit-ai-factory`), sans adresse. Si l'utilisateur demande que son adresse "
          + "accompagne cet appel, il la donne dans la conversation, ou pose FORGE_IDENTITE_GO avant d'ouvrir la session.",
      };
    }
  }
  // D-194 (b), règle de famille : une adresse d'identité dans une commande que la garde ne sait pas lire est refusée.
  const clairCommande = lecteur ? decodee(commande) : "";
  if (lecteur && !go && clairCommande.includes("@") && !lecteur.garde_permissive(env)) {
    const bas = clairCommande.toLowerCase();
    const portees = identitesDuPoste().filter((a) => bas.includes(a));
    const causes = portees.length ? lecteur.causesIllisibles(commande, lecteur.dialecteDe(outil)) : [];
    if (causes.length && !portees.every((a) => messagesHumains(entree?.transcript_path).includes(a))) {
      return {
        decision: "refuse",
        illisible: causes,
        motif: `IDENTITÉ SORTANTE REFUSÉE (R-62, D-194 (b)) — la commande porte une adresse électronique de l'utilisateur (${portees.map(masque).join(", ")}), `
          + `et la garde ne sait pas la lire (${causes.join(" ; ")}) : elle ne peut pas dire si l'adresse part vers un service tiers. `
          + "Remède : réécris la commande lisiblement, ou retire l'adresse. Si l'utilisateur demande que son adresse accompagne un appel, "
          + "il la donne dans la conversation, ou pose FORGE_IDENTITE_GO avant d'ouvrir la session.",
      };
    }
  }
  return { decision: "laisse", motif: req ? "aucune donnée d'identité dans la requête" : "aucune requête vers un hôte tiers" };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  // D-194 (b) : une entrée illisible et une panne du juge refusent, sauf réglage humain FORGE_GARDE_ILLISIBLE=laisse. Avant,
  // « une panne du juge ne bloque jamais un outil » : une exception suffisait à faire partir l'adresse.
  const permissif = String(process.env.FORGE_GARDE_ILLISIBLE ?? "").trim().toLowerCase() === "laisse";
  const refuser = (motif) => { process.stderr.write(motif + "\n"); process.exit(2); };
  const motifPanne = (e) => `GARDE EN PANNE, REQUÊTE REFUSÉE (R-62, D-194 (b)) — le juge de l'identité sortante a levé une exception (${String(e).slice(0, 200)}) : `
    + "il ne peut pas dire si la requête porte une adresse de l'utilisateur, il la refuse. Remède : rejoue la commande ; si la panne persiste, rends la main "
    + "avec ce message : réparer le hook est un geste du pilot, et l'humain dispose d'un réglage de secours (references\\GESTES-DISTANTS.md, « Ce que la garde ne sait pas lire »).";
  process.on("uncaughtException", (e) => { if (permissif) process.exit(0); refuser(motifPanne(e)); });
  process.on("unhandledRejection", (e) => { if (permissif) process.exit(0); refuser(motifPanne(e)); });
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = null;
  try { entree = JSON.parse(brut); } catch { entree = null; }
  if (!entree || typeof entree !== "object" || Array.isArray(entree)) {
    if (permissif) process.exit(0);
    refuser("ENTRÉE ILLISIBLE, REQUÊTE REFUSÉE (R-62, D-194 (b)) — le hook n'a pas reçu du harnais un objet JSON lisible : il ne peut pas juger "
      + "la requête, il la refuse. Remède : rejoue la commande ; si le refus persiste, rends la main avec ce message.");
  }
  let v = { decision: "laisse" };
  try { v = await juger(entree); } catch (e) { if (permissif) process.exit(0); refuser(motifPanne(e)); }
  if (v.decision === "refuse") refuser(v.motif);
  process.exit(0);
}
