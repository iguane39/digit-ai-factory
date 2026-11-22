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
 * TROIS CONTRÔLES S'Y AJOUTENT le 22/11/2026 : (TF-2729) la CLI se résout `QO_JUGE_CLI`, puis `bin\claude.exe` du paquet npm global, puis `cli.js`, et sous Windows la
 * recette s'ARRÊTE faute de l'un d'eux au lieu de retomber sur `claude.CMD` ; un LANCEMENT À BLANC vérifie que le message arrive entier avant les trois lancements ;
 * (TF-2714) l'isolement se prouve par un MARQUEUR aléatoire injecté au CLAUDE.md du dossier de lancement et par les JETONS d'entrée que la CLI rapporte, pas seulement
 * par la déclaration du lecteur.
 *
 * Usage : node scripts\lecteur-isole.mjs --recette [--racine <dossier>] [--json]
 *         node scripts\lecteur-isole.mjs --a-blanc            (un seul lancement : le message long arrive-t-il entier ?)
 *         node scripts\lecteur-isole.mjs --commande          (imprime la ligne de commande du lecteur isolé)
 * La CLI : `QO_JUGE_CLI` (chemin d'un exécutable ou d'un .js) s'il est posé, sinon `bin\claude.exe` du paquet npm global, sinon son `cli.js`, sinon `claude` hors Windows.
 * Sans `--racine`, les lancements se jouent depuis un dossier jetable dont le CLAUDE.md porte un marqueur aléatoire (supprimé ensuite) ; avec `--racine`, depuis ce dossier.
 * Exit : 0 recette tenue · 1 recette en défaut (fuite, piège raté, témoin muet, jetons) · 2 usage ou refus · 3 CLI introuvable ou muette, ou message qui n'arrive pas entier.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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

/**
 * La CLI à lancer : [exécutable, ...arguments de tête]. `null` si rien ne se trouve.
 * TF-2729 (22/11/2026, constat du 14/11/2026) — sous Windows, `claude` est un `claude.CMD` et `cmd.exe` abîme les longs arguments (un lecteur ne s'est pas lancé :
 * « Input must be provided… ») ; le contournement du produit (`node cli.js`) est tombé quand une mise à jour du paquet a remplacé `cli.js` par `bin\claude.exe`
 * (CLI 2.1.318 : le paquet npm global ne porte plus que `bin\claude.exe`, mesuré sur ce poste le 22/11/2026). Ordre : `QO_JUGE_CLI`, puis `bin\claude.exe` du
 * paquet npm global, puis `cli.js` du même paquet ; sous Windows, rien d'autre : la recette S'ARRÊTE (exit 3) au lieu de retomber sur `claude.CMD`.
 */
export function resoudreCli(env = process.env, existe = existsSync, plateforme = process.platform) {
  if (env.QO_JUGE_CLI && existe(env.QO_JUGE_CLI)) return /\.m?js$/i.test(env.QO_JUGE_CLI) ? [process.execPath, env.QO_JUGE_CLI] : [env.QO_JUGE_CLI];
  const paquet = env.APPDATA && join(env.APPDATA, "npm", "node_modules", "@anthropic-ai", "claude-code");
  if (paquet) {
    const exe = join(paquet, "bin", plateforme === "win32" ? "claude.exe" : "claude");
    if (existe(exe)) return [exe];
    const js = join(paquet, "cli.js");
    if (existe(js)) return [process.execPath, js];
  }
  return plateforme === "win32" ? null : ["claude"];
}

/**
 * TF-2729 — LE LANCEMENT À BLANC : le message arrive-t-il ENTIER ? Un message long dont seule la DERNIÈRE ligne porte un code que le lecteur doit rendre ; un message
 * tronqué par le lanceur (la cause du 14/11/2026) ne peut pas le rendre. Un lancement, le plus court possible, jamais un verdict de la recette : un échec arrête
 * la recette (exit 3) avant les trois lancements qui comptent.
 */
export const LIGNES_DE_BLANC = 120;
export function messageDeBlanc(code) {
  const remplissage = Array.from({ length: LIGNES_DE_BLANC }, (_, i) => `Ligne de remplissage ${i + 1} : ce texte ne contient rien d'utile.`).join("\n");
  return `${remplissage}\nRéponds uniquement par le code qui figure sur la dernière ligne de ce message, sans autre mot.\nCODE : ${code}`;
}
export function codeDeBlanc() { return `BLANC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`; }
export function lancementABlanc(cli, cwd, env = process.env, code = codeDeBlanc()) {
  const r = lancer(cli, argumentsLecteurIsole(), messageDeBlanc(code), cwd, env);
  if (r.erreur) return { ok: false, detail: `le lancement à blanc a échoué : ${r.erreur}`, jetons: null };
  return r.texte.includes(code)
    ? { ok: true, detail: `message de ${messageDeBlanc(code).length} caractères arrivé entier (le code de la dernière ligne est rendu)`, jetons: r.jetons }
    : { ok: false, detail: `le code de la dernière ligne n'est pas rendu (« ${r.texte.slice(0, 80)} ») : le message n'arrive pas entier à la CLI`, jetons: r.jetons };
}

/**
 * TF-2714 (22/11/2026, constat du 15/11/2026) — L'ISOLEMENT SE PROUVE PAR UN MARQUEUR INJECTÉ ET PAR UNE MESURE, PAS SEULEMENT PAR LA DÉCLARATION DU LECTEUR.
 * Le fait : sur plus de 40 lecteurs isolés (cinq verrous), 1 a déclaré avoir reçu un bloc `system-reminder` avec l'adresse du compte : un contexte automatique du harnais
 * que les cinq verrous ne retirent pas, et que la question témoin déclarative (« AUCUN ») ne détectait pas puisque le lecteur ne l'avait pas ignoré mais déclaré.
 * Deux contrôles OBJECTIFS s'ajoutent, sans clé d'API (l'abonnement, `--bare` reste écarté) : (1) un MARQUEUR aléatoire écrit dans le `CLAUDE.md` d'un dossier jetable d'où
 * les lancements se jouent : le témoin doit le citer, le lecteur isolé ne doit pas le contenir, une chaîne cherchée et non une déclaration ; (2) les JETONS d'entrée
 * que la CLI rapporte (`usage`) : un lecteur isolé reçoit une fraction de ceux du témoin, et un contexte qui passe les gonfle même quand le lecteur répond AUCUN.
 * LA BORNE `RATIO_JETONS_MAX` EST PROVISOIRE : 0,25 n'a pas été mesuré sur de vrais lancements (aucun lancement réel dans ce lot) ; elle se confirme au premier rejeu réel.
 */
export const RATIO_JETONS_MAX = 0.25;
export const codeMarqueur = () => `MARQUEUR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
export function creerDossierMarqueur(marqueur = codeMarqueur()) {
  const dossier = mkdtempSync(join(tmpdir(), "lecteur-marqueur-"));
  writeFileSync(join(dossier, "CLAUDE.md"), `# ${marqueur} — première ligne du fichier de contexte du dossier\n\nCe dossier ne contient rien d'autre.\n`, "utf8");
  return { dossier, marqueur };
}

/** Les variables qui feraient facturer la CLI à l'usage : la recette ne joue pas tant qu'elles sont posées. */
export function clesPayantes(env = process.env) {
  return ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"].filter((k) => env[k]);
}

/** Un lancement : rend { texte, cout, erreur }. La question passe par l'entrée standard, jamais en argument (`--tools ""` en avale un). */
export function lancer(cli, arguments_, question, cwd, env = process.env) {
  const r = spawnSync(cli[0], [...cli.slice(1), ...arguments_], { input: question, cwd, env, encoding: "utf8", timeout: 180000, windowsHide: true });
  if (r.error) return { texte: "", cout: null, jetons: null, erreur: String(r.error.message || r.error) };
  let sortie = null;
  try { sortie = JSON.parse(String(r.stdout || "").trim().split(/\r?\n/).filter(Boolean).at(-1) || "null"); } catch { /* sortie non JSON */ }
  if (!sortie || typeof sortie.result !== "string" || sortie.is_error) return { texte: "", cout: null, jetons: null, erreur: `sortie illisible ou en erreur (exit ${r.status}) : ${String(r.stdout || r.stderr || "").slice(0, 200)}` };
  return { texte: sortie.result.trim(), cout: typeof sortie.total_cost_usd === "number" ? sortie.total_cost_usd : null, jetons: jetonsEntree(sortie.usage), erreur: null };
}

/** Les jetons d'ENTRÉE d'un lancement, tels que la CLI les rapporte (`usage`) : entrée, création de cache, lecture de cache. `null` si la CLI n'en rapporte aucun. */
export function jetonsEntree(usage) {
  if (!usage || typeof usage !== "object") return null;
  const n = ["input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"].map((k) => (typeof usage[k] === "number" ? usage[k] : null));
  return n.every((x) => x === null) ? null : n.reduce((s, x) => s + (x ?? 0), 0);
}

/** Le premier mot d'une réponse, sans casse ni ponctuation : « Non. » → « non ». */
export const premierMot = (texte) => (String(texte).trim().split(/\s+/)[0] || "").replace(/[^\p{L}]/gu, "").toLowerCase();

/**
 * Le verdict de la recette sur les trois réponses. `defauts` est vide quand elle tient.
 * `marqueur` (TF-2714) : le code que le CLAUDE.md du dossier de lancement porte ; le témoin doit le citer, le lecteur isolé ne doit PAS le contenir.
 * `jetons` (TF-2714) : { temoin, fuite, piege }, les jetons d'entrée rapportés par la CLI ; non rapportés (null), le contrôle est dit non joué par l'appelant.
 */
export function juger({ temoin, fuite, piege, marqueur = null, jetons = null }) {
  const defauts = [];
  if (premierMot(temoin) === "aucun" || !temoin) defauts.push("le TÉMOIN ne cite pas le CLAUDE.md sans isolement : la sonde ne voit pas la fuite, la recette ne prouve rien");
  else if (marqueur && !String(temoin).includes(marqueur)) defauts.push(`le TÉMOIN ne cite pas le marqueur ${marqueur} du CLAUDE.md : la sonde ne voit pas le contexte, la recette ne prouve rien`);
  if (premierMot(fuite) !== "aucun") defauts.push(`le lecteur ISOLÉ n'a pas répondu AUCUN à la question de fuite (« ${String(fuite).slice(0, 80)} ») : du contexte passe`);
  if (marqueur && String(fuite).includes(marqueur)) defauts.push(`le lecteur ISOLÉ a rendu le marqueur ${marqueur} : le CLAUDE.md du dossier est lu malgré les cinq verrous (fuite constatée par chaîne, non déclarée)`);
  if (premierMot(piege) !== "non") defauts.push(`le lecteur ISOLÉ n'a pas répondu NON à la question piège (« ${String(piege).slice(0, 80)} ») : le contexte du pilot a été lu`);
  if (jetons && typeof jetons.temoin === "number" && jetons.temoin > 0)
    for (const [nom, n] of [["fuite", jetons.fuite], ["piège", jetons.piege]])
      if (typeof n === "number" && n > RATIO_JETONS_MAX * jetons.temoin)
        defauts.push(`le lecteur ISOLÉ (${nom}) a reçu ${n} jetons d'entrée contre ${jetons.temoin} au témoin, plus de ${Math.round(RATIO_JETONS_MAX * 100)} % : un contexte automatique du harnais passe, même si le lecteur répond comme il faut (TF-2714)`);
  return defauts;
}

function principal(a) {
  if (a.includes("--commande")) { console.log(["claude", ...argumentsLecteurIsole().map((x) => (x === "" ? '""' : /\s/.test(x) ? `"${x}"` : x))].join(" ")); return 0; }
  if (!a.includes("--recette") && !a.includes("--a-blanc")) { console.error("usage : node scripts\\lecteur-isole.mjs --recette [--racine <dossier>] [--json] | --a-blanc | --commande"); return 2; }
  const payantes = clesPayantes();
  if (payantes.length) { console.error(`REFUSÉ : ${payantes.join(", ")} posée(s) dans l'environnement — la CLI l'emploie à la place de l'abonnement et la facturation passe à l'usage (references\\JETON-ABONNEMENT.md). Retirer la variable, puis rejouer ; ne jamais en demander la valeur.`); return 2; }
  const i = a.indexOf("--racine");
  const cli = resoudreCli();
  if (!cli) { console.error("CLI `claude` introuvable (QO_JUGE_CLI, `bin\\claude.exe` ou `cli.js` du paquet npm global) : recette NON jouée. Sous Windows elle ne retombe jamais sur `claude.CMD`, dont cmd.exe abîme les longs arguments (TF-2729)."); return 3; }
  // TF-2714 : sans `--racine`, les lancements se jouent depuis un dossier jetable dont le CLAUDE.md porte un marqueur aléatoire ; avec `--racine`, depuis ce dossier, sans marqueur.
  const avecMarqueur = !(i >= 0 && a[i + 1]);
  const jetable = avecMarqueur ? creerDossierMarqueur() : null;
  const racine = jetable ? jetable.dossier : resolve(a[i + 1]);
  try {
    // TF-2729 : le lancement à blanc d'abord ; un message qui n'arrive pas entier arrête la recette avant les trois lancements qui comptent.
    const blanc = lancementABlanc(cli, racine);
    if (a.includes("--a-blanc")) { (blanc.ok ? console.log : console.error)(`lancement à blanc : ${blanc.ok ? "TENU" : "ÉCHEC"} — ${blanc.detail}`); return blanc.ok ? 0 : 3; }
    if (!blanc.ok) { console.error(`lancement « à blanc » : ${blanc.detail} — recette NON jouée (TF-2729) : un message tronqué ferait rendre un verdict sur une question qui n'est pas celle qu'on croit poser`); return 3; }
    const temoin = lancer(cli, ARGUMENTS_TEMOIN, QUESTION_FUITE, racine);
    const fuite = lancer(cli, argumentsLecteurIsole(), QUESTION_FUITE, racine);
    const piege = lancer(cli, argumentsLecteurIsole(), QUESTION_PIEGE, racine);
    const erreurs = [["témoin", temoin], ["fuite", fuite], ["piège", piege]].filter(([, r]) => r.erreur);
    if (erreurs.length) { for (const [nom, r] of erreurs) console.error(`lancement « ${nom} » : ${r.erreur}`); return 3; }
    const jetons = { temoin: temoin.jetons, fuite: fuite.jetons, piege: piege.jetons };
    const jetonsRapportes = Object.values(jetons).every((n) => typeof n === "number");
    const defauts = juger({ temoin: temoin.texte, fuite: fuite.texte, piege: piege.texte, marqueur: jetable ? jetable.marqueur : null, jetons: jetonsRapportes ? jetons : null });
    const couts = [temoin, fuite, piege].map((r) => r.cout);
    const releve = { lancements: 3, a_blanc: { ok: blanc.ok, detail: blanc.detail }, marqueur: jetable ? jetable.marqueur : null,
      temoin: temoin.texte.slice(0, 120), fuite: fuite.texte.slice(0, 120), piege: piege.texte.slice(0, 120),
      jetons_entree_rapportes_par_la_cli: jetonsRapportes ? jetons : null, ratio_jetons_max_provisoire: RATIO_JETONS_MAX,
      cout_usd_rapporte_par_la_cli: couts.every((c) => c !== null) ? Number(couts.reduce((s, c) => s + c, 0).toFixed(4)) : null, defauts };
    if (a.includes("--json")) console.log(JSON.stringify(releve, null, 1));
    else {
      console.log(`lecteur isolé sur l'abonnement : ${defauts.length ? "DÉFAUT" : "TENU"} — 3 lancements (témoin, fuite, piège) après un lancement à blanc`);
      console.log(`  à blanc : ${blanc.detail}`);
      console.log(`  témoin (sans isolement) : « ${releve.temoin} »\n  fuite (isolé) : « ${releve.fuite} »\n  piège (isolé) : « ${releve.piege} »`);
      console.log(`  marqueur injecté : ${jetable ? `${jetable.marqueur} (CLAUDE.md du dossier de lancement ; chaîne cherchée, non déclarée)` : "aucun (--racine : le CLAUDE.md du dossier désigné fait foi)"}`);
      console.log(`  jetons d'entrée rapportés par la CLI : ${jetonsRapportes ? `témoin ${jetons.temoin}, fuite ${jetons.fuite}, piège ${jetons.piege} (borne ${Math.round(RATIO_JETONS_MAX * 100)} % du témoin, PROVISOIRE : non mesurée sur de vrais lancements)` : "non rapportés : contrôle par les jetons NON joué"}`);
      console.log(`  coût rapporté par la CLI, non recompté : ${releve.cout_usd_rapporte_par_la_cli ?? "non rapporté"} USD (abonnement : pas de facturation à l'usage)`);
      for (const d of defauts) console.log(`  [DÉFAUT] ${d}`);
    }
    return defauts.length ? 1 : 0;
  } finally { if (jetable) { try { rmSync(jetable.dossier, { recursive: true, force: true }); } catch { /* dossier jetable occupé : repris par le nettoyage du système */ } } }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(principal(process.argv.slice(2)));
