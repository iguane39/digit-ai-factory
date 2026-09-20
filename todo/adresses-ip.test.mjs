#!/usr/bin/env node
/**
 * adresses-ip.test.mjs — une adresse IP hors des plages de documentation et de bouclage se fait
 * QUALIFIER à l'accueil et à l'ingestion d'un lot (TF-1134 (a), 15/09/2026).
 *
 * Adresses INVENTÉES : le rouge est pris dans une plage PRIVÉE (10.213.47.9, fd3c:9a1e:4b27::15), le
 * vert dans les plages de DOCUMENTATION (RFC 5737, RFC 3849). Aucune adresse d'un poste réel.
 * Tables de pseudonymisation JETABLES, posées ici (TF-0957) : ce banc n'hérite jamais des tables du canal.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { relever, motifExclusion, messageAQualifier, masquesDe, masquerAdresses } from "./adresses-ip.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const egal = (vu, attendu) => { if (JSON.stringify(vu) !== JSON.stringify(attendu)) throw new Error(`relevé ${JSON.stringify(vu)}, attendu ${JSON.stringify(attendu)}`); };

const T = mkdtempSync(join(tmpdir(), "adresses-ip-"));
writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
writeFileSync(join(T, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
process.env.FORGE_NOMS_INTERDITS = join(T, "_noms-interdits.json");
process.env.FORGE_PRODUITS_PSEUDO = join(T, "_produits-pseudonymes.json");
const { accueillir } = await import("./accueillir-lot.mjs");

const ROUGE_V4 = "10.213.47.9", ROUGE_V6 = "fd3c:9a1e:4b27::15";
const ROUGE = `Le poste ${ROUGE_V4} répond, et ${ROUGE_V6} aussi.`;
const VERT = "Exemples : 192.0.2.17, 198.51.100.4, 203.0.113.250, 2001:db8::7 et 2001:0db8:0:0:0:0:0:2.";

// ── le relevé, dans les deux sens ──────────────────────────────────────────────────────────────
check("rouge — une IPv4 et une IPv6 d'une plage privée inventée sont relevées, dans l'ordre", () => egal(relever(ROUGE), [ROUGE_V4, ROUGE_V6]));
check("vert — les quatre plages de documentation ne sont pas relevées", () => egal(relever(VERT), []));
check("vert — le bouclage (127.0.0.0/8, ::1) n'est pas relevé", () => egal(relever("127.0.0.1, 127.4.5.6 et ::1"), []));
check("vert — un numéro de version à quatre composants AVEC son contexte n'est pas relevé",
  () => egal(relever("version 1.2.3.4, v10.4.1.2, paquet@4.3.2.1, build 7.1.0.3, 1.2.3.4-rc1, 2.0.0.1+build.7"), []));
check("vert — heure, horodatage, adresse MAC, `::` de code, octet hors borne, cinq composants : aucune adresse",
  () => egal(relever("12:30:45, 2026-09-15T12:35:15.527Z, aa:bb:cc:dd:ee:ff, std::vector, a::before, 300.1.2.3, 1.2.3.4.5"), []));
check("borne DÉCLARÉE — une version à quatre composants SANS contexte est relevée : un humain la qualifie",
  () => egal(relever("le correctif 4.18.2.1 est déployé"), ["4.18.2.1"]));
check("une IPv6 mixte est relevée une fois, pas doublée de sa fin IPv4 ; une adresse entre crochets est vue",
  () => egal(relever(`::ffff:${ROUGE_V4} puis [${ROUGE_V6}]:8080`), [`::ffff:${ROUGE_V4}`, ROUGE_V6]));
check("le masque de D-15 (a) est reconnu sous sa forme posée, et une mention libre ne l'est pas", () => {
  egal(masquesDe("poste [adresse IP du poste, masquée le 15/09/2026] et [adresse IP du poste, masquée le 15/09/2026]"), ["[adresse IP du poste, masquée le 15/09/2026]"]);
  egal(masquesDe("[adresse IP masquée] ou adresse IP du poste, masquée le 15/09/2026"), []);
});
check("masquerAdresses remplace chaque occurrence à qualifier, et rien d'autre (documentation laissée en clair)", () => {
  const m = "[adresse IP du poste, masquée le 15/09/2026]";
  const t = `${ROUGE} Relance ${ROUGE_V4}. ${VERT}`;
  const attendu = `Le poste ${m} répond, et ${m} aussi. Relance ${m}. ${VERT}`;
  if (masquerAdresses(t, m) !== attendu) throw new Error(`masqué : ${masquerAdresses(t, m)}`);
  egal(relever(masquerAdresses(t, m)), []);
});
check("les motifs d'exclusion sont nommés", () => {
  egal([motifExclusion("203.0.113.9"), motifExclusion("2001:db8::7"), motifExclusion("::1"), motifExclusion("127.0.0.1"), motifExclusion(ROUGE_V4)],
    ["documentation", "documentation", "bouclage", "bouclage", null]);
});

// ── l'accueil : les adresses NOMMÉES, lot par lot ─────────────────────────────────────────────
check("accueil rouge — le lot déposé porte ses adresses à qualifier, et le message d'écran les nomme", () => {
  const arr = join(T, "a1", "_arrivee"), bo = join(T, "a1", "boite");
  mkdirSync(arr, { recursive: true });
  writeFileSync(join(arr, "Produit-09 - RETOURS - 20260915a.md"), `${ROUGE}\n${VERT}\n`, "utf8");
  const f = accueillir({ arrivee: arr, boite: bo }).faits[0];
  egal(f.adresses_ip_a_qualifier, [ROUGE_V4, ROUGE_V6]);
  const m = messageAQualifier(f.adresses_ip_a_qualifier, f.vers);
  if (!m || !m.includes(ROUGE_V4) || !m.includes(ROUGE_V6) || !/\[ADRESSES IP À QUALIFIER\] 2 /.test(m)) throw new Error(`message : ${m}`);
});
check("accueil vert — un lot aux seules adresses de documentation n'a rien à qualifier, et aucun message", () => {
  const arr = join(T, "a2", "_arrivee"), bo = join(T, "a2", "boite");
  mkdirSync(arr, { recursive: true });
  writeFileSync(join(arr, "Produit-09 - RETOURS - 20260915b.md"), `${VERT}\n`, "utf8");
  const f = accueillir({ arrivee: arr, boite: bo }).faits[0];
  egal(f.adresses_ip_a_qualifier, []);
  if (messageAQualifier(f.adresses_ip_a_qualifier, f.vers) !== null) throw new Error("un message sans adresse");
});

// ── l'ingestion : NOMMÉES à l'écran, COMPTÉES à l'événement, jamais écrites dans celui-ci ────
const PARC = join(T, "parc");
mkdirSync(PARC, { recursive: true });
const ENV = { ...process.env, FORGE_ROOT: PARC };
const BASE = JSON.stringify({ ev: "creation", ts: "2026-08-20T10:00:00.000Z", id: "TF-0001", titre: "t", contenu: "c", demandeur: "pilot", source: "s", date_demande: "2026-08-20", statut: "candidat", forges_cibles_initiales: ["digit-ai-factory"], score: { gain: 3, preuve: 1, effort: 1, valeur: 3 } }) + "\n";
let serie = 0;
const ingerer = (contenu) => {
  const registre = join(T, `reg-${++serie}.jsonl`);
  writeFileSync(registre, BASE, "utf8");
  const sidecar = join(T, `revue-adresses-2026091${serie}a.tf.jsonl`);
  writeFileSync(sidecar, JSON.stringify({ schema: 1, titre: "pilot : un retour de recette", contenu, demandeur: "pilot", source: "banc", date_demande: "2026-09-15", forges_cibles_initiales: ["digit-ai-factory"] }) + "\n", "utf8");
  const r = spawnSync(process.execPath, [join(ICI, "ingerer-lot.mjs"), sidecar, "--registre", registre, "--sans-fetch"], { encoding: "utf8", env: ENV });
  const evs = readFileSync(registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), ing: evs.find((e) => e.ev === "ingestion") };
};
check("ingestion rouge — deux adresses privées : nommées à l'écran, comptées à l'événement, jamais écrites dedans", () => {
  const r = ingerer(ROUGE);
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 (avertissement, jamais un refus) : ${r.sortie.slice(0, 300)}`);
  if (!/\[ADRESSES IP À QUALIFIER\] 2 /.test(r.sortie) || !r.sortie.includes(ROUGE_V4) || !r.sortie.includes(ROUGE_V6)) throw new Error(`relevé absent ou faux : ${r.sortie.slice(0, 400)}`);
  if (!r.ing || r.ing.adresses_ip_a_qualifier !== 2) throw new Error(`événement d'ingestion : ${JSON.stringify(r.ing)}`);
  if (JSON.stringify(r.ing).includes(ROUGE_V4) || JSON.stringify(r.ing).includes(ROUGE_V6)) throw new Error("l'événement d'ingestion porte une ADRESSE — il ne doit porter que le nombre");
});
check("ingestion verte — des adresses de documentation seulement : ni message, ni compteur", () => {
  const r = ingerer(VERT);
  if (/\[ADRESSES IP À QUALIFIER\]/.test(r.sortie)) throw new Error(`faux positif : ${r.sortie.slice(0, 300)}`);
  if (!r.ing || r.ing.adresses_ip_a_qualifier) throw new Error(`compteur posé à tort : ${JSON.stringify(r.ing)}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nadresses-ip (TF-1134) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
