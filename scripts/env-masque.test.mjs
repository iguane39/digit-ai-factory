#!/usr/bin/env node
/**
 * env-masque.test.mjs — recette de `env-masque.mjs`, la voie que propose le refus de
 * `oracles\hook-fichiers-env.mjs` (D-106 (b), 29/10/2026).
 *
 * Sens vert : le script rend les clés et chaque valeur masquée (`********`, `<vide>` pour une valeur vide), et
 * la liste des seules clés avec `--cles`. Sens rouge : AUCUNE valeur (ni celle d'une affectation, ni celle d'une
 * clé commentée, ni le texte d'un commentaire libre, ni la ligne d'une valeur sur plusieurs lignes) n'apparaît
 * sur la sortie standard ni sur la sortie d'erreur ; un fichier absent est refusé sans citer de contenu ; un
 * usage faux est refusé. Les fixtures sont FICTIVES, écrites dans un dossier temporaire du poste : aucun vrai
 * `.env` n'est lu. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { masquer } from "./env-masque.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "env-masque.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// Des valeurs FICTIVES, reconnaissables : si l'une d'elles sort, le script a fui.
const VALEURS = ["sk-fictif-0123456789", "hunter2-fictif", "motdepasse-fictif", "tok-fictif-abc",
  "ligne-secrete-fictive", "valeur-apres-egal-fictive", "cle-sans-espace-fictive"];
const FIXTURE = [
  "# Configuration fictive du produit d'essai",
  `# note libre : l'ancien mot de passe était ${VALEURS[1]}`,
  `API_KEY=${VALEURS[0]}`,
  `export TOKEN="${VALEURS[3]}"`,
  `# DB_PASS=${VALEURS[2]}`,
  "VIDE=",
  "",
  `CLE_SANS_ESPACE=${VALEURS[6]}`,
  `AVEC_ESPACES = ${VALEURS[5]}`,
  `CERT="-----BEGIN FICTIF-----`,
  VALEURS[4],
  `-----END FICTIF-----"`,
].join("\r\n") + "\r\n";

const dossier = mkdtempSync(join(tmpdir(), "env-masque-"));
const fichier = join(dossier, ".env");
writeFileSync(fichier, FIXTURE, "utf8");
const jouer = (...args) => { const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" }); return { code: r.status, out: r.stdout || "", err: r.stderr || "" }; };

try {
  check("vert — masque : les clés sont rendues, chaque valeur devient ********", () => {
    const r = jouer(fichier);
    if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.err}`);
    for (const attendu of ["API_KEY=********", "TOKEN=********", "CLE_SANS_ESPACE=********", "AVEC_ESPACES=********", "CERT=********"]) {
      if (!r.out.split("\n").includes(attendu)) throw new Error(`ligne absente « ${attendu} » :\n${r.out}`);
    }
  });
  check("vert — une valeur vide se dit <vide> (savoir qu'une clé n'est pas renseignée n'est pas un secret)", () => {
    if (!jouer(fichier).out.split("\n").includes("VIDE=<vide>")) throw new Error(jouer(fichier).out);
  });
  check("vert — une clé commentée est masquée comme une clé active ; un commentaire libre devient « # … »", () => {
    const l = jouer(fichier).out.split("\n");
    if (!l.includes("# DB_PASS=********")) throw new Error(`clé commentée non masquée proprement :\n${l.join("\n")}`);
    if (l.filter((x) => x === "# …").length !== 2) throw new Error(`commentaires libres attendus à « # … » :\n${l.join("\n")}`);
  });
  check("vert — --cles : la liste des seules clés actives, sans la clé commentée, dans l'ordre du fichier", () => {
    const r = jouer(fichier, "--cles");
    const attendu = "API_KEY\nTOKEN\nVIDE\nCLE_SANS_ESPACE\nAVEC_ESPACES\nCERT\n";
    if (r.code !== 0 || r.out !== attendu) throw new Error(`exit ${r.code}, sortie :\n${r.out}`);
  });
  check("vert — l'option --cles se place avant ou après le fichier", () => {
    if (jouer("--cles", fichier).out !== jouer(fichier, "--cles").out) throw new Error("sorties différentes");
  });
  check("vert — masquer() est pur : même contenu, même sortie, fins de ligne Windows et BOM admis", () => {
    const a = masquer("﻿A=1\r\nB=2\r\n"), b = masquer("A=1\nB=2\n");
    if (a !== b || a !== "A=********\nB=********\n") throw new Error(JSON.stringify([a, b]));
  });

  // Rouge : aucune valeur ne sort, par aucune voie.
  for (const valeur of VALEURS) {
    check(`rouge — la valeur fictive « ${valeur} » ne sort ni en masque, ni avec --cles, ni sur la sortie d'erreur`, () => {
      for (const args of [[fichier], [fichier, "--cles"]]) {
        const r = jouer(...args);
        if (r.out.includes(valeur) || r.err.includes(valeur)) throw new Error(`fuite avec ${args.slice(1).join(" ") || "le masque"} : ${r.out}${r.err}`);
      }
    });
  }
  check("rouge — la longueur d'une valeur ne se devine pas : deux valeurs de longueurs différentes, même rendu", () => {
    if (masquer("A=x\n") !== masquer("A=une-valeur-tres-longue-et-fictive\n")) throw new Error("rendus différents");
  });
  check("rouge — une ligne qui n'est pas une affectation n'est pas citée : « <ligne non reconnue> »", () => {
    const r = masquer("texte-fictif-brut sans egal\n");
    if (r !== "<ligne non reconnue>\n") throw new Error(r);
  });
  check("rouge — fichier absent : refusé (exit 1), le message cite le chemin donné et rien d'autre", () => {
    const r = jouer(join(dossier, "absent.env"));
    if (r.code !== 1 || !/fichier illisible/.test(r.err) || r.out !== "") throw new Error(`exit ${r.code} ${r.err} ${r.out}`);
  });
  check("rouge — sans fichier, ou avec deux fichiers, ou une option inconnue : refusé (exit 1) avec l'usage", () => {
    for (const args of [[], [fichier, fichier], [fichier, "--tout"]]) {
      const r = jouer(...args);
      if (r.code !== 1 || !/usage/.test(r.err) || r.out !== "") throw new Error(`${args.join(" ")} : exit ${r.code} ${r.err}`);
    }
  });
} finally { rmSync(dossier, { recursive: true, force: true }); }

console.log(`\nenv-masque : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
