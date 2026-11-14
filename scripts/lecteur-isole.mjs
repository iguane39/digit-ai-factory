#!/usr/bin/env node
/**
 * lecteur-isole.mjs — LA RECETTE DU LECTEUR ISOLÉ DE TOUT CONTEXTE, SUR L'ABONNEMENT (TF-2553, TF-2555, 14/11/2026).
 *
 * LE FAIT. Un amendement du run forge-digit-ai-fr-20261114a imposait `claude -p --bare` pour isoler des lecteurs. `--bare` ne
 * lit aucun identifiant OAuth et exige une clé d'API (`references\JETON-ABONNEMENT.md`) : une clé d'API payante et un secret ont
 * été demandés au créateur, à tort. Mesuré ensuite par le produit : `claude -p --setting-sources "" --system-prompt <texte>
 * --tools "" --disable-slash-commands --strict-mcp-config` isole sur l'abonnement (question piège : NON ; témoin sans isolement :
 * la phrase du CLAUDE.md citée). Sans recette, chaque session refait ces essais et risque de redemander une clé payante.
 *
 * CE QUE JOUE LA RECETTE, trois lancements :
 *   · TÉMOIN positif — la même question de fuite, SANS isolement, depuis le dossier qui porte un CLAUDE.md : le lecteur doit
 *     CITER le fichier. Un témoin qui répond AUCUN prouve que la sonde ne voit rien : la recette ne conclut pas ;
 *   · FUITE — la même question, lecteur ISOLÉ : il doit répondre AUCUN (aucun fichier, aucun contexte de projet) ;
 *   · PIÈGE — un texte qui dit « aucune forge ne s'appelle forge-ops », que le contexte du pilot contredit : lecteur isolé,
 *     d'après ce texte seul, il doit répondre NON (un lecteur qui laisse passer le contexte répond OUI).
 *
 * GARDES. La recette REFUSE de jouer (exit 2) si `ANTHROPIC_API_KEY` ou `ANTHROPIC_AUTH_TOKEN` est posée : la CLI les emploie à la
 * place de l'abonnement et la facturation passe à l'usage (JETON-ABONNEMENT.md, source 8). Elle n'emploie jamais `--bare`.
 * Le coût lu dans la sortie JSON de la CLI est RAPPORTÉ par elle, non recompté : sur l'abonnement il n'est pas facturé à l'usage.
 *
 * Usage : node scripts\lecteur-isole.mjs --recette [--racine <dossier>] [--json]
 *         node scripts\lecteur-isole.mjs --commande          (imprime la ligne de commande du lecteur isolé)
 * La CLI : `QO_JUGE_CLI` (chemin d'un exécutable ou d'un .js) s'il est posé, sinon le `cli.js` du paquet npm global, sinon `claude`.
 * Exit : 0 recette tenue · 1 recette en défaut (fuite, piège raté, ou témoin muet) · 2 usage ou refus · 3 CLI introuvable ou muette.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

/** Ce que le lecteur isolé reçoit comme consigne système : rien d'autre que de répondre d'après le texte donné. */
export const CONSIGNE_SYSTEME = "Tu es un lecteur isolé. Tu réponds uniquement d'après le texte ou la question qu'on te donne ; tu n'as accès à aucun fichier ni à aucun contexte de projet. Réponds en un mot quand on te le demande.";

/** Les arguments du lecteur ISOLÉ. Jamais `--bare` : il exige une clé d'API et laisse l'abonnement de côté. */
export function argumentsLecteurIsole(consigneSysteme = CONSIGNE_SYSTEME) {
  return ["-p", "--setting-sources", "", "--system-prompt", consigneSysteme, "--tools", "", "--disable-slash-commands", "--strict-mcp-config", "--output-format", "json"];
}
/** Les arguments du TÉMOIN : le même lancement, sans aucun des cinq verrous d'isolement. */
export const ARGUMENTS_TEMOIN = ["-p", "--output-format", "json"];

export const QUESTION_FUITE = "Cite mot pour mot la première ligne du fichier CLAUDE.md de ton répertoire de travail. Si tu n'as aucun accès à ce fichier ni à son contenu, réponds exactement : AUCUN";
export const QUESTION_PIEGE = "Voici le seul texte à lire : « La factory ne compte aucune forge nommée forge-ops. » Question : d'après ce texte seul, une forge nommée forge-ops existe-t-elle ? Réponds par OUI ou NON, sans autre mot.";

/** La CLI à lancer : [exécutable, ...arguments de tête]. `null` si rien ne se trouve. */
export function resoudreCli(env = process.env, existe = existsSync) {
  if (env.QO_JUGE_CLI && existe(env.QO_JUGE_CLI)) return /\.m?js$/i.test(env.QO_JUGE_CLI) ? [process.execPath, env.QO_JUGE_CLI] : [env.QO_JUGE_CLI];
  const npm = env.APPDATA && join(env.APPDATA, "npm", "node_modules", "@anthropic-ai", "claude-code", "cli.js");
  if (npm && existe(npm)) return [process.execPath, npm];
  return process.platform === "win32" ? null : ["claude"];
}

/** Les variables qui feraient facturer la CLI à l'usage : la recette ne joue pas tant qu'elles sont posées. */
export function clesPayantes(env = process.env) {
  return ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"].filter((k) => env[k]);
}

/** Un lancement : rend { texte, cout, erreur }. La question passe par l'entrée standard, jamais en argument (`--tools ""` en avale un). */
export function lancer(cli, arguments_, question, cwd, env = process.env) {
  const r = spawnSync(cli[0], [...cli.slice(1), ...arguments_], { input: question, cwd, env, encoding: "utf8", timeout: 180000, windowsHide: true });
  if (r.error) return { texte: "", cout: null, erreur: String(r.error.message || r.error) };
  let sortie = null;
  try { sortie = JSON.parse(String(r.stdout || "").trim().split(/\r?\n/).filter(Boolean).at(-1) || "null"); } catch { /* sortie non JSON */ }
  if (!sortie || typeof sortie.result !== "string" || sortie.is_error) return { texte: "", cout: null, erreur: `sortie illisible ou en erreur (exit ${r.status}) : ${String(r.stdout || r.stderr || "").slice(0, 200)}` };
  return { texte: sortie.result.trim(), cout: typeof sortie.total_cost_usd === "number" ? sortie.total_cost_usd : null, erreur: null };
}

/** Le premier mot d'une réponse, sans casse ni ponctuation : « Non. » → « non ». */
export const premierMot = (texte) => (String(texte).trim().split(/\s+/)[0] || "").replace(/[^\p{L}]/gu, "").toLowerCase();

/** Le verdict de la recette sur les trois réponses. `defauts` est vide quand elle tient. */
export function juger({ temoin, fuite, piege }) {
  const defauts = [];
  if (premierMot(temoin) === "aucun" || !temoin) defauts.push("le TÉMOIN ne cite pas le CLAUDE.md sans isolement : la sonde ne voit pas la fuite, la recette ne prouve rien");
  if (premierMot(fuite) !== "aucun") defauts.push(`le lecteur ISOLÉ n'a pas répondu AUCUN à la question de fuite (« ${String(fuite).slice(0, 80)} ») : du contexte passe`);
  if (premierMot(piege) !== "non") defauts.push(`le lecteur ISOLÉ n'a pas répondu NON à la question piège (« ${String(piege).slice(0, 80)} ») : le contexte du pilot a été lu`);
  return defauts;
}

function principal(a) {
  if (a.includes("--commande")) { console.log(["claude", ...argumentsLecteurIsole().map((x) => (x === "" ? '""' : /\s/.test(x) ? `"${x}"` : x))].join(" ")); return 0; }
  if (!a.includes("--recette")) { console.error("usage : node scripts\\lecteur-isole.mjs --recette [--racine <dossier>] [--json] | --commande"); return 2; }
  const payantes = clesPayantes();
  if (payantes.length) { console.error(`REFUSÉ : ${payantes.join(", ")} posée(s) dans l'environnement — la CLI l'emploie à la place de l'abonnement et la facturation passe à l'usage (references\\JETON-ABONNEMENT.md). Retirer la variable, puis rejouer ; ne jamais en demander la valeur.`); return 2; }
  const i = a.indexOf("--racine");
  const racine = resolve(i >= 0 && a[i + 1] ? a[i + 1] : join(ICI, ".."));
  const cli = resoudreCli();
  if (!cli) { console.error("CLI `claude` introuvable (QO_JUGE_CLI, paquet npm global) : recette NON jouée"); return 3; }
  const temoin = lancer(cli, ARGUMENTS_TEMOIN, QUESTION_FUITE, racine);
  const fuite = lancer(cli, argumentsLecteurIsole(), QUESTION_FUITE, racine);
  const piege = lancer(cli, argumentsLecteurIsole(), QUESTION_PIEGE, racine);
  const erreurs = [["témoin", temoin], ["fuite", fuite], ["piège", piege]].filter(([, r]) => r.erreur);
  if (erreurs.length) { for (const [nom, r] of erreurs) console.error(`lancement « ${nom} » : ${r.erreur}`); return 3; }
  const defauts = juger({ temoin: temoin.texte, fuite: fuite.texte, piege: piege.texte });
  const couts = [temoin, fuite, piege].map((r) => r.cout);
  const releve = { lancements: 3, temoin: temoin.texte.slice(0, 120), fuite: fuite.texte.slice(0, 120), piege: piege.texte.slice(0, 120),
    cout_usd_rapporte_par_la_cli: couts.every((c) => c !== null) ? Number(couts.reduce((s, c) => s + c, 0).toFixed(4)) : null, defauts };
  if (a.includes("--json")) console.log(JSON.stringify(releve, null, 1));
  else {
    console.log(`lecteur isolé sur l'abonnement : ${defauts.length ? "DÉFAUT" : "TENU"} — 3 lancements (témoin, fuite, piège)`);
    console.log(`  témoin (sans isolement) : « ${releve.temoin} »\n  fuite (isolé) : « ${releve.fuite} »\n  piège (isolé) : « ${releve.piege} »`);
    console.log(`  coût rapporté par la CLI, non recompté : ${releve.cout_usd_rapporte_par_la_cli ?? "non rapporté"} USD (abonnement : pas de facturation à l'usage)`);
    for (const d of defauts) console.log(`  [DÉFAUT] ${d}`);
  }
  return defauts.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(principal(process.argv.slice(2)));
