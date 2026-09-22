#!/usr/bin/env node
/**
 * verifier-jugement.test.mjs — TF-0523 : un livrable modifié après jugement se voit.
 *
 * Le défaut, commis puis constaté le 23/08 : le même fichier de livrable écrasé QUATRE FOIS, à
 * indice inchangé, alors que la règle 5 dit « une nouvelle version = un nouveau fichier daté,
 * jamais d'écrasement ». Le même nom a désigné quatre contenus.
 *
 * L'aggravant est ce qui rend l'outil nécessaire plutôt que la règle suffisante : le même défaut
 * avait été signalé UNE HEURE PLUS TÔT sur un gabarit, et reproduit ensuite sur les livrables.
 * **Connaître la règle ne suffit pas ; une règle non câblée ne s'applique pas, y compris à celui
 * qui vient de la citer.**
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-jugement.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "jugement-"));
const LIVRABLE = join(T, "Client - Rapport - 20260823a.html");
const page = (v) => `<!doctype html><html lang="fr"><body><h1>${v}</h1></body></html>`;
const lancer = (...a) => {
  const r = spawnSync(process.execPath, [OUTIL, T, ...a], { encoding: "utf8" });
  let j = null;
  try { j = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
  return { code: r.status, j };
};

writeFileSync(LIVRABLE, page("v1"), "utf8");
writeFileSync(join(T, "README.md"), "# notice ordinaire\n", "utf8");

check("un livrable NON SCELLÉ est un état, pas un défaut — et il est déclaré", () => {
  const r = lancer();
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 — exiger un sceau sur tout l'existant ferait désactiver le contrôle`);
  if (r.j.mesure.non_scelles !== 1) throw new Error(`${r.j.mesure.non_scelles} non scellé(s), 1 attendu`);
});

check("un fichier HORS convention de nommage daté n'est pas jugé", () => {
  const r = lancer();
  // Le README est là depuis le début : s'il était compté, le total serait de 2.
  if (r.j.mesure.non_scelles !== 1) throw new Error("une notice ordinaire est comptée comme livrable — le bruit tuerait le contrôle");
});

check("`--sceller` pose l'empreinte, et le fichier inchangé passe ensuite", () => {
  const s = lancer("--sceller");
  if (s.j.verdict !== "SCELLE" || s.j.mesure.scelles !== 1) throw new Error(`sceau non posé : ${JSON.stringify(s.j.mesure)}`);
  if (!existsSync(LIVRABLE + ".jugement.json")) throw new Error("le sceau n'est pas écrit à côté du fichier");
  const r = lancer();
  if (r.code !== 0) throw new Error(`exit ${r.code} sur un fichier inchangé`);
  if (r.j.mesure.verifies !== 1) throw new Error("le fichier scellé n'est pas vérifié");
});

check("LE DÉFAUT D'ORIGINE : écrasé à indice INCHANGÉ → REFUS, avec les deux empreintes", () => {
  writeFileSync(LIVRABLE, page("v2"), "utf8");
  const r = lancer();
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  const t = JSON.stringify(r.j);
  if (!/indice INCHANG/.test(t)) throw new Error("le motif ne nomme pas l'indice inchangé");
  if (!/Le sceau porte .{12}…, le fichier porte/.test(t)) throw new Error("les deux empreintes ne sont pas citées — sans elles, on ne peut pas vérifier le verdict");
  if (!/règle 5/i.test(t)) throw new Error("le motif ne cite pas la règle qu'il applique");
});

check("le sceau porte SA DATE : un écart se situe dans le temps", () => {
  const j = JSON.parse(readFileSync(LIVRABLE + ".jugement.json", "utf8"));
  if (!/^\d{4}-\d{2}-\d{2}T/.test(j.scelle_le || "")) throw new Error("pas d'horodatage dans le sceau");
  if (j.format !== "pilot/jugement@1") throw new Error("format du sceau non déclaré — un format qui ne se nomme pas ne se fait pas relire");
});

check("un NOUVEL INDICE est exactement ce que la règle demande : il n'est pas mis en défaut", () => {
  // On remet le fichier `a` dans son état scellé, et on ajoute un `b` : seul `b` est non scellé.
  writeFileSync(LIVRABLE, page("v1"), "utf8");
  writeFileSync(join(T, "Client - Rapport - 20260823b.html"), page("v2"), "utf8");
  const r = lancer();
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 — renommer est la bonne pratique, pas un défaut`);
  if (r.j.mesure.non_scelles !== 1) throw new Error(`${r.j.mesure.non_scelles} non scellé(s), 1 attendu (le nouvel indice)`);
});

check("un sceau ILLISIBLE est signalé, pas ignoré", () => {
  writeFileSync(LIVRABLE + ".jugement.json", "{ pas du json", "utf8");
  const r = lancer();
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/sceau illisible/.test(JSON.stringify(r.j))) throw new Error("un sceau cassé passe inaperçu — c'est un sceau absent qui se croit présent");
});

// ---- TF-0692 (31/08/2026) — LE PDF ENTRE DANS LE CHAMP DU SCEAU ------------------------------
//
// LE FAIT : des familles de livrables déclarent DEUX formats, html et pdf, et le contrôle n'en
// jugeait qu'un. La moitié du jeu était hors de portée Y COMPRIS QUAND ELLE ÉTAIT SCELLÉE — donc
// une paire pouvait se désynchroniser en silence, et c'est la version imprimable qui est DIFFUSÉE.
//
// L'item recommandait un contrôle de cohérence de jeu, sans lire le PDF. La mesure a renversé ce
// choix : le sceau hache un BUFFER, sans encodage, donc rien n'exigeait que le contenu soit
// lisible et l'extension coûtait deux lignes. Le contenu employé ici n'est d'ailleurs PAS un vrai
// PDF, et c'est délibéré : en fabriquer un ferait croire que le format compte.
//
// DOSSIER PROPRE : ces cas vivent dans leur propre répertoire, sinon les fichiers ajoutés
// fausseraient les compteurs `non_scelles` des cas ci-dessus — un banc qui se marche dessus finit
// par être corrigé en affaiblissant ses assertions.
{
  const P = mkdtempSync(join(tmpdir(), "jugement-pdf-"));
  const PDF = join(P, "Client - Fiche securite - 20260831a.pdf");
  const jouerP = (...a) => {
    const r = spawnSync(process.execPath, [OUTIL, P, ...a], { encoding: "utf8" });
    let j = null;
    try { j = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
    return { code: r.status, j };
  };

  check("un PDF scellé puis laissé intact ne déclenche rien", () => {
    writeFileSync(PDF, Buffer.from("contenu initial du livrable imprimable"));
    const s = jouerP("--sceller");
    if (!existsSync(PDF + ".jugement.json")) throw new Error("le sceau n'est pas posé sur un PDF — l'extension ne sert à rien");
    if (s.j.mesure.scelles !== 1) throw new Error(`${s.j.mesure.scelles} scellé(s), 1 attendu`);
    const r = jouerP();
    if (r.code !== 0) throw new Error(`exit ${r.code} sur un PDF inchangé`);
  });

  check("LE CAS QUI RENDAIT PASS AVANT : PDF modifié à indice INCHANGÉ → REFUS", () => {
    writeFileSync(PDF, Buffer.from("contenu MODIFIE sans changer l'indice du nom"));
    const r = jouerP();
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un PDF hors champ passait pour conforme`);
    const t = JSON.stringify(r.j);
    if (!/indice INCHANG/.test(t)) throw new Error("le motif ne nomme pas l'indice inchangé");
    if (!/\.pdf/i.test(t)) throw new Error("le constat ne nomme pas le fichier PDF en cause");
  });

  check("un PDF hors convention de nommage daté reste NON JUGÉ", () => {
    writeFileSync(join(P, "notice.pdf"), Buffer.from("hors convention, jamais un livrable a indice"));
    const r = jouerP();
    if (/notice\.pdf/.test(JSON.stringify(r.j))) throw new Error("une notice ordinaire est jugée — le bruit tuerait le contrôle");
  });

  rmSync(P, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}


// ---- A-30 (TF-1303) : la forme qui ECRIT n est plus a un mot de celle qui MESURE -------------
// Le 22/09/2026, `--sceller` a ete lance a la place de la forme mesurante : 166 sceaux poses sur
// des livrables que personne n avait relus, et 30 ecarts reels qui auraient ete remplaces par 30
// verts sans trace. Les 4 cas ci-dessous tiennent les deux sens des 2 gardes qui en sont nes.
{
  const M = mkdtempSync(join(tmpdir(), "jugement-masse-"));
  const lancerM = (...a) => {
    const r = spawnSync(process.execPath, [OUTIL, M, ...a], { encoding: "utf8" });
    let j = null;
    try { j = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
    return { code: r.status, j };
  };
  const sceauDe = (n) => join(M, `Client - Rapport - 2026082${n}a.html.jugement.json`);
  for (const n of [1, 2, 3]) writeFileSync(join(M, `Client - Rapport - 2026082${n}a.html`), page(`v${n}`), "utf8");

  check("ROUGE — sceller PLUS D UN livrable sans le declarer est REFUSE, et rien n est ecrit", () => {
    const r = lancerM("--sceller");
    if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2 — un geste de masse passe sans se declarer`);
    if (r.j.verdict !== "REFUSE") throw new Error(`verdict ${r.j && r.j.verdict}`);
    for (const n of [1, 2, 3]) {
      if (existsSync(sceauDe(n))) throw new Error("un refus qui arrive APRES l ecriture n est pas un refus");
    }
  });

  check("VERT — le meme geste declare par --en-masse passe et ecrit", () => {
    const r = lancerM("--sceller", "--en-masse");
    if (r.code !== 0) throw new Error(`exit ${r.code} — le geste declare doit passer`);
    for (const n of [1, 2, 3]) {
      if (!existsSync(sceauDe(n))) throw new Error(`le sceau ${n} n a pas ete pose`);
    }
  });

  check("ROUGE — --essai ANNONCE ce qu il ecraserait, et n ecrit rien", () => {
    writeFileSync(join(M, "Client - Rapport - 20260821a.html"), page("v1 MODIFIE"), "utf8");
    const avant = readFileSync(sceauDe(1), "utf8");
    const r = lancerM("--sceller", "--en-masse", "--essai");
    if (r.j.verdict !== "ESSAI") throw new Error(`verdict ${r.j && r.j.verdict} — l essai doit se nommer`);
    if (!r.j.mesure || r.j.mesure.ecraserait !== 1) throw new Error(`ecraserait ${r.j.mesure && r.j.mesure.ecraserait}, 1 attendu`);
    if (readFileSync(sceauDe(1), "utf8") !== avant) throw new Error("l essai a ecrit");
  });

  check("VERT — sceller UN SEUL livrable reste le geste ordinaire, sans drapeau de plus", () => {
    const U = mkdtempSync(join(tmpdir(), "jugement-un-"));
    writeFileSync(join(U, "Client - Rapport - 20260824a.html"), page("seul"), "utf8");
    const r = spawnSync(process.execPath, [OUTIL, U, "--sceller"], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`exit ${r.status} — le geste qu on fait UNE FOIS ne doit pas se declarer`);
    if (!existsSync(join(U, "Client - Rapport - 20260824a.html.jugement.json"))) throw new Error("le sceau unique n a pas ete pose");
    rmSync(U, { recursive: true, force: true });
  });

  rmSync(M, { recursive: true, force: true });
}
rmSync(T, { recursive: true, force: true });
console.log(`\nverifier-jugement (TF-0523, TF-0692) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
