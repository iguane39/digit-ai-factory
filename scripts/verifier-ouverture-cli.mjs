#!/usr/bin/env node
/**
 * verifier-ouverture-cli.mjs — L'OUVERTURE D'UNE SESSION REND LA MAIN AU CLIENT SOUS SON DÉLAI, ET
 * C'EST LE CLI QUI LE DIT (TF-1635, critères (a), (b) et (d), 14/10/2026).
 *
 * LE FAIT. Le CLI Claude Code ne répond à la requête d'initialisation du client qu'après la fin de
 * TOUS les hooks SessionStart synchrones ; l'extension VS Code abandonne au-delà de 60 s (« check
 * authentication and network connectivity », sans rapport avec la cause). Le 12/10, le hook
 * d'ouverture du pilot, synchrone, a dépassé ce délai (73 531 ms mesurés le 13/10) : session perdue.
 * Le palliatif (hook asynchrone) est livré ; cette sonde en fait une PREUVE rejouable au lieu d'une
 * consigne.
 *
 * CE QU'ELLE JOUE. Pour le pilot (`.claude/settings.json`) et pour un produit
 * (`gabarits/settings-produit.json`), elle lance le CLI en mode flux (`-p --input-format stream-json`)
 * avec les hooks SessionStart DÉCLARÉS, envoie la requête d'initialisation que le client envoie, et
 * mesure le temps jusqu'à sa réponse. Aucun appel de modèle : l'initialisation n'en fait pas.
 *   · les hooks SYNCHRONES sont les vrais, commande comprise (chemins rendus absolus) : ce sont eux
 *     qui bloquent l'initialisation ;
 *   · les hooks ASYNCHRONES gardent leur déclaration, mais leur commande est remplacée par une attente
 *     de `--ralenti` secondes (70 par défaut) : c'est le tirage réseau ralenti du critère (b), sans
 *     tirer réellement le pilot ni les forges depuis une recette ;
 *   · `--sommeil-injecte <s>` ajoute à la partie bloquante un hook synchrone qui attend s secondes :
 *     c'est le sens rouge du critère (d) — à 70, la sonde doit échouer.
 * Les réglages utilisateur du poste (greffons compris) restent chargés : ils bloquent aussi
 * l'initialisation réelle. Les réglages du projet ne le sont pas : la sonde passe les siens.
 *
 * Usage : node scripts/verifier-ouverture-cli.mjs [--seuil 30] [--ralenti 70] [--sommeil-injecte <s>]
 *                                                  [--cibles pilot,produit] [--json]
 *         node scripts/verifier-ouverture-cli.mjs --plafond   (remesure du plafond de contexte d'un
 *                                                  hook : APPEL DE MODÈLE, voir lib-budget-contexte.mjs)
 * Exit : 0 sous le seuil · 1 au moins une cible au-delà (ou sans réponse) · 2 CLI absent, non jugé.
 * Seuil par défaut : 30 s, la moitié du délai du client — « nettement inférieur à 60 s ».
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
const args = process.argv.slice(2);
const val = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };
const SEUIL_S = Number(val("--seuil", 30));
const RALENTI_S = Number(val("--ralenti", 70));
const SOMMEIL_S = args.includes("--sommeil-injecte") ? Number(val("--sommeil-injecte", 70)) : 0;
const CIBLES = val("--cibles", "pilot,produit").split(",").map((s) => s.trim()).filter(Boolean);
const JSON_OUT = args.includes("--json");
const WIN = process.platform === "win32";

/** Le CLI est-il là ? `null` si absent. */
export function versionCli() {
  const r = spawnSync(WIN ? "claude --version" : "claude", WIN ? [] : ["--version"], { encoding: "utf8", shell: WIN, timeout: 30000 });
  return r.status === 0 ? (r.stdout || "").trim() : null;
}

// Le CLI fusionne deux hooks de même commande : chaque attente porte son étiquette, sans quoi le sommeil
// injecté, identique à l'attente d'un hook asynchrone, disparaissait derrière elle (mesuré le 14/10).
const attente = (s, etiquette) => `node -e "setTimeout(function(){},${Math.round(s * 1000)})" ${etiquette}`;

/**
 * Les hooks SessionStart d'un fichier de réglages, prêts pour la sonde : synchrones réels (chemin du
 * script rendu absolu depuis `base`), asynchrones ralentis, sommeil injecté en tête s'il est demandé.
 */
export function hooksSonde(settings, base, { ralenti = RALENTI_S, sommeil = 0 } = {}) {
  const groupes = ((settings.hooks || {}).SessionStart || []).map((g) => ({
    ...g,
    hooks: (g.hooks || []).map((h) => {
      if (h.async === true) return { ...h, command: attente(ralenti, "tirage-ralenti") };
      const cmd = String(h.command || "").replace(/^node\s+("?)([^\s"]+)\1/, (m, q, p) => (isAbsolute(p) ? m : `node "${join(base, p)}"`));
      return { ...h, command: cmd };
    }),
  }));
  if (sommeil > 0) groupes.unshift({ matcher: "startup|resume", hooks: [{ type: "command", command: attente(sommeil, "sommeil-injecte"), timeout: sommeil + 30 }] });
  return { hooks: { SessionStart: groupes } };
}

/** Lance le CLI avec ces réglages et mesure le temps jusqu'à la réponse d'initialisation. */
export function mesurerInit(fichierReglages, { cwd, delaiMs }) {
  return new Promise((ok) => {
    const t0 = Date.now();
    const argv = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose",
      "--no-session-persistence", "--setting-sources", "user", "--settings", `"${fichierReglages}"`];
    // Sous Windows, le CLI est un .cmd : lancé par le shell, en une seule chaîne (les arguments à part sont dépréciés).
    const p = WIN ? spawn(["claude", ...argv].join(" "), { cwd, shell: true, stdio: ["pipe", "pipe", "pipe"], windowsHide: true })
      : spawn("claude", argv.map((a) => a.replace(/^"|"$/g, "")), { cwd, stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    let fini = false, tampon = "", hooks = 0;
    const tuer = () => {
      try { if (WIN) spawnSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" }); else p.kill("SIGKILL"); } catch { /* déjà terminé */ }
    };
    const finir = (r) => { if (fini) return; fini = true; clearTimeout(minuteur); tuer(); ok({ ...r, hooks_vus: hooks }); };
    const minuteur = setTimeout(() => finir({ ms: null, depasse: true, motif: `aucune réponse d'initialisation en ${delaiMs} ms` }), delaiMs);
    p.stdout.on("data", (d) => {
      tampon += d;
      let i;
      while ((i = tampon.indexOf("\n")) >= 0) {
        const l = tampon.slice(0, i); tampon = tampon.slice(i + 1);
        if (/"subtype":"hook_started"/.test(l)) hooks++;
        if (/"type":"control_response"/.test(l) && /"request_id":"sonde-init"/.test(l)) finir({ ms: Date.now() - t0, depasse: false });
      }
    });
    p.on("exit", (code) => finir({ ms: null, depasse: true, motif: `CLI terminé (code ${code}) avant la réponse d'initialisation` }));
    p.stdin.write(JSON.stringify({ type: "control_request", request_id: "sonde-init", request: { subtype: "initialize" } }) + "\n");
  });
}

/** Prépare les cibles : { nom, reglages (objet), base (résolution des chemins), cwd (session) }. */
function cibles(atelier) {
  const out = [];
  if (CIBLES.includes("pilot")) {
    out.push({ nom: "pilot", source: ".claude/settings.json", reglages: JSON.parse(readFileSync(join(PILOT, ".claude", "settings.json"), "utf8")), base: PILOT });
  }
  if (CIBLES.includes("produit")) {
    const P = join(atelier, "produit");
    mkdirSync(join(P, "forge", "hooks"), { recursive: true });
    copyFileSync(join(PILOT, "gabarits", "hooks-factory.mjs"), join(P, "forge", "hooks", "factory.mjs"));
    out.push({ nom: "produit", source: "gabarits/settings-produit.json", reglages: JSON.parse(readFileSync(join(PILOT, "gabarits", "settings-produit.json"), "utf8")), base: P });
  }
  return out;
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (lanceEnDirect && args.includes("--plafond")) {
  console.error("--plafond : remesure manuelle, appel de modèle payant en jetons. Protocole et résultats du 14/10/2026 : oracles/lib-budget-contexte.mjs ; "
    + "rejouer en déclarant un hook SessionStart qui injecte N caractères (marqueur au milieu et à la fin), puis `claude -p --model haiku` en demandant de recopier les marqueurs sans outil.");
  process.exit(2);
}
if (lanceEnDirect) {
  const version = versionCli();
  if (!version) {
    const v = { controle: "verifier-ouverture-cli", verdict: "SKIP", motif: "CLI `claude` absent de ce poste : l'initialisation n'est pas mesurable ici" };
    console.log(JSON_OUT ? JSON.stringify(v) : `[SKIP] ${v.motif}`);
    process.exit(2);
  }
  const atelier = mkdtempSync(join(tmpdir(), "sonde-ouverture-"));
  const resultats = [];
  try {
    for (const c of cibles(atelier)) {
      const f = join(atelier, `reglages-${c.nom}.json`);
      const sonde = hooksSonde(c.reglages, c.base, { ralenti: RALENTI_S, sommeil: c.nom === "pilot" || CIBLES.length === 1 ? SOMMEIL_S : 0 });
      writeFileSync(f, JSON.stringify(sonde, null, 1), "utf8");
      const vide = join(atelier, `session-${c.nom}`); mkdirSync(vide, { recursive: true });
      const m = await mesurerInit(f, { cwd: vide, delaiMs: (SEUIL_S + 5) * 1000 });
      const sync = sonde.hooks.SessionStart.flatMap((g) => g.hooks).filter((h) => h.async !== true).length;
      const asyncs = sonde.hooks.SessionStart.flatMap((g) => g.hooks).filter((h) => h.async === true).length;
      resultats.push({ cible: c.nom, source: c.source, hooks_synchrones: sync, hooks_asynchrones_ralentis: asyncs, ...m, ok: !m.depasse && m.ms <= SEUIL_S * 1000 });
    }
  } finally { try { rmSync(atelier, { recursive: true, force: true }); } catch { /* verrou résiduel */ } }
  const verdict = resultats.every((r) => r.ok) ? "PASS" : "FAIL";
  const sortie = { controle: "verifier-ouverture-cli", version: "1.0.0", cli: version, seuil_s: SEUIL_S, ralenti_async_s: RALENTI_S, sommeil_injecte_s: SOMMEIL_S, verdict, resultats,
    non_juge: [
      "le contenu des hooks asynchrones : remplacés par une attente de --ralenti s, ils ne tirent ni le pilot ni les forges ; leur déclaration async est, elle, la vraie",
      "le délai propre de l'extension VS Code (60 s) : constaté au journal du 12/10, non rejoué ici ; la sonde mesure la réponse du CLI à la requête que l'extension envoie",
      "les réglages du projet ouvert autres que SessionStart : seuls les hooks SessionStart bloquent l'initialisation",
    ] };
  if (JSON_OUT) console.log(JSON.stringify(sortie, null, 1));
  else {
    for (const r of resultats) console.log(`[${r.ok ? "PASS" : "FAIL"}] ${r.cible} (${r.source}) : ${r.ms === null ? r.motif : `initialisation en ${r.ms} ms`} — seuil ${SEUIL_S} s, ${r.hooks_synchrones} hook(s) synchrone(s) réel(s), ${r.hooks_asynchrones_ralentis} asynchrone(s) ralenti(s) à ${RALENTI_S} s${SOMMEIL_S ? `, sommeil injecté ${SOMMEIL_S} s` : ""}`);
    console.log(`verifier-ouverture-cli (${version}) : ${verdict}`);
  }
  process.exit(verdict === "PASS" ? 0 : 1);
}
