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
 * Exit : 0 = rien à faire ou fait · 1 = référentiel manquant, ou écriture impossible, ou renommage NON FAIT.
 *
 * LE COMPTE RENDU DIT LE FAIT, PAS LE PLAN (TF-1842, 18/10/2026). `a_renommer` est le compte du PLAN ;
 * `renommes` est le fait, `non_faits` liste chaque renommage qui n'a pas eu lieu avec sa cause, et
 * `verdict_renommages` le dit en une ligne (« FAIT » seulement si tous ont eu lieu, sinon « NON FAIT »).
 * `git mv` ne crée pas le dossier d'arrivée : l'essai l'annonce (`renommages_non_faisables`) et le jeu
 * le constate, sans rien créer — le dossier se crée à dessein, puis la passe se rejoue.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync, mkdirSync, rmSync, renameSync } from "node:fs";
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
// TF-0927 — LES EXTENSIONS OÙ UN IDENTIFIANT COUPÉ CASSE QUELQUE CHOSE, et la liste se DÉCLARE.
// Elle est POSITIVE, donc un fichier de code portant une extension absente d'ici n'est pas gardé :
// limite assumée et écrite plutôt que devinée depuis le contenu. Les formats structurés y sont —
// une clé JSON ou YAML coupée casse un lecteur aussi sûrement qu'un identifiant Python.
const EST_CODE = /\.(m?[jt]sx?|cjs|py|rb|php|java|go|rs|cs|c|h|cc|cpp|sh|bash|ps1|sql|css|scss|html?|ya?ml|json|toml|ini|cfg)$/i;

export function planifier(depot, fichiers, lire = (f) => readFileSync(join(depot, f))) {
  const contenus = [], renommages = [], binaires = [], illisibles = [], refuses = [];
  for (const f of fichiers) {
    let octets;
    try { octets = lire(f); } catch (e) { illisibles.push({ fichier: f, motif: e.code || e.message }); continue; }
    if (estBinaire(octets)) { binaires.push(f); continue; }
    const avant = octets.toString("utf8");
    const { texte, remplaces, refuses: refusesDuFichier } = anonymiser(avant, { code: EST_CODE.test(f) });
    // TF-0927 : un nom LAISSÉ EN PLACE parce qu'il vit dans un identifiant de code n'est pas un
    // détail d'implémentation — c'est un fichier qui restera porteur, et que la porte de
    // publication refusera. Il se remonte au rapport, nommé, plutôt que d'être avalé ici.
    for (const x of refusesDuFichier || []) refuses.push({ fichier: f, ...x });
    // Le plan garde le contenu d'AVANT : c'est la preuve dont la ré-empreinte d'un sidecar a
    // besoin (reempreinter-lot.mjs), et l'écrivain qui change un contenu est le seul à l'avoir.
    if (texte !== avant) contenus.push({ fichier: f, remplaces, texte, avant });
    const nom = anonymiser(f);
    if (nom.texte !== f) renommages.push({ de: f, vers: nom.texte, remplaces: nom.remplaces });
  }
  return { contenus, renommages, binaires, illisibles, refuses };
}

// TF-1842 (18/10/2026) — UN RENOMMAGE QUI N'A PAS EU LIEU SE DIT « NON FAIT », AVEC SA CAUSE.
// Le fait, mesuré le 17/10 : le dossier d'arrivée (`…/Produit-72/`) n'existait pas, `git mv` a échoué
// sur les 9 fichiers, et le compte rendu portait « a_renommer 9 » — un compte du PLAN, lu comme un
// succès — puis des ré-empreintes ILLISIBLES, le chemin d'arrivée n'existant pas. `git mv` ne crée pas
// le dossier d'arrivée : l'essai et le jeu le constatent AVANT et le disent, sans rien créer.
export function nonFaisables(depot, plan) {
  const nf = [];
  for (const r of plan.renommages) {
    const dossier = dirname(r.vers);
    if (dossier !== "." && !existsSync(join(depot, dossier)))
      nf.push({ de: r.de, vers: r.vers, cause: `dossier d'arrivée absent : ${dossier}` });
  }
  return nf;
}

/** Le verdict, en une ligne, des renommages d'une passe : FAIT seulement si TOUS ont eu lieu. */
function verdictRenommages(prevus, renommes, nonFaits) {
  if (!prevus) return "SANS OBJET : aucun renommage prévu";
  if (!nonFaits.length) return `FAIT : ${renommes}/${prevus} renommage(s)`;
  const causes = [...new Set(nonFaits.map((x) => x.cause))].join(" ; ");
  return `NON FAIT : ${nonFaits.length} renommage(s) sur ${prevus} n'ont pas eu lieu (${renommes} fait(s)) — cause : ${causes}`;
}

/** Où EST le fichier après la passe : à l'arrivée s'il y a été renommé, à l'origine sinon. */
export function ouEstLeFichier(depot, de, vers) {
  return !existsSync(join(depot, de)) && existsSync(join(depot, vers)) ? vers : de;
}

export function jouer(depot, plan) {
  const faits = { ecrits: 0, renommes: 0, echecs: [], non_faits: [] };
  for (const c of plan.contenus) {
    try { writeFileSync(join(depot, c.fichier), c.texte, "utf8"); faits.ecrits++; }
    catch (e) { faits.echecs.push(`${c.fichier} : ${e.code || e.message}`); }
  }
  // Les renommages APRÈS les contenus : `git mv` déplace le fichier, et écrire ensuite à
  // l'ancien chemin recréerait un doublon non suivi portant le nom sale.
  const impossibles = new Map(nonFaisables(depot, plan).map((x) => [x.de, x]));
  const nonFait = (r, cause) => { faits.non_faits.push({ de: r.de, vers: r.vers, cause }); faits.echecs.push(`${r.de} -> ${r.vers} : ${cause}`); };
  for (const r of plan.renommages) {
    if (impossibles.has(r.de)) { nonFait(r, impossibles.get(r.de).cause); continue; }
    const mv = spawnSync("git", ["-C", depot, "mv", "--", r.de, r.vers], { encoding: "utf8" });
    if (mv.status === 0) { faits.renommes++; continue; }
    // Un fichier que git ne suit pas (mode `--fichiers`) se renomme sur le disque.
    if (/not under version control|pas sous contr/i.test(mv.stderr || "")) {
      try { renameSync(join(depot, r.de), join(depot, r.vers)); faits.renommes++; continue; } catch (e) { nonFait(r, e.code || e.message); continue; }
    }
    nonFait(r, (mv.stderr || "").trim() || `git mv a rendu le code ${mv.status}`);
  }
  faits.verdict_renommages = verdictRenommages(plan.renommages.length, faits.renommes, faits.non_faits);
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
  // TF-1842 : le chemin d'arrivée n'est retenu que si le renommage a EU LIEU — sinon la ré-empreinte
  // visait un chemin inexistant et sortait ILLISIBLE, au lieu de juger le fichier là où il est.
  const versFinal = new Map(plan.renommages.map((r) => [r.de, ouEstLeFichier(depot, r.de, r.vers)]));
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
    produits: { "CalculatriceZorglubZAP": "Produit-01" },
  }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(dir, "_produits-pseudonymes.json");

  const faux = {
    "note.md": Buffer.from("Lot remis par Zorglub, facture ZRG.\n", "utf8"),
    "propre.md": Buffer.from("Rien a voir ici.\n", "utf8"),
    "CalculatriceZorglubZAP - RETOURS - 20260901a.md": Buffer.from("Corps propre.\n", "utf8"),
    "logo.png": Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01, 0x02, 0x03]),
  };
  const plan = planifier(dir, Object.keys(faux), (f) => faux[f]);

  // 1) le CONTENU porteur est nettoye, et le fichier propre n'est pas touche
  const note = plan.contenus.find((c) => c.fichier === "note.md");
  if (!note || /Zorglub|\bZRG\b/.test(note.texte)) casse.push("le contenu porteur n'est pas nettoye");
  if (plan.contenus.some((c) => c.fichier === "propre.md")) casse.push("un fichier PROPRE est reecrit pour rien — un outil qui touche ce qui va bien fait du bruit dans l'historique");

  // 2) le NOM porteur est renomme. Un contenu propre dans un fichier au nom sale ne vaut rien :
  //    la porte de publication lit les deux, et c'est le cas d'un lot deja nettoye a l'ingestion.
  const ren = plan.renommages.find((r) => r.de.startsWith("CalculatriceZorglubZAP"));
  if (!ren) casse.push("un fichier dont le NOM porte un nom interdit n'est pas renomme");
  else if (/Zorglub/.test(ren.vers)) casse.push("le nom de destination porte encore le nom interdit : " + ren.vers);

  // 3) le BINAIRE est saute, jamais reecrit — une substitution de texte corromprait un PNG
  if (!plan.binaires.includes("logo.png")) casse.push("un fichier binaire n'est pas saute — le reecrire le corromprait");
  if (plan.contenus.some((c) => c.fichier === "logo.png")) casse.push("un fichier binaire entre dans le plan d'ecriture");

  // 3 bis) un sidecar réécrit porte son contenu d'AVANT dans le plan — c'est la preuve que la
  //        ré-empreinte exige (02/09) ; sans elle, la boîte d'entrée lirait la passe comme une édition
  const side = plan.contenus.find((c) => c.fichier === "note.md");
  if (!side || side.avant !== faux["note.md"].toString("utf8")) casse.push("le plan ne garde pas le contenu d'avant d'un fichier réécrit — la ré-empreinte n'a plus de preuve");

  // 3 ter) TF-0913 (08/09) — DEUX CLES QUI SE RECOUVRENT : LA PLUS LONGUE PASSE D'ABORD.
  //        Le fait, payé deux fois le 08/09 : une table portant « X » et « X_Reporting » a nommé
  //        quinze fichiers sous le pseudonyme du MAUVAIS produit, la clé courte ayant été
  //        rencontrée la première. Le sens rouge est prouvé ici sur le plan lui-même : si le tri
  //        disparaissait, le nom de destination porterait le pseudonyme de la clé courte.
  writeFileSync(join(dir, "_produits-pseudonymes.json"), JSON.stringify({
    produits: { "ZorglubZAP": "Produit-07", "ZorglubZAPetal": "Produit-42" },
  }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(dir, "_produits-pseudonymes.json");
  const recouvrement = { "ZorglubZAPetal - RETOURS - 20260908a.md": Buffer.from("lot du produit ZorglubZAPetal\n", "utf8") };
  const planR = planifier(dir, Object.keys(recouvrement), (f) => recouvrement[f]);
  const renR = planR.renommages.find((r) => r.de.startsWith("ZorglubZAPetal"));
  if (!renR || !renR.vers.startsWith("Produit-42")) casse.push("la cle la plus LONGUE ne passe pas en premier : le nom de destination est " + (renR ? renR.vers : "absent"));
  const contR = planR.contenus.find((c) => c.fichier.startsWith("ZorglubZAPetal"));
  if (!contR || !/Produit-42/.test(contR.texte) || /Produit-07etal/.test(contR.texte)) casse.push("le CONTENU est coupé par la clé courte : " + (contR ? contR.texte.trim() : "absent"));

  // 3 quater) TF-0927 (08/09) — UN NOM DANS UN IDENTIFIANT DE CODE EST REFUSÉ, PAS SUBSTITUÉ.
  //           Le 20/08, une substitution au milieu d'un identifiant Python y a glissé le tiret du
  //           pseudonyme ; le module est devenu non compilable et la suite de tests n'a plus rien
  //           collecté pendant dix-huit jours. Sens vert : l'occurrence en prose du même fichier
  //           est nettoyée. Sens rouge : l'identifiant sort intact ET le refus est remonté, nommé.
  const code = { "outil.py": Buffer.from(["def calc_ZorglubZAP_total():", "    pass  # sert a ZorglubZAP", ""].join(String.fromCharCode(10)), "utf8") };
  const planC = planifier(dir, Object.keys(code), (f) => code[f]);
  const cont = planC.contenus.find((c) => c.fichier === "outil.py");
  if (!cont || !cont.texte.includes("calc_ZorglubZAP_total"))
    casse.push("l'identifiant de code est coupé par la substitution : " + (cont ? cont.texte.trim() : "fichier absent du plan"));
  if (!cont || !/sert a Produit-07/.test(cont.texte))
    casse.push("l'occurrence en PROSE du même fichier n'est pas nettoyée : " + (cont ? cont.texte.trim() : "absent"));
  if (!planC.refuses.length || !planC.refuses.every((x) => x.fichier === "outil.py" && /identifiant/.test(x.motif)))
    casse.push("le refus n'est pas remonté au rapport avec son fichier et son motif : " + JSON.stringify(planC.refuses));

  // 3 quinquies) TF-1842 (18/10/2026) — UN RENOMMAGE QUI N'A PAS EU LIEU SE DIT « NON FAIT », AVEC SA CAUSE.
  //              Le fait, mesuré le 17/10 : le dossier d'arrivée (`…/Produit-72/`) n'existait pas, `git mv` a
  //              échoué sur les 9 fichiers, et le compte rendu portait « a_renommer 9 » — lu comme un succès —
  //              puis des ré-empreintes ILLISIBLES, le chemin d'arrivée n'existant pas. Sens rouge : dossier
  //              d'arrivée absent. Sens vert : dossier d'arrivée présent, le renommage a lieu et est dit FAIT.
  const git = (d, ...a) => spawnSync("git", ["-C", d, ...a], { encoding: "utf8" });
  const depotGit = (nom, fichiers) => {
    const d = join(dir, nom);
    mkdirSync(d, { recursive: true });
    git(d, "init", "-q");
    git(d, "config", "user.email", "banc@exemple.invalide"); git(d, "config", "user.name", "banc");
    git(d, "config", "core.autocrlf", "false");
    for (const [f, texte] of Object.entries(fichiers)) {
      mkdirSync(dirname(join(d, f)), { recursive: true });
      writeFileSync(join(d, f), texte, "utf8");
    }
    git(d, "add", "-A"); git(d, "commit", "-q", "-m", "banc");
    return d;
  };
  const suivisDe = (d) => git(d, "ls-files", "-z").stdout.split("\0").filter(Boolean);

  // rouge : le dossier d'arrivée (Produit-07) n'existe pas
  const sansDossier = depotGit("sans-dossier", { "lot/ZorglubZAP/a.md": "propre\n", "lot/ZorglubZAP/b.md": "propre aussi\n" });
  const planS = planifier(sansDossier, suivisDe(sansDossier));
  const essaiS = nonFaisables(sansDossier, planS);
  if (essaiS.length !== 2 || !essaiS.every((x) => /dossier d'arrivée absent/.test(x.cause || "")))
    casse.push("l'ESSAI n'annonce pas « non faisable » (avec la cause) un renommage dont le dossier d'arrivée manque : " + JSON.stringify(essaiS));
  const faitsS = jouer(sansDossier, planS);
  if (faitsS.renommes !== 0) casse.push("des renommages sont comptés faits alors que le dossier d'arrivée n'existe pas : " + faitsS.renommes);
  if (!Array.isArray(faitsS.non_faits) || faitsS.non_faits.length !== 2 || !faitsS.non_faits.every((x) => /dossier d'arrivée absent/.test(x.cause || "")))
    casse.push("le compte rendu ne porte pas les renommages NON FAITS avec leur cause : " + JSON.stringify(faitsS.non_faits));
  if (!/^NON FAIT/.test(faitsS.verdict_renommages || ""))
    casse.push("le verdict des renommages ne dit pas « NON FAIT » : « " + faitsS.verdict_renommages + " »");
  if (ouEstLeFichier(sansDossier, planS.renommages[0].de, planS.renommages[0].vers) !== planS.renommages[0].de)
    casse.push("le chemin à ré-empreinter est celui d'ARRIVÉE alors que le fichier n'a pas bougé : la ré-empreinte sortirait ILLISIBLE");
  if (!existsSync(join(sansDossier, "lot", "ZorglubZAP", "a.md"))) casse.push("le fichier a disparu de son chemin d'origine");

  // vert : le dossier d'arrivée existe, le renommage a lieu et le compte rendu le dit
  const avecDossier = depotGit("avec-dossier", { "lot/ZorglubZAP/a.md": "propre\n", "lot/Produit-07/.garde": "x\n" });
  const planA = planifier(avecDossier, suivisDe(avecDossier));
  if (nonFaisables(avecDossier, planA).length) casse.push("l'essai déclare non faisable un renommage dont le dossier d'arrivée existe");
  const faitsA = jouer(avecDossier, planA);
  if (faitsA.renommes !== 1 || (faitsA.non_faits || []).length || faitsA.echecs.length)
    casse.push("le renommage vers un dossier existant n'est pas fait ou est déclaré en échec : " + JSON.stringify(faitsA));
  if (!/^FAIT/.test(faitsA.verdict_renommages || "")) casse.push("le verdict d'un renommage réussi ne dit pas « FAIT » : « " + faitsA.verdict_renommages + " »");
  if (!existsSync(join(avecDossier, "lot", "Produit-07", "a.md"))) casse.push("le fichier n'est pas arrivé à destination");
  if (ouEstLeFichier(avecDossier, planA.renommages[0].de, planA.renommages[0].vers) !== planA.renommages[0].vers)
    casse.push("le chemin à ré-empreinter n'est pas celui d'ARRIVÉE après un renommage réussi");

  // 4) un REFERENTIEL MANQUANT arrete tout, sans ecrire une ligne
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_absent.json");
  let leve = false;
  try { planifier(dir, ["note.md"], (f) => faux[f]); } catch { leve = true; }
  if (!leve) casse.push("un referentiel manquant ne fait pas lever : anonymiser a moitie donnerait l'impression que le depot est propre");

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test anonymiser-suivis : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test anonymiser-suivis : 12/12 PASS (contenu porteur nettoyé ; fichier propre NON réécrit ; contenu d'avant conservé ; "
      + "nom de fichier porteur renommé ; destination du renommage propre ; binaire sauté et hors du "
      + "plan d'écriture ; cas rouge : référentiel manquant = arrêt sans écriture ; clé la plus longue appariée avant la clé courte qui la contient, nom ET contenu, TF-0913 ; "
      + "cas rouge : nom dans un identifiant de code REFUSÉ et remonté, prose du même fichier nettoyée, TF-0927 ; "
      + "cas rouge : dossier d'arrivée absent = renommage dit NON FAIT avec sa cause, à l'essai comme au jeu, ré-empreinte visant le fichier là où il est ; "
      + "cas vert : dossier d'arrivée présent = renommage fait et dit FAIT, TF-1842)");
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
    a_renommer: plan.renommages.length, // le PLAN, pas le fait : voir `renommes`, `non_faits`, `verdict_renommages` (TF-1842)
    binaires_sautes: plan.binaires.length,
    illisibles: plan.illisibles,
    refuses: plan.refuses,
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
    // TF-1842 : l'essai ne promet pas ce que le jeu ne tiendrait pas — un renommage dont le dossier
    // d'arrivée manque est annoncé « non faisable », avec sa cause.
    const non_faisables = nonFaisables(depot, plan);
    const causes = [...new Set(non_faisables.map((x) => x.cause))].join(" ; ");
    console.log(JSON.stringify({
      ...rapport,
      renommages_non_faisables: non_faisables,
      verdict_renommages: non_faisables.length
        ? `NON FAIT À PRÉVOIR : ${non_faisables.length} renommage(s) sur ${plan.renommages.length} n'auraient pas lieu — cause : ${causes}`
        : plan.renommages.length ? `${plan.renommages.length} renommage(s) possible(s)` : "SANS OBJET : aucun renommage prévu",
      message: "ESSAI — rien n'a été écrit",
    }, null, 1));
    process.exit(0);
  }
  const faits = jouer(depot, plan);
  const reempreintes = reempreinter(depot, plan);
  console.log(JSON.stringify({ ...rapport, ...faits, reempreintes }, null, 1));
  process.exit(faits.echecs.length || reempreintes.some((r) => r.verdict === "ECHEC_JOURNAL") ? 1 : 0);
}
