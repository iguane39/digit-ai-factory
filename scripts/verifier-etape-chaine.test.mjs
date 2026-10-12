#!/usr/bin/env node
/**
 * verifier-etape-chaine.test.mjs — une étape de chaîne remise sans avoir tourné, un objet d'annuaire
 * écrit avant sa réplication, une extension absente de l'agent et un script de session qui tient
 * lieu d'étage se voient, hors ligne (M-13 ; TF-1543, TF-1546, TF-1548, TF-1549).
 *
 * Rouges : le cas fondateur du 01/10/2026 (`az ad app update` aussitôt après `az ad app create`,
 * `az webapp auth update --set`) ; une chaîne qui écrit dans la plateforme sans section au dossier ;
 * un dossier dont la section manque d'exécution hors production, d'écriture à blanc ou de branches
 * propres à la production ; une option qui fait lancer par la session le script de la fiche Entra.
 * Verts : le remède (lecture en boucle avec attente avant l'écriture, API authsettingsV2, extension
 * déclarée présente et datée, dossier complet, étage de la chaîne rejouable seul).
 * Borne : un produit sans objet d'annuaire, sans commande az webapp auth ni chaîne qui écrit n'a
 * rien à juger.
 * Joué par `oracles\self-tests.mjs`.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-etape-chaine.mjs");
const { jugerScript } = await import(pathToFileURL(OUTIL).href);
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const egal = (a, b, msg) => { if (a !== b) throw new Error(`${msg} : attendu ${b}, obtenu ${a}`); };
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const refus = (r, regle) => (r.j?.findings || []).filter((f) => f.regle === regle && f.statut === "FAIL");
const produit = (fichiers) => {
  const D = mkdtempSync(join(tmpdir(), "etape-chaine-"));
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    mkdirSync(dirname(join(D, chemin)), { recursive: true });
    writeFileSync(join(D, chemin), contenu, "utf8");
  }
  return D;
};
const nettoyer = (D) => rmSync(D, { recursive: true, force: true });

// Le script du cas fondateur, réduit à ses deux défauts, et son remède.
const FAUTIF = [
  "#!/usr/bin/env bash",
  "APP_ID=$(az ad app create --display-name \"$NOM\" --query appId -o tsv)",
  "az ad app update --id \"$APP_ID\" --set web.redirectUris=\"$URI\"",
  "az webapp auth update -g \"$RG\" -n \"$APP\" --set identityProviders.azureActiveDirectory.enabled=true",
  "",
].join("\n");
const REMEDE = [
  "#!/usr/bin/env bash",
  "APP_ID=$(az ad app create --display-name \"$NOM\" --query appId -o tsv)",
  "for i in $(seq 1 12); do",
  "  az ad app show --id \"$APP_ID\" -o none 2>/dev/null && break",
  "  sleep 10",
  "done",
  "az ad app update --id \"$APP_ID\" --set web.redirectUris=\"$URI\"",
  "az rest --method put --url \"https://management.azure.com/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Web/sites/$APP/config/authsettingsV2?api-version=$API\" --body @auth.json",
  "",
].join("\n");

const CHAINE = "steps:\n  - script: bash infra/fiche-entra.sh\n";
const ECRIT = "#!/usr/bin/env bash\naz webapp config appsettings set -g \"$RG\" -n \"$APP\" --settings A=1\n";
const SECTION = [
  "## Étapes de chaîne remises à l'exploitant",
  "",
  "Exécuté hors production le 2026-10-01 sur un client semblable à l'agent : `bash -n`, puis `az ad app show`, `az rest --method get` sur l'API authsettingsV2.",
  "Écritures de production jouées à blanc : `terraform plan`, différence : 1 réglage ajouté, aucun retiré.",
  "Branches que seule la production exécute : création de la fiche (les fiches de dev et de qualification existent déjà).",
  "",
].join("\n");
const DOSSIER = (section) => `# Dossier de MEP\n\nContenu du dossier.\n\n${section}`;

// ---- EC-1 ----
check("ROUGE EC-1 — `az ad app update` aussitôt après `az ad app create` : refusé et localisé à la ligne de l'écriture", () => {
  const r = jugerScript(FAUTIF, "infra/fiche.sh");
  const f = r.findings.filter((x) => x.regle === "EC-1");
  egal(f.length, 1, "refus EC-1");
  egal(f[0].ou, "infra/fiche.sh:3", "localisation");
});
check("VERT EC-1 — le remède (lecture répétée avec attente avant l'écriture) passe", () => {
  egal(jugerScript(REMEDE, "infra/fiche.sh").findings.filter((x) => x.regle === "EC-1").length, 0, "refus EC-1 sur le remède");
});
check("ROUGE EC-1 — une attente SANS lecture ne suffit pas (un `sleep` aveugle)", () => {
  const t = FAUTIF.replace("az ad app update", "sleep 5\naz ad app update");
  egal(jugerScript(t, "x.sh").findings.filter((x) => x.regle === "EC-1").length, 1, "refus EC-1");
});
check("ROUGE EC-1 — une lecture SANS attente ne suffit pas (un seul `az ad app show`)", () => {
  const t = FAUTIF.replace("az ad app update", "az ad app show --id \"$APP_ID\" -o none\naz ad app update");
  egal(jugerScript(t, "x.sh").findings.filter((x) => x.regle === "EC-1").length, 1, "refus EC-1");
});
check("ROUGE EC-1 — `az ad sp create` aussitôt après `az ad app create` : l'application d'entreprise subit la même réplication", () => {
  const t = "az ad app create --display-name x\naz ad sp create --id \"$APP_ID\"\n";
  egal(jugerScript(t, "x.sh").findings.filter((x) => x.regle === "EC-1").length, 1, "refus EC-1");
});
check("VERT EC-1 — une création seule, ou un commentaire qui cite la commande, n'accuse rien", () => {
  const t = "# az ad app create puis az ad app update : voir la règle\naz ad app create --display-name x\n";
  egal(jugerScript(t, "x.sh").findings.length, 0, "refus");
});

// ---- EC-2 ----
check("ROUGE EC-2 — `az webapp auth update --set` : refusé, le message donne l'API authsettingsV2", () => {
  const f = jugerScript(FAUTIF, "x.sh").findings.filter((x) => x.regle === "EC-2");
  egal(f.length, 1, "refus EC-2");
  if (!/authsettingsV2/.test(f[0].message)) throw new Error("le remède (API authsettingsV2) n'est pas nommé");
});
check("VERT EC-2 — l'écriture par l'API authsettingsV2 passe", () => {
  egal(jugerScript(REMEDE, "x.sh").findings.filter((x) => x.regle === "EC-2").length, 0, "refus EC-2 sur le remède");
});
check("VERT EC-2 — l'extension déclarée présente et datée au-dessus de la commande est crue", () => {
  const t = "# authV2 : extension mesurée présente le 2026-10-12\naz webapp auth show -g \"$RG\" -n \"$APP\"\n";
  egal(jugerScript(t, "x.sh").findings.length, 0, "refus");
});
check("ROUGE EC-2 — la même déclaration SANS date ne vaut rien", () => {
  const t = "# authV2 : extension mesurée présente\naz webapp auth show -g \"$RG\" -n \"$APP\"\n";
  egal(jugerScript(t, "x.sh").findings.filter((x) => x.regle === "EC-2").length, 1, "refus EC-2");
});

// ---- EC-4 et codes de sortie ----
check("ROUGE — le cas fondateur par la ligne de commande : exit 1, EC-1 et EC-2 rendus", () => {
  const D = produit({ "infra/fiche-entra.sh": FAUTIF });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  egal(r.j.verdict, "FAIL", "verdict");
  if (!refus(r, "EC-1").length || !refus(r, "EC-2").length) throw new Error("EC-1 et EC-2 devaient être rendus : " + r.brut.slice(0, 300));
});
check("ROUGE EC-4 — une chaîne qui écrit dans la plateforme et un dossier SANS la section : refusé", () => {
  const D = produit({ "azure-pipelines.yml": CHAINE, "infra/fiche-entra.sh": ECRIT, "DOSSIER-MEP.md": DOSSIER("") });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  egal(refus(r, "EC-4").length, 1, "refus EC-4");
});
check("VERT EC-4 — le même produit avec la section complète : PASS, exit 0", () => {
  const D = produit({ "azure-pipelines.yml": CHAINE, "infra/fiche-entra.sh": ECRIT, "DOSSIER-MEP.md": DOSSIER(SECTION) });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 0, "code de sortie " + r.brut.slice(0, 400));
  egal(r.j.verdict, "PASS", "verdict");
});
check("ROUGE EC-4 — la section sans exécution hors production datée : refusé", () => {
  const sans = SECTION.replace(/^Exécuté hors production.*$/m, "Compilée par Azure DevOps, syntaxe contrôlée, relue.");
  const D = produit({ "azure-pipelines.yml": CHAINE, "infra/fiche-entra.sh": ECRIT, "DOSSIER-MEP.md": DOSSIER(sans) });
  const r = lancer(D); nettoyer(D);
  egal(refus(r, "EC-4").length, 1, "refus EC-4");
  if (!/EXÉCUTÉES hors production/.test(refus(r, "EC-4")[0].message)) throw new Error("le refus ne nomme pas l'exécution manquante");
});
check("ROUGE EC-4 — la section sans écriture jouée à blanc : refusé", () => {
  const sans = SECTION.replace(/^Écritures de production.*$/m, "");
  const D = produit({ "azure-pipelines.yml": CHAINE, "infra/fiche-entra.sh": ECRIT, "DOSSIER-MEP.md": DOSSIER(sans) });
  const r = lancer(D); nettoyer(D);
  egal(refus(r, "EC-4").length, 1, "refus EC-4");
});
check("ROUGE EC-4 — la section sans la liste des branches que seule la production exécute : refusé", () => {
  const sans = SECTION.replace(/^Branches que seule.*$/m, "");
  const D = produit({ "azure-pipelines.yml": CHAINE, "infra/fiche-entra.sh": ECRIT, "DOSSIER-MEP.md": DOSSIER(sans) });
  const r = lancer(D); nettoyer(D);
  egal(refus(r, "EC-4").length, 1, "refus EC-4");
});
check("VERT EC-4 — « aucune » déclaré aux branches propres à la production est une réponse complète", () => {
  const aucune = SECTION.replace(/^Branches que seule.*$/m, "Branches que seule la production exécute : aucune.");
  const D = produit({ "azure-pipelines.yml": CHAINE, "infra/fiche-entra.sh": ECRIT, "DOSSIER-MEP.md": DOSSIER(aucune) });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 0, "code de sortie " + r.brut.slice(0, 300));
});
check("SANS OBJET — un produit sans annuaire, sans auth ni chaîne qui écrit : exit 2, jamais FAIL", () => {
  const D = produit({ "scripts/build.sh": "echo construire\nnpm run build\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 2, "code de sortie");
  egal(r.j.verdict, "SKIP", "verdict");
});

// ---- EC-5 ----
const OPTION_SESSION = "- Option (a) : la session lance le script `infra/creer-fiche-entra.sh` pour la mise en production, après avoir ouvert l'autorisation.\n";
const OPTION_CHAINE = "- Option (a) : un paramètre de la chaîne de livraison ne compile que l'étage Fiche Entra, rejouable par l'exploitant ; la session ne lance aucun script de déploiement.\n";
const ecrireRestitution = (corps) => {
  const D = mkdtempSync(join(tmpdir(), "etape-chaine-r-"));
  const f = join(D, "restitution.md");
  writeFileSync(f, `# Restitution\n\n${corps}`, "utf8");
  return { D, f };
};
check("ROUGE EC-5 — une option qui fait lancer par la session le script de la fiche Entra : exit 1, ligne localisée", () => {
  const { D, f } = ecrireRestitution(OPTION_SESSION);
  const r = lancer("--restitution", f); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  egal(refus(r, "EC-5").length, 1, "refus EC-5");
  if (!/restitution\.md:3/.test(refus(r, "EC-5")[0].ou)) throw new Error("ligne non localisée : " + refus(r, "EC-5")[0].ou);
});
check("VERT EC-5 — le remède (étage de la chaîne rejouable seul par l'exploitant) passe, exit 0", () => {
  const { D, f } = ecrireRestitution(OPTION_CHAINE);
  const r = lancer("--restitution", f); nettoyer(D);
  egal(r.code, 0, "code de sortie " + r.brut.slice(0, 300));
});
check("VERT EC-5 — une exécution de test lancée par la session, sans déploiement, n'est pas accusée", () => {
  const { D, f } = ecrireRestitution("- La session lance le script de test `npm test` et relit la sortie.\n");
  const r = lancer("--restitution", f); nettoyer(D);
  egal(r.code, 0, "code de sortie");
});

console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
