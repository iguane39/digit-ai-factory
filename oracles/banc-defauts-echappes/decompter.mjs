#!/usr/bin/env node
/**
 * decompter.mjs — décompte d'un jugement à l'aveugle sur le banc des défauts échappés (TF-1073).
 *
 * Lit la sortie brute du juge (une ligne « E-NN L# n R|A|F — raison » par constat) et la clé
 * L1..Ln → code de condition, puis calcule par condition : le rappel (livrables où au moins un
 * constat est R), les R, A, F et les A « proches ». Applique le seuil figé par le protocole du
 * 14/09/2026 : une condition candidate est retenue si son rappel atteint celui de la référence
 * + `plus_livrables`, sans dépasser `facteur_faux` fois ses constats faux.
 *
 * Usage : node decompter.mjs --jugement <sortie.txt> --cle <cle.json> [--manifeste <manifeste.json>]
 * Exit : 0 décompté · 2 entrée illisible.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

export function decompter(texte, cle, seuil = { plus_livrables: 2, facteur_faux: 2, reference: "B" }) {
  const codes = [...new Set(Object.values(cle).flatMap((m) => Object.values(m)))];
  const par = Object.fromEntries(codes.map((c) => [c, { n: 0, R: 0, A: 0, F: 0, proche: 0, livrables: new Set() }]));
  const vus = new Set();
  const re = /^\s*`?(E-\d+)\s+(L\d+)\s+(\d+)\s+([RAF])\b\s*[—-]?\s*(.*?)`?\s*$/gm;
  for (const [, id, L, num, etiquette, raison] of texte.matchAll(re)) {
    const k = `${id} ${L} ${num}`;
    if (vus.has(k)) continue; // une étiquette par constat : la première fait foi
    vus.add(k);
    const c = cle[id]?.[L];
    if (!c) throw new Error(`clé inconnue : ${id} ${L}`);
    const p = par[c];
    p.n++;
    p[etiquette]++;
    if (etiquette === "A" && /proche/i.test(raison)) p.proche++;
    if (etiquette === "R") p.livrables.add(id);
  }
  const total = Object.keys(cle).length;
  const ref = par[seuil.reference];
  if (!ref) throw new Error(`condition de référence « ${seuil.reference} » absente de la clé`);
  const seuilRappel = ref.livrables.size + seuil.plus_livrables;
  const plafondFaux = seuil.facteur_faux * ref.F;
  const resultat = {};
  for (const c of codes) {
    const p = par[c];
    resultat[c] = {
      constats_juges: p.n, rappel: p.livrables.size, sur: total, livrables_retrouves: [...p.livrables].sort(),
      R: p.R, A: p.A, A_proches: p.proche, F: p.F,
      retenu: c === seuil.reference ? "référence" : (p.livrables.size >= seuilRappel && p.F <= plafondFaux ? "oui" : "non"),
    };
  }
  return { seuil_rappel: seuilRappel, plafond_faux: plafondFaux, sur: total, constats_juges: vus.size, resultat };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (nom) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : null; };
  try {
    const manifeste = JSON.parse(readFileSync(arg("--manifeste") || join(ICI, "manifeste.json"), "utf8"));
    const texte = readFileSync(arg("--jugement") || join(ICI, "jugement-20260914", "sortie.txt"), "utf8");
    const cle = JSON.parse(readFileSync(arg("--cle") || join(ICI, "jugement-20260914", "cle.json"), "utf8"));
    console.log(JSON.stringify(decompter(texte, cle, manifeste.seuil), null, 1));
  } catch (e) {
    console.error(`[banc] entrée illisible : ${e.message}`);
    process.exit(2);
  }
}
