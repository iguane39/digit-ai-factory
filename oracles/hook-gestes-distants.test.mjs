#!/usr/bin/env node
/**
 * hook-gestes-distants.test.mjs — une décision groupée pour tous les gestes destructifs distants, jamais
 * une confirmation par commande (TF-1959, D-77 (b) amendée du 26/10/2026).
 *
 * Les six cas de la consigne : rouge (`az group delete` sans lot), vert (la même commande dans un lot
 * approuvé valide), rouge (lot expiré), vert (`az group show`), vert (`git push` ordinaire), rouge
 * (`git push --force`). Autour : le remède joué (le lot s'écrit par `--poser` comme le message le dit,
 * puis la commande passe), un lot plus long que 24 h plafonné, un lot d'une autre session, une cible
 * qui n'est pas celle du lot, deux gestes dont un seul est approuvé, un lot posé dans l'arbre principal
 * et la commande jouée depuis un arbre de travail lié, la liste fermée dans les deux sens (Bash et
 * PowerShell), et le refus d'un lot sans les mots de l'humain.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-gestes-distants.mjs");
const base = mkdtempSync(join(tmpdir(), "gestes-"));
let pass = 0, fail = 0, n = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

/** Un projet jetable : un `.claude` pour que la racine se reconnaisse. */
const projet = () => { const p = join(base, `p${++n}`); mkdirSync(join(p, ".claude"), { recursive: true }); mkdirSync(join(p, "todo"), { recursive: true }); return p; };
const jouer = (p, tool_name, command, extra = {}) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: p,
    env: { ...process.env, CLAUDE_PROJECT_DIR: p }, input: JSON.stringify({ tool_name, tool_input: { command }, cwd: p, ...extra }) });
  return { code: r.status, err: r.stderr || "" };
};
const refuse = (r) => { if (r.code !== 2 || !/GESTE DISTANT DESTRUCTIF REFUSÉ \(TF-1959, D-77\)/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)}`); };
const passe = (r) => { if (r.code !== 0 || /panne du juge/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)}`); };
const ecrireLot = (p, ligne) => appendFileSync(join(p, "todo", "gestes-approuves.jsonl"), JSON.stringify(ligne) + "\n", "utf8");
const il_y_a = (h) => new Date(Date.now() - h * 3_600_000).toISOString();
const gesteEssai = { commande: "az group delete --name rg-essai --yes", cible: "groupe de ressources rg-essai", effet: "supprime le groupe et ses ressources", retour_arriere: "aucun : se recrée par terraform apply, données perdues" };
const lotOk = (gestes, extra = {}) => ({ schema: "pilot/gestes-approuves@1", decision: "D-78", reponse_humaine: "78a, vas-y pour toute la liste", horodatage: il_y_a(1), expire: il_y_a(-23), gestes, ...extra });

try {
  // ---- D-98 (a) du 29/10/2026 : les 4 formes que la revue de code a laissées passer ---------
  const p98 = projet();
  check("rouge (D-98) — `if` et `while` devant le geste ne le cachent pas", () => {
    for (const c of ["if az group delete -n x; then echo ok; fi", "while az group delete -n x; do :; done", "until az group delete -n x; do :; done"]) refuse(jouer(p98, "Bash", c));
  });
  check("vert (D-98) — un mot de contrôle devant une commande ordinaire ne rend rien suspect", () => {
    for (const c of ["if grep -q az fichier; then echo ok; fi", "while read ligne; do echo $ligne; done"]) passe(jouer(p98, "Bash", c));
  });
  check("rouge (D-98) — un `<<EOF` entre guillemets ou en commentaire ne masque pas la ligne suivante", () => {
    for (const c of ['echo "use <<EOF"\naz group delete -n x', "# voir <<EOF\naz group delete -n x", "git log --grep '<<EOF'\naz group delete -n x"]) refuse(jouer(p98, "Bash", c));
  });
  check("rouge (D-98) — un `<<EOF` réel sans ligne de fin ne masque rien", () => {
    refuse(jouer(p98, "Bash", "cat <<EOF\naz group delete -n x"));
  });
  check("vert (D-98) — le corps d'un vrai document en ligne reste du texte", () => {
    passe(jouer(p98, "Bash", "cat <<EOF > note.txt\naz group delete -n x\nEOF\necho fini"));
  });
  check("rouge (D-98) — les options courtes groupées de curl : `-sX DELETE`, `-sSXDELETE`", () => {
    for (const c of ["curl -sX DELETE https://api.github.com/repos/a/b", "curl -sSXDELETE https://api.github.com/repos/a/b"]) refuse(jouer(p98, "Bash", c));
  });
  check("vert (D-98) — `curl -sS` sans méthode reste une lecture", () => {
    passe(jouer(p98, "Bash", "curl -sS https://api.github.com/repos/a/b"));
  });

  // ---- Les six cas de la consigne ----------------------------------------------------------
  const p1 = projet();
  check("1 rouge — `az group delete` sans lot : refusé, avec le remède (décision groupée au bloc 3)", () => {
    const r = jouer(p1, "Bash", "az group delete --name rg-essai --yes");
    refuse(r);
    if (!/UNE fois/.test(r.err) || !/bloc 3/.test(r.err) || !/--poser/.test(r.err) || !/retour arrière/.test(r.err)) throw new Error(`le message ne dit pas quoi faire : ${r.err.slice(0, 300)}`);
  });
  check("2 vert — la même commande dans un lot approuvé valide : acceptée", () => {
    ecrireLot(p1, lotOk([gesteEssai]));
    passe(jouer(p1, "Bash", "az group delete --name rg-essai --yes"));
  });
  const p3 = projet();
  check("3 rouge — lot expiré : refusé, le message dit pourquoi", () => {
    ecrireLot(p3, lotOk([gesteEssai], { horodatage: il_y_a(72), expire: il_y_a(48) }));
    const r = jouer(p3, "Bash", "az group delete --name rg-essai --yes");
    refuse(r);
    if (!/expiré/.test(r.err)) throw new Error(`motif d'expiration absent : ${r.err.slice(0, 300)}`);
  });
  check("4 vert — `az group show` (lecture) : accepté, sans lot", () => passe(jouer(projet(), "Bash", "az group show --name rg-essai")));
  check("5 vert — `git push` ordinaire : accepté", () => passe(jouer(projet(), "Bash", "git push origin main")));
  check("6 rouge — `git push --force` : refusé", () => refuse(jouer(projet(), "Bash", "git push --force origin main")));

  // ---- Le remède joué, et les bornes du lot -------------------------------------------------
  const p7 = projet();
  check("7 le remède que le message propose, joué : `--poser` écrit le lot, la commande passe ensuite", () => {
    refuse(jouer(p7, "Bash", "terraform destroy -auto-approve"));
    const spec = join(base, "lot7.json");
    writeFileSync(spec, JSON.stringify({ decision: "D-79", reponse_humaine: "79a : approuvé, toute la liste", gestes: [
      { commande: "terraform destroy -auto-approve", cible: "dépôt d'essai", effet: "détruit l'infrastructure d'essai", retour_arriere: "terraform apply, données perdues" }] }), "utf8");
    const r = spawnSync(process.execPath, [HOOK, "--poser", "--lot", spec, "--racine", p7], { encoding: "utf8" });
    if (r.status !== 0 || !/lot posé : D-79, 1 geste/.test(r.stdout)) throw new Error(`${r.status} ${r.stdout}${r.stderr}`);
    const ligne = JSON.parse(readFileSync(join(p7, "forge", "gestes-approuves.jsonl"), "utf8").trim());
    if (Date.parse(ligne.expire) - Date.parse(ligne.horodatage) > 24 * 3_600_000) throw new Error("expiration au-delà de 24 h");
    passe(jouer(p7, "Bash", "terraform destroy -auto-approve"));
  });
  check("7 bis `--poser` écrit sous todo\\ au pilot (registre TODO.jsonl présent), sous forge\\ chez un produit (cas 7)", () => {
    const pilot = projet();
    writeFileSync(join(pilot, "todo", "TODO.jsonl"), "", "utf8");
    const spec = join(base, "lot7b.json");
    writeFileSync(spec, JSON.stringify({ decision: "D-79", reponse_humaine: "79a : approuvé, toute la liste", gestes: [gesteEssai] }), "utf8");
    const r = spawnSync(process.execPath, [HOOK, "--poser", "--lot", spec, "--racine", pilot], { encoding: "utf8" });
    if (r.status !== 0 || !existsSync(join(pilot, "todo", "gestes-approuves.jsonl")) || existsSync(join(pilot, "forge"))) throw new Error(`${r.status} ${r.stdout}${r.stderr}`);
    passe(jouer(pilot, "Bash", "az group delete --name rg-essai --yes"));
  });
  check("8 rouge — un lot dont `expire` dépasse 24 h est plafonné : posé il y a 30 h, expire dans 10 jours, refusé", () => {
    const p = projet();
    ecrireLot(p, lotOk([gesteEssai], { horodatage: il_y_a(30), expire: il_y_a(-240) }));
    refuse(jouer(p, "Bash", "az group delete --name rg-essai --yes"));
  });
  check("9 rouge — la même commande pour une autre cible que celle du lot : refusée (rg-prod n'est pas rg-essai)", () => {
    const p = projet();
    ecrireLot(p, lotOk([gesteEssai]));
    refuse(jouer(p, "Bash", "az group delete --name rg-prod --yes"));
  });
  check("9 bis vert — la cible du lot avec une option de plus (--no-wait) : acceptée", () => {
    const p = projet();
    ecrireLot(p, lotOk([gesteEssai]));
    passe(jouer(p, "Bash", "az group delete --name rg-essai --yes --no-wait"));
  });
  check("10 rouge — deux gestes dans une commande, un seul approuvé : refusé, et le message ne nomme que l'autre", () => {
    const p = projet();
    ecrireLot(p, lotOk([gesteEssai]));
    const r = jouer(p, "Bash", "az group delete --name rg-essai --yes && terraform state rm azurerm_resource_group.essai");
    refuse(r);
    if (!/terraform state rm/.test(r.err) || /refusé[^]*az group delete --name rg-essai --yes :/.test(r.err.split("Aucun lot")[0])) throw new Error(r.err.slice(0, 300));
  });
  check("10 bis vert — les deux gestes approuvés dans UN lot : la commande composée passe", () => {
    const p = projet();
    ecrireLot(p, lotOk([gesteEssai, { commande: "terraform state rm azurerm_resource_group.essai", cible: "état de l'essai", effet: "retire la ressource de l'état", retour_arriere: "terraform import" }]));
    passe(jouer(p, "Bash", "az group delete --name rg-essai --yes && terraform state rm azurerm_resource_group.essai"));
  });
  check("11 le lot d'une autre session ne vaut pas : refusé ; de la même session : accepté", () => {
    const p = projet();
    ecrireLot(p, lotOk([gesteEssai], { session: "S1" }));
    refuse(jouer(p, "Bash", "az group delete --name rg-essai --yes", { session_id: "S2" }));
    passe(jouer(p, "Bash", "az group delete --name rg-essai --yes", { session_id: "S1" }));
  });
  check("12 rouge — un lot sans les mots de l'humain (reponse_humaine) ne vaut pas, et `--poser` le refuse (exit 1)", () => {
    const p = projet();
    const { reponse_humaine, ...sans } = lotOk([gesteEssai]);
    ecrireLot(p, sans);
    const r = jouer(p, "Bash", "az group delete --name rg-essai --yes");
    refuse(r);
    if (!/reponse_humaine/.test(r.err)) throw new Error(r.err.slice(0, 300));
    const spec = join(base, "lot12.json");
    writeFileSync(spec, JSON.stringify({ decision: "D-80", gestes: [gesteEssai] }), "utf8");
    const w = spawnSync(process.execPath, [HOOK, "--poser", "--lot", spec, "--racine", p], { encoding: "utf8" });
    if (w.status !== 1 || !/reponse_humaine/.test(w.stderr)) throw new Error(`${w.status} ${w.stderr}`);
  });
  check("12 bis — `--poser` refuse une durée de 48 h et un geste sans retour arrière (exit 1, rien d'écrit)", () => {
    const p = projet();
    const spec = join(base, "lot12b.json");
    writeFileSync(spec, JSON.stringify({ decision: "D-80", reponse_humaine: "80a, c'est approuvé", gestes: [gesteEssai] }), "utf8");
    const long = spawnSync(process.execPath, [HOOK, "--poser", "--lot", spec, "--racine", p, "--duree-h", "48"], { encoding: "utf8" });
    writeFileSync(spec, JSON.stringify({ decision: "D-80", reponse_humaine: "80a, c'est approuvé", gestes: [{ ...gesteEssai, retour_arriere: "" }] }), "utf8");
    const sans = spawnSync(process.execPath, [HOOK, "--poser", "--lot", spec, "--racine", p], { encoding: "utf8" });
    if (long.status !== 1 || sans.status !== 1 || existsSync(join(p, "todo", "gestes-approuves.jsonl")) || existsSync(join(p, "forge", "gestes-approuves.jsonl"))) throw new Error(`${long.status} ${sans.status} ${long.stderr}${sans.stderr}`);
  });

  // ---- Un arbre de travail lié voit les lots de l'arbre principal ---------------------------
  check("13 un lot posé dans l'arbre principal couvre la commande jouée depuis un arbre de travail lié", () => {
    const principal = join(base, "principal");
    mkdirSync(join(principal, "todo"), { recursive: true });
    const g = (...a) => spawnSync("git", ["-c", "user.name=essai", "-c", "user.email=essai@exemple.fr", ...a], { cwd: principal, encoding: "utf8" });
    if (g("init", "-q").status !== 0 || g("commit", "-q", "--allow-empty", "-m", "racine").status !== 0) throw new Error("git init/commit impossible dans l'essai");
    const lie = join(base, "lie");
    const w = g("worktree", "add", "-q", lie, "-b", "essai");
    if (w.status !== 0) throw new Error(`git worktree add : ${w.stderr}`);
    refuse(jouer(lie, "Bash", "az group delete --name rg-essai --yes"));
    ecrireLot(principal, lotOk([gesteEssai]));
    passe(jouer(lie, "Bash", "az group delete --name rg-essai --yes"));
  });

  // ---- La liste fermée, dans les deux sens --------------------------------------------------
  const ROUGES = [
    ["Bash", "terraform destroy", "terraform destroy"],
    ["Bash", "terraform -chdir=infra apply -destroy -auto-approve", "terraform apply -destroy derrière -chdir"],
    ["Bash", "tofu state rm azurerm_storage_account.etat", "tofu state rm"],
    ["Bash", "terraform workspace delete essai", "terraform workspace delete"],
    ["Bash", "az role assignment create --assignee x --role Owner --scope /subscriptions/s", "az role assignment create"],
    ["Bash", "az role assignment delete --ids abc", "az role assignment delete"],
    ["Bash", "az keyvault purge --name kv-essai", "az keyvault purge"],
    ["Bash", "az resource delete --ids /subscriptions/s/resourceGroups/rg/providers/x/y/z", "az resource delete"],
    ["Bash", "az devops security permission update --id ns --subject s --token t --allow-bit 1", "az devops security permission update"],
    ["Bash", "az rest --method delete --url https://management.azure.com/subscriptions/s/resourceGroups/rg?api-version=2021-04-01", "az rest DELETE"],
    ["Bash", "az rest --method put --url https://management.azure.com/subscriptions/s/providers/Microsoft.Authorization/roleAssignments/g?api-version=2022-04-01 --body @r.json", "az rest PUT sur roleAssignments"],
    ["Bash", "curl -X PUT -H \"Authorization: Bearer $T\" https://dev.azure.com/org/_apis/securityroles/scopes/s/roleassignments/resources/r", "curl PUT sur l'API Azure DevOps (rôles)"],
    ["Bash", "curl -s -d @corps.json https://vssps.dev.azure.com/org/_apis/graph/memberships/a/b", "curl avec corps (POST implicite) sur graph/memberships"],
    ["Bash", "curl -X POST https://graph.microsoft.com/v1.0/servicePrincipals/x/appRoleAssignments -d @a.json", "curl POST Microsoft Graph appRoleAssignments"],
    ["PowerShell", "Invoke-RestMethod -Method Put -Uri https://dev.azure.com/org/_apis/accesscontrolentries/ns -Body $b", "Invoke-RestMethod PUT accesscontrolentries (PowerShell)"],
    ["PowerShell", "$r = Invoke-RestMethod -Uri https://api.example.org/x -Method DELETE", "Invoke-RestMethod DELETE, affectation de tête"],
    ["PowerShell", "Remove-AzResourceGroup -Name rg-essai -Force", "Remove-AzResourceGroup"],
    ["PowerShell", "New-AzRoleAssignment -ObjectId x -RoleDefinitionName Owner", "New-AzRoleAssignment"],
    ["PowerShell", "& az group delete -n rg-essai --yes", "az précédé de & sous PowerShell"],
    ["Bash", "gh repo delete org/depot-essai --yes", "gh repo delete"],
    ["Bash", "gh api -X DELETE repos/org/depot-essai", "gh api -X DELETE"],
    ["Bash", "gh api repos/org/depot/collaborators/quelquun -X PUT -f permission=admin", "gh api PUT sur collaborators"],
    ["Bash", "git push --force-with-lease origin main", "git push --force-with-lease"],
    ["Bash", "git push -fu origin main", "git push -fu"],
    ["Bash", "git push origin +main", "git push avec référence +main"],
    ["Bash", "git push origin --delete branche-essai", "git push origin --delete"],
    ["Bash", "git -C ../depot push origin :branche-essai", "git push origin :branche (suppression)"],
    ["Bash", "git push --mirror origin", "git push --mirror"],
    ["Bash", "echo début && cd infra && az group delete -n rg-essai --yes | tee sortie.txt", "geste au milieu d'une commande composée"],
    ["Bash", "bash -c \"az group delete -n rg-essai --yes\"", "geste dans bash -c"],
    ["Bash", "az group list --query \"[].name\" -o tsv | xargs -I {} az group delete -n {} --yes", "geste derrière xargs"],
    ["Bash", "AZURE_CONFIG_DIR=/tmp/c az group delete -n rg-essai --yes", "affectation d'environnement en tête"],
    ["Bash", "'C:/Program Files/Microsoft SDKs/Azure/CLI2/wbin/az.cmd' group delete -n rg-essai", "az.cmd par chemin"],
  ];
  for (const [outil, cmd, nom] of ROUGES) check(`rouge — ${nom} : refusé sans lot`, () => refuse(jouer(projet(), outil, cmd)));

  const VERTS = [
    ["Bash", "az group show --name rg-essai", "lecture az group show"],
    ["Bash", "az role assignment list --assignee x", "az role assignment list"],
    ["Bash", "az group create --name rg-essai --location westeurope", "création ordinaire"],
    ["Bash", "az deployment group create --resource-group rg --template-file main.bicep", "déploiement ordinaire"],
    ["Bash", "az extension remove --name devops", "az extension remove (local)"],
    ["Bash", "az rest --method get --url https://management.azure.com/subscriptions/s/providers/Microsoft.Authorization/roleAssignments?api-version=2022-04-01", "az rest GET sur roleAssignments (lecture)"],
    ["Bash", "terraform plan -destroy", "terraform plan -destroy (plan seul)"],
    ["Bash", "terraform apply -auto-approve", "terraform apply (déploiement ordinaire)"],
    ["Bash", "terraform state list", "terraform state list"],
    ["Bash", "gh repo view org/depot", "gh repo view"],
    ["Bash", "gh api repos/org/depot/collaborators", "gh api GET"],
    ["Bash", "gh pr merge 12 --squash", "gh pr merge"],
    ["Bash", "git push -u origin feature/essai", "git push -u"],
    ["Bash", "git push origin HEAD:refs/heads/essai", "git push d'un refspec ordinaire"],
    ["Bash", "git commit -m \"doc : az group delete et terraform destroy exigent un lot\"", "les mots dans un message de commit"],
    ["Bash", "grep -rn \"terraform destroy\" docs/", "les mots dans un grep"],
    ["Bash", "echo az group delete", "les mots derrière echo"],
    ["Bash", "cat > note.md <<'EOF'\naz group delete --name rg-essai\ngit push --force\nEOF", "un document en ligne qui cite les commandes"],
    ["Bash", "curl -X DELETE http://localhost:8080/api/items/3", "DELETE vers la machine locale"],
    ["Bash", "curl -s https://dev.azure.com/org/_apis/securityroles/scopes/s/roleassignments/resources/r", "curl GET sur les rôles (lecture)"],
    ["PowerShell", "Remove-Item -Recurse -Force .\\tmp", "Remove-Item local"],
    ["PowerShell", "Invoke-RestMethod -Uri https://dev.azure.com/org/_apis/graph/groups", "Invoke-RestMethod GET"],
    ["PowerShell", "Remove-AzContext -Force", "Remove-AzContext (local)"],
    ["Write", "az group delete --name rg-essai", "un outil qui n'est pas une commande"],
  ];
  for (const [outil, cmd, nom] of VERTS) check(`vert — ${nom} : laisse passer`, () => passe(jouer(projet(), outil, cmd)));
} finally {
  try { rmSync(base, { recursive: true, force: true, maxRetries: 3 }); } catch { /* toléré */ }
}

console.log(`\nhook-gestes-distants : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
