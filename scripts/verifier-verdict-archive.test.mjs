#!/usr/bin/env node
/**
 * verifier-verdict-archive.test.mjs — un verdict archivé périmé par une modification de sa cible
 * se voit (TF-1084, part pilot). Journaux `forge-ops/verdict@1` construits en dossier temporaire ;
 * l'empreinte de la fixture est calculée par la fonction partagée, comme forge-ops l'écrit.
 *
 * Rouges : cible fichier modifiée ; cible dossier avec un fichier ajouté ; cible disparue. Verts :
 * cible intacte ; fin de ligne seule changée (normalisation) ; empreinte brute d'avant le 25/08
 * (compatibilité) ; le DERNIER verdict fait foi. Bornes : verdict non scellé, aucun journal.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { empreinteFichier, empreinteBinaire } from "./lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-verdict-archive.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const ligne = (cible, fichiers, ts = "2026-09-15T10:00:00.000Z", verdict = "PASS") => JSON.stringify({
  format: "forge-ops/verdict@1", ts, cible, verdict, exit: verdict === "PASS" ? 0 : 1, regles: [], bloquants: 0, consultatifs: 0,
  empreinte: fichiers ? { format: "forge-ops/empreinte@1", release: cible, fichiers } : null,
});
const fixture = () => {
  const D = mkdtempSync(join(tmpdir(), "verdict-archive-"));
  const f = join(D, "page.md");
  writeFileSync(f, "# Page\nligne\n", "utf8");
  return { D, f };
};

check("vert — cible fichier intacte : FRAIS, exit 0", () => {
  const { D, f } = fixture();
  writeFileSync(join(D, ".ops-journal.jsonl"), ligne(f, { "page.md": empreinteFichier(f) }) + "\n");
  const r = lancer(D);
  if (r.code !== 0 || r.j.mesure.frais !== 1) throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});
check("rouge — cible fichier MODIFIÉE après le verdict : PÉRIMÉ, nommé, exit 1", () => {
  const { D, f } = fixture();
  writeFileSync(join(D, ".ops-journal.jsonl"), ligne(f, { "page.md": empreinteFichier(f) }) + "\n");
  writeFileSync(f, "# Page\nligne changée\n", "utf8");
  const r = lancer(D);
  if (r.code !== 1 || r.j.mesure.perimes !== 1 || !/PÉRIMÉ.*page\.md/.test(JSON.stringify(r.j.findings))) throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});
check("vert — seule la fin de ligne change (CRLF) : toujours FRAIS", () => {
  const { D, f } = fixture();
  writeFileSync(join(D, ".ops-journal.jsonl"), ligne(f, { "page.md": empreinteFichier(f) }) + "\n");
  writeFileSync(f, "# Page\r\nligne\r\n", "utf8");
  const r = lancer(D);
  if (r.code !== 0) throw new Error(`une fin de ligne périme le verdict : ${r.brut.slice(0, 300)}`);
  rmSync(D, { recursive: true, force: true });
});
check("vert — empreinte BRUTE d'avant le 25/08 sur un fichier CRLF : reconnue (compatibilité forge-ops)", () => {
  const { D, f } = fixture();
  writeFileSync(f, "# Page\r\nligne\r\n", "utf8");
  writeFileSync(join(D, ".ops-journal.jsonl"), ligne(f, { "page.md": empreinteBinaire(f) }) + "\n");
  const r = lancer(D);
  if (r.code !== 0) throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});
check("rouge — cible DOSSIER où un fichier est apparu : PÉRIMÉ, le fichier ajouté est nommé", () => {
  const D = mkdtempSync(join(tmpdir(), "verdict-archive-dir-"));
  const R = join(D, "release");
  mkdirSync(R);
  writeFileSync(join(R, "index.html"), "<p>a</p>\n", "utf8");
  writeFileSync(join(R, ".ops-journal.jsonl"), ligne(R, { "index.html": empreinteFichier(join(R, "index.html")) }) + "\n");
  writeFileSync(join(R, "nouveau.html"), "<p>b</p>\n", "utf8");
  const r = lancer(R);
  if (r.code !== 1 || !/ajouté\(s\) : nouveau\.html/.test(JSON.stringify(r.j.findings))) throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});
check("vert — le DERNIER verdict fait foi : un ancien verdict périmé suivi d'un verdict frais passe", () => {
  const { D, f } = fixture();
  writeFileSync(join(D, ".ops-journal.jsonl"),
    ligne(f, { "page.md": "0".repeat(64) }, "2026-09-14T10:00:00.000Z", "FAIL") + "\n" + ligne(f, { "page.md": empreinteFichier(f) }) + "\n");
  const r = lancer(D);
  if (r.code !== 0 || r.j.mesure.cibles !== 1) throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});
check("rouge — cible DISPARUE : signalée, jamais tenue pour fraîche", () => {
  const { D, f } = fixture();
  writeFileSync(join(D, ".ops-journal.jsonl"), ligne(join(D, "absente.md"), { "absente.md": "0".repeat(64) }) + "\n");
  const r = lancer(D);
  if (r.code !== 1 || r.j.mesure.cibles_absentes !== 1) throw new Error(r.brut.slice(0, 300));
  rmSync(D, { recursive: true, force: true });
});
check("borne — verdict NON SCELLÉ seul, puis aucun journal : rien à juger (exit 2), jamais un vert", () => {
  const { D, f } = fixture();
  writeFileSync(join(D, ".ops-journal.jsonl"), ligne(f, null) + "\n");
  const r1 = lancer(D);
  if (r1.code !== 2 || r1.j.mesure.non_scelles !== 1) throw new Error(r1.brut.slice(0, 300));
  const V = mkdtempSync(join(tmpdir(), "verdict-archive-vide-"));
  const r2 = lancer(V);
  if (r2.code !== 2) throw new Error(`aucun journal : exit ${r2.code}`);
  rmSync(D, { recursive: true, force: true }); rmSync(V, { recursive: true, force: true });
});

console.log(`\nverifier-verdict-archive (TF-1084) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
