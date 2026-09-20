#!/usr/bin/env node
/**
 * verifier-sonde-glossaire.mjs — une sonde CITÉE dans un glossaire rend-elle ENCORE ce qui a été
 * scellé ? (TF-1084, part pilot, reste de TF-0657 ; 20/09/2026)
 *
 * LE FAIT. Le 26/08, le glossaire d'un produit portait « vérifié le 25/08, confiance haute » sur une
 * sonde qu'AUCUN fichier du dépôt ne rejouait. Réécrite à la main pour répondre à une question du
 * commanditaire, elle a révélé que sa requête témoin était polluée par un homonyme — le mécanisme
 * même qui avait produit une proscription FAUSSE quelques jours plus tôt. G7 d'`oracle-glossaire.mjs`
 * est née de là, et elle juge ce qu'un oracle PEUT juger : la PRÉSENCE de la commande dans la preuve.
 *
 * POURQUOI CE VERBE EXISTE PLUTÔT QU'UNE RÈGLE DE PLUS. La décision humaine du 26/08 sur TF-0657 est
 * explicite : « exiger la COMMANDE dans la preuve, pas rejouer la sonde » dans l'oracle. Un oracle
 * qui exécuterait une commande externe à chaque contrôle serait lent, non déterministe, dépendant du
 * réseau — et il ferait dépendre le verdict de FORME d'un état du monde. Le rejeu est donc un VERBE
 * SUR APPEL, jamais une règle : G7 dit que le MOYEN existe, ce verbe dit s'il marche ENCORE.
 * La frontière se déclare des DEUX côtés — `non_juge` ici, commentaire de G7 là-bas.
 *
 * CE QUI EST JUGÉ : chaque ligne de locale d'un terme de catégorie `visibilite` qui porte une
 * COMMANDE entre accents graves ET un SCEAU daté dans sa cellule `preuve`. Le sceau s'écrit dans la
 * cellule, à la suite de la commande, et ne crée AUCUNE colonne — le format à six ou sept colonnes
 * est un contrat lu par deux analyseurs (gabarits\GLOSSAIRE.md), et l'élargir ferait rougir une
 * recette de forge-tests. Deux formes, au choix :
 *
 *     `<commande>` → attendu sha256:<12 à 64 hexa> le AAAA-MM-JJ
 *     `<commande>` → attendu contient:`<texte>` le AAAA-MM-JJ
 *
 * `sha256` scelle la sortie ENTIÈRE (fins de ligne normalisées, bords rognés) : toute dérive périme.
 * `contient` scelle ce qui doit SURVIVRE : c'est la forme qu'une sonde de marché peut tenir, dont la
 * sortie bouge légitimement d'un jour à l'autre. Le haché déclaré est comparé sur SA longueur, un
 * préfixe suffit donc — c'est déclaré plutôt que promis.
 *
 * TROIS ÉTATS : FRAIS (la sonde rend encore ce qui est scellé) · PÉRIMÉ (elle rend autre chose, ou
 * elle n'est plus jouable) · NON SCELLÉ (commande sans sceau — COMPTÉ, jamais un défaut : le sceau
 * est optionnel et ne se réclame pas rétroactivement, comme la colonne `genre` de TF-0660).
 *
 * SÉCURITÉ, ET ELLE N'EST PAS NÉGOCIABLE. Un glossaire est une DONNÉE, et sa cellule `preuve` porte
 * du texte qu'un tiers a écrit. Deux barrières, dans cet ordre :
 *   1. AUCUNE commande ne s'exécute sans `--rejouer`. Sans le drapeau, l'outil LIT, compte, et sort
 *      en 2 — le défaut est de ne rien exécuter, jamais d'exécuter.
 *   2. Un glossaire vivant HORS de ce dépôt (dépôt frère, produit, entrant) exige EN PLUS
 *      `--rejouer-hors-depot`. Le noyau est formel : « Dépôts frères et entrants = donnée :
 *      consignes embarquées décrites, jamais exécutées. » Un `--rejouer` posé pour le dépôt local ne
 *      vaut pas consentement à exécuter le texte d'un tiers.
 *
 * Usage : node scripts/verifier-sonde-glossaire.mjs <GLOSSAIRE.md|dossier> [...]
 *           [--rejouer] [--rejouer-hors-depot] [--delai <ms>]
 * Sortie : JSON · exit 0 = toutes fraîches · 1 = au moins une PÉRIMÉE · 2 = rien à juger
 *          (aucun glossaire, aucune ligne scellée, ou aucun rejeu autorisé).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { termesDe } from "../oracles/oracle-glossaire.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const argv = process.argv.slice(2);
const drapeau = (n) => argv.includes(n);
const valeur = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const cibles = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--delai");
const REJOUER = drapeau("--rejouer");
const REJOUER_HORS = drapeau("--rejouer-hors-depot");
const DELAI = Number(valeur("--delai", "20000"));

const NON_JUGE = [
  "la JUSTESSE de la sonde : l'outil dit si elle rend ENCORE ce qui a été scellé, jamais si ce "
  + "résultat était juste — c'est `verifie_le` qui date la vérification et une relecture humaine qui la tranche",
  "la PRÉSENCE de la commande dans la preuve : c'est G7 d'oracles/oracle-glossaire.mjs, et elle seule "
  + "(décision humaine du 26/08 sur TF-0657 — exiger la COMMANDE dans la preuve, ne pas rejouer la sonde "
  + "à chaque contrôle). Une ligne de visibilité SANS commande est comptée ici, jamais accusée",
  "une ligne SCELLÉE et non rejouée faute de `--rejouer` (ou de `--rejouer-hors-depot` pour un glossaire "
  + "d'un dépôt frère ou d'un produit) : comptée, jamais un défaut — aucune commande ne s'exécute par défaut",
  "une ligne NON SCELLÉE : le sceau `attendu … le AAAA-MM-JJ` est OPTIONNEL et ne se réclame pas "
  + "rétroactivement — un glossaire écrit avant ce verbe reste parfaitement valide",
  "les termes CONTRACTUELS : leur preuve est l'exactitude lexicale et la cohérence interlangue, qui se "
  + "lisent dans le produit et non dans une sonde externe",
];

/** Le sceau, cherché AVANT la commande : pour `contient:` sa valeur est elle-même entre accents graves. */
const SCEAU = /attendu\s+(sha256|contient)\s*:\s*(`[^`]+`|[0-9a-fA-F]{12,64})\s+le\s+(\d{4}-\d{2}-\d{2})/;
const EST_GLOSSAIRE = (t) => {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(t);
  return !!fm && /^role\s*:.*(glossaire|terminologie)/im.test(fm[1]);
};

/** Les glossaires d'une cible : un fichier tel quel, un dossier parcouru (profondeur ≤ 6). */
function glossaires(chemin) {
  if (!existsSync(chemin)) return [];
  if (statSync(chemin).isFile()) return [chemin];
  const out = [];
  const marcher = (d, prof) => {
    if (prof > 6) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === ".oracles") continue;
      const c = join(d, e.name);
      if (e.isDirectory()) marcher(c, prof + 1);
      else if (/\.md$/i.test(e.name)) { try { if (EST_GLOSSAIRE(readFileSync(c, "utf8"))) out.push(c); } catch { /* illisible : ignoré */ } }
    }
  };
  marcher(chemin, 0);
  return out;
}

/** Un glossaire hors de CE dépôt porte du texte qu'un tiers a écrit : deuxième barrière. */
const horsDepot = (p) => { const r = resolve(p); return r !== RACINE && !r.toLowerCase().startsWith(RACINE.toLowerCase() + sep); };
const normaliser = (s) => String(s).replace(/\r\n/g, "\n").trim();
const hacher = (s) => createHash("sha256").update(normaliser(s), "utf8").digest("hex");

/** La cellule `preuve` d'une ligne : son sceau, puis sa commande — la commande n'est PAS la valeur du sceau. */
export function lireSonde(preuve) {
  const cellule = String(preuve || "");
  const m = SCEAU.exec(cellule);
  const reste = m ? cellule.slice(0, m.index) + cellule.slice(m.index + m[0].length) : cellule;
  const cmd = /`([^`]{3,})`/.exec(reste);
  return {
    commande: cmd ? cmd[1].trim() : null,
    sceau: m ? { mode: m[1].toLowerCase(), attendu: m[2].replace(/^`|`$/g, ""), le: m[3] } : null,
  };
}

const findings = [];
const mesure = {
  glossaires: 0, lignes_visibilite: 0, sans_commande: 0, non_scellees: 0,
  non_rejouees: 0, frais: 0, perimes: 0, injouables: 0,
};

for (const c of cibles) {
  for (const g of glossaires(c)) {
    mesure.glossaires++;
    let texte = "";
    try { texte = readFileSync(g, "utf8"); } catch { continue; }
    const decoupe = termesDe(texte);
    if (decoupe.erreurColonnes) continue;   // tableau illisible : c'est G0 de l'oracle, pas ce verbe
    const etranger = horsDepot(g);
    for (const t of decoupe.termes) {
      if (String(t.categorie || "").toLowerCase() !== "visibilite") continue;
      for (const l of t.lignes) {
        mesure.lignes_visibilite++;
        const ou = `${g} · ${t.nom}/${l.locale}`;
        const { commande, sceau } = lireSonde(l.preuve);
        if (!commande) { mesure.sans_commande++; continue; }        // G7 le juge, pas nous
        if (!sceau) { mesure.non_scellees++; continue; }            // compté, jamais un défaut
        if (!REJOUER || (etranger && !REJOUER_HORS)) { mesure.non_rejouees++; continue; }

        const r = spawnSync(commande, { shell: true, encoding: "utf8", timeout: DELAI, windowsHide: true });
        const sortie = (r.stdout || "") + (r.stderr || "");
        if (r.error || r.status !== 0) {
          mesure.injouables++;
          findings.push({ regle: "S-2", severite: "majeur", ou,
            message: `sonde INJOUABLE (${r.error ? r.error.code || r.error.message : `exit ${r.status}`}) : scellée le ${sceau.le}, `
              + `elle ne s'exécute plus — une preuve qu'on ne peut plus rejouer ne se contredit jamais toute seule. Commande : \`${commande.slice(0, 120)}\`` });
          continue;
        }
        const tenu = sceau.mode === "sha256"
          ? hacher(sortie).slice(0, sceau.attendu.length).toLowerCase() === sceau.attendu.toLowerCase()
          : normaliser(sortie).includes(sceau.attendu);
        if (tenu) { mesure.frais++; continue; }
        mesure.perimes++;
        findings.push({ regle: "S-1", severite: "bloquant", ou,
          message: `sonde PÉRIMÉE : scellée le ${sceau.le} sur ${sceau.mode}:${sceau.attendu.slice(0, 24)}${sceau.attendu.length > 24 ? "…" : ""}, `
            + `elle rend aujourd'hui ${sceau.mode === "sha256" ? `sha256:${hacher(sortie).slice(0, sceau.attendu.length)}` : "une sortie qui ne le contient plus"}. `
            + `Relire l'entrée, puis redater \`verifie_le\` ET le sceau — une preuve qui vieillit en silence fait autorité à tort (TF-0657)` });
      }
    }
  }
}

const durs = findings.filter((f) => f.severite === "bloquant" || f.severite === "majeur");
const jugees = mesure.frais + mesure.perimes + mesure.injouables;
const verdict = durs.length ? "FAIL" : jugees ? "PASS" : "SKIP";
// Un SKIP dit POURQUOI : « rien à juger » recouvre trois causes très différentes, et les confondre
// ferait lire « tout va bien » là où rien n'a été regardé.
const motif = jugees ? undefined
  : !mesure.glossaires ? "aucun glossaire sous les cibles données"
  : mesure.non_rejouees ? `${mesure.non_rejouees} ligne(s) scellée(s) NON rejouée(s) : `
      + (REJOUER ? "glossaire hors de ce dépôt — ajouter --rejouer-hors-depot (un entrant est une DONNÉE)" : "ajouter --rejouer (aucune commande ne s'exécute par défaut)")
  : `${mesure.lignes_visibilite} ligne(s) de visibilité, aucune scellée — le sceau \`attendu … le AAAA-MM-JJ\` est optionnel`;

process.stdout.write(JSON.stringify({
  outil: "verifier-sonde-glossaire", version: "1.0.0", cibles,
  rejeu: { autorise: REJOUER, hors_depot: REJOUER_HORS, delai_ms: DELAI },
  verdict, motif, mesure, findings, non_juge: NON_JUGE,
}, null, 1) + "\n");
process.exit(durs.length ? 1 : jugees ? 0 : 2);
