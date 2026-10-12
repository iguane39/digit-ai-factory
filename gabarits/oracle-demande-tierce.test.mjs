#!/usr/bin/env node
/**
 * oracle-demande-tierce.test.mjs — recette à double sens du juge de forme des demandes à une équipe
 * tierce (TF-1517, TF-1544, TF-1603, TF-1604, TF-1513). Joué par `oracles\self-tests.mjs` (I2).
 *
 * Chaque règle a une fixture ROUGE qui la fait échouer SEULE, et le remède que son message propose
 * est joué et doit PASSER. Les deux fichiers de `oracles\fixtures\demande-tierce-*.md` servent de
 * témoins : la verte passe, la rouge reprend les défauts du 01/10/2026 et en relève au moins quinze.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifier, mesurerStatut, VERSION, EXCLUS, BORNE_PHRASES, BORNE_MOTS } from "./oracle-demande-tierce.mjs";

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

  check("VERSION exportée et NON_JUGE déclaré", () => {
    att(/^\d+\.\d+\.\d+$/.test(VERSION), VERSION);
    att(verifier(VERTE).non_juge.length >= 3, "NON_JUGE absent");
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }

console.log(`\noracle-demande-tierce : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
