#!/usr/bin/env node
/**
 * processus-par-pid.test.mjs — lancer en notant le PID, arrêter par ce PID, vérifier par la liste des processus (TF-2731, TF-2689, 22/11/2026).
 *
 * Processus RÉELS, tous lancés par ce banc et visés par leur seul PID noté (jamais par un nom ni un motif de ligne de commande, c'est la règle même
 * qu'il éprouve) : un enfant node qui lance lui-même un petit-enfant node. Sens vert : `lancer` note le PID, `verifier` le voit présent, `arreter --arbre`
 * arrête l'enfant ET le petit-enfant et le dit vérifié par la liste, un PID déjà parti est « déjà absent » (exit 0). Sens rouge : un arrêt qui ne marche pas
 * (la tâche déclarée arrêtée, le processus vivant : TF-2731) rend exit 1 « ENCORE DANS LA LISTE » et non un faux succès ; ce script refuse de viser lui-même ou
 * son parent ; un lancement sans fichier de PID, un PID absent des arguments, un mode inconnu sont refusés (exit 2). Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { arreter, descendants, listerProcessus, present } from "./processus-par-pid.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "processus-par-pid.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };
const jouer = (...args) => { const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", windowsHide: true, timeout: 120000 }); return { code: r.status, out: r.stdout || "", err: r.stderr || "" }; };
const attendre = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const base = mkdtempSync(join(tmpdir(), "processus-par-pid-"));
const aTuer = new Set();   // les PID que CE banc a lancés : nettoyés à la fin, par PID
const ENFANT = join(base, "enfant.js"), PETIT = join(base, "petit-enfant.pid");
writeFileSync(ENFANT, `
const { spawn } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const p = spawn(process.execPath, ["-e", "setInterval(()=>{},1000)"], { stdio: "ignore", windowsHide: true });
writeFileSync(${JSON.stringify(PETIT)}, String(p.pid));
setInterval(() => {}, 1000);
`, "utf8");

try {
  const fichierPid = join(base, "pid.json");
  let pid = null, petit = null;
  check("vert — `lancer` note le PID dans le fichier, l'imprime, et le processus est dans la liste des processus", () => {
    const r = jouer("lancer", "--fichier-pid", fichierPid, "--", process.execPath, ENFANT);
    att(r.code === 0 && /^\d+$/.test(r.out.trim()), `exit ${r.code} : ${r.out}${r.err}`);
    pid = Number(r.out.trim()); aTuer.add(pid);
    const note = JSON.parse(readFileSync(fichierPid, "utf8"));
    att(note.pid === pid && /enfant\.js/.test(note.commande) && !Number.isNaN(Date.parse(note.debut)), `fichier de PID : ${JSON.stringify(note)}`);
    for (let i = 0; i < 40 && !existsSync(PETIT); i++) attendre(250);
    att(existsSync(PETIT), "le petit-enfant ne s'est pas lancé");
    petit = Number(readFileSync(PETIT, "utf8")); aTuer.add(petit);
    const t = listerProcessus();
    att(present(t, pid) && present(t, petit), "l'enfant ou le petit-enfant est absent de la liste juste après le lancement");
    att(descendants(t, pid).includes(petit), "le petit-enfant n'est pas un descendant de l'enfant dans la liste");
  });
  check("vert — `verifier` dit « présent » (exit 1) tant que le processus vit : le statut d'une tâche n'est pas la liste des processus", () => {
    const r = jouer("verifier", "--fichier-pid", fichierPid);
    att(r.code === 1 && /présent/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
  });
  check("rouge — un arrêt qui ne marche pas (la tâche « arrêtée », le processus vivant, TF-2731) rend exit 1 « ENCORE DANS LA LISTE », jamais un faux succès", () => {
    const r = arreter(pid, { arbre: true, attenteS: 1, tuerPid: () => {} });
    att(r.code === 1 && r.restants.includes(pid) && /ENCORE DANS LA LISTE DES PROCESSUS/.test(r.dits.join("\n")) && /n'est PAS vérifié/.test(r.dits.join("\n")), `${r.code} ${r.dits.join(" | ")}`);
    att(present(listerProcessus(), pid), "le banc a tué le processus alors que l'arrêt était un faux");
  });
  check("vert — `arreter --pid <n> --arbre` arrête l'enfant ET le petit-enfant, puis le vérifie par la liste (exit 0) ; le remède se joue sur de vrais processus", () => {
    const r = jouer("arreter", "--fichier-pid", fichierPid, "--arbre", "--attente-s", "20");
    att(r.code === 0 && /arrêt vérifié par la liste des processus/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    const t = listerProcessus();
    att(!present(t, pid) && !present(t, petit), `l'enfant ${pid} ou le petit-enfant ${petit} figure encore dans la liste`);
    const v = jouer("verifier", "--fichier-pid", fichierPid);
    att(v.code === 0 && /absent/.test(v.out), `verifier après l'arrêt : exit ${v.code} ${v.out}`);
  });
  check("vert — arrêter un PID déjà parti est « déjà absent » (exit 0), sans erreur ni arrêt d'un autre processus", () => {
    const r = jouer("arreter", "--pid", String(pid));
    att(r.code === 0 && /déjà absent/.test(r.out + r.err), `exit ${r.code} : ${r.out}${r.err}`);
  });
  check("rouge — le script refuse de viser lui-même ou son parent (exit 2), un PID invalide, et un usage incomplet", () => {
    const parent = jouer("arreter", "--pid", String(process.pid));
    att(parent.code === 2 && /son parent/.test(parent.err), `parent : exit ${parent.code} ${parent.err}`);
    att(arreter(1, {}).code === 2 && arreter(Number.NaN, {}).code === 2, "un PID 1 ou invalide n'est pas refusé");
    att(jouer("arreter").code === 2, "arreter sans PID accepté");
    att(jouer("arreter", "--pid", "abc").code === 2, "un PID non numérique accepté");
    att(jouer("lancer", "--", process.execPath, "-e", "1").code === 2, "lancer sans --fichier-pid accepté (un PID non noté ne s'arrête pas par son PID)");
    att(jouer("lancer", "--fichier-pid", join(base, "x.json")).code === 2, "lancer sans commande accepté");
    att(jouer("tuer").code === 2, "un mode inconnu accepté");
  });
} finally {
  for (const p of aTuer) { try { if (present(listerProcessus(), p)) arreter(p, { arbre: true, attenteS: 5 }); } catch { /* déjà parti */ } }
  try { rmSync(base, { recursive: true, force: true }); } catch { /* dossier occupé : repris par le nettoyage du système */ }
}

console.log(`\nprocessus-par-pid (TF-2731, TF-2689) : ${pass} PASS, ${fail} FAIL — cas rouges : arrêt sans effet, cible refusée (soi, parent, PID invalide), usage incomplet`);
process.exit(fail ? 1 : 0);
