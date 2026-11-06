#!/usr/bin/env node
/**
 * lib-filtre-cas.test.mjs — recette à double sens du filtre de cas des recettes (TF-2256, 06/11/2026).
 *
 * Ce que la recette prouve, dans les deux sens :
 *   · VERT — une sélection lisible restreint la recette aux tranches nommées, sans toucher les autres ; sans
 *     sélection, tout se joue ; la ligne finale d'une recette filtrée dit qu'elle est PARTIELLE ;
 *   · ROUGE — une sélection illisible ou qui nomme un numéro qu'aucune tranche ne porte rend exit 2 (jamais un vert
 *     sur zéro cas) ; une tranche en échec rend exit 1 ; la ligne partielle ne ressemble pas à un total (« N/N »,
 *     « PASS »), que le cliquet du nombre de cas lirait comme un compte complet.
 * Puis deux recettes réelles, jouées filtrées : `hook-restitution.test` sur son cas 9 (quelques secondes au lieu de
 * 6 min 34 s mesurées le 06/11/2026) et sur un numéro absent ; `hook-ouverture.test` sur un numéro absent.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyserSelection, creerFiltre, conclureFiltre } from "./lib-filtre-cas.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const echecs = [];
let n = 0;
const ok = (cond, msg) => { n += 1; if (!cond) echecs.push(msg); };
const liste = (s) => (s ? [...s].sort((a, b) => a - b).join(",") : null);

// ── analyserSelection ──
ok(liste(analyserSelection("66").numeros) === "66", "« 66 » doit donner {66}");
ok(liste(analyserSelection("65,66").numeros) === "65,66", "« 65,66 » doit donner {65,66}");
ok(liste(analyserSelection("65 66;67").numeros) === "65,66,67", "espaces et point-virgule doivent séparer");
ok(liste(analyserSelection("60-62").numeros) === "60,61,62", "« 60-62 » doit donner la plage");
ok(liste(analyserSelection("S93").numeros) === "93", "« S93 » doit donner {93} (préfixe de lettres ignoré)");
ok(liste(analyserSelection("TF-2214").numeros) === "2214", "« TF-2214 » doit donner {2214}");
ok(liste(analyserSelection("S93-95").numeros) === "93,94,95", "« S93-95 » doit donner la plage 93 à 95");
ok(analyserSelection("").numeros === null && analyserSelection(undefined).numeros === null && analyserSelection("   ").numeros === null,
  "aucune sélection (vide, absente, blanche) doit donner null, jamais un ensemble vide");
for (const mauvais of ["abc", "9-3", "1-99999", "66a", "66,x"]) {
  ok(analyserSelection(mauvais).invalides.length > 0, `« ${mauvais} » doit être rendu illisible`);
}

// ── creerFiltre : sans sélection, tout se joue ──
{
  const f = creerFiltre("X", {});
  ok(!f.actif && f.veut(1) && f.veut(2, 3) && f.voudrait(9), "sans variable, toute tranche doit se jouer");
  const b = f.bilan();
  ok(!b.actif && !b.partielle && b.erreur === null, "sans variable, le bilan ne doit rien dire d'un filtre");
}
// ── avec une sélection valide ──
{
  const f = creerFiltre("X", { X: "2,5" });
  const joue = [f.veut(1), f.veut(2), f.veut(3, 5), f.veut(4)];
  ok(joue.join() === "false,true,true,false", `seules les tranches 2 et 3/5 doivent se jouer, obtenu ${joue.join()}`);
  ok(f.voudrait(5) === true && f.voudrait(1) === false, "voudrait() doit répondre sans compter une tranche");
  const b = f.bilan();
  ok(b.partielle && b.erreur === null && b.tranches === 4 && b.jouees === 2, `bilan partiel attendu (4 tranches, 2 jouées), obtenu ${JSON.stringify(b)}`);
  const c = conclureFiltre("recette", f, []);
  ok(c.code === 0 && /PARTIELLE/.test(c.ligne), "une recette filtrée sans échec doit rendre exit 0 et se dire PARTIELLE");
  ok(!/\d+\s*\/\s*\d+/.test(c.ligne) && !/\bPASS\b/.test(c.ligne), `la ligne partielle ne doit ressembler ni à un total N/N ni à un PASS : ${c.ligne}`);
  const e = conclureFiltre("recette", f, ["cas 2 : attendu block"]);
  ok(e.code === 1 && /cas 2/.test(e.ligne), "un échec dans une tranche jouée doit rendre exit 1 et le nommer");
}
// ── ROUGE : numéro absent, sélection illisible ──
{
  const f = creerFiltre("X", { X: "2,77" });
  f.veut(1); f.veut(2);
  const c = conclureFiltre("recette", f, []);
  ok(c.code === 2 && /77/.test(c.ligne) && /Numéros connus : 1 2/.test(c.ligne), `un numéro sans tranche (77) doit rendre exit 2 et nommer les numéros connus, obtenu ${c.code} ${c.ligne}`);
  const g = creerFiltre("X", { X: "abc" });
  ok(g.veut(1) === false && g.voudrait(1) === false, "une sélection illisible ne doit jouer aucune tranche");
  const d = conclureFiltre("recette", g, []);
  ok(d.code === 2 && /illisible/.test(d.ligne), "une sélection illisible doit rendre exit 2");
}

// ── recettes réelles, jouées filtrées ──
const jouer = (fichier, variable, valeur) => {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [join(ICI, fichier)], { encoding: "utf8", env: { ...process.env, [variable]: valeur }, timeout: 170000 });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), s: (Date.now() - t0) / 1000 };
};
{
  const r = jouer("hook-restitution.test.mjs", "FORGE_CAS_RESTITUTION", "9");
  ok(r.code === 0 && /recette PARTIELLE — 1 tranche\(s\) jouée\(s\) sur \d+/.test(r.sortie), `hook-restitution.test filtré sur le cas 9 : attendu exit 0 et 1 tranche jouée, obtenu ${r.code} ${r.sortie.slice(0, 200)}`);
  ok(r.s < 120, `hook-restitution.test filtré sur le cas 9 doit se jouer en moins de 120 s (6 min 34 s sans filtre), mesuré ${r.s} s`);
  const a = jouer("hook-restitution.test.mjs", "FORGE_CAS_RESTITUTION", "99999");
  ok(a.code === 2 && /FILTRE INVALIDE/.test(a.sortie) && /99999/.test(a.sortie), `hook-restitution.test sur un numéro absent : attendu exit 2 et FILTRE INVALIDE, obtenu ${a.code} ${a.sortie.slice(0, 200)}`);
  const o = jouer("hook-ouverture.test.mjs", "FORGE_CAS_OUVERTURE", "99999");
  ok(o.code === 2 && /FILTRE INVALIDE/.test(o.sortie), `hook-ouverture.test sur un numéro absent : attendu exit 2 et FILTRE INVALIDE, obtenu ${o.code} ${o.sortie.slice(0, 200)}`);
}

if (echecs.length) { console.error("lib-filtre-cas : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log(`lib-filtre-cas : ${n}/${n} PASS — le filtre de cas des recettes (TF-2256) se lit dans ses formes, restreint aux tranches nommées, et dans les deux sens : les cas rouges (un numéro sans tranche, une sélection illisible) doivent échouer et échouent, dit PARTIELLE sans jamais ressembler à un total ; hook-restitution.test filtré sur le cas 9, hook-ouverture.test sur un numéro absent`);
