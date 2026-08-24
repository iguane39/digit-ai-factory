#!/usr/bin/env node
/**
 * oracle-integrations.mjs — LE CONTRAT D'INTÉGRATION EST RENSEIGNÉ, PAS SEULEMENT PRÉSENT
 * (R-51, TF-0547, 24/08/2026).
 *
 * LE FAIT. Un produit dépendait de ONZE sources externes et, pour AUCUNE, le dépôt ne disait où se
 * trouve la source faisant autorité ni quelle sonde donne une réponse exhaustive. Chaque session
 * redécouvrait, et se trompait : un champ d'API qui omet ce que la console exige, un `404` sur `HEAD`
 * pour des pages qui répondent en `GET`, un moteur de réservation qui plafonne une valeur EN SILENCE
 * et rabat une langue sans le dire — avec des réponses identiques à l'octet près.
 *
 * CE QUE CET ORACLE REFUSE, ET C'EST TOUT SON INTÉRÊT : un fichier présent et vide. Le gabarit seul
 * ne protège de rien — c'est la leçon de R-47 (un artefact hérité présent mais périmé) et celle du
 * gabarit de retours compté « couvert à 100 % » alors que son contrôle ne vérifiait que le dossier.
 *
 *   I1 · au moins une ligne de service RENSEIGNÉE — un tableau qui n'a que sa ligne d'exemple est un
 *        gabarit, pas un contrat.
 *   I2 · chaque ligne porte ses SIX colonnes non vides : service, source faisant autorité, sonde
 *        exhaustive, écart connu, date de vérification, risque de faux silence.
 *   I3 · la date est une DATE (AAAA-MM-JJ) : sans elle l'entrée ne périme jamais et se lit comme un
 *        fait présent.
 *   I4 · le risque de faux silence est un OUI ou un NON — c'est lui qui ordonne la lecture, et un
 *        « à voir » ne l'ordonne pas.
 *
 * Un produit SANS ce fichier rend SANS_OBJET, jamais un échec : le contrat s'instaure, il ne se
 * réclame pas rétroactivement.
 *
 * Usage : node oracle-integrations.mjs <INTEGRATIONS.md|racine> [--json] · --self-test
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé.
 */
import { existsSync, readFileSync, statSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "la JUSTESSE d'une sonde déclarée : l'oracle exige qu'elle soit nommée, pas qu'elle rende vraiment une réponse exhaustive. La vérifier demanderait d'appeler onze services tiers — c'est précisément le travail que ce contrat sert à ne pas refaire à chaque session",
  "l'EXHAUSTIVITÉ de la liste des services : aucun fichier ne dit combien de dépendances un produit a. Un service oublié ici reste invisible, et c'est la limite structurelle de ce contrôle",
  "les produits SANS `INTEGRATIONS.md` : SANS_OBJET, jamais un échec. Le contrat s'instaure à partir du jour où il est posé ; l'exiger rétroactivement transformerait une bonne règle en dette de forme",
  "les bibliothèques épinglées : elles ne répondent pas et ne mentent pas, donc elles n'ont rien à faire dans ce contrat",
];

const CELLULES_ATTENDUES = 6;
const EXEMPLE = /(\*nom du service\*|\*l'endroit qui fait foi|AAAA-MM-JJ|\*la commande qui rend)/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const OUI_NON = /^(oui|non)$/i;

export function juger(texte, nom = "INTEGRATIONS.md") {
  const constats = [];
  const lignes = texte.split(/\r?\n/);
  const rangees = [];
  for (const l of lignes) {
    if (!/^\s*\|/.test(l)) continue;
    const cellules = l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    if (cellules.length < CELLULES_ATTENDUES) continue;
    if (cellules.every((c) => /^:?-{2,}:?$/.test(c))) continue;      // le séparateur du tableau
    if (/^service$/i.test(cellules[0])) continue;                    // l'en-tête
    if (cellules.some((c) => EXEMPLE.test(c))) continue;             // la ligne d'exemple du gabarit
    rangees.push(cellules);
  }

  if (!rangees.length) {
    constats.push({ regle: "I1", message:
      "aucune ligne de service RENSEIGNÉE : le fichier porte le gabarit et sa ligne d'exemple, rien " +
      "de plus. Un gabarit présent et vide ne protège de rien — c'est la leçon d'un artefact hérité " +
      "présent mais périmé, et celle d'un gabarit de retours compté couvert à 100 % dont le contrôle " +
      "ne vérifiait que le dossier" });
    return constats;
  }

  for (const [i, r] of rangees.entries()) {
    const [service, source, sonde, ecart, date, risque] = r;
    const vides = [];
    if (!service) vides.push("le service");
    if (!source) vides.push("la SOURCE faisant autorité");
    if (!sonde) vides.push("la SONDE exhaustive (une liste ne dit pas qu'elle est complète)");
    if (!ecart) vides.push("l'ÉCART connu API ↔ interface (« aucun connu » est une réponse)");
    if (vides.length) {
      constats.push({ regle: "I2", message:
        `ligne ${i + 1} (« ${service || "sans nom"} ») : il manque ${vides.join(", ")}` });
    }
    if (!DATE.test(date || "")) {
      constats.push({ regle: "I3", message:
        `ligne ${i + 1} (« ${service || "sans nom"} ») : la date de vérification est « ${date || "vide"} » ` +
        "et non une date AAAA-MM-JJ. Sans date, l'entrée ne périme jamais et se lit comme un fait présent" });
    }
    if (!OUI_NON.test(risque || "")) {
      constats.push({ regle: "I4", message:
        `ligne ${i + 1} (« ${service || "sans nom"} ») : le risque de faux silence vaut « ${risque || "vide"} » ` +
        "au lieu d'un oui ou d'un non. C'est cette colonne qui ORDONNE la lecture — les services qui " +
        "échouent bruyamment sont sans danger, ceux qui mentent en silence sont les seuls à relire" });
    }
  }
  return constats;
}

function cible(chemin) {
  if (!existsSync(chemin)) return null;
  if (statSync(chemin).isFile()) return chemin;
  for (const p of [join(chemin, "INTEGRATIONS.md"), join(chemin, "docs", "projet", "INTEGRATIONS.md"),
                   join(chemin, "docs", "INTEGRATIONS.md")]) {
    if (existsSync(p)) return p;
  }
  return null;
}

// ---- recette : les deux sens ------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");

if (lanceEnDirect && args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette de oracle-integrations — les deux sens\n");

  const ENTETE = "| Service | Source faisant autorité | Sonde exhaustive | Écart connu API ↔ interface | Vérifié le | Risque de faux silence |\n|---|---|---|---|---|---|\n";
  const GABARIT = ENTETE + "| *nom du service* | *l'endroit qui fait foi* | *la commande qui rend la réponse COMPLÈTE* | *ce que l'API omet* | *AAAA-MM-JJ* | *oui / non* |\n";
  att("le gabarit VIDE est refusé : présent ne vaut pas renseigné (I1)",
    juger(GABARIT).some((c) => c.regle === "I1"));

  const VERT = ENTETE +
    "| Railway | console du projet | `gql dnsRecords + verificationDnsHost + verificationToken` (introspection du type) | `dnsRecords` omet le TXT que la console exige | 2026-08-24 | oui |\n" +
    "| OVH | interface DNS | `curl -X GET` (jamais HEAD : 404 sur les pages applicatives) | aucun connu au-delà du HEAD | 2026-08-24 | non |\n";
  att("deux lignes complètes ne déclenchent rien", juger(VERT).length === 0);

  att("une SONDE manquante est signalée (I2)",
    juger(ENTETE + "| Beds24 | console | | plafonne en silence | 2026-08-24 | oui |\n").some((c) => c.regle === "I2"));
  att("un ÉCART vide est signalé, et « aucun connu » est la réponse attendue",
    juger(ENTETE + "| Beds24 | console | `GET /bookings?full=1` | | 2026-08-24 | oui |\n").some((c) => c.regle === "I2"));
  att("une date qui n'est pas une date est signalée (I3)",
    juger(ENTETE + "| Beds24 | console | `GET` | aucun connu | récemment | oui |\n").some((c) => c.regle === "I3"));
  att("un risque « à voir » est refusé (I4)",
    juger(ENTETE + "| Beds24 | console | `GET` | aucun connu | 2026-08-24 | à voir |\n").some((c) => c.regle === "I4"));

  // BORNE : le gabarit du pilot lui-même doit passer la lecture de son propre en-tête sans être
  // pris pour un contrat renseigné — sinon l'oracle validerait son propre modèle vide.
  const gabaritDuPilot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "gabarits", "INTEGRATIONS.md");
  if (existsSync(gabaritDuPilot)) {
    att("le GABARIT du pilot est reconnu comme vide, pas comme un contrat",
      juger(readFileSync(gabaritDuPilot, "utf8")).some((c) => c.regle === "I1"));
  } else att("le gabarit du pilot est introuvable — la borne n'a pas pu être jouée", false);

  const dir = mkdtempSync(join(tmpdir(), "integrations-"));
  writeFileSync(join(dir, "INTEGRATIONS.md"), VERT, "utf8");
  att("la découverte trouve le fichier à la racine d'un produit", cible(dir)?.endsWith("INTEGRATIONS.md"));
  rmSync(dir, { recursive: true, force: true });
  att("un produit SANS contrat rend SANS_OBJET, jamais un échec", cible(tmpdir()) === null);

  console.log(`\nRecette integrations : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

if (lanceEnDirect) {
  const cibles = args.filter((a) => !a.startsWith("--"));
  if (!cibles.length) so("I0", "(aucun argument)", "aucune cible — cet oracle juge un contrat d'intégration qu'on lui passe");
  for (const c of cibles) {
    const f = cible(c);
    if (!f) { so("I0", c, "aucun `INTEGRATIONS.md` — SANS_OBJET : le contrat s'instaure, il ne se réclame pas rétroactivement"); continue; }
    const constats = juger(readFileSync(f, "utf8"), f);
    if (!constats.length) ok("I1", f, "chaque service déclaré porte sa source, sa sonde exhaustive, son écart connu, sa date et son risque de faux silence");
    else for (const x of constats) ko(x.regle, f, x.message);
  }
  const verdict = F.some((f) => f.statut === "FAIL") ? "FAIL"
    : F.every((f) => f.statut === "SANS_OBJET") ? "SKIP" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-integrations", version: "1.0.0", verdict,
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
}
