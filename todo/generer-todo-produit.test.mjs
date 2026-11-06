#!/usr/bin/env node
/**
 * generer-todo-produit.test.mjs — la page TODO-PRODUIT.html est jugée par `run-oracles-design` (TF-2212).
 *
 * LE FAIT. Le 05/11/2026, un produit relevait que la page produite par `todo/generer-todo-produit.mjs` échouait à
 * `run-oracles-design.mjs` de digit-ai-forge-design (S1, T3, V1 en clair et en sombre), « identique sur la version
 * précédente » : la page portait sa propre feuille de style et aucune recette ne la jugeait. Mesuré le 06/11/2026 sur
 * le gabarit `gabarits/docs-projet/TODO-PRODUIT.md` rendu par la version d'avant : à l'analyse statique, oracle-slop
 * FAIL (S1 ×1), oracle-tokens FAIL (T3 ×8, T8 ×1) ; au rendu, render_page FAIL en clair et en sombre (V1 ×4, V18 ×16
 * chacun).
 *
 * CE QUE LA RECETTE TIENT, DANS LES DEUX SENS. VERT : la page que le générateur écrit passe tout le point d'entrée des
 * oracles de design, et le rendu (V1, V18, contraste) quand le poste a le moteur de rendu. ROUGE : la même page à
 * laquelle on réinjecte les déclarations d'avant le remède est refusée par les règles nommées (S1, T3).
 *
 * SKIP DÉCLARÉ, JAMAIS UN VERT DE COMPLAISANCE : sans digit-ai-forge-design ou sans le socle de page sur le poste, la
 * recette sort en 0 en nommant l'absence et ne compte aucun cas.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { socleDePage } from "../scripts/lib-socle-page.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const GENERATEUR = join(ICI, "generer-todo-produit.mjs");
const GABARIT = join(ICI, "..", "gabarits", "docs-projet", "TODO-PRODUIT.md");

function racineForgeDesign() {
  const present = (c) => (c && existsSync(join(c, "oracles", "run-oracles-design.mjs")) ? c : null);
  if (process.env.FORGE_DESIGN_ROOT) return present(process.env.FORGE_DESIGN_ROOT); // exclusif, comme run-oracles-design
  for (const r of [process.env.FORGE_ROOT, join(ICI, "..", "..")]) {
    const c = r && present(join(r, "digit-ai-forge-design"));
    if (c) return c;
  }
  return null;
}

const racine = racineForgeDesign();
if (!racine) {
  console.log("generer-todo-produit (TF-2212) : SKIP déclaré — digit-ai-forge-design absente du poste (ni FORGE_DESIGN_ROOT, "
    + "ni dépôt frère sous FORGE_ROOT ou sous le parent du pilot) ; aucun oracle joué, aucun cas compté");
  process.exit(0);
}
if (!socleDePage().assets) {
  console.log("generer-todo-produit (TF-2212) : SKIP déclaré — socle digit-ai-page-html introuvable ; aucun oracle joué, aucun cas compté");
  process.exit(0);
}

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const dossier = mkdtempSync(join(tmpdir(), "todo-produit-"));
/** Une source témoin : le gabarit instancié (titre, date), avec une décision attendue et un écart assumé. */
function source(nom, transformer = (t) => t) {
  const d = join(dossier, nom, "docs", "projet");
  mkdirSync(d, { recursive: true });
  const f = join(d, "TODO-PRODUIT.md");
  writeFileSync(f, transformer(readFileSync(GABARIT, "utf8")), "utf8");
  return f;
}
const generer = (f) => spawnSync(process.execPath, [GENERATEUR, f], { encoding: "utf8" });
const html = (f) => readFileSync(join(dirname(f), "TODO-PRODUIT.html"), "utf8");

/** Joue le point d'entrée des oracles design ; `rendu` ajoute le rendu clair et sombre. */
function juger(fichier, rendu) {
  const r = spawnSync(process.execPath, [join(racine, "oracles", "run-oracles-design.mjs"), fichier, "--json-only", ...(rendu ? ["--rendu"] : [])],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 400000 });
  try { return JSON.parse((r.stdout || "").trim()); } catch { return null; }
}
const durs = (j, prefixe) => (j?.oracles || []).filter((o) => o.oracle.startsWith(prefixe))
  .flatMap((o) => (o.findings || []).filter((f) => f.sev === "bloquant" || f.sev === "majeur").map((f) => `${o.oracle}:${f.regle}`));
const verdict = (j, prefixe) => (j?.oracles || []).filter((o) => o.oracle.startsWith(prefixe)).map((o) => o.verdict);

try {
  const f = source("vert", (t) => t.replace("verifie_le: {AAAA-MM-JJ}", "verifie_le: 2026-11-06").replace("{Produit}", "Produit-00"));
  const g = generer(f);
  check("le générateur écrit la page et dit ses compteurs (exit 0)", () => {
    att(g.status === 0, `exit ${g.status} : ${g.stderr}`);
    att(/TODO-PRODUIT\.html générée/.test(g.stdout), g.stdout);
  });
  const page = g.status === 0 ? html(f) : "";
  const j = juger(join(dirname(f), "TODO-PRODUIT.html"), false);
  check("VERT TF-2212 — la page passe oracle-slop, oracle-tokens et oracle-bascule, sans écart dur (analyse statique)", () => {
    att(j, "run-oracles-design n'a rendu aucun JSON lisible");
    for (const o of ["oracle-slop", "oracle-tokens", "oracle-bascule"]) {
      att(verdict(j, o).every((v) => v === "PASS") && verdict(j, o).length, `${o} : ${verdict(j, o).join(",") || "absent"}`);
      att(!durs(j, o).length, `${o} : ${durs(j, o).join(", ")}`);
    }
    att(j.verdict === "PASS", `verdict agrégé ${j.verdict}`);
  });
  const jr = juger(join(dirname(f), "TODO-PRODUIT.html"), true);
  const rendus = (jr?.oracles || []).filter((o) => o.oracle.startsWith("render_page"));
  const rendu_joue = rendus.length === 2 && rendus.every((o) => o.verdict !== "SKIP");
  if (rendu_joue) check("VERT TF-2212 — le rendu clair et sombre passe render_page (V1, V18, contraste), sans écart dur", () => {
    att(rendus.every((o) => o.verdict === "PASS"), rendus.map((o) => `${o.oracle} ${o.verdict} ${durs(jr, o.oracle).slice(0, 4).join(",")}`).join(" ; "));
  });
  else console.log("  [SAUTÉ] TF-2212 — moteur de rendu absent du poste (render_page SKIP) : V1 et V18 ne sont pas jouées ici");
  check("VERT TF-2212 — la page garde son sceau de source, sa bascule câblée et aucune surface de saisie", () => {
    att(/Sceau source <code>[0-9a-f]{12}<\/code>/.test(page), "sceau de source absent");
    att(page.includes('id="theme-toggle"') && /localStorage\.setItem\('digitai-theme'/.test(page), "bascule non câblée");
    att(!/<(textarea|form)\b/i.test(page), "surface de saisie dans une page en lecture seule");
  });
  check("VERT TF-2212 — les quatre compteurs sont dits en texte, avec leur valeur", () => {
    att(/Décisions attendues : <strong>\d+<\/strong>/.test(page) && /Écarts assumés : <strong>\d+<\/strong>/.test(page), "compteurs absents");
  });
  check("VERT TF-2212 — le gabarit non instancié se rend aussi, accolades visibles (R-20 juge sa projection dès l'ouverture)", () => {
    const brut = source("brut");
    const r = generer(brut);
    att(r.status === 0, `exit ${r.status} : ${r.stderr}`);
    att(/&#123;Produit&#125;/.test(html(brut)), "le marqueur {Produit} n'est pas rendu en entités");
    att(!/[]/.test(html(brut)), "caractère d'usage privé resté dans la page");
  });
  check("VERT TF-2212 — même source, même page à l'octet près", () => {
    const avant = html(f);
    generer(f);
    att(html(f) === avant, "la page change entre deux générations");
  });
  // ROUGE : les déclarations d'avant le remède, réinjectées dans la page, sont refusées par S1 et T3.
  const mute = (h, ancien) => (page.includes("</head>") ? h.replace("</head>", `<style>${ancien}</style></head>`) : h);
  const rouge = (nom, css, oracle, regle) => check(`ROUGE TF-2212 — ${nom} : ${oracle} dénonce ${regle}`, () => {
    const m = join(dossier, `rouge-${regle}.html`);
    writeFileSync(m, mute(page, css), "utf8");
    const jm = juger(m, false);
    att(jm, "aucun JSON lisible");
    att(durs(jm, oracle).some((x) => x.endsWith(`:${regle}`)), `${regle} non dénoncée (vu : ${durs(jm, oracle).join(", ") || "rien"})`);
  });
  rouge("bandeau latéral de 3 px sur la citation (avant le remède)", "blockquote{margin:14px 0;padding:10px 16px;border-left:3px solid var(--blue)}", "oracle-slop", "S1");
  rouge("espacement hors échelle de 4 pt sur les tuiles (avant le remède)", ".kpi{padding:14px 16px}", "oracle-tokens", "T3");
} finally {
  rmSync(dossier, { recursive: true, force: true, maxRetries: 5 });
}

console.log(`\ngenerer-todo-produit (TF-2212) : ${pass} PASS, ${fail} FAIL — page jugée par run-oracles-design.mjs (analyse statique, rendu clair et sombre quand le poste le permet), ses déclarations d'avant le remède refusées par S1 et T3`);
process.exit(fail ? 1 : 0);
