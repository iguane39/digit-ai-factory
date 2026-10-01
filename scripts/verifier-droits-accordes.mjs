#!/usr/bin/env node
/**
 * verifier-droits-accordes.mjs — un script qui accorde un droit nomme des identifiants JUSTES, ne
 * masque pas l'échec de l'ajout, et relit l'effet avant de l'annoncer (TF-1497 ; 01/10/2026).
 *
 * LE FAIT. Le 30/09/2026, le projet commun relit un constat de Produit-03 et trouve qu'un script du
 * produit écrit depuis le 16/09 un identifiant de permission Microsoft Graph faux :
 * `18a4783c-866b-4cc7-a460-3d0e455740fd`, là où Graph et sa documentation donnent
 * `18a4783c-866b-4cc7-a460-3d5e5662c884` pour Application.ReadWrite.OwnedBy. Les 2 identifiants
 * partagent leurs 26 premiers caractères : l'identifiant avait été écrit de mémoire. L'étape qui
 * devait accorder la permission ajoutait l'identifiant faux en masquant son échec
 * (`2>/dev/null || true`), puis écrivait « consentie » sans relire l'annuaire.
 *
 * CE QUI EST JUGÉ, HORS LIGNE, sur un fichier ou sur les scripts d'un produit :
 *   DA-1  chaque identifiant de permission Graph se compare à la TABLE OFFICIELLE datée
 *         (`references/PERMISSIONS-GRAPH.json`) : un quasi-homonyme d'un identifiant connu, un
 *         identifiant inconnu employé comme permission, un nom de permission qui ne possède pas
 *         l'identifiant écrit, ou un type inversé (`=Role` pour une permission déléguée) est refusé ;
 *   DA-2  une commande qui accorde un droit ne masque pas son échec (`|| true`, `2>/dev/null`,
 *         `-ErrorAction SilentlyContinue`) ;
 *   DA-3  une annonce de succès (« ok », « consentie », « accordée ») qui suit une commande d'octroi
 *         est précédée d'une RELECTURE de l'effet dans la plateforme.
 *
 * LA TABLE EST UNE DONNÉE DATÉE (loi n° 4) : `--rafraichir` la relit à sa source officielle, la page
 * « Microsoft Graph permissions reference » publiée sur learn.microsoft.com, et réécrit la date du
 * relevé, la date de mise à jour et le commit que la page déclare, et l'empreinte de ce qui a été lu.
 * Le jugement, lui, ne touche jamais le réseau.
 *
 * Usage : node scripts/verifier-droits-accordes.mjs <fichier|produit> [--table <permissions.json>]
 *         node scripts/verifier-droits-accordes.mjs --rafraichir [--source <page.html|source.md>] [--sortie <fichier.json>]
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = rien à juger (aucun identifiant Graph
 *          ni commande d'octroi), ou table illisible.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const TABLE = join(ICI, "..", "references", "PERMISSIONS-GRAPH.json");
// LA PAGE PUBLIÉE fait foi, pas le dépôt public de la documentation. Mesuré le 01/10/2026 : la page
// de learn.microsoft.com, mise à jour le 15/09/2026, porte l'identifiant d'application de
// Policy.ReadWrite.Recovery, que la copie de `main` du dépôt microsoft-graph-docs-contrib (dernier
// commit du 04/08/2026) n'a pas encore ; les 1 504 autres identifiants concordent.
const SOURCE_PUBLIEE = "https://learn.microsoft.com/en-us/graph/permissions-reference";
// L'identifiant d'application de Microsoft Graph, lu dans la même documentation (requête officielle
// qui liste ses permissions). Ce n'est pas une permission : il n'est jamais jugé comme telle.
const GRAPH_APP_ID = "00000003-0000-0000-c000-000000000000";
const RESOLUTION = `az rest --method get --url "https://graph.microsoft.com/v1.0/servicePrincipals(appId='${GRAPH_APP_ID}')?$select=appRoles,oauth2PermissionScopes"`;

const NON_JUGE = [
  "les permissions des AUTRES ressources que Microsoft Graph (SharePoint, Exchange, gestion Azure) et les identifiants de rôles : la table ne porte que Graph",
  "une permission publiée APRÈS la date de la table : elle se lit « inconnue » ; le message donne la commande qui la résout et celle qui rafraîchit la table",
  "la relecture elle-même (DA-3) : le contrôle exige qu'une commande de lecture précède l'annonce, il ne juge pas qu'elle compare ce qu'elle lit",
  "un identifiant que le script reçoit d'ailleurs (paramètre, fichier lu à l'exécution) : seul ce qui est écrit dans le fichier est jugé",
  "le TYPE d'une permission déclaré sur une autre ligne que son identifiant (bloc Terraform, manifeste JSON) : seul `<id>=Role|Scope` et la variable employée ainsi sont confrontés",
];

// ── La table ───────────────────────────────────────────────────────────────────────────────────

/** La table officielle, rendue en index : `parId` (identifiant → { nom, type }), `parTete` (8 premiers caractères). */
export function chargerTable(chemin = TABLE) {
  const t = JSON.parse(readFileSync(chemin, "utf8"));
  const parId = new Map();
  const parTete = new Map();
  const noms = new Set();
  const inscrire = (id, nom, type) => {
    parId.set(id.toLowerCase(), { nom, type });
    const tete = id.slice(0, 8).toLowerCase();
    if (!parTete.has(tete)) parTete.set(tete, []);
    parTete.get(tete).push({ id: id.toLowerCase(), nom, type });
  };
  for (const [nom, ids] of Object.entries(t.permissions || {})) {
    noms.add(nom);
    for (const type of ["application", "delegue"]) if (ids && ids[type]) inscrire(ids[type], nom, type);
  }
  for (const [nom, id] of Object.entries(t.rsc || {})) { noms.add(nom); if (id) inscrire(id, nom, "rsc"); }
  return { date: t.date, lu_le: t.source && t.source.lu_le, parId, parTete, noms, total: noms.size };
}

const EST_GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const guidOuNul = (v) => (EST_GUID.test(String(v).trim()) ? String(v).trim().toLowerCase() : null);
const texteDe = (html) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();

/**
 * La référence officielle rendue en table : `{ permissions: { nom: { application, delegue } }, rsc: { nom: id } }`.
 * Deux formes sont lues, la page PUBLIÉE (HTML : `<h3>Nom</h3>` puis la ligne `Identifier` de son
 * tableau) et la source Markdown (`### Nom` puis `| Identifier | … |`) ; les permissions à
 * consentement propre à une ressource (RSC) viennent du tableau « Name | ID » de leur section.
 */
export function analyserReference(texte) {
  const permissions = {};
  const rsc = {};
  if (/<h3[\s>]/i.test(texte)) {
    const titres = [...texte.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ niveau: m[1], nom: texteDe(m[2]), fin: m.index + m[0].length, debut: m.index }));
    titres.forEach((t, i) => {
      const corps = texte.slice(t.fin, i + 1 < titres.length ? titres[i + 1].debut : texte.length);
      if (t.niveau === "3") {
        const m = /<td[^>]*>\s*Identifier\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i.exec(corps);
        if (m) permissions[t.nom] = { application: guidOuNul(texteDe(m[1])), delegue: guidOuNul(texteDe(m[2])) };
      } else if (/resource-specific consent/i.test(t.nom)) {
        for (const r of corps.matchAll(/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/gi)) {
          const id = guidOuNul(texteDe(r[2]));
          if (id) rsc[texteDe(r[1])] = id;
        }
      }
    });
    return { permissions, rsc };
  }
  let nom = null, dansRsc = false;
  for (const l of texte.split(/\r?\n/)) {
    if (/^##\s/.test(l)) { dansRsc = /resource-specific consent/i.test(l); nom = null; continue; }
    const h = /^###\s+(\S+)\s*$/.exec(l);
    if (h) { nom = h[1]; continue; }
    const m = /^\|\s*Identifier\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/.exec(l);
    if (m && nom) { permissions[nom] = { application: guidOuNul(m[1]), delegue: guidOuNul(m[2]) }; nom = null; continue; }
    const r = dansRsc && /^\|\s*([^|]+?)\s*\|\s*([0-9a-f-]{36})\s*\|/i.exec(l);
    if (r && guidOuNul(r[2])) rsc[r[1]] = guidOuNul(r[2]);
  }
  return { permissions, rsc };
}

/** Une ligne par permission : un rafraîchissement se lit en diff, permission par permission. */
function ecrireTable(sortie, { permissions, rsc }, source) {
  const tri = (o) => Object.keys(o).sort((a, b) => a.localeCompare(b, "en"));
  const noms = tri(permissions);
  const nomsRsc = tri(rsc);
  const tete = {
    format: "pilot/permissions-graph@1",
    version: "1.0.0",
    date: source.lu_le.slice(0, 10),
    source,
    graph_app_id: GRAPH_APP_ID,
    pourquoi_une_donnee: "Loi transverse n° 4 : les permissions de Microsoft Graph se publient et se retirent sans prévenir. La table vit ici, datée, sourcée et rafraîchie par une commande, pour qu'un identifiant écrit dans un script se juge hors ligne contre la documentation officielle, jamais contre une mémoire (TF-1497, D-37 (a) du 01/10/2026).",
    regle: "scripts/verifier-droits-accordes.mjs, règle DA-1 : un identifiant de permission Graph écrit dans un script est un identifiant de cette table, sous le nom et le type que le script lui donne.",
    rafraichir: "node scripts/verifier-droits-accordes.mjs --rafraichir",
    compte: { permissions: noms.length, identifiants: noms.reduce((n, k) => n + (permissions[k].application ? 1 : 0) + (permissions[k].delegue ? 1 : 0), 0), rsc: nomsRsc.length },
  };
  const bloc = (cle, liste, o) => `  ${JSON.stringify(cle)}: {\n${liste.map((n) => `    ${JSON.stringify(n)}: ${JSON.stringify(o[n])}`).join(",\n")}\n  }`;
  const entete = JSON.stringify(tete, null, 2).replace(/\n}$/, "");
  writeFileSync(sortie, `${entete},\n${bloc("permissions", noms, permissions)},\n${bloc("rsc", nomsRsc, rsc)}\n}\n`, "utf8");
  return tete.compte;
}

async function rafraichir(args) {
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const sortie = valeur("--sortie") || TABLE;
  const local = valeur("--source");
  const luLe = valeur("--lu-le") || new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  let texte;
  if (local) texte = readFileSync(local, "utf8");
  else {
    const r = await fetch(SOURCE_PUBLIEE);
    if (!r.ok) throw new Error(`page officielle injoignable : HTTP ${r.status}`);
    texte = await r.text();
  }
  // La page dit elle-même sa date de mise à jour et le commit qui l'a produite : relevés, jamais supposés.
  const meta = (nom) => (new RegExp(`<meta name="${nom}" content="([^"]*)"`).exec(texte) || [])[1] || null;
  const table = analyserReference(texte);
  if (Object.keys(table.permissions).length < 100) throw new Error(`la source ne rend que ${Object.keys(table.permissions).length} permission(s) : forme inattendue, table NON réécrite`);
  const compte = ecrireTable(sortie, table, {
    quoi: "Microsoft Graph permissions reference : la ligne Identifier de chaque permission (application, déléguée) et le tableau des permissions RSC",
    ou: local ? `copie locale ${local.split(/[\\/]/).pop()} de ${SOURCE_PUBLIEE}` : SOURCE_PUBLIEE,
    mise_a_jour_de_la_page: meta("updated_at"),
    commit_de_la_page: meta("gitcommit"),
    sha256: createHash("sha256").update(texte).digest("hex"),
    lu_le: luLe,
  });
  process.stdout.write(JSON.stringify({ outil: "verifier-droits-accordes", mode: "rafraichir", sortie, compte }) + "\n");
}

// ── Le jugement ────────────────────────────────────────────────────────────────────────────────

const EXTENSIONS = /\.(sh|bash|ps1|psm1|ya?ml|tf|tfvars|bicep|bicepparam|json)$/i;
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input", ".terraform"]);
const GUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
// Les commandes qui ACCORDENT un droit, et celles qui en RELISENT l'effet. Des DONNÉES.
const OCTROI = /\baz\s+ad\s+app\s+permission\s+(?:add|grant|admin-consent)\b|\baz\s+role\s+assignment\s+create\b|\bNew-MgServicePrincipalAppRoleAssignment\b|\bNew-MgOauth2PermissionGrant\b|\bNew-AzRoleAssignment\b|\baz\s+rest\b[^\n]*--method\s+post\b[^\n]*appRoleAssign/i;
const RELECTURE = /\baz\s+ad\s+app\s+permission\s+(?:list|list-grants)\b|\baz\s+role\s+assignment\s+list\b|\baz\s+ad\s+sp\s+show\b|\baz\s+rest\b(?![^\n]*--method\s+(?:post|patch|put|delete)\b)|\bGet-MgServicePrincipalAppRoleAssignment\b|\bGet-MgOauth2PermissionGrant\b|\bGet-AzRoleAssignment\b/i;
const MASQUE = [
  [/\|\|\s*(?:true|:)(?=\s|;|$|\))/, "« || true » rend l'échec muet"],
  [/\|\|\s*echo\b/, "« || echo » remplace l'échec par un message"],
  [/2>\s*\/dev\/null|&>\s*\/dev\/null|2>\s*\$null/i, "la sortie d'erreur est jetée"],
  [/-ErrorAction\s+(?:SilentlyContinue|Ignore)\b/i, "-ErrorAction efface l'erreur"],
];
// UNE ANNONCE DE SUCCÈS : une commande d'affichage, ou une fonction du script dont le NOM annonce le
// succès (`ok "…"`, `success "…"`), qui porte un mot de succès. Mesuré le 01/10/2026 sur le script
// réel du cas fondateur : l'annonce « consentie » y passait par une fonction `ok`, que la première
// forme de cette règle, limitée à `echo`, ne voyait pas. Un message qui avoue un refus ou un doute
// (« déjà attribué, ou refusé faute de droits ») n'annonce pas un succès.
const SUCCES = /\bok\b|\bconsentie?s?\b|\baccord[ée]e?s?\b|\battribu[ée]e?s?\b|\bgranted\b|\bassigned\b|\br[ée]ussie?\b|\bsucc[eè]s\b|\bdone\b|✓|✔/i;
const AFFICHAGE = /^\s*(?:echo|printf|Write-Host|Write-Output|log\w*|info|ok|succes\w*|success\w*|reussi\w*|done)\b/i;
const AVEU = /refus|[ée]chec|erreur|impossible|faute\s+de|\bwarn|absente?s?\b|\bfailed\b|\berror\b/i;
const estAnnonce = (l) => AFFICHAGE.test(l) && SUCCES.test(l) && !AVEU.test(l);
const NOM_PERMISSION = /\b[A-Za-z][\w-]*(?:\.[A-Za-z][\w-]*)+\b/g;

/** Les lignes LOGIQUES d'un script : une continuation (`\` en shell, accent grave en PowerShell) se rejoint. */
function lignesLogiques(texte) {
  const brutes = texte.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < brutes.length; i++) {
    let l = brutes[i];
    const debut = i;
    while (/(\\|`)\s*$/.test(l) && i + 1 < brutes.length) { l = l.replace(/(\\|`)\s*$/, " ") + brutes[++i].trim(); }
    out.push({ texte: l, ligne: debut + 1 });
  }
  return out;
}
const estCommentaire = (l) => /^\s*(#|\/\/|REM\b)/i.test(l);
const prefixeCommun = (a, b) => { let n = 0; while (n < a.length && a[n] === b[n]) n++; return n; };

export function jugerTexte(texte, rel, table) {
  const findings = [];
  const refus = (regle, ligne, message) => findings.push({ regle, statut: "FAIL", ou: `${rel}:${ligne}`, message });
  const mesure = { identifiants_graph: 0, resolus: 0, octrois: 0 };
  const L = lignesLogiques(texte);
  // Les variables qui portent un identifiant : `NOM="guid"`, `$Nom = 'guid'`, `nom = "guid"`.
  const variables = new Map();
  for (const { texte: t, ligne } of L) {
    const m = /^\s*(?:export\s+|readonly\s+|local\s+|\$)?([A-Za-z_][\w]*)\s*=\s*["']?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})["']?/i.exec(t);
    if (m) variables.set(m[1], { guid: m[2].toLowerCase(), ligne });
  }
  // Une variable EMPLOYÉE comme permission (`$VAR=Role`, `${VAR}=Scope`) : son type attendu.
  const typeAttendu = new Map();
  for (const { texte: t } of L) {
    for (const m of t.matchAll(/\$\{?([A-Za-z_]\w*)\}?\s*=\s*(Role|Scope)\b/g)) typeAttendu.set(m[1], m[2] === "Role" ? "application" : "delegue");
  }

  const annoncesVues = new Set();
  L.forEach(({ texte: t, ligne }, idx) => {
    if (estCommentaire(t)) return;
    // DA-1 — chaque identifiant écrit, confronté à la table.
    const precedent = idx > 0 && estCommentaire(L[idx - 1].texte) ? L[idx - 1].texte : "";
    // Un bloc de permissions déclaré sur plusieurs lignes (Terraform, manifeste JSON) : la fenêtre voisine dit le contexte.
    const voisinage = L.slice(Math.max(0, idx - 3), idx + 3).map((x) => x.texte).join("\n");
    const blocDePermissions = /resource_access|resourceAccess|resource_app_id|resourceAppId|--api-permissions|app_?role_?id/i.test(voisinage);
    const nomsCites = [...`${t} ${precedent}`.matchAll(NOM_PERMISSION)].map((m) => m[0]).filter((n) => table.noms.has(n));
    for (const m of t.matchAll(GUID)) {
      const id = m[0].toLowerCase();
      if (id === GRAPH_APP_ID) continue;
      const avant = t.slice(0, m.index);
      if (/(--api|resourceAppId["']?\s*[:=]|resource_app_id\s*=)\s*["']?$/i.test(avant)) continue; // l'identifiant d'une API, pas d'une permission
      const apres = t.slice(m.index + m[0].length);
      const typeLigne = /^\s*=\s*(Role|Scope)\b/.exec(apres);
      const variable = /^\s*(?:export\s+|readonly\s+|local\s+|\$)?([A-Za-z_]\w*)\s*=\s*["']?$/.exec(avant);
      const nomVariable = variable ? variable[1] : null;
      const attendu = typeLigne ? (typeLigne[1] === "Role" ? "application" : "delegue") : (nomVariable && typeAttendu.get(nomVariable)) || null;
      const contexteGraph = nomsCites.length > 0 || attendu !== null || blocDePermissions
        || /graph/i.test(t) || (nomVariable && /graph/i.test(nomVariable));
      const connu = table.parId.get(id);
      if (connu) {
        mesure.identifiants_graph++;
        if (nomsCites.length && !nomsCites.includes(connu.nom)) {
          refus("DA-1", ligne, `le texte nomme ${nomsCites.join(", ")}, mais ${id} est l'identifiant de ${connu.nom} (${connu.type}) dans la table officielle du ${table.date} — nom et identifiant discordants. Résoudre : ${RESOLUTION}`);
        } else if (attendu && attendu !== connu.type) {
          refus("DA-1", ligne, `${id} est l'identifiant ${connu.type === "application" ? "d'APPLICATION (=Role)" : "DÉLÉGUÉ (=Scope)"} de ${connu.nom}, employé ici comme ${attendu === "application" ? "permission d'application (=Role)" : "permission déléguée (=Scope)"} — type inversé`);
        } else mesure.resolus++;
        continue;
      }
      const proches = (table.parTete.get(id.slice(0, 8)) || []);
      if (proches.length) {
        mesure.identifiants_graph++;
        const p = proches.map((q) => ({ ...q, commun: prefixeCommun(q.id, id) })).sort((a, b) => b.commun - a.commun)[0];
        refus("DA-1", ligne, `${id} n'est PAS une permission Graph : il partage ses ${p.commun} premiers caractères avec ${p.nom} (${p.type}), dont l'identifiant officiel est ${p.id} (table du ${table.date}) — un identifiant écrit de mémoire. Résoudre contre la plateforme dans le tour qui l'écrit, et porter la commande en commentaire : ${RESOLUTION}`);
        continue;
      }
      if (contexteGraph) {
        mesure.identifiants_graph++;
        refus("DA-1", ligne, `${id}, employé comme permission Graph${nomVariable ? ` (variable ${nomVariable})` : ""}, est INCONNU de la table officielle du ${table.date} (${table.total} permissions). Résoudre contre la plateforme : ${RESOLUTION} ; si la permission est plus récente que la table : node scripts/verifier-droits-accordes.mjs --rafraichir`);
      }
    }
    // DA-2 — une commande d'octroi ne masque pas son échec.
    if (OCTROI.test(t)) {
      mesure.octrois++;
      const masques = MASQUE.filter(([motif]) => motif.test(t)).map(([, quoi]) => quoi);
      if (masques.length) {
        refus("DA-2", ligne, `commande qui accorde un droit, échec MASQUÉ : ${masques.join(" ; ")} — « ${t.trim().slice(0, 110)} ». Le 16/09/2026, un identifiant faux a été ajouté ainsi sans que rien ne le dise ; laisser l'erreur s'afficher et arrêter l'étape`);
      }
      // DA-3 — l'annonce de succès qui suit est précédée d'une relecture.
      for (let k = idx + 1; k < Math.min(L.length, idx + 21); k++) {
        const s = L[k].texte;
        if (RELECTURE.test(s) && !estCommentaire(s)) break;
        if (OCTROI.test(s)) continue;
        if (estAnnonce(s)) {
          if (annoncesVues.has(k)) break; // une annonce se compte une fois, même après plusieurs octrois
          annoncesVues.add(k);
          refus("DA-3", L[k].ligne, `succès annoncé sans relecture de l'effet : « ${s.trim().slice(0, 90)} » suit l'octroi de la ligne ${ligne} sans aucune commande qui relise la plateforme (az ad app permission list, az rest --method get …/appRoleAssignments, az role assignment list). Relire, comparer, puis écrire « ok »`);
          break;
        }
      }
    }
  });
  return { findings, mesure };
}

function fichiersAJuger(cible) {
  if (statSync(cible).isFile()) return [{ chemin: cible, rel: cible.split(/[\\/]/).pop() }];
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!IGNORES.has(e.name) && reste > 0) marcher(p, reste - 1); }
      else if (e.isFile() && EXTENSIONS.test(e.name) && !/(-lock|\.lock)\.json$|^package-lock\.json$/i.test(e.name)) {
        out.push({ chemin: p, rel: relative(cible, p).split("\\").join("/") });
      }
    }
  };
  marcher(cible, 5);
  return out;
}

export function juger(cible, table) {
  const findings = [];
  const mesure = { fichiers: 0, identifiants_graph: 0, resolus: 0, octrois: 0, refus: 0 };
  for (const { chemin, rel } of fichiersAJuger(cible)) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); } catch { continue; }
    if (texte.length > 2_000_000) continue;
    mesure.fichiers++;
    const r = jugerTexte(texte, rel, table);
    findings.push(...r.findings);
    for (const k of ["identifiants_graph", "resolus", "octrois"]) mesure[k] += r.mesure[k];
  }
  mesure.refus = findings.length;
  return { findings, mesure, rienAJuger: !mesure.identifiants_graph && !mesure.octrois };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify(corps, null, 1) + "\n"); process.exit(code); };
  if (args.includes("--rafraichir")) {
    rafraichir(args).catch((e) => sortir({ outil: "verifier-droits-accordes", mode: "rafraichir", verdict: "NON_JUGEABLE", message: e.message }, 2));
  } else {
    const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
    const cheminTable = valeur("--table") || TABLE;
    const cible = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--table")[0] || process.cwd();
    let table;
    try { table = chargerTable(cheminTable); }
    catch (e) { sortir({ outil: "verifier-droits-accordes", verdict: "NON_JUGEABLE", message: `table officielle illisible (${cheminTable}) : ${e.message}` }, 2); }
    if (!existsSync(cible)) sortir({ outil: "verifier-droits-accordes", verdict: "NON_JUGEABLE", message: `cible introuvable : ${cible}` }, 2);
    const r = juger(cible, table);
    const age = table.date ? Math.round((Date.now() - Date.parse(table.date)) / 86400000) : null;
    const verdict = r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS";
    sortir({ outil: "verifier-droits-accordes", version: "1.0.0", regle: "TF-1497 (ETAPE-MEP.md § 3 octies)", cible, verdict,
      table: { date: table.date, age_jours: age, permissions: table.total },
      motif: r.rienAJuger ? "aucun identifiant de permission Graph ni commande d'octroi dans les fichiers jugés" : undefined,
      mesure: r.mesure, findings: r.findings, non_juge: NON_JUGE }, r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
  }
}
