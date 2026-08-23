#!/usr/bin/env node
/**
 * bootstrap.test.mjs — recette de bootstrap.mjs sur dépôts git ÉPHÉMÈRES (aucun réseau :
 * BOOTSTRAP_SOURCE pointe un dossier de dépôts bare locaux portant les noms LUS dans la liste).
 *
 * Ce qu'elle prouve, dans les deux sens à chaque fois :
 *   1. poste vierge  → tous les dépôts de la liste sont clonés, preuves présentes, « Poste prêt », exit 0 ;
 *   2. une forge prend du retard sur son origin → SANS --pull : DÉFAUT « en retard de 1 »,
 *      exit 1, remède nommé (--pull) ; AVEC --pull : mise à jour, exit 0 ;
 *   3. dossier hérité à l'ancien nom (digit-ai-forge-seo, origin = ce dépôt) → renommé sur
 *      place vers digit-ai-forge-seo-geo, aucun doublon, exit 0 ;
 *   3 bis. les dépôts que la LISTE NE CONNAÎT PAS, cinq formes qui ne se détectent pas pareil :
 *      (a) second clone à origin identique · (b) répertoire non versionné · (c) rien n'est effacé ·
 *      (d) clone d'AVANT un renommage, origin à l'ancien nom, reconnu par la table d'alias ·
 *      (e) pierre tombale (PERIME.md) déclarée comme telle et non comme un accident ·
 *      (f) dépôt de l'écosystème hors liste, avec son propre origin, jamais vérifié ;
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
let joues = 0;
const git = (dir, ...a) => execFileSync("git", ["-C", dir, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

// Les noms et preuves sont LUS dans bootstrap.mjs : la recette ne tient pas sa
// propre liste — une forge ajoutée là-bas est couverte ici sans un geste.
const src = (await import("node:fs")).readFileSync(BOOTSTRAP, "utf8");
// Les ALIAS sont lus ici aussi (TF-0533) : le cas 3 bis (d) en a besoin, et une recette qui
// tiendrait sa propre liste d'alias divergerait de bootstrap.mjs au premier renommage.
const FORGES = [...src.matchAll(/\{\s*nom:\s*"([^"]+)",\s*preuve:\s*"([^"]+)"(?:,\s*alias:\s*\[([^\]]*)\])?/g)]
  .map((m) => ({ nom: m[1], preuve: m[2],
    alias: (m[3] || "").split(",").map((a) => a.trim().replace(/^"|"$/g, "")).filter(Boolean) }));

try {
  // PLANCHER, pas un compte : ce test ne vérifie pas COMBIEN de dépôts la liste porte — elle
  // grandit (quatorze le 23/08 avec l'entrée de digit-ai-queue) — mais qu'elle a bien été LUE.
  // Un compte écrit ici mentirait au premier ajout, comme le « 11/11 » de la ligne finale l'a fait.
  if (FORGES.length < 10) throw new Error(`liste de dépôts lue : ${FORGES.length} — la lecture a échoué`);
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
  // LE COMPTE SE COMPTE, IL NE S'ÉCRIT PAS (23/08/2026). La ligne finale annonçait « 11/11 » en
  // DUR : deux cas ajoutés le même jour ne l'ont pas fait bouger, et le nombre a menti sans qu'un
  // seul test échoue. Un compte affirmé au lieu d'être dérivé est exactement ce que le parc traque
  // ailleurs — il vaut mieux ici aussi.
  const attendre = (nom, r, code, motif) => {
    joues += 1;
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

  // 3 bis (TF-0525). LES DÉPÔTS QUE LA LISTE NE CONNAÎT PAS. Mesuré le 23/08 : la racine portait un
  // SECOND CLONE du pilot sous un ancien nom — même `origin`, deux répertoires, 110 commits de
  // retard, et absent de la liste donc jamais mis à jour. Quelqu'un y avait ingéré une candidature
  // en croyant écrire dans le registre vivant ; le sujet a été redécouvert quatre jours plus tard et
  // instruit une seconde fois. Le marqueur `PERIME.md` qui y avait été posé était NON VERSIONNÉ : un
  // avertissement qui ne survit pas au clonage n'avertit personne.
  //
  // CINQ formes, jouées séparément parce qu'elles ne se détectent pas de la même façon — et trois
  // d'entre elles (d, e, f) ont été ajoutées le 23/08 après avoir laissé passer un cas réel chacune.
  {
    // (a) un vrai second clone : même origin qu'un dépôt connu.
    const connu = join(racine, FORGES[0].nom);
    const doublon = join(racine, FORGES[0].nom + "_old");
    execFileSync("git", ["clone", "--quiet", connu, doublon], { stdio: ["ignore", "pipe", "pipe"] });
    // Son `origin` doit pointer le MÊME dépôt que le connu, sinon ce n'est pas le cas qu'on teste.
    const url = execFileSync("git", ["-C", connu, "remote", "get-url", "origin"], { encoding: "utf8" }).trim();
    git(doublon, "remote", "set-url", "origin", url);
    attendre("second clone détecté (même origin)", lancer(), 0, /SECOND CLONE/);

    // (b) un répertoire NON versionné qui porte un nom de l'écosystème : on s'y installe en croyant
    //     être dans un dépôt, et rien n'y est suivi.
    mkdirSync(join(racine, "digit-ai-forge-fantome"));
    attendre("répertoire non versionné signalé", lancer(), 0, /NON versionné/);
    rmSync(join(racine, "digit-ai-forge-fantome"), { recursive: true, force: true });

    // (d) LE CAS QUI A ECHAPPE, ET IL A VECU (TF-0533, 23/08/2026) : un clone antérieur à un
    //     RENOMMAGE. Son `origin` porte l'ANCIEN nom du dépôt — « …/digit-ai-forge-seo.git » face à
    //     « …/digit-ai-forge-seo-geo.git ». La comparaison de chaînes échouait, le dossier n'était
    //     ni un second clone, ni non versionné, ni nommé de côté : il était déclaré comme RIEN et
    //     tout oracle de parc le comptait comme vivant. La table d'alias sert maintenant aussi ici.
    {
      const cible = FORGES.find((f) => (f.alias || []).length);
      if (!cible) echecs.push("3 bis (d) : aucune forge à alias dans la liste lue");
      else {
        const ancien = cible.alias[0];
        const clone = join(racine, ancien);
        execFileSync("git", ["clone", "--quiet", join(racine, cible.nom), clone], { stdio: ["ignore", "pipe", "pipe"] });
        // L'origin porte l'ANCIEN nom, comme chez quiconque a cloné avant le renommage.
        git(clone, "remote", "set-url", "origin", join(bare, `${ancien}.git`));
        attendre("clone d'avant renommage détecté par son ALIAS", lancer(), 0,
          new RegExp(`${ancien} — SECOND CLONE de ${cible.nom}`));
        rmSync(clone, { recursive: true, force: true });
      }
    }

    // (e) UNE PIERRE TOMBALE N'EST PAS UN ACCIDENT (23/08). La branche « répertoire NON versionné »
    //     passait AVANT toute lecture de PERIME.md : un dossier tombé là par mégarde et un marqueur
    //     posé exprès recevaient le même verdict. Confondre les deux apprend à ignorer les deux.
    {
      const tombe = join(racine, "digit-ai-forge-tombale");
      mkdirSync(tombe);
      writeFileSync(join(tombe, "PERIME.md"), "# PÉRIMÉ — ne rien exécuter d'ici\n");
      attendre("marqueur PERIME.md lu même sans dépôt git", lancer(), 0, /mise de côté DÉCLARÉE/);
      rmSync(tombe, { recursive: true, force: true });
    }

    // (f) LE TROISIÈME TROU (23/08) : un dépôt de l'écosystème, versionné, avec SON PROPRE origin —
    //     ni forge de la liste, ni second clone, ni mise de côté. Il tombait entre toutes les
    //     branches et n'était déclaré NULLE PART. Mesuré sur le parc réel : un dépôt vivait là
    //     depuis un moment, hors de toute vérification de fraîcheur, et rien ne l'avait jamais dit.
    {
      const seul = join(racine, "digit-ai-forge-solitaire");
      const bareSeul = join(bare, "digit-ai-forge-solitaire.git");
      mkdirSync(bareSeul); git(bareSeul, "init", "--quiet", "--bare", "--initial-branch=main", ".");
      execFileSync("git", ["clone", "--quiet", bareSeul, seul], { stdio: ["ignore", "pipe", "pipe"] });
      attendre("dépôt de l'écosystème hors liste DÉCLARÉ", lancer(), 0, /digit-ai-forge-solitaire — dépôt de l'écosystème HORS LISTE/);
      rmSync(seul, { recursive: true, force: true });
    }

    // (c) le contrôle NE SUPPRIME RIEN : un répertoire signalé est toujours là au tour suivant.
    //     Effacer un dépôt sur une heuristique échangerait un piège contre une perte.
    if (!existsSync(doublon)) echecs.push("3 bis : le contrôle a SUPPRIMÉ le doublon — il doit le déclarer, pas l'effacer");
    rmSync(doublon, { recursive: true, force: true });
    attendre("racine propre une fois le doublon retiré", lancer(), 0, /racine propre/);
  }

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
console.log(`bootstrap : ${joues}/${joues} — vierge clone ${FORGES.length}/${FORGES.length}, retard refusé puis résorbé par --pull, alias renommé sans doublon, second clone et répertoire non versionné DÉCLARÉS sans être effacés (TF-0525), clone d'AVANT un renommage reconnu par sa table d'alias (TF-0533), preuve absente refusée puis restaurée`);
