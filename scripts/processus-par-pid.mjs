#!/usr/bin/env node
/**
 * processus-par-pid.mjs — LANCER UN PROCESSUS EN NOTANT SON PID, L'ARRÊTER PAR CE PID, ET VÉRIFIER L'ARRÊT PAR LA LISTE DES PROCESSUS (TF-2731, TF-2689, 22/11/2026).
 *
 * LE FAIT, le 14/11/2026 (TF-2731). Une tâche d'arrière-plan qui avait lancé une session `claude -p` a été déclarée arrêtée à 17:46 ; à 18:15, le processus node de la
 * session (début 16:52) tournait encore et sa transcription s'écrivait toujours. L'arrêt de la tâche n'arrête pas le processus qu'elle a lancé, et le statut de la tâche
 * n'est pas la liste des processus. LE FAIT, le 16/11/2026 (TF-2689) : pour arrêter sa recette, un agent a tué 3 processus par un motif de ligne de commande, dont 2
 * qui n'étaient pas les siens. Le remède est le même : un PID noté au lancement, un arrêt par ce PID, une vérification par la liste.
 *
 * Usage :
 *   node scripts\processus-par-pid.mjs lancer --fichier-pid <fichier.json> [--cwd <dossier>] -- <commande> [arguments…]
 *        lance la commande détachée, écrit { pid, commande, debut } dans le fichier et imprime le PID ;
 *   node scripts\processus-par-pid.mjs arreter (--pid <n> | --fichier-pid <fichier.json>) [--arbre] [--attente-s <n>]
 *        arrête le processus (avec ses descendants si --arbre) puis VÉRIFIE par la liste des processus que ni lui ni ses descendants n'y figurent encore ;
 *   node scripts\processus-par-pid.mjs verifier (--pid <n> | --fichier-pid <fichier.json>)
 *        dit « présent » ou « absent » d'après la liste des processus (jamais d'après le statut d'une tâche).
 * Exit : 0 arrêt vérifié, ou lancement fait, ou « absent » · 1 un processus reste dans la liste (ou « présent ») · 2 usage, ou cible refusée (ce processus lui-même ou son parent).
 * Le script ne vise JAMAIS un processus par son nom ni par sa ligne de commande : seulement un PID donné ou lu dans le fichier noté au lancement.
 * NON JUGÉ : la réutilisation d'un PID par un autre processus entre le lancement et l'arrêt (le fichier note la date de début ; un PID réutilisé se voit à une date de
 * création postérieure, que la liste de Windows donne et que ce script compare).
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const attendre = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/** La liste des processus du poste : Map pid → { ppid, debut }. `debut` est une chaîne comparable (date de création Windows, ou rien sous POSIX). */
export function listerProcessus() {
  const table = new Map();
  if (process.platform === "win32") {
    const r = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,@{n='D';e={$_.CreationDate.ToString('o')}} | ConvertTo-Json -Compress"], { encoding: "utf8", windowsHide: true, maxBuffer: 64 * 1024 * 1024, timeout: 60000 });
    let lignes = []; try { lignes = JSON.parse(r.stdout || "[]"); } catch { /* liste illisible : table vide, dite par l'appelant */ }
    for (const l of [].concat(lignes)) if (l && Number.isInteger(l.ProcessId)) table.set(l.ProcessId, { ppid: l.ParentProcessId, debut: l.D || "" });
  } else {
    const r = spawnSync("ps", ["-eo", "pid=,ppid="], { encoding: "utf8" });
    for (const l of String(r.stdout || "").split("\n")) { const m = /^\s*(\d+)\s+(\d+)\s*$/.exec(l); if (m) table.set(Number(m[1]), { ppid: Number(m[2]), debut: "" }); }
  }
  return table;
}

/** Les descendants d'un PID dans une table (enfants, petits-enfants…), sans lui. */
export function descendants(table, pid) {
  const sortie = [];
  const vus = new Set([pid]);
  let front = [pid];
  while (front.length) {
    const suivant = [];
    for (const [p, v] of table) if (!vus.has(p) && front.includes(v.ppid)) { vus.add(p); sortie.push(p); suivant.push(p); }
    front = suivant;
  }
  return sortie;
}

/** Le processus de ce PID est-il dans la liste ? Si `debut` est donné et que la liste date le processus, un début différent désigne un PID réutilisé : absent. */
export function present(table, pid, debut = null) {
  const v = table.get(pid);
  if (!v) return false;
  if (debut && v.debut && String(v.debut) !== String(debut)) return false;
  return true;
}

function tuer(pid) {
  if (process.platform === "win32") return spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { encoding: "utf8", windowsHide: true });
  try { process.kill(pid, "SIGKILL"); } catch { /* déjà parti */ }
  return { status: 0 };
}

/** Arrête `pid` (et ses descendants avec `arbre`), puis vérifie par la liste. Rend { code, dits: [lignes] }. */
export function arreter(pid, { arbre = false, attenteS = 10, debut = null, lister = listerProcessus, tuerPid = tuer } = {}) {
  const dits = [];
  if (!Number.isInteger(pid) || pid <= 1) return { code: 2, dits: [`PID refusé : « ${pid} »`] };
  if (pid === process.pid || pid === process.ppid) return { code: 2, dits: [`PID ${pid} refusé : c'est ce script ou son parent`] };
  const avant = lister();
  const cibles = [pid, ...(arbre ? descendants(avant, pid) : [])];
  if (!present(avant, pid, debut)) {
    dits.push(`PID ${pid} : déjà absent de la liste des processus${debut ? " (ou réutilisé par un autre processus : début différent)" : ""}`);
    // Ses descendants éventuels sont orphelins : sans --arbre on ne les touche pas, avec --arbre on les arrête (collectés avant).
  }
  for (const p of [...cibles].reverse()) if (present(avant, p, p === pid ? debut : null)) tuerPid(p);
  const limite = Date.now() + attenteS * 1000;
  let restants = cibles;
  for (;;) {
    const apres = lister();
    restants = cibles.filter((p) => present(apres, p, p === pid ? debut : null));
    if (!restants.length || Date.now() >= limite) break;
    attendre(500);
  }
  if (restants.length) { dits.push(`ENCORE DANS LA LISTE DES PROCESSUS après ${attenteS} s : ${restants.join(", ")} — l'arrêt n'est PAS vérifié`); return { code: 1, dits, cibles, restants }; }
  dits.push(`arrêt vérifié par la liste des processus : ${cibles.join(", ")} absent(s)${arbre ? ` (le processus et ${cibles.length - 1} descendant(s))` : ""}`);
  return { code: 0, dits, cibles, restants };
}

function lirePid(a) {
  const f = a.indexOf("--fichier-pid");
  if (f >= 0 && a[f + 1]) {
    const chemin = resolve(a[f + 1]);
    if (!existsSync(chemin)) return { erreur: `fichier de PID absent : ${chemin}` };
    try { const j = JSON.parse(readFileSync(chemin, "utf8")); if (Number.isInteger(j.pid)) return { pid: j.pid, debut: j.debut_systeme || null }; } catch { /* dit ci-dessous */ }
    return { erreur: `fichier de PID illisible : ${chemin}` };
  }
  const k = a.indexOf("--pid");
  if (k >= 0 && /^\d+$/.test(a[k + 1] || "")) return { pid: Number(a[k + 1]), debut: null };
  return { erreur: "attend --pid <n> (entier) ou --fichier-pid <fichier>" };
}

export function principal(argv, sortie = (t) => process.stdout.write(t + "\n"), erreur = (t) => process.stderr.write(t + "\n")) {
  const mode = argv[0];
  const usage = (m) => { erreur(`processus-par-pid : ${m}\nusage : lancer --fichier-pid <f> -- <commande> | arreter (--pid <n> | --fichier-pid <f>) [--arbre] [--attente-s <n>] | verifier (--pid <n> | --fichier-pid <f>)`); return 2; };
  if (mode === "lancer") {
    const sep = argv.indexOf("--");
    const f = argv.indexOf("--fichier-pid");
    if (sep < 0 || sep === argv.length - 1) return usage("lancer attend `-- <commande> [arguments]` après les options");
    if (f < 0 || !argv[f + 1] || argv[f + 1] === "--") return usage("lancer attend --fichier-pid <fichier> : un PID qui n'est pas noté ne s'arrête pas par son PID");
    const c = argv.indexOf("--cwd");
    const [cmd, ...args] = argv.slice(sep + 1);
    const enfant = spawn(cmd, args, { detached: true, stdio: "ignore", windowsHide: true, cwd: c >= 0 ? resolve(argv[c + 1]) : process.cwd() });
    if (!enfant.pid) return usage(`la commande « ${cmd} » n'a pas démarré`);
    const table = listerProcessus();
    writeFileSync(resolve(argv[f + 1]), JSON.stringify({ pid: enfant.pid, commande: [cmd, ...args].join(" "), debut: new Date().toISOString(), debut_systeme: table.get(enfant.pid)?.debut || null }, null, 1) + "\n");
    enfant.unref();
    sortie(String(enfant.pid));
    return 0;
  }
  if (mode === "arreter" || mode === "verifier") {
    const p = lirePid(argv);
    if (p.erreur) return usage(p.erreur);
    if (mode === "verifier") { const la = present(listerProcessus(), p.pid, p.debut); sortie(la ? `présent : PID ${p.pid} figure dans la liste des processus` : `absent : PID ${p.pid} ne figure pas dans la liste des processus`); return la ? 1 : 0; }
    const i = argv.indexOf("--attente-s");
    const attenteS = i >= 0 && /^\d+$/.test(argv[i + 1] || "") ? Number(argv[i + 1]) : 10;
    const r = arreter(p.pid, { arbre: argv.includes("--arbre"), attenteS, debut: p.debut });
    for (const d of r.dits) (r.code === 0 ? sortie : erreur)(d);
    return r.code;
  }
  return usage(`mode inconnu « ${mode ?? ""} »`);
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) process.exit(principal(process.argv.slice(2)));
