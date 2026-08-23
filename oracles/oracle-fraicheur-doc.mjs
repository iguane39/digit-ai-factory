#!/usr/bin/env node
/**
 * oracle-fraicheur-doc.mjs — fraîcheur des documents de pilotage contre les sources vérifiables.
 * v2 (TF-0115) : moteur générique piloté par `fraicheur-claims.json` — chaque claim confronte
 * une affirmation comptable d'un document (INVENTAIRE, fiches) à une sonde exécutable :
 *   - claim `extraire` + sonde numérique : le nombre cité == le nombre constaté ;
 *   - claim `interdit` + sonde booléenne : le document ne doit pas affirmer X si la sonde le réfute.
 * Sondes : compter_fichiers (glob simple), extraire_doc (regex sur un fichier source),
 * grep_sources (présence d'un motif dans les sources .py/.mjs/.js d'un dossier).
 * Usage : node oracle-fraicheur-doc.mjs [racine-forges] | --self-test  — exit 0/1/2.
 */
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

function chercherDansSources(dossier, motif) {
  const pile = [dossier];
  while (pile.length) {
    const d = pile.pop();
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!/^(\.|node_modules|\.venv|dist|build|__pycache__)/.test(e.name)) pile.push(join(d, e.name));
      } else if (/\.(py|mjs|js)$/.test(e.name)) {
        if (readFileSync(join(d, e.name), "utf8").includes(motif)) return true;
      }
    }
  }
  return false;
}

export function executerSonde(sonde, racineForges) {
  const depot = join(racineForges, sonde.depot);
  if (sonde.type === "compter_fichiers")
    return readdirSync(join(depot, sonde.dossier)).filter((n) => n.startsWith(sonde.prefixe) && n.endsWith(sonde.suffixe)).length;
  if (sonde.type === "extraire_doc") {
    const m = readFileSync(join(depot, sonde.fichier), "utf8").match(new RegExp(sonde.motif));
    return m ? Number(m[1]) : null;
  }
  if (sonde.type === "grep_sources")
    return chercherDansSources(join(depot, sonde.dossier), sonde.motif);
  throw new Error(`type de sonde inconnu : ${sonde.type}`);
}

export function jugerClaim(claim, texteDoc, valeurSonde) {
  const id = claim.id;
  if (claim.extraire) {
    const m = texteDoc.match(new RegExp(claim.extraire));
    if (!m) return { regle: id, statut: "FAIL", message: `le document ne porte plus le motif « ${claim.extraire} » — claim à réviser` };
    if (valeurSonde === null) return { regle: id, statut: "SANS_OBJET", message: "sonde inopérante (motif source introuvable)" };
    const cite = Number(m[1]);
    return cite === valeurSonde
      ? { regle: id, statut: "PASS", message: `${cite} cité == ${valeurSonde} constaté` }
      : { regle: id, statut: "FAIL", message: `document cite ${cite}, la source constate ${valeurSonde}` };
  }
  if (claim.interdit) {
    const nie = new RegExp(claim.interdit).test(texteDoc);
    if (valeurSonde && nie) return { regle: id, statut: "FAIL", message: `le document affirme « ${claim.interdit} » que la source réfute` };
    return { regle: id, statut: "PASS", message: nie ? "affirmation présente mais non réfutée par la source" : "affirmation absente — rien à réfuter" };
  }
  return { regle: id, statut: "FAIL", message: "claim sans « extraire » ni « interdit »" };
}

function jugerTout(racinePilot, racineForges, cheminClaims) {
  const spec = JSON.parse(readFileSync(cheminClaims, "utf8"));
  if (spec.schema !== "pilot/fraicheur-claims@1") throw new Error(`schéma claims inattendu : ${spec.schema}`);
  const docs = new Map();
  const findings = [];
  for (const claim of spec.claims) {
    if (!docs.has(claim.doc)) docs.set(claim.doc, readFileSync(join(racinePilot, claim.doc), "utf8"));
    let valeur;
    try { valeur = executerSonde(claim.sonde, racineForges); }
    catch (e) { findings.push({ regle: claim.id, statut: "FAIL", message: `sonde en erreur : ${e.message}` }); continue; }
    findings.push(jugerClaim(claim, docs.get(claim.doc), valeur));
  }
  return findings;
}

/* ---- BALAYAGE DE CLASSE (TF-0477, 23/08/2026) ------------------------------------------------
 *
 * LA RÈGLE, venue d'une veille externe et absente de notre corpus : UNE NOTE DOCUMENTE LA FORME
 * D'UN CONTRAT, JAMAIS SA VALEUR COURANTE. Ce qui bouge — un compte, un haché, un identifiant, une
 * date de dernier passage — vit dans le dépôt et se lit à l'exécution. Une note qui recopie une
 * telle valeur lui crée un SECOND DOMICILE qui dérivera en silence, et le lecteur fera confiance à
 * la copie. Corollaire opérationnel : une valeur ne se cite que si quelque chose en aval dépend de
 * CETTE valeur exacte, et ce dépendant est nommé dans la même phrase — une citation sans dépendant
 * nommé est une copie que rien ne surveille.
 *
 * CE QUI MANQUAIT, et c'est le vrai sujet : la détection était NOMINATIVE. Un claim n'existe que si
 * quelqu'un a déjà constaté la dérive et écrit sa sonde — donc on trouvait toujours l'INSTANCE et
 * jamais la CLASSE. Mesure du 22/08 : six claims, TOUS sur le même document, alors que les deux
 * dernières dérives avouées (TF-0311, TF-0334) vivaient dans le README d'une forge ; et ce seul
 * document portait environ 81 assertions de dénombrement pour 6 sondes — moins d'une sur dix.
 *
 * Ce balayage rend donc la CLASSE : toute assertion de dénombrement d'un document de pilotage qui
 * n'est ni couverte par un claim, ni accompagnée de son domicile dans la même phrase. Il est
 * AVERTISSANT et jamais bloquant, et c'est un choix : le corpus en porte des dizaines de bonne
 * foi, et un contrôle qui bloquerait sur elles apprendrait à être contourné. Il donne le balayage
 * — la partie que la candidature disait coûteuse — et laisse l'arbitrage à la lecture.
 */
const MOTIF_COMPTE = /(\d[\d\u00a0 ]*)\s+(oracles?|contr[ôo]les?|r[èe]gles?|items?|claims?|fichiers?|d[ée]p[ôo]ts?|pans?|forges?|skills?|cas|sections?|documents?|noeuds?|n[œo]uds?|adaptateurs?|tests?)\b/gi;
// Un DOMICILE nommé dans la même phrase : un chemin, une commande, un fichier, un verdict d'oracle.
// C'est exactement ce que la règle demande — nommer le dépendant, ou devenir un pointeur.
const MOTIF_DOMICILE = /(`[^`]*[\\/.][^`]*`|\bnode\s|\bpython\s|\.mjs\b|\.py\b|\.json\b|\.jsonl\b|\.md\b|oracle-|self-test|registre|manifeste?|lockfile)/i;

/** Les phrases d'un texte Markdown, hors blocs de code et hors frontmatter. */
function phrasesUtiles(texte) {
  const sansCode = texte.replace(/```[\s\S]*?```/g, " ").replace(/^---[\s\S]*?^---/m, " ");
  const out = [];
  let ligne = 0;
  for (const l of sansCode.split(/\r?\n/)) {
    ligne += 1;
    if (/^\s*(#|\||>)/.test(l)) continue;      // titres, tableaux, citations : jugés ailleurs
    for (const ph of l.split(/(?<=[.;:!?])\s+/)) if (ph.trim()) out.push({ ligne, texte: ph });
  }
  return out;
}

export function balayer(texte, motifsCouverts = []) {
  const constats = [];
  for (const { ligne, texte: ph } of phrasesUtiles(texte)) {
    const comptes = [...ph.matchAll(MOTIF_COMPTE)];
    if (!comptes.length) continue;
    if (MOTIF_DOMICILE.test(ph)) continue;                       // le domicile est nommé : conforme
    if (motifsCouverts.some((m) => { try { return new RegExp(m).test(ph); } catch { return false; } })) continue;
    constats.push({ ligne, extrait: ph.trim().slice(0, 120), valeurs: comptes.map((m) => m[0].trim()) });
  }
  return constats;
}

function balayageDocs(racinePilot, cheminClaims, docs) {
  const spec = JSON.parse(readFileSync(cheminClaims, "utf8"));
  const couverts = spec.claims.filter((c) => c.extraire).map((c) => c.extraire);
  const findings = [];
  for (const doc of docs) {
    let texte = "";
    try { texte = readFileSync(join(racinePilot, doc), "utf8"); }
    catch { findings.push({ regle: "F-CLASSE", statut: "SANS_OBJET", message: `${doc} illisible` }); continue; }
    const constats = balayer(texte, couverts);
    if (!constats.length) {
      findings.push({ regle: "F-CLASSE", statut: "PASS", message: `${doc} : aucune valeur mobile sans domicile nommé` });
      continue;
    }
    findings.push({
      regle: "F-CLASSE", statut: "AVERTISSEMENT",
      message: `${doc} : ${constats.length} assertion(s) de dénombrement sans domicile nommé dans la ` +
        `phrase — une valeur citée nomme son dépendant, ou devient un pointeur. ` +
        constats.slice(0, 5).map((c) => `l.${c.ligne} « ${c.extrait} »`).join(" · ") +
        (constats.length > 5 ? ` … +${constats.length - 5}` : ""),
    });
  }
  return findings;
}

function selfTest() {
  // TF-0477 — les deux sens du balayage de classe, sur du texte fabriqué : une phrase qui NOMME son
  // domicile passe, la même sans domicile est signalée. La couverture par claim est testée aussi :
  // ce qui est déjà surveillé ne doit pas être signalé deux fois.
  const casBalayage = [
    ["conforme (domicile nommé)", "Le registre porte 61 items actifs, comptés par `node todo/generer-vue.mjs`.", 0],
    ["fautif (valeur sans domicile)", "La forge porte 26 oracles et 82 regles verrouillees.", 1],
    ["conforme (couvert par un claim)", "Il y a 12 controles ici.", 0, ["(\\d+) controles"]],
    ["hors périmètre (tableau)", "| 26 oracles | 82 regles |", 0],
    ["hors périmètre (bloc de code)", "```\nporte 26 oracles\n```", 0],
  ];
  const ratesBalayage = [];
  for (const [quoi, texte, attendu, couverts] of casBalayage) {
    const n = balayer(texte, couverts || []).length;
    if (n !== attendu) ratesBalayage.push(`${quoi} : ${n} constat(s) pour ${attendu} attendu(s)`);
  }
  const dossier = mkdtempSync(join(tmpdir(), "fraicheur-"));
  const forges = join(dossier, "forges"); const pilot = join(dossier, "pilot");
  mkdirSync(join(forges, "forge-x", "oracles"), { recursive: true });
  mkdirSync(pilot, { recursive: true });
  writeFileSync(join(forges, "forge-x", "oracles", "oracle-a.mjs"), "// a");
  writeFileSync(join(forges, "forge-x", "oracles", "oracle-b.mjs"), "// b");
  writeFileSync(join(forges, "forge-x", "README.md"), "porte 7 contrôles au total");
  mkdirSync(join(forges, "forge-x", "src"), { recursive: true });
  writeFileSync(join(forges, "forge-x", "src", "cli.py"), 'parser.add_argument("--sortie")');
  const claims = (invTexte, clms) => {
    writeFileSync(join(pilot, "INV.md"), invTexte);
    writeFileSync(join(dossier, "claims.json"), JSON.stringify({ schema: "pilot/fraicheur-claims@1", claims: clms }));
    return jugerTout(pilot, forges, join(dossier, "claims.json"));
  };
  const C1 = { id: "x-oracles", doc: "INV.md", extraire: "(\\d+) oracles", sonde: { type: "compter_fichiers", depot: "forge-x", dossier: "oracles", prefixe: "oracle-", suffixe: ".mjs" } };
  const C2 = { id: "x-controles", doc: "INV.md", extraire: "(\\d+) contrôles", sonde: { type: "extraire_doc", depot: "forge-x", fichier: "README.md", motif: "(\\d+) contrôles" } };
  const C3 = { id: "x-sortie", doc: "INV.md", interdit: "aucune option --sortie", sonde: { type: "grep_sources", depot: "forge-x", dossier: "src", motif: '"--sortie"' } };
  const resultats = [];
  const attendre = (nom, attendu, findings) =>
    resultats.push({ fixture: nom, attendu, obtenu: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS" });
  attendre("verte", "PASS", claims("2 oracles ici, 7 contrôles là, rapport persistable", [C1, C2, C3]));
  attendre("rouge/compte-fichiers", "FAIL", claims("3 oracles ici, 7 contrôles là", [C1, C2]));
  attendre("rouge/compte-doc", "FAIL", claims("2 oracles ici, 9 contrôles là", [C1, C2]));
  attendre("rouge/negation-refutee", "FAIL", claims("2 oracles ici, 7 contrôles là, aucune option --sortie", [C1, C2, C3]));
  rmSync(dossier, { recursive: true, force: true });
  const rates = resultats.filter((r) => r.attendu !== r.obtenu);
  for (const r of ratesBalayage) resultats.push({ fixture: `balayage/${r}`, attendu: "0", obtenu: "écart" });
  const total = rates.length + ratesBalayage.length;
  console.log(JSON.stringify({ oracle: "oracle-fraicheur-doc", mode: "self-test",
    verdict: total ? "FAIL" : "PASS", cas_balayage: casBalayage.length, resultats }, null, 1));
  process.exit(total ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (process.argv.includes("--self-test")) selfTest();
  try {
    const racinePilot = join(ICI, "..");
    const racineForges = process.argv[2] || process.env.FORGE_ROOT || join(racinePilot, "..");
    const findings = jugerTout(racinePilot, racineForges, join(ICI, "fraicheur-claims.json"));
    // TF-0477 — le BALAYAGE DE CLASSE s'ajoute aux claims nominatifs, il ne les remplace pas : un
    // claim PROUVE une valeur, le balayage signale celles que personne ne surveille. Les documents
    // balayés sont ceux du pilotage — ceux qu'un lecteur croit sur parole.
    const DOCS_BALAYES = ["INVENTAIRE.md", "CONTRAT-INTERFACE.md", "REGLES-PROJET.md",
      "references/EMPREINTES.md", "references/ETAPES-RUN.md", "references/TODO-FORGE.md"];
    findings.push(...balayageDocs(racinePilot, join(ICI, "fraicheur-claims.json"), DOCS_BALAYES));
    const echecs = findings.filter((f) => f.statut === "FAIL").length;
    console.log(JSON.stringify({
      oracle: "oracle-fraicheur-doc", version: "2.1.0", verdict: echecs ? "FAIL" : "PASS", findings,
      non_juge: [
        "les affirmations non couvertes par un claim RESTENT non prouvées : le balayage de classe les SIGNALE, il ne les vérifie pas — c'est une liste de travail, pas un verdict",
        "la véracité des sources elles-mêmes (README des forges)",
        "le balayage (F-CLASSE) est AVERTISSANT et jamais bloquant, par choix : le corpus porte des dizaines d'assertions de bonne foi, et un contrôle qui bloquerait sur elles apprendrait à être contourné",
        "le balayage lit une PHRASE : il ne voit ni les tableaux, ni les titres, ni les blocs de code, et il accepte tout domicile nommé (chemin, commande, fichier) sans vérifier que ce domicile porte VRAIMENT la valeur",
        "les documents balayés sont une liste ÉCRITE (pilotage), pas une découverte : un document de pilotage neuf n'est pas balayé tant qu'il n'y figure pas",
      ],
    }, null, 1));
    process.exit(echecs ? 1 : 0);
  } catch (e) {
    console.log(JSON.stringify({ oracle: "oracle-fraicheur-doc", verdict: "ERREUR", message: String(e) }, null, 1));
    process.exit(2);
  }
}
