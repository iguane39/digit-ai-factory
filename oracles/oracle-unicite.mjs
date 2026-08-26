#!/usr/bin/env node
/**
 * oracle-unicite.mjs — l'unicité a DEUX AXES, et n'en câbler qu'un rend l'autre invisible
 * AVEC L'APPARENCE D'ÊTRE COUVERT.
 *
 * Pourquoi il existe (TF-0669, lot Produit-02 20260826h du 26/08/2026).
 *
 * LE FAIT FONDATEUR. Un contrôle de production levait une erreur franche sur « cette page porte
 * le même titre que celle-là » : l'unicité ENTRE LIVRABLES était câblée, jouée en intégration
 * continue, et rouge quand elle cassait. AUCUN contrôle de la chaîne ne jugeait l'unicité DANS
 * UN LIVRABLE — ni le vérificateur de pages, ni celui des catalogues de langue, ni celui des
 * traductions, ni l'audit navigateur, ni les pans de la forge de tests.
 *
 * MESURE : **70 pages sur 203** portaient le même surtitre DEUX FOIS. Sept ont été corrigées, 63
 * déclarées en arbitrage éditorial ouvert. Et le balayage qui les trouve toutes tient en **six
 * lignes**, sur le HTML déjà présent sur disque, sans navigateur.
 *
 * LE MÉCANISME EST LE VRAI SUJET, et il vaut au-delà de ce cas : *personne n'a payé ces six
 * lignes PARCE QUE LA DIRECTION INVERSE DU MÊME CONTRÔLE EXISTAIT DÉJÀ.* Voir « unicité des
 * titres » dans un catalogue d'oracles donne le sentiment que la classe est couverte. Une moitié
 * de classe invisible est plus dangereuse qu'une classe non couverte : rien n'alerte, et le
 * catalogue lui-même sert d'alibi.
 *
 * D'OÙ LA FORME DE CET ORACLE. Il ne juge pas du HTML : il est **paramétré par le sélecteur** de
 * l'élément dont l'unicité est attendue, et **il rend TOUJOURS SES DEUX AXES** — U1 entre
 * livrables, U2 dans un livrable. Quand un axe n'a pas de sens pour un relevé, il n'est pas
 * omis : il est déclaré SANS_OBJET **avec son motif**. C'est la loi transverse n° 3 appliquée à
 * une classe de défauts plutôt qu'à une surface — l'oubli n'existe pas, et un axe absent est
 * indiscernable d'un axe oublié.
 *
 * La classe est INDÉPENDANTE DU FORMAT : titres de sections répétés dans un document généré,
 * identifiants réutilisés, lignes dupliquées dans un tableau de restitution, mêmes clés dans deux
 * blocs d'un fichier de configuration.
 *
 * Règles :
 *   U1  unicité ENTRE LIVRABLES — une même valeur relevée dans deux fichiers distincts ;
 *   U2  unicité DANS UN LIVRABLE — une même valeur relevée deux fois dans le même fichier ;
 *   U3  l'axe non jugé par le relevé choisi est DÉCLARÉ, jamais tu — sans quoi cet oracle
 *       reproduirait le défaut qu'il corrige.
 *
 * CE QU'IL NE FAIT PAS. Il ne dit pas si une répétition est FAUTIVE : deux pages qui partagent
 * l'intertitre « Contact » sont normales, et c'est pourquoi chaque relevé déclare les axes sur
 * lesquels il se prononce. Il ne rend jamais PASS sur un relevé qui n'a rien extrait : rien
 * extrait n'est pas rien à dire (exit 2).
 *
 * Usage : node oracle-unicite.mjs <fichier|dossier> [--releve <nom>] [--motif <regex>]
 *                                 [--perimetre <regex>] [--json] [--self-test]
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readdirSync, readFileSync, statSync, mkdtempSync,
         writeFileSync, mkdirSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/**
 * Les RELEVÉS connus. Chacun déclare son extracteur, les extensions qu'il sait lire, et — le
 * champ qui porte toute la doctrine — les AXES SUR LESQUELS IL SE PRONONCE.
 *
 * `axes` n'est pas une commodité de configuration : c'est l'aveu, écrit une fois pour toutes,
 * de la moitié de classe qu'un relevé donné ne couvre pas. Le motif accompagne l'aveu, parce
 * qu'un « sans objet » sans raison est indiscernable d'un oubli.
 */
const RELEVES = {
  "titre-html": {
    quoi: "le contenu de <title>",
    exts: [".html", ".htm"],
    extraire: (t) => [...t.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => m[1]),
    axes: { U1: true, U2: true },
    motif_hors_axe: null,
  },
  "intertitre-html": {
    quoi: "le texte des <h2> et <h3>",
    exts: [".html", ".htm"],
    extraire: (t) => [...t.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => m[1]),
    axes: { U1: false, U2: true },
    motif_hors_axe: "deux pages peuvent légitimement porter le même intertitre — « Contact », "
      + "« Tarifs » — et l'exiger unique entre livrables accuserait un site normal",
  },
  "id-html": {
    quoi: "la valeur des attributs id",
    exts: [".html", ".htm"],
    extraire: (t) => [...t.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]),
    axes: { U1: false, U2: true },
    motif_hors_axe: "un identifiant HTML doit être unique DANS un document ; le même identifiant "
      + "sur deux pages est la norme, pas un défaut",
  },
  "titre-markdown": {
    quoi: "le texte des titres ## à ######",
    exts: [".md"],
    extraire: (t) => [...t.matchAll(/^#{2,6}\s+(.+?)\s*$/gm)].map((m) => m[1]),
    axes: { U1: false, U2: true },
    motif_hors_axe: "deux documents portent couramment une section « Contrôle » ou « Risques » — "
      + "c'est même ce qu'un gabarit produit",
  },
};

/** Normalise une valeur relevée : balises retirées, espaces réduits, casse ignorée. */
const normaliser = (v) => v.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ")
  .replace(/\s+/g, " ").trim().toLowerCase();

/** Les fichiers à lire — un fichier tel quel, un dossier balayé récursivement. */
function fichiersDe(cible, exts) {
  if (statSync(cible).isFile()) return [cible];
  const trouves = [];
  const parcourir = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (["node_modules", ".git", "old"].includes(e.name)) continue;
        parcourir(p);
      } else if (exts.includes(extname(e.name).toLowerCase())) trouves.push(p);
    }
  };
  parcourir(cible);
  return trouves.sort();
}

export function juger(cible, { releve = "titre-html", motif = null, perimetre = null } = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message, ou) => findings.push({ regle, statut: "FAIL", message, ou });
  const so = (regle, message) => findings.push({ regle, statut: "SANS_OBJET", message });

  let spec = RELEVES[releve];
  if (motif) {
    // LE SÉLECTEUR LIBRE. L'appelant a choisi ce dont l'unicité est attendue : les DEUX axes
    // sont donc jugés. C'est la seule configuration où l'oracle ne s'excuse d'aucune moitié.
    let re;
    try { re = new RegExp(motif, "gm"); }
    catch (e) {
      return [{ regle: "U0", statut: "NON_JUGEABLE",
        message: `motif illisible : ${e.message} — aucune mesure n'est tentée` }];
    }
    spec = {
      quoi: `le groupe capturant de /${motif}/`,
      exts: [".html", ".htm", ".md", ".json", ".txt", ".mjs", ".js", ".py"],
      extraire: (t) => [...t.matchAll(re)].map((m) => (m[1] !== undefined ? m[1] : m[0])),
      axes: { U1: true, U2: true },
      motif_hors_axe: null,
    };
  }
  if (!spec) {
    return [{ regle: "U0", statut: "NON_JUGEABLE",
      message: `relevé inconnu : « ${releve} ». Connus : ${Object.keys(RELEVES).join(", ")} — `
        + "ou `--motif <regex>` pour un sélecteur libre" }];
  }

  const fichiers = fichiersDe(cible, spec.exts);
  if (!fichiers.length) {
    return [{ regle: "U0", statut: "NON_JUGEABLE",
      message: `aucun fichier ${spec.exts.join("/")} sous ${cible} — le relevé « ${releve} » `
        + "n'a rien à lire, et rien à lire n'est pas rien à dire" }];
  }

  // Un relevé par fichier. On garde la forme BRUTE de la première occurrence pour le message :
  // accuser avec la valeur normalisée ferait chercher une chaîne qui n'est pas dans le fichier.
  const parFichier = new Map();
  const brutes = new Map();
  let total = 0;
  for (const f of fichiers) {
    const valeurs = spec.extraire(readFileSync(f, "utf8"));
    const comptes = new Map();
    for (const v of valeurs) {
      const n = normaliser(v);
      if (!n) continue;
      total += 1;
      comptes.set(n, (comptes.get(n) || 0) + 1);
      if (!brutes.has(n)) brutes.set(n, v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
    }
    parFichier.set(f, comptes);
  }
  if (!total) {
    return [{ regle: "U0", statut: "NON_JUGEABLE",
      message: `${fichiers.length} fichier(s) lus, AUCUNE valeur relevée pour « ${releve} » `
        + `(${spec.quoi}) — un relevé vide ne rend pas PASS` }];
  }

  const nom = (f) => { try { return relative(process.cwd(), f) || f; } catch { return f; } };

  // ---- U1 : entre livrables, DANS UN MÊME PÉRIMÈTRE -------------------------------------
  //
  // LE PÉRIMÈTRE N'EST PAS UNE OPTION DE CONFORT, et c'est la mesure qui l'a établi. Lancé sans
  // lui sur un site réel de 203 pages, cet oracle a dénoncé CINQ titres partagés — « Dinan — Aux
  // Portes de la Baie » vu en allemand, en anglais et en espagnol. Toutes JUSTES : un nom propre
  // ne se traduit pas, et l'unicité des titres s'attend DANS une langue, pas à travers les
  // langues. Un contrôle de production voisin, vert depuis des mois, avait déjà ce découpage ;
  // le mien ne l'avait pas, et il aurait accusé un site sain.
  //
  // Sans `--perimetre`, TOUS les livrables sont comparés entre eux — et l'oracle le DIT dans son
  // message, parce qu'un périmètre implicite est un faux positif qui attend son corpus.
  if (spec.axes.U1) {
    let groupe = () => "tous";
    if (perimetre) {
      let rp;
      try { rp = new RegExp(perimetre); }
      catch (e) {
        return [{ regle: "U0", statut: "NON_JUGEABLE",
          message: `périmètre illisible : ${e.message} — aucune mesure n'est tentée` }];
      }
      // Un fichier hors périmètre n'est pas SILENCIEUSEMENT écarté : il forme son propre groupe
      // nommé, et le compte des groupes est rendu. Un fichier qu'on cesse de comparer sans le
      // dire est un fichier qu'on cesse de contrôler sans le savoir.
      groupe = (f) => { const m = rp.exec(f); return m ? (m[1] !== undefined ? m[1] : m[0]) : "hors-perimetre"; };
    }
    const porteurs = new Map();
    for (const [f, comptes] of parFichier)
      for (const n of comptes.keys()) {
        const cle = `${groupe(f)}\u0000${n}`;
        porteurs.set(cle, [...(porteurs.get(cle) || []), f]);
      }
    const partages = [...porteurs].filter(([, fs]) => fs.length > 1);
    const groupes = new Set([...parFichier.keys()].map(groupe));
    const ou_ = perimetre ? `${groupes.size} périmètre(s)` : "UN SEUL périmètre implicite (tous les livrables)";
    if (partages.length) ko("U1",
      `${partages.length} valeur(s) relevées dans PLUSIEURS livrables d'un MÊME périmètre — `
      + `${spec.quoi} doit y être unique. Découpage : ${ou_}`,
      partages.slice(0, 5).map(([cle, fs]) =>
        `« ${brutes.get(cle.split("\u0000")[1])} » → ${fs.slice(0, 3).map(nom).join(", ")}`).join(" · "));
    else ok("U1", `${porteurs.size} valeur(s) distinctes sur ${fichiers.length} livrable(s) répartis en `
      + `${ou_}, aucune partagée${perimetre ? "" : " — SANS découpage déclaré : sur un corpus multilingue, "
      + "exiger un titre unique À TRAVERS les langues accuserait un site sain (`--perimetre`)"}`);
  } else {
    so("U1", `axe NON JUGÉ pour le relevé « ${releve} » : ${spec.motif_hors_axe}. `
      + "L'axe est déclaré et non tu — un axe absent est indiscernable d'un axe oublié (U3)");
  }

  // ---- U2 : dans un livrable -----------------------------------------------------------
  if (spec.axes.U2) {
    const fautifs = [];
    for (const [f, comptes] of parFichier)
      for (const [n, c] of comptes) if (c > 1) fautifs.push({ f, n, c });
    if (fautifs.length) ko("U2",
      `${fautifs.length} valeur(s) relevées PLUSIEURS FOIS dans le même livrable — c'est l'axe `
      + "que la direction inverse du contrôle laissait invisible tout en paraissant le couvrir",
      fautifs.slice(0, 5).map((x) => `${nom(x.f)} : « ${brutes.get(x.n)} » ×${x.c}`).join(" · "));
    else ok("U2", `aucune valeur répétée à l'intérieur d'un livrable (${total} relevée(s))`);
  } else {
    so("U2", `axe NON JUGÉ pour le relevé « ${releve} » : ${spec.motif_hors_axe}. `
      + "L'axe est déclaré et non tu (U3)");
  }

  // ---- U3 : les deux axes ont parlé ----------------------------------------------------
  const vus = new Set(findings.map((f) => f.regle));
  if (vus.has("U1") && vus.has("U2"))
    ok("U3", "les DEUX axes de l'unicité sont rendus — jugés ou déclarés sans objet, jamais tus");
  else ko("U3", "un axe de l'unicité n'a pas été rendu — c'est exactement le défaut que cet "
    + "oracle corrige, et il l'aurait reproduit");
  return findings;
}

const NON_JUGE = [
  "unicite : cet oracle ne dit pas si une répétition est FAUTIVE — deux pages qui partagent "
  + "l'intertitre « Contact » sont normales. C'est le RELEVÉ qui porte le jugement, en déclarant "
  + "les axes sur lesquels il se prononce ; l'oracle ne le devine pas",
  "unicite : les relevés HTML lisent le fichier SUR DISQUE, sans navigateur — un élément inséré "
  + "par du script à l'affichage n'est pas vu, et ne peut pas l'être ici",
  "unicite : SANS `--perimetre`, l'axe U1 compare TOUS les livrables entre eux. Sur un corpus "
  + "multilingue c'est un faux positif garanti — mesuré : 5 titres de ville dénoncés à tort sur "
  + "un site de 203 pages, parce qu'un nom propre ne se traduit pas. Le découpage se DÉCLARE ; "
  + "l'oracle ne le devine pas, et il dit dans son message lequel il a employé",
  "unicite : la comparaison se fait sur la valeur NORMALISÉE (balises retirées, espaces réduits, "
  + "casse ignorée). Deux valeurs qui ne diffèrent que par la casse sont tenues pour la MÊME — "
  + "c'est un choix, et il rend l'oracle plus sévère, jamais plus permissif",
];

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.some((x) => x.statut === "NON_JUGEABLE") ? "NON_JUGEABLE"
    : f.every((x) => x.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS");

// ------------------------------------------------------------------------------------------
// Self-test — double sens sur CHAQUE axe, plus les bornes
// ------------------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  const dir = mkdtempSync(join(tmpdir(), "unicite-"));
  const page = (titre, h2a, h2b, ids = ["a", "b"]) =>
    `<html><head><title>${titre}</title></head><body>`
    + `<h2 id="${ids[0]}">${h2a}</h2><h2 id="${ids[1]}">${h2b}</h2></body></html>`;

  // VERTE : deux pages, titres distincts, intertitres distincts DANS chaque page. Les deux
  // pages partagent l'intertitre « Contact » — LÉGITIME, et c'est ce que l'axe U1 du relevé
  // « intertitre-html » déclare ne pas juger. La fixture verte porte donc la situation qui
  // FERAIT rougir un oracle naïf : c'est ce qui prouve que le sans-objet n'est pas décoratif.
  const vDir = join(dir, "verte");
  const rDir = join(dir, "rouge");
  for (const d of [vDir, rDir]) mkdirSync(d, { recursive: true });
  writeFileSync(join(vDir, "a.html"), page("Page A", "Séjour", "Contact"), "utf8");
  writeFileSync(join(vDir, "b.html"), page("Page B", "Tarifs", "Contact"), "utf8");

  // ROUGE : chaque défaut porte sur UN axe et laisse l'autre mesurable — la leçon de la fixture
  // où un défaut retirait à une autre règle sa cible.
  //  · a.html et b.html partagent le TITRE          → U1 du relevé « titre-html »
  //  · a.html répète le même intertitre deux fois   → U2 du relevé « intertitre-html »
  writeFileSync(join(rDir, "a.html"), page("Même titre", "Séjour", "Séjour"), "utf8");
  writeFileSync(join(rDir, "b.html"), page("Même titre", "Tarifs", "Contact"), "utf8");

  const moi = fileURLToPath(import.meta.url);
  const jouer = (d, ...opts) =>
    spawnSync(process.execPath, [moi, d, ...opts, "--json"], { encoding: "utf8" });
  const casse = [];
  const exige = (cond, quoi) => { if (!cond) casse.push(quoi); };

  const vT = jouer(vDir, "--releve", "titre-html");
  const vI = jouer(vDir, "--releve", "intertitre-html");
  exige(vT.status === 0, "fixture VERTE, relevé titre : ne passe pas — " + vT.stdout.slice(0, 300));
  exige(vI.status === 0, "fixture VERTE, relevé intertitre : ne passe pas — " + vI.stdout.slice(0, 300));
  // LE CAS QUI PORTE TOUTE LA DOCTRINE : l'axe non jugé est DÉCLARÉ, pas absent.
  exige(/"U1"[^}]*SANS_OBJET/.test(vI.stdout),
    "l'axe U1 du relevé « intertitre-html » n'est pas déclaré SANS_OBJET — un axe tu est "
    + "indiscernable d'un axe oublié, et l'oracle reproduirait son propre défaut");
  exige(/"U3"[^}]*PASS/.test(vI.stdout), "U3 ne confirme pas que les deux axes ont parlé");

  const rT = jouer(rDir, "--releve", "titre-html");
  const rI = jouer(rDir, "--releve", "intertitre-html");
  exige(rT.status === 1 && /"U1"[^}]*FAIL/.test(rT.stdout),
    "fixture ROUGE : le titre partagé entre deux pages n'est pas dénoncé (U1)");
  exige(rI.status === 1 && /"U2"[^}]*FAIL/.test(rI.stdout),
    "fixture ROUGE : l'intertitre répété DANS une page n'est pas dénoncé (U2) — c'est le fait "
    + "fondateur, 70 pages sur 203");
  // ET LA PREUVE QUE LES DEUX AXES SONT INDÉPENDANTS : la rouge passe U2 sur les titres
  // (aucune page n'a deux <title>) tout en échouant U1. Un oracle qui confondrait les axes
  // rougirait partout et ne prouverait rien.
  exige(/"U2"[^}]*PASS/.test(rT.stdout),
    "fixture ROUGE, relevé titre : U2 devrait PASSER — les axes ne sont pas indépendants");

  // BORNES.
  const vide = join(dir, "vide");
  mkdirSync(vide, { recursive: true });
  writeFileSync(join(vide, "c.html"), "<html><body><p>rien</p></body></html>", "utf8");
  const rVide = jouer(vide, "--releve", "titre-html");
  exige(rVide.status === 2, "un relevé qui n'extrait RIEN doit rendre 2, jamais PASS");
  const rInconnu = jouer(vDir, "--releve", "n-importe-quoi");
  exige(rInconnu.status === 2, "un relevé inconnu doit rendre 2 et nommer les relevés connus");
  // LE PÉRIMÈTRE, DANS LES DEUX SENS — et ce cas n'est pas théorique : il fige une accusation
  // FAUSSE réellement produite. Lancé sans découpage sur un site de 203 pages, cet oracle a
  // dénoncé cinq titres de ville partagés entre l'allemand, l'anglais et l'espagnol. Toutes
  // justes : un nom propre ne se traduit pas. Deux répertoires de langue portant le même titre
  // sont donc SAINS quand le périmètre est déclaré, et FAUTIFS quand il ne l'est pas.
  const pDir = join(dir, "perimetre");
  mkdirSync(join(pDir, "fr"), { recursive: true });
  mkdirSync(join(pDir, "en"), { recursive: true });
  writeFileSync(join(pDir, "fr", "granville.html"), page("Granville", "A", "B"), "utf8");
  writeFileSync(join(pDir, "en", "granville.html"), page("Granville", "C", "D"), "utf8");
  const pSans = jouer(pDir, "--releve", "titre-html");
  const pAvec = jouer(pDir, "--releve", "titre-html", "--perimetre", "perimetre.([a-z]{2}).");
  exige(pSans.status === 1 && /"U1"[^}]*FAIL/.test(pSans.stdout),
    "sans périmètre déclaré, deux livrables de langues différentes au même titre doivent être "
    + "dénoncés — c'est la borne qui rend le découpage NÉCESSAIRE, pas confortable");
  exige(pAvec.status === 0,
    "avec le périmètre déclaré, le même corpus doit PASSER — sinon l'option ne découpe rien");
  // ET LE MESSAGE DIT LEQUEL A ÉTÉ EMPLOYÉ : un découpage implicite est un faux positif qui
  // attend son corpus, et le lecteur doit pouvoir le voir sans relire le code.
  exige(/périmètre implicite/.test(pSans.stdout),
    "sans découpage, le message ne le déclare pas — le lecteur ne peut pas savoir ce qui a été comparé");
  exige(/2 périmètre/.test(pAvec.stdout),
    "avec découpage, le nombre de périmètres n'est pas rendu");

  const rMotif = jouer(rDir, "--motif", "<h2[^>]*>([^<]+)</h2>");
  exige(/"U1"[^}]*(FAIL|PASS)/.test(rMotif.stdout),
    "le sélecteur libre doit JUGER les deux axes — l'appelant a choisi ce qu'il attend unique");

  console.log(casse.filter(Boolean).length
    ? "SELF-TEST FAIL : " + casse.filter(Boolean).join(" · ")
    : "Self-test unicite : 14/14 PASS (verte PASS sur les deux relevés ; l'axe U1 d'« intertitre-html » "
      + "DÉCLARÉ sans objet ; rouge FAIL sur U1 titre partagé et sur U2 intertitre répété, avec U2 des "
      + "titres au VERT — axes indépendants ; relevé vide et relevé inconnu rendent 2 ; sélecteur libre "
      + "juge les deux axes ; PÉRIMÈTRE joué dans les deux sens — même titre en deux "
      + "langues FAUTIF sans découpage, SAIN avec, et le message dit lequel a servi)");
  process.exit(casse.filter(Boolean).length ? 1 : 0);
}


const cible = args.find((a) => !a.startsWith("--"));
const idx = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-unicite", verdict: "ERREUR",
    message: "cible introuvable — usage : node oracle-unicite.mjs <fichier|dossier> "
      + "[--releve <nom>] [--motif <regex>] | --self-test" }));
  process.exit(2);
}
const findings = juger(cible, { releve: idx("--releve") || "titre-html", motif: idx("--motif"),
                               perimetre: idx("--perimetre") });
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-unicite", version: "1.0.0", cible,
  releve: idx("--motif") ? `motif:${idx("--motif")}` : (idx("--releve") || "titre-html"),
  verdict, findings, non_juge: NON_JUGE }, null, 1));
process.exit(verdict === "FAIL" ? 1 : verdict === "NON_JUGEABLE" ? 2 : 0);
