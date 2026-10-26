#!/usr/bin/env node
/**
 * hooks-factory.test.mjs — recette des NIVEAUX D'INTERVENTION vus DEPUIS UN PRODUIT (TF-1418,
 * étape 3, décision humaine D-68 (a) du 13/10/2026).
 *
 * Le lanceur `forge/hooks/factory.mjs` ne porte aucune règle : il délègue au hook du pilot, le
 * dossier du produit pour cwd. Cette recette le prouve sur un produit jetable, monté comme un
 * produit réel : sa copie du lanceur, son `forge/NIVEAUX.md` hérité, et le pilot résolu par la
 * voie du lanceur lui-même (FORGE_ROOT/digit-ai-factory, ici une copie des juges de CE dépôt, pour
 * que la recette juge le code de la branche et non celui d'un autre clone).
 *
 *   1. VERT — une réponse Simple courte, sans outil : le hook de fin de tour laisse passer.
 *   2. ROUGE — la même réponse dans un tour qui a écrit un fichier du produit : jugée complète.
 *   3. VERT — une réponse Moyen sans effet : laisse passer à sa forme.
 *   4. ROUGE — la même réponse dans un tour qui a commité : escalade, jugée Complexe.
 *   5. Pré-vol par le lanceur, dans les deux sens : réponse courte exit 0, 200 mots exit 1.
 *   6. Lexique par le lanceur : « vite : » chez un produit qui porte `forge/NIVEAUX.md` injecte la
 *      ligne de niveau qui cite CE chemin ; chez un produit qui ne le porte pas, rien.
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
const base = mkdtempSync(join(tmpdir(), "heritage-niveaux-"));
let pass = 0;
const echecs = [];
const check = (nom, ok, detail = "") => { if (ok) pass++; else echecs.push(`${nom}${detail ? ` — ${detail}` : ""}`); };

// Un produit jetable : lanceur copié tel que l'héritage le pose, texte des niveaux s'il le faut.
function produit(nom, avecNiveaux) {
  const p = join(base, nom);
  mkdirSync(join(p, "forge", "hooks"), { recursive: true });
  copyFileSync(join(ICI, "hooks-factory.mjs"), join(p, "forge", "hooks", "factory.mjs"));
  if (avecNiveaux) copyFileSync(join(PILOT, "references", "NIVEAUX.md"), join(p, "forge", "NIVEAUX.md"));
  return p;
}

const SIMPLE = `Niveau : Simple

Non, le rappel vient seulement à l'ouverture d'une session.
- Après 7 jours sans revue, elle affiche « revue DUE ».
- Sans session ouverte, rien ne se passe.

Source : \`forge/hooks/factory.mjs:12\`.`;

const MOYEN = `Niveau : Moyen

**La réponse.** Oui pour l'essentiel. Sur 25 travaux relevés au carnet, 16 sont appliqués, et aucun ne dort sur une branche.

**Preuves.**
- \`forge/travaux/TRAVAUX-PILOT.md\` porte 25 travaux, dont 16 appliqués.
- \`git branch -a --no-merged main\` ne rend rien.

**Non vérifié.** Le résultat des oracles sur les travaux appliqués.

**Décision attendue.** Aucune.`;

const humain = { type: "user", timestamp: new Date(Date.now() - 60_000).toISOString(),
  message: { role: "user", content: "est-ce que le rappel de revue part sans session ouverte ?" } };
const outil = (name, input) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name, input }] } });
const resultat = { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } };
const texte = (t) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: t }] } });

try {
  // Le pilot résolu par le lanceur : FORGE_ROOT/digit-ai-factory, une copie des hooks et des juges
  // de CE dépôt. Pas de jonction : le hook ne joue son point d'entrée que si son chemin d'appel est
  // son chemin réel, et une jonction le rendrait muet (mesuré le 13/10, sortie vide, exit 0).
  const racine = join(base, "racine");
  const copie = join(racine, "digit-ai-factory");
  for (const d of ["oracles", "gabarits"]) {
    mkdirSync(join(copie, d), { recursive: true });
    for (const f of readdirSync(join(PILOT, d), { withFileTypes: true }))
      if (f.isFile() && /\.(?:mjs|json)$/.test(f.name)) copyFileSync(join(PILOT, d, f.name), join(copie, d, f.name));
  }
  copyFileSync(join(PILOT, "bootstrap.mjs"), join(copie, "bootstrap.mjs"));
  // TF-1528 : le hook des droits accordés rejoue `scripts/verifier-droits-accordes.mjs` et sa table datée.
  for (const f of ["scripts/verifier-droits-accordes.mjs", "references/PERMISSIONS-GRAPH.json", "scripts/lib-empreinte.mjs"]) {
    mkdirSync(join(copie, dirname(f)), { recursive: true });
    copyFileSync(join(PILOT, f), join(copie, f));
  }
  const env = { ...process.env, FORGE_ROOT: racine };
  const P = produit("produit-niveaux", true);
  const lanceur = join(P, "forge", "hooks", "factory.mjs");

  const finDeTour = (nom, outils, final) => {
    const t = join(base, nom + ".jsonl");
    writeFileSync(t, [humain, ...outils.flatMap((o) => [o, resultat]), texte(final)].map((e) => JSON.stringify(e)).join("\n"), "utf8");
    const r = spawnSync(process.execPath, [lanceur, "restitution"], { encoding: "utf8", cwd: P, env,
      input: JSON.stringify({ session_id: "test-heritage-niveaux", transcript_path: t, stop_hook_active: false, cwd: P }) });
    if (/pilot introuvable/.test(r.stderr || "")) throw new Error(`lanceur sans pilot : ${r.stderr}`);
    try { return JSON.parse(r.stdout || "null"); } catch { return { brut: r.stdout }; }
  };

  // 1 et 2 — Simple : le même texte, sans puis avec un effet.
  const s = finDeTour("simple", [outil("Read", { file_path: join(P, "forge", "NIVEAUX.md") })], SIMPLE);
  check("1 vert : réponse Simple courte, lecture seule → le hook produit laisse passer", s === null, JSON.stringify(s)?.slice(0, 200));
  const sEffet = finDeTour("simple-effet", [outil("Write", { file_path: join(P, "app.py") })], SIMPLE);
  check("2 rouge : même réponse dans un tour qui a écrit un fichier du produit → restitution complète exigée",
    sEffet?.decision === "block" && /R-44/.test(sEffet.reason), JSON.stringify(sEffet)?.slice(0, 200));

  // 3 et 4 — Moyen : le même texte, sans puis avec un commit.
  const lectures = Array.from({ length: 6 }, (_, i) => outil("Bash", { command: `grep -n motif${i} forge/ledger.jsonl` }));
  const m = finDeTour("moyen", lectures, MOYEN);
  check("3 vert : réponse Moyen sans effet → le hook produit laisse passer à sa forme", m === null, JSON.stringify(m)?.slice(0, 200));
  const mEffet = finDeTour("moyen-effet", [...lectures, outil("Bash", { command: "git commit -m correctif" })], MOYEN);
  check("4 rouge : même réponse dans un tour qui a commité → jugée Complexe (escalade par les effets)",
    mEffet?.decision === "block" && /jugé Complexe/.test(mEffet.reason), JSON.stringify(mEffet)?.slice(0, 200));

  // 5 — Pré-vol par le lanceur, comme le prescrit forge/NIVEAUX.md chez un produit.
  const pv = (t) => spawnSync(process.execPath, [lanceur, "restitution", "--pre-vol"], { encoding: "utf8", cwd: P, env, input: t });
  const pvOk = pv(SIMPLE), pvKo = pv(SIMPLE + "\n\n" + "mot ".repeat(200));
  check("5 pré-vol par le lanceur : réponse Simple courte → exit 0", pvOk.status === 0 && /rendable_sans_restitution":true/.test(pvOk.stdout), pvOk.stdout + pvOk.stderr);
  check("5 bis pré-vol par le lanceur : 200 mots de plus → exit 1", pvKo.status === 1, pvKo.stdout + pvKo.stderr);

  // 6 — Lexique par le lanceur : la ligne de niveau suit le texte hérité.
  const lex = (dossier) => spawnSync(process.execPath, [join(dossier, "forge", "hooks", "factory.mjs"), "lexique"], { encoding: "utf8", cwd: dossier, env,
    input: JSON.stringify({ prompt: "vite : où est la liste des éléments ?", cwd: dossier }) });
  const lOui = lex(P), lNon = lex(produit("produit-sans-niveaux", false));
  check("6 lexique : « vite : » chez un produit portant forge/NIVEAUX.md → ligne Simple citant forge\\NIVEAUX.md",
    lOui.status === 0 && /\[NIVEAU — hook-lexique\][^\n]*Simple[^\n]*forge\\NIVEAUX\.md/.test(lOui.stdout), lOui.stdout + lOui.stderr);
  check("6 bis lexique : même message chez un produit sans forge/NIVEAUX.md → rien injecté", lNon.status === 0 && lNon.stdout.trim() === "", lNon.stdout);

  // 7 — TF-1528, droits accordés par le lanceur : un script d'octroi fautif écrit chez le produit est signalé
  // à l'écriture (avertissement, exit 0) ; un script ordinaire reste muet.
  const droits = (nom, lignes) => {
    const f = join(P, nom);
    writeFileSync(f, lignes.join("\n") + "\n", "utf8");
    return spawnSync(process.execPath, [lanceur, "droits-accordes"], { encoding: "utf8", cwd: P, env,
      input: JSON.stringify({ tool_name: "Write", tool_input: { file_path: f } }) });
  };
  const dFaute = droits("octroi.sh", ["az ad app permission add --id 00000003-0000-0000-c000-000000000000 --api-permissions 18a4783c-866b-4cc7-a460-3d0e455740fd=Role 2>/dev/null || true", "echo consentie"]);
  const dOrdinaire = droits("build.sh", ["npm ci", "echo termine"]);
  check("7 droits accordés : un script d'octroi fautif écrit chez le produit est signalé (DA-1, DA-2), sans bloquer",
    dFaute.status === 0 && /DA-1/.test(dFaute.stdout) && /DA-2/.test(dFaute.stdout), dFaute.stdout + dFaute.stderr);
  check("7 bis droits accordés : un script ordinaire reste muet", dOrdinaire.status === 0 && dOrdinaire.stdout.trim() === "", dOrdinaire.stdout + dOrdinaire.stderr);

  // 8 — TF-1716, identité sortante par le lanceur : l'adresse de l'utilisateur dans le User-Agent d'un
  // appel à une API tierce est refusée (exit 2, R-62) ; le même appel avec un en-tête neutre passe.
  const envId = { ...env, FORGE_IDENTITES: "camille.essai@poste-fictif.fr", FORGE_IDENTITES_SANS_GIT: "1" };
  delete envId.FORGE_IDENTITE_GO;
  const sortie = (ua) => spawnSync(process.execPath, [lanceur, "identite-sortante"], { encoding: "utf8", cwd: P, env: envId,
    input: JSON.stringify({ tool_name: "Bash", cwd: P, tool_input: { command: `curl -H "User-Agent: ${ua}" "https://api.exemple-tiers.fr/recherche?q=x"` } }) });
  const iFaute = sortie("fiche (camille.essai@poste-fictif.fr)"), iNeutre = sortie("digit-ai-factory");
  check("8 identité sortante : l'adresse de l'utilisateur dans un User-Agent vers une API tierce est refusée par le lanceur (R-62)",
    iFaute.status === 2 && /R-62/.test(iFaute.stderr), iFaute.stdout + iFaute.stderr);
  check("8 bis identité sortante : le même appel avec un en-tête neutre passe", iNeutre.status === 0, iNeutre.stdout + iNeutre.stderr);

  // 9 — TF-1765, préjugement par le lanceur avec une entrée standard OUVERTE : le 14/10, un préjugement
  // n'a rien rendu en 9 minutes tant que l'entrée standard restait ouverte (rendu en secondes avec
  // </dev/null). Le lanceur lisait l'entrée standard pour tout hook ; `--prejuger` juge un fichier et
  // n'en a pas l'usage. Vert : rendu sous 60 s, entrée jamais fermée. Rouge : le même lanceur sur le
  // hook de fin de tour SANS `--prejuger` attend toujours son entrée (c'est le contrat du hook Stop).
  const brouillon = join(base, "brouillon-prejuge.md");
  writeFileSync(brouillon, SIMPLE, "utf8");
  const ouvert = (args, ms) => new Promise((ok) => {
    const t0 = Date.now();
    const c = spawn(process.execPath, [lanceur, ...args], { cwd: P, env, stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    c.stdout.on("data", (d) => { out += d; });
    const minuteur = setTimeout(() => { c.kill(); ok({ fini: false, ms: Date.now() - t0, out }); }, ms);
    c.on("exit", (code) => { clearTimeout(minuteur); ok({ fini: true, code, ms: Date.now() - t0, out }); });
  });
  const pj = await ouvert(["restitution", "--prejuger", brouillon], 60000);
  check("9 préjugement par le lanceur, entrée standard ouverte : rendu sans attendre l'entrée (TF-1765)",
    pj.fini && /hook-restitution --prejuger/.test(pj.out), `fini=${pj.fini} en ${pj.ms} ms, sortie ${pj.out.slice(0, 160)}`);
  // 10 — TF-1754, remisage par le lanceur : `git stash` nu refusé (exit 2), `push -u -m` admis.
  const remise = (command) => spawnSync(process.execPath, [lanceur, "remisage"], { encoding: "utf8", cwd: P, env,
    input: JSON.stringify({ tool_name: "Bash", cwd: P, tool_input: { command } }) });
  const rNu = remise("git add . && git stash"), rEtiq = remise('git stash push -u -m "avant rebase"');
  check("10 remisage : `git stash` nu refusé par le lanceur (TF-1754)", rNu.status === 2 && /TF-1754/.test(rNu.stderr), rNu.stdout + rNu.stderr);
  check("10 bis remisage : `git stash push -u -m <étiquette>` passe", rEtiq.status === 0, rEtiq.stdout + rEtiq.stderr);

  // 11 — TF-1755/TF-1756 : toute commande `forge/hooks/factory.mjs <nom>` du gabarit est un hook que le
  // lanceur connaît et que le pilot porte ; sans quoi la fusion à l'ouverture câblerait un hook muet.
  const gabarit = JSON.parse(readFileSync(join(ICI, "settings-produit.json"), "utf8"));
  const nomsGabarit = Object.values(gabarit.hooks).flat().flatMap((g) => g.hooks || [])
    .map((h) => (String(h.command).match(/forge\/hooks\/factory\.mjs"?\s+([\w-]+)/) || [])[1]).filter(Boolean); // TF-1903 : chemin ancré entre guillemets
  const lanceurTexte = readFileSync(join(ICI, "hooks-factory.mjs"), "utf8");
  const inconnus = nomsGabarit.filter((n) => !lanceurTexte.includes(`"${n}"`) || !existsSync(join(PILOT, "oracles", `hook-${n}.mjs`)));
  check(`11 les ${nomsGabarit.length} hooks du gabarit sont connus du lanceur et portés par le pilot`, nomsGabarit.length >= 9 && !inconnus.length, inconnus.join(", "));

  const stopOuvert = await ouvert(["restitution"], 4000);
  check("9 bis sans --prejuger, le hook de fin de tour attend toujours son entrée (le contrat du hook Stop)",
    !stopOuvert.fini, `fini=${stopOuvert.fini} en ${stopOuvert.ms} ms`);
  // 12 — TF-1736, reprise par le lanceur (R-64) : le canal déclaré porte un générateur absent du poste,
  // l'ouverture le restaure sans geste humain ; sans feu vert, la fin de tour n'envoie rien ; un produit
  // sans manifeste reste muet.
  const canalR = join(base, "Mon Drive", "Produit - Reprise");
  mkdirSync(join(canalR, "scripts", "generateurs"), { recursive: true });
  writeFileSync(join(canalR, "scripts", "generateurs", "gen-1.py"), "# générateur 1\n", "utf8");
  const PR = produit("produit-reprise", false);
  writeFileSync(join(PR, "forge", "REPRISE.json"), JSON.stringify({ schema: "factory/reprise@1", canal: { chemins: [canalR] }, elements: ["scripts/generateurs"] }), "utf8");
  mkdirSync(join(PR, "scripts", "generateurs"), { recursive: true });
  writeFileSync(join(PR, "scripts", "generateurs", "local.py"), "# fait ici\n", "utf8");
  const envR = { ...env, REPRISE_ETAT: join(base, "etat-reprise") };
  const reprise = (dossier, mode) => spawnSync(process.execPath, [join(dossier, "forge", "hooks", "factory.mjs"), "reprise", mode], { encoding: "utf8", cwd: dossier, env: envR, input: "{}" });
  const rR = reprise(PR, "--restaurer");
  check("12 reprise : l'ouverture restaure depuis le canal déclaré le générateur absent du poste (R-64)",
    rR.status === 0 && existsSync(join(PR, "scripts", "generateurs", "gen-1.py")) && /1 fichier\(s\) restauré/.test(rR.stdout), rR.stdout + rR.stderr);
  const rP = reprise(PR, "--pousser");
  check("12 bis reprise : sans envoi actif ni feu vert, la fin de tour n'envoie rien vers le canal",
    rP.status === 0 && !existsSync(join(canalR, "scripts", "generateurs", "local.py")), rP.stdout + rP.stderr);
  const rMuet = reprise(produit("produit-sans-reprise", false), "--restaurer");
  check("12 ter reprise : un produit sans forge/REPRISE.json reste muet", rMuet.status === 0 && !rMuet.stdout.trim() && !rMuet.stderr.trim(), rMuet.stdout + rMuet.stderr);

  // 13 — TF-1903 (21/10/2026), la commande du GABARIT jouée comme le harnais la joue : par un shell, depuis le
  // répertoire courant de la session, ici un sous-dossier du produit (après un `cd`). `${CLAUDE_PROJECT_DIR}`
  // est remplacé par la racine du projet, comme Claude Code le fait (substitution sous PowerShell, variable
  // d'environnement sous Git Bash, rejoué le 21/10 sur 2.1.299 et 2.1.107). Rouge : la commande relative
  // d'avant, depuis le même sous-dossier, ne trouve pas le lanceur.
  // Le hook joué est `remisage`, dont le verdict ne dépend pas du dossier courant : `git stash` nu refusé (exit 2).
  const gabaritS = JSON.parse(readFileSync(join(ICI, "settings-produit.json"), "utf8"));
  const cmdRemisage = Object.values(gabaritS.hooks).flat().flatMap((g) => g.hooks || []).map((h) => String(h.command)).find((c) => /factory\.mjs"?\s+remisage\b/.test(c));
  const sous = join(P, "src", "module");
  mkdirSync(sous, { recursive: true });
  const parShell = (commande) => spawnSync(commande, { shell: true, encoding: "utf8", cwd: sous, env: { ...env, CLAUDE_PROJECT_DIR: P },
    input: JSON.stringify({ tool_name: "Bash", cwd: sous, tool_input: { command: "git stash" } }) });
  const ancre = parShell(String(cmdRemisage).split("${CLAUDE_PROJECT_DIR}").join(P));
  const relatif = parShell("node forge/hooks/factory.mjs remisage");
  check("13 TF-1903 : la commande remisage du gabarit, jouée depuis un sous-dossier du produit, atteint le lanceur et refuse `git stash` nu",
    /\$\{CLAUDE_PROJECT_DIR\}\/forge\/hooks\/factory\.mjs/.test(String(cmdRemisage)) && ancre.status === 2 && /TF-1754/.test(ancre.stderr), `${cmdRemisage} → ${ancre.status} ${ancre.stdout}${ancre.stderr}`);
  check("13 bis TF-1903 rouge : la commande relative d'avant, depuis le même sous-dossier, ne trouve pas le lanceur",
    relatif.status !== 0 && /MODULE_NOT_FOUND|Cannot find module/.test(relatif.stderr), `${relatif.status} ${relatif.stderr.slice(0, 200)}`);

  // 14 — TF-1959 (26/10/2026, D-77 (b) amendée), gestes distants par le lanceur : `az group delete` sans lot approuvé
  // est refusé (exit 2) avec le remède du PRODUIT ; `--poser` par le lanceur, entrée standard ouverte, écrit le lot
  // sous forge/ et la même commande passe ; une lecture passe sans lot.
  const envG = { ...env, CLAUDE_PROJECT_DIR: P };
  const geste = (command) => spawnSync(process.execPath, [lanceur, "gestes-distants"], { encoding: "utf8", cwd: P, env: envG,
    input: JSON.stringify({ tool_name: "Bash", cwd: P, tool_input: { command } }) });
  const gSans = geste("az group delete --name rg-essai --yes"), gLecture = geste("az group show --name rg-essai");
  check("14 gestes distants : `az group delete` sans lot refusé par le lanceur, remède du produit nommé (TF-1959)",
    gSans.status === 2 && /TF-1959/.test(gSans.stderr) && /forge\\hooks\\factory\.mjs gestes-distants --poser/.test(gSans.stderr), gSans.stdout + gSans.stderr);
  check("14 bis gestes distants : une lecture (`az group show`) passe sans lot", gLecture.status === 0, gLecture.stdout + gLecture.stderr);
  const lotG = join(base, "lot-gestes.json");
  writeFileSync(lotG, JSON.stringify({ decision: "D-78", reponse_humaine: "78a : approuvé, toute la liste", gestes: [
    { commande: "az group delete --name rg-essai --yes", cible: "groupe rg-essai", effet: "supprime le groupe", retour_arriere: "aucun, se recrée par terraform apply" }] }), "utf8");
  const poseG = await new Promise((ok) => {
    const c = spawn(process.execPath, [lanceur, "gestes-distants", "--poser", "--lot", lotG], { cwd: P, env: envG, stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "";
    c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { err += d; });
    const minuteur = setTimeout(() => { c.kill(); ok({ fini: false, out, err }); }, 30000);
    c.on("exit", (code) => { clearTimeout(minuteur); ok({ fini: true, code, out, err }); });
  });
  const gApres = geste("az group delete --name rg-essai --yes");
  check("14 ter gestes distants : `--poser` par le lanceur (entrée standard ouverte) écrit le lot sous forge/, et la commande passe ensuite",
    poseG.fini && poseG.code === 0 && existsSync(join(P, "forge", "gestes-approuves.jsonl")) && gApres.status === 0, `${JSON.stringify(poseG)} ${gApres.stderr}`);
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 300)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error(`hooks-factory : FAIL (${pass} PASS)\n  - ` + echecs.join("\n  - ")); process.exit(1); }
console.log(`hooks-factory : ${pass}/${pass} — niveaux vus depuis un produit : réponse Simple courte acceptée et refusée dès qu'un fichier est écrit, réponse Moyen acceptée et jugée Complexe dès un commit, pré-vol par le lanceur dans les deux sens, ligne de niveau du lexique suivant forge/NIVEAUX.md, identité sortante refusée par le lanceur et en-tête neutre admis (TF-1716), reprise restaurée depuis le canal déclaré, rien envoyé sans feu vert, muette sans manifeste (TF-1736), commande ancrée du gabarit jouée depuis un sous-dossier et commande relative refusée (TF-1903), geste destructif distant refusé sans lot, lot posé par le lanceur puis commande admise, lecture admise (TF-1959)`);
