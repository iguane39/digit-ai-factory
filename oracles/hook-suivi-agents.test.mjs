#!/usr/bin/env node
// Recette de hook-suivi-agents.mjs et lib-suivi-agents.mjs (prompt 20261112g, ÉTAPE 3) : chaque état et chaque garde joués
// sur une session fictive écrite dans un dossier temporaire, à double sens quand la règle a deux côtés.
// Horloge : les instants sont passés en argument (`maintenant`), aucune attente réelle ; FORGE_SUIVI_POLL_MS=1 pour la veille.
import { mkdtempSync, mkdirSync, writeFileSync, appendFileSync, utimesSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

process.env.FORGE_SUIVI_POLL_MS = "1";
const ETAT = mkdtempSync(join(tmpdir(), "suivi-etat-"));
process.env.FORGE_SUIVI_ETAT = ETAT;
const { estPointDeSuivi, etatSuivi, redigerPoint, agentsDeSession } = await import("./lib-suivi-agents.mjs");
const { veiller, enTour } = await import("./hook-suivi-agents.mjs");

const M = 60000;
let ok = 0, ko = 0;
const verifier = (nom, cond, detail = "") => { if (cond) ok++; else { ko++; console.log(`ÉCHEC — ${nom}${detail ? ` : ${detail}` : ""}`); } };

const T0 = Date.parse("2026-11-12T20:00:00Z");
const iso = (t) => new Date(t).toISOString();
const racine = mkdtempSync(join(tmpdir(), "suivi-session-"));

function session(nom, { humainA = T0, points = [] } = {}) {
  const dir = join(racine, nom);
  mkdirSync(join(dir, nom, "subagents"), { recursive: true });
  const lignes = [
    JSON.stringify({ type: "user", timestamp: iso(humainA), message: { role: "user", content: "Lance les agents de banc." } }),
    JSON.stringify({ type: "assistant", timestamp: iso(humainA + 30000), message: { role: "assistant", content: [{ type: "text", text: "Lancé." }] } }),
    ...points.map((t) => JSON.stringify({ type: "assistant", timestamp: iso(t), message: { role: "assistant", content: [{ type: "text", text: "Suivi agents\n- banc · actif (preuve de vie il y a 1 min) · faits : a · restants : b" }] } })),
  ];
  const transcript = join(dir, `${nom}.jsonl`);
  writeFileSync(transcript, lignes.join("\n") + "\n");
  return { transcript, sub: join(dir, nom, "subagents"), dir };
}

function agent(s, id, { lance, derniere, fini = false, av = null, description = "banc" }) {
  const avChemin = av ? join(s.dir, `avancement-${id}.jsonl`).replace(/\\/g, "/") : null;
  const lignes = [JSON.stringify({ type: "user", timestamp: iso(lance), agentId: id, message: { role: "user", content: `Banc. Fichier d'avancement : ${avChemin || "aucun"}` } })];
  lignes.push(JSON.stringify({ type: "assistant", timestamp: iso(derniere), agentId: id, message: { role: "assistant", content: [{ type: "tool_use", name: "Bash", input: {} }] } }));
  const f = join(s.sub, `agent-${id}.jsonl`);
  writeFileSync(f, lignes.join("\n") + "\n");
  writeFileSync(join(s.sub, `agent-${id}.meta.json`), JSON.stringify({ agentType: "general-purpose", description, finished: fini }));
  const recent = Math.max(derniere, Date.now() - 60000); // mtime récent : l'agent est lu (fenêtre de 48 h)
  utimesSync(f, recent / 1000, recent / 1000);
  if (av) {
    writeFileSync(avChemin, av.map((l) => JSON.stringify(l)).join("\n") + "\n");
    const tDernier = Date.parse(av[av.length - 1].ts);
    utimesSync(avChemin, tDernier / 1000, tDernier / 1000);
  }
  return f;
}

// 1. Forme du point de suivi, à double sens.
const vrai = "Suivi agents\n- banc (general-purpose) · actif (preuve de vie il y a 2 min) · faits : 3 étapes · restants : 2 étapes";
verifier("point vrai reconnu", estPointDeSuivi(vrai));
verifier("faux point (motif sans ligne d'agent mesurée) refusé", !estPointDeSuivi("Suivi agents\nTout va bien, les agents avancent."));
verifier("point dont l'âge manque refusé", !estPointDeSuivi("Suivi agents\n- banc · actif · faits : a · restants : b"));
verifier("synthèse titrée refusée même si elle commence par le motif", !estPointDeSuivi(`${vrai}\n## 2. Verdict\nPASS`));
verifier("motif hors première ligne refusé", !estPointDeSuivi(`Bonjour\n${vrai}`));
verifier("point qui pose une décision refusé", !estPointDeSuivi(`${vrai}\n> **D-12 — faut-il arrêter ?**`));
verifier("état « présumé arrêté » reconnu", estPointDeSuivi("Suivi agents\n- banc · présumé arrêté (preuve de vie il y a 18 min) · faits : a · restants : b"));

// 2. États mesurés de l'extérieur.
const s1 = session("s-etats");
const now = T0 + 30 * M;
agent(s1, "actif01", { lance: T0, derniere: T0 + 1 * M, av: [{ ts: iso(T0 + 28 * M), faits: ["e1", "e2"], restants: ["e3"] }], description: "actif" });
agent(s1, "fige001", { lance: T0, derniere: T0 + 1 * M, av: [{ ts: iso(T0 + 12 * M), faits: ["e1"], restants: ["e2"] }], description: "fige" });
agent(s1, "cmdlong", { lance: T0 + 10 * M, derniere: T0 + 11 * M, av: [{ ts: iso(T0 + 11 * M), commande: "recette", fin_attendue: iso(T0 + 35 * M), faits: [], restants: ["recette"] }], description: "commande" });
agent(s1, "silenc1", { lance: T0, derniere: T0 + 22 * M, description: "silencieux" });
agent(s1, "court01", { lance: T0 + 10 * M, derniere: T0 + 20 * M, fini: true, description: "court" });
const ags = Object.fromEntries(agentsDeSession(s1.transcript, now).map((a) => [a.nom.split(",")[0], a]));
verifier("actif : preuve de vie par l'avancement il y a 2 min", ags.actif?.etat === "actif", ags.actif?.etat);
verifier("figé : 18 min sans écriture → présumé arrêté", ags.fige?.etat === "présumé arrêté", ags.fige?.etat);
verifier("commande longue annoncée et non échue", ags.commande?.etat === "commande longue", ags.commande?.etat);
verifier("silencieux de 5 à 15 min", ags.silencieux?.etat === "silencieux", ags.silencieux?.etat);
verifier("fini noté par le harnais", ags.court?.etat === "fini", ags.court?.etat);
verifier("faits et restants lus à l'avancement", ags.actif?.faits === "e1, e2" && ags.actif?.restants === "e3");
verifier("sans avancement : « non déclaré par l'agent »", /non déclaré par l'agent/.test(redigerPoint(etatSuivi(s1.transcript, now), now)));
const cmdApres = Object.fromEntries(agentsDeSession(s1.transcript, T0 + 36 * M).map((a) => [a.nom.split(",")[0], a]));
verifier("commande longue échue → plus « commande longue »", cmdApres.commande?.etat === "présumé arrêté", cmdApres.commande?.etat);

// 3. Cadence : premier point à 15 min, puis 15 min après le dernier point couvrant ; agent court jamais montré.
const s2 = session("s-cadence");
agent(s2, "e2e0001", { lance: T0, derniere: T0 + 1 * M, av: [{ ts: iso(T0 + 13 * M), faits: ["a"], restants: ["b"] }] });
const e14 = etatSuivi(s2.transcript, T0 + 14 * M);
verifier("échéance du premier point à 15 min", e14.echeance === T0 + 15 * M, iso(e14.echeance));
const s3 = session("s-cadence2", { points: [T0 + 15.2 * M] });
agent(s3, "e2e0002", { lance: T0, derniere: T0 + 1 * M, av: [{ ts: iso(T0 + 16 * M), faits: ["a"], restants: ["b"] }] });
verifier("échéance suivante 15 min après le point", etatSuivi(s3.transcript, T0 + 20 * M).echeance === T0 + 30.2 * M);
const s4 = session("s-court");
agent(s4, "court02", { lance: T0, derniere: T0 + 10 * M, fini: true });
const e4 = etatSuivi(s4.transcript, T0 + 16 * M);
verifier("agent fini avant 15 min : aucun agent en course, aucun point", e4.enCourse.length === 0 && redigerPoint(e4, T0 + 16 * M) === null);
const s5 = session("s-fini", { points: [T0 + 15 * M] });
agent(s5, "long001", { lance: T0, derniere: T0 + 20 * M, fini: true, av: [{ ts: iso(T0 + 20 * M), faits: ["tout"], restants: [] }] });
agent(s5, "long002", { lance: T0, derniere: T0 + 29 * M, av: [{ ts: iso(T0 + 29 * M), faits: ["a"], restants: ["b"] }] });
const p30 = redigerPoint(etatSuivi(s5.transcript, T0 + 30 * M), T0 + 30 * M) || "";
verifier("agent fini après le dernier point : une dernière ligne « fini »", /· fini \(fin il y a/.test(p30), p30);
const s6 = session("s-fini2", { points: [T0 + 15 * M, T0 + 30 * M] });
agent(s6, "long003", { lance: T0, derniere: T0 + 20 * M, fini: true });
agent(s6, "long004", { lance: T0, derniere: T0 + 44 * M, av: [{ ts: iso(T0 + 44 * M), faits: ["a"], restants: ["b"] }] });
verifier("agent fini déjà montré : plus jamais", !/long003|fini \(/.test(redigerPoint(etatSuivi(s6.transcript, T0 + 45 * M), T0 + 45 * M) || ""));

const s7 = session("s-fini3");
agent(s7, "vieux01", { lance: T0, derniere: T0 + 20 * M, fini: true, description: "vieux" });
agent(s7, "vivant1", { lance: T0 + 200 * M, derniere: T0 + 214 * M });
verifier("sans point antérieur, agent fini depuis plus de 17 min : jamais montré", !/vieux/.test(redigerPoint(etatSuivi(s7.transcript, T0 + 215 * M), T0 + 215 * M) || ""));
const s8 = session("s-fini4");
agent(s8, "recent1", { lance: T0, derniere: T0 + 20 * M, fini: true, description: "recent" });
verifier("sans point antérieur, agent fini il y a 5 min : une ligne « fini »", /recent.* · fini \(/.test(redigerPoint(etatSuivi(s8.transcript, T0 + 25 * M), T0 + 25 * M) || ""));

// 4. Veille (hook Stop asyncRewake) : code 2 au point dû, 0 sans agent, remplacée par une plus récente.
const sv = session("s-veille");
agent(sv, "veil001", { lance: T0, derniere: T0 + 1 * M, av: [{ ts: iso(T0 + 14 * M), faits: ["a"], restants: ["b"] }] });
let horloge = T0 + 10 * M;
const r1 = await veiller({ session_id: "sv", transcript_path: sv.transcript }, { maintenant: () => horloge, dormirMs: async () => { horloge += 1 * M; } });
verifier("veille : réveil en code 2 à l'échéance", r1.code === 2 && horloge >= T0 + 15 * M && horloge <= T0 + 16 * M, `${r1.code} à ${iso(horloge)}`);
verifier("veille : le réveil porte un point de suivi", estPointDeSuivi(r1.point || ""), r1.point);
const s0 = session("s-vide");
const r0 = await veiller({ session_id: "s0", transcript_path: s0.transcript }, { maintenant: () => T0 });
verifier("veille : aucun agent → sortie 0 muette", r0.code === 0);
const sg = session("s-gen");
agent(sg, "gen0001", { lance: T0, derniere: T0 + 1 * M });
let hg = T0 + 2 * M;
const { ecrireEtat } = await import("./hook-suivi-agents.mjs");
const r2 = await veiller({ session_id: "sg", transcript_path: sg.transcript }, { maintenant: () => hg, dormirMs: async () => { ecrireEtat("sg", { generation_veille: "plus-recente" }); hg += M; } });
verifier("veille : remplacée par une veille plus récente → 0", r2.code === 0 && /remplacée/.test(r2.motif || ""), JSON.stringify(r2));
let hr = T0 + 15 * M;
const r3 = await veiller({ session_id: "sv", transcript_path: sv.transcript }, { maintenant: () => hr, dormirMs: async () => { hr += M; } });
verifier("veille : deux réveils espacés d'au moins 4 min", r3.code === 2 && hr - (T0 + 15 * M) >= 0, `${r3.code} ${iso(hr)}`);

// 5. En tour (PostToolUse) : rappel au point dû, silence avant ; consigne d'agent sans avancement signalée.
const st = session("s-tour", { humainA: T0 });
const avant = enTour({ session_id: "st1", transcript_path: st.transcript, tool_name: "Bash" }, T0 + 10 * M);
verifier("en tour : rien avant 15 min", avant === null);
const apres = enTour({ session_id: "st2", transcript_path: st.transcript, tool_name: "Bash" }, T0 + 16 * M);
verifier("en tour : tour de plus de 15 min → point au contexte", /Suivi agents\n- session principale/.test(apres?.hookSpecificOutput?.additionalContext || ""));
// L'outil d'un sous-agent porte `agent_id` : aucun rappel dans son contexte, et l'échéance de la session reste due.
const sousAgent = enTour({ session_id: "st5", transcript_path: st.transcript, tool_name: "Bash", agent_id: "a1b2c3", agent_type: "campagne" }, T0 + 16 * M);
verifier("en tour : outil d'un sous-agent → aucun rappel", sousAgent === null);
verifier("en tour : rappel encore dû à la session après l'outil du sous-agent", /Suivi agents/.test(enTour({ session_id: "st5", transcript_path: st.transcript, tool_name: "Bash" }, T0 + 16.2 * M)?.hookSpecificOutput?.additionalContext || ""));
const rep = enTour({ session_id: "st2", transcript_path: st.transcript, tool_name: "Bash" }, T0 + 16.5 * M);
verifier("en tour : vérification au plus une fois par minute", rep === null);
const encore = enTour({ session_id: "st2", transcript_path: st.transcript, tool_name: "Bash" }, T0 + 22 * M);
verifier("en tour : point demandé absent du transcript, pas de nouveau rappel avant 15 min", encore === null);
const ensuite = enTour({ session_id: "st2", transcript_path: st.transcript, tool_name: "Bash" }, T0 + 31.5 * M);
verifier("en tour : nouveau rappel 15 min après le point demandé", /Suivi agents/.test(ensuite?.hookSpecificOutput?.additionalContext || ""));
// Résumé de compaction écrit après le message humain, à une heure ANTÉRIEURE : il ne déplace pas le début du tour.
const sc = session("s-compact", { humainA: T0 + 60 * M });
appendFileSync(sc.transcript, JSON.stringify({ type: "user", isCompactSummary: true, isVisibleInTranscriptOnly: true, timestamp: iso(T0), message: { role: "user", content: "This session is being continued from a previous conversation." } }) + "\n");
verifier("en tour : résumé de compaction ignoré, tour neuf muet", enTour({ session_id: "sc1", transcript_path: sc.transcript, tool_name: "Bash" }, T0 + 61 * M) === null);
appendFileSync(sc.transcript, JSON.stringify({ type: "user", timestamp: iso(T0 + 62 * M), message: { role: "user", content: [{ type: "text", text: "A1 & A2" }] } }) + "\n");
verifier("en tour : message humain après le résumé → début de tour", enTour({ session_id: "sc2", transcript_path: sc.transcript, tool_name: "Bash" }, T0 + 78 * M) !== null);
const sansAv = enTour({ session_id: "st3", transcript_path: st.transcript, tool_name: "Agent", tool_input: { prompt: "Fais X." } }, T0 + 1 * M);
verifier("Agent sans fichier d'avancement signalé", /ne nomme aucun fichier d'avancement/.test(sansAv?.hookSpecificOutput?.additionalContext || ""));
const avecAv = enTour({ session_id: "st4", transcript_path: st.transcript, tool_name: "Agent", tool_input: { prompt: "Écris dans C:/t/campagne-x/avancement.jsonl" } }, T0 + 1 * M);
verifier("Agent avec fichier d'avancement : silence", avecAv === null);

// 6. Par le lanceur d'un produit (gabarits/hooks-factory.mjs copié en forge/hooks/factory.mjs) : la veille sort en code 2 et
// son point traverse le lanceur (sortie d'erreur), en temps réel — l'agent fictif a 16 min de course.
{
  const { spawnSync } = await import("node:child_process");
  const { copyFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname: dn } = await import("node:path");
  const ici = dn(fileURLToPath(import.meta.url));
  const produit = mkdtempSync(join(tmpdir(), "suivi-produit-"));
  mkdirSync(join(produit, "forge", "hooks"), { recursive: true });
  copyFileSync(join(ici, "..", "gabarits", "hooks-factory.mjs"), join(produit, "forge", "hooks", "factory.mjs"));
  const sr = session("s-lanceur", { humainA: Date.now() - 17 * M });
  agent(sr, "lanc001", { lance: Date.now() - 16 * M, derniere: Date.now() - 15 * M, av: [{ ts: iso(Date.now() - M), faits: ["a"], restants: ["b"] }], description: "lanceur" });
  const r = spawnSync(process.execPath, [join(produit, "forge", "hooks", "factory.mjs"), "suivi-agents", "--veille"], {
    input: JSON.stringify({ session_id: "s-lanceur-reel", transcript_path: sr.transcript }), encoding: "utf8",
    env: { ...process.env, FORGE_ROOT: join(ici, "..", ".."), FORGE_SUIVI_POLL_MS: "50" }, timeout: 60000 });
  verifier("par le lanceur d'un produit : code 2 et point « Suivi agents » en sortie d'erreur", r.status === 2 && /Suivi agents\n- lanceur/.test(r.stderr || ""), `code ${r.status} ${String(r.stderr).slice(0, 200)}`);
  rmSync(produit, { recursive: true, force: true });
}

// 7. Les juges de fin de tour (S116) : le point vrai passe, le « faux point » est jugé, un tour d'écriture clos sur un point reste jugé.
{
  const { spawnSync } = await import("node:child_process");
  const { fileURLToPath } = await import("node:url");
  const { dirname: dn } = await import("node:path");
  const ici = dn(fileURLToPath(import.meta.url));
  const d = mkdtempSync(join(tmpdir(), "suivi-juge-"));
  const vraiF = join(d, "vrai.md"), fauxF = join(d, "faux.md");
  writeFileSync(vraiF, "Suivi agents\n- banc e2e, general-purpose · actif (preuve de vie il y a 2 min) · faits : étape 1, étape 2 · restants : étape 3\n");
  writeFileSync(fauxF, "Suivi agents\nLes agents avancent bien, tout est en ordre.\n");
  const jouer = (f) => spawnSync(process.execPath, [join(ici, "oracle-synthese.mjs"), f], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const rv = jouer(vraiF), rf = jouer(fauxF);
  verifier("oracle-synthese : point de suivi vrai → exit 0 (S116)", rv.status === 0 && /S116/.test(rv.stdout), `code ${rv.status}`);
  verifier("oracle-synthese : faux point → jugé comme une restitution, exit 1", rf.status === 1 && !/"S116"/.test(rf.stdout), `code ${rf.status}`);
  const { jugeable } = await import("./hook-restitution.mjs");
  const pt = "Suivi agents\n- banc · présumé arrêté (preuve de vie il y a 18 min) · faits : tests PASS · restants : rapport";
  verifier("hook-restitution : point sans écriture dans le tour → non jugé", jugeable({ travail: false, dernierTexte: pt }).juge === false);
  verifier("hook-restitution : point après un affichage, rien d'écrit depuis → non jugé", jugeable({ travail: true, dernierTexte: pt, depuisDernierAffichage: { ecritures: 0, commandes: 9 } }).juge === false);
  verifier("hook-restitution : tour d'écriture clos sur un point → jugé", jugeable({ travail: true, ecritures: 2, dernierTexte: pt, depuisDernierAffichage: { ecritures: 2, commandes: 0 } }).juge === true);
  verifier("hook-restitution : faux point sans écriture, porteur d'un verdict → jugé", jugeable({ travail: false, dernierTexte: "Suivi agents\nTout est PASS." }).juge === true);
  rmSync(d, { recursive: true, force: true });
}

rmSync(racine, { recursive: true, force: true });
rmSync(ETAT, { recursive: true, force: true });
console.log(`hook-suivi-agents.test : ${ok}/${ok + ko} PASS — à double sens : cas rouges joués (faux point refusé, synthèse titrée refusée, point qui pose une décision refusé, `
  + "faux point jugé exit 1 par oracle-synthese, tour d'écriture clos sur un point jugé, agent fini depuis plus de 17 min jamais montré) et leurs cas verts");
process.exit(ko ? 1 : 0);
