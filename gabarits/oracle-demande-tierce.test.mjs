#!/usr/bin/env node
/**
 * oracle-demande-tierce.test.mjs — recette à double sens du juge de forme des demandes à une équipe
 * tierce (TF-1517, TF-1544, TF-1603, TF-1604, TF-1513). Joué par `oracles\self-tests.mjs` (I2).
 *
 * Chaque règle a une fixture ROUGE qui la fait échouer SEULE, et le remède que son message propose
 * est joué et doit PASSER. Les deux fichiers de `oracles\fixtures\demande-tierce-*.md` servent de
 * témoins : la verte passe, la rouge reprend les défauts du 01/10/2026 et en relève au moins quinze.
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifier, mesurerStatut, lireNoms, enContrat, ORACLE, VERSION, EXCLUS, BORNE_PHRASES, BORNE_MOTS } from "./oracle-demande-tierce.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const VERTE = readFileSync(join(ICI, "..", "oracles", "fixtures", "demande-tierce-verte.md"), "utf8").replace(/\r\n/g, "\n");
const ROUGE = readFileSync(join(ICI, "..", "oracles", "fixtures", "demande-tierce-rouge.md"), "utf8").replace(/\r\n/g, "\n");

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const echecs = (r) => r.constats.filter((c) => c.statut === "FAIL").map((c) => c.regle);
const seul = (r, regle) => { const e = echecs(r); att(e.length > 0 && e.every((x) => x === regle), `attendu ${regle} seul, obtenu [${e.join(",")}] : ${JSON.stringify(r.constats.filter((c) => c.statut === "FAIL").map((c) => c.message))}`); };

const STATUT_VERT = "Aujourd'hui, l'application utilise un identifiant provisoire, car son inscription n'existe pas encore. La chaîne crée la fiche au lancement, et l'application affichera alors le formulaire d'approbation à la première visite.";
const avecStatut = (s) => VERTE.replace(STATUT_VERT, s);
const avec = (ajout) => VERTE.replace("2. Choisir la branche", `${ajout}\n2. Choisir la branche`);

try {
  check("verte — la fixture verte passe sur les cinq règles", () => {
    const r = verifier(VERTE);
    att(r.verdict === "PASS", `verdict ${r.verdict} : ${JSON.stringify(echecs(r))}`);
    att(["T1", "T2", "T3", "T4", "T5"].every((x) => r.constats.some((c) => c.regle === x && c.statut === "PASS")), "une règle n'a pas rendu PASS");
  });
  check("rouge — la fixture rouge est refusée sur T2 à T5 et relève au moins quinze écarts", () => {
    const r = verifier(ROUGE, { noms: ["Camille"] });
    att(r.verdict === "FAIL", "la rouge passe");
    for (const t of ["T2", "T3", "T4", "T5"]) att(echecs(r).includes(t), `${t} ne s'est pas déclenché`);
    att(echecs(r).length >= 15, `${echecs(r).length} écarts seulement`);
  });

  // ---- T1 ----
  check("rouge T1 — une partie absente échoue seule et se nomme", () => {
    const r = verifier(VERTE.replace("Étapes suivantes\n", "Suite\n"));
    seul(r, "T1");
    att(/Étapes suivantes/.test(r.constats.find((c) => c.regle === "T1").message), "la partie absente n'est pas nommée");
  });
  check("rouge T1 — les parties dans le désordre échouent seules", () => {
    const t = VERTE.replace("Étapes suivantes", "@@A").replace("Vérification finale", "Étapes suivantes").replace("@@A", "Vérification finale");
    seul(verifier(t), "T1");
  });
  check("verte T1 — un titre en gras ou précédé de « ## » est reconnu", () => {
    const t = VERTE.replace("Prochaines étapes\n", "## **Prochaines étapes**\n").replace("Vérification finale\n", "4. Vérification finale :\n");
    att(verifier(t).verdict === "PASS", "titre décoré refusé");
  });

  // ---- T2 ----
  check("rouge T2 — un statut sans situation d'aujourd'hui échoue seul", () => {
    seul(verifier(avecStatut("L'application a un identifiant provisoire. La chaîne crée la fiche.")), "T2");
  });
  check("rouge T2 — un statut sans effet de l'action échoue seul", () => {
    seul(verifier(avecStatut("Aujourd'hui, l'application a un identifiant provisoire, car son inscription manque.")), "T2");
  });

  // ---- T3 : les mesures du 01/10/2026 ----
  check("rouge T3 — un statut de 5 phrases échoue seul (RA-72)", () => {
    const s = "Aujourd'hui, l'identifiant est provisoire. La revue est faite. Les correctifs sont fusionnés. La chaîne crée la fiche. Le formulaire s'affichera ensuite.";
    seul(verifier(avecStatut(s)), "T3");
  });
  check("rouge T3 — un statut de 4 phrases, celui de 16h38, échoue seul", () => {
    const s = "Aujourd'hui, l'identifiant est provisoire. La chaîne crée la fiche. Le formulaire s'affichera. La page reste accessible.";
    seul(verifier(avecStatut(s)), "T3");
  });
  check("rouge T3 — plus de 80 mots en 3 phrases échoue seul", () => {
    const long = Array.from({ length: 78 }, (_, i) => `mot${i}`).join(" ");
    const s = `Aujourd'hui, ${long}. La chaîne crée la fiche. Le formulaire s'affichera.`;
    att(mesurerStatut(s).mots > BORNE_MOTS && mesurerStatut(s).phrases <= BORNE_PHRASES, "fixture mal construite");
    seul(verifier(avecStatut(s)), "T3");
  });
  check("verte T3 — le remède (3 phrases, 80 mots au plus) passe", () => {
    const m = mesurerStatut(STATUT_VERT);
    att(m.phrases <= 3 && m.mots <= 80, `mesure ${JSON.stringify(m)}`);
    att(verifier(VERTE).verdict === "PASS", "le statut court est refusé");
  });
  check("mesure — un retour à la ligne ne coupe pas une phrase", () => {
    att(mesurerStatut("Une phrase\nsur deux lignes. Une autre.").phrases === 2, "phrases mal comptées");
  });

  // ---- T4 ----
  check("rouge T4 — une vérification sans adresse complète échoue seule", () => {
    seul(verifier(VERTE.replace("Ouvrir https://boutique.example.org/connexion : la page", "Ouvrir la page de connexion : la page")), "T4");
  });
  check("rouge T4 — une vérification sans résultat observable échoue seule", () => {
    seul(verifier(VERTE.replace("la page de connexion s'affiche sans erreur.", "tout va bien.")), "T4");
  });

  // ---- T5 : un motif à la fois, avec son remède ----
  const MOTIFS = {
    "renvoi-personne": "Demander à Camille si besoin.",
    "droits-admin": "Accorder des droits d'administration pour le lancement.",
    "autre-projet": "Procéder comme pour l'autre projet.",
    "ligne-sans-valeur": "Rien d'autre n'est demandé.",
    "compte-impose": "Jouer az ad app list pour contrôler.",
    "tournure-ce-que": "Noter ce que l'écran affiche.",
    "liste-du-non-fait": "Ne créer ni secret ni certificat.",
    "commanditaire": "Le commanditaire ouvre la chaîne.",
    "adresse-abregee": "Ouvrir l'adresse -prd.",
    "etage": "Lancer l'étage de production.",
    "renvoi-message": "Lancer la relance demandée à 16h38.",
  };
  for (const e of EXCLUS) {
    check(`rouge T5 — « ${e.libelle} » échoue seul, et la version corrigée passe`, () => {
      att(MOTIFS[e.cle], `aucune fixture pour ${e.cle}`);
      seul(verifier(avec(MOTIFS[e.cle])), "T5");
      att(verifier(VERTE).verdict === "PASS", "la verte ne passe plus");
    });
  }
  check("rouge T5 — un nom de personne déclaré échoue seul, et sans liste il n'est pas jugé", () => {
    const t = avec("Prévenir Dupont à la fin.");
    seul(verifier(t, { noms: ["Dupont"] }), "T5");
    att(verifier(t).verdict === "PASS", "sans liste, un nom inconnu ne doit pas échouer");
  });
  check("verte T5 — une commande citée en vérification finale n'est pas un compte imposé", () => {
    const t = VERTE.replace("la page de connexion s'affiche sans erreur.", "la page s'affiche ; contrôle possible avec az ad app list.");
    att(verifier(t).verdict === "PASS", "la commande de la vérification est refusée");
  });
  check("verte T5 — le fichier sans bloc ```text est jugé en entier", () => {
    const sans = VERTE.replace(/```text\n/, "").replace(/```\n?$/, "");
    att(verifier(sans).verdict === "PASS", "le jugement du fichier entier échoue");
  });

  // ---- TF-1520 : les deux écarts du contrôle repris du produit (liste de noms, contrat commun) ----
  const dossier = mkdtempSync(join(tmpdir(), "demande-tierce-"));
  const CLI = join(ICI, "oracle-demande-tierce.mjs");
  const cli = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", env: { ...process.env, FORGE_NOMS_PERSONNES: "" } });
  const fVerte = join(dossier, "verte.md"), fRouge = join(dossier, "rouge.md"), fNom = join(dossier, "avec-nom.md");
  writeFileSync(fVerte, VERTE); writeFileSync(fRouge, ROUGE); writeFileSync(fNom, avec("Prévenir Dupont à la fin."));
  try {
    check("noms — les trois sources se cumulent sans doublon (ligne de commande, fichier JSON ou texte, variable)", () => {
      const json = join(dossier, "noms.json"), txt = join(dossier, "noms.txt"), objet = join(dossier, "objet.json");
      writeFileSync(json, JSON.stringify(["Dupont", "Martin"]));
      writeFileSync(txt, "﻿Dupont\nDurand; Petit, Camille\n\n");
      writeFileSync(objet, JSON.stringify({ noms: ["Leroy"] }));
      att(JSON.stringify(lireNoms({ fichier: json })) === '["Dupont","Martin"]', "tableau JSON mal lu");
      att(JSON.stringify(lireNoms({ fichier: txt })) === '["Dupont","Durand","Petit","Camille"]', "texte mal lu (BOM, sauts de ligne, ; et ,)");
      att(JSON.stringify(lireNoms({ fichier: objet })) === '["Leroy"]', "objet { noms } mal lu");
      const tous = lireNoms({ noms: ["Dupont"], fichier: json, env: { FORGE_NOMS_PERSONNES: "Roux,Martin" } });
      att(JSON.stringify(tous) === '["Dupont","Martin","Roux"]', `cumul/doublon : ${JSON.stringify(tous)}`);
      att(lireNoms({ env: {} }).length === 0, "sans source, la liste doit être vide");
    });
    check("noms — une liste illisible ou absente lève : jamais un nom cru refusé qui ne l'est pas", () => {
      const casse = join(dossier, "casse.json"); writeFileSync(casse, "[ pas du json");
      const mauvais = join(dossier, "mauvais.json"); writeFileSync(mauvais, JSON.stringify({ autre: 1 }));
      for (const f of [casse, mauvais, join(dossier, "absent.json")]) {
        let leve = false; try { lireNoms({ fichier: f }); } catch { leve = true; }
        att(leve, `${f} n'a pas levé`);
      }
    });
    check("noms CLI — sans liste le nom passe ; avec --noms-fichier ou FORGE_NOMS_PERSONNES il est refusé (exit 1)", () => {
      const liste = join(dossier, "liste.json"); writeFileSync(liste, JSON.stringify(["Dupont"]));
      att(cli(fNom).status === 0, "sans liste, le nom ne doit pas échouer");
      const parFichier = cli(fNom, "--noms-fichier", liste);
      att(parFichier.status === 1 && /nom de personne/.test(parFichier.stdout), `--noms-fichier : exit ${parFichier.status}`);
      const parEnv = spawnSync(process.execPath, [CLI, fNom], { encoding: "utf8", env: { ...process.env, FORGE_NOMS_PERSONNES: "Dupont" } });
      att(parEnv.status === 1, `FORGE_NOMS_PERSONNES : exit ${parEnv.status}`);
      att(cli(fNom, "--noms-fichier", join(dossier, "absent.json")).status === 2, "une liste absente doit sortir en 2");
      att(cli(fVerte, "--noms-fichier", liste).status === 0, "la verte doit passer avec la liste");
    });
    check("contrat — la verte rend un JSON commun PASS (exit 0), localisant, avec non_juge et la limite des noms dite", () => {
      const p = cli(fVerte, "--json");
      att(p.status === 0, `exit ${p.status}`);
      const j = JSON.parse(p.stdout);
      att(j.oracle === ORACLE && j.verdict === "PASS" && j.artefact === fVerte, "en-tête du contrat");
      att(typeof j.domaine === "string" && j.domaine.length > 5, "domaine absent");
      att(j.findings.length >= 5 && j.findings.every((f) => f.sev === "info" && f.regle && f.msg && f.where), "findings de la verte");
      att(j.non_juge.some((l) => /aucune liste fournie/.test(l)), "la limite « noms non jugés » n'est pas dite sans liste");
    });
    check("contrat — la rouge rend FAIL (exit 1) avec des findings bloquants localisants portant leur remède", () => {
      const p = cli(fRouge, "--json");
      att(p.status === 1, `exit ${p.status}`);
      const j = JSON.parse(p.stdout);
      att(j.verdict === "FAIL", "verdict");
      const bloquants = j.findings.filter((f) => f.sev === "bloquant");
      att(bloquants.length >= 10 && bloquants.every((f) => f.regle && f.where === fRouge), `${bloquants.length} bloquants`);
      att(bloquants.some((f) => /remède :/.test(f.msg)), "aucun remède dans les messages");
    });
    check("contrat — avec une liste, la limite « aucune liste » n'est plus dite ; un fichier absent sort en 2", () => {
      att(!enContrat("x", verifier(VERTE, { noms: ["Dupont"] }), 1).non_juge.some((l) => /aucune liste fournie/.test(l)), "limite dite à tort");
      att(cli(join(dossier, "inexistant.md"), "--json").status === 2, "fichier absent");
    });
  } finally { rmSync(dossier, { recursive: true, force: true }); }

  check("VERSION exportée et NON_JUGE déclaré", () => {
    att(/^\d+\.\d+\.\d+$/.test(VERSION), VERSION);
    att(verifier(VERTE).non_juge.length >= 3, "NON_JUGE absent");
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }

console.log(`\noracle-demande-tierce : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
