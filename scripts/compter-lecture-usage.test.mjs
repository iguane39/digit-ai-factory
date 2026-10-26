#!/usr/bin/env node
/**
 * compter-lecture-usage.test.mjs — le comptage de l'essai « lecteur d'usage de la restitution » (TF-1944, D-84 (a)),
 * dans les deux sens, sur des réponses FABRIQUÉES (aucun lecteur n'est lancé, aucun vrai texte n'est lu).
 *   VERT  : un lecteur qui voit 4 positifs sur 6 et signale 3 textes du banc au plus tient les seuils ; les deux
 *           réponses d'exemple de la rubrique sont valides ; une citation qui perd sa mise en forme se retrouve ;
 *   ROUGE : 3 positifs sur 6, 4 faux signalements, une citation inventée, un signalement hors cible, un manifeste ou
 *           un texte retouché, une lecture d'avant le pré-enregistrement, moins de 6 positifs, une réponse manquante ;
 *   BORNES: 4 sur 6 et 5 sur 7 passent, 3 sur 6 et 4 sur 7 non ; 3 faux signalements passent, 4 non ; la réponse
 *           illisible se rejoue une fois puis compte contre l'essai ; une réponse valide n'est jamais écrasée.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  normaliser, blocs, demandeQuelqueChose, extraireConsigne, extraireJson, validerReponse, jugerReponse, compter,
  vusRequis, empreinte, chargerManifeste, composerAppel, enregistrerReponse, lireReponses, lirePreenregistrement,
  MARQUE_DEBUT, MARQUE_FIN, RUBRIQUE,
} from "./compter-lecture-usage.mjs";

const SCRIPT = fileURLToPath(new URL("./compter-lecture-usage.mjs", import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const egal = (a, b, m) => { if (a !== b) throw new Error(`${m || "écart"} : attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}`); };

const T = mkdtempSync(join(tmpdir(), "lecture-usage-"));
const SEUILS = { positifs_minimum: 6, rappel_reference: { vus: 4, sur: 6 }, faux_signalements_max: 3 };

// ───────────────────────── fabrique d'un espace de travail ─────────────────────────
const textePositif = (k) => `## 3. Décisions attendues de l'humain\n\nAucune.\n\n## 8. Prochaines actions\n\n| A-${k} | relire la page numéro ${k} tag${k} | manuelle_utilisateur | guide de mon message de 21:45 |\n`;
const texteNegatifQuiDemande = (k) => `## 3. Décisions attendues de l'humain\n\n> **D-${k} : faut-il publier le lot numéro ${k} ?**\n\n| Option | Coût |\n|---|---|\n| (a) oui | simple |\n| (b) non | nul |\n\n## 8. Prochaines actions\n\nRien.\n`;
const texteNegatifMuet = (k) => `## 3. Décisions attendues de l'humain\n\nAucune décision attendue.\n\n## 8. Prochaines actions\n\n| A-${k} | tout enregistrer | auto_ia | fait |\n`;

function fabriquer(nom, { positifs = 6, negatifs = 27 } = {}) {
  const d = join(T, nom);
  mkdirSync(join(d, "textes"), { recursive: true });
  const cas = [];
  let n = 0;
  const ajouter = (etiquette, texte, extra = {}) => {
    n++;
    const id = `LU-${String(n).padStart(2, "0")}`;
    writeFileSync(join(d, "textes", `${id}.md`), texte, "utf8");
    cas.push({ id, texte: `textes/${id}.md`, sha256: empreinte(Buffer.from(texte, "utf8")), etiquette, demande_humain: demandeQuelqueChose(texte).demande, provenance: { session: `sess-${n}-confidentielle` }, ...extra });
  };
  for (let k = 1; k <= positifs; k++) ajouter("positif", textePositif(k), { ancres: [`tag${k}`] });
  for (let k = 1; k <= negatifs; k++) ajouter("negatif", k % 2 ? texteNegatifQuiDemande(k) : texteNegatifMuet(k));
  const manifeste = { version: "1.0.0", cas };
  const manifestePath = join(d, "cas.json");
  writeFileSync(manifestePath, JSON.stringify(manifeste, null, 1), "utf8");
  const consigne = "Consigne de test du lecteur.";
  const rubriquePath = join(d, "RUBRIQUE.md");
  writeFileSync(rubriquePath, `# Rubrique\n\n${MARQUE_DEBUT}\n${consigne}\n${MARQUE_FIN}\n`, "utf8");
  const prereg = { seuils: SEUILS, empreintes: { manifeste_cas_json: empreinte(readFileSync(manifestePath)), consigne_lecteur: empreinte(consigne) }, cas: { positifs, negatifs } };
  const preregPath = join(d, "PREENREGISTREMENT.md");
  writeFileSync(preregPath, `# Pré-enregistrement\n\n## Données figées\n\n\`\`\`json\n${JSON.stringify(prereg, null, 1)}\n\`\`\`\n`, "utf8");
  return { d, manifeste, manifestePath, rubriquePath, prereg, preregPath, consigne };
}
const lectureValide = (c, ligne) => ({ id: c.id, lu_le: "2026-10-27T08:00:00.000Z", essai: 1, reponse: { verdict: "signale", signalements: [{ question: 2, ligne_citee: ligne, question_humain: "Où est le contenu ?" }] } });
const lectureMuette = (c) => ({ id: c.id, lu_le: "2026-10-27T08:00:00.000Z", essai: 1, reponse: { verdict: "utilisable", signalements: [] } });
const ligneCible = (k) => `| A-${k} | relire la page numéro ${k} tag${k} | manuelle_utilisateur | guide de mon message de 21:45 |`;
/** Écrit un dossier de réponses : `vus` positifs vus, `faux` négatifs signalés à tort, tout le reste utilisable. */
function repondre(w, nom, { vus, faux, enveloppe = true }) {
  const dossier = join(w.d, nom);
  mkdirSync(dossier, { recursive: true });
  let pos = 0, neg = 0, signales = 0;
  for (const c of w.manifeste.cas) {
    let l;
    if (c.etiquette === "positif") { pos++; l = pos <= vus ? lectureValide(c, ligneCible(pos)) : lectureMuette(c); }
    else {
      neg++;
      // seuls les négatifs de rang impair portent une décision à citer : on signale les `faux` premiers d'entre eux
      if (neg % 2 === 1 && signales < faux) { signales++; l = lectureValide(c, `> **D-${neg} : faut-il publier le lot numéro ${neg} ?**`); }
      else l = lectureMuette(c);
    }
    writeFileSync(join(dossier, `${c.id}.json`), JSON.stringify(enveloppe ? l : l.reponse), "utf8");
  }
  return dossier;
}
const lancer = (args, entree) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", input: entree });
const compterCLI = (w, dossiers, extra = []) => lancer([...dossiers.flatMap((x) => ["--reponses", x]), "--manifeste", w.manifestePath, "--preenregistrement", w.preregPath, "--rubrique", w.rubriquePath, ...extra]);

// ───────────────────────── outils purs ─────────────────────────
check("normaliser : accents, gras, tableau, guillemets typographiques et espaces insécables disparaissent", () => {
  egal(normaliser("| **Relire** la « Semaine 2 » ! |"), 'relire la " semaine 2 " !', "forme normalisée");
});
check("blocs : trois formes de titre numéroté (##, ###, gras) se découpent", () => {
  const b = blocs("## 3. Décisions\nx\n### 8. Actions\ny\n**4. Traité.** z\n");
  if (!/x/.test(b["3"]) || !/y/.test(b["8"]) || !/z/.test(b["4"])) throw new Error(JSON.stringify(b));
});
check("critère VERT : une décision nouvelle, une action manuelle et un guide demandent quelque chose", () => {
  if (!demandeQuelqueChose(texteNegatifQuiDemande(1)).raisons.includes("decision")) throw new Error("décision non vue");
  if (!demandeQuelqueChose(textePositif(1)).raisons.includes("action_humaine")) throw new Error("action manuelle non vue");
  if (!demandeQuelqueChose("## Guide — Activer l'API\n\n1. Ouvrir.\n\n## 3. Décisions\nAucune.\n").raisons.includes("guide")) throw new Error("guide non vu");
});
check("critère ROUGE : un rappel de décision, une action de l'IA et « aucune décision » ne demandent rien", () => {
  const rappel = "## 3. Décisions attendues\n\n**D-5** : sujet du rappel, posée le 18/10 à 10:00, inchangée.\n\n## 8. Prochaines actions\n\n| A-1 | publier | auto_ia | fait |\n";
  egal(demandeQuelqueChose(rappel).demande, false, "rappel seul");
  egal(demandeQuelqueChose(texteNegatifMuet(2)).demande, false, "action de l'IA seule");
});
check("empreinte : fins de ligne et consigne extraite entre les deux repères", () => {
  egal(extraireConsigne(`a\n${MARQUE_DEBUT}\r\nligne 1\r\nligne 2\r\n${MARQUE_FIN}\nb`), "ligne 1\nligne 2", "consigne");
  egal(extraireConsigne("sans repères"), null, "sans repères");
});
check("extraireJson : clôture de code et texte autour acceptés, charabia refusé", () => {
  egal(extraireJson('Voici :\n```json\n{"verdict":"utilisable","signalements":[]}\n```').verdict, "utilisable", "sous clôture");
  egal(extraireJson("pas de json ici"), null, "sans objet");
  egal(extraireJson('{"verdict": '), null, "tronqué");
});

// ───────────────────────── le format de réponse ─────────────────────────
const rubriqueReelle = readFileSync(RUBRIQUE, "utf8");
const exemples = [...rubriqueReelle.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => JSON.parse(m[1]));
check("remède joué : les deux réponses d'exemple de la rubrique sont valides", () => {
  egal(exemples.length, 2, "exemples dans la rubrique");
  for (const e of exemples) { const d = validerReponse(e); if (d.length) throw new Error(d.join(" ; ")); }
});
check("la consigne de la rubrique est extractible et ne porte aucune étiquette de cas", () => {
  const c = extraireConsigne(rubriqueReelle);
  if (!c || c.length < 500) throw new Error("consigne absente ou trop courte");
  if (/positif|négatif|negatif|banc/i.test(c)) throw new Error("la consigne du lecteur nomme les cas ou le banc");
});
check("réponses ROUGES : signale sans signalement, utilisable avec signalement, question 4, ligne vide, plus de 3", () => {
  const s = (o = {}) => ({ question: 1, ligne_citee: "une ligne", question_humain: "pourquoi ?", ...o });
  for (const [nom, r] of [["signale vide", { verdict: "signale", signalements: [] }], ["utilisable plein", { verdict: "utilisable", signalements: [s()] }],
    ["question 4", { verdict: "signale", signalements: [s({ question: 4 })] }], ["ligne vide", { verdict: "signale", signalements: [s({ ligne_citee: " " })] }],
    ["quatre", { verdict: "signale", signalements: [s(), s(), s(), s()] }], ["verdict inconnu", { verdict: "peut-être", signalements: [] }], ["tableau", []]]) {
    if (!validerReponse(r).length) throw new Error(`« ${nom} » devrait être refusée`);
  }
});

// ───────────────────────── le sort d'une réponse ─────────────────────────
const casP = { id: "LU-01", etiquette: "positif", ancres: ["tag1"] };
const casN = { id: "LU-02", etiquette: "negatif" };
const lecture = (reponse) => ({ reponse, lu_le: null, essai: 1, erreurLecture: null });
const sig = (ligne) => ({ verdict: "signale", signalements: [{ question: 2, ligne_citee: ligne, question_humain: "où ?" }] });
check("positif VU : la ligne citée perd son gras et son tableau, elle se retrouve et porte l'ancre", () => {
  egal(jugerReponse(casP, textePositif(1), lecture(sig("A-1 relire la page numéro 1 TAG1 manuelle_utilisateur"))).statut, "vu", "statut");
});
check("positif ROUGE : citation inventée, signalement hors cible, rien signalé", () => {
  egal(jugerReponse(casP, textePositif(1), lecture(sig("cette ligne tag1 n'existe pas dans le texte"))).statut, "signale_ailleurs", "citation inventée");
  egal(jugerReponse(casP, textePositif(1) + "\nAutre ligne sans rapport avec la cible\n", lecture(sig("Autre ligne sans rapport avec la cible"))).statut, "signale_ailleurs", "hors cible");
  egal(jugerReponse(casP, textePositif(1), lecture({ verdict: "utilisable", signalements: [] })).statut, "non_signale", "muet");
});
check("négatif : signalé = faux signalement (même sur une citation inventée), muet = correct, charabia = illisible", () => {
  egal(jugerReponse(casN, texteNegatifMuet(2), lecture(sig("tout enregistrer auto_ia fait"))).statut, "faux_signalement", "signalement réel");
  egal(jugerReponse(casN, texteNegatifMuet(2), lecture(sig("une phrase que le texte ne contient pas"))).statut, "faux_signalement", "citation inventée");
  egal(jugerReponse(casN, texteNegatifMuet(2), lecture({ verdict: "utilisable", signalements: [] })).statut, "correct", "muet");
  egal(jugerReponse(casN, texteNegatifMuet(2), lecture(null)).statut, "illisible", "null");
  egal(jugerReponse(casN, texteNegatifMuet(2), undefined).statut, "manquante", "absente");
});

// ───────────────────────── les seuils, aux bornes ─────────────────────────
check("vusRequis : 4 sur 6, 5 sur 7, 6 sur 8 (la proportion de l'étude, arrondie au-dessus), jamais moins de 4", () => {
  egal(vusRequis(6, SEUILS), 4, "6"); egal(vusRequis(7, SEUILS), 5, "7"); egal(vusRequis(8, SEUILS), 6, "8"); egal(vusRequis(3, SEUILS), 4, "3");
});
const lanceur = (w, series, avant = null) => compter({ manifeste: w.manifeste, base: w.d, prereg: w.prereg, series, avant });
const w6 = fabriquer("six-positifs");
check("VERT : 4 positifs vus sur 6 et 3 faux signalements sur 27 tiennent les seuils", () => {
  const r = lanceur(w6, [lireReponses(repondre(w6, "r-4-3", { vus: 4, faux: 3 }))]);
  egal(r.faux_signalements, 3, "faux signalements"); egal(r.positifs_vus, 4, "vus"); egal(r.verdict, "TENU", "verdict");
});
check("ROUGE : 3 positifs vus sur 6 → au-dessus des seuils", () => {
  const r = lanceur(w6, [lireReponses(repondre(w6, "r-3-0", { vus: 3, faux: 0 }))]);
  egal(r.verdict, "AU_DESSUS_DES_SEUILS", "verdict"); egal(r.seuil_rappel_tenu, false, "rappel");
});
check("ROUGE : 4 faux signalements sur 27 → au-dessus des seuils, même avec les 6 positifs vus", () => {
  const r = lanceur(w6, [lireReponses(repondre(w6, "r-6-4", { vus: 6, faux: 4 }))]);
  egal(r.faux_signalements, 4, "faux signalements"); egal(r.verdict, "AU_DESSUS_DES_SEUILS", "verdict"); egal(r.seuil_faux_tenu, false, "faux");
});
const w7 = fabriquer("sept-positifs", { positifs: 7 });
check("BORNES à 7 positifs : 5 vus tiennent, 4 non (écart déclaré à la lettre « 4 sur 6 »)", () => {
  egal(lanceur(w7, [lireReponses(repondre(w7, "r-5", { vus: 5, faux: 0 }))]).verdict, "TENU", "5 sur 7");
  egal(lanceur(w7, [lireReponses(repondre(w7, "r-4", { vus: 4, faux: 0 }))]).verdict, "AU_DESSUS_DES_SEUILS", "4 sur 7");
});
const w5 = fabriquer("cinq-positifs", { positifs: 5 });
check("moins de 6 positifs : la mesure est donnée mais NON CONCLUANTE", () => {
  const r = lanceur(w5, [lireReponses(repondre(w5, "r-5pos", { vus: 5, faux: 0 }))]);
  egal(r.verdict, "NON_CONCLUANT", "verdict"); egal(r.positifs_vus, 5, "le compte est tout de même rendu");
});
check("réponse manquante : INCOMPLET, jamais un verdict", () => {
  const dossier = repondre(w6, "r-manque", { vus: 6, faux: 0 });
  rmSync(join(dossier, "LU-09.json"));
  const r = lanceur(w6, [lireReponses(dossier)]);
  egal(r.verdict, "INCOMPLET", "verdict"); egal(r.reponses_manquantes, 1, "manquantes");
});
check("réponse illisible : à rejouer une fois (INCOMPLET), puis comptée contre l'essai", () => {
  const dossier = repondre(w6, "r-illisible", { vus: 6, faux: 0 });
  writeFileSync(join(dossier, "LU-03.json"), JSON.stringify({ id: "LU-03", lu_le: "2026-10-27T08:00:00.000Z", essai: 1, reponse: null }), "utf8");
  egal(lanceur(w6, [lireReponses(dossier)]).verdict, "INCOMPLET", "premier essai");
  writeFileSync(join(dossier, "LU-03.json"), JSON.stringify({ id: "LU-03", lu_le: "2026-10-27T08:05:00.000Z", essai: 2, reponse: null }), "utf8");
  const r = lanceur(w6, [lireReponses(dossier)]);
  egal(r.detail["LU-03"].statut, "illisible", "positif illisible au second essai"); egal(r.positifs_vus, 5, "non vu"); egal(r.verdict, "TENU", "5 sur 6 reste au-dessus de 4");
});
check("une lecture datée d'avant le commit du pré-enregistrement invalide la mesure", () => {
  const r = lanceur(w6, [lireReponses(repondre(w6, "r-chrono", { vus: 6, faux: 0 }))], "2026-10-28T00:00:00.000Z");
  egal(r.verdict, "INVALIDE_CHRONOLOGIE", "verdict");
});
check("deux lecteurs d'accord : un positif n'est vu que par les deux, un négatif n'est faux que par les deux", () => {
  const a = lireReponses(repondre(w6, "a-lecteur", { vus: 6, faux: 5 }));
  const b = lireReponses(repondre(w6, "b-lecteur", { vus: 4, faux: 0 }));
  const r = lanceur(w6, [a, b]);
  egal(r.mode, "deux_lecteurs_d_accord", "mode"); egal(r.positifs_vus, 4, "vus par les deux"); egal(r.faux_signalements, 0, "faux par les deux"); egal(r.verdict, "TENU", "verdict");
});

// ───────────────────────── l'intégrité, en ligne de commande ─────────────────────────
check("CLI VERT : le comptage est rendu, exit 0, sans nommer un seul texte", () => {
  const dossier = repondre(w6, "cli-vert", { vus: 5, faux: 1 });
  const r = compterCLI(w6, [dossier]);
  egal(r.status, 0, `exit (${r.stderr})`);
  if (!/verdict : TENU/.test(r.stdout)) throw new Error(r.stdout);
  if (/sess-\d/.test(r.stdout)) throw new Error("la sortie cite une provenance");
});
check("CLI ROUGE : un manifeste retouché après le pré-enregistrement refuse le comptage (exit 1)", () => {
  const dossier = repondre(w6, "cli-manifeste", { vus: 6, faux: 0 });
  const m = JSON.parse(readFileSync(w6.manifestePath, "utf8"));
  const copie = join(w6.d, "cas-retouche.json");
  m.cas[0].etiquette = "negatif"; writeFileSync(copie, JSON.stringify(m, null, 1), "utf8");
  const r = lancer(["--reponses", dossier, "--manifeste", copie, "--preenregistrement", w6.preregPath, "--rubrique", w6.rubriquePath]);
  egal(r.status, 1, "exit"); if (!/empreinte du manifeste/.test(r.stderr)) throw new Error(r.stderr);
});
check("CLI ROUGE : un texte retouché après coup refuse le comptage (exit 1)", () => {
  const w = fabriquer("texte-retouche");
  writeFileSync(join(w.d, "textes", "LU-04.md"), textePositif(4) + "\nune ligne ajoutée après coup\n", "utf8");
  const r = compterCLI(w, [repondre(w, "r", { vus: 6, faux: 0 })]);
  egal(r.status, 1, "exit"); if (!/LU-04 : empreinte du texte/.test(r.stderr)) throw new Error(r.stderr);
});
check("CLI ROUGE : une consigne retouchée dans la rubrique refuse le comptage (exit 1)", () => {
  const w = fabriquer("consigne-retouchee");
  writeFileSync(w.rubriquePath, `# Rubrique\n\n${MARQUE_DEBUT}\nConsigne modifiée après coup.\n${MARQUE_FIN}\n`, "utf8");
  const r = compterCLI(w, [repondre(w, "r", { vus: 6, faux: 0 })]);
  egal(r.status, 1, "exit"); if (!/consigne du lecteur différente/.test(r.stderr)) throw new Error(r.stderr);
});
check("ROUGE : un texte qui porte l'identifiant du cas est refusé (le lecteur y verrait l'ordre de la liste)", () => {
  const w = fabriquer("fuite");
  const t = textePositif(1) + "\nLU-01\n";
  writeFileSync(join(w.d, "textes", "LU-01.md"), t, "utf8");
  const m = JSON.parse(readFileSync(w.manifestePath, "utf8")); m.cas[0].sha256 = empreinte(Buffer.from(t, "utf8"));
  writeFileSync(w.manifestePath, JSON.stringify(m, null, 1), "utf8");
  const c = chargerManifeste(w.manifestePath);
  if (!c.erreurs.some((e) => /LU-01 : le texte porte l'identifiant/.test(e))) throw new Error(c.erreurs.join(" ; "));
});
check("CLI ROUGE : un positif sans ancre est refusé", () => {
  const w = fabriquer("sans-ancre");
  const m = JSON.parse(readFileSync(w.manifestePath, "utf8")); delete m.cas[0].ancres;
  writeFileSync(w.manifestePath, JSON.stringify(m, null, 1), "utf8");
  if (!chargerManifeste(w.manifestePath).erreurs.some((e) => /ancre/.test(e))) throw new Error("ancre absente non vue");
});
check("--lister et --appel : les identifiants sans étiquette, l'invite = consigne + texte, rien d'autre", () => {
  const l = lancer(["--lister", "--manifeste", w6.manifestePath]);
  egal(l.stdout.trim().split("\n").length, 33, "identifiants");
  if (/positif|negatif/i.test(l.stdout)) throw new Error("la liste porte une étiquette");
  const a = lancer(["--appel", "LU-01", "--manifeste", w6.manifestePath, "--rubrique", w6.rubriquePath]);
  egal(a.status, 0, `exit (${a.stderr})`);
  egal(a.stdout, composerAppel(w6.consigne, readFileSync(join(w6.d, "textes", "LU-01.md"), "utf8")), "invite");
  if (/positif|negatif|tag1 .*sess-/i.test(a.stdout.replace(/tag1/, ""))) throw new Error("l'invite porte une étiquette");
});

// ───────────────────────── l'enregistrement des lectures ─────────────────────────
check("enregistrer : sortie sous clôture acceptée, datée ; une réponse valide n'est jamais écrasée", () => {
  const dossier = join(T, "enreg-1"); mkdirSync(dossier);
  const r1 = enregistrerReponse({ id: "LU-05", dossier, brut: 'Voici :\n```json\n{"verdict":"utilisable","signalements":[]}\n```', modele: "x", maintenant: () => "2026-10-27T09:00:00.000Z" });
  egal(r1.valide, true, "valide"); egal(lireReponses(dossier)["LU-05"].lu_le, "2026-10-27T09:00:00.000Z", "datée");
  const r2 = enregistrerReponse({ id: "LU-05", dossier, brut: '{"verdict":"utilisable","signalements":[]}' });
  egal(r2.ecrit, false, "écrasement"); if (!/une seule lecture/.test(r2.raison)) throw new Error(r2.raison);
});
check("enregistrer : illisible → un rejeu, puis plus rien ; un identifiant qui n'est pas neutre est refusé", () => {
  const dossier = join(T, "enreg-2"); mkdirSync(dossier);
  const a = enregistrerReponse({ id: "LU-06", dossier, brut: "pas de json" });
  egal(a.ecrit, true, "premier"); egal(a.valide, false, "premier valide"); egal(a.essai, 1, "essai 1");
  const b = enregistrerReponse({ id: "LU-06", dossier, brut: "toujours pas" });
  egal(b.ecrit, true, "second"); egal(b.essai, 2, "essai 2");
  egal(enregistrerReponse({ id: "LU-06", dossier, brut: '{"verdict":"utilisable","signalements":[]}' }).ecrit, false, "troisième");
  egal(enregistrerReponse({ id: "positif-1", dossier, brut: "{}" }).ecrit, false, "identifiant non neutre");
});
check("enregistrer en ligne de commande : la sortie brute arrive sur l'entrée standard", () => {
  const dossier = join(T, "enreg-3");
  const r = lancer(["--enregistrer", "LU-07", "--dossier", dossier, "--manifeste", w6.manifestePath, "--modele", "essai"], '{"verdict":"utilisable","signalements":[]}');
  egal(r.status, 0, `exit (${r.stderr})`);
  const lu = lireReponses(dossier)["LU-07"]; egal(lu.reponse.verdict, "utilisable", "contenu"); egal(lu.essai, 1, "essai");
  egal(lancer(["--enregistrer", "LU-99", "--dossier", dossier, "--manifeste", w6.manifestePath], "{}").status, 2, "cas inconnu");
});
check("le pré-enregistrement se lit dans son bloc json sous « Données figées »", () => {
  egal(lirePreenregistrement(w6.preregPath).seuils.faux_signalements_max, 3, "seuil");
  let leve = false; try { lirePreenregistrement(join(w6.d, "RUBRIQUE.md")); } catch { leve = true; }
  egal(leve, true, "fichier sans la section");
});

// ───────────────────────── le gel du pré-enregistrement (fichiers réels du dépôt) ─────────────────────────
check("gel : la consigne de la rubrique porte l'empreinte inscrite au pré-enregistrement du 26/10/2026", () => {
  const p = lirePreenregistrement();
  egal(empreinte(extraireConsigne(rubriqueReelle)), p.empreintes.consigne_lecteur, "empreinte de la consigne (rubrique modifiée après le pré-enregistrement ?)");
});
check("gel : les seuils inscrits sont ceux de l'étude (4 sur 6, 3 sur 27, 6 positifs au moins) et 33 cas", () => {
  const p = lirePreenregistrement();
  egal(p.seuils.rappel_reference.vus, 4, "vus"); egal(p.seuils.rappel_reference.sur, 6, "sur");
  egal(p.seuils.faux_signalements_max, 3, "faux max"); egal(p.seuils.textes_du_banc, 27, "banc");
  egal(p.seuils.positifs_minimum, 6, "positifs minimum"); egal(p.cas.positifs + p.cas.negatifs, 33, "cas");
  egal(vusRequis(p.cas.positifs, p.seuils), 4, "vus requis pour les positifs réunis");
});

rmSync(T, { recursive: true, force: true });
console.log(`\ncompter-lecture-usage : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
