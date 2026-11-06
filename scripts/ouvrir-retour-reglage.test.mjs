#!/usr/bin/env node
/**
 * ouvrir-retour-reglage.test.mjs — un écart d'audit sur un réglage classé « defaut » rouvre un retour vers la
 * forge qui crée ; sur un réglage classé « decision », il renvoie à sa décision (D-178 (a), TF-2232).
 *
 * Rouges : un écart sur un réglage « defaut » qui ne rouvrirait rien (ancien comportement : aucun outil, la
 * correction restait chez le produit) ; un écart sur un réglage « decision » sans décision nommée (écart nu) ;
 * un nom réel à la place d'un pseudonyme ; un réglage ambigu ; un argument manquant.
 * Verts : l'écart « defaut » rend une candidature au format du sidecar, vers digit-ai-forge-development, avec
 * l'identifiant de l'écart, d'une classe qui existe au référentiel ; l'écart « decision » avec sa décision ne
 * rouvre aucun retour ; un réglage hors registre n'en ouvre pas non plus.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ouvrir-retour-reglage.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const entree = (url, reglage, classement, attendu) => ({
  plateforme: "Exemple", reglage, source_url: url, source_lue_le: "2026-11-06",
  criteres: Object.fromEntries(["c1", "c2", "c3", "c4", "c5"].map((k) => [k, { verdict: "tenu", preuve: "x" }])),
  cmd_appliquer: "curl -X PUT $URL", cmd_lire: "curl $URL", attendu, cmd_retour: "curl -X DELETE $URL", classement,
});
const T = mkdtempSync(join(tmpdir(), "ouvrir-retour-"));
const REGISTRE = join(T, "registre.json");
writeFileSync(REGISTRE, JSON.stringify([
  entree("https://exemple.test/docs/tls", "TLS imposé sur les connexions (exemple)", "defaut", "true"),
  entree("https://exemple.test/docs/tls-client", "TLS client (exemple, variante)", "defaut", "true"),
  entree("https://exemple.test/docs/mfa", "Double vérification des membres (exemple)", "decision", "true pour chaque membre"),
]), "utf8");
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, "--registre", REGISTRE, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const base = ["--ecart", "EC-HPR-18", "--produit", "Produit-84", "--audit", "audit des écarts du 30/10/2026", "--date", "2026-11-06"];

check("rouge → vert — un écart sur un réglage « defaut » ouvre un retour vers la forge qui crée, avec l'identifiant de l'écart", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/tls", ...base);
  const c = r.j?.candidature;
  if (r.code !== 0 || r.j.verdict !== "A_OUVRIR" || !c) throw new Error(r.brut.slice(0, 500));
  if (JSON.stringify(c.forges_cibles_initiales) !== '["digit-ai-forge-development"]') throw new Error(`forge visée : ${c.forges_cibles_initiales}`);
  if (!/EC-HPR-18/.test(c.titre) || !/EC-HPR-18/.test(c.contenu) || !/EC-HPR-18/.test(c.source)) throw new Error("l'identifiant de l'écart n'est pas porté par la candidature");
  if (c.demandeur !== "Produit-84" || c.date_demande !== "2026-11-06") throw new Error("demandeur ou date");
});
check("la candidature a la forme d'un sidecar de lot : schéma, score à trois entiers, classe du référentiel", () => {
  const c = lancer("--reglage", "https://exemple.test/docs/tls", ...base).j.candidature;
  for (const k of ["schema", "titre", "contenu", "demandeur", "date_demande", "source", "forges_cibles_initiales", "score", "preuve_du_cout", "classe"]) if (!(k in c)) throw new Error(`champ « ${k} » absent`);
  if (!["gain", "preuve", "effort"].every((k) => Number.isInteger(c.score[k]))) throw new Error("score");
  const classes = JSON.parse(readFileSync(join(ICI, "..", "todo", "CLASSES.json"), "utf8")).classes;
  const existe = Array.isArray(classes) ? classes.some((x) => x.cle === c.classe) : c.classe in classes;
  if (!existe) throw new Error(`la classe « ${c.classe} » n'existe pas à todo\\CLASSES.json : l'ingestion la refuserait (R13)`);
});
check("rouge — sans identifiant d'écart ou sans produit : appel inutilisable (exit 2), aucune candidature", () => {
  for (const manquant of [["--reglage", "https://exemple.test/docs/tls", "--produit", "Produit-84"], ["--reglage", "https://exemple.test/docs/tls", "--ecart", "EC-HPR-18"]]) {
    const r = lancer(...manquant);
    if (r.code !== 2 || r.j.candidature) throw new Error(r.brut.slice(0, 300));
  }
});
check("rouge — un nom réel de produit à la place d'un pseudonyme : refusé, le pilot est public", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/tls", "--ecart", "EC-HPR-18", "--produit", "MonProduitReel");
  if (r.code !== 2 || !/pseudonyme/.test(r.j.message)) throw new Error(r.brut.slice(0, 300));
});
check("rouge — un écart sur un réglage « decision » sans décision nommée est un écart nu : exit 1", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/mfa", ...base);
  if (r.code !== 1 || r.j.verdict !== "ECART_NU" || r.j.candidature) throw new Error(r.brut.slice(0, 400));
});
check("vert — le remède joué : le même écart avec sa décision nommée renvoie à elle, sans retour vers la forge", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/mfa", "--decision", "D-178", ...base);
  if (r.code !== 0 || r.j.verdict !== "RENVOI_DECISION" || r.j.candidature || !/D-178/.test(r.j.message)) throw new Error(r.brut.slice(0, 400));
  if (!/true pour chaque membre/.test(r.j.message)) throw new Error("l'attendu du registre n'est pas rappelé : l'écart accepté se vérifie tel que décidé");
});
check("rouge — une décision mal formée (« oui ») : appel inutilisable", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/mfa", "--decision", "oui", ...base);
  if (r.code !== 2) throw new Error(r.brut.slice(0, 300));
});
check("borne — un réglage hors registre n'ouvre aucun retour vers la forge (exit 0, HORS_REGISTRE)", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/inconnu", ...base);
  if (r.code !== 0 || r.j.verdict !== "HORS_REGISTRE" || r.j.candidature) throw new Error(r.brut.slice(0, 300));
});
check("rouge — un fragment qui désigne deux réglages ne choisit pas : AMBIGU (exit 2), les adresses candidates sont rendues", () => {
  const r = lancer("--reglage", "docs/tls", ...base);
  if (r.code !== 2 || r.j.verdict !== "AMBIGU" || r.j.candidats?.length !== 2) throw new Error(r.brut.slice(0, 300));
});
check("vert — l'adresse complète lève l'ambiguïté du fragment (« tls-client » ne se confond pas avec « tls »)", () => {
  const r = lancer("--reglage", "https://exemple.test/docs/tls-client", ...base);
  if (r.code !== 0 || r.j.source_url !== "https://exemple.test/docs/tls-client") throw new Error(r.brut.slice(0, 300));
});
check("le registre RÉEL du pilot : l'adresse du TLS imposé de Supabase rouvre un retour (classé defaut), celle de la double vérification des membres demande une décision", () => {
  const r = spawnSync(process.execPath, [OUTIL, "--reglage", "https://supabase.com/docs/guides/platform/ssl-enforcement", ...base], { encoding: "utf8" });
  if (r.status !== 0 || JSON.parse(r.stdout).verdict !== "A_OUVRIR") throw new Error(r.stdout.slice(0, 300) + r.stderr.slice(0, 200));
  const m = spawnSync(process.execPath, [OUTIL, "--reglage", "https://supabase.com/docs/guides/platform/mfa/org-mfa-enforcement", ...base], { encoding: "utf8" });
  if (m.status !== 1 || JSON.parse(m.stdout).verdict !== "ECART_NU") throw new Error(m.stdout.slice(0, 300) + m.stderr.slice(0, 200));
});
check("registre introuvable : exit 2, jamais un renvoi par défaut", () => {
  const r = spawnSync(process.execPath, [OUTIL, "--registre", join(T, "absent.json"), "--reglage", "x", ...base], { encoding: "utf8" });
  if (r.status !== 2) throw new Error(`exit ${r.status}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nouvrir-retour-reglage (D-178 (a), TF-2232) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
