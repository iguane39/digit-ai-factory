#!/usr/bin/env node
/**
 * hook-ecriture.mjs — LA DOCTRINE D'ÉCRITURE SE JOUE AU MOMENT OÙ L'AGENT ÉCRIT, pas trois
 * livraisons plus tard à la relecture d'un humain.
 *
 * POURQUOI (R-44 : une consigne s'exécute ou décore). `references\ECRITURE.md` pose des règles de
 * prose ; un paragraphe de doctrine ne s'exécute pas. Le défaut est connu et daté dans ce dépôt —
 * la consigne RESTITUTION écrite le 14/08 et citée par aucun run, `ruff` configuré le 15/08 et
 * joué par aucun pas de recette, les règles de socle d'une page HTML que le produit ne rencontrait
 * jamais (TF-0765). Une règle que le producteur ne rencontre pas au moment où il produit n'existe
 * pas pour lui. Ce hook la lui met sous les yeux à l'écriture, chez le pilot comme chez le produit
 * (via `forge\hooks\factory.mjs ecriture`).
 *
 * CE QUE FAIT CE HOOK. Hook `PostToolUse` (Write | Edit | MultiEdit). Il lit sur stdin l'entrée du
 * tool, ne s'intéresse qu'aux `.md` existants — jamais aux index régénérés (`README.md`,
 * `LISEZMOI.md`), jamais à `node_modules\`, `.git\`, `old\` — et joue `oracle-ecriture.mjs`
 * dessus, avec le chemin relatif au dépôt courant pour que l'antériorité déclarée soit reconnue.
 *
 * IL AVERTIT, IL NE BLOQUE PAS : exit 0 TOUJOURS, même doctrine que `hook-page-html.mjs`. Un
 * document se construit en plusieurs écritures, et un style se corrige à la relecture, pas au
 * caractère près ; bloquer ici apprendrait surtout à désactiver le hook (leçon N4).
 *
 * Usage : node oracles\hook-ecriture.mjs [--fichier <note.md>] [--self-test]   (stdin : JSON du hook)
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from "node:fs";
import { join, dirname, resolve, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-ecriture.mjs");

const IGNORES = [/(^|[\\/])node_modules[\\/]/i, /(^|[\\/])\.git[\\/]/i, /(^|[\\/])old[\\/]/i];
const INDEX_REGENERES = new Set(["readme.md", "lisezmoi.md"]);

/** Le fichier visé par l'entrée du hook (Write/Edit/MultiEdit), ou null. */
export function fichierVise(entree) {
  try {
    const j = typeof entree === "string" ? JSON.parse(entree || "{}") : (entree || {});
    const p = j?.tool_input?.file_path || j?.tool_input?.path || j?.file_path || null;
    if (!p || !/\.md$/i.test(p)) return null;
    if (INDEX_REGENERES.has(basename(p).toLowerCase())) return null;
    if (IGNORES.some((re) => re.test(p))) return null;
    return p;
  } catch { return null; }
}

/** Joue l'oracle d'écriture sur un fichier ; rend les lignes à imprimer. */
export function jouer(fichier, oracle = ORACLE) {
  const lignes = [];
  if (!fichier || !existsSync(fichier)) return lignes;
  const nom = basename(fichier);
  if (!existsSync(oracle)) {
    lignes.push(`[ecriture] doctrine NON jouée sur ${nom} : ${oracle} absent de ce poste — installer les outils (bootstrap.mjs --pull)`);
    return lignes;
  }
  // Le chemin RELATIF AU DÉPÔT COURANT : c'est lui que la table d'antériorité nomme
  // (`REGLES-PROJET.md`, `gabarits/RESTITUTION.md`…). Sans lui, un texte exempté serait jugé.
  const rel = relative(process.cwd(), resolve(fichier)).replace(/\\/g, "/");
  const r = spawnSync(process.execPath, [oracle, fichier, "--chemin-relatif", rel], { encoding: "utf8", timeout: 60000 });
  let j = null;
  try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
  if (!j || !Array.isArray(j.findings)) {
    lignes.push(`[ecriture] oracle-ecriture ILLISIBLE sur ${nom} (exit ${r.status}) — ce n'est pas un constat sur le texte`);
    return lignes;
  }
  const court = (f) => String(f.message || "").split(" — 1re occurrence")[0].split(" ; remède")[0].slice(0, 150);
  const fails = j.findings.filter((f) => f.statut === "FAIL");
  const averts = j.findings.filter((f) => f.statut === "AVERT");
  const familles = j.findings.filter((f) => String(f.regle).startsWith("EC-1:")).length;
  if (j.verdict === "SKIP") {
    lignes.push(`[ecriture] ${nom} : antériorité déclarée, non jugé`);
  } else if (fails.length) {
    lignes.push(`[ecriture] ${nom} : style FAIL — à corriger avant remise (doctrine references/ECRITURE.md du pilot)`,
      ...fails.map((f) => `[ecriture]   ${f.regle}${f.ligne ? ` (ligne ${f.ligne})` : ""} : ${court(f)}`));
  } else if (averts.length) {
    lignes.push(...averts.map((f) => `[ecriture] ${nom} : ${f.regle}${f.ligne ? ` (ligne ${f.ligne})` : ""} — ${court(f)}`));
  } else {
    lignes.push(`[ecriture] ${nom} : style PASS (${familles} familles, ${j.mots} mots)`);
  }
  return lignes;
}

// ── LA RECETTE ───────────────────────────────────────────────────────────────────────────────

const ROUGE = `# Note de test

Un texte court, mais deux defauts de structure que la longueur ne sauve pas.

- Axe un
  - sous-axe
    - detail au troisieme niveau

✅ Une puce emoji, qui remplace le fait par un signe.
`;

const VERTE = `# Journal de test

Le lot est entre en recette le 2 septembre. Trois environnements ont ete mesures.
Les deux echecs portent sur le meme composant. La correction est datee du 3 septembre.
`;

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "hook-ecriture-"));
  const casse = [];
  const entree = (p) => JSON.stringify({ tool_name: "Write", tool_input: { file_path: p } });

  if (fichierVise(entree("c:/x/note.md")) !== "c:/x/note.md") casse.push("un fichier .md du hook n'est pas reconnu");
  if (fichierVise(entree("c:/x/page.html")) !== null) casse.push("un fichier .html est pris pour un texte");
  if (fichierVise(entree("c:/x/README.md")) !== null) casse.push("un index régénéré (README.md) n'est pas écarté");
  if (fichierVise(entree("c:/x/node_modules/paquet/LISEZ.md")) !== null) casse.push("un .md de node_modules n'est pas écarté");
  if (fichierVise("{pas du json") !== null) casse.push("une entrée illisible n'est pas ignorée");

  const rouge = join(dir, "rouge.md"); writeFileSync(rouge, ROUGE, "utf8");
  const verte = join(dir, "verte.md"); writeFileSync(verte, VERTE, "utf8");
  const lignesRouges = jouer(rouge);
  if (!lignesRouges.some((l) => /style FAIL/.test(l))) casse.push(`un texte fautif n'est pas signalé FAIL (${lignesRouges.join(" | ") || "aucune ligne"})`);
  const lignesVertes = jouer(verte);
  if (!lignesVertes.some((l) => /style PASS/.test(l))) casse.push(`un texte sobre n'est pas déclaré PASS (${lignesVertes.join(" | ") || "aucune ligne"})`);
  if (jouer(join(dir, "absent.md")).length) casse.push("un fichier absent produit une sortie");
  if (!jouer(rouge, join(dir, "nulle-part.mjs")).some((l) => /NON jouée/.test(l))) casse.push("un oracle absent du poste est tu au lieu d'être dit");

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test hook-ecriture : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test hook-ecriture : 9/9 PASS (.md reconnu ; .html, README.md, node_modules et entrée illisible écartés ; texte fautif FAIL ; texte sobre PASS ; fichier absent silencieux ; oracle absent DIT)");
  return casse.length ? 1 : 0;
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replace(/\\/g, "/") === resolve(process.argv[1]).toLowerCase().replace(/\\/g, "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  let fichier = null;
  const i = args.indexOf("--fichier");
  if (i >= 0) fichier = args[i + 1];
  else {
    let stdin = "";
    try { stdin = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
    fichier = fichierVise(stdin);
  }
  if (!fichier) process.exit(0);
  const lignes = jouer(resolve(fichier));
  if (lignes.length) console.log(lignes.join("\n"));
  process.exit(0);
}
