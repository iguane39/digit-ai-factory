#!/usr/bin/env node
/**
 * verifier-formulaire-entra.test.mjs — le formulaire Entra de la première visite se juge sans
 * appeler Azure : un site et un « Entra » factices tournent sur la boucle locale (TF-1519).
 *
 * Rouges : le cas du 30/09/2026 (production répondant AADSTS700038, sans formulaire possible) ;
 * une adresse de retour inconnue (AADSTS50011).
 * Verts : l'application reconnue (`login_required`), l'application qui demande un consentement
 * (`consent_required` : le formulaire s'affichera).
 * Bornes, jamais FAIL : accès ouvert (200), accès direct refusé (403), réponse non reconnue,
 * AADSTS50168 (présentation de la sonde), adresse injoignable.
 * Propriétés : la sonde rejoue l'autorisation avec `prompt=none` (l'Entra factice refuse sinon) et
 * se présente avec le jeton Firefox mesuré plus son en-tête déclaratif.
 * Joué par `oracles\self-tests.mjs`.
 */
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-formulaire-entra.mjs");
let pass = 0, fail = 0;
const check = async (nom, fn) => {
  try { await fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const egal = (a, b, msg) => { if (a !== b) throw new Error(`${msg} : attendu ${b}, obtenu ${a}`); };

// Un seul serveur joue le site (Easy Auth : redirection vers Entra) et Entra (réponse au prompt=none).
const vus = [];
const serveur = createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  vus.push({ chemin: u.pathname, ua: req.headers["user-agent"], sonde: req.headers["x-sonde"], prompt: u.searchParams.get("prompt") });
  if (u.pathname === "/tid/oauth2/v2.0/authorize") {
    if (u.searchParams.get("prompt") !== "none") { res.writeHead(400); return res.end("sans prompt=none"); }
    const id = u.searchParams.get("client_id");
    res.writeHead(200, { "content-type": "text/html" });
    if (id === "PROD") return res.end("<html>AADSTS700038: Identity is not an application in tenant</html>");
    if (id === "RETOUR") return res.end("<html>AADSTS50011: The redirect URI does not match</html>");
    if (id === "CHROME") return res.end("<html>AADSTS50168: Chrome</html>");
    if (id === "OK") return res.end("<form method=\"POST\"><input type=\"hidden\" name=\"error\" value=\"login_required\"></form>");
    if (id === "CONSENT") return res.end("<form method=\"POST\"><input type=\"hidden\" name=\"error\" value=\"consent_required\"></form>");
    return res.end("<html>bonjour</html>");
  }
  const m = /^\/site-(\w+)$/.exec(u.pathname);
  if (m && m[1] === "ouvert") { res.writeHead(200); return res.end("ok"); }
  if (m && m[1] === "ferme") { res.writeHead(403); return res.end("interdit"); }
  if (m) {
    res.writeHead(302, { location: `https://login.microsoftonline.com/tid/oauth2/v2.0/authorize?client_id=${m[1].toUpperCase()}&redirect_uri=https%3A%2F%2Fexemple%2F.auth%2Flogin%2Faad%2Fcallback&response_mode=form_post` });
    return res.end();
  }
  res.writeHead(404); res.end();
});
await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
const port = serveur.address().port;

const lancer = (adresse, ...extra) => new Promise((resolve) => {
  const p = spawn(process.execPath, [OUTIL, adresse, ...extra], { stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  p.on("close", (code) => { let j = null; try { j = JSON.parse(out); } catch { /* illisible */ } resolve({ code, j, out }); });
});
const site = (nom) => `http://127.0.0.1:${port}/site-${nom}`;
const sonder = (nom, ...extra) => lancer(site(nom), "--hote-entra", `http://127.0.0.1:${port}`, ...extra);

await check("ROUGE — la production du 30/09/2026 répond AADSTS700038 : FAIL, exit 1, le code et le sens sont rendus", async () => {
  const r = await sonder("prod");
  egal(r.code, 1, "code de sortie");
  egal(r.j.aadsts, "AADSTS700038", "code AADSTS");
  if (!/aucun formulaire/.test(r.j.message)) throw new Error("le message ne dit pas qu'aucun formulaire n'est possible");
  egal(r.j.findings.length, 1, "findings");
});
await check("ROUGE — une adresse de retour inconnue (AADSTS50011) : FAIL, exit 1", async () => {
  const r = await sonder("retour");
  egal(r.code, 1, "code de sortie");
  egal(r.j.aadsts, "AADSTS50011", "code AADSTS");
});
await check("VERT — l'application reconnue (login_required) : PASS, exit 0", async () => {
  const r = await sonder("ok");
  egal(r.code, 0, "code de sortie");
  egal(r.j.verdict, "PASS", "verdict");
});
await check("VERT — l'application qui demande un consentement : PASS, le formulaire s'affichera", async () => {
  const r = await sonder("consent");
  egal(r.code, 0, "code de sortie");
  if (!/Approbation requise/.test(r.j.message)) throw new Error("le message ne nomme pas le formulaire");
});
await check("BORNE — accès ouvert (200) : SKIP, exit 2, jamais FAIL", async () => {
  const r = await sonder("ouvert");
  egal(r.code, 2, "code de sortie");
  egal(r.j.verdict, "SKIP", "verdict");
});
await check("BORNE — accès direct refusé (403) : SKIP, exit 2", async () => {
  const r = await sonder("ferme");
  egal(r.code, 2, "code de sortie");
  if (!/403/.test(r.j.motif)) throw new Error("le motif ne cite pas le 403");
});
await check("BORNE — AADSTS50168 (présentation de la sonde) : SKIP, pas un constat sur l'application", async () => {
  const r = await sonder("chrome");
  egal(r.code, 2, "code de sortie");
});
await check("BORNE — réponse non reconnue : SKIP, exit 2", async () => {
  const r = await sonder("autre");
  egal(r.code, 2, "code de sortie");
});
await check("BORNE — adresse injoignable : SKIP, exit 2, jamais FAIL", async () => {
  const r = await lancer("http://127.0.0.1:1/site-prod");
  egal(r.code, 2, "code de sortie");
});
await check("PROPRIÉTÉ — la sonde rejoue l'autorisation avec prompt=none et se présente en Firefox, déclarée par X-Sonde", async () => {
  vus.length = 0;
  await sonder("ok");
  const a = vus.find((v) => v.chemin === "/tid/oauth2/v2.0/authorize");
  if (!a) throw new Error("l'autorisation n'a pas été sondée");
  egal(a.prompt, "none", "prompt");
  if (!/Firefox/.test(a.ua) || /Chrome/.test(a.ua)) throw new Error("agent utilisateur : " + a.ua);
  egal(a.sonde, "digit-ai-verifier-formulaire-entra", "en-tête déclaratif");
});
await check("PROPRIÉTÉ — l'option --user-agent remplace l'agent utilisateur", async () => {
  vus.length = 0;
  await sonder("ok", "--user-agent", "Sonde-Test/1");
  egal(vus.find((v) => v.chemin === "/tid/oauth2/v2.0/authorize")?.ua, "Sonde-Test/1", "agent utilisateur");
});
await check("ENTRÉE — sans adresse http(s), exit 2", async () => {
  const r = await lancer("pas-une-adresse");
  egal(r.code, 2, "code de sortie");
});

serveur.close();
console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
