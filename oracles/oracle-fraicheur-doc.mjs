#!/usr/bin/env node
/**
 * oracle-fraicheur-doc.mjs — fraîcheur de l'INVENTAIRE contre les sources vérifiables (TF-0113, v0).
 * La documentation de pilotage dérive plus vite que le code : cet oracle confronte les
 * affirmations comptables de l'INVENTAIRE aux dépôts réels. Règles (v0 — 3 classes de dérive
 * constatées le 12/08 ; la généralisation par fichier de claims est consignée en reste) :
 *  F1  le nombre d'oracles cité pour conception == nombre de oracles/oracle-*.mjs sur disque
 *  F2  les comptages ADR/contrôles cités pour audit == ceux du README de la forge audit
 *  F3  si le code de forge-tests expose --sortie, l'INVENTAIRE ne le nie pas (« aucune option --sortie »)
 * Usage : node oracle-fraicheur-doc.mjs [racine-forges] | --self-test  — exit 0 PASS / 1 FAIL / 2 erreur.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

export function f1(texteInventaire, nbOraclesDisque) {
  const m = texteInventaire.match(/(\d+)\s+oracles Node/);
  if (!m) return { regle: "F1", statut: "FAIL", message: "INVENTAIRE ne cite plus « N oracles Node » pour conception — sonde à réviser" };
  const cite = Number(m[1]);
  return cite === nbOraclesDisque
    ? { regle: "F1", statut: "PASS", message: `conception : ${cite} oracles cités == ${nbOraclesDisque} sur disque` }
    : { regle: "F1", statut: "FAIL", message: `conception : INVENTAIRE cite ${cite} oracles, le disque en porte ${nbOraclesDisque}` };
}

export function f2(texteInventaire, texteReadmeAudit) {
  const inv = texteInventaire.match(/(\d+)\s+ADR[^,]*,\s*(\d+)\s+contrôles/);
  const rd = texteReadmeAudit.match(/(\d+)\s+ADR/);
  const rdC = texteReadmeAudit.match(/(\d+)\s+contrôles/);
  if (!inv) return { regle: "F2", statut: "FAIL", message: "INVENTAIRE ne cite plus « N ADR…, M contrôles » pour audit — sonde à réviser" };
  if (!rd || !rdC) return { regle: "F2", statut: "SANS_OBJET", message: "README audit ne publie pas ses comptages — sonde inopérante" };
  const ok = Number(inv[1]) === Number(rd[1]) && Number(inv[2]) === Number(rdC[1]);
  return ok
    ? { regle: "F2", statut: "PASS", message: `audit : ${inv[1]} ADR / ${inv[2]} contrôles == README de la forge` }
    : { regle: "F2", statut: "FAIL", message: `audit : INVENTAIRE cite ${inv[1]} ADR / ${inv[2]} contrôles, le README de la forge dit ${rd[1]} / ${rdC[1]}` };
}

export function f3(texteInventaire, codeExposeSortie) {
  const nie = /aucune option `?--sortie`?/.test(texteInventaire);
  if (codeExposeSortie && nie)
    return { regle: "F3", statut: "FAIL", message: "INVENTAIRE nie l'option --sortie que le code de forge-tests expose" };
  return { regle: "F3", statut: "PASS", message: codeExposeSortie ? "option --sortie exposée et non niée" : "pas d'option --sortie exposée — rien à nier" };
}

function chercherDansSources(depot, motif) {
  const pile = [depot];
  while (pile.length) {
    const d = pile.pop();
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!/^(\.|node_modules|\.venv|dist|build|__pycache__)/.test(e.name)) pile.push(join(d, e.name));
      } else if (/\.(py|mjs|js)$/.test(e.name)) {
        if (readFileSync(join(d, e.name), "utf8").includes(motif)) return true;
      }
    }
  }
  return false;
}

function selfTest() {
  const resultats = [];
  const attendre = (nom, attendu, r) => resultats.push({ fixture: nom, attendu, obtenu: r.statut });
  // F1 : verte (5 cités, 5 sur disque) / rouge (4 cités, 5 sur disque)
  attendre("F1/verte", "PASS", f1("… 5 oracles Node zéro dépendance …", 5));
  attendre("F1/rouge", "FAIL", f1("… 4 oracles Node zéro dépendance …", 5));
  // F2 : verte / rouge (comptages divergents)
  attendre("F2/verte", "PASS", f2("(73 ADR MADR sur 10 domaines, 169 contrôles …)", "# X\n73 ADR de principe\n169 contrôles CTL"));
  attendre("F2/rouge", "FAIL", f2("(65 ADR anciens, 162 contrôles …)", "# X\n73 ADR de principe\n169 contrôles CTL"));
  // F3 : verte (pas de négation) / rouge (négation alors que le code expose)
  attendre("F3/verte", "PASS", f3("rapport JSON sur stdout et persistable (--sortie)", true));
  attendre("F3/rouge", "FAIL", f3("rapport JSON sur stdout uniquement (aucune option `--sortie`)", true));
  const rates = resultats.filter((r) => r.attendu !== r.obtenu);
  console.log(JSON.stringify({ oracle: "oracle-fraicheur-doc", mode: "self-test", verdict: rates.length ? "FAIL" : "PASS", resultats }, null, 1));
  process.exit(rates.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (process.argv.includes("--self-test")) selfTest();
  try {
    const racinePilot = join(ICI, "..");
    const racineForges = process.argv[2] || process.env.FORGE_ROOT || join(racinePilot, "..");
    const inventaire = readFileSync(join(racinePilot, "INVENTAIRE.md"), "utf8");
    const oraclesConception = readdirSync(join(racineForges, "digit-ai-forge-conception", "oracles")).filter((n) => /^oracle-.*\.mjs$/.test(n)).length;
    const readmeAudit = readFileSync(join(racineForges, "digit-ai-forge-audit", "README.md"), "utf8");
    const exposeSortie = chercherDansSources(join(racineForges, "digit-ai-forge-tests", "forge_tests"), '"--sortie"');
    const findings = [f1(inventaire, oraclesConception), f2(inventaire, readmeAudit), f3(inventaire, exposeSortie)];
    const echecs = findings.filter((f) => f.statut === "FAIL").length;
    console.log(JSON.stringify({
      oracle: "oracle-fraicheur-doc", version: "1.0.0", verdict: echecs ? "FAIL" : "PASS", findings,
      non_juge: ["les affirmations non comptables de l'INVENTAIRE", "les fiches d'audit (généralisation par fichier de claims — reste TF-0113)"],
    }, null, 1));
    process.exit(echecs ? 1 : 0);
  } catch (e) {
    console.log(JSON.stringify({ oracle: "oracle-fraicheur-doc", verdict: "ERREUR", message: String(e) }, null, 1));
    process.exit(2);
  }
}
