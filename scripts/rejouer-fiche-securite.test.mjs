#!/usr/bin/env node
/**
 * rejouer-fiche-securite.test.mjs — le pas de la porte M qui rejoue FS12 avec l'étiquette déployée et
 * consigne son verdict au dossier de MEP (M-24, TF-2536, TF-2572). Produits et fiches construits en
 * dossier temporaire ; le dossier de MEP est ensuite jugé par TM18 d'`oracle-trace-mutation-mep.mjs`.
 *
 * Le défaut d'origine (14/11/2026) : la prescription et son contrôle existaient, rien ne jouait FS12
 * avec l'étiquette ni n'écrivait le verdict que TM18 lit. Rouge : sans le pas, le dossier qui cite
 * la fiche est un AVERTISSEMENT de TM18 (il ne porte pas de verdict de FS12). Vert : après le pas, le
 * MÊME dossier passe TM18 — le remède se joue (TF-1013). Puis les verdicts FAIL et SKIP (consignés,
 * exit 1 et 2), le rejeu qui se lit au dernier verdict, la section existante qui reçoit la ligne sans
 * en déborder, l'étiquette lue du commit servi, et les refus d'usage qui n'écrivent rien.
 * Les cas qui jouent forge-audit se déclarent NON JOUÉS quand le dépôt est absent du poste.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "rejouer-fiche-securite.mjs");
const racinesParc = [process.env.FORGE_ROOT, join(ICI, "..", ".."), "c:\\dev"].filter(Boolean);
const AUDIT = racinesParc.map((r) => join(r, "digit-ai-forge-audit")).find((d) => existsSync(join(d, "oracles", "verifier-fiche-securite.mjs")));
const { juger } = await import(pathToFileURL(join(ICI, "..", "oracles", "oracle-trace-mutation-mep.mjs")).href);

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const checkAudit = (nom, fn) => {
  if (!AUDIT) { console.log(`  [NON JOUÉ] ${nom} — forge-audit introuvable (FORGE_ROOT, voisin du pilot, c:\\dev)`); return; }
  check(nom, fn);
};

const racines = [];
const produit = (dossier) => {
  const D = mkdtempSync(join(tmpdir(), "rejouer-fs12-"));
  racines.push(D);
  mkdirSync(join(D, "forge", "etapes", "mep"), { recursive: true });
  const chemin = join(D, "forge", "etapes", "mep", "DOSSIER-MEP.md");
  if (dossier !== null) writeFileSync(chemin, dossier, "utf8");
  return { D, chemin };
};
// Une fiche minimale à la forme que FS12 lit : la ligne « Version déployée » (th / td). FS1 à FS11 ne sont pas l'objet du pas.
const fiche = (D, version, nom = "fiche.html") => {
  const chemin = join(D, nom);
  const ligne = version === null ? "" : `<tr><th>Version déployée</th><td>${version}</td></tr>`;
  writeFileSync(chemin, `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Fiche</title></head><body>`
    + `<header>Réf. CDC-SEC-HPR-20261110a</header><h1>Fiche sécurité</h1><table><tbody>${ligne}</tbody></table>`
    + `<footer>Réf. CDC-SEC-HPR-20261110a</footer></body></html>`, "utf8");
  return chemin;
};
const lancer = (...a) => {
  const r = spawnSync(process.execPath, [OUTIL, ...a], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const rejouer = (D, chemin, f, etiquette) => lancer(f, "--dossier", chemin, "--etiquette-deployee", etiquette, "--sans-pdf", ...(AUDIT ? ["--audit", AUDIT] : []));
const tm18 = (D) => juger(D).find((f) => f.regle === "TM18");
const DOSSIER_CITE = "# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n\n## Fiche de sécurité\n\nFiche CDC-SEC-HPR-20261110a remise au référent sécurité, version citée v1.13.0.\n";

checkAudit("rouge d'origine — sans le pas, le dossier qui cite la fiche ne porte aucun verdict de FS12 : TM18 AVERTIT ; vert — le pas joué, le MÊME dossier passe TM18", () => {
  const { D, chemin } = produit(DOSSIER_CITE);
  const avant = tm18(D);
  if (avant?.statut !== "AVERTISSEMENT" || !/ne porte pas le verdict de FS12/.test(avant.message)) throw new Error(`avant le pas : ${JSON.stringify(avant)}`);
  const r = rejouer(D, chemin, fiche(D, "1.13.0"), "v1.13.0");
  if (r.code !== 0 || r.j?.verdict !== "PASS") throw new Error(r.brut.slice(0, 400));
  const apres = tm18(D);
  if (apres?.statut !== "PASS") throw new Error(`après le pas : ${JSON.stringify(apres)} / dossier : ${readFileSync(chemin, "utf8")}`);
  if (!/^FS12 : PASS \(.*\) — étiquette déployée 1\.13\.0, rejoué le \d{4}-\d{2}-\d{2}\.$/m.test(readFileSync(chemin, "utf8"))) throw new Error("la ligne consignée n'a pas la forme de M-24");
});
checkAudit("rouge — la fiche cite v1.10.0, l'étiquette déployée est v1.13.0 : FS12 FAIL consigné, exit 1, TM18 AVERTIT (le cas fondateur du 10/11/2026)", () => {
  const { D, chemin } = produit(DOSSIER_CITE);
  const r = rejouer(D, chemin, fiche(D, "1.10.0"), "1.13.0");
  if (r.code !== 1 || r.j?.verdict !== "FAIL") throw new Error(r.brut.slice(0, 400));
  if (!/^FS12 : FAIL /m.test(readFileSync(chemin, "utf8"))) throw new Error("le FAIL n'est pas consigné au dossier");
  const t = tm18(D);
  if (t?.statut !== "AVERTISSEMENT" || !/FAIL de FS12/.test(t.message)) throw new Error(JSON.stringify(t));
});
checkAudit("rejeu — un FAIL, la fiche réémise, le pas rejoué : deux lignes, une seule section, TM18 lit le dernier verdict (PASS)", () => {
  const { D, chemin } = produit(DOSSIER_CITE);
  rejouer(D, chemin, fiche(D, "1.10.0"), "1.13.0");
  const r = rejouer(D, chemin, fiche(D, "1.13.0", "fiche-reemise.html"), "1.13.0");
  const texte = readFileSync(chemin, "utf8");
  if (r.code !== 0 || (texte.match(/^FS12 : /gm) || []).length !== 2 || (texte.match(/^## Fiche de sécurité$/gm) || []).length !== 1) throw new Error(`exit ${r.code} / ${texte}`);
  if (tm18(D)?.statut !== "PASS") throw new Error(JSON.stringify(tm18(D)));
});
checkAudit("SKIP — la fiche ne cite aucune version : FS12 SKIP consigné, exit 2, TM18 AVERTIT", () => {
  const { D, chemin } = produit(DOSSIER_CITE);
  const r = rejouer(D, chemin, fiche(D, null), "1.13.0");
  if (r.code !== 2 || r.j?.verdict !== "SKIP" || !/^FS12 : SKIP /m.test(readFileSync(chemin, "utf8"))) throw new Error(r.brut.slice(0, 400));
  if (tm18(D)?.statut !== "AVERTISSEMENT") throw new Error(JSON.stringify(tm18(D)));
});
checkAudit("section absente — le pas crée « ## Fiche de sécurité » avec la référence de la fiche, et le dossier passe TM18", () => {
  const { D, chemin } = produit("# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n\nLa fiche de sécurité du produit est tenue par le référent.\n");
  const r = rejouer(D, chemin, fiche(D, "1.13.0"), "1.13.0");
  const texte = readFileSync(chemin, "utf8");
  if (r.code !== 0 || !/^## Fiche de sécurité$/m.test(texte) || !/Fiche CDC-SEC-HPR-20261110a remise/.test(texte)) throw new Error(`exit ${r.code} / ${texte}`);
  if (tm18(D)?.statut !== "PASS") throw new Error(JSON.stringify(tm18(D)));
});
checkAudit("section existante suivie d'une autre — la ligne s'écrit dans la section, avant le titre suivant, sans l'avaler", () => {
  const { D, chemin } = produit(`${DOSSIER_CITE}\n## Version servie et inventaire\n\nVersion servie : commit 6f78b88.\n`);
  rejouer(D, chemin, fiche(D, "1.13.0"), "1.13.0");
  const texte = readFileSync(chemin, "utf8");
  const iLigne = texte.indexOf("FS12 : PASS"), iSuivante = texte.indexOf("## Version servie et inventaire");
  if (iLigne === -1 || iSuivante === -1 || iLigne > iSuivante || !/Version servie : commit 6f78b88\.\n$/.test(texte)) throw new Error(texte);
});
checkAudit("fins de ligne CRLF d'un dossier — gardées, aucune ligne mêlée", () => {
  const { D, chemin } = produit(DOSSIER_CITE.replace(/\n/g, "\r\n"));
  rejouer(D, chemin, fiche(D, "1.13.0"), "1.13.0");
  const texte = readFileSync(chemin, "utf8");
  if (/[^\r]\n/.test(texte) || !/FS12 : PASS/.test(texte)) throw new Error(JSON.stringify(texte.slice(-300)));
});
checkAudit("étiquette lue du commit servi — `git describe --tags --abbrev=0` dans le dépôt du produit, v1.13.0 nue de son « v »", () => {
  const { D, chemin } = produit(DOSSIER_CITE);
  const g = (...a) => spawnSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", "-C", D, ...a], { encoding: "utf8" });
  g("init", "-q", "-b", "main"); writeFileSync(join(D, "app.txt"), "v1\n"); g("add", "app.txt"); g("commit", "-q", "-m", "socle");
  g("tag", "v1.13.0"); writeFileSync(join(D, "app.txt"), "v2\n"); g("commit", "-q", "-am", "après l'étiquette");
  const sha = g("rev-parse", "HEAD").stdout.trim();
  const r = lancer(fiche(D, "1.13.0"), "--dossier", chemin, "--commit-servi", sha, "--depot", D, "--sans-pdf", "--audit", AUDIT);
  if (r.code !== 0 || r.j?.etiquette_deployee !== "v1.13.0") throw new Error(r.brut.slice(0, 400));
  if (tm18(D)?.statut !== "PASS") throw new Error(JSON.stringify(tm18(D)));
});

// Les refus d'usage : rien n'est écrit, exit 2, la cause est dite. Ils ne jouent pas forge-audit.
const refus = (nom, preparer, attendu) => check(`refus — ${nom} : exit 2, dossier intact`, () => {
  const { D, chemin } = produit(DOSSIER_CITE);
  const r = preparer(D, chemin);
  if (r.code !== 2 || r.j?.verdict !== "NON_JOUABLE" || !attendu.test(r.j?.message || "")) throw new Error(r.brut.slice(0, 400));
  if (readFileSync(chemin, "utf8") !== DOSSIER_CITE) throw new Error("le dossier a été modifié par un pas refusé");
});
refus("sans --dossier", (D) => lancer(fiche(D, "1.13.0"), "--etiquette-deployee", "1.13.0"), /--dossier .* est dû/);
refus("dossier introuvable (le pas n'en crée pas)", (D) => lancer(fiche(D, "1.13.0"), "--dossier", join(D, "absent.md"), "--etiquette-deployee", "1.13.0"), /dossier de MEP introuvable/);
refus("fiche introuvable", (D, c) => lancer(join(D, "absente.html"), "--dossier", c, "--etiquette-deployee", "1.13.0"), /fiche introuvable/);
refus("ni étiquette ni commit servi", (D, c) => lancer(fiche(D, "1.13.0"), "--dossier", c), /l'étiquette déployée est due/);
refus("étiquette qui n'est pas une version", (D, c) => lancer(fiche(D, "1.13.0"), "--dossier", c, "--etiquette-deployee", "latest"), /n'est pas une version x\.y\.z/);
refus("commit servi sans étiquette dans le dépôt", (D, c) => lancer(fiche(D, "1.13.0"), "--dossier", c, "--commit-servi", "abc1234", "--depot", D), /aucune étiquette ne précède/);
refus("forge-audit introuvable", (D, c) => lancer(fiche(D, "1.13.0"), "--dossier", c, "--etiquette-deployee", "1.13.0", "--audit", join(D, "pas-un-depot")), /forge-audit introuvable/);

for (const D of racines) rmSync(D, { recursive: true, force: true });
console.log(`\nrejouer-fiche-securite (M-24, TF-2572) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
