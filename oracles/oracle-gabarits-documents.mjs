#!/usr/bin/env node
/**
 * oracle-gabarits-documents.mjs — intégrité de la bibliothèque de gabarits de documents
 * (`gabarits\documents\`). Né du mandat du 21/08 : hisser au niveau de la factory les formes de
 * livrables que les projets réinventaient chacun de leur côté.
 *
 * Ce que cet oracle juge : la BIBLIOTHÈQUE, jamais les documents qu'on en tire. Un rapport
 * produit à partir d'un gabarit se juge par l'oracle de son domaine (`check_html.py` ET
 * `render_page.py` pour un HTML) — c'est écrit famille par famille au catalogue.
 *
 * Règles :
 *  G1  `catalogue.jsonl` existe, 1re ligne méta `pilot/gabarits-documents@1`, JSONL valide
 *  G2  chaque famille porte les champs requis, non vides (dont `preuve` et `sources`) —
 *      un gabarit sans livrable réel derrière est une invention, pas une extraction
 *  G3  cohérence catalogue ↔ disque, DANS LES DEUX SENS : tout gabarit déclaré existe, et
 *      tout dossier de famille présent sur le disque est déclaré au catalogue. Le second sens
 *      est celui qui manque toujours : un gabarit posé sans être inscrit ne serait trouvé par
 *      personne (même classe que TF-0362, le skill absent du manifeste)
 *  G4  statut dans le référentiel fermé {ok, a_extraire, porte_ailleurs} et cohérent :
 *      `ok` exige un gabarit sur disque, des règles déclarées et un oracle nommé ;
 *      `a_extraire` exige des sources et INTERDIT un gabarit (sinon le statut ment) ;
 *      `porte_ailleurs` exige de dire OÙ la forme vit
 *  G5  aucun gabarit ne porte de donnée client : un squelette se hisse, un livrable reste chez
 *      le projet. Motifs cherchés : noms de clients du parc, adresses, identifiants Azure
 *  G6  toute règle de doctrine citée par une famille (D1…Dn) est définie dans `README.md` —
 *      une règle citée et non définie est une référence morte
 *  G8  tout gabarit en statut `ok` PRESCRIT le fil de traçabilité — son id de famille et une
 *      version — sans quoi un retour sur un document produit n'est rattachable à rien. Le
 *      lecteur qui trouve un manque ne peut le remonter utilement que s'il peut dire de QUEL
 *      gabarit et de QUELLE version le document vient ; sinon le retour dit « il manquait une
 *      section » et personne ne sait à quoi l'appliquer (R-46, 21/08).
 *  G9  tout gabarit de LIVRABLE prescrit la marque de destinataire (`destinataire: humain`
 *      en frontmatter pour un .md, `<meta name="destinataire" content="humain">` pour un
 *      .html), ou déclare pourquoi il ne la porte pas (TF-0504, 22/08/2026). Sans marque en
 *      AMONT, la règle R-2 d'`oracle-conformite-projet` est un faux négatif STRUCTUREL : elle
 *      ne juge que ce qui est marqué, et rien ne posait la marque.
 *  G7  les emplacements à remplir suivent la convention du socle `{…}` et jamais `{{…}}` :
 *      L11 de `check_html.py` refuse la seconde forme, un squelette qui la porte est rouge
 *      à l'oracle de son propre domaine (mesuré le 21/08 en écrivant le premier squelette)
 *
 * Usage : node oracle-gabarits-documents.mjs [racine] [--self-test]
 * Exit : 0 PASS · 1 FAIL · 2 SKIP (bibliothèque absente — rien à juger).
 */
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const CHAMPS = ["id", "famille", "titre", "quand_l_employer", "formats", "statut", "sources", "preuve"];
const STATUTS = new Set(["ok", "a_extraire", "porte_ailleurs"]);
const META = "pilot/gabarits-documents@1";

// Noms de clients et motifs de données qui n'ont RIEN à faire dans un squelette. La liste est
// une DONNÉE (loi transverse n°4) : un client de plus s'ajoute ici, pas dans une condition.
const MOTIFS_CLIENT = [
  { motif: /\bClient-A\b/i, quoi: "nom de client (Client-A)" },
  { motif: /\bEnseigne-A\b/i, quoi: "nom de client (Enseigne-A)" },
  { motif: /\bProduit-05\b/i, quoi: "nom de client (Produit-05)" },
  { motif: /\bClient-C\b/i, quoi: "nom de client (Client-C)" },
  { motif: /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, quoi: "adresse de courriel" },
  { motif: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i, quoi: "identifiant GUID (tenant, app registration)" },
];

/** Juge une bibliothèque. `racine` = dossier contenant `documents\`. */
function juger(racineGabarits) {
  const findings = [];
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", ou: "-", message });

  const dossier = join(racineGabarits, "documents");
  const catalogue = join(dossier, "catalogue.jsonl");
  const readme = join(dossier, "README.md");
  if (!existsSync(dossier)) return { verdict: "SKIP", findings, motif: "gabarits\\documents\\ absent" };
  if (!existsSync(catalogue)) { ko("G1", "documents/catalogue.jsonl", "catalogue absent — la bibliothèque n'a pas de source unique"); return { verdict: "FAIL", findings }; }

  const lignes = readFileSync(catalogue, "utf8").split(/\r?\n/).filter((l) => l.trim());
  let meta;
  try { meta = JSON.parse(lignes[0]); } catch { ko("G1", "catalogue.jsonl:1", "1re ligne non-JSON"); return { verdict: "FAIL", findings }; }
  if (meta.schema !== META) ko("G1", "catalogue.jsonl:1", `schéma « ${meta.schema} » — attendu ${META}`);
  const familles = [];
  lignes.slice(1).forEach((l, i) => {
    try { familles.push({ n: i + 2, ...JSON.parse(l) }); }
    catch { ko("G1", `catalogue.jsonl:${i + 2}`, "ligne non-JSON"); }
  });
  if (!findings.some((f) => f.regle === "G1")) ok("G1", `catalogue valide (${meta.version}, ${familles.length} famille(s))`);

  // G2 — champs requis
  let g2 = true;
  for (const f of familles) {
    const manquants = CHAMPS.filter((c) => {
      const v = f[c];
      return Array.isArray(v) ? v.length === 0 : !String(v ?? "").trim();
    });
    if (manquants.length) { ko("G2", f.id || `ligne ${f.n}`, `champ(s) vide(s) ou absent(s) : ${manquants.join(", ")}`); g2 = false; }
  }
  if (g2) ok("G2", `${familles.length} famille(s) — tous les champs requis présents, sources et preuve comprises`);

  // G4 — statut et cohérence du statut
  let g4 = true;
  for (const f of familles) {
    if (!STATUTS.has(f.statut)) { ko("G4", f.id, `statut « ${f.statut} » hors référentiel {${[...STATUTS].join(", ")}}`); g4 = false; continue; }
    if (f.statut === "ok") {
      if (!f.gabarit) { ko("G4", f.id, "statut ok sans gabarit déclaré — un gabarit « ok » se prend et s'emploie"); g4 = false; }
      if (!Array.isArray(f.regles) || !f.regles.length) { ko("G4", f.id, "statut ok sans règle de doctrine engagée"); g4 = false; }
      if (!Array.isArray(f.oracles) || !f.oracles.length) { ko("G4", f.id, "statut ok sans oracle nommé — un livrable se juge sur verdict exécuté (D7)"); g4 = false; }
    }
    if (f.statut === "a_extraire" && f.gabarit) { ko("G4", f.id, "statut a_extraire ALORS QUE le gabarit existe — le statut ment sur l'état du travail"); g4 = false; }
    if (f.statut === "porte_ailleurs" && !(Array.isArray(f.sources) && f.sources.length)) { ko("G4", f.id, "statut porte_ailleurs sans dire OÙ la forme vit"); g4 = false; }
  }
  if (g4) ok("G4", "statuts dans le référentiel fermé et cohérents avec l'état du disque");

  // G3 — cohérence catalogue ↔ disque, dans les DEUX sens
  const racineDepot = join(racineGabarits, "..");
  let g3 = true;
  const famillesDeclarees = new Set();
  for (const f of familles) {
    if (f.famille) famillesDeclarees.add(String(f.famille));
    for (const cle of ["gabarit", "squelette"]) {
      const chemin = f[cle];
      if (!chemin) continue;
      if (!existsSync(join(racineDepot, chemin))) { ko("G3", f.id, `${cle} déclaré et ABSENT du disque : ${chemin}`); g3 = false; }
    }
  }
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (!famillesDeclarees.has(e.name)) {
      ko("G3", `documents/${e.name}`, "dossier de famille présent sur le disque et ABSENT du catalogue — un gabarit posé sans être inscrit n'est trouvé par personne");
      g3 = false;
    }
  }
  if (g3) ok("G3", `catalogue ↔ disque cohérents dans les deux sens (${famillesDeclarees.size} famille(s) déclarée(s))`);

  // G6 — règles de doctrine citées et définies
  const texteReadme = existsSync(readme) ? readFileSync(readme, "utf8") : "";
  const definies = new Set([...texteReadme.matchAll(/\*\*(D\d+)\*\*/g)].map((m) => m[1]));
  let g6 = true;
  if (!texteReadme) { ko("G6", "documents/README.md", "mode d'emploi absent — la doctrine n'est définie nulle part"); g6 = false; }
  else {
    for (const f of familles) {
      for (const r of f.regles || []) {
        if (!definies.has(r)) { ko("G6", f.id, `règle « ${r} » citée et NON définie dans README.md — référence morte`); g6 = false; }
      }
    }
  }
  if (g6) ok("G6", `${definies.size} règle(s) de doctrine définies, toutes les citations résolues`);

  // G5 et G7 — sur le contenu des gabarits présents
  const fichiersGabarits = [];
  const parcourir = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const chemin = join(d, e.name);
      if (e.isDirectory()) { parcourir(chemin); continue; }
      if (/\.(md|html)$/.test(e.name) && e.name !== "README.md") fichiersGabarits.push(chemin);
    }
  };
  parcourir(dossier);

  let g5 = true, g7 = true;
  for (const chemin of fichiersGabarits) {
    const texte = readFileSync(chemin, "utf8");
    const relatif = chemin.slice(dossier.length + 1).split("\\").join("/");
    // G5 : la PROVENANCE cite légitimement des chemins de livrables clients ; seul le CORPS
    // est jugé. Sans cette frontière, la règle refuserait la citation de sa propre source.
    const corps = texte.split(/^## /m).slice(1).join("\n");
    for (const { motif, quoi } of MOTIFS_CLIENT) {
      const trouve = corps.match(motif);
      if (trouve) { ko("G5", relatif, `${quoi} dans le corps du gabarit : « ${String(trouve[0]).slice(0, 40)} » — un squelette se hisse, le contenu client reste chez le projet`); g5 = false; }
    }
    if (/\{\{/.test(texte)) { ko("G7", relatif, "emplacement en `{{…}}` — convention du socle : `{…}` (L11 de check_html.py refuse la double accolade)"); g7 = false; }
  }

  // G8 — le fil de traçabilité, exigé des seuls gabarits `ok` : une famille `a_extraire` n'a
  // pas de gabarit à juger, une famille `porte_ailleurs` suit la convention de la forge qui la
  // porte, et lui imposer la nôtre serait re-créer le doublon que `porte_ailleurs` évite.
  let g8 = true;
  for (const f of familles.filter((x) => x.statut === "ok")) {
    for (const cle of ["gabarit", "squelette"]) {
      const chemin = f[cle];
      if (!chemin) continue;
      const abs = join(racineDepot, chemin);
      if (!existsSync(abs)) continue; // G3 le dit déjà
      const texte = readFileSync(abs, "utf8");
      const porteId = texte.includes(f.id);
      const porteVersion = /version[_ ]du[_ ]gabarit/i.test(texte);
      if (porteId && porteVersion) continue;
      const manque = [!porteId && `son id de famille (${f.id})`, !porteVersion && "une version du gabarit"].filter(Boolean);
      ko("G8", `${chemin}`, `gabarit \`ok\` sans fil de traçabilité — il ne prescrit pas ${manque.join(" ni ")}. Un document produit sans ce couple rend tout retour inexploitable : « il manquait une section » ne se rattache à rien`);
      g8 = false;
    }
  }
  if (g8) ok("G8", "tout gabarit `ok` prescrit son id de famille et sa version — un retour reste rattachable");

  // G9 (TF-0504, 22/08/2026) — LA MARQUE DE DESTINATAIRE SE POSE EN AMONT, OU ELLE NE SE POSE
  // NULLE PART.
  //
  // `oracle-conformite-projet` déclare sa propre limite, mot pour mot : « seul ce qui est MARQUÉ
  // est jugé — un producteur qui oublie de marquer son livrable y échappe (faux négatif ASSUMÉ,
  // mesuré à la revue du 17/09 par le rapport entre livrables marqués et livrables déposés) ».
  // La limite était donc connue et son ampleur prévue à la mesure.
  //
  // CE QUI NE L'ÉTAIT PAS : la marque n'était posée NULLE PART EN AMONT. Vérifié le 22/08 —
  // `grep -ril destinataire` sur les gabarits et les outils de forge-audit : zéro occurrence ; le
  // gabarit Client-A de la fiche sécurité (9 485 octets) : zéro occurrence ; cet oracle (G1-G8) :
  // aucune règle n'exigeait la marque. Tout document produit depuis la bibliothèque naissait donc
  // non marqué, donc INVISIBLE à R-2, donc rangeable n'importe où sans qu'aucun contrôle ne le
  // dise. Preuve du coût : une fiche sécurité écrite à la racine du produit, hors `output\`, en
  // violation de R-2 et R-39 — et aucun oracle ne pouvait le voir. Le défaut a été trouvé par
  // relecture humaine, exactement ce que TF-0319 voulait supprimer.
  //
  // La revue du 17/09 aurait donc mesuré un ratio marqués/déposés proche de zéro SANS EN DONNER
  // LA CAUSE, la cause n'étant pas chez les producteurs. On ferme la boucle à la SOURCE.
  //
  // L'ÉCHAPPATOIRE EST EXPLICITE ET NÉCESSAIRE : un gabarit NORMATIF n'est destiné à personne —
  // c'est déjà la précision D-06, et `gabarits\INSATISFACTION.md` documente ce choix pour
  // lui-même. Un gabarit peut donc déclarer `destinataire: aucun` avec son motif. Ce qui est
  // refusé n'est pas l'absence de marque : c'est le SILENCE sur la marque.
  // LA MARQUE JUGEE ICI EST EXACTEMENT CELLE QUE R-2 SAIT LIRE, et c'est le second faux negatif
  // trouve en ecrivant la regle. `oracle-conformite-projet` cherche `destinataire: humain` (ou
  // `content="humain"`) : une valeur de ROLE n'y suffit pas. Or deux gabarits portaient
  // `destinataire: exploitant / astreinte` et `destinataire: comite d'architecture / client /
  // repreneur` — donc un document ne d'eux restait INVISIBLE a R-2 malgre sa marque. Un premier
  // jet de G9 les declarait conformes : il aurait ferme l'item en laissant le defaut entier.
  //
  // Le role du lecteur est une information utile, mais ce n'est pas la marque : il vit sous une
  // cle distincte (`role_destinataire`). La marque, elle, repond a UNE question — ce document
  // part-il chez un humain — et sa reponse est fermee.
  const MARQUE_MD = /^\s*destinataire\s*:\s*humain\s*$/mi;
  const MARQUE_HTML = /<meta\s+name=["']destinataire["']\s+content=["']humain["']/i;
  // L'echappatoire NORMATIVE : un gabarit qui n'est destine a personne le declare (precision
  // D-06, dont `gabarits\INSATISFACTION.md` fait deja usage pour lui-meme). Ce qui est refuse
  // n'est pas l'absence de marque, c'est le SILENCE sur la marque.
  const MARQUE_AUCUN = /^\s*destinataire\s*:\s*aucun\b/mi;
  // ATTENTION AU FAUX NEGATIF, constate en ecrivant la regle : un premier jet acceptait TOUT
  // fichier contenant le mot « destinataire », et `dossier-exploitation/SQUELETTE.html` passait
  // alors grace a une legende de tableau — « Alertes et destinataires ». Une garde qui se
  // satisfait d un mot dans une legende ne juge rien. On exige donc la FORME de la marque :
  // `destinataire: <valeur>` en debut de ligne, ou l attribut `name="destinataire"` — ce second
  // motif permet a un gabarit .md de PRESCRIRE la balise que sa copie .html devra porter.
  const MARQUE_PRESCRITE = /name\s*=\s*["']destinataire["']\s+content\s*=\s*["']humain["']/i;
  let g9 = true;
  for (const f of familles.filter((x) => x.statut === "ok")) {
    for (const cle of ["gabarit", "squelette"]) {
      const chemin = f[cle];
      if (!chemin) continue;
      const abs = join(racineDepot, chemin);
      if (!existsSync(abs)) continue; // G3 le dit déjà
      const texte = readFileSync(abs, "utf8");
      // Un gabarit PRESCRIT la marque : soit il la porte lui-même (et elle descend dans la copie),
      // soit il l'écrit comme consigne à remplir. Les deux comptent — ce qui ne compte pas, c'est
      // de n'en parler nulle part.
      if (MARQUE_MD.test(texte) || MARQUE_HTML.test(texte) || MARQUE_AUCUN.test(texte)
          || MARQUE_PRESCRITE.test(texte)) continue;
      ko("G9", chemin, "gabarit de livrable SANS marque de destinataire ni déclaration de son absence — " +
        "R-2 ne juge que ce qui est marqué, donc un document né de ce gabarit échappe au contrôle de localisation " +
        "par construction, et pas par oubli du producteur. Poser `destinataire: humain` (frontmatter .md) ou " +
        "`<meta name=\"destinataire\" content=\"humain\">` (.html) ; un gabarit normatif déclare `destinataire: aucun` avec son motif");
      g9 = false;
    }
  }
  if (g9) ok("G9", "tout gabarit `ok` prescrit sa marque de destinataire, ou déclare pourquoi il n'en porte pas");
  if (g5) ok("G5", `${fichiersGabarits.length} gabarit(s) sans donnée client dans leur corps`);
  if (g7) ok("G7", "emplacements à la convention du socle `{…}`");

  return { verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings };
}

// ---- self-test : chaque règle prouvée dans les DEUX sens -------------------------------------
function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "gabdocs-"));
  const gab = join(base, "gabarits");
  const docs = join(gab, "documents");
  mkdirSync(docs, { recursive: true });
  const meta = JSON.stringify({ schema: META, version: "1.0.0", genere: "2026-08-21", ecrivain: "pilot", regle: "recette" });
  const famille = (sur = {}) => JSON.stringify({
    id: "gd-x", famille: "fx", titre: "T", quand_l_employer: "Q", formats: ["md"],
    statut: "ok", gabarit: "gabarits/documents/fx/GABARIT.md", squelette: null,
    sources: ["source réelle"], regles: ["D1"], oracles: ["check_html.py"], preuve: "P", ...sur,
  });
  // Le gabarit par défaut porte le fil de traçabilité (G8) ET la marque de destinataire (G9) :
  // la fixture VERTE doit représenter une bibliothèque CONFORME, sinon elle cesse de prouver ce
  // que l'oracle exige. C'est la troisième fois que ce commentaire s'allonge, et c'est normal —
  // une fixture verte est le contrat, elle grossit avec lui.
  const ecrire = (lignes, gabarit = "# G\n\n## Structure\n\ndestinataire: humain\n\ngabarit: gd-x · version du gabarit 1.0.0\n\nun {emplacement}\n") => {
    mkdirSync(join(docs, "fx"), { recursive: true });
    writeFileSync(join(docs, "fx", "GABARIT.md"), gabarit, "utf8");
    writeFileSync(join(docs, "README.md"), "| **D1** | Largeur utile | fait |\n", "utf8");
    writeFileSync(join(docs, "catalogue.jsonl"), [meta, ...lignes].join("\n") + "\n", "utf8");
  };

  const cas = [];
  ecrire([famille()]);
  let r = juger(gab);
  cas.push(["verte  — bibliothèque conforme", r.verdict === "PASS", r.verdict]);

  ecrire([famille({ preuve: "" })]);
  r = juger(gab);
  cas.push(["G2     — famille sans preuve", r.findings.some((f) => f.regle === "G2" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille({ statut: "a_extraire" })]);
  r = juger(gab);
  cas.push(["G4     — statut a_extraire alors que le gabarit existe", r.findings.some((f) => f.regle === "G4" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille({ gabarit: "gabarits/documents/fx/ABSENT.md" })]);
  r = juger(gab);
  cas.push(["G3     — gabarit déclaré et absent du disque", r.findings.some((f) => f.regle === "G3" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille()]);
  mkdirSync(join(docs, "non-declaree"), { recursive: true });
  writeFileSync(join(docs, "non-declaree", "GABARIT.md"), "# orphelin\n\n## S\n\ntexte\n", "utf8");
  r = juger(gab);
  cas.push(["G3 bis — dossier présent et ABSENT du catalogue (sens qui manque toujours)",
    r.findings.some((f) => f.regle === "G3" && f.statut === "FAIL" && String(f.ou).includes("non-declaree")), r.verdict]);
  rmSync(join(docs, "non-declaree"), { recursive: true, force: true });

  ecrire([famille({ regles: ["D1", "D99"] })]);
  r = juger(gab);
  cas.push(["G6     — règle citée et non définie au README", r.findings.some((f) => f.regle === "G6" && f.statut === "FAIL"), r.verdict]);

  // G9 (TF-0504) — sens ROUGE : aucune mention de la marque. C'est le cas de TOUTE la
  // bibliothèque avant le 22/08 : 7 gabarits `ok` sur 7, donc 100 %.
  ecrire([famille()], "# G\n\n## Structure\n\ngabarit: gd-x · version du gabarit 1.0.0\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["G9     — gabarit muet sur la marque de destinataire", r.findings.some((f) => f.regle === "G9" && f.statut === "FAIL"), r.verdict]);

  // G9 bis — LE FAUX NÉGATIF À NE PAS REPRODUIRE, trouvé en écrivant la règle : une valeur de
  // RÔLE n'est pas la marque. `destinataire: exploitant / astreinte` était présent sur deux
  // gabarits réels, et R-2 ne sait lire que `humain` — un document né d'eux restait invisible.
  ecrire([famille()], "# G\n\n## Structure\n\ndestinataire: exploitant / astreinte\n\ngabarit: gd-x · version du gabarit 1.0.0\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["G9 bis — une valeur de RÔLE ne vaut pas la marque (R-2 ne lit que `humain`)", r.findings.some((f) => f.regle === "G9" && f.statut === "FAIL"), r.verdict]);

  // G9 ter — LA BORNE : un gabarit NORMATIF n'est destiné à personne et le DÉCLARE (D-06).
  // Ce qui est refusé n'est pas l'absence de marque, c'est le silence sur la marque.
  ecrire([famille()], "# G\n\n## Structure\n\ndestinataire: aucun — référentiel normatif, pas un livrable\n\ngabarit: gd-x · version du gabarit 1.0.0\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["G9 ter — l'absence DÉCLARÉE est acceptée (borne, D-06)", r.verdict === "PASS", r.verdict]);

  ecrire([famille()], "# G\n\n## Structure\n\nAudit mené chez Client-A pour Enseigne-A.\n");
  r = juger(gab);
  cas.push(["G5     — donnée client dans le corps d'un gabarit", r.findings.some((f) => f.regle === "G5" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille()], "# G\n\n> Provenance : livrable Client-A - Rapport - 20260821a\n\n## Structure\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["G5 bis — la PROVENANCE peut citer son livrable source, elle n'est pas jugée",
    !r.findings.some((f) => f.regle === "G5" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille()], "# G\n\n## Structure\n\nun {{ emplacement }}\n");
  r = juger(gab);
  cas.push(["G7     — emplacement en double accolade (refusé par L11 du socle)", r.findings.some((f) => f.regle === "G7" && f.statut === "FAIL"), r.verdict]);


  // G8 (R-46) — le fil de traçabilité, dans les deux sens, plus la BORNE. Une famille qui n'est
  // pas `ok` n'a pas de gabarit à juger, et lui imposer notre convention recréerait exactement
  // le doublon que `porte_ailleurs` évite (TF-0453).
  ecrire([famille()], "# G\n\n## Structure\n\ngabarit: gd-x · version du gabarit 1.0.0\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["verte G8— le gabarit prescrit son id ET sa version",
    !r.findings.some((f) => f.regle === "G8" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille()], "# G\n\n## Structure\n\ngd-x, mais aucune version\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["G8     — id présent, VERSION absente : un retour ne sait pas à quelle version l'appliquer",
    r.findings.some((f) => f.regle === "G8" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille()], "# G\n\n## Structure\n\nversion du gabarit 1.0.0, mais aucun id\n\nun {emplacement}\n");
  r = juger(gab);
  cas.push(["G8 bis — version présente, ID absent : le retour ne sait pas à quelle FAMILLE l'appliquer",
    r.findings.some((f) => f.regle === "G8" && f.statut === "FAIL"), r.verdict]);

  ecrire([famille({ statut: "porte_ailleurs", gabarit: null, regles: [], oracles: [] })], "# G\n\n## Structure\n\nrien\n");
  r = juger(gab);
  cas.push(["G8 ter — une famille porte_ailleurs n'est PAS jugée sur notre convention (borne)",
    !r.findings.some((f) => f.regle === "G8" && f.statut === "FAIL"), r.verdict]);

  rmSync(base, { recursive: true, force: true });
  const echecs = cas.filter(([, ok]) => !ok);
  for (const [nom, ok, verdict] of cas) console.log(`  [${ok ? "OK    " : "ECHEC "}] ${nom} (verdict ${verdict})`);
  console.log(`Self-test gabarits de documents : ${cas.length - echecs.length}/${cas.length}`);
  process.exit(echecs.length ? 1 : 0);
}

if (process.argv.includes("--self-test")) selfTest();

const racine = process.argv.slice(2).find((a) => !a.startsWith("--")) || join(ICI, "..");
const resultat = juger(join(racine, "gabarits"));
process.stdout.write(JSON.stringify({
  oracle: "oracle-gabarits-documents", version: "1.0.0", verdict: resultat.verdict,
  findings: resultat.findings,
  non_juge: [
    "la QUALITÉ d'un gabarit — qu'il produise un bon document relève de la relecture humaine et des oracles du domaine, jamais de celui-ci",
    "les documents PRODUITS à partir des gabarits : ils se jugent par l'oracle de leur domaine (check_html.py ET render_page.py pour un HTML), nommé famille par famille au catalogue",
    "G5 ne cherche que des motifs DÉCLARÉS (noms de clients du parc, courriels, GUID) — une donnée client d'une autre forme passerait ; la relecture reste due avant publication",
    "G8 juge que le gabarit PRESCRIT le couple, jamais qu'un document produit le PORTE — un projet qui retire la ligne à l'usage sort du périmètre de cet oracle ; c'est le retour lui-même qui le dira, en ne pouvant pas nommer sa source",
    "l'exhaustivité du recensement des familles : le catalogue liste ce qui a été relevé le 21/08, pas ce qui existe (les familles manquantes se remontent en candidat)",
  ],
}, null, 1) + "\n");
process.exit(resultat.verdict === "FAIL" ? 1 : resultat.verdict === "SKIP" ? 2 : 0);
