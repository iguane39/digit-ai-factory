#!/usr/bin/env node
/**
 * anonymiser-suivis.mjs — LES NOMS SONT RETIRÉS DE TOUT CE QUE GIT SUIT, PAS SEULEMENT DE CE QUI
 * ENTRE AU REGISTRE.
 *
 * ============================================================================================
 * LA QUESTION QUI FAIT NAÎTRE CE MODULE, ET SA RÉPONSE MESURÉE (01/09/2026)
 * ============================================================================================
 *
 * « Les noms des clients et projets doivent être anonymisés, pourquoi ce n'est pas fait
 * automatiquement ? »
 *
 * Ça l'était — sur UN chemin, et un seul. `todo\anonymiser-entrant.mjs` existe depuis le 28/08,
 * il est exact, et il a exactement UN appelant : `todo\ingerer-lot.mjs`. Il nettoie ce qui ENTRE
 * AU REGISTRE, et il le dit lui-même dans son en-tête : « il ne relit pas ce qui est DÉJÀ au
 * registre — il garde la porte, il ne rattrape pas » et « il ne voit que le TEXTE des champs
 * qu'on lui donne ».
 *
 * Le registre est donc propre. Ce qui ne l'est pas, mesuré le 01/09 sur le dépôt du pilot :
 *
 *   · le LOT LUI-MÊME reste sur le disque tel qu'il est arrivé — nom du client dans son nom de
 *     fichier ET dans son corps. L'anonymiseur en a extrait des champs propres ; il n'a jamais
 *     touché le fichier source. 229 fichiers suivis sous `input\00-retours\`, dont 150 archivés ;
 *   · l'INDEX de ces fichiers, `input\00-retours\README.md`, est régénéré par
 *     `scripts\readme-dossiers.mjs` À PARTIR DES NOMS DE FICHIERS. Un index dérivé de données
 *     sales est sale, et il l'était sans que personne n'ait rien écrit à la main ;
 *   · deux fichiers d'ÉTAT MACHINE sont réécrits par des hooks à chaque session, avec les
 *     chemins réels du parc : `.oracles\produits-au-demarrage.json` (par
 *     `oracles\hook-produits-intacts.mjs`) et `.claude\hooks-journal.jsonl` (champ
 *     `synthese_deposee`, par `oracles\hook-restitution.mjs`).
 *
 * Total au moment de la mesure : 200 constats de la porte de publication, sur 56 fichiers suivis.
 *
 * ============================================================================================
 * POURQUOI CE MODULE PLUTÔT QUE QUATRE CORRECTIFS
 * ============================================================================================
 *
 * On pouvait brancher l'anonymiseur sur chacun des quatre écrivains. Ç'aurait été exact, et
 * insuffisant : le cinquième écrivain, celui qu'on n'a pas encore écrit, repartirait avec des
 * noms réels — et personne ne le verrait avant la prochaine publication refusée. C'est la loi
 * transverse n° 3, mot pour mot : *l'oubli n'existe pas ; une surface implicite se traite
 * d'office, jamais par omission.*
 *
 * Le point de passage obligé n'est pas l'écriture : c'est GIT. Tout ce qui sera publié est,
 * avant, suivi. Ce module travaille donc sur `git ls-files` — il ne devine aucun chemin, il ne
 * connaît aucun écrivain, et un mécanisme futur qui écrirait un nom réel dans un fichier suivi
 * serait nettoyé sans qu'une ligne change ici.
 *
 * ============================================================================================
 * CE QU'IL FAIT, ET LES TROIS BORNES QU'IL SE POSE
 * ============================================================================================
 *
 *   1. le CONTENU des fichiers suivis lisibles en texte — via `anonymiser()`, donc les mêmes
 *      deux référentiels hors dépôt, jamais une liste embarquée ici (loi n° 4 : un contrôle qui
 *      embarquerait la liste des noms interdits PUBLIERAIT EXACTEMENT CE QU'IL PROTÈGE) ;
 *   2. le NOM des fichiers suivis — un `git mv` quand le nom porte un nom interdit. Un contenu
 *      propre dans un fichier au nom sale ne vaut rien : la porte lit les deux ;
 *   3. RIEN d'autre. Il ne touche pas ce que git ne suit pas — le lot brut déposé par un produit
 *      reste intact sur le disque tant que personne ne l'ajoute, et c'est voulu : l'artefact reçu
 *      est une donnée, il se conserve tel qu'il est arrivé. UNE porte, et elle se NOMME (02/09) :
 *      `--fichiers <chemin>…` nettoie une liste explicite, suivie ou non — c'est ainsi qu'un lot
 *      reçu avec un nom de client se nettoie AVANT son ingestion et son ajout au suivi, le produit
 *      gardant l'original. L'outil ne devine toujours rien.
 *   4. RÉ-EMPREINTE (02/09) : un sidecar `*.tf.jsonl` qu'il réécrit change d'empreinte, et la
 *      boîte d'entrée le lirait comme ÉDITÉ après ingestion (23 constats B2 le lendemain de la
 *      passe du 01/09, pour zéro édition). Il passe donc le contenu d'avant à
 *      `reempreinter-lot.mjs`, qui PROUVE puis consigne, ou refuse — jamais une empreinte sur parole.
 *
 * BORNES :
 *   · les fichiers BINAIRES sont sautés et COMPTÉS — un octet nul dans les 8 premiers ko suffit à
 *     les reconnaître. Réécrire un PNG par substitution de texte le corromprait ;
 *   · un référentiel manquant ARRÊTE tout, sans écrire une ligne. C'est la règle de
 *     `anonymiser()` et elle vaut ici davantage : anonymiser la moitié d'un dépôt donnerait
 *     l'impression qu'il est propre ;
 *   · il ne réécrit PAS l'histoire. Un nom déjà présent dans un commit antérieur y reste, et ce
 *     module ne prétend pas le contraire — c'est un geste distinct, humain, et il se décide.
 *
 *   node todo\anonymiser-suivis.mjs --essai   → ce qui serait changé, rien n'est écrit
 *   node todo\anonymiser-suivis.mjs           → écrit, et rend son compte (ré-empreintes comprises)
 *   node todo\anonymiser-suivis.mjs --fichiers <chemin>…   → une liste explicite, suivie ou non
 *   node todo\anonymiser-suivis.mjs --self-test
 *
 * Exit : 0 = rien à faire ou fait · 1 = référentiel manquant, ou écriture impossible.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync, renameSync } from "node:fs";
import { join, dirname, basename, relative, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { anonymiser } from "./anonymiser-entrant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

/** Un fichier est-il BINAIRE ? Un octet nul dans les 8 premiers ko suffit à le dire. */
export function estBinaire(octets) {
  const n = Math.min(octets.length, 8192);
  for (let i = 0; i < n; i++) if (octets[i] === 0) return true;
  return false;
}

/** Les fichiers suivis par git dans ce dépôt. */
function suivis(depot) {
  const r = spawnSync("git", ["-C", depot, "ls-files", "-z"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) return null;
  return r.stdout.split("\0").filter(Boolean);
}

/**
 * Le plan de nettoyage d'un dépôt : ce qu'il faudrait réécrire, renommer, et ce qui est sauté.
 * Fonction SÉPARÉE de l'écriture, et c'est ce qui la rend éprouvable : le banc lui donne des
 * fichiers et lit son plan, sans qu'aucun `git mv` ne parte.
 */
export function planifier(depot, fichiers, lire = (f) => readFileSync(join(depot, f))) {
  const contenus = [], renommages = [], binaires = [], illisibles = [];
  for (const f of fichiers) {
    let octets;
    try { octets = lire(f); } catch (e) { illisibles.push({ fichier: f, motif: e.code || e.message }); continue; }
    if (estBinaire(octets)) { binaires.push(f); continue; }
    const avant = octets.toString("utf8");
    const { texte, remplaces } = anonymiser(avant);
    // Le plan garde le contenu d'AVANT : c'est la preuve dont la ré-empreinte d'un sidecar a
    // besoin (reempreinter-lot.mjs), et l'écrivain qui change un contenu est le seul à l'avoir.
    if (texte !== avant) contenus.push({ fichier: f, remplaces, texte, avant });
    const nom = anonymiser(f);
    if (nom.texte !== f) renommages.push({ de: f, vers: nom.texte, remplaces: nom.remplaces });
  }
  return { contenus, renommages, binaires, illisibles };
}

function jouer(depot, plan) {
  const faits = { ecrits: 0, renommes: 0, echecs: [] };
  for (const c of plan.contenus) {
    try { writeFileSync(join(depot, c.fichier), c.texte, "utf8"); faits.ecrits++; }
    catch (e) { faits.echecs.push(`${c.fichier} : ${e.code || e.message}`); }
  }
  // Les renommages APRÈS les contenus : `git mv` déplace le fichier, et écrire ensuite à
  // l'ancien chemin recréerait un doublon non suivi portant le nom sale.
  for (const r of plan.renommages) {
    const mv = spawnSync("git", ["-C", depot, "mv", "--", r.de, r.vers], { encoding: "utf8" });
    if (mv.status === 0) { faits.renommes++; continue; }
    // Un fichier que git ne suit pas (mode `--fichiers`) se renomme sur le disque.
    if (/not under version control|pas sous contr/i.test(mv.stderr || "")) {
      try { renameSync(join(depot, r.de), join(depot, r.vers)); faits.renommes++; continue; } catch (e) { faits.echecs.push(`${r.de} -> ${r.vers} : ${e.code || e.message}`); continue; }
    }
    faits.echecs.push(`${r.de} -> ${r.vers} : ${(mv.stderr || "").trim()}`);
  }
  return faits;
}

/**
 * RÉ-EMPREINTE des sidecars réécrits (02/09/2026). Un sidecar `*.tf.jsonl` dont le contenu change
 * change d'empreinte, et la boîte d'entrée le lit alors comme ÉDITÉ après ingestion (B2) — 23
 * constats le lendemain de la passe du 01/09, pour zéro édition. Celui qui réécrit est le seul à
 * tenir la preuve (le contenu d'avant) : il la passe à `reempreinter-lot.mjs`, qui vérifie et
 * consigne, ou refuse. Un sidecar jamais ingéré est simplement rapporté tel quel.
 */
export function reempreinter(depot, plan, registre = join(depot, "todo", "TODO.jsonl")) {
  const resultats = [];
  if (!existsSync(registre)) return resultats;
  const versFinal = new Map(plan.renommages.map((r) => [r.de, r.vers]));
  for (const c of plan.contenus) {
    if (!c.fichier.endsWith(".tf.jsonl") || typeof c.avant !== "string") continue;
    const chemin = join(depot, versFinal.get(c.fichier) || c.fichier);
    const tmp = mkdtempSync(join(tmpdir(), "reemp-avant-"));
    const copie = join(tmp, basename(c.fichier));
    writeFileSync(copie, c.avant, "utf8");
    const r = spawnSync(process.execPath, [join(ICI, "reempreinter-lot.mjs"), chemin, "--avant", copie, "--registre", registre, "--depot", depot],
      { encoding: "utf8" });
    rmSync(tmp, { recursive: true, force: true });
    let verdict = "ILLISIBLE", message = (r.stdout || r.stderr || "").trim().slice(0, 300);
    try { const j = JSON.parse(r.stdout.slice(r.stdout.indexOf("{"))); verdict = j.verdict; message = j.message; } catch { /* sortie brute conservée */ }
    resultats.push({ fichier: versFinal.get(c.fichier) || c.fichier, verdict, message });
  }
  return resultats;
}

// ---- banc a double sens ---------------------------------------------------------------------
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "anon-suivis-"));
  const casse = [];
  writeFileSync(join(dir, "_noms-interdits.json"), JSON.stringify({
    noms: ["Zorglub"], identifiants: [], sigles: ["ZRG"],
    pseudonymes: { Zorglub: "Client-A", ZRG: "Sigle-A" },
  }), "utf8");
  writeFileSync(join(dir, "_produits-pseudonymes.json"), JSON.stringify({
    produits: { "CalculatriceZorglubSCC": "Produit-01" },
  }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(dir, "_produits-pseudonymes.json");

  const faux = {
    "note.md": Buffer.from("Lot remis par Zorglub, facture ZRG.\n", "utf8"),
    "propre.md": Buffer.from("Rien a voir ici.\n", "utf8"),
    "CalculatriceZorglubSCC - RETOURS - 20260901a.md": Buffer.from("Corps propre.\n", "utf8"),
    "logo.png": Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01, 0x02, 0x03]),
  };
  const plan = planifier(dir, Object.keys(faux), (f) => faux[f]);

  // 1) le CONTENU porteur est nettoye, et le fichier propre n'est pas touche
  const note = plan.contenus.find((c) => c.fichier === "note.md");
  if (!note || /Zorglub|\bZRG\b/.test(note.texte)) casse.push("le contenu porteur n'est pas nettoye");
  if (plan.contenus.some((c) => c.fichier === "propre.md")) casse.push("un fichier PROPRE est reecrit pour rien — un outil qui touche ce qui va bien fait du bruit dans l'historique");

  // 2) le NOM porteur est renomme. Un contenu propre dans un fichier au nom sale ne vaut rien :
  //    la porte de publication lit les deux, et c'est le cas d'un lot deja nettoye a l'ingestion.
  const ren = plan.renommages.find((r) => r.de.startsWith("CalculatriceZorglubSCC"));
  if (!ren) casse.push("un fichier dont le NOM porte un nom interdit n'est pas renomme");
  else if (/Zorglub/.test(ren.vers)) casse.push("le nom de destination porte encore le nom interdit : " + ren.vers);

  // 3) le BINAIRE est saute, jamais reecrit — une substitution de texte corromprait un PNG
  if (!plan.binaires.includes("logo.png")) casse.push("un fichier binaire n'est pas saute — le reecrire le corromprait");
  if (plan.contenus.some((c) => c.fichier === "logo.png")) casse.push("un fichier binaire entre dans le plan d'ecriture");

  // 3 bis) un sidecar réécrit porte son contenu d'AVANT dans le plan — c'est la preuve que la
  //        ré-empreinte exige (02/09) ; sans elle, la boîte d'entrée lirait la passe comme une édition
  const side = plan.contenus.find((c) => c.fichier === "note.md");
  if (!side || side.avant !== faux["note.md"].toString("utf8")) casse.push("le plan ne garde pas le contenu d'avant d'un fichier réécrit — la ré-empreinte n'a plus de preuve");

  // 4) un REFERENTIEL MANQUANT arrete tout, sans ecrire une ligne
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_absent.json");
  let leve = false;
  try { planifier(dir, ["note.md"], (f) => faux[f]); } catch { leve = true; }
  if (!leve) casse.push("un referentiel manquant ne fait pas lever : anonymiser a moitie donnerait l'impression que le depot est propre");

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test anonymiser-suivis : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test anonymiser-suivis : 7/7 PASS (contenu porteur nettoyé ; fichier propre NON réécrit ; contenu d'avant conservé ; "
      + "nom de fichier porteur renommé ; destination du renommage propre ; binaire sauté et hors du "
      + "plan d'écriture ; référentiel manquant = arrêt sans écriture)");
  return casse.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const ESSAI = args.includes("--essai");
  const i = args.indexOf("--depot");
  const depot = i >= 0 ? args[i + 1] : join(ICI, "..");
  // `--fichiers <chemin>…` : une liste EXPLICITE, suivie ou non par git. C'est la seule porte
  // vers un fichier non suivi — un lot brut reçu avec un nom de client, qu'on nettoie AVANT de
  // l'ingérer et de l'ajouter au suivi (02/09/2026). L'outil ne devine toujours rien : on le nomme.
  const iF = args.indexOf("--fichiers");
  const explicites = iF >= 0 ? args.slice(iF + 1).filter((a) => !a.startsWith("--")) : null;
  const fichiers = explicites
    ? explicites.map((f) => (isAbsolute(f) ? relative(depot, f) : f).replaceAll("\\", "/"))
    : suivis(depot);
  if (!fichiers) { console.error(`anonymiser-suivis : ${depot} n'est pas un dépôt git lisible.`); process.exit(1); }

  let plan;
  try { plan = planifier(depot, fichiers); }
  catch (e) { console.error(`anonymiser-suivis : ${e.message}`); process.exit(1); }

  const rapport = {
    outil: "anonymiser-suivis",
    depot,
    suivis: fichiers.length,
    a_reecrire: plan.contenus.length,
    a_renommer: plan.renommages.length,
    binaires_sautes: plan.binaires.length,
    illisibles: plan.illisibles,
    noms_rencontres: [...new Set([...plan.contenus, ...plan.renommages].flatMap((x) => x.remplaces))].sort(),
    fichiers: [
      ...plan.contenus.map((c) => ({ quoi: "contenu", fichier: c.fichier, remplaces: c.remplaces })),
      ...plan.renommages.map((r) => ({ quoi: "nom", de: r.de, vers: r.vers })),
    ],
    non_juge: [
      "l'HISTOIRE : un nom déjà présent dans un commit antérieur y reste — le retirer est un geste "
      + "distinct, humain, et il se décide",
      "ce que git ne suit PAS : le lot brut déposé par un produit reste intact, et c'est voulu — "
      + "l'artefact reçu est une donnée, il se conserve tel qu'il est arrivé",
      "les fichiers binaires : sautés et comptés, jamais réécrits",
      "un nom qui ne figure dans aucun des deux référentiels passe — la table des produits s'étend "
      + "à la découverte, celle des clients est alimentée à la main",
    ],
  };
  if (ESSAI) {
    console.log(JSON.stringify({ ...rapport, message: "ESSAI — rien n'a été écrit" }, null, 1));
    process.exit(0);
  }
  const faits = jouer(depot, plan);
  const reempreintes = reempreinter(depot, plan);
  console.log(JSON.stringify({ ...rapport, ...faits, reempreintes }, null, 1));
  process.exit(faits.echecs.length || reempreintes.some((r) => r.verdict === "ECHEC_JOURNAL") ? 1 : 0);
}
