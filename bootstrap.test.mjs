#!/usr/bin/env node
/**
 * bootstrap.test.mjs — recette de bootstrap.mjs sur dépôts git ÉPHÉMÈRES (aucun réseau :
 * BOOTSTRAP_SOURCE pointe un dossier de dépôts bare locaux portant les treize noms).
 *
 * Ce qu'elle prouve, dans les deux sens à chaque fois :
 *   1. poste vierge  → les 13 forges sont clonées, preuves présentes, « Poste prêt », exit 0 ;
 *   2. une forge prend du retard sur son origin → SANS --pull : DÉFAUT « en retard de 1 »,
 *      exit 1, remède nommé (--pull) ; AVEC --pull : mise à jour, exit 0 ;
 *   3. dossier hérité à l'ancien nom (digit-ai-forge-seo, origin = ce dépôt) → renommé sur
 *      place vers digit-ai-forge-seo-geo, aucun doublon, exit 0 ;
 *   4. preuve de point d'entrée absente → DÉFAUT, exit 1 ; restaurée → exit 0.
 * Le pilot courant et les skills du poste ne sont JAMAIS touchés (--sans-pilot --sans-skills).
 *
 * Joué par oracles/self-tests.mjs (invariant I2 : tout *.test.mjs du dépôt est joué).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, renameSync, unlinkSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const BOOTSTRAP = join(ICI, "bootstrap.mjs");
const base = mkdtempSync(join(tmpdir(), "bootstrap-"));
const echecs = [];
const git = (dir, ...a) => execFileSync("git", ["-C", dir, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

// Les treize noms et preuves sont LUS dans bootstrap.mjs : la recette ne tient pas sa
// propre liste — une forge ajoutée là-bas est couverte ici sans un geste.
const src = (await import("node:fs")).readFileSync(BOOTSTRAP, "utf8");
const FORGES = [...src.matchAll(/\{\s*nom:\s*"([^"]+)",\s*preuve:\s*"([^"]+)"/g)].map((m) => ({ nom: m[1], preuve: m[2] }));

try {
  if (FORGES.length < 13) throw new Error(`liste de forges lue : ${FORGES.length} — attendu >= 13`);
  const bare = join(base, "bare"); mkdirSync(bare);
  const atelier = join(base, "atelier"); mkdirSync(atelier);
  for (const f of FORGES) {
    const b = join(bare, `${f.nom}.git`); mkdirSync(b);
    git(b, "init", "--quiet", "--bare", "--initial-branch=main", ".");
    const w = join(atelier, f.nom);
    git(atelier, "clone", "--quiet", b, w);
    mkdirSync(dirname(join(w, f.preuve)), { recursive: true });
    writeFileSync(join(w, f.preuve), `preuve ${f.nom}\n`);
    git(w, "add", "-A"); git(w, "commit", "--quiet", "-m", "v0"); git(w, "push", "--quiet", "origin", "main");
  }
  const racine = join(base, "racine"); mkdirSync(racine);
  const lancer = (...a) => spawnSync(process.execPath, [BOOTSTRAP, "--racine", racine, "--sans-pilot", "--sans-skills", ...a],
    { encoding: "utf8", env: { ...process.env, BOOTSTRAP_SOURCE: bare, BOOTSTRAP_RELANCE: "1" } });
  const attendre = (nom, r, code, motif) => {
    if (r.status !== code) echecs.push(`${nom} : exit ${r.status}, attendu ${code} — ${(r.stdout + r.stderr).split("\n").filter((l) => /DEFAUT|Poste/.test(l)).join(" | ").slice(0, 300)}`);
    else if (motif && !motif.test(r.stdout)) echecs.push(`${nom} : exit conforme mais motif absent (${motif})`);
  };

  // 1. poste vierge
  const v = lancer();
  attendre("vierge", v, 0, /Poste prêt/);
  const clones = FORGES.filter((f) => existsSync(join(racine, f.nom, ".git"))).length;
  if (clones !== FORGES.length) echecs.push(`vierge : ${clones}/${FORGES.length} forges clonées`);

  // 2. retard : une « autre session » pousse un commit chez conception
  const w = join(atelier, FORGES[0].nom);
  writeFileSync(join(w, "NOUVEAU.md"), "x\n"); git(w, "add", "-A"); git(w, "commit", "--quiet", "-m", "v1"); git(w, "push", "--quiet", "origin", "main");
  attendre("retard sans --pull", lancer(), 1, /en retard de 1 commit/);
  attendre("retard avec --pull", lancer("--pull"), 0, /mis à jour/);
  if (!existsSync(join(racine, FORGES[0].nom, "NOUVEAU.md"))) echecs.push("--pull : le commit distant n'est pas arrivé");

  // 3. dossier hérité à l'ancien nom
  const neuf = join(racine, "digit-ai-forge-seo-geo"), vieux = join(racine, "digit-ai-forge-seo");
  if (existsSync(neuf)) {
    renameSync(neuf, vieux);
    git(vieux, "remote", "set-url", "origin", join(bare, "digit-ai-forge-seo.git")); // URL à l'ancien nom, comme chez un utilisateur
    attendre("alias renommé", lancer(), 0, /renommé et pointé/);
    if (!existsSync(join(neuf, ".git")) || existsSync(vieux)) echecs.push("alias : le dossier n'a pas été renommé sur place");
    if (readdirSync(racine).filter((d) => /seo/.test(d)).length !== 1) echecs.push("alias : doublon seo / seo-geo");
  } else echecs.push("alias : digit-ai-forge-seo-geo absent de la liste lue");

  // 4. preuve absente puis restaurée
  const p = join(racine, FORGES[1].nom, FORGES[1].preuve);
  unlinkSync(p);
  attendre("preuve absente", lancer(), 1, /preuve absente/);
  git(join(racine, FORGES[1].nom), "checkout", "--", FORGES[1].preuve);
  attendre("preuve restaurée", lancer(), 0, /Poste prêt/);
} catch (err) {
  echecs.push(`harnais : ${String(err).slice(0, 300)}`);
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* verrou git résiduel toléré */ }
}

if (echecs.length) { console.error("bootstrap : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log(`bootstrap : 7/7 — vierge clone ${FORGES.length}/${FORGES.length}, retard refusé puis résorbé par --pull, alias renommé sans doublon, preuve absente refusée puis restaurée`);
