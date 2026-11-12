#!/usr/bin/env node
/**
 * banc-agent-factice.mjs — LA CHARGE D'UN AGENT DE BANC DU SUIVI DES AGENTS (prompt 20261112g, ÉTAPE 5).
 *
 * Un agent factice n'a qu'une tâche : attendre en écrivant un avancement de test. Il lance cette commande au premier plan,
 * une seule fois ; elle écrit son fichier d'avancement (une ligne JSON ajoutée, jamais réécrite, au format de la section
 * « Avancement des campagnes longues » de gabarits/AGENT-CAMPAGNE.md) selon le scénario, puis rend la main.
 *
 *   e2e       35 min, une ligne toutes les 3 min (12 étapes) ;
 *   fige      une ligne toutes les 3 min jusqu'à 12 min, puis plus rien, attente muette jusqu'à 40 min ;
 *   commande  une ligne qui annonce une commande de 20 min et sa fin attendue, silence, une ligne de fin à 21 min ;
 *   court     10 min, une ligne toutes les 3 min.
 *
 * `--minute-ms <n>` accélère l'horloge (bancs unitaires seulement, déclaré). Aucune écriture hors du fichier nommé.
 * Usage : node scripts/banc-agent-factice.mjs --scenario e2e|fige|commande|court --avancement <chemin.jsonl> [--minute-ms 60000]
 */
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const opt = (n, d = null) => { const i = process.argv.indexOf(n); return i > 1 ? process.argv[i + 1] : d; };
const scenario = opt("--scenario");
const fichier = opt("--avancement");
const MIN = Number(opt("--minute-ms", "60000"));
const SCENARIOS = {
  e2e: { duree: 35, ecrireJusqua: 35 },
  fige: { duree: 40, ecrireJusqua: 12 },
  commande: { duree: 21, commande: 20 },
  court: { duree: 10, ecrireJusqua: 10 },
};
const s = SCENARIOS[scenario];
if (!s || !fichier) { console.error("usage : --scenario e2e|fige|commande|court --avancement <chemin.jsonl>"); process.exit(2); }
mkdirSync(dirname(fichier), { recursive: true });
const debut = Date.now();
const etapes = Array.from({ length: Math.ceil(s.duree / 3) }, (_, i) => `étape ${i + 1}`);
const emettre = (o) => appendFileSync(fichier, JSON.stringify({ ts: new Date().toISOString(), debut: new Date(debut).toISOString(), scenario, ...o }) + "\n");
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

if (s.commande) {
  const fin = new Date(debut + s.commande * MIN);
  emettre({ faits: [], restants: ["commande de banc"], commande: `commande de banc de ${s.commande} min`, fin_attendue: fin.toISOString() });
  await dormir(s.duree * MIN);
  emettre({ faits: ["commande de banc"], restants: [], fin: true });
} else {
  let n = 0;
  for (;;) {
    const ecoule = (Date.now() - debut) / MIN;
    if (ecoule >= s.duree) break;
    // « cesse toute écriture à 12 minutes » : la ligne de la 12e minute s'écrit (relevé le 12/11/2026 : sans la marge d'une
    // demi-minute, la dernière ligne tombait à 9 min et le point de 15 min disait « silencieux » au lieu d'« actif »).
    if (ecoule < s.ecrireJusqua + 0.5) {
      emettre({ faits: etapes.slice(0, n), restants: etapes.slice(n), en_cours: etapes[n] || null });
      n++;
    }
    const prochaine = Math.min(3 * MIN, (s.duree - ecoule) * MIN);
    await dormir(prochaine);
  }
  if (s.ecrireJusqua >= s.duree) emettre({ faits: etapes, restants: [], fin: true });
}
console.log(`FIN ${scenario} après ${((Date.now() - debut) / MIN).toFixed(1)} min`);
