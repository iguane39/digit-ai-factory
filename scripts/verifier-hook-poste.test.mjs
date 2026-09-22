#!/usr/bin/env node
/**
 * verifier-hook-poste.test.mjs — recette à DEUX SENS du poseur du hameçon de portée poste
 * (TF-1285, décision humaine D-2 (b) du 22/09/2026).
 *
 * L'objet jugé ici est une FUSION dans la configuration de l'humain — son modèle, son thème, ses
 * permissions, ses autres hameçons. Une recette qui ne prouverait que « l'entrée est posée »
 * laisserait passer le seul défaut qui compte vraiment : avoir emporté autre chose au passage. Les
 * cas de non-destruction sont donc aussi nombreux que ceux de la pose, et chacun nomme ce qu'il
 * protège.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt est joué).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  fusionner, formeDe, rendre, estNotreHamecon, entreesDeclarees, commandePour, scriptCite,
  EVENEMENT, SCRIPT_HAMECON,
} from "./verifier-hook-poste.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-hook-poste.mjs");
const PILOT = join(ICI, "..");

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "hook-poste-"));
let n = 0;
/** Un poste fabriqué : rend le chemin d'un `settings.json` portant le contenu donné. */
const poste = (contenu) => {
  const d = join(T, `p${++n}`);
  mkdirSync(d, { recursive: true });
  const f = join(d, "settings.json");
  if (contenu !== null) writeFileSync(f, typeof contenu === "string" ? contenu : JSON.stringify(contenu, null, 2) + "\n", "utf8");
  return f;
};
const jouer = (settings, ...a) => spawnSync(process.execPath, [OUTIL, "--settings", settings, "--pilot", PILOT, ...a], { encoding: "utf8" });
const lire = (f) => JSON.parse(readFileSync(f, "utf8"));

try {
  // ── la MESURE, sans rien installer ────────────────────────────────────────────────────────
  check("ROUGE — un poste sans hameçon sur le message rend FAIL, exit 1, et nomme le remède", () => {
    const f = poste({ model: "opus", hooks: { Stop: [{ hooks: [{ type: "command", command: "node x.mjs" }] }] } });
    const r = jouer(f);
    att(r.status === 1, `exit ${r.status}`);
    att(/HP1/.test(r.stdout), "la règle n'est pas nommée");
    att(/bootstrap\.mjs --pull/.test(r.stdout), "le remède n'est pas nommé");
    att(lire(f).hooks.UserPromptSubmit === undefined, "la mesure seule a écrit dans le fichier");
  });

  check("ROUGE — un poste SANS settings.json du tout rend FAIL sans planter", () => {
    const r = jouer(join(T, "inexistant", "settings.json"));
    att(r.status === 1, `exit ${r.status}`);
    att(/HP1/.test(r.stdout), "la règle n'est pas nommée");
  });

  check("ROUGE — un settings.json ILLISIBLE est REFUSÉ, jamais écrasé : écraser échangerait un défaut contre une perte", () => {
    const f = poste("{ ceci n'est pas du JSON");
    const r = jouer(f, "--installer");
    att(r.status === 1, `exit ${r.status}`);
    att(/illisible/.test(r.stdout), "le motif n'est pas dit");
    att(readFileSync(f, "utf8") === "{ ceci n'est pas du JSON", "le fichier illisible a été réécrit");
  });

  // ── la POSE, et ce qu'elle ne doit pas emporter ──────────────────────────────────────────
  check("VERT — `--installer` pose l'entrée et rend PASS", () => {
    const f = poste({ model: "opus" });
    const r = jouer(f, "--installer");
    att(r.status === 0, `exit ${r.status} — ${r.stdout}`);
    att(/\[INSTALLÉ\]/.test(r.stdout), "la pose n'est pas annoncée");
    const j = lire(f);
    att(entreesDeclarees(j).some((e) => estNotreHamecon(e.commande)), "l'entrée n'est pas là");
  });

  check("NON DESTRUCTIF — les clés de premier niveau de l'humain sont rendues à l'identique", () => {
    const avant = { model: "opus", theme: "dark", permissions: { allow: ["Bash(git:*)"] }, effortLevel: "high" };
    const f = poste(avant);
    att(jouer(f, "--installer").status === 0, "la pose a échoué");
    const j = lire(f);
    for (const k of Object.keys(avant)) att(JSON.stringify(j[k]) === JSON.stringify(avant[k]), `la clé ${k} a changé`);
  });

  check("NON DESTRUCTIF — un AUTRE événement de hameçon est rendu à l'identique", () => {
    const stop = [{ hooks: [{ type: "command", command: "node oracles/hook-restitution.mjs", timeout: 120 }] }];
    const f = poste({ hooks: { Stop: stop, PostToolUse: [{ matcher: "Write", hooks: [{ type: "command", command: "node y.mjs" }] }] } });
    att(jouer(f, "--installer").status === 0, "la pose a échoué");
    const j = lire(f);
    att(JSON.stringify(j.hooks.Stop) === JSON.stringify(stop), "l'événement Stop a été modifié");
    att(j.hooks.PostToolUse?.[0]?.matcher === "Write", "l'événement PostToolUse a été modifié");
  });

  check("NON DESTRUCTIF — un hameçon ÉTRANGER sur le MÊME événement est conservé et continue de tourner", () => {
    const etranger = { hooks: [{ type: "command", command: "node mon-outil-perso.mjs", timeout: 5 }] };
    const f = poste({ hooks: { [EVENEMENT]: [etranger] } });
    att(jouer(f, "--installer").status === 0, "la pose a échoué");
    const entrees = entreesDeclarees(lire(f));
    att(entrees.some((e) => /mon-outil-perso\.mjs/.test(e.commande)), "le hameçon étranger a été écrasé");
    att(entrees.some((e) => estNotreHamecon(e.commande)), "notre entrée n'a pas été ajoutée");
    att(entrees.length === 2, `${entrees.length} entrée(s) au lieu de 2`);
  });

  // ── l'IDEMPOTENCE ───────────────────────────────────────────────────────────────────────
  check("IDEMPOTENT — une seconde pose n'ajoute RIEN, et rend PASS sans annoncer d'installation", () => {
    const f = poste({ model: "opus" });
    jouer(f, "--installer");
    const apres1 = readFileSync(f, "utf8");
    const r2 = jouer(f, "--installer");
    att(r2.status === 0, `exit ${r2.status}`);
    att(!/\[INSTALLÉ\]/.test(r2.stdout), "la seconde pose s'annonce comme une installation");
    att(readFileSync(f, "utf8") === apres1, "le fichier a changé au second passage");
    att(entreesDeclarees(lire(f)).filter((e) => estNotreHamecon(e.commande)).length === 1, "l'entrée est en double");
  });

  check("IDEMPOTENT sur la COMMANDE et non sur un marqueur — un AUTRE chemin de pilot ne repose pas l'entrée", () => {
    const f = poste({ hooks: { [EVENEMENT]: [{ hooks: [{ type: "command", command: `node "C:/ailleurs/digit-ai-factory/oracles/${SCRIPT_HAMECON}"` }] }] } });
    const { deja } = fusionner(lire(f), PILOT);
    att(deja === true, "un second clone du pilot aurait posé un second hameçon");
  });

  // ── HP2 : un hameçon dont le script est absent ne tourne pas ────────────────────────────
  check("ROUGE HP2 — une entrée déjà là dont le script est ABSENT rend FAIL et nomme le chemin", () => {
    const f = poste({ hooks: { [EVENEMENT]: [{ hooks: [{ type: "command", command: `node "C:/nulle/part/oracles/${SCRIPT_HAMECON}"` }] }] } });
    const r = jouer(f);
    att(r.status === 1, `exit ${r.status}`);
    att(/HP2/.test(r.stdout), "la règle n'est pas nommée");
    att(/nulle\/part/.test(r.stdout), "le chemin absent n'est pas NOMMÉ");
    att(/déplacé ou recloné/.test(r.stdout), "la cause probable n'est pas dite");
  });

  check("VERT HP2 — l'entrée posée par l'outil pointe un script qui EXISTE", () => {
    const f = poste({});
    att(jouer(f, "--installer").status === 0, "la pose a échoué");
    const cmd = entreesDeclarees(lire(f)).find((e) => estNotreHamecon(e.commande)).commande;
    const s = scriptCite(cmd);
    att(s && existsSync(s), `le script cité n'existe pas : ${s}`);
  });

  // ── la FORME du fichier de l'humain est relue, jamais imposée ───────────────────────────
  check("FORME — une indentation à 4 espaces est rendue à 4 espaces", () => {
    const f = poste(JSON.stringify({ model: "opus" }, null, 4) + "\n");
    att(jouer(f, "--installer").status === 0, "la pose a échoué");
    att(/\n {4}"/.test(readFileSync(f, "utf8")), "l'indentation de l'humain a été remplacée");
  });

  check("FORME — un fichier en CRLF reste en CRLF", () => {
    const f = poste((JSON.stringify({ model: "opus" }, null, 2) + "\n").replace(/\n/g, "\r\n"));
    att(jouer(f, "--installer").status === 0, "la pose a échoué");
    const t = readFileSync(f, "utf8");
    att(/\r\n/.test(t) && !/[^\r]\n/.test(t), "les fins de ligne ont été converties");
  });

  check("formeDe et rendre, pris séparément — la tabulation est reconnue", () => {
    const forme = formeDe('{\n\t"a": 1\n}\n');
    att(forme.indent === "\t", `indent ${JSON.stringify(forme.indent)}`);
    att(/\n\t"a"/.test(rendre({ a: 1 }, forme)), "la tabulation n'est pas rendue");
  });

  check("la commande posée est ABSOLUE et entre guillemets — un chemin de poste porte des espaces", () => {
    const c = commandePour("C:/Program Files/pilot");
    att(/^node "/.test(c), `commande non protégée : ${c}`);
    att(c.includes(SCRIPT_HAMECON), "la commande ne nomme pas le hameçon");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nverifier-hook-poste (TF-1285) : ${pass} PASS, ${fail} FAIL — couverture à double sens sur la mesure, la pose, la non-destruction, l'idempotence et la forme`);
process.exit(fail ? 1 : 0);
