#!/usr/bin/env node
/**
 * controle-comprehension.test.mjs — recette de `controle-comprehension.mjs` (TF-2728, TF-2739, 22/11/2026). Aucun appel de modèle : les retours de lecteurs sont des JSON écrits ici.
 *
 * TF-2728 — sens rouge : une phrase jugée inutile, illogique ou mal placée par UN profil rend FAIL avec sa raison ; un « non » sans raison, un profil muet, une phrase non notée, un fil
 * qui ne tient pas : FAIL ; `autoriser` refuse tant qu'aucun PASS n'est inscrit POUR CE TEXTE, refuse après un FAIL, refuse un texte modifié depuis le PASS (l'auteur qui réécrit après
 * coup doit relire), et un FAIL postérieur annule un PASS antérieur. Sens vert : des retours tous « oui » rendent PASS, et le remède que le FAIL propose (reprendre la phrase, relire)
 * mène à l'autorisation (TF-1013).
 * TF-2739 — sens rouge : un élément manqué à la majorité sans rejeu : exit 3, aucune réécriture comptée ; manqué au premier passage ET au rejeu : exit 1, réécriture comptée. Sens vert :
 * un lecteur sur trois qui manque un élément ne fait rien (la majorité tient) ; un élément manqué puis rendu au rejeu est un aléa (exit 0). Le coût en lancements est chiffré.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { autorisation, consignePersona, coutLancements, decider, empreinte, jugerPersonas, manquesALaMajorite, phrases, quorum } from "./controle-comprehension.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "controle-comprehension.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };
const jouer = (...args) => { const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" }); return { code: r.status, out: r.stdout || "", err: r.stderr || "" }; };

const base = mkdtempSync(join(tmpdir(), "controle-comprehension-"));
const TEXTE = "# Le produit en deux mots\n\nLe produit aide un loueur à suivre ses réservations. Il remplace le tableur partagé.\n\n- Le loueur saisit une réservation en trente secondes.\n- Le client reçoit une confirmation par courriel.\n\nUne mutation du schéma est jouée seulement à la demande.\n";
const f = (nom, contenu) => { const c = join(base, nom); writeFileSync(c, contenu, "utf8"); return c; };
const retour = (profil, n, { faux = {}, fil = { tient: true, remarque: "" }, omis = [] } = {}) => ({ profil, phrases: Array.from({ length: n }, (_, i) => i + 1).filter((k) => !omis.includes(k))
  .map((k) => ({ n: k, utile: true, logique: true, bien_placee: true, remarque: "", ...(faux[k] || {}) })), fil });
const TOUS = (n, extra = {}) => ["decideur", "technique", "metier"].map((p) => retour(p, n, extra[p] || {}));

try {
  // ---- le texte ----
  const liste = phrases(TEXTE);
  check("phrases — numérotées de 1 à N, marques de titre et de liste retirées, une phrase par fin de phrase ou par ligne", () => {
    att(liste.length === 6 && liste[0].n === 1 && liste[5].n === 6, `${liste.length} phrases : ${JSON.stringify(liste.map((p) => p.texte))}`);
    att(liste[0].texte === "Le produit en deux mots" && liste[3].texte === "Le loueur saisit une réservation en trente secondes." && !liste.some((p) => /^[-#]/.test(p.texte)), JSON.stringify(liste.map((p) => p.texte)));
    att(phrases("Avant.\n```js\nconst x = 1;\n```\nAprès.").map((p) => p.texte).join("|") === "Avant.|Après.", "un bloc de code est compté comme des phrases");
  });
  check("empreinte — 16 hexadécimaux, stable aux fins de ligne et aux blancs de fin, différente dès qu'un caractère change", () => {
    const e = empreinte(TEXTE);
    att(/^[0-9a-f]{16}$/.test(e), e);
    att(empreinte(TEXTE.replace(/\n/g, "\r\n")) === e && empreinte(`${TEXTE}   \n\n`) === e, "l'empreinte dépend des fins de ligne");
    att(empreinte(TEXTE.replace("trente", "vingt")) !== e, "un caractère modifié ne change pas l'empreinte");
  });

  // ---- TF-2728 : la relecture par personas ----
  check("personas-preparer — une consigne par profil, lecture seule, question centrale « une bonne idée », phrases numérotées ; phrases.json porte l'empreinte", () => {
    const texte = f("texte.md", TEXTE), sortie = join(base, "personas");
    const r = jouer("personas-preparer", "--texte", texte, "--sortie", sortie, "--sujet", "suivi des réservations");
    att(r.code === 0 && /6 phrase\(s\) numérotée\(s\)/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    for (const p of ["decideur", "technique", "metier"]) {
      const c = readFileSync(join(sortie, `consigne-${p}.md`), "utf8");
      att(/Lecture seule/.test(c) && /bonne idée de l'écrire/.test(c) && /\n4\. Le loueur saisit/.test(c) && /suivi des réservations/.test(c) && /utile/.test(c) && /logique/.test(c) && /bien_placee/.test(c), `consigne ${p} : ${c.slice(0, 200)}`);
    }
    att(JSON.parse(readFileSync(join(sortie, "phrases.json"), "utf8")).empreinte === empreinte(TEXTE), "phrases.json ne porte pas l'empreinte");
    att(/technicien/i.test(consignePersona("technique", liste)) && /décideur/i.test(consignePersona("decideur", liste)) && /praticien/i.test(consignePersona("metier", liste)), "les trois profils n'ont pas leur rôle");
  });
  check("rouge — une phrase jugée inutile par UN profil, une phrase illogique, une phrase mal placée : FAIL, avec la phrase, le profil, le critère et la raison", () => {
    const v = jugerPersonas(liste, TOUS(6, { technique: { faux: { 6: { utile: false, remarque: "La mutation n'est jouée qu'à la demande : le lecteur n'en tire rien." } } }, metier: { faux: { 3: { logique: false, remarque: "Le tableur n'a jamais été présenté avant." }, 4: { bien_placee: false, remarque: "Cette phrase décrit la saisie avant la présentation du produit." } } } }));
    att(v.verdict === "FAIL" && v.a_reprendre.length === 3, JSON.stringify(v));
    att(v.a_reprendre.some((x) => x.n === 6 && x.profil === "technique" && x.critere === "utile" && /mutation/.test(x.raison)), JSON.stringify(v.a_reprendre));
    att(v.a_reprendre.some((x) => x.n === 3 && x.critere === "logique") && v.a_reprendre.some((x) => x.n === 4 && x.critere === "bien_placee"), JSON.stringify(v.a_reprendre));
  });
  check("rouge — un « non » sans raison, un profil muet, une phrase non notée, un oui/non absent, un fil qui ne tient pas ou jugé sans raison : FAIL", () => {
    const sansRaison = jugerPersonas(liste, TOUS(6, { decideur: { faux: { 2: { utile: false, remarque: "non" } } } }));
    att(sansRaison.verdict === "FAIL" && sansRaison.incomplets.some((x) => /sans raison/.test(x)) && sansRaison.a_reprendre.length === 0, JSON.stringify(sansRaison));
    const muet = jugerPersonas(liste, TOUS(6).slice(0, 2));
    att(muet.verdict === "FAIL" && muet.incomplets.some((x) => /« metier » n'a rendu aucun retour/.test(x)), JSON.stringify(muet));
    const omise = jugerPersonas(liste, TOUS(6, { technique: { omis: [5, 6] } }));
    att(omise.verdict === "FAIL" && omise.incomplets.some((x) => /n'a pas noté 2 phrase\(s\) sur 6/.test(x)), JSON.stringify(omise));
    const nul = TOUS(6); delete nul[0].phrases[0].logique;
    att(jugerPersonas(liste, nul).incomplets.some((x) => /« logique » n'est ni oui ni non/.test(x)), "un critère absent est accepté");
    const fil = jugerPersonas(liste, TOUS(6, { decideur: { fil: { tient: false, remarque: "On ne sait qu'à la dernière phrase à quoi sert le produit." } } }));
    att(fil.verdict === "FAIL" && fil.fil.length === 1 && fil.fil[0].profil === "decideur", JSON.stringify(fil));
    att(jugerPersonas(liste, TOUS(6, { decideur: { fil: { tient: false, remarque: "" } } })).incomplets.some((x) => /fil refusé sans raison/.test(x)), "un fil refusé sans raison est accepté");
    att(jugerPersonas(liste, TOUS(6).map((r) => ({ ...r, fil: undefined }))).incomplets.length === 3, "un fil non jugé est accepté");
  });
  check("vert — des retours tous « oui » pour les trois profils rendent PASS ; un seul profil attendu aussi (--profils)", () => {
    att(jugerPersonas(liste, TOUS(6)).verdict === "PASS", "PASS attendu");
    att(jugerPersonas(liste, [retour("technique", 6)], ["technique"]).verdict === "PASS", "un profil attendu, un retour : PASS attendu");
  });
  check("autoriser — refuse sans relecture, refuse après un FAIL, refuse un texte modifié depuis le PASS, un FAIL postérieur annule le PASS ; le remède (reprendre la phrase, relire) autorise", () => {
    const journal = join(base, "journal.jsonl"), texte = f("texte-b.md", TEXTE);
    const ecrire = (nom, retours) => retours.map((r, i) => f(`${nom}-${i}.json`, JSON.stringify(r)));
    att(jouer("autoriser", "--texte", texte, "--journal", journal).code === 1 && /aucune relecture par personas/.test(jouer("autoriser", "--texte", texte, "--journal", journal).err), "autorisé sans aucune relecture");
    const mauvais = ecrire("mauvais", TOUS(6, { technique: { faux: { 6: { utile: false, remarque: "La mutation n'est jouée qu'à la demande : inutile ici." } } } }));
    const r1 = jouer("personas-juger", "--texte", texte, "--retours", ...mauvais, "--journal", journal);
    att(r1.code === 1 && /\[À REPRENDRE\] phrase 6, profil technique, utile/.test(r1.out), `exit ${r1.code} : ${r1.out}`);
    att(/est FAIL/.test(jouer("autoriser", "--texte", texte, "--journal", journal).err), "autorisé après un FAIL");
    // Le remède : l'auteur reprend la phrase 6 (la retire), le texte change, les personas relisent le NOUVEAU texte.
    writeFileSync(texte, TEXTE.replace("\nUne mutation du schéma est jouée seulement à la demande.\n", ""), "utf8");
    att(jouer("autoriser", "--texte", texte, "--journal", journal).code === 1, "le texte repris est autorisé sans relecture");
    const bons = ecrire("bons", TOUS(5));
    att(jouer("personas-juger", "--texte", texte, "--retours", ...bons, "--journal", journal).code === 0, "la relecture du texte repris n'est pas PASS");
    const ok = jouer("autoriser", "--texte", texte, "--journal", journal);
    att(ok.code === 0 && /AUTORISÉ/.test(ok.out), `exit ${ok.code} : ${ok.out}${ok.err}`);
    writeFileSync(texte, readFileSync(texte, "utf8").replace("trente", "vingt"), "utf8");
    att(jouer("autoriser", "--texte", texte, "--journal", journal).code === 1, "un texte modifié après le PASS reste autorisé : l'auteur a réécrit sans relire");
    writeFileSync(texte, readFileSync(texte, "utf8").replace("vingt", "trente"), "utf8");
    att(jouer("autoriser", "--texte", texte, "--journal", journal).code === 0, "le texte revenu à l'état relu n'est plus autorisé");
    jouer("personas-juger", "--texte", texte, "--retours", ...ecrire("mauvais2", TOUS(5, { metier: { faux: { 1: { utile: false, remarque: "Le titre n'apprend rien au praticien." } } } })), "--journal", journal);
    att(jouer("autoriser", "--texte", texte, "--journal", journal).code === 1, "un FAIL postérieur n'annule pas le PASS antérieur");
    att(autorisation([], "x").ok === false && autorisation([{ ev: "personas", empreinte: "x", verdict: "PASS", ts: "t" }], "x").ok === true, "autorisation pure");
  });
  check("rouge — usage : mode inconnu, texte absent, retours illisibles, journal manquant : exit 2", () => {
    att(jouer("tuer").code === 2 && jouer("personas-preparer").code === 2 && jouer("autoriser", "--texte", join(base, "texte.md")).code === 2 && jouer("personas-juger", "--texte", join(base, "texte.md")).code === 2, "un usage faux est accepté");
    att(jouer("personas-juger", "--texte", join(base, "texte.md"), "--retours", f("casse.json", "{pas du json")).code === 2, "un retour illisible est accepté");
  });

  // ---- TF-2739 : la majorité et le rejeu ----
  const lect = (...manques) => ({ profils: { technique: [0, 1, 2].map((l) => ({ E1: true, E2: !manques[l], E3: true })), decideur: [0, 1, 2].map(() => ({ E1: true, E2: true, E3: true })) } });
  check("quorum et majorité — 2 lecteurs sur 3 manquent un élément : manqué à la majorité ; 1 sur 3 : le tirage, pas le texte, a varié (rien n'est manqué)", () => {
    att(quorum(3) === 2 && quorum(1) === 1 && quorum(5) === 3, "quorum");
    att(manquesALaMajorite(lect(true, true, false)).technique.length === 1 && manquesALaMajorite(lect(true, false, false)).technique.length === 0, JSON.stringify(manquesALaMajorite(lect(true, false, false))));
    att(manquesALaMajorite({ profils: { technique: [{ E1: false }] } }).technique.length === 1, "un lecteur unique qui manque : manqué (c'est la variance du lecteur unique que la majorité retire)");
  });
  check("decider — PASS sans manque ; REJEU_REQUIS sans rejeu ; ALEA si le rejeu rend l'élément ; MANQUE_CONFIRME si le rejeu le manque aussi ; 1 lecteur sur 3 : PASS", () => {
    att(decider(lect()).statut === "PASS" && decider(lect(true, false, false)).statut === "PASS", "PASS");
    const d1 = decider(lect(true, true, false));
    att(d1.statut === "REJEU_REQUIS" && d1.a_rejouer.length === 1 && d1.a_rejouer[0].element === "E2" && d1.confirmes.length === 0, JSON.stringify(d1));
    const d2 = decider(lect(true, true, false), lect());
    att(d2.statut === "ALEA" && d2.aleas.length === 1 && d2.confirmes.length === 0, JSON.stringify(d2));
    const d3 = decider(lect(true, true, false), lect(false, true, true));
    att(d3.statut === "MANQUE_CONFIRME" && d3.confirmes.length === 1 && d3.confirmes[0].profil === "technique", JSON.stringify(d3));
  });
  check("majorite en ligne de commande — exit 3 sans rejeu (aucune réécriture comptée), exit 0 pour un aléa, exit 1 pour un manque confirmé, exit 0 sans manque", () => {
    const L = (nom, o) => f(nom, JSON.stringify(o));
    const premier = L("l1.json", lect(true, true, false)), propre = L("l0.json", lect()), encore = L("l2.json", lect(true, false, true));
    const sans = jouer("majorite", "--lectures", premier);
    att(sans.code === 3 && /REJEU_REQUIS/.test(sans.out) && /\[À REJOUER\] technique : « E2 »/.test(sans.out), `sans rejeu : exit ${sans.code} ${sans.out}`);
    const alea = jouer("majorite", "--lectures", premier, "--rejeu", propre);
    att(alea.code === 0 && /ALEA/.test(alea.out) && /aucune réécriture ne se compte/.test(alea.out), `aléa : exit ${alea.code} ${alea.out}`);
    const conf = jouer("majorite", "--lectures", premier, "--rejeu", encore);
    att(conf.code === 1 && /MANQUE_CONFIRME/.test(conf.out) && /une réécriture se compte/.test(conf.out), `confirmé : exit ${conf.code} ${conf.out}`);
    att(jouer("majorite", "--lectures", propre).code === 0 && jouer("majorite").code === 2 && jouer("majorite", "--lectures", f("x.json", "[]")).code === 2, "cas limites");
  });
  check("cout — 2 profils × 3 lecteurs : 6 lancements au lieu de 2, 4 de plus, facteur 3 ; le rejeu ajoute 3 par profil concerné ; arguments invalides refusés", () => {
    const c = coutLancements({ profils: 2, lecteurs: 3, rejeux: 1 });
    att(c.majorite === 6 && c.un_lecteur === 2 && c.surcout === 4 && c.facteur === 3 && c.rejeu_par_profil_concerne === 3 && c.total_avec_rejeux === 9, JSON.stringify(c));
    const r = jouer("cout", "--profils", "2", "--lecteurs", "3", "--rejeux", "1");
    att(r.code === 0 && /6 lancement\(s\) au lieu de 2/.test(r.out) && /4 de plus \(facteur 3\)/.test(r.out) && /9 lancement\(s\) en tout/.test(r.out), r.out);
    att(jouer("cout").code === 0 && jouer("cout", "--profils", "0").code === 2 && jouer("cout", "--lecteurs", "x").code === 2, "défauts et arguments invalides");
  });
} finally { rmSync(base, { recursive: true, force: true }); }

console.log(`\ncontrole-comprehension (TF-2728, TF-2739) : ${pass} PASS, ${fail} FAIL — cas rouges : phrase inutile, illogique ou mal placée, non sans raison, profil muet, fil refusé, texte modifié depuis le PASS, élément manqué sans rejeu, manque confirmé`);
process.exit(fail ? 1 : 0);
