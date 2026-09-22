#!/usr/bin/env node
/**
 * oracle-chemin-prescrit.test.mjs — recette à DEUX SENS du chemin d'usage prescrit (TF-1282,
 * classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`, 22/09/2026).
 *
 * Les deux sens sur chacune des trois règles, plus les CINQ calibrages payés sur le dépôt réel
 * pendant l'écriture de l'oracle — chacun a sa fixture, parce qu'un faux positif sur une
 * prescription fait désactiver l'oracle, et un faux NÉGATIF le rend vert en silence :
 *   · une commande qui ne résout que dans un dépôt FRÈRE du parc est juste (3 cas réels) ;
 *   · un chemin de convention d'accueil (`forge\`, `.claude\`) vise l'hôte futur d'un gabarit ;
 *   · un nom nu dont le chemin complet est écrit à côté est un raccourci… ;
 *   · …mais écarter TOUT nom nu retirait `node bootstrap.mjs --pull` de la mesure ;
 *   · une VUE GÉNÉRÉE n'est pas une prescription, et le marqueur ne doit pas attraper le document
 *     qui PARLE d'une vue générée (deux jets payés sur `references\TODO-FORGE.md`).
 *
 * Joué par `oracles\self-tests.mjs` (I1 et I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  juger, prescriptions, documents, estHorsPortee, estUnRaccourci, estUneVueGeneree,
  racineDuParc, depotsDuParc, NON_JUGE,
} from "./oracle-chemin-prescrit.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const regle = (r, id) => r.findings.find((f) => f.regle === id);
const echoue = (r, id) => (regle(r, id) || {}).statut === "FAIL";
const passe = (r, id) => (regle(r, id) || {}).statut === "PASS";

const T = mkdtempSync(join(tmpdir(), "chemin-prescrit-"));
let n = 0;

/**
 * Un parc fabriqué : `depots` est une carte `nom de dépôt → { docs, scripts, bancs }`. Le premier
 * dépôt nommé est celui qu'on juge ; les autres sont ses frères.
 */
const parc = (depots) => {
  const racine = join(T, `parc${++n}`);
  mkdirSync(racine, { recursive: true });
  const chemins = {};
  for (const [nom, { docs = {}, scripts = {}, bancs = {} } = {}] of Object.entries(depots)) {
    const d = join(racine, nom);
    mkdirSync(d, { recursive: true });
    for (const [rel, contenu] of Object.entries(docs)) {
      const p = join(d, rel);
      mkdirSync(join(p, ".."), { recursive: true });
      writeFileSync(p, contenu, "utf8");
    }
    for (const [rel, contenu] of Object.entries({ ...scripts, ...bancs })) {
      const p = join(d, rel);
      mkdirSync(join(p, ".."), { recursive: true });
      writeFileSync(p, contenu, "utf8");
    }
    chemins[nom] = d;
  }
  return { racine, chemins };
};

const jugerParc = (depots, depotJuge = null) => {
  const { racine, chemins } = parc(depots);
  const cible = chemins[depotJuge || Object.keys(depots)[0]];
  return juger(cible, { racineParc: racine });
};

try {
  // ── CP0 : rien à juger n'est SANS OBJET, jamais un PASS ───────────────────────────────────
  check("CP0 — aucun document ne prescrit de commande → SANS_OBJET, pas un PASS complaisant", () => {
    const r = jugerParc({ pilot: { docs: { "LISEZMOI.md": "# Rien de prescrit ici.\n" } } });
    att(r.verdict === "SANS_OBJET", `verdict ${r.verdict}`);
    att(/pas de prescription à juger/.test(regle(r, "CP0").message), "le motif n'est pas écrit");
  });

  // ── CP1 : la commande prescrite résout ───────────────────────────────────────────────────
  check("CP1 ROUGE — une commande prescrite qui ne résout NULLE PART : DOIT ÉCHOUER, avec sa ligne", () => {
    const r = jugerParc({ pilot: { docs: { "REGLES.md": "Doctrine.\n\n```\nnode oracles\\oracle-fantome.mjs <x>\n```\n" } } });
    att(echoue(r, "CP1"), "CP1 a absous une commande morte");
    att(/oracle-fantome\.mjs/.test(regle(r, "CP1").message), "le chemin fautif n'est pas NOMMÉ");
    att(/REGLES\.md:4/.test(regle(r, "CP1").message), `la LIGNE n'est pas localisée — ${regle(r, "CP1").ou}`);
    att(/module introuvable/.test(regle(r, "CP1").message), "le motif ne dit pas ce que le producteur obtient");
  });

  check("CP1 VERT — une commande qui résout dans le dépôt lui-même", () => {
    const r = jugerParc({ pilot: { docs: { "REGLES.md": "node oracles\\oracle-vrai.mjs <x>\n" }, scripts: { "oracles/oracle-vrai.mjs": "// vrai\n" } } });
    att(passe(r, "CP1"), `CP1 ${JSON.stringify(regle(r, "CP1"))}`);
  });

  check("CP1 VERT — calibrage réel : une commande qui ne résout que dans un dépôt FRÈRE du parc est JUSTE", () => {
    // Les trois cas mesurés le 22/09 : `scripts\capturer.mjs` et `oracles\oracle-exposition.mjs`
    // vivent chez digit-ai-forge-websec, `oracles\rendu-comparatif.mjs` chez digit-ai-forge-design.
    const r = jugerParc({
      pilot: { docs: { "ETAPES.md": "Depuis `<racine>\\digit-ai-forge-websec` :\n\nnode scripts\\capturer.mjs <url>\n" } },
      "digit-ai-forge-websec": { scripts: { "scripts/capturer.mjs": "// capture\n" } },
    });
    att(passe(r, "CP1"), `un script d'une forge sœur a été accusé — ${JSON.stringify(regle(r, "CP1"))}`);
  });

  check("CP1 — un DOSSIER portant le nom du script ne compte pas pour un script", () => {
    const { racine, chemins } = parc({ pilot: { docs: { "R.md": "node outils\\truc.mjs\n" } } });
    mkdirSync(join(chemins.pilot, "outils", "truc.mjs"), { recursive: true });
    const r = juger(chemins.pilot, { racineParc: racine });
    att(echoue(r, "CP1"), "un dossier homonyme a été pris pour le script prescrit");
  });

  // ── CP1, les exclusions écrites : chacune DOIT rester silencieuse ────────────────────────
  check("CP1 exclusion — un chemin de convention d'accueil (`forge\\…`) vise l'hôte futur d'un gabarit", () => {
    const r = jugerParc({ pilot: { docs: { "gabarits/LOT.md": "Chez le produit :\n\nnode forge\\retours\\oracle-lot.mjs <lot>\n" } } });
    att(r.verdict === "SANS_OBJET" || passe(r, "CP1"), `un chemin d'hôte futur a été accusé — ${JSON.stringify(regle(r, "CP1"))}`);
    att(estHorsPortee("forge\\retours\\oracle-lot.mjs"), "forge\\… n'est pas écarté");
    att(estHorsPortee(".claude\\skills\\x\\scripts\\self-test.mjs"), ".claude\\… n'est pas écarté");
  });

  check("CP1 exclusion — un chemin sous PLACEHOLDER n'est pas résolu, parce que le résoudre serait l'inventer", () => {
    att(estHorsPortee("<racine>\\oracles\\x.mjs"), "<racine> n'est pas écarté");
    att(estHorsPortee("$FORGE_ROOT/oracles/x.mjs"), "$FORGE_ROOT n'est pas écarté");
  });

  check("CP1 exclusion — un nom NU dont le chemin complet est écrit dans le même document est un raccourci", () => {
    const texte = "Contrat repris de `digit-ai-forge-agents/.claude/skills/forge-agents/scripts/ledger.mjs`.\n\n"
      + "Contrôle : `node ledger.mjs verify <ledger.jsonl>`\n";
    att(estUnRaccourci("ledger.mjs", texte), "le raccourci n'est pas reconnu alors que le chemin complet est à côté");
    const r = jugerParc({ pilot: { docs: { "CONTRAT.md": texte } } });
    att(r.verdict === "SANS_OBJET" || passe(r, "CP1"), `le raccourci a été accusé — ${JSON.stringify(regle(r, "CP1"))}`);
  });

  check("CP1 — mais un nom NU SANS chemin complet à côté reste JUGÉ : le premier jet en retirait 76 d'un coup", () => {
    att(!estUnRaccourci("bootstrap.mjs", "Fraîcheur : `node bootstrap.mjs --pull` à toute ouverture.\n"),
      "`node bootstrap.mjs --pull` est écarté — l'exclusion a repris toute la matière");
    const r = jugerParc({ pilot: { docs: { "CLAUDE.md": "node bootstrap.mjs --pull\n" } } });
    att(echoue(r, "CP1"), "un nom nu sans chemin complet à côté n'est plus jugé du tout");
  });

  // ── CP1/vues générées : les deux jets payés, en fixture ──────────────────────────────────
  check("vue générée — le marqueur en TÊTE écarte le document (une dérivation n'est pas une prescription)", () => {
    const vue = "# Catalogues — vue générée\n\n> **Vue générée** par `catalogues/generer-vues.mjs`.\n\nnode output\\parti.mjs\n";
    att(estUneVueGeneree(vue), "une vraie vue générée n'est pas reconnue");
    const r = jugerParc({ pilot: { docs: { "VUE.md": vue } } });
    att(r.verdict === "SANS_OBJET", `la vue générée a été jugée — ${r.verdict}`);
  });

  check("vue générée — un commentaire HTML d'en-tête compte aussi (forme de todo\\RECIDIVES.md)", () => {
    att(estUneVueGeneree("# Récidives\n\n<!-- VUE GÉNÉRÉE par todo/generer-recidives.mjs — NE PAS ÉDITER. -->\n\nnode x\\y.mjs\n"),
      "le commentaire HTML d'en-tête n'est pas lu");
  });

  check("vue générée — faux négatif n° 1 : « jamais éditée » d'une vue VOISINE n'écarte pas le document", () => {
    const doc = "# TODO-FORGE — registre\n\nRéférence chargée à la demande.\n\nLa vue `TODO.md` (jamais éditée) se régénère.\n\nnode todo\\fantome.mjs\n";
    att(!estUneVueGeneree(doc), "un document qui PARLE d'une vue générée a été écarté (faux négatif payé deux fois)");
    const r = jugerParc({ pilot: { docs: { "TODO-FORGE.md": doc } } });
    att(echoue(r, "CP1"), "le document rédigé à la main n'est plus jugé");
  });

  check("vue générée — faux négatif n° 2 : « régénéré par hook » du noyau n'écarte pas CLAUDE.md", () => {
    att(!estUneVueGeneree("# digit-ai-factory — noyau\n\nUn README.md par dossier, régénéré par hook.\n"),
      "la frontière de mot manque : « régénéré » a été lu comme « généré »");
  });

  // ── CP2 : l'option prescrite est déclarée par le script ──────────────────────────────────
  check("CP2 ROUGE — une option prescrite que le script ne déclare PAS : DOIT ÉCHOUER", () => {
    const r = jugerParc({ pilot: {
      docs: { "R.md": "node oracles\\o.mjs --inconnue\n" },
      scripts: { "oracles/o.mjs": "// ne lit que --connue\nconst x = args.indexOf('--connue');\n" },
    } });
    att(echoue(r, "CP2"), "CP2 a absous une option inconnue du script");
    att(/--inconnue/.test(regle(r, "CP2").message), "l'option fautive n'est pas NOMMÉE");
    att(/silence est pire/.test(regle(r, "CP2").message), "le motif ne dit pas pourquoi l'ignorer en silence est pire qu'échouer");
  });

  check("CP2 VERT — l'option prescrite est déclarée par le script", () => {
    const r = jugerParc({ pilot: {
      docs: { "R.md": "node oracles\\o.mjs --connue\n" },
      scripts: { "oracles/o.mjs": "const x = args.indexOf('--connue');\n" },
    } });
    att(passe(r, "CP2"), `CP2 ${JSON.stringify(regle(r, "CP2"))}`);
  });

  // ── CP3 : l'option prescrite est jouée par le banc — la fixture du remède ────────────────
  check("CP3 ROUGE — une option prescrite et déclarée que le BANC ne joue jamais : DOIT ÉCHOUER", () => {
    const r = jugerParc({ pilot: {
      docs: { "R.md": "node oracles\\o.mjs --rebatir\n" },
      scripts: { "oracles/o.mjs": "args.indexOf('--rebatir');\n" },
      bancs: { "oracles/o.test.mjs": "// joue tout sauf le mode prescrit\n" },
    } });
    att(echoue(r, "CP3"), "CP3 a absous une option que la recette ne joue pas");
    att(/--rebatir/.test(regle(r, "CP3").message), "l'option non jouée n'est pas NOMMÉE");
    att(/fixture du remède/.test(regle(r, "CP3").message), "la règle fondatrice n'est pas citée");
    att(/o\.test\.mjs/.test(regle(r, "CP3").message), "le banc en cause n'est pas nommé");
  });

  check("CP3 VERT — le banc cite l'option prescrite", () => {
    const r = jugerParc({ pilot: {
      docs: { "R.md": "node oracles\\o.mjs --rebatir\n" },
      scripts: { "oracles/o.mjs": "args.indexOf('--rebatir');\n" },
      bancs: { "oracles/o.test.mjs": "lancer('--rebatir', 'x');\n" },
    } });
    att(passe(r, "CP3"), `CP3 ${JSON.stringify(regle(r, "CP3"))}`);
  });

  check("CP3 — un script SANS banc n'est pas accusé ici : son juge est l'invariant I1, et deux vérités valent moins qu'une", () => {
    const r = jugerParc({ pilot: {
      docs: { "R.md": "node oracles\\o.mjs --seule\n" },
      scripts: { "oracles/o.mjs": "args.indexOf('--seule');\n" },
    } });
    att((regle(r, "CP3") || {}).statut === "SANS_OBJET", `CP3 ${JSON.stringify(regle(r, "CP3"))}`);
    att(/ne le maquille pas en PASS/.test(regle(r, "CP3").message), "l'absence de matière est maquillée en PASS");
  });

  // ── périmètre de lecture ─────────────────────────────────────────────────────────────────
  check("les documents d'`output\\` et d'`input\\` ne sont pas lus — livrables et entrants datés, jamais des prescriptions", () => {
    const { racine, chemins } = parc({ pilot: { docs: { "output/PLAN.md": "node oracles\\disparu.mjs\n", "input/ENTRANT.md": "node oracles\\disparu.mjs\n" } } });
    const lus = documents(chemins.pilot);
    att(lus.length === 0, `output/ et input/ ont été lus : ${lus.join(", ")}`);
    const r = juger(chemins.pilot, { racineParc: racine });
    att(r.verdict === "SANS_OBJET", `un livrable daté a été jugé — ${r.verdict}`);
  });

  check("la PROSE n'est pas une prescription — seule la forme `node <script>` est reconnue", () => {
    const r = jugerParc({ pilot: { docs: { "R.md": "Lancez le script de capture, puis relancez l'oracle d'exposition.\n" } } });
    att(r.verdict === "SANS_OBJET", "une prescription en prose a été devinée");
  });

  // ── résolution du parc ───────────────────────────────────────────────────────────────────
  check("racineDuParc — `--parc` prime, puis FORGE_ROOT, puis le parent du dépôt", () => {
    att(racineDuParc("C:/x/y", ["--parc", "C:/z"]).toLowerCase().includes("z"), "--parc n'est pas prioritaire");
  });

  check("depotsDuParc — les dossiers préfixés `_` (sauvegardes, canal, mises de côté) ne sont pas des dépôts frères", () => {
    const { racine } = parc({ pilot: {}, "_sauvegardes": {}, "digit-ai-forge-x": {} });
    const freres = depotsDuParc(racine).map((p) => p.split(/[\\/]/).pop());
    att(freres.includes("digit-ai-forge-x"), "un dépôt frère légitime est ignoré");
    att(!freres.includes("_sauvegardes"), "un dossier de sauvegarde est compté comme dépôt frère");
  });

  // ── honnêteté du contrat ─────────────────────────────────────────────────────────────────
  check("le non_juge déclare la borne du défaut FONDATEUR — l'oracle ne prétend pas couvrir l'exécution sur instance servie", () => {
    att(NON_JUGE.some((l) => /instance servie/.test(l)), "la borne du fait fondateur n'est pas déclarée");
    att(NON_JUGE.some((l) => /PROSE/.test(l)), "la borne de la prose n'est pas déclarée");
  });

  check("un dépôt ENTIÈREMENT conforme rend PASS sur les trois règles — le sens vert de bout en bout", () => {
    const r = jugerParc({ pilot: {
      docs: { "R.md": "node oracles\\o.mjs --connue\n\nnode scripts\\s.mjs\n" },
      scripts: { "oracles/o.mjs": "args.indexOf('--connue');\n", "scripts/s.mjs": "// s\n" },
      bancs: { "oracles/o.test.mjs": "lancer('--connue');\n" },
    } });
    att(r.verdict === "PASS", `verdict ${r.verdict} — ${JSON.stringify(r.findings.filter((f) => f.statut === "FAIL"))}`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nchemin-prescrit (TF-1282) : ${pass} PASS, ${fail} FAIL — couverture à double sens sur CP1, CP2, CP3, plus les 5 calibrages payés sur le dépôt réel`);
process.exit(fail ? 1 : 0);
