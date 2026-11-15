#!/usr/bin/env node
/**
 * sessions-actives.test.mjs — recette de la commande qui montre au porteur les sessions d'un produit (D-218 (b), item I5 du mandat
 * 20261114n, 15/11/2026). Joué par oracles/self-tests.mjs (I2).
 *
 * Un produit jetable porte un registre `forge/sessions.jsonl` de quatre sessions : deux vivantes (la plus ancienne coordonne), une
 * expirée sans fermeture, une fermée. Vert : le tableau et le JSON montrent les trois premières, avec leur état, leur rôle, leur objet et
 * leurs chemins ; rouge : la session fermée n'y est pas, et l'expirée n'est jamais dite vivante. Puis les bords : registre absent,
 * dossier hors d'un produit, option inconnue.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ligneClose, ligneObjet, ligneOpen, ligneRevendique, ligneVie } from "../oracles/lib-sessions.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "sessions-actives.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const T = mkdtempSync(join(tmpdir(), "sessions-actives-"));
const lancer = (...args) => { const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" }); return { code: r.status, out: r.stdout, err: r.stderr }; };

try {
  const MIN = 60_000, m = Date.now();
  const A = "aaaa1111-0000-4000-8000-000000000001", B = "bbbb2222-0000-4000-8000-000000000002";
  const C = "cccc3333-0000-4000-8000-000000000003", D = "dddd4444-0000-4000-8000-000000000004";
  const p = join(T, "produit");
  mkdirSync(join(p, "forge"), { recursive: true });
  const lignes = [
    ligneOpen({ session: A, racine: p }, m - 10 * MIN), ligneObjet({ session: A, objet: "Refondre la page d'accueil | et le pied de page" }, m - 10 * MIN + 1000),
    ligneRevendique({ session: A, role: "coordinatrice" }, m - 10 * MIN + 2000), ligneRevendique({ session: A, chemin: "site/index.html" }, m - 8 * MIN),
    ligneOpen({ session: B, racine: p }, m - 5 * MIN), ligneObjet({ session: B, objet: "Corriger le formulaire de contact" }, m - 5 * MIN + 1000),
    ligneRevendique({ session: B, chemin: "site/index.html" }, m - 2 * MIN), ligneRevendique({ session: B, chemin: "app/contact.py" }, m - MIN),
    ligneOpen({ session: C, racine: p }, m - 60 * MIN), ligneObjet({ session: C, objet: "Audit des liens" }, m - 60 * MIN + 1000), ligneVie({ session: C }, m - 40 * MIN),
    ligneOpen({ session: D, racine: p }, m - 30 * MIN), ligneObjet({ session: D, objet: "Session close" }, m - 30 * MIN + 1000), ligneClose({ session: D, raison: "prompt_input_exit" }, m - 20 * MIN),
  ];
  writeFileSync(join(p, "forge", "sessions.jsonl"), lignes.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");

  const j = lancer("--produit", p, "--json");
  let e = null; try { e = JSON.parse(j.out); } catch { /* le cas le dit */ }
  check("I5 vert — le JSON rend les sessions vivantes puis expirées, avec état, rôle, objet et chemins revendiqués", () => {
    att(j.code === 0 && e, `exit ${j.code} ${j.err}`);
    att(e.sessions.map((s) => `${s.court}:${s.etat}:${s.role || "-"}`).join() === "aaaa1111:vivante:coordinatrice,bbbb2222:vivante:-,cccc3333:expirée:-", e.sessions.map((s) => `${s.court}:${s.etat}`).join());
    att(e.coordinatrice === A && e.sessions[1].chemins.join() === "site/index.html,app/contact.py" && e.sessions[0].objet.startsWith("Refondre"), JSON.stringify(e.sessions[1]));
    att(e.conflits.length === 1 && e.conflits[0].chemin === "site/index.html" && e.fermees === 1, JSON.stringify(e.conflits));
  });
  check("I5 rouge — la session fermée n'est pas montrée, et l'expirée n'est jamais dite vivante", () => {
    att(e && !e.sessions.some((s) => s.session === D) && e.sessions.find((s) => s.session === C)?.etat === "expirée", JSON.stringify(e?.sessions?.map((s) => [s.court, s.etat])));
  });
  const t = lancer("--produit", join(p, "forge"));
  check("I5 vert — le tableau porte les mêmes sessions que le JSON, une colonne par champ, une barre verticale d'objet échappée, la fermée comptée", () => {
    att(t.code === 0, `exit ${t.code} ${t.err}`);
    att(/^\| Session \| État \| Depuis \| Rôle \| Objet \| Chemins revendiqués \|$/m.test(t.out), t.out.slice(0, 200));
    const rangs = t.out.split("\n").filter((l) => /^\| [a-z0-9]{8} \|/.test(l));
    att(rangs.length === 3 && /^\| aaaa1111 \| vivante \| \d\d:\d\d \| coordinatrice \| Refondre la page d'accueil \\\| et le pied de page \| site\/index\.html \|$/.test(rangs[0]), rangs.join("\n"));
    att(/^\| cccc3333 \| expirée \(dernière preuve de vie il y a 40 min\)/.test(rangs[2]), rangs[2]);
    att(/Coordinatrice : aaaa1111/.test(t.out) && /Conflits : site\/index\.html tenu par aaaa1111 et bbbb2222/.test(t.out) && /1 session\(s\) fermée\(s\) non montrée\(s\)/.test(t.out), t.out);
  });
  check("I5 — registre absent : exit 0 et « aucune session inscrite » ; dossier hors d'un produit, ou option inconnue : exit 2", () => {
    const vide = join(T, "produit-vide"); mkdirSync(join(vide, "forge"), { recursive: true });
    const r = lancer("--produit", vide);
    att(r.code === 0 && /Aucune session inscrite/.test(r.out), `${r.code} ${r.out}`);
    const rj = lancer("--produit", vide, "--json");
    att(rj.code === 0 && JSON.parse(rj.out).sessions.length === 0 && JSON.parse(rj.out).existe === false, rj.out);
    const hors = join(T, "pas-un-produit"); mkdirSync(hors, { recursive: true });
    const h = lancer("--produit", hors);
    att(h.code === 2 && /n'est pas un produit/.test(h.err), `${h.code} ${h.err}`);
    const o = lancer("--produit", p, "--toutes");
    att(o.code === 2 && /option inconnue/.test(o.err), `${o.code} ${o.err}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(T, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nsessions-actives (D-218 (b), I5) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
