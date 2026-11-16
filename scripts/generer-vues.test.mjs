#!/usr/bin/env node
/**
 * generer-vues.test.mjs — LES VUES DE docs\projet QUE LE PILOT GÉNÈRE PASSENT LES CONTRÔLES DU SOCLE
 * QU'IL IMPOSE AUX PRODUITS (TF-2665 et TF-2626, 16/11/2026).
 *
 * ============================================================================================
 * LE FAIT
 * ============================================================================================
 *
 * Deux retours de produits, à trois jours d'écart. Le 12/11/2026, `ARCHITECTURE.html`, régénérée par
 * `generer-architecture.mjs`, rendait FAIL à `render_page.py` dans les deux thèmes : à 390 px le bouton de
 * bascule portait la page à 418 px (V1), 19 flèches du schéma traversaient une boîte (V4) et 18 éléments
 * étaient exemptés en bloc. Le 13/11/2026, `ARCHITECTURE.html` et `MODELE-DONNEES.html` rendaient FAIL à
 * `check_html.py` : L25 (page de plus de trois chapitres sans sommaire) et L3 (valeurs codées sans légende).
 * Le produit ne peut corriger aucune des deux pages : ses règles interdisent d'éditer une vue générée. Le
 * pilot imposait donc à ses produits des contrôles que ses propres pages échouaient, et son recueil de
 * tests ne jouait ni l'un ni l'autre sur ces deux générateurs (classe
 * `fixture-jugee-par-son-seul-oracle` : le banc de coquille juge la vue SANS `--rendu`, sans `check_html.py`).
 *
 * ============================================================================================
 * CE QUE CE BANC TIENT, DANS LES DEUX SENS
 * ============================================================================================
 *
 * SENS VERT : une source de vue qui porte ses chapeaux (L7 — ils s'écrivent, jamais ne se génèrent) rend,
 * par les deux générateurs réels, une page que `check_html.py` accepte, et la vue d'architecture passe
 * `render_page.py` aux deux thèmes et à trois largeurs.
 * SENS ROUGE : la MÊME page privée de son sommaire échoue L25 ; la même page dont on retire la légende
 * d'un jeton codé échoue L3 ; la même vue à qui l'on ajoute une flèche droite qui traverse une boîte
 * échoue V4. Un banc qui n'a jamais vu son contrôle échouer ne prouve rien.
 *
 * SKIP DÉCLARÉ, JAMAIS UN VERT DE COMPLAISANCE : sans python, sans `check_html.py`, sans `render_page.py` ou
 * sans moteur de rendu (playwright), la part concernée se déclare NON JOUÉE, motivée, et ne compte ni pour
 * ni contre ; les autres cas jugent normalement. Durée : une minute et demie à deux minutes, trois
 * rendus par navigateur.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt est joué).
 */
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { svgBoites } from "./lib-vue-html.mjs";
import { cheminSkillsInstalles } from "./lib-config-installee.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const casse = [];
const nonJoue = [];
let nbCas = 0;
const cas = (nom, fn) => {
  nbCas += 1;
  try { fn(); } catch (e) { casse.push(`${nom} — ${e.message}`); }
};
const ok = (cond, msg) => { if (!cond) throw new Error(msg); };

// ── les contrôles du socle : installés d'abord, puis la source du dépôt frère ─────────────────────
const sousSocle = (script) => [
  join(cheminSkillsInstalles(), "digit-ai-page-html", "scripts", script),
  join(ICI, "..", "..", "digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", script),
].find(existsSync) || null;
const CHECK_HTML = sousSocle("check_html.py");
const RENDER_PAGE = sousSocle("render_page.py");
const PYTHON = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});
const moteurDeRenduAbsent = (stderr) => /playwright non install|Executable doesn't exist|playwright install/i.test(String(stderr || ""));

// ── deux sources de vue CONFORMES : chapeaux écrits, tables de moins de huit lignes ───────────────
const SOURCE_ARCHITECTURE = `---
role: architecture technique de la fixture du banc
destinataire: humain
sources_de_verite: ["fixture du banc des vues"]
verifie_le: 2026-11-16
---

# Architecture — Fixture

## Vue d'ensemble

> Ce chapitre dit qui parle à qui dans la fixture et où vivent ses données.

Trois composants s'appellent dans un seul sens, de l'écran vers le stockage.

## Composant : front

> Ce chapitre décrit le composant front, ce qu'il montre et ce qu'il appelle.

- role: afficher les pages au lecteur
- techno: React 18
- expose: pages du site
- etat: sans état

## Composant : api

> Ce chapitre décrit le composant api, le seul qui parle au stockage.

- role: servir les données au front
- techno: FastAPI
- expose: routes de lecture
- etat: sans état

## Composant : bdd

> Ce chapitre décrit le composant bdd, où vivent les données de la fixture.

- role: conserver les données
- techno: PostgreSQL 16
- expose: requêtes depuis l'api seulement
- etat: porte toutes les données

## Flux

> Ce chapitre liste les flux entre les trois composants, un par ligne de la table.

| De | Vers | Protocole | Donnée portée |
|---|---|---|---|
| front | api | HTTP | requêtes de lecture |
| api | bdd | SQL | lecture des objets |
| front | bdd | SQL | export direct, voulu pour la fixture |
| api | front | HTTP | réponses de lecture |
`;

const SOURCE_MODELE = `---
role: modèle de données de la fixture du banc
destinataire: humain
sources_de_verite: ["fixture du banc des vues"]
verifie_le: 2026-11-16
---

# Modèle de données — Fixture

## Persistance

> Ce chapitre dit où les données de la fixture sont stockées et qui les écrit.

Le stockage est une base relationnelle écrite par l'api seulement.

## Table : commande

> Ce chapitre décrit la table commande, ses colonnes et ses liens sortants.

| Colonne | Type | Rôle |
|---|---|---|
| id | entier | identifiant de la commande |
| statut | texte | état courant de la commande |
| client_id | entier | client qui a passé la commande |

Liens sortants :

| Colonne | Cible | Cardinalité |
|---|---|---|
| client_id | client.id | plusieurs vers un |

## Table : client

> Ce chapitre décrit la table client et les commandes qui s'y rattachent.

| Colonne | Type | Rôle |
|---|---|---|
| id | entier | identifiant du client |
| nom | texte | nom affiché du client |

## États d'une commande

> Ce chapitre donne les valeurs que prend la colonne statut, dans l'ordre du cycle.

| Valeur | Moment |
|---|---|
| mise_en_service | ouverte |
| desactivee_par_operateur | fermée |
`;

const dossier = mkdtempSync(join(tmpdir(), "vues-"));
try {
  const generer = (script, source, nomSource, nomVue) => {
    writeFileSync(join(dossier, nomSource), source, "utf8");
    const r = spawnSync(process.execPath, [join(ICI, script), join(dossier, nomSource)], { encoding: "utf8" });
    if (r.status === 2 && /SOCLE ABSENT|introuvable/.test(r.stderr || "")) return { absent: (r.stderr || "").trim().slice(0, 200) };
    if (r.status !== 0) throw new Error(`${script} sort en ${r.status} : ${(r.stderr || "").slice(0, 200)}`);
    return { chemin: join(dossier, nomVue), html: readFileSync(join(dossier, nomVue), "utf8") };
  };
  const arch = generer("generer-architecture.mjs", SOURCE_ARCHITECTURE, "ARCHITECTURE.md", "ARCHITECTURE.html");
  const modele = generer("generer-modele-donnees.mjs", SOURCE_MODELE, "MODELE-DONNEES.md", "MODELE-DONNEES.html");

  if (arch.absent || modele.absent) {
    nonJoue.push(`les vues ne se génèrent pas sur ce poste : ${arch.absent || modele.absent} — aucun cas n'a tourné`);
  } else {
    /** Joue check_html.py : { verdict, bloquants: [lignes « x … »] } ou null si le contrôle n'existe pas ici. */
    const checkHtml = (html, nom) => {
      if (!CHECK_HTML || !PYTHON) return null;
      const f = join(dossier, nom);
      writeFileSync(f, html, "utf8");
      const r = spawnSync(PYTHON, ["-X", "utf8", CHECK_HTML, f], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
      const sortie = (r.stdout || "") + (r.stderr || "");
      return { verdict: (/^Verdict\s*:\s*(\w+)/m.exec(sortie) || [])[1] || "?", bloquants: sortie.split("\n").filter((l) => /^\s+x\s/.test(l)) };
    };
    if (!CHECK_HTML || !PYTHON) {
      nonJoue.push(`check_html.py : ${!PYTHON ? "aucun interpréteur python" : "introuvable (installé ou dépôt frère digit-ai-forge-agents)"} — les cas L25 et L3 n'ont PAS tourné`);
    } else {
      // Sens vert : les deux vues réelles, depuis des sources conformes.
      for (const [nom, vue] of [["vue d'architecture", arch], ["vue du modèle de données", modele]]) {
        cas(`VERT — la ${nom} passe check_html.py`, () => {
          const r = checkHtml(vue.html, `vert-${nom.length}.html`);
          ok(r.verdict === "PASS", `verdict ${r.verdict} — ${r.bloquants.slice(0, 3).map((x) => x.trim().slice(0, 140)).join(" | ")}`);
        });
      }
      // Sens rouge L25 : la même page sans son sommaire.
      cas("ROUGE — la vue d'architecture privée de son sommaire échoue L25 (au-delà de trois chapitres)", () => {
        const sans = arch.html.replace(/<nav class="toc colle"[\s\S]*?<\/nav>\s*/, "").replace(/<nav class="barre"[\s\S]*?<\/nav>\s*/, "");
        ok(sans !== arch.html, "la fixture ne mute rien : le sommaire est introuvable dans la vue");
        const r = checkHtml(sans, "rouge-sans-sommaire.html");
        ok(r.verdict === "FAIL" && r.bloquants.some((x) => /L25 page à \d+ chapitres sans sommaire/.test(x)), `verdict ${r.verdict} — ${r.bloquants.slice(0, 2).join(" | ").slice(0, 200)}`);
      });
      // Sens rouge L3 : la même page, une légende de jeton retirée.
      cas("ROUGE — la vue du modèle de données dont un jeton codé perd sa légende échoue L3", () => {
        ok(/title="valeur codée de « Valeur » : mise en service"/.test(modele.html), "la légende du jeton n'est pas posée par le générateur");
        const sans = modele.html.replace(/ title="valeur codée de « Valeur » : mise en service"/, "");
        const r = checkHtml(sans, "rouge-sans-legende.html");
        ok(r.verdict === "FAIL" && r.bloquants.some((x) => /L3 jeton codé sans légende : « mise_en_service »/.test(x)), `verdict ${r.verdict} — ${r.bloquants.slice(0, 2).join(" | ").slice(0, 200)}`);
      });
    }

    // ── le schéma : aucune exemption en bloc, aucune flèche à travers une boîte ───────────────────
    cas("le schéma n'exempte rien en bloc : plus de data-overlap-ok, chaque libellé se déclare étiquette de sa boîte", () => {
      ok(!/data-overlap-ok/.test(arch.html), "data-overlap-ok est encore posé");
      const rects = [...arch.html.matchAll(/<rect id="(boite-\d+)"/g)].map((m) => m[1]);
      const etiquettes = [...arch.html.matchAll(/data-etiquette-de="(boite-\d+)"/g)].map((m) => m[1]);
      ok(rects.length === 3 && etiquettes.length === 6 && etiquettes.every((e) => rects.includes(e)), `${rects.length} boîtes, ${etiquettes.length} étiquettes`);
    });
    cas("la flèche front → bdd, qui traversait la boîte api en ligne droite, est routée par un couloir", () => {
      const noeuds = [{ id: "front" }, { id: "api" }, { id: "bdd" }];
      const corps = svgBoites(noeuds, [{ de: "front", vers: "bdd" }]);
      ok(/<path d="M/.test(corps) && !/<line /.test(corps), "la flèche est restée droite");
      // le jugement géométrique, indépendant du générateur : aucun point du tracé dans une boîte étrangère
      const rects = [...corps.matchAll(/<rect id="boite-(\d)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
        .map((m) => ({ i: +m[1], x: +m[2], y: +m[3], w: +m[4], h: +m[5] }));
      const traverse = (pts, etrangeres) => {
        for (let k = 0; k + 1 < pts.length; k++) for (let t = 0; t <= 1; t += 0.01) {
          const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t;
          if (etrangeres.some((r) => x > r.x + 3 && x < r.x + r.w - 3 && y > r.y + 3 && y < r.y + r.h - 3)) return true;
        }
        return false;
      };
      const trace = [...(/<path d="([^"]+)"/.exec(corps)[1]).matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
      ok(rects.length === 3, "trois boîtes attendues");
      ok(!traverse(trace, [rects[1]]), "le tracé routé traverse la boîte api");
      // le même jugement sur la flèche droite d'AVANT le remède : il la refuse (le contrôle sait échouer)
      const centre = (r) => [r.x + r.w / 2, r.y + r.h / 2];
      ok(traverse([centre(rects[0]), centre(rects[2])], [rects[1]]), "le jugement géométrique ne refuse pas la flèche droite d'avant");
    });
    cas("un aller et un retour entre les mêmes boîtes courent en parallèle, jamais confondus", () => {
      const corps = svgBoites([{ id: "a" }, { id: "b" }], [{ de: "a", vers: "b" }, { de: "b", vers: "a" }]);
      const lignes = [...corps.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)].map((m) => m.slice(1).map(Number));
      ok(lignes.length === 2, `${lignes.length} lignes`);
      ok(Math.abs(lignes[0][1] - lignes[1][1]) >= 10, `écart vertical ${Math.abs(lignes[0][1] - lignes[1][1])} px : les deux flèches se confondent`);
    });
    cas("deux flèches routées qui empruntent le même couloir prennent des voies distinctes", () => {
      const noeuds = ["a", "b", "c", "d", "e", "f"].map((id) => ({ id }));
      const corps = svgBoites(noeuds, [{ de: "a", vers: "c" }, { de: "d", vers: "f" }, { de: "a", vers: "f" }]);
      const chemins = [...corps.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
      ok(chemins.length >= 2 && new Set(chemins).size === chemins.length, `${chemins.length} chemin(s), ${new Set(chemins).size} distinct(s)`);
    });

    // ── render_page.py : le critère de TF-2626, aux deux thèmes ───────────────────────────────────
    if (!RENDER_PAGE || !PYTHON) {
      nonJoue.push(`render_page.py : ${!PYTHON ? "aucun interpréteur python" : "introuvable"} — les cas de rendu n'ont PAS tourné`);
    } else {
      const rendre = (html, nom, theme) => {
        const f = join(dossier, nom);
        writeFileSync(f, html, "utf8");
        const r = spawnSync(PYTHON, ["-X", "utf8", RENDER_PAGE, f, "--widths", "390,768,1440", "--theme", theme, "--output", "json"],
          { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 170000 });
        let rapport = null;
        try { rapport = JSON.parse((r.stdout || "").trim()); } catch { /* traité par l'appelant */ }
        return { rapport, stderr: r.stderr || "" };
      };
      const bloquants = (rapport, regle) => Object.entries(rapport.breakpoints || {})
        .flatMap(([largeur, b]) => ((b.issues || {})[regle] || []).map((x) => `${largeur} px — ${x.what || ""} ${x.detail || ""}`.slice(0, 160)));
      let moteurAbsent = false;
      for (const theme of ["clair", "sombre"]) {
        const r = rendre(arch.html, `vue-${theme}.html`, theme);
        if (!r.rapport && moteurDeRenduAbsent(r.stderr)) { moteurAbsent = true; break; }
        cas(`VERT — la vue d'architecture passe render_page.py en thème ${theme} (V1 débordement, V4 chevauchement) à 390, 768 et 1440 px`, () => {
          ok(r.rapport, `aucun JSON lisible : ${r.stderr.split("\n")[0].slice(0, 160)}`);
          const defauts = [...bloquants(r.rapport, "v1_overflow"), ...bloquants(r.rapport, "v4_overlap")];
          ok(r.rapport.verdict === "PASS" && !defauts.length, `verdict ${r.rapport.verdict} — ${defauts.slice(0, 3).join(" | ")}`);
        });
      }
      if (moteurAbsent) nonJoue.push("render_page.py : le moteur de rendu (playwright et son navigateur) est absent de ce poste — les cas de rendu n'ont PAS tourné");
      else {
        // Sens rouge V4 : la même vue, avec la flèche droite d'AVANT le remède (front → bdd à travers api).
        cas("ROUGE — la vue à qui l'on rend la flèche droite qui traverse la boîte api échoue V4", () => {
          const m = [...arch.html.matchAll(/<rect id="boite-(\d)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
            .map((x) => ({ x: +x[2], y: +x[3], w: +x[4], h: +x[5] }));
          const centre = (r) => [r.x + r.w / 2, r.y + r.h / 2];
          const [x1, y1] = centre(m[0]), [x2, y2] = centre(m[2]);
          const fautive = arch.html.replace("<g>", `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748B" stroke-width="1.5" marker-end="url(#fl)"><title>front → bdd | droite</title></line>\n      <g>`);
          ok(fautive !== arch.html, "la fixture ne mute rien : aucun groupe de boîte trouvé");
          const r = rendre(fautive, "vue-fautive.html", "clair");
          ok(r.rapport, "aucun JSON lisible sur la vue fautive");
          ok(bloquants(r.rapport, "v4_overlap").some((x) => /TRAVERSE/.test(x)), `V4 ne refuse pas la flèche droite : ${JSON.stringify(bloquants(r.rapport, "v4_overlap")).slice(0, 200)}`);
        });
      }
    }
  }
} finally {
  rmSync(dossier, { recursive: true, force: true, maxRetries: 5 });
}

if (casse.length) {
  console.error("generer-vues (TF-2665, TF-2626) : FAIL\n  - " + casse.join("\n  - "));
  process.exit(1);
}
// Un poste sans python, sans socle ou sans moteur de rendu ne signe PAS un compte : le cliquet du harnais
// (TF-0681) lit « N PASS » et verrait une baisse. Le résumé nomme alors l'absence et ne porte aucun compte,
// comme le banc de coquille sans forge-design — la recette est rendue NON JUGÉE, jamais un échec ni un vert.
const preuve = "vues d'architecture et de modèle de données générées depuis des sources conformes, jugées par check_html.py "
  + "(L25 sommaire, L3 légende des jetons) et la vue d'architecture par render_page.py aux deux thèmes (V1, V4) ; chaque règle prouvée dans ses deux sens";
console.log(nonJoue.length
  ? `generer-vues (TF-2665, TF-2626) : ${nbCas} cas jugés verts sur ce poste, 0 échec — NON JOUÉ : ${nonJoue.join(" ; ")}`
  : `generer-vues (TF-2665, TF-2626) : ${nbCas} PASS, 0 FAIL — ${preuve}`);
