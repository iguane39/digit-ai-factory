#!/usr/bin/env node
/**
 * hook-identite-sortante.test.mjs — R-62 portée par les outils qui émettent une requête (TF-1716).
 * Sens rouge : la forme exacte du 14/10/2026 (adresse de l'utilisateur dans `User-Agent` d'un appel à
 * une API publique) est REFUSÉE, sous curl, sous PowerShell et dans l'adresse d'un WebFetch ; une
 * adresse quelconque dans un en-tête User-Agent aussi. Sens vert : le REMÈDE que le refus propose
 * (en-tête neutre) passe, comme une requête locale, une commande qui n'émet rien, une adresse donnée
 * par l'utilisateur dans la conversation et la variable de demande consignée.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-identite-sortante.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// Une identité FICTIVE, déclarée par la variable ; git n'est pas lu, pour que le cas ne dépende pas du poste.
const MOI = "camille.essai@poste-fictif.fr";
const ENV = { ...process.env, FORGE_IDENTITES: MOI, FORGE_IDENTITES_SANS_GIT: "1" };
delete ENV.FORGE_IDENTITE_GO;
const T = mkdtempSync(join(tmpdir(), "idsort-"));
const jouer = (entree, env = ENV) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(entree), env });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
};
const bash = (command, extra = {}) => ({ tool_name: "Bash", cwd: T, tool_input: { command }, ...extra });
const API = "https://recherche-entreprises.api.gouv.fr/search?q=exemple";
const CAS_DU_14 = `curl -s -H "User-Agent: fiche-produit (${MOI})" "${API}"`;

check("rouge — le cas du 14/10 : l'adresse de l'utilisateur dans le User-Agent d'un appel curl à une API publique est refusée, R-62 nommée", () => {
  const r = jouer(bash(CAS_DU_14));
  if (r.code !== 2 || !/R-62/.test(r.out) || !/User-Agent/.test(r.out)) throw new Error(`exit ${r.code} : ${r.out}`);
  if (r.out.includes(MOI)) throw new Error("le motif recopie l'adresse en entier");
});
check("rouge — la même adresse sous PowerShell (-UserAgent) et dans l'adresse d'un WebFetch est refusée", () => {
  const p = jouer({ tool_name: "PowerShell", cwd: T, tool_input: { command: `Invoke-RestMethod -Uri "${API}" -UserAgent "fiche (${MOI})"` } });
  if (p.code !== 2) throw new Error(`PowerShell : exit ${p.code} — ${p.out}`);
  const w = jouer({ tool_name: "WebFetch", cwd: T, tool_input: { url: `${API}&contact=${MOI}`, prompt: "liste" } });
  if (w.code !== 2) throw new Error(`WebFetch : exit ${w.code} — ${w.out}`);
});
check("rouge — une adresse quelconque dans un en-tête User-Agent est refusée, même si elle n'est pas connue du poste", () => {
  const r = jouer(bash(`curl -A "outil (dominique.tiers@autre-domaine.fr)" "${API}"`));
  if (r.code !== 2) throw new Error(`exit ${r.code} — ${r.out}`);
});
check("vert — le remède du refus : le même appel avec un en-tête neutre passe", () => {
  const r = jouer(bash(`curl -s -H "User-Agent: digit-ai-factory" "${API}"`));
  if (r.code !== 0) throw new Error(`exit ${r.code} — ${r.out}`);
});
check("vert — une requête vers la machine locale, et une commande qui n'émet aucune requête, passent", () => {
  const l = jouer(bash(`curl -H "User-Agent: test (${MOI})" http://localhost:8080/sante`));
  if (l.code !== 0) throw new Error(`locale : exit ${l.code} — ${l.out}`);
  const g = jouer(bash(`git -c user.email=${MOI} commit -m "x"`));
  if (g.code !== 0) throw new Error(`git commit : exit ${g.code} — ${g.out}`);
});
check("vert — l'adresse donnée par l'utilisateur dans la conversation vaut demande : l'appel passe", () => {
  const p = join(T, "transcript.jsonl");
  writeFileSync(p, [
    { type: "user", message: { role: "user", content: `Pour l'annuaire, mets mon adresse ${MOI} dans l'agent, ils la demandent.` } },
    { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: "Entendu." }] } },
  ].map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
  const r = jouer(bash(CAS_DU_14, { transcript_path: p }));
  if (r.code !== 0) throw new Error(`exit ${r.code} — ${r.out}`);
});
check("vert — la demande consignée par FORGE_IDENTITE_GO laisse passer ; sans elle, le même appel reste refusé", () => {
  const r = jouer(bash(CAS_DU_14), { ...ENV, FORGE_IDENTITE_GO: "demande du 15/10 pour l'annuaire" });
  if (r.code !== 0) throw new Error(`exit ${r.code} — ${r.out}`);
  if (jouer(bash(CAS_DU_14)).code !== 2) throw new Error("sans la variable, l'appel n'est plus refusé");
});
check("vert — un outil qui n'émet pas de requête (Read) n'est pas jugé ; une entrée illisible ne bloque pas", () => {
  if (jouer({ tool_name: "Read", tool_input: { file_path: MOI } }).code !== 0) throw new Error("Read jugé");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json", env: ENV });
  if (r.status !== 0) throw new Error(`entrée illisible : exit ${r.status}`);
});

// TF-1978 (20/10/2026) : seule la requête est jugée, pas le reste de la commande.
const AZURE = "https://dev.azure.com/organisation-fictive/projet/_apis/git/repositories?api-version=7.1";
check("TF-1978 vert — la forme du 20/10 : un commit local à l'adresse de l'utilisateur, chaîné avant un curl sans adresse, passe", () => {
  const r = jouer(bash(`git -c user.email=${MOI} commit -q -m "essai" && curl -s -H "Authorization: Bearer $JETON" "${AZURE}"`));
  if (r.code !== 0) throw new Error(`exit ${r.code} — ${r.out}`);
});
check("TF-1978 rouge — l'adresse dans le segment qui émet reste refusée, même chaînée après un autre segment", () => {
  const r = jouer(bash(`cd /tmp ; curl -s -H "User-Agent: outil (${MOI})" "${API}"`));
  if (r.code !== 2) throw new Error(`exit ${r.code} — ${r.out}`);
});
check("TF-1978 rouge — un « ; » DANS un corps entre guillemets ne coupe pas la requête : l'adresse qui le suit est vue", () => {
  const r = jouer(bash(`curl -s -X POST "${API}" -d "nom=essai; contact=${MOI}"`));
  if (r.code !== 2) throw new Error(`exit ${r.code} — ${r.out}`);
});
check("TF-1978 vert — un hôte propre déclaré par FORGE_HOTES_PROPRES peut porter l'adresse ; un autre hôte, non", () => {
  const env = { ...ENV, FORGE_HOTES_PROPRES: "dev.azure.com/organisation-fictive" };
  const propre = jouer(bash(`curl -s -d "auteur=${MOI}" "${AZURE}"`), env);
  if (propre.code !== 0) throw new Error(`hôte propre : exit ${propre.code} — ${propre.out}`);
  const tiers = jouer(bash(`curl -s -d "auteur=${MOI}" "${API}"`), env);
  if (tiers.code !== 2) throw new Error(`hôte tiers : exit ${tiers.code} — ${tiers.out}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nhook-identite-sortante (R-62, TF-1716) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
