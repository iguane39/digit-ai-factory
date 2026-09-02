#!/usr/bin/env node
/**
 * oracle-verdict-visuel.mjs — un verdict visuel dit SUR QUOI il a été rendu, et au moins une
 * de ses captures contient la page ENTIÈRE.
 *
 * Pourquoi il existe (TF-0668, lot Produit-02 20260826h du 26/08/2026).
 *
 * LE FAIT FONDATEUR. Une revue d'implémentation a rendu un verdict sur une page de réservation
 * en s'appuyant sur une capture de **1440 × 900** — UNE FENÊTRE. La page mesure **1440 × 3684**.
 * Le défaut recherché — un surtitre en double — se trouvait à ENVIRON 800 PX SOUS LE BAS de la
 * seule capture de bureau. Les deux autres captures de la page, 375 × 780 et 1440 × 900, ne
 * l'atteignaient pas davantage. Le verdict portait sur un QUART de la page et se lisait comme un
 * verdict sur la page.
 *
 * LA CAPACITÉ EXISTAIT, DANS LE MÊME DOSSIER : trois autres pages avaient une capture pleine —
 * 1440 × 7001, 1440 × 3723, 1440 × 5180. Trois pages sur 203. Le cadrage était donc CHOISI PAGE
 * PAR PAGE, À LA MAIN, SANS RÈGLE, et le hasard du cadrage décidait de ce que la revue pouvait
 * voir.
 *
 * LA RAISON DE FOND, et elle dépasse ce défaut-ci. **Une répétition n'est pas un défaut de POINT,
 * c'est un défaut de RELATION entre deux points éloignés de la page.** Aucun jeu de captures par
 * fenêtre ne peut le contenir : la répétition n'existe que dans le cadre qui contient LES DEUX
 * occurrences. Ce n'est pas une question de nombre de captures — c'est une question de cadre.
 *
 * Règles :
 *   W1  la revue NOMME les captures sur lesquelles elle s'appuie ;
 *   W2  chaque capture nommée EXISTE, et les dimensions écrites dans la revue sont celles du
 *       fichier — une dimension recopiée de mémoire est une preuve qui ne prouve rien ;
 *   W3  au moins une capture est déclarée PLEINE PAGE ; les captures par fenêtre jugent la ligne
 *       de flottaison et le défilement, jamais la page ;
 *   W4  une capture déclarée pleine page dont la hauteur égale une hauteur de fenêtre usuelle
 *       (780, 800, 900, 1080) est SIGNALÉE, pas acquittée — c'est la signature d'un cadrage par
 *       fenêtre étiqueté « pleine page ».
 *
 * CE QU'IL NE FAIT PAS. Il ne dit pas si la page ENTIÈRE tient dans la capture : seule la page
 * connaît sa hauteur, et l'image ne la porte pas. W3 juge une DÉCLARATION, W4 la met à l'épreuve
 * du seul indice disponible. Il ne valide pas non plus l'image : il lit la largeur et la hauteur
 * dans l'en-tête PNG, sans vérifier le reste du fichier.
 *
 * Usage : node oracle-verdict-visuel.mjs <revue.md> [--captures <dossier>] [--self-test]
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/** Les hauteurs de fenêtre usuelles — la signature d'un cadrage par fenêtre (W4). */
const HAUTEURS_FENETRE = [780, 800, 812, 900, 1024, 1080];

/**
 * La ligne que la revue doit écrire, une par capture :
 *   `- <fichier.png> — 1440 × 3684 — pleine page`
 * Le séparateur de dimensions accepte `x`, `×` ou `*` ; le qualificatif accepte « pleine page »
 * ou « fenêtre » / « viewport ».
 */
const LIGNE = /^\s*[-*|]\s*`?([\w.\-/\\]+\.png)`?\s*[—–|-]\s*(\d{2,5})\s*[x×*]\s*(\d{2,5})\s*[—–|-]\s*(pleine[\s-]?page|fen[eê]tre|viewport)/gim;

/** Largeur et hauteur lues dans l'en-tête PNG (IHDR), sans bibliothèque. */
function dimensionsPng(chemin) {
  const b = readFileSync(chemin);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  if (b.toString("latin1", 12, 16) !== "IHDR") return null;
  return { largeur: b.readUInt32BE(16), hauteur: b.readUInt32BE(20) };
}

export function juger(revue, dossierCaptures = null) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message, ou) => findings.push({ regle, statut: "FAIL", message, ou });

  const texte = readFileSync(revue, "utf8");
  const base = dossierCaptures || dirname(revue);
  const citees = [...texte.matchAll(LIGNE)].map((m) => ({
    fichier: m[1], largeur: +m[2], hauteur: +m[3],
    pleine: /pleine/i.test(m[4]),
  }));

  // W1 — la revue nomme ses captures.
  if (!citees.length) {
    return [{ regle: "W1", statut: "FAIL",
      message: "la revue ne NOMME aucune capture avec ses dimensions. Un verdict adossé à une "
        + "fenêtre de 900 px sur une page de 3684 se lit comme un verdict sur la page ; nommer "
        + "les captures et leurs dimensions est ce qui le rend lisible pour ce qu'il est. "
        + "Format attendu, une ligne par capture : `- fichier.png — 1440 × 3684 — pleine page`" }];
  }
  ok("W1", `${citees.length} capture(s) nommées avec leurs dimensions`);

  // W2 — la capture existe, et les dimensions écrites sont celles du fichier.
  const absentes = [], fausses = [], illisibles = [];
  for (const c of citees) {
    const p = existsSync(join(base, c.fichier)) ? join(base, c.fichier)
      : existsSync(join(base, basename(c.fichier))) ? join(base, basename(c.fichier)) : null;
    if (!p) { absentes.push(c.fichier); continue; }
    const d = dimensionsPng(p);
    if (!d) { illisibles.push(c.fichier); continue; }
    if (d.largeur !== c.largeur || d.hauteur !== c.hauteur)
      fausses.push(`${c.fichier} : la revue écrit ${c.largeur}×${c.hauteur}, le fichier fait ${d.largeur}×${d.hauteur}`);
  }
  if (absentes.length || fausses.length) ko("W2",
    "des dimensions citées ne sont pas celles du fichier, ou la capture n'existe pas — une "
    + "dimension recopiée de mémoire est une preuve qui ne prouve rien",
    [...absentes.map((f) => `${f} : introuvable`), ...fausses].slice(0, 5).join(" · "));
  else if (illisibles.length) findings.push({ regle: "W2", statut: "NON_JUGEABLE",
    message: `${illisibles.length} fichier(s) sans en-tête PNG lisible : ${illisibles.slice(0, 3).join(", ")} `
      + "— les dimensions ne sont pas confrontées, et ce silence est déclaré" });
  else ok("W2", `${citees.length} capture(s) présentes, dimensions conformes au fichier`);

  // W3 — au moins une capture pleine page.
  const pleines = citees.filter((c) => c.pleine);
  if (!pleines.length) ko("W3",
    "AUCUNE capture pleine page. Une répétition n'est pas un défaut de POINT, c'est un défaut de "
    + "RELATION entre deux points éloignés : elle n'existe que dans le cadre qui contient LES DEUX "
    + "occurrences. Aucun nombre de captures par fenêtre n'y supplée — c'est une question de cadre",
    citees.map((c) => `${c.fichier} (${c.largeur}×${c.hauteur}, fenêtre)`).slice(0, 5).join(" · "));
  else ok("W3", `${pleines.length} capture(s) pleine page déclarées`);

  // W4 — une « pleine page » à hauteur de fenêtre est signalée, jamais acquittée.
  const suspectes = pleines.filter((c) => HAUTEURS_FENETRE.includes(c.hauteur));
  if (suspectes.length) ko("W4",
    "une capture DÉCLARÉE pleine page a exactement une hauteur de fenêtre usuelle — c'est la "
    + "signature d'un cadrage par fenêtre étiqueté « pleine page ». Le cas fondateur portait ce "
    + "défaut : 1440 × 900 sur une page de 1440 × 3684",
    suspectes.map((c) => `${c.fichier} : ${c.largeur}×${c.hauteur}`).join(" · "));
  else if (pleines.length) ok("W4", "aucune capture pleine page ne porte une hauteur de fenêtre usuelle");

  // W5 (TF-0771, 02/09/2026) — UN ÉCART RÉSIDUEL SUR UN DÉBORDEMENT NE S'ASSUME PAS SANS MESURE.
  // Le fait : render_page avait relevé un rognage de tableaux (1 301 px pour 1 136 disponibles à
  // 1 440 px), et la revue l'a classé « acceptable (conteneur défilant) » sans un chiffre. Le
  // destinataire : « les pages doivent profiter de toute la largeur de l'écran ». Une ligne
  // d'écart résiduel qui parle de débordement ou de rognage porte donc sa mesure en pixels, ET le
  // mot qui la classe (bloquant, corrigé) — « acceptable » nu est le verdict d'un œil, pas d'une
  // règle. Le socle (BEST-PRACTICES-HTML I1) classe un tableau rogné à ≥ 1 280 px BLOQUANT.
  const lignesTexte = texte.split(/\r?\n/);
  const residuelles = lignesTexte.filter((l) =>
    /(r[ée]siduel|acceptable|assum[ée]|tol[ée]r[ée])/i.test(l) && /(d[ée]bord|rogn|overflow|d[ée]passe|tronqu)/i.test(l));
  const sansMesure = residuelles.filter((l) => !(/\d{3,4}\s*px/.test(l) && /(bloquant|corrig[ée])/i.test(l)));
  if (sansMesure.length) ko("W5",
    "un écart résiduel sur un DÉBORDEMENT ou un ROGNAGE est assumé sans mesure ni classement — "
    + "« acceptable » nu est le verdict d'un œil : la ligne porte la largeur en px (contenu et "
    + "conteneur) et le mot qui la classe (bloquant à ≥ 1 280 px pour un tableau, ou corrigé)",
    sansMesure.map((l) => l.trim().slice(0, 120)).slice(0, 3).join(" · "));
  else ok("W5", residuelles.length
    ? `${residuelles.length} écart(s) résiduel(s) sur débordement, chacun mesuré et classé`
    : "aucun écart résiduel assumé sur un débordement");
  return findings;
}

const NON_JUGE = [
  "verdict-visuel : W3 juge une DÉCLARATION, pas un fait. Seule la page connaît sa hauteur, et "
  + "l'image ne la porte pas — rien ici ne peut établir que la page ENTIÈRE tient dans la capture. "
  + "W4 met cette déclaration à l'épreuve du seul indice disponible, une hauteur de fenêtre usuelle",
  "verdict-visuel : les dimensions sont lues dans l'en-tête PNG (IHDR). Le reste du fichier n'est "
  + "pas vérifié — cet oracle mesure une image, il ne la valide pas",
  "verdict-visuel : un défaut situé HORS de toute capture citée reste invisible. Nommer ses "
  + "captures ne rend pas une revue exhaustive ; cela rend son périmètre LISIBLE",
];

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.some((x) => x.statut === "NON_JUGEABLE") ? "NON_JUGEABLE" : "PASS");

// ------------------------------------------------------------------------------------------
// Self-test
// ------------------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  const dir = mkdtempSync(join(tmpdir(), "verdict-visuel-"));
  // Un PNG minimal : signature + longueur + IHDR + largeur/hauteur. L'oracle ne lit que cela,
  // et il le DÉCLARE — construire un PNG complet ici mesurerait la bibliothèque, pas la règle.
  const png = (w, h) => {
    const b = Buffer.alloc(24);
    b.writeUInt32BE(0x89504e47, 0); b.writeUInt32BE(0x0d0a1a0a, 4);
    b.writeUInt32BE(13, 8); b.write("IHDR", 12, "latin1");
    b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20);
    return b;
  };
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "pleine.png"), png(1440, 3684));
  writeFileSync(join(dir, "fenetre.png"), png(1440, 900));
  writeFileSync(join(dir, "menteuse.png"), png(1440, 900));

  const ecrire = (nom, corps) => { writeFileSync(join(dir, nom), corps, "utf8"); return join(dir, nom); };
  const verte = ecrire("verte.md",
    "# Revue\n\nCaptures :\n\n- `pleine.png` — 1440 × 3684 — pleine page\n"
    + "- `fenetre.png` — 1440 × 900 — fenêtre\n\nVerdict : conforme.\n");
  // ROUGE 1 : que des fenêtres — le cas fondateur.
  const rougeW3 = ecrire("rouge-w3.md",
    "# Revue\n\n- `fenetre.png` — 1440 × 900 — fenêtre\n\nVerdict : conforme.\n");
  // ROUGE 2 : dimension recopiée de mémoire.
  const rougeW2 = ecrire("rouge-w2.md",
    "# Revue\n\n- `pleine.png` — 1440 × 3684 — pleine page\n"
    + "- `menteuse.png` — 1440 × 5180 — pleine page\n");
  // ROUGE 3 : « pleine page » à hauteur de fenêtre — l'étiquette dément le cadre.
  const rougeW4 = ecrire("rouge-w4.md",
    "# Revue\n\n- `fenetre.png` — 1440 × 900 — pleine page\n");
  // ROUGE 4 : aucune capture nommée.
  const rougeW1 = ecrire("rouge-w1.md", "# Revue\n\nTout est conforme, j'ai regardé les captures.\n");
  // ROUGE 5 (TF-0771) : un débordement classé « acceptable » sans un chiffre — le cas du 02/09.
  const rougeW5 = ecrire("rouge-w5.md",
    "# Revue\n\n- `pleine.png` — 1440 × 3684 — pleine page\n\n## Écarts résiduels\n\n"
    + "- Le tableau des volumes déborde de son conteneur défilant : acceptable, le conteneur défile.\n");
  // VERTE 5 : le même écart, MESURÉ et CLASSÉ — la règle ne crie pas sur une revue honnête.
  const verteW5 = ecrire("verte-w5.md",
    "# Revue\n\n- `pleine.png` — 1440 × 3684 — pleine page\n\n## Écarts résiduels\n\n"
    + "- Le tableau des volumes déborde : 1301 px de contenu pour 1136 px de conteneur à 1440 px — bloquant, corrigé en pleine largeur.\n");

  const moi = fileURLToPath(import.meta.url);
  const jouer = (f) => spawnSync(process.execPath, [moi, f, "--captures", dir], { encoding: "utf8" });
  const casse = [];
  const exige = (c, q) => { if (!c) casse.push(q); };

  const rv = jouer(verte);
  exige(rv.status === 0, "fixture VERTE : ne passe pas — " + rv.stdout.slice(0, 300));
  const r1 = jouer(rougeW1);
  exige(r1.status === 1 && /"W1"[^}]*FAIL/.test(r1.stdout), "une revue qui ne nomme aucune capture doit échouer (W1)");
  const r2 = jouer(rougeW2);
  exige(r2.status === 1 && /"W2"[^}]*FAIL/.test(r2.stdout), "une dimension qui ment sur le fichier doit échouer (W2)");
  const r3 = jouer(rougeW3);
  exige(r3.status === 1 && /"W3"[^}]*FAIL/.test(r3.stdout), "un verdict sans capture pleine page doit échouer (W3)");
  const r4 = jouer(rougeW4);
  exige(r4.status === 1 && /"W4"[^}]*FAIL/.test(r4.stdout), "une « pleine page » à 900 px doit être signalée (W4)");
  // LES DÉFAUTS SONT INDÉPENDANTS : la rouge de W2 garde une pleine page valide, donc W3 y PASSE.
  // Sans cela, une fixture prouverait qu'une règle rougit sans prouver qu'elle rougit sur SA cause.
  exige(/"W3"[^}]*PASS/.test(r2.stdout), "la rouge de W2 devrait passer W3 — les règles ne sont pas indépendantes");
  exige(/"W1"[^}]*PASS/.test(r3.stdout), "la rouge de W3 devrait passer W1 — les règles ne sont pas indépendantes");
  const r5 = jouer(rougeW5);
  exige(r5.status === 1 && /"W5"[^}]*FAIL/.test(r5.stdout), "un débordement classé « acceptable » sans mesure doit échouer (W5)");
  const v5 = jouer(verteW5);
  exige(v5.status === 0 && /"W5"[^}]*PASS/.test(v5.stdout), "le même écart, mesuré en px et classé bloquant/corrigé, doit passer (W5) — " + v5.stdout.slice(0, 200));

  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test verdict-visuel : 9/9 PASS (verte PASS ; rouges sur W1 aucune capture nommée, W2 dimension "
      + "démentie par le fichier, W3 aucune pleine page — le cas fondateur —, W4 « pleine page » à hauteur "
      + "de fenêtre, W5 débordement « acceptable » sans mesure ; verte W5 mesurée et classée ; et deux contrôles d'INDÉPENDANCE des règles)");
  process.exit(casse.length ? 1 : 0);
}

const cible = args.find((a) => !a.startsWith("--"));
const idx = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-verdict-visuel", verdict: "ERREUR",
    message: "revue introuvable — usage : node oracle-verdict-visuel.mjs <revue.md> "
      + "[--captures <dossier>] | --self-test" }));
  process.exit(2);
}
const findings = juger(cible, idx("--captures"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-verdict-visuel", version: "1.0.0", cible, verdict,
  findings, non_juge: NON_JUGE }, null, 1));
process.exit(verdict === "FAIL" ? 1 : verdict === "NON_JUGEABLE" ? 2 : 0);
