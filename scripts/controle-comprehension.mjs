#!/usr/bin/env node
/**
 * controle-comprehension.mjs — ce que le pilot fournit autour d'un contrôle de compréhension de texte : la relecture par personas AVANT le contrôle (TF-2728), la décision
 * à la majorité de trois lecteurs et le rejeu avant de compter une réécriture (TF-2739), et le coût chiffré de cette redondance. Aucun appel de modèle : les lecteurs se lancent
 * par `scripts\lecteur-isole.mjs` (commande sans clé d'API) ou par l'agent `relecteur` ; ce module prépare leurs consignes et juge leurs retours.
 *
 * LE FAIT, le 14/11/2026 (run forge-digit-ai-fr-20261114a). (TF-2728) Après 6 tours du contrôle de compréhension, le créateur rejette le texte : « Est-ce qu'un persona d'un tech ou
 * d'un décideur a relu ces phrases et s'est dit que c'était une bonne idée ? » Le contrôle cherchait des ÉLÉMENTS ATTENDUS : il ne juge ni l'utilité, ni la logique, ni la place d'une
 * phrase ; une phrase sur la mutation, jouée seulement à la demande, a passé. 4 versions du même texte rejetées en une journée, 31 lancements de contrôle dépensés sur des versions
 * refusées (rapporté par le produit, non recompté ici). (TF-2739) Un seul lecteur par profil rend un verdict qui varie d'un tirage à l'autre : deux textes qui ne différaient que de
 * 2 phrases de présentation (71 puis 65 mots) ont donné 8 sur 8 puis Q2 manquée chez les 2 lecteurs ; le lecteur technique perdait un élément aux tours 2 à 4 alors que sa phrase
 * était restée sur la page. Avec la borne de 2 réécritures, le contrôle pousse à réécrire un texte correct.
 *
 * Modes :
 *   node scripts\controle-comprehension.mjs personas-preparer --texte <f> --sortie <dossier> [--sujet "<sujet>"] [--profils decideur,technique,metier]
 *        numérote les phrases du texte et écrit, par profil, la consigne d'un relecteur en lecture seule (note CHAQUE phrase : utile, logique, bien placée ; juge le fil) ;
 *   node scripts\controle-comprehension.mjs personas-juger --texte <f> --retours <retour.json> [<retour.json> …] [--profils …] [--journal <f>]
 *        juge les retours : FAIL (exit 1) si une phrase est jugée inutile, illogique ou mal placée (avec sa raison), si le fil ne tient pas, ou si un profil n'a pas noté toutes les
 *        phrases ; inscrit le verdict au journal, lié à l'empreinte du texte ;
 *   node scripts\controle-comprehension.mjs autoriser --texte <f> --journal <f>
 *        exit 0 SEULEMENT si le journal porte un verdict PASS de la relecture par personas pour CE texte, tel qu'il est : le contrôle de compréhension ne se lance pas avant ;
 *   node scripts\controle-comprehension.mjs majorite --lectures <f.json> [--rejeu <f.json>]
 *        décide à la majorité des lecteurs de chaque profil ; un élément manqué à la majorité est REJOUÉ avant de compter une réécriture (exit 3 « REJEU REQUIS » sans rejeu) ;
 *        exit 1 seulement pour un manque CONFIRMÉ (manqué à la majorité au premier passage ET au rejeu) ; exit 0 sinon ;
 *   node scripts\controle-comprehension.mjs cout [--profils <n>] [--lecteurs <n>] [--rejeux <n>]
 *        le surcoût en lancements, à écrire dans l'autorisation de dépense.
 * Format de `--lectures` : { "profils": { "<profil>": [ { "<élément>": true|false, … }, … un objet par lecteur ] } } ; `--rejeu` : la même forme.
 * Format d'un retour de persona : { "profil": "decideur", "phrases": [ { "n": 1, "utile": true, "logique": true, "bien_placee": true, "remarque": "" } ], "fil": { "tient": true, "remarque": "" } }.
 *
 * L'EMPREINTE du texte (FNV-1a 64 bits sur le texte normalisé) lie un verdict à un texte précis : elle n'est PAS cryptographique et ne prouve aucune intégrité, elle empêche
 * seulement qu'un avis donné sur une version serve pour une autre. NON JUGÉ : que les retours viennent de lecteurs réels et indépendants (la relecture indépendante reste une
 * affirmation de celui qui lance les lecteurs) ; la qualité des consignes de profil au-delà de leur forme ; le seuil de majorité au-delà du cas à 3 lecteurs.
 * Exit : 0 · 1 verdict défavorable · 2 usage · 3 rejeu requis.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PROFILS_PAR_DEFAUT = ["decideur", "technique", "metier"];
export const LECTEURS_PAR_PROFIL = 3;
export const REMARQUE_MIN = 10;

// ---------- le texte ----------

/** Le texte normalisé : fins de ligne unifiées, blancs de fin retirés. */
export const normaliser = (texte) => String(texte ?? "").replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim();

/** Empreinte FNV-1a 64 bits (hexadécimal, 16 caractères) du texte normalisé. Non cryptographique. */
export function empreinte(texte) {
  let h = 0xcbf29ce484222325n;
  for (const o of new TextEncoder().encode(normaliser(texte))) { h ^= BigInt(o); h = (h * 0x100000001b3n) & 0xffffffffffffffffn; }
  return h.toString(16).padStart(16, "0");
}

/** Les phrases numérotées d'un texte : blocs de code retirés, marques de liste ou de titre retirées, coupe aux fins de phrase et aux sauts de ligne. */
export function phrases(texte) {
  const sansCode = normaliser(texte).replace(/```[\s\S]*?```/g, "\n");
  const brutes = sansCode.split("\n").flatMap((ligne) => ligne.replace(/^\s*(?:#{1,6}\s+|[-*+]\s+|>\s*|\d+[.)]\s+)/, "").split(/(?<=[.!?…])\s+/));
  return brutes.map((p) => p.trim()).filter((p) => /[\p{L}\p{N}]/u.test(p)).map((p, i) => ({ n: i + 1, texte: p }));
}

// ---------- la relecture par personas (TF-2728) ----------

const PERSONAS = {
  decideur: "un DÉCIDEUR, non technicien, qui lit ce texte pour décider s'il le comprend, s'il s'y fie et ce qu'il doit en faire",
  technique: "un TECHNICIEN, qui doit mettre en œuvre ou vérifier ce que le texte décrit et qui repère ce qui est vague, faux ou inutile",
  metier: "un PRATICIEN DU MÉTIER du sujet, qui vit le résultat au quotidien et repère ce qui sonne creux ou ce qui manque à son quotidien",
};

/** La consigne d'UN relecteur de profil, en lecture seule. */
export function consignePersona(profil, liste, sujet = "") {
  const qui = PERSONAS[profil] || `un lecteur de profil « ${profil} »`;
  return [
    `Tu es ${qui}${sujet ? ` (sujet : ${sujet})` : ""}. Lecture seule : tu n'écris aucun fichier, même temporaire, et tu ne lances aucune commande.`,
    "Question centrale : en relisant chaque phrase, te dis-tu que c'était une bonne idée de l'écrire, pour un lecteur comme toi ? Tu ne cherches PAS des éléments attendus : tu juges chaque phrase et le fil.",
    "Pour CHAQUE phrase numérotée ci-dessous, réponds par trois oui ou non :",
    "- utile : la phrase t'apprend-elle ce dont tu as besoin, que le reste du texte ne dit pas déjà ?",
    "- logique : découle-t-elle de ce qui précède, sans saut, sans contradiction, sans terme jamais défini ?",
    "- bien_placee : est-elle au bon endroit du fil, ou faut-il la déplacer, la fondre ou la retirer ?",
    `Un « non » exige une remarque d'au moins ${REMARQUE_MIN} caractères qui dit pourquoi. Puis juge le fil entier : « tient » ou « ne tient pas », avec la raison.`,
    "Rends UNIQUEMENT ce bloc JSON, sans texte autour :",
    `{"profil": "${profil}", "phrases": [{"n": 1, "utile": true, "logique": true, "bien_placee": true, "remarque": ""}, …une entrée par phrase…], "fil": {"tient": true, "remarque": ""}}`,
    "",
    `Les ${liste.length} phrases du texte :`,
    ...liste.map((p) => `${p.n}. ${p.texte}`),
  ].join("\n");
}

/**
 * Juge les retours de personas contre les phrases du texte. Rend { verdict, a_reprendre: [{ n, profil, critere, raison }], incomplets: [string], fil: [{ profil, raison }] }.
 * FAIL quand une phrase est jugée par un profil inutile, illogique ou mal placée ; quand un « non » n'a pas de raison (une critique sans raison ne se reprend pas) ; quand le fil ne
 * tient pas pour un profil ; quand un profil attendu n'a rendu aucun retour ou n'a pas noté toutes les phrases.
 */
export function jugerPersonas(liste, retours, profilsAttendus = PROFILS_PAR_DEFAUT) {
  const aReprendre = [], incomplets = [], fil = [];
  const parProfil = new Map();
  for (const r of retours) if (r && typeof r.profil === "string") parProfil.set(r.profil, r);
  for (const profil of profilsAttendus) {
    const r = parProfil.get(profil);
    if (!r || !Array.isArray(r.phrases)) { incomplets.push(`le profil « ${profil} » n'a rendu aucun retour exploitable`); continue; }
    const notees = new Map(r.phrases.filter((x) => x && Number.isInteger(x.n)).map((x) => [x.n, x]));
    const manquantes = liste.filter((p) => !notees.has(p.n)).map((p) => p.n);
    if (manquantes.length) incomplets.push(`le profil « ${profil} » n'a pas noté ${manquantes.length} phrase(s) sur ${liste.length} (n° ${manquantes.slice(0, 12).join(", ")}${manquantes.length > 12 ? "…" : ""})`);
    for (const p of liste) {
      const x = notees.get(p.n);
      if (!x) continue;
      for (const critere of ["utile", "logique", "bien_placee"]) {
        if (typeof x[critere] !== "boolean") { incomplets.push(`profil « ${profil} », phrase ${p.n} : « ${critere} » n'est ni oui ni non`); continue; }
        if (x[critere] === false) {
          const raison = String(x.remarque ?? "").trim();
          if (raison.length < REMARQUE_MIN) incomplets.push(`profil « ${profil} », phrase ${p.n} : « ${critere} » refusé sans raison d'au moins ${REMARQUE_MIN} caractères`);
          else aReprendre.push({ n: p.n, profil, critere, raison });
        }
      }
    }
    if (!r.fil || typeof r.fil.tient !== "boolean") incomplets.push(`le profil « ${profil} » n'a pas jugé le fil (fil.tient absent)`);
    else if (r.fil.tient === false) {
      const raison = String(r.fil.remarque ?? "").trim();
      if (raison.length < REMARQUE_MIN) incomplets.push(`profil « ${profil} » : fil refusé sans raison d'au moins ${REMARQUE_MIN} caractères`);
      else fil.push({ profil, raison });
    }
  }
  return { verdict: aReprendre.length || incomplets.length || fil.length ? "FAIL" : "PASS", a_reprendre: aReprendre, incomplets, fil };
}

// ---------- la majorité et le rejeu (TF-2739) ----------

/** Le quorum d'une majorité de `n` lecteurs : plus de la moitié. */
export const quorum = (n) => Math.floor(n / 2) + 1;

/** Par profil, les éléments MANQUÉS à la majorité : un élément est manqué quand au moins `quorum` lecteurs sur `n` ne l'ont pas rendu. */
export function manquesALaMajorite(lectures) {
  const sortie = {};
  for (const [profil, lecteurs] of Object.entries(lectures?.profils ?? {})) {
    const elements = new Set(lecteurs.flatMap((l) => Object.keys(l)));
    const manques = [];
    for (const e of [...elements].sort()) {
      const non = lecteurs.filter((l) => l[e] !== true).length;
      if (non >= quorum(lecteurs.length)) manques.push({ element: e, non, sur: lecteurs.length });
    }
    sortie[profil] = manques;
  }
  return sortie;
}

/**
 * La décision après un premier passage et, quand il y a des manques, un rejeu. Rend { statut, confirmes, aleas, a_rejouer }.
 *   PASS             : aucun élément manqué à la majorité au premier passage ;
 *   REJEU_REQUIS     : des éléments manqués, aucun rejeu fourni : une réécriture ne se compte pas encore ;
 *   MANQUE_CONFIRME  : au moins un élément manqué à la majorité au premier passage ET au rejeu : une réécriture se compte ;
 *   ALEA             : manqués au premier passage, rendus à la majorité au rejeu : le tirage, pas le texte, a varié ; aucune réécriture ne se compte.
 */
export function decider(premier, rejeu = null) {
  const m1 = manquesALaMajorite(premier);
  const aRejouer = Object.entries(m1).flatMap(([profil, l]) => l.map((x) => ({ profil, element: x.element })));
  if (!aRejouer.length) return { statut: "PASS", confirmes: [], aleas: [], a_rejouer: [] };
  if (!rejeu) return { statut: "REJEU_REQUIS", confirmes: [], aleas: [], a_rejouer: aRejouer };
  const m2 = manquesALaMajorite(rejeu);
  const confirmes = [], aleas = [];
  for (const x of aRejouer) (m2[x.profil] || []).some((y) => y.element === x.element) ? confirmes.push(x) : aleas.push(x);
  return { statut: confirmes.length ? "MANQUE_CONFIRME" : "ALEA", confirmes, aleas, a_rejouer: aRejouer };
}

/** Le coût en lancements d'un contrôle : { un_lecteur, majorite, surcout, facteur, rejeu_par_profil_concerne }. */
export function coutLancements({ profils = 2, lecteurs = LECTEURS_PAR_PROFIL, rejeux = 0 } = {}) {
  const base = profils, majorite = profils * lecteurs;
  return { un_lecteur: base, majorite, surcout: majorite - base, facteur: lecteurs, rejeu_par_profil_concerne: lecteurs, rejeux, total_avec_rejeux: majorite + rejeux * lecteurs };
}

// ---------- le journal (TF-2728) ----------

const lireJournal = (chemin) => (existsSync(chemin) ? readFileSync(chemin, "utf8").split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : []);

/** Le dernier verdict de personas inscrit pour cette empreinte : { ok, raison }. Seul un PASS pour CETTE empreinte autorise. */
export function autorisation(journal, emp) {
  const evs = journal.filter((e) => e.ev === "personas" && e.empreinte === emp);
  if (!evs.length) return { ok: false, raison: `aucune relecture par personas n'est inscrite pour ce texte (empreinte ${emp}) : le texte a changé depuis, ou la relecture n'a pas eu lieu` };
  const dernier = evs[evs.length - 1];
  return dernier.verdict === "PASS" ? { ok: true, raison: `relecture par personas PASS du ${dernier.ts} pour ce texte (empreinte ${emp})` }
    : { ok: false, raison: `la dernière relecture par personas de ce texte (${dernier.ts}) est FAIL : ${dernier.a_reprendre} phrase(s) à reprendre, ${dernier.incomplets} retour(s) incomplet(s), ${dernier.fil} fil(s) refusé(s) ; reprendre les phrases, puis relire` };
}

// ---------- la ligne de commande ----------

function arg(a, nom) { const i = a.indexOf(nom); return i >= 0 && a[i + 1] && !a[i + 1].startsWith("--") ? a[i + 1] : null; }
function listeArgs(a, nom) { const i = a.indexOf(nom); const out = []; if (i < 0) return out; for (let k = i + 1; k < a.length && !a[k].startsWith("--"); k++) out.push(a[k]); return out; }

export function principal(a, sortie = (t) => process.stdout.write(t + "\n"), erreur = (t) => process.stderr.write(t + "\n")) {
  const mode = a[0];
  const usage = (m) => { erreur(`controle-comprehension : ${m}`); return 2; };
  const profils = (arg(a, "--profils") || PROFILS_PAR_DEFAUT.join(",")).split(",").map((s) => s.trim()).filter(Boolean);
  const lireTexte = () => { const f = arg(a, "--texte"); if (!f) return { erreur: "--texte <fichier> manque" }; if (!existsSync(resolve(f))) return { erreur: `texte absent : ${resolve(f)}` }; return { texte: readFileSync(resolve(f), "utf8"), chemin: resolve(f) }; };
  const lireJson = (f) => { try { return JSON.parse(readFileSync(resolve(f), "utf8")); } catch { return null; } };
  if (mode === "personas-preparer") {
    const t = lireTexte(); if (t.erreur) return usage(t.erreur);
    const dossier = arg(a, "--sortie"); if (!dossier) return usage("--sortie <dossier> manque");
    const liste = phrases(t.texte);
    if (!liste.length) return usage("le texte ne porte aucune phrase");
    mkdirSync(resolve(dossier), { recursive: true });
    writeFileSync(join(resolve(dossier), "phrases.json"), JSON.stringify({ empreinte: empreinte(t.texte), phrases: liste }, null, 1) + "\n", "utf8");
    for (const p of profils) writeFileSync(join(resolve(dossier), `consigne-${p}.md`), consignePersona(p, liste, arg(a, "--sujet") || "") + "\n", "utf8");
    sortie(`${liste.length} phrase(s) numérotée(s), empreinte ${empreinte(t.texte)} ; consignes écrites dans ${resolve(dossier)} : ${profils.map((p) => `consigne-${p}.md`).join(", ")}. Les lancer par l'agent « relecteur » (lecture seule), puis juger les retours (personas-juger).`);
    return 0;
  }
  if (mode === "personas-juger") {
    const t = lireTexte(); if (t.erreur) return usage(t.erreur);
    const fichiers = listeArgs(a, "--retours"); if (!fichiers.length) return usage("--retours <retour.json> [<retour.json> …] manque");
    const retours = fichiers.map(lireJson);
    if (retours.some((r) => r === null)) return usage("un retour n'est pas un JSON lisible");
    const liste = phrases(t.texte);
    const v = jugerPersonas(liste, retours, profils);
    const journal = arg(a, "--journal");
    if (journal) appendFileSync(resolve(journal), JSON.stringify({ ev: "personas", ts: new Date().toISOString(), empreinte: empreinte(t.texte), verdict: v.verdict, profils, a_reprendre: v.a_reprendre.length, incomplets: v.incomplets.length, fil: v.fil.length }) + "\n", "utf8");
    sortie(`relecture par personas : ${v.verdict} — ${liste.length} phrase(s), ${profils.length} profil(s), ${v.a_reprendre.length} phrase(s) à reprendre, ${v.incomplets.length} retour(s) incomplet(s), ${v.fil.length} fil(s) refusé(s)`);
    for (const x of v.a_reprendre) sortie(`  [À REPRENDRE] phrase ${x.n}, profil ${x.profil}, ${x.critere} : ${x.raison}`);
    for (const x of v.fil) sortie(`  [FIL] profil ${x.profil} : ${x.raison}`);
    for (const x of v.incomplets) sortie(`  [INCOMPLET] ${x}`);
    return v.verdict === "PASS" ? 0 : 1;
  }
  if (mode === "autoriser") {
    const t = lireTexte(); if (t.erreur) return usage(t.erreur);
    const journal = arg(a, "--journal"); if (!journal) return usage("--journal <fichier> manque");
    const r = autorisation(lireJournal(resolve(journal)), empreinte(t.texte));
    (r.ok ? sortie : erreur)(`${r.ok ? "AUTORISÉ" : "REFUSÉ"} : ${r.raison}`);
    return r.ok ? 0 : 1;
  }
  if (mode === "majorite") {
    const f1 = arg(a, "--lectures"); if (!f1) return usage("--lectures <fichier.json> manque");
    const premier = lireJson(f1); if (!premier?.profils) return usage("--lectures : JSON illisible ou sans « profils »");
    const f2 = arg(a, "--rejeu");
    const rejeu = f2 ? lireJson(f2) : null; if (f2 && !rejeu?.profils) return usage("--rejeu : JSON illisible ou sans « profils »");
    const d = decider(premier, rejeu);
    sortie(`décision à la majorité : ${d.statut}`);
    for (const x of d.confirmes) sortie(`  [MANQUE CONFIRMÉ] ${x.profil} : « ${x.element} » manqué à la majorité au premier passage ET au rejeu : une réécriture se compte`);
    for (const x of d.aleas) sortie(`  [ALÉA] ${x.profil} : « ${x.element} » manqué au premier passage, rendu à la majorité au rejeu : aucune réécriture ne se compte`);
    if (d.statut === "REJEU_REQUIS") { for (const x of d.a_rejouer) sortie(`  [À REJOUER] ${x.profil} : « ${x.element} »`); sortie("  Rejouer ces éléments avec les mêmes lecteurs avant de compter une réécriture (--rejeu)."); }
    return d.statut === "REJEU_REQUIS" ? 3 : d.statut === "MANQUE_CONFIRME" ? 1 : 0;
  }
  if (mode === "cout") {
    const n = (nom, def) => { const v = arg(a, nom); return v === null ? def : Number(v); };
    const p = n("--profils", 2), l = n("--lecteurs", LECTEURS_PAR_PROFIL), r = n("--rejeux", 0);
    if (![p, l, r].every((x) => Number.isInteger(x) && x >= 0) || p < 1 || l < 1) return usage("--profils, --lecteurs et --rejeux attendent des entiers (profils et lecteurs au moins 1)");
    const c = coutLancements({ profils: p, lecteurs: l, rejeux: r });
    sortie(`coût d'un contrôle à ${l} lecteur(s) par profil, ${p} profil(s) : ${c.majorite} lancement(s) au lieu de ${c.un_lecteur} avec un seul lecteur par profil, soit ${c.surcout} de plus (facteur ${c.facteur}) ; un rejeu d'élément manqué ajoute ${c.rejeu_par_profil_concerne} lancement(s) par profil concerné${r ? ` (${r} rejeu(x) : ${c.total_avec_rejeux} lancement(s) en tout)` : ""}. À inscrire dans l'autorisation de dépense avant le premier contrôle.`);
    return 0;
  }
  return usage(`mode inconnu « ${mode ?? ""} » — personas-preparer | personas-juger | autoriser | majorite | cout`);
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) process.exit(principal(process.argv.slice(2)));
