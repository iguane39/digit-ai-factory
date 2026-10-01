#!/usr/bin/env node
/**
 * verifier-droits-accordes.test.mjs — un identifiant de permission Graph écrit de mémoire, un échec
 * d'octroi masqué et un succès annoncé sans relecture se voient, hors ligne (TF-1497).
 *
 * Rouges : le cas fondateur du 16/09/2026 (identifiant faux sur ses 10 derniers caractères, ajout
 * masqué par `2>/dev/null || true`, « consentie » écrit sans relire l'annuaire) ; un nom de permission
 * qui ne possède pas l'identifiant écrit ; un type inversé ; un identifiant inconnu employé comme
 * permission ; le même identifiant faux dans un bloc Terraform ; une erreur PowerShell effacée ;
 * un « ok » sans relecture ; une source de rafraîchissement de forme inattendue, qui ne réécrit rien.
 * Verts : le remède du produit (identifiant officiel, commande de résolution en commentaire, erreur
 * visible, relecture avant l'annonce) ; le même en PowerShell ; la table RÉELLE, qui porte
 * l'identifiant que l'API a rendu au produit le 29/09/2026 ; l'analyse d'une page officielle.
 * Borne : un identifiant de souscription n'est pas une permission, rien à juger.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-droits-accordes.mjs");
const { analyserReference, chargerTable } = await import(pathToFileURL(OUTIL).href);
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const refus = (r, regle) => (r.j?.findings || []).filter((f) => f.regle === regle && f.statut === "FAIL");
const fichier = (nom, contenu) => {
  const D = mkdtempSync(join(tmpdir(), "droits-accordes-"));
  mkdirSync(join(D, "infra"), { recursive: true });
  writeFileSync(join(D, "infra", nom), contenu, "utf8");
  return D;
};
const nettoyer = (D) => rmSync(D, { recursive: true, force: true });

const OFFICIEL = "18a4783c-866b-4cc7-a460-3d5e5662c884";
const DE_MEMOIRE = "18a4783c-866b-4cc7-a460-3d0e455740fd";
// La forme du script réel : l'annonce passe par une fonction `ok`, pas par `echo`.
const SCRIPT_FAUTIF = [
  "#!/usr/bin/env bash",
  "set -euo pipefail",
  "ok() { printf '  ok  %s\\n' \"$*\"; }",
  "GRAPH_API=\"00000003-0000-0000-c000-000000000000\"",
  `GRAPH_APP_RW_OWNEDBY="${DE_MEMOIRE}"`,
  "",
  "etape_entra() {",
  "  # Permission Graph Application.ReadWrite.OwnedBy",
  "  az ad app permission add --id \"$APP_ID\" --api \"$GRAPH_API\" \\",
  "    --api-permissions \"$GRAPH_APP_RW_OWNEDBY=Role\" --output none 2>/dev/null || true",
  "  az ad app permission admin-consent --id \"$APP_ID\" --output none",
  "  ok \"Application.ReadWrite.OwnedBy consentie\"",
  "}",
  "",
].join("\n");
const SCRIPT_REMEDE = [
  "#!/usr/bin/env bash",
  "set -euo pipefail",
  "GRAPH_API=\"00000003-0000-0000-c000-000000000000\"",
  "# Application.ReadWrite.OwnedBy, résolu le 30/09/2026 :",
  "# az rest --method get --url \"https://graph.microsoft.com/v1.0/servicePrincipals(appId='00000003-0000-0000-c000-000000000000')?\\$select=appRoles\"",
  `GRAPH_APP_RW_OWNEDBY="${OFFICIEL}"`,
  "",
  "etape_entra() {",
  "  az ad app permission add --id \"$APP_ID\" --api \"$GRAPH_API\" \\",
  "    --api-permissions \"$GRAPH_APP_RW_OWNEDBY=Role\"",
  "  az ad app permission admin-consent --id \"$APP_ID\"",
  "  az ad app permission list --id \"$APP_ID\" --query \"[].resourceAccess[].id\" -o tsv | grep -q \"$GRAPH_APP_RW_OWNEDBY\"",
  "  echo \"Application.ReadWrite.OwnedBy consentie, relue dans l'annuaire\"",
  "}",
  "",
].join("\n");

check("rouge — le cas fondateur du 16/09/2026 : identifiant faux, ajout masqué, « consentie » sans relecture : DA-1, DA-2 et DA-3", () => {
  const D = fichier("creer-connexion.sh", SCRIPT_FAUTIF);
  const r = lancer(D);
  const da1 = refus(r, "DA-1"), da2 = refus(r, "DA-2"), da3 = refus(r, "DA-3");
  if (r.code !== 1 || da1.length !== 1 || !da1[0].message.includes(OFFICIEL) || !/26 premiers caractères/.test(da1[0].message)
    || da2.length !== 1 || !/\|\| true/.test(da2[0].message) || da3.length !== 1 || !/:12$/.test(da3[0].ou)) throw new Error(r.brut.slice(0, 700));
  nettoyer(D);
});
check("vert — le remède : identifiant officiel, résolution en commentaire, erreur visible, relecture avant l'annonce : PASS", () => {
  const D = fichier("creer-connexion.sh", SCRIPT_REMEDE);
  const r = lancer(D);
  if (r.code !== 0 || r.j.verdict !== "PASS" || r.j.mesure.resolus !== 1 || r.j.mesure.octrois !== 2) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("rouge — un nom de permission qui ne possède pas l'identifiant écrit : DA-1 discordant", () => {
  const D = fichier("droits.sh", "# User.Read\nPERMISSION=\"1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9\"\n");
  const r = lancer(D);
  if (r.code !== 1 || !/Application\.ReadWrite\.All/.test(JSON.stringify(refus(r, "DA-1"))) || !/discordants/.test(JSON.stringify(refus(r, "DA-1")))) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("rouge — permission déléguée employée comme permission d'application (=Role) : DA-1 type inversé", () => {
  const D = fichier("droits.sh", "az ad app permission add --id \"$APP_ID\" --api 00000003-0000-0000-c000-000000000000 --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Role\n");
  const r = lancer(D);
  if (r.code !== 1 || !/type inversé/.test(JSON.stringify(refus(r, "DA-1")))) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("rouge — identifiant INCONNU de la table, employé comme permission : DA-1 donne la commande qui le résout", () => {
  const D = fichier("droits.sh", "az ad app permission add --id \"$APP_ID\" --api 00000003-0000-0000-c000-000000000000 --api-permissions 0badc0de-0000-4000-8000-000000000001=Role\n");
  const r = lancer(D);
  const da1 = refus(r, "DA-1");
  if (r.code !== 1 || da1.length !== 1 || !/INCONNU/.test(da1[0].message) || !/servicePrincipals\(appId=/.test(da1[0].message)) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("rouge — le même identifiant de mémoire dans un bloc Terraform (type sur une autre ligne) : DA-1 quasi-homonyme", () => {
  const D = fichier("main.tf", `required_resource_access {\n  resource_app_id = "00000003-0000-0000-c000-000000000000"\n  resource_access {\n    id   = "${DE_MEMOIRE}"\n    type = "Role"\n  }\n}\n`);
  const r = lancer(D);
  if (r.code !== 1 || !refus(r, "DA-1")[0]?.message.includes(OFFICIEL)) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("rouge puis vert — PowerShell : -ErrorAction SilentlyContinue efface l'erreur (DA-2) ; relu par Get-Mg… avant « ok » : PASS", () => {
  const rouge = fichier("droits.ps1", "New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $sp -AppRoleId $role -ResourceId $graph -PrincipalId $sp -ErrorAction SilentlyContinue\nGet-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $sp\nWrite-Host \"ok\"\n");
  const r1 = lancer(rouge);
  if (r1.code !== 1 || refus(r1, "DA-2").length !== 1 || refus(r1, "DA-3").length) throw new Error(`rouge : ${r1.brut.slice(0, 400)}`);
  nettoyer(rouge);
  const vert = fichier("droits.ps1", "New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $sp -AppRoleId $role -ResourceId $graph -PrincipalId $sp -ErrorAction Stop\nGet-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $sp\nWrite-Host \"ok\"\n");
  const r2 = lancer(vert);
  if (r2.code !== 0) throw new Error(`vert : ${r2.brut.slice(0, 400)}`);
  nettoyer(vert);
});
check("rouge — rôle Azure accordé, « ok » écrit aussitôt, sans relecture : DA-3 seul", () => {
  const D = fichier("roles.sh", "az role assignment create --assignee \"$SP\" --role Reader --scope \"$PORTEE\"\necho \"rôle accordé : ok\"\n");
  const r = lancer(D);
  if (r.code !== 1 || refus(r, "DA-3").length !== 1 || refus(r, "DA-2").length || refus(r, "DA-1").length) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("borne — un message qui AVOUE un refus ou un doute n'annonce pas un succès : pas de DA-3", () => {
  const D = fichier("proprietaire.sh", "if az role assignment create --assignee \"$SP\" --role Reader --scope \"$PORTEE\"; then\n  az role assignment list --assignee \"$SP\" -o table\nelse\n  info \"rôle déjà attribué, ou refusé faute de droits\"\nfi\n");
  const r = lancer(D);
  if (r.code !== 0 || refus(r, "DA-3").length) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — un identifiant de souscription n'est pas une permission : ni identifiant Graph ni octroi, rien à juger (exit 2)", () => {
  const D = fichier("compte.sh", "az account set --subscription 9f8e7d6c-5b4a-4321-8fed-cba987654321\naz group list -o table\n");
  const r = lancer(D);
  if (r.code !== 2 || r.j.verdict !== "SKIP") throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("vert — la table RÉELLE porte l'identifiant que l'API a rendu au produit le 29/09/2026, sous son nom et son type", () => {
  const t = chargerTable();
  const e = t.parId.get(OFFICIEL);
  if (!e || e.nom !== "Application.ReadWrite.OwnedBy" || e.type !== "application" || t.parId.has(DE_MEMOIRE) || t.total < 900) throw new Error(JSON.stringify({ e, total: t.total }));
});
check("vert — analyse d'une page officielle : section h3 et sa ligne Identifier, tableau RSC", () => {
  const html = `<h3 id="a">Application.ReadWrite.OwnedBy</h3><table><tbody><tr>\n<td>Identifier</td>\n<td>${OFFICIEL}</td>\n<td>-</td>\n</tr></tbody></table>`
    + "<h3 id=\"b\">User.Read</h3><table><tbody><tr><td>Identifier</td><td>-</td><td>e1fe6dd8-ba31-4d61-89e7-88639da4683d</td></tr></tbody></table>"
    + "<h2 id=\"rsc\">Resource-specific consent (RSC) permissions</h2><table><tbody><tr>\n<td>ChannelMessage.Read.Group</td>\n<td>19103a54-c397-4bcd-be5a-ef111e0406fa</td>\n<td>x</td></tr></tbody></table>";
  const r = analyserReference(html);
  if (r.permissions["Application.ReadWrite.OwnedBy"]?.application !== OFFICIEL || r.permissions["User.Read"]?.delegue !== "e1fe6dd8-ba31-4d61-89e7-88639da4683d"
    || r.permissions["User.Read"]?.application !== null || r.rsc["ChannelMessage.Read.Group"] !== "19103a54-c397-4bcd-be5a-ef111e0406fa") throw new Error(JSON.stringify(r));
});
check("rouge — une source de rafraîchissement de forme inattendue ne réécrit PAS la table (exit 2, fichier non créé)", () => {
  const D = mkdtempSync(join(tmpdir(), "droits-rafraichir-"));
  const source = join(D, "page.html");
  const sortie = join(D, "table.json");
  writeFileSync(source, "<html><body><h3>Seule.Permission</h3><table><tr><td>Identifier</td><td>-</td><td>-</td></tr></table></body></html>", "utf8");
  const r = lancer("--rafraichir", "--source", source, "--sortie", sortie);
  if (r.code !== 2 || existsSync(sortie) || !/forme inattendue/.test(r.brut)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});

console.log(`\nverifier-droits-accordes (TF-1497) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
