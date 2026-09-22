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

/** Le chemin écrit, quelle que soit son extension — `fichierVise` ne rend que les `.md`. */
export function cheminEcrit(entree) {
  try {
    const j = typeof entree === "string" ? JSON.parse(entree || "{}") : (entree || {});
    const p = j?.tool_input?.file_path || j?.tool_input?.path || j?.file_path || null;
    if (!p || IGNORES.some((re) => re.test(p))) return null;
    return p;
  } catch { return null; }
}

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

// LA FAMILLE DU LIVRABLE, DEMANDÉE AU MOMENT OÙ ON LE NOMME (TF-1076, 16/09/2026).
//
// LE FAIT est au tableau de bord des récidives : la classe `gabarit-famille-manquante` compte
// 13 items, 1 fondateur et 13 RÉCIDIVES — 100 %, chez quatre produits. *Une classe dont chaque
// retour est une récidive dit que la correction ne redescend pas au moment où le livrable
// s'écrit.* Et la cause tenait en une ligne : la classe déclarait l'oracle « G8 », qui n'existait
// pas. Le catalogue des familles n'était interrogeable que par un lecteur qui savait déjà qu'il
// existait — c'est-à-dire par personne au moment utile.
//
// PORTÉE : les livrables, et eux seuls. Un `.md` de code, de référence ou de gabarit n'a pas de
// famille de document à résoudre ; ce qui en a une vit sous `output\` (R-4) ou sous le `forge\`
// d'un produit. Ailleurs, la question ne se pose pas et la poser ferait du bruit.
//
// AVERTIT, NE BLOQUE PAS, comme tout ce hook : un livrable se construit en plusieurs écritures, et
// bloquer au caractère près apprendrait à désactiver le hook (leçon N4).
const EST_LIVRABLE = /(^|[\\/])(output|livrables)[\\/]/i;
const ORACLE_FAMILLES = join(ICI, "oracle-gabarits-documents.mjs");

/** Joue G8 sur un livrable ; rend les lignes à imprimer (vide si le fichier n'est pas un livrable). */
export function jouerFamille(fichier, oracle = ORACLE_FAMILLES) {
  const lignes = [];
  if (!fichier || !EST_LIVRABLE.test(String(fichier).replace(/\\/g, "/"))) return lignes;
  const nom = basename(fichier);
  if (!existsSync(oracle)) {
    lignes.push(`[famille] non jouée sur ${nom} : ${oracle} absent de ce poste — installer les outils (bootstrap.mjs --pull)`);
    return lignes;
  }
  const r = spawnSync(process.execPath, [oracle, "--livrable", nom], { encoding: "utf8", timeout: 30000 });
  let j = null;
  try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
  const f = j?.findings?.[0];
  if (!f) {
    lignes.push(`[famille] oracle-gabarits-documents ILLISIBLE sur ${nom} (exit ${r.status}) — ce n'est pas un constat sur le livrable`);
    return lignes;
  }
  lignes.push(f.statut === "PASS"
    ? `[famille] ${nom} : ${f.message}`
    : `[famille] ${nom} : G8 — ${f.message}`);
  return lignes;
}

// LE REGISTRE DES ORACLES SOUS LES YEUX AU MOMENT OÙ ON ÉCRIT UN CONTRÔLE (TF-1077, 16/09/2026).
//
// LE FAIT EST UN TAUX : la classe `oracle-remplace-par-controle-maison` compte 14 items dont
// 12 RÉCIDIVES — 86 %, chez six dépôts —, et le cas le plus net est écrit en toutes lettres :
// « un contrôle de sécurité écrit à la main FAUTE D'AVOIR CHERCHÉ l'oracle du domaine ». La règle
// existait au skill `quality-oracles` ; ce qui manquait était le moment. Personne ne relit un
// registre au moment précis où il crée un `verifier-quelque-chose.mjs`.
const ORACLE_CONTROLE = join(ICI, "oracle-controle-maison.mjs");

/** Joue CM-1 sur un fichier de contrôle ; rend les lignes à imprimer (vide si hors portée). */
export function jouerControleMaison(fichier, oracle = ORACLE_CONTROLE, registre = null) {
  const lignes = [];
  if (!fichier || !existsSync(oracle)) return lignes;
  const nom = basename(fichier);
  // Le REGISTRE est passable, et c'est ce qui rend ce cas jouable AILLEURS QUE SUR CE POSTE
  // (TF-1297, A-21 du 22/09/2026). Sans lui, le banc dépendait du registre INSTALLÉ : sur un
  // serveur d'intégration sans répertoire personnel, l'oracle rend SKIP à bon droit et le cas
  // échouait — non parce que la règle était cassée, mais parce que le banc n'avait pas de quoi
  // la jouer. Un banc pose ses propres fixtures.
  const argv = registre ? [oracle, fichier, "--registre", registre] : [oracle, fichier];
  const r = spawnSync(process.execPath, argv, { encoding: "utf8", timeout: 30000 });
  let j = null;
  try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
  const f = j?.findings?.[0];
  if (!f || f.statut === "SKIP" || f.statut === "PASS") return lignes;   // hors portée, ou rien à dire
  lignes.push(`[controle] ${nom} : CM-1 — ${f.message}`);
  return lignes;
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
  // G8 (TF-1076) : la famille n'est demandée QU'aux livrables, et elle se résout ou se nomme.
  if (jouerFamille(join(dir, "note.md")).length)
    casse.push("la famille est demandée à un .md qui n'est pas un livrable — la question ne se pose pas hors de `output\\`");
  mkdirSync(join(dir, "output", "04-plans"), { recursive: true });
  const couvert = join(dir, "output", "04-plans", "Digit-AI - Synthese Mandat - Campagne close - 20260916a.md");
  const nu = join(dir, "output", "04-plans", "Digit-AI - Note Migration - Chemins renommes - 20260916a.md");
  writeFileSync(couvert, VERTE, "utf8"); writeFileSync(nu, VERTE, "utf8");
  const lignesCouvert = jouerFamille(couvert);
  const lignesNu = jouerFamille(nu);
  if (!lignesCouvert.some((l) => /famille « restitution »/.test(l)))
    casse.push(`un livrable « Synthese … » ne résout pas sa famille au catalogue (${lignesCouvert.join(" | ") || "aucune ligne"})`);
  if (!lignesNu.some((l) => /G8 — aucune famille/.test(l)))
    casse.push("un livrable d'un type ABSENT du catalogue n'est pas signalé à l'écriture — c'est par ce silence que la " +
      `classe gabarit-famille-manquante récidive dans 13 cas sur 13 (${lignesNu.join(" | ") || "aucune ligne"})`);

  // CM-1 (TF-1077) : un contrôle écrit à la main sur un domaine couvert est nommé ; un fichier
  // ordinaire ne l'est pas. Le hook ne dit RIEN quand il n'y a rien à dire — un hook bavard se
  // désactive, et ce dépôt a payé la leçon assez souvent pour ne pas la réapprendre.
  const controle = join(dir, "verifier-securite-secrets.mjs");
  writeFileSync(controle, "// Cherche les secrets et les tokens du depot.\n", "utf8");
  // Le banc pose SON registre : le cas joue la règle, jamais l'environnement du poste.
  const registreJetable = join(dir, "registre-oracles.json");
  writeFileSync(registreJetable, JSON.stringify({
    oracles: [{ domaine: "Sécurité / secrets", ext: "any", type: "cli", cmd: ["node", "oracle-secrets.mjs"], statut: "ok" }],
  }, null, 1), "utf8");
  const lignesControle = jouerControleMaison(controle, ORACLE_CONTROLE, registreJetable);
  if (!lignesControle.some((l) => /CM-1/.test(l)))
    casse.push(`un contrôle de sécurité écrit à la main n'est pas signalé à l'écriture — c'est le cas de TF-1046, « faute d'avoir cherché l'oracle du domaine » (${lignesControle.join(" | ") || "aucune ligne"})`);
  const ordinaire = join(dir, "generer-vue.mjs");
  writeFileSync(ordinaire, "// Genere une vue.\n", "utf8");
  if (jouerControleMaison(ordinaire, ORACLE_CONTROLE, registreJetable).length)
    casse.push("un fichier qui n'annonce aucun contrôle fait parler le hook — un hook bavard se désactive");

  const lignesVertes = jouer(verte);
  if (!lignesVertes.some((l) => /style PASS/.test(l))) casse.push(`un texte sobre n'est pas déclaré PASS (${lignesVertes.join(" | ") || "aucune ligne"})`);
  if (jouer(join(dir, "absent.md")).length) casse.push("un fichier absent produit une sortie");
  if (!jouer(rouge, join(dir, "nulle-part.mjs")).some((l) => /NON jouée/.test(l))) casse.push("un oracle absent du poste est tu au lieu d'être dit");

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test hook-ecriture : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test hook-ecriture : 14/14 PASS (.md reconnu ; .html, README.md, node_modules et entrée illisible écartés ; texte fautif FAIL ; texte sobre PASS ; fichier absent silencieux ; oracle absent DIT ; G8 dans ses TROIS sens — pas de famille demandée hors `output\\`, famille résolue sur un « Synthese … », type absent du catalogue NOMMÉ à l'écriture (TF-1076) ; CM-1 dans ses DEUX sens — un contrôle de sécurité écrit à la main NOMMÉ, un fichier ordinaire silencieux (TF-1077))");
  return casse.length ? 1 : 0;
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replace(/\\/g, "/") === resolve(process.argv[1]).toLowerCase().replace(/\\/g, "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  let fichier = null;
  let brut = null;
  const i = args.indexOf("--fichier");
  if (i >= 0) { fichier = args[i + 1]; brut = args[i + 1]; }
  else {
    let stdin = "";
    try { stdin = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
    fichier = fichierVise(stdin);
    brut = cheminEcrit(stdin);
  }
  // Deux portées distinctes : la doctrine d'écriture et la famille ne concernent que les `.md`,
  // le registre des oracles ne concerne QUE les fichiers de contrôle — souvent des `.mjs`, que
  // `fichierVise` écarte par construction. Les lire séparément est ce qui évite de rendre l'un
  // muet pour servir l'autre.
  const lignes = [];
  if (fichier && existsSync(resolve(fichier))) lignes.push(...jouer(resolve(fichier)), ...jouerFamille(resolve(fichier)));
  if (brut && existsSync(resolve(brut))) lignes.push(...jouerControleMaison(resolve(brut)));
  if (!lignes.length) process.exit(0);
  if (lignes.length) console.log(lignes.join("\n"));
  process.exit(0);
}
