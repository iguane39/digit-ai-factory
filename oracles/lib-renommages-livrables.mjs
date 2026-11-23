/**
 * lib-renommages-livrables.mjs — LE RENVOI D'UN LIVRABLE RENOMMÉ : DE L'ANCIEN CHEMIN AU NOUVEAU (TF-2737, D-236 (a) du 23/11/2026).
 *
 * LE FAIT. Le 14/11/2026, chez un produit, un autre processus a renommé la revue de l'indice g en k sans trace ; la restitution suivante liait un chemin
 * disparu. D-236 (a) : un hook refuse `mv` et `git mv` sous `output/`, un script (`scripts\renommer-livrable.mjs`) renomme, trace et laisse un renvoi.
 *
 * CE QUE LE RENVOI EST. Pas un fichier laissé sous l'ancien nom (il rouvrirait deux versions du même livrable dans le dossier, R-4 et R-7 bis) : la ligne de
 * trace elle-même, `ancien` → `nouveau`, que ce module relit. Trois endroits, lus ensemble :
 *   - au pilot, `references/RENOMMAGES-LIVRABLES.jsonl` (déjà écrit par `scripts\ranger-dossiers.mjs`, le plafond de chemin de R-4) ;
 *   - chez un produit, `forge/ledger.jsonl`, les entrées `deplacement_effectue` qui portent `ancien` et `nouveau` (le type existe dans `forge/ledger.py` et
 *     dans `ledger.mjs` de forge-agents ; R-7 bis le prescrit déjà pour le déplacement d'une version remplacée vers `old\`) ;
 *   - chez un produit sans ledger de run, `forge/renommages-livrables.jsonl`, repli déclaré de `scripts\renommer-livrable.mjs` (même forme que le journal du pilot).
 * `suivreRenommage` suit la chaîne (a → b → c) jusqu'au chemin courant, en gardant un cycle (a → b → a) de boucler.
 *
 * QUI LIT. `oracles\hook-restitution.mjs` : un livrable écrit puis renommé dans le tour se lie sous son nom courant, et la ligne « Livré : » n'est plus
 * refusée parce que le chemin écrit a disparu. `node scripts\renommer-livrable.mjs --suivre <chemin>` : le renvoi à la main.
 *
 * NON JUGÉ, dit : un renommage fait sans le script (le hook le refuse sous `output/`, mais un script tiers, un explorateur de fichiers ou un autre outil le
 * fait sans trace : rien ne le retrouve que le nom ou le jeton `AAAAMMJJ<indice>` que `hook-restitution` cherche déjà dans le dossier).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const JOURNAL_PILOT = "references/RENOMMAGES-LIVRABLES.jsonl";
export const LEDGER_PRODUIT = "forge/ledger.jsonl";
export const JOURNAL_PRODUIT = "forge/renommages-livrables.jsonl";
/** Le pilot se reconnaît à son registre, comme dans `hook-lecons.mjs` et `hook-gestes-distants.mjs`. */
export const estPilot = (racine) => existsSync(join(racine, "todo", "TODO.jsonl"));

const versSlash = (p) => String(p || "").replace(/\\/g, "/");
/** La clé de comparaison d'un chemin : barres obliques, sans `./`, NFC, minuscules (la graphie d'un chemin Windows écrit à la main n'est pas celle de git). */
export const cleDeRenvoi = (p) => versSlash(p).replace(/^\.\//, "").normalize("NFC").toLowerCase();

/** Le chemin relatif depuis la racine du dépôt, à partir du premier segment `output/` : même lecture que `cibleDuLivrable` de `hook-restitution`. null hors `output/`. */
export function relatifSousOutput(chemin) {
  const p = versSlash(chemin);
  const m = /(?:^|\/)output\//i.exec(p);
  return m ? p.slice(m[0].startsWith("/") ? m.index + 1 : m.index) : null;
}

function lignesJson(fichier) {
  let texte = "";
  try { texte = readFileSync(fichier, "utf8"); } catch { return []; }
  const sortie = [];
  for (const l of texte.split("\n")) {
    if (!l.trim()) continue;
    try { sortie.push(JSON.parse(l)); } catch { /* ligne illisible : ignorée, un journal ne s'arrête pas sur elle */ }
  }
  return sortie;
}

/** Les renvois lus : clé de l'ancien chemin → { ancien, nouveau, ts, source }. Une ligne plus tardive remplace une plus ancienne de même ancien chemin. */
export function lireRenvois(racine) {
  const renvois = new Map();
  const prendre = (e, source) => {
    const ancien = versSlash(e.ancien), nouveau = versSlash(e.nouveau);
    if (!ancien || !nouveau || cleDeRenvoi(ancien) === cleDeRenvoi(nouveau)) return;
    renvois.set(cleDeRenvoi(ancien), { ancien, nouveau, ts: e.ts || null, source });
  };
  for (const e of lignesJson(join(racine, JOURNAL_PILOT))) prendre(e, JOURNAL_PILOT);
  for (const e of lignesJson(join(racine, JOURNAL_PRODUIT))) prendre(e, JOURNAL_PRODUIT);
  for (const e of lignesJson(join(racine, LEDGER_PRODUIT))) if (String(e.type || e.ev || "") === "deplacement_effectue") prendre(e, LEDGER_PRODUIT);
  return renvois;
}

/**
 * Suit le renvoi d'un chemin (relatif à la racine, ou complet) jusqu'au chemin courant. Rend { chemin (relatif, barres obliques), complet, etapes } ou null
 * quand aucun renvoi ne part de ce chemin. Ne regarde pas le disque : savoir si le fichier courant existe encore est l'affaire de l'appelant.
 */
export function suivreRenommage(racine, chemin) {
  const depart = relatifSousOutput(chemin);
  if (!racine || !depart) return null;
  const renvois = lireRenvois(racine);
  if (!renvois.size) return null;
  let courant = depart, etapes = 0;
  const vus = new Set([cleDeRenvoi(depart)]);
  while (etapes < 50) {
    const r = renvois.get(cleDeRenvoi(courant));
    if (!r) break;
    if (vus.has(cleDeRenvoi(r.nouveau))) { courant = depart; etapes = 0; break; }   // a → b → a : le fichier est revenu, il n'y a rien à suivre
    courant = r.nouveau;
    vus.add(cleDeRenvoi(courant));
    etapes++;
  }
  return etapes ?{ chemin: courant, complet: join(racine, ...courant.split("/")), etapes } : null;
}
