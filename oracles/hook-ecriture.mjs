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
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync, readdirSync } from "node:fs";
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

// Le constat G8 d'un livrable, lu UNE fois par processus : `jouerFamille` le dit, `jouerFiche` (TF-1907) y lit
// les règles que la famille engage. Une seule résolution, jamais deux (un second processus par écriture).
const constatsFamille = new Map();
function lireFamille(fichier, oracle) {
  const nom = basename(fichier);
  if (!existsSync(oracle)) {
    return { nom, ligne: `[famille] non jouée sur ${nom} : ${oracle} absent de ce poste — installer les outils (bootstrap.mjs --pull)` };
  }
  const cle = `${oracle}|${nom}`;
  if (!constatsFamille.has(cle)) {
    const r = spawnSync(process.execPath, [oracle, "--livrable", nom], { encoding: "utf8", timeout: 30000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
    constatsFamille.set(cle, j?.findings?.[0]
      ? { nom, f: j.findings[0] }
      : { nom, ligne: `[famille] oracle-gabarits-documents ILLISIBLE sur ${nom} (exit ${r.status}) — ce n'est pas un constat sur le livrable` });
  }
  return constatsFamille.get(cle);
}

/** Joue G8 sur un livrable ; rend les lignes à imprimer (vide si le fichier n'est pas un livrable). */
export function jouerFamille(fichier, oracle = ORACLE_FAMILLES) {
  const lignes = [];
  if (!fichier || !EST_LIVRABLE.test(String(fichier).replace(/\\/g, "/"))) return lignes;
  const { nom, f, ligne } = lireFamille(fichier, oracle);
  if (!f) {
    lignes.push(ligne);
    return lignes;
  }
  lignes.push(f.statut === "PASS"
    ? `[famille] ${nom} : ${f.message}`
    : `[famille] ${nom} : G8 — ${f.message}`);
  return lignes;
}

// LA FICHE DE CONCEPTION AMONT, DEMANDÉE AU MOMENT OÙ ON ÉCRIT LE LIVRABLE (D8, TF-1907, 21/10/2026).
//
// LE FAIT (retour du produit Produit-79, RP-20, 18/10/2026) : un rapport HTML a été écrit, contrôlé et restitué
// sans fiche de conception, que la règle D8 exige avant l'écriture ; la fiche n'a été remplie qu'après le refus
// de l'exploitant. D8 était écrite (gabarits\documents\README.md, CLAUDE-PRODUIT « Règles de socle »), G6 la
// juge SUR APPEL, et rien ne la rencontrait à l'écriture : *une règle que le producteur ne rencontre pas au
// moment où il produit n'existe pas pour lui* (TF-0757).
//
// CE QUE FAIT CE CONTRÔLE. Pour un livrable `.md` ou `.html` écrit sous `output\` ou `livrables\` (la portée de
// G8, `EST_LIVRABLE`), il lit dans le constat G8 déjà rendu — la famille est résolue UNE fois, par
// `lireFamille` — si la famille ENGAGE D8 au catalogue (`regles` de `gabarits\documents\catalogue.jsonl`,
// la même donnée que « Règles engagées » des gabarits). Si oui, il AVERTIT quand le livrable n'a ni fiche ni
// exemption motivée. Une fiche est : un fichier `fiche-conception*.md` (hors gabarit et exemple) à côté du
// livrable ou sous `forge\` du projet, dont le nom partage un terme avec l'objet du livrable (date et indice
// compris) ou dont le texte cite le nom du livrable ; OU la ligne `fiche_de_conception: <chemin>` du livrable
// (`<meta name="fiche-de-conception" content="…">` en HTML). Une exemption est la même ligne :
// `fiche_de_conception: exemption — <motif d'au moins 3 mots>`.
//
// ELLE AVERTIT, NE BLOQUE PAS, comme tout ce hook : l'enjeu d'un document (`fort` ou `ordinaire`, § 6 de la
// fiche) ne se décide pas à la machine, et la fiche reste due dans les deux cas. Ce hook tourne aussi chez les
// produits : `gabarits\hooks-factory.mjs` lance ce fichier DU PILOT avec le produit pour répertoire courant,
// et la fiche se cherche donc sous le `forge\` du produit.
//
// CE QU'ELLE NE COUVRE PAS, et c'est écrit : une famille qui n'engage pas D8 au catalogue (études, rapports de
// données, restitutions…) n'est pas jugée — c'est la DONNÉE qui l'élargit, pas ce code. La recherche d'une
// fiche est bornée (profondeur 6 sous `forge\`, 500 entrées) ; au-delà, elle ne la voit pas et avertit.
const EST_FICHE = /fiche[-_ ]?(?:de[-_ ])?conception/i;
const GABARIT_OU_EXEMPLE_FICHE = /^FICHE-CONCEPTION(?:-EXEMPLE)?\.md$/i;
const TERMES_SANS_VALEUR = new Set(["fiche", "conception", "etude", "rapport", "document", "livrable", "produit", "digit"]);
const normaliserFiche = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const termesDe = (s) => normaliserFiche(s).split(" ").filter((m) => m.length >= 4 && !TERMES_SANS_VALEUR.has(m));
const DECLARATION_MD = /^\s*(?:<!--\s*)?fiche[_ -]?de[_ -]?conception\s*:\s*(.+?)\s*(?:-->)?\s*$/im;
const DECLARATION_HTML = /<meta\s+name=["']fiche-(?:de-)?conception["']\s+content=["']([^"']+)["']/i;
const BORNE_ENTREES = 500, BORNE_PROFONDEUR = 6;

/** Les fiches de conception remplies (hors gabarit et exemple) à côté du livrable et sous `forge\` du projet. */
function fichesCandidates(dossierLivrable, racine) {
  const trouvees = []; let vues = 0;
  const parcourir = (dir, profondeur, recursif) => {
    if (profondeur > BORNE_PROFONDEUR || vues >= BORNE_ENTREES) return;
    let entrees; try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (++vues > BORNE_ENTREES) return;
      const chemin = join(dir, e.name);
      if (e.isDirectory()) { if (recursif && !IGNORES.some((re) => re.test(chemin + "/"))) parcourir(chemin, profondeur + 1, true); continue; }
      if (e.isFile() && /\.md$/i.test(e.name) && EST_FICHE.test(e.name) && !GABARIT_OU_EXEMPLE_FICHE.test(e.name)) trouvees.push(chemin);
    }
  };
  parcourir(dossierLivrable, 0, false);
  parcourir(join(racine, "forge"), 0, true);
  return trouvees;
}

/**
 * Joue la règle D8 à l'écriture d'un livrable ; rend les lignes à imprimer (vide : hors livrable, famille qui
 * n'engage pas D8, fiche trouvée ou exemption motivée — un hook bavard se désactive).
 */
export function jouerFiche(fichier, oracle = ORACLE_FAMILLES, racine = process.cwd()) {
  const lignes = [];
  if (!fichier || !existsSync(fichier) || !EST_LIVRABLE.test(String(fichier).replace(/\\/g, "/"))) return lignes;
  if (!/\.(?:md|html?)$/i.test(fichier) || INDEX_REGENERES.has(basename(fichier).toLowerCase())) return lignes;
  if (EST_FICHE.test(basename(fichier))) return lignes;                 // la fiche elle-même n'a pas sa fiche
  const { nom, f } = lireFamille(fichier, oracle);
  if (!f || f.statut !== "PASS" || !Array.isArray(f.regles) || !f.regles.includes("D8")) return lignes;
  let texte = ""; try { texte = readFileSync(fichier, "utf8"); } catch { return lignes; }
  const remede = "la fiche se remplit AVANT d'écrire (`gabarits\\documents\\FICHE-CONCEPTION.md`, chez un produit `forge\\documents\\FICHE-CONCEPTION.md`) "
    + "et se juge par `node oracles\\oracle-gabarits-documents.mjs --fiche <fiche.md> <livrable>` (G6) ; sinon une ligne du livrable déclare "
    + "`fiche_de_conception: <chemin>` ou `fiche_de_conception: exemption — <motif d'au moins 3 mots>`";
  const entete = `[fiche] ${nom} : D8 — la famille « ${f.id} » engage la fiche de conception amont`;
  const declaration = (DECLARATION_MD.exec(texte) || DECLARATION_HTML.exec(texte) || [])[1] || null;
  if (declaration) {
    const exemption = /^exemption\s*[:—–-]\s*(.+)$/i.exec(declaration);
    if (exemption) {
      if (exemption[1].trim().split(/\s+/).length >= 3) return lignes;
      lignes.push(`${entete}, et son exemption est déclarée SANS motif (« ${declaration.slice(0, 60)} ») — un motif d'au moins 3 mots, ou la fiche`);
      return lignes;
    }
    const dossier = dirname(resolve(fichier));
    if ([resolve(dossier, declaration), resolve(racine, declaration)].some((p) => existsSync(p))) return lignes;
    lignes.push(`${entete}, et la fiche déclarée (« ${declaration.slice(0, 80)} ») est introuvable — ${remede}`);
    return lignes;
  }
  const termesDuLivrable = new Set(termesDe(basename(fichier).replace(/\.[a-z0-9]+$/i, "")));
  const base = basename(fichier).replace(/\.[a-z0-9]+$/i, "");
  const fiche = fichesCandidates(dirname(resolve(fichier)), racine).find((c) => {
    if (termesDe(basename(c).replace(/\.md$/i, "")).some((m) => termesDuLivrable.has(m))) return true;
    try { return readFileSync(c, "utf8").includes(base); } catch { return false; }
  });
  if (fiche) return lignes;
  lignes.push(`${entete}, et aucune ne l'accompagne : ni fiche-conception*.md à côté du livrable ou sous forge\\ qui le nomme, ni ligne de déclaration — ${remede}. `
    + "Avertissement, non bloquant (TF-1907).");
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
  } else if (!j.a_rejouer) {
    lignes.push(`[ecriture] ${nom} : style PASS (${familles} familles, ${j.mots} mots)`);
  }
  // À REJOUER (TF-1960, D-78 (c) amendée du 26/10/2026) : concision d'un écrit à un tiers (EC-14) et langue (EC-15). Un RAPPEL, jamais
  // un blocage : le verdict reste PASS. La session qui a écrit le texte le réécrit sur ces passages et rejoue l'oracle, 3 passes au plus.
  if (j.a_rejouer && j.verdict !== "SKIP") {
    const a = j.a_rejouer;
    lignes.push(`[ecriture] ${nom} : À REJOUER (non bloquant) — ${a.nombre} passage(s) à réécrire (${[...new Set(a.regles)].join(", ")}) : réécrire ces passages, puis rejouer node oracles\\oracle-ecriture.mjs <ce fichier> --passe ${a.passe + 1} (${a.passes_max} passes au plus ; au-delà, remettre avec les écarts nommés ; --langue <code> si le lecteur n'est pas francophone)`);
    const detail = (p) => `${p.regle} (ligne ${p.ligne})${p.mots ? ` ${p.mots} mots` : ""}${p.elements ? ` ${p.elements} éléments` : ""}${p.langue ? ` en ${p.langue}` : ""} : « ${String(p.extrait || "").slice(0, 60)} »`;
    lignes.push(...a.passages.slice(0, 8).map((p) => `[ecriture]   ${detail(p)}`));
    if (a.passages.length > 8) lignes.push(`[ecriture]   … et ${a.passages.length - 8} autre(s) passage(s) : node oracles\\oracle-ecriture.mjs <ce fichier> les liste tous`);
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
  // À REJOUER (TF-1960) : un courriel à un tiers dont un paragraphe fait 90 mots rend un RAPPEL qui nomme le passage, jamais « style FAIL » ;
  // le même réécrit rend PASS ; un courriel anglais sans déclaration de langue est rappelé, le même avec `langue: en` en en-tête PASS.
  const courrielRouge = join(dir, "Client-A - Courriel - Relance livraison - 20261026a.md");
  writeFileSync(courrielRouge, "Bonjour Madame Durand,\n\nNous vous écrivons au sujet de la livraison des maquettes, qui devait nous parvenir le 12 octobre et que nous n'avons toujours pas reçue. "
    + "Cette livraison conditionne le démarrage du développement prévu la semaine prochaine, et sans elle nous ne pouvons pas engager les équipes. "
    + "Nous avons relancé votre service par téléphone le 15 et le 19 octobre, sans obtenir de réponse écrite de sa part. "
    + "Nous vous demandons donc de nous confirmer une date ferme avant vendredi, faute de quoi nous reporterons le démarrage à la fin du mois.\n\nCordialement,\nPaul Martin\n", "utf8");
  const lignesRejeu = jouer(courrielRouge);
  if (!lignesRejeu.some((l) => /À REJOUER \(non bloquant\) — 1 passage\(s\) à réécrire \(EC-14-paragraphe\).*--passe 2.*3 passes au plus/.test(l)) || !lignesRejeu.some((l) => /EC-14-paragraphe \(ligne 3\) 90 mots/.test(l)))
    casse.push(`un courriel à un tiers dont un paragraphe fait 90 mots n'est pas rappelé À REJOUER avec son passage (${lignesRejeu.join(" | ") || "aucune ligne"})`);
  if (lignesRejeu.some((l) => /style FAIL|style PASS/.test(l))) casse.push(`un texte à rejouer est déclaré FAIL ou PASS au lieu d'être rappelé (${lignesRejeu.join(" | ")})`);
  const courrielVert = join(dir, "Client-A - Courriel - Relance livraison v2 - 20261026b.md");
  writeFileSync(courrielVert, "Bonjour Madame Durand,\n\nLes maquettes devaient nous parvenir le 12 octobre. Nous ne les avons toujours pas reçues.\n\nSans elles, nous ne pouvons pas engager les équipes ni démarrer le développement prévu la semaine prochaine.\n\nPouvez-vous nous confirmer une date ferme avant vendredi ?\n\nCordialement,\nPaul Martin\n", "utf8");
  const lignesRejeuVert = jouer(courrielVert);
  if (!lignesRejeuVert.some((l) => /style PASS/.test(l)) || lignesRejeuVert.some((l) => /À REJOUER/.test(l))) casse.push(`le même courriel réécrit n'est pas PASS sans rappel (${lignesRejeuVert.join(" | ") || "aucune ligne"})`);
  const courrielEn = join(dir, "Client-B - Courriel - Delivery follow-up - 20261026a.md");
  const corpsEn = "Dear Ms Durand,\n\nThe mockups were due on 12 October and we have not received them yet.\n\nWithout them, we cannot start the development phase next week. The teams and the test environments are still to be booked.\n\nWe called your department twice, without a written answer. Could you confirm a firm date before Friday?\n\nKind regards,\nPaul Martin\n";
  writeFileSync(courrielEn, corpsEn, "utf8");
  if (!jouer(courrielEn).some((l) => /À REJOUER \(non bloquant\) — 3 passage\(s\) à réécrire \(EC-15\)/.test(l))) casse.push("un courriel anglais sans déclaration de langue n'est pas rappelé À REJOUER (EC-15)");
  writeFileSync(courrielEn, "---\nlangue: en\n---\n\n" + corpsEn, "utf8");
  if (jouer(courrielEn).some((l) => /À REJOUER|FAIL/.test(l))) casse.push("un courriel anglais déclaré `langue: en` est encore rappelé — l'anglais ne doit pas être un critère de blocage (D-78)");
  if (jouer(join(dir, "absent.md")).length) casse.push("un fichier absent produit une sortie");
  if (!jouer(rouge, join(dir, "nulle-part.mjs")).some((l) => /NON jouée/.test(l))) casse.push("un oracle absent du poste est tu au lieu d'être dit");

  // D8 (TF-1907) — LA FICHE DE CONCEPTION AMONT, À L'ÉCRITURE. Un projet jetable (`racine`), une famille qui
  // engage D8 au catalogue réel (« Kit partenaire », D1 D3 D6 D8 D11) et une qui ne l'engage pas (« Synthese »).
  // Rouge : le livrable sans fiche ni exemption, l'exemption sans motif, la fiche déclarée introuvable, le gabarit
  // vierge pris pour une fiche. Vert : la fiche qui nomme le livrable, l'exemption motivée, la fiche déclarée,
  // une famille qui n'engage pas D8, un chemin hors de `output\`, et le livrable HTML (hook-page-html).
  const projet = join(dir, "projet-d8");
  mkdirSync(join(projet, "output", "05-livrables"), { recursive: true });
  mkdirSync(join(projet, "forge", "documents"), { recursive: true });
  const NOM_D8 = "Digit-AI - Kit partenaire - Onboarding revendeurs - 20261021a";
  const livrableD8 = (ext, corps = "Un texte de livrable.\n") => {
    const p = join(projet, "output", "05-livrables", `${NOM_D8}.${ext}`);
    writeFileSync(p, corps, "utf8");
    return p;
  };
  const d8 = (p) => jouerFiche(p, ORACLE_FAMILLES, projet);
  if (!d8(livrableD8("md")).some((l) => /\[fiche\][^\n]*D8[^\n]*aucune ne l'accompagne/.test(l)))
    casse.push("D8 : un livrable d'une famille qui engage la fiche, écrit SANS fiche ni exemption, n'est pas signalé — c'est le rapport du 18/10/2026 (TF-1907)");
  writeFileSync(join(projet, "forge", "documents", "FICHE-CONCEPTION.md"), "# gabarit vierge\n", "utf8");
  if (!d8(livrableD8("md")).length)
    casse.push("D8 : le GABARIT vierge forge\\documents\\FICHE-CONCEPTION.md est pris pour la fiche du livrable");
  mkdirSync(join(projet, "forge", "etapes", "onboarding"), { recursive: true });
  writeFileSync(join(projet, "forge", "etapes", "onboarding", "fiche-conception-onboarding-revendeurs.md"), "famille: gd-kit-partenaire\n", "utf8");
  if (d8(livrableD8("md")).length) casse.push("D8 : la fiche qui nomme le livrable, sous forge\\, est ignorée — le hook avertit à tort");
  rmSync(join(projet, "forge", "etapes"), { recursive: true, force: true });
  if (d8(livrableD8("md", "fiche_de_conception: exemption — note interne sans lecteur externe\n\nTexte.\n")).length)
    casse.push("D8 : une exemption MOTIVÉE du livrable avertit encore");
  if (!d8(livrableD8("md", "fiche_de_conception: exemption — oui\n\nTexte.\n")).some((l) => /SANS motif/.test(l)))
    casse.push("D8 : une exemption sans motif (un mot) passe — l'exemption doit se motiver");
  if (!d8(livrableD8("md", "fiche_de_conception: forge/fiche-introuvable.md\n\nTexte.\n")).some((l) => /introuvable/.test(l)))
    casse.push("D8 : une fiche déclarée mais absente du disque passe");
  writeFileSync(join(projet, "forge", "fiche-conception-kit.md"), "famille: gd-kit-partenaire\n", "utf8");
  if (d8(livrableD8("md", "fiche_de_conception: forge/fiche-conception-kit.md\n\nTexte.\n")).length)
    casse.push("D8 : une fiche déclarée ET présente avertit à tort");
  rmSync(join(projet, "forge", "fiche-conception-kit.md"), { force: true });
  const synthese = join(projet, "output", "05-livrables", "Digit-AI - Synthese Mandat - Campagne close - 20261021a.md");
  writeFileSync(synthese, "Un texte.\n", "utf8");
  if (d8(synthese).length) casse.push("D8 : une famille qui n'engage pas D8 (restitution) est accusée — la donnée du catalogue décide, pas ce code");
  const horsOutput = join(projet, `${NOM_D8}.md`);
  writeFileSync(horsOutput, "Un texte.\n", "utf8");
  if (d8(horsOutput).length) casse.push("D8 : un fichier hors de `output\\` est accusé — la question ne se pose pas hors des livrables");
  const htmlD8 = livrableD8("html", "<!doctype html><html><body><h1>Kit</h1></body></html>");
  if (!d8(htmlD8).some((l) => /D8/.test(l))) casse.push("D8 : un livrable HTML sans fiche n'est pas signalé — le rapport du 18/10/2026 était une page HTML");
  const lancerPageHtml = spawnSync(process.execPath, [join(ICI, "hook-page-html.mjs"), "--fichier", htmlD8],
    { encoding: "utf8", cwd: projet, timeout: 120000 });
  if (!/\[fiche\][^\n]*D8/.test(lancerPageHtml.stdout || ""))
    casse.push(`D8 : le hook de PAGE HTML, lancé pour de bon, ne rend pas l'avertissement de fiche (${String(lancerPageHtml.stdout).slice(0, 200)})`);
  // Le CHEMIN PRODUIT : le lanceur gabarits\hooks-factory.mjs, copié en forge\hooks\factory.mjs d'un produit, résout le
  // pilot (FORGE_ROOT) et lance CE hook avec le produit pour répertoire courant. Rejoué pour de bon, il rend le même
  // avertissement, et se tait une fois la fiche posée sous le forge\ du produit. Jouable seulement si ce dépôt porte
  // le nom que le lanceur cherche (« digit-ai-factory ») : sinon le cas est DIT non joué, jamais compté vert.
  let produitNonJoue = null;
  if (basename(resolve(ICI, "..")) !== "digit-ai-factory") produitNonJoue = `ce dépôt s'appelle « ${basename(resolve(ICI, ".."))} », le lanceur cherche « digit-ai-factory »`;
  else {
    const produit = join(dir, "produit");
    mkdirSync(join(produit, "forge", "hooks"), { recursive: true });
    mkdirSync(join(produit, "output"), { recursive: true });
    writeFileSync(join(produit, "forge", "hooks", "factory.mjs"), readFileSync(join(ICI, "..", "gabarits", "hooks-factory.mjs"), "utf8"), "utf8");
    const docProduit = join(produit, "output", `${NOM_D8}.md`);
    writeFileSync(docProduit, "Un texte de livrable.\n", "utf8");
    const viaProduit = () => spawnSync(process.execPath, [join(produit, "forge", "hooks", "factory.mjs"), "ecriture", "--fichier", docProduit],
      { encoding: "utf8", cwd: produit, input: "", timeout: 120000, env: { ...process.env, FORGE_ROOT: resolve(ICI, "..", "..") } });
    const sans = viaProduit();
    if (!/\[fiche\][^\n]*D8/.test(sans.stdout || ""))
      casse.push(`D8 : par le lanceur d'un PRODUIT (forge\\hooks\\factory.mjs), l'avertissement de fiche n'arrive pas (${String(sans.stdout).slice(0, 200)} / ${String(sans.stderr).slice(0, 200)})`);
    writeFileSync(join(produit, "forge", "fiche-conception-onboarding.md"), "famille: gd-kit-partenaire\n", "utf8");
    if (/\[fiche\]/.test(viaProduit().stdout || "")) casse.push("D8 : par le lanceur d'un produit, la fiche posée sous son forge\\ n'est pas vue");
  }

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test hook-ecriture : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test hook-ecriture : 14 cas d'avant + À REJOUER (TF-1960) PASS — courriel à un tiers de 90 mots rappelé avec son passage et sa passe 2 sur 3, jamais FAIL, le même réécrit PASS, courriel anglais rappelé puis PASS avec `langue: en` ; + D8 (TF-1907) PASS — livrable d'une famille qui engage la fiche sans fiche NOMMÉ, gabarit vierge refusé comme fiche, fiche qui nomme le livrable PASS, exemption motivée PASS, exemption sans motif et fiche déclarée introuvable NOMMÉES, fiche déclarée présente PASS, famille sans D8 et fichier hors `output\\` silencieux, page HTML signalée par le hook de page, chemin PRODUIT par le lanceur de la factory " + (produitNonJoue ? `(NON JOUÉ : ${produitNonJoue}) ` : "(joué) ") + "; les 14 d'avant : (.md reconnu ; .html, README.md, node_modules et entrée illisible écartés ; texte fautif FAIL ; texte sobre PASS ; fichier absent silencieux ; oracle absent DIT ; G8 dans ses TROIS sens — pas de famille demandée hors `output\\`, famille résolue sur un « Synthese … », type absent du catalogue NOMMÉ à l'écriture (TF-1076) ; CM-1 dans ses DEUX sens — un contrôle de sécurité écrit à la main NOMMÉ, un fichier ordinaire silencieux (TF-1077))");
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
  if (fichier && existsSync(resolve(fichier))) lignes.push(...jouer(resolve(fichier)), ...jouerFamille(resolve(fichier)), ...jouerFiche(resolve(fichier)));
  if (brut && existsSync(resolve(brut))) lignes.push(...jouerControleMaison(resolve(brut)));
  if (!lignes.length) process.exit(0);
  if (lignes.length) console.log(lignes.join("\n"));
  process.exit(0);
}
